"use strict";
eHnoteWebApp.controller("UsEOBandPaymentPostingCtrl", ["$scope", "$rootScope", "$location", "$filter", "alertify", "$uibModal", "datapersistanceFactory", "$q", "$timeout", "eHnoteMasterDataService", "eHnoteLoginStatusService", "eHnoteCacheStorageService", "eHnoteInsuranceService", "eHnoteSettingsDataService", "eHnotePatientDataService", "eHnoteUserDataService", "InventoryService", "eHnoteMainAdminServices", "$window", function ($scope, $rootScope, $location, $filter, alertify, $uibModal, datapersistanceFactory, $q, $timeout, eHnoteMasterDataService, eHnoteLoginStatusService, eHnoteCacheStorageService, eHnoteInsuranceService, eHnoteSettingsDataService, eHnotePatientDataService, eHnoteUserDataService, InventoryService, eHnoteMainAdminServices, $window) {

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

    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
    var currentdate = $filter('date')(new Date(), "MM-dd-yyyy");
    console.log($scope.mainBillerDataObj);

    $scope.ClaimProviderList = [];
    $scope.ClaimProviderList = $scope.mainBillerDataObj.BillingProviderList || [];
    $scope.FreezPostingTab = 1;
    $scope.FreezProcesstypeid = 0;
    $scope.GetEOBPaymentPostingObj = function () {
        let Obj = {
            "UserId": $scope.UserId,
            "OrganizationId": $scope.HospitalId,
            "EOBId": 0,
            "EraId": 0,
            "PostingDate": null,
            "EOBName": "",
            "EOBTypeId": 1,
            "EOBType": "Insurance Payment",
            "PaymentMethodId": "",
            "PaymentMethod": "",
            "ProcessingTypeId": 1,
            "ProcessingType": "Manual",
            "EOBCategory": "",
            "PaymentReceivedAt": "",
            "PaymentFormatCode": "",
            "PaymentDate": null,
            "ReferenceNumber": "",
            "PayorName": "",
            "PayorAddress": "",
            "PayorId": "",
            "OrganizationPayorId": "",
            "OrganizationBillingProviderId": "",
            "BillingProviderName": "",
            "BillingProviderNPI": "",
            "TotalPaymentAmount": 0,
            "TotalAllowedAmount": 0,
            "TotalDeductAmount": 0,
            "TotalCoInsuranceAmount": 0,
            "TotalAdjustmentAmount": 0,
            "TotalWriteOffAmount": 0,
            "TotalPatientResponsibilityAmount": 0,
            "TotalDeniedAmount": 0,
            "TotalPatientResponsibilityWriteOffAmount": 0,
            "TotalAppliedAmount": 0,
            "TotalUnAppliedAmount": 0,
            "CurrentTotalUnAppliedAmount": 0,
            "TotalZeroLineItems": 0,
            "TotalDeniedLineItems": 0,
            "PayerIdentifier": "",
            "FederalTaxPayersIdentificationNumber": "",
            "ClaimPaymentInfo": "",
            "ReceiptNumber": "",
            "ReceiptId": 0,
            "EOBFileId": 0,
            "EOBFileName": "",
            "EOBFileS3URL": "",
            "EDIFileId": 0,
            "EDIFileName": "",
            "EDIFileS3URL": "",
            "DepositedBy": "",
            "DepositDate": null,
            "Notes": "",
            "DepositStatus": "All",
            "DepositStatusId": 0,
            "DeleteInd": "N",
            "DocumentDetails": [],
            "TempDocumentDetails": [],
            "PayorObj": null,
            "IsShowSummaryScreen": false,
            "isSummaryPanelOpen ": false,
            "IsShowEOBAddingScreen": false,
            "IsShowAssociatedClaims": false,
            "IsShowAddAssociatedClaims": false,
            "IsShowEOBListScreen": false,
            "IsEOBEditModeInd": false,
            "IsDataAdded": false,
            "AppliedStatus": "",
            "DepositStatusName": "",
            "BillPaymentTypeId": "",
            "BillingProvidersdata": "",
            "BillingProvidersList": [],
            "PageSize": 50,
            "PageNumber": 1,
            "PayerAdjAmount": 0,
            "IsChecked": false,
            "IsNonPayment": false,
            "IsCapitationInd ": false,
            "CapitationDiscount ": 0,
            "IsExternalSystemPosted ": false,
            "ExternalSystemPostedAmount ": 0,
            "PayerIdentificationNo": "",
            "PrimaryBillerId": null,
            "PrimaryBillerName": '',
            "PrimaryBillerNPI": '',
            "ModifiedDt": '',
            "ModifiedTime": '',
            "ModifiedName": '',
            "CreatedName": '',
            "CreatedDt": '',
            "CreatedTime": '',
            "RetentionTaxAmount": 0,
            "RetentionAdjustmentId1": 0,
            "RetentionAdjustmentReason1": "",
            "RetentionAdjustmentAmount1": 0,
            "RetentionAdjustmentId2": 0,
            "RetentionAdjustmentReason2": "",
            "RetentionAdjustmentAmount2": 0,
            "RetentionOtherAdjAmount": 0,
            "NotReconciledAmount": 0,
            "TotalPaymentToProvAmount": 0,
            "TotalGlobalRetentionAmount": 0,
            "TotalTaxAmount": null,
            "ProviderAdjustmentList": [],

        }
        return Obj;
    };

    $scope.mainEOBPaymentPostingObj = $scope.GetEOBPaymentPostingObj();


    var mObj = datapersistanceFactory.getItem("masterDataArrays");

    $scope.masterDepositStatus = [];
    $scope.masterSettlementStatus = [];
    $scope.masterPaymentModes = [];
    if (mObj.PaymentModes && mObj.PaymentModes.length > 0) {
        angular.forEach(mObj.PaymentModes, function (pobj) {
            /*if (pobj.PaymentModeId === 5 || pobj.PaymentModeId === 6 || pobj.PaymentModeId === 7) {*/
            if (pobj.PaymentModeId === 1 || pobj.PaymentModeId === 2 || pobj.PaymentModeId === 3 || pobj.PaymentModeId === 5 || pobj.PaymentModeId === 7 || pobj.PaymentModeId === 12) {
                pobj.PaymentMethodId = pobj.PaymentModeId;
                $scope.masterPaymentModes.push(pobj);
            }
        });
    }
    if (mObj.DepositStatus && mObj.DepositStatus.length > 0) {
        angular.forEach(mObj.DepositStatus, function (item) {
            if (item.DepositStatusId === 1 || item.DepositStatusId === 2) {
                $scope.masterDepositStatus.push(item);
            }
        });
    }
    if (mObj.SettlementStatus && mObj.SettlementStatus.length > 0) {
        angular.forEach(mObj.SettlementStatus, function (item) {
            if (item.SettlementStatusId === 1 || item.SettlementStatusId === 2 || item.SettlementStatusId === 3) {
                $scope.masterSettlementStatus.push(item);
            }
        });
    }

    $scope.GetEOBSearchObject = function () {
        var obj = {
            "PayorObj": null,
            "PostingFromDate": null,
            "PostingToDate": null,
            "DepositFromDate": null,
            "DepositToDate": null,
            "DepositStatusId": "",
            "OrganizationBillingProviderId": "",
            "BillPaymentTypeId": "",
            "AppliedStatusId": "",
            "ReferenceNumber": "",
            "SortByName": "",
            "SortById": null,
            "PaymentMethodId": "",
            "PatientClaimNumber": "",
            "PostingPaymentTab": 1,
            "ProcessingTypeId": 0,
            "PaymentStatusId": 0,
            "PageNumber": 1,
            "PageSize": 100
        }
        return obj;
    }

    $scope.EOBSearchObj = $scope.GetEOBSearchObject();

    $scope.GetSortByFilterList = [
        {
            "SortByName": "Posting Date Asc",
            "SortById": 1
        },
        {
            "SortByName": "Posting Date Desc",
            "SortById": 2
        },
        {
            "SortByName": "Deposit Date Asc",
            "SortById": 3
        },
        {
            "SortByName": "Deposit Date Desc",
            "SortById": 4
        },
        {
            "SortByName": "Bill Amount Asc",
            "SortById": 5
        },
        {
            "SortByName": "Bill Amount Desc",
            "SortById": 6
        },
    ];

    $scope.clickEobPaymentPostingpopup = function () {
        let mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/UsEOBandPaymentPostingPopup.html",
            //"size": "lg",
            "backdrop": "static",
            "keyboard": false,
            "scope": $scope,
            "windowClass": "offcanves-right",
            "controller": function ($scope, $uibModal, $uibModalInstance) {
                $scope.uibclose = function () {
                    $uibModalInstance.dismiss("cancel");
                };
            }
        });
    };
    $scope.openAddAssociatedClaims = function (Id) {

        if ($scope.mainEOBPaymentPostingObj.DepositStatusId === 2) {
            alertify.error("Please change the 'Pending' status to 'Deposited' status.");
            return false;
        }

        let obj = {
            "EOBId": $scope.mainEOBPaymentPostingObj.EOBId,
            "IsCapitationInd": $scope.mainEOBPaymentPostingObj.IsCapitationInd || false,
            "CapitationDiscount": $scope.mainEOBPaymentPostingObj.CapitationDiscount || null,
            "PayorId": $scope.mainEOBPaymentPostingObj.PayorId || 0,
            "OrganizationPayorId": $scope.mainEOBPaymentPostingObj.OrganizationPayorId || 0,
            "BillingProvidersList": $scope.mainEOBPaymentPostingObj.BillingProvidersList || [],
            "OrganizationFacilityList": $scope.OrganizationFacilityList || [],
            "AllBranchesList": $scope.mainBillerDataObj.AllBranchesList || [],
            "mainBillerDataObj": $scope.mainBillerDataObj || '',
            "PostedValue": Id,
            "TotalUnAppliedAmount": $scope.mainEOBPaymentPostingObj.TotalUnAppliedAmount
        }

        if (obj.BillingProvidersList.length == 0) {
            obj.BillingProvidersList = $scope.mainBillerDataObj.BillingProviderList || [];
        }


        //if ($scope.mainEOBPaymentPostingObj.TotalUnAppliedAmount == 0) {    // Code commented on 23-07-2025 by Vinay due to reversal cases.
        //    alertify.error("There is no check balance to add claims.");
        //}
        //  else {
        let mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/AddAssociatedClaimsPopup.html",
            //"size": "lg",
            "backdrop": "static",
            "keyboard": false,
            "resolve": {
                "EOBObj": function () { return obj; }
            },
            "windowClass": "modal__ninety--",
            "controller": function ($scope, $uibModal, $uibModalInstance, eHnoteMasterDataService, InventoryService, eHnotePatientDataService, alertify, EOBObj) {
                var doctorinfo = eHnoteMasterDataService.getUserInfo();
                if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
                    $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
                    $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
                    $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
                    $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
                };
                $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
                $scope.UserId = eHnoteMasterDataService.getLoginId();
                $scope.EOBObj = EOBObj;
                $scope.OrgClaimListdata = [];
                $scope.uibclose = function () {
                    $uibModalInstance.dismiss("cancel");
                };
                function getSelectedPatientData() {
                    var obj = {
                        "SearchText": "",
                        "PatienClaimNumber": "",
                        "PatientId": 0,
                        "SearchTypeId": 2
                    }
                    return obj;
                };

                $scope.setFilter = function (type) {
                    $scope.EOBfilterObj.Type = type;
                    let cfg = $scope.filterConfig[type];
                    $scope.filterObj = {
                        label: cfg.label,
                        placeholder: cfg.placeholder,
                        type: cfg.type,
                        key: type,
                        npiModel: $scope.EdtERAListObj[cfg.npiModel],
                        model: $scope.EdtERAListObj[cfg.model]
                    };

                    $scope.activePopover = ($scope.activePopover === type) ? null : type;

                };
                $scope.activePopover = null;

                $scope.closeFilter = function () {
                    $scope.activePopover = null;
                };

                $scope.ERAPaymentDateSortOrder = function (val) {
                    $scope.EOBfilterObj.SortType = val;
                    $scope.EOBfilterObj.SortBy = (val === 2) ? 'Desc' : 'Asc';                    
                    $scope.SearchAssociatClaimList();
                };

                $scope.SearchDynamicFilter = function (label, val) {
                    val = val || "";
                    if (label == 1) {
                        $scope.EdtERAListObj.PayerName = val;
                    } else if (label == 2) {
                        $scope.EdtERAListObj.TransactionNumber = val;
                    } else if (label == 3) {
                        $scope.EdtERAListObj.PaymentFrom = val;
                        $scope.EdtERAListObj.PaymentTo = val;
                    } else if (label == 4) {
                        $scope.EdtERAListObj.PostingFrom = val;
                        $scope.EdtERAListObj.PostingTo = val;
                    } else if (label == 5) {
                        $scope.EdtERAListObj.BillingProviderName = val || "";
                        $scope.EdtERAListObj.BillingProviderNPI = $scope.filterObj.npiModel || "";
                    } else {
                        val = val || 0;
                        $scope.EdtERAListObj.TotalPaidAmount = parseFloat(val).toFixed(2);
                    }
                    $scope.SearchERAListData();
                    $scope.activePopover = null;
                }


                $scope.filterConfig = {
                    InsuranceBls: { label: 1, placeholder: '', model: 'InsuranceBls', type: 'text' },
                    PatientBls: { label: 2, placeholder: '', model: 'PatientBls', type: 'text' },
                
                };


                $scope.EOBfilterObj = {
                    "OrganizationId": $scope.HospitalId,
                    "OrganizationPayorId": $scope.EOBObj.OrganizationPayorId,
                    "EOBId": $scope.EOBObj.EOBId,
                    "PayorId": $scope.EOBObj.PayorId,
                    "PageSize": 100,
                    "PageNumber": 1,
                    "PatientId": null,
                    "PatienClaimNumber": null,
                    "PatientMRNo": "",
                    "Type": "DOS",
                    "SortBy": null,
                    "SortType": 1,
                }

                $scope.dynamicERAPaymentSort = {
                    templateUrl: 'dynamicERAPaymentSort.html',
                    "scope": $scope
                };
                $scope.dynamicERAListfilters = {
                    templateUrl: 'dynamicERAListfilters.html',
                    "scope": $scope
                };


                $scope.SearchAssociatClaimList = function () {
                    let Pobj = {
                        "OrganizationId": $scope.EOBfilterObj.OrganizationId,
                        "OrganizationPayorId": $scope.EOBfilterObj.OrganizationPayorId,
                        "EOBId": $scope.EOBfilterObj.EOBId,
                        "PayorId": $scope.EOBfilterObj.PayorId,
                        "PageSize": $scope.EOBfilterObj.PageSize,
                        "PageNumber": $scope.EOBfilterObj.PageNumber,
                        "PatientId": $scope.EOBfilterObj.PatientId,
                        "PatienClaimNumber": $scope.EOBfilterObj.PatienClaimNumber,
                        "PatientMRNo": $scope.EOBfilterObj.PatientMRNo,
                        "Type": $scope.EOBfilterObj.Type,
                        "SortBy": $scope.EOBfilterObj.SortBy,
                        "SortType": $scope.EOBfilterObj.SortType,
                    }

                    eHnoteInsuranceService.GetOrganizationClaimsListInPosting(Pobj).then(function (resp) {
                        if (resp.data.rows.length > 0) {
                            $scope.OrgClaimListdata = resp.data.rows || [];
                        }
                    });
                }

                let Pobj = {
                    "OrganizationId": $scope.HospitalId,
                    "OrganizationPayorId": $scope.EOBObj.OrganizationPayorId,
                    "EOBId": $scope.EOBObj.EOBId,
                    "PayorId": $scope.EOBObj.PayorId,
                    "PageSize": $scope.EOBfilterObj.PageSize,
                    "PageNumber": $scope.EOBfilterObj.PageNumber,
                    "PatientId": null,
                    "PatienClaimNumber": null,
                    "PatientMRNo": "",
                    "Type": "DOS",
                    "SortBy": null,
                    "SortType": 1,
                }
                //$q.all([

                //    // eHnoteSettingsDataService.GetMasterPaymentAdjustmentCodes($scope.ParenthospitalId),
                //    eHnoteInsuranceService.GetOrganizationClaimsListInPosting(Pobj),
                //]).then(function (resp) {

                //    //if (resp[0].data.rows.length !== 0) {
                //    //    $scope.PaymentReasonList = resp[0].data.rows || [];
                //    //    if ($scope.PaymentReasonList.length > 0) {
                //    //        angular.forEach($scope.PaymentReasonList, function (item) {
                //    //            item.AdjsutmentDescription = item.GroupCode + '-' + item.AdjustmentReasonCode + '-' + item.AdjsutmentReasonDescription;
                //    //        });
                //    //    }
                //    //    $scope.AdjustmentCodeTypes = resp[0].data.AdjustmentCodeTypes || [];
                //    //}
                //    if (resp[0].data.rows.length > 0) {
                //        $scope.OrgClaimListdata = resp[0].data.rows || [];
                //    }
                //});
                $scope.Selectedobj = {
                    "IsChecked": false,
                }
                $scope.PatientSearchdata = getSelectedPatientData();

                $scope.Pagination = { "PageNo": 1, "PageSize": 20, "maxsize": 10, "Count": 0 };

                $scope.LoadPatientSearch = function (val) {


                    if (val == undefined || val == null || val == "") {
                        $scope.AllPatientList = [];
                        $scope.PatientSearchdata.PatientId = 0;
                        $scope.ShowPatientListDrop = false;
                        return false;
                    }
                    var param = {
                        "PageSize": 20,
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
                    $scope.PatientSearchdata.PatientId = 0;
                };

                $scope.changeSearchType = function (id) {
                    $scope.PatientSearchdata = getSelectedPatientData();
                    $scope.PatientSearchdata.SearchTypeId = id;
                    $scope.PatientSearchdata.PatientId = 0;
                    $scope.AllPatientList = [];
                    $scope.ShowPatientListDrop = false;
                }
                $scope.SelectedPatient = function (patietnitem) {
                    $scope.PatientSearchdata.PatientId = patietnitem.PatientID;
                    $scope.PatientSearchdata.SearchText = patietnitem.FullName;
                    $scope.AllPatientList = [];
                    $scope.ShowPatientListDrop = false;
                    $scope.SearchAllClaimDetails();
                };
                $scope.SearchAllClaimDetails = function () {

                    //$scope.OrgClaimListdata = [];

                    var Locationids = $scope.EOBObj.AllBranchesList
                        .filter(pitem => pitem.IsChecked && pitem.ClinicId !== 0)
                        .map(pitem => pitem.ClinicId)
                        .join(",");

                    var params = {
                        "OrganizationId": $scope.HospitalId,
                        "OrganizationFacilityId": 0,
                        "FromDate": null,
                        "ToDate": null,
                        "PatientId": $scope.PatientSearchdata.PatientId || 0,
                        "PatienClaimNumber": $scope.PatientSearchdata.PatienClaimNumber || "",
                        "BatchNumber": "",
                        "BillingProviderId": 0,
                        "RenderingProviderId": 0,
                        "TransmissionTypeId": 0,
                        "ClaimTypeId": 0,
                        "PayorId": 0,
                        "ClaimStatusList": "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27",
                        "PageSize": $scope.Pagination.PageSize || 20,
                        "PageNumber": $scope.Pagination.PageNo || 1,
                        "FacilityListIds": '',
                        "Locationids": Locationids || "",
                    };
                    eHnotePatientDataService.GetOrganizationClaimsList(params).then(function (resp) {
                        if (resp.data.rows.length > 0) {
                            //$scope.PatientSearchdata = getSelectedPatientData();
                            let Tempdata = resp.data.rows || [];
                            let Tempdata1 = $filter("filter")(Tempdata, function (fitem) { return fitem.PayorId != null }, true) || [];
                            $scope.Pagination.Count = resp.data.count || 0;
                            angular.forEach(Tempdata1, function (item) {
                                let filter = $filter("filter")($scope.OrgClaimListdata, function (fitem) { return fitem.PatientClaimId == item.PatientClaimId; }, true) || [];
                                if (filter.length == 0) {
                                    item.IsChecked = false;
                                    $scope.OrgClaimListdata.push(item);
                                }
                            });
                        }
                    }, function (err) {

                    });
                }



                $scope.GetClaimLineItemObj = function () {
                    let Obj = {
                        "EOBLineItemId": 0,
                        "ClaimLineItemId": 0,
                        "PatientClaimId": 0,
                        "ServiceId": 0,
                        "ServiceName": "",
                        "ServiceObj": "",
                        "ServiceCode": "",
                        "OrganizationProcedureId": null,
                        "DOSfrom": "",
                        "DOSto": null,
                        "PlaceOfServiceId": null,
                        "PlaceOfServiceName": "",
                        "UnitCharge": 0,
                        "Quantity": "",
                        "Modifier1": "",
                        "Modifier2": "",
                        "Modifier3": "",
                        "Modifier4": "",
                        "DiagnosisPointers": "",
                        "DiagnosisIds": "",
                        "ServiceAdjustments": [],
                        "DenialCodes": [],
                        "DiagnosisList": [],
                        "RevenueBillingCode": "",
                        "RevenueBillingCodeId": null,
                        "RenderingProviderId": null,
                        "TypeOfServiceId": null,
                        "TotalChargeAmount": 0,
                        "InsurancePaymentAmount": 0,
                        "AllowedAmount": 0,
                        "CoPaymentAmount": 0,
                        "AdjustmentAmount": 0,
                        "DeductibleAmount": 0,
                        "CoInsuranceAmount": 0,
                        "PatientResponsibilityAmount": 0,
                        "PatientPaymentAmount": 0,
                        "WriteOffAmount": 0,
                        "InsuranceBalance": 0,
                        "PatientBalance": 0,
                        "TotalBalance": 0,
                        "DenialCodePointers": "",
                        "DeleteInd": "N",
                        "addedDiagnosisArray": [],//temporary diagnosis not for db
                        "CurrentAllowedAmount": 0,
                        "CurrentInsurancePaymentAmount": 0,
                        "CurrentDeductibleAmount": 0,
                        "CurrentAdjustmentAmount": 0,
                        "CurrentCoInsuranceAmount": 0,
                        "CurrentCoPaymentAmount": 0,
                        "CurrentPatientResponsibilityAmount": 0,
                        "CurrentWriteOffAmount": 0,
                        "CurrentInsuranceBalance": 0,
                        "CurrentPatientBalance": 0,
                        "CurrentTotalBalance": 0,
                        "CurrentServiceAdjustmentAmount": 0,
                        "IsAllowedAmount": false,
                        "IsInsurancePaymentAmount": false,
                        "IsDeductibleAmount": false,
                        "IsAdjustmentAmount": false,
                        "IsCoInsuranceAmount": false,
                        "IsCoPaymentAmount": false,
                        "IsPatientResponsibilityAmount": false,
                        "IsWriteOffAmount": false,
                        "IsPatientBalanceReceived": false,
                        "IsPatientPaymentDone": false,




                    }
                    return Obj;
                };
                $scope.AddUpdateEOBClaim = function () {

                    let filtredobj2 = $filter("filter")($scope.OrgClaimListdata, { "IsChecked": true }) || [];
                    if (filtredobj2.length == 0) {
                        alertify.error("Please select any Service");
                        return false;
                    }

                    $scope.TotalPostedAmount = 0;
                    let ClaimsList = [];
                    //if ($scope.EOBObj.IsCapitationInd) {
                    //    if ($scope.OrgClaimListdata.length > 0) {
                    //        angular.forEach($scope.OrgClaimListdata, function (Aitem) {
                    //            Aitem.EOBClaimLineItems = [];
                    //            if (Aitem.IsChecked) {

                    //                angular.forEach(Aitem.PatientClaimLineItems, function (item) {
                    //                    let lineItemObj = $scope.GetClaimLineItemObj();
                    //                    var discountAmount = (item.TotalChargeAmount * $scope.EOBObj.CapitationDiscount) / 100;

                    //                    lineItemObj.ClaimLineItemId = item.ClaimLineItemId;
                    //                    lineItemObj.PatientClaimId = item.PatientClaimId;
                    //                    lineItemObj.ServiceId = item.ServiceId;
                    //                    lineItemObj.ServiceName = item.ServiceName;
                    //                    lineItemObj.ServiceCode = item.ServiceCode;
                    //                    lineItemObj.OrganizationProcedureId = item.OrganizationProcedureId;
                    //                    lineItemObj.DOSfrom = item.serviceDatefrom;
                    //                    lineItemObj.DOSto = item.serviceDateTo;
                    //                    lineItemObj.PlaceOfServiceId = item.PlaceOfServiceId;
                    //                    lineItemObj.UnitCharge = item.UnitCharge;
                    //                    lineItemObj.Quantity = item.Quantity;
                    //                    lineItemObj.TotalChargeAmount = item.TotalChargeAmount;
                    //                    lineItemObj.DeleteInd = 'Y';


                    //                    lineItemObj.TotalBalance = parseFloat(discountAmount.toFixed(2));
                    //                    lineItemObj.WriteOffAmount = parseFloat(discountAmount.toFixed(2));
                    //                    lineItemObj.AllowedAmount = parseFloat(item.TotalChargeAmount.toFixed(2));
                    //                    lineItemObj.InsurancePaymentAmount = parseFloat((item.TotalChargeAmount - discountAmount).toFixed(2));
                    //                    var templist = $filter("filter")($scope.PaymentReasonList, { "AdjustmentReasonCode": '151' }, true) || [];
                    //                    if (lineItemObj.ServiceAdjustments.length == 0) {
                    //                        let obj = {
                    //                            "AdjustmentId": 0,
                    //                            "EOBLineItemId": item.EOBLineItemId || 0,
                    //                            "ClaimLineItemId": item.ClaimLineItemId || "",
                    //                            "AdjustmentReasonCode": templist[0].AdjustmentReasonCode,
                    //                            "AdjsutmentDescription": templist[0].AdjsutmentDescription,
                    //                            "GroupCode": templist[0].GroupCode || '',
                    //                            "AdjustmentReasonId": templist[0].AdjustmentReasonId,
                    //                            "AdjustmentAmount": lineItemObj.WriteOffAmount || null,
                    //                            "PayorPostingStatusId": 1,
                    //                            "PayorPostingStatus": 'Adjustment',
                    //                            "Notes": "",
                    //                            "DeleteInd": "Y",
                    //                            "ActiveInd": "N",
                    //                        }
                    //                        lineItemObj.ServiceAdjustments.push(obj);
                    //                    }

                    //                    Aitem.EOBClaimLineItems.push(lineItemObj);

                    //                    Aitem.TotalPreviousInsurancePaymentAmount += Aitem.InsurancePaymentAmount || 0;
                    //                    Aitem.TotalPreviousPatientPaymentAmount += Aitem.PatientPaymentAmount || 0;
                    //                    Aitem.TotalPreviousInsuranceAdjustmentAmount += Aitem.AdjustmentAmount || 0;

                    //                })

                    //                angular.forEach(Aitem.EOBClaimLineItems, function (Bitem) {

                    //                    let ClaimTransaction = [];

                    //                    Bitem.InsurancePaymentAmount = Bitem.InsurancePaymentAmount || 0;                                        
                    //                    Bitem.WriteOffAmount = Bitem.WriteOffAmount || 0;

                    //                    if (Bitem.InsurancePaymentAmount != 0) {
                    //                        let InsurancePaymentAmount = parseFloat(Bitem.InsurancePaymentAmount) || 0;
                    //                        let Tranobj = {
                    //                            "ClaimTransactionId": 0,
                    //                            "PatientInsuranceDetailId": Aitem.PatientInsuranceDetailId,
                    //                            "ClaimLineItemId": Bitem.ClaimLineItemId,
                    //                            "OrganizationId": $scope.HospitalId,
                    //                            "TransactionDate": $filter('date')($scope.CurreDate, "yyyy-MM-dd"),
                    //                            "TransactionAmount": InsurancePaymentAmount,
                    //                            "PatientAmount": 0,
                    //                            "InsuranceAmount": InsurancePaymentAmount,
                    //                            "EOBId": $scope.EOBObj.EOBId,
                    //                            "PayorId": mainitem.PrimaryInsuranceId||"",
                    //                            "AdjustmentReasonId": null,
                    //                            "AdjustmentReasonCode": "",
                    //                            "ReferenceNumber": mainObject.ReferenceNumber,
                    //                            "TransactionTypeId": 32,
                    //                            "TransactionType": "PrimaryInsurancePayment",
                    //                            "TransactionSourceId": 1,
                    //                            "TransactionSource": "Primary Insurance",                                              
                    //                            "SettlementStatusId": 3,
                    //                            "SettlementStatus": "Fully Settled",
                    //                            "TransactionNotes": ""
                    //                        }
                    //                        ClaimTransaction.push(Tranobj);
                    //                    }

                    //                    if (Bitem.WriteOffAmount != 0) {
                    //                        let WriteOffAmount = parseFloat(Bitem.WriteOffAmount) || 0;
                    //                        let Tranobj = {
                    //                            "ClaimTransactionId": 0,
                    //                            "PatientInsuranceDetailId": Aitem.PatientInsuranceDetailId,
                    //                            "ClaimLineItemId": Bitem.ClaimLineItemId,
                    //                            "OrganizationId": $scope.HospitalId,
                    //                            "TransactionDate": $filter('date')($scope.CurreDate, "yyyy-MM-dd"),
                    //                            "TransactionAmount": WriteOffAmount,
                    //                            "PatientAmount": 0,
                    //                            "InsuranceAmount": WriteOffAmount,
                    //                            "EOBId": $scope.EOBObj.EOBId,
                    //                            "PayorId": Aitem.PrimaryInsuranceId,
                    //                            "AdjustmentReasonId": null,
                    //                            "AdjustmentReasonCode": "",
                    //                            "ReferenceNumber": mainObject.ReferenceNumber,
                    //                            "TransactionTypeId": 13,
                    //                            "TransactionType": "Posting Write Off",
                    //                            "TransactionSourceId": 1,
                    //                            "TransactionSource": "Primary Insurance",
                    //                            "SettlementStatusId": 3,
                    //                            "SettlementStatus": "Fully Settled",
                    //                            "TransactionNotes": ""
                    //                        }

                    //                        ClaimTransaction.push(Tranobj);
                    //                    }

                    //                    let postobj = {
                    //                        "EOBLineItemId": item.EOBLineItemId || null,
                    //                        "ClaimLineItemId": item.ClaimLineItemId,
                    //                        "PatientClaimId": item.PatientClaimId,
                    //                        "ServiceId": item.ServiceId,
                    //                        "PatientBalance": item.PatientBalance,
                    //                        "InsuranceBalance": item.InsuranceBalance,
                    //                        "PaymentAmount": item.InsurancePaymentAmount,
                    //                        "AllowedAmount": item.AllowedAmount,
                    //                        "CoInsuranceAmount": item.CoInsuranceAmount,
                    //                        "DeductibleAmount": item.DeductibleAmount,
                    //                        "CoPaymentAmount": item.CoPaymentAmount,
                    //                        "AdjustmentAmount": item.AdjustmentAmount,
                    //                        "InsuranceWriteOff": item.WriteOffAmount,
                    //                        "PatientResponsibility": item.PatientResponsibilityAmount,
                    //                        "OtherPatientAmount": null,
                    //                        "PatientWriteOffAmount": null,
                    //                        "TotalBalance": item.CurrentTotalBalance,
                    //                        "ServiceAdjustments": item.ServiceAdjustments || [],
                    //                        "DenialCodes": item.DenialCodes || [],
                    //                        "ClaimTransaction": ClaimTransaction || [],
                    //                    };

                    //                    ClaimLineItems.push(postobj);
                    //                });




                    //                let obj1 = {
                    //                    "EOBClaimInfoId": 0,
                    //                    "EOBId": $scope.EOBObj.EOBId,
                    //                    "PatientClaimNumber": item.PatientClaimNumber || "",
                    //                    "PatientClaimId": item.PatientClaimId || "",
                    //                    "PatientControlNumber": item.PatientControlNumber || "",
                    //                    "PatientId": item.PatientId,
                    //                    "BatchId": item.BatchId || null,
                    //                    "PatientInsuranceDetailId": item.TransmitQueuePatientInsuranceId || null,
                    //                    "EOBPageNo": "",
                    //                    "PostingNotes": "",
                    //                    "PayorOrder": null,
                    //                    "PayorId": $scope.EOBObj.PayorId,
                    //                    "BillingProviderId": item.BillingProviderId,
                    //                    "PayerClaimControlNumber": "",
                    //                    "TotalChargeAmount": 0.0,
                    //                    "ClaimPaymentAmount": 0.0,
                    //                    "ClaimAdjustmentAmount": 0.0,
                    //                    "ClaimCoPayAmount": 0.0,
                    //                    "ClaimCoInsuranceAmount": 0.0,
                    //                    "ClaimAllowedAmount": 0.0,
                    //                    "WriteOffAmount": 0.0,
                    //                    "DeductibleAmount": 0.0,
                    //                    "PatientResponsibilityAmount": 0.0,
                    //                    "ClaimAdjustmentCode": "",
                    //                    "ClaimAdjustmentCodeDescription": "",
                    //                    "DenialCode": "",
                    //                    "DenialCodeDescription": "",
                    //                    "RemarkCode": "",
                    //                    "RemarkCodeDescription": "",
                    //                    "ClaimFollowUpNotes": "",
                    //                    "DepositStatusId": "1",
                    //                    "DepositStatus": "Deposited",
                    //                    "SettlementStatusId": $scope.EOBObj.PostedValue == 2 ? 9 : 1,
                    //                    "SettlementStatus": $scope.EOBObj.PostedValue == 2 ? "Posted in Other System" : "Not Settled",
                    //                    "DeleteInd": "N",
                    //                    "IsPostedInOtherSystem": $scope.EOBObj.PostedValue == 2 ? true : false,
                    //                    "PostedAmountInOtherSystem": item.PostedAmountInOtherSystem || 0.0,
                    //                    "ClaimLineItems": []


                    //                }
                    //                $scope.TotalPostedAmount += parseFloat(item.PostedAmountInOtherSystem) || 0.0;
                    //                ClaimsList.push(obj1);
                    //            }


                    //        });



                    //    }
                    //} else {

                    //}
                    if ($scope.OrgClaimListdata.length > 0) {
                        angular.forEach($scope.OrgClaimListdata, function (item) {
                            if (item.IsChecked) {

                                let obj1 = {
                                    "EOBClaimInfoId": 0,
                                    "EOBId": $scope.EOBObj.EOBId,
                                    "PatientClaimNumber": item.PatientClaimNumber || "",
                                    "PatientClaimId": item.PatientClaimId || "",
                                    "PatientControlNumber": item.PatientControlNumber || "",
                                    "PatientId": item.PatientId,
                                    "BatchId": item.BatchId || null,
                                    "PatientInsuranceDetailId": item.TransmitQueuePatientInsuranceId || null,
                                    "InsuranceIdentifierId":1,
                                    "EOBPageNo": "",
                                    "PostingNotes": "",
                                    "PayorOrder": null,
                                    "PayorId": $scope.EOBObj.PayorId,
                                    "BillingProviderId": item.BillingProviderId,
                                    "PayerClaimControlNumber": "",
                                    "TotalChargeAmount": item.TotalChargeAmount,
                                    "ClaimPaymentAmount": 0.0,
                                    "ClaimAdjustmentAmount": 0.0,
                                    "ClaimCoPayAmount": 0.0,
                                    "ClaimCoInsuranceAmount": 0.0,
                                    "ClaimAllowedAmount": 0.0,
                                    "WriteOffAmount": 0.0,
                                    "DeductibleAmount": 0.0,
                                    "PatientResponsibilityAmount": 0.0,
                                    "ClaimAdjustmentCode": "",
                                    "ClaimAdjustmentCodeDescription": "",
                                    "DenialCode": "",
                                    "DenialCodeDescription": "",
                                    "RemarkCode": "",
                                    "RemarkCodeDescription": "",
                                    "ClaimFollowUpNotes": "",
                                    "DepositStatusId": "1",
                                    "DepositStatus": "Deposited",
                                    "SettlementStatusId": $scope.EOBObj.PostedValue == 2 ? 9 : 1,
                                    "SettlementStatus": $scope.EOBObj.PostedValue == 2 ? "Posted in Other System" : "Not Settled",
                                    "DeleteInd": "N",
                                    "IsPostedInOtherSystem": $scope.EOBObj.PostedValue == 2 ? true : false,
                                    "PostedAmountInOtherSystem": item.PostedAmountInOtherSystem || 0.0,
                                    "ClaimLineItems": []


                                }
                                $scope.TotalPostedAmount += parseFloat(item.PostedAmountInOtherSystem) || 0.0;

                                if (item.ClaimResponsibilityId === 1) {
                                    obj1.InsuranceIdentifierId = 0;
                                }
                                else if (item.ClaimResponsibilityId === 3) {
                                    obj1.InsuranceIdentifierId = 2;
                                }
                                ClaimsList.push(obj1);
                            }

                        });
                    }



                    if ($scope.TotalPostedAmount > $scope.EOBObj.TotalUnAppliedAmount) {
                        alertify.error("Posted Amount Should not be greater than Check Balance");
                        return false;
                    }
                    let params = {
                        "UserId": $scope.UserId,
                        "OrganizationId": $scope.HospitalId,
                        "EOBId": $scope.EOBObj.EOBId,
                        "ClaimsList": ClaimsList || [],
                        "TotalPostedAmount": $scope.TotalPostedAmount
                    }

                    console.log(JSON.stringify(params));
                    // return false;
                    eHnotePatientDataService.AddUpdateEOBClaimInfoDetails(params).then(function (resp) {
                        if (resp.data.Status == "Success") {
                            $uibModalInstance.close();
                        } else {
                            alertify.error(resp.data.Message);
                        }
                    }, function (error) {

                    });
                }

                $scope.SelectClaimList = function (item) {
                    //if (item.PayorId != $scope.EOBObj.PayorId) {
                    //    item.IsChecked = false;
                    //    alertify.error("Selected payer doesn't match with claim!");
                    //    return false;
                    //}

                    var templist = $filter("filter")($scope.EOBObj.BillingProvidersList, { "OrganizationBillingProviderId": item.BillingProviderId }, true) || [];
                    if (templist.length == 0) {
                        item.IsChecked = false;
                        alertify.error("Selected BillingProvider doesn't match with claim!");
                        return false;
                    }

                    //if (item.ClaimStatusId != 3) {
                    //    item.IsChecked = false;
                    //    alertify.error("This Claim is not Transmitted.");
                    //    return false;
                    //}

                    //if (item.ClaimStatusId != 3 && item.ClaimStatusId != 11 && item.ClaimStatusId != 12 && item.ClaimStatusId != 13 && item.ClaimStatusId != 14 && item.ClaimStatusId != 15 && item.ClaimStatusId != 16 && item.ClaimStatusId != 19 && item.ClaimStatusId != 22 && item.ClaimStatusId != 23) {
                    //    item.IsChecked = false;
                    //    alertify.error("This Claim is not Transmitted.");
                    //    return false;
                    //}

                }


                $scope.changeclaimslistPage = function (pageNo) {
                    $scope.Pagination.PageNo = pageNo || 1;
                    $scope.SearchAllClaimDetails();
                };
                $scope.changeExternalPaymentAmount = function (val, item) {

                    val = val || null;
                    if (val !== null) {
                        let inputValue = val.toString();
                        inputValue = inputValue.replace(/[^0-9.+-]/g, '');


                        if (inputValue.includes('+') || inputValue.includes('-')) {
                            const signMatch = inputValue.match(/^[-+]/);
                            const sign = signMatch ? signMatch[0] : '';
                            inputValue = sign + inputValue.replace(/[-+]/g, '');
                        }
                        if (inputValue.startsWith('.')) {
                            inputValue = '0' + inputValue;
                        } else if (inputValue.startsWith('-.')) {
                            inputValue = '-0' + inputValue.substring(1);
                        }
                        if (inputValue.length > 1 && inputValue.startsWith('0') && !inputValue.startsWith('0.')) {
                            inputValue = inputValue.slice(1);
                        }
                        const decimalParts = inputValue.split('.');
                        if (decimalParts.length > 2) {
                            inputValue = decimalParts[0] + '.' + decimalParts[1];
                        }

                        if (inputValue === '' || isNaN(parseFloat(inputValue))) {
                            val = '';
                        }
                        item.ClaimPaymentAmount = inputValue;
                        if (item.ClaimPaymentAmount > item.TotalClaimAmount) {
                            alertify.error("Payment Amount should not be Greater then Charge amount");
                            return false;
                        }
                    }

                }


                $scope.calculateExpiryDate = function () {

                    var currentDate = new Date();

                    currentDate.setDate(currentDate.getDate() + 90);

                    var expiryMonth = currentDate.getMonth() + 1;
                    var expiryDay = currentDate.getDate();
                    var expiryYear = currentDate.getFullYear();

                    expiryMonth = expiryMonth < 10 ? '0' + expiryMonth : expiryMonth;
                    expiryDay = expiryDay < 10 ? '0' + expiryDay : expiryDay;

                    $scope.ClaimExpiryDate = `${expiryMonth}-${expiryDay}-${expiryYear}`;
                };

                $scope.navtoClaimSummaryInNewTab = function (item) {
                    $scope.calculateExpiryDate();
                    item = item || '';
                    let AppointmentId = null;
                    let PatientId = null;
                    if (item != '') {
                        AppointmentId = item.AppointmentId;
                        PatientId = item.PatientId;
                    }

                    $scope.claimScreenParentObj = {
                        "PatientId": item.PatientId || null,
                        "AppointmentId": item.AppointmentId || null,
                        "PatientFullName": item.PatientFullName || "",
                        "VisitId": item.VisitId || '',
                        "ActionType": "EditClaim",
                        "SubActionType": "Verify",
                        "ScreenType": "Popup",
                        "SuperBillId": null,
                        "ResponcibilityId": item.CurrentResponsibilityId || 0,
                        "IsCreateSuperBill": false,
                        "PatientClaimId": item.PatientClaimId,
                        "SuperBillArray": [],
                        "ClaimExpiryDate": $scope.ClaimExpiryDate || null,
                        "AppointmentDoctorId": item.RenderingProviderId || 0,
                        "PageNumber": 1,
                    };

                    $scope.mainBillerDataObj = $scope.EOBObj.mainBillerDataObj;
                    $scope.mainBillerDataObj.Tabid = 2;
                    datapersistanceFactory.set("IsComingFromClaim", $scope.claimScreenParentObj);
                    datapersistanceFactory.set("mainDataBillerObj", $scope.mainBillerDataObj);
                    $window.open("#/claim/" + item.PatientClaimId, "_blank");
                }


                $scope.SelectAllAssociatClaims = function () {
                    if ($scope.Selectedobj.IsChecked) {
                        angular.forEach($scope.OrgClaimListdata, function (item) {
                            item.IsChecked = true;
                        });
                    } else {
                        angular.forEach($scope.OrgClaimListdata, function (item) {
                            item.IsChecked = false;
                        });
                    }
                }

            }
        });
        mInstanceAdd.result.then(function (resp) {
            $scope.GetEOBClaimDetails();
        }, function () {

        });
        // }
    };
    $scope.openPostPaymentPopup = function (item, type) {

        let mainObject = {
            "PatientId": item.PatientId,
            "PatientFullName": item.PatientName,
            "AppointmentId": item.AppointmentId,
            "AppointmentTypeId": item.AppointmentTypeId,
            "PatientClaimId": item.PatientClaimId,
            "EOBId": item.EOBId,
            "ReferenceNumber": item.ReferenceNumber,
            "EOBClaimInfoId": item.EOBClaimInfoId,
            "IsCapitationInd": $scope.mainEOBPaymentPostingObj.IsCapitationInd || false,
            "CapitationDiscount": $scope.mainEOBPaymentPostingObj.CapitationDiscount || null,
            "PayorId": $scope.mainEOBPaymentPostingObj.PayorId,
            "PostingDate": $scope.mainEOBPaymentPostingObj.PostingDate,
            "TotalUnAppliedAmount": $scope.mainEOBPaymentPostingObj.TotalUnAppliedAmount,
            "TotalPaymentAmount": $scope.mainEOBPaymentPostingObj.TotalPaymentAmount,
            "EraId": $scope.mainEOBPaymentPostingObj.EraId,
            "Type": type || '',
            "ClaimTypeId": item.ClaimTypeId || 2
        }

        let mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/PostPaymentpopup.html",
            "controller": "UsPostPaymentpopupCtrl",
            //"size": "lg",
            "backdrop": "static",
            "keyboard": false,
            "resolve": {
                "mainObject": function () { return mainObject; },
                "AllHospitalData": function () { return $scope.mainBillerDataObj; },
                "mainEOBPaymentPostingObj": function () { return $scope.mainEOBPaymentPostingObj || null },
            },
            "windowClass": "modal__popup--1",

        });
        mInstanceAdd.result.then(function (resp) {
            resp = resp || "";
            if (resp.status === "Success") {
                $scope.Subtab = 2;
                $scope.GetEOBClaimDetails(mainObject.EOBClaimInfoId, resp.status);
                $scope.init(1);
            } else if (resp === "Denial") {
                $scope.Subtab = 3;
                $scope.GetEOBClaimDetails(mainObject.EOBClaimInfoId, "Denial");
            }
            else {
                if (resp?.SettlementStatusId !== 1) {
                    $scope.Subtab = 2;
                }
                $scope.GetEOBClaimDetails(mainObject.EOBClaimInfoId, "Patient");
            }
        }, function () {

        });
    };
    $scope.openDepositsPopup = function () {
        let mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/DepositsPopUp.html",
            //"size": "lg",
            "backdrop": "static",
            "keyboard": false,
            "windowClass": "modal__ninety--",
            "controller": function ($scope, $uibModal, $uibModalInstance) {
                $scope.uibclose = function () {
                    $uibModalInstance.dismiss("cancel");
                };
            }
        });
    };
    $scope.openDenailCodesPopup = function () {
        let mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/DenialCodesPopup.html",
            //"size": "lg",
            "backdrop": "static",
            "keyboard": false,
            "scope": $scope,
            "windowClass": "offcanves-right width-50 left-auto right-0",
            "controller": function ($scope, $uibModal, $uibModalInstance) {
                $scope.uibclose = function () {
                    $uibModalInstance.dismiss("cancel");
                };
            }
        });
    };


    $scope.ClearEOBDetails = function () {
        $scope.mainEOBPaymentPostingObj.PayorObj = "";
        $scope.mainEOBPaymentPostingObj.PayorAddress = "";
        $scope.mainEOBPaymentPostingObj.PayerIdentificationNo = "";
        $scope.mainEOBPaymentPostingObj.EOBName = "";
        $scope.mainEOBPaymentPostingObj.PaymentMethodId = "";
        $scope.mainEOBPaymentPostingObj.ReferenceNumber = "";
        $scope.mainEOBPaymentPostingObj.IsNonPayment = false;
        $scope.mainEOBPaymentPostingObj.ExternalSystemPostedAmount = 0;
        $scope.mainEOBPaymentPostingObj.CapitationDiscount = null;
        $scope.mainEOBPaymentPostingObj.IsCapitationInd = false;
        $scope.mainEOBPaymentPostingObj.IsExternalSystemPosted = false;
        $scope.mainEOBPaymentPostingObj.DepositStatusId = 1;
        $scope.mainEOBPaymentPostingObj.DepositStatus = "Deposited";
        $scope.mainEOBPaymentPostingObj.PaymentDate = null;
        $scope.mainEOBPaymentPostingObj.TotalPaymentAmount = "";
        $scope.mainEOBPaymentPostingObj.DocumentDetails = [];
        $scope.mainEOBPaymentPostingObj.PostingDate = null;
        $scope.mainEOBPaymentPostingObj.OrganizationBillingProviderId = "";
        $scope.mainEOBPaymentPostingObj.Notes = "";
        $scope.mainEOBPaymentPostingObj.BillingProvidersList = [];
        $scope.ProviderListObj = angular.copy($scope.ProviderListData());

        angular.forEach($scope.ClaimProviderList, function (item) {
            item.IsChecked = false;
        })
    }

    $scope.selectAttachementfile = function (files) {
        files = files || [];
        if (files.length > 0) {
            angular.forEach(files, function (item) {
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
                        "DocumentId": 0,
                        "FileTypeId": 39,
                        "DisplayName": name,
                        "DocumentExt": $scope.file.type,
                        "S3URL": "",
                        "DeleteInd": "N"
                    };

                    $scope.mainEOBPaymentPostingObj.TempDocumentDetails.unshift(obj);

                    angular.element("input[type='file']").val(null);
                }
            });
        }
    };

    $scope.scanFile = function () {

        var obj = {
            "PatientId": $scope.cacheStorageItem.PatientID || null,
            "AppointmentId": $scope.cacheStorageItem.appointmentid || null,
            "PatientName": $scope.cacheStorageItem.PatientName || '',
            "Tab": "",
            "SignedDate": $filter('date')(currentdate, "yyyy-MM-dd"),
            "FileTypeId": 39,
            "FileName": '',
            "DisplayName": ''
        }

        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/UsNewConsultation/uibpopup/PatientDocumentScanner.html",
            "backdrop": "static",
            "scope": $scope,
            "size": "lg",
            "resolve": {
                "mainObject": function () { return obj; }
            },
            "windowClass": "modal__eighty--",
            "keyboard": false,
            "controller": "DocumentScannerCtrl",
        });
        $scope.mInstanceAdd.result.then(function (data) {
            console.log(data);
            var obj = {
                "DocumentId": 0,
                "FileTypeId": 39,
                "DisplayName": data.DocumentName,
                "FileName": data.DocumentName,
                "FileExt": data.FileExt,
                "DocumentExt": data.FileExt,
                "S3URL": data.S3URL,
                "DeleteInd": "N"
            };

            $scope.mainEOBPaymentPostingObj.TempDocumentDetails.unshift(obj);

        }, function (cancel) {
        });
    }

    $scope.DeleteFiles = function (item, index) {
        item.DocumentId = item.DocumentId || 0;
        alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to delete ? </h4>", function () {
            if (item.DocumentId != 0) {
                item.DeleteInd = "Y";
            } else {
                $scope.mainEOBPaymentPostingObj.DocumentDetails.splice(index, 1);
            }
            $scope.$apply();
        }, function () {

        });
    }

    $scope.changesDepositStatus = function (statusid) {
        if (statusid == 1) {
            $scope.mainEOBPaymentPostingObj.DepositStatus = "Deposited";
        } else {
            $scope.mainEOBPaymentPostingObj.DepositStatus = "Pending";
        }
    }

    $scope.changeNonPayment = function (item) {
        if (item.IsNonPayment) {
            var formatted = moment().format("MMDDYYHHmmss");
            item.ReferenceNumber = "NON-PAYMENT-" + formatted;
        } else {
            item.ReferenceNumber = "";
        }

    };
    $scope.changePayerAdjAmt = function (item) {

        item.TotalUnAppliedAmount = parseFloat(item.TotalUnAppliedAmount.toFixed(2)) || 0;
        item.TotalPaymentAmount = parseFloat(item.TotalPaymentAmount.toFixed(2)) || 0;
        item.TotalAppliedAmount = parseFloat(item.TotalAppliedAmount.toFixed(2)) || 0;
        item.ExternalSystemPostedAmount = parseFloat(item.ExternalSystemPostedAmount.toFixed(2)) || 0;

        item.PayerAdjAmount = parseFloat(item.PayerAdjAmount) || 0;
        item.TotalUnAppliedAmount = item.TotalPaymentAmount - (item.TotalAppliedAmount + item.ExternalSystemPostedAmount + item.PayerAdjAmount) || 0;
        item.TotalUnAppliedAmount = parseFloat(item.TotalUnAppliedAmount.toFixed(2)) || 0;
        item.PayerAdjAmount = parseFloat(item.PayerAdjAmount.toFixed(2)) || 0;
    };
    $scope.changeExternalSystemPosted = function (item) {

        item.TotalUnAppliedAmount = parseFloat(item.TotalUnAppliedAmount.toFixed(2)) || 0;
        item.TotalPaymentAmount = parseFloat(item.TotalPaymentAmount.toFixed(2)) || 0;
        item.TotalAppliedAmount = parseFloat(item.TotalAppliedAmount.toFixed(2)) || 0;
        item.ExternalSystemPostedAmount = parseFloat(item.ExternalSystemPostedAmount.toFixed(2)) || 0;
        item.PayerAdjAmount = parseFloat(item.PayerAdjAmount.toFixed(2)) || 0;
        if (item.IsExternalSystemPosted) {
            item.TotalUnAppliedAmount = item.TotalPaymentAmount - (item.TotalAppliedAmount + item.PayerAdjAmount) || 0;
            item.ExternalSystemPostedAmount = item.TotalUnAppliedAmount;
            item.TotalUnAppliedAmount = item.TotalPaymentAmount - (item.TotalAppliedAmount + item.ExternalSystemPostedAmount + item.PayerAdjAmount) || 0;

        } else {
            item.ExternalSystemPostedAmount = 0;
            item.TotalUnAppliedAmount = item.TotalPaymentAmount - (item.TotalAppliedAmount + item.ExternalSystemPostedAmount + item.PayerAdjAmount) || 0;
        }

        item.TotalUnAppliedAmount = parseFloat(item.TotalUnAppliedAmount.toFixed(2)) || 0;
        item.ExternalSystemPostedAmount = parseFloat(item.ExternalSystemPostedAmount.toFixed(2)) || 0;

    };

    $scope.changeExternalSystemPostedAmt = function (item) {

        item.TotalUnAppliedAmount = parseFloat(item.TotalUnAppliedAmount.toFixed(2)) || 0;
        item.TotalPaymentAmount = parseFloat(item.TotalPaymentAmount.toFixed(2)) || 0;
        item.TotalAppliedAmount = parseFloat(item.TotalAppliedAmount.toFixed(2)) || 0;
        item.ExternalSystemPostedAmount = parseFloat(item.ExternalSystemPostedAmount.toFixed(2)) || 0;
        item.PayerAdjAmount = parseFloat(item.PayerAdjAmount.toFixed(2)) || 0;

        //if (item.ExternalSystemPostedAmount > item.TotalUnAppliedAmount) {
        //      alertify.error("External System Posted Amount is not Greater than the Check balance ");
        //      item.ExternalSystemPostedAmount = 0;               
        //}
        if (item.IsExternalSystemPosted) {
            $scope.mainEOBPaymentPostingObj.TotalUnAppliedAmount = item.TotalPaymentAmount - (item.TotalAppliedAmount + item.ExternalSystemPostedAmount + item.PayerAdjAmount) || 0;
        } else {
            item.ExternalSystemPostedAmount = 0;
            item.TotalUnAppliedAmount = item.TotalPaymentAmount - (item.TotalAppliedAmount + item.ExternalSystemPostedAmount + item.PayerAdjAmount) || 0;
        }
        item.TotalUnAppliedAmount = parseFloat(item.TotalUnAppliedAmount.toFixed(2)) || 0;
        item.ExternalSystemPostedAmount = parseFloat(item.ExternalSystemPostedAmount.toFixed(2)) || 0;
    };

    //$scope.$on('ReconcileClaimInPosting', function (event, val) {
    //    console.log("Reconcile")


    //});

    $scope.init = function (typeid) {

        $scope.ReconcileEraId = $scope.ReconcileEraId || 0;
        $scope.ClaimBillingProviderList = [];
        $scope.masterSettlementStatusList = [];
        $scope.mainEOBPaymentPostingObj.EOBPaymentPostingList = [];
        $scope.TotalERAAmount = 0;
        $scope.TotalERAManualAmount = 0;
        $scope.TotalERAElectronicAmount = 0;
        $scope.OrganizationBillingProviderGroupsDetails = [];
        $scope.MasterEobDepositStatus = [];
        $scope.MasterEraPaymentStatus = [];
        $scope.EOBMasterAdjustments = [];

        //$scope.selectedPostingPayerfreezList = eHnoteMasterDataService.getPostingPayerfreezingList();
        //if ($scope.selectedPostingPayerfreezList != '') {
        //    $scope.EOBSearchObj.PostingFromDate = $scope.selectedPostingPayerfreezList.PostingFromDate || null;
        //    $scope.EOBSearchObj.PostingToDate = $scope.selectedPostingPayerfreezList.PostingToDate || null;
        //    $scope.EOBSearchObj.DepositFromDate = $scope.selectedPostingPayerfreezList.DepositFromDate || null;
        //    $scope.EOBSearchObj.DepositToDate = $scope.selectedPostingPayerfreezList.DepositToDate || null;
        //    $scope.EOBSearchObj.PayorId = $scope.selectedPostingPayerfreezList.PayorId || 0;
        //    $scope.EOBSearchObj.PayorObj = $scope.selectedPostingPayerfreezList.PayorObj || '';
        //    $scope.EOBSearchObj.AppliedStatusId = $scope.selectedPostingPayerfreezList.AppliedStatusId || 0;
        //    $scope.EOBSearchObj.PaymentMethodId = $scope.selectedPostingPayerfreezList.PaymentMethodId || 0;
        //    $scope.EOBSearchObj.OrganizationBillingProviderId = $scope.selectedPostingPayerfreezList.OrganizationBillingProviderId || 0;
        //    $scope.EOBSearchObj.DepositStatusId = $scope.selectedPostingPayerfreezList.DepositStatusId || 0;
        //    $scope.EOBSearchObj.ReferenceNumber = $scope.selectedPostingPayerfreezList.ReferenceNumber || '';
        //}

        let Req = {
            /*  "OrganizationId": $scope.HospitalId || 0,*/
            "ParentOrganizationId": $scope.ParenthospitalId,
            "FacilityCode": "",
            "PageNumber": 1,
            "PageSize": 200
        }

        let obj = {
            "EOBId": $scope.mainEOBPaymentPostingObj.EOBId || 0
        }

        var billinggroupobj = {
            "ParentOrganizationId": $scope.ParenthospitalId,
            "OrganizationId": 0
        };

        //let param = {
        //    "OrganizationId": $scope.HospitalId || 0,
        //    "BillingProviderId": 0,
        //    "PayorId": 0,
        //    "EOBName": "",
        //    "ReferenceNumber": "",
        //    "PageSize": 50,
        //    "PageNumber": 1,
        //    "PostingFrom": "",
        //    "PostingTo": "",
        //    "PaymentFrom": "",
        //    "PaymentTo": "",
        //    "DepositStatusId": 0,
        //    "AppliedStatusId": 0
        //}
        let param = {
            "OrganizationId": $scope.HospitalId || 0,
            "BillingProviderId": $scope.EOBSearchObj.OrganizationBillingProviderId || 0,
            "PayorId": $scope.EOBSearchObj.PayorId || 0,
            "EOBName": $scope.EOBSearchObj.EOBName || "",
            "ReferenceNumber": $scope.EOBSearchObj.ReferenceNumber || "",
            "PatientClaimNumber": $scope.EOBSearchObj.PatientClaimNumber || "",
            "PageSize": 50,
            "PageNumber": $scope.EOBSearchObj.PageNumber || 1,
            "PostingFrom": $scope.EOBSearchObj.PostingFromDate || null,
            "PostingTo": $scope.EOBSearchObj.PostingToDate || null,
            "PaymentFrom": $scope.EOBSearchObj.DepositFromDate || null,
            "PaymentTo": $scope.EOBSearchObj.DepositToDate || null,
            "DepositStatusId": $scope.EOBSearchObj.DepositStatusId || 0,
            "AppliedStatusId": $scope.EOBSearchObj.AppliedStatusId || 0,
            "PaymentMethodId": $scope.EOBSearchObj.PaymentMethodId || 0,
            "SortById": $scope.EOBSearchObj.SortById || 0,
            "SortByName": $scope.EOBSearchObj.SortByName || "",
            "ProcessingTypeId": $scope.EOBSearchObj.ProcessingTypeId = $scope.ReconcileEraId != 0 ? 2 : 0,
            "EraId": $scope.ReconcileEraId || 0,
            "PaymentStatusId": $scope.EOBSearchObj.PaymentStatusId || 0,
        }
        var param2 = {
            "OrganizationId": $scope.HospitalId,
            "FacilityName": ""
        };
        $q.all([
            /* eHnoteSettingsDataService.GetOrganizationBillingProviders(Req),*/
            eHnoteInsuranceService.GetParticularEOBDetailsById($scope.mainEOBPaymentPostingObj.EOBId),
            eHnoteInsuranceService.GetOrganizationEOBsList(param),
            eHnoteSettingsDataService.GetAllMasterClaimsData($scope.HospitalId),
            /* eHnoteMainAdminServices.GetOrganizationFacilityDetails(param2),*/
           /* eHnoteMainAdminServices.GetOrganizationBillingProviderGroups(billinggroupobj),*/
            eHnoteSettingsDataService.GetMasterPaymentAdjustmentCodes($scope.ParenthospitalId),


        ]).then(function (resp) {

            //if (resp[0].data.Status == "Success") {
            //    resp[0].data.rows = resp[0].data.rows || [];
            //    if (resp[0].data.rows.length > 0) {
            //        $scope.ClaimBillingProviderList = angular.copy(resp[0].data.rows);
            //        $scope.ClaimProviderList = $scope.ClaimBillingProviderList || [];

            //    }
            //}
            if (resp[0].data.status == "Success") {
                if (resp[0].data.rows.length > 0) {

                    var EOBPaymentDetails = angular.copy(resp[0].data.rows[0]);

                    $scope.mainEOBPaymentPostingObj.EOBId = EOBPaymentDetails.EOBId || 0;
                    $scope.mainEOBPaymentPostingObj.PostingDate = EOBPaymentDetails.PostingDate || null;
                    $scope.mainEOBPaymentPostingObj.EOBName = EOBPaymentDetails.EOBName || "";
                    $scope.mainEOBPaymentPostingObj.EOBTypeId = EOBPaymentDetails.EOBTypeId || 0;
                    $scope.mainEOBPaymentPostingObj.EOBType = EOBPaymentDetails.EOBType || "";
                    $scope.mainEOBPaymentPostingObj.PaymentMethodId = EOBPaymentDetails.PaymentMethodId || 0;
                    $scope.mainEOBPaymentPostingObj.PaymentMethod = EOBPaymentDetails.PaymentMethod || "";
                    $scope.mainEOBPaymentPostingObj.ProcessingTypeId = EOBPaymentDetails.ProcessingTypeId || 1;
                    $scope.mainEOBPaymentPostingObj.ProcessingType = EOBPaymentDetails.ProcessingType || "Manual";
                    $scope.mainEOBPaymentPostingObj.EOBCategory = EOBPaymentDetails.EOBCategory || "";
                    $scope.mainEOBPaymentPostingObj.PaymentReceivedAt = EOBPaymentDetails.PaymentReceivedAt || "";
                    $scope.mainEOBPaymentPostingObj.PaymentFormatCode = EOBPaymentDetails.PaymentFormatCode || "";
                    $scope.mainEOBPaymentPostingObj.PaymentDate = EOBPaymentDetails.PaymentDate || null;
                    $scope.mainEOBPaymentPostingObj.ReferenceNumber = EOBPaymentDetails.ReferenceNumber || 0;
                    $scope.mainEOBPaymentPostingObj.PayorName = EOBPaymentDetails.PayerName || "";
                    $scope.mainEOBPaymentPostingObj.PayorAddress = EOBPaymentDetails.PayorAddress || "";
                    $scope.mainEOBPaymentPostingObj.PayorId = EOBPaymentDetails.PayorId || 0;
                    $scope.mainEOBPaymentPostingObj.OrganizationPayorId = EOBPaymentDetails.OrganizationPayorId || 0;
                    $scope.mainEOBPaymentPostingObj.OrganizationBillingProviderId = EOBPaymentDetails.OrganizationBillingProviderId || 0;
                    $scope.mainEOBPaymentPostingObj.BillingProviderName = EOBPaymentDetails.BillingProviderName || "";
                    $scope.mainEOBPaymentPostingObj.BillingProviderNPI = EOBPaymentDetails.BillingProviderNPI || "";
                    $scope.mainEOBPaymentPostingObj.TotalPaymentAmount = EOBPaymentDetails.TotalPaymentAmount || 0;
                    $scope.mainEOBPaymentPostingObj.TotalAllowedAmount = EOBPaymentDetails.TotalAllowedAmount || 0;
                    $scope.mainEOBPaymentPostingObj.TotalDeductAmount = EOBPaymentDetails.TotalDeductAmount || 0;
                    $scope.mainEOBPaymentPostingObj.TotalCoInsuranceAmount = EOBPaymentDetails.TotalCoInsuranceAmount || 0;
                    $scope.mainEOBPaymentPostingObj.TotalAdjustmentAmount = EOBPaymentDetails.TotalAdjustmentAmount || 0;
                    $scope.mainEOBPaymentPostingObj.TotalWriteOffAmount = EOBPaymentDetails.TotalWriteOffAmount || 0;
                    $scope.mainEOBPaymentPostingObj.TotalPatientResponsibilityAmount = EOBPaymentDetails.TotalPatientResponsibilityAmount || 0;
                    $scope.mainEOBPaymentPostingObj.TotalDeniedAmount = EOBPaymentDetails.TotalDeniedAmount || 0;
                    $scope.mainEOBPaymentPostingObj.TotalPatientResponsibilityWriteOffAmount = EOBPaymentDetails.TotalPatientResponsibilityWriteOffAmount || 0;
                    $scope.mainEOBPaymentPostingObj.TotalAppliedAmount = EOBPaymentDetails.TotalAppliedAmount || 0;
                    $scope.mainEOBPaymentPostingObj.TotalUnAppliedAmount = EOBPaymentDetails.TotalUnAppliedAmount || 0;
                    $scope.mainEOBPaymentPostingObj.CurrentTotalUnAppliedAmount = EOBPaymentDetails.TotalUnAppliedAmount || 0;
                    $scope.mainEOBPaymentPostingObj.TotalZeroLineItems = EOBPaymentDetails.TotalZeroLineItems || 0;
                    $scope.mainEOBPaymentPostingObj.TotalDeniedLineItems = EOBPaymentDetails.TotalDeniedLineItems || 0;
                    $scope.mainEOBPaymentPostingObj.PayerIdentifier = EOBPaymentDetails.PayerIdentifier || "";
                    $scope.mainEOBPaymentPostingObj.FederalTaxPayersIdentificationNumber = EOBPaymentDetails.FederalTaxPayersIdentificationNumber || "";
                    $scope.mainEOBPaymentPostingObj.ClaimPaymentInfo = EOBPaymentDetails.ClaimPaymentInfo || "";
                    $scope.mainEOBPaymentPostingObj.ReceiptNumber = EOBPaymentDetails.ReceiptNumber || "";
                    $scope.mainEOBPaymentPostingObj.ReceiptId = EOBPaymentDetails.ReceiptId || 0;
                    $scope.mainEOBPaymentPostingObj.EOBFileId = EOBPaymentDetails.EOBFileId || 0;
                    $scope.mainEOBPaymentPostingObj.EOBFileName = EOBPaymentDetails.EOBFileName || "";
                    $scope.mainEOBPaymentPostingObj.EOBFileS3URL = EOBPaymentDetails.EOBFileS3URL || "";
                    $scope.mainEOBPaymentPostingObj.EDIFileId = EOBPaymentDetails.EDIFileId || 0;
                    $scope.mainEOBPaymentPostingObj.EDIFileName = EOBPaymentDetails.EDIFileName || "";
                    $scope.mainEOBPaymentPostingObj.EDIFileS3URL = EOBPaymentDetails.EDIFileS3URL || "";
                    $scope.mainEOBPaymentPostingObj.DepositedBy = EOBPaymentDetails.DepositedBy || 0;
                    $scope.mainEOBPaymentPostingObj.DepositDate = EOBPaymentDetails.DepositDate || null;
                    $scope.mainEOBPaymentPostingObj.Notes = EOBPaymentDetails.Notes || "";
                    $scope.mainEOBPaymentPostingObj.DepositStatus = EOBPaymentDetails.DepositStatus || "";
                    $scope.mainEOBPaymentPostingObj.DepositStatusId = EOBPaymentDetails.DepositStatusId || 1;
                    $scope.mainEOBPaymentPostingObj.PayorObj = EOBPaymentDetails.PayerName;
                    $scope.mainEOBPaymentPostingObj.BillingProvidersList = EOBPaymentDetails.BillingProvidersList;
                    $scope.mainEOBPaymentPostingObj.PayerAdjAmount = EOBPaymentDetails.PayerAdjAmount || 0;
                    $scope.mainEOBPaymentPostingObj.DocumentDetails = EOBPaymentDetails.DocumentDetails || [];
                    $scope.mainEOBPaymentPostingObj.ModifiedDt = EOBPaymentDetails.ModifiedDt || "";
                    $scope.mainEOBPaymentPostingObj.ModifiedTime = EOBPaymentDetails.ModifiedTime || "";
                    $scope.mainEOBPaymentPostingObj.ModifiedName = EOBPaymentDetails.ModifiedName || "";
                    $scope.mainEOBPaymentPostingObj.CreatedName = EOBPaymentDetails.CreatedName || "";
                    $scope.mainEOBPaymentPostingObj.CreatedDt = EOBPaymentDetails.CreatedDt || "";
                    $scope.mainEOBPaymentPostingObj.ProviderAdjustmentList = EOBPaymentDetails.ProviderAdjustmentList || [];
                    $scope.mainEOBPaymentPostingObj.CreatedTime = EOBPaymentDetails.CreatedTime || "";

                    $scope.mainEOBPaymentPostingObj.RetentionAdjustmentAmount1 = EOBPaymentDetails.RetentionAdjustmentAmount1 || 0;
                    $scope.mainEOBPaymentPostingObj.RetentionAdjustmentAmount2 = EOBPaymentDetails.RetentionAdjustmentAmount2 || 0;
                    $scope.mainEOBPaymentPostingObj.RetentionAdjustmentId1 = EOBPaymentDetails.RetentionAdjustmentId1 || null;
                    $scope.mainEOBPaymentPostingObj.RetentionAdjustmentId2 = EOBPaymentDetails.RetentionAdjustmentId2 || null;
                    $scope.mainEOBPaymentPostingObj.RetentionAdjustmentReason1 = EOBPaymentDetails.RetentionAdjustmentReason1 || "";
                    $scope.mainEOBPaymentPostingObj.RetentionAdjustmentReason2 = EOBPaymentDetails.RetentionAdjustmentReason2 || "";
                    $scope.mainEOBPaymentPostingObj.RetentionOtherAdjAmount = EOBPaymentDetails.RetentionOtherAdjAmount || 0;
                    $scope.mainEOBPaymentPostingObj.RetentionTaxAmount = EOBPaymentDetails.RetentionTaxAmount || 0;
                    $scope.mainEOBPaymentPostingObj.NotReconciledAmount = EOBPaymentDetails.NotReconciledAmount || 0;
                    $scope.mainEOBPaymentPostingObj.TotalPaymentToProvAmount = EOBPaymentDetails.TotalPaymentToProvAmount || 0;
                    $scope.mainEOBPaymentPostingObj.TotalGlobalRetentionAmount = EOBPaymentDetails.TotalGlobalRetentionAmount || 0;



                    //var obj = {
                    //    "EOBFileId": $scope.mainEOBPaymentPostingObj.EOBFileId,
                    //    "EOBFileName": $scope.mainEOBPaymentPostingObj.EOBFileName,
                    //    "EOBFileS3URL": $scope.mainEOBPaymentPostingObj.EOBFileS3URL,
                    //    "DisplayName": $scope.mainEOBPaymentPostingObj.EOBFileName
                    //}
                    //$scope.mainEOBPaymentPostingObj.DocumentDetails.push(obj);




                    if ($scope.mainEOBPaymentPostingObj.BillingProvidersList.length > 0) {
                        let providerNames = [];
                        angular.forEach($scope.mainEOBPaymentPostingObj.BillingProvidersList, function (pitem) {
                            if (pitem.BillingProviderName) {
                                providerNames.push(pitem.BillingProviderName);
                            }
                        });

                        $scope.mainEOBPaymentPostingObj.BillingProvidersdata = providerNames.join(', ');

                    } else {
                        $scope.mainEOBPaymentPostingObj.BillingProvidersdata = EOBPaymentDetails.BillingProviderName || "";
                    }


                }
            }
            if (resp[1].data.status == "Success") {

                $scope.TotalERAAmount = resp[1].data.TotalPaymentAmount;
                $scope.TotalERAManualAmount = resp[1].data.manualtotalpayment;
                $scope.TotalERAElectronicAmount = resp[1].data.electronictotalpayment;

                if (resp[1].data.rows.length > 0) {
                    $scope.mainEOBPaymentPostingObj.EOBPaymentPostingList = resp[1].data.rows || [];
                    $scope.EOBSearchObj.Count = resp[1].data.count;


                    if ($scope.ReconcileEraId != 0) {
                        var Eratemplist = $filter("filter")($scope.mainEOBPaymentPostingObj.EOBPaymentPostingList, { "EraId": $scope.ReconcileEraId }, true) || [];
                        if (Eratemplist.length > 0) {
                            $timeout(function () {
                                if (typeof $scope.clickonEOBEdit === "function") {
                                    $scope.clickonEOBEdit(4, Eratemplist[0]);
                                }
                            }, 0);
                        }
                    }
                }
            }
            if (resp[2].data.SettlementStatus.length > 0) {
                angular.forEach(resp[2].data.SettlementStatus, function (item) {
                    if (item.SettlementStatusId != 1 && item.SettlementStatusId != 6) {
                        $scope.masterSettlementStatusList.push(item);
                    }
                })
            }
            if (resp[2].data.MasterEobDepositStatus.length > 0) {
                $scope.MasterEobDepositStatus = resp[2].data.MasterEobDepositStatus || []
            }
            if (resp[2].data.MasterEraPaymentStatus.length > 0) {
                $scope.MasterEraPaymentStatus = resp[2].data.MasterEraPaymentStatus || []
            }
            if (resp[2].data.MasterPriority.length > 0) {
                $scope.MasterPriority = resp[2].data.MasterPriority || [];
            }
            if (resp[2].data.MasterAlertTypes.length > 0) {
                $scope.MasterAlertTypes = resp[2].data.MasterAlertTypes || [];
                angular.forEach($scope.MasterAlertTypes, function (item) {
                    item.IsChecked = false;
                });
            }
            if (resp[2].data.MasterAlertTag.length > 0) {
                $scope.MasterAlertTag = resp[2].data.MasterAlertTag || [];
            }
            if (resp[2].data.MasterAlertNoteType.length > 0) {
                $scope.MasterAlertNoteType = $filter("filter")(resp[2].data.MasterAlertNoteType, function (item) {
                    return item.AlertNoteTypeId !== 6;
                }) || [];
            }
            if (resp[2].data.EOBMasterAdjustments.length > 0) {
                $scope.EOBMasterAdjustments = resp[2].data.EOBMasterAdjustments || [];
            }

            //if (resp[4].data.status == "Success") {
            //    resp[4].data.rows = resp[4].data.rows || [];
            //    if (resp[4].data.rows.length > 0) {
            //        $scope.OrganizationFacilityList = angular.copy(resp[4].data.rows) || [];
            //        angular.forEach($scope.OrganizationFacilityList, function (kitem) {
            //            kitem.IsChecked = true;
            //        });

            //    }
            //}

            //if (resp[3].data.status == "Success") {
            //    $scope.OrganizationBillingProviderGroupsDetails = angular.copy(resp[3].data.rows);
            //    if ($scope.OrganizationBillingProviderGroupsDetails.length > 0) {
            //        angular.forEach($scope.OrganizationBillingProviderGroupsDetails, function (item) {
            //            item.DoctorId = item.DoctorId || 0;
            //            item.GroupsFullName = (item.Title + " " + item.DoctorFullName) || '';

            //        })
            //    }
            //}


            if (resp[3].data.rows.length !== 0) {
                $scope.PaymentReasonList = resp[3].data.rows || [];
                if ($scope.PaymentReasonList.length > 0) {
                    angular.forEach($scope.PaymentReasonList, function (item) {
                        item.AdjsutmentDescription = item.GroupCode + '-' + item.AdjustmentReasonCode + '-' + item.AdjsutmentReasonDescription;
                    });
                }
                $scope.AdjustmentCodeTypes = resp[0].data.AdjustmentCodeTypes || [];
            }

            typeid = typeid || 0;
            if ($scope.mainEOBPaymentPostingObj.IsDataAdded == false && typeid == 0) {
                $scope.mainEOBPaymentPostingObj.IsShowEOBAddingScreen = false;
                $scope.mainEOBPaymentPostingObj.IsShowSummaryScreen = false;
                $scope.mainEOBPaymentPostingObj.isSummaryPanelOpen = false;
                $scope.mainEOBPaymentPostingObj.IsShowAssociatedClaims = false;
                $scope.mainEOBPaymentPostingObj.IsShowEOBListScreen = false;
                $scope.mainEOBPaymentPostingObj.IsShowAddAssociatedClaims = false;
            } else {

                $scope.mainEOBPaymentPostingObj.IsShowEOBAddingScreen = false;
                $scope.mainEOBPaymentPostingObj.IsShowSummaryScreen = true;
                $scope.mainEOBPaymentPostingObj.isSummaryPanelOpen = true;
                $scope.mainEOBPaymentPostingObj.IsShowAssociatedClaims = true;
                $scope.mainEOBPaymentPostingObj.IsShowEOBListScreen = true;
                $scope.mainEOBPaymentPostingObj.IsShowAddAssociatedClaims = false;
                if (typeid == 0) {
                    $scope.Settledinit();
                }
            }
        });
    }

    $scope.init();

    $scope.GetParticularEobdetails = function (Id, status) {
        let obj = {
            "EOBId": $scope.mainEOBPaymentPostingObj.EOBId || 0
        };
        eHnoteInsuranceService.GetParticularEOBDetailsById($scope.mainEOBPaymentPostingObj.EOBId).then(function (resp) {
            if (resp.data.status === "Success") {

                if (resp.data.rows.length > 0) {

                    var EOBPaymentDetails = angular.copy(resp.data.rows[0]);

                    $scope.mainEOBPaymentPostingObj.EOBId = EOBPaymentDetails.EOBId || 0;
                    $scope.mainEOBPaymentPostingObj.PostingDate = EOBPaymentDetails.PostingDate || null;
                    $scope.mainEOBPaymentPostingObj.EOBName = EOBPaymentDetails.EOBName || "";
                    $scope.mainEOBPaymentPostingObj.EOBTypeId = EOBPaymentDetails.EOBTypeId || 0;
                    $scope.mainEOBPaymentPostingObj.EOBType = EOBPaymentDetails.EOBType || "";
                    $scope.mainEOBPaymentPostingObj.PaymentMethodId = EOBPaymentDetails.PaymentMethodId || 0;
                    $scope.mainEOBPaymentPostingObj.PaymentMethod = EOBPaymentDetails.PaymentMethod || "";
                    $scope.mainEOBPaymentPostingObj.ProcessingTypeId = EOBPaymentDetails.ProcessingTypeId || 1;
                    $scope.mainEOBPaymentPostingObj.ProcessingType = EOBPaymentDetails.ProcessingType || "Manual";
                    $scope.mainEOBPaymentPostingObj.EOBCategory = EOBPaymentDetails.EOBCategory || "";
                    $scope.mainEOBPaymentPostingObj.PaymentReceivedAt = EOBPaymentDetails.PaymentReceivedAt || "";
                    $scope.mainEOBPaymentPostingObj.PaymentFormatCode = EOBPaymentDetails.PaymentFormatCode || "";
                    $scope.mainEOBPaymentPostingObj.PaymentDate = EOBPaymentDetails.PaymentDate || null;
                    $scope.mainEOBPaymentPostingObj.ReferenceNumber = EOBPaymentDetails.ReferenceNumber || 0;
                    $scope.mainEOBPaymentPostingObj.PayorName = EOBPaymentDetails.PayerName || "";
                    $scope.mainEOBPaymentPostingObj.PayorAddress = EOBPaymentDetails.PayorAddress || "";
                    $scope.mainEOBPaymentPostingObj.PayorId = EOBPaymentDetails.PayorId || 0;
                    $scope.mainEOBPaymentPostingObj.OrganizationPayorId = EOBPaymentDetails.OrganizationPayorId || 0;
                    $scope.mainEOBPaymentPostingObj.OrganizationBillingProviderId = EOBPaymentDetails.OrganizationBillingProviderId || 0;
                    $scope.mainEOBPaymentPostingObj.BillingProviderName = EOBPaymentDetails.BillingProviderName || "";
                    $scope.mainEOBPaymentPostingObj.BillingProviderNPI = EOBPaymentDetails.BillingProviderNPI || "";
                    $scope.mainEOBPaymentPostingObj.TotalPaymentAmount = EOBPaymentDetails.TotalPaymentAmount || 0;
                    $scope.mainEOBPaymentPostingObj.TotalAllowedAmount = EOBPaymentDetails.TotalAllowedAmount || 0;
                    $scope.mainEOBPaymentPostingObj.TotalDeductAmount = EOBPaymentDetails.TotalDeductAmount || 0;
                    $scope.mainEOBPaymentPostingObj.TotalCoInsuranceAmount = EOBPaymentDetails.TotalCoInsuranceAmount || 0;
                    $scope.mainEOBPaymentPostingObj.TotalAdjustmentAmount = EOBPaymentDetails.TotalAdjustmentAmount || 0;
                    $scope.mainEOBPaymentPostingObj.TotalWriteOffAmount = EOBPaymentDetails.TotalWriteOffAmount || 0;
                    $scope.mainEOBPaymentPostingObj.TotalPatientResponsibilityAmount = EOBPaymentDetails.TotalPatientResponsibilityAmount || 0;
                    $scope.mainEOBPaymentPostingObj.TotalDeniedAmount = EOBPaymentDetails.TotalDeniedAmount || 0;
                    $scope.mainEOBPaymentPostingObj.TotalPatientResponsibilityWriteOffAmount = EOBPaymentDetails.TotalPatientResponsibilityWriteOffAmount || 0;
                    $scope.mainEOBPaymentPostingObj.TotalAppliedAmount = EOBPaymentDetails.TotalAppliedAmount || 0;
                    $scope.mainEOBPaymentPostingObj.TotalUnAppliedAmount = EOBPaymentDetails.TotalUnAppliedAmount || 0;
                    $scope.mainEOBPaymentPostingObj.CurrentTotalUnAppliedAmount = EOBPaymentDetails.TotalUnAppliedAmount || 0;
                    $scope.mainEOBPaymentPostingObj.TotalZeroLineItems = EOBPaymentDetails.TotalZeroLineItems || 0;
                    $scope.mainEOBPaymentPostingObj.TotalDeniedLineItems = EOBPaymentDetails.TotalDeniedLineItems || 0;
                    $scope.mainEOBPaymentPostingObj.PayerIdentifier = EOBPaymentDetails.PayerIdentifier || "";
                    $scope.mainEOBPaymentPostingObj.FederalTaxPayersIdentificationNumber = EOBPaymentDetails.FederalTaxPayersIdentificationNumber || "";
                    $scope.mainEOBPaymentPostingObj.ClaimPaymentInfo = EOBPaymentDetails.ClaimPaymentInfo || "";
                    $scope.mainEOBPaymentPostingObj.ReceiptNumber = EOBPaymentDetails.ReceiptNumber || "";
                    $scope.mainEOBPaymentPostingObj.ReceiptId = EOBPaymentDetails.ReceiptId || 0;
                    $scope.mainEOBPaymentPostingObj.EOBFileId = EOBPaymentDetails.EOBFileId || 0;
                    $scope.mainEOBPaymentPostingObj.EOBFileName = EOBPaymentDetails.EOBFileName || "";
                    $scope.mainEOBPaymentPostingObj.EOBFileS3URL = EOBPaymentDetails.EOBFileS3URL || "";
                    $scope.mainEOBPaymentPostingObj.EDIFileId = EOBPaymentDetails.EDIFileId || 0;
                    $scope.mainEOBPaymentPostingObj.EDIFileName = EOBPaymentDetails.EDIFileName || "";
                    $scope.mainEOBPaymentPostingObj.EDIFileS3URL = EOBPaymentDetails.EDIFileS3URL || "";
                    $scope.mainEOBPaymentPostingObj.DepositedBy = EOBPaymentDetails.DepositedBy || 0;
                    $scope.mainEOBPaymentPostingObj.DepositDate = EOBPaymentDetails.DepositDate || null;
                    $scope.mainEOBPaymentPostingObj.Notes = EOBPaymentDetails.Notes || "";
                    $scope.mainEOBPaymentPostingObj.DepositStatus = EOBPaymentDetails.DepositStatus || "";
                    $scope.mainEOBPaymentPostingObj.DepositStatusId = EOBPaymentDetails.DepositStatusId || 1;
                    $scope.mainEOBPaymentPostingObj.PayorObj = EOBPaymentDetails.PayerName;
                    $scope.mainEOBPaymentPostingObj.BillingProvidersList = EOBPaymentDetails.BillingProvidersList;
                    $scope.mainEOBPaymentPostingObj.PayerAdjAmount = EOBPaymentDetails.PayerAdjAmount || 0;
                    $scope.mainEOBPaymentPostingObj.DocumentDetails = EOBPaymentDetails.DocumentDetails || [];
                    $scope.mainEOBPaymentPostingObj.ModifiedDt = EOBPaymentDetails.ModifiedDt || "";
                    $scope.mainEOBPaymentPostingObj.ModifiedTime = EOBPaymentDetails.ModifiedTime || "";
                    $scope.mainEOBPaymentPostingObj.ModifiedName = EOBPaymentDetails.ModifiedName || "";
                    $scope.mainEOBPaymentPostingObj.CreatedName = EOBPaymentDetails.CreatedName || "";
                    $scope.mainEOBPaymentPostingObj.CreatedDt = EOBPaymentDetails.CreatedDt || "";
                    $scope.mainEOBPaymentPostingObj.CreatedTime = EOBPaymentDetails.CreatedTime || "";

                    $scope.mainEOBPaymentPostingObj.RetentionAdjustmentAmount1 = EOBPaymentDetails.RetentionAdjustmentAmount1 || 0;
                    $scope.mainEOBPaymentPostingObj.RetentionAdjustmentAmount2 = EOBPaymentDetails.RetentionAdjustmentAmount2 || 0;
                    $scope.mainEOBPaymentPostingObj.RetentionAdjustmentId1 = EOBPaymentDetails.RetentionAdjustmentId1 || null;
                    $scope.mainEOBPaymentPostingObj.RetentionAdjustmentId2 = EOBPaymentDetails.RetentionAdjustmentId2 || null;
                    $scope.mainEOBPaymentPostingObj.RetentionAdjustmentReason1 = EOBPaymentDetails.RetentionAdjustmentReason1 || "";
                    $scope.mainEOBPaymentPostingObj.RetentionAdjustmentReason2 = EOBPaymentDetails.RetentionAdjustmentReason2 || "";
                    $scope.mainEOBPaymentPostingObj.RetentionOtherAdjAmount = EOBPaymentDetails.RetentionOtherAdjAmount || 0;
                    $scope.mainEOBPaymentPostingObj.RetentionTaxAmount = EOBPaymentDetails.RetentionTaxAmount || 0;
                    $scope.mainEOBPaymentPostingObj.NotReconciledAmount = EOBPaymentDetails.NotReconciledAmount || 0;
                    $scope.mainEOBPaymentPostingObj.TotalPaymentToProvAmount = EOBPaymentDetails.TotalPaymentToProvAmount || 0;
                    $scope.mainEOBPaymentPostingObj.TotalGlobalRetentionAmount = EOBPaymentDetails.TotalGlobalRetentionAmount || 0;

                    //var obj = {
                    //    "EOBFileId": $scope.mainEOBPaymentPostingObj.EOBFileId,
                    //    "EOBFileName": $scope.mainEOBPaymentPostingObj.EOBFileName,
                    //    "EOBFileS3URL": $scope.mainEOBPaymentPostingObj.EOBFileS3URL,
                    //    "DisplayName": $scope.mainEOBPaymentPostingObj.EOBFileName
                    //}
                    //$scope.mainEOBPaymentPostingObj.DocumentDetails.push(obj);

                    if ($scope.mainEOBPaymentPostingObj.BillingProvidersList.length > 0) {
                        let providerNames = [];
                        angular.forEach($scope.mainEOBPaymentPostingObj.BillingProvidersList, function (pitem) {
                            if (pitem.BillingProviderName) {
                                providerNames.push(pitem.BillingProviderName);
                            }
                        });

                        $scope.mainEOBPaymentPostingObj.BillingProvidersdata = providerNames.join(', ');

                    } else {
                        $scope.mainEOBPaymentPostingObj.BillingProvidersdata = EOBPaymentDetails.BillingProviderName || "";
                    }

                }
            }
        });
    };

    $scope.ProviderListData = function () {
        return {
            SelectStatusString: "All",
            BillingProviderName: "",
            AllStatusCheck: true
        };
    };
    $scope.ProviderListObj = angular.copy($scope.ProviderListData());

    $scope.checkAllBillingProviders = function (val) {
        angular.forEach($scope.ClaimProviderList, function (item) {
            item.IsChecked = val;
        });

        $scope.ProviderListObj.SelectStatusString = val ? "All" : "Select Billing Provider";
        $scope.updateSelectedProviders();
    };

    $scope.ProviderToggle = function (item) {
        const checkedCount = $scope.ClaimProviderList.filter(i => i.IsChecked).length;

        $scope.ProviderListObj.AllStatusCheck = checkedCount === $scope.ClaimProviderList.length;
        if (checkedCount === 0) {
            $scope.ProviderListObj.SelectStatusString = "Select Billing Provider";
        } else if ($scope.ProviderListObj.AllStatusCheck) {
            $scope.ProviderListObj.SelectStatusString = "All";
        } else {
            $scope.ProviderListObj.SelectStatusString = "Selected";
        }

        $scope.updateSelectedProviders();
    };

    $scope.updateSelectedProviders = function () {
        $scope.selectedBillingProviders = $scope.ClaimProviderList.map(item => ({
            EOBBillingProviderId: item.EOBBillingProviderId || 0,
            OrganizationBillingProviderId: item.OrganizationBillingProviderId,
            BillingProviderName: item.BillingProviderName,
            NPI: item.NPI,
            DeleteInd: item.IsChecked ? "N" : "Y" // "N" for checked, "Y" for unchecked
        }));


    };

    $scope.stopClosingDropDown = function (event) {
        event.stopPropagation();
    };

    $scope.AddUpdateEOBPaymentDetails = function () {
        if ($scope.mainEOBPaymentPostingObj.DeleteInd == "N") {
            if ($scope.mainEOBPaymentPostingObj.PayorName == "" && $scope.mainEOBPaymentPostingObj.PayorObj == "") {
                alertify.error("Please Select Payor Name");
                return false;
            }
            if ($scope.mainEOBPaymentPostingObj.PayorAddress == "") {
                alertify.error("Please Enter Payor Address");
                return false;
            }
            if ($scope.mainEOBPaymentPostingObj.PaymentMethod == "") {
                alertify.error("Please Select Payment Method");
                return false;
            }
            if ($scope.mainEOBPaymentPostingObj.ReferenceNumber == "") {
                alertify.error("Please Enter Payment Referral Number");
                return false;
            }
            $scope.mainEOBPaymentPostingObj.PaymentDate = $scope.mainEOBPaymentPostingObj.PaymentDate || null;
            if ($scope.mainEOBPaymentPostingObj.PaymentDate == null) {
                alertify.error("Please Select Payment Date");
                return false;
            }
            //if ($scope.mainEOBPaymentPostingObj.TotalPaymentAmount == "") {
            //    alertify.error("Please Enter Amount");
            //    return false;
            //}
            $scope.mainEOBPaymentPostingObj.PostingDate = $scope.mainEOBPaymentPostingObj.PostingDate || null;
            if ($scope.mainEOBPaymentPostingObj.PostingDate == null) {
                alertify.error("Please Select Posting Date");
                return false;
            }

            if ($scope.mainEOBPaymentPostingObj.EOBId === 0) {
                // $scope.mainEOBPaymentPostingObj.TotalUnAppliedAmount = $scope.mainEOBPaymentPostingObj.TotalPaymentAmount;
                $scope.mainEOBPaymentPostingObj.TotalUnAppliedAmount = $scope.mainEOBPaymentPostingObj.TotalPaymentAmount - ($scope.mainEOBPaymentPostingObj.TotalAppliedAmount + $scope.mainEOBPaymentPostingObj.ExternalSystemPostedAmount + $scope.mainEOBPaymentPostingObj.PayerAdjAmount) || 0;
                $scope.mainEOBPaymentPostingObj.CurrentTotalUnAppliedAmount = $scope.mainEOBPaymentPostingObj.TotalPaymentAmount - ($scope.mainEOBPaymentPostingObj.TotalAppliedAmount + $scope.mainEOBPaymentPostingObj.ExternalSystemPostedAmount + $scope.mainEOBPaymentPostingObj.PayerAdjAmount) || 0;
            }

            if ($scope.mainEOBPaymentPostingObj.TotalAppliedAmount > $scope.mainEOBPaymentPostingObj.TotalPaymentAmount) {
                alertify.error("Check amount should not be less than the applied amount");
                return false;
            }

            if ($scope.mainEOBPaymentPostingObj.TotalUnAppliedAmount > $scope.mainEOBPaymentPostingObj.TotalPaymentAmount) {
                alertify.error(" Check balance is not Greater than the Payment Amount  ");
                return false;
            }

            //if ($scope.mainEOBPaymentPostingObj.PayerAdjAmount > $scope.mainEOBPaymentPostingObj.CurrentTotalUnAppliedAmount) {
            //    alertify.error("Payer Adj. Amount is not Greater than the Check balance ");
            //    return false;
            //}


        }



        if ($scope.mainEOBPaymentPostingObj.TempDocumentDetails.length > 0) {
            angular.forEach($scope.mainEOBPaymentPostingObj.TempDocumentDetails, function (item) {
                var object = {
                    "file": item.file,
                    "S3URL": item.S3URL || '',
                    "DeleteInd": "N",
                    "DocumentId": 0,
                    "FileName": item.FileName,
                    "FileExt": item.DocumentExt,
                    "FileTypeId": 39,
                    "DisplayName": item.DisplayName,
                };
                $scope.mainEOBPaymentPostingObj.DocumentDetails.unshift(object);
            });
        }

        var templist = $filter("filter")($scope.selectedBillingProviders, { "DeleteInd": 'N' }, true) || [];
        if (templist.length == 0) {
            alertify.error("Please Select BillingProvider");
            return false;
        }

        let Obj = {
            "UserId": $scope.UserId,
            "OrganizationId": $scope.HospitalId,
            "EOBId": $scope.mainEOBPaymentPostingObj.EOBId || 0,
            "PostingDate": $scope.mainEOBPaymentPostingObj.PostingDate || null,
            "EOBName": $scope.mainEOBPaymentPostingObj.EOBName || "",
            "EOBTypeId": $scope.mainEOBPaymentPostingObj.EOBTypeId || 0,
            "EOBType": $scope.mainEOBPaymentPostingObj.EOBType || "",
            "PaymentMethodId": $scope.mainEOBPaymentPostingObj.PaymentMethodId || 0,
            "PaymentMethod": $scope.mainEOBPaymentPostingObj.PaymentMethod || "",
            "ProcessingTypeId": $scope.mainEOBPaymentPostingObj.ProcessingTypeId || 0,
            "ProcessingType": $scope.mainEOBPaymentPostingObj.ProcessingType || "",
            "EOBCategory": $scope.mainEOBPaymentPostingObj.EOBCategory || "",
            "PaymentReceivedAt": $scope.mainEOBPaymentPostingObj.PaymentReceivedAt,
            "PaymentFormatCode": $scope.mainEOBPaymentPostingObj.PaymentFormatCode,
            "PaymentDate": $scope.mainEOBPaymentPostingObj.PaymentDate || null,
            "ReferenceNumber": $scope.mainEOBPaymentPostingObj.ReferenceNumber,
            "PayorName": $scope.mainEOBPaymentPostingObj.PayorName || $scope.mainEOBPaymentPostingObj.PayorObj,
            "PayorAddress": $scope.mainEOBPaymentPostingObj.PayorAddress,
            "PayorId": $scope.mainEOBPaymentPostingObj.PayorId,
            "OrganizationPayorId": $scope.mainEOBPaymentPostingObj.OrganizationPayorId,
            "OrganizationBillingProviderId": $scope.mainEOBPaymentPostingObj.OrganizationBillingProviderId,
            "BillingProviderName": $scope.mainEOBPaymentPostingObj.BillingProviderName,
            "BillingProviderNPI": $scope.mainEOBPaymentPostingObj.BillingProviderNPI,
            "TotalPaymentAmount": $scope.mainEOBPaymentPostingObj.TotalPaymentAmount,
            "TotalAllowedAmount": $scope.mainEOBPaymentPostingObj.TotalAllowedAmount || 0,
            "TotalDeductAmount": $scope.mainEOBPaymentPostingObj.TotalDeductAmount,
            "TotalCoInsuranceAmount": $scope.mainEOBPaymentPostingObj.TotalCoInsuranceAmount,
            "TotalAdjustmentAmount": $scope.mainEOBPaymentPostingObj.TotalAdjustmentAmount,
            "TotalWriteOffAmount": $scope.mainEOBPaymentPostingObj.TotalWriteOffAmount,
            "TotalPatientResponsibilityAmount": $scope.mainEOBPaymentPostingObj.TotalPatientResponsibilityAmount,
            "TotalDeniedAmount": $scope.mainEOBPaymentPostingObj.TotalDeniedAmount,
            "TotalPatientResponsibilityWriteOffAmount": $scope.mainEOBPaymentPostingObj.TotalPatientResponsibilityWriteOffAmount,
            "TotalAppliedAmount": $scope.mainEOBPaymentPostingObj.TotalAppliedAmount || 0,
            "TotalUnAppliedAmount": $scope.mainEOBPaymentPostingObj.TotalUnAppliedAmount || 0,
            "TotalZeroLineItems": $scope.mainEOBPaymentPostingObj.TotalZeroLineItems,
            "TotalDeniedLineItems": $scope.mainEOBPaymentPostingObj.TotalDeniedLineItems,
            "PayerIdentifier": $scope.mainEOBPaymentPostingObj.PayerIdentifier,
            "FederalTaxPayersIdentificationNumber": $scope.mainEOBPaymentPostingObj.FederalTaxPayersIdentificationNumber,
            "ClaimPaymentInfo": $scope.mainEOBPaymentPostingObj.ClaimPaymentInfo || "",
            "ReceiptNumber": $scope.mainEOBPaymentPostingObj.ReceiptNumber,
            "ReceiptId": $scope.mainEOBPaymentPostingObj.ReceiptId || 0,
            "EOBFileId": $scope.mainEOBPaymentPostingObj.EOBFileId || 0,
            "EOBFileName": $scope.mainEOBPaymentPostingObj.EOBFileName,
            "EOBFileS3URL": $scope.mainEOBPaymentPostingObj.EOBFileS3URL,
            "EDIFileId": $scope.mainEOBPaymentPostingObj.EDIFileId || 0,
            "EDIFileName": $scope.mainEOBPaymentPostingObj.EDIFileName,
            "EDIFileS3URL": $scope.mainEOBPaymentPostingObj.EDIFileS3URL,
            "DepositedBy": $scope.mainEOBPaymentPostingObj.DepositedBy,
            "DepositDate": $scope.mainEOBPaymentPostingObj.DepositDate || null,
            "Notes": $scope.mainEOBPaymentPostingObj.Notes,
            "DepositStatus": $scope.mainEOBPaymentPostingObj.DepositStatus,
            "DepositStatusId": $scope.mainEOBPaymentPostingObj.DepositStatusId || 1,
            "DocumentDetails": $scope.mainEOBPaymentPostingObj.DocumentDetails || [],
            "TempDocumentDetails": $scope.mainEOBPaymentPostingObj.TempDocumentDetails || [],
            "DeleteInd": $scope.mainEOBPaymentPostingObj.DeleteInd || "N",
            "BillingProvidersList": $scope.selectedBillingProviders || [],
            "PayerAdjAmount": $scope.mainEOBPaymentPostingObj.PayerAdjAmount || 0,
            "SettlementStatusId": 1,
            "SettlementStatus": "Not Settled",
            "EOBPayerName": $scope.mainEOBPaymentPostingObj.PayorName || $scope.mainEOBPaymentPostingObj.PayorObj,
            "PayerIdentificationNo": $scope.mainEOBPaymentPostingObj.PayerIdentifier || $scope.mainEOBPaymentPostingObj.PayerIdentificationNo,
            "IsNonPayment": $scope.mainEOBPaymentPostingObj.IsNonPayment || false,
            "ExternalSystemPostedAmount": $scope.mainEOBPaymentPostingObj.ExternalSystemPostedAmount || 0,
            "IsExternalSystemPosted": $scope.mainEOBPaymentPostingObj.IsExternalSystemPosted || false,
            "CapitationDiscount": $scope.mainEOBPaymentPostingObj.CapitationDiscount || null,
            "IsCapitationInd": $scope.mainEOBPaymentPostingObj.IsCapitationInd || false,
            "PrimaryBillerId": $scope.mainEOBPaymentPostingObj.PrimaryBillerId || 0,
            "PrimaryBillerName": $scope.mainEOBPaymentPostingObj.PrimaryBillerName || "",
            "PrimaryBillerNPI": $scope.mainEOBPaymentPostingObj.PrimaryBillerNPI || "",
            "RetentionTaxAmount": $scope.mainEOBPaymentPostingObj.RetentionTaxAmount || "",
            "RetentionAdjustmentId1": $scope.mainEOBPaymentPostingObj.RetentionAdjustmentId1 || null,
            "RetentionAdjustmentReason1": $scope.mainEOBPaymentPostingObj.RetentionAdjustmentReason1 || "",
            "RetentionAdjustmentAmount1": $scope.mainEOBPaymentPostingObj.RetentionAdjustmentAmount1 || 0,
            "RetentionAdjustmentId2": $scope.mainEOBPaymentPostingObj.RetentionAdjustmentId2 || null,
            "RetentionAdjustmentReason2": $scope.mainEOBPaymentPostingObj.RetentionAdjustmentReason2 || "",
            "RetentionAdjustmentAmount2": $scope.mainEOBPaymentPostingObj.RetentionAdjustmentAmount2 || 0,
            "RetentionOtherAdjAmount": $scope.mainEOBPaymentPostingObj.RetentionOtherAdjAmount || 0,
            "NotReconciledAmount": $scope.mainEOBPaymentPostingObj.NotReconciledAmount || 0,
            "TotalPaymentToProvAmount": $scope.mainEOBPaymentPostingObj.TotalPaymentToProvAmount || 0,
            "TotalGlobalRetentionAmount": $scope.mainEOBPaymentPostingObj.TotalGlobalRetentionAmount || 0,
            "TotalTaxAmount": $scope.mainEOBPaymentPostingObj.TotalTaxAmount || 0,
            "ProviderAdjustmentList": $scope.mainEOBPaymentPostingObj.ProviderAdjustmentList || [],

        }

        eHnoteInsuranceService.AddUpdateEOBDetails(Obj, onsuccess, onerror);
        function onsuccess(resp) {
            if (resp.Status === "Success") {
                $scope.mainEOBPaymentPostingObj.TempDocumentDetails = [];
                $scope.mainEOBPaymentPostingObj.EOBId = resp.EOBId || 0;
                if ($scope.mainEOBPaymentPostingObj.DeleteInd == "N") {
                    $scope.mainEOBPaymentPostingObj.IsDataAdded = true;
                } else {
                    $scope.mainEOBPaymentPostingObj.IsDataAdded = false;
                }

                $scope.init();

            } else {
                alertify.error(resp.Message);
                return false;
            }
        }
        function onerror(err) {
            console.log(err);
        }
    }

    $scope.GetOrganizationNewPayorAllList = function (val) {

        var param = {
            "SearchText": val || "",
            "Status": "Active",
            "PageSize": 10,
            "PageNumber": 1,
            "UserId": $scope.UserId,
            "SpecializationId": $scope.SpecializationId,
            "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
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
        }, function (error) {
            console.log(error);
        });
    };

    $scope.ChangeInsurancePayor = function (obj) {

        $scope.mainEOBPaymentPostingObj.PayorId = obj.PayorId;
        $scope.mainEOBPaymentPostingObj.PayorName = obj.PayorName;
        $scope.mainEOBPaymentPostingObj.PayorCode = obj.PayorCode;
        $scope.mainEOBPaymentPostingObj.OrganizationPayorId = obj.OrganizationPayorId;
        //$scope.mainEOBPaymentPostingObj.PayorAddress = obj.Address1;
        $scope.mainEOBPaymentPostingObj.PayorAddress = obj.Address1 + ' ' + obj.Address2 + ', ' + obj.CityName + ', ' + obj.StateName + ', ' + obj.CountryName + ' ' + obj.ZipCode;
        $scope.EOBSearchObj.PayorId = obj.PayorId;
    }

    $scope.ChangePayor = function (obj) {
        $scope.mainEOBPaymentPostingObj.PayorName = obj || "";
        $scope.mainEOBPaymentPostingObj.PayorId = null;
    }



    $scope.changeBillingProvider = function (Id, Claimlist) {

        var templist = $filter("filter")(Claimlist, { "OrganizationBillingProviderId": Id }, true) || [];
        if (templist.length > 0) {
            $scope.mainEOBPaymentPostingObj.BillingProviderName = templist[0].BillingProviderName || "";
            $scope.mainEOBPaymentPostingObj.BillingProviderNPI = templist[0].NPI || "";
        }
    }

    $scope.changePaymentType = function (Id, Paymentlist) {
        var templist = $filter("filter")(Paymentlist, { "PaymentModeId": Id }, true) || [];
        if (templist.length > 0) {
            $scope.mainEOBPaymentPostingObj.PaymentMethod = templist[0].PaymentModeName || "";
        }
    }

    $scope.clickonEOBEdit = function (typeid, item) {


        if (typeid == 2 || typeid == 4) {

            $scope.mainEOBPaymentPostingObj.EOBId = item.EOBId || 0;
            $scope.mainEOBPaymentPostingObj.EraId = item.EraId || 0;
            $scope.mainEOBPaymentPostingObj.PayorId = item.PayorId || null;
            $scope.mainEOBPaymentPostingObj.PayorName = item.PayerName || "";
            $scope.mainEOBPaymentPostingObj.PayorObj = item.PayerName || "";
            $scope.mainEOBPaymentPostingObj.PayorAddress = item.PayorAddress || "";
            $scope.mainEOBPaymentPostingObj.EOBName = item.EOBName || "";
            $scope.mainEOBPaymentPostingObj.PaymentMethodId = item.PaymentMethodId || "";
            $scope.mainEOBPaymentPostingObj.PaymentMethod = item.PaymentMethod || "";
            $scope.mainEOBPaymentPostingObj.ReferenceNumber = item.ReferenceNumber || 0;
            $scope.mainEOBPaymentPostingObj.DepositStatus = item.DepositStatus || "Deposited";
            $scope.mainEOBPaymentPostingObj.DepositStatusId = item.DepositStatusId || 1;
            $scope.mainEOBPaymentPostingObj.PaymentDate = $filter('date')(item.PaymentDate, "MM-dd-yyyy") || null;
            $scope.mainEOBPaymentPostingObj.TotalPaymentAmount = item.TotalPaymentAmount || 0;
            $scope.mainEOBPaymentPostingObj.PostingDate = $filter('date')(item.PostingDate, "MM-dd-yyyy") || null;
            $scope.mainEOBPaymentPostingObj.OrganizationBillingProviderId = item.OrganizationBillingProviderId || 0;
            $scope.mainEOBPaymentPostingObj.BillingProviderName = item.BillingProviderName || "";
            $scope.mainEOBPaymentPostingObj.EOBFileId = item.EOBFileId || 0;
            $scope.mainEOBPaymentPostingObj.EOBFileName = item.EOBFileName || "";
            $scope.mainEOBPaymentPostingObj.EOBFileS3URL = item.EOBFileS3URL || "";
            $scope.mainEOBPaymentPostingObj.Notes = item.Notes || "";
            $scope.mainEOBPaymentPostingObj.IsEOBEditModeInd = true;
            $scope.mainEOBPaymentPostingObj.TotalUnAppliedAmount = item.TotalUnAppliedAmount || 0;
            $scope.mainEOBPaymentPostingObj.CurrentTotalUnAppliedAmount = item.TotalUnAppliedAmount || 0;
            $scope.mainEOBPaymentPostingObj.TotalPaymentAmount = item.TotalPaymentAmount || 0;
            $scope.mainEOBPaymentPostingObj.TotalAppliedAmount = item.TotalAppliedAmount || 0;
            $scope.mainEOBPaymentPostingObj.DocumentDetails = item.DocumentDetails || [];
            $scope.mainEOBPaymentPostingObj.PayerAdjAmount = item.PayerAdjAmount || 0;
            $scope.mainEOBPaymentPostingObj.IsNonPayment = item.IsNonPayment || false;
            $scope.mainEOBPaymentPostingObj.IsExternalSystemPosted = item.IsExternalSystemPosted || false;
            $scope.mainEOBPaymentPostingObj.ExternalSystemPostedAmount = item.ExternalSystemPostedAmount || 0;
            $scope.mainEOBPaymentPostingObj.IsCapitationInd = item.IsCapitationInd || false;
            $scope.mainEOBPaymentPostingObj.CapitationDiscount = item.CapitationDiscount || null;

            $scope.mainEOBPaymentPostingObj.RetentionAdjustmentAmount1 = item.RetentionAdjustmentAmount1 || 0;
            $scope.mainEOBPaymentPostingObj.RetentionAdjustmentAmount2 = item.RetentionAdjustmentAmount2 || 0;
            $scope.mainEOBPaymentPostingObj.RetentionAdjustmentId1 = item.RetentionAdjustmentId1 || null;
            $scope.mainEOBPaymentPostingObj.RetentionAdjustmentId2 = item.RetentionAdjustmentId2 || null;
            $scope.mainEOBPaymentPostingObj.RetentionAdjustmentReason1 = item.RetentionAdjustmentReason1 || "";
            $scope.mainEOBPaymentPostingObj.RetentionAdjustmentReason2 = item.RetentionAdjustmentReason2 || "";
            $scope.mainEOBPaymentPostingObj.RetentionOtherAdjAmount = item.RetentionOtherAdjAmount || 0;
            $scope.mainEOBPaymentPostingObj.RetentionTaxAmount = item.RetentionTaxAmount || 0;
            $scope.mainEOBPaymentPostingObj.NotReconciledAmount = item.NotReconciledAmount || 0;
            $scope.mainEOBPaymentPostingObj.TotalPaymentToProvAmount = item.TotalPaymentToProvAmount || 0;
            $scope.mainEOBPaymentPostingObj.TotalGlobalRetentionAmount = item.TotalGlobalRetentionAmount || 0;
            $scope.mainEOBPaymentPostingObj.ProviderAdjustmentList = item.ProviderAdjustmentList || [];



            $scope.mainEOBPaymentPostingObj.BillingProvidersList = item.BillingProvidersList || [];

            if ($scope.mainEOBPaymentPostingObj.BillingProvidersList.length > 0) {
                let providerNames = [];
                angular.forEach($scope.mainEOBPaymentPostingObj.BillingProvidersList, function (pitem) {
                    if (pitem.BillingProviderName) {
                        providerNames.push(pitem.BillingProviderName);
                    }
                });

                $scope.mainEOBPaymentPostingObj.BillingProvidersdata = providerNames.join(', ');

            } else {
                $scope.mainEOBPaymentPostingObj.BillingProvidersdata = item.BillingProviderName || "";
            }

            $scope.mainEOBPaymentPostingObj.PrimaryBillerId = item.PrimaryBillerId;
            $scope.mainEOBPaymentPostingObj.PrimaryBillerName = item.PrimaryBillerName;
            $scope.mainEOBPaymentPostingObj.PrimaryBillerNPI = item.PrimaryBillerNPI;

        }
        if (typeid == 1) {
            $scope.mainEOBPaymentPostingObj.IsShowEOBAddingScreen = true;
            $scope.mainEOBPaymentPostingObj.IsShowSummaryScreen = false;
            $scope.mainEOBPaymentPostingObj.isSummaryPanelOpen = false;
            $scope.mainEOBPaymentPostingObj.IsShowAssociatedClaims = false;
            $scope.mainEOBPaymentPostingObj.IsShowEOBListScreen = true;
            $scope.mainEOBPaymentPostingObj.IsShowAddAssociatedClaims = false;
            // $scope.mainEOBPaymentPostingObj.IsEOBEditModeInd = true;
            $scope.mainEOBPaymentPostingObj.IsEOBEditModeInd = false;

            $scope.mainEOBPaymentPostingObj.PaymentDate = $filter('date')($scope.mainEOBPaymentPostingObj.PaymentDate, "MM-dd-yyyy") || null;
            $scope.mainEOBPaymentPostingObj.PostingDate = $filter('date')($scope.mainEOBPaymentPostingObj.PostingDate, "MM-dd-yyyy") || null;


            if ($scope.mainEOBPaymentPostingObj.BillingProvidersList.length == 0) {
                $scope.filteredBillingProviders = $scope.mainBillerDataObj.BillingProviderList.filter(function (bitem) {
                    return bitem.OrganizationBillingProviderId === $scope.mainEOBPaymentPostingObj.OrganizationBillingProviderId;
                });
                $scope.mainEOBPaymentPostingObj.BillingProvidersList = $scope.filteredBillingProviders || [];
            }


            angular.forEach($scope.ClaimProviderList, function (pitem) {
                angular.forEach($scope.mainEOBPaymentPostingObj.BillingProvidersList, function (item) {

                    if (pitem.OrganizationBillingProviderId == item.OrganizationBillingProviderId) {
                        pitem.IsChecked = true;
                        pitem.EOBBillingProviderId = item.EOBBillingProviderId;
                    }

                });
            });

            $scope.ProviderToggle();
        }
        else if (typeid == 2) {
            $scope.mainEOBPaymentPostingObj.IsShowEOBAddingScreen = true;
            $scope.mainEOBPaymentPostingObj.IsShowSummaryScreen = false;
            $scope.mainEOBPaymentPostingObj.isSummaryPanelOpen = false;
            $scope.mainEOBPaymentPostingObj.IsShowAssociatedClaims = false;
            $scope.mainEOBPaymentPostingObj.IsShowEOBListScreen = true;
            $scope.mainEOBPaymentPostingObj.IsShowAddAssociatedClaims = false;

        }
        else if (typeid == 3) {

            $scope.mainEOBPaymentPostingObj.EOBId = 0;
            $scope.mainEOBPaymentPostingObj.EraId = 0;
            $scope.mainEOBPaymentPostingObj.ProcessingTypeId = 1;
            $scope.mainEOBPaymentPostingObj.ProcessingType = "Manual";
            $scope.mainEOBPaymentPostingObj.PayorObj = "";
            $scope.mainEOBPaymentPostingObj.PayorId = 0;
            $scope.mainEOBPaymentPostingObj.PayorName = "";
            $scope.mainEOBPaymentPostingObj.PayorAddress = "";
            $scope.mainEOBPaymentPostingObj.PayerIdentificationNo = "";
            $scope.mainEOBPaymentPostingObj.EOBName = "";
            $scope.mainEOBPaymentPostingObj.PaymentMethod = "";
            $scope.mainEOBPaymentPostingObj.PaymentMethodId = "";
            $scope.mainEOBPaymentPostingObj.ReferenceNumber = "";
            $scope.mainEOBPaymentPostingObj.DepositStatusId = 1;
            $scope.mainEOBPaymentPostingObj.DepositStatus = "Deposited";
            $scope.mainEOBPaymentPostingObj.PaymentDate = null;
            $scope.mainEOBPaymentPostingObj.TotalPaymentAmount = "";
            $scope.mainEOBPaymentPostingObj.TotalUnAppliedAmount = 0;
            $scope.mainEOBPaymentPostingObj.CurrentTotalUnAppliedAmount = 0;
            $scope.mainEOBPaymentPostingObj.PayerAdjAmount = 0;
            $scope.mainEOBPaymentPostingObj.TotalAppliedAmount = 0;
            $scope.mainEOBPaymentPostingObj.DocumentDetails = [];
            $scope.mainEOBPaymentPostingObj.ProviderAdjustmentList = [];
            $scope.mainEOBPaymentPostingObj.PostingDate = "";
            $scope.mainEOBPaymentPostingObj.BillingProviderName = "";
            $scope.mainEOBPaymentPostingObj.OrganizationBillingProviderId = "";
            $scope.mainEOBPaymentPostingObj.Notes = "";
            $scope.mainEOBPaymentPostingObj.IsEOBEditModeInd = false;
            $scope.mainEOBPaymentPostingObj.IsNonPayment = false;
            $scope.mainEOBPaymentPostingObj.ExternalSystemPostedAmount = 0;
            $scope.mainEOBPaymentPostingObj.IsExternalSystemPosted = false;
            $scope.mainEOBPaymentPostingObj.CapitationDiscount = null;
            $scope.mainEOBPaymentPostingObj.IsCapitationInd = false;


            $scope.mainEOBPaymentPostingObj.IsShowEOBAddingScreen = true;
            $scope.mainEOBPaymentPostingObj.IsShowSummaryScreen = false;
            $scope.mainEOBPaymentPostingObj.isSummaryPanelOpen = false;
            $scope.mainEOBPaymentPostingObj.IsShowAssociatedClaims = false;
            $scope.mainEOBPaymentPostingObj.IsShowEOBListScreen = true;
            $scope.mainEOBPaymentPostingObj.IsShowAddAssociatedClaims = false;
            $scope.mainEOBPaymentPostingObj.DeleteInd = "N";

            $scope.mainEOBPaymentPostingObj.PrimaryBillerId = null;
            $scope.mainEOBPaymentPostingObj.PrimaryBillerName = "";
            $scope.mainEOBPaymentPostingObj.PrimaryBillerNPI = "";

            $scope.ProviderListObj = angular.copy($scope.ProviderListData());
            $scope.ClaimProviderList.forEach(function (item) {
                item.IsChecked = true;
            });
            $scope.updateSelectedProviders();
        }
        else if (typeid == 4) {
            $scope.mainEOBPaymentPostingObj.IsShowEOBAddingScreen = false;
            $scope.mainEOBPaymentPostingObj.IsShowSummaryScreen = true;
            $scope.mainEOBPaymentPostingObj.isSummaryPanelOpen = true;
            $scope.mainEOBPaymentPostingObj.IsShowAssociatedClaims = true;
            $scope.mainEOBPaymentPostingObj.IsShowEOBListScreen = true;
            $scope.mainEOBPaymentPostingObj.IsShowAddAssociatedClaims = false;
            $rootScope.showTabs = false;
            $scope.Settledinit(item.TotalAppliedAmount === 0 ? 1 : 2);

        }
        else {
            $scope.mainEOBPaymentPostingObj.IsShowEOBAddingScreen = false;
            $scope.mainEOBPaymentPostingObj.IsShowSummaryScreen = false;
            $scope.mainEOBPaymentPostingObj.isSummaryPanelOpen = false;
            $scope.mainEOBPaymentPostingObj.IsShowAssociatedClaims = false;
            $scope.mainEOBPaymentPostingObj.IsShowEOBListScreen = false;
            $scope.mainEOBPaymentPostingObj.IsShowAddAssociatedClaims = false;
            $rootScope.showTabs = true;
            //$scope.EOBSearchObj = $scope.GetEOBSearchObject();
            $scope.EOBSearchObj.PostingPaymentTab = $scope.FreezPostingTab;
            $scope.EOBSearchObj.ProcessingTypeId = $scope.FreezProcesstypeid;
            $scope.EOBSearchObj.PayorId = 0;
            //$scope.selectedPostingPayerfreezList = eHnoteMasterDataService.getPostingPayerfreezingList();
            //if ($scope.selectedPostingPayerfreezList != '') {
            //    $scope.EOBSearchObj.PostingFromDate = $scope.selectedPostingPayerfreezList.PostingFromDate || null;
            //    $scope.EOBSearchObj.PostingToDate = $scope.selectedPostingPayerfreezList.PostingToDate || null;
            //    $scope.EOBSearchObj.DepositFromDate = $scope.selectedPostingPayerfreezList.DepositFromDate || null;
            //    $scope.EOBSearchObj.DepositToDate = $scope.selectedPostingPayerfreezList.DepositToDate || null;
            //    $scope.EOBSearchObj.PayorId = $scope.selectedPostingPayerfreezList.PayorId || 0;
            //    $scope.EOBSearchObj.PayorObj = $scope.selectedPostingPayerfreezList.PayorObj || '';
            //    $scope.EOBSearchObj.AppliedStatusId = $scope.selectedPostingPayerfreezList.AppliedStatusId || 0;
            //    $scope.EOBSearchObj.PaymentMethodId = $scope.selectedPostingPayerfreezList.PaymentMethodId || 0;
            //    $scope.EOBSearchObj.OrganizationBillingProviderId = $scope.selectedPostingPayerfreezList.OrganizationBillingProviderId || 0;
            //    $scope.EOBSearchObj.DepositStatusId = $scope.selectedPostingPayerfreezList.DepositStatusId || 0;
            //    $scope.EOBSearchObj.ReferenceNumber = $scope.selectedPostingPayerfreezList.ReferenceNumber || '';
            //}
            $scope.SearchAllPaymentDetails($scope.EOBSearchObj.PageNumber);
            $scope.ProviderListObj = $scope.ProviderListData();
            angular.forEach($scope.ClaimProviderList, function (item) {
                item.IsChecked = false;
            });
            $scope.ReconcileEraId = 0;
            /*   $scope.ReconcileERAStatusId = 0;*/
        }



    }

    $scope.openattachmentfile = function (url) {
        url = url || "";
        if (url != "") {
            window.open(url);
        }
    }


    $scope.Changesubtab = function (val) {
        $scope.Subtab = val;
        if ($scope.Subtab == 1) {
            let obj = {
                "OrganizationId": $scope.HospitalId,
                "PayorId": $scope.mainEOBPaymentPostingObj.PayorId,
                "PageSize": 100,
                "PageNumber": 1
            }
            eHnoteInsuranceService.GetCapitationList(obj).then(function (resp) {
                if (resp.data.Status == "Success") {
                    $scope.CapitationList = resp.data.rows || [];
                    $scope.CapitationListcount = resp.data.count || [];
                    $scope.GetEOBClaimDetails();
                } else {
                    alertify.error(resp.data.Message);
                }
            });
        } else {
            $scope.GetEOBClaimDetails();
        }
        
        $scope.mainEOBPaymentPostingObj.IsChecked = false;

        
    }




    $scope.GetSearchObject = function () {
        var obj = {
            "SettlementStatusId": '',
        }
        return obj;
    }
    $scope.Settledinit = function (val) {
        $scope.SearchObj = $scope.GetSearchObject();
        val = val || 1;
        //$scope.ReconcileEraId = $scope.ReconcileEraId || 0;
        //if ($scope.ReconcileEraId != 0) {
        //    val = $scope.isAllPaidDenial ? 3 : (!$scope.isApprovedInd ? 2 : 1);
        //}

        $scope.Subtab = val || 1;

        //if ($scope.ReconcileERAStatusId == 5) {
        //    $scope.Subtab = 1
        //}
        if ($scope.Subtab == 1) {
            let obj = {
                "OrganizationId": $scope.HospitalId,
                "PayorId": $scope.mainEOBPaymentPostingObj.PayorId,
                "PageSize": 100,
                "PageNumber": 1
            }
            eHnoteInsuranceService.GetCapitationList(obj).then(function (resp) {
                if (resp.data.Status == "Success") {
                    $scope.CapitationList = resp.data.rows || [];
                    $scope.CapitationListcount = resp.data.count || [];
                    $scope.GetEOBClaimDetails();
                } else {
                    alertify.error(resp.data.Message);
                }
            });
        } else {
            $scope.GetEOBClaimDetails();
        }
        



    }

    $scope.changeSettlement = function (val) {
        $scope.GetEOBClaimDetails();
    }

    $scope.GetEOBClaimDetails = function (Id, status, Pgno) {
        Pgno = Pgno || 1;
        let SettlementStatusList = "1";
        var EraId = 0;
        EraId = $scope.mainEOBPaymentPostingObj.EraId;
        if ($scope.Subtab == 1) {
            SettlementStatusList = "1";
            /*EraId = $scope.mainEOBPaymentPostingObj.EraId;*/
        }
        else if ($scope.Subtab == 2) {
            $scope.SearchObj.SettlementStatusId = $scope.SearchObj.SettlementStatusId || '';
            if ($scope.SearchObj.SettlementStatusId != '') {
                SettlementStatusList = $scope.SearchObj.SettlementStatusId;
            } else {
                SettlementStatusList = "2,3,4,5";
            }

        }
        else if ($scope.Subtab == 3) {
            SettlementStatusList = "6";
        }
        else if ($scope.Subtab == 4) {
            SettlementStatusList = "7";
        }
        else if ($scope.Subtab == 5) {
            SettlementStatusList = "8";
        }
        else if ($scope.Subtab == 6) {
            SettlementStatusList = "9";
        }
        else if ($scope.Subtab == 7) {
            SettlementStatusList = "10";
        }
        else if ($scope.Subtab == 8) {
            SettlementStatusList = "11";
        }
        else {

        }
        let obj = {
            "EOBId": $scope.mainEOBPaymentPostingObj.EOBId,
            "SettlementStatusList": SettlementStatusList || "1",
            "PageSize": $scope.mainEOBPaymentPostingObj.PageSize || 50,
            "PageNumber": $scope.mainEOBPaymentPostingObj.PageNumber || Pgno,
            "EraId": EraId
        }
        eHnoteInsuranceService.GetEOBClaimDetailsByStatus(obj).then(function (resp) {
            $scope.EOBClaimList = [];
            $scope.EOBClaimListCount = 0;
            if (resp.data.status === "Success") {

                $scope.EOBClaimList = resp.data.rows || [];
                $scope.EOBClaimListCount = resp.data.count || 0;

                if ($scope.EOBClaimList.length > 0) {
                    angular.forEach($scope.EOBClaimList, function (Citem) {
                        var WriteOffAmount = 0;
                        var PatientBalance = 0;
                        var InsuranceBalance = 0;
                        var TotalBalance = 0;
                        var TotalPatientResponsibility = 0;
                        var AjustmentAmount = 0;
                        var TotalPaymentAmount = 0;
                        var writeOffTotal = 0;
                        var ttotalChargeAmt = 0;
                        Citem.ERAPaidBy = Citem.ERAPaidBy || null;
                        if (Citem.EOBClaimLineItems.length > 0) {
                            Citem.PatientClaimInfo.PatientClaimLineItems = Citem.PatientClaimInfo.PatientClaimLineItems || [];
                            $scope.Capitationfilter = [];
                            $scope.CapitationList = $scope.CapitationList || [];
                            $scope.PayoreffectiveDate = "";
                            $scope.Payorpercentage = 0;
                            if ($scope.CapitationList.length > 0) {
                                //if ($scope.CapitationList.IsRenderingProviderInd) {

                                //} else {
                                //    let OPHClaim = $filter("filter")($scope.CapitationList[0].PayorBillingProvider, function (fitem, index) { return fitem.RenderingProviderId === Citem.PatientClaimInfo.RenderingProviderId }, true) || [];
                                //}
                                $scope.Capitationfilter = $filter("filter")($scope.CapitationList[0].PayorBillingProvider, function (fitem, index) { return fitem.RenderingProviderId === Citem.PatientClaimInfo.RenderingProviderId }, true) || [];
                                var monthNames = [
                                    'january', 'february', 'march', 'april',
                                    'may', 'june', 'july', 'august',
                                    'september', 'october', 'november', 'december'
                                ];

                                // ── Get month from ClaimDate ──────────────────────
                                var claimDate = new Date(Citem.ClaimDate);
                                var claimMonthIdx = claimDate.getMonth();          // 0-11
                                var claimMonthName = monthNames[claimMonthIdx]
                                var pctKey = claimMonthName + 'percentage';
                                var effKey = claimMonthName + 'effectiveDate';

                                // ── Monthly capitation amount key ─────────────────
                                // e.g. "totalDecemberAmount"
                                var monthCapKey = 'total'
                                    + claimMonthName.charAt(0).toUpperCase()
                                    + claimMonthName.slice(1)
                                    + 'Amount';
                                if ($scope.Capitationfilter.length>0) {
                                    $scope.Payorpercentage = parseFloat($scope.Capitationfilter[0][pctKey] || 0);
                                    $scope.PayoreffectiveDate = $scope.Capitationfilter[0][effKey] || null;
                                    $scope.MonthlyCapAmount = parseFloat($scope.CapitationList[0][monthCapKey] || 0);
                                }
                                
                   
                                //if (claimMonthName =="january") {
                                //    $scope.PayoreffectiveDate =$scope.Capitationfilter[0].januaryeffectiveDate;
                                //    $scope.Payorpercentage = $scope.Capitationfilter[0].januarypercentage;
                                //}
                                
                            }
                            angular.forEach(Citem.PatientClaimInfo.PatientClaimLineItems, function (Aitem) {

                                if ($scope.Subtab == 1) {
                                    Aitem.ServiceAdjustments = [];
                                    let EOBClaim = $filter("filter")(Citem.EOBClaimLineItems, function (fitem, index) { return fitem.ClaimLineItemId === Aitem.ClaimLineItemId }, true) || [];
                                    if (EOBClaim.length > 0) {
                                        Aitem.IsCO24Ind = false;
                                        Aitem.TotalCO24AdjustmentAmount = 0;
                                        PatientBalance += EOBClaim[0].PatientBalance || 0;
                                        InsuranceBalance += EOBClaim[0].InsuranceBalance || 0;
                                        TotalBalance += EOBClaim[0].TotalBalance || 0;
                                        TotalPatientResponsibility += EOBClaim[0].PatientResponsibility || 0;

                                        Aitem.AllowedAmount = EOBClaim[0].AllowedAmount || 0;
                                        Aitem.InsurancePaymentAmount = EOBClaim[0].PaymentAmount || 0;
                                        Aitem.AdjustmentAmount = EOBClaim[0].AdjustmentAmount || 0;
                                        Aitem.InsuranceWriteOff = EOBClaim[0].InsuranceWriteOff || 0;
                                        AjustmentAmount += EOBClaim[0].AdjustmentAmount || 0;
                                        TotalPaymentAmount += Aitem.InsurancePaymentAmount;
                                        writeOffTotal += EOBClaim[0].InsuranceWriteOff;
                                        /*Aitem.ServiceAdjustments = [];*/
                                        let EobServiceAdjustments = EOBClaim[0].ServiceAdjustments || [];
                                        let EOBClaimLineItemDenials = EOBClaim[0].EOBClaimLineItemDenials || [];
                                        if (EobServiceAdjustments.length > 0) {
                                            angular.forEach(EobServiceAdjustments, function (esitem) {
                                                let obj = {
                                                    'AdjustmentAmount': esitem.AdjustmentAmount || 0,
                                                    'AdjustmentId': esitem.AdjustmentId || 0,
                                                    'AdjustmentReasonCode': esitem.AdjustmentReasonCode || 0,
                                                    'AdjustmentReasonId': esitem.AdjustmentReasonId || 0,
                                                    'EOBLineItemId': esitem.EOBLineItemId || 0,
                                                    'GroupCode': esitem.GroupCode || 0,
                                                }

                                                Aitem.ServiceAdjustments.push(obj);
                                                //AjustmentAmount += esitem.AdjustmentAmount || 0;
                                                if (esitem.GroupCode === "CO" && esitem.AdjustmentReasonCode == "24") {
                                                    Aitem.IsCO24Ind = true;
                                                    Aitem.TotalCO24AdjustmentAmount += parseFloat(esitem.AdjustmentAmount || 0);
                                                }

                                            });

                                        }

                                        Aitem.TotalCO24AdjustmentAmount = parseFloat((Aitem.TotalCO24AdjustmentAmount).toFixed(2));

                                        // ── Capitation Discount Calculation (only if CO-24) ───

                                        if ($scope.mainEOBPaymentPostingObj.ProcessingTypeId == 3) {
                                            if (Aitem.IsCO24Ind === true && Aitem.TotalCO24AdjustmentAmount > 0) {

                                                var chargeAmount = parseFloat(Aitem.TotalChargeAmount || 0);
                                                var co24Amount = parseFloat(Aitem.TotalCO24AdjustmentAmount || 0);
                                                var discountPct = parseFloat($scope.Payorpercentage);

                                                // ── Formula ───────────────────────────────────────
                                                // DiscountAmount   = CO24Amount * DiscountPct / 100
                                                // InsurancePaid    = ChargeAmount - DiscountAmount
                                                // WriteOff         = DiscountAmount
                                                // InsuranceBalance = DiscountAmount
                                                // AllowedAmount    = ChargeAmount  (full charge)
                                                // TotalBalance     = DiscountAmount

                                                var discountAmount = parseFloat(((co24Amount * discountPct) / 100).toFixed(2));
                                                var insurancePaid = parseFloat((co24Amount - discountAmount).toFixed(2));
                                                var writeOff = discountAmount;
                                                var insBalance = discountAmount;

                                                // ── Override EOB values with capitation calc ──────
                                                Aitem.DiscountAmount = discountAmount;
                                                Aitem.TotalBalance = discountAmount;
                                                Aitem.WriteOffAmount = writeOff;
                                                //  Aitem.InsuranceBalance = insBalance;
                                                Aitem.AllowedAmount = parseFloat(chargeAmount.toFixed(2));
                                                Aitem.InsurancePaymentAmount = insurancePaid;

                                                // ── Update running totals ─────────────────────────
                                                // Remove old EOB values first, add new capitation values
                                                TotalPaymentAmount -= (EOBClaim[0].PaymentAmount || 0);   // remove old
                                                TotalPaymentAmount += insurancePaid;                        // add new

                                                writeOffTotal -= (EOBClaim[0].InsuranceWriteOff || 0); // remove old
                                                writeOffTotal += writeOff;                              // add new

                                                InsuranceBalance -= (EOBClaim[0].InsuranceBalance || 0);  // remove old
                                                InsuranceBalance += insBalance;                            // add new

                                                TotalBalance -= (EOBClaim[0].TotalBalance || 0);      // remove old
                                                TotalBalance += discountAmount;                        // add new

                                                // Round running totals
                                                TotalPaymentAmount = parseFloat(TotalPaymentAmount.toFixed(2));
                                                writeOffTotal = parseFloat(writeOffTotal.toFixed(2));
                                                InsuranceBalance = parseFloat(InsuranceBalance.toFixed(2));
                                                TotalBalance = parseFloat(TotalBalance.toFixed(2));



                                                var templist = $filter("filter")($scope.PaymentReasonList, { "AdjustmentReasonCode": '151' }, true) || [];
                                                // if (Aitem.ServiceAdjustments.length == 0) {
                                                let obj = {
                                                    "AdjustmentId": 0,
                                                    "EOBLineItemId": Aitem.EOBLineItemId || 0,
                                                    "ClaimLineItemId": Aitem.ClaimLineItemId || "",
                                                    "AdjustmentReasonCode": templist[0].AdjustmentReasonCode,
                                                    "AdjsutmentDescription": templist[0].AdjsutmentDescription,
                                                    "GroupCode": templist[0].GroupCode || '',
                                                    "AdjustmentReasonId": templist[0].AdjustmentReasonId,
                                                    "AdjustmentAmount": Aitem.WriteOffAmount || null,
                                                    "PayorPostingStatusId": 1,
                                                    "PayorPostingStatus": 'Adjustment',
                                                    "Notes": "",
                                                    "DeleteInd": "Y",
                                                    "ActiveInd": "N",
                                                }
                                                Aitem.ServiceAdjustments.push(obj);
                                                // }

                                                console.log('── CO-24 Capitation Calc ─────────────────────');
                                                console.log('Claim Line     : ' + Aitem.ClaimLineItemId);
                                                console.log('ServiceCode    : ' + Aitem.ServiceCode);
                                                console.log('ChargeAmount   : $' + chargeAmount);
                                                console.log('CO24 Amount    : $' + co24Amount);
                                                console.log('Discount %     : ' + discountPct + '%');
                                                console.log('Discount Amt   : $' + discountAmount);
                                                console.log('Insurance Paid : $' + insurancePaid);
                                                console.log('Write-Off      : $' + writeOff);
                                                console.log('Ins. Balance   : $' + insBalance);
                                                console.log('─────────────────────────────────────────────');

                                            }
                                        }
                                        

                                        
                                    }

                                }
                                else if ($scope.Subtab == 3) {

                                    let EOBClaim = $filter("filter")(Citem.EOBClaimLineItems, function (fitem, index) { return fitem.ClaimLineItemId === Aitem.ClaimLineItemId }) || [];
                                    if (EOBClaim.length > 0) {
                                        PatientBalance += EOBClaim[0].PatientBalance || 0;
                                        InsuranceBalance += EOBClaim[0].InsuranceBalance || 0;
                                        TotalBalance += EOBClaim[0].TotalBalance || 0;
                                        TotalPatientResponsibility += EOBClaim[0].PatientResponsibility || 0;
                                        Aitem.AllowedAmount = EOBClaim[0].AllowedAmount || 0;
                                        Aitem.InsurancePaymentAmount = EOBClaim[0].PaymentAmount || 0;
                                        TotalPaymentAmount += Aitem.InsurancePaymentAmount;
                                        Aitem.AdjustmentAmount = EOBClaim[0].AdjustmentAmount || 0;
                                        Aitem.InsuranceWriteOff = EOBClaim[0].InsuranceWriteOff || 0;
                                        AjustmentAmount += EOBClaim[0].AdjustmentAmount || 0;
                                        writeOffTotal += EOBClaim[0].InsuranceWriteOff;
                                        EOBClaim[0].Modifier1 = EOBClaim[0].Modifier1 != null ? EOBClaim[0].Modifier1 : Aitem.Modifier1;
                                        EOBClaim[0].Modifier2 = EOBClaim[0].Modifier2 != null ? EOBClaim[0].Modifier2 : Aitem.Modifier2;
                                        EOBClaim[0].Modifier3 = EOBClaim[0].Modifier3 != null ? EOBClaim[0].Modifier3 : Aitem.Modifier3;
                                        EOBClaim[0].Modifier4 = EOBClaim[0].Modifier4 != null ? EOBClaim[0].Modifier4 : Aitem.Modifier4;

                                        Aitem.ServiceAdjustments = [];
                                        let EobServiceAdjustments = EOBClaim[0].ServiceAdjustments || [];
                                        if (EobServiceAdjustments.length > 0) {
                                            angular.forEach(EobServiceAdjustments, function (esitem) {
                                                let obj = {
                                                    'AdjustmentAmount': esitem.AdjustmentAmount || 0,
                                                    'AdjustmentId': esitem.AdjustmentId || 0,
                                                    'AdjustmentReasonCode': esitem.AdjustmentReasonCode || 0,
                                                    'AdjustmentReasonId': esitem.AdjustmentReasonId || 0,
                                                    'EOBLineItemId': esitem.EOBLineItemId || 0,
                                                    'GroupCode': esitem.GroupCode || 0,
                                                }

                                                Aitem.ServiceAdjustments.push(obj);
                                                //AjustmentAmount += esitem.AdjustmentAmount || 0;


                                            });

                                        }

                                    }
                                }
                                else if ($scope.Subtab == 2 || $scope.Subtab == 4 || $scope.Subtab == 5 || $scope.Subtab == 6 || $scope.Subtab == 7) {

                                    let EOBClaim = $filter("filter")(Citem.EOBClaimLineItems, function (fitem, index) { return fitem.ClaimLineItemId === Aitem.ClaimLineItemId }) || [];
                                    if (EOBClaim.length > 0) {
                                        PatientBalance += EOBClaim[0].PatientBalance || 0;
                                        InsuranceBalance += EOBClaim[0].InsuranceBalance || 0;
                                        TotalBalance += EOBClaim[0].TotalBalance || 0;
                                        TotalPatientResponsibility += EOBClaim[0].PatientResponsibility || 0;
                                        Aitem.AllowedAmount = EOBClaim[0].AllowedAmount || 0;
                                        Aitem.InsurancePaymentAmount = EOBClaim[0].PaymentAmount || 0;
                                        TotalPaymentAmount += Aitem.InsurancePaymentAmount;
                                        Aitem.AdjustmentAmount = EOBClaim[0].AdjustmentAmount || 0;
                                        Aitem.InsuranceWriteOff = EOBClaim[0].InsuranceWriteOff || 0;
                                        AjustmentAmount += EOBClaim[0].AdjustmentAmount || 0;
                                        writeOffTotal += EOBClaim[0].InsuranceWriteOff;
                                        EOBClaim[0].Modifier1 = EOBClaim[0].Modifier1 != null ? EOBClaim[0].Modifier1 : Aitem.Modifier1;
                                        EOBClaim[0].Modifier2 = EOBClaim[0].Modifier2 != null ? EOBClaim[0].Modifier2 : Aitem.Modifier2;
                                        EOBClaim[0].Modifier3 = EOBClaim[0].Modifier3 != null ? EOBClaim[0].Modifier3 : Aitem.Modifier3;
                                        EOBClaim[0].Modifier4 = EOBClaim[0].Modifier4 != null ? EOBClaim[0].Modifier4 : Aitem.Modifier4;

                                        Aitem.ServiceAdjustments = [];
                                        let EobServiceAdjustments = EOBClaim[0].ServiceAdjustments || [];
                                        let EOBClaimLineItemDenials = EOBClaim[0].EOBClaimLineItemDenials || [];
                                        if (EobServiceAdjustments.length > 0) {
                                            angular.forEach(EobServiceAdjustments, function (esitem) {
                                                let obj = {
                                                    'AdjustmentAmount': esitem.AdjustmentAmount || 0,
                                                    'AdjustmentId': esitem.AdjustmentId || 0,
                                                    'AdjustmentReasonCode': esitem.AdjustmentReasonCode || 0,
                                                    'AdjustmentReasonId': esitem.AdjustmentReasonId || 0,
                                                    'EOBLineItemId': esitem.EOBLineItemId || 0,
                                                    'GroupCode': esitem.GroupCode || 0,
                                                }

                                                Aitem.ServiceAdjustments.push(obj);

                                                //AjustmentAmount += esitem.AdjustmentAmount || 0;


                                            });

                                        }

                                        // Citem.ClaimAdjustmentAmount = AjustmentAmount;

                                    }
                                }


                                else {
                                    PatientBalance += Aitem.PatientBalance || 0;
                                    InsuranceBalance += Aitem.InsuranceBalance || 0;
                                    TotalBalance += Aitem.TotalBalance || 0;
                                    TotalPatientResponsibility += Aitem.PatientResponsibilityAmount || 0;
                                    TotalPaymentAmount += Aitem.InsurancePaymentAmount;
                                }

                                var lineitemtotalcharge = 0;

                                console.log(Citem.PatientClaimInfo.IsSecondaryChargeEditedClaim + "__" + Citem.PatientClaimInfo.CurrentResponsibilityId);

                                if (Citem.PatientClaimInfo.IsSecondaryChargeEditedClaim && Citem.PatientClaimInfo.CurrentResponsibilityId===3) {
                                    lineitemtotalcharge = Aitem.Quantity * Aitem.SecondaryUnitCharge;
                                } else {
                                    lineitemtotalcharge = Aitem.Quantity * Aitem.UnitCharge;
                                }
                                ttotalChargeAmt += lineitemtotalcharge;
                                
                            });

                            Citem.ERAId = Citem.ERAId || null;

                            if (Citem.ERAId != null) {
                                Citem.PatientClaimInfo.TotalPatientBalance = PatientBalance;
                                Citem.PatientClaimInfo.TotalInsuranceBalance = InsuranceBalance;
                                Citem.PatientClaimInfo.TotalBalance = TotalBalance;
                                Citem.PatientClaimInfo.TotalPatientResponsibilityAmount = TotalPatientResponsibility;
                                Citem.PatientClaimInfo.TotalInsurancePayment = TotalPaymentAmount;
                                Citem.PatientClaimInfo.TotalWriteOffAmount = writeOffTotal;
                                Citem.PatientClaimInfo.TotalAdjustmentAmount = AjustmentAmount || 0;

                            }
                            else {
                                Citem.PatientClaimInfo.TotalPatientBalance = PatientBalance;
                                Citem.PatientClaimInfo.TotalInsuranceBalance = InsuranceBalance;
                                Citem.PatientClaimInfo.TotalBalance = TotalBalance;
                                Citem.PatientClaimInfo.TotalPatientResponsibilityAmount = TotalPatientResponsibility;
                                Citem.PatientClaimInfo.TotalInsurancePayment = TotalPaymentAmount;
                                Citem.PatientClaimInfo.TotalWriteOffAmount = writeOffTotal;
                                Citem.PatientClaimInfo.TotalAdjustmentAmount = AjustmentAmount || 0;
                            }




                        }
                        else {
                            angular.forEach(Citem.PatientClaimInfo.PatientClaimLineItems, function (Aitem) {
                                Aitem.ServiceAdjustments = [];
                                //if ($scope.mainEOBPaymentPostingObj.IsCapitationInd) {
                                //    var discountAmount = (Aitem.TotalChargeAmount * $scope.mainEOBPaymentPostingObj.CapitationDiscount) / 100;

                                //    Aitem.TotalBalance = parseFloat(discountAmount.toFixed(2));
                                //    Aitem.WriteOffAmount = parseFloat(discountAmount.toFixed(2));
                                //    Aitem.InsuranceBalance = parseFloat(discountAmount.toFixed(2));
                                //    Aitem.AllowedAmount = parseFloat(Aitem.TotalChargeAmount.toFixed(2));
                                //    Aitem.InsurancePaymentAmount = parseFloat((Aitem.TotalChargeAmount - discountAmount).toFixed(2));

                                //    var templist = $filter("filter")($scope.PaymentReasonList, { "AdjustmentReasonCode": '151' }, true) || [];
                                //    if (Aitem.ServiceAdjustments.length == 0) {
                                //        let obj = {
                                //            "AdjustmentId": 0,
                                //            "EOBLineItemId": Aitem.EOBLineItemId || 0,
                                //            "ClaimLineItemId": Aitem.ClaimLineItemId || "",
                                //            "AdjustmentReasonCode": templist[0].AdjustmentReasonCode,
                                //            "AdjsutmentDescription": templist[0].AdjsutmentDescription,
                                //            "GroupCode": templist[0].GroupCode || '',
                                //            "AdjustmentReasonId": templist[0].AdjustmentReasonId,
                                //            "AdjustmentAmount": Aitem.WriteOffAmount || null,
                                //            "PayorPostingStatusId": 1,
                                //            "PayorPostingStatus": 'Adjustment',
                                //            "Notes": "",
                                //            "DeleteInd": "Y",
                                //            "ActiveInd": "N",
                                //        }
                                //        Aitem.ServiceAdjustments.push(obj);
                                //    }
                                //}
                        

                                WriteOffAmount += Aitem.WriteOffAmount || 0;
                                PatientBalance += Aitem.PatientBalance || 0;
                                InsuranceBalance += Aitem.InsuranceBalance || 0;
                                TotalBalance += Aitem.TotalBalance || 0;
                                TotalPatientResponsibility += Aitem.PatientResponsibilityAmount || 0;
                                TotalPaymentAmount += Aitem.InsurancePaymentAmount;
                                AjustmentAmount += Aitem.AjustmentAmount;
                               
                                var lineitemtotalcharge = 0;

                                console.log(Citem.PatientClaimInfo.IsSecondaryChargeEditedClaim + "__" + Citem.PatientClaimInfo.CurrentResponsibilityId);

                                if (Citem.PatientClaimInfo.IsSecondaryChargeEditedClaim && Citem.PatientClaimInfo.CurrentResponsibilityId === 3) {
                                    lineitemtotalcharge = Aitem.Quantity * Aitem.SecondaryUnitCharge;
                                } else {
                                    lineitemtotalcharge = Aitem.Quantity * Aitem.UnitCharge;
                                }
                                ttotalChargeAmt += lineitemtotalcharge;

                            });
                            Citem.PatientClaimInfo.TotalWriteOffAmount = WriteOffAmount;
                            Citem.PatientClaimInfo.TotalPatientBalance = PatientBalance;
                            Citem.PatientClaimInfo.TotalInsuranceBalance = InsuranceBalance;
                            Citem.PatientClaimInfo.TotalBalance = TotalBalance;
                            Citem.PatientClaimInfo.TotalPatientResponsibilityAmount = TotalPatientResponsibility;
                            Citem.PatientClaimInfo.TotalInsurancePayment = TotalPaymentAmount;
                            Citem.PatientClaimInfo.TotalAdjustmentAmount = AjustmentAmount || 0;
                        }
                        //commented for display clima level adjustment

                        console.log(AjustmentAmount + "__AjustmentAmount");
                        console.log(ttotalChargeAmt + "__ttotalChargeAmt");


                        /*Citem.PatientClaimInfo.TotalChargeAmount = Citem.PatientClaimInfo.TotalChargeAmount || 0;*/
                        Citem.PatientClaimInfo.TotalChargeAmount = ttotalChargeAmt|| 0;
                        if (Citem.PatientClaimInfo.TotalChargeAmount == 0) {
                            Citem.PatientClaimInfo.TotalChargeAmount = Citem.PatientClaimInfo.TotalClaimAmount;
                        }

                    });
                }
                $scope.GetParticularEobdetails(Id, status);

                status = status || "";

                if (status === "Patient") {
                    let filterEOBClaimlist = $filter("filter")($scope.EOBClaimList, function (item) { return item.EOBClaimInfoId === Id }, true) || [];
                    if (filterEOBClaimlist.length > 0) {
                        var TabName = ($scope.Subtab === 1 || $scope.Subtab === 7) ? "Post" : "Edit";
                        $scope.openPostPaymentPopup(filterEOBClaimlist[0], TabName);
                    }
                } else if (status === "Denial") {
                    let filterEOBClaimlist = $filter("filter")($scope.EOBClaimList, function (item) { return item.EOBClaimInfoId === Id }, true) || [];
                    if (filterEOBClaimlist.length > 0) {
                        $scope.openPostPaymentPopup(filterEOBClaimlist[0]);
                    }
                    
                }
                else if (status === "Success") {
                    $scope.OpenPatientAlertpopup();
                }
            }

            else {
                alertify.error(resp.data.Message);
            }
        });
    }

    $scope.SearchAllPaymentDetails = function (Pageno) {

        $scope.EOBSearchObj.PageNumber = Pageno || 1;

        var postingfromdate = $scope.EOBSearchObj.PostingFromDate != null ? $filter('date')(new Date($scope.EOBSearchObj.PostingFromDate), "yyyy-MM-dd") : null;
        var postingtodate = $scope.EOBSearchObj.PostingToDate != null ? $filter('date')(new Date($scope.EOBSearchObj.PostingToDate), "yyyy-MM-dd") : null;
        var depositfromdate = $scope.EOBSearchObj.DepositFromDate != null ? $filter('date')(new Date($scope.EOBSearchObj.DepositFromDate), "yyyy-MM-dd") : null;
        var deposittodate = $scope.EOBSearchObj.DepositToDate != null ? $filter('date')(new Date($scope.EOBSearchObj.DepositToDate), "yyyy-MM-dd") : null;

        var Frezobj = {
            "PayorObj": $scope.EOBSearchObj.PayorObj || '',
            "PayorId": $scope.EOBSearchObj.PayorId || 0,
            "PostingFromDate": $scope.EOBSearchObj.PostingFromDate || null,
            "PostingToDate": $scope.EOBSearchObj.PostingToDate || null,
            "DepositFromDate": $scope.EOBSearchObj.DepositFromDate || null,
            "DepositToDate": $scope.EOBSearchObj.DepositToDate || null,
            "AppliedStatusId": $scope.EOBSearchObj.AppliedStatusId || 0,
            "PaymentMethodId": $scope.EOBSearchObj.PaymentMethodId || 0,
            "OrganizationBillingProviderId": $scope.EOBSearchObj.OrganizationBillingProviderId || 0,
            "DepositStatusId": $scope.EOBSearchObj.DepositStatusId || 1,
            "ReferenceNumber": $scope.EOBSearchObj.ReferenceNumber || '',
            "PatientClaimNumber": $scope.EOBSearchObj.PatientClaimNumber || "",
        };
        eHnoteMasterDataService.addPostingPayerfreezingList(Frezobj);

        let param = {
            "OrganizationId": $scope.HospitalId || 0,
            "BillingProviderId": $scope.EOBSearchObj.OrganizationBillingProviderId || 0,
            "PayorId": $scope.EOBSearchObj.PayorId || 0,
            "EOBName": $scope.EOBSearchObj.EOBName || "",
            "ReferenceNumber": $scope.EOBSearchObj.ReferenceNumber || "",
            "PatientClaimNumber": $scope.EOBSearchObj.PatientClaimNumber || "",
            "PageSize": 50,
            "PageNumber": $scope.EOBSearchObj.PageNumber || 1,
            "PostingFrom": postingfromdate || null,
            "PostingTo": postingtodate || null,
            "PaymentFrom": depositfromdate || null,
            "PaymentTo": deposittodate || null,
            "DepositStatusId": $scope.EOBSearchObj.DepositStatusId || 0,
            "AppliedStatusId": $scope.EOBSearchObj.AppliedStatusId || 0,
            "PaymentMethodId": $scope.EOBSearchObj.PaymentMethodId || 0,
            "SortById": $scope.EOBSearchObj.SortById || 0,
            "SortByName": $scope.EOBSearchObj.SortByName || "",
            "ProcessingTypeId": $scope.EOBSearchObj.ProcessingTypeId || 0,
            "PaymentStatusId": $scope.EOBSearchObj.PaymentStatusId || 0,
            "EraId": 0
        }

        eHnoteInsuranceService.GetOrganizationEOBsList(param).then(function (resp) {
            if (resp.data.status == "Success") {
                if (resp.data.rows.length > 0) {
                    $scope.mainEOBPaymentPostingObj.EOBPaymentPostingList = resp.data.rows || [];

                    $scope.TotalERAAmount = resp.data.TotalPaymentAmount;
                    $scope.TotalERAManualAmount = resp.data.manualtotalpayment;
                    $scope.TotalERAElectronicAmount = resp.data.electronictotalpayment;

                    $scope.EOBSearchObj.Count = resp.data.count;
                } else {
                    $scope.mainEOBPaymentPostingObj.EOBPaymentPostingList = [];
                }

            } else {
                alertify.error(resp.data.Message);
            }
        });
    }

    $scope.refreshAllPaymentDetails = function () {
        $scope.EOBSearchObj = $scope.GetEOBSearchObject();

        var Frezobj = {
            "PayorObj": $scope.EOBSearchObj.PayorObj || '',
            "PayorId": $scope.EOBSearchObj.PayorId || 0,
            "PostingFromDate": $scope.EOBSearchObj.PostingFromDate || null,
            "PostingToDate": $scope.EOBSearchObj.PostingToDate || null,
            "DepositFromDate": $scope.EOBSearchObj.DepositFromDate || null,
            "DepositToDate": $scope.EOBSearchObj.DepositToDate || null,
            "AppliedStatusId": $scope.EOBSearchObj.AppliedStatusId || 0,
            "PaymentMethodId": $scope.EOBSearchObj.PaymentMethodId || 0,
            "OrganizationBillingProviderId": $scope.EOBSearchObj.OrganizationBillingProviderId || 0,
            "DepositStatusId": $scope.EOBSearchObj.DepositStatusId || 1,
            "ReferenceNumber": $scope.EOBSearchObj.ReferenceNumber || '',
            "PatientClaimNumber": $scope.EOBSearchObj.PatientClaimNumber || '',
        };
        eHnoteMasterDataService.addPostingPayerfreezingList(Frezobj);

        $scope.SearchAllPaymentDetails();
    }

    $scope.DeleteEOBPaymenylist = function (item) {
        alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to delete?</h4>", function () {
            if (item.EOBId != 0) {
                $scope.mainEOBPaymentPostingObj.EOBId = item.EOBId || 0;
                $scope.mainEOBPaymentPostingObj.DeleteInd = "Y";
                $scope.AddUpdateEOBPaymentDetails();
            }

            $scope.$apply();
        }, function () {

        });
    }

    $scope.OnSelectSortOrder = function (Id) {
        var templist = $filter("filter")($scope.GetSortByFilterList, { "SortById": Id }, true) || [];
        if (templist.length > 0) {
            $scope.EOBSearchObj.SortById = templist[0].SortById;
            $scope.EOBSearchObj.SortByName = templist[0].SortByName;
        }
        else {
            $scope.EOBSearchObj.SortById = '';
            $scope.EOBSearchObj.SortByName = '';
        }
        $scope.SearchAllPaymentDetails();
    }

    $scope.ClickOnPostingPaymentType = function (id) {
        $scope.EOBSearchObj.PostingPaymentTab = id;
        $scope.FreezPostingTab = id;
        $scope.EOBSearchObj.ProcessingTypeId = id - 1;
        $scope.FreezProcesstypeid = $scope.EOBSearchObj.ProcessingTypeId;
        $scope.SearchAllPaymentDetails();
    }



    $scope.addPaymentPostingForSelectedClaims = function () {

        $scope.IsAllClaims = false;
        let filterobj1 = $filter("filter")($scope.EOBClaimList, { "IsSelected": true }) || [];


        if (filterobj1.length === 0) {
            alertify.error("Please select a claim to post");
            return false;
        }
        //if (filterobj1.length === $scope.EOBClaimList.length) {
        //    $scope.IsAllClaims = true;
        //}


        //var claimsList = [];
        //angular.forEach($scope.EOBClaimList, function (mitems) {
        //    if (mitems.IsSelected) {
        //        claimsList.push(mitems.PatientClaimId);
        //    }
        //});

        var claimsListString = "";
        angular.forEach($scope.EOBClaimList, function (mitems) {
            if (mitems.IsSelected) {
                if (claimsListString) {
                    claimsListString += ",";
                }
                claimsListString += mitems.PatientClaimId;
            }
        });

        $scope.claimsListString = claimsListString;
        console.log($scope.claimsListString);





        var params = {
            "UserId": $scope.UserId,
            "EraId": $scope.mainEOBPaymentPostingObj.EraId || 0,
            "IsPostPayment": true,
            "PostingDate": currentdate,
            "IsAllClaims": $scope.IsAllClaims,
            "claimsListString": $scope.claimsListString || ""
        }






        console.log(JSON.stringify(params));

        eHnoteInsuranceService.UpdateERAToBeActive(params, onSuccess, onError);
        function onSuccess(resp) {
            if (resp.Status === 'Success') {
                alertify.success("Posted Successfully");
                $scope.Changesubtab(2)
            }
            console.log(resp);

        }
        function onError(reponse) {
        }
    }

    $scope.changepagination = function (val) {
        $scope.mainEOBPaymentPostingObj.PageNumber = val;
        $scope.GetEOBClaimDetails();
    }

    $scope.DeleteNewFiles = function (index) {
        $scope.mainEOBPaymentPostingObj.TempDocumentDetails.splice(index, 1);
    }

    $scope.SelectAllClaims = function () {
        if ($scope.mainEOBPaymentPostingObj.IsChecked) {
            angular.forEach($scope.EOBClaimList, function (item) {
                item.IsSelected = true;
            });
        } else {
            angular.forEach($scope.EOBClaimList, function (item) {
                item.IsSelected = false;
            });
        }
    }
    $scope.payerFilterPopover = {
        templateUrl: 'payerFilterPopover.html',
    };
    $scope.closeFilterPopover = function () {
        angular.element(document.querySelector('.popover')).remove();
    };





    $scope.CancelEOBClaim = function (mainitem) {


        var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'><b>Are you sure you want to cancel the payment?</h4></br><h4 class='txt-body-centre'>If you proceed, all applied amounts will be reverted, and any patient payment will be converted back into a deposit.</h4>", function () {


            let ClaimLineItems = [];
            let TransactionSourceId = 1;
            let TransactionSource = "Primary Insurance";
            let TransactionTypeId = 32;
            let TransactionType = "PrimaryInsurancePayment";

            if (mainitem.IdentifierId == 2) {
                TransactionSourceId = 2;
                TransactionSource = "Secondary Insurance";
                TransactionTypeId = 36;
                TransactionType = "SecondaryInsPayment";
            }

            let SettlementStatusId = 1;
            let SettlementStatus = "Ready to Settle";


            if (mainitem.EOBClaimLineItems.length > 0) {
                angular.forEach(mainitem.EOBClaimLineItems, function (item) {


                    item.CurrentInsurancePaymentAmount = item.CurrentInsurancePaymentAmount || 0;
                    item.CurrentAdjustmentAmount = item.CurrentAdjustmentAmount || 0;
                    item.CurrentPatientBalance = item.CurrentPatientBalance || 0;

                    let ClaimTransaction = [];
                    if (item.CurrentInsurancePaymentAmount != 0) {
                        let InsurancePaymentAmount = parseFloat(item.CurrentInsurancePaymentAmount) || 0;
                        let Tranobj = {
                            "ClaimTransactionId": 0,
                            "PatientInsuranceDetailId": mainitem.PatientInsuranceDetailId,
                            "ClaimLineItemId": item.ClaimLineItemId,
                            "OrganizationId": $scope.HospitalId,
                            "TransactionDate": $filter('date')($scope.CurreDate, "yyyy-MM-dd"),
                            "TransactionAmount": InsurancePaymentAmount,
                            "PatientAmount": 0,
                            "InsuranceAmount": InsurancePaymentAmount,
                            "EOBId": mainitem.EOBId,
                            "PayorId": mainitem.PrimaryInsuranceId,
                            "AdjustmentReasonId": null,
                            "AdjustmentReasonCode": "",
                            "ReferenceNumber": mainitem.ReferenceNumber,
                            "TransactionTypeId": 102,
                            "TransactionType": "Insurance Payment Reversal",
                            "TransactionSourceId": TransactionSourceId,
                            "TransactionSource": TransactionSource,
                            //"SettlementStatusId": SettlementStatusId || 1,
                            //"SettlementStatus": SettlementStatus || "Ready to Settle",
                            "SettlementStatusId": 7,
                            "SettlementStatus": "Cancel Payment",
                            "TransactionNotes": ""
                        }
                        ClaimTransaction.push(Tranobj);
                    }
                    if (item.CurrentAdjustmentAmount != 0) {
                        let AdjustmentAmount = parseFloat(item.CurrentAdjustmentAmount) || 0;
                        let Tranobj = {
                            "ClaimTransactionId": 0,
                            "ClaimLineItemId": item.ClaimLineItemId,
                            "PatientInsuranceDetailId": mainitem.PatientInsuranceDetailId,
                            "OrganizationId": $scope.HospitalId,
                            "TransactionDate": $filter('date')($scope.CurreDate, "yyyy-MM-dd"),
                            "TransactionAmount": AdjustmentAmount,
                            "PatientAmount": 0,
                            //"InsuranceAmount": 0,
                            "InsuranceAmount": AdjustmentAmount,
                            "EOBId": mainitem.EOBId,
                            "PayorId": mainitem.PrimaryInsuranceId,
                            "AdjustmentReasonId": null,
                            "AdjustmentReasonCode": "",
                            "ReferenceNumber": mainitem.ReferenceNumber,
                            "TransactionTypeId": 104,
                            "TransactionType": "Adjustment Reversal",
                            "TransactionSourceId": TransactionSourceId,
                            "TransactionSource": TransactionSource,
                            //"SettlementStatusId": SettlementStatusId || 1,
                            //"SettlementStatus": SettlementStatus || "Ready to Settle",
                            "SettlementStatusId": 7,
                            "SettlementStatus": "Cancel Payment",
                            "TransactionNotes": ""
                        }
                        //if (item.IsPatientBalanceReceived || item.IsPatientPaymentDone) {
                        //    Tranobj.InsuranceAmount = 0;
                        //}
                        ClaimTransaction.push(Tranobj);
                    }
                    if (item.CurrentPatientBalance != 0) {
                        let PatientBalance = parseFloat(item.CurrentPatientBalance) || 0;
                        let Tranobj = {
                            "ClaimTransactionId": 0,
                            "ClaimLineItemId": item.ClaimLineItemId,
                            "PatientInsuranceDetailId": mainitem.PatientInsuranceDetailId,
                            "OrganizationId": $scope.HospitalId,
                            "TransactionDate": $filter('date')($scope.CurreDate, "yyyy-MM-dd"),
                            "TransactionAmount": 0,
                            "PatientAmount": PatientBalance,
                            //"InsuranceAmount": 0,
                            "InsuranceAmount": PatientBalance || 0,
                            "EOBId": mainitem.EOBId,
                            "PayorId": mainitem.PrimaryInsuranceId,
                            "AdjustmentReasonId": null,
                            "AdjustmentReasonCode": "",
                            "ReferenceNumber": mainitem.ReferenceNumber,
                            "TransactionTypeId": 105,
                            "TransactionType": "Patient Responsibility Reversal",
                            "TransactionSourceId": TransactionSourceId,
                            "TransactionSource": TransactionSource,
                            //"SettlementStatusId": SettlementStatusId || 1,
                            //"SettlementStatus": SettlementStatus || "Ready to Settle",
                            "SettlementStatusId": 7,
                            "SettlementStatus": "Cancel Payment",
                            "TransactionNotes": ""
                        }

                        ClaimTransaction.push(Tranobj);
                    }
                    if (item.CurrentWriteOffAmount != 0) {
                        let WriteOffAmount = parseFloat(item.CurrentWriteOffAmount) || 0;
                        let Tranobj = {
                            "ClaimTransactionId": 0,
                            "ClaimLineItemId": item.ClaimLineItemId,
                            "PatientInsuranceDetailId": mainitem.PatientInsuranceDetailId,
                            "OrganizationId": $scope.HospitalId,
                            "TransactionDate": $filter('date')($scope.CurreDate, "yyyy-MM-dd"),
                            "TransactionAmount": WriteOffAmount,
                            "PatientAmount": 0,
                            "InsuranceAmount": WriteOffAmount,
                            "EOBId": mainitem.EOBId,
                            "PayorId": mainitem.PrimaryInsuranceId,
                            "AdjustmentReasonId": null,
                            "AdjustmentReasonCode": "",
                            "ReferenceNumber": mainitem.ReferenceNumber,
                            "TransactionTypeId": 103,
                            "TransactionType": "WriteOff Reversal",
                            "TransactionSourceId": TransactionSourceId,
                            "TransactionSource": TransactionSource,
                            //"SettlementStatusId": SettlementStatusId || 1,
                            //"SettlementStatus": SettlementStatus || "Ready to Settle",
                            "SettlementStatusId": 7,
                            "SettlementStatus": "Cancel Payment",
                            "TransactionNotes": ""
                        }

                        ClaimTransaction.push(Tranobj);
                    }
                    let postobj = {
                        "EOBLineItemId": item.EOBLineItemId || null,
                        "ClaimLineItemId": item.ClaimLineItemId,
                        "PatientClaimId": item.PatientClaimId,
                        "ServiceId": item.ServiceId,
                        "PatientBalance": item.CurrentPatientBalance,
                        "InsuranceBalance": item.CurrentInsuranceBalance,
                        "PaymentAmount": item.CurrentInsurancePaymentAmount,
                        "AllowedAmount": item.CurrentAllowedAmount,
                        "CoInsuranceAmount": item.CurrentCoInsuranceAmount,
                        "DeductibleAmount": item.CurrentDeductibleAmount,
                        "CoPaymentAmount": item.CurrentCoPaymentAmount,
                        "AdjustmentAmount": item.CurrentAdjustmentAmount,
                        "InsuranceWriteOff": item.CurrentWriteOffAmount,
                        "PatientResponsibility": item.CurrentPatientResponsibilityAmount,
                        "OtherPatientAmount": null,
                        "PatientWriteOffAmount": null,
                        "TotalBalance": item.CurrentTotalBalance,
                        "ServiceAdjustments": item.ServiceAdjustments || [],
                        "DenialCodes": item.DenialCodes || [],
                        "ClaimTransaction": ClaimTransaction || [],
                    };
                    if (postobj.DenialCodes.length > 0) {
                        denialCount++;
                    }
                    ClaimLineItems.push(postobj);


                });
            }

            $scope.InsurancedetailstId = mainitem.PatientInsuranceDetailId || null;



            let obj = {
                "UserId": $scope.UserId,
                "OrganizationId": $scope.HospitalId,
                "EOBId": mainitem.EOBId,
                "ERAId": mainitem.EraId,
                // "EOBClaimInfoId": 0,
                "PayerClaimControlNumber": mainitem.PayerClaimControlNumber || '',
                "EOBClaimInfoId": mainitem.EOBClaimInfoId || null,
                "DeleteInd": mainitem.DeleteInd || 'N',
                "PatientClaimId": mainitem.PatientClaimId,
                "PostingDate": $filter('date')(mainitem.PostingDate, "yyyy-MM-dd"),
                "PostingType": "Insurance Payment Reversal",
                "PostingTypeId": 10,
                "PatientInsuranceDetailId": mainitem.PatientInsuranceDetailId,
                "TotalClaimAmount": mainitem.TotalClaimAmount,
                "TotalAllowedAmount": mainitem.TotalAllowedAmount,
                //"TotalInsurancePayment": mainitem.TotalInsurancePayment,
                "TotalInsurancePayment": 0,
                // "TotalAdjustmentAmount": mainitem.TotalAdjustmentAmount,
                "TotalAdjustmentAmount": 0,
                "TotalCopayAmount": mainitem.TotalCopayAmount,
                "TotalCoInsuranceAmount": mainitem.TotalCoInsuranceAmount,
                "TotalDeductibleAmount": mainitem.TotalDeductibleAmount,
                "TotalPaymentAmount": mainitem.TotalPaymentAmount,
                "TotalPatientPayment": mainitem.TotalPatientPayment,
                "TotalWriteOffAmount": mainitem.TotalWriteOffAmount,
                // "TotalInsuranceBalance": mainitem.TotalInsuranceBalance,
                "TotalInsuranceBalance": mainitem.TotalInsurancePayment + mainitem.TotalAdjustmentAmount,
                "TotalPatientBalance": mainitem.TotalPatientBalance,
                "TotalBalance": mainitem.TotalBalance,
                "ClaimStatusId": mainitem.ClaimStatusId,
                "ClaimStatus": mainitem.ClaimStatus,
                //"SettlementStatusId": mainitem.SettlementStatusId || 3,
                //"SettlementStatus": mainitem.SettlementStatus || "Fully Settled",
                "SettlementStatusId": 7,
                "SettlementStatus": "Cancel Payment",
                "TransactionTypeId": TransactionTypeId || 32,
                "TransactionType": TransactionType || "PrimaryInsPayment",
                "ClaimLineItems": ClaimLineItems || [],
                "IdentifierId": mainitem.IdentifierId || 1,
                "SecondaryPatientInsuranceDetailId": $scope.InsurancedetailstId,


            }
            console.log(obj);
            // return false;
            eHnoteInsuranceService.CancelEOBPaymentPosting(obj).then(function (resp) {
                console.log(resp);

                if (resp.data.Status == "Success") {
                    $scope.Changesubtab(1);

                }
            });

        }, function () {
            r = "You pressed Cancel!";
        });

    }

    $scope.changePrimaryBillerandMapProvider = function (BillingProviderGroupId) {
        BillingProviderGroupId = BillingProviderGroupId || 0;


        if ($scope.OrganizationBillingProviderGroupsDetails.length > 0) {

            if (BillingProviderGroupId === 0) {
                $scope.mainEOBPaymentPostingObj.PrimaryBillerId = 0;
                $scope.mainEOBPaymentPostingObj.PrimaryBillerName = "All";
                $scope.mainEOBPaymentPostingObj.PrimaryBillerNPI = "";
                $scope.mainEOBPaymentPostingObj.OrganizationBillingProviderId = 0;
                $scope.mainEOBPaymentPostingObj.BillingProviderName = "";
                $scope.mainEOBPaymentPostingObj.BillingProviderNPI = "";
            } else {
                var OrgBillGroup = $filter("filter")($scope.OrganizationBillingProviderGroupsDetails, { BillingProviderGroupId: BillingProviderGroupId }, true) || [];
                if (OrgBillGroup.length > 0) {
                    $scope.mainEOBPaymentPostingObj.PrimaryBillerId = OrgBillGroup[0].DoctorId;
                    $scope.mainEOBPaymentPostingObj.PrimaryBillerName = OrgBillGroup[0].Title + " " + OrgBillGroup[0].DoctorFullName;
                    $scope.mainEOBPaymentPostingObj.PrimaryBillerNPI = OrgBillGroup[0].DoctorNPI;
                    $scope.mainEOBPaymentPostingObj.OrganizationBillingProviderId = OrgBillGroup[0].ParentOrgBillingProviderId || 0;
                    $scope.mainEOBPaymentPostingObj.BillingProviderName = OrgBillGroup[0].BillingProviderName || "";

                    var OrgBillproviders = $filter("filter")($scope.ClaimProviderList, { OrganizationBillingProviderId: OrgBillGroup[0].ParentOrgBillingProviderId }, true) || [];
                    if (OrgBillproviders.length > 0) {
                        $scope.mainEOBPaymentPostingObj.BillingProviderNPI = OrgBillproviders[0].NPI || "";
                    }
                }
            }

        }

    }


    $scope.navtoOpenProfilePopup = function (item, id, type, NotesId) {


        type = type || '';
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
            "AppointmentTypeId": item.AppointmentTypeId || null,
            "ActionType": "AddClaim",
            "SubActionType": "Verify",
            "ScreenType": "Popup",
            "SuperBillId": null,
            "PatientClaimId": item.PatientClaimId,
            "SuperBillArray": [],
            "NotesId": NotesId || 1,
        };

        datapersistanceFactory.set("IsComingFromClaim", $scope.claimScreenParentObj);


        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/UsClaims/ClaimPatientProfile.html",
            "size": "lg",
            "keyboard": false,
            "controller": "UsClaimPatientProfileCtrl",
            "windowClass": "offcanves-right  ",
            "resolve": {
                "AllHospitalData": function () { return $scope.mainBillerDataObj; },
                "PatientInsuranceListData": function () { return item; },
                "id": function () { return id; },
                "type": function () { return type; },
                "IshideIndicator": true,
            }

        });

        $scope.mInstanceAdd.result.then(function (response) {

            $scope.GetEOBClaimDetails();
        }, function () { });
    }
    $scope.ClaimObjecDate = {
        "ClaimExpiryDate": null,
    }

    $scope.calculateExpiryDate = function () {

        var currentDate = new Date();

        currentDate.setDate(currentDate.getDate() + 90);

        var expiryMonth = currentDate.getMonth() + 1;
        var expiryDay = currentDate.getDate();
        var expiryYear = currentDate.getFullYear();

        expiryMonth = expiryMonth < 10 ? '0' + expiryMonth : expiryMonth;
        expiryDay = expiryDay < 10 ? '0' + expiryDay : expiryDay;

        $scope.ClaimObjecDate.ClaimExpiryDate = `${expiryMonth}-${expiryDay}-${expiryYear}`;
    };
    $scope.navtoClaimSummaryPopup = function (item) {
        $scope.calculateExpiryDate();
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
            "PatientFullName": item.PatientFullName || "",
            "VisitId": item.VisitId || '',
            "ActionType": "EditClaim",
            "SubActionType": "Verify",
            "ScreenType": "Popup",
            "SuperBillId": null,
            "ResponcibilityId": item.CurrentResponsibilityId || 0,
            "IsCreateSuperBill": false,
            "PatientClaimId": item.PatientClaimId,
            "SuperBillArray": [],
            "ClaimExpiryDate": $scope.ClaimObjecDate.ClaimExpiryDate || null,
            "AppointmentDoctorId": item.RenderingProviderId || 0,
            "PageNumber": 1,
        };
        $scope.mainBillerDataObj.Tabid = 2;
        $scope.mainBillerDataObj.PatientId = PatientId || 0;
        $scope.mainBillerDataObj.HospitalId = $scope.HospitalId || 0;
        datapersistanceFactory.set("IsComingFromClaim", $scope.claimScreenParentObj);
        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/UsClaims/AddUpdateClaimPopup.html",
            "size": "lg",
            "keyboard": false,
            "controller": "UsAddUpdateClaimPopupCtrl",
            "windowClass": "modal__popup--1",
            "resolve": {
                "mainBillerDataObj": function () { return $scope.mainBillerDataObj || null; },
            }
        });

        $scope.mInstanceAdd.result.then(function (response) {
            response = response || "";
            console.log(response);
            $scope.GetEOBClaimDetails();

        }, function () { });
    }
    function getnewEOBPrintClaimObj() {
        var obj = {
            "PayorName": "",
            "PayorCode": "",
            "PayorNPI": "",
            "PayorAddress1": "",
            "PayorAddress2": "",
            "PayorZipCode": "",
            "PayorCity": "",
            "PayorState": "",
            "PayorWWW": "",
            "PayorContactNumber": "",
            "TraceNumber": "",
            "ChequeOrEFTDate": "",
            "TotalPaymentAmount": "",
            "TotalAdjustmentAmount": "",
            "PaymentMode": "",
            "TotalChargeAmount": "",
            "BillingProviderName": "",
            "BillingProviderNPI": "",
            "BillingProviderAddress1": "",
            "BillingProviderAddress2": "",
            "BillingProviderZipCode": "",
            "BillingProviderCity": "",
            "BillingProviderState": "",
            "BillingProviderTaxId": "",
            "BillingProviderTaxonomyId": "",
            "OrganizationName": "",
            "OrganizationAddress1": "",
            "OrganizationAddress2": "",
            "OrganizationCity": "",
            "OrganizationState": "",
            "OrganizationZipCode": "",
            "OrganizationStateCode": "",
            "OrganizationNPI": "",
            "ClaimPaymentInfo": [],
            "ClaimAdjustments": [],
            "ClaimLegends": [],
            "PrintedDatenTime": "",
            "ParsedDate": "",
            "TotalPatientResponsibilityAmount": 0,
            "ClaimAdjustmentAmount": 0,
            "TotalOtherAdjustmentAmount": 0,
            "TotalClaimsAmountData": 0,
            "AllTotalOtherAdjAmt": 0,
            "ProviderAdjustments": [],
            "LegendCodeList": [],
            "TotalWUAdjAmt": 0,
            "ParseDate": "",
            "GlobalPayorId": 0,
        };
        return obj;
    };

    $scope.EOBPrintMainObj = getnewEOBPrintClaimObj();

    $scope.navtopatientEOBprint = function (item) {

        var PatientId = item.PatientId || null;
        var ERAId = item.ERAId || item.EraId || null;
        var PayerClaimControlNumber = "";
        eHnoteInsuranceService.GetEOBPatientPostingPrintDetails(ERAId, PatientId, PayerClaimControlNumber).then(function (resp) {

            if (resp.data.status == "Success") {
                var ERAresp = angular.copy(resp.data.rows);
                var MatchedClaimsList = (ERAresp.Claims).filter(function (claim) {
                    return claim.PatientClaimNumber === item.PatientClaimNumber;
                });
                if (MatchedClaimsList.length > 0) {
                    item.PatientClaimNumber
                    $scope.EOBPrintMainObj.PayorName = ERAresp.PayerName || "";
                    $scope.EOBPrintMainObj.PayorCode = ERAresp.PayerCode || "";
                    $scope.EOBPrintMainObj.PayorNPI = ERAresp.PayerNPI || "";
                    $scope.EOBPrintMainObj.GlobalPayorId = ERAresp.GlobalPayorId || 0;
                    $scope.EOBPrintMainObj.PayorAddress1 = ERAresp.PayerAddress1 || "";
                    $scope.EOBPrintMainObj.PayorAddress2 = ERAresp.PayerAddress2 || "";
                    $scope.EOBPrintMainObj.PayorZipCode = ERAresp.PayerZip || "";
                    $scope.EOBPrintMainObj.PayorCity = ERAresp.PayerCity || "";
                    $scope.EOBPrintMainObj.PayorState = ERAresp.PayerState || "";
                    $scope.EOBPrintMainObj.PayorWWW = ERAresp.PayerWWW || "";
                    $scope.EOBPrintMainObj.PayorContactNumber = ERAresp.PayorContactNumber || "";
                    $scope.EOBPrintMainObj.TraceNumber = ERAresp.TransactionNumber || "";
                    $scope.EOBPrintMainObj.PaymentMode = ERAresp.PaymentMethod || "";
                    $scope.EOBPrintMainObj.ChequeOrEFTDate = ERAresp.TransactionDate || "";
                    /* $scope.EOBPrintMainObj.TotalAdjustmentAmount = 0 || "";*/
                    $scope.EOBPrintMainObj.TotalChargeAmount = ERAresp.TotalChargeAmount || "";
                    $scope.EOBPrintMainObj.BillingProviderName = ERAresp.BillIngProviderName || "";
                    $scope.EOBPrintMainObj.BillingProviderNPI = ERAresp.BillingProviderNPI || "";
                    $scope.EOBPrintMainObj.BillingProviderAddress1 = ERAresp.BillingProviderAddress1 || "";
                    $scope.EOBPrintMainObj.BillingProviderAddress2 = ERAresp.BillingProviderAddress2 || "";
                    $scope.EOBPrintMainObj.BillingProviderZipCode = ERAresp.BillingProviderZip || "";
                    $scope.EOBPrintMainObj.BillingProviderCity = ERAresp.BillingProviderCity || "";
                    $scope.EOBPrintMainObj.BillingProviderState = ERAresp.BillingProviderState || "";
                    $scope.EOBPrintMainObj.BillingProviderTaxID = ERAresp.BillingProviderTaxID || "";
                    $scope.EOBPrintMainObj.BillingProviderTaxonomyId = ERAresp.BillingProviderTaxonomyId || "";
                    $scope.EOBPrintMainObj.ParseDate = ERAresp.ParseDate || "";

                    $scope.EOBPrintMainObj.OrganizationName = ERAresp.OrganizationName || "";
                    $scope.EOBPrintMainObj.OrganizationAddress1 = ERAresp.OrganizationAddress1 || "";
                    $scope.EOBPrintMainObj.OrganizationAddress2 = ERAresp.OrganizationAddress2 || "";
                    $scope.EOBPrintMainObj.OrganizationCity = ERAresp.OrganizationCity || "";
                    $scope.EOBPrintMainObj.OrganizationState = ERAresp.OrganizationState || "";
                    $scope.EOBPrintMainObj.OrganizationStateCode = ERAresp.OrganizationStateCode || "";
                    $scope.EOBPrintMainObj.OrganizationZipCode = ERAresp.OrganizationZipCode || "";
                    $scope.EOBPrintMainObj.OrganizationNPI = $scope.BranchNPI || "";
                    $scope.EOBPrintMainObj.ParsedDate = ERAresp.ParseDate || "";
                    $scope.EOBPrintMainObj.TotalClaimChargeAmount = ERAresp.TotalClaimChargeAmount || 0,
                        $scope.EOBPrintMainObj.TotalPatientResponsibilityAmount = ERAresp.TotalClaimPatientRespAmount || 0,
                        $scope.EOBPrintMainObj.ClaimAdjustmentAmount = ERAresp.TotalClaimAdjustmentAmount || 0,
                        /* $scope.EOBPrintMainObj.TotalOtherAdjustmentAmount = ERAresp.TotalOtherAdjustmentAmount || 0,*/
                        $scope.EOBPrintMainObj.TotalPaymentAmount = ERAresp.TransactionAmount || 0;

                    $scope.EOBPrintMainObj.ProviderAdjustments = ERAresp.ProviderAdjustments || [];
                    $scope.EOBPrintMainObj.TotalWUAdjAmt = 0;
                    angular.forEach($scope.EOBPrintMainObj.ProviderAdjustments, function (pitem) {
                        $scope.EOBPrintMainObj.TotalWUAdjAmt += pitem.AdjustmentAmount || 0;
                    });
                    $scope.EOBPrintMainObj.TotalPaidAmount = 0;
                    $scope.EOBPrintMainObj.TotalVoucherAmount = 0;
                    $scope.EOBPrintMainObj.TotalPaidAmount = $scope.EOBPrintMainObj.TotalPaymentAmount + $scope.EOBPrintMainObj.TotalWUAdjAmt || 0;
                    $scope.EOBPrintMainObj.MatchedClaimsPaidTotal = 0;

                    angular.forEach(MatchedClaimsList || [], function (claim) {
                        $scope.EOBPrintMainObj.MatchedClaimsPaidTotal += Number(claim.PaidAmount) || 0;
                    });

                    $scope.EOBPrintMainObj.TotalVoucherAmount = $scope.EOBPrintMainObj.MatchedClaimsPaidTotal - $scope.EOBPrintMainObj.TotalWUAdjAmt;


                    //ERAresp.Claims = ERAresp.Claims || [];
                    //ERAresp.UnMatchedClaims = ERAresp.UnMatchedClaims || [];

                    console.log(MatchedClaimsList);
                    $scope.EOBPrintMainObj.TotalClaimsAmountData = 0;
                    $scope.EOBPrintMainObj.AllTotalPatientRespAmt = 0;
                    $scope.EOBPrintMainObj.AllTotalAdjAmount = 0;
                    angular.forEach(MatchedClaimsList, function (cERAresp) {
                        $scope.EOBPrintMainObj.TotalClaimsAmountData += cERAresp.ClaimAmount || 0;
                        cERAresp.TotalPatientRespAmount = 0;
                        cERAresp.TotalAdjAmount = 0;
                        cERAresp.TotalOtherAdjustmentAmt = 0;
                        cERAresp.AllAdjustmentAmount = 0;
                        angular.forEach(cERAresp.ClaimLineItems, function (citem) {
                            citem.TotalCOAmount = 0;
                            citem.TotalPRAmount = 0;
                            citem.TotalOAAmt = 0;
                            angular.forEach(citem.LineItemAdjustments, function (aitem) {
                                if (aitem.GroupCode === "CO") {
                                    citem.TotalCOAmount += aitem.AdjustmentAmount || 0;
                                    cERAresp.TotalAdjAmount += aitem.AdjustmentAmount || 0;
                                    $scope.EOBPrintMainObj.AllTotalAdjAmount += aitem.AdjustmentAmount || 0;
                                } else if (aitem.GroupCode === "PR") {
                                    citem.TotalPRAmount += aitem.AdjustmentAmount || 0;
                                    cERAresp.TotalPatientRespAmount += aitem.AdjustmentAmount || 0;
                                    $scope.EOBPrintMainObj.AllTotalPatientRespAmt += aitem.AdjustmentAmount || 0;
                                } else if (aitem.GroupCode === "OA") {
                                    citem.TotalOAAmt += aitem.AdjustmentAmount || 0;
                                    cERAresp.TotalOtherAdjustmentAmt += aitem.AdjustmentAmount || 0;
                                    $scope.EOBPrintMainObj.AllTotalOtherAdjAmt += aitem.AdjustmentAmount || 0;
                                }
                                cERAresp.AllAdjustmentAmount += aitem.AdjustmentAmount || 0;

                            })

                        })


                        cERAresp.ClaimPaymentRemark1 = cERAresp.ClaimPaymentRemark1 || '';
                        cERAresp.ClaimPaymentRemark2 = cERAresp.ClaimPaymentRemark2 || '';
                        cERAresp.ClaimPaymentRemark3 = cERAresp.ClaimPaymentRemark3 || '';
                        cERAresp.ClaimPaymentRemark4 = cERAresp.ClaimPaymentRemark4 || '';
                        cERAresp.ClaimPaymentRemark5 = cERAresp.ClaimPaymentRemark5 || '';

                        if (cERAresp.ClaimPaymentRemark1 != '') {
                            let obj = {
                                "Code": cERAresp.ClaimPaymentRemark1,
                                "Description": cERAresp.AdjsutmentReasonDescriptionk1,
                            }
                            $scope.EOBPrintMainObj.LegendCodeList.push(obj);
                        }
                        if (cERAresp.ClaimPaymentRemark2 != '') {
                            let obj = {
                                "Code": cERAresp.ClaimPaymentRemark2,
                                "Description": cERAresp.AdjsutmentReasonDescriptionk2,
                            }
                            $scope.EOBPrintMainObj.LegendCodeList.push(obj);
                        }
                        if (cERAresp.ClaimPaymentRemark3 != '') {
                            let obj = {
                                "Code": cERAresp.ClaimPaymentRemark3,
                                "Description": cERAresp.AdjsutmentReasonDescriptionk3,
                            }
                            $scope.EOBPrintMainObj.LegendCodeList.push(obj);
                        }
                        if (cERAresp.ClaimPaymentRemark4 != '') {
                            let obj = {
                                "Code": cERAresp.ClaimPaymentRemark4,
                                "Description": cERAresp.AdjsutmentReasonDescriptionk4,
                            }
                            $scope.EOBPrintMainObj.LegendCodeList.push(obj);
                        }
                        if (cERAresp.ClaimPaymentRemark5 != '') {
                            let obj = {
                                "Code": cERAresp.ClaimPaymentRemark5,
                                "Description": cERAresp.AdjsutmentReasonDescriptionk5,
                            }
                            $scope.EOBPrintMainObj.LegendCodeList.push(obj);
                        }

                    });

                    if ($scope.EOBPrintMainObj.LegendCodeList.length > 0) {
                        $scope.EOBPrintMainObj.LegendCodeList = _.uniq($scope.EOBPrintMainObj.LegendCodeList, false, function (p) { return p.Code; });
                    }

                    $scope.EOBPrintMainObj.ClaimPaymentInfo = MatchedClaimsList || [];
                    $scope.EOBPrintMainObj.ClaimAdjustments = [];
                    $scope.EOBPrintMainObj.ClaimLegends = [];
                    $scope.EOBPrintMainObj.PrintedDatenTime = "";


                    var tadjAmt = 0;

                    var tempadjarray = [], tempadjLegendsarray = [];

                    angular.forEach(MatchedClaimsList, function (gitem) {
                        angular.forEach(gitem.ClaimLineItems, function (sitem) {
                            sitem.TotallineItemChargeAmount = sitem.ChargedAmount * sitem.Quantity;
                            angular.forEach(sitem.LineItemAdjustments, function (aitem) {
                                tadjAmt += parseFloat(aitem.AdjustmentAmount) || 0;
                                if (tempadjarray.length > 0) {

                                    var filarray = $filter("filter")(tempadjarray, { "AdjustmentCodeId": aitem.AdjustmentReasonId }, true);

                                    if (filarray.length > 0) {
                                        angular.forEach(tempadjarray, function (tadjitem) {
                                            if (tadjitem.AdjustmentCodeId === aitem.AdjustmentReasonId) {
                                                tadjitem.AdjustmentAmount += parseFloat(aitem.AdjustmentAmount) || 0;
                                            }
                                        });

                                    } else {
                                        var taobj = {
                                            "AdjustmentCodeId": aitem.AdjustmentReasonId,
                                            "AdjustmentCode": aitem.AdjustmentReasonCode,
                                            "AdjustmentCodeName": aitem.AdjustmentReason,
                                            "AdjustmentAmount": parseFloat(aitem.AdjustmentAmount) || 0,
                                            "GroupCode": aitem.GroupCode
                                        }
                                        tempadjarray.push(taobj);
                                    }



                                }
                                else {

                                    var taobj = {
                                        "AdjustmentCodeId": aitem.AdjustmentReasonId,
                                        "AdjustmentCode": aitem.AdjustmentReasonCode,
                                        "AdjustmentCodeName": aitem.AdjustmentReason,
                                        "AdjustmentAmount": parseFloat(aitem.AdjustmentAmount) || 0,
                                        "GroupCode": aitem.GroupCode
                                    }
                                    tempadjarray.push(taobj);
                                }

                                if (aitem.AdjustmentCode === "CO" || aitem.AdjustmentCode === "PR") {

                                } else {

                                    if (tempadjLegendsarray.length > 0) {

                                        var filarray = $filter("filter")(tempadjLegendsarray, { "AdjustmentCodeId": aitem.AdjustmentReasonId }, true);

                                        if (filarray.length > 0) {

                                        } else {
                                            var taobj = {
                                                "AdjustmentCodeId": aitem.AdjustmentReasonId,
                                                "AdjustmentCode": aitem.AdjustmentReasonCode,
                                                "AdjustmentCodeName": aitem.AdjustmentReason,
                                                "GroupCode": aitem.GroupCode
                                            }
                                            tempadjLegendsarray.push(taobj);
                                        }

                                    } else {
                                        var taobj = {
                                            "AdjustmentCodeId": aitem.AdjustmentReasonId,
                                            "AdjustmentCode": aitem.AdjustmentReasonCode,
                                            "AdjustmentCodeName": aitem.AdjustmentReason,
                                            "GroupCode": aitem.GroupCode
                                        }
                                        tempadjLegendsarray.push(taobj);
                                    }


                                }
                            });
                        });



                    });


                    $scope.EOBPrintMainObj.TotalAdjustmentAmount = tadjAmt;
                    $scope.EOBPrintMainObj.ClaimAdjustments = tempadjarray;
                    $scope.EOBPrintMainObj.ClaimLegends = tempadjLegendsarray;


                    var printDate = $filter("date")(new Date(), "MMM-dd-yyyy");
                    var printTime = moment(new Date()).format("HH:mm");
                    var printDatemTime = printDate + '  ' + printTime;
                    $scope.EOBPrintMainObj.PrintedDatenTime = printDatemTime;




                    console.log($scope.EOBPrintMainObj);


                    $timeout(function () {
                        var innerContents = document.getElementById('EOBPostingprint').innerHTML;
                        var popupWinindow = window.open('scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                        popupWinindow.document.open();
                        popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()" class="bodyheightprint">' + innerContents + '</body></html>');
                        popupWinindow.document.close();
                    }, 500);
                }


            }
        });
    }
    $scope.navtoPrintClaimsEOB = function (item) {

        //var param = {
        //    "EraId": item.EraId || null
        //}
        item.EraId = item.EraId || null;
        eHnoteInsuranceService.GetPrasedERADetailsById(item.EraId).then(function (resp) {

            resp.data = resp.data || null;
            if (resp.data != null) {
                var ERAresp = angular.copy(resp.data);


                $scope.EOBPrintMainObj.PayorName = ERAresp.PayerName || "";
                $scope.EOBPrintMainObj.PayorCode = ERAresp.PayerCode || "";
                $scope.EOBPrintMainObj.PayorNPI = ERAresp.PayerNPI || "";
                $scope.EOBPrintMainObj.GlobalPayorId = ERAresp.GlobalPayorId || 0;
                $scope.EOBPrintMainObj.PayorAddress1 = ERAresp.PayerAddress1 || "";
                $scope.EOBPrintMainObj.PayorAddress2 = ERAresp.PayerAddress2 || "";
                $scope.EOBPrintMainObj.PayorZipCode = ERAresp.PayerZip || "";
                $scope.EOBPrintMainObj.PayorCity = ERAresp.PayerCity || "";
                $scope.EOBPrintMainObj.PayorState = ERAresp.PayerState || "";
                $scope.EOBPrintMainObj.PayorWWW = ERAresp.PayerWWW || "";
                $scope.EOBPrintMainObj.PayorContactNumber = ERAresp.PayorContactNumber || "";
                $scope.EOBPrintMainObj.TraceNumber = ERAresp.TransactionNumber || "";
                $scope.EOBPrintMainObj.PaymentMode = ERAresp.PaymentMethod || "";
                $scope.EOBPrintMainObj.ChequeOrEFTDate = ERAresp.TransactionDate || "";
                /* $scope.EOBPrintMainObj.TotalAdjustmentAmount = 0 || "";*/
                $scope.EOBPrintMainObj.TotalChargeAmount = ERAresp.TotalChargeAmount || "";
                $scope.EOBPrintMainObj.BillingProviderName = ERAresp.BillIngProviderName || "";
                $scope.EOBPrintMainObj.BillingProviderNPI = ERAresp.BillingProviderNPI || "";
                $scope.EOBPrintMainObj.BillingProviderAddress1 = ERAresp.BillingProviderAddress1 || "";
                $scope.EOBPrintMainObj.BillingProviderAddress2 = ERAresp.BillingProviderAddress2 || "";
                $scope.EOBPrintMainObj.BillingProviderZipCode = ERAresp.BillingProviderZip || "";
                $scope.EOBPrintMainObj.BillingProviderCity = ERAresp.BillingProviderCity || "";
                $scope.EOBPrintMainObj.BillingProviderState = ERAresp.BillingProviderState || "";
                $scope.EOBPrintMainObj.BillingProviderTaxID = ERAresp.BillingProviderTaxID || "";
                $scope.EOBPrintMainObj.BillingProviderTaxonomyId = ERAresp.BillingProviderTaxonomyId || "";
                $scope.EOBPrintMainObj.ParseDate = ERAresp.ParseDate || "";

                $scope.EOBPrintMainObj.OrganizationName = ERAresp.OrganizationName || "";
                $scope.EOBPrintMainObj.OrganizationAddress1 = ERAresp.OrganizationAddress1 || "";
                $scope.EOBPrintMainObj.OrganizationAddress2 = ERAresp.OrganizationAddress2 || "";
                $scope.EOBPrintMainObj.OrganizationCity = ERAresp.OrganizationCity || "";
                $scope.EOBPrintMainObj.OrganizationState = ERAresp.OrganizationState || "";
                $scope.EOBPrintMainObj.OrganizationStateCode = ERAresp.OrganizationStateCode || "";
                $scope.EOBPrintMainObj.OrganizationZipCode = ERAresp.OrganizationZipCode || "";
                $scope.EOBPrintMainObj.OrganizationNPI = $scope.BranchNPI || "";
                $scope.EOBPrintMainObj.ParsedDate = ERAresp.ParseDate || "";
                $scope.EOBPrintMainObj.TotalClaimChargeAmount = ERAresp.TotalClaimChargeAmount || 0,
                    $scope.EOBPrintMainObj.TotalPatientResponsibilityAmount = ERAresp.TotalClaimPatientRespAmount || 0,
                    $scope.EOBPrintMainObj.ClaimAdjustmentAmount = ERAresp.TotalClaimAdjustmentAmount || 0,
                    /* $scope.EOBPrintMainObj.TotalOtherAdjustmentAmount = ERAresp.TotalOtherAdjustmentAmount || 0,*/
                    $scope.EOBPrintMainObj.TotalPaymentAmount = ERAresp.TransactionAmount || 0;

                $scope.EOBPrintMainObj.ProviderAdjustments = ERAresp.ProviderAdjustments || [];
                $scope.EOBPrintMainObj.TotalWUAdjAmt = 0;
                angular.forEach($scope.EOBPrintMainObj.ProviderAdjustments, function (pitem) {
                    $scope.EOBPrintMainObj.TotalWUAdjAmt += pitem.AdjustmentAmount || 0;
                });
                $scope.EOBPrintMainObj.TotalPaidAmount = 0;
                $scope.EOBPrintMainObj.TotalVoucherAmount = 0;
                $scope.EOBPrintMainObj.TotalPaidAmount = $scope.EOBPrintMainObj.TotalPaymentAmount + $scope.EOBPrintMainObj.TotalWUAdjAmt || 0;
                $scope.EOBPrintMainObj.TotalVoucherAmount = $scope.EOBPrintMainObj.TotalPaymentAmount - $scope.EOBPrintMainObj.TotalWUAdjAmt || 0;

                //ERAresp.Claims = ERAresp.Claims || [];
                //ERAresp.UnMatchedClaims = ERAresp.UnMatchedClaims || [];

                var MatchedandUnMatchedClaimsList = ERAresp.Claims.concat(ERAresp.UnMatchedClaims);
                console.log(MatchedandUnMatchedClaimsList);
                $scope.EOBPrintMainObj.TotalClaimsAmountData = 0;
                $scope.EOBPrintMainObj.AllTotalPatientRespAmt = 0;
                $scope.EOBPrintMainObj.AllTotalAdjAmount = 0;
                angular.forEach(MatchedandUnMatchedClaimsList, function (cERAresp) {
                    $scope.EOBPrintMainObj.TotalClaimsAmountData += cERAresp.ClaimAmount || 0;
                    cERAresp.TotalPatientRespAmount = 0;
                    cERAresp.TotalAdjAmount = 0;
                    cERAresp.TotalOtherAdjustmentAmt = 0;
                    cERAresp.AllAdjustmentAmount = 0;
                    angular.forEach(cERAresp.ClaimLineItems, function (citem) {
                        citem.TotalCOAmount = 0;
                        citem.TotalPRAmount = 0;
                        citem.TotalOAAmt = 0;
                        angular.forEach(citem.LineItemAdjustments, function (aitem) {
                            if (aitem.GroupCode === "CO") {
                                citem.TotalCOAmount += aitem.AdjustmentAmount || 0;
                                cERAresp.TotalAdjAmount += aitem.AdjustmentAmount || 0;
                                $scope.EOBPrintMainObj.AllTotalAdjAmount += aitem.AdjustmentAmount || 0;
                            } else if (aitem.GroupCode === "PR") {
                                citem.TotalPRAmount += aitem.AdjustmentAmount || 0;
                                cERAresp.TotalPatientRespAmount += aitem.AdjustmentAmount || 0;
                                $scope.EOBPrintMainObj.AllTotalPatientRespAmt += aitem.AdjustmentAmount || 0;
                            } else if (aitem.GroupCode === "OA") {
                                citem.TotalOAAmt += aitem.AdjustmentAmount || 0;
                                cERAresp.TotalOtherAdjustmentAmt += aitem.AdjustmentAmount || 0;
                                $scope.EOBPrintMainObj.AllTotalOtherAdjAmt += aitem.AdjustmentAmount || 0;
                            }
                            cERAresp.AllAdjustmentAmount += aitem.AdjustmentAmount || 0;

                        })

                    })


                    cERAresp.ClaimPaymentRemark1 = cERAresp.ClaimPaymentRemark1 || '';
                    cERAresp.ClaimPaymentRemark2 = cERAresp.ClaimPaymentRemark2 || '';
                    cERAresp.ClaimPaymentRemark3 = cERAresp.ClaimPaymentRemark3 || '';
                    cERAresp.ClaimPaymentRemark4 = cERAresp.ClaimPaymentRemark4 || '';
                    cERAresp.ClaimPaymentRemark5 = cERAresp.ClaimPaymentRemark5 || '';

                    if (cERAresp.ClaimPaymentRemark1 != '') {
                        let obj = {
                            "Code": cERAresp.ClaimPaymentRemark1,
                            "Description": cERAresp.AdjsutmentReasonDescriptionk1,
                        }
                        $scope.EOBPrintMainObj.LegendCodeList.push(obj);
                    }
                    if (cERAresp.ClaimPaymentRemark2 != '') {
                        let obj = {
                            "Code": cERAresp.ClaimPaymentRemark2,
                            "Description": cERAresp.AdjsutmentReasonDescriptionk2,
                        }
                        $scope.EOBPrintMainObj.LegendCodeList.push(obj);
                    }
                    if (cERAresp.ClaimPaymentRemark3 != '') {
                        let obj = {
                            "Code": cERAresp.ClaimPaymentRemark3,
                            "Description": cERAresp.AdjsutmentReasonDescriptionk3,
                        }
                        $scope.EOBPrintMainObj.LegendCodeList.push(obj);
                    }
                    if (cERAresp.ClaimPaymentRemark4 != '') {
                        let obj = {
                            "Code": cERAresp.ClaimPaymentRemark4,
                            "Description": cERAresp.AdjsutmentReasonDescriptionk4,
                        }
                        $scope.EOBPrintMainObj.LegendCodeList.push(obj);
                    }
                    if (cERAresp.ClaimPaymentRemark5 != '') {
                        let obj = {
                            "Code": cERAresp.ClaimPaymentRemark5,
                            "Description": cERAresp.AdjsutmentReasonDescriptionk5,
                        }
                        $scope.EOBPrintMainObj.LegendCodeList.push(obj);
                    }

                });

                if ($scope.EOBPrintMainObj.LegendCodeList.length > 0) {
                    $scope.EOBPrintMainObj.LegendCodeList = _.uniq($scope.EOBPrintMainObj.LegendCodeList, false, function (p) { return p.Code; });
                }

                $scope.EOBPrintMainObj.ClaimPaymentInfo = MatchedandUnMatchedClaimsList || [];
                $scope.EOBPrintMainObj.ClaimAdjustments = [];
                $scope.EOBPrintMainObj.ClaimLegends = [];
                $scope.EOBPrintMainObj.PrintedDatenTime = "";


                var tadjAmt = 0;

                var tempadjarray = [], tempadjLegendsarray = [];

                angular.forEach(ERAresp.Claims, function (gitem) {
                    angular.forEach(gitem.ClaimLineItems, function (sitem) {
                        sitem.TotallineItemChargeAmount = sitem.ChargedAmount * sitem.Quantity;
                        angular.forEach(sitem.LineItemAdjustments, function (aitem) {
                            tadjAmt += parseFloat(aitem.AdjustmentAmount) || 0;
                            if (tempadjarray.length > 0) {

                                var filarray = $filter("filter")(tempadjarray, { "AdjustmentCodeId": aitem.AdjustmentReasonId }, true);

                                if (filarray.length > 0) {
                                    angular.forEach(tempadjarray, function (tadjitem) {
                                        if (tadjitem.AdjustmentCodeId === aitem.AdjustmentReasonId) {
                                            tadjitem.AdjustmentAmount += parseFloat(aitem.AdjustmentAmount) || 0;
                                        }
                                    });

                                } else {
                                    var taobj = {
                                        "AdjustmentCodeId": aitem.AdjustmentReasonId,
                                        "AdjustmentCode": aitem.AdjustmentReasonCode,
                                        "AdjustmentCodeName": aitem.AdjustmentReason,
                                        "AdjustmentAmount": parseFloat(aitem.AdjustmentAmount) || 0,
                                        "GroupCode": aitem.GroupCode
                                    }
                                    tempadjarray.push(taobj);
                                }



                            }
                            else {

                                var taobj = {
                                    "AdjustmentCodeId": aitem.AdjustmentReasonId,
                                    "AdjustmentCode": aitem.AdjustmentReasonCode,
                                    "AdjustmentCodeName": aitem.AdjustmentReason,
                                    "AdjustmentAmount": parseFloat(aitem.AdjustmentAmount) || 0,
                                    "GroupCode": aitem.GroupCode
                                }
                                tempadjarray.push(taobj);
                            }

                            if (aitem.AdjustmentCode === "CO" || aitem.AdjustmentCode === "PR") {

                            } else {

                                if (tempadjLegendsarray.length > 0) {

                                    var filarray = $filter("filter")(tempadjLegendsarray, { "AdjustmentCodeId": aitem.AdjustmentReasonId }, true);

                                    if (filarray.length > 0) {

                                    } else {
                                        var taobj = {
                                            "AdjustmentCodeId": aitem.AdjustmentReasonId,
                                            "AdjustmentCode": aitem.AdjustmentReasonCode,
                                            "AdjustmentCodeName": aitem.AdjustmentReason,
                                            "GroupCode": aitem.GroupCode
                                        }
                                        tempadjLegendsarray.push(taobj);
                                    }

                                } else {
                                    var taobj = {
                                        "AdjustmentCodeId": aitem.AdjustmentReasonId,
                                        "AdjustmentCode": aitem.AdjustmentReasonCode,
                                        "AdjustmentCodeName": aitem.AdjustmentReason,
                                        "GroupCode": aitem.GroupCode
                                    }
                                    tempadjLegendsarray.push(taobj);
                                }


                            }
                        });
                    });



                });


                $scope.EOBPrintMainObj.TotalAdjustmentAmount = tadjAmt;
                $scope.EOBPrintMainObj.ClaimAdjustments = tempadjarray;
                $scope.EOBPrintMainObj.ClaimLegends = tempadjLegendsarray;


                var printDate = $filter("date")(new Date(), "MMM-dd-yyyy");
                var printTime = moment(new Date()).format("HH:mm");
                var printDatemTime = printDate + '  ' + printTime;
                $scope.EOBPrintMainObj.PrintedDatenTime = printDatemTime;




                console.log($scope.EOBPrintMainObj);


                $timeout(function () {
                    var innerContents = document.getElementById('EOBPostingprint').innerHTML;
                    var popupWinindow = window.open('scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                    popupWinindow.document.open();
                    popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()" class="bodyheightprint">' + innerContents + '</body></html>');
                    popupWinindow.document.close();
                }, 500);



            }
        });
    }



    $scope.navtoReconcilationReportPrint = function (item) {
        var printobj = {

            "EOBId": item.EOBId || null,
            "SettlementStatusList": "2,3,4,5,6,8" || "",
            "EraId": item.EraId || null,
            "UserId": $scope.UserId,
            "OrganizationId": $scope.HospitalId,

        }

        eHnoteInsuranceService.GetReconiciliationClaimreportDetails(printobj).then(function (resp) {
            resp.data = resp.data || null;
            $scope.ReconcilationReportPrint(resp.data);
        });

    }


    $scope.ReconcilationReportPrint = function (item) {
        $scope.clearAdjustmentPieChart();
        $scope.ReconcilationPrintObj = item || null;
        var tempadjustmentMap = {};
        $scope.ERAUnmatchedClaimsList = [];
        $scope.ServiceAdjustment = [];
        $scope.EobClaimsList = $scope.ReconcilationPrintObj.rows || [];
        $scope.ERAUnmatchedClaimsList = $scope.ReconcilationPrintObj.UnMatchedClaims || [];
        $scope.TotalCOServiceAdjAmount = 0;
        $scope.TotalPRServiceAdjAmount = 0;
        $scope.TotalOAServiceAdjAmt = 0;
        $scope.TotalClaimsChargeAmt = 0;
        $scope.TotalClaimsServiceAdjAmount = 0;
        $scope.TotalClaimsPaymentAmt = 0;
        angular.forEach($scope.ERAUnmatchedClaimsList, function (item) {



            item.TotalAdjustmentAmt = 0;
            item.TotalserviceAdjAmount = 0;
            item.TotalCOAdjAmount = 0;
            item.TotalPRAdjAmount = 0;
            item.TotalOAAdjAmt = 0;
            angular.forEach(item.ClaimLineItems, function (pitem) {

                if (pitem.LineItemAdjustments.length > 0) {
                    angular.forEach(pitem.LineItemAdjustments, function (aitem) {
                        item.TotalserviceAdjAmount += aitem.AdjustmentAmount || 0;

                        if (aitem.GroupCode === "CO") {
                            item.TotalCOAdjAmount += aitem.AdjustmentAmount || 0;
                            $scope.TotalCOServiceAdjAmount += aitem.AdjustmentAmount || 0;
                        } else if (aitem.GroupCode === "PR") {
                            item.TotalPRAdjAmount += aitem.AdjustmentAmount || 0;
                            $scope.TotalPRServiceAdjAmount += aitem.AdjustmentAmount || 0;
                        } else if (aitem.GroupCode === "OA") {
                            item.TotalOAAdjAmt += aitem.AdjustmentAmount || 0;
                            $scope.TotalOAServiceAdjAmt += aitem.AdjustmentAmount || 0;
                        }

                    })
                }
            });

            $scope.TotalClaimsChargeAmt += item.ClaimAmount || 0;
            $scope.TotalClaimsPaymentAmt += item.PaidAmount || 0;
            $scope.TotalClaimsServiceAdjAmount += item.TotalserviceAdjAmount || 0;

        });


        $scope.MatchedClaimsCount = $scope.ReconcilationPrintObj.ClaimMatchedCount || 0;
        $scope.UnMatchedClaimCount = $scope.ReconcilationPrintObj.ClaimUnmatchedCount || 0;


        $scope.AllServiceAdjustmentsList = [];

        if ($scope.EobClaimsList.length > 0) {

            $scope.TotalEobPatientResAmount = 0;
            $scope.TotalEOBAdjustmentAmount = 0;

            $scope.TotalClaimsChargeAmount = 0;
            $scope.TotalClaimsInsuBalanceAmt = 0;
            $scope.TotalClaimsPatRespAmount = 0;
            $scope.TotalClaimsAdjustmentAmount = 0;
            $scope.TotalClaimsInsPaymentAmount = 0;


            angular.forEach($scope.EobClaimsList, function (item) {
                if (item.EOBClaimLineItems.length > 0) {
                    item.TotalPatientResAmount = 0;
                    item.TotalPatientAjustAmount = 0;
                    angular.forEach(item.EOBClaimLineItems, function (Aitem) {
                        Aitem.TotalPatRespAdjAmount = 0;
                        Aitem.TotalAdjustmentsAmount = 0;

                        if (Aitem.ServiceAdjustments && Aitem.ServiceAdjustments.length > 0) {
                            angular.forEach(Aitem.ServiceAdjustments, function (adj) {
                                if (adj.GroupCode === "PR") {
                                    Aitem.TotalPatRespAdjAmount += adj.AdjustmentAmount || 0;
                                    item.TotalPatientResAmount += adj.AdjustmentAmount || 0;
                                } else {
                                    Aitem.TotalAdjustmentsAmount += adj.AdjustmentAmount || 0;
                                    item.TotalPatientAjustAmount += adj.AdjustmentAmount || 0;
                                }
                                $scope.ServiceAdjustment.push(adj);
                            });
                        }
                    });
                    $scope.TotalEobPatientResAmount += item.TotalPatientResponsibilityAmount || 0;
                    $scope.TotalEOBAdjustmentAmount += item.TotalAdjustmentAmount || 0;

                    $scope.TotalClaimsChargeAmount += item.TotalChargeAmount || 0;
                    $scope.TotalClaimsPatRespAmount += item.TotalPatientResAmount || 0;
                    $scope.TotalClaimsAdjustmentAmount += item.TotalPatientAjustAmount || 0;
                    $scope.TotalClaimsInsuBalanceAmt += item.TotalInsuranceBalance || 0;
                    $scope.TotalClaimsInsPaymentAmount += item.TotalInsurancePayment || 0;


                }
            });
        }

        var temptotalAdjamount = 0;
        if ($scope.ServiceAdjustment.length > 0) {
            angular.forEach($scope.ServiceAdjustment, function (aitem) {
                aitem.AdjsutmentDescription = aitem.AdjsutmentDescription || "";

                if (aitem.AdjsutmentDescription !== "" && aitem.DeleteInd === "N") {
                    if (!aitem.AdjsutmentDescription.startsWith(aitem.GroupCode + "-")) {
                        aitem.AdjsutmentDescription = aitem.GroupCode + '-' + aitem.AdjsutmentDescription;
                    }
                    var desc = aitem.AdjsutmentDescription;

                    if (typeof aitem.AdjustmentAmount === "string") {
                        aitem.AdjustmentAmount = Math.round(parseFloat(aitem.AdjustmentAmount) * 100) / 100;
                    }
                    if (!tempadjustmentMap[desc]) {
                        tempadjustmentMap[desc] = angular.copy(aitem);
                    } else {
                        tempadjustmentMap[desc].AdjustmentAmount += aitem.AdjustmentAmount;
                    }
                }

                aitem.AdjustmentAmount = aitem.AdjustmentAmount || null;
                if (aitem.AdjustmentAmount != null) {
                    aitem.AdjustmentAmount = parseFloat(aitem.AdjustmentAmount).toFixed(2);
                    var tempAdjAmount = parseFloat(aitem.AdjustmentAmount) || 0;
                    temptotalAdjamount += tempAdjAmount;
                }
            });

            angular.forEach(tempadjustmentMap, function (aitem) {
                $scope.AllServiceAdjustmentsList.push(aitem);
            });

            $scope.AllServiceAdjustmentsList = _.uniq($scope.AllServiceAdjustmentsList, false, function (p) { return p.AdjsutmentDescription; });

        }

        $scope.TotalAdjustmentAmount = 0;
        angular.forEach($scope.AllServiceAdjustmentsList, function (item) {
            $scope.TotalAdjustmentAmount += item.AdjustmentAmount
        });



        let modalInstance = $uibModal.open({
            templateUrl: 'TemplateReconcilation_Print.html',
            backdrop: 'static',
            keyboard: false,
            size: 'lg',
            "scope": $scope,
        });
        modalInstance.rendered.then(function () {

            $timeout(function () {

                if ($scope.AllServiceAdjustmentsList.length > 0) {
                    $scope.buildAdjustmentPieData(function () {
                        $timeout(function () {
                            openPrintWindow(modalInstance);
                        }, 300);
                    });
                } else {
                    openPrintWindow(modalInstance);
                }

            }, 300);
        });

    }

    var pieColors = [
        "#FF7F00", // strong orange
        "#FFD700", // gold
        "#556B2F", // dark olive
        "#008080", // teal
        "#4682B4", // steel blue
        "#00008B", // navy
        "#4B0082", // indigo
        "#8B0000", // dark red
        "#C71585", // medium violet red
        "#5A3A22",  // dark brown
        "#800080" // purple
    ];



    function openPrintWindow(modalInstance) {

        var page1 = document.getElementById('ReconcilationReport_print').innerHTML;
        var page2 = "";

        if ($scope.AllServiceAdjustmentsList.length > 0 || $scope.ERAUnmatchedClaimsList.length > 0) {
            page2 = document.getElementById('InsAdjustmentDetails_ReportPrint').innerHTML;
        }

        var innerContents = `
        <div class="print-page">${page1}</div>
        ${page2 ? `<div class="print-page">${page2}</div>` : ''}
    `;

        var popupWin = window.open('', '_blank');
        popupWin.document.open();
        popupWin.document.write(`
        <html>
        <head>
            <link rel="stylesheet" href="css/billing.css" />
            <style>
                @media print {
                    .print-page { page-break-after: always; }
                    table { page-break-inside: auto; }
                    tr, td { page-break-inside: avoid; }
                }
            </style>
        </head>
        <body onload="window.print()">
            ${innerContents}
        </body>
        </html>
    `);
        popupWin.document.close();

        modalInstance.dismiss('Cancel');
    }


    $scope.adjustmentPieChartInstance = null;
    $scope.AdjustmentPieBase64 = "";

    $scope.buildAdjustmentPieData = function (callback) {

        $timeout(function () {

            var canvas = document.getElementById("adjustmentPieChart");
            if (!canvas) return;

            var ctx = canvas.getContext("2d");

            if ($scope.adjustmentPieChartInstance) {
                $scope.adjustmentPieChartInstance.destroy();
            }

            var labels = [];
            var data = [];
            var offsets = [];

            angular.forEach($scope.AllServiceAdjustmentsList, function (item, index) {

                var amt = Number(item.AdjustmentAmount) || 0;
                if (amt > 0) {

                    // ✅ Extract ONLY adjustment code
                    var code = "";
                    if (item.AdjsutmentDescription) {
                        var parts = item.AdjsutmentDescription.split("-");
                        if (parts.length > 1) {
                            code = parts[1].trim().split(" ")[0]; // 170, 234, etc
                        }
                    }

                    if (!code) return;

                    labels.push(code);      // 👈 ONLY CODE
                    data.push(amt);
                    offsets.push(index === 0 ? 25 : 15);
                }
            });


            if (!data.length) return;

            $scope.adjustmentPieChartInstance = new Chart(ctx, {
                type: "pie",
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        offset: 18,          // ⭐ SAME distance for ALL slices
                        spacing: 3,          // ⭐ small consistent gap
                        backgroundColor: pieColors,
                        borderColor: "#000",
                        borderWidth: 2,
                        hoverOffset: 0
                    }]
                },
                options: {
                    responsive: false,
                    animation: false,

                    // 👇 ADD IT HERE
                    elements: {
                        arc: {
                            minAngle: 8   // ⭐ forces small slices to be visible
                        }
                    },

                    plugins: {
                        legend: {
                            position: "bottom",
                            labels: {
                                boxWidth: 12,
                                color: "#000",
                                font: {
                                    size: 12,
                                    weight: "bold"
                                }
                            }
                        },
                        title: {
                            display: true,
                            text: "Distribution by type of Adjustment",
                            font: {
                                size: 14,
                                weight: "bold"
                            }
                        }
                    }
                }
            });


            // Convert to Base64 for print
            $scope.AdjustmentPieBase64 = canvas.toDataURL("image/png");

            $timeout(function () {
                if (callback) callback();
            }, 300);

            $scope.$applyAsync();

        }, 300);
    };




    $scope.clearAdjustmentPieChart = function () {

        // Clear image
        $scope.AdjustmentPieBase64 = "";

        // Destroy chart instance
        if ($scope.adjustmentPieChartInstance) {
            $scope.adjustmentPieChartInstance.destroy();
            $scope.adjustmentPieChartInstance = null;
        }

        // Clear canvas
        var canvas = document.getElementById("adjustmentPieChart");
        if (canvas) {
            var ctx = canvas.getContext("2d");
            ctx && ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };





    $scope.OpenPatientAlertpopup = function () {

        if ($scope.EOBClaimList.length > 0) {
            $scope.PatientAlertobj = {
                "PatientId": $scope.EOBClaimList[0].PatientId,
                "PatientFullName": $scope.EOBClaimList[0].PatientName,
                "PatientDisplayID": $scope.EOBClaimList[0].PatientDisplayId,
            }
        }

        let obj = {
            "PatientId": $scope.PatientAlertobj.PatientId,
            "PatientFullName": $scope.PatientAlertobj.PatientFullName,
            "PatientDisplayID": $scope.PatientAlertobj.PatientDisplayID,
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
    }

    $scope.ChangeRetentionAdjustments1 = function (id) {
        var filterAdjArray = $filter("filter")($scope.EOBMasterAdjustments, { "EOBAdjustmentCodeId": id }, true);

        if (filterAdjArray.length > 0) {
            $scope.mainEOBPaymentPostingObj.RetentionAdjustmentId1 = filterAdjArray[0].EOBAdjustmentCodeId;
            $scope.mainEOBPaymentPostingObj.RetentionAdjustmentReason1 = filterAdjArray[0].AdjustmentDescription;
        }

    }
    $scope.ChangeRetentionAdjustments2 = function (id) {
        var filterAdjArray = $filter("filter")($scope.EOBMasterAdjustments, { "EOBAdjustmentCodeId": id }, true);

        if (filterAdjArray.length > 0) {
            $scope.mainEOBPaymentPostingObj.RetentionAdjustmentId2 = filterAdjArray[0].EOBAdjustmentCodeId;
            $scope.mainEOBPaymentPostingObj.RetentionAdjustmentReason2 = filterAdjArray[0].AdjustmentDescription;
        }
    }

    $scope.ChangePaymentstoProvAmount = function (obj) {

        if (obj.TotalPaymentAmount == '' || obj.TotalPaymentAmount == 0) {
            alertify.error("Please Enter Check Amount");
            obj.RetentionTaxAmount = 0;
            obj.RetentionAdjustmentAmount1 = 0;
            obj.RetentionAdjustmentAmount2 = 0;
            obj.RetentionOtherAdjAmount = 0;
            return false;
        }

        var taxAmount = parseFloat(obj.RetentionTaxAmount) || 0;
        var adjAmount1 = parseFloat(obj.RetentionAdjustmentAmount1) || 0;
        var adjAmount2 = parseFloat(obj.RetentionAdjustmentAmount2) || 0;
        var otherAdjAmount = parseFloat(obj.RetentionOtherAdjAmount) || 0;

        // Calculate total
        obj.TotalGlobalRetentionAmount = taxAmount + adjAmount1 + adjAmount2 + otherAdjAmount;

        obj.TotalPaymentToProvAmount = obj.TotalPaymentAmount - obj.TotalGlobalRetentionAmount;

    };





    $scope.manageProviderLevelAdjustments = function (item) {
        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/UsClaims/ProviderLevelAdjustments.html",
            "size": "lg",
            "backdrop": "static",
            "keyboard": false,
            "windowClass": "modal__ninety--",
            "resolve": {
                "EobItem": function () { return item; },
                "AllBranchesList": function () { return $scope.mainBillerDataObj.AllBranchesList ; },
            },
            "controller": function ($scope, $uibModalInstance, eHnoteInsuranceService, EobItem, eHnoteMasterDataService, eHnotePatientDataService, AllBranchesList) {


                var doctorinfo = eHnoteMasterDataService.getUserInfo();
                $scope.UserId = eHnoteMasterDataService.getLoginId();
                $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
               
                $scope.AllBranchesList = AllBranchesList||[];
                $scope.ParenthospitalId = 0;
                $scope.HospitalId = 0;
                if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
                    $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
                    $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
                    $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
                    $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
                };
              


                $scope.init = function () {
                    $scope.getPayorLevelAdjustment = function () {
                        var Obj = {
                            "OrganizationId": $scope.HospitalId,
                            "UserId": $scope.UserId,
                            "PostDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                            "EOBId": EobItem.EOBId,
                            "PaymentAmount": EobItem.TotalPaymentAmount,
                            "RemainingBalance": null,
                            "PostedAdjustmentAmount": EobItem.TotalAppliedAmount,
                            "PayerAdjAmount": EobItem.PayerAdjAmount||null,
                            "TotalTaxAmount": null,
                            "DeleteInd": "N",
                            "ProviderAdjustmentList": [],

                        }
                        return Obj;
                    }
                    $scope.PayorLevelAdjObj = angular.copy($scope.getPayorLevelAdjustment());

                    $scope.getVoucherObj = function () {
                        var Obj = {
                            "Date": "",
                            "DeleteInd": "N",
                            "ProviderleveladjustmentListId": null,
                            "ProviderLevelAdjustMentId": null,
                            "AdjustmentReasoncode": "",
                            "AdjustmentReasonDescription": "",
                            "PatientClaimId": null,
                            "ReferenceNumber": EobItem.ReferenceNumber,
                            "PatientClaimNumber": "",
                            "ProviderId": "",
                            "Notes": "",
                            "ClaimObj": "",
                            "ProviderNPI": "",
                            "ControlNumber": "",
                            "AdjustmentAmount": null,
                            "TaxAmount": null

                        }
                        return Obj;
                    }
                    $scope.VoucherObj = angular.copy($scope.getVoucherObj());
                    $q.all([

                        eHnoteInsuranceService.GetMasterProviderLevelAdjustMent(),
                    ]).then(function (resp) {


                        if (resp[0].data.MasterProviderLevelAdjustMent.length > 0) {
                            $scope.MasterProviderLevelAdjustMent = resp[0].data.MasterProviderLevelAdjustMent || [];
                        }
                    });



                    if (EobItem.ProviderAdjustmentList.length > 0) {
                        angular.forEach(EobItem.ProviderAdjustmentList, function (item) {
                            $scope.VoucherObj = angular.copy($scope.getVoucherObj());
                            $scope.VoucherObj.DeleteInd = 'N';
                            $scope.VoucherObj.ProviderleveladjustmentListId = item.ProviderleveladjustmentListId||null;
                            $scope.VoucherObj.Date = item.Date;
                            $scope.VoucherObj.ProviderLevelAdjustMentId = item.ProviderLevelAdjustMentId;
                            $scope.VoucherObj.AdjustmentReasoncode = item.AdjustmentReasonCode;
                            $scope.VoucherObj.AdjustmentReasonDescription = item.AdjustmentReasonDescription;
                            $scope.VoucherObj.ProviderNPI = item.ProviderNPI;
                            $scope.VoucherObj.Notes = item.Notes;
                            $scope.VoucherObj.ControlNumber = item.ControlNumber;
                            $scope.VoucherObj.AdjustmentAmount = item.AdjustmentAmount;
                            $scope.VoucherObj.TaxAmount = item.TaxAmount;

                            $scope.PayorLevelAdjObj.ProviderAdjustmentList.push($scope.VoucherObj);
                        })
                    }
                    $scope.VoucherObj = angular.copy($scope.getVoucherObj());


                }
                $scope.init();
                $scope.uibcloses = function () {
                    $uibModalInstance.dismiss("cancel");
                }

                $scope.ChangeProvider = function (Id) {
                    var filtredArray = $filter("filter")($scope.MasterProviderLevelAdjustMent, { "ProviderLevelAdjustMentId": Id }, true) || [];
                    if (filtredArray.length > 0) {
                        $scope.VoucherObj.AdjustmentReasoncode = filtredArray[0].ProviderLevelAdjustMentCode || "";
                        $scope.VoucherObj.AdjustmentReasonDescription = filtredArray[0].ProviderLevelAdjustMentDescription || "";
                    }
                }



                $scope.SearchAllClaimDetails = function () {

                    //$scope.OrgClaimListdata = [];

                    var Locationids = $scope.AllBranchesList
                        .filter(pitem => pitem.IsChecked && pitem.ClinicId !== 0)
                        .map(pitem => pitem.ClinicId)
                        .join(",");

                    var params = {
                        "OrganizationId": $scope.HospitalId,
                        "OrganizationFacilityId": 0,
                        "FromDate": null,
                        "ToDate": null,
                        "PatientId":0,
                        "PatienClaimNumber": $scope.VoucherObj.ClaimObj || "",
                        "BatchNumber": "",
                        "BillingProviderId": 0,
                        "RenderingProviderId": 0,
                        "TransmissionTypeId": 0,
                        "ClaimTypeId": 0,
                        "PayorId": 0,
                        "ClaimStatusList": "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27",
                        "PageSize":20,
                        "PageNumber": 1,
                        "FacilityListIds": '',
                        "Locationids": Locationids || "",
                    };
                    eHnotePatientDataService.GetOrganizationClaimsList(params).then(function (resp) {
                        if (resp.data.rows.length > 0) {
                            //$scope.PatientSearchdata = getSelectedPatientData();
                            let Tempdata = resp.data.rows || [];
                            let Tempdata1 = $filter("filter")(Tempdata, function (fitem) { return fitem.PayorId != null }, true) || [];
                            
                            angular.forEach(Tempdata1, function (item) {
                                let filter = $filter("filter")($scope.OrgClaimListdata, function (fitem) { return fitem.PatientClaimId == item.PatientClaimId; }, true) || [];
                                if (filter.length == 0) {
                                    item.IsChecked = false;
                                    $scope.OrgClaimListdata.push(item);
                                }
                            });
                        }
                    }, function (err) {

                    });
                }

                $scope.calculatePayorPaymentAmount = function () {
                    let TotalAdjamount = 0;
                    let TotalTaxamount = 0;
                    angular.forEach($scope.PayorLevelAdjObj.ProviderAdjustmentList, function (item) {
                        if (item.DeleteInd == 'N') {
                            let AdjustmentAmount = parseFloat(item.AdjustmentAmount) || 0;
                            if (item.AdjustmentReasoncode == "IR") {
                                TotalTaxamount += AdjustmentAmount;  // IR → tax bucket only
                            } else {
                                TotalAdjamount += AdjustmentAmount;  // others → adj bucket only
                            }
                            // ← no line here; the if/else is mutually exclusive
                        }
                    });
                    $scope.PayorLevelAdjObj.PayerAdjAmount = TotalAdjamount;
                    $scope.PayorLevelAdjObj.TotalTaxAmount = TotalTaxamount;
                }


                $scope.Deleteselecteditem = function (item, index) {
                    if (item.ProviderleveladjustmentListId != 0) {
                        item.DeleteInd = "Y";
                    } else {
                        $scope.PayorLevelAdjObj.ProviderAdjustmentList.splice(index, 1);
                    }
                    $scope.calculatePayorPaymentAmount();
                }

                $scope.AddVoucherAbj = function () {
                    $scope.VoucherObj.AdjustmentAmount = $scope.VoucherObj.AdjustmentAmount || null;
                    $scope.VoucherObj.ProviderLevelAdjustMentId = $scope.VoucherObj.ProviderLevelAdjustMentId || null;
                    $scope.VoucherObj.ControlNumber = $scope.VoucherObj.ControlNumber || "";
                    if ($scope.VoucherObj.ProviderLevelAdjustMentId == null) {
                        alertify.error("Please select Reason.");
                        return false;
                    }
                    if ($scope.VoucherObj.ControlNumber == "") {
                        alertify.error("Please Enter ControlNumber.");
                        return false;
                    }
                    if ($scope.VoucherObj.AdjustmentAmount == null) {
                        alertify.error("Enter Adjustment Amount.");                        
                        return false;
                    }

                    var filterAdjArray = $filter("filter")($scope.PayorLevelAdjObj.ProviderAdjustmentList, { "ProviderLevelAdjustMentId": $scope.VoucherObj.ProviderLevelAdjustMentId, "DeleteInd": "N" }, true)||[];

                    if (filterAdjArray.length > 0) {
                        filterAdjArray[0].DeleteInd = 'N';
                        filterAdjArray[0].AdjustmentAmount = $scope.VoucherObj.AdjustmentAmount;
                        filterAdjArray[0].ControlNumber = $scope.VoucherObj.ControlNumber;
                        filterAdjArray[0].ProviderNPI = $scope.VoucherObj.ProviderNPI;
                        filterAdjArray[0].Notes = $scope.VoucherObj.Notes;
                    } else {

                        let Obj = {
                            "ProviderleveladjustmentListId": $scope.VoucherObj.ProviderleveladjustmentListId||null,
                            "Date": $scope.VoucherObj.Date,
                            "DeleteInd": $scope.VoucherObj.DeleteInd,
                            "ProviderLevelAdjustMentId": $scope.VoucherObj.ProviderLevelAdjustMentId,
                            "AdjustmentReasoncode": $scope.VoucherObj.AdjustmentReasoncode,
                            "AdjustmentReasonDescription": $scope.VoucherObj.AdjustmentReasonDescription,
                            "PatientClaimId": $scope.VoucherObj.PatientClaimId,
                            "PatientClaimNumber": $scope.VoucherObj.PatientClaimNumber,
                            "ControlNumber": $scope.VoucherObj.ControlNumber,
                            "ProviderNPI": $scope.VoucherObj.ProviderNPI,
                            "Notes": $scope.VoucherObj.Notes,                           
                            "AdjustmentAmount": $scope.VoucherObj.AdjustmentAmount

                        }
                        $scope.PayorLevelAdjObj.ProviderAdjustmentList.push(Obj);
                    }

                    $scope.calculatePayorPaymentAmount();
                    $scope.VoucherObj = angular.copy($scope.getVoucherObj());
                }

                $scope.SaveVoucherAdj = function () {

                    $scope.PayorLevelAdjObj.ProviderAdjustmentList = $scope.PayorLevelAdjObj.ProviderAdjustmentList || [];
                    var filterAdjArray = $filter("filter")($scope.PayorLevelAdjObj.ProviderAdjustmentList, { "DeleteInd": "N" }, true) || [];
                    if (filterAdjArray.length == 0) {
                        alertify.error("Please add at least one provider adjustment.");
                        return false;                      
                    }

                    $uibModalInstance.close($scope.PayorLevelAdjObj);
                }

                //$scope.SaveVoucherAdj = function () {
                //    let obj = {
                //        "OrganizationId": $scope.PayorLevelAdjObj.OrganizationId,
                //        "UserId": $scope.PayorLevelAdjObj.UserId,
                //        "PostDate": $scope.PayorLevelAdjObj.PostDate,
                //        "EOBId": $scope.PayorLevelAdjObj.EOBId,
                //        "PaymentAmount": $scope.PayorLevelAdjObj.PaymentAmount,
                //        "RemainingBalance": $scope.PayorLevelAdjObj.RemainingBalance,
                //        "PostedAdjustmentAmount": $scope.PayorLevelAdjObj.PostedAdjustmentAmount,
                //        "PayerAdjAmount": $scope.PayorLevelAdjObj.PayerAdjAmount,
                //        "DeleteInd": $scope.PayorLevelAdjObj.DeleteInd,
                //        "ProviderAdjustmentList": $scope.PayorLevelAdjObj.ProviderAdjustmentList
                //    }

                //    eHnoteInsuranceService.AddpayorlevelAdjustment(obj).then(function (resp) {
                //        if (resp.data.status == "Success") {
                //            alertify.success("Added successfully");
                //            return false;
                //        } else {
                //            alertify.error(resp.data.Message);
                //        }
                //    });
                //}





            }
        });

        $scope.mInstanceAdd.result.then(function (resp) {
            console.log(resp);

            $scope.mainEOBPaymentPostingObj.PayerAdjAmount = resp.PayerAdjAmount || null;
            $scope.mainEOBPaymentPostingObj.TotalTaxAmount = resp.TotalTaxAmount || null;
            if (resp.ProviderAdjustmentList.length>0) {
                $scope.mainEOBPaymentPostingObj.ProviderAdjustmentList = resp.ProviderAdjustmentList || [];
            }

            angular.forEach($scope.ClaimProviderList, function (pitem) {
                angular.forEach($scope.mainEOBPaymentPostingObj.BillingProvidersList, function (item) {

                    if (pitem.OrganizationBillingProviderId == item.OrganizationBillingProviderId) {
                        pitem.IsChecked = true;
                        pitem.EOBBillingProviderId = item.EOBBillingProviderId;
                    }

                });
            });
            $scope.selectedBillingProviders = $scope.ClaimProviderList.map(item => ({
                EOBBillingProviderId: item.EOBBillingProviderId || 0,
                OrganizationBillingProviderId: item.OrganizationBillingProviderId,
                BillingProviderName: item.BillingProviderName,
                NPI: item.NPI,
                DeleteInd: item.IsChecked ? "N" : "Y" // "N" for checked, "Y" for unchecked
            }));


            $scope.AddUpdateEOBPaymentDetails();

        }, function () { });
    }

    $scope.addPaymentPostingForEOBSelectedClaims = function () {

        $scope.IsAllClaims = false;
        let filterobj1 = $filter("filter")($scope.EOBClaimList, { "IsSelected": true }) || [];


        if (filterobj1.length === 0) {
            alertify.error("Please select a claim to post");
            return false;
        }


        var claimsListString = "";
        angular.forEach($scope.EOBClaimList, function (mitems) {
            if (mitems.IsSelected) {
                if (claimsListString) {
                    claimsListString += ",";
                }
                claimsListString += mitems.PatientClaimId;
            }
        });

        $scope.claimsListString = claimsListString;
        console.log($scope.claimsListString);





        var params = {
            "UserId": $scope.UserId,
            "EOBId": $scope.mainEOBPaymentPostingObj.EOBId || 0,
            "IsPostPayment": true,
            "PostingDate": currentdate,
            "IsAllClaims": $scope.IsAllClaims,
            "claimsListString": $scope.claimsListString || ""
        }






        console.log(JSON.stringify(params));

        eHnoteInsuranceService.UpdateEOBToBeActive(params, onSuccess, onError);
        function onSuccess(resp) {
            if (resp.Status === 'Success') {
                alertify.success("Posted Successfully");
                $scope.Changesubtab(2)
            }
            console.log(resp);

        }
        function onError(reponse) {
        }
    }
}]);
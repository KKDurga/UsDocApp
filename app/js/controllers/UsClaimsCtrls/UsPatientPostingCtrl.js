"use strict";
eHnoteWebApp.controller("UsPatientPostingCtrl", ["$scope", "$rootScope", "$location", "$filter", "alertify", "$uibModal", "datapersistanceFactory", "$q", "$timeout", "eHnoteMasterDataService", "eHnoteLoginStatusService", "eHnoteCacheStorageService", "eHnoteInsuranceService", "eHnoteSettingsDataService", "eHnotePatientDataService", "eHnoteUserDataService", "InventoryService", "eHnoteMainAdminServices", "eHnoteMainAppointmentService", function ($scope, $rootScope, $location, $filter, alertify, $uibModal, datapersistanceFactory, $q, $timeout, eHnoteMasterDataService, eHnoteLoginStatusService, eHnoteCacheStorageService, eHnoteInsuranceService, eHnoteSettingsDataService, eHnotePatientDataService, eHnoteUserDataService, InventoryService, eHnoteMainAdminServices, eHnoteMainAppointmentService) {

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

    $scope.patSearchType = 2;
    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
    var mObj = datapersistanceFactory.getItem("masterDataArrays");

    $scope.masterPaymentModes = [];
    $scope.masterDepositTypes = [];
    $scope.masterDepositStatus = [];
    $scope.masterSettlementStatus = [];
    if (mObj.PaymentModes && mObj.PaymentModes.length > 0) {
        angular.forEach(mObj.PaymentModes, function (pobj) {
            if (pobj.PaymentModeId === 1 || pobj.PaymentModeId === 2 || pobj.PaymentModeId === 3 || pobj.PaymentModeId === 5 || pobj.PaymentModeId === 7 || pobj.PaymentModeId === 12) {
                $scope.masterPaymentModes.push(pobj);
            }
        });
    }
    if (mObj.DepositTypes && mObj.DepositTypes.length > 0) {
        $scope.masterDepositTypes = angular.copy(mObj.DepositTypes);
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
            if (item.SettlementStatusId === 2 || item.SettlementStatusId === 3) {
                $scope.masterSettlementStatus.push(item);
            }
        });
    }

    $scope.masterPaymentCodes = [
        { DepositTypeId: 1, DepositType: 'Deposit' },
        { DepositTypeId: 2, DepositType: 'Copay' },
        { DepositTypeId: 3, DepositType: 'Deductible' },
        { DepositTypeId: 4, DepositType: 'General' },

    ];
    $scope.masterPatientPaymentAdjustment = [
        { ReasonCodeId: 1, ReasonCode: 'Financial Hardship Adjustment' },
        { ReasonCodeId: 2, ReasonCode: 'Small Amount Write-off' },
        { ReasonCodeId: 3, ReasonCode: 'Bad Debt Write-off' },
        { ReasonCodeId: 4, ReasonCode: 'Charity Care Adjustment' },
        { ReasonCodeId: 5, ReasonCode: 'Uninsured Discount' },
        { ReasonCodeId: 6, ReasonCode: 'Patient Payment Plan Adjustment' },
        { ReasonCodeId: 7, ReasonCode: 'Administrative Adjustment' },
        { ReasonCodeId: 8, ReasonCode: 'Non-covered Services Adjustment' },
        { ReasonCodeId: 9, ReasonCode: 'Prompt Pay Discount' },
        { ReasonCodeId: 10, ReasonCode: 'Inability to Pay Adjustment' }
    ];


    $scope.GetPatientPostingObj = function () {
        let Obj = {
            "PatientDepositId": 0,
            "EOBId": 0,
            "IsPatientDeposit": false,
            "PostingDate": null,
            "EOBName": "",
            "EOBTypeId": 0,
            "EOBType": "",
            "PaymentMethodId": "",
            "PaymentMethod": "",
            "ProcessingTypeId": 0,
            "ProcessingType": "",
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
            "TotalPaymentAmount": "",
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
            "PatientName": "",
            "PatientId": null,
            "PatientAddress": "",
            "BatchNumber": "",
            "DepositStatus": "",
            "DepositStatusId": "",
            "DepositTypeId": 0,
            "DepositTypeName": "",
            "Notes": "",
            "IsShowPatienPostListScreen": false,
            "IsShowPatientScreen": false,
            "IsShowPatientAddingScreen": false,
            "IsShowPatientListScreen": false,
            "IsPatientEditModeInd": false,
            "IsPatientPostSummaryScreen": false,
            "IsDataAdded": false,
            "IsEditMode": false,
            "DocumentDetails": [],
            "PatientDepositPaymodeList": [],
            "DeleteInd": "N",
            "UnBilledAmount": null,
            "BilledAmount": null,
            "DepositAmount": null,
        }
        return Obj;
    }
    $scope.PatientPostingObj = $scope.GetPatientPostingObj();

    $scope.GetPatientPaymentFilterObj = function () {
        var obj = {
            "PageSize": 100,
            "PageNumber": 1,
            "PatientId": 0,
            "PatientName": "",
            "PostingFromDate": null,
            "PostingToDate": null,
            "DepositFromDate": null,
            "DepositToDate": null,
            "DepositStatusId": "",
            "PaymentMethodId": "",
            "DepositTypeId": "",
            "SettlementStatusId": "",
            "BatchNumber": "",
            "ReferenceNumber": "",
            "SortById": "",
            "SortByName": ""
        }
        return obj;
    }
    $scope.PatientPaymentFilterObj = $scope.GetPatientPaymentFilterObj();

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


    function getSelectedPatientData() {
        var obj = {
            "SearchText": "",
            "PatientId": 0,
            "SearchTypeId": 2
        }
        return obj;
    };
    $scope.PatientSearchdata = getSelectedPatientData();

    $scope.changePatientSearchType = function (id) {
        $scope.PatientSearchdata = getSelectedPatientData();
        $scope.PatientSearchdata.SearchTypeId = id;
        $scope.PatientPaymentFilterObj.PatientId = 0;
        $scope.AllPatientList = [];
        $scope.ShowPatientListDrop = false;
        $scope.clearPatientSearchData();
    }

    $scope.LoadPatientDetailsSearch = function (val) {


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
        $scope.PatientPaymentFilterObj.PatientId = 0;
        $scope.PatientPaymentFilterObj.ReferenceNumber = '';
    };

    $scope.SelectedPatient = function (patietnitem) {
        $scope.PatientSearchdata.PatientId = patietnitem.PatientID;
        $scope.PatientPaymentFilterObj.PatientId = patietnitem.PatientID;
        $scope.PatientSearchdata.SearchText = patietnitem.FullName;
        $scope.AllPatientList = [];
        $scope.SearchPaymentDetails();
        $scope.ShowPatientListDrop = false;

    };

    $scope.openattachmentfile = function (url) {
        url = url || "";
        if (url != "") {
            window.open(url);
        }
    }

    $scope.RefreshAllPaymentDetails = function () {
        $scope.PatientPaymentFilterObj = $scope.GetPatientPaymentFilterObj();
        $scope.ShowPatientListDrop = false;
        var Frezobj = {
            "PostingFromDate": $scope.PatientPaymentFilterObj.PostingFromDate || null,
            "PostingToDate": $scope.PatientPaymentFilterObj.PostingToDate || null,
            "DepositFromDate": $scope.PatientPaymentFilterObj.DepositFromDate || null,
            "DepositToDate": $scope.PatientPaymentFilterObj.DepositToDate || null,
            "DepositStatusId": $scope.PatientPaymentFilterObj.DepositStatusId || 0,
            "PaymentMethodId": $scope.PatientPaymentFilterObj.PaymentMethodId || 0,
            "DepositTypeId": $scope.PatientPaymentFilterObj.DepositTypeId || 0,
            "SettlementStatusId": $scope.PatientPaymentFilterObj.SettlementStatusId || 0,
        };
        eHnoteMasterDataService.addPosting_PatientfreezingList(Frezobj);
        $scope.SearchPaymentDetails();
    }

    $scope.PatientPostingEdit = function (val, item) {
        if (val === 1) {
            $scope.PatientPostingObj.EOBId = 0;
            $scope.PatientPostingObj.PatientName = "";
            $scope.PatientPostingObj.PatientAddress = "";
            $scope.PatientPostingObj.BatchName = "";
            $scope.PatientPostingObj.PaymentMethodId = "";
            $scope.PatientPostingObj.ReferenceNumber = "";
            $scope.PatientPostingObj.ReferenceNumber = "";
            $scope.PatientPostingObj.DepositStatusId = 1;
            $scope.PatientPostingObj.DepositStatus = "Pending";
            $scope.PatientPostingObj.PaymentDate = null;
            $scope.PatientPostingObj.PostingDate = null;
            $scope.PatientPostingObj.DepositTypeId = "";
            $scope.PatientPostingObj.TotalPaymentAmount = "";
            $scope.PatientPostingObj.Notes = "";
            $scope.PatientPostingObj.DocumentDetails = [];
            $scope.AllPatientsList = [];
            $scope.PatientPostingObj.IsShowPatienPostListScreen = false;
            $scope.PatientPostingObj.IsShowPatientAddingScreen = true;
            $scope.PatientPostingObj.IsPatientPostSummaryScreen = false;
            $scope.PatientPostingObj.IsEditMode = false;
        } else if (val === 2) {
            $scope.PatientPostingObj.PatientName = "";
            $scope.AllPatientsList = [];
            $scope.PatientPostingObj.IsShowPatienPostListScreen = true;
            $scope.PatientPostingObj.IsShowPatientAddingScreen = false;
            $scope.PatientPostingObj.IsPatientPostSummaryScreen = false;
        } else if (val === 3) {
            $scope.PatientPostingObj.IsShowPatienPostListScreen = false;
            $scope.PatientPostingObj.IsShowPatientAddingScreen = true;
            $scope.PatientPostingObj.IsPatientPostSummaryScreen = false;
            $scope.PatientPostingObj.IsEditMode = true;
        } else if (val === 4) {
            $scope.PatientPostingObj.IsShowPatienPostListScreen = false;
            $scope.PatientPostingObj.IsShowPatientAddingScreen = false;
            $scope.PatientPostingObj.IsPatientPostSummaryScreen = true;
            $scope.PatientPostingObj.IsEditMode = false;
            $scope.PatientPostingObj.IsPatientDeposit = true;

            $scope.PatientPostingObj.EOBId = item.EOBId;
            $scope.PatientPostingObj.S3URL = item.S3URL;
            $scope.PatientPostingObj.PatientId = item.PatientId;
            $scope.PatientPostingObj.PatientName = item.PatientName || "";
            $scope.PatientPostingObj.PatientDisplayId = item.PatientDisplayId || "";
            $scope.PatientPostingObj.DOB = item.PatientDOB || "";
            $scope.PatientPostingObj.PatientMobile = item.MobileNo || "";
            $scope.PatientPostingObj.OrganizationName = item.OrganizationName || "";
            $scope.PatientPostingObj.PatientAddress = item.PatientAddress || "";
            $scope.PatientPostingObj.BatchNumber = item.BatchNumber;
            $scope.PatientPostingObj.PaymentMethodId = item.PaymentMethodId;
            $scope.PatientPostingObj.PaymentMethod = item.PaymentMethod || "";
            $scope.PatientPostingObj.ReferenceNumber = item.ReferenceNumber;
            $scope.PatientPostingObj.DepositStatusId = item.DepositStatusId;
            $scope.PatientPostingObj.DepositStatus = item.DepositStatus || "";
            $scope.PatientPostingObj.PaymentDate = $filter('date')(item.PaymentDate, "MM-dd-yyyy") || "";
            $scope.PatientPostingObj.DepositDate = $filter('date')(item.DepositDate, "MM-dd-yyyy") || "";
            $scope.PatientPostingObj.PostingDate = $filter('date')(item.PostingDate, "MM-dd-yyyy") || "";
            $scope.PatientPostingObj.DepositTypeId = item.DepositTypeId;
            $scope.PatientPostingObj.DepositTypeName = item.DepositTypeName || "";
            $scope.PatientPostingObj.TotalPaymentAmount = item.TotalPaymentAmount;
            $scope.PatientPostingObj.Notes = item.Notes || "";
            $scope.PatientPostingObj.EOBFileId = item.EOBFileId || 0;
            $scope.PatientPostingObj.EOBFileName = item.EOBFileName || "";
            $scope.PatientPostingObj.EOBFileS3URL = item.EOBFileS3URL || "";
            $scope.PatientPostingObj.DepositAmount = item.DepositAmount || 0;
            $scope.PatientPostingObj.UnBilledAmount = item.UnBilledAmount || 0;
            $scope.PatientPostingObj.TotalUnAppliedAmount = item.TotalUnAppliedAmount || 0;
            $scope.PatientPostingObj.PaymentMethod = item.PaymentMethod || "";
            $scope.PatientPostingObj.PaymentMethodId = item.PaymentMethodId || "";
            $scope.PatientPostingObj.ReceiptNumber = item.ReceiptNumber || "";

            if ($scope.PatientPostingObj.PatientMobile != "") {
                var obj = eHnoteUserDataService.UsMobileFormatChange($scope.PatientPostingObj.PatientMobile);
                $scope.PatientPostingObj.PatientMobile = obj.UsFormatMobileNumber;
            }

            var obj = {
                "EOBFileId": $scope.PatientPostingObj.EOBFileId,
                "EOBFileName": $scope.PatientPostingObj.EOBFileName,
                "EOBFileS3URL": $scope.PatientPostingObj.EOBFileS3URL
            }
            $scope.PatientPostingObj.DocumentDetails.push(obj);

            $scope.GetPatientResponsibility();
        }
    }

    $scope.LoadPatientSearch = function (val) {

        $scope.AllPatientsList = [];
        if (val == undefined || val == null || val == "") {
            $scope.PatientPostingObj.PatientId = 0;
            return false;
        }

        var object = {
            "ParentOrganizationId": $scope.ParenthospitalId,
            "Name": val,
            "Mobile": null,
            "PatientId": null,
            "PageSize": 30,
            "PageNo": 1,
            "DOB": null
        };
        InventoryService.SearchInvPatient(object).then(function (resp) {
            if (resp.data.data.length !== 0) {
                if (resp.data.data != undefined) {

                    var patientList = resp.data.data || [];
                    angular.forEach(patientList, function (items) {
                        var obj = {
                            "FullName": items.fullname,
                            "PatientId": items.PatientId,
                            "PatientHomeNumber": items.MobileNo,
                            "PatientDisPlayID": items.PatientDisplayId,
                            "HomeCountryCode": items.HomeCountryCode || "",
                            "HomeAreaCode": items.HomeAreaCode || "",
                            "HomeNumber": items.HomeNumber || "",
                            "Address1": items.Address1 || "",
                            "Address2": items.Address2 || "",
                            "Gender": items.Sex || "",
                            "DOB": items.DOB || "",
                        };
                        $scope.AllPatientsList.push(obj);
                    });
                }
            } else {
                $scope.patients = [];
            }
        }, function (err) { console.log(err); alertify.error("Search Patient Failed"); });
    };

    $scope.selectAttachementfile = function (file) {
        $scope.PatientPostingObj.DocumentDetails = [];

        $scope.file = "";

        $scope.file = file;
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
                "DeleteInd": "N",
                "DocumentId": 0,
                "DocumentExt": $scope.file.type,
                "DisplayName": name
            };

            if ($scope.file != "") {
                $scope.PatientPostingObj.DocumentDetails.push(obj);
            }

            angular.element("input[type='file']").val(null);
        }
    };

    $scope.SelectedPatientDetails = function (item) {
        $scope.PatientPostingObj.PatientId = item.PatientId || null;
        $scope.PatientPaymentFilterObj.PatientId = item.PatientId || null;
        $scope.PatientPaymentFilterObj.PatientName = item.FullName;
        $scope.PatientPostingObj.PatientName = item.FullName;
        $scope.PatientPostingObj.PatientAddress = item.Address1 || "";
        $scope.AllPatientsList = [];
    }

    $scope.changePaymentCode = function (Id, Paymentcodelist) {
        var templist = $filter("filter")(Paymentcodelist, { "DepositTypeId": Id }, true) || [];
        if (templist.length > 0) {
            $scope.PatientPostingObj.DepositTypeName = templist[0].DepositTypeName || "";
        }
    }

    $scope.changePaymentType = function (Id, Paymentlist) {
        var templist = $filter("filter")(Paymentlist, { "PaymentModeId": Id }, true) || [];
        if (templist.length > 0) {
            $scope.PatientPostingObj.PaymentMethod = templist[0].PaymentModeName || "";
        }
    }

    $scope.changeAdjustment = function (typeid, mainitem) {
        var filterArray = $filter("filter")($scope.WriteOffReasons, { "OrganizationWriteOffReasonId": typeid }, true) || [];
        if (filterArray.length > 0) {
            mainitem.AdjustmentReasonCode = filterArray[0].ReasonDescription;
        }
    }

    $scope.changesDepositStatus = function (statusid) {
        if (statusid == 1) {
            $scope.PatientPostingObj.DepositStatus = "Pending";
        } else {
            $scope.PatientPostingObj.DepositStatus = "Deposited";
        }
    }

    $scope.ClearDetails = function () {
        $scope.PatientPostingObj.PatientId = null;
        $scope.PatientPostingObj.PatientName = "";
        $scope.PatientPostingObj.PatientAddress = "";
        $scope.PatientPostingObj.BatchName = "";
        $scope.PatientPostingObj.PaymentMethodId = "";
        $scope.PatientPostingObj.ReferenceNumber = "";
        $scope.PatientPostingObj.DepositStatusId = 1;
        $scope.PatientPostingObj.DepositStatus = "Pending";
        $scope.PatientPostingObj.PaymentDate = null;
        $scope.PatientPostingObj.PaymentCodeId = "";
        $scope.PatientPostingObj.TotalPaymentAmount = "";
        $scope.PatientPostingObj.DocumentDetails = [];
        $scope.PatientPostingObj.PostingDate = null;
        $scope.PatientPostingObj.Notes = "";
        $scope.PatientPostingObj.DepositTypeName = "";
        $scope.PatientPostingObj.DepositTypeId = "";
    }

    $scope.init = function () {

        $scope.PatientPaymentList = [];
        $scope.filterPatientPaymentList = [];
        $scope.PatientPaymentListCount = 0;
        $scope.WriteOffReasons = [];

        $scope.selectedPosting_PatientfreezList = eHnoteMasterDataService.getPosting_PatientfreezingList();
        if ($scope.selectedPosting_PatientfreezList != '') {
            $scope.PatientPaymentFilterObj.PostingFromDate = $scope.selectedPosting_PatientfreezList.PostingFromDate || null;
            $scope.PatientPaymentFilterObj.PostingToDate = $scope.selectedPosting_PatientfreezList.PostingToDate || null;
            $scope.PatientPaymentFilterObj.DepositFromDate = $scope.selectedPosting_PatientfreezList.DepositFromDate || null;
            $scope.PatientPaymentFilterObj.DepositToDate = $scope.selectedPosting_PatientfreezList.DepositToDate || null;
            $scope.PatientPaymentFilterObj.DepositStatusId = $scope.selectedPosting_PatientfreezList.DepositStatusId || 0;
            $scope.PatientPaymentFilterObj.PaymentMethodId = $scope.selectedPosting_PatientfreezList.PaymentMethodId || 0;
            $scope.PatientPaymentFilterObj.DepositTypeId = $scope.selectedPosting_PatientfreezList.DepositTypeId || 0;
            $scope.PatientPaymentFilterObj.SettlementStatusId = $scope.selectedPosting_PatientfreezList.SettlementStatusId || 0;
        }

        var obj = {
            "OrganizationId": $scope.HospitalId,
            "PageSize": $scope.PatientPaymentFilterObj.PageSize || 100,
            "PageNumber": $scope.PatientPaymentFilterObj.PageNumber || 1,
            "PostingFrom": $scope.PatientPaymentFilterObj.PostingFromDate,
            "PostingTo": $scope.PatientPaymentFilterObj.PostingToDate,
            "PaymentFrom": $scope.PatientPaymentFilterObj.DepositFromDate,
            "PaymentTo": $scope.PatientPaymentFilterObj.DepositToDate,
            "PatientId": $scope.PatientPaymentFilterObj.PatientId || null,
            "DepositStatusId": $scope.PatientPaymentFilterObj.DepositStatusId,
            /*"PaymentModeId": $scope.PatientPaymentFilterObj.PaymentModeId,*/
            "PaymentModeId": $scope.PatientPaymentFilterObj.PaymentMethodId,
            "DepositTypeId": $scope.PatientPaymentFilterObj.DepositTypeId,
            "SettlementStatusId": $scope.PatientPaymentFilterObj.SettlementStatusId,
            "ReferenceNumber": $scope.PatientPaymentFilterObj.ReferenceNumber,
            "SearchText": $scope.PatientPaymentFilterObj.SearchText || "",
            "PatientMRNo": $scope.PatientPaymentFilterObj.PatientMRNo || "",
            "BatchNumber": $scope.PatientPaymentFilterObj.BatchNumber,
            "SortById": $scope.PatientPaymentFilterObj.SortById || 0,
            "SortByName": $scope.PatientPaymentFilterObj.SortByName || "",
        }

        let Param = {
            "EOBId": $scope.PatientPostingObj.EOBId || 0
        }

        $q.all([
            eHnoteInsuranceService.GetPatientPaymentsList(obj),
            eHnoteInsuranceService.GetParticularEOBDetailsById($scope.PatientPostingObj.EOBId),
            eHnoteSettingsDataService.GetAllMasterClaimsData($scope.HospitalId),

        ]).then(function (resp) {
            if (resp[0].data.status === "Success") {
                if (resp[0].data.rows.length > 0) {
                    $scope.PatientPaymentList = angular.copy(resp[0].data.rows);
                    $scope.filterPatientPaymentList = angular.copy($scope.PatientPaymentList);
                    $scope.PatientPaymentListCount = angular.copy(resp[0].data.count);
                    angular.forEach($scope.PatientPaymentList, function (item) {
                        item.UnBilledAmount = item.TotalUnAppliedAmount || 0;
                        item.BilledAmount = item.TotalAppliedAmount || 0;
                        item.DepositAmount = item.TotalPaymentAmount || 0;
                    });
                }
            }
            if (resp[1].data.status == "Success") {
                if (resp[1].data.rows.length > 0) {

                    var resp = angular.copy(resp[1].data.rows[0]);

                    $scope.PatientPostingObj.EOBId = resp.EOBId || 0;
                    $scope.PatientPostingObj.PostingDate = resp.PostingDate || null;
                    $scope.PatientPostingObj.EOBName = resp.EOBName || "";
                    $scope.PatientPostingObj.EOBTypeId = resp.EOBTypeId || 0;
                    $scope.PatientPostingObj.EOBType = resp.EOBType || "";
                    $scope.PatientPostingObj.PaymentMethodId = resp.PaymentMethodId || 0;
                    $scope.PatientPostingObj.PaymentMethod = resp.PaymentMethod || "";
                    $scope.PatientPostingObj.ProcessingTypeId = resp.ProcessingTypeId || 0;
                    $scope.PatientPostingObj.ProcessingType = resp.ProcessingType || "";
                    $scope.PatientPostingObj.EOBCategory = resp.EOBCategory || "";
                    $scope.PatientPostingObj.PaymentReceivedAt = resp.PaymentReceivedAt || "";
                    $scope.PatientPostingObj.PaymentFormatCode = resp.PaymentFormatCode || "";
                    $scope.PatientPostingObj.PaymentDate = resp.PaymentDate || null;
                    $scope.PatientPostingObj.ReferenceNumber = resp.ReferenceNumber || 0;
                    $scope.PatientPostingObj.PayorName = resp.PayerName || "";
                    $scope.PatientPostingObj.PayorAddress = resp.PayorAddress || "";
                    $scope.PatientPostingObj.PayorId = resp.PayorId || 0;
                    $scope.PatientPostingObj.OrganizationPayorId = resp.OrganizationPayorId || 0;
                    $scope.PatientPostingObj.OrganizationBillingProviderId = resp.OrganizationBillingProviderId || 0;
                    $scope.PatientPostingObj.BillingProviderName = resp.BillingProviderName || "";
                    $scope.PatientPostingObj.BillingProviderNPI = resp.BillingProviderNPI || "";
                    $scope.PatientPostingObj.TotalPaymentAmount = resp.TotalPaymentAmount || 0;
                    $scope.PatientPostingObj.TotalAllowedAmount = resp.TotalAllowedAmount || 0;
                    $scope.PatientPostingObj.TotalDeductAmount = resp.TotalDeductAmount || 0;
                    $scope.PatientPostingObj.TotalCoInsuranceAmount = resp.TotalCoInsuranceAmount || 0;
                    $scope.PatientPostingObj.TotalAdjustmentAmount = resp.TotalAdjustmentAmount || 0;
                    $scope.PatientPostingObj.TotalWriteOffAmount = resp.TotalWriteOffAmount || 0;
                    $scope.PatientPostingObj.TotalPatientResponsibilityAmount = resp.TotalPatientResponsibilityAmount || 0;
                    $scope.PatientPostingObj.TotalDeniedAmount = resp.TotalDeniedAmount || 0;
                    $scope.PatientPostingObj.TotalPatientResponsibilityWriteOffAmount = resp.TotalPatientResponsibilityWriteOffAmount || 0;
                    $scope.PatientPostingObj.TotalAppliedAmount = resp.TotalAppliedAmount || 0;
                    $scope.PatientPostingObj.TotalUnAppliedAmount = resp.TotalUnAppliedAmount || 0;
                    $scope.PatientPostingObj.TotalZeroLineItems = resp.TotalZeroLineItems || 0;
                    $scope.PatientPostingObj.TotalDeniedLineItems = resp.TotalDeniedLineItems || 0;
                    $scope.PatientPostingObj.PayerIdentifier = resp.PayerIdentifier || "";
                    $scope.PatientPostingObj.FederalTaxPayersIdentificationNumber = resp.FederalTaxPayersIdentificationNumber || "";
                    $scope.PatientPostingObj.ClaimPaymentInfo = resp.ClaimPaymentInfo || "";
                    $scope.PatientPostingObj.ReceiptNumber = resp.ReceiptNumber || "";
                    $scope.PatientPostingObj.ReceiptId = resp.ReceiptId || 0;
                    $scope.PatientPostingObj.EOBFileId = resp.EOBFileId || 0;
                    $scope.PatientPostingObj.EOBFileName = resp.EOBFileName || "";
                    $scope.PatientPostingObj.EOBFileS3URL = resp.EOBFileS3URL || "";
                    $scope.PatientPostingObj.EDIFileId = resp.EDIFileId || 0;
                    $scope.PatientPostingObj.EDIFileName = resp.EDIFileName || "";
                    $scope.PatientPostingObj.EDIFileS3URL = resp.EDIFileS3URL || "";
                    $scope.PatientPostingObj.DepositedBy = resp.DepositedBy || 0;
                    $scope.PatientPostingObj.DepositDate = resp.DepositDate || null;
                    $scope.PatientPostingObj.Notes = resp.Notes || "";
                    $scope.PatientPostingObj.DepositStatus = resp.DepositStatus || "";
                    $scope.PatientPostingObj.DepositStatusId = resp.DepositStatusId || 1;
                    $scope.PatientPostingObj.PatientId = resp.PatientId || null;
                    $scope.PatientPostingObj.PatientAddress = resp.PatientAddress || "";
                    $scope.PatientPostingObj.DepositTypeId = resp.DepositTypeId || "";
                    $scope.PatientPostingObj.DepositTypeName = resp.DepositTypeName || "";
                    $scope.PatientPostingObj.PatientName = resp.PatientName || "";
                    $scope.PatientPostingObj.PatientDisplayId = resp.PatientDisplayId || "";

                    var obj = {
                        "EOBFileId": $scope.PatientPostingObj.EOBFileId,
                        "EOBFileName": $scope.PatientPostingObj.EOBFileName,
                        "EOBFileS3URL": $scope.PatientPostingObj.EOBFileS3URL
                    }
                    $scope.PatientPostingObj.DocumentDetails.push(obj);



                }

                if ($scope.PatientPostingObj.IsDataAdded == false) {
                    $scope.PatientPostingObj.IsShowPatienPostListScreen = true;
                    $scope.PatientPostingObj.IsShowPatientAddingScreen = false;
                    $scope.PatientPostingObj.IsPatientPostSummaryScreen = false;
                } else {
                    $scope.PatientPostingObj.IsShowPatienPostListScreen = false;
                    $scope.PatientPostingObj.IsShowPatientAddingScreen = false;
                    $scope.PatientPostingObj.IsPatientPostSummaryScreen = true;
                }
            }

            if (resp[2].data.status == "Success") {
                if (resp[2].data.WriteOffReasons.length > 0) {
                    $scope.WriteOffReasons = resp[2].data.WriteOffReasons || [];
                }

            }
           
        });
    }
    $scope.init();

    $scope.AddUpdatePatientPostingDetails = function () {

        if ($scope.PatientPostingObj.PatientId == null) {
            alertify.error("Please Select Patient Name");
            return false;
        }
        if ($scope.PatientPostingObj.PatientAddress == "") {
            alertify.error("Please Enter Patient Address");
            return false;
        }
        if ($scope.PatientPostingObj.PaymentMethod == "") {
            alertify.error("Please Select Payment Method");
            return false;
        }
        if ($scope.PatientPostingObj.ReferenceNumber == "") {
            alertify.error("Please Enter Payment Referral Number");
            return false;
        }
        if ($scope.PatientPostingObj.PaymentDate == null) {
            alertify.error("Please Select Payment Date");
            return false;
        }
        if ($scope.PatientPostingObj.TotalPaymentAmount == "") {
            alertify.error("Please Enter Amount");
            return false;
        }
        if ($scope.PatientPostingObj.PostingDate == null) {
            alertify.error("Please Select Posting Date");
            return false;
        }

        let Obj = {
            "UserId": $scope.UserId,
            "PatientId": $scope.PatientPostingObj.PatientId || null,
            "PatientAddress": $scope.PatientPostingObj.PatientAddress || "",
            "DepositTypeId": $scope.PatientPostingObj.DepositTypeId || 0,
            "DepositTypeName": $scope.PatientPostingObj.DepositTypeName || "",
            "OrganizationId": $scope.HospitalId,
            "EOBId": $scope.PatientPostingObj.EOBId || 0,
            "PostingDate": $scope.PatientPostingObj.PostingDate || null,
            "EOBName": $scope.PatientPostingObj.EOBName || "",
            "EOBTypeId": $scope.PatientPostingObj.EOBTypeId || 0,
            "EOBType": $scope.PatientPostingObj.EOBType || "",
            "PaymentMethodId": $scope.PatientPostingObj.PaymentMethodId || 0,
            "PaymentMethod": $scope.PatientPostingObj.PaymentMethod || "",
            "ProcessingTypeId": $scope.PatientPostingObj.ProcessingTypeId || 0,
            "ProcessingType": $scope.PatientPostingObj.ProcessingType || "",
            "EOBCategory": $scope.PatientPostingObj.EOBCategory || "",
            "PaymentReceivedAt": $scope.PatientPostingObj.PaymentReceivedAt,
            "PaymentFormatCode": $scope.PatientPostingObj.PaymentFormatCode,
            "PaymentDate": $scope.PatientPostingObj.PaymentDate || null,
            "ReferenceNumber": $scope.PatientPostingObj.ReferenceNumber,
            "PayorName": $scope.PatientPostingObj.PayorName,
            "PayorAddress": $scope.PatientPostingObj.PayorAddress,
            "PayorId": $scope.PatientPostingObj.PayorId,
            "OrganizationPayorId": $scope.PatientPostingObj.OrganizationPayorId,
            "OrganizationBillingProviderId": $scope.PatientPostingObj.OrganizationBillingProviderId,
            "BillingProviderName": $scope.PatientPostingObj.BillingProviderName,
            "BillingProviderNPI": $scope.PatientPostingObj.BillingProviderNPI,
            "TotalPaymentAmount": $scope.PatientPostingObj.TotalPaymentAmount,
            "TotalAllowedAmount": $scope.PatientPostingObj.TotalAllowedAmount || 0,
            "TotalDeductAmount": $scope.PatientPostingObj.TotalDeductAmount,
            "TotalCoInsuranceAmount": $scope.PatientPostingObj.TotalCoInsuranceAmount,
            "TotalAdjustmentAmount": $scope.PatientPostingObj.TotalAdjustmentAmount,
            "TotalWriteOffAmount": $scope.PatientPostingObj.TotalWriteOffAmount,
            "TotalPatientResponsibilityAmount": $scope.PatientPostingObj.TotalPatientResponsibilityAmount,
            "TotalDeniedAmount": $scope.PatientPostingObj.TotalDeniedAmount,
            "TotalPatientResponsibilityWriteOffAmount": $scope.PatientPostingObj.TotalPatientResponsibilityWriteOffAmount,
            "TotalAppliedAmount": $scope.PatientPostingObj.TotalAppliedAmount,
            "TotalUnAppliedAmount": $scope.PatientPostingObj.TotalUnAppliedAmount,
            "TotalZeroLineItems": $scope.PatientPostingObj.TotalZeroLineItems,
            "TotalDeniedLineItems": $scope.PatientPostingObj.TotalDeniedLineItems,
            "PayerIdentifier": $scope.PatientPostingObj.PayerIdentifier,
            "FederalTaxPayersIdentificationNumber": $scope.PatientPostingObj.FederalTaxPayersIdentificationNumber,
            "ClaimPaymentInfo": $scope.PatientPostingObj.ClaimPaymentInfo || "",
            "ReceiptNumber": $scope.PatientPostingObj.ReceiptNumber,
            "ReceiptId": $scope.PatientPostingObj.ReceiptId || 0,
            "EOBFileId": $scope.PatientPostingObj.EOBFileId || 0,
            "EOBFileName": $scope.PatientPostingObj.EOBFileName,
            "EOBFileS3URL": $scope.PatientPostingObj.EOBFileS3URL,
            "EDIFileId": $scope.PatientPostingObj.EDIFileId || 0,
            "EDIFileName": $scope.PatientPostingObj.EDIFileName,
            "EDIFileS3URL": $scope.PatientPostingObj.EDIFileS3URL,
            "DepositedBy": $scope.PatientPostingObj.DepositedBy,
            "DepositDate": $scope.PatientPostingObj.DepositDate || null,
            "Notes": $scope.PatientPostingObj.Notes,
            "DepositStatus": $scope.PatientPostingObj.DepositStatus,
            "DepositStatusId": $scope.PatientPostingObj.DepositStatusId || 1,
            "DocumentDetails": $scope.PatientPostingObj.DocumentDetails || [],
            "DeleteInd": $scope.PatientPostingObj.DeleteInd || "N"
        }

        eHnoteInsuranceService.AddUpdateEOBDetails(Obj, onsuccess, onerror);
        function onsuccess(resp) {
            if (resp.Status === "Success") {

                $scope.PatientPostingObj.EOBId = resp.EOBId || 0;
                if ($scope.PatientPostingObj.DeleteInd == "N") {
                    $scope.PatientPostingObj.IsDataAdded = true;
                } else {
                    $scope.PatientPostingObj.IsDataAdded = false;
                }

                $scope.init();

            }
        }
        function onerror(err) {
            console.log(err);
        }
    }

    $scope.AddPaymentPopup = function () {

        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "addPatientPaymentPopup.html",
            "size": "md",
            "keyboard": false,
            "windowClass": "modal__ninety--",
            "resolve": {
                "ParenthospitalId": function () { return $scope.ParenthospitalId; },
                "UserId": function () { return $scope.UserId; },
                "HospitalId": function () { return $scope.HospitalId; },               
                "mainBillerDataObj": function () { return $scope.mainBillerDataObj; },
            },
            "controller": function ($scope, $uibModal, $uibModalInstance, eHnoteInsuranceService, InventoryService, ParenthospitalId, UserId, HospitalId, eHnoteUserDataService, mainBillerDataObj) {

                $scope.ParenthospitalId = ParenthospitalId || null;
                $scope.UserId = UserId || null;
                $scope.HospitalId = HospitalId || null;
                $scope.addDeposit = false;
                $scope.mainBillerDataObj = mainBillerDataObj;
                $scope.GetPaymentPopupObj = function () {
                    var obj = {
                        "TypeOfDeposit": 1,
                        "PatientMobile": "",
                        "DOB": "",
                        "Gender": "",
                        "PatientName": "",
                        "PatientDisplayId": "",
                        "PostingFromDate": "",
                        "PostingToDate": "",
                        "PatientId": 0,
                        "PageNumber": 1,
                        "PageSize": 10,
                        "SearchTypeId": 2,
                        "SearchText": "",
                        "S3URL": ""
                    }
                    return obj;
                }
                $scope.PaymentPopupObj = $scope.GetPaymentPopupObj();
                $scope.Patientobj = {
                    "PatientId": null,
                    "FirstName": "",
                    "LastName": "",
                    "MiddleName": "",
                    "DOB": "",
                    "Sex": "",
                    "MobileNo": "",
                    "EmailId": "",
                    "Address1": "",
                    "Address2": "",
                    "CityName": "",
                    "StateName": "",
                    "StateCode": "",
                    "ZipCode": "",
                    "Gender": "",
                    "S3URL": "",
                    "PatientDisplayId": null
                };
                $scope.changePatientPostingDate = function (obj) {
                    $scope.PaymentPopupObj.PostingToDate = obj.PostingFromDate;
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
                $scope.changePatientSearchType = function (id) {
                  
                    $scope.PatientSearchdata.SearchTypeId = id;
                    $scope.PaymentPopupObj.PatientId = 0; 
                    $scope.PaymentPopupObj.SearchText = "";
                    $scope.AllPatientList = [];
                    $scope.ShowPatientListDrop = false;
                }
             

                $scope.clearPatientSearchData = function () {
                    $scope.ShowPatientListDrop = false;
                    $scope.PaymentPopupObj.SearchText = "";
                    $scope.PaymentPopupObj.PatientId = 0;
                };
                $scope.changeSearchType = function (val) {
                    if (val === 2) {
                        $scope.PaymentPopupObj.PatientId = null;
                        $scope.PaymentPopupObj.SearchText = "";
                        $scope.AllPatientsDetailsList = [];
                    } else {
                        $scope.PaymentPopupObj.PostingFromDate = null;
                        $scope.PaymentPopupObj.PostingToDate = null;
                    }
                }

                let doctorInfo = eHnoteMasterDataService.getUserInfo();
                if (doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
                    //$scope.HospitalId= doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
                    
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
                $scope.HospitalIDLst = list || [];

                $scope.LoadPatientNameSearch = function (val) {

                    $scope.AllPatientsDetailsList = [];
                    if (val == undefined || val == null || val == "") {
                        $scope.PaymentPopupObj.PatientId = 0;
                        return false;
                    }

                    var object = {
                        "UserId": $scope.UserId,
                        "HospitalID": $scope.HospitalId,
                        "HospitalIDLst": $scope.HospitalIDLst.toString(),
                        "SearchText": $scope.PaymentPopupObj.SearchText || "",
                        "SearchTypeID": $scope.PaymentPopupObj.SearchTypeId || 0,
                    };
                    eHnotePatientDataService.SearchAllPatientData(object, OnGetopSearchPatientSuccess, OnGetopPatientSearchError)
                };
                function OnGetopSearchPatientSuccess(data) {

                    if (data.count > 0) {
                        $scope.count = data.count;
                        $scope.AllPatientList = [];
                        if (data.rows.length > 0) {
                            $scope.AllPatientList = data.rows || [];
                            console.log(data.rows)
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
                            $scope.patientinitval.FullName = item.FullName;
                            $scope.patientinitval.FirstName = item.FirstName;
                            $scope.patientinitval.LastName = item.LastName;
                            $scope.patientinitval.MiddleName = item.MiddleName;
                            $scope.patientinitval.EmailID = item.EmailID;
                            $scope.patientinitval.EmailID = item.EmailID;
                            $scope.patientinitval.PatientID = item.PatientId;
                            $scope.patientinitval.AltCountryCode = item.AltCountryCode || '';
                            $scope.patientinitval.Altareacode = item.Altareacode || '';
                            $scope.patientinitval.AltHomeNumber = item.AltHomeNumber || '';
                            $scope.patientinitval.OldMrno = item.OldMrno || "";
                            $scope.patientinitval.DOB = item.DOB;
                            $scope.patientinitval.Gender = item.Gender;
                            $scope.patientinitval.S3URL = item.ProfileImg;
                            
                            $scope.patientinitval.PhoneNumber = item.PhoneNumber;
                            $scope.patientinitval.patientdisplayid = item.DisplayID;
                            $scope.patientinitval.AgeInYears = item.AgeInYears;
                            $scope.patientinitval.AgeInMonths = item.AgeInMonths;
                            $scope.patientinitval.AgeInDays = item.AgeInDays;
                            $scope.patientinitval.patientdisplayid = item.DisplayID;
                            var obj = eHnoteUserDataService.UsMobileFormatChange(item.Altareacode + item.AltHomeNumber);
                            $scope.patientinitval.MobileNo = obj.UsFormatMobileNumber;
                            var previouspatval = angular.copy($scope.patientinitval);
                            $scope.patientDetailsList.push(previouspatval);
                        });
                        $scope.AllPatientsDetailsList = $scope.patientDetailsList;
                        
                    } else {
                        $scope.count = 0;
                        $scope.AllPatientList = [];
                    }
                    if ($scope.PaymentPopupObj.SearchText != "") {
                        $scope.ShowPatientListDrop = true;
                    }
                }
                function OnGetopPatientSearchError() {
                    $scope.count = 0;
                    $scope.AllPatientList = [];
                    $scope.PaymentPopupObj.SearchText = "";
                }
                $scope.SelectPatient = function (item) {
                    $scope.PaymentPopupObj.PatientId = item.PatientID || null;
                    $scope.PaymentPopupObj.PatientName = item.FullName;
                    $scope.PaymentPopupObj.S3URL = item.S3URL;
                    $scope.PaymentPopupObj.PatientAddress = item.Address1 || "";
                    $scope.PaymentPopupObj.PatientDisplayId = item.patientdisplayid || "";
                    $scope.PaymentPopupObj.DOB = item.DOB || "";
                    $scope.PaymentPopupObj.PatientMobile = item.MobileNo || "";
                    item.PatientHomeNumber = item.PatientHomeNumber || "";
                    //if (item.PatientHomeNumber != "") {
                    //    var obj = eHnoteUserDataService.UsMobileFormatChange(item.PatientHomeNumber);
                    //    $scope.PaymentPopupObj.PatientMobile = obj.UsFormatMobileNumber;
                    //}
                   
                    $scope.Patientobj.PatientId = item.PatientID || null;
                    $scope.Patientobj.PatientName = item.FullName;
                    $scope.Patientobj.FirstName = item.FirstName || '';
                    $scope.Patientobj.LastName = item.LastName || '';
                    $scope.Patientobj.MiddleName = item.MiddleName || '';
                    $scope.Patientobj.PatientDisplayId = item.patientdisplayid || '';
                    $scope.Patientobj.S3URL = item.S3URL || '';
                    $scope.Patientobj.Address1 = item.Address1 || "";
                    $scope.Patientobj.Address2 = item.Address2 || "";
                    $scope.Patientobj.CityName = item.CityName || "";
                    $scope.Patientobj.StateName = item.StateName || "";
                    $scope.Patientobj.ZipCode = item.ZipCode || "";
                    $scope.Patientobj.StateCode = item.StateCode || "";
                    $scope.Patientobj.Gender = item.Sex || "";
                    $scope.Patientobj.Sex = item.Sex || '';
                    let MobileNo = item.PhoneNumber || '';
                    $scope.Patientobj.EmailId = item.EmailId || '';
                    $scope.Patientobj.PatientDisplayId = item.patientdisplayid || '';
                    $scope.Patientobj.DOB = $filter('date')(item.DOB, "MM-dd-yyyy");
                    if (MobileNo != '') {
                        var obj = eHnoteUserDataService.UsMobileFormatChange(MobileNo);
                        $scope.Patientobj.MobileNo = obj.UsFormatMobileNumber;
                        $scope.Patientobj.PatientMobile = obj.UsFormatMobileNumber;
                    }
                    $scope.Patientobj.PatientMobile = item.MobileNo;
                    //$scope.getPatientDepositAmountById();
                    $scope.GetPatientClaimDetailsById();
                    $scope.SearchDeposit();
                    $scope.AllPatientsDetailsList = [];
                }

                $scope.closeuibpopup = function () {
                    $uibModalInstance.dismiss("cancel");
                };


                $scope.SearchDeposit = function () {
                   if ($scope.PaymentPopupObj.PatientId == 0 && $scope.PaymentPopupObj.PostingFromDate == '' && $scope.PaymentPopupObj.PostingToDate == '') {
                        alertify.error("Please select a patient before proceeding");
                        return false;

                    }
                    $scope.PatientDepositsListArray = [];
                    let obj = {
                        "PatientId": $scope.PaymentPopupObj.PatientId || null,
                        "OrganizationId": $scope.HospitalId,
                        "FromDate": $scope.PaymentPopupObj.PostingFromDate || null,
                        "ToDate": $scope.PaymentPopupObj.PostingToDate || null,
                        "PageNumber": $scope.PaymentPopupObj.PageNumber || 1,
                        "PageSize": 10,
                        "SearchType": "Claim"
                    }

                    eHnoteInsuranceService.GetAllPatientDeposits(obj).then(function (resp) {
                        console.log(resp);
                        if (resp.data.status == "Success") {

                            resp.data.TotalPatientClaimBalance = resp.data.TotalPatientClaimBalance || 0;
                            if (resp.data.TotalPatientClaimBalance == 0) {
                                alertify.error("There is no patient balance!");
                                $scope.addDeposit = true;
                                return false;
                            }

                            if (resp.data.rows.length > 0) {
                                $scope.PatientDepositsListArray = angular.copy(resp.data.rows);
                            }

                            //$scope.DepositsListDataArray = [];
                            //$scope.DepositsListDataArray = $scope.PatientDepositsListArray.filter(item => item.DepositStatusId != 2);

                            if (resp.data.rows.length == 0 && $scope.PaymentPopupObj.PatientId != 0) {
                                let obj = {
                                    "Patientobj": $scope.PaymentPopupObj,
                                    "Mainobj": "",
                                    "IsPatientDeposit": false
                                }
                                $uibModalInstance.close(obj);
                            }
                            //else if (resp.data.IsPatientDeposit == false && resp.data.rows.length == 0 && $scope.PaymentPopupObj.PatientId != 0) {
                            //    let obj = {
                            //        "Patientobj": $scope.PaymentPopupObj,
                            //        "Mainobj": "",
                            //        "IsPatientDeposit": false
                            //    }
                            //    $uibModalInstance.close(obj);
                            //}
                        }
                    });
                }

                $scope.customFilter = function (item) {
                    return item.DepositStatusId !== 2 && item.UnBilledAmount !== 0;
                };

                $scope.GetAllUsers = function () {
                    eHnoteMainAppointmentService.getBranchSubSpecializationsById(doctorinfo.doctordata.UserAddress[0].SubOrganizationId, $scope.HospitalId).then(function (resp) {
                        if (resp.data.status === "Success") {
                            if (resp.data.row.length > 0) {
                                $scope.allSubSpecializationsArray = resp.data.row;
                                $scope.listSubSplArray = angular.copy(resp.data.row);
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
                            function onGetUsersSuccess(resp) {
                                if (resp.rows.length > 0) {
                                    $scope.allUserList = resp.rows;
                                } else {
                                    alertify.error("No Users Found in Selected Departments");
                                }
                            }

                            function onGetUsersFailure(data) {
                            }

                        }
                    });
                };
                $scope.GetAllUsers();
                $scope.GetOrganizationFacilityDetails = function () {
                    var params = {
                        "OrganizationId": $scope.HospitalId,
                        "FacilityName": ""
                    };
                    $q.all([
                        eHnoteSettingsDataService.GetAllMasterClaimsData($scope.HospitalId),
                        eHnoteMainAdminServices.GetOrganizationFacilityDetails(params),


                    ]).then(function (resp) {
                        if (resp[0].data.DepositTypes.length > 0) {
                            $scope.DepositTypes = resp[0].data.DepositTypes || [];
                        }
                        if (resp[0].data.WriteOffReasons.length > 0) {
                            $scope.WriteOffReasons = resp[0].data.WriteOffReasons || [];
                        }

                        if (resp[0].data.ConnectedClearingHouse.length > 0) {
                            $scope.OrganizationClearingHouseDetails = resp[0].data.ConnectedClearingHouse || [];
                        }
                        if (resp[1].data.status == "Success") {
                            resp[1].data.rows = resp[1].data.rows || [];
                            if (resp[1].data.rows.length > 0) {
                                $scope.OrganizationFacilityList = angular.copy(resp[1].data.rows);
                            }
                        }
                    });
                };
                $scope.GetOrganizationFacilityDetails();
                $scope.getPatientDepositAmountById = function () {

                    var object = {
                        "DepositFrom": "",
                        "DepositTo": "",
                        "PatientId": $scope.PaymentPopupObj.PatientId,
                        "OrganizationId": $scope.HospitalId || 0,
                        "PaymentModeId": 0,
                        "PageSize": 10,
                        "PageNumber": 1,
                        "TransactionNumber": "",
                        "SortBy": "Asc",
                    };

                    eHnoteInsuranceService.GetAllPatientDeposits(object).then(function (resp) {
                        if (resp.data.status === "Success") {
                            var DepositsList = resp.data.rows || [];
                            $scope.PatientDepositDetails = resp.data;
                            $scope.PatientPaymenyObj.IsPatientDeposit = resp.data.IsPatientDeposit;
                            $scope.PatientPaymenyObj.TotalAdvanceDepositAvailable = resp.data.TotalAdvanceDepositAvailable;
                            $scope.PatientPaymenyObj.TotalAllocatedAmount = resp.data.TotalAllocatedAmount;
                            $scope.PatientPaymenyObj.TotalCopaymentAvailable = resp.data.TotalCopaymentAvailable;
                            $scope.PatientPaymenyObj.TotalDeductableAvailable = resp.data.TotalDeductableAvailable;
                            $scope.PatientPaymenyObj.TotalDepositAvailable = resp.data.TotalDepositAvailable;
                            $scope.PatientPaymenyObj.TotalGeneralAmountAvailable = resp.data.TotalGeneralAmountAvailable;
                            $scope.PatientPaymenyObj.TotalPatientClaimBalance = resp.data.TotalPatientClaimBalance;
                            $scope.PatientPaymenyObj.TotalUnAllocatedAmount = resp.data.TotalUnAllocatedAmount;
                            $scope.PatientPaymenyObj.TotalCopaymentDepositlistAmount = 0;
                            $scope.PatientPaymenyObj.TotalAdvanceDepositlistAmount = 0;
                            $scope.PatientPaymenyObj.TotalGeneralDepositlistAmount = 0;

                            if (DepositsList.length > 0) {
                                angular.forEach(DepositsList, function (item) {
                                    if (item.DepositTypeId === 1) {
                                        $scope.PatientPaymenyObj.TotalCopaymentDepositlistAmount += item.DepositAmount || 0;
                                    }
                                    else if (item.DepositTypeId === 2) {
                                        $scope.PatientPaymenyObj.TotalAdvanceDepositlistAmount += item.DepositAmount || 0;
                                    }
                                    else if (item.DepositTypeId === 3) {
                                        $scope.PatientPaymenyObj.TotalGeneralDepositlistAmount += item.DepositAmount || 0;
                                    }
                                });
                            }

                        } else {
                            alertify.error(resp.data.Message);
                        }
                    });
                }
                $scope.GetPatientClaimDetailsById = function (obj) {

                    var params = {
                        "PatientId": $scope.PaymentPopupObj.PatientId,
                        "PatientClaimId": 0
                    };
                    eHnotePatientDataService.GetPatientClaimDetailsById(params).then(function (resp) {
                        console.log(JSON.stringify(resp));


                        if (resp.data.status == "Success") {
                            $scope.ClaimDetailsList = [];
                            $scope.ClaimDetailsList = resp.data;
                            resp.data.rows = resp.data.rows || [];
                            if (resp.data.rows.length > 0) {
                                $scope.BillingProviderName = resp.data.rows[0].BillingProviderName || "";
                                $scope.FacilityName = resp.data.rows[0].FacilityName || "";
                            }

                        } else {
                            alertify.error(resp.data.Message);
                        }
                    }, function (error) {

                    });
                }
                $scope.navtoOpenAddDepositAmount = function () {
                    
                    //$rootScope.$emit("navtoOpenAddDepositAmount", $scope.PaymentPopupObj);
                    $scope.obj = {
                        "PatientId": $scope.PaymentPopupObj.PatientId,
                        "Type": '',
                        "UsersList": $scope.allUserList || [],
                        "Patientobj": $scope.Patientobj || "",
                        "ClaimDetailsList": $scope.ClaimDetailsList ||[],
                        "OrganizationFacilityList": $scope.OrganizationFacilityList || [],
                        "DepositTypes": $scope.DepositTypes  || [],
                        "WriteOffReasons": $scope.WriteOffReasons || [],
                        "BillingProviderName": $scope.BillingProviderName || "",
                        "FacilityName": $scope.FacilityName || "",
                        "AllBranchesList": $scope.mainBillerDataObj.AllBranchesList || [],
                    }

                    var typeid = 0;
                    if (typeid === 1) {
                        $scope.obj.PatientClaimNumber = $scope.ClaimDetails.PatientClaimNumber || "";
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
                        $scope.getPatientDepositAmountById();
                    }, function () { });
                }
                $scope.ClearSearch = function () {
                    $scope.PaymentPopupObj = $scope.GetPaymentPopupObj();
                }

                $scope.SelectPatientPayments = function (item) {
                    let obj = {
                        "Patientobj": $scope.Patientobj,
                        "Mainobj": item,
                        "IsPatientDeposit": true
                    }
                    $uibModalInstance.close(obj);
                }
            }
        });
        $scope.mInstanceAdd.result.then(function (resp) {
            $scope.PatientPostingObj = $scope.GetPatientPostingObj();
            $scope.PatientPostingObj.PatientId = resp.Patientobj.PatientId || null;
            $scope.PatientPostingObj.PatientName = resp.Patientobj.PatientName || "";
            $scope.PatientPostingObj.Gender = resp.Patientobj.Gender || "";
            $scope.PatientPostingObj.PatientDisplayId = resp.Patientobj.PatientDisplayId || "";
            $scope.PatientPostingObj.DOB = resp.Patientobj.DOB || "";
            $scope.PatientPostingObj.S3URL = resp.Patientobj.S3URL || "";
            resp.Patientobj.PatientMobile = resp.Patientobj.PatientMobile || "";
            $scope.PatientPostingObj.PostingDate = $filter('date')(new Date(), "MM-dd-yyyy") || "";
            if (resp.Patientobj.PatientMobile != "") {
                var obj = eHnoteUserDataService.UsMobileFormatChange(resp.Patientobj.PatientMobile);
                $scope.PatientPostingObj.PatientMobile = obj.UsFormatMobileNumber;
            }

            if (resp.IsPatientDeposit) {
                $scope.PatientPostingObj.IsPatientDeposit = resp.IsPatientDeposit || false;
                $scope.PatientPostingObj.BillingProviderName = resp.Mainobj.BillingProviderName || "";
                $scope.PatientPostingObj.OrganizationName = resp.Mainobj.OrganizationName || "";
                $scope.PatientPostingObj.ReceiptId = resp.Mainobj.ReceiptId || "";
                $scope.PatientPostingObj.ReceiptNo = resp.Mainobj.ReceiptNo || "";
                $scope.PatientPostingObj.DepositAmount = resp.Mainobj.DepositAmount || 0;
                $scope.PatientPostingObj.BilledAmount = resp.Mainobj.BilledAmount || 0;
                $scope.PatientPostingObj.UnBilledAmount = resp.Mainobj.UnBilledAmount || 0;
                $scope.PatientPostingObj.DepositDate = $filter('date')(resp.Mainobj.DepositDate, "MM-dd-yyyy") || "";
                $scope.PatientPostingObj.DepositTypeId = resp.Mainobj.DepositTypeId || "";
                $scope.PatientPostingObj.DepositTypeName = resp.Mainobj.DepositTypeName || "";
                $scope.PatientPostingObj.PaymentMethodId = resp.Mainobj.PaymentMethodId || "";
                $scope.PatientPostingObj.PaymentMethod = resp.Mainobj.PaymentMethodName || "";
                $scope.PatientPostingObj.OrganizationFacilityId = resp.Mainobj.OrganizationFacilityId || "";
                $scope.PatientPostingObj.FacilityName = resp.Mainobj.FacilityName || "";
                $scope.PatientPostingObj.DepositStatusId = resp.Mainobj.DepositStatusId || "";
                $scope.PatientPostingObj.BillingProviderId = resp.Mainobj.BillingProviderId || 0;
                $scope.PatientPostingObj.DepositStatus = resp.Mainobj.DepositStatus || "";
                $scope.PatientPostingObj.PatientDepositId = resp.Mainobj.PatientDepositId || "";
                $scope.PatientPostingObj.PatientDepositPaymodeList = resp.Mainobj.PatientDepositPaymodeList || [];
                $scope.PatientPostingObj.Notes = resp.Mainobj.Notes || "";
                $scope.PatientPostingObj.PaymentsArray = resp.Mainobj.PaymentsArray || [];

            }
            $scope.PatientPostingObj.IsShowPatienPostListScreen = false;
            $scope.PatientPostingObj.IsShowPatientAddingScreen = false;
            $scope.PatientPostingObj.IsPatientPostSummaryScreen = true;
            $scope.PatientPostingObj.IsEditMode = false;

            $scope.GetPatientResponsibility();

        }, function () {

        });
    }

    $scope.GetPatientlineItemsObj = function () {
        return {
            "EOBLineItemId": null,
            "ClaimLineItemId": null,
            "PatientClaimId": null,
            "ServiceId": null,
            "ServiceName": "",
            "ServiceCode": "",
            "DOSfrom": "",
            "UnitCharge": null,
            "Quantity": null,
            "DeleteInd": "N",
            "PatientPaid": null,
            "TotalChargeAmount": null,
            "AllowedAmount": null,
            "InsurancePaymentAmount": null,
            "CoPaymentAmount": null,
            "AdjustmentAmount": null,
            "DeductibleAmount": null,
            "CoInsuranceAmount": null,
            "PatientPaymentAmount": null,
            "WriteOffAmount": null,
            "InsuranceBalance": null,
            "PatientBalance": null,
            "TotalBalance": null,
            "PatientPaymentTypeId": null,
            "TransactionAmount": null,
            "CurrentPatientBalance": null,
            "CurrentTotalBalance": null,
            "CurrentPatientPaymentAmount": null,
            "AdjustmentReasonCodeId": null,
            "AdjustmentReasonCode": '',
            "TransactionTypeId": '',
            "TransactionType": '',
            "PatientClaimNumber": '',

        }
    };
    $scope.GetPatientResponsibility = function () {
        let obj = {
            "PatientId": $scope.PatientPostingObj.PatientId || null,
            "PatientClaimId": null,
            "EOBId": $scope.PatientPostingObj.EOBId || null,
        }
        eHnoteInsuranceService.GetAllPatientResponsibilityDetails(obj).then(function (resp) {
            console.log(resp);
            // $scope.ClaimPatientResponsibility = [];
            if (resp.data.status === "Success") {

                $scope.PatientClaimList = [];
                $scope.EOBPatientClaimList = [];
                $scope.TotalChargeBalanceAmount = 0;
                $scope.TotalPatientBalanceAmount = 0;
                $scope.TotalPatientPaymentBalance = 0;
                $scope.TotalAdjustmentBalanceAmount = 0;

                if (resp.data.EOBClaims.length > 0) {
                    $scope.EOBPatientClaimList = resp.data.EOBClaims || [];
                }

                if (resp.data.rows.length > 0) {
                    $scope.PatientClaimList = resp.data.rows || [];

                    angular.forEach($scope.PatientClaimList, function (Aitem) {
                        Aitem.ClaimPatientResponsibility = [];
                        if (Aitem.PatientClaimLineItems.length > 0) {
                            angular.forEach(Aitem.PatientClaimLineItems, function (item) {
                                let PatientlineItemsObj = angular.copy($scope.GetPatientlineItemsObj());
                                PatientlineItemsObj.PatientClaimNumber = item.PatientClaimNumber;
                                PatientlineItemsObj.EOBLineItemId = item.EOBLineItemId || null;
                                PatientlineItemsObj.ClaimLineItemId = item.ClaimLineItemId;
                                PatientlineItemsObj.PatientClaimId = item.PatientClaimId;
                                PatientlineItemsObj.ServiceId = item.ServiceId;
                                PatientlineItemsObj.ServiceName = item.ServiceName;
                                PatientlineItemsObj.ServiceCode = item.ServiceCode;
                                PatientlineItemsObj.OrganizationProcedureId = item.OrganizationProcedureId;
                                PatientlineItemsObj.DOSfrom = item.DOSfrom;
                                PatientlineItemsObj.PlaceOfServiceId = item.PlaceOfServiceId;
                                PatientlineItemsObj.PlaceOfServiceName = item.PlaceOfServiceName;
                                PatientlineItemsObj.UnitCharge = item.UnitCharge;
                                PatientlineItemsObj.Quantity = item.Quantity;
                                PatientlineItemsObj.RenderingProviderId = item.RenderingProviderId;
                                PatientlineItemsObj.TypeOfServiceId = item.TypeOfServiceId;
                                PatientlineItemsObj.RevenueBillingCode = item.RevenueBillingCode;
                                PatientlineItemsObj.RevenueBillingCodeId = item.RevenueBillingCodeId;
                                PatientlineItemsObj.PatientPaid = item.PatientPaid;
                                PatientlineItemsObj.TotalChargeAmount = item.TotalChargeAmount;
                                PatientlineItemsObj.AllowedAmount = item.AllowedAmount;
                                PatientlineItemsObj.InsurancePaymentAmount = item.InsurancePaymentAmount;
                                PatientlineItemsObj.CoPaymentAmount = item.CoPaymentAmount;
                                PatientlineItemsObj.AdjustmentAmount = item.AdjustmentAmount;
                                PatientlineItemsObj.DeductibleAmount = item.DeductibleAmount;
                                PatientlineItemsObj.CoInsuranceAmount = item.CoInsuranceAmount;
                                //PatientlineItemsObj.PatientPaymentAmount = item.PatientPaymentAmount;
                                PatientlineItemsObj.PatientPaymentAmount = 0;
                                //PatientlineItemsObj.WriteOffAmount = item.WriteOffAmount;
                                PatientlineItemsObj.WriteOffAmount = 0;
                                PatientlineItemsObj.InsuranceBalance = item.InsuranceBalance;
                                PatientlineItemsObj.PatientBalance = item.PatientBalance;
                                PatientlineItemsObj.CurrentPatientBalance = item.PatientBalance;
                                PatientlineItemsObj.TotalBalance = item.TotalBalance;

                                Aitem.ClaimPatientResponsibility.push(PatientlineItemsObj);

                                $scope.TotalChargeBalanceAmount += item.TotalChargeAmount;
                                $scope.TotalPatientBalanceAmount += item.PatientBalance;
                                //$scope.TotalPatientPaymentBalance += item.PatientPaymentAmount;
                                $scope.TotalPatientPaymentBalance = 0;
                                //$scope.TotalAdjustmentBalanceAmount += item.WriteOffAmount;
                                $scope.TotalAdjustmentBalanceAmount = 0;

                            });
                        }

                        //$scope.PatientPostingObj.PatientId = Aitem.PatientId || null;
                        //$scope.PatientPostingObj.PatientName = Aitem.PatientName || "";
                        //$scope.PatientPostingObj.PatientDisplayId = Aitem.PatientDisplayId || "";
                        //$scope.PatientPostingObj.DOB = Aitem.DOB || "";
                        //Aitem.MobileNo = Aitem.MobileNo || "";
                        //if (Aitem.PatientMobile != "") {
                        //    var obj = eHnoteUserDataService.UsMobileFormatChange(Aitem.MobileNo);
                        //    $scope.PatientPostingObj.PatientMobile = obj.UsFormatMobileNumber;
                        //}
                        $scope.PatientPostingObj.OrganizationName = Aitem.OrganizationName || "";

                    });
                }
            }
        });
    }


    $scope.calculateLineItemPaymentTotals = function () {
        var totalPatientBalance = 0, totalWriteOffAmt = 0, totalPatientPaymentBlsAmt = 0, totalcount = 0;
        angular.forEach($scope.PatientClaimList, function (Aitem) {
            let totalPaymentAmount = 0;
            let totalWriteOffAmount = 0;
            angular.forEach(Aitem.ClaimPatientResponsibility, function (sitem) {
                var CurrentPatientBalance = parseFloat(sitem.PatientBalance) || 0;
                var CurrentPatientPaymentAmount = parseFloat(sitem.PatientPaymentAmount) || 0;
                var CurrentWriteOffAmount = parseFloat(sitem.WriteOffAmount) || 0;

                sitem.CurrentPatientBalance = CurrentPatientBalance - (CurrentPatientPaymentAmount + CurrentWriteOffAmount);

                totalPatientBalance += CurrentPatientBalance;
                totalPaymentAmount += CurrentPatientPaymentAmount;
                totalWriteOffAmount += CurrentWriteOffAmount;
               // if ((totalPaymentAmount + totalWriteOffAmount) > $scope.PatientPostingObj.UnBilledAmount) {
                if ((totalPaymentAmount) > $scope.PatientPostingObj.UnBilledAmount) {
                    sitem.PatientPaymentAmount = null;
                    sitem.WriteOffAmount = null;
                    totalcount++;
                }
            });
            Aitem.TotalPatientBalance = totalPatientBalance - (totalPaymentAmount + totalWriteOffAmount);
            Aitem.TotalPatientPayment = totalPaymentAmount;
            Aitem.TotalWriteOffAmount = totalWriteOffAmount;
            totalPatientPaymentBlsAmt += totalPaymentAmount;
            totalWriteOffAmt += totalWriteOffAmount;
        });
        $scope.TotalPatientPaymentBalance = totalPatientPaymentBlsAmt;
        $scope.TotalAdjustmentBalanceAmount = totalWriteOffAmt;
        $scope.PatientPostingObj.BilledAmount = $scope.TotalPatientPaymentBalance;
        if (totalcount > 0) {
            alertify.error("The payment amount cannot exceed the billed amount. Please review the values and try again.");
            return false;
        }
    }

    $scope.changePaymentAmount = function (item) {

        //var PaymentAmount = parseFloat(item.TransactionAmount) || 0;
        var PaymentAmount = parseFloat(item.PatientPaymentAmount) || 0;
        var PatientBalance = parseFloat(item.PatientBalance) || 0;
        var WriteOffAmount = parseFloat(item.WriteOffAmount) || 0;
        var UnBilledAmount = parseFloat($scope.PatientPostingObj.UnBilledAmount) || 0;
        var AdjustmentAmount = PatientBalance - PaymentAmount;
        AdjustmentAmount = parseFloat(AdjustmentAmount) || 0;
        if (AdjustmentAmount != 0) {
            AdjustmentAmount = AdjustmentAmount.toFixed(2);
        }

        if (PaymentAmount > UnBilledAmount) {
            item.PatientPaymentAmount = 0;
            alertify.error("The Payment Amount is exceeding the Deposite amount");
            return false;
        }

        if (PaymentAmount > PatientBalance) {
            item.PatientPaymentAmount = 0;
            alertify.error("Payment amount cannot be higher than allowed amount");
            return false;
        }

        if (WriteOffAmount > AdjustmentAmount) {
            item.WriteOffAmount = 0;
            alertify.error("The adjustment amount cannot exceed. Please review the values and try again.");
            return false;
        }


        $scope.calculateLineItemPaymentTotals();
    }


    $scope.previousDepositAmount = $scope.PatientPostingObj.DepositAmount || 0;

    $scope.changeDepositAmount = function () {
        const newDepositAmount = parseFloat($scope.PatientPostingObj.DepositAmount) || 0;
        $scope.PatientPostingObj.UnBilledAmount = newDepositAmount;

        if ($scope.previousDepositAmount !== newDepositAmount) {
            angular.forEach($scope.PatientClaimList, function (item) {
                angular.forEach(item.ClaimPatientResponsibility, function (Aitem) {
                    Aitem.PatientPaymentAmount = 0;
                    Aitem.WriteOffAmount = 0;
                    Aitem.AdjustmentReasonCodeId = null;
                });
            });

            $scope.TotalPatientPaymentBalance = 0;
            $scope.TotalAdjustmentBalanceAmount = 0;
        }

        $scope.previousDepositAmount = newDepositAmount;
    };


    $scope.changeAdjustment = function (typeid, mainitem) {

        var filterArray = $filter("filter")($scope.masterPatientPaymentAdjustment, { "ReasonCodeId": typeid }, true) || [];
        if (filterArray.length > 0) {
            mainitem.AdjustmentReasonCode = filterArray[0].ReasonCode;
        }
    }


    $scope.SavePatientPayment = function () {

        $scope.PatientPostingObj.UnBilledAmount = $scope.PatientPostingObj.UnBilledAmount || 0;
        if ($scope.PatientPostingObj.UnBilledAmount == 0) {
            alertify.error("There is no deposit amount for this patient");
            return false;
        }

        let EOBClaims = [];
        if ($scope.PatientClaimList.length > 0) {

            angular.forEach($scope.PatientClaimList, function (Aitem) {
                let ClaimLineItems = [];
                angular.forEach(Aitem.ClaimPatientResponsibility, function (item) {
                    let ClaimTransactions = [];
                    item.PatientPaymentAmount = item.PatientPaymentAmount || 0;
                    item.WriteOffAmount = item.WriteOffAmount || 0;

                    if (item.WriteOffAmount != 0) {
                        let obj3 = {
                            "ClaimTransactionId": 0,
                            "PatientDepositId": $scope.PatientPostingObj.PatientDepositId,
                            "ClaimLineItemId": item.ClaimLineItemId,
                            "OrganizationId": $scope.HospitalId,
                            "TransactionDate": $filter("date")(new Date(), "yyyy-MM-dd"),
                            "TransactionAmount": -+item.WriteOffAmount,
                            "PatientAmount": -+item.WriteOffAmount,
                            "InsuranceAmount": 0,
                            "ReferenceNumber": $scope.PatientPostingObj.ReferenceNumber,
                            "TransactionTypeId": 57,
                            "TransactionType": "Selfpay Adjustment",
                            "TransactionSourceId": 3,
                            "TransactionSource": "Patient",
                            "SettlementStatusId": 3,
                            "SettlementStatus": "Fully Settled",
                            "TransactionNotes": ""
                        }
                        ClaimTransactions.push(obj3);
                    }

                    if (item.PatientPaymentAmount != 0) {
                        let obj3 = {
                            "ClaimTransactionId": 0,
                            "PatientDepositId": $scope.PatientPostingObj.PatientDepositId,
                            "ClaimLineItemId": item.ClaimLineItemId,
                            "OrganizationId": $scope.HospitalId,
                            "TransactionDate": $filter("date")(new Date(), "yyyy-MM-dd"),
                            "TransactionAmount": -+item.PatientPaymentAmount,
                            "PatientAmount": -+item.PatientPaymentAmount,
                            "InsuranceAmount": 0,
                            "ReferenceNumber": $scope.PatientPostingObj.ReferenceNumber,
                            "TransactionTypeId": 26,
                            "TransactionType": "Patient Payment Check",
                            "TransactionSourceId": 3,
                            "TransactionSource": "Patient",
                            "SettlementStatusId": 3,
                            "SettlementStatus": "Fully Settled",
                            "TransactionNotes": ""
                        }
                        ClaimTransactions.push(obj3);
                    }

                    if (ClaimTransactions.length > 0) {
                        let obj2 = {
                            "PatientClaimId": item.PatientClaimId,
                            "ClaimLineItemId": item.ClaimLineItemId,
                            "PatientDepositId": $scope.PatientPostingObj.PatientDepositId,
                            "EOBLineItemId": item.EOBLineItemId,
                            "ServiceId": item.ServiceId,
                            "AllowedAmount": item.AllowedAmount,
                            "InsurancePaymentAmount": item.InsurancePaymentAmount,
                            "CoPaymentAmount": item.CoPaymentAmount,
                            "DeductibleAmount": item.DeductibleAmount,
                            "CoInsuranceAmount": item.CoInsuranceAmount,
                            "PatientPaymentAmount": item.PatientPaymentAmount,
                            "WriteOffAmount": item.WriteOffAmount,
                            "PatientBalance": item.CurrentPatientBalance,
                            "TotalBalance": item.TotalBalance,
                            "PatientPaymentTypeId": item.PatientPaymentTypeId,
                            "PatientPaymentType": item.PatientPaymentType,
                            "AdjustmentAmount": item.AdjustmentAmount,
                            "AdjustmentReasonCodeId": item.AdjustmentReasonCodeId,
                            "AdjustmentReasonCode": item.AdjustmentReasonCode,
                            "ClaimTransactions": ClaimTransactions || [],
                        }

                        ClaimLineItems.push(obj2);
                    }

                });
                if (ClaimLineItems.length > 0) {
                    let obj2 = {
                        "PatientClaimId": Aitem.PatientClaimId,
                        "EOBClaimInfoId": 0,
                        "TotalChargeAmount": Aitem.TotalClaimAmount || 0,
                        "ClaimPaymentAmount": Aitem.TotalPatientPayment || 0,
                        "TotalAdjustmentAmount": Aitem.TotalAdjustmentAmount,
                        "TotalAllowedAmount": Aitem.TotalAllowedAmount,
                        "TotalBalance": Aitem.TotalBalance,
                        "TotalClaimAmount": Aitem.TotalClaimAmount,
                        "TotalCoInsuranceAmount": Aitem.TotalCoInsuranceAmount,
                        "TotalCopayAmount": Aitem.TotalCopayAmount,
                        "TotalDeductibleAmount": Aitem.TotalDeductibleAmount,
                        "TotalInsuranceBalance": Aitem.TotalInsuranceBalance,
                        "TotalInsurancePayment": Aitem.TotalInsurancePayment,
                        "TotalPatientBalance": Aitem.TotalPatientBalance,
                        "TotalPatientPayment": Aitem.TotalPatientPayment,
                        "TotalPaymentAmount": Aitem.TotalPaymentAmount,
                        "TotalWriteOffAmount": Aitem.TotalWriteOffAmount,
                        "EOBClaimLineItems": ClaimLineItems || []
                    }
                    EOBClaims.push(obj2);
                };
            });

        }
        if (EOBClaims.length == 0) {
            return false;
        }


        let DepositAmount = 0;
        let UnBilledAmount = 0;
        let UnAppliedAmount = 0;
        let EOBUnAppliedAmount = 0;
        let EOBAppliedAmount = 0;
        if ($scope.PatientPostingObj.IsPatientDeposit) {

            DepositAmount = $scope.PatientPostingObj.DepositAmount;
            UnBilledAmount = $scope.PatientPostingObj.UnBilledAmount;
            EOBAppliedAmount = ($scope.PatientPostingObj.BilledAmount);
            //UnAppliedAmount = (DepositAmount - $scope.PatientPostingObj.BilledAmount);
            UnAppliedAmount = (UnBilledAmount - $scope.PatientPostingObj.BilledAmount);

        } else {
            DepositAmount = $scope.PatientPostingObj.UnBilledAmount;
            EOBUnAppliedAmount = (DepositAmount - $scope.PatientPostingObj.BilledAmount);
            EOBAppliedAmount = ($scope.PatientPostingObj.BilledAmount);
        }
        if ($scope.PatientPostingObj.PatientDepositPaymodeList.length > 0) {
            $scope.PatientPostingObj.PatientDepositPaymodeList.forEach(function (item) {
                item.PatientDepositPaymodeListId = 0;
                //item.DepositAmount = $scope.TotalPatientPaymentBalance;
            });
        }
        let obj = {
            "UserId": $scope.UserId,
            "OrganizationId": $scope.HospitalId,
            "PatientDepositId": $scope.PatientPostingObj.PatientDepositId,
            "TotalPaymentAmount": DepositAmount,
            "TotalUnAppliedAmount": UnAppliedAmount,
            "TotalAppliedAmount": $scope.PatientPostingObj.BilledAmount,
            "TotalEOBUnAppliedAmount": EOBUnAppliedAmount||0,
            "TotalEOBAppliedAmount": EOBAppliedAmount || 0,            
            "PaymentModeId": $scope.PatientPostingObj.PaymentMethodId,
            "PaymentMode": $scope.PatientPostingObj.PaymentMethod,
            "DepositTypeId": $scope.PatientPostingObj.DepositTypeId,
            "DepositTypeName": $scope.PatientPostingObj.DepositTypeName,
            "DepositDate": $scope.PatientPostingObj.DepositDate,
            "PostingDate": $scope.PatientPostingObj.PostingDate,
            "ReceiptNo": $scope.PatientPostingObj.ReceiptNo,
            "Notes": $scope.PatientPostingObj.Notes,
            "PatientId": $scope.PatientPostingObj.PatientId,
            "EOBId": $scope.PatientPostingObj.EOBId,
            "EOBClaims": EOBClaims || [],
            "PostingType": "Patient Payment",
            "PostingTypeId": 3,
            "BillingProviderId": $scope.PatientPostingObj.BillingProviderId,        // new params
            "OrganizationFacilityId": $scope.PatientPostingObj.OrganizationFacilityId,
            "FacilityName": $scope.PatientPostingObj.FacilityName,
            "PatientDepositPaymodeList": $scope.PatientPostingObj.PatientDepositPaymodeList || []
        }
        console.log(JSON.stringify(obj))

        eHnoteInsuranceService.AddUpdatePatientPayment(obj).then(function (resp) {
            console.log(resp);
            if (resp.data.Status === "Success") {
                $scope.PatientPostingObj.IsShowPatienPostListScreen = true;
                $scope.PatientPostingObj.IsShowPatientAddingScreen = false;
                $scope.PatientPostingObj.IsPatientPostSummaryScreen = false;
                $scope.init();
            } else {
                alertify.error(resp.data.Message);
            }
        });
    }

    $scope.applyDeposit = function () {
        var totalApplied = 0;
        $scope.TotalPatientPaymentBalance = 0;
        $scope.PatientPostingObj.UnBilledAmount = $scope.PatientPostingObj.UnBilledAmount || 0;
        if ($scope.PatientPostingObj.UnBilledAmount == 0) {
            return false;
        }

        var patientDepositAmount = parseFloat($scope.PatientPostingObj.UnBilledAmount);
        angular.forEach($scope.PatientClaimList, function (claim) {
            for (let i = 0; i < claim.ClaimPatientResponsibility.length; i++) {
                let balance = claim.ClaimPatientResponsibility[i].PatientBalance;
                //let availableBls = claim.ClaimPatientResponsibility[i].CurrentPatientBalance;
                let availableBls = claim.ClaimPatientResponsibility[i].PatientBalance;
                claim.ClaimPatientResponsibility[i].WriteOffAmount = 0;
               
                // If deposit is greater than or equal to the balance, pay it off completely
                if (patientDepositAmount >= balance) {
                    claim.ClaimPatientResponsibility[i].PatientPaymentTypeId = $scope.PatientPostingObj.DepositTypeId;
                    claim.ClaimPatientResponsibility[i].PatientPaymentAmount = balance;
                    claim.ClaimPatientResponsibility[i].CurrentPatientBalance = (availableBls - balance);
                    patientDepositAmount -= balance;
                    $scope.TotalPatientPaymentBalance += balance;
                } else {
                    // If deposit is less than the balance, pay as much as possible
                    claim.ClaimPatientResponsibility[i].PatientPaymentTypeId = $scope.PatientPostingObj.DepositTypeId;
                    claim.ClaimPatientResponsibility[i].PatientPaymentAmount = patientDepositAmount;
                    claim.ClaimPatientResponsibility[i].CurrentPatientBalance = (availableBls - patientDepositAmount);
                    $scope.TotalPatientPaymentBalance += patientDepositAmount;
                    patientDepositAmount = 0; // Deposit is exhausted
                    break; // Exit loop since no deposit amount is left
                }
            }
        });
        // $scope.PatientPostingObj.BilledAmount = $scope.TotalPatientPaymentBalance;
        $scope.calculateLineItemPaymentTotals();

    };

    $scope.SearchPaymentDetails = function (pageno) {
        $scope.PatientPaymentFilterObj.PageNumber = pageno || 1;

        var Frezobj = {
            "PostingFromDate": $scope.PatientPaymentFilterObj.PostingFromDate || null,
            "PostingToDate": $scope.PatientPaymentFilterObj.PostingToDate || null,
            "DepositFromDate": $scope.PatientPaymentFilterObj.DepositFromDate || null,
            "DepositToDate": $scope.PatientPaymentFilterObj.DepositToDate || null,
            "DepositStatusId": $scope.PatientPaymentFilterObj.DepositStatusId || 0,
            "PaymentMethodId": $scope.PatientPaymentFilterObj.PaymentMethodId || 0,
            "DepositTypeId": $scope.PatientPaymentFilterObj.DepositTypeId || 0,
            "SettlementStatusId": $scope.PatientPaymentFilterObj.SettlementStatusId || 0,
        };
        eHnoteMasterDataService.addPosting_PatientfreezingList(Frezobj);

        var obj = {
            "OrganizationId": $scope.HospitalId,
            "PageSize": $scope.PatientPaymentFilterObj.PageSize || 100,
            "PageNumber": $scope.PatientPaymentFilterObj.PageNumber || 1,
            "PostingFrom": $scope.PatientPaymentFilterObj.PostingFromDate,
            "PostingTo": $scope.PatientPaymentFilterObj.PostingToDate,
            "PaymentFrom": $scope.PatientPaymentFilterObj.DepositFromDate,
            "PaymentTo": $scope.PatientPaymentFilterObj.DepositToDate,
            "PatientId": $scope.PatientPaymentFilterObj.PatientId || null,
            "DepositStatusId": $scope.PatientPaymentFilterObj.DepositStatusId,
            /*"PaymentModeId": $scope.PatientPaymentFilterObj.PaymentModeId,*/
            "PaymentModeId": $scope.PatientPaymentFilterObj.PaymentMethodId,
            "DepositTypeId": $scope.PatientPaymentFilterObj.DepositTypeId,
            "SettlementStatusId": $scope.PatientPaymentFilterObj.SettlementStatusId,
            "ReferenceNumber": $scope.PatientPaymentFilterObj.ReferenceNumber,
            "SearchText": $scope.PatientPaymentFilterObj.SearchText || "",
            "PatientMRNo": $scope.PatientPaymentFilterObj.PatientMRNo || "",
            "BatchNumber": $scope.PatientPaymentFilterObj.BatchNumber,
            "SortById": $scope.PatientPaymentFilterObj.SortById || 0,
            "SortByName": $scope.PatientPaymentFilterObj.SortByName || "",
        }
        eHnoteInsuranceService.GetPatientPaymentsList(obj).then(function (resp) {
            if (resp.data.status === "Success") {
                if (resp.data.rows.length > 0) {
                    $scope.PatientPaymentListCount = 0;
                    $scope.PatientPaymentList = angular.copy(resp.data.rows);
                    $scope.PatientPaymentListCount = angular.copy(resp.data.count);
                    angular.forEach($scope.PatientPaymentList, function (item) {
                        item.UnBilledAmount = item.TotalUnAppliedAmount || 0;
                        item.BilledAmount = item.TotalAppliedAmount || 0;
                        item.DepositAmount = item.TotalPaymentAmount || 0;
                    });
                } else {
                    $scope.PatientPaymentList = [];
                    $scope.PatientPaymentListCount = 0;
                }
            }
        });
    }

    $scope.OnSelectSortOrder = function (Id) {
        var templist = $filter("filter")($scope.GetSortByFilterList, { "SortById": Id }, true) || [];
        if (templist.length > 0) {
            $scope.PatientPaymentFilterObj.SortById = templist[0].SortById;
            $scope.PatientPaymentFilterObj.SortByName = templist[0].SortByName;
            $scope.SearchPaymentDetails();
        }
    }

    $scope.onChangeSearchAppt = function (text, type) {
        text = text || "";
        if (text === "") {
            $scope.PatientPaymentList = angular.copy($scope.filterPatientPaymentList);
        }
    }

    $scope.SearchOrgClaimListdata = function (text, type) {
        $timeout(function () {
            if (type == 1) {
                if (text === "" || text === undefined) {
                    $scope.PatientPaymentList = angular.copy($scope.filterPatientPaymentList);
                } else {
                    $scope.PatientPaymentList = $filter("filter")($scope.filterPatientPaymentList, { "PatientName": text }) || [];
                }
            }
            if (type == 2) {
                if (text === "" || text === undefined) {
                    $scope.PatientPaymentList = angular.copy($scope.filterPatientPaymentList);
                } else {
                    $scope.PatientPaymentList = $filter("filter")($scope.filterPatientPaymentList, { "PatientDisplayId": text }) || [];
                }
            }
            if (type == 3) {
                if (text === "" || text === undefined) {
                    $scope.PatientPaymentList = angular.copy($scope.filterPatientPaymentList);
                } else {
                    $scope.PatientPaymentList = $filter("filter")($scope.filterPatientPaymentList, { "ReceiptNumber": text }) || [];
                }
            }
        }, 50);
    };

    $scope.changeradiobtn = function () {
        $scope.PatientPaymentFilterObj.SearchText = "";
        $scope.PatientPaymentFilterObj.PatientMRNo = "";
        $scope.PatientPaymentFilterObj.ReferenceNumber = "";
    }

    $scope.ClearPatientPayment = function () {
        $scope.TotalPatientPaymentBalance = 0;
        $scope.TotalAdjustmentBalanceAmount = 0;
        angular.forEach($scope.PatientClaimList, function (item) {
            angular.forEach(item.ClaimPatientResponsibility, function (Aitem) {
                Aitem.PatientPaymentTypeId = 0;
                Aitem.PatientPaymentAmount = 0;
                Aitem.WriteOffAmount = 0;
                Aitem.AdjustmentReasonCodeId = null;
            });
        })

    }
    $scope.patientFilterPopover = {
        templateUrl: 'patientFilterPopover.html',
    };
    $scope.closeFilterPopover = function () {
        angular.element(document.querySelector('.popover')).remove();
    };

    $scope.navtoOpenAddDepositAmount = function (item, type, Incomingfrom, ID) {

        var obj = eHnoteUserDataService.UsMobileFormatChange(item.MobileNo);
        item.MobileNo = obj.UsFormatMobileNumber;

        $scope.Patientobj = {
            "S3URL": item.S3URL,
            "PatientFullName": item.PatientFullName,
            "PatientDisplayId": item.PatientDisplayId,
            "Gender": item.Gender,
            "AgeInYears": item.AgeInYears,
            "AgeInMonths": item.AgeInMonths,
            "DOB": item.PatientDOB,
            "MobileNo": item.MobileNo,
        }

        $scope.obj = {
            "EOBId": item.EOBId,
            "PatientId": item.PatientId,
            "ScreenType": type || '',
            "Incomingfrom": Incomingfrom || '',
            "Type": '',
            "UsersList": $scope.mainBillerDataObj.AllUsersList || [],
            "Patientobj": $scope.Patientobj || {},
            "ClaimDetailsList": [],
            "OrganizationFacilityList": [],
            "DepositTypes": $scope.masterDepositTypes,
            "WriteOffReasons": [],
            "BillingProviderName": $scope.BillingProviderName || "",
            "FacilityName": $scope.FacilityName || "",
            "TotalPatientBalance": 0,
            "AllBranchesList": $scope.mainBillerDataObj.AllBranchesList || [],
            "HospitalId": item.OrganizationId,
            "ID": ID || 2,
            "PatientClaimId": item.PatientClaimId || null,
            "CardTypesData": $scope.CardTypesData || [],
            "ClaimDataObj": {},
            "DiagnosisArrayList": $scope.addedDiagnosisArray || [],
            "PatientClaimTransmissionObj": $scope.PatientClaimTransmissionObj || {},
            "ClaimSaveSatus": Incomingfrom || '',
            "mainBillerDataObj": $scope.mainBillerDataObj || {},
            "WriteOffReasons": $scope.WriteOffReasons,
        }

        var modalInstance = $uibModal.open({
            "templateUrl": "templates/UsClaims/AddPatientDepositPopup.html",
            "controller": "UsAddPatientDepositsCtrl",
            "resolve": {
                "Selectobj": function () { return $scope.obj; },
            },
            "backdrop": "static",
            "keyboard": false,
            "windowClass": "modal__popup--1  "
        });
        modalInstance.result.then(function () {
            $scope.SearchPaymentDetails();

        }, function () { });
    }

    $scope.navtoOpenAddDepositAmountinEdit = function (item, type, Incomingfrom, ID) {

        eHnoteInsuranceService.GetParticularClaimDetailsById(item.PatientClaimId).then(function (resp) {
            if (resp.data.status == "Success") {
                $scope.ClaimDetails = resp.data || null;
                if ($scope.ClaimDetails != null) {
                    $scope.BillingProviderName = $scope.ClaimDetails.BillingProviderName || "";
                    $scope.FacilityName = $scope.ClaimDetails.FacilityName || "";
                }
                $scope.navtoOpenAddDepositAmount(item, type, Incomingfrom, ID);
            }
        });
    }
}]);
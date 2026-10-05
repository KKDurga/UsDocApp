eHnoteWebApp.controller("UsPatientFinancialMainCtrl", ["$scope", "$rootScope", "eHnoteMasterDataService", "eHnotePatientAddressDataServices", "$filter", "alertify", "eHnoteLoginStatusService", "$uibModal", "eHnoteAuditServices", "eHnotePatientDataService", "eHnoteCacheStorageService", "datapersistanceFactory", "$location", "eHnoteDiagnosisDataServices", "$timeout", "eHnoteInsuranceService", "datacookieFactory", "localStorageFactory", "eHnoteReferalDataService", "eHnoteUserAppointmentDataService", "eHnoteMainAppointmentService", "eHnoteDbStaticDataService", "$q", "eHnoteSettingsDataService", "eHnoteOrgReferralDataServices", "loginCookieFactory", "DeCodeFilter", "Lightbox", "eHnoteProcedureDataService", "USPrintService", "eHnotePatientVisitReasonServices", "eHnoteSurgeryService", "$window", "eHnoteMainAdminServices", "eHnoteUserDataService", "eHnotePrintService", "$translate", "eHnotePrintService", "$http", "eHnotePaymentGatewayService", "$sce", function ($scope, $rootScope, eHnoteMasterDataService, eHnotePatientAddressDataServices, $filter, alertify, eHnoteLoginStatusService, $uibModal, eHnoteAuditServices, eHnotePatientDataService, eHnoteCacheStorageService, datapersistanceFactory, $location, eHnoteDiagnosisDataServices, $timeout, eHnoteInsuranceService, datacookieFactory, localStorageFactory, eHnoteReferalDataService, eHnoteUserAppointmentDataService, eHnoteMainAppointmentService, eHnoteDbStaticDataService, $q, eHnoteSettingsDataService, eHnoteOrgReferralDataServices, loginCookieFactory, DeCodeFilter, Lightbox, eHnoteProcedureDataService, USPrintService, eHnotePatientVisitReasonServices, eHnoteSurgeryService, $window, eHnoteMainAdminServices, eHnoteUserDataService, eHnotePrintService, $translate, eHnotePrintService, $http, eHnotePaymentGatewayService, $sce) {

    $scope.userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
    $scope.appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.RoleId = $scope.userLoginDetails.RoleID;
    $scope.UserId = eHnoteMasterDataService.getLoginId();
    $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
    $scope.DoctorId = doctorinfo.doctordata.User[0].DoctorID;
    $scope.ClinicId = doctorinfo.doctordata.UserAddress[0].ClinicId;

    $scope.ParentHospitalId = 0;
    $scope.HospitalId = 0;

    $scope.IshideIndicator = $scope.IshideIndicator || false;
    
    if (doctorinfo !== undefined) {
        $scope.orgUsersData = doctorinfo.doctordata.UserAddress;
        if ($scope.orgUsersData !== undefined) {
            if ($scope.orgUsersData[0] !== undefined) {
                $scope.ParentHospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
                $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
                $scope.SecondUserFullName = doctorinfo.doctordata.User[0].SecondUserFullName;
            }
        }
    }


    $scope.HospitalAddressArray = [];
    if (doctorinfo.doctordata.UserAddress[0] !== undefined) {
        $scope.HospitalAddressArray = doctorinfo.doctordata.UserAddress[0];
    }
    
    console.log($scope.mainPatientProfileObj);
    console.log($scope.Patientobj);
    $scope.AllUsersList = [];
    $scope.patientInsuranceTpasArray = [];
    $scope.filteredBranchDoctorsList = [];
    $scope.MasterTransactionCategories = [];
    $scope.AllUsersList = $scope.mainPatientProfileObj.AllUsersList || [];
    $scope.AllBranchesList = $scope.mainPatientProfileObj.AllBranchesList || [];

    if ($scope.AllUsersList.length !== 0) {
        $scope.BranchDoctorsList = [];
        $scope.BranchDoctorsList = $filter("filter")($scope.AllUsersList, function (item) {
            return item.RoleId === 1 || item.RoleId === 3 || item.RoleId === 4 || item.RoleId === 43 || item.RoleId === 55;
        });
        $scope.filteredBranchDoctorsList = angular.copy($scope.BranchDoctorsList);
    }

    angular.forEach($scope.AllBranchesList, function (branch) {
        if (branch.IsChecked === undefined) {
            branch.IsChecked = true;
        }
    });

    $scope.patientInsuranceTpasArray = $scope.mainPatientProfileObj.patientInsuranceTpasArray || [];
    $scope.mainPatientProfileObj.Type = $scope.mainPatientProfileObj.Type || '';
    $scope.IsAllocateDeposit = false;
    if ($scope.mainPatientProfileObj.Type == 'Allocate Deposit') {
        $scope.IsAllocateDeposit = true;
    }


    $scope.claimScreenParentObj = datapersistanceFactory.getItem("IsComingFromClaim");

    if ($scope.claimScreenParentObj.SuperBillId != 0) {
        $scope.cacheStorageItem.PatientID = $scope.claimScreenParentObj.PatientId || 0;
        $scope.cacheStorageItem.appointmentid = $scope.claimScreenParentObj.AppointmentId || 0;
        $scope.claimScreenParentObj.PatientClaimId = $scope.claimScreenParentObj.PatientClaimId || 0;
        $scope.claimScreenParentObj.SuperBillId = $scope.claimScreenParentObj.SuperBillId || 0;
        $scope.claimScreenParentObj.VisitId = $scope.claimScreenParentObj.VisitId || 0;
        $scope.claimScreenParentObj.NotesId = $scope.claimScreenParentObj.NotesId || 1;
        $scope.cacheStorageItem.SuperBillRemarks = $scope.claimScreenParentObj.SuperBillRemarks || "";
   $scope.cacheStorageItem.AppointmentTypeId = $scope.claimScreenParentObj.AppointmentTypeId;
            $scope.claimScreenParentObj.AppointmentTypeId =  $scope.claimScreenParentObj.AppointmentTypeId;

    }


    var mObj = datapersistanceFactory.getItem("masterDataArrays");
    $scope.masterPaymentModes = [];
    if (mObj.PaymentModes && mObj.PaymentModes.length > 0) {
        $scope.masterPaymentModes = mObj.PaymentModes;
        $scope.filterPaymentModes = function (item) {
            return ![13, 14].includes(item.PaymentModeId);
        };
        //angular.forEach(mObj.PaymentModes, function (pobj) {
        //    if (pobj.PaymentModeId === 5 || pobj.PaymentModeId === 6 || pobj.PaymentModeId === 7) {
        //        $scope.masterPaymentModes.push(pobj);
        //    }
        //});
    }

    $scope.LocationTypeObj = {
        "SelectLocationString": "All Locations",
        "Name": "",
        "AllLocationCheck": true
    };

    $scope.mainFinancialObj = {
        "MainTab":1
    };
    function getSearchPosobj() {
        var obj = {
            "OrganizationId": $scope.HospitalId,
            "PageSize": 50,
            "PageNumber": 1,
            "InvoiceNumber": "",
            "PatientId": $scope.mainPatientProfileObj.PatientId || 0,
            "SoldByUserId": "",
            "FromDate":"",// $filter('date')(new Date(), "MM-dd-yyyy")
            "ToDate": "",//$filter('date')(new Date(), "MM-dd-yyyy")
            "PaymentStatusId": 0,
            "SearchText": "",
            "SearchTypeId": 2,
        };
        return obj;

    }

    $scope.GetClaimResponsibilities = function () {
        return [{
            "ResponsibilityId": 1,
            "ResponsibilityName": "Patient"
        },
        {
            "ResponsibilityId": 2,
            "ResponsibilityName": "Insurance"
        },
        {
            "ResponsibilityId": 3,
            "ResponsibilityName": " Worker comp"
        },
        {
            "ResponsibilityId": 4,
            "ResponsibilityName": "Others"
        }];
    };
    $scope.POSVoidInvoiceslist = [];
    $scope.ClaimResponsibilities = angular.copy($scope.GetClaimResponsibilities());
   
    $scope.refreshPOSInvoices = function () {
        $scope.SearchPosobj = getSearchPosobj();
        $scope.GetOrganizationPOSInvoices();
    }
    $scope.GetOrganizationPOSInvoices = function (pageno) {
        $scope.SearchPosobj = getSearchPosobj();
        $scope.SearchPosobj.PageNumber = pageno || 1;
        $scope.POSInvoiceslist = [];

        var Locationids = '';
        Locationids = $scope.AllBranchesList
            .filter(pitem => pitem.IsChecked && pitem.ClinicId !== 0)
            .map(pitem => pitem.ClinicId)
            .join(",");


        var param = {
            /*"OrganizationId": $scope.SearchPosobj.OrganizationId,*/
            "PageSize": $scope.SearchPosobj.PageSize,
            "PageNumber": $scope.SearchPosobj.PageNumber,
            "InvoiceNumber": $scope.SearchPosobj.InvoiceNumber || "",
            "PatientId": $scope.mainPatientProfileObj.PatientId || "",
            "SoldByUserId": $scope.SearchPosobj.SoldByUserId || "",
            "FromDate": $scope.SearchPosobj.FromDate || "",
            "ToDate": $scope.SearchPosobj.ToDate || "",
            "PaymentStatusId": $scope.SearchPosobj.SoldByUserId || "",
             "Locationids": Locationids || '',
        };

        eHnoteInsuranceService.GetOrganizationPOSInvoices(param).then(function (resp) {
            if (resp.data.status === "Success") {
                $scope.POSVoidInvoiceslist = resp.data.PosVoid || [];
                if (resp.data.rows.length > 0) {
                    $scope.POSInvoicesCount = resp.data.count || 0;
                    $scope.POSInvoiceslist = resp.data.rows || [];
                   
                    if ($scope.POSInvoiceslist.length > 0) {
                        angular.forEach($scope.POSInvoiceslist, function (item) {
                            item.Isshow = false;
                        })
                    }

                }


            }
        }, function (err) { console.log(err); });

    }
    $scope.excludeVoided = function (item) {
        return item.PaymentStatusId !== 4 && item.PaymentStatusId !== 5;
    };
    $scope.SubtabsChanges = 4;
    $scope.FinancialSubtabs = function (tabchange) {
        $scope.SubtabsChanges = tabchange;
        if ($scope.SubtabsChanges == 1) {
            $scope.IsShowPatietnPaymentPopup = false;

            $scope.getPatientDepositAmountById();
            $scope.GetPatientPaymentsDetails();
        } else if ($scope.SubtabsChanges == 2) {
            $scope.GetPayorBillerSummaryBalance();
        }
        else if ($scope.SubtabsChanges == 3) {
            $scope.SearchPatientClaimData();
            $scope.GetPatientTotalRevenueBalance();
        }
        else if ($scope.SubtabsChanges == 4) {
            if ($scope.PatientClaimsList.length > 0) {
                $scope.claimScreenParentObj.PatientClaimId = $scope.claimScreenParentObj.PatientClaimId || 0;

                if ($scope.claimScreenParentObj.PatientClaimId != 0) {
                    $scope.filteredClaims = $scope.PatientClaimsList.filter(function (claim) {
                        return claim.PatientClaimId === $scope.claimScreenParentObj.PatientClaimId;
                    });
                    $scope.GetPatientClaimDetailsById($scope.filteredClaims[0]);
                    $scope.AddNotesDetailsData($scope.filteredClaims[0]);
                } else {
                    $scope.GetPatientClaimDetailsById($scope.PatientClaimsList[0]);
                    $scope.AddNotesDetailsData($scope.PatientClaimsList[0]);
                }

                // $scope.PatientClaimDetailslist($scope.PatientClaimsList[0]);
                if ($scope.claimScreenParentObj.PatientClaimId == 0 || $scope.claimScreenParentObj.PatientClaimId == null || $scope.claimScreenParentObj.PatientClaimId == undefined) {
                    $scope.claimScreenParentObj.PatientClaimId = $scope.PatientClaimsList[0].PatientClaimId;
                }
                var matchedList = $scope.PatientClaimsList.filter(function (item) {
                    return item.PatientClaimId === $scope.claimScreenParentObj.PatientClaimId;
                });
                $scope.MatchedClaims = matchedList;
                $scope.PatientClaimDetailslist($scope.MatchedClaims[0]);
            } 

            if ($scope.claimScreenParentObj.NotesId == 1) {
                $scope.ClaimHistorySubtabs(1);
            }
            else if ($scope.claimScreenParentObj.NotesId == 2) {
                $scope.ClaimHistorySubtabs(2);
            }
            $scope.getActiveApptvisitReasons();
            $scope.RefreshFilters();
        }
        else if ($scope.SubtabsChanges == 5) {
            $scope.SearchCLaimEncounters(1);
            $scope.getPatientDepositAmountById();
            $scope.getActiveApptvisitReasons();
        }
        else if ($scope.SubtabsChanges == 6) {
            $scope.GetOrganizationPOSInvoices();
        }
        else if ($scope.SubtabsChanges == 8) {
            $scope.DeleteClaimsHistoryList()
        } else if ($scope.SubtabsChanges == 9) {
          
            $scope.GetPatientPendingPaymentsList();
        }

    }
  
   
    $scope.GetPatientDepositsObj = function () {
        var obj = {
            "UserId": $scope.UserId,
            "OrganizationId": $scope.HospitalId,
            "PatientDepositId": 0,
            "PatientId": $scope.mainPatientProfileObj.PatientId || 0,
            "ReceiptNo": "",
            "ReceiptId": "",
            "DepositDate": $filter('date')(new Date(), "MM-dd-yyyy"),
            "PaymentDate": $filter('date')(new Date(), "MM-dd-yyyy"),
            "DepositAmount": "",
            "DepositedByUserId": "",
            "DepositedBy": "",
            "UnBilledAmount": 0.00,
            "BilledAmount": 0.00,
            "DeleteInd": "N",
            "AppointmentId": "",
            "BillingProviderId": "",
            "BillingProviderObj": "",
            "DepositTypeId": 3,
            "DepositTypeName": "",
            "PaymentMethodId": null,
            "PaymentMethodName": "",
            "ChequeNumber": "",
            "CardNumber": "",
            "OnlineTransactionNumber": "",
            "CardName": "",
            "CardExpiry": "",
            "Notes": "",
            "BatchNumber": "",
            "OrganizationFacilityId": 0,
            "FacilityName": "",
            "BillingProviderName": "",
            "IsConsent": false,
            "IsDepositPrint": false,
            "IsEmail": false,
            "IsSelectedRadiobtn": false,
            "DepositStatusId": 1,
            "DepositStatus": 'Pending',
            "PageSize": 50,
            "PageNumber": 1,
            "Count": 0,
            "TransactionCategoryId":0,
            "PatientDepositPaymodeList":
                [
                    {
                        "PatientDepositPaymodeListId": 0,
                        "PaymentMethodId": 1,
                        "PaymentMethodName": "Cash",
                        "DepositAmount": "",
                        "ReferenceNumber": "",
                        "IsDepositAdded": false,
                        "DeleteInd": "N"
                    }
                ]
        }

        return obj;
    };

    $scope.PatientDepositsObj = angular.copy($scope.GetPatientDepositsObj());

    $scope.GetPatientpaymentObj = function () {
        var obj = {
            "PatientDepositId": 0,
            "EOBId": 0,
            "IsPatientDeposit": false,
            "PostingDate": $filter('date')(new Date(), "MM-dd-yyyy"),
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
            "PatientId": $scope.mainPatientProfileObj.PatientId || null,
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
            "DeleteInd": "N",
            "UnBilledAmount": null,
            "BilledAmount": null,
            "DepositAmount": null,
            "OrganizationName": '',
            "BillingProviderIds": ''
        }

        return obj;
    };

    $scope.PatientPaymentObj = angular.copy($scope.GetPatientpaymentObj());

    $scope.SelectedPatientDetails = {
        "PatientObj": "",
        "DepositsObj": ""
    };

    $scope.GetPatientTotalRevenueObj = function () {
        var obj = {
            "TotalClaimsChargeAmount": "",
            "TotalClaimsPatientBalance": "",
            "TotalClaimsInsuranceBalance": "",
            "TotalClaimsBalance": "",
            "TotalClaimsInsurancePayment": "",
            "TotalClaimsPatientPayment": "",
            "TotalPatientDepositAmount": "",
            "TotalPatientDepositAllocated": "",
            "TotalPatientDepositUnAllocated": "",
            "TotalInsuranceUnAllocated": "",
            "LastClaimDate": "",
            "LastSettlementDate": "",
            "PrimaryProviderId": "",
            "PrimaryProviderFirstName": "",
            "PrimaryProviderLastName": "",
            "LastPatientStatementDate": ""
        }
        return obj;
    }
    $scope.PatientTotalRevenueObj = angular.copy($scope.GetPatientTotalRevenueObj);

    $scope.getPatientClaimList = function () {
        var Obj = {
            "FromDate": "",
            "ToDate": "",
            "PatientClaimNumber": '',
        }
        return Obj;
    }
    $scope.SearchPatientClaimList = angular.copy($scope.getPatientClaimList());

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

    $scope.maininit = function () {
        $scope.SubtabsChanges = 4;
        $scope.MasterClaimStatusList = [];
        $scope.DepositTypes = [];
        $scope.WriteOffReasons = [];
        $scope.OrganizationClearingHouseDetails = [];
        $scope.OrganizationFacilityList = [];
        $scope.BillingProvidersList = [];
        $scope.PatientDepositsObj.PatientId = $scope.mainPatientProfileObj.PatientId || 0;
        $scope.PatientClaimsList = [];
        $scope.POSList = [];
        $scope.PatientPaymentsArray = [];
        $scope.TotalPatientClaimsCount = 0;
        $scope.mainPatientProfileObj.PatientClaimId = $scope.mainPatientProfileObj.PatientClaimId || 0;
        var Locationids = '';
        Locationids = $scope.AllBranchesList
            .filter(pitem => pitem.IsChecked && pitem.ClinicId !== 0)
            .map(pitem => pitem.ClinicId)
            .join(",");


        var params = {
            "OrganizationId": $scope.HospitalId,
            "FacilityName": ""
        };
      
        var params1 = {
            "OrganizationId": $scope.HospitalId || 0,
            "ParentOrganizationId": $scope.ParenthospitalId,
            "FacilityCode": "",
            "PageNumber": 1,
            "PageSize": 20
        };  
        var claimslistobj = {
            "PatientId": $scope.mainPatientProfileObj.PatientId,
            "OrganizationId": $scope.HospitalId,
            "FromDate": $scope.SearchPatientClaimList.FromDate,
            "ToDate": $scope.SearchPatientClaimList.ToDate,
            "PatientClaimNumber": $scope.SearchPatientClaimList.PatientClaimNumber || '',
            "Locationids": Locationids || '',
            "PageSize": 50,
            "PageNumber": 1
        }
        $q.all([
            eHnoteSettingsDataService.GetAllMasterClaimsData($scope.HospitalId),
            eHnoteMainAdminServices.GetOrganizationFacilityDetails(params),
            eHnoteInsuranceService.GetPatientTotalDepositsById($scope.PatientDepositsObj.PatientId),
            eHnoteSettingsDataService.GetOrganizationBillingProviders(params1),
            eHnoteInsuranceService.GetPatientClaimsList(claimslistobj),
            eHnoteInsuranceService.GetPatientTotalRevenueDetails($scope.mainPatientProfileObj.PatientId),
          //  eHnoteInsuranceService.GetParticularClaimDetailsById($scope.mainPatientProfileObj.PatientClaimId),
            $scope.mainPatientProfileObj.PatientClaimId
                ? eHnoteInsuranceService.GetParticularClaimDetailsById($scope.mainPatientProfileObj.PatientClaimId)
                : $q.resolve(null),
        ]).then(function (resp) {         
            if (resp[0].data.status == "Success") {
                $scope.AllCardTypes = resp[0].data.Cardtype;
                if (resp[0].data.ClaimStatus.length > 0) {
                    $scope.MasterClaimStatusList = angular.copy(resp[0].data.ClaimStatus);
                }
                if (resp[0].data.DepositTypes.length > 0) {
                    $scope.DepositTypes = resp[0].data.DepositTypes || [];
                }
                if (resp[0].data.WriteOffReasons.length > 0) {
                    $scope.WriteOffReasons = resp[0].data.WriteOffReasons || [];
                }
                if (resp[0].data.ConnectedClearingHouse.length > 0) {
                    $scope.OrganizationClearingHouseDetails = resp[0].data.ConnectedClearingHouse || [];
                }
                if (resp[0].data.Cardtype.length > 0) {
                    $scope.mainPatientProfileObj.CardTypesData = resp[0].data.Cardtype || [];
                }
                $scope.MasterPriority = resp[0].data.MasterPriority || [];

                $scope.MasterAlertTypes = resp[0].data.MasterAlertTypes || [];
                angular.forEach($scope.MasterAlertTypes, function (item) {
                    item.IsChecked = false;
                });

                if (resp[0].data.MasterAlertTag.length > 0) {
                    $scope.MasterAlertTag = resp[0].data.MasterAlertTag || [];
                }

                if (resp[0].data.MasterAlertNoteType.length > 0) {
                    $scope.MasterAlertNoteType = $filter("filter")(resp[0].data.MasterAlertNoteType, function (item) {
                        return item.AlertNoteTypeId !== 6;
                    }) || [];
                }
            }

            if (resp[1].data.status === "Success") {
                resp[1].data.rows = resp[1].data.rows || [];
                if (resp[1].data.rows.length > 0) {
                    $scope.OrganizationFacilityList = angular.copy(resp[1].data.rows);
                }
            }

            if (resp[2].data[0].status === "success") {
                $scope.Selectedpatientobj = '';
                $scope.Selectedpatientobj = resp[2].data[0];

                if ($scope.Selectedpatientobj.AppointmentmentsArray.length > 0) {
                    angular.forEach($scope.Selectedpatientobj.AppointmentmentsArray, function (ditem) {
                        ditem.AppointmentDate = $filter('date')(ditem.AppointmentDate, "MM-dd-yyyy");
                    });
                }
            }

            if (resp[3].data.Status == "Success") {
                resp[3].data.rows = resp[3].data.rows || [];
                if (resp[3].data.Masterrefundreasons.length > 0) {
                    $scope.Masterrefundreasons = resp[3].data.Masterrefundreasons || [];
                }
                $scope.TotalFacilityCount = resp[3].data.count || 0;
                if (resp[3].data.rows.length > 0) {
                    $scope.BillingProvidersList = resp[3].data.rows || [];
                }

                if (resp[3].data.Masterrefundreasons.length > 0) {
                    $scope.Masterrefundreasons = resp[3].data.Masterrefundreasons || [];
                }
                if (resp[3].data.TransactionCategory.length > 0) {
                    $scope.MasterTransactionCategories = resp[3].data.TransactionCategory || [];

                    $scope.MasterTransactionCategories.unshift({
                        TransactionCategoryId: 0,
                        TransactionCategoryName: 'All'
                    });
                }

            }

            if (resp[4].data.status === "Success") {               
                if (resp[4].data.PatientClaims.length > 0) {
                    $scope.PatientClaimsList = angular.copy(resp[4].data.PatientClaims);
                    $scope.TotalPatientClaimsCount = resp[4].data.Count || 0;
                    //var filtredArray = $filter("filter")($scope.PatientClaimsList, { "PatientClaimId": $scope.claimScreenParentObj.PatientClaimId }, true) || [];
                    //if (filtredArray.length > 0) {
                    //    $scope.PatientClaimDetailslist(filtredArray[0]);
                    //}
                }
                if (resp[4].data.POS.length > 0) {
                    $scope.POSList = angular.copy(resp[4].data.POS) || [];
                    $scope.POSList = $scope.POSList.filter(function (item) {
                        return item.PaymentStatusId !== 4;
                    });
                }
                if (resp[4].data.PatientPaymentsArray.length > 0) {
                    $scope.PatientPaymentsArray = angular.copy(resp[4].data.PatientPaymentsArray) || [];

                }
                if ($scope.PatientPaymentsArray.length > 0) {
                    angular.forEach($scope.PatientPaymentsArray, function (pitem) {
                        pitem.PatientClaimNumbers = '';
                        pitem.PatientClaimNumbers = (pitem.TransactionDetails || []).map(function (citem) {
                            return citem.PatientClaimNumber;
                        }).join(",");
                    });
                }
            }          


            if (resp[5].data.status === "Success") {
                var resp1 = angular.copy(resp[5].data);
                $scope.PatientTotalRevenueObj.TotalClaimsChargeAmount = resp1.TotalClaimsChargeAmount || "";
                $scope.PatientTotalRevenueObj.TotalClaimsPatientBalance = resp1.TotalClaimsPatientBalance || "";
                $scope.PatientTotalRevenueObj.TotalClaimsInsuranceBalance = resp1.TotalClaimsInsuranceBalance || "";
                $scope.PatientTotalRevenueObj.TotalClaimsBalance = resp1.TotalClaimsBalance || "";
                $scope.PatientTotalRevenueObj.TotalClaimsInsurancePayment = resp1.TotalClaimsInsurancePayment || "";
                $scope.PatientTotalRevenueObj.TotalClaimsPatientPayment = resp1.TotalClaimsPatientPayment || "";
                $scope.PatientTotalRevenueObj.TotalPatientDepositAmount = resp1.TotalPatientDepositAmount || "";
                $scope.PatientTotalRevenueObj.TotalPatientDepositAllocated = resp1.TotalPatientDepositAllocated || "";
                $scope.PatientTotalRevenueObj.TotalPatientDepositUnAllocated = resp1.TotalPatientDepositUnAllocated || "";
                $scope.PatientTotalRevenueObj.TotalInsuranceUnAllocated = resp1.TotalInsuranceUnAllocated || "";
                $scope.PatientTotalRevenueObj.LastClaimDate = resp1.LastClaimDate || "";
                $scope.PatientTotalRevenueObj.LastSettlementDate = resp1.LastSettlementDate || "";
                $scope.PatientTotalRevenueObj.PrimaryProviderId = resp1.PrimaryProviderId || 1;
                $scope.PatientTotalRevenueObj.PrimaryProviderFirstName = resp1.PrimaryProviderFirstName || "";
                $scope.PatientTotalRevenueObj.PrimaryProviderLastName = resp1.PrimaryProviderLastName || "";
                $scope.PatientTotalRevenueObj.LastPatientStatementDate = resp1.LastPatientStatementDate || "";
            }
           
            if (resp[6] && resp[6].data && resp[6].data.status == "Success") {
                $scope.ClaimDetails = angular.copy(resp[6].data);
                $scope.PatientClaimLineItems = $scope.ClaimDetails.PatientClaimLineItems || [];
                $scope.ServiceLineItems = [];
                if ($scope.PatientClaimLineItems.length > 0) {
                    angular.forEach($scope.PatientClaimLineItems, function (item) {
                        $scope.ServiceLineItems.push(item);
                        $scope.ServiceLineItemsArray = $scope.ServiceLineItems || [];
                    });
                }
            }
            $scope.FinancialSubtabs(4);
        });
    }
     
    $scope.maininit();



    $scope.IsAddDepositbtn = false;
    $scope.AddUpdatePatientDeposit = function (item) {

        $scope.IsAddDepositbtn = false;

        if ($scope.PatientDepositsObj.PatientId === 0) {
            alertify.error("Please Select Patient ");
            return;
        }

        let i = 0; let j = 0; let k = 0; let l = 0;
        angular.forEach($scope.PatientDepositsObj.PatientDepositPaymodeList, function (item) {

            if (item.PaymentMethodId == 0) {
                i++;
            }
            if (item.DepositAmount == "") {
                j++;
            }
            if (item.ReferenceNumber == "") {
                k++;
            }
            //if (item.PaymentDate == null) {
            //    l++;
            //}
            //else {
            //    item.PaymentDate = $filter('date')(item.PaymentDate, 'yyyy-MM-dd');
            //}

        });

        if (i > 0) {
            alertify.error("Please select payment method");
            return;
        }
        if (j > 0) {
            alertify.error("Please enter amount");
            return;
        }
        //if (k > 0) {
        //    alertify.error("Please enter reference number");
        //    return;
        //}

        //$scope.PatientDepositsObj.PaymentMethodId = $scope.PatientDepositsObj.PaymentMethodId || null;
        //if ($scope.PatientDepositsObj.PaymentMethodId === null) {
        //    alertify.error("Please Select Payment Method ");
        //    return;
        //}

        //$scope.PatientDepositsObj.DepositAmount = $scope.PatientDepositsObj.DepositAmount || "";
        //if ($scope.PatientDepositsObj.DepositAmount === "") {
        //    alertify.error("Please Enter Amount ");
        //    return;
        //}


        var ConvertedDate = $filter("usdateFormatter")($scope.PatientDepositsObj.DepositDate, "-");
        var PaymentDate = $filter("usdateFormatter")($scope.PatientDepositsObj.PaymentDate, "-");



        var obj = {
            "UserId": $scope.PatientDepositsObj.UserId,
            "OrganizationId": $scope.PatientDepositsObj.OrganizationId,
            "PatientDepositId": $scope.PatientDepositsObj.PatientDepositId || 0,
            "PatientId": $scope.PatientDepositsObj.PatientId || 0,
            "ReceiptNo": "",
            "ReceiptId": 0,
            "DepositDate": ConvertedDate,
            "PaymentDate": PaymentDate,
            "DepositAmount": $scope.PatientDepositsObj.DepositAmount || 0,
            "DepositedByUserId": $scope.PatientDepositsObj.DepositedByUserId,
            "DepositedBy": $scope.PatientDepositsObj.DepositedBy,
            "UnBilledAmount": 0,
            "BilledAmount": 0,
            "DeleteInd": $scope.PatientDepositsObj.DeleteInd || "N",
            "AppointmentId": $scope.PatientDepositsObj.AppointmentId,
            "BillingProviderId": $scope.PatientDepositsObj.BillingProviderId,
            "DepositTypeId": $scope.PatientDepositsObj.DepositTypeId,
            "DepositType": $scope.PatientDepositsObj.DepositType,
            "PaymentMethodId": $scope.PatientDepositsObj.PaymentMethodId,
            "PaymentMethodName": $scope.PatientDepositsObj.PaymentMethodName,
            "ChequeNumber": $scope.PatientDepositsObj.ChequeNumber,
            "CardNumber": "",
            "OnlineTransactionNumber": $scope.PatientDepositsObj.OnlineTransactionNumber,
            "CardName": "",
            "CardExpiry": "",
            "Notes": $scope.PatientDepositsObj.Notes,
            "BatchNumber": $scope.PatientDepositsObj.BatchNumber,
            "OrganizationFacilityId": $scope.PatientDepositsObj.OrganizationFacilityId,
            "FacilityName": $scope.PatientDepositsObj.FacilityName,
            "IsConsent": $scope.PatientDepositsObj.IsConsent,
            "IsDepositPrint": $scope.PatientDepositsObj.IsDepositPrint,
            "IsEmail": $scope.PatientDepositsObj.IsEmail,
            "DepositStatusId": $scope.PatientDepositsObj.DepositStatusId,
            "DepositStatus": $scope.PatientDepositsObj.DepositStatus,
            "PageSize": $scope.PatientDepositsObj.PageSize,
            "PageNumber": $scope.PatientDepositsObj.PageNumber,
            "PatientDepositPaymodeList": $scope.PatientDepositsObj.PatientDepositPaymodeList || []
        };

        eHnoteInsuranceService.AddUpdatePatientDepositAmount(obj).then(function (resp) {
            if (resp.data.Status === "Success") {

                if (obj.PatientDepositId === 0) {
                    alertify.success("Added Successfully");
                } else {
                    alertify.success("Updated Successfully");
                }
                $scope.getPatientDepositAmountById();
                $scope.SelectedPatientDetails.DepositsObj = angular.copy($scope.PatientDepositsObj) || "";

                if ($scope.SelectedPatientDetails.DepositsObj.IsDepositPrint == true) {
                    $scope.AddDespositePrint($scope.SelectedPatientDetails);
                } else {

                }

                $scope.PatientDepositsObj = angular.copy($scope.GetPatientDepositsObj());

                $scope.SelectedPatientDetails.PatientObj = "";
                $scope.SelectedPatientDetails.DepositsObj = "";
            } else {
                alertify.error(resp.data.Message);
            }
        });
    };
    $scope.IsShowDepositScreen = false;
    $scope.ShowDepositPaymentScreen = function () {
        $scope.IsShowDepositScreen = true;
        var filtredArray = $filter("filter")($scope.AllBranchesList, { "BranchId": $scope.HospitalId }, true) || [];
        if (filtredArray.length > 0) {
            $scope.PatientDepositsObj.BillingProviderId = filtredArray[0].DefaultBillingProviderId;
            $scope.PatientDepositsObj.OrganizationFacilityId = filtredArray[0].BranchId;
            $scope.PatientDepositsObj.FacilityName = filtredArray[0].BranchName;
        }
    }

    $scope.ClearPatientDeposit = function () {
        $scope.PatientDepositsObj = angular.copy($scope.GetPatientDepositsObj());
        $scope.HospitalIds = '';
        $scope.getOrganizationBillingProviderList();
        $scope.changeAppointment($scope.Selectedpatientobj.AppointmentmentsArray[0].AppointmentId);

    };

    $scope.ChangePaymentMode = function (id, item, index) {

        let i = 0;
        angular.forEach($scope.PatientDepositsObj.PatientDepositPaymodeList, function (item) {
            if (item.PaymentMethodId === id) {
                i++;
            }
        });

        if (i > 1) {
            alertify.error("The selected payment method is already existed!");
            $scope.PatientDepositsObj.PatientDepositPaymodeList[index].PaymentMethodId = 0;
            return;
        }

        var List1 = $filter("filter")($scope.masterPaymentModes, function (Pitem,) { return Pitem.PaymentModeId === id; }) || [];
        if (List1.length != 0) {
            item.PaymentMethodName = List1[0].PaymentModeName;
        }
    }


    $scope.AddMultiplePatientDeposits = function (item) {

        if (item.PaymentMethodId == 0) {
            alertify.error("Please select payment method");
            return;
        }
        if (item.DepositAmount == "") {
            alertify.error("Please enter deposit amount");
            return;
        }
        if (item.ReferenceNumber == "") {
            alertify.error("Please enter reference number");
            return;
        }
        //if (item.PaymentDate == null) {
        //    alertify.error("Please select payment date");
        //    return;
        //}

        var List = $filter("filter")($scope.masterPaymentModes, function (Pitem,) { return Pitem.PaymentModeId === item.PaymentMethodId; }) || [];
        if (List.length > 0) {
            item.PaymentMethodName = List[0].PaymentModeName;
        }

        if ($scope.PatientDepositsObj.PatientDepositPaymodeList.length >= 3) {
            alertify.error("You can only add up to 3 records.");
            return;
        }

        $scope.PatientDepositsObj.PatientDepositPaymodeList.push({
            "PatientDepositPaymodeListId": 0,
            "PaymentMethodId": 0,
            "PaymentMethodName": "",
            "DepositAmount": "",
            "ReferenceNumber": "",
            "IsDepositAdded": false,
            "DeleteInd": "N"
        });
    };

    $scope.CalculateTotal = function () {
        const total = $scope.PatientDepositsObj.PatientDepositPaymodeList.reduce((sum, item) => {
            return sum + (item.DeleteInd !== 'Y' ? (parseFloat(item.DepositAmount) || 0) : 0);
        }, 0);

        $scope.PatientDepositsObj.DepositAmount = total;
    };

    $scope.DeletePatientDeposit = function (item, index) {
        alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to delete? </h4>", function () {
            if (item.PatientDepositPaymodeListId != 0) {
                item.DeleteInd = "Y";
            } else {
                $scope.PatientDepositsObj.PatientDepositPaymodeList.splice(index, 1);
            }
            $scope.CalculateTotal();
            $scope.$apply();
        }, function () {

        });
    };

    $scope.getPatientDepositAmountById = function (pageno, type) {
        $scope.PatientDepositsListArray = [];
       /* $scope.Refundlist = [];*/
        $scope.PatientDepositsObj.PageNumber = pageno || 1;
        var type = (type === undefined || type === '') ? 'All' : type;
        var obj = {
            "DepositFrom": '',
            "DepositTo": '',
            "PaymentModeId": '',
            "PatientId": $scope.mainPatientProfileObj.PatientId,
            "OrganizationId": $scope.HospitalId,
            "PageSize": $scope.PatientDepositsObj.PageSize,
            "PageNumber": $scope.PatientDepositsObj.PageNumber,
            "TransactionNumber": '',
            "SortBy": "Asc",
            "SearchType": "Deposit",
            "TransactionCategoryId": $scope.PatientDepositsObj.TransactionCategoryId || 0
           
        };

        obj.PaymentModeId = parseInt(obj.PaymentModeId);


        eHnoteInsuranceService.GetAllPatientDeposits(obj).then(function (resp) {
            if (resp.data.status === "Success") {
                $scope.PatientDepositsListArray = resp.data.rows || [];
              /*  $scope.Refundlist = resp.data.Refundlist || [];*/
                //if ($scope.PatientDepositsListArray.length > 0) {
                //    $scope.IsShowDepositScreen = false;
                //} else {
                //    $scope.IsShowDepositScreen = true;
                //}


                if ($scope.PatientDepositsListArray.length > 0) {
                    angular.forEach($scope.PatientDepositsListArray, function (pitem) {
                        pitem.IsselectedDeposit = false;
                        var uniqueMap = {};

                        (pitem.PatientDepositPaymodeList || []).forEach(function (bitem) {
                            var original = bitem.DepositTypeName || "";
                            var key = original.replace(/\s+/g, '').toLowerCase();
                            if (!uniqueMap[key]) {
                                uniqueMap[key] = original;
                            }
                        });

                        pitem.DepositTypeNames = Object.values(uniqueMap).join(', ') || pitem.DepositTypeName || "";
                    })

                }

                $scope.DepositDetails = resp.data;
                $scope.PatientDepositsObj.Count = resp.data.count || 0;
                //if ($scope.PatientClaimNumber != 0) {
                //    $scope.AllocatePaymentDeposite();
                //}
              /*  $scope.PatientDepositsObj = angular.copy($scope.GetPatientDepositsObj());*/
                var filtredArray = $filter("filter")($scope.AllBranchesList, { "BranchId": $scope.HospitalId }, true) || [];
                if (filtredArray.length > 0) {
                    $scope.PatientDepositsObj.BillingProviderId = filtredArray[0].DefaultBillingProviderId;
                    $scope.PatientDepositsObj.OrganizationFacilityId = filtredArray[0].BranchId;
                    $scope.PatientDepositsObj.FacilityName = filtredArray[0].BranchName;
                }
            } else {
                alertify.error(resp.data.Message);
            }
        });

    }

    $scope.GetPatientPaymentsDetails = function () {

        $scope.allClaimPatientPayments = [];

        var currentdate = $filter('date')(new Date(), 'MM-dd-yyyy');

        var PaymentMethodIds = $scope.masterPaymentModes.map(function (status) {
            return status.PaymentModeId;
        }).join(',');

        $scope.PatientPaymentObj.BillingProviderIds = $scope.BillingProvidersList.map(function (status) {
            return status.OrganizationBillingProviderId;
        }).join(',');

        var obj = {
            "PatientId": $scope.mainPatientProfileObj.PatientId,
            "MrNo": $scope.mainPatientProfileObj.PatientDisplayId,
            "ClaimNo": "",
            "PaymentFromDate": currentdate,
            "PaymentToDate": currentdate,
            "ReceiptFromDate": currentdate,
            "ReceiptToDate": currentdate,
            "BillingProviderId": $scope.PatientPaymentObj.BillingProviderIds,
            "UserId": $scope.UserId,
            "PaymentMethodId": PaymentMethodIds,
            "ReferenceNumber": $scope.PatientPaymentObj.ReferenceNumber,
            "PageSize": 100,
            "PageNumber": 1,
            "OrganizationId": $scope.HospitalId,
            "PaymentTypeId": 0,
        }

        eHnoteInsuranceService.GetAllClaimPatientPayments(obj).then(function (resp) {
            if (resp.data.status == "Success") {
                if (resp.data.rows.length > 0) {
                    $scope.allClaimPatientPayments = angular.copy(resp.data.rows);
                }
            }
        });
    }

    $scope.getPatientDepositAmountById();

    $scope.GetPatientTotalRevenueBalance = function () {

        eHnoteInsuranceService.GetPatientTotalRevenueDetails($scope.mainPatientProfileObj.PatientId).then(function (resp) {
            if (resp.data.status === "Success") {
                var data = angular.copy(resp.data);
                $scope.PatientTotalRevenueObj.TotalClaimsChargeAmount = data.TotalClaimsChargeAmount || "";
                $scope.PatientTotalRevenueObj.TotalClaimsPatientBalance = data.TotalClaimsPatientBalance || "";
                $scope.PatientTotalRevenueObj.TotalClaimsInsuranceBalance = data.TotalClaimsInsuranceBalance || "";
                $scope.PatientTotalRevenueObj.TotalClaimsBalance = data.TotalClaimsBalance || "";
                $scope.PatientTotalRevenueObj.TotalClaimsInsurancePayment = data.TotalClaimsInsurancePayment || "";
                $scope.PatientTotalRevenueObj.TotalClaimsPatientPayment = data.TotalClaimsPatientPayment || "";
                $scope.PatientTotalRevenueObj.TotalPatientDepositAmount = data.TotalPatientDepositAmount || "";
                $scope.PatientTotalRevenueObj.TotalPatientDepositAllocated = data.TotalPatientDepositAllocated || "";
                $scope.PatientTotalRevenueObj.TotalPatientDepositUnAllocated = data.TotalPatientDepositUnAllocated || "";
                $scope.PatientTotalRevenueObj.TotalInsuranceUnAllocated = data.TotalInsuranceUnAllocated || "";
                $scope.PatientTotalRevenueObj.LastClaimDate = data.LastClaimDate || "";
                $scope.PatientTotalRevenueObj.LastSettlementDate = data.LastSettlementDate || "";
                $scope.PatientTotalRevenueObj.PrimaryProviderId = data.PrimaryProviderId || 1;
                $scope.PatientTotalRevenueObj.PrimaryProviderFirstName = data.PrimaryProviderFirstName || "";
                $scope.PatientTotalRevenueObj.PrimaryProviderLastName = data.PrimaryProviderLastName || "";
                $scope.PatientTotalRevenueObj.LastPatientStatementDate = data.LastPatientStatementDate || "";
            }
        });
    }

    $scope.changeAppointment = function (Id) {
        var filtredArray = $filter("filter")($scope.Selectedpatientobj.AppointmentmentsArray, { "AppointmentId": Id }, true) || [];
        if (filtredArray.length > 0) {
            $scope.PatientDepositsObj.AppointmentId = filtredArray[0].AppointmentId;
        }

        var filtredArray = $filter("filter")($scope.AllBranchesList, { "BranchId": $scope.HospitalId }, true) || [];
        if (filtredArray.length > 0) {
            $scope.PatientDepositsObj.BillingProviderId = filtredArray[0].DefaultBillingProviderId;
            $scope.PatientDepositsObj.OrganizationFacilityId = filtredArray[0].BranchId;
            $scope.PatientDepositsObj.FacilityName = filtredArray[0].BranchName;

            $scope.PatientPaymentObj.BillingProviderId = filtredArray[0].DefaultBillingProviderId || 0;
            $scope.PatientPaymentObj.OrganizationFacilityId = filtredArray[0].BranchId;
            $scope.PatientPaymentObj.FacilityName = filtredArray[0].BranchName;

        }
    }

    $scope.changeBillingFacility = function (Id) {
        var filtredArray = $filter("filter")($scope.AllBranchesList, { "BranchId": Id }, true) || [];
        if (filtredArray.length > 0 && filtredArray[0].ClinicId === 0) {
            $scope.HospitalIds = $scope.AllBranchesList.map(branch => branch.ClinicId).filter(clinicId => clinicId !== 0).join(',');
        } else {
            $scope.HospitalIds = filtredArray[0].ClinicId;
        }

        $scope.getOrganizationBillingProviderList();

        if (filtredArray.length > 0) {
            $scope.PatientDepositsObj.BillingProviderId = filtredArray[0].DefaultBillingProviderId;
            $scope.PatientDepositsObj.OrganizationFacilityId = filtredArray[0].BranchId;
            $scope.PatientDepositsObj.FacilityName = filtredArray[0].BranchName;
        }

    }

    $scope.changeBillingProvider = function (id, item) {
        var List1 = $filter("filter")($scope.BillingProvidersList, function (Pitem,) { return Pitem.OrganizationBillingProviderId === id; }) || [];
        if (List1.length != 0) {
            item.BillingProviderName = List1[0].BillingProviderName;
        }
    }

    $scope.EditPatientDepositData = function (item) {

        $scope.IsAddDepositbtn = true;

       /* $scope.IsShowDepositScreen = true;*/
        item = item || null;
        $scope.navtoOpenAddDepositAmount('', '', 4, item);

        //$scope.PatientDepositsObj.PatientDepositId = item.PatientDepositId;
        //$scope.PatientDepositsObj.PaymentMethodId = item.PaymentMethodId;
        //$scope.PatientDepositsObj.PaymentMethodName = item.PaymentMethodName;
        //$scope.PatientDepositsObj.BatchNumber = item.BatchNumber;
        //$scope.PatientDepositsObj.DepositDate = item.DepositDate;
        //if ($scope.PatientDepositsObj.DepositDate != "") {
        //    $scope.PatientDepositsObj.DepositDate = $filter('date')($scope.PatientDepositsObj.DepositDate, 'MM-dd-yyyy');
        //}
        //$scope.PatientDepositsObj.AppointmentId = item.AppointmentID;
        //$scope.PatientDepositsObj.OrganizationFacilityId = item.OrganizationFacilityId;
        //$scope.PatientDepositsObj.FacilityName = item.FacilityName;
        //$scope.PatientDepositsObj.BillingProviderId = item.BillingProviderId;
        //$scope.PatientDepositsObj.BillingProviderObj = item.BillingProviderName;
        //$scope.PatientDepositsObj.DepositTypeId = item.DepositTypeId;
        //$scope.PatientDepositsObj.DepositTypeName = item.DepositTypeName;
        //$scope.PatientDepositsObj.DepositAmount = item.DepositAmount;
        //$scope.PatientDepositsObj.ReceiptNo = item.ReceiptNo;
        //$scope.PatientDepositsObj.PatientDepositId = item.PatientDepositId;
        //$scope.PatientDepositsObj.Notes = item.Notes;
        //$scope.PatientDepositsObj.PatientDepositPaymodeList = [];

        //if (item.PatientDepositPaymodeList.length > 0) {
        //    angular.forEach(item.PatientDepositPaymodeList, function (item) {
        //        item.IsDepositAdded = true;
        //        item.PaymentDate = $filter('date')(item.PaymentDate, 'MM-dd-yyyy');
        //        $scope.PatientDepositsObj.PatientDepositPaymodeList.push(item);
        //    });
        //} else {
        //    $scope.PatientDepositsObj.PatientDepositPaymodeList.push({
        //        "PatientDepositPaymodeListId": 0,
        //        "PaymentMethodId": 0,
        //        "PaymentMethodName": "",
        //        "DepositAmount": "",
        //        "ReferenceNumber": "",
        //        "IsDepositAdded": false,
        //        "DeleteInd": "N"
        //    });
        //}

    }


    $scope.AddDespositePrint = function (Tempitem) {
        var CostInWords = "";
        CostInWords = eHnotePrintService.ConvertNumberToWords(Tempitem.DepositAmount);

        var PrintInfo = {
            "DepositeDetails": Tempitem,
            "BillingType": "PAYMENT RECEIPT",
            "PrintedDatenTime": "",
            "CostInWords": CostInWords,
            "DepositDate": $filter("date")(Tempitem.DepositDate, "MM-dd-yyyy") || "",
            "PaymentType": Tempitem.PatientDepositPaymodeList.length > 0 ? Tempitem.PatientDepositPaymodeList[0].PaymentMode : ""
        };
        var printDate = $filter("date")(new Date(), "MMM-dd-yyyy");
        var printTime = moment(new Date()).format("HH:mm A");
        var printDatemTime = printDate + '  ' + printTime;
        PrintInfo.PrintedDatenTime = printDatemTime;

        eHnotePrintService.GenerateAddPatientDepositPrint(PrintInfo);
    };


    $scope.AddDepositandAllocate = function (item) {

        $scope.DepositDetails.TotalPatientClaimBalance = $scope.DepositDetails.TotalPatientClaimBalance || 0;
        if ($scope.DepositDetails.TotalPatientClaimBalance === 0) {
            alertify.error("There is no patient balance to allocate amount");
            return;
        }

        if ($scope.PatientDepositsObj.PatientId === 0) {
            alertify.error("Please Select Patient ");
            return;
        }

        let i = 0; let j = 0; let k = 0; let l = 0;
        angular.forEach($scope.PatientDepositsObj.PatientDepositPaymodeList, function (item) {
            if (item.PaymentMethodId == 0) {
                i++;
            }
            if (item.DepositAmount == "") {
                j++;
            }
            if (item.ReferenceNumber == "") {
                k++;
            }
            //if (item.PaymentDate == null) {
            //    l++;
            //} else {
            //    item.PaymentDate = $filter("usdateFormatter")(item.PaymentDate, "-");
            //}
        });

        if (i > 0) {
            alertify.error("Please select payment method");
            return;
        }
        if (j > 0) {
            alertify.error("Please enter amount");
            return;
        }
        //if (k > 0) {
        //    alertify.error("Please enter reference number");
        //    return;
        //}
        //if (l > 0) {
        //    alertify.error("Please select payment date");
        //    return;
        //}

        //$scope.PatientDepositsObj.PaymentMethodId = $scope.PatientDepositsObj.PaymentMethodId || null;
        //if ($scope.PatientDepositsObj.PaymentMethodId === null) {
        //    alertify.error("Please Select Payment Method ");
        //    return;
        //}

        //$scope.PatientDepositsObj.DepositAmount = $scope.PatientDepositsObj.DepositAmount || "";
        //if ($scope.PatientDepositsObj.DepositAmount === "") {
        //    alertify.error("Please Enter Amount ");
        //    return;
        //}


        var ConvertedDate = $filter("usdateFormatter")($scope.PatientDepositsObj.DepositDate, "-");
        var PaymentDate = $filter("usdateFormatter")($scope.PatientDepositsObj.PaymentDate, "-");



        var obj = {
            "UserId": $scope.PatientDepositsObj.UserId,
            "OrganizationId": $scope.PatientDepositsObj.OrganizationId,
            "PatientDepositId": $scope.PatientDepositsObj.PatientDepositId || 0,
            "PatientId": $scope.PatientDepositsObj.PatientId || 0,
            "ReceiptNo": "",
            "ReceiptId": 0,
            "DepositDate": ConvertedDate,
            "PaymentDate": PaymentDate,
            "DepositAmount": $scope.PatientDepositsObj.DepositAmount || 0,
            "DepositedByUserId": $scope.PatientDepositsObj.DepositedByUserId,
            "DepositedBy": $scope.PatientDepositsObj.DepositedBy,
            "UnBilledAmount": 0,
            "BilledAmount": 0,
            "DeleteInd": $scope.PatientDepositsObj.DeleteInd || "N",
            "AppointmentId": $scope.PatientDepositsObj.AppointmentId,
            "BillingProviderId": $scope.PatientDepositsObj.BillingProviderId,
            "DepositTypeId": $scope.PatientDepositsObj.DepositTypeId,
            "DepositType": $scope.PatientDepositsObj.DepositTypeName,
            "PaymentMethodId": $scope.PatientDepositsObj.PaymentMethodId,
            "PaymentMethodName": $scope.PatientDepositsObj.PaymentMethodName,
            "ChequeNumber": $scope.PatientDepositsObj.ChequeNumber,
            "CardNumber": "",
            "OnlineTransactionNumber": $scope.PatientDepositsObj.OnlineTransactionNumber,
            "CardName": "",
            "CardExpiry": "",
            "Notes": $scope.PatientDepositsObj.Notes,
            "BatchNumber": $scope.PatientDepositsObj.BatchNumber,
            "OrganizationFacilityId": $scope.PatientDepositsObj.OrganizationFacilityId,
            "FacilityName": $scope.PatientDepositsObj.FacilityName,
            "IsConsent": $scope.PatientDepositsObj.IsConsent,
            "IsDepositPrint": $scope.PatientDepositsObj.IsDepositPrint,
            "IsEmail": $scope.PatientDepositsObj.IsEmail,
            "DepositStatusId": $scope.PatientDepositsObj.DepositStatusId,
            "DepositStatus": $scope.PatientDepositsObj.DepositStatus,
            "PageSize": $scope.PatientDepositsObj.PageSize,
            "PageNumber": $scope.PatientDepositsObj.PageNumber,
            "PatientDepositPaymodeList": $scope.PatientDepositsObj.PatientDepositPaymodeList || []
        };

        eHnoteInsuranceService.AddUpdatePatientDepositAmount(obj).then(function (resp) {
            if (resp.data.Status === "Success") {

                if (obj.PatientDepositId === 0) {
                    alertify.success("Added Successfully");
                } else {
                    alertify.success("Updated Successfully");
                }
                $scope.getPatientDepositAmountById();
                $scope.SelectedPatientDetails.DepositsObj = angular.copy($scope.PatientDepositsObj) || "";



                $scope.SelectedPatientDetails.PatientObj = "";
                $scope.SelectedPatientDetails.DepositsObj = "";

                /*  $scope.AllocatePaymentDeposite();*/


                $scope.IsShowPatietnPaymentPopup = true;
                $scope.PatientPaymentObj = angular.copy($scope.GetPatientpaymentObj());
                $scope.PatientPaymentObj.AppointmentId = $scope.PatientDepositsObj.AppointmentId;
                $scope.PatientPaymentObj.ReceiptNo = resp.data.ReceiptNo;
                $scope.PatientPaymentObj.PaymentMethodId = $scope.PatientDepositsObj.PaymentMethodId;
                $scope.PatientPaymentObj.PaymentMethodName = $scope.PatientDepositsObj.PaymentMethodName;
                $scope.PatientPaymentObj.DepositDate = ConvertedDate;
                $scope.PatientPaymentObj.DepositDate = $filter('date')($scope.PatientPaymentObj.DepositDate, "MM-dd-yyyy");
                $scope.PatientPaymentObj.PatientDepositId = resp.data.PatientDepositId;
                $scope.PatientPaymentObj.DepositTypeId = $scope.PatientDepositsObj.DepositTypeId;
                $scope.PatientPaymentObj.DepositTypeName = $scope.PatientDepositsObj.DepositTypeName;
                $scope.PatientPaymentObj.DepositAmount = $scope.PatientDepositsObj.DepositAmount;
                $scope.PatientPaymentObj.Notes = $scope.PatientDepositsObj.Notes;
                $scope.PatientPaymentObj.BilledAmount = 0;
                $scope.PatientPaymentObj.UnBilledAmount = $scope.PatientDepositsObj.DepositAmount;

                $scope.GetPatientPaymentsList();


                $scope.PatientDepositsObj = angular.copy($scope.GetPatientDepositsObj());

            } else {
                alertify.error(resp.data.Message);
            }
        });
    };



    $scope.IsShowPatietnPaymentPopup = false;
    $scope.AllocatePaymentDeposite = function (item) {
        $scope.navtoOpenAddDepositAmount('', '', 3, item);


        //$scope.IsShowPatietnPaymentPopup = true;
        //$scope.PatientDepositsListArray = $scope.PatientDepositsListArray || [];


        //if ($scope.PatientDepositsListArray.length > 0) {
        //    let PatientPaymentList = $scope.PatientDepositsListArray || [];
        //    $scope.PaymentLIst = angular.copy(PatientPaymentList);

        //    if ($scope.PaymentLIst.length > 0) {
        //        $scope.PatientPaymentObj.PatientId = $scope.PaymentLIst[0].PatientId;
        //        $scope.PatientPaymentObj.AppointmentId = $scope.PaymentLIst[0].AppointmentID;
        //        $scope.PatientPaymentObj.ReceiptNo = $scope.PaymentLIst[0].ReceiptNo;
        //        $scope.PatientPaymentObj.PaymentMethodId = $scope.PaymentLIst[0].PaymentMethodId;
        //        $scope.PatientPaymentObj.PaymentMethodName = $scope.PaymentLIst[0].PaymentMethodName;
        //        $scope.PatientPaymentObj.DepositDate = $scope.PaymentLIst[0].DepositDate;
        //        $scope.PatientPaymentObj.DepositDate = $filter('date')($scope.PatientPaymentObj.DepositDate, "MM-dd-yyyy");
        //        $scope.PatientPaymentObj.PatientDepositId = $scope.PaymentLIst[0].PatientDepositId;
        //        $scope.PatientPaymentObj.DepositTypeId = $scope.PaymentLIst[0].DepositTypeId;
        //        $scope.PatientPaymentObj.DepositTypeName = $scope.PaymentLIst[0].DepositTypeName;
        //        $scope.PatientPaymentObj.DepositAmount = $scope.PaymentLIst[0].DepositAmount;
        //        $scope.PatientPaymentObj.Notes = $scope.PaymentLIst[0].Notes;
        //        $scope.PatientPaymentObj.BilledAmount = $scope.PaymentLIst[0].BilledAmount;
        //        $scope.PatientPaymentObj.UnBilledAmount = $scope.PaymentLIst[0].UnBilledAmount;
        //        $scope.PatientPaymentObj.PaymentsArray = $scope.PaymentLIst[0].PaymentsArray;
        //        $scope.PatientPaymentObj.BillingProviderId = $scope.PaymentLIst[0].BillingProviderId || 0;
        //        $scope.PatientPaymentObj.PatientDepositPaymodeList = $scope.PaymentLIst[0].PatientDepositPaymodeList || [];
        //        $scope.PatientPaymentObj.IsPatientDeposit = $scope.DepositDetails.IsPatientDeposit;
        //    }



        //}
        //$scope.GetPatientPaymentsList();

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

    $scope.GetPatientPaymentsList = function () {
        let obj = {
            "PatientId": $scope.mainPatientProfileObj.PatientId || null,
            "EOBId": null,
            "PatientClaimId": $scope.mainPatientProfileObj.PatientClaimId || null,
        }
        eHnoteInsuranceService.GetAllPatientResponsibilityDetails(obj).then(function (resp) {
            console.log(resp);

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
                                /*PatientlineItemsObj.WriteOffAmount = item.WriteOffAmount;*/
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
                                /*$scope.TotalAdjustmentBalanceAmount += item.AdjustmentAmount;*/
                                $scope.TotalAdjustmentBalanceAmount = 0;

                            });
                        }
                        $scope.PatientPaymentObj.OrganizationName = Aitem.OrganizationName || "";
                        $scope.PatientPaymentObj.PatientId = Aitem.PatientId || null;

                    });
                }
            }
        });
    }

    $scope.ShowDepositeScreen = function () {
        $scope.IsShowPatietnPaymentPopup = false;
    }


    $scope.calculateLineItemPatientTotals = function () {
        var totalPatientBalance = 0, totalWriteOffAmt = 0, totalPatientPaymentBlsAmt = 0;
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

            });
            Aitem.TotalPatientBalance = totalPatientBalance - (totalPaymentAmount + totalWriteOffAmount);
            Aitem.TotalPatientPayment = totalPaymentAmount;
            Aitem.TotalWriteOffAmount = totalWriteOffAmount;
            totalPatientPaymentBlsAmt += totalPaymentAmount;
            totalWriteOffAmt += totalWriteOffAmount;
        });
        $scope.TotalPatientPaymentBalance = totalPatientPaymentBlsAmt;
        $scope.TotalAdjustmentBalanceAmount = totalWriteOffAmt;
        $scope.PatientPaymentObj.BilledAmount = $scope.TotalPatientPaymentBalance;
    }

    $scope.applyDeposit = function () {
        var totalApplied = 0;
        $scope.TotalPatientPaymentBalance = 0;
        $scope.PatientPaymentObj.UnBilledAmount = $scope.PatientPaymentObj.UnBilledAmount || 0;
        if ($scope.PatientPaymentObj.UnBilledAmount == 0) {
            return false;
        }

        var patientDepositAmount = parseFloat($scope.PatientPaymentObj.UnBilledAmount);
        angular.forEach($scope.PatientClaimList, function (claim) {
            for (let i = 0; i < claim.ClaimPatientResponsibility.length; i++) {
                let balance = claim.ClaimPatientResponsibility[i].PatientBalance;
                //let availableBls = claim.ClaimPatientResponsibility[i].CurrentPatientBalance;
                let availableBls = claim.ClaimPatientResponsibility[i].PatientBalance;
                claim.ClaimPatientResponsibility[i].WriteOffAmount = 0;

                // If deposit is greater than or equal to the balance, pay it off completely
                if (patientDepositAmount >= balance) {
                    claim.ClaimPatientResponsibility[i].PatientPaymentTypeId = $scope.PatientPaymentObj.DepositTypeId;
                    claim.ClaimPatientResponsibility[i].PatientPaymentAmount = balance;
                    claim.ClaimPatientResponsibility[i].CurrentPatientBalance = (availableBls - balance);
                    patientDepositAmount -= balance;
                    $scope.TotalPatientPaymentBalance += balance;
                } else {
                    // If deposit is less than the balance, pay as much as possible
                    claim.ClaimPatientResponsibility[i].PatientPaymentTypeId = $scope.PatientPaymentObj.DepositTypeId;
                    claim.ClaimPatientResponsibility[i].PatientPaymentAmount = patientDepositAmount;
                    claim.ClaimPatientResponsibility[i].CurrentPatientBalance = (availableBls - patientDepositAmount);
                    $scope.TotalPatientPaymentBalance += patientDepositAmount;
                    patientDepositAmount = 0; // Deposit is exhausted
                    break; // Exit loop since no deposit amount is left
                }
            }
        });
        //$scope.PatientPaymentObj.BilledAmount = $scope.TotalPatientPaymentBalance;
        $scope.calculateLineItemPatientTotals();

    };

    $scope.calculateLineItemPaymentTotals = function () {
        var totalPatientBalance = 0, totalWriteOffAmt = 0, totalPatientPaymentBlsAmt = 0;
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

            });
            Aitem.TotalPatientBalance = totalPatientBalance - (totalPaymentAmount + totalWriteOffAmount);
            Aitem.TotalPatientPayment = totalPaymentAmount;
            Aitem.TotalWriteOffAmount = totalWriteOffAmount;
            totalPatientPaymentBlsAmt += totalPaymentAmount;
            totalWriteOffAmt += totalWriteOffAmount;
        });
        $scope.TotalPatientPaymentBalance = totalPatientPaymentBlsAmt;
        $scope.TotalAdjustmentBalanceAmount = totalWriteOffAmt;
        $scope.PatientPaymentObj.BilledAmount = totalPatientPaymentBlsAmt;
    }

    $scope.changePaymentAmount = function (item) {

        var PaymentAmount = parseFloat(item.PatientPaymentAmount) || 0;
        var PatientBalance = parseFloat(item.PatientBalance) || 0;
        var WriteOffAmount = parseFloat(item.WriteOffAmount) || 0;
        var UnBilledAmount = parseFloat($scope.PatientPaymentObj.UnBilledAmount) || 0;
        var AdjustmentAmount = PatientBalance - PaymentAmount;

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

    $scope.SavePatientPayment = function () {

        $scope.PatientPaymentObj.UnBilledAmount = $scope.PatientPaymentObj.UnBilledAmount || 0;
        if ($scope.PatientPaymentObj.UnBilledAmount == 0) {
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
                            "PatientDepositId": $scope.PatientPaymentObj.PatientDepositId,
                            "ClaimLineItemId": item.ClaimLineItemId,
                            "OrganizationId": $scope.HospitalId,
                            "TransactionDate": $filter("date")(new Date(), "yyyy-MM-dd"),
                            "TransactionAmount": -+item.WriteOffAmount,
                            "PatientAmount": -+item.WriteOffAmount,
                            "InsuranceAmount": 0,
                            "ReferenceNumber": $scope.PatientPaymentObj.ReferenceNumber,
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
                            "PatientDepositId": $scope.PatientPaymentObj.PatientDepositId,
                            "ClaimLineItemId": item.ClaimLineItemId,
                            "OrganizationId": $scope.HospitalId,
                            "TransactionDate": $filter("date")(new Date(), "yyyy-MM-dd"),
                            "TransactionAmount": -+item.PatientPaymentAmount,
                            "PatientAmount": -+item.PatientPaymentAmount,
                            "InsuranceAmount": 0,
                            "ReferenceNumber": $scope.PatientPaymentObj.ReferenceNumber,
                            "TransactionTypeId": 26,
                            "TransactionType": " Payment Check",
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
                            "PatientDepositId": $scope.PatientPaymentObj.PatientDepositId,
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
                        "TotalPaymentAmount": Aitem.TotalPaymentAmount || 0,
                        "TotalAdjustmentAmount": Aitem.TotalAdjustmentAmount || 0,
                        "TotalAllowedAmount": Aitem.TotalAllowedAmount || 0,
                        "TotalBalance": Aitem.TotalBalance || 0,
                        "TotalChargeAmount": Aitem.TotalClaimAmount || 0,
                        "ClaimPaymentAmount": Aitem.TotalPatientPayment || 0,
                        "TotalClaimAmount": Aitem.TotalClaimAmount || 0,
                        "TotalCoInsuranceAmount": Aitem.TotalCoInsuranceAmount || 0,
                        "TotalCopayAmount": Aitem.TotalCopayAmount || 0,
                        "TotalDeductibleAmount": Aitem.TotalDeductibleAmount || 0,
                        "TotalInsuranceBalance": Aitem.TotalInsuranceBalance || 0,
                        "TotalInsurancePayment": Aitem.TotalInsurancePayment || 0,
                        "TotalPatientBalance": Aitem.TotalPatientBalance || 0,
                        "TotalPatientPayment": Aitem.TotalPatientPayment || 0,
                        "TotalPaymentAmount": Aitem.TotalPaymentAmount || 0,
                        "TotalWriteOffAmount": Aitem.TotalWriteOffAmount || 0,
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
        if ($scope.PatientPaymentObj.IsPatientDeposit) {

            DepositAmount = $scope.PatientPaymentObj.DepositAmount;
            UnBilledAmount = $scope.PatientPaymentObj.UnBilledAmount;
            EOBAppliedAmount = ($scope.PatientPaymentObj.BilledAmount);
            //UnAppliedAmount = (DepositAmount - $scope.PatientPaymentObj.BilledAmount);
            UnAppliedAmount = (UnBilledAmount - $scope.PatientPaymentObj.BilledAmount);

        } else {
            DepositAmount = $scope.PatientPaymentObj.UnBilledAmount;
            EOBUnAppliedAmount = (DepositAmount - $scope.PatientPaymentObj.BilledAmount);
            EOBAppliedAmount = ($scope.PatientPaymentObj.BilledAmount);
        }
        $scope.PatientPaymentObj.PatientDepositPaymodeList.forEach(function (item) {
            item.PatientDepositPaymodeListId = 0;
            //item.DepositAmount = $scope.TotalPatientPaymentBalance;
        });
        let obj = {
            "UserId": $scope.UserId,
            "OrganizationId": $scope.HospitalId,
            "PatientDepositId": $scope.PatientPaymentObj.PatientDepositId,
            "TotalPaymentAmount": DepositAmount,
            //"TotalUnAppliedAmount": (DepositAmount - $scope.PatientPaymentObj.BilledAmount),
            "TotalUnAppliedAmount": UnAppliedAmount,
            "TotalAppliedAmount": $scope.PatientPaymentObj.BilledAmount,
            "TotalEOBUnAppliedAmount": EOBUnAppliedAmount || 0,
            "TotalEOBAppliedAmount": EOBAppliedAmount || 0,
            "PaymentModeId": $scope.PatientPaymentObj.PaymentMethodId,
            "PaymentMode": $scope.PatientPaymentObj.PaymentMethod,
            "DepositTypeId": $scope.PatientPaymentObj.DepositTypeId,
            "DepositTypeName": $scope.PatientPaymentObj.DepositTypeName,
            "DepositDate": $scope.PatientPaymentObj.DepositDate,
            "PostingDate": $scope.PatientPaymentObj.PostingDate,
            "ReceiptNo": $scope.PatientPaymentObj.ReceiptNo,
            "Notes": $scope.PatientPaymentObj.Notes,
            "PatientId": $scope.PatientPaymentObj.PatientId,
            "EOBId": $scope.PatientPaymentObj.EOBId,
            "EOBClaims": EOBClaims || [],
            "PostingType": "Patient Payment",
            "PostingTypeId": 3,
            "EOBTypeId": 2,
            "EOBType": "Patient Payment",
            "BillingProviderId": $scope.PatientPaymentObj.BillingProviderId,        // new params
            "OrganizationFacilityId": $scope.PatientPaymentObj.OrganizationFacilityId,
            "FacilityName": $scope.PatientPaymentObj.FacilityName,
            "PatientDepositPaymodeList": $scope.PatientPaymentObj.PatientDepositPaymodeList || []
        }
        console.log(JSON.stringify(obj))

        eHnoteInsuranceService.AddUpdatePatientPayment(obj).then(function (resp) {
            console.log(resp);
            if (resp.data.Status === "Success") {
                $scope.IsShowPatietnPaymentPopup = false;
                $scope.getPatientDepositAmountById();
                $scope.GetPatientTotalRevenueBalance();
            } else {
                alertify.error(resp.data.Message);
            }
        });
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

    $scope.changePaymentType = function (Id, Paymentlist) {
        var templist = $filter("filter")(Paymentlist, { "PaymentModeId": Id }, true) || [];
        if (templist.length > 0) {
            $scope.PatientPaymentObj.PaymentMethod = templist[0].PaymentModeName || "";
        }
    }

    $scope.changeAdjustment = function (typeid, mainitem) {
        var filterArray = $filter("filter")($scope.WriteOffReasons, { "OrganizationWriteOffReasonId": typeid }, true) || [];
        if (filterArray.length > 0) {
            mainitem.AdjustmentReasonCode = filterArray[0].ReasonDescription;
        }
    }

    /* Payer & Biller Summary*/

    $scope.GetPayorBillerSummaryBalance = function () {

        var Obj = {
            "PatientId": $scope.mainPatientProfileObj.PatientId,
            "OrganizationId": $scope.HospitalId,
        }
        eHnoteInsuranceService.GetPayorBillerSummaryBalance(Obj).then(function (resp) {
            console.log(resp);

            $scope.ClaimSummaryBalance = [];
            $scope.PayorSummaryBlance = [];
            $scope.Payortotal = {
                "AdjCollection": 0,
                "Between0to30Days": 0,
                "Between30to60Days": 0,
                "Between60to90Days": 0,
                "Between90to120Days": 0,
                "Morethen120days": 0,
                "PayorName": "",
                "adjBadDebt": 0,

            }
            $scope.claimtotal = {
                "TotalAdjustmentAmount": 0,
                "TotalClaimAmount": 0,
                "TotalCount": 0,
                "TotalPaid": 0,
                "UnallocatedAmount": 0

            }

            if (resp.data.status === "Success") {
                $scope.ClaimSummaryBalance = resp.data.ClaimSummaryBalance || [];
                $scope.PayorSummaryBlance = resp.data.PayorBlanceSummary || [];

                angular.forEach($scope.PayorSummaryBlance, function (item) {
                    $scope.Payortotal.AdjCollection += item.AdjCollection;
                    $scope.Payortotal.Between0to30Days += item.Between0to30Days;
                    $scope.Payortotal.Between30to60Days += item.Between30to60Days;
                    $scope.Payortotal.Between60to90Days += item.Between60to90Days;
                    $scope.Payortotal.Between90to120Days += item.Between90to120Days;
                    $scope.Payortotal.Morethen120days += item.Morethen120days;
                    $scope.Payortotal.adjBadDebt += item.adjBadDebt;
                });

                angular.forEach($scope.ClaimSummaryBalance, function (item) {
                    $scope.claimtotal.TotalAdjustmentAmount += item.TotalAdjustmentAmount;
                    $scope.claimtotal.TotalClaimAmount += item.TotalClaimAmount;
                    $scope.claimtotal.TotalPaid += item.TotalPaid;
                    $scope.claimtotal.UnallocatedAmount += item.UnallocatedAmount;
                    $scope.claimtotal.TotalCount += item.ClaimCnt;

                });

            }
        }, function (error) {
          
            console.log(error);
        });

    }





    /* Notes */

    $scope.AddNotesDetailsData = function (item) {
        item = item || '';
        $scope.SummaryNotesData = [];
        var Obj = {
            "PatientClaimId": item.PatientClaimId
        }
        item.PatientClaimId = item.PatientClaimId || null;
        eHnoteInsuranceService.GetPatientClaimNotes(item.PatientClaimId, onsuccess, onerror);
        function onsuccess(resp) {
            if (resp.data.rows.length > 0) {

                $scope.SummaryNotesData = resp.data.rows;

            }
        }
        function onerror(err) {
            console.log(err);
        }
    }



    /*Claims History*/

    $scope.PatientClaimId = null;
    $scope.ParticularPatientClaimDetails = null;

    $scope.PatientClaimDetailslist = function (pitem) {
        $scope.ClaimSubTabs = 1;
        pitem = pitem || null;
        $scope.PatientClaimId = pitem.PatientClaimId;
        $scope.ParticularPatientClaimDetails = angular.copy(pitem);
        $scope.GetPatientClaimDetailsById(pitem);
        $scope.AddNotesDetailsData(pitem);
    }
    

    $scope.ClaimtabChanges = 2;
    $scope.ClaimHistorySubtabs = function (claimsubtab) {
        $scope.ClaimtabChanges = claimsubtab;
    }

    $scope.ClaimSubTabs = 1;
    $scope.ChangesClaimHistoryTabs = function (item, tabchange) {
        item = item || '';
        $scope.ClaimSubTabs = tabchange;

        if ($scope.ClaimSubTabs == 3) {
            $scope.ClaimTransmissionHistory(item);
        }
        else if ($scope.ClaimSubTabs == 4) {
            $scope.getClaimEventLogList(item);
        }
    }

    $scope.ClaimTransmissionHistory = function (item) {
            item.TransmissionHistoryList = [];
            let param = {
                "PatientClaimId": item.PatientClaimId || 0,
            }
            eHnoteInsuranceService.GetPatientClaimTransmitHistory(param).then(function (resp) {
                if (resp.data.status == "Success") {
                    item.TransmissionHistoryList = resp.data.rows || [];
                } else {
                    alertify.error(resp.data.Message);
                }
            });
       
    }

    $scope.getClaimEventLogList = function (item) {
        $scope.claimEvenLogArray = [];
        var params = {
            "PatientClaimId": item.PatientClaimId,
            "PatientId": $scope.mainPatientProfileObj.PatientId
        }
        const validStatusIds = [16, 17, 18, 19, 20, 21, 22, 23];
        eHnoteInsuranceService.GetPatientClaimEventLogDetails(params).then(function (resp) {
            console.log(JSON.stringify(resp));
            if (resp.data.status == "Success") {
                if (resp.data.rows.length > 0) {
                    //$scope.claimEvenLogArray = resp.data.rows || [];
                    $scope.claimEvenLogArray = (resp.data.rows || []).map(item => {

                        item.showCheckNumberLink =
                            item.EraId &&
                            item.CheckNumber &&
                            validStatusIds.includes(item.EventClaimStatusId);

                        return item;
                    });
                }
            } else {
                alertify.error(resp.data.Message);
            }
        }, function (err) {

        });
    }
    $scope.downloadEDIFile = function (textToSend) {
        eHnotePatientDataService.CreateEdiTextPdf(textToSend).then(function (response) {
            const fileUrl = response.data;
            fetch(fileUrl)
                .then(res => res.blob())
                .then(blob => {
                    const blobUrl = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = blobUrl;

                    const filename = ($scope.EdiItemData?.PatientFullName || 'Edi') + '_' +
                        ($scope.EdiItemData?.PatientClaimNumber || '837') + '.837'; // ⬅️ Use .837

                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(blobUrl);
                })
                .catch(err => {
                    alertify.error("Failed to download .837 file.");
                    console.error(err);
                });

        }, function (error) {
            alertify.error("Failed to generate .837 file.");
            console.error(error);
        });
    };


    $scope.EDIFiledownload = function (formattedEdi) {

        if (!formattedEdi) {
            alertify.error("No EDI data available");
            return;
        }

        // 🔥 Convert formatted EDI back to RAW
        const rawEdi = formattedEdi.replace(/\n/g, '');

        eHnotePatientDataService.CreateEdiFileDownloadTextPdf(rawEdi)
            .then(function (response) {
                const fileUrl = response.data;

                fetch(fileUrl)
                    .then(res => res.blob())
                    .then(blob => {
                        const blobUrl = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = blobUrl;

                        const filename =
                            ($scope.EdiItemData?.PatientFullName || 'EDI') + '_' +
                            ($scope.EdiItemData?.PatientClaimNumber || '837') + '.837';

                        a.download = filename;

                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(blobUrl);
                    });
            })
            .catch(function (error) {
                alertify.error("Failed to generate .837 file.");
                console.error(error);
            });
    };



    $scope.openClaimLifeCyclePopup = function (item) {

        $scope.EdiClaimDetails = item;
        if ($scope.EdiClaimDetails.TransactionType == "837") {
            if (!$scope.EdiClaimDetails.FileS3URL || $scope.EdiClaimDetails.FileS3URL === "") {
                alertify.error("There is no Edi for this claim");
            }
            else {
                $scope.mInstanceAdd = $uibModal.open({
                    "templateUrl": "EdiPreview.html",
                    "size": "md",
                    "keyboard": false,
                    "windowClass": "modal__ninety--",
                    "scope": $scope,

                    "resolve": {
                        /*  "EdiClaimDetails": function () { return $scope.EdiClaimDetails.FileS3URL; },*/
                        "EdiClaimDetails": function () { return $scope.EdiClaimDetails; },
                    },
                    "http": $http,
                    "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientDataService, EdiClaimDetails, $http) {

                        $scope.uibclose = function () {
                            $uibModalInstance.dismiss("cancel");
                        };

                        //$scope.Edis3UrlData = EdiClaimDetails;

                        //$scope.getTrustedUrl = function (url) {
                        //    var modifiedUrl = url + "#pagemode=none&zoom=52";
                        //    return $sce.trustAsResourceUrl(modifiedUrl);
                        //};
                        ////if ($scope.Edis3UrlData) {

                        ////    loadFileContent($scope.Edis3UrlData);
                        ////}

                        //$scope.downloadEDIFile = function (textToSend) {
                        //    eHnotePatientDataService.CreateEdiTextPdf(textToSend).then(function (response) {
                        //        const fileUrl = response.data;
                        //        fetch(fileUrl)
                        //            .then(res => res.blob())
                        //            .then(blob => {
                        //                const blobUrl = window.URL.createObjectURL(blob);
                        //                const a = document.createElement('a');
                        //                a.href = blobUrl;

                        //                const filename = ($scope.EdiItemData?.PatientFullName || 'Edi') + '_' +
                        //                    ($scope.EdiItemData?.PatientClaimNumber || '837') + '.837'; // ⬅️ Use .837

                        //                a.download = filename;
                        //                document.body.appendChild(a);
                        //                a.click();
                        //                document.body.removeChild(a);
                        //                window.URL.revokeObjectURL(blobUrl);
                        //            })
                        //            .catch(err => {
                        //                alertify.error("Failed to download .837 file.");
                        //                console.error(err);
                        //            });

                        //    }, function (error) {
                        //        alertify.error("Failed to generate .837 file.");
                        //        console.error(error);
                        //    });
                        //};

                        //function loadFileContent(edis3Url) {
                        //    if (edis3Url) {

                        //        $http.get(edis3Url)
                        //            .then(function (response) {

                        //                $scope.fileContent = response.data;
                        //                $scope.EdiANSIStringview = $scope.fileContent || '';
                        //            });
                        //    } else {
                        //        $scope.fileContent = "";
                        //    }
                        //}

                        $scope.EdiANSIStringview = '';

                        // Formatter
                        function formatEdiString(ediString) {
                            if (!ediString) return 'No EDI content available';
                            return ediString.replace(/~/g, '~\n');
                        }

                        // ✅ DIRECTLY USE BACKEND VALUE
                        if (EdiClaimDetails.EdiANSIString) {
                            $scope.EdiANSIStringview = formatEdiString(
                                EdiClaimDetails.EdiANSIString
                            );
                        } else {
                            $scope.EdiANSIStringview = 'No EDI content available';
                        }

                        $scope.EDIFiledownload = function (formattedEdi) {

                            if (!formattedEdi) {
                                alertify.error("No EDI data available");
                                return;
                            }

                            // 🔥 Convert formatted EDI back to RAW
                            const rawEdi = formattedEdi.replace(/\n/g, '');

                            eHnotePatientDataService.CreateEdiFileDownloadTextPdf(rawEdi)
                                .then(function (response) {
                                    const fileUrl = response.data;

                                    fetch(fileUrl)
                                        .then(res => res.blob())
                                        .then(blob => {
                                            const blobUrl = window.URL.createObjectURL(blob);
                                            const a = document.createElement('a');
                                            a.href = blobUrl;

                                            const filename =
                                                ($scope.EdiItemData?.PatientFullName || 'EDI') + '_' +
                                                ($scope.EdiItemData?.PatientClaimNumber || '837') + '.837';

                                            a.download = filename;

                                            document.body.appendChild(a);
                                            a.click();
                                            document.body.removeChild(a);
                                            window.URL.revokeObjectURL(blobUrl);
                                        });
                                })
                                .catch(function (error) {
                                    alertify.error("Failed to generate .837 file.");
                                    console.error(error);
                                });
                        };


                    }


                });

                $scope.mInstanceAdd.result.then(function (response) {
                }, function () { });
            }


        }
        else if ($scope.EdiClaimDetails.TransactionType == "999") {
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "999Acknoledgement.html",
                "size": "lg",
                "backdrop": "static",
                "keyboard": false,
                "scope": $scope,
                "windowClass": " modal__sixty--",
                "controller": function ($scope, $uibModal, $uibModalInstance, eHnoteInsuranceService) {
                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };

                    $scope.Claim999AcknoledgementList = [];

                    $scope.Get999AcknowledgementsRespons = function () {
                        let obj = {
                            'PatientClaimId': item.PatientClaimId || '',
                            'TransactionId': item.TransactionSetId || '',
                        }
                        eHnoteInsuranceService.Get999AcknowledgementsRespons(obj).then(function (resp) {
                            if (resp.data.Status == 'Success') {
                                $scope.Claim999AcknoledgementList = resp.data.rows || [];
                            }
                        }, function (error) {
                            console.log(error);
                        });
                    }
                    $scope.Get999AcknowledgementsRespons();
                }
            });
        }
        else {
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "claimAcknoledgement.html",
                "size": "lg",
                "backdrop": "static",
                "keyboard": false,
                "scope": $scope,
                "windowClass": "  offcanves-right",
                "controller": function ($scope, $uibModal, $uibModalInstance, eHnoteInsuranceService) {
                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };

                    $scope.ClaimAcknoledgementList = [];

                    $scope.Get277AcknowledgementsRespons = function () {
                        let obj = {
                            'PatientClaimId': item.PatientClaimId || '',
                            'TransactionId': item.TransactionId || '',
                        }
                        eHnoteInsuranceService.Get277AcknowledgementsRespons(obj).then(function (resp) {
                            if (resp.data.Status == 'Success') {
                                $scope.ClaimAcknoledgementList = resp.data.rows || [];
                            }
                        }, function (error) {
                            console.log(error);
                        });
                    }
                    $scope.Get277AcknowledgementsRespons();
                    //function formatEdiString(ediString) {
                    //    if (!ediString) return 'No EDI content available';
                    //    return ediString.replace(/~/g, '~\n');
                    //}

                    //// ✅ DIRECTLY USE BACKEND VALUE
                    //if ($scope.EdiClaimDetails.EdiANSIString) {
                    //    $scope.EdiANSIStringview = formatEdiString(
                    //        $scope.EdiClaimDetails.EdiANSIString
                    //    );
                    //} else {
                    //    $scope.EdiANSIStringview = 'No EDI content available';
                    //}

                    //$scope.EDIFiledownload = function (formattedEdi) {

                    //    if (!formattedEdi) {
                    //        alertify.error("No EDI data available");
                    //        return;
                    //    }

                    //    // 🔥 Convert formatted EDI back to RAW
                    //    const rawEdi = formattedEdi.replace(/\n/g, '');

                    //    eHnotePatientDataService.CreateEdiFileDownloadTextPdf(rawEdi)
                    //        .then(function (response) {
                    //            const fileUrl = response.data;

                    //            fetch(fileUrl)
                    //                .then(res => res.blob())
                    //                .then(blob => {
                    //                    const blobUrl = window.URL.createObjectURL(blob);
                    //                    const a = document.createElement('a');
                    //                    a.href = blobUrl;

                    //                    const filename =
                    //                        ($scope.EdiItemData?.PatientFullName || 'EDI') + '_' +
                    //                        ($scope.EdiItemData?.PatientClaimNumber || '837') + '.837';

                    //                    a.download = filename;

                    //                    document.body.appendChild(a);
                    //                    a.click();
                    //                    document.body.removeChild(a);
                    //                    window.URL.revokeObjectURL(blobUrl);
                    //                });
                    //        })
                    //        .catch(function (error) {
                    //            alertify.error("Failed to generate .837 file.");
                    //            console.error(error);
                    //        });
                    //};
                }
            });
        }
    }
    $scope.openClaimLifeCyclePopup1 = function (item) {
        
        $scope.EdiClaimDetails = item;
        if ($scope.EdiClaimDetails.TransactionType == "837") {
            if (!$scope.EdiClaimDetails.FileS3URL || $scope.EdiClaimDetails.FileS3URL === "") {
                alertify.error("There is no Edi for this claim");
            }
            else {
                $scope.mInstanceAdd = $uibModal.open({
                    "templateUrl": "EdiPreview.html",
                    "size": "md",
                    "keyboard": false,
                    "windowClass": "modal__ninety--  ",
                    "scope": $scope,

                    "resolve": {
                        "EdiClaimDetails": function () { return $scope.EdiClaimDetails.FileS3URL; },
                    },
                    "http": $http,
                    "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientDataService, EdiClaimDetails, $http) {

                        $scope.uibclose = function () {
                            $uibModalInstance.close("cancel");
                        };
                        
                        $scope.Edis3UrlData = EdiClaimDetails;
                        if ($scope.Edis3UrlData) {

                            loadFileContent($scope.Edis3UrlData);
                        }
                        function loadFileContent(edis3Url) {
                            if (edis3Url) {
                                
                                $http.get(edis3Url)
                                    .then(function (response) {
                                        
                                        $scope.fileContent = response.data;
                                        $scope.EdiANSIStringview = $scope.fileContent || '';
                                    });
                            } else {
                                $scope.fileContent = "";
                            }
                        }
                    }


                });

                $scope.mInstanceAdd.result.then(function (response) {
                }, function () { });
            }


        }
        else {
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "claimAcknoledgement.html",
                "size": "lg",
                "backdrop": "static",
                "keyboard": false,
                "scope": $scope,
                "windowClass": "  offcanves-right",
                "controller": function ($scope, $uibModal, $uibModalInstance, eHnoteInsuranceService) {
                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };

                    $scope.ClaimAcknoledgementList = [];

                    $scope.Get277AcknowledgementsRespons = function () {
                        let obj = {
                            'PatientClaimId': item.PatientClaimId || '',
                            'TransactionId': item.TransactionId || '',
                        }
                        eHnoteInsuranceService.Get277AcknowledgementsRespons(obj).then(function (resp) {
                            if (resp.data.Status == 'Success') {
                                $scope.ClaimAcknoledgementList = resp.data.rows || [];
                            }
                        }, function (error) {
                            console.log(error);
                        });
                    }
                    $scope.Get277AcknowledgementsRespons();
                }
            });
            // alertify.error("There is no edi for the claim");
        }
    }


    $scope.ClaimDetailsList = [];
    $scope.GetPatientClaimDetailsById = function (obj) {
        obj = obj || null;
        var patientClaimId = 0;
        if (obj != null) {
            patientClaimId = obj.PatientClaimId || 0;
        }

        var params = {
            "PatientId": $scope.mainPatientProfileObj.PatientId,
            "PatientClaimId": patientClaimId
        };
        eHnotePatientDataService.GetPatientClaimDetailsById(params).then(function (resp) {
            console.log(JSON.stringify(resp));


            if (resp.data.status == "Success") {
               
                resp.data.rows = resp.data.rows || [];
                if (resp.data.rows.length > 0) {
                    $scope.ClaimDetailsList = resp.data.rows;
                    $scope.AppoinmentInsurance = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails || [];
                    $scope.PatientClaimLineItems = $scope.ClaimDetailsList[0].PatientClaimLineItems || [];
                    $scope.AppoinmentInsuranceList = $scope.AppoinmentInsurance[0];
                    if ($scope.AppoinmentInsurance.length > 0) {
                        angular.forEach($scope.AppoinmentInsurance, function (item) {

                            $scope.AppoinmentInsuranceList.InsuranceExpiryDate = item.InsuranceExpiryDate || null;
                            if ($scope.AppoinmentInsuranceList.InsuranceExpiryDate != null) {

                                var expiryDate = new Date(item.InsuranceExpiryDate);
                                var currentDate = new Date();
                                var timeDifference = expiryDate - currentDate;
                                var dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

                                if (item.IdentifierId === 1) {
                                    $scope.daysUntilExpiry = dayDifference;
                                } else {
                                    $scope.secondarydaysUntilExpiry = dayDifference;
                                }

                                if (currentDate < expiryDate) {
                                    $scope.daysUntilExpiry = dayDifference;
                                    item.daysUntilExpiry = dayDifference;
                                } else {
                                    $scope.daysUntilExpiry = "-" + Math.abs(dayDifference);
                                    item.daysUntilExpiry = "-" + Math.abs(dayDifference);
                                }
                            }
                        });
                    }

                    $scope.PatientClaimLineItems.forEach(function (citem) {
                        citem.showTransactionContent = false;
                    });
                }

            } else {
                alertify.error(resp.data.Message);
            }
        }, function (error) {

        });
    }

    $scope.DeleteClaimNotes = function (item,id,type) {
        item = item || null;
        item.NoteTypeId = id;
        item.NotesType = type;
        var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to delete?", function () {

            var Obj = {
                "PatientNoteId": item.PatientNoteId,
                "UserId": $scope.UserId,
                "OrganizationId": $scope.HospitalId,
                "PatientClaimId": item.PatientClaimId,
                "NoteTypeId": item.NoteTypeId,
                "NotesType": item.NotesType,
                "Notes": item.Notes,
                "FollowUpTypeId": item.FollowUpTypeId,
                "FollowUpType": item.FollowUpType,
                "FollowUpCategoryId": item.FollowUpCategoryId,
                "FollowUpCategory": item.FollowUpCategory,
                "FollowUpStatusId": item.FollowUpStatusId,
                "FollowUpStatus": item.FollowUpStatus,
                "ClaimStatusId": item.ClaimStatusId,
                "ClaimStatus": item.ClaimStatus,
                "AssignedToUserId": item.AssignedToUserId,
                "FollowUpDate": item.FollowUpDate,
                "DeleteInd": "Y",
            }

            eHnoteInsuranceService.AddUpdatePatientClaimNotes(Obj, onsuccess, onerror);
            function onsuccess(resp) {
                console.log(resp.data.Status);

                if (resp.data.Status == "Success") {
                    $scope.AddNotesDetailsData(item);
                    alertify.success("Deleted successfully");
                }
            }
            function onerror(err) {
                console.log(err);
            }
        },
            function () {
                $scope.$digest();
                r = "You pressed Cancel!";
            });
    }

    $scope.ShowNotesScreen = function (item, id, type) {
        $scope.ClaimDetailsList = $scope.ClaimDetailsList || [];
        if ($scope.ClaimDetailsList.length == 0) {
            alertify.error("No Claim is Available");
            return false;
        }

        item = item || null;

        id = id || 1;
        type = type || '';
        $scope.NotesType = {
            'Id':id,
            'Type': type,
        }

        $scope.claimScreenParentObj.PatientClaimId = $scope.claimScreenParentObj.PatientClaimId || 0;
        $scope.filteredClaims = '';
        if ($scope.claimScreenParentObj.PatientClaimId != 0) {
            $scope.CurrentfilteredClaim = $scope.PatientClaimsList.filter(function (claim) {
                return claim.PatientClaimId === $scope.claimScreenParentObj.PatientClaimId;
            });
            $scope.filteredClaims = $scope.CurrentfilteredClaim[0];
        } else {
            $scope.filteredClaims = $scope.PatientClaimsList[0]
        }
        
        $scope.mInstanceAdd = $uibModal.open({

            "templateUrl": "UsClaimNotes.html",
            "size": "lg",
            "keyboard": false,
            "windowClass": " ",
            "resolve": {
                "MasterClaimStatusList": function () { return $scope.MasterClaimStatusList; },
                "mainPatientProfileObj": function () { return $scope.mainPatientProfileObj; },
                "PatientClaimsList": function () { return $scope.filteredClaims; },
                "UserId": function () { return $scope.UserId; },
                "HospitalId": function () { return $scope.HospitalId; },
                "item": function () { return item; },
                "PatientClaimId": function () { return $scope.PatientClaimId; },
                "NotesType": function () { return $scope.NotesType; },
            },
            "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientDataService, MasterClaimStatusList, mainPatientProfileObj, eHnoteInsuranceService, PatientClaimsList, UserId, item, NotesType, HospitalId, PatientClaimId) {
                $scope.mainPatientProfileObj = mainPatientProfileObj || [];
                $scope.PatientClaimsList = PatientClaimsList;
                $scope.PatientClaimId = PatientClaimId;
                $scope.UserId = UserId;
                $scope.HospitalId = HospitalId;
                $scope.MasterClaimStatusList = MasterClaimStatusList || [];
                $scope.AllUsersList = $scope.mainPatientProfileObj.AllUsersList || [];

            

                $scope.GetNotesDetails = function () {
                    var Obj = {
                        "PatientNoteId": 0,
                        "UserId": $scope.UserId,
                        "PatientClaimId": 0,
                        "NoteTypeId": NotesType.Id,
                        "NotesType": NotesType.Type,
                        "Notes": "",
                        "FollowUpTypeId": null,
                        "FollowUpType": "",
                        "FollowUpCategoryId": null,
                        "FollowUpCategory": "",
                        "FollowUpStatusId": 0,
                        "FollowUpStatus": "",
                        "ClaimStatusId": 25,
                        "ClaimStatus": "Tasked Claims",
                        "AssignedToUserId": 0,
                        "UserName": "",
                        "FollowUpDate": "",
                        "FollowUpCurrentDate": $filter('date')(new Date(), "MM-dd-yyyy") || "",
                        "DeleteInd": false
                    }
                    return Obj;
                }

                $scope.EditNotesDetails = $scope.GetNotesDetails();

                $scope.uibclose = function () {
                    $uibModalInstance.dismiss("cancel");
                };

            $scope.ChangeNotesData = function () {
                if ($scope.EditNotesDetails.NoteTypeId == 1) {
                    $scope.EditNotesDetails.NotesType = "General";
                    $scope.EditNotesDetails.Notes = "";
                }
                if ($scope.EditNotesDetails.NoteTypeId == 2) {
                    $scope.EditNotesDetails.NotesType = "Follow Up";
                    $scope.EditNotesDetails.Notes = "";
                }
            }

                $scope.IsDisabledGeneralNotes = false;
                $scope.IsDisabledFollowUpNotes = false;

                $scope.ChangesFollowupStatus = function () {

                    if ($scope.EditNotesDetails.FollowUpStatus == 'Claim cleared') {
                        $scope.EditNotesDetails.FollowUpStatusId = 1;
                    }
                    if ($scope.EditNotesDetails.FollowUpStatus == 'Claim processed') {
                        $scope.EditNotesDetails.FollowUpStatusId = 2;
                    }
                    if ($scope.EditNotesDetails.FollowUpStatus == 'Clarification needed') {
                        $scope.EditNotesDetails.FollowUpStatusId = 3;
                    }
                    if ($scope.EditNotesDetails.FollowUpStatus == 'Coding review') {
                        $scope.EditNotesDetails.FollowUpStatusId = 4;
                    }
                    if ($scope.EditNotesDetails.FollowUpStatus == 'Coverage issue') {
                        $scope.EditNotesDetails.FollowUpStatusId = 5;
                    }
                    if ($scope.EditNotesDetails.FollowUpStatus == 'Denial') {
                        $scope.EditNotesDetails.FollowUpStatusId = 6;
                    }
                    if ($scope.EditNotesDetails.FollowUpStatus == 'Need authorization') {
                        $scope.EditNotesDetails.FollowUpStatusId = 7;
                    }
                    if ($scope.EditNotesDetails.FollowUpStatus == 'Not covered') {
                        $scope.EditNotesDetails.FollowUpStatusId = 8;
                    }
                    if ($scope.EditNotesDetails.FollowUpStatus == 'Pending payment') {
                        $scope.EditNotesDetails.FollowUpStatusId = 9;
                    }
                    if ($scope.EditNotesDetails.FollowUpStatus == 'Pending posting') {
                        $scope.EditNotesDetails.FollowUpStatusId = 10;
                    }
                    if ($scope.EditNotesDetails.FollowUpStatus == 'Pending review') {
                        $scope.EditNotesDetails.FollowUpStatusId = 11;
                    }
                    if ($scope.EditNotesDetails.FollowUpStatus == 'Rejected') {
                        $scope.EditNotesDetails.FollowUpStatusId = 12;
                    }
                    if ($scope.EditNotesDetails.FollowUpStatus == 'Sent back to reprocess') {
                        $scope.EditNotesDetails.FollowUpStatusId = 13;
                    }
                    if ($scope.EditNotesDetails.FollowUpStatus == 'Insurance expired') {
                        $scope.EditNotesDetails.FollowUpStatusId = 14;
                    }
                    if ($scope.EditNotesDetails.FollowUpStatus == 'Demographics info rejected') {
                        $scope.EditNotesDetails.FollowUpStatusId = 15;
                    }

                }

                $scope.ChangeAllUserlist = function (item) {
                    $scope.EditNotesDetails.AssignedToUserId = item.DoctorID;
                    $scope.EditNotesDetails.UserName = item.FullName;
                    /*$scope.searchtxtb.txt1 = '';*/
                }

                $scope.ChangeClaimstatus = function (List, Id) {
                    var obj = $filter("filter")(List, { "ClaimStatusId": Id }, true)[0];
                    $scope.EditNotesDetails.ClaimStatusId = obj.ClaimStatusId;
                    $scope.EditNotesDetails.ClaimStatus = obj.ClaimStatusName;
                }


                $scope.SaveNotesDetailsData = function () {

                    if ($scope.EditNotesDetails.NoteTypeId == 1 && $scope.EditNotesDetails.Notes == '' || $scope.EditNotesDetails.NoteTypeId == 2 && $scope.EditNotesDetails.Notes == '') {
                        alertify.error("Please Enter Notes.");
                        return false;
                    }
                    if ($scope.EditNotesDetails.NoteTypeId == 2 && $scope.EditNotesDetails.AssignedToUserId == 0) {
                        alertify.error("Please Enter Assign To.");
                        return false;
                    }
                    if ($scope.EditNotesDetails.NoteTypeId == 2 && $scope.EditNotesDetails.FollowUpDate == '') {
                        alertify.error("Please select Follow-Up Date.");
                        return false;
                    }
                    $scope.EditNotesDetails.PatientNoteId = $scope.EditNotesDetails.PatientNoteId;
                    $scope.EditNotesDetails.NoteTypeId = $scope.EditNotesDetails.NoteTypeId;
                    $scope.EditNotesDetails.NotesType = $scope.EditNotesDetails.NotesType;
                    $scope.EditNotesDetails.Notes = $scope.EditNotesDetails.Notes;
                    $scope.EditNotesDetails.FollowUpTypeId = $scope.EditNotesDetails.FollowUpTypeId;
                    $scope.EditNotesDetails.FollowUpType = $scope.EditNotesDetails.FollowUpType;
                    $scope.EditNotesDetails.FollowUpCategoryId = $scope.EditNotesDetails.FollowUpCategoryId;
                    $scope.EditNotesDetails.FollowUpCategory = $scope.EditNotesDetails.FollowUpCategory;
                    $scope.EditNotesDetails.FollowUpStatusId = $scope.EditNotesDetails.FollowUpStatusId;
                    $scope.EditNotesDetails.FollowUpStatus = $scope.EditNotesDetails.FollowUpStatus;
                    $scope.EditNotesDetails.ClaimStatusId = $scope.EditNotesDetails.ClaimStatusId;
                    $scope.EditNotesDetails.ClaimStatus = $scope.EditNotesDetails.ClaimStatus;
                    $scope.EditNotesDetails.AssignedToUserId = $scope.EditNotesDetails.AssignedToUserId;
                    $scope.EditNotesDetails.FollowUpDate = $scope.EditNotesDetails.FollowUpDate;

                    if ($scope.EditNotesDetails.FollowUpDate != "") {
                        $scope.EditNotesDetails.FollowUpDate = $filter('date')($scope.EditNotesDetails.FollowUpDate, 'MM-dd-yyyy');
                    }

                    if ($scope.EditNotesDetails.NoteTypeId != 1) {
                        $scope.IsDisabledGeneralNotes = false;
                    }

                    if ($scope.EditNotesDetails.NoteTypeId != 2) {
                        $scope.IsDisabledFollowUpNotes = false;
                    }


                    var Obj = {
                        "PatientNoteId": $scope.EditNotesDetails.PatientNoteId,
                        "UserId": $scope.UserId,
                        "OrganizationId": $scope.HospitalId,
                        "PatientId": $scope.mainPatientProfileObj.PatientId,
                        "PatientClaimId": $scope.PatientClaimId,
                        "NoteTypeId": $scope.EditNotesDetails.NoteTypeId,
                        "NotesType": $scope.EditNotesDetails.NotesType,
                        "Notes": $scope.EditNotesDetails.Notes,
                        "FollowUpTypeId": $scope.EditNotesDetails.FollowUpTypeId,
                        "FollowUpType": $scope.EditNotesDetails.FollowUpType,
                        "FollowUpCategoryId": $scope.EditNotesDetails.FollowUpCategoryId,
                        "FollowUpCategory": $scope.EditNotesDetails.FollowUpCategory,
                        "FollowUpStatusId": $scope.EditNotesDetails.FollowUpStatusId,
                        "FollowUpStatus": $scope.EditNotesDetails.FollowUpStatus,
                        "ClaimStatusId": $scope.EditNotesDetails.ClaimStatusId,
                        "ClaimStatus": $scope.EditNotesDetails.ClaimStatus,
                        "AssignedToUserId": $scope.EditNotesDetails.AssignedToUserId,
                        "FollowUpDate": $scope.EditNotesDetails.FollowUpDate,
                        "DeleteInd": "N",
                    }


                    eHnoteInsuranceService.AddUpdatePatientClaimNotes(Obj, onsuccess, onerror);
                    function onsuccess(resp) {
                        console.log(resp);
                        if (resp.data.Status === "Success") {
                            $scope.AddNotesDetailsData($scope.PatientClaimsList);
                            $scope.ClearNotesDetailsData();
                            $uibModalInstance.close("Success");
                        }
                    }
                    function onerror(err) {
                        console.log(err);
                    }
                }

                $scope.ClearNotesDetailsData = function () {

                    $scope.EditNotesDetails.PatientNoteId = 0;
                    $scope.EditNotesDetails.Notes = "";
                    $scope.EditNotesDetails.FollowUpStatusId = 0;
                    $scope.EditNotesDetails.FollowUpStatus = "";
                    $scope.EditNotesDetails.ClaimStatusId = 0;
                    $scope.EditNotesDetails.ClaimStatus = "";
                    $scope.EditNotesDetails.AssignedToUserId = '';
                    $scope.EditNotesDetails.UserName = '';
                    $scope.EditNotesDetails.FollowUpDate = "";
                    $scope.IsDisabledGeneralNotes = false;
                    $scope.IsDisabledFollowUpNotes = false;
                }

                $scope.AddNotesDetailsData = function (item) {
                    item = item || '';
                    $scope.SummaryNotesData = [];
                    var Obj = {
                        "PatientClaimId": item.PatientClaimId
                    }
                    item.PatientClaimId = item.PatientClaimId || null;
                    eHnoteInsuranceService.GetPatientClaimNotes(item.PatientClaimId, onsuccess, onerror);
                    function onsuccess(resp) {
                        if (resp.data.rows.length > 0) {

                            $scope.SummaryNotesData = resp.data.rows;

                        }
                    }
                    function onerror(err) {
                        console.log(err);
                    }
                }


                if (item != null ) {
                    $scope.EditNotesDetails.PatientNoteId = item.PatientNoteId;
                    $scope.EditNotesDetails.NoteTypeId = item.NoteTypeId;
                    $scope.EditNotesDetails.NotesType = item.NotesType;
                    $scope.EditNotesDetails.Notes = item.Notes;
                    $scope.EditNotesDetails.FollowUpTypeId = item.FollowUpTypeId;
                    $scope.EditNotesDetails.FollowUpType = item.FollowUpType;
                    $scope.EditNotesDetails.FollowUpCategoryId = item.FollowUpCategoryId;
                    $scope.EditNotesDetails.FollowUpCategory = item.FollowUpCategory;
                    $scope.EditNotesDetails.FollowUpStatusId = item.FollowUpStatusId;
                    $scope.EditNotesDetails.FollowUpStatus = item.FollowUpStatus;
                    $scope.EditNotesDetails.ClaimStatusId = item.ClaimStatusId;
                    $scope.EditNotesDetails.ClaimStatus = item.ClaimStatus;
                    $scope.EditNotesDetails.AssignedToUserId = item.AssignedToUserId;
                    $scope.EditNotesDetails.UserName = item.AssignedToUser;
                    $scope.EditNotesDetails.FollowUpDate = item.FollowUpDate;

                    if ($scope.EditNotesDetails.FollowUpDate != '') {
                        $scope.EditNotesDetails.FollowUpDate = $filter('date')($scope.EditNotesDetails.FollowUpDate, 'MM-dd-yyyy');
                    }

                    if ($scope.EditNotesDetails.NoteTypeId != 1) {
                        $scope.IsDisabledGeneralNotes = true;
                    }

                    if ($scope.EditNotesDetails.NoteTypeId != 2) {
                        $scope.IsDisabledFollowUpNotes = true;
                    }

                }

                


            }
        });
        $scope.mInstanceAdd.result.then(function (resp) {
            resp = resp || "";
            if (resp == "Success") {
                $scope.AddNotesDetailsData($scope.ParticularPatientClaimDetails);
            }
        }, function () { });

    }


    $scope.EditClaimNote = function (item,id,type) {
        $scope.ShowNotesScreen(item,id, type);
    }

    //$scope.filterPopover = function () {

    //};
    $scope.filterPopover = {
        templateUrl: 'filterPopoverTemplate.html',
        "windowClass": " "
    };


    /*Ledger*/

    $scope.PatientClaimLineItemsList = function (item, citem) {
        citem.showDetails = citem.showDetails || false;
        if (citem.showDetails == true) {
            return false;
        }
        angular.forEach($scope.PatientClaimsList, function (item) {
            angular.forEach(item.ClaimLineItems, function (ditem) {
                ditem.showDetails = false;
            });
        });

        $scope.PatientClaimTransactionsList = [];
        item.PatientClaimId = item.PatientClaimId || null;
        eHnoteInsuranceService.GetPatientClaimTransactions(item.PatientClaimId).then(function (resp) {
            if (resp.data.status === "Success") {
                if (resp.data.ClaimLineItems.length > 0) {
                    var templist = $filter("filter")(resp.data.ClaimLineItems, { "ClaimLineItemId": citem.ClaimLineItemId }, true) || [];
                    if (templist.length > 0) {
                        $scope.PatientClaimTransactionsList = templist[0].ClaimTransactions || [];
                    }
                }
            } else {
                alertify.error(resp.data.Message)
                return false;
            }
        });
    }

    $scope.SearchPatientClaimData = function () {
        $scope.PatientPaymentsArray = [];
        var Locationids = $scope.AllBranchesList
            .filter(pitem => pitem.IsChecked && pitem.ClinicId !== 0) // Exclude ClinicId === 0
            .map(pitem => pitem.ClinicId)
            .join(",");

        var claimslistobj = {
            "PatientId": $scope.mainPatientProfileObj.PatientId,
            "OrganizationId": $scope.HospitalId,
            "FromDate": $scope.SearchPatientClaimList.FromDate,
            "ToDate": $scope.SearchPatientClaimList.ToDate,
            "PatientClaimNumber": $scope.SearchPatientClaimList.PatientClaimNumber || '',
            "Locationids": Locationids || '',
            "PageSize": 50,
            "PageNumber": 1
        }
        eHnoteInsuranceService.GetPatientClaimsList(claimslistobj).then(function (resp) {
            if (resp.data.status === "Success") {
                if (resp.data.PatientClaims.length > 0) {
                    $scope.PatientClaimsList = angular.copy(resp.data.PatientClaims);
                    $scope.TotalPatientClaimsCount = resp.data.Count || 0;
                } else {
                    $scope.PatientClaimsList = [];
                }
                $scope.POSList = angular.copy(resp.data.POS) || [];
                $scope.POSList = $scope.POSList.filter(function (item) {
                    return item.PaymentStatusId !== 4;
                });
                if (resp.data.PatientPaymentsArray.length > 0) {
                    $scope.PatientPaymentsArray = angular.copy(resp.data.PatientPaymentsArray) || [];

                }

                if ($scope.PatientPaymentsArray.length > 0) {
                    angular.forEach($scope.PatientPaymentsArray, function (pitem) {

                        var claimMap = {};   // to track unique values
                        var uniqueClaims = [];

                        angular.forEach(pitem.TransactionDetails || [], function (citem) {
                            if (citem.PatientClaimNumber && !claimMap[citem.PatientClaimNumber]) {
                                claimMap[citem.PatientClaimNumber] = true;
                                uniqueClaims.push(citem.PatientClaimNumber);
                            }
                        });

                        pitem.PatientClaimNumbers = uniqueClaims.join(",");
                    });
                }


                $scope.SearchPatientClaimList = angular.copy($scope.getPatientClaimList());
                $scope.closePopover();

            }
        }, function (err) {

        });

    }

    $scope.RefreshFilters = function () {
        $scope.SearchPatientClaimList = angular.copy($scope.getPatientClaimList());
        if ($scope.AllBranchesList.length > 0) {
            $scope.AllBranchesList[0].IsChecked = true;
            $scope.ChangeApptBranch($scope.AllBranchesList[0], 1);
        }
        $scope.SearchPatientClaimData();
    }

    function getPOSObj() {
        var obj = {
           
            "InvoiceItems": [],
            "PosChargeAmount": 0,
            "PosDiscountAmount": 0,
            "PosPatientPaymentAmt": 0,
            "PosTotalNetAmount": 0,
            "TotalPaymentAmount":0,
            "PaymentMethods": [],
            "PosTotalptBalanceAmount": 0,
            "TotalAmountInWords": "",
            "TotalOutstandingBalnce": 0,
            "OutstandingAmountInWords":'',
            "POSIntNumber":0,
            "POSDecNumber":0,
            "IntegerAmtInWords":"",
            "DecimalAmtInWords":"",
            "TotalIntegerNumber":0,
            "TotalDecimalNumber":0,
            "TotalIntegerAmtInWords":"",
            "TotalDecimalAmtInWords":"",
            "ClaimsAmtIntNumber":0,
            "ClaimsAmtDecNumber":0,
            "ClaimsIntegerAmtInWords":"",
            "ClaimsDecimalAmtInWords":"",
        };
        return obj;
    };

    $scope.POSMainObj = getPOSObj();

    $scope.PatientDetails = $scope.mainPatientProfileObj.PatientDetails || [];

    $scope.ShowPatientClaimsPrint = function () {
        $scope.POSMainObj = getPOSObj();
        $scope.PatientClaimsDataList = [];
        $scope.PatientClaimsDataList = angular.copy($scope.PatientClaimsList) || [];

        $scope.PatientTotalBalance = 0;
        $scope.PatientBalAmountInWords = '';
        angular.forEach($scope.PatientClaimsDataList, function (pitem) {
            angular.forEach(pitem.ClaimLineItems, function (citem) {
                $scope.PatientTotalBalance += citem.PatientBalance
            });
        })

        //var ClaimsCostInWords = eHnotePrintService.ConvertNumberToWords($scope.PatientTotalBalance);
        //$scope.PatientBalAmountInWords = ClaimsCostInWords;

        var ClaimsIntegerNumber = Math.floor($scope.PatientTotalBalance);
        var ClaimsDecimalNumber = Math.round(($scope.PatientTotalBalance - ClaimsIntegerNumber) * 100);

        $scope.POSMainObj.ClaimsAmtIntNumber = ClaimsIntegerNumber;
        $scope.POSMainObj.ClaimsAmtDecNumber = ClaimsDecimalNumber;

        var ClaimIntegerCostInWords = eHnotePrintService.ConvertNumberToWords($scope.POSMainObj.ClaimsAmtIntNumber);
        $scope.POSMainObj.ClaimsIntegerAmtInWords = ClaimIntegerCostInWords;

        if ($scope.POSMainObj.ClaimsAmtDecNumber > 0) {
            var ClaimsDecimalCostInWords = eHnotePrintService.ConvertNumberToWords($scope.POSMainObj.ClaimsAmtDecNumber);
            $scope.POSMainObj.ClaimsDecimalAmtInWords = ClaimsDecimalCostInWords;
        }

       
        var mergedList = [];
        $scope.PosInvoices = [];
        $scope.POSDataList = [];
        $scope.HospitalAddressArray = $scope.HospitalAddressArray || {};

        var obj1 = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddressArray.ContactNo);
        $scope.HospitalAddressArray.ContactNo = obj1.UsFormatMobileNumber;

        var obj2 = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddressArray.MobileNo);
        $scope.HospitalAddressArray.MobileNo = obj2.UsFormatMobileNumber;

        $scope.PatientDetailsData = {};
        $scope.PatientDetailsData = $scope.mainPatientProfileObj.PatientDetailSummary || {};
        //$scope.PatientDetails = $scope.mainPatientProfileObj.PatientDetails || "";

        //if ($scope.PatientDetails=="") {
        //    $scope.PatientDetails = {
        //        "FullName": $scope.mainPatientProfileObj.PatientDetailSummary.FullName||"",
        //        "PatientDisplayId": $scope.mainPatientProfileObj.PatientDetailSummary.PatientDisplayID||"",
        //        "AgeInYears": $scope.mainPatientProfileObj.PatientDetailSummary.AgeInYears||"",
        //        "Sex": $scope.mainPatientProfileObj.PatientDetailSummary.Gender||"",
        //        "MobileNo": $scope.mainPatientProfileObj.PatientDetailSummary.ContactInfo.ContactNumber||"",
        //    }
        //}

        var obj3 = eHnoteUserDataService.UsMobileFormatChange($scope.PatientDetailsData.ContactInfo.MobileNumber);
        $scope.PatientDetailsData.ContactInfo.MobileNumber = obj3.UsFormatMobileNumber;
        if ($scope.PatientDetailsData.PatientAddress == undefined) {
            $scope.PostalAddress = $scope.PatientDetailsData.PostalAddress || {};
        } else {
            $scope.PostalAddress = $scope.PatientDetailsData.PatientAddress.PostalAddress || {};
        }
       
        $scope.POSDataList = angular.copy($scope.POSList) || [];
        angular.forEach($scope.POSDataList, function (pitem) {
            angular.forEach(pitem.PaymentMethods, function (item) {
                $scope.POSMainObj.TotalPaymentAmount += item.PaymentAmount
            })
        })
        angular.forEach($scope.POSDataList, function (Mitem) {
            $scope.PosInvoices = $scope.PosInvoices.concat(Mitem.InvoiceItems);
            angular.forEach(Mitem.InvoiceItems, function (item) {
            $scope.POSMainObj.PosChargeAmount += item.TotalChargeAmount || 0;
            $scope.POSMainObj.PosDiscountAmount += item.DiscountAmount || 0;
            $scope.POSMainObj.PosPatientPaymentAmt += item.PatientPaymentAmount || 0;
            $scope.POSMainObj.PosTotalNetAmount += item.TotalNetAmount || 0;
            $scope.POSMainObj.PosTotalptBalanceAmount += item.PatientBalanceAmount || 0;
            })
        })

        //var POSCostInWords = eHnotePrintService.ConvertNumberToWords($scope.POSMainObj.PosTotalptBalanceAmount);
        //$scope.POSMainObj.TotalAmountInWords = POSCostInWords;



        //var OutStandingCostInWords = eHnotePrintService.ConvertNumberToWords($scope.POSMainObj.TotalOutstandingBalnce);
        //$scope.POSMainObj.OutstandingAmountInWords = OutStandingCostInWords;

        var POSIntegerNumber = Math.floor($scope.POSMainObj.PosTotalptBalanceAmount);
        var POSDecimalNumber = Math.round(($scope.POSMainObj.PosTotalptBalanceAmount - POSIntegerNumber) * 100);

        $scope.POSMainObj.POSIntNumber = POSIntegerNumber;
        $scope.POSMainObj.POSDecNumber = POSDecimalNumber;

        var IntegerCostInWords = eHnotePrintService.ConvertNumberToWords($scope.POSMainObj.POSIntNumber);
        $scope.POSMainObj.IntegerAmtInWords = IntegerCostInWords;

        if ($scope.POSMainObj.POSDecNumber > 0) {
            var DecimalCostInWords = eHnotePrintService.ConvertNumberToWords($scope.POSMainObj.POSDecNumber);
            $scope.POSMainObj.DecimalAmtInWords = DecimalCostInWords;
        }


        $scope.POSMainObj.TotalOutstandingBalnce = $scope.POSMainObj.PosTotalptBalanceAmount + $scope.PatientTotalBalance || 0;

        var TotalOutStandingIntNumber = Math.floor($scope.POSMainObj.TotalOutstandingBalnce);
        var TotalOutStandingDecNumber = Math.round(($scope.POSMainObj.TotalOutstandingBalnce - TotalOutStandingIntNumber) * 100);

        $scope.POSMainObj.TotalIntegerNumber = TotalOutStandingIntNumber;
        $scope.POSMainObj.TotalDecimalNumber = TotalOutStandingDecNumber;

        var IntegerTotalCostWords = eHnotePrintService.ConvertNumberToWords($scope.POSMainObj.TotalIntegerNumber);
        $scope.POSMainObj.TotalIntegerAmtInWords = IntegerTotalCostWords;

        if ($scope.POSMainObj.TotalDecimalNumber > 0) {
            var DecimalTotalCostWords = eHnotePrintService.ConvertNumberToWords($scope.POSMainObj.TotalDecimalNumber);
            $scope.POSMainObj.TotalDecimalAmtInWords = DecimalTotalCostWords;
        }






        //angular.forEach($scope.PatientClaimsDataList, function (item) {
        //    item.TotalPatientPaymentAmount = 0;
        //    if (item.ClaimLineItems.length > 0) {
        //        angular.forEach(item.ClaimLineItems, function (pitem) {

        //            pitem.PatientandInsPaymentAmount = 0;
        //            pitem.PatientandInsPaymentAmount = parseInt(pitem.PatientPaymentAmount) + parseInt(pitem.InsurancePaymentAmount) || 0;

        //            pitem.TotalPatientClaimsAmount = 0;

        //            angular.forEach(pitem.ClaimLineItemTransactions, function (mitem) {
        //                if (mitem.TransactionTypeId === 24 || mitem.TransactionTypeId === 25 || mitem.TransactionTypeId === 26 || mitem.TransactionTypeId === 27 || mitem.TransactionTypeId === 32 || mitem.TransactionTypeId === 36 || mitem.TransactionTypeId === 40 || mitem.TransactionTypeId === 98 || mitem.TransactionTypeId === 99 || mitem.TransactionTypeId === 100) {
        //                    pitem.TotalPatientClaimsAmount += -(mitem.TransactionAmount) || 0;
        //                }
        //            });
        //            item.TotalPatientPaymentAmount += pitem.TotalPatientClaimsAmount || 0;

        //        })

        //    }

        //    if (mergedList.length > 0) {
        //        var templist = $filter("filter")(mergedList, { "PatientId": item.PatientId }, true) || [];
        //        if (templist.length > 0) {

        //            angular.forEach(mergedList, function (mitem) {
        //                if (mitem.PatientId === item.PatientId) {
        //                    mitem.ClaimLineItems.push(...item.ClaimLineItems);
        //                    mitem.TotalBalance += item.TotalBalance || 0;
        //                    mitem.TotalPatientBalance += item.TotalPatientBalance || 0;
        //                    mitem.PatientClaimNumber = item.PatientClaimNumber || '';
        //                    //if (mitem.PatientClaimNumber != '') {
        //                    //    if (!mitem.PatientClaimNumber.includes(item.PatientClaimNumber)) {
        //                    //        mitem.PatientClaimNumber += "," + item.PatientClaimNumber;
        //                    //    }
        //                    //}
        //                }
        //            });
        //        } else {
        //            mergedList.push(item);
        //        }
        //    } else {
        //        mergedList.push(item);
        //    }


        //    $scope.PatientClaimsListData = angular.copy(mergedList);

        //    angular.forEach($scope.PatientClaimsListData, function (item) {
        //        item.TotalClaimsBalance = 0;
        //        angular.forEach(item.ClaimLineItems, function (pitem) {
        //            item.TotalClaimsBalance += pitem.TotalBalance || 0;
        //        })

        //    })
            
        //    var obj = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddressArray.ContactNo);
        //    $scope.HospitalAddressArray.ContactNo = obj.UsFormatMobileNumber;

        //    var obj1 = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddressArray.MobileNo);
        //    $scope.HospitalAddressArray.MobileNo = obj1.UsFormatMobileNumber;

        //    //var obj2 = eHnoteUserDataService.UsMobileFormatChange($scope.Patientobj.MobileNo);
        //    //$scope.Patientobj.MobileNo = obj2.UsFormatMobileNumber;

           

        //});

        $scope.SearchPatientClaimData();
        $scope.GetMultiplePatientClaimsPrint();
        
    }

    $scope.GetMultiplePatientClaimsPrint = function () {

        $timeout(function () {
            var innerContents = document.getElementById('MultiplePatientClaims_print').innerHTML;
            var popupWinindow = window.open('', 'scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
            popupWinindow.document.open();
            popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()" class="bodyheightprint">' + innerContents + '</body></html>');
            popupWinindow.document.close();
        }, 1000);

    }
    $scope.nationalBenefitFundView = false;
    $scope.claimHistoryViewMore = function () {
        $scope.nationalBenefitFundView = true;
    };
    $scope.claimHistoryViewLess = function () {
        $scope.nationalBenefitFundView = false;
    };

    $scope.openPostPaymentPopup = function (item, type) {

        if (item.PostingDate != "") {
            $scope.PostingDate = $filter("date")(item.PostingDate, "MM-dd-yyyy") || "";
        }

        let mainObject = {
            "PatientId": item.PatientId,
            "AppointmentId": item.AppointmentId,
            "PatientClaimId": item.PatientClaimId,
            "EOBId": item.EOBId,
            "ReferenceNumber": item.ReferenceNumber,
            "EOBClaimInfoId": item.EOBClaimInfoId,
            "PayorId": item.PayorId,
            "PostingDate": $scope.PostingDate,
            "TotalUnAppliedAmount": item.TotalUnAppliedAmount,
            "TotalPaymentAmount": item.TotalPaymentAmount,
            "EraId": item.EraId,
            "Type": type || '',
        }

        let mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/PostPaymentpopup.html",
            "controller": "UsPostPaymentpopupCtrl",
            //"size": "lg",
            "backdrop": "static",
            "keyboard": false,
            "resolve": {
                "mainObject": function () { return mainObject; },
                "AllHospitalData": function () { return $scope.mainPatientProfileObj; },
            },
            "windowClass": "modal__popup--1  ",

        });
        mInstanceAdd.result.then(function (resp) {
            $scope.SearchPatientClaimData();
            $scope.init();
        }, function () {

        });
    };

    $scope.isPopoverOpen = false;
    $scope.togglePopover = function () {
        $scope.isPopoverOpen = !$scope.isPopoverOpen;
    };

    $scope.closePopover = function () {
        $scope.isPopoverOpen = false;
    };

    /* Encounter Details - Start */

    function getnewSearchEncounterobj() {
        var obj = {
            "OrganizationId": $scope.HospitalId,
            "OrganizationFacilityId": $scope.PatientDepositsObj.OrganizationFacilityId,
            "PageSize": 50,
            "PageNumber": 1,
            "FromDate": $filter('date')(new Date(), "MM-dd-yyyy"),
            "ToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
            "DoctorId": 0,
            "VisitReasonId": 0,
            "PatientId": $scope.mainPatientProfileObj.PatientId || 0,
            "PatientMrNo": "",
            "PatientMobile": "",
            "Count": 0,
            "SelectedHospitalId": 0,
            "FacilityListIds": "",
            "Locationids": "",
            "EncounterStatusId": 0
        };
        return obj;
    }

    $scope.searchClaimEncounterReqObj = getnewSearchEncounterobj();

    $scope.PatientPaymenyObj = {
        "IsPatientDeposit": false,
        "TotalAdvanceDepositAvailable": 0,
        "TotalAllocatedAmount": 0,
        "TotalCopaymentAvailable": 0,
        "TotalDeductableAvailable": 0,
        "TotalDepositAvailable": 0,
        "TotalGeneralAmountAvailable": 0,
        "TotalPatientBalance": 0,
        "TotalUnAllocatedAmount": 0,
        "TotalPatientClaimBalance": 0,
        "TotalPatientPayment": 0
    };

    $scope.organizationSuperBillList = [];

    $scope.SearchCLaimEncounters = function (pageno, claimtype) {

        $scope.searchClaimEncounterReqObj.PageNumber = pageno || 1;

        var Locationids = $scope.mainPatientProfileObj.AllBranchesList
            .filter(pitem => pitem.IsChecked && pitem.ClinicId !== 0) 
            .map(pitem => pitem.ClinicId)
            .join(",");

        var DoctorIds = $scope.mainPatientProfileObj.AllDoctorsList
            .filter(pitem => pitem.IsChecked)
            .map(pitem => pitem.DoctorID)
            .join(",");

        var VisitReasonIds = $scope.AllVisitReasonsList
            .filter(pitem => pitem.isChecked)
            .map(pitem => pitem.ParentAppointmentVisitReasonId)
            .join(",");

        if (Locationids == '') {
            Locationids = $scope.ClinicId;
        }
        if (DoctorIds == '') {
            DoctorIds = $scope.DoctorId;
        }

        var params = {
            "OrganizationId": $scope.HospitalId,
            "OrganizationFacilityId": $scope.searchClaimEncounterReqObj.OrganizationFacilityId || 0,
            "PageSize": $scope.searchClaimEncounterReqObj.PageSize,
            "PageNumber": $scope.searchClaimEncounterReqObj.PageNumber,
            "FromDate": $scope.searchClaimEncounterReqObj.FromDate,
            "ToDate": $scope.searchClaimEncounterReqObj.ToDate,
            "DoctorId": DoctorIds || '',
            "VisitReasonId": VisitReasonIds || '',
            "PatientId": $scope.searchClaimEncounterReqObj.PatientId || 0,
            "PatientMrNo": $scope.searchClaimEncounterReqObj.PatientMrNo || "",
            "SearchText": $scope.searchClaimEncounterReqObj.SearchText || "",
            "PatientMobile": "",
            "FacilityListIds": '',
            "Locationids": Locationids || '',
            "EncounterStatusId": "1,2,3,4,5,6,7,8",
        };

        params.FromDate = null;
        params.ToDate = null;
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

        }, function (err) { console.log(err); });
    }

    $scope.ManualClaimCreation = function () {
        
        var patientname = "";
        $scope.mainPatientProfileObj.PatientDetailSummary = $scope.mainPatientProfileObj.PatientDetailSummary || null;
        if ($scope.mainPatientProfileObj.PatientDetails != null) {
            patientname = $scope.mainPatientProfileObj.PatientDetails.FullName;
        } else {
            patientname = $scope.cacheStorageItem.PatientName;
        }

        let obj = {
            "AppointmentDate": null,
            "PatientId": $scope.mainPatientProfileObj.PatientId || null,
            "PatientFullName": patientname,
            "AppointmentId": null,
            "ScreenType": 1,
            "SuperBillArray": [],
            "SuperBillDiagnosisArray": [],
        }

        $scope.navtoGenerateClaim("AddClaim", obj);
    }

    $scope.getActiveApptvisitReasons = function () {

        $scope.AllVisitReasonsList = [];
        var visitreasonParams = {
            "OrganizationId": $scope.HospitalId,
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
                }
                angular.forEach($scope.AllVisitReasonsList, function (item) {
                    item.isChecked = true;
                });
            }
        });
    }

    $scope.clicktoNavtoAllAppointments = function () {

        $scope.encountermodelInstanceAdd = $uibModal.open({
            "templateUrl": "templates/UsClaims/AllEncountersPopup.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            "windowClass": "modal__ninety--  ",
            "resolve": {
                "AllHospitalData": function () { return $scope.mainPatientProfileObj; },
                "OrganizationFacilityList": function () { return $scope.OrganizationFacilityList; },
                "AllVisitReasons": function () { return $scope.AllVisitReasonsList; },
                "allSubSpecializationsArray": function () { return $scope.allSubSpecializationsArray; },
            },
            "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientDataService, AllHospitalData, OrganizationFacilityList, AllVisitReasons, allSubSpecializationsArray, eHnoteAdminDepartmentService) {

                $scope.AllEncounterPatientList = [];
                $scope.OPandOTAppointmentList = [];
                $scope.AppListdoctoraddress = [];
                $scope.clinicDoctorList = [];
                $scope.selectedDoctor = "";
                $scope.OPandOTAppointmentListCount = 0;
                $scope.OrganizationFacilityList = OrganizationFacilityList || [];
                $scope.AllVisitReasonsList = AllVisitReasons || [];
                $scope.allSubSpecializationsArray = allSubSpecializationsArray || [];
                $scope.clinicDoctorList = AllHospitalData.AllDoctorsList || [];
                $scope.doctorinfo = eHnoteMasterDataService.getUserInfo();
                $scope.SelectedVisitReasonType = 'All';


                function getSelectedPatientObj() {
                    var obj = {
                        "SearchText": "",
                        "PatientId": 0,
                        "SearchTypeId": 2,
                        "OrganizationFacilityId": "",
                        "PatientMRNo": "",
                        "DOB": "",
                        "PatientSearchInd": false
                    }
                    return obj;
                };
                $scope.PatientSearchObj = getSelectedPatientObj();

                $scope.selectedDoctor = {
                    "FullName":"All Doctors"
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
                    "AllBillingStatusCheck": false,
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
                    $scope.PatientSearchObj.SearchTypeId = id;
                    $scope.AllPatientList = [];
                    $scope.AllEncounterPatientList = [];
                    if ($scope.PatientSearchObj.SearchText == '') {
                        $scope.ShowPatientDetailsDrop = false;
                    }
                }



                $scope.getDoctorsbySubSpecializations = function (hospitalID,val) {


                    $scope.BranchDoctorsList = [];
                    $scope.allUserList = [];
                    $scope.clinicDoctorList = [];
                    $scope.filteredBranchDoctorsList = [];
                    $scope.DoctorObj = "";

                    var listSubSplArray = $filter("filter")($scope.allSubSpecializationsArray, function (iterator, ind) { return iterator.isChecked === true; });
                    var subSplArray = _.pluck(listSubSplArray, "SubSpecializationId").join(",");

                    var reqObj = {
                        "BranchId": hospitalID,
                        "SubSpecializationIdArray": subSplArray
                    }
                    eHnoteMainAppointmentService.getAllUsersByDepartmentId(reqObj, onGetUsersSuccess, onGetUsersFailure);
                    function onGetUsersSuccess(resp) {
                        if (resp.rows.length > 0) {
                            $scope.allUserList = resp.rows;


                            if ($scope.allUserList.length !== 0) {

                                $scope.clinicDoctorList = angular.copy($scope.allUserList);
                                $scope.BranchDoctorsList = angular.copy($scope.allUserList);
                                $scope.BranchDoctorsList = $filter("filter")($scope.BranchDoctorsList, function (item) {
                                    return item.RoleId === 1 || item.RoleId === 3 || item.RoleId === 4 || item.RoleId === 43 || item.RoleId === 55;
                                });
                                $scope.filteredBranchDoctorsList = angular.copy($scope.BranchDoctorsList);
                            }

                            $scope.clinicDoctorList = _.uniq($scope.clinicDoctorList, false, function (p) { return p.DoctorID; });
                            angular.forEach($scope.clinicDoctorList, function (ditem) {
                                ditem.isChecked = true;
                            });
                            $scope.SelectedProvider = 'All Doctors Select';
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

                $scope.SelectAllLocations = function (item,val) {

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

                $scope.getvisitReasons = function (item,val) {

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
                        "HospitalId": $scope.HospitalId,
                        "DoctorId": DoctorIds || 0,
                        "GetAllDoctorIndictor": 0,
                        "AppointmentTypeId": $scope.AppointmentType.TypeId || 0,
                        "PatientId": $scope.mainPatientProfileObj.PatientId || 0,
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
                    $scope.DoctorId = $scope.doctorinfo.doctordata.User[0].DoctorID;
                    $scope.selectedDoctor.FullName = "All Doctors";
                     
                    //var Index = $scope.clinicDoctorList.findIndex(record => record.DoctorID === eHnoteMasterDataService.getLoginId());
                    //if (Index > -1) {
                    //    $scope.selectedDoctor = $scope.clinicDoctorList[Index] || "";
                    //    if ($scope.selectedDoctor != "") {
                    //        $scope.selectedDoctor.FullName = "All Doctors";
                    //    }
                    //} else {
                    //    $scope.selectedDoctor = $scope.clinicDoctorList[0] || "";
                    //    if ($scope.selectedDoctor.DoctorID == 0) {
                    //        $scope.DoctorId = 0;
                    //    }
                    //}
                    $scope.AllEncounterObj.AllDoctorCheck = true;
                    $scope.PageNumber = 1;
                    $scope.PageSize = 10;
                    $scope.PatientSearchObj.SearchTypeId = 2;
                    $scope.AppListselectedclinic = $scope.AllHospitalData.AllBranchesList[0];
                    //$scope.SearchAppointmentList();
                    if ($scope.AllHospitalData.AllBranchesList.length > 0) {
                        $scope.AllHospitalData.AllBranchesList[0].IsChecked = true;
                        $scope.SelectAllLocations($scope.AllHospitalData.AllBranchesList[0], 1);
                    }
                }


                $scope.clinicDoctorList = _.uniq($scope.clinicDoctorList, false, function (p) { return p.DoctorID; });
                var Index = $scope.clinicDoctorList.findIndex(record => record.DoctorID === eHnoteMasterDataService.getLoginId());

                angular.forEach($scope.clinicDoctorList, function (item) {
                    item.isChecked = true;
                });

                //if (Index > -1) {
                //    //$scope.selectedDoctor = $scope.clinicDoctorList[Index];
                //    //if ($scope.selectedDoctor != "") {
                //    //    $scope.selectedDoctor.FullName = "All";
                //    //}
                //    //$scope.SelectedProvider = $scope.clinicDoctorList[Index].SecondUserFullName;
                //    angular.forEach($scope.clinicDoctorList, function (item) {
                //        item.isChecked = true;
                //        //item.isChecked = (item.DoctorID === $scope.selectedDoctor.DoctorID);
                //    });
                //} else {
                //    $scope.selectedDoctor = $scope.clinicDoctorList[0] || "";
                //    if ($scope.selectedDoctor != "") {
                //        $scope.selectedDoctor.FullName = "All";
                //    }
                //    if ($scope.selectedDoctor.DoctorID == 0) {
                //        $scope.DoctorId = 0;
                //    }
                //}


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

                        $scope.selectedDoctor.FullName = 'All';
                    } else if (val == false) {
                        angular.forEach($scope.clinicDoctorList, function (item) {
                            item.isChecked = false;
                        });

                        $scope.selectedDoctor.FullName = 'Select';
                    } else {

                        var checkedArray = _.where($scope.clinicDoctorList, { isChecked: true });
                        var totalItems = $scope.clinicDoctorList.length;
                        var checkedCount = checkedArray.length;

                        if (checkedCount === totalItems && totalItems > 0) {
                            $scope.selectedDoctor.FullName = "All";
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
            if (resp.Type === "navtoclaim") {
                resp.item.PatientId = resp.item.Patient.PatientId;
                resp.item.PatientFullName = resp.item.Patient.FullName;
                resp.item.IsCreateSuperBill = true;
                $scope.navtoGenerateClaim("AddClaim", resp.item, resp.VisitItem);
            }

        }, function () { });
    }

    $scope.openEncounterStatusPopup = function (item) {

        if (item.AppointmentStatusId === 7 || item.AppointmentStatusId === 5 || item.AppointmentStatusId === 6) {
            alertify.error("Appointment Cancelled!");
            return;
        }

        let mInstanceAdd = $uibModal.open({
            "templateUrl": "EncounterStatusPopup.html",
            //"size": "lg",
            "windowClass": " ",
            "backdrop": "static",
            "keyboard": false,
            "windowClass": " modal__sixty--",
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
                $scope.init = function () {
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
                        } else {
                            mainObject.SuperBillId = mainObject.SuperBillId || 0;
                            if (mainObject.SuperBillId != 0) {
                                var obj = {
                                    "EncounterStatus": mainObject.EncounterStatus || "Ready To Bill",
                                    "Remarks": mainObject.SuperBillRemarks || "",
                                    "UserName": mainObject.AppointmentDoctorName || "",
                                    "ModifiedDt": mainObject.AppointmentDate || ""
                                }
                                $scope.EncounterStatuslist.push(obj);
                            }
                        }

                    }, function (err) {
                        console.log(err);
                        alertify.error("Getting Data Failed");
                    });
                }
                $scope.init();
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
                            $uibModalInstance.close();
                        }
                    }, function (error) {
                        console.log(error);
                    });
                }
            }
        });
        mInstanceAdd.result.then(function (resp) {
            $scope.SearchCLaimEncounters(1);
        }, function (cancel) {
        });

    };

    $scope.navtoGenerateClaim = function (type, item, VisitItem, typeid) {
        item = item || '';
        typeid = typeid || 0;
        item.ResponcibilityId = item.ResponcibilityId || 0;
        VisitItem = VisitItem || '';
        $scope.filterlist = [];
        item.SuperBillArray = item.SuperBillArray || [];
        if (item.SuperBillArray.length > 0) {
            $scope.filterlist = $filter('filter')(item.SuperBillArray, { 'DeleteInd': 'N' }, true) || [];
            if ($scope.filterlist.length > 0 && item.ResponcibilityId == 0) {
                alertify.error("Please select claim responsibility.");
                return false;
            }
        } else if (item.ResponcibilityId == 0 && typeid == 1) {
            alertify.error("Please select claim responsibility.");
            return false;
        }

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
                    alertify.error("The selected responsibility not existed!");
                    return false;
                }
            }
        } else if (item.ResponcibilityId !== 0 && typeid == 1) {
            alertify.error("The selected responsibility not existed");
            return false;
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
            "OrganizationFacilityId": OrganizationFacilityId || 0,
            "AppointmentDoctorId": item.AppointmentDoctorId || item.DoctorID,
            "IsResponsibilitySame": item.IsResponsibilitySame
        };

        datapersistanceFactory.set("IsComingFromClaim", $scope.claimScreenParentObj);
        item.ScreenType = item.ScreenType || '';
        if (item.ScreenType == 3) {
            $scope.mainPatientProfileObj.Tabid = 3;
        } else {
            $scope.mainPatientProfileObj.Tabid = 1;
        }


        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/UsClaims/AddUpdateClaimPopup.html",
            "controller": "UsAddUpdateClaimPopupCtrl",
            "keyboard": false,
            'backdrop': 'static',
            "windowClass": "modal__popup--1",/*  */
            "resolve": {
                "mainBillerDataObj": function () { return $scope.mainPatientProfileObj; },
            }
        });
        //modal__ninety--
        $scope.mInstanceAdd.result.then(function (response) {

            console.log(response);
            $scope.init();
            $scope.SearchCLaimEncounters(1, response);

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
            "ActionType": "SuperBill",
            "ScreenType": "Popup",
            "PatientClaimId": 0,
            "IsCreateSuperBill": false,
            "SuperBillId": item.SuperBillId || 0,
            "SuperBillArray": item.SuperBillArray || [],
            "SuperBillDiagnosisArray": item.SuperBillDiagnosisArray || [],
            "OrganizationFacilityId": item.OrganizationFacilityId || 0,
            "AppointmentDoctorId": item.AppointmentDoctorId || item.DoctorID,
            "IsResponsibilitySame": item.IsResponsibilitySame
        };
        $scope.mainPatientProfileObj.Tabid = 1;
        $scope.mainPatientProfileObj.PatientId = PatientId || 0;
        $scope.mainPatientProfileObj.HospitalId = $scope.HospitalId || 0;
        datapersistanceFactory.set("IsComingFromClaim", $scope.claimScreenParentObj);
        $scope.$emit('AddUpdateClaimPopup', {});
        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/UsClaims/AddUpdateClaimPopup.html",
            "controller": "UsAddUpdateClaimPopupCtrl",
            "size": "lg",
            'backdrop': 'static',
            "keyboard": false,
            "windowClass": "modal__ninety--",
            "resolve": {
                "mainBillerDataObj": function () { return $scope.mainPatientProfileObj; },
            }
        });

        $scope.mInstanceAdd.result.then(function (response) {

            console.log(response);

            $scope.SearchCLaimEncounters(1, response);

        }, function () { });


    }

    $scope.navtoDelegteSuperBillClaim = function (item) {

        var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure want to clear  Encounter data? </h4>", function () {
            let reqObj = {
                "ConsultationID": 0,
                "UserId": $scope.UserId,
                "AppointmentId": $scope.cacheStorageItem.appointmentid,
                "OrganizationId": $scope.HospitalId,
                "SuperBillRemarks": "",
                "SuperBillId": item.SuperBillId || null,
                "SuperBillArray": item.SuperBillArray || [],
                "DeleteInd": "Y"
            }
            eHnoteDiagnosisDataServices.AddupdateSuperBill(reqObj).then(function (resp) {
                if (resp.data.Status === "Success") {
                    alertify.success("Successfully Deleted!");

                    $scope.SearchCLaimEncounters(1);
                }
            }, function (err) {
                alertify.error("Fetching data failed!");

            });
        }, function () {
            r = "You pressed Cancel!";
        });
    }

    $scope.navtoOpenAddDepositAmount = function (type, Incomingfrom, Allocate, item) {
        
        $scope.Patientobj = {};
        $scope.ClaimDetails = $scope.ClaimDetails || null;
        if ($scope.ClaimDetails != null) {
            $scope.BillingProviderName = $scope.ClaimDetails.BillingProviderName || "";
            $scope.FacilityName = $scope.ClaimDetails.FacilityName || "";
        }

        //if ($scope.mainPatientProfileObj.PatientDetailSummary != null) {
        //    $scope.mainPatientProfileObj.PatientDetailSummary.PatientDisplayId = $scope.mainPatientProfileObj.PatientDetailSummary.PatientDisplayID;
        //    $scope.mainPatientProfileObj.PatientDetailSummary.PatientFullName = $scope.mainPatientProfileObj.PatientDetailSummary.FullName;
        //    $scope.mainPatientProfileObj.PatientDetailSummary.MobileNo = $scope.mainPatientProfileObj.PatientDetailSummary.ContactInfo.MobileNumber;
        //    $scope.mainPatientProfileObj.PatientDetailSummary.BillingProviderName = "";
        //    $scope.mainPatientProfileObj.PatientDetailSummary.FacilityName = "";
        //}
        $scope.Patientobj.PatientFullName = $scope.mainPatientProfileObj.PatientDetailSummary.FullName;
        $scope.Patientobj.FirstName = $scope.mainPatientProfileObj.PatientDetailSummary.FirstName;
        $scope.Patientobj.LastName = $scope.mainPatientProfileObj.PatientDetailSummary.LastName;
        $scope.Patientobj.PatientDisplayId = $scope.mainPatientProfileObj.PatientDetailSummary.PatientDisplayID;
        $scope.Patientobj.Gender = $scope.mainPatientProfileObj.PatientDetailSummary.Gender;
        $scope.Patientobj.EmailId = $scope.mainPatientProfileObj.PatientDetailSummary.EmailId;
        $scope.Patientobj.AgeInMonths = $scope.mainPatientProfileObj.PatientDetailSummary.AgeInMonths;
        $scope.Patientobj.AgeInYears = $scope.mainPatientProfileObj.PatientDetailSummary.AgeInYears;
        $scope.Patientobj.DOB = $scope.mainPatientProfileObj.PatientDetailSummary.DOB;
        $scope.Patientobj.MobileNo = $scope.mainPatientProfileObj.PatientDetailSummary.ContactInfo.MobileNumber || '';

        if ($scope.mainPatientProfileObj.PatientDetailSummary.PatientAddress != undefined) {
            $scope.Patientobj.Address1 = $scope.mainPatientProfileObj.PatientDetailSummary.PatientAddress.PostalAddress.AddressLine1 || '';
            $scope.Patientobj.Address2 = $scope.mainPatientProfileObj.PatientDetailSummary.PatientAddress.PostalAddress.AddressLine2 || '';
            $scope.Patientobj.CityName = $scope.mainPatientProfileObj.PatientDetailSummary.PatientAddress.PostalAddress.CityName || '';
            $scope.Patientobj.StateName = $scope.mainPatientProfileObj.PatientDetailSummary.PatientAddress.PostalAddress.StateName || '';
            $scope.Patientobj.StateCode = $scope.mainPatientProfileObj.PatientDetailSummary.PatientAddress.PostalAddress.StateCode || '';
            $scope.Patientobj.ZipCode = $scope.mainPatientProfileObj.PatientDetailSummary.PatientAddress.PostalAddress.ZipCode || '';
        } else {
            $scope.Patientobj.Address1 = $scope.mainPatientProfileObj.PatientDetailSummary.PostalAddress.AddressLine1 || '';
            $scope.Patientobj.Address2 = $scope.mainPatientProfileObj.PatientDetailSummary.PostalAddress.AddressLine2 || '';
            $scope.Patientobj.CityName = $scope.mainPatientProfileObj.PatientDetailSummary.PostalAddress.CityName || '';
            $scope.Patientobj.StateName = $scope.mainPatientProfileObj.PatientDetailSummary.PostalAddress.StateName || '';
            $scope.Patientobj.StateCode = $scope.mainPatientProfileObj.PatientDetailSummary.PostalAddress.StateCode || '';
            $scope.Patientobj.ZipCode = $scope.mainPatientProfileObj.PatientDetailSummary.PostalAddress.ZipCode || '';
        }

        $scope.claimScreenParentObj.PatientClaimId = $scope.claimScreenParentObj.PatientClaimId || 0;
        $scope.filteredClaims = '';
        if ($scope.claimScreenParentObj.PatientClaimId != 0) {
            $scope.CurrentfilteredClaim = $scope.PatientClaimsList.filter(function (claim) {
                return claim.PatientClaimId === $scope.claimScreenParentObj.PatientClaimId;
            });
            $scope.filteredClaims = $scope.CurrentfilteredClaim[0];
        } else {
            $scope.filteredClaims = $scope.PatientClaimsList[0];
        }

        $scope.obj = {
            "PatientId": $scope.mainPatientProfileObj.PatientId,
            "ScreenType": type || '',
            "Incomingfrom": Incomingfrom || '',
            "Type": '',
            "UsersList": $scope.allUserList,
            "Patientobj": $scope.Patientobj,
            "ClaimDetailsList": $scope.ClaimDetailsList,
            "OrganizationFacilityList": $scope.OrganizationFacilityList,
            "DepositTypes": $scope.DepositTypes,
            "WriteOffReasons": $scope.WriteOffReasons,
            "BillingProviderName": $scope.BillingProviderName || "",
            "FacilityName": $scope.FacilityName || "",
            "TotalPatientBalance": $scope.PatientPaymenyObj.TotalPatientBalance || 0,
            "AllBranchesList": $scope.mainPatientProfileObj.AllBranchesList || [],
            "HospitalId": $scope.HospitalId || 0,
            "Allocate": Allocate || 0,
            "item": item || '',
            "CardTypesData": $scope.mainPatientProfileObj.CardTypesData || [],
            "AllUsersList": $scope.mainPatientProfileObj.AllUsersList || [],
            "PatientClaimId": $scope.mainPatientProfileObj.PatientClaimId || null,
            "DoctorName": $scope.filteredClaims?.ClaimCreatedBy || ""
        }

        type = type || 0;
        if (type === 'Payment') {
            if ($scope.ClaimDetails != null) {
                $scope.obj.PatientClaimNumber = $scope.ClaimDetails.PatientClaimNumber || "";
            }
            if ($scope.mainPatientProfileObj.PatientClaimId === 0) {
                $scope.SavePatientEncounterClaim('Ready', 1, 'navPaymentpopup');
                return false;
            }
        }

        var modalInstance = $uibModal.open({
            "templateUrl": "templates/UsClaims/AddPatientDepositPopup.html",
            "controller": "UsAddPatientDepositsCtrl",
            "resolve": {
                "Selectobj": function () { return $scope.obj; },
            },
            //"size": "lg",
            "backdrop": "static",
            "keyboard": false,
            "windowClass": "modal__popup--1"
            /*"windowClass": "modal__popup--1"*/

        });
        modalInstance.result.then(function () {
            $scope.getPatientDepositAmountById();
            $scope.SubTab = 1;
            var pobj = {
                "PatientClaimId": $scope.mainPatientProfileObj.PatientClaimId
            }
            $scope.GetPatientClaimDetailsById(pobj);
            //$scope.OpenPatientAlert();
            $scope.GetPatientTotalRevenueBalance();
        }, function () { });
    }

    if ($scope.mainPatientProfileObj.AllBranchesList.length > 0) {
        angular.forEach($scope.mainPatientProfileObj.AllBranchesList, function (item) {
            item.IsChecked = true;
            //if (item.ClinicId == doctorinfo.doctordata.UserAddress[0].ClinicId) {
            //    item.IsChecked = true;
            //}
        });
    }

    $scope.AllUsersList = _.uniq($scope.AllUsersList, false, function (p) { return p.DoctorID; });
    $scope.mainPatientProfileObj.AllDoctorsList = angular.copy($scope.AllUsersList);
    angular.forEach($scope.mainPatientProfileObj.AllDoctorsList, function (ditem) {
        ditem.IsChecked = true;
    });

    

    /* Encounter Details - End */
    $scope.openPoitOfSalePopup = function (id) {
        
       
        let obj = {
            "ScreenType": "PatientPos",
            "PatientId": $scope.mainPatientProfileObj.PatientId,
            "DepositscreenTypeId": id,

        }
        $scope.mainPatientProfileObj.PatientDetailSummary.PatientDisplayID = $scope.mainPatientProfileObj.PatientDetailSummary.PatientDisplayID;
        $scope.mainPatientProfileObj.PatientDetailSummary.FullName = $scope.mainPatientProfileObj.PatientDetailSummary.FullName;
        $scope.mainPatientProfileObj.PatientDetailSummary.Gender = $scope.mainPatientProfileObj.PatientDetailSummary.Gender;
        $scope.mainPatientProfileObj.PatientDetailSummary.DOB = $scope.mainPatientProfileObj.PatientDetailSummary.DOB;
        $scope.mainPatientProfileObj.PatientDetailSummary.S3URL = $scope.mainPatientProfileObj.PatientDetailSummary.S3URL;
        $scope.mainPatientProfileObj.PatientDetailSummary.AgeInYears = $scope.mainPatientProfileObj.PatientDetailSummary.AgeInYears;
        $scope.mainPatientProfileObj.PatientDetailSummary.AgeInMonths = $scope.mainPatientProfileObj.PatientDetailSummary.AgeInMonths;
        $scope.mainPatientProfileObj.PatientDetailSummary.ContactInfo = $scope.mainPatientProfileObj.PatientDetailSummary.ContactInfo;
        $scope.mainPatientProfileObj.BillingProviderList = $scope.BillingProvidersList;
        let mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/pointOfSalePopup.html",
            "controller": "UsPointOfSalePopupCtrl",
            "backdrop": "static",
            "keyboard": false,
            "resolve": {
                "mainObj": function () { return obj || null; },
                "mainBillerDataObj": function () { return $scope.mainPatientProfileObj || null; },
            },
            "windowClass": "modal__popup--1 in",


        });

        mInstanceAdd.result.then(function (resp) {
            $scope.GetOrganizationPOSInvoices();
        }, function () { });
    };

    $scope.EditPoitOfSalePopup = function (item, EditId) {
        
        let obj = {
            "ScreenType": "EditPos",
            "EditItem": item,
            "PatientId": item.PatientId,
            "EditId": EditId || 0,

        }
        let mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/pointOfSalePopup.html",
            "controller": "UsPointOfSalePopupCtrl",
            "backdrop": "static",
            "keyboard": false,
            "resolve": {
                "mainObj": function () { return obj || null; },
                "mainBillerDataObj": function () { return $scope.mainPatientProfileObj || null; },
            },
            "windowClass": "modal__popup--1 in",


        });

        mInstanceAdd.result.then(function (resp) {
            $scope.GetOrganizationPOSInvoices();
        }, function () { });
    }
   


    $scope.getOrganizationBillingProviderList = function () {

        $scope.BillingProvidersList = [];
        var params = {
            "OrganizationId": $scope.HospitalId || 0,
            "ParentOrganizationId": $scope.ParenthospitalId,
            "HospitalIds": $scope.HospitalIds || '',
            "FacilityCode": "",
            "PageNumber": 1,
            "PageSize": 20
        };
        eHnoteSettingsDataService.GetOrganizationBillingProviders(params).then(function (resp) {
            if (resp.data.Status == "Success") {
                resp.data.rows = resp.data.rows || [];
                $scope.TotalFacilityCount = resp.data.count || 0;
                if (resp.data.rows.length > 0) {
                    $scope.BillingProvidersList = resp.data.rows || [];
                }
            } else {
                alertify.error(resp.data.Message);
            }

        });
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
    $scope.navtoClaimSummaryPopup = function (item, sitem, id, pitem, type) {
        $scope.calculateExpiryDate();
        item = item || '';
        sitem = sitem || '';
        pitem = pitem || '';
        type = type || '';
        let AppointmentId = null;
        let PatientId = null;
        if (type == "EditClaim") {
            if (item != '') {
                AppointmentId = item.AppointmentId;
                PatientId = item.PatientId;
            }

            $scope.claimId = item.PatientClaimId || '';
        } else if (type == "DeleteclaimHistory") {
            if (item != '') {
                AppointmentId = item.AppointmentId;
                PatientId = item.PatientId;
            }

            $scope.claimId = item.PatientClaimId || '';
        } else {
            if (item != '') {
                AppointmentId = pitem.AppointmentId;
                PatientId = item.PatientId;
            }

            $scope.claimId = pitem.PatientClaimId || '';
        }

        if (id == 5) {
            $scope.IsEditClaimscreen = true;
        } else {
            $scope.IsEditClaimscreen = false;
        }

        $scope.claimScreenParentObj = {
            "PatientId": PatientId || null,
            "AppointmentId": AppointmentId || null,
            "AppointmentTypeId": item.AppointmentTypeId || null,
            "EncounterStatus": item.EncounterStatus || "Ready To Bill",
            "EncounterStatusId": item.EncounterStatusId || 1,
            "PatientFullName": item.PatientFullName || "",
            "VisitId": item.VisitId || '',
            "ActionType": "EditClaim",
            "SubActionType": "Verify",
            "ScreenType": "Popup",
            "SuperBillId": null,
            "IsCreateSuperBill": false,
            "PatientClaimId": $scope.claimId,
            "SuperBillArray": [],
            "ClaimExpiryDate": $scope.ClaimExpiryDate || null,
            "AppointmentDoctorId": item.AppointmentDoctorId || item.DoctorID,
            "IsResponsibilitySame": item.IsResponsibilitySame,
            "IsClaimPatientDeposit": $scope.IsEditClaimscreen,
            "type": type,
        };
        $scope.mainPatientProfileObj.Tabid = 2;
        datapersistanceFactory.set("IsComingFromClaim", $scope.claimScreenParentObj);
        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/UsClaims/AddUpdateClaimPopup.html",
            "size": "lg",
            'backdrop': 'static',
            "keyboard": false,
            "controller": "UsAddUpdateClaimPopupCtrl",
            "windowClass": "modal__popup--1",
            "resolve": {
                "mainBillerDataObj": function () { return $scope.mainPatientProfileObj || null; },
            }
        });

        $scope.mInstanceAdd.result.then(function (response) {
            response = response || "";
            console.log(response);
            if (response === 'Close') return;
            if ($scope.ClaimSubtabs == 1) {
                $scope.SearchAllClaimDetails(1, 'All');
            }
            else if ($scope.ClaimSubtabs == 2) {
                $scope.SearchAllClaimDetails(1, 'NotSubmitted');
            }
            else if ($scope.ClaimSubtabs == 3) {
                $scope.SearchAllClaimDetails(1, 'Transmitted');
            }
            else if ($scope.ClaimSubtabs == 4) {
                $scope.SearchAllClaimDetails(1, 'Denial');
            }
            else if ($scope.ClaimSubtabs == 5) {
                $scope.SearchRejectedFollowUps('Rejected');
            }
            else if ($scope.ClaimSubtabs == 6) {
                $scope.Search277AckDetails();
            }
            else if ($scope.ClaimSubtabs == 7) {
                $scope.Search999AckDetails();
            }
            else if ($scope.ClaimSubtabs == 9) {
                $scope.SearchAllClaimDetails(1, 'Queue');
            }

            $scope.$on('ClaimClose', function (event, data) {
                data = data || "";
                if (data === 'CloseClaimPopup') {
                    $scope.SearchAllClaimDetails(1, 'All');
                }
            });

            if (response != "") {
                response.TotalPatientBalance = response.TotalPatientBalance || 0;
                response.CurrentResponsibilityId = response.CurrentResponsibilityId || 0;

                if (response.TotalPatientBalance != 0 && response.CurrentResponsibilityId != 3) {
                    $scope.navtoOpenAddDepositAmount(response);
                }
            }

        }, function () { });
    }


    //$scope.VoidPatientDeposit = function (item, type) {

    //    /* var ConvertedDate = $filter("usdateFormatter")(item.DepositDate, "-");*/
    //    var ConvertedDate = $filter('date')(item.DepositDate, "MM-dd-yyyy");
    //    var PaymentDate = $filter("usdateFormatter")(item.PaymentDate, "-");

    //    alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to Void the Patient Deposit?</h4>", function () {

    //        var obj = {
    //            "UserId": $scope.PatientDepositsObj.UserId,
    //            "OrganizationId": $scope.PatientDepositsObj.OrganizationId,
    //            "PatientDepositId": item.PatientDepositId || 0,
    //            "PatientId": item.PatientId || 0,
    //            "ReceiptNo": "",
    //            "ReceiptId": 0,
    //            "DepositDate": ConvertedDate,
    //            "PaymentDate": PaymentDate,
    //            "DepositAmount": item.DepositAmount || 0,
    //            "DepositedByUserId": $scope.PatientDepositsObj.DepositedByUserId,
    //            "DepositedBy": item.DepositedBy,
    //            "UnBilledAmount": item.UnBilledAmount,
    //            "BilledAmount": 0,
    //            "DeleteInd": $scope.PatientDepositsObj.DeleteInd || "N",
    //            "AppointmentId": item.AppointmentID,
    //            "BillingProviderId": item.BillingProviderId,
    //            "DepositTypeId": item.DepositTypeId,
    //            "DepositType": item.DepositTypeName,
    //            "PaymentMethodId": item.PaymentMethodId,
    //            "PaymentMethodName": item.PaymentMethodName,
    //            "ChequeNumber": $scope.PatientDepositsObj.ChequeNumber,
    //            "CardNumber": "",
    //            "OnlineTransactionNumber": $scope.PatientDepositsObj.OnlineTransactionNumber || '',
    //            "CardName": "",
    //            "CardExpiry": "",
    //            "Notes": item.Notes,
    //            "BatchNumber": item.BatchNumber,
    //            "OrganizationFacilityId": item.OrganizationFacilityId,
    //            "FacilityName": item.FacilityName,
    //            //"IsConsent": $scope.PatientDepositsObj.IsConsent,
    //            //"IsDepositPrint": $scope.PatientDepositsObj.IsDepositPrint,
    //            //"IsEmail": $scope.PatientDepositsObj.IsEmail,
    //            "DepositStatusId": 2,
    //            "DepositStatus": "Void Deposit",
    //            "PageSize": $scope.PatientDepositsObj.PageSize,
    //            "PageNumber": $scope.PatientDepositsObj.PageNumber,
    //            "PatientDepositPaymodeList": item.PatientDepositPaymodeList || [],
    //            /*"PatientVoidDeposit": 1,*/
    //            "TransactionTypeId": 2,
    //            "TransactionType": 'Void Payment',
    //        }

    //        eHnoteInsuranceService.AddUpdatePatientDepositAmount(obj).then(function (resp) {
    //            if (resp.data.Status == "Success") {
    //                $scope.getPatientDepositAmountById();
    //            }
    //        }, function (err) {

    //        });

    //        /* $scope.$apply();*/
    //    }, function () {

    //    });


    //}

    //$scope.VoidPatientDeposit = function (item) {
    //    var mInstanceAdd = $uibModal.open({
    //        "templateUrl": "VoidReasonPopUp.html",
    //        "size": "sm",
    //        "backdrop": "static",
    //        "keyboard": false,
    //        "windowClass": " ",
    //        "resolve": {
    //            "item": function () { return item; },
    //            "UserId": function () { return $scope.UserId; },
    //            "HospitalId": function () { return $scope.HospitalId; },
    //        },
    //        "controller": function ($scope, $uibModal, $uibModalInstance, item, UserId, HospitalId) {
    //            item = item || '';
    //            $scope.uibclose = function () {
    //                $uibModalInstance.close("cancel");
    //            }

    //            $scope.VoidPatientObj = {
    //                "VoidRemarks": '',
    //            }

    //            $scope.SaveVoidDepositData = function () {
    //                $scope.SavePatientVoidDeposit(item);
    //            }

    //            $scope.SavePatientVoidDeposit = function (item) {

    //                if ($scope.VoidPatientObj.VoidRemarks == '') {
    //                    alertify.error("Please enter Remarks.");
    //                    return false;
    //                }

    //                var ConvertedDate = $filter('date')(item.DepositDate, "MM-dd-yyyy");
    //                var PaymentDate = $filter("usdateFormatter")(item.PaymentDate, "-");

    //                var obj = {
    //                    "UserId": UserId,
    //                    "OrganizationId": HospitalId,
    //                    "PatientDepositId": item.PatientDepositId || 0,
    //                    "PatientId": item.PatientId || 0,
    //                    "ReceiptNo": "",
    //                    "ReceiptId": 0,
    //                    "DepositDate": ConvertedDate,
    //                    "PaymentDate": PaymentDate,
    //                    "DepositAmount": item.DepositAmount || 0,
    //                    /*"DepositedByUserId": $scope.PatientDepositsObj.DepositedByUserId,*/
    //                    "DepositedBy": item.DepositedBy,
    //                    "UnBilledAmount": item.UnBilledAmount,
    //                    "BilledAmount": 0,
    //                    "DeleteInd": "N",
    //                    "AppointmentId": item.AppointmentID,
    //                    "BillingProviderId": item.BillingProviderId,
    //                    "DepositTypeId": item.DepositTypeId,
    //                    "DepositType": item.DepositTypeName,
    //                    "PaymentMethodId": item.PaymentMethodId,
    //                    "PaymentMethodName": item.PaymentMethodName,
    //                    /* "ChequeNumber": $scope.PatientDepositsObj.ChequeNumber,*/
    //                    "CardNumber": "",
    //                    /* "OnlineTransactionNumber": $scope.PatientDepositsObj.OnlineTransactionNumber || '',*/
    //                    "CardName": "",
    //                    "CardExpiry": "",
    //                    "Notes": item.Notes,
    //                    "BatchNumber": item.BatchNumber,
    //                    "OrganizationFacilityId": item.OrganizationFacilityId,
    //                    "FacilityName": item.FacilityName,
    //                    "DepositStatusId": 2,
    //                    "DepositStatus": "Void Deposit",
    //                    "PageSize": 10,
    //                    "PageNumber": 1,
    //                    "PatientDepositPaymodeList": item.PatientDepositPaymodeList || [],
    //                    "VoidRemarks": $scope.VoidPatientObj.VoidRemarks || '',
    //                }

    //                eHnoteInsuranceService.AddUpdatePatientDepositAmount(obj).then(function (resp) {
    //                    if (resp.data.Status == "Success") {
    //                    }
    //                    $scope.uibclose();
    //                }, function (err) {

    //                });
    //            }

    //        }
    //    });

    //    mInstanceAdd.result.then(function () {

    //        $scope.getPatientDepositAmountById();
    //        $scope.ClearPatientDeposit();

    //    }, function () { });
    //}


    $scope.ViewVoidPatientDeposit = function () {

        let mInstanceAdd = $uibModal.open({
            "templateUrl": "VoidDepositpopup.html",
            "backdrop": "static",
            "keyboard": false,
            //"size": "lg",
            "windowClass": " modal__ninety-- in",
            "resolve": {
                "PatientDepositsListArray": function () { return $scope.PatientDepositsListArray; },
            },
            "controller": function ($scope, $uibModalInstance, eHnoteMasterDataService, PatientDepositsListArray) {

                $scope.uibclose = function () {
                    $uibModalInstance.dismiss("cancel");
                };

                $scope.PtDepositsDataArray = [];
                $scope.PtDepositsDataArray = PatientDepositsListArray.filter(item => item.DepositStatusId === 2);


                $scope.IsShowVoidRemarks = null;
                $scope.ShowVoidDepositRemarks = function (index) {
                    if ($scope.IsShowVoidRemarks === index) {
                        $scope.IsShowVoidRemarks = null;
                    } else {
                        $scope.IsShowVoidRemarks = index;
                    }
                };
            }

        });

    }

    $scope.ViewPatientRefund = function () {

        let mInstanceAdd = $uibModal.open({
            "templateUrl": "RefundListpopup.html",
            "backdrop": "static",
            "keyboard": false,
            //"size": "lg",
            "windowClass": "  modal__ninety-- in",
            "resolve": {
                "Refundlist": function () { return $scope.Refundlist; },
            },
            "controller": function ($scope, $uibModalInstance, eHnoteMasterDataService, Refundlist) {

                $scope.uibclose = function () {
                    $uibModalInstance.dismiss("cancel");
                };

                $scope.Refundlist = [];
                $scope.Refundlist = Refundlist || [];



            }

        });

    }

    $scope.DeletePOSInvoices = function (item) {

        alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to Delete?</h4>", function () {

            var obj = {
                "UserId": $scope.UserId,
                "OrganizationId": $scope.HospitalId,
                "InvoiceId": item.InvoiceId,
                "DeleteInd": "Y",
            }

            eHnoteInsuranceService.DeletePOSInvoicesById(obj).then(function (resp) {
                if (resp.data.status == "Success") {
                    $scope.FinancialSubtabs(6);
                    $scope.GetPatientTotalRevenueBalance();
                   
                } else {
                    alertify.error(resp.data.Message);
                }
            }, function (err) {

            });

            $scope.$apply();
        }, function () {

        });


    }

    $scope.customFilter = function (item) {
        return item.DepositStatusId !== 2 && item.UnBilledAmount !== 0;
    };
    function getPOSListObj() {
        var obj = {
            "BuyerId": 0,
            "BuyerName": '',
            "InvoiceId": 0,
            "InvoiceDate": '',
            "InvoiceItems": [],
            "InvoiceNumber": '',
            "PatientBalanceAmount": 0,
            "PatientPaymentAmount": 0,
            "RenderingProviderId": 0,
            "RenderingProviderName": '',
            "SoldBy": '',
            "SoldByUserId": 0,
            "TotalBalanceAmount": 0,
            "TotalChargeAmount": 0,
            "TotalDiscountAmount": 0,
            "TotalNetAmount": 0,
            "PaymentMethods": [],
            "ReferenceNumber": '',
            "PatientName": '',
            "PatientId": 0,
            "TotalPaymentAmount": 0,
            "PatientDisplayID": 0,
            "PrintedDatenTime": '',
            "OrganizationName": '',
            "OrganizationCityName": '',
            "OrganizationStateName": '',
            "OrganizationStateCode": '',
            "OrganizationZipCode": '',
            "PosChargeAmount": 0,
            "PosDiscountAmount": 0,
            "PosPatientPaymentAmt": 0,
            "PosTotalNetAmount": 0,
            "PosTotalPatbalance": 0,
            "POSIntegerNumber": 0,
            "POSDecimalNumber": 0,
            "IntegerAmountInWords": "",
            "DecimalAmountInWords": "",

        };
        return obj;
    };

    $scope.POSPrintMainObj = getPOSListObj();


    $scope.POSPrintList = function (item, type) {
        $scope.POSPrintMainObj = getPOSListObj();
        item = item || '';
        $scope.POSPrintMainObj.BuyerId = item.BuyerId || 0;
        $scope.POSPrintMainObj.BuyerName = item.BuyerName || '';
        $scope.POSPrintMainObj.InvoiceId = item.InvoiceId || 0;
        $scope.POSPrintMainObj.InvoiceDate = item.InvoiceDate || '';
        $scope.POSPrintMainObj.InvoiceItems = item.InvoiceItems || [];
        $scope.POSPrintMainObj.InvoiceNumber = item.InvoiceNumber || '';
        $scope.POSPrintMainObj.PatientBalanceAmount = item.PatientBalanceAmount || 0;
        $scope.POSPrintMainObj.PaymentMethods = item.PaymentMethods || [];
        $scope.POSPrintMainObj.ReferenceNumber = item.ReferenceNumber || '';
        $scope.POSPrintMainObj.RenderingProviderId = item.RenderingProviderId || 0;
        $scope.POSPrintMainObj.RenderingProviderName = item.RenderingProviderName || '';
        $scope.POSPrintMainObj.SoldBy = item.SoldBy || '';
        $scope.POSPrintMainObj.SoldByUserId = item.SoldByUserId || 0;
        $scope.POSPrintMainObj.TotalBalanceAmount = item.TotalBalanceAmount || 0;
        $scope.POSPrintMainObj.TotalChargeAmount = item.TotalChargeAmount || 0;
        $scope.POSPrintMainObj.TotalDiscountAmount = item.TotalDiscountAmount || 0;
        $scope.POSPrintMainObj.TotalNetAmount = item.TotalNetAmount || 0;
        $scope.POSPrintMainObj.PatientName = item.PatientName || 0;
        $scope.POSPrintMainObj.PatientId = item.PatientId || 0;
        $scope.POSPrintMainObj.PatientDisplayID = item.DisplayID || 0;

        $scope.POSPrintMainObj.OrganizationName = item.OrganizationName || '';
        $scope.POSPrintMainObj.OrganizationCityName = item.OrganizationCityName || '';
        $scope.POSPrintMainObj.OrganizationStateName = item.OrganizationStateName || '';
        $scope.POSPrintMainObj.OrganizationStateCode = item.OrganizationStateCode || '';
        $scope.POSPrintMainObj.OrganizationZipCode = item.OrganizationZipCode || '';
        $scope.POSPrintMainObj.OrganizationFaxNo = item.OrganizationFaxNo || '';
        $scope.POSPrintMainObj.OrganizationNPI = item.OrganizationNPI || '';
        /*$scope.POSPrintMainObj.OrganizationContactNo = item.OrganizationContactNo || '';*/
        $scope.POSPrintMainObj.OrganizationAddressLine1 = item.OrganizationAddressLine1 || '';
        $scope.POSPrintMainObj.OrganizationAddressLine2 = item.OrganizationAddressLine2 || '';

        angular.forEach($scope.POSPrintMainObj.PaymentMethods, function (pitem) {
            $scope.POSPrintMainObj.TotalPaymentAmount += pitem.DepositAmount
        })
        //angular.forEach($scope.POSPrintMainObj.InvoiceItems, function (Mitem) {
        //    $scope.POSPrintMainObj.PosChargeAmount += Mitem.TotalChargeAmount || 0;
        //    $scope.POSPrintMainObj.PosDiscountAmount += Mitem.DiscountAmount || 0;
        //    $scope.POSPrintMainObj.PosPatientPaymentAmt += Mitem.PatientPaymentAmount || 0;
        //    $scope.POSPrintMainObj.PosTotalNetAmount += Mitem.TotalNetAmount || 0;
        //    $scope.POSPrintMainObj.PosTotalPatbalance += Mitem.PatientBalanceAmount || 0;
        //})

        $scope.POSPrintMainObj.PosChargeAmount = item.TotalChargeAmount || 0;
        $scope.POSPrintMainObj.PosDiscountAmount = item.TotalDiscountAmount || 0;
        $scope.POSPrintMainObj.PosTotalNetAmount = item.TotalNetAmount || 0;
        $scope.POSPrintMainObj.PosPatientPaymentAmt = item.PatientPaymentAmount || 0;
        $scope.POSPrintMainObj.PosTotalPatbalance = item.PatientBalanceAmount || 0;

        var obj = eHnoteUserDataService.UsMobileFormatChange(item.OrganizationContactNo);
        $scope.POSPrintMainObj.OrganizationContactNo = obj.UsFormatMobileNumber;


        var POSIntegerNumber = Math.floor($scope.POSPrintMainObj.TotalPaymentAmount);
        var POSDecimalNumber = Math.round(($scope.POSPrintMainObj.TotalPaymentAmount - POSIntegerNumber) * 100);

        $scope.POSPrintMainObj.POSIntegerNumber = POSIntegerNumber;
        $scope.POSPrintMainObj.POSDecimalNumber = POSDecimalNumber;

        var IntegerCostWords = eHnotePrintService.ConvertNumberToWords($scope.POSPrintMainObj.POSIntegerNumber);
        $scope.POSPrintMainObj.IntegerAmountInWords = IntegerCostWords;

        if ($scope.POSPrintMainObj.POSDecimalNumber > 0) {
            var DecimalCostWords = eHnotePrintService.ConvertNumberToWords($scope.POSPrintMainObj.POSDecimalNumber);
            $scope.POSPrintMainObj.DecimalAmountInWords = DecimalCostWords;
        }

        //var CostInWords = eHnotePrintService.ConvertNumberToWords($scope.POSPrintMainObj.TotalPaymentAmount);
        //$scope.POSPrintMainObj.AmountInWords = CostInWords;

        var printDate = $filter("date")(new Date(), "MMM-dd-yyyy");
        var printTime = moment(new Date()).format("HH:mm A");
        var printDatemTime = printDate + '  ' + printTime;
        $scope.POSPrintMainObj.PrintedDatenTime = printDatemTime;

        if (type === 'POSMail') {
            $timeout(function () {
                $scope.GetPatientDepositDetailsEmailNew(type);
            }, 1000);
        } else {

            $timeout(function () {
                var innerContents = document.getElementById('POS_ReceiptPrint').innerHTML;
                var popupWinindow = window.open('', 'scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                popupWinindow.document.open();
                popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()" class="bodyheightprint">' + innerContents + '</body></html>');
                popupWinindow.document.close();
            }, 500);
        }

    }
    $scope.POSSubtab = 1;
    $scope.SwitchPOSSubtabs = function (subtabChange) {
        $scope.POSSubtab = subtabChange;
    }
    $scope.AddAnotherPosPaymentMode = function (item, Id) {
        function getPaymentsObj() {
            var obj = {
                "PaymentId": 0,
                "InvoiceId": 0,
                "PaymentMethodId": 1,
                "PaymentMethod": "Cash",
                "PaymentAmount": null,
                "TransactionTypeId": 1,
                "TransactionType": "Payment",
                "DeleteInd": "N",
                "PatientDepositPaymodeList": []
            }
            return obj;
        };
        $scope.PaymentsObj = getPaymentsObj();

        let editItem = item;


        $scope.PatientSearchObj = {
            PatientId: editItem.PatientId,
            SearchText: editItem.FullName,
            PatientFullName: editItem.FullName,
            DOB: editItem.DOB,
            PatientMRNo: editItem.DisplayID,
            MobileNo: editItem.PhoneNumber,
            Gender: editItem.Gender,
            AgeInYears: editItem.AgeInYears,
            AgeInMonths: editItem.AgeInMonths,
            S3URL: editItem.S3URL
        };

        $scope.UserId = editItem.CreatedByUserId;
        // $scope.PaymentsObj.PaymentAmount = editItem.PatientPaymentAmount;

        $scope.PaymentsObj = getPaymentsObj();
        $scope.mainPosObject = {
            InvoiceId: editItem.InvoiceId,
            PatientId: editItem.PatientId,
            PatientName: editItem.PatientName || '',
            BuyerName: editItem.PatientName || '',
            BuyerId: editItem.PatientId || '',
            IsEmployee: editItem.IsEmployee || false,
            SoldByUserId: editItem.SoldByUserId,
            SoldBy: editItem.SoldBy || '',
            BillingProviderId: editItem.BillingProviderId,
            BillingProviderName: editItem.BillingProviderName || '',
            RenderingProviderId: editItem.RenderingProviderId,
            RenderingProviderName: editItem.RenderingProviderName || '',
            InvoiceDate: $filter('date')(editItem.InvoiceDate, "yyyy-MM-dd"),
            DiscountReasonId: editItem.DiscountReasonId,
            DiscountReasonCode: editItem.DiscountReasonCode || '',
            OverallDiscountValue: editItem.OverallDiscountValue || 0,
            OverallDiscountType: editItem.OverallDiscountType || 'A',
            TotalChargeAmount: editItem.TotalChargeAmount || 0,
            TotalDiscountAmount: editItem.TotalDiscountAmount || 0,
            TotalNetAmount: editItem.TotalNetAmount || 0,
            PatientPaymentAmount: editItem.PatientPaymentAmount || 0,
            PatientBalanceAmount: editItem.PatientBalanceAmount || 0,
            WriteOffAmount: editItem.WriteOffAmount || 0,
            TotalBalanceAmount: editItem.TotalBalanceAmount || 0,
            PaymentStatus: editItem.PaymentStatus || '',
            ReferenceNumber: editItem.ReferenceNumber || '',
            PaymentStatusId: editItem.PaymentStatusId,
            DeleteInd: editItem.DeleteInd || 'N',
            InvoiceItems: []
        };

        $scope.mainPosObject.PatientBalanceAmount = editItem.PatientBalanceAmount;
        $scope.PaymentsObj.PatientDepositPaymodeList = editItem.PaymentMethods;

        angular.forEach(editItem.InvoiceItems, function (item) {
            let transactions = item.Transactions || [];

            if (item.PatientBalanceAmount != 0) {
                let PatientBalance = parseFloat(item.PatientBalanceAmount) || 0;
                let Tranobj = {
                    "InvoiceItemTransactionId": 0,
                    "InvoiceItemId": item.InvoiceItemId,
                    "OrganizationId": $scope.HospitalId,
                    "TransactionDate": $filter('date')($scope.CurreDate, "yyyy-MM-dd"),
                    "TransactionAmount": item.TotalChargeAmount,
                    "PatientAmount": PatientBalance,
                    "PatientDepositId": null,
                    "AdjustmentReasonId": null,
                    "AdjustmentReasonCode": null,
                    "ReferenceNumber": "",
                    "TransactionTypeId": 2,
                    "TransactionType": "Payment",
                    "TransactionSourceId": 10,
                    "TransactionSource": "POS",
                    "SettlementStatusId": 3,
                    "SettlementStatus": "Fully Settled",
                    "TransactionNotes": "Payment received",
                    "DeleteInd": 'N'
                };
                transactions.push(Tranobj);
            }

            let subobj = {
                "InvoiceItemId": item.InvoiceItemId || null,
                "InvoiceId": item.InvoiceId || null,
                "ItemMasterId": item.ItemMasterId || null,
                "ItemMasterName": item.ItemMasterName || "",
                "ItemMaster": item.ItemMasterName || "",
                "OrganizationItemId": item.OrganizationItemId || null,
                "Quantity": item.Quantity || 0,
                "UnitPrice": item.UnitPrice || 0,
                "TotalChargeAmount": item.TotalChargeAmount || 0,
                "DiscountValue": item.DiscountValue || 0,
                "DiscountType": item.DiscountType || "$",
                "DiscountAmount": item.DiscountAmount || 0,
                "TotalNetAmount": item.TotalNetAmount || 0,
                "PatientPaymentAmount": item.PatientPaymentAmount || 0,
                "PatientBalanceAmount": item.PatientBalanceAmount || 0,
                "WriteOffAmount": item.WriteOffAmount || 0,
                "BalanceAmount": item.BalanceAmount || 0,
                "DeleteInd": "N",
                "Transactions": transactions
            };

            $scope.mainPosObject.InvoiceItems.push(subobj);
        });

        var Parentobj = {
            "PatientId": $scope.PatientSearchObj.PatientId,
            "PatientFirstName": $scope.PatientSearchObj.FirstName,
            "PatientLastName": $scope.PatientSearchObj.LastName,
            "PatientDisplayId": $scope.PatientSearchObj.PatientMRNo,
            "PatientEmailId": $scope.PatientSearchObj.EmailId,
            "PatientGender": $scope.PatientSearchObj.Gender,
            "PatientAgeInYears": $scope.PatientSearchObj.AgeInYears,
            "PatientAgeInMonths": $scope.PatientSearchObj.AgeInMonths,
            "PatientDOB": $scope.PatientSearchObj.DOB,
            "PatientMobile": $scope.PatientSearchObj.MobileNo,
            "Patientaddress1": $scope.PatientSearchObj.Patientaddress1,
            "Patientaddress2": $scope.PatientSearchObj.Patientaddress2,
            "Patientcity": $scope.PatientSearchObj.Patientcity,
            "Patientstate": $scope.PatientSearchObj.Patientstate,
            "Patientzip": $scope.PatientSearchObj.Patientzip,
            "S3URL": $scope.PatientSearchObj.S3URL,
            "UserId": $scope.mainPosObject.UserId,
            "HospitalId": $scope.mainPosObject.OrganizationId,
            "PaymentAmount": $scope.mainPosObject.PatientBalanceAmount,
            "DepositDate": "",
            "InvoiceDate": $scope.mainPosObject.InvoiceDate,
            "PaymentModeId": 1,
            "PaymentMode": "Cash",
            "PaymentTypeId": 3,
            "PaymentType": "PointOfSale",
            "ScreenType": "AddPOS",
            "mainPosObject": $scope.mainPosObject,
            "AllCardTypes": $scope.AllCardTypes,
            "BillingProviderId": $scope.mainPosObject.BillingProviderId,
            "BillingProviderName": $scope.mainPosObject.BillingProviderName,
            "mainBillerDataObj": $scope.mainBillerDataObj || {},
            "DepositscreenTypeId": Id,
        }
        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/collectPayment.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            "resolve": {
                "Parentobj": function () { return Parentobj; }
            },
            "windowClass": "modal__ninetyfive--",
            "controller": "UsMainNmiPaymentCtrl",
        });
        $scope.mInstanceAdd.result.then(function (resp) {
            console.log(resp);
            $scope.GetOrganizationPOSInvoices();
            //$uibModalInstance.close();
        }, function (cancel) {
            $scope.GetOrganizationPOSInvoices();
        });


    }
    //$scope.VoidPatientPayment = function (item) {

    //    var mInstanceAdd = $uibModal.open({
    //        "templateUrl": "VoidReasonPopUp.html",
    //        "size": "md",
    //        "backdrop": "static",
    //        "keyboard": false,
    //        "windowClass": " ",
    //        "resolve": {
    //            "sitem": function () { return item; },
    //            "UserId": function () { return $scope.UserId; },
    //            "HospitalId": function () { return $scope.HospitalId; },
    //        },
    //        "controller": function ($scope, $uibModal, $uibModalInstance, sitem, UserId, HospitalId) {
    //            sitem = sitem || '';
    //            $scope.HospitalId = HospitalId ;
    //            $scope.uibclose = function () {
    //                $uibModalInstance.close("cancel");
    //            }
    //            $scope.mainNMITransactionid = "";
    //            if (sitem.PaymentMethods.length === 1) {
    //                if (sitem.PaymentMethods[0].NMITransactionId !== 0) {
    //                    $scope.mainNMITransactionid = sitem.PaymentMethods[0].OnlineTransactionNumber || "";
    //                }
    //            }
    //            //$scope.getVoidPatientObj = function () {
    //            //    var Obj = {
    //            //        "VoidRemarks": ''
    //            //    }
    //            //    return Obj;
    //            //}
    //            function getPaymentsObj() {
    //                var obj = {
    //                    "PaymentId": 0,
    //                    "InvoiceId": 0,
    //                    "PaymentMethodId": 1,
    //                    "PaymentMethod": "Cash",
    //                    "PaymentAmount": 0,
    //                    "TransactionTypeId": 1,
    //                    "TransactionType": "Payment",
    //                    "DeleteInd": "N",
    //                    "PatientDepositPaymodeList": []
    //                }
    //                return obj;
    //            };
    //            $scope.PaymentsObj = getPaymentsObj();
    //            $scope.VoidPatientObj = {
    //                "VoidRemarks": '',
    //            }

    //            $scope.SaveVoidDepositData = function () {
    //                $scope.SavePatientVoidPOS(sitem, 'IsFromVoid');
    //            }
    //            $scope.navtoVoidOnlinePayment = function () {

    //                $scope.VoidPatientObj.VoidRemarks = $scope.VoidPatientObj.VoidRemarks || "";
    //                if ($scope.VoidPatientObj.VoidRemarks == '') {
    //                    alertify.error("Please enter Remarks.");
    //                    return false;
    //                }

    //                if ($scope.mainNMITransactionid == "") {
    //                    alertify.error("you cannot perform void, as TransactionId is empty");
    //                    return false;
    //                }

    //                $scope.mainNMITransactionObj = angular.copy(eHnoteCacheStorageService.getNMITransactionMainObject());
    //                $scope.mainNMITransactionObj.NMITransactionId = 0;
    //                $scope.mainNMITransactionObj.UserId = UserId;
    //                $scope.mainNMITransactionObj.PatientId = sitem.PatientId;
    //                $scope.mainNMITransactionObj.OrganizationId = sitem.OrganizationId;
    //                $scope.mainNMITransactionObj.PaymentAmount = sitem.PaymentMethods[0].DepositAmount;
    //                $scope.mainNMITransactionObj.MerchentId = "";
    //                $scope.mainNMITransactionObj.MerchentName = "ehnotesandbox";
    //                $scope.mainNMITransactionObj.CardHolderName = sitem.FullName || "";
    //                $scope.mainNMITransactionObj.PatientEmail = sitem.PatientEmailId || "";
    //                //sitem.PhoneNumber = sitem.PhoneNumber || null;
    //                //if (sitem.PhoneNumber != null) {
    //                //    var Number = eHnoteUserDataService.UsMobileFormatChange(sitem.PhoneNumber);
    //                //    sitem.PhoneNumber = Number.UsFormatMobileNumber;

    //                //}
    //                $scope.mainNMITransactionObj.PatientMobile = sitem.PhoneNumber || "";
    //                $scope.mainNMITransactionObj.PatientMrNo = sitem.DisplayID || "";
    //                $scope.mainNMITransactionObj.OrderId = "";
    //                $scope.mainNMITransactionObj.OrderDescription = $scope.VoidPatientObj.VoidRemarks || "";
    //                $scope.mainNMITransactionObj.TransactionId = $scope.mainNMITransactionid;
    //                $scope.mainNMITransactionObj.BillPaymentTypeId = sitem.PaymentMethods[0].BillPaymentTypeId || 0;
    //                $scope.mainNMITransactionObj.BillPaymentType = sitem.PaymentMethods[0].BillPaymentType || "";
    //                $scope.mainNMITransactionObj.ResponseId = 0;
    //                $scope.mainNMITransactionObj.ResponseCode = "";
    //                $scope.mainNMITransactionObj.ResponseText = "";
    //                $scope.mainNMITransactionObj.Status = "";
    //                $scope.mainNMITransactionObj.TransactionTypeId = 4;
    //                $scope.mainNMITransactionObj.TransactionType = "void";
    //                $scope.mainNMITransactionObj.DeleteInd = "N";
    //                $scope.mainNMITransactionObj.Type = "void";
    //                $scope.mainNMITransactionObj.AppointmentId = sitem.AppointmentId || 0;
    //                $scope.mainNMITransactionObj.VisitId = sitem.VisitId || 0;


    //                eHnotePaymentGatewayService.NMIPaymentTransactionVoid($scope.mainNMITransactionObj).then(function (resp) {
    //                    var res = resp.data || {};
    //                    if (res.Status == "Success") {
    //                        alertify.success("Transaction Voided Successfully.");

    //                        $scope.SavePatientVoidPOS(sitem, 'IsFromVoid');
    //                    }
    //                });

    //            };
    //            $scope.SavePatientVoidPOS = function (sitem, type) {
    //                type = type || "";
    //                if ($scope.VoidPatientObj.VoidRemarks == '') {
    //                    alertify.error("Please enter Remarks.");
    //                    return false;
    //                }

    //                var ConvertedDate = $filter('date')(item.DepositDate, "MM-dd-yyyy");
    //                var PaymentDate = $filter("usdateFormatter")(item.PaymentDate, "-");

    //                let editItem = sitem;


    //                $scope.PatientSearchObj = {
    //                    PatientId: editItem.PatientId,
    //                    SearchText: editItem.FullName,
    //                    PatientFullName: editItem.FullName,
    //                    DOB: editItem.DOB,
    //                    PatientMRNo: editItem.DisplayID,
    //                    MobileNo: editItem.PhoneNumber,
    //                    Gender: editItem.Gender,
    //                    AgeInYears: editItem.AgeInYears,
    //                    AgeInMonths: editItem.AgeInMonths,
    //                    S3URL: editItem.S3URL
    //                };

    //                $scope.UserId = editItem.CreatedByUserId;
    //                // $scope.PaymentsObj.PaymentAmount = editItem.PatientPaymentAmount;

    //                $scope.PaymentsObj = getPaymentsObj();
    //                $scope.mainPosObject = {
    //                    InvoiceId: editItem.InvoiceId,
    //                    PatientId: editItem.PatientId,
    //                    PatientName: editItem.PatientName || '',
    //                    BuyerName: editItem.PatientName || '',
    //                    BuyerId: editItem.PatientId || '',
    //                    IsEmployee: editItem.IsEmployee || false,
    //                    SoldByUserId: editItem.SoldByUserId,
    //                    SoldBy: editItem.SoldBy || '',
    //                    BillingProviderId: editItem.BillingProviderId,
    //                    BillingProviderName: editItem.BillingProviderName || '',
    //                    RenderingProviderId: editItem.RenderingProviderId,
    //                    RenderingProviderName: editItem.RenderingProviderName || '',
    //                    InvoiceDate: $filter('date')(editItem.InvoiceDate, "yyyy-MM-dd"),
    //                    DiscountReasonId: editItem.DiscountReasonId,
    //                    DiscountReasonCode: editItem.DiscountReasonCode || '',
    //                    OverallDiscountValue: editItem.OverallDiscountValue || 0,
    //                    OverallDiscountType: editItem.OverallDiscountType || 'A',
    //                    TotalChargeAmount: editItem.TotalChargeAmount || 0,
    //                    TotalDiscountAmount: editItem.TotalDiscountAmount || 0,
    //                    //TotalNetAmount: editItem.TotalNetAmount || 0,
    //                    TotalNetAmount: type === "IsFromVoid" ? 0 : editItem.TotalNetAmount || 0,
    //                    //PatientPaymentAmount: editItem.PatientPaymentAmount || 0,
    //                    PatientPaymentAmount: type === "IsFromVoid" ? 0 : editItem.PatientPaymentAmount || 0,
    //                    //PatientBalanceAmount: editItem.PatientBalanceAmount || 0,
    //                    PatientBalanceAmount: type === "IsFromVoid" ? editItem.TotalNetAmount : editItem.PatientBalanceAmount || 0,
    //                    WriteOffAmount: editItem.WriteOffAmount || 0,
    //                    //TotalBalanceAmount: editItem.TotalBalanceAmount || 0,
    //                    TotalBalanceAmount: type === "IsFromVoid" ? editItem.TotalNetAmount : editItem.PatientBalanceAmount || 0,
    //                    PaymentStatus: editItem.PaymentStatus || '',
    //                    ReferenceNumber: editItem.ReferenceNumber || '',
    //                    PaymentStatusId: editItem.PaymentStatusId,
    //                    DeleteInd: editItem.DeleteInd || 'N',
    //                    InvoiceItems: []
    //                };
    //                //$scope.EditPosMainData.PatientBalanceAmount = editItem.PatientBalanceAmount;
    //                //$scope.mainPosObject.PatientBalanceAmount = editItem.PatientBalanceAmount;
    //                $scope.PaymentsObj.PatientDepositPaymodeList = editItem.PaymentMethods;

    //                angular.forEach(editItem.InvoiceItems, function (item) {
    //                    let transactions = item.Transactions || [];

    //                    if (item.PatientBalanceAmount != 0) {
    //                        let PatientBalance = parseFloat(item.PatientBalanceAmount) || 0;
    //                        let Tranobj = {
    //                            "InvoiceItemTransactionId": 0,
    //                            "InvoiceItemId": item.InvoiceItemId,
    //                            "OrganizationId": $scope.HospitalId,
    //                            "TransactionDate": $filter('date')($scope.CurreDate, "yyyy-MM-dd"),
    //                            "TransactionAmount": item.TotalChargeAmount,
    //                            "PatientAmount": PatientBalance,
    //                            "PatientDepositId": null,
    //                            "AdjustmentReasonId": null,
    //                            "AdjustmentReasonCode": null,
    //                            "ReferenceNumber": "",
    //                            "TransactionTypeId": 1,
    //                            "TransactionType": "Payment",
    //                            "TransactionSourceId": 10,
    //                            "TransactionSource": "POS",
    //                            "SettlementStatusId": 3,
    //                            "SettlementStatus": "Fully Settled",
    //                            "TransactionNotes": "Payment received",
    //                            "DeleteInd": 'N'
    //                        };
    //                        transactions.push(Tranobj);
    //                    }

    //                    let subobj = {
    //                        "InvoiceItemId": item.InvoiceItemId || null,
    //                        "InvoiceId": item.InvoiceId || null,
    //                        "ItemMasterId": item.ItemMasterId || null,
    //                        "ItemMasterName": item.ItemMasterName || "",
    //                        "ItemMaster": item.ItemMasterName || "",
    //                        "OrganizationItemId": item.OrganizationItemId || null,
    //                        "Quantity": item.Quantity || 0,
    //                        "UnitPrice": item.UnitPrice || 0,
    //                        "TotalChargeAmount": item.TotalChargeAmount || 0,
    //                        "DiscountValue": item.DiscountValue || 0,
    //                        "DiscountType": item.DiscountType || "$",
    //                        "DiscountAmount": item.DiscountAmount || 0,
    //                        "TotalNetAmount": item.TotalNetAmount || 0,
    //                        "PatientPaymentAmount": item.PatientPaymentAmount || 0,
    //                        "PatientBalanceAmount": item.PatientBalanceAmount || 0,
    //                        "WriteOffAmount": item.WriteOffAmount || 0,
    //                        "BalanceAmount": item.BalanceAmount || 0,
    //                        "DeleteInd": "N",
    //                        "Transactions": transactions
    //                    };

    //                    $scope.mainPosObject.InvoiceItems.push(subobj);
    //                });

    //                var tempPayments = [];



    //                if ($scope.PaymentsObj.PaymentAmount != 0 || type === "IsFromVoid") {

    //                    angular.forEach($scope.PaymentsObj.PatientDepositPaymodeList, function (sitem) {

    //                        let obj = {
    //                            //"PaymentId": sitem.PaymentId,
    //                            "PaymentId": type === "IsFromVoid" ? 0 : sitem.PaymentId,
    //                            "InvoiceId": $scope.mainPosObject.InvoiceId || 0,
    //                            "PaymentMethodId": sitem.PaymentMethodId || null,
    //                            "PaymentMethod": sitem.PaymentMethodName || "",
    //                            //"PaymentAmount": $scope.PaymentsObj.PaymentAmount || 0,
    //                            "PaymentAmount": type === "IsFromVoid" ? -Math.abs(sitem.PaymentAmount || 0) : Math.abs($scope.PaymentsObj.PaymentAmount || 0),
    //                            "PatientDepositId": sitem.PatientDepositId || null,
    //                            "TransactionTypeId": 2,
    //                            "TransactionType": "Void",
    //                            "DeleteInd": "N",
    //                            "CardNumber": sitem.CardNumber || '',
    //                            "CardType": sitem.CardType || '',
    //                            "CardtypeId": sitem.CardTypeId || 0,
    //                            "NMITransactionId": sitem.NMITransactionId || "",
    //                            "OnlineTransactionNumber": sitem.OnlineTransactionNumber || null,
    //                            "PaymentProcessTypeId": sitem.PaymentProcessTypeId || null,
    //                            "PaymentProcessType": sitem.PaymentProcessType || null,
    //                            "BillPaymentTypeId": sitem.BillPaymentTypeId || null,
    //                            "BillPaymentType": sitem.BillPaymentType || null,
    //                            "RefundNotes": "",
    //                        };
    //                        tempPayments.push(obj);

    //                    });
    //                }

    //                let param = {
    //                    "UserId": $scope.UserId,
    //                    "InvoiceId": $scope.mainPosObject.InvoiceId,
    //                    "PatientId": $scope.mainPosObject.PatientId,
    //                    "PatientName": $scope.mainPosObject.PatientName,
    //                    "OrganizationId": $scope.HospitalId,
    //                    "BuyerId": $scope.mainPosObject.BuyerId,
    //                    "BuyerName": $scope.mainPosObject.BuyerName,
    //                    "IsEmployee": $scope.mainPosObject.IsEmployee,
    //                    "SoldByUserId": $scope.mainPosObject.SoldByUserId,
    //                    "SoldBy": $scope.mainPosObject.SoldBy,
    //                    "BillingProviderId": $scope.mainPosObject.BillingProviderId,
    //                    "BillingProviderName": $scope.mainPosObject.BillingProviderName,
    //                    "RenderingProviderId": $scope.mainPosObject.RenderingProviderId,
    //                    "RenderingProviderName": $scope.mainPosObject.RenderingProviderName,
    //                    "InvoiceDate": $scope.mainPosObject.InvoiceDate,
    //                    "DiscountReasonId": $scope.mainPosObject.DiscountReasonId,
    //                    "DiscountReasonCode": $scope.mainPosObject.DiscountReasonCode,
    //                    "OverallDiscountValue": $scope.mainPosObject.OverallDiscountValue || null,
    //                    "OverallDiscountType": $scope.mainPosObject.OverallDiscountType || "",
    //                    "TotalChargeAmount": $scope.mainPosObject.TotalChargeAmount || "",
    //                    "TotalDiscountAmount": $scope.mainPosObject.TotalDiscountAmount || null,
    //                    "TotalNetAmount": $scope.mainPosObject.TotalNetAmount || null,
    //                    "PatientPaymentAmount": $scope.mainPosObject.PatientPaymentAmount || null,
    //                    "PatientBalanceAmount": $scope.mainPosObject.PatientBalanceAmount || null,
    //                    "WriteOffAmount": $scope.mainPosObject.WriteOffAmount || 0,
    //                    "TotalBalanceAmount": $scope.mainPosObject.TotalBalanceAmount || 0,
    //                    //"PaymentStatus": $scope.mainPosObject.PaymentStatus || 0,
    //                    //"PaymentStatusId": $scope.mainPosObject.PaymentStatusId || "",
    //                    "DeleteInd": $scope.mainPosObject.DeleteInd || "N",
    //                    "InvoiceItems": $scope.mainPosObject.InvoiceItems || [],
    //                    //"Payments": $scope.PaymentsObj.PatientDepositPaymodeList || [],
    //                    "Payments": tempPayments || [],
    //                    "ReferenceNumber": $scope.mainPosObject.ReferenceNumber || '',
    //                    "PaymentStatus": 'Voided',
    //                    "PaymentStatusId": 4,
    //                    "Remarks": $scope.VoidPatientObj.VoidRemarks,
    //                    "PaymentId": sitem.PaymentId,
    //                    "PaymentTransactionTypeId": 4,
    //                    "PaymentTransactionType": 'Void',
    //                }
    //                eHnoteInsuranceService.AddUpdatePOSSale(param).then(function (resp) {
    //                    if (resp.data.Status === "Success") {
                            
    //                        $uibModalInstance.close();
    //                    //    $scope.GetOrganizationPOSInvoices();
    //                    }
    //                }, function (err) { console.log(err); });
    //            }

    //        }
    //    });

    //    mInstanceAdd.result.then(function () {

    //        $scope.GetOrganizationPOSInvoices();

    //    }, function () { });
    //}

    $scope.VoidPatientPayment = function (item, ditem, actionType) {

        var templateToUse = (actionType === 'void') ? "POSVoidPopUp.html" : "POSCancelPopUp.html";

        var mInstanceAdd = $uibModal.open({
            "templateUrl": templateToUse,
            "size": "md",
            "backdrop": "static",
            "keyboard": false,
            "windowClass": " ",
            "resolve": {
                "sitem": function () { return item; },
                "UserId": function () { return $scope.UserId; },
                "HospitalId": function () { return $scope.HospitalId; },
                "ditem": function () { return ditem; },
            },
            "controller": function ($scope, $uibModal, $uibModalInstance, sitem, UserId, HospitalId, ditem) {
                sitem = sitem || '';
                ditem = ditem || '';
                $scope.uibclose = function () {
                    $uibModalInstance.dismiss("cancel");
                }
                $scope.mainNMITransactionid = "";
                if (sitem.PaymentMethods.length === 1) {
                    if (sitem.PaymentMethods[0].NMITransactionId !== 0) {
                        $scope.mainNMITransactionid = sitem.PaymentMethods[0].OnlineTransactionNumber || "";
                    }
                }
                $scope.HospitalId = HospitalId;
                $scope.UserId = UserId;
                //$scope.getVoidPatientObj = function () {
                //    var Obj = {
                //        "VoidRemarks": ''
                //    }
                //    return Obj;
                //}
                function getPaymentsObj() {
                    var obj = {
                        "PaymentId": 0,
                        "InvoiceId": 0,
                        "PaymentMethodId": 1,
                        "PaymentMethod": "Cash",
                        "PaymentAmount": null,
                        "TransactionTypeId": 1,
                        "TransactionType": "Payment",
                        "DeleteInd": "N",
                        "PatientDepositPaymodeList": []
                    }
                    return obj;
                };
                $scope.PaymentsObj = getPaymentsObj();
                $scope.VoidPatientObj = {
                    "VoidRemarks": '',
                }

                $scope.SaveVoidDepositData = function () {
                    $scope.SavePatientVoidPOS(sitem, 'IsFromVoid');
                }


                $scope.navtoVoidOnlinePayment = function () {

                    $scope.VoidPatientObj.VoidRemarks = $scope.VoidPatientObj.VoidRemarks || "";
                    if ($scope.VoidPatientObj.VoidRemarks == '') {
                        alertify.error("Please enter Remarks.");
                        return false;
                    }

                    if ($scope.mainNMITransactionid == "") {
                        alertify.error("you cannot perform void, as TransactionId is empty");
                        return false;
                    }

                    $scope.mainNMITransactionObj = angular.copy(eHnoteCacheStorageService.getNMITransactionMainObject());
                    $scope.mainNMITransactionObj.NMITransactionId = 0;
                    $scope.mainNMITransactionObj.UserId = UserId;
                    $scope.mainNMITransactionObj.PatientId = sitem.PatientId;
                    $scope.mainNMITransactionObj.OrganizationId = sitem.OrganizationId;
                    $scope.mainNMITransactionObj.PaymentAmount = ditem.DepositAmount;
                    $scope.mainNMITransactionObj.MerchentId = "";
                    $scope.mainNMITransactionObj.MerchentName = "ehnotesandbox";
                    $scope.mainNMITransactionObj.CardHolderName = sitem.FullName || "";
                    $scope.mainNMITransactionObj.PatientEmail = sitem.PatientEmailId || "";
                    //sitem.PhoneNumber = sitem.PhoneNumber || null;
                    //if (sitem.PhoneNumber != null) {
                    //    var Number = eHnoteUserDataService.UsMobileFormatChange(sitem.PhoneNumber);
                    //    sitem.PhoneNumber = Number.UsFormatMobileNumber;

                    //}
                    $scope.mainNMITransactionObj.PatientMobile = sitem.PhoneNumber || "";
                    $scope.mainNMITransactionObj.PatientMrNo = sitem.DisplayID || "";
                    $scope.mainNMITransactionObj.OrderId = "";
                    $scope.mainNMITransactionObj.OrderDescription = $scope.VoidPatientObj.VoidRemarks || "";
                    $scope.mainNMITransactionObj.TransactionId = $scope.mainNMITransactionid;
                    $scope.mainNMITransactionObj.BillPaymentTypeId = ditem.BillPaymentTypeId || 0;
                    $scope.mainNMITransactionObj.BillPaymentType = ditem.BillPaymentType || "";
                    $scope.mainNMITransactionObj.ResponseId = 0;
                    $scope.mainNMITransactionObj.ResponseCode = "";
                    $scope.mainNMITransactionObj.ResponseText = "";
                    $scope.mainNMITransactionObj.Status = "";
                    $scope.mainNMITransactionObj.TransactionTypeId = (actionType === 'void') ? 4 : 6;
                    $scope.mainNMITransactionObj.TransactionType = (actionType === 'void') ? 'void' : 'cancel',
                        $scope.mainNMITransactionObj.DeleteInd = "N";
                    $scope.mainNMITransactionObj.Type = (actionType === 'void') ? 'void' : 'cancel';
                    $scope.mainNMITransactionObj.AppointmentId = sitem.AppointmentId || 0;
                    $scope.mainNMITransactionObj.VisitId = sitem.VisitId || 0;


                    eHnotePaymentGatewayService.NMIPaymentTransactionVoid($scope.mainNMITransactionObj).then(function (resp) {
                        var res = resp.data || {};
                        if (res.Status == "Success") {
                            alertify.success("Transaction Voided Successfully.");

                            $scope.SavePatientVoidPOS(sitem, 'IsFromVoid');
                        }
                    });

                };

                $scope.SavePatientVoidPOS = function (sitem, type) {
                    type = type || "";
                    if ($scope.VoidPatientObj.VoidRemarks == '') {
                        alertify.error("Please enter Remarks.");
                        return false;
                    }

                    var ConvertedDate = $filter('date')(item.DepositDate, "MM-dd-yyyy");
                    var PaymentDate = $filter("usdateFormatter")(item.PaymentDate, "-");

                    let editItem = sitem;


                    $scope.PatientSearchObj = {
                        PatientId: editItem.PatientId,
                        SearchText: editItem.FullName,
                        PatientFullName: editItem.FullName,
                        DOB: editItem.DOB,
                        PatientMRNo: editItem.DisplayID,
                        MobileNo: editItem.PhoneNumber,
                        Gender: editItem.Gender,
                        AgeInYears: editItem.AgeInYears,
                        AgeInMonths: editItem.AgeInMonths,
                        S3URL: editItem.S3URL
                    };

                    $scope.UserId = editItem.CreatedByUserId;


                    $scope.PaymentsObj = getPaymentsObj();
                    $scope.PaymentsObj.PaymentAmount = ditem.DepositAmount || 0;
                    $scope.mainPosObject = {
                        InvoiceId: editItem.InvoiceId,
                        PatientId: editItem.PatientId,
                        PatientName: editItem.PatientName || '',
                        BuyerName: editItem.PatientName || '',
                        BuyerId: editItem.PatientId || '',
                        IsEmployee: editItem.IsEmployee || false,
                        SoldByUserId: editItem.SoldByUserId,
                        SoldBy: editItem.SoldBy || '',
                        BillingProviderId: editItem.BillingProviderId,
                        BillingProviderName: editItem.BillingProviderName || '',
                        RenderingProviderId: editItem.RenderingProviderId,
                        RenderingProviderName: editItem.RenderingProviderName || '',
                        InvoiceDate: $filter('date')(editItem.InvoiceDate, "yyyy-MM-dd"),
                        DiscountReasonId: editItem.DiscountReasonId,
                        DiscountReasonCode: editItem.DiscountReasonCode || '',
                        OverallDiscountValue: editItem.OverallDiscountValue || 0,
                        OverallDiscountType: editItem.OverallDiscountType || 'A',
                        TotalChargeAmount: editItem.TotalChargeAmount || 0,
                        TotalDiscountAmount: editItem.TotalDiscountAmount || 0,
                        //TotalNetAmount: editItem.TotalNetAmount || 0,
                        TotalNetAmount: type === "IsFromVoid" ? 0 : editItem.TotalNetAmount || 0,
                        //PatientPaymentAmount: editItem.PatientPaymentAmount || 0,
                        PatientPaymentAmount: type === "IsFromVoid" ? 0 : editItem.PatientPaymentAmount || 0,
                        //PatientBalanceAmount: editItem.PatientBalanceAmount || 0,
                        PatientBalanceAmount: type === "IsFromVoid" ? editItem.TotalNetAmount : editItem.PatientBalanceAmount || 0,
                        WriteOffAmount: editItem.WriteOffAmount || 0,
                        //TotalBalanceAmount: editItem.TotalBalanceAmount || 0,
                        TotalBalanceAmount: type === "IsFromVoid" ? editItem.TotalNetAmount : editItem.PatientBalanceAmount || 0,
                        PaymentStatus: editItem.PaymentStatus || '',
                        ReferenceNumber: editItem.ReferenceNumber || '',
                        PaymentStatusId: editItem.PaymentStatusId,
                        DeleteInd: editItem.DeleteInd || 'N',
                        InvoiceItems: []
                    };
                    //$scope.EditPosMainData.PatientBalanceAmount = editItem.PatientBalanceAmount;
                    //$scope.mainPosObject.PatientBalanceAmount = editItem.PatientBalanceAmount;
                    $scope.PaymentsObj.PatientDepositPaymodeList = editItem.PaymentMethods;

                    let refundAmount = $scope.PaymentsObj.PaymentAmount || 0;

                    for (let i = 0; i < editItem.InvoiceItems.length; i++) {

                        let paidAmount = editItem.InvoiceItems[i].PatientPaymentAmount || 0;

                        if (refundAmount <= 0) {
                            break;
                        }

                        if (refundAmount >= paidAmount) {

                            editItem.InvoiceItems[i].PatientPaymentAmount -= paidAmount;
                            editItem.InvoiceItems[i].PatientBalanceAmount += paidAmount;
                            $scope.TotalPatientPaymentBalance -= paidAmount;
                            refundAmount -= paidAmount;
                        } else {

                            editItem.InvoiceItems[i].PatientPaymentAmount -= refundAmount;
                            editItem.InvoiceItems[i].PatientBalanceAmount += refundAmount;
                            $scope.TotalPatientPaymentBalance -= refundAmount;
                            refundAmount = 0;
                            break;
                        }
                    }

                    angular.forEach(editItem.InvoiceItems, function (item) {

                        let refundedAmount = (item.TotalNetAmount || 0) - item.PatientPaymentAmount;

                        let PosTransaction = [];
                        if (refundedAmount > 0) {
                            let Tranobj = {
                                "InvoiceItemTransactionId": 0,
                                "InvoiceItemId": item.InvoiceItemId,
                                "OrganizationId": $scope.HospitalId,
                                "TransactionDate": $filter('date')($scope.CurreDate, "yyyy-MM-dd"),
                                "TransactionAmount": -refundedAmount,
                                "PatientAmount": -refundedAmount,
                                "PatientDepositId": null,
                                "AdjustmentReasonId": null,
                                "AdjustmentReasonCode": null,
                                "ReferenceNumber": item.ReferenceNumber || "",
                                "TransactionTypeId": (actionType === 'void') ? 4 : 6,
                                "TransactionType": (actionType === 'void') ? 'Void' : 'Cancel',
                                "TransactionSourceId": 10,
                                "TransactionSource": "POS",
                                "SettlementStatusId": (actionType === 'void') ? 4 : 6,
                                "SettlementStatus": (actionType === 'void') ? 'Voided' : 'Cancelled',
                                "TransactionNotes": "POS Void issued",
                                "DeleteInd": 'N'
                            };
                            PosTransaction.push(Tranobj);
                        }

                        let subobj = {
                            "InvoiceItemId": item.InvoiceItemId || null,
                            "InvoiceId": item.InvoiceId || null,
                            "ItemMasterId": item.ItemMasterId || null,
                            "ItemMasterName": item.ItemMasterName || "",
                            "OrganizationItemId": item.OrganizationItemId || null,
                            "Quantity": item.Quantity || null,
                            "UnitPrice": item.UnitPrice || null,
                            "TotalChargeAmount": item.TotalChargeAmount || 0,
                            "DiscountValue": item.DiscountValue || null,
                            "DiscountType": item.DiscountType || "",
                            "DiscountAmount": $scope.mainPosObject.OverallDiscountValue == 0 ?
                                item.DiscountType === "%" ? ((item.DiscountAmount / 100) * item.TotalChargeAmount) : item.DiscountAmount : item.DiscountAmount,
                            "TotalNetAmount": item.TotalNetAmount || 0,
                            "PatientPaymentAmount": item.PatientPaymentAmount || 0,
                            "PatientBalanceAmount": item.PatientBalanceAmount || 0,
                            "WriteOffAmount": item.WriteOffAmount || 0,
                            "BalanceAmount": item.BalanceAmount || 0,
                            "DeleteInd": item.DeleteInd,
                            "Transactions": PosTransaction
                        };

                        $scope.mainPosObject.InvoiceItems.push(subobj);
                    });


                    var tempPayments = [];



                    if ($scope.PaymentsObj.PaymentAmount != 0 || type === "IsFromVoid") {

                        angular.forEach($scope.PaymentsObj.PatientDepositPaymodeList, function (sitem) {

                            let obj = {
                                //"PaymentId": ditem.PaymentId,
                                "PaymentId": 0,
                                "InvoiceId": $scope.mainPosObject.InvoiceId || 0,
                                "PaymentMethodId": sitem.PaymentMethodId || null,
                                "PaymentMethod": sitem.PaymentMethodName || "",
                                //"PaymentAmount": $scope.PaymentsObj.PaymentAmount || 0,
                                "PaymentAmount": -sitem.PaymentAmount || 0,
                                "PatientDepositId": sitem.PatientDepositId || null,
                                "TransactionTypeId": (actionType === 'void') ? 4 : 6,
                                "TransactionType": (actionType === 'void') ? 'Void' : 'Cancel',
                                "DeleteInd": "N",
                                "CardNumber": sitem.CardNumber || '',
                                "CardType": sitem.CardType || '',
                                "CardtypeId": sitem.CardTypeId || 0,
                                "NMITransactionId": sitem.NMITransactionId || "",
                                "OnlineTransactionNumber": sitem.OnlineTransactionNumber || null,
                                "PaymentProcessTypeId": sitem.PaymentProcessTypeId || null,
                                "PaymentProcessType": sitem.PaymentProcessType || null,
                                "BillPaymentTypeId": sitem.BillPaymentTypeId || null,
                                "BillPaymentType": sitem.BillPaymentType || null,
                                "RefundNotes": "",
                            };
                            tempPayments.push(obj);

                        });
                    }



                    let param = {
                        "UserId": $scope.UserId,
                        "InvoiceId": $scope.mainPosObject.InvoiceId,
                        "PatientId": $scope.mainPosObject.PatientId,
                        "PatientName": $scope.mainPosObject.PatientName,
                        "OrganizationId": $scope.HospitalId,
                        "BuyerId": $scope.mainPosObject.BuyerId,
                        "BuyerName": $scope.mainPosObject.BuyerName,
                        "IsEmployee": $scope.mainPosObject.IsEmployee,
                        "SoldByUserId": $scope.mainPosObject.SoldByUserId,
                        "SoldBy": $scope.mainPosObject.SoldBy,
                        "BillingProviderId": $scope.mainPosObject.BillingProviderId,
                        "BillingProviderName": $scope.mainPosObject.BillingProviderName,
                        "RenderingProviderId": $scope.mainPosObject.RenderingProviderId,
                        "RenderingProviderName": $scope.mainPosObject.RenderingProviderName,
                        "InvoiceDate": $scope.mainPosObject.InvoiceDate,
                        "DiscountReasonId": $scope.mainPosObject.DiscountReasonId,
                        "DiscountReasonCode": $scope.mainPosObject.DiscountReasonCode,
                        "OverallDiscountValue": $scope.mainPosObject.OverallDiscountValue || null,
                        "OverallDiscountType": $scope.mainPosObject.OverallDiscountType || "",
                        "TotalChargeAmount": $scope.mainPosObject.TotalChargeAmount || "",
                        "TotalDiscountAmount": $scope.mainPosObject.TotalDiscountAmount || null,
                        "TotalNetAmount": $scope.mainPosObject.TotalNetAmount || null,
                        "PatientPaymentAmount": ($scope.mainPosObject.PatientPaymentAmount || 0) - $scope.PaymentsObj.PaymentAmount || 0,
                        "PatientBalanceAmount": ($scope.mainPosObject.PatientBalanceAmount || 0) + $scope.PaymentsObj.PaymentAmount || 0,
                        "WriteOffAmount": $scope.mainPosObject.WriteOffAmount || 0,
                        "TotalBalanceAmount": ($scope.mainPosObject.TotalBalanceAmount || 0) + $scope.PaymentsObj.PaymentAmount || 0,
                        //"PaymentStatus": $scope.mainPosObject.PaymentStatus || 0,
                        //"PaymentStatusId": $scope.mainPosObject.PaymentStatusId || "",
                        "DeleteInd": $scope.mainPosObject.DeleteInd || "N",
                        "InvoiceItems": $scope.mainPosObject.InvoiceItems || [],
                        //"Payments": $scope.PaymentsObj.PatientDepositPaymodeList || [],
                        "Payments": tempPayments || [],
                        "ReferenceNumber": $scope.mainPosObject.ReferenceNumber || '',
                        "PaymentStatus": (actionType === 'void') ? 'Voided' : 'Cancelled',
                        "PaymentStatusId": (actionType === 'void') ? 4 : 5,
                        "Remarks": $scope.VoidPatientObj.VoidRemarks,
                        "PaymentId": ditem.PaymentId,
                        "PaymentTransactionTypeId": (actionType === 'void') ? 4 : 6,
                        "PaymentTransactionType": (actionType === 'void') ? 'Void' : 'Cancel',
                        "CancelReasonId": 0,
                    }
                    eHnoteInsuranceService.AddUpdatePOSSale(param).then(function (resp) {
                        if (resp.data.Status === "Success") {

                            $uibModalInstance.close();

                        }
                    }, function (err) { console.log(err); });
                }
            }
        });

        mInstanceAdd.result.then(function () {

            $scope.GetOrganizationPOSInvoices();

        }, function () { });
    }

    $scope.ViewVoidPatientPOS = function () {

        let mInstanceAdd = $uibModal.open({
            "templateUrl": "POSVoidDepositpopup.html",
            "backdrop": "static",
            "keyboard": false,
            //"size": "lg",
            "windowClass": "  modal__ninety-- in",
            "resolve": {
                "POSDataInvoiceslist": function () { return $scope.POSVoidInvoiceslist; },
            },
            "controller": function ($scope, $uibModalInstance, eHnoteMasterDataService, POSDataInvoiceslist) {

                $scope.uibclose = function () {
                    $uibModalInstance.dismiss("cancel");
                };

                $scope.POSDataInvoiceslist = [];
                $scope.POSDataInvoiceslist = POSDataInvoiceslist.filter(item => item.PaymentStatusId === 4);

                $scope.activeRemarkIndex = null;
                $scope.ShowVoidPOSRemarks = function (index) {
                    if ($scope.activeRemarkIndex === index) {
                        $scope.activeRemarkIndex = null;
                    } else {
                        $scope.activeRemarkIndex = index;
                    }
                };

            }

        });

    }

    $scope.ChangeApptBranch = function (item, typeId) {

        $scope.searchClaimEncounterReqObj.SelectedHospitalId = item.ClinicId || 0;
        $scope.AppListselectedclinic = item || {};

        if (item.IsChecked) {
            if (item.ClinicId === 0) {
                angular.forEach($scope.AllBranchesList, function (mitem) {
                    mitem.IsChecked = true;
                });
            }
        } else {
            if (item.ClinicId === 0) {
                angular.forEach($scope.AllBranchesList, function (mitem) {
                    mitem.IsChecked = false;
                });
            }
        }


        var Locationids = '';
        Locationids = $scope.AllBranchesList
            .filter(pitem => pitem.IsChecked && pitem.ClinicId !== 0)
            .map(pitem => pitem.ClinicId)
            .join(",");

        typeId = typeId || 0;
       /* $scope.getDoctorsbySubSpecialization(Locationids);*/
        //if (typeId == 0) {
        //    $scope.getvisitReasons(Locationids);
        //}

        var nonZeroChecked = $scope.AllBranchesList
            .filter(branch => branch.ClinicId !== 0)
            .every(branch => branch.IsChecked === true);

        var clinicZeroItem = $scope.AllBranchesList.find(branch => branch.ClinicId === 0);
        if (clinicZeroItem) {
            clinicZeroItem.IsChecked = nonZeroChecked;
        }

        var checkedArray = _.where($scope.AllBranchesList, { IsChecked: true });
        var checkedCount = checkedArray.length;
        var totalBranches = $scope.AllBranchesList.length;

        if (checkedCount === totalBranches) {
            $scope.LocationTypeObj.SelectLocationString = "All Locations";
        } else if (checkedCount > 0) {
            $scope.LocationTypeObj.SelectLocationString = "Selected";
        } else {
            $scope.LocationTypeObj.SelectLocationString = "Select";
        }

        if (checkedCount == 1) {
            var filterlist = $filter("filter")($scope.AllBranchesList, function (item) {
                return item.ClinicId == checkedArray[0].ClinicId;
            }) || [];
            if (filterlist.length > 0) {
                $scope.LocationTypeObj.SelectLocationString = filterlist[0].ClinicName || "Select";
            }
        }

    }

    $scope.RefundPOSPatientPayment = function (item) {
        var obj = {
            "AllCardTypes": $scope.AllCardTypes || [],
            "Masterrefundreasons": $scope.Masterrefundreasons || [],
            "AllUsersList": $scope.AllUsersList || [],
        }
        var mInstanceAdd = $uibModal.open({
            "templateUrl": "RefundPosItempopup.html",
            "size": "lg",
            "backdrop": "static",
            "keyboard": false,
            "windowClass": "z-index-9999999991",
            "resolve": {
                "sitem": function () { return item; },
                "UserId": function () { return $scope.UserId; },
                "HospitalId": function () { return $scope.HospitalId; },
                "obj": function () { return obj; },
            },
            "controller": function ($scope, $uibModal, $uibModalInstance, sitem, UserId, HospitalId, obj) {
                sitem = sitem || '';
                $scope.uibclose = function () {
                    $uibModalInstance.close("cancel");
                }
                $scope.mainNMITransactionid = "";
                if (sitem.PaymentMethods[0].NMITransactionId !== 0) {
                    $scope.mainNMITransactionid = sitem.PaymentMethods[0].OnlineTransactionNumber || "";
                }
                $scope.HospitalId = HospitalId;
                $scope.UserId = UserId;
                var mObj = datapersistanceFactory.getItem("masterDataArrays");
                $scope.masterPaymentModes = [];
                if (mObj.PaymentModes && mObj.PaymentModes.length > 0) {
                    $scope.masterPaymentModes = mObj.PaymentModes;
                    $scope.filterPaymentModes = function (item) {
                        return ![13, 14].includes(item.PaymentModeId);
                    };
                    
                    $scope.masterPaymentModes = $filter("filter")($scope.masterPaymentModes, function (item) {
                        return item.PaymentModeId !== 13 && item.PaymentModeId !== 14;
                    }) || [];
                   
                };
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
                $scope.mainobj = angular.copy(sitem);
                $scope.Masterrefundreasons = obj.Masterrefundreasons || [];
                $scope.AllCardTypes = obj.AllCardTypes || [];
                $scope.AllUsersList = obj.AllUsersList || [];
                //$scope.getVoidPatientObj = function () {
                //    var Obj = {
                //        "VoidRemarks": ''
                //    }
                //    return Obj;
                //}
                $scope.isMultiPaymentMode = false;
                $scope.posPaymentMethods = [];
                if (sitem.PaymentMethods.length > 0) {
                    $scope.posPaymentMethods = sitem.PaymentMethods || [];
                }

                if ($scope.posPaymentMethods.length > 1) {
                    $scope.isMultiPaymentMode = true;
                }


                function getPaymentsObj() {
                    var obj = {
                        "PaymentId": 0,
                        "InvoiceId": 0,
                        "PaymentMethodId": 1,
                        "PaymentMethod": "Cash",
                        "PaymentAmount": null,
                        "TransactionTypeId": 1,
                        "TransactionType": "Payment",
                        "DeleteInd": "N",
                        "PatientDepositPaymodeList": []
                    }
                    return obj;
                };
                $scope.GetRefundpaymentObj = function () {
                    var obj = {
                        "UserId": $scope.UserId,
                        "RefundByUser": "",
                        "OrganizationId": $scope.HospitalId,
                        "PatientDepositId": sitem.PaymentMethods[0].PatientDepositId || null,
                        "RefundDepositId": null,
                        "ReceiptNo": $scope.mainobj.ReceiptNo || "",
                        "ReceiptId": 0,
                        "RefundDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                        "RefundAmount": sitem.PatientPaymentAmount || null,
                        "RefundBy": "",
                        "DeleteInd": "N",
                        "AppointmentId": $scope.mainobj.AppointmentID || null,
                        "PatientId": $scope.mainobj.PatientId || null,
                        "RefundreasonId": null,
                        "Refundreason": null,
                        "Remarks": null,
                        "CardtypeId": null,
                        "RefundPaymentMethodId": null,
                        "RefundPaymentMethod": "",
                        "ReceiptNumber": "",
                        "ReferenceNumber": "",
                        "CardNumber": "",
                        "DepositStatus": "Refund",
                        "DepositStatusId": "3",
                        "Transactions": [],
                        "IsCheckedRefund": false,


                    }

                    return obj;
                };
              

                $scope.changeIndividualRefund = function (amount) {
                    if (amount > mainobj.UnBilledAmount) {
                        alertify.error("Refund Amount should not be greater than the Unallocated Deposit Amount.");
                        $scope.RefundPaymentObj.RefundAmount = '';
                        return false;
                    } else {

                    }
                }

                $scope.init = function () {

                    $scope.RefundPaymentObj = angular.copy($scope.GetRefundpaymentObj());

                    var filtredArray = $filter("filter")($scope.AllUsersList, { "DoctorID": $scope.UserId }, true) || [];
                    if (filtredArray.length > 0) {
                        $scope.RefundPaymentObj.RefundByUser = filtredArray[0].FullName || "";
                    }
                    if (!$scope.isMultiPaymentMode) {

                        angular.forEach($scope.posPaymentMethods, function (pitem) {
                            if (pitem.NMITransactionId != 0 && pitem.PaymentMethodId === 2) {
                                $scope.RefundPaymentObj.PaymentMethodId = pitem.PaymentMethodId;
                                $scope.RefundPaymentObj.PaymentMethodName = pitem.PaymentMethodName;
                                $scope.RefundPaymentObj.CardType = pitem.CardType;
                                $scope.RefundPaymentObj.CardNumber = pitem.CardNumber;
                                $scope.RefundPaymentObj.OnlineTransactionNumber = pitem.OnlineTransactionNumber;
                                $scope.RefundPaymentObj.NMITransactionId = pitem.NMITransactionId;
                            }
                        });

                    }
                }
                $scope.init();
                $scope.changeRefund = function (id) {
                    var filtredArray = $filter("filter")($scope.Masterrefundreasons, { "RefundreasonId": id }, true) || [];
                    if (filtredArray.length > 0) {
                        $scope.RefundPaymentObj.Refundreason = filtredArray[0].Refundreason || "";
                    }
                }
                $scope.ChangePaymentMode = function (id) {
                    var filtredArray = $filter("filter")($scope.masterPaymentModes, { "PaymentModeId": id }, true) || [];
                    if (filtredArray.length > 0) {
                        $scope.RefundPaymentObj.RefundPaymentMethod = filtredArray[0].PaymentModeName || "";
                    };

                    $scope.RefundPaymentObj.CardType = "";
                    $scope.RefundPaymentObj.CardNumber = "";
                    $scope.RefundPaymentObj.OnlineTransactionNumber = "";
                    $scope.RefundPaymentObj.NMITransactionId = 0;
                    if (id === 2) {
                        angular.forEach($scope.posPaymentMethods, function (pitem) {
                            if (pitem.PaymentMethodId === 2) {

                                console.log(pitem);
                                $scope.RefundPaymentObj.CardType = pitem.CardType;
                                $scope.RefundPaymentObj.CardNumber = pitem.CardNumber;
                                $scope.RefundPaymentObj.OnlineTransactionNumber = pitem.OnlineTransactionNumber;
                                $scope.RefundPaymentObj.NMITransactionId = pitem.NMITransactionId;
                            }
                        });
                    }
                }
                $scope.PaymentsObj = getPaymentsObj();

                function getRefundStatus(originalPaymentAmount, refundAmount) {
                    if (refundAmount > 0 && refundAmount < originalPaymentAmount) return "Partially Refund";
                    if (refundAmount === originalPaymentAmount) return "Refund";
                    return "Refund";
                }

                $scope.changeRefundAmount = function (refunditem) {
                    var ramount = parseFloat(refunditem.RefundAmount) || 0;
                    var paymentamt = parseFloat($scope.mainobj.PatientPaymentAmount) || 0;
                    if (ramount > paymentamt) {
                        alertify.error("Please enter less than the payment amount");
                        $scope.RefundPaymentObj.RefundAmount = "";
                    }
                }

                $scope.navtoNMIPatientRefund = function () {
                    $scope.RefundPaymentObj.RefundAmount = $scope.RefundPaymentObj.RefundAmount || null;
                    $scope.RefundPaymentObj.RefundreasonId = $scope.RefundPaymentObj.RefundreasonId || null;
                    if ($scope.RefundPaymentObj.RefundAmount == null) {
                        alertify.error("Please Enter Refund Amount");
                        return;
                    }
                    if ($scope.RefundPaymentObj.RefundreasonId == null) {
                        alertify.error("Please Select Refund Reason");
                        return;
                    }

                    if ($scope.mainNMITransactionid == "") {
                        alertify.error("you cannot perform void, as TransactionId is empty");
                        return false;
                    }
                    if ($scope.RefundPaymentObj.Remarks == "" || $scope.RefundPaymentObj.Remarks == null) {
                        alertify.error("Please enter Refund remarks.");
                        return false;
                    }

                    $scope.mainNMITransactionObj = angular.copy(eHnoteCacheStorageService.getNMITransactionMainObject());
                    $scope.mainNMITransactionObj.NMITransactionId = 0;
                    $scope.mainNMITransactionObj.UserId = $scope.UserId;
                    $scope.mainNMITransactionObj.PatientId = $scope.mainobj.PatientId;
                    $scope.mainNMITransactionObj.OrganizationId = $scope.mainobj.OrganizationId;
                    $scope.mainNMITransactionObj.PaymentAmount = $scope.RefundPaymentObj.RefundAmount;
                    $scope.mainNMITransactionObj.MerchentId = $scope.mainNMITransactionObj.MerchentId;
                    $scope.mainNMITransactionObj.MerchentName = $scope.mainNMITransactionObj.MerchentName;
                    $scope.mainNMITransactionObj.CardHolderName = $scope.mainobj.PatientFullName || "";
                    $scope.mainNMITransactionObj.PatientEmail = $scope.mainobj.PatientEmailId || "";
                    $scope.mainNMITransactionObj.PatientMobile = $scope.mainobj.PatientMobile || "";

                    if ($scope.mainNMITransactionObj.PatientMobile != "") {
                        var obj = eHnoteUserDataService.UsMobileFormatChange($scope.mainNMITransactionObj.PatientMobile);
                        $scope.mainNMITransactionObj.PatientMobile = obj.UsFormatMobileNumber;
                    }

                    $scope.mainNMITransactionObj.PatientMrNo = $scope.mainobj.PatientDisplayId || "";
                    $scope.mainNMITransactionObj.OrderId = "";
                    $scope.mainNMITransactionObj.OrderDescription = $scope.RefundPaymentObj.Refundreason || "";
                    $scope.mainNMITransactionObj.TransactionId = $scope.mainNMITransactionid;
                    $scope.mainNMITransactionObj.BillPaymentTypeId = $scope.mainobj.PaymentMethods[0].BillPaymentTypeId || 0;
                    $scope.mainNMITransactionObj.BillPaymentType = $scope.mainobj.PaymentMethods[0].BillPaymentType || "";
                    $scope.mainNMITransactionObj.ResponseId = 0;
                    $scope.mainNMITransactionObj.ResponseCode = "";
                    $scope.mainNMITransactionObj.ResponseText = "";
                    $scope.mainNMITransactionObj.Status = "";
                    $scope.mainNMITransactionObj.TransactionTypeId = 5;
                    $scope.mainNMITransactionObj.TransactionType = "refund";
                    $scope.mainNMITransactionObj.DeleteInd = "N";
                    $scope.mainNMITransactionObj.Type = "refund";
                    $scope.mainNMITransactionObj.AppointmentId = $scope.mainobj.AppointmentId || 0;
                    $scope.mainNMITransactionObj.VisitId = $scope.mainobj.VisitId || 0;


                    eHnotePaymentGatewayService.NMIPaymentTransactionRefund($scope.mainNMITransactionObj).then(function (resp) {
                        var res = resp.data || {};
                        console.log(res)
                        if (res.Status == "Success") {
                            alertify.success(res.Status);

                            $scope.SavePatientRefundPOS();
                        }
                    })

                };

                $scope.SavePatientRefundPOS = function () {

                    $scope.RefundPaymentObj.RefundAmount = $scope.RefundPaymentObj.RefundAmount || null;
                    $scope.RefundPaymentObj.RefundreasonId = $scope.RefundPaymentObj.RefundreasonId || null;
                    $scope.RefundPaymentObj.RefundPaymentMethodId = $scope.RefundPaymentObj.RefundPaymentMethodId || null;

                    if ($scope.RefundPaymentObj.RefundPaymentMethodId == null) {
                        alertify.error("Please Select Payment Method to Refund");
                        return;
                    }
                    if ($scope.RefundPaymentObj.RefundAmount == null) {
                        alertify.error("Please Enter Refund Amount");
                        return;
                    }
                    if ($scope.RefundPaymentObj.RefundreasonId == null) {
                        alertify.error("Please Select Refund Reason");
                        return;
                    }

                    let editItem = $scope.mainobj;

                    $scope.PatientSearchObj = {
                        PatientId: editItem.PatientId,
                        SearchText: editItem.FullName,
                        PatientFullName: editItem.FullName,
                        DOB: editItem.DOB,
                        PatientMRNo: editItem.DisplayID,
                        MobileNo: editItem.PhoneNumber,
                        Gender: editItem.Gender,
                        AgeInYears: editItem.AgeInYears,
                        AgeInMonths: editItem.AgeInMonths,
                        S3URL: editItem.S3URL
                    };

                    $scope.UserId = editItem.CreatedByUserId;
                    // $scope.PaymentsObj.PaymentAmount = editItem.PatientPaymentAmount;

                    $scope.PaymentsObj = getPaymentsObj();
                    $scope.mainPosObject = {
                        InvoiceId: editItem.InvoiceId,
                        PatientId: editItem.PatientId,
                        PatientName: editItem.PatientName || '',
                        BuyerName: editItem.PatientName || '',
                        BuyerId: editItem.PatientId || '',
                        IsEmployee: editItem.IsEmployee || false,
                        SoldByUserId: editItem.SoldByUserId,
                        SoldBy: editItem.SoldBy || '',
                        BillingProviderId: editItem.BillingProviderId,
                        BillingProviderName: editItem.BillingProviderName || '',
                        RenderingProviderId: editItem.RenderingProviderId,
                        RenderingProviderName: editItem.RenderingProviderName || '',
                        InvoiceDate: $filter('date')(editItem.InvoiceDate, "yyyy-MM-dd"),
                        DiscountReasonId: editItem.DiscountReasonId,
                        DiscountReasonCode: editItem.DiscountReasonCode || '',
                        OverallDiscountValue: editItem.OverallDiscountValue || 0,
                        OverallDiscountType: editItem.OverallDiscountType || 'A',
                        TotalChargeAmount: editItem.TotalChargeAmount || 0,
                        TotalDiscountAmount: editItem.TotalDiscountAmount || 0,
                        TotalNetAmount: editItem.TotalNetAmount || 0,
                        PatientPaymentAmount: editItem.PatientPaymentAmount || 0,
                        PatientBalanceAmount: editItem.PatientBalanceAmount || 0,
                        WriteOffAmount: editItem.WriteOffAmount || 0,
                        TotalBalanceAmount: editItem.TotalBalanceAmount || 0,
                        PaymentStatus: editItem.PaymentStatus || '',
                        ReferenceNumber: editItem.ReferenceNumber || '',
                        PaymentStatusId: editItem.PaymentStatusId,
                        DeleteInd: editItem.DeleteInd || 'N',
                        InvoiceItems: []
                    };

                    $scope.PaymentsObj.PatientDepositPaymodeList = editItem.PaymentMethods;
                    $scope.TotalPatientPaymentBalance = 0;
                    let refundAmount = $scope.RefundPaymentObj.RefundAmount;

                    for (let i = 0; i < editItem.InvoiceItems.length; i++) {

                        let paidAmount = editItem.InvoiceItems[i].PatientPaymentAmount;

                        if (refundAmount <= 0) {
                            break;
                        }

                        if (refundAmount >= paidAmount) {

                            editItem.InvoiceItems[i].PatientPaymentAmount -= paidAmount;
                            editItem.InvoiceItems[i].PatientBalanceAmount += paidAmount;
                            $scope.TotalPatientPaymentBalance -= paidAmount;
                            refundAmount -= paidAmount;
                        } else {

                            editItem.InvoiceItems[i].PatientPaymentAmount -= refundAmount;
                            editItem.InvoiceItems[i].PatientBalanceAmount += refundAmount;
                            $scope.TotalPatientPaymentBalance -= refundAmount;
                            refundAmount = 0;
                            break;
                        }
                    }

                    angular.forEach(editItem.InvoiceItems, function (item) {

                        let refundedAmount = (item.TotalNetAmount || 0) - item.PatientPaymentAmount;

                        let PosTransaction = [];
                        if (refundedAmount > 0) {
                            let Tranobj = {
                                "InvoiceItemTransactionId": 0,
                                "InvoiceItemId": item.InvoiceItemId,
                                "OrganizationId": $scope.HospitalId,
                                "TransactionDate": $filter('date')($scope.CurreDate, "yyyy-MM-dd"),
                                "TransactionAmount": -refundedAmount,
                                "PatientAmount": -refundedAmount,
                                "PatientDepositId": null,
                                "AdjustmentReasonId": null,
                                "AdjustmentReasonCode": null,
                                "ReferenceNumber": $scope.RefundPaymentObj.ReferenceNumber || "",
                                "TransactionTypeId": 3,
                                "TransactionType": "Refund",
                                "TransactionSourceId": 10,
                                "TransactionSource": "POS",
                                "SettlementStatusId": 4,
                                "SettlementStatus": "Refunded",
                                "TransactionNotes": "POS refund issued",
                                "DeleteInd": 'N'
                            };
                            PosTransaction.push(Tranobj);
                        }

                        let subobj = {
                            "InvoiceItemId": item.InvoiceItemId || null,
                            "InvoiceId": item.InvoiceId || null,
                            "ItemMasterId": item.ItemMasterId || null,
                            "ItemMasterName": item.ItemMaster || "",
                            "OrganizationItemId": item.OrganizationItemId || null,
                            "Quantity": item.Quantity || null,
                            "UnitPrice": item.UnitPrice || null,
                            "TotalChargeAmount": item.TotalChargeAmount || 0,
                            "DiscountValue": item.DiscountValue || null,
                            "DiscountType": item.DiscountType || "",
                            "DiscountAmount": $scope.mainPosObject.OverallDiscountValue == 0 ?
                                item.DiscountType === "%" ? ((item.DiscountAmount / 100) * item.TotalChargeAmount) : item.DiscountAmount : item.DiscountAmount,
                            "TotalNetAmount": item.TotalNetAmount || 0,
                            "PatientPaymentAmount": item.PatientPaymentAmount || 0,
                            "PatientBalanceAmount": item.PatientBalanceAmount || 0,
                            "WriteOffAmount": item.WriteOffAmount || 0,
                            "BalanceAmount": item.BalanceAmount || 0,
                            "DeleteInd": item.DeleteInd,
                            "Transactions": PosTransaction
                        };

                        $scope.mainPosObject.InvoiceItems.push(subobj);
                    });


                    var tempPayments = [];



                    if ($scope.RefundPaymentObj.RefundAmount != null) {

                        //angular.forEach($scope.PaymentsObj.PatientDepositPaymodeList, function (sitem) {

                        //    let obj = {
                        //        "PaymentId": 0,
                        //        "InvoiceId": $scope.mainPosObject.InvoiceId || 0,
                        //        "PaymentMethodId": sitem.PaymentMethodId || null,
                        //        "PaymentMethod": sitem.PaymentMethodName || "",
                        //        "PaymentAmount": $scope.RefundPaymentObj.RefundAmount || null,
                        //        "PatientDepositId": sitem.PatientDepositId || null,
                        //        "TransactionTypeId": 3,
                        //        "TransactionType": "Refund",
                        //        "DeleteInd": "N",
                        //        "CardNumber": sitem.CardNumber || '',
                        //        "CardType": sitem.CardType || '',
                        //        "CardtypeId": sitem.CardTypeId || 0,
                        //        "NMITransactionId": sitem.NMITransactionId || "",
                        //        "OnlineTransactionNumber": sitem.OnlineTransactionNumber || null,
                        //        "PaymentProcessTypeId": sitem.PaymentProcessTypeId || null,
                        //        "PaymentProcessType": sitem.PaymentProcessType || null,
                        //        "BillPaymentTypeId": sitem.BillPaymentTypeId || null,
                        //        "BillPaymentType": sitem.BillPaymentType || null,
                        //        "RefundNotes": $scope.RefundPaymentObj.RefundNotes || "",
                        //    };
                        //    tempPayments.push(obj);

                        //});

                        let obj = {
                            "PaymentId": 0,
                            "InvoiceId": $scope.mainPosObject.InvoiceId || 0,
                            "PaymentMethodId": $scope.RefundPaymentObj.RefundPaymentMethodId || null,
                            "PaymentMethod": $scope.RefundPaymentObj.RefundPaymentMethod || "",
                            "PaymentAmount": -($scope.RefundPaymentObj.RefundAmount) || null,
                            "PatientDepositId": $scope.RefundPaymentObj.PatientDepositId || null,
                            "TransactionTypeId": 3,
                            "TransactionType": "Refund",
                            "DeleteInd": "N",
                            "CardNumber": $scope.RefundPaymentObj.CardNumber || '',
                            "CardType": $scope.RefundPaymentObj.CardType || '',
                            "CardtypeId": $scope.RefundPaymentObj.CardTypeId || 0,
                            "NMITransactionId": $scope.RefundPaymentObj.NMITransactionId || "",
                            "OnlineTransactionNumber": $scope.RefundPaymentObj.OnlineTransactionNumber || null,
                            "PaymentProcessTypeId": $scope.RefundPaymentObj.PaymentProcessTypeId || null,
                            "PaymentProcessType": $scope.RefundPaymentObj.PaymentProcessType || null,
                            "BillPaymentTypeId": $scope.RefundPaymentObj.BillPaymentTypeId || null,
                            "BillPaymentType": $scope.RefundPaymentObj.BillPaymentType || null,
                            "RefundNotes": $scope.RefundPaymentObj.RefundNotes || "",
                        };
                        tempPayments.push(obj);
                    }




                    let param = {
                        "UserId": $scope.UserId,
                        "InvoiceId": $scope.mainPosObject.InvoiceId,
                        "PatientId": $scope.mainPosObject.PatientId,
                        "PatientName": $scope.mainPosObject.PatientName,
                        "OrganizationId": $scope.HospitalId,
                        "PatientPaymentAmount": ($scope.mainPosObject.PatientPaymentAmount || 0) - $scope.RefundPaymentObj.RefundAmount,
                        "PatientBalanceAmount": ($scope.mainPosObject.PatientBalanceAmount || 0) + $scope.RefundPaymentObj.RefundAmount,
                        "WriteOffAmount": $scope.mainPosObject.WriteOffAmount || 0,
                        "TotalBalanceAmount": ($scope.mainPosObject.TotalBalanceAmount || 0) + $scope.RefundPaymentObj.RefundAmount,
                        "DeleteInd": $scope.mainPosObject.DeleteInd || "N",
                        "InvoiceItems": $scope.mainPosObject.InvoiceItems || [],
                        "Payments": tempPayments || [],
                        "PaymentStatus": "Refund",
                        "PaymentStatusId": 5,
                        "POSRefundId": null,
                        "ReceiptNo": $scope.RefundPaymentObj.ReceiptNo || "",
                        "RefundDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                        "RefundAmount": $scope.RefundPaymentObj.RefundAmount || null,
                        "RefundByUserId": $scope.UserId,
                        "RefundByUser": $scope.RefundPaymentObj.RefundByUser || "",
                        "AppointmentId": $scope.RefundPaymentObj.AppointmentID || null,
                        "RefundreasonId": $scope.RefundPaymentObj.RefundreasonId || null,
                        "RefundReason": $scope.RefundPaymentObj.Refundreason || "",
                        "Remarks": $scope.RefundPaymentObj.Remarks || "",
                        "CardtypeId": $scope.RefundPaymentObj.CardtypeId || "",
                        "RefundPaymentMethodId": $scope.RefundPaymentObj.RefundPaymentMethodId || "",
                        "RefundPaymentMethod": $scope.RefundPaymentObj.RefundPaymentMethod || "",
                        "RefundStatus": "Initiated",
                        "RefundStatusId": "1",
                        "ReferenceNumber": $scope.RefundPaymentObj.ReferenceNumber || "",
                        "CardNumber": $scope.RefundPaymentObj.CardNumber || "",
                        "PatientDepositId": $scope.RefundPaymentObj.PatientDepositId || null,

                    };
                    let originalPaymentAmount = $scope.mainPosObject.PatientPaymentAmount || 0;
                    let refundedAmount = $scope.RefundPaymentObj.RefundAmount || 0;

                    let paymentStatusText = getRefundStatus(originalPaymentAmount, refundedAmount);

                    let paymentStatusIdMap = {
                        "Partially Refund": 6,
                        "Refund": 5
                    };

                    param.PaymentStatus = paymentStatusText;
                    param.PaymentStatusId = paymentStatusIdMap[paymentStatusText];

                    eHnoteInsuranceService.AddUpdatePOSRefundSale(param).then(function (resp) {
                        if (resp.data.Status === "Success") {

                            $uibModalInstance.close();

                        }
                    }, function (err) { console.log(err); });
                }

                $scope.SaveRefundDepositData = function () {
                    $scope.SavePatientRefundPOS(sitem);
                }
            }
        });

        mInstanceAdd.result.then(function () {

            $scope.GetOrganizationPOSInvoices();

        }, function () { });
    }



    $scope.RefundPatientPayment = function (item) {
        var obj = {
            "AllCardTypes": $scope.AllCardTypes || [],
            "Masterrefundreasons": $scope.Masterrefundreasons || [],
            "AllUsersList": $scope.AllUsersList || [],
        }
        var mInstanceAdd = $uibModal.open({
            "templateUrl": "RefundDepositpopup.html",
            "size": "lg",
            "backdrop": "static",
            "keyboard": false,
            "windowClass": "z-index-9999999991",
            "resolve": {
                "sitem": function () { return item; },
                "UserId": function () { return $scope.UserId; },
                "HospitalId": function () { return $scope.HospitalId; },
                "obj": function () { return obj; },
            },
            "controller": function ($scope, $uibModal, $uibModalInstance, sitem, UserId, HospitalId, obj) {
                sitem = sitem || '';
                $scope.uibclose = function () {
                    $uibModalInstance.close("cancel");
                }
                $scope.mainNMITransactionid = "";
                if (sitem.PaymentMethods[0].NMITransactionId !== 0) {
                    $scope.mainNMITransactionid = sitem.PaymentMethods[0].OnlineTransactionNumber || "";
                }
                $scope.HospitalId = HospitalId;
                $scope.UserId = UserId;
                var mObj = datapersistanceFactory.getItem("masterDataArrays");
                $scope.masterPaymentModes = [];
                if (mObj.PaymentModes && mObj.PaymentModes.length > 0) {
                    $scope.masterPaymentModes = mObj.PaymentModes;
                    $scope.filterPaymentModes = function (item) {
                        return ![13, 14].includes(item.PaymentModeId);
                    };
                };
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
                $scope.mainobj = sitem;
                $scope.Masterrefundreasons = obj.Masterrefundreasons || [];
                $scope.AllCardTypes = obj.AllCardTypes || [];
                $scope.AllUsersList = obj.AllUsersList || [];
                //$scope.getVoidPatientObj = function () {
                //    var Obj = {
                //        "VoidRemarks": ''
                //    }
                //    return Obj;
                //}

                function getPaymentsObj() {
                    var obj = {
                        "PaymentId": 0,
                        "InvoiceId": 0,
                        "PaymentMethodId": 1,
                        "PaymentMethod": "Cash",
                        "PaymentAmount": null,
                        "TransactionTypeId": 1,
                        "TransactionType": "Payment",
                        "DeleteInd": "N",
                        "PatientDepositPaymodeList": []
                    }
                    return obj;
                };
                $scope.GetRefundpaymentObj = function () {
                    var obj = {
                        "UserId": $scope.UserId,
                        "RefundByUser": "",
                        "OrganizationId": $scope.HospitalId,
                        "PatientDepositId": sitem.PaymentMethods[0].PatientDepositId || null,
                        "RefundDepositId": null,
                        "ReceiptNo": $scope.mainobj.ReceiptNo || "",
                        "ReceiptId": 0,
                        "RefundDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                        "RefundAmount": $scope.mainobj.PatientPaymentAmount || null,
                        "RefundBy": "",
                        "DeleteInd": "N",
                        "AppointmentId": $scope.mainobj.AppointmentID || null,
                        "PatientId": $scope.mainobj.PatientId || null,
                        "RefundreasonId": null,
                        "Refundreason": null,
                        "Remarks": null,
                        "CardtypeId": sitem.PaymentMethods[0].CardtypeId,
                        "RefundPaymentMethodId": sitem.PaymentMethods[0].PaymentMethodId,
                        "RefundPaymentMethod": sitem.PaymentMethods[0].PaymentMethodName,
                        "ReceiptNumber": "",
                        "ReferenceNumber": "",
                        "CardNumber": sitem.PaymentMethods[0].CardNumber,
                        "DepositStatus": "Refund",
                        "DepositStatusId": "3",
                        "Transactions": [],
                        "IsCheckedRefund": false,


                    }

                    return obj;
                };
                $scope.changeIndividualRefund = function (amount) {
                    if (amount > mainobj.UnBilledAmount) {
                        alertify.error("Refund Amount should not be greater than the Unallocated Deposit Amount.");
                        $scope.RefundPaymentObj.RefundAmount = '';
                        return false;
                    } else {

                    }
                }
                                              
                $scope.init = function () {

                    $scope.RefundPaymentObj = angular.copy($scope.GetRefundpaymentObj());

                    var filtredArray = $filter("filter")($scope.AllUsersList, { "DoctorID": $scope.UserId }, true) || [];
                    if (filtredArray.length > 0) {
                        $scope.RefundPaymentObj.RefundByUser = filtredArray[0].FullName || "";
                    }
                }
                $scope.init();
                $scope.changeRefund = function (id) {
                    var filtredArray = $filter("filter")($scope.Masterrefundreasons, { "RefundreasonId": id }, true) || [];
                    if (filtredArray.length > 0) {
                        $scope.RefundPaymentObj.Refundreason = filtredArray[0].Refundreason || "";
                    }
                }
                $scope.ChangePaymentMode = function (id) {
                    var filtredArray = $filter("filter")($scope.masterPaymentModes, { "PaymentModeId": id }, true) || [];
                    if (filtredArray.length > 0) {
                        $scope.RefundPaymentObj.RefundPaymentMethod = filtredArray[0].PaymentModeName || "";
                    }
                }
                $scope.PaymentsObj = getPaymentsObj();

                function getRefundStatus(originalPaymentAmount, refundAmount) {
                    if (refundAmount > 0 && refundAmount < originalPaymentAmount) return "Partially Refund";
                    if (refundAmount === originalPaymentAmount) return "Refund";
                    return "Refund";
                }


                $scope.navtoNMIPatientRefund = function () {
                    $scope.RefundPaymentObj.RefundAmount = $scope.RefundPaymentObj.RefundAmount || null;
                    $scope.RefundPaymentObj.RefundreasonId = $scope.RefundPaymentObj.RefundreasonId || null;
                    if ($scope.RefundPaymentObj.RefundAmount == null) {
                        alertify.error("Please Enter Refund Amount");
                        return;
                    }
                    if ($scope.RefundPaymentObj.RefundreasonId == null) {
                        alertify.error("Please Select Refund Reason");
                        return;
                    }

                    if ($scope.mainNMITransactionid == "") {
                        alertify.error("you cannot perform void, as TransactionId is empty");
                        return false;
                    }
                    if ($scope.RefundPaymentObj.Remarks == "" || $scope.RefundPaymentObj.Remarks == null) {
                        alertify.error("Please enter Refund remarks.");
                        return false;
                    }

                    $scope.mainNMITransactionObj = angular.copy(eHnoteCacheStorageService.getNMITransactionMainObject());
                    $scope.mainNMITransactionObj.NMITransactionId = 0;
                    $scope.mainNMITransactionObj.UserId = $scope.UserId;
                    $scope.mainNMITransactionObj.PatientId = $scope.mainobj.PatientId;
                    $scope.mainNMITransactionObj.OrganizationId = $scope.mainobj.OrganizationId;
                    $scope.mainNMITransactionObj.PaymentAmount = $scope.RefundPaymentObj.RefundAmount;
                    $scope.mainNMITransactionObj.MerchentId = $scope.mainNMITransactionObj.MerchentId;
                    $scope.mainNMITransactionObj.MerchentName = $scope.mainNMITransactionObj.MerchentName;
                    $scope.mainNMITransactionObj.CardHolderName = $scope.mainobj.PatientFullName || "";
                    $scope.mainNMITransactionObj.PatientEmail = $scope.mainobj.PatientEmailId || "";
                    $scope.mainNMITransactionObj.PatientMobile = $scope.mainobj.PatientMobile || "";

                    if ($scope.mainNMITransactionObj.PatientMobile != "") {
                        var obj = eHnoteUserDataService.UsMobileFormatChange($scope.mainNMITransactionObj.PatientMobile);
                        $scope.mainNMITransactionObj.PatientMobile = obj.UsFormatMobileNumber;
                    }

                    $scope.mainNMITransactionObj.PatientMrNo = $scope.mainobj.PatientDisplayId || "";
                    $scope.mainNMITransactionObj.OrderId = "";
                    $scope.mainNMITransactionObj.OrderDescription = $scope.RefundPaymentObj.Refundreason || "";
                    $scope.mainNMITransactionObj.TransactionId = $scope.mainNMITransactionid;
                    $scope.mainNMITransactionObj.BillPaymentTypeId = $scope.mainobj.PaymentMethods[0].BillPaymentTypeId || 0;
                    $scope.mainNMITransactionObj.BillPaymentType = $scope.mainobj.PaymentMethods[0].BillPaymentType || "";
                    $scope.mainNMITransactionObj.ResponseId = 0;
                    $scope.mainNMITransactionObj.ResponseCode = "";
                    $scope.mainNMITransactionObj.ResponseText = "";
                    $scope.mainNMITransactionObj.Status = "";
                    $scope.mainNMITransactionObj.TransactionTypeId = 5;
                    $scope.mainNMITransactionObj.TransactionType = "refund";
                    $scope.mainNMITransactionObj.DeleteInd = "N";
                    $scope.mainNMITransactionObj.Type = "refund";
                    $scope.mainNMITransactionObj.AppointmentId = $scope.mainobj.AppointmentId || 0;
                    $scope.mainNMITransactionObj.VisitId = $scope.mainobj.VisitId || 0;


                    eHnotePaymentGatewayService.NMIPaymentTransactionRefund($scope.mainNMITransactionObj).then(function (resp) {
                        var res = resp.data || {};
                        console.log(res)
                        if (res.Status == "Success") {
                            alertify.success(res.Status);

                            $scope.SavePatientRefundPOS();
                        }
                    })

                };

                $scope.SavePatientRefundPOS = function () {

                    $scope.RefundPaymentObj.RefundAmount = $scope.RefundPaymentObj.RefundAmount || null;
                    $scope.RefundPaymentObj.RefundreasonId = $scope.RefundPaymentObj.RefundreasonId || null;
                    if ($scope.RefundPaymentObj.RefundAmount == null) {
                        alertify.error("Please Enter Refund Amount");
                        return;
                    }
                    if ($scope.RefundPaymentObj.RefundreasonId == null) {
                        alertify.error("Please Select Refund Reason");
                        return;
                    }

                    let editItem = $scope.mainobj;


                    $scope.PatientSearchObj = {
                        PatientId: editItem.PatientId,
                        SearchText: editItem.FullName,
                        PatientFullName: editItem.FullName,
                        DOB: editItem.DOB,
                        PatientMRNo: editItem.DisplayID,
                        MobileNo: editItem.PhoneNumber,
                        Gender: editItem.Gender,
                        AgeInYears: editItem.AgeInYears,
                        AgeInMonths: editItem.AgeInMonths,
                        S3URL: editItem.S3URL
                    };

                    $scope.UserId = editItem.CreatedByUserId;
                    // $scope.PaymentsObj.PaymentAmount = editItem.PatientPaymentAmount;

                    $scope.PaymentsObj = getPaymentsObj();
                    $scope.mainPosObject = {
                        InvoiceId: editItem.InvoiceId,
                        PatientId: editItem.PatientId,
                        PatientName: editItem.PatientName || '',
                        BuyerName: editItem.PatientName || '',
                        BuyerId: editItem.PatientId || '',
                        IsEmployee: editItem.IsEmployee || false,
                        SoldByUserId: editItem.SoldByUserId,
                        SoldBy: editItem.SoldBy || '',
                        BillingProviderId: editItem.BillingProviderId,
                        BillingProviderName: editItem.BillingProviderName || '',
                        RenderingProviderId: editItem.RenderingProviderId,
                        RenderingProviderName: editItem.RenderingProviderName || '',
                        InvoiceDate: $filter('date')(editItem.InvoiceDate, "yyyy-MM-dd"),
                        DiscountReasonId: editItem.DiscountReasonId,
                        DiscountReasonCode: editItem.DiscountReasonCode || '',
                        OverallDiscountValue: editItem.OverallDiscountValue || 0,
                        OverallDiscountType: editItem.OverallDiscountType || 'A',
                        TotalChargeAmount: editItem.TotalChargeAmount || 0,
                        TotalDiscountAmount: editItem.TotalDiscountAmount || 0,
                        TotalNetAmount: editItem.TotalNetAmount || 0,
                        PatientPaymentAmount: editItem.PatientPaymentAmount || 0,
                        PatientBalanceAmount: editItem.PatientBalanceAmount || 0,
                        WriteOffAmount: editItem.WriteOffAmount || 0,
                        TotalBalanceAmount: editItem.TotalBalanceAmount || 0,
                        PaymentStatus: editItem.PaymentStatus || '',
                        ReferenceNumber: editItem.ReferenceNumber || '',
                        PaymentStatusId: editItem.PaymentStatusId,
                        DeleteInd: editItem.DeleteInd || 'N',
                        InvoiceItems: []
                    };

                    $scope.PaymentsObj.PatientDepositPaymodeList = editItem.PaymentMethods;
                    $scope.TotalPatientPaymentBalance = 0;
                    let refundAmount = $scope.RefundPaymentObj.RefundAmount;

                    for (let i = 0; i < editItem.InvoiceItems.length; i++) {

                        let paidAmount = editItem.InvoiceItems[i].PatientPaymentAmount;

                        if (refundAmount <= 0) {
                            break;
                        }

                        if (refundAmount >= paidAmount) {

                            editItem.InvoiceItems[i].PatientPaymentAmount -= paidAmount;
                            editItem.InvoiceItems[i].PatientBalanceAmount += paidAmount;
                            $scope.TotalPatientPaymentBalance -= paidAmount;
                            refundAmount -= paidAmount;
                        } else {

                            editItem.InvoiceItems[i].PatientPaymentAmount -= refundAmount;
                            editItem.InvoiceItems[i].PatientBalanceAmount += refundAmount;
                            $scope.TotalPatientPaymentBalance -= refundAmount;
                            refundAmount = 0;
                            break;
                        }
                    }

                    angular.forEach(editItem.InvoiceItems, function (item) {

                        let refundedAmount = (item.TotalNetAmount || 0) - item.PatientPaymentAmount;

                        let PosTransaction = [];
                        if (refundedAmount > 0) {
                            let Tranobj = {
                                "InvoiceItemTransactionId": 0,
                                "InvoiceItemId": item.InvoiceItemId,
                                "OrganizationId": $scope.HospitalId,
                                "TransactionDate": $filter('date')($scope.CurreDate, "yyyy-MM-dd"),
                                "TransactionAmount": -refundedAmount,
                                "PatientAmount": -refundedAmount,
                                "PatientDepositId": null,
                                "AdjustmentReasonId": null,
                                "AdjustmentReasonCode": null,
                                "ReferenceNumber": $scope.RefundPaymentObj.ReferenceNumber || "",
                                "TransactionTypeId": 3,
                                "TransactionType": "Refund",
                                "TransactionSourceId": 10,
                                "TransactionSource": "POS",
                                "SettlementStatusId": 4,
                                "SettlementStatus": "Refunded",
                                "TransactionNotes": "POS refund issued",
                                "DeleteInd": 'N'
                            };
                            PosTransaction.push(Tranobj);
                        }

                        let subobj = {
                            "InvoiceItemId": item.InvoiceItemId || null,
                            "InvoiceId": item.InvoiceId || null,
                            "ItemMasterId": item.ItemMasterId || null,
                            "ItemMasterName": item.ItemMaster || "",
                            "OrganizationItemId": item.OrganizationItemId || null,
                            "Quantity": item.Quantity || null,
                            "UnitPrice": item.UnitPrice || null,
                            "TotalChargeAmount": item.TotalChargeAmount || 0,
                            "DiscountValue": item.DiscountValue || null,
                            "DiscountType": item.DiscountType || "",
                            "DiscountAmount": $scope.mainPosObject.OverallDiscountValue == 0 ?
                                item.DiscountType === "%" ? ((item.DiscountAmount / 100) * item.TotalChargeAmount) : item.DiscountAmount : item.DiscountAmount,
                            "TotalNetAmount": item.TotalNetAmount || 0,
                            "PatientPaymentAmount": item.PatientPaymentAmount || 0,
                            "PatientBalanceAmount": item.PatientBalanceAmount || 0,
                            "WriteOffAmount": item.WriteOffAmount || 0,
                            "BalanceAmount": item.BalanceAmount || 0,
                            "DeleteInd": item.DeleteInd,
                            "Transactions": PosTransaction
                        };

                        $scope.mainPosObject.InvoiceItems.push(subobj);
                    });


                    var tempPayments = [];



                    if ($scope.RefundPaymentObj.RefundAmount != null) {

                        angular.forEach($scope.PaymentsObj.PatientDepositPaymodeList, function (sitem) {

                            let obj = {
                                "PaymentId": 0,
                                "InvoiceId": $scope.mainPosObject.InvoiceId || 0,
                                "PaymentMethodId": sitem.PaymentMethodId || null,
                                "PaymentMethod": sitem.PaymentMethodName || "",
                                "PaymentAmount": $scope.RefundPaymentObj.RefundAmount || null,
                                "PatientDepositId": sitem.PatientDepositId || null,
                                "TransactionTypeId": 3,
                                "TransactionType": "Refund",
                                "DeleteInd": "N",
                                "CardNumber": sitem.CardNumber || '',
                                "CardType": sitem.CardType || '',
                                "CardtypeId": sitem.CardTypeId || 0,
                                "NMITransactionId": sitem.NMITransactionId || "",
                                "OnlineTransactionNumber": sitem.OnlineTransactionNumber || null,
                                "PaymentProcessTypeId": sitem.PaymentProcessTypeId || null,
                                "PaymentProcessType": sitem.PaymentProcessType || null,
                                "BillPaymentTypeId": sitem.BillPaymentTypeId || null,
                                "BillPaymentType": sitem.BillPaymentType || null,
                                "RefundNotes": $scope.RefundPaymentObj.RefundNotes || "",
                            };
                            tempPayments.push(obj);

                        });
                    }




                    let param = {
                        "UserId": $scope.UserId,
                        "InvoiceId": $scope.mainPosObject.InvoiceId,
                        "PatientId": $scope.mainPosObject.PatientId,
                        "PatientName": $scope.mainPosObject.PatientName,
                        "OrganizationId": $scope.HospitalId,
                        "PatientPaymentAmount": ($scope.mainPosObject.PatientPaymentAmount || 0) - $scope.RefundPaymentObj.RefundAmount,
                        "PatientBalanceAmount": ($scope.mainPosObject.PatientBalanceAmount || 0) + $scope.RefundPaymentObj.RefundAmount,
                        "WriteOffAmount": $scope.mainPosObject.WriteOffAmount || 0,
                        "TotalBalanceAmount": ($scope.mainPosObject.TotalBalanceAmount || 0) + $scope.RefundPaymentObj.RefundAmount,
                        "DeleteInd": $scope.mainPosObject.DeleteInd || "N",
                        "InvoiceItems": $scope.mainPosObject.InvoiceItems || [],
                        "Payments": tempPayments || [],
                        "PaymentStatus": "Refund",
                        "PaymentStatusId": 5,
                        "POSRefundId": null,
                        "ReceiptNo": $scope.RefundPaymentObj.ReceiptNo || "",
                        "RefundDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                        "RefundAmount": $scope.RefundPaymentObj.RefundAmount || null,
                        "RefundByUserId": $scope.UserId,
                        "RefundByUser": $scope.RefundPaymentObj.RefundByUser || "",
                        "AppointmentId": $scope.RefundPaymentObj.AppointmentID || null,
                        "RefundreasonId": $scope.RefundPaymentObj.RefundreasonId || null,
                        "RefundReason": $scope.RefundPaymentObj.Refundreason || "",
                        "Remarks": $scope.RefundPaymentObj.Remarks || "",
                        "CardtypeId": $scope.RefundPaymentObj.CardtypeId || "",
                        "RefundPaymentMethodId": $scope.RefundPaymentObj.RefundPaymentMethodId || "",
                        "RefundPaymentMethod": $scope.RefundPaymentObj.RefundPaymentMethod || "",
                        "RefundStatus": "Initiated",
                        "RefundStatusId": "1",
                        "ReferenceNumber": $scope.RefundPaymentObj.ReferenceNumber || "",
                        "CardNumber": $scope.RefundPaymentObj.CardNumber || "",
                        "PatientDepositId": $scope.RefundPaymentObj.PatientDepositId || null,

                    };
                    let originalPaymentAmount = $scope.mainPosObject.PatientPaymentAmount || 0;
                    let refundedAmount = $scope.RefundPaymentObj.RefundAmount || 0;

                    let paymentStatusText = getRefundStatus(originalPaymentAmount, refundedAmount);

                    let paymentStatusIdMap = {
                        "Partially Refund": 6,
                        "Refund": 5
                    };

                    param.PaymentStatus = paymentStatusText;
                    param.PaymentStatusId = paymentStatusIdMap[paymentStatusText];

                    eHnoteInsuranceService.AddUpdatePOSRefundSale(param).then(function (resp) {
                        if (resp.data.Status === "Success") {

                            $uibModalInstance.close();

                        }
                    }, function (err) { console.log(err); });
                }

                $scope.SaveRefundDepositData = function () {
                    $scope.SavePatientRefundPOS(sitem);
                }
            }
        });

        mInstanceAdd.result.then(function () {

            $scope.GetOrganizationPOSInvoices();

        }, function () { });
    }


    //$scope.RefundPatientPayment = function (item) {
    //    var obj = {
    //        "AllCardTypes": $scope.AllCardTypes || [],
    //        "Masterrefundreasons": $scope.Masterrefundreasons || [],
    //        "AllUsersList": $scope.AllUsersList || [],
    //    }
    //    var mInstanceAdd = $uibModal.open({
    //        "templateUrl": "RefundDepositpopup.html",
    //        "size": "lg",
    //        "backdrop": "static",
    //        "keyboard": false,
    //        "windowClass": "z-index-9999999991",
    //        "resolve": {
    //            "sitem": function () { return item; },
    //            "UserId": function () { return $scope.UserId; },
    //            "HospitalId": function () { return $scope.HospitalId; },
    //            "obj": function () { return obj; },
    //        },
    //        "controller": function ($scope, $uibModal, $uibModalInstance, sitem, UserId, HospitalId, obj) {
    //            sitem = sitem || '';
    //            $scope.uibclose = function () {
    //                $uibModalInstance.close("cancel");
    //            }
    //            $scope.mainNMITransactionid = "";
    //            if (sitem.PaymentMethods[0].NMITransactionId !== 0) {
    //                $scope.mainNMITransactionid = sitem.PaymentMethods[0].OnlineTransactionNumber || "";
    //            }
    //            $scope.HospitalId = HospitalId;
    //            $scope.UserId = UserId;
    //            var mObj = datapersistanceFactory.getItem("masterDataArrays");
    //            $scope.masterPaymentModes = [];
    //            if (mObj.PaymentModes && mObj.PaymentModes.length > 0) {
    //                $scope.masterPaymentModes = mObj.PaymentModes;
    //                $scope.filterPaymentModes = function (item) {
    //                    return ![13, 14].includes(item.PaymentModeId);
    //                };
    //            };
    //            var doctorinfo = eHnoteMasterDataService.getUserInfo();
    //            $scope.UserId = eHnoteMasterDataService.getLoginId();
    //            $scope.ParenthospitalId = 0;
    //            $scope.HospitalId = 0;
    //            if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
    //                $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
    //                $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
    //                $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
    //                $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
    //            };
    //            $scope.mainobj = sitem;
    //            $scope.Masterrefundreasons = obj.Masterrefundreasons || [];
    //            $scope.AllCardTypes = obj.AllCardTypes || [];
    //            $scope.AllUsersList = obj.AllUsersList || [];
    //            //$scope.getVoidPatientObj = function () {
    //            //    var Obj = {
    //            //        "VoidRemarks": ''
    //            //    }
    //            //    return Obj;
    //            //}

    //            function getPaymentsObj() {
    //                var obj = {
    //                    "PaymentId": 0,
    //                    "InvoiceId": 0,
    //                    "PaymentMethodId": 1,
    //                    "PaymentMethod": "Cash",
    //                    "PaymentAmount": null,
    //                    "TransactionTypeId": 1,
    //                    "TransactionType": "Payment",
    //                    "DeleteInd": "N",
    //                    "PatientDepositPaymodeList": []
    //                }
    //                return obj;
    //            };
    //            $scope.GetRefundpaymentObj = function () {
    //                var obj = {
    //                    "UserId": $scope.UserId,
    //                    "RefundByUser": "",
    //                    "OrganizationId": $scope.HospitalId,
    //                    "PatientDepositId": sitem.PaymentMethods[0].PatientDepositId || null,
    //                    "RefundDepositId": null,
    //                    "ReceiptNo": $scope.mainobj.ReceiptNo || "",
    //                    "ReceiptId": 0,
    //                    "RefundDate": $filter('date')(new Date(), "MM-dd-yyyy"),
    //                    "RefundAmount": $scope.mainobj.PatientPaymentAmount || null,
    //                    "RefundBy": "",
    //                    "DeleteInd": "N",
    //                    "AppointmentId": $scope.mainobj.AppointmentID || null,
    //                    "PatientId": $scope.mainobj.PatientId || null,
    //                    "RefundreasonId": null,
    //                    "Refundreason": null,
    //                    "Remarks": null,
    //                    "CardtypeId": sitem.PaymentMethods[0].CardtypeId,
    //                    "RefundPaymentMethodId": sitem.PaymentMethods[0].PaymentMethodId,
    //                    "RefundPaymentMethod": sitem.PaymentMethods[0].PaymentMethodName,
    //                    "ReceiptNumber": "",
    //                    "ReferenceNumber": "",
    //                    "CardNumber": sitem.PaymentMethods[0].CardNumber,
    //                    "DepositStatus": "Refund",
    //                    "DepositStatusId": "3",
    //                    "Transactions": [],


    //                }

    //                return obj;
    //            };
    //            $scope.init = function () {

    //                $scope.RefundPaymentObj = angular.copy($scope.GetRefundpaymentObj());

    //                var filtredArray = $filter("filter")($scope.AllUsersList, { "DoctorID": $scope.UserId }, true) || [];
    //                if (filtredArray.length > 0) {
    //                    $scope.RefundPaymentObj.RefundByUser = filtredArray[0].FullName || "";
    //                }
    //            }
    //            $scope.init();
    //            $scope.changeRefund = function (id) {
    //                var filtredArray = $filter("filter")($scope.Masterrefundreasons, { "RefundreasonId": id }, true) || [];
    //                if (filtredArray.length > 0) {
    //                    $scope.RefundPaymentObj.Refundreason = filtredArray[0].Refundreason || "";
    //                }
    //            }
    //            $scope.ChangePaymentMode = function (id) {
    //                var filtredArray = $filter("filter")($scope.masterPaymentModes, { "PaymentModeId": id }, true) || [];
    //                if (filtredArray.length > 0) {
    //                    $scope.RefundPaymentObj.RefundPaymentMethod = filtredArray[0].PaymentModeName || "";
    //                }
    //            }
    //            $scope.PaymentsObj = getPaymentsObj();

    //            function getRefundStatus(originalPaymentAmount, refundAmount) {
    //                if (refundAmount > 0 && refundAmount < originalPaymentAmount) return "Partially Refund";
    //                if (refundAmount === originalPaymentAmount) return "Refund";
    //                return "Unknown";
    //            }


    //            $scope.navtoNMIPatientRefund = function () {
    //                $scope.RefundPaymentObj.RefundAmount = $scope.RefundPaymentObj.RefundAmount || null;
    //                $scope.RefundPaymentObj.RefundreasonId = $scope.RefundPaymentObj.RefundreasonId || null;
    //                if ($scope.RefundPaymentObj.RefundAmount == null) {
    //                    alertify.error("Please Enter Refund Amount");
    //                    return;
    //                }
    //                if ($scope.RefundPaymentObj.RefundreasonId == null) {
    //                    alertify.error("Please Select Refund Reason");
    //                    return;
    //                }

    //                if ($scope.mainNMITransactionid == "") {
    //                    alertify.error("you cannot perform void, as TransactionId is empty");
    //                    return false;
    //                }

    //                $scope.mainNMITransactionObj = angular.copy(eHnoteCacheStorageService.getNMITransactionMainObject());
    //                $scope.mainNMITransactionObj.NMITransactionId = 0;
    //                $scope.mainNMITransactionObj.UserId = $scope.UserId;
    //                $scope.mainNMITransactionObj.PatientId = $scope.mainobj.PatientId;
    //                $scope.mainNMITransactionObj.OrganizationId = $scope.mainobj.OrganizationId;
    //                $scope.mainNMITransactionObj.PaymentAmount = $scope.RefundPaymentObj.RefundAmount;
    //                $scope.mainNMITransactionObj.MerchentId = $scope.mainNMITransactionObj.MerchentId;
    //                $scope.mainNMITransactionObj.MerchentName = $scope.mainNMITransactionObj.MerchentName;
    //                $scope.mainNMITransactionObj.CardHolderName = $scope.mainobj.PatientFullName || "";
    //                $scope.mainNMITransactionObj.PatientEmail = $scope.mainobj.PatientEmailId || "";
    //                $scope.mainNMITransactionObj.PatientMobile = $scope.mainobj.PatientMobile || "";

    //                if ($scope.mainNMITransactionObj.PatientMobile != "") {
    //                    var obj = eHnoteUserDataService.UsMobileFormatChange($scope.mainNMITransactionObj.PatientMobile);
    //                    $scope.mainNMITransactionObj.PatientMobile = obj.UsFormatMobileNumber;
    //                }

    //                $scope.mainNMITransactionObj.PatientMrNo = $scope.mainobj.PatientDisplayId || "";
    //                $scope.mainNMITransactionObj.OrderId = "";
    //                $scope.mainNMITransactionObj.OrderDescription = $scope.RefundPaymentObj.Refundreason || "";
    //                $scope.mainNMITransactionObj.TransactionId = $scope.mainNMITransactionid;
    //                $scope.mainNMITransactionObj.BillPaymentTypeId = $scope.mainobj.PaymentMethods[0].BillPaymentTypeId || 0;
    //                $scope.mainNMITransactionObj.BillPaymentType = $scope.mainobj.PaymentMethods[0].BillPaymentType || "";
    //                $scope.mainNMITransactionObj.ResponseId = 0;
    //                $scope.mainNMITransactionObj.ResponseCode = "";
    //                $scope.mainNMITransactionObj.ResponseText = "";
    //                $scope.mainNMITransactionObj.Status = "";
    //                $scope.mainNMITransactionObj.TransactionTypeId = 5;
    //                $scope.mainNMITransactionObj.TransactionType = "refund";
    //                $scope.mainNMITransactionObj.DeleteInd = "N";
    //                $scope.mainNMITransactionObj.Type = "refund";
    //                $scope.mainNMITransactionObj.AppointmentId = $scope.mainobj.AppointmentId || 0;
    //                $scope.mainNMITransactionObj.VisitId = $scope.mainobj.VisitId || 0;


    //                eHnotePaymentGatewayService.NMIPaymentTransactionRefund($scope.mainNMITransactionObj).then(function (resp) {
    //                    var res = resp.data || {};
    //                    console.log(res)
    //                    if (res.Status == "Success") {
    //                        alertify.success(res.Status);

    //                        $scope.SaveRefundDepositData();
    //                    }
    //                })

    //            };

    //            $scope.SavePatientRefundPOS = function () {

    //                $scope.RefundPaymentObj.RefundAmount = $scope.RefundPaymentObj.RefundAmount || null;
    //                $scope.RefundPaymentObj.RefundreasonId = $scope.RefundPaymentObj.RefundreasonId || null;
    //                if ($scope.RefundPaymentObj.RefundAmount == null) {
    //                    alertify.error("Please Enter Refund Amount");
    //                    return;
    //                }
    //                if ($scope.RefundPaymentObj.RefundreasonId == null) {
    //                    alertify.error("Please Select Refund Reason");
    //                    return;
    //                }

    //                let editItem = $scope.mainobj;


    //                $scope.PatientSearchObj = {
    //                    PatientId: editItem.PatientId,
    //                    SearchText: editItem.FullName,
    //                    PatientFullName: editItem.FullName,
    //                    DOB: editItem.DOB,
    //                    PatientMRNo: editItem.DisplayID,
    //                    MobileNo: editItem.PhoneNumber,
    //                    Gender: editItem.Gender,
    //                    AgeInYears: editItem.AgeInYears,
    //                    AgeInMonths: editItem.AgeInMonths,
    //                    S3URL: editItem.S3URL
    //                };

    //                $scope.UserId = editItem.CreatedByUserId;
    //                // $scope.PaymentsObj.PaymentAmount = editItem.PatientPaymentAmount;

    //                $scope.PaymentsObj = getPaymentsObj();
    //                $scope.mainPosObject = {
    //                    InvoiceId: editItem.InvoiceId,
    //                    PatientId: editItem.PatientId,
    //                    PatientName: editItem.PatientName || '',
    //                    BuyerName: editItem.PatientName || '',
    //                    BuyerId: editItem.PatientId || '',
    //                    IsEmployee: editItem.IsEmployee || false,
    //                    SoldByUserId: editItem.SoldByUserId,
    //                    SoldBy: editItem.SoldBy || '',
    //                    BillingProviderId: editItem.BillingProviderId,
    //                    BillingProviderName: editItem.BillingProviderName || '',
    //                    RenderingProviderId: editItem.RenderingProviderId,
    //                    RenderingProviderName: editItem.RenderingProviderName || '',
    //                    InvoiceDate: $filter('date')(editItem.InvoiceDate, "yyyy-MM-dd"),
    //                    DiscountReasonId: editItem.DiscountReasonId,
    //                    DiscountReasonCode: editItem.DiscountReasonCode || '',
    //                    OverallDiscountValue: editItem.OverallDiscountValue || 0,
    //                    OverallDiscountType: editItem.OverallDiscountType || 'A',
    //                    TotalChargeAmount: editItem.TotalChargeAmount || 0,
    //                    TotalDiscountAmount: editItem.TotalDiscountAmount || 0,
    //                    TotalNetAmount: editItem.TotalNetAmount || 0,
    //                    PatientPaymentAmount: editItem.PatientPaymentAmount || 0,
    //                    PatientBalanceAmount: editItem.PatientBalanceAmount || 0,
    //                    WriteOffAmount: editItem.WriteOffAmount || 0,
    //                    TotalBalanceAmount: editItem.TotalBalanceAmount || 0,
    //                    PaymentStatus: editItem.PaymentStatus || '',
    //                    ReferenceNumber: editItem.ReferenceNumber || '',
    //                    PaymentStatusId: editItem.PaymentStatusId,
    //                    DeleteInd: editItem.DeleteInd || 'N',
    //                    InvoiceItems: []
    //                };

    //                $scope.PaymentsObj.PatientDepositPaymodeList = editItem.PaymentMethods;
    //                $scope.TotalPatientPaymentBalance = 0;
    //                let refundAmount = $scope.RefundPaymentObj.RefundAmount;

    //                for (let i = 0; i < editItem.InvoiceItems.length; i++) {

    //                    let paidAmount = editItem.InvoiceItems[i].PatientPaymentAmount;

    //                    if (refundAmount <= 0) {
    //                        break;
    //                    }

    //                    if (refundAmount >= paidAmount) {

    //                        editItem.InvoiceItems[i].PatientPaymentAmount -= paidAmount;
    //                        editItem.InvoiceItems[i].PatientBalanceAmount += paidAmount;
    //                        $scope.TotalPatientPaymentBalance -= paidAmount;
    //                        refundAmount -= paidAmount;
    //                    } else {

    //                        editItem.InvoiceItems[i].PatientPaymentAmount -= refundAmount;
    //                        editItem.InvoiceItems[i].PatientBalanceAmount += refundAmount;
    //                        $scope.TotalPatientPaymentBalance -= refundAmount;
    //                        refundAmount = 0;
    //                        break;
    //                    }
    //                }

    //                angular.forEach(editItem.InvoiceItems, function (item) {

    //                    let refundedAmount = (item.TotalNetAmount || 0) - item.PatientPaymentAmount;

    //                    let PosTransaction = [];
    //                    if (refundedAmount > 0) {
    //                        let Tranobj = {
    //                            "InvoiceItemTransactionId": 0,
    //                            "InvoiceItemId": item.InvoiceItemId,
    //                            "OrganizationId": $scope.HospitalId,
    //                            "TransactionDate": $filter('date')($scope.CurreDate, "yyyy-MM-dd"),
    //                            "TransactionAmount": -refundedAmount,
    //                            "PatientAmount": -refundedAmount,
    //                            "PatientDepositId": null,
    //                            "AdjustmentReasonId": null,
    //                            "AdjustmentReasonCode": null,
    //                            "ReferenceNumber": $scope.RefundPaymentObj.ReferenceNumber || "",
    //                            "TransactionTypeId": 3,
    //                            "TransactionType": "Refund",
    //                            "TransactionSourceId": 10,
    //                            "TransactionSource": "POS",
    //                            "SettlementStatusId": 4,
    //                            "SettlementStatus": "Refunded",
    //                            "TransactionNotes": "POS refund issued",
    //                            "DeleteInd": 'N'
    //                        };
    //                        PosTransaction.push(Tranobj);
    //                    }

    //                    let subobj = {
    //                        "InvoiceItemId": item.InvoiceItemId || null,
    //                        "InvoiceId": item.InvoiceId || null,
    //                        "ItemMasterId": item.ItemMasterId || null,
    //                        "ItemMasterName": item.ItemMaster || "",
    //                        "OrganizationItemId": item.OrganizationItemId || null,
    //                        "Quantity": item.Quantity || null,
    //                        "UnitPrice": item.UnitPrice || null,
    //                        "TotalChargeAmount": item.TotalChargeAmount || 0,
    //                        "DiscountValue": item.DiscountValue || null,
    //                        "DiscountType": item.DiscountType || "",
    //                        "DiscountAmount": $scope.mainPosObject.OverallDiscountValue == 0 ?
    //                            item.DiscountType === "%" ? ((item.DiscountAmount / 100) * item.TotalChargeAmount) : item.DiscountAmount : item.DiscountAmount,
    //                        "TotalNetAmount": item.TotalNetAmount || 0,
    //                        "PatientPaymentAmount": item.PatientPaymentAmount || 0,
    //                        "PatientBalanceAmount": item.PatientBalanceAmount || 0,
    //                        "WriteOffAmount": item.WriteOffAmount || 0,
    //                        "BalanceAmount": item.BalanceAmount || 0,
    //                        "DeleteInd": item.DeleteInd,
    //                        "Transactions": PosTransaction
    //                    };

    //                    $scope.mainPosObject.InvoiceItems.push(subobj);
    //                });


    //                var tempPayments = [];



    //                if ($scope.RefundPaymentObj.RefundAmount != null) {

    //                    angular.forEach($scope.PaymentsObj.PatientDepositPaymodeList, function (sitem) {

    //                        let obj = {
    //                            "PaymentId": 0,
    //                            "InvoiceId": $scope.mainPosObject.InvoiceId || 0,
    //                            "PaymentMethodId": sitem.PaymentMethodId || null,
    //                            "PaymentMethod": sitem.PaymentMethodName || "",
    //                            "PaymentAmount": $scope.RefundPaymentObj.RefundAmount || null,
    //                            "PatientDepositId": sitem.PatientDepositId || null,
    //                            "TransactionTypeId": 3,
    //                            "TransactionType": "Refund",
    //                            "DeleteInd": "N",
    //                            "CardNumber": sitem.CardNumber || '',
    //                            "CardType": sitem.CardType || '',
    //                            "CardtypeId": sitem.CardTypeId || 0,
    //                            "NMITransactionId": sitem.NMITransactionId || "",
    //                            "OnlineTransactionNumber": sitem.OnlineTransactionNumber || null,
    //                            "PaymentProcessTypeId": sitem.PaymentProcessTypeId || null,
    //                            "PaymentProcessType": sitem.PaymentProcessType || null,
    //                            "BillPaymentTypeId": sitem.BillPaymentTypeId || null,
    //                            "BillPaymentType": sitem.BillPaymentType || null,
    //                            "RefundNotes": $scope.RefundPaymentObj.RefundNotes || "",
    //                        };
    //                        tempPayments.push(obj);

    //                    });
    //                }




    //                let param = {
    //                    "UserId": $scope.UserId,
    //                    "InvoiceId": $scope.mainPosObject.InvoiceId,
    //                    "PatientId": $scope.mainPosObject.PatientId,
    //                    "PatientName": $scope.mainPosObject.PatientName,
    //                    "OrganizationId": $scope.HospitalId,
    //                    "PatientPaymentAmount": ($scope.mainPosObject.PatientPaymentAmount || 0) - $scope.RefundPaymentObj.RefundAmount,
    //                    "PatientBalanceAmount": ($scope.mainPosObject.PatientBalanceAmount || 0) + $scope.RefundPaymentObj.RefundAmount,
    //                    "WriteOffAmount": $scope.mainPosObject.WriteOffAmount || 0,
    //                    "TotalBalanceAmount": ($scope.mainPosObject.TotalBalanceAmount || 0) + $scope.RefundPaymentObj.RefundAmount,
    //                    "DeleteInd": $scope.mainPosObject.DeleteInd || "N",
    //                    "InvoiceItems": $scope.mainPosObject.InvoiceItems || [],
    //                    "Payments": tempPayments || [],
    //                    "PaymentStatus": "Refund",
    //                    "PaymentStatusId": 5,
    //                    "POSRefundId": null,
    //                    "ReceiptNo": $scope.RefundPaymentObj.ReceiptNo || "",
    //                    "RefundDate": $filter('date')(new Date(), "MM-dd-yyyy"),
    //                    "RefundAmount": $scope.RefundPaymentObj.RefundAmount || null,
    //                    "RefundByUserId": $scope.UserId,
    //                    "RefundByUser": $scope.RefundPaymentObj.RefundByUser || "",
    //                    "AppointmentId": $scope.RefundPaymentObj.AppointmentID || null,
    //                    "RefundreasonId": $scope.RefundPaymentObj.RefundreasonId || null,
    //                    "RefundReason": $scope.RefundPaymentObj.Refundreason || "",
    //                    "Remarks": $scope.RefundPaymentObj.Remarks || "",
    //                    "CardtypeId": $scope.RefundPaymentObj.CardtypeId || "",
    //                    "RefundPaymentMethodId": $scope.RefundPaymentObj.RefundPaymentMethodId || "",
    //                    "RefundPaymentMethod": $scope.RefundPaymentObj.RefundPaymentMethod || "",
    //                    "RefundStatus": "Initiated",
    //                    "RefundStatusId": "1",
    //                    "ReferenceNumber": $scope.RefundPaymentObj.ReferenceNumber || "",
    //                    "CardNumber": $scope.RefundPaymentObj.CardNumber || "",
    //                    "PatientDepositId": $scope.RefundPaymentObj.PatientDepositId || null,

    //                };
    //                let originalPaymentAmount = $scope.mainPosObject.PatientPaymentAmount || 0;
    //                let refundedAmount = $scope.RefundPaymentObj.RefundAmount || 0;

    //                let paymentStatusText = getRefundStatus(originalPaymentAmount, refundedAmount);

    //                let paymentStatusIdMap = {
    //                    "Partially Refund": 6,
    //                    "Refund": 5
    //                };

    //                param.PaymentStatus = paymentStatusText;
    //                param.PaymentStatusId = paymentStatusIdMap[paymentStatusText];

    //                eHnoteInsuranceService.AddUpdatePOSRefundSale(param).then(function (resp) {
    //                    if (resp.data.Status === "Success") {

    //                        $uibModalInstance.close();

    //                    }
    //                }, function (err) { console.log(err); });
    //            }

    //            $scope.SaveRefundDepositData = function () {
    //                $scope.SavePatientRefundPOS(sitem);
    //            }
    //        }
    //    });

    //    mInstanceAdd.result.then(function () {

    //        $scope.GetOrganizationPOSInvoices();

    //    }, function () { });
    //}

    $scope.depositGreaterThanZero = function (sitem) {
        return sitem.DepositAmount > 0;
    };

    $scope.isToday = function (transactionDateStr) {
        var today = new Date();
        var todayStr = today.toISOString().slice(0, 10);
        return transactionDateStr === todayStr;
    };

    $scope.Showtransactionlist = function (item) {
        angular.forEach($scope.PatientDepositsListArray, function (sitem) {
            if (sitem !== item) {
                sitem.Isshow = false;
            }
        });
        item.Isshow = !item.Isshow;
        if (!item.Isshow) return;
        item.PatientDepositTransactionList = [];

        var obj = {
            "PatientId": item.PatientId,
       /*     "OrganizationId": item.OrganizationId,*/
            "PatientDepositId": item.PatientDepositId
        };


        eHnoteInsuranceService.GetPatientDepositTransactionList(obj).then(function (resp) {
            if (resp.data.Status === "Success") {
                var allTransactions = resp.data.rows || [];

                if (allTransactions.length > 0) {
                    item.IsVoidTransactionInd = allTransactions.some(t => t.PaymentTransactionTypeId === 4);
                    item.IsCancelTransactionInd = allTransactions.some(t => t.PaymentTransactionTypeId === 6);
                }

                item.PatientDepositTransactionList = allTransactions.filter(function (t) {
                    return t.PaymentTransactionTypeId !== 4 && t.PaymentTransactionTypeId !== 6;
                });

            } else {
                alertify.error(resp.data.Message);
            }
        });
    };

    $scope.ViewTransaction = function (item) {

        let mInstanceAdd = $uibModal.open({
            "templateUrl": "DepositTransactionList.html",
            "backdrop": "static",
            "keyboard": false,
            //"size": "lg",
            "windowClass": "modal__ninety-- in",
            "resolve": {
                "item": function () { return item; },
            },
            "controller": function ($scope, $uibModalInstance, eHnoteMasterDataService, item) {

                $scope.uibclose = function () {
                    $uibModalInstance.dismiss("cancel");
                };
                item = item || [];

                $scope.TransactionListData = [];

                $scope.GetPatientTransactionList = function (pageno, type) {

                    var obj = {
                        "PatientId": item.PatientId,
                        /*"OrganizationId": item.OrganizationId,*/
                        "PatientDepositId": item.PatientDepositId

                    };


                    eHnoteInsuranceService.GetPatientTransactionList(obj).then(function (resp) {
                        if (resp.data.Status === "Success") {
                            $scope.TransactionListData = resp.data.rows || [];

                        } else {
                            alertify.error(resp.data.Message);
                        }
                    });
                }
                $scope.GetPatientTransactionList();

            }

        });

    }

    $scope.GetPaymentmethodList = function () {
        var Obj = {
            "PatientDepositPaymodeListId": 0,
            "PaymentMethodId": 1,
            "PaymentMethodName": "Cash",
            "DepositAmount": "",
            "ReferenceNumber": "",
            "IsDepositAdded": false,
            "DeleteInd": "N",
            "PatientDepositId": null,
            "CardNumber": "",
            "CardType": "",
            "CardtypeId": 0,
            "NMITransactionId": ""
        }
        return Obj;
    }


    $scope.AddAnotherPaymentMode = function (item,id) {

        var obj = $scope.GetPatientDepositsObj();

        obj.PatientDepositId = item.PatientDepositId;
        obj.PatientId = item.PatientId;
        obj.ReceiptId = item.ReceiptId;
        obj.ReceiptNo = item.ReceiptNo;
        obj.DepositDate = $filter('date')(item.DepositDate, "MM-dd-yyyy");
        obj.PaymentDate = $filter('date')(item.PaymentDate, "MM-dd-yyyy");
        obj.DepositAmount = 0;
        obj.UnBilledAmount = item.UnBilledAmount;
        obj.BilledAmount = item.BilledAmount;
        obj.Notes = item.Notes;
        obj.DepositedBy = item.DepositedBy;
        obj.DepositedByUserId = $scope.UserId; // Or fetch from item if needed
        obj.OrganizationId = item.OrganizationId;
        obj.OrganizationFacilityId = item.OrganizationFacilityId;
        obj.FacilityName = item.FacilityName;
        obj.BillingProviderId = item.BillingProviderId;
        obj.BillingProviderName = item.BillingProviderName;
        obj.DepositTypeId = item.DepositTypeId;
        obj.DepositTypeName = item.DepositTypeName;
        obj.PaymentMethodId = item.PaymentMethodId;
        obj.PaymentMethodName = item.PaymentMethodName;
        obj.BatchNumber = item.BatchNumber || '';
        obj.AppointmentId = item.AppointmentID;

        obj.IsDepositPrint = false;
        obj.DepositStatusId = item.DepositStatusId;
        obj.DepositStatus = item.DepositStatus;



        $scope.PatientDepositsObj = obj;
        console.log($scope.PatientDetails);

        if ($scope.PatientDepositsObj.PatientId === 0) {
            alertify.error("Please Select Patient ");
            return;
        }


        //if ($scope.PatientDepositsObj.OrganizationFacilityId === 0) {
        //    alertify.error("Please select the location ");
        //    return;
        //}



        var Parentobj = {
            "PatientId": $scope.PatientDepositsObj.PatientId,
            "AppointmentId": $scope.PatientDepositsObj.AppointmentId,
            "PatientFirstName": $scope.PatientDetails.FirstName,
            "PatientLastName": $scope.PatientDetails.LastName,
            "PatientDisplayId": $scope.PatientDetails.PatientDisplayId,
            "PatientEmailId": $scope.PatientDetails.EmailId,
            "PatientGender": $scope.PatientDetails.Gender,
            "PatientAgeInYears": $scope.PatientDetails.AgeInYears,
            "PatientAgeInMonths": $scope.PatientDetails.AgeInMonths,
            "PatientDOB": $scope.PatientDetails.DOB,
            "PatientMobileNumber": $scope.PatientDetails.MobileNo,
            "PatientZipCode": $scope.PatientDetails.ZipCode,
            "UserId": $scope.UserId,
            "HospitalId": $scope.PatientDepositsObj.OrganizationFacilityId,
            "PaymentAmount": $scope.PatientDepositsObj.DepositAmount,
            "DepositDate": $scope.PatientDepositsObj.DepositDate,
            "PaymentModeId": 1,
            "PaymentMode": "Cash",
            "PaymentTypeId": 1,
            "PaymentType": "Deposit",
            "ScreenType": "AddDeposit",
            "AllCardTypes": $scope.AllCardTypes,
            "BillingProviderId": $scope.PatientDepositsObj.BillingProviderId,
            "IsDepositPrint": $scope.PatientDepositsObj.IsDepositPrint,
            "PatientDataObj": $scope.SelectedPatientDetails.PatientObj || {},
            "PatientDepositsObj": $scope.PatientDepositsObj || {},
            "DepositTypeId": $scope.PatientDepositsObj.DepositTypeId,
            "DepositType": $scope.PatientDepositsObj.DepositTypeName,
            "Notes": $scope.PatientDepositsObj.Notes,
            "PatientClaimId": $scope.mainPatientProfileObj.PatientClaimId || null,
            "mainBillerDataObj": {},
            "DepositTypes": $scope.DepositTypes,
            "DepositscreenTypeId": id,
        }
        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/collectPayment.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            "resolve": {
                "Parentobj": function () { return Parentobj; }
            },
            "windowClass": "modal__ninetyfive--",
            "controller": "UsMainNmiPaymentCtrl",
        });
        $scope.mInstanceAdd.result.then(function (resp) {
            console.log(resp);
            if (resp != undefined) {
                if (resp.Status === "Success") {

                    $scope.SelectedPatientDetails.DepositsObj = angular.copy($scope.PatientDepositsObj) || "";
                    $scope.SelectedPatientDetails.DepositsObj.IsDepositPrint = resp.IsDepositPrint || false;
                    if ($scope.SelectedPatientDetails.DepositsObj.IsDepositPrint == true) {
                        $scope.SelectedPatientDetails.DepositsObj.ReceiptNo = resp.ReceiptNo || '';
                        $scope.SelectedPatientDetails.DepositsObj.CreatedBy = resp.CreatedBy || '';
                        $scope.SelectedPatientDetails.DepositsObj.BillingProviderName = resp.BillingProviderName || '';
                        $scope.SelectedPatientDetails.DepositsObj.PatientDepositPaymodeList = resp.PatientDepositPaymodeList || [];
                        $scope.AddDespositePrint($scope.SelectedPatientDetails.DepositsObj, $scope.SelectedPatientDetails.PatientObj, 1);
                    } else {

                    }

                    $scope.PatientDepositsObj = angular.copy($scope.GetPatientDepositsObj());
/*                    $scope.SearchObj = angular.copy($scope.getSearchObj());*/
                    $scope.PaymentMethodObj = angular.copy($scope.GetPaymentmethodList());


                    //$scope.SelectedPatientDetails.PatientObj = "";
                    $scope.SelectedPatientDetails.DepositsObj = "";

                    //if (Selectobj.Allocate == 4) {
                    //    $scope.ViewDepositScreen = true;
                    //} else {
                    //    $scope.ViewDepositScreen = false;
                    //}
                    $scope.showNotes = false;
                }
            }

            $scope.getPatientDepositAmountById();

        }, function (cancel) {
        });
    };

    $scope.RefundPatientDeposit = function (item, sitem) {

        var obj = {
            "AllCardTypes": $scope.AllCardTypes || [],
            "Masterrefundreasons": $scope.Masterrefundreasons || [],
            "AllUsersList": $scope.AllUsersList || [],
        }
        let mInstanceAdd = $uibModal.open({
            "templateUrl": "RefundDepositpopup.html",
            "backdrop": "static",
            "size": "lg",
            "keyboard": false,
            "windowClass": "",
            "resolve": {
                //"PatientDepositsListArray": function () { return $scope.PatientDepositsListArray; },
                "mainobj": function () { return item; },
                "obj": function () { return obj; },
                "sitem": function () { return sitem; },

            },
            "controller": function ($scope, $uibModalInstance, eHnoteMasterDataService, mainobj, datapersistanceFactory, obj, eHnoteInsuranceService, sitem) {
                sitem = sitem || '';
                $scope.mainNMITransactionid = "";
                if (sitem.NMITransactionId !== 0) {
                    $scope.mainNMITransactionid = sitem.OnlineTransactionNumber || "";
                }

                var mObj = datapersistanceFactory.getItem("masterDataArrays");
                $scope.masterPaymentModes = [];
                if (mObj.PaymentModes && mObj.PaymentModes.length > 0) {
                    $scope.masterPaymentModes = mObj.PaymentModes;
                    $scope.filterPaymentModes = function (item) {
                        return ![13, 14].includes(item.PaymentModeId);
                    };
                };
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
                $scope.mainobj = mainobj;
                $scope.Masterrefundreasons = obj.Masterrefundreasons || [];
                $scope.AllCardTypes = obj.AllCardTypes || [];
                $scope.AllUsersList = obj.AllUsersList || [];

                $scope.GetRefundpaymentObj = function () {
                    var obj = {
                        "UserId": $scope.UserId,
                        "RefundByUser": "",
                        "OrganizationId": $scope.HospitalId,
                        "PatientDepositId": $scope.mainobj.PatientDepositId || null,
                        "RefundDepositId": null,
                        "ReceiptNo": $scope.mainobj.ReceiptNo || "",
                        "ReceiptId": 0,
                        "RefundDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                        "RefundAmount": sitem.DepositAmount || null, //$scope.mainobj.UnBilledAmount || null,
                        "RefundBy": "",
                        "DeleteInd": "N",
                        "AppointmentId": $scope.mainobj.AppointmentID || null,
                        "PatientId": $scope.mainobj.PatientId || null,
                        "RefundreasonId": null,
                        "Refundreason": null,
                        "Remarks": null,
                        "CardtypeId": null,
                        "Cardtype": "",
                        "RefundPaymentMethodId": null,
                        "RefundPaymentMethod": "",
                        "ReceiptNumber": "",
                        "ReferenceNumber": "",
                        "CardNumber": "",
                        "DepositStatus": "Refund",
                        "DepositStatusId": "3",
                        "Transactions": [],
                        "PaymentTransactionTypeId": 3,
                        "PaymentTransactionType ": 'Refund'


                    }

                    return obj;
                };


                $scope.init = function () {

                    $scope.RefundPaymentObj = angular.copy($scope.GetRefundpaymentObj());

                    var filtredArray = $filter("filter")($scope.AllUsersList, { "DoctorID": $scope.UserId }, true) || [];
                    if (filtredArray.length > 0) {
                        $scope.RefundPaymentObj.RefundByUser = filtredArray[0].FullName || "";
                    }
                }
                $scope.init();

                $scope.RefundPaymentObj.RefundPaymentMethodId = sitem.PaymentMethodId;
                $scope.RefundPaymentObj.RefundPaymentMethod = sitem.PaymentMethodName;

                if ($scope.RefundPaymentObj.RefundPaymentMethodId == 2 || $scope.RefundPaymentObj.RefundPaymentMethodId == 3) {
                    $scope.RefundPaymentObj.CardNumber = sitem.CardNumber;
                    $scope.RefundPaymentObj.CardtypeId = sitem.CardtypeId;
                    $scope.RefundPaymentObj.Cardtype = sitem.Cardtype;
                }

                $scope.changeRefund = function (id) {
                    var filtredArray = $filter("filter")($scope.Masterrefundreasons, { "RefundreasonId": id }, true) || [];
                    if (filtredArray.length > 0) {
                        $scope.RefundPaymentObj.Refundreason = filtredArray[0].Refundreason || "";
                    }
                }
                $scope.ChangePaymentMode = function (id) {
                    var filtredArray = $filter("filter")($scope.masterPaymentModes, { "PaymentModeId": id }, true) || [];
                    if (filtredArray.length > 0) {
                        $scope.RefundPaymentObj.RefundPaymentMethod = filtredArray[0].PaymentModeName || "";
                    }
                }

                $scope.PatientRefund = function () {


                    let Transactions = [];
                    $scope.RefundPaymentObj.RefundAmount = parseFloat($scope.RefundPaymentObj.RefundAmount) || null;
                    $scope.RefundPaymentObj.RefundreasonId = $scope.RefundPaymentObj.RefundreasonId || null;

                    if ($scope.RefundPaymentObj.RefundAmount == null) {
                        alertify.error("Please Enter Refund Amount");
                        return;
                    }
                    if ($scope.RefundPaymentObj.RefundreasonId == null) {
                        alertify.error("Please Select Refund Reason");
                        return;
                    }
                    if ($scope.RefundPaymentObj.RefundAmount > $scope.mainobj.UnBilledAmount) {
                        alertify.error("RefundAmount exceeds the UnBilledAmount. Please Enter the Lesser Amount.");
                        return;
                    }
                    if ($scope.RefundPaymentObj.RefundAmount != null) {
                        let obj3 = {

                            "UserId": $scope.UserId,
                            "PatientId": $scope.mainobj.PatientId || null,
                            "RefundDepositId": null,
                            "RefundTransactionId": 0,
                            "PatientDepositId": $scope.mainobj.PatientDepositId,
                            "OrganizationId": $scope.HospitalId,
                            "TransactionDate": $filter('date')($scope.RefundPaymentObj.RefundDate, "MM-dd-yyyy"),
                            "TransactionAmount": -+$scope.RefundPaymentObj.RefundAmount,
                            "RefundAmount": -+$scope.RefundPaymentObj.RefundAmount,
                            "TransactionSourceId": 3,
                            "TransactionSource": "Patient",
                            "DeleteInd": "N",

                        }
                        Transactions.push(obj3);
                    }

                    var params = {
                        "UserId": $scope.UserId,
                        "OrganizationId": $scope.HospitalId,
                        "DepositStatus": "Refund",
                        "DepositStatusId": "3",
                        "PatientDepositId": $scope.RefundPaymentObj.PatientDepositId || null,
                        "RefundDepositId": null,
                        "ReceiptNo": $scope.RefundPaymentObj.ReceiptNo || "",
                        "RefundDate": $filter('date')($scope.RefundPaymentObj.RefundDate, "MM-dd-yyyy"),
                        "RefundAmount": $scope.RefundPaymentObj.RefundAmount || null,
                        "RefundByUserId": $scope.UserId,
                        "RefundByUser": $scope.RefundPaymentObj.RefundByUser || "",
                        "DeleteInd": "N",
                        "AppointmentId": $scope.RefundPaymentObj.AppointmentId || null,
                        "PatientId": $scope.RefundPaymentObj.PatientId || null,
                        "RefundreasonId": $scope.RefundPaymentObj.RefundreasonId || null,
                        "RefundReason": $scope.RefundPaymentObj.Refundreason || "",
                        "Remarks": $scope.RefundPaymentObj.Remarks || "",
                        "CardtypeId": $scope.RefundPaymentObj.CardtypeId || "",
                        "RefundPaymentMethodId": $scope.RefundPaymentObj.RefundPaymentMethodId || "",
                        "RefundPaymentMethod": $scope.RefundPaymentObj.RefundPaymentMethod || "",
                        "RefundStatus": "Initiated",
                        "RefundStatusId": "1",

                        "ReferenceNumber": $scope.RefundPaymentObj.ReferenceNumber || "",
                        "CardNumber": $scope.RefundPaymentObj.CardNumber || "",
                        "Transactions": Transactions || [],
                        "PatientDepositPaymodeListId": sitem.PatientDepositPaymodeListId



                    }

                    console.log(JSON.stringify(params));


                    eHnoteInsuranceService.AddUpdatePatientDepositRefund(params).then(function (resp) {
                        if (resp.data.Status == "Success") {
                            $uibModalInstance.close("cancel");
                        }

                    }, function (err) {

                    });
                }


                $scope.navtoNMIPatientRefund = function (item) {
                    $scope.RefundPaymentObj.RefundAmount = $scope.RefundPaymentObj.RefundAmount || null;
                    $scope.RefundPaymentObj.RefundreasonId = $scope.RefundPaymentObj.RefundreasonId || null;
                    if ($scope.RefundPaymentObj.RefundAmount == null) {
                        alertify.error("Please Enter Refund Amount");
                        return;
                    }
                    if ($scope.RefundPaymentObj.RefundreasonId == null) {
                        alertify.error("Please Select Refund Reason");
                        return;
                    }

                    if ($scope.mainNMITransactionid == "") {
                        alertify.error("you cannot perform void, as TransactionId is empty");
                        return false;
                    }
                    $scope.RefundPaymentObj.Remarks = $scope.RefundPaymentObj.Remarks || "";
                    if ($scope.RefundPaymentObj.Remarks == "" || $scope.RefundPaymentObj.Remarks == null) {
                        alertify.error("Please enter Refund remarks.");
                        return false;
                    }
                    $scope.mainNMITransactionObj = angular.copy(eHnoteCacheStorageService.getNMITransactionMainObject());
                    $scope.mainNMITransactionObj.NMITransactionId = 0;
                    $scope.mainNMITransactionObj.UserId = $scope.UserId;
                    $scope.mainNMITransactionObj.PatientId = $scope.mainobj.PatientId;
                    $scope.mainNMITransactionObj.OrganizationId = $scope.mainobj.OrganizationId;
                    $scope.mainNMITransactionObj.PaymentAmount = $scope.mainobj.PatientDepositPaymodeList[0].DepositAmount;
                    $scope.mainNMITransactionObj.MerchentId = $scope.mainNMITransactionObj.MerchentId;
                    $scope.mainNMITransactionObj.MerchentName = $scope.mainNMITransactionObj.MerchentName;
                    $scope.mainNMITransactionObj.CardHolderName = $scope.mainobj.PatientFullName || "";
                    $scope.mainNMITransactionObj.PatientEmail = $scope.mainobj.PatientEmailId || "";
                    $scope.mainNMITransactionObj.PatientMobile = $scope.mainobj.PatientMobile || "";

                    if ($scope.mainNMITransactionObj.PatientMobile != "") {
                        var obj = eHnoteUserDataService.UsMobileFormatChange($scope.mainNMITransactionObj.PatientMobile);
                        $scope.mainNMITransactionObj.PatientMobile = obj.UsFormatMobileNumber;
                    }

                    $scope.mainNMITransactionObj.PatientMrNo = $scope.mainobj.PatientDisplayId || "";
                    $scope.mainNMITransactionObj.OrderId = "";
                    $scope.mainNMITransactionObj.OrderDescription = $scope.RefundPaymentObj.Refundreason || "";
                    $scope.mainNMITransactionObj.TransactionId = $scope.mainNMITransactionid;
                    $scope.mainNMITransactionObj.BillPaymentTypeId = $scope.mainobj.PatientDepositPaymodeList[0].BillPaymentTypeId || 0;
                    $scope.mainNMITransactionObj.BillPaymentType = $scope.mainobj.PatientDepositPaymodeList[0].BillPaymentType || "";
                    $scope.mainNMITransactionObj.ResponseId = 0;
                    $scope.mainNMITransactionObj.ResponseCode = "";
                    $scope.mainNMITransactionObj.ResponseText = "";
                    $scope.mainNMITransactionObj.Status = "";
                    $scope.mainNMITransactionObj.TransactionTypeId = 5;
                    $scope.mainNMITransactionObj.TransactionType = "refund";
                    $scope.mainNMITransactionObj.DeleteInd = "N";
                    $scope.mainNMITransactionObj.Type = "refund";
                    $scope.mainNMITransactionObj.AppointmentId = $scope.mainobj.AppointmentId || 0;
                    $scope.mainNMITransactionObj.VisitId = $scope.mainobj.VisitId || 0;


                    eHnotePaymentGatewayService.NMIPaymentTransactionRefund($scope.mainNMITransactionObj).then(function (resp) {
                        var res = resp.data || {};
                        console.log(res)
                        if (res.Status == "Success") {
                            alertify.success(res.Status);

                            $scope.PatientRefund();
                        }
                    })

                };

                $scope.uibclose = function () {
                    $uibModalInstance.dismiss("cancel");
                };
            }

        });

        mInstanceAdd.result.then(function () {

            $scope.getPatientDepositAmountById();
            $scope.ViewDepositScreen = false;
            $scope.ClearPatientDeposit();

        }, function () { });
    }
    $scope.GetPatientVoidDepositList = function (pageno, type) {

        var obj = {
            "PatientId": $scope.mainPatientProfileObj.PatientId ,
            "OrganizationId": $scope.HospitalId,

        };


        eHnoteInsuranceService.GetPatientVoidandRefundDepositList(obj).then(function (resp) {
            if (resp.data.Status === "Success") {
                $scope.VoidList = resp.data.rows || [];

            } else {
                alertify.error(resp.data.Message);
            }
        });
    }

    $scope.GetPatientVoidDepositList();
    $scope.VoidPatientDeposit = function (item, sitem) {

        var mInstanceAdd = $uibModal.open({
            "templateUrl": "VoidReasonPopUp.html",
            "size": "sm",
            "backdrop": "static",
            "keyboard": false,
            "windowClass": " ",
            "resolve": {
                "item": function () { return item; },
                "UserId": function () { return $scope.UserId; },
                "HospitalId": function () { return $scope.HospitalId; },
                "sitem": function () { return sitem; },
            },
            "controller": function ($scope, $uibModal, $uibModalInstance, item, UserId, HospitalId, sitem) {
                item = item || '';

                console.log(JSON.stringify(item));
                $scope.uibclose = function () {
                    $uibModalInstance.close("cancel");
                }
                $scope.mainNMITransactionid = "";
                if (sitem.NMITransactionId !== 0) {
                    $scope.mainNMITransactionid = sitem.OnlineTransactionNumber || "";
                }


                //$scope.getVoidPatientObj = function () {
                //    var Obj = {
                //        "VoidRemarks": ''
                //    }
                //    return Obj;
                //}

                $scope.VoidPatientObj = {
                    "VoidRemarks": '',
                }

                $scope.SaveVoidDepositData = function () {
                    $scope.SavePatientVoidDeposit(item);
                }

                //$scope.SavePatientVoidDeposit = function (item) {

                //    if ($scope.VoidPatientObj.VoidRemarks == '') {
                //        alertify.error("Please enter Remarks.");
                //        return false;
                //    }

                //    var ConvertedDate = $filter('date')(item.DepositDate, "MM-dd-yyyy");
                //    var PaymentDate = $filter("usdateFormatter")(item.PaymentDate, "-");

                //    var obj = {
                //        "UserId": UserId,
                //        "OrganizationId": HospitalId,
                //        "PatientDepositId": item.PatientDepositId || 0,
                //        "PatientId": item.PatientId || 0,
                //        "ReceiptNo": "",
                //        "ReceiptId": 0,
                //        "DepositDate": ConvertedDate,
                //        "PaymentDate": PaymentDate,
                //        "DepositAmount": sitem.DepositAmount || null,// item.DepositAmount || 0,
                //        /*"DepositedByUserId": $scope.PatientDepositsObj.DepositedByUserId,*/
                //        "DepositedBy": item.DepositedBy,
                //        "UnBilledAmount": item.UnBilledAmount,
                //        "BilledAmount": 0,
                //        "DeleteInd": "N",
                //        "AppointmentId": item.AppointmentID,
                //        "BillingProviderId": item.BillingProviderId,
                //        "DepositTypeId": item.DepositTypeId,
                //        "DepositType": item.DepositTypeName,
                //        "PaymentMethodId": item.PaymentMethodId,
                //        "PaymentMethodName": item.PaymentMethodName,
                //        /* "ChequeNumber": $scope.PatientDepositsObj.ChequeNumber,*/
                //        "CardNumber": "",
                //        /* "OnlineTransactionNumber": $scope.PatientDepositsObj.OnlineTransactionNumber || '',*/
                //        "CardName": "",
                //        "CardExpiry": "",
                //        "Notes": item.Notes,
                //        "BatchNumber": item.BatchNumber,
                //        "OrganizationFacilityId": item.OrganizationFacilityId,
                //        "FacilityName": item.FacilityName,
                //        "DepositStatusId": 2,
                //        "DepositStatus": "Void Deposit",
                //        "PageSize": 10,
                //        "PageNumber": 1,
                //        "PatientDepositPaymodeList": item.PatientDepositPaymodeList || [],
                //        "VoidRemarks": $scope.VoidPatientObj.VoidRemarks || '',
                //        "PatientDepositPaymodeListId": sitem.PatientDepositPaymodeListId,
                //        "PaymentActionTypeId": 4,
                //        "PaymentActionType": 'VOid'
                //    }

                //    eHnoteInsuranceService.AddUpdatePatientDepositAmount(obj).then(function (resp) {
                //        if (resp.data.Status == "Success") {
                //        }
                //        $scope.uibclose();
                //    }, function (err) {

                //    });
                //}


                $scope.SavePatientVoidDeposit = function (item, sitem) {
                    if ($scope.VoidPatientObj.VoidRemarks == '') {
                        alertify.error("Please enter Remarks.");
                        return false;
                    }

                    var Obj = {
                        "OrganizationId": HospitalId,
                        "TransactionId": sitem.TransReciptNo,
                        "PatientDepositId": item.PatientDepositId || 0,
                        "Amount": sitem.TransactionAmount || 0,
                        "PaymentTransactionTypeId": 4,
                        "PaymentTransactionType": 'Void',
                        "TransactionDate": $filter("date")(sitem.TransactionDate, "MM-dd-yyyy") || "",
                        "NMITransactionId": sitem.NMITransactionId,
                        "PatientDepositPaymodeListId": sitem.PatientDepositPaymodeListId,
                        "EOBId": 0,
                        "UserId": UserId,
                        "VoidRemarks": $scope.VoidPatientObj.VoidRemarks,
                    }

                    eHnoteInsuranceService.AddUpdatePatientDepositVoid(Obj).then(function (resp) {
                        if (resp.data.Status == "Success") {
                        }
                        $scope.uibclose();
                    }, function (err) {

                    });


                }


                $scope.SaveOnlineVoidDeposit = function () {
                    $scope.navtoVoidOnlinePayment(item);
                }

                $scope.navtoVoidOnlinePayment = function (item) {
                    $scope.VoidPatientObj.VoidRemarks = $scope.VoidPatientObj.VoidRemarks || "";
                    if ($scope.VoidPatientObj.VoidRemarks == '') {
                        alertify.error("Please enter Remarks.");
                        return false;
                    }

                    if ($scope.mainNMITransactionid == "") {
                        alertify.error("you cannot perform void, as TransactionId is empty");
                        return false;
                    }

                    $scope.mainNMITransactionObj = angular.copy(eHnoteCacheStorageService.getNMITransactionMainObject());
                    $scope.mainNMITransactionObj.NMITransactionId = 0;
                    $scope.mainNMITransactionObj.UserId = UserId;
                    $scope.mainNMITransactionObj.PatientId = item.PatientId;
                    $scope.mainNMITransactionObj.OrganizationId = item.OrganizationId;
                    $scope.mainNMITransactionObj.PaymentAmount = sitem.DepositAmount;
                    $scope.mainNMITransactionObj.MerchentId = "";
                    $scope.mainNMITransactionObj.MerchentName = "ehnotesandbox";
                    $scope.mainNMITransactionObj.CardHolderName = item.PatientFullName || "";
                    $scope.mainNMITransactionObj.PatientEmail = item.PatientEmailId || "";
                    $scope.mainNMITransactionObj.PatientMobile = item.PatientMobile || "";

                    if ($scope.mainNMITransactionObj.PatientMobile != "") {
                        var obj = eHnoteUserDataService.UsMobileFormatChange($scope.mainNMITransactionObj.PatientMobile);
                        $scope.mainNMITransactionObj.PatientMobile = obj.UsFormatMobileNumber;
                    }

                    $scope.mainNMITransactionObj.PatientMrNo = item.PatientDisplayId || "";
                    $scope.mainNMITransactionObj.OrderId = "";
                    $scope.mainNMITransactionObj.OrderDescription = $scope.VoidPatientObj.VoidRemarks || "";
                    $scope.mainNMITransactionObj.TransactionId = $scope.mainNMITransactionid;
                    $scope.mainNMITransactionObj.BillPaymentTypeId = sitem.BillPaymentTypeId || 0;
                    $scope.mainNMITransactionObj.BillPaymentType = sitem.BillPaymentType || "";
                    $scope.mainNMITransactionObj.ResponseId = 0;
                    $scope.mainNMITransactionObj.ResponseCode = "";
                    $scope.mainNMITransactionObj.ResponseText = "";
                    $scope.mainNMITransactionObj.Status = "";
                    $scope.mainNMITransactionObj.TransactionTypeId = 4;
                    $scope.mainNMITransactionObj.TransactionType = "void";
                    $scope.mainNMITransactionObj.DeleteInd = "N";
                    $scope.mainNMITransactionObj.Type = "void";
                    $scope.mainNMITransactionObj.AppointmentId = item.AppointmentId || 0;
                    $scope.mainNMITransactionObj.VisitId = item.VisitId || 0;


                    eHnotePaymentGatewayService.NMIPaymentTransactionVoid($scope.mainNMITransactionObj).then(function (resp) {
                        console.log(resp.data);

                        var res = resp.data || {};
                        if (res.Status == "Success") {
                            alertify.success(res.responseText);

                            $scope.SavePatientVoidDeposit(item);
                        }
                    })

                };
            }
        });

        mInstanceAdd.result.then(function () {

            $scope.getPatientDepositAmountById();
            $scope.ViewDepositScreen = false;
            $scope.ClearPatientDeposit();
            $scope.GetPatientVoidDepositList();

        }, function () { });
    }
    $scope.clickviewcardpopup = function (item, type) {

        // Filter the PatientInsuranceList based on the item.AppointmentInsuranceDetailId
        $scope.PatientInsuranceList = $scope.PatientInsuranceList || [];
        if ($scope.PatientInsuranceList.length==0) {
            return false;
        }
        let filteredPatientInsuranceList = $scope.PatientInsuranceList.filter(function (insurance) {
            return insurance.PatientInsuranceDetailId === item.PatientInsuranceDetailId;
        });
        console.log(filteredPatientInsuranceList);
        let mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/viewcardpopup.html",
            "size": "lg",
            "backdrop": "static",
            "keyboard": false,
            "scope": $scope,
            "windowClass": " ",
            "resolve": {
                "InsuranceSummary": function () { return item; },
                "TypeInsurance": function () { return type; },
                "PatientInsuranceList": function () { return filteredPatientInsuranceList; }
            },
            "controller": function ($scope, $uibModal, $uibModalInstance, InsuranceSummary, TypeInsurance, PatientInsuranceList) {

                $scope.InsuranceData = InsuranceSummary || [];
                $scope.InsuranceType = TypeInsurance || ''
                $scope.PatientInsuranceList = PatientInsuranceList || [];
                if ($scope.PatientInsuranceList.length > 0) {
                    $scope.PatientInsuranceDocumentList = $scope.PatientInsuranceList[0].PatientDocumentDetails || [];
                }
                $scope.uibclose = function () {
                    $uibModalInstance.dismiss("cancel");
                };
            }
        });
    };

    $scope.RefundPatientDepositdata = function (item, ID) {
        $scope.ViewDepositScreen = false;
        var obj = {
            "AllCardTypes": $scope.AllCardTypes || [],
            "Masterrefundreasons": $scope.Masterrefundreasons || [],
            "AllUsersList": $scope.AllUsersList || [],
        }
        let mInstanceAdd = $uibModal.open({
            "templateUrl": "RefundDepositpopup.html",
            "backdrop": "static",
            "size": "lg",
            "keyboard": false,
            "windowClass": "",
            "resolve": {
                //"PatientDepositsListArray": function () { return $scope.PatientDepositsListArray; },
                "mainobj": function () { return item; },
                "obj": function () { return obj; },
                "ID": function () { return ID; },

            },
            "controller": function ($scope, $uibModalInstance, eHnoteMasterDataService, mainobj, datapersistanceFactory, obj, eHnoteInsuranceService, ID) {
                ID = ID || '';
                $scope.mainNMITransactionid = "";
                //if (mainobj.NMITransactionId !== 0) {
                //    $scope.mainNMITransactionid = mainobj.OnlineTransactionNumber || "";
                //}
                $scope.IsRefundDisable = true;

                var mObj = datapersistanceFactory.getItem("masterDataArrays");
                $scope.masterPaymentModes = [];
                if (mObj.PaymentModes && mObj.PaymentModes.length > 0) {
                    $scope.masterPaymentModes = mObj.PaymentModes;
                    $scope.filterPaymentModes = function (item) {
                        return ![13, 14].includes(item.PaymentModeId);
                    };
                };
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
                $scope.mainobj = mainobj;
                $scope.Masterrefundreasons = obj.Masterrefundreasons || [];
                $scope.AllCardTypes = obj.AllCardTypes || [];
                $scope.AllUsersList = obj.AllUsersList || [];

                $scope.GetRefundpaymentObj = function () {
                    var obj = {
                        "UserId": $scope.UserId,
                        "RefundByUser": "",
                        "OrganizationId": $scope.mainobj.OrganizationId,
                        "PatientDepositId": $scope.mainobj.PatientDepositId || null,
                        "RefundDepositId": null,
                        "ReceiptNo": $scope.mainobj.ReceiptNo || "",
                        "ReceiptId": 0,
                        "RefundDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                        "RefundAmount": mainobj.UnBilledAmount || null,
                        "RefundBy": "",
                        "DeleteInd": "N",
                        "AppointmentId": $scope.mainobj.AppointmentID || null,
                        "PatientId": $scope.mainobj.PatientId || null,
                        "RefundreasonId": null,
                        "Refundreason": null,
                        "Remarks": null,
                        "CardtypeId": null,
                        "Cardtype": "",
                        "RefundPaymentMethodId": 5,
                        "RefundPaymentMethod": "Check",
                        "ReceiptNumber": "",
                        "ReferenceNumber": "",
                        "CardNumber": "",
                        "DepositStatus": "Refund",
                        "DepositStatusId": "3",
                        "Transactions": [],
                        "IsCheckedRefund": false,


                    }

                    return obj;
                };



                $scope.RefundPaymentObj = angular.copy($scope.GetRefundpaymentObj());

                if (mainobj.PatientDepositPaymodeList.length == 1) {
                    if (mainobj.PatientDepositPaymodeList[0].NMITransactionId !== 0) {
                        $scope.mainNMITransactionid = mainobj.PatientDepositPaymodeList[0].OnlineTransactionNumber || "";
                    }
                }

                $scope.handlePatPaymentRefundCheckbox = function (item) {
                    if (item.IsCheckedRefund == true) {
                        if (mainobj.PatientDepositPaymodeList.length == 1) {
                            if (mainobj.PatientDepositPaymodeList[0].NMITransactionId !== 0) {
                                $scope.RefundPaymentObj.RefundPaymentMethodId = mainobj.PatientDepositPaymodeList[0].PaymentMethodId || 5;
                                $scope.RefundPaymentObj.RefundPaymentMethod = mainobj.PatientDepositPaymodeList[0].PaymentMethodName || '';
                                $scope.RefundPaymentObj.CardtypeId = mainobj.PatientDepositPaymodeList[0].CardtypeId || null;
                                $scope.RefundPaymentObj.Cardtype = mainobj.PatientDepositPaymodeList[0].CardType || null;
                                $scope.RefundPaymentObj.CardNumber = mainobj.PatientDepositPaymodeList[0].CardNumber || '';
                            }
                        }
                        $scope.RefundPaymentObj.IsCheckedRefund = true;
                    } else {
                        $scope.RefundPaymentObj = angular.copy($scope.GetRefundpaymentObj());
                        $scope.RefundPaymentObj.IsCheckedRefund = false;
                    }
                };


                $scope.changeIndividualRefund = function (amount) {
                    if (amount > mainobj.UnBilledAmount) {
                        alertify.error("Refund Amount should not be greater than the Unallocated Deposit Amount.");
                        $scope.RefundPaymentObj.RefundAmount = '';
                        return false;
                    } else {

                    }
                }

                $scope.init = function () {

                   /* $scope.RefundPaymentObj = angular.copy($scope.GetRefundpaymentObj());*/

                    var filtredArray = $filter("filter")($scope.AllUsersList, { "DoctorID": $scope.UserId }, true) || [];
                    if (filtredArray.length > 0) {
                        $scope.RefundPaymentObj.RefundByUser = filtredArray[0].FullName || "";
                    }
                }
                $scope.init();



                $scope.changeRefund = function (id) {
                    var filtredArray = $filter("filter")($scope.Masterrefundreasons, { "RefundreasonId": id }, true) || [];
                    if (filtredArray.length > 0) {
                        $scope.RefundPaymentObj.Refundreason = filtredArray[0].Refundreason || "";
                    }
                }
                $scope.ChangePaymentMode = function (id) {
                    var filtredArray = $filter("filter")($scope.masterPaymentModes, { "PaymentModeId": id }, true) || [];
                    if (filtredArray.length > 0) {
                        $scope.RefundPaymentObj.RefundPaymentMethod = filtredArray[0].PaymentModeName || "";
                    }
                }

                $scope.PatientRefund = function () {


                    let Transactions = [];
                    $scope.RefundPaymentObj.RefundAmount = parseFloat($scope.RefundPaymentObj.RefundAmount) || null;
                    $scope.RefundPaymentObj.RefundreasonId = $scope.RefundPaymentObj.RefundreasonId || null;


                    if ($scope.RefundPaymentObj.RefundreasonId == null) {
                        alertify.error("Please Select Refund Reason");
                        return;
                    }
                    if ($scope.RefundPaymentObj.RefundAmount == null || $scope.RefundPaymentObj.RefundAmount == 0) {
                        alertify.error("Please Enter Refund Amount");
                        return;
                    }
                    if ($scope.RefundPaymentObj.RefundAmount > $scope.mainobj.UnBilledAmount) {
                        alertify.error("RefundAmount exceeds the UnBilledAmount. Please Enter the Lesser Amount.");
                        return;
                    }
                    if ($scope.RefundPaymentObj.Remarks == "" || $scope.RefundPaymentObj.Remarks == null) {
                        alertify.error("Please enter Refund remarks.");
                        return false;
                    }
                    if ($scope.RefundPaymentObj.RefundAmount != null) {
                        let obj3 = {

                            "UserId": $scope.UserId,
                            "PatientId": $scope.mainobj.PatientId || null,
                            "RefundDepositId": null,
                            "RefundTransactionId": 0,
                            "PatientDepositId": $scope.mainobj.PatientDepositId,
                            "OrganizationId": $scope.RefundPaymentObj.OrganizationId,
                            "TransactionDate": $filter('date')($scope.RefundPaymentObj.RefundDate, "MM-dd-yyyy"),
                            "TransactionAmount": -+$scope.RefundPaymentObj.RefundAmount,
                            "RefundAmount": -+$scope.RefundPaymentObj.RefundAmount,
                            "TransactionSourceId": 3,
                            "TransactionSource": "Patient",
                            "DeleteInd": "N",

                        }
                        Transactions.push(obj3);
                    }

                    var params = {
                        "UserId": $scope.UserId,
                        "OrganizationId": $scope.RefundPaymentObj.OrganizationId,
                        "DepositStatus": "Refund",
                        "DepositStatusId": "3",
                        "PatientDepositId": $scope.RefundPaymentObj.PatientDepositId || null,
                        "RefundDepositId": null,
                        "ReceiptNo": $scope.RefundPaymentObj.ReceiptNo || "",
                        "RefundDate": $filter('date')($scope.RefundPaymentObj.RefundDate, "MM-dd-yyyy"),
                        "RefundAmount": $scope.RefundPaymentObj.RefundAmount || null,
                        "RefundByUserId": $scope.UserId,
                        "RefundByUser": $scope.RefundPaymentObj.RefundByUser || "",
                        "DeleteInd": "N",
                        "AppointmentId": $scope.RefundPaymentObj.AppointmentId || null,
                        "PatientId": $scope.RefundPaymentObj.PatientId || null,
                        "RefundreasonId": $scope.RefundPaymentObj.RefundreasonId || null,
                        "RefundReason": $scope.RefundPaymentObj.Refundreason || "",
                        "Remarks": $scope.RefundPaymentObj.Remarks || "",
                        "CardtypeId": $scope.RefundPaymentObj.CardtypeId || "",
                        "RefundPaymentMethodId": $scope.RefundPaymentObj.RefundPaymentMethodId || "",
                        "RefundPaymentMethod": $scope.RefundPaymentObj.RefundPaymentMethod || "",
                        "RefundStatus": "Initiated",
                        "RefundStatusId": "1",
                        "ReferenceNumber": $scope.RefundPaymentObj.ReferenceNumber || "",
                        "CardNumber": $scope.RefundPaymentObj.CardNumber || "",
                        "Transactions": Transactions || [],
                        "PatientDepositPaymodeListId": mainobj.PatientDepositPaymodeListId,
                        "PaymentTransactionTypeId": 3,
                        "PaymentTransactionType": 'Refund',
                        "DepositTypeId": $scope.mainobj.DepositTypeId || 0,
                        "DepositTypeName": $scope.mainobj.DepositTypeName || "",

                    }

                    console.log(JSON.stringify(params));


                    eHnoteInsuranceService.AddUpdatePatientDepositRefund(params).then(function (resp) {
                        if (resp.data.Status == "Success") {
                            $uibModalInstance.close("cancel");
                        }

                    }, function (err) {

                    });
                }


                $scope.navtoNMIPatientRefund = function (item) {
                    $scope.RefundPaymentObj.RefundAmount = $scope.RefundPaymentObj.RefundAmount || null;
                    $scope.RefundPaymentObj.RefundreasonId = $scope.RefundPaymentObj.RefundreasonId || null;
                    if ($scope.RefundPaymentObj.RefundAmount == null) {
                        alertify.error("Please Enter Refund Amount");
                        return;
                    }
                    if ($scope.RefundPaymentObj.RefundreasonId == null) {
                        alertify.error("Please Select Refund Reason");
                        return;
                    }

                    if ($scope.mainNMITransactionid == "") {
                        alertify.error("you cannot perform void, as TransactionId is empty");
                        return false;
                    }

                    $scope.RefundPaymentObj.Remarks = $scope.RefundPaymentObj.Remarks || "";
                    if ($scope.RefundPaymentObj.Remarks == "" || $scope.RefundPaymentObj.Remarks == null) {
                        alertify.error("Please enter Refund remarks.");
                        return false;
                    }

                    $scope.mainNMITransactionObj = angular.copy(eHnoteCacheStorageService.getNMITransactionMainObject());
                    $scope.mainNMITransactionObj.NMITransactionId = 0;
                    $scope.mainNMITransactionObj.UserId = $scope.UserId;
                    $scope.mainNMITransactionObj.PatientId = $scope.mainobj.PatientId;
                    $scope.mainNMITransactionObj.OrganizationId = $scope.mainobj.OrganizationId;
                   /* $scope.mainNMITransactionObj.PaymentAmount = $scope.mainobj.PatientDepositPaymodeList[0].DepositAmount;*/
                    $scope.mainNMITransactionObj.PaymentAmount = $scope.RefundPaymentObj.RefundAmount;
                    $scope.mainNMITransactionObj.MerchentId = $scope.mainNMITransactionObj.MerchentId;
                    $scope.mainNMITransactionObj.MerchentName = $scope.mainNMITransactionObj.MerchentName;
                    $scope.mainNMITransactionObj.CardHolderName = $scope.mainobj.PatientFullName || "";
                    $scope.mainNMITransactionObj.PatientEmail = $scope.mainobj.PatientEmailId || "";
                    $scope.mainNMITransactionObj.PatientMobile = $scope.mainobj.PatientMobile || "";

                    if ($scope.mainNMITransactionObj.PatientMobile != "") {
                        var obj = eHnoteUserDataService.UsMobileFormatChange($scope.mainNMITransactionObj.PatientMobile);
                        $scope.mainNMITransactionObj.PatientMobile = obj.UsFormatMobileNumber;
                    }

                    $scope.mainNMITransactionObj.PatientMrNo = $scope.mainobj.PatientDisplayId || "";
                    $scope.mainNMITransactionObj.OrderId = "";
                    $scope.mainNMITransactionObj.OrderDescription = $scope.RefundPaymentObj.Refundreason || "";
                    $scope.mainNMITransactionObj.TransactionId = $scope.mainNMITransactionid;
                    $scope.mainNMITransactionObj.BillPaymentTypeId = $scope.mainobj.PatientDepositPaymodeList[0].BillPaymentTypeId || 0;
                    $scope.mainNMITransactionObj.BillPaymentType = $scope.mainobj.PatientDepositPaymodeList[0].BillPaymentType || "";
                    $scope.mainNMITransactionObj.ResponseId = 0;
                    $scope.mainNMITransactionObj.ResponseCode = "";
                    $scope.mainNMITransactionObj.ResponseText = "";
                    $scope.mainNMITransactionObj.Status = "";
                    $scope.mainNMITransactionObj.TransactionTypeId = 5;
                    $scope.mainNMITransactionObj.TransactionType = "refund";
                    $scope.mainNMITransactionObj.DeleteInd = "N";
                    $scope.mainNMITransactionObj.Type = "refund";
                    $scope.mainNMITransactionObj.AppointmentId = $scope.mainobj.AppointmentId || 0;
                    $scope.mainNMITransactionObj.VisitId = $scope.mainobj.VisitId || 0;


                    eHnotePaymentGatewayService.NMIPaymentTransactionRefund($scope.mainNMITransactionObj).then(function (resp) {
                        var res = resp.data || {};
                        console.log(res)
                        if (res.Status == "Success") {
                            alertify.success(res.Status);

                            $scope.PatientRefund();
                        }
                    })

                };

                $scope.uibclose = function () {
                    $uibModalInstance.dismiss("cancel");
                };
            }

        });

        mInstanceAdd.result.then(function () {

            $scope.getPatientDepositAmountById();
            $scope.ViewDepositScreen = false;
            $scope.ClearPatientDeposit();
            $scope.GetPatientTotalRevenueBalance();

        }, function () { });
    }

    $scope.AddPatientDepositPrint = function (item, type) {
        item = item || null;
        type = type || "";
        $scope.DepositTransactionList = [];
        $scope.PatientDepositDetails = item || null;
        if ($scope.PatientDepositDetails.PatientMobile != "") {
            var obj = eHnoteUserDataService.UsMobileFormatChange($scope.PatientDepositDetails.PatientMobile);
            $scope.PatientDepositDetails.PatientMobile = obj.UsFormatMobileNumber;
        }

        $scope.HospitalAddress = $scope.HospitalAddressArray || null;
        if ($scope.HospitalAddress.PharmacyPhoneNo != "") {
            var obj = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddress.PharmacyPhoneNo);
            $scope.HospitalAddress.PharmacyPhoneNo = obj.UsFormatMobileNumber;
        }
        if ($scope.HospitalAddress.FaxNumber != "") {
            var obj = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddress.FaxNumber);
            $scope.HospitalAddress.FaxNumber = obj.UsFormatMobileNumber;
        }
        if ($scope.HospitalAddress.ContactNo != "") {
            var obj = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddress.ContactNo);
            $scope.HospitalAddress.ContactNo = obj.UsFormatMobileNumber;
        }

        var obj = {
            "PatientId": item.PatientId,
      /*      "OrganizationId": item.OrganizationId,*/
            "PatientDepositId": item.PatientDepositId

        };

        eHnoteInsuranceService.GetPatientDepositTransactionList(obj).then(function (resp) {
            if (resp.data.Status === "Success") {
                resp.data.rows = resp.data.rows || [];

                $scope.DepositTransactionList = resp.data.rows.filter(function (item) {
                    /*return item.PaymentTransactionTypeId == 1 && item.PaymentMethodId !== 15;*/
                    if (resp.data.rows.length > 1) {
                        return item.PaymentTransactionTypeId == 1 && item.PaymentMethodId !== 15;
                    } else {
                        return item.PaymentTransactionTypeId == 1;
                    }
                });

                if (type === 'DepositMail') {
                    $timeout(function () {
                        $scope.GetPatientDepositDetailsEmailNew(type);
                    }, 1000);
                }
            } else {
                alertify.error(resp.data.Message);
            }
        });



        if (type === "Print") {
            $timeout(function () {
                var innerContents = document.getElementById('PatientEachDeposit_Print').innerHTML;
                var popupWinindow = window.open('scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                popupWinindow.document.open();
                popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()" class="bodyheightprint">' + innerContents + '</body></html>');
                popupWinindow.document.close();
            }, 1000);
        }
    };

    $scope.geteachtransactionprint = function () {
        var Obj = {
            "TransactionDate": '',
            "TransReciptNo": '',
            "PaymentMethodName": '',
            "CardNumber": '',
            "OnlineTransactionNumber": '',
            "CardType": '',
            "TransactionAmount": 0,
            "ReceiptNumber": '',
            "PatientFullName": '',
            "PatientDisplayId": '',
            "PatientClaimNumber": '',
            "ReceiptNumber": '',
            "InvoiceNumber": '',
            "CityTown": '',
            "State": '',
            "Country": '',
            "FaxNumber": '',
            "OrganizationName": '',
            "ClaimNumbers": '',
            "ClaimData": [],
        }
        return Obj;
    }
    $scope.DepositTransactionObj = angular.copy($scope.geteachtransactionprint());

    $scope.AddIndPrinttransactionPopUp = function (item, sitem) {
        item = item || null;
        sitem = sitem || null;
        $scope.TransactionReceiptText = sitem.PaymentTransactionTypeId == 3 ? "Refund Transaction Receipt" : "Deposit Transaction Receipt";

        $scope.DepositList = item || '';
        $scope.DepositTransactionObj.PatientFullName = $scope.DepositList.PatientFullName || '';
        $scope.DepositTransactionObj.PatientDisplayId = $scope.DepositList.PatientDisplayId || '';
        $scope.DepositTransactionObj.TransactionDate = sitem.TransactionDate || '';
        $scope.DepositTransactionObj.TransactionTime = sitem.TransactionTime || '';
        $scope.DepositTransactionObj.TransReciptNo = sitem.TransReciptNo || '';
        $scope.DepositTransactionObj.PaymentMethodName = sitem.PaymentMethodName || '';
        $scope.DepositTransactionObj.CardNumber = sitem.CardNumber || '';
        $scope.DepositTransactionObj.CardType = sitem.CardType || '';
        $scope.DepositTransactionObj.OnlineTransactionNumber = sitem.OnlineTransactionNumber || '';
        $scope.DepositTransactionObj.TransactionAmount = sitem.TransactionAmount || '';
        $scope.DepositTransactionObj.ReceiptNumber = $scope.DepositList.ReceiptNo || '';

        $scope.DepositTransactionObj.OrganizationName = sitem.OrganizationName || '';

        var filtredArray = $filter("filter")($scope.AllBranchesList, { "BranchId": sitem.OrganizationId }, true) || [];
        if (filtredArray.length > 0) {
            $scope.DepositTransactionObj.CityTown = filtredArray[0].CityTown;
            $scope.DepositTransactionObj.State = filtredArray[0].State;
            $scope.DepositTransactionObj.Country = filtredArray[0].Country;
            $scope.DepositTransactionObj.FaxNumber = filtredArray[0].FaxNumber || "";
            if ($scope.DepositTransactionObj.FaxNumber != "") {
                var obj = eHnoteUserDataService.UsMobileFormatChange($scope.DepositTransactionObj.FaxNumber);
                $scope.DepositTransactionObj.FaxNumber = obj.UsFormatMobileNumber;
            }
        }



        $scope.HospitalAddress = $scope.HospitalAddressArray || null;
        if ($scope.HospitalAddress.PharmacyPhoneNo != "") {
            var obj = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddress.PharmacyPhoneNo);
            $scope.HospitalAddress.PharmacyPhoneNo = obj.UsFormatMobileNumber;
        }
        if ($scope.HospitalAddress.FaxNumber != "") {
            var obj = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddress.FaxNumber);
            $scope.HospitalAddress.FaxNumber = obj.UsFormatMobileNumber;
        }
        if ($scope.HospitalAddress.ContactNo != "") {
            var obj = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddress.ContactNo);
            $scope.HospitalAddress.ContactNo = obj.UsFormatMobileNumber;
        }
        $scope.Depositprintpopup();
    };
    $scope.Depositprintpopup = function () {

        $timeout(function () {
            var innerContents = document.getElementById('PrintIndtransPopupNew').innerHTML;
            var popupWinindow = window.open('scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
            popupWinindow.document.open();
            popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()" class="bodyheightprint">' + innerContents + '</body></html>');
            popupWinindow.document.close();
        }, 1000);
    }


    $scope.AddVoidPatientDeposit = function (item, actionType) {

        var templateToUse = (actionType === 'void') ? "DepositVoidPopUp.html" : "DepositCancelPopUp.html";

        var mInstanceAdd = $uibModal.open({
            "templateUrl": templateToUse,
            "size": "md",
            "backdrop": "static",
            "keyboard": false,
            "windowClass": "z-index-nine__one",
            "resolve": {
                "item": function () { return item; },
                "UserId": function () { return $scope.UserId; },
                "HospitalId": function () { return $scope.HospitalId; },
            },
            "controller": function ($scope, $uibModal, $uibModalInstance, item, UserId, HospitalId) {
                item = item || '';

                console.log(JSON.stringify(item));
                $scope.uibclose = function () {
                    $uibModalInstance.dismiss("cancel");
                }
                $scope.mainNMITransactionid = "";
                if (item.PatientDepositPaymodeList[0].NMITransactionId !== 0) {
                    $scope.mainNMITransactionid = item.PatientDepositPaymodeList[0].OnlineTransactionNumber || "";
                }


                //$scope.getVoidPatientObj = function () {
                //    var Obj = {
                //        "VoidRemarks": ''
                //    }
                //    return Obj;
                //}

                $scope.VoidPatientObj = {
                    "VoidRemarks": '',
                }

                $scope.SaveVoidDepositData = function () {
                    $scope.SavePatientVoidDeposit(item);
                }

                $scope.SavePatientVoidDeposit = function (item) {
                    if ($scope.VoidPatientObj.VoidRemarks == '') {
                        alertify.error("Please enter Remarks.");
                        return false;
                    }

                    var Obj = {
                        "OrganizationId": item.OrganizationId,
                        "TransactionId": 0,
                        "UpdateTransactionId": 0,
                        "PatientDepositId": item.PatientDepositId || 0,
                        "Amount": item.DepositAmount || 0,
                        "PaymentTransactionTypeId": (actionType === 'void') ? 4 : 6,
                        "PaymentTransactionType": (actionType === 'void') ? 'Void' : 'Cancel',
                        "DepositTypeId": item.DepositTypeId || 0,
                        "DepositTypeName": item.DepositTypeName || "",
                        "TransactionDate": $filter('date')(new Date(), "MM-dd-yyyy") || '',
                        "NMITransactionId": 0,
                        "PatientDepositPaymodeListId": 0,
                        "EOBId": 0,
                        "UserId": UserId,
                        "VoidRemarks": $scope.VoidPatientObj.VoidRemarks,
                        "PatientDepositPaymodeList": item.PatientDepositPaymodeList || [],
                    }

                    eHnoteInsuranceService.AddUpdatePatientDepositVoid(Obj).then(function (resp) {
                        if (resp.data.Status == "Success") {

                            if (item.PatientDepositPaymodeList[0].PaymentProcessTypeId != 3 || item.PatientDepositPaymodeList[0].PaymentProcessTypeId != 1) {
                                if (actionType == 'void') {
                                    alertify.success('Deposit Void Successfully');
                                }
                            }
                            if (actionType == 'cancel') {
                                alertify.success('Deposit Cancel Successfully');
                            }

                        }
                        $uibModalInstance.close("success");
                    }, function (err) {

                    });

                }

                $scope.SaveOnlineVoidDeposit = function () {
                    $scope.navtoVoidOnlinePayment(item);
                }

                $scope.navtoVoidOnlinePayment = function (item) {
                    $scope.VoidPatientObj.VoidRemarks = $scope.VoidPatientObj.VoidRemarks || "";
                    if ($scope.VoidPatientObj.VoidRemarks == '') {
                        alertify.error("Please enter Remarks.");
                        return false;
                    }

                    if ($scope.mainNMITransactionid == "") {
                        alertify.error("you cannot perform void, as TransactionId is empty");
                        return false;
                    }

                    $scope.mainNMITransactionObj = angular.copy(eHnoteCacheStorageService.getNMITransactionMainObject());
                    $scope.mainNMITransactionObj.NMITransactionId = 0;
                    $scope.mainNMITransactionObj.UserId = UserId;
                    $scope.mainNMITransactionObj.PatientId = item.PatientId;
                    $scope.mainNMITransactionObj.OrganizationId = item.OrganizationId;
                    $scope.mainNMITransactionObj.PaymentAmount = item.PatientDepositPaymodeList[0].DepositAmount;
                    $scope.mainNMITransactionObj.MerchentId = "";
                    $scope.mainNMITransactionObj.MerchentName = "ehnotesandbox";
                    $scope.mainNMITransactionObj.CardHolderName = item.PatientFullName || "";
                    $scope.mainNMITransactionObj.PatientEmail = item.PatientEmailId || "";
                    $scope.mainNMITransactionObj.PatientMobile = item.PatientMobile || "";

                    if ($scope.mainNMITransactionObj.PatientMobile != "") {
                        var obj = eHnoteUserDataService.UsMobileFormatChange($scope.mainNMITransactionObj.PatientMobile);
                        $scope.mainNMITransactionObj.PatientMobile = obj.UsFormatMobileNumber;
                    }

                    $scope.mainNMITransactionObj.PatientMrNo = item.PatientDisplayId || "";
                    $scope.mainNMITransactionObj.OrderId = "";
                    $scope.mainNMITransactionObj.OrderDescription = $scope.VoidPatientObj.VoidRemarks || "";
                    $scope.mainNMITransactionObj.TransactionId = $scope.mainNMITransactionid;
                    $scope.mainNMITransactionObj.BillPaymentTypeId = item.PatientDepositPaymodeList[0].BillPaymentTypeId || 0;
                    $scope.mainNMITransactionObj.BillPaymentType = item.PatientDepositPaymodeList[0].BillPaymentType || "";
                    $scope.mainNMITransactionObj.ResponseId = 0;
                    $scope.mainNMITransactionObj.ResponseCode = "";
                    $scope.mainNMITransactionObj.ResponseText = "";
                    $scope.mainNMITransactionObj.Status = "";
                    $scope.mainNMITransactionObj.TransactionTypeId = (actionType === 'void') ? 4 : 6;
                    $scope.mainNMITransactionObj.TransactionType = (actionType === 'void') ? 'void' : 'cancel';
                    $scope.mainNMITransactionObj.DeleteInd = "N";
                    $scope.mainNMITransactionObj.Type = (actionType === 'void') ? 'void' : 'cancel';
                    $scope.mainNMITransactionObj.AppointmentId = item.AppointmentId || 0;
                    $scope.mainNMITransactionObj.VisitId = item.VisitId || 0;


                    eHnotePaymentGatewayService.NMIPaymentTransactionVoid($scope.mainNMITransactionObj).then(function (resp) {
                        console.log(resp.data);

                        var res = resp.data || {};
                        if (res.Status == "Success") {
                            alertify.success(res.responseText);

                            $scope.SavePatientVoidDeposit(item);
                        }
                    })

                };
            }
        });

        mInstanceAdd.result.then(function (resp) {
            console.log(resp);
            $scope.getPatientDepositAmountById();
            $scope.GetPatientTotalRevenueBalance();

        }, function () { });
    }

    $scope.RefundPatientDepositAmount = function () {
        $scope.Patientobj = {};
        $scope.Patientobj.PatientId = $scope.mainPatientProfileObj.PatientDetailSummary.PatientID;
        $scope.Patientobj.PatientFullName = $scope.mainPatientProfileObj.PatientDetailSummary.FullName;
        $scope.Patientobj.FirstName = $scope.mainPatientProfileObj.PatientDetailSummary.FirstName;
        $scope.Patientobj.LastName = $scope.mainPatientProfileObj.PatientDetailSummary.LastName;
        $scope.Patientobj.LastName = $scope.mainPatientProfileObj.PatientDetailSummary.PatientDisplayID;
        $scope.Patientobj.PatientDisplayId = $scope.mainPatientProfileObj.PatientDetailSummary.PatientDisplayID;
        $scope.Patientobj.Gender = $scope.mainPatientProfileObj.PatientDetailSummary.Gender;
        $scope.Patientobj.AgeInMonths = $scope.mainPatientProfileObj.PatientDetailSummary.AgeInMonths;
        $scope.Patientobj.AgeInYears = $scope.mainPatientProfileObj.PatientDetailSummary.AgeInYears;
        $scope.Patientobj.DOB = $scope.mainPatientProfileObj.PatientDetailSummary.DOB;
        $scope.Patientobj.MobileNo = $scope.mainPatientProfileObj.PatientDetailSummary.ContactInfo.MobileNumber || '';
        $scope.PatientDepositsObj = $scope.PatientDepositsObj || '';
        console.log($scope.DepositDetails)
        var obj = {
            "AllCardTypes": $scope.AllCardTypes || [],
            "Masterrefundreasons": $scope.Masterrefundreasons || [],
            "AllUsersList": $scope.AllUsersList || [],
        }
        let mInstanceAdd = $uibModal.open({
            "templateUrl": "RefundPatientDepositAmount.html",
            "backdrop": "static",
            "keyboard": false,
            /*  "size": "lg",*/
            "windowClass": "modal__ninety--",
            "resolve": {

                "Patientobj": function () { return $scope.Patientobj; },
                "obj": function () { return obj; },
                "HospitalId": function () { return $scope.HospitalId; },
                "PatientDepositsObj": function () { return $scope.PatientDepositsObj; },

            },
            "controller": function ($scope, $uibModalInstance, eHnoteMasterDataService, datapersistanceFactory, HospitalId, Patientobj, obj, PatientDepositsObj) {

                $scope.uibclose = function () {
                    $uibModalInstance.dismiss("cancel");
                };
                $scope.UserId = eHnoteMasterDataService.getLoginId();
                $scope.HospitalId = HospitalId;
                $scope.PatientDepositsObj = PatientDepositsObj || {};
                var mObj = datapersistanceFactory.getItem("masterDataArrays");
                $scope.masterPaymentModes = [];
                if (mObj.PaymentModes && mObj.PaymentModes.length > 0) {
                    $scope.masterPaymentModes = mObj.PaymentModes;
                    $scope.filterPaymentModes = function (item) {
                        return ![13, 14].includes(item.PaymentModeId);
                    };
                };
                $scope.Masterrefundreasons = obj.Masterrefundreasons || [];
                $scope.AllCardTypes = obj.AllCardTypes || [];
                $scope.AllUsersList = obj.AllUsersList || [];
                $scope.PatientTotalUnallocated = 0;
                $scope.GetPatientDepositsLitsObj = function () {
                    return {
                        "DepositFrom": "",
                        "DepositTo": "",
                        "PatientId": Patientobj.PatientId,
                        "OrganizationId": $scope.HospitalId,
                        "PaymentModeId": 0,
                        "PageSize": 10,
                        "PageNumber": 1,
                        "TransactionNumber": "",
                        "Type": 1
                    }
                };
             
                $scope.getDepositRefundObj = function () {
                    return {
                        "UserId": $scope.UserId,
                        "RefundByUser": "",
                        "OrganizationId": $scope.HospitalId,
                        "PatientDepositId": null,
                        "RefundDepositId": null,
                        "ReceiptNo": "",
                        "ReceiptId": 0,
                        "RefundDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                        "RefundAmount": $scope.PatientTotalUnallocated || 0,
                        "RefundBy": "",
                        "DeleteInd": "N",
                        "AppointmentId": null,
                        "PatientId": Patientobj.PatientId || null,
                        "RefundreasonId": null,
                        "Refundreason": null,
                        "Remarks": null,
                        "CardtypeId": null,
                        "Cardtype": "",
                        "RefundPaymentMethodId": 5,
                        "RefundPaymentMethod": "Check",
                        "ReceiptNumber": "",
                        "ReferenceNumber": "",
                        "CardNumber": "",
                        "DepositStatus": "Refund",
                        "DepositStatusId": "3",
                        "Transactions": [],
                        "PaymentTransactionTypeId": 3,
                        "PaymentTransactionType": 'Refund'


                    }


                };


                $scope.SearchPatientDepositsObj = angular.copy($scope.GetPatientDepositsLitsObj());

                $scope.calculateRefundAmount = function (amount) {

                    if (amount > $scope.PatientTotalUnallocated) {
                        alertify.error("Refund Amount should not be greater than the Unallocated Deposit Amount.");
                        $scope.DepositRefundObj.RefundAmount = '';
                        return false;
                    } else {

                    }
                }

                $scope.getPatientDepositAmountById = function () {
                    $scope.PatientTotalUnallocated = 0;
                    var obj = {
                        "DepositFrom": $scope.SearchPatientDepositsObj.DepositFrom || "",
                        "DepositTo": $scope.SearchPatientDepositsObj.DepositTo || "",
                        "PatientId": $scope.PatientDepositsObj.PatientId,
                        "OrganizationId": $scope.SearchPatientDepositsObj.OrganizationId,
                        "PaymentModeId": 0,
                        "PageSize": 100,
                        "PageNumber": 1,
                        "TransactionNumber": "",
                        "SortBy": "Asc",
                    };
                    obj.PaymentModeId = parseInt(obj.PaymentModeId);
                    if (obj.DepositFrom != "") {
                        obj.DepositFrom = $filter("usdateFormatter")(obj.DepositFrom, "-");
                    }
                    if (obj.DepositTo != "") {
                        obj.DepositTo = $filter("usdateFormatter")(obj.DepositTo, "-");
                    }
                    eHnoteInsuranceService.GetPatientDepositAmountList(obj).then(function (resp) {
                        $scope.PatientDepositsListArray = [];

                        if (resp.data.status === "Success") {
                            $scope.PatientDepositsListArray = resp.data.rows || [];
                            if ($scope.PatientDepositsListArray.length > 0) {
                                angular.forEach($scope.PatientDepositsListArray, function (item) {
                                    item.IsChecked = false;
                                    if (item.UnBilledAmount >= 0) {
                                        $scope.PatientTotalUnallocated += item.UnBilledAmount;
                                        $scope.PatientTotalUnallocated = parseFloat($scope.PatientTotalUnallocated.toFixed(2));
                                    }
                                });

                            }
                            $scope.PatientDepositsDataArray = [];
                            $scope.PatientDepositsDataArray = $scope.PatientDepositsListArray.filter(item => item.UnBilledAmount > 0) || [];
                            $scope.DepositRefundObj = angular.copy($scope.getDepositRefundObj());

                        } else {
                            alertify.error(resp.data.Message);
                        }
                    });
                }

                $scope.getPatientDepositAmountById();

                $scope.ChangeDepositMode = function (ID) {
                    var List1 = $filter("filter")($scope.masterPaymentModes, function (Pitem,) { return Pitem.PaymentModeId === ID; }) || [];
                    if (List1.length != 0) {
                        $scope.DepositRefundObj.RefundPaymentMethodId = List1[0].PaymentModeId;
                        $scope.DepositRefundObj.RefundPaymentMethod = List1[0].PaymentModeName;
                    }
                };
                $scope.SaveRefundPatientDepositAmount = function () {
                    if ($scope.DepositRefundObj.RefundAmount == '' || $scope.DepositRefundObj.RefundAmount == 0) {
                        alertify.error("Please enter the Refund Amount.");
                        return false;

                    }
                    if ($scope.DepositRefundObj.RefundPaymentMethodId == 0) {
                        alertify.error("Please Select Refund Payment Method.");
                        return false;
                    }
                    if ($scope.DepositRefundObj.RefundreasonId == null) {
                        alertify.error("Please Select Refund Reason");
                        return;
                    }
                    if ($scope.DepositRefundObj.Remarks == "" || $scope.DepositRefundObj.Remarks == null) {
                        alertify.error("Please enter Refund remarks.");
                        return false;
                    }
                    if ($scope.DepositRefundObj.RefundAmount > $scope.PatientTotalUnallocated) {
                        alertify.error("Refund Amount should not be greater than the Unallocated Deposit Amount.");
                        return false;

                    }
                    let remainingRefund = $scope.DepositRefundObj.RefundAmount;
                    let TransactionsList = [];
                    let FinalRefundParamsList = [];

                    angular.forEach($scope.PatientDepositsDataArray, function (item) {
                        if (remainingRefund > 0 && item.UnBilledAmount > 0) {
                            let refundPortion = Math.min(item.UnBilledAmount, remainingRefund);

                            // Transaction object (refund)
                            let transaction = {
                                "UserId": $scope.UserId,
                                "PatientId": item.PatientId || null,
                                "RefundDepositId": null,
                                "RefundTransactionId": 0,
                                "PatientDepositId": item.PatientDepositId,
                                "OrganizationId": $scope.HospitalId,
                                "TransactionDate": $filter('date')($scope.DepositRefundObj.RefundDate, "MM-dd-yyyy"),
                                "TransactionAmount": -refundPortion,
                                "RefundAmount": -refundPortion,
                                "TransactionSourceId": 3,
                                "TransactionSource": "Patient",
                                "DeleteInd": "N"
                            };
                            TransactionsList.push(transaction);

                            // Refund params object
                            let param = {
                                "UserId": $scope.UserId,
                                "OrganizationId": $scope.HospitalId,
                                "DepositStatus": "Refund",
                                "DepositStatusId": "3",
                                "PatientDepositId": item.PatientDepositId || null,
                                "RefundDepositId": 0,
                                "ReceiptNo": item.ReceiptNo || "",
                                "RefundDate": $filter('date')($scope.DepositRefundObj.RefundDate, "MM-dd-yyyy"),
                                "RefundAmount": refundPortion,
                                "RefundByUserId": $scope.UserId,
                                "RefundByUser": $scope.DepositRefundObj.RefundByUser || "",
                                "DeleteInd": "N",
                                "AppointmentId": item.AppointmentId || null,
                                "PatientId": $scope.DepositRefundObj.PatientId || null,
                                "RefundreasonId": $scope.DepositRefundObj.RefundreasonId || null,
                                "RefundReason": $scope.DepositRefundObj.Refundreason || "",
                                "Remarks": $scope.DepositRefundObj.Remarks || "",
                                "CardtypeId": item.PatientDepositPaymodeList[0]?.CardtypeId || "",
                                "RefundPaymentMethodId": $scope.DepositRefundObj.RefundPaymentMethodId || "",
                                "RefundPaymentMethod": $scope.DepositRefundObj.RefundPaymentMethod || "",
                                "RefundStatus": "Initiated",
                                "RefundStatusId": "1",
                                "ReferenceNumber": item.ReferenceNumber || "",
                                "CardNumber": item.PatientDepositPaymodeList[0]?.CardNumber || "",
                                "Transactions": [transaction], // each param has 1 transaction
                                "PatientDepositPaymodeListId": item.PatientDepositPaymodeList[0]?.PatientDepositPaymodeListId || null,
                                "PaymentTransactionTypeId": 3,
                                "PaymentTransactionType": 'Refund'
                            };
                            FinalRefundParamsList.push(param);

                            remainingRefund -= refundPortion;
                        }
                    });

                    eHnoteInsuranceService.AddUpdateAllPatientDepositRefund(FinalRefundParamsList).then(function (resp) {
                        if (resp.data.Status === "Success") {
                            alertify.success("Updated Successfully");
                            $scope.uibclose();

                        } else {
                            alertify.error(resp.data.Message);
                        }
                    });

                }
                //$scope.processeachRefund = function (item, sitem) {
                //    //if ($scope.DepositRefundObj.RefundPaymentMethodId == 0) {
                //    //    alertify.error("Please Select Refund Payment Method.");
                //    //    return false;

                //    //}
                //    $scope.mainNMITransactionid = "";
                //    if (item.PatientDepositPaymodeList[0].NMITransactionId !== 0) {
                //        $scope.mainNMITransactionid = item.PatientDepositPaymodeList[0].OnlineTransactionNumber || "";
                //    }
                //    if ($scope.mainNMITransactionid != "") {
                //        $scope.navtoNMIPatientRefund(item, sitem);
                //    }
                //    else {
                //        $scope.RefundDeposit(item, sitem);

                //    }



                //}

                $scope.hasTransactionAmount = function (item) {
                    return item.TransactionAmount > 0;
                };


                $scope.processeachRefund = function (item, sitem) {
                    //if ($scope.DepositRefundObj.RefundPaymentMethodId == 0) {
                    //    alertify.error("Please Select Refund Payment Method.");
                    //    return false;

                    //}

                    let mInstanceAdd = $uibModal.open({
                        "templateUrl": "RefundeachTransPopUp.html",
                        "backdrop": "static",
                        "keyboard": false,
                        /*"scope": $scope,*/
                        "size": "md",
                        // "windowClass": "modal__ninety--",
                        "resolve": {

                            "Patientobj": function () { return $scope.SearchPatientDepositsObj; },
                            "obj": function () { return obj; },
                            "HospitalId": function () { return $scope.HospitalId; },
                            "item": function () { return item; },
                            "sitem": function () { return sitem; },
                            "UserId": function () { return $scope.UserId; },
                            "PatientTotalUnallocated": function () { return $scope.PatientTotalUnallocated; },

                        },
                        "controller": function ($scope, $uibModalInstance, eHnoteMasterDataService, datapersistanceFactory, HospitalId, Patientobj, obj, sitem, item, UserId, PatientTotalUnallocated) {
                            $scope.Masterrefundreasons = obj.Masterrefundreasons || [];
                            $scope.UserId = UserId;
                            $scope.HospitalId = HospitalId;
                            $scope.PatientTotalUnallocated = PatientTotalUnallocated;
                            $scope.uibclose = function () {
                                $uibModalInstance.dismiss("cancel");
                            };



                            $scope.getPatientDepositRefundObj = function () {
                                return {
                                    "UserId": $scope.UserId,
                                    "RefundByUser": "",
                                    "OrganizationId": item.OrganizationId,
                                    "PatientDepositId": null,
                                    "RefundDepositId": null,
                                    "ReceiptNo": "",
                                    "ReceiptId": 0,
                                    "RefundDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                                    "RefundAmount": $scope.PatientTotalUnallocated || 0,
                                    "RefundBy": "",
                                    "DeleteInd": "N",
                                    "AppointmentId": null,
                                    "PatientId": item.PatientId || null,
                                    "RefundreasonId": null,
                                    "Refundreason": null,
                                    "Remarks": null,
                                    "CardtypeId": null,
                                    "Cardtype": "",
                                    "RefundPaymentMethodId": 5,
                                    "RefundPaymentMethod": "Check",
                                    "ReceiptNumber": "",
                                    "ReferenceNumber": "",
                                    "CardNumber": "",
                                    "DepositStatus": "Refund",
                                    "DepositStatusId": "3",
                                    "Transactions": [],
                                    "PaymentTransactionTypeId": 3,
                                    "PaymentTransactionType": 'Refund'


                                }
                            };

                            $scope.DepositRefundObj = angular.copy($scope.getPatientDepositRefundObj());

                            $scope.changeRefundReason = function (id) {
                                var filtredArray = $filter("filter")($scope.Masterrefundreasons, { "RefundreasonId": id }, true) || [];
                                if (filtredArray.length > 0) {
                                    $scope.DepositRefundObj.Refundreason = filtredArray[0].Refundreason || "";
                                }
                            }


                            $scope.SaveDepositTransRefund = function () {
                                $scope.mainNMITransactionid = "";
                                if (sitem.NMITransactionId !== 0) {
                                    $scope.mainNMITransactionid = sitem.OnlineTransactionNumber || "";
                                }
                                if ($scope.mainNMITransactionid != "") {
                                    $scope.navtoNMIPatientRefund(item, sitem);
                                }
                                else {
                                    $scope.RefundDeposit(item, sitem);

                                }


                            }




                            $scope.RefundDeposit = function (item, sitem) {


                                let Transactions = [];
                                $scope.DepositRefundObj.RefundAmount = parseFloat(sitem.TransactionAmount) || null;
                                $scope.DepositRefundObj.RefundreasonId = $scope.DepositRefundObj.RefundreasonId || null;

                                if ($scope.DepositRefundObj.RefundAmount == null) {
                                    alertify.error("Please Enter Refund Amount");
                                    return;
                                }
                                if ($scope.DepositRefundObj.RefundreasonId == null) {
                                    alertify.error("Please Select Refund Reason");
                                    return;
                                }
                                if ($scope.DepositRefundObj.Remarks == "" || $scope.DepositRefundObj.Remarks == null) {
                                    alertify.error("Please enter Refund remarks.");
                                    return false;
                                }
                                //if ($scope.RefundPaymentObj.RefundAmount > $scope.mainobj.UnBilledAmount) {
                                //    alertify.error("RefundAmount exceeds the UnBilledAmount. Please Enter the Lesser Amount.");
                                //    return;
                                //}
                                if ($scope.DepositRefundObj.RefundAmount != null) {
                                    let obj3 = {

                                        "UserId": $scope.UserId,
                                        "PatientId": item.PatientId || null,
                                        "RefundDepositId": null,
                                        "RefundTransactionId": 0,
                                        "PatientDepositId": item.PatientDepositId,
                                        "OrganizationId": $scope.DepositRefundObj.OrganizationId,
                                        "TransactionDate": $filter('date')($scope.DepositRefundObj.RefundDate, "MM-dd-yyyy"),
                                        "TransactionAmount": -+$scope.DepositRefundObj.RefundAmount,
                                        "RefundAmount": -+$scope.DepositRefundObj.RefundAmount,
                                        "TransactionSourceId": 3,
                                        "TransactionSource": "Patient",
                                        "DeleteInd": "N",

                                    }
                                    Transactions.push(obj3);
                                }

                                var params = {
                                    "UserId": $scope.UserId,
                                    "OrganizationId": $scope.DepositRefundObj.OrganizationId,
                                    "DepositStatus": "Refund",
                                    "DepositStatusId": "3",
                                    "PatientDepositId": item.PatientDepositId || null,
                                    "RefundDepositId": 0,
                                    "ReceiptNo": item.ReceiptNo || "",
                                    "RefundDate": $filter('date')($scope.DepositRefundObj.RefundDate, "MM-dd-yyyy"),
                                    "RefundAmount": $scope.DepositRefundObj.RefundAmount || null,
                                    "RefundByUserId": $scope.UserId,
                                    "RefundByUser": $scope.DepositRefundObj.RefundByUser || "",
                                    "DeleteInd": "N",
                                    "AppointmentId": item.AppointmentId || null,
                                    "PatientId": $scope.DepositRefundObj.PatientId || null,
                                    "RefundreasonId": $scope.DepositRefundObj.RefundreasonId || null,
                                    "RefundReason": $scope.DepositRefundObj.Refundreason || "",
                                    "Remarks": $scope.DepositRefundObj.Remarks || "",
                                    "CardtypeId": sitem.CardtypeId || "",
                                    "CardType": sitem.CardType || "",
                                    "RefundPaymentMethodId": sitem.PaymentMethodId || "",
                                    "RefundPaymentMethod": sitem.PaymentMethodName || "",
                                    "RefundStatus": "Initiated",
                                    "RefundStatusId": "1",
                                    "ReferenceNumber": item.ReferenceNumber || "",
                                    "CardNumber": sitem.CardNumber || "",
                                    "Transactions": Transactions || [],
                                    "PatientDepositPaymodeListId": sitem.PatientDepositPaymodeListId,
                                    "TransactionId": sitem.TransReciptNo,
                                    "PaymentTransactionTypeId": 3,
                                    "PaymentTransactionType": 'Refund'

                                }

                                console.log(JSON.stringify(params));


                                eHnoteInsuranceService.AddUpdatePatientDepositRefund(params).then(function (resp) {
                                    if (resp.data.Status == "Success") {
                                        $uibModalInstance.close("cancel");
                                    }

                                }, function (err) {

                                });
                            }

                            $scope.navtoNMIPatientRefund = function (item, sitem) {
                                $scope.DepositRefundObj.RefundAmount = sitem.TransactionAmount || null;
                                $scope.DepositRefundObj.RefundreasonId = $scope.DepositRefundObj.RefundreasonId || null;
                                if ($scope.DepositRefundObj.RefundAmount == null) {
                                    alertify.error("Please Enter Refund Amount");
                                    return;
                                }
                                if ($scope.DepositRefundObj.RefundreasonId == null) {
                                    alertify.error("Please Select Refund Reason");
                                    return;
                                }
                                if ($scope.DepositRefundObj.Remarks == "" || $scope.DepositRefundObj.Remarks == null) {
                                    alertify.error("Please enter Refund remarks.");
                                    return false;
                                }

                                if ($scope.mainNMITransactionid == "") {
                                    alertify.error("you cannot perform void, as TransactionId is empty");
                                    return false;
                                }

                                $scope.mainNMITransactionObj = angular.copy(eHnoteCacheStorageService.getNMITransactionMainObject());
                                $scope.mainNMITransactionObj.NMITransactionId = 0;
                                $scope.mainNMITransactionObj.UserId = $scope.UserId;
                                $scope.mainNMITransactionObj.PatientId = item.PatientId;
                                $scope.mainNMITransactionObj.OrganizationId = item.OrganizationId;
                                $scope.mainNMITransactionObj.PaymentAmount = sitem.TransactionAmount;
                                $scope.mainNMITransactionObj.MerchentId = $scope.mainNMITransactionObj.MerchentId;
                                $scope.mainNMITransactionObj.MerchentName = $scope.mainNMITransactionObj.MerchentName;
                                $scope.mainNMITransactionObj.CardHolderName = item.PatientFullName || "";
                                $scope.mainNMITransactionObj.PatientEmail = item.PatientEmailId || "";
                                $scope.mainNMITransactionObj.PatientMobile = item.PatientMobile || "";

                                if ($scope.mainNMITransactionObj.PatientMobile != "") {
                                    var obj = eHnoteUserDataService.UsMobileFormatChange($scope.mainNMITransactionObj.PatientMobile);
                                    $scope.mainNMITransactionObj.PatientMobile = obj.UsFormatMobileNumber;
                                }

                                $scope.mainNMITransactionObj.PatientMrNo = item.PatientDisplayId || "";
                                $scope.mainNMITransactionObj.OrderId = "";
                                $scope.mainNMITransactionObj.OrderDescription = $scope.DepositRefundObj.Refundreason || "";
                                $scope.mainNMITransactionObj.TransactionId = $scope.mainNMITransactionid;
                                $scope.mainNMITransactionObj.BillPaymentTypeId = sitem.BillPaymentTypeId || 0;
                                $scope.mainNMITransactionObj.BillPaymentType = sitem.BillPaymentType || "";
                                $scope.mainNMITransactionObj.ResponseId = 0;
                                $scope.mainNMITransactionObj.ResponseCode = "";
                                $scope.mainNMITransactionObj.ResponseText = "";
                                $scope.mainNMITransactionObj.Status = "";
                                $scope.mainNMITransactionObj.TransactionTypeId = 5;
                                $scope.mainNMITransactionObj.TransactionType = "refund";
                                $scope.mainNMITransactionObj.DeleteInd = "N";
                                $scope.mainNMITransactionObj.Type = "refund";
                                $scope.mainNMITransactionObj.AppointmentId = item.AppointmentId || 0;
                                $scope.mainNMITransactionObj.VisitId = item.VisitId || 0;


                                eHnotePaymentGatewayService.NMIPaymentTransactionRefund($scope.mainNMITransactionObj).then(function (resp) {
                                    var res = resp.data || {};
                                    console.log(res)
                                    if (res.Status == "Success") {
                                        alertify.success(res.Status);
                                        $scope.RefundDeposit(item, sitem);

                                    }
                                })

                            };



                        }
                    })

                    mInstanceAdd.result.then(function () {
                        $scope.getPatientDepositAmountById();
                    }, function () {
                        $scope.getPatientDepositAmountById();
                    });


                }

                //$scope.RefundDeposit = function (item, sitem) {


                //    let Transactions = [];
                //    $scope.DepositRefundObj.RefundAmount = parseFloat(sitem.TransactionAmount) || null;
                //    $scope.DepositRefundObj.RefundreasonId = $scope.DepositRefundObj.RefundreasonId || null;

                //    if ($scope.DepositRefundObj.RefundAmount == null) {
                //        alertify.error("Please Enter Refund Amount");
                //        return;
                //    }
                //    if ($scope.DepositRefundObj.RefundreasonId == null) {
                //        alertify.error("Please Select Refund Reason");
                //        return;
                //    }
                //    //if ($scope.RefundPaymentObj.RefundAmount > $scope.mainobj.UnBilledAmount) {
                //    //    alertify.error("RefundAmount exceeds the UnBilledAmount. Please Enter the Lesser Amount.");
                //    //    return;
                //    //}
                //    if ($scope.DepositRefundObj.RefundAmount != null) {
                //        let obj3 = {

                //            "UserId": $scope.UserId,
                //            "PatientId": item.PatientId || null,
                //            "RefundDepositId": null,
                //            "RefundTransactionId": 0,
                //            "PatientDepositId": item.PatientDepositId,
                //            "OrganizationId": $scope.HospitalId,
                //            "TransactionDate": $filter('date')($scope.DepositRefundObj.RefundDate, "MM-dd-yyyy"),
                //            "TransactionAmount": -+$scope.DepositRefundObj.RefundAmount,
                //            "RefundAmount": -+$scope.DepositRefundObj.RefundAmount,
                //            "TransactionSourceId": 3,
                //            "TransactionSource": "Patient",
                //            "DeleteInd": "N",

                //        }
                //        Transactions.push(obj3);
                //    }

                //    var params = {
                //        "UserId": $scope.UserId,
                //        "OrganizationId": $scope.HospitalId,
                //        "DepositStatus": "Refund",
                //        "DepositStatusId": "3",
                //        "PatientDepositId": item.PatientDepositId || null,
                //        "RefundDepositId": item.PatientDepositId,
                //        "ReceiptNo": item.ReceiptNo || "",
                //        "RefundDate": $filter('date')($scope.DepositRefundObj.RefundDate, "MM-dd-yyyy"),
                //        "RefundAmount": $scope.DepositRefundObj.RefundAmount || null,
                //        "RefundByUserId": $scope.UserId,
                //        "RefundByUser": $scope.DepositRefundObj.RefundByUser || "",
                //        "DeleteInd": "N",
                //        "AppointmentId": item.AppointmentId || null,
                //        "PatientId": $scope.DepositRefundObj.PatientId || null,
                //        "RefundreasonId": $scope.DepositRefundObj.RefundreasonId || null,
                //        "RefundReason": $scope.DepositRefundObj.Refundreason || "",
                //        "Remarks": $scope.DepositRefundObj.Remarks || "",
                //        "CardtypeId": item.PatientDepositPaymodeList[0].CardtypeId || "",
                //        "RefundPaymentMethodId": item.PatientDepositPaymodeList.length == 1 ? item.PatientDepositPaymodeList[0].PaymentMethodId : $scope.DepositRefundObj.RefundPaymentMethodId || "",
                //        "RefundPaymentMethod": item.PatientDepositPaymodeList.length == 1 ? item.PatientDepositPaymodeList[0].PaymentMethodName : $scope.DepositRefundObj.RefundPaymentMethod || "",
                //        "RefundStatus": "Initiated",
                //        "RefundStatusId": "1",
                //        "ReferenceNumber": item.ReferenceNumber || "",
                //        "CardNumber": item.PatientDepositPaymodeList[0].CardNumber || "",
                //        "Transactions": Transactions || [],
                //        "PatientDepositPaymodeListId": item.PatientDepositPaymodeList[0].PatientDepositPaymodeListId,
                //        "PaymentTransactionTypeId": 3,
                //        "PaymentTransactionType": 'Refund'

                //    }

                //    console.log(JSON.stringify(params));


                //    eHnoteInsuranceService.AddUpdatePatientDepositRefund(params).then(function (resp) {
                //        if (resp.data.Status == "Success") {
                //            $uibModalInstance.close("cancel");
                //        }

                //    }, function (err) {

                //    });
                //}

                //$scope.navtoNMIPatientRefund = function (item, sitem) {
                //    $scope.DepositRefundObj.RefundAmount = sitem.TransactionAmount || null;
                //    $scope.DepositRefundObj.RefundreasonId = $scope.DepositRefundObj.RefundreasonId || null;
                //    if ($scope.DepositRefundObj.RefundAmount == null) {
                //        alertify.error("Please Enter Refund Amount");
                //        return;
                //    }
                //    if ($scope.DepositRefundObj.RefundreasonId == null) {
                //        alertify.error("Please Select Refund Reason");
                //        return;
                //    }

                //    if ($scope.mainNMITransactionid == "") {
                //        alertify.error("you cannot perform void, as TransactionId is empty");
                //        return false;
                //    }

                //    $scope.mainNMITransactionObj = angular.copy(eHnoteCacheStorageService.getNMITransactionMainObject());
                //    $scope.mainNMITransactionObj.NMITransactionId = 0;
                //    $scope.mainNMITransactionObj.UserId = $scope.UserId;
                //    $scope.mainNMITransactionObj.PatientId = item.PatientId;
                //    $scope.mainNMITransactionObj.OrganizationId = item.OrganizationId;
                //    $scope.mainNMITransactionObj.PaymentAmount = sitem.TransactionAmount;
                //    $scope.mainNMITransactionObj.MerchentId = $scope.mainNMITransactionObj.MerchentId;
                //    $scope.mainNMITransactionObj.MerchentName = $scope.mainNMITransactionObj.MerchentName;
                //    $scope.mainNMITransactionObj.CardHolderName = item.PatientFullName || "";
                //    $scope.mainNMITransactionObj.PatientEmail = item.PatientEmailId || "";
                //    $scope.mainNMITransactionObj.PatientMobile = item.PatientMobile || "";

                //    if ($scope.mainNMITransactionObj.PatientMobile != "") {
                //        var obj = eHnoteUserDataService.UsMobileFormatChange($scope.mainNMITransactionObj.PatientMobile);
                //        $scope.mainNMITransactionObj.PatientMobile = obj.UsFormatMobileNumber;
                //    }

                //    $scope.mainNMITransactionObj.PatientMrNo = item.PatientDisplayId || "";
                //    $scope.mainNMITransactionObj.OrderId = "";
                //    $scope.mainNMITransactionObj.OrderDescription = $scope.DepositRefundObj.Refundreason || "";
                //    $scope.mainNMITransactionObj.TransactionId = $scope.mainNMITransactionid;
                //    $scope.mainNMITransactionObj.BillPaymentTypeId = item.PatientDepositPaymodeList[0].BillPaymentTypeId || 0;
                //    $scope.mainNMITransactionObj.BillPaymentType = item.PatientDepositPaymodeList[0].BillPaymentType || "";
                //    $scope.mainNMITransactionObj.ResponseId = 0;
                //    $scope.mainNMITransactionObj.ResponseCode = "";
                //    $scope.mainNMITransactionObj.ResponseText = "";
                //    $scope.mainNMITransactionObj.Status = "";
                //    $scope.mainNMITransactionObj.TransactionTypeId = 5;
                //    $scope.mainNMITransactionObj.TransactionType = "refund";
                //    $scope.mainNMITransactionObj.DeleteInd = "N";
                //    $scope.mainNMITransactionObj.Type = "refund";
                //    $scope.mainNMITransactionObj.AppointmentId = item.AppointmentId || 0;
                //    $scope.mainNMITransactionObj.VisitId = item.VisitId || 0;


                //    eHnotePaymentGatewayService.NMIPaymentTransactionRefund($scope.mainNMITransactionObj).then(function (resp) {
                //        var res = resp.data || {};
                //        console.log(res)
                //        if (res.Status == "Success") {
                //            alertify.success(res.Status);
                //            $scope.RefundDeposit(item);

                //        }
                //    })

                //};
                $scope.opentransactionlist = function (item) {
                    angular.forEach($scope.PatientDepositsDataArray, function (sitem) {
                        if (sitem !== item) {
                            sitem.Isshow = false;
                        }
                    });
                    item.Isshow = !item.Isshow;
                    if (!item.Isshow) return;
                    item.PatientDepositTransactionList = [];

                    var obj = {
                        "PatientId": item.PatientId,
                     /*   "OrganizationId": item.OrganizationId,*/
                        "PatientDepositId": item.PatientDepositId
                    };

                    eHnoteInsuranceService.GetPatientDepositTransactionList(obj).then(function (resp) {
                        if (resp.data.Status === "Success") {
                            var allTransactions = resp.data.rows || [];
                            item.PatientDepositTransactionList = allTransactions.filter(function (t) {
                                return t.PaymentTransactionTypeId !== 4 && t.PaymentTransactionTypeId !== 6;
                            });
                        } else {
                            alertify.error(resp.data.Message);
                        }
                    });
                };


                $scope.AddEachDepositRefund = function (item, ID) {
                    $scope.ViewDepositScreen = false;
                    var obj = {
                        "AllCardTypes": $scope.AllCardTypes || [],
                        "Masterrefundreasons": $scope.Masterrefundreasons || [],
                        "AllUsersList": $scope.AllUsersList || [],
                    }
                    let mInstanceAdd = $uibModal.open({
                        "templateUrl": "RefundDepositpopup.html",
                        "backdrop": "static",
                        "size": "lg",
                        "keyboard": false,
                        "windowClass": "",
                        "resolve": {
                            //"PatientDepositsListArray": function () { return $scope.PatientDepositsListArray; },
                            "mainobj": function () { return item; },
                            "obj": function () { return obj; },
                            "ID": function () { return ID; },

                        },
                        "controller": function ($scope, $uibModalInstance, eHnoteMasterDataService, mainobj, datapersistanceFactory, obj, eHnoteInsuranceService, ID) {
                            ID = ID || '';
                            $scope.mainNMITransactionid = "";

                            //if (mainobj.NMITransactionId !== 0) {
                            //    $scope.mainNMITransactionid = mainobj.OnlineTransactionNumber || "";
                            //}
                            $scope.IsRefundDisable = true;

                            var mObj = datapersistanceFactory.getItem("masterDataArrays");
                            $scope.masterPaymentModes = [];
                            if (mObj.PaymentModes && mObj.PaymentModes.length > 0) {
                                $scope.masterPaymentModes = mObj.PaymentModes;
                                $scope.filterPaymentModes = function (item) {
                                    return ![13, 14].includes(item.PaymentModeId);
                                };
                            };
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
                            $scope.mainobj = mainobj;
                            $scope.Masterrefundreasons = obj.Masterrefundreasons || [];
                            $scope.AllCardTypes = obj.AllCardTypes || [];
                            $scope.AllUsersList = obj.AllUsersList || [];

                            $scope.GetRefundpaymentObj = function () {
                                var obj = {
                                    "UserId": $scope.UserId,
                                    "RefundByUser": "",
                                    "OrganizationId": $scope.mainobj.OrganizationId,
                                    "PatientDepositId": $scope.mainobj.PatientDepositId || null,
                                    "RefundDepositId": null,
                                    "ReceiptNo": $scope.mainobj.ReceiptNo || "",
                                    "ReceiptId": 0,
                                    "RefundDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                                    "RefundAmount": mainobj.UnBilledAmount || null,
                                    "RefundBy": "",
                                    "DeleteInd": "N",
                                    "AppointmentId": $scope.mainobj.AppointmentID || null,
                                    "PatientId": $scope.mainobj.PatientId || null,
                                    "RefundreasonId": null,
                                    "Refundreason": null,
                                    "Remarks": null,
                                    "CardtypeId": null,
                                    "Cardtype": "",
                                    "RefundPaymentMethodId": 5,
                                    "RefundPaymentMethod": "Check",
                                    "ReceiptNumber": "",
                                    "ReferenceNumber": "",
                                    "CardNumber": "",
                                    "DepositStatus": "Refund",
                                    "DepositStatusId": "3",
                                    "Transactions": [],
                                    "IsCheckedRefund": false,


                                }

                                return obj;
                            };

                            $scope.RefundPaymentObj = angular.copy($scope.GetRefundpaymentObj());

                            if (mainobj.PatientDepositPaymodeList.length == 1) {
                                if (mainobj.PatientDepositPaymodeList[0].NMITransactionId !== 0) {
                                    $scope.mainNMITransactionid = mainobj.PatientDepositPaymodeList[0].OnlineTransactionNumber || "";
                                }
                            }

                            $scope.handlePatPaymentRefundCheckbox = function (item) {
                                if (item.IsCheckedRefund == true) {
                                    if (mainobj.PatientDepositPaymodeList.length == 1) {
                                        if (mainobj.PatientDepositPaymodeList[0].NMITransactionId !== 0) {
                                            $scope.RefundPaymentObj.RefundPaymentMethodId = mainobj.PatientDepositPaymodeList[0].PaymentMethodId || 5;
                                            $scope.RefundPaymentObj.RefundPaymentMethod = mainobj.PatientDepositPaymodeList[0].PaymentMethodName || '';
                                            $scope.RefundPaymentObj.CardtypeId = mainobj.PatientDepositPaymodeList[0].CardtypeId || null;
                                            $scope.RefundPaymentObj.Cardtype = mainobj.PatientDepositPaymodeList[0].CardType || null;
                                            $scope.RefundPaymentObj.CardNumber = mainobj.PatientDepositPaymodeList[0].CardNumber || '';
                                        }
                                    }
                                    $scope.RefundPaymentObj.IsCheckedRefund = true;
                                } else {
                                    $scope.RefundPaymentObj = angular.copy($scope.GetRefundpaymentObj());
                                    $scope.RefundPaymentObj.IsCheckedRefund = false;
                                }
                            };


                            $scope.changeIndividualRefund = function (amount) {
                                if (amount > mainobj.UnBilledAmount) {
                                    alertify.error("Refund Amount should not be greater than the Unallocated Deposit Amount.");
                                    $scope.RefundPaymentObj.RefundAmount = '';
                                    return false;
                                } else {

                                }
                            }

                            $scope.init = function () {

                                /* $scope.RefundPaymentObj = angular.copy($scope.GetRefundpaymentObj());*/

                                var filtredArray = $filter("filter")($scope.AllUsersList, { "DoctorID": $scope.UserId }, true) || [];
                                if (filtredArray.length > 0) {
                                    $scope.RefundPaymentObj.RefundByUser = filtredArray[0].FullName || "";
                                }
                            }
                            $scope.init();



                            $scope.changeRefund = function (id) {
                                var filtredArray = $filter("filter")($scope.Masterrefundreasons, { "RefundreasonId": id }, true) || [];
                                if (filtredArray.length > 0) {
                                    $scope.RefundPaymentObj.Refundreason = filtredArray[0].Refundreason || "";
                                }
                            }
                            $scope.ChangePaymentMode = function (id) {
                                var filtredArray = $filter("filter")($scope.masterPaymentModes, { "PaymentModeId": id }, true) || [];
                                if (filtredArray.length > 0) {
                                    $scope.RefundPaymentObj.RefundPaymentMethod = filtredArray[0].PaymentModeName || "";
                                }
                            }

                            $scope.PatientRefund = function () {


                                let Transactions = [];
                                $scope.RefundPaymentObj.RefundAmount = parseFloat($scope.RefundPaymentObj.RefundAmount) || null;
                                $scope.RefundPaymentObj.RefundreasonId = $scope.RefundPaymentObj.RefundreasonId || null;
                                if ($scope.RefundPaymentObj.RefundreasonId == null) {
                                    alertify.error("Please Select Refund Reason");
                                    return;
                                }
                                if ($scope.RefundPaymentObj.RefundAmount == null || $scope.RefundPaymentObj.RefundAmount == 0) {
                                    alertify.error("Please Enter Refund Amount");
                                    return;
                                }
                                if ($scope.RefundPaymentObj.RefundAmount > $scope.mainobj.UnBilledAmount) {
                                    alertify.error("RefundAmount exceeds the UnBilledAmount. Please Enter the Lesser Amount.");
                                    return;
                                }
                                if ($scope.RefundPaymentObj.Remarks == "" || $scope.RefundPaymentObj.Remarks == null) {
                                    alertify.error("Please enter Refund remarks.");
                                    return false;
                                }
                                if ($scope.RefundPaymentObj.RefundAmount != null) {
                                    let obj3 = {

                                        "UserId": $scope.UserId,
                                        "PatientId": $scope.mainobj.PatientId || null,
                                        "RefundDepositId": null,
                                        "RefundTransactionId": 0,
                                        "PatientDepositId": $scope.mainobj.PatientDepositId,
                                        "OrganizationId": $scope.HospitalId,
                                        "TransactionDate": $filter('date')($scope.RefundPaymentObj.RefundDate, "MM-dd-yyyy"),
                                        "TransactionAmount": -+$scope.RefundPaymentObj.RefundAmount,
                                        "RefundAmount": -+$scope.RefundPaymentObj.RefundAmount,
                                        "TransactionSourceId": 3,
                                        "TransactionSource": "Patient",
                                        "DeleteInd": "N",

                                    }
                                    Transactions.push(obj3);
                                }

                                var params = {
                                    "UserId": $scope.UserId,
                                    "OrganizationId": $scope.RefundPaymentObj.OrganizationId,
                                    "DepositStatus": "Refund",
                                    "DepositStatusId": "3",
                                    "PatientDepositId": $scope.RefundPaymentObj.PatientDepositId || null,
                                    "RefundDepositId": null,
                                    "ReceiptNo": $scope.RefundPaymentObj.ReceiptNo || "",
                                    "RefundDate": $filter('date')($scope.RefundPaymentObj.RefundDate, "MM-dd-yyyy"),
                                    "RefundAmount": $scope.RefundPaymentObj.RefundAmount || null,
                                    "RefundByUserId": $scope.UserId,
                                    "RefundByUser": $scope.RefundPaymentObj.RefundByUser || "",
                                    "DeleteInd": "N",
                                    "AppointmentId": $scope.RefundPaymentObj.AppointmentId || null,
                                    "PatientId": $scope.RefundPaymentObj.PatientId || null,
                                    "RefundreasonId": $scope.RefundPaymentObj.RefundreasonId || null,
                                    "RefundReason": $scope.RefundPaymentObj.Refundreason || "",
                                    "Remarks": $scope.RefundPaymentObj.Remarks || "",
                                    "CardtypeId": $scope.RefundPaymentObj.CardtypeId || "",
                                    "RefundPaymentMethodId": $scope.RefundPaymentObj.RefundPaymentMethodId || "",
                                    "RefundPaymentMethod": $scope.RefundPaymentObj.RefundPaymentMethod || "",
                                    "RefundStatus": "Initiated",
                                    "RefundStatusId": "1",
                                    "ReferenceNumber": $scope.RefundPaymentObj.ReferenceNumber || "",
                                    "CardNumber": $scope.RefundPaymentObj.CardNumber || "",
                                    "Transactions": Transactions || [],
                                    "PatientDepositPaymodeListId": mainobj.PatientDepositPaymodeListId,
                                    "PaymentTransactionTypeId": 3,
                                    "PaymentTransactionType": 'Refund',
                                    "DepositTypeId": $scope.mainobj.DepositTypeId || 0,
                                    "DepositTypeName": $scope.mainobj.DepositTypeName || "",

                                }

                                console.log(JSON.stringify(params));


                                eHnoteInsuranceService.AddUpdatePatientDepositRefund(params).then(function (resp) {
                                    if (resp.data.Status == "Success") {
                                        $uibModalInstance.close("cancel");
                                    }

                                }, function (err) {

                                });
                            }


                            $scope.navtoNMIPatientRefund = function (item) {
                                $scope.RefundPaymentObj.RefundAmount = $scope.RefundPaymentObj.RefundAmount || null;
                                $scope.RefundPaymentObj.RefundreasonId = $scope.RefundPaymentObj.RefundreasonId || null;
                                if ($scope.RefundPaymentObj.RefundAmount == null) {
                                    alertify.error("Please Enter Refund Amount");
                                    return;
                                }
                                if ($scope.RefundPaymentObj.RefundreasonId == null) {
                                    alertify.error("Please Select Refund Reason");
                                    return;
                                }

                                if ($scope.mainNMITransactionid == "") {
                                    alertify.error("you cannot perform void, as TransactionId is empty");
                                    return false;
                                }
                                if ($scope.RefundPaymentObj.Remarks == "" || $scope.RefundPaymentObj.Remarks == null) {
                                    alertify.error("Please enter Refund remarks.");
                                    return false;
                                }

                                $scope.mainNMITransactionObj = angular.copy(eHnoteCacheStorageService.getNMITransactionMainObject());
                                $scope.mainNMITransactionObj.NMITransactionId = 0;
                                $scope.mainNMITransactionObj.UserId = $scope.UserId;
                                $scope.mainNMITransactionObj.PatientId = $scope.mainobj.PatientId;
                                $scope.mainNMITransactionObj.OrganizationId = $scope.mainobj.OrganizationId;
                                $scope.mainNMITransactionObj.PaymentAmount = $scope.RefundPaymentObj.RefundAmount;
                                $scope.mainNMITransactionObj.MerchentId = $scope.mainNMITransactionObj.MerchentId;
                                $scope.mainNMITransactionObj.MerchentName = $scope.mainNMITransactionObj.MerchentName;
                                $scope.mainNMITransactionObj.CardHolderName = $scope.mainobj.PatientFullName || "";
                                $scope.mainNMITransactionObj.PatientEmail = $scope.mainobj.PatientEmailId || "";
                                $scope.mainNMITransactionObj.PatientMobile = $scope.mainobj.PatientMobile || "";

                                if ($scope.mainNMITransactionObj.PatientMobile != "") {
                                    var obj = eHnoteUserDataService.UsMobileFormatChange($scope.mainNMITransactionObj.PatientMobile);
                                    $scope.mainNMITransactionObj.PatientMobile = obj.UsFormatMobileNumber;
                                }

                                $scope.mainNMITransactionObj.PatientMrNo = $scope.mainobj.PatientDisplayId || "";
                                $scope.mainNMITransactionObj.OrderId = "";
                                $scope.mainNMITransactionObj.OrderDescription = $scope.RefundPaymentObj.Refundreason || "";
                                $scope.mainNMITransactionObj.TransactionId = $scope.mainNMITransactionid;
                                $scope.mainNMITransactionObj.BillPaymentTypeId = $scope.mainobj.PatientDepositPaymodeList[0].BillPaymentTypeId || 0;
                                $scope.mainNMITransactionObj.BillPaymentType = $scope.mainobj.PatientDepositPaymodeList[0].BillPaymentType || "";
                                $scope.mainNMITransactionObj.ResponseId = 0;
                                $scope.mainNMITransactionObj.ResponseCode = "";
                                $scope.mainNMITransactionObj.ResponseText = "";
                                $scope.mainNMITransactionObj.Status = "";
                                $scope.mainNMITransactionObj.TransactionTypeId = 5;
                                $scope.mainNMITransactionObj.TransactionType = "refund";
                                $scope.mainNMITransactionObj.DeleteInd = "N";
                                $scope.mainNMITransactionObj.Type = "refund";
                                $scope.mainNMITransactionObj.AppointmentId = $scope.mainobj.AppointmentId || 0;
                                $scope.mainNMITransactionObj.VisitId = $scope.mainobj.VisitId || 0;


                                eHnotePaymentGatewayService.NMIPaymentTransactionRefund($scope.mainNMITransactionObj).then(function (resp) {
                                    var res = resp.data || {};
                                    console.log(res)
                                    if (res.Status == "Success") {
                                        alertify.success(res.Status);

                                        $scope.PatientRefund();
                                    }
                                })

                            };

                            $scope.uibclose = function () {
                                $uibModalInstance.dismiss("cancel");
                            };
                        }

                    });

                    mInstanceAdd.result.then(function () {

                        $scope.getPatientDepositAmountById();

                    }, function () { });
                }



            }

        });
        mInstanceAdd.result.then(function () {

            $scope.getPatientDepositAmountById();
            $scope.ViewDepositScreen = false;
            $scope.ClearPatientDeposit();
            $scope.GetPatientTotalRevenueBalance();

        }, function () {
            $scope.getPatientDepositAmountById();
        });
    }


    $scope.SavePointOfSaleInvoice = function (item, sitem, val) {
        $scope.POSInvoicesCount = null;
        $scope.POSPaymentListCount = null;
        $scope.POSInvoiceslist = [];
        item = item || '';
        sitem = sitem || '';
        val = val || '';

        var Locationids = '';
        Locationids = $scope.AllBranchesList
            .filter(pitem => pitem.IsChecked && pitem.ClinicId !== 0)
            .map(pitem => pitem.ClinicId)
            .join(",");

        let param = {
            "OrganizationId": $scope.HospitalId,
            "PageSize": 100,
            "PageNumber": 1,
            "InvoiceNumber": sitem.InvoiceNumber || "",
            "PatientId": item.PatientId || "",
            "SoldByUserId": "",
            "FromDate": "",
            "ToDate": "",
            "PaymentStatusId": "",
            "Locationids": Locationids || '',
        }

        eHnoteInsuranceService.GetOrganizationPOSInvoices(param).then(function (resp) {
            if (resp.data.status === "Success") {
                $scope.POSVoidInvoiceslist = resp.data.PosVoid || [];
                if (resp.data.rows.length > 0) {
                    $scope.POSInvoicesCount = resp.data.count || 0;
                    $scope.POSInvoiceslist = resp.data.rows || [];

                    if ($scope.POSInvoiceslist.length > 0) {
                        angular.forEach($scope.POSInvoiceslist, function (item) {
                            item.Isshow = false;
                        })
                    }

                    $scope.POSPaymentListCount = $scope.POSInvoiceslist.filter(function (item) {
                        return item.PaymentStatusId != 4;
                    }).length;

                }

                $scope.navtoPointOfSalePopup($scope.POSInvoiceslist[0], val);


            }
        }, function (err) { console.log(err); });

    }

    $scope.navtoPointOfSalePopup = function (item, EditId) {
        let obj = {
            "ScreenType": "EditPos",
            "EditItem": item,
            "PatientId": item.PatientId,
            "EditId": EditId || 0,

        }

        if ($scope.AllHospitalsDataList == undefined) {
            $scope.AllHospitalsDataList = $scope.mainPatientProfileObj || {};
        }

        let mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/pointOfSalePopup.html",
            "controller": "UsPointOfSalePopupCtrl",
            "backdrop": "static",
            "keyboard": false,
            "resolve": {
                "mainObj": function () { return obj || null; },
                "mainBillerDataObj": function () { return $scope.AllHospitalsDataList  || null; },
            },
            "windowClass": "modal__popup--1 in",
        });

        mInstanceAdd.result.then(function (resp) {

        }, function () { });
    }

    $scope.AddPatientPaymentTransDeposit = function (item, sitem) {
        item = item || null;
        sitem = sitem || null;

        $scope.DepositList = item || '';
        $scope.DepositTransactionObj.PatientFullName = $scope.DepositList.PatientFullName || '';
        $scope.DepositTransactionObj.PatientDisplayId = $scope.DepositList.PatientDisplayId || '';
        $scope.DepositTransactionObj.TransactionDate = sitem.TransactionDate || '';
        $scope.DepositTransactionObj.TransactionTime = sitem.TransactionTime || '';
        $scope.DepositTransactionObj.TransReciptNo = sitem.TransReciptNo || '';
        $scope.DepositTransactionObj.PaymentMethodName = sitem.PaymentMethodName || '';
        $scope.DepositTransactionObj.CardNumber = sitem.CardNumber || '';
        $scope.DepositTransactionObj.CardType = sitem.CardType || '';
        $scope.DepositTransactionObj.OnlineTransactionNumber = sitem.OnlineTransactionNumber || '';
        $scope.DepositTransactionObj.InvoiceNumber = sitem.InvoiceNumber || '';
        $scope.DepositTransactionObj.TransactionAmount = sitem.TransactionAmount || '';
        $scope.DepositTransactionObj.PatientClaimNumber = sitem.PatientClaimNumber || '';
        $scope.DepositTransactionObj.ReceiptNumber = item.ReceiptNo || '';


        $scope.DepositTransactionObj.ClaimData = sitem.ClaimData || '';

        $scope.DepositTransactionObj.ClaimNumbers =
            $scope.DepositTransactionObj.ClaimData
                .map(citem => citem.PatientClaimNumber)
                .join(",");




        $scope.HospitalAddress = $scope.HospitalAddressArray || null;
        if ($scope.HospitalAddress.PharmacyPhoneNo != "") {
            var obj = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddress.PharmacyPhoneNo);
            $scope.HospitalAddress.PharmacyPhoneNo = obj.UsFormatMobileNumber;
        }
        if ($scope.HospitalAddress.FaxNumber != "") {
            var obj = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddress.FaxNumber);
            $scope.HospitalAddress.FaxNumber = obj.UsFormatMobileNumber;
        }
        if ($scope.HospitalAddress.ContactNo != "") {
            var obj = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddress.ContactNo);
            $scope.HospitalAddress.ContactNo = obj.UsFormatMobileNumber;
        }
        $scope.DepositPaymentprintpopup();
    };

    $scope.DepositPaymentprintpopup = function () {

        $timeout(function () {
            var innerContents = document.getElementById('PatientPaymentEachTrans_Print').innerHTML;
            var popupWinindow = window.open('scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
            popupWinindow.document.open();
            popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()" class="bodyheightprint">' + innerContents + '</body></html>');
            popupWinindow.document.close();
        }, 1000);
    }
    $scope.Showtransprodlist = function (item) {
        angular.forEach($scope.POSInvoiceslist, function (sitem) {
            if (sitem !== item) {
                sitem.Isshow = false;
            }
        });
        item.Isshow = !item.Isshow;
        if (item.Isshow) {
            $scope.SubtabsChanges == 6;
        }
    };

    $scope.isPOSToday = function (InvoiceDate) {
        var invoiceDateStr = $filter('date')(InvoiceDate, "MM-dd-yyyy");
        var todayStr = $filter('date')(new Date(), "MM-dd-yyyy");
        return invoiceDateStr === todayStr;
    };

    $scope.isPOSCancelToday = function (posDate) {
        var invoiceDateStr = $filter('date')(posDate, "MM-dd-yyyy");
        var todayStr = $filter('date')(new Date(), "MM-dd-yyyy");
        return invoiceDateStr != todayStr;
    };

    $scope.isDepositToday = function (DepositDate) {
        var DepositDateStr = $filter('date')(DepositDate, "MM-dd-yyyy");
        var todayStr = $filter('date')(new Date(), "MM-dd-yyyy");
        return DepositDateStr === todayStr;
    };

    $scope.isDepositCancelToday = function (date) {
        var DepositDateStr = $filter('date')(date, "MM-dd-yyyy");
        var todayStr = $filter('date')(new Date(), "MM-dd-yyyy");
        return DepositDateStr != todayStr;
    };
    function getMainLedgerObj() {
        return {
            LedgerItems: []
        };
    }


    function createClaimLedgerItem(row) {
        return {
            EntryDate: row.EntryDate || "",
            Source: row.Source || "Claim",
            OrganizationId: row.OrganizationId || 0,
            OrganizationName: row.OrganizationName || "",
            BillingProviderId: row.BillingProviderId || 0,
            BillingProviderName: row.BillingProviderName || "",
            RenderingProviderId: row.RenderingProviderId || 0,
            RenderingProviderName: row.RenderingProviderName || "",
            TotalPaymentAmount: row.TotalPaymentAmount ||0,
            ClaimDetails: row.ClaimDetails && row.ClaimDetails.length > 0 ? row.ClaimDetails.map(function (claim) {
                return {
                    PatientClaimId: claim.PatientClaimId || 0,
                    ClaimDate: claim.ClaimDate || "",
                    AppointmentId: claim.AppointmentId || 0,
                    PatientId: claim.PatientId || 0,
                    PatientClaimNumber: claim.PatientClaimNumber || "",
                    DOSfrom: claim.DOSfrom || "",
                    TotalClaimAmount: claim.TotalClaimAmount || 0,
                    TotalPaymentAmount: claim.TotalPaymentAmount || 0,
                    TotalBalance: claim.TotalBalance || 0,
                    TotalAdjustmentAmount: claim.TotalAdjustmentAmount || 0,
                    TotalWriteOffAmount: claim.TotalWriteOffAmount || 0,
                    TotalInsuranceBalance: claim.TotalInsuranceBalance || 0,
                    TotalPatientBalance: claim.TotalPatientBalance || 0,
                    ClaimCreatedBy: claim.ClaimCreatedBy || "",
                    BillingProviderName: claim.BillingProviderName || "",
                    PayorName: claim.PayorName || "",
                    BillStatusId: claim.BillStatusId || 0,
                    BillStatus: claim.BillStatus || "",
                    ReferenceNumber: claim.ReferenceNumber || "",
                    PostingDate: claim.PostingDate || "",
                    ClaimLineItems: claim.ClaimLineItems ? claim.ClaimLineItems.map(function (line) {
                        return {
                            ServiceCode: line.ServiceCode || "",
                            ServiceName: line.ServiceName || "",
                            DOSfrom: line.DOSfrom || "",
                            PostingDate: line.PostingDate || "",
                            TotalChargeAmount: line.TotalChargeAmount || 0,
                            PatientAmount: line.PatientAmount || 0,
                            AdjustmentAmount: line.AdjustmentAmount || 0,
                            InsuranceBalance: line.InsuranceBalance || 0,
                            PatientBalance: line.PatientBalance || 0,
                            PatientPaymentAmount: line.PatientPaymentAmount || 0,
                            TotalPaymentAmount: line.TotalPaymentAmount || 0,
                            WriteOffAmount: line.WriteOffAmount || 0,
                            LineItemTransactions: line.LineItemTransactions ? line.LineItemTransactions.map(function (item) {
                                return {
                                    TransactionDate: item.TransactionDate || 0,
                                    TransactionType: item.TransactionType || "",
                                    TransactionAmount: item.TransactionAmount || 0,
                                    PatientAmount: item.PatientAmount || 0,
                                    TransactionTypeId: item.TransactionTypeId || 0,
                                    AdjustmentReasonCode:item.AdjustmentReasonCode ||"",
                                    GroupCode:item.GroupCode || "",
                                    PaymentMode :item.PaymentMode || ""
                                };
                            }) : [],
                        };
                    }) : [],
                    
                };
            }) : [],
            POSDetails: [],
            PatientPaymentDetails: []
        };
    }

    function createPatientPaymentLedgerItem(row) {
        return {
            EntryDate: row.EntryDate || "",
            Source: row.Source || "Patient Payment",
            OrganizationId: row.OrganizationId || 0,
            OrganizationName: row.OrganizationName || "",
            BillingProviderId: row.BillingProviderId || 0,
            BillingProviderName: row.BillingProviderName || "",
            RenderingProviderId: row.RenderingProviderId || 0,
            RenderingProviderName: row.RenderingProviderName || "",
            ClaimDetails: [],
            POSDetails: [],
            PatientPaymentDetails: row.PatientPaymentDetails && row.PatientPaymentDetails.length > 0 ? row.PatientPaymentDetails.map(function (pay) {

                    var claimMap = {};
                    var uniqueClaims = [];

                    angular.forEach(pay.TransactionDetails || [], function (trans) {
                        if (trans.PatientClaimNumber && !claimMap[trans.PatientClaimNumber]) {
                            claimMap[trans.PatientClaimNumber] = true;
                            uniqueClaims.push(trans.PatientClaimNumber);
                        }
                    });

                    return {
                        PatientDepositId: pay.PatientDepositId || 0,
                        DepositDate: pay.DepositDate || "",
                        ReceiptNumber: pay.ReceiptNumber || "",
                        DepositAmount: pay.DepositAmount || 0,
                        BilledAmount: pay.BilledAmount || 0,
                        RefundAmount: pay.RefundAmount || 0,
                        VoidAmount: pay.VoidAmount || 0,
                        UnBilledAmount: pay.UnBilledAmount || 0,

                        PatientMultipleClaimNumbers: uniqueClaims.join(","),

                        PaymentModesList: pay.PaymentModesList ? pay.PaymentModesList.map(function (mode) {
                                return {
                                    PatientDepositPaymodeListId: mode.PatientDepositPaymodeListId || 0,
                                    PaymentMethodId: mode.PaymentMethodId || 0,
                                    PaymentMethodName: mode.PaymentMethodName || "",
                                    PaymentAmount: mode.PaymentAmount || 0,
                                    PaymentDate: mode.PaymentDate || "",
                                    ReferenceNumber: mode.ReferenceNumber || "",
                                    PaymodeReceiptNo: mode.PaymodeReceiptNo || ""
                                };
                            }) : [],
                        TransactionDetails: pay.TransactionDetails ? pay.TransactionDetails.map(function (trans) {
                                return {
                                    PatientClaimNumber: trans.PatientClaimNumber || "",
                                    TransactionAmount: trans.TransactionAmount || 0,
                                    TransactionDate: trans.TransactionDate || "",
                                    Amount: trans.Amount,
                                    InvoiceNumber: trans.InvoiceNumber || ""

                                };
                        }) : [],

                        DepositTransactionDetails: pay.DepositTransactionDetails ?
                            pay.DepositTransactionDetails.map(function (trans) {
                                return {
                                    TransactionId: trans.TransactionId || 0,
                                    PatientDepositId: trans.PatientDepositId || 0,
                                    Amount: trans.Amount || 0,
                                    TransactionDate: trans.TransactionDate || "",
                                    PaymentTransactionType: trans.PaymentTransactionType || "",
                                    TransReciptNo: trans.TransReciptNo || "",
                                    PatientClaimNumber: trans.PatientClaimNumber || "",
                                    PaymentMethodId: trans.PaymentMethodId || 0,
                                    PaymentMethodName: trans.PaymentMethodName || "",
                                    SettlementStatusId: trans.SettlementStatusId || 0,
                                    TransactionCategoryName: trans.TransactionCategoryName || 0,
                                    
                                };
                            }) : []

                    };
                }) : []
        };
    }

    function createPOSLedgerItem(row) {
        return {
            EntryDate: row.EntryDate || "",
            Source: row.Source || "POS",
            OrganizationId: row.OrganizationId || 0,
            OrganizationName: row.OrganizationName || "",
            BillingProviderId: row.BillingProviderId || 0,
            BillingProviderName: row.BillingProviderName || "",
            RenderingProviderId: row.RenderingProviderId || 0,
            RenderingProviderName: row.RenderingProviderName || "",
            ClaimDetails: [],
            PatientPaymentDetails: [],
            POSDetails: row.POSDetails && row.POSDetails.length > 0 ? row.POSDetails.map(function (pos) {
                return {
                    InvoiceId: pos.InvoiceId || 0,
                    InvoiceNumber: pos.InvoiceNumber || "",
                    BuyerId: pos.BuyerId || 0,
                    BuyerName: pos.BuyerName || "",
                    InvoiceDate: pos.InvoiceDate || "",
                    TotalChargeAmount: pos.TotalChargeAmount || 0,
                    TotalNetAmount: pos.TotalNetAmount || 0,
                    PatientPaymentAmount: pos.PatientPaymentAmount || 0,
                    PatientBalanceAmount: pos.PatientBalanceAmount || 0,
                    TotalBalanceAmount: pos.TotalBalanceAmount,
                    TotalDiscountAmount: pos.TotalDiscountAmount || 0,
                    InvoiceItems: pos.InvoiceItems ? pos.InvoiceItems.map(function (item) {
                        return {
                            InvoiceItemId: item.InvoiceItemId || 0,
                            InvoiceId: item.InvoiceId || 0,
                            ItemMasterId: item.ItemMasterId || 0,
                            ItemMasterName: item.ItemMasterName || "",
                            Quantity: item.Quantity || 0,
                            UnitPrice: item.UnitPrice || 0,
                            TotalChargeAmount: item.TotalChargeAmount || 0,
                            TotalNetAmount: item.TotalNetAmount || 0,
                            PatientPaymentAmount: item.PatientPaymentAmount || 0,
                            BalanceAmount: item.BalanceAmount || 0,
                            DiscountAmount: item.DiscountAmount || 0,
                            PatientBalanceAmount: item.PatientBalanceAmount
                        };
                    }) : [],
                    PaymentMethods: pos.PaymentMethods ? pos.PaymentMethods.map(function (method) {
                        return {
                            PaymentId: method.PaymentId || 0,
                            InvoiceId: method.InvoiceId || 0,
                            PaymentMethodId: method.PaymentMethodId || 0,
                            PaymentMethodName: method.PaymentMethodName || "",
                            PaymentAmount: method.PaymentAmount || 0,
                            TransactionTypeId: method.TransactionTypeId || 0,
                            TransactionType: method.TransactionType || "",
                            TransactionDate: method.TransactionDate || "",
                            PosPaymodeReceiptNo: method.PosPaymodeReceiptNo || ""
                        };
                    }) : []
                };
            }) : []
        };
    }


    $scope.GetPatientLedgerDetailsPrint = function (id) {
       
        $scope.HospitalAddressArray = $scope.HospitalAddressArray || {};

        var obj1 = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddressArray.ContactNo);
        $scope.HospitalAddressArray.ContactNo = obj1.UsFormatMobileNumber;

        var obj2 = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddressArray.MobileNo);
        $scope.HospitalAddressArray.MobileNo = obj2.UsFormatMobileNumber;

        if ($scope.HospitalAddressArray.FaxNumber != "") {
            var obj = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddressArray.FaxNumber);
            $scope.HospitalAddressArray.FaxNumber = obj.UsFormatMobileNumber;
        }
        $scope.PatientDetailsData = {};
        $scope.PatientDetailsData = $scope.mainPatientProfileObj.PatientDetailSummary || {};

        if ($scope.PatientDetailsData.ContactInfo != undefined) {
            var obj3 = eHnoteUserDataService.UsMobileFormatChange($scope.PatientDetailsData.ContactInfo.MobileNumber);
            $scope.PatientDetailsData.ContactInfo.MobileNumber = obj3.UsFormatMobileNumber;
            if ($scope.PatientDetailsData.PatientAddress == undefined) {
                $scope.PostalAddress = $scope.PatientDetailsData.PostalAddress || {};
            } else {
                $scope.PostalAddress = $scope.PatientDetailsData.PatientAddress.PostalAddress || {};
            }
        }
        
        $scope.GetPatientLedgerDetailsData(id);
    }
    $scope.GetPatientLedgerDetailsData = function (id) {
        $scope.mainLedger = getMainLedgerObj();

        let obj = {
            "PatientId": $scope.mainPatientProfileObj.PatientId || 0,
            "OrganizationId": $scope.HospitalId||0,
            "FromDate": $scope.SearchPatientClaimList.FromDate,
            "ToDate": $scope.SearchPatientClaimList.ToDate,
        };

        eHnoteInsuranceService.GetPatientLedgerDetails(obj).then(function (resp) {
            if (resp.data.LedgerItems && resp.data.LedgerItems.length > 0) {
                $scope.PatientLedgerDetails = resp.data.LedgerItems;
                $scope.mainLedger.LedgerItems = [];

                angular.forEach($scope.PatientLedgerDetails, function (row) {
                    if (!row.Source) {
                        if (row.ClaimDetails && row.ClaimDetails.length > 0) {
                            row.Source = "Claim";
                        } else if (row.PatientPaymentDetails && row.PatientPaymentDetails.length > 0) {
                            row.Source = "Patient Payment";
                        } else if (row.POSDetails && row.POSDetails.length > 0) {
                            row.Source = "POS";
                        }
                    }
                    if (row.Source == 'Claim') {
                        $scope.mainLedger.LedgerItems.push(createClaimLedgerItem(row));
                    }
                    else if (row.Source == 'Patient Payment') {
                        $scope.mainLedger.LedgerItems.push(createPatientPaymentLedgerItem(row));
                    }
                    else if (row.Source == 'POS') {
                        $scope.mainLedger.LedgerItems.push(createPOSLedgerItem(row));
                    }
                    else {

                    }
                });

                console.log("Built mainLedger object:", $scope.mainLedger);

                $timeout(function () {
                    $scope.GetPatientLedgerDetailsPrintNew(id);
                }, 1000);
            }
            else {
                alertify.error("there is no data available to print for this patient.");
            }
        });
    };


    $scope.GetPatientLedgerDetailsPrintNew = function (id) {

        if (id === 1) {
            $scope.htmlContent = document.getElementById('PatientLedgerDetails_Print').innerHTML;
            $scope.GetPatientLedgerDetailsEmailNew();
        } else {
            $timeout(function () {
                var innerContents = document.getElementById('PatientLedgerDetails_Print').innerHTML;
                var popupWinindow = window.open('', 'scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                popupWinindow.document.open();
                popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()" class="bodyheightprint">' + innerContents + '</body></html>');
                popupWinindow.document.close();
            }, 1000);
        }

    }
    $scope.getPaymentAmountDisplay = function (tline) {
        const txnIds = [24, 25, 26, 27, 32, 36, 40, 98, 99, 100,101];
        return txnIds.includes(tline.TransactionTypeId) ? `$${tline.TransactionAmount || 0}` : '--';
    };

    $scope.getPatientAmountDisplay = function (tline) {
        const ids = [30, 95, 96, 97];
        return ids.includes(tline.TransactionTypeId) ? `$${tline.PatientAmount || 0}` : '--';
    };

    $scope.getadjustmentAmountDisplay = function (tline) {
        const ids = [2, 53, 45];
        return ids.includes(tline.TransactionTypeId) ? `$${tline.TransactionAmount || 0}` : '--';
    };
    $scope.getawriteoffAmountDisplay = function (tline) {
        const ids = [57,13];
        return ids.includes(tline.TransactionTypeId) ? `$${tline.TransactionAmount || 0}` : '--';
    };

    $scope.getPatientBalanceAmountDisplay = function (tline) {
        return tline.TransactionTypeId === 57 ? `$${tline.TransactionAmount || 0}` : '--';
    };
    $scope.getTransactionDisplayText = function (tline) {
    if (tline.TransactionTypeId === 26) {
        //return tline.TransactionType + ' (' + (tline.PaymentMode || '') + ')';
        return tline.TransactionType + ' (' + 'Patient Deposits' + ')';

    } else if (tline.TransactionTypeId === 53) {
        var reasonText = (tline.GroupCode || '');//+ '-' + (tline.AdjustmentReasonCode || '')
        return tline.TransactionType + ' (' + reasonText + ')';
    } else {
        return tline.TransactionType;
    }
    };

    $scope.GetPatientLedgerDetailsEmailNew = function (type) {

        $scope.claimScreenParentObj.PatientClaimId = $scope.claimScreenParentObj.PatientClaimId || 0;
        $scope.filteredClaims = '';
        if ($scope.claimScreenParentObj.PatientClaimId != 0) {
            $scope.CurrentfilteredClaim = $scope.PatientClaimsList.filter(function (claim) {
                return claim.PatientClaimId === $scope.claimScreenParentObj.PatientClaimId;
            });
            $scope.filteredClaims = $scope.CurrentfilteredClaim[0];
        } else {
            $scope.filteredClaims = $scope.PatientClaimsList[0];
        }

        const patient = $scope.mainPatientProfileObj.PatientDetails || $scope.mainPatientProfileObj.PatientDetailSummary || {};
        const ApptId = $scope.mainPatientProfileObj.AppointmentId || 0;
        patient.EmailId = ($scope.mainPatientProfileObj.PatientDetails?.EmailId) || ($scope.mainPatientProfileObj.PatientDetailSummary?.EmailId) || null;
        if (!patient.EmailId) {
            alertify.error("There is no email for this patient");
            return false;
        }

        const clinicname = $scope.PatientPaymentsArray[0]?.OrganizationName || "";
        const doctorname = $scope.filteredClaims?.ClaimCreatedBy || "";
        var obj1 = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddressArray.ContactNo);
        $scope.HospitalAddressArray.ContactNo = obj1.UsFormatMobileNumber;

        var obj2 = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddressArray.MobileNo);
        $scope.HospitalAddressArray.MobileNo = obj2.UsFormatMobileNumber;
        const branchAddress = ($scope.HospitalAddressArray.Address1 || "") + ", " + ($scope.HospitalAddressArray.Address2 || "") + ", " + ($scope.HospitalAddressArray.CityName || "") + ", " + ($scope.HospitalAddressArray.StateName || "") + ", " + ($scope.HospitalAddressArray.CountryName || "") + ", " + ($scope.HospitalAddressArray.PinCode || "");

        $scope.PatientDepositDetails = $scope.PatientDepositDetails || {};
        $scope.POSPrintMainObj = $scope.POSPrintMainObj || {};
        const obj = {
            "htmlContent": $scope.htmlContent,
            "PatientId": patient?.PatientId,
            "OrganizationId": $scope.HospitalId,
            "PatientEmail": patient?.EmailId || "",
            "ClinicName": clinicname || "",
            "DoctorName": doctorname || "",
            "BranchAddress": branchAddress || "",
            "PatientFullName": patient?.FullName || "",
            "BranchContactNo": $scope.HospitalAddressArray.ContactNo || "",
            "BranchMobileNo": $scope.HospitalAddressArray.MobileNo || "",
            "IsFrom": type || "",
            "HospitalAddressArray": $scope.HospitalAddressArray || {},
            "UserId": $scope.UserId,
            "AppointmentId": ApptId,
            "EmailCommunicationProviderId": doctorinfo.doctordata.UserAddress[0].EmailCommunicationProviderId || 0,
            "EmailCommunicationEnabled": doctorinfo.doctordata.UserAddress[0].EmailCommunicationEnabled || false,
            'PatientDepositId': $scope.PatientDepositDetails.PatientDepositId || 0,
            'POSId': $scope.POSPrintMainObj.InvoiceId || 0
        };

        eHnoteInsuranceService.GenerateLedgerUrl(obj).then(resp => {
            if (resp.data.Message === "Success") {
                alertify.success("Email Sent Successfully");
            }
        });
    };

    $scope.GetPatientDepositDetailsEmailNew = function (type) {

        if (type === 'POSMail') {
            $scope.htmlContent = document.getElementById('POS_ReceiptPrint').innerHTML;
        } else {
            $scope.htmlContent = document.getElementById('PatientEachDeposit_Print').innerHTML;
        }
        $scope.GetPatientLedgerDetailsEmailNew(type);
    };


    $scope.navtoCollectPayment = function (id) {

        console.log($scope.PatientDetails);

        if ($scope.PatientDepositsObj.PatientId === 0) {
            alertify.error("Please Select Patient ");
            return;
        }

        //var depositAmt = parseFloat($scope.PatientDepositsObj.DepositAmount) || 0;
        //if (depositAmt === 0) {
        //    alertify.error("Please Enter Deposit Amount");
        //    return;
        //}



        //if ($scope.PatientDepositsObj.OrganizationFacilityId === 0) {
        //    alertify.error("Please select the location ");
        //    return;
        //}

        $scope.IsPaymentMode = true;

        var Parentobj = {
            "PatientId": $scope.PatientDepositsObj.PatientId,
            "AppointmentId": $scope.PatientDepositsObj.AppointmentId,
            "PatientFirstName": $scope.PatientDetails.FirstName,
            "PatientLastName": $scope.PatientDetails.LastName,
            "PatientDisplayId": $scope.PatientDetails.PatientDisplayId,
            "PatientEmailId": $scope.PatientDetails.EmailId,
            "PatientGender": $scope.PatientDetails.Gender,
            "PatientAgeInYears": $scope.PatientDetails.AgeInYears,
            "PatientAgeInMonths": $scope.PatientDetails.AgeInMonths,
            "PatientDOB": $scope.PatientDetails.DOB,
            "PatientMobileNumber": $scope.PatientDetails.MobileNo,
            "PatientZipCode": $scope.PatientDetails.ZipCode,
            "UserId": $scope.UserId,
            "HospitalId": $scope.HospitalId,
            "PaymentAmount": $scope.PatientDepositsObj.DepositAmount,
            "DepositAmount": $scope.PatientDepositsObj.DepositAmount,
            "DepositDate": $scope.PatientDepositsObj.DepositDate,
            "PaymentModeId": $scope.PatientDepositsObj.PaymentMethodId || 0,
            "PaymentMode": $scope.PatientDepositsObj.PaymentMethodName || "",
            "PaymentTypeId": 1,
            "PaymentType": "Deposit",
            "ScreenType": "AddDeposit",
            "AllCardTypes": $scope.AllCardTypes,
            "BillingProviderId": $scope.PatientDepositsObj.BillingProviderId,
            "IsDepositPrint": $scope.PatientDepositsObj.IsDepositPrint,
            "PatientDataObj": $scope.SelectedPatientDetails.PatientObj || {},
            "PatientDepositsObj": $scope.PatientDepositsObj || {},
            "DepositTypeId": $scope.PatientDepositsObj.DepositTypeId,
            "DepositType": $scope.PatientDepositsObj.DepositTypeName,
            "Notes": $scope.PatientDepositsObj.Notes,
            "PatientClaimId": $scope.mainPatientProfileObj.PatientClaimId || null,
            "mainBillerDataObj": {},
            "IsPaymentMode": $scope.IsPaymentMode,
            "DepositTypes": $scope.DepositTypes,
            "DepositscreenTypeId": id,
            "TransactionCategoryId": 1,
            "TransactionCategoryName":'Deposit'

        }
        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/collectPayment.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            "resolve": {
                "Parentobj": function () { return Parentobj; }
            },
            "windowClass": "modal__ninetyfive--",
            "controller": "UsMainNmiPaymentCtrl",
        });
        $scope.mInstanceAdd.result.then(function (resp) {
            console.log(resp);
            if (resp != undefined) {
                if (resp.Status === "Success") {

                    $scope.SelectedPatientDetails.DepositsObj = angular.copy($scope.PatientDepositsObj) || "";
                    $scope.SelectedPatientDetails.DepositsObj.IsDepositPrint = resp.IsDepositPrint || false;
                    if ($scope.SelectedPatientDetails.DepositsObj.IsDepositPrint == true) {
                        $scope.SelectedPatientDetails.DepositsObj.ReceiptNo = resp.ReceiptNo || '';
                        $scope.SelectedPatientDetails.DepositsObj.CreatedBy = resp.CreatedBy || '';
                        $scope.SelectedPatientDetails.DepositsObj.BillingProviderName = resp.BillingProviderName || '';
                        $scope.SelectedPatientDetails.DepositsObj.PatientDepositPaymodeList = resp.PatientDepositPaymodeList || [];
                        /*  $scope.AddDespositePrint($scope.SelectedPatientDetails.DepositsObj, $scope.SelectedPatientDetails.PatientObj, 1);*/
                        $scope.AddTransactionPrint(resp);
                    } else {

                    }

                    $scope.PatientDepositsObj = angular.copy($scope.GetPatientDepositsObj());
                    $scope.PaymentMethodObj = angular.copy($scope.GetPaymentmethodList());



                    $scope.SelectedPatientDetails.DepositsObj = "";

                }
            }
            $scope.IsPaymentMode = false;
            $scope.getPatientDepositAmountById();
            $scope.GetPatientTotalRevenueBalance();
        }, function (cancel) {
        });
    };


    $scope.AddTransactionPrint = function (item) {
        $scope.DepositTransactionObj.PatientFullName = item.PatientFullName || '';
        $scope.DepositTransactionObj.PatientDisplayId = item.PatientDisplayId || '';
        $scope.DepositTransactionObj.TransactionDate = item.DepositTransaction[0].TransactionDate || '';
        $scope.DepositTransactionObj.TransactionTime = item.DepositTransaction[0].TransactionTime || '';
        $scope.DepositTransactionObj.TransReciptNo = item.DepositTransaction[0].TransReciptNo || '';
        $scope.DepositTransactionObj.PaymentMethodName = item.PatientDepositPaymodeList[0].PaymentMethodName || '';
        $scope.DepositTransactionObj.CardNumber = item.PatientDepositPaymodeList[0].CardNumber || '';
        $scope.DepositTransactionObj.ChequeNumber = item.PatientDepositPaymodeList[0].ChequeNumber || '';
        $scope.DepositTransactionObj.CardType = item.PatientDepositPaymodeList[0].CardType || '';
        $scope.DepositTransactionObj.OnlineTransactionNumber = item.PatientDepositPaymodeList[0].OnlineTransactionNumber || '';
        $scope.DepositTransactionObj.TransactionAmount = item.PatientDepositPaymodeList[0].DepositAmount || '';
        $scope.DepositTransactionObj.ReceiptNumber = item.ReceiptNo || '';
        $scope.DepositTransactionObj.OrganizationName = item.DepositTransaction[0].OrganizationName || '';

        var filtredArray = $filter("filter")($scope.AllBranchesList, { "BranchId": item.DepositTransaction[0].OrganizationId }, true) || [];
        if (filtredArray.length > 0) {
            $scope.DepositTransactionObj.CityTown = filtredArray[0].CityTown;
            $scope.DepositTransactionObj.State = filtredArray[0].State;
            $scope.DepositTransactionObj.Country = filtredArray[0].Country;
            $scope.DepositTransactionObj.FaxNumber = filtredArray[0].FaxNumber || "";
            if ($scope.DepositTransactionObj.FaxNumber != "") {
                var obj = eHnoteUserDataService.UsMobileFormatChange($scope.DepositTransactionObj.FaxNumber);
                $scope.DepositTransactionObj.FaxNumber = obj.UsFormatMobileNumber;
            }
        }


        $scope.HospitalAddress = $scope.HospitalAddressArray || null;
        if ($scope.HospitalAddress.PharmacyPhoneNo != "") {
            var obj = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddress.PharmacyPhoneNo);
            $scope.HospitalAddress.PharmacyPhoneNo = obj.UsFormatMobileNumber;
        }
        if ($scope.HospitalAddress.ContactNo != "") {
            var obj = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddress.ContactNo);
            $scope.HospitalAddress.ContactNo = obj.UsFormatMobileNumber;
        }

        $scope.Depositprintpopup();

    }

    $scope.OpenPatientAlert = function () {

        let obj = {
            "PatientId": $scope.mainPatientProfileObj.PatientId,
            "PatientFullName": $scope.mainPatientProfileObj.PatientDetails.FullName,
            "PatientDisplayID": $scope.mainPatientProfileObj.PatientDisplayId,
            "StatusId": 2,
            "MasterPriority": $scope.MasterPriority,
            "MasterAlertTypes": $scope.MasterAlertTypes,
            "MasterAlertTag": $scope.MasterAlertTag,
            "MasterAlertNoteType": $scope.MasterAlertNoteType,
        }

        let mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/UsClaims/AddUpdatePatientAlerts.html",
            "controller": "USPatientAlertsCtrl",
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

    $scope.openpatientEOBprint = function (item) {

        var PatientId = $scope.cacheStorageItem.PatientID || null;
        var ERAId = item.ERAId || item.EraId || null;
        var PayerClaimControlNumber = item.PayerClaimControlNumber || "";

        eHnoteInsuranceService.GetEOBPatientPostingPrintDetails(ERAId, PatientId, PayerClaimControlNumber).then(function (resp) {

            if (resp.data.status == "Success") {
                var ERAresp = angular.copy(resp.data.rows);
                var MatchedClaimsList = (ERAresp.Claims).filter(function (claim) {
                    return claim.PatientClaimNumber === $scope.ClaimDetails.PatientClaimNumber;
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

                            });

                        });


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


    $scope.ParticularClaimTransactionHCFAPrint = function (item, type) {

        item.PatientClaimLogId = item.PatientClaimLogId || 0;

        var obj = {
            "PatientClaimLogId": item.PatientClaimLogId || 0,
            "PatientId": item.PatientId || 0,
        }


        eHnoteInsuranceService.GetPatientParticularClaimTransactionLogDetails(obj).then(function (resp) {
            console.log(JSON.stringify(resp));

            if (resp.data.status == "Success") {

                $scope.HCFADetailsInfo = eHnoteCacheStorageService.GetHCFAStorageStructure();
                $scope.HCFADetailsInfo.PreAuthorizationNumber = resp.data.PrimaryInsuranceAuthorizationNumber && resp.data.PrimaryInsuranceAuthorizationNumber.trim() !== ''
                    ? resp.data.PrimaryInsuranceAuthorizationNumber
                    : (resp.data.SecondaryInsuranceAuthorizationNumber && resp.data.SecondaryInsuranceAuthorizationNumber.trim() !== ''
                        ? resp.data.SecondaryInsuranceAuthorizationNumber
                        : '');
                $scope.HCFADetailsInfo.PatientDetails.fullname = resp.data.Patient[0].FirstName + " " + resp.data.Patient[0].MiddleName + " " + resp.data.Patient[0].LastName + " " + resp.data.Patient[0].SecondLastName;
                $scope.HCFADetailsInfo.PatientDetails.DOB = resp.data.DOB || "";
                $scope.HCFADetailsInfo.PatientDetails.FirstName = resp.data.Patient[0].FirstName;
                $scope.HCFADetailsInfo.PatientDetails.MiddleName = resp.data.Patient[0].MiddleName;
                $scope.HCFADetailsInfo.PatientDetails.LastName = resp.data.Patient[0].LastName;
                $scope.HCFADetailsInfo.PatientDetails.SecondLastName = resp.data.Patient[0].SecondLastName;

                var obj = eHnoteUserDataService.UsMobileFormatChange(resp.data.PatientMobile);
                $scope.HCFADetailsInfo.PatientDetails.MobileNo = obj.UsFormatMobileNumber;

                $scope.HCFADetailsInfo.PatientDetails.ContactNo = resp.data.ContactNo || "";
                if ($scope.HCFADetailsInfo.PatientDetails.ContactNo.length > 10) {
                    var obj = eHnoteUserDataService.UsMobileFormatChange(resp.data.ContactNo);
                    $scope.HCFADetailsInfo.PatientDetails.ContactNo = obj.UsFormatMobileNumber;
                }

                $scope.HCFADetailsInfo.PatientDetails.Title = resp.data.Title || "";
                $scope.HCFADetailsInfo.PatientDetails.Sex = resp.data.Gender;
                $scope.HCFADetailsInfo.PatientDetails.PatientDisplayId = resp.data.PatientDisplayId;
                $scope.HCFADetailsInfo.PatientAccountNo = resp.data.PatientClaimNumber || "";
                if ($scope.isIojOrgEnable) {

                    if (resp.data.CurrentResponsibilityId == 2) {
                        $scope.HCFADetailsInfo.PatientAccountNo = $scope.HCFADetailsInfo.PatientAccountNo + "P";
                    }
                    else if (resp.data.CurrentResponsibilityId == 3) {
                        $scope.HCFADetailsInfo.PatientAccountNo = $scope.HCFADetailsInfo.PatientAccountNo + "S";
                    }
                    else {
                        $scope.HCFADetailsInfo.PatientAccountNo = $scope.HCFADetailsInfo.PatientAccountNo;
                    }
                }

                if (resp.data.Patient.length > 0) {

                    var patientresp = resp.data.Patient[0];

                    $scope.HCFADetailsInfo.PatientDetails.CityName = patientresp.PostalAddress.CityName || "";
                    $scope.HCFADetailsInfo.PatientDetails.StateName = patientresp.PostalAddress.StateName || "";
                    $scope.HCFADetailsInfo.PatientDetails.StateCode = patientresp.PostalAddress.StateCode || "";
                    $scope.HCFADetailsInfo.PatientDetails.ZipCode = patientresp.PostalAddress.ZipCode || "";
                    $scope.HCFADetailsInfo.PatientDetails.Address1 = patientresp.PostalAddress.AddressLine1 || "";
                    $scope.HCFADetailsInfo.PatientDetails.Address2 = patientresp.PostalAddress.AddressLine2 || "";

                    $scope.HCFADetailsInfo.InsuranceDetails.Address = $scope.HCFADetailsInfo.PatientDetails.Address1 + " , " + $scope.HCFADetailsInfo.PatientDetails.Address2;
                    $scope.HCFADetailsInfo.InsuranceDetails.CityName = patientresp.PostalAddress.CityName || "";
                    $scope.HCFADetailsInfo.InsuranceDetails.StateName = patientresp.PostalAddress.StateName || "";
                    $scope.HCFADetailsInfo.InsuranceDetails.StateCode = patientresp.PostalAddress.StateCode || "";
                    $scope.HCFADetailsInfo.InsuranceDetails.ZipCode = patientresp.PostalAddress.ZipCode || "";
                }

                $scope.HCFADetailsInfo.PatientDetails.CountryCode = resp.data.CountryCode || "";
                $scope.HCFADetailsInfo.PatientSSN = resp.data.PatientSSN || "";
                //$scope.HCFADetailsInfo.FeedralTaxIDNo = $scope.HospitalData[0].TaxID || "";
                //if ($scope.HCFADetailsInfo.FeedralTaxIDNo != "") {
                //    $scope.HCFADetailsInfo.SSN = "yes";
                //}

                $scope.HCFADetailsInfo.FeedralTaxIDNo = resp.data.BillingProviderTaxId || "";
                //if ($scope.HCFADetailsInfo.FeedralTaxIDNo != "") {
                //    $scope.HCFADetailsInfo.SSN = "yes";
                //}

                $scope.HCFADetailsInfo.EIN = "yes";

                $scope.HCFADetailsInfo.CurrentDate = $filter('date')(resp.data.AdmissionDate, "MM/dd/yyyy");

                var currentdate = $filter('date')(new Date(), 'MM-dd-yyyy');
                $scope.HCFADetailsInfo.datesPatientUnabletoWorkincurrentoccupation.FormDate = $filter('date')(resp.data.DOSfrom, 'MM-dd-yyyy') || currentdate;
                $scope.HCFADetailsInfo.datesPatientUnabletoWorkincurrentoccupation.ToDate = $filter('date')(resp.data.DOSto, 'MM-dd-yyyy') || currentdate;
                $scope.HCFADetailsInfo.hospitalizationDatesRelatedToCurrentServices.FormDate = $filter('date')(resp.data.DOSfrom, 'MM-dd-yyyy') || currentdate;
                $scope.HCFADetailsInfo.hospitalizationDatesRelatedToCurrentServices.ToDate = $filter('date')(resp.data.DOSto, 'MM-dd-yyyy') || currentdate;


                $scope.HCFADetailsInfo.HeaderInsurance.PayorName = resp.data.PayorName || "";
                $scope.HCFADetailsInfo.HeaderInsurance.Address = resp.data.PayorAddress || "";
                $scope.HCFADetailsInfo.HeaderInsurance.PatientDisplayId = resp.data.PatientDisplayId || "";

                if ($scope.ClaimDetailsList[0].AppointmentInsuranceDetails.length > 0) {

                    if (resp.data.CurrentResponsibilityId == 2) {
                        $scope.HCFADetailsInfo.HeaderInsurance.Address1 = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].PayorAddress1 || "";
                        $scope.HCFADetailsInfo.HeaderInsurance.Address2 = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].PayorAddress2 || "";
                        $scope.HCFADetailsInfo.HeaderInsurance.PayorCityName = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].PayorCityName || "";
                        $scope.HCFADetailsInfo.HeaderInsurance.PayorStateName = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].PayorStateName || "";
                        $scope.HCFADetailsInfo.HeaderInsurance.PayorCountryName = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].PayorCountryName || "";
                        $scope.HCFADetailsInfo.HeaderInsurance.PayorZipCode = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].PayorZipCode || "";
                        $scope.HCFADetailsInfo.HeaderInsurance.PayorCode = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].PayorCode || "";
                        $scope.HCFADetailsInfo.HeaderInsurance.PayorStateCode = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].PayorStateCode || "";
                        $scope.HCFADetailsInfo.HeaderInsurance.UserTaxonomyCode = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].UserTaxonomyCode || "";
                        $scope.HCFADetailsInfo.PatientDetails.DoctorName = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].DoctorName || "";
                        $scope.HCFADetailsInfo.PatientDetails.RelationName = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].RelationName || "";
                        $scope.HCFADetailsInfo.PatientDetails.RelationShipId = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].RelationShipId || "";
                        $scope.HCFADetailsInfo.PatientDetails.AppointmentDate = $filter('date')($scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].AppointmentDate, 'MM-dd-yyyy') || "";
                        $scope.HCFADetailsInfo.PatientDetails.InsuranceTypeCode = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].InsuranceTypeCode || "";
                        $scope.HCFADetailsInfo.HeaderInsurance.PayorId = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].PayorId || "";
                        $scope.HCFADetailsInfo.HeaderInsurance.GlobalPayorId = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].GlobalPayorId || "";
                    }
                    else if (resp.data.CurrentResponsibilityId == 3) {
                        if ($scope.ClaimDetailsList[0].AppointmentInsuranceDetails.length > 1) {
                            $scope.HCFADetailsInfo.HeaderInsurance.Address1 = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[1].PayorAddress1 || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.Address2 = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[1].PayorAddress2 || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.PayorCityName = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[1].PayorCityName || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.PayorStateName = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[1].PayorStateName || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.PayorCountryName = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[1].PayorCountryName || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.PayorZipCode = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[1].PayorZipCode || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.PayorCode = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[1].PayorCode || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.PayorStateCode = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[1].PayorStateCode || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.UserTaxonomyCode = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[1].UserTaxonomyCode || "";
                            $scope.HCFADetailsInfo.PatientDetails.DoctorName = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[1].DoctorName || "";
                            $scope.HCFADetailsInfo.PatientDetails.RelationName = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[1].RelationName || "";
                            $scope.HCFADetailsInfo.PatientDetails.RelationShipId = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[1].RelationShipId || "";
                            $scope.HCFADetailsInfo.PatientDetails.AppointmentDate = $filter('date')($scope.ClaimDetailsList[0].AppointmentInsuranceDetails[1].AppointmentDate, 'MM-dd-yyyy') || "";
                            $scope.HCFADetailsInfo.PatientDetails.InsuranceTypeCode = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[1].InsuranceTypeCode || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.PayorId = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[1].PayorId || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.GlobalPayorId = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[1].GlobalPayorId || "";
                        } else {
                            $scope.HCFADetailsInfo.HeaderInsurance.Address1 = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].PayorAddress1 || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.Address2 = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].PayorAddress2 || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.PayorCityName = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].PayorCityName || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.PayorStateName = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].PayorStateName || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.PayorCountryName = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].PayorCountryName || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.PayorZipCode = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].PayorZipCode || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.PayorCode = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].PayorCode || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.PayorStateCode = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].PayorStateCode || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.UserTaxonomyCode = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].UserTaxonomyCode || "";
                            $scope.HCFADetailsInfo.PatientDetails.DoctorName = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].DoctorName || "";
                            $scope.HCFADetailsInfo.PatientDetails.RelationName = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].RelationName || "";
                            $scope.HCFADetailsInfo.PatientDetails.RelationShipId = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].RelationShipId || "";
                            $scope.HCFADetailsInfo.PatientDetails.AppointmentDate = $filter('date')($scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].AppointmentDate, 'MM-dd-yyyy') || "";
                            $scope.HCFADetailsInfo.PatientDetails.InsuranceTypeCode = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].InsuranceTypeCode || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.PayorId = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].PayorId || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.GlobalPayorId = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].GlobalPayorId || "";
                        }

                    }
                    else {
                        if ($scope.ClaimDetailsList[0].AppointmentInsuranceDetails.length > 2) {
                            $scope.HCFADetailsInfo.HeaderInsurance.Address1 = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[2].PayorAddress1 || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.Address2 = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[2].PayorAddress2 || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.PayorCityName = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[2].PayorCityName || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.PayorStateName = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[2].PayorStateName || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.PayorCountryName = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[2].PayorCountryName || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.PayorZipCode = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[2].PayorZipCode || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.PayorCode = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[2].PayorCode || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.PayorStateCode = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[2].PayorStateCode || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.UserTaxonomyCode = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[2].UserTaxonomyCode || "";
                            $scope.HCFADetailsInfo.PatientDetails.DoctorName = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[2].DoctorName || "";
                            $scope.HCFADetailsInfo.PatientDetails.RelationName = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[2].RelationName || "";
                            $scope.HCFADetailsInfo.PatientDetails.RelationShipId = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[2].RelationShipId || "";
                            $scope.HCFADetailsInfo.PatientDetails.AppointmentDate = $filter('date')($scope.ClaimDetailsList[0].AppointmentInsuranceDetails[2].AppointmentDate, 'MM-dd-yyyy') || "";
                            $scope.HCFADetailsInfo.PatientDetails.InsuranceTypeCode = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[2].InsuranceTypeCode || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.PayorId = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[2].PayorId || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.GlobalPayorId = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[2].GlobalPayorId || "";
                        } else {
                            $scope.HCFADetailsInfo.HeaderInsurance.Address1 = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].PayorAddress1 || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.Address2 = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].PayorAddress2 || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.PayorCityName = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].PayorCityName || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.PayorStateName = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].PayorStateName || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.PayorCountryName = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].PayorCountryName || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.PayorZipCode = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].PayorZipCode || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.PayorCode = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].PayorCode || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.PayorStateCode = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].PayorStateCode || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.UserTaxonomyCode = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].UserTaxonomyCode || "";
                            $scope.HCFADetailsInfo.PatientDetails.DoctorName = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].DoctorName || "";
                            $scope.HCFADetailsInfo.PatientDetails.RelationName = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].RelationName || "";
                            $scope.HCFADetailsInfo.PatientDetails.RelationShipId = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].RelationShipId || "";
                            $scope.HCFADetailsInfo.PatientDetails.AppointmentDate = $filter('date')($scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].AppointmentDate, 'MM-dd-yyyy') || "";
                            $scope.HCFADetailsInfo.PatientDetails.InsuranceTypeCode = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].InsuranceTypeCode || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.PayorId = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].PayorId || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.GlobalPayorId = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].GlobalPayorId || "";
                        }

                    }

                }

                if ($scope.ClaimDetailsList[0].AppointmentInsuranceDetails.length > 1) {
                    $scope.HCFADetailsInfo.InsuranceDetails.IsThereAnotherHealthBenefitPlan = "Yes";
                } else {
                    $scope.HCFADetailsInfo.InsuranceDetails.IsThereAnotherHealthBenefitPlan = "No";
                }

                //if (resp.data.CurrentResponsibilityId == 2) {
                //    $scope.HCFADetailsInfo.InsuranceDetails.IsThereAnotherHealthBenefitPlan = "No";
                //} else {
                //    $scope.HCFADetailsInfo.InsuranceDetails.IsThereAnotherHealthBenefitPlan = "Yes";
                //}

                $scope.HCFADetailsInfo.PatientDetails.DoctorName = $scope.HCFADetailsInfo.PatientDetails.DoctorName || "";
                if ($scope.HCFADetailsInfo.PatientDetails.DoctorName == "") {
                    $scope.HCFADetailsInfo.PatientDetails.DoctorName = doctorinfo.doctordata.User[0].FullName;
                }

                $scope.HCFADetailsInfo.InsuranceDetails.PolicyId = resp.data.PolicyId || 0;
                $scope.HCFADetailsInfo.InsuranceDetails.InsurancePlanName = resp.data.ProffesionalPayerId || "";
                $scope.HCFADetailsInfo.InsuranceDetails.InsurancePayorName = resp.data.OrganizationPayorName || "";
                $scope.HCFADetailsInfo.InsuranceDetails.PolicyGroupId = resp.data.GroupId || 0;
                $scope.HCFADetailsInfo.InsuranceDetails.PolicyGroupname = resp.data.Groupname || 0;

                $scope.HCFADetailsInfo.PatientDetails.RelationshipToInsured = resp.data.RelationShipId || 0;


                $scope.HCFADetailsInfo.InsuranceDetails.InsurancePersonName = resp.data.FirstName + " " + resp.data.Lastname || "";

                $scope.HCFADetailsInfo.InsuranceDetails.MobileNo = $scope.HCFADetailsInfo.PatientDetails.ContactNo || "";
                $scope.HCFADetailsInfo.InsuranceDetails.Gender = resp.data.Gender == "Female" ? "F" : "M";
                $scope.HCFADetailsInfo.InsuranceDetails.DOB = resp.data.DOB;
                $scope.HCFADetailsInfo.InsuranceDetails.TelephoneCode = resp.data.CountryCode || "";

                $scope.HCFADetailsInfo.OriginalRefNo = resp.data.PatientClaimNo || "";


                var fRenderingobj = $filter("filter")($scope.filteredBranchDoctorsList, { "DoctorID": resp.data.RenderingProviderId }) || [];
                if (fRenderingobj.length > 0) {
                    $scope.HCFADetailsInfo.RenderingProviderTaxonomyCode = fRenderingobj[0].TaxonomyCode || "";
                }

                if ($scope.ClaimDetailsList[0].AppointmentInsuranceDetails.length > 0) {
                    $scope.HCFADetailsInfo.InsuranceDetails.InsuredPersonFirstName1 = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].InsuredPersonFirstName || "";
                    $scope.HCFADetailsInfo.InsuranceDetails.InsuredPersonMiddleName1 = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].InsuredPersonMiddleName || "";
                    $scope.HCFADetailsInfo.InsuranceDetails.InsuredPersonLastName1 = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].InsuredPersonLastName || "";
                    $scope.HCFADetailsInfo.InsuranceDetails.InsuredPersonGenderID1 = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].InsuredPersonGenderID || "";
                    $scope.HCFADetailsInfo.InsuranceDetails.PlanTypeId = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].PlanTypeId || "";
                    $scope.HCFADetailsInfo.InsuranceDetails.PayorPlanCode = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].PayorPlanCode || "";
                    $scope.HCFADetailsInfo.InsuranceDetails.PayorTypeId = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].PayorTypeId || 0;
                    $scope.HCFADetailsInfo.InsuranceDetails.CoverageName = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].CoverageName || "";
                    $scope.HCFADetailsInfo.InsuranceDetails.PlanName = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].PlanName || "";
                    $scope.HCFADetailsInfo.InsuranceDetails.InsurancePayorName = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].OrganizationPayorName || "";
                    $scope.HCFADetailsInfo.InsuranceDetails.PolicyId = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].PolicyId || "";

                }

                if ($scope.ClaimDetailsList[0].AppointmentInsuranceDetails[1] != undefined) {
                    $scope.HCFADetailsInfo.InsuranceDetails.InsuredPersonFirstName2 = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[1].InsuredPersonFirstName || "";
                    $scope.HCFADetailsInfo.InsuranceDetails.InsuredPersonMiddleName2 = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[1].InsuredPersonMiddleName || "";
                    $scope.HCFADetailsInfo.InsuranceDetails.InsuredPersonLastName2 = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[1].InsuredPersonLastName || "";
                    $scope.HCFADetailsInfo.InsuranceDetails.InsuredPersonGenderID2 = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[1].InsuredPersonGenderID || "";
                    $scope.HCFADetailsInfo.InsuranceDetails.PayorName2 = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[1].OrganizationPayorName || "";
                    $scope.HCFADetailsInfo.InsuranceDetails.PlanName2 = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[1].PlanName || "";
                    $scope.HCFADetailsInfo.InsuranceDetails.OtherInsPolicyId = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[1].PolicyId || "";
                }

                if (resp.data.CurrentResponsibilityId == 3) {
                    $scope.HCFADetailsInfo.InsuranceDetails.InsuredPersonFirstName2 = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].InsuredPersonFirstName || "";
                    $scope.HCFADetailsInfo.InsuranceDetails.InsuredPersonMiddleName2 = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].InsuredPersonMiddleName || "";
                    $scope.HCFADetailsInfo.InsuranceDetails.InsuredPersonLastName2 = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].InsuredPersonLastName || "";
                    $scope.HCFADetailsInfo.InsuranceDetails.InsuredPersonGenderID2 = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].InsuredPersonGenderID || "";
                    $scope.HCFADetailsInfo.InsuranceDetails.PayorName2 = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].OrganizationPayorName || "";
                    $scope.HCFADetailsInfo.InsuranceDetails.PlanName2 = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].PlanName || "";
                    $scope.HCFADetailsInfo.InsuranceDetails.OtherInsPolicyId = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].PolicyId || "";
                    $scope.HCFADetailsInfo.InsuranceDetails.PolicyGroupId = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].GroupId || "";
                    $scope.HCFADetailsInfo.InsuranceDetails.PolicyGroupname = $scope.ClaimDetailsList[0].AppointmentInsuranceDetails[0].Groupname || "";
                }

                //if (resp.data.CurrentResponsibilityId == 3) {
                //    $scope.HCFADetailsInfo.InsuranceDetails.InsuredPersonFirstName2 = resp.data.AppointmentInsuranceDetails[0].InsuredPersonFirstName || "";
                //    $scope.HCFADetailsInfo.InsuranceDetails.InsuredPersonMiddleName2 = resp.data.AppointmentInsuranceDetails[0].InsuredPersonMiddleName || "";
                //    $scope.HCFADetailsInfo.InsuranceDetails.InsuredPersonLastName2 = resp.data.AppointmentInsuranceDetails[0].InsuredPersonLastName || "";
                //    $scope.HCFADetailsInfo.InsuranceDetails.InsuredPersonGenderID2 = resp.data.AppointmentInsuranceDetails[0].InsuredPersonGenderID || "";
                //    $scope.HCFADetailsInfo.InsuranceDetails.PayorName2 = resp.data.AppointmentInsuranceDetails[0].OrganizationPayorName || "";
                //    $scope.HCFADetailsInfo.InsuranceDetails.PlanName2 = resp.data.AppointmentInsuranceDetails[0].PlanName || "";
                //    $scope.HCFADetailsInfo.InsuranceDetails.OtherInsPolicyId = resp.data.AppointmentInsuranceDetails[0].PolicyId || "";
                //}

                if (resp.data.PatientClaimTransmission[0] != undefined) {
                    $scope.HCFADetailsInfo.InsuranceDetails.BillTypeFrequencyCode = resp.data.PatientClaimTransmission[0].BillTypeFrequencyCode || "";
                    $scope.HCFADetailsInfo.InsuranceDetails.TransmissionMethodId = resp.data.PatientClaimTransmission[0].TransmissionMethodId || "";
                    $scope.HCFADetailsInfo.InsuranceDetails.ReplacementControlNumber = resp.data.PatientClaimTransmission[0].ReplacementControlNumber || "";
                }

                if (resp.data.AppointmentInsuranceDetails.length > 0) {

                    var filtredArray = $filter("filter")(resp.data.AppointmentInsuranceDetails, { "PatientInsuranceDetailId": item.TransmitQueuePatientInsuranceId }, true) || [];

                    if (filtredArray.length > 0) {
                        //  $scope.HCFADetailsInfo.TypeOfPayor = filtredArray[0].PayorName || "";
                        $scope.HCFADetailsInfo.HeaderInsurance.PayorName = filtredArray[0].PayorName || "";
                        $scope.HCFADetailsInfo.HeaderInsurance.Address1 = filtredArray[0].PayorAddress1 || "";
                        $scope.HCFADetailsInfo.HeaderInsurance.Address2 = filtredArray[0].PayorAddress2 || "";
                        $scope.HCFADetailsInfo.HeaderInsurance.PayorCityName = filtredArray[0].PayorCityName || "";
                        $scope.HCFADetailsInfo.HeaderInsurance.PayorStateName = filtredArray[0].PayorStateName || "";
                        $scope.HCFADetailsInfo.HeaderInsurance.PayorCountryName = filtredArray[0].PayorCountryName || "";
                        $scope.HCFADetailsInfo.HeaderInsurance.PayorZipCode = filtredArray[0].PayorZipCode || "";
                        $scope.HCFADetailsInfo.HeaderInsurance.PayorCode = filtredArray[0].PayorCode || "";
                        $scope.HCFADetailsInfo.HeaderInsurance.PayorStateCode = filtredArray[0].PayorStateCode || "";
                        $scope.HCFADetailsInfo.HeaderInsurance.UserTaxonomyCode = filtredArray[0].UserTaxonomyCode || "";
                        $scope.HCFADetailsInfo.PatientDetails.DoctorName = filtredArray[0].DoctorName || "";
                        $scope.HCFADetailsInfo.PatientDetails.RelationName = filtredArray[0].RelationName || "";
                        $scope.HCFADetailsInfo.PatientDetails.RelationShipId = filtredArray[0].RelationShipId || "";
                        $scope.HCFADetailsInfo.PatientDetails.AppointmentDate = $filter('date')(filtredArray[0].AppointmentDate, 'MM-dd-yyyy') || "";
                        $scope.HCFADetailsInfo.PatientDetails.InsuranceTypeCode = filtredArray[0].InsuranceTypeCode || "";
                        $scope.HCFADetailsInfo.HeaderInsurance.PayorId = filtredArray[0].PayorId || "";
                        $scope.HCFADetailsInfo.HeaderInsurance.GlobalPayorId = filtredArray[0].GlobalPayorId || "";

                        $scope.HCFADetailsInfo.InsuranceDetails.PolicyId = filtredArray[0].PolicyId || 0;
                        $scope.HCFADetailsInfo.InsuranceDetails.InsurancePlanName = filtredArray[0].ProffesionalPayerId || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.InsurancePayorName = filtredArray[0].OrganizationPayorName || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.PolicyGroupId = filtredArray[0].GroupId || 0;
                        $scope.HCFADetailsInfo.InsuranceDetails.PolicyGroupname = filtredArray[0].Groupname || 0;
                        $scope.HCFADetailsInfo.InsuranceDetails.InsurancePersonName = filtredArray[0].InsuredPersonFirstName + " " + filtredArray[0].InsuredPersonLastName || "";

                        $scope.HCFADetailsInfo.InsuranceDetails.MobileNo = filtredArray[0].ContactNo || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.Gender = filtredArray[0].InsuredPersonGenderID;
                        $scope.HCFADetailsInfo.InsuranceDetails.DOB = filtredArray[0].InsuredPersonDOB;

                        $scope.HCFADetailsInfo.InsuranceDetails.TelephoneCode = "";


                        $scope.HCFADetailsInfo.InsuranceDetails.InsuredPersonFirstName1 = filtredArray[0].InsuredPersonFirstName || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.InsuredPersonMiddleName1 = filtredArray[0].InsuredPersonMiddleName || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.InsuredPersonLastName1 = filtredArray[0].InsuredPersonLastName || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.InsuredPersonGenderID1 = filtredArray[0].InsuredPersonGenderID || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.PlanTypeId = filtredArray[0].PlanTypeId || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.PayorPlanCode = filtredArray[0].PayorPlanCode || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.PayorTypeId = filtredArray[0].PayorTypeId || 0;
                        $scope.HCFADetailsInfo.InsuranceDetails.CoverageName = filtredArray[0].CoverageName || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.PlanName = filtredArray[0].PlanName || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.InsurancePayorName = filtredArray[0].OrganizationPayorName || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.PolicyId = filtredArray[0].PolicyId || "";
                    }




                }


                $scope.HCFADetailsInfo.Diagnosis1 = resp.data.ICD1 || "";
                $scope.HCFADetailsInfo.Diagnosis2 = resp.data.ICD2 || "";
                $scope.HCFADetailsInfo.Diagnosis3 = resp.data.ICD3 || "";
                $scope.HCFADetailsInfo.Diagnosis4 = resp.data.ICD4 || "";
                $scope.HCFADetailsInfo.Diagnosis5 = resp.data.ICD5 || "";
                $scope.HCFADetailsInfo.Diagnosis6 = resp.data.ICD6 || "";
                $scope.HCFADetailsInfo.Diagnosis7 = resp.data.ICD7 || "";
                $scope.HCFADetailsInfo.Diagnosis8 = resp.data.ICD8 || "";
                $scope.HCFADetailsInfo.Diagnosis9 = resp.data.ICD9 || "";
                $scope.HCFADetailsInfo.Diagnosis10 = resp.data.ICD10 || "";
                $scope.HCFADetailsInfo.Diagnosis11 = resp.data.ICD11 || "";
                $scope.HCFADetailsInfo.Diagnosis12 = resp.data.ICD12 || "";

                $scope.HCFADetailsInfo.PlaceOfServiceName = resp.data.PlaceOfServiceName || "";
                $scope.HCFADetailsInfo.PlaceOfServiceId = resp.data.PlaceOfServiceId || "";

                $scope.HCFADetailsInfo.ProcedureList = $scope.HCFADetailsInfo.ProcedureList || [];
                var ProcedureListArray = [];
                $scope.HCFADetailsInfo.DiagnosisList = $scope.HCFADetailsInfo.DiagnosisList || [];
                if (resp.data.PatientClaimLineItems.length > 0) {
                    var i = 1;
                    angular.forEach(resp.data.PatientClaimLineItems, function (mainitem) {
                        mainitem.DiagnosisList = mainitem.DiagnosisList || [];
                        if (mainitem.DiagnosisList.length > 0) {
                            angular.forEach(mainitem.DiagnosisList, function (subitem) {
                                var array = $filter("filter")($scope.HCFADetailsInfo.DiagnosisList, { "DiagnosisId": subitem.DiagnosisId }, true) || [];
                                if (array.length === 0) {
                                    var sno = i++;
                                    subitem.SNO = sno;
                                    subitem.Date = $filter("date")(new Date(mainitem.AppointmentDate), "MMM-dd-yyyy");
                                    $scope.HCFADetailsInfo.DiagnosisList.push(subitem);
                                }
                            });
                        }
                        ProcedureListArray.push(mainitem);
                    });
                }
                if (ProcedureListArray.length > 0) {
                    angular.forEach(ProcedureListArray, function (pitem) {

                        pitem.Modifier1 = pitem.Modifier1 || "";
                        pitem.Modifier2 = pitem.Modifier2 || "";
                        pitem.Modifier3 = pitem.Modifier3 || "";
                        pitem.Modifier4 = pitem.Modifier4 || "";

                        var ModifierString = "" + pitem.Modifier1;
                        if (ModifierString != "" && pitem.Modifier2 != "") {
                            ModifierString = ModifierString + ", " + pitem.Modifier2;
                        } else {
                            ModifierString = ModifierString + pitem.Modifier2;
                        }
                        if (ModifierString != "" && pitem.Modifier3 != "") {
                            ModifierString = ModifierString + ", " + pitem.Modifier3;
                        } else {
                            ModifierString = ModifierString + pitem.Modifier3;
                        }
                        if (ModifierString != "" && pitem.Modifier4 != "") {
                            ModifierString = ModifierString + ", " + pitem.Modifier4;
                        } else {
                            ModifierString = ModifierString + pitem.Modifier4;
                        }
                        pitem.DiagnosisIds = pitem.DiagnosisIds || [];
                        pitem.DiagnosisPointer = GetDiagnosisPointer(pitem.DiagnosisIds);

                        //var IntegerNumber = Math.floor(pitem.TotalChargeAmount);
                        //var DecimalNumber = Math.round((pitem.TotalChargeAmount - IntegerNumber) * 100);

                        var amount = Number(pitem.TotalChargeAmount).toFixed(2);

                        var parts = amount.split('.');
                        var IntegerNumber = parts[0];
                        var DecimalNumber = parts[1];

                        $scope.IntegerNumber = IntegerNumber;
                        $scope.DecimalNumber = DecimalNumber;


                        var array = {
                            "ProcedureName": pitem.ServiceName,
                            "EPSDTFamilyPlan1": "  ",
                            "IdQual1": " ",
                            "RenderingProviderId1": " ",
                            "FromDate": $filter('date')(pitem.DOSfrom, 'MM-dd-yyyy') || "",
                            "ToDate": $filter('date')(pitem.DOSto, 'MM-dd-yyyy') || "",
                            "PlaceOfService": $scope.HCFADetailsInfo.PlaceOfServiceName || "",
                            "PlaceOfServiceId": $scope.HCFADetailsInfo.PlaceOfServiceId || "",
                            "EMG": "NO",
                            "CPTorHCPCS": pitem.ServiceCode,
                            "Modifier": ModifierString || "",
                            "Modifier1": pitem.Modifier1 || "",
                            "Modifier2": pitem.Modifier2 || "",
                            "Modifier3": pitem.Modifier3 || "",
                            "Modifier4": pitem.Modifier4 || "",
                            "DiagnosisPointer": pitem.DiagnosisPointers || "",
                            "Charges": pitem.TotalChargeAmount || 0,
                            "IntegerNumber": $scope.IntegerNumber || 0,
                            "DecimalNumber": $scope.DecimalNumber || 0,
                            "Charges1": $scope.DecimalNumber,
                            "DaysOrUnits": pitem.Quantity || "",
                            "EPSDTFamilyPlan": "",
                            "IdQual": "",
                            "RenderingProviderId": resp.data.RenderingProviderId || "",
                            "RenderingProviderNPI": resp.data.RenderingProviderNPI || "",
                            "BillingProviderNPI": resp.data.BillingProviderNPI || "",
                            "PayorPlanCode": $scope.HCFADetailsInfo.InsuranceDetails.PayorPlanCode || "",
                            "PayorTypeId": $scope.HCFADetailsInfo.InsuranceDetails.PayorTypeId || 0,
                            "UserTaxonomyCode": $scope.HCFADetailsInfo.RenderingProviderTaxonomyCode || "",
                            "DrugProductID": "",
                            "NationalDrugCode": pitem.DrugNDCID || "",
                            "DrugUnit": pitem.MedicineStrength || "",
                            "DrugUom": pitem.UnitName || "",
                            "DrugLinkSeqNumber": "",
                            "DrugPharmacyPresNumber": "",
                        };
                        $scope.HCFADetailsInfo.ProcedureList.push(array);
                    });
                }

                $scope.HCFADetailsInfo.TotalCharges = resp.data.TotalClaimAmount;
                $scope.HCFADetailsInfo.TotalInsurancePayment = resp.data.TotalInsurancePayment;
                $scope.HCFADetailsInfo.TotalInsandPatPaidAmt = resp.data.TotalInsurancePayment + resp.data.TotalPatientPayment || 0;
                $scope.HCFADetailsInfo.TypeOfPayor = resp.data.PayorName || "";

                if ($scope.isIojOrgEnable) {
                    $scope.HCFADetailsInfo.FacilityName = resp.data.ServiceFacilityName || "";
                    $scope.HCFADetailsInfo.FacilityStateName = resp.data.ServiceFacilityStateName || "";
                    $scope.HCFADetailsInfo.FacilityStateCode = resp.data.ServiceFacilityStateCode || "";
                    $scope.HCFADetailsInfo.FacilityCityName = resp.data.ServiceFacilityCityName || "";
                    $scope.HCFADetailsInfo.FacilityZipCode = resp.data.ServiceFacilityZipCode || "";
                    $scope.HCFADetailsInfo.FacilityNPI = resp.data.ServiceFacilityNPI || "";
                    $scope.HCFADetailsInfo.FacilityAddress1 = resp.data.ServiceFacilityAddress1 || "";
                    $scope.HCFADetailsInfo.FacilityAddress2 = resp.data.ServiceFacilityAddress2 || "";
                    $scope.HCFADetailsInfo.RenderingProviderName = "";
                } else {
                    $scope.HCFADetailsInfo.FacilityName = resp.data.FacilityName || "";
                    $scope.HCFADetailsInfo.FacilityStateName = resp.data.FacilityStateName || "";
                    $scope.HCFADetailsInfo.FacilityStateCode = resp.data.FacilityStateCode || "";
                    $scope.HCFADetailsInfo.FacilityCityName = resp.data.FacilityCityName || "";
                    $scope.HCFADetailsInfo.FacilityZipCode = resp.data.FacilityZipCode || "";
                    $scope.HCFADetailsInfo.FacilityNPI = resp.data.FacilityNPI || "";
                    $scope.HCFADetailsInfo.FacilityAddress1 = resp.data.FacilityAddress1 || "";
                    $scope.HCFADetailsInfo.FacilityAddress2 = resp.data.FacilityAddress2 || "";
                    $scope.HCFADetailsInfo.RenderingProviderName = resp.data.RenderingProviderName || "";
                }



                var filteredList = $filter("filter")($scope.OrganizationBillingProviderList, { "OrganizationBillingProviderId": resp.data.BillingProviderId }, true) || [];
                if (filteredList.length > 0) {


                    $scope.HCFADetailsInfo.PostalAddress1 = filteredList[0].Box33Address1;
                    $scope.HCFADetailsInfo.PostalAddress2 = filteredList[0].Box33Address2;
                    $scope.HCFADetailsInfo.PostalZipCode = filteredList[0].Box33ZipCode || "";
                    $scope.HCFADetailsInfo.PostalCityName = filteredList[0].Box33CityName || "";
                    $scope.HCFADetailsInfo.PostalStateName = filteredList[0].Box33StateName || "";
                    $scope.HCFADetailsInfo.PostalStateCode = filteredList[0].Box33StateCode || "";
                    $scope.HCFADetailsInfo.BillingProviderSSN = filteredList[0].BillingProviderSSN;
                    $scope.HCFADetailsInfo.BillingProviderNPI = filteredList[0].NPI;
                    $scope.HCFADetailsInfo.BillingProviderName = filteredList[0].BillingProviderName;
                    $scope.HCFADetailsInfo.Box33GroupName = filteredList[0].Box33GroupName || "";
                    $scope.HCFADetailsInfo.BillingProviderTaxId = filteredList[0].BillingProviderTaxId || '';
                    $scope.HCFADetailsInfo.Box33GroupNPI = filteredList[0].Box33GroupNPI || '';
                    $scope.HCFADetailsInfo.BillingProviderTaxonomyId = filteredList[0].TaxonomyId || '';
                    if (filteredList[0].ContactMobileNumber != '') {
                        var obj = eHnoteUserDataService.UsMobileFormatChange(filteredList[0].ContactMobileNumber);
                        $scope.HCFADetailsInfo.BillingProviderContactNumber = obj.UsFormatMobileNumber;
                    }
                    $scope.HCFADetailsInfo.FeedralTaxIDNo = filteredList[0].TaxId || "";
                    //if ($scope.HCFADetailsInfo.FeedralTaxIDNo != "") {
                    //    $scope.HCFADetailsInfo.SSN = "yes";
                    //}

                    $scope.HCFADetailsInfo.EIN = "yes";

                }

                //$scope.HCFADetailsInfo.PostalAddress1 = resp.data.PostalAddress1;
                //$scope.HCFADetailsInfo.PostalAddress2 = resp.data.PostalAddress2;
                //$scope.HCFADetailsInfo.PostalZipCode = resp.data.PostalZipCode || "";
                //$scope.HCFADetailsInfo.PostalCityName = resp.data.PostalCityName || "";
                //$scope.HCFADetailsInfo.PostalStateName = resp.data.PostalStateName || "";
                //$scope.HCFADetailsInfo.PostalStateCode = resp.data.PostalStateCode || "";
                //$scope.HCFADetailsInfo.BillingProviderSSN = resp.data.BillingProviderSSN;
                //$scope.HCFADetailsInfo.BillingProviderNPI = resp.data.BillingProviderNPI;
                //$scope.HCFADetailsInfo.BillingProviderName = resp.data.BillingProviderName;
                //$scope.HCFADetailsInfo.Box33GroupName = resp.data.BillingProviderName || "";
                //$scope.HCFADetailsInfo.BillingProviderTaxId = resp.data.BillingProviderTaxId || '';
                //$scope.HCFADetailsInfo.Box33GroupNPI = resp.data.BillingProviderNPI || '';
                //$scope.HCFADetailsInfo.BillingProviderTaxonomyId = resp.data.BillingProviderTaxonomyId || '';

                //$scope.HCFADetailsInfo.BillingProviderContactNumber = resp.data.BillingProviderContactNumber || '';


                $scope.HCFADetailsInfo.ReferringProvider = resp.data.ReferringProvider || '';
                $scope.HCFADetailsInfo.ReferringProviderNPI = resp.data.ReferringProviderNPI || '';
                $scope.HCFADetailsInfo.ReferralNumber = resp.data.ReferralNumber || '';
                $scope.HCFADetailsInfo.referringProviderId = resp.data.ReferringProviderId || null;
                $scope.HCFADetailsInfo.ReferringProviderId = resp.data.ReferringProviderId || null;
                $scope.HCFADetailsInfo.OrderingProviderId = resp.data.OrderingProviderId || null;
                $scope.HCFADetailsInfo.orderingProviderId = resp.data.OrderingProviderId || null;
                $scope.HCFADetailsInfo.supervisingProviderId = resp.data.supervisingProviderId || null;
                $scope.HCFADetailsInfo.supervisingProviderUserId = resp.data.supervisingProviderUserId || null;
                $scope.HCFADetailsInfo.referringProviderUserId = resp.data.referringProviderUserId || null;
                $scope.HCFADetailsInfo.orderingProviderUserId = resp.data.orderingProviderUserId || null;
                $scope.HCFADetailsInfo.RenderingProviderId = resp.data.RenderingProviderId || null;
                $scope.HCFADetailsInfo.OrderingProviderName = "";
                $scope.HCFADetailsInfo.supervisingProviderName = "";

                //if ($scope.HCFADetailsInfo.RenderingProviderId != null) {
                //    let doctorobj = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.HCFADetailsInfo.RenderingProviderId }, true)[0] || {};
                //    $scope.HCFADetailsInfo.TaxonomyCode = angular.copy(doctorobj.TaxonomyCode) || '';
                //}
                if ($scope.HCFADetailsInfo.supervisingProviderId != null) {
                    let doctorobj = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.HCFADetailsInfo.supervisingProviderId }, true)[0] || {};
                    $scope.HCFADetailsInfo.TaxonomyCode = angular.copy(doctorobj.TaxonomyCode) || '';
                }
                else if ($scope.HCFADetailsInfo.OrderingProviderId != null) {
                    let doctorobj = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.HCFADetailsInfo.OrderingProviderId }, true)[0] || {};
                    $scope.HCFADetailsInfo.TaxonomyCode = angular.copy(doctorobj.TaxonomyCode) || '';
                }
                else if ($scope.HCFADetailsInfo.referringProviderId != null) {
                    let doctorobj = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.HCFADetailsInfo.referringProviderId }, true)[0] || {};
                    $scope.HCFADetailsInfo.TaxonomyCode = angular.copy(resp.data.ReferringTaxonomyCode) || '';
                } else {

                }

                if ($scope.HCFADetailsInfo.OrderingProviderId != null) {
                    let doctorobj = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.HCFADetailsInfo.OrderingProviderId }, true)[0] || {};
                    $scope.HCFADetailsInfo.OrderingProviderName = angular.copy(doctorobj.FullName + ' ' + doctorobj.SuffixName);
                }
                if ($scope.HCFADetailsInfo.supervisingProviderId != null) {
                    let doctorobj = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.HCFADetailsInfo.supervisingProviderId }, true)[0] || {};
                    $scope.HCFADetailsInfo.supervisingProviderName = angular.copy(doctorobj.FullName + ' ' + doctorobj.SuffixName);
                }
                if (type == 'WithLine') {
                    /*                        eHnotePrintService.generateHCFAPrintUS($scope.HCFADetailsInfo);*/
                    //eHnotePrintService.generateHCFAPrintUS($scope.HCFADetailsInfo, "withline");
                    $scope.CMSPrintPopUp('WithLine');

                } else {
                    /*eHnotePrintService.generateWithoutLineHCFAPrintUS($scope.HCFADetailsInfo);*/
                    //eHnotePrintService.generateHCFAPrintUS($scope.HCFADetailsInfo, "withoutline");
                    $scope.CMSPrintPopUp('withoutline');

                }

            } else {
                alertify.error(resp.data.Message);
            }
        }, function (error) {

        });
    }


    $scope.GetPatientParticularClaimDetailsForUBform = function (item, type) {

        item.PatientClaimLogId = item.PatientClaimLogId || 0;
        var obj = {
            "PatientClaimLogId": item.PatientClaimLogId || 0,
            "PatientId": item.PatientId || 0,
        }

        eHnoteInsuranceService.GetPatientParticularClaimTransactionLogDetails(obj).then(function (resp) {

            if (resp.data.status == "Success") {
                var currentdate = $filter('date')(new Date(), 'MM-dd-yyyy');
                $scope.UBDetailsInfo = eHnoteCacheStorageService.GetUBStorageStructure();
                $scope.UBDetailsInfo.Patient = angular.copy(resp.data);
                $scope.UBDetailsInfo.Patient.FirstName = resp.data.FirstName;
                $scope.UBDetailsInfo.Patient.LastName = resp.data.Lastname;
                $scope.UBDetailsInfo.Patient.DOB = resp.data.DOB || "";
                $scope.UBDetailsInfo.Patient.Gender = resp.data.Gender;
                $scope.UBDetailsInfo.Patient.PatientID = resp.data.PatientId;
                $scope.UBDetailsInfo.MedicalRecordNumber = resp.data.PatientDisplayId;
                $scope.UBDetailsInfo.PreAuthorizationNumber = resp.data.PrimaryInsuranceAuthorizationNumber && resp.data.PrimaryInsuranceAuthorizationNumber.trim() !== ''
                    ? resp.data.PrimaryInsuranceAuthorizationNumber
                    : (resp.data.SecondaryInsuranceAuthorizationNumber && resp.data.SecondaryInsuranceAuthorizationNumber.trim() !== ''
                        ? resp.data.SecondaryInsuranceAuthorizationNumber
                        : '');


                if (resp.data.Patient.length > 0) {
                    var patientresp = resp.data.Patient[0];
                    $scope.UBDetailsInfo.Patient.PatientID = resp.data.PatientId;
                    $scope.UBDetailsInfo.MedicalRecordNumber = resp.data.PatientDisplayId;
                    $scope.UBDetailsInfo.Patient.Address1 = patientresp.PostalAddress.AddressLine1 || "";
                    $scope.UBDetailsInfo.Patient.Address2 = patientresp.PostalAddress.AddressLine2 || "";
                    $scope.UBDetailsInfo.Patient.CityName = patientresp.PostalAddress.CityName;
                    $scope.UBDetailsInfo.Patient.StateName = patientresp.PostalAddress.StateName;
                    $scope.UBDetailsInfo.Patient.StateCode = patientresp.PostalAddress.StateCode;
                    $scope.UBDetailsInfo.Patient.CountryName = patientresp.PostalAddress.CountryName;
                    $scope.UBDetailsInfo.Patient.ZipCode = patientresp.PostalAddress.ZipCode;
                    $scope.UBDetailsInfo.Patient.MiddleName = patientresp.MiddleName || '';
                }

                $scope.UBDetailsInfo.BillingProvider = resp.data.BillingProviderNPI;
                $scope.UBDetailsInfo.BillingProviderobj.ProviderName = resp.data.BillingProviderName;
                $scope.UBDetailsInfo.FederalTaxNumber = resp.data.BillingProviderTaxId;
                $scope.UBDetailsInfo.BillingProviderobj.Address1 = resp.data.PostalAddress1 || "";
                $scope.UBDetailsInfo.BillingProviderobj.Address2 = resp.data.PostalAddress2 || "";

                // $scope.UBDetailsInfo.BillingProviderobj.PhysicalAddress1 = resp.data.PhysicalAddress1 || "";
                // $scope.UBDetailsInfo.BillingProviderobj.PhysicalAddress2 = resp.data.PhysicalAddress2 || "";
                // $scope.UBDetailsInfo.BillingProviderobj.PostalAddress1 = resp.data.PostalAddress1 || "";
                // $scope.UBDetailsInfo.BillingProviderobj.PostalAddress2 = resp.data.PostalAddress2 || "";

                // $scope.UBDetailsInfo.BillingProviderobj.PhysicalCityName = resp.data.PhysicalCityName;
                // $scope.UBDetailsInfo.BillingProviderobj.PhysicalStateName = resp.data.PhysicalStateName;
                // $scope.UBDetailsInfo.BillingProviderobj.PhysicalStateCode = resp.data.PhysicalStateCode;
                // $scope.UBDetailsInfo.BillingProviderobj.PhysicalZipCode = resp.data.PhysicalZipCode;
                //// $scope.UBDetailsInfo.BillingProviderobj.ContactMobileNumber = resp.data.BillingProviderContactNumber || "";

                // if (resp.data.BillingProviderContactNumber != '') {
                //     var obj = eHnoteUserDataService.UsMobileFormatChange(resp.data.BillingProviderContactNumber);
                //     $scope.UBDetailsInfo.BillingProviderobj.ContactMobileNumber = obj.UsFormatMobileNumber;
                // }

                var filteredList = $filter("filter")($scope.OrganizationBillingProviderList, { "OrganizationBillingProviderId": resp.data.BillingProviderId }, true) || [];
                if (filteredList.length > 0) {


                    $scope.UBDetailsInfo.BillingProviderobj.PostalAddress1 = filteredList[0].Box33Address1;
                    $scope.UBDetailsInfo.BillingProviderobj.PostalAddress2 = filteredList[0].Box33Address2;
                    $scope.UBDetailsInfo.BillingProviderobj.PhysicalZipCode = filteredList[0].Box33ZipCode || "";
                    $scope.UBDetailsInfo.BillingProviderobj.PhysicalCityName = filteredList[0].Box33CityName || "";
                    $scope.UBDetailsInfo.BillingProviderobj.PhysicalStateName = filteredList[0].Box33StateName || "";
                    $scope.UBDetailsInfo.BillingProviderobj.PhysicalStateCode = filteredList[0].Box33StateCode || "";
                    //$scope.UBDetailsInfo.BillingProviderobj.ContactMobileNumber = filteredList[0].BillingProviderContactNumber || '';

                }
                //$scope.UBDetailsInfo.BillingProviderobj.DOSfrom = $filter('date')(resp.data.DOSfrom, 'M/d/yyyy') || currentdate;
                //$scope.UBDetailsInfo.BillingProviderobj.DOSto = $filter('date')(resp.data.DOSto, 'M/d/yyyy') || currentdate;
                $scope.UBDetailsInfo.BillingProviderobj.AdmissionDate = $filter('date')(resp.data.AdmissionDate, 'M/d/yyyy') || currentdate;


                $scope.UBDetailsInfo.BillingProviderobj.City = resp.data.PostalCityName;
                $scope.UBDetailsInfo.BillingProviderobj.State = resp.data.PostalStateName;
                $scope.UBDetailsInfo.BillingProviderobj.StateCode = resp.data.PostalStateCode;
                $scope.UBDetailsInfo.BillingProviderobj.ZipCode = resp.data.PostalZipCode;
                $scope.UBDetailsInfo.CodeFieldObj[0].billingprovidertaxonomy1 = resp.data.BillingProviderTaxonomyId;
                $scope.UBDetailsInfo.TypeOfBill = resp.data.BillPaymentType;

                if ($scope.isIojOrgEnable) {
                    $scope.UBDetailsInfo.ServiceLocationInformation.ProviderName = resp.data.ServiceFacilityName || "";
                    $scope.UBDetailsInfo.ServiceLocationInformation.Address1 = resp.data.ServiceFacilityAddress1 || "";
                    $scope.UBDetailsInfo.ServiceLocationInformation.Address2 = resp.data.ServiceFacilityAddress2 || "";
                    $scope.UBDetailsInfo.ServiceLocationInformation.City = resp.data.ServiceFacilityCityName || "";
                    $scope.UBDetailsInfo.ServiceLocationInformation.State = resp.data.ServiceFacilityStateName || "";
                    $scope.UBDetailsInfo.ServiceLocationInformation.StateCode = resp.data.ServiceFacilityStateCode || "";
                    $scope.UBDetailsInfo.ServiceLocationInformation.ZipCode = resp.data.ServiceFacilityZipCode || "";
                } else {
                    $scope.UBDetailsInfo.ServiceLocationInformation.ProviderName = resp.data.FacilityName || "";
                    $scope.UBDetailsInfo.ServiceLocationInformation.Address1 = resp.data.FacilityAddress1 || "";
                    $scope.UBDetailsInfo.ServiceLocationInformation.Address2 = resp.data.FacilityAddress2 || "";
                    $scope.UBDetailsInfo.ServiceLocationInformation.City = resp.data.FacilityCityName || "";
                    $scope.UBDetailsInfo.ServiceLocationInformation.State = resp.data.FacilityStateName || "";
                    $scope.UBDetailsInfo.ServiceLocationInformation.StateCode = resp.data.FacilityStateCode || "";
                    $scope.UBDetailsInfo.ServiceLocationInformation.ZipCode = resp.data.FacilityZipCode || "";
                }

                angular.forEach($scope.UBDetailsInfo.InsuranceDetails, function (mitem) {
                    if (resp.data.AppointmentInsuranceDetails.length > 0) {
                        angular.forEach(resp.data.AppointmentInsuranceDetails, function (aitem) {
                            if (mitem.IdentifierId === aitem.IdentifierId) {
                                mitem.AssignmentofBenefits = aitem.AssignBenifits || 'No';
                                mitem.DocumentControlNumber = aitem.PatientInsuranceControlNumber || "";
                                mitem.InsuranceGroupNumber = aitem.GroupId || "";
                                mitem.InsuredsGroupName = aitem.GroupName || "";
                                mitem.InsuredsName = aitem.InsuredPersonLastName + " " + aitem.InsuredPersonFirstName + " " + aitem.InsuredPersonMiddleName || "";
                                mitem.InsuredsUniqueIdentifier = aitem.PolicyId || "";
                                //  mitem.OrganizationPayorName = aitem.PayorName || "";
                                mitem.OrganizationPayorName = aitem.OrganizationPayorName || "";
                                mitem.PayerClaimControlNumber = aitem.PayerClaimControlNumber || "";
                                mitem.OrganizationPlanId = aitem.PlanId || "";
                                mitem.OrganizationPlanName = aitem.PlanName || "";
                                /* mitem.PriorPayments = resp.data.TotalBalance || "";*/
                                mitem.OtherBillingProviderIdentifier = "";
                                mitem.PatientRelationship = aitem.RelationCode || "";
                                mitem.PayorId = aitem.GlobalPayorId || "";
                                mitem.PayorName = aitem.PayorName || "";
                                mitem.PayorAddress1 = aitem.PayorAddress1 || "";
                                mitem.PayorAddress2 = aitem.PayorAddress2 || "";
                                mitem.ReleaseInfo = "";
                                mitem.TreatmentAuthorizationCodes = "";
                                mitem.EmployerName = "";
                                mitem.EstimatedAmountDue = aitem.DoctorName;
                                //$scope.UBDetailsInfo.Appointment.AppointmentTime = aitem.AppointmentTime;
                                $scope.UBDetailsInfo.Appointment.AppointmentTime = aitem.AppointmentTime
                                    ? new Date(new Date().toDateString() + ' ' + aitem.AppointmentTime)
                                    : null;
                            }
                        })
                    }
                });


                if (resp.data.CurrentResponsibilityId == 2) {
                    $scope.UBDetailsInfo.PayorName = resp.data.AppointmentInsuranceDetails[0].PayorName || "";
                    $scope.UBDetailsInfo.PayorAddress1 = resp.data.AppointmentInsuranceDetails[0].PayorAddress1 || "";
                    $scope.UBDetailsInfo.PayorAddress2 = resp.data.AppointmentInsuranceDetails[0].PayorAddress2 || "";
                    $scope.UBDetailsInfo.PayorCityName = resp.data.AppointmentInsuranceDetails[0].PayorCityName || "";
                    $scope.UBDetailsInfo.PayorStateName = resp.data.AppointmentInsuranceDetails[0].PayorStateName || "";
                    $scope.UBDetailsInfo.PayorStateCode = resp.data.AppointmentInsuranceDetails[0].PayorStateCode || "";
                    $scope.UBDetailsInfo.PayorZipCode = resp.data.AppointmentInsuranceDetails[0].PayorZipCode || "";

                    $scope.UBDetailsInfo.InsuranceDetails.InsuredsName = $scope.UBDetailsInfo.InsuranceDetails[0].InsuredsName || "";
                    $scope.UBDetailsInfo.IInsuredsName = $scope.UBDetailsInfo.InsuranceDetails.InsuredsName || "";
                    $scope.UBDetailsInfo.IInsuredsName = $scope.UBDetailsInfo.InsuranceDetails[0].InsuredsName || "";
                    $scope.UBDetailsInfo.InsuranceDetails.PatientRelationship = $scope.UBDetailsInfo.InsuranceDetails[0].PatientRelationship || "";
                    $scope.UBDetailsInfo.IPatientRelationship = $scope.UBDetailsInfo.InsuranceDetails[0].PatientRelationship || "";

                    $scope.UBDetailsInfo.InsuranceDetails.InsuredsUniqueIdentifier = $scope.UBDetailsInfo.InsuranceDetails[0].InsuredsUniqueIdentifier || "";
                    $scope.UBDetailsInfo.IInsuredsUniqueIdentifier = $scope.UBDetailsInfo.InsuranceDetails[0].InsuredsUniqueIdentifier || "";
                    $scope.UBDetailsInfo.InsuredsUniqueIdentifier = $scope.UBDetailsInfo.InsuranceDetails[0].InsuredsUniqueIdentifier || "";
                    $scope.UBDetailsInfo.InsuranceDetails.InsuredsGroupName = $scope.UBDetailsInfo.InsuranceDetails[0].InsuredsGroupName || "";
                    $scope.UBDetailsInfo.IInsuredsGroupName = $scope.UBDetailsInfo.InsuranceDetails[0].InsuredsGroupName || "";

                    $scope.UBDetailsInfo.InsuranceDetails.InsuranceGroupNumber = $scope.UBDetailsInfo.InsuranceDetails[0].InsuranceGroupNumber || "";
                    $scope.UBDetailsInfo.IInsuranceGroupNumber = $scope.UBDetailsInfo.InsuranceDetails[0].InsuranceGroupNumber || "";

                    $scope.UBDetailsInfo.InsuranceDetails.AssignmentofBenefits = $scope.UBDetailsInfo.InsuranceDetails[0].AssignmentofBenefits || "";
                    $scope.UBDetailsInfo.InsuranceDetails.DocumentControlNumber = $scope.UBDetailsInfo.InsuranceDetails[0].DocumentControlNumber || "";
                    $scope.UBDetailsInfo.InsuranceDetails.OrganizationPayorName = $scope.UBDetailsInfo.InsuranceDetails[0].OrganizationPayorName || "";
                    $scope.UBDetailsInfo.IOrganizationPayorName = $scope.UBDetailsInfo.InsuranceDetails[0].OrganizationPayorName || "";

                    $scope.UBDetailsInfo.InsuranceDetails.OrganizationPlanId = $scope.UBDetailsInfo.InsuranceDetails[0].OrganizationPlanId || "";
                    $scope.UBDetailsInfo.InsuranceDetails.OrganizationPlanName = $scope.UBDetailsInfo.InsuranceDetails[0].OrganizationPlanName || "";
                    $scope.UBDetailsInfo.InsuranceDetails.PatientRelationship = $scope.UBDetailsInfo.InsuranceDetails[0].PatientRelationship || "";
                    $scope.UBDetailsInfo.InsuranceDetails.PayorId = $scope.UBDetailsInfo.InsuranceDetails[0].PayorId || "";
                    $scope.UBDetailsInfo.IPayorId = $scope.UBDetailsInfo.InsuranceDetails[0].PayorId || "";

                    $scope.UBDetailsInfo.InsuranceDetails.EstimatedAmountDue = $scope.UBDetailsInfo.InsuranceDetails[0].EstimatedAmountDue || "";
                    $scope.UBDetailsInfo.InsuranceDetails.TreatmentAuthorizationCodes = $scope.UBDetailsInfo.InsuranceDetails[0].TreatmentAuthorizationCodes || "";
                    $scope.UBDetailsInfo.InsuranceDetails.EmployerName = $scope.UBDetailsInfo.InsuranceDetails[0].EmployerName || "";
                    $scope.UBDetailsInfo.IEmployerName = $scope.UBDetailsInfo.InsuranceDetails[0].EmployerName || "";

                    $scope.UBDetailsInfo.InsuranceDetails.PayerClaimNumber = $scope.UBDetailsInfo.InsuranceDetails[0].PayerClaimNumber || "";
                    $scope.UBDetailsInfo.IPayerClaimNumber = $scope.UBDetailsInfo.InsuranceDetails[0].PayerClaimNumber || "";


                    $scope.UBDetailsInfo.Box4Value2 = resp.data.AppointmentInsuranceDetails[0].Box4Value2 || "";
                    $scope.UBDetailsInfo.Box4ValueId2 = resp.data.AppointmentInsuranceDetails[0].Box4ValueId2 || "";
                    $scope.UBDetailsInfo.Box4Value3 = resp.data.AppointmentInsuranceDetails[0].Box4Value3 || "";
                    $scope.UBDetailsInfo.Box4ValueId3 = resp.data.AppointmentInsuranceDetails[0].Box4ValueId3 || "";
                    $scope.UBDetailsInfo.Box4Value4 = resp.data.AppointmentInsuranceDetails[0].Box4Value4 || "";
                    $scope.UBDetailsInfo.Box4ValueId4 = resp.data.AppointmentInsuranceDetails[0].Box4ValueId4 || "";

                    $scope.UBDetailsInfo.Box14ValueId = resp.data.AppointmentInsuranceDetails[0].Box14ValueId || "";
                    $scope.UBDetailsInfo.Box14Value = resp.data.AppointmentInsuranceDetails[0].Box14Value || "";
                    $scope.UBDetailsInfo.Box14ValueCode = resp.data.AppointmentInsuranceDetails[0].Box14ValueCode || "";
                    $scope.UBDetailsInfo.Box15ValueId = resp.data.AppointmentInsuranceDetails[0].Box15ValueId || "";
                    $scope.UBDetailsInfo.Box15Value = resp.data.AppointmentInsuranceDetails[0].Box15Value || "";
                    $scope.UBDetailsInfo.Box15ValueCode = resp.data.AppointmentInsuranceDetails[0].Box15ValueCode || "";

                    $scope.UBDetailsInfo.Box79Type = resp.data.AppointmentInsuranceDetails[0].Box79Type || "";
                    $scope.UBDetailsInfo.Box79TypeId = resp.data.AppointmentInsuranceDetails[0].Box79TypeId || "";
                    $scope.UBDetailsInfo.Box79Value = resp.data.AppointmentInsuranceDetails[0].Box79Value || "";
                    $scope.UBDetailsInfo.Box79ValueId = resp.data.AppointmentInsuranceDetails[0].Box79ValueId || "";
                    $scope.UBDetailsInfo.Box79ValueNPI = resp.data.AppointmentInsuranceDetails[0].Box79ValueNPI || "";
                    $scope.UBDetailsInfo.IsBox80Checked = resp.data.AppointmentInsuranceDetails[0].IsBox80Checked || "";

                    if ($scope.UBDetailsInfo.Box79TypeId == 3) {
                        $scope.UBDetailsInfo.FacilityName = resp.data.FacilityName || '';
                        $scope.UBDetailsInfo.FacilityNPI = resp.data.FacilityNPI || '';
                    }

                    $scope.UBDetailsInfo.TotalPatientPayment = resp.data.TotalPatientPayment || 0;
                    $scope.UBDetailsInfo.TotalPatientBalance = resp.data.TotalPatientBalance || 0;

                    var UBtotalpatbalInteger = Math.floor($scope.UBDetailsInfo.TotalPatientPayment);
                    var UBtotalpatbalDecimal = Math.round(($scope.UBDetailsInfo.TotalPatientPayment - UBtotalpatbalInteger) * 100);

                    $scope.UBDetailsInfo.UBtotalpatbalInteger = UBtotalpatbalInteger;
                    $scope.UBDetailsInfo.UBtotalpatbalDecimal = UBtotalpatbalDecimal;
                    if ($scope.UBDetailsInfo.UBtotalpatbalDecimal == 0) {
                        $scope.UBDetailsInfo.UBtotalpatbalDecimal = '00';
                    }


                    if ($scope.UBDetailsInfo.Box79Type == "Billing Provider") {
                        var filterProviderList = $filter("filter")($scope.BillingProvidersList, { "OrganizationBillingProviderId": $scope.UBDetailsInfo.Box79ValueId })[0] || [];
                        $scope.UBDetailsInfo.Box79FirstName = filterProviderList.BillingProviderName;
                        $scope.UBDetailsInfo.Box79LastName = '';
                    }
                    else if ($scope.UBDetailsInfo.Box79Type == "Rendering Provider") {

                        var filterDoctorList = $filter("filter")($scope.filteredBranchDoctorsList, { "DoctorID": $scope.UBDetailsInfo.Box79ValueId })[0] || [];
                        $scope.UBDetailsInfo.Box79FirstName = filterDoctorList.FirstName;
                        $scope.UBDetailsInfo.Box79LastName = filterDoctorList.LastName;
                    }
                    else if ($scope.UBDetailsInfo.Box79Type == "Facility") {
                        var filterOrgFacilityList = $filter("filter")($scope.OrganizationFacilityList, { "OrganizationFacilityId": $scope.UBDetailsInfo.Box79ValueId })[0] || [];
                        $scope.UBDetailsInfo.Box79FirstName = filterOrgFacilityList.FacilityName;
                        $scope.UBDetailsInfo.Box79LastName = '';
                    } else {

                    }

                    $scope.UBDetailsInfo.Box80Value = resp.data.AppointmentInsuranceDetails[0].Box80Value || "";


                }
                else if (resp.data.CurrentResponsibilityId == 3) {
                    $scope.UBDetailsInfo.PayorName = resp.data.AppointmentInsuranceDetails[0].PayorName || "";
                    $scope.UBDetailsInfo.PayorAddress1 = resp.data.AppointmentInsuranceDetails[0].PayorAddress1 || "";
                    $scope.UBDetailsInfo.PayorAddress2 = resp.data.AppointmentInsuranceDetails[0].PayorAddress2 || "";
                    $scope.UBDetailsInfo.PayorCityName = resp.data.AppointmentInsuranceDetails[0].PayorCityName || "";
                    $scope.UBDetailsInfo.PayorStateName = resp.data.AppointmentInsuranceDetails[0].PayorStateName || "";
                    $scope.UBDetailsInfo.PayorZipCode = resp.data.AppointmentInsuranceDetails[0].PayorZipCode || "";


                    $scope.UBDetailsInfo.InsuranceDetails.InsuredsName = $scope.UBDetailsInfo.InsuranceDetails[1].InsuredsName || "";
                    $scope.UBDetailsInfo.IInsuredsName = $scope.UBDetailsInfo.InsuranceDetails[1].InsuredsName || "";

                    $scope.UBDetailsInfo.InsuranceDetails.PatientRelationship = $scope.UBDetailsInfo.InsuranceDetails[1].PatientRelationship || "";
                    $scope.UBDetailsInfo.IPatientRelationship = $scope.UBDetailsInfo.InsuranceDetails[1].PatientRelationship || "";

                    $scope.UBDetailsInfo.InsuranceDetails.InsuredsUniqueIdentifier = $scope.UBDetailsInfo.InsuranceDetails[1].InsuredsUniqueIdentifier || "";
                    $scope.UBDetailsInfo.IInsuredsUniqueIdentifier = $scope.UBDetailsInfo.InsuranceDetails[1].InsuredsUniqueIdentifier || "";
                    $scope.UBDetailsInfo.InsuranceDetails.InsuredsGroupName = $scope.UBDetailsInfo.InsuranceDetails[1].InsuredsGroupName || "";
                    $scope.UBDetailsInfo.IInsuredsGroupName = $scope.UBDetailsInfo.InsuranceDetails[1].InsuredsGroupName || "";

                    $scope.UBDetailsInfo.InsuranceDetails.InsuranceGroupNumber = $scope.UBDetailsInfo.InsuranceDetails[1].InsuranceGroupNumber || "";
                    $scope.UBDetailsInfo.IInsuranceGroupNumber = $scope.UBDetailsInfo.InsuranceDetails[1].InsuranceGroupNumber || "";

                    $scope.UBDetailsInfo.InsuranceDetails.AssignmentofBenefits = $scope.UBDetailsInfo.InsuranceDetails[1].AssignmentofBenefits || "";
                    $scope.UBDetailsInfo.InsuranceDetails.DocumentControlNumber = $scope.UBDetailsInfo.InsuranceDetails[1].DocumentControlNumber || "";
                    $scope.UBDetailsInfo.InsuranceDetails.OrganizationPayorName = $scope.UBDetailsInfo.InsuranceDetails[1].OrganizationPayorName || "";
                    $scope.UBDetailsInfo.IOrganizationPayorName = $scope.UBDetailsInfo.InsuranceDetails[1].OrganizationPayorName || "";

                    $scope.UBDetailsInfo.InsuranceDetails.OrganizationPlanId = $scope.UBDetailsInfo.InsuranceDetails[1].OrganizationPlanId || "";
                    $scope.UBDetailsInfo.InsuranceDetails.OrganizationPlanName = $scope.UBDetailsInfo.InsuranceDetails[1].OrganizationPlanName || "";
                    $scope.UBDetailsInfo.InsuranceDetails.PatientRelationship = $scope.UBDetailsInfo.InsuranceDetails[1].PatientRelationship || "";
                    $scope.UBDetailsInfo.IPatientRelationship = $scope.UBDetailsInfo.InsuranceDetails[1].PatientRelationship || "";
                    $scope.UBDetailsInfo.InsuranceDetails.PayorId = $scope.UBDetailsInfo.InsuranceDetails[1].PayorId || "";
                    $scope.UBDetailsInfo.IPayorId = $scope.UBDetailsInfo.InsuranceDetails[1].PayorId || "";

                    $scope.UBDetailsInfo.InsuranceDetails.EstimatedAmountDue = $scope.UBDetailsInfo.InsuranceDetails[1].EstimatedAmountDue || "";
                    $scope.UBDetailsInfo.InsuranceDetails.TreatmentAuthorizationCodes = $scope.UBDetailsInfo.InsuranceDetails[1].TreatmentAuthorizationCodes || "";
                    $scope.UBDetailsInfo.InsuranceDetails.EmployerName = $scope.UBDetailsInfo.InsuranceDetails[1].EmployerName || "";
                    $scope.UBDetailsInfo.IEmployerName = $scope.UBDetailsInfo.InsuranceDetails[1].EmployerName || "";

                    $scope.UBDetailsInfo.InsuranceDetails.PayerClaimNumber = $scope.UBDetailsInfo.InsuranceDetails[1].PayerClaimNumber || "";
                    $scope.UBDetailsInfo.IPayerClaimNumber = $scope.UBDetailsInfo.InsuranceDetails[1].PayerClaimNumber || "";



                    $scope.UBDetailsInfo.Box4Value2 = resp.data.AppointmentInsuranceDetails[0].Box4Value2 || "";
                    $scope.UBDetailsInfo.Box4ValueId2 = resp.data.AppointmentInsuranceDetails[0].Box4ValueId2 || "";
                    $scope.UBDetailsInfo.Box4Value3 = resp.data.AppointmentInsuranceDetails[0].Box4Value3 || "";
                    $scope.UBDetailsInfo.Box4ValueId3 = resp.data.AppointmentInsuranceDetails[0].Box4ValueId3 || "";
                    $scope.UBDetailsInfo.Box4Value4 = resp.data.AppointmentInsuranceDetails[0].Box4Value4 || "";
                    $scope.UBDetailsInfo.Box4ValueId4 = resp.data.AppointmentInsuranceDetails[0].Box4ValueId4 || "";

                    $scope.UBDetailsInfo.Box14ValueId = resp.data.AppointmentInsuranceDetails[0].Box14ValueId || "";
                    $scope.UBDetailsInfo.Box14Value = resp.data.AppointmentInsuranceDetails[0].Box14Value || "";
                    $scope.UBDetailsInfo.Box14ValueCode = resp.data.AppointmentInsuranceDetails[0].Box14ValueCode || "";
                    $scope.UBDetailsInfo.Box15ValueId = resp.data.AppointmentInsuranceDetails[0].Box15ValueId || "";
                    $scope.UBDetailsInfo.Box15Value = resp.data.AppointmentInsuranceDetails[0].Box15Value || "";
                    $scope.UBDetailsInfo.Box15ValueCode = resp.data.AppointmentInsuranceDetails[0].Box15ValueCode || "";

                    $scope.UBDetailsInfo.Box79Type = resp.data.AppointmentInsuranceDetails[0].Box79Type || "";
                    $scope.UBDetailsInfo.Box79TypeId = resp.data.AppointmentInsuranceDetails[0].Box79TypeId || "";
                    $scope.UBDetailsInfo.Box79Value = resp.data.AppointmentInsuranceDetails[0].Box79Value || "";
                    $scope.UBDetailsInfo.Box79ValueId = resp.data.AppointmentInsuranceDetails[0].Box79ValueId || "";
                    $scope.UBDetailsInfo.Box79ValueNPI = resp.data.AppointmentInsuranceDetails[0].Box79ValueNPI || "";
                    $scope.UBDetailsInfo.IsBox80Checked = resp.data.AppointmentInsuranceDetails[0].IsBox80Checked || "";

                    if ($scope.UBDetailsInfo.Box79TypeId == 3) {
                        $scope.UBDetailsInfo.FacilityName = resp.data.FacilityName || '';
                        $scope.UBDetailsInfo.FacilityNPI = resp.data.FacilityNPI || '';
                    }



                    $scope.UBDetailsInfo.TotalPatientPayment = resp.data.TotalPatientPayment || 0;

                    if ($scope.UBDetailsInfo.Box79Type == "Billing Provider") {
                        var filterProviderList = $filter("filter")($scope.BillingProvidersList, { "OrganizationBillingProviderId": $scope.UBDetailsInfo.Box79TypeId })[0] || [];
                        $scope.UBDetailsInfo.Box79FirstName = filterProviderList.BillingProviderName;
                        $scope.UBDetailsInfo.Box79LastName = '';
                    }
                    else if ($scope.UBDetailsInfo.Box79Type == "Rendering Provider") {

                        var filterDoctorList = $filter("filter")($scope.filteredBranchDoctorsList, { "DoctorID": $scope.UBDetailsInfo.Box79TypeId })[0] || [];
                        $scope.UBDetailsInfo.Box79FirstName = filterDoctorList.FirstName;
                        $scope.UBDetailsInfo.Box79LastName = filterDoctorList.LastName;
                    }
                    else if ($scope.UBDetailsInfo.Box79Type == "Facility") {
                        var filterOrgFacilityList = $filter("filter")($scope.OrganizationFacilityList, { "OrganizationFacilityId": $scope.UBDetailsInfo.Box79TypeId })[0] || [];
                        $scope.UBDetailsInfo.Box79FirstName = filterOrgFacilityList.FacilityName;
                        $scope.UBDetailsInfo.Box79LastName = '';
                    } else {

                    }

                    $scope.UBDetailsInfo.Box80Value = resp.data.AppointmentInsuranceDetails[0].Box80Value || "";


                }
                else {
                    $scope.UBDetailsInfo.PayorName = resp.data.AppointmentInsuranceDetails[0].PayorName || "";
                    $scope.UBDetailsInfo.PayorAddress1 = resp.data.AppointmentInsuranceDetails[0].PayorAddress1 || "";
                    $scope.UBDetailsInfo.PayorAddress2 = resp.data.AppointmentInsuranceDetails[0].PayorAddress2 || "";
                    $scope.UBDetailsInfo.PayorCityName = resp.data.AppointmentInsuranceDetails[0].PayorCityName || "";
                    $scope.UBDetailsInfo.PayorStateName = resp.data.AppointmentInsuranceDetails[0].PayorStateName || "";
                    $scope.UBDetailsInfo.PayorZipCode = resp.data.AppointmentInsuranceDetails[0].PayorZipCode || "";

                    $scope.UBDetailsInfo.InsuranceDetails.InsuredsName = $scope.UBDetailsInfo.InsuranceDetails[2].InsuredsName || "";
                    $scope.UBDetailsInfo.IInsuredsName = $scope.UBDetailsInfo.InsuranceDetails[2].InsuredsName || "";

                    $scope.UBDetailsInfo.InsuranceDetails.PatientRelationship = $scope.UBDetailsInfo.InsuranceDetails[2].PatientRelationship || "";
                    $scope.UBDetailsInfo.IPatientRelationship = $scope.UBDetailsInfo.InsuranceDetails[2].PatientRelationship || "";

                    $scope.UBDetailsInfo.InsuranceDetails.InsuredsUniqueIdentifier = $scope.UBDetailsInfo.InsuranceDetails[2].InsuredsUniqueIdentifier || "";
                    $scope.UBDetailsInfo.IInsuredsUniqueIdentifier = $scope.UBDetailsInfo.InsuranceDetails[2].InsuredsUniqueIdentifier || "";
                    $scope.UBDetailsInfo.InsuredsUniqueIdentifier = $scope.UBDetailsInfo.InsuranceDetails[2].InsuredsUniqueIdentifier || "";
                    $scope.UBDetailsInfo.InsuranceDetails.InsuredsGroupName = $scope.UBDetailsInfo.InsuranceDetails[2].InsuredsGroupName || "";
                    $scope.UBDetailsInfo.IInsuredsGroupName = $scope.UBDetailsInfo.InsuranceDetails[2].InsuredsGroupName || "";
                    $scope.UBDetailsInfo.InsuranceDetails.InsuredsGroupName = $scope.UBDetailsInfo.InsuranceDetails[0].InsuredsGroupName || "";
                    $scope.UBDetailsInfo.InsuranceDetails.InsuranceGroupNumber = $scope.UBDetailsInfo.InsuranceDetails[2].InsuranceGroupNumber || "";
                    $scope.UBDetailsInfo.IInsuranceGroupNumber = $scope.UBDetailsInfo.InsuranceDetails[2].InsuranceGroupNumber || "";

                    $scope.UBDetailsInfo.InsuranceDetails.AssignmentofBenefits = $scope.UBDetailsInfo.InsuranceDetails[2].AssignmentofBenefits || "";
                    $scope.UBDetailsInfo.InsuranceDetails.DocumentControlNumber = $scope.UBDetailsInfo.InsuranceDetails[2].DocumentControlNumber || "";
                    $scope.UBDetailsInfo.InsuranceDetails.OrganizationPayorName = $scope.UBDetailsInfo.InsuranceDetails[2].OrganizationPayorName || "";
                    $scope.UBDetailsInfo.IOrganizationPayorName = $scope.UBDetailsInfo.InsuranceDetails[2].OrganizationPayorName || "";

                    $scope.UBDetailsInfo.InsuranceDetails.OrganizationPlanId = $scope.UBDetailsInfo.InsuranceDetails[2].OrganizationPlanId || "";
                    $scope.UBDetailsInfo.InsuranceDetails.OrganizationPlanName = $scope.UBDetailsInfo.InsuranceDetails[2].OrganizationPlanName || "";
                    $scope.UBDetailsInfo.InsuranceDetails.PatientRelationship = $scope.UBDetailsInfo.InsuranceDetails[2].PatientRelationship || "";
                    $scope.UBDetailsInfo.InsuranceDetails.PayorId = $scope.UBDetailsInfo.InsuranceDetails[2].PayorId || "";
                    $scope.UBDetailsInfo.IPayorId = $scope.UBDetailsInfo.InsuranceDetails[2].PayorId || "";

                    $scope.UBDetailsInfo.InsuranceDetails.EstimatedAmountDue = $scope.UBDetailsInfo.InsuranceDetails[2].EstimatedAmountDue || "";
                    $scope.UBDetailsInfo.InsuranceDetails.TreatmentAuthorizationCodes = $scope.UBDetailsInfo.InsuranceDetails[2].TreatmentAuthorizationCodes || "";
                    $scope.UBDetailsInfo.InsuranceDetails.EmployerName = $scope.UBDetailsInfo.InsuranceDetails[2].EmployerName || "";
                    $scope.UBDetailsInfo.IEmployerName = $scope.UBDetailsInfo.InsuranceDetails[2].EmployerName || "";

                    $scope.UBDetailsInfo.InsuranceDetails.PayerClaimNumber = $scope.UBDetailsInfo.InsuranceDetails[2].PayerClaimNumber || "";
                    $scope.UBDetailsInfo.IPayerClaimNumber = $scope.UBDetailsInfo.InsuranceDetails[2].PayerClaimNumber || "";


                    $scope.UBDetailsInfo.Box4Value2 = resp.data.AppointmentInsuranceDetails[0].Box4Value2 || "";
                    $scope.UBDetailsInfo.Box4ValueId2 = resp.data.AppointmentInsuranceDetails[0].Box4ValueId2 || "";
                    $scope.UBDetailsInfo.Box4Value3 = resp.data.AppointmentInsuranceDetails[0].Box4Value3 || "";
                    $scope.UBDetailsInfo.Box4ValueId3 = resp.data.AppointmentInsuranceDetails[0].Box4ValueId3 || "";
                    $scope.UBDetailsInfo.Box4Value4 = resp.data.AppointmentInsuranceDetails[0].Box4Value4 || "";
                    $scope.UBDetailsInfo.Box4ValueId4 = resp.data.AppointmentInsuranceDetails[0].Box4ValueId4 || "";

                    $scope.UBDetailsInfo.Box14ValueId = resp.data.AppointmentInsuranceDetails[0].Box14ValueId || "";
                    $scope.UBDetailsInfo.Box14Value = resp.data.AppointmentInsuranceDetails[0].Box14Value || "";
                    $scope.UBDetailsInfo.Box14ValueCode = resp.data.AppointmentInsuranceDetails[0].Box14ValueCode || "";
                    $scope.UBDetailsInfo.Box15ValueId = resp.data.AppointmentInsuranceDetails[0].Box15ValueId || "";
                    $scope.UBDetailsInfo.Box15Value = resp.data.AppointmentInsuranceDetails[0].Box15Value || "";
                    $scope.UBDetailsInfo.Box15ValueCode = resp.data.AppointmentInsuranceDetails[0].Box15ValueCode || "";

                    $scope.UBDetailsInfo.Box79Type = resp.data.AppointmentInsuranceDetails[0].Box79Type || "";
                    $scope.UBDetailsInfo.Box79TypeId = resp.data.AppointmentInsuranceDetails[0].Box79TypeId || "";
                    $scope.UBDetailsInfo.Box79Value = resp.data.AppointmentInsuranceDetails[0].Box79Value || "";
                    $scope.UBDetailsInfo.Box79ValueId = resp.data.AppointmentInsuranceDetails[0].Box79ValueId || "";
                    $scope.UBDetailsInfo.Box79ValueNPI = resp.data.AppointmentInsuranceDetails[0].Box79ValueNPI || "";
                    $scope.UBDetailsInfo.IsBox80Checked = resp.data.AppointmentInsuranceDetails[0].IsBox80Checked || "";


                    if ($scope.UBDetailsInfo.Box79TypeId == 3) {
                        $scope.UBDetailsInfo.FacilityName = resp.data.FacilityName || '';
                        $scope.UBDetailsInfo.FacilityNPI = resp.data.FacilityNPI || '';
                    }


                    $scope.UBDetailsInfo.TotalPatientPayment = resp.data.TotalPatientPayment || 0;

                    if ($scope.UBDetailsInfo.Box79Type == "Billing Provider") {
                        var filterProviderList = $filter("filter")($scope.BillingProvidersList, { "OrganizationBillingProviderId": $scope.UBDetailsInfo.Box79TypeId })[0] || [];
                        $scope.UBDetailsInfo.Box79FirstName = filterProviderList.BillingProviderName;
                        $scope.UBDetailsInfo.Box79LastName = '';
                    }
                    else if ($scope.UBDetailsInfo.Box79Type == "Rendering Provider") {

                        var filterDoctorList = $filter("filter")($scope.filteredBranchDoctorsList, { "DoctorID": $scope.UBDetailsInfo.Box79TypeId })[0] || [];
                        $scope.UBDetailsInfo.Box79FirstName = filterDoctorList.FirstName;
                        $scope.UBDetailsInfo.Box79LastName = filterDoctorList.LastName;
                    }
                    else if ($scope.UBDetailsInfo.Box79Type == "Facility") {
                        var filterOrgFacilityList = $filter("filter")($scope.OrganizationFacilityList, { "OrganizationFacilityId": $scope.UBDetailsInfo.Box79TypeId })[0] || [];
                        $scope.UBDetailsInfo.Box79FirstName = filterOrgFacilityList.FacilityName;
                        $scope.UBDetailsInfo.Box79LastName = '';
                    } else {

                    }


                    $scope.UBDetailsInfo.Box80Value = resp.data.AppointmentInsuranceDetails[0].Box80Value || "";

                }


                var filteredList = $filter("filter")($scope.filteredBranchDoctorsList, { "DoctorID": resp.data.RenderingProviderId }, true) || [];
                if (filteredList.length > 0) {
                    $scope.UBDetailsInfo.Box79FirstName = filteredList[0].FirstName || '';
                    $scope.UBDetailsInfo.Box79LastName = filteredList[0].LastName || '';
                    $scope.UBDetailsInfo.Box79ValueNPI = filteredList[0].NPI || '';
                }



                var filtredArray = $filter("filter")(resp.data.AppointmentInsuranceDetails, { "PatientInsuranceDetailId": resp.data.TransmitQueuePatientInsuranceId }, true) || [];

                if (filtredArray.length > 0) {
                    if (filtredArray[0].Box79TypeId == "1") {  //Billing provider
                        var filterProviderList = $filter("filter")($scope.BillingProvidersList, { "OrganizationBillingProviderId": resp.data.BillingProviderId }, true)[0] || [];
                        $scope.UBDetailsInfo.Box79FirstName = filterProviderList.BillingProviderName;
                        $scope.UBDetailsInfo.Box79ValueNPI = filterProviderList.Box33GroupNPI;
                        $scope.UBDetailsInfo.Box79LastName = '';
                    }
                    else if (filtredArray[0].Box79TypeId == "2") {  // Rendering Provider

                        var filteredList = $filter("filter")($scope.allUserList, { "DoctorID": resp.data.RenderingProviderId }, true) || [];
                        if (filteredList.length > 0) {
                            $scope.UBDetailsInfo.Box79FirstName = filteredList[0].FirstName || '';
                            $scope.UBDetailsInfo.Box79LastName = filteredList[0].LastName || '';
                            $scope.UBDetailsInfo.Box79ValueNPI = filteredList[0].NPI || '';
                        }
                    }
                    else if (filtredArray[0].Box79TypeId == "3") {   //Facility
                        //var filterOrgFacilityList = $filter("filter")($scope.mainBillerDataObj.AllBranchesList, { "OrganizationFacilityId": resp.data.OrganizationFacilityId }, true) || [];
                        //if (filterOrgFacilityList.length > 0) {
                        //    $scope.UBDetailsInfo.Box79FirstName = filterOrgFacilityList[0].FacilityName;
                        //    $scope.UBDetailsInfo.Box79LastName = '';
                        //    $scope.UBDetailsInfo.Box79ValueNPI = '';
                        //}
                        $scope.UBDetailsInfo.Box79FirstName = resp.data.FacilityName || '';
                        $scope.UBDetailsInfo.Box79ValueNPI = resp.data.FacilityNPI || '';
                    } else {
                        $scope.UBDetailsInfo.Box79FirstName = '';
                        $scope.UBDetailsInfo.Box79LastName = '';
                        $scope.UBDetailsInfo.Box79ValueNPI = '';
                    }


                    if (filtredArray[0].Box78TypeId == "1") {  //Billing provider
                        var filterProviderList = $filter("filter")($scope.BillingProvidersList, { "OrganizationBillingProviderId": resp.data.BillingProviderId }, true)[0] || [];
                        $scope.UBDetailsInfo.Box78FirstName = filterProviderList.BillingProviderName;
                        $scope.UBDetailsInfo.Box78LastName = '';
                        $scope.UBDetailsInfo.Box78ValueNPI = filterProviderList.Box33GroupNPI || '';
                    }
                    else if (filtredArray[0].Box78TypeId == "2") {  // Referring Provider


                        $scope.UBDetailsInfo.Box78FirstName = resp.data.ReferringProviderFirstName || '';
                        $scope.UBDetailsInfo.Box78LastName = resp.data.ReferringProviderLastName || '';
                        $scope.UBDetailsInfo.Box78ValueNPI = resp.data.ReferringProviderNPI || '';

                    }
                    else if (filtredArray[0].Box78TypeId == "3") {   //Facility
                        //var filterOrgFacilityList = $filter("filter")($scope.ClaimLocationList, { "OrganizationFacilityId": resp.data.OrganizationFacilityId }, true) || [];
                        //if (filterOrgFacilityList.length > 0) {
                        //    $scope.UBDetailsInfo.Box78FirstName = filterOrgFacilityList[0].FacilityName;
                        //    $scope.UBDetailsInfo.Box78LastName = '';
                        //    $scope.UBDetailsInfo.Box78ValueNPI = '';
                        //}
                        $scope.UBDetailsInfo.Box79FirstName = resp.data.FacilityName || '';
                        $scope.UBDetailsInfo.Box78LastName = '';
                        $scope.UBDetailsInfo.Box79ValueNPI = resp.data.FacilityNPI || '';
                    } else {
                        $scope.UBDetailsInfo.Box78FirstName = '';
                        $scope.UBDetailsInfo.Box78LastName = '';
                        $scope.UBDetailsInfo.Box78ValueNPI = '';
                    }

                    if (filtredArray[0].Box76TypeId == "1") {//Billing provider
                        //var filterProviderList = $filter("filter")($scope.ClaimProviderList, { "OrganizationBillingProviderId": resp.data.BillingProviderId }, true) || [];
                        let filterProviderList = $filter("filter")($scope.OrganizationBillingProviderList, function (item) {
                            return item.OrganizationBillingProviderId == resp.data.BillingProviderId;
                        }) || [];

                        if (filterProviderList.length > 0) {

                            $scope.UBDetailsInfo.AttendingProviderObj.FirstName = filterProviderList[0].BillingProviderName || "";

                            $scope.UBDetailsInfo.AttendingProviderObj.LastName = "";

                            $scope.UBDetailsInfo.AttendingProviderObj.NPI = filterProviderList[0].Box33GroupNPI || "";

                            $scope.UBDetailsInfo.AttendingProviderObj.UPIN = "0000000000";
                        }
                    } else if (filtredArray[0].Box76TypeId == "2") {// Rendering Provider
                        //var fRenderingobj = $filter("filter", $scope.filteredBranchDoctorsList, { "DoctorID": $scope.mainClaimObject.VisitProviderId }, true) || [];
                        let fRenderingobj = $filter("filter")($scope.allUserList, function (item) {
                            return item.DoctorID == resp.data.RenderingProviderId;
                        }) || [];
                        if (fRenderingobj.length > 0) {

                            $scope.UBDetailsInfo.AttendingProviderObj.FirstName = fRenderingobj[0].FirstName || "";

                            $scope.UBDetailsInfo.AttendingProviderObj.LastName = fRenderingobj[0].LastName || "";

                            $scope.UBDetailsInfo.AttendingProviderObj.NPI = fRenderingobj[0].NPI || "";

                            $scope.UBDetailsInfo.AttendingProviderObj.UPIN = fRenderingobj[0].UPIN && fRenderingobj[0].UPIN != "" ? fRenderingobj[0].UPIN : "0000000000";
                        }
                    } else if (filtredArray[0].Box76TypeId == "3") {//Facility
                        //let filetrbranch = $filter("filter")($scope.BranchServiceLocations, function (item) { return item.BranchServiceLocationId === $scope.mainClaimObject.BranchServiceLocationId; }) || [];

                        //if (filetrbranch.length > 0) {

                        $scope.UBDetailsInfo.AttendingProviderObj.FirstName = resp.data.FacilityName || '';

                        $scope.UBDetailsInfo.AttendingProviderObj.LastName = "";

                        $scope.UBDetailsInfo.AttendingProviderObj.NPI = resp.data.FacilityNPI || '';

                        //    $scope.UBDetailsInfo.AttendingProviderObj.UPIN = "0000000000";
                        /*}*/
                    }

                    if ($scope.ParentHospitalId != 2) {

                    if (filtredArray[0].Box77TypeId == "1") {   // Billing Provider

                        //var filterProviderList = $filter("filter", $scope.ClaimProviderList, { "OrganizationBillingProviderId": resp.data.BillingProviderId }, true) || [];
                        let filterProviderList = $filter("filter")($scope.OrganizationBillingProviderList, function (item) { return item.OrganizationBillingProviderId === resp.data.BillingProviderId; }) || [];


                        if (filterProviderList.length > 0) {

                            $scope.UBDetailsInfo.OperatingProviderObj.FirstName = filterProviderList[0].BillingProviderName || "";

                            $scope.UBDetailsInfo.OperatingProviderObj.LastName = "";

                            $scope.UBDetailsInfo.OperatingProviderObj.NPI = filterProviderList[0].Box33GroupNPI || "";
                        }

                    }
                    else if (filtredArray[0].Box77TypeId == "2") {   // Rendering Provider

                        //var fRenderingobj = $filter("filter", $scope.filteredBranchDoctorsList, { "DoctorID": $scope.mainClaimObject.VisitProviderId }, true) || [];
                        let fRenderingobj = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID === resp.data.RenderingProviderId; }) || [];


                        if (fRenderingobj.length > 0) {

                            $scope.UBDetailsInfo.OperatingProviderObj.FirstName = fRenderingobj[0].FirstName || "";

                            $scope.UBDetailsInfo.OperatingProviderObj.LastName = fRenderingobj[0].LastName || "";

                            $scope.UBDetailsInfo.OperatingProviderObj.NPI = fRenderingobj[0].NPI || "";
                        }

                    }
                    else if (filtredArray[0].Box77TypeId == "3") {   // Facility

                        //let filetrbranch = $filter("filter", $scope.BranchServiceLocations, function (item) { return item.BranchServiceLocationId === $scope.mainClaimObject.BranchServiceLocationId; });

                        //if (filetrbranch.length > 0) {

                        $scope.UBDetailsInfo.OperatingProviderObj.FirstName = resp.data.FacilityName || '';

                        $scope.UBDetailsInfo.OperatingProviderObj.LastName = "";

                        $scope.UBDetailsInfo.OperatingProviderObj.NPI = resp.data.FacilityNPI || '';
                        /*}*/

                    }

                    }
                }




                $scope.UBDetailsInfo.Appointment.AdmissionDate = resp.data.AppointmentDate;
                $scope.UBDetailsInfo.Appointment.AppointmentType = resp.data.AdmissionType;
                $scope.UBDetailsInfo.Appointment.AppointmentSource = resp.data.SourceOfAdmission;
                $scope.UBDetailsInfo.PatientControlNumber = resp.data.PatientClaimNumber;
                $scope.UBDetailsInfo.CurrentResponsibilityId = resp.data.CurrentResponsibilityId;
                $scope.UBDetailsInfo.TotalInsurancePayment = resp.data.TotalInsurancePayment ||0;
                if ($scope.isIojOrgEnable) {
                    if ($scope.UBDetailsInfo.CurrentResponsibilityId == 2) {
                        $scope.UBDetailsInfo.PatientControlNumber = $scope.UBDetailsInfo.PatientControlNumber + "P";
                    }
                    else if ($scope.UBDetailsInfo.CurrentResponsibilityId == 3) {
                        $scope.UBDetailsInfo.PatientControlNumber = $scope.UBDetailsInfo.PatientControlNumber + "S";
                    }
                    else {

                    }
                }

                //$scope.UBDetailsInfo.OperatingProviderObj.FirstName = resp.data.RenderingProviderFirstName;
                //$scope.UBDetailsInfo.OperatingProviderObj.LastName = resp.data.RenderingProviderLastName;
                //$scope.UBDetailsInfo.OperatingProviderObj.NPI = resp.data.RenderingProviderNPI;

                //$scope.UBDetailsInfo.OperatingProviderObj.FirstName = resp.data.ReferringProvider;
                // $scope.UBDetailsInfo.OperatingProviderObj.LastName = resp.data.RenderingProviderLastName;
                //$scope.UBDetailsInfo.OperatingProviderObj.NPI = resp.data.ReferringProviderNPI;

                //$scope.UBDetailsInfo.AttendingProviderObj.FirstName = resp.data.RenderingProviderFirstName;
                //$scope.UBDetailsInfo.AttendingProviderObj.LastName = resp.data.RenderingProviderLastName;
                //$scope.UBDetailsInfo.AttendingProviderObj.NPI = resp.data.RenderingProviderNPI;


                var fRenderingobj = $filter("filter")($scope.filteredBranchDoctorsList, { "DoctorID": resp.data.VisitProviderId }) || [];
                if (fRenderingobj.length > 0) {
                    $scope.UBDetailsInfo.AttendingProviderObj.FirstName = fRenderingobj[0].FirstName || "";
                    $scope.UBDetailsInfo.AttendingProviderObj.LastName = fRenderingobj[0].LastName || "";
                    $scope.UBDetailsInfo.AttendingProviderObj.NPI = fRenderingobj[0].NPI || "";

                    if (fRenderingobj[0].UPIN != "") {
                        $scope.UBDetailsInfo.AttendingProviderObj.UPIN = fRenderingobj[0].UPIN || "";
                    } else {
                        $scope.UBDetailsInfo.AttendingProviderObj.UPIN = "0000000000";
                    }

                    $scope.UBDetailsInfo.OperatingProviderObj.FirstName = fRenderingobj[0].FirstName || "";
                    $scope.UBDetailsInfo.OperatingProviderObj.LastName = fRenderingobj[0].LastName || "";
                    $scope.UBDetailsInfo.OperatingProviderObj.NPI = fRenderingobj[0].NPI || "";
                }

                if (resp.data.PatientClaimLineItems.length > 0) {
                    angular.forEach($scope.UBDetailsInfo.RevenueList, function (oitem) {
                        angular.forEach(resp.data.PatientClaimLineItems, function (ditem, index) {

                            //var TotalChargeIntegerNumber = Math.floor(ditem.TotalChargeAmount) || 0;
                            //var TotalChargeDecimalNumber = Math.round((ditem.TotalChargeAmount - TotalChargeIntegerNumber) * 100);
                            var amount = Number(ditem.TotalChargeAmount).toFixed(2);

                            var parts = amount.split('.');
                            var TotalChargeIntegerNumber = parts[0];
                            var TotalChargeDecimalNumber = parts[1];
                            if (TotalChargeDecimalNumber == 0) {
                                TotalChargeDecimalNumber = '00';
                            }

                            if (index === oitem.Sno) {
                                oitem.Modifier1 = ditem.Modifier1 || "";
                                oitem.Modifier2 = ditem.Modifier2 || "";
                                oitem.Modifier3 = ditem.Modifier3 || "";
                                oitem.Modifier4 = ditem.Modifier4 || "";
                                let Modifiers = ditem.Modifier1 + " " + ditem.Modifier2 + " " + ditem.Modifier3 + " " + ditem.Modifier4;
                                oitem.Code = ditem.ServiceCode + " " + Modifiers || "";
                                //  oitem.Code = ditem.ProcedureCode || "";
                                oitem.Date = $filter("date")(ditem.DOSfrom, "yyyy-MM-dd");
                                oitem.RevenueCode = ditem.RevenueBillingCode || "";
                                oitem.RevenueCodeDescription = ditem.ServiceName;
                                oitem.Rate = ditem.UnitCharge;
                                oitem.ServiceDate = $filter("date")(ditem.DOSfrom, "yyyy-MM-dd");
                                oitem.ServiceUnits = ditem.Quantity;
                                oitem.TotalCharges = ditem.TotalChargeAmount;
                                oitem.TotalChargeIntegerNumber = TotalChargeIntegerNumber;
                                oitem.TotalChargeDecimalNumber = TotalChargeDecimalNumber;
                                oitem.DrugProductID = ditem.MedicineId || null;
                                oitem.NationalDrugCode = ditem.DrugNDCID || "";
                                oitem.DrugUnit = ditem.MedicineStrength || "";
                                oitem.DrugUom = ditem.UnitName || "";
                                oitem.DrugLinkSeqNumber = "";
                                oitem.DrugPharmacyPresNumber = "";
                                index++;
                            }
                        });
                    });
                    $scope.UBDetailsInfo.TotalBalance = resp.data.TotalBalance || 0;
                    var UBIntegerBalanceNo = Math.floor($scope.UBDetailsInfo.TotalBalance);
                    var UBDecimalBalanceNo = Math.round(($scope.UBDetailsInfo.TotalBalance - UBIntegerBalanceNo) * 100);

                    $scope.UBDetailsInfo.UBIntegerBalanceNo = UBIntegerBalanceNo;
                    $scope.UBDetailsInfo.UBDecimalBalanceNo = UBDecimalBalanceNo;
                    if ($scope.UBDetailsInfo.UBDecimalBalanceNo == 0) {
                        $scope.UBDetailsInfo.UBDecimalBalanceNo = '00';
                    }

                    $scope.UBDetailsInfo.TotalClaimAmount = resp.data.TotalClaimAmount || 0;

                    var UBIntegerNumber = Math.floor($scope.UBDetailsInfo.TotalClaimAmount);
                    var UBDecimalNumber = Math.round(($scope.UBDetailsInfo.TotalClaimAmount - UBIntegerNumber) * 100);

                    $scope.UBDetailsInfo.UBIntegerNumber = UBIntegerNumber;
                    $scope.UBDetailsInfo.UBDecimalNumber = UBDecimalNumber;
                    if ($scope.UBDetailsInfo.UBDecimalNumber == 0) {
                        $scope.UBDetailsInfo.UBDecimalNumber = '00';
                    }
                    if (resp.data.SecondaryInsuranceDateOfSubmission != null) {
                        $scope.UBDetailsInfo.CreateDate = resp.data.SecondaryInsuranceDateOfSubmission || null;
                    } else {
                        $scope.UBDetailsInfo.CreateDate = resp.data.PrimaryInsuranceDateOfSubmission || null;
                    }


                    $scope.UBDetailsInfo.PrincipalProcedure.Code = resp.data.PatientClaimLineItems[0].ServiceCode || "";
                    $scope.UBDetailsInfo.PrincipalProcedure.Date = $filter("date")(resp.data.PatientClaimLineItems[0].DOSfrom, "yyyy-MM-dd");
                }

                for (let i = 0; i < $scope.UBDetailsInfo.OtherDiagnosisandPOA_Firstrow.length; i++) {
                    let item = $scope.UBDetailsInfo.OtherDiagnosisandPOA_Firstrow[i];
                    let icd = $scope.ClaimDetailsList[0]["ICD" + item.Sno];

                    if (icd) {
                        item.DiagnosisCode = icd;
                    }
                }

                if (resp.data.PatientClaimLineItems.length > 0) {
                    angular.forEach($scope.UBDetailsInfo.OtherDiagnosisandPOA_Firstrow, function (oitem) {
                        angular.forEach(resp.data.PatientClaimLineItems, function (yitem) {
                            angular.forEach(yitem.DiagnosisList, function (ditem) {
                                if (ditem.Type === oitem.DiagnosisLetter && ditem.DiagnosisId != 0) {
                                    oitem.DiagnosisCode = ditem.ICDCode || "";
                                    oitem.PresentonAdmission = "Y";
                                }
                                if (ditem.Type === "A" && ditem.DiagnosisId != 0) {
                                    $scope.UBDetailsInfo.PrincipleDiagnosisandPOA.DiagnosisCode = ditem.ICDCode || "";
                                    $scope.UBDetailsInfo.PrincipleDiagnosisandPOA.PresentonAdmission = "Y";
                                    $scope.UBDetailsInfo.AdmittingDiagnosisCode = ditem.ICDCode || "";
                                    //$scope.UBDetailsInfo.AdmittingDiagnosisCode = "";
                                    $scope.UBDetailsInfo.PatientsReasonforVisitObj.Reason1 = ditem.ICDCode || "";
                                    $scope.UBDetailsInfo.ExternalCauseofInjuryObj[0].Code = ditem.ICDCode || "";
                                    $scope.UBDetailsInfo.ExternalCauseofInjuryObj[0].PresentonAdmission = "Y";
                                }
                                else if (ditem.Type === "B" && ditem.DiagnosisId != 0) {
                                    $scope.UBDetailsInfo.PatientsReasonforVisitObj.Reason2 = ditem.ICDCode || "";
                                    $scope.UBDetailsInfo.ExternalCauseofInjuryObj[1].Code = ditem.ICDCode || "";
                                    $scope.UBDetailsInfo.ExternalCauseofInjuryObj[1].PresentonAdmission = "Y";
                                }
                                else if (ditem.Type === "C" && ditem.DiagnosisId != 0) {
                                    $scope.UBDetailsInfo.PatientsReasonforVisitObj.Reason3 = ditem.ICDCode || "";
                                    $scope.UBDetailsInfo.ExternalCauseofInjuryObj[2].Code = ditem.ICDCode || "";
                                    $scope.UBDetailsInfo.ExternalCauseofInjuryObj[2].PresentonAdmission = "Y";
                                }

                            });
                        });
                    });
                }

                type = type || 'withTemplate';
                $scope.GetUBinfoPrint(type);

            }

        }, function (error) {

        });
    }

    $scope.CMSPrintPopUp = function (type) {
        $scope.PatientDetailsForCMSPrintOBJ = angular.copy(GetPatientDetailsForCMSPrintOBJ());

        $scope.Dobobj = {
            "D": '',
            "M": '',
            "Y": ''
        }


        let PatientandInsuredDeatils = $scope.HCFADetailsInfo.PatientDetails || {};
        if ($scope.HCFADetailsInfo.PatientDetails.Title != "") {
            let PatientandInsuredDeatils = $scope.HCFADetailsInfo.PatientDetails || {};
            patient_Name = PatientandInsuredDeatils.fullname;
            patient_Title = PatientandInsuredDeatils.Title;
            patient_fullname = PatientandInsuredDeatils.fullname;
            patient_FirstName = PatientandInsuredDeatils.FirstName;
            patient_MiddleName = PatientandInsuredDeatils.MiddleName;
            patient_LastName = PatientandInsuredDeatils.LastName;
            patient_SecondLastName = PatientandInsuredDeatils.SecondLastName;
        } else {
            patient_Name = PatientandInsuredDeatils.fullname;
            patient_Title = PatientandInsuredDeatils.Title;
            patient_fullname = PatientandInsuredDeatils.fullname;
            patient_FirstName = PatientandInsuredDeatils.FirstName;
            patient_MiddleName = PatientandInsuredDeatils.MiddleName;
            patient_LastName = PatientandInsuredDeatils.LastName;
            patient_SecondLastName = PatientandInsuredDeatils.SecondLastName;
        }
        PatientandInsuredDeatils.DOB = PatientandInsuredDeatils.DOB || '';
        let InsuranceDeatils = $scope.HCFADetailsInfo.InsuranceDetails || {};
        $scope.PatientDetailsForCMSPrintOBJ.Insured_address = InsuranceDeatils.Address || ''
        if (InsuranceDeatils.InsuredPersonFirstName1 != '') {
            $scope.PatientDetailsForCMSPrintOBJ.insured_FirstName1 = InsuranceDeatils.InsuredPersonFirstName1;
            $scope.PatientDetailsForCMSPrintOBJ.insured_MiddleName1 = InsuranceDeatils.InsuredPersonMiddleName1;
            $scope.PatientDetailsForCMSPrintOBJ.insured_LastName1 = InsuranceDeatils.InsuredPersonLastName1;
            $scope.PatientDetailsForCMSPrintOBJ.insured_FirstName2 = InsuranceDeatils.InsuredPersonFirstName2;
            $scope.PatientDetailsForCMSPrintOBJ.insured_MiddleName2 = InsuranceDeatils.InsuredPersonMiddleName2;
            $scope.PatientDetailsForCMSPrintOBJ.insured_LastName2 = InsuranceDeatils.InsuredPersonLastName2;
        }
        if (PatientandInsuredDeatils.DOB != "") {
            var D = PatientandInsuredDeatils.DOB || "";
            if (D != "" && D != " ") {
                //  dateofbirth = new Date(D);

                var dobMoment = moment(D); // Create moment object

                if (dobMoment.isValid()) {
                    $scope.PatientDetailsForCMSPrintOBJ.Dobobj.D = dobMoment.format('DD');   // Day (e.g., "09")
                    $scope.PatientDetailsForCMSPrintOBJ.Dobobj.M = dobMoment.format('MM');  // Month (e.g., "06")
                    $scope.PatientDetailsForCMSPrintOBJ.Dobobj.Y = dobMoment.format('YYYY'); // Year (e.g., "1996")
                }
            }

        }
        if (InsuranceDeatils.DOB != "") {
            var D = InsuranceDeatils.DOB || "";
            if (D != "" && D != " ") {
                //  dateofbirth = new Date(D);

                var dobMoment = moment(D); // Create moment object

                if (dobMoment.isValid()) {
                    $scope.PatientDetailsForCMSPrintOBJ.Dobobj.ID = dobMoment.format('DD');   // Day (e.g., "09")
                    $scope.PatientDetailsForCMSPrintOBJ.Dobobj.IM = dobMoment.format('MM');  // Month (e.g., "06")
                    $scope.PatientDetailsForCMSPrintOBJ.Dobobj.IY = dobMoment.format('YYYY'); // Year (e.g., "1996")
                }
            }

        }
        $scope.HCFADetailsInfo.DateofCurrentIllnessInjuryorPregnancy.Date = $scope.HCFADetailsInfo.DateofCurrentIllnessInjuryorPregnancy.Date || '';
        $scope.HCFADetailsInfo.DateofCurrentIllnessInjuryorPregnancy.QUAL = $scope.HCFADetailsInfo.DateofCurrentIllnessInjuryorPregnancy.QUAL || '';
        if ($scope.HCFADetailsInfo.DateofCurrentIllnessInjuryorPregnancy.Date != "") {
            var D = $scope.HCFADetailsInfo.DateofCurrentIllnessInjuryorPregnancy.Date || "";
            if (D != "" && D != " ") {
                //  dateofbirth = new Date(D);

                var dobMoment = moment(D); // Create moment object

                if (dobMoment.isValid()) {
                    $scope.PatientDetailsForCMSPrintOBJ.Dobobj.CurrentIllnessDate = dobMoment.format('DD');   // Day (e.g., "09")
                    $scope.PatientDetailsForCMSPrintOBJ.Dobobj.CurrentIllnessMonth = dobMoment.format('MM');  // Month (e.g., "06")
                    $scope.PatientDetailsForCMSPrintOBJ.Dobobj.CurrentIllnessYear = dobMoment.format('YYYY'); // Year (e.g., "1996")
                }
            }

        }
        $scope.HCFADetailsInfo.OtherDate.Date = $scope.HCFADetailsInfo.OtherDate.Date || '';
        if ($scope.HCFADetailsInfo.OtherDate.Date != "") {
            var D = $scope.HCFADetailsInfo.OtherDate.Date || "";
            if (D != "" && D != " ") {
                //  dateofbirth = new Date(D);

                var dobMoment = moment(D); // Create moment object

                if (dobMoment.isValid()) {
                    $scope.PatientDetailsForCMSPrintOBJ.OtherDate = dobMoment.format('DD');   // Day (e.g., "09")
                    $scope.PatientDetailsForCMSPrintOBJ.OtherMonth = dobMoment.format('MM');  // Month (e.g., "06")
                    $scope.PatientDetailsForCMSPrintOBJ.OtherYear = dobMoment.format('YYYY'); // Year (e.g., "1996")
                }
            }

        }
        if (InsuranceDeatils.Gender === "M") {
            $scope.PatientDetailsForCMSPrintOBJ.ISINmale = true;
        } else if (InsuranceDeatils.Gender === "F") {
            $scope.PatientDetailsForCMSPrintOBJ.ISINFmale = true;
        }
        if (PatientandInsuredDeatils.Sex === "Male") {
            $scope.PatientDetailsForCMSPrintOBJ.ISmale = true;
        } else if (PatientandInsuredDeatils.Sex === "Female") {
            $scope.PatientDetailsForCMSPrintOBJ.IsFemale = true;
        }


        if (PatientandInsuredDeatils.RelationShipId != "") {
            if (PatientandInsuredDeatils.RelationShipId == 1) {
                $scope.PatientDetailsForCMSPrintOBJ.ISSelf = true;
            } else if (PatientandInsuredDeatils.RelationShipId == 2 || PatientandInsuredDeatils.RelationShipId == 3 || PatientandInsuredDeatils.RelationShipId == 26) {
                $scope.PatientDetailsForCMSPrintOBJ.ISSpouse = true;
            } else if (PatientandInsuredDeatils.RelationShipId == 6 || PatientandInsuredDeatils.RelationShipId == 7) {
                $scope.PatientDetailsForCMSPrintOBJ.ISChild = true;
            } else {
                $scope.PatientDetailsForCMSPrintOBJ.IsInsuredROther = true;
            }
        }
        let Suffix = "";
        const hasSupervising = $scope.HCFADetailsInfo.supervisingProviderId != null;
        const hasOrdering = $scope.HCFADetailsInfo.OrderingProviderId != null;
        const hasReferring = $scope.HCFADetailsInfo.ReferringProviderId != null;
        let a2 = '';
        if (hasSupervising && hasOrdering && hasReferring) {
            Suffix = "DQ";  // Highest priority
            $scope.PatientDetailsForCMSPrintOBJ.PROVIDERName = $scope.HCFADetailsInfo.supervisingProviderName || "";
        } else if (!hasSupervising && hasOrdering && hasReferring) {
            Suffix = "DK"; // When supervising is null but other two exist
            $scope.PatientDetailsForCMSPrintOBJ.PROVIDERName = $scope.HCFADetailsInfo.OrderingProviderName || "";
        } else if (hasReferring) {
            Suffix = "DN"; // When only supervising exists
            if ($scope.HCFADetailsInfo.ReferringProvider != undefined) {
                $scope.PatientDetailsForCMSPrintOBJ.PROVIDERName = $scope.HCFADetailsInfo.ReferringProvider || "";
            }
        } else {
            Suffix = "";
        }

        $scope.PatientDetailsForCMSPrintOBJ.Suffix = Suffix || '';
        $scope.HCFADetailsInfo.Suffix = Suffix || '';
        $scope.HCFADetailsInfo.PROVIDERName = $scope.PatientDetailsForCMSPrintOBJ.PROVIDERName || '';


        $scope.PatientDetailsForCMSPrintOBJ.CurrentDate = $filter('date')(new Date(), "MM/dd/yyyy");
       /* $scope.HCFADetailsInfo.CurrentDate = $filter('date')(new Date(), "MM/dd/yyyy");*/


        $scope.PatientDetailsForCMSPrintOBJ.IsEmplNo = false;
        $scope.PatientDetailsForCMSPrintOBJ.IsAutoNo = false;
        $scope.PatientDetailsForCMSPrintOBJ.ISOtherAccNo = false;

        if ($scope.HCFADetailsInfo.datesPatientUnabletoWorkincurrentoccupation != "") {
            var D = $scope.HCFADetailsInfo.datesPatientUnabletoWorkincurrentoccupation.FormDate || "";
            if (D != "") {
                if (D != "" && D != " ") {
                    //  dateofbirth = new Date(D);

                    let dobMoment = moment(D); // Create moment object

                    if (dobMoment.isValid()) {
                        $scope.PatientDetailsForCMSPrintOBJ.datesPatientUnabletoWorkincurrentoccupationDate = dobMoment.format('DD');   // Day (e.g., "09")
                        $scope.PatientDetailsForCMSPrintOBJ.datesPatientUnabletoWorkincurrentoccupationMonth = dobMoment.format('MM');  // Month (e.g., "06")
                        $scope.PatientDetailsForCMSPrintOBJ.datesPatientUnabletoWorkincurrentoccupationYear = dobMoment.format('YYYY'); // Year (e.g., "1996")
                    }
                }
            }
            var TD = $scope.HCFADetailsInfo.datesPatientUnabletoWorkincurrentoccupation.ToDate || "";
            if (TD != "") {
                if (TD != "" && TD != " ") {
                    //  dateofbirth = new Date(D);

                    let dobMoment = moment(TD); // Create moment object

                    if (dobMoment.isValid()) {
                        $scope.PatientDetailsForCMSPrintOBJ.datesPatientUnabletoWorkincurrentoccupationTDate = dobMoment.format('DD');   // Day (e.g., "09")
                        $scope.PatientDetailsForCMSPrintOBJ.datesPatientUnabletoWorkincurrentoccupationTMonth = dobMoment.format('MM');  // Month (e.g., "06")
                        $scope.PatientDetailsForCMSPrintOBJ.datesPatientUnabletoWorkincurrentoccupationTYear = dobMoment.format('YYYY'); // Year (e.g., "1996")
                    }
                }
            }
        }
        if ($scope.HCFADetailsInfo.hospitalizationDatesRelatedToCurrentServices != "") {
            var D = $scope.HCFADetailsInfo.hospitalizationDatesRelatedToCurrentServices.FormDate || "";
            if (D != "") {
                if (D != "" && D != " ") {
                    //  dateofbirth = new Date(D);

                    let dobMoment = moment(D); // Create moment object

                    if (dobMoment.isValid()) {
                        $scope.PatientDetailsForCMSPrintOBJ.hospitalizationDatesRelatedToCurrentServicesDate = dobMoment.format('DD');   // Day (e.g., "09")
                        $scope.PatientDetailsForCMSPrintOBJ.dhospitalizationDatesRelatedToCurrentServicesMonth = dobMoment.format('MM');  // Month (e.g., "06")
                        $scope.PatientDetailsForCMSPrintOBJ.hospitalizationDatesRelatedToCurrentServicesYear = dobMoment.format('YYYY'); // Year (e.g., "1996")
                    }
                }
            }
            var TD = $scope.HCFADetailsInfo.hospitalizationDatesRelatedToCurrentServices.ToDate || "";
            if (TD != "") {
                if (TD != "" && TD != " ") {
                    //  dateofbirth = new Date(D);

                    let dobMoment = moment(TD); // Create moment object

                    if (dobMoment.isValid()) {
                        $scope.PatientDetailsForCMSPrintOBJ.hospitalizationDatesRelatedToCurrentServicesTDate = dobMoment.format('DD');   // Day (e.g., "09")
                        $scope.PatientDetailsForCMSPrintOBJ.hospitalizationDatesRelatedToCurrentServicesTMonth = dobMoment.format('MM');  // Month (e.g., "06")
                        $scope.PatientDetailsForCMSPrintOBJ.hospitalizationDatesRelatedToCurrentServicesTYear = dobMoment.format('YYYY'); // Year (e.g., "1996")
                    }
                }
            }
        }
        $scope.HCFADetailsInfo.ProcedureList = $scope.HCFADetailsInfo.ProcedureList || [];
        function toDate(d) {
            if (!d) return null;
            const [mm, dd, yyyy] = d.split("-");
            return new Date(`${yyyy}-${mm}-${dd}T00:00:00`);
        }
        $scope.ProcedureRows = [];
        if ($scope.HCFADetailsInfo.ProcedureList.length > 0) {
            angular.forEach($scope.HCFADetailsInfo.ProcedureList, function (mitem) {

                // FROM DATE
                if (mitem.FromDate) {
                    mitem.FromDate = toDate(mitem.FromDate);
                }

                // TO DATE
                if (mitem.ToDate) {
                    mitem.ToDate = toDate(mitem.ToDate);
                } else {
                    mitem.ToDate = mitem.FromDate || '';
                }

            });

            for (let i = 0; i < 6; i++) {
                // If index exists in real data, use it
                if ($scope.HCFADetailsInfo.ProcedureList[i]) {
                    $scope.ProcedureRows.push($scope.HCFADetailsInfo.ProcedureList[i]);
                } else {
                    // Otherwise push an empty object for blank rows
                    $scope.ProcedureRows.push({});
                }
            }
        }

        if ($scope.HCFADetailsInfo.TotalCharges != undefined) {
            $scope.HCFADetailsInfo.charge = Math.floor($scope.HCFADetailsInfo.TotalCharges);
            $scope.HCFADetailsInfo.decimalCharge = Math.round(($scope.HCFADetailsInfo.TotalCharges - $scope.HCFADetailsInfo.charge) * 100);
            if ($scope.HCFADetailsInfo.decimalCharge == 0) {
                $scope.HCFADetailsInfo.decimalCharge = "00";
            }
        }
        if ($scope.HCFADetailsInfo.TotalInsandPatPaidAmt != undefined) {
            $scope.HCFADetailsInfo.charges1 = Math.floor($scope.HCFADetailsInfo.TotalInsandPatPaidAmt) || 0;
            $scope.HCFADetailsInfo.decimalPayment = Math.round(($scope.HCFADetailsInfo.TotalInsandPatPaidAmt - $scope.HCFADetailsInfo.charges1) * 100);
            if ($scope.HCFADetailsInfo.decimalPayment == 0) {
                $scope.HCFADetailsInfo.decimalPayment = "00";
            }

            $scope.HCFADetailsInfo.AmountPaid = parseFloat($scope.HCFADetailsInfo.charges1 + '.' + $scope.HCFADetailsInfo.decimalPayment);
        }
        var sign = "";
        if ($scope.HCFADetailsInfo.ServiceFacilityLocationInformation != undefined && $scope.HCFADetailsInfo.ServiceFacilityLocationInformation != "") {
            //sign = totaldetails.ServiceFacilityLocationInformation.Servicefacility || "";
            sign = sign + $scope.HCFADetailsInfo.ServiceFacilityLocationInformation.ServicefacilityBranch || "";
            if (sign != '' && $scope.HCFADetailsInfo.ServiceFacilityLocationInformation.ServicefacilityAddress != '') {
                sign = sign + "\n";
                sign = sign + $scope.HCFADetailsInfo.ServiceFacilityLocationInformation.ServicefacilityAddress;
            } else {
                sign = sign + $scope.HCFADetailsInfo.ServiceFacilityLocationInformation.ServicefacilityAddress;
            }
            var cityandstate = "";
            cityandstate = $scope.HCFADetailsInfo.ServiceFacilityLocationInformation.CityName + " " + $scope.HCFADetailsInfo.ServiceFacilityLocationInformation.StateName + " " + $scope.HCFADetailsInfo.ServiceFacilityLocationInformation.ZipCode;
            if (sign != '') {
                sign = sign + "\n";
                sign = sign + cityandstate;
            } else {
                sign = sign + cityandstate;
            }


        }
        $scope.HCFADetailsInfo.sign = sign || '';

        var stateadress = "";
        billingprovider = $scope.HCFADetailsInfo.Box33GroupName;
        postaladdress1 = $scope.HCFADetailsInfo.PostalAddress1;
        postaladdress2 = $scope.HCFADetailsInfo.PostalAddress2;
        billingproviderssn = $scope.HCFADetailsInfo.BillingProviderSSN;
        billingprovidernpi = $scope.HCFADetailsInfo.Box33GroupNPI;
        BillProviderTaxId = $scope.HCFADetailsInfo.BillingProviderTaxonomyId;
        BillingProviderContactNumber = $scope.HCFADetailsInfo.BillingProviderContactNumber;
        if ($scope.HCFADetailsInfo.PostalCityName != "") {
            stateadress = $scope.HCFADetailsInfo.PostalCityName + ", " + $scope.HCFADetailsInfo.PostalStateCode;
        } else {
            stateadress = $scope.HCFADetailsInfo.PostalStateCode;
        }

        if ($scope.HCFADetailsInfo.InsuranceDetails.PayorTypeId === 9 || $scope.HCFADetailsInfo.InsuranceDetails.PayorTypeId === 12 || $scope.HCFADetailsInfo.InsuranceDetails.PayorTypeId === 31) {

            $scope.PatientDetailsForCMSPrintOBJ.IsMedicare = true;
            $scope.HCFADetailsInfo.IsMedicare = true;

        }
        else if ($scope.HCFADetailsInfo.PatientDetails.InsuranceTypeCode == "MC") {

            $scope.PatientDetailsForCMSPrintOBJ.IsMedicaid = true;
            $scope.HCFADetailsInfo.IsMedicaid = true;

        }
        else if ($scope.HCFADetailsInfo.PatientDetails.InsuranceTypeCode == "CH") {

            $scope.PatientDetailsForCMSPrintOBJ.IsTricare = true;
            $scope.HCFADetailsInfo.IsTricare = true;

        }
        else if ($scope.HCFADetailsInfo.PatientDetails.InsuranceTypeCode == "VA") {

            $scope.PatientDetailsForCMSPrintOBJ.IsChampva = true;
            $scope.HCFADetailsInfo.IsChampva = true;

        }
        else {

            $scope.PatientDetailsForCMSPrintOBJ.IsOther = true;
            $scope.HCFADetailsInfo.IsOther = true;

        }

        $scope.HCFADetailsInfo.stateadress = stateadress || '';

        $scope.ascFilterspopover = {
            templateUrl: 'CMS-1500USPrint.html'
        }
        //$rootScope.$broadcast("loader_show");

        //$timeout(function () {

        //    var page1 = document.getElementById('PrintIndtransPopupNewa').innerHTML;


        //    var innerContents = `<div class="print-page">${page1}</div>`;

        //    var popupWin = window.open('', '_blank');
        //    popupWin.document.open();
        //    popupWin.document.write(`<html lang="en"><head><meta charset="UTF-8"/><title>CMS-1500 Print Layout</title><style>@font-face{font-family:'EHHelvetica';src:url('..//fonts/Helvetica.ttf')format('truetype'),url('/fonts/helvetica-bold.ttf')format('truetype');font-weight:400;font-style:normal;font-display:swap;} :root{--page-width:8.5in;--page-height:11in;--screen-scale:1;--print-scale:1;--border-color:#d02b2b;--text-color:#E72428;--font-size-base:9px;--line-height-base:1.2;} *{box-sizing:border-box;} html,body{margin:0;padding:0;background:#eee;font-family:'EHHelvetica',Arial,sans-serif;} body{display:flex;justify-content:center;align-items:flex-start;min-height:100vh;padding:1rem;} .page-wrapper{transform:scale(var(--screen-scale));transform-origin:top left;} .cms1500-page{width:var(--page-width);height:var(--page-height);background:#fff;position:relative;color:var(--text-color);font-size:var(--font-size-base);line-height:var(--line-height-base);} td{padding:0;} @media print{body{background:#fff;padding:0;margin:0;display:block;} .page-wrapper{transform:scale(var(--print-scale));transform-origin:top left;} .cms1500-page{margin:0;}}</style></head><body>${innerContents}</body></html>`);
        //    popupWin.document.close();
        //    $rootScope.$broadcast("loader_hide");
        //}, 1500);


        if (type == 'withline') {
            $scope.HCFADetailsInfo.printtype = "withTemplate";
        } else if (type == "withoutline") {
            $scope.HCFADetailsInfo.printtype = "withOutTemplate";

        }

        eHnoteMainAppointmentService.GenerateCMS1500FromHCFA($scope.HCFADetailsInfo, type)
            .then(openPdf);
    }


    $scope.GetUBinfoPrint = function (type) {
        $scope.UBDetailsInfo.Occurrence = $scope.UBDetailsInfo.Occurrence || [];
        for (var i = $scope.UBDetailsInfo.Occurrence.length; i <= 3; i++) {
            var obj = {
                "aCodes": "",
                "aDate": "",
                "bCodes": "",
                "bDate": ""
            }
            $scope.UBDetailsInfo.Occurrence.push(obj);
        }
        $scope.UBDetailsInfo.OccurrenceSpan = $scope.UBDetailsInfo.OccurrenceSpan || [];
        for (var i = $scope.UBDetailsInfo.OccurrenceSpan.length; i <= 1; i++) {
            var obj = {
                "aCodes": "",
                "aFromDates": "",
                "aThroughDates": "",
                "bCodes": "",
                "bFromDates": "",
                "bThroughDates": ""
            }
            $scope.UBDetailsInfo.OccurrenceSpan.push(obj);
        }

        $scope.UBDetailsInfo.ValueCode = $scope.UBDetailsInfo.ValueCode || [];
        for (var i = $scope.UBDetailsInfo.ValueCode.length; i <= 3; i++) {
            var obj = {
                "Sno": i + 1,
                "aCode": "",
                "aAmount": "",
                "bCode": "",
                "bAmount": "",
                "cCode": "",
                "cAmount": "",
                "dCode": "",
                "dAmount": "",
            }
            $scope.UBDetailsInfo.ValueCode.push(obj);
        }
        console.log($scope.UBDetailsInfo);

        //$timeout(function () {
        //    var innerContents = document.getElementById('Ub_print').innerHTML;
        //    var popupWinindow = window.open('', 'scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
        //    popupWinindow.document.open();
        //    popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()" class="bodyheightprint">' + innerContents + '</body></html>');
        //    popupWinindow.document.close();
        //}, 1000);
        //$timeout(function () {
        //    var innerContents = document.getElementById('Ub_print').innerHTML;
        //    var popupWinindow = window.open('', 'scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
        //    popupWinindow.document.open();
        //    popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /><style>@font-face{font-family:"EHHelvetica";src:url("..//fonts/Helvetica.ttf") format("truetype"),url("/fonts/helvetica-bold.ttf") format("truetype");font-weight:400;font-style:normal;font-display:swap;} :root{--page-width:8.5in;--page-height:11in;--screen-scale:1;--print-scale:1;--border-color:#d02b2b;--text-color:#000;--font-size-base:9px;--line-height-base:1.2;} *{box-sizing:border-box;} html,body{margin:0;padding:0;background:#eee;font-family:"EHHelvetica",Arial,sans-serif;} body{display:flex;justify-content:center;align-items:flex-start;min-height:100vh;padding:1rem;} .page-wrapper{transform:scale(var(--screen-scale));transform-origin:top left;} .cms1500-page{width:var(--page-width);height:var(--page-height);background:#fff;position:relative;color:var(--text-color);font-size:var(--font-size-base);line-height:var(--line-height-base);} td{padding:0;} @media print{body{background:#fff;padding:0;margin:0;display:block;} .page-wrapper{transform:scale(var(--print-scale));transform-origin:top left;} .cms1500-page{margin:0;}}</style></head><body onload="window.print()" class="bodyheightprint">' + innerContents + '</body></html>');
        //    popupWinindow.document.close();
        //}, 1000);
        $scope.UBDetailsInfo.printtype = "withTemplate";
        if (type == "withOutTemplate") {
            $scope.UBDetailsInfo.printtype = "withOutTemplate";
        }

        $scope.UBDetailsInfo.TotalChargeAmount = 0;
        $scope.UBDetailsInfo.TotalChargeAmount = $scope.UBDetailsInfo.TotalClaimAmount;

        eHnoteMainAppointmentService.GenerateUB04FromHCFA($scope.UBDetailsInfo)
            .then(openPdf);

    }

    function GetPatientDetailsForCMSPrintOBJ() {
        return {
            Dobobj: {
                "D": '',
                "M": '',
                "Y": ''
            },
            ISmale: false,
            IsFemale: false,
            IsOther: false,
            ISSelf: false,
            ISSpouse: false,
            ISChild: false,
            IsInsuredROther: false,


        }
    };
    $scope.PatientDetailsForCMSPrintOBJ = angular.copy(GetPatientDetailsForCMSPrintOBJ());
    function openPdf(response) {
        var blob = new Blob([response.data], { type: 'application/pdf' });
        var url = URL.createObjectURL(blob);
        window.open(url);
    }

    function GetDiagnosisPointer(billobj) {
        var diagnosisPointers = "";
        if (billobj.length > 0) {
            angular.forEach(billobj, function (item2) {
                angular.forEach($scope.HCFADetailsInfo.DiagnosisList, function (ditem) {
                    if (item2.DiagnosisId === ditem.DiagnosisId) {
                        if (ditem.SNO === 1) {
                            diagnosisPointers = diagnosisPointers + "A";
                        }
                        if (ditem.SNO === 2) {
                            diagnosisPointers = diagnosisPointers + "B";
                        }
                        if (ditem.SNO === 3) {
                            diagnosisPointers = diagnosisPointers + "C";
                        }
                        if (ditem.SNO === 4) {
                            diagnosisPointers = diagnosisPointers + "D";
                        }
                        if (ditem.SNO === 5) {
                            diagnosisPointers = diagnosisPointers + "E";
                        }
                        if (ditem.SNO === 6) {
                            diagnosisPointers = diagnosisPointers + "F";
                        }
                        if (ditem.SNO === 7) {
                            diagnosisPointers = diagnosisPointers + "G";
                        }
                        if (ditem.SNO === 8) {
                            diagnosisPointers = diagnosisPointers + "H";
                        }
                        if (ditem.SNO === 9) {
                            diagnosisPointers = diagnosisPointers + "I";
                        }
                        if (ditem.SNO === 10) {
                            diagnosisPointers = diagnosisPointers + "J";
                        }
                        if (ditem.SNO === 11) {
                            diagnosisPointers = diagnosisPointers + "K";
                        }
                        if (ditem.SNO === 12) {
                            diagnosisPointers = diagnosisPointers + "L";
                        }
                    }
                });
            });
        }
        return diagnosisPointers;
    }
    $scope.EditDepositAmount = function (item, id) {

        console.log(item)
        $scope.PatientDepositsObj = angular.copy($scope.GetPatientDepositsObj());
        if (item.PatientId === 0) {
            alertify.error("Please Select Patient ");
            return;
        }
        $scope.IsPaymentMode = true;

        var filteredPaymodeList = (item.PatientDepositPaymodeList || []).filter(function (sitem) {
            return sitem.PaymentMethodId !== 15;
        });

        var Parentobj = {
            "PatientId": item.PatientId,
            "AppointmentId": item.AppointmentID,
            "PatientFirstName": $scope.PatientDetails.FirstName,
            "PatientLastName": $scope.PatientDetails.LastName,
            "PatientDisplayId": $scope.PatientDetails.PatientDisplayId,
            "PatientEmailId": $scope.PatientDetails.EmailId,
            "PatientGender": $scope.PatientDetails.Gender,
            "PatientAgeInYears": $scope.PatientDetails.AgeInYears,
            "PatientAgeInMonths": $scope.PatientDetails.AgeInMonths,
            "PatientDOB": $scope.PatientDetails.DOB,
            "PatientMobileNumber": $scope.PatientDetails.MobileNo,
            "PatientZipCode": $scope.PatientDetails.ZipCode,
            "UserId": $scope.UserId,
            "HospitalId": item.OrganizationId || 0,
            "PaymentAmount": item.DepositAmount,
            "DepositAmount": item.DepositAmount,
            "DepositDate": item.DepositDate,
            "PaymentModeId": item.PaymentMethodId || 0,
            "PaymentMode": item.PaymentMethodName || "",
            "ReceiptNo": item.ReceiptNo || "",
            "PaymentTypeId": 1,
            "PaymentType": "Deposit",
            "ScreenType": "AddDeposit",
            "AllCardTypes": $scope.AllCardTypes,
            "BillingProviderId": item.BillingProviderId || 0,
            "IsDepositPrint": false,// $scope.PatientDepositsObj.IsDepositPrint,
            "PatientDataObj": $scope.SelectedPatientDetails.PatientObj || {},
            "PatientDepositsObj": $scope.PatientDepositsObj || {},
            "DepositTypeId": item.DepositTypeId,
            "DepositType": item.DepositTypeName,
            "Notes": item.Notes,
            "DepositscreenTypeId": 2,
            "EditOverAllBool": true,
            "PatientClaimId": $scope.mainPatientProfileObj.PatientClaimId || null,
            "mainBillerDataObj": $scope.mainBillerDataObj || {},
            "IsPaymentMode": $scope.IsPaymentMode,
            "DepositTypes": $scope.DepositTypes,
            "PatientDepositId": item.PatientDepositId,
            "PatientDepositPaymodeList": filteredPaymodeList || [],
            "RenderingProviderId": item.RenderingProviderId,
            "RenderingProviderName": item.RenderingProviderName,
            "TransactionCategoryId": 1,
            "TransactionCategoryName": "Deposit",

        }
        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/collectPayment.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            "resolve": {
                "Parentobj": function () { return Parentobj; }
            },
            "windowClass": "modal__ninetyfive--",

            "controller": "UsMainNmiPaymentCtrl",
        });
        $scope.mInstanceAdd.result.then(function (resp) {
            console.log(resp);
            if (resp != undefined) {
                if (resp.Status === "Success") {

                    $scope.SelectedPatientDetails.DepositsObj = angular.copy($scope.PatientDepositsObj) || "";
                    $scope.SelectedPatientDetails.DepositsObj.IsDepositPrint = resp.IsDepositPrint || false;
                    if ($scope.SelectedPatientDetails.DepositsObj.IsDepositPrint == true) {
                        $scope.SelectedPatientDetails.DepositsObj.ReceiptNo = resp.ReceiptNo || '';
                        $scope.SelectedPatientDetails.DepositsObj.CreatedBy = resp.CreatedBy || '';
                        $scope.SelectedPatientDetails.DepositsObj.BillingProviderName = resp.BillingProviderName || '';
                        $scope.SelectedPatientDetails.DepositsObj.PatientDepositPaymodeList = resp.PatientDepositPaymodeList || [];
                        /*  $scope.AddDespositePrint($scope.SelectedPatientDetails.DepositsObj, $scope.SelectedPatientDetails.PatientObj, 1);*/
                        $scope.AddTransactionPrint(resp);
                    } else {

                    }

                    $scope.PatientDepositsObj = angular.copy($scope.GetPatientDepositsObj());
                   /* $scope.SearchObj = angular.copy($scope.getSearchObj());*/
                    $scope.PaymentMethodObj = angular.copy($scope.GetPaymentmethodList());


                    //$scope.SelectedPatientDetails.PatientObj = "";
                    $scope.SelectedPatientDetails.DepositsObj = "";

                    //if (Selectobj.Allocate == 4) {
                    //    $scope.ViewDepositScreen = true;
                    //} else {
                    //    $scope.ViewDepositScreen = false;
                    //}
                    $scope.showNotes = false;
                }
            }
            $scope.IsPaymentMode = false;
            $scope.getPatientDepositAmountById();
            $scope.GetPatientTotalRevenueBalance();
        }, function (cancel) {
        });
    };

    $scope.openTransmissionAccordianItem = function (titem, item) {
        const isCurrentlyOpen = titem.isOpen;
        item.TransmissionHistoryList.forEach(subItem => {
            subItem.isOpen = false;
        });
        titem.isOpen = !isCurrentlyOpen;
    };
    $scope.SearchDeleteClaimReqObj = {
        "FromDate": $filter('date')(new Date(), "MM-dd-yyyy"),
        "ToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
        "PageSize": 10,
        "PageNumber": 1,
        "Count": 0,
    }
    $scope.DeletedClaimsList = [];

    $scope.onDeletedClaimsPageChange = function (page) {
        $scope.DeleteClaimsHistoryList(page);
    };
    $scope.DeleteClaimsHistoryList = function (pageNo) {
        $scope.SearchDeleteClaimReqObj.PageNumber = pageNo || 1;
        var object = {
            "HospitalId": $scope.HospitalId,
            "FromDate": "",
            "ToDate": "",
            "PatientId": $scope.mainPatientProfileObj.PatientId || 0,
            "PageSize": $scope.SearchDeleteClaimReqObj.PageSize,
            "PageNumber": $scope.SearchDeleteClaimReqObj.PageNumber,
            "SortColumn": 'DOS',
            "SortOrder": 'DESC'

        }
        eHnoteInsuranceService.DeletePatientClaimHistory(object).then(function (resp) {

            if (resp.data.status == "Success") {
                $scope.DeletedClaimsList = resp.data.rows;
                $scope.SearchDeleteClaimReqObj.Count = resp.data.count;
            }
        });
    }

    $scope.ResetDeletedClaims = function () {

        $scope.SearchDeleteClaimReqObj.FromDate = "",
            $scope.SearchDeleteClaimReqObj.ToDate = "",
            $scope.DeleteClaimsHistoryList();

    };
    $scope.Opento277AcknowledgementPrint = function (item) {

        var printDate = $filter("date")(new Date(), "MMM-dd-yyyy");
        var printTime = moment(new Date()).format("HH:mm");
        $scope.AckPrintedDatenTime = printDate + ',  ' + printTime;
        var insurance = ($scope.AppointmentInsuranceList || [])[0]|| ($scope.mainPatientProfileObj.patientInsuranceTpasArray || [])[0]|| {};
        $scope.AckPrintDetails = {
            "CreatedDt": item.CreatedDt,
            "CreatedTime": item.CreatedTime,
            "FileName": item.FileName,
            "BillingProvider": $scope.ClaimDetails.RenderingProviderFirstName + ' ' + $scope.ClaimDetails.RenderingProviderLastName + '-' + $scope.ClaimDetails.RenderingProviderNPI,
            "PayerName": insurance.PayorName,
            "CreatedByUserName": item.CreatedByUserName,
            "Action": item.Notes,
            "rows": []
        };

        let obj = {
            'PatientClaimId': item.PatientClaimId || '',
            'TransactionId': item.TransactionId || '',
        }

        eHnoteInsuranceService.Get277AcknowledgementsRespons(obj).then(function (resp) {

            console.log(resp);
            if (resp.data.Status == 'Success') {
                $scope.AckPrintDetails.rows = resp.data.rows || [];
                $scope.AckPrintDetails.ClearingHouseName = resp.data.rows[0].ClearingHouseName || "";
                if ($scope.AckPrintDetails.rows.length > 0) {
                    angular.forEach($scope.AckPrintDetails.rows, function (item) {
                        item.ICNNum = "";
                        if (item.PayerClaimNumber != null) {
                            item.ICNNum = "/" + item.PayerClaimNumber;
                        }

                    })
                }
            }

            $timeout(function () {
                var innerContents = document.getElementById('277Acknowledgement_print').innerHTML;
                var popupWinindow = window.open('scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                popupWinindow.document.open();
                popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()" class="bodyheightprint">' + innerContents + '</body></html>');
                popupWinindow.document.close();
            }, 1000);
        }, function () {
            alertify.error("Error loading report");
        });
    }
    $scope.DisableDenailAppeal = {
        "AppealReason": true,
        "RequestTypeId": true,
        "ServiceDate": true,
        "RequestDate": true
    }
    $scope.Adjustmentrequest = function () {
        var obj = {
            "DenialReconsiderationHeaderId": 0,
            "PatientClaimId": 0,
            "PatientClaimNumber": "",
            "PayorId": 0,
            "PayorName": "",
            "RequestTypeId": 0,
            "RequestType": "",
            "RequestStatusId": 0,
            "RequestStatus": "",
            "DenialSourceId": 0,
            "DenialSource": "",
            "RequestedDate": "",
            "RequestedByUserId": $scope.UserId,
            "RequestRemarks": "",
            "TotalAppealedAmount": 0,
            PatientDetails: {
                "PatientId": 0,
                "PatientName": "",
                "MRNo": "",
                "Gender": ""
            },
            "ClaimLineitems": []
        };

        return obj;
    };
    $scope.OpentoDenialAppealConfigPrintNew = function (id) {
        var request = {
            "DenialReconsiderationHeaderlogId": id
        }
        eHnoteMainAppointmentService.GetClaimAdjustmentRequestPrintDetails(request).then(function (resp) {
            console.log(resp);
            if (resp.data.Status === "Success") {
                var row = resp.data.rows;

                if (row && Object.keys(row).length > 0) {
                    row.LanguageId = $scope.selectedLanguageId || 0;
                    $scope.DeniedServiceLines = resp.data.rows.ClaimLineitems || [];
                    if (resp.data.rows.ClaimLineitems) {
                        resp.data.rows.ClaimLineitems = resp.data.rows.ClaimLineitems.filter(item => !item.IsUnappealable);
                    }
                    $scope.Denail = $scope.Adjustmentrequest();
                    if (resp.data.rows.AppointmentInsuranceDetails.length > 0) {
                        $scope.Denail.Address1 = resp.data.rows.AppointmentInsuranceDetails[0].PayorAddress1 || "";
                        $scope.Denail.Address2 = resp.data.rows.AppointmentInsuranceDetails[0].PayorAddress2 || "";
                        $scope.Denail.PayorCityName = resp.data.rows.AppointmentInsuranceDetails[0].PayerCity || "";
                        $scope.Denail.PayorStateName = resp.data.rows.AppointmentInsuranceDetails[0].PayerState || "";
                        $scope.Denail.PayorCountryName = resp.data.rows.AppointmentInsuranceDetails[0].PayorCountryName || "";
                        $scope.Denail.PayorZipCode = resp.data.rows.AppointmentInsuranceDetails[0].PayerZip || "";
                        $scope.Denail.PayorCode = resp.data.rows.AppointmentInsuranceDetails[0].PayorCode || "";
                        $scope.Denail.PayorStateCode = resp.data.rows.AppointmentInsuranceDetails[0].PayorStateCode || "";
                        $scope.Denail.UserTaxonomyCode = resp.data.rows.AppointmentInsuranceDetails[0].UserTaxonomyCode || "";
                        $scope.Denail.DoctorName = resp.data.rows.AppointmentInsuranceDetails[0].DoctorName || "";
                        $scope.Denail.RelationName = resp.data.rows.AppointmentInsuranceDetails[0].RelationName || "";

                        $scope.Denail.AppointmentDate = $filter('date')(resp.data.rows.AppointmentInsuranceDetails[0].AppointmentDate, 'MM-dd-yyyy') || "";
                        $scope.Denail.InsuranceTypeCode = resp.data.rows.AppointmentInsuranceDetails[0].InsuranceTypeCode || "";
                        $scope.Denail.PayorId = resp.data.rows.AppointmentInsuranceDetails[0].PayorId || "";
                        $scope.Denail.GlobalPayorId = resp.data.rows.AppointmentInsuranceDetails[0].GlobalPayorId || "";
                        $scope.Denail.PayorName = resp.data.rows.AppointmentInsuranceDetails[0].PayorName || "";
                        $scope.Denail.PlanName = resp.data.rows.AppointmentInsuranceDetails[0].PlanName || "";
                        $scope.Denail.RelationShipId = resp.data.rows.AppointmentInsuranceDetails[0].RelationShipId || "";
                    }
                    console.log($scope.Denail.PlanName);
                    angular.forEach($scope.DeniedServiceLines, function (item) {
                        $scope.DOSfrom = item.DOSfrom
                    });
                    $scope.Denail.DenialReconsiderationHeaderId = row.DenialReconsiderationHeaderId;
                    $scope.Denail.PatientClaimId = row.PatientClaimId;
                    $scope.Denail.PatientClaimNumber = row.PatientClaimNumber;
                    $scope.Denail.RequestTypeId = row.RequestTypeId;
                    $scope.Denail.RequestType = row.RequestType;
                    $scope.Denail.RequestStatusId = row.RequestStatusId;
                    $scope.Denail.RequestStatus = row.RequestStatus;
                    $scope.Denail.DenialSourceId = row.DenialSourceId;
                    $scope.Denail.DenialSource = row.DenialSource;
                    $scope.Denail.RequestedDate = row.RequestedDate;
                    $scope.Denail.RequestedByUserId = row.RequestedByUserId;
                    $scope.Denail.RequestRemarks = row.RequestRemarks;
                    $scope.Denail.TotalAppealedAmount = row.TotalAppealedAmount;
                    $scope.Denail.RenderingProviderName = row.RenderingProviderName;
                    $scope.Denail.OrganizationAddress1 = row.OrganizationAddress1;
                    $scope.Denail.OrganizationAddress2 = row.OrganizationAddress2;
                    $scope.Denail.OrganizationCity = row.OrganizationCity;
                    $scope.Denail.OrganizationName = row.OrganizationName;
                    $scope.Denail.OrganizationState = row.OrganizationState;
                    $scope.Denail.OrganizationZipCode = row.OrganizationZipCode;
                    $scope.Denail.Country = row.Country;
                    $scope.Denail.TINNo = row.TINNo
                    var obj = eHnoteUserDataService.UsMobileFormatChange(row.MobileNo);
                    $scope.Denail.MobileNo = obj.UsFormatMobileNumber;
                    $scope.Denail.UserName = row.UserName;
                    $scope.Denail.NPI = row.NPI;
                    $scope.Denail.FaxNo = row.FaxNo;
                    $scope.Denail.PayerClaimControlNumber = row.PayerClaimControlNumber;
                    $scope.Denail.SignatureOfUser = row.SignatureOfUser
                    if ($scope.Denail.SignatureOfUser && !$scope.Denail.SignatureOfUser.startsWith('data:image')) {
                        $scope.Denail.SignatureOfUser = 'data:image/png;base64,' + $scope.Denail.SignatureOfUser;
                    }
                    $scope.trustedSignature = $sce.trustAsResourceUrl($scope.Denail.SignatureOfUser);
                    var patient = (row.AppointmentInsuranceDetails || [])[0] || {};
                    $scope.Denail.PatientDetails = {
                        PatientId: patient.PatientId,
                        PatientName: patient.PatientName,
                        MRNo: patient.PatientMrNo,
                        Gender: patient.PatientGender,
                        Age: patient.PatientAgeInYear
                    };

                    //angular.forEach(resp.data.rows.ClaimLineitems, function (citem, index) {
                    //    var Tcount = 0;
                    //    angular.forEach(citem.ServiceAdjustments, function (sitem) {
                    //        if (sitem.PayorPostingStatusId == 2) {
                    //            Tcount++;
                    //        }
                    //    });
                    //    var insurancePayment = parseFloat(citem.InsurancePayment) || 0;
                    //    var patientResponsibility = parseFloat(citem.PatientResponsibilityAmount) || 0;
                    //    var unitCharge = parseFloat(citem.UnitCharge) || 0;

                    //    if (Tcount > 0 && unitCharge === (insurancePayment + patientResponsibility)) {
                    //        resp.data.rows.ClaimLineitems.splice(index, 1);
                    //    }
                    //});


                    if (row.RequestTypeId === 1) {

                        eHnoteMainAppointmentService.GenerateAdjustmentRequestPdf(row)
                            .then(openPdf);
                        $scope.DisableDenailAppeal.AppealReason = true;
                        $scope.DisableDenailAppeal.RequestTypeId = true;
                        $scope.DisableDenailAppeal.ServiceDate = true;
                        $scope.DisableDenailAppeal.RequestDate = true;
                    } else if (row.RequestTypeId === 3) {
                        eHnoteMainAppointmentService.GenerateTripleSAdvantageAdjustment(row)
                            .then(openPdf);
                        $scope.DisableDenailAppeal.AppealReason = true;
                        $scope.DisableDenailAppeal.RequestTypeId = true;
                        $scope.DisableDenailAppeal.ServiceDate = true;
                        $scope.DisableDenailAppeal.RequestDate = true;
                    } else if (row.RequestTypeId === 4) {
                        eHnoteMainAppointmentService.GenerateMcsResubmittedClaimsPdf(row)
                            .then(openPdf);
                        $scope.DisableDenailAppeal.AppealReason = true;
                        $scope.DisableDenailAppeal.RequestTypeId = true;
                        $scope.DisableDenailAppeal.ServiceDate = true;
                        $scope.DisableDenailAppeal.RequestDate = true;
                    } else if (row.RequestTypeId === 5) {
                        eHnoteMainAppointmentService.GenerateMmmAdjustmentPdf(row)
                            .then(openPdf);
                        $scope.DisableDenailAppeal.AppealReason = true;
                        $scope.DisableDenailAppeal.RequestTypeId = true;
                        $scope.DisableDenailAppeal.ServiceDate = true;
                        $scope.DisableDenailAppeal.RequestDate = true;
                    } else if (row.RequestTypeId === 6) {
                        eHnoteMainAppointmentService.GenerateMsoInternalAdjustmentPdf(row)
                            .then(openPdf);
                        $scope.DisableDenailAppeal.AppealReason = true;
                        $scope.DisableDenailAppeal.RequestTypeId = true;
                        $scope.DisableDenailAppeal.ServiceDate = true;
                        $scope.DisableDenailAppeal.RequestDate = true;
                    } else if (row.RequestTypeId === 7) {
                        eHnoteMainAppointmentService.GenerateMedicareAdjustmentPdf(row)
                            .then(openPdf);
                        $scope.DisableDenailAppeal.AppealReason = true;
                        $scope.DisableDenailAppeal.RequestTypeId = true;
                        $scope.DisableDenailAppeal.ServiceDate = true;
                        $scope.DisableDenailAppeal.RequestDate = true;
                    } else if (row.RequestTypeId === 8) {
                        eHnoteMainAppointmentService.GenerateMapfreAdjustmentPdf(row)
                            .then(openPdf);
                        $scope.DisableDenailAppeal.AppealReason = true;
                        $scope.DisableDenailAppeal.RequestTypeId = true;
                        $scope.DisableDenailAppeal.ServiceDate = true;
                        $scope.DisableDenailAppeal.RequestDate = true;
                    } else {
                        eHnoteMainAppointmentService.GenerateTripleSProfessionalAdjustment(row)
                            .then(openPdf);
                        $scope.DisableDenailAppeal.AppealReason = true;
                        $scope.DisableDenailAppeal.RequestTypeId = true;
                        $scope.DisableDenailAppeal.ServiceDate = true;
                        $scope.DisableDenailAppeal.RequestDate = true;
                    }
                }


            }
            else {
                console.log('print failed');
            }
        });
    }

    $scope.Opento999AcknowledgementPrint = function (item) {

        var printDate = $filter("date")(new Date(), "MMM-dd-yyyy");
        var printTime = moment(new Date()).format("HH:mm");
        $scope.AckPrintedDatenTime = printDate + ',  ' + printTime;
        var insurance = ($scope.AppointmentInsuranceList || [])[0]|| ($scope.mainPatientProfileObj.patientInsuranceTpasArray || [])[0]|| {};
        $scope.Ack999PrintDetails = {
            "EventDate": item.EventDate,
            "CreatedDt": item.CreatedDt,
            "CreatedTime": item.CreatedTime,
            "FileName": item.FileName,
            "BillingProvider": $scope.ClaimDetails.RenderingProviderFirstName + ' ' + $scope.ClaimDetails.RenderingProviderLastName + '-' + $scope.ClaimDetails.RenderingProviderNPI,
            "PayerName": insurance.PayorName,
            "CreatedByUserName": item.CreatedByUserName,
            "Action": item.Notes,
            "rows": []
        };

        let obj = {
            'PatientClaimId': item.PatientClaimId || '',
            'TransactionId': item.TransactionSetId || '',
        }

        eHnoteInsuranceService.Get999AcknowledgementsRespons(obj).then(function (resp) {

            console.log(resp);
            if (resp.data.Status == 'Success') {
                $scope.Ack999PrintDetails.rows = resp.data.rows || [];
                $scope.Ack999PrintDetails.ClearingHouseName = resp.data.rows[0].ClearingHouseName || "";
            }

            $timeout(function () {
                var innerContents = document.getElementById('999Acknowledgement_print').innerHTML;
                var popupWinindow = window.open('scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                popupWinindow.document.open();
                popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()" class="bodyheightprint">' + innerContents + '</body></html>');
                popupWinindow.document.close();
            }, 1000);
        }, function () {
            alertify.error("Error loading report");
        });
    }

    $scope.navtoPrintClaimsEOB = function (item) {

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
                    var innerContents = document.getElementById('ERAClaimprint').innerHTML;
                    var popupWinindow = window.open('scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                    popupWinindow.document.open();
                    popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()" class="bodyheightprint">' + innerContents + '</body></html>');
                    popupWinindow.document.close();
                }, 500);
            }
        });
    }
    $scope.CloseEdiPreview = function (item) {
        item.showEdiPreview = false;
    };
    $scope.OpenEdiPreview = function (item) {

        item.showEdiPreview = true;

        eHnoteInsuranceService.GetEDIBlobUrl(item)
            .then(function (resp) {

                console.log(resp);

                if (resp.data.Status === "Success" && resp.data.Url) {

                    $scope.EDIUrl = resp.data.Url;

                    fetch($scope.EDIUrl)
                        .then(function (res) {

                            console.log("Status:", res.status);

                            if (!res.ok) {
                                throw new Error("HTTP Error: " + res.status);
                            }

                            return res.text();
                        })
                        .then(function (text) {

                            console.log("EDI Content:", text);
                            function formatEdiString(ediString) {
                                if (!ediString) return 'No EDI content available';
                                return ediString.replace(/~/g, '~\n');
                            }
                            $scope.$apply(function () {
                                $scope.EdiANSIStringview = formatEdiString(text);
                            });
                        })
                        .catch(function (error) {

                            console.log("Fetch Error:", error);

                            $scope.$apply(function () {
                                $scope.EdiANSIStringview = 'Failed to load EDI content';
                            });
                        });

                } else {

                    $scope.EdiANSIStringview = 'No EDI content available';
                }
            },
                function (error) {

                    console.log("API Error:", error);

                    $scope.EdiANSIStringview = 'No EDI content available';
                });
    };

    $scope.EDIFiledownload = function (formattedEdi) {

        if (!formattedEdi) {
            alertify.error("No EDI data available");
            return;
        }

        const rawEdi = formattedEdi.replace(/\n/g, '');

        eHnotePatientDataService.CreateEdiFileDownloadTextPdf(rawEdi)
            .then(function (response) {

                const fileUrl = response.data;

                fetch(fileUrl)
                    .then(res => res.blob())
                    .then(blob => {

                        const blobUrl = window.URL.createObjectURL(blob);

                        const a = document.createElement('a');
                        a.href = blobUrl;

                        const filename =
                            ($scope.EdiItemData?.PatientFullName || 'EDI') + '_' +
                            ($scope.EdiItemData?.PatientClaimNumber || '837') + '.837';

                        a.download = filename;

                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);

                        window.URL.revokeObjectURL(blobUrl);
                    });

            })
            .catch(function (error) {
                alertify.error("Failed to generate .837 file.");
                console.error(error);
            });
    };



    // ── Sub-tab inside Pending Payments (for future Invoices addition) ──
    $scope.PendingPaymentsSubtab = 1;   // 1 = TextToPay, 2 = Invoices (future)

    // ── State variables ─────────────────────────────────────────────────
    $scope.PatientConversationsListArray = [];

    $scope.ConversationListObj = {
        PageNumber: 1,
        PageSize: 50,
        Count: 0
    };

    $scope.ConversationFilter = {
        Status: ""   // "", Pending, Paid, Expired, Cancelled
    };

    $scope.PendingConversationCount = 0;
    $scope.IsSyncingStatuses = false;
    $scope.LastSyncedAt = null;

 

    $scope.GetPatientConversationList = function (pageno) {

        $scope.ConversationListObj.PageNumber = pageno || 1;

        var obj = {
            OrganizationId: $scope.HospitalId,
            NMIMerchantId: 0,
            PatientId: $scope.mainPatientProfileObj.PatientId,
            Status: $scope.ConversationFilter.Status || "",
            PageNumber: $scope.ConversationListObj.PageNumber,
            PageSize: $scope.ConversationListObj.PageSize
        };

        console.log("Conversation List Request:", JSON.stringify(obj));

        eHnotePatientDataService.GetPatientTextToPayConversationList(obj).then(function (resp) {

            if (resp.data && resp.data.status == "Success") {
                $scope.PatientConversationsListArray = resp.data.rows || [];
                $scope.ConversationListObj.Count = resp.data.count || 0;

                // Update pending counter for tab badge
                $scope.PendingConversationCount =
                    $scope.PatientConversationsListArray
                        .filter(function (i) { return i.PaymentStatus === 'Pending'; })
                        .length;

                // Default expanded state
                angular.forEach($scope.PatientConversationsListArray, function (c) {
                    c.IsShowDetails = false;
                });
            } else {
                $scope.PatientConversationsListArray = [];
                $scope.ConversationListObj.Count = 0;
                $scope.PendingConversationCount = 0;

                if (resp.data && resp.data.Message) {
                    alertify.error(resp.data.Message);
                }
            }
        });
    };


    // ── Bulk sync — pull latest from NMI for all conversations ─────────
    $scope.GetPatientLatestTextToPayConversationList = function () {

        if ($scope.IsSyncingStatuses) {
            return;  // prevent double-fire
        }

        $scope.IsSyncingStatuses = true;

        var obj = {
            UserId: $scope.UserId,
            OrganizationId: $scope.HospitalId,
            PatientId: $scope.mainPatientProfileObj.PatientId,
            StartDate: moment().subtract(30, 'days').format('YYYY-MM-DD'),
            EndDate: moment().format('YYYY-MM-DD'),
            Statuses: ["in progress", "completed", "expired"]
        };

        eHnotePatientDataService.GetListofTextToPayConversations(obj).then(function (resp) {

            console.log("Bulk sync response:", JSON.stringify(resp));
            $scope.IsSyncingStatuses = false;

            var res = resp.data || {};

            if (res.Status === "Success") {
                $scope.LastSyncedAt = new Date();
                alertify.success("Statuses refreshed from NMI");

                // Reload the list from our DB — the backend already updated rows during the NMI call
               // $scope.GetPatientConversationList($scope.ConversationListObj.PageNumber);
                $scope.GetPatientPendingPaymentsList($scope.ConversationListObj.PageNumber);
            } else {
                alertify.error(res.Message || "Failed to refresh statuses");
            }
        }, function (err) {
            $scope.IsSyncingStatuses = false;
            console.error("Status sync error:", err);
            alertify.error("Failed to refresh statuses. Please try again.");
        });
    };


    // ── Expand / collapse the instructions row for a single item ───────
    $scope.ShowConversationDetails = function (item) {
        item.IsShowDetails = !item.IsShowDetails;
    };


    // ── Refresh single conversation status from NMI ────────────────────
    $scope.GetParticularTextToPayConversationLatestStatus = function (item) {

        var obj = {
            ConversationId: item.ConversationId,
            OrganizationId: $scope.HospitalId,
            UserId: $scope.UserId,
            MerchantId: ""
        };

        eHnotePatientDataService.GetParticularTextToPayConversation(obj).then(function (resp) {
            if ((resp.data || {}).Status === "Success") {
                alertify.success("Status refreshed");
                //$scope.GetPatientConversationList($scope.ConversationListObj.PageNumber);
                $scope.GetPatientPendingPaymentsList($scope.ConversationListObj.PageNumber);
            } else {
                alertify.error("Unable to refresh status");
            }
        });
    };


    // ── Close (cancel) a pending conversation ──────────────────────────
    $scope.CancelTextToPayConversation = function (item) {

        var confirmMsg =
            "Close this TextToPay request?\n\n" +
            "Patient: " + item.PatientFirstName + " " + item.PatientLastName + "\n" +
            "Amount: $" + (item.Amount || 0) + "\n" +
            "Mobile: " + item.PhoneNumber + "\n\n" +
            "The patient won't be able to pay using this link anymore.";

        if (!confirm(confirmMsg)) return;

        if (item.IsClosing) return;
        item.IsClosing = true;

        var obj = {
            ConversationId: item.ConversationId,
            OrganizationId: $scope.HospitalId,
            UserId: $scope.UserId
        };

        eHnotePatientDataService.CloseTextToPayConversation(obj).then(function (resp) {
            item.IsClosing = false;
            var res = resp.data || {};

            if (res.Status === "Success" || res.status === "Success") {
                alertify.success("Conversation closed");

                // Reload the list — UI will reflect the new Cancelled status
                //$scope.GetPatientConversationList($scope.ConversationListObj.PageNumber);
                $scope.GetPatientPendingPaymentsList($scope.ConversationListObj.PageNumber);
            } else {
                alertify.error(res.Message || res.message || "Unable to close conversation");
            }
        });
    };


    // ── Navigate from a Paid conversation to its linked deposit row ────
    $scope.NavigateToDepositRow = function (depositId) {

        if (!depositId || depositId <= 0) {
            alertify.error("No linked deposit found");
            return;
        }

        // Switch back to Deposits tab
        $scope.SubtabsChanges = 1;

        // Refresh the deposits list (financial screen's existing method)
        if (typeof $scope.getPatientDepositAmountById === 'function') {
            $scope.getPatientDepositAmountById();
        } else if (typeof $scope.GetPatientDepositsList === 'function') {
            $scope.GetPatientDepositsList(1);
        }

        // Scroll and highlight the deposit row after a small delay
        setTimeout(function () {
            var depositRow = document.querySelector('[data-deposit-id="' + depositId + '"]');
            if (depositRow) {
                depositRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
                depositRow.classList.add('highlight-pulse');
                setTimeout(function () {
                    depositRow.classList.remove('highlight-pulse');
                }, 2000);
            }
        }, 300);
    };


    $scope.GetCancelPaymentEOBDetails = function (item) {
        var obj = {
            "PatientId": item.PatientId,
            "PatientDepositId": item.PatientDepositId,
            "TransactionId": item.TransactionId
        };

        eHnoteInsuranceService.GetCancelPaymentEOBDetails(obj).then(function (resp) {
            if (resp.data.status === "Success") {
                if (resp.data.rows.length > 0) {

                    item.EOBClaimInfoId = resp.data.rows[0].EOBClaimInfoId || 0;
                    item.PatientClaimId = resp.data.rows[0].PatientClaimId || 0;
                    item.OrganizationId = resp.data.rows[0].OrganizationId || 0;
                    item.OrganizationBillingProviderId = resp.data.rows[0].OrganizationBillingProviderId || 0;
                    item.EOBId = resp.data.rows[0].EOBId || 0;
                    item.PatientId = resp.data.rows[0].PatientId || 0;
                    item.ReferenceNumber = resp.data.rows[0].ReferenceNumber || '';

                    item.EOBClaimInfo = Array.isArray(resp.data.rows[0].EOBClaimInfo)
                        ? resp.data.rows[0].EOBClaimInfo
                        : [];

                    // OPEN POPUP
                    OpenCancelPaymentPopup(item);
                }

            } else {
                alertify.error(resp.data.Message);
            }
        });
    }

    function OpenCancelPaymentPopup(item) {

        var mInstanceAdd = $uibModal.open({
            "templateUrl": "PaymentVoidReasonPopUp.html",
            "size": "sm",
            "backdrop": "static",
            "keyboard": false,
            "windowClass": " ",
            "resolve": {
                "sitem": function () { return item; },
                "UserId": function () { return $scope.UserId; },
                "HospitalId": function () { return $scope.HospitalId; },

            },
            "controller": function ($scope, $uibModal, $uibModalInstance, sitem, UserId, HospitalId) {
                sitem = sitem || '';
                $scope.uibclose = function () {
                    $uibModalInstance.close("cancel");
                }

                $scope.HospitalId = HospitalId;
                $scope.UserId = UserId;

                $scope.mainNMITransactionid = "";
                if (sitem.NMITransactionId !== 0) {
                    $scope.mainNMITransactionid = sitem.OnlineTransactionNumber || "";
                }
                $scope.VoidPatientObj = {
                    "VoidRemarks": '',
                }


                $scope.SaveOnlineVoidPaymentData = function () {
                    $scope.VoidPatientObj.VoidRemarks = $scope.VoidPatientObj.VoidRemarks || "";
                    if ($scope.VoidPatientObj.VoidRemarks == '') {
                        alertify.error("Please enter Remarks.");
                        return false;
                    }

                    if ($scope.mainNMITransactionid == "") {
                        alertify.error("you cannot perform void, as TransactionId is empty");
                        return false;
                    }

                    $scope.mainNMITransactionObj = angular.copy(eHnoteCacheStorageService.getNMITransactionMainObject());
                    $scope.mainNMITransactionObj.NMITransactionId = 0;
                    $scope.mainNMITransactionObj.UserId = UserId;
                    $scope.mainNMITransactionObj.PatientId = sitem.PatientId;
                    $scope.mainNMITransactionObj.OrganizationId = sitem.OrganizationId;
                    $scope.mainNMITransactionObj.PaymentAmount = sitem.TotalPatientPayment;
                    $scope.mainNMITransactionObj.MerchentId = "";
                    $scope.mainNMITransactionObj.MerchentName = "ehnotesandbox";
                    $scope.mainNMITransactionObj.CardHolderName = sitem.PatientFullName || "";
                    $scope.mainNMITransactionObj.PatientEmail = sitem.PatientEmailId || "";
                    $scope.mainNMITransactionObj.PatientMobile = sitem.PatientMobile || "";

                    if ($scope.mainNMITransactionObj.PatientMobile != "") {
                        var obj = eHnoteUserDataService.UsMobileFormatChange($scope.mainNMITransactionObj.PatientMobile);
                        $scope.mainNMITransactionObj.PatientMobile = obj.UsFormatMobileNumber;
                    }

                    $scope.mainNMITransactionObj.PatientMrNo = sitem.PatientDisplayId || "";
                    $scope.mainNMITransactionObj.OrderId = "";
                    $scope.mainNMITransactionObj.OrderDescription = $scope.VoidPatientObj.VoidRemarks || "";
                    $scope.mainNMITransactionObj.TransactionId = $scope.mainNMITransactionid;
                    $scope.mainNMITransactionObj.BillPaymentTypeId = sitem.BillPaymentTypeId || 0;
                    $scope.mainNMITransactionObj.BillPaymentType = sitem.BillPaymentType || "";
                    $scope.mainNMITransactionObj.ResponseId = 0;
                    $scope.mainNMITransactionObj.ResponseCode = "";
                    $scope.mainNMITransactionObj.ResponseText = "";
                    $scope.mainNMITransactionObj.Status = "";
                    $scope.mainNMITransactionObj.TransactionTypeId = 4;
                    $scope.mainNMITransactionObj.TransactionType = "void";
                    $scope.mainNMITransactionObj.DeleteInd = "N";
                    $scope.mainNMITransactionObj.Type = "void";
                    $scope.mainNMITransactionObj.AppointmentId = sitem.AppointmentId || 0;
                    $scope.mainNMITransactionObj.VisitId = sitem.VisitId || 0;


                    eHnotePaymentGatewayService.NMIPaymentTransactionVoid($scope.mainNMITransactionObj).then(function (resp) {
                        console.log(resp.data);

                        var res = resp.data || {};
                        if (res.Status == "Success") {
                            alertify.success(res.responseText);

                            $scope.SavePatientVoidPayment();
                        }
                    })

                };


                $scope.SavePatientVoidPayment = function () {
                    if ($scope.VoidPatientObj.VoidRemarks == '') {
                        alertify.error("Please enter Remarks.");
                        return false;
                    }
                    let ClaimTransactions = [];
                    $scope.TotalTransactionAmount = 0;

                    angular.forEach(item.EOBClaimInfo, function (pitem) {

                        angular.forEach(pitem.EOBClaimLineItems, function (titem) {
                            if (titem.PatientWriteOffAmount != 0) {
                                let obj3 = {
                                    "ClaimTransactionId": 0,
                                    "PatientDepositId": 0,
                                    "EOBClaimInfoId": pitem.EOBClaimInfoId || 0,
                                    "PatientClaimId": titem.PatientClaimId || 0,
                                    "ClaimLineItemId": titem.ClaimLineItemId,
                                    "OrganizationId": $scope.HospitalId,
                                    "TransactionDate": $filter("date")(new Date(), "yyyy-MM-dd"),
                                    "TransactionAmount": titem.PatientWriteOffAmount,
                                    "PatientAmount": titem.PatientWriteOffAmount,
                                    "InsuranceAmount": 0,
                                    "ReferenceNumber": "",
                                    "TransactionTypeId": 103,
                                    "TransactionType": "WriteOff Reversal",
                                    "TransactionSourceId": 3,
                                    "TransactionSource": "Patient",
                                    "SettlementStatusId": 7,
                                    "SettlementStatus": "Cancel Payment",
                                    "TransactionNotes": $scope.VoidPatientObj.VoidRemarks || "",
                                    "EOBId": sitem.EOBId || 0,
                                }
                                ClaimTransactions.push(obj3);
                            }

                            if (titem.PaymentAmount != 0) {
                                let obj3 = {
                                    "ClaimTransactionId": 0,
                                    "PatientDepositId": 0,
                                    "EOBClaimInfoId": pitem.EOBClaimInfoId || 0,
                                    "PatientClaimId": titem.PatientClaimId || 0,
                                    "ClaimLineItemId": titem.ClaimLineItemId,
                                    "OrganizationId": $scope.HospitalId,
                                    "TransactionDate": $filter("date")(new Date(), "yyyy-MM-dd"),
                                    "TransactionAmount": titem.PaymentAmount,
                                    "PatientAmount": titem.PaymentAmount,
                                    "InsuranceAmount": 0,
                                    "ReferenceNumber": "",
                                    "TransactionTypeId": 101,
                                    "TransactionType": "Patient Payment Reversal",
                                    "TransactionSourceId": 3,
                                    "TransactionSource": "Patient",
                                    "SettlementStatusId": 7,
                                    "SettlementStatus": "Cancel Payment",
                                    "TransactionNotes": $scope.VoidPatientObj.VoidRemarks || "",
                                    "EOBId": sitem.EOBId || 0,
                                }
                                ClaimTransactions.push(obj3);
                            }

                        });

                    });

                    let obj = {
                        "EOBId": sitem.EOBId || 0,
                        "EOBClaimInfoId": sitem.EOBClaimInfoId || 0,
                        "BillingProviderId": sitem.OrganizationBillingProviderId || null,
                        "ClaimLineItemId": sitem.ClaimLineItemId,
                        "OrganizationId": sitem.OrganizationId,
                        "TransactionDate": $filter("date")(new Date(), "yyyy-MM-dd"),
                        "ReferenceNumber": sitem.ReferenceNumber,
                        "TransactionTypeId": "",
                        "TransactionType": "",
                        "TransactionSourceId": 3,
                        "TransactionSource": "Patient",
                        "SettlementStatusId": 7,
                        "SettlementStatus": "Cancel Payment",
                        "TransactionNotes": $scope.VoidPatientObj.VoidRemarks || "",
                        "UserId": $scope.UserId,
                        "PatientId": sitem.PatientId || null,
                        "PatientClaimId": sitem.PatientClaimId,
                        "ClaimTransactions": ClaimTransactions
                    }

                    console.log(JSON.stringify(obj))

                    eHnoteInsuranceService.UpdateVoidPatientPayment(obj).then(function (resp) {
                        console.log(resp);
                        if (resp.data.Status === "Success") {

                            $uibModalInstance.close(resp.data);
                            alertify.success("Payment cancelled successfully.")
                        } else {
                            alertify.error(resp.data.Message);
                        }
                    });
                }


            }
        });

        mInstanceAdd.result.then(function () {
            $scope.getPatientDepositAmountById();
            $scope.GetPatientPaymentsDetails();

        }, function () {
            $scope.getPatientDepositAmountById();
            $scope.GetPatientPaymentsDetails();
        });
    }

    $scope.ResetDepositFilter = function () {
        $scope.PatientDepositsObj.TransactionCategoryId = 0;
        $scope.getPatientDepositAmountById();
    }

    $scope.PatientPendingPaymentsArray = [];
    $scope.PendingFilter = { Source: "" };   // "", ACH, TextToPay

    $scope.GetPatientPendingPaymentsList = function (pageno) {
        $scope.ConversationListObj.PageNumber = pageno || 1;

        var obj = {
            OrganizationId: $scope.HospitalId,
            PatientId: $scope.mainPatientProfileObj.PatientId,
            Source: $scope.PendingFilter.Source || "",
            PageNumber: $scope.ConversationListObj.PageNumber,
            PageSize: $scope.ConversationListObj.PageSize
        };

        eHnotePatientDataService.GetPatientPendingNMIPaymentsList(obj).then(function (resp) {
            if (resp.data && resp.data.status == "Success") {
                $scope.PatientPendingPaymentsArray = resp.data.rows || [];
                $scope.ConversationListObj.Count = resp.data.count || 0;
                $scope.PendingConversationCount = $scope.PatientPendingPaymentsArray.length;

                angular.forEach($scope.PatientPendingPaymentsArray, function (c) {
                    c.IsShowDetails = false;
                });
            } else {
                $scope.PatientPendingPaymentsArray = [];
                $scope.ConversationListObj.Count = 0;
                $scope.PendingConversationCount = 0;
                if (resp.data && resp.data.Message) alertify.error(resp.data.Message);
            }
        });
    };
    $scope.CheckACHStatus = function (item) {
        if (!item.GatewayTransactionId) {
            alertify.error("No gateway transaction id to check.");
            return;
        }

        var params = {
            "TransactionId": item.GatewayTransactionId,
            "OrganizationId": $scope.HospitalId
        };
        eHnotePaymentGatewayService.GetNMITransactionStatusQuery(params)
            .then(function (resp) {
                var res = resp.data || {};

                if (res.Outcome === "Settled" || res.Outcome === "Returned") {
                    // status advanced -> the row left the pending list, reload
                    alertify.success(res.Message || "Status updated");
                } else if (res.Outcome === "Pending") {
                    // nothing changed -> don't reload, just inform
                    alertify.success("Latest status fetched — still pending settlement");
                } else {
                    alertify.success(res.Message || "Status Refreshed");
                }
                $scope.GetPatientPendingPaymentsList($scope.ConversationListObj.PageNumber);
            });
    };

    //$scope.ResetDepositFilter = function () {
    //    $scope.PatientDepositsObj.TransactionCategoryId = 1;
    //    $scope.getPatientDepositAmountById();
    //};
}]);



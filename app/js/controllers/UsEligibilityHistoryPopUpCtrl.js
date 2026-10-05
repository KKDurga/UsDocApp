
eHnoteWebApp.controller("UsEligibilityHistoryPopUpCtrl", ["$scope", "$rootScope", "eHnoteMasterDataService", "eHnotePatientAddressDataServices", "$filter", "alertify", "eHnoteLoginStatusService", "$uibModal", "eHnoteAuditServices", "eHnotePatientDataService", "eHnoteCacheStorageService", "datapersistanceFactory", "$location", "eHnoteDiagnosisDataServices", "$timeout", "eHnoteInsuranceService", "datacookieFactory", "localStorageFactory", "eHnoteReferalDataService", "eHnoteUserAppointmentDataService", "eHnoteMainAppointmentService", "eHnoteDbStaticDataService", "$q", "eHnoteSettingsDataService", "eHnoteOrgReferralDataServices", "loginCookieFactory", "DeCodeFilter", "Lightbox", "eHnoteProcedureDataService", "USPrintService", "eHnotePatientVisitReasonServices", "eHnoteSurgeryService", "$window", "eHnoteMainAdminServices", "eHnoteUserDataService", "eHnotePrintService", "$translate", "eHnoteUserAppointmentDataService", "$uibModal", "$uibModalInstance", "Selectobj","EligibilityObj", function ($scope, $rootScope, eHnoteMasterDataService, eHnotePatientAddressDataServices, $filter, alertify, eHnoteLoginStatusService, $uibModal, eHnoteAuditServices, eHnotePatientDataService, eHnoteCacheStorageService, datapersistanceFactory, $location, eHnoteDiagnosisDataServices, $timeout, eHnoteInsuranceService, datacookieFactory, localStorageFactory, eHnoteReferalDataService, eHnoteUserAppointmentDataService, eHnoteMainAppointmentService, eHnoteDbStaticDataService, $q, eHnoteSettingsDataService, eHnoteOrgReferralDataServices, loginCookieFactory, DeCodeFilter, Lightbox, eHnoteProcedureDataService, USPrintService, eHnotePatientVisitReasonServices, eHnoteSurgeryService, $window, eHnoteMainAdminServices, eHnoteUserDataService, eHnotePrintService, $translate, eHnoteUserAppointmentDataService, $uibModal, $uibModalInstance, Selectobj, EligibilityObj) {
    var doctorInfo = eHnoteMasterDataService.getUserInfo();
    $scope.UserId = eHnoteMasterDataService.getLoginId();
    $scope.SpecializationId = doctorInfo.doctordata.User[0].SpecializationId;
    $scope.ParenthospitalId = 0;

    $scope.defaultBillingProviderId = 0;
    if (doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
        $scope.HospitalCD = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
        $scope.ParenthospitalId = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        $scope.HospitalId = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        $scope.defaultBillingProviderId = doctorInfo.doctordata.UserAddress[0].DefaultBillingProviderId || 0;

    }
    $scope.ReverifyObj = EligibilityObj;
    $scope.Selectobj = Selectobj;

    $scope.InsuranceEligibiltyTab = '1';
    $scope.toDataURL = function (dataURL, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
                callback(reader.result);
            };
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', dataURL);
        xhr.responseType = 'blob';
        xhr.send();
    };

    $scope.loadOrganizationLogo = function () {

        $scope.OrganizationBase64LogoUrl = '';

        if (!$scope.InsuranceEligibilitySubscriberData ||
            !$scope.InsuranceEligibilitySubscriberData.length)
            return;

        var details = $scope.InsuranceEligibilitySubscriberData[0].OrganizationDetails;

        if (!details || !details.length)
            return;

        var logoUrl = details[0].OrganizationLogoUrl;

        if (!logoUrl)
            return;
        // convert immediately on data load (NOT on print click)
        $scope.toDataURL(logoUrl, function (dataURL) {
            $scope.$applyAsync(function () {
                $scope.OrganizationBase64LogoUrl = dataURL || '';
                console.log("Logo Ready (Base64 created)");
            });

        });
    };

    $scope.init = function () {

        //var NewBranchList = localStorageFactory.getItem("allBranchesData") || [];
        //InitializeBranches(NewBranchList, "PageLoad");
        //eHnoteUserDataService.getspeciality(onspecsuccess, onspecfailure);
        //function onspecsuccess(data) {
        //    $scope.specialitylist = data;
        //    var specAll = { "Id": 0, "Name": "All" };
        //    $scope.specialitylist.unshift(specAll);
        //}

        //function onspecfailure(data) {
        //}
        var bobj = {
            "OrganizationId": $scope.HospitalId || 0,
            "ParentOrganizationId": $scope.ParenthospitalId,
            "FacilityCode": "",
            "PageNumber": 1,
            "PageSize": 20
        };
        $q.all([
            eHnoteSettingsDataService.GetOrganizationBillingProviders(bobj),
            eHnoteSettingsDataService.GetAllMasterClaimsData($scope.HospitalId),

        ]).then(function (resp) {
            if (resp[0].data.rows.length > 0) {
                $scope.OrganizationBillingProviderList = resp[0].data.rows || [];
            }
            if (resp[1].data.ConnectedClearingHouse.length > 0) {
                $scope.OrganizationClearingHouseDetails = resp[1].data.ConnectedClearingHouse || [];
            }

        });
      // $scope.GetEligibilityHistory();
    };


    $scope.init();
    $scope.InsuranceEligibilityHis = [];
    $scope.InsuranceEligibilitySubscriberData = [];
    $scope.ErrorDetails = [];
    $scope.GetEligibilityHistory = function () {
        eHnoteInsuranceService.GetEligibilityHistory($scope.Selectobj, onsuccess, onerror);
    }
   
    function onsuccess(resp) {
        if (resp.data.rows.length > 0) {
            console.log(resp);

            $scope.InsuranceEligibilityHis = resp.data.rows;
            console.log($scope.InsuranceEligibilityHis);
            var matchingItems = $scope.InsuranceEligibilityHis.filter(function (item) {
                return item.PatientInsuranceDetailId === $scope.ReverifyObj.PatientInsuranceDetailId;
            });

            $scope.InsuranceEligibilityHis.forEach(function (item) {
                item.isHighlighted = false;
            });

            if (matchingItems.length > 0) {
                var latestItem = matchingItems[0];
                $scope.navtoPatientEligibilitySummaryPopup(latestItem);
            } else {
                console.warn('No matching PatientInsuranceDetailId found');
            }
            //$scope.navtoPatientEligibilitySummaryPopup($scope.InsuranceEligibilityHis[0]);
        }
    }
    function onerror(err) {
        console.log(err);
    }

    $scope.GetEligibilityHistory();


    $scope.GetRealtimeEligibilityQueueLogDetails = function () {
     
        eHnoteInsuranceService.GetRealtimeEligibilityQueueLog($scope.Selectobj, onsuccessdata, onerrordata);
    }
    $scope.GetRealtimeEligibilityQueueLogDetails();
    function onsuccessdata(resp) {
        if (resp.data.rows.length > 0) {
            $scope.RealtimeEligibilityQueue = resp.data.rows || [];
        }
    }

    function onerrordata(err) {
        console.log(err);
    }


    $scope.ChangeInsuranceEligibilty = function (type) {

        if (type == '1') {
            $scope.GetEligibilityHistory();
        } else {
            $scope.GetRealtimeEligibilityQueueLogDetails();
            $scope.InsuranceEligibiltyTab = '2';
        }

    }

  
   

    $scope.navtoPatientEligibilitySummaryPopup = function (val) {

        // Reset both first
        $scope.InsuranceEligibilitySubscriberData = [];
        $scope.ErrorDetails = [];

        $scope.obj1 = {
            "PatientInsuranceDetailId": val.PatientInsuranceDetailId,
            "SubscriberId": val.SubscriberId
        };

        $scope.InsuranceEligibilityHis.forEach(function (item) {
            if (item.PatientInsuranceDetailId === val.PatientInsuranceDetailId) {
                item.isHighlighted = true;
            }
            item.isHighlighted = false;
        });
        val.isHighlighted = true;

       
        if (val.EligibilityStatusId == 3) {

            eHnoteInsuranceService
                .GetPatientInsuranceEligibilityErrorDetails(val.PatientInsuranceDetailId)
                .then(function (response) {
                    $scope.ErrorDetails = response.data.ErrorDetails || [];
                });

        }
       
        else {

            eHnoteInsuranceService.GetEligibilitySubscribersDetails($scope.obj1, onsuccess, onerror);
            function onsuccess(resp) {
                if (resp.data.rows.length > 0) {
                    $scope.InsuranceEligibilitySubscriberData = resp.data.rows || [];
                    console.log($scope.InsuranceEligibilitySubscriberData)
                }
            }
            function onerror(err) {
                console.log(err);
            }
        }
    };
    //$scope.ErrordetailsData = function (Id) {
    //    eHnoteInsuranceService.GetPatientInsuranceEligibilityErrorDetails(Id).then(function (response) {
    //        console.log(JSON.stringify(response));
    //        if (response.data.ErrorDetails.length > 0) {
    //            $scope.ErrorDetails = response.data.ErrorDetails || [];
    //        }
    //    });
    //}
    //$scope.navtoPatientEligibilitySummaryPopup = function (val) {

    //    if (val.EligibilityStatusId == 3) {
    //        $scope.ErrordetailsData(val.PatientInsuranceDetailId);
    //    } else {
    //        $scope.ErrorDetails = [];
    //    }


    //    $scope.InsuranceEligibilityHis.forEach(function (item) {
    //        if (item.PatientInsuranceDetailId === val.PatientInsuranceDetailId) {
    //            item.isHighlighted = true;
    //        }
    //        item.isHighlighted = false;
    //    });
    //    val.isHighlighted = true;
    //    $scope.obj1 = {
    //        "PatientInsuranceDetailId": val.PatientInsuranceDetailId,
    //        "SubscriberId": val.SubscriberId
    //    }
    //    $scope.SelectedSubScriberId = $scope.obj1.SubscriberId;

    //    eHnoteInsuranceService.GetEligibilitySubscribersDetails($scope.obj1, onsuccess, onerror);
    //    function onsuccess(resp) {
    //        if (resp.data.rows.length > 0) {
    //            $scope.InsuranceEligibilitySubscriberData = resp.data.rows || [];
    //            console.log($scope.InsuranceEligibilitySubscriberData)
    //            $scope.loadOrganizationLogo();
    //            //$scope.ErrordetailsData(val.PatientInsuranceDetailId);

    //        }
    //    }
    //    function onerror(err) {
    //        console.log(err);
    //    }
    //}
    $scope.ClosePopup = function () {

        $uibModalInstance.dismiss("cancel");
    };
    $scope.CheckVerifyEligibity = function (item) {

       var item= $scope.ReverifyObj

            $scope.continuetoCheckInsuranceEligibility(item);
        
    }
    $scope.continuetoCheckInsuranceEligibility = function (item) {
        if (item.FirstName === "") {
            alertify.error("Please Enter Patient First Name");
            return;
        }
        //if (item.FirstName.length < 3) {
        //    alertify.error("Please Enter Patient First Name");
        //    return;
        //}

        if (item.LastName === "") {
            alertify.error("Please Enter Patient Last Name");
            return;
        }
        if (item.DOB === "") {
            alertify.error("Please Enter Patient DOB");
            return;
        }

        if (item.PatientGender === "") {
            alertify.error("Please Enter Patient Gender");
            return;
        }
        item.PlanId = item.PlanId || null;
        if (item.PlanId === null) {
            alertify.error("Please Select Plan");
            return;
        }
        item.PolicyId = item.PolicyId || null;
        if (item.PolicyId === null) {
            alertify.error("Please Enter Policy ID");
            return;
        }
        //item.GroupId = item.GroupId || null;
        //if (item.GroupId === null) {
        //    alertify.error("Please Enter Group");
        //    return;
        //};

        if (item.EligibilityPayorId === null || item.EligibilityPayorId === undefined || item.EligibilityPayorId === "") {
            alertify.error("Invalid Payer ID. Please check and try again.");
            return;
        }
        var params = {
            "UserId": $scope.UserId,
            "SNO": 1,
            "PatientAppointmentInsuranceDetailId": item.AppointmentInsuranceDetailId || 0,
            "AppointmentId": 0,
            "AppointmentDate": $filter('date')(new Date($scope.appDate), "yyyy-MM-dd"),
            "AppointmentInsuranceNumber": 0,
            "DoctorName": $scope.DrFullName,
            "UserProviderId": doctorinfo.doctordata.User[0].UserProviderId,
            "HospitalId": $scope.HospitalId,
            "AppointmentTOSCodes": [

            ],
            "NPI": doctorinfo.doctordata.User[0].NPI,
            "TaxId": doctorinfo.doctordata.User[0].UserTaxId,
            "ProviderCode": "H",
            //"serviceProviderNumber": $scope.selectedDocObject.selectedPerson.serviceProviderNumber,
            "serviceProviderNumber": 0,
            "HospitalName": doctorinfo.doctordata.UserAddress[0].ClinicName,
            "AppointmentTime": $filter("date")(new Date(), "HH:mm"),
            "AppointmentPatientTypeId": 1,
            "AppointmentPatientType": "New Patient",
            "PatientInsuranceDetailId": item.PatientInsuranceDetailId,
            "PatientId": item.PatientId,
            "PatientMrNo": item.PatientMrNo,
            "Gender": item.PatientGender,
            "DOB": item.DOB,
            "FirstName": item.FirstName,
            "LastName": item.FirstName,
            "TitleId": 1,
            "Title": "Mr",
            "PatientFirstName": item.FirstName,
            "PatientLastName": item.LastName,
            "PatientMobile": item.PatientMrNo,
            "PatientContact": item.HomeCountryCode,
            "HomeNumber": item.HomeNumber,
            "HomeAreaCode": item.HomeAreaCode,
            "HomeCountryCode": item.DisplayOfficeNumber,
            "OfficeNumber": item.OfficeNumber,
            "OfficeAreaCode": item.OfficeAreaCode,
            "OfficeCountryCode": item.OfficeCountryCode,
            "PatientGender": item.PatientGender,
            "PatientSSN": item.PatientSSN,
            "PayorId": item.PayorId,
            "PayorName": item.PayorName,
            "PlanName": item.PlanName,
            "PlanTypeId": item.PlanTypeId,
            "PlanTypeName": item.PlanTypeName || "",
            "PlanId": item.PlanId,
            "InsuranceEffectiveDate": item.EffectiveDate || "",
            "InsuranceExpiryDate": item.ExpiryDate || "",
            "RelationShipId": item.RelationShipId,
            "RelationName": item.RelationName,
            "VerifiedDate": item.VerifiedDate || "",
            "Coinsurance": item.Coinsurance || null,
            "VisitCopay": item.VisitCopay || null,
            "CoverageId": item.CoverageId || 1,
            "InsuredPersonSSN": item.InsuredPersonSSN,
            "PolicyHolder": item.PolicyHolder || "",
            "InsuranceStatusId": 1,
            "InsuredPersonFirstName": item.InsuredPersonFirstName,
            "InsuredPersonDOB": item.EligibleInsuredPersonDOB,
            "InsuredPersonGenderID": item.InsuredPersonGenderID,
            "InsuranceStatusName": "Active",
            "PolicyHolderName": item.PolicyHolderName || "",
            "GroupName": item.GroupName || "",
            "StatusId": item.StatusId || 1,
            "StatusName": "Not Verified",
            "MasterPayorId": item.GlobalPayorId,
            "OrgEligibilityClaimNumber": item.PatientInsuranceControlNumber,
            "PatientCoPayAmount": null,
            "PatientCoPayPercentage": null,
            "SocialSecurityNo": item.PatientSSN,
            "AddressId": null,
            "CityName": null,
            "StateName": null,
            "Pin": null,
            "PlanBeginDate": null,
            "PlanEndDate": null,
            "PolicyId": item.PolicyId,
            "GroupId": item.GroupId,
            "PlanNumber": null,
            "isSelected": false,
            "isVerified": false,
            "IsShowEligibility": false,
            "ProviderID": doctorinfo.doctordata.User[0].UserProviderId,
            "ServiceTypeobj": "",
            "SerciceFrom": $filter('date')(new Date($scope.appDate), "yyyy-MM-dd"),
            "ServiceTo": $filter('date')(new Date($scope.appDate), "yyyy-MM-dd"),
            "MemberId": "",
            "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "serviceTypeCodes": [

            ],
            "BillingProviderDetails": {
                "BillingProviderName": "",
                "BillingProviderId": "",
                "BillingProviderNPI": "",
                "BillingProviderTaxId": "",
                "BillingProviderContactPersonName": "",
                "BillingProviderContactPhoneNumber": ""
            },
            "ClearingHouseId": 1,
            "ClearingHouseName": "",
            "MasterClearingHouseId": "",
            "ClearingHouseType": "",
            "CHUserName": "",
            "CHPassword": "",
            "CHSubmitterId": "",
            "CHReceiverId": "",
            "CHEligiibilityUrl": "",
            "FTPAddress": "",
            "FTPUserName": "",
            "FTPpassword": "",
            "FTPpath": "",
            "FTPFolder": "",
            "FTPPort": "",
            "EligiBatchSubmitterID": "",
            "EligiBatchReceiverID": "",
            "PatientsList": [],

        };
        var traceNumber = $filter('date')(new Date(), 'yyyyMMddHHmmssfff');
        var traceEntityIdentifier = item.PatientInsuranceDetailId.toString().padStart(10, '0');

        let obj = {
            "PatientFirstName": item.FirstName,
            "PatientLastName": item.LastName,
            "Gender": item.PatientGender,
            "InsuredPersonDOB": item.EligibleInsuredPersonDOB,
            "PolicyNo": item.PolicyId,
            "PayorName": item.PayorName,
            "PayorId": item.PayorId,
            "GlobalPayorId": item.EligibilityPayorId,
            "ServiceTypeCode": "98",
            "TraceEntityIdentifier": traceEntityIdentifier,
            "EntityType": "1",
            "DeleteInd": "N",
            "EligibilityStatusId": "5",
            "EligibilityStatusName": "Verification Sent",
            "traceNumber": traceNumber + "_" + item.PatientInsuranceDetailId,
            "PatientInsuranceDetailId": item.PatientInsuranceDetailId,
            "PatientId": item.PatientId,
            "GroupId": item.GroupId,
            "PatientMrNo": item.PatientMrNo,
            "PatientDOB": moment(item.DOB).format("YYYYMMDD"),
            "PatientContact": item.HomeCountryCode,
        }

        params.PatientsList.push(obj);

        if ($scope.OrganizationBillingProviderList.length > 0) {
            //params.BillingProviderDetails.BillingProviderName = $scope.OrganizationBillingProviderList[0].BillingProviderName;
            //params.BillingProviderDetails.BillingProviderId = $scope.OrganizationBillingProviderList[0].BillingProviderId;
            //params.BillingProviderDetails.BillingProviderNPI = $scope.OrganizationBillingProviderList[0].NPI;
            //params.BillingProviderDetails.BillingProviderTaxId = $scope.OrganizationBillingProviderList[0].TaxId;
            //params.BillingProviderDetails.BillingProviderContactPersonName = $scope.OrganizationBillingProviderList[0].ContactPersonName;
            //params.BillingProviderDetails.BillingProviderContactPhoneNumber = $scope.OrganizationBillingProviderList[0].ContactMobileNumber;
            var OrganizationBillingProviderObj = "";
            var filteredList = $filter("filter")($scope.OrganizationBillingProviderList, { "OrganizationBillingProviderId": $scope.defaultBillingProviderId }, true) || [];
            if (filteredList.length > 0) {
                OrganizationBillingProviderObj = filteredList[0];
            } else {
                OrganizationBillingProviderObj = $scope.OrganizationBillingProviderList[0];
            }

            params.BillingProviderDetails.BillingProviderName = OrganizationBillingProviderObj.BillingProviderName;
            params.BillingProviderDetails.BillingProviderId = OrganizationBillingProviderObj.OrganizationBillingProviderId;
            params.BillingProviderDetails.BillingProviderNPI = OrganizationBillingProviderObj.NPI;
            params.BillingProviderDetails.BillingProviderTaxId = OrganizationBillingProviderObj.TaxId;
            params.BillingProviderDetails.BillingProviderContactPersonName = OrganizationBillingProviderObj.ContactPersonName;
            params.BillingProviderDetails.BillingProviderContactPhoneNumber = OrganizationBillingProviderObj.ContactMobileNumber;
        };

        if ($scope.OrganizationClearingHouseDetails.length > 0) {
            params.ClearingHouseId = $scope.OrganizationClearingHouseDetails[0].ClearingHouseID;
            params.ClearingHouseName = $scope.OrganizationClearingHouseDetails[0].Name;
            params.MasterClearingHouseId = $scope.OrganizationClearingHouseDetails[0].MasterClearingHouseId;
            params.ClearingHouseType = $scope.OrganizationClearingHouseDetails[0].ClaimUploadFTPType;

            params.FTPAddress = $scope.OrganizationClearingHouseDetails[0].ClaimUploadFTPHostName || "";
            params.FTPUserName = $scope.OrganizationClearingHouseDetails[0].ClaimUploadFTPUserName || "";
            params.FTPpassword = $scope.OrganizationClearingHouseDetails[0].ClaimUploadFTPPassword || "";
            params.FTPpath = $scope.OrganizationClearingHouseDetails[0].ClaimUploadFTPFolder || "";
            params.FTPFolder = $scope.OrganizationClearingHouseDetails[0].ClaimUploadFTPFolder || "";
            params.FTPPort = $scope.OrganizationClearingHouseDetails[0].ClaimUploadFTPPortNumber || "";
            params.EligiBatchSubmitterID = $scope.OrganizationClearingHouseDetails[0].SubmitterID || "";
            params.EligiBatchReceiverID = $scope.OrganizationClearingHouseDetails[0].ReceiverID || "";
            params.CHUserName = $scope.OrganizationClearingHouseDetails[0].AuthUserName || "";
            params.CHPassword = $scope.OrganizationClearingHouseDetails[0].AuthPassword || "";
            params.CHSubmitterId = $scope.OrganizationClearingHouseDetails[0].SubmitterID || "";
            params.CHReceiverId = $scope.OrganizationClearingHouseDetails[0].ReceiverID || "";
            params.CHEligiibilityUrl = $scope.OrganizationClearingHouseDetails[0].EligibilityURL || "";
            params.UsageIndicator = $scope.OrganizationClearingHouseDetails[0].UsageIndicator || "";
            var ClearingHouseTypeId = $scope.OrganizationClearingHouseDetails[0].ClearingHouseTypeId || 0;


            if (ClearingHouseTypeId == 2) {
                if (params.FTPAddress === "" && params.FTPUserName == "" && params.FTPpassword == "" && params.FTPpath == "") {
                    alertify.error("FTP details are missing for the Clearing House please ");
                    return false;
                }
            }

        }
        eHnoteInsuranceService.CheckPatientRealtimeInsuranceEligibility(params, onSuccess, onError);
        function onSuccess(resp) {



            console.log(JSON.stringify(resp));

            if (resp.Status == 'Success') {
                item.IsVerified = true;
                alertify.success("Insurance Eligibility Verified Successfully");
                $scope.GetEligibilityHistory();
                $scope.GetEligibilitySubscribersDetails(item.PatientInsuranceDetailId);
            }
            else if (resp.Status == 'Skipped') {
                alertify.success("Eligibility request already submitted. Please try again later.");
                $scope.GetEligibilityHistory();
                $scope.GetEligibilitySubscribersDetails(item.PatientInsuranceDetailId);
            }
            else {
                alertify.error("Insurance Eligibility Verification Failed");
                $scope.GetEligibilityHistory();
                $scope.GetEligibilitySubscribersDetails(item.PatientInsuranceDetailId);
            }
        }
        function onError(reponse) {
        }

    }
    $scope.GetEligibilitySubscribersDetails = function (PatientInsuranceDetailId) {

        $scope.obj1 = {
            "PatientInsuranceDetailId": PatientInsuranceDetailId,
            "SubscriberId": null
        }
        $scope.SelectedSubScriberId = $scope.obj1.SubscriberId;

        eHnoteInsuranceService.GetEligibilitySubscribersDetails($scope.obj1, onsuccess, onerror);
        function onsuccess(resp) {
            if (resp.data.rows.length > 0) {
                $scope.InsuranceEligibilitySubscriberData = resp.data.rows || [];
                console.log($scope.InsuranceEligibilitySubscriberData)
            }
        }
        function onerror(err) {
            console.log(err);
        }
    }
    $scope.EligibiltyPrint = function () {

        var Object = {
            "Source": $scope.InsuranceEligibilitySubscriberData[0].Source || "",
            "IssuedOn": $scope.InsuranceEligibilitySubscriberData[0].IssuedOn || "",
            "Receiver": $scope.InsuranceEligibilitySubscriberData[0].Receiver || "",
            "GroupNumber": $scope.InsuranceEligibilitySubscriberData[0].GroupNumber || "",
            "InsuredName": $scope.InsuranceEligibilitySubscriberData[0].InsuredName || "",
            "InsuredDOB": $scope.InsuranceEligibilitySubscriberData[0].InsuredDOB || "",
            "InsuredGender": $scope.InsuranceEligibilitySubscriberData[0].InsuredGender || "",
            "InsuredAddress1": $scope.InsuranceEligibilitySubscriberData[0].Address1 || "",
            "InsuredCity": $scope.InsuranceEligibilitySubscriberData[0].City || "",
            "InsuredState": $scope.InsuranceEligibilitySubscriberData[0].STATE || "",
            "InsuredZipCode": $scope.InsuranceEligibilitySubscriberData[0].ZipCode || "",
            "RelationShipCode": $scope.InsuranceEligibilitySubscriberData[0].RelationShipCode || "",
            "PlanBeginDate": $scope.InsuranceEligibilitySubscriberData[0].PlanBeginDate || "",
            "InsuredGender": $scope.InsuranceEligibilitySubscriberData[0].InsuredGender || "",
            "PolicyNumber": $scope.InsuranceEligibilitySubscriberData[0].PolicyNumber || "",
            "PlanEndDate": $scope.InsuranceEligibilitySubscriberData[0].PlanEndDate || "",
            "BenifitCoverageDetailsList": $scope.InsuranceEligibilitySubscriberData[0].BenifitCoverageDetailsList || [], //$scope.BenifitCoverageDetailsList || [],
            "OrganizationLogoUrl": $scope.OrganizationBase64LogoUrl || '',
            "MasterPayorId": $scope.InsuranceEligibilitySubscriberData[0].MasterPayorId || "",
            "SubscriberId": $scope.InsuranceEligibilitySubscriberData[0].SubscriberId || "",
            "NPI": $scope.InsuranceEligibilitySubscriberData[0].BranchNPI || "",

        }

        USPrintService.GenerateEligibiltyPrint(Object);
    }

    $scope.getPatientInsuranceDetailsOfPatient = function () {
        var includeInactive = true;
        eHnoteInsuranceService.getPatientInsuranceDtls(Selectobj.PatientId, 0, includeInactive).then(function (response) {

            if (response.data !== undefined) {
                $scope.ExpiredPatientInsuranceList = response.data.ExpiredPatientInsuranceList || [];
                if (response.data.rows.length > 0) {

                    let ActiveInsuranceList = [];
                    if (response.data.rows.length > 0) {
                        // ActiveInsuranceList = $filter('filter')(response.data.rows, { 'StatusId': 1 }, true) || [];
                        ActiveInsuranceList = $filter('filter')(response.data.rows, function (item) {
                            return item.StatusId === 1 || item.StatusId === 5;
                        }) || [];
                    }
                    $scope.PatientInsuranceSummary = ActiveInsuranceList;
                    $scope.patientInsuranceTpasArray = response.data.rows;
                    angular.forEach($scope.patientInsuranceTpasArray, function (bitem) {
                        bitem.isCorporateType = false;
                        if (bitem.BillingCategoryTypeId === 15) {
                            bitem.isCorporateType = true;
                        }
                    });
                    //$scope.PatientInsuranceObj = GetInsuranceObj();
                    if ($scope.patientInsuranceTpasArray.length > 0) {
                        if ($scope.patientInsuranceTpasArray.length === 1) {
                            $scope.PatientInsuranceObj = angular.copy($scope.patientInsuranceTpasArray[0]);
                            $scope.PatientInsuranceObj.PlanObj = angular.copy($scope.PatientInsuranceObj.PlanName);
                            $scope.PatientInsuranceObj.PayorObj = $scope.PatientInsuranceObj.PayorCode;
                        }
                        else if ($scope.patientInsuranceTpasArray.length > 1) {
                            var filter1 = $filter("filter")($scope.patientInsuranceTpasArray, { "IdentifierId": 1 }, true) || [];
                            if (filter1.length > 0) {
                                $scope.PatientInsuranceObj = angular.copy(filter1[0]);
                                $scope.PatientInsuranceObj.PlanObj = angular.copy($scope.PatientInsuranceObj.PlanName);
                                $scope.PatientInsuranceObj.setprimary = true;
                                $scope.PatientInsuranceObj.PayorObj = $scope.PatientInsuranceObj.PayorCode;
                            } else {
                                $scope.PatientInsuranceObj = angular.copy($scope.patientInsuranceTpasArray[0]);
                                $scope.PatientInsuranceObj.PlanObj = angular.copy($scope.PatientInsuranceObj.PlanName);
                                $scope.PatientInsuranceObj.PayorObj = $scope.PatientInsuranceObj.PayorCode;
                            }
                        }

                        $scope.patientInsuranceTpasArray = $filter('filter')($scope.patientInsuranceTpasArray, { 'StatusId': 1 }, true) || [];
                        if ($scope.PatientInsuranceObj.IdentifierId === 1) {
                            $scope.PatientInsuranceObj.setprimary = true;
                        } else {
                            $scope.PatientInsuranceObj.setprimary = false;
                        }
                    }
                    else {
                        $scope.PatientInsuranceObj.IdentifierId = 1;
                        $scope.PatientInsuranceObj.setprimary = true;
                    }


                }
                else {
                    $scope.patientInsuranceTpasArray = response.data.rows;
                }
            }
        });
    }


    $scope.EligibilityHistorypopup = function () {
        $scope.getPatientInsuranceDetailsOfPatient()
        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "InsuranceEligibility.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            /* "size": "lg"*/
            // "windowClass": "inventory-full-popup"
            "windowClass": "modal__ninety--",
            "controller": function ($scope, $uibModalInstance) {
                $scope.closeverify = function () {
                    $scope.patiendetilsopen();
                    $uibModalInstance.dismiss("cancel"); // Close the modal properly

                };
            }
        });
    };


    $scope.patiendetilsopen = function () {
        let patientId = $scope.PatientId || 0;
        eHnoteAuditServices.getPatientDetailsById(Selectobj.PatientId, ongetPatientDetailsSuccess, ongetPatientDetailsError);
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
    $scope.patiendetilsopen();
     
}]);
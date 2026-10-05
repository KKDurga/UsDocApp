eHnoteWebApp.controller('EhnoteAdminBranchCtrl', ['$scope', '$window', 'eHnoteMasterDataService', 'eHnoteMainAdminServices', '$filter', 'NgMap', 'alertify', 'eHnotePatientAddressDataServices', 'eHnoteSettingsDataService', "$timeout", "$uibModal", "eHnotePatientDataService", "eHnoteUserDataService", "$q", "eHnotePaymentGatewayService", "$location", function ($scope, $window, eHnoteMasterDataService, eHnoteMainAdminServices, $filter, NgMap, alertify, eHnotePatientAddressDataServices, eHnoteSettingsDataService, $timeout, $uibModal, eHnotePatientDataService, eHnoteUserDataService, $q, eHnotePaymentGatewayService, $location) {
    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    //debugger
    $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();


    $scope.showBranchTab = true;
    $scope.branchList = true;
    $scope.showProfileSettingsTab = false;
    $scope.edit_status = false;
    $scope.branchIdSortClass = "tb-sort";
    $scope.locationSortClass = "tb-sort";
    $scope.registerSortClass = "tb-sort";
    $scope.showEditBranch = false;
    $scope.showViewBranch = false;
    $scope.viewAddBranchDetails = false;
    $scope.showlistview = false;
    $scope.showcondition = false;
    var delete_status = false;
    var Individual_hospitalID;
    var hospital_phone = {};
    var parentHospitalId;
    var organizationtyepId;
    var organizationPrefix;
    var hospitalCode;
    $scope.HospitalId = 0;
    $scope.isIojOrgEnable = false;
    var currenturl = $location.absUrl().split('?')[0];
    var CurrentEnvironment = currenturl.split('/#')[0];
    if (CurrentEnvironment == "https://ioj.ehnote.com" || CurrentEnvironment == "https://insts.ehnote.com") {
        $scope.isIojOrgEnable = true;
    };
    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID !== undefined) {
        parentHospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
       hospitalCode = "";
        organizationtyepId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.OrganizationTypeId;
    }

    $scope.stateList = [];
    $scope.cityList = [];
    $scope.locationList = [];
    $scope.email_pattern = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    $scope.searchBy = "All";
    $scope.pageViewcount = "10";
    $scope.searchText = {
        'search': ''
    };
    $scope.hospitalParams = {
        "USRType": "ADMIN",
        "USRId": doctorinfo.doctorid,
        "HospitalAddress": {
            "State": "",
            "StateId": "",
            "Country": "",
            "CountryId": "",
            "Address1": "",
            "Address2": "",
            "CityTown": "",
            "CityId": "",
            "DistrictRegion": "",
            "PinCode": '',
            "Location": "",
            "Latitude": "0",
            "Longitude": "0",
            "CountyName": "",
            "CountyId": "",
            "CountyCodeObj": ""
        },
        "HospitalDetails": {
            "RegsistrationDate": $filter('date')(new Date(), "dd-MMM-yyyy"),
            "Account": {
                "1": "PLUS"
            },
            "AboutHospital": "",
            "LicenseNumber": "",
            "TINNumber": '',
            "HospitalID": 0,
            "ParentHospitalID": parentHospitalId,
            "OrganizationTypeId": organizationtyepId,
            "EmailAddress": "",
            "MobileNumber": '',
            "TermsAccepted": "Y",
            "WebSite": "",
            "ActiveIND": "Y",
            "HospitalName": "",
            "ContactName": "",
            "SMSURL": "",
            "TinySMSURL": "",
            "OrganizationLogoUrl": "",
            "NavigationURL": "",
            "NPI": "",
            "CLIID": "",
            "TaxID": "",
            "LSCode": "",
            "Format": "",
            "LSType": "",
            "Admission": "",
            "Source": "",
            "Status": "",
            "TypeBill": "",
            "TimeOut": 0,
            "OrganizationClearingHouseId": "",
            "DefaultBillingProviderId": 0,

            "OrganizationShortName": "",
            "FacilityTypeId": 0,
            "PlaceOfServiceId": 0,
            "ContactPerson": '',
            "FaxNo": '',
            "CommercialNumber": '',
            "LocationNumber": '',
            "OrgClaimNumber": '',
        },
        //"HospitalPhone": [
        //    {
        //        "PhCntryCD": 91,
        //        "PhStateCD": 0,
        //        "PhAreaCD": '',
        //        "PhNumber": '',
        //        "PhType": "M",
        //        "PrimaryIND": "Y",
        //        "PublicDisplay": "Y"
        //    }
        //]
        "HospitalPhone": {
            "PhCntryCD": "+1",
            "PhAreaCD": "",
            "PhNumber": "",
            "ContactCntryCD": "+1",
            "ContactAreaCD": "",
            "ContactNumber": "",
            "PrimaryIND": "Y",
            "PublicDisplay": "Y"
        }
    };
    $scope.masterClearingHousesArray = [];
    $scope.ClearingHouseTypes = [];

    $scope.GetClearhouseobj = function () {
        return {
            "OrganizationId": $scope.hospitalParams.HospitalDetails.HospitalID,
            "ClearingHouseID": 0,
            "ClearingHouseTypeId": "",
            "MasterClearingHouseId": "",
            "ClearingHouseGuid": "",
            "PracticeId": $scope.hospitalParams.HospitalDetails.HospitalID,
            "Name": "",
            "ContactName": "",
            "ContactPhone": "",
            "ContactFax": "",
            "AuthorizationIdentificationID": null,
            "AuthorizationIdentification": "",
            "AuthUserName": "",
            "AuthPassword": "",
            "ReceiverID": "",
            "SubmitterID": "",
            "InterChangeAckID": null,
            "InterChangeAck": "",
            "UsageIndicatorID": "",
            "UsageIndicator": "",
            "ApplicationSenderCode": "",
            "ApplicationReceiverCode": "",
            "LoopSubmitter": "",
            "EligiISA02": "",
            "EligiISA04": "",
            "EligiISA06": "",
            "EligiISA08": "",
            "EligiProviderNPI": "",
            "EligibilityURL": "",
            "EligibilityUserID": "",
            "EligibilityPassword": "",
            "EligibilityCallTypeID": null,
            "EligibilityCallType": "",
            "EligiGS02": "",
            "EligiGS03": "",
            "eligiBatchFtpHostName": "",
            "eligiBatchFtpUserID": "",
            "eligiBatchFtpPassword": "",
            "eligiBatchFtpType": "",
            "eligiBatchFtpPort": "",
            "eligiBatchSubmitterID": "",
            "eligiBatchReceiverID": "",
            "eligiBatchProviderNPI": "",
            "eligiBatchFTPOutFolder": "",
            "eligiBatchFTPInFolder": "",
            "ClaimUploadFTPHostName": "",
            "ClaimUploadFTPUserName": "",
            "ClaimUploadFTPPassword": "",
            "ClaimUploadFTPType": "",
            "ClaimUploadFTPPortNumber": "",
            "ClaimUploadFTPFolder": "",
            "ClaimUploadFilePrefixProf": "",
            "ClaimUploadFileExtProf": "",
            "ClaimUploadFilePrefixtInst": "",
            "ClaimUploadFileExtInst": "",
            "Claim277DownloadFTPFolder": "",
            "IsActive": false,
            "DeleteInd": "N",
            "ERADownloadFolder": "",
        }
    }

    $scope.ClearHouseobj = angular.copy($scope.GetClearhouseobj());

    $scope.clearingHouseAddObj = {
        "IsAddDivShow": false
    };

    function getServiceFacilities() {
        var obj = {
            "UserId": doctorinfo.doctorid,
            "BranchId": doctorinfo.doctordata.UserAddress[0].ClinicId,
            "BranchName": doctorinfo.doctordata.UserAddress[0].ClinicName,
            "OrganizationBillingProviderId": 0,
            "OrganizationId": $scope.hospitalParams.HospitalDetails.HospitalID,
            "FacilityTypeId": 0,
            "FacilityCode": "",
            "BillingProviderName": "",
            "PostalAddress1": "",
            "PostalAddress2": "",
            "PostalCityId": 0,
            "PostalCityName": "",
            "PostalStateId": 0,
            "PostalStateName": "",
            "PostalZipCode": "",
            "PostalCountryId": 0,
            "IsPostalAndPhysicalAddressSame": false,
            "PhysicalAddress1": "",
            "PhysicalAddress2": "",
            "PhysicalCityId": 0,
            "PhysicalCityName": "",
            "PhysicalStateId": 0,
            "PhysicalStateName": "",
            "PhysicalZipCode": "",
            "PhysicalCountryId": 0,
            "ContactMobileNumber": "",
            "ContactNumber": "",
            "ContactPersonName": "",
            "ContactAreaCode": "",
            "ContactCountryCode": "+1",
            "OtherMobileNumber": "",
            "OtherContactNumber": "",
            "OtherContactAreaCode": "",
            "OtherContactCountryCode": "+1",
            "FaxNumber": "",
            "Email": "",
            "NPI": "",
            "SSN": "",
            "TaxId": "",
            "TaxonomyId": "",
            "CLIAID": "",
            "MamGraphId": "",
            "IPA": "",
            "Notes": "",
            "ActiveInd": "Y",
            "DeleteInd": "N",
            "FromDate": "",
            "ToDate": "",
            "Motto": "",
            "WWW": "",
            "BillingProviderTypeId": "",
            "BillingProviderTypeName": "",
            "SpecializationId": $scope.SpecializationId || "",
            "Box33GroupName": "",
            "Box33GroupNPI": "",
            "Box33Address1": "",
            "Box33Address2": "",
            "Box33CityId": 0,
            "Box33CityName": "",
            "Box33StateId": 0,
            "Box33StateName": "",
            "Box33ZipCode": "",
            "Box33CountryId": 0,
        }
        return obj;
    }

    $scope.newServiceFacilities = getServiceFacilities();

    function getBillingProviderGroupObj() {
        var obj = {
            "UserId": doctorinfo.doctorid,
            "BillingProviderGroupId": 0,
            "ParentOrgBillingProviderId": 0,
            "DoctorId": 0,
            "OrganizationId": 0,
            "ParentOrganizationId": parentHospitalId,
            "InsuranceCoverageId": 0,
            "InsuranceFormTypeId": 0,
            "EntityTypeId": 0,
            "DeleteInd": "N"
        }
        return obj;
    }

    $scope.BillingProviderGroupObj = getBillingProviderGroupObj();

    function getOrgBillingProviderObj() {
        var obj = {
            "ParentOrganizationId": parentHospitalId,
            "FacilityCode": "",
            "PageNumber": 1,
            "PageSize": 10
        }
        return obj;
    }

    $scope.OrgBillingProviderObj = getOrgBillingProviderObj();

    $scope.BillingProviderGroupAddObj = {
        "IsAddDivShow": false
    };

    $scope.InsuranceCoverageTypeList = [
        {
            "InsuranceCoverageId": 1,
            "InsuranceCoverageName": "BlueCross BlueShield"
        },
        {
            "InsuranceCoverageId": 2,
            "InsuranceCoverageName": "Commercial/HMO"
        },
        {
            "InsuranceCoverageId": 3,
            "InsuranceCoverageName": "Medicaid"
        },
        {
            "InsuranceCoverageId": 4,
            "InsuranceCoverageName": "Medicare"
        },
        {
            "InsuranceCoverageId": 5,
            "InsuranceCoverageName": "TriCare Champus"
        },
        {
            "InsuranceCoverageId": 6,
            "InsuranceCoverageName": "Workers Compensation"
        }
    ]

    $scope.InsuranceFormTypeList = [
        {
            "InsuranceFormTypeId": 1,
            "InsuranceFormTypeName": "Professional"
        },
        {
            "InsuranceFormTypeId": 2,
            "InsuranceFormTypeName": "Institutional"
        }
    ]

    $scope.EntityTypeList = [
        {
            "EntityTypeId": 1,
            "EntityType": "Person"
        },
        {
            "EntityTypeId": 2,
            "EntityType": "Organization/Group"
        }
    ]


    function getorganizationfacilities() {
        var obj = {
            "UserId": doctorinfo.doctorid,
            "OrganizationId": $scope.hospitalParams.HospitalDetails.HospitalID,
            "OrganizationFacilityId": 0,
            "FacilityShortName": "",
            "FacilityName": "",
            "BillingName": "",
            "FacilityTypeId": 0,
            "FacilityTypeName": "",
            "PlaceOfServiceId": "",
            "PlaceOfService": "",
            "DefaultBillingProviderId": 0,
            "Address1": "",
            "Address2": "",
            "CityId": 0,
            "CityName": "",
            "StateId": 0,
            "StateName": "",
            "ZipCode": "",
            "CountryId": 0,
            "LocationId": null,
            "LocationName": "",
            "ContactName": "",
            "ContactMobile": "",
            "ContactEmail": "",
            "ContactFax": "",
            "ContactFaxcountrycode": "+1",
            "ContactFaxAreacode": "",
            "ContactFaxHomeNumber": "",
            "FaxNumber": "",
            "Faxcountrycode": "+1",
            "FaxAreacode": "",
            "FaxHomeNumber": "",
            "NPI": "",
            "StateLicenceNumber": "",
            "CommercialNumber": "",
            "LocationNumber": "",
            "CliaNumber": "",
            "ClaimTransmission": "",
            "UB4Claim": "",
            "DeleteInd": "N",
        }
        return obj;
    }

    $scope.OrganizationFacilityObj = getorganizationfacilities();

    $scope.FacilityAddObj = {
        "IsShowFacilitySetup": false
    }

    $scope.masterBillingFacilities = [
        { FacilityTypeId: 1, FacilityTypeName: "Outpatient Clinic", FacilityTypeCode: "OPH" },
        { FacilityTypeId: 2, FacilityTypeName: "Ambulatory Surgery Center", FacilityTypeCode: "ASC" },
        { FacilityTypeId: 3, FacilityTypeName: "Physician", FacilityTypeCode: "PHYSICIAN" },
        { FacilityTypeId: 4, FacilityTypeName: "Hospital", FacilityTypeCode: "HOSPITAL" },
        { FacilityTypeId: 5, FacilityTypeName: "Skilled Nursing Facility", FacilityTypeCode: "SNF" },
        { FacilityTypeId: 6, FacilityTypeName: "Urgent Care Center", FacilityTypeCode: "UCC" },
        { FacilityTypeId: 7, FacilityTypeName: "Rehabilitation Facility", FacilityTypeCode: "RF" },
        { FacilityTypeId: 8, FacilityTypeName: "Optical", FacilityTypeCode: "OPT" }
    ];
    $scope.changeBillingFacility = function (Id) {
        var filtredArray = $filter("filter")($scope.masterBillingFacilities, { "FacilityTypeId": Id }, true);
        //$scope.OrganizationFacilityObj.FacilityTypeName = filtredArray[0].FacilityTypeName;
        //$scope.OrganizationFacilityObj.FacilityTypeId = filtredArray[0].FacilityTypeId;

        $scope.hospitalParams.HospitalDetails.FacilityTypeName = filtredArray[0].FacilityTypeName;
        $scope.hospitalParams.HospitalDetails.FacilityTypeId = filtredArray[0].FacilityTypeId;

    }

    $scope.ClearingHouseBtn = "Save";
    $scope.showAddClearingHouseDetails = function () {
        $scope.ClearHouseobj = angular.copy($scope.GetClearhouseobj());
        $scope.clearingHouseAddObj.IsAddDivShow = !$scope.clearingHouseAddObj.IsAddDivShow;
        $scope.ClearingHouseBtn = "Save";
    }
    var vm = this;
    $scope.types = "['address']";
    NgMap.getMap().then(function (map) {
        $scope.map = map;
    });
    vm.placeChanged = function () {
        vm.place = this.getPlace();
        vm.map.setCenter(vm.place.geometry.location);
    };
    $scope.refreshMap = function () {

        $timeout(function () {
            $window.dispatchEvent(new Event("resize"));
        }, 100);
        NgMap.initMap('mapID');
    };
    $scope.getpos = function (event) {
        $scope.latlng = [event.latLng.lat(), event.latLng.lng()];
        $scope.marked_lat = event.latLng.lat();
        $scope.marked_lng = event.latLng.lng();
        $scope.hospitalParams.HospitalAddress.Latitude = $scope.marked_lat;
        $scope.hospitalParams.HospitalAddress.Longitude = $scope.marked_lng;
        eHnoteMainAdminServices.getPlaceDetails($scope.marked_lat, $scope.marked_lng, onGetPlaceSuccess, onGetPlaceError);
    };
    function onGetPlaceSuccess(data) {
        $scope.hospitalParams.HospitalAddress.Address2 = data.results[0].formatted_address;
        $scope.placeChanged(data.results);
    }
    function onGetPlaceError(data) {
    }
    function branchListing(pageSize) {
        pageSize = pageSize || 100;
        $scope.HospitalList = [];
        $scope.DoctorsList = [];
        var get_branches = {
            "pageNumber": 1,
            //  "HospitalID": parseInt(parentHospitalId),
            "pageSize": parseInt(pageSize),
            "IncludeDoctors": "N",
            "IncludeBranch": "Y",
            "ActiveHospital": "Y",
            "ActiveDoctor": "Y",
            "SubOrganizationId": doctorinfo.doctordata.UserAddress[0].SubOrganizationId,
           
        };

        //eHnoteMainAdminServices.getHospitalDetails(get_branches, onSuccessBranches, onFailedBranches);
        eHnoteMainAdminServices.getHospitalDetailsBySubOrganizationId(get_branches, onSuccessBranches, onFailedBranches);
    }
    function onSuccessBranches(data) {
        $scope.branchDetails = data.rows;
        angular.forEach($scope.branchDetails, function (item, index) {
            $scope.branchMobileNumber = item.HospitalInfo.HospitalPhone.MobileNo;
            var obj = eHnoteUserDataService.UsMobileFormatChange($scope.branchMobileNumber);
            item.HospitalInfo.HospitalPhone.MobileNoFormate = obj.UsFormatMobileNumber;
            $scope.branchContactNumber = item.HospitalInfo.HospitalPhone.ContactNo;
            var obj1 = eHnoteUserDataService.UsMobileFormatChange($scope.branchContactNumber);
            item.HospitalInfo.HospitalPhone.ContactNoFormate = obj1.UsFormatMobileNumber;
            
            $scope.branchFaxNumber = item?.HospitalInfo?.HospitalDetails?.FaxNo || '';

            if ($scope.branchFaxNumber) {
                var obj2 = eHnoteUserDataService.UsMobileFormatChange($scope.branchFaxNumber);
                $scope.branchFaxNumber = obj2.UsFormatMobileNumber;
                item.HospitalInfo.HospitalDetails.FaxNo = obj2.UsFormatMobileNumber;
            }
           
            item.showDelete = false;

            if (item.HospitalInfo && item.HospitalInfo.HospitalDetails) {
                $scope.HospitalList.push(item.HospitalInfo.HospitalDetails);
            }
            if (item.DoctorDetails.length > 0) {
                const filteredDoctors = item.DoctorDetails.filter(d => d.RoleID === 43 || d.RoleID === 1);
                $scope.DoctorsList.push(...filteredDoctors);
                $scope.DoctorsList = _.uniq($scope.DoctorsList, false, function (p) { return p.DoctorID; });
            }
        });
        $scope.count = data.count;
        $scope.totalItems = data.count;
        $scope.statsCount = data.Stats;
    }
    function onFailedBranches(data) {
    }
    $scope.searchBranch = function (val, type) {
        if (type == "onchange") {
            if (val == "") {
                branchListing();
                return;
            }
            else {
                return;
            }
        }
        if (val != "") {
            var searchParams = {
                "pageNumber": 0,
                "pageSize": 10,
                "HospitalCD": hospitalCode,
                "SearchText": val,
                "loaderStatus": false,
                "HospitalID": parentHospitalId
            };
            eHnoteMainAdminServices.searchHospital(searchParams, onSearchSuccess, onSearchFailed);
            function onSearchSuccess(data) {
                $scope.branchDetails = data.rows;
                angular.forEach($scope.branchDetails, function (item, index) {
                    item.showDelete = false;
                });
                if (data.count == 0)
                    $scope.branchDetails = [];
            }
            function onSearchFailed(data) {
            }
        }
        else {
            branchListing();
        }
    };
    $scope.maxSize = 10;
    function isInteger(x) {
        return x % 1 === 0;
    }
    $scope.currentPage = 1;
    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };
    $scope.pageChanged = function (pageNo) {
        branchListing(pageNo);
    };
    eHnotePatientAddressDataServices.getStates(2, getstatesSuccess, getstatesFailed);
    function getstatesSuccess(data) {
        $scope.states = data;
    }
    function getstatesFailed(data) {
    }
    eHnotePatientAddressDataServices.getCountries(getcountriesSuccessdd, getcountriesFailedss);
    function getcountriesSuccessdd(data) {
        $scope.admincountries = data;
    }
    function getcountriesFailedss(data) {
    }
    //eHnotePatientAddressDataServices.getCities(2, getcitiesSuccess, getcitiesFailed);
    //function getcitiesSuccess(data) {
    //    $scope.cities = data;
    //}
    //function getcitiesFailed(data) {
    //}

    $scope.changeCity = function () {
        $scope.locationList.length = 0;
        angular.forEach($scope.parentScope.location, function (item) {
            if (item.Id == $scope.hospitalParams.HospitalAddress.CityId) {
                $scope.locationList.push(item);
            }
        });
    };
    $scope.changeState = function () {
        $scope.cityList.length = 0;
        $scope.locationList.length = 0;
        angular.forEach($scope.parentScope.city, function (item) {
            if (item.StateId == $scope.hospitalParams.HospitalAddress.StateId) {
                $scope.cityList.push(item);
            }
        });
    };
    $scope.changeCountry = function () {
        $scope.stateList.length = 0;
        $scope.cityList.length = 0;
        $scope.locationList.length = 0;
        angular.forEach($scope.states, function (item) {
            if (item.Id == $scope.hospitalParams.HospitalAddress.CountryId) {
                $scope.stateList.push(item);
            }
        });
    };
    $scope.changeLocation = function () {
        angular.forEach($scope.parentScope.location, function (item) {
            if (item.LocationID == $scope.hospitalParams.HospitalAddress.Location) {
                $scope.placeval = item.LocationIDDesc;
            }
        });
    };

    $scope.getStatesByCountry = function (country) {
        console.log(country);
        $scope.states = [];
        $scope.cities = [];
        country = parseInt(country);
        eHnotePatientAddressDataServices.getStatesByCountryId(country).then(function (resp) {
            console.log(resp.data);
            if (resp.data.rows.length > 0) {
                $scope.states = resp.data.rows;

            }
            else {
                $scope.states = [];

            }
        });
    };
    $scope.changegetStatesByCountry = function (country) {
        console.log(country);
        $scope.states = [];
        $scope.cities = [];
        country = parseInt(country);
        eHnotePatientAddressDataServices.getStatesByCountryId(country).then(function (resp) {
            console.log(resp.data);
            if (resp.data.rows.length > 0) {
                $scope.states = resp.data.rows;
                $scope.hospitalParams.HospitalAddress.State = "";
                $scope.hospitalParams.HospitalAddress.CityTown = "";
                $scope.hospitalParams.HospitalAddress.Location = "";
                $scope.hospitalParams.HospitalAddress.PinCode = "";

            } else {
                $scope.states = [];
                $scope.hospitalParams.HospitalAddress.State = "";
                $scope.hospitalParams.HospitalAddress.CityTown = "";
                $scope.hospitalParams.HospitalAddress.Location = "";
                $scope.hospitalParams.HospitalAddress.PinCode = "";
            }
        });
    };
    $scope.getCitiesByState = function (state) {
        console.log(state);
        $scope.cities = [];
        state = parseInt(state);
        eHnotePatientAddressDataServices.getCitiesByStateId(state).then(function (resp) {
            console.log(resp.data);
            if (resp.data.length > 0) {
                $scope.cities = resp.data;
            }
        });
    };
    $scope.changegetCitiesByState = function (state) {
        console.log(state);
        $scope.cities = [];
        state = parseInt(state);
        eHnotePatientAddressDataServices.getCitiesByStateId(state).then(function (resp) {
            console.log(resp.data);
            if (resp.data.length > 0) {
                $scope.cities = resp.data;
                $scope.hospitalParams.HospitalAddress.CityTown = "";
                $scope.hospitalParams.HospitalAddress.Location = "";
                $scope.hospitalParams.HospitalAddress.PinCode = "";
            }
        });
    }
    $scope.pageShow = function (val, addUpdateBranchForm) {

        if (!$scope.UserAccessRights.AllAccessRights.AdminAddNewBranch) {
            alertify.error("Sorry You Dont have Access,Please Contact Administrator");
            return false;
        }


        addUpdateBranchForm = addUpdateBranchForm || '';
        if (val == "add") {
            $scope.edit_status = false;
            resetCollection();
            $timeout(function () {
                $window.dispatchEvent(new Event("resize"));
            }, 100);
            $scope.branchList = false;
            $scope.addUpdateBranch = true;
            $scope.f_status = false;
            $scope.showEditBranch = true;
            $scope.showViewBranch = false;
        }
        else if (val == "edit") {

            //eHnotePatientAddressDataServices.getCountries(2, getcountriesSuccess, getcountriesFailed);
            //function getcountriesSuccess(data) {
            //    $scope.admincountries = data;
            //}
            //function getcountriesFailed(data) {
            //}
            $scope.hospitalParams.HospitalAddress.State = $scope.hospitalParams.HospitalAddress.StateId ? $scope.hospitalParams.HospitalAddress.StateId.toString() : '';
            $scope.hospitalParams.HospitalAddress.Country = $scope.hospitalParams.HospitalAddress.CountryId ? $scope.hospitalParams.HospitalAddress.CountryId.toString() : '';
            $scope.hospitalParams.HospitalAddress.CityTown = $scope.hospitalParams.HospitalAddress.CityId ? $scope.hospitalParams.HospitalAddress.CityId.toString() : '';
            $scope.hospitalParams.HospitalAddress.CountyId = $scope.hospitalParams.HospitalAddress.CountyId ? $scope.hospitalParams.HospitalAddress.CountyId.toString() : '';
            $scope.branchList = false;
            $scope.addUpdateBranch = true;
            $scope.showEditBranch = true;
            $scope.showViewBranch = false;
            $scope.edit_status = true;


            $timeout(function () {
                $window.dispatchEvent(new Event("resize"));
            }, 100);
        }
        else if (val == "view") {
            $scope.hospitalParams.HospitalAddress.StateName = $scope.hospitalParams.HospitalAddress.StateName;
            $scope.hospitalParams.HospitalAddress.CountryName = $scope.hospitalParams.HospitalAddress.CountryName;
            $scope.hospitalParams.HospitalAddress.CityName = $scope.hospitalParams.HospitalAddress.CityName;
            $scope.hospitalParams.HospitalAddress.CountyName = $scope.hospitalParams.HospitalAddress.CountyName;
            $scope.branchList = false;
            $scope.addUpdateBranch = true;
            $scope.showEditBranch = false;
            $scope.showViewBranch = true;
            $timeout(function () {
                $window.dispatchEvent(new Event("resize"));
            }, 100);
        }
        else {
            branchListing();
            $scope.branchList = true;
            $scope.addUpdateBranch = false;
            if (addUpdateBranchForm != "") {
                addUpdateBranchForm.$setPristine(true);
                addUpdateBranchForm.submited = false;
                addUpdateBranchForm.$setUntouched();
            }

        }

        $scope.changeCountry();
        $scope.changeState();
        $scope.changeCity();
        $scope.hospitalParams.HospitalAddress.State = parseInt($scope.hospitalParams.HospitalAddress.State);
        $scope.hospitalParams.HospitalAddress.CityTown = parseInt($scope.hospitalParams.HospitalAddress.CityTown);
        $scope.getStatesByCountry($scope.hospitalParams.HospitalAddress.Country);
        $scope.getCitiesByState($scope.hospitalParams.HospitalAddress.State);

    };
    branchListing();
    $scope.sortList = function (type) {
        if (type == "branchId") {
            $scope.locationSortClass = "tb-sort";
            $scope.registerSortClass = "tb-sort";
            if ($scope.branchIdSortClass == "tb-asc") {
                $scope.branchIdSortClass = "tb-dec";
                $scope.orderByField = "-branchData.HospitalInfo.HospitalDetails.BranchCode";
                $scope.reversetOrder = false;
            }
            else {
                $scope.branchIdSortClass = "tb-asc";
                $scope.orderByField = "branchData.HospitalInfo.HospitalDetails.BranchCode";
                $scope.reversetOrder = true;
            }
        }
        else if (type == "location") {
            $scope.branchIdSortClass = "tb-sort";
            $scope.registerSortClass = "tb-sort";
            if ($scope.locationSortClass == "tb-asc") {
                $scope.locationSortClass = "tb-dec";
                $scope.orderByField = "-branchData.HospitalInfo.HospitalAddress.Location";
                $scope.reversetOrder = false;
            }
            else {
                $scope.locationSortClass = "tb-asc";
                $scope.orderByField = "branchData.HospitalInfo.HospitalAddress.Location";
                $scope.reversetOrder = true;
            }
        } else {
            $scope.locationSortClass = "tb-sort";
            $scope.branchIdSortClass = "tb-sort";
            if ($scope.registerSortClass == "tb-asc") {
                $scope.registerSortClass = "tb-dec";
                $scope.orderByField = "-branchData.HospitalInfo.HospitalDetails.RegsistrationDate";
                $scope.reversetOrder = false;
            }
            else {
                $scope.registerSortClass = "tb-asc";
                $scope.orderByField = "branchData.HospitalInfo.HospitalDetails.RegsistrationDate";
                $scope.reversetOrder = true;
            }
        }
    };
    $scope.branch_details = function (val, array, index) {
        if (val == "delete") {
            delete_status = true;
            $scope.hospitalParams = array.HospitalInfo;
            $scope.hospitalParams.HospitalDetails.ActiveIND = "N";
            $scope.hospitalParams.HospitalAddress.State = $scope.hospitalParams.HospitalAddress.StateId;
            $scope.hospitalParams.HospitalAddress.Country = $scope.hospitalParams.HospitalAddress.CountryId;
            $scope.hospitalParams.HospitalAddress.CityTown = $scope.hospitalParams.HospitalAddress.CityId;
            $scope.submit();
        } else if (val == "view") {
            $scope.hospitalParams = array.HospitalInfo;
            $scope.HospitalId = $scope.hospitalParams?.HospitalDetails?.HospitalID;
            $scope.branchFaxNumberValue = $scope.hospitalParams?.HospitalDetails?.FaxNo || '';

            $scope.hospitalParams.HospitalDetails.PlaceOfServiceId = $scope.hospitalParams.HospitalDetails.PlaceOfServiceId || 0;
            var TempPlaceOfServiceId = $scope.hospitalParams.HospitalDetails.PlaceOfServiceId || 0;
            if ($scope.branchFaxNumberValue) {
                var obj2 = eHnoteUserDataService.UsMobileFormatChange($scope.branchFaxNumberValue);
                $scope.hospitalParams.HospitalDetails.FaxNo = obj2.UsFormatMobileNumber;
            }
            if ($scope.hospitalParams.HospitalDetails.RegsistrationDate == undefined) {
                $scope.hospitalParams.HospitalDetails.RegsistrationDate = $filter('date')(new Date(), 'MM-dd-yyyy');
            } else {
                $scope.hospitalParams.HospitalDetails.RegsistrationDate = $filter('date')($scope.hospitalParams.HospitalDetails.RegsistrationDate, 'MM-dd-yyyy');
            }
            if ($scope.hospitalParams.HospitalPhone != undefined) {
                $scope.hospitalParams.HospitalPhone.MobileNo = $scope.hospitalParams.HospitalPhone.MobileNo || "";
                $scope.hospitalParams.HospitalPhone.ContactNo = $scope.hospitalParams.HospitalPhone.ContactNo || "";
                $scope.hospitalParams.HospitalPhone.PhCntryCD = $scope.hospitalParams.HospitalPhone.PhoneCountryCode || "";
                $scope.hospitalParams.HospitalPhone.PhAreaCD = $scope.hospitalParams.HospitalPhone.PhoneAreaCode || "";
                $scope.hospitalParams.HospitalPhone.PhNumber = $scope.hospitalParams.HospitalPhone.PhoneNumber || "";

                $scope.hospitalParams.HospitalPhone.ContactAreaCD = $scope.hospitalParams.HospitalPhone.ContactAreaCode || "";
                $scope.hospitalParams.HospitalPhone.ContactCntryCD = $scope.hospitalParams.HospitalPhone.ContactCountryCode || "+1";
                $scope.hospitalParams.HospitalPhone.ContactNumber = $scope.hospitalParams.HospitalPhone.ContactNumber || "";

                $scope.hospitalParams.HospitalPhone.PrimaryIND = "Y";
                $scope.hospitalParams.HospitalPhone.PublicDisplay = "Y";
                var phoneNumberString = $scope.hospitalParams.HospitalPhone.PhoneAreaCode + $scope.hospitalParams.HospitalPhone.PhoneNumber;
                $scope.ChangeUsFormate(phoneNumberString);
                var phoneNumberString1 = $scope.hospitalParams.HospitalPhone.ContactAreaCode + $scope.hospitalParams.HospitalPhone.ContactNumber;
                $scope.ChangeUsFormate1(phoneNumberString1);
            } else {
                $scope.hospitalParams.HospitalPhone = {
                    "PhCntryCD": "+1",
                    "PhAreaCD": "",
                    "PhNumber": "",
                    "ContactCntryCD": "+1",
                    "ContactAreaCD": "",
                    "ContactNumber": "",
                    "PrimaryIND": "Y",
                    "PublicDisplay": "Y"
                };
            }

           $scope.BillingLocation.ServiceLocationArray = array.ServiceLocations;
            angular.forEach($scope.BillingLocation.ServiceLocationArray, function (item) {
                if (item.ServiceLocationType) {
                    var selected = array.ServiceLocations.find(x =>
                        x.ServiceLocationType == item.ServiceLocationType
                    );
                    if (selected) {
                        item.ServiceLocationTypeId = selected.ServiceLocationTypeId;
                        item.ServiceLocationType = selected.ServiceLocationTypeId;
                    }
                }
            });

            $scope.viewAddBranchDetails = true;
            //$scope.pageShow('view');
            $scope.pageShow1('view');
            $scope.changeCountry();
            $scope.changeState();
            $scope.changeCity();
            $scope.changeLocation();
            $scope.GetMasterBranchData();
            /*     $scope.GetHolidaysList();*/
            $scope.getUserLeavesList();
            $scope.GetOrganizationClearingHouseDetails();
            $scope.GetMasterClearingHouseData();
            $scope.GetMasterClearingHouseDetails();
            $scope.OrgBillingProviderObj.PageNumber = 1;
            $scope.OrgBillingProviderObj.PageSize = 1000;
            $scope.init(TempPlaceOfServiceId);
            $scope.BillingProviderGroupObj = getBillingProviderGroupObj();
            $scope.GetOrganizationBillingProviderGroups();
        } else {
            $scope.edit_status = true;
            Individual_hospitalID = array.HospitalInfo.HospitalDetails.HospitalID;
            $scope.hospitalParams = array.HospitalInfo;
            $scope.branchFaxNumberValue = $scope.hospitalParams?.HospitalDetails?.FaxNo || '';
            $scope.HospitalId = $scope.hospitalParams?.HospitalDetails?.HospitalID;
            if ($scope.branchFaxNumberValue) {
                var obj2 = eHnoteUserDataService.UsMobileFormatChange($scope.branchFaxNumberValue);
                $scope.hospitalParams.HospitalDetails.FaxNo = obj2.UsFormatMobileNumber;
            }
            if ($scope.hospitalParams.HospitalDetails.RegsistrationDate == undefined) {
                $scope.hospitalParams.HospitalDetails.RegsistrationDate = $filter('date')(new Date(), 'dd-MMM-yyyy');
            } else {
                $scope.hospitalParams.HospitalDetails.RegsistrationDate = $filter('date')($scope.hospitalParams.HospitalDetails.RegsistrationDate, 'dd-MMM-yyyy');
            }
            if ($scope.hospitalParams.HospitalPhone.length == 0) {
                $scope.addMultipleContacts();
            }
            $scope.hospitalParams.HospitalAddress.State = $scope.hospitalParams.HospitalAddress.StateId.toString();
            $scope.hospitalParams.HospitalAddress.Country = $scope.hospitalParams.HospitalAddress.CountryId.toString();
            $scope.hospitalParams.HospitalAddress.CityTown = $scope.hospitalParams.HospitalAddress.CityId.toString();          
            $scope.changeCountry();
            $scope.changeState();
            $scope.changeCity();
            $scope.changeLocation();
            $scope.pageShow('edit');
        }
        $scope.AdminSubtab = 1;
    };
    //$scope.addMultipleContacts = function () {
    //    var add_contacts = { "PhCntryCD": 91, "PhStateCD": 0, "PhAreaCD": '', "PhNumber": '', "PhType": "M", "PrimaryIND": "Y", "PublicDisplay": "Y" };
    //    $scope.hospitalParams.HospitalPhone.push(add_contacts);
    //};
    //$scope.addMultipleContacts();
    $scope.removeContact = function (index) {
        $scope.hospitalParams.HospitalPhone.splice(index, 1);
    };
    function resetCollection() {
        $scope.hospitalParams = {
            "USRType": "ADMIN", "USRId": doctorinfo.doctorid, "HospitalAddress": { "State": "", "Country": "", "Address1": "", "Address2": "", "CityTown": "", "DistrictRegion": "", "PinCode": '', "Location": "", "Latitude": "", "Longitude": "" }, "HospitalDetails": {
                "RegsistrationDate": $filter('date')(new Date(), "dd-MMM-yyyy"), "Account": { "1": "PLUS" }, "AboutHospital": "", "LicenseNumber": "", "TINNumber": '', "SMSURL": '', "TinySMSURL": '', "HospitalID": 0, "ParentHospitalID": parentHospitalId, "OrganizationTypeId": organizationtyepId,
                "EmailAddress": "", "MobileNumber": '', "TermsAccepted": "Y", "WebSite": "", "ActiveIND": "Y", "HospitalName": "", "ContactName": ""
            },
            "HospitalPhone": {
                "PhCntryCD": "+1",
                "PhAreaCD": "",
                "PhNumber": "",
                "ContactCntryCD": "+1",
                "ContactAreaCD": "",
                "ContactNumber": "",
                "PrimaryIND": "Y",
                "PublicDisplay": "Y"
            }
        };
    }
    $scope.submit = function (form) {
        form = form || 'others';
        if (form != "others") {
            if (!form.$valid) {
                $window.scrollTo(0, angular.element(document.getElementById('locationID')).offsetTop);
                return;
            }
        }
        if ($scope.hospitalParams.HospitalAddress.Latitude == undefined) {
            $scope.hospitalParams.HospitalAddress.Latitude = 0;
            $scope.hospitalParams.HospitalAddress.Longitude = 0;
        }
        if ($scope.hospitalParams.HospitalDetails.BranchCode == undefined || $scope.hospitalParams.HospitalDetails.BranchCode == "") {
            organizationPrefix = "";
        } else {
            organizationPrefix = $scope.hospitalParams.HospitalDetails.BranchCode;
        }

        //if ($scope.hospitalParams.HospitalPhone.ContactAreaCD.length != '' || $scope.hospitalParams.HospitalPhone.ContactNumber.length != '') {
        //    if ($scope.hospitalParams.HospitalPhone.ContactAreaCD.length != 3) {
        //        alertify.error("Please Enter Area Code");
        //        return false;
        //    }
        //    if ($scope.hospitalParams.HospitalPhone.ContactNumber.length != 7) {
        //        alertify.error("Please Enter Mobile Number");
        //        return false;
        //    }
        //}
        if ($scope.hospitalParams.HospitalPhone.MobileNo == "") {
            alertify.error("Please Enter Mobile Number");
            return false;
        }
        if ($scope.hospitalParams.HospitalDetails.FacilityTypeId == "") {
            alertify.error("Please Enter Facility Type");
            return false;
        }
        if ($scope.hospitalParams.HospitalPhone.MobileNo.length < 14) {
            alertify.error("Please Enter Valid Mobile Number");
            return false;
        }
        $scope.hospitalParams.HospitalAddress.Address1 = $scope.hospitalParams.HospitalAddress.Address1 || "";
        if ($scope.hospitalParams.HospitalAddress.Address1 == "") {
            alertify.error("Please Enter Address Line 1");
            return false;
        }
        $scope.hospitalParams.HospitalAddress.Address2 = $scope.hospitalParams.HospitalAddress.Address2 || "";
        if ($scope.hospitalParams.HospitalAddress.Address2 == "") {
            alertify.error("Please Enter Address Line 2");
            return false;
        }
        $scope.hospitalParams.HospitalAddress.PinCode = $scope.hospitalParams.HospitalAddress.PinCode || "";
        if ($scope.hospitalParams.HospitalAddress.PinCode == "") {
            alertify.error("Please Enter Zip Code Number");
            return false;
        }
        $scope.hospitalParams.HospitalAddress.CountyName = $scope.hospitalParams.HospitalAddress.CountyName || "";
        //if ($scope.hospitalParams.HospitalAddress.CountyName == "") {
        //    alertify.error("Please Enter County");
        //    return false;
        //}
        $scope.hospitalParams.HospitalAddress.CityName = $scope.hospitalParams.HospitalAddress.CityName || "";
        if ($scope.hospitalParams.HospitalAddress.CityName == "") {
            alertify.error("Please Enter City");
            return false;
        }
        $scope.hospitalParams.HospitalAddress.StateName = $scope.hospitalParams.HospitalAddress.StateName || "";
        if ($scope.hospitalParams.HospitalAddress.StateName == "") {
            alertify.error("Please Enter State");
            return false;
        }
        $scope.hospitalParams.HospitalAddress.Location = $scope.hospitalParams.HospitalAddress.Location || "";
        //if ($scope.hospitalParams.HospitalAddress.Location == "") {
        //    alertify.error("Please Enter Location");
        //    return false;
        //}
        $scope.hospitalParams.HospitalAddress.CountryName = $scope.hospitalParams.HospitalAddress.CountryName || undefined;
        if ($scope.hospitalParams.HospitalAddress.CountryName == undefined) {
            alertify.error("Please Enter Country");
            return false;
        }
        $scope.hospitalParams.HospitalDetails.RegsistrationDate = $scope.hospitalParams.HospitalDetails.RegsistrationDate || "";
        if ($scope.hospitalParams.HospitalDetails.RegsistrationDate == "") {
            alertify.error("Please Enter Regsistration Date");
            return false;
        }
        $scope.hospitalParams.HospitalDetails.LicenseNumber = $scope.hospitalParams.HospitalDetails.LicenseNumber || "";
        if ($scope.hospitalParams.HospitalDetails.LicenseNumber == "") {
            alertify.error("Please Enter License Number");
            return false;
        }

        if ($scope.isIojOrgEnable == true) {
            if ($scope.BillingLocation.ServiceLocationArray.length > 0) {
                for (var i = 0; i < $scope.BillingLocation.ServiceLocationArray.length; i++) {
                    var item = $scope.BillingLocation.ServiceLocationArray[i];
                    if (item.ServiceLocationCode == "") {
                        alertify.error("Please Enter ServiceLocationCode");
                        return false;
                    }
                    if (item.ServiceLocationName == "") {
                        alertify.error("Please Enter ServiceLocationName");
                        return false;
                    }
                    if (item.ServiceLocationTypeId == "") {
                        alertify.error("Please Enter ServiceLocationType ");
                        return false;
                    }
                    if (item.Address1 == "") {
                        alertify.error("Please Enter  Address1");
                        return false;
                    }
                    //if (item.Address2 == "") {
                    //    alertify.error("Please Enter  Address2");
                    //    return false;
                    //}
                    //if (item.Location == "") {
                    //    alertify.error("Please Enter  Location");
                    //    return false;
                    //}
                    if (item.CityName == "") {
                        alertify.error("Please Enter  CityName");
                        return false;
                    }
                    if (item.StateName == "") {
                        alertify.error("Please Enter  Billing LocationState");
                        return false;
                    }
                    if (item.StateName == "") {
                        alertify.error("Please Enter  StateName");
                        return false;
                    }
                    if (item.ZipCode == "") {
                        alertify.error("Please Enter  ZipCode");
                        return false;
                    }
                };
            }
        }
        //if ($scope.hospitalParams.HospitalDetails.EmailAddress == "") {
        //    alertify.error("Please Enter Email ID");
        //    return false;
        //}
        //if ($scope.hospitalParams.HospitalDetails.TimeOut < 30) {
        //    alertify.error("Timeout must be at least 30 minutes");
        //    return false;
        //}
        //$scope.hospitalParams.HospitalDetails.EmailAddress = $scope.hospitalParams.HospitalDetails.EmailAddress || undefined;
        //if ($scope.hospitalParams.HospitalDetails.EmailAddress == undefined) {
        //    alertify.error("Please Enter Valid Email ID");
        //    return false;
        //}

        angular.forEach($scope.BillingLocation.ServiceLocationArray, function (item) {

            if (item.ServiceLocationType) {
                var selected = $scope.BillingFacilityList.find(x =>
                    x.BillingProviderTypeId == item.ServiceLocationType
                );
                if (selected) {
                    item.ServiceLocationTypeId = selected.BillingProviderTypeId;
                    item.ServiceLocationType = selected.BillingProviderTypeName;
                }
            }
        });


        var params = {
            "USRType": "ADMIN",
            "UserId": doctorinfo.doctorid,
            "HospitalAddress": {
                "StateId": $scope.hospitalParams.HospitalAddress.State,
                "CountryId": $scope.hospitalParams.HospitalAddress.Country,
                "Address1": $scope.hospitalParams.HospitalAddress.Address1,
                "Address2": $scope.hospitalParams.HospitalAddress.Address2,
                "CityId": $scope.hospitalParams.HospitalAddress.CityTown,
                "DistrictRegion": $scope.hospitalParams.HospitalAddress.DistrictRegion,
                //"PinCode": parseInt($scope.hospitalParams.HospitalAddress.PinCode),
                "PinCode": ($scope.hospitalParams.HospitalAddress.PinCode || "").replace(/\D/g, ""),
                "Location": $scope.hospitalParams.HospitalAddress.Location,
                "Latitude": ($scope.hospitalParams.HospitalAddress.Latitude).toString(),
                "Longitude": ($scope.hospitalParams.HospitalAddress.Longitude).toString(),
                "CountyName": $scope.hospitalParams.HospitalAddress.CountyName,
                "CountyId": $scope.hospitalParams.HospitalAddress.CountyId
            },
            "HospitalDetails": {
                "RegsistrationDate": $filter('date')(new Date($scope.hospitalParams.HospitalDetails.RegsistrationDate), 'yyyy-MM-dd'),
                "Account": {
                    "1": "PLUS"
                },
                "AboutHospital": "",
                "LicenseNumber": $scope.hospitalParams.HospitalDetails.LicenseNumber,
                "TINNumber": $scope.hospitalParams.HospitalDetails.TINNumber,
                "HospitalID": $scope.hospitalParams.HospitalDetails.HospitalID,
                "ParentHospitalID": parentHospitalId,
                "OrganizationTypeId": organizationtyepId,
                "EmailAddress": $scope.hospitalParams.HospitalDetails.EmailAddress,
                "MobileNumber": "",
                "TermsAccepted": "Y",
                "WebSite": "",
                "ActiveIND": $scope.hospitalParams.HospitalDetails.ActiveIND,
                "HospitalName": $scope.hospitalParams.HospitalDetails.HospitalName,
                "OrganizationPrefix": organizationPrefix,
                "ContactName": "",
                "SubOrganizationId": $scope.hospitalParams.HospitalDetails.SubOrganizationId,
                "SMSURL": $scope.hospitalParams.HospitalDetails.SMSURL,
                "TinySMSURL": $scope.hospitalParams.HospitalDetails.TinySMSURL,
                "OrganizationLogoUrl": $scope.hospitalParams.HospitalDetails.OrganizationLogoUrl,
                "NavigationURL": $scope.hospitalParams.HospitalDetails.NavigationURL,
                "NPI": $scope.hospitalParams.HospitalDetails.NPI,
                "CLIID": $scope.hospitalParams.HospitalDetails.CLIID,
                "TaxID": $scope.hospitalParams.HospitalDetails.TaxID,
                "LSCode": $scope.hospitalParams.HospitalDetails.LSCode,
                "Format": $scope.hospitalParams.HospitalDetails.Format,
                "LSType": $scope.hospitalParams.HospitalDetails.LSType,
                "Admission": $scope.hospitalParams.HospitalDetails.Admission,
                "Source": $scope.hospitalParams.HospitalDetails.Source,
                "Status": $scope.hospitalParams.HospitalDetails.Status,
                "TypeBill": $scope.hospitalParams.HospitalDetails.TypeBill,
                "OrganizationClearingHouseId": $scope.hospitalParams.HospitalDetails.OrganizationClearingHouseId || 0,
                "DefaultBillingProviderId": $scope.hospitalParams.HospitalDetails.DefaultBillingProviderId,
                /*   "TimeOut": $scope.hospitalParams.HospitalDetails.TimeOut*/
                "OrganizationShortName": $scope.hospitalParams.HospitalDetails.OrganizationShortName,
                "FacilityTypeId": $scope.hospitalParams.HospitalDetails.FacilityTypeId,
                "PlaceOfServiceId": $scope.hospitalParams.HospitalDetails.PlaceOfServiceId,
                "ContactPerson": $scope.hospitalParams.HospitalDetails.ContactPerson,
                "FaxNo": $scope.hospitalParams.HospitalDetails.FaxNo || '',
                "CommercialNumber": $scope.hospitalParams.HospitalDetails.CommercialNumber,
                "LocationNumber": $scope.hospitalParams.HospitalDetails.LocationNumber,
                "OrgClaimNumber": $scope.hospitalParams.HospitalDetails.OrgClaimNumber,
            },
            "BillingLocation": angular.copy($scope.BillingLocation.ServiceLocationArray),

        };
        //var phType;
        //hospital_phone.length = 0;
        //for (var i = 0; i < $scope.hospitalParams.HospitalPhone.length; i++) {
        //    if ($scope.hospitalParams.HospitalPhone[i].PhType == "M") {
        //        phType = (($scope.hospitalParams.HospitalPhone[i].PhNumber).toString()).substring(0, 4);
        //    } else {
        //        phType = $scope.hospitalParams.HospitalPhone[i].PhAreaCD;
        //    }
        //    hospital_phone.push({
        //        "HospitalID": (Individual_hospitalID == undefined) ? 0 : Individual_hospitalID,
        //        "PhCntryCD": 91,
        //        "PhStateCD": 78,
        //        "PhAreaCD": parseInt(phType),
        //        "PhNumber": parseInt($scope.hospitalParams.HospitalPhone[i].PhNumber),
        //        "PhType": $scope.hospitalParams.HospitalPhone[i].PhType.toString(),
        //        "RowID": i,
        //        "PrimaryIND": "Y",
        //        "PublicDisplay": "Y"
        //    });
        //}
        hospital_phone = {
            "PhCntryCD": $scope.hospitalParams.HospitalPhone.PhCntryCD || "",
            "PhAreaCD": $scope.hospitalParams.HospitalPhone.PhAreaCD || "",
            "PhNumber": $scope.hospitalParams.HospitalPhone.PhNumber || "",
            "ContactCntryCD": $scope.hospitalParams.HospitalPhone.ContactNumber != '' ? $scope.hospitalParams.HospitalPhone.ContactCntryCD : "",
            "ContactAreaCD": $scope.hospitalParams.HospitalPhone.ContactAreaCD || "",
            "ContactNumber": $scope.hospitalParams.HospitalPhone.ContactNumber || "",
            "PrimaryIND": "Y",
            "PublicDisplay": "Y"
        };
        params['HospitalPhone'] = hospital_phone;
        eHnoteMainAdminServices.AddBranch(params, onAddUpdateBranchSuccess, onAddUpdateBranchError);
        function onAddUpdateBranchSuccess(data) {
            if (data.status == "Failure") {
                alertify.error(data.Message);
            } else {
                if ($scope.edit_status) {
                    alertify.success("Branch updated successfully");
                } else if (delete_status) {
                    alertify.success("Branch deleted successfully");
                } else {
                    alertify.success("Branch added successfully");
                }
                $scope.edit_status = false;
                delete_status = false;
                //$scope.pageShow("listview", form);
                $scope.pageShow1("listview", form);
                resetCollection();
            }

        }
        function onAddUpdateBranchError(data) {
            alertify.error(data.Message);
        }
    };
    $scope.types = "['address']";
    $scope.placeChanged = function (data) {
        data = data || '';
        if (data != '') {
            $scope.place = data[0];
        }
        $scope.latlngStatus = true;
        var lat_val;
        var lng_val;
        if (data == '') {
            $scope.place = this.getPlace();
            lat_val = $scope.place.geometry.location.lat();
            lng_val = $scope.place.geometry.location.lng();
        } else {
            lat_val = $scope.place.geometry.location.lat;
            lng_val = $scope.place.geometry.location.lng;
        }
        $scope.hospitalParams.HospitalAddress.Latitude = lat_val;
        $scope.hospitalParams.HospitalAddress.Longitude = lng_val;
        angular.forEach($scope.place.address_components, function (place) {
            angular.forEach(place.types, function (item) {
                if (item == "country") {
                    $scope.hospitalParams.HospitalAddress.Country = place.short_name;
                }
                $scope.changeCountry();
                setTimeout(function () {
                    if (item == "administrative_area_level_1") {
                        $scope.hospitalParams.HospitalAddress.State = place.short_name;
                    }
                    $scope.changeState();
                }, 50);
                setTimeout(function () {
                    if (item == "administrative_area_level_2") {
                        angular.forEach($scope.parentScope.city, function (item) {
                            if (item.CityIDDesc == place.short_name) {
                                $timeout(function () {
                                    $window.dispatchEvent(new Event("resize"));
                                }, 100);
                                $scope.hospitalParams.HospitalAddress.CityTown = item.CityID;
                            }
                        });
                    }
                    $scope.changeCity();
                }, 100);
                setTimeout(function () {
                    if (item == "sublocality_level_1") {
                        $scope.changeCity();
                        $scope.hospitalParams.HospitalAddress.Location = "";
                    }
                    $scope.changeLocation();
                }, 200);
            });
        });
    };
    $scope.clearSearchVal = function () {
        $scope.searchText.search = "";
        branchListing();
    };

    $scope.viewAddBranch = function () {
        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "viewbranchadding.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            "windowClass": 'inventory-full-popup',
            "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService) {
                $scope.closeAddBranchPopuup = function () {
                    $uibModalInstance.dismiss("cancel");
                };
            }
        });
    }

    $scope.AllCountryCodeList = [];
    $scope.countries = eHnotePatientAddressDataServices.getCountries(getcountriesSuccess, getcountriesFailed);
    function getcountriesSuccess(data) {
        $scope.Allcountries = data;

        $scope.AllCountryCodeList = [];
        angular.forEach($scope.Allcountries, function (citem) {
            citem.InternationalDialing = citem.InternationalDialing || "";
            if (citem.InternationalDialing != '') {
                $scope.AllCountryCodeList.push(citem);
            }
        });
        $scope.Allcountries = _.uniq($scope.Allcountries, false, function (p) { return p.InternationalDialing; });
    }
    function getcountriesFailed(data) {
    }


    $scope.changePinCode = function (val) {
        val = val || "";
        if (val.length >= 5) {
            eHnoteSettingsDataService.GetLocationsByZipCode(val).then(function (resp) {
                if (resp.data.rows.length > 0) {
                    var basedZipcode = resp.data.rows || [];
                    if (basedZipcode.length !== 0) {

                        $scope.hospitalParams.HospitalAddress.CityName = basedZipcode[0].CityName || "";
                        $scope.hospitalParams.HospitalAddress.CityTown = basedZipcode[0].CityId.toString() || "";
                        $scope.hospitalParams.HospitalAddress.StateName = basedZipcode[0].StateName || "";
                        $scope.hospitalParams.HospitalAddress.State = basedZipcode[0].StateId.toString() || "";
                        $scope.hospitalParams.HospitalAddress.Country = basedZipcode[0].CountryId.toString() || "";
                        $scope.hospitalParams.HospitalAddress.CountryName = basedZipcode[0].CountryName || "";
                        $scope.getStatesByCountry($scope.hospitalParams.HospitalAddress.Country);
                        $scope.getCitiesByState($scope.hospitalParams.HospitalAddress.State);
                        $scope.searchCountyByZipCode(val);
                    }
                }
            });
        }
        else {
            $scope.hospitalParams.HospitalAddress.CityTown = "";
            $scope.hospitalParams.HospitalAddress.CityName = "";
            $scope.hospitalParams.HospitalAddress.State = "";
            $scope.hospitalParams.HospitalAddress.StateName = "";
            $scope.hospitalParams.HospitalAddress.Country = "";
            $scope.hospitalParams.HospitalAddress.CountryName = "";
            $scope.hospitalParams.HospitalAddress.CountyName = "";
            $scope.hospitalParams.HospitalAddress.CountyId = "";
        }
    }
    $scope.searchCountyByZipCode = function (zipcode) {
        eHnoteSettingsDataService.getCountiesByZipCode(zipcode).then(function (resp) {
            if (resp.data.Status === "Success") {
                $scope.countyCodesArray = resp.data.rows || [];
                if ($scope.countyCodesArray.length > 0) {
                    $scope.hospitalParams.HospitalAddress.CountyName = resp.data.rows[0].CountyName || "";
                    $scope.hospitalParams.HospitalAddress.CountyId = resp.data.rows[0].CountyId || '';
                } else {
                    $scope.hospitalParams.HospitalAddress.CountyName = "";
                    $scope.hospitalParams.HospitalAddress.CountyId = "";
                }
            }
        });
    };

    $scope.ONchangeCounty = function (item, type) {
        if (type === "county") {
            $scope.hospitalParams.HospitalAddress.CountyName = item.CountyName;
            $scope.hospitalParams.HospitalAddress.CountyId = item.CountyId;
        }
    }
    $scope.ChangeCounty = function (item, subitem, type) {
        subitem.CountyCodeObj = subitem.CountyCodeObj || "";
        if (type === "County") {
            item.hospitalParams.CountyName = subitem.CountyCodeObj.CountyName;
            item.hospitalParams.CountyId = subitem.CountyCodeObj.CountyId;
        }
    }


    $scope.PhoneNumberFocus = false;
    $scope.PhoneAreaCD = function () {
        $scope.PhoneNumberFocus = false;
        if ($scope.hospitalParams.HospitalPhone.PhAreaCD.length === 3) {
            $scope.PhoneNumberFocus = true;
        }
        else {
            $scope.PhoneNumberFocus = false;
        }
    };

    $scope.ContactNumberFocus = false;
    $scope.ContactAreaCD = function () {
        $scope.ContactNumberFocus = false;
        if ($scope.hospitalParams.HospitalPhone.ContactAreaCD.length === 3) {
            $scope.ContactNumberFocus = true;
        }
        else {
            $scope.ContactNumberFocus = false;
        }
    };


    $scope.changeCity1 = function (type) {
        if (type == "") {
            $scope.hospitalParams.HospitalAddress.CityTown = "";
        }
    }
    $scope.OnCity = function (item) {
        $scope.hospitalParams.HospitalAddress.CityTown = item.CityName || "";
        eHnotePatientAddressDataServices.SearchCity(item.CityName).then(function (resp) {
            if (resp.data.length > 0) {
                $scope.hospitalParams.HospitalAddress.State = resp.data[0].StateName;
            }

        });
    }

    $scope.getAddedCities = function (val) {
        var params = {
            "UserId": doctorinfo.doctorid,
            "SearchText": val,
            "StateId": ""
        };
        return eHnotePatientDataService.getFrequentlyUsedCitiesByUserId(params).then(function (resp) {

            if (resp.data.rows !== undefined) {
                return resp.data.rows.map(function (item) {
                    return item;
                });
            }
        });
    };

    $scope.changeState1 = function (type) {
        if (type == "") {
            $scope.hospitalParams.HospitalAddress.State = "";

        }
    }
    $scope.ONchangeState = function (item, type) {
        if (type === "Address") {
            $scope.hospitalParams.HospitalAddress.State = item.StateName;
            $scope.hospitalParams.HospitalAddress.CityTown = "";
        }
    }

    $scope.pageShow1 = function (val, addUpdateBranchForm) {

        if (!$scope.UserAccessRights.AllAccessRights.AdminAddNewBranch) {
            alertify.error("Sorry You Dont have Access,Please Contact Administrator");
            return false;
        }
        addUpdateBranchForm = addUpdateBranchForm || '';

        if (val == "view") {
            $scope.hospitalParams.HospitalAddress.StateName = $scope.hospitalParams.HospitalAddress.StateName;
            $scope.hospitalParams.HospitalAddress.CountryName = $scope.hospitalParams.HospitalAddress.CountryName;
            $scope.hospitalParams.HospitalAddress.CityName = $scope.hospitalParams.HospitalAddress.CityName;
            $scope.hospitalParams.HospitalAddress.CountyName = $scope.hospitalParams.HospitalAddress.CountyName;
            $scope.viewAddBranchDetails = true;
            $timeout(function () {
                $window.dispatchEvent(new Event("resize"));
            }, 100);
        }
        else if (val == "list") {
            branchListing();
            $scope.showlistview = false;
            $scope.viewAddBranchDetails = false;
            $scope.branchList = true;
            $scope.addUpdateBranch = false;
            if (addUpdateBranchForm != "") {
                addUpdateBranchForm.$setPristine(true);
                addUpdateBranchForm.submited = false;
                addUpdateBranchForm.$setUntouched();
            }
        }
        else {
            branchListing();
            $scope.viewAddBranchDetails = false;
        }
        $scope.changeCountry();
        $scope.changeState();
        $scope.changeCity();
        $scope.hospitalParams.HospitalAddress.State = $scope.hospitalParams.HospitalAddress.StateId ? $scope.hospitalParams.HospitalAddress.StateId.toString() : '';
        $scope.hospitalParams.HospitalAddress.Country = $scope.hospitalParams.HospitalAddress.CountryId ? $scope.hospitalParams.HospitalAddress.CountryId.toString() : '';
        $scope.hospitalParams.HospitalAddress.CityTown = $scope.hospitalParams.HospitalAddress.CityId ? $scope.hospitalParams.HospitalAddress.CityId.toString() : '';
        $scope.hospitalParams.HospitalAddress.CountyId = $scope.hospitalParams.HospitalAddress.CountyId ? $scope.hospitalParams.HospitalAddress.CountyId.toString() : '';
        $scope.getStatesByCountry($scope.hospitalParams.HospitalAddress.Country);
        $scope.getCitiesByState($scope.hospitalParams.HospitalAddress.State);
    };

    $scope.ChangeUsFormate = function (phoneNumberString) {
        $scope.USnumberString = phoneNumberString || "";
        if ($scope.USnumberString != "") {
            console.log($scope.USnumberString);
            const match = phoneNumberString
                .replace(/\D+/g, '')
                .match(/([^\d]*\d[^\d]*){1,10}$/)[0]
            const part1 = match.length > 3 ? `(${match.substring(0, 3)})` : match
            const part2 = match.length > 3 ? ` ${match.substring(3, 6)}` : ''
            const part3 = match.length > 6 ? `-${match.substring(6, 10)}` : ''
            $scope.hospitalParams.HospitalPhone.MobileNo = part1 + part2 + part3;

            if ($scope.USnumberString.length > 9) {
                var Area = $scope.USnumberString.slice(0, 3);
                $scope.hospitalParams.HospitalPhone.PhAreaCD = Area;
                var contact = $scope.USnumberString.substring(3, ($scope.USnumberString.toString()).length);
                $scope.hospitalParams.HospitalPhone.PhNumber = contact;
            }
        } else {
            $scope.hospitalParams.HospitalPhone.MobileNo = "";
            $scope.hospitalParams.HospitalPhone.PhAreaCD = "";
            $scope.hospitalParams.HospitalPhone.PhNumber = "";
        }
    }

    $scope.ChangeUsFormate1 = function (phoneNumberString) {
        $scope.USAlternatenumberString = phoneNumberString || "";
        if ($scope.USAlternatenumberString != "") {
            console.log($scope.USAlternatenumberString);
            const match = phoneNumberString
                .replace(/\D+/g, '')
                .match(/([^\d]*\d[^\d]*){1,10}$/)[0]
            const part1 = match.length > 3 ? `(${match.substring(0, 3)})` : match
            const part2 = match.length > 3 ? ` ${match.substring(3, 6)}` : ''
            const part3 = match.length > 6 ? `-${match.substring(6, 10)}` : ''
            //  return `${part1}${part2}${part3}`;
            $scope.hospitalParams.HospitalPhone.ContactNo = part1 + part2 + part3;

            if ($scope.USAlternatenumberString.length > 9) {
                var Area = $scope.USAlternatenumberString.slice(0, 3);
                $scope.hospitalParams.HospitalPhone.ContactAreaCD = Area;
                var contact = $scope.USAlternatenumberString.substring(3, ($scope.USAlternatenumberString.toString()).length);
                $scope.hospitalParams.HospitalPhone.ContactNumber = contact;
            } else if ($scope.USAlternatenumberString.length <= 9) {
                var Area = $scope.USAlternatenumberString.slice(0, 3);
                $scope.hospitalParams.HospitalPhone.ContactAreaCode = Area;
                var contact = $scope.USAlternatenumberString.substring(3, ($scope.USAlternatenumberString.toString()).length);
                $scope.hospitalParams.HospitalPhone.ContactNumber = contact;
            }
        } else {
            $scope.hospitalParams.HospitalPhone.ContactNo = "";
            $scope.hospitalParams.HospitalPhone.ContactAreaCD = "";
            $scope.hospitalParams.HospitalPhone.ContactNumber = "";
        }
    }



    $scope.AdminSubtab = 1;
    $scope.switchBranchTab = function (tabno) {
        $scope.AdminSubtab = tabno;
        $scope.HolidaysParams.DateFocus = false;
        $scope.HolidaysParams.EventDate = "";
        $scope.HolidaysParams.EventId = 0;
        $scope.HolidaysParams.EventEndDate = "";
        $scope.HolidaysParams.EventName = "";
        $scope.HolidaysParams.EventsList = "";
        $scope.SelectedHolidayobj.IsEdit = false;
        $scope.SelectedHolidayobj.IsEdit = false;
        $scope.HolidaysParams.EnableUpdate = false;
        $scope.HolidaysParams.EnableUpdatebutton = false;
        $scope.OrganizationFacilityObj = getorganizationfacilities();
        $scope.newServiceFacilities = getServiceFacilities();
        $scope.ClearHouseobj = angular.copy($scope.GetClearhouseobj());
        $scope.clearingHouseAddObj.IsAddDivShow = false;
        $scope.showcondition = false;
        $scope.FacilityAddObj.IsShowFacilitySetup = false;
        if ($scope.AdminSubtab === 1 || $scope.AdminSubtab === 4 || $scope.AdminSubtab === 5) {
            $scope.GetOrgBillingProviders();
        }
        else if ($scope.AdminSubtab === 6) {
            $scope.getManagePaymentDevices();
        }
        else {

        }
    }

    $scope.modifyHeaderImgPrintImgLogo = function (file) {
        const allowedTypes = ['image/jpeg', 'image/png'];

        // Check if file is present and matches one of the allowed types
        if (!allowedTypes.includes(file.type)) {
            alert("Please upload a valid JPEG or PNG image file.");
            file = null;
            $scope.hospitalParams.HospitalDetails.OrganizationLogoUrl = null;
            return;
        }
        var fd = new FormData();
        if (file === null) {
            return;
        }
        fd.append("file", file);
        fd.append("UserId", doctorinfo.doctorid);
     /*   fd.append("BranchId", doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID);*/
        fd.append("BranchId", $scope.hospitalParams.HospitalDetails.HospitalID);
        eHnoteMainAdminServices.AddUpdateOrganizationLogoUrl(fd, callbacksuccess, callbackfailure);
        function callbacksuccess(resp) {
            if (resp.status === "Success") {
                $scope.hospitalParams.HospitalDetails.OrganizationLogoUrl = resp.OrganizationLogoUrl;
            }
        }

        function callbackfailure(error) {

        }
    };
    $scope.EnableSave = false;
    $scope.EnableDefaultSave = function () {
        $scope.EnableSave = true;
    }

    $scope.GetMasterBranchData = function () {

        $scope.masterBranchAttributes = [];
        eHnoteSettingsDataService.GetMasterBranchAttributes().success(function (resp) {
            console.log(resp)
            $scope.masterBranchAttributes = resp;
            $scope.masterBranchAttributes = $scope.masterBranchAttributes || [];
            $scope.TypeName = "";
            if ($scope.masterBranchAttributes[0].TypeId = 4) {
                $scope.filterLSName = [];
                $scope.filterLSName = $filter("filter")($scope.masterBranchAttributes, { "TypeId": $scope.masterBranchAttributes[0].TypeId }, true) || [];
            }
            if ($scope.masterBranchAttributes[4].TypeId = 3) {
                $scope.filterLSCode = [];
                $scope.filterLSCode = $filter("filter")($scope.masterBranchAttributes, { "TypeId": $scope.masterBranchAttributes[4].TypeId }, true) || [];
            }
            if ($scope.masterBranchAttributes[39].TypeId = 2) {
                $scope.filterFormat = [];
                $scope.filterFormat = $filter("filter")($scope.masterBranchAttributes, { "TypeId": $scope.masterBranchAttributes[39].TypeId }, true) || [];
            }
            if ($scope.masterBranchAttributes[42].TypeId = 1) {
                $scope.filterAdmission = [];
                $scope.filterAdmission = $filter("filter")($scope.masterBranchAttributes, { "TypeId": $scope.masterBranchAttributes[42].TypeId }, true) || [];
            }
            if ($scope.masterBranchAttributes[47].TypeId = 5) {
                $scope.filterSource = [];
                $scope.filterSource = $filter("filter")($scope.masterBranchAttributes, { "TypeId": $scope.masterBranchAttributes[47].TypeId }, true) || [];
            }
        }).error(function (error) {
            alertify.error("Getting Master Branch Attributes failed");
        });
    };

    $scope.HolidaysParams = {
        "UserId": doctorinfo.doctorid,
        "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
        "EventsList": [],
        "EventId": 0,
        "EventName": "",
        "CalendarYear": "",
        "CalendarMonth": "",
        "EventDate": "",
        "EventEndDate": "",
        "DeleteInd": "N",
        "EnableUpdate": false,
        "EnableUpdatebutton": false,
    }
    $scope.SelectedNotesobj = {
        "IsEdit": false,
        "index": null,
    };

    /*function getExactDates(startDate, stopDate) {
        var dateArray = [];
        var currentDate = moment(startDate);
        var stopDate = moment(stopDate);
        //var NoOfdays = stopDate.diff(currentDate, 'days');


        *//*        console.log(currentDate + "currentDate_" + stopDate + "_stopDate_" + NoOfdays);*//*

//var diffDays = parseInt(NoOfdays);
//var newstopDate = moment(stopDate);

//console.log(diffDays);
//console.log(newstopDate);

while (currentDate <= stopDate) {
    *//*if (currentDate.isoWeekday() <= 5) {*//*
    var obj = {
        "FullDate": $filter('date')(new Date(currentDate), 'MM-dd-yyyy'),
        "Date": $filter('date')(new Date(currentDate), 'd'),
        "Day": $filter('date')(new Date(currentDate), 'EEE'),
        "Month": $filter('date')(new Date(currentDate), 'M')
    }
    dateArray.push(obj)
*//*}*//*
    currentDate = moment(currentDate).add(1, 'days');
}
return dateArray;
}*/
    //function getnewUserrleaveobj() {
    //    var obj = {
    //        //"CreatedUserId": $scope.UserId,
    //        "CreatedUserId": doctorinfo.doctorid,
    //        /*   "UserId": $scope.MainUserObj.BasicInfo.UserId,*/
    //        "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
    //        "AllBranchIndicator": "N",
    //        "LeavesList": []
    //    }

    //    return obj;
    //}
    //$scope.getNewUserLeaveReqObj = getnewUserrleaveobj();

    //$scope.AddHolidaysList = function () {
    //    var date = new Date($scope.HolidaysParams.EventDate);
    //    //var currentDate = new Date();

    //    //if (date < currentDate) {
    //    //    alertify.error("Holiday Start Date should be on or after the current date");
    //    //    return false;
    //    //}
    //    var endDate = new Date($scope.HolidaysParams.EventEndDate);
    //    var multipleDates = [];
    //    var stDate = $filter('date')(new Date($scope.HolidaysParams.EventDate), "yyyy-MM-dd");
    //    var etDate = $filter('date')(new Date($scope.HolidaysParams.EventEndDate), "yyyy-MM-dd");
    //    if ($scope.HolidaysParams.EventName == "") {
    //        alertify.error("Enter Event Name");
    //        return false;
    //    }
    //    multipleDates = getExactDates(stDate, etDate);
    //    angular.forEach(multipleDates, function (ditem) {
    //        ditem.FullDate = $filter('date')(new Date(ditem.FullDate), "yyyy-MM-dd");
    //        var reobj = {
    //            "EventId": 0,
    //            "EventName": $scope.HolidaysParams.EventName,
    //            "EventDate": ditem.FullDate,
    //            "DeleteInd": "N"
    //        };

    //        $scope.getNewUserLeaveReqObj.OrganizationId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
    //        $scope.getNewUserLeaveReqObj.LeavesList.push(reobj);
    //    });






    //    var year = date.getFullYear();
    //    var month = date.getMonth() + 1;
    //    if ($scope.HolidaysParams.EventDate == "") {
    //        alertify.error("Please select Holiday Start Date");
    //        return false;
    //    }
    //    if ($scope.HolidaysParams.EventEndDate == "") {
    //        alertify.error("Please select Holiday End Date");
    //        return false;
    //    }
    //    if (endDate < date) {
    //        alertify.error("Holiday End Date cannot be before Holiday Start Date");
    //        return false;
    //    }


    //    //$scope.HolidaysParams.EventDate = $filter("date")(new Date($scope.HolidaysParams.EventDate), "yyyy-MM-dd");
    //    $scope.HolidaysParams.EventsList = $scope.HolidaysParams.EventsList || [];
    //    var obj = {
    //        "EventId": $scope.HolidaysParams.EventId || 0,
    //        "EventName": $scope.HolidaysParams.EventName || "",
    //        "CalendarYear": $scope.HolidaysParams.CalendarYear == "" ? year : "",
    //        "CalendarMonth": $scope.HolidaysParams.CalendarMonth == "" ? month : "",
    //        "EventDate": $scope.HolidaysParams.EventDate || "",
    //        "EventEndDate": $scope.HolidaysParams.EventEndDate || "",
    //        "DeleteInd": $scope.HolidaysParams.DeleteInd || "N",
    //    }

    //    $scope.HolidaysParams.EventsList.push(obj);
    //    $scope.HolidaysParams.EventDate = "";
    //    $scope.HolidaysParams.EventEndDate = "";
    //    $scope.HolidaysParams.EventName = "";
    //    $scope.SelectedHolidayobj.IsEdit = true;
    //}

    $scope.EditHolidayList = function (item, index) {
        $scope.index = index;
        $scope.HolidaysParams.EventDate = item.EventDate;
        $scope.HolidaysParams.EventEndDate = item.EventEndDate;
        $scope.HolidaysParams.EventName = item.EventName;
        $scope.SelectedNotesobj.index = index;
        $scope.SelectedNotesobj.IsEdit = true;
        $scope.HolidaysParams.EnableUpdate = false;
    }

    $scope.ChangeHolidaysList = function () {
        var index = $scope.SelectedNotesobj.index;
        $scope.HolidaysParams.EventsList[index].EventDate = $scope.HolidaysParams.EventDate;
        $scope.HolidaysParams.EventsList[index].EventEndDate = $scope.HolidaysParams.EventEndDate;
        $scope.HolidaysParams.EventsList[index].EventName = $scope.HolidaysParams.EventName;
        $scope.HolidaysParams.EventDate = "";
        $scope.HolidaysParams.EventEndDate = "";
        $scope.HolidaysParams.EventName = "";
        $scope.SelectedNotesobj.IsEdit = false;
        $scope.SelectedNotesobj.index = null;
    }

    //$scope.SaveHolidaysList = function () {

    //    $scope.HolidaysParams.EventsList = $scope.HolidaysParams.EventsList || [];
    //    if ($scope.HolidaysParams.EventsList.length == 0) {
    //        var date = new Date($scope.HolidaysParams.EventDate);
    //        var enddate = new Date($scope.HolidaysParams.EventEndDate);
    //        if (date > enddate) {
    //            alertify.error("Holiday Start Date cannot be after Holiday End Date");
    //            return false;
    //        }
    //        var year = date.getFullYear();
    //        var month = date.getMonth() + 1;
    //        var obj = {
    //            "EventId": $scope.HolidaysParams.EventId || 0,
    //            "EventName": $scope.HolidaysParams.EventName || "",
    //            "CalendarYear": $scope.HolidaysParams.CalendarYear == "" ? year : "",
    //            "CalendarMonth": $scope.HolidaysParams.CalendarMonth == "" ? month : "",
    //            "EventDate": $scope.HolidaysParams.EventDate || "",
    //            "EventEndDate": $scope.HolidaysParams.EventEndDate || "",
    //            "DeleteInd": $scope.HolidaysParams.DeleteInd || "N",
    //        }
    //        $scope.HolidaysParams.EventsList.push(obj);
    //    }

    //    var params = {
    //        "UserId": doctorinfo.doctorid,
    //        "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
    //        "EventsList": $scope.HolidaysParams.EventsList
    //    }

    //    eHnoteMainAdminServices.AddUpdateBranchHolidays(params, callbacksuccess, callbackfailure);
    //    function callbacksuccess(resp) {
    //        if (resp.Status === "Success") {
    //            $scope.GetHolidaysList();
    //            $scope.HolidaysParams.EventsList = [];
    //        }
    //        $scope.HolidaysParams.EventDate = "";
    //        $scope.HolidaysParams.EventEndDate = "";
    //        $scope.HolidaysParams.EventName = "";
    //        $scope.SelectedNotesobj.IsEdit = false;
    //        $scope.SelectedHolidayobj.IsEdit = false;
    //        $scope.HolidaysParams.EnableUpdate = false;
    //    }
    //    function callbackfailure(error) {
    //    }
    //}

    //$scope.GetHolidaysList = function () {
    //    var params = {
    //        "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID
    //    }
    //    eHnoteMainAdminServices.GetBranchHolidaysList(params, callbacksuccess, callbackfailure);
    //    function callbacksuccess(resp) {
    //        if (resp.status === "Success") {
    //            $scope.HolidaysData = [];
    //            $scope.HolidaysData = resp.rows;

    //            if ($scope.HolidaysData.length > 0) {
    //                angular.forEach($scope.HolidaysData, function (item) {
    //                    item.EventDate = $filter("date")(item.EventDate, "MM-dd-yyyy");
    //                    item.EventEndDate = $filter("date")(item.EventEndDate, "MM-dd-yyyy");
    //                });
    //            }
    //        }
    //    }
    //    function callbackfailure(error) {
    //    }
    //}

    $scope.DeleteHolidayList = function (item) {
        item = item || "";
        item.DeleteInd = "Y"
        $scope.HolidaysParams.EventsList = $scope.HolidaysParams.EventsList || [];
        $scope.HolidaysParams.EventsList.push(item);
        //$scope.getNewUserLeaveReqObj.LeavesList = $scope.getNewUserLeaveReqObj.LeavesList || [];
        //$scope.getNewUserLeaveReqObj.LeavesList.push(item);
        var params = {
            "UserId": doctorinfo.doctorid,
            /* "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,*/
            "OrganizationId": $scope.hospitalParams.HospitalDetails.HospitalID || 0,
            "EventsList": $scope.HolidaysParams.EventsList
        }
        eHnoteMainAdminServices.AddUpdateBranchHolidays(params, callbacksuccess, callbackfailure);
        function callbacksuccess(resp) {
            if (resp.Status === "Success") {
                $scope.getUserLeavesList();
                $scope.filteredLeavesArray = [];
                alertify.success("Deleted Successfully");
            }
        }
        function callbackfailure(error) {
        }
    }
    $scope.HolidaysParams.DateFocus = false;
    $scope.ChangeDate = function (item, val) {
        if (val === 1) {
            item.DateFocus = !item.DateFocus;
        }
        if (val === 2) {
            item.EndDateFocus = !item.EndDateFocus;
        }
    }
    $scope.EditHolidayData = function (item, index) {
        //var index = $scope.SelectedNotesobj.index;
        var index = index;
        $scope.HolidaysParams.EventDate = item.EventDate;
        $scope.HolidaysParams.EventEndDate = item.EventDate;
        $scope.HolidaysParams.EventName = item.EventName;
        $scope.HolidaysParams.EventId = item.EventId;
        //$scope.EditEventsList = [];
        //$scope.EditEventsList.push(item);
        $scope.filteredLeavesArray[index].EventId = $scope.HolidaysParams.EventId;
        $scope.filteredLeavesArray[index].EventDate = $scope.HolidaysParams.EventDate;
        /*   $scope.EditEventsList[index].EventEndDate = $scope.HolidaysParams.EventEndDate;*/
        $scope.filteredLeavesArray[index].EventName = $scope.HolidaysParams.EventName;
        $scope.HolidaysParams.EnableUpdate = false;
        $scope.HolidaysParams.EnableUpdatebutton = true;
    }
    $scope.CancelHolidaysList = function () {
        $scope.HolidaysParams.EventDate = "";
        $scope.HolidaysParams.EventEndDate = "";
        $scope.HolidaysParams.EventName = "";
        $scope.HolidaysParams.EventsList = [];
        //$scope.SelectedHolidayobj.IsEdit = false;
        $scope.SelectedNotesobj.IsEdit = false;
        //$scope.getNewUserLeaveReqObj.LeavesList = [];
        $scope.HolidaysParams.EnableUpdate = false;
        $scope.HolidaysParams.EnableUpdatebutton = false;
        $scope.HolidaysParams.EventId = 0;
    }
    $scope.SelectedHolidayobj = {
        "IsEdit": false,
        "index": null,
    };
    $scope.ClearHolidaysList = function (HolidaysParams) {
        if (HolidaysParams) {
            HolidaysParams.EventDate = "";
            HolidaysParams.EventEndDate = "";
            HolidaysParams.EventName = "";
            HolidaysParams.EnableUpdate = false;

        }

    };

    $scope.SaveHolidaysList = function () {
        if ($scope.HolidaysParams.EventDate == "") {
            alertify.error("Please Select Start Date");
            return false;
        }
        if ($scope.HolidaysParams.EventName == "") {
            alertify.error("Please Enter EventName");
            return false;
        }

        var multipleDates = [];
        var stDate = $filter('date')(new Date($scope.HolidaysParams.EventDate), "yyyy-MM-dd");
        var etDate = $filter('date')(new Date($scope.HolidaysParams.EventEndDate), "yyyy-MM-dd");
        var year = new Date().getFullYear();
        var month = new Date().getMonth() + 1;
        multipleDates = getExactDates(stDate, etDate);

        angular.forEach(multipleDates, function (ditem) {
            ditem.FullDate = $filter('date')(new Date(ditem.FullDate), "yyyy-MM-dd");
            var reobj = {
                "EventId": $scope.HolidaysParams.EventId || 0,
                "EventName": $scope.HolidaysParams.EventName,
                "EventDate": ditem.FullDate,
                "DeleteInd": "N"
            };

            $scope.HolidaysParams.OrganizationId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            if (!Array.isArray($scope.HolidaysParams.EventsList)) {
                $scope.HolidaysParams.EventsList = [];
            }
            var isDuplicate = $scope.HolidaysParams.EventsList.some(function (event) {
                return event.EventDate === reobj.EventDate;
            });

            if (!isDuplicate) {
                $scope.HolidaysParams.EventsList.push(reobj);
            }
        });

        var params = {
            "EventId": $scope.HolidaysParams.EventId || 0,
            "UserId": doctorinfo.doctorid,
            "OrganizationId": $scope.hospitalParams.HospitalDetails.HospitalID,
            "EventsList": $scope.HolidaysParams.EventsList,
        };

        eHnoteMainAdminServices.AddUpdateBranchHolidays(params, callbacksuccess, callbackfailure);

        function callbacksuccess(resp) {
            if (resp.Status === "Failure") {
                alertify.error("Leave already exists for the selected date");
                $scope.HolidaysParams.EventsList = [];
                return false;
            }
            if (resp.Status === "Success") {
                alertify.success("Leave Added Successfully");
                $scope.getUserLeavesList();
                $scope.HolidaysParams.EventsList = [];
            }
            resetHolidaysParams();
            $scope.CancelHolidaysList();
        }

        function callbackfailure(err) {
            alertify.success("Updating Failed");
        }
    };

    function resetHolidaysParams() {
        $scope.HolidaysParams.EventId = 0;
        $scope.HolidaysParams.EventDate = "";
        $scope.HolidaysParams.EventEndDate = "";
        $scope.HolidaysParams.EventName = "";
        $scope.HolidaysParams.DeleteInd = "N";
        $scope.SelectedHolidayobj.IsEdit = true;
        $scope.SelectedNotesobj.IsEdit = false;
    }


    //$scope.SaveHolidaysList = function () {
    //    $scope.HolidaysParams.EventsList = $scope.HolidaysParams.EventsList || [];
    //    if ($scope.HolidaysParams.EventsList.length == 0) {
    //        if ($scope.HolidaysParams.EventDate == "" || null) {
    //            alertify.error("Please Select Start Date");
    //            return false;
    //        }
    //        if ($scope.HolidaysParams.EventName == "" || null) {
    //            alertify.error("Please Enter EventName");
    //            return false;
    //        }
    //        var year = new Date().getFullYear(); 
    //        var month = new Date().getMonth() + 1;
    //        var obj = {
    //            "EventId": $scope.HolidaysParams.EventId || 0,
    //            "EventName": $scope.HolidaysParams.EventName || "",
    //            "EventDate": $scope.HolidaysParams.EventDate || "",
    //            "CalendarYear": $scope.HolidaysParams.CalendarYear == "" ? year : $scope.HolidaysParams.CalendarYear,
    //           "CalendarMonth": $scope.HolidaysParams.CalendarMonth == "" ? month : $scope.HolidaysParams.CalendarMonth,
    //         /*   "EventEndDate": $scope.HolidaysParams.EventEndDate || "",*/
    //            "DeleteInd": $scope.HolidaysParams.DeleteInd || "N",
    //            "UserId": doctorinfo.doctorid,
    //           /* "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,*/
    //            "OrganizationId": $scope.hospitalParams.HospitalDetails.HospitalID || 0,
    //           /* "EventsList": $scope.HolidaysParams.EventsList*/
    //        };
    //        $scope.HolidaysParams.OrganizationId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
    //        $scope.HolidaysParams.EventsList.push(obj);
    //    }
    //    console.log($scope.HolidaysParams);
    //    var params = {
    //        "UserId": doctorinfo.doctorid,
    //        /*   "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,*/
    //        "OrganizationId": $scope.hospitalParams.HospitalDetails.HospitalID,
    //        "EventsList": $scope.HolidaysParams.EventsList,
    //    //    "getNewUserLeaveReqObj": $scope.getNewUserLeaveReqObj
    //    }

    //    eHnoteMainAdminServices.AddUpdateBranchHolidays(params, callbacksuccess, callbackfailure);
    //     /*   console.log(resp);*/

    //    function callbacksuccess(resp) {
    //        if (resp.Status === "Failure") {
    //            alertify.error("Leave on this date already exists for this Date");
    //            $scope.HolidaysParams.EventsList = [];
    //            return false;
    //        }
    //            if (resp.Status === "Success") {
    //                alertify.success("Leave Added Successfully");
    //                $scope.getUserLeavesList();
    //                $scope.HolidaysParams.EventsList = [];
    //            }
    //            $scope.HolidaysParams.EventDate = "";
    //            $scope.HolidaysParams.EventEndDate = "";
    //            $scope.HolidaysParams.EventName = "";
    //            $scope.SelectedNotesobj.IsEdit = false;
    //            $scope.SelectedHolidayobj.IsEdit = false;
    //            $scope.HolidaysParams.EnableUpdate = false;
    //            $scope.HolidaysParams.EventsList = [];
    //        }

    //        function callbackfailure(err) {
    //            alertify.success("Updating Failed");
    //        }
    //        //if (resp.Status == "Failure") {
    //        //    alertify.error("Leave on this date already exists for the user");
    //        //    return false;
    //        //}

    //        //if (resp.Status === "Success") {
    //        //    alertify.success("Leave Added Successfully");
    //        //    $scope.GetBranchHolidaysList();
    //        //}
    //        //$scope.HolidaysParams.EventDate = "";
    //        //$scope.HolidaysParams.EventEndDate = "";
    //        //$scope.HolidaysParams.EventName = "";
    //        //$scope.SelectedNotesobj.IsEdit = false;
    //        //$scope.SelectedHolidayobj.IsEdit = false;
    //        //$scope.HolidaysParams.EnableUpdate = false;

    //};
    function getnewLeaveObj() {
        var obj = {
            "UserId": doctorinfo.doctorid,
            "CalendarYear": null, // new Date().getFullYear(),
            //"BranchId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID
            "BranchId": $scope.hospitalParams.HospitalDetails.HospitalID

        };

        return obj;
    }
    $scope.getUserLeavereqObj = getnewLeaveObj();
    $scope.distinctYears = [];
    $scope.getUserLeavesList = function () {
        //$scope.getUserLeavereqObj.BranchId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        $scope.getUserLeavereqObj.BranchId = $scope.hospitalParams.HospitalDetails.HospitalID;
        console.log($scope.getUserLeavereqObj);
        var params = {
            "UserId": doctorinfo.doctorid,
            "OrganizationId": $scope.hospitalParams.HospitalDetails.HospitalID,
            //   "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            /*   "EventsList": $scope.HolidaysParams.EventsList,*/
            /* "getNewUserLeaveReqObj": $scope.getNewUserLeaveReqObj*/
        }

        eHnoteMainAdminServices.GetBranchHolidaysList(params, callbacksuccess, callbackfailure);

        function callbacksuccess(resp) {
            $scope.distinctYears = [];
            if (resp.status === "Success") {
                $scope.HolidaysData = [];
                $scope.filteredLeavesArray = [];
                $scope.HolidaysData = resp.EventsList;
                if ($scope.HolidaysData.length > 0) {
                    angular.forEach($scope.HolidaysData, function (item) {
                        item.EventDate = $filter("date")(item.EventDate, "MM-dd-yyyy");
                        item.CalendarYear = new Date(item.EventDate).getFullYear();
                        /*item.EventEndDate = $filter("date")(item.EventEndDate, "MM-dd-yyyy");*/
                    });
                    $scope.filterLeavesMain($scope.selectedYear, $scope.Search.IsExpired);
                    angular.forEach($scope.HolidaysData, function (item) {
                        var year = new Date(item.EventDate).getFullYear();
                        if ($scope.distinctYears.indexOf(year) === -1) {

                            $scope.distinctYears.push(year);
                        }
                    });
                }
            }
        }
        function callbackfailure(error) {
        }
    }

    $scope.deleteLeave = function (item, index) {
        var index = $scope.HolidaysParams.EventsList.indexOf(item);
        if (item.UserLeaveId === 0) {
            if (index > -1) {
                $scope.HolidaysParams.EventsList.splice(index, 1);
            }
        } else {
            $scope.HolidaysParams.EventsList[index].DeleteInd = "Y";
        }
        //$scope.SelectedLeaveobj.IsEdit = false;
        //$scope.SelectedLeaveobj.IsUpdate = false;
        $scope.SelectedNotesobj.IsEdit = false;

    };

    function getExactDates(startDate, stopDate) {
        var dateArray = [];
        var currentDate = moment(startDate);
        var stopDate = moment(stopDate);

        while (currentDate <= stopDate) {
            /*if (currentDate.isoWeekday() <= 5) {*/
            var obj = {
                "FullDate": $filter('date')(new Date(currentDate), 'MM-dd-yyyy'),
                "Date": $filter('date')(new Date(currentDate), 'd'),
                "Day": $filter('date')(new Date(currentDate), 'EEE'),
                "Month": $filter('date')(new Date(currentDate), 'M')
            }
            dateArray.push(obj);
            /* }*/
            currentDate = moment(currentDate).add(1, 'days');
        }
        return dateArray;
    }

    //$scope.AddHolidaysList = function () {
    //    if ($scope.HolidaysParams.EventDate == "") {
    //        alertify.error("Please Select Start Date");
    //        return false;
    //    }
    //    if ($scope.HolidaysParams.EventName == "") {
    //        alertify.error("Please Enter EventName");
    //        return false;
    //    }

    //    var multipleDates = [];
    //    var stDate = $filter('date')(new Date($scope.HolidaysParams.EventDate), "yyyy-MM-dd");
    //    var etDate = $filter('date')(new Date($scope.HolidaysParams.EventEndDate), "yyyy-MM-dd");
    //    var year = new Date().getFullYear();
    //    var month = new Date().getMonth() + 1;
    //    multipleDates = getExactDates(stDate, etDate);

    //    angular.forEach(multipleDates, function (ditem) {
    //        ditem.FullDate = $filter('date')(new Date(ditem.FullDate), "yyyy-MM-dd");
    //        var reobj = {
    //            "EventId": 0,
    //            "EventName": $scope.HolidaysParams.EventName,
    //            "EventDate": ditem.FullDate,
    //            "DeleteInd": "N"
    //        };

    //        $scope.HolidaysParams.OrganizationId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
    //        if (!Array.isArray($scope.HolidaysParams.EventsList)) {
    //            $scope.HolidaysParams.EventsList = [];
    //        }
    //        var isDuplicate = $scope.HolidaysParams.EventsList.some(function (event) {
    //            return event.EventDate === reobj.EventDate;
    //        });

    //        if (!isDuplicate) {
    //            $scope.HolidaysParams.EventsList.push(reobj);
    //        }
    //    });

    //    //var obj = {
    //    //    "EventId": $scope.HolidaysParams.EventId || 0,
    //    //    "EventName": $scope.HolidaysParams.EventName || "",
    //    //    "CalendarYear": $scope.HolidaysParams.CalendarYear == "" ? year : $scope.HolidaysParams.CalendarYear,
    //    //    "CalendarMonth": $scope.HolidaysParams.CalendarMonth == "" ? month : $scope.HolidaysParams.CalendarMonth,
    //    //    "EventDate": $scope.HolidaysParams.EventDate || "",
    //    //    "EventEndDate": $scope.HolidaysParams.EventEndDate || "",
    //    //    "DeleteInd": $scope.HolidaysParams.DeleteInd || "N",
    //    //}

    //    //$scope.HolidaysParams.EventsList.push(obj);
    //    $scope.HolidaysParams.EventId = 0;
    //    $scope.HolidaysParams.EventDate = "";
    //    $scope.HolidaysParams.EventEndDate = "";
    //    $scope.HolidaysParams.EventName = "";
    //    $scope.HolidaysParams.DeleteInd = "N";
    //    $scope.SelectedHolidayobj.IsEdit = true;
    //    $scope.SelectedNotesobj.IsEdit = false;
    //}

    $scope.ActiveStatusArray = [{ "Id": 0, "Name": "ALL " }, { "Id": 1, "Name": "Active " }, { "Id": 2, "Name": "InActive" }];
    $scope.Search = {
        "IsExpired": 1
    };

    $scope.filterLeavesMain = function (selectedYear, selectedStatus) {


        $scope.currentdate = new Date();
        $scope.currentyear = $scope.currentdate.getFullYear();
        $scope.selectedYear = selectedYear || $scope.currentyear;
        $scope.selectedStatus = selectedStatus || 0;


        var filteredLeaves = angular.copy($scope.HolidaysData);

        var filteredLeaves = $scope.HolidaysData.filter(function (item) {
            var year = new Date(item.EventDate).getFullYear();
            console.log(year + "" + $scope.selectedYear);
            return year === parseInt($scope.selectedYear);
        });
        $scope.filteredLeavesArray = [];


        var filterleavelist = [];


        if (selectedStatus === 1) {
            angular.forEach(filteredLeaves, function (ulitem) {
                var eventDate = new Date(ulitem.EventDate);
                var currentDate = new Date();
                currentDate.setHours(0, 0, 0, 0);
                if (eventDate >= currentDate) {
                    filterleavelist.push(ulitem);
                }
            });
            $scope.Cpyfilterarray = filterleavelist;
            $scope.filteredLeavesArray = $scope.Cpyfilterarray || [];
        }
        else if (selectedStatus === 2) {
            angular.forEach(filteredLeaves, function (ulitem) {
                var eventDate = new Date(ulitem.EventDate);
                var currentDate = new Date();
                currentDate.setHours(0, 0, 0, 0);
                if (eventDate < currentDate) {
                    filterleavelist.push(ulitem);
                }
            });
            $scope.Cpyfilterarray = filterleavelist;
            $scope.filteredLeavesArray = $scope.Cpyfilterarray || [];
        }
        else {
            $scope.Cpyfilterarray = angular.copy(filteredLeaves);
            $scope.filteredLeavesArray = $scope.Cpyfilterarray || [];
        }
    };
    $scope.getUniqueYears = function () {
        var years = [];
        angular.forEach($scope.HolidaysData, function (item) {
            var year = new Date(item.EventDate).getFullYear();
            if (years.indexOf(year) === -1) {
                years.push(year);
            }
        });
        return years;
    };

    $scope.changeLStartDate = function (obj) {
        $scope.HolidaysParams.EventEndDate = obj.EventDate;
        if (obj.EventId == 0) {
            $scope.HolidaysParams.EnableUpdate = true;
        }
        else {
            $scope.HolidaysParams.EnableUpdate = false;

        }
    }
    $scope.isDateActive = function (leavedate) {


        var result = false;


        var currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        var eventDate = new Date(leavedate);
        eventDate.setHours(0, 0, 0, 0);

        //console.log(currentDate + "__" + eventDate);

        if (currentDate <= eventDate) {
            result = true;
        }
        //console.log(result);
        return result;
    };

    $scope.USContactPhone = function (number, id) {
        var obj = eHnoteUserDataService.UsMobileFormatChange(number);
        if (id == 1) {
            $scope.ClearHouseobj.ContactPhone = obj.UsFormatMobileNumber;
        } else {
            $scope.ClearHouseobj.ContactFax = obj.UsFormatMobileNumber;
        }
    }

    $scope.ClearingHouseList = [];
    $scope.GetOrganizationClearingHouseDetails = function () {

        var obj = {
            "ParentOrganizationId": parentHospitalId,
           // "OrganizationId": $scope.hospitalParams.HospitalDetails.HospitalID,
        }

        eHnoteMainAdminServices.GetOrganizationClearingHouseDetails(obj).then(function (resp) {
            console.log(resp);
            if (resp.data.Status === "Success") {
                $scope.BranchClearingHouseList = resp.data.rows || [];
                $scope.ClearingHouseList = resp.data.rows || [];
                console.log($scope.ClearingHouseList);
            }
        }, function (err) {
            console.log(err);
            alertify.error("Getting Failed");
        });


    };
    $scope.GetOrganizationClearingHouseDetails();


    $scope.SaveClearingHouseDetails = function () {

        if ($scope.ClearHouseobj.DeleteInd === "Y") {

        } else {
            $scope.ClearHouseobj.Name = $scope.ClearHouseobj.Name || "";
            //if ($scope.ClearHouseobj.Name == "") {
            //    alertify.error("Please Add Clearing House Name");
            //    return false;
            //}

            $scope.ClearHouseobj.MasterClearingHouseId = $scope.ClearHouseobj.MasterClearingHouseId || 0;
            if ($scope.ClearHouseobj.MasterClearingHouseId == 0) {
                alertify.error("Please Select Clearing House");
                return false;
            }
        }


        var obj = {

            "ParentOrganizationId": parentHospitalId,
          //  "OrganizationId": $scope.hospitalParams.HospitalDetails.HospitalID,
            "ClearingHouseID": $scope.ClearHouseobj.ClearingHouseID || 0,
            "ClearingHouseGuid": $scope.ClearHouseobj.ClearingHouseGuid,
            "ClearingHouseTypeId": $scope.ClearHouseobj.ClearingHouseTypeId || 0,
            "MasterClearingHouseId": $scope.ClearHouseobj.MasterClearingHouseId || 0,
            "PracticeId": $scope.hospitalParams.HospitalDetails.HospitalID,
            "Name": $scope.ClearHouseobj.Name,
            "ContactName": $scope.ClearHouseobj.ContactName,
            "ContactPhone": $scope.ClearHouseobj.ContactPhone,
            "ContactFax": $scope.ClearHouseobj.ContactFax,
            "AuthorizationIdentificationID": $scope.ClearHouseobj.AuthorizationIdentificationID,
            "AuthorizationIdentification": $scope.ClearHouseobj.AuthorizationIdentification,
            "AuthUserName": $scope.ClearHouseobj.AuthUserName,
            "AuthPassword": $scope.ClearHouseobj.AuthPassword,
            "SubmitterID": $scope.ClearHouseobj.SubmitterID,
            "ReceiverID": $scope.ClearHouseobj.ReceiverID,
            "InterChangeAckID": $scope.ClearHouseobj.InterChangeAckID,
            "InterChangeAck": $scope.ClearHouseobj.InterChangeAck,
            "UsageIndicatorID": $scope.ClearHouseobj.UsageIndicatorID,
            "UsageIndicator": $scope.ClearHouseobj.UsageIndicator,
            "LoopSubmitter": $scope.ClearHouseobj.LoopSubmitter,
            "ApplicationSenderCode": $scope.ClearHouseobj.ApplicationSenderCode,
            "ApplicationReceiverCode": $scope.ClearHouseobj.ApplicationReceiverCode,
            "EligiISA02": $scope.ClearHouseobj.EligiISA02,
            "EligiISA04": $scope.ClearHouseobj.EligiISA04,
            "EligiISA06": $scope.ClearHouseobj.EligiISA06,
            /*"EligiISA08": $scope.ClearHouseobj.EligiISA08,*/
            "EligiProviderNPI": $scope.ClearHouseobj.EligiProviderNPI,
            "EligibilityURL": $scope.ClearHouseobj.EligibilityURL,
            "EligibilityUserID": $scope.ClearHouseobj.EligibilityUserID,
            "EligibilityPassword": $scope.ClearHouseobj.EligibilityPassword,
            "EligibilityCallTypeID": $scope.ClearHouseobj.EligibilityCallTypeID ,
            "EligibilityCallType": $scope.ClearHouseobj.EligibilityCallType,
            "EligiGS02": $scope.ClearHouseobj.EligiGS02,
            "EligiGS03": $scope.ClearHouseobj.EligiGS03,
            "eligiBatchFtpHostName": $scope.ClearHouseobj.eligiBatchFtpHostName,
            "eligiBatchFtpUserID": $scope.ClearHouseobj.eligiBatchFtpUserID,
            "eligiBatchFtpPassword": $scope.ClearHouseobj.eligiBatchFtpPassword,
            "eligiBatchFtpType": $scope.ClearHouseobj.eligiBatchFtpType,
            "eligiBatchFtpPort": $scope.ClearHouseobj.eligiBatchFtpPort,
            "eligiBatchSubmitterID": $scope.ClearHouseobj.eligiBatchSubmitterID,
            "eligiBatchReceiverID": $scope.ClearHouseobj.eligiBatchReceiverID,
            "eligiBatchProviderNPI": $scope.ClearHouseobj.eligiBatchProviderNPI,
            "eligiBatchFTPOutFolder": $scope.ClearHouseobj.eligiBatchFTPOutFolder,
            "eligiBatchFTPInFolder": $scope.ClearHouseobj.eligiBatchFTPInFolder,

            "eligiBatch270FilePrefix": $scope.ClearHouseobj.eligiBatch270FilePrefix,
            "eligiBatch270FileExt": $scope.ClearHouseobj.eligiBatch270FileExt,
            "eligiBatch271FilePrefix": $scope.ClearHouseobj.eligiBatch271FilePrefix,
            "eligiBatch271FileExt": $scope.ClearHouseobj.eligiBatch271FileExt,

            "ClaimUploadFTPHostName": $scope.ClearHouseobj.ClaimUploadFTPHostName,
            "ClaimUploadFTPUserName": $scope.ClearHouseobj.ClaimUploadFTPUserName,
            "ClaimUploadFTPPassword": $scope.ClearHouseobj.ClaimUploadFTPPassword,
            "ClaimUploadFTPType": $scope.ClearHouseobj.ClaimUploadFTPType,
            "ClaimUploadFTPPortNumber": $scope.ClearHouseobj.ClaimUploadFTPPortNumber,
            "ClaimUploadFTPFolder": $scope.ClearHouseobj.ClaimUploadFTPFolder,

            "ClaimDownloadFTPFolder": $scope.ClearHouseobj.ClaimDownloadFTPFolder,
            "Claim277DownloadFTPFolder": $scope.ClearHouseobj.Claim277DownloadFTPFolder||'',
            "ERADownloadFolder": $scope.ClearHouseobj.ERADownloadFolder,

            "ClaimUploadFilePrefixProf": $scope.ClearHouseobj.ClaimUploadFilePrefixProf,
            "ClaimUploadFileExtProf": $scope.ClearHouseobj.ClaimUploadFileExtProf,
            "ClaimUploadFilePrefixtInst": $scope.ClearHouseobj.ClaimUploadFilePrefixtInst,
            "ClaimUploadFileExtInst": $scope.ClearHouseobj.ClaimUploadFileExtInst,

            "Claim835DownloadFilePrefix": $scope.ClearHouseobj.Claim835DownloadFilePrefix,
            "Claim835DownloadFileExt": $scope.ClearHouseobj.Claim835DownloadFileExt,
            "Claim277CADownloadFilePrefix": $scope.ClearHouseobj.Claim277CADownloadFilePrefix,
            "Claim277CADownloadFileExt": $scope.ClearHouseobj.Claim277CADownloadFileExt,
            "Claim999DownloadFilePrefix": $scope.ClearHouseobj.Claim999DownloadFilePrefix,
            "Claim999DownloadFileExt": $scope.ClearHouseobj.Claim999DownloadFileExt,

            "IsActive": $scope.ClearHouseobj.IsActive || false,
            "DeleteInd": $scope.ClearHouseobj.DeleteInd || "N"
        }

        //debugger;
        console.log($scope.ClearHouseobj.ClaimUploadFTPType + "__ClaimUploadFTPType");

        eHnoteMainAdminServices.AddUpdateOrganizationClearingHouseDetails(obj, callbacksuccess, callbackfailure);

        function callbacksuccess(resp) {
            if (resp.Status === "Success") {
                alertify.success("Data Added Successfully");
                $scope.GetOrganizationClearingHouseDetails();
                $scope.ClearHouseobj = angular.copy($scope.GetClearhouseobj());
                $scope.clearingHouseAddObj.IsAddDivShow = false;
                $scope.ClearingHouseBtn = "Save";

            } else if (resp.Status == "Failure") {
                alertify.error(resp.Message);
            }
        }
        function callbackfailure(error) {
        }
    }

    $scope.ClearHouseData = function () {
        $scope.ClearHouseobj = angular.copy($scope.GetClearhouseobj());
    };

    $scope.cancelClearingHouseData = function () {
        $scope.clearingHouseAddObj.IsAddDivShow = false;
    };

    $scope.EditClearingHouse = function (item) {
        //debugger;
        $scope.ClearHouseobj.ClearingHouseID = item.ClearingHouseID;
        $scope.ClearHouseobj.ClearingHouseGuid = item.ClearingHouseGuid;
        $scope.ClearHouseobj.Name = item.Name || "";
        $scope.ClearHouseobj.ContactName = item.ContactName || "";
        $scope.ClearHouseobj.ContactPhone = item.ContactPhone || "";
        $scope.ClearHouseobj.ContactFax = item.ContactFax || "";
        $scope.ClearHouseobj.AuthorizationIdentificationID = item.AuthorizationIdentificationID || "";
        $scope.ClearHouseobj.AuthorizationIdentification = item.AuthorizationIdentification || "";
        $scope.ClearHouseobj.AuthUserName = item.AuthUserName || "";
        $scope.ClearHouseobj.AuthPassword = item.AuthPassword || "";
        $scope.ClearHouseobj.SubmitterID = item.SubmitterID || "";
        $scope.ClearHouseobj.ReceiverID = item.ReceiverID || "";
        $scope.ClearHouseobj.InterChangeAckID = item.InterChangeAckID || "";
        $scope.ClearHouseobj.InterChangeAck = item.InterChangeAck || "";
        $scope.ClearHouseobj.LoopSubmitter = item.LoopSubmitter || "";
        $scope.ClearHouseobj.ApplicationSenderCode = item.ApplicationSenderCode || "";
        $scope.ClearHouseobj.ApplicationReceiverCode = item.ApplicationReceiverCode || "";
        $scope.ClearHouseobj.EligiISA02 = item.EligiISA02 || "";
        $scope.ClearHouseobj.EligiISA04 = item.EligiISA04 || "";
        $scope.ClearHouseobj.EligiISA06 = item.EligiISA06 || "";
        $scope.ClearHouseobj.EligiISA08 = item.EligiISA08 || "";
        $scope.ClearHouseobj.EligiProviderNPI = item.EligiProviderNPI || "";
        $scope.ClearHouseobj.EligibilityURL = item.EligibilityURL || "";
        $scope.ClearHouseobj.EligibilityUserID = item.EligibilityUserID || "";
        $scope.ClearHouseobj.EligibilityPassword = item.EligibilityPassword || "";
        $scope.ClearHouseobj.EligiGS02 = item.EligiGS02 || "";
        $scope.ClearHouseobj.EligiGS02 = item.EligiGS02 || "";
        $scope.ClearHouseobj.EligiGS03 = item.EligiGS03 || "";
        $scope.ClearHouseobj.eligiBatchFtpHostName = item.eligiBatchFtpHostName || "";
        $scope.ClearHouseobj.eligiBatchFtpUserID = item.eligiBatchFtpUserID || "";
        $scope.ClearHouseobj.eligiBatchFtpPassword = item.eligiBatchFtpPassword || "";
        $scope.ClearHouseobj.eligiBatchFtpType = item.eligiBatchFtpType || "";
        $scope.ClearHouseobj.eligiBatchFtpPort = item.eligiBatchFtpPort || "";
        $scope.ClearHouseobj.eligiBatchSubmitterID = item.eligiBatchSubmitterID || "";
        $scope.ClearHouseobj.eligiBatchReceiverID = item.eligiBatchReceiverID || "";
        $scope.ClearHouseobj.eligiBatchProviderNPI = item.eligiBatchProviderNPI || "";
        $scope.ClearHouseobj.eligiBatchFTPOutFolder = item.eligiBatchFTPOutFolder || "";
        $scope.ClearHouseobj.eligiBatchFTPInFolder = item.eligiBatchFTPInFolder || "";
        $scope.ClearHouseobj.ClaimUploadFTPHostName = item.ClaimUploadFTPHostName || "";
        $scope.ClearHouseobj.ClaimUploadFTPUserName = item.ClaimUploadFTPUserName || "";
        $scope.ClearHouseobj.ClaimUploadFTPPassword = item.ClaimUploadFTPPassword || "";
        $scope.ClearHouseobj.ClaimUploadFTPType = item.ClaimUploadFTPType || "";
        $scope.ClearHouseobj.ClaimUploadFTPPortNumber = item.ClaimUploadFTPPortNumber || "";
        $scope.ClearHouseobj.ClaimUploadFTPFolder = item.ClaimUploadFTPFolder || "";
        $scope.ClearHouseobj.ClaimUploadFilePrefixProf = item.ClaimUploadFilePrefixProf || "";
        $scope.ClearHouseobj.ClaimUploadFileExtProf = item.ClaimUploadFileExtProf || "";
        $scope.ClearHouseobj.ClaimUploadFilePrefixtInst = item.ClaimUploadFilePrefixtInst || "";
        $scope.ClearHouseobj.ClaimUploadFileExtInst = item.ClaimUploadFileExtInst || "";

        $scope.ClearHouseobj.ClaimDownloadFTPFolder = item.ClaimDownloadFTPFolder || "";
        $scope.ClearHouseobj.Claim277DownloadFTPFolder = item.Claim277DownloadFTPFolder || "";
        $scope.ClearHouseobj.ERADownloadFolder = item.ERADownloadFolder || "";
        $scope.ClearHouseobj.Claim835DownloadFilePrefix = item.Claim835DownloadFilePrefix || "";
        $scope.ClearHouseobj.Claim835DownloadFileExt = item.Claim835DownloadFileExt || "";
        $scope.ClearHouseobj.Claim277CADownloadFilePrefix = item.Claim277CADownloadFilePrefix || "";
        $scope.ClearHouseobj.Claim277CADownloadFileExt = item.Claim277CADownloadFileExt || "";
        $scope.ClearHouseobj.Claim999DownloadFilePrefix = item.Claim999DownloadFilePrefix || "";
        $scope.ClearHouseobj.Claim999DownloadFileExt = item.Claim999DownloadFileExt || "";
        $scope.ClearHouseobj.eligiBatch270FilePrefix = item.eligiBatch270FilePrefix || "";
        $scope.ClearHouseobj.eligiBatch270FileExt = item.eligiBatch270FileExt || "";
        $scope.ClearHouseobj.eligiBatch271FilePrefix = item.eligiBatch271FilePrefix || "";
        $scope.ClearHouseobj.eligiBatch271FileExt = item.eligiBatch271FileExt || "";
        $scope.ClearHouseobj.UsageIndicatorID = item.UsageIndicatorID || "";
        $scope.ClearHouseobj.UsageIndicator = item.UsageIndicator || "";
        $scope.ClearHouseobj.EligibilityCallTypeID = item.EligibilityCallTypeID || "";
        $scope.ClearHouseobj.EligibilityCallType = item.EligibilityCallType || "";


        $scope.ClearHouseobj.IsActive = item.IsActive || false;
        $scope.ClearHouseobj.ClearingHouseTypeId = item.ClearingHouseTypeId;
        $scope.ClearHouseobj.MasterClearingHouseId = item.MasterClearingHouseId;
        $scope.ClearingHouseBtn = "Update";
        $scope.clearingHouseAddObj.IsAddDivShow = true;
    }

    $scope.DeleteClearingHouse = function (item) {

        var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to delete?", function () {

            item.ClearingHouseID = item.ClearingHouseID || null;
            if (item.ClearingHouseID != null) {
                $scope.ClearHouseobj.ClearingHouseID = item.ClearingHouseID;
                $scope.ClearHouseobj.Name = item.Name;
                $scope.ClearHouseobj.MasterClearingHouseId = item.MasterClearingHouseId;
                $scope.ClearHouseobj.DeleteInd = "Y";
                $scope.SaveClearingHouseDetails();
            } else {
                $scope.ClearHouseobj.DeleteInd = "N";
            }
        },
            function () {
                $scope.$digest();
                r = "You pressed Cancel!";
            });
    }

    $scope.GetMasterClearingHouseData = function () {
        eHnoteSettingsDataService.GetMasterClearingHouseData().success(function (resp) {
            console.log(resp)
            if (resp.status == "Success") {
                $scope.GetCallingTypeList = resp.CallingType;
                $scope.GetFTPTypeList = resp.FTPType;
                $scope.GetIdentificationValuesList = resp.IdentificationValues;
                console.log($scope.GetIdentificationValuesList);
                $scope.GetInterChangeAckValuesList = resp.InterChangeAckValues;
                $scope.GetUsageIndicatorList = resp.UsageIndicator;
                $scope.ClearingHouseTypes = resp.ClearingHouseTypes;

                //Added By Durga Need to remove later
                $scope.ClearingHouseTypes = $filter("filter")($scope.ClearingHouseTypes, function (sitem) {
                    return sitem.ClearingHouseTypeId !== 3;
                });
            }
        })
    }

    $scope.GetMasterClearingHouseDetails = function () {
        eHnoteSettingsDataService.GetMasterClearingHouseDetails().success(function (resp) {
            console.log(resp)
            if (resp.status == "Success") {
                $scope.masterClearingHousesArray = resp.rows || [];
            }
        })
    };

    $scope.changeClearingHouseType = function (obj) {
        $scope.ClearHouseobj.MasterClearingHouseId = "";
    }

    $scope.changeMasterClearingHouse = function (obj) {
        $scope.ClearHouseobj.Name = "";
        $scope.ClearHouseobj.ClearingHouseTypeId = "";
        let templist = $filter("filter")($scope.masterClearingHousesArray, { "MasterClearingHouseId": obj.MasterClearingHouseId }, true) || [];
        if (templist.length > 0) {
            $scope.ClearHouseobj.Name = templist[0].ClearingHouseName || "";
            $scope.ClearHouseobj.ClearingHouseTypeId = templist[0].ClearingHouseTypeId || "";
        }


    };
    $scope.formatUSNumberInfo = function (phoneNumberString) {
        $scope.USnumberString = phoneNumberString || "";
        if ($scope.USnumberString != "") {
            console.log($scope.USnumberString);
            const match = phoneNumberString
                .replace(/\D+/g, '')
                .match(/([^\d]*\d[^\d]*){1,10}$/)[0]
            const part1 = match.length > 3 ? `(${match.substring(0, 3)})` : match
            const part2 = match.length > 3 ? ` ${match.substring(3, 6)}` : ''
            const part3 = match.length > 6 ? `-${match.substring(6, 10)}` : ''
            $scope.OrganizationFacilityObj.ContactFax = part1 + part2 + part3;

            if ($scope.USnumberString.length > 9) {
                var Area = $scope.USnumberString.slice(0, 3);
               
                var contact = $scope.USnumberString.substring(3, ($scope.USnumberString.toString()).length);
               
            }
        } 
    }
    //$scope.changeContactFaxNumber = function (item) {
    //    debugger
    //    item = item.toString()
    //    var obj = eHnoteUserDataService.UsMobileFormatChange(item);
    //    $scope.OrganizationFacilityObj.ContactFax = obj.UsFormatMobileNumber;
       
    //};
    $scope.changeContactFaxNumber = function (fitem) {
       // debugger
        $scope.USnumberString = fitem || "";
        if ($scope.USnumberString != "") {
            const match = fitem
                .replace(/\D+/g, '')
                .match(/([^\d]*\d[^\d]*){1,10}$/)[0]
            const part1 = match.length > 3 ? `(${match.substring(0, 3)})` : match
            const part2 = match.length > 3 ? ` ${match.substring(3, 6)}` : ''
            const part3 = match.length > 6 ? `-${match.substring(6, 10)}` : ''
            //  return `${part1}${part2}${part3}`;
            //$scope.OrganizationFacilityObj.ContactFax = part1 + part2 + part3;
            $scope.hospitalParams.HospitalDetails.FaxNo = part1 + part2 + part3;

            if ($scope.USnumberString.length > 9) {
                var Area = $scope.USnumberString.slice(0, 3);
                $scope.OrganizationFacilityObj.ContactFaxAreacode = Area;
                var contact = $scope.USnumberString.substring(3, ($scope.USnumberString.toString()).length);
                $scope.OrganizationFacilityObj.ContactFaxHomeNumber = contact;
            }
        }
    }
    $scope.changeAltFaxNumber = function (item) {
        item = item.toString()
        var obj = eHnoteUserDataService.UsMobileFormatChange(item);
        $scope.OrganizationFacilityObj.FaxNumber = obj.UsFormatMobileNumber;
    };
    $scope.changeAltFaxNumber = function (fitem) {
        //debugger
        $scope.USnumberString = fitem || "";
        if ($scope.USnumberString != "") {
            const match = fitem
                .replace(/\D+/g, '')
                .match(/([^\d]*\d[^\d]*){1,10}$/)[0]
            const part1 = match.length > 3 ? `(${match.substring(0, 3)})` : match
            const part2 = match.length > 3 ? ` ${match.substring(3, 6)}` : ''
            const part3 = match.length > 6 ? `-${match.substring(6, 10)}` : ''
            //  return `${part1}${part2}${part3}`;
            $scope.OrganizationFacilityObj.FaxNumber = part1 + part2 + part3;

            if ($scope.USnumberString.length > 9) {
                var Area = $scope.USnumberString.slice(0, 3);
                $scope.OrganizationFacilityObj.FaxAreacode = Area;
                var contact = $scope.USnumberString.substring(3, ($scope.USnumberString.toString()).length);
                $scope.OrganizationFacilityObj.FaxHomeNumber = contact;
            }
        }
    }
    $scope.ChangeAuthorization = function (Id, arraylist, typeid) {
        let templist = $filter("filter")(arraylist, { "ClearingHouseTypeId": Id }, true) || [];

        if (templist.length > 0) {
            if (typeid == 1) {
                $scope.ClearHouseobj.AuthorizationIdentification = templist[0].Description;
            }
            else if (typeid == 2) {
                $scope.ClearHouseobj.InterChangeAck = templist[0].Description;
            }
            else if (typeid == 3) {
                $scope.ClearHouseobj.UsageIndicator = templist[0].Value;
            }
            else {
                $scope.ClearHouseobj.EligibilityCallType = templist[0].Description;
            }
        }


    }
    $scope.ChangeFTPType = function (typevalue, arraylist, typeid) {
        let templist = $filter("filter")(arraylist, { "Value": typevalue }, true) || [];


        if (typeid == 1) {
            $scope.ClearHouseobj.eligiBatchFtpType = "";
            if (templist.length > 0) {
                $scope.ClearHouseobj.eligiBatchFtpType = templist[0].Description;
            }
        }
        else {
            $scope.ClearHouseobj.ClaimUploadFTPType = "";
            if (templist.length > 0) {
                $scope.ClearHouseobj.ClaimUploadFTPType = templist[0].Description;
            }
        }


    }

    /* Billing Provider - Start */

    $scope.ChangeHospital = function (item) {
        $scope.InvestigationObject.HospitalObj = item;
        $scope.InvestigationObject.HospitalId = item.ClinicId;
        $scope.masterProcedureObj.HospitalObj = item;
        $scope.masterProcedureObj.HospitalId = item.ClinicId;

        $scope.masterOtherProcedureObj.HospitalObj = item;
        $scope.masterOtherProcedureObj.HospitalId = item.ClinicId;
        $scope.masterMedicineObject.HospitalId = item.ClinicId;
        $scope.masterMedicineObject.HospitalObj = item;
        $scope.BillingPackageObject.HospitalId = item.ClinicId;
        $scope.BillingPackageObject.HospitalObj = item;
        $scope.newInvReqObject.HospitalObj.ClinicName = item.ClinicName;
        if (item.ClinicId === 0) {
            $scope.InvestigationObject.AllHospitalsIndicator = 1;
            $scope.masterProcedureObj.AllHospitalsIndicator = 1;
            $scope.masterOtherProcedureObj.AllHospitalsIndicator = 1;
            $scope.masterMedicineObject.AllHospitalsIndicator = 1;
            $scope.BillingPackageObject.AllHospitalsIndicator = 1;
        } else {
            $scope.InvestigationObject.AllHospitalsIndicator = 0;
            $scope.masterProcedureObj.AllHospitalsIndicator = 0;
            $scope.masterOtherProcedureObj.AllHospitalsIndicator = 1;
            $scope.masterMedicineObject.AllHospitalsIndicator = 0;
            $scope.BillingPackageObject.AllHospitalsIndicator = 0;
        }

    };

    $scope.changemobilenumber = function (phoneNumberString) {
        $scope.USnumberString = phoneNumberString || "";
        if ($scope.USnumberString != "") {
            console.log($scope.USnumberString);
            const match = phoneNumberString
                .replace(/\D+/g, '')
                .match(/([^\d]*\d[^\d]*){1,10}$/)[0]
            const part1 = match.length > 3 ? `(${match.substring(0, 3)})` : match
            const part2 = match.length > 3 ? ` ${match.substring(3, 6)}` : ''
            const part3 = match.length > 6 ? `-${match.substring(6, 10)}` : ''
            $scope.newServiceFacilities.ContactMobileNumber = part1 + part2 + part3;

            if ($scope.USnumberString.length > 9) {
                var Area = $scope.USnumberString.slice(0, 3);
                $scope.newServiceFacilities.ContactAreaCode = Area;
                var contact = $scope.USnumberString.substring(3, ($scope.USnumberString.toString()).length);
                $scope.newServiceFacilities.ContactNumber = contact;
            }
        } else {
            $scope.newServiceFacilities.ContactMobileNumber = "";
            $scope.newServiceFacilities.ContactAreaCode = "";
            $scope.newServiceFacilities.ContactNumber = "";
        }
    }

    $scope.changeotherMobilenumber = function (item) {
        item = item.toString() || "";
        if (item != "") {
            var obj = eHnoteUserDataService.UsMobileFormatChange(item);
            if (obj != undefined) {
                if (obj.MobileNumber.length > 9) {
                    var Area = obj.MobileNumber.slice(0, 3);
                    $scope.newServiceFacilities.OtherContactAreaCode = Area;
                    var contact = obj.MobileNumber.substring(3, (obj.MobileNumber.toString()).length);
                    $scope.newServiceFacilities.OtherContactNumber = contact;
                }
                else if (obj.MobileNumber.length <= 9) {
                    var Area = obj.MobileNumber.slice(0, 3);
                    $scope.newServiceFacilities.OtherContactAreaCode = Area;
                    var contact = obj.MobileNumber.substring(3, (obj.MobileNumber.toString()).length);
                    $scope.newServiceFacilities.OtherContactNumber = contact;
                }
                $scope.newServiceFacilities.OtherMobileNumber = obj.UsFormatMobileNumber || "";
            }
        } else {
            $scope.newServiceFacilities.OtherMobileNumber = "";
            $scope.newServiceFacilities.OtherContactAreaCode = "";
            $scope.newServiceFacilities.OtherContactNumber = "";
        }
    }

    $scope.changeUsercity = function (type) {
        if (type == "") {
            $scope.newServiceFacilities.PostalCityName = "";
            $scope.newServiceFacilities.PostalCityId = 0;

        }
    }
    $scope.OnUserCity = function (item) {
        $scope.newServiceFacilities.PostalCityName = item.CityName || "";
        $scope.newServiceFacilities.PostalCityId = item.CityId;
        $scope.newServiceFacilities.PostalStateName = item.StateName || "";
        $scope.newServiceFacilities.PostalStateId = item.StateId;
        if (item.ZipCodeArray.length > 0) {
            $scope.newServiceFacilities.PostalZipCode = item.ZipCodeArray[0].ZIP;
        }
    }

    $scope.changeUserState = function (type) {
        if (type == "") {
            $scope.newServiceFacilities.PostalStateName = "";
            $scope.newServiceFacilities.PostalStateId = 0;

        }
    }
    $scope.ONUserchangeState = function (item, type) {
        if (type === "Postal") {
            $scope.newServiceFacilities.PostalStateName = item.Name;
            $scope.newServiceFacilities.PostalStateId = item.StateId;
            $scope.newServiceFacilities.PostalCityName = "";
        } else {
            $scope.newServiceFacilities.PhysicalStateName = item.Name;
            $scope.newServiceFacilities.PhysicalStateId = item.StateId;
            $scope.newServiceFacilities.PhysicalCityName = "";
        }
    }


    $scope.changeUserZipCode = function (val) {
        val = val || "";
        if (val.length >= 5) {
            eHnoteSettingsDataService.GetLocationsByZipCode(val).then(function (resp) {
                if (resp.data.rows.length > 0) {
                    var basedZipcode = resp.data.rows || [];
                    if (basedZipcode.length !== 0) {

                        $scope.newServiceFacilities.PostalCityName = basedZipcode[0].CityName;
                        $scope.newServiceFacilities.PostalCityId = basedZipcode[0].CityId;
                        $scope.newServiceFacilities.PostalStateName = basedZipcode[0].StateName;
                        $scope.newServiceFacilities.PostalStateId = basedZipcode[0].StateId;
                    }
                }
            });
        }

        else {
            $scope.newServiceFacilities.PostalCityName = "";
            $scope.newServiceFacilities.PostalCityId = 0;
            $scope.newServiceFacilities.PostalStateName = "";
            $scope.newServiceFacilities.PostalStateId = 0;

        }
    }
    $scope.changeUsercity1 = function (type) {
        if (type == "") {
            $scope.newServiceFacilities.PhysicalCityName = "";
            $scope.newServiceFacilities.PhysicalCityId = 0;
        }
    }
    $scope.changeUserBoxcity = function (type) {
        if (type == "") {
            $scope.newServiceFacilities.Box33CityName = "";
            $scope.newServiceFacilities.Box33CityId = 0;
        }
    }
    $scope.changeUserBoxState = function (type) {
        if (type == "") {
            $scope.newServiceFacilities.Box33StateName = "";
            $scope.newServiceFacilities.Box33StateId = 0;

        }
    }
    $scope.OnUserBoxCity = function (item) {
        $scope.newServiceFacilities.Box33CityName = item.CityName || "";
        $scope.newServiceFacilities.Box33CityId = item.CityId;
        $scope.newServiceFacilities.Box33StateName = item.StateName || "";
        $scope.newServiceFacilities.Box33StateId = item.StateId;
        if (item.ZipCodeArray.length > 0) {
            $scope.newServiceFacilities.Box33ZipCode = item.ZipCodeArray[0].ZIP;
        }
    }

    $scope.OnUserCity1 = function (item) {
        $scope.newServiceFacilities.PhysicalCityName = item.CityName || "";
        $scope.newServiceFacilities.PhysicalCityId = item.CityId;
        $scope.newServiceFacilities.PhysicalStateName = item.StateName || "";
        $scope.newServiceFacilities.PhysicalStateId = item.StateId;
        if (item.ZipCodeArray.length > 0) {
            $scope.newServiceFacilities.PhysicalZipCode = item.ZipCodeArray[0].ZIP;
        }
    }
    $scope.changeUserState1 = function (type) {
        if (type == "") {
            $scope.newServiceFacilities.PhysicalStateName = "";
            $scope.newServiceFacilities.PhysicalStateId = 0;

        }
    }
    $scope.ONUserchangeState1 = function (item, type) {
        if (type === "Physical") {
            $scope.newServiceFacilities.PhysicalStateName = item.Name;
            $scope.newServiceFacilities.PhysicalStateId = item.StateId;
            $scope.newServiceFacilities.PhysicalCityName = "";
        }
        else if (type === "Box33") {
            $scope.newServiceFacilities.Box33StateName = item.Name;
            $scope.newServiceFacilities.Box33StateId = item.StateId;
            $scope.newServiceFacilities.Box33CityName = "";
        } else {
            $scope.newServiceFacilities.PhysicalStateName = item.Name;
            $scope.newServiceFacilities.PhysicalStateId = item.StateId;
            $scope.newServiceFacilities.PhysicalCityName = "";
        }
    }


    $scope.changeUserZipCode1 = function (val) {
        if (val.length >= 5) {
            eHnoteSettingsDataService.GetLocationsByZipCode(val).then(function (resp) {
                if (resp.data.rows.length > 0) {
                    var basedZipcode = resp.data.rows || [];
                    if (basedZipcode.length !== 0) {

                        $scope.newServiceFacilities.PhysicalCityName = basedZipcode[0].CityName;
                        $scope.newServiceFacilities.PhysicalCityId = basedZipcode[0].CityId;
                        $scope.newServiceFacilities.PhysicalStateName = basedZipcode[0].StateName;
                        $scope.newServiceFacilities.PhysicalStateId = basedZipcode[0].StateId;
                    }
                }
            });
        }

        else {
            $scope.newServiceFacilities.PhysicalCityName = "";
            $scope.newServiceFacilities.PhysicalCityId = 0;
            $scope.newServiceFacilities.PhysicalStateName = "";
            $scope.newServiceFacilities.PhysicalStateId = 0;

        }

    }
    $scope.SameAddress = false;
    $scope.CopyUserPostalAddress = function (SameAddress) {
        if (SameAddress == true) {
            $scope.newServiceFacilities.PhysicalAddress1 = $scope.newServiceFacilities.PostalAddress1;
            $scope.newServiceFacilities.PhysicalAddress2 = $scope.newServiceFacilities.PostalAddress2;
            $scope.newServiceFacilities.PhysicalCityName = $scope.newServiceFacilities.PostalCityName;
            $scope.newServiceFacilities.PhysicalCityId = $scope.newServiceFacilities.PostalCityId;
            $scope.newServiceFacilities.PhysicalStateName = $scope.newServiceFacilities.PostalStateName;
            $scope.newServiceFacilities.PhysicalStateId = $scope.newServiceFacilities.PostalStateId;
            $scope.newServiceFacilities.PhysicalZipCode = $scope.newServiceFacilities.PostalZipCode;

        }
        else {
            $scope.newServiceFacilities.PhysicalAddress1 = "";
            $scope.newServiceFacilities.PhysicalAddress2 = "";
            $scope.newServiceFacilities.PhysicalCityName = "";
            $scope.newServiceFacilities.PhysicalCityId = 0;
            $scope.newServiceFacilities.PhysicalStateName = "";
            $scope.newServiceFacilities.PhysicalStateId = 0;
            $scope.newServiceFacilities.PhysicalZipCode = "";

        }
    }

    $scope.GetOrgBillingProviders = function () {

        $scope.FacilitiesList = [];

        if ($scope.AdminSubtab === 1 || $scope.AdminSubtab === 5) {
            $scope.OrgBillingProviderObj.PageNumber = 1;
            $scope.OrgBillingProviderObj.PageSize = 1000;
        } else {
            if ($scope.AdminSubtab === 4) {
                $scope.OrgBillingProviderObj.PageNumber = 1;
                $scope.OrgBillingProviderObj.PageSize = 10;
            }
        }
      
        var params = {
            "ParentOrganizationId": parentHospitalId,
            "FacilityCode": "",
            "PageNumber": $scope.OrgBillingProviderObj.PageNumber,
            "PageSize": $scope.OrgBillingProviderObj.PageSize
        };

        $q.all([
            eHnoteSettingsDataService.GetOrganizationBillingProviders(params),
        ]).then(function (resp) {
            if (resp[0].data.Status === "Success") {
                console.log(resp[0].data);
                $scope.showcondition = false;
                if (resp[0].data.Status == "Success") {
                    resp[0].data.rows = resp[0].data.rows || [];
                    $scope.TotalFacilityCount = resp[0].data.count || 0;
                    if (resp[0].data.rows.length > 0) {
                        $scope.FacilitiesList = resp[0].data.rows || [];
                        $scope.FacilitiesList1 = angular.copy($scope.FacilitiesList);
                    } else {
                        $scope.FacilitiesList1 = [];
                    }
                }
            }
        });
    }

    $scope.init = function (TempPlaceOfServiceId) {

        $scope.FacilitiesList = [];
        $scope.specialitylist = [];
        $scope.BillingFacilityList = [];
        $scope.FacilityPlaceOfServiceArray = [];
        $scope.OrganizationFacilityList = [];

        var obj = {
            "OrganizationId": $scope.hospitalParams.HospitalDetails.HospitalID,
            "FacilityName": ""
        }
    
        var params = {
            //"OrganizationId": $scope.hospitalParams.HospitalDetails.HospitalID || 0,
            "ParentOrganizationId": parentHospitalId,
            "FacilityCode": "",
            "PageNumber": $scope.OrgBillingProviderObj.PageNumber || 1,
            "PageSize": $scope.OrgBillingProviderObj.PageSize || 10
        };

        $q.all([
            eHnoteSettingsDataService.GetOrganizationBillingProviders(params),
            eHnoteUserDataService.getmasterspeciality(),
            eHnoteSettingsDataService.GetMasteBillingProviderTypes(),
            eHnoteSettingsDataService.GetMasterPlaceOfServiceCodes(),
            eHnoteMainAdminServices.GetOrganizationFacilityDetails(obj),
            eHnoteSettingsDataService.GetAllMasterClaimsData($scope.HospitalId)
        ]).then(function (resp) {
            if (resp[0].data.Status === "Success") {
                console.log(resp[0].data);
                $scope.showcondition = false;
                if (resp[0].data.Status == "Success") {
                    resp[0].data.rows = resp[0].data.rows || [];
                    $scope.TotalFacilityCount = resp[0].data.count || 0;
                    if (resp[0].data.rows.length > 0) {
                        $scope.FacilitiesList = resp[0].data.rows || [];
                        $scope.FacilitiesList1 = angular.copy($scope.FacilitiesList);
                    } else {
                        $scope.FacilitiesList1 = [];
                    }
                }
            }
            if (resp[1].data.length > 0) {
                console.log(resp[1].data);
                $scope.specialitylist = resp[1].data;
            }
           
            if (resp[2].data.status == "Success") {
                if (resp[2].data.rows.length > 0) {
                    $scope.BillingFacilityList = resp[2].data.rows;
                }
            }

            if (resp[3].data.status == "Success") {
                if (resp[3].data.rows.length > 0) {
                    $scope.FacilityPlaceOfServiceArray = resp[3].data.rows || [];
                }
            }
            if (resp[4].data.status == "Success") {
                resp[4].data.rows = resp[4].data.rows || [];
                if (resp[4].data.rows.length > 0) {
                    $scope.OrganizationFacilityList = angular.copy(resp[4].data.rows);
                }
            }
            if (resp[5].data.status == "Success") {
                resp[5].data.POSCodes = resp[5].data.POSCodes || [];
                $scope.POSCodes = resp[5].data.POSCodes;
            }

            TempPlaceOfServiceId = TempPlaceOfServiceId || null;
            if (TempPlaceOfServiceId != null) {
                $scope.changeplanofservice(TempPlaceOfServiceId);
            }
        });
    }

    $scope.Billingfacilities = 'Save';
    $scope.AddServiceFacilities = function () {
        $scope.showcondition = true;
        $scope.Billingfacilities = 'Save';
        $scope.newServiceFacilities = getServiceFacilities();
        $scope.OrgBillingProviderObj = getOrgBillingProviderObj();
    }

    $scope.Clearservicefacilities = function () {
        $scope.showcondition = false;
        $scope.newServiceFacilities = getServiceFacilities();
    };

    $scope.ClickProviderActive = function (obj) {

        if (obj.IsActive) {
            obj.ActiveInd = "Y";
        } else {
            obj.ActiveInd = "N";
        }
    };

    $scope.Saveservicefacilities = function () {

        if ($scope.newServiceFacilities.FacilityTypeCode === "") {
            alertify.error("Please Enter FacilityCode ")
            return false;
        }
        if ($scope.newServiceFacilities.BillingProviderName === "") {
            alertify.error("Please Enter FacilityName ")
            return false;
        }
        if ($scope.newServiceFacilities.NPI === "") {
            alertify.error("Please Enter NPI ")
            return false;
        }
        if ($scope.newServiceFacilities.TaxId === "") {
            alertify.error("Please Enter TaxId")
            return false;
        }
        if ($scope.newServiceFacilities.TaxonomyId === "") {
            alertify.error("Please Enter TaxonomyId")
            return false;
        }

        if ($scope.newServiceFacilities.PostalAddress1 === "") {
            alertify.error("Please Enter PostalAddress1 ")
            return false;
        }

        if ($scope.newServiceFacilities.PostalAddress2 === "") {
            alertify.error("Please Enter PostalAddress2 ")
            return false;
        }
        if ($scope.newServiceFacilities.PostalCityName === "") {
            alertify.error("Please Enter PostalCityName ")
            return false;
        }
        if ($scope.newServiceFacilities.PostalStateName === "") {
            alertify.error("Please Enter PostalStateName ")
            return false;
        }
        if ($scope.newServiceFacilities.PostalZipCode === "") {
            alertify.error("Please Enter PostalZipCode")
            return false;
        }
        if ($scope.newServiceFacilities.ContactPersonName === "") {
            alertify.error("Please Enter Contact PersonName ")
            return false;
        }
        if ($scope.newServiceFacilities.ContactMobileNumber === "") {
            alertify.error("Please Enter Contact Mobile Number ")
            return false;
        }
        var Contactnumber = angular.copy($scope.newServiceFacilities.ContactMobileNumber) || "";
        if ($scope.newServiceFacilities.ContactMobileNumber != '' || $scope.newServiceFacilities.ContactMobileNumber != '') {
            if ((Contactnumber.toString()).length < 14) {
                alertify.error("Please Enter Valid Mobile Number");
                return false;
            }
        }
        var contactnumber = angular.copy($scope.newServiceFacilities.OtherMobileNumber) || "";
        if ($scope.newServiceFacilities.OtherMobileNumber != '' || $scope.newServiceFacilities.OtherMobileNumber != '') {
            if ((contactnumber.toString()).length < 14) {
                alertify.error("Please Enter Valid Alternate Mobile Number");
                return false;
            }
        }

        if ($scope.newServiceFacilities.Email == undefined) {
            alertify.error("Please Enter Valid Email");
            return false;
        }


        var params = {
            "UserId": doctorinfo.doctorid,
            "OrganizationBillingProviderId": $scope.newServiceFacilities.OrganizationBillingProviderId,
           // "OrganizationId": $scope.hospitalParams.HospitalDetails.HospitalID,
            "ParentOrganizationId": parentHospitalId,
            "FacilityCode": $scope.newServiceFacilities.FacilityCode,
            "BillingProviderName": $scope.newServiceFacilities.BillingProviderName,
            "PostalAddress1": $scope.newServiceFacilities.PostalAddress1,
            "PostalAddress2": $scope.newServiceFacilities.PostalAddress2,
            "PostalCityId": $scope.newServiceFacilities.PostalCityId,
            "PostalCityName": $scope.newServiceFacilities.PostalCityName,
            "PostalStateId": $scope.newServiceFacilities.PostalStateId,
            "PostalStateName": $scope.newServiceFacilities.PostalStateName,
            "PostalZipCode": ($scope.newServiceFacilities.PostalZipCode || "").replace(/\D/g, ""),
            "PostalCountryId": 0,
            "IsPostalAndPhysicalAddressSame": $scope.newServiceFacilities.IsPostalAndPhysicalAddressSame,
            "PhysicalAddress1": $scope.newServiceFacilities.PhysicalAddress1,
            "PhysicalAddress2": $scope.newServiceFacilities.PhysicalAddress2,
            "PhysicalCityId": $scope.newServiceFacilities.PhysicalCityId,
            "PhysicalCityName": $scope.newServiceFacilities.PhysicalCityName,
            "PhysicalStateId": $scope.newServiceFacilities.PhysicalStateId,
            "PhysicalStateName": $scope.newServiceFacilities.PhysicalStateName,
            "PhysicalZipCode": ($scope.newServiceFacilities.PhysicalZipCode || "").replace(/\D/g, ""),
            "PhysicalCountryId": 0,
            "FaxNumber": $scope.newServiceFacilities.FaxNumber,
            "Email": $scope.newServiceFacilities.Email,
            "NPI": $scope.newServiceFacilities.NPI,
            "SSN": $scope.newServiceFacilities.SSN,
            "TaxId": $scope.newServiceFacilities.TaxId,
            "TaxonomyId": $scope.newServiceFacilities.TaxonomyId,
            "CLIAID": $scope.newServiceFacilities.CLIAID,
            "MamGraphId": $scope.newServiceFacilities.MamGraphId,
            "IPA": $scope.newServiceFacilities.IPA,
            "Notes": $scope.newServiceFacilities.Notes,
            "ActiveInd": 'Y',
            "DeleteInd": "N",
            "Motto": $scope.newServiceFacilities.Motto,
            "FromDate": $scope.newServiceFacilities.FromDate,
            "ToDate": $scope.newServiceFacilities.ToDate,
            "WWW": $scope.newServiceFacilities.WWW,
            "ContactMobileNumber": $scope.newServiceFacilities.ContactMobileNumber,
            "OtherMobileNumber": $scope.newServiceFacilities.OtherMobileNumber,
            "BillingProviderTypeId": $scope.newServiceFacilities.BillingProviderTypeId,
            "BillingProviderTypeName": $scope.newServiceFacilities.BillingProviderTypeName,
            "FacilityTypeCode": $scope.newServiceFacilities.FacilityTypeCode,
            "FacilityTypeId": $scope.newServiceFacilities.FacilityTypeId,
            "ContactNumber": $scope.newServiceFacilities.ContactNumber,
            "ContactAreaCode": $scope.newServiceFacilities.ContactAreaCode,
            "ContactCountryCode": $scope.newServiceFacilities.ContactCountryCode,
            "OtherContactNumber": $scope.newServiceFacilities.OtherContactNumber,
            "OtherContactAreaCode": $scope.newServiceFacilities.OtherContactAreaCode,
            "OtherContactCountryCode": $scope.newServiceFacilities.OtherContactCountryCode,
            "SpecializationId": $scope.newServiceFacilities.SpecializationId,
            "ContactPersonName": $scope.newServiceFacilities.ContactPersonName || "",
            "Box33GroupName": $scope.newServiceFacilities.Box33GroupName,
            "Box33GroupNPI": $scope.newServiceFacilities.Box33GroupNPI,
            "Box33Address1": $scope.newServiceFacilities.Box33Address1,
            "Box33Address2": $scope.newServiceFacilities.Box33Address2,
            "Box33CityId": $scope.newServiceFacilities.Box33CityId,
            "Box33CityName": $scope.newServiceFacilities.Box33CityName,
            "Box33StateId": $scope.newServiceFacilities.Box33StateId,
            "Box33StateName": $scope.newServiceFacilities.Box33StateName,
            "Box33CountryId": $scope.newServiceFacilities.Box33CountryId,
            "Box33ZipCode": ($scope.newServiceFacilities.Box33ZipCode || "").replace(/\D/g, ""),

        }
        eHnoteSettingsDataService.AddupdateOrganizationServiceFacilities(params).then(function (resp) {
            console.log(resp.data.Status);

            if (resp.data.Status == "Success") {
                if ($scope.newServiceFacilities.OrganizationBillingProviderId === 0) {
                    $scope.init();
                    alertify.success("Saved successfully");
                    $scope.newServiceFacilities = getServiceFacilities();
                }
                else {
                    $scope.init();
                    alertify.success("Updated successfully");
                    $scope.Billingfacilities = 'Save';
                    $scope.newServiceFacilities = getServiceFacilities();

                }
            }
            else if (resp.data.Status == "Failure") {
                alertify.error(resp.data.Message);
            }


        }, function (error) {
            console.log(error);
        });


    }

    $scope.editProvidersFacilities = function (item) {
        $scope.showcondition = true;
        $scope.newServiceFacilities.OrganizationBillingProviderId = item.OrganizationBillingProviderId;
        $scope.newServiceFacilities.FacilityCode = item.FacilityCode;
        $scope.newServiceFacilities.BillingProviderName = item.BillingProviderName;
        $scope.newServiceFacilities.NPI = item.NPI;
        $scope.newServiceFacilities.TaxId = item.TaxId;
        $scope.newServiceFacilities.SSN = item.SSN;
        $scope.newServiceFacilities.TaxonomyId = item.TaxonomyId;
        $scope.newServiceFacilities.CLIAID = item.CLIAID;
        $scope.newServiceFacilities.MamGraphId = item.MamGraphId;
        $scope.newServiceFacilities.WWW = item.WWW;
        $scope.newServiceFacilities.Motto = item.Motto;
        $scope.newServiceFacilities.CLIAID = item.CLIAID;
        $scope.newServiceFacilities.Notes = item.Notes;
        $scope.newServiceFacilities.PostalAddress1 = item.PostalAddress1;
        $scope.newServiceFacilities.PostalAddress2 = item.PostalAddress2;
        $scope.newServiceFacilities.PostalStateName = item.PostalStateName;
        $scope.newServiceFacilities.PostalStateId = item.PostalStateId;
        $scope.newServiceFacilities.PostalCityName = item.PostalCityName;
        $scope.newServiceFacilities.PostalCityId = item.PostalCityId;
        $scope.newServiceFacilities.PostalZipCode = item.PostalZipCode;
        $scope.newServiceFacilities.PhysicalAddress1 = item.PhysicalAddress1;
        $scope.newServiceFacilities.PhysicalAddress2 = item.PhysicalAddress2;
        $scope.newServiceFacilities.PhysicalStateName = item.PhysicalStateName;
        $scope.newServiceFacilities.PhysicalStateId = item.PhysicalStateId;
        $scope.newServiceFacilities.PhysicalCityName = item.PhysicalCityName;
        $scope.newServiceFacilities.PhysicalCityId = item.PhysicalCityId;
        $scope.newServiceFacilities.PhysicalZipCode = item.PhysicalZipCode;
        $scope.newServiceFacilities.ContactMobileNumber = item.ContactMobileNumber;
        $scope.newServiceFacilities.OtherMobileNumber = item.OtherMobileNumber;
        $scope.newServiceFacilities.Email = item.Email;
        $scope.newServiceFacilities.FaxNumber = item.FaxNumber;
        $scope.newServiceFacilities.FromDate = item.FromDate;
        $scope.newServiceFacilities.ToDate = item.ToDate;
        $scope.newServiceFacilities.BillingProviderTypeId = item.BillingProviderTypeId;
        $scope.newServiceFacilities.BillingProviderTypeName = item.BillingProviderTypeName;
        $scope.newServiceFacilities.BillingProvidersType = item.BillingProvidersType;
        $scope.newServiceFacilities.FacilityTypeCode = item.FacilityTypeCode;
        $scope.newServiceFacilities.FacilityTypeId = item.FacilityTypeId
        $scope.newServiceFacilities.ContactNumber = item.ContactNumber;
        $scope.newServiceFacilities.ContactAreaCode = item.ContactAreaCode;
        $scope.newServiceFacilities.ContactCountryCode = item.ContactCountryCode;
        $scope.newServiceFacilities.OtherContactNumber = item.OtherContactNumber;
        $scope.newServiceFacilities.OtherContactAreaCode = item.OtherContactAreaCode;
        $scope.newServiceFacilities.OtherContactCountryCode = item.OtherContactCountryCode;
        $scope.newServiceFacilities.ContactPersonName = item.ContactPersonName;
        $scope.newServiceFacilities.SpecializationId = item.SpecializationId;

        $scope.newServiceFacilities.Box33GroupName = item.Box33GroupName;
        $scope.newServiceFacilities.Box33GroupNPI = item.Box33GroupNPI;
        $scope.newServiceFacilities.Box33Address1 = item.Box33Address1;
        $scope.newServiceFacilities.Box33Address2 = item.Box33Address2;
        $scope.newServiceFacilities.Box33StateName = item.Box33StateName;
        $scope.newServiceFacilities.Box33StateId = item.Box33StateId;
        $scope.newServiceFacilities.Box33CityName = item.Box33CityName;
        $scope.newServiceFacilities.Box33CityId = item.Box33CityId;
        $scope.newServiceFacilities.Box33ZipCode = item.Box33ZipCode;
        $scope.newServiceFacilities.Box33CountryId = item.Box33CountryId;

        $scope.newServiceFacilities.IsActive = false;
        if (item.ActiveInd === 'Y') {
            $scope.newServiceFacilities.IsActive = true;
        }

        $scope.Billingfacilities = 'Update';


        var phoneNumberString = $scope.newServiceFacilities.ContactAreaCode + $scope.newServiceFacilities.ContactNumber;
        $scope.changemobilenumber(phoneNumberString);

        var NumberString = $scope.newServiceFacilities.OtherContactAreaCode + $scope.newServiceFacilities.OtherContactNumber;
        $scope.changeotherMobilenumber(NumberString);
    }

    $scope.deleteProvidersFacilities = function (item) {

        var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to delete?", function () {

            var params = {
                "UserId": doctorinfo.doctorid,
                "OrganizationBillingProviderId": item.OrganizationBillingProviderId,
                "OrganizationId": $scope.hospitalParams.HospitalDetails.HospitalID,
                "BillingProviderTypeId": item.BillingProviderTypeId,
                "FacilityCode": item.FacilityCode,
                "BillingProviderName": item.BillingProviderName,
                "NPI": item.NPI,
                "TaxId": item.TaxId,
                "SSN": item.SSN,
                "TaxonomyId": item.TaxonomyId,
                "CLIAID": item.CLIAID,
                "MamGraphId": item.MamGraphId,
                "WWW": item.WWW,
                "Motto": item.Motto,
                "CLIAID": item.CLIAID,
                "Notes": item.Notes,
                "PostalAddress1": item.PostalAddress1,
                "PostalAddress2": item.PostalAddress2,
                "PostalStateName": item.PostalStateName,
                "PostalStateId": item.PostalStateId,
                "PostalCityName": item.PostalCityName,
                "PostalCityId": item.PostalCityId,
                "PostalZipCode": item.PostalZipCode,
                "IsPostalAndPhysicalAddressSame": item.IsPostalAndPhysicalAddressSame,
                "PhysicalAddress1": item.PhysicalAddress1,
                "PhysicalAddress2": item.PhysicalAddress2,
                "PhysicalStateName": item.PhysicalStateName,
                "PhysicalStateId": item.PhysicalStateId,
                "PhysicalCityName": item.PhysicalCityName,
                "PhysicalCityId": item.PhysicalCityId,
                "PhysicalZipCode": item.PhysicalZipCode,
                "ContactMobileNumber": item.ContactMobileNumber,
                "OtherMobileNumber": item.OtherMobileNumber,
                "Email": item.Email,
                "FaxNumber": item.FaxNumber,
                "FromDate": item.FromDate,
                "ToDate": item.ToDate,
                "ActiveInd": item.ActiveInd,
                "DeleteInd": "Y",
                "FacilityTypeId": item.FacilityTypeId

            }
            eHnoteSettingsDataService.AddupdateOrganizationServiceFacilities(params).then(function (resp) {
                console.log(resp.data.Status);

                if (resp.data.Status == "Success") {
                    $scope.init();
                    alertify.success("Deleted successfully");
                }


            }, function (error) {
                console.log(error);
            });
        },
            function () {
                $scope.$digest();
                r = "You pressed Cancel!";
            });
    }

    $scope.changeBillingActive = function (item) {
        if (item.ActiveInd == 'N') {
            var params = {
                "UserId": doctorinfo.doctorid,
                "HospitalId": item.OrganizationId,
                "OrganizationBillingProviderId": item.OrganizationBillingProviderId,
                "ActiveInd": "Y",
            }
            eHnoteSettingsDataService.UpdateBillingProviderActiveStatus(params).success(function (data) {
                if (data.Status === "Success") {
                    $scope.init();
                    alertify.success('Activated Successfully');
                }
            }).error(function (error) {

            });
        }
        if (item.ActiveInd == 'Y') {
            var params = {
                "UserId": doctorinfo.doctorid,
                "HospitalId": item.OrganizationId,
                "OrganizationBillingProviderId": item.OrganizationBillingProviderId,
                "ActiveInd": "N",
            }
            eHnoteSettingsDataService.UpdateBillingProviderActiveStatus(params).success(function (data) {
                if (data.Status === "Success") {
                    $scope.init();
                    alertify.success('Inactivated Successfully');
                }
            }).error(function (error) {

            });
        }
    }

    /* Billing Provider - End */

   

    /* Facility Start */

    //$scope.initfacility = function () {

    //    $scope.FacilityPlaceOfServiceArray = [];
    //    $scope.OrganizationFacilityList = [];

    //    var obj = {
    //        "OrganizationId": $scope.hospitalParams.HospitalDetails.HospitalID,
    //        "FacilityName": ""
    //    }

    //    $q.all([
    //        eHnoteSettingsDataService.GetMasterPlaceOfServiceCodes(),
    //        eHnoteMainAdminServices.GetOrganizationFacilityDetails(obj)
    //    ]).then(function (resp) {
         
    //        if (resp[0].data.status == "Success") {
    //            if (resp[0].data.rows.length > 0) {
    //                $scope.FacilityPlaceOfServiceArray = resp[0].data.rows || [];
    //            }
    //        }
    //        if (resp[1].data.status == "Success") {
    //            resp[1].data.rows = resp[1].data.rows || [];
    //            if (resp[1].data.rows.length > 0) {
    //                $scope.OrganizationFacilityList = angular.copy(resp[1].data.rows);
    //                $scope.OrganizationFacilityObj = getorganizationfacilities();
    //            } else {
    //                $scope.FacilityAddObj.IsShowFacilitySetup = false;
    //            }
    //        }
    //    });
    //}

    $scope.AddUpdateFacilitiesDetails = function () {

        if ($scope.OrganizationFacilityObj.FacilityName == "") {
            alertify.error("Please Enter Facility Name");
            return false;
        }
        if ($scope.OrganizationFacilityObj.FaxNumber != "") {
            if ($scope.OrganizationFacilityObj.FaxNumber.length < 14) {
                alertify.error("Please Enter Valid Alternate Fax");
                return false;
            }
        }
        if ($scope.OrganizationFacilityObj.ContactFax != "") {
            if ($scope.OrganizationFacilityObj.ContactFax.length < 14) {
                alertify.error("Please Enter Valid Fax");
                return false;
            }
        }
        var obj = {
            "UserId": doctorinfo.doctorid,
            "OrganizationId": $scope.hospitalParams.HospitalDetails.HospitalID,
            "OrganizationFacilityId": $scope.OrganizationFacilityObj.OrganizationFacilityId,
            "FacilityShortName": $scope.OrganizationFacilityObj.FacilityShortName,
            "FacilityName": $scope.OrganizationFacilityObj.FacilityName,
            "BillingName": $scope.OrganizationFacilityObj.BillingName,
            "FacilityTypeId": $scope.OrganizationFacilityObj.FacilityTypeId,
            "FacilityTypeName": $scope.OrganizationFacilityObj.FacilityTypeName,
            "PlaceOfServiceId": $scope.OrganizationFacilityObj.PlaceOfServiceId,
            "PlaceOfService": $scope.OrganizationFacilityObj.PlaceOfService,
            "DefaultBillingProviderId": $scope.OrganizationFacilityObj.DefaultBillingProviderId,
            "Address1": $scope.OrganizationFacilityObj.Address1,
            "Address2": $scope.OrganizationFacilityObj.Address2,
            "CityId": $scope.OrganizationFacilityObj.CityId,
            "CityName": $scope.OrganizationFacilityObj.CityName,
            "StateId": $scope.OrganizationFacilityObj.StateId,
            "StateName": $scope.OrganizationFacilityObj.StateName,
            "ZipCode": ($scope.OrganizationFacilityObj.ZipCode || "").replace(/\D/g, ""),
            "CountryId": $scope.OrganizationFacilityObj.CountryId,
            "LocationId": $scope.OrganizationFacilityObj.LocationId,
            "LocationName": $scope.OrganizationFacilityObj.LocationName,
            "ContactName": $scope.OrganizationFacilityObj.ContactName,
            "ContactMobile": $scope.OrganizationFacilityObj.ContactMobile,
            "ContactEmail": $scope.OrganizationFacilityObj.ContactEmail,
            "ContactFax": $scope.OrganizationFacilityObj.ContactFax,
            "ContactFaxcountrycode": $scope.OrganizationFacilityObj.ContactFaxcountrycode,
            "ContactFaxAreacode": $scope.OrganizationFacilityObj.ContactFaxAreacode,
            "ContactFaxHomeNumber": $scope.OrganizationFacilityObj.ContactFaxHomeNumber,
            "FaxNumber": $scope.OrganizationFacilityObj.FaxNumber,
            "Faxcountrycode": $scope.OrganizationFacilityObj.Faxcountrycode,
            "FaxAreacode": $scope.OrganizationFacilityObj.FaxAreacode,
            "FaxHomeNumber": $scope.OrganizationFacilityObj.FaxHomeNumber,
            "NPI": $scope.OrganizationFacilityObj.NPI,
            "StateLicenceNumber": $scope.OrganizationFacilityObj.StateLicenceNumber,
            "CommercialNumber": $scope.OrganizationFacilityObj.CommercialNumber,
            "LocationNumber": $scope.OrganizationFacilityObj.LocationNumber,
            "CliaNumber": $scope.OrganizationFacilityObj.CliaNumber,
            "UB4Claim": $scope.OrganizationFacilityObj.UB4Claim,
            "ClaimTransmission": $scope.OrganizationFacilityObj.ClaimTransmission,
            "DeleteInd": $scope.OrganizationFacilityObj.DeleteInd || "N",
        }

        eHnoteMainAdminServices.AddUpdateOrganizationFacilities(obj).then(function (resp) {
            console.log(resp);
            if (resp.data.Status === "Success") {
                $scope.init();
                $scope.FacilityAddObj.IsShowFacilitySetup = false;
                $scope.FacilitybtnName = "Save";
            }
        }, function (err) {
            console.log(err);
            alertify.error("Getting Failed");
        });
    }



    $scope.ChangeCityName = function (item, type) {
        if (type == "facility") {
            $scope.OrganizationFacilityObj.CityName = item.CityName || "";
            $scope.OrganizationFacilityObj.CityId = item.CityId || null;
            $scope.OrganizationFacilityObj.StateName = item.StateName || "";
            $scope.OrganizationFacilityObj.StateId = item.StateId || null;
            if (item.ZipCodeArray.length > 0) {
                $scope.OrganizationFacilityObj.ZipCode = item.ZipCodeArray[0].ZIP;
            }
        }
    }

    $scope.changeStateName = function (item, type) {
        if (type == "facility") {
            $scope.OrganizationFacilityObj.StateName = item.Name || "";
            $scope.OrganizationFacilityObj.StateId = item.StateId || null;
        }
    }

    $scope.ClearFacilityDetails = function () {
        $scope.OrganizationFacilityObj = getorganizationfacilities();
    }

    $scope.FacilityContactNo = function (item) {
        var obj = eHnoteUserDataService.UsMobileFormatChange(item);
        $scope.OrganizationFacilityObj.ContactMobile = obj.UsFormatMobileNumber;
    }

    $scope.FacilitybtnName = "Save";
    $scope.showAddFacilityDetails = function () {
        $scope.OrganizationFacilityObj = getorganizationfacilities();
        $scope.FacilityAddObj.IsShowFacilitySetup = !$scope.FacilityAddObj.IsShowFacilitySetup;
        $scope.FacilitybtnName = "Save";
    }

    $scope.EditFacilityDetails = function (item) {
        $scope.OrganizationFacilityObj.OrganizationFacilityId = item.OrganizationFacilityId;
        $scope.OrganizationFacilityObj.FacilityShortName = item.FacilityShortName;
        $scope.OrganizationFacilityObj.FacilityName = item.FacilityName;
        $scope.OrganizationFacilityObj.BillingName = item.BillingName;
        $scope.OrganizationFacilityObj.FacilityTypeId = item.FacilityTypeId;
        $scope.OrganizationFacilityObj.FacilityTypeName = item.FacilityTypeName;
        $scope.OrganizationFacilityObj.PlaceOfServiceId = item.PlaceOfServiceId;
        $scope.OrganizationFacilityObj.PlaceOfService = item.PlaceOfService;
        $scope.OrganizationFacilityObj.DefaultBillingProviderId = item.DefaultBillingProviderId;
        $scope.OrganizationFacilityObj.Address1 = item.Address1;
        $scope.OrganizationFacilityObj.Address2 = item.Address2;
        $scope.OrganizationFacilityObj.CityId = item.CityId;
        $scope.OrganizationFacilityObj.CityName = item.CityName;
        $scope.OrganizationFacilityObj.StateId = item.StateId;
        $scope.OrganizationFacilityObj.StateName = item.StateName;
        $scope.OrganizationFacilityObj.ZipCode = item.ZipCode;
        $scope.OrganizationFacilityObj.CountryId = item.CountryId;
        $scope.OrganizationFacilityObj.LocationId = item.LocationId;
        $scope.OrganizationFacilityObj.LocationName = item.LocationName;
        $scope.OrganizationFacilityObj.ContactName = item.ContactName;
        $scope.OrganizationFacilityObj.ContactMobile = item.ContactMobile;
        $scope.OrganizationFacilityObj.ContactEmail = item.ContactEmail;
        if (item.ContactFax != "") {
            var contactfax = eHnoteUserDataService.UsMobileFormatChange(item.ContactFax);
            $scope.OrganizationFacilityObj.ContactFax = contactfax.UsFormatMobileNumber;
        }
       // $scope.OrganizationFacilityObj.ContactFax = item.ContactFax;
        if (item.FaxNumber != "") {
            var FaxNumber = eHnoteUserDataService.UsMobileFormatChange(item.FaxNumber);
            $scope.OrganizationFacilityObj.FaxNumber = FaxNumber.UsFormatMobileNumber;
        }
        //$scope.OrganizationFacilityObj.FaxNumber = item.FaxNumber;
        $scope.OrganizationFacilityObj.NPI = item.NPI;
        $scope.OrganizationFacilityObj.StateLicenceNumber = item.StateLicenceNumber;
        $scope.OrganizationFacilityObj.CommercialNumber = item.CommercialNumber;
        $scope.OrganizationFacilityObj.LocationNumber = item.LocationNumber;
        $scope.OrganizationFacilityObj.CliaNumber = item.CliaNumber;
        $scope.OrganizationFacilityObj.UB4Claim = item.UB4Claim;
        $scope.OrganizationFacilityObj.ClaimTransmission = item.ClaimTransmission;
        $scope.FacilityAddObj.IsShowFacilitySetup = true;
        $scope.FacilitybtnName = "Update";
    }

    $scope.DeleteFacilityList = function (item) {
        var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to delete?", function () {

            item.OrganizationFacilityId = item.OrganizationFacilityId || null;
            $scope.OrganizationFacilityObj.FacilityName = item.FacilityName || "";
            if (item.OrganizationFacilityId != null) {
                $scope.OrganizationFacilityObj.OrganizationFacilityId = item.OrganizationFacilityId;
                $scope.OrganizationFacilityObj.DeleteInd = "Y";
                $scope.AddUpdateFacilitiesDetails();
            } else {
                $scope.OrganizationFacilityObj.DeleteInd = "N";
            }
        },
            function () {
                $scope.$digest();
                r = "You pressed Cancel!";
            });
    }

    $scope.changeplanofservice = function (Id) {
        var filtredArray = $filter("filter")($scope.FacilityPlaceOfServiceArray, { "PlaceOfServiceId": Id }, true) || [];
        if (filtredArray.length > 0) {
            $scope.hospitalParams.HospitalDetails.PlaceOfServiceId = filtredArray[0].PlaceOfServiceId;
            $scope.hospitalParams.HospitalDetails.PlaceOfService = filtredArray[0].PlaceofServiceName;
        }
    }

    $scope.CancelFacilityDetails = function () {
        $scope.FacilityAddObj.IsShowFacilitySetup = false;
    }

    $scope.OnSearchZipCode = function (val) {
        val = val || "";
        if (val.length >= 5) {
            eHnoteSettingsDataService.GetLocationsByZipCode(val).then(function (resp) {
                if (resp.data.rows.length > 0) {
                    var basedZipcode = resp.data.rows || [];
                    if (basedZipcode.length > 0) {
                        $scope.OrganizationFacilityObj.CityName = basedZipcode[0].CityName;
                        $scope.OrganizationFacilityObj.CityId = basedZipcode[0].CityId;
                        $scope.OrganizationFacilityObj.StateName = basedZipcode[0].StateName;
                        $scope.OrganizationFacilityObj.StateId = basedZipcode[0].StateId;
                    }
                }
            });
        } else {
            $scope.OrganizationFacilityObj.CityName = "";
            $scope.OrganizationFacilityObj.CityId = "";
            $scope.OrganizationFacilityObj.StateName = "";
            $scope.OrganizationFacilityObj.StateId = "";
        }
    }

    /* Facility End */

    $scope.OrganizationBillingProviderGroupsDetails = [];
    $scope.GetOrganizationBillingProviderGroups = function () {
       
        var obj = {
            "ParentOrganizationId": $scope.BillingProviderGroupObj.ParentOrganizationId,
            "OrganizationId": 0
        }
        eHnoteMainAdminServices.GetOrganizationBillingProviderGroups(obj).then(function (resp) {
            console.log(resp);
            if (resp.data.status === "Success") {
                $scope.OrganizationBillingProviderGroupsDetails = angular.copy(resp.data.rows);
            }
        }, function (err) {
            console.log(err);
            alertify.error("Getting Failed");
        });
    }


    $scope.SaveBillingProviderGroupDetails = function () {

        //if ($scope.BillingProviderGroupObj.OrganizationId === 0) {
        //    alertify.error("Please select a location.");
        //    return false;
        //}

        if ($scope.BillingProviderGroupObj.ParentOrgBillingProviderId === 0) {
            alertify.error("Please select a billing provider.");
            return false;
        }

        if ($scope.BillingProviderGroupObj.EntityTypeId == 0) {
            alertify.error("Please select an Entity Type.");
            return false;
        }

        //if ($scope.BillingProviderGroupObj.InsuranceCoverageId === 0) {
        //    alertify.error("Please select an insurance coverage type.");
        //    return false;
        //}

        //if ($scope.BillingProviderGroupObj.InsuranceFormTypeId === 0) {
        //    alertify.error("Please select a form type.");
        //    return false;
        //}

        var isDuplicate = $scope.OrganizationBillingProviderGroupsDetails.some(function (item) {
            return item.OrganizationId === $scope.BillingProviderGroupObj.OrganizationId
        });

        //if (isDuplicate) {
        //    alertify.error("The selected Organization already exist.");
        //    return false;
        //}


        var obj = {
            "UserId": $scope.BillingProviderGroupObj.UserId,
            "BillingProviderGroupId": $scope.BillingProviderGroupObj.BillingProviderGroupId,
            "ParentOrgBillingProviderId": $scope.BillingProviderGroupObj.ParentOrgBillingProviderId,
            "DoctorId": $scope.BillingProviderGroupObj.DoctorId,
            "OrganizationId": $scope.BillingProviderGroupObj.OrganizationId || 0,
            "ParentOrganizationId": $scope.BillingProviderGroupObj.ParentOrganizationId,
            "InsuranceCoverageId": $scope.BillingProviderGroupObj.InsuranceCoverageId,
            "InsuranceFormTypeId": $scope.BillingProviderGroupObj.InsuranceFormTypeId,
            "EntityTypeId": $scope.BillingProviderGroupObj.EntityTypeId,
            "DeleteInd": $scope.BillingProviderGroupObj.DeleteInd || "N"
        }

        eHnoteMainAdminServices.AddUpdateOrganizationBillingProviderGroups(obj).then(function (resp) {
            console.log(resp);
            if (resp.data.status === "Success") {
                $scope.GetOrganizationBillingProviderGroups();
                $scope.BillingProviderGroupObj = getBillingProviderGroupObj();

                if ($scope.BillingProviderGroupBtn === "Update") {
                    $scope.BillingProviderGroupBtn = "Save";
                }
            }
        }, function (err) {
            console.log(err);
            alertify.error("Getting Failed");
        });
    }

    $scope.BillingProviderGroupBtn = "Save";
    $scope.showAddBillingProviderGroupDetails = function () {
        $scope.BillingProviderGroupObj = getBillingProviderGroupObj();
        $scope.BillingProviderGroupAddObj.IsAddDivShow = !$scope.BillingProviderGroupAddObj.IsAddDivShow;
        $scope.BillingProviderGroupBtn = "Save";
    }

    $scope.cancelBillingProviderGroupData = function () {
        $scope.BillingProviderGroupAddObj.IsAddDivShow = false;
    };

    $scope.ClearBillingProviderGroup = function () {
        $scope.BillingProviderGroupObj = getBillingProviderGroupObj();
    };

    $scope.EditBillingProviderGroups = function (item) {
        $scope.BillingProviderGroupObj.BillingProviderGroupId = item.BillingProviderGroupId;
        $scope.BillingProviderGroupObj.BillingProviderName = item.BillingProviderName;
        $scope.BillingProviderGroupObj.DoctorFirstName = item.DoctorFirstName;
        $scope.BillingProviderGroupObj.DoctorLastName = item.DoctorLastName;
        $scope.BillingProviderGroupObj.DoctorId = item.DoctorId;
        $scope.BillingProviderGroupObj.InsuranceFormTypeId = item.InsuranceFormTypeId;
        $scope.BillingProviderGroupObj.EntityTypeId = item.EntityTypeId||0;
        $scope.BillingProviderGroupObj.InsuranceCoverageId = item.InsuranceCoverageId;
        $scope.BillingProviderGroupObj.OrganizationId = item.OrganizationId;
        $scope.BillingProviderGroupObj.ParentOrgBillingProviderId = item.ParentOrgBillingProviderId;
        $scope.BillingProviderGroupBtn = "Update";
        $scope.BillingProviderGroupAddObj.IsAddDivShow = true;
    }

    $scope.DeleteBillingProviderGroups = function (item) {

        var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to delete?", function () {

            item.BillingProviderGroupId = item.BillingProviderGroupId || 0;
            if (item.BillingProviderGroupId != 0) {
                $scope.BillingProviderGroupObj.BillingProviderGroupId = item.BillingProviderGroupId;
                $scope.BillingProviderGroupObj.DoctorId = item.DoctorId;
                $scope.BillingProviderGroupObj.InsuranceFormTypeId = item.InsuranceFormTypeId;
                $scope.BillingProviderGroupObj.EntityTypeId = item.EntityTypeId;
                $scope.BillingProviderGroupObj.InsuranceCoverageId = item.InsuranceCoverageId;
                $scope.BillingProviderGroupObj.OrganizationId = item.OrganizationId;
                $scope.BillingProviderGroupObj.ParentOrgBillingProviderId = item.ParentOrgBillingProviderId;
                $scope.BillingProviderGroupObj.DeleteInd = "Y";
                $scope.SaveBillingProviderGroupDetails();
            }
        },
            function () {
                $scope.$digest();
                r = "You pressed Cancel!";
            });
    }

    $scope.onBillingProviderPageChange = function (Pageno) {
        $scope.OrgBillingProviderObj.PageNumber = Pageno;
        $scope.init();
    }

    $scope.changeBoxZipCode = function (val) {
        val = val || "";
        if (val.length >= 5) {
            eHnoteSettingsDataService.GetLocationsByZipCode(val).then(function (resp) {
                if (resp.data.rows.length > 0) {
                    var basedZipcode = resp.data.rows || [];
                    if (basedZipcode.length !== 0) {
                        $scope.newServiceFacilities.Box33CityName = basedZipcode[0].CityName;
                        $scope.newServiceFacilities.Box33CityId = basedZipcode[0].CityId;
                        $scope.newServiceFacilities.Box33StateName = basedZipcode[0].StateName;
                        $scope.newServiceFacilities.Box33StateId = basedZipcode[0].StateId;
                    }
                }
            });
        } else {
            $scope.newServiceFacilities.Box33CityName = "";
            $scope.newServiceFacilities.Box33CityId = 0;
            $scope.newServiceFacilities.Box33StateName = "";
            $scope.newServiceFacilities.Box33StateId = 0;
        }
    }
    $scope.getManagePaymentDevices = function () {
        $scope.ManagePaymentDevicesArray = [];
        var params = {
            "OrganizationId": $scope.HospitalId

        }
        eHnotePaymentGatewayService.GetManagePaymentDevicesList(params).then(function (resp) {
            if (resp.data.Status == "Success") {
                if (resp.data.rows.length > 0) {
                   
                    $scope.ManagePaymentDevicesArray = resp.data.rows || [];


                } else {

                }
            }

        }, function (err) {
            console.log(err);

        });
    }
    $scope.GetNMIPoiAllDevicesList = function () {
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        var params = {
            "OrganizationId": $scope.HospitalId,
            "UserId": $scope.UserId

        }
        eHnotePaymentGatewayService.GetNMIPoiAllDevicesList(params).then(function (resp) {
            if (resp.data.Status == "Success") {
                $scope.getManagePaymentDevices();
            }

        }, function (err) {
            console.log(err);

        });
    }
    function getBillingLocation() {
        var obj = {
            "ServiceLocationArray":[{
                "BranchServiceLocationId": 0,
                "ParentOrganizationId": parentHospitalId,
                "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                "ServiceLocationName": "",
                "ServiceLocationCode": "",
                "ServiceLocationTypeId": 0,
                "ServiceLocationType": "",
                "Address1": "",
                "Address2": "",
                "Location": "",
                "CityId": 0,
                "CityName": "",
                "StateId": 0,
                "StateName": "",
                "CountryId": 0,
                "CountryName": "",
                "ZipCode":"",
                "County": "",
                "CreatedBy": doctorinfo.doctorid,
                "CreatedDt": $filter('date')(new Date(), 'MM-dd-yyyy'),
                "ModifiedBy": doctorinfo.doctorid,
                "ModifiedDt": $filter('date')(new Date(), 'MM-dd-yyyy'),
                "DeleteInd": false,
                "PhoneNo": "",
                "Fax": "",
                "NPI": "",
                "TaxID": ""
            }]
            
        };
        return obj;
    }
    $scope.BillingLocation = angular.copy(getBillingLocation());
    $scope.AddMoreBillingLocations = function (item) {
       
        if ($scope.isIojOrgEnable == true) {


            if (item.ServiceLocationCode == "") {
                alertify.error("Please Enter ServiceLocationCode");
                return false;
            }
            if (item.ServiceLocationName == "") {
                alertify.error("Please Enter ServiceLocationName");
                return false;
            }
            if (item.ServiceLocationType == "") {
                alertify.error("Please Enter ServiceLocationType ");
                return false;
            }
            if (item.Address1 == "") {
                alertify.error("Please Enter  Address1");
                return false;
            }
            //if (item.Address2 == "") {
            //    alertify.error("Please Enter  Address2");
            //    return false;
            //}
            //if (item.Location == "") {
            //    alertify.error("Please Enter  Location");
            //    return false;
            //}
            if (item.CityName == "") {
                alertify.error("Please Enter  CityName");
                return false;
            }
            if (item.BillingLocationState == "") {
                alertify.error("Please Enter  Billing LocationState");
                return false;
            }
            if (item.StateName == "") {
                alertify.error("Please Enter  StateName");
                return false;
            }
            if (item.ZipCode == "") {
                alertify.error("Please Enter  ZipCode");
                return false;
            }
            var obj = {
                BranchServiceLocationId: 0,
                ParentOrganizationId: parentHospitalId,
                OrganizationId: doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                ServiceLocationName: "",
                ServiceLocationCode: "",
                ServiceLocationTypeId: 0,
                ServiceLocationType: "",
                Address1: "",
                Address2: "",
                Location: "",
                CityId: 0,
                CityName: "",
                StateId: 0,
                StateName: "",
                CountryId: 0,
                CountryName: "",
                ZipCode: "",
                County: "",
                CreatedBy: doctorinfo.doctorid,
                CreatedDt: $filter('date')(new Date(), 'MM-dd-yyyy'),
                ModifiedBy: doctorinfo.doctorid,
                ModifiedDt: $filter('date')(new Date(), 'MM-dd-yyyy'),
                DeleteInd: false,
                PhoneNo: "",
                Fax: "",
                NPI: "",
                TaxID: ""
            };
            $scope.BillingLocation.ServiceLocationArray.push(angular.copy(obj));
        }
    }
    $scope.RemoveBillingLocation = function (item) {
        if (item.BranchServiceLocationId ==0) {
            var index = $scope.BillingLocation.ServiceLocationArray.indexOf(item);
            $scope.BillingLocation.ServiceLocationArray.splice(index, 1);
        } else {
            item.DeleteInd = true;
        }
    }
    $scope.ChangezipcodeBillingLocation = function (val, item) {
        var index = $scope.BillingLocation.ServiceLocationArray.indexOf(item);
        val = val || "";
        if (val.length >= 5) {
            eHnoteSettingsDataService.GetLocationsByZipCode(val).then(function (resp) {
                if (resp.data.rows.length > 0) {
                    var basedZipcode = resp.data.rows || [];
                    if (basedZipcode.length !== 0) {

                        $scope.BillingLocation.ServiceLocationArray[index].CityName = basedZipcode[0].CityName;
                        $scope.BillingLocation.ServiceLocationArray[index].CityId = basedZipcode[0].CityId;
                        $scope.BillingLocation.ServiceLocationArray[index].StateName = basedZipcode[0].StateName;
                        $scope.BillingLocation.ServiceLocationArray[index].StateId = basedZipcode[0].StateId;
                        $scope.BillingLocation.ServiceLocationArray[index].CountryName = basedZipcode[0].CountryName;
                        $scope.BillingLocation.ServiceLocationArray[index].CountryId = basedZipcode[0].CountryId;

                    }
                }
            });
        }

        else {
            $scope.BillingLocation.ServiceLocationArray[index].CityName = '';
            $scope.BillingLocation.ServiceLocationArray[index].CityId = 0;
            $scope.BillingLocation.ServiceLocationArray[index].StateName = '';
            $scope.BillingLocation.ServiceLocationArray[index].StateId = 0;
            $scope.BillingLocation.ServiceLocationArray[index].CountryName = '';
            $scope.BillingLocation.ServiceLocationArray[index].CountryId = 0;
            $scope.BillingLocation.ServiceLocationArray[index].ZipCodeArray = [];

        }
    }
}]);
"use strict";
eHnoteWebApp.controller("UsASCParentCtrl", ["$scope", "$rootScope", "$location", "$filter", "eHnoteLoginStatusService", "eHnoteMasterDataService", "eHnotePatientDataService", "alertify", "eHnoteCacheStorageService", "eHnoteUserAppointmentDataService", "$uibModal", "eHnoteSettingsDataService", "datapersistanceFactory", "eHnoteUserDataService", "eHnoteInsuranceService", 'localStorageFactory', function ($scope, $rootScope, $location, $filter, eHnoteLoginStatusService, eHnoteMasterDataService, eHnotePatientDataService, alertify, eHnoteCacheStorageService, eHnoteUserAppointmentDataService, $uibModal, eHnoteSettingsDataService, datapersistanceFactory, eHnoteUserDataService, eHnoteInsuranceService, localStorageFactory) {

    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.RoleId = doctorinfo.doctordata.User[0].RoleId;

    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
    $scope.Tab = "preadmission";
    $scope.cacheStorageItem.AppointmentType = $scope.cacheStorageItem.AppointmentType || '';
    if ($scope.RoleId === 18) {
        if ($scope.cacheStorageItem.AppointmentType == 'ASC') {
            $scope.Tab = "asclist";
            $scope.$emit("OnClickEhnoteInASC", 4);
        } else if ($scope.cacheStorageItem.AppointmentType == 'preauth') {
            $scope.Tab = "preauth";
            $scope.$emit("OnClickEhnoteInASC", 8);

        } else if ($scope.cacheStorageItem.AppointmentType == 'audit') {
            $scope.Tab = "audit";
            $scope.$emit("OnClickEhnoteInASC", 9);

        }
        else {
            $scope.Tab = "preadmission";
            $scope.$emit("OnClickEhnoteInASC", 7);
        }
    } else {
        if ($scope.cacheStorageItem.AppointmentType == 'Pre-Op') {
            $scope.Tab = "preadmission";
            $scope.$emit("OnClickEhnoteInASC", 7);
        } else if ($scope.cacheStorageItem.AppointmentType == 'preauth') {
            $scope.Tab = "preauth";
            $scope.$emit("OnClickEhnoteInASC", 8);

        } else if ($scope.cacheStorageItem.AppointmentType == 'audit') {
            $scope.Tab = "audit";
            $scope.$emit("OnClickEhnoteInASC", 9);

        }
        else if ($scope.cacheStorageItem.AppointmentType == 'ASC') {
            $scope.Tab = "asclist";
            $scope.$emit("OnClickEhnoteInASC", 4);
            //$scope.Tab = "dashboard";
            //$scope.$emit("OnClickEhnoteInASC", 10);

        } else {
            $scope.Tab = "asclist";
            $scope.$emit("OnClickEhnoteInASC", 4);
        }
    }

    $scope.ParentObj = {
        'IsIOJParentOrganization': false,
        /* Active top level ASC module, "ASC" or "Laser". Runtime mirror of the persisted
           value, read by UsAscAppointmentList through the scope chain to decide
           SurgeryCategoryIds. "ASC List" and "Laser" share the same asclist view, only this
           value differs.
           Restored here rather than defaulted, so returning from the patient profile or any
           other route keeps the module the user was last on. getAscModuleType() falls back
           to "ASC" only when nothing was ever stored. */
        'ASCModuleType': eHnoteMasterDataService.getAscModuleType()
    };

    var currenturl = $location.absUrl().split('?')[0];

    var CurrentEnvironment = currenturl.split('/#')[0];

    if (CurrentEnvironment == "https://ioj.ehnote.com" || CurrentEnvironment == "https://insts.ehnote.com") {
        $scope.ParentObj.IsIOJParentOrganization = true;
    } else {
        $scope.ParentObj.IsIOJParentOrganization = false;
    }

    //else {
    //    $scope.Tab = "preadmission";
    //    $scope.$emit("OnClickEhnoteInASC", 7);
    //}
    var Advacnesearchfreez = eHnoteMasterDataService.getaddAdvanceSearchAsc() || '';
    Advacnesearchfreez.IsfromAdvanceSearch = Advacnesearchfreez.IsfromAdvanceSearch || false;
    if (Advacnesearchfreez.IsfromAdvanceSearch) {
        $scope.Tab = 'advancesearch';
    }
    $scope.Advance = {
        'SearchText': '',
        'SerachType': 1,
        'LSearchText': '',
        'IsAdvanceSearch': false,
    }
    $scope.$on('OptTabActive', function (event, data) {
        if (data.response == 'advancesearch') {
            data.Patient = data.Patient || '';
            $scope.filters = {
                firstName: '',
                lastName: '',
                birthYear: '',
                birthMonth: '',
                gender: '',
                insurance: '',
                PayOrID: 0
            };
            if (data.Patient != '') {
                $scope.patSearchType = data.Patient.patSearchType || 0;
                $scope.PatientSearch.SearchText = data.Patient.SearchText || '';
            }
            $scope.Advance.SerachType = $scope.patSearchType;
            $scope.Advance.SearchText = $scope.PatientSearch.SearchText;
            /*$scope.SearchByTextHeader();*/
            $scope.AdvanceSearchByText();
        }
        $scope.switchTab(data.response);
    });
    $scope.AddToCache = function () {


        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();

    };
    $scope.switchTab = function (tab) {
        /* "laser" is the same ASC appointment list scoped to surgery category 4. It reuses the
           asclist view, only the category scope handed down to the list controller differs. */
        if (tab == "laser") {
            $scope.ParentObj.ASCModuleType = "Laser";
            tab = "asclist";
        } else if (tab == "asclist") {
            $scope.ParentObj.ASCModuleType = "ASC";
        }

        /* Persist the choice so it survives navigating away to the patient profile,
           the chart or any other route and back again. */
        eHnoteMasterDataService.addAscModuleType($scope.ParentObj.ASCModuleType);

        $scope.Tab = tab;
        if (tab == "preadmission") {
            $scope.cacheStorageItem.AppointmentType = 'Preadmission';
        } else {
            $scope.cacheStorageItem.AppointmentType = 'ASC';
        }
        $scope.AddToCache();

        /* Going from ASC List to Laser or back leaves Tab == 'asclist', so the list controller
           is not re-created by ng-if and has to be told to reload with the new category scope.
           Coming from another module it is created fresh and reads ParentObj.ASCModuleType. */
        if (tab == "asclist") {
            $scope.$broadcast('ASCModuleTypeChanged', { "ASCModuleType": $scope.ParentObj.ASCModuleType });
        }
    };
  
 
 
    $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();   

    
    
    $scope.navtoBookAppointment = function () {   
        $scope.$broadcast('openAscNewbookAppointment');
    };
    $scope.filteredPatients = [];
    $scope.PatientsArray = [];
    $scope.patientpushval = [];
    $scope.patientinitval = {};
    $scope.BirthYearsforfilter = [];
    $scope.BirthMonthsforfilter = [];
    $scope.Insurencedetailsforfilter = [];
    $scope.Insurencedetailsforfilter = [];
    var currentYear = new Date().getFullYear();
    for (var year = currentYear; year >= 1900; year--) {
        $scope.BirthYearsforfilter.push(year);
    }
    let monthNamesOrder = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    $scope.BirthMonthsforfilter = monthNamesOrder || [];
    $scope.filters = {
        firstName: '',
        lastName: '',
        birthYear: '',
        birthMonth: '',
        gender: '',
        insurance: '',
        PayOrID: 0
    };

    $scope.AdvanceSearchByText = function (type, fil) {
        $scope.filteredPatients = [];

        $scope.Insurencedetailsforfilter = [];
        $scope.PatientsArray = [];
        $scope.patientpushval = [];
        $scope.patientinitval = {};
        if (type == 2) {

            $scope.PatientSearch.SearchText = $scope.Advance.SearchText || '';
            $scope.patSearchType = $scope.Advance.SerachType || 0;
        }
        let searchtext = '';
        if (!$scope.Advance.IsAdvanceSearch) {
           
            if ($scope.patSearchType == 1 && $scope.PatientSearch.SearchText.length > 3) {
                searchtext = $scope.PatientSearch.SearchText || '';
            }
            if ($scope.patSearchType == 2 && $scope.PatientSearch.SearchText.length > 5) {
                searchtext = $scope.PatientSearch.SearchText || '';
            }
            if ($scope.patSearchType == 3 && $scope.PatientSearch.SearchText.length > 9) {
                searchtext = $scope.PatientSearch.SearchText || '';
            }
        }
        else if ($scope.Advance.IsAdvanceSearch) {
            $scope.patSearchType = 1;
            $scope.PatientSearch.SearchText = "";
            $scope.Advance.SearchText = '';
            $scope.Advance.SerachType = 1;
            if ($scope.filters.firstName != '') {
                searchtext = $scope.filters.firstName || '';
            }
            if ($scope.filters.lastName != '') {
                searchtext = $scope.filters.lastName || '';
            }
        }
        if (searchtext != ''|| $scope.Advance.IsAdvanceSearch) {
            var AdvanceSearch = {
                "IsfromAdvanceSearch": true,
                "Searchtext": $scope.PatientSearch.SearchText || '',
                "Type": $scope.patSearchType || 1,
               /* "Filtersearch": $scope.Advance.IsAdvanceSearch || false,*/
            }
            eHnoteMasterDataService.addAdvanceSearchAsc(AdvanceSearch);
            $scope.PatientsArray = [];
            var name = searchtext;

            if (name === undefined || name === '') {
                type = 'click';
            }

            if ($scope.patSearchType === 5) {
                name = name + " 00:00:00";

                var parsedDate = new Date(name);
                if (!isNaN(parsedDate.getTime())) {
                    name = $filter('date')(parsedDate, "yyyy-MM-dd");
                } else {

                    alertify.error("Invalid date format:", name);
                    name = "";

                    return false;
                }
            }

            if (name && name.length >= 4 || $scope.patSearchType !== 1 || $scope.Advance.IsAdvanceSearch) {
                $scope.Emailid = "";

                if ($scope.patSearchType == 1 && $scope.Advance.SearchText != '' && !$scope.Advance.IsAdvanceSearch) {
                    $scope.filters.firstName = $scope.Advance.SearchText || '';

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

                if (!isNaN(name) && $scope.patSearchType == 3) {
                    if (name.length < 10) {
                        param.hasparam = false;
                        return;
                    }
                }
                if (!isNaN(name)) {
                    param.PhoneNumber = name;
                    param.hasparam = true;
                    param.SearchText = "";
                } else {
                    param.SearchText = name;
                    param.hasparam = true;
                    param.PhoneNumber = "";
                }
                param.UserId = eHnoteMasterDataService.getLoginId();
                let doctorInfo = eHnoteMasterDataService.getUserInfo();
                if (doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
                    param['HospitalID'] = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
                    $scope.CheckHospitalId = {};
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
                var doctorinfoaccess = eHnoteMasterDataService.getUserInfo();
                eHnoteMasterDataService.addPatientSearchInfo(param);

                if (param.PhoneNumber !== "") {
                    var object = {
                        "UserId": eHnoteMasterDataService.getLoginId(),
                        "HospitalID": doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                        "HospitalIDLst": param.HospitalIDLst.toString(),
                        "SearchText": param.PhoneNumber || '',
                        "SearchTypeID": $scope.patSearchType || 0,
                        //"PageSize": 50,
                        //"PageNumber": $scope.AdvcurrentPage || 1,
                    }
                    eHnotePatientDataService.GetPatientsAdvanceSearch(object, OnGetopSearchPatientSuccess, OnGetopPatientSearchError, $scope.sendhospcode);
                } else {
                    if (!$scope.Advance.IsAdvanceSearch) {
                        var object = {
                            "UserId": eHnoteMasterDataService.getLoginId(),
                            "HospitalID": doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                            "HospitalIDLst": param.HospitalIDLst.toString(),
                            "SearchText": param.SearchText || "",
                            "SearchTypeID": $scope.patSearchType || 0,
                            //"PageSize": 50,
                            //"PageNumber": $scope.AdvcurrentPage || 1,
                            "FirstName": '',
                            "LastName": '',
                            "DOBYear": '',
                            "DOBMonth": '',
                            "OrganizationPayorId": 0,
                            "IsAdvanceSearch": false,
                            "Gender": '',
                        }
                    } else {
                        var object = {
                            "UserId": eHnoteMasterDataService.getLoginId(),
                            "HospitalID": doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                            "HospitalIDLst": param.HospitalIDLst.toString(),
                            "SearchText": "",
                            "SearchTypeID": 1,
                            //"PageSize": 50,
                            //"PageNumber": $scope.AdvcurrentPage ||1,
                            "FirstName": $scope.filters.firstName || '',
                            "LastName": $scope.filters.lastName || '',
                            "DOBYear": $scope.filters.birthYear || '',
                            "DOBMonth": $scope.filters.birthMonth || '',
                            "OrganizationPayorId": $scope.filters.PayOrID || 0,
                            "IsAdvanceSearch": $scope.Advance.IsAdvanceSearch || false,
                            "Gender":$scope.filters.gender||'',
                        }
                    }
                    eHnotePatientDataService.GetPatientsAdvanceSearch(object, OnGetopSearchPatientSuccess, OnGetopPatientSearchError, $scope.sendhospcode);
                }
            }
        }
        else {
            $scope.patientpushval = [];
            $scope.PatientsArray = [];
            $scope.filteredPatients = [];
            $scope.Advance.IsAdvanceSearch = false;
            $scope.Insurencedetailsforfilter = [];
            return;
        }
    };
    function OnGetopSearchPatientSuccess(data) {
        if (data.count > 0) {
            $scope.totalItems = data.Count;
            $scope.count = data.count;
            $scope.PatientsArray = [];
            $scope.patientpushval = [];
            $scope.patientinitval = {};
            $scope.filteredPatients = [];
            $scope.Advance.IsAdvanceSearch = false;
            $scope.Insurencedetailsforfilter = [];

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
                $scope.patientinitval.LastName = item.LastName || "";
                $scope.patientinitval.FirstName = item.FirstName || "";
                $scope.patientinitval.InsuranceDetails = item.InsuranceDetails || [];
                var obj = eHnoteUserDataService.UsMobileFormatChange(item.Altareacode + item.AltHomeNumber);
                $scope.patientinitval.MobileNo = obj.UsFormatMobileNumber;

                $scope.patientinitval.Year = item.Year || "";
                $scope.patientinitval.Monthname = item.Monthname || "";

                var previouspatval = angular.copy($scope.patientinitval);
                $scope.patientpushval.push(previouspatval);

            });
            /*console.log($scope.patientpushval);*/
            angular.forEach($scope.patientpushval, function (item) {
                item.InsuranceDetails1 = '';
                item.InsuranceDetails2 = '';
                if (item.InsuranceDetails.length > 0) {
                    let count = 0;
                    angular.forEach(item.InsuranceDetails, function (initem) {
                        if (count == 0) {
                            item.InsuranceDetails1 = initem.OrganizationPayorName || '';
                            count++;
                        } else if (count == 1) {
                            item.InsuranceDetails2 = initem.OrganizationPayorName || '';
                            count++;
                        }
                        if (!$scope.Insurencedetailsforfilter.includes(initem.PlanName)) {
                            $scope.Insurencedetailsforfilter.push(initem.PlanName);
                        }
                    });

                }

            });

            $scope.PatientsArray = $scope.patientpushval;
            $scope.filteredPatients = $scope.patientpushval || [];
            $scope.noresult = false;
            $scope.showloading = false;

        } else {
            $scope.count = 0;
            $scope.PatientsArray = [];
            $scope.filteredPatients = [];
            $scope.totalItems = 0;
            $scope.Advance.IsAdvanceSearch = false;
        }
        if ($scope.PatientSearch.SearchText != "") {
            $scope.ShowPatientListDrop = true;
        }
    }
    function OnGetopPatientSearchError() {
        $scope.count = 0;
        $scope.PatientsArray = [];
        $scope.PatientSearch.SearchText = "";
        $scope.Advance.IsAdvanceSearch = false;
    }
    $scope.ClearSearchtext = function () {
        $scope.Advance.SearchText = '';
        $scope.Advance.LSearchText = '';
        $scope.Showlastnamefilter = false;
        $scope.filteredPatients = [];
        $scope.patientpushval = [];
        $scope.Advance.IsAdvanceSearch = false;
    }


    $scope.customFilter = function () {
        if (!$scope.Advance.SearchText || !$scope.Advance.SerachType) {
            $scope.filteredPatients = $scope.patientpushval; // No filter applied, show all items
            $scope.applySort();
            return;
        }

        var searchValue = $scope.Advance.SearchText.toLowerCase();
        $scope.patientpushval = $scope.patientpushval || [];
        $scope.filteredPatients = $scope.patientpushval.filter(function (patientitem) {
            if ($scope.Advance.SerachType == 1) {
                // FullName wise search
                if (!$scope.Showlastnamefilter) {
                    return patientitem.FullName.toLowerCase().includes(searchValue);
                } else {
                    /*    return patientitem.LastName.toLowerCase().includes($scope.Advance.LSearchText);*/
                    return patientitem.FirstName.toLowerCase().includes(searchValue) &&
                        patientitem.LastName.toLowerCase().includes($scope.Advance.LSearchText);
                }
            } else if ($scope.Advance.SerachType == 2) {
                // DisplayID wise search
                return patientitem.DisplayID.toLowerCase().includes(searchValue);
            } else if ($scope.Advance.SerachType == 3) {
                // PhoneNumber wise search
                /*var phoneNumber = patientitem.PhoneNumber.replace(/[^0-9]/g, '');*/
                return patientitem.PhoneNumber.toLowerCase().includes(searchValue);
            }

            return false; // Default case
        });
        $scope.applySort();
    };

    $scope.sortProperty = '';
    $scope.sortReverse = false;
    $scope.applySort = function () {
        $scope.filteredPatients = $filter('orderBy')($scope.filteredPatients, $scope.sortProperty, $scope.sortReverse);
    };

    $scope.toggleSort = function (property) {
        if ($scope.sortProperty === property) {
            $scope.sortReverse = !$scope.sortReverse;
        } else {
            $scope.sortProperty = property;
            $scope.sortReverse = false;
        }
        $scope.applySort();
    };
    $scope.Showlastnamefilter = false;
    $scope.Filterwithlastname = function (patientitem, planIndex) {
        $scope.Showlastnamefilter = !$scope.Showlastnamefilter || false;
        if ($scope.Showlastnamefilter) {
            $scope.Advance.LSearchText = $scope.Advance.SearchText || '';
            $scope.Advance.SearchText = '';
        } else {
            $scope.Advance.SearchText = $scope.Advance.LSearchText || '';
            $scope.Advance.LSearchText = '';
        }
        
        $scope.customFilter()
    }
    Advacnesearchfreez.IsfromAdvanceSearch = Advacnesearchfreez.IsfromAdvanceSearch || false;
    if (Advacnesearchfreez.IsfromAdvanceSearch) {
        $scope.Advance.SearchText = Advacnesearchfreez.Searchtext || '';
        $scope.Advance.SerachType = Advacnesearchfreez.Type || 1;
        $scope.AdvanceSearchByText(2);
    }

    $scope.applyFilters = function () {
        $scope.filteredPatients = $scope.filteredPatients.filter(function (patientitem) {
            var matchesFirstName = !$scope.filters.firstName || patientitem.FirstName.toLowerCase().includes($scope.filters.firstName.toLowerCase());
            var matchesLastName = !$scope.filters.lastName || patientitem.LastName.toLowerCase().includes($scope.filters.lastName.toLowerCase());
            var matchesBirthYear = !$scope.filters.birthYear || patientitem.Year === $scope.filters.birthYear;
            var matchesBirthMonth = !$scope.filters.birthMonth || patientitem.Monthname === $scope.filters.birthMonth;
            var matchesGender = !$scope.filters.gender || patientitem.Gender === $scope.filters.gender;
            var matchesInsurance = !$scope.filters.insurance ||
                patientitem.InsuranceDetails.some(insurance => insurance.OrganizationPayorId === $scope.filters.insurance.OrganizationPayorId);

            return matchesFirstName && matchesLastName && matchesBirthYear && matchesBirthMonth && matchesGender && matchesInsurance;
        });



        if ($scope.filteredPatients.length == 0) {
            if (($scope.filters.firstName && $scope.filters.firstName.length >= 4) || ($scope.filters.lastName && $scope.filters.lastName.length >= 4) || ($scope.filters.birthYear && $scope.filters.birthYear.toString().length >= 4)) {
                /* return false;*/

                $scope.Advance.IsAdvanceSearch = true;
                $scope.AdvanceSearchByText(2);
            }
        }
        $scope.applySort(); // Apply sorting
    };

    $scope.Clearfilter = function () {
        $scope.filteredPatients = angular.copy($scope.patientpushval);
        $scope.filters = {
            firstName: '',
            lastName: '',
            birthYear: '',
            birthMonth: '',
            gender: '',
            insurance: '',
            PayOrID: 0
        };
  
    }
    $scope.maxSize = 50;
    $scope.AdvcurrentPage = 1;
    $scope.AssespageChanged = function (AdvcurrentPage) {
        $scope.AdvcurrentPage = AdvcurrentPage;
        $scope.AdvanceSearchByText(2);
    }
    $scope.SearchPayorListByText = function (SearchText) {
        var param = {
            "SearchText": SearchText || "",
            "Status": "Active",
            "PageSize": 20,
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
            if (resp.data.Status == "Success") {
                if (resp.data.count !== 0) {
                    if (resp.data.rows !== undefined) {
                        return resp.data.rows.map(function (item) {
                            return item;
                        });
                    }
                }
            }
        });
    };
    $scope.onSelectOrganizationPayor = function (planobj, mainplanobj) {
        if (planobj != undefined) {
            $scope.filters.PayOrID = planobj.OrganizationPayorId;
        }
    };
    $scope.ChangeOrganizationPayorList = function (mainplanobj) {
        $scope.filters.PayOrID = 0;

    };
    $scope.onselectBirth = function (mainplanobj) {
        $scope.filters.birthYear = mainplanobj;
    }
    $scope.changefocusOption = function () {
        $scope.filters.birthYear = '';
    }
    $scope.clearPatientSearchData = function () {
        $scope.Advance.SearchText = '';
    };

    $scope.mainAscParentObj = {
        "AllBranchesList": [],
        "IsAscBranchAvailable":false
    }
    
    function InitializeBranches(data, pagetype) {
        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        var clinicAddress = eHnoteUserAppointmentDataService.RestructureNewBranches($scope.UserAccessRights.AllAccessRights.APPListAllBranchesAppointments, data, doctorinfo) || [];
        var EmptyClinicObj = {
            "ClinicName": "All Locations",
            "ClinicId": 0,
            "BranchName": "All Locations",
            "BranchId": 0,
            "SubOrganizationId": 0,
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
            "CommunicationMobileNo": "",
            "IsChecked": false
        };
        clinicAddress.unshift(EmptyClinicObj);
        $scope.AppListdoctoraddress = clinicAddress;
      
        //let AscBranchArray = $filter('filter')($scope.AppListdoctoraddress, { 'IsASCBranch': true }, true) || [];
        //if (AscBranchArray.length > 0) {
        //    $scope.mainAscParentObj.IsAscBranchAvailable = true;
        //    $scope.AppListdoctoraddress = AscBranchArray;
        //}

        $scope.mainAscParentObj.AllBranchesList = clinicAddress || [];
    }

    $scope.init = function () {

        var NewBranchList = localStorageFactory.getItem("allBranchesData") || [];
        InitializeBranches(NewBranchList, "PageLoad");
    };
    $scope.init();


    $scope.ASCAuditManagementInfo = {
        templateUrl: 'templates/uibpopups/ASCAuditManagementInfoPopover.html',
    };
}]);
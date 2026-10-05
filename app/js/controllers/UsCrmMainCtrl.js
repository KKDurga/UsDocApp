"use strict";
eHnoteWebApp.controller("UsCrmMainCtrl", ["$scope", "localStorageFactory", "CmsUtilites", "eHnoteMasterDataService", "eHnoteLoginStatusService", "eHnoteMainAppointmentService", "eHnoteCacheStorageService", "datapersistanceFactory", "eHnotePatientDataService", "eHnoteUserDataService", "$filter", "eHnoteInsuranceService", function ($scope, localStorageFactory, CmsUtilites, eHnoteMasterDataService, eHnoteLoginStatusService, eHnoteMainAppointmentService, eHnoteCacheStorageService, datapersistanceFactory, eHnotePatientDataService, eHnoteUserDataService, $filter, eHnoteInsuranceService) {


    $scope.pageno = 0;
   

    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
    $scope.userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();

    $scope.UserId = eHnoteMasterDataService.getLoginId();
    $scope.RoleId = $scope.userLoginDetails.RoleID;

    $scope.showRegPatBtninPatients = true;

    $scope.OrganizationSettingsData = datapersistanceFactory.getItem("OrganizationSettingsData");

    var doctorInfo = eHnoteMasterDataService.getUserInfo();
    $scope.SpecializationId = doctorInfo.doctordata.User[0].SpecializationId;

    $scope.CRMTab = "";
    $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();

 
     if ($scope.UserAccessRights.SubAccessCategories.CrmAppointments) {
        $scope.CRMTab = "Appointments";
    }
    else if ($scope.UserAccessRights.SubAccessCategories.CRMTodaysWorkUp) {
        $scope.CRMTab = "WorkUp";
    }
     else if ($scope.UserAccessRights.SubAccessCategories.CrmNoShow) {
         $scope.CRMTab = "NoShowAppointments";
     }
    else if ($scope.UserAccessRights.SubAccessCategories.CrmReminders) {
        $scope.CRMTab = "Recall";
    }
    else {
        $scope.CRMTab = "AppointmentRequests";
    }
    //$scope.CRMTab = "Dashboard";
    $scope.$emit("Crmmaintab", $scope.CRMTab);
    //$scope.selectedCrmTabs = eHnoteMasterDataService.getselectedCrmTab();
    //console.log($scope.selectedCrmTabs);

    //$scope.CRMTab = "";

    //if ($scope.selectedCrmTabs.TabName === "" || $scope.selectedCrmTabs.TabName === undefined) {
    //    var obj = {
    //        "TabName": "Appointments"
    //    };
    //    eHnoteMasterDataService.addselectedCrmTab(obj);
    //    $scope.CRMTab = "Appointments";
    //} else {
    //    $scope.CRMTab = $scope.selectedCrmTabs.TabName;
    //}
    $scope.ParentObj.IsIOJParentOrganization;
    console.log($scope.CRMTab + "_CRMTab");
    var Advacnesearchfreez = eHnoteMasterDataService.getaddAdvanceSearchCrm() || '';
    Advacnesearchfreez.IsfromAdvanceSearch = Advacnesearchfreez.IsfromAdvanceSearch || false;
    if (Advacnesearchfreez.IsfromAdvanceSearch) {
        $scope.CRMTab = 'advancesearch';
    }
    $scope.Advance = {
        'SearchText': '',
        'SerachType': 1,
        'LSearchText': '',
        'IsAdvanceSearch': false,
    }
    $scope.$on('CrmTabActive', function (event, data) {
        console.log(data);
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
        $scope.switchMainCrmTab(data.response);
    });

    $scope.switchMainCrmTab = function (tab) {
        var obj = {
            "TabName": tab
        };
       // eHnoteMasterDataService.addselectedCrmTab(obj);
        $scope.CRMTab = tab;
    };

    $scope.navtoBookAppointment = function (screen) {
        var obj = {
            'IsComingFrom': '',
        }
       var openBookAppt = screen || "";
        datapersistanceFactory.set("SingleDoctorcalendar", obj);
        $scope.$broadcast('openNewbookAppointment', openBookAppt);
    };

    $scope.navtoBookAppointmentv2 = function (screen) {
        var obj = {
            'IsComingFrom': '',
        }
       var openBookAppt = screen || "";
        datapersistanceFactory.set("SingleDoctorcalendar", obj);
        $scope.$broadcast('openNewbookAppointmentv2', openBookAppt);
    };


    $scope.navtoNewAppointmentScreen = function () {
        $scope.$broadcast("changePrintAnother", doctorInfo);
    };

    $scope.printAllConsultationentryForms = function (string) {

        $scope.$broadcast("PrintAllConsultationEntryForms",string);
    }

    $scope.filteredPatients = [];
    $scope.PatientsArray = [];
    $scope.patientpushval = [];
    $scope.patientinitval = {};
    $scope.BirthYearsforfilter = [];
    $scope.BirthMonthsforfilter = [];
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

        if (searchtext != '' || $scope.Advance.IsAdvanceSearch) {
            var AdvanceSearch = {
                "IsfromAdvanceSearch": true,
                "Searchtext": $scope.PatientSearch.SearchText || '',
                "Type": $scope.patSearchType || 1,
            }
            eHnoteMasterDataService.addAdvanceSearchCrm(AdvanceSearch);
            $scope.PatientsArray = [];
            var name = searchtext;
            if ($scope.Advance.IsAdvanceSearch) {
                if ($scope.filters.firstName != '') {
                    name = $scope.filters.firstName || '';
                }
                if ($scope.filters.lastName != '') {
                    name = $scope.filters.lastName || '';
                }
            }

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

            if ((name && name.length >= 4) || ($scope.patSearchType !== 1) || ($scope.Advance.IsAdvanceSearch)) {
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
                            "Gender":  '',

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
                            "Gender": $scope.filters.gender || '',

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
            //$scope.BirthYearsforfilter = [];
            //$scope.BirthMonthsforfilter = [];
            $scope.Insurencedetailsforfilter = [];
            $scope.Advance.IsAdvanceSearch = false;
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
            //$scope.BirthYearsforfilter = [];
            //$scope.BirthMonthsforfilter = [];
           /* $scope.Insurencedetailsforfilter = [];*/
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
                $scope.patientinitval.PatientDisplayId = item.DisplayID;
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
                if (item.ProfileImg != "") {
                    $scope.patientinitval.S3URL = item.ProfileImg || "";
                }
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
    }
    $scope.filterPopover = {
        templateUrl: "filterCalenderPopover2.html",
    }
    $scope.closeFilterPopover = function () {
        angular.element(document.querySelector('.popover')).remove();
    };
}]);
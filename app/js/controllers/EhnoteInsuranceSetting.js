"use strict";
eHnoteWebApp.controller("EhnoteInsuranceSetting", ["$scope", "$rootScope", "$location", "datapersistanceFactory", "eHnoteCacheStorageService", "eHnoteValidateUsersDataService", "eHnoteMasterDataService", "eHnoteLoginStatusService", "eHnoteSettingsDataService", "alertify", "Upload", "$window", "Lightbox", "eHnoteAdminUserServices", "eHnoteConditionsDataService", "$http", "loginCookieFactory", "eHnoteDiagnosisDataServices", "eHnoteProcedureDataService", "$timeout", "$filter", "eHnoteUserAppointmentDataService", "localStorageFactory", "eHnoteSurgeryService", "InventoryService", "HInventoryService", "eHnoteOrgReferralDataServices", "$q", "eHnoteInsuranceService", "eHnotePatientAddressDataServices", "eHnoteLabService", "eHnoteMainAppointmentService", "$uibModal", "eHnoteMainAdminServices", function ($scope, $rootScope, $location, datapersistanceFactory, eHnoteCacheStorageService, eHnoteValidateUsersDataService, eHnoteMasterDataService, eHnoteLoginStatusService, eHnoteSettingsDataService, alertify, Upload, $window, Lightbox, eHnoteAdminUserServices, eHnoteConditionsDataService, $http, loginCookieFactory, eHnoteDiagnosisDataServices, eHnoteProcedureDataService, $timeout, $filter, eHnoteUserAppointmentDataService, localStorageFactory, eHnoteSurgeryService, InventoryService, HInventoryService, eHnoteOrgReferralDataServices, $q, eHnoteInsuranceService, eHnotePatientAddressDataServices, eHnoteLabService, eHnoteMainAppointmentService, $uibModal, eHnoteMainAdminServices) {
    var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
    $scope.doctorinfo = eHnoteMasterDataService.getUserInfo();

    $scope.HospitalId = 0;
    $scope.ParentHospitalId = 0;
    if ($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
        $scope.HospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        $scope.ParentHospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
    }

    $scope.SpecializationId = $scope.doctorinfo.doctordata.User[0].SpecializationId;
    $scope.RoleId = userLoginDetails.RoleID;
    $scope.UserId = eHnoteMasterDataService.getLoginId();
    $scope.InsuranceTabActive = 1;
    $scope.MouTabActive = 1;
    $scope.NewMouTabActive = 1;

    $scope.GetAllIndicator = 0;
    $scope.masterCountries = [];

    $scope.FeeCodeArrayList = [];
    $scope.masterFeeCodeitemscount = 0;
    $scope.PayorsArrayList = [];

    $scope.Documentpayorcount = 0;

    $scope.isMouItemCostSearchEnabled = false;

    $scope.AllUserBranchesList1 = $filter("filter")($scope.AllUserBranchesList, function (item, index) { return item.BranchId !== 0; });

    console.log($scope.AllUserBranchesList);

    $scope.AllInsuraceHospitalList = angular.copy($scope.AllUserBranchesList);
    var abc = $scope.AllInsuraceHospitalList.shift();
    $scope.AllInsuraceHospitalList = angular.copy($scope.AllInsuraceHospitalList);

    $scope.InsuranceClassActiveMenu = function (menuno) {
        return (menuno === $scope.InsuranceTabActive) ? "active" : "";
    };

    $scope.ChangeMouType = function (menu) {
        $scope.MouTabActive = menu;
        $scope.SearchMouDataObject.ParticularName = "";
        $scope.Init();
        $scope.FilterInScopeList = {
            "IsEditMode": false,
            "IsOutScopeEditMode": false,
            "IsInScopeEditMode": false,
            "SearchText": "",
            "FromDate": "",
            "ToDate": ""
        };
        $scope.CheckList = { "CheckAllMouData": false };
    };
    $scope.MouClassActiveMenu = function (menuno) {
        return (menuno === $scope.MouTabActive) ? "active" : "";
    };

    $scope.NewMouClassActiveMenu = function (menuno) {
        return (menuno === $scope.NewMouTabActive) ? "active" : "";
    };


    $scope.GetMasterInsuranceList = function (SearchText) {
        var obj = {
            "SearchText": SearchText,
            "PageSize": 20,
            "PageNumber": 1
        }
        return eHnoteInsuranceService.GetMasterInsuranceList(obj).then(function (response) {
            if (response.data.count !== 0) {
                if (response.data.rows !== undefined) {

                    for (var i = response.data.rows.length - 1; i >= 0; i--) {
                        if (response.data.rows[i].BillingCategoryTypeId === $scope.InsuranceListObject.BillingCategoryTypeId) {
                            response.data.rows.splice(i, 1);
                        }
                    }

                    return response.data.rows.map(function (item) {

                        return item;


                    });
                }
            }
        });
    };
    console.log($scope.doctorinfo.doctordata);

    $scope.AllInsuranceCompaniesList = [];
    $scope.SelectedInsuranceCompaniesList = [];
    $scope.GetAllMasterInsuranceList = function (SearchText) {
        var obj = {
            "SearchText": "",
            "PageSize": 1000,
            "PageNumber": 1
        }
        eHnoteInsuranceService.GetMasterInsuranceList(obj).then(function (response) {
            if (response.data.count !== 0) {
                if (response.data.rows !== undefined) {
                    $scope.AllInsuranceCompaniesList = response.data.rows;
                }
            }
        });
    };

    $scope.changebillingCategoryForIns = function (typeId) {
        console.log(typeId);
        typeId = parseInt(typeId);
        $scope.SelectedInsuranceCompaniesList = [];
        $scope.SelectedTpasList = [];
        var filteredArray = $filter("filter")($scope.AllInsuranceCompaniesList, { "BillingCategoryTypeId": typeId }, true);
        if (filteredArray.length > 0) {
            $scope.SelectedInsuranceCompaniesList = filteredArray;
        }

        var filteredTpaArray = $filter("filter")($scope.AllMasterTpsList, { "BillingCategoryTypeId": typeId }, true);
        if (filteredTpaArray.length > 0) {
            $scope.SelectedTpasList = filteredTpaArray;
        }
        $scope.InsuranceListObject.OrgInsuranceId = 0;
        $scope.InsuranceListObject.InsuranceId = 0;
        $scope.InsuranceListObject.InsuranceObj = "";
        $scope.InsuranceListObject.InsuranceName = "";
        $scope.InsuranceListObject.TpaObj = "";
        $scope.InsuranceListObject.TpaId = 0;
        $scope.InsuranceListObject.TpaName = "";
        $scope.InsuranceListObject.CountryId = "";
        $scope.InsuranceListObject.TpaStateId = "";
        $scope.InsuranceListObject.TpaCityId = "";
        $scope.InsuranceListObject.ShowAdditionInformation = false;
        $scope.InsuranceListObject.AdditionalInformation.TpaLocalContactPersonName = "";
        $scope.InsuranceListObject.AdditionalInformation.TpaLocalContactPersonPhnNumber = "";
        $scope.InsuranceListObject.AdditionalInformation.TpaLocalEmailId = "";
        $scope.InsuranceListObject.TpaPinCode = "";
        $scope.InsuranceListObject.TpaContactPersonName = "";
        $scope.InsuranceListObject.TpaContactPersonPhnNumber = "";
        $scope.InsuranceListObject.TpaEmailId = "";
        $scope.InsuranceListObject.TpaAddress = "";
        $scope.InsuranceListObject.AgreementFilesArray = [];
        $scope.InsuranceListObject.IsCashPaymentEligible = true;
        $scope.InsuranceListObject.IsCreditPaymentEligible = true;

    }
    $scope.SubOrganizationId = "";
    if ($scope.doctorinfo.doctordata.UserAddress[0].SubOrganizationId) {
        $scope.SubOrganizationId = $scope.doctorinfo.doctordata.UserAddress[0].SubOrganizationId;
        console.log($scope.SubOrganizationId);
    }

    if ($scope.AllInsuraceHospitalList.length > 0) {
        $scope.InsuranceFilterObject = {
            "HospitalObj": $filter("filter")($scope.AllInsuraceHospitalList, { "ClinicId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID }, true)[0],
            "AllBranchIndecator": false,
            "AddedFilter": "true"
        };
    }

    $scope.ChangeIndivdualMou = function () {
        $scope.CheckList = { "CheckAllMouData": false };
    };
    $scope.MaxDate = null;

    $scope.changeYear = false;
    $scope.changeMonth = false;
    $scope.GetMasterTPA = function (SearchText) {
        var obj = {
            "SearchText": SearchText,
            "PageSize": 10,
            "PageNumber": 1
        }
        return eHnoteInsuranceService.GetMasterTPA(obj).then(function (response) {
            if (response.data.count !== 0) {
                if (response.data.rows !== undefined) {
                    return response.data.rows.map(function (item) {
                        return item;
                    });
                }
            }
        });
    };

    $scope.AllMasterTpsList = [];
    $scope.GetAllMasterTPA = function (SearchText) {
        var obj = {
            "SearchText": "",
            "PageSize": 1000,
            "PageNumber": 1
        }
        eHnoteInsuranceService.GetMasterTPA(obj).then(function (response) {
            if (response.data.count !== 0) {
                if (response.data.rows !== undefined) {
                    $scope.AllMasterTpsList = response.data.rows;
                }
            }
        });
    };

    $scope.AddAnotherDetails = function () {
        $scope.InsuranceListObject.ShowAdditionInformation = !$scope.InsuranceListObject.ShowAdditionInformation;
    }
    //eHnotePatientAddressDataServices.getCities($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID, getcitiesSuccess, getcitiesFailed);
    //function getcitiesSuccess(data) {
    //    $scope.cities = data;
    //}
    //function getcitiesFailed(data) {
    //}

    eHnotePatientAddressDataServices.getCountries(getcountriesSuccess, getcountriesFailed);
    function getcountriesSuccess(resp) {
        console.log(resp)
        $scope.masterCountries = resp;
    }
    function getcountriesFailed(data) {
    }
    $scope.onCityChange = function (item) {
        $scope.InsuranceListObject.TpaCityName = item.Name;
        $scope.InsuranceListObject.TpaCityId = item.Id;
        eHnotePatientAddressDataServices.SearchCity(item.Name).then(function (resp) {
            if (resp.data.length > 0) {
                $scope.patientList = resp.data;
                $scope.InsuranceListObject.TpaStateName = $scope.patientList[0].StateName;
                $scope.InsuranceListObject.TpaStateId = $scope.patientList[0].StateId;
                $scope.InsuranceListObject.Country = $scope.patientList[0].CountryName;
                $scope.InsuranceListObject.CountryId = $scope.patientList[0].CountryId;
            }
        });
    };
    $scope.SearchMouData = function () {
        return {
            "OrgInsuranceTpaId": 0,
            "InsuranceTPAId": 0,
            "InsuraceId": 0,
            "InsuranceObj": "",
            "InsuranceName": "",
            "TpaObj": "",
            "TpaId": 0,
            "TpaName": "",
            "CategoryId": 0,
            "ParticularObj": "",
            "ParticularId": 0,
            "ParticularName": "",
            "UserId": $scope.UserId,
            "PageSize": 10,
            "PageNumber": 1,
            "HospitalObj": $filter("filter")($scope.AllInsuraceHospitalList, { "ClinicId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID }, true)[0],
            "SpecializationId": $scope.SpecializationId,
            "OrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "GetAllIndicator": false,
            "ParentOrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
        }
    }

    $scope.SearchMouDataObject = $scope.SearchMouData();


    $scope.bilingCategoryObj = {
        "BranchObj": $filter("filter")($scope.AllInsuraceHospitalList, { "ClinicId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID }, true)[0],
        "BranchId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID
    };

    $scope.ChangeBillingCategoryHospital = function (item) {
        console.log(item);

        $scope.bilingCategoryObj.BranchObj = item;
        $scope.bilingCategoryObj.BranchId = item.BranchId;
        getOrganizationBillingCategories(item.BranchId);
    }




    $scope.MouDataSearch = false;
    $scope.ClearMOUData = function () {
        $scope.SearchMouDataObject = $scope.SearchMouData();
        $scope.FilterInScopeList = {
            "IsEditMode": false,
            "IsOutScopeEditMode": false,
            "IsInScopeEditMode": false,
            "SearchText": "",
            "FromDate": "",
            "ToDate": ""
        };
        getMasterProcedureTypes();
        $scope.GetOrgMouInsuranceTPA("");
        $scope.MouDataSearch = true;
        //$timeout(function () {
        //    $scope.Init();
        //}, 500);


    };
    $scope.GetInsuranceListObject = function () {
        return {
            "BillingCategoryTypeId": "",
            "OrgInsuranceId": 0,
            "InsuranceTPAId": 0,
            "InsuranceId": 0,
            "InsuranceObj": "",
            "InsuranceName": "",
            "TpaObj": "",
            "TpaId": 0,
            "TpaName": "",
            "TpaContactPersonName": "",
            "TpaContactPersonPhnNumber": "",
            "TpaEmailId": "",
            "TpaAddress": "",
            "TpaStateId": "",
            "TpaStateName": "",
            "TpaCityId": "",
            "TpaCityName": "",
            "TpaPinCode": "",
            "Country": "",
            "CountryId": "",
            "ShowAdditionInformation": false,
            "AdditionalInformation": {
                "TpaLocalContactPersonName": "",
                "TpaLocalContactPersonPhnNumber": "",
                "TpaLocalEmailId": "",
            },
            "UserId": $scope.UserId,
            "HospitalObj": $filter("filter")($scope.AllUserBranchesList, { "ClinicId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID }, true)[0],
            "SpecializationId": $scope.SpecializationId,
            "OrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "GetAllIndicator": 0,
            "ParentOrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "DeleteInd": false,
            "AgreementFilesArray": [],
            "IsCashPaymentEligible": true,
            "IsCreditPaymentEligible": true
        };
    };

    $scope.InsuranceListObject = $scope.GetInsuranceListObject();
    $scope.selectInsuranceItem = function (item) {
        item.InsuranceName = item.InsuranceObj.InsuranceCompanyName;
        item.InsuraceId = item.InsuranceObj.InsuranceCompanyId;
    };
    $scope.changeInsurenceSearch = function (item) {
        item.InsuranceName = item.InsuranceObj;
        item.InsuraceId = 0;
    };
    $scope.DisableTpaFilelds = false;
    $scope.selectTPAItem = function (item) {
        item.TpaName = item.TpaObj.TPAName;
        item.TpaId = item.TpaObj.TPAId;
        item.TpaContactPersonName = item.TpaObj.ContactPersonName;
        item.TpaContactPersonPhnNumber = item.TpaObj.ContactPersonPhnNumber;
        item.TpaEmailId = item.TpaObj.EmailId;
        item.TpaAddress = item.TpaObj.Address;
        item.TpaStateId = item.TpaObj.StateId;
        item.TpaStateName = item.TpaObj.State;
        item.TpaCityId = item.TpaObj.CityId;
        item.TpaCityName = item.TpaObj.City;
        item.TpaPinCode = item.TpaObj.PinCode;
        item.Country = item.TpaObj.Country || "";
        item.CountryId = item.TpaObj.CountryId || "";
        //$scope.DisableTpaFilelds = true;

        if (item.CountryId !== undefined) {
            eHnotePatientAddressDataServices.getStatesByCountryId(item.CountryId).then(function (resp) {
                console.log(resp.data);
                if (resp.data.rows.length > 0) {
                    $scope.statesArray = resp.data.rows;
                }
            });
        }

        if (item.TpaStateId != undefined) {
            eHnotePatientAddressDataServices.getCitiesByStateId(item.TpaStateId).then(function (resp) {
                console.log(resp.data);
                if (resp.data.length > 0) {
                    $scope.citiesArray = resp.data;
                }
            });
        }
    };
    $scope.changeTPASearch = function (item) {
        item.TpaName = item.TpaObj;
        item.TpaId = 0;
    };
    $scope.ClearInsurance = function () {
        $scope.InsuranceListObject = $scope.GetInsuranceListObject();
        $scope.DisableTpaFilelds = false;
    };
    $scope.GetRelationMasterInsuranceTPA = function (SearchText) {
        var obj = {
            "SearchText": SearchText,
            "PageSize": 10000,
            "PageNumber": 1
        }
        return eHnoteInsuranceService.GetRelationMasterInsuranceTPA(obj);
    };

    $scope.ResetAllMasterAndOrgTpa = function () {

        angular.forEach($scope.MaterRelationList, function (item, index) {
            angular.forEach($scope.OrgnizationTpaList, function (item1, index1) {
                if (item.InsuranceTPAId === item1.InsuranceTPAId && item.TPAId === item1.TPAId && item.InsuranceCompanyId === item1.InsuranceCompanyId) {
                    item.IsAdded = true;
                    item.TpaLocalContactPersonName = item1.ContactPersonName;
                    item.TpaContactPersonPhnNumber = item1.ContactPersonPhnNumber;
                    item.TpaLocalEmailId = item1.EmailId;
                    item.OrgInsuranceTpaId = item1.OrgInsuranceTpaId;
                    item.BillingCategoryType = item1.BillingCategoryType;
                    item.BillingCategoryTypeId = item1.BillingCategoryTypeId;
                    item.IsCashPaymentEligible = item1.IsCashPaymentEligible;
                    item.IsCreditPaymentEligible = item1.IsCreditPaymentEligible;
                    item.AgreementFilesArray = item1.AgreementFilesArray;
                    item.TempImagesArray = [];
                    item.TempPdfArray = [];
                    item.tempPrecriptionCount = 0;
                    if (item.AgreementFilesArray.length > 0) {

                        angular.forEach(item.AgreementFilesArray, function (kitem) {

                            var pName = kitem.FileName, name = "";
                            var type = kitem.FileExt.split("/")[1];
                            if (pName.length > 9) {
                                name = pName.substring(0, 9) + "..." + "." + type;
                            } else {
                                name = angular.copy(pName) + '.' + type;
                            }
                            var obj = {
                                "file": kitem.S3URL,
                                "DeleteInd": false,
                                "FileId": kitem.TpaAgreementFileId,
                                "FileExt": type,
                                "FileName": name
                            };
                            if (kitem.FileExt != 'application/pdf') {
                                item.TempImagesArray.push(obj);
                                item.tempPrecriptionCount++;
                            }
                            else {
                                item.TempPdfArray.push(obj);
                            }
                        });
                    }
                }
            });

        });

    };

    $scope.openPdfFileUploads = function (url) {
        window.open(url);
    };
    $scope.Search = {
        "InsuranceHospitalTxt": "",
        "InsuranceCompanyTxt": ""
    };
    $scope.ChangeTpaInsuranceHospital = function (item) {
        $scope.InsuranceFilterObject.HospitalObj = item;
        $scope.Search.InsuranceCompanyTxt = "";
        $scope.InsuranceFilterObject.OrganizationId = item.ClinicId;
        if (item.ClinicId === 0) {
            $scope.InsuranceFilterObject.GetAllIndicator = 1;
        } else {
            $scope.InsuranceFilterObject.GetAllIndicator = 0;
        }
        $scope.Init();
    };

    $scope.ChangeInsuranceHospital = function (item) {
        $scope.InsuranceListObject.HospitalObj = item;
        $scope.Search.InsuranceHospitalTxt = "";
        $scope.InsuranceListObject.OrganizationId = item.ClinicId;
        if (item.ClinicId === 0) {
            $scope.InsuranceListObject.GetAllIndicator = 1;
        } else {
            $scope.InsuranceListObject.GetAllIndicator = 0;
        }

    };
    $scope.GetOrgMouInsuranceTPA = function (SearchText) {
        var obj = {
            "SearchText": SearchText,
            "PageSize": 10000,
            "PageNumber": 1,
            "UserId": $scope.UserId,
            "SpecializationId": $scope.SpecializationId,
            "OrganizationId": $scope.SearchMouDataObject.OrganizationId,
            "ParentOrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "GetAllIndicator": $scope.SearchMouDataObject.GetAllIndicator
        };
        return eHnoteInsuranceService.GetOrganizationInsuranceTPA(obj).then(function (response) {
            if (response.data.count !== 0) {
                if (response.data.rows !== undefined) {
                    $scope.OrganizationInsuranceList = response.data.rows;
                    $scope.SearchMouDataObject.InsuranceObj = $scope.OrganizationInsuranceList[0];
                    $scope.SearchMouDataObject.TpaName = $scope.SearchMouDataObject.InsuranceObj.TPAName;
                    $scope.SearchMouDataObject.TpaId = $scope.SearchMouDataObject.InsuranceObj.TPAId;
                    $scope.SearchMouDataObject.InsuranceName = $scope.SearchMouDataObject.InsuranceObj.InsuranceCompanyName;
                    $scope.SearchMouDataObject.InsuraceId = $scope.SearchMouDataObject.InsuranceObj.InsuranceCompanyId;
                    $scope.SearchMouDataObject.TpaObj = $scope.SearchMouDataObject.InsuranceObj;
                    $scope.SearchMouDataObject.InsuranceTPAId = $scope.SearchMouDataObject.InsuranceObj.InsuranceTPAId;
                    $scope.SearchMouDataObject.OrgInsuranceTpaId = $scope.SearchMouDataObject.InsuranceObj.OrgInsuranceTpaId;
                }
                if ($scope.MouDataSearch) {
                    $scope.Init();
                }
            }
        });
    };

    //$scope.getOrganizationSurgeriesList = function () {
    //    var params = {
    //        "HospitalId": $scope.InsuranceListObject.OrganizationId,
    //        "AllBranchInd": 0,
    //        "PageSize": 10000,
    //        "PageNumber": 1,
    //        "SearchText": "",
    //        "SurgerySpecializationId":0
    //    };
    //   return eHnoteSurgeryService.GetOrganizationSurgeries(params, 'Get');


    //};

    $scope.GetOrganizationMOUData = function () {

        $scope.SearchMouDataObject.TypeId = $scope.MouTabActive;

        var obj = angular.copy($scope.SearchMouDataObject);
        delete obj.HospitalObj;
        return eHnoteInsuranceService.GetOrganizationMOUData(obj);
    };

    $scope.GetOrganizationMOUData_Outflow = function () {
        $scope.SearchMouDataObject.TypeId = $scope.MouTabActive;
        var obj = angular.copy($scope.SearchMouDataObject);
        delete obj.HospitalObj;
        return eHnoteInsuranceService.GetOrganizationMOUData_Outflow(obj);
    };
    //$scope.ResetAllMasterAndOrgMouData = function () {
    //    angular.forEach($scope.OrgnizationMouList, function (item1, index1) {
    //        angular.forEach($scope.MaterSurgeryProcedureList, function (item, index) {
    //            if (item.OrgSurgeryId == item1.ParticularId) {
    //                item.IsInScope = true;
    //                item.Cost = item1.Cost;
    //            }
    //        });

    //    });
    //}

    $scope.InscopePagechanged = function (number) {
        $scope.SearchMouDataObject.PageNumber = number;
        $scope.Init();
    };

    $scope.ChangeInScopeSearchMouData = function () {
        $scope.NewSearchMouDataObject.PageNumber = 1;
        $scope.GetOrgInscopeInsuranceMouData();
    };

    $scope.ChangeSearchMouData = function () {
        $scope.NewSearchMouDataObject.PageNumber = 1;
        $scope.GetOrgOutscopeInsuranceMouData();
    };



    $scope.MasterBillingCategoryList = [];
    $scope.orgMasterBillingCategoryArray = [];
    function getmasterBillingCategories() {
        eHnoteInsuranceService.getMasterBillingCategories().then(function (resp) {
            console.log(JSON.stringify(resp));
            $scope.MasterBillingCategoryList = angular.copy(resp.data);
            if (resp.data.length > 0) {
                angular.forEach($scope.MasterBillingCategoryList, function (item) {
                    var object = {
                        "BillingCategoryTypeId": item.BillingCategoryTypeId,
                        "BillingCategoryType": item.BillingCategoryType,
                        "OrgBillingCategoryId": 0,
                        "ActiveInd": "N",
                        "DeleteInd": "N"
                    }
                    $scope.orgMasterBillingCategoryArray.push(object);
                });
            }

        }, function (err) {
            alertify.error("Failed");
            console.log(err);
        });
    };



    $scope.subOrgBillingCategories = [];
    $scope.mousubOrgBillingCategories = [];
    function getOrganizationBillingCategories(BranchId) {


        eHnoteInsuranceService.getOrgBillingCategories(BranchId).then(function (response) {
            console.log(JSON.stringify(response));
            $scope.subOrgBillingCategories = [];
            $scope.mousubOrgBillingCategories = [];

            $scope.billingCatOrgArray = [];
            $scope.orgMasterBillingCategoryArray = [];
            if (response.data != undefined) {
                if (response.data.rows.length > 0) {

                    $scope.subOrgBillingCategories = angular.copy(response.data.rows);
                    $scope.mousubOrgBillingCategories = angular.copy(response.data.rows);
                    $scope.billingCatOrgArray = angular.copy(response.data.rows);
                    angular.forEach($scope.subOrgBillingCategories, function (bitem, index) {
                        if (bitem.BillingCategoryTypeId === 1 || bitem.BillingCategoryTypeId === 15) {
                            $scope.subOrgBillingCategories.splice(index, 1);
                        }
                    });

                    angular.forEach($scope.mousubOrgBillingCategories, function (bitem, index) {
                        if (bitem.BillingCategoryTypeId === 1) {
                            $scope.mousubOrgBillingCategories.splice(index, 1);
                        }
                    });
                }
            }


            eHnoteInsuranceService.getMasterBillingCategories().then(function (resp) {
                console.log(JSON.stringify(resp));
                $scope.MasterBillingCategoryList = angular.copy(resp.data);
                if (resp.data.length > 0) {
                    angular.forEach($scope.MasterBillingCategoryList, function (item) {
                        if (item.BillingCategoryTypeId !== 1) {
                            var object = {
                                "BillingCategoryTypeId": item.BillingCategoryTypeId,
                                "BillingCategoryType": item.BillingCategoryType,
                                "OrgBillingCategoryId": 0,
                                "ActiveInd": "N",
                                "DeleteInd": "N"
                            }

                            if ($scope.billingCatOrgArray.length > 0) {
                                angular.forEach($scope.billingCatOrgArray, function (sitem) {
                                    if (object.BillingCategoryTypeId === sitem.BillingCategoryTypeId) {
                                        object.OrgBillingCategoryId = sitem.OrgBillingCategoryId;
                                        object.ActiveInd = 'Y';
                                    }
                                });
                            }

                            $scope.orgMasterBillingCategoryArray.push(object);
                        }



                    });


                }

            }, function (err) {
                alertify.error("Failed");
                console.log(err);
            });

        });
    }
    $scope.newinit = function () {
        getOrganizationBillingCategories($scope.bilingCategoryObj.BranchId);
        $scope.GetAllMasterInsuranceList();
        $scope.GetAllMasterTPA();
        $scope.isIojOrgEnable = false;
        var currenturl = $location.absUrl().split('?')[0];
        var CurrentEnvironment = currenturl.split('/#')[0];
        if (CurrentEnvironment == "https://ioj.ehnote.com" || CurrentEnvironment == "https://insts.ehnote.com" || CurrentEnvironment == "https://ehnqaehr.azurewebsites.net") {
            $scope.isIojOrgEnable = true;
        };


    }

    $scope.newinit();
    $scope.GetOrgInsuranceMOUCost = function () {
        return eHnoteInsuranceService.GetOrgInsuranceMOUCost($scope.SearchMouDataObject.OrganizationId).then(function (response) {
            if (response.data.count !== 0) {
                if (response.data.rows !== undefined) {
                    $scope.OrgMouDataList = response.data.rows;
                    angular.forEach($scope.OrgMouDataList, function (item) {
                        item.MOUId = 0;
                        item.MouCost = "";
                        item.DeleteInd = false;
                    });
                }
            }
        });
    };
    $scope.GetOrgMouInsuranceTPA("");
    $scope.GetOrgInsuranceMOUCost();

    $scope.FilterInScopeList = {
        "IsEditMode": false,
        "IsOutScopeEditMode": false,
        "IsInScopeEditMode": false,
        "SearchText": "",
        "FromDate": "",
        "ToDate": ""
    };
    $scope.SubmitInsuranceRelationData = function () {
        var obj = {
            "UserId": $scope.UserId,
            "SpecializationId": $scope.SpecializationId,
            "OrganizationId": $scope.InsuranceFilterObject.HospitalObj.ClinicId,
            "ParentOrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "GetAllIndicator": $scope.InsuranceFilterObject.AllBranchIndecator ? 1 : 0,
            "InSuranceCompanyList": []
        };
        var SelectedArray = $filter("filter")($scope.MaterRelationList, { "IsSelected": true });
        angular.forEach(SelectedArray, function (item, index) {
            var object = {
                "OrgInsuranceId": 0,
                "InsuranceTPAId": item.InsuranceTPAId,
                "Address": item.Address,
                "CityId": item.CityId,
                "ContactPersonName": "",
                "ContactPersonPhnNumber": "",
                "DeleteInd": false,
                "EmailId": "",
                "InsuranceCompanyId": item.InsuranceCompanyId,
                "InsuranceCompanyName": item.InsuranceCompanyName,
                "PinCode": item.PinCode,
                "StateId": item.StateId,
                "TPAId": item.TPAId,
                "TPAName": item.TPAName,
                "BillingCategoryTypeId": item.BillingCategoryTypeId
            };
            obj.InSuranceCompanyList.push(object);
        });

        console.log(JSON.stringify(obj));

        eHnoteInsuranceService.AddUpdateOrgInsuranceTPA_ALL(obj, onSuccess, onError);
        function onSuccess(data) {
            alertify.success("Changes added successfully");
            $scope.InsuranceFilterObject = {
                "HospitalObj": $filter("filter")($scope.AllInsuraceHospitalList, { "ClinicId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID }, true)[0],
                "AllBranchIndecator": false,
                "AddedFilter": "true"
            };
            $scope.InsuranceListObject = $scope.GetInsuranceListObject();
            $scope.Init();
        }
        function onError(reponse) {
        }
    };


    $scope.AddUpdateOrganizationMOUData = function () {
        var SelectedArray = $filter("filter")($scope.OrgnizationMouList, { "IsSelected": true });

        if (SelectedArray.length === 0) {
            alertify.error("Please select atleast one field");
            return false;
        }

        var checkEmptylist = $filter("filter")(SelectedArray, function (item, index) {
            return item.MOUStartDate === '' && item.MOUEndDate === '';
        });
        if (checkEmptylist.length !== 0) {
            alertify.error("Please Choose Mandatory Fileds");
            return false;
        }
        var obj = {
            "UserId": $scope.UserId,
            "SpecializationId": $scope.SpecializationId,
            "OrganizationId": $scope.SearchMouDataObject.HospitalObj.ClinicId,
            "ParentOrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "GetAllIndicator": $scope.SearchMouDataObject.AllBranchIndecator ? 1 : 0,
            "SurgeryMOUList": []
        };

        angular.forEach(SelectedArray, function (item, index) {
            angular.forEach(item.CostDetails, function (subitem) {
                subitem.ParticularId = item.ParticularId;
                subitem.DeleteInd = item.DeleteInd;
                subitem.MouCost = subitem.MouCost || 0;
            });
            item.MOUStartDate = $filter("date")(item.MOUStartDate, "dd-MM-yyyy");
            item.MOUEndDate = $filter("date")(item.MOUEndDate, "dd-MM-yyyy");
            var object = {
                "MOUId": item.MOUId,
                "OrgInsuranceTpaId": $scope.SearchMouDataObject.OrgInsuranceTpaId,
                "TypeId": $scope.SearchMouDataObject.CategoryId,
                "ParticularId": item.ParticularId,
                "MOUStartDate": $filter("dateFormatter")(item.MOUStartDate, "-"),
                "MOUEndDate": $filter("dateFormatter")(item.MOUEndDate, "-"),
                "DeleteInd": item.DeleteInd,
                "CostDetails": item.CostDetails
            };
            obj.SurgeryMOUList.push(object);
        });
        console.log(JSON.stringify(obj));
        eHnoteInsuranceService.AddUpdateOrganizationMOUData(obj, onSuccess, onError);
        function onSuccess(resp) {
            if (resp.Status === "Failure") {
                alertify.error(resp.Message);
            } else {
                alertify.success("Changes added successfully");
                $scope.FilterInScopeList = {
                    "IsEditMode": false,
                    "IsOutScopeEditMode": false,
                    "IsInScopeEditMode": false,
                    "SearchText": "",
                    "FromDate": "",
                    "ToDate": ""
                };
                $scope.CheckList = { "CheckAllMouData": false };
                $scope.Init();
            }

        }
        function onError(reponse) {
        }
    };
    $scope.AddNewOrgInsurance = function () {

        eHnoteInsuranceService.AddUpdateOrgInsuranceTPA($scope.InsuranceListObject, onSuccess, onError);
        function onSuccess(data) {
            if (data.status === "Failure") {
                alertify.error(data.Message);
            } else {
                alertify.success("Changes added successfully");
                $scope.InsuranceListObject = $scope.GetInsuranceListObject();
                $scope.Init();
                $scope.GetOrgMouInsuranceTPA("");
                $scope.DisableTpaFilelds = false;
            }

        }
        function onError(reponse) {
        }
    }

    $scope.AllProcedureListTypes = [];
    function getMasterProcedureTypes() {
        eHnoteProcedureDataService.getProcedureType(onsuccessProc, onfailureProc);
        function onsuccessProc(data) {
            $scope.ProcedureListTypes = [];

            $scope.AllProcedureListTypes = angular.copy(data.rows);

            angular.forEach(data, function (item) {
                if (item.Id == 6 || item.Id == 7) {
                    $scope.ProcedureListTypes.push(item);
                }

            });
            if ($scope.ProcedureListTypes.length > 0) {
                $scope.SearchMouDataObject.CategoryId = $scope.ProcedureListTypes[0].Id;
            }

            //for (var i = $scope.AllProcedureListTypes.length - 1; i >= 0; i--) {
            //    if ($scope.AllProcedureListTypes[i].Id === 2 || $scope.AllProcedureListTypes[i].Id === 3 || $scope.AllProcedureListTypes[i].Id === 4 || $scope.AllProcedureListTypes[i].Id === 8 || $scope.AllProcedureListTypes[i].Id === 9) {
            //        $scope.AllProcedureListTypes.splice(i, 1);
            //    }
            //}


        }
        function onfailureProc(err) {
            console.log(err);
        }
    }
    getMasterProcedureTypes();
    $scope.EditInsuranceComapany = function (item) {
        if (item.CountryId !== undefined) {
            eHnotePatientAddressDataServices.getStatesByCountryId(item.CountryId).then(function (resp) {
                console.log(resp.data);
                if (resp.data.rows.length > 0) {
                    $scope.statesArray = resp.data.rows;
                }
            });
        }

        if (item.StateId != undefined) {
            eHnotePatientAddressDataServices.getCitiesByStateId(item.StateId).then(function (resp) {
                console.log(resp.data);
                if (resp.data.length > 0) {
                    $scope.citiesArray = resp.data;
                }
            });
        }



        $scope.InsuranceListObject = $scope.GetInsuranceListObject();



        $scope.InsuranceListObject = {
            "BillingCategoryTypeId": item.BillingCategoryTypeId,
            "OrgInsuranceId": item.OrgInsuranceTpaId,
            "InsuranceTPAId": item.InsuranceTPAId,
            "InsuraceId": item.InsuranceTPAId,
            "InsuranceObj": item.InsuranceCompanyName,
            "InsuranceName": item.InsuranceCompanyName,
            "TpaObj": item.TPAName,
            "TpaId": item.TPAId,
            "TpaName": item.TPAName,
            "TpaContactPersonName": item.ContactPersonName,
            "TpaContactPersonPhnNumber": item.ContactPersonPhnNumber == 0 ? '' : item.ContactPersonPhnNumber,
            "TpaEmailId": item.EmailId,
            "TpaAddress": item.Address,
            "TpaStateId": item.StateId,
            "TpaStateName": item.StateName,
            "TpaCityId": item.CityId,
            "TpaCityName": item.CityName,
            "TpaPinCode": item.PinCode,
            "Country": "",
            "CountryId": item.CountryId,
            "ShowAdditionInformation": true,
            "AdditionalInformation": {
                "TpaLocalContactPersonName": item.TpaLocalContactPersonName,
                "TpaLocalContactPersonPhnNumber": item.TpaContactPersonPhnNumber == 0 ? '' : item.TpaContactPersonPhnNumber,
                "TpaLocalEmailId": item.TpaLocalEmailId,
            },
            "UserId": $scope.UserId,
            "HospitalObj": $scope.InsuranceFilterObject.HospitalObj,
            "SpecializationId": $scope.SpecializationId,
            "OrganizationId": $scope.InsuranceFilterObject.HospitalObj.ClinicId,
            "GetAllIndicator": 0,
            "ParentOrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "DeleteInd": false,
            "AgreementFilesArray": item.AgreementFilesArray,
            "IsCashPaymentEligible": item.IsCashPaymentEligible,
            "IsCreditPaymentEligible": item.IsCreditPaymentEligible
        };
        $scope.DisableTpaFilelds = true;
    };

    $scope.ChangeMouInsuranceHospital = function (item) {
        $scope.SearchMouDataObject.HospitalObj = item;
        $scope.SearchMouDataObject.OrganizationId = item.ClinicId;

        if (item.ClinicId === 0) {
            $scope.SearchMouDataObject.GetAllIndicator = 1;
        } else {
            $scope.SearchMouDataObject.GetAllIndicator = 0;
        }
        $scope.GetOrgInsuranceMOUCost();
        $scope.GetOrgMouInsuranceTPA("");
    };
    $scope.ChangeNewMouInsuranceHospital = function (item) {
        $scope.NewSearchMouDataObject = $scope.NewSearchMouData();

        $scope.NewSearchMouDataObject.HospitalObj = item;
        $scope.NewSearchMouDataObject.BranchId = item.ClinicId;

        $scope.getInsuranceMouDataOnLoad();

    };


    $scope.selectMouInsuranceItem = function (item) {
        item.TpaName = item.InsuranceObj.TPAName;
        item.TpaId = item.InsuranceObj.TPAId;
        item.InsuranceName = item.InsuranceObj.InsuranceCompanyName;
        item.InsuraceId = item.InsuranceObj.InsuranceCompanyId;
        item.TpaObj = item.InsuranceObj;
        item.InsuranceTPAId = item.InsuranceObj.InsuranceTPAId;
        item.OrgInsuranceTpaId = item.InsuranceObj.OrgInsuranceTpaId;
    };

    $scope.ChangeEditMode = function () {
        $scope.FilterInScopeList.IsEditMode = !$scope.FilterInScopeList.IsEditMode;
    };

    $scope.ChangeCategory = function (item) {
        $scope.SearchMouDataObject.CategoryId = item.CategoryId;
    };
    $scope.SearchOrgMouData = function () {
        console.log(JSON.stringify($scope.SearchMouDataObject));
        $scope.FilterInScopeList = {
            "IsEditMode": false,
            "IsOutScopeEditMode": false,
            "IsInScopeEditMode": false,
            "SearchText": "",
            "FromDate": "",
            "ToDate": ""
        };
        $scope.Init();
    };
    $scope.CheckList = { "CheckAllMouData": false };
    $scope.CheckAllData = function (CheckAllMouData) {
        if ($scope.MouTabActive == 1) {
            angular.forEach($scope.OrgnizationMouList, function (item) {
                if (item.IsInScope) {
                    item.IsSelected = CheckAllMouData;
                }
            });
        } else {
            angular.forEach($scope.OrgnizationMouList, function (item) {
                if (!item.IsInScope) {
                    item.IsSelected = CheckAllMouData;
                }
            });
        }

    }

    $scope.CheckAllInScopeData = function (CheckAllMouData) {
        if ($scope.NewMouTabActive == 1) {
            angular.forEach($scope.InScopeInsurancMouDataArray, function (item) {
                if (item.IsInScope) {
                    item.IsSelected = CheckAllMouData;
                }
            });
        } else {
            angular.forEach($scope.InScopeInsurancMouDataArray, function (item) {
                if (!item.IsInScope) {
                    item.IsSelected = CheckAllMouData;
                }
            });
        }

    }
    $scope.CheckAllOutScopeData = function (CheckAllMouData) {
        if ($scope.NewMouTabActive == 1) {
            angular.forEach($scope.OutScopeInsurancMouDataArray, function (item) {
                if (item.IsInScope) {
                    item.IsSelected = CheckAllMouData;
                }
            });
        } else {
            angular.forEach($scope.OutScopeInsurancMouDataArray, function (item) {
                if (!item.IsInScope) {
                    item.IsSelected = CheckAllMouData;
                }
            });
        }

    }
    $scope.ChangeFromDate = function (FromDate) {
        $scope.FilterInScopeList.ToDate = "";
        if ($scope.MouTabActive == 1) {
            angular.forEach($scope.OrgnizationMouList, function (item) {
                if (item.IsSelected) {
                    item.MOUStartDate = FromDate;
                    item.MOUEndDate = "";
                }
            });
        } else {
            angular.forEach($scope.OrgnizationMouList, function (item) {
                if (item.IsSelected) {
                    item.MOUStartDate = FromDate;
                    item.MOUEndDate = "";
                }
            });
        }
    };
    $scope.ChangeToDate = function (ToDate) {
        if ($scope.MouTabActive == 1) {
            angular.forEach($scope.OrgnizationMouList, function (item) {
                if (item.IsSelected) {
                    item.MOUEndDate = ToDate;
                }
            });
        } else {
            angular.forEach($scope.OrgnizationMouList, function (item) {
                if (item.IsSelected) {
                    item.MOUEndDate = ToDate;
                }
            });
        }
    };
    $scope.ChangeCostDetails = function (Subitem, item) {
        item.GeneralCost = item.GeneralCost || 0;
        Subitem.MouCost = Subitem.MouCost || 0;
        Subitem.MouCost = parseInt(Subitem.MouCost) || 0;
        if (Subitem.MouCost > item.GeneralCost) {
            alertify.error("Please enter less than this" + item.GeneralCost + "price");
            Subitem.MouCost = item.GeneralCost;
            return false;
        }

    };

    $scope.ChangeInsCostDetails = function (item) {
        item.GeneralCost = item.GeneralCost || 0;
        item.OriginalMouCost = item.OriginalMouCost || 0;

        if (item.OriginalMouCost > item.GeneralCost) {
            alertify.error("Please enter less than this" + item.GeneralCost + "price");
            item.OriginalMouCost = item.GeneralCost;
            return false;
        }

    };

    $scope.modifyOrgBillingCategories = function () {

        if (!$scope.UserAccessRights.AllAccessRights.SettingsAddUpdateBillingCategories) {
            alertify.error("Sorry You Dont have Access,Please Contact Administrator");
            return false;
        }
        var modifiedArray = [];
        angular.forEach($scope.orgMasterBillingCategoryArray, function (item) {
            if (item.ActiveInd === 'Y') {
                modifiedArray.push(item);
            }

        });

        var params = {
            "BranchId": $scope.bilingCategoryObj.BranchId,
            "BillingCategoriesArray": modifiedArray
        }

        console.log(JSON.stringify(params));

        eHnoteInsuranceService.modifyOrgBillingCategories(params, onSuccess, onError);
        function onSuccess(resp) {
            if (resp.status === 'Success') {
                alertify.success("Billing Categories Modified Successfully");
            }
            console.log(resp);

        }
        function onError(reponse) {
        }
    }



    $scope.getStatesByCountry = function (country) {
        console.log(country);
        $scope.statesArray = [];
        $scope.citiesArray = [];
        $scope.InsuranceListObject.TpaStateId = "";
        $scope.InsuranceListObject.TpaCityId = "";
        $scope.InsuranceListObject.TpaPinCode = "";
        $scope.InsuranceListObject.TpaAddress = "";

        eHnotePatientAddressDataServices.getStatesByCountryId(country).then(function (resp) {
            console.log(resp.data);
            if (resp.data.rows.length > 0) {
                $scope.statesArray = resp.data.rows;
            }
        });
    }

    $scope.getCitiesByState = function (state) {
        console.log(state);
        $scope.citiesArray = [];
        $scope.InsuranceListObject.TpaCityId = "";
        $scope.InsuranceListObject.TpaPinCode = "";
        $scope.InsuranceListObject.TpaAddress = "";
        eHnotePatientAddressDataServices.getCitiesByStateId(state).then(function (resp) {
            console.log(resp.data);
            if (resp.data.length > 0) {
                $scope.citiesArray = resp.data;
            }
        });
    }
    $scope.changeCityIns = function () {
        $scope.InsuranceListObject.TpaPinCode = "";
        $scope.InsuranceListObject.TpaAddress = "";
    }

    $scope.agreementFiles = [];
    $scope.TempImagesArray = [];
    $scope.TempPdfArray = [];

    $scope.uploadTpaAgreement = function ($files) {
        if ($files.length > 0) {
            $scope.agreementFiles.push($files[0]);
            if ($scope.agreementFiles != null) {
                if ($scope.agreementFiles.length > 0) {
                    $scope.TempImagesArray = [];
                    $scope.TempPdfArray = [];
                    angular.forEach($scope.agreementFiles, function (kitem) {

                        var pName = kitem.name, name = "";
                        var type = kitem.type.split("/")[1];
                        if (pName.length > 9) {
                            name = pName.substring(0, 9) + "..." + "." + type;
                        } else {
                            name = angular.copy(pName) + '.' + type;
                        }
                        var obj = {
                            "file": kitem,
                            "DeleteInd": false,
                            "FileId": 0,
                            "FileExt": kitem.type,
                            "FileName": name
                        };
                        if (kitem.type != 'application/pdf') {
                            $scope.TempImagesArray.push(obj);
                            $scope.tempPrecriptionCount++;
                        }
                        else {
                            $scope.TempPdfArray.push(obj);
                        }
                    });
                }
            }
        }
    };

    $scope.addUpdateInsuranceTpsDtls = function () {

        if (!$scope.UserAccessRights.AllAccessRights.SettingsInsuranceTpasAddUpdate) {
            alertify.error("Sorry You Dont have Access,Please Contact Administrator");
            return false;
        }
        if ($scope.InsuranceListObject.BillingCategoryTypeId === "" || $scope.InsuranceListObject.BillingCategoryTypeId === 0) {
            alertify.error("Please Select a Billing Category");
            return false;
        }

        if ($scope.InsuranceListObject.InsuranceObj === "") {
            alertify.error("Please Enter/Select an Insurance");
            return false;
        }
        if ($scope.InsuranceListObject.TpaObj === "") {
            alertify.error("Please Enter/Select an Tpa");
            return false;
        }

        if (!$scope.InsuranceListObject.IsCashPaymentEligible && !$scope.InsuranceListObject.IsCreditPaymentEligible) {
            alertify.error("Please Select any Payment Mode Cash/Credit");
            return false;
        }
        var file = $scope.agreementFiles;
        var fd = new FormData();

        var DeleteIndicator = 'N';
        if ($scope.InsuranceListObject.DeleteInd) {
            DeleteIndicator = 'Y';
        }


        fd.append("OrgInsuranceId", $scope.InsuranceListObject.OrgInsuranceId);
        fd.append("BillingCategoryTypeId", $scope.InsuranceListObject.BillingCategoryTypeId);
        fd.append("InsuranceTPAId", $scope.InsuranceListObject.InsuranceTPAId);
        fd.append("InsuraceId", $scope.InsuranceListObject.InsuraceId);
        fd.append("TpaId", $scope.InsuranceListObject.TpaId);
        fd.append("InsuranceName", $scope.InsuranceListObject.InsuranceName);
        fd.append("TpaName", $scope.InsuranceListObject.TpaName);
        fd.append("TpaContactPersonName", $scope.InsuranceListObject.TpaContactPersonName);
        fd.append("TpaContactPersonPhnNumber", $scope.InsuranceListObject.TpaContactPersonPhnNumber);
        fd.append("TpaEmailId", $scope.InsuranceListObject.TpaEmailId);
        fd.append("CountryId", $scope.InsuranceListObject.CountryId);
        fd.append("TpaStateId", $scope.InsuranceListObject.TpaStateId);
        fd.append("TpaCityId", $scope.InsuranceListObject.TpaCityId);
        fd.append("TpaAddress", $scope.InsuranceListObject.TpaAddress);
        fd.append("TpaPinCode", $scope.InsuranceListObject.TpaPinCode);
        fd.append("AdditionalTpaLocalContactPersonName", $scope.InsuranceListObject.AdditionalInformation.TpaLocalContactPersonName);
        fd.append("AdditionalTpaLocalContactPersonPhnNumber", $scope.InsuranceListObject.AdditionalInformation.TpaLocalContactPersonPhnNumber);
        fd.append("AdditionalTpaLocalEmailId", $scope.InsuranceListObject.AdditionalInformation.TpaLocalEmailId);
        fd.append('UserId', $scope.UserId);
        fd.append('SpecializationId', $scope.SpecializationId);
        fd.append('GetAllIndicator', $scope.InsuranceListObject.GetAllIndicator);
        fd.append("BranchId", $scope.InsuranceListObject.OrganizationId);
        fd.append("ParentOrganizationId", $scope.InsuranceListObject.ParentOrganizationId);
        fd.append("DeleteInd", DeleteIndicator);
        fd.append("AgreementFilesArray", $scope.InsuranceListObject.AgreementFilesArray);
        fd.append('IsCashPaymentEligible', $scope.InsuranceListObject.IsCashPaymentEligible);
        fd.append('IsCreditPaymentEligible', $scope.InsuranceListObject.IsCreditPaymentEligible);



        angular.forEach(file, function (value, key) {
            fd.append(key, value);
        });
        eHnoteDiagnosisDataServices.addInsuranceTpaFileUpload(fd, callbackfileuploadSuccess, callbackfileuploadError);
        function callbackfileuploadSuccess(resp) {
            if (resp.status === "Success") {
                $scope.agreementFiles = [];
                if ($scope.InsuranceListObject.OrgInsuranceId === 0) {
                    alertify.success("Insurance TPA Added Successfully");
                } else {
                    alertify.success("Insurance TPA Updated Successfully");
                }

                $scope.InsuranceListObject = $scope.GetInsuranceListObject();
                $scope.InsuranceTabActive = 1;
                $scope.ChangeTpaInsuranceHospital($scope.InsuranceFilterObject.HospitalObj);
            } else if (resp.status === "Failure") {
                alertify.error(resp.Message);
            } else {
                alertify.error("Some Error Occurred");
            }

        }
        function callbackfileuploadError(err) {
            alertify.error("Some Error Occurred");
        }
    }

    $scope.mainOrgInsTpaArray = [];
    $scope.OrgInsuranceArray = [];
    $scope.InScopeInsurancMouDataArray = [];
    $scope.InscopeInsuranceMouCount = 0;
    $scope.OutScopeInsurancMouDataArray = [];
    $scope.OutscopeInsuranceMouCount = 0;

    function getOrgInsuranceTpasById(BranchId) {
        eHnoteInsuranceService.getOrgInsuranceTpasById(BranchId).then(function (response) {
            console.log(response);
            $scope.mainOrgInsTpaArray = [];
            $scope.OrgInsuranceArray = [];
            $scope.OrgTpaInsuranceArray = [];
            if (response.data.count !== 0) {
                if (response.data.rows !== undefined) {
                    $scope.mainOrgInsTpaArray = response.data.rows;
                }
            }

        });
    }

    $scope.ChangeBillingCategoryType = function (obj) {
        console.log(obj);
        $scope.OrgInsuranceArray = [];
        $scope.OrgTpaInsuranceArray = [];
        $scope.NewSearchMouDataObject.InsuranceId = "";
        $scope.NewSearchMouDataObject.TpaId = "";
        angular.forEach($scope.mainOrgInsTpaArray, function (insitem) {
            if (insitem.BillingCategoryTypeId === obj.BillingCategoryTypeId) {
                var insObj = {
                    "InsuranceId": insitem.InsuranceCompanyId,
                    "InsuranceName": insitem.InsuranceCompanyName,
                }

                $scope.OrgInsuranceArray.push(insObj);
            }
        });
        $scope.OrgInsuranceArray = _.uniq($scope.OrgInsuranceArray, false, function (p) { return p.InsuranceId; });
    }


    Array.prototype.unique = function () {
        var a = this.concat();
        for (var i = 0; i < a.length; ++i) {
            for (var j = i + 1; j < a.length; ++j) {
                if (a[i].$$hashKey) {
                    delete a[i].$$hashKey;
                }
                if (a[j].$$hashKey) {
                    delete a[j].$$hashKey;
                }
                if (a[i] === a[j]) {
                    a.splice(j--, 1);
                }
            }
        }
        return a;
    };

    $scope.changeOrgInsurance = function (insuranceId) {

        $scope.OrgTpaInsuranceArray = [];
        angular.forEach($scope.mainOrgInsTpaArray, function (insitem) {
            if (insitem.InsuranceCompanyId === insuranceId) {
                var tpaObj = {
                    "OrgInsuranceTpaId": insitem.OrgInsuranceTpaId,
                    "TpaId": insitem.TPAId,
                    "TpaName": insitem.TPAName,
                }
                $scope.OrgTpaInsuranceArray.push(tpaObj);
            }

        });
    };
    $scope.changeOrgTpa = function (mainitem) {
        console.log(mainitem.TpaObj);
        mainitem.TpaId = mainitem.TpaObj.TpaId;
        mainitem.TpaName = mainitem.TpaObj.TpaName;
        mainitem.OrgInsuranceTpaId = mainitem.TpaObj.OrgInsuranceTpaId;


    }
    $scope.getInsuranceMouDataOnLoad = function () {
        getOrganizationBillingCategories($scope.NewSearchMouDataObject.BranchId);
        getOrgInsuranceTpasById($scope.NewSearchMouDataObject.BranchId);
        $scope.isMouItemCostSearchEnabled = false;
    }

    $scope.NewSearchMouData = function () {
        return {
            "BillingCategoryTypeId": 0,
            "InsuranceTPAId": 0,
            "InsuranceId": "",
            "InsuranceObj": "",
            "InsuranceName": "",
            "OrgInsuranceTpaId": "",
            "TpaObj": "",
            "TpaId": "",
            "TpaName": "",
            "ProcedureTypeId": 1,
            "UserId": $scope.UserId,
            "PageSize": 10,
            "PageNumber": 1,
            "HospitalObj": $filter("filter")($scope.AllInsuraceHospitalList, { "ClinicId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID }, true)[0],
            "SpecializationId": $scope.SpecializationId,
            "BranchId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "GetAllIndicator": false,
            "ParentOrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
        }
    }

    $scope.NewSearchMouDataObject = $scope.NewSearchMouData();


    $scope.GetOrgInscopeInsuranceMouData = function () {
        var obj = angular.copy($scope.NewSearchMouDataObject);
        delete obj.HospitalObj;
        eHnoteInsuranceService.getInScopeInsuranceMouDataById(obj, onSuccess, onError);
        function onSuccess(resp) {
            console.log(JSON.stringify(resp));
            $scope.InScopeInsurancMouDataArray = [];
            if (resp.Status === 'Success' && resp.rows.length > 0) {
                $scope.InScopeInsurancMouDataArray = resp.rows;
                $scope.InscopeInsuranceMouCount = resp.count;
                angular.forEach($scope.InScopeInsurancMouDataArray, function (item) {
                    if (item.MOUId === 0) {
                        item.IsInScope = false;
                        item.IsSelected = false;
                        item.DeleteInd = false;
                        item.MOUStartDate = '';
                        item.MOUEndDate = '';
                        item.GeneralCost = item.GeneralCost || 0;
                        item.OriginalMouCost = "";
                        item.DeluxMouCost = "";
                        item.SuperDeluxMouCost = "";
                        item.VIPMouCost = "";
                        item.VVIPMouCost = "";

                    } else {
                        item.IsInScope = true;
                        item.IsSelected = false;
                        item.DeleteInd = false;
                        item.MOUStartDate = $filter("date")(item.MOUStartDate, "dd-MM-yyyy");
                        item.MOUEndDate = $filter("date")(item.MOUEndDate, "dd-MM-yyyy");
                        item.GeneralCost = item.GeneralCost || 0;
                        item.OriginalMouCost = item.OriginalMouCost || "";
                        item.DeluxMouCost = item.DeluxMouCost || "";
                        item.SuperDeluxMouCost = item.SuperDeluxMouCost || "";
                        item.VIPMouCost = item.VIPMouCost || "";
                        item.VVIPMouCost = item.VVIPMouCost || "";
                    }
                });
            }

        }
        function onError(reponse) {
        }
    };
    $scope.SearchNewOrgInscopeMouData = function () {

        if ($scope.NewSearchMouDataObject.BillingCategoryTypeId === "" || $scope.NewSearchMouDataObject.BillingCategoryTypeId === 0) {
            alertify.error("Please Select Billing Category");
            return false;
        }

        if ($scope.NewSearchMouDataObject.InsuranceId === "" || $scope.NewSearchMouDataObject.InsuranceId === 0) {
            alertify.error("Please Select Insurance");
            return false;
        }
        if ($scope.NewSearchMouDataObject.TpaId === "" || $scope.NewSearchMouDataObject.TpaId === 0) {
            alertify.error("Please Select TPA");
            return false;
        }


        $scope.NewMouTabActive = 1;
        angular.element(document.querySelector("#inScopeActive")).addClass("active");
        angular.element(document.querySelector("#outScopeActive")).removeClass("active");
        $scope.FilterInScopeList = {
            "IsEditMode": false,
            "IsOutScopeEditMode": false,
            "IsInScopeEditMode": false,
            "SearchText": "",
            "FromDate": "",
            "ToDate": ""
        };
        $scope.CheckList = { "CheckAllMouData": false };
        $scope.NewSearchMouDataObject.PageNumber = 1;
        $scope.GetOrgInscopeInsuranceMouData();
        $scope.isMouItemCostSearchEnabled = true;
    }

    $scope.changeInScopeProcedure = function () {
        $scope.FilterInScopeList = {
            "IsEditMode": false,
            "IsOutScopeEditMode": false,
            "IsInScopeEditMode": false,
            "SearchText": "",
            "FromDate": "",
            "ToDate": ""
        };
        $scope.CheckList = { "CheckAllMouData": false };
        $scope.NewSearchMouDataObject.PageNumber = 1;
        $scope.GetOrgInscopeInsuranceMouData();
    }
    $scope.changeOutScopeProcedure = function () {
        $scope.FilterInScopeList = {
            "IsEditMode": false,
            "IsOutScopeEditMode": false,
            "IsInScopeEditMode": false,
            "SearchText": "",
            "FromDate": "",
            "ToDate": ""
        };
        $scope.CheckList = { "CheckAllMouData": false };
        $scope.NewSearchMouDataObject.PageNumber = 1;
        $scope.GetOrgOutscopeInsuranceMouData();
    }
    $scope.GetOrgOutscopeInsuranceMouData = function () {
        var obj = angular.copy($scope.NewSearchMouDataObject);
        delete obj.HospitalObj;

        eHnoteInsuranceService.getOutScopeInsuranceMouDataById(obj, onSuccess, onError);
        function onSuccess(resp) {
            console.log(JSON.stringify(resp));
            $scope.OutScopeInsurancMouDataArray = [];
            $scope.OutscopeInsuranceMouCount = 0;
            if (resp.Status === 'Success' && resp.rows.length > 0) {
                $scope.OutScopeInsurancMouDataArray = resp.rows;
                $scope.OutscopeInsuranceMouCount = resp.count;

                angular.forEach($scope.OutScopeInsurancMouDataArray, function (item) {
                    if (item.MOUId === 0) {
                        item.IsInScope = false;
                        item.IsSelected = false;
                        item.DeleteInd = false;
                        item.MOUStartDate = "";
                        item.MOUEndDate = "";
                        item.GeneralCost = item.GeneralCost || 0;
                        item.OriginalMouCost = "";
                        item.DeluxMouCost = "";
                        item.SuperDeluxMouCost = "";
                        item.VIPMouCost = "";
                        item.VVIPMouCost = "";

                    } else {
                        item.IsInScope = true;
                        item.IsSelected = false;
                        item.DeleteInd = false;
                        item.MOUStartDate = $filter("date")(item.MOUStartDate, "dd-MM-yyyy");
                        item.MOUEndDate = $filter("date")(item.MOUEndDate, "dd-MM-yyyy");
                        item.GeneralCost = item.GeneralCost || 0;
                        item.OriginalMouCost = item.OriginalMouCost || "";
                        item.DeluxMouCost = item.DeluxMouCost || "";
                        item.SuperDeluxMouCost = item.SuperDeluxMouCost || "";
                        item.VIPMouCost = item.VIPMouCost || "";
                        item.VVIPMouCost = item.VVIPMouCost || "";
                    }
                });
                $scope.MouDataSearch = false;
            }

        }
        function onError(reponse) {
        }
    };

    $scope.ChangeInsMouType = function (menu) {
        $scope.NewMouTabActive = menu;
        $scope.FilterInScopeList = {
            "IsEditMode": false,
            "IsOutScopeEditMode": false,
            "IsInScopeEditMode": false,
            "SearchText": "",
            "FromDate": "",
            "ToDate": ""
        };
        $scope.CheckList = { "CheckAllMouData": false };
        $scope.NewSearchMouDataObject.PageNumber = 1;
        if (menu === 2) {
            $scope.GetOrgOutscopeInsuranceMouData();
        } else {
            $scope.GetOrgInscopeInsuranceMouData();
        }
    };


    $scope.InscopeMouDataPagechanged = function (number) {
        $scope.NewSearchMouDataObject.PageNumber = number;
        $scope.GetOrgInscopeInsuranceMouData();
    };

    $scope.OutScopeMouDataPagechanged = function (number) {
        $scope.NewSearchMouDataObject.PageNumber = number;
        $scope.GetOrgOutscopeInsuranceMouData();
    };

    $scope.ChangeOutScopeEditMode = function () {
        $scope.FilterInScopeList.IsOutScopeEditMode = !$scope.FilterInScopeList.IsOutScopeEditMode;
    };
    $scope.ChangeInScopeEditMode = function () {
        $scope.FilterInScopeList.IsInScopeEditMode = !$scope.FilterInScopeList.IsInScopeEditMode;
    };


    $scope.AddUpdateOrgOutScopeMOUData = function () {

        if (!$scope.UserAccessRights.AllAccessRights.SettingsInsuranceMouDataAddUpdate) {
            alertify.error("Sorry You Dont have Access,Please Contact Administrator");
            return false;
        }

        var SelectedArray = $filter("filter")($scope.OutScopeInsurancMouDataArray, { "IsSelected": true });

        if (SelectedArray.length === 0) {
            alertify.error("Please select atleast one field");
            return false;
        }

        var checkEmptylist = $filter("filter")(SelectedArray, function (item, index) {
            return item.MOUStartDate === '' && item.MOUEndDate === '';
        });
        if (checkEmptylist.length !== 0) {
            alertify.error("Please Choose Mandatory Fileds");
            return false;
        }
        var obj = {
            "UserId": $scope.UserId,
            "SpecializationId": $scope.SpecializationId,
            "BranchId": $scope.NewSearchMouDataObject.HospitalObj.ClinicId,
            "ParentOrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "GetAllIndicator": $scope.NewSearchMouDataObject.AllBranchIndecator ? 1 : 0,
            "BillingCategoryTypeId": $scope.NewSearchMouDataObject.BillingCategoryTypeId,
            "InsuranceTpaMOUList": []
        };

        angular.forEach(SelectedArray, function (item, index) {

            item.MOUStartDate = $filter("date")(item.MOUStartDate, "dd-MM-yyyy");
            item.MOUEndDate = $filter("date")(item.MOUEndDate, "dd-MM-yyyy");
            var object = {
                "MOUId": item.MOUId,
                "OrgInsuranceTpaId": $scope.NewSearchMouDataObject.OrgInsuranceTpaId,
                "ProcedureTypeId": $scope.NewSearchMouDataObject.ProcedureTypeId,
                "ParticularId": item.ParticularId,
                "MOUStartDate": $filter("dateFormatter")(item.MOUStartDate, "-"),
                "MOUEndDate": $filter("dateFormatter")(item.MOUEndDate, "-"),
                "DeleteInd": item.DeleteInd,
                "OriginalMouCost": parseFloat(item.OriginalMouCost) || 0,
                "DeluxMouCost": parseFloat(item.DeluxMouCost) || 0,
                "SuperDeluxMouCost": parseFloat(item.SuperDeluxMouCost) || 0,
                "VIPMouCost": parseFloat(item.VIPMouCost) || 0,
                "VVIPMouCost": parseFloat(item.VVIPMouCost) || 0
            };
            obj.InsuranceTpaMOUList.push(object);
        });
        console.log(JSON.stringify(obj));

        eHnoteInsuranceService.AddUpdateOrganizationMOUData(obj, onSuccess, onError);
        function onSuccess(resp) {
            if (resp.Status === "Failure") {
                alertify.error(resp.Message);
            } else {
                alertify.success("Mou Data Added successfully");
                $scope.FilterInScopeList = {
                    "IsEditMode": false,
                    "IsOutScopeEditMode": false,
                    "IsInScopeEditMode": false,
                    "SearchText": "",
                    "FromDate": "",
                    "ToDate": ""
                };
                $scope.CheckList = { "CheckAllMouData": false };
                $scope.NewSearchMouDataObject.PageNumber = 1;
                $scope.GetOrgOutscopeInsuranceMouData();
            }

        }
        function onError(reponse) {
        }
    };

    $scope.AddUpdateOrgInScopeMOUData = function () {

        if (!$scope.UserAccessRights.AllAccessRights.SettingsInsuranceMouDataAddUpdate) {
            alertify.error("Sorry You Dont have Access,Please Contact Administrator");
            return false;
        }

        var SelectedArray = $filter("filter")($scope.InScopeInsurancMouDataArray, { "IsSelected": true });

        if (SelectedArray.length === 0) {
            alertify.error("Please select atleast one field");
            return false;
        }

        var checkEmptylist = $filter("filter")(SelectedArray, function (item, index) {
            return item.MOUStartDate === '' && item.MOUEndDate === '';
        });
        if (checkEmptylist.length !== 0) {
            alertify.error("Please Choose Mandatory Fileds");
            return false;
        }
        var obj = {
            "UserId": $scope.UserId,
            "SpecializationId": $scope.SpecializationId,
            "BranchId": $scope.NewSearchMouDataObject.HospitalObj.ClinicId,
            "ParentOrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "GetAllIndicator": $scope.NewSearchMouDataObject.AllBranchIndecator ? 1 : 0,
            "InsuranceTpaMOUList": []
        };

        angular.forEach(SelectedArray, function (item, index) {

            item.MOUStartDate = $filter("date")(item.MOUStartDate, "dd-MM-yyyy");
            item.MOUEndDate = $filter("date")(item.MOUEndDate, "dd-MM-yyyy");
            var object = {
                "MOUId": item.MOUId,
                "OrgInsuranceTpaId": $scope.NewSearchMouDataObject.OrgInsuranceTpaId,
                "ProcedureTypeId": $scope.NewSearchMouDataObject.ProcedureTypeId,
                "ParticularId": item.ParticularId,
                "MOUStartDate": $filter("dateFormatter")(item.MOUStartDate, "-"),
                "MOUEndDate": $filter("dateFormatter")(item.MOUEndDate, "-"),
                "DeleteInd": item.DeleteInd,
                "OriginalMouCost": parseFloat(item.OriginalMouCost) || 0,
                "DeluxMouCost": parseFloat(item.DeluxMouCost) || 0,
                "SuperDeluxMouCost": parseFloat(item.SuperDeluxMouCost) || 0,
                "VIPMouCost": parseFloat(item.VIPMouCost) || 0,
                "VVIPMouCost": parseFloat(item.VVIPMouCost) || 0
            };
            obj.InsuranceTpaMOUList.push(object);
        });
        console.log(JSON.stringify(obj));

        eHnoteInsuranceService.AddUpdateOrganizationMOUData(obj, onSuccess, onError);
        function onSuccess(resp) {
            if (resp.Status === "Failure") {
                alertify.error(resp.Message);
            } else {
                alertify.success("Mou Data Updated successfully");
                $scope.FilterInScopeList = {
                    "IsEditMode": false,
                    "IsOutScopeEditMode": false,
                    "IsInScopeEditMode": false,
                    "SearchText": "",
                    "FromDate": "",
                    "ToDate": ""
                };
                $scope.CheckList = { "CheckAllMouData": false };
                $scope.NewSearchMouDataObject.PageNumber = 1;
                $scope.GetOrgInscopeInsuranceMouData();
            }

        }
        function onError(reponse) {
        }
    };

    $scope.ClearInScopeMOUData = function () {
        $scope.NewSearchMouDataObject = $scope.NewSearchMouData();
        $scope.FilterInScopeList = {
            "IsEditMode": false,
            "IsOutScopeEditMode": false,
            "IsInScopeEditMode": false,
            "SearchText": "",
            "FromDate": "",
            "ToDate": ""
        };
        $scope.MouDataSearch = true;
        $scope.NewSearchMouDataObject.PageNumber = 1;
        $scope.GetOrgInscopeInsuranceMouData();
    };

    $scope.ClearOutScopeMOUData = function () {
        $scope.NewSearchMouDataObject = $scope.NewSearchMouData();
        $scope.FilterInScopeList = {
            "IsEditMode": false,
            "IsOutScopeEditMode": false,
            "IsInScopeEditMode": false,
            "SearchText": "",
            "FromDate": "",
            "ToDate": ""
        };
        $scope.MouDataSearch = true;
        $scope.NewSearchMouDataObject.PageNumber = 1;
        $scope.GetOrgOutscopeInsuranceMouData();
    };



    //New Code for payor by Durga on 08-02-2022


    $scope.payorTypes = [
        {
            "PayorTypeId": 1,
            "PayorTypeName": "Commercial"
        },
        {
            "PayorTypeId": 2,
            "PayorTypeName": "Private"
        },
        {
            "PayorTypeId": 3,
            "PayorTypeName": "Government"
        }
    ]



    $scope.payorTypesobject = { "value": "" };

    $scope.ChangePayorHospital = function (item) {
        $scope.addNewPayorObject.HospitalObj = item;
        $scope.Search.InsuranceHospitalTxt = "";
        $scope.addNewPayorObject.OrganizationId = item.ClinicId;
        if (item.ClinicId === 0) {
            $scope.addNewPayorObject.AllIndicator = 1;
        } else {
            $scope.addNewPayorObject.AllIndicator = 0;
        }

    };


    $scope.selectedPayorObject = function (selectedPayor) {
        $scope.addNewPayorObject.PayorObject = selectedPayor;
        $scope.addNewPayorObject.PayorId = selectedPayor.PayorId;
        $scope.addNewPayorObject.PayorName = selectedPayor.PayorName;
    };
    $scope.changePayorSearch = function (item) {
        item.PayorId = 0;
        item.PayorName = "";
    };
    $scope.changePayorType = function (item) {
        $scope.addNewPayorObject.PayorTypeId = item.PayorTypeId;
        $scope.addNewPayorObject.PayorTypeName = item.PayorTypeName;
    };

    $scope.changeCoverageType = function (item) {
        $scope.addNewPayorObject.PayorTypeId = item.CoverageId;
        $scope.addNewPayorObject.PayorTypeName = item.CoverageName;
    };

    $scope.onChangepayor = function (item) {
        $scope.PlanDetailsObject.PayorId = item.PayorId;
        $scope.PlanDetailsObject.PayorName = item.PayorName;
    };
    $scope.Filepayor = "";
    $scope.uploadTpaAgreement = function ($files) {
        $scope.Filepayor = $files;
        if ($files.length > 0) {
            $scope.addNewPayorObject.AgreementFilesArray.push($files[0]);
        }
    };


    function getpayorlistObj() {
        var obj = {
            "BranchObj": $filter("filter")($scope.AllUserBranchesList, { "ClinicId": 0 }, true)[0],
            "PayorTypeId": "",
            "searchPayorName": "",
            "PageSize": 20,
            "PageNumber": 1,
            "Status": "Active",
            "GetAllIndicator": false
        }
        return obj;
    }
    $scope.searchConsultationHospitalTxt = "";
    $scope.PayorListObj = getpayorlistObj();
    $scope.PayorAllLIstArray = [];



    $scope.SerachGetOrgBasedPayor = function (val) {
        var param = {
            "SearchText": val,
            "PageSize": $scope.PlanDetailsObject.PageSize || 20,
            "PageNumber": $scope.PlanDetailsObject.PageNumber || 1,
            "UserId": $scope.UserId,
            "SpecializationId": $scope.SpecializationId,
            "OrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "ParentOrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "GetAllIndicator": 0,
            "PayorTypeId": $scope.PlanDetailsObject.PayorTypeId//0
        }
        return eHnoteInsuranceService.GetOrganizationPayorsList(param).then(function (resp) {
            if (resp.data.count !== 0) {
                if (resp.data.rows !== undefined) {
                    return resp.data.rows.map(function (item) {
                        return item;
                    });
                }
            }
        });
    }

    $scope.GetOrganizationPayorAllList = function () {
        //$scope.PayorListObj.PayorTypeId = ($scope.PayorListObj.PayorTypeId != "" && $scope.PayorListObj.PayorTypeId != null) ? $scope.PayorListObj.PayorTypeId : 0;

        //var param = {
        //    "SearchText": $scope.PayorListObj.searchPayorName,
        //    "Status": $scope.PayorListObj.Status,
        //    "PageSize": $scope.PayorListObj.PageSize || 20,
        //    "PageNumber": $scope.PayorListObj.PageNumber || 1,
        //    "UserId": $scope.UserId,
        //    "SpecializationId": $scope.SpecializationId,
        //    "OrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
        //    "ParentOrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
        //    "GetAllIndicator": 0,
        //    "PayorTypeId": $scope.PayorListObj.PayorTypeId//0
        //}
        //eHnoteInsuranceService.GetOrganizationPayorsListByStatus(param).then(function (resp) {
        //    var l = resp;
        //    $scope.PayorAllLIstArray = [];
        //    $scope.AllPayorLIstcount = 0;
        //    if (resp.data.Status === "Success") {
        //        $scope.PayorAllLIstArray = resp.data.rows;
        //        $scope.AllPayorLIstcount = resp.data.count;
        //    } else {

        //    }
        //}, function (error) {
        //    console.log(error);
        //});
    };
    $scope.ClearPayorList = function () {
        $scope.searchConsultationHospitalTxt = "";
        $scope.PayorListObj = getpayorlistObj();
        $scope.PayorAllLIstArray = [];
        $scope.AllPayorLIstcount = 0;
        $scope.GetOrganizationPayorAllList();
    };



    $scope.PayorSubTabActive = 1;


    $scope.PayorSubClassActiveMenu = function (menuno) {
        return (menuno === $scope.PayorSubTabActive) ? "active" : "";
    };

    $scope.ChangeInsuranceType = function (menu) {
        $scope.InsuranceTabActive = menu;
        if (menu === 1) {
            $scope.InsuranceListObject = $scope.GetInsuranceListObject();
            $scope.addNewPayorObject = $scope.GetAddNewInsurancePayorObject();
        }
        $scope.Init();
        if (menu === 2) {
            $scope.payorPlansListObj = getpayorPlanslistObj();
        }
        if (menu === 3) {
            //$scope.switchPayorSubTab(1);

            //eHnoteProcedureDataService.getProcedureType(onsuccessProc, onfailureProc);
            //function onsuccessProc(data) {
            //    $scope.TempProcedureList = [];
            //    $scope.TempProcedureList = data;
            //    $scope.PayorProcedureListTypes = [];
            //    angular.forEach($scope.TempProcedureList, function (item) {
            //        if (item.Id === 1 || item.Id === 3 || item.Id === 5 || item.Id === 6 || item.Id === 10) {
            //            $scope.PayorProcedureListTypes.push(item);
            //        }
            //    });

            //}
            //function onfailureProc(data) {
            //}
            $scope.ModifierList = [];
            $scope.getModifier();
            $scope.RateListObj = GetRateListObj();
            // $scope.GetPayorProcedureFee();
            $scope.RateList = [];
        }
        if (menu === 4) {
            $scope.GetInsuranceDocument();
        }
        if (menu === 5) {
            $scope.GetSearchPayorgrupByText();
        }
    }

    $scope.switchPayorSubTab = function (menuno) {
        $scope.PayorSubTabActive = menuno;

        if (menuno == 1) {
            getFeeMasterCPTBillDetail();
            getMasterPOSCodes();
            getMasterTOSCodes();
            getMasterProcedureCategory();
            getInsuranceTypes();
            getMasterModifiers();

            GetMasterProcedureFees();
            Getwriteoffdetails();
        }
    };

    $scope.getCPTBillDetailObj = function () {

        var obj = {
            "ProcedureId": 0,
            "OrgProcedureId": 0,
            "ProcedureName": "",
            "ProcedureCode": "",
            "ShortCut": "",
            "Description": "",
            "Statement": "",
            "Modifier1": "",
            "Modifier2": "",
            "Modifier3": "",
            "Modifier4": "",
            "ProcedureGeneralCost": "",
            "MedicareExpected": "",
            "MedicarePublished": "",
            "PageSize": 10,
            "PageNumber": 1,
            "ActiveInd": 'Y',
            "SearchText": "",
            "SearchDescription": "",
            "SearchModifier1": "",
            "SearchCharge": "",
            "SearchMedicarePublished": "",
            "Modifier1Obj": "",
            "Modifier2Obj": "",
            "Modifier3Obj": "",
            "Modifier4Obj": "",
            "ProcedureCategoryId": "",
            "SpecializationId": "",
            "InternalRVU": "",
            "StandardCost": "",
            "StandardUnits": "",
            "HCPCSCode": "",
            "RVSCode": "",
            "RVSFee": "",
            "RVSUnits": "",
            "UBRevenueCode": "",
            "ServiceTypeObj": "",
            "ServiceTypeId": "",
            "CopayRelated": "",
            "ProcedureCategoryObj": "",
            "SpecialityObj": "",
            "POSId": "",
            "TOSId": "",
            "RecallTypeObj": "",
            "RecallTypeId": "",
            "RecallInterval": "",
            "CoinsurancePercent": "",
            "AuthorizationRequired": 'N',
            "DocumentationRequired": 'N',
            "ShortList": 'N',
            "NDCNumber": "",
            "DrugQuantity": "",
            "Comments": "",
            "Status": '',
            "POSObj": "",
            "TOSObj": "",
            "Inventory": "N",
            "OnHand": "",
            "ReorderPoint": "",
            "PurchasedService": "N",
            "ValidGender": "N",
            "EMCode": "N",
            "Emergency": "N",
            "COB": "N",
            "EPSTD": "N",
            "CodingSymbolObj": "",
            "CodingSymbolId": "",
            "PostOpDays": "",
            "ProcedureTypeobj": "",
            "ProcedureTypeNewId": "",
            "TaxableService": 'N'
        };
        return obj;
    }
    $scope.CPTBillDetailObj = angular.copy($scope.getCPTBillDetailObj());
    $scope.FeeCodeMasterCPTBillDetailList = [];

    $scope.POSCodeList = [];
    $scope.FeePOSCodeList = [];
    $scope.TOSCodeList = [];
    $scope.FeeTOSCodeList = [];
    $scope.ProcedureCategoryList = [];
    $scope.FeeProcedureCategoryList = [];
    $scope.InsurancePlanList = [];
    $scope.FeeInsurancePlanList = [];
    $scope.payorPlansListArray = [];
    $scope.ModifierList1 = [];
    $scope.ModifierList2 = [];
    $scope.ModifierList3 = [];
    $scope.ModifierList4 = [];
    $scope.FeeModifierList1 = [];
    $scope.FeeModifierList2 = [];
    $scope.FeeModifierList3 = [];
    $scope.FeeModifierList4 = [];
    $scope.FeeCodeArrayList = [];
    $scope.WriteoffList = [];
    $scope.masterFeeCodeBtnName = "Add";
    $scope.FeeSearch = {
        // "ProcedureTypeId": '',
        "ServicesTypeId": '',
        "ProcedureId": 0,
        "InsurancePlanId": 0,
        "POSKEY": 0,
        "TOSKEY": 0,
        "PageSize": 10,
        "PageNumber": 1,
        "ProcedureObj": "",//"Select",
        "POSObj": "",
        "TOSObj": "",

    }
    function getFeeMasterCPTBillDetail() {

        object = {
            "LevelType": "O",
            "HospitalId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "UserId": $scope.UserId,
            "SpecializationId": $scope.SpecializationId,
            "SearchText": $scope.CPTBillDetailObj.SearchText || "",
            "PageSize": 100,
            "PageNumber": 1,
            // "ProcedureTypeId": 1,
            "ServicesTypeId": 1,
            "SearchDescription": "",
            "SearchModifier1": "",
            "SearchCharge": "",
            "AllBranchInd": 0
        };

        eHnoteSettingsDataService.getMasterCPTBillDetail(object).success(function (response) {
            $scope.FeeCodeMasterCPTBillDetailList = [];
            if (response.ProcedureList !== undefined) {
                if (response.ProcedureList.length > 0) {
                    $scope.FeeCodeMasterCPTBillDetailList = response.ProcedureList;
                }
            }

        }).error(function (error) {
            console.log(error);
        });
    }
    function getMasterPOSCodes() {
        eHnoteSettingsDataService.GetAllPOSCodes().success(function (response) {
            $scope.POSCodeList = [];
            if (response.status === "Success") {
                $scope.POSCodeList = response.rows || [];
                $scope.FeePOSCodeList = response.rows || [];
            }

        }).error(function (error) {
            console.log(error);
        });
    }

    function getMasterTOSCodes() {
        eHnoteSettingsDataService.GetAllTOSCodes().success(function (response) {
            $scope.TOSCodeList = [];
            if (response.status === "Success") {
                $scope.TOSCodeList = response.rows || [];
                $scope.FeeTOSCodeList = response.rows || [];
            }

        }).error(function (error) {
            console.log(error);
        });
    }
    function getMasterProcedureCategory() {
        eHnoteSettingsDataService.GetAllProcedureCategory().success(function (response) {
            $scope.ProcedureCategoryList = [];
            if (response.status === "Success") {
                $scope.ProcedureCategoryList = response.rows || [];
                $scope.FeeProcedureCategoryList = response.rows || [];
            }

        }).error(function (error) {
            console.log(error);
        });
    }

    function getInsuranceTypes() {
        //eHnoteSettingsDataService.GetAllInsurancePlans().then(function (resp) {
        //    $scope.InsurancePlanList = resp.data;
        //    $scope.FeeInsurancePlanList = resp.data;
        //}, function (err) {
        //    console.log(err);
        //    alertify.error("Getting InsurancePlan Failed");
        //});



        var param = {
            "SearchText": "",
            "PageSize": 20,
            "PageNumber": 1,
            "UserId": $scope.UserId,
            "SpecializationId": $scope.SpecializationId,
            "OrganizationId": 1,
            "ParentOrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "GetAllIndicator": 0,
            "PayorTypeId": 0
        }
        eHnoteInsuranceService.GetOrganizationPayorsList(param).then(function (resp) {

            $scope.FeeInsurancePlanList = [];
            $scope.InsurancePlanList = [];
            if (resp.data.Status === "Success") {
                $scope.FeeInsurancePlanList = resp.data.rows;
                $scope.InsurancePlanList = resp.data.rows;

            } else {

            }
        }, function (error) {
            console.log(error);
        });
    }




    function getMasterModifiers() {
        eHnoteSettingsDataService.GetAllModifiers().success(function (response) {
            $scope.ModifierList1 = [];
            $scope.ModifierList2 = [];
            $scope.ModifierList3 = [];
            $scope.ModifierList4 = [];
            $scope.FeeModifierList1 = [];
            $scope.FeeModifierList2 = [];
            $scope.FeeModifierList3 = [];
            $scope.FeeModifierList4 = [];
            if (response.status === "Success") {
                $scope.ModifierList1 = response.rows || [];
                $scope.ModifierList2 = response.rows || [];
                $scope.ModifierList3 = response.rows || [];
                $scope.ModifierList4 = response.rows || [];

                $scope.FeeModifierList1 = response.rows || [];
                $scope.FeeModifierList2 = response.rows || [];
                $scope.FeeModifierList3 = response.rows || [];
                $scope.FeeModifierList4 = response.rows || [];
            }

        }).error(function (error) {
            console.log(error);
        });
    }
    function GetMasterProcedureFees() {

        object = {
            "ProcedureId": $scope.FeeSearch.ProcedureId,
            //"ProcedureTypeId": $scope.FeeSearch.ProcedureTypeId || 0,
            "ServicesTypeId": $scope.FeeSearch.ServicesTypeId || 0,
            "InsurancePlanId": $scope.FeeSearch.InsurancePlanId,
            "POSKEY": $scope.FeeSearch.POSKEY,
            "TOSKEY": $scope.FeeSearch.TOSKEY,
            "HospitalId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "UserId": $scope.UserId,
            "SpecializationId": $scope.SpecializationId,
            "PageSize": $scope.FeeSearch.PageSize,
            "PageNumber": $scope.FeeSearch.PageNumber
        }

        eHnoteSettingsDataService.GetProcedureFees(object).success(function (response) {
            if (response.status === 'Success') {
                $scope.FeeCodeArrayList = response.rows || [];
                $scope.masterFeeCodeitemscount = response.count;
            }
        }).error(function (error) {
            console.log(error);
        });
    }

    function Getwriteoffdetails() {
        eHnoteSettingsDataService.Getwriteoffdetails().success(function (response) {
            $scope.WriteoffList = [];
            if (response.status === "Success") {
                $scope.WriteoffList = response.rows || [];
            }

        }).error(function (error) {
            console.log(error);
        });
    }

    $scope.getFeeCodesDetailObj = function () {

        var obj = {
            "ProcedureFeeId": 0,
            "ProcedureId": 0,
            "MODIFIERKEY1": 0,
            "MODIFIERKEY2": 0,
            "MODIFIERKEY3": 0,
            "MODIFIERKEY4": 0,
            "ALTERNATEProcedureId": 0,
            "WRITEOFFId": 0,
            "METHOD": "",
            "CHARGE": null,
            "ALLOWED": null,
            "ALLOWEDPERCENT": 0,
            "WRITEOFFINDICATOR": "N",
            "CoverId": "",
            "CAPITATED": "N",
            "DOCUMENTATIONREQUIRED": "N",
            "COMMENTS": "",
            "InsuranceAmount": 0,
            "ExpectedInsuranceAmount": null,
            "PatientEstimate": null,
            "TAXABLEPERCENT": null,
            "DISPLAYHINT": "",
            "DISPLAYHINTTYPE": "",
            "AUTHORIZATIONREQUIRED": "",
            "PatientCoPayAmount": null,
            "COPAYRELATED": null,
            "POSTOPDAYS": null,
            "InsurancePercentage": null,
            "POSTOPVISITS": 0,
            "REFERRALREQUIRED": 'N',
            "EFFECTIVEDATE": $filter('date')(new Date(), "dd-MMM-yyyy"),
            "EXPIRYDATE": $filter('date')(new Date(), "dd-MMM-yyyy"),
            "ALTERNATECODE": "",
            "ALTERNATECODE2": "",
            "INTERNALRVU": "",
            "RVSCODE": "",
            "RVSFEE": null,
            "RVSUNITS": 'N',
            "REFERRINGDOCTORREQD": null,
            "PREAUTHORIZATIONREQUIRED": null,
            "ALLOWEDYESNO": null,
            "PAPERONLY": "N",
            "NOTCOVERED": "N",
            "UserId": 0,
            "POSKEY": 0,
            "TOSKEY": 0,
            "POSObj": "",
            "TOSObj": "",
            "DeleteInd": "N",
            "ProcedureCategoryObj": "",//"Select",
            "InvestigationCategoryObj": "",//"Select",
            "InsurancePayorTypeObj": "",
            "PlanObj": "",
            "Modifier1Obj": "",
            "Modifier2Obj": "",
            "Modifier3Obj": "",
            "Modifier4Obj": "",
            "WriteoffObj": "",
            "PayorId": "",
            "PlanId": "",
            // "ProcedureTypeId": ""
            "ServicesTypeId": ""
        };
        return obj;
    };
    $scope.FeeCodesDetailObj = angular.copy($scope.getFeeCodesDetailObj());
    $scope.ClearFeeCodesDetail = function () {
        $scope.FeeCodesDetailObj = angular.copy($scope.getFeeCodesDetailObj());
        $scope.masterFeeCodeBtnName = 'Add';
    };


    $scope.ChangeFeeInsurancePlan = function (item) {
        item.InsurancePayorTypeObj = item.InsurancePayorTypeObj || "";
        if (item.InsurancePayorTypeObj != "") {
            item.PayorId = item.InsurancePayorTypeObj.PayorId;
            // item.PlanId = item.InsurancePayorTypeObj.PlanId;
            if (item.PayorId != 0) {
                $scope.payorPlansListArray = [];
                var param = {
                    "SearchText": "",
                    "PageSize": 10,
                    "PageNumber": 1,
                    "UserId": $scope.UserId,
                    "SpecializationId": $scope.SpecializationId,
                    "OrganizationId": $scope.HospitalId,
                    "ParentOrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                    "GetAllIndicator": 0,
                    "PayorId": item.PayorId
                }
                eHnoteInsuranceService.GetOrganizationPayorPlansList(param).then(function (resp) {

                    $scope.payorPlansListArray = [];
                    if (resp.data.Status === "Success") {
                        $scope.payorPlansListArray = resp.data.rows || [];
                        angular.forEach($scope.payorPlansListArray, function (item) {
                            item.CreatedDt = $filter('date')(item.CreatedDt, 'MM-dd-yyyy');
                            item.ModifiedDt = $filter('date')(item.ModifiedDt, 'MM-dd-yyyy');
                        });
                        //var filtredobjpk = $filter("filter")($scope.payorPlansListArray, { "PlanId": item.PlanId })[0];
                        //item.PlanObj = filtredobjpk;

                    }
                }, function (error) {
                    console.log(error);
                });
            } else {
                $scope.payorPlansListArray = [];
            }
        }
    };
    $scope.ChangePayorPlan = function (mainitem) {
        mainitem.PlanId = mainitem.PlanObj.PlanId;
        mainitem.PlanTypeId = mainitem.PlanObj.PlanTypeId;
    }

    $scope.ChangeFeeTOSStatus = function (item) {
        item.TOSObj = item.TOSObj || '';
        if (item.TOSObj !== '') {
            item.TOSKEY = item.TOSObj.TOSId;
        }
    }
    $scope.ChangeFeePOSStatus = function (item) {
        item.POSObj = item.POSObj || '';
        if (item.POSObj !== '') {
            item.POSKEY = item.POSObj.POSId;
        }
    }
    $scope.ChangeFeePOSStatus = function (item) {
        item.POSObj = item.POSObj || '';
        if (item.POSObj !== '') {
            item.POSKEY = item.POSObj.POSId;
        }
    }

    $scope.ChangeFeePOSStatuslist = function (item) {
        item.POSObj = item.POSObj || '';
        if (item.POSObj !== '') {
            item.POSId = item.POSObj.POSId;
        }
    }
    $scope.FeeCodesChanged = function (pageno) {
        $scope.FeeSearch.PageNumber = pageno;
        $scope.FeeCodeSearch();
    };

    $scope.FeeCodeSearch = function () {
        GetMasterProcedureFees();
    };


    $scope.CancelFeecodeDetail = function () {
        $scope.FeeSearch = {
            "ProcedureTypeId": '',
            "ProcedureId": 0,
            "InsurancePlanId": 0,
            "POSKEY": 0,
            "TOSKEY": 0,
            "PageSize": 10,
            "PageNumber": 1,
            "ProcedureObj": "",//"Select",
            "POSObj": "",
            "TOSObj": "",

        }
        GetMasterProcedureFees();
    };

    $scope.calcPercent = function () {

        if ($scope.FeeCodesDetailObj.InsurancePercentage === 0 || $scope.FeeCodesDetailObj.InsurancePercentage === '') {
            return;
        } else {
            if ($scope.FeeCodesDetailObj.InsurancePercentage < 100) {
                $scope.FeeCodesDetailObj.InsuranceAmount = $scope.FeeCodesDetailObj.CHARGE * ($scope.FeeCodesDetailObj.InsurancePercentage / 100);
                $scope.FeeCodesDetailObj.PatientCoPayAmount = $scope.FeeCodesDetailObj.CHARGE - $scope.FeeCodesDetailObj.InsuranceAmount;
            } else {
                alertify.error("Insurance percentage can't be equal or more than 100");
                return false;
            }
        }



    }

    $scope.checkCopayment = function () {

        $scope.FeeCodesDetailObj.InsuranceAmount = parseFloat($scope.FeeCodesDetailObj.InsuranceAmount) || 0;
        $scope.FeeCodesDetailObj.PatientCoPayAmount = parseFloat($scope.FeeCodesDetailObj.PatientCoPayAmount) || 0;

        if (($scope.FeeCodesDetailObj.PatientCoPayAmount + $scope.FeeCodesDetailObj.InsuranceAmount) <= $scope.FeeCodesDetailObj.CHARGE) {

        } else {
            alertify.error("Copayment and Insurance amount exceed charge amount!");
            if ($scope.FeeCodesDetailObj.PatientCoPayAmount > $scope.FeeCodesDetailObj.CHARGE) {
                $scope.FeeCodesDetailObj.PatientCoPayAmount = '';
            } else {
                $scope.FeeCodesDetailObj.InsuranceAmount = '';
            }
        }
    }





    $scope.AddUpdateProcedureFees = function (type, screen) {
        $scope.FeeCodesDetailObj.ServicesTypeId = $scope.FeeCodesDetailObj.ServicesTypeId || '';
        if ($scope.FeeCodesDetailObj.ServicesTypeId === '') {
            alertify.error("Please select Type");
            return false;
        }
        if ($scope.FeeCodesDetailObj.ProcedureId === 0) {
            alertify.error("Please select CPT Procedure");
            return false;
        }
        if ($scope.FeeCodesDetailObj.PayorId === 0 || $scope.FeeCodesDetailObj.PayorId === '') {
            alertify.error("Please select Payor");
            return false;
        }
        if ($scope.FeeCodesDetailObj.PlanId === 0 || $scope.FeeCodesDetailObj.PlanId === '') {
            alertify.error("Please select Plan");
            return false;
        }

        if ($scope.FeeCodesDetailObj.InsuranceAmount === 0) {
            alertify.error("Please enter insurance amount");
            return false;
        }

        //if ($scope.FeeCodesDetailObj.PatientCoPayAmount === 0) {
        //    alertify.error("Please enter copayment amount");
        //    return false;
        //}

        var object = {
            "ProcedureFeeId": $scope.FeeCodesDetailObj.ProcedureFeeId || 0,
            "ProcedureId": $scope.FeeCodesDetailObj.ProcedureId,
            "MODIFIERKEY1": $scope.FeeCodesDetailObj.MODIFIERKEY1,
            "MODIFIERKEY2": $scope.FeeCodesDetailObj.MODIFIERKEY2,
            "MODIFIERKEY3": $scope.FeeCodesDetailObj.MODIFIERKEY3,
            "MODIFIERKEY4": $scope.FeeCodesDetailObj.MODIFIERKEY4,
            "ALTERNATEProcedureId": $scope.FeeCodesDetailObj.ALTERNATEProcedureId,
            "WRITEOFFId": $scope.FeeCodesDetailObj.WRITEOFFId,
            // "InsurancePlanId": $scope.FeeCodesDetailObj.InsurancePlanId,
            "PlanId": $scope.FeeCodesDetailObj.PlanId,
            "PayorId": $scope.FeeCodesDetailObj.PayorId,
            //"ProcedureTypeId": $scope.FeeCodesDetailObj.ProcedureTypeId,
            "ServicesTypeId": $scope.FeeCodesDetailObj.ServicesTypeId,
            "METHOD": $scope.FeeCodesDetailObj.METHOD,
            "CHARGE": $scope.FeeCodesDetailObj.CHARGE,
            "ALLOWED": $scope.FeeCodesDetailObj.ALLOWED,
            "ALLOWEDPERCENT": $scope.FeeCodesDetailObj.ALLOWEDPERCENT,
            "WRITEOFFINDICATOR": $scope.FeeCodesDetailObj.WRITEOFFINDICATOR,
            "CoverId": $scope.FeeCodesDetailObj.CoverId,
            "CAPITATED": $scope.FeeCodesDetailObj.CAPITATED,
            "DOCUMENTATIONREQUIRED": $scope.FeeCodesDetailObj.DOCUMENTATIONREQUIRED,
            "COMMENTS": $scope.FeeCodesDetailObj.COMMENTS,
            "InsuranceAmount": $scope.FeeCodesDetailObj.InsuranceAmount,
            "ExpectedInsuranceAmount": parseFloat($scope.FeeCodesDetailObj.ExpectedInsuranceAmount),
            "PatientEstimate": $scope.FeeCodesDetailObj.PatientEstimate,
            "TAXABLEPERCENT": $scope.FeeCodesDetailObj.TAXABLEPERCENT,
            "DISPLAYHINT": $scope.FeeCodesDetailObj.DISPLAYHINT,
            "DISPLAYHINTTYPE": $scope.FeeCodesDetailObj.DISPLAYHINTTYPE,
            "AUTHORIZATIONREQUIRED": $scope.FeeCodesDetailObj.AUTHORIZATIONREQUIRED,
            "PatientCoPayAmount": $scope.FeeCodesDetailObj.PatientCoPayAmount,
            "COPAYRELATED": $scope.FeeCodesDetailObj.COPAYRELATED,
            "POSTOPDAYS": $scope.FeeCodesDetailObj.POSTOPDAYS,
            "InsurancePercentage": parseFloat($scope.FeeCodesDetailObj.InsurancePercentage),
            "POSTOPVISITS": $scope.FeeCodesDetailObj.POSTOPVISITS,
            "REFERRALREQUIRED": $scope.FeeCodesDetailObj.REFERRALREQUIRED,
            "EFFECTIVEDATE": $scope.FeeCodesDetailObj.EFFECTIVEDATE,
            "EXPIRYDATE": $scope.FeeCodesDetailObj.EXPIRYDATE,
            "ALTERNATECODE": $scope.FeeCodesDetailObj.ALTERNATECODE,
            "ALTERNATECODE2": $scope.FeeCodesDetailObj.ALTERNATECODE2,
            "INTERNALRVU": $scope.FeeCodesDetailObj.INTERNALRVU,
            "RVSCODE": $scope.FeeCodesDetailObj.RVSCODE,
            "RVSFEE": $scope.FeeCodesDetailObj.RVSFEE,
            "RVSUNITS": $scope.FeeCodesDetailObj.RVSUNITS,
            "REFERRINGDOCTORREQD": $scope.FeeCodesDetailObj.REFERRINGDOCTORREQD,
            "PREAUTHORIZATIONREQUIRED": $scope.FeeCodesDetailObj.PREAUTHORIZATIONREQUIRED,
            "ALLOWEDYESNO": $scope.FeeCodesDetailObj.ALLOWEDYESNO,
            "PAPERONLY": $scope.FeeCodesDetailObj.PAPERONLY,
            "NOTCOVERED": $scope.FeeCodesDetailObj.NOTCOVERED,
            "HospitalId": $scope.HospitalId,
            "UserId": $scope.UserId,
            "SpecializationId": $scope.SpecializationId,
            "POSKEY": $scope.FeeCodesDetailObj.POSKEY,
            "TOSKEY": $scope.FeeCodesDetailObj.TOSKEY,
            "DeleteInd": "N",

        };
        eHnoteSettingsDataService.AddUpdateProcedureFees(object).success(function (response) {
            if (response.status === 'Success') {
                if (type === 'Save') {
                    $scope.FeeCodesDetailObj = angular.copy($scope.getFeeCodesDetailObj());
                    GetMasterProcedureFees();
                }

                if (type === 'Continue' && screen === 'Detail') {
                    var item = response.rows[0];
                    $scope.FeeCodesDetailObj.ProcedureFeeId = item.ProcedureFeeId
                    $scope.FeeCodesDetailObj.ProcedureId = item.ProcedureId;
                    $scope.FeeCodesDetailObj.InsurancePlanId = item.InsurancePlanId;
                    $scope.FeeCodesDetailObj.CHARGE = item.CHARGE;
                    $scope.FeeCodesDetailObj.PatientCoPayAmount = item.PatientCoPayAmount;
                    $scope.FeeCodesDetailObj.InsurancePercentage = item.InsurancePercentage;
                    $scope.FeeCodesDetailObj.CAPITATED = item.CAPITATED || "";
                    $scope.FeeCodesDetailObj.REFERRALREQUIRED = item.REFERRALREQUIRED || "";
                    $scope.FeeCodesDetailObj.POSKEY = item.POSKEY || "";
                    $scope.FeeCodesDetailObj.TOSKEY = item.TOSKEY || "";
                    $scope.PayorSubTabActive = 1;
                }
            }

            else {
                alertify.error(response.Message);
            }
        })
            .error(function (error) {
                alertify.error("Error Occurred");
            });
    };

    $scope.EditFeecodeDetailItem = function (item) {
        $scope.updateBtnshow = true;
        console.log(item);

        $scope.FeeCodesDetailObj = $scope.getFeeCodesDetailObj();

        var param = {
            "SearchText": "",
            "PageSize": 10,
            "PageNumber": 1,
            "UserId": $scope.UserId,
            "SpecializationId": $scope.SpecializationId,
            "OrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "ParentOrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "GetAllIndicator": 0,
            "PayorId": item.PayorId
        }
        eHnoteInsuranceService.GetOrganizationPayorPlansList(param).then(function (resp) {

            $scope.payorPlansListArray = [];
            if (resp.data.Status === "Success") {
                $scope.payorPlansListArray = resp.data.rows || [];
                angular.forEach($scope.payorPlansListArray, function (item) {
                    item.CreatedDt = $filter('date')(item.CreatedDt, 'MM-dd-yyyy');
                    item.ModifiedDt = $filter('date')(item.ModifiedDt, 'MM-dd-yyyy');
                });
                $scope.FeeCodesDetailObj.InsurancePayorTypeObj = item.PayorName || '';
                $scope.FeeCodesDetailObj.PlanObj = $filter("filter")($scope.payorPlansListArray, { "PlanId": item.PlanId }, true)[0];
                $scope.payorPlansListObj.TotalCount = 0;
            }
        }, function (error) {
            console.log(error);
        });

        $scope.FeeCodesDetailObj.InsurancePayorTypeObj = $filter("filter")($scope.FeeInsurancePlanList, { "PayorId": item.PayorId }, true)[0];
        //$scope.FeeCodesDetailObj.PlanObj = $filter("filter")($scope.payorPlansListArray, { "PlanId": item.PlanId }, true)[0];
        //$scope.FeeCodesDetailObj.POSObj = $filter("filter")($scope.FeePOSCodeList,{"POSKEY":item.POSKEY},true)[0];
        //$scope.FeeCodesDetailObj.TOSObj = $filter("filter")($scope.TOSCodeList, { "TOSKEY":item.TOSKEY }, true)[0];
        $scope.FeeCodesDetailObj.ProcedureCategoryObj = item.ProcCode;

        // $scope.FeeCodesDetailObj.ProcedureTypeId = item.ProcedureTypeId;
        $scope.FeeCodesDetailObj.ServicesTypeId = item.ServicesTypeId;
        $scope.FeeCodesDetailObj.ProcedureFeeId = item.ProcedureFeeId || 0;
        $scope.FeeCodesDetailObj.ProcedureId = item.ProcedureId;
        $scope.FeeCodesDetailObj.PayorId = item.PayorId;
        $scope.FeeCodesDetailObj.PlanId = item.PlanId;
        $scope.FeeCodesDetailObj.InsuranceAmount = item.InsuranceAmount;
        $scope.FeeCodesDetailObj.PatientCoPayAmount = item.PatientCoPayAmount;
        $scope.FeeCodesDetailObj.InsurancePercentage = item.InsurancePercentage;
        $scope.FeeCodesDetailObj.ExpectedInsuranceAmount = item.ExpectedInsuranceAmount;
        $scope.FeeCodesDetailObj.CAPITATED = item.CAPITATED;
        $scope.FeeCodesDetailObj.REFERRALREQUIRED = item.REFERRALREQUIRED;
        $scope.FeeCodesDetailObj.CHARGE = item.CHARGE;

    };

    $scope.CancelUpdateProcedureFees = function () {
        $scope.updateBtnshow = false;
        $scope.ClearFeeCodesDetail();
    }

    //$scope.DeleteFeecodeDetailItem = function (item) {
    //    var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure want to delete? </h4>", function () {
    //        $scope.FeeCodesDetailObj = item;
    //        $scope.FeeCodesDetailObj.DeleteInd = "Y";
    //        var object = $scope.FeeCodesDetailObj;
    //        eHnoteSettingsDataService.AddUpdateProcedureFees(object).success(function (response) {
    //            GetMasterProcedureFees();
    //        })
    //            .error(function (error) {
    //                alertify.error("Error Occurred");
    //            });

    //    }, function () {
    //        r = "You pressed Cancel!";
    //    });
    //};

    $scope.EditTimePayorList = [];
    $scope.SearchPayorList = function (type) {
        var param = {
            "PageSize": 10,
            "PageNumber": 1,
            "SearchText": ""
        }
        eHnoteInsuranceService.GetMasterPayorsList(param).then(function (resp) {
            if (resp.data.count !== 0) {
                $scope.EditTimePayorList = [];
                $scope.EditTimePayorList = resp.data.rows;
                if (type === "edit") {
                    var filter = $filter("filter")($scope.EditTimePayorList, { "PayorId": $scope.addNewPayorObject.PayorId }, true)[0];
                    $scope.addNewPayorObject.PayorObject = filter;
                }
            }
        });
    };


    $scope.DeletePayorDetails = function (item, Type) {
        if (Type == 'Active') {
            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure want to Active? </h4>", function () {
                var param = {
                    "OrganizationPayorId": item.OrganizationPayorId,
                    "PayorId": item.PayorId,
                    "DeleteInd": 'N',
                    "UserId": $scope.UserId,
                    /*"BranchId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,*/
                }

                eHnoteInsuranceService.DeleteOrganizationPayors(param).then(function (resp) {
                    if (resp.data.Status == "Success") {
                        $scope.GetOrganizationPayorAllList();
                        alertify.success('Activated Successfully');
                    }
                });

            }, function () {
                r = "You pressed Cancel!";
            });
        } else {
            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure want to in-Active? </h4>", function () {
                var param = {
                    "OrganizationPayorId": item.OrganizationPayorId,
                    "PayorId": item.PayorId,
                    "DeleteInd": 'Y',
                    "UserId": $scope.UserId,
                    /* "BranchId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,*/
                }

                eHnoteInsuranceService.DeleteOrganizationPayors(param).then(function (resp) {
                    if (resp.data.Status == "Success") {
                        $scope.GetOrganizationPayorAllList();
                        alertify.success('in-activated  Successfully');
                    }
                });

            }, function () {
                r = "You pressed Cancel!";
            });
        }






        //if (Type == 'Active') {
        //    var param = {
        //        "OrganizationPayorId": item.OrganizationPayorId,
        //        "PayorId": item.PayorId,
        //        "DeleteInd": 'N',
        //        "UserId": $scope.UserId,
        //        /*"BranchId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,*/
        //    }
        //}
        //else {
        //    var param = {
        //        "OrganizationPayorId": item.OrganizationPayorId,
        //        "PayorId": item.PayorId,
        //        "DeleteInd": 'Y',
        //        "UserId": $scope.UserId,
        //       /* "BranchId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,*/
        //    }
        //}

        //eHnoteInsuranceService.DeleteOrganizationPayors(param).then(function (resp) {
        //    if (resp.data.Status == "Success") {
        //        $scope.GetOrganizationPayorAllList();
        //        alertify.success('Deleted Successfully');
        //    }
        //});
    }

    //$scope.EditPayorDetails = function (Item) {
    //    $scope.addNewPayorObject = $scope.GetAddNewInsurancePayorObject();
    //    $scope.Search.InsuranceHospitalTxt = "";

    //    $scope.addNewPayorObject.OrganizationpayorId = Item.OrganizationPayorId;
    //    $scope.addNewPayorObject.OrganizationId = Item.OrganizationId;
    //    var filterhospital = $filter("filter")($scope.AllUserBranchesList, { "ClinicId": Item.OrganizationId }, true)[0];
    //    $scope.addNewPayorObject.HospitalObj = filterhospital;
    //    if (filterhospital !== undefined) {
    //        if (filterhospital.ClinicId === 0) {
    //            $scope.addNewPayorObject.AllIndicator = 1;
    //        } else {
    //            $scope.addNewPayorObject.AllIndicator = 0;
    //        }
    //    }


    //    $scope.addNewPayorObject.PayorContactPersonName = Item.ContactPersonName;
    //    $scope.addNewPayorObject.PayorContactPersonMobile = Item.ContactPersonMobile;
    //    $scope.addNewPayorObject.PayorContactPersonEmailId = Item.ContactPersonEmail;
    //    $scope.addNewPayorObject.PayorAddress = Item.PayorAddress;
    //    $scope.addNewPayorObject.AgreementFilesArray = Item.AgreementFilesArray;

    //    $scope.addNewPayorObject.PayorCode = Item.PayorCode;
    //    $scope.addNewPayorObject.PayorTypeId = Item.PayorTypeId;
    //    $scope.addNewPayorObject.PayorTypeName = Item.PayorTypeName;
    //    //var filter = $filter("filter")($scope.payorTypes, { "PayorTypeId": $scope.addNewPayorObject.PayorTypeId }, true)[0];
    //    //$scope.payorTypesobject.value = filter;
    //    var filter = $filter("filter")($scope.InsuranceCoverageList, { "CoverageId": $scope.addNewPayorObject.PayorTypeId }, true)[0];
    //    $scope.payorTypesobject.value = filter;

    //    $scope.addNewPayorObject.PayorId = Item.PayorId;
    //    $scope.addNewPayorObject.PayorName = Item.PayorName;
    //    $scope.SearchPayorList("edit");

    //}

    function GetPlanDetailsObject() {
        var obj = {
            "BranchId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "BranchObj": $filter("filter")($scope.AllUserBranchesList, { "ClinicId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID }, true)[0],
            "ParentOrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "GetAllIndicator": 0,
            "OrganizationPlanId": 0,
            "PlanTypeId": 0,
            "PlanId": 0,
            "PlanName": "",
            "PlanObj": "",
            "PlanCode": "",
            "MaximumCoverageLimit": "",
            "CoverageStartDate": $filter("date")(new Date(), "dd-MMM-yyyy"),
            "CoverageEndDate": $filter("date")(new Date(), "dd-MMM-yyyy"),
            "AgreementFilesArray": [],
            "PlanTypeObj": "",
            "PayorId": 0,
            "PayorObj": ""
        }
        return obj;
    };
    $scope.PlanDetailsObject = GetPlanDetailsObject();
    $scope.PlanDetailsArray = [];
    $scope.GetMasterPayorPlanTypes = function () {
        eHnoteInsuranceService.GetMasterPayorPlanTypes().then(function (resp) {
            if (resp.data.status == "Success") {
                $scope.PlanDetailsArray = resp.data.rows;
            }
        }, function (error) {
            console.log(error);
        });
    }
    $scope.GetMasterPayorPlanTypes();

    $scope.AddUpdatePayorPlanDetails = function () {

        if ($scope.PlanDetailsObject.PayorId === 0) {
            alertify.error('Select Payor');
            return false;
        }
        if ($scope.PlanDetailsObject.PlanName === '') {
            alertify.error('Enter Plan Name');
            return false;
        }
        if ($scope.PlanDetailsObject.MaximumCoverageLimit === '') {
            alertify.error('Enter Maximum Coverage Amount');
            return false;
        }


        var DeleteInd = "N";
        var file = $scope.PlanDetailsObject.AgreementFilesArray;
        var fd = new FormData();

        fd.append("UserId", $scope.UserId);
        fd.append("BranchId", $scope.PlanDetailsObject.BranchId);
        fd.append("ParentOrganizationId", $scope.PlanDetailsObject.ParentOrganizationId);
        fd.append('GetAllIndicator', $scope.PlanDetailsObject.GetAllIndicator);
        fd.append('OrganizationPlanId', $scope.PlanDetailsObject.OrganizationPlanId);
        fd.append('PlanTypeId', $scope.PlanDetailsObject.PlanTypeId);
        fd.append('PlanId', $scope.PlanDetailsObject.PlanId);
        fd.append('PlanName', $scope.PlanDetailsObject.PlanName);
        fd.append('PlanCode', $scope.PlanDetailsObject.PlanCode);
        fd.append('CoverageStartDate', $scope.PlanDetailsObject.CoverageStartDate);
        fd.append('CoverageEndDate', $scope.PlanDetailsObject.CoverageEndDate);
        fd.append('SpecializationId', $scope.SpecializationId);
        fd.append('DeleteInd', DeleteInd);
        fd.append('AgreementFilesArray', $scope.PlanDetailsObject.AgreementFilesArray);
        fd.append('MaximumCoverageLimit', $scope.PlanDetailsObject.MaximumCoverageLimit);
        fd.append('PayorId', $scope.PlanDetailsObject.PayorId);

        angular.forEach(file, function (value, key) {
            fd.append(key, value);
        });

        eHnoteInsuranceService.AddUpdateOrganizationPayorPlan(fd, callbackfileuploadSuccess, callbackfileuploadError);
        function callbackfileuploadSuccess(resp) {
            if (resp.status === "Success") {
                var l = resp;

                $scope.PlanDetailsObject = GetPlanDetailsObject();
            }

        }
        function callbackfileuploadError(err) {
            alertify.error("Some Error Occurred");
        }
    }
    $scope.changedatePlanStartDate = function (date) {
        $scope.PlanDetailsObject.CoverageStartDate = $filter("date")(new Date(date), "dd-MMM-yyyy");
    }
    $scope.changedatePlanEndDate = function (date) {
        $scope.PlanDetailsObject.CoverageEndDate = $filter("date")(new Date(date), "dd-MMM-yyyy");
    };

    $scope.SearchMasterFeeProcedure = function (item) {
        if (item != "") {
            $scope.FeeCodesDetailObj.ProcedureId = item.ProcedureId;
            // $scope.FeeCodesDetailObj.ProcedureTypeId = item.ProcedureTypeId;
            $scope.FeeCodesDetailObj.ServicesTypeId = item.ServicesTypeId;
            $scope.FeeCodesDetailObj.ProcedureCategoryObj = item.ProcedureCode;
            $scope.FeeCodesDetailObj.CHARGE = item.ProcedureGeneralCost;
            $scope.FeeCodesDetailObj.InsurancePercentage = "";
            $scope.FeeCodesDetailObj.InsuranceAmount = "";
            $scope.FeeCodesDetailObj.PatientCoPayAmount = "";
        }
    };

    $scope.onSelectDiagSurgerynew = function (item) {
        if (item != "") {
            $scope.FeeCodesDetailObj.ProcedureId = item.SurgeryId;
            // $scope.FeeCodesDetailObj.OrgSurgeryId = item.OrgSurgeryId;
            //  $scope.FeeCodesDetailObj.ProcedureTypeId = item.ProcedureTypeId;
            $scope.FeeCodesDetailObj.ProcedureCategoryObj = item.CPTCode;
            $scope.FeeCodesDetailObj.CHARGE = item.ProcedureGeneralCost;
            $scope.FeeCodesDetailObj.InsurancePercentage = "";
            $scope.FeeCodesDetailObj.InsuranceAmount = "";
            $scope.FeeCodesDetailObj.PatientCoPayAmount = "";
        }
    };
    $scope.onselectInvestigationnew = function (item) {
        if (item != "") {
            $scope.FeeCodesDetailObj.ProcedureId = item.InvestigationId;
            // $scope.FeeCodesDetailObj.OrgSurgeryId = item.OrgSurgeryId;
            //  $scope.FeeCodesDetailObj.ProcedureTypeId = item.ProcedureTypeId;
            $scope.FeeCodesDetailObj.ProcedureCategoryObj = item.CPTCode;
            $scope.FeeCodesDetailObj.CHARGE = item.GeneralCost;
            $scope.FeeCodesDetailObj.InsurancePercentage = "";
            $scope.FeeCodesDetailObj.InsuranceAmount = "";
            $scope.FeeCodesDetailObj.PatientCoPayAmount = "";
        }
    };
    $scope.onSelectConsultationFee = function (item) {
        if (item != "") {
            $scope.FeeCodesDetailObj.ProcedureId = item.ConsultationProcedureId;
            // $scope.FeeCodesDetailObj.OrgSurgeryId = item.OrgSurgeryId;
            //  $scope.FeeCodesDetailObj.ProcedureTypeId = item.ProcedureTypeId;
            $scope.FeeCodesDetailObj.ProcedureCategoryObj = item.CPTCode || '';
            $scope.FeeCodesDetailObj.CHARGE = item.PhysicalConsultationCost;
            $scope.FeeCodesDetailObj.InsurancePercentage = "";
            $scope.FeeCodesDetailObj.InsuranceAmount = "";
            $scope.FeeCodesDetailObj.PatientCoPayAmount = "";
        }
    };

    $scope.onSelectOtherProcedure = function (item) {
        if (item != "") {
            $scope.FeeCodesDetailObj.ProcedureId = item.ProcedureId;
            // $scope.FeeCodesDetailObj.OrgSurgeryId = item.OrgSurgeryId;
            //  $scope.FeeCodesDetailObj.ProcedureTypeId = item.ProcedureTypeId;
            $scope.FeeCodesDetailObj.ProcedureCategoryObj = item.CPTCode || '';
            $scope.FeeCodesDetailObj.CHARGE = item.ProcedureGeneralCost;
            $scope.FeeCodesDetailObj.InsurancePercentage = "";
            $scope.FeeCodesDetailObj.InsuranceAmount = "";
            $scope.FeeCodesDetailObj.PatientCoPayAmount = "";
        }
    };




    //$scope.GetOrganizationPayorPlansList = function () {
    //    $scope.payorPlansListObj.PayorId = $scope.payorPlansListObj.PayorId || 0;

    //    var param = {
    //        "SearchText": $scope.payorPlansListObj.searchPayorName,
    //        "PageSize": $scope.payorPlansListObj.PageSize,
    //        "PageNumber": $scope.payorPlansListObj.PageNumber,
    //        "UserId": $scope.UserId,
    //        "SpecializationId": $scope.SpecializationId,
    //        "OrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
    //        "ParentOrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
    //        "GetAllIndicator": 0,
    //        "PayorId": $scope.payorPlansListObj.PayorId
    //    }
    //    eHnoteInsuranceService.GetOrganizationPayorPlansList(param).then(function (resp) {

    //        $scope.payorPlansListArray = [];
    //        if (resp.data.Status === "Success") {
    //            $scope.payorPlansListArray = resp.data.rows || [];
    //            $scope.payorPlansListObj.TotalCount = 0;
    //        }
    //    }, function (error) {
    //        console.log(error);
    //    });
    //};


    $scope.Init = function () {
        if ($scope.InsuranceTabActive == 1) {

            $scope.GetOrganizationPayorAllList();

        } else {
            //if ($scope.SearchMouDataObject.CategoryId === 6 || $scope.SearchMouDataObject.CategoryId === 7) {
            //    $q.all([
            //        $scope.MouTabActive === 1 ? $scope.GetOrganizationMOUData() : $scope.GetOrganizationMOUData_Outflow(),
            //        //$scope.getOrganizationSurgeriesList(),

            //    ]).then(function (resp) {
            //        if (resp[0].data.length !== 0) {
            //            $scope.OrgnizationMouList = resp[0].data.rows;
            //            $scope.InscopeMouCount = resp[0].data.count;
            //            angular.forEach($scope.OrgnizationMouList, function (item) {
            //                if (item.MOUId === 0) {
            //                    item.IsInScope = false;
            //                    item.IsSelected = false;
            //                    item.DeleteInd = false;
            //                    item.MOUStartDate = '';
            //                    item.MOUEndDate = '';
            //                    item.CostDetails = angular.copy($scope.OrgMouDataList);
            //                } else {
            //                    item.IsInScope = true;
            //                    item.IsSelected = false;
            //                    item.DeleteInd = false;
            //                    item.MOUStartDate = $filter("date")(item.MOUStartDate, "dd-MM-yyyy");
            //                    item.MOUEndDate = $filter("date")(item.MOUEndDate, "dd-MM-yyyy");
            //                    if (item.CostDetails.length === 0) {
            //                        item.CostDetails = angular.copy($scope.OrgMouDataList);
            //                    }
            //                }
            //            });
            //            $scope.MouDataSearch = false;
            //        }

            //    }, function (err) {
            //        console.log(err);
            //        alertify.error("Getting Data Failed");
            //    });
            //}
        }

        if ($scope.InsuranceTabActive == 2) {
            $scope.payorPlansListObj = getpayorPlanslistObj();
            $scope.GetOrganizationPayorPlansList();
        }

        $scope.InsuranceCoverageList = [];
        eHnoteSettingsDataService.GetPatientRelatedMasterData().then(function (resp) {
            if (resp.data.status == "Success") {
                $scope.InsuranceCoverageList = resp.data.CoverageArray || [];
            }

        }, function (error) {
            console.log(error);
        });

    };
    $scope.Init();

    $scope.masterProceduresLevelType = "O";
    $scope.getMasterProcedureItemsSearch = function (val) {
        object = {
            "LevelType": $scope.masterProceduresLevelType,
            "AllBranchInd": 0,
            "HospitalId": $scope.HospitalId ? $scope.HospitalId : $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "UserId": $scope.UserId,
            "SpecializationId": $scope.SpecializationId,
            "SearchText": val,
            "PageSize": 10,
            "PageNumber": 1,
            //"ProcedureTypeId": $scope.FeeCodesDetailObj.ProcedureTypeId || 0
            "ServicesTypeId": 0
        };
        return eHnoteSettingsDataService.GetMasterProcedures(object).then(function (response) {
            if (response.data.ProcedureList !== undefined) {
                return response.data.ProcedureList.map(function (item) {
                    return item;
                });
            }
        });
    };

    $scope.InvSpecialityId = 3;
    $scope.GetAllSpecialityInd = 1;
    $scope.getNewOrgInvestigations = function (text) {
        var params = {
            "InvSpecialityId": $scope.InvSpecialityId,
            "HospitalId": $scope.HospitalId ? $scope.HospitalId : $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "UserId": $scope.UserId,
            "GetAllIndicator": 0,
            "GetAllSpecialityInd": $scope.GetAllSpecialityInd,
            "PageSize": 10,
            "PageNumber": 1,
            "SearchText": '',
            "CPTSearchText": text,
            "Type": 'O',

        };
        return eHnoteLabService.getOrganizationInvestigationData(params).then(function (resp) {
            if (resp.data.rows !== undefined) {
                return resp.data.rows.map(function (item) {
                    return item;
                });
            }
        });
    };

    $scope.getOrgDiagSurgeries = function (text) {

        var params = {
            "HospitalId": $scope.HospitalId ? $scope.HospitalId : $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "AllBranchInd": 0,
            "PageSize": 10,
            "PageNumber": 1,
            "SearchText": '',
            "CPTSearchText": text,
            "SurgeryCategoryId": null,
            "Type": 'O',
            "UserId": $scope.UserId
        };

        return eHnoteSurgeryService.GetOrganizationSurgeries(params, "Get").then(function (response) {
            if (response.data.count !== 0) {
                if (response.data.rows !== undefined) {
                    return response.data.rows.map(function (item) {
                        return item;
                    });
                }
            }
        });
    };

    $scope.getUserBranchConsultationFeeDetls = function (val) {

        var params = {
            "BranchId": $scope.HospitalId ? $scope.HospitalId : $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "DoctorId": $scope.UserId,
            "AppointmentTypeId": 0,
            "SearchText": "",
            "CPTSearchText": val,
            "PageSize": 10,
            "PageNumber": 1
        };
        return eHnoteMainAppointmentService.getUserBranchConsulCharges1(params).then(function (response) {
            if (response.data.rows !== undefined) {
                return response.data.rows.map(function (item) {
                    return item;
                });
            }
        });


    }
    $scope.getMasterOtherProcedureItemsSearch = function (val) {
        object = {
            "LevelType": 'O',
            "AllBranchInd": 0,
            "HospitalId": $scope.HospitalId ? $scope.HospitalId : $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "UserId": $scope.UserId,
            "SpecializationId": $scope.SpecializationId,
            "SearchText": "",
            "CPTSearchText": val,
            "PageSize": 10,
            "PageNumber": 1,
            "ProcedureTypeId": $scope.selectedProcedureTypeId ? $scope.selectedProcedureTypeId : 0
        };
        return eHnoteSettingsDataService.GetMasterOtherProcedures(object).then(function (response) {
            if (response.data.ProcedureList !== undefined) {
                return response.data.ProcedureList.map(function (item) {
                    return item;
                });
            }
        });
    };

    $scope.ChangeMasterFeeProcedure = function (item) {
        $scope.FeeCodesDetailObj.ProcedureId = "";
        // $scope.FeeCodesDetailObj.ProcedureTypeId = "";
    };
    //$scope.FeeSearch.ProcedureId
    $scope.SearchFeeProcedure = function (item) {
        if (item != null && item != undefined) {
            $scope.FeeSearch.ProcedureId = item.ProcedureId;
        } else {
            $scope.FeeSearch.ProcedureId = 0;
        }
    }
    $scope.ChangeFeeProcedure = function () {
        $scope.FeeSearch.ProcedureId = 0;
    }

    $scope.TOSCodeLists = [];
    $scope.getOrganizationTOSCodes = function () {
        eHnotePatientAddressDataServices.GetOrganizationTOSCodes($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID).then(function (resp) {
            console.log(resp);
            if (resp.data.rows.length > 0) {
                $scope.TOSCodeLists = resp.data.rows || [];
            }
        });
    };
    $scope.getOrganizationTOSCodes();






    //New Payor Code by DUrga as on 12-11-2022

    if ($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
        $scope.HospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID || 0;
    }

    $scope.MasterPayosTypesArray = [];
    $scope.getMasterPayorTypesList = function () {
        $scope.MasterBox14 = [];
        $scope.MasterBox15 = [];

        eHnoteInsuranceService.getMasterPayorTypesList().then(function (resp) {
            if (resp.data.rows.length > 0) {
                $scope.MasterPayosTypesArray = angular.copy(resp.data.rows);
                $scope.MasterBox14 = resp.data.MasterBox14;
                $scope.MasterBox15 = resp.data.MasterBox15;
            }
        }, function (err) {
            alertify.error("Failed");
            console.log(err);
        });
    };
    $scope.getMasterPayorTypesList();

    $scope.SearchPayorListMaster = function (SearchText) {
        var param = {
            "PageSize": 20,
            "PageNumber": 1,
            "SearchText": ""
        }
        if (SearchText !== "") {
            param.SearchText = SearchText;
        }
        return eHnoteInsuranceService.GetMasterPayorsList(param).then(function (resp) {
            if (resp.data.count !== 0) {
                if (resp.data.rows !== undefined) {
                    return resp.data.rows.map(function (item) {
                        return item;
                    });
                }
            }
        });
    };




    $scope.GetAddNewInsurancePayorObject = function () {
        return {
            "UserId": $scope.UserId,
            "OrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "AllIndicator": 0,
            "ParentOrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            //"MasterPayorId": "",
            "PayorTypeId": "",
            "OrganizationPayorId": 0,
            "PayorId": 0,
            "PayorName": "",
            "PayorCode": "",
            "PayorObject": "",
            "IsActive": true,
            "Address1": "",
            "Address2": "",
            "CityId": 0,
            "StateId": 0,
            "ZipCode": "",
            "CountryId": 0,
            "ContactPersonName": "",
            "ContactPersonNumber": "",
            "ContactNumber": "",
            "ContactNumberAreaCode": "",
            "ContactNumberCountryCode": "",
            "AlternateContactPersonNumber": "",
            "AlternateContactNumber": "",
            "AlternateContactNumberAreaCode": "",
            "AlternateContactNumberCountryCode": "",
            "PayorContactPersonEmailId": "",
            "UsePrivateFeeOnClaims": false,
            "SignatureOnPatientFile": false,
            "SubmitClaimsElectronically": false,
            "IsMedicateOrAdvantage": false,
            "SecondaryIdRequired": false,
            "PrintPostalAddressinField": false,
            "UseMedicareLCDRules": false,
            "IsIncludeFacilityNPIInEDI": false,
            "IsIncludeRenderingProviderNPIInEDI": false,
            "IsIncludeBillingProviderNPIInEDI": false, 
            "SendNDC": false,
            "Fax": "",
            "Website": "",
            "LCDContractTypeId": "",
            "PayorSubmitShowingId": "",
            "PayorSubmitOtherShowingId": "",
            "ProfessionalFormId": "",
            "InstitutionalFormId": "",
            "DentalFormId": "",
            "SurgeryReasonUnitId": "",
            "AnesthesiaUnitId": "",
            "RVUOPDAmount": "",
            "RVUIPDAmount": "",
            "SurgeryMinimumAmount": "",
            "SurgerySecondProcedure": "",
            "SurgeryThirdProcedure": "",
            "Notes": "",
            "DeleteInd": "N",
            "BranchObj": $filter("filter")($scope.AllUserBranchesList, { "ClinicId": $scope.HospitalId }, true)[0],
            "GetAllIndicator": 0,
            "AgreementFilesArray": [],
            "ProffesionalPayerId": "",
            "InstitutionalPayerId": "",
            "EligibilityPayerId": "",
            "Box4Value1": "",
            "Box4Value2": "",
            "Box4ValueId2": null,
            "Box4Value3": "",
            "Box4ValueId3": null,
            "Box4Value4": "",
            "Box4ValueId4": null,
            "Box14ValueId": null,
            "Box14Value": "",
            "Box14ValueCode": 0,
            "Box15ValueId": null,
            "Box15Value": "",
            "Box15ValueCode": 0,
            "Box79ValueId": null,
            "Box79Value": "",
            "Box79ValueNPI": "",
            "Box79TypeId": 4,
            "Box79Type": "None",
            "Box78TypeId": 4,
            "Box78Type": "None",
            "Box80Value": "",
            "IsBox80Checked": false,
            "SubmitInsuranceEligibilityElectronically": false,
            "ClaimFilingLimitDays": "",
            "AdjustmentFilingLimitDays": "",
        };
    };

    $scope.addNewPayorObject = $scope.GetAddNewInsurancePayorObject();


    $scope.masterLCDContractTypes = [
        {
            "LCDContractTypeId": 1,
            "LCDContractTypeName": "A and B and HHM"
        },
        {
            "LCDContractTypeId": 2,
            "LCDContractTypeName": "A and B MAC"
        },
        {
            "LCDContractTypeId": 3,
            "LCDContractTypeName": "Carrier"
        },
        {
            "LCDContractTypeId": 4,
            "LCDContractTypeName": "DME MAC"
        },
        {
            "LCDContractTypeId": 5,
            "LCDContractTypeName": "DME PSC"
        },
        {
            "LCDContractTypeId": 6,
            "LCDContractTypeName": "DME PSC/MAC"
        },
        {
            "LCDContractTypeId": 7,
            "LCDContractTypeName": "DMERC"
        },
        {
            "LCDContractTypeId": 8,
            "LCDContractTypeName": "F1"
        },
        {
            "LCDContractTypeId": 9,
            "LCDContractTypeName": "HHH-MAC"
        },
        {
            "LCDContractTypeId": 10,
            "LCDContractTypeName": "MAC-Part A"
        },
        {
            "LCDContractTypeId": 11,
            "LCDContractTypeName": "MAC-Part B"
        },
        {
            "LCDContractTypeId": 12,
            "LCDContractTypeName": "RHHI"
        },
        {
            "LCDContractTypeId": 13,
            "LCDContractTypeName": "WorkGroup"
        }
    ];


    $scope.ProfessionalFormsArray = [
        {
            "FormId": 1,
            "FormTypeId": 2,
            "FormName": "CMS 1500"
        },

        ]
    $scope.InsuranceFormsArray = [
        {
            "FormId": 1,
            "FormTypeId": 2,
            "FormName": "CMS 1500"
        },
        //{
        //    "FormId": 3,
        //    "FormTypeId": 1,
        //    "FormName": "Form 1500 (02/12)"
        //},
        {
            "FormId": 2,
            "FormTypeId": 2,
            "FormName": "UB 04"
        },
        {
            "FormId": 4,
            "FormTypeId": 3,
            "FormName": "J400 (2006)"
        },
        {
            "FormId": 5,
            "FormTypeId": 3,
            "FormName": "J430D (2012)"
        },
        {
            "FormId": 6,
            "FormTypeId": 3,
            "FormName": "J430 (2019)"
        }
    ];


    $scope.payorSubmitShowingValues = [
        {
            "ShowingId": 1,
            "ShowingValue": "Signature on file on providers signature"
        },
        {
            "ShowingId": 2,
            "ShowingValue": "Show Name"
        },
        {
            "ShowingId": 3,
            "ShowingValue": "Image on Signature"
        },
        {
            "ShowingId": 4,
            "ShowingValue": "Leave  Blank"
        }
    ];


    $scope.masterInsuranceUnitTypes = [
        {
            "UnitTypeId": 1,
            "UnitType": "Rate"
        },
        {
            "UnitTypeId": 2,
            "UnitType": "Minutues"
        },
        {
            "UnitTypeId": 3,
            "UnitType": "Units"
        },
        {
            "UnitTypeId": 4,
            "UnitType": "N/A"
        }
    ];


    $scope.getOrganizationInsurancePayorsList = function (id) {
        $scope.getInsurancePayorListReqObj.PayorTypeId = $scope.getInsurancePayorListReqObj.PayorTypeId || 0;

        if (id == 1) {
            $scope.getInsurancePayorListReqObj.PageNumber = 1;
        }

        var param = {
            "SearchText": $scope.getInsurancePayorListReqObj.searchPayorName,
            "Status": $scope.getInsurancePayorListReqObj.Status,
            "PageSize": $scope.getInsurancePayorListReqObj.PageSize || 20,
            "PageNumber": $scope.getInsurancePayorListReqObj.PageNumber || 1,
            "UserId": $scope.UserId,
            "SpecializationId": $scope.SpecializationId,
            //"OrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "OrganizationId": $scope.getInsurancePayorListReqObj.BranchObj.BranchId,
            "ParentOrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "GetAllIndicator": 0,
            "PayorId": $scope.getInsurancePayorListReqObj.PayorId,
            "PayorTypeId": $scope.getInsurancePayorListReqObj.PayorTypeId//0
        };

        if (param.OrganizationId == 0) {
            param.GetAllIndicator = 1;
        } else if (param.OrganizationId != 0) {
            param.GetAllIndicator = 0;
        }

        eHnoteInsuranceService.GetOrganizationInsurancePayorsList(param).then(function (resp) {

            $scope.organizationPayorsArray = [];
            $scope.getInsurancePayorListReqObj.TotalCount = 0;
            if (resp.data.Status === "Success") {
                $scope.organizationPayorsArray = resp.data.rows;
                $scope.getInsurancePayorListReqObj.TotalCount = resp.data.count;
            } else {

            }
        }, function (error) {
            console.log(error);
        });
    };

    function getPayorListReqObj() {
        var obj = {
            "BranchObj": $filter("filter")($scope.AllUserBranchesList, { "ClinicId": $scope.HospitalId }, true)[0],
            "PayorTypeId": "",
            "PayorId": 0,
            "searchPayorName": "",
            "PageSize": 10,
            "PageNumber": 1,
            "Status": "Active",
            "TotalCount": 0,
            "GetAllIndicator": false,
            "PayorObj": ""
        }
        return obj;
    }
    $scope.searchConsultationHospitalTxt = "";
    $scope.getInsurancePayorListReqObj = getPayorListReqObj();
    $scope.organizationPayorsArray = [];
    $scope.getOrganizationInsurancePayorsList();

    $scope.statesList = [];

    $scope.getStatesByCountry = function (country) {
        console.log(country);
        $scope.statesList = [];
        $scope.citiesList = [];
        var country = parseInt(country);
        eHnotePatientAddressDataServices.getStatesByCountryId(country).then(function (resp) {
            console.log(resp.data);
            if (resp.data.rows.length > 0) {
                $scope.statesList = resp.data.rows;

            }
            else {
                $scope.statesList = [];

            }
        });
    };
    $scope.getStatesByCountry(2);


    $scope.citiesList = [];
    $scope.changegetCitiesByState = function (state) {
        console.log(state);
        var CityId = $scope.addNewPayorObject.CityId;
        console.log(CityId);
        $scope.citiesList = [];
        var state = parseInt(state);
        eHnotePatientAddressDataServices.getCitiesByStateId(state).then(function (resp) {
            console.log(resp.data);
            if (resp.data.length > 0) {
                $scope.citiesList = resp.data;
                var matchedCity = $scope.citiesList.find(city => city.CityId === CityId);

                // Assign the matched CityId back if found
                if (matchedCity) {
                    $scope.addNewPayorObject.CityId = matchedCity.CityId;
                }
            }
        });
    }

    $scope.AgreementFilesArray = [];
    $scope.uploadInsurancePayorAgreement = function ($files) {

        //$scope.Filepayor = $files;
        //if ($files.length > 0) {
        //    $scope.addNewPayorObject.AgreementFilesArray.push($files[0]);
        //}

        $scope.addNewPayorObject.AgreementFilesArray = [];

        $scope.addNewPayorObject.S3URL = '';
        $scope.file = "";

        $scope.file = $files;
        //if ($scope.file != null) {
        //    var pName = $scope.file[0].name, name = "";
        //    var type = $scope.file[0].type.split("/")[1];
        //    if (pName.length > 9) {
        //        name = pName.substring(0, 9) + "..." + "." + type;
        //    } else {
        //        name = angular.copy(pName) + '.' + type;
        //    }

        //    var obj = {
        //        "file": $scope.file,
        //        "DeleteInd": "N",
        //        "DocumentId": 0,
        //        "DocumentExt": $scope.file[0].type,
        //        "DocumentName": name,
        //        "S3URL": "",
        //    };
        //    if ($scope.file[0].type != 'application/pdf') {
        //        $scope.addNewPayorObject.AgreementFilesArray.push(obj);
        //    }
        //    else {
        //        $scope.addNewPayorObject.AgreementFilesArray.push(obj);
        //    }

        //    angular.element("input[type='file']").val(null);
        //}
        if ($scope.file != null) {
            if ($scope.file.length > 0) {
                angular.forEach($scope.file, function (fitem) {
                    var pName = fitem.name, name = "";
                    var type = fitem.type.split("/")[1];
                    if (pName.length > 9) {
                        name = pName.substring(0, 9) + "..." + "." + type;
                    } else {
                        name = angular.copy(pName) + '.' + type;
                    }

                    var obj = {
                        "file": fitem,
                        "DeleteInd": "N",
                        "DocumentId": 0,
                        "DocumentExt": fitem.type,
                        "DocumentName": name,
                        "S3URL": "",
                    };
                    if (fitem.type != 'application/pdf') {
                        $scope.addNewPayorObject.AgreementFilesArray.push(obj);
                    }
                    else {
                        $scope.addNewPayorObject.AgreementFilesArray.push(obj);
                    }

                    //  angular.element("input[type='file']").val(null);
                });
            }
        }
    };


    $scope.ClearOrgPayorsList = function () {
        $scope.searchConsultationHospitalTxt = "";
        $scope.PayorListObj = getpayorlistObj();
        $scope.PayorAllLIstArray = [];
        $scope.AllPayorLIstcount = 0;
        $scope.getInsurancePayorListReqObj = getPayorListReqObj();
        $scope.getOrganizationInsurancePayorsList();
    };

    $scope.ChnagePayorListBrachObj = function (item) {
        $scope.getInsurancePayorListReqObj.BranchObj = item;
        $scope.searchConsultationHospitalTxt = "";
        if (item.ClinicId === 0) {
            $scope.getInsurancePayorListReqObj.GetAllIndicator = true;
        } else {
            $scope.getInsurancePayorListReqObj.GetAllIndicator = false;
        }
    }


    $scope.ChangePayorPage = function (pagenumber) {
        $scope.getInsurancePayorListReqObj.PageNumber = pagenumber;
        $scope.getOrganizationInsurancePayorsList();
    }

    $scope.OnSelectGetPayorObj = function (getItem) {
        if (getItem != undefined) {
            $scope.getInsurancePayorListReqObj.PayorId = getItem.PayorId || 0;
        }
    };
    $scope.changeGetPayor = function (getItem) {
        $scope.getInsurancePayorListReqObj.PayorId = 0;
    };

    $scope.newinit();


    $scope.AddCreateFeePopUp = function (item) {

        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/settings/CreateFreePopUp.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            "windowClass": "modal__sixty--",
            "resolve": {
                "EditItem": function () { return item; },
            },
            "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService, EditItem) {

                function GetPayorProcedureFeeObj() {
                    var obj = {
                        "UserId": $scope.UserId,
                        "OrganizationProcedurePayorId": 0,
                        "OrganizationProcedureId": 0,
                        "OrganizationPayorId": 0,
                        "OrganizationId": $scope.HospitalId,
                        "ProcedureId": 0,
                        "ModifierId": 0,
                        "RequirePreAuth": false,
                        "ProvedureNotCoveredByInsurance": false,
                        "CapitatedService": false,
                        "ActualCost": "",
                        "PreviousYearCost": "",
                        "InFacilityActualCost": "",
                        "InFacilityPreviousYearCost": "",
                        "OfficeActualCost": "",
                        "OfficePreviousYearCost": "",
                        "OfficeValueCost": "",
                        "UnitValueCost": "",
                        "AnesthesiaCost": "",
                        "Remarks": "",
                        "IsActive": true,
                        "DeleteInd": "N",
                        "PayorObj": "",
                        "ProcedureObj": "",
                        "CptcodeObj": "",
                        "GeneralCost":""
                    };
                    return obj;
                };
                $scope.PayorProcedureFeeObj = GetPayorProcedureFeeObj();
                if (EditItem != undefined) {
                    $scope.PayorProcedureFeeObj.PayorObj = EditItem.PayorName || "";
                    $scope.PayorProcedureFeeObj.OrganizationProcedurePayorId = EditItem.OrganizationProcedurePayorId;
                    $scope.PayorProcedureFeeObj.OrganizationPayorId = EditItem.OrganizationPayorId || "";
                    $scope.PayorProcedureFeeObj.OrganizationProcedureId = EditItem.OrganizationProcedureId || "";
                    $scope.PayorProcedureFeeObj.ProcedureObj = EditItem.ProcedureName || "";
                    $scope.PayorProcedureFeeObj.ProcedureId = EditItem.ProcedureId;
                    $scope.PayorProcedureFeeObj.CptcodeObj = EditItem.CPTCode || "";
                    $scope.PayorProcedureFeeObj.ModifierId = EditItem.ModifierId || "";
                    $scope.PayorProcedureFeeObj.Remarks = EditItem.Remarks || "";
                    $scope.PayorProcedureFeeObj.ActualCost = EditItem.ActualCost || "";
                    $scope.PayorProcedureFeeObj.PreviousYearCost = EditItem.PreviousYearCost || "";
                    $scope.PayorProcedureFeeObj.UnitValueCost = EditItem.UnitValueCost || "";
                    $scope.PayorProcedureFeeObj.InFacilityActualCost = EditItem.InFacilityActualCost || "";
                    $scope.PayorProcedureFeeObj.InFacilityPreviousYearCost = EditItem.InFacilityPreviousYearCost || "";
                    $scope.PayorProcedureFeeObj.AnesthesiaCost = EditItem.AnesthesiaCost || "";
                    $scope.PayorProcedureFeeObj.RequirePreAuth = EditItem.RequirePreAuth;
                    $scope.PayorProcedureFeeObj.ProvedureNotCoveredByInsurance = EditItem.ProvedureNotCoveredByInsurance;
                    $scope.PayorProcedureFeeObj.CapitatedService = EditItem.CapitatedService;
                    $scope.PayorProcedureFeeObj.IsActive = EditItem.IsActive;
                    $scope.PayorProcedureFeeObj.GeneralCost = EditItem.GeneralCost || "";
                    $scope.PayorProcedureFeeObj.OfficeActualCost = EditItem.OfficeActualCost || "";
                    $scope.PayorProcedureFeeObj.OfficePreviousYearCost = EditItem.OfficePreviousYearCost || "";
                    $scope.PayorProcedureFeeObj.OfficeValueCost = EditItem.OfficeValueCost || "";
                }
                $scope.onClickPayor = function (Obj, MainObj) {
                    MainObj.OrganizationPayorId = Obj.OrganizationPayorId;
                };
                $scope.ChangePayor = function (MainObj) {
                    MainObj.OrganizationPayorId = 0;
                }
                $scope.SearchPayorByText = function (SearchText) {
                    var param = {
                        "SearchText": SearchText || "",
                        "Status": "Active",
                        "PageSize": 10,
                        "PageNumber": 1,
                        "UserId": $scope.UserId,
                        "SpecializationId": $scope.SpecializationId,
                        "OrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                        "ParentOrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
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
                    });
                };

                $scope.GetOrganizationProcedure = function (val) {

                    var obj = {
                        "OrganizationId": $scope.PayorProcedureFeeObj.OrganizationId,
                        "ProcedureId":0,
                        "CPTCODE": "",  // cptcode tblorganizationprocedure
                        "SearchText": val || "", // searchtext
                        "TypeOfServiceId": 0,
                        "PageNumber": 1,
                        "PageSize": 10,
                        "GetAllIndicator": 0,
                        "ParentOrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                        "Status": 1
                    };
                    return eHnoteSettingsDataService.GetOrganizationProcedures(obj).then(function (response) {
                        console.log(response);
                        if (response.data.Status == "Success") {
                            if (response.data.rows !== undefined) {
                                return response.data.rows.map(function (item) {
                                    return item;
                                });
                            }
                        }
                    });
                };
                $scope.onClickProcedure = function (Obj, MainObj) {
                    MainObj.OrganizationProcedureId = Obj.OrganizationProcedureId;
                    MainObj.ProcedureId = Obj.ProcedureId;
                    MainObj.CptcodeObj = Obj.CPTCode;
                    MainObj.GeneralCost = Obj.GeneralCost;
                    $scope.PayorProcedureFeeObj.ActualCost = Obj.GeneralCost;
                };
                $scope.ChangeProcedure = function (MainObj) {
                    MainObj.OrganizationProcedureId = 0;
                    // MainObj.ProcedureId = 0;
                    // MainObj.CptcodeObj = "";
                };
                $scope.GetMasterCPTProcedure = function (val) {
                    var param = {
                        "SearchText": val || "",
                        "PageSize": 10,
                        "PageNumber": 1,
                        "TypeOfServiceId": 0
                    }
                    return eHnoteSettingsDataService.GetMasterProceduresNew(param).then(function (response) {
                        console.log(response);
                        if (response.data.Status == "Success") {
                            var array = response.data.rows || [];
                            if (response.data.rows !== undefined) {
                                return response.data.rows.map(function (item) {
                                    return item;
                                });
                            }
                        }
                    });
                };
                $scope.onSelectCptCodeProcedure = function (Obj, MainObj) {
                    MainObj.ProcedureObj = "";
                    MainObj.OrganizationProcedureId = 0;
                    MainObj.ProcedureId = Obj.ProcedureId;
                    MainObj.CptcodeObj = Obj.CPTCode + '-' + Obj.ProcedureName;
                };
                $scope.ChangeCptCodeProcedure = function (MainObj) {
                    MainObj.ProcedureId = 0;
                    MainObj.ProcedureObj = "";
                    MainObj.OrganizationProcedureId = 0;
                };


                $scope.SaveFeeDetails = function () {

                    if ($scope.PayorProcedureFeeObj.OrganizationPayorId == 0) {
                        alertify.error("Please Select Payor");
                        return false;
                    }
                    if ($scope.PayorProcedureFeeObj.OrganizationProcedureId == 0) {
                        alertify.error("Please Select Procedure");
                        return false;
                    }
                    if ($scope.PayorProcedureFeeObj.ProcedureId == 0) {
                        alertify.error("Please Select CPT Code");
                        return false;
                    }
                    if ($scope.PayorProcedureFeeObj.ActualCost == "") {
                        alertify.error("Please Enter Actual");
                        return false;
                    }
                    if ($scope.PayorProcedureFeeObj.InFacilityActualCost == "") {
                        alertify.error("Please Enter Facility Actual");
                        return false;
                    }
                    if ($scope.PayorProcedureFeeObj.OfficeActualCost == "") {
                        alertify.error("Please Enter Office ActualCost");
                        return false;
                    }

                    // console.log(JSON.stringify($scope.PayorProcedureFeeObj));

                    eHnoteSettingsDataService.AddUpdateOrganizationPayorProcedureFee($scope.PayorProcedureFeeObj).then(function (response) {
                        if (response.data.status == "Success") {
                            if ($scope.PayorProcedureFeeObj.OrganizationProcedurePayorId == 0) {
                                alertify.success('Payor Fee Added Successfully');
                            } else {
                                alertify.success('Payor Fee Updated Successfully');
                            }
                            $scope.PayorProcedureFeeObj = GetPayorProcedureFeeObj();
                            $uibModalInstance.close("Close");
                        } else {
                            alertify.error(response.data.Message);
                        }
                    }, function (error) {

                    });
                }

                $scope.ClearDetails = function () {
                    $scope.PayorProcedureFeeObj = GetPayorProcedureFeeObj();
                };








                $scope.createfeeuibclose = function () {
                    $uibModalInstance.dismiss("cancel");
                };
            }
        });

        $scope.mInstanceAdd.result.then(function (resp) {
            console.log(resp);
            if (resp == "Close") {
                $scope.RateListObj = GetRateListObj();
                // $scope.GetPayorProcedureFee(1);
                $scope.RateList = [];
            }
        }, function (cancel) {
            console.log(cancel);
        });
    }

    $scope.GetPlanDetailsObjectNew = function () {
        var obj = {
            "UserId": $scope.UserId,
            "OrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "OrganizationPlanId": 0,
            "OrganizationPayorId": 0,
            "PayorId": 0,
            "PlanId": 0,
            "PlanName": "",
            "PlanCode": "",
            "PlanDescription": "",
            "ReformaReferralRequired": false,
            "IsFixedCopay": false,
            "FixedCopayAmount": 0,
            "IsAnnualDeduction": false,
            "AnnualDeductionAmount": 0,
            "WaitingPeriodApply": false,
            "WaitingPeriodDays": "",
            "IsCoverWithMedicaidFunds": false,
            "MedicareComplementary": false,
            "CoverComplementaryAnnualDeduction": false,
            "CopaymentByProcedureGroup": false,
            "CopaymentAmountByProcedureGroup": 0,
            "ShowNotesAsAlerts": false,
            "Remarks": "",
            "ProcedureGroup": "",
            "GeneralCostValue": "",
            "GeneralValueType": "A",
            "SpecialistCostvalue": "",
            "SpecialistValueType": "A",
            "SubSpecialistCostvalue": "",
            "SubSpecialistValueType": "A",
            "LabCostValue": "",
            "LabValueType": "A",
            "RxCostValue": "",
            "RxValueType": "A",
            "PdxCostValue": "",
            "PdxValueType": "A",
            "EmergencyCostValue": "",
            "EmergencyValueType": "A",
            "OtherCostValue": "",
            "OtherValueType": "A",
            "IOLCostValue": "",
            "IOLValueType": "A",
            "OpticalCostValue": "",
            "OpticalValueType": "A",
            "RefractionCostValue": "",
            "RefractionValueType": "A",
            "MedicalCostValue": "",
            "MedicalValueType": "A",
            "TejidCostValue": "",
            "TejidValueType": "A",
            "TP6CostValue": "",
            "TP6ValueType": "A",
            "TP7CostValue": "",
            "TP7ValueType": "A",
            "CQMCostValue": "",
            "CQMValueType": "A",
            "IsActive": true,
            "DeleteInd": "N",
            "PayorObj": "",
            "PlanTypeId": 0,
            "Procedures": "",
            "CreatedDt": "",
            "ModifiedDt": "",
            "CurrentDate": $filter("date")(new Date(), "MM-dd-yyyy"),
        }
        return obj;
    };
    $scope.PlanDetailsObjectNew = $scope.GetPlanDetailsObjectNew();

    $scope.SearchPayorListByText = function (SearchText) {
        var param = {
            "SearchText": SearchText || "",
            "Status": "Active",
            "PageSize": 10,
            "PageNumber": 1,
            "UserId": $scope.UserId,
            "SpecializationId": $scope.SpecializationId,
            "OrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "ParentOrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
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

    $scope.AddUpdateOrganizationPlans = function () {

        if ($scope.PlanDetailsObjectNew.OrganizationPayorId == 0) {
            alertify.error("Please Select Payor");
            return false;
        }
        if ($scope.PlanDetailsObjectNew.PlanTypeId == 0) {
            alertify.error("Please Select Plan Type");
            return false;
        }
        if ($scope.PlanDetailsObjectNew.PlanCode == "") {
            alertify.error("Please Enter Plan Code");
            return false;
        }
        if ($scope.PlanDetailsObjectNew.PlanName == "") {
            alertify.error("Please Enter Plan Name");
            return false;
        }

        $scope.PlanDetailsObjectNew.GeneralCostValue = parseFloat($scope.PlanDetailsObjectNew.GeneralCostValue) || 0;
        $scope.PlanDetailsObjectNew.SpecialistCostvalue = parseFloat($scope.PlanDetailsObjectNew.SpecialistCostvalue) || 0;
        $scope.PlanDetailsObjectNew.SubSpecialistCostvalue = parseFloat($scope.PlanDetailsObjectNew.SubSpecialistCostvalue) || 0;
        $scope.PlanDetailsObjectNew.LabCostValue = parseFloat($scope.PlanDetailsObjectNew.LabCostValue) || 0;
        $scope.PlanDetailsObjectNew.RxCostValue = parseFloat($scope.PlanDetailsObjectNew.RxCostValue) || 0;
        $scope.PlanDetailsObjectNew.PdxCostValue = parseFloat($scope.PlanDetailsObjectNew.PdxCostValue) || 0;
        $scope.PlanDetailsObjectNew.EmergencyCostValue = parseFloat($scope.PlanDetailsObjectNew.EmergencyCostValue) || 0;
        $scope.PlanDetailsObjectNew.OtherCostValue = parseFloat($scope.PlanDetailsObjectNew.OtherCostValue) || 0;
        $scope.PlanDetailsObjectNew.IOLCostValue = parseFloat($scope.PlanDetailsObjectNew.IOLCostValue) || 0;
        $scope.PlanDetailsObjectNew.OpticalCostValue = parseFloat($scope.PlanDetailsObjectNew.OpticalCostValue) || 0;
        $scope.PlanDetailsObjectNew.RefractionCostValue = parseFloat($scope.PlanDetailsObjectNew.RefractionCostValue) || 0;
        $scope.PlanDetailsObjectNew.MedicalCostValue = parseFloat($scope.PlanDetailsObjectNew.MedicalCostValue) || 0;
        $scope.PlanDetailsObjectNew.TejidCostValue = parseFloat($scope.PlanDetailsObjectNew.TejidCostValue) || 0;
        $scope.PlanDetailsObjectNew.TP6CostValue = parseFloat($scope.PlanDetailsObjectNew.TP6CostValue) || 0;
        $scope.PlanDetailsObjectNew.TP7CostValue = parseFloat($scope.PlanDetailsObjectNew.TP7CostValue) || 0;
        $scope.PlanDetailsObjectNew.CQMCostValue = parseFloat($scope.PlanDetailsObjectNew.CQMCostValue) || 0;
        $scope.PlanDetailsObjectNew.AnnualDeductionAmount = parseFloat($scope.PlanDetailsObjectNew.AnnualDeductionAmount) || 0;
        $scope.PlanDetailsObjectNew.CopaymentAmountByProcedureGroup = parseFloat($scope.PlanDetailsObjectNew.CopaymentAmountByProcedureGroup) || 0;
        $scope.PlanDetailsObjectNew.FixedCopayAmount = parseFloat($scope.PlanDetailsObjectNew.FixedCopayAmount) || 0;


        $scope.PlanDetailsObjectNew.ParentOrganizationId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,

        eHnoteInsuranceService.AddUpdateOrganizationPayorPlan($scope.PlanDetailsObjectNew, callbackresponseforplan, callbackerrorforplan);
        function callbackresponseforplan(resp) {
            if (resp.status == "Failure") {
                alertify.error(resp.Message);
            }
            if (resp.status === "Success") {
                if ($scope.PlanDetailsObjectNew.OrganizationPlanId == 0) {
                    alertify.success('Plan Added Successfully');
                } else {
                    alertify.success('Plan Updated Successfully');
                }
                var l = resp;
                $scope.PlanDetailsObjectNew = $scope.GetPlanDetailsObjectNew();
                $scope.GetOrganizationPayorPlansList(1);
            }
        }
        function callbackerrorforplan(err) {
            alertify.error("Some Error Occurred");
        }
    };

    $scope.onSelectOrganizationPayor = function (planobj, mainplanobj) {
        if (planobj != undefined) {
            mainplanobj.PayorId = planobj.PayorId;
            mainplanobj.OrganizationPayorId = planobj.OrganizationPayorId;
            mainplanobj.OrganizationPayorName = planobj.OrganizationPayorName;
            mainplanobj.PayorObj = planobj.GlobalPayorId + '-' + planobj.MasterPayorName;
        }
    };
    $scope.ChangeOrganizationPayor = function (mainplanobj) {
        mainplanobj.PayorId = 0;
        mainplanobj.OrganizationPayorId = 0;
        mainplanobj.OrganizationPayorName = "";
    };

    $scope.ChangeCopaymentofprocedure = function (type) {
        if (type == "Gen") {
            $scope.PlanDetailsObjectNew.GeneralCostValue = $scope.PlanDetailsObjectNew.GeneralCostValue || "";
        } else if (type == "Spslt") {
            $scope.PlanDetailsObjectNew.SpecialistCostvalue = $scope.PlanDetailsObjectNew.SpecialistCostvalue || "";
        }
        else if (type == "Sub") {
            $scope.PlanDetailsObjectNew.SubSpecialistCostvalue = $scope.PlanDetailsObjectNew.SubSpecialistCostvalue || "";
        }
        else if (type == "Lab") {
            $scope.PlanDetailsObjectNew.LabCostValue = $scope.PlanDetailsObjectNew.LabCostValue || "";
        }
        else if (type == "Rx") {
            $scope.PlanDetailsObjectNew.RxCostValue = $scope.PlanDetailsObjectNew.RxCostValue || "";
        }
        else if (type == "P.Dx") {
            $scope.PlanDetailsObjectNew.PdxCostValue = $scope.PlanDetailsObjectNew.PdxCostValue || "";
        }
        else if (type == "Emg") {
            $scope.PlanDetailsObjectNew.EmergencyCostValue = $scope.PlanDetailsObjectNew.EmergencyCostValue || "";
        }
        else if (type == "Other") {
            $scope.PlanDetailsObjectNew.OtherCostValue = $scope.PlanDetailsObjectNew.OtherCostValue || "";
        }
        else if (type == "IOl") {
            $scope.PlanDetailsObjectNew.IOLCostValue = $scope.PlanDetailsObjectNew.IOLCostValue || "";
        }
        else if (type == "Optic") {
            $scope.PlanDetailsObjectNew.OpticalCostValue = $scope.PlanDetailsObjectNew.OpticalCostValue || "";
        }
        else if (type == "Refra") {
            $scope.PlanDetailsObjectNew.RefractionCostValue = $scope.PlanDetailsObjectNew.RefractionCostValue || "";
        }
        else if (type == "Medic") {
            $scope.PlanDetailsObjectNew.MedicalCostValue = $scope.PlanDetailsObjectNew.MedicalCostValue || "";
        }
        else if (type == "Tejid") {
            $scope.PlanDetailsObjectNew.TejidCostValue = $scope.PlanDetailsObjectNew.TejidCostValue || "";
        }
        else if (type == "TP-6") {
            $scope.PlanDetailsObjectNew.TP6CostValue = $scope.PlanDetailsObjectNew.TP6CostValue || "";
        }
        else if (type == "TP-7") {
            $scope.PlanDetailsObjectNew.TP7CostValue = $scope.PlanDetailsObjectNew.TP7CostValue || "";
        }
        else if (type == "CQM") {
            $scope.PlanDetailsObjectNew.CQMCostValue = $scope.PlanDetailsObjectNew.CQMCostValue || "";
        }
    };

    $scope.ClearInsuranceNew = function () {
        $scope.PlanDetailsObjectNew = $scope.GetPlanDetailsObjectNew();
        $scope.Isdisbled = false;

    };
    function getpayorPlanslistObj() {
        var obj = {
            "BranchObj": $filter("filter")($scope.AllUserBranchesList, { "ClinicId": $scope.HospitalId }, true)[0],
            "SearchText": "",
            "PageSize": 10,
            "PageNumber": 1,
            "GetAllIndicator": 0,
            "PayorId": 0,
            "OrganizationPayorId": 0,
            "TotalCount": 0,
            "PayorObj": ""
        }
        return obj;
    }

    $scope.payorPlansListObj = getpayorPlanslistObj();
    $scope.payorPlansListArray = [];
    $scope.GetOrganizationPayorPlansList = function (page) {
        if (page == 1) {
            $scope.payorPlansListObj.PageNumber = 1;
        }
        var param = {
            "OrganizationId": $scope.payorPlansListObj.BranchObj.BranchId || 0,
            "SearchText": $scope.payorPlansListObj.SearchText || "",
            "PageSize": $scope.payorPlansListObj.PageSize || 10,
            "PageNumber": $scope.payorPlansListObj.PageNumber || 1,
            "GetAllIndicator": 0,
            // "PayorId": $scope.payorPlansListObj.PayorId || 0,
            "OrganizationPayorId": $scope.payorPlansListObj.OrganizationPayorId || 0,
            "Status": 0,  // All - 0, Active - 1, InActive -2
            "ParentOrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
        };
        eHnoteInsuranceService.GetOrganizationPayorPlansList(param).then(function (resp) {

            $scope.payorPlansListArray = [];
            if (resp.data.Status === "Success") {
                $scope.payorPlansListArray = resp.data.rows || [];
                angular.forEach($scope.payorPlansListArray, function (item) {
                    item.CreatedDt = $filter('date')(item.CreatedDt, 'MM-dd-yyyy');
                    item.ModifiedDt = $filter('date')(item.ModifiedDt, 'MM-dd-yyyy');
                });
                $scope.payorPlansListObj.TotalCount = resp.data.count;
            }
        }, function (error) {
            console.log(error);
        });
    };
    $scope.clearOrgInvSearch = function () {
        $scope.payorPlansListObj = getpayorPlanslistObj();
        $scope.GetOrganizationPayorPlansList(1);
    };
    $scope.getModifier = function () {
        var val = "";
        eHnoteSettingsDataService.GetMasterModifiers(val).then(function (response) {
            $scope.ModifierList = response.data.rows || [];
        });

    };

    function GetRateListObj() {
        var obj = {
            "OrganizationId": $scope.HospitalId,
            "OrganizationPayorId": 0,
            "CPTCODE": "",
            "ProcedureName": "",
            "PayorObj": "",
            //  "CptcodeObj": "",
            //  "Procedureobj": "",
            "PageNumber": 1,
            "PageSize": 100,
            "TempCount": 0,
            "OrganizationPayorName": "",
            "IsShowGeneral": false
        };
        return obj;
    }
    $scope.RateListObj = GetRateListObj();
    $scope.RateList = [];
    $scope.GetPayorProcedureFee = function (click) {
        if (click == 1) {
            $scope.RateListObj.PageNumber = 1;
        }
        if ($scope.RateListObj.IsShowGeneral == false && $scope.RateListObj.OrganizationPayorId == 0) {
            $scope.RateList = [];
            return;
        }

        var req = {
            "OrganizationId": $scope.HospitalId,
            "OrganizationPayorId": $scope.RateListObj.OrganizationPayorId,
            "CPTCODE": $scope.RateListObj.CPTCODE || "",
            "ProcedureName": $scope.RateListObj.ProcedureName || "",
            "PageNumber": $scope.RateListObj.PageNumber || 1,
            "PageSize": $scope.RateListObj.PageSize || 10,
            "Status": 0   // All - 0, Active - 1, InActive -2
        };

        eHnoteSettingsDataService.GetOrganizationPayorProcedureFees(req).then(function (response) {
            if (response.data.Status === "Success") {
                $scope.RateList = response.data.rows;
                $scope.RateListObj.TempCount = response.data.count;
            } else {
                alertify.error(response.data.Message);
            }
        }, function (error) {

        });
    };
    $scope.CancelPayorProcedureFee = function () {
        $scope.RateListObj = GetRateListObj();
        // $scope.GetPayorProcedureFee(1);
        $scope.RateList = [];
    };


    $scope.addUpdatePayorDetails = function () {

        if ($scope.addNewPayorObject.PayorId === 0) {
            alertify.error("Select Payor ID");
            return false;
        }
        $scope.addNewPayorObject.PayorTypeId = $scope.addNewPayorObject.PayorTypeId || 0;
        if ($scope.addNewPayorObject.PayorTypeId === 0) {
            alertify.error("Select Payor Type");
            return false;
        }
        if ($scope.addNewPayorObject.PayorCode === "") {
            alertify.error("Please Enter Payor Code");
            return false;
        }
        if ($scope.addNewPayorObject.PayorName === "") {
            alertify.error("Please Enter Payor Name");
            return false;
        }
        $scope.addNewPayorObject.ContactPersonName = $scope.addNewPayorObject.ContactPersonName || '';
        //if ($scope.addNewPayorObject.ContactPersonName === "") {
        //    alertify.error("Enter Payor Contact PersonName");
        //    return false;
        //}
        //if ($scope.addNewPayorObject.ContactPersonNumber == "" || $scope.addNewPayorObject.ContactPersonNumber == undefined) {
        //    alertify.error("Please Enter Primary Contact");
        //    return false;
        //}
        //if ($scope.addNewPayorObject.ContactPersonNumber.length < 10) {
        //    alertify.error("Please Enter Valid Primary Contact");
        //    return false;
        //}
        //if ($scope.addNewPayorObject.AlternateContactPersonNumber === "" || $scope.addNewPayorObject.AlternateContactPersonNumber === undefined) {
        //    alertify.error("Please Enter Alternate Contact");
        //    return false;
        //}
        //if ($scope.addNewPayorObject.AlternateContactPersonNumber.length < 10) {
        //    alertify.error("Please Enter Valid Alternate Contact");
        //    return false;
        //}
        $scope.addNewPayorObject.PayorContactPersonEmailId = $scope.addNewPayorObject.PayorContactPersonEmailId || "";
        //if ($scope.addNewPayorObject.PayorContactPersonEmailId == "") {
        //    alertify.error("Invalid Email ID");
        //    return false;
        //}

        if ($scope.addNewPayorObject.Address1 == "") {
            alertify.error("Enter Address Line 1");
            return false;
        }
        //if ($scope.addNewPayorObject.Address2 == "") {
        //    alertify.error("Enter Address Line 2");
        //    return false;
        //}
        if ($scope.addNewPayorObject.ZipCode == "") {
            alertify.error("Enter ZipCode");
            return false;
        }
        $scope.addNewPayorObject.StateId = $scope.addNewPayorObject.StateId || 0;
        if ($scope.addNewPayorObject.StateId == 0) {
            alertify.error("Select State");
            return false;
        }
        $scope.addNewPayorObject.CityId = $scope.addNewPayorObject.CityId || 0;
        if ($scope.addNewPayorObject.CityId == 0) {
            alertify.error("Enter City");
            return false;
        }


        $scope.addNewPayorObject.LCDContractTypeId = $scope.addNewPayorObject.LCDContractTypeId || 0;
        $scope.addNewPayorObject.PayorSubmitShowingId = $scope.addNewPayorObject.PayorSubmitShowingId || 0;
        $scope.addNewPayorObject.PayorSubmitOtherShowingId = $scope.addNewPayorObject.PayorSubmitOtherShowingId || 0;
        $scope.addNewPayorObject.ProfessionalFormId = $scope.addNewPayorObject.ProfessionalFormId || 0;
        $scope.addNewPayorObject.InstitutionalFormId = $scope.addNewPayorObject.InstitutionalFormId || 0;
        $scope.addNewPayorObject.DentalFormId = $scope.addNewPayorObject.DentalFormId || 0;
        $scope.addNewPayorObject.SurgeryReasonUnitId = $scope.addNewPayorObject.SurgeryReasonUnitId || 0;
        $scope.addNewPayorObject.AnesthesiaUnitId = $scope.addNewPayorObject.AnesthesiaUnitId || 0;
        $scope.addNewPayorObject.RVUOPDAmount = $scope.addNewPayorObject.RVUOPDAmount || 0;
        $scope.addNewPayorObject.RVUIPDAmount = $scope.addNewPayorObject.RVUIPDAmount || 0;
        $scope.addNewPayorObject.SurgeryMinimumAmount = $scope.addNewPayorObject.SurgeryMinimumAmount || 0;

        $scope.addNewPayorObject.Box4Value1 = $scope.addNewPayorObject.Box4Value1 || '';
        $scope.addNewPayorObject.Box4Value2 = $scope.addNewPayorObject.Box4Value2 || '';
        $scope.addNewPayorObject.Box4ValueId2 = $scope.addNewPayorObject.Box4ValueId2 || null;
        $scope.addNewPayorObject.Box4Value3 = $scope.addNewPayorObject.Box4Value3 || '';
        $scope.addNewPayorObject.Box4ValueId3 = $scope.addNewPayorObject.Box4ValueId3 || null;
        $scope.addNewPayorObject.Box4Value4 = $scope.addNewPayorObject.Box4Value4 || '';
        $scope.addNewPayorObject.Box4ValueId4 = $scope.addNewPayorObject.Box4ValueId4 || null;

        $scope.addNewPayorObject.Box14ValueId = $scope.addNewPayorObject.Box14ValueId || null;
        $scope.addNewPayorObject.Box14Value = $scope.addNewPayorObject.Box14Value || "";
        $scope.addNewPayorObject.Box14ValueCode = $scope.addNewPayorObject.Box14ValueCode || 0;

        $scope.addNewPayorObject.Box15ValueId = $scope.addNewPayorObject.Box15ValueId || null;
        $scope.addNewPayorObject.Box15Value = $scope.addNewPayorObject.Box15Value || "";
        $scope.addNewPayorObject.Box15ValueCode = $scope.addNewPayorObject.Box15ValueCode || 0;

        $scope.addNewPayorObject.Box79Value = $scope.addNewPayorObject.Box79Value || "";
        $scope.addNewPayorObject.Box79ValueId = $scope.addNewPayorObject.Box79ValueId || null;
        $scope.addNewPayorObject.Box79ValueNPI = $scope.addNewPayorObject.Box79ValueNPI || null;
        $scope.addNewPayorObject.Box79Type = $scope.addNewPayorObject.Box79Type || "";
        $scope.addNewPayorObject.Box79TypeId = $scope.addNewPayorObject.Box79TypeId || "";

        $scope.addNewPayorObject.Box76Type = $scope.addNewPayorObject.Box76Type || "";
        $scope.addNewPayorObject.Box76TypeId = $scope.addNewPayorObject.Box76TypeId || "";

        $scope.addNewPayorObject.Box77Type = $scope.addNewPayorObject.Box77Type || "";
        $scope.addNewPayorObject.Box77TypeId = $scope.addNewPayorObject.Box77TypeId || "";

        $scope.addNewPayorObject.Box78Type = $scope.addNewPayorObject.Box78Type || "";
        $scope.addNewPayorObject.Box78TypeId = $scope.addNewPayorObject.Box78TypeId || "";

        $scope.addNewPayorObject.IsBox80Checked = $scope.addNewPayorObject.IsBox80Checked || false;
        $scope.addNewPayorObject.Box80Value = $scope.addNewPayorObject.Box80Value || "";
        $scope.addNewPayorObject.ParentOrganizationId = $scope.addNewPayorObject.ParentOrganizationId;
        $scope.addNewPayorObject.OrganizationId = $scope.HospitalId;

        if ($scope.addNewPayorObject.OrganizationId != 0) {
            $scope.addNewPayorObject.GetAllIndicator = 0;
        } else if ($scope.addNewPayorObject.OrganizationId == 0) {
            $scope.addNewPayorObject.GetAllIndicator = 1;
        }


        eHnoteInsuranceService.AddUpdateOrganizationPayor($scope.addNewPayorObject, callbackfileuploadSuccess, callbackfileuploadError);
        function callbackfileuploadSuccess(resp) {
            if (resp.status === "Success") {
                if ($scope.addNewPayorObject.OrganizationPayorId == 0) {
                    alertify.success('Payor Added Successfully');
                    $scope.closeAddedPayor();
                } else {
                    alertify.success('Payor Updated Successfully');
                    $scope.closeAddedPayor();
                }
                var l = resp;
                $scope.addNewPayorObject = $scope.GetAddNewInsurancePayorObject();
                $scope.Patientselectdata = getSelectedPatientData();
                $scope.Search.InsuranceHospitalTxt = "";
                //$scope.payorTypesobject.value = "";
                //$scope.GetOrganizationPayorAllList();
                $scope.getOrganizationInsurancePayorsList(1);
            } else if (resp.status === "Failure") {
                alertify.error(resp.Message);
            } else {
                alertify.error("Some Error Occurred");
            }

        }
        function callbackfileuploadError(err) {
            alertify.error("Some Error Occurred");
        }
    };

    $scope.EditPayorDetails = function (item) {
        $scope.payourFocus = true;
        $scope.addedPayor = true;
        $scope.addNewPayorObject = $scope.GetAddNewInsurancePayorObject();

        $scope.addNewPayorObject.OrganizationPayorId = item.OrganizationPayorId;
        $scope.addNewPayorObject.PayorTypeId = item.PayorTypeId;
        $scope.addNewPayorObject.PayorId = item.PayorId;
        $scope.addNewPayorObject.PayorName = item.PayorName;
        $scope.addNewPayorObject.PayorObject = item.MasterPayorName || "";
        $scope.addNewPayorObject.PayorCode = item.PayorCode;
        $scope.addNewPayorObject.BranchObj = $filter("filter")($scope.AllUserBranchesList, { "ClinicId": item.OrganizationId }, true)[0];
        $scope.addNewPayorObject.OrganizationId = item.OrganizationId;
        $scope.addNewPayorObject.IsActive = item.IsActive;
        $scope.addNewPayorObject.SubmitInsuranceEligibilityElectronically = item.SubmitInsuranceEligibilityElectronically;
        $scope.addNewPayorObject.LCDContractTypeId = item.LCDContractTypeId || "";
        $scope.addNewPayorObject.PayorSubmitShowingId = item.PayorSubmitShowingId || "";
        $scope.addNewPayorObject.PayorSubmitOtherShowingId = item.PayorSubmitOtherShowingId || "";
        $scope.addNewPayorObject.ProfessionalFormId = item.ProfessionalFormId || "";
        $scope.addNewPayorObject.InstitutionalFormId = parseInt(item.InstitutionalFormId)  || "";
        $scope.addNewPayorObject.DentalFormId = item.DentalFormId || 0;
        $scope.addNewPayorObject.SurgeryReasonUnitId = item.SurgeryReasonUnitId || "";
        $scope.addNewPayorObject.AnesthesiaUnitId = item.AnesthesiaUnitId || "";
        $scope.addNewPayorObject.RVUOPDAmount = item.RVUOPDAmount || "";
        $scope.addNewPayorObject.RVUIPDAmount = item.RVUIPDAmount || "";
        $scope.addNewPayorObject.SurgeryMinimumAmount = item.SurgeryMinimumAmount || "";

        $scope.addNewPayorObject.Address1 = item.Address1 || "";
        $scope.addNewPayorObject.Address2 = item.Address2 || "";
        $scope.addNewPayorObject.CityId = item.CityId;
        $scope.addNewPayorObject.StateId = item.StateId;
        $scope.addNewPayorObject.CountryId = item.CountryId;
        $scope.addNewPayorObject.ZipCode = item.ZipCode || "";
        $scope.addNewPayorObject.Notes = item.Notes || "";
        $scope.addNewPayorObject.Fax = item.Fax || "";
        $scope.addNewPayorObject.Website = item.Website || "";

        $scope.addNewPayorObject.ContactPersonName = item.ContactPersonName || "";
        $scope.addNewPayorObject.ContactPersonNumber = item.ContactPersonNumber || "";
        $scope.addNewPayorObject.ContactNumber = item.ContactNumber || "";
        $scope.addNewPayorObject.ContactNumberAreaCode = item.ContactNumberAreaCode || "";
        $scope.addNewPayorObject.ContactNumberCountryCode = item.ContactNumberCountryCode || "";
        $scope.addNewPayorObject.AlternateContactPersonNumber = item.AlternateContactPersonNumber || "";
        $scope.addNewPayorObject.AlternateContactNumber = item.AlternateContactNumber || "";
        $scope.addNewPayorObject.AlternateContactNumberAreaCode = item.AlternateContactNumberAreaCode || "";
        $scope.addNewPayorObject.AlternateContactNumberCountryCode = item.AlternateContactNumberCountryCode || "";
        $scope.addNewPayorObject.PayorContactPersonEmailId = item.PayorContactPersonEmailId || "";
        $scope.addNewPayorObject.AgreementFilesArray = item.AgreementFilesArray || [];

        $scope.addNewPayorObject.UsePrivateFeeOnClaims = item.UsePrivateFeeOnClaims;
        $scope.addNewPayorObject.SignatureOnPatientFile = item.SignatureOnPatientFile;
        $scope.addNewPayorObject.SubmitClaimsElectronically = item.SubmitClaimsElectronically;
        $scope.addNewPayorObject.IsMedicateOrAdvantage = item.IsMedicateOrAdvantage;
        $scope.addNewPayorObject.SecondaryIdRequired = item.SecondaryIdRequired;
        $scope.addNewPayorObject.PrintPostalAddressinField = item.PrintPostalAddressinField;
        $scope.addNewPayorObject.UseMedicareLCDRules = item.UseMedicareLCDRules;
        $scope.addNewPayorObject.IsIncludeBillingProviderNPIInEDI = item.IsIncludeBillingProviderNPIInEDI || false;
        $scope.addNewPayorObject.IsIncludeRenderingProviderNPIInEDI = item.IsIncludeRenderingProviderNPIInEDI||false;
        $scope.addNewPayorObject.IsIncludeFacilityNPIInEDI = item.IsIncludeFacilityNPIInEDI||false;     
        $scope.addNewPayorObject.SendNDC = item.SendNDC;
        $scope.addNewPayorObject.SurgerySecondProcedure = item.SurgerySecondProcedure || "";
        $scope.addNewPayorObject.SurgeryThirdProcedure = item.SurgeryThirdProcedure || "";
        $scope.addNewPayorObject.ClaimFilingLimitDays = item.ClaimFilingLimitDays || "";
        $scope.addNewPayorObject.AdjustmentFilingLimitDays = item.AdjustmentFilingLimitDays || "";
        $scope.addNewPayorObject.ProffesionalPayerId = item.ProffesionalPayerId || "";
        $scope.addNewPayorObject.InstitutionalPayerId = item.InstitutionalPayerId || "";
        $scope.addNewPayorObject.EligibilityPayerId = item.EligibilityPayerId || "";

        $scope.addNewPayorObject.Box4Value2 = item.Box4Value2 || "";
        $scope.addNewPayorObject.Box4ValueId2 = item.Box4ValueId2 || null;
        $scope.addNewPayorObject.Box4Value3 = item.Box4Value3 || "";
        $scope.addNewPayorObject.Box4ValueId3 = item.Box4ValueId3 || null;
        $scope.addNewPayorObject.Box4Value4 = item.Box4Value4 || "";
        $scope.addNewPayorObject.Box4ValueId4 = item.Box4ValueId4 || null;
        $scope.addNewPayorObject.Box14Value = item.Box14Value || "";
        $scope.addNewPayorObject.Box14ValueId = item.Box14ValueId || null;
        $scope.addNewPayorObject.Box14ValueCode = item.Box14ValueCode || null;
        $scope.addNewPayorObject.Box15Value = item.Box15Value || "";
        $scope.addNewPayorObject.Box15ValueId = item.Box15ValueId || null;
        $scope.addNewPayorObject.Box15ValueCode = item.Box15ValueCode || null;
        $scope.addNewPayorObject.Box79Type = item.Box79Type || "";
        $scope.addNewPayorObject.Box79TypeId = item.Box79TypeId || "";
        $scope.addNewPayorObject.Box78Type = item.Box78Type || "";
        $scope.addNewPayorObject.Box78TypeId = item.Box78TypeId || "";
        $scope.addNewPayorObject.Box79Value = item.Box79Value || "";
        $scope.addNewPayorObject.Box79ValueId = item.Box79ValueId || "";
        $scope.addNewPayorObject.Box79ValueNPI = item.Box79ValueNPI || "";
        $scope.addNewPayorObject.IsBox80Checked = item.IsBox80Checked || false;
        $scope.addNewPayorObject.Box80Value = item.Box80Value || "";

        $scope.addNewPayorObject.Box76Type = item.Box76Type || "";
        $scope.addNewPayorObject.Box76TypeId = item.Box76TypeId || "";
        $scope.addNewPayorObject.Box77Type = item.Box77Type || "";
        $scope.addNewPayorObject.Box77TypeId = item.Box77TypeId || ""; 

        $scope.Patientselectdata.SelectTypeId = $scope.addNewPayorObject.Box79TypeId || '';

        $scope.changegetCitiesByState($scope.addNewPayorObject.StateId);
    };

    $scope.ClearPayordetails = function () {
        $scope.addNewPayorObject = $scope.GetAddNewInsurancePayorObject();
        $scope.Patientselectdata = getSelectedPatientData();
        $scope.Search.InsuranceHospitalTxt = "";
        $scope.payorTypesobject.value = "";
    };

    $scope.ChangesActiveStatusForPayor = function (item, active) {

        var obj = {
            "UserId": $scope.UserId,
            "OrganizationId": item.OrganizationId,
            "OrganizationPayorId": item.OrganizationPayorId,
            "IsActive": active,
        };
        eHnoteInsuranceService.UpdateActiveStatusForPayors(obj).then(function (resp) {
            console.log(resp);
            if (resp.data.status === "Success") {
                item.IsActive = active;
            }
        }, function (error) {
            console.log(error);
        });
    }
    $scope.ChangesActiveStatusForPlan = function (item, active) {
        var obj = {
            "UserId": $scope.UserId,
            "OrganizationId": item.OrganizationId,
            "OrganizationPlanId": item.OrganizationPlanId,
            "IsActive": active,
        };
        eHnoteInsuranceService.UpdateActiveStatusForPlans(obj).then(function (resp) {
            console.log(resp);
            if (resp.data.status === "Success") {
                item.IsActive = active;
            }
            if (item.IsActive == true) {
                alertify.success("Plan Activated Successfully");
            }
            else {
                alertify.success("Plan In-Activated Successfully");
            }
        }, function (error) {
            console.log(error);
        });
    }
    $scope.ChangesActiveStatusForFee = function (item, active) {
        var obj = {
            "UserId": $scope.UserId,
            "OrganizationId": item.OrganizationId,
            "OrganizationProcedurePayorId": item.OrganizationProcedurePayorId,
            "IsActive": active,
        };
        eHnoteInsuranceService.UpdateActiveStatusForPayorProcedureFees(obj).then(function (resp) {
            console.log(resp);
            if (resp.data.status === "Success") {
                item.IsActive = active;
            }
        }, function (error) {
            console.log(error);
        });
    }

    $scope.EditHealthPlans = function (item) {
        $scope.healthPlansFocus = true;
        $scope.Isdisbled = false;
        $scope.addedNewPlan = true;
        $scope.PlanDetailsObjectNew.HospitalObj = $filter("filter")($scope.AllUserBranchesList, { "ClinicId": item.OrganizationId }, true)[0];
        $scope.PlanDetailsObjectNew.PayorId = item.PayorId;
        $scope.PlanDetailsObjectNew.PayorObj = item.GlobalPayorId+'-' +item.PayorName;
        $scope.PlanDetailsObjectNew.OrganizationPayorId = item.OrganizationPayorId;
        $scope.PlanDetailsObjectNew.OrganizationPlanId = item.OrganizationPlanId;
        $scope.PlanDetailsObjectNew.PayorTypeId = item.PayorTypeId;
        $scope.PlanDetailsObjectNew.PlanCode = item.PlanCode;
        $scope.PlanDetailsObjectNew.PlanTypeId = item.PlanTypeId;
        $scope.PlanDetailsObjectNew.PlanId = item.PlanId;
        $scope.PlanDetailsObjectNew.PlanName = item.PlanName;

        $scope.PlanDetailsObjectNew.Procedures = item.Procedures;

        $scope.PlanDetailsObjectNew.MedicareComplementary = item.MedicareComplementary;
        $scope.PlanDetailsObjectNew.ReformaReferralRequired = item.ReformaReferralRequired;
        $scope.PlanDetailsObjectNew.IsFixedCopay = item.IsFixedCopay;
        $scope.PlanDetailsObjectNew.FixedCopayAmount = item.FixedCopayAmount || 0;
        $scope.PlanDetailsObjectNew.IsAnnualDeduction = item.IsAnnualDeduction;
        $scope.PlanDetailsObjectNew.AnnualDeductionAmount = item.AnnualDeductionAmount || 0;
        $scope.PlanDetailsObjectNew.IsCoverWithMedicaidFunds = item.IsCoverWithMedicaidFunds;
        $scope.PlanDetailsObjectNew.CoverComplementaryAnnualDeduction = item.CoverComplementaryAnnualDeduction;
        $scope.PlanDetailsObjectNew.CopaymentByProcedureGroup = item.CopaymentByProcedureGroup;
        $scope.PlanDetailsObjectNew.CopaymentAmountByProcedureGroup = item.CopaymentAmountByProcedureGroup||0;
        $scope.PlanDetailsObjectNew.WaitingPeriodApply = item.WaitingPeriodApply;
        $scope.PlanDetailsObjectNew.WaitingPeriodDays = item.WaitingPeriodDays || "";

        $scope.PlanDetailsObjectNew.GeneralCostValue = item.GeneralCostValue || 0;
        $scope.PlanDetailsObjectNew.SpecialistCostvalue = item.SpecialistCostvalue || 0;
        $scope.PlanDetailsObjectNew.SubSpecialistCostvalue = item.SubSpecialistCostvalue || 0;
        $scope.PlanDetailsObjectNew.LabCostValue = item.LabCostValue || 0;
        $scope.PlanDetailsObjectNew.RxCostValue = item.RxCostValue || 0;
        $scope.PlanDetailsObjectNew.PdxCostValue = item.PdxCostValue || 0;
        $scope.PlanDetailsObjectNew.EmergencyCostValue = item.EmergencyCostValue || 0;
        $scope.PlanDetailsObjectNew.OtherCostValue = item.OtherCostValue || 0;

        $scope.PlanDetailsObjectNew.IOLCostValue = item.IOLCostValue || 0;
        $scope.PlanDetailsObjectNew.OpticalCostValue = item.OpticalCostValue || 0;
        $scope.PlanDetailsObjectNew.RefractionCostValue = item.RefractionCostValue || 0;
        $scope.PlanDetailsObjectNew.MedicalCostValue = item.MedicalCostValue || 0;
        $scope.PlanDetailsObjectNew.TejidCostValue = item.TejidCostValue || 0;
        $scope.PlanDetailsObjectNew.TP6CostValue = item.TP6CostValue || 0;
        $scope.PlanDetailsObjectNew.TP7CostValue = item.TP7CostValue || 0;
        $scope.PlanDetailsObjectNew.CQMCostValue = item.CQMCostValue || 0;

        $scope.PlanDetailsObjectNew.GeneralValueType = item.GeneralValueType || "A";
        $scope.PlanDetailsObjectNew.SpecialistValueType = item.SpecialistValueType || "A";
        $scope.PlanDetailsObjectNew.SubSpecialistValueType = item.SubSpecialistValueType || "A";
        $scope.PlanDetailsObjectNew.LabValueType = item.LabValueType || "A";
        $scope.PlanDetailsObjectNew.RxValueType = item.RxValueType || "A";
        $scope.PlanDetailsObjectNew.PdxValueType = item.PdxValueType || "A";
        $scope.PlanDetailsObjectNew.EmergencyValueType = item.EmergencyValueType || "A";
        $scope.PlanDetailsObjectNew.OtherValueType = item.OtherValueType || "A";
        $scope.PlanDetailsObjectNew.IOLValueType = item.IOLValueType || "A";
        $scope.PlanDetailsObjectNew.OpticalValueType = item.OpticalValueType || "A";
        $scope.PlanDetailsObjectNew.RefractionValueType = item.RefractionValueType || "A";
        $scope.PlanDetailsObjectNew.MedicalValueType = item.MedicalValueType || "A";
        $scope.PlanDetailsObjectNew.TejidValueType = item.TejidValueType || "A";
        $scope.PlanDetailsObjectNew.TP6ValueType = item.TP6ValueType || "A";
        $scope.PlanDetailsObjectNew.TP7ValueType = item.TP7ValueType || "A";
        $scope.PlanDetailsObjectNew.CQMValueType = item.CQMValueType || "A";
        $scope.PlanDetailsObjectNew.CreatedDt = item.CreatedDt || "";

        $scope.PlanDetailsObjectNew.Remarks = item.Remarks || "";
        $scope.PlanDetailsObjectNew.IsActive = item.IsActive;
        if ($scope.PlanDetailsObjectNew.CreatedDt !== $scope.PlanDetailsObjectNew.CurrentDate) {
            $scope.Isdisbled = true;
        }
    };

    $scope.EditRateDetails = function (Ritem) {
        $scope.AddCreateFeePopUp(Ritem);


    };

    $scope.selectedBranchobj = "";
    $scope.ChangeBranchDetails = function (item) {
        $scope.AddUplodadedDocDetailsNew.BranchObj = item;
        $scope.selectedBranchobj = item;
        $scope.AddUplodadedDocDetailsNew.BranchObj.BranchId = $scope.selectedBranchobj.BranchId;
    }

    function getAddUplodadedDocDetailsNew() {
        var obj = {
            "BranchObj": $filter("filter")($scope.AllUserBranchesList, { "ClinicId": $scope.HospitalId }, true)[0],
            "SearchText": "",
            "PageSize": 10,
            "PageNumber": 1,
            "GetAllIndicator": 0,
            "PayorId": 0,
            "OrganizationPayorId": 0,
            "TotalCount": 0,
            "PayorObj": "",
            "OrganizationId": ""
        }
        return obj;
    }

    $scope.AddUplodadedDocDetailsNew = getAddUplodadedDocDetailsNew();

    $scope.SearchPayorListByBranchName = function (SearchText) {
        var param = {
            "SearchText": SearchText || "",
            "Status": "Active",
            "PageSize": 10,
            "PageNumber": 1,
            "UserId": $scope.UserId,
            "SpecializationId": $scope.SpecializationId,
            "OrganizationId": $scope.AddUplodadedDocDetailsNew.BranchObj.BranchId,
            "ParentOrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "GetAllIndicator": 0,
            "PayorId": 0,
            "PayorTypeId": 0,
        };
        return eHnoteInsuranceService.GetOrganizationInsurancePayorsList(param).then(function (resp) {
            if (resp.data.count !== 0) {
                if (resp.data.rows !== undefined) {
                    return resp.data.rows.map(function (item) {
                        return item;
                    });
                }
            }
        });
    };

    $scope.ChangeOrgBranchPayor = function (mainplanobj) {
        mainplanobj.PayorId = 0;
        mainplanobj.OrganizationPayorId = 0;
    };

    $scope.onSelectOrganizationBranchPayor = function (planobj, mainplanobj) {
        if (planobj != undefined) {
            mainplanobj.PayorId = planobj.PayorId;
            mainplanobj.OrganizationPayorId = planobj.OrganizationPayorId;
        }
    };


    $scope.AddFileUploadDocument = function () {

        $scope.AddUplodadedDocDetailsNew.OrganizationPayorId = $scope.AddUplodadedDocDetailsNew.OrganizationPayorId || 0;
        if ($scope.AddUplodadedDocDetailsNew.OrganizationPayorId == 0) {
            alertify.error("Please select Payor");
            return false;
        }
        if ($scope.addNewPayorObject.AgreementFilesArray.length == 0) {
            alertify.error("Please select at least one document");
            return false;
        }

        var param = {
            "UserId": $scope.UserId,
            "OrganizationId": $scope.AddUplodadedDocDetailsNew.BranchObj.BranchId,
            "OrganizationPayorId": $scope.AddUplodadedDocDetailsNew.OrganizationPayorId || 0,
            "PayorId": $scope.AddUplodadedDocDetailsNew.PayorId || 0,
            "AgreementFilesArray": $scope.addNewPayorObject.AgreementFilesArray,
        };

        eHnoteInsuranceService.AddUpdateInsuranceMOUDocuments(param, OnAddPatientSuccess, OnAddPatientError);
        function OnAddPatientSuccess(resp) {
            if (resp.status === "Success") {
                alertify.success('Documents Added Successfully');
                $scope.AddPayorListDetailsNew = getPayorListDetailsNew();
                $scope.GetInsuranceDocument();
            }
            else {
                alertify.error(resp.Message);
            }
        }
        function OnAddPatientError(error) {
            
        }
        $scope.AddUplodadedDocDetailsNew.PayorObj = "";
        $scope.AddUplodadedDocDetailsNew.OrganizationPayorId = 0;
        $scope.addNewPayorObject.AgreementFilesArray = [];
    };

    $scope.GetInsuranceDocument = function () {

        $scope.AddPayorListDetailsNew.PageNumber = $scope.AddPayorListDetailsNew.PageNumber || 0;
        var param = {

            "OrganizationId": $scope.AddPayorListDetailsNew.BranchObj.BranchId,
            "OrganizationPayorId": $scope.AddPayorListDetailsNew.OrganizationPayorId || 0,
            "PageSize": $scope.AddPayorListDetailsNew.PageSize,
            "PageNumber": $scope.AddPayorListDetailsNew.PageNumber,
            "GetAllIndicator": 0,
            "ParentOrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
        };
        if (param.OrganizationId == 0) {
            param.GetAllIndicator = 1;
        } else {
            param.GetAllIndicator = 0;
        }

        eHnoteInsuranceService.GetOrganizationInsuranceDocuments(param).then(function (resp) {
          
            $scope.DocumentsArrayList = [];
            if (resp.data.status === "Success") {
                if (resp.data.rows != undefined) {
                    $scope.DocumentsArrayList = resp.data.rows;
                    $scope.Documentpayorcount = resp.data.Count;
                    angular.forEach($scope.DocumentsArrayList, function (item) {
                        item.DocumentsPDFArrayList = [];
                        item.DocumentsIMGArrayList = [];
                        angular.forEach(item.DocumentsArray, function (Docitem) {
                            if (Docitem.DocumentExt === 'pdf') {
                                item.DocumentsPDFArrayList.push(Docitem);
                            } else {
                                item.DocumentsIMGArrayList.push(Docitem);
                              
                            }
                        });

                    });
                }
            }
            $scope.AddPayorListDetailsNew.PayorObj = "";
            $scope.AddPayorListDetailsNew.OrganizationPayorId = 0;
       
        });
    };

    function getPayorListDetailsNew() {
        var obj = {
            "BranchObj": $filter("filter")($scope.AllUserBranchesList, { "ClinicId": $scope.HospitalId }, true)[0],
            "SearchText": "",
            "PageSize": 10,
            "PageNumber": 1,
            "GetAllIndicator": 0,
            "PayorId": 0,
            "OrganizationPayorId": 0,
            "TotalCount": 0,
            "PayorObj": "",
            "OrganizationId": $scope.HospitalId,
            "ParentOrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
        }
        return obj;
    }

    $scope.AddPayorListDetailsNew = getPayorListDetailsNew();
    $scope.GetInsuranceDocument();

    $scope.selectedBranchobj = "";
    $scope.ShowBranchPayorDetails = function (item) {
        $scope.AddPayorListDetailsNew.BranchObj = item;
        $scope.selectedBranchobj = item;
        $scope.AddPayorListDetailsNew.BranchObj.BranchId = $scope.selectedBranchobj.BranchId;
    }

    $scope.SearchPayorsList = function (SearchText) {
        var param = {
            "SearchText": SearchText || "",
            "Status": "Active",
            "PageSize": 10,
            "PageNumber": 1,
            "UserId": $scope.UserId,
            "SpecializationId": $scope.SpecializationId,
            "OrganizationId": $scope.AddPayorListDetailsNew.BranchObj.BranchId,
            "ParentOrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "GetAllIndicator": 0,
            "PayorId": 0,
            "PayorTypeId": 0,
        };
        return eHnoteInsuranceService.GetOrganizationInsurancePayorsList(param).then(function (resp) {
            if (resp.data.count !== 0) {
                $scope.PayorsArrayList = [];
                if (resp.data.rows !== undefined) {
                    $scope.PayorsArrayList = resp.data.rows;
                    return resp.data.rows.map(function (item) {
                        return item;
                    });
                }
            }
        });
    };

    $scope.ChangeOrganizationPayorList = function (mainplanobj) {
        mainplanobj.PayorId = 0;
        mainplanobj.OrganizationPayorId = 0;
    };

    $scope.onSelectOrgBranchPayor = function (planobj, mainplanobj) {
        if (planobj != undefined) {
            mainplanobj.PayorId = planobj.PayorId;
            mainplanobj.OrganizationPayorId = planobj.OrganizationPayorId;
        }
    };

    $scope.SearchPayorListbyBranch = function () {
        $scope.GetInsuranceDocument();
    };

    $scope.GetPayorsListInSettings = function (docid, url, filetype) {
        if (filetype === "jpg" || filetype === "PNG" || filetype === "png" || filetype === "jpeg") {
            $scope.PayorsArrayList1 = [];
            $scope.PayorsArrayList1.push({
                "url": url,
                "thumbUrl": url
            });
            Lightbox.openModal($scope.PayorsArrayList1, 0);
        } else if (filetype === "pdf") {
            window.open(url);
        }
    };

    $scope.ChangePayorListPage = function (pagenumber) {
        $scope.AddUplodadedDocDetailsNew.PageNumber = pagenumber;
        $scope.GetInsuranceDocument();
    }
    $scope.file = "";
    $scope.DeletePayorDocumentItem = function (item) {
        $scope.file = item.DocumentName;
        $scope.DeletePayorDocumentImg = { "DeleteInd": "Y", "DocumentExt": item.DocumentExt, "DocumentId": item.DocumentId, "DocumentName": item.DocumentName, "OrganizationPayorId": item.OrganizationPayorId, "S3URL": item.S3URL, "file": $scope.file };
        var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure want to delete? </h4>", function () {
            var param = {
                "UserId": $scope.UserId,
                "OrganizationId": $scope.AddUplodadedDocDetailsNew.BranchObj.BranchId,
                //"OrganizationPayorId": $scope.AddUplodadedDocDetailsNew.OrganizationPayorId || 0,
                "OrganizationPayorId": item.OrganizationPayorId || 0,
                "PayorId": $scope.AddUplodadedDocDetailsNew.PayorId || 0,
                "AgreementFilesArray": [],
            };
            
            param.AgreementFilesArray.push($scope.DeletePayorDocumentImg);

            eHnoteInsuranceService.AddUpdateInsuranceMOUDocuments(param, onupdateDeletesuccess, onupdateDelerror);
            function onupdateDeletesuccess(resp) {
                $scope.GetInsuranceDocument();
                console.log(resp);
                if (resp.status === "Success") {
                    alertify.success("Deleted Successfully");
                }
            }
            function onupdateDelerror(error) {
                console.log(error);
                console.log("Deleting Failed");
            }
        });
    };

    $scope.changeshowgeneral = function (check) {
        if (check == true) {
            $scope.RateListObj.PayorObj = "General";
            $scope.RateListObj.OrganizationPayorId = 0;
            $scope.RateListObj.OrganizationPayorName = "General";
            $scope.RateListObj.CPTCODE = "";
            $scope.RateListObj.ProcedureName = "";
            $scope.RateList = [];
        } else {
            $scope.RateListObj.PayorObj = "";
            $scope.RateListObj.OrganizationPayorId = 0;
            $scope.RateListObj.OrganizationPayorName = "";
            $scope.RateListObj.CPTCODE = "";
            $scope.RateListObj.ProcedureName = "";
            $scope.RateList = [];
        }
    }

    $scope.ClearUploadDocument = function () {
        $scope.AddUplodadedDocDetailsNew.PayorObj = "";
        $scope.addNewPayorObject.AgreementFilesArray = [];
        $scope.addNewPayorObject.S3URL = '';
        $scope.file = "";
    }

    $scope.uploadPayorAgreement = function ($files) {
        $scope.addNewPayorObject.AgreementFilesArray = [];
        $scope.addNewPayorObject.S3URL = '';
        $scope.file = "";

        $scope.file = $files;
        
        if ($scope.file != null) {
            if ($scope.file.length > 0) {
                angular.forEach($scope.file, function (fitem) {
                    var pName = fitem.name, name = "";
                    var type = fitem.type.split("/")[1];
                    if (pName.length > 9) {
                        name = pName.substring(0, 9) + "..." + "." + type;
                    } else {
                        name = angular.copy(pName) + '.' + type;
                    }

                    var obj = {
                        "file": fitem,
                        "DeleteInd": "N",
                        "DocumentId": 0,
                        "DocumentExt": fitem.type,
                        "DocumentName": name,
                        "S3URL": "",
                    };
                    if (fitem.type != 'application/pdf') {
                        $scope.addNewPayorObject.AgreementFilesArray.push(obj);
                    }
                    else {
                        $scope.addNewPayorObject.AgreementFilesArray.push(obj);
                    }

                });
            }
        }
    };

    $scope.ChangePostalCode = function (val) {
        val = val || "";
        if (val.length >= 5) {
            $scope.Postalcodesarray = [];
            eHnoteSettingsDataService.GetLocationsByZipCode(val).then(function (resp) {
                if (resp.data.Status == "Success") {
                  if (resp.data.rows.length > 0) {
                    $scope.Postalcodesarray = resp.data.rows || [];
                    $scope.addNewPayorObject.StateId = $scope.Postalcodesarray[0].StateId;
                    $scope.addNewPayorObject.CityId = $scope.Postalcodesarray[0].CityId;

                    $scope.changegetCitiesByState($scope.addNewPayorObject.StateId);
                  }
                }
            });

        }
         
    }

    $scope.ChangeHospitalinPayor = function (item) {
        $scope.addNewPayorObject.BranchObj = item;
        $scope.addNewPayorObject.OrganizationId = item.BranchId;
    };

    $scope.addedNewPlan = false;
    $scope.addNewPlan = function () {
        $scope.addedNewPlan = true;
        $scope.Isdisbled = false;
    };
    $scope.closeNewPlan = function () {
        $scope.PlanDetailsObjectNew = $scope.GetPlanDetailsObjectNew();
        $scope.addedNewPlan = false;
    };
    $scope.addedPayor = false;
    $scope.addPayor = function () {
        $scope.addedPayor = true;
    };
    $scope.closeAddedPayor = function () {
        $scope.ClearPayordetails();
        $scope.addedPayor = false;
    };

    $scope.LostSettingsFocus = function () {
        $scope.payourFocus = false;
        $scope.healthPlansFocus = false;
    };


    $scope.UB04DigitsNo = [
        { DigitsId: 1, DigitsName: '0' },
        { DigitsId: 2, DigitsName: '1' },
        { DigitsId: 3, DigitsName: '2' },
        { DigitsId: 4, DigitsName: '3' },
        { DigitsId: 5, DigitsName: '4' },
        { DigitsId: 6, DigitsName: '5' },
        { DigitsId: 7, DigitsName: '6' },
        { DigitsId: 8, DigitsName: '7' },
        { DigitsId: 9, DigitsName: '8' },
        { DigitsId: 10, DigitsName: '9' },
    ];

    function getSelectedPatientData() {
        var obj = {
            "SelectTypeId": 4,
        }
        return obj;
    };
    $scope.Patientselectdata = getSelectedPatientData();

    $scope.GetOrgBillingProviders = function () {
        $scope.ClaimProviderList = [];
        let obj = {
            "OrganizationId": $scope.HospitalId || 0,
            "ParentOrganizationId": $scope.ParentHospitalId,
            "FacilityCode": "",
            "PageNumber": 1,
            "PageSize": 200
        }

        eHnoteSettingsDataService.GetOrganizationBillingProviders(obj).then(function (resp) {
            if (resp.data.Status == "Success") {
                resp.data.rows = resp.data.rows || [];
                if (resp.data.rows.length > 0) {
                    $scope.ClaimProviderList = angular.copy(resp.data.rows);

                    console.log($scope.ClaimProviderList);
                }
            }
        }, function (err) {

        });
    }

   

    $scope.getDoctorsbySubSpecializations = function (branchId) {


        var branchesList = [];
        $scope.BranchDoctorsList = [];
        $scope.allUserList = [];
        $scope.DoctorObj = "";
        if (branchId === 0) {
            var TempAppListdoctoraddress = $filter("filter")($scope.BranchesListArray, function (iterator, ind) { return iterator.ClinicId !== 0; });
            var hospitalID = _.pluck(TempAppListdoctoraddress, "BranchId").join(",");

            angular.forEach(TempAppListdoctoraddress, function (items) {
                branchesList.push(items.BranchId);
            });
        } else {


            var TempAppListdoctoraddress = $filter("filter")($scope.BranchesListArray, function (iterator, ind) { return iterator.ClinicId === branchId; });
            var hospitalID = _.pluck(TempAppListdoctoraddress, "BranchId").join(",");
            angular.forEach(TempAppListdoctoraddress, function (items) {
                branchesList.push(items.BranchId);
            });
        }




        var listSubSplArray = $filter("filter")($scope.allSubSpecializationsArray, function (iterator, ind) { return iterator.isChecked === true; });
        var subSplArray = _.pluck(listSubSplArray, "SubSpecializationId").join(",");

        $scope.AllUsersList = [];
        $scope.AllDoctorsList = [];

        var reqObj = {
            "BranchId": hospitalID,
            "SubSpecializationIdArray": subSplArray
        }

        //console.log(JSON.stringify(reqObj));
        //return false;
        eHnoteMainAppointmentService.getAllUsersByDepartmentId(reqObj, onGetUsersSuccess, onGetUsersFailure);
        function onGetUsersSuccess(resp) {
            if (resp.rows.length > 0) {
                $scope.allUserList = resp.rows;


                if ($scope.allUserList.length !== 0) {

                    $scope.BranchDoctorsList = angular.copy($scope.allUserList);
                }


                $scope.AllUsersList = angular.copy($scope.allUserList);

                if ($scope.BranchDoctorsList.length > 0) {
                    $scope.BranchDoctorsList = _.uniq($scope.BranchDoctorsList, false, function (p) { return p.DoctorID; });
                    $scope.AllCounselorsList = $filter("filter")($scope.BranchDoctorsList, function (item) {
                        return item.RoleId === 18;
                    });
                    $scope.AllDoctorAnesthesiologist = $filter("filter")($scope.BranchDoctorsList, function (item) {
                        return item.RoleId === 30;
                    });
                    $scope.AllDoctorAssistant = $filter("filter")($scope.BranchDoctorsList, function (item) {
                        return item.RoleId === 29;
                    });
                    $scope.BranchDoctorsList = $filter("filter")($scope.BranchDoctorsList, function (item) {
                        return item.RoleId === 1 || item.RoleId === 3 || item.RoleId === 4 || item.RoleId === 43 || item.RoleId === 55;
                    });
                }

                $scope.AllDoctorsList = angular.copy($scope.BranchDoctorsList);
                var doctorAll = { "DoctorID": 0, "FullName": "All Doctors", "AddressID": 0, "MinPerCase": 15 };
                $scope.AllDoctorsList.unshift(doctorAll);



                var DoctorID = $scope.doctorinfo.doctordata.User[0].DoctorID;

                var DoctorObj = $filter("filter")($scope.BranchDoctorsList, function (item, index) { return item.DoctorID == DoctorID })[0];



            } else {
                alertify.error("No Doctors Found in Selected Hospital");

            }


        }

        function onGetUsersFailure(data) {
        }
    }

    $scope.GetOrgfacility = function () {
        $scope.OrganizationFacilityList = [];
        var params = {
            "OrganizationId": $scope.HospitalId,
            "FacilityName": ""
        };
        eHnoteMainAdminServices.GetOrganizationFacilityDetails(params).then(function (resp) {
            if (resp.data.status == "Success") {
                resp.data.rows = resp.data.rows || [];
                if (resp.data.rows.length > 0) {
                    $scope.OrganizationFacilityList = angular.copy(resp.data.rows);
                }
            }
        }, function (err) {

        });
    }

    $scope.masterinit = function () {
        $scope.GetOrgBillingProviders();
        $scope.getDoctorsbySubSpecializations($scope.HospitalId);
        $scope.GetOrgfacility();
    }
    $scope.masterinit();


    $scope.ChangeBox79Radiobtn = function (Id) {
        Id = Id || 0;
       
        $scope.Patientselectdata = getSelectedPatientData();

        $scope.Patientselectdata.SelectTypeId = Id;
        $scope.addNewPayorObject.Box79TypeId = $scope.Patientselectdata.SelectTypeId;
        if ($scope.addNewPayorObject.Box79TypeId == 1) {
            $scope.addNewPayorObject.Box79Type = "Billing Provider";
        }
        else if ($scope.addNewPayorObject.Box79TypeId == 2) {
            $scope.addNewPayorObject.Box79Type = "Rendering Provider";
        }
        else if ($scope.addNewPayorObject.Box79TypeId == 3) {
            $scope.addNewPayorObject.Box79Type = "Facility";
        } else {
            $scope.addNewPayorObject.Box79Type = "None";
        }
        $scope.addNewPayorObject.Box79ValueId = 0;
        $scope.addNewPayorObject.Box79Value = "";
        $scope.addNewPayorObject.Box79ValueNPI = "";

    }
    $scope.ChangeBox78Radiobtn = function (Id) {

        $scope.addNewPayorObject.Box78TypeId = Id;
        if ($scope.addNewPayorObject.Box78TypeId == 1) {
            $scope.addNewPayorObject.Box78Type = "Billing Provider";
        }
        else if ($scope.addNewPayorObject.Box78TypeId == 2) {
            $scope.addNewPayorObject.Box78Type = "Referral Provider";
        }
        else if ($scope.addNewPayorObject.Box78TypeId == 3) {
            $scope.addNewPayorObject.Box78Type = "Facility";
        } else {
            $scope.addNewPayorObject.Box78TypeId = 4;
            $scope.addNewPayorObject.Box78Type = "None";
        }
      

    }
    $scope.ChangeBox76Radiobtn = function (Id) {

        $scope.addNewPayorObject.Box76TypeId = Id;
        if ($scope.addNewPayorObject.Box76TypeId == 1) {
            $scope.addNewPayorObject.Box76Type = "Billing Provider";
        }
        else if ($scope.addNewPayorObject.Box76TypeId == 2) {
            $scope.addNewPayorObject.Box76Type = "Rendering Provider";
        }
        else if ($scope.addNewPayorObject.Box76TypeId == 3) {
            $scope.addNewPayorObject.Box76Type = "Facility";
        } else {
            $scope.addNewPayorObject.Box76TypeId = 4;
            $scope.addNewPayorObject.Box76Type = "None";
        }


    }
    $scope.ChangeBox77Radiobtn = function (Id) {

        $scope.addNewPayorObject.Box77TypeId = Id;
        if ($scope.addNewPayorObject.Box77TypeId == 1) {
            $scope.addNewPayorObject.Box77Type = "Billing Provider";
        }
        else if ($scope.addNewPayorObject.Box77TypeId == 2) {
            $scope.addNewPayorObject.Box77Type = "Rendering Provider";
        }
        else if ($scope.addNewPayorObject.Box77TypeId == 3) {
            $scope.addNewPayorObject.Box77Type = "Facility";
        } else {
            $scope.addNewPayorObject.Box77TypeId = 4;
            $scope.addNewPayorObject.Box77Type = "None";
        }


    }

    $scope.changeDoctor = function (item) {
        $scope.addNewPayorObject.Box79ValueId = item.DoctorID;
        $scope.addNewPayorObject.Box79Value = item.FullName ;
        $scope.addNewPayorObject.Box79ValueNPI = item.NPI;
        /*$scope.searchtxtb.txt1 = '';*/
    }

    $scope.changeBillingFacility = function (Obj) {
        var filtredArray = $filter("filter")($scope.OrganizationFacilityList, { "OrganizationFacilityId": Obj.OrganizationFacilityId }, true) || [];
        if (filtredArray.length > 0) {
            $scope.addNewPayorObject.Box79ValueId = filtredArray[0].OrganizationFacilityId;
            $scope.addNewPayorObject.Box79Value = filtredArray[0].FacilityName;
            $scope.addNewPayorObject.Box79ValueNPI = filtredArray[0].NPI;
        }

    }

    $scope.changeBillingProvider = function (mainclaimObj) {

        var filtredobj1 = $filter("filter")($scope.ClaimProviderList, { "OrganizationBillingProviderId": mainclaimObj.OrganizationBillingProviderId });
        if (filtredobj1.length > 0) {
            $scope.addNewPayorObject.Box79ValueId = filtredobj1[0].OrganizationBillingProviderId;
            $scope.addNewPayorObject.Box79Value = filtredobj1[0].BillingProviderName;
            $scope.addNewPayorObject.Box79ValueNPI = filtredobj1[0].NPI;
         
        }

    };

    $scope.SelectDigits2 = function (Id) {
        if (Id == 1) {
            $scope.addNewPayorObject.Box4Value2 = '0';
        } else if (Id == 2) {
            $scope.addNewPayorObject.Box4Value2 = '1';
        } else if (Id == 3) {
            $scope.addNewPayorObject.Box4Value2 = '2';
        } else if (Id == 4) {
            $scope.addNewPayorObject.Box4Value2 = '3';
        } else if (Id == 5) {
            $scope.addNewPayorObject.Box4Value2 = '4';
        } else if (Id == 6) {
            $scope.addNewPayorObject.Box4Value2 = '5';
        } else if (Id == 7) {
            $scope.addNewPayorObject.Box4Value2 = '6';
        } else if (Id == 8) {
            $scope.addNewPayorObject.Box4Value2 = '7';
        } else if (Id == 9) {
            $scope.addNewPayorObject.Box4Value2 = '8';
        } else if (Id == 10) {
            $scope.addNewPayorObject.Box4Value2 = '9';
        }
        else {

        }
        
    }

    $scope.SelectDigits3 = function (Id) {
        if (Id == 1) {
            $scope.addNewPayorObject.Box4Value3 = '0';
        } else if (Id == 2) {
            $scope.addNewPayorObject.Box4Value3 = '1';
        } else if (Id == 3) {
            $scope.addNewPayorObject.Box4Value3 = '2';
        } else if (Id == 4) {
            $scope.addNewPayorObject.Box4Value3 = '3';
        } else if (Id == 5) {
            $scope.addNewPayorObject.Box4Value3 = '4';
        } else if (Id == 6) {
            $scope.addNewPayorObject.Box4Value3 = '5';
        } else if (Id == 7) {
            $scope.addNewPayorObject.Box4Value3 = '6';
        } else if (Id == 8) {
            $scope.addNewPayorObject.Box4Value3 = '7';
        } else if (Id == 9) {
            $scope.addNewPayorObject.Box4Value3 = '8';
        } else if (Id == 10) {
            $scope.addNewPayorObject.Box4Value3 = '9';
        }
        else {

        }
    }

    $scope.SelectDigits4 = function (Id) {
        if (Id == 1) {
            $scope.addNewPayorObject.Box4Value4 = '0';
        } else if (Id == 2) {
            $scope.addNewPayorObject.Box4Value4 = '1';
        } else if (Id == 3) {
            $scope.addNewPayorObject.Box4Value4 = '2';
        } else if (Id == 4) {
            $scope.addNewPayorObject.Box4Value4 = '3';
        } else if (Id == 5) {
            $scope.addNewPayorObject.Box4Value4 = '4';
        } else if (Id == 6) {
            $scope.addNewPayorObject.Box4Value4 = '5';
        } else if (Id == 7) {
            $scope.addNewPayorObject.Box4Value4 = '6';
        } else if (Id == 8) {
            $scope.addNewPayorObject.Box4Value4 = '7';
        } else if (Id == 9) {
            $scope.addNewPayorObject.Box4Value4 = '8';
        } else if (Id == 10) {
            $scope.addNewPayorObject.Box4Value4 = '9';
        }
        else {

        }
    }

    $scope.togglePayerInfo = function (Obj) {
        $scope.addNewPayorObject.IsBox80Checked = Obj.IsBox80Checked || false;
        var templist = $filter("filter")($scope.citiesList, { "CityId": $scope.addNewPayorObject.CityId }) || [];
        if (templist.length > 0) {
            $scope.addNewPayorObject.CityId = templist[0].CityId;
            $scope.CityName = templist[0].CityName || '';
            $scope.StateName = templist[0].StateName || '';
            $scope.CountryName = templist[0].CountryName || '';

            if ($scope.addNewPayorObject.IsBox80Checked) {
                $scope.addNewPayorObject.Box80Value = "";
            }
            else {

            }

            //if ($scope.addNewPayorObject.IsBox80Checked) {
            //   /* $scope.addNewPayorObject.Box80Value = $scope.addNewPayorObject.PayorName + ",  " + $scope.addNewPayorObject.Address1 + ", " + $scope.addNewPayorObject.Address2 + ", " + $scope.CityName + ", " + $scope.StateName + ", " + $scope.CountryName + " - " + $scope.addNewPayorObject.ZipCode;*/
            //} else {
            //    $scope.addNewPayorObject.Box80Value = "";
            //}
        }
    };

    $scope.SelectBox14Value = function (Obj) {

        var filtredobj1 = $filter("filter")($scope.MasterBox14, { "UB04Id": Obj.Box14ValueId }, true);
        if (filtredobj1.length > 0) {
            $scope.addNewPayorObject.Box14ValueId = filtredobj1[0].UB04Id;
            $scope.addNewPayorObject.Box14Value = filtredobj1[0].Boxtype;
            $scope.addNewPayorObject.Box14ValueCode = filtredobj1[0].UB04CODE;

        }
    }

    $scope.SelectBox15List = function (Obj) {

        var filtredobj1 = $filter("filter")($scope.MasterBox15, { "UB04Id": Obj.Box15ValueId }, true);
        if (filtredobj1.length > 0) {
            $scope.addNewPayorObject.Box15ValueId = filtredobj1[0].UB04Id;
            $scope.addNewPayorObject.Box15Value = filtredobj1[0].Boxtype;
            $scope.addNewPayorObject.Box15ValueCode = filtredobj1[0].UB04CODE;

        }
    }
    $scope.ShowGroupAdd = false;
    $scope.CreateGroup = function () {
        $scope.ShowGroupAdd = true;
        $scope.AddPayorGroupNew = angular.copy(getAddPayorGroupNew());
    };
    $scope.cancelPayersGroup = function () {
        $scope.ShowGroupAdd = false;
        $scope.clearPayersGroup();
    };
    $scope.GetOrganizationNewPayorAllList = function (val) {

        if (val == undefined || val == null || val == "") {
            $scope.getInsurancePayorListReqObj.PayorId = 0;
            return false;
        }

        var param = {
            "SearchText": val || "",
            "Status": "Active",
            "PageSize": 10,
            "PageNumber": 1,
            "UserId": $scope.UserId,
            "SpecializationId": $scope.SpecializationId,
            "OrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "ParentOrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
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

    //payer groups

    function getAddPayorGroupNew() {
        var obj = {
            "BranchObj": $filter("filter")($scope.AllUserBranchesList, { "ClinicId": $scope.HospitalId }, true)[0],
            "SearchText": "",
            "PageSize": 10,
            "PageNumber": 1,
            "GetAllIndicator": 0,
            "PayorId": 0,
            "OrganizationPayorId": 0,
            "TotalCount": 0,
            "PayorObj": "",
            "PayorGroupObj": "",
            "OrganizationId": "",
            "OrgPayorGroupId": 0,
            "OrgPayorGroupName": ""
        }
        return obj;
    }

    $scope.AddPayorGroupNew= getAddPayorGroupNew();



    $scope.GetSearchAddPayorgrupByText = function (val) {
        val = val || '';
        if (val == "") {
            $scope.AddPayorGroupNew.PayorId = 0;
            return false;
        }
        var param = {
            "SearchText": val || "",
            "Status": "Active",
            "PageSize": 10,
            "PageNumber": 1,
            "UserId": $scope.UserId,
            "SpecializationId": $scope.SpecializationId,
            "OrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "ParentOrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
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
    $scope.SelectedGroupPayorArray = []; 

    $scope.OnSelectAddPayorGroup = function (getItem) {
        // Check if payer already exists
        var exists = $scope.SelectedGroupPayorArray.some(function (p) {
            return p.GlobalPayorId === getItem.GlobalPayorId;
        });

        if (!exists) {
            var payorObj = {
                OrgPayorGroupDetailId: 0,
                MasterPayorId: getItem.PayorId || '',
                MasterPayorName: getItem.PayorName,
                OrganizationPayorId: getItem.OrganizationPayorId || null,
                OrganizationPayorName: getItem.OrganizationPayorName || '',
                DeleteInd: "N",
                GlobalPayorId: getItem.GlobalPayorId
            };
            $scope.SelectedGroupPayorArray.push(payorObj);
        }
        $scope.AddPayorGroupNew.PayorObj = '';
        $scope.AddPayorGroupNew.PayorId = 0;
    };
    $scope.RemovePayerinList = function (getItem, index) {
        if (getItem.OrgPayorGroupDetailId === 0) {
            $scope.SelectedGroupPayorArray.splice(index, 1);
        } else {
            getItem.DeleteInd = "Y";
        }
    };
    $scope.SaveAddPayersGroup = function () {

        if ($scope.AddPayorGroupNew.OrgPayorGroupName === "") {
            alertify.error("Please Enter Payor GroupName");
            return false;
        }
        var param = {
            "OrgPayorGroupId": $scope.AddPayorGroupNew.OrgPayorGroupId || 0,
            "OrgPayorGroupName": $scope.AddPayorGroupNew.OrgPayorGroupName || '',
            "ParentOrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "OrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "UserId": $scope.UserId,
            "GroupPayors": $scope.SelectedGroupPayorArray,
            "DeleteInd": "N",
            "ActiveInd": "Y"
        }

        eHnoteInsuranceService.AddUpdateOrganizationPayorGroups(param).then(function (response) {
            if (response.data.status === 'Success') {
                alertify.success("Payer Group Added Successfully");
                $scope.AddPayorGroupNew = getAddPayorGroupNew();
                $scope.GetSearchPayorgrupByText();
            }
        });
      
        $scope.SelectedGroupPayorArray = [];
        $scope.AddPayorGroupNew.OrgPayorGroupName = "";       
    }
    $scope.clearPayersGroup = function () {
        $scope.AddPayorGroupNew = angular.copy(getAddPayorGroupNew());
        $scope.SelectedGroupPayorArray = [];
    }  


    $scope.GetSearchPayorgrupByText = function (val) {
        var params = {
            "SearchText": val || "",
            "OrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "ParentOrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "PageSize": 10,
            "PageNumber": 1
        };
        return eHnoteInsuranceService.GetOrganizationPayorGroups(params).then(function (resp) {
            if (resp.data.status == "Success") {
                resp.data.rows = resp.data.rows || [];
                $scope.PayorGrupByList = angular.copy(resp.data.rows);
            }
        });
    };
    
    $scope.EditPayerGroup = function (item) {
        $scope.ShowGroupAdd = true;
        $scope.AddPayorGroupNew.OrgPayorGroupId = item.OrgPayorGroupId;
        $scope.AddPayorGroupNew.OrgPayorGroupName = item.OrgPayorGroupName;
        $scope.SelectedGroupPayorArray = angular.copy(item.GroupPayors) || [];
    }; 
    $scope.ChangesActiveStatusForgroupPayor = function (kitem, Ind) {
        kitem.ActiveInd = Ind;
        var param = {
            "OrgPayorGroupId": kitem.OrgPayorGroupId,
            "OrgPayorGroupName": kitem.OrgPayorGroupName || '',
            "ParentOrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "OrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "UserId": $scope.UserId,
            "GroupPayors": kitem.GroupPayors || [],
            "DeleteInd": "N",
            "ActiveInd": Ind || 'Y',
        }

        eHnoteInsuranceService.AddUpdateOrganizationPayorGroups(param).then(function (response) {
            if (response.data.Status === 'Success') {
                alertify.success("Payer Group Ststus Active Successfully");
            }
        });
    };
    
}]);
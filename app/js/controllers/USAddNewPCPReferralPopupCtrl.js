"use strict";
eHnoteWebApp.controller("USAddNewPCPReferralPopupCtrl", ["$scope", "$uibModalInstance", "eHnotePatientAddressDataServices", "eHnoteDbStaticDataService", "eHnoteSettingsDataService", "eHnoteUserDataService", "eHnoteMainAdminServices", "eHnoteMasterDataService", "eHnoteReferalDataService", "$q", "alertify","mainObj",
    function ($scope, $uibModalInstance, eHnotePatientAddressDataServices, eHnoteDbStaticDataService, eHnoteSettingsDataService, eHnoteUserDataService, eHnoteMainAdminServices, eHnoteMasterDataService, eHnoteReferalDataService, $q, alertify, mainObj) {

        var doctorInfo = eHnoteMasterDataService.getUserInfo();
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        $scope.SpecializationId = doctorInfo.doctordata.User[0].SpecializationId;
        var SubOrganizationId = doctorInfo?.doctordata?.UserAddress[0]?.SubOrganizationId;
        $scope.ParenthospitalId = 0;
        if (doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            $scope.HospitalCD = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
            $scope.ParenthospitalId = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.HospitalId = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        }
        $scope.GetPCPObj = function () {
            return {
                "PcpReferalId": 0,
                "FirstName": "",
                'LastName': '',
                'SuffixId': '',
                'Title': 'Mr',
                'Age': null,
                "MobileNo": null,
                "AlternateMobileNo": null,
                "Gender": "Male",
                "EmailId": "",
                'Address1': '',
                'Address2': '',
                'LocationId': null,
                "StateId": 0,
                'CityId': 0,
                'PinCode': '',
                'NPI': '',
                'SSN': '',
                'EmployeeId': '',
                'ZipCodePlusNo': '',
                "SpecializationId": null,
                //"DeleteInd": false,
                "DeleteInd": "N",
                "countrycode": "",
                "OrganizationId": $scope.HospitalId,
                "UserId": $scope.UserId,
                "ZipCode": '',
                "LocationName": "",
                "CityName": "",
                "CityId": "",
                "StateName": "",
                "StateId": "",
                "ContactNo": null,
                "Slicence": "",
                "TaxonomyId": "",
                "Contactcountrycode": '+1',
                'RefaralDr': '',
                'RefaralTypeId': '',
                'RefaralTypeName': '',
                'CountyId': 0,
                'CountryName': '',
                'CountryId': 0,
                'CLIAID': '',
                'EmployeeId': '',
                'LIC': '',
                'PCPOrganization': '',
                'WWW': '',
                'PCPNotes': '',
                'SubSpecializationId': '',
                'Fax': '',
                'Alternatecountrycode': '+1',
                'Faxcountrycode': '+1',
                "FaxAreacode": "",
                "FaxHomeNumber": "",
                'Contact': "",
                'PCPSubSpecializations': []

            };
        };
        $scope.PCPObj = $scope.GetPCPObj();
        var mainObj = mainObj || {};
        $scope.specialitylist = [];
        $scope.changeSuffix = function (Suffixid) {
            if (Suffixid === null) {
                $scope.PCPObj.SuffixId = 0;
            }
        }
        $scope.Init = function () {
            getDoctorSpecialaties();
            $q.all([
                eHnoteMainAdminServices.getBranchSpecializationById(SubOrganizationId, $scope.HospitalId),
                eHnoteDbStaticDataService.getMasterUserSuffixList()
            ]).then(function (resp) {
                if (resp[0]?.data?.row?.length > 0) {
                    $scope.PCPMainBranchSubSpecializationList = angular.copy(resp[0].data.row);
                    angular.forEach($scope.PCPMainBranchSubSpecializationList, function (Ditem) {
                        Ditem.IsPrimarySubSpecialization = false;
                        Ditem.isChecked = false;
                    });
                }
                if (resp[1]?.data?.rows?.length > 0 && resp[1]?.data?.RefaralTypes?.length > 0) {
                    $scope.SuffixList = resp[1].data.rows || [];
                    $scope.Refaraldoctorlist = resp[1].data.RefaralTypes || [];
                    if (mainObj) {
                        $scope.PCPObj.FirstName = mainObj?.searchProviderName;
                        let referralObj = $scope.Refaraldoctorlist.find(item => item.RefaralTypeName == mainObj?.referralTypeName);
                        $scope.PCPObj.RefaralTypeId = referralObj?.RefaralTypeId;
                        $scope.PCPObj.RefaralTypeName = referralObj?.RefaralTypeName;
                    }
                }               
            }).catch(function (err) {
                console.error("Error in Init data loading:", err);
                alertify.error("One or more data loads failed.");
            });
        };
        $scope.Init();
       
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
        $scope.AllDoctorCheck = false;
        $scope.selectedDoctors = "";
        $scope.searchtxtb = { "txt1": "", "txt2": "" };
        $scope.stopClosingDropDown = function (event) {
            event.stopPropagation();
        }
        $scope.checkAllDoctor = function (val) {
            if (val) {
                angular.forEach($scope.PCPMainBranchSubSpecializationList, function (item) {
                    item.isChecked = true;
                    item.IsPrimarySubSpecialization = false;
                    if (item.SubSpecializationId === 11) {
                        item.IsPrimarySubSpecialization = true;
                    }
                });

                $scope.selectedDoctors = 'All';
            } else {
                angular.forEach($scope.PCPMainBranchSubSpecializationList, function (item) {
                    item.isChecked = false;
                    item.IsPrimarySubSpecialization = false;
                });

                $scope.selectedDoctors = 'Select SubSpecialities';
            }
            var checkedArray = _.where($scope.PCPMainBranchSubSpecializationList, { isChecked: true });
            $scope.AllDoctorCheck = checkedArray.length > 0 && $scope.PCPMainBranchSubSpecializationList.length === checkedArray.length ? true : false;

        };

        $scope.DoctorToggle = function (item) {
            var checkedArray = _.where($scope.PCPMainBranchSubSpecializationList, { isChecked: true });
            var uncheckedArray = _.where($scope.PCPMainBranchSubSpecializationList, { isChecked: false });

            angular.forEach(checkedArray, function (item, index) {
                item.IsPrimarySubSpecialization = index === 0;
            });

            angular.forEach(uncheckedArray, function (item) {
                item.IsPrimarySubSpecialization = false;
            });

            $scope.AllDoctorCheck = (
                checkedArray.length > 0 &&
                checkedArray.length === $scope.PCPMainBranchSubSpecializationList.length
            );

            if (checkedArray.length === 0) {
                $scope.selectedDoctors = "Select SubSpecialities";
            } else if (checkedArray.length === 1) {
                $scope.selectedDoctors = checkedArray[0].SubSpecializationName;
            } else {
                $scope.selectedDoctors = "Selected";
            }
        };

        
        $scope.AddReferalPCPDoctor = function () {
            $scope.PCPObj.RefaralTypeId = $scope.PCPObj.RefaralTypeId || null;
            if ($scope.PCPObj.RefaralTypeId === null) {
                alertify.error("Please Select Referal Doctor");
                return;
            }


            $scope.PCPObj.FirstName = $scope.PCPObj.FirstName || ""
            $scope.PCPObj.MobileNo = $scope.PCPObj.MobileNo || "";
            $scope.PCPObj.AlternateMobileNo = $scope.PCPObj.AlternateMobileNo || "";
            $scope.PCPObj.Fax = $scope.PCPObj.Fax || "";
            $scope.PCPObj.NPI = $scope.PCPObj.NPI || '';

            if ($scope.PCPObj.RefaralTypeId == 4) {

                if ($scope.PCPObj.FirstName === '') {
                    alertify.error("Please Enter Hospital Name ");
                    return;
                }

                $scope.PCPObj.ZipCode = $scope.PCPObj.ZipCode || "";
                if ($scope.PCPObj.ZipCode == "") {
                    alertify.error("Please Enter Zip Code ");
                    return;
                } else if ($scope.PCPObj.ZipCode.length < 5) {
                    alertify.error("Please Enter Valid ZipCode ");
                    return;
                }

                $scope.PCPObj.Address1 = $scope.PCPObj.Address1 || "";
                if ($scope.PCPObj.Address1 == "") {
                    alertify.error("Please Enter Address Line1 ");
                    return;
                }

            }
            else {
                if ($scope.PCPObj.FirstName === '') {
                    alertify.error("Please Enter First Name ");
                    return;
                }
                if ($scope.PCPObj.LastName === '') {
                    alertify.error("Please Enter Last Name ");
                    return;
                }


                if ($scope.PCPObj.MobileNo != "") {
                    if ($scope.PCPObj.MobileNo.length < 14) {
                        alertify.error("Please Enter Valid Mobile Number");
                        return false;
                    }
                }

                if ($scope.PCPObj.AlternateMobileNo != "") {
                    if ($scope.PCPObj.AlternateMobileNo.length < 14) {
                        alertify.error("Please Enter Valid Alternate Mobile Number");
                        return false;
                    }
                }

                if ($scope.PCPObj.Fax != "") {
                    if ($scope.PCPObj.Fax.length < 14) {
                        alertify.error("Please Enter Valid Fax");
                        return false;
                    }
                }
                if ($scope.PCPObj.EmailId == undefined) {
                    alertify.error("Please Enter Valid Email ID");
                    return false;
                }


                if ($scope.PCPObj.NPI == '') {
                    alertify.error("Please Enter NPI ");
                    return;
                }
                else if ($scope.PCPObj.NPI.length < 10) {
                    alertify.error("Please Enter Valid NPI ");
                    return;
                }
            }
            if ($scope.PCPMainBranchSubSpecializationList.length > 0) {
                $scope.PCPObj.PCPSubSpecializations = [];
                angular.forEach($scope.PCPMainBranchSubSpecializationList, function (sitem) {
                    if (sitem.isChecked == true) {
                        var obj = {
                            "PCPSubSpecializationId": sitem.UserSubSpecializationId || 0,
                            "SubSpecializationId": sitem.SubSpecializationId,
                            "IsPrimarySubSpecialization": sitem.IsPrimarySubSpecialization,
                            "DeleteInd": sitem.DeleteInd || "N",
                        }
                        $scope.PCPObj.PCPSubSpecializations.push(obj);
                    }
                });
            }
            var reqObj = {
                "PcpReferalId": $scope.PCPObj.PcpReferalId,
                "FirstName": $scope.PCPObj.FirstName,
                'LastName': $scope.PCPObj.LastName,
                'Title': $scope.PCPObj.Title,
                'Age': $scope.PCPObj.Age || null,
                "MobileNo": $scope.PCPObj.MobileNo,
                "AlternateMobileNo": $scope.PCPObj.AlternateMobileNo,
                "Gender": $scope.PCPObj.Gender,
                "EmailId": $scope.PCPObj.EmailId,
                "SuffixId": $scope.PCPObj.SuffixId,
                'Address1': $scope.PCPObj.Address1,
                'Address2': $scope.PCPObj.Address2,
                'LocationId': $scope.PCPObj.LocationId,
                "StateId": $scope.PCPObj.StateId || 0,
                "StateName": $scope.PCPObj.StateName || '',
                'CityId': $scope.PCPObj.CityId || 0,
                'CityName': $scope.PCPObj.CityName || '',
                'CountryId': $scope.PCPObj.CountryId || 0,
                'CountryName': $scope.PCPObj.CountryName || '',
                'PinCode': $scope.PCPObj.ZipCode || '',
                'ZipCodePlusNo': $scope.PCPObj.ZipCodePlusNo,
                "SpecializationId": $scope.PCPObj.SpecializationId,
                "DeleteInd": $scope.PCPObj.DeleteInd,
                "countrycode": $scope.PCPObj.CountryId,
                "OrganizationId": $scope.HospitalId,
                "UserId": $scope.UserId,
                'NPI': $scope.PCPObj.NPI,
                'SSN': $scope.PCPObj.SSN || '',
                'EmployeeId': $scope.PCPObj.EmployeeId || '',
                'Slicence': $scope.PCPObj.Slicence,
                'TaxonomyId': $scope.PCPObj.TaxonomyId,
                'ContactNo': $scope.PCPObj.ContactNo,
                'Contactcountrycode': $scope.PCPObj.Contactcountrycode,
                'RefaralTypeId': $scope.PCPObj.RefaralTypeId,
                'RefaralTypeName': $scope.PCPObj.RefaralTypeName,
                'ZipCode': $scope.PCPObj.ZipCode,
                'County': $scope.PCPObj.CountyId,
                'CLIAID': $scope.PCPObj.CLIAID,
                'EmployeeId': $scope.PCPObj.EmployeeId,
                'LIC': $scope.PCPObj.LIC,
                'PCPOrganization': $scope.PCPObj.PCPOrganization,
                'WWW': $scope.PCPObj.WWW,
                'PCPNotes': $scope.PCPObj.PCPNotes,
                'SubSpecializationId': $scope.PCPObj.SubSpecializationId,
                'Fax': $scope.PCPObj.Fax,
                'Faxcountrycode': $scope.PCPObj.Faxcountrycode,
                "FaxAreacode": $scope.PCPObj.FaxAreacode,
                "FaxHomeNumber": $scope.PCPObj.FaxHomeNumber,
                'Alternatecountrycode': $scope.PCPObj.Alternatecountrycode,
                'Contact': $scope.PCPObj.Contact,
                'PCPSubSpecializations': $scope.PCPObj.PCPSubSpecializations
            };
            eHnoteReferalDataService.ModifyReferalPCPDoctor(reqObj).then(function (resp) {
                if (resp.data.Status == "Success") {
                    alertify.success("Successfully Added");
                    $uibModalInstance.close("cancel");
                }
                else {
                    alertify.error(resp.data.Message);
                }
            });
        };

        $scope.SearchLocationByZipcode = function (val) {
            var Zipcode = val || "";
            if (val.length >= 5) {
                return eHnoteSettingsDataService.GetLocationsByZipCode(Zipcode).then(function (response) {
                    if (response.data.rows !== undefined) {
                        return response.data.rows.map(function (item) {
                            return item;
                        });
                    }
                });
            }
        };
        $scope.CountyArray = [];
        $scope.SearchCountyByStateId = function (val) {
            var StateId = val || "0";
            eHnoteSettingsDataService.GetCountyByStateId(StateId).then(function (response) {
                if (response.data.CountyArray !== undefined) {
                    $scope.CountyArray = response.data.CountyArray;
                }
            });
        };
        $scope.SearchZipcodebyCounty = function (item) {
            if (item != "") {
                $scope.PCPObj.LocationId = item.LocationId;
                $scope.PCPObj.LocationName = item.LocationName;
                $scope.PCPObj.CityId = item.CityId;
                $scope.PCPObj.CityName = item.CityName;
                $scope.PCPObj.StateId = item.StateId;
                $scope.PCPObj.StateName = item.StateName;
                $scope.SearchCountyByStateId(item.StateId);
            }
        };
        $scope.changeZipcodetoProcedure = function (val) {
            val = val || "";
            if (val.length >= 5) {
                eHnoteSettingsDataService.GetLocationsByZipCode(val).then(function (resp) {
                    if (resp.data.rows.length > 0) {
                        var basedZipcode = resp.data.rows || [];
                        if (basedZipcode.length !== 0) {

                            $scope.PCPObj.CityName = basedZipcode[0].CityName;
                            $scope.PCPObj.CityId = basedZipcode[0].CityId;
                            $scope.PCPObj.StateName = basedZipcode[0].StateName;
                            $scope.PCPObj.StateId = basedZipcode[0].StateId;
                            $scope.PCPObj.CountryName = basedZipcode[0].CountryName;
                            $scope.PCPObj.CountryId = basedZipcode[0].CountryId;

                            $scope.searchCountyByZipCode(val);
                        }
                    }
                });
            }
            else {

                $scope.PCPObj.CityName = "";
                $scope.PCPObj.CityId = 0;
                $scope.PCPObj.StateName = "";
                $scope.PCPObj.StateId = 0;
                $scope.PCPObj.CountryName = "";
                $scope.PCPObj.CountryId = 0;
                $scope.PCPObj.CountryName = "";
                $scope.PCPObj.CountyId = 0;

            }


        };

        $scope.searchCountyByZipCode = function (zipcode) {
            eHnoteSettingsDataService.getCountiesByZipCode(zipcode).then(function (resp) {
                if (resp.data.Status === "Success") {
                    $scope.countyCodesArray = resp.data.rows || [];
                    $scope.PCPObj.CountryName = resp.data.rows[0].CountryName;
                    $scope.PCPObj.CountyId = resp.data.rows[0].CountryId;
                }
            });
        };

        $scope.ONchangeCounty = function (item, type) {
            if (type === "Refer") {
                $scope.PCPObj.CountryName = item.CountryName;
                $scope.PCPObj.CountyId = item.CountyId;
            }
        }

        
        $scope.RefActionType = '';
        $scope.ReferralId = 0;
        $scope.sActiveInactive = 'Y';
        $scope.maxSize = 4;

        function getDoctorSpecialaties() {
            eHnoteUserDataService.getspeciality(onspecsuccess, onspecfailure);
            function onspecsuccess(data) {
                $scope.Specialitylist = data;               
            }
            function onspecfailure(data) {
            }
        }
        $scope.changeRefaralTypeId = function () {
            const selected = $scope.Refaraldoctorlist.find(item => item.RefaralTypeId === $scope.PCPObj.RefaralTypeId);
            if (!selected) {
                $scope.PCPObj.RefaralTypeId = 0;
                $scope.PCPObj.RefaralTypeName = '';
            } else {
                $scope.PCPObj.RefaralTypeId = selected.RefaralTypeId;
                $scope.PCPObj.RefaralTypeName = selected.RefaralTypeName;
            }
        };


        $scope.changePhoneNumber = function (item) {
            item = item.toString()
            var obj = eHnoteUserDataService.UsMobileFormatChange(item);
            $scope.PCPObj.MobileNo = obj.UsFormatMobileNumber;
        };
        $scope.changeFaxNumber = function (fitem) {

            $scope.USnumberString = fitem || "";
            if ($scope.USnumberString != "") {
                const match = fitem
                    .replace(/\D+/g, '')
                    .match(/([^\d]*\d[^\d]*){1,10}$/)[0]
                const part1 = match.length > 3 ? `(${match.substring(0, 3)})` : match
                const part2 = match.length > 3 ? ` ${match.substring(3, 6)}` : ''
                const part3 = match.length > 6 ? `-${match.substring(6, 10)}` : ''
                $scope.PCPObj.Fax = part1 + part2 + part3;
                if ($scope.USnumberString.length > 9) {
                    var Area = $scope.USnumberString.slice(0, 3);
                    $scope.PCPObj.FaxAreacode = Area;
                    var contact = $scope.USnumberString.substring(3, ($scope.USnumberString.toString()).length);
                    $scope.PCPObj.FaxHomeNumber = contact;
                }
            }
        }
        $scope.changeAlternateNumber = function (item) {
            item = item.toString()
            var obj = eHnoteUserDataService.UsMobileFormatChange(item);
            $scope.PCPObj.AlternateMobileNo = obj.UsFormatMobileNumber;
        };
        $scope.getAddedCities = function (val) {
            var params = {
                "UserId": doctorInfo.doctorid,
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

        $scope.changeCity = function (type) {
            if (type == "") {
                $scope.PCPObj.CityName = "";
                $scope.PCPObj.CityId = 0;
            }
        }


        $scope.OnCity = function (item) {
            $scope.PCPObj.CityName = item.CityName || "";
            $scope.PCPObj.CityId = item.CityId;

            eHnotePatientAddressDataServices.SearchCity(item.CityName).then(function (resp) {
                if (resp.data.length > 0) {
                    $scope.PCPObj.StateName = resp.data[0].StateName;
                    $scope.PCPObj.StateId = resp.data[0].StateId;
                    $scope.PCPObj.CountryName = resp.data[0].CountryName;
                    $scope.PCPObj.CountryId = resp.data[0].CountryId;

                }
            });
        }


        eHnotePatientAddressDataServices.getStates(2, getstatesSuccess, getstatesFailed);
        function getstatesSuccess(data) {
            $scope.states = data;
        }
        function getstatesFailed(data) {
        }

        $scope.changeState = function (type) {
            if (type == "") {
                $scope.PCPObj.StateName = "";
                $scope.PCPObj.StateId = 0;

            }
        }
        $scope.ONchangeState = function (item, type) {
            if (type === "Mailing") {
                $scope.PCPObj.StateName = item.Name;
                $scope.PCPObj.StateId = item.StateId;
                $scope.PCPObj.CityName = "";
            }
        }
        $scope.ClearPCPPopup = function () {
            $scope.PCPObj = angular.copy($scope.GetPCPObj());
        }
        $scope.ClosePCPPopup = function () {
            $uibModalInstance.close("cancel");
        };
    }])

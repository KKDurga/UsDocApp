"use strict";
eHnoteWebApp.controller("EhnotePCPReferalCtrl", ["$scope", "eHnoteUserDataService", "eHnoteReferalDataService", "eHnoteMasterDataService", "eHnoteSettingsDataService", "eHnoteDbStaticDataService",
    "alertify", "$uibModal", "$filter", "eHnoteMainAdminServices", "eHnotePatientDataService", "eHnotePatientAddressDataServices", function ($scope, eHnoteUserDataService, eHnoteReferalDataService, eHnoteMasterDataService, eHnoteSettingsDataService, eHnoteDbStaticDataService, alertify, $uibModal, $filter, eHnoteMainAdminServices, eHnotePatientDataService, eHnotePatientAddressDataServices) {
      
        var doctorInfo = eHnoteMasterDataService.getUserInfo();
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        var referringProvider = ($scope.$parent.mainClaimObject && $scope.$parent.mainClaimObject.ReferringProviderObj)
            ? $scope.$parent.mainClaimObject.ReferringProviderObj
            : "";      
       
        //var allbranches = localStorageFactory.getItem("allBranchesData") || [];
        //var clinicAddress = eHnoteUserAppointmentDataService.RestructureNewBranches(true, allbranches, doctorInfo) || [];
        //$scope.HospitalList = clinicAddress || [];
       // $scope.SelectedPayorHospital = $filter("filter")($scope.HospitalList, { "BranchId": doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID }, true)[0];

        $scope.SpecializationId = doctorInfo.doctordata.User[0].SpecializationId;
        $scope.ParenthospitalId = 0;
        if (doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            $scope.HospitalCD = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
            $scope.ParenthospitalId = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.HospitalId = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        }


        $scope.GetSearchPCPObj = function () {
            return {
                'LocationId': null,
                'PageNumber': 1,
                'PageSize': 10,
                'SearchTaxt': '',
                "SpecializationId": null,
                "DeleteInd": "N",
                "OrganizationId": $scope.HospitalId,
                "RefaralTypeId":""

                }
        };
        var OrganizationId = 0;
        $scope.SearchPCPObj = angular.copy($scope.GetSearchPCPObj());
        // for this getting organigation 
        if ($scope.mainVisitObj != undefined) {
            OrganizationId = $scope.mainVisitObj.SelectedAppointentHospitalId;
        } else {
            OrganizationId = $scope.SearchPCPObj.OrganizationId;
        }
        $scope.init = function () {
            $scope.Specialitylist = [];
            $scope.SuffixList = [];
            $scope.ReferalPCPDoctorsList = [];
            getDoctorSpecialaties();
            $scope.GetMasterSuffix();
            $scope.SearchPCPDOClist();
           //  $scope.searchDoctors(1);
       
    };

        //console.log("ReferralTypeId:", ReferralTypeId);
        //$scope.ReferralTypeId = ReferralTypeId || 0;
    function getDoctorSpecialaties() {
        eHnoteUserDataService.getspeciality(onspecsuccess, onspecfailure);
        function onspecsuccess(data) {
            $scope.Specialitylist = data;
            //if ($scope.Specialitylist.length > 0) {
            //    $scope.Specialitylist.unshift({ Id: '', Name: 'Select' });
            //}
            //$scope.sSpecility = '';
            //$scope.speciality = '';
        }
        function onspecfailure(data) {
        }
    }
        var or
        $scope.SearchPCPDOClist = function () {
            var reqObj = {
                'LocationId': $scope.SearchPCPObj.LocationId,
                'PageNumber': $scope.SearchPCPObj.PageNumber,
                'PageSize': $scope.SearchPCPObj.PageSize,
                'SearchTaxt': $scope.SearchPCPObj.SearchTaxt,
                "SpecializationId": $scope.SearchPCPObj.SpecializationId,
                "DeleteInd": $scope.SearchPCPObj.DeleteInd,
                /*"OrganizationId": $scope.SearchPCPObj.OrganizationId,*/
                "OrganizationId": OrganizationId||0,
                "RefaralTypeId": $scope.SearchPCPObj.RefaralTypeId

            };

            eHnoteReferalDataService.GetReferalPCPDoctors(reqObj).then(function (resp) {

                if (resp.data.status === "Success") {
                    $scope.ReferalPCPDoctorsList = resp.data.PcpRefdetails;
                    $scope.ReferalPCPDoctorsListCount = resp.data.count;

                    angular.forEach($scope.ReferalPCPDoctorsList, function (sitem) {
                        if (sitem.DeleteInd == "N") {
                            sitem.UserActiveStatus = true;
                        } else {
                            sitem.UserActiveStatus = false;
                        }
                    });

                }
                else {
                    alertify.error(resp.data.Message);
                }

            });
        }

        $scope.GetMasterSuffix = function () {  
            $scope.SuffixList = [];
            $scope.Refaraldoctorlist = [];
            eHnoteDbStaticDataService.getMasterUserSuffixList().then(function (resp) {                
                $scope.SuffixList = resp.data.rows;
                $scope.Refaraldoctorlist = resp.data.RefaralTypes;
                //if (onClose && typeof onClose === 'function') {
                //if ($scope.RefaralTypeId !== 0) {
                //    var filter1 = "";
                //    filter1 = $filter("filter")($scope.Refaraldoctorlist, { "RefaralTypeId": $scope.ReferralTypeId }, true) || "";
                //    if (filter1.length > 0) {
                //        $scope.PCPObj.RefaraldoctorObj = filter1[0] || "";
                //        $scope.PCPObj.RefaralTypeId = filter1[0].RefaralTypeId || 0;
                //        $scope.PCPObj.RefaralTypeName = filter1[0].RefaralTypeName || "";
                //    }
                //}
                //}
            }, function (err) {
                console.log(err);
                alertify.error("Getting Titles Failed");
            });
        }

        $scope.init();

        $scope.ClearPCPDOClist = function () {
            $scope.SearchPCPObj = angular.copy($scope.GetSearchPCPObj());
            $scope.SearchPCPDOClist();
        }


        /*   Popup Start  */

        //$scope.Refaraldoctorlist = [
        //    { "RefaralTypeId": 1, "RefaralTypeName": "PCP" },
        //    { "RefaralTypeId": 2, "RefaralTypeName": "Referral" },
        //    { "RefaralTypeId": 4, "RefaralTypeName": "Refer Hospital" },
        //    { "RefaralTypeId": 5 ,"RefaralTypeName": "Referral For BookAppt" }
         
        //];
        /* { "RefaralTypeId": 3, "RefaralTypeName": "External Manager" }*/

        $scope.GetPCPObj = function () {
            return {
                "PcpReferalId": 0,
                "FirstName": referringProvider ? referringProvider : "",
                'LastName': '',
                'SuffixId': '',
                'Title': 'Mr',
                'Age':null,
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
                "ZipCode":'',
                "LocationName": "",
                "CityName": "",
                "CityId": "",
                "StateName": "",
                "StateId": "",
                "ContactNo": null,
                "Slicence": "",
                "TaxonomyId": "",              
                "Contactcountrycode":'+1',
                'RefaralDr': '',
                'RefaralTypeId': '',
                'RefaralTypeName': '',
                'CountyName': '',
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
        $scope.PCPObj = angular.copy($scope.GetPCPObj());
        $scope.changeSuffix = function (Suffixid) {
            if (Suffixid === null) {
                $scope.PCPObj.SuffixId = 0;
            }
        }

        $scope.OpenAddPCPpopup = function () {
            /*$scope.PCPObj = angular.copy($scope.GetPCPObj());*/
            $scope.mInstanceShow = $uibModal.open({
                "templateUrl": "Addnewpcppopup.html",
               "backdrop": "static",
            "keyboard": false,
            "scope": $scope,
            "windowClass": "modal__eighty--",
            });
        }


        $scope.ClosePCPPopup = function () {
            $scope.mInstanceShow.dismiss("cancel");
        }
        
      
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
              if ($scope.PCPObj.ZipCode == "" ) {
                alertify.error("Please Enter Zip Code ");
                return;
              } else if($scope.PCPObj.ZipCode.length < 5) {
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
           
           
            //$scope.PCPObj.SpecializationId = $scope.PCPObj.SpecializationId || null;
            //if ($scope.PCPObj.SpecializationId === null) {
            //    alertify.error("Please Select Speciality ");
            //    return;
            //}

            //$scope.PCPObj.PCPOrganization = $scope.PCPObj.PCPOrganization || null;
            //if ($scope.PCPObj.PCPOrganization === null) {
            //    alertify.error("Please Enter PCP Organization");
            //    return;
            //}

            //$scope.PCPObj.EmailId = $scope.PCPObj.EmailId || null;
            //if ($scope.PCPObj.EmailId === null) {
            //    alertify.error("Please Enter Email Id ");
            //    return;
            //}
            //if ($scope.PCPObj.LocationId === '') {
            //    alertify.error("Please Select LocationId ");
            //    return;
            //}

            //$scope.PCPObj.ZipCode = $scope.PCPObj.ZipCode || undefined;
            //  if ($scope.PCPObj.ZipCode == undefined ) {
            //    alertify.error("Please Enter Zip Code ");
            //    return;
            //  } else if($scope.PCPObj.ZipCode.length < 5) {
            //      alertify.error("Please Enter Valid ZipCode ");
            //      return;              
            //}

            //var Contactnumber = angular.copy($scope.PCPObj.MobileNo) || "";
            //if ($scope.PCPObj.MobileNo != '' || $scope.PCPObj.MobileNo != '') {
            //    if ((Contactnumber.toString()).length < 14) {
            //        alertify.error("Please Enter Contact Number");
            //        return false;
            //    }
            //}

            //var Contactnumber = angular.copy($scope.PCPObj.MobileNo) || "";
            //if ((Contactnumber.toString()).length < 0 || Contactnumber == '') {
            //    alertify.error("Please Enter Your Contact Number");
            //    return false;
            //}

            //var Contactnumber = angular.copy($scope.PCPObj.MobileNo) || "";
            //if ((Contactnumber.toString()).length < 14) {
            //    alertify.error("Please Enter Valid Contact Number");
            //    return false;
            //}

            if ($scope.PCPMainBranchSubSpecializationList.length > 0) {
                $scope.PCPObj.PCPSubSpecializations = [];
                angular.forEach($scope.PCPMainBranchSubSpecializationList, function (sitem) {
                    if (sitem.isChecked == true) {
                        var obj = {
                            "PCPSubSpecializationId": sitem.UserSubSpecializationId || 0,
                            /*"BranchSubSpecializationId": sitem.BranchSubSpecializationId,*/
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
                /*"OrganizationId": $scope.HospitalId,*/
                "OrganizationId": OrganizationId,
                "UserId": $scope.UserId,
                'NPI': $scope.PCPObj.NPI,
                'SSN': $scope.PCPObj.SSN||'',
                'EmployeeId': $scope.PCPObj.EmployeeId || '',
                'Slicence': $scope.PCPObj.Slicence,
                'TaxonomyId': $scope.PCPObj.TaxonomyId,
                'ContactNo': $scope.PCPObj.ContactNo,               
                'Contactcountrycode': $scope.PCPObj.Contactcountrycode,
                'RefaralTypeId': $scope.PCPObj.RefaralTypeId,
                'RefaralTypeName': $scope.PCPObj.RefaralTypeName,
                'ZipCode': $scope.PCPObj.ZipCode,
                'County': $scope.PCPObj.CountyId,
                'CLIAID': $scope.PCPObj.CLIAID ,
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
                   // $scope.mInstanceShow.dismiss("cancel");
                    $scope.mInstanceShow.close("close");
                    //if (onClose && typeof onClose === 'function') {
                    //    onClose();  // Call the parent function passed in resolve to refresh data
                    //}
                    $scope.SearchPCPDOClist();
                }
                else {
                    alertify.error(resp.data.Message);
                }
                //if (resp.data && resp.data.resp.length > 0 || resp.data.count === '0') {
                //    $scope.ReferalDoctorsList = resp.data.Refdetails;
                //    $scope.ReferalDoctorsListCount = resp.data.count;
                //    alertify.success("Successfully Added");
                //  //  showSuccesMessage($scope.RefActionType);
                //}
                //else {
                //    alertify.error(resp.data.Message);
                //}
            
            });
        };
     
        $scope.SearchLocationByZipcode = function (val) {
            var Zipcode = val || "";
            if (val.length >= 5) {
                return eHnoteSettingsDataService.GetLocationsByZipCode(Zipcode).then(function (response) {
                    if (response.data.rows!== undefined) {
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
               // $scope.PCPObj.countrycode = item.CountyName;
                $scope.SearchCountyByStateId(item.StateId);
            }
        };
        $scope.changeZipcodetoProcedure = function (val) {
            //$scope.PCPObj.LocationName = "";
            //$scope.PCPObj.CityName = "";
            //$scope.PCPObj.StateName = "";
            //$scope.PCPObj.CountyName = "";
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
                $scope.PCPObj.StateName ="";
                $scope.PCPObj.StateId = 0;
                $scope.PCPObj.CountryName = "";
                $scope.PCPObj.CountryId = 0;
                $scope.PCPObj.CountyName = "";
                $scope.PCPObj.CountyId = 0;

            }


        };

        $scope.searchCountyByZipCode = function (zipcode) {
            eHnoteSettingsDataService.getCountiesByZipCode(zipcode).then(function (resp) {
                if (resp.data.Status === "Success") {
                    $scope.countyCodesArray = resp.data.rows || [];
                    $scope.PCPObj.CountyName = resp.data.rows[0].CountyName;
                    $scope.PCPObj.CountyId = resp.data.rows[0].CountyId;
                }
            });
        };

        $scope.ONchangeCounty = function (item,type) {
            if (type === "Refer") {
                $scope.PCPObj.CountyName = item.CountyName;
                $scope.PCPObj.CountyId = item.CountyId;
            }
        }

        $scope.specialitylist = [];
        $scope.RefActionType = '';
        $scope.ReferralId = 0;
        $scope.sActiveInactive = 'Y';
        $scope.maxSize = 4;
        //$scope.ChangePageReferal = function (PageNumber) {
        //   var reqObj = {
        //        'LocationId': $scope.SearchPCPObj.LocationId,
        //        'PageNumber': PageNumber,
        //        'PageSize': $scope.SearchPCPObj.PageSize,
        //        'SearchTaxt': $scope.SearchPCPObj.SearchTaxt||'',
        //       "SpecializationId": $scope.SearchPCPObj.SpecializationId || null,
        //        "DeleteInd": $scope.SearchPCPObj.DeleteInd,
        //       "OrganizationId": $scope.SearchPCPObj.OrganizationId, 
               
        //    };
        //    eHnoteReferalDataService.GetReferalPCPDoctors(reqObj).then(function (resp) {

        //        if (resp.data.status === "Success") {
        //            $scope.ReferalPCPDoctorsList = resp.data.PcpRefdetails;
        //            $scope.ReferalPCPDoctorsListCount = resp.data.count;

        //        }
        //        else {
        //            alertify.error(resp.data.Message);
        //        }
        //    });
        //};

        $scope.changeRefaralTypeId = function (Id) {
            if (Id == null) {
                $scope.PCPObj.RefaralTypeId = 0;
            } else {
                var filter1 = $filter("filter")($scope.Refaraldoctorlist, { "RefaralTypeId": Id }, true) || "";
                if (filter1.length > 0) {
                    $scope.PCPObj.RefaraldoctorObj = filter1[0] || "";
                    $scope.PCPObj.RefaralTypeId = filter1[0].RefaralTypeId;
                    $scope.PCPObj.RefaralTypeName = filter1[0].RefaralTypeName;

                }

            }
        }

        $scope.EditPcpList = function (item) {

            $scope.PCPObj = angular.copy($scope.GetPCPObj());

            $scope.PCPObj.PcpReferalId = item.PcpReferralId;
            $scope.PCPObj.SuffixId = item.SuffixId;
            $scope.PCPObj.RefaralTypeId = item.RefaralTypeId;
            $scope.PCPObj.RefaralTypeName = item.RefaralTypeName;
            $scope.PCPObj.FirstName = item.FirstName;
            $scope.PCPObj.LastName = item.LastName;
            $scope.PCPObj.Gender = item.Gender;
            $scope.PCPObj.Age = item.Age;
            $scope.PCPObj.MobileNo = item.MobileNo;
            $scope.PCPObj.AlternateMobileNo = item.AlternateMobileNo;
            $scope.PCPObj.EmailId = item.EmailId;
            $scope.PCPObj.SpecializationId = item.SpecializationId;
            $scope.PCPObj.EmployeeId = item.EmployeeId;
            $scope.PCPObj.NPI = item.NPI;
            $scope.PCPObj.SSN = item.SSN;
            $scope.PCPObj.TaxonomyId = item.sTaxonomyID;
            $scope.PCPObj.Address1 = item.Address1;
            $scope.PCPObj.Address2 = item.Address2;
            $scope.PCPObj.LocationId = item.LocationId;
            $scope.PCPObj.LocationName = item.LocationName;
            $scope.PCPObj.CityId = item.CityId || 0;
            $scope.PCPObj.CityName = item.CityName || '';
            $scope.PCPObj.StateId = item.StateId || 0;
            $scope.PCPObj.StateName = item.StateName || '';
            $scope.PCPObj.ZipCode = item.ZipCode || '';
            $scope.PCPObj.CountyName = item.CountyName || '';
            $scope.PCPObj.CountyId = item.CountyId || 0;
            $scope.PCPObj.CountryName = item.CountryName || '';
            $scope.PCPObj.CountryId = item.CountryId || 0;
            $scope.PCPObj.CLIAID = item.CLIAID;
            $scope.PCPObj.EmployeeId = item.EmployeeId;
            $scope.PCPObj.LIC = item.LIC;
            $scope.PCPObj.PCPOrganization = item.PCPOrganization;
            $scope.PCPObj.WWW = item.WWW;
            $scope.PCPObj.PCPNotes = item.PCPNotes;
            $scope.PCPObj.SubSpecializationId = item.SubSpecializationId;
            if (item.Fax != "") {
                var FaxNumber = eHnoteUserDataService.UsMobileFormatChange(item.Fax);
                $scope.PCPObj.Fax = FaxNumber.UsFormatMobileNumber;
            }
            //$scope.PCPObj.Fax = item.Fax;
            $scope.PCPObj.Alternatecountrycode = item.Alternatecountrycode;
            $scope.PCPObj.Faxcountrycode = item.Faxcountrycode;
            $scope.PCPObj.Contact = item.Contact

            $scope.selectedDoctors = "";
            if (item.PCPSubSpecializations.length > 0) {
                angular.forEach($scope.PCPMainBranchSubSpecializationList, function (mainitem) {
                    angular.forEach(item.PCPSubSpecializations, function (subitem) {
                        if (mainitem.SubSpecializationId == subitem.SubSpecializationId) {
                            mainitem.IsPrimarySubSpecialization = subitem.IsPrimarySubSpecialization || false;
                            mainitem.isChecked = true;
                            if (mainitem.IsPrimarySubSpecialization == true) {
                                $scope.selectedDoctors = mainitem.SubSpecializationName || "";
                            }
                        }
                    });
                });
            }
         

            if (item.RefaralTypeId != 0) {
                var filter1 = "";
                filter1 = $filter("filter")($scope.Refaraldoctorlist, { "RefaralTypeId": item.RefaralTypeId }, true) || "";
                if (filter1.length > 0) {
                    $scope.PCPObj.RefaraldoctorObj = filter1[0] || "";
                }
            }
            $scope.OpenAddPCPpopup();
        };

        $scope.AddPCPDetail = function () {
            $scope.PCPObj = angular.copy($scope.GetPCPObj());
            $scope.OpenAddPCPpopup();
        }

        $scope.saveStatus = function (userActivestatus, item) {
            var Userstatus = "";
            $scope.Aelrtmsg = "";
            if (userActivestatus === true) {
                Userstatus = 'N';
                $scope.Aelrtmsg = " User Activated ";
            } else if (userActivestatus === false) {
                Userstatus = 'Y';
                $scope.Aelrtmsg = " User DeActivated ";
            }

            var obj = {
                "PcpReferalId": item.PcpReferralId,
                "DeleteInd": Userstatus
            }
            eHnoteMainAdminServices.PCPDoctorsActiveStatus(obj, Onsuccess, Onerror)
        }
        function Onsuccess(resp) {
            if (resp.Status === "Success") {
                alertify.success('Successfully' + $scope.Aelrtmsg);
                $scope.SearchPCPDOClist();
            }
        }
        function Onerror(error) {
            alertify.error('Some Error');
        }

        $scope.changePhoneNumber = function (item) {
            item = item.toString()
            var obj = eHnoteUserDataService.UsMobileFormatChange(item);
            $scope.PCPObj.MobileNo = obj.UsFormatMobileNumber;
        };

        $scope.changeAlternateNumber = function (item) {
            item = item.toString()
            var obj = eHnoteUserDataService.UsMobileFormatChange(item);
            $scope.PCPObj.AlternateMobileNo = obj.UsFormatMobileNumber;
        };
        //$scope.changeFaxNumber = function (item) {
        //    item = item.toString()
        //    var obj = eHnoteUserDataService.UsMobileFormatChange(item);
        //    $scope.PCPObj.Fax = obj.UsFormatMobileNumber;
        //};
        $scope.changeFaxNumber = function (fitem) {
            
            $scope.USnumberString = fitem || "";
            if ($scope.USnumberString != "") {
                const match = fitem
                    .replace(/\D+/g, '')
                    .match(/([^\d]*\d[^\d]*){1,10}$/)[0]
                const part1 = match.length > 3 ? `(${match.substring(0, 3)})` : match
                const part2 = match.length > 3 ? ` ${match.substring(3, 6)}` : ''
                const part3 = match.length > 6 ? `-${match.substring(6, 10)}` : ''
                //  return `${part1}${part2}${part3}`;
                $scope.PCPObj.Fax = part1 + part2 + part3;

                if ($scope.USnumberString.length > 9) {
                    var Area = $scope.USnumberString.slice(0, 3);
                    $scope.PCPObj.FaxAreacode = Area;
                    var contact = $scope.USnumberString.substring(3, ($scope.USnumberString.toString()).length);
                    $scope.PCPObj.FaxHomeNumber = contact;
                }
            }
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

        $scope.ChangePageReferal = function (PageNumber) {
            $scope.SearchPCPObj.PageNumber = PageNumber;
            $scope.SearchPCPDOClist()
        }

        $scope.getBranchSpecializationByIdDetails = function () {
            $scope.PCPMainBranchSubSpecializationList = [];
            eHnoteMainAdminServices.getBranchSpecializationById(doctorinfo.doctordata.UserAddress[0].SubOrganizationId, $scope.HospitalId).then(function (resp) {
                if (resp.data.row.length > 0) {
                    $scope.PCPMainBranchSubSpecializationList = resp.data.row;
                    if ($scope.PCPMainBranchSubSpecializationList.length > 0) {
                        angular.forEach($scope.PCPMainBranchSubSpecializationList, function (Ditem) {
                            Ditem.IsPrimarySubSpecialization = false;
                            Ditem.isChecked = false;
                        });
                    }
                }
            });

        }
        $scope.getBranchSpecializationByIdDetails();



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

        $scope.AllDoctorCheck =false;
        $scope.selectedDoctors = "All";
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

            if (checkedArray.length == 1) {
                checkedArray[0].IsPrimarySubSpecialization = true;
            }
            var UncheckedArray = _.where($scope.PCPMainBranchSubSpecializationList, { isChecked: false });
            if (UncheckedArray.length > 0) {
                angular.forEach(UncheckedArray, function (item) {
                    item.IsPrimarySubSpecialization = false;
                });
            }

            $scope.AllDoctorCheck = checkedArray.length > 0 && $scope.PCPMainBranchSubSpecializationList.length === checkedArray.length ? true : false;

            if (checkedArray.length == 0) {
                $scope.selectedDoctors = "Select  SubSpecialities ";
            } else {
                if (checkedArray.length > 0) {
                    $scope.selectedDoctors = checkedArray[0].SubSpecializationName;


                } else {
                    $scope.selectedDoctors = "Select  SubSpecialities";
                }
            }

        };
        $scope.Clearpcppopup = function () {
            $scope.PCPObj = angular.copy($scope.GetPCPObj());
            //if (onClose && typeof onClose === 'function') {
            //    var filter1 = "";
            //    filter1 = $filter("filter")($scope.Refaraldoctorlist, { "RefaralTypeId": 6 }, true) || "";
            //    if (filter1.length > 0) {
            //        $scope.PCPObj.RefaraldoctorObj = filter1[0] || "";
            //        $scope.PCPObj.RefaralTypeId = filter1[0].RefaralTypeId || 0;
            //        $scope.PCPObj.RefaralTypeName = filter1[0].RefaralTypeName || "";
            //    }
            //    if ($scope.PCPMainBranchSubSpecializationList.length > 0) {
            //        angular.forEach($scope.PCPMainBranchSubSpecializationList, function (Ditem) {
            //            Ditem.IsPrimarySubSpecialization = false;
            //            Ditem.isChecked = false;
            //        });
            //        $scope.AllDoctorCheck = false;
            //    }
            //}
        }
}]);

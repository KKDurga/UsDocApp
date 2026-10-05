"use strict";
eHnoteWebApp.controller("EhnotePatientInsurancesListCtrl", ["$scope", "$rootScope", "eHnoteMasterDataService", "eHnoteInsuranceService", "$filter", "InventoryService", "alertify", "$uibModal", "eHnoteCacheStorageService", "eHnotePrintService", "localStorageFactory", "eHnoteUserAppointmentDataService", "eHnoteMainAdminServices", "eHnoteMainAppointmentService", "eHnoteUserDataService", "$timeout", "eHnotePatientAddressDataServices", "eHnoteSettingsDataService", "$q", "eHnoteLoginStatusService", "datapersistanceFactory", "USPrintService","eHnoteAuditServices", function ($scope, $rootScope, eHnoteMasterDataService, eHnoteInsuranceService, $filter, InventoryService, alertify, $uibModal, eHnoteCacheStorageService, eHnotePrintService, localStorageFactory, eHnoteUserAppointmentDataService, eHnoteMainAdminServices, eHnoteMainAppointmentService, eHnoteUserDataService, $timeout, eHnotePatientAddressDataServices, eHnoteSettingsDataService, $q, eHnoteLoginStatusService, datapersistanceFactory, USPrintService, eHnoteAuditServices) {
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

    $scope.userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();

    $scope.selectedSpecialization = {
        "SpecializationName": "All Specialities",
        "SpecializationId": 0
    };
    $scope.selectedDepartmentName = 'All Departments';
    $scope.selectedDoctor = {
        "SecondUserFullName": "",
        "DoctorID": $scope.UserId 
    };



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
    function GetPatientDetailsInfo() {
        var obj = {
            "PatientProfilePicDetails": [],
            "PatientTagId": 0,
            "PatientID": 0,
            "PatientTagName": "",
            "PatientTagObj": "",
            "Title": "",
            "TitleId": 0,
            "FirstName": "",
            "MiddleName": "",
            "LastName": "",
            "DOB": "",
            "SocialSecurityNo": "",
            "Gender": "",
            "MaritalStatusID": "",
            "MaritalStatusName": "",
            "BloodGroupObj": {},
            "BloodGroupName": "",
            "BloodGroupId": 0,
            "MobileNumber": "",
            "ContactInfo": {
                "PatientHomeCode": "",
                "PatientHomeNumber": "",
                "PatientOfficeCode": "",
                "PatientOfficeNumber": "",
                "EmailID": "",
                "HomeCountryCode": "+1",
                "HomeAreaCode": "",
                "HomeNumber": "",
                "OfficeCountryCode": "+1",
                "OfficeAreaCode": "",
                "OfficeNumber": "",
                "MobileNumber": "",
                "ContactNumber": "",
                "AuthorizationId": "",
                "IsPatientSmsInd": false,
                "IsPatientEmailInd": false
            },
            "CurrentAge": "",
            "S3URL": "",
            "LeadSourceInd": "N",
            "PatientDisplayID": "",
            "Age": "",
            "DisplayMobileNumber": "",
            "DisplayAlternateNumber": "",
            "SecondLastName": "",
            "SecondLastNameInd": true,
            "IsNoChargePatient": false,
            "IsDiseased": false,
            "CauseOfDeath": "",
            "DateOfDeath": "",
            "OccupationId": null,
            "OccupationDescription": "",
            "EmployerPhoneNo": "",
            "Emergency": "",
            "EmergencyMobile": "",
            "FatherName": "",
            "MotherName": "",
            "Guardian": "",
            "Employer": "",
            "OldMrno": "",
            "BirthSex": "",
            "AuthorizedUserFullName": "",
            "AuthorizedUserEmailId": "",
            "AuthorizedUserMobileNo": ""
        }
        return obj;
    }

    $scope.PatientDetailsInfo = GetPatientDetailsInfo();
    function getAppointmentInsListReqObj() {
        var obj = {
          /*  "AppointmentDate": $filter('date')(new Date(), "MM-dd-yyyy"),*/
            "SearchText": "",
            "PatientId": 0,
            "PageSize": 100,
            "PageNumber": 1,
            "HospitalId": $scope.HospitalId,
            "ClinicName": "",
            "Patient": "",
            "DoctorId": $scope.UserId,
            "StatusId": 0,
            "SearchType": 1,
            "TotalCount": 0,
            "FromDate": $filter('date')(new Date(), "MM-dd-yyyy"),
            "ToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
            "PayorId": null,
        };
        return obj;
    }
    $scope.IsPatientChecked = false;
    $scope.searchAppointmentInsListObj = getAppointmentInsListReqObj();
    $scope.getDoctorsbySubSpecializations = function (branchId, pagetype) {
        var branchesList = [];
        $scope.clinicDoctorList = [];
        $scope.clinicDoctorAllList = [];
        $scope.allUserList = [];
        $scope.selectedDoctor = "";
        if (branchId === 0) {
            var TempAppListdoctoraddress = $filter("filter")($scope.BranchesListArray, function (iterator) {
                return iterator.ClinicId !== 0;
            });
        } else {
            var TempAppListdoctoraddress = $filter("filter")($scope.BranchesListArray, function (iterator) {
                return iterator.ClinicId === branchId;
            });
        }
        var hospitalID = _.map(TempAppListdoctoraddress, "BranchId").join(",");
        var branchesList = TempAppListdoctoraddress.map(function (item) {
            return item.BranchId;
        });
        var listSubSplArray = $filter("filter")($scope.allSubSpecializationsArray, function (iterator, ind) { return iterator.isChecked === true; });
        var subSplArray = _.pluck(listSubSplArray, "SubSpecializationId").join(",");

        var reqObj = {
            "BranchId": $scope.selectedBranch.ClinicId,
            "SubSpecializationIdArray": subSplArray
        }

        eHnoteMainAppointmentService.getAllUsersByDepartmentId(reqObj, onGetUsersSuccess, onGetUsersFailure);
        function onGetUsersSuccess(resp) {
            if (resp.rows.length > 0) {
                $scope.clinicDoctorList = [];
                $scope.allUserList = resp.rows;
                var RoleID = $scope.userLoginDetails.RoleID;
                $scope.AllCounsollerList = angular.copy($scope.allUserList);
                $scope.AllDilationList = angular.copy($scope.allUserList);
                $scope.AllTechnicianList = angular.copy($scope.allUserList);
                $scope.AllOpthaList = angular.copy($scope.allUserList);
                $scope.AllDoctorList = angular.copy($scope.allUserList);
                $scope.AllARList = angular.copy($scope.allUserList);
                $scope.AllBillingList = angular.copy($scope.allUserList);

                $scope.AllDoctorList = _.uniq($scope.AllDoctorList, false, function (p) { return p.DoctorID; });
                $scope.AllDoctorList = $filter("filter")($scope.AllDoctorList, function (item) {
                    return item.RoleId === 1 || item.RoleId === 3 || item.RoleId === 4 || item.RoleId === 43 || item.RoleId === 16 || item.RoleId === 56 || item.RoleId === 57;
                });
                $scope.AllOpthaList = _.uniq($scope.AllOpthaList, false, function (p) { return p.DoctorID; });
                $scope.AllOpthaList = $filter("filter")($scope.AllOpthaList, function (item) {
                    return item.RoleId === 10;
                });

                $scope.AllCounsollerList = _.uniq($scope.AllCounsollerList, false, function (p) { return p.DoctorID; });
                $scope.AllCounsollerList = $filter("filter")($scope.AllCounsollerList, function (item) {
                    return item.RoleId === 18;
                });
                $scope.AllDilationList = _.uniq($scope.AllDilationList, false, function (p) { return p.DoctorID; });
                $scope.AllDilationList = $filter("filter")($scope.AllDilationList, function (item) {
                    return item.RoleId === 54 || item.RoleId === 2 || item.RoleId === 10;
                });
                $scope.AllTechnicianList = _.uniq($scope.AllTechnicianList, false, function (p) { return p.DoctorID; });
                $scope.AllTechnicianList = $filter("filter")($scope.AllTechnicianList, function (item) {
                    return item.RoleId === 10 || item.RoleId === 38 || item.RoleId === 55;
                });
                $scope.AllARList = _.uniq($scope.AllARList, false, function (p) { return p.DoctorID; });
                $scope.AllARList = $filter("filter")($scope.AllARList, function (item) {
                    return item.RoleId === 61;
                });
                $scope.AllBillingList = _.uniq($scope.AllBillingList, false, function (p) { return p.DoctorID; });
                $scope.AllBillingList = $filter("filter")($scope.AllBillingList, function (item) {
                    return item.RoleId === 2 || item.RoleId === 10;
                });

                $scope.clinicDoctorAllList = angular.copy($scope.allUserList);


                angular.forEach($scope.clinicDoctorAllList, function (Aitem) {
                    if (Aitem.RoleId === 1 || Aitem.RoleId === 3 || Aitem.RoleId === 4 || Aitem.RoleId === 43 || Aitem.RoleId === 56 || Aitem.RoleId === 57) {
                        $scope.clinicDoctorList.push(Aitem);
                    }
                });
                $scope.clinicDoctorList = _.uniq($scope.clinicDoctorList, false, function (p) { return p.DoctorID; });
                //var docAll = { "DoctorID": 0, "FullName": "All Doctors", "AddressID": 0, "MinPerCase": 15 };
                //$scope.clinicDoctorList.unshift(docAll);

                $scope.checkAllDoctor(true);
                //var Index = $scope.clinicDoctorList.findIndex(record => record.DoctorID === eHnoteMasterDataService.getLoginId());
                //if (Index > -1) {
                //    $scope.AllDoctorsObj.selectedDoctors = $scope.clinicDoctorList[Index].SecondUserFullName;
                //} else {
                //    $scope.AllDoctorsObj.selectedDoctors  = $scope.clinicDoctorList[0].SecondUserFullName;
                //}


                $scope.selectedDocCSSid = $scope.selectedDoctor.DoctorID;

                if (RoleID === 1 || RoleID === 56) {
                    $scope.clinicDoctorList = [];
                    angular.forEach($scope.allUserList, function (Aitem) {
                        if (Aitem.RoleId === 1 || Aitem.RoleId === 4 || Aitem.RoleId === 43 || Aitem.RoleId === 56 || Aitem.RoleId === 57) {
                            $scope.clinicDoctorList.push(Aitem);

                        }
                    });
                    var docAll = { "DoctorID": 0, "FullName": "All Doctors", "AddressID": 0, "MinPerCase": 15 };
                    $scope.clinicDoctorList.unshift(docAll);
                    $scope.clinicDoctorList = _.uniq($scope.clinicDoctorList, false, function (p) { return p.DoctorID; });
                }


                if (!$scope.UserAccessRights.AllAccessRights.APPListAllDoctorAppointments) {
                    $scope.clinicDoctorList = $filter("filter")($scope.clinicDoctorList, { "DoctorID": doctorInfo.doctordata.User[0].DoctorID }, true);
                    $scope.selectedDoctor = $scope.clinicDoctorList[0];
                }

                if (RoleID === 1 && $scope.OrganizationSettingsData.ConsultationSettings != undefined) {
                    if (RoleID === 1 && $scope.OrganizationSettingsData.ConsultationSettings.IsConsultationRestricted === 1) {
                        $scope.clinicDoctorList = $filter("filter")($scope.clinicDoctorList, { "DoctorID": doctorInfo.doctordata.User[0].DoctorID }, true);
                        $scope.selectedDoctor = $scope.clinicDoctorList[0];
                    }
                }

                //$scope.clinicDoctorList.forEach(function (item) {
                //    if (item.DoctorID === doctorInfo.doctordata.User[0].DoctorID) {
                //        item.IsChecked = true;
                //    }
                //    else {
                //        item.IsChecked = false;
                //    }
                //});
                $scope.clinicDoctorList.forEach(function (item) {
                    item.IsChecked = true;
                });
                $scope.getAllInsuranceStatus();
                $scope.SearchPatientInsuranceslist();

            } else {
                alertify.error("No Users Found in Selected Departments");

            }
        }

        function onGetUsersFailure(data) {
        }
    }

    function GetBranchSubSpecializations(SubOrganizationId, BranchId, pagetype) {

        eHnoteMainAppointmentService.getBranchSubSpecializationsById(SubOrganizationId, BranchId).then(function (resp) {
            if (resp.data.row.length > 0) {
                $scope.allSubSpecializationsArray = resp.data.row;

                if (pagetype === 'PageLoad') {
                    $scope.newAllSubSpecializationsArray = angular.copy(resp.data.row);
                }


                angular.forEach($scope.allSubSpecializationsArray, function (item) {
                    item.isChecked = true;
                });
                $scope.getDoctorsbySubSpecializations(BranchId, pagetype);
            } else {
                $scope.allSubSpecializationsArray = [];
                $scope.newAllSubSpecializationsArray = [];
                $scope.clinicDoctorList = [];
                $scope.allUserList = [];
                $scope.selectedDoctor = "";
                alertify.error("No Departments are been added");
            }
        });
    };
    $scope.OrgSpecialitiesArray = [];
    function getBranchSpecializations(SubOrganizationId, BranchId, pagetype) {
        $scope.OrgSpecialitiesArray = [];
        if (BranchId === 0) {
            eHnoteMainAdminServices.getAllBranchSpecialitiesById(SubOrganizationId).then(function (resp) {
                if (resp.data.row.length > 0) {
                    $scope.OrgSpecialitiesArray = resp.data.row;
                    var specAll = { "SpecializationId": 0, "SpecializationName": "All Specialities" };
                    $scope.OrgSpecialitiesArray.unshift(specAll);
                }
            });
        } else {
            eHnoteMainAdminServices.getBranchSpecialitiesById(BranchId).then(function (resp) {
                if (resp.data.row.length > 0) {
                    $scope.OrgSpecialitiesArray = resp.data.row;
                    var specAll = { "SpecializationId": 0, "SpecializationName": "All Specialities" };
                    $scope.OrgSpecialitiesArray.unshift(specAll);
                }

            });
        }
    }
    function InitializeBranches(data, pagetype) {
        var clinicAddress = eHnoteUserAppointmentDataService.RestructureNewBranches($scope.UserAccessRights.AllAccessRights.APPListAllBranchesAppointments, data, doctorInfo) || [];

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
        $scope.BranchesListArray = clinicAddress;
        $scope.AppListdoctoraddress = clinicAddress;
        $scope.ApptBranchLocations = clinicAddress;
        $scope.AppListselectedclinic = $scope.AppListdoctoraddress[0];

        $scope.ApptBranchLocationsData = $filter("filter")($scope.ApptBranchLocations, function (iterator, ind) { return iterator.ClinicId !== 0; });
        $scope.PrintLocationsLength = $scope.ApptBranchLocationsData.length;

        var RoleID = $scope.userLoginDetails.RoleID;
      

        $scope.defaultbranch = $filter("filter")($scope.AppListdoctoraddress, function (item) {
            return item.BranchId === doctorInfo.doctordata.UserAddress[0].ClinicId;
        });

        $scope.selectedBranch = "";
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


        var freeezedCookeData = eHnoteMasterDataService.getSelectedOPUsers();
        freeezedCookeData = freeezedCookeData || ""

        if (freeezedCookeData === "") {
            if ($scope.selectedBranch.BranchId === 0) {
                if (doctorInfo.doctordata.UserAddress[0].SubOrganizationId) {
                    $scope.selectedBranch.SubOrganizationId = doctorInfo.doctordata.UserAddress[0].SubOrganizationId;
                    $scope.AppListselectedclinic.SubOrganizationId = doctorInfo.doctordata.UserAddress[0].SubOrganizationId;
                }

                angular.forEach($scope.ApptBranchLocations, function (mitem) {
                    mitem.IsChecked = true;
                });
                $scope.AppListselectedclinic.ClinicName = "All Locations";
            }
            else {
                angular.forEach($scope.ApptBranchLocations, function (mitem) {
                    if (mitem.ClinicId === $scope.selectedBranch.BranchId) {
                        mitem.IsChecked = true;
                        $scope.AppListselectedclinic.ClinicName = mitem.ClinicName;
                    }
                });
            }
        }
        else {
            if (freeezedCookeData.SelectedBranchesList.length > 0) {
                $scope.ApptBranchLocations.forEach(mitem => {
                    mitem.IsChecked = freeezedCookeData.SelectedBranchesList.some(sitem => mitem.ClinicId === sitem.ClinicId);
                });
                $scope.AppListselectedclinic.ClinicName = "Selected";
            }
            else {
                if ($scope.selectedBranch.BranchId === 0) {
                    if (doctorInfo.doctordata.UserAddress[0].SubOrganizationId) {
                        $scope.selectedBranch.SubOrganizationId = doctorInfo.doctordata.UserAddress[0].SubOrganizationId;
                        $scope.AppListselectedclinic.SubOrganizationId = doctorInfo.doctordata.UserAddress[0].SubOrganizationId;
                    }

                    angular.forEach($scope.ApptBranchLocations, function (mitem) {
                        mitem.IsChecked = true;
                    });
                    $scope.AppListselectedclinic.ClinicName = "All Locations";
                }
                else {
                    angular.forEach($scope.ApptBranchLocations, function (mitem) {
                        if (mitem.ClinicId === $scope.selectedBranch.BranchId) {
                            mitem.IsChecked = true;
                            $scope.AppListselectedclinic.ClinicName = mitem.ClinicName;
                        }
                    });
                }
            }
        }
       getBranchSpecializations($scope.selectedBranch.SubOrganizationId, $scope.selectedBranch.BranchId, pagetype);

        GetBranchSubSpecializations($scope.selectedBranch.SubOrganizationId, $scope.selectedBranch.BranchId, pagetype);
    }

    $scope.init = function () {

        var NewBranchList = localStorageFactory.getItem("allBranchesData") || [];
        InitializeBranches(NewBranchList, "PageLoad");
        eHnoteUserDataService.getspeciality(onspecsuccess, onspecfailure);
        function onspecsuccess(data) {
            $scope.specialitylist = data;
            var specAll = { "Id": 0, "Name": "All" };
            $scope.specialitylist.unshift(specAll);
        }

        function onspecfailure(data) {
        }
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

    };






    $scope.init();





    // Initialize selectedDoctors array
    $scope.selectedDoctors = [];

    // Function to toggle doctor selection
    $scope.toggleDoctorSelection = function (doctor) {
        const index = $scope.selectedDoctors.indexOf(doctor);
        if (index === -1) {
            $scope.selectedDoctors.push(doctor); // Add doctor if not already selected
        } else {
            $scope.selectedDoctors.splice(index, 1); // Remove doctor if already selected
        }
    };

    // Function to get the text of selected doctors
    $scope.getSelectedDoctorsText = function () {
        if ($scope.selectedDoctors.length > 0) {
            return $scope.selectedDoctors.map(function (doctor) {
                return doctor.FullName;
            }).join(', ');
        } else {
            return 'Select Doctors';
        }
    };

   





    $scope.PatientInsuranceListArray = [];


    $scope.claimwiseSearchType = 1;


    function getsearchPatientInsListObj() {
        var obj = {
            "PayorId": 0,
            "PayorObj": "",
            "HospitalId": $scope.HospitalId,
            "Patient": "",
            "PatientId": 0,
            "PatientObj": "",
            "StatusId": "",
            "StatusObj": "",
            "PageSize": 10,
            "PageNumber": 1,
            "SearchType": 1,
            "TotalCount": 0
        };
        return obj;
    }

    $scope.searchPatientInsListObj = getsearchPatientInsListObj();


    $scope.SerachGetOrgBasedPayor = function (val) {
        var param = {
            "SearchText": val,
            "PageSize": 20,
            "PageNumber": 1,
            "UserId": $scope.UserId,
            "SpecializationId": $scope.SpecializationId,
            "OrganizationId": $scope.HospitalId,
            "ParentOrganizationId": $scope.ParenthospitalId,
            "GetAllIndicator": 0,
            "PayorTypeId": 0//0
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

    $scope.onChangepayor = function (item) {
        $scope.searchPatientInsListObj.PayorId = item.PayorId;
        $scope.searchPatientInsListObj.PayorName = item.PayorName;
    };
    $scope.SelectedStatus = "";
    $scope.AllStatusCheck = false;
    $scope.InsuranceStatusArray = [];

    $scope.getAllInsuranceStatus = function () {

        eHnoteInsuranceService.GetAllInsuranceELigibilityStatusList().then(function (resp) {

            console.log(resp);
            $scope.InsuranceStatusArray = resp.data.rows || [];

            //var allobj = {
            //    "StatusId": 0,
            //    "StatusName": "All"
            //};
            //$scope.InsuranceStatusArray.unshift(allobj);
            if ($scope.InsuranceStatusArray.length > 0) {
                $scope.InsuranceStatusArray.forEach(item => {
                    item.IsChecked = true;
                });
                $scope.AllStatusCheck = true;
                $scope.SelectedStatus = "All";
            }




        }, function (err) {
            console.log(err);
            alertify.error("Getting Status List Failed");
        });
    };
    $scope.getAllInsuranceStatus();


    $scope.PatientsList = [];
    $scope.ChangePatientInsListSearch = function (type) {

        $scope.searchPatientInsListObj.PatientId = 0;
        $scope.PatientsList = [];

        $scope.searchPatientInsListObj.Patient = "";
        $scope.searchAppointmentInsListObj.PatientId = 0;
    };

    $scope.onSelectPatient = function (patientitem) {
        $scope.PatientsList = [];

        if ($scope.searchPatientInsListObj.SearchType === 1) {
            $scope.searchPatientInsListObj.Patient = patientitem.fullname;
            //  $scope.searchPatientInsListObj.PatientId = patientitem.PatientId;
            $scope.searchAppointmentInsListObj.PatientId = patientitem.PatientId;
        }
        if ($scope.searchPatientInsListObj.SearchType === 2) {
            $scope.searchPatientInsListObj.Patient = patientitem.MobileNo;
            //   $scope.searchPatientInsListObj.PatientId = patientitem.PatientId;
            $scope.searchAppointmentInsListObj.PatientId = patientitem.PatientId;
        }
        if ($scope.searchPatientInsListObj.SearchType === 3) {
            $scope.searchPatientInsListObj.Patient = patientitem.PatientDisplayId;
            //   $scope.searchPatientInsListObj.PatientId = patientitem.PatientId;
            $scope.searchAppointmentInsListObj.PatientId = patientitem.PatientId;
        }
    };

    $scope.PatientsWiseInsuranceList = [];
    $scope.SearchPatientInsuranceslist = function () {

        if ($scope.selectedBranch != undefined) {
            $scope.searchAppointmentInsListObj.HospitalId = $scope.selectedBranch.ClinicId;
        }
        if ($scope.selectedDoctor && $scope.selectedDoctor.DoctorID) {
            $scope.searchAppointmentInsListObj.DoctorId = $scope.selectedDoctor.DoctorID;
        } else {
            $scope.searchAppointmentInsListObj.DoctorId = $scope.UserId; 
        }


        var newDoclist = "";
        for (var i in $scope.clinicDoctorList) {
            if ($scope.clinicDoctorList[i].IsChecked) {
                newDoclist += "," + $scope.clinicDoctorList[i].DoctorID;
            }
        }
        if (newDoclist.charAt(0) === ",") {
            newDoclist = newDoclist.slice(1);
        }

        var newInnsurancelist = "";
        for (var i in $scope.InsuranceStatusArray) {
            if ($scope.InsuranceStatusArray[i].IsChecked) {
                newInnsurancelist += "," + $scope.InsuranceStatusArray[i].StatusId;
            }
        }
        if (newInnsurancelist.charAt(0) === ",") {
            newInnsurancelist = newInnsurancelist.slice(1);
        }

        var params = {
           /* "AppointmentDate": $scope.searchAppointmentInsListObj.AppointmentDate,*/
            "HospitalId": $scope.searchAppointmentInsListObj.HospitalId,
            "DoctorId": newDoclist || "",
            "PageSize": $scope.searchAppointmentInsListObj.PageSize,
            "PageNumber": $scope.searchAppointmentInsListObj.PageNumber,
            "PatientId": $scope.searchAppointmentInsListObj.PatientId,
            "StatusId": newInnsurancelist || "",
            "SearchWithEligibilityClaimNo": "",
            "FromDate": $scope.searchAppointmentInsListObj.FromDate,
            "ToDate": $scope.searchAppointmentInsListObj.ToDate,
            "PayorId": $scope.searchAppointmentInsListObj.PayorId || 0,
        }
        //if ($scope.searchPatientInsListObj.SearchType === 3) {
        //    $scope.searchPatientInsListObj.Patient = $scope.searchPatientInsListObj.Patient || "";
        //    if ($scope.searchPatientInsListObj.Patient != '') {
        //        params.SearchWithEligibilityClaimNo = $scope.searchPatientInsListObj.Patient;
        //    }
        //}

        eHnoteInsuranceService.GetAppointmentInsuranceListDetails(params).then(function (resp) {

            console.log(resp);

            $scope.PatientsWiseInsuranceList = [];
            if (resp.data.status === "Success") {
                if (resp.data.rows.length > 0) {
                    $scope.PatientsWiseInsuranceList = resp.data.rows || [];
                    $scope.searchPatientInsListObj.TotalCount = resp.data.count || 0;
                    angular.forEach($scope.PatientsWiseInsuranceList, function (item) {
                        item.isSelected = false;
                        item.isVerified = false;
                        item.isChecked = false;
                        item.IsShowEligibility = false;
                    });
                    $scope.ChangePatientsInsuranceList($scope.PatientsWiseInsuranceList[0]);
                }
            } else {
                alertify.error(resp.data.Message);
            }
        });

        $scope.IsPatientChecked=false
    };
    $scope.SearchPatientInsuranceslist();



    function LoadPatientSearch(object) {
        return InventoryService.SearchInvPatient(object).then(function (resp) {
            if (resp.data.data.length !== 0) {
                if (resp.data.data != undefined) {
                    $scope.PatientsList = resp.data.data || [];
                }
                return $scope.PatientsList.map(function (item) {
                    if (item.MobileNo === 0) {
                        item.MobileNo = "";
                    }
                    return item;
                });

            }
        }, function (err) { console.log(err); alertify.error("Search Patient Failed"); });
    }
    $scope.ChangePatientSearch = function (val, type) {
        $scope.searchAppointmentInsListObj.PatientId = 0;
        var object = {};
        if (type === 1) {
            if (val.length >= 3) {
                object = {
                    "ParentOrganizationId": $scope.ParenthospitalId,
                    "Name": val,
                    "Mobile": null,
                    "PatientId": null,
                    "MRNO": null,
                    "PageSize": 10,
                    "PageNo": 1
                };
                LoadPatientSearch(object);
            } else {
                $scope.PatientsList = [];
            }
        }
        if (type === 2) {
            if (val.length > 9) {
                object = {
                    "ParentOrganizationId": $scope.ParenthospitalId,
                    "Name": null,
                    "Mobile": val,
                    "PatientId": null,
                    "MRNO": null,
                    "PageSize": 10,
                    "PageNo": 1
                };
                LoadPatientSearch(object);
            } else {
                $scope.PatientsList = [];
            }
        }
        if (type === 3) {
            if (val.length >= 6) {
                object = {
                    "ParentOrganizationId": $scope.ParenthospitalId,
                    "Name": null,
                    "Mobile": null,
                    "PatientId": null,
                    "MRNO": val,
                    "PageSize": 10,
                    "PageNo": 1
                };
                LoadPatientSearch(object);
            }
        } else {
            $scope.PatientsList = [];
        }

    };
    $scope.GetOrganizationNewPayorAllList = function (val) {

        if (val == undefined || val == null || val == "") {
            $scope.searchAppointmentInsListObj.PayorId = 0;
            return false;
        }

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
    $scope.ChangePayorName = function (item) {
        $scope.searchAppointmentInsListObj.PayorId = item.PayorId;
        $scope.searchAppointmentInsListObj.PayorName = item.PayorName;
    }

    $scope.pageChanged = function (PageNumber) {
        $scope.searchAppointmentInsListObj.PageNumber = PageNumber;
        $scope.SearchPatientInsuranceslist();
    };

    $scope.CheckList = {
        "isSelectedAll": false,
        "isMultipleChecked": false
    };

    $scope.changecheckAllInsurance = function (val) {

        if (val) {
            angular.forEach($scope.PatientsWiseInsuranceList, function (mitem) {
                mitem.isSelected = true;
            });
        } else {
            angular.forEach($scope.PatientsWiseInsuranceList, function (mitem) {
                if (!mitem.isVerified) {
                    mitem.isSelected = false;
                }
            });
        }
    }

    $scope.changeIndividualPatientEligibility = function (item) {
        var isAllChecked = true;
        angular.forEach($scope.PatientsWiseInsuranceList, function (mitem) {
            if (!mitem.isSelected) {
                isAllChecked = false;
            }
        });

        if (!isAllChecked) {
            $scope.CheckList.isSelectedAll = false;
        }
        if (isAllChecked) {
            $scope.CheckList.isSelectedAll = true;
        }

    }


    $scope.checkIndividualPatientEligibility = function (item) {


     
        eHnoteInsuranceService.CheckPatientRealtimeInsuranceEligibility(item, onSuccess, onError);
        function onSuccess(resp) {
            
            console.log(resp);
            if (resp.Status == 'Success') {


                //$scope.SearchPatientInsuranceslist();
                var eligibilityresponse = resp.eligibiltystatus || [];
                if (eligibilityresponse.length > 0) {
                    $scope.PatientsWiseInsuranceList.forEach(function (item) {
                        if (item.PatientInsuranceDetailId === $scope.ElgibilityReviewObj.PatientInsuranceDetailId) {
                            item.EligibilityStatus = eligibilityresponse[0].EligibilityStatus;
                            item.EligibilityStatusId = eligibilityresponse[0].EligibilityStatusId;
                            if (item.EligibilityStatusId === 2) {
                                alertify.success("Insurance Eligibility Verified Successfully");
                            } else {
                                alertify.error("Insurance Eligibility Verified but found some errors");
                            }
                        }
                    });
                }

                $scope.SearchPatientInsuranceslist();

              }
              else if (resp.Status == 'Skipped') {
                    alertify.success("Eligibility request already submitted. Please try again later.");
                }
                else {
                    alertify.error("Insurance Eligibility Verification Failed");

                }

            //resp.errors = resp.errors || [];
            //if (resp.errors.length > 0) {
            //    //$scope.openErrorPopup(resp.errors);


            //    var eparams = {
            //        "UserId": $scope.UserId,
            //        "AppointmentInsuranceDetailId": item.PatientAppointmentInsuranceDetailId,
            //        "InsuranceEligibilityErrorStatusId": 0,
            //        "ErrorDetails": [],
            //        "VerifiedDate": $filter("date")(new Date(), "yyyy-MM-dd")
            //    }
            //    angular.forEach(resp.errors, function (eitem) {
            //        var eobj = {
            //            "Field": eitem.field,
            //            "Description": eitem.description
            //        }
            //        eparams.ErrorDetails.push(eobj);
            //    });



            //    eHnoteInsuranceService.UpdateInsuranceEligibilityErrorDetails(eparams).then(function (response) {
            //        if (response.data.status === 'Success') {

            //        }
            //        $scope.SearchPatientInsuranceslist();
            //    });

            //}
            //else {

            //    var PlanStatusCode = 0, PlanStatus = "", ResponseJson = "", insStatusId = 1;
            //    resp.planStatus = resp.planStatus || [];
            //    if (resp.planStatus.length > 0) {
            //        PlanStatusCode = parseFloat(resp.planStatus[0].statusCode) || 0;
            //        PlanStatus = resp.planStatus[0].status;
            //        ResponseJson = JSON.stringify(resp);
            //    }

            //    if (PlanStatusCode == 1) {
            //        insStatusId = 1;
            //    } else {
            //        insStatusId = 2;
            //    }

            //    var obj = {
            //        "UserId": $scope.UserId,
            //        "PatientId": item.PatientId,
            //        "VerificationDate": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
            //        "AppointmentInsuranceDetailId": item.PatientAppointmentInsuranceDetailId,
            //        "PatientInsuranceDetailId": item.PatientInsuranceDetailId,
            //        "PlanStatusCode": PlanStatusCode,
            //        "PlanStatus": PlanStatus,
            //        "PatientCoPayAmount": 0,
            //        "PatientCoPayPercentage": 0,
            //        "StatusId": insStatusId,
            //        "BenifitCoveragesList": [],
            //        "BenifitCoverageDetailsList": []
            //    }
            //    resp.benefitsInformation = resp.benefitsInformation || [];
            //    resp.planStatus = resp.planStatus || [];


            //    if (resp.planStatus.length > 0) {
            //        angular.forEach(resp.planStatus, function (psitem) {

            //            angular.forEach(psitem.serviceTypeCodes, function (subitem) {
            //                var sobj = {
            //                    "PatientEligibilityBenifitId": 0,
            //                    "ServiceTypeCode": subitem || 0,
            //                    "ServiceTypeName": "",
            //                    "Status": psitem.status,
            //                    "IsCopayIdentified": false,
            //                    "DeleteInd": false,
            //                }

            //                obj.BenifitCoveragesList.push(sobj);
            //            });

            //        });
            //    }
            //    resp.benefitsInformation = resp.benefitsInformation || [];
            //    if (resp.benefitsInformation.length > 0) {
            //        angular.forEach(resp.benefitsInformation, function (bitem) {

            //            var ServiceTypeCode = "", ServiceTypeName = "", AdditionalInformation = "";
            //            bitem.serviceTypeCodes = bitem.serviceTypeCodes || [];
            //            bitem.serviceTypes = bitem.serviceTypes || [];
            //            bitem.additionalInformation = bitem.additionalInformation || [];
            //            if (bitem.serviceTypeCodes.length > 0) {
            //                ServiceTypeCode = bitem.serviceTypeCodes[0];
            //            }
            //            if (bitem.serviceTypes.length > 0) {
            //                ServiceTypeName = bitem.serviceTypes[0];
            //            }
            //            if (bitem.additionalInformation.length > 0) {
            //                angular.forEach(bitem.additionalInformation, function (aitem, index) {
            //                    if (index == 0) {
            //                        AdditionalInformation += aitem.description;
            //                    } else {
            //                        AdditionalInformation += ", " + aitem.description;
            //                    }
            //                });
                          
            //            }
            //            bitem.benefitsDateInformation = bitem.benefitsDateInformation || '';
            //            var BenifitDateInformation = '';
            //            if (bitem.benefitsDateInformation != '') {
            //                bitem.benefitsDateInformation.plan = bitem.benefitsDateInformation.plan || '';
            //                bitem.benefitsDateInformation.benefit = bitem.benefitsDateInformation.benefit || '';
            //                BenifitDateInformation = bitem.benefitsDateInformation.plan == '' ? bitem.benefitsDateInformation.benefit : bitem.benefitsDateInformation.plan;
            //            }

            //            var sobj = {
            //                "PatientEligibilityBenifitDetailId": 0,
            //                "ServiceTypeCode": ServiceTypeCode || 0,
            //                "ServiceTypeName": ServiceTypeName || "",
            //                "BenifitTypeName": bitem.name,
            //                "BenifitAmount": bitem.benefitAmount || 0,
            //                "BenifitPercentage": bitem.benefitPercent || 0,
            //                "BenifitDateInformation": BenifitDateInformation || "",
            //                "TimeQualifier": bitem.timeQualifier || '',
            //                "TimeQualifierCode": bitem.timeQualifierCode || '',
            //                "CoverageLevel": bitem.coverageLevel || '',
            //                "inPlanNetworkIndicator": bitem.inPlanNetworkIndicator || "No",
            //                "AdditionalInformation": AdditionalInformation,
            //                "DeleteInd": false,
            //            }



            //            obj.BenifitCoverageDetailsList.push(sobj);

            //        });
            //    }



                 


            //    // console.log(JSON.stringify(obj));
            //    eHnoteInsuranceService.UpdatePatientInsuranceEligibilityResponse(obj).then(function (response) {
            //        console.log(response);
            //        if (response.data.status === 'Success') {
            //            item.StatusId = response.StatusId;
            //            item.StatusName = response.StatusName;
            //            $scope.searchAppointmentInsListObj = getAppointmentInsListReqObj();
            //            $scope.SearchPatientInsuranceslist();
            //        }

            //    });
            //}

        }
        function onError(reponse) {
        }

    };


    $scope.verifyAllInsurancesFortheDay = function () {


        angular.forEach($scope.PatientsWiseInsuranceList, function (pitem) {
            if (pitem.StatusId !== 2) {
                pitem.isSelected = true;
            } else {
                pitem.isSelected = false;
            }
        });
        $scope.checkEligibilityForallPatientInsuranceList();
    };



    $scope.checkEligibilityForallPatientInsuranceList = function () {


        var filteredArray = $filter("filter")($scope.PatientsWiseInsuranceList, { "isSelected": true });


        var flength = filteredArray.length || 0;
        var actualLength = 0;
        if (flength > 0) {
            actualLength = flength - 1;
        }

        console.log(actualLength);

        if (filteredArray.length > 0) {

            angular.forEach(filteredArray, function (item, indexx) {

                eHnoteInsuranceService.checkPatientInsuranceEligibilityById(item, onSuccess, onError);
                function onSuccess(resp) {


                    resp.errors = resp.errors || [];
                    if (resp.errors.length > 0) {

                        var eparams = {
                            "UserId": $scope.UserId,
                            "AppointmentInsuranceDetailId": item.PatientAppointmentInsuranceDetailId,
                            "InsuranceEligibilityErrorStatusId": 0,
                            "ErrorDetails": [],
                            "VerifiedDate": $filter("date")(new Date(), "yyyy-MM-dd")
                        }
                        angular.forEach(resp.errors, function (eitem) {
                            var eobj = {
                                "Field": eitem.field,
                                "Description": eitem.description
                            }
                            eparams.ErrorDetails.push(eobj);
                        });
                        eHnoteInsuranceService.UpdateInsuranceEligibilityErrorDetails(eparams).then(function (response) {
                            if (response.data.status === 'Success') {

                            }
                        });

                    }
                    else {

                        var PlanStatusCode = "", PlanStatus = "", ResponseJson = "",insStatusId=1;

                        if (resp.planStatus.length > 0) {
                            PlanStatusCode = parseFloat(resp.planStatus[0].statusCode)||0;
                            PlanStatus = resp.planStatus[0].status;
                            ResponseJson = JSON.stringify(resp);
                        }

                        if (PlanStatusCode == 1) {
                            insStatusId = 1;
                        } else {
                            insStatusId = 2;
                        }
                        var obj = {
                            "UserId": $scope.UserId,
                            "PatientId": item.PatientId,
                            "VerificationDate": $filter("date")(new Date(), "yyyy-MM-dd"),
                            "AppointmentInsuranceDetailId": item.PatientAppointmentInsuranceDetailId,
                            "PatientInsuranceDetailId": item.PatientInsuranceDetailId,
                            "PlanStatusCode": PlanStatusCode,
                            "PlanStatus": PlanStatus,
                            "PatientCoPayAmount": 0,
                            "PatientCoPayPercentage": 0,
                            "StatusId": insStatusId,
                            "BenifitCoveragesList": [],
                            "BenifitCoverageDetailsList": []
                        }
                        resp.benefitsInformation = resp.benefitsInformation || [];

                        resp.planStatus = resp.planStatus || [];


                        if (resp.planStatus.length > 0) {
                            angular.forEach(resp.planStatus, function (psitem) {
                                angular.forEach(psitem.serviceTypeCodes, function (subitem) {
                                    var sobj = {
                                        "PatientEligibilityBenifitId": 0,
                                        "ServiceTypeCode": subitem || 0,
                                        "Status": psitem.status,
                                        "IsCopayIdentified": false,
                                        "DeleteInd": false,
                                    }

                                    obj.BenifitCoveragesList.push(sobj);
                                });

                            });
                        }

                        //if (resp.benefitsInformation.length > 0) {
                        //    angular.forEach(resp.benefitsInformation, function (bitem) {
                        //        angular.forEach(bitem.serviceTypeCodes, function (subitem) {
                        //            bitem.benefitsDateInformation = bitem.benefitsDateInformation || '';
                        //            var BenifitDateInformation = '';
                        //            if (bitem.benefitsDateInformation != '') {
                        //                bitem.benefitsDateInformation.plan = bitem.benefitsDateInformation.plan || '';
                        //                bitem.benefitsDateInformation.benefit = bitem.benefitsDateInformation.benefit || '';
                        //                BenifitDateInformation = bitem.benefitsDateInformation.plan == '' ? bitem.benefitsDateInformation.benefit : bitem.benefitsDateInformation.plan;
                        //            }

                        //            var sobj = {
                        //                "PatientEligibilityBenifitDetailId": 0,
                        //                "ServiceTypeCode": subitem || 0,
                        //                "BenifitTypeName": bitem.name,
                        //                "BenifitAmount": bitem.benefitAmount || 0,
                        //                "BenifitPercentage": bitem.benefitPercent || 0,
                        //                "BenifitDateInformation": BenifitDateInformation || "",
                        //                "TimeQualifier": bitem.timeQualifier || '',
                        //                "TimeQualifierCode": bitem.timeQualifierCode || '',
                        //                "CoverageLevel": bitem.coverageLevel || '',
                        //                "inPlanNetworkIndicator": bitem.inPlanNetworkIndicator || "No",
                        //                "DeleteInd": false,
                        //            }

                        //            obj.BenifitCoverageDetailsList.push(sobj);
                        //        });

                        //    });
                        //}

                     
                        if (resp.benefitsInformation.length > 0) {
                            angular.forEach(resp.benefitsInformation, function (bitem) {

                                var ServiceTypeCode = "", ServiceTypeName = "", AdditionalInformation = "";
                                bitem.serviceTypeCodes = bitem.serviceTypeCodes || [];
                                bitem.serviceTypes = bitem.serviceTypes || [];
                                bitem.additionalInformation = bitem.additionalInformation || [];
                                if (bitem.serviceTypeCodes.length > 0) {
                                    ServiceTypeCode = bitem.serviceTypeCodes[0];
                                }
                                if (bitem.serviceTypes.length > 0) {
                                    ServiceTypeName = bitem.serviceTypes[0];
                                }
                                if (bitem.additionalInformation.length > 0) {
                                    angular.forEach(bitem.additionalInformation, function (aitem, index) {
                                        if (index == 0) {
                                            AdditionalInformation += aitem.description;
                                        } else {
                                            AdditionalInformation += ", " + aitem.description;
                                        }
                                    });

                                }
                                bitem.benefitsDateInformation = bitem.benefitsDateInformation || '';
                                var BenifitDateInformation = '';
                                if (bitem.benefitsDateInformation != '') {
                                    bitem.benefitsDateInformation.plan = bitem.benefitsDateInformation.plan || '';
                                    bitem.benefitsDateInformation.benefit = bitem.benefitsDateInformation.benefit || '';
                                    BenifitDateInformation = bitem.benefitsDateInformation.plan == '' ? bitem.benefitsDateInformation.benefit : bitem.benefitsDateInformation.plan;
                                }

                                var sobj = {
                                    "PatientEligibilityBenifitDetailId": 0,
                                    "ServiceTypeCode": ServiceTypeCode || 0,
                                    "ServiceTypeName": ServiceTypeName || "",
                                    "BenifitTypeName": bitem.name,
                                    "BenifitAmount": bitem.benefitAmount || 0,
                                    "BenifitPercentage": bitem.benefitPercent || 0,
                                    "BenifitDateInformation": BenifitDateInformation || "",
                                    "TimeQualifier": bitem.timeQualifier || '',
                                    "TimeQualifierCode": bitem.timeQualifierCode || '',
                                    "CoverageLevel": bitem.coverageLevel || '',
                                    "inPlanNetworkIndicator": bitem.inPlanNetworkIndicator || "No",
                                    "AdditionalInformation": AdditionalInformation,
                                    "DeleteInd": false,
                                }



                                obj.BenifitCoverageDetailsList.push(sobj);

                            });
                        }

                        eHnoteInsuranceService.UpdatePatientInsuranceEligibilityResponse(obj).then(function (response) {
                            console.log(response);
                            if (response.data.status === 'Success') {
                                item.StatusId = response.StatusId;
                                item.StatusName = response.StatusName;
                                $scope.searchAppointmentInsListObj = getAppointmentInsListReqObj();
                                $scope.SearchPatientInsuranceslist();
                            }

                        });
                    }



                    if (indexx === actualLength) {
                        $scope.SearchPatientInsuranceslist();
                    }

                }

                function onError(reponse) {
                }

            });
        }





    };


    $scope.showEligibilityErrors = function (item) {

        eHnoteInsuranceService.GetPatientInsuranceEligibilityErrorDetails(item.PatientInsuranceDetailId).then(function (response) {
            console.log(JSON.stringify(response));
            $scope.openErrorPopup(response.data.ErrorDetails);
        });

        //eHnoteInsuranceService.GetInsuranceEligibilityErrorDetails(item.PatientAppointmentInsuranceDetailId).then(function (response) {
        //    console.log(JSON.stringify(response));

        //    //if (response.data.ErrorDetails.length > 0) {
        //        $scope.openErrorPopup(response.data.ErrorDetails);
        //    //}




        //});



    }
    $scope.openErrorPopup = function (errorsArray) {
        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/PatientInsuranceVerifyError.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            "size": "md",
            "windowClass": "",
            "resolve": {
                "ErrorArray": function () { return errorsArray; },
            },
            "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService, ErrorArray) {
                $scope.closeadvisedItems = function () {
                    $uibModalInstance.dismiss("cancel");
                };
                $scope.ErrorsList = ErrorArray || [];

                $scope.discardProcedures = function () {
                    $scope.selectedProcedures = [];
                    $uibModalInstance.dismiss("cancel");
                }
            }
        });
    }

    $scope.$watch("PatientsWiseInsuranceList", function (newVal, oldVal) {

        if ($scope.PatientsWiseInsuranceList.length === 0) { return; }
        $scope.CheckList.isMultipleChecked = false;

        var filterArray = $filter("filter")($scope.PatientsWiseInsuranceList, { "isSelected": true });
        filterArray = filterArray || [];
        if (filterArray.length > 1) {
            $scope.CheckList.isMultipleChecked = true;
        }

    }, true);

    //GetCheckInsuranceEligibilityById
    $scope.InsuranceEligibility = [];
    $scope.CheckInsuranceEligibility = function (item) {
        if (!item.IsShowEligibility) {
            angular.forEach($scope.PatientsWiseInsuranceList, function (subitem) {
                subitem.IsShowEligibility = false;
            });
            item.IsShowEligibility = true;
            $scope.InsuranceEligibility = [];
            $scope.BenifitEligibilityCoverageList = [];

            item.PatientAppointmentInsuranceDetailId = item.PatientAppointmentInsuranceDetailId || 0;
            //item.PatientAppointmentInsuranceDetailId = 39;
            if (item.PatientAppointmentInsuranceDetailId == 0) {
                return false;
            }
            eHnoteInsuranceService.GetCheckInsuranceEligibilityById(item.PatientInsuranceDetailId).then(function (resp) {
                //$scope.InsuranceEligibility = [];
                $scope.BenifitCoverageDetailsList = [];
                if (resp.data.status == "Success") {
                    resp.data.rows = resp.data.rows || [];

                    if (resp.data.rows.length > 0) {
                        resp.data.rows[0].BenifitCoverageDetailsList = resp.data.rows[0].BenifitCoverageDetailsList || [];
                        resp.data.rows[0].BenifitCoveragesList = resp.data.rows[0].BenifitCoveragesList || [];
                        if (resp.data.rows[0].BenifitCoverageDetailsList.length > 0) {

                            angular.forEach(resp.data.rows[0].BenifitCoveragesList, function (hitem) {
                                var temarray = $filter("filter")(resp.data.rows[0].BenifitCoverageDetailsList, function (item, index) { return item.ServiceTypeCode === hitem.ServiceTypeCode }, true);
                                if (temarray.length !== 0) {
                                    var obj = {
                                        "ServiceTypeCode": hitem.ServiceTypeCode,
                                        "ServiceTypeName": hitem.ServiceTypeName,
                                        "Status": hitem.Status,
                                        "BenifitCoverageDetailsList": temarray || [],
                                    }
                                    $scope.BenifitEligibilityCoverageList.push(obj);

                                }

                            });




                            //angular.forEach(resp.data.rows[0].BenifitCoveragesList, function (InItem) {
                            //    angular.forEach(resp.data.rows[0].BenifitCoverageDetailsList, function (BItem) {
                            //        if (InItem.ServiceTypeCode = BItem.ServiceTypeCode) {
                            //            var obj = {
                            //                "ServiceTypeCode": InItem.ServiceTypeCode,
                            //                "ServiceName": InItem.ServiceName,
                            //                "Status": InItem.Status,                                        
                            //            }
                            //            obj.BenifitCoverageDetailsList = obj.BenifitCoverageDetailsList || [];
                            //            obj.BenifitCoverageDetailsList.push(BItem);
                            //        }
                            //    });
                            //});
                        }
                    }
                    //resp.data.EligibilityStatus = resp.data.EligibilityStatus || [];
                    //if (resp.data.EligibilityStatus.length > 0) {
                    //    $scope.InsuranceEligibility = resp.data.EligibilityStatus;
                    //    angular.forEach($scope.InsuranceEligibility, function (InItem) {
                    //        InItem.ServiceTypeCodes = JSON.parse(InItem.ServiceTypeCodes);
                    //        InItem.ServiceTypes = JSON.parse(InItem.ServiceTypes);
                    //    });

                    //    // var jsonstring = JSON.parse($scope.InsuranceEligibility[0].ServiceTypeCodes);
                    //}
                } else {
                    alertify.error(resp.data.Message);
                }
            }, function (error) {
            });
        } else {
            item.IsShowEligibility = false;
        }
    };

    //$scope.showEligibilityDetail = function (item) {
    //   $scope.CheckInsuranceEligibility(item.PatientAppointmentInsuranceDetailId);
    //}
    // Ensure selected clinics are set initially

    $scope.changeAppointmentBranch = function (obj) {
        if (obj.IsChecked) {
            if (obj.ClinicId === 0) {
                angular.forEach($scope.AppListdoctoraddress, function (mitem) {
                    mitem.IsChecked = true;
                });
            } else {
                var allSelected = $scope.AppListdoctoraddress
                    .filter(item => item.ClinicId !== 0)
                    .every(item => item.IsChecked);

                if (allSelected) {
                    $scope.AppListdoctoraddress.forEach(item => {
                        if (item.ClinicId === 0) {
                            item.IsChecked = true;
                        }
                    });
                }
            }
        } else {
            if (obj.ClinicId === 0) {
                angular.forEach($scope.AppListdoctoraddress, function (mitem) {
                    mitem.IsChecked = false;
                });
            } else {
                obj.IsChecked = false;
                $scope.AppListdoctoraddress.forEach(item => {
                    if (item.ClinicId === 0) {
                        item.IsChecked = false;
                    }
                });
            }
        }
        var selectedItems = $scope.AppListdoctoraddress.filter(item => item.IsChecked && item.ClinicId !== 0);
        var selectedCount = selectedItems.length;
        var allSelected = $scope.AppListdoctoraddress
            .filter(item => item.ClinicId !== 0)
            .every(item => item.IsChecked);

        if (selectedCount === 0) {
            //$scope.AppListselectedclinic.ClinicName = "Select Location";
            //$scope.AppListselectedclinic.ClinicId = "";
        } else if (selectedCount === 1) {
            $scope.AppListselectedclinic.ClinicName = selectedItems;
        } 
        var selectedIds = selectedItems.map(item => item.ClinicId);

        $scope.selectedBranch = {
            ...obj,
            ClinicId: selectedIds.join(',')
        };

        $scope.AppListselectedclinic = $scope.selectedBranch;

        if ($scope.selectedBranch.BranchId === 0 && doctorInfo.doctordata.UserAddress[0].SubOrganizationId) {
            $scope.selectedBranch.SubOrganizationId = doctorInfo.doctordata.UserAddress[0].SubOrganizationId;
            $scope.AppListselectedclinic.SubOrganizationId = doctorInfo.doctordata.UserAddress[0].SubOrganizationId;
        }

        getBranchSpecializations($scope.selectedBranch.SubOrganizationId, $scope.selectedBranch.BranchId, '');
        GetBranchSubSpecializations($scope.selectedBranch.SubOrganizationId, $scope.selectedBranch.BranchId, '');
    };

    $scope.changeDoctor = function (item) {
        if (item != "") {
            $scope.selectedDoctor = item;
        }
    }
    $scope.AllDoctorsObj={
        "AllDoctorCheck": "",
        "selectedDoctors" : ""
    }
    $scope.AllDoctorsObj.AllDoctorCheck = false;
    $scope.DoctorToggle = function () {
        var doctorList = $scope.clinicDoctorList||[];
        var checkedArray = doctorList.filter(item => item.IsChecked);
        $scope.AllDoctorsObj.AllDoctorCheck = (checkedArray.length > 0 && checkedArray.length === doctorList.length);
        if (typeof $scope.selectedDoctor !== 'object' || !$scope.selectedDoctor) {
            $scope.selectedDoctor = {};
        }
        if (checkedArray.length === 0) {
            $scope.AllDoctorsObj.selectedDoctors = "Select Doctor";
            //$scope.selectedDoctor.SecondUserFullName = "Select Doctor";
            $scope.selectedDoctor.DoctorID = "";
        } else if (checkedArray.length === 1) {
            $scope.AllDoctorsObj.selectedDoctors = checkedArray[0].SecondUserFullName + '-' + checkedArray[0].NPI;
            $scope.selectedDoctor.SecondUserFullName = checkedArray[0].SecondUserFullName + '-' + checkedArray[0].NPI;
            $scope.selectedDoctor.DoctorID = checkedArray[0].DoctorID;
        } else {
           // $scope.selectedDoctor.SecondUserFullName = "Selected Doctors";
            $scope.AllDoctorsObj.selectedDoctors = "Select Doctor";
            $scope.selectedDoctor.DoctorID = checkedArray.map(item => item.DoctorID).join(',');
        }
    };

    $scope.checkAllDoctor = function (val) {
        var doctorList = $scope.clinicDoctorList||[];

        angular.forEach(doctorList, function (item) {
            item.IsChecked = val;
        });

        if (val) {
            //$scope.selectedDoctor.SecondUserFullName = "All";
            $scope.AllDoctorsObj.selectedDoctors = "All"
            if (typeof $scope.selectedDoctor !== 'object' || !$scope.selectedDoctor) {
                $scope.selectedDoctor = {};
            }
            $scope.selectedDoctor.DoctorID = doctorList.map(item => item.DoctorID).join(',');
        } else {
            $scope.AllDoctorsObj.selectedDoctors = "Select Doctor";
            //$scope.selectedDoctors.SecondUserFullName = "Select Doctor";
            if (typeof $scope.selectedDoctor !== 'object' || !$scope.selectedDoctor) {
                $scope.selectedDoctor = {};
            }
            $scope.selectedDoctor.DoctorID = "";
        }

        $scope.AllDoctorsObj.AllDoctorCheck = val;
    };
  
    $scope.isStatusChecked = function (check) {
        //const selectedIds = $scope.searchAppointmentInsListObj.StatusId
        //    ? $scope.searchAppointmentInsListObj.StatusId.split(',').map(Number)
        //    : [];

        //if (statusId === 0) {
        //    const allIds = $scope.InsuranceStatusArray
        //        .filter(s => s.StatusId !== 0)
        //        .map(s => s.StatusId);

        //    return allIds.every(id => selectedIds.includes(id));
        //}

        //return selectedIds.includes(statusId);
        var statusList = $scope.InsuranceStatusArray||[];

        angular.forEach(statusList, function (item) {
            item.IsChecked = check;
        });

        if (check) {
            $scope.SelectedStatus = "All";
            $scope.searchAppointmentInsListObj.StatusId = statusList.map(item => item.StatusId).join(',');
        } else {
            $scope.selectedDoctors.SelectedStatus = "Select Status";
            $scope.selectedDoctor.DoctorID = "";
        }

        $scope.AllStatusCheck = check;
    };

  

    $scope.toggleStatusCheckbox = function (statusId) {

        var statusList = $scope.InsuranceStatusArray||[];
        var checkedArray = statusList.filter(item => item.IsChecked);
        $scope.AllStatusCheck = (checkedArray.length > 0 && checkedArray.length === statusList.length);

        if (checkedArray.length === 0) {
            $scope.SelectedStatus = "Select Status";
            $scope.searchAppointmentInsListObj.StatusId = "";
        } else if (checkedArray.length === 1) {
            $scope.SelectedStatus = checkedArray[0].StatusName;
            $scope.searchAppointmentInsListObj.StatusId = checkedArray[0].StatusId;
        } else {
            $scope.SelectedStatus = "Selected Status";
            $scope.searchAppointmentInsListObj.StatusId = checkedArray.map(item => item.StatusId).join(',');
        }

        //let selectedIds = $scope.searchAppointmentInsListObj.StatusId
        //    ? $scope.searchAppointmentInsListObj.StatusId.split(',').map(Number)
        //    : [];

        //if (statusId === 0) {
        //    const allIds = $scope.InsuranceStatusArray
        //        .filter(s => s.StatusId !== 0)
        //        .map(s => s.StatusId);

        //    const isAllSelected = allIds.every(id => selectedIds.includes(id));
        //    selectedIds = isAllSelected ? [] : allIds;
        //} else {
        //    const index = selectedIds.indexOf(statusId);
        //    if (index > -1) {
        //        selectedIds.splice(index, 1);
        //    } else {
        //        selectedIds.push(statusId);
        //    }
        //}
        //$scope.searchAppointmentInsListObj.StatusId = selectedIds.join(',');
        //const selectedStatus = $scope.InsuranceStatusArray.filter(item =>
        //    selectedIds.includes(item.StatusId)
        //);

        //const count = selectedStatus.length;

        //// Update SelectedStatus label
        //if (count === 0) {
        //    $scope.SelectedStatus = "Select Status";
        //} else if (count === 1) {
        //    $scope.SelectedStatus = selectedStatus[0].StatusName;
        //    $scope.SelectedStatus = selectedStatus[0].StatusName;
        //}
        //else if (count>1 && count<6)
        //{
        //    $scope.SelectedStatus = "Select Status";

        //}
        //else {
        //    $scope.SelectedStatus = selectedStatus.map(s => s.StatusName).join(', ');
        //    $scope.SelectedStatus = "All";
        //}


    };


    $scope.ClearInsuranceEligibilityList = function () {
        $scope.searchAppointmentInsListObj = getAppointmentInsListReqObj();
        var NewBranchList = localStorageFactory.getItem("allBranchesData") || [];
        InitializeBranches(NewBranchList, "PageLoad");
        $scope.searchPatientInsListObj = getsearchPatientInsListObj();
        
        $timeout(function () {
            $scope.SearchPatientInsuranceslist();
            $scope.getAllInsuranceStatus();
        }, 500);
       // $scope.init();
    }

    $scope.ProviderIDTypearray = [
        { "Id": 1, "Name": "NPI" },
        { "Id": 2, "Name": "Provider Id" }
    ];
    function getElgibilityReviewNewObj() {
        var obj = {
            "PatientInsuranceDetailId": 0,
            "AppointmentInsuranceDetailId":0,
            "ProviderIDTypeObj": $scope.ProviderIDTypearray[0],
            "ProviderID": "",
            "BranchName": "",
            "HospitalName": "",
            "RelationShipId":1,
            "PayorName": "",
            "PlanName": "",
            "GroupId": "",
            "MemberId": "",
            "FirstName": "",
            "LastName": "",
            "DOB": "",
            "Gender": "Male",
            "PatientSSN": "",
            "InsuredPersonFirstName": "",
            "InsuredPersonLastName": "",
            "InsuredPersonDOB": "",
            "InsuredPersonGenderID": "",
            "InsuredPersonSSN": "",
            "ServiceFrom":"",
            "ServiceTypeobj": "",
            "SerciceFrom": $filter('date')(new Date(), "MM-dd-yyyy"),
            "ServiceTo": $filter('date')(new Date(), "MM-dd-yyyy")          
        };
        return obj;
    };
    $scope.ElgibilityReviewObj = getElgibilityReviewNewObj();
    //$scope.SelectVerifyDetails = {};

    $scope.InsuranceVerifyPopup = function (verifyDetails) {
        if (verifyDetails == "" || verifyDetails == null) {
            return false;
        }
        $scope.ElgibilityReviewObj = "";
        $scope.ElgibilityReviewObj = verifyDetails;
        $scope.ElgibilityReviewObj.ProviderIDTypeObj = $scope.ProviderIDTypearray[0];
        $scope.ElgibilityReviewObj.ProviderID = "";
        $scope.ElgibilityReviewObj.ServiceTypeobj = "";
        $scope.ElgibilityReviewObj.ServiceFrom = $filter('date')(new Date(verifyDetails.AppointmentDate), "MM-dd-yyyy");
        $scope.ElgibilityReviewObj.ServiceTo = $filter('date')(new Date(verifyDetails.AppointmentDate), "MM-dd-yyyy");

        $scope.ElgibilityReviewObj.ProviderID = $scope.ElgibilityReviewObj.NPI;
        $scope.ElgibilityReviewObj.MemberId = $scope.ElgibilityReviewObj.PolicyId;
        $scope.ElgibilityReviewObj.GroupId = $scope.ElgibilityReviewObj.GroupId || "";
        $scope.ElgibilityReviewObj.DOB = $filter('date')($scope.ElgibilityReviewObj.DOB, 'MM/dd/yyyy');

        if ($scope.ElgibilityReviewObj.RelationShipId == 1) {
            //var Dob = "";
            //if ($scope.ElgibilityReviewObj.DOB != '' && $scope.ElgibilityReviewObj.DOB != null) {
            //    Dob = $filter('date')(new Date($scope.ElgibilityReviewObj.DOB), "MM-dd-yyyy") || "";
            //}
            //$scope.ElgibilityReviewObj.DOB = Dob;
        } else {
            //var Dob = "";
            //if ($scope.ElgibilityReviewObj.InsuredPersonDOB != '' && $scope.ElgibilityReviewObj.InsuredPersonDOB != null) {
            //    Dob = $filter('date')(new Date($scope.ElgibilityReviewObj.InsuredPersonDOB), "MM-dd-yyyy") || "";
            //}
            //$scope.ElgibilityReviewObj.InsuredPersonDOB = Dob;

            var gender = "";
            if ($scope.ElgibilityReviewObj.InsuredPersonGenderID != "") {
                gender = $scope.ElgibilityReviewObj.InsuredPersonGenderID == "F" ? "Female" : ($scope.ElgibilityReviewObj.InsuredPersonGenderID == "M" ? "Male" : '');
            }
            $scope.ElgibilityReviewObj.InsuredPersonGenderID = gender || "";
            // ❌ REMOVED: $scope.ElgibilityReviewObj.InsuredPersonLastName = "";  
        }

        if ($scope.ElgibilityReviewObj.AppointmentTOSCodes.length === 1) {

            $scope.ElgibilityReviewObj.ServiceTypeobj = $filter("filter")($scope.OrgTOSCODESArray, function (Nitem) {
                return Nitem.MedicalServicesId === $scope.ElgibilityReviewObj.AppointmentTOSCodes[0].TOSCodeId;
            })[0] || "";
        } else {

            $scope.ElgibilityReviewObj.ServiceTypeobj = $filter("filter")($scope.OrgTOSCODESArray, function (Nitem) {
                return Nitem.Code === "30";
            },true)[0] || "";
        }

        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "InsuranceVerfiy.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
           /* "size": "lg"*/
            // "windowClass": "inventory-full-popup"
            "windowClass": "appointment-full-popup",
        });
    };

    $scope.closeverify = function () {
        $scope.mInstanceAdd.dismiss("cancel");
    };
    $scope.OrganizationBillingProviderList = [];
    $scope.OrganizationClearingHouseDetails = [];
    $scope.GetOrganizationBillingProviders = function () {
        var bobj = {
            "OrganizationId": $scope.HospitalId || 0,
            "ParentOrganizationId": $scope.ParenthospitalId,
            "FacilityCode": "",
            "PageNumber": 1,
            "PageSize": 20
        };
        eHnoteSettingsDataService.GetOrganizationBillingProviders(bobj)
            .then(function (resp) {
                if (resp.data.Status === "Success") {
                    $scope.OrganizationBillingProviderList = resp.data.rows || [];
                    console.log($scope.OrganizationBillingProviderList);
                    console.log("Billing Provider Details");
                }

            }, function (err) {
                console.log(err);
                alertify.error("Getting Data Failed");
            });
    }
    $scope.OrganizationClearingHouseDetails = function () {

        eHnoteSettingsDataService.GetAllMasterClaimsData($scope.HospitalId)
            .then(function (resp) {
                if (resp.data.status === "Success") {
                    $scope.OrganizationClearingHouseDetails = resp.data.ConnectedClearingHouse || [];
                }

            }, function (err) {
                console.log(err);
                alertify.error("Getting Data Failed");
            });
    }

    $scope.GetOrganizationBillingProviders();
    $scope.OrganizationClearingHouseDetails();
    $scope.Saveverify = function (item, getItem) {
        // $scope.mInstanceAdd.dismiss("cancel");
        $scope.ElgibilityReviewObj.ProviderIDTypeObj = $scope.ElgibilityReviewObj.ProviderIDTypeObj || "";
        if ($scope.ElgibilityReviewObj.ProviderIDTypeObj == "") {
            alertify.error("Select ID Type");
            return false;
        }
        if ($scope.ElgibilityReviewObj.ProviderID == "") {
            alertify.error("Enter ID");
            return false;
        }
        if ($scope.ElgibilityReviewObj.HospitalName == "") {
            alertify.error("Select Organization Name");
            return false;
        }
        if ($scope.ElgibilityReviewObj.PayorName == "") {
            alertify.error("Select Payor");
            return false;
        }
        if ($scope.ElgibilityReviewObj.PlanName == "") {
            alertify.error("Select Plan");
            return false;
        }
        if ($scope.ElgibilityReviewObj.PolicyId == "") {
            alertify.error("Enter Policy Number");
            return false;
        }

        if ($scope.ElgibilityReviewObj.MemberId == "") {
            alertify.error("Enter Member ID");
            return false;
        }
        if ($scope.ElgibilityReviewObj.RelationShipId == 1) {
            if ($scope.ElgibilityReviewObj.FirstName == "") {
                alertify.error("Enter First Name");
                return false;
            }
            if ($scope.ElgibilityReviewObj.LastName == "") {
                alertify.error("Enter Last Name");
                return false;
            }
            $scope.ElgibilityReviewObj.DOB = $scope.ElgibilityReviewObj.DOB || "";
            if ($scope.ElgibilityReviewObj.DOB == "") {
                alertify.error("Select DOB");
                return false;
            }
            if ($scope.ElgibilityReviewObj.Gender == "") {
                alertify.error("Select Gender");
                return false;
            }
            if ($scope.ElgibilityReviewObj.EligibilityPayorId === null || $scope.ElgibilityReviewObj.EligibilityPayorId === undefined || $scope.ElgibilityReviewObj.EligibilityPayorId === "") {
                alertify.error("Invalid Payer ID. Please check and try again.");
                return;
            }
            const isEligible = !!$scope.ElgibilityReviewObj.SubmitInsuranceEligibilityElectronically;
            if (!isEligible) {
                alertify.error("Real-Time Eligibility is not supported by this payer.");
                return;
            }
            //if ($scope.ElgibilityReviewObj.PatientSSN == "") {
            //    alertify.error("Enter SSN");
            //    return false;
            //} else {
            //    var stringSSN = $scope.ElgibilityReviewObj.PatientSSN.toString();
            //    if (stringSSN.length === 9) { }
            //    else {
            //        alertify.error("Enter Valid SSN");
            //        return false;
            //    }
            //}
        }
        else {
            if ($scope.ElgibilityReviewObj.InsuredPersonFirstName == "") {
                alertify.error("Enter Insured Person First Name");
                return false;
            }
            if ($scope.ElgibilityReviewObj.InsuredPersonLastName == "") {
                alertify.error("Enter Insured Person Last Name");
                return false;
            }
            $scope.ElgibilityReviewObj.InsuredPersonDOB = $scope.ElgibilityReviewObj.InsuredPersonDOB || "";
            if ($scope.ElgibilityReviewObj.InsuredPersonDOB == "") {
                alertify.error("Select Insured Person DOB");
                return false;
            }
            if ($scope.ElgibilityReviewObj.InsuredPersonGenderID == "") {
                alertify.error("Select Insured Person Gender");
                return false;
            }
            if ($scope.ElgibilityReviewObj.EligibilityPayorId === null || $scope.ElgibilityReviewObj.EligibilityPayorId === undefined || $scope.ElgibilityReviewObj.EligibilityPayorId === "") {
                alertify.error("Invalid Payer ID. Please check and try again.");
                return;
            }
            const isEligible = !!$scope.ElgibilityReviewObj.SubmitInsuranceEligibilityElectronically;
            if (!isEligible) {
                alertify.error("Real-Time Eligibility is not supported by this payer.");
                return;
            }
            //if ($scope.ElgibilityReviewObj.InsuredPersonSSN == "") {
            //    alertify.error("Enter SSN");
            //    return false;
            //}
            //else {
            //    var stringSSN = $scope.ElgibilityReviewObj.InsuredPersonSSN.toString();
            //    if (stringSSN.length === 9) { }
            //    else {
            //        alertify.error("Enter Valid SSN");
            //        return false;
            //    }
            //}
        }
       
        $scope.ElgibilityReviewObj.OrganizationId = $scope.ElgibilityReviewObj.HospitalId;
        var serviceTypeCodes = [];

        $scope.ElgibilityReviewObj.ServiceTypeobj = $scope.ElgibilityReviewObj.ServiceTypeobj || "";
        if ($scope.ElgibilityReviewObj.ServiceTypeobj !== '') {
            $scope.ElgibilityReviewObj.ServiceTypeobj.Code = $scope.ElgibilityReviewObj.ServiceTypeobj.Code || "";
            if ($scope.ElgibilityReviewObj.ServiceTypeobj.Code != '') {
                serviceTypeCodes.push($scope.ElgibilityReviewObj.ServiceTypeobj.Code);
            }
        }

        $scope.ElgibilityReviewObj.serviceTypeCodes = serviceTypeCodes || [];
        $scope.ElgibilityReviewObj.InsuredPersonGenderID = $scope.ElgibilityReviewObj.InsuredPersonGenderID == "Female" ? "F" : ($scope.ElgibilityReviewObj.InsuredPersonGenderID == "Male" ? "M" : '');
        var params = {
            "UserId": $scope.UserId,
            "SNO": 1,
            "PatientAppointmentInsuranceDetailId": 0,
            "AppointmentId": 0,
            "AppointmentDate": $filter('date')(new Date($scope.appDate), "yyyy-MM-dd"),
            //"AppointmentInsuranceNumber": $scope.ElgibilityReviewObj.PatientInsuranceControlNumber,
            "AppointmentInsuranceNumber": 0,
            "DoctorName": $scope.ElgibilityReviewObj.DoctorName,
            "UserProviderId": $scope.ElgibilityReviewObj.UserProviderId,
            "HospitalId": $scope.ElgibilityReviewObj.HospitalId,
            "AppointmentTOSCodes": [

            ],
            "NPI": $scope.ElgibilityReviewObj.NPI,
            "TaxId": $scope.ElgibilityReviewObj.TaxId,
            "ProviderCode": "H",
            //"serviceProviderNumber": $scope.selectedDocObject.selectedPerson.serviceProviderNumber,
            "serviceProviderNumber": 0,
            "HospitalName": $scope.ElgibilityReviewObj.HospitalName,
            "AppointmentTime": $scope.ElgibilityReviewObj.AppointmentTime,
            "AppointmentPatientTypeId": 1,
            "AppointmentPatientType": "New Patient",
            "PatientInsuranceDetailId": $scope.ElgibilityReviewObj.PatientInsuranceDetailId,
            "PatientId": $scope.ElgibilityReviewObj.PatientId,
            "PatientMrNo": $scope.ElgibilityReviewObj.PatientMrNo,
            "Gender": $scope.ElgibilityReviewObj.Gender,
            "DOB": $scope.ElgibilityReviewObj.DOB,
            "FirstName": $scope.ElgibilityReviewObj.FirstName,
            "LastName": $scope.ElgibilityReviewObj.LastName,
            "SecondLastName": $scope.ElgibilityReviewObj.SecondLastName||"",
            "TitleId": 1,
            "Title": "Mr",
            "PatientFirstName": $scope.ElgibilityReviewObj.FirstName,
            "PatientLastName": $scope.ElgibilityReviewObj.LastName,
            "PatientMobile": $scope.ElgibilityReviewObj.PatientMobile,
            "PatientContact": $scope.ElgibilityReviewObj.PatientContact,
            "HomeNumber": $scope.ElgibilityReviewObj.HomeNumber,
            "HomeAreaCode": $scope.ElgibilityReviewObj.HomeAreaCode,
            "HomeCountryCode": $scope.ElgibilityReviewObj.HomeCountryCode,
            "OfficeNumber": $scope.ElgibilityReviewObj.OfficeNumber,
            "OfficeAreaCode": $scope.ElgibilityReviewObj.OfficeAreaCode,
            "OfficeCountryCode": $scope.ElgibilityReviewObj.OfficeCountryCode,
            "PatientGender": $scope.ElgibilityReviewObj.Gender,
            "PatientSSN": $scope.ElgibilityReviewObj.PatientSSN,
            "PayorId": $scope.ElgibilityReviewObj.PayorId,
            "PayorName": $scope.ElgibilityReviewObj.PayorName,
            "PlanName": $scope.ElgibilityReviewObj.PlanName,
            "PlanTypeId": $scope.ElgibilityReviewObj.PlanTypeId,
            "PlanTypeName": $scope.ElgibilityReviewObj.PlanTypeName,
            "PlanId": $scope.ElgibilityReviewObj.PlanId,
            "InsuranceEffectiveDate": $scope.ElgibilityReviewObj.InsuranceEffectiveDate,
            "InsuranceExpiryDate": $scope.ElgibilityReviewObj.InsuranceExpiryDate,
            "RelationShipId": $scope.ElgibilityReviewObj.RelationShipId,
            "RelationName": $scope.ElgibilityReviewObj.RelationName,
            "VerifiedDate": "",
            "Coinsurance": null,
            "VisitCopay": null,
            "CoverageId": 1,
            "InsuredPersonSSN": $scope.ElgibilityReviewObj.InsuredPersonSSN,
            "PolicyHolder": "",
            "InsuranceStatusId": 1,
            "InsuredPersonFirstName": $scope.ElgibilityReviewObj.InsuredPersonFirstName,
            "InsuredPersonLastName": $scope.ElgibilityReviewObj.InsuredPersonLastName,
            "InsuredPersonDOB": $scope.ElgibilityReviewObj.InsuredPersonDOB,
            "InsuredPersonGenderID": $scope.ElgibilityReviewObj.InsuredPersonGenderID,
            "InsuranceStatusName": "Active",
            "PolicyHolderName": "",
            "GroupName": "",
            "StatusId": 1,
            "StatusName": "Not Verified",
            "MasterPayorId": $scope.ElgibilityReviewObj.MasterPayorId,
            "OrgEligibilityClaimNumber": $scope.ElgibilityReviewObj.OrgEligibilityClaimNumber,
            "PatientCoPayAmount": null,
            "PatientCoPayPercentage": null,
            "SocialSecurityNo": $scope.ElgibilityReviewObj.PatientSSN,
            "AddressId": null,
            "CityName": null,
            "StateName": null,
            "Pin": null,
            "PlanBeginDate": null,
            "PlanEndDate": null,
            "PolicyId": $scope.ElgibilityReviewObj.PolicyId,
            "GroupId": $scope.ElgibilityReviewObj.GroupId,
            "PlanNumber": $scope.ElgibilityReviewObj.PlanNumber,
            "isSelected": false,
            "isVerified": false,
            "IsShowEligibility": false,
            "ProviderID": $scope.ElgibilityReviewObj.UserProviderId||"",
            "ServiceTypeobj": "",
            "SerciceFrom": $filter('date')(new Date($scope.appDate),
                "yyyy-MM-dd"),
            "ServiceTo": $filter('date')(new Date($scope.appDate),
                "yyyy-MM-dd"),
            "MemberId": $scope.ElgibilityReviewObj.PolicyId,
            "OrganizationId": $scope.ElgibilityReviewObj.HospitalId,
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
            "FTPAddress": "",
            "FTPUserName": "",
            "FTPpassword": "",
            "FTPpath": "",
            "FTPFolder": "",
            "FTPPort": "",
            "EligiBatchSubmitterID": "",
            "EligiBatchReceiverID": "",
            "PatientsList": [

            ],
            "CHUserName": "",
            "CHPassword": "",
            "CHSubmitterId": "",
            "CHReceiverId": "",
            "CHEligiibilityUrl": "",
        };
        var traceNumber = $filter('date')(new Date(), 'yyyyMMddHHmmssfff');
        var traceEntityIdentifier = $scope.ElgibilityReviewObj.PatientInsuranceDetailId.toString().padStart(10, '0');
        let obj = {
            "PatientFirstName": $scope.ElgibilityReviewObj.InsuredPersonFirstName,
            "PatientLastName": $scope.ElgibilityReviewObj.InsuredPersonLastName,
            "Gender": $scope.ElgibilityReviewObj.InsuredPersonGenderID || ($scope.ElgibilityReviewObj.Gender == "Male" ? "M" : "F") || '',
            "InsuredPersonDOB": $scope.ElgibilityReviewObj.InsuredPersonDOB,
            "PolicyNo": $scope.ElgibilityReviewObj.PolicyId,
            "PayorName": $scope.ElgibilityReviewObj.PayorName,
            "PayorId": $scope.ElgibilityReviewObj.PayorId,
            "GlobalPayorId": $scope.ElgibilityReviewObj.EligibilityPayorId,
            "ServiceTypeCode": "98",
            "TraceEntityIdentifier": traceEntityIdentifier,
            "EntityType": "1",
            "DeleteInd": "N",
            "EligibilityStatusId": "5",
            "EligibilityStatusName": "Verification Sent",
            "traceNumber": traceNumber + "_" + $scope.ElgibilityReviewObj.PatientInsuranceDetailId,
            "EDITraceNumber": $scope.ElgibilityReviewObj.PatientInsuranceDetailId,
            "PatientInsuranceDetailId": $scope.ElgibilityReviewObj.PatientInsuranceDetailId,
            "PatientId": $scope.ElgibilityReviewObj.PatientId,
            "GroupId": $scope.ElgibilityReviewObj.GroupId,
            "PatientMrNo": $scope.ElgibilityReviewObj.PatientMrNo,
            "PatientDOB": moment($scope.ElgibilityReviewObj.InsuredPersonDOB).format("YYYYMMDD"),
            "PatientContact": $scope.ElgibilityReviewObj.HomeCountryCode
        }

        params.PatientsList.push(obj);
        var OrganizationBillingProviderObj = "";
        var filteredList = $filter("filter")($scope.OrganizationBillingProviderList, { "OrganizationBillingProviderId": $scope.defaultBillingProviderId }, true) || [];
        if (filteredList.length > 0) {
            OrganizationBillingProviderObj = filteredList[0];
        } else {
            OrganizationBillingProviderObj = $scope.OrganizationBillingProviderList[0];
        }
        //if ($scope.OrganizationBillingProviderList.length > 0) {
        //    params.BillingProviderDetails.BillingProviderName = $scope.OrganizationBillingProviderList[0].BillingProviderName;
        //    params.BillingProviderDetails.BillingProviderId = $scope.OrganizationBillingProviderList[0].BillingProviderId;
        //    params.BillingProviderDetails.BillingProviderNPI = $scope.OrganizationBillingProviderList[0].NPI;
        //    params.BillingProviderDetails.BillingProviderTaxId = $scope.OrganizationBillingProviderList[0].TaxId;
        //    params.BillingProviderDetails.BillingProviderContactPersonName = $scope.OrganizationBillingProviderList[0].ContactPersonName;
        //    params.BillingProviderDetails.BillingProviderContactPhoneNumber = $scope.OrganizationBillingProviderList[0].ContactMobileNumber;
        //};
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
                if (params.FTPAddress === "" && params.FTPUserName == "" && params.FTPpassword == "" && params.FTPFolder == "") {
                    alertify.error("FTP details are missing for the Clearing House please ");
                    return false;
                }
            }

        }

        $scope.checkIndividualPatientEligibility(params);

        $scope.mInstanceAdd.close();
    };

    $scope.Reverify = function (reVerifyDetails) {
        if (reVerifyDetails == "" || reVerifyDetails == null) {
            return false;
        }
        $scope.ElgibilityReviewObj = "";
        $scope.ElgibilityReviewObj = reVerifyDetails;
        $scope.ElgibilityReviewObj.ProviderIDTypeObj = $scope.ProviderIDTypearray[0];
        $scope.ElgibilityReviewObj.ProviderID = "";
        $scope.ElgibilityReviewObj.ServiceTypeobj = "";
        $scope.ElgibilityReviewObj.ServiceFrom = $filter('date')(new Date(reVerifyDetails.AppointmentDate), "MM-dd-yyyy");
        $scope.ElgibilityReviewObj.ServiceTo = $filter('date')(new Date(reVerifyDetails.AppointmentDate), "MM-dd-yyyy");

        $scope.ElgibilityReviewObj.ProviderID = $scope.ElgibilityReviewObj.NPI;
        $scope.ElgibilityReviewObj.MemberId = $scope.ElgibilityReviewObj.PolicyId;
        $scope.ElgibilityReviewObj.GroupId = $scope.ElgibilityReviewObj.GroupId || "";

        if ($scope.ElgibilityReviewObj.RelationShipId == 1) {
            //var Dob = "";
            //if ($scope.ElgibilityReviewObj.DOB != '' && $scope.ElgibilityReviewObj.DOB != null) {
            //    Dob = $filter('date')(new Date($scope.ElgibilityReviewObj.DOB), "MM-dd-yyyy") || "";
            //}
            //$scope.ElgibilityReviewObj.DOB = Dob;
        } else {
            //var Dob = "";
            //if ($scope.ElgibilityReviewObj.InsuredPersonDOB != '' && $scope.ElgibilityReviewObj.InsuredPersonDOB != null) {
            //    Dob = $filter('date')(new Date($scope.ElgibilityReviewObj.InsuredPersonDOB), "MM-dd-yyyy") || "";
            //}
            //$scope.ElgibilityReviewObj.InsuredPersonDOB = Dob;

            var gender = "";
            if ($scope.ElgibilityReviewObj.InsuredPersonGenderID != "") {
                gender = $scope.ElgibilityReviewObj.InsuredPersonGenderID == "F" ? "Female" : ($scope.ElgibilityReviewObj.InsuredPersonGenderID == "M" ? "Male" : '');
            }
            $scope.ElgibilityReviewObj.InsuredPersonGenderID = gender || "";
            $scope.ElgibilityReviewObj.InsuredPersonLastName = "";
        }

        if ($scope.ElgibilityReviewObj.AppointmentTOSCodes.length === 1) {

            $scope.ElgibilityReviewObj.ServiceTypeobj = $filter("filter")($scope.OrgTOSCODESArray, function (Nitem) {
                return Nitem.MedicalServicesId === $scope.ElgibilityReviewObj.AppointmentTOSCodes[0].TOSCodeId;
            })[0] || "";
        } else {

            $scope.ElgibilityReviewObj.ServiceTypeobj = $filter("filter")($scope.OrgTOSCODESArray, function (Nitem) {
                return Nitem.Code === "30";
            }, true)[0] || "";
        }

        $scope.Saveverify();
    }
    $scope.changeProviderSelecter = function (item) {
        if (item == "" || item == null) {
            item = "";
            $scope.ElgibilityReviewObj.ProviderID = "";
            return false;
        }
        if (item.Id == 1) {
            $scope.ElgibilityReviewObj.ProviderID = $scope.ElgibilityReviewObj.NPI;
        } else if (item.Id == 2) {
            $scope.ElgibilityReviewObj.ProviderID = $scope.ElgibilityReviewObj.UserProviderId || "";
        }
    }

    $scope.OrgTOSCODESArray = [];
    $scope.getOrganizationTOSCodes = function () {

        eHnotePatientAddressDataServices.GetOrganizationTOSCodes($scope.ParenthospitalId).then(function (resp) {
            console.log(resp);
            if (resp.data.rows.length > 0) {
                $scope.OrgTOSCODESArray = resp.data.rows || [];
            }
        });
    };
    $scope.getOrganizationTOSCodes();
    $scope.selectedid = '';
    $scope.BenifitEligibilityCoverageList1 = [];

    $scope.ErrordetailsData = function (Id) {
        eHnoteInsuranceService.GetPatientInsuranceEligibilityErrorDetails(Id).then(function (response) {
            console.log(JSON.stringify(response));
            if (response.data.ErrorDetails.length > 0) {
                $scope.ErrorDetails = response.data.ErrorDetails || [];
            }
        });
    }
    $scope.ChangePatientsInsuranceList = function (row) {

        $scope.BenifitCoverageDetailListobj = 1;
        $scope.Id = row.PatientAppointmentInsuranceDetailId;
        $scope.InsuranceEligibility = [];
        $scope.InsuranceEligibilitySubscriberData = [];
        $scope.selectedid = row.PatientAppointmentInsuranceDetailId;
        $scope.InsuranceEligibilitySubscriberData = [];
        
        $scope.ErrorDetails = [];
        if (row.EligibilityStatusId === 3) {
            $scope.ErrordetailsData(row.PatientInsuranceDetailId);
        } else {

            eHnoteInsuranceService.GetPatientBenfitCovergesByPatientInsuranceId(row.PatientInsuranceDetailId).then(function (resp) {
                $scope.MainBenifitEligibilityCoverageList = [];
                $scope.BenifitEligibilityCoverageList1 = [];
                if (resp.data.status == "Success") {

                    resp.data.rows = resp.data.rows || [];
                    $scope.InsuranceEligibilitySubscriberData = resp.data.rows || [];
                    $scope.loadOrganizationLogo();

                    if (resp.data.rows.length > 0) {
                        resp.data.rows[0].BenifitCoverageDetailsList = resp.data.rows[0].BenifitCoverageDetailsList || [];
                        resp.data.rows[0].BenifitCoveragesList = resp.data.rows[0].BenifitCoveragesList || [];
                        if (resp.data.rows[0].BenifitCoverageDetailsList.length > 0) {

                            angular.forEach(resp.data.rows[0].BenifitCoveragesList, function (hitem) {
                                var temarray = $filter("filter")(resp.data.rows[0].BenifitCoverageDetailsList, function (item, index) { return item.ServiceTypeCode === hitem.ServiceTypeCode }, true);
                                if (temarray.length !== 0) {
                                    var obj = {
                                        "ServiceTypeCode": hitem.ServiceTypeCode,
                                        "ServiceTypeName": hitem.ServiceTypeName,
                                        "Status": hitem.Status,
                                        "BenifitCoverageDetailsList": temarray || [],
                                    }
                                    $scope.MainBenifitEligibilityCoverageList.push(obj);

                                }
                            });
                            $scope.BenifitEligibilityCoverageList1 = angular.copy($scope.MainBenifitEligibilityCoverageList);


                        }
                    }
                } else {
                    alertify.error(resp.data.Message);
                }
            }, function (error) {
            });
        }
            
    }
    $scope.CheckInsuranceEligibility1 = function (item) {
        // item.IsShowEligibility = !item.IsShowEligibility;
        if (!item.IsShowEligibility) {
            angular.forEach($scope.PatientsWiseInsuranceList, function (subitem) {
                subitem.IsShowEligibility = false;
            });
            item.IsShowEligibility = true;
            $scope.InsuranceEligibility = [];
            $scope.BenifitEligibilityCoverageList = [];

            item.PatientAppointmentInsuranceDetailId = item.PatientAppointmentInsuranceDetailId || 0;
            if (item.PatientAppointmentInsuranceDetailId == 0) {
                return false;
            }

        } else {
            item.IsShowEligibility = false;
        }
    }

    $scope.CheckDemographicInformaction = function (item) {
        if (!item.IsShowEligibility) {
            angular.forEach($scope.PatientsWiseInsuranceList, function (subitem) {
                subitem.IsShowEligibility = false;
            });
            item.IsShowEligibility = true;


        } else {
            item.IsShowEligibility = false;
        }
    }

    $scope.BenifitCoverageDetailListobj = 1;

    $scope.CheckInsEligibility = function (val) {

        if (val == '1') {
            var TempInsuarance = angular.copy($scope.MainBenifitEligibilityCoverageList);
            $scope.BenifitEligibilityCoverageList1 = [];
            angular.forEach(TempInsuarance, function (hitem) {
                var temarray = $filter("filter")(hitem.BenifitCoverageDetailsList, function (item, index) { return item.ServiceTypeCode == hitem.ServiceTypeCode }, true);
                $scope.TempInsuarance = [];
                if (temarray.length !== 0) {
                    var obj = {
                        "ServiceTypeCode": hitem.ServiceTypeCode,
                        "ServiceTypeName": hitem.ServiceTypeName,
                        "Status": hitem.Status,
                        "IsShowEligibility": true,
                        "BenifitCoverageDetailsList": temarray || [],
                    }
                    $scope.BenifitEligibilityCoverageList1.push(obj);

                }

            });
        }

        if (val == '2') {
            var TempInsuarance = angular.copy($scope.MainBenifitEligibilityCoverageList);
            $scope.BenifitEligibilityCoverageList1 = [];
            angular.forEach(TempInsuarance, function (hitem) {
                var temarray = $filter("filter")(hitem.BenifitCoverageDetailsList, function (item, index) { return item.BenifitTypeName === 'Co-Payment' }, true);
                $scope.TempInsuarance = [];
                if (temarray.length !== 0) {
                    var obj = {
                        "ServiceTypeCode": hitem.ServiceTypeCode,
                        "ServiceTypeName": hitem.ServiceTypeName,
                        "Status": hitem.Status,
                        "IsShowEligibility": true,
                        "BenifitCoverageDetailsList": temarray || [],
                    }
                    $scope.BenifitEligibilityCoverageList1.push(obj);

                }

            });
        }

        if (val == '3') {
            var TempInsuarance = angular.copy($scope.MainBenifitEligibilityCoverageList);
            $scope.BenifitEligibilityCoverageList1 = [];
            angular.forEach(TempInsuarance, function (hitem) {
                var temarray = $filter("filter")(hitem.BenifitCoverageDetailsList, function (item, index) { return item.BenifitTypeName === 'Co-Insurance' }, true);
                $scope.TempInsuarance = [];
                if (temarray.length !== 0) {
                    var obj = {
                        "ServiceTypeCode": hitem.ServiceTypeCode,
                        "ServiceTypeName": hitem.ServiceTypeName,
                        "Status": hitem.Status,
                        "IsShowEligibility": true,
                        "BenifitCoverageDetailsList": temarray || [],
                    }
                    $scope.BenifitEligibilityCoverageList1.push(obj);

                }

            });
        }

        if (val == '4') {
            var TempInsuarance = angular.copy($scope.MainBenifitEligibilityCoverageList);
            $scope.BenifitEligibilityCoverageList1 = [];
            angular.forEach(TempInsuarance, function (hitem) {
                var temarray = $filter("filter")(hitem.BenifitCoverageDetailsList, function (item, index) { return item.BenifitTypeName === 'Deductible' }, true);
                $scope.TempInsuarance = [];
                if (temarray.length !== 0) {
                    var obj = {
                        "ServiceTypeCode": hitem.ServiceTypeCode,
                        "ServiceTypeName": hitem.ServiceTypeName,
                        "Status": hitem.Status,
                        "IsShowEligibility": true,
                        "BenifitCoverageDetailsList": temarray || [],
                    }
                    $scope.BenifitEligibilityCoverageList1.push(obj);

                }

            });
        }

        if (val == '5') {
            var TempInsuarance = angular.copy($scope.MainBenifitEligibilityCoverageList);
            $scope.BenifitEligibilityCoverageList1 = [];
            angular.forEach(TempInsuarance, function (hitem) {
                var temarray = $filter("filter")(hitem.BenifitCoverageDetailsList, function (item, index) { return item.BenifitTypeName === 'Out of Pocket (Stop Loss)' }, true);
                $scope.TempInsuarance = [];
                if (temarray.length !== 0) {
                    var obj = {
                        "ServiceTypeCode": hitem.ServiceTypeCode,
                        "ServiceTypeName": hitem.ServiceTypeName,
                        "Status": hitem.Status,
                        "IsShowEligibility": true,
                        "BenifitCoverageDetailsList": temarray || [],
                    }
                    $scope.BenifitEligibilityCoverageList1.push(obj);

                }

            });
        }

        if (val == '6') {
            var TempInsuarance = angular.copy($scope.MainBenifitEligibilityCoverageList);
            $scope.BenifitEligibilityCoverageList1 = [];
            angular.forEach(TempInsuarance, function (hitem) {
                var temarray = $filter("filter")(hitem.BenifitCoverageDetailsList, function (item, index) { return item.BenifitTypeName === 'Limitations' }, true);
                $scope.TempInsuarance = [];
                if (temarray.length !== 0) {
                    var obj = {
                        "ServiceTypeCode": hitem.ServiceTypeCode,
                        "ServiceTypeName": hitem.ServiceTypeName,
                        "Status": hitem.Status,
                        "IsShowEligibility": true,
                        "BenifitCoverageDetailsList": temarray || [],
                    }
                    $scope.BenifitEligibilityCoverageList1.push(obj);

                }

            });
        }


    }
 
    $scope.changeOrganisation = function (item) {
        var OrgList = $filter("filter")($scope.AppListdoctoraddress, function (iterator) { return iterator.BranchId === item; });
      

        if (OrgList.length > 0) {
            $scope.ElgibilityReviewObj.HospitalName = OrgList[0].BranchName;
            $scope.ElgibilityReviewObj.HospitalId = OrgList[0].BranchId;
        }
        else {
            $scope.ElgibilityReviewObj.HospitalName = "";
            $scope.ElgibilityReviewObj.HospitalId = 0;
        }
    }


    $scope.InsuranceEligibilityArrayList = [];

    $scope.checkPatientInsurance = function (Item) {
       
        //Item = Item || null;

        //const index = $scope.InsuranceEligibilityArrayList.indexOf(Item);

        //if (index === -1) {
        //    $scope.InsuranceEligibilityArrayList.push(Item);
        //    Item.isChecked = true;
        //    //$scope.IsPatientChecked = true;
        //} else {
        //    $scope.InsuranceEligibilityArrayList.splice(index, 1);
        //    Item.isChecked = false;
        //    $scope.IsPatientChecked = false;
        //}
        //var checkedlist = _.where($scope.PatientsWiseInsuranceList, { isChecked: true });

        //var checkedlist = _.filter($scope.PatientsWiseInsuranceList, function (iterator) {
        //    return iterator.isChecked === true &&
        //        iterator.EligibilityStatusId === 1 &&
        //        iterator.StatusId !== 5;
        //});
        //var orginalCheckList =_.filter($scope.PatientsWiseInsuranceList, function (iterator) {
        //    return iterator.isChecked === true &&
        //        iterator.EligibilityStatusId === 1 &&
        //        iterator.StatusId !== 5;
        //});
        
        //if (!$scope.IsPatientChecked && checkedlist.length > 0) {

          
        //}
        $scope.IsPatientChecked = _.every($scope.PatientsWiseInsuranceList, { isChecked: true });

    };

   

    /*iterator.isChecked == true && iterator.EligibilityStatusId == 1 && iterator.StatusId !== 5 &&*/
    $scope.InsuranceEligibilityverify = function () {

        var filterList = $filter("filter")($scope.PatientsWiseInsuranceList, function (iterator) { return iterator.isChecked == true });
        if (filterList.length == 0) {
            alertify.error("Please select the patient")
            return false;
        }
        $scope.VerifyPatientlist = [];
        $scope.UnVerifyPatientlist = [];
        if (filterList.length > 0) {
            angular.forEach(filterList, function (item) {
                item.PolicyId = item.PolicyId || '';
                item.GroupId = item.GroupId || '';
                item.PayorId = item.PayorId || null;
                if (item.PolicyId != '' && item.PayorId != null) {
                    $scope.VerifyPatientlist.push(item);
                } else {
                    $scope.UnVerifyPatientlist.push(item);
                }
            })
        }

        if ($scope.UnVerifyPatientlist.length > 0) {

            let obj = {
              "UnVerifyPatientlist":$scope.UnVerifyPatientlist||[],
                "VerifyPatientlist": $scope.VerifyPatientlist||[],
            }
            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "UnVerifyPatientList.html",
                "backdrop": "static",                
                "keyboard": false,
                "size": "lg",
                "resolve": {
                    "obj": function () { return obj; },
                },
                "controller": function ($scope, $uibModal, $uibModalInstance, obj) {
                    $scope.close = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                    $scope.obj = obj;

                    $scope.skipandcontinue = function () {
                        $uibModalInstance.close($scope.obj);
                    }
             
                }
            });
            $scope.mInstanceAdd.result.then(function (resp) {
                if (resp.VerifyPatientlist.length>0) {
                    $scope.continuetoInsuranceEligibility(resp.VerifyPatientlist);
                }
            });

        } else {
            $scope.continuetoInsuranceEligibility($scope.VerifyPatientlist);
        }
        $scope.IsPatientChecked = false;
    }


    $scope.continuetoInsuranceEligibility = function (filterList) {
        if (filterList.length > 0) {
            $scope.PatientsList = [];
            angular.forEach(filterList, function (item) {
                var traceNumber = $filter('date')(new Date(), 'yyyyMMddHHmmssfff');
                var traceEntityIdentifier = item.PatientInsuranceDetailId.toString().padStart(10, '0');
                let obj = {
                    "PatientFirstName": item.InsuredPersonFirstName,
                    "PatientLastName": item.InsuredPersonLastName,
                    "Gender": item.InsuredPersonGenderID || (item.Gender == "Male" ? "M" : "F") || '',
                    "InsuredPersonDOB": item.InsuredPersonDOB,
                    "PolicyNo": item.PolicyId,
                    "PayorName": item.PayorName,
                    "PayorId": item.PayorId,
                    "GlobalPayorId": item.EligibilityPayorId,
                    "ServiceTypeCode": "98",
                    "TraceEntityIdentifier": traceEntityIdentifier,
                    "EntityType": "1",
                    "EligibilityStatusId": "5",
                    "EligibilityStatusName": "Verification Sent",
                    "DeleteInd": "N",
                    "traceNumber": traceNumber + "_" + item.PatientInsuranceDetailId,
                    "PatientInsuranceDetailId": item.PatientInsuranceDetailId,
                    "PatientId": item.PatientId,
                    "GroupId": item.GroupId,
                    "PatientMrNo": item.PatientMrNo,
                    "PatientDOB": moment(item.InsuredPersonDOB).format("YYYYMMDD"),

                    "PatientContact": item.PatientMobile,
                };
                $scope.PatientsList.push(obj);
            })



        }
        let params = {
            "BillingProviderDetails": {
                "EntityType": "2",
                "BillingProviderName": "",
                "BillingProviderId": "",
                "BillingProviderNPI": "",
                "BillingProviderTaxId": "",
                "BillingProviderContactPersonName": "",
                "BillingProviderContactPhoneNumber": ""
            },
            "HospitalName": doctorinfo.doctordata.UserAddress[0].ClinicName,
            "UserId": $scope.UserId,
            "HospitalId": $scope.HospitalId,
            "ClearingHouseId": 1,
            "ClearingHouseName": "",
            "MasterClearingHouseId": "",
            "ClearingHouseType": "",
            "FTPAddress": "",
            "FTPUserName": "",
            "FTPpassword": "",
            "FTPFolder": "",
            "FTPPort": "",
            "FTPpath": "",
            "EligiBatchSubmitterID": "",
            "EligiBatchReceiverID ": "",
            "PatientsList": $scope.PatientsList || [],
            "CHUserName": "",
            "CHPassword": "",
            "CHSubmitterId": "",
            "CHReceiverId": "",
            "CHEligiibilityUrl": "",
            "ServiceTypeCode": "98",
        }

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

            //params.ClearingHouseId = $scope.OrganizationClearingHouseDetails[0].ClearingHouseID;
            //params.ClearingHouseName = $scope.OrganizationClearingHouseDetails[0].Name;
            //params.MasterClearingHouseId = $scope.OrganizationClearingHouseDetails[0].MasterClearingHouseId;
            //params.ClearingHouseType = $scope.OrganizationClearingHouseDetails[0].ClaimUploadFTPType;

            //params.FTPAddress = $scope.OrganizationClearingHouseDetails[0].ClaimUploadFTPHostName || "";
            //params.FTPUserName = $scope.OrganizationClearingHouseDetails[0].ClaimUploadFTPUserName || "";
            //params.FTPpassword = $scope.OrganizationClearingHouseDetails[0].ClaimUploadFTPPassword || "";
            //params.FTPpath = $scope.OrganizationClearingHouseDetails[0].ClaimUploadFTPFolder || "";
            //params.FTPFolder = $scope.OrganizationClearingHouseDetails[0].ClaimUploadFTPFolder || "";
            //params.FTPPort = $scope.OrganizationClearingHouseDetails[0].ClaimUploadFTPPortNumber || "";
            //params.EligiBatchSubmitterID = $scope.OrganizationClearingHouseDetails[0].eligiBatchSubmitterID || "";
            //params.EligiBatchReceiverID = $scope.OrganizationClearingHouseDetails[0].eligiBatchReceiverID || "";
            //var ClearingHouseTypeId = $scope.OrganizationClearingHouseDetails[0].ClearingHouseTypeId || 0;
            //if (ClearingHouseTypeId == 2) {
            //    if (params.FTPAddress === "" && params.FTPUserName == "" && params.FTPpassword == "" && params.FTPFolder == "") {
            //        alertify.error("FTP details are missing for the Clearing House please ");
            //        return false;
            //    }
            //}
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



        eHnoteInsuranceService.checkPatientInsuranceEligibilityByIdusingEdi(params, onSuccess, onError);
        function onSuccess(resp) {
            $scope.SearchPatientInsuranceslist();
            if (resp.Status == "Success") {
                alertify.success("Batch Eligibility Send Successfully");

                $scope.SearchPatientInsuranceslist();
            }
               
            //resp.errors = resp.errors || [];
            //if (resp.errors.length > 0) {

            //    var eparams = {
            //        "UserId": $scope.UserId,
            //        "AppointmentInsuranceDetailId": 0,
            //        "InsuranceEligibilityErrorStatusId": 0,
            //        "ErrorDetails": [],
            //        "VerifiedDate": $filter("date")(new Date(), "yyyy-MM-dd")
            //    }
            //    angular.forEach(resp.errors, function (eitem) {
            //        var eobj = {
            //            "Field": eitem.field,
            //            "Description": eitem.description
            //        }
            //        eparams.ErrorDetails.push(eobj);
            //    });



            //    eHnoteInsuranceService.UpdateInsuranceEligibilityErrorDetails(eparams).then(function (response) {
            //        if (response.data.status === 'Success') {
            //            $scope.SearchPatientInsuranceslist();
            //        }
            //    });

            //} else {
            //    $scope.SearchPatientInsuranceslist();
            //}


        }
        function onError(resp) {
            alertify.errors("Batch Eligibility Send Successfully");
        }
    }

    $scope.IsCheckAllPatients = function (ischeck) {
        if (ischeck) {
            angular.forEach($scope.PatientsWiseInsuranceList, function (item) {
                item.isChecked = true;
            })
        }
        else {
            angular.forEach($scope.PatientsWiseInsuranceList, function (item) {
                item.isChecked = false;
            })
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



    $scope.showEligibilityinPopup2 = function (item) {
        eHnoteAuditServices.getPatientDetailsById(item.PatientId, ongetPatientDetailsSuccess, ongetPatientDetailsError);
        function ongetPatientDetailsSuccess(data) {
            if (data !== undefined) {
                var patientitem = data;
                console.log(JSON.stringify(patientitem));
                $scope.PatientDetailsInfo.FirstName = patientitem.Patient[0].FirstName
                $scope.PatientDetailsInfo.LastName = patientitem.Patient[0].LastName
                $scope.PatientDetailsInfo.DisplayNumber = patientitem.Patient[0].DisplayNumber
                $scope.PatientDetailsInfo.HomeCountryCode = patientitem.Patient[0].HomeCountryCode
                $scope.PatientDetailsInfo.HomeNumber = patientitem.Patient[0].HomeNumber
                $scope.PatientDetailsInfo.HomeAreaCode = patientitem.Patient[0].HomeAreaCode
                $scope.PatientDetailsInfo.DisplayOfficeNumber = patientitem.Patient[0].DisplayOfficeNumber
                $scope.PatientDetailsInfo.OfficeNumber = patientitem.Patient[0].OfficeNumber
                $scope.PatientDetailsInfo.OfficeAreaCode = patientitem.Patient[0].OfficeAreaCode
                $scope.PatientDetailsInfo.OfficeCountryCode = patientitem.Patient[0].OfficeCountryCode
                $scope.PatientDetailsInfo.Age = patientitem.Patient[0].Age || 0;
                $scope.PatientDetailsInfo.PatientDisplayID = patientitem.Patient[0].PatientDisplayId || "";
                $scope.PatientDetailsInfo.OldMrno = patientitem.Patient[0].OldMrno || "";
                $scope.PatientDetailsInfo.FullName = patientitem.Patient[0].FullName;
                $scope.PatientDetailsInfo.S3URL = patientitem.Patient[0].S3URL || "";
                $scope.PatientDetailsInfo.Gender = patientitem.Patient[0].Gender;
                $scope.PatientDetailsInfo.PatientID = patientitem.Patient[0].PatientID;

                $scope.PatientDetailsInfo.AgeInDays = patientitem.Patient[0].AgeInDays;
                $scope.PatientDetailsInfo.AgeInMonths = patientitem.Patient[0].AgeInMonths;
                $scope.PatientDetailsInfo.AgeInYears = patientitem.Patient[0].AgeInYears;

                $scope.PatientDetailsInfo.IsNoChargePatient = patientitem.Patient[0].IsNoChargePatient || false;
                $scope.PatientDetailsInfo.IsDiseased = patientitem.Patient[0].IsDiseased || false;

                $scope.PatientDetailsInfo.PatientTagList = [];
                if (patientitem.Patient[0].PatientTagList.length > 0) {
                    $scope.PatientDetailsInfo.PatientTagList = angular.copy(patientitem.Patient[0].PatientTagList);
                }

                if (patientitem.Patient[0].DOB != "") {
                    $scope.PatientDetailsInfo.DOB = $filter('date')(patientitem.Patient[0].DOB, "MM-dd-yyyy");
                }

                $scope.ageinYears = patientitem.Patient[0].AgeInYears;
                $scope.ageinMonths = patientitem.Patient[0].AgeInMonths ? patientitem.Patient[0].AgeInMonths.toString() : "";
                $scope.ageinDays = patientitem.Patient[0].AgeInDays ? patientitem.Patient[0].AgeInDays.toString() : "";
                $scope.PatientDetailsInfo.SocialSecurityNo = patientitem.Patient[0].SocialSecurityNo || "";
                if ($scope.PatientDetailsInfo.SocialSecurityNo == 0 || $scope.PatientDetailsInfo.SocialSecurityNo == "0") {
                    $scope.PatientDetailsInfo.SocialSecurityNo = "";
                }

                $scope.PatientOfficeumber = patientitem.Patient[0].OfficeAreaCode + patientitem.Patient[0].PatientOfficeNumber;
                $scope.PatientDetailsInfo.BloodGroupName = patientitem.Patient[0].PatientOtherDetails[0].BloodGroupName;

                var obj = eHnoteUserDataService.UsMobileFormatChange($scope.PatientOfficeumber);
                $scope.PatientOfficeNumber = obj.UsFormatMobileNumber;

                $scope.PatientDetailsInfo.ContactInfo.EmailID = patientitem.Patient[0].EmailId || "";
                $scope.PatientDetailsInfo.MaritalStatusName = patientitem.Patient[0].PatientOtherDetails[0].MaritalStatus || "";

                $scope.PatientMNumber = patientitem.Patient[0].Altareacode + patientitem.Patient[0].PatientHomeNumber;
                var obj = eHnoteUserDataService.UsMobileFormatChange($scope.PatientMNumber);
                $scope.PatientMobileNumber = obj.UsFormatMobileNumber;

                $scope.PatientDetailsInfo.EmployerPhoneNo = patientitem.Patient[0].EmployerPhoneNo;

                $scope.PatientDetailsInfo.FatherName = patientitem.Patient[0].FatherName;
                $scope.PatientDetailsInfo.MotherName = patientitem.Patient[0].MotherName;
                $scope.PatientDetailsInfo.Guardian = patientitem.Patient[0].Guardian;
                $scope.PatientDetailsInfo.Employer = patientitem.Patient[0].Employer;
            }
        }
        function ongetPatientDetailsError(error) {
            console.log(error);
        }


        $scope.reverifyitem = item;
        $scope.obj = {
            "AppointmentInsuranceDetailId": 0,
            "PatientInsuranceDetailId": item.PatientInsuranceDetailId
        }

        $scope.PatientDetailsInfo = angular.copy($scope.PatientDetailsInfo);
        $scope.modalpayorInstance = $uibModal.open({
            "templateUrl": "templates/consultation/payor/PatientEligibilityResponseDetails.html",
            "backdrop": "static",
            "controller": "UsPatientEligibilityResponseDetailsPopUpCtrl",
            "resolve": {
                "Selectobj": function () { return $scope.obj; },
                "ReverifyItem": function () { return $scope.reverifyitem; },
                "PatientDetailsInfo": function () { return $scope.PatientDetailsInfo; }
            },
            "keyboard": false,
            "windowClass": "offcanves-right",
        })

        $scope.modalpayorInstance.result.then(function (resp) {
        }, function () {
            //$scope.getPatientInsuranceDetailsOfPatient();

        });
      
    };

}]);
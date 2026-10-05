"use strict";
eHnoteWebApp.controller("UsClaimListParentCtrl", ["$scope", "$rootScope", "$location", "$filter", "alertify", "$uibModal", "datapersistanceFactory", "$q", "$timeout", "eHnotePatientDataService", "eHnoteSettingsDataService", "eHnoteInsuranceService", "InventoryService", "eHnoteMasterDataService", "eHnoteLoginStatusService", "eHnoteCacheStorageService", "eHnotePrintService", "eHnoteUserDataService", "$http", "eHnoteMainAdminServices", "$sce", "$window", "eHnotePatientVisitReasonServices", "eHnoteMainAppointmentService", "eHnoteReferalDataService",
    function ($scope, $rootScope, $location, $filter, alertify, $uibModal, datapersistanceFactory, $q, $timeout, eHnotePatientDataService, eHnoteSettingsDataService, eHnoteInsuranceService, InventoryService, eHnoteMasterDataService, eHnoteLoginStatusService, eHnoteCacheStorageService, eHnotePrintService, eHnoteUserDataService, $http, eHnoteMainAdminServices, $sce, $window, eHnotePatientVisitReasonServices, eHnoteMainAppointmentService, eHnoteReferalDataService) {


        $scope.doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.SpecializationId = $scope.doctorinfo.doctordata.User[0].SpecializationId;
        $scope.DoctorId = $scope.doctorinfo.doctordata.User[0].DoctorID;
        $scope.GetAllIndicator = 0;
        $scope.userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
        $scope.HospitalId = 0;
        $scope.ParentHospitalId = 0;
        if ($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode
            && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID) {
            $scope.HospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            $scope.ParentHospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        }
        console.log($scope.mainBillerDataObj);
        $scope.AllHospitalData = [];
        $scope.AllHospitalData = $scope.mainBillerDataObj;
        if ($scope.AllHospitalData.AllDoctorsList.length > 0) {
            $scope.AllHospitalData.AllDoctorsList.forEach(function (item) {
                item.selected = false;
                if ($scope.UserId === item.DoctorID) {
                    item.selected = true;
                }

            });
        }
        $scope.IsAckList = false;
        $scope.ClaimAckListactiveTab = 'acklist';
        $scope.ClaimProviderList = [];
        $scope.ClaimProviderList = $scope.mainBillerDataObj.BillingProviderList || [];
        $scope.AllOthersCheckObj =
        {
            "otherAllChecked": false
        }

        $scope.AllAckCheckObj =
        {
            "AckAllChecked": false
        }

        $scope.HospitalData = [];
        if ($scope.AllHospitalData.AllBranchesList.length > 0) {
            $scope.HospitalData = $filter("filter")($scope.AllHospitalData.AllBranchesList, { BranchId: $scope.HospitalId }) || [];
        }
        if ($scope.AllHospitalData.AllUsersList.length > 0) {
            $scope.AllHospitalData.AllUsersList.forEach(function (item) {
                item.IsChecked = false;
                if ($scope.UserId === item.DoctorID) {
                    item.IsChecked = true;
                }
            });
        }

        $scope.claimwiseSearchType = 1;
        $scope.patSearchType = 2;


        $scope.GetClaimListObj = function () {
            return {
                "FromDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "ToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "OrganizationId": $scope.HospitalId,
                "OrganizationFacilityId": 0,
                "PatientId": "",
                "PatienClaimNumber": "",
                "ClaimNumber": "",
                "BatchNumber": "",
                "BillingProviderId": 0,
                "RenderingProviderId": 0,
                "RenderingProviderName": "",
                "PayorId": 0,
                "BillPaymentTypeId": 0,
                "TransmissionMethodId": 0,
                "BillPaymentTypeObj": "",
                "TransmissionTypeId": 0,
                "ClaimTypeId": 0,
                "PayorId": null,
                "PayorIds": "",
                "AllPayorList": [],
                "ClaimStatusList": "",
                "PageSize": 100,
                "PageNumber": 1,
                "Count": 0,
                "BatchNumber": "",
                "IsReadytosubmit": false,
                "ClaimStatusId": 0,
                "CurrentResponsibilityId": 0,
                "DenialId": 0,
                "IsActive": false,
                "OrganizationFacilityId": "",
                "TransmissionFromDate": null,
                "TransmissionToDate": null,
                "DateType": "DOS",
                "SortColumn": "DOS",
                "SortOrder": "DESC"
            };
        };
        $scope.SearchClaimListObj = angular.copy($scope.GetClaimListObj());


        $scope.loadOrganizationLogo = function () {
            $scope.OrganizationBase64LogoUrl = '';

            if (!$scope.ManualClaimAckData ||
                !$scope.ManualClaimAckData.length)
                return;

            angular.forEach($scope.ManualClaimAckData, function (claim) {
                if (claim.OrganizationLogoUrl) {
                    $scope.LogoUrl = claim.OrganizationLogoUrl || '';
                }
            });


            var logoUrl = $scope.LogoUrl;

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

        $scope.claimCheckedCount = function () {
            $scope.OrgClaimListdata = $scope.OrgClaimListdata || [];

            if ($scope.OrgClaimListdata.length > 0) {
                $scope.checkedOrgClaimCount = $scope.OrgClaimListdata.filter(function (item) {
                    return item.IsActive;
                }).length;

                $scope.SearchClaimListObj.IsActive = $scope.checkedOrgClaimCount === $scope.OrgClaimListdata.length;
            } else {
                $scope.checkedOrgClaimCount = 0;
                $scope.SearchClaimListObj.IsActive = false;
            }
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

        $scope.ChangeClaimProvider = function (obj) {
            obj.OrganizationBillingProviderId = obj.BillingProviderObj.OrganizationBillingProviderId;
            obj.BillingProviderName = obj.BillingProviderObj.FacilityName;
        };

        //$scope.ClaimSubtabs = 1;
        //$scope.Changesubtabs = function (tabchange) {
        //    $scope.ClaimSubtabs = tabchange;
        //    $scope.ShowPatientListDrop = false;
        //    if ($scope.ClaimSubtabs == 6) {
        //        $scope.refresh277AckmntDetails();
        //    }
        //    else if ($scope.ClaimSubtabs == 5) {
        //        $scope.SearchClaimListObj = angular.copy($scope.GetClaimListObj());
        //        $scope.SearchRejectedFollowUps('Rejected');
        //    }
        //    else if ($scope.ClaimSubtabs == 7) {
        //        $scope.refresh999AckmntData();
        //    } else {

        //    }
        //    $scope.clearPatientSearchData();

        //}

        $scope.searchtxtb = {
            "txt1": ""
        }

        $scope.changeDoctor = function (item) {

            $scope.SearchClaimListObj.RenderingProviderId = item.DoctorID;
            $scope.SearchClaimListObj.RenderingProviderName = item.FullName;
            //$scope.searchtxtb.txt1 = '';

        }
        $scope.OrganizationBillingProviderList = [];
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

        /*  $scope.GetOrganizationBillingProviders();*/

        if ($scope.mainBillerDataObj.BillingProviderList.length>0) {
            $scope.OrganizationBillingProviderList = $scope.mainBillerDataObj.BillingProviderList || [];
        }
      

        $scope.MainObj = {
            "OrganizationId": $scope.HospitalId,
            "HospitalIds": $scope.HospitalId,
            "FacilityListIds": "",
        }
        $scope.ClaimLocationList = [];
        $scope.ClaimLocationList = angular.copy($scope.mainBillerDataObj.AllBranchesList);
        if ($scope.ClaimLocationList.length > 0) {
            angular.forEach($scope.ClaimLocationList, function (item) {
                item.IsChecked = true;
                //if (item.ClinicId == $scope.HospitalId) {
                //    item.IsChecked = true;
                //}
            });
        }
        var TempAddressArray = $filter("filter")($scope.ClaimLocationList, function (item, index) { return item.ClinicId !== 0; }) || [];
        var HospitalId = "";
        for (var i in TempAddressArray) {
            if (TempAddressArray[i].ClinicId) {
                HospitalId += "," + TempAddressArray[i].ClinicId;
            }
        }
        $scope.MainObj.HospitalIds = HospitalId || '';

        $scope.ClaimSubtabs = 1;
        $scope.ClaimSubtabActive = 1;


        $scope.DenialFollowupTab = 'List';

        $scope.isClaimSummaryVisible = false;
        $scope.filtertabs = function (pageno, type, tabchange, subtab) {
            $scope.isClaimSummaryVisible = false;
            $scope.activeClaimTab = 'ALL';
            $scope.ClaimStatusListDD = angular.copy($scope.MasterClaimStatusList);
            $scope.ClaimStatusListDD.forEach(function (item) {
                item.IsChecked = true;
            });

            $scope.clearPatientSearchData();
            $scope.SearchClaimAdjustReqObj.SortColumn = 'DOS';
            $scope.SearchClaimAdjustReqObj.SortOrder = 'DESC';
            $scope.SearchClaimFollowupObj.SortColumn = 'DOS';
            $scope.SearchClaimFollowupObj.SortOrder = 'DESC';
            $scope.SearchDeleteClaimReqObj.SortColumn = 'DOS';
            $scope.SearchDeleteClaimReqObj.SortOrder = 'DESC';
            

            $scope.SearchClaimListObj = angular.copy($scope.GetClaimListObj());

            $scope.SearchClaimListObj.ClaimStatusList = $scope.MasterClaimStatusList.map(function (status) {
                return status.ClaimStatusId;
            }).join(',');

            $scope.ClaimSubtabActive = tabchange;

            $scope.ClaimSubtabs = tabchange;
            $scope.SwitchClaimSubTab($scope.ClaimSubtabs);
            $scope.ShowPatientListDrop = false;

            //// Reset Doctors
            //angular.forEach($scope.mainBillerDataObj.AllDoctorsList, function (item) {
            //    item.IsChecked = false;
            //});
            //$scope.SearchClaimListObj.AllDoctorsCheck = false;
            //$scope.SearchClaimListObj.AllDoctorsString = 'Select';
            //$scope.SearchClaimListObj.RenderingProviderId = '';

            //// Reset ClaimResp
            //angular.forEach($scope.ClaimDataList, function (item) {
            //    item.IsChecked = false;
            //});
            //$scope.ClaimRespListObj = { AllRespCheck: false, SelectRespString: 'Select' };
            //$scope.SearchClaimListObj.BillPaymentTypeId = '';

            //// Reset Format
            //angular.forEach($scope.ClaimFormatList, function (item) {
            //    item.IsChecked = false;
            //});
            //$scope.ClaimFormatListObj = { AllFormatCheck: false, SelectFormatString: 'Select' };
            //$scope.SearchClaimListObj.TransmissionMethodId = '';

            if ($scope.ClaimLocationList.length > 0) {
                angular.forEach($scope.ClaimLocationList, function (item) {
                    item.IsChecked = true;
                    //if (item.ClinicId == $scope.HospitalId) {
                    //    item.IsChecked = true;
                    //}
                });
            }
            var TempAddressArray = $filter("filter")($scope.ClaimLocationList, function (item, index) { return item.ClinicId !== 0; }) || [];
            var HospitalId = "";
            for (var i in TempAddressArray) {
                if (TempAddressArray[i].ClinicId) {
                    HospitalId += "," + TempAddressArray[i].ClinicId;
                }
            }
            if (HospitalId.charAt(0) === ",") {
                HospitalId = HospitalId.slice(1);
            }

            $scope.MainObj.HospitalIds = HospitalId || '';
            if (type == 'All') {
                $scope.selectedClaimUsers = eHnoteMasterDataService.getClaimsAllUsers();
                if ($scope.selectedClaimUsers != '') {
                    $scope.SearchClaimListObj.FromDate = $scope.selectedClaimUsers.FromDate || null;
                    $scope.SearchClaimListObj.ToDate = $scope.selectedClaimUsers.ToDate || null;
                    $scope.SearchClaimListObj.BillingProviderId = $scope.selectedClaimUsers.BillingProviderId || 0;
                    $scope.SearchClaimListObj.RenderingProviderId = $scope.selectedClaimUsers.RenderingProviderId || 0;
                    $scope.SearchClaimListObj.BillPaymentTypeId = $scope.selectedClaimUsers.BillPaymentTypeId || 0;
                    /* $scope.SearchClaimListObj.TransmissionMethodId = $scope.selectedClaimUsers.TransmissionMethodId || 0;*/
                    $scope.SearchClaimListObj.CurrentResponsibilityId = $scope.selectedClaimUsers.CurrentResponsibilityId || 0;
                    $scope.SearchClaimListObj.ClaimTypeId = $scope.selectedClaimUsers.ClaimTypeId || 0;
                    $scope.SearchClaimListObj.PayorObj = $scope.selectedClaimUsers.PayorObj || '';
                    $scope.SearchClaimListObj.PayorId = $scope.selectedClaimUsers.PayorId || 0;
                    $scope.SearchClaimListObj.TransmissionMethodId = 0;
                    //if ($scope.SearchClaimListObj.RenderingProviderId != 0) {
                    //    var TemaProviderlist = $filter("filter")($scope.mainBillerDataObj.AllDoctorsList, { "DoctorID": $scope.SearchClaimListObj.RenderingProviderId }, true) || [];
                    //    if (TemaProviderlist.length > 0) {
                    //        $scope.SearchClaimListObj.RenderingProviderName = TemaProviderlist[0].FullName || '';
                    //    }

                    if ($scope.mainBillerDataObj.AllDoctorsList.length > 0) {
                        angular.forEach($scope.mainBillerDataObj.AllDoctorsList, function (item) {
                            item.IsChecked = true;
                        });

                        $scope.SearchClaimListObj.AllDoctorsCheck = true;
                        $scope.changeDoctors();
                    }
                    if ($scope.ClaimDataList.length > 0) {
                        var ids = ($scope.SearchClaimListObj.BillPaymentTypeId || '').toString().split(',');

                        $scope.ClaimDataList.forEach(item => {
                            item.IsChecked = ids[0] ? ids.includes(item.BillPaymentTypeId.toString()) : true;
                        });

                        $scope.claimRespToggle();
                    }


                    if ($scope.ClaimFormatList.length > 0) {
                        var ids = ($scope.SearchClaimListObj.TransmissionMethodId || '').toString().split(',');

                        $scope.ClaimFormatList.forEach(item => {
                            item.IsChecked = ids[0] ? ids.includes(item.TransmissionMethodId.toString()) : true;
                        });

                        $scope.claimFormatToggle();
                    }
                    if ($scope.ClaimLocationList.length > 0 && $scope.selectedClaimUsers.checkLocationList.length > 0) {
                        angular.forEach($scope.ClaimLocationList, function (Aitem) {
                            Aitem.IsChecked = false;
                        });
                        angular.forEach($scope.selectedClaimUsers.checkLocationList, function (Aitem) {
                            angular.forEach($scope.ClaimLocationList, function (Bitem) {
                                if (Aitem.ClinicId == Bitem.ClinicId) {
                                    Bitem.IsChecked = true;
                                }
                            });
                        });
                    }

                    if ($scope.ClaimStatusListDD.length > 0 && $scope.selectedClaimUsers.checkClaimStatus.length > 0) {
                        angular.forEach($scope.ClaimStatusListDD, function (Aitem) {
                            Aitem.IsChecked = false;
                        });
                        angular.forEach($scope.ClaimStatusListDD, function (Aitem) {
                            angular.forEach($scope.selectedClaimUsers.checkClaimStatus, function (Bitem) {
                                if (Aitem.ClaimStatusId == Bitem.ClaimStatusId) {
                                    Aitem.IsChecked = true;
                                }
                            });
                        });
                    }
                } else {
                    $scope.SearchClaimListObj = {
                        FromDate: moment().format("MM-DD-YYYY"),
                        ToDate: moment().format("MM-DD-YYYY"),
                        BillingProviderId: 0,
                        RenderingProviderId: 0,
                        BillPaymentTypeId: 0,
                        TransmissionMethodId: 0,
                        CurrentResponsibilityId: 0,
                    }

                }
            }
            if (type == 'SecondaryTransmission') {
                $scope.selectedClaimSTUsers = eHnoteMasterDataService.getClaimsSecondaryTransmittedUsers();
                if ($scope.selectedClaimSTUsers != '') {
                    $scope.SearchClaimListObj.FromDate = $scope.selectedClaimSTUsers.FromDate || null;
                    $scope.SearchClaimListObj.ToDate = $scope.selectedClaimSTUsers.ToDate || null;
                    $scope.SearchClaimListObj.BillingProviderId = $scope.selectedClaimSTUsers.BillingProviderId || 0;
                    $scope.SearchClaimListObj.RenderingProviderId = $scope.selectedClaimSTUsers.RenderingProviderId || 0;
                    $scope.SearchClaimListObj.BillPaymentTypeId = $scope.selectedClaimSTUsers.BillPaymentTypeId || 0;
                    $scope.SearchClaimListObj.TransmissionMethodId = $scope.selectedClaimSTUsers.TransmissionMethodId || 0;
                    $scope.SearchClaimListObj.CurrentResponsibilityId = 3;
                    $scope.SearchClaimListObj.ClaimTypeId = $scope.selectedClaimSTUsers.ClaimTypeId || 0;
                    $scope.SearchClaimListObj.PayorObj = $scope.selectedClaimSTUsers.PayorObj || '';
                    $scope.SearchClaimListObj.PayorId = $scope.selectedClaimSTUsers.PayorId || 0;

                    //if ($scope.SearchClaimListObj.RenderingProviderId != 0) {
                    //    var TemaProviderlist = $filter("filter")($scope.mainBillerDataObj.AllDoctorsList, { "DoctorID": $scope.SearchClaimListObj.RenderingProviderId }, true) || [];
                    //    if (TemaProviderlist.length > 0) {
                    //        $scope.SearchClaimListObj.RenderingProviderName = TemaProviderlist[0].FullName || '';
                    //    }
                    if ($scope.mainBillerDataObj.AllDoctorsList.length > 0) {
                        angular.forEach($scope.mainBillerDataObj.AllDoctorsList, function (item) {
                            item.IsChecked = true;
                        });

                        $scope.SearchClaimListObj.AllDoctorsCheck = true;
                        $scope.changeDoctors();
                    }
                    if ($scope.ClaimDataList.length > 0) {
                        var ids = ($scope.SearchClaimListObj.BillPaymentTypeId || '').toString().split(',');

                        $scope.ClaimDataList.forEach(item => {
                            item.IsChecked = ids[0] ? ids.includes(item.BillPaymentTypeId.toString()) : true;
                        });

                        $scope.claimRespToggle();
                    }


                    if ($scope.ClaimFormatList.length > 0) {
                        var ids = ($scope.SearchClaimListObj.TransmissionMethodId || '').toString().split(',');

                        $scope.ClaimFormatList.forEach(item => {
                            item.IsChecked = ids[0] ? ids.includes(item.TransmissionMethodId.toString()) : true;
                        });

                        $scope.claimFormatToggle();
                    }
                    if ($scope.ClaimLocationList.length > 0 && $scope.selectedClaimSTUsers.checkLocationList.length > 0) {
                        angular.forEach($scope.ClaimLocationList, function (Aitem) {
                            Aitem.IsChecked = false;
                        });
                        angular.forEach($scope.selectedClaimSTUsers.checkLocationList, function (Aitem) {
                            angular.forEach($scope.ClaimLocationList, function (Bitem) {
                                if (Aitem.ClinicId == Bitem.ClinicId) {
                                    Bitem.IsChecked = true;
                                }
                            });
                        });
                    }

                    if ($scope.ClaimStatusListDD.length > 0 && $scope.selectedClaimSTUsers.checkClaimStatus.length > 0) {
                        angular.forEach($scope.ClaimStatusListDD, function (Aitem) {
                            Aitem.IsChecked = false;
                        });
                        angular.forEach($scope.ClaimStatusListDD, function (Aitem) {
                            angular.forEach($scope.selectedClaimSTUsers.checkClaimStatus, function (Bitem) {
                                if (Aitem.ClaimStatusId == Bitem.ClaimStatusId) {
                                    Aitem.IsChecked = true;
                                }
                            });
                        });
                    }
                } else {
                    $scope.SearchClaimListObj = {
                        FromDate: moment().format("MM-DD-YYYY"),
                        ToDate: moment().format("MM-DD-YYYY"),
                        BillingProviderId: 0,
                        RenderingProviderId: 0,
                        BillPaymentTypeId: 0,
                        TransmissionMethodId: 0,
                        CurrentResponsibilityId: 0,
                    }

                }
            }
            if (type == 'NotSubmitted') {
                $scope.selectedClaimNSUsers = eHnoteMasterDataService.getClaimsNotSubmittedUsersList();
                if ($scope.selectedClaimNSUsers != '') {
                    $scope.SearchClaimListObj.FromDate = $scope.selectedClaimNSUsers.FromDate || null;
                    $scope.SearchClaimListObj.ToDate = $scope.selectedClaimNSUsers.ToDate || null;
                    $scope.SearchClaimListObj.BillingProviderId = $scope.selectedClaimNSUsers.BillingProviderId || 0;
                    $scope.SearchClaimListObj.RenderingProviderId = $scope.selectedClaimNSUsers.RenderingProviderId || 0;
                    $scope.SearchClaimListObj.TransmissionMethodId = $scope.selectedClaimNSUsers.TransmissionMethodId || 0;
                    $scope.SearchClaimListObj.IsReadytosubmit = $scope.selectedClaimNSUsers.IsReadytosubmit || false;
                    $scope.SearchClaimListObj.ClaimTypeId = $scope.selectedClaimNSUsers.ClaimTypeId || 0;
                    $scope.SearchClaimListObj.PayorObj = $scope.selectedClaimNSUsers.PayorObj || '';
                    $scope.SearchClaimListObj.PayorId = $scope.selectedClaimNSUsers.PayorId || 0;

                    if ($scope.SearchClaimListObj.RenderingProviderId != 0) {
                        var TemaProviderlist = $filter("filter")($scope.mainBillerDataObj.AllDoctorsList, { "DoctorID": $scope.SearchClaimListObj.RenderingProviderId }, true) || [];
                        if (TemaProviderlist.length > 0) {
                            $scope.SearchClaimListObj.RenderingProviderName = TemaProviderlist[0].FullName || '';
                        }
                    }

                    if ($scope.ClaimLocationList.length > 0 && $scope.selectedClaimNSUsers.checkedNSLocationList != '') {
                        angular.forEach($scope.ClaimLocationList, function (Aitem) {
                            Aitem.IsChecked = false;
                        });

                        var selectedClinicIds = $scope.selectedClaimNSUsers.checkedNSLocationList.split(",");

                        // Re-check only those items in the array that match the ClinicIds
                        $scope.ClaimLocationList.forEach(pitem => {
                            pitem.IsChecked = selectedClinicIds.includes(pitem.ClinicId.toString());
                        });
                    }

                } else {
                    $scope.SearchClaimListObj = {
                        FromDate: moment().format("MM-DD-YYYY"),
                        ToDate: moment().format("MM-DD-YYYY"),
                        BillingProviderId: 0,
                        RenderingProviderId: 0,
                        TransmissionMethodId: 0,
                        IsReadytosubmit: false,
                    }

                }
            }
            if (type == 'Transmitted') {
                $scope.selectedClaimTransmittedUsers = eHnoteMasterDataService.getClaimsTransmittedUsersList();
                if ($scope.selectedClaimTransmittedUsers != '') {
                    $scope.SearchClaimListObj.FromDate = $scope.selectedClaimTransmittedUsers.FromDate || null;
                    $scope.SearchClaimListObj.ToDate = $scope.selectedClaimTransmittedUsers.ToDate || null;
                    $scope.SearchClaimListObj.BillingProviderId = $scope.selectedClaimTransmittedUsers.BillingProviderId || 0;
                    $scope.SearchClaimListObj.RenderingProviderId = $scope.selectedClaimTransmittedUsers.RenderingProviderId || 0;
                    $scope.SearchClaimListObj.TransmissionMethodId = $scope.selectedClaimTransmittedUsers.TransmissionMethodId || 0;
                    $scope.SearchClaimListObj.CurrentResponsibilityId = $scope.selectedClaimTransmittedUsers.CurrentResponsibilityId || 0;
                    $scope.SearchClaimListObj.BillPaymentTypeId = $scope.selectedClaimTransmittedUsers.BillPaymentTypeId || 0;
                    $scope.SearchClaimListObj.ClaimTypeId = $scope.selectedClaimTransmittedUsers.ClaimTypeId || 0;
                    $scope.SearchClaimListObj.PayorObj = $scope.selectedClaimTransmittedUsers.PayorObj || '';
                    $scope.SearchClaimListObj.PayorId = $scope.selectedClaimTransmittedUsers.PayorId || 0;

                    if ($scope.SearchClaimListObj.RenderingProviderId != 0) {
                        var TemaProviderlist = $filter("filter")($scope.mainBillerDataObj.AllDoctorsList, { "DoctorID": $scope.SearchClaimListObj.RenderingProviderId }, true) || [];
                        if (TemaProviderlist.length > 0) {
                            $scope.SearchClaimListObj.RenderingProviderName = TemaProviderlist[0].FullName || '';
                        }
                    }

                    $scope.selectedClaimTransmittedUsers.checkedTransmittedLocationList = $scope.selectedClaimTransmittedUsers.checkedTransmittedLocationList || '';
                    if ($scope.ClaimLocationList.length > 0 && $scope.selectedClaimTransmittedUsers.checkedTransmittedLocationList != '') {
                        angular.forEach($scope.ClaimLocationList, function (Aitem) {
                            Aitem.IsChecked = false;
                        });

                        var selectedClinicIds = $scope.selectedClaimTransmittedUsers.checkedTransmittedLocationList.split(",");

                        // Re-check only those items in the array that match the ClinicIds
                        $scope.ClaimLocationList.forEach(pitem => {
                            pitem.IsChecked = selectedClinicIds.includes(pitem.ClinicId.toString());
                        });
                    }

                    $scope.selectedClaimTransmittedUsers.checkedTransmittedClaimStatusList = $scope.selectedClaimTransmittedUsers.checkedTransmittedClaimStatusList || '';
                    if ($scope.ClaimStatusListDD.length > 0 && $scope.selectedClaimTransmittedUsers.checkedTransmittedClaimStatusList != '') {
                        angular.forEach($scope.ClaimStatusListDD, function (Aitem) {
                            Aitem.IsChecked = false;
                        });

                        var selectedClaimStatusIds = $scope.selectedClaimTransmittedUsers.checkedTransmittedClaimStatusList.split(",");

                        // Re-check only those items in the array that match the ClinicIds
                        $scope.ClaimStatusListDD.forEach(pitem => {
                            pitem.IsChecked = selectedClaimStatusIds.includes(pitem.ClaimStatusId.toString());
                        });
                    }
                } else {
                    $scope.SearchClaimListObj = {
                        FromDate: moment().format("MM-DD-YYYY"),
                        ToDate: moment().format("MM-DD-YYYY"),
                        BillingProviderId: 0,
                        RenderingProviderId: 0,
                        TransmissionMethodId: 0,

                    }

                }
            }
            if (type == 'Queue') {
                $scope.selectedClaimQueueList = eHnoteMasterDataService.getQueueUsersList();
                if ($scope.selectedClaimQueueList != '') {
                    $scope.SearchClaimListObj.FromDate = $scope.selectedClaimQueueList.FromDate || null;
                    $scope.SearchClaimListObj.ToDate = $scope.selectedClaimQueueList.ToDate || null;
                    $scope.SearchClaimListObj.BillingProviderId = $scope.selectedClaimQueueList.BillingProviderId || 0;
                    $scope.SearchClaimListObj.ClaimTypeId = $scope.selectedClaimQueueList.ClaimTypeId || 0;
                    $scope.SearchClaimListObj.PayorObj = $scope.selectedClaimQueueList.PayorObj || '';
                    $scope.SearchClaimListObj.PayorId = $scope.selectedClaimQueueList.PayorId || 0;
                    $scope.SearchClaimListObj.RenderingProviderId = $scope.selectedClaimQueueList.RenderingProviderId || 0;
                    $scope.SearchClaimListObj.TransmissionMethodId = $scope.selectedClaimQueueList.TransmissionMethodId || 0;

                    if ($scope.SearchClaimListObj.RenderingProviderId != 0) {
                        var TemaProviderlist = $filter("filter")($scope.mainBillerDataObj.AllDoctorsList, { "DoctorID": $scope.SearchClaimListObj.RenderingProviderId }, true) || [];
                        if (TemaProviderlist.length > 0) {
                            $scope.SearchClaimListObj.RenderingProviderName = TemaProviderlist[0].FullName || '';
                        }
                    }

                    $scope.selectedClaimQueueList.checkedQueueLocationList = $scope.selectedClaimQueueList.checkedQueueLocationList || '';
                    if ($scope.ClaimLocationList.length > 0 && $scope.selectedClaimQueueList.checkedQueueLocationList != '') {
                        angular.forEach($scope.ClaimLocationList, function (Aitem) {
                            Aitem.IsChecked = false;
                        });
                        var selectedClinicIds = $scope.selectedClaimQueueList.checkedQueueLocationList.split(",");

                        // Re-check only those items in the array that match the ClinicIds
                        $scope.ClaimLocationList.forEach(pitem => {
                            pitem.IsChecked = selectedClinicIds.includes(pitem.ClinicId.toString());
                        });
                    }

                } else {
                    $scope.SearchClaimListObj = {
                        FromDate: moment().format("MM-DD-YYYY"),
                        ToDate: moment().format("MM-DD-YYYY"),
                        BillingProviderId: 0,
                        ClaimTypeId: 0,
                        RenderingProviderId: 0,
                        TransmissionMethodId: 0,
                        PayorId: 0
                    }

                }
            }
            if (type == "Denial") {
                $scope.selectedClaimDenialList = eHnoteMasterDataService.getDenialUsersList();
                if ($scope.selectedClaimDenialList != '') {
                    $scope.SearchClaimListObj.FromDate = $scope.selectedClaimDenialList.FromDate || null;
                    $scope.SearchClaimListObj.ToDate = $scope.selectedClaimDenialList.ToDate || null;
                    $scope.SearchClaimListObj.BillingProviderId = $scope.selectedClaimDenialList.BillingProviderId || 0;
                    $scope.SearchClaimListObj.ClaimTypeId = $scope.selectedClaimDenialList.ClaimTypeId || 0;
                    $scope.SearchClaimListObj.PayorObj = $scope.selectedClaimDenialList.PayorObj || '';
                    $scope.SearchClaimListObj.PayorId = $scope.selectedClaimDenialList.PayorId || 0;
                    $scope.SearchClaimListObj.RenderingProviderId = $scope.selectedClaimDenialList.RenderingProviderId || 0;
                    $scope.SearchClaimListObj.BillPaymentTypeId = $scope.selectedClaimDenialList.BillPaymentTypeId || 0;
                    $scope.SearchClaimListObj.DenialCodeId = $scope.selectedClaimDenialList.DenialCodeId || 0;
                    $scope.SearchClaimListObj.TransmissionMethodId = $scope.selectedClaimDenialList.TransmissionMethodId || 0;
                    $scope.SearchClaimListObj.CurrentResponsibilityId = $scope.selectedClaimDenialList.CurrentResponsibilityId || 0;

                    //if ($scope.SearchClaimListObj.RenderingProviderId != 0) {
                    //    var TemaProviderlist = $filter("filter")($scope.mainBillerDataObj.AllDoctorsList, { "DoctorID": $scope.SearchClaimListObj.RenderingProviderId }, true) || [];
                    //    if (TemaProviderlist.length > 0) {
                    //        $scope.SearchClaimListObj.RenderingProviderName = TemaProviderlist[0].FullName || '';
                    //    }


                    if ($scope.mainBillerDataObj.AllDoctorsList.length > 0) {
                        angular.forEach($scope.mainBillerDataObj.AllDoctorsList, function (item) {
                            item.IsChecked = true;
                        });

                        $scope.SearchClaimListObj.AllDoctorsCheck = true;
                        $scope.changeDoctors();
                    }
                    if ($scope.ClaimDataList.length > 0) {
                        var ids = ($scope.SearchClaimListObj.BillPaymentTypeId || '').toString().split(',');

                        $scope.ClaimDataList.forEach(item => {
                            item.IsChecked = ids[0] ? ids.includes(item.BillPaymentTypeId.toString()) : true;
                        });

                        $scope.claimRespToggle();
                    }


                    if ($scope.ClaimFormatList.length > 0) {
                        var ids = ($scope.SearchClaimListObj.TransmissionMethodId || '').toString().split(',');

                        $scope.ClaimFormatList.forEach(item => {
                            item.IsChecked = ids[0] ? ids.includes(item.TransmissionMethodId.toString()) : true;
                        });

                        $scope.claimFormatToggle();
                    }
                    $scope.selectedClaimDenialList.checkedDenialLocationList = $scope.selectedClaimDenialList.checkedDenialLocationList || '';
                    if ($scope.ClaimLocationList.length > 0 && $scope.selectedClaimDenialList.checkedDenialLocationList != '') {
                        angular.forEach($scope.ClaimLocationList, function (Aitem) {
                            Aitem.IsChecked = false;
                        });
                        var selectedClinicIds = $scope.selectedClaimDenialList.checkedDenialLocationList.split(",");

                        $scope.ClaimLocationList.forEach(pitem => {
                            pitem.IsChecked = selectedClinicIds.includes(pitem.ClinicId.toString());
                        });
                    }

                } else {
                    $scope.SearchClaimListObj = {
                        FromDate: moment().format("MM-DD-YYYY"),
                        ToDate: moment().format("MM-DD-YYYY"),
                        BillingProviderId: 0,
                        BillPaymentTypeId: 0,
                        ClaimTypeId: 0,
                        RenderingProviderId: 0,
                        TransmissionMethodId: 0,
                        DenialCodeId: 0,
                        PayorId: 0,
                        CurrentResponsibilityId: 0
                    }
                }
                $scope.DenialFollowupTab = subtab || 'List';
                if ($scope.DenialFollowupTab == 'Summury') {
                   
                } else {
                    $scope.SearchDenailClaimDetails(1, 'Denial');
                }
                $scope.DenialFollowupTab = subtab || 'List';
                if ($scope.DenialFollowupTab == 'Summury') {

                } else {
                    $scope.SearchDenailClaimDetails(1, 'Denial');
                }
            }


            if ($scope.ClaimSubtabs == 6 && type == "acknoledge277") {
                /*$scope.refresh277AckmntDetails();*/
                $scope.selectedClaim277Acknowledgement = eHnoteMasterDataService.get277AcknowledgementFilterList();
                if ($scope.selectedClaim277Acknowledgement != '') {
                    $scope.SearchAckmtObj.FromDate = $scope.selectedClaim277Acknowledgement.FromDate || null;
                    $scope.SearchAckmtObj.ToDate = $scope.selectedClaim277Acknowledgement.ToDate || null;
                    $scope.SearchAckmtObj.PayorObj = $scope.selectedClaim277Acknowledgement.PayorObj || '';
                    $scope.SearchAckmtObj.PayorId = $scope.selectedClaim277Acknowledgement.PayorId || 0;
                    $scope.SearchAckmtObj.AcknowledgementSource = $scope.selectedClaim277Acknowledgement.AcknowledgementSource || '';
                    $scope.SearchAckmtObj.AcknowledgementStatusId = $scope.selectedClaim277Acknowledgement.AcknowledgementStatusId || 0;
                    $scope.SearchAckmtObj.SettlementStatusId = $scope.selectedClaim277Acknowledgement.SettlementStatusId || 0;
                } else {
                    $scope.SearchAckmtObj = {
                        FromDate: $filter('date')(new Date(), "MM-dd-yyyy"),
                        ToDate: $filter('date')(new Date(), "MM-dd-yyyy"),
                        PayorId: 0,
                        AcknowledgementStatusId: 0,
                        SettlementStatusId: 0,
                        AcknowledgementSource: '',
                    }
                }

                $scope.Search277AckDetails();
            }
            else if ($scope.ClaimSubtabs == 5 && type == "Rejected") {
                $scope.selectedClaimRejectedList = eHnoteMasterDataService.getRejectedUsersList();
                if ($scope.selectedClaimRejectedList != '') {
                    $scope.SearchClaimListObj.FromDate = $scope.selectedClaimRejectedList.FromDate || null;
                    $scope.SearchClaimListObj.ToDate = $scope.selectedClaimRejectedList.ToDate || null;
                    $scope.SearchClaimListObj.BillingProviderId = $scope.selectedClaimRejectedList.BillingProviderId || 0;
                    $scope.SearchClaimListObj.ClaimTypeId = $scope.selectedClaimRejectedList.ClaimTypeId || 0;
                    $scope.SearchClaimListObj.PayorObj = $scope.selectedClaimRejectedList.PayorObj || '';
                    $scope.SearchClaimListObj.PayorId = $scope.selectedClaimRejectedList.PayorId || 0;
                    $scope.SearchClaimListObj.RenderingProviderId = $scope.selectedClaimRejectedList.RenderingProviderId || 0;
                    $scope.SearchClaimListObj.BillPaymentTypeId = $scope.selectedClaimRejectedList.BillPaymentTypeId || 0;
                    $scope.SearchClaimListObj.TransmissionMethodId = $scope.selectedClaimRejectedList.TransmissionMethodId || 0;

                    //if ($scope.SearchClaimListObj.RenderingProviderId != 0) {
                    //    var TemaProviderlist = $filter("filter")($scope.mainBillerDataObj.AllDoctorsList, { "DoctorID": $scope.SearchClaimListObj.RenderingProviderId }, true) || [];
                    //    if (TemaProviderlist.length > 0) {
                    //        $scope.SearchClaimListObj.RenderingProviderName = TemaProviderlist[0].FullName || '';
                    //    }

                    if ($scope.mainBillerDataObj.AllDoctorsList.length > 0) {
                        angular.forEach($scope.mainBillerDataObj.AllDoctorsList, function (item) {
                            item.IsChecked = true;
                        });

                        $scope.SearchClaimListObj.AllDoctorsCheck = true;
                        $scope.changeDoctors();
                    }
                    if ($scope.ClaimDataList.length > 0) {
                        var ids = ($scope.SearchClaimListObj.BillPaymentTypeId || '').toString().split(',');

                        $scope.ClaimDataList.forEach(item => {
                            item.IsChecked = ids[0] ? ids.includes(item.BillPaymentTypeId.toString()) : true;
                        });

                        $scope.claimRespToggle();
                    }


                    if ($scope.ClaimFormatList.length > 0) {
                        var ids = ($scope.SearchClaimListObj.TransmissionMethodId || '').toString().split(',');

                        $scope.ClaimFormatList.forEach(item => {
                            item.IsChecked = ids[0] ? ids.includes(item.TransmissionMethodId.toString()) : true;
                        });

                        $scope.claimFormatToggle();
                    }
                    $scope.selectedClaimRejectedList.checkedRejectedLocations = $scope.selectedClaimRejectedList.checkedRejectedLocations || '';
                    if ($scope.ClaimLocationList.length > 0 && $scope.selectedClaimRejectedList.checkedRejectedLocations != '') {
                        angular.forEach($scope.ClaimLocationList, function (Aitem) {
                            Aitem.IsChecked = false;
                        });
                        var selectedClinicIds = $scope.selectedClaimRejectedList.checkedRejectedLocations.split(",");

                        $scope.ClaimLocationList.forEach(pitem => {
                            pitem.IsChecked = selectedClinicIds.includes(pitem.ClinicId.toString());
                        });
                    }

                } else {
                    $scope.SearchClaimListObj = {
                        FromDate: moment().format("MM-DD-YYYY"),
                        ToDate: moment().format("MM-DD-YYYY"),
                        BillingProviderId: 0,
                        ClaimTypeId: 0,
                        RenderingProviderId: 0,
                        TransmissionMethodId: 0,
                        PayorId: 0,
                        BillPaymentTypeId: 0
                    }
                }

                $scope.SearchRejectedFollowUps('Rejected');
            }
            else if ($scope.ClaimSubtabs == 7 && type == "acknoledge999") {
                //$scope.refresh999AckmntData();
                $scope.selectedClaim999Acknowledgement = eHnoteMasterDataService.get999AcknowledgementFilterList();
                if ($scope.selectedClaim999Acknowledgement != '') {
                    $scope.Search999AckmtObj.FromDate = $scope.selectedClaim999Acknowledgement.FromDate || null;
                    $scope.Search999AckmtObj.ToDate = $scope.selectedClaim999Acknowledgement.ToDate || null;
                    $scope.Search999AckmtObj.StatusId = $scope.selectedClaim999Acknowledgement.StatusId || 0;

                } else {
                    $scope.Search999AckmtObj = {
                        FromDate: $filter('date')(new Date(), "MM-dd-yyyy"),
                        ToDate: $filter('date')(new Date(), "MM-dd-yyyy"),
                        StatusId: 0,
                    }
                }

                $scope.Search999AckDetails();
            }
            else if ($scope.ClaimSubtabs == 8 && type == "ClaimFollowup") {
                $scope.AllUsersListObj = angular.copy($scope.GetAllUsersListData());
                if ($scope.AllHospitalData.AllUsersList.length > 0) {
                    $scope.AllHospitalData.AllUsersList.forEach(function (item) {
                        item.IsChecked = false;
                        if ($scope.UserId === item.DoctorID) {
                            item.IsChecked = true;
                        }
                    });
                    $scope.AllUsersToggle();
                }

                $scope.selectedClaimFollowup = eHnoteMasterDataService.getClaimFollowupFilterList();
                if ($scope.selectedClaimFollowup != '') {
                    $scope.SearchClaimFollowupObj.FromDate = $scope.selectedClaimFollowup.FromDate || null;
                    $scope.SearchClaimFollowupObj.ToDate = $scope.selectedClaimFollowup.ToDate || null;
                    $scope.selectedClaimFollowup.AssigntoIds = $scope.selectedClaimFollowup.AssigntoIds || '';

                    if ($scope.AllHospitalData.AllUsersList.length > 0 && $scope.selectedClaimFollowup.AssigntoIds != '') {
                        angular.forEach($scope.AllHospitalData.AllUsersList, function (Aitem) {
                            Aitem.IsChecked = false;
                        });

                        var selectedClinicIds = $scope.selectedClaimFollowup.AssigntoIds.split(",");
                        $scope.AllHospitalData.AllUsersList.forEach(pitem => {
                            pitem.IsChecked = selectedClinicIds.includes(pitem.DoctorID.toString());
                        });
                    }
                } else {
                    $scope.SearchClaimFollowupObj = {
                        FromDate: $filter('date')(new Date(), "MM-dd-yyyy"),
                        ToDate: $filter('date')(new Date(), "MM-dd-yyyy"),
                    }
                }

                $scope.SearchClaimFollowupslist();
            }

            else if (type == "AdjustReq") {
                $scope.AllUsersListObj = angular.copy($scope.GetAllUsersListData());
                $scope.AllUsersListObj.IsChecked = true;
                if ($scope.AllHospitalData.AllUsersList.length > 0) {
                    $scope.AllHospitalData.AllUsersList.forEach(function (item) {
                        item.IsChecked = true;
                        //if ($scope.UserId === item.DoctorID) {
                        //    item.IsChecked = true;
                        //}
                    });
                    $scope.AllUsersToggle();
                }

                $scope.selectedClaimAdjustmentReq = eHnoteMasterDataService.getClaimAdjustReqFilterList();
                if ($scope.mainBillerDataObj.AllDoctorsList.length > 0) {
                    angular.forEach($scope.mainBillerDataObj.AllDoctorsList, function (item) {
                        item.IsChecked = true;
                    });

                    $scope.SearchClaimListObj.AllDoctorsCheck = true;
                    $scope.changeDoctors();
                }
                if ($scope.ClaimDataList.length > 0) {
                    var ids = ($scope.SearchClaimListObj.BillPaymentTypeId || '').toString().split(',');

                    $scope.ClaimDataList.forEach(item => {
                        item.IsChecked = ids[0] ? ids.includes(item.BillPaymentTypeId.toString()) : true;
                    });

                    $scope.claimRespToggle();
                }


                if ($scope.ClaimFormatList.length > 0) {
                    var ids = ($scope.SearchClaimListObj.TransmissionMethodId || '').toString().split(',');

                    $scope.ClaimFormatList.forEach(item => {
                        item.IsChecked = ids[0] ? ids.includes(item.TransmissionMethodId.toString()) : true;
                    });

                    $scope.claimFormatToggle();
                }
                if ($scope.selectedClaimAdjustmentReq != '') {
                    $scope.SearchClaimAdjustReqObj.FromDate = $scope.selectedClaimAdjustmentReq.FromDate || null;
                    $scope.SearchClaimAdjustReqObj.ToDate = $scope.selectedClaimAdjustmentReq.ToDate || null;
                    $scope.selectedClaimAdjustmentReq.RequestedByUserId = $scope.selectedClaimAdjustmentReq.RequestedByUserId || '';

                    if ($scope.AllHospitalData.AllUsersList.length > 0 && $scope.selectedClaimAdjustmentReq.RequestedByUserId != '') {
                        angular.forEach($scope.AllHospitalData.AllUsersList, function (Aitem) {
                            Aitem.IsChecked = false;
                        });

                        var selectedClinicIds = $scope.selectedClaimAdjustmentReq.RequestedByUserId.split(",");
                        $scope.AllHospitalData.AllUsersList.forEach(pitem => {
                            pitem.IsChecked = selectedClinicIds.includes(pitem.DoctorID.toString());
                        });
                        $scope.AllUsersListObj.IsChecked = $scope.AllHospitalData.AllUsersList.filter(pitem => pitem.DoctorID != 0).every(pitem => pitem.IsChecked);
                    }
                } else {
                    $scope.SearchClaimAdjustReqObj = {
                        FromDate: $filter('date')(new Date(), "MM-dd-yyyy"),
                        ToDate: $filter('date')(new Date(), "MM-dd-yyyy"),
                    }
                }

                $scope.SearchAdjustmentReqslist(1);
            }
            else if (type == "PaperClaims") {
                $scope.IsAckList = false;
                $scope.SearchClaimListObj.TransmissionMethodId = 2;
                $scope.SearchClaimListObj.TransmissionMethod = "Paper";
                if ($scope.mainBillerDataObj.AllDoctorsList.length > 0) {
                    angular.forEach($scope.mainBillerDataObj.AllDoctorsList, function (item) {
                        item.IsChecked = true;
                    });

                    $scope.SearchClaimListObj.AllDoctorsCheck = true;
                    $scope.changeDoctors();
                }
                if ($scope.ClaimDataList.length > 0) {
                    var ids = ($scope.SearchClaimListObj.BillPaymentTypeId || '').toString().split(',');

                    $scope.ClaimDataList.forEach(item => {
                        item.IsChecked = ids[0] ? ids.includes(item.BillPaymentTypeId.toString()) : true;
                    });

                    $scope.claimRespToggle();
                }
                $scope.SearchAllClaimDetails(pageno, 'PaperClaims');
            } else if (type == "PrivateClaims") {

                $scope.selectedPrivateClaimUsers = eHnoteMasterDataService.getPrivateClaimsAllUsers();
                if ($scope.selectedPrivateClaimUsers != '') {
                    $scope.SearchClaimListObj.FromDate = $scope.selectedPrivateClaimUsers.FromDate || null;
                    $scope.SearchClaimListObj.ToDate = $scope.selectedPrivateClaimUsers.ToDate || null;
                    $scope.SearchClaimListObj.BillingProviderId = $scope.selectedPrivateClaimUsers.BillingProviderId || 0;
                    $scope.SearchClaimListObj.RenderingProviderId = $scope.selectedPrivateClaimUsers.RenderingProviderId || 0;
                    $scope.SearchClaimListObj.BillPaymentTypeId = $scope.selectedPrivateClaimUsers.BillPaymentTypeId || 0;
                    $scope.SearchClaimListObj.CurrentResponsibilityId = $scope.selectedPrivateClaimUsers.CurrentResponsibilityId || 0;
                    $scope.SearchClaimListObj.ClaimTypeId = $scope.selectedPrivateClaimUsers.ClaimTypeId || 0;
                    $scope.SearchClaimListObj.PayorObj = $scope.selectedPrivateClaimUsers.PayorObj || '';
                    $scope.SearchClaimListObj.PayorId = $scope.selectedPrivateClaimUsers.PayorId || 0;
                    $scope.SearchClaimListObj.TransmissionMethodId = 0;
                    //if ($scope.SearchClaimListObj.RenderingProviderId != 0) {
                    //    var TemaProviderlist = $filter("filter")($scope.mainBillerDataObj.AllDoctorsList, { "DoctorID": $scope.SearchClaimListObj.RenderingProviderId }, true) || [];
                    //    if (TemaProviderlist.length > 0) {
                    //        $scope.SearchClaimListObj.RenderingProviderName = TemaProviderlist[0].FullName || '';
                    //    }

                    if ($scope.mainBillerDataObj.AllDoctorsList.length > 0) {
                        angular.forEach($scope.mainBillerDataObj.AllDoctorsList, function (item) {
                            item.IsChecked = true;
                        });

                        $scope.SearchClaimListObj.AllDoctorsCheck = true;
                        $scope.changeDoctors();
                    }

                    if ($scope.ClaimLocationList.length > 0 && $scope.selectedPrivateClaimUsers.checkLocationList.length > 0) {
                        angular.forEach($scope.ClaimLocationList, function (Aitem) {
                            Aitem.IsChecked = false;
                        });
                        angular.forEach($scope.selectedPrivateClaimUsers.checkLocationList, function (Aitem) {
                            angular.forEach($scope.ClaimLocationList, function (Bitem) {
                                if (Aitem.ClinicId == Bitem.ClinicId) {
                                    Bitem.IsChecked = true;
                                }
                            });
                        });
                    }

                    if ($scope.ClaimStatusListDD.length > 0 && $scope.selectedPrivateClaimUsers.checkClaimStatus.length > 0) {
                        angular.forEach($scope.ClaimStatusListDD, function (Aitem) {
                            Aitem.IsChecked = false;
                        });
                        angular.forEach($scope.ClaimStatusListDD, function (Aitem) {
                            angular.forEach($scope.selectedPrivateClaimUsers.checkClaimStatus, function (Bitem) {
                                if (Aitem.ClaimStatusId == Bitem.ClaimStatusId) {
                                    Aitem.IsChecked = true;
                                }
                            });
                        });
                    }
                } else {
                    $scope.SearchClaimListObj = {
                        FromDate: moment().format("MM-DD-YYYY"),
                        ToDate: moment().format("MM-DD-YYYY"),
                        BillingProviderId: 0,
                        RenderingProviderId: 0,
                        BillPaymentTypeId: 0,
                        TransmissionMethodId: 0,
                        CurrentResponsibilityId: 0,
                    }

                }


                $scope.SearchClaimListObj.BillPaymentTypeId = 1;
                $scope.SearchAllClaimDetails(pageno, 'PrivateClaims');
            }
            else if (type == 'DeletedClaims') {
                $scope.DeleteClaimsHistoryList()
            } else {
                $scope.SearchAllClaimDetails(pageno, type);
            }



            $scope.patSearchType = 2;
            $scope.PatientSearchdata.SearchTypeId = 2;
            $scope.SearchClaimListObj.SearchText = "";
            $scope.SearchClaimListObj.PatientMRNo = "";
            $scope.SearchClaimListObj.PatienClaimNumber = "";
        }
        $scope.mainClaimStatuses = [];
        $scope.otherClaimStatuses = [];
        $scope.SearchPatientwithClaimId = function (pageno, type) {

            var ClaimStatusList = $scope.MasterClaimStatusList.map(function (status) {
                return status.ClaimStatusId;
            }).join(',');

            var type = (type === undefined || type === '') ? 'All' : type;
            var params = {
                "OrganizationId": $scope.SearchClaimListObj.OrganizationId,
                "OrganizationFacilityId": 0,
                "FromDate": "",
                "ToDate": "",
                "PatientId": 0,
                "SearchText": "",
                "PatientMRNo": "",
                "PatienClaimNumber": $scope.SearchClaimListObj.ClaimNumber || "",
                "BatchNumber": "",
                "BillingProviderId": 0,
                "RenderingProviderId": 0,
                "TransmissionTypeId": 0,
                "ClaimTypeId": 0,
                "PayorId": 0,
                "ClaimStatusList": ClaimStatusList,
                "PageSize": 100,
                "PageNumber": 1,
                "Type": type,
                "BillPaymentTypeId": 0,
                "CurrentResponsibilityId": 0,
                "DenialId": 0
            };
         
            eHnotePatientDataService.GetOrganizationClaimsListData(params).then(function (resp) {
                console.log(resp);
                $scope.ClaimListCount = resp.data.count;
                resp.data.rows = resp.data.rows || [];
                if (resp.data.rows.length > 0) {
                    $scope.navtoClaimSummaryPopup(resp.data.rows[0]);
                }
            }, function (err) {

            });
            $scope.SearchClaimListObj.ClaimNumber = "";

        }
        $scope.ShowAdjustmentDueDays = false;
        $scope.SearchDenailClaimDetails = function (pageno, type, action, isFromSortAction) {
            $scope.IsAckList = false;
            $scope.ShowAdjustmentDueDays = false;
            isFromSortAction = isFromSortAction || false;
            var action = action || "";
            $scope.TotalClaimBalance = 0;
            $scope.TotalClaimBilledAmount = 0;
            $scope.TotalClaimInsuranceBalance = 0;
            $scope.TotalClaimPatientBalance = 0;
            $scope.SearchClaimListObj.PageNumber = pageno || 1;
            var type = (type === undefined || type === '') ? 'All' : type;
            if(type == "Denial") {
                if ($scope.ClaimLocationList.length > 0) {
                    var checkedDenialLocationList = $scope.ClaimLocationList
                        .filter(pitem => pitem.IsChecked)
                        .map(pitem => pitem.ClinicId)
                        .join(",");
                }
                var Frezobj4 = {
                    "FromDate": $filter("date")(new Date($scope.SearchClaimListObj.FromDate), "MM-dd-yyyy") || '',
                    "ToDate": $filter("date")(new Date($scope.SearchClaimListObj.ToDate), "MM-dd-yyyy") || '',
                    "BillingProviderId": $scope.SearchClaimListObj.BillingProviderId || 0,
                    "ClaimTypeId": $scope.SearchClaimListObj.ClaimTypeId || 0,
                    "PayorObj": $scope.SearchClaimListObj.PayorObj || '',
                    "PayorId": $scope.SearchClaimListObj.PayorId || 0,
                    "RenderingProviderId": $scope.SearchClaimListObj.RenderingProviderId || 0,
                    "checkedDenialLocationList": checkedDenialLocationList || '',
                    "BillPaymentTypeId": $scope.SearchClaimListObj.BillPaymentTypeId || 0,
                    "DenialCodeId": $scope.SearchClaimListObj.DenialCodeId || 0,
                    "TransmissionMethodId": $scope.SearchClaimListObj.TransmissionMethodId || 0,
                    "CurrentResponsibilityId": $scope.SearchClaimListObj.CurrentResponsibilityId || 0,
                };
                eHnoteMasterDataService.addDenialUsersList(Frezobj4);
            }
            var TempAddress = $filter("filter")($scope.ClaimLocationList, function (iterator, ind) { return iterator.ClinicId !== 0 && iterator.IsChecked; });
            var HospitalIDs = _.pluck(TempAddress, "BranchId").join(",");

            if ($scope.ClaimStatusListDD.length > 0) {
                var SelectedClaimIds = $scope.ClaimStatusListDD
                    .filter(pitem => pitem.IsChecked)
                    .map(pitem => pitem.ClaimStatusId)
                    .join(",");
            }
            var IsClaimStatusId = false;
            if (SelectedClaimIds === "1") {
                IsClaimStatusId = true;
            }
            var params = {
                "OrganizationId": $scope.SearchClaimListObj.OrganizationId,
                "OrganizationFacilityId": $scope.SearchClaimListObj.OrganizationFacilityId || 0,
                "FromDate": $filter('date')($scope.SearchClaimListObj.FromDate, 'MM-dd-yyyy') || "",
                "ToDate": $filter('date')($scope.SearchClaimListObj.ToDate, 'MM-dd-yyyy') || "",
                "PatientId": $scope.SearchClaimListObj.PatientId || 0,
                "SearchText": $scope.SearchClaimListObj.SearchText || "",
                "PatientMRNo": $scope.SearchClaimListObj.PatientMRNo || "",
                "PatienClaimNumber": (type == "Claims") ? $scope.SearchClaimListObj.ClaimNumber : $scope.SearchClaimListObj.PatienClaimNumber || "",
                "BatchNumber": $scope.SearchClaimListObj.BatchNumber || "",
                "BillingProviderId": $scope.SearchClaimListObj.BillingProviderId || 0,
                "RenderingProviderId": $scope.SearchClaimListObj.RenderingProviderId || 0,
                "TransmissionTypeId": $scope.SearchClaimListObj.TransmissionMethodId || 0,
                "ClaimTypeId": $scope.SearchClaimListObj.ClaimTypeId || 0,
                "PayorId": $scope.SearchClaimListObj.PayorId || 0,
                "ClaimStatusList": SelectedClaimIds || '',
                "PageSize": $scope.SearchClaimListObj.PageSize,
                "PageNumber": $scope.SearchClaimListObj.PageNumber,
                "Type": type,
                "BillPaymentTypeId": $scope.SearchClaimListObj.BillPaymentTypeId,
                "CurrentResponsibilityId": $scope.SearchClaimListObj.CurrentResponsibilityId || 0,
                "IsReadytosubmit": $scope.SearchClaimListObj.IsReadytosubmit || false,
                "DenialId": $scope.SearchClaimListObj.DenialId || 0,
                "FacilityListIds": '',
                "Locationids": HospitalIDs,
                "TransmissionFromDate": $scope.SearchClaimListObj.TransmissionFromDate,
                "TransmissionToDate": $scope.SearchClaimListObj.TransmissionToDate,
                "IsClaimStatusId": IsClaimStatusId,
                "DenialStatusId": $scope.DenailClaimStatusListObj1.DenialStatusId,
                "DateType": $scope.SearchClaimListObj.DateType,
                "AdjWindowDays": $scope.DenailClaimStatusListObj1.adjWindow || null,
                "SortColumn": $scope.SearchClaimListObj.SortColumn,
                "SortOrder": $scope.SearchClaimListObj.SortOrder
            };
            eHnotePatientDataService.GetOrgClaimDenialList(params).then(function (resp) {
                console.log(resp);
                $scope.OrgClaimListdata = [];
                $scope.ClaimAcknowledgementReqlist = [];

                let statusId = $scope.DenailClaimStatusListObj1?.DenialStatusId;
                $scope.ShowAdjustmentDueDays = (statusId === 0 || statusId === 2);

                $scope.ClaimListCount = resp.data.count;
                $scope.TotalClaimBalance = resp.data.TotalBalance;
                $scope.TotalClaimBilledAmount = resp.data.TotalBilledAmount;
                $scope.TotalClaimInsuranceBalance = resp.data.TotalInsuranceBalance;
                $scope.TotalClaimPatientBalance = resp.data.TotalPatientBalance;
                $scope.checkedOrgClaimCount = 0;
                resp.data.rows = resp.data.rows || [];
                if (resp.data.rows.length > 0) {
                    $scope.OrgClaimListdata = resp.data.rows;
                    $scope.ClaimAcknowledgementReqlist = $filter("filter")($scope.OrgClaimListdata, function (item) {
                        return item.ClaimStatusId === 5 || item.ClaimStatusId === 6 ||
                            item.ClaimStatusId === 7 || item.ClaimStatusId === 10 ||
                            item.ClaimStatusId === 11 || item.ClaimStatusId === 12 ||
                            item.ClaimStatusId === 13 || item.ClaimStatusId === 14
                            || item.ClaimStatusId === 26 || item.ClaimStatusId === 27;
                    });
                    $scope.SearchClaimAcknowledgementReqObj.Count = $scope.ClaimAcknowledgementReqlist.length;
                    console.log($scope.SearchClaimAcknowledgementReqObj.Count);
                    console.log($scope.ClaimAcknowledgementReqlist);
                    var today = new Date();

                    angular.forEach($scope.OrgClaimListdata, function (claim, cindex) {
                        claim.IsSelectedClaim = false;
                        claim.AckId = claim.AckId || 0;
                        claim.TotalPatientPayment = claim.TotalPatientPayment || 0;
                        claim.AckNumber = claim.AckNumber || "";

                        //if (cindex===0) {
                        //    claim.AckNumber = "ACK20261220082620";
                        //    claim.AckId = 1;
                        //}

                        if (claim.ClaimFilingLimitDays > 0) {

                            if (claim.BillPaymentTypeId == 1 || claim.ClaimStatusId != 1) {
                                claim.ClaimDueOnDays = 0;

                            }
                            else if (!claim.DOSFrom || isNaN(new Date(claim.DOSFrom).getTime())) {
                                claim.ClaimDueOnDays = 0;

                            }
                            else {
                                var dosDate = new Date(claim.DOSFrom);
                                var expiryDate = new Date(dosDate);
                                expiryDate.setDate(expiryDate.getDate() + claim.ClaimFilingLimitDays);

                                var remainingDays = Math.ceil(
                                    (expiryDate - today) / (1000 * 60 * 60 * 24)
                                );

                                //if (remainingDays <= 0) {
                                //    claim.ClaimDueOnDays = 0;

                                //} else {
                                //    claim.ClaimDueOnDays = remainingDays;

                                //}
                                claim.ClaimDueOnDays = remainingDays;
                            }
                        }

                        if (claim.AdjustmentFilingLimitDays > 0) {

                            // Only for DENIED claims
                            if (claim.BillPaymentTypeId == 1 || claim.ClaimStatusId !== 19) {
                                claim.AdjustmentDueOnDays = 0;
                                return;
                            }

                            if (!claim.DenialCheckDate || isNaN(new Date(claim.DenialCheckDate).getTime())) {
                                claim.AdjustmentDueOnDays = 0;
                                return;
                            }

                            var denialDate = new Date(claim.DenialCheckDate);
                            var expiryDate = new Date(denialDate);
                            expiryDate.setDate(expiryDate.getDate() + claim.AdjustmentFilingLimitDays);

                            var remainingDays = Math.ceil(
                                (expiryDate - today) / (1000 * 60 * 60 * 24)
                            );

                            //claim.AdjustmentDueOnDays = remainingDays > 0 ? remainingDays : 0;
                            claim.AdjustmentDueOnDays = remainingDays;
                        }


                        claim.AppealSentText = null;

                        if (claim.DenialCheckDate && claim.AppealedDate &&
                            !isNaN(new Date(claim.DenialCheckDate).getTime()) &&
                            !isNaN(new Date(claim.AppealedDate).getTime())) {

                            var checkDate = new Date(claim.DenialCheckDate);
                            var appealedDate = new Date(claim.AppealedDate);

                            // Remove time part
                            checkDate = new Date(checkDate.getFullYear(), checkDate.getMonth(), checkDate.getDate());
                            appealedDate = new Date(appealedDate.getFullYear(), appealedDate.getMonth(), appealedDate.getDate());

                            var daysDifference = Math.floor(
                                (appealedDate - checkDate) / (1000 * 60 * 60 * 24)
                            );

                            if (daysDifference >= 0) {
                                claim.AppealSentText = "Appealed D+" + daysDifference;
                            }
                        }





                    });

                    $scope.SearchClaimListObj.Count = resp.data.count || 0;
                    if (type == "Denial") {
                        $scope.OrgClaimListdata.forEach(function (claim) {
                            // Extract denial codes for the current claim
                            var denialCodes = claim.ClaimDenials
                                .filter(function (denial) {
                                    return denial.PatientClaimId === claim.PatientClaimId;
                                })
                                .map(function (denial) {
                                    return denial.DenialCode;
                                })
                                .join(', '); // Join denial codes into a comma-separated string

                            // Append denial codes to the claim object
                            claim.DenialCodes = denialCodes; // Add as a new property

                            var adjustmentDescriptions = claim.Adjustments
                                .map(function (adj) {
                                    return adj.AdjsutmentReasonDescription;
                                })
                                .join(', ');

                            claim.AdjsutmentReasonDescription = adjustmentDescriptions;
                        });
                        //$scope.OrgClaimListdata.forEach(function (claim) {
                        //    // Extract denial codes for the current claim
                        //    var allCodeObjects = claim.ClaimDenials
                        //        .filter(function (denial) {
                        //            return denial.PatientClaimId === claim.PatientClaimId;
                        //        })
                        //        .map(function (denial) {
                        //            return {
                        //                code: denial.DenialCode,
                        //                description: denial.DenialCodeDescription || ''
                        //            };
                        //        });

                        //    claim.AllDenialCodes = allCodeObjects;
                        //    claim.DenialCodesVisible = allCodeObjects.slice(0, 2);
                        //    claim.DenialCodesExtraCount = Math.max(0, allCodeObjects.length - 2);
                        //    claim.DenialCodes = allCodeObjects.map(function (d) { return d.code; }).join(', ');


                        //    var adjustmentDescriptions = claim.Adjustments
                        //        .map(function (adj) {
                        //            return adj.AdjsutmentReasonDescription;
                        //        })
                        //        .join(', ');

                        //    claim.AdjsutmentReasonDescription = adjustmentDescriptions;
                        //});
                    }
                    else {

                    }

                }
                if (!isFromSortAction) {
                    $scope.SearchClaimCountDetails(type, SelectedClaimIds, pageno);
                }
                $scope.ClaimSubtabActive = angular.copy($scope.ClaimSubtabs) || 1;

            }, function (err) {

            });
        }


        $scope.SearchAllClaimDetails = function (pageno, type, action) {
            $scope.IsAckList = false;
            var action = action || "";
            $scope.TotalClaimBalance = 0;
            $scope.TotalClaimBilledAmount = 0;
            $scope.TotalClaimInsuranceBalance = 0;
            $scope.TotalClaimPatientBalance = 0;

            $scope.SearchClaimListObj.PageNumber = pageno || 1;
            var type = (type === undefined || type === '') ? 'All' : type;
            if (type == "Transmitted") {
                // Convert the string into an array
                var claimStatusArray = $scope.SearchClaimListObj.ClaimStatusList.split(',');
                claimStatusArray = claimStatusArray.filter(function (statusId) {
                    return statusId !== '1' && statusId !== '2';
                });

                // Convert the array back to a string
                $scope.SearchClaimListObj.ClaimStatusList = claimStatusArray.join(',');


                if ($scope.ClaimLocationList.length > 0) {
                    var checkedTransmittedLocationList = $scope.ClaimLocationList
                        .filter(pitem => pitem.IsChecked)
                        .map(pitem => pitem.ClinicId)
                        .join(",");
                }
                if ($scope.ClaimStatusListDD.length > 0) {
                    var checkedTransmittedClaimStatusList = $scope.ClaimStatusListDD
                        .filter(pitem => pitem.IsChecked)
                        .map(pitem => pitem.ClaimStatusId)
                        .join(",");
                }
                if ($scope.SearchClaimListObj.AllPayorList.length > 0) {
                    var PayorIds = $scope.SearchClaimListObj.AllPayorList
                        .map(pitem => pitem.PayorId)
                        .join(",");
                }

                var Frezobj2 = {
                    "FromDate": $filter("date")(new Date($scope.SearchClaimListObj.FromDate), "MM-dd-yyyy") || '',
                    "ToDate": $filter("date")(new Date($scope.SearchClaimListObj.ToDate), "MM-dd-yyyy") || '',
                    "BillingProviderId": $scope.SearchClaimListObj.BillingProviderId || 0,
                    "RenderingProviderId": $scope.SearchClaimListObj.RenderingProviderId || 0,
                    "BillPaymentTypeId": $scope.SearchClaimListObj.BillPaymentTypeId || 0,
                    "checkedTransmittedLocationList": checkedTransmittedLocationList || '',
                    "TransmissionMethodId": $scope.SearchClaimListObj.TransmissionMethodId || 0,
                    "checkedTransmittedClaimStatusList": checkedTransmittedClaimStatusList || '',
                    "CurrentResponsibilityId": $scope.SearchClaimListObj.CurrentResponsibilityId || 0,
                    "ClaimTypeId": $scope.SearchClaimListObj.ClaimTypeId || 0,
                    "PayorObj": $scope.SearchClaimListObj.PayorObj || '',
                    "PayorId": $scope.SearchClaimListObj.PayorId || 0,
                    "PayorIds": PayorIds || "",
                };
                eHnoteMasterDataService.addClaimsTransmittedUsersList(Frezobj2);

            }

            if (type == "Queue") {
                // Convert the string into an array
                // $scope.SearchClaimListObj.ClaimStatusList = $scope.MasterClaimStatusList;
                //var claimStatusArray = '2';
                var claimStatusArray = $scope.SearchClaimListObj.ClaimStatusList.split(',');
                claimStatusArray = claimStatusArray.filter(function (statusId) {
                    return statusId === '2';
                });

                // Convert the array back to a string
                $scope.SearchClaimListObj.ClaimStatusList = claimStatusArray.join(',');

                if ($scope.ClaimLocationList.length > 0) {
                    var checkedQueueLocationList = $scope.ClaimLocationList
                        .filter(pitem => pitem.IsChecked)
                        .map(pitem => pitem.ClinicId)
                        .join(",");
                }
                var Frezobj3 = {
                    "FromDate": $filter("date")(new Date($scope.SearchClaimListObj.FromDate), "MM-dd-yyyy") || '',
                    "ToDate": $filter("date")(new Date($scope.SearchClaimListObj.ToDate), "MM-dd-yyyy") || '',
                    "BillingProviderId": $scope.SearchClaimListObj.BillingProviderId || 0,
                    "ClaimTypeId": $scope.SearchClaimListObj.ClaimTypeId || 0,
                    "PayorObj": $scope.SearchClaimListObj.PayorObj || '',
                    "PayorId": $scope.SearchClaimListObj.PayorId || 0,
                    "RenderingProviderId": $scope.SearchClaimListObj.RenderingProviderId || 0,
                    "checkedQueueLocationList": checkedQueueLocationList || '',
                    "TransmissionMethodId": $scope.SearchClaimListObj.TransmissionMethodId || 0,

                };
                eHnoteMasterDataService.addQueueUsersList(Frezobj3);
            }

            if (type == "All") {
                var checkLocationList = [];
                if ($scope.ClaimLocationList.length > 0) {
                    checkLocationList = _.where($scope.ClaimLocationList, { IsChecked: true });
                }
                var checkClaimStatus = [];
                if ($scope.ClaimStatusListDD.length > 0) {
                    checkClaimStatus = _.where($scope.ClaimStatusListDD, { IsChecked: true });
                }
                if ($scope.SearchClaimListObj.AllPayorList.length > 0) {
                    var PayorIds = $scope.SearchClaimListObj.AllPayorList
                        .map(pitem => pitem.PayorId)
                        .join(",");
                }
                var Frezobj = {
                    "FromDate": $filter("date")(new Date($scope.SearchClaimListObj.FromDate), "MM-dd-yyyy") || '',
                    "ToDate": $filter("date")(new Date($scope.SearchClaimListObj.ToDate), "MM-dd-yyyy") || '',
                    "BillingProviderId": $scope.SearchClaimListObj.BillingProviderId || 0,
                    "RenderingProviderId": $scope.SearchClaimListObj.RenderingProviderId || 0,
                    "BillPaymentTypeId": $scope.SearchClaimListObj.BillPaymentTypeId || 0,
                    "checkLocationList": checkLocationList || [],
                    "TransmissionMethodId": $scope.SearchClaimListObj.TransmissionMethodId || 0,
                    "checkClaimStatus": checkClaimStatus || [],
                    "CurrentResponsibilityId": $scope.SearchClaimListObj.CurrentResponsibilityId || 0,
                    "ClaimTypeId": $scope.SearchClaimListObj.ClaimTypeId || 0,
                    "PayorObj": $scope.SearchClaimListObj.PayorObj || '',
                    "PayorId": $scope.SearchClaimListObj.PayorId || 0,
                    "PayorIds": PayorIds || "",
                };
                eHnoteMasterDataService.addClaimsAllUsers(Frezobj);
            }
            if (type == "SecondaryTransmission") {
                var checkLocationList = [];
                if ($scope.ClaimLocationList.length > 0) {
                    checkLocationList = _.where($scope.ClaimLocationList, { IsChecked: true });
                }
                var checkClaimStatus = [];
                if ($scope.ClaimStatusListDD.length > 0) {
                    checkClaimStatus = _.where($scope.ClaimStatusListDD, { IsChecked: true });
                }
                var Frezobj = {
                    "FromDate": $filter("date")(new Date($scope.SearchClaimListObj.FromDate), "MM-dd-yyyy") || '',
                    "ToDate": $filter("date")(new Date($scope.SearchClaimListObj.ToDate), "MM-dd-yyyy") || '',
                    "BillingProviderId": $scope.SearchClaimListObj.BillingProviderId || 0,
                    "RenderingProviderId": $scope.SearchClaimListObj.RenderingProviderId || 0,
                    "BillPaymentTypeId": $scope.SearchClaimListObj.BillPaymentTypeId || 0,
                    "checkLocationList": checkLocationList || [],
                    "TransmissionMethodId": $scope.SearchClaimListObj.TransmissionMethodId || 0,
                    "checkClaimStatus": checkClaimStatus || [],
                    "ClaimTypeId": $scope.SearchClaimListObj.ClaimTypeId || 0,
                    "PayorObj": $scope.SearchClaimListObj.PayorObj || '',
                    "PayorId": $scope.SearchClaimListObj.PayorId || 0,
                };
                eHnoteMasterDataService.addClaimsSecondaryTransmittedUsers(Frezobj);
            }
            if (type == "NotSubmitted") {
                if ($scope.ClaimLocationList.length > 0) {
                    var checkedNSLocationList = $scope.ClaimLocationList
                        .filter(pitem => pitem.IsChecked)
                        .map(pitem => pitem.ClinicId)
                        .join(",");
                }
                if ($scope.SearchClaimListObj.AllPayorList.length > 0) {
                    var PayorIds = $scope.SearchClaimListObj.AllPayorList
                        .map(pitem => pitem.PayorId)
                        .join(",");
                }

                var Frezobj1 = {
                    "FromDate": $filter("date")(new Date($scope.SearchClaimListObj.FromDate), "MM-dd-yyyy") || '',
                    "ToDate": $filter("date")(new Date($scope.SearchClaimListObj.ToDate), "MM-dd-yyyy") || '',
                    "BillingProviderId": $scope.SearchClaimListObj.BillingProviderId || 0,
                    "RenderingProviderId": $scope.SearchClaimListObj.RenderingProviderId || 0,
                    "checkedNSLocationList": checkedNSLocationList || '',
                    "TransmissionMethodId": $scope.SearchClaimListObj.TransmissionMethodId || 0,
                    "IsReadytosubmit": $scope.SearchClaimListObj.IsReadytosubmit || false,
                    "ClaimTypeId": $scope.SearchClaimListObj.ClaimTypeId || 0,
                    "PayorObj": $scope.SearchClaimListObj.PayorObj || '',
                    "PayorId": $scope.SearchClaimListObj.PayorId || 0,
                    "PayorIds": PayorIds || "",
                };
                eHnoteMasterDataService.addClaimsNotSubmittedUsersList(Frezobj1);
            }
            if (type == "Denial") {
                if ($scope.ClaimLocationList.length > 0) {
                    var checkedDenialLocationList = $scope.ClaimLocationList
                        .filter(pitem => pitem.IsChecked)
                        .map(pitem => pitem.ClinicId)
                        .join(",");
                }
                var Frezobj4 = {
                    "FromDate": $filter("date")(new Date($scope.SearchClaimListObj.FromDate), "MM-dd-yyyy") || '',
                    "ToDate": $filter("date")(new Date($scope.SearchClaimListObj.ToDate), "MM-dd-yyyy") || '',
                    "BillingProviderId": $scope.SearchClaimListObj.BillingProviderId || 0,
                    "ClaimTypeId": $scope.SearchClaimListObj.ClaimTypeId || 0,
                    "PayorObj": $scope.SearchClaimListObj.PayorObj || '',
                    "PayorId": $scope.SearchClaimListObj.PayorId || 0,
                    "RenderingProviderId": $scope.SearchClaimListObj.RenderingProviderId || 0,
                    "checkedDenialLocationList": checkedDenialLocationList || '',
                    "BillPaymentTypeId": $scope.SearchClaimListObj.BillPaymentTypeId || 0,
                    "DenialCodeId": $scope.SearchClaimListObj.DenialCodeId || 0,
                    "TransmissionMethodId": $scope.SearchClaimListObj.TransmissionMethodId || 0,
                    "CurrentResponsibilityId": $scope.SearchClaimListObj.CurrentResponsibilityId || 0,
                };
                eHnoteMasterDataService.addDenialUsersList(Frezobj4);
                if ($scope.DenialFollowupTab == 'Summury') {

                } else {
                    $scope.SearchDenailClaimDetails(1, 'Denial');
                }
            }


            if (type == 'PaperClaims') {
                $scope.SearchClaimListObj.TransmissionMethodId = 2;
                $scope.SearchClaimListObj.TransmissionMethod = "Paper";
                $scope.ClaimAckListactiveTab = 'acklist';
                type = 'All';

            }
            else if (type == 'PrivateClaims') {
                $scope.SearchClaimListObj.BillPaymentTypeId = 1;

            }
            var TempAddress = $filter("filter")($scope.ClaimLocationList, function (iterator, ind) { return iterator.ClinicId !== 0 && iterator.IsChecked; });
            var HospitalIDs = _.pluck(TempAddress, "BranchId").join(",");

            if ($scope.ClaimStatusListDD.length > 0) {
                var SelectedClaimIds = $scope.ClaimStatusListDD
                    .filter(pitem => pitem.IsChecked)
                    .map(pitem => pitem.ClaimStatusId)
                    .join(",");
                $scope.activeClaimTabStatusIds = SelectedClaimIds;
            }
            var IsClaimStatusId = false;
            if (SelectedClaimIds === "1") {
                IsClaimStatusId = true;
            }

            // If SelectedClaimIds is a single "1", IsClaimStatusId = true
            // If SelectedClaimIds contains multiple IDs like "1,2,3,...", IsClaimStatusId = false

            if (type == 'PrivateClaims') {
                /* type = 'All';*/

                if ($scope.PrivatePayClaimStatusList.length > 0) {
                    var SelectedClaimIds = $scope.PrivatePayClaimStatusList
                        .filter(pitem => pitem.IsChecked)
                        .map(pitem => pitem.ClaimStatusId)
                        .join(",");
                    $scope.activeClaimTabStatusIds = SelectedClaimIds;
                }
                IsClaimStatusId = false;

                var checkLocationList = [];
                if ($scope.ClaimLocationList.length > 0) {
                    checkLocationList = _.where($scope.ClaimLocationList, { IsChecked: true });
                }
                var checkClaimStatus = [];
                if ($scope.PrivatePayClaimStatusList.length > 0) {
                    checkClaimStatus = _.where($scope.PrivatePayClaimStatusList, { IsChecked: true });
                }
                var Frezobj = {
                    "FromDate": $filter("date")(new Date($scope.SearchClaimListObj.FromDate), "MM-dd-yyyy") || '',
                    "ToDate": $filter("date")(new Date($scope.SearchClaimListObj.ToDate), "MM-dd-yyyy") || '',
                    "BillingProviderId": $scope.SearchClaimListObj.BillingProviderId || 0,
                    "RenderingProviderId": $scope.SearchClaimListObj.RenderingProviderId || 0,
                    "BillPaymentTypeId": $scope.SearchClaimListObj.BillPaymentTypeId || 0,
                    "checkLocationList": checkLocationList || [],
                    "TransmissionMethodId": $scope.SearchClaimListObj.TransmissionMethodId || 0,
                    "checkClaimStatus": checkClaimStatus || [],
                    "CurrentResponsibilityId": $scope.SearchClaimListObj.CurrentResponsibilityId || 0,
                    "ClaimTypeId": $scope.SearchClaimListObj.ClaimTypeId || 0,
                    "PayorObj": $scope.SearchClaimListObj.PayorObj || '',
                    "PayorId": $scope.SearchClaimListObj.PayorId || 0,
                };
                eHnoteMasterDataService.addPrivatepayClaims(Frezobj);

            }

            if (type != "Denial") {
                if ($scope.SearchClaimListObj.AllPayorList.length > 0) {
                    var PayorIds = $scope.SearchClaimListObj.AllPayorList
                        .map(pitem => pitem.PayorId)
                        .join(",");
                }

                var params = {
                    "OrganizationId": $scope.SearchClaimListObj.OrganizationId,
                    "OrganizationFacilityId": $scope.SearchClaimListObj.OrganizationFacilityId || 0,
                    "FromDate": $filter('date')($scope.SearchClaimListObj.FromDate, 'MM-dd-yyyy') || "",
                    "ToDate": $filter('date')($scope.SearchClaimListObj.ToDate, 'MM-dd-yyyy') || "",
                    "PatientId": $scope.SearchClaimListObj.PatientId || 0,
                    "SearchText": $scope.SearchClaimListObj.SearchText || "",
                    "PatientMRNo": $scope.SearchClaimListObj.PatientMRNo || "",
                    "PatienClaimNumber": (type == "Claims") ? $scope.SearchClaimListObj.ClaimNumber : $scope.SearchClaimListObj.PatienClaimNumber || "",
                    "BatchNumber": $scope.SearchClaimListObj.BatchNumber || "",
                    "BillingProviderId": $scope.SearchClaimListObj.BillingProviderId || 0,
                    "RenderingProviderId": $scope.SearchClaimListObj.RenderingProviderId || 0,
                    "TransmissionTypeId": $scope.SearchClaimListObj.TransmissionMethodId || 0,
                    "ClaimTypeId": $scope.SearchClaimListObj.ClaimTypeId || 0,
                    "PayorId": $scope.SearchClaimListObj.PayorId || 0,
                    "PayorIds": PayorIds || "",
                    "ClaimStatusList": SelectedClaimIds || '',
                    "PageSize": $scope.SearchClaimListObj.PageSize,
                    "PageNumber": $scope.SearchClaimListObj.PageNumber,
                    "Type": type,
                    "BillPaymentTypeId": $scope.SearchClaimListObj.BillPaymentTypeId,
                    "CurrentResponsibilityId": $scope.SearchClaimListObj.CurrentResponsibilityId || 0,
                    "IsReadytosubmit": $scope.SearchClaimListObj.IsReadytosubmit || false,
                    "DenialId": $scope.SearchClaimListObj.DenialId || 0,
                    "FacilityListIds": '',
                    "Locationids": HospitalIDs,
                    "TransmissionFromDate": $scope.SearchClaimListObj.TransmissionFromDate,
                    "TransmissionToDate": $scope.SearchClaimListObj.TransmissionToDate,
                    "IsClaimStatusId": IsClaimStatusId,
                    "DateType": $scope.SearchClaimListObj.DateType,
                    "SortColumn": $scope.SearchClaimListObj.SortColumn,
                    "SortOrder": $scope.SearchClaimListObj.SortOrder
                };


                eHnotePatientDataService.GetOrganizationClaimsList(params).then(function (resp) {
                    console.log(resp);
                    $scope.OrgClaimListdata = [];
                    $scope.ClaimAcknowledgementReqlist = [];

                    $scope.ClaimListCount = resp.data.count;
                    $scope.TotalClaimBalance = resp.data.TotalBalance;
                    $scope.TotalClaimBilledAmount = resp.data.TotalBilledAmount;
                    $scope.TotalClaimInsuranceBalance = resp.data.TotalInsuranceBalance;
                    $scope.TotalClaimPatientBalance = resp.data.TotalPatientBalance;
                    $scope.checkedOrgClaimCount = 0;
                    resp.data.rows = resp.data.rows || [];
                    if (resp.data.rows.length > 0) {
                        $scope.OrgClaimListdata = resp.data.rows;
                        $scope.ClaimAcknowledgementReqlist = $filter("filter")($scope.OrgClaimListdata, function (item) {
                            return item.ClaimStatusId === 5 || item.ClaimStatusId === 6 ||
                                item.ClaimStatusId === 7 || item.ClaimStatusId === 10 ||
                                item.ClaimStatusId === 11 || item.ClaimStatusId === 12 ||
                                item.ClaimStatusId === 13 || item.ClaimStatusId === 14
                                || item.ClaimStatusId === 26 || item.ClaimStatusId === 27;
                        });
                        $scope.SearchClaimAcknowledgementReqObj.Count = $scope.ClaimAcknowledgementReqlist.length;
                        console.log($scope.SearchClaimAcknowledgementReqObj.Count);
                        console.log($scope.ClaimAcknowledgementReqlist);
                        var today = new Date();

                        angular.forEach($scope.OrgClaimListdata, function (claim, cindex) {
                            claim.IsSelectedClaim = false;
                            claim.AckId = claim.AckId || 0;
                            claim.TotalPatientPayment = claim.TotalPatientPayment || 0;

                            claim.AckNumber = claim.AckNumber || "";

                            //if (cindex===0) {
                            //    claim.AckNumber = "ACK20261220082620";
                            //    claim.AckId = 1;
                            //}

                            if (claim.ClaimFilingLimitDays > 0) {

                                if (claim.BillPaymentTypeId == 1 || claim.ClaimStatusId != 1) {
                                    claim.ClaimDueOnDays = 0;

                                }
                                else if (!claim.DOSFrom || isNaN(new Date(claim.DOSFrom).getTime())) {
                                    claim.ClaimDueOnDays = 0;

                                }
                                else {
                                    var dosDate = new Date(claim.DOSFrom);
                                    var expiryDate = new Date(dosDate);
                                    expiryDate.setDate(expiryDate.getDate() + claim.ClaimFilingLimitDays);

                                    var remainingDays = Math.ceil(
                                        (expiryDate - today) / (1000 * 60 * 60 * 24)
                                    );

                                    //if (remainingDays <= 0) {
                                    //    claim.ClaimDueOnDays = 0;

                                    //} else {
                                    //    claim.ClaimDueOnDays = remainingDays;

                                    //}
                                    claim.ClaimDueOnDays = remainingDays;
                                }
                            }

                            if (claim.AdjustmentFilingLimitDays > 0) {

                                // Only for DENIED claims
                                if (claim.BillPaymentTypeId == 1 || claim.ClaimStatusId !== 19) {
                                    claim.AdjustmentDueOnDays = 0;
                                    return;
                                }

                                if (!claim.DenialCheckDate || isNaN(new Date(claim.DenialCheckDate).getTime())) {
                                    claim.AdjustmentDueOnDays = 0;
                                    return;
                                }

                                var denialDate = new Date(claim.DenialCheckDate);
                                var expiryDate = new Date(denialDate);
                                expiryDate.setDate(expiryDate.getDate() + claim.AdjustmentFilingLimitDays);

                                var remainingDays = Math.ceil(
                                    (expiryDate - today) / (1000 * 60 * 60 * 24)
                                );

                                //claim.AdjustmentDueOnDays = remainingDays > 0 ? remainingDays : 0;
                                claim.AdjustmentDueOnDays = remainingDays;
                            }


                            claim.AppealSentText = null;

                            if (claim.DenialCheckDate && claim.AppealedDate &&
                                !isNaN(new Date(claim.DenialCheckDate).getTime()) &&
                                !isNaN(new Date(claim.AppealedDate).getTime())) {

                                var checkDate = new Date(claim.DenialCheckDate);
                                var appealedDate = new Date(claim.AppealedDate);

                                // Remove time part
                                checkDate = new Date(checkDate.getFullYear(), checkDate.getMonth(), checkDate.getDate());
                                appealedDate = new Date(appealedDate.getFullYear(), appealedDate.getMonth(), appealedDate.getDate());

                                var daysDifference = Math.floor(
                                    (appealedDate - checkDate) / (1000 * 60 * 60 * 24)
                                );

                                if (daysDifference >= 0) {
                                    claim.AppealSentText = "Appealed D+" + daysDifference;
                                }
                            }





                        });

                        $scope.filterObj.IsAllPaperClaimsChecked = false;

                        $scope.filterObj.IsAllAckEmpty = $scope.OrgClaimListdata.every(function (mitem) {
                            return mitem.AckId;
                        });

                        $scope.SearchClaimListObj.Count = resp.data.count || 0;
                        if (type == "Denial") {
                            $scope.OrgClaimListdata.forEach(function (claim) {
                                // Extract denial codes for the current claim
                                var denialCodes = claim.ClaimDenials
                                    .filter(function (denial) {
                                        return denial.PatientClaimId === claim.PatientClaimId;
                                    })
                                    .map(function (denial) {
                                        return denial.DenialCode;
                                    })
                                    .join(', '); // Join denial codes into a comma-separated string

                                // Append denial codes to the claim object
                                claim.DenialCodes = denialCodes; // Add as a new property
                            });
                        }
                        else if (type == "Queue") {
                            angular.forEach($scope.OrgClaimListdata, function (item) {
                                item.IsActive = false;
                            });
                        } else {

                        }

                    }
                    $scope.SearchClaimCountDetails(type, SelectedClaimIds, pageno);
                    $scope.ClaimSubtabActive = angular.copy($scope.ClaimSubtabs) || 1;
                    if ($scope.activeClaimTab == 'ALL') {
                        $scope.selectedClaimStatusIds = '';
                    }

                }, function (err) {

                });
            }
            if (type == "All" && action == 'Apply') {
                if ($scope.ClaimSubtabActive == 1) {
                    $scope.onClaimTabClick(null, 'All', '', action);
                }
            } else if (type == "Transmitted" && action == 'Apply') {
                if ($scope.ClaimSubtabActive == 3) {
                    $scope.onClaimTabClick(null, 'Transmitted', '', action);
                }
            }
            else if (type == "All") {
                $scope.onClaimTabClick(null, 'All', '', 'Apply');
            }
        }

        $scope.filterObj = {
            IsAllPaperClaimsChecked: false,
            IsAllAckEmpty:false
        };

        $scope.init = function (tab) {
            $scope.FacilityTypeObj = {
                "SelectStatusString": "All",
                "Name": "",
                "AllStatusCheck": true
            };
            /*      $scope.ClaimProviderList = [];*/
            $scope.ClaimPayorList = [];
            $scope.ClaimFormatList = [];
            $scope.MasterClaimStatusList = [];
            $scope.PriorityTypes = [];
            $scope.MasterAlertTypes = [];
            $scope.MasterAlertTag = [];
            $scope.OrganizationFacilityList = [];
            $scope.masterSettlementStatusList = [];
            $scope.ClaimDenialStatus = [];
            //$scope.IsAllPaperClaimsChecked = false;

            $scope.isIojOrgEnable = false;
            var currenturl = $location.absUrl().split('?')[0];
            var CurrentEnvironment = currenturl.split('/#')[0];
            if (CurrentEnvironment == "https://ioj.ehnote.com" || CurrentEnvironment == "https://insts.ehnote.com") {
                $scope.isIojOrgEnable = true;
            };

            let Req2 = {
                /*  "OrganizationId": $scope.MainObj.OrganizationId || 0,*/
                "ParentOrganizationId": $scope.ParentHospitalId,
                /*"HospitalIds": $scope.MainObj.HospitalIds || '',*/
                "FacilityCode": "",
                "PageNumber": 1,
                "PageSize": 200,
                /*"HospitalIds": $scope.MainObj.HospitalIds*/
            }
            let Req3 = {
                "SearchText": "",
                "PageSize": 20,
                "PageNumber": 1,
                "UserId": $scope.UserId,
                "SpecializationId": $scope.SpecializationId,
                "OrganizationId": $scope.HospitalId,
                "ParentOrganizationId": $scope.ParenthospitalId,
                "GetAllIndicator": 0,
                "PayorTypeId": 0
            }
            var params = {
                "OrganizationId": $scope.MainObj.HospitalIds,
                "FacilityName": ""
            };


            let visitreasonParams = {
                "OrganizationId": $scope.MainObj.HospitalIds,
                "ReasonTypeId": 1,
                "SearchText": "",
                "VisitTypeId": null
            };

            //var newreqObj = {
            //    'LocationId': null,
            //    'PageNumber': 1,
            //    'PageSize': 2000,
            //    'SearchTaxt': '',
            //    'SearchNPI': '',
            //    "SpecializationId": null,
            //    "RefaralTypeId": 2,
            //    "DeleteInd": 'N',
            //    "OrganizationId": $scope.HospitalId,
            //};

            $q.all([

                eHnoteSettingsDataService.GetAllMasterClaimsData($scope.HospitalId),
                /*eHnoteSettingsDataService.GetOrganizationBillingProviders(Req2),*/
               /* eHnoteInsuranceService.GetOrganizationPayorsList(Req3),*/
                eHnotePatientVisitReasonServices.GetOrganizationActiveAppointmentVisitReasonsById(visitreasonParams),
                /*eHnoteMainAdminServices.GetOrganizationFacilityDetails(params),*/
                // eHnoteReferalDataService.GetReferalPCPDoctors(newreqObj),


            ]).then(function (resp) {

                if (resp[0].data.status == "Success") {
                    resp[0].data.rows = resp[0].data.rows || [];
                    if (resp[0].data.BillPaymentByModes.length > 0) {
                        $scope.ClaimDataList = angular.copy(resp[0].data.BillPaymentByModes);
                        console.log($scope.ClaimDataList);
                    }

                    if (resp[0].data.TransmissionMethods.length !== 0) {
                        $scope.ClaimFormatList = resp[0].data.TransmissionMethods || [];
                        $scope.ClaimFormatList = $filter("filter")($scope.ClaimFormatList, function (item) {
                            return item.TransmissionMethodId === 1 || item.TransmissionMethodId === 2;
                        });
                    }
                    if (resp[0].data.ClaimDenialStatus.length !== 0) {
                        $scope.ClaimDenialStatus = angular.copy(resp[0].data.ClaimDenialStatus) || [];
                        if ($scope.ClaimDenialStatus.length > 0) {
                            let obj = {
                                DenialStatusId
                                    :
                                    0,
                                DenialStatusName
                                    :
                                    "All",
                                Description
                                    :
                                    "",

                            }
                            $scope.ClaimDenialStatus.unshift(obj);
                        }
                        //$scope.ClaimStatusListObj1.DenialStatusName = "Pending";

                    }

                    if (resp[0].data.ClaimStatus.length > 0) {
                        $scope.MasterClaimStatusList = angular.copy(resp[0].data.ClaimStatus);
                        $scope.ClaimStatusListDD = angular.copy(resp[0].data.ClaimStatus);

                        $scope.PrivatePayClaimStatusList = angular.copy(resp[0].data.ClaimStatus);

                        if ($scope.PrivatePayClaimStatusList.length > 0) {
                            $scope.PrivatePayClaimStatusList = $filter("filter")($scope.PrivatePayClaimStatusList, function (item) {
                                return item.ClaimStatusId === 1 || item.ClaimStatusId === 24;
                            });
                        }
                        $scope.PrivatePayClaimStatusList.forEach(function (item) {
                            item.IsChecked = true;
                        });

                        $scope.ClaimStatusListDD.forEach(function (item) {
                            item.IsChecked = true;
                        });
                        $scope.SearchClaimListObj.ClaimStatusList = $scope.MasterClaimStatusList.map(function (status) {
                            return status.ClaimStatusId;
                        }).join(',');
                        console.log($scope.SearchClaimListObj.ClaimStatusList);
                        $scope.defaultClaimStatusIds = [
                            3,   // Transmitted to Clearing House
                            16,  // ERA Processed as Primary
                            17,  // ERA Processed as Secondary
                            /*18,  // ERA Processed as Tertiary*/
                            19,  // ERA Denied
                            24   // Claim Closed
                        ];
                        $scope.mainClaimStatuses = $scope.MasterClaimStatusList.filter(s =>
                            $scope.defaultClaimStatusIds.includes(s.ClaimStatusId)
                        );
                        $scope.defaultAllClaimStatusIds = [
                            1,   // Not Submitted
                            3,   // Transmitted to Clearing House
                            16,  // ERA Processed as Primary
                            17,  // ERA Processed as Secondary
                            /* 18,  // ERA Processed as Tertiary*/
                            19,  // ERA Denied
                            24,   // Claim Closed
                            26, //Accepted by Clearing House
                            27, //Rejected by Clearing House
                            7 // Attachment Request by Clearing House

                        ];
                        $scope.mainAllClaimStatuses = $scope.MasterClaimStatusList.filter(s =>
                            $scope.defaultAllClaimStatusIds.includes(s.ClaimStatusId)
                        );
                        $scope.mainAllClaimStatuses = $scope.mainAllClaimStatuses || [];

                        //$scope.mainAllClaimStatuses.push({
                        //    ClaimStatusCode: '',
                        //    ClaimStatusFromId: 0,
                        //    ClaimStatusId: '5,6,7,10,11,12,13,14,26,27',
                        //    ClaimStatusName: 'Acknowledgement'
                        //});

                        $scope.AckClaimStatuses = angular.copy($scope.MasterClaimStatusList);
                        $scope.AckClaimStatuses = $scope.AckClaimStatuses.filter(function (item) {
                            return (item.ClaimStatusId == 5 || item.ClaimStatusId == 6 || item.ClaimStatusId == 11 ||
                                item.ClaimStatusId == 12 || item.ClaimStatusId == 13);
                        }).sort(function (a, b) {
                            return a.ClaimStatusOrderId - b.ClaimStatusOrderId;
                        });

                        $scope.otherClaimStatuses = angular.copy($scope.MasterClaimStatusList);
                        $scope.otherClaimStatuses = $scope.otherClaimStatuses.filter(function (s) {
                            return !$scope.defaultClaimStatusIds.includes(s.ClaimStatusId)
                                && s.ClaimStatusId !== 1
                                && s.ClaimStatusId !== 2 && s.ClaimStatusId !== 25 && s.ClaimStatusId !== 18 && s.ClaimStatusId != 5 && s.ClaimStatusId != 6 && s.ClaimStatusId != 7 &&
                                s.ClaimStatusId != 26 && s.ClaimStatusId != 27 && s.ClaimStatusId != 11 &&
                                s.ClaimStatusId != 12 && s.ClaimStatusId != 13;
                        });



                        var checkedAckArray = _.where($scope.AckClaimStatuses, { IsChecked: true });
                        $scope.AllAckCheckObj.AckAllChecked = checkedAckArray.length > 0 && $scope.AckClaimStatuses.length === checkedAckArray.length ? true : false;

                        if ($scope.AllAckCheckObj.AckAllChecked == true) {
                            $scope.selectedAckstatus = "All";
                        } else {
                            if (checkedAckArray.length === 1) {
                                $scope.selectedAckstatus = checkedAckArray[0].ClaimStatusName;
                            } else {
                                $scope.selectedAckstatus = "Selected";
                            }
                        }

                        var checkedArray = _.where($scope.otherClaimStatuses, { IsChecked: true });
                        $scope.AllOthersCheckObj.otherAllChecked = checkedArray.length > 0 && $scope.otherClaimStatuses.length === checkedArray.length ? true : false;

                        if ($scope.AllOthersCheckObj.otherAllChecked == true) {
                            $scope.selectedstatus = "All";
                        } else {
                            if (checkedArray.length === 1) {
                                $scope.selectedstatus = checkedArray[0].ClaimStatusName;
                            } else {
                                $scope.selectedstatus = "Selected";
                            }
                        }
                    }
                    if (resp[0].data.CurrentResponsibilities.length > 0) {
                        $scope.CurrentResponsibilityList = resp[0].data.CurrentResponsibilities || [];
                    }
                    if (resp[0].data.DenialCodes.length > 0) {
                        $scope.DenialCodesList = resp[0].data.DenialCodes || [];
                    }
                    if (resp[0].data.MasterPriority.length > 0) {
                        $scope.MasterPriority = resp[0].data.MasterPriority || [];
                    }
                    if (resp[0].data.MasterAlertTypes.length > 0) {
                        $scope.MasterAlertTypes = resp[0].data.MasterAlertTypes || [];
                        angular.forEach($scope.MasterAlertTypes, function (item) {
                            item.IsChecked = false;
                        });

                    }
                    if (resp[0].data.MasterAlertTag.length > 0) {
                        $scope.MasterAlertTag = resp[0].data.MasterAlertTag || [];
                    }
                    if (resp[0].data.MasterAlertNoteType.length > 0) {
                        /*  $scope.MasterAlertNoteType = resp[0].data.MasterAlertNoteType || [];*/

                        $scope.MasterAlertNoteType = $filter("filter")(resp[0].data.MasterAlertNoteType, function (item) {
                            return item.AlertNoteTypeId !== 6;
                        }) || [];

                    }

                    if (resp[0].data.SettlementStatus.length > 0) {
                        angular.forEach(resp[0].data.SettlementStatus, function (item) {
                            if (item.SettlementStatusId == 2 || item.SettlementStatusId == 3) {
                                $scope.masterSettlementStatusList.push(item);
                            }
                        })
                    }
                }
                console.log(resp);
                //if (resp[1].data.Status == "Success") {
                //    resp[1].data.rows = resp[1].data.rows || [];
                //    if (resp[1].data.rows.length > 0) {
                //        $scope.ClaimProviderList = angular.copy(resp[1].data.rows);

                //        console.log($scope.ClaimProviderList);
                //    }
                //}

                //if (resp[1].data.Status == "Success") {
                //    resp[1].data.rows = resp[1].data.rows || [];
                //    if (resp[1].data.rows.length > 0) {
                //        $scope.ClaimPayorList = angular.copy(resp[1].data.rows);
                //    }
                //}


                if (resp[1].data.status === "Success") {
                    $scope.AllVisitReasons = angular.copy(resp[1].data.rows) || [];
                    if ($scope.AllVisitReasons.length > 0) {
                        $scope.AllVisitReasons = $filter("filter")($scope.AllVisitReasons, function (item) {
                            return item.ActiveIND === 'Y';
                        });
                        angular.forEach($scope.AllVisitReasons, function (item) {
                            item.isChecked = true;
                        });
                    }
                }

                //if (resp[3].data.status == "Success") {
                //    resp[3].data.rows = resp[3].data.rows || [];
                //    if (resp[3].data.rows.length > 0) {
                //        $scope.OrganizationFacilityList = angular.copy(resp[3].data.rows) || [];

                //        angular.forEach($scope.OrganizationFacilityList, function (kitem) {
                //            kitem.IsChecked = true;
                //        });
                //        $scope.FacilityTypeObj.AllStatusCheck = true;
                //        $scope.FacilityTypeObj.SelectStatusString = 'All';
                //    }
                //}
                //  $scope.GetAllClaimStatusList()

                //if (resp[3].data.status == "Success") {
                //    $scope.PCPReferalArray = [];
                //    if (resp[3].data.PcpRefdetails.length > 0) {
                //        $scope.PCPReferalArray = resp[3].data.PcpRefdetails || []
                //        $scope.ReferalPrimaryArray = resp[3].data.Primaryuserdetails || [];
                //    }
                //}

                if (tab != undefined) {
                    $scope.SwitchClaimSubTab(tab);
                }

                $scope.selectedClaimUsers = eHnoteMasterDataService.getClaimsAllUsers();
                if ($scope.selectedClaimUsers != '') {
                    $scope.SearchClaimListObj.FromDate = $scope.selectedClaimUsers.FromDate || null;
                    $scope.SearchClaimListObj.ToDate = $scope.selectedClaimUsers.ToDate || null;
                    $scope.SearchClaimListObj.BillingProviderId = $scope.selectedClaimUsers.BillingProviderId || 0;
                    $scope.SearchClaimListObj.RenderingProviderId = $scope.selectedClaimUsers.RenderingProviderId || 0;
                    $scope.SearchClaimListObj.BillPaymentTypeId = $scope.selectedClaimUsers.BillPaymentTypeId || 0;
                    $scope.SearchClaimListObj.TransmissionMethodId = $scope.selectedClaimUsers.TransmissionMethodId || 0;
                    $scope.SearchClaimListObj.CurrentResponsibilityId = $scope.selectedClaimUsers.CurrentResponsibilityId || 0;
                    $scope.SearchClaimListObj.ClaimTypeId = $scope.selectedClaimUsers.ClaimTypeId || 0;
                    $scope.SearchClaimListObj.PayorObj = $scope.selectedClaimUsers.PayorObj || '';
                    $scope.SearchClaimListObj.PayorId = $scope.selectedClaimUsers.PayorId;

                    //if ($scope.SearchClaimListObj.RenderingProviderId != 0) {
                    //    var TemaProviderlist = $filter("filter")($scope.mainBillerDataObj.AllDoctorsList, { "DoctorID": $scope.SearchClaimListObj.RenderingProviderId }, true) || [];
                    //    if (TemaProviderlist.length > 0) {
                    //        $scope.SearchClaimListObj.RenderingProviderName = TemaProviderlist[0].FullName || '';
                    //    }
                    //}
                    if ($scope.mainBillerDataObj.AllDoctorsList.length > 0) {
                        angular.forEach($scope.mainBillerDataObj.AllDoctorsList, function (item) {
                            item.IsChecked = false;
                        });

                        if ($scope.SearchClaimListObj.RenderingProviderId) {
                            var selectedIds = $scope.SearchClaimListObj.RenderingProviderId.toString().split(',');
                            $scope.mainBillerDataObj.AllDoctorsList.forEach(function (item) {
                                item.IsChecked = selectedIds.includes(item.DoctorID.toString());
                            });

                        } else {
                            $scope.mainBillerDataObj.AllDoctorsList.forEach(item => item.IsChecked = true);
                        }
                        $scope.changeDoctors();
                    }


                    if ($scope.ClaimDataList.length > 0) {
                        var ids = ($scope.SearchClaimListObj.BillPaymentTypeId || '').toString().split(',');

                        $scope.ClaimDataList.forEach(item => {
                            item.IsChecked = ids[0] ? ids.includes(item.BillPaymentTypeId.toString()) : true;
                        });

                        $scope.claimRespToggle();
                    }


                    if ($scope.ClaimFormatList.length > 0) {
                        var ids = ($scope.SearchClaimListObj.TransmissionMethodId || '').toString().split(',');

                        $scope.ClaimFormatList.forEach(item => {
                            item.IsChecked = ids[0] ? ids.includes(item.TransmissionMethodId.toString()) : true;
                        });

                        $scope.claimFormatToggle();
                    }
                    if ($scope.ClaimLocationList.length > 0 && $scope.selectedClaimUsers.checkLocationList.length > 0) {
                        angular.forEach($scope.ClaimLocationList, function (Aitem) {
                            Aitem.IsChecked = false;
                        });
                        angular.forEach($scope.selectedClaimUsers.checkLocationList, function (Aitem) {
                            angular.forEach($scope.ClaimLocationList, function (Bitem) {
                                if (Aitem.ClinicId == Bitem.ClinicId) {
                                    Bitem.IsChecked = true;
                                }
                            });
                        });
                    }

                    if ($scope.ClaimStatusListDD.length > 0 && $scope.selectedClaimUsers.checkClaimStatus.length > 0) {
                        angular.forEach($scope.ClaimStatusListDD, function (Aitem) {
                            Aitem.IsChecked = false;
                        });
                        angular.forEach($scope.ClaimStatusListDD, function (Aitem) {
                            angular.forEach($scope.selectedClaimUsers.checkClaimStatus, function (Bitem) {
                                if (Aitem.ClaimStatusId == Bitem.ClaimStatusId) {
                                    Aitem.IsChecked = true;
                                }
                            });
                        });
                    }
                } else {
                    $scope.SearchClaimListObj = {
                        FromDate: moment().format("MM-DD-YYYY"),
                        ToDate: moment().format("MM-DD-YYYY"),
                        BillingProviderId: 0,
                        RenderingProviderId: 0,
                        BillPaymentTypeId: 0,
                        TransmissionMethodId: 0,
                        CurrentResponsibilityId: 0,
                    }
                }


                $scope.SearchAllClaimDetails(1, "All");

            }, function (err) {
                console.log(err);
                alertify.error("Getting Data Failed");
            });

        }
        $scope.init();


        $scope.ChangeApptBranch = function (item, tab) {
            $scope.GetAllIndicatorForFacility = 0;
            if (item.ClinicId == 0) {
                $scope.GetAllIndicatorForFacility = 1;
                if (item.IsChecked) {
                    angular.forEach($scope.ClaimLocationList, function (item) {
                        item.IsChecked = true;
                    });
                } else {
                    angular.forEach($scope.ClaimLocationList, function (item) {
                        item.IsChecked = false;
                    });
                }
            } else {
                var TempCheckArray = $filter("filter")($scope.ClaimLocationList, function (item) { return item.ClinicId !== 0; }) || [];
                var TempCheckArray1 = $filter("filter")($scope.ClaimLocationList, function (item) { return item.ClinicId !== 0 && item.IsChecked; }) || [];
                var AllLocationIND = TempCheckArray1.length > 0 && TempCheckArray.length === TempCheckArray1.length ? true : false;
                if (AllLocationIND) {
                    $scope.ClaimLocationList[0].IsChecked = true;
                } else {
                    $scope.ClaimLocationList[0].IsChecked = false;
                }
            }

            $scope.MainObj.OrganizationId = item.ClinicId || '';
            $scope.HospitalObj = item || {};

            var HospitalId = 0;
            if ($scope.GetAllIndicatorForFacility == 0) {
                item.ClinicId = item.ClinicId || 0;
                HospitalId = item.ClinicId;
            } else {

                var TempAddressArray = $filter("filter")($scope.ClaimLocationList, function (item, index) { return item.ClinicId !== 0; }) || [];
                var HospitalId = "";
                for (var i in TempAddressArray) {
                    if (TempAddressArray[i].ClinicId) {
                        HospitalId += "," + TempAddressArray[i].ClinicId;
                    }
                }
                if (HospitalId.charAt(0) === ",") {
                    HospitalId = HospitalId.slice(1);
                }
            }
            $scope.MainObj.HospitalIds = HospitalId || '';



            //$scope.init(tab);
        }



        //$scope.ClaimStatusList = [];

        //$scope.GetAllClaimStatusList = function () {
        //    eHnoteInsuranceService.GetAllClaimStatusList().then(function (resp) {
        //        $scope.ClaimStatusList = resp.data.rows || [];
        //        $scope.ClaimStatusListDD = angular.copy($scope.ClaimStatusList);
        //        // Add isChecked property to each item in ClaimStatusListDD
        //        $scope.ClaimStatusListDD.forEach(function (item) {
        //            item.IsChecked = true;
        //        });
        //    }, function (err) {
        //        console.log(err);
        //        alertify.error("Getting ClaimStatus Failed");
        //    });
        //}


        $scope.DenailClaimStatusListObj1 = {
            "DenialStatusName": "Pending",
            "DenialStatusId": 2,
            "adjWindow": null,
        };

        $scope.ClaimStatusListObj1 = {
            "SelectStatusString": "All",
            "ClaimStatusName": "",
            "AllStatusCheck": true
        };
        $scope.checkAllClaimStatus1 = function (val) {
            if (val) {
                angular.forEach($scope.ClaimStatusListDD, function (item) {
                    item.IsChecked = true;
                });

                $scope.ClaimStatusListObj1.SelectStatusString = 'All';
            }
            else {
                angular.forEach($scope.ClaimStatusListDD, function (item) {
                    item.IsChecked = false;
                });

                $scope.ClaimStatusListObj1.SelectStatusString = 'Selected';
            }
            $scope.ClaimStatusToggle1();
        };

        $scope.PrivateClaimStatusListObj = {
            "SelectStatusString": "All",
            "ClaimStatusName": "",
            "AllStatusCheck": true
        };

        $scope.checkPrivatePayClaimStatus = function (val) {
            if (val) {
                angular.forEach($scope.PrivatePayClaimStatusList, function (item) {
                    item.IsChecked = true;
                });

                $scope.PrivateClaimStatusListObj.SelectStatusString = 'All';
            }
            else {
                angular.forEach($scope.PrivatePayClaimStatusList, function (item) {
                    item.IsChecked = false;
                });

                $scope.PrivateClaimStatusListObj.SelectStatusString = 'Selected';
            }
            $scope.PrivateClaimStatusToggle();
        };

        $scope.stopClosingDropDown = function (event) {
            event.stopPropagation();
        }
        $scope.ClaimStatusToggle1 = function (obj) {
            var checkedArray = _.where($scope.ClaimStatusListDD, { IsChecked: true });
            $scope.ClaimStatusListObj1.AllStatusCheck = checkedArray.length > 0 && $scope.ClaimStatusListDD.length === checkedArray.length ? true : false;
            if ($scope.ClaimStatusListObj1.AllStatusCheck) {
                $scope.ClaimStatusListObj1.SelectStatusString = 'All';
                $scope.SearchClaimListObj.ClaimStatusList = checkedArray.map(function (status) {
                    return status.ClaimStatusId;
                }).join(',');
            }

            if (!$scope.ClaimStatusListObj1.AllStatusCheck && checkedArray.length > 0) {
                $scope.ClaimStatusListObj1.SelectStatusString = 'Selected';
                $scope.SearchClaimListObj.ClaimStatusList = checkedArray.map(function (status) {
                    return status.ClaimStatusId;
                }).join(',');
                console.log($scope.SearchClaimListObj.ClaimStatusList);
            }
            if (!$scope.ClaimStatusListObj1.AllStatusCheck && checkedArray.length === 0) {
                $scope.ClaimStatusListObj1.SelectStatusString = 'Select';
                $scope.SearchClaimListObj.ClaimStatusList = checkedArray.map(function (status) {
                    return status.ClaimStatusId;
                }).join(',');
                console.log($scope.SearchClaimListObj.ClaimStatusList);
            }
        };

        $scope.PrivateClaimStatusToggle = function (obj) {
            var checkedArray = _.where($scope.PrivatePayClaimStatusList, { IsChecked: true });
            $scope.PrivateClaimStatusListObj.AllStatusCheck = checkedArray.length > 0 && $scope.PrivatePayClaimStatusList.length === checkedArray.length ? true : false;
            if ($scope.PrivateClaimStatusListObj.AllStatusCheck) {
                $scope.PrivateClaimStatusListObj.SelectStatusString = 'All';
                $scope.SearchClaimListObj.ClaimStatusList = checkedArray.map(function (status) {
                    return status.ClaimStatusId;
                }).join(',');
            }

            if (!$scope.PrivateClaimStatusListObj.AllStatusCheck && checkedArray.length > 0) {
                $scope.PrivateClaimStatusListObj.SelectStatusString = 'Selected';
                $scope.SearchClaimListObj.ClaimStatusList = checkedArray.map(function (status) {
                    return status.ClaimStatusId;
                }).join(',');
                console.log($scope.SearchClaimListObj.ClaimStatusList);
            }
            if (!$scope.PrivateClaimStatusListObj.AllStatusCheck && checkedArray.length === 0) {
                $scope.PrivateClaimStatusListObj.SelectStatusString = 'Select';
                $scope.SearchClaimListObj.ClaimStatusList = checkedArray.map(function (status) {
                    return status.ClaimStatusId;
                }).join(',');
                console.log($scope.SearchClaimListObj.ClaimStatusList);
            }
        };

        $scope.ClaimSubTab = 1;
        $scope.SwitchClaimSubTab = function (tabchange) {

            $scope.ClaimSubTab = tabchange;

            if ($scope.ClaimSubTab == 1) {
                $scope.ClaimStatusListDD.forEach(function (item) {
                    item.IsChecked = true;
                });
                $scope.SearchClaimListObj.ClaimStatusList = $scope.MasterClaimStatusList.map(function (status) {
                    return status.ClaimStatusId;
                }).join(',');
            }
            else if ($scope.ClaimSubTab == 2) {
                $scope.ClaimStatusListDD.forEach(function (item) {
                    if (item.ClaimStatusId === 1) {
                        item.IsChecked = true;
                    }
                    else {
                        item.IsChecked = false;
                    }


                });
                $scope.SearchClaimListObj.ClaimStatusList = $scope.MasterClaimStatusList
                    .filter(function (status) {
                        return [1].includes(status.ClaimStatusId);
                    })
                    .map(function (status) {
                        return status.ClaimStatusId;
                    }).join(',');
            } else if ($scope.ClaimSubTab == 9) {
                $scope.ClaimStatusListDD.forEach(function (item) {
                    if (item.ClaimStatusId === 2) {
                        item.IsChecked = true;
                    }
                    else {
                        item.IsChecked = false;
                    }


                });
                $scope.SearchClaimListObj.ClaimStatusList = $scope.MasterClaimStatusList
                    .filter(function (status) {
                        return [2].includes(status.ClaimStatusId);
                    })
                    .map(function (status) {
                        return status.ClaimStatusId;
                    })
                    .join(',');
            } else if ($scope.ClaimSubTab == 3) {

                var filteredList = $filter("filter")($scope.ClaimStatusListDD, function (item) {
                    return item.ClaimStatusId !== 1 && item.ClaimStatusId !== 2 && item.ClaimStatusId !== 25;
                });
                $scope.ClaimStatusListDD = angular.copy(filteredList);


                $scope.SearchClaimListObj.ClaimStatusList = $scope.MasterClaimStatusList
                    .filter(function (status) {
                        return [3, 10, 16, 17, 18, 19, 20].includes(status.ClaimStatusId);
                    })
                    .map(function (status) {
                        return status.ClaimStatusId;
                    })
                    .join(',');
            }
            else if ($scope.ClaimSubTab == 4) {

                var filteredList = $filter("filter")($scope.ClaimStatusListDD, function (item) {
                    return item.ClaimStatusId === 13 || item.ClaimStatusId === 19;
                });
                $scope.ClaimStatusListDD = angular.copy(filteredList);

                $scope.SearchClaimListObj.ClaimStatusList = $scope.MasterClaimStatusList
                    .filter(function (status) {

                        return [13, 19].includes(status.ClaimStatusId);
                    })
                    .map(function (status) {
                        return status.ClaimStatusId;
                    }).join(',');
            } else if ($scope.ClaimSubTab == 5) {
                var filteredList = $filter("filter")($scope.ClaimStatusListDD, function (item) {
                    return item.ClaimStatusId == 12 || item.ClaimStatusId == 27;
                });
                $scope.ClaimStatusListDD = angular.copy(filteredList);
                $scope.SearchClaimListObj.ClaimStatusList = $scope.MasterClaimStatusList
                    .filter(function (status) {

                        return [12, 27].includes(status.ClaimStatusId);
                    })
                    .map(function (status) {
                        return status.ClaimStatusId;
                    }).join(',');
            } else if ($scope.ClaimSubTab == 6) {
                $scope.SearchClaimListObj.ClaimStatusList = $scope.MasterClaimStatusList
                    .filter(function (status) {

                        return [5, 6, 7, 12, 13, 20, 21].includes(status.ClaimStatusId);
                    })
                    .map(function (status) {
                        return status.ClaimStatusId;
                    })
                    .join(',');
            }
            else if ($scope.ClaimSubTab == 7) {
                $scope.SearchClaimListObj.ClaimStatusList = $scope.MasterClaimStatusList
                    .filter(function (status) {

                        return [4, 10].includes(status.ClaimStatusId);
                    })
                    .map(function (status) {
                        return status.ClaimStatusId;
                    })
                    .join(',');
            }
            $scope.ClaimStatusToggle1();
            $scope.PrivateClaimStatusToggle();
        };


        $scope.ChangeSendVia = function (item) {
            item.SendViaObj = item.SendViaObj || "";
            item.ClaimSendViaId = 0;
            if (item.SendViaObj != "") {
                item.ClaimSendViaId = item.SendViaObj.DropdownId;
            }
        };
        $scope.ChangePayor = function (obj, mainitem) {
            if (obj != null) {
                mainitem.PayorId = obj.PayorId;
            } else {
                mainitem.PayorId = "";
            }
        }
        $scope.ChangeClaimWiseSearch = function (type) {
            $scope.claimwiseSearchType = type;
            $scope.SearchClaimListObj.Patient = "";
            $scope.claimwiseList = [];
        };



        $scope.selectedClaimwise = function (patientitem) {
            $scope.claimwiseList = [];

            if ($scope.claimwiseSearchType === 1) {
                $scope.SearchClaimListObj.Patient = patientitem.fullname;
            }
            if ($scope.claimwiseSearchType === 2) {
                $scope.SearchClaimListObj.Patient = patientitem.MobileNo;
            }
        };


        $scope.refreshAllClaimDetails = function (tab, type, action) {
            var action = action || '';

            $scope.MainObj = {
                "OrganizationId": $scope.HospitalId,
                "HospitalIds": $scope.MainObj.HospitalIds,
                "FacilityListIds": "",
            }
            $scope.ShowPatientListDrop = false;
            $scope.SearchClaimListObj = angular.copy($scope.GetClaimListObj());
            $scope.ClaimStatusListDD = angular.copy($scope.MasterClaimStatusList);

            // Doctors
            angular.forEach($scope.mainBillerDataObj.AllDoctorsList, function (item) {
                item.IsChecked = true;
            });
            $scope.SearchClaimListObj.AllDoctorsCheck = true;
            $scope.SearchClaimListObj.AllDoctorsString = 'All';
            $scope.ClaimPayorListObj.SelectPayorString = 'All';
            $scope.changeDoctors();


            // Claim Responsibility
            angular.forEach($scope.ClaimDataList, function (item) {
                item.IsChecked = true;
            });
            $scope.ClaimRespListObj = { AllRespCheck: true, SelectRespString: 'All' };
            $scope.claimRespToggle();


            // Transmission (Format)
            angular.forEach($scope.ClaimFormatList, function (item) {
                item.IsChecked = true;
            });
            $scope.ClaimFormatListObj = { AllFormatCheck: true, SelectFormatString: 'All' };
            $scope.claimFormatToggle();

            $scope.ClaimStatusListDD.forEach(function (item) {
                item.IsChecked = true;
            });

            if ($scope.ClaimLocationList.length > 0) {
                angular.forEach($scope.ClaimLocationList, function (item) {
                    item.IsChecked = true;
                    //if (item.ClinicId == $scope.HospitalId) {
                    //    item.IsChecked = true;
                    //}
                });
            }
            /*$scope.HospitalObj.ClinicName = $scope.HospitalData[0].ClinicName;*/

            /*$scope.ChangeApptBranch($scope.HospitalData[0], tab);*/


            $scope.AllOthersCheckObj.otherAllChecked = false;
            $scope.otherClaimStatuses = $scope.otherClaimStatuses || [];
            if ($scope.otherClaimStatuses.length > 0) {
                angular.forEach($scope.otherClaimStatuses, function (item) {
                    item.IsChecked = false;
                });
            }

            if (type == "All") {
                var checkLocationList = [];
                if ($scope.ClaimLocationList.length > 0) {
                    checkLocationList = _.where($scope.ClaimLocationList, { IsChecked: true });
                }
                var checkClaimStatus = [];
                if ($scope.ClaimStatusListDD.length > 0) {
                    checkClaimStatus = _.where($scope.ClaimStatusListDD, { IsChecked: true });
                }
                if ($scope.SearchClaimListObj.AllPayorList.length > 0) {
                    var PayorIds = $scope.SearchClaimListObj.AllPayorList
                        .map(pitem => pitem.PayorId)
                        .join(",");
                }
                var Frezobj = {
                    "FromDate": $filter("date")(new Date($scope.SearchClaimListObj.FromDate), "MM-dd-yyyy") || '',
                    "ToDate": $filter("date")(new Date($scope.SearchClaimListObj.ToDate), "MM-dd-yyyy") || '',
                    "BillingProviderId": $scope.SearchClaimListObj.BillingProviderId || 0,
                    "RenderingProviderId": $scope.SearchClaimListObj.RenderingProviderId || 0,
                    "BillPaymentTypeId": $scope.SearchClaimListObj.BillPaymentTypeId || 0,
                    "TransmissionMethodId": $scope.SearchClaimListObj.TransmissionMethodId || 0,
                    "CurrentResponsibilityId": $scope.SearchClaimListObj.CurrentResponsibilityId || 0,
                    "ClaimTypeId": $scope.SearchClaimListObj.ClaimTypeId || 0,
                    "PayorObj": $scope.SearchClaimListObj.PayorObj || '',
                    "PayorId": $scope.SearchClaimListObj.PayorId || 0,
                    "PayorIds": PayorIds || "",
                    "checkLocationList": checkLocationList || [],
                    "checkClaimStatus": checkClaimStatus || [],
                };
                eHnoteMasterDataService.addClaimsAllUsers(Frezobj);

                if (type == "All" && action == 'Apply') {
                    if ($scope.ClaimSubtabActive == 1) {
                        $scope.onClaimTabClick(null, 'All', '', action);
                    }
                }

            }
            if (type == 'SecondaryTransmission') {
                var checkLocationList = [];
                if ($scope.ClaimLocationList.length > 0) {
                    checkLocationList = _.where($scope.ClaimLocationList, { IsChecked: true });
                }
                var checkClaimStatus = [];
                if ($scope.ClaimStatusListDD.length > 0) {
                    checkClaimStatus = _.where($scope.ClaimStatusListDD, { IsChecked: true });
                }
                var Frezobj = {
                    "FromDate": $filter("date")(new Date($scope.SearchClaimListObj.FromDate), "MM-dd-yyyy") || '',
                    "ToDate": $filter("date")(new Date($scope.SearchClaimListObj.ToDate), "MM-dd-yyyy") || '',
                    "BillingProviderId": $scope.SearchClaimListObj.BillingProviderId || 0,
                    "RenderingProviderId": $scope.SearchClaimListObj.RenderingProviderId || 0,
                    "BillPaymentTypeId": $scope.SearchClaimListObj.BillPaymentTypeId || 0,
                    "checkLocationList": checkLocationList || [],
                    "TransmissionMethodId": $scope.SearchClaimListObj.TransmissionMethodId || 0,
                    "checkClaimStatus": checkClaimStatus || [],
                    "ClaimTypeId": $scope.SearchClaimListObj.ClaimTypeId || 0,
                    "PayorObj": $scope.SearchClaimListObj.PayorObj || '',
                    "PayorId": $scope.SearchClaimListObj.PayorId || 0,
                };
                eHnoteMasterDataService.addClaimsSecondaryTransmittedUsers(Frezobj);
                $scope.SearchClaimListObj.CurrentResponsibilityId = 3;
            }
            if (type == "NotSubmitted") {
                if ($scope.ClaimLocationList.length > 0) {
                    var checkedNSLocationList = $scope.ClaimLocationList
                        .filter(pitem => pitem.IsChecked)
                        .map(pitem => pitem.ClinicId)
                        .join(",");
                }

                var Frezobj1 = {
                    "FromDate": $filter("date")(new Date($scope.SearchClaimListObj.FromDate), "MM-dd-yyyy") || '',
                    "ToDate": $filter("date")(new Date($scope.SearchClaimListObj.ToDate), "MM-dd-yyyy") || '',
                    "BillingProviderId": $scope.SearchClaimListObj.BillingProviderId || 0,
                    "RenderingProviderId": $scope.SearchClaimListObj.RenderingProviderId || 0,
                    "checkedNSLocationList": checkedNSLocationList || '',
                    "TransmissionMethodId": $scope.SearchClaimListObj.TransmissionMethodId || 0,
                    "IsReadytosubmit": $scope.SearchClaimListObj.IsReadytosubmit || false,
                    "ClaimTypeId": $scope.SearchClaimListObj.ClaimTypeId || 0,
                    "PayorObj": $scope.SearchClaimListObj.PayorObj || '',
                    "PayorId": $scope.SearchClaimListObj.PayorId || 0,
                };
                eHnoteMasterDataService.addClaimsNotSubmittedUsersList(Frezobj1);
            }
            if (type == "Queue") {
                if ($scope.ClaimLocationList.length > 0) {
                    var checkedQueueLocationList = $scope.ClaimLocationList
                        .filter(pitem => pitem.IsChecked)
                        .map(pitem => pitem.ClinicId)
                        .join(",");
                }
                var Frezobj3 = {
                    "FromDate": $filter("date")(new Date($scope.SearchClaimListObj.FromDate), "MM-dd-yyyy") || '',
                    "ToDate": $filter("date")(new Date($scope.SearchClaimListObj.ToDate), "MM-dd-yyyy") || '',
                    "BillingProviderId": $scope.SearchClaimListObj.BillingProviderId || 0,
                    "ClaimTypeId": $scope.SearchClaimListObj.ClaimTypeId || 0,
                    "PayorObj": $scope.SearchClaimListObj.PayorObj || '',
                    "PayorId": $scope.SearchClaimListObj.PayorId || 0,
                    "RenderingProviderId": $scope.SearchClaimListObj.RenderingProviderId || 0,
                    "checkedQueueLocationList": checkedQueueLocationList || '',
                    "TransmissionMethodId": $scope.SearchClaimListObj.TransmissionMethodId || 0,

                };
                eHnoteMasterDataService.addQueueUsersList(Frezobj3);
            }
            if (type == "Transmitted") {
                if ($scope.ClaimLocationList.length > 0) {
                    var checkedTransmittedLocationList = $scope.ClaimLocationList
                        .filter(pitem => pitem.IsChecked)
                        .map(pitem => pitem.ClinicId)
                        .join(",");
                }
                if ($scope.ClaimStatusListDD.length > 0) {
                    var checkedTransmittedClaimStatusList = $scope.ClaimStatusListDD
                        .filter(pitem => pitem.IsChecked)
                        .map(pitem => pitem.ClaimStatusId)
                        .join(",");
                }

                var Frezobj2 = {
                    "FromDate": $filter("date")(new Date($scope.SearchClaimListObj.FromDate), "MM-dd-yyyy") || '',
                    "ToDate": $filter("date")(new Date($scope.SearchClaimListObj.ToDate), "MM-dd-yyyy") || '',
                    "BillingProviderId": $scope.SearchClaimListObj.BillingProviderId || 0,
                    "RenderingProviderId": $scope.SearchClaimListObj.RenderingProviderId || 0,
                    "BillPaymentTypeId": $scope.SearchClaimListObj.BillPaymentTypeId || 0,
                    "checkedTransmittedLocationList": checkedTransmittedLocationList || '',
                    "TransmissionMethodId": $scope.SearchClaimListObj.TransmissionMethodId || 0,
                    "checkedTransmittedClaimStatusList": checkedTransmittedClaimStatusList || '',
                    "CurrentResponsibilityId": $scope.SearchClaimListObj.CurrentResponsibilityId || 0,
                    "ClaimTypeId": $scope.SearchClaimListObj.ClaimTypeId || 0,
                    "PayorObj": $scope.SearchClaimListObj.PayorObj || '',
                    "PayorId": $scope.SearchClaimListObj.PayorId || 0,
                };
                eHnoteMasterDataService.addClaimsTransmittedUsersList(Frezobj2);

                if (type == "Transmitted" && action == 'Apply') {
                    if ($scope.ClaimSubtabActive == 3) {
                        $scope.onClaimTabClick(null, 'Transmitted', '', action);
                    }
                }

            }
            if (type == "Denial") {
                if ($scope.ClaimLocationList.length > 0) {
                    var checkedDenialLocationList = $scope.ClaimLocationList
                        .filter(pitem => pitem.IsChecked)
                        .map(pitem => pitem.ClinicId)
                        .join(",");
                }
                var Frezobj4 = {
                    "FromDate": $filter("date")(new Date($scope.SearchClaimListObj.FromDate), "MM-dd-yyyy") || '',
                    "ToDate": $filter("date")(new Date($scope.SearchClaimListObj.ToDate), "MM-dd-yyyy") || '',
                    "BillingProviderId": $scope.SearchClaimListObj.BillingProviderId || 0,
                    "ClaimTypeId": $scope.SearchClaimListObj.ClaimTypeId || 0,
                    "PayorObj": $scope.SearchClaimListObj.PayorObj || '',
                    "PayorId": $scope.SearchClaimListObj.PayorId || 0,
                    "RenderingProviderId": $scope.SearchClaimListObj.RenderingProviderId || 0,
                    "checkedDenialLocationList": checkedDenialLocationList || '',
                    "BillPaymentTypeId": $scope.SearchClaimListObj.BillPaymentTypeId || 0,
                    "DenialCodeId": $scope.SearchClaimListObj.DenialCodeId || 0,
                    "TransmissionMethodId": $scope.SearchClaimListObj.TransmissionMethodId || 0,
                    "CurrentResponsibilityId": $scope.SearchClaimListObj.CurrentResponsibilityId || 0,
                };
                eHnoteMasterDataService.addDenialUsersList(Frezobj4);
                $scope.DenailClaimStatusListObj1.DenialStatusId = 2;
                $scope.DenailClaimStatusListObj1.adjWindow = null;

                $scope.SwitchClaimSubTab(tab);
                if ($scope.DenialFollowupTab == 'Summury') {

                } else {
                    $scope.SearchDenailClaimDetails(1, 'Denial');
                }            }
            if (type === 'Rejected') {
                if ($scope.ClaimLocationList.length > 0) {
                    var checkedRejectedLocations = $scope.ClaimLocationList
                        .filter(pitem => pitem.IsChecked)
                        .map(pitem => pitem.ClinicId)
                        .join(",");
                }
                var Frezobj5 = {
                    "FromDate": $filter("date")(new Date($scope.SearchClaimListObj.FromDate), "MM-dd-yyyy") || '',
                    "ToDate": $filter("date")(new Date($scope.SearchClaimListObj.ToDate), "MM-dd-yyyy") || '',
                    "BillingProviderId": $scope.SearchClaimListObj.BillingProviderId || 0,
                    "ClaimTypeId": $scope.SearchClaimListObj.ClaimTypeId || 0,
                    "PayorObj": $scope.SearchClaimListObj.PayorObj || '',
                    "PayorId": $scope.SearchClaimListObj.PayorId || 0,
                    "RenderingProviderId": $scope.SearchClaimListObj.RenderingProviderId || 0,
                    "BillPaymentTypeId": $scope.SearchClaimListObj.BillPaymentTypeId || 0,
                    "checkedRejectedLocations": checkedRejectedLocations || '',
                    "TransmissionMethodId": $scope.SearchClaimListObj.TransmissionMethodId || 0,
                };
                eHnoteMasterDataService.addRejectedUsersList(Frezobj5);
            }

            if (type === 'Rejected') {
                $scope.SearchRejectedFollowUps('Rejected');
            }

            if (type == 'PrivateClaims') {
                /* type = 'All';*/
                $scope.SearchClaimListObj.BillPaymentTypeId = 1;
                if ($scope.PrivatePayClaimStatusList.length > 0) {
                    $scope.PrivatePayClaimStatusList.forEach(function (item) {
                        item.IsChecked = true;
                    });
                }
                $scope.SearchClaimListObj.TransmissionMethodId=0;

                var IsClaimStatusId = false;

                var checkLocationList = [];
                if ($scope.ClaimLocationList.length > 0) {
                    checkLocationList = _.where($scope.ClaimLocationList, { IsChecked: true });
                }
                var checkClaimStatus = [];
                if ($scope.PrivatePayClaimStatusList.length > 0) {
                    checkClaimStatus = _.where($scope.PrivatePayClaimStatusList, { IsChecked: true });
                }
                var Frezobj = {
                    "FromDate": $filter("date")(new Date($scope.SearchClaimListObj.FromDate), "MM-dd-yyyy") || '',
                    "ToDate": $filter("date")(new Date($scope.SearchClaimListObj.ToDate), "MM-dd-yyyy") || '',
                    "BillingProviderId": $scope.SearchClaimListObj.BillingProviderId || 0,
                    "RenderingProviderId": $scope.SearchClaimListObj.RenderingProviderId || 0,
                    "BillPaymentTypeId": 1,
                    "checkLocationList": checkLocationList || [],
                    "TransmissionMethodId": $scope.SearchClaimListObj.TransmissionMethodId || 0,
                    "checkClaimStatus": checkClaimStatus || [],
                    "CurrentResponsibilityId": $scope.SearchClaimListObj.CurrentResponsibilityId || 0,
                    "ClaimTypeId": $scope.SearchClaimListObj.ClaimTypeId || 0,
                    "PayorObj": $scope.SearchClaimListObj.PayorObj || '',
                    "PayorId": $scope.SearchClaimListObj.PayorId || 0,
                };
                eHnoteMasterDataService.addPrivatepayClaims(Frezobj);
                $scope.SearchAllClaimDetails(1, type);
            } else if (type != "Denial") {
                $scope.SearchAllClaimDetails(1, type);
            }
            $scope.SwitchClaimSubTab(tab);
            $scope.clearPatientSearchData();

        }


        $scope.changeSearchType = function (id) {
            $scope.PatientSearchdata = getSelectedPatientData();
            $scope.PatientSearchdata.SearchTypeId = id;
            $scope.SearchClaimListObj.PatientId = 0;
            $scope.SearchAckmtObj.PatientId = 0;
            $scope.Search999AckmtObj.PatientId = 0;
            $scope.AllPatientList = [];

            if ($scope.PatientSearchdata.SearchText == "") {
                $scope.ShowPatientListDrop = false;
                $scope.SearchAckmtObj.PatientId = 0;
            }
            $scope.clearPatientSearchData();
        }
        //$scope.LoadPatientSearch = function (val) {


        //    if (val == undefined || val == null || val == "") {
        //        $scope.AllPatientList = [];
        //        $scope.PatientSearchdata.PatientId = 0;
        //        return false;
        //    }

        //    var object = {
        //        "ParentOrganizationId": $scope.ParentHospitalId,
        //        "Name": null,
        //        "Mobile": null,
        //        "PatientId": null,
        //        "PageSize": 30,
        //        "PageNo": 1,
        //        "DOB": null
        //    };
        //    if ($scope.PatientSearchdata.SearchTypeId == 1) {
        //        object.Name = val;
        //    } else if ($scope.PatientSearchdata.SearchTypeId == 2) {
        //        object.PatientId = val;
        //    }
        //    InventoryService.SearchInvPatient(object).then(function (resp) {
        //        if (resp.data.data.length !== 0) {
        //            if (resp.data.data != undefined) {
        //                $scope.AllPatientList = [];
        //                var patientList = resp.data.data || [];
        //                angular.forEach(patientList, function (items) {
        //                    var obj = {
        //                        "FullName": items.fullname,
        //                        "PatientId": items.PatientId,
        //                        "PatientHomeNumber": items.MobileNo,
        //                        "PatientDisPlayID": items.PatientDisplayId,
        //                        "HomeCountryCode": items.HomeCountryCode || "",
        //                        "HomeAreaCode": items.HomeAreaCode || "",
        //                        "HomeNumber": items.HomeNumber || ""
        //                    };
        //                    $scope.AllPatientList.push(obj);
        //                });
        //            }
        //        } else {
        //            $scope.AllPatientList = [];
        //        }
        //    }, function (err) { console.log(err); alertify.error("Search Patient Failed"); });
        //};
        $scope.SelectedPatient = function (patietnitem) {
            $scope.PatientSearchdata.PatientId = patietnitem.PatientID;
            $scope.SearchClaimListObj.PatientId = patietnitem.PatientID;
            $scope.SearchAckmtObj.PatientId = patietnitem.PatientID;
            $scope.Search999AckmtObj.PatientId = patietnitem.PatientID;
            $scope.SearchClaimFollowupObj.PatientId = patietnitem.PatientID;
            $scope.SearchClaimAdjustReqObj.PatientId = patietnitem.PatientID;
            $scope.SearchClaimAcknowledgementReqObj.PatientId = patietnitem.PatientID;
            $scope.PatientSearchdata.SearchText = patietnitem.FullName;
            $scope.AllPatientList = [];
            $scope.ShowPatientListDrop = false;

            if ($scope.ClaimSubtabs == 6) {
                $scope.Search277AckDetails();
            }
            else if ($scope.ClaimSubtabs == 5) {

                $scope.SearchRejectedFollowUps('Rejected');
            }
            else if ($scope.ClaimSubtabs == 7) {
                $scope.Search999AckDetails();
            }
            else if ($scope.ClaimSubtabs == 8) {
                $scope.SearchClaimFollowupslist();
            }
            else if ($scope.ClaimSubtabs == 10) {
                $scope.SearchAdjustmentReqslist(1);
            }
            //else if ($scope.ClaimSubtabs == 13) {
            //    $scope.SearchAcknowledgementReqslist();
            //}


            else if ($scope.ClaimSubtabs == 4) {
                $scope.SearchAllClaimDetails(1, 'Denial');
            }
            else {
                $scope.SearchAllClaimDetails();
            }

        };

        $scope.changeClaimType = function (mainobj) {
            $scope.SearchClaimListObj.ClaimType = "";
            if ($scope.SearchClaimListObj.ClaimTypeId === 1) {
                $scope.SearchClaimListObj.ClaimType = "Proffessional"
            } else if ($scope.SearchClaimListObj.ClaimTypeId === 2) {
                $scope.SearchClaimListObj.ClaimType = "Institutional"
            }
        };

        $scope.openUpdateClaimPopup = function (item) {
            item = item || null;
            if (item == null) {
                return false;
            }


            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "updateClaimStatus.html",
                "size": "md",
                "keyboard": false,
                "windowClass": "inventory-full-popup",
                "scope": $scope,
                "resolve": {
                    "OrgClaimListDetails": function () { return item; },
                },
                "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientDataService, OrgClaimListDetails) {

                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };

                    $scope.OrgClaimListDetails = OrgClaimListDetails;
                    $scope.GetUpdateClaimObj = function () {
                        return {
                            "UserId ": $scope.UserId,
                            "OrganizationId": $scope.HospitalId,
                            "PatientClaimId": 0,
                            "ClaimStatusId": 0,
                            "ClaimStatus": "",
                            "ClaimTransmissionId": 0,
                            "ClearingHouseResponseStatusId": null,
                            "ClearingHouseResponseStatus": "",
                            "ClearingHouseControlNumber": "",
                            "ClearingHouseNotes": "",
                            "PayorNotes": "",
                            "ClearingHouseResponseDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                            "PayerClaimControlNo": "",
                            "PayerResponseStatusId": null,
                            "PayerResponseStatus": "",
                            "PayerResponseDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                            "IsAttachementSubmitted": false,
                            "PatientId": 0,
                            "PatientName": "",
                            "PatientDocumentDetails": [],
                            "TempDocuments": [],
                        };
                    };
                    $scope.SearchUpdateClaimObj = angular.copy($scope.GetUpdateClaimObj());

                    $scope.ChangeClaimstatus = function (List, Id) {
                        var obj = $filter("filter")(List, { "ClaimStatusId": Id }, true)[0];
                        $scope.SearchUpdateClaimObj.ClaimStatusId = obj.ClaimStatusId;
                        $scope.SearchUpdateClaimObj.ClaimStatus = obj.ClaimStatusName;



                        //ClearigHouseResponse Status update

                        if ($scope.SearchUpdateClaimObj.ClaimStatusId == 3) {
                            $scope.SearchUpdateClaimObj.ClearingHouseResponseStatusId = 1;
                            $scope.SearchUpdateClaimObj.ClearingHouseResponseStatus = 'Accepted';

                        }
                        if ($scope.SearchUpdateClaimObj.ClaimStatusId == 9) {
                            $scope.SearchUpdateClaimObj.ClearingHouseResponseStatusId = 1;
                            $scope.SearchUpdateClaimObj.ClearingHouseResponseStatus = 'Accepted';

                        }
                        if ($scope.SearchUpdateClaimObj.ClaimStatusId == 4) {
                            $scope.SearchUpdateClaimObj.ClearingHouseResponseStatusId = 2;
                            $scope.SearchUpdateClaimObj.ClearingHouseResponseStatus = 'Rejected';
                        }
                        if ($scope.SearchUpdateClaimObj.ClaimStatusId == 10) {
                            $scope.SearchUpdateClaimObj.ClearingHouseResponseStatusId = 2;
                            $scope.SearchUpdateClaimObj.ClearingHouseResponseStatus = 'Rejected';
                        }
                        if ($scope.SearchUpdateClaimObj.ClaimStatusId == 5) {
                            $scope.SearchUpdateClaimObj.ClearingHouseResponseStatusId = 3;
                            $scope.SearchUpdateClaimObj.ClearingHouseResponseStatus = 'Attachment';
                        }
                        if ($scope.SearchUpdateClaimObj.ClaimStatusId == 6) {
                            $scope.SearchUpdateClaimObj.ClearingHouseResponseStatusId = 4;
                            $scope.SearchUpdateClaimObj.ClearingHouseResponseStatus = 'Resubmitted';
                        }
                        if ($scope.SearchUpdateClaimObj.ClaimStatusId == 7) {
                            $scope.SearchUpdateClaimObj.ClearingHouseResponseStatusId = 5;
                            $scope.SearchUpdateClaimObj.ClearingHouseResponseStatus = 'Appealed';
                        }
                        if ($scope.SearchUpdateClaimObj.ClaimStatusId == 2) {
                            $scope.SearchUpdateClaimObj.ClearingHouseResponseStatusId = 6;
                            $scope.SearchUpdateClaimObj.ClearingHouseResponseStatus = 'Pending';
                        }
                        if ($scope.SearchUpdateClaimObj.ClaimStatusId == 8) {
                            $scope.SearchUpdateClaimObj.ClearingHouseResponseStatusId = 6;
                            $scope.SearchUpdateClaimObj.ClearingHouseResponseStatus = 'Pending';
                        }
                        // if ($scope.SearchUpdateClaimObj.ClaimStatusId == 14) {
                        //    $scope.SearchUpdateClaimObj.ClearingHouseResponseStatusId = 6;
                        //    $scope.SearchUpdateClaimObj.ClearingHouseResponseStatus = 'Pending';
                        //}
                        // if ($scope.SearchUpdateClaimObj.ClaimStatusId == 15) {
                        //    $scope.SearchUpdateClaimObj.ClearingHouseResponseStatusId = 6;
                        //    $scope.SearchUpdateClaimObj.ClearingHouseResponseStatus = 'Pending';
                        //}
                        // if ($scope.SearchUpdateClaimObj.ClaimStatusId == 16) {
                        //    $scope.SearchUpdateClaimObj.ClearingHouseResponseStatusId	= 6;
                        //    $scope.SearchUpdateClaimObj.ClearingHouseResponseStatus = 'Pending';
                        //}
                        //if ($scope.SearchUpdateClaimObj.ClaimStatusId == 18) {
                        //    $scope.SearchUpdateClaimObj.ClearingHouseResponseStatusId	= 6;
                        //    $scope.SearchUpdateClaimObj.ClearingHouseResponseStatus = 'Pending';
                        //}
                        //if ($scope.SearchUpdateClaimObj.ClaimStatusId == 19) {
                        //    $scope.SearchUpdateClaimObj.ClearingHouseResponseStatusId	= 6;
                        //    $scope.SearchUpdateClaimObj.ClearingHouseResponseStatus = 'Pending';
                        //}


                        //Payor Response Status update
                        if ($scope.SearchUpdateClaimObj.ClaimStatusId == 3) {
                            $scope.SearchUpdateClaimObj.PayerResponseStatusId = 1;
                            $scope.SearchUpdateClaimObj.PayerResponseStatus = 'Accepted';
                        }
                        if ($scope.SearchUpdateClaimObj.ClaimStatusId == 9) {
                            $scope.SearchUpdateClaimObj.PayerResponseStatusId = 1;
                            $scope.SearchUpdateClaimObj.PayerResponseStatus = 'Accepted';
                        }
                        if ($scope.SearchUpdateClaimObj.ClaimStatusId == 4) {
                            $scope.SearchUpdateClaimObj.PayerResponseStatusId = 2;
                            $scope.SearchUpdateClaimObj.PayerResponseStatus = 'Rejected';
                        }
                        if ($scope.SearchUpdateClaimObj.ClaimStatusId == 10) {
                            $scope.SearchUpdateClaimObj.PayerResponseStatusId = 2;
                            $scope.SearchUpdateClaimObj.PayerResponseStatus = 'Rejected';
                        }
                        if ($scope.SearchUpdateClaimObj.ClaimStatusId == 11) {
                            $scope.SearchUpdateClaimObj.PayerResponseStatusId = 3;
                            $scope.SearchUpdateClaimObj.PayerResponseStatus = 'Denied';
                        }
                        if ($scope.SearchUpdateClaimObj.ClaimStatusId == 17) {
                            $scope.SearchUpdateClaimObj.PayerResponseStatusId = 3;
                            $scope.SearchUpdateClaimObj.PayerResponseStatus = 'Denied';
                        }
                        if ($scope.SearchUpdateClaimObj.ClaimStatusId == 13) {
                            $scope.SearchUpdateClaimObj.PayerResponseStatusId = 4;
                            $scope.SearchUpdateClaimObj.PayerResponseStatus = 'Remit Information';
                        }
                        if ($scope.SearchUpdateClaimObj.ClaimStatusId == 12) {
                            $scope.SearchUpdateClaimObj.PayerResponseStatusId = 6;
                            $scope.SearchUpdateClaimObj.PayerResponseStatus = 'Request for info';
                        }
                        if ($scope.SearchUpdateClaimObj.ClaimStatusId == 2) {
                            $scope.SearchUpdateClaimObj.PayerResponseStatusId = 8;
                            $scope.SearchUpdateClaimObj.PayerResponseStatus = 'Pending';
                        }
                        if ($scope.SearchUpdateClaimObj.ClaimStatusId == 8) {
                            $scope.SearchUpdateClaimObj.PayerResponseStatusId = 8;
                            $scope.SearchUpdateClaimObj.PayerResponseStatus = 'Pending';
                        }

                    }

                    $scope.Fileupload = "";
                    $scope.selectedFiles = function (files) {
                        if (files == null || files == "") {
                            return false;
                        }
                        $scope.Fileupload = files;
                        if ($scope.Fileupload != null) {
                            angular.forEach($scope.Fileupload, function (item) {
                                var pName = item.name, name = "";
                                var type = item.type.split("/")[1];
                                if (pName.length > 9) {
                                    name = pName.substring(0, 9) + "..." + "." + type;
                                } else {
                                    name = angular.copy(pName) + '.' + type;
                                }
                                var obj = {
                                    "S3URL": "",
                                    "AttachmentExt": item.type,
                                    "AttachmentName": name,
                                    "DeleteInd": "N",
                                    "AttachmentId": 0,
                                    "file": item

                                };
                                $scope.SearchUpdateClaimObj.TempDocuments.push(obj);

                            });
                        }

                    }

                    //$scope.removeImage = function (item, mainitem) {
                    //    if (item.AttachmentId != 0) {
                    //        item.DeleteInd = true;
                    //    } else {
                    //        var index = mainitem.TempDocuments.indexOf(item);
                    //        mainitem.TempDocuments.splice(index, 1);
                    //    }
                    //};

                    /*$scope.SearchUpdateClaimObj.ClaimStatusId = $scope.OrgClaimListDetails.ClaimStatusId;*/

                    $scope.SearchUpdateClaimObj.ClaimStatusId = item.ClaimStatusId;
                    $scope.SearchUpdateClaimObj.ClaimStatus = item.ClaimStatus;
                    $scope.SearchUpdateClaimObj.ClaimTransmissionId = item.PatientClaimTransmission[0].ClaimTransmissionId;

                    item.ProcessingStatusArray.forEach(function (data) {
                        if (item.TransmitQueuePatientInsuranceId === data.PatientInsuranceDetailId) {
                            $scope.SearchUpdateClaimObj.ClearingHouseControlNumber = data.ClearingHouseControlNumber;
                            $scope.SearchUpdateClaimObj.PayerClaimControlNo = data.PayorControlNumber;
                            $scope.SearchUpdateClaimObj.ClaimSubmissionDate = data.ClaimSubmissionDate;
                            //$scope.SearchUpdateClaimObj.ClearingHouseNotes = item.PatientClaimTransmission[0].ClearingHouseNotes;
                            $scope.SearchUpdateClaimObj.ClearingHouseResponseDate = data.ClearingHouseStatusDate;
                            $scope.SearchUpdateClaimObj.PayerResponseDate = data.PayorStatusDate;
                            $scope.SearchUpdateClaimObj.PayorId = data.PayorStatusId;
                            $scope.SearchUpdateClaimObj.PayorNotes = data.Notes;
                        }
                    })


                    $scope.SearchUpdateClaimObj.ClearingHouseResponseDate = $filter('date')($scope.SearchUpdateClaimObj.ClearingHouseResponseDate, "MM-dd-yyyy");
                    $scope.SearchUpdateClaimObj.PayerResponseDate = $filter('date')($scope.SearchUpdateClaimObj.PayerResponseDate, "MM-dd-yyyy");

                    if ($scope.SearchUpdateClaimObj.ClaimStatusId == 3) {
                        $scope.SearchUpdateClaimObj.ClearingHouseResponseStatusId = 1;
                        $scope.SearchUpdateClaimObj.ClearingHouseResponseStatus = 'Accepted';

                    }
                    if ($scope.SearchUpdateClaimObj.ClaimStatusId == 9) {
                        $scope.SearchUpdateClaimObj.ClearingHouseResponseStatusId = 1;
                        $scope.SearchUpdateClaimObj.ClearingHouseResponseStatus = 'Accepted';

                    }
                    if ($scope.SearchUpdateClaimObj.ClaimStatusId == 4) {
                        $scope.SearchUpdateClaimObj.ClearingHouseResponseStatusId = 2;
                        $scope.SearchUpdateClaimObj.ClearingHouseResponseStatus = 'Rejected';
                    }
                    if ($scope.SearchUpdateClaimObj.ClaimStatusId == 10) {
                        $scope.SearchUpdateClaimObj.ClearingHouseResponseStatusId = 2;
                        $scope.SearchUpdateClaimObj.ClearingHouseResponseStatus = 'Rejected';
                    }
                    if ($scope.SearchUpdateClaimObj.ClaimStatusId == 5) {
                        $scope.SearchUpdateClaimObj.ClearingHouseResponseStatusId = 3;
                        $scope.SearchUpdateClaimObj.ClearingHouseResponseStatus = 'Attachment';
                    }
                    if ($scope.SearchUpdateClaimObj.ClaimStatusId == 6) {
                        $scope.SearchUpdateClaimObj.ClearingHouseResponseStatusId = 4;
                        $scope.SearchUpdateClaimObj.ClearingHouseResponseStatus = 'Resubmitted';
                    }
                    if ($scope.SearchUpdateClaimObj.ClaimStatusId == 7) {
                        $scope.SearchUpdateClaimObj.ClearingHouseResponseStatusId = 5;
                        $scope.SearchUpdateClaimObj.ClearingHouseResponseStatus = 'Appealed';
                    }
                    if ($scope.SearchUpdateClaimObj.ClaimStatusId == 2) {
                        $scope.SearchUpdateClaimObj.ClearingHouseResponseStatusId = 6;
                        $scope.SearchUpdateClaimObj.ClearingHouseResponseStatus = 'Pending';
                    }
                    if ($scope.SearchUpdateClaimObj.ClaimStatusId == 8) {
                        $scope.SearchUpdateClaimObj.ClearingHouseResponseStatusId = 6;
                        $scope.SearchUpdateClaimObj.ClearingHouseResponseStatus = 'Pending';
                    }
                    // if ($scope.SearchUpdateClaimObj.ClaimStatusId == 14) {
                    //    $scope.SearchUpdateClaimObj.ClearingHouseResponseStatusId = 6;
                    //    $scope.SearchUpdateClaimObj.ClearingHouseResponseStatus = 'Pending';
                    //}
                    // if ($scope.SearchUpdateClaimObj.ClaimStatusId == 15) {
                    //    $scope.SearchUpdateClaimObj.ClearingHouseResponseStatusId = 6;
                    //    $scope.SearchUpdateClaimObj.ClearingHouseResponseStatus = 'Pending';
                    //}
                    // if ($scope.SearchUpdateClaimObj.ClaimStatusId == 16) {
                    //    $scope.SearchUpdateClaimObj.ClearingHouseResponseStatusId	= 6;
                    //    $scope.SearchUpdateClaimObj.ClearingHouseResponseStatus = 'Pending';
                    //}
                    //if ($scope.SearchUpdateClaimObj.ClaimStatusId == 18) {
                    //    $scope.SearchUpdateClaimObj.ClearingHouseResponseStatusId	= 6;
                    //    $scope.SearchUpdateClaimObj.ClearingHouseResponseStatus = 'Pending';
                    //}
                    //if ($scope.SearchUpdateClaimObj.ClaimStatusId == 19) {
                    //    $scope.SearchUpdateClaimObj.ClearingHouseResponseStatusId	= 6;
                    //    $scope.SearchUpdateClaimObj.ClearingHouseResponseStatus = 'Pending';
                    //}


                    //Payor Response Status update
                    if ($scope.SearchUpdateClaimObj.ClaimStatusId == 3) {
                        $scope.SearchUpdateClaimObj.PayerResponseStatusId = 1;
                        $scope.SearchUpdateClaimObj.PayerResponseStatus = 'Accepted';
                    }
                    if ($scope.SearchUpdateClaimObj.ClaimStatusId == 9) {
                        $scope.SearchUpdateClaimObj.PayerResponseStatusId = 1;
                        $scope.SearchUpdateClaimObj.PayerResponseStatus = 'Accepted';
                    }
                    if ($scope.SearchUpdateClaimObj.ClaimStatusId == 4) {
                        $scope.SearchUpdateClaimObj.PayerResponseStatusId = 2;
                        $scope.SearchUpdateClaimObj.PayerResponseStatus = 'Rejected';
                    }
                    if ($scope.SearchUpdateClaimObj.ClaimStatusId == 10) {
                        $scope.SearchUpdateClaimObj.PayerResponseStatusId = 2;
                        $scope.SearchUpdateClaimObj.PayerResponseStatus = 'Rejected';
                    }
                    if ($scope.SearchUpdateClaimObj.ClaimStatusId == 11) {
                        $scope.SearchUpdateClaimObj.PayerResponseStatusId = 3;
                        $scope.SearchUpdateClaimObj.PayerResponseStatus = 'Denied';
                    }
                    if ($scope.SearchUpdateClaimObj.ClaimStatusId == 17) {
                        $scope.SearchUpdateClaimObj.PayerResponseStatusId = 3;
                        $scope.SearchUpdateClaimObj.PayerResponseStatus = 'Denied';
                    }
                    if ($scope.SearchUpdateClaimObj.ClaimStatusId == 13) {
                        $scope.SearchUpdateClaimObj.PayerResponseStatusId = 4;
                        $scope.SearchUpdateClaimObj.PayerResponseStatus = 'Remit Information';
                    }
                    if ($scope.SearchUpdateClaimObj.ClaimStatusId == 12) {
                        $scope.SearchUpdateClaimObj.PayerResponseStatusId = 6;
                        $scope.SearchUpdateClaimObj.PayerResponseStatus = 'Request for info';
                    }
                    if ($scope.SearchUpdateClaimObj.ClaimStatusId == 2) {
                        $scope.SearchUpdateClaimObj.PayerResponseStatusId = 8;
                        $scope.SearchUpdateClaimObj.PayerResponseStatus = 'Pending';
                    }
                    if ($scope.SearchUpdateClaimObj.ClaimStatusId == 8) {
                        $scope.SearchUpdateClaimObj.PayerResponseStatusId = 8;
                        $scope.SearchUpdateClaimObj.PayerResponseStatus = 'Pending';
                    }

                    $scope.SaveUpdateClaimStatusList = function () {

                        var patientname = $scope.OrgClaimListDetails.PatientFirstName;
                        if ($scope.OrgClaimListDetails.PatientLastName != "") {
                            patientname + " " + $scope.OrgClaimListDetails.PatientLastName;
                        }

                        $scope.SearchUpdateClaimObj.PatientDocumentDetails = $scope.SearchUpdateClaimObj.PatientDocumentDetails || [];
                        if ($scope.SearchUpdateClaimObj.TempDocuments.length > 0) {
                            angular.forEach($scope.SearchUpdateClaimObj.TempDocuments, function (item) {
                                $scope.SearchUpdateClaimObj.PatientDocumentDetails.push(item);
                            });
                        }

                        //var obj = {
                        //    "UserId": $scope.UserId,
                        //    "OrganizationId": $scope.HospitalId,
                        //    "PatientClaimId": $scope.OrgClaimListDetails.PatientClaimId,
                        //    "ClaimStatusId": $scope.SearchUpdateClaimObj.ClaimStatusId,
                        //    "ClaimStatus": $scope.SearchUpdateClaimObj.ClaimStatus,
                        //    "ClaimTransmissionId": $scope.OrgClaimListDetails.PatientClaimTransmission[0].ClaimTransmissionId,
                        //    "ClearingHouseResponseStatusId	 ": $scope.SearchUpdateClaimObj.ClearingHouseResponseStatusId,
                        //    "ClearingHouseResponseStatus": $scope.SearchUpdateClaimObj.ClearingHouseResponseStatus,
                        //    "ClearingHouseControlNumber": $scope.SearchUpdateClaimObj.ClearingHouseControlNumber || '',
                        //    "ClearingHouseResponseDate": $scope.SearchUpdateClaimObj.ClearingHouseResponseDate,
                        //    "PayerClaimControlNo": $scope.SearchUpdateClaimObj.PayerClaimControlNo || '',
                        //    "PayerResponseStatusId": $scope.SearchUpdateClaimObj.PayerResponseStatusId || null,
                        //    "PayerResponseStatus": $scope.SearchUpdateClaimObj.PayerResponseStatus|| "",
                        //    "ClearingHouseNotes": $scope.SearchUpdateClaimObj.ClearingHouseNotes || "",
                        //    "PayorNotes": $scope.SearchUpdateClaimObj.PayorNotes || "",
                        //    "PayerResponseDate": $scope.SearchUpdateClaimObj.PayerResponseDate,
                        //    "IsAttachementSubmitted": $scope.SearchUpdateClaimObj.ChangeClaimstatus || false,
                        //    "PatientId": $scope.OrgClaimListDetails.PatientId,
                        //    "PatientName": patientname,
                        //    "PatientDocumentDetails": $scope.SearchUpdateClaimObj.PatientDocumentDetails || [],
                        //};
                        var obj =
                        {

                            "UserId": $scope.UserId,
                            "OrganizationId": $scope.HospitalId,
                            "ClaimProcessingStatusId": 0,
                            "PatientClaimId": $scope.OrgClaimListDetails.PatientClaimId,
                            "ClaimStatusId": $scope.SearchUpdateClaimObj.ClaimStatusId,
                            "ClaimStatus": $scope.SearchUpdateClaimObj.ClaimStatus,
                            "PatientInsuranceDetailId": $scope.OrgClaimListDetails.PatientClaimTransmission[0].PatientInsuranceDetailId,
                            "ClearingHouseStatusId": $scope.SearchUpdateClaimObj.ClearingHouseResponseStatusId,
                            "ClearingHouseStatus": $scope.SearchUpdateClaimObj.ClearingHouseResponseStatus,
                            "ClearingHouseStatusDate": $scope.SearchUpdateClaimObj.ClearingHouseResponseDate,
                            "PayorStatusId": $scope.SearchUpdateClaimObj.PayerResponseStatusId || null,
                            "PayorStatus": $scope.SearchUpdateClaimObj.PayerResponseStatus || "",
                            "PayorStatusDate": $scope.SearchUpdateClaimObj.PayerResponseDate,

                            "Notes": $scope.SearchUpdateClaimObj.PayorNotes || "",
                            "DeleteInd": "Y",
                            "PatientId": $scope.OrgClaimListDetails.PatientId,
                            "PatientName": patientname,
                            "ClearingHouseControlNumber": $scope.SearchUpdateClaimObj.ClearingHouseControlNumber,
                            "PayorControlNumber": $scope.SearchUpdateClaimObj.PayerClaimControlNo,
                            "PatientDocumentDetails": $scope.SearchUpdateClaimObj.PatientDocumentDetails || [],
                        };

                        obj.ClearingHouseStatusDate = $filter("usdateFormatter")(obj.ClearingHouseStatusDate, "-");
                        //  obj.ClearingHouseStatusDate = $filter("usdateFormatter")(obj.ClearingHouseStatusDate, "-");

                        // Convert to JavaScript Date object
                        if (obj.ClearingHouseStatusDate) {
                            obj.ClearingHouseStatusDate = new Date(obj.ClearingHouseStatusDate);
                        }
                        obj.PayorStatusDate = $filter("usdateFormatter")(obj.PayorStatusDate, "-");
                        if (obj.PayorStatusDate) {
                            obj.PayorStatusDate = new Date(obj.PayorStatusDate);
                        }
                        if (obj.PatientDocumentDetails.length > 0) {
                            obj.IsAttachementSubmitted = true;
                        }

                        eHnotePatientDataService.UpdateClaimTransmissionStatus(obj, onsuccess, onerror);
                        function onsuccess(resp) {
                            if (resp.status === "Success") {
                                $uibModalInstance.dismiss("cancel");
                                $scope.SearchAllClaimDetails();
                            } else {
                                alertify.error(resp.Message);
                            }
                        }

                        function onerror(err) {
                            console.log(err);
                        }
                    }


                    //$scope.ClearClaimListStatus = function () {
                    //    $scope.SearchUpdateClaimObj = angular.copy($scope.GetUpdateClaimObj());   
                    //};

                }

            });

            $scope.mInstanceAdd.result.then(function (response) {

                console.log(response);
                $scope.SearchAllClaimDetails();
                $scope.SearchClaimObj.PageNumber = 1;
                $scope.SearchClaimObj.Patient = "";

                //$scope.SearchClaimDashboardDetails();

            }, function () { });

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

        $scope.ClaimDashBoadHCFAPrint = function (item, type, InsType) {

            InsType = InsType || "";
            //item.PatientClaimId = item.PatientClaimId || 0;
            //GetParticularClaimDetailsById
            if (InsType == 'Primary') {
                $scope.PrimaryInsuranceId = item.PrimaryInsuranceId;
                $scope.SecondryInsuranceId = 0;
            } else {
                $scope.SecondryInsuranceId = item.SecondaryInsuranceId;
                $scope.PrimaryInsuranceId = 0;
            }
            var obj = {
                //"PatientInsuranceDetailId": $scope.PatientInsuranceDetailId,
                "PatientClaimId": item.PatientClaimId,
                "PrimaryInsuranceId": $scope.PrimaryInsuranceId,
                "SecondryInsuranceId": $scope.SecondryInsuranceId||0
            }
            eHnoteInsuranceService.GetParticularClaimPrintDetails(obj).then(function (resp) {
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

                        }
                    }
                    if (resp.data.Patient.length > 0) {

                        var patientresp = resp.data.Patient[0];

                        //$scope.HCFADetailsInfo.PatientDetails.CityName = patientresp.PermanentAddress.CityName || "";
                        //$scope.HCFADetailsInfo.PatientDetails.StateName = patientresp.PermanentAddress.StateName || "";
                        //$scope.HCFADetailsInfo.PatientDetails.StateCode = patientresp.PermanentAddress.StateCode || "";
                        //$scope.HCFADetailsInfo.PatientDetails.ZipCode = patientresp.PermanentAddress.ZipCode || "";
                        //$scope.HCFADetailsInfo.PatientDetails.Address1 = patientresp.PermanentAddress.AddressLine1 || "";
                        //$scope.HCFADetailsInfo.PatientDetails.Address2 = patientresp.PermanentAddress.AddressLine2 || "";

                        //$scope.HCFADetailsInfo.InsuranceDetails.Address = $scope.HCFADetailsInfo.PatientDetails.Address1 + " , " + $scope.HCFADetailsInfo.PatientDetails.Address2;
                        //$scope.HCFADetailsInfo.InsuranceDetails.CityName = patientresp.PermanentAddress.CityName || "";
                        //$scope.HCFADetailsInfo.InsuranceDetails.StateName = patientresp.PermanentAddress.StateName || "";
                        //$scope.HCFADetailsInfo.InsuranceDetails.StateCode = patientresp.PermanentAddress.StateCode || "";
                        //$scope.HCFADetailsInfo.InsuranceDetails.ZipCode = patientresp.PermanentAddress.ZipCode || "";

                        $scope.HCFADetailsInfo.PatientDetails.CityName = patientresp.PostalAddress.CityName || "";
                        $scope.HCFADetailsInfo.PatientDetails.StateName = patientresp.PostalAddress.StateName || "";
                        $scope.HCFADetailsInfo.PatientDetails.StateCode = patientresp.PostalAddress.StateCode || "";
                        $scope.HCFADetailsInfo.PatientDetails.ZipCode = patientresp.PostalAddress.ZipCode || "";
                        $scope.HCFADetailsInfo.PatientDetails.Address1 = patientresp.PostalAddress.AddressLine1 || "";
                        $scope.HCFADetailsInfo.PatientDetails.Address2 = patientresp.PostalAddress.AddressLine2 || "";

                        //+ " " + $scope.HCFADetailsInfo.PatientDetails.CityName + " " + $scope.HCFADetailsInfo.PatientDetails.StateName + " " + $scope.HCFADetailsInfo.PatientDetails.ZipCode
                        $scope.HCFADetailsInfo.InsuranceDetails.Address = $scope.HCFADetailsInfo.PatientDetails.Address1 + " , " + $scope.HCFADetailsInfo.PatientDetails.Address2;
                        $scope.HCFADetailsInfo.InsuranceDetails.CityName = patientresp.PostalAddress.CityName || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.StateName = patientresp.PostalAddress.StateName || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.StateCode = patientresp.PostalAddress.StateCode || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.ZipCode = patientresp.PostalAddress.ZipCode || "";
                    }

                    $scope.HCFADetailsInfo.PatientDetails.CountryCode = resp.data.CountryCode || "";
                    $scope.HCFADetailsInfo.PatientSSN = resp.data.PatientSSN || "";
                    //$scope.HCFADetailsInfo.FeedralTaxIDNo = $scope.HospitalData[0].TaxID || "";
                    $scope.HCFADetailsInfo.FeedralTaxIDNo = resp.data.BillingProviderTaxId || "";
                    //if ($scope.HCFADetailsInfo.FeedralTaxIDNo != "") {
                    //    $scope.HCFADetailsInfo.SSN = "yes";
                    //}

                    $scope.HCFADetailsInfo.EIN = "yes";



                    var currentdate = $filter('date')(new Date(), 'MM-dd-yyyy');
                    $scope.HCFADetailsInfo.datesPatientUnabletoWorkincurrentoccupation.FormDate = $filter('date')(resp.data.DOSfrom, 'MM-dd-yyyy') || currentdate;
                    $scope.HCFADetailsInfo.datesPatientUnabletoWorkincurrentoccupation.ToDate = $filter('date')(resp.data.DOSto, 'MM-dd-yyyy') || currentdate;
                    $scope.HCFADetailsInfo.hospitalizationDatesRelatedToCurrentServices.FormDate = $filter('date')(resp.data.DOSfrom, 'MM-dd-yyyy') || currentdate;
                    $scope.HCFADetailsInfo.hospitalizationDatesRelatedToCurrentServices.ToDate = $filter('date')(resp.data.DOSto, 'MM-dd-yyyy') || currentdate;


                    $scope.HCFADetailsInfo.HeaderInsurance.PayorName = resp.data.PayorName || "";
                    $scope.HCFADetailsInfo.HeaderInsurance.Address = resp.data.PayorAddress || "";
                    //$scope.HCFADetailsInfo.HeaderInsurance.CityName = resp.data.PayorCityName || "";
                    //$scope.HCFADetailsInfo.HeaderInsurance.StateName = resp.data.PayorStateName || "";
                    //$scope.HCFADetailsInfo.HeaderInsurance.ZipCode = resp.data.PayorZipCode || "";
                    $scope.HCFADetailsInfo.HeaderInsurance.PatientDisplayId = resp.data.PatientDisplayId || "";

                    if (resp.data.AppointmentInsuranceDetails.length > 0) {

                        if (resp.data.CurrentResponsibilityId == 2) {
                            $scope.HCFADetailsInfo.HeaderInsurance.Address1 = resp.data.AppointmentInsuranceDetails[0].PayorAddress1 || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.Address2 = resp.data.AppointmentInsuranceDetails[0].PayorAddress2 || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.PayorCityName = resp.data.AppointmentInsuranceDetails[0].PayorCityName || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.PayorStateName = resp.data.AppointmentInsuranceDetails[0].PayorStateName || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.PayorCountryName = resp.data.AppointmentInsuranceDetails[0].PayorCountryName || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.PayorZipCode = resp.data.AppointmentInsuranceDetails[0].PayorZipCode || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.PayorCode = resp.data.AppointmentInsuranceDetails[0].PayorCode || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.PayorStateCode = resp.data.AppointmentInsuranceDetails[0].PayorStateCode || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.UserTaxonomyCode = resp.data.AppointmentInsuranceDetails[0].UserTaxonomyCode || "";
                            $scope.HCFADetailsInfo.PatientDetails.DoctorName = resp.data.AppointmentInsuranceDetails[0].DoctorName || "";
                            $scope.HCFADetailsInfo.PatientDetails.RelationName = resp.data.AppointmentInsuranceDetails[0].RelationName || "";
                            $scope.HCFADetailsInfo.PatientDetails.RelationShipId = resp.data.AppointmentInsuranceDetails[0].RelationShipId || "";
                            $scope.HCFADetailsInfo.PatientDetails.AppointmentDate = $filter('date')(resp.data.AppointmentInsuranceDetails[0].AppointmentDate, 'MM-dd-yyyy') || "";
                            $scope.HCFADetailsInfo.PatientDetails.InsuranceTypeCode = resp.data.AppointmentInsuranceDetails[0].InsuranceTypeCode || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.PayorId = resp.data.AppointmentInsuranceDetails[0].PayorId || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.GlobalPayorId = resp.data.AppointmentInsuranceDetails[0].GlobalPayorId || "";
                        }
                        else if (resp.data.CurrentResponsibilityId == 3) {
                            if (resp.data.AppointmentInsuranceDetails.length > 1) {
                                $scope.HCFADetailsInfo.HeaderInsurance.Address1 = resp.data.AppointmentInsuranceDetails[1].PayorAddress1 || "";
                                $scope.HCFADetailsInfo.HeaderInsurance.Address2 = resp.data.AppointmentInsuranceDetails[1].PayorAddress2 || "";
                                $scope.HCFADetailsInfo.HeaderInsurance.PayorCityName = resp.data.AppointmentInsuranceDetails[1].PayorCityName || "";
                                $scope.HCFADetailsInfo.HeaderInsurance.PayorStateName = resp.data.AppointmentInsuranceDetails[1].PayorStateName || "";
                                $scope.HCFADetailsInfo.HeaderInsurance.PayorCountryName = resp.data.AppointmentInsuranceDetails[1].PayorCountryName || "";
                                $scope.HCFADetailsInfo.HeaderInsurance.PayorZipCode = resp.data.AppointmentInsuranceDetails[1].PayorZipCode || "";
                                $scope.HCFADetailsInfo.HeaderInsurance.PayorCode = resp.data.AppointmentInsuranceDetails[1].PayorCode || "";
                                $scope.HCFADetailsInfo.HeaderInsurance.PayorStateCode = resp.data.AppointmentInsuranceDetails[1].PayorStateCode || "";
                                $scope.HCFADetailsInfo.HeaderInsurance.UserTaxonomyCode = resp.data.AppointmentInsuranceDetails[1].UserTaxonomyCode || "";
                                $scope.HCFADetailsInfo.PatientDetails.DoctorName = resp.data.AppointmentInsuranceDetails[1].DoctorName || "";
                                $scope.HCFADetailsInfo.PatientDetails.RelationName = resp.data.AppointmentInsuranceDetails[1].RelationName || "";
                                $scope.HCFADetailsInfo.PatientDetails.RelationShipId = resp.data.AppointmentInsuranceDetails[1].RelationShipId || "";
                                $scope.HCFADetailsInfo.PatientDetails.AppointmentDate = $filter('date')(resp.data.AppointmentInsuranceDetails[1].AppointmentDate, 'MM-dd-yyyy') || "";
                                $scope.HCFADetailsInfo.PatientDetails.InsuranceTypeCode = resp.data.AppointmentInsuranceDetails[1].InsuranceTypeCode || "";
                                $scope.HCFADetailsInfo.HeaderInsurance.PayorId = resp.data.AppointmentInsuranceDetails[1].PayorId || "";
                                $scope.HCFADetailsInfo.HeaderInsurance.GlobalPayorId = resp.data.AppointmentInsuranceDetails[1].GlobalPayorId || "";
                            } else {
                                $scope.HCFADetailsInfo.HeaderInsurance.Address1 = resp.data.AppointmentInsuranceDetails[0].PayorAddress1 || "";
                                $scope.HCFADetailsInfo.HeaderInsurance.Address2 = resp.data.AppointmentInsuranceDetails[0].PayorAddress2 || "";
                                $scope.HCFADetailsInfo.HeaderInsurance.PayorCityName = resp.data.AppointmentInsuranceDetails[0].PayorCityName || "";
                                $scope.HCFADetailsInfo.HeaderInsurance.PayorStateName = resp.data.AppointmentInsuranceDetails[0].PayorStateName || "";
                                $scope.HCFADetailsInfo.HeaderInsurance.PayorCountryName = resp.data.AppointmentInsuranceDetails[0].PayorCountryName || "";
                                $scope.HCFADetailsInfo.HeaderInsurance.PayorZipCode = resp.data.AppointmentInsuranceDetails[0].PayorZipCode || "";
                                $scope.HCFADetailsInfo.HeaderInsurance.PayorCode = resp.data.AppointmentInsuranceDetails[0].PayorCode || "";
                                $scope.HCFADetailsInfo.HeaderInsurance.PayorStateCode = resp.data.AppointmentInsuranceDetails[0].PayorStateCode || "";
                                $scope.HCFADetailsInfo.HeaderInsurance.UserTaxonomyCode = resp.data.AppointmentInsuranceDetails[0].UserTaxonomyCode || "";
                                $scope.HCFADetailsInfo.PatientDetails.DoctorName = resp.data.AppointmentInsuranceDetails[0].DoctorName || "";
                                $scope.HCFADetailsInfo.PatientDetails.RelationName = resp.data.AppointmentInsuranceDetails[0].RelationName || "";
                                $scope.HCFADetailsInfo.PatientDetails.RelationShipId = resp.data.AppointmentInsuranceDetails[0].RelationShipId || "";
                                $scope.HCFADetailsInfo.PatientDetails.AppointmentDate = $filter('date')(resp.data.AppointmentInsuranceDetails[0].AppointmentDate, 'MM-dd-yyyy') || "";
                                $scope.HCFADetailsInfo.PatientDetails.InsuranceTypeCode = resp.data.AppointmentInsuranceDetails[0].InsuranceTypeCode || "";
                                $scope.HCFADetailsInfo.HeaderInsurance.PayorId = resp.data.AppointmentInsuranceDetails[0].PayorId || "";
                                $scope.HCFADetailsInfo.HeaderInsurance.GlobalPayorId = resp.data.AppointmentInsuranceDetails[0].GlobalPayorId || "";
                            }

                        }
                        else {
                            if (resp.data.AppointmentInsuranceDetails.length > 2) {
                                $scope.HCFADetailsInfo.HeaderInsurance.Address1 = resp.data.AppointmentInsuranceDetails[2].PayorAddress1 || "";
                                $scope.HCFADetailsInfo.HeaderInsurance.Address2 = resp.data.AppointmentInsuranceDetails[2].PayorAddress2 || "";
                                $scope.HCFADetailsInfo.HeaderInsurance.PayorCityName = resp.data.AppointmentInsuranceDetails[2].PayorCityName || "";
                                $scope.HCFADetailsInfo.HeaderInsurance.PayorStateName = resp.data.AppointmentInsuranceDetails[2].PayorStateName || "";
                                $scope.HCFADetailsInfo.HeaderInsurance.PayorCountryName = resp.data.AppointmentInsuranceDetails[2].PayorCountryName || "";
                                $scope.HCFADetailsInfo.HeaderInsurance.PayorZipCode = resp.data.AppointmentInsuranceDetails[2].PayorZipCode || "";
                                $scope.HCFADetailsInfo.HeaderInsurance.PayorCode = resp.data.AppointmentInsuranceDetails[2].PayorCode || "";
                                $scope.HCFADetailsInfo.HeaderInsurance.PayorStateCode = resp.data.AppointmentInsuranceDetails[2].PayorStateCode || "";
                                $scope.HCFADetailsInfo.HeaderInsurance.UserTaxonomyCode = resp.data.AppointmentInsuranceDetails[2].UserTaxonomyCode || "";
                                $scope.HCFADetailsInfo.PatientDetails.DoctorName = resp.data.AppointmentInsuranceDetails[2].DoctorName || "";
                                $scope.HCFADetailsInfo.PatientDetails.RelationName = resp.data.AppointmentInsuranceDetails[2].RelationName || "";
                                $scope.HCFADetailsInfo.PatientDetails.RelationShipId = resp.data.AppointmentInsuranceDetails[2].RelationShipId || "";
                                $scope.HCFADetailsInfo.PatientDetails.AppointmentDate = $filter('date')(resp.data.AppointmentInsuranceDetails[2].AppointmentDate, 'MM-dd-yyyy') || "";
                                $scope.HCFADetailsInfo.PatientDetails.InsuranceTypeCode = resp.data.AppointmentInsuranceDetails[2].InsuranceTypeCode || "";
                                $scope.HCFADetailsInfo.HeaderInsurance.PayorId = resp.data.AppointmentInsuranceDetails[2].PayorId || "";
                                $scope.HCFADetailsInfo.HeaderInsurance.GlobalPayorId = resp.data.AppointmentInsuranceDetails[2].GlobalPayorId || "";
                            } else {
                                $scope.HCFADetailsInfo.HeaderInsurance.Address1 = resp.data.AppointmentInsuranceDetails[0].PayorAddress1 || "";
                                $scope.HCFADetailsInfo.HeaderInsurance.Address2 = resp.data.AppointmentInsuranceDetails[0].PayorAddress2 || "";
                                $scope.HCFADetailsInfo.HeaderInsurance.PayorCityName = resp.data.AppointmentInsuranceDetails[0].PayorCityName || "";
                                $scope.HCFADetailsInfo.HeaderInsurance.PayorStateName = resp.data.AppointmentInsuranceDetails[0].PayorStateName || "";
                                $scope.HCFADetailsInfo.HeaderInsurance.PayorCountryName = resp.data.AppointmentInsuranceDetails[0].PayorCountryName || "";
                                $scope.HCFADetailsInfo.HeaderInsurance.PayorZipCode = resp.data.AppointmentInsuranceDetails[0].PayorZipCode || "";
                                $scope.HCFADetailsInfo.HeaderInsurance.PayorCode = resp.data.AppointmentInsuranceDetails[0].PayorCode || "";
                                $scope.HCFADetailsInfo.HeaderInsurance.PayorStateCode = resp.data.AppointmentInsuranceDetails[0].PayorStateCode || "";
                                $scope.HCFADetailsInfo.HeaderInsurance.UserTaxonomyCode = resp.data.AppointmentInsuranceDetails[0].UserTaxonomyCode || "";
                                $scope.HCFADetailsInfo.PatientDetails.DoctorName = resp.data.AppointmentInsuranceDetails[0].DoctorName || "";
                                $scope.HCFADetailsInfo.PatientDetails.RelationName = resp.data.AppointmentInsuranceDetails[0].RelationName || "";
                                $scope.HCFADetailsInfo.PatientDetails.RelationShipId = resp.data.AppointmentInsuranceDetails[0].RelationShipId || "";
                                $scope.HCFADetailsInfo.PatientDetails.AppointmentDate = $filter('date')(resp.data.AppointmentInsuranceDetails[0].AppointmentDate, 'MM-dd-yyyy') || "";
                                $scope.HCFADetailsInfo.PatientDetails.InsuranceTypeCode = resp.data.AppointmentInsuranceDetails[0].InsuranceTypeCode || "";
                                $scope.HCFADetailsInfo.HeaderInsurance.PayorId = resp.data.AppointmentInsuranceDetails[0].PayorId || "";
                                $scope.HCFADetailsInfo.HeaderInsurance.GlobalPayorId = resp.data.AppointmentInsuranceDetails[0].GlobalPayorId || "";
                            }

                        }

                    }

                    $scope.HCFADetailsInfo.PatientDetails.DoctorName = $scope.HCFADetailsInfo.PatientDetails.DoctorName || "";
                    if ($scope.HCFADetailsInfo.PatientDetails.DoctorName == "") {
                        $scope.HCFADetailsInfo.PatientDetails.DoctorName = $scope.doctorinfo.doctordata.User[0].FullName;
                    }

                    $scope.HCFADetailsInfo.InsuranceDetails.PolicyId = resp.data.PolicyId || 0;
                    $scope.HCFADetailsInfo.InsuranceDetails.InsurancePlanName = resp.data.ProffesionalPayerId || "";//resp.data.PlanName
                    $scope.HCFADetailsInfo.InsuranceDetails.InsurancePayorName = resp.data.OrganizationPayorName || "";
                    $scope.HCFADetailsInfo.InsuranceDetails.PolicyGroupId = resp.data.GroupId || 0;
                    $scope.HCFADetailsInfo.InsuranceDetails.PolicyGroupname = resp.data.Groupname || 0;

                    $scope.HCFADetailsInfo.PatientDetails.RelationshipToInsured = resp.data.RelationShipId || 0;

                    if (resp.data.AppointmentInsuranceDetails.length > 1) {
                        $scope.HCFADetailsInfo.InsuranceDetails.IsThereAnotherHealthBenefitPlan = "Yes";
                    } else {
                        $scope.HCFADetailsInfo.InsuranceDetails.IsThereAnotherHealthBenefitPlan = "No";
                    }

                    $scope.HCFADetailsInfo.InsuranceDetails.InsurancePersonName = resp.data.FirstName + " " + resp.data.Lastname || "";

                    $scope.HCFADetailsInfo.InsuranceDetails.MobileNo = $scope.HCFADetailsInfo.PatientDetails.ContactNo || "";
                    $scope.HCFADetailsInfo.InsuranceDetails.Gender = resp.data.Gender == "Female" ? "F" : "M";
                    // $scope.HCFADetailsInfo.InsuranceDetails.DOB = $filter('date')(resp.data.DOB, 'MM-dd-yyyy');
                    $scope.HCFADetailsInfo.InsuranceDetails.DOB = resp.data.DOB;
                    $scope.HCFADetailsInfo.InsuranceDetails.TelephoneCode = resp.data.CountryCode || "";

                    $scope.HCFADetailsInfo.OriginalRefNo = resp.data.PatientClaimNo || "";

                    if (resp.data.AppointmentInsuranceDetails.length > 0) {
                        $scope.HCFADetailsInfo.InsuranceDetails.InsuredPersonFirstName1 = resp.data.AppointmentInsuranceDetails[0].InsuredPersonFirstName || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.InsuredPersonMiddleName1 = resp.data.AppointmentInsuranceDetails[0].InsuredPersonMiddleName || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.InsuredPersonLastName1 = resp.data.AppointmentInsuranceDetails[0].InsuredPersonLastName || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.InsuredPersonGenderID1 = resp.data.AppointmentInsuranceDetails[0].InsuredPersonGenderID || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.PlanTypeId = resp.data.AppointmentInsuranceDetails[0].PlanTypeId || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.PayorPlanCode = resp.data.AppointmentInsuranceDetails[0].PayorPlanCode || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.PayorTypeId = resp.data.AppointmentInsuranceDetails[0].PayorTypeId || 0;
                        $scope.HCFADetailsInfo.InsuranceDetails.CoverageName = resp.data.AppointmentInsuranceDetails[0].CoverageName || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.PlanName = resp.data.AppointmentInsuranceDetails[0].PlanName || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.InsurancePayorName = resp.data.AppointmentInsuranceDetails[0].OrganizationPayorName || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.PolicyId = resp.data.AppointmentInsuranceDetails[0].PolicyId || "";

                    }

                    if (resp.data.AppointmentInsuranceDetails[1] != undefined) {
                        $scope.HCFADetailsInfo.InsuranceDetails.InsuredPersonFirstName2 = resp.data.AppointmentInsuranceDetails[1].InsuredPersonFirstName || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.InsuredPersonMiddleName2 = resp.data.AppointmentInsuranceDetails[1].InsuredPersonMiddleName || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.InsuredPersonLastName2 = resp.data.AppointmentInsuranceDetails[1].InsuredPersonLastName || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.InsuredPersonGenderID2 = resp.data.AppointmentInsuranceDetails[1].InsuredPersonGenderID || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.PayorName2 = resp.data.AppointmentInsuranceDetails[1].OrganizationPayorName || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.PlanName2 = resp.data.AppointmentInsuranceDetails[1].PlanName || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.OtherInsPolicyId = resp.data.AppointmentInsuranceDetails[1].PolicyId || "";
                    }


                    if (resp.data.CurrentResponsibilityId == 3 && $scope.PrimaryInsuranceId ==0) {
                        $scope.HCFADetailsInfo.InsuranceDetails.InsuredPersonFirstName2 = resp.data.AppointmentInsuranceDetails[0].InsuredPersonFirstName || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.InsuredPersonMiddleName2 = resp.data.AppointmentInsuranceDetails[0].InsuredPersonMiddleName || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.InsuredPersonLastName2 = resp.data.AppointmentInsuranceDetails[0].InsuredPersonLastName || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.InsuredPersonGenderID2 = resp.data.AppointmentInsuranceDetails[0].InsuredPersonGenderID || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.PayorName2 = resp.data.AppointmentInsuranceDetails[0].OrganizationPayorName || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.PlanName2 = resp.data.AppointmentInsuranceDetails[0].PlanName || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.OtherInsPolicyId = resp.data.AppointmentInsuranceDetails[0].PolicyId || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.PolicyGroupId = resp.data.AppointmentInsuranceDetails[0].GroupId || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.PolicyGroupname = resp.data.AppointmentInsuranceDetails[0].Groupname || "";

                        $scope.HCFADetailsInfo.InsuranceDetails.InsuredPersonFirstName1 = resp.data.AppointmentInsuranceDetails[1].InsuredPersonFirstName || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.InsuredPersonMiddleName1 = resp.data.AppointmentInsuranceDetails[1].InsuredPersonMiddleName || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.InsuredPersonLastName1 = resp.data.AppointmentInsuranceDetails[1].InsuredPersonLastName || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.InsuredPersonGenderID1 = resp.data.AppointmentInsuranceDetails[1].InsuredPersonGenderID || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.PlanTypeId = resp.data.AppointmentInsuranceDetails[1].PlanTypeId || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.PayorPlanCode = resp.data.AppointmentInsuranceDetails[1].PayorPlanCode || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.PayorTypeId = resp.data.AppointmentInsuranceDetails[1].PayorTypeId || 0;
                        $scope.HCFADetailsInfo.InsuranceDetails.CoverageName = resp.data.AppointmentInsuranceDetails[1].CoverageName || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.PlanName = resp.data.AppointmentInsuranceDetails[1].PlanName || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.InsurancePayorName = resp.data.AppointmentInsuranceDetails[1].OrganizationPayorName || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.PolicyId = resp.data.AppointmentInsuranceDetails[1].PolicyId || "";

                    }




                    if (resp.data.PatientClaimTransmission[0] != undefined) {
                        $scope.HCFADetailsInfo.InsuranceDetails.BillTypeFrequencyCode = resp.data.PatientClaimTransmission[0].BillTypeFrequencyCode || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.TransmissionMethodId = resp.data.PatientClaimTransmission[0].TransmissionMethodId || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.ReplacementControlNumber = resp.data.PatientClaimTransmission[0].ReplacementControlNumber || "";
                    }
                    if (resp.data.AppointmentInsuranceDetails.length > 0) {

                        let filtredArray = [];

                        if (InsType == "Primary") {
                            filtredArray = $filter("filter")(resp.data.AppointmentInsuranceDetails, { "PatientInsuranceDetailId": item.PrimaryInsuranceId }, true) || [];
                        } else if (InsType == "Secondary") {
                            filtredArray = $filter("filter")(resp.data.AppointmentInsuranceDetails, { "PatientInsuranceDetailId": item.SecondaryInsuranceId }, true) || [];
                        } else {
                            filtredArray = $filter("filter")(resp.data.AppointmentInsuranceDetails, { "PatientInsuranceDetailId": item.TransmitQueuePatientInsuranceId }, true) || [];
                        }


                        if (InsType == "Primary") {
                            filtredArray = $filter("filter")(resp.data.AppointmentInsuranceDetails, { "PatientInsuranceDetailId": item.PrimaryInsuranceId }, true) || [];
                        } else if (InsType == "Secondary") {
                            filtredArray = $filter("filter")(resp.data.AppointmentInsuranceDetails, { "PatientInsuranceDetailId": item.SecondaryInsuranceId }, true) || [];
                        } else {
                            filtredArray = $filter("filter")(resp.data.AppointmentInsuranceDetails, { "PatientInsuranceDetailId": item.TransmitQueuePatientInsuranceId }, true) || [];
                        }

                        if (filtredArray.length > 0) {
                            //  $scope.HCFADetailsInfo.TypeOfPayor = filtredArray[0].PayorName || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.PayorName = filtredArray[0].PayorName || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.Address = filtredArray[0].PayorAddress || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.Address1 = filtredArray[0].PayorAddress1 || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.Address2 = filtredArray[0].PayorAddress2 || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.PayorCityName = filtredArray[0].PayorCityName || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.PayorStateName = filtredArray[0].PayorStateName || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.PayorCountryName = filtredArray[0].PayorCountryName || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.PayorZipCode = filtredArray[0].PayorZipCode || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.PayorCode = filtredArray[0].PayorCode || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.PayorStateCode = filtredArray[0].PayorStateCode || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.UserTaxonomyCode = filtredArray[0].UserTaxonomyCode || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.PayorId = filtredArray[0].PayorId || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.GlobalPayorId = filtredArray[0].GlobalPayorId || "";

                            $scope.HCFADetailsInfo.PatientDetails.DoctorName = filtredArray[0].DoctorName || "";
                            $scope.HCFADetailsInfo.PatientDetails.RelationName = filtredArray[0].RelationName || "";
                            $scope.HCFADetailsInfo.PatientDetails.RelationShipId = filtredArray[0].RelationShipId || "";
                            $scope.HCFADetailsInfo.PatientDetails.AppointmentDate = $filter('date')(filtredArray[0].AppointmentDate, 'MM-dd-yyyy') || "";
                            $scope.HCFADetailsInfo.PatientDetails.InsuranceTypeCode = filtredArray[0].InsuranceTypeCode || "";

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

                    var IsSecondaryChargeEditedClaim = resp.data.IsSecondaryChargeEditedClaim || false;


                    //$scope.HCFADetailsInfo.TotalCharges = resp.data.TotalClaimAmount;
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

                            if (mainitem.IsSecondaryChargeEdited) {
                                mainitem.UnitCharge = mainitem.SecondaryUnitCharge;
                                mainitem.TotalChargeAmount = mainitem.SecondaryTotalChargeAmount;
                            }
                            ProcedureListArray.push(mainitem);
                        });
                    }


                    $scope.HCFADetailsInfo.RenderingProviderId = resp.data.RenderingProviderId || null;


                    if ($scope.HCFADetailsInfo.RenderingProviderId != null) {
                        let doctorobj = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.HCFADetailsInfo.RenderingProviderId }, true)[0] || {};
                        $scope.HCFADetailsInfo.TaxonomyCode = angular.copy(doctorobj.TaxonomyCode) || '';
                    }

                    if (ProcedureListArray.length > 0) {
                        angular.forEach(ProcedureListArray, function (pitem) {

                            //pitem.Modifier1 = pitem.Modifier1 || "";
                            //pitem.Modifier2 = pitem.Modifier2 || "";
                            //pitem.Modifier3 = pitem.Modifier3 || "";
                            //pitem.Modifier4 = pitem.Modifier4 || "";

                            var ModifierString = "";
                            //if (ModifierString != "" && pitem.Modifier2 != "") {
                            //    ModifierString = ModifierString + ", " + pitem.Modifier2;
                            //} else {
                            //    ModifierString = ModifierString + pitem.Modifier2;
                            //}
                            //if (ModifierString != "" && pitem.Modifier3 != "") {
                            //    ModifierString = ModifierString + ", " + pitem.Modifier3;
                            //} else {
                            //    ModifierString = ModifierString + pitem.Modifier3;
                            //}
                            //if (ModifierString != "" && pitem.Modifier4 != "") {
                            //    ModifierString = ModifierString + ", " + pitem.Modifier4;
                            //} else {
                            //    ModifierString = ModifierString + pitem.Modifier4;
                            //}
                            ['Modifier1', 'Modifier2', 'Modifier3', 'Modifier4'].forEach(function (m) {
                                pitem[m] = (pitem[m] || "").replace(/[\n\r]/g, "").trim();
                            });

                            var modifiers = [
                                pitem.Modifier1,
                                pitem.Modifier2,
                                pitem.Modifier3,
                                pitem.Modifier4
                            ].filter(x => x);

                            var ModifierString = modifiers.join(", ");
                            pitem.DiagnosisIds = pitem.DiagnosisIds || [];
                            pitem.DiagnosisPointer = GetDiagnosisPointer(pitem.DiagnosisIds);

                            //var IntegerNumber = Math.floor(pitem.TotalChargeAmount); 
                            //var DecimalNumber = Math.round((pitem.TotalChargeAmount - IntegerNumber) * 100);
                              //CommentedBy Durga as on 07-04-2026
                           // var amount = Number(pitem.TotalChargeAmount).toFixed(2);


                            var lineItemchargeAmount = parseFloat(pitem.Quantity) * parseFloat(pitem.UnitCharge);
                            if (resp.data.IsSecondaryChargeEditedClaim && resp.data.CurrentResponsibilityId === 3) {
                                if (pitem.IsSecondaryChargeEdited && pitem.SecondaryUnitCharge > 0) {
                                    lineItemchargeAmount = parseFloat(pitem.Quantity) * parseFloat(pitem.SecondaryUnitCharge);
                                }
                            }
                          
                           
                            var amount = Number(lineItemchargeAmount).toFixed(2);

                            $scope.HCFADetailsInfo.TotalCharges += lineItemchargeAmount;

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
                                "Charges": lineItemchargeAmount || 0,
                                "IntegerNumber": $scope.IntegerNumber || 0,
                                "DecimalNumber": $scope.DecimalNumber || 0,
                                "Charges1": $scope.DecimalNumber,
                                // "DaysOrUnits": pitem.Multiplyfactor || "",
                                "DaysOrUnits": pitem.Quantity || "",
                                "EPSDTFamilyPlan": "",
                                "IdQual": "",
                                "RenderingProviderId": resp.data.RenderingProviderId || "",
                                "RenderingProviderNPI": resp.data.RenderingProviderNPI || "",
                                "BillingProviderNPI": resp.data.BillingProviderNPI || "",
                                "PayorPlanCode": $scope.HCFADetailsInfo.InsuranceDetails.PayorPlanCode || 0,
                                "PayorTypeId": $scope.HCFADetailsInfo.InsuranceDetails.PayorTypeId || 0,
                                "UserTaxonomyCode": $scope.HCFADetailsInfo.TaxonomyCode || "",
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
                        $scope.HCFADetailsInfo.RenderingProviderName = resp.data.RenderingProviderName || '';
                    }


                    //$scope.HCFADetailsInfo.PostalAddress1 = resp.data.PostalAddress1;
                    //$scope.HCFADetailsInfo.PostalAddress2 = resp.data.PostalAddress2;
                    //$scope.HCFADetailsInfo.PostalZipCode = resp.data.PostalZipCode || "";
                    //$scope.HCFADetailsInfo.PostalCityName = resp.data.PostalCityName || "";
                    //$scope.HCFADetailsInfo.PostalStateName = resp.data.PostalStateName || "";
                    //$scope.HCFADetailsInfo.PostalStateCode = resp.data.PostalStateCode || "";

                    //   $scope.HCFADetailsInfo.PostalAddress1 = resp.data.PostalAddress1;
                    //   $scope.HCFADetailsInfo.PostalAddress2 = resp.data.PostalAddress2;
                    //   $scope.HCFADetailsInfo.PostalZipCode = resp.data.PostalZipCode || "";
                    //   $scope.HCFADetailsInfo.PostalCityName = resp.data.PostalCityName || "";
                    //   $scope.HCFADetailsInfo.PostalStateName = resp.data.PostalStateName || "";
                    //   $scope.HCFADetailsInfo.PostalStateCode = resp.data.PostalStateCode || "";
                    //   $scope.HCFADetailsInfo.BillingProviderSSN = resp.data.BillingProviderSSN;
                    //   $scope.HCFADetailsInfo.BillingProviderNPI = resp.data.BillingProviderNPI;                    
                    //   $scope.HCFADetailsInfo.BillingProviderName = resp.data.BillingProviderName;
                    //   $scope.HCFADetailsInfo.Box33GroupName = resp.data.BillingProviderName||"";
                    ////   $scope.HCFADetailsInfo.BillingProviderTaxId = resp.data.BillingProviderTaxId || '';
                    //   $scope.HCFADetailsInfo.BillingProviderTaxId = resp.data.BillingProviderTaxId || '';
                    //   $scope.HCFADetailsInfo.Box33GroupNPI = resp.data.BillingProviderNPI || '';
                    //   $scope.HCFADetailsInfo.BillingProviderTaxonomyId = resp.data.BillingProviderTaxonomyId || '';

                    //   $scope.HCFADetailsInfo.BillingProviderContactNumber = resp.data.BillingProviderContactNumber || '';
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

                    $scope.HCFADetailsInfo.CurrentDate = $filter('date')(resp.data.AdmissionDate, "MM/dd/yyyy");

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
                    //    $scope.HCFADetailsInfo.TaxonomyCode = angular.copy(doctorobj.TaxonomyCode)||'';
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
                        $scope.CMSPrintPopUp('withline');
                        //        eHnotePrintService.generateHCFAPrintUS($scope.HCFADetailsInfo, "withline");
                        //$scope.HCFADetailsInfo.printtype = "withTemplate";

                    } else {
                        //eHnotePrintService.generateHCFAPrintUS($scope.HCFADetailsInfo, "withoutline");
                        /* eHnotePrintService.generateWithoutLineHCFAPrintUS($scope.HCFADetailsInfo);*/
                        $scope.CMSPrintPopUp('withoutline');
                        //$scope.generateRedFormPrint();
                        //$scope.HCFADetailsInfo.printtype = "withOutTemplate";

                    }

                } else {
                    alertify.error(resp.data.Message);
                }
            }, function (error) {

            });
        }
        function openPdf(response) {
            var blob = new Blob([response.data], { type: 'application/pdf' });
            var url = URL.createObjectURL(blob);
            window.open(url);
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
        //$scope.Dobobj = {
        //    "D": '',
        //    "M": '',
        //    "Y": '',
        //}
        $scope.CMSPrintPopUp = function (type) {
            $scope.PatientDetailsForCMSPrintOBJ = angular.copy(GetPatientDetailsForCMSPrintOBJ());

            $scope.Dobobj = {
                "D": '',
                "M": '',
                "Y": ''
            }

            var patient_Name = ""; //"K" +" "+ "Kumar" +" "+"Varma";
            var patient_Title = "";
            var patient_fullname = "";
            var patient_FirstName = "";
            var patient_MiddleName = "";
            var patient_LastName = "";
            var patient_SecondLastName = "";
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
                var dateofbirth = ""; var month = "  "; var year = "  "; var date = ""; var yes = " [] "; var no = " [] ";
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
                var dateofbirth = ""; var month = "  "; var year = "  "; var date = ""; var yes = " [] "; var no = " [] ";
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
                var dateofbirth = ""; var month = "  "; var year = "  "; var date = ""; var yes = " [] "; var no = " [] ";
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
                var dateofbirth = ""; var month = "  "; var year = "  "; var date = ""; var yes = " [] "; var no = " [] ";
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
            /*$scope.HCFADetailsInfo.CurrentDate = $filter('date')(new Date(), "MM/dd/yyyy");*/

            $scope.PatientDetailsForCMSPrintOBJ.IsEmplNo = false;
            $scope.PatientDetailsForCMSPrintOBJ.IsAutoNo = false;
            $scope.PatientDetailsForCMSPrintOBJ.ISOtherAccNo = false;

            if ($scope.HCFADetailsInfo.datesPatientUnabletoWorkincurrentoccupation != "") {
                var D = $scope.HCFADetailsInfo.datesPatientUnabletoWorkincurrentoccupation.FormDate || "";
                if (D != "") {
                    var dateofbirth = ""; var month = "  "; var year = "  "; var date = ""; var yes = " [] "; var no = " [] ";
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
                    var dateofbirth = ""; var month = "  "; var year = "  "; var date = ""; var yes = " [] "; var no = " [] ";
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
                    var dateofbirth = ""; var month = "  "; var year = "  "; var date = ""; var yes = " [] "; var no = " [] ";
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
                    var dateofbirth = ""; var month = "  "; var year = "  "; var date = ""; var yes = " [] "; var no = " [] ";
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
            var charge = "";
            var charges1 = "";
            var charges2 = "";
            var charge1 = "";
            var decimalCharge = "";
            var decimalPayment = "";
            var NUCCcharge1 = "";
            var Amountcharge1 = "";
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

                // a = totaldetails.ServiceFacilityLocationInformation.a || "";
                //a = $scope.HCFADetailsInfo.FacilityNPI || "";
                //b = $scope.HCFADetailsInfo.ServiceFacilityLocationInformation.b || "";
            }
            $scope.HCFADetailsInfo.sign = sign || '';
            var billingprovider = "";
            var postaladdress1 = "";
            var postaladdress2 = "";
            var billingproviderssn = "";
            var billingprovidernpi = "";
            var BillProviderTaxId = "";
            var BillingProviderContactNumber = "";
            var stateadress = "";
            billingprovider = $scope.HCFADetailsInfo.Box33GroupName;
            postaladdress1 = $scope.HCFADetailsInfo.PostalAddress1;
            postaladdress2 = $scope.HCFADetailsInfo.PostalAddress2;
            billingproviderssn = $scope.HCFADetailsInfo.BillingProviderSSN;
            // billingprovidernpi = PatientDeatils.BillingProviderNPI;
            billingprovidernpi = $scope.HCFADetailsInfo.Box33GroupNPI;
            BillProviderTaxId = $scope.HCFADetailsInfo.BillingProviderTaxonomyId;
            BillingProviderContactNumber = $scope.HCFADetailsInfo.BillingProviderContactNumber;
            if ($scope.HCFADetailsInfo.PostalCityName != "") {
                stateadress = $scope.HCFADetailsInfo.PostalCityName + ", " + $scope.HCFADetailsInfo.PostalStateCode;
            } else {
                stateadress = $scope.HCFADetailsInfo.PostalStateCode;
            }
            var bodyItem = [];
            var invitem1 = [];
            var Medicare = "[]"; var Medicaid = "[]"; var Tricare = "[]"; var Champva = "[]"; var GroupHealthPlan = "[]"; var FecaBlklung = "[]"; var Other = "[]";
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
            //let modalInstance = $uibModal.open({
            //    templateUrl: 'CMS-1500USPrint.html',
            //    backdrop: 'static',
            //    keyboard: false,
            //    size: 'lg',
            //    "scope": $scope,
            //});
            //modalInstance.rendered.then(function () {
            //$scope.Isopen = true;

            //$rootScope.$broadcast("loader_show");

            //$timeout(function () {

            //    var page1 = '';
            //    if (type =='withline') {
            //        page1 = document.getElementById('PrintIndtransPopupNew').innerHTML;
            //        var innerContents = `<div class="print-page">${page1}</div>`;
            //        var popupWin = window.open('', '_blank');
            //        popupWin.document.open();
            //        popupWin.document.write(`<html lang="en"><head><meta charset="UTF-8"/><title>CMS-1500 Print Layout</title><style>@font-face{font-family:'EHHelvetica';src:url('..//fonts/Helvetica.ttf')format('truetype'),url('/fonts/helvetica-bold.ttf')format('truetype');font-weight:400;font-style:normal;font-display:swap;} :root{--page-width:8.5in;--page-height:11in;--screen-scale:1;--print-scale:1;--border-color:#d02b2b;--text-color:#E72428;--font-size-base:9px;--line-height-base:1.2;} *{box-sizing:border-box;} html,body{margin:0;padding:0;background:#eee;font-family:'EHHelvetica',Arial,sans-serif;} body{display:flex;justify-content:center;align-items:flex-start;min-height:100vh;padding:1rem;} .page-wrapper{transform:scale(var(--screen-scale));transform-origin:top left;} .cms1500-page{width:var(--page-width);height:var(--page-height);background:#fff;position:relative;color:var(--text-color);font-size:var(--font-size-base);line-height:var(--line-height-base);} td{padding:0;} @media print{body{background:#fff;padding:0;margin:0;display:block;} .page-wrapper{transform:scale(var(--print-scale));transform-origin:top left;} .cms1500-page{margin:0;}}</style></head><body>${innerContents}</body></html>`);
            //        popupWin.document.close();




            //    } else if (type == 'withoutline') {
            //        page1 = document.getElementById('CMSPRINTWITHOUTOUTLINE').innerHTML;
            //        var innerContents = `<div class="print-page">${page1}</div>`;
            //        var popupWin = window.open('', '_blank');
            //        popupWin.document.open();
            //        popupWin.document.write(`<html lang="en"><head><meta charset="UTF-8"/><title>CMS-1500 Print Layout</title><style>@font-face{font-family:'EHHelvetica';src:url('..//fonts/Helvetica.ttf') format('truetype'),url('/fonts/helvetica-bold.ttf') format('truetype');font-weight:400;font-style:normal;font-display:swap}:root{--page-width:8.5in;--page-height:11in;--screen-scale:1;--print-scale:1;--border-color:#d02b2b;--text-color:#E72428;--font-size-base:9px;--line-height-base:1.2}*{box-sizing:border-box}html,body{margin:0;padding:0;background:#eee;font-family:'EHHelvetica',Arial,sans-serif}body{display:flex;justify-content:center;align-items:flex-start;min-height:100vh}.page-wrapper{transform:scale(var(--screen-scale));transform-origin:top left}.cms1500-page{width:var(--page-width);height:var(--page-height);background:#fff;position:relative;color:var(--text-color);font-size:var(--font-size-base);line-height:var(--line-height-base)}td{padding:0}@media print{body{background:#fff;padding:0;margin:0;display:block}.page-wrapper{transform:scale(var(--print-scale));transform-origin:top left}.cms1500-page{margin:0}}@page{margin:0;size:Letter;padding:18.1px 24px}.lh1e{font-family:Helvetica;font-style:normal;font-weight:400;line-height:normal;letter-spacing:-0.04px}.l1E{display:block;color:#fff;font-family:Helvetica;font-size:8px;font-style:normal;font-weight:400;line-height:normal;letter-spacing:-0.04px;height:10px}.lh2e{color:#fff;font-family:Helvetica;font-size:8px;font-style:normal;font-weight:400;line-height:normal;letter-spacing:-0.04px;height:14px}.lh2en{color:#fff;font-family:Helvetica;font-size:8px;font-style:normal;font-weight:400;line-height:normal;letter-spacing:-0.04px}.lh22e{color:#fff;font-family:Helvetica;font-size:8px;font-style:normal;font-weight:400;line-height:1;letter-spacing:-0.04px;display:block;font-style:italic}.box-E{display:flex;width:18px;height:18px;border:1PX solid #fff;font-size:14px;align-items:center;justify-content:center}.d__f--{display:flex}.d__b--{display:block}.fd__c--{flex-direction:column}.ai__c--{align-items:center}.ai__fe--{align-items:flex-end}.jc__c--{justify-content:center}.jc__sb--{justify-content:space-between}.fs__8--{font-size:8px}.tc__000--{color:#000}.tc__fff--{color:#fff}.w__16--{width:16px}.w__26--{width:26px}.txt__data--{color:#0062FF;font-family:Arial;font-size:13px;font-style:normal;font-weight:400;line-height:normal}.lh2ae{display:inline-block;color:#fff;font-family:Helvetica;font-size:8px;font-style:normal;font-weight:400;line-height:normal;letter-spacing:-0.04px}.py__2--{padding-top:2px;padding-bottom:2px}.py__5--{padding-top:5px;padding-bottom:5px}.w__31--{width:31px}.t__c--{text-align:center}</style></head><body>${innerContents}</body></html>`);
            //        popupWin.document.close();

            //    }
            //    if (page1 == '') {
            //        console.log('Html Not Renderd');
            //        return;
            //    }


            //        //popupWin.document.write(`<html><head><link rel="stylesheet" href="css/billing.css" /><style>@media print {.print-page {page-break-after: always !important; page-break-before: always !important;} table {page-break-inside: auto !important;} tr {page-break-inside: avoid !important;} td {page-break-inside: avoid !important;}}</style></head><body onload="window.print()">${innerContents}</body></html>`);
            //      //  popupWin.document.write(innerContents);
            //    $rootScope.$broadcast("loader_hide");

            //   // $scope.Isopen = false;
            //    //    modalInstance.dismiss('Cancel');
            //    //    $scope.PatientPaymentObj.IsDepositPrint = false;
            //    }, 1000);
            //    });


            if (type == 'withline') {
                $scope.HCFADetailsInfo.printtype = "withTemplate";
            } else if (type == "withoutline") {
                $scope.HCFADetailsInfo.printtype = "withOutTemplate";

            }

            eHnoteMainAppointmentService.GenerateCMS1500FromHCFA($scope.HCFADetailsInfo, type)
                .then(openPdf);


        }
        $scope.HospitalAddressArray = [];
        if (doctorinfo.doctordata.UserAddress[0] !== undefined) {
            $scope.HospitalAddressArray = doctorinfo.doctordata.UserAddress[0];
        }
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
        $scope.HospitalAddressArray.OrganizationLogoUrl = $scope.HospitalAddressArray.OrganizationLogoUrl || '';
        if ($scope.HospitalAddressArray.OrganizationLogoUrl != '') {
            $scope.toDataURL($scope.HospitalAddressArray.OrganizationLogoUrl, function (dataURL) {
                $scope.HospitalAddressArray.OrganizationBase64 = dataURL;
            });
        }


        $scope.GetPatientDetailsForUBformDetailsinBiller = function (item, type, InsType) {

            //item.PatientClaimId = item.PatientClaimId || 0;
            InsType = InsType || "";
            if (InsType == 'Primary') {
                $scope.PrimaryInsuranceId = item.PrimaryInsuranceId;
                $scope.SecondryInsuranceId = 0;
            } else {
                $scope.SecondryInsuranceId = item.SecondaryInsuranceId;
                $scope.PrimaryInsuranceId = 0;
            }
            var obj = {
                //"PatientInsuranceDetailId": $scope.PatientInsuranceDetailId,
                "PatientClaimId": item.PatientClaimId,
                "PrimaryInsuranceId": $scope.PrimaryInsuranceId,
                "SecondryInsuranceId": $scope.SecondryInsuranceId || 0
            }
            eHnoteInsuranceService.GetParticularClaimPrintDetails(obj).then(function (resp) {

                if (resp.data.status == "Success") {
                    var currentdate = $filter('date')(new Date(), 'MM-dd-yyyy');
                    $scope.UBDetailsInfo = eHnoteCacheStorageService.GetUBStorageStructure();
                    $scope.UBDetailsInfo.Patient = angular.copy(resp.data);
                    $scope.UBDetailsInfo.Patient.FirstName = resp.data.FirstName;
                    $scope.UBDetailsInfo.Patient.LastName = resp.data.Lastname;
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

                    //$scope.UBDetailsInfo.BillingProviderobj.PhysicalAddress1 = resp.data.PhysicalAddress1 || "";
                    //$scope.UBDetailsInfo.BillingProviderobj.PhysicalAddress2 = resp.data.PhysicalAddress2 || "";
                    //$scope.UBDetailsInfo.BillingProviderobj.PostalAddress1 = resp.data.PostalAddress1 || "";
                    //$scope.UBDetailsInfo.BillingProviderobj.PostalAddress2 = resp.data.PostalAddress2 || "";

                    //$scope.UBDetailsInfo.BillingProviderobj.PhysicalCityName = resp.data.PhysicalCityName;
                    //$scope.UBDetailsInfo.BillingProviderobj.PhysicalStateName = resp.data.PhysicalStateName;
                    //$scope.UBDetailsInfo.BillingProviderobj.PhysicalStateCode = resp.data.PhysicalStateCode;
                    //$scope.UBDetailsInfo.BillingProviderobj.PhysicalZipCode = resp.data.PhysicalZipCode;
                    ////$scope.UBDetailsInfo.BillingProviderobj.ContactMobileNumber = resp.data.BillingProviderContactNumber || "";
                    //if (resp.data.BillingProviderContactNumber!='') {
                    //    var obj = eHnoteUserDataService.UsMobileFormatChange(resp.data.BillingProviderContactNumber);
                    //    $scope.UBDetailsInfo.BillingProviderobj.ContactMobileNumber = obj.UsFormatMobileNumber;
                    //}
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
                                    mitem.PriorPayments = resp.data.TotalBalance || "";
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
                                    mitem.Box78Type = aitem.Box78Type || "";
                                    mitem.Box78TypeId = aitem.Box78TypeId || "";
                                    mitem.Box79Type = aitem.Box79Type || "";
                                    mitem.Box79TypeId = aitem.Box79TypeId || "";
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


                        //if ($scope.UBDetailsInfo.Box79Type == "Billing Provider") {
                        //    var filterProviderList = $filter("filter")($scope.ClaimProviderList, { "OrganizationBillingProviderId": $scope.UBDetailsInfo.Box79ValueId })[0] || [];
                        //    $scope.UBDetailsInfo.Box79FirstName = filterProviderList.BillingProviderName;
                        //    $scope.UBDetailsInfo.Box79LastName = '';
                        //}
                        //else if ($scope.UBDetailsInfo.Box79Type == "Rendering Provider") {

                        //    var filterDoctorList = $filter("filter")($scope.mainBillerDataObj.AllDoctorsList, { "DoctorID": $scope.UBDetailsInfo.Box79ValueId })[0] || [];
                        //    $scope.UBDetailsInfo.Box79FirstName = filterDoctorList.FirstName;
                        //    $scope.UBDetailsInfo.Box79LastName = filterDoctorList.LastName;
                        //}
                        //else if ($scope.UBDetailsInfo.Box79Type == "Facility") {
                        //    var filterOrgFacilityList = $filter("filter")($scope.OrganizationFacilityList, { "OrganizationFacilityId": $scope.UBDetailsInfo.Box79ValueId })[0] || [];
                        //    $scope.UBDetailsInfo.Box79FirstName = filterOrgFacilityList.FacilityName;
                        //    $scope.UBDetailsInfo.Box79LastName = '';
                        //} else {

                        //}

                        $scope.UBDetailsInfo.Box80Value = resp.data.AppointmentInsuranceDetails[0].Box80Value || "";


                    }
                    else if (resp.data.CurrentResponsibilityId == 3) {
                        $scope.UBDetailsInfo.PayorName = resp.data.AppointmentInsuranceDetails[1].PayorName || "";
                        $scope.UBDetailsInfo.PayorAddress1 = resp.data.AppointmentInsuranceDetails[1].PayorAddress1 || "";
                        $scope.UBDetailsInfo.PayorAddress2 = resp.data.AppointmentInsuranceDetails[1].PayorAddress2 || "";
                        $scope.UBDetailsInfo.PayorCityName = resp.data.AppointmentInsuranceDetails[1].PayorCityName || "";
                        $scope.UBDetailsInfo.PayorStateName = resp.data.AppointmentInsuranceDetails[1].PayorStateName || "";
                        $scope.UBDetailsInfo.PayorZipCode = resp.data.AppointmentInsuranceDetails[1].PayorZipCode || "";


                        $scope.UBDetailsInfo.InsuranceDetails.InsuredsName = $scope.UBDetailsInfo.InsuranceDetails[1].InsuredsName || "";
                        $scope.UBDetailsInfo.IInsuredsName = $scope.UBDetailsInfo.InsuranceDetails[1].InsuredsName || "";

                        $scope.UBDetailsInfo.InsuranceDetails.PatientRelationship = $scope.UBDetailsInfo.InsuranceDetails[1].PatientRelationship || "";
                        $scope.UBDetailsInfo.IPatientRelationship = $scope.UBDetailsInfo.InsuranceDetails[1].PatientRelationship || "";
                        $scope.UBDetailsInfo.InsuranceDetails.InsuredsUniqueIdentifier = $scope.UBDetailsInfo.InsuranceDetails[1].InsuredsUniqueIdentifier || "";
                        $scope.UBDetailsInfo.IInsuredsUniqueIdentifier = $scope.UBDetailsInfo.InsuranceDetails[1].InsuredsUniqueIdentifier || "";
                        $scope.UBDetailsInfo.InsuredsUniqueIdentifier = $scope.UBDetailsInfo.InsuranceDetails[1].InsuredsUniqueIdentifier || "";
                        $scope.UBDetailsInfo.InsuranceDetails.InsuredsGroupName = $scope.UBDetailsInfo.InsuranceDetails[1].InsuredsGroupName || "";
                        $scope.UBDetailsInfo.IInsuredsGroupName = $scope.UBDetailsInfo.InsuranceDetails[1].InsuredsGroupName || "";
                        $scope.UBDetailsInfo.InsuranceDetails.InsuranceGroupNumber = $scope.UBDetailsInfo.InsuranceDetails[1].InsuranceGroupNumber || "";
                        $scope.UBDetailsInfo.IInsuranceGroupNumber = $scope.UBDetailsInfo.InsuranceDetails[1].InsuranceGroupNumber || "";

                        $scope.UBDetailsInfo.InsuranceDetails.AssignmentofBenefits = $scope.UBDetailsInfo.InsuranceDetails[1].AssignmentofBenefits || "";
                        $scope.UBDetailsInfo.InsuranceDetails.DocumentControlNumber = $scope.UBDetailsInfo.InsuranceDetails[1].DocumentControlNumber || "";
                        $scope.UBDetailsInfo.InsuranceDetails.OrganizationPayorName = $scope.UBDetailsInfo.InsuranceDetails[1].OrganizationPayorName || "";
                        $scope.UBDetailsInfo.IOrganizationPayorName = $scope.UBDetailsInfo.InsuranceDetails[1].OrganizationPayorName || "";

                       /* $scope.UBDetailsInfo.IOrganizationPayorName = $scope.UBDetailsInfo.InsuranceDetails[0].OrganizationPayorName || "";*/

                        $scope.UBDetailsInfo.InsuranceDetails.OrganizationPlanId = $scope.UBDetailsInfo.InsuranceDetails[1].OrganizationPlanId || "";
                        $scope.UBDetailsInfo.InsuranceDetails.OrganizationPlanName = $scope.UBDetailsInfo.InsuranceDetails[1].OrganizationPlanName || "";
                        $scope.UBDetailsInfo.InsuranceDetails.PatientRelationship = $scope.UBDetailsInfo.InsuranceDetails[1].PatientRelationship || "";
                        $scope.UBDetailsInfo.InsuranceDetails.PayorId = $scope.UBDetailsInfo.InsuranceDetails[1].PayorId || "";
                        $scope.UBDetailsInfo.IPayorId = $scope.UBDetailsInfo.InsuranceDetails[1].PayorId || "";

                        $scope.UBDetailsInfo.InsuranceDetails.EstimatedAmountDue = $scope.UBDetailsInfo.InsuranceDetails[1].EstimatedAmountDue || "";
                        $scope.UBDetailsInfo.InsuranceDetails.TreatmentAuthorizationCodes = $scope.UBDetailsInfo.InsuranceDetails[1].TreatmentAuthorizationCodes || "";
                        $scope.UBDetailsInfo.InsuranceDetails.EmployerName = $scope.UBDetailsInfo.InsuranceDetails[1].EmployerName || "";
                        $scope.UBDetailsInfo.IEmployerName = $scope.UBDetailsInfo.InsuranceDetails[1].EmployerName || "";
                        $scope.UBDetailsInfo.InsuranceDetails.PayerClaimNumber = $scope.UBDetailsInfo.InsuranceDetails[1].PayerClaimNumber || "";
                        $scope.UBDetailsInfo.IPayerClaimNumber = $scope.UBDetailsInfo.InsuranceDetails[1].PayerClaimNumber || "";


                        $scope.UBDetailsInfo.Box4Value2 = resp.data.AppointmentInsuranceDetails[1].Box4Value2 || "";
                        $scope.UBDetailsInfo.Box4ValueId2 = resp.data.AppointmentInsuranceDetails[1].Box4ValueId2 || "";
                        $scope.UBDetailsInfo.Box4Value3 = resp.data.AppointmentInsuranceDetails[1].Box4Value3 || "";
                        $scope.UBDetailsInfo.Box4ValueId3 = resp.data.AppointmentInsuranceDetails[1].Box4ValueId3 || "";
                        $scope.UBDetailsInfo.Box4Value4 = resp.data.AppointmentInsuranceDetails[1].Box4Value4 || "";
                        $scope.UBDetailsInfo.Box4ValueId4 = resp.data.AppointmentInsuranceDetails[1].Box4ValueId4 || "";

                        $scope.UBDetailsInfo.Box14ValueId = resp.data.AppointmentInsuranceDetails[1].Box14ValueId || "";
                        $scope.UBDetailsInfo.Box14Value = resp.data.AppointmentInsuranceDetails[1].Box14Value || "";
                        $scope.UBDetailsInfo.Box14ValueCode = resp.data.AppointmentInsuranceDetails[1].Box14ValueCode || "";
                        $scope.UBDetailsInfo.Box15ValueId = resp.data.AppointmentInsuranceDetails[1].Box15ValueId || "";
                        $scope.UBDetailsInfo.Box15Value = resp.data.AppointmentInsuranceDetails[1].Box15Value || "";
                        $scope.UBDetailsInfo.Box15ValueCode = resp.data.AppointmentInsuranceDetails[1].Box15ValueCode || "";

                        $scope.UBDetailsInfo.Box79Type = resp.data.AppointmentInsuranceDetails[1].Box79Type || "";
                        $scope.UBDetailsInfo.Box79TypeId = resp.data.AppointmentInsuranceDetails[1].Box79TypeId || "";
                        $scope.UBDetailsInfo.Box79Value = resp.data.AppointmentInsuranceDetails[1].Box79Value || "";
                        $scope.UBDetailsInfo.Box79ValueId = resp.data.AppointmentInsuranceDetails[1].Box79ValueId || "";
                        $scope.UBDetailsInfo.Box79ValueNPI = resp.data.AppointmentInsuranceDetails[1].Box79ValueNPI || "";
                        $scope.UBDetailsInfo.IsBox80Checked = resp.data.AppointmentInsuranceDetails[1].IsBox80Checked || "";

                        if ($scope.UBDetailsInfo.Box79TypeId == 3) {
                            $scope.UBDetailsInfo.FacilityName = resp.data.FacilityName || '';
                            $scope.UBDetailsInfo.FacilityNPI = resp.data.FacilityNPI || '';
                        }



                        $scope.UBDetailsInfo.TotalPatientPayment = resp.data.TotalPatientPayment || 0;

                        //if ($scope.UBDetailsInfo.Box79Type == "Billing Provider") {
                        //    var filterProviderList = $filter("filter")($scope.ClaimProviderList, { "OrganizationBillingProviderId": $scope.UBDetailsInfo.Box79TypeId })[0] || [];
                        //    $scope.UBDetailsInfo.Box79FirstName = filterProviderList.BillingProviderName;
                        //    $scope.UBDetailsInfo.Box79LastName = '';
                        //}
                        //else if ($scope.UBDetailsInfo.Box79Type == "Rendering Provider") {

                        //    var filterDoctorList = $filter("filter")($scope.mainBillerDataObj.AllDoctorsList, { "DoctorID": $scope.UBDetailsInfo.Box79TypeId })[0] || [];
                        //    $scope.UBDetailsInfo.Box79FirstName = filterDoctorList.FirstName;
                        //    $scope.UBDetailsInfo.Box79LastName = filterDoctorList.LastName;
                        //}
                        //else if ($scope.UBDetailsInfo.Box79Type == "Facility") {
                        //    var filterOrgFacilityList = $filter("filter")($scope.OrganizationFacilityList, { "OrganizationFacilityId": $scope.UBDetailsInfo.Box79TypeId })[0] || [];
                        //    $scope.UBDetailsInfo.Box79FirstName = filterOrgFacilityList.FacilityName;
                        //    $scope.UBDetailsInfo.Box79LastName = '';
                        //} else {

                        //}

                        $scope.UBDetailsInfo.Box80Value = resp.data.AppointmentInsuranceDetails[1].Box80Value || "";


                    }
                    else {
                        $scope.UBDetailsInfo.PayorName = resp.data.AppointmentInsuranceDetails[2].PayorName || "";
                        $scope.UBDetailsInfo.PayorAddress1 = resp.data.AppointmentInsuranceDetails[2].PayorAddress1 || "";
                        $scope.UBDetailsInfo.PayorAddress2 = resp.data.AppointmentInsuranceDetails[2].PayorAddress2 || "";
                        $scope.UBDetailsInfo.PayorCityName = resp.data.AppointmentInsuranceDetails[2].PayorCityName || "";
                        $scope.UBDetailsInfo.PayorStateName = resp.data.AppointmentInsuranceDetails[2].PayorStateName || "";
                        $scope.UBDetailsInfo.PayorZipCode = resp.data.AppointmentInsuranceDetails[2].PayorZipCode || "";

                        $scope.UBDetailsInfo.InsuranceDetails.InsuredsName = $scope.UBDetailsInfo.InsuranceDetails[2].InsuredsName || "";
                        $scope.UBDetailsInfo.IInsuredsName = $scope.UBDetailsInfo.InsuranceDetails[2].InsuredsName || "";

                        $scope.UBDetailsInfo.InsuranceDetails.PatientRelationship = $scope.UBDetailsInfo.InsuranceDetails[2].PatientRelationship || "";
                        $scope.UBDetailsInfo.IPatientRelationship = $scope.UBDetailsInfo.InsuranceDetails[2].PatientRelationship || "";
                        $scope.UBDetailsInfo.InsuranceDetails.InsuredsUniqueIdentifier = $scope.UBDetailsInfo.InsuranceDetails[2].InsuredsUniqueIdentifier || "";
                        $scope.UBDetailsInfo.IInsuredsUniqueIdentifier = $scope.UBDetailsInfo.InsuranceDetails[2].InsuredsUniqueIdentifier || "";
                        $scope.UBDetailsInfo.InsuredsUniqueIdentifier = $scope.UBDetailsInfo.InsuranceDetails[2].InsuredsUniqueIdentifier || "";
                        $scope.UBDetailsInfo.InsuranceDetails.InsuredsGroupName = $scope.UBDetailsInfo.InsuranceDetails[2].InsuredsGroupName || "";
                        $scope.UBDetailsInfo.IInsuredsGroupName = $scope.UBDetailsInfo.InsuranceDetails[2].InsuredsGroupName || "";
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

                        $scope.UBDetailsInfo.Box4Value2 = resp.data.AppointmentInsuranceDetails[2].Box4Value2 || "";
                        $scope.UBDetailsInfo.Box4ValueId2 = resp.data.AppointmentInsuranceDetails[2].Box4ValueId2 || "";
                        $scope.UBDetailsInfo.Box4Value3 = resp.data.AppointmentInsuranceDetails[2].Box4Value3 || "";
                        $scope.UBDetailsInfo.Box4ValueId3 = resp.data.AppointmentInsuranceDetails[2].Box4ValueId3 || "";
                        $scope.UBDetailsInfo.Box4Value4 = resp.data.AppointmentInsuranceDetails[2].Box4Value4 || "";
                        $scope.UBDetailsInfo.Box4ValueId4 = resp.data.AppointmentInsuranceDetails[2].Box4ValueId4 || "";

                        $scope.UBDetailsInfo.Box14ValueId = resp.data.AppointmentInsuranceDetails[2].Box14ValueId || "";
                        $scope.UBDetailsInfo.Box14Value = resp.data.AppointmentInsuranceDetails[2].Box14Value || "";
                        $scope.UBDetailsInfo.Box14ValueCode = resp.data.AppointmentInsuranceDetails[2].Box14ValueCode || "";
                        $scope.UBDetailsInfo.Box15ValueId = resp.data.AppointmentInsuranceDetails[2].Box15ValueId || "";
                        $scope.UBDetailsInfo.Box15Value = resp.data.AppointmentInsuranceDetails[2].Box15Value || "";
                        $scope.UBDetailsInfo.Box15ValueCode = resp.data.AppointmentInsuranceDetails[2].Box15ValueCode || "";

                        $scope.UBDetailsInfo.Box79Type = resp.data.AppointmentInsuranceDetails[2].Box79Type || "";
                        $scope.UBDetailsInfo.Box79TypeId = resp.data.AppointmentInsuranceDetails[2].Box79TypeId || "";
                        $scope.UBDetailsInfo.Box79Value = resp.data.AppointmentInsuranceDetails[2].Box79Value || "";
                        $scope.UBDetailsInfo.Box79ValueId = resp.data.AppointmentInsuranceDetails[2].Box79ValueId || "";
                        $scope.UBDetailsInfo.Box79ValueNPI = resp.data.AppointmentInsuranceDetails[2].Box79ValueNPI || "";
                        $scope.UBDetailsInfo.IsBox80Checked = resp.data.AppointmentInsuranceDetails[2].IsBox80Checked || "";


                        if ($scope.UBDetailsInfo.Box79TypeId == 3) {
                            $scope.UBDetailsInfo.FacilityName = resp.data.FacilityName || '';
                            $scope.UBDetailsInfo.FacilityNPI = resp.data.FacilityNPI || '';
                        }


                        $scope.UBDetailsInfo.TotalPatientPayment = resp.data.TotalPatientPayment || 0;

                        //if ($scope.UBDetailsInfo.Box79Type == "Billing Provider") {
                        //    var filterProviderList = $filter("filter")($scope.ClaimProviderList, { "OrganizationBillingProviderId": $scope.UBDetailsInfo.Box79TypeId })[0] || [];
                        //    $scope.UBDetailsInfo.Box79FirstName = filterProviderList.BillingProviderName;
                        //    $scope.UBDetailsInfo.Box79LastName = '';
                        //}
                        //else if ($scope.UBDetailsInfo.Box79Type == "Rendering Provider") {

                        //    var filterDoctorList = $filter("filter")($scope.mainBillerDataObj.AllDoctorsList, { "DoctorID": $scope.UBDetailsInfo.Box79TypeId })[0] || [];
                        //    $scope.UBDetailsInfo.Box79FirstName = filterDoctorList.FirstName;
                        //    $scope.UBDetailsInfo.Box79LastName = filterDoctorList.LastName;
                        //}
                        //else if ($scope.UBDetailsInfo.Box79Type == "Facility") {
                        //    var filterOrgFacilityList = $filter("filter")($scope.OrganizationFacilityList, { "OrganizationFacilityId": $scope.UBDetailsInfo.Box79TypeId })[0] || [];
                        //    $scope.UBDetailsInfo.Box79FirstName = filterOrgFacilityList.FacilityName;
                        //    $scope.UBDetailsInfo.Box79LastName = '';
                        //} else {

                        //}


                        $scope.UBDetailsInfo.Box80Value = resp.data.AppointmentInsuranceDetails[2].Box80Value || "";

                    }

                    $scope.UBDetailsInfo.IPayerClaimNumber = resp.data.PayerClaimControlNumber || "";


                    var filtredArray = $filter("filter")(resp.data.AppointmentInsuranceDetails, { "PatientInsuranceDetailId": resp.data.TransmitQueuePatientInsuranceId }, true) || [];

                    if (filtredArray.length > 0) {
                        if (filtredArray[0].Box79TypeId == "1") {  //Billing provider
                            var filterProviderList = $filter("filter")($scope.ClaimProviderList, { "OrganizationBillingProviderId": resp.data.BillingProviderId }, true)[0] || [];
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
                            //var filterOrgFacilityList = $filter("filter")($scope.ClaimLocationList, { "OrganizationFacilityId": resp.data.OrganizationFacilityId }, true) || [];
                            //if (filterOrgFacilityList.length>0) {
                            //    $scope.UBDetailsInfo.Box79FirstName = filterOrgFacilityList[0].FacilityName;
                            //    $scope.UBDetailsInfo.Box79LastName = '';
                            //    $scope.UBDetailsInfo.Box79ValueNPI = '';
                            //}

                            $scope.UBDetailsInfo.Box79FirstName = resp.data.FacilityName || '';
                            $scope.UBDetailsInfo.Box79ValueNPI = resp.data.FacilityNPI || '';
                        }
                        else {
                            $scope.UBDetailsInfo.Box79FirstName = '';
                            $scope.UBDetailsInfo.Box79LastName = '';
                            $scope.UBDetailsInfo.Box79ValueNPI = '';
                        }


                        if (filtredArray[0].Box78TypeId == "1") {  //Billing provider
                            var filterProviderList = $filter("filter")($scope.ClaimProviderList, { "OrganizationBillingProviderId": resp.data.BillingProviderId }, true)[0] || [];
                            $scope.UBDetailsInfo.Box78FirstName = filterProviderList.BillingProviderName;
                            $scope.UBDetailsInfo.Box78LastName = '';
                            $scope.UBDetailsInfo.Box78ValueNPI = filterProviderList.Box33GroupNPI;
                        }
                        else if (filtredArray[0].Box78TypeId == "2") {  // Referring Provider
                            $scope.UBDetailsInfo.Box78FirstName = resp.data.ReferringProviderFirstName || '';
                            $scope.UBDetailsInfo.Box78LastName = resp.data.ReferringProviderLastName || '';
                            $scope.UBDetailsInfo.Box78ValueNPI = resp.data.ReferringProviderNPI || '';

                        }
                        else if (filtredArray[0].Box78TypeId == "3") {   //Facility
                            //var filterOrgFacilityList = $filter("filter")($scope.ClaimLocationList, { "OrganizationFacilityId": resp.data.OrganizationFacilityId }, true) || [];
                            //if (filterOrgFacilityList.length>0) {
                            //    $scope.UBDetailsInfo.Box78FirstName = filterOrgFacilityList[0].FacilityName;
                            //    $scope.UBDetailsInfo.Box78LastName = '';
                            //    $scope.UBDetailsInfo.Box78ValueNPI = '';
                            //}

                            $scope.UBDetailsInfo.Box78FirstName = resp.data.FacilityName || '';
                            $scope.UBDetailsInfo.Box78ValueNPI = resp.data.FacilityNPI || '';
                        } else {
                            $scope.UBDetailsInfo.Box78FirstName = '';
                            $scope.UBDetailsInfo.Box78LastName = '';
                            $scope.UBDetailsInfo.Box78ValueNPI = '';
                        }

                    if (filtredArray[0].Box76TypeId == "1") {//Billing provider
                        //var filterProviderList = $filter("filter")($scope.ClaimProviderList, { "OrganizationBillingProviderId": resp.data.BillingProviderId }, true) || [];
                        let filterProviderList = $filter("filter")($scope.ClaimProviderList, function (item) {
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


                        $scope.UBDetailsInfo.AttendingProviderObj.FirstName = resp.data.FacilityName || '';

                        $scope.UBDetailsInfo.AttendingProviderObj.LastName = "";

                        $scope.UBDetailsInfo.AttendingProviderObj.NPI = resp.data.FacilityNPI || '';

                        //$scope.UBDetailsInfo.AttendingProviderObj.UPIN = "0000000000";

                    }

                    if ($scope.ParentHospitalId != 2) {

                        if (filtredArray[0].Box77TypeId == "1") {   // Billing Provider

                            //var filterProviderList = $filter("filter", $scope.ClaimProviderList, { "OrganizationBillingProviderId": resp.data.BillingProviderId }, true) || [];
                            let filterProviderList = $filter("filter")($scope.ClaimProviderList, function (item) { return item.OrganizationBillingProviderId === $scope.mainClaimObject.BranchServiceLocationId; }) || [];


                            if (filterProviderList.length > 0) {

                                $scope.UBDetailsInfo.OperatingProviderObj.FirstName = filterProviderList[0].BillingProviderName || "";

                                $scope.UBDetailsInfo.OperatingProviderObj.LastName = "";

                                $scope.UBDetailsInfo.OperatingProviderObj.NPI = filterProviderList[0].Box33GroupNPI || "";
                            }

                        }
                        else if (filtredArray[0].Box77TypeId == "2") {   // Rendering Provider

                            //var fRenderingobj = $filter("filter", $scope.filteredBranchDoctorsList, { "DoctorID": $scope.mainClaimObject.VisitProviderId }, true) || [];
                            let fRenderingobj = $filter("filter")($scope.allUserList, function (item) {
                                return item.DoctorID == resp.data.RenderingProviderId;
                            }) || [];


                            if (fRenderingobj.length > 0) {

                                $scope.UBDetailsInfo.OperatingProviderObj.FirstName = fRenderingobj[0].FirstName || "";

                                $scope.UBDetailsInfo.OperatingProviderObj.LastName = fRenderingobj[0].LastName || "";

                                $scope.UBDetailsInfo.OperatingProviderObj.NPI = fRenderingobj[0].NPI || "";
                            }

                        }
                        else if (filtredArray[0].Box77TypeId == "3") {   // Facility



                            $scope.UBDetailsInfo.OperatingProviderObj.FirstName = resp.data.FacilityName || '';

                            $scope.UBDetailsInfo.OperatingProviderObj.LastName = "";

                            $scope.UBDetailsInfo.OperatingProviderObj.NPI = resp.data.FacilityNPI || '';



                        }

                    }
                }

                    $scope.UBDetailsInfo.Appointment.AdmissionDate = resp.data.AppointmentDate;
                   // $scope.UBDetailsInfo.Appointment.AdmissionDate = resp.data.AppointmentDate;
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

                    // $scope.UBDetailsInfo.OperatingProviderObj.FirstName = resp.data.ReferringProvider;
                    // $scope.UBDetailsInfo.OperatingProviderObj.LastName = resp.data.RenderingProviderLastName;
                    // $scope.UBDetailsInfo.OperatingProviderObj.NPI = resp.data.ReferringProviderNPI;

                    //$scope.UBDetailsInfo.AttendingProviderObj.FirstName = resp.data.RenderingProviderFirstName;
                    //$scope.UBDetailsInfo.AttendingProviderObj.LastName = resp.data.RenderingProviderLastName;
                    //$scope.UBDetailsInfo.AttendingProviderObj.NPI = resp.data.RenderingProviderNPI;

                    //var fRenderingobj = $filter("filter")($scope.allUserList, { "DoctorID": resp.data.VisitProviderId }, true) || [];
                    //if (fRenderingobj.length > 0) {
                    //    $scope.UBDetailsInfo.AttendingProviderObj.FirstName = fRenderingobj[0].FirstName || "";
                    //    $scope.UBDetailsInfo.AttendingProviderObj.LastName = fRenderingobj[0].LastName || "";

                    //    $scope.UBDetailsInfo.AttendingProviderObj.NPI = fRenderingobj[0].NPI || "";

                    //    if (fRenderingobj[0].UPIN != "") {
                    //        $scope.UBDetailsInfo.AttendingProviderObj.UPIN = fRenderingobj[0].UPIN || "";
                    //    } else {
                    //        $scope.UBDetailsInfo.AttendingProviderObj.UPIN = "0000000000";
                    //    }

                    //    if ($scope.ParentHospitalId !=2) {

                    //        $scope.UBDetailsInfo.OperatingProviderObj.FirstName = fRenderingobj[0].FirstName || "";
                    //        $scope.UBDetailsInfo.OperatingProviderObj.LastName = fRenderingobj[0].LastName || "";
                    //        $scope.UBDetailsInfo.OperatingProviderObj.NPI = fRenderingobj[0].NPI || "";
                    //    }

                    //}
                    $scope.UBDetailsInfo.Box80RemarkValue1 = "";
                    $scope.UBDetailsInfo.Box80RemarkValue2 = "";
                    $scope.UBDetailsInfo.Box80RemarkValue3 = "";
                    var remarkIndex = 1;
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
                        angular.forEach(resp.data.PatientClaimLineItems, function (ditem, index) {
                            // ditem.Notes = "test note for durga";
                            if (ditem.Notes && ditem.Notes.trim() !== "") {

                                var formattedNote = "(" + ditem.RevenueBillingCode + ") - " + ditem.Notes;
                                console.log(formattedNote);
                                if (remarkIndex === 1) {
                                    $scope.UBDetailsInfo.Box80RemarkValue1 = formattedNote;
                                }
                                else if (remarkIndex === 2) {
                                    $scope.UBDetailsInfo.Box80RemarkValue2 = formattedNote;
                                }
                                else if (remarkIndex === 3) {
                                    $scope.UBDetailsInfo.Box80RemarkValue3 = formattedNote;
                                }

                                remarkIndex++;

                                // Stop if already filled 3 values
                                if (remarkIndex > 3) {
                                    return;
                                }
                            }
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

                        //$scope.UBDetailsInfo.CreateDate = resp.data.AppointmentDate || null;
                        $scope.UBDetailsInfo.PrincipalProcedure.Code = resp.data.PatientClaimLineItems[0].ServiceCode || "";
                        $scope.UBDetailsInfo.PrincipalProcedure.Date = $filter("date")(resp.data.PatientClaimLineItems[0].DOSfrom, "yyyy-MM-dd");
                    }

                    for (let i = 0; i < $scope.UBDetailsInfo.OtherDiagnosisandPOA_Firstrow.length; i++) {
                        let item = $scope.UBDetailsInfo.OtherDiagnosisandPOA_Firstrow[i];
                        let icd = resp.data["ICD" + item.Sno];

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
            if (type == 'WithLine') {
                $scope.UBDetailsInfo.printtype = "withTemplate";
            } else if (type == "WithoutLine") {
                $scope.UBDetailsInfo.printtype = "withOutTemplate";

            }
            $scope.UBDetailsInfo.TotalChargeAmount = 0;
            $scope.UBDetailsInfo.TotalChargeAmount = $scope.UBDetailsInfo.TotalClaimAmount;
            eHnoteMainAppointmentService.GenerateUB04FromHCFA($scope.UBDetailsInfo)
                .then(openPdf);



        }



        $scope.navtoOpenClaimAddupdatePopup = function (item) {

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
                "PatientFullName": item.PatientFullName || "",
                "ActionType": "AddClaim",
                "SubActionType": "Verify",
                "ScreenType": "Popup",
                "SuperBillId": null,
                "ResponcibilityId": item.CurrentResponsibilityId || 0,
                "IsCreateSuperBill": false,
                "PatientClaimId": item.PatientClaimId,
                "SuperBillArray": [],
                "ClaimExpiryDate": $scope.ClaimObjecDate.ClaimExpiryDate || null,
                "AppointmentDoctorId": item.RenderingProviderId || 0
            };

            datapersistanceFactory.set("IsComingFromClaim", $scope.claimScreenParentObj);

            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/UsClaims/AddUpdateClaimPopup.html",
                "size": "lg",
                "keyboard": false,
                "controller": "UsAddUpdateClaimPopupCtrl",
                "windowClass": "modal__ninety--",
                "resolve": {
                    "mainBillerDataObj": function () { return $scope.mainBillerDataObj || null; },
                }
                /*"windowClass": "offcanves-right  ",*/
                //"windowClass": "modal__popup--1 bottom-to-top-modal in  ",

            });

            $scope.mInstanceAdd.result.then(function (response) {

                console.log(response);

                //$scope.SearchClaimListObj = angular.copy($scope.GetClaimListObj());
                //$scope.SearchClaimListObj.PageNumber = 1;


                $scope.SearchAllClaimDetails(1);

            }, function () { });
        }

        $scope.navtoOpenProfilePopup = function (item, id, type, NotesId, claimstype) {

            claimstype = claimstype || '';
            type = type || '';
            item = item || '';
            id = id || 0;
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
                "ActionType": "AddClaim",
                "SubActionType": "Verify",
                "ScreenType": "Popup",
                "SuperBillId": null,
                "PatientClaimId": item.PatientClaimId,
                "SuperBillArray": [],
                "NotesId": NotesId || 1,
            };

            datapersistanceFactory.set("IsComingFromClaim", $scope.claimScreenParentObj);


            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/UsClaims/ClaimPatientProfile.html",
                "size": "lg",
                "keyboard": false,
                "controller": "UsClaimPatientProfileCtrl",
                "windowClass": "offcanves-right  ",
                "resolve": {
                    "AllHospitalData": function () { return $scope.mainBillerDataObj; },
                    "PatientInsuranceListData": function () { return item; },
                    "id": function () { return id; },
                    "type": function () { return type; },
                    "IshideIndicator": true,
                }

            });

            $scope.mInstanceAdd.result.then(function (response) {
                //$scope.SearchAllClaimDetails(1, 'All')
                $scope.Search277AckDetails();
                $scope.SearchClaimFollowupslist();
                $scope.SearchRejectedFollowUps();
                $scope.SearchAdjustmentReqslist(1);
                if (claimstype == 'All') {
                    $scope.SearchAllClaimDetails(1, 'All')
                } else if (claimstype == 'SecondaryTransmission') {
                    $scope.SearchAllClaimDetails(1, 'SecondaryTransmission')
                } else if (claimstype =='PrivateClaims') {
                    $scope.SearchAllClaimDetails(1, 'PrivateClaims')
                } else {
                    $scope.SearchAllClaimDetails(1, 'Denial');
                }
               

            }, function () { });
        }

        $scope.navtoOpenDenialpopupmanagement = function (item) {
            //var matchedObj = $scope.OrgClaimListdata.find(function (sitem) {
            //    return sitem.PatientClaimId === item.PatientClaimId;
            //});
            var Obj = {
                "PostingPaymentData": item,
                "mainEOBPaymentPostingObj": $scope.mainBillerDataObj,
                "IsFrom": "ClaimsList",
                "IsShowPostPaymentBtnInd": true
            }

            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/UsClaims/UsDenialReviewandAppealPopup.html",
                "size": "lg",
                "keyboard": false,
                "controller": "UsDenialReviewPopupCtrl",
                "windowClass": "modal__popup--1",
                'backdrop': 'static',
                "resolve": {
                    "PaymentPostingDataObj": function () { return Obj },
                }

            })
            $scope.mInstanceAdd.result.then(function (resp) {
                resp = resp || "";
                if ($scope.ClaimSubtabs == 4) {
                    //    $scope.SearchAllClaimDetails(1, 'Denial');
                    if ($scope.DenialFollowupTab == 'Summury') {
                        $scope.$broadcast("RefreshitemsIndenailSummury", "broadcast event to child");

                    } else {
                        $scope.SearchDenailClaimDetails(1, 'Denial');
                    }
                }
                $scope.SearchAdjustmentReqslist(1);
                //$uibModalInstance.close();
            }, function () { });
        }
        $scope.navtoClaimSummaryInNewTab = function (item) {
            $scope.calculateExpiryDate();
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
                "PatientFullName": item.PatientFullName || "",
                "VisitId": item.VisitId || '',
                "ActionType": "EditClaim",
                "SubActionType": "Verify",
                "ScreenType": "Popup",
                "SuperBillId": null,
                "ResponcibilityId": item.CurrentResponsibilityId || 0,
                "IsCreateSuperBill": false,
                "PatientClaimId": item.PatientClaimId,
                "SuperBillArray": [],
                "ClaimExpiryDate": $scope.ClaimObjecDate.ClaimExpiryDate || null,
                "AppointmentDoctorId": item.RenderingProviderId || 0,
                "PageNumber": $scope.SearchClaimListObj.PageNumber || 1,
            };
            $scope.mainBillerDataObj.Tabid = 2;
            datapersistanceFactory.set("IsComingFromClaim", $scope.claimScreenParentObj);
            datapersistanceFactory.set("mainDataBillerObj", $scope.mainBillerDataObj);
            $window.open("#/claim/" + item.PatientClaimId, "_blank");
        }

        $scope.navtoClaimSummaryPopup = function (item, type) {
            $scope.calculateExpiryDate();
            item = item || '';
            let AppointmentId = null;
            let PatientId = null;
            if (item != '') {
                AppointmentId = item.AppointmentId;
                PatientId = item.PatientId;
            }
            type = type || "";

            $scope.claimScreenParentObj = {
                "PatientId": PatientId || null,
                "AppointmentId": AppointmentId || null,
                "AppointmentTypeId": item.AppointmentTypeId || null,
                "PatientFullName": item.PatientFullName || "",
                "VisitId": item.VisitId || '',
                "ActionType": "EditClaim",
                "SubActionType": "Verify",
                "ScreenType": "Popup",
                "SuperBillId": null,
                "ResponcibilityId": item.CurrentResponsibilityId || 0,
                "IsCreateSuperBill": false,
                "PatientClaimId": item.PatientClaimId,
                "SuperBillArray": [],
                "ClaimExpiryDate": $scope.ClaimObjecDate.ClaimExpiryDate || null,
                "AppointmentDoctorId": item.RenderingProviderId || 0,
                "PageNumber": $scope.SearchClaimListObj.PageNumber || 1,
                "type": type,
            };
            $scope.mainBillerDataObj.Tabid = 2;
            $scope.mainBillerDataObj.PatientId = PatientId || 0;
            $scope.mainBillerDataObj.HospitalId = $scope.HospitalId || 0;
            datapersistanceFactory.set("IsComingFromClaim", $scope.claimScreenParentObj);
            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/UsClaims/AddUpdateClaimPopup.html",
                "size": "lg",
                "keyboard": false,
                "controller": "UsAddUpdateClaimPopupCtrl",
                "windowClass": "modal__popup--1",
                "resolve": {
                    "mainBillerDataObj": function () { return $scope.mainBillerDataObj || null; },
                }
            });

            $scope.mInstanceAdd.result.then(function (response) {
                response = response || "";
                console.log(response);

                if (response === 'Close') return;
                var Pageno = $scope.SearchClaimListObj.PageNumber || 1;
                if ($scope.ClaimSubtabs == 1) {
                    /* $scope.SearchAllClaimDetails(Pageno, 'All');*/
                    angular.forEach($scope.MasterClaimStatusList, function (s) {
                        s.IsChecked = false;
                    });


                    if ($scope.ClaimAckotherStatusfilter != 'AckStatus' && $scope.ClaimAckotherStatusfilter != 'Otherstatus' ) {
                        if ($scope.activeClaimTab == 'ALL') {
                            $scope.selectedClaimStatusIds = "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27";
                        } else if ($scope.selectedClaimStatusIds == "5,6,7,10,11,12,13,14,26,27") {
                            $scope.selectedClaimStatusIds = "5,6,7,10,11,12,13,14,26,27";
                        } else {
                            $scope.selectedClaimStatusIds = item.ClaimStatusId;
                        }
                    } else {
                        $scope.selectedClaimStatusIds = $scope.SearchClaimListObj.ClaimStatusList;
                    }
                    $scope.activeClaimTabStatusIds = $scope.selectedClaimStatusIds;


                    $scope.SearchClaimListObj.selectedClaimStatusIds = $scope.activeClaimTabStatusIds || "";

                    /*  $scope.SearchAllCountClaimDetails('All', $scope.SearchClaimListObj.selectedClaimStatusIds, Pageno);*/

                    $scope.onClaimTabClick("", 'All', $scope.SearchClaimListObj.selectedClaimStatusIds, '', '', 'Close');

                }
                else if ($scope.ClaimSubtabs == 2) {
                    $scope.SearchAllClaimDetails(Pageno, 'NotSubmitted');
                }
                else if ($scope.ClaimSubtabs == 3) {

                    if ($scope.ClaimLocationList?.length > 0) {
                        $scope.ClaimLocationList.forEach(pitem => {
                            pitem.IsChecked = false;
                        });
                    }
                    $scope.selectedClaimTransmittedUsers = eHnoteMasterDataService.getClaimsTransmittedUsersList();
                    //if ($scope.selectedClaimTransmittedUsers != '') {
                    //    $scope.SearchClaimListObj.FromDate = $scope.selectedClaimTransmittedUsers.FromDate || null;
                    //    $scope.SearchClaimListObj.ToDate = $scope.selectedClaimTransmittedUsers.ToDate || null;
                    //    $scope.SearchClaimListObj.BillingProviderId = $scope.selectedClaimTransmittedUsers.BillingProviderId || 0;
                    //    $scope.SearchClaimListObj.RenderingProviderId = $scope.selectedClaimTransmittedUsers.RenderingProviderId || 0;
                    //    $scope.SearchClaimListObj.TransmissionMethodId = $scope.selectedClaimTransmittedUsers.TransmissionMethodId || 0;
                    //    $scope.SearchClaimListObj.CurrentResponsibilityId = $scope.selectedClaimTransmittedUsers.CurrentResponsibilityId || 0;
                    //    $scope.SearchClaimListObj.BillPaymentTypeId = $scope.selectedClaimTransmittedUsers.BillPaymentTypeId || 0;
                    //    $scope.SearchClaimListObj.ClaimTypeId = $scope.selectedClaimTransmittedUsers.ClaimTypeId || 0;
                    //    $scope.SearchClaimListObj.PayorObj = $scope.selectedClaimTransmittedUsers.PayorObj || '';
                    //    $scope.SearchClaimListObj.PayorId = $scope.selectedClaimTransmittedUsers.PayorId || 0;
                    //    $scope.SearchClaimListObj.selectedClaimStatusIds = $scope.selectedClaimTransmittedUsers.selectedClaimStatusIds || "";                
                    //    $scope.selectedClaimTransmittedUsers.checkedTransmittedClaimStatusList = $scope.selectedClaimTransmittedUsers.checkedTransmittedClaimStatusList || '';

                    //} 
                    angular.forEach($scope.MasterClaimStatusList, function (s) {
                        s.IsChecked = false;
                    });
                    if (!status) {
                        $scope.activeClaimTab = 'ALL';
                        $scope.selectedClaimStatusIds = "3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27";
                    } else {
                        $scope.selectedClaimStatusIds = status.ClaimStatusId.toString();
                        $scope.activeClaimTab = null;
                    }
                    $scope.activeClaimTabStatusIds = $scope.selectedClaimStatusIds;


                    $scope.SearchClaimListObj.selectedClaimStatusIds = $scope.activeClaimTabStatusIds || "";

                    //$scope.SearchAllClaimDetails(Pageno, 'Transmitted', $scope.SearchClaimListObj.selectedClaimStatusIds)           
                    /* $scope.SearchAllCountClaimDetails('Transmitted', $scope.SearchClaimListObj.selectedClaimStatusIds, Pageno);*/
                    $scope.onClaimTabClick("", 'Transmitted', $scope.SearchClaimListObj.selectedClaimStatusIds);
                }
                else if ($scope.ClaimSubtabs == 4) {
                    //    $scope.SearchAllClaimDetails(Pageno, 'Denial');
                    //$scope.SearchAllClaimDetails(1, 'Denial');
                    if ($scope.DenialFollowupTab == 'Summury') {
                        $scope.$broadcast("RefreshitemsIndenailSummury", "broadcast event to child");

                    } else {
                        $scope.SearchDenailClaimDetails(1, 'Denial');
                    }

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
                    $scope.SearchAllClaimDetails(Pageno, 'Queue');
                } else if ($scope.ClaimSubtabs == 15) {
                    $scope.SearchClaimListObj.BillPaymentTypeId = 1;
                    $scope.SearchAllClaimDetails(1, 'PrivateClaims');
                }


                $scope.$on('ClaimClose', function (event, data) {
                    data = data || "";
                    if (data === 'CloseClaimPopup') {
                        $scope.SearchAllClaimDetails(Pageno, 'All');
                    }
                });

                if (response != "") {
                    response.TotalPatientBalance = response.TotalPatientBalance || 0;
                    response.CurrentResponsibilityId = response.CurrentResponsibilityId || 0;

                    if (response.TotalPatientBalance != 0 && response.CurrentResponsibilityId != 3) {
                        $scope.navtoOpenAddDepositAmount(response);
                    }
                }
                if (type != '') {
                    type = '';
                }
            }, function () { });
        }

        $scope.navtoClaimSummaryPopup1 = function (item) {

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
                "VisitId": item.VisitId || '',
                "ActionType": "AddClaim",
                "ScreenType": "Popup",
                "SuperBillId": null,
                "SuperBillArray": [],
                "PatientClaimId": item.PatientClaimId
            };

            datapersistanceFactory.set("IsComingFromClaim", $scope.claimScreenParentObj);

            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/UsClaims/ClaimSummaryPopup.html",
                "controller": "UsClaimSummaryPopupCtrl",
                "backdrop": "static",
                "keyboard": false,
                "windowClass": "offcanves-right  ",
                "resolve": {
                    "AllHospitalData": function () { return $scope.mainBillerDataObj; },
                    "PatientInsuranceListData": function () { return item; },
                }
            });
            $scope.mInstanceAdd.result.then(function (resp) {
                resp = resp || "";
                //if ($scope.ClaimSubtabs == 1) {
                //    $scope.SearchAllClaimDetails(1, 'All');
                //}
                //else if ($scope.ClaimSubtabs == 2) {
                //    $scope.SearchAllClaimDetails(1, 'NotSubmitted');
                //}
                //else if ($scope.ClaimSubtabs == 3) {
                //    $scope.SearchAllClaimDetails(1, 'Transmitted');
                //}
                //else if ($scope.ClaimSubtabs == 4) {
                //    $scope.SearchAllClaimDetails(1, 'Denial');
                //}
                //else if ($scope.ClaimSubtabs == 5) {
                //    $scope.SearchRejectedFollowUps('Rejected');
                //}
                //else if ($scope.ClaimSubtabs == 6) {
                //    $scope.Search277AckDetails();
                //}
                //else if ($scope.ClaimSubtabs == 7) {
                //    $scope.Search999AckDetails();
                //}

                //$scope.$on('ClaimClose', function (event, data) {
                //    data = data || "";
                //    if (data === 'CloseClaimPopup') {
                //        $scope.SearchAllClaimDetails(1, 'All');
                //    }
                //});

            }, function () { });
        }
        $scope.navtonotespopup = function () {
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/Claimsnotespopup.html",
                //"size": "lg",
                "backdrop": "static",
                "keyboard": false,
                "scope": $scope,
                //"windowClass": "offcanves-right  ",
                "windowClass": "appointment-full-popup",
                "controller": function ($scope, $uibModal, $uibModalInstance) {
                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                }
            });
        };
        $scope.downloadEDIFile1 = function (data) {
            const blob = new Blob([data], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = $scope.EdiItemData.PatientFullName + '_' + $scope.EdiItemData.PatientClaimNumber + '.837' || 'Edi.837';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
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





        $scope.EdiPreviewPopup = function (item) {
            $scope.EdiClaimDetails = item;
            $scope.Edis3UrlData = "";
            $scope.EdiItemData = item;
            //$scope.Edis3UrlData = $scope.EdiClaimDetails.PatientClaimTransmission.find(function (item) {
            //    return item.PatientInsuranceDetailId == $scope.EdiClaimDetails.TransmitQueuePatientInsuranceId;
            //});

            if ($scope.EdiClaimDetails.PatientClaimTransmission.length > 0) {
                $scope.Edis3UrlData = $scope.EdiClaimDetails.PatientClaimTransmission[0];
            }

            if ($scope.Edis3UrlData) {
                if (!$scope.Edis3UrlData.EDIS3Url || $scope.Edis3UrlData.EDIS3Url === "") {
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
                            "EdiClaimDetails": function () { return $scope.Edis3UrlData.EDIS3Url; },
                            "EdiANSIString": function () { return $scope.Edis3UrlData.EdiANSIString; },
                        },
                        "http": $http,
                        "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientDataService, EdiClaimDetails, $http, EdiANSIString) {

                            $scope.uibclose = function () {
                                $uibModalInstance.dismiss("cancel");
                            };
                            $scope.Edis3UrlData = EdiClaimDetails;
                            $scope.EdiANSIStringview = EdiANSIString || '';

                            $scope.getTrustedUrl = function (url) {

                                var modifiedUrl = url + "#pagemode=none&zoom=52";
                                return $sce.trustAsResourceUrl(modifiedUrl);
                            };
                            //if ($scope.Edis3UrlData) {

                            //    loadFileContent($scope.Edis3UrlData);
                            //}
                            $scope.getTrustedUrl = function (url) {
                                /*+ "#toolbar=0&navpanes=0"*/
                                var modifiedUrl = url;
                                return $sce.trustAsResourceUrl(modifiedUrl);
                            };

                            function loadFileContent(edis3Url) {
                                if (edis3Url) {
                                    $http.get(edis3Url)
                                        .then(function (response) {
                                            $scope.fileContent = response.data;
                                            $scope.EdiANSIStringview = $scope.fileContent;
                                            //downloadEDIFile($scope.EdiANSIStringview, item.PatientClaimNumber +'.837');
                                        });
                                } else {
                                    $scope.fileContent = "";
                                }
                            }

                            if ($scope.EdiANSIStringview != '') {
                                //  $scope.EdiANSIStringview = $scope.EdiANSIStringview.split("~").join("\n");
                            }
                        }


                    });

                    $scope.mInstanceAdd.result.then(function (response) {
                    }, function () { });
                }


            }
            else {
                alertify.error("There is no edi for the claim");
            }
        }

        $scope.GetOrganizationNewPayorAllListnew = function (val) {

            var param = {
                "SearchText": val || "",
                "Status": "Active",
                "PageSize": 100,
                "PageNumber": 1,
                "UserId": $scope.UserId,
                "SpecializationId": $scope.SpecializationId,
                "OrganizationId": $scope.HospitalId,
                "ParentOrganizationId": $scope.ParentHospitalId,
                "GetAllIndicator": 0,
                "PayorId": 0,
                "PayorTypeId": 0
            };
            return eHnoteInsuranceService.GetOrganizationInsurancePayorsList(param).then(function (resp) {
                if (resp.data.count !== 0) {
                    if (resp.data.rows !== undefined) {
                        $scope.OrganizationPayorsList = resp.data.rows;
                        angular.forEach($scope.OrganizationPayorsList, function (item) {
                            item.IsChecked = false;
                        });
                    }
                }
                else {
                    alertify.error(resp.data.Message);
                }
            });
        }

        $scope.GetOrganizationNewPayorAllListnew();
        $scope.ChangePayorName = function (item) {
            $scope.SearchClaimListObj.PayorId = item.PayorId;
            $scope.SearchClaimListObj.PayorName = item.PayorName;
        }

        //$scope.OnChangePayorName = function (item) {
        //    $scope.AllPayorList = $scope.AllPayorList || [];
        //    var exists = $filter('filter')($scope.AllPayorList, { PayorId: item.OrganizationPayorId }, true);
        //    if (exists.length > 0) { alertify.error('Payor already selected'); return; }
        //    $scope.AllPayorList.push({ PayorId: item.OrganizationPayorId, PayorName: item.OrganizationPayorName });
        //    $scope.SearchClaimListObj.PayorObj = '';
        //}
        //$scope.RemoveSelectedPayor = function (sel, index) {
        //    $scope.AllPayorList.splice(index, 1);
        //    // FilteredList లో uncheck చేయి
        //    $scope.AllPayorList.forEach(function (item) {
        //        if (item.PayorId === sel.PayorId) item.IsChecked = false;
        //    });
        //    updatePayorButtonLabel();
        //};

        //// Button label update
        //function updatePayorButtonLabel() {
        //    var count = $scope.AllPayorList.length;
        //    if (count === 0) {
        //        $scope.ClaimPayorListObj.SelectPayorString = '';
        //    } else if (count === 1) {
        //        $scope.ClaimPayorListObj.SelectPayorString =
        //            $scope.AllPayorList[0].OrganizationPayorName;
        //    } else {
        //        $scope.ClaimPayorListObj.SelectPayorString = count + ' Payers Selected';
        //    }
        //}
        $scope.SearchClaimListObj.AllPayorList = $scope.SearchClaimListObj.AllPayorList || [];

        $scope.OnChangePayorName = function (item) {
            if (!item || !item.OrganizationPayorId) return;

            var exists = $filter('filter')($scope.SearchClaimListObj.AllPayorList, { PayorId: item.PayorId }, true);
            if (exists.length > 0) {
                alertify.error('Payor already selected');
                return;
            }

            $scope.SearchClaimListObj.AllPayorList.push({
                PayorId: item.PayorId,
                PayorName: item.OrganizationPayorName
            });

            $scope.SearchClaimListObj.PayorObj = '';
            updatePayorButtonLabel();  // ← ఇది missing గా ఉంది మీ code లో
        };

        $scope.RemoveSelectedPayor = function (sel, index) {
            $scope.SearchClaimListObj.AllPayorList.splice(index, 1);
            updatePayorButtonLabel();
        };

        function updatePayorButtonLabel() {
            var count = $scope.SearchClaimListObj.AllPayorList.length;
            if (count === 0) {
                $scope.ClaimPayorListObj.SelectPayorString = '';
            } else if (count === 1) {
                $scope.ClaimPayorListObj.SelectPayorString = $scope.SearchClaimListObj.AllPayorList[0].PayorName;
                //                                                               ↑ PayorName (OrganizationPayorName కాదు)
            } else {
                $scope.ClaimPayorListObj.SelectPayorString = count + ' Payers Selected';
            }
        }


        $scope.changeradiobtn = function (item, type) {
            $scope.SearchClaimListObj.SearchText = "";
            $scope.SearchClaimListObj.PatientMRNo = "";
            $scope.SearchClaimListObj.PatienClaimNumber = "";
        }
        $scope.openClaimAcknoledgemetPopup = function (item) {

            if (item.ClaimStatus == 'Accepted-999') {
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
                                'TransactionId': item.Transaction999Id || '',
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
            } else {
                let mInstanceAdd = $uibModal.open({
                    "templateUrl": "claimAcknoledgement.html",
                    //"size": "lg",
                    "backdrop": "static",
                    "keyboard": false,
                    "scope": $scope,
                    "windowClass": "modal__sixty-- ",
                    "controller": function ($scope, $uibModal, $uibModalInstance, eHnoteInsuranceService) {
                        $scope.uibclose = function () {
                            $uibModalInstance.dismiss("cancel");
                        };

                        $scope.ClaimAcknoledgementList = [];

                        $scope.Get277AcknowledgementsRespons = function () {
                            let obj = {
                                'PatientClaimId': item.PatientClaimId || '',
                                'TransactionId': item.ResponseClaimId || '',
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
            }


        };

        $scope.open999AcknoledgemetPopup = function (item) {
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
        };


        $scope.AcknowledgementStatus = [
            { AcknowledgementStatusId: 0, ACkStatusName: 'All' },
            { AcknowledgementStatusId: 1, ACkStatusName: 'Accepted' },
            { AcknowledgementStatusId: 2, ACkStatusName: 'Rejected' },
        ];

        //$scope.BalanceStatus = [
        //    { BalanceStatusId: 0, BalanceStatusName: 'All' },
        //    { BalanceStatusId: 1, BalanceStatusName: 'Partially Settled' },
        //    { BalanceStatusId: 2, BalanceStatusName: 'Fully Settled' },
        //];

        $scope.getAckowledgement = function () {
            var Obj = {
                "OrganizationId": $scope.HospitalId,
                "PatientId": 0,
                "PatienClaimNumber": "",
                "FromDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "ToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "PayorObj": null,
                "PayorId": 0,
                "PayorName": "",
                "PayorAddress": "",
                "OrganizationPayorId": "",
                "AcknowledgementSource": "",
                "PayorId": 0,
                "AcknowledgementStatusId": 0,
                "BalanceStatusId": 0,
                "SettlementStatusId": 0,
                "PageSize": 10,
                "PageNumber": 1,
                "Count": 0
            }
            return Obj;
        }

        $scope.SearchAckmtObj = angular.copy($scope.getAckowledgement());

        $scope.ChangeInsurancePayor = function (obj) {

            $scope.SearchAckmtObj.PayorId = obj.PayorId;
            $scope.SearchAckmtObj.PayorName = obj.PayorName;
            $scope.SearchAckmtObj.PayorCode = obj.PayorCode;
            $scope.SearchAckmtObj.OrganizationPayorId = obj.OrganizationPayorId;
            $scope.SearchAckmtObj.PayorAddress = obj.Address1;
        }

        $scope.SearchPatientObj = {
            "ConsultationDt": moment().format("MM-DD-YYYY"),
            "OldPatientMRNO": "",
            "SearchPatientId": "",
            "SearchText": "",
            "searchPatientTxt": "",
            "searchPatientIdTxt": "",
            "searchPatientOldMR": "",
        }

        $scope.GetOrganizationNewPayorAllList = function (val) {

            if (val == undefined || val == null || val == "") {
                $scope.SearchClaimListObj.PayorId = 0;
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



        $scope.LoadPatientSearch = function (val) {


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
            $scope.SearchClaimListObj.PatientId = 0;
            $scope.SearchAckmtObj.PatientId = 0;
            $scope.Search999AckmtObj.PatientId = 0;
            $scope.Search999AckmtObj.ClaimNumber = '';
            $scope.SearchClaimListObj.PatienClaimNumber = '';
            $scope.SearchAckmtObj.PatienClaimNumber = '';
            $scope.SearchClaimFollowupObj.ClaimNumber = '';
            $scope.SearchClaimAdjustReqObj.PatientClaimNumber = '';
            $scope.SearchClaimAcknowledgementReqObj.PatientClaimNumber = '';

        };

        $scope.refresh277AckmntDetails = function () {
            $scope.SearchAckmtObj = angular.copy($scope.getAckowledgement());

            var Frezobj277 = {
                "FromDate": $filter("date")(new Date($scope.SearchAckmtObj.FromDate), "MM-dd-yyyy") || '',
                "ToDate": $filter("date")(new Date($scope.SearchAckmtObj.ToDate), "MM-dd-yyyy") || '',
                "PayorObj": $scope.SearchAckmtObj.PayorObj || '',
                "PayorId": $scope.SearchAckmtObj.PayorId || 0,
                "AcknowledgementSource": $scope.SearchAckmtObj.AcknowledgementSource || '',
                "AcknowledgementStatusId": $scope.SearchAckmtObj.AcknowledgementStatusId || 0,
                "SettlementStatusId": $scope.SearchAckmtObj.SettlementStatusId || 0,

            };
            eHnoteMasterDataService.add277AcknowledgementFilterList(Frezobj277);

            $scope.clearPatientSearchData();
            $scope.Search277AckDetails();
        }

        $scope.Search277AckDetails = function (pageno, type) {

            $scope.SearchAckmtObj.PageNumber = pageno || 1;
            var type = (type === undefined || type === '') ? 'All' : type;

            var Frezobj277 = {
                "FromDate": $filter("date")(new Date($scope.SearchAckmtObj.FromDate), "MM-dd-yyyy") || '',
                "ToDate": $filter("date")(new Date($scope.SearchAckmtObj.ToDate), "MM-dd-yyyy") || '',
                "PayorObj": $scope.SearchAckmtObj.PayorObj || '',
                "PayorId": $scope.SearchAckmtObj.PayorId || 0,
                "AcknowledgementSource": $scope.SearchAckmtObj.AcknowledgementSource || '',
                "AcknowledgementStatusId": $scope.SearchAckmtObj.AcknowledgementStatusId || 0,
                "SettlementStatusId": $scope.SearchAckmtObj.SettlementStatusId || 0,

            };
            eHnoteMasterDataService.add277AcknowledgementFilterList(Frezobj277);

            $scope.Add277Acknowledgement = [];

            var params = {
                "OrganizationId": $scope.HospitalId,
                "PatientId": $scope.SearchAckmtObj.PatientId || 0,
                "ClaimNumber": $scope.SearchAckmtObj.PatienClaimNumber || "",
                "FromDate": $scope.SearchAckmtObj.FromDate || "",
                "ToDate": $scope.SearchAckmtObj.ToDate || "",
                "AcknowledgementSource": $scope.SearchAckmtObj.AcknowledgementSource || "",
                "PayorId": $scope.SearchAckmtObj.PayorId || 0,
                "AcknowledgementStatusId": $scope.SearchAckmtObj.AcknowledgementStatusId || 0,
                "BalanceStatusId": $scope.SearchAckmtObj.SettlementStatusId || 0,
                "PageSize": 100,
                "PageNumber": $scope.SearchAckmtObj.PageNumber
            }

            eHnotePatientDataService.Get277CaAcknowledgementsList(params).then(function (resp) {

                if (resp.data.status == "Success") {
                    if (resp.data.rows.length > 0) {
                        $scope.Add277Acknowledgement = resp.data.rows || [];
                        $scope.SearchAckmtObj.Count = resp.data.count || 0;

                    }
                    $scope.ClaimSubtabActive = angular.copy($scope.ClaimSubtabs) || 1;
                } else {
                    alertify.error(resp.data.Message);
                }

            }, function (err) {

            });
        }




        $scope.get999Ackowledgement = function () {
            var Obj = {

                "OrganizationId": $scope.HospitalId,
                "PatientId": 0,
                "ClaimNumber": "",
                "FromDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "ToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "StatusId": 0,
                "PageSize": 50,
                "PageNumber": 1,
                "Count": 0,
            }
            return Obj;
        }

        $scope.Search999AckmtObj = angular.copy($scope.get999Ackowledgement());

        $scope.getClaimFollowup = function () {
            var Obj = {

                "OrganizationId": $scope.HospitalId,
                "PatientId": 0,
                "ClaimNumber": "",
                "FromDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "ToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "PayorId": 0,
                "PageSize": 10,
                "PageNumber": 1,
                "Count": 0,
                "AllUserListData": '',
                "SortColumn": "DOS",
                "SortOrder": "DESC"
            }
            return Obj;
        }

        $scope.SearchClaimFollowupObj = angular.copy($scope.getClaimFollowup());

        $scope.getClaimAdjustmentReq = function () {
            var Obj = {

                "OrganizationId": $scope.HospitalId,
                "PatientId": 0,
                "PatientClaimNumber": "",
                "FromDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "ToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "PageSize": 10,
                "PageNumber": 1,
                "Count": 0,
                "RequestType": '',
                "RequestedByUserId": '',
                "SortColumn": "DOS",
                "SortOrder": "DESC"
            }
            return Obj;
        }

        $scope.SearchClaimAdjustReqObj = angular.copy($scope.getClaimAdjustmentReq());
        $scope.getClaimAcknowledgementReq = function () {
            var Obj = {

                "OrganizationId": $scope.HospitalId,
                "PatientId": 0,
                "PatientClaimNumber": "",
                "FromDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "ToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "PageSize": 10,
                "PageNumber": 1,
                "Count": 0,
                "StatusId": '5,6,7,9,10,11,12,13,14',
            }
            return Obj;
        }

        $scope.SearchClaimAcknowledgementReqObj = angular.copy($scope.getClaimAcknowledgementReq());


        $scope.Search999AckDetails = function () {

            var Frezobj999 = {
                "FromDate": $filter("date")(new Date($scope.Search999AckmtObj.FromDate), "MM-dd-yyyy") || '',
                "ToDate": $filter("date")(new Date($scope.Search999AckmtObj.ToDate), "MM-dd-yyyy") || '',
                "StatusId": $scope.Search999AckmtObj.StatusId || 0,
            };
            eHnoteMasterDataService.add999AcknowledgementFilterList(Frezobj999);

            $scope.Add999AckmntList = [];
            var params = {
                "OrganizationId": $scope.HospitalId,
                "PatientId": $scope.Search999AckmtObj.PatientId,
                "ClaimNumber": $scope.Search999AckmtObj.ClaimNumber,
                "FromDate": $scope.Search999AckmtObj.FromDate || "",
                "ToDate": $scope.Search999AckmtObj.ToDate || "",
                "StatusId": $scope.Search999AckmtObj.StatusId,
                "PageSize": $scope.Search999AckmtObj.PageSize,
                "PageNumber": $scope.Search999AckmtObj.PageNumber
            }

            eHnoteInsuranceService.Get999CaAcknowledgementsList(params).then(function (resp) {
                if (resp.data.status == "Success") {
                    if (resp.data.rows.length > 0) {
                        $scope.Add999AckmntList = resp.data.rows || [];
                        $scope.Search999AckmtObj.Count = resp.data.count || 0;

                    }
                    $scope.ClaimSubtabActive = angular.copy($scope.ClaimSubtabs) || 1;
                } else {
                    alertify.error(resp.data.Message);
                }
            }, function (err) {

            });
        }

        $scope.SearchRejectedFollowUps = function (type) {

            if (type === 'Rejected') {
                if ($scope.ClaimLocationList.length > 0) {
                    var checkedRejectedLocations = $scope.ClaimLocationList
                        .filter(pitem => pitem.IsChecked)
                        .map(pitem => pitem.ClinicId)
                        .join(",");
                }
                var Frezobj5 = {
                    "FromDate": $filter("date")(new Date($scope.SearchClaimListObj.FromDate), "MM-dd-yyyy") || '',
                    "ToDate": $filter("date")(new Date($scope.SearchClaimListObj.ToDate), "MM-dd-yyyy") || '',
                    "BillingProviderId": $scope.SearchClaimListObj.BillingProviderId || 0,
                    "ClaimTypeId": $scope.SearchClaimListObj.ClaimTypeId || 0,
                    "PayorObj": $scope.SearchClaimListObj.PayorObj || '',
                    "PayorId": $scope.SearchClaimListObj.PayorId || 0,
                    "RenderingProviderId": $scope.SearchClaimListObj.RenderingProviderId || 0,
                    "BillPaymentTypeId": $scope.SearchClaimListObj.BillPaymentTypeId || 0,
                    "checkedRejectedLocations": checkedRejectedLocations || '',
                    "TransmissionMethodId": $scope.SearchClaimListObj.TransmissionMethodId || 0,
                };
                eHnoteMasterDataService.addRejectedUsersList(Frezobj5);
            }
            var TempAddress = $filter("filter")($scope.ClaimLocationList, function (iterator, ind) { return iterator.ClinicId !== 0 && iterator.IsChecked; });
            var HospitalIDs = _.pluck(TempAddress, "BranchId").join(",");
            $scope.RejectedFollowUpsList = [];
            var params = {
                "OrganizationId": $scope.SearchClaimListObj.OrganizationId,
                "OrganizationFacilityId": $scope.SearchClaimListObj.OrganizationFacilityId || 0,
                "FromDate": $scope.SearchClaimListObj.FromDate,
                "ToDate": $scope.SearchClaimListObj.ToDate,
                "PatientId": $scope.SearchClaimListObj.PatientId || 0,
                "SearchText": $scope.SearchClaimListObj.SearchText || "",
                "PatientMRNo": $scope.SearchClaimListObj.PatientMRNo || "",
                "PatienClaimNumber": $scope.SearchClaimListObj.PatienClaimNumber || "",
                "BatchNumber": $scope.SearchClaimListObj.BatchNumber || "",
                "BillingProviderId": $scope.SearchClaimListObj.BillingProviderId || 0,
                "RenderingProviderId": $scope.SearchClaimListObj.RenderingProviderId || 0,
                "TransmissionTypeId": $scope.SearchClaimListObj.TransmissionMethodId || 0,
                "ClaimTypeId": $scope.SearchClaimListObj.ClaimTypeId || 0,
                "PayorId": $scope.SearchClaimListObj.PayorId || 0,
                "ClaimStatusList": $scope.SearchClaimListObj.ClaimStatusList,
                "PageSize": $scope.SearchClaimListObj.PageSize,
                "PageNumber": $scope.SearchClaimListObj.PageNumber,
                "Type": type,
                "Locationids": HospitalIDs,
                "BillPaymentTypeId": $scope.SearchClaimListObj.BillPaymentTypeId,
                "CurrentResponsibilityId": $scope.SearchClaimListObj.CurrentResponsibilityId || 0,
                "DenialId": $scope.SearchClaimListObj.DenialId || 0,
                "SortColumn": $scope.SearchClaimListObj.SortColumn,
                "SortOrder": $scope.SearchClaimListObj.SortOrder
            };

            eHnoteInsuranceService.Get277RejctedFollowupslist(params).then(function (resp) {
                if (resp.data.status == "Success") {
                    if (resp.data.rows.length > 0) {
                        $scope.SearchClaimListObj.Count = resp.data.count || 0;
                        $scope.RejectedFollowUpsList = resp.data.rows || [];
                    }
                    $scope.ClaimSubtabActive = angular.copy($scope.ClaimSubtabs) || 1;
                } else {
                    alertify.error(resp.data.Message);
                }
            }, function (err) {

            });
        }

        $scope.refresh999AckmntData = function () {
            $scope.Search999AckmtObj = angular.copy($scope.get999Ackowledgement());

            var Frezobj999 = {
                "FromDate": $filter("date")(new Date($scope.Search999AckmtObj.FromDate), "MM-dd-yyyy") || '',
                "ToDate": $filter("date")(new Date($scope.Search999AckmtObj.ToDate), "MM-dd-yyyy") || '',
                "StatusId": $scope.Search999AckmtObj.StatusId || 0,
            };
            eHnoteMasterDataService.add999AcknowledgementFilterList(Frezobj999);

            $scope.clearPatientSearchData();
            $scope.Search999AckDetails();
        }

        $scope.refreshClaimFollowupData = function () {
            $scope.SearchClaimFollowupObj = angular.copy($scope.getClaimFollowup());
            $scope.AllUsersListObj = angular.copy($scope.GetAllUsersListData());
            $scope.PatientSearchdata.SearchText = "";
            $scope.SearchClaimFollowupslist();
            if ($scope.AllHospitalData.AllUsersList.length > 0) {
                $scope.AllHospitalData.AllUsersList.forEach(function (item) {
                    item.IsChecked = false;
                    if ($scope.UserId === item.DoctorID) {
                        item.IsChecked = true;
                    }
                });
            }

            if ($scope.AllHospitalData.AllUsersList.length > 0) {
                var checkedlist = $scope.AllHospitalData.AllUsersList
                    .filter(pitem => pitem.IsChecked)
                    .map(pitem => pitem.DoctorID)
                    .join(",");
            }
            var FrezobjCFU = {
                "FromDate": $filter("date")(new Date($scope.SearchClaimFollowupObj.FromDate), "MM-dd-yyyy") || '',
                "ToDate": $filter("date")(new Date($scope.SearchClaimFollowupObj.ToDate), "MM-dd-yyyy") || '',
                "AssigntoIds": checkedlist || '',
            };
            eHnoteMasterDataService.addClaimFollowupFilterList(FrezobjCFU);
        }
        $scope.refreshClaimAdjustmentReqData = function () {
            $scope.SearchClaimAdjustReqObj = angular.copy($scope.getClaimAdjustmentReq());
            $scope.AllUsersListObj = angular.copy($scope.GetAllUsersListData());
            $scope.SearchClaimListObj = angular.copy($scope.GetClaimListObj());
            $scope.PatientSearchdata.SearchText = "";
            $scope.AllUsersListObj.IsChecked = true;

            // Doctors
            angular.forEach($scope.mainBillerDataObj.AllDoctorsList, function (item) {
                item.IsChecked = true;
            });
            $scope.SearchClaimListObj.AllDoctorsCheck = true;
            $scope.SearchClaimListObj.AllDoctorsString = 'All';
            $scope.changeDoctors();


            // Claim Responsibility
            angular.forEach($scope.ClaimDataList, function (item) {
                item.IsChecked = true;
            });
            $scope.ClaimRespListObj = { AllRespCheck: true, SelectRespString: 'All' };
            $scope.claimRespToggle();


            // Transmission (Format)
            angular.forEach($scope.ClaimFormatList, function (item) {
                item.IsChecked = true;
            });
            $scope.ClaimFormatListObj = { AllFormatCheck: true, SelectFormatString: 'All' };
            $scope.claimFormatToggle();

            if ($scope.AllHospitalData.AllUsersList.length > 0) {
                $scope.AllHospitalData.AllUsersList.forEach(function (item) {
                    item.IsChecked = true;
                    //if ($scope.UserId === item.DoctorID) {
                    //    item.IsChecked = true;
                    //}
                });
            }

            if ($scope.AllHospitalData.AllUsersList.length > 0) {
                var checkedlist = $scope.AllHospitalData.AllUsersList
                    .filter(pitem => pitem.IsChecked == true)
                    .map(pitem => pitem.DoctorID)
                    .join(",");
            }
            var FrezobjCFU = {
                "FromDate": $filter("date")(new Date($scope.SearchClaimAdjustReqObj.FromDate), "MM-dd-yyyy") || '',
                "ToDate": $filter("date")(new Date($scope.SearchClaimAdjustReqObj.ToDate), "MM-dd-yyyy") || '',
                "RequestedByUserId": checkedlist || '',
            };
            eHnoteMasterDataService.addClaimAdjustReqFilterList(FrezobjCFU);
            $scope.SearchAdjustmentReqslist(1);
        }

        //$scope.refreshClaimAcknowledgementReqData = function () {
        //    $scope.SearchClaimAcknowledgementReqObj = angular.copy($scope.getClaimAcknowledgementReq());

        //    $scope.PatientSearchdata.SearchText = "";


        //    var FrezobjCFU = {
        //        "FromDate": $filter("date")(new Date($scope.SearchClaimAcknowledgementReqObj.FromDate), "MM-dd-yyyy") || '',
        //        "ToDate": $filter("date")(new Date($scope.SearchClaimAcknowledgementReqObj.ToDate), "MM-dd-yyyy") || '',
        //        "StatusId": '5,6',
        //    };
        //    eHnoteMasterDataService.addClaimAcknowledgementReqFilterList(FrezobjCFU);
        //    $scope.SearchAcknowledgementReqslist();
        //}

        $rootScope.$on('ClaimClose', function (event, data) {
            data = data || "";
            console.log('1');
            if (data === 'CloseClaimPopup') {
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
            }
        });


        $scope.SearchClaimFollowupslist = function () {

            if ($scope.AllHospitalData.AllUsersList.length > 0) {
                var checkedlist = $scope.AllHospitalData.AllUsersList
                    .filter(pitem => pitem.IsChecked)
                    .map(pitem => pitem.DoctorID)
                    .join(",");
            }
            var FrezobjCFU = {
                "FromDate": $filter("date")(new Date($scope.SearchClaimFollowupObj.FromDate), "MM-dd-yyyy") || '',
                "ToDate": $filter("date")(new Date($scope.SearchClaimFollowupObj.ToDate), "MM-dd-yyyy") || '',
                "AssigntoIds": checkedlist || '',
            };
            eHnoteMasterDataService.addClaimFollowupFilterList(FrezobjCFU);

            $scope.ClaimFollowupslist = [];

            var params = {
                "AssignedToUserId": $scope.SearchClaimFollowupObj.AllUserListData,
                "OrganizationId": $scope.HospitalId,
                "PatientId": $scope.SearchClaimFollowupObj.PatientId,
                "ClaimNumber": $scope.SearchClaimFollowupObj.ClaimNumber,
                "FromDate": $scope.SearchClaimFollowupObj.FromDate || "",
                "ToDate": $scope.SearchClaimFollowupObj.ToDate || "",
                "PayorId": $scope.SearchClaimFollowupObj.PayorId,
                "PageSize": $scope.SearchClaimFollowupObj.PageSize,
                "PageNumber": $scope.SearchClaimFollowupObj.PageNumber,
                "UserId": $scope.UserId,
                "SortColumn": $scope.SearchClaimFollowupObj.SortColumn,
                "SortOrder": $scope.SearchClaimFollowupObj.SortOrder,
            }

            eHnoteInsuranceService.GetClaimFollowupslist(params).then(function (resp) {
                if (resp.data.status == "Success") {
                    if (resp.data.rows.length > 0) {
                        $scope.ClaimFollowupslist = resp.data.rows || [];
                        $scope.SearchClaimFollowupObj.Count = resp.data.count || 0;

                    }
                    $scope.ClaimSubtabActive = angular.copy($scope.ClaimSubtabs) || 1;
                } else {
                    alertify.error(resp.data.Message);
                }
            }, function (err) {

            });
        }

        $scope.SearchAdjustmentReqslist = function (pageno) {

            $scope.SearchClaimAdjustReqObj.PageNumber = pageno || 1;

            if ($scope.AllHospitalData.AllUsersList.length > 0) {
                var checkedlist = $scope.AllHospitalData.AllUsersList
                    .filter(pitem => pitem.IsChecked == true)
                    .map(pitem => pitem.DoctorID)
                    .join(",");
            }
            var FrezobjCFU = {
                "FromDate": $filter("date")(new Date($scope.SearchClaimAdjustReqObj.FromDate), "MM-dd-yyyy") || '',
                "ToDate": $filter("date")(new Date($scope.SearchClaimAdjustReqObj.ToDate), "MM-dd-yyyy") || '',
                "RequestedByUserId": checkedlist || '',
                "BillingProviderId": $scope.SearchClaimListObj.BillingProviderId || 0,
                "PayorId": $scope.SearchClaimListObj.PayorId || 0,
                "RenderingProviderId": $scope.SearchClaimListObj.RenderingProviderId || 0,
                "Locationids": HospitalIDs,
                "BillPaymentTypeId": $scope.SearchClaimListObj.BillPaymentTypeId,
                "TransmissionTypeId": $scope.SearchClaimListObj.TransmissionMethodId || 0,
                "BatchNumber": $scope.SearchClaimListObj.BatchNumber || "",
                "RequestType": $scope.SearchClaimAdjustReqObj.RequestType || "",
                "CurrentResponsibilityId": $scope.SearchClaimListObj.CurrentResponsibilityId || 0,
                "ClaimTypeId": $scope.SearchClaimListObj.ClaimTypeId || 0
            };
            eHnoteMasterDataService.addClaimAdjustReqFilterList(FrezobjCFU);

            var TempAddress = $filter("filter")($scope.ClaimLocationList, function (iterator, ind) { return iterator.ClinicId !== 0 && iterator.IsChecked; });
            var HospitalIDs = _.pluck(TempAddress, "BranchId").join(",");

            $scope.ClaimAdjustmentsReqlist = [];

            var params = {
                "RequestedByUserId": checkedlist,
                "PatientId": $scope.SearchClaimAdjustReqObj.PatientId,
                "PatientClaimNumber": $scope.SearchClaimAdjustReqObj.PatientClaimNumber,
                "FromDate": $scope.SearchClaimAdjustReqObj.FromDate || "",
                "ToDate": $scope.SearchClaimAdjustReqObj.ToDate || "",
                "PageSize": $scope.SearchClaimAdjustReqObj.PageSize,
                "PageNumber": $scope.SearchClaimAdjustReqObj.PageNumber,
                "BillingProviderId": $scope.SearchClaimListObj.BillingProviderId || 0,
                "PayorId": $scope.SearchClaimListObj.PayorId || 0,
                "RenderingProviderId": $scope.SearchClaimListObj.RenderingProviderId || 0,
                "Locationids": HospitalIDs,
                "BillPaymentTypeId": $scope.SearchClaimListObj.BillPaymentTypeId,
                "TransmissionTypeId": $scope.SearchClaimListObj.TransmissionMethodId || 0,
                "BatchNumber": $scope.SearchClaimListObj.BatchNumber || "",
                "RequestType": $scope.SearchClaimAdjustReqObj.RequestType || "",
                "CurrentResponsibilityId": $scope.SearchClaimListObj.CurrentResponsibilityId || 0,
                "ClaimTypeId": $scope.SearchClaimListObj.ClaimTypeId || 0,
                "SortColumn": $scope.SearchClaimAdjustReqObj.SortColumn,
                "SortOrder": $scope.SearchClaimAdjustReqObj.SortOrder
            }

            eHnoteInsuranceService.GetAdjustmentsRequestClaims(params).then(function (resp) {
                if (resp.data.status == "Success") {
                    if (resp.data.rows.length > 0) {
                        $scope.ClaimAdjustmentsReqlist = resp.data.rows || [];


                        $scope.SearchClaimAdjustReqObj.Count = resp.data.count || 0;

                    }
                    $scope.ClaimSubtabActive = angular.copy($scope.ClaimSubtabs) || 1;
                    $scope.isClaimSummaryVisible = false;
                } else {
                    alertify.error(resp.data.Message);
                }
            }, function (err) {

            });
        }
        //$scope.SearchAcknowledgementReqslist = function () {



        //    var FrezobjCFU = {
        //        "FromDate": $filter("date")(new Date($scope.SearchClaimAcknowledgementReqObj.FromDate), "MM-dd-yyyy") || '',
        //        "ToDate": $filter("date")(new Date($scope.SearchClaimAcknowledgementReqObj.ToDate), "MM-dd-yyyy") || '',
        //        "StatusId": '5,6' || '',
        //    };
        //    eHnoteMasterDataService.addClaimAcknowledgementReqFilterList(FrezobjCFU);

        //    $scope.ClaimAcknowledgementReqlist = [];

        //    var params = {
        //        "OrganizationId":$scope.HospitalId,
        //        "StatusId": '5,6',
        //        "PatientId": $scope.SearchClaimAcknowledgementReqObj.PatientId,
        //        "PatientClaimNumber": $scope.SearchClaimAcknowledgementReqObj.PatientClaimNumber,
        //        "FromDate": $scope.SearchClaimAcknowledgementReqObj.FromDate || "",
        //        "ToDate": $scope.SearchClaimAcknowledgementReqObj.ToDate || "",
        //        "PageSize": $scope.SearchClaimAcknowledgementReqObj.PageSize,
        //        "PageNumber": $scope.SearchClaimAcknowledgementReqObj.PageNumber,
        //    }

        //    eHnoteInsuranceService.GetAcknowledgementClaims(params).then(function (resp) {
        //        if (resp.data.status == "Success") {
        //            if (resp.data.rows.length > 0) {
        //                $scope.ClaimAcknowledgementReqlist = resp.data.rows || [];
        //                $scope.getClaimAcknowledgementReq.Count = resp.data.count || 0;

        //            }

        //        } else {
        //            alertify.error(resp.data.Message);
        //        }
        //    }, function (err) {

        //    });
        //}

        $scope.GetPatientTransmitted = function (item) {

            var obj = {
                "UserId": $scope.UserId,
                "OrganizationId": $scope.HospitalId,
                "ClaimList": [
                    {
                        "PatientClaimId": item.PatientClaimId,
                        "PatientId": item.PatientId,
                        "AppointmentId": item.AppointmentId
                    }
                ]
            }

            eHnoteInsuranceService.GetSelectedQueueClaimsList(obj).then(function (resp) {
                if (resp.data.status == "Success") {
                    alertify.success("Claim Transmitted Successfully");
                    $scope.SearchAllClaimDetails(1, 'Queue');
                } else {
                    alertify.error(resp.data.Message);
                }
            }, function (err) {

            });
        }

        $scope.Removefromqueue = function (item) {

            alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to Change the status?</h4>", function () {

                var obj = {
                    "UserId": $scope.UserId,
                    "OrganizationId": $scope.HospitalId,
                    "PatientClaimId": item.PatientClaimId,
                    "ClaimStatusId": 1,
                    "ClaimStatus": "Not Transmitted",
                }

                eHnoteInsuranceService.UpdatePatientClaimStatusById(obj).then(function (resp) {
                    if (resp.data.Status == "Success") {
                        $scope.SearchAllClaimDetails(1, 'Queue');
                    } else {
                        alertify.error(resp.data.Message);
                    }
                }, function (err) {

                });

                $scope.$apply();
            }, function () {

            });


        }
        $scope.$watch('OrgClaimListdata', function (newVal, oldVal) {
            $scope.claimCheckedCount();
        }, true);

        $scope.GetPatientMultipleTransmitted = function () {
            let ClaimList = [];
            $scope.claimCheckedCount();
            if ($scope.OrgClaimListdata.length > 0) {
                var filtredArray = $filter("filter")($scope.OrgClaimListdata, { "IsActive": true }, true) || [];
                if (filtredArray.length > 0) {
                    angular.forEach(filtredArray, function (item) {
                        let obj = {
                            "PatientClaimId": item.PatientClaimId,
                            "PatientId": item.PatientId,
                            "AppointmentId": item.AppointmentId
                        }
                        ClaimList.push(obj)
                    })
                }
                if (ClaimList.length == 0) {
                    alertify.error("Please select Claim");
                    return false;
                }

            }
            var obj = {
                "UserId": $scope.UserId,
                "OrganizationId": $scope.HospitalId,
                "ClaimList": ClaimList || []
            }

            eHnoteInsuranceService.GetSelectedQueueClaimsList(obj).then(function (resp) {
                if (resp.data.status == "Success") {
                    alertify.success("Claim Transmitted Successfully");
                    $scope.SearchAllClaimDetails(1, 'Queue');
                } else {
                    alertify.error(resp.data.Message);
                }
            }, function (err) {

            });
        }

        $scope.navtoOpenAddDepositAmount = function (obj) {

            alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>There is a patient balance observed in the claim " + obj.PatientClaimNumber + ", do you want to add the payment and settle it?</h4>", function () {

                $scope.obj = {
                    "PatientId": obj.Patientobj.PatientId,
                    "Type": '',
                    "UsersList": obj.UsersList,
                    "Patientobj": obj.Patientobj,
                    "ClaimDetailsList": obj.ClaimDetailsList,
                    "OrganizationFacilityList": obj.OrganizationFacilityList,
                    "DepositTypes": obj.DepositTypes,
                    "WriteOffReasons": obj.WriteOffReasons,
                    "BillingProviderName": obj.BillingProviderName || "",
                    "FacilityName": obj.FacilityName || "",
                    "PatientClaimNumber": obj.PatientClaimNumber || 0
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

                }, function () { });

                $scope.$apply();
            }, function () {

            });
        }
        $scope.ChangeAllUserlist = function (item) {

            $scope.AssignedToUserId = item.DoctorID;
            if (item.DoctorID === 0) {
                if (item.DoctorID === 0 && item.selected) {
                    angular.forEach($scope.AllHospitalData.AllDoctorsList, function (item) {
                        item.selected = true;
                    });
                } else {
                    angular.forEach($scope.AllHospitalData.AllDoctorsList, function (item) {
                        item.selected = false;
                    });
                }
            }

        }

        $scope.SelectAllClaims = function () {
            $scope.OrgClaimListdata = $scope.OrgClaimListdata || [];
            if ($scope.OrgClaimListdata.length > 0) {
                angular.forEach($scope.OrgClaimListdata, function (item) {
                    if ($scope.SearchClaimListObj.IsActive) {
                        item.IsActive = true;
                    } else {
                        item.IsActive = false;
                    }
                });
            }
        }



        //$scope.DeletePatientClaim = function (item, type) {

        //    item.TotalPatientPayment = item.TotalPatientPayment || 0;

        //    function openDeletePopup() {

        //        var confirmMessage = "";

        //        if (item.TotalPatientPayment !== 0) {
        //            confirmMessage =
        //                "<b class='txt-centre'>Confirm!</b>" +
        //                "<h4 class='txt-body-centre'>" +
        //                "Patient payment already posted. Deleting may affect balances and history.<br/><br/>" +
        //                "Are you sure you want to delete this claim?" +
        //                "</h4>";
        //        } else {
        //            confirmMessage =
        //                "<b class='txt-centre'>Confirm!</b>" +
        //                "<h4 class='txt-body-centre'>" +
        //                "Are you sure you want to delete this claim?" +
        //                "</h4>";
        //        }

        //        confirmMessage += `
        //<div style="margin-top:10px;text-align:left">
        //    <label><b>Remarks: <span style="color:red">*</span></b></label>
        //    <textarea id="deleteRemarks" class="form-control" rows="3"
        //    placeholder="Enter remarks..."
        //    style="width:100%;border:1px solid #ced4da;border-radius:6px;padding:8px;"></textarea>
        //</div>
        //`;

        //        alertify.confirm(confirmMessage, function () {

        //            var remarks = document.getElementById("deleteRemarks").value.trim();

        //            // ❌ If empty reopen popup again
        //            if (!remarks) {
        //                alertify.error("Please enter remarks");
        //                setTimeout(function () {
        //                    openDeletePopup(); // reopen popup again
        //                }, 10);
        //                return;
        //            }

        //            // ✅ delete api
        //            var obj = {
        //                "UserId": $scope.UserId,
        //                "OrganizationId": $scope.HospitalId,
        //                "PatientClaimId": item.PatientClaimId,
        //                "DeleteInd": "Y",
        //                "Remarks": remarks
        //            };

        //            eHnoteInsuranceService.DeletePatientClaim(obj).then(function (resp) {

        //                if (resp.data.Status == "Success") {
        //                    alertify.success("Claim deleted successfully");
        //                    $scope.SearchAllClaimDetails(1, type);
        //                } else {
        //                    alertify.error(resp.data.Message);
        //                }

        //            }, function () {
        //                alertify.error("Error while deleting claim");
        //            });

        //            $scope.$apply();

        //        }, function () {
        //            // cancel
        //        });
        //    }

        //    // open first time
        //    openDeletePopup();
        //};

        $scope.DeletePatientClaim = function (item, type) {

            let mInstanceAdd = $uibModal.open({
                "templateUrl": "DeleteClaimPopup.html",
                "backdrop": "static",
                "keyboard": false,
                "scope": $scope,
                "windowClass": "claimDeletePopupWrapper",
                "resolve": {
                    "ClaimObj": function () { return item; },
                },
                controller: function ($scope, $uibModalInstance, ClaimObj) {

                    ClaimObj.TotalPatientPayment = ClaimObj.TotalPatientPayment || 0;

                    $scope.deleteObj = {
                        remarks: "",
                        TotalPatientPayment: ClaimObj.TotalPatientPayment,
                    };

                    $scope.closePopup = function () {
                        $uibModalInstance.dismiss("cancel");
                    };

                    $scope.confirmDelete = function () {

                        if (!$scope.deleteObj.remarks || $scope.deleteObj.remarks.trim() === "") {
                            alertify.error("Please enter remarks");
                            return;
                        }

                        var obj = {
                            "UserId": $scope.UserId,
                            "OrganizationId": $scope.HospitalId,
                            "PatientClaimId": item.PatientClaimId,
                            "DeleteInd": "Y",
                            "Remarks": $scope.deleteObj.remarks
                        };

                        eHnoteInsuranceService.DeletePatientClaim(obj).then(function (resp) {

                            if (resp.data.Status == "Success") {

                                alertify.success("Claim deleted successfully");                 
                                $scope.claimScreenParentObj = datapersistanceFactory.getItem("IsComingFromClaim");
                                $scope.claimScreenParentObj.PatientClaimId = null;
                                datapersistanceFactory.set("IsComingFromClaim", $scope.claimScreenParentObj);
                                $uibModalInstance.close();
                                $scope.SearchAllClaimDetails(1, type);

                            } else {
                                alertify.error(resp.data.Message);
                            }

                        }, function () {
                            alertify.error("Error while deleting claim");
                        });
                    };
                }
            });
        };


        $scope.GetAllUsersListData = function () {
            return {
                "SelectStatus": "Select",
                "FullName": "",
                "IsChecked": false
            };
        };
        $scope.AllUsersListObj = angular.copy($scope.GetAllUsersListData());

        $scope.checkAllUsersList = function (val) {
            if (val) {
                angular.forEach($scope.AllHospitalData.AllUsersList, function (item) {
                    item.IsChecked = true;
                });

                $scope.AllUsersListObj.SelectStatus = 'All';
            }
            else {
                angular.forEach($scope.AllHospitalData.AllUsersList, function (item) {
                    item.IsChecked = false;
                });

                $scope.AllUsersListObj.SelectStatus = 'Selected';
            }
            $scope.AllUsersToggle();
        };
        $scope.stopClosingDropDown = function (event) {
            event.stopPropagation();
        }
        $scope.AllUsersToggle = function (obj) {
            var checkedArray = _.where($scope.AllHospitalData.AllUsersList, { IsChecked: true });
            $scope.AllUsersListObj.IsChecked = checkedArray.length > 0 && $scope.AllHospitalData.AllUsersList.length === checkedArray.length ? true : false;
            if ($scope.AllUsersListObj.IsChecked) {
                $scope.AllUsersListObj.SelectStatus = 'All';
                $scope.SearchClaimFollowupObj.AllUserListData = checkedArray.map(function (status) {
                    return status.DoctorID;
                }).join(',');
                console.log($scope.SearchClaimFollowupObj.AllUserListData);
            }

            if (!$scope.AllUsersListObj.IsChecked && checkedArray.length > 0) {
                $scope.AllUsersListObj.SelectStatus = 'Selected';
                $scope.SearchClaimFollowupObj.AllUserListData = checkedArray.map(function (status) {
                    return status.DoctorID;
                }).join(',');
                console.log($scope.SearchClaimFollowupObj.AllUserListData);
            }
            if (!$scope.AllUsersListObj.IsChecked && checkedArray.length === 0) {
                $scope.AllUsersListObj.SelectStatus = 'Select';
                $scope.SearchClaimFollowupObj.AllUserListData = checkedArray.map(function (status) {
                    return status.DoctorID;
                }).join(',');
                console.log($scope.SearchClaimFollowupObj.AllUserListData);
            }
        };

        $scope.navtocreatecaim = function (item) {

            let obj = {
                "PatientId": item.PatientId,
                "PatientFullName": item.PatientFullName,
                "PatientDisplayID": item.PatientMrNo,
                "StatusId": 2,
                "MasterPriority": $scope.MasterPriority,
                "MasterAlertTypes": $scope.MasterAlertTypes,
                "MasterAlertTag": $scope.MasterAlertTag,
                "MasterAlertNoteType": $scope.MasterAlertNoteType,
            }

            let mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/UsClaims/AddUpdatePatientAlerts.html",
                "controller": "USPatientAlertsCtrl",
                //"size": "lg",
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
        };

        $scope.ClaimObjecDate = {
            "ClaimExpiryDate": null,
        }

        $scope.calculateExpiryDate = function () {

            var currentDate = new Date();

            currentDate.setDate(currentDate.getDate() + 90);

            var expiryMonth = currentDate.getMonth() + 1;
            var expiryDay = currentDate.getDate();
            var expiryYear = currentDate.getFullYear();

            expiryMonth = expiryMonth < 10 ? '0' + expiryMonth : expiryMonth;
            expiryDay = expiryDay < 10 ? '0' + expiryDay : expiryDay;

            $scope.ClaimObjecDate.ClaimExpiryDate = `${expiryMonth}-${expiryDay}-${expiryYear}`;
        };

        $scope.allFilterPopover = {
            templateUrl: 'allFilterPopover.html',
        };
        $scope.allFilterPopoverSecondary = {
            templateUrl: 'allFilterPopoverSecondary.html',
        };
        $scope.transmittedFilterPopover = {
            templateUrl: 'transmittedFilterPopover.html',
        };
        $scope.notSubmittedFilterPopover = {
            templateUrl: 'notSubmittedFilterPopover.html',
        };
        $scope.denialFollowupsFilterPopover = {
            templateUrl: 'denialFollowupsFilterPopover.html',
        };
        $scope.rejectedFolloupsFilterPopover = {
            templateUrl: 'rejectedFolloupsFilterPopover.html',
        };
        $scope.acck277FilterPopover = {
            templateUrl: 'acck277FilterPopover.html',
        };
        $scope.queueFilterPopover = {
            templateUrl: 'queueFilterPopover.html',
        };
        $scope.DenialpopoverContent = {
            templateUrl: 'DenialpopoverContent.html',
        };
        $scope.adjustmentRequestFilterPopover = {
            templateUrl: 'adjustmentRequestFilterPopover.html',
        };

        $scope.denialFollowupFromToCalender = {
            templateUrl: 'templates/UIBPopovers/fromToCalender.html',
        };
        $scope.activePopoverIndex = null;
        $scope.toggleDenialPopover = function (item, index) {
            $scope.denialCodes = item.ClaimDenials || [];
            if ($scope.activePopoverIndex === index) {
                $scope.activePopoverIndex = null;
            } else {
                $scope.activePopoverIndex = index;
            }
        };

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

        $scope.closeFilterPopover = function () {
            angular.element(document.querySelector('.popover')).remove();
        };

        /*Claims Split Screen*/
        $scope.isOpenClaimsList = false;

        $scope.openPanel = function (item) {
            $scope.isOpenClaimsList = true;
        };

        $scope.closePanel = function () {
            $scope.isOpenClaimsList = false;
        };
        $scope.claimsFilterPopup = function () {
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "Claimsfilterpopup.html",
                //"size": "lg",
                "backdrop": "static",
                "keyboard": false,
                "scope": $scope,
                "windowClass": "right-to-left-modal offcanves-right modal__width--30",
                "controller": function ($scope, $uibModal, $uibModalInstance) {
                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };

                }
            });
        };
        /*Claims Split Screen*/














        $scope.navtoGenerateClaim = function (type, item, VisitItem, typeid) {
            item = item || '';
            typeid = typeid || 0;
            item.IsFrom = item.IsFrom || "";
            item.ResponcibilityId = item.ResponcibilityId || 0;
            if (item.IsFrom === "ManualBill") {
                item.ResponcibilityId = 1;
            }
            VisitItem = VisitItem || '';
            $scope.filterlist = [];
            item.SuperBillArray = item.SuperBillArray || [];
            if (item.SuperBillArray.length > 0) {
                $scope.filterlist = $filter('filter')(item.SuperBillArray, { 'DeleteInd': 'N' }, true) || [];
                //if ($scope.filterlist.length > 0 && item.ResponcibilityId == 0) {
                //    alertify.error("Please select claim responsibility.");
                //    return false;
                //}
            }
            //else if (item.ResponcibilityId == 0 && typeid == 1) {
            //    alertify.error("Please select claim responsibility.");
            //    return false;
            //}

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
                        //alertify.error("The selected responsibility not existed");
                        //return false;
                    }
                }
            } else if (item.ResponcibilityId !== 0 && typeid == 1) {
                //alertify.error("The selected responsibility not existed");
                //return false;
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
                "OrganizationFacilityId": item.OrganizationFacilityId || 0,
                "AppointmentDoctorId": item.AppointmentDoctorId || item.DoctorID,
                "IsResponsibilitySame": item.IsResponsibilitySame,
                "SuperBillRemarks": item.SuperBillRemarks,
                "AppointmentTypeId": item.AppointmentTypeId || null,
            };

            datapersistanceFactory.set("IsComingFromClaim", $scope.claimScreenParentObj);
            item.ScreenType = item.ScreenType || 0;
            if (item.ScreenType == 3) {
                $scope.mainBillerDataObj.Tabid = 3;
            } else {
                $scope.mainBillerDataObj.Tabid = 1;
            }


            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/UsClaims/AddUpdateClaimPopup.html",
                "controller": "UsAddUpdateClaimPopupCtrl",
                "keyboard": false,
                'backdrop': 'static',
                "windowClass": "modal__popup--1",
                "resolve": {
                    "mainBillerDataObj": function () { return $scope.mainBillerDataObj; },
                }
            });
            $scope.mInstanceAdd.result.then(function (resp) {
                $scope.SearchAllClaimDetails(1, "All");
                console.log(resp);
                // $scope.subinit();
            }, function () { });
        }


        $scope.navtoSuperViewpopup = function (visit, item) {
            var obj = {
                "SuperBillId": visit.SuperbillId || 0,
                "AppointmentId": item.AppointmentId || 0,
                "PatientObj": item.Patient || 0,
                "item": item || 0,
            };

            let signmodalInstance = $uibModal.open({
                "templateUrl": "templates/UsClaims/SuperbillViewPopup.html",
                "size": "md",
                "windowClass": "modal__ninety--",
                "scope": $scope,
                "backdrop": "static",
                "keyboard": false,
                "resolve": {
                    "obj": function () { return obj; }
                },
                "controller": function ($scope, $uibModal, $uibModalInstance, obj, eHnoteInsuranceService, eHnoteMasterDataService, eHnoteDiagnosisDataServices) {

                    $scope.doctorinfo = eHnoteMasterDataService.getUserInfo();
                    $scope.HospitalId = 0;
                    $scope.ParentHospitalId = 0;
                    if ($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode
                        && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID) {
                        $scope.HospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
                        $scope.ParentHospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
                    }
                    $scope.IsResponsibilitySame = false;
                    $scope.obj = obj;
                    $scope.closeuibpopup = function () {
                        $uibModalInstance.close("cancel");
                    }

                    $scope.SelectedSuperbillObj = {
                        "PatientDOB": "",
                        "PatientFullName": "",
                        "PatientGender": "",
                        "IsCheckAllPayments": false,
                        "PatientId": null,
                        "VisitId": null,
                        "SuperBillId": null,
                        "AppointmentId": null,
                        "AppointmentDoctorId": null,
                        "PatientMrNo": "",
                        "PatientMobile": "",
                        "AppointmentId": "",
                        "EncounterStatus": "",
                        "EncounterStatusId": 7,
                        "AppointmentInsuranceList": [],
                        "SuperBillArray": [],
                        "SuperBillDiagnosisArray": [],
                        "AvailableDeposit": 0,
                        "TotalPatientDue": 0,
                        "UnallocatedAmount": 0,
                        "InsuranceBalance": 0


                    }

                    $scope.ClaimResponsibilityId = null;
                    $scope.subinit = function (val) {
                        $scope.Iscmngfrom = val || '';
                        $scope.ResponsibilityArray = [];

                        let obj = {
                            "SuperBillId": $scope.obj.SuperBillId,
                            "AppointmentId": $scope.obj.AppointmentId,
                            "PatientId": $scope.obj.PatientObj.PatientId,
                        }

                        $q.all([

                            eHnoteSettingsDataService.GetAllMasterClaimsData($scope.HospitalId),
                            eHnoteInsuranceService.GetOrganizationSuperBillsSuperBillId(obj),



                        ]).then(function (resp) {
                            if (resp[0].data.status == "Success") {
                                resp[0].data.rows = resp[0].data.rows || [];

                                $scope.ClaimResponsibilities = resp[0].data.MasterClaimResponsibility || [];
                                $scope.TempClaimResponsibilities = resp[0].data.MasterClaimResponsibility || [];


                            }

                            if (resp[1].data.status == "Success") {

                                $scope.SelectedSuperbillObj.AvailableDeposit = resp[1].data.TotalDepositAvailable;
                                $scope.SelectedSuperbillObj.TotalPatientDue = resp[1].data.TotalPatientBalance;
                                $scope.SelectedSuperbillObj.UnallocatedAmount = resp[1].data.TotalUnAllocatedAmount;
                                $scope.SelectedSuperbillObj.InsuranceBalance = resp[1].data.TotalPatientInsuranceBalance;
                                if (resp[1].data.rows.length > 0) {
                                    $scope.selectedobj = resp[1].data.rows[0];
                                    $scope.SelectedSuperbillObj.VisitId = $scope.selectedobj.VisitId;
                                    $scope.SelectedSuperbillObj.AppointmentId = $scope.selectedobj.AppointmentId;
                                    $scope.SelectedSuperbillObj.AppointmentDoctorId = $scope.selectedobj.AppointmentDoctorId;
                                    $scope.SelectedSuperbillObj.PatientId = $scope.selectedobj.PatientId;
                                    $scope.SelectedSuperbillObj.PatientFullName = $scope.selectedobj.PatientFullName;
                                    $scope.SelectedSuperbillObj.PatientDOB = $scope.selectedobj.PatientDOB;
                                    $scope.SelectedSuperbillObj.PatientMrNo = $scope.selectedobj.PatientMrNo;
                                    $scope.SelectedSuperbillObj.PatientGender = $scope.selectedobj.PatientGender;
                                    $scope.SelectedSuperbillObj.PatientMobile = $scope.selectedobj.PatientMobile;
                                    if ($scope.SelectedSuperbillObj.PatientMobile != '') {
                                        var obj = eHnoteUserDataService.UsMobileFormatChange($scope.SelectedSuperbillObj.PatientMobile);
                                        $scope.SelectedSuperbillObj.PatientMobile = obj.UsFormatMobileNumber;
                                    }
                                    $scope.SelectedSuperbillObj.EncounterStatusId = $scope.selectedobj.EncounterStatusId;
                                    $scope.SelectedSuperbillObj.EncounterStatus = $scope.selectedobj.EncounterStatus;
                                    $scope.SelectedSuperbillObj.SuperBillRemarks = $scope.selectedobj.SuperBillRemarks;
                                    $scope.SelectedSuperbillObj.SuperBillId = $scope.selectedobj.SuperBillId;
                                    $scope.SelectedSuperbillObj.SuperBillDiagnosisArray = angular.copy($scope.selectedobj.SuperBillDiagnosisArray) || [];
                                    $scope.SelectedSuperbillObj.SuperBillArray = $scope.selectedobj.SuperBillArray || [];
                                    $scope.SelectedSuperbillObj.AppointmentInsuranceList = $scope.selectedobj.AppointmentInsuranceList || [];
                                    if ($scope.SelectedSuperbillObj.SuperBillArray.length > 0) {
                                        angular.forEach($scope.SelectedSuperbillObj.SuperBillArray, function (item) {
                                            //  item.ResponcibilityId = null;
                                            item.IsChecked = true;

                                            if (item.DiagnosisArray && item.DiagnosisArray.length > 0) {
                                                // Extract all ICD10CODEs and join them with commas
                                                item.diasisgonpointer = item.DiagnosisArray
                                                    .map(function (d) { return d.ICD10CODE; })
                                                    .join(",");
                                            } else {
                                                item.diasisgonpointer = ""; // No diagnosis codes
                                            }
                                            if (item.Modifiers && item.Modifiers.length > 0) {
                                                item.modifierpointer = item.Modifiers
                                                    .map(function (m) { return m.ModifierCode; })
                                                    .join(",");
                                            } else {
                                                item.modifierpointer = "";
                                            }
                                        });


                                        $scope.ResponsibilityArray = [];

                                        angular.forEach($scope.SelectedSuperbillObj.SuperBillArray, function (item) {
                                            item.ResponcibilityId = item.ResponcibilityId || null;
                                            if (item.ResponcibilityId == null) {
                                                item.ResponcibilityId = 2;
                                                // return;
                                            }
                                            var exists = $scope.ResponsibilityArray.some(function (r) {
                                                return r.ResponcibilityId === item.ResponcibilityId;
                                            });
                                            if (!exists) {
                                                $scope.ResponsibilityArray.push({
                                                    ResponcibilityId: item.ResponcibilityId,
                                                    ResponcibilityName: item.ResponcibilityName
                                                });
                                            }
                                        });

                                        if ($scope.ResponsibilityArray.length == 1) {
                                            $scope.ClaimResponsibilityId = $scope.ResponsibilityArray[0].ResponcibilityId;
                                        }

                                    } else {
                                        if ($scope.Iscmngfrom == "Refresh") {
                                            $uibModalInstance.close("cancel");
                                        }

                                    }

                                }
                            }

                        });
                    }
                    $scope.subinit();


                    $scope.onselectResp = function (item) {

                        const activeIns = $filter("filter")($scope.SelectedSuperbillObj.AppointmentInsuranceList, { StatusId: 1 }) || [];

                        if ([2, 3, 7].includes(item.ResponcibilityId) && activeIns.length === 0) {
                            item.ResponcibilityId = 1;
                            alertify.error("There is no insurance available");
                            return false;
                        }

                        var filteredArray = $filter("filter")($scope.ClaimResponsibilities, { "ResponcibilityId": item.ResponcibilityId }, true);
                        if (filteredArray.length > 0) {
                            item.ResponcibilityName = filteredArray[0].ResponcibilityName;
                        }
                        $scope.ResponsibilityArray = [];
                        angular.forEach($scope.SelectedSuperbillObj.SuperBillArray, function (item) {
                            item.ResponcibilityId = item.ResponcibilityId || null;
                            if (item.ResponcibilityId == null) {
                                item.ResponcibilityId = 2;
                            }
                            var exists = $scope.ResponsibilityArray.some(function (r) {
                                return r.ResponcibilityId === item.ResponcibilityId;
                            });
                            if (!exists) {
                                $scope.ResponsibilityArray.push({
                                    ResponcibilityId: item.ResponcibilityId,
                                    ResponcibilityName: item.ResponcibilityName
                                });
                            }
                        });
                        if ($scope.ResponsibilityArray.length == 1) {
                            $scope.ClaimResponsibilityId = $scope.ResponsibilityArray[0].ResponcibilityId;
                        }
                    }
                    //$scope.onselectResponsibility = function (item) {
                    //    const claimLines = $scope.SelectedSuperbillObj.SuperBillArray || [];
                    //    const activeIns = $filter("filter")($scope.SelectedSuperbillObj.AppointmentInsuranceList, { StatusId: 1 }) || [];

                    //    if ([2, 3].includes(item.ResponcibilityId) && activeIns.length === 0) {
                    //        item.ResponcibilityId = 0;
                    //        alertify.error("There is no insurance available");
                    //    }

                    //    const firstResId = claimLines[0]?.ResponcibilityId || 0;
                    //    const filteredItems = claimLines.filter(cl => cl.ServiceId !== 0);
                    //    const isSame = filteredItems.every(cl => cl.ResponcibilityId === firstResId);

                    //    $scope.IsResponsibilitySame = isSame;
                    //    $scope.ClaimResponsibilityId = firstResId;
                    //};

                    $scope.Changeitem = function (item) {
                        var checkedArray = _.where($scope.SelectedSuperbillObj.SuperBillArray, { IsChecked: true });
                        $scope.SelectedSuperbillObj.IsCheckAllPayments = checkedArray.length > 0 && $scope.SelectedSuperbillObj.SuperBillArray.length === checkedArray.length ? true : false;
                    }







                    $scope.SelectAllPayments = function () {
                        angular.forEach($scope.SelectedSuperbillObj.SuperBillArray, function (item) {
                            if ($scope.SelectedSuperbillObj.IsCheckAllPayments) {
                                item.IsChecked = true;
                            } else {
                                item.IsChecked = false;
                            }
                        });
                    }


                    $scope.navtoGenerateClaimpopup = function (type, item, VisitItem, typeid) {
                        item = item || '';
                        typeid = typeid || 0;
                        item.IsFrom = item.IsFrom || "";
                        item.ResponcibilityId = item.ResponcibilityId || 0;
                        if (item.IsFrom === "ManualBill") {
                            item.ResponcibilityId = 1;
                        }
                        VisitItem = VisitItem || '';
                        $scope.filterlist = [];
                        item.SuperBillArray = item.SuperBillArray || [];
                        if (item.SuperBillArray.length > 0) {
                            $scope.filterlist = $filter('filter')(item.SuperBillArray, { 'DeleteInd': 'N' }, true) || [];
                            //if ($scope.filterlist.length > 0 && item.ResponcibilityId == 0) {
                            //    alertify.error("Please select claim responsibility.");
                            //    return false;
                            //}
                        }
                        //else if (item.ResponcibilityId == 0 && typeid == 1) {
                        //    alertify.error("Please select claim responsibility.");
                        //    return false;
                        //}

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
                                    //alertify.error("The selected responsibility not existed");
                                    //return false;
                                }
                            }
                        } else if (item.ResponcibilityId !== 0 && typeid == 1) {
                            //alertify.error("The selected responsibility not existed");
                            //return false;
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
                            "AppointmentTypeId": item.AppointmentTypeId || $scope.obj.item.AppointmentTypeId,
                            "AppointmentDate": item.AppointmentDate || $scope.obj.item.AppointmentDate,
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
                            "OrganizationFacilityId": item.OrganizationFacilityId || 0,
                            "AppointmentDoctorId": item.AppointmentDoctorId || item.DoctorID,
                            "IsResponsibilitySame": item.IsResponsibilitySame,
                            "SuperBillRemarks": item.SuperBillRemarks
                        };

                        datapersistanceFactory.set("IsComingFromClaim", $scope.claimScreenParentObj);
                        item.ScreenType = item.ScreenType || 0;
                        if (item.ScreenType == 3) {
                            $scope.mainBillerDataObj.Tabid = 3;
                        } else {
                            $scope.mainBillerDataObj.Tabid = 1;
                        }


                        $scope.mInstanceAdd = $uibModal.open({
                            "templateUrl": "templates/UsClaims/AddUpdateClaimPopup.html",
                            "controller": "UsAddUpdateClaimPopupCtrl",
                            "keyboard": false,
                            'backdrop': 'static',
                            "windowClass": "modal__popup--1",
                            "resolve": {
                                "mainBillerDataObj": function () { return $scope.mainBillerDataObj; },
                            }
                        });
                        $scope.mInstanceAdd.result.then(function (resp) {

                            console.log(resp);
                            $scope.subinit("Refresh");
                        }, function () { });
                    }

                    $scope.CreateClaim = function (val) {


                        $scope.ClaimResponsibilityId = val || null;

                        if ($scope.ResponsibilityArray.length === 0) {
                            var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>This patient has no service line items. Do you still want to create the claim?</h4>", function () {

                                let obj = {
                                    "AppointmentDate": $scope.obj.item.AppointmentDate,
                                    "AppointmentTypeId": $scope.obj?.item?.AppointmentTypeId || null,
                                    "ResponcibilityId": $scope.ClaimResponsibilityId || null,
                                    "PatientId": $scope.SelectedSuperbillObj.PatientId || null,
                                    "PatientFullName": $scope.SelectedSuperbillObj.PatientFullName || "",
                                    "AppointmentId": $scope.SelectedSuperbillObj.AppointmentId || null,
                                    "AppointmentDoctorId": $scope.SelectedSuperbillObj.AppointmentDoctorId || null,
                                    "ScreenType": "saveandcreate",
                                    "SuperBillArray": [],
                                    "SuperBillId": $scope.SelectedSuperbillObj.SuperBillId || null,
                                    "SuperBillDiagnosisArray": [],
                                    "IsFrom": ""
                                }

                                $scope.CreateClaimLinkInd = true;
                                $scope.navtoGenerateClaim("AddClaim", obj);
                                $uibModalInstance.dismiss("cancel");
                            }, function () {
                                r = "You pressed Cancel!";
                            });
                            $scope.CreateClaimLinkInd = false;
                            return false;
                        }

                        const typeMap = {};
                        let nextTypeCode = 65;

                        function normalizeDiagnosisTypes(superBillArray) {

                            angular.forEach(superBillArray, function (item) {
                                angular.forEach(item.DiagnosisArray, function (d) {

                                    if (!d.DiagnosisId) return;

                                    let cleanedType = (d.Type || "").replace(/\u0000/g, "").trim();

                                    if (cleanedType && /^[A-Z]$/.test(cleanedType)) {
                                        typeMap[d.DiagnosisId] = cleanedType;
                                    }
                                });
                            });

                            angular.forEach(superBillArray, function (item) {
                                angular.forEach(item.DiagnosisArray, function (d) {

                                    if (!d.DiagnosisId) return;

                                    if (typeMap[d.DiagnosisId]) {
                                        d.Type = typeMap[d.DiagnosisId];
                                    } else {
                                        let newType = String.fromCharCode(nextTypeCode++);
                                        typeMap[d.DiagnosisId] = newType;
                                        d.Type = newType;
                                    }
                                });
                            });
                        }


                        normalizeDiagnosisTypes($scope.SelectedSuperbillObj.SuperBillArray);

                        if ($scope.SelectedSuperbillObj.SuperBillDiagnosisArray.length === 0) {

                            angular.forEach($scope.SelectedSuperbillObj.SuperBillArray, function (item) {
                                angular.forEach(item.DiagnosisArray, function (aitem) {

                                    var obj = {
                                        "SuperBillDiagnosisId": aitem.SuperBillDiagnosisId || 0,
                                        "DiagnosisId": aitem.DiagnosisId,
                                        "DiagnosisName": aitem.ICD10DIAGDESCRIPTION,
                                        "DiagnosisNotes": "",
                                        "DiagnosisCode": aitem.ICD10CODE,
                                        "ICD10Code": aitem.ICD10CODE,
                                        "FullName": aitem.ICD10CODE + '-' + aitem.ICD10DIAGDESCRIPTION,
                                        "HospitalId": aitem.HospitalId || $scope.HospitalId,
                                        "UserId": aitem.UserId || $scope.UserId,
                                        "Type": aitem.Type,
                                        "DeleteInd": "N"
                                    };

                                    var exists = $scope.SelectedSuperbillObj.SuperBillDiagnosisArray
                                        .some(x => x.DiagnosisId === aitem.DiagnosisId);

                                    if (!exists) {
                                        $scope.SelectedSuperbillObj.SuperBillDiagnosisArray.push(obj);
                                    }
                                });
                            });
                        }

                        else {
                            angular.forEach($scope.SelectedSuperbillObj.SuperBillDiagnosisArray, function (d) {
                                if (!d.DiagnosisId) return;

                                let cleaned = (d.Type || "").replace(/\u0000/g, "").trim();

                                if (!cleaned || !/^[A-Z]$/.test(cleaned)) {
                                    d.Type = typeMap[d.DiagnosisId];
                                }
                            });
                        }


                        let reqObj = {
                            "UserId": $scope.UserId,
                            "AppointmentId": $scope.SelectedSuperbillObj.AppointmentId,
                            "VisitId": $scope.SelectedSuperbillObj.VisitId || 0,
                            "OrganizationId": $scope.HospitalId,
                            "SuperBillRemarks": $scope.SelectedSuperbillObj.SuperBillRemarks || "",
                            "SuperBillId": $scope.SelectedSuperbillObj.SuperBillId || null,
                            "SuperBillArray": $scope.SelectedSuperbillObj.SuperBillArray || [],
                            "SuperBillDiagnosisArray": $scope.SelectedSuperbillObj.SuperBillDiagnosisArray || [],
                            "EncounterStatusId": $scope.SelectedSuperbillObj.EncounterStatusId || 0,
                            "EncounterStatus": $scope.SelectedSuperbillObj.EncounterStatus || "",
                            "DeleteInd": "N"
                        }
                        eHnoteDiagnosisDataServices.AddupdateSuperBill(reqObj).then(function (resp) {
                            if (resp.data.Status === "Success") {

                                $scope.selectedobj.SuperBillDiagnosisArray = $scope.selectedobj.SuperBillDiagnosisArray || [];
                                if ($scope.selectedobj.SuperBillDiagnosisArray.length === 0) {
                                    angular.forEach($scope.SelectedSuperbillObj.SuperBillDiagnosisArray, function (d) {
                                        d.ICD10CODE = d.ICD10Code;
                                        d.ICD10DIAGDESCRIPTION = d.DiagnosisName;
                                    });
                                }

                                let obj = {
                                    "AppointmentDate": null,
                                    "ResponcibilityId": $scope.ClaimResponsibilityId || null,
                                    "PatientId": $scope.SelectedSuperbillObj.PatientId || null,
                                    "PatientFullName": $scope.SelectedSuperbillObj.PatientFullName || "",
                                    "AppointmentId": $scope.SelectedSuperbillObj.AppointmentId || null,
                                    "AppointmentDoctorId": $scope.SelectedSuperbillObj.AppointmentDoctorId || null,
                                    "ScreenType": "saveandcreate",
                                    "SuperBillArray": $scope.SelectedSuperbillObj.SuperBillArray || [],
                                    "SuperBillId": $scope.SelectedSuperbillObj.SuperBillId || null,
                                    "SuperBillDiagnosisArray": $scope.SelectedSuperbillObj.SuperBillDiagnosisArray || [],
                                    "IsFrom": "",
                                }

                                $scope.navtoGenerateClaimpopup("AddClaim", obj);

                            }
                        }, function (err) {
                            alertify.error("Fetching data failed!");

                        });



                    }
                }

            });
            signmodalInstance.result.then(function (resp) {
                $scope.SearchAllClaimDetails(1, "All");

            }, function (data) {

            });


        }

        $scope.clicktoNavtoAllAppointments = function () {

            $scope.encountermodelInstanceAdd = $uibModal.open({
                "templateUrl": "templates/UsClaims/AllEncountersPopup.html",
                "backdrop": "static",
                "scope": $scope,
                "keyboard": false,
                "windowClass": "modal__ninety--",
                "resolve": {
                    "AllHospitalData": function () { return $scope.mainBillerDataObj; },
                    "OrganizationFacilityList": function () { return $scope.OrganizationFacilityList; },
                    "AllVisitReasons": function () { return $scope.AllVisitReasons; },
                    "allSubSpecializationsArray": function () { return $scope.allSubSpecializationsArray || []; },
                },
                "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientDataService, AllHospitalData, OrganizationFacilityList, AllVisitReasons, allSubSpecializationsArray, eHnoteAdminDepartmentService, localStorageFactory, eHnoteUserAppointmentDataService, eHnoteMainAppointmentService, eHnotePatientVisitReasonServices) {

                    $scope.AllEncounterPatientList = [];
                    $scope.OPandOTAppointmentList = [];
                    $scope.AppListdoctoraddress = [];
                    $scope.clinicDoctorList = [];
                    $scope.selectedDoctor = "All Doctors";
                    $scope.OPandOTAppointmentListCount = 0;
                    $scope.OrganizationFacilityList = OrganizationFacilityList || [];
                    $scope.AllVisitReasonsList = AllVisitReasons || [];
                    $scope.allSubSpecializationsArray = allSubSpecializationsArray || [];
                    /* $scope.clinicDoctorList = AllHospitalData.AllDoctorsList || [];*/

                    $scope.clinicDoctorList = $filter("filter")(AllHospitalData.AllDoctorsList, function (item) {
                        return item.RoleId === 1 || item.RoleId === 43;
                    });

                    $scope.SelectedVisitReasonType = 'All';

                    let doctorInfo = eHnoteMasterDataService.getUserInfo();
                    $scope.DoctorId = doctorinfo.doctordata.User[0].DoctorID;
                    $scope.ClinicId = doctorinfo.doctordata.UserAddress[0].ClinicId;


                    function getSelectedPatientObj() {
                        var obj = {
                            "SearchText": "",
                            "PatientId": 0,
                            "SearchTypeId": 2,
                            "OrganizationFacilityId": "",
                            "PatientMRNo": "",
                            "DOB": "",
                            "PatientSearchInd": true,
                        }
                        return obj;
                    };
                    $scope.PatientSearchObj = getSelectedPatientObj();

                    $scope.selectedDoctor = {
                        "FullName": "All Doctors"
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
                        "AllBillingStatusCheck": true,
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

                    $scope.navtoSuperView = function (visit, item) {
                        let obj = {
                            "Type": "navtoSuperView",
                            "item": item,
                            "VisitItem": visit,
                        }
                        $uibModalInstance.close(obj);
                    }




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
                        /*$scope.searchradio.PatientSearchType = id;*/
                        $scope.PatientSearchObj.SearchTypeId = id;
                        $scope.AllPatientList = [];
                        $scope.AllEncounterPatientList = [];
                        if ($scope.PatientSearchObj.SearchText == '') {
                            $scope.ShowPatientDetailsDrop = false;
                        }

                    }



                    $scope.getDoctorsbySubSpecializations = function (hospitalID, val) {


                        $scope.BranchDoctorsList = [];
                        $scope.allUserList = [];
                        $scope.clinicDoctorList = [];
                        $scope.DoctorObj = "";

                        var listSubSplArray = $filter("filter")($scope.allSubSpecializationsArray, function (iterator, ind) { return iterator.isChecked === true; });
                        var subSplArray = _.pluck(listSubSplArray, "SubSpecializationId").join(",");

                        var reqObj = {
                            "BranchId": hospitalID,
                            "SubSpecializationIdArray": subSplArray || '',
                        }
                        eHnoteMainAppointmentService.getAllUsersByDepartmentId(reqObj, onGetUsersSuccess, onGetUsersFailure);
                        function onGetUsersSuccess(resp) {
                            if (resp.rows.length > 0) {
                                $scope.allUserList = resp.rows;


                                if ($scope.allUserList.length !== 0) {

                                    $scope.clinicDoctorList = angular.copy($scope.allUserList);
                                }

                                $scope.clinicDoctorList = $filter("filter")($scope.clinicDoctorList, function (item) {
                                    return item.RoleId === 1 || item.RoleId === 43;
                                });

                                $scope.clinicDoctorList = _.uniq($scope.clinicDoctorList, false, function (p) { return p.DoctorID; });
                                angular.forEach($scope.clinicDoctorList, function (ditem) {
                                    ditem.isChecked = true;
                                });
                                $scope.SelectedProvider = 'All Doctors';
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

                    $scope.SelectAllLocations = function (item, val) {

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

                    $scope.getvisitReasons = function (item, val) {

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
                            "HospitalId": null,
                            "DoctorId": DoctorIds || 0,
                            "GetAllDoctorIndictor": 0,
                            "AppointmentTypeId": $scope.AppointmentType.TypeId || 0,
                            "PatientId": $scope.PatientSearchObj.PatientId || 0,
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
                        var Index = $scope.clinicDoctorList.findIndex(record => record.DoctorID === eHnoteMasterDataService.getLoginId());
                        if (Index > -1) {
                            $scope.selectedDoctor = $scope.clinicDoctorList[Index] || "";
                            if ($scope.selectedDoctor != "") {
                                $scope.selectedDoctor.FullName = "All Doctors";
                            }
                        } else {
                            $scope.selectedDoctor = $scope.clinicDoctorList[0] || "";
                            if ($scope.selectedDoctor.DoctorID == 0) {
                                $scope.DoctorId = 0;
                            }
                        }
                        $scope.AllEncounterObj.AllDoctorCheck = true;
                        $scope.PageNumber = 1;
                        $scope.PageSize = 10;
                        $scope.PatientSearchObj.SearchTypeId = 2;
                        $scope.AppListselectedclinic = $scope.AllHospitalData.AllBranchesList[0];
                        if ($scope.AllHospitalData.AllBranchesList.length > 0) {
                            $scope.AllHospitalData.AllBranchesList[0].IsChecked = true;
                            $scope.SelectAllLocations($scope.AllHospitalData.AllBranchesList[0], 1);
                        }
                    }


                    $scope.clinicDoctorList = _.uniq($scope.clinicDoctorList, false, function (p) { return p.DoctorID; });
                    angular.forEach($scope.clinicDoctorList, function (item) {
                        item.isChecked = true;
                    });
                    var Index = $scope.clinicDoctorList.findIndex(record => record.DoctorID === eHnoteMasterDataService.getLoginId());
                    if (Index > -1) {
                        $scope.selectedDoctor = $scope.clinicDoctorList[Index] || "";
                        if ($scope.selectedDoctor != "") {
                            $scope.selectedDoctor.FullName = "All Doctors";
                        }
                    } else {
                        $scope.selectedDoctor = $scope.clinicDoctorList[0] || "";
                        if ($scope.selectedDoctor != "") {
                            $scope.selectedDoctor.FullName = "All Doctors";
                        }
                        if ($scope.selectedDoctor.DoctorID == 0) {
                            $scope.DoctorId = 0;
                        }
                    }


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

                            $scope.selectedDoctor.FullName = 'All Doctors';
                        } else if (val == false) {
                            angular.forEach($scope.clinicDoctorList, function (item) {
                                item.isChecked = false;
                            });

                            $scope.selectedDoctor.FullName = 'All Doctors';
                        } else {

                            var checkedArray = _.where($scope.clinicDoctorList, { isChecked: true });
                            var totalItems = $scope.clinicDoctorList.length;
                            var checkedCount = checkedArray.length;

                            if (checkedCount === totalItems && totalItems > 0) {
                                $scope.selectedDoctor.FullName = "All Doctors";
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
                                $scope.onSelectVisitReason = function (item, mainitem) {
                                    //mainitem.OrganizationFacilityId = item.FacilityTypeId || 0;
                                    //if (mainitem.OrganizationFacilityId != 0) {
                                    //    var List1 = $filter("filter")($scope.FacilityList, function (Ditem,) { return Ditem.FacilityTypeId === item.FacilityTypeId; }) || [];
                                    //    if (List1.length > 0) {
                                    //        $scope.AddVisitObj.FacilityTypeId = List1[0].FacilityTypeId || 0;
                                    //    } else {
                                    //        $scope.AddVisitObj.FacilityTypeId = 0;
                                    //    }
                                    //}
                                }
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

                    /* ---- */
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
                if (resp.Type === "navtoSuperView") {

                    $scope.navtoSuperViewpopup(resp.VisitItem, resp.item);
                }
                if (resp.Type === "navtoclaim") {
                    resp.item.PatientId = resp.item.Patient.PatientId;
                    resp.item.PatientFullName = resp.item.Patient.FullName;
                    resp.item.IsCreateSuperBill = true;
                    $scope.navtoGenerateClaim("AddClaim", resp.item, resp.VisitItem);
                }

                //if ($scope.organizationSuperBillList.length == 0 && resp === "cancel") {
                //    /*$scope.clearCLaimEncounters();*/
                //}

            }, function () { });

        }

        $scope.ExportFinantialReportToExcel = function () {

            if (!$scope.OrgClaimListdata || !$scope.OrgClaimListdata.length) {
                alertify.error("No data to export");
                return;
            }

            $scope.isLoadingExport = true;

            let rows = [];
            const formatDate = v => {
                if (!v) return "";
                return $filter('date')(new Date(v), 'MM-dd-yyyy');
            };

            angular.forEach($scope.OrgClaimListdata, function (p) {
                rows.push({
                    "Patient Name": p.PatientFullName || "",
                    "MR No": p.PatientMrNo || "",
                    "Billing Provider": p.BillingProviderName || "",
                    "Claim No": p.PatientClaimNumber || "",
                    "Payor Name": p.PayorName || "",
                    "DOS": formatDate(p.DOSFrom),
                    "Claim Date": formatDate(p.ClaimDate),
                    "Transmission Date": formatDate(p.TransmissionDate),
                    "Claim Status": p.ClaimStatus || "",
                    "Billed": parseFloat(p.TotalClaimAmount) || 0,
                    "Pat Bal": parseFloat(p.TotalPatientBalance) || 0,
                    "Ins Bal": parseFloat(p.TotalInsuranceBalance) || 0,
                    "Total Bal": parseFloat(p.TotalBalance) || 0
                });
            });

            if (!rows.length) {
                alertify.error("No claim records found");
                $scope.isLoadingExport = false;
                return;
            }

            let ws = XLSX.utils.json_to_sheet(rows);

            // Column indexes

            const billedCol = 9;
            const patBalCol = 10;
            const insBalCol = 11;
            const totalBalCol = 12;

            const dataRowCount = rows.length;

            const billedLetter = XLSX.utils.encode_col(billedCol);
            const patBalLetter = XLSX.utils.encode_col(patBalCol);
            const insBalLetter = XLSX.utils.encode_col(insBalCol);
            const totalBalLetter = XLSX.utils.encode_col(totalBalCol);

            const totalRowNumber = dataRowCount + 2; // +1 header, +1 next row

            // Add TOTAL label
            ws[`A${totalRowNumber}`] = { t: 's', v: 'TOTAL' };

            // Add SUM formulas
            ws[`${billedLetter}${totalRowNumber}`] = {
                t: 'n',
                f: `SUM(${billedLetter}2:${billedLetter}${dataRowCount + 1})`
            };

            ws[`${patBalLetter}${totalRowNumber}`] = {
                t: 'n',
                f: `SUM(${patBalLetter}2:${patBalLetter}${dataRowCount + 1})`
            };

            ws[`${insBalLetter}${totalRowNumber}`] = {
                t: 'n',
                f: `SUM(${insBalLetter}2:${insBalLetter}${dataRowCount + 1})`
            };

            ws[`${totalBalLetter}${totalRowNumber}`] = {
                t: 'n',
                f: `SUM(${totalBalLetter}2:${totalBalLetter}${dataRowCount + 1})`
            };

            // Apply currency format
            for (let i = 2; i <= totalRowNumber; i++) {

                [billedLetter, patBalLetter, insBalLetter, totalBalLetter].forEach(col => {
                    let cell = ws[`${col}${i}`];
                    if (cell) {
                        cell.z = "$0.00";
                    }
                });
            }



            const headerStyle = {
                font: { bold: true, color: { rgb: "FFFFFF" } },
                fill: { fgColor: { rgb: "4F81BD" } }, // blue header
                alignment: { horizontal: "center", vertical: "center" }
            };

            const headerKeys = Object.keys(rows[0]);

            headerKeys.forEach((key, index) => {
                const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index });
                if (ws[cellAddress]) {
                    ws[cellAddress].s = headerStyle;
                }
            });

            ws['!rows'] = [{ hpt: 20 }];
            ws['!cols'] = headerKeys.map(k => ({ wch: 22 }));

            const today = new Date();
            const formattedDate =
                (today.getMonth() + 1).toString().padStart(2, '0') + '-' +
                today.getDate().toString().padStart(2, '0') + '-' +
                today.getFullYear();

            setTimeout(function () {
                $scope.$apply();
                let wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, `FinancialReport_${formattedDate}`);
                XLSX.writeFile(wb, 'FinancialReport_' + $filter('date')(new Date(), 'yyyyMMdd') + '.xlsx');
                $scope.isLoadingExport = false;
            }, 1000);  // 1 seconds
        };


        // Count Base .....
        $scope.SearchAllCountClaimDetails = function (type, data, pageno, Ackstatus, response) {
            Ackstatus = Ackstatus || '';
            response = response || '';
            $scope.TotalClaimBalance = 0;
            $scope.TotalClaimBilledAmount = 0;
            $scope.TotalClaimInsuranceBalance = 0;
            $scope.TotalClaimPatientBalance = 0;
            $scope.SearchClaimListObj.PageNumber = pageno || 1;
            var type = (type === undefined || type === '') ? 'All' : type;
            if (type == "Transmitted") {
                // Convert the string into an array
                var claimStatusArray = $scope.SearchClaimListObj.ClaimStatusList.split(',');
                claimStatusArray = claimStatusArray.filter(function (statusId) {
                    return statusId !== '1' && statusId !== '2';
                });

                // Convert the array back to a string
                $scope.SearchClaimListObj.ClaimStatusList = claimStatusArray.join(',');


                if ($scope.ClaimLocationList.length > 0) {
                    var checkedTransmittedLocationList = $scope.ClaimLocationList
                        .filter(pitem => pitem.IsChecked)
                        .map(pitem => pitem.ClinicId)
                        .join(",");
                }

                if ($scope.ClaimStatusListDD.length > 0) {
                    var checkedTransmittedClaimStatusList = $scope.ClaimStatusListDD
                        .filter(pitem => pitem.IsChecked)
                        .map(pitem => pitem.ClaimStatusId)
                        .join(",");
                }

                var Frezobj2 = {
                    "FromDate": $filter("date")(new Date($scope.SearchClaimListObj.FromDate), "MM-dd-yyyy") || '',
                    "ToDate": $filter("date")(new Date($scope.SearchClaimListObj.ToDate), "MM-dd-yyyy") || '',
                    "BillingProviderId": $scope.SearchClaimListObj.BillingProviderId || 0,
                    "RenderingProviderId": $scope.SearchClaimListObj.RenderingProviderId || 0,
                    "BillPaymentTypeId": $scope.SearchClaimListObj.BillPaymentTypeId || 0,
                    "checkedTransmittedLocationList": checkedTransmittedLocationList || '',
                    "TransmissionMethodId": $scope.SearchClaimListObj.TransmissionMethodId || 0,
                    "checkedTransmittedClaimStatusList": checkedTransmittedClaimStatusList || '',
                    "CurrentResponsibilityId": $scope.SearchClaimListObj.CurrentResponsibilityId || 0,
                    "ClaimTypeId": $scope.SearchClaimListObj.ClaimTypeId || 0,
                    "PayorObj": $scope.SearchClaimListObj.PayorObj || '',
                    "PayorId": $scope.SearchClaimListObj.PayorId || 0,
                    "selectedClaimStatusIds": data,
                };
                eHnoteMasterDataService.addClaimsTransmittedUsersList(Frezobj2);

            }
            else {

                var claimStatusArray = $scope.SearchClaimListObj.ClaimStatusList.split(',');
                $scope.SearchClaimListObj.ClaimStatusList = claimStatusArray.join(',');

                var checkLocationList = [];
                if ($scope.ClaimLocationList.length > 0) {
                    checkLocationList = _.where($scope.ClaimLocationList, { IsChecked: true });
                }
                var checkClaimStatus = [];
                if ($scope.ClaimStatusListDD.length > 0) {
                    checkClaimStatus = _.where($scope.ClaimStatusListDD, { IsChecked: true });
                }
                var Frezobj = {
                    "FromDate": $filter("date")(new Date($scope.SearchClaimListObj.FromDate), "MM-dd-yyyy") || '',
                    "ToDate": $filter("date")(new Date($scope.SearchClaimListObj.ToDate), "MM-dd-yyyy") || '',
                    "BillingProviderId": $scope.SearchClaimListObj.BillingProviderId || 0,
                    "RenderingProviderId": $scope.SearchClaimListObj.RenderingProviderId || 0,
                    "BillPaymentTypeId": $scope.SearchClaimListObj.BillPaymentTypeId || 0,
                    "TransmissionMethodId": $scope.SearchClaimListObj.TransmissionMethodId || 0,
                    "CurrentResponsibilityId": $scope.SearchClaimListObj.CurrentResponsibilityId || 0,
                    "ClaimTypeId": $scope.SearchClaimListObj.ClaimTypeId || 0,
                    "PayorObj": $scope.SearchClaimListObj.PayorObj || '',
                    "PayorId": $scope.SearchClaimListObj.PayorId || 0,
                    "checkLocationList": checkLocationList || [],
                    "checkClaimStatus": checkClaimStatus || [],
                };
                eHnoteMasterDataService.addClaimsAllUsers(Frezobj);


            }

            var TempAddress = $filter("filter")($scope.ClaimLocationList, function (iterator, ind) { return iterator.ClinicId !== 0 && iterator.IsChecked; });
            var HospitalIDs = _.pluck(TempAddress, "BranchId").join(",");

            var IsClaimStatusId = false;
            if (data === "1") {
                IsClaimStatusId = true;
            }
            if ($scope.SearchClaimListObj.AllPayorList.length > 0) {
                var PayorIds = $scope.SearchClaimListObj.AllPayorList
                    .map(pitem => pitem.PayorId)
                    .join(",");
            }
            var params = {
                "OrganizationId": $scope.SearchClaimListObj.OrganizationId,
                "OrganizationFacilityId": $scope.SearchClaimListObj.OrganizationFacilityId || 0,
                "FromDate": $filter('date')($scope.SearchClaimListObj.FromDate, 'MM-dd-yyyy') || "",
                "ToDate": $filter('date')($scope.SearchClaimListObj.ToDate, 'MM-dd-yyyy') || "",
                "PatientId": $scope.SearchClaimListObj.PatientId || 0,
                "SearchText": $scope.SearchClaimListObj.SearchText || "",
                "PatientMRNo": $scope.SearchClaimListObj.PatientMRNo || "",
                "PatienClaimNumber": (type == "Claims") ? $scope.SearchClaimListObj.ClaimNumber : $scope.SearchClaimListObj.PatienClaimNumber || "",
                "BatchNumber": $scope.SearchClaimListObj.BatchNumber || "",
                "BillingProviderId": $scope.SearchClaimListObj.BillingProviderId || 0,
                "RenderingProviderId": $scope.SearchClaimListObj.RenderingProviderId || 0,
                "TransmissionTypeId": $scope.SearchClaimListObj.TransmissionMethodId || 0,
                "ClaimTypeId": $scope.SearchClaimListObj.ClaimTypeId || 0,
                "PayorId": $scope.SearchClaimListObj.PayorId || 0,
                "PayorIds": PayorIds || "",
                "ClaimStatusList": data || '',
                "PageSize": 100,
                "PageNumber": $scope.SearchClaimListObj.PageNumber,
                "Type": type,
                "BillPaymentTypeId": $scope.SearchClaimListObj.BillPaymentTypeId,
                "CurrentResponsibilityId": $scope.SearchClaimListObj.CurrentResponsibilityId || 0,
                "IsReadytosubmit": $scope.SearchClaimListObj.IsReadytosubmit || false,
                "DenialId": $scope.SearchClaimListObj.DenialId || 0,
                "FacilityListIds": '',
                "Locationids": HospitalIDs,
                "TransmissionFromDate": $scope.SearchClaimListObj.TransmissionFromDate,
                "TransmissionToDate": $scope.SearchClaimListObj.TransmissionToDate,
                "IsClaimStatusId": IsClaimStatusId,
                "DateType": $scope.SearchClaimListObj.DateType,
                "SortColumn": $scope.SearchClaimListObj.SortColumn,
                "SortOrder": $scope.SearchClaimListObj.SortOrder
            };


            eHnotePatientDataService.GetOrganizationClaimsList(params).then(function (resp) {
                console.log(resp);
                $scope.OrgClaimListdata = [];
                $scope.ClaimAcknowledgementReqlist = [];

                $scope.ClaimListCount = resp.data.count;
                $scope.TotalClaimBalance = resp.data.TotalBalance;
                $scope.TotalClaimBilledAmount = resp.data.TotalBilledAmount;
                $scope.TotalClaimInsuranceBalance = resp.data.TotalInsuranceBalance;
                $scope.TotalClaimPatientBalance = resp.data.TotalPatientBalance;
                $scope.checkedOrgClaimCount = 0;
                resp.data.rows = resp.data.rows || [];
                if (resp.data.rows.length > 0) {
                    $scope.OrgClaimListdata = resp.data.rows;
                    $scope.ClaimAcknowledgementReqlist = $filter("filter")($scope.OrgClaimListdata, function (item) {
                        return item.ClaimStatusId === 5 || item.ClaimStatusId === 6 || item.ClaimStatusId === 9 ||
                            item.ClaimStatusId === 7 || item.ClaimStatusId === 10 ||
                            item.ClaimStatusId === 11 || item.ClaimStatusId === 12 ||
                            item.ClaimStatusId === 13 || item.ClaimStatusId === 14
                            || item.ClaimStatusId === 26 || item.ClaimStatusId === 27;
                    });
                    $scope.SearchClaimAcknowledgementReqObj.Count = $scope.ClaimAcknowledgementReqlist.length;
                    console.log($scope.SearchClaimAcknowledgementReqObj.Count);
                    console.log($scope.ClaimAcknowledgementReqlist);
                    var today = new Date();
                    angular.forEach($scope.OrgClaimListdata, function (claim) {

                        if (claim.ClaimFilingLimitDays > 0) {

                            if (claim.BillPaymentTypeId == 1 || claim.ClaimStatusId != 1) {
                                claim.ClaimDueOnDays = 0;

                            }
                            else if (!claim.DOSFrom || isNaN(new Date(claim.DOSFrom).getTime())) {
                                claim.ClaimDueOnDays = 0;

                            }
                            else {
                                var dosDate = new Date(claim.DOSFrom);
                                var expiryDate = new Date(dosDate);
                                expiryDate.setDate(expiryDate.getDate() + claim.ClaimFilingLimitDays);

                                var remainingDays = Math.ceil(
                                    (expiryDate - today) / (1000 * 60 * 60 * 24)
                                );

                                //if (remainingDays <= 0) {
                                //    claim.ClaimDueOnDays = 0;

                                //} else {
                                //    claim.ClaimDueOnDays = remainingDays;

                                //}
                                claim.ClaimDueOnDays = remainingDays;
                            }
                        }

                        if (claim.AdjustmentFilingLimitDays > 0) {

                            // Only for DENIED claims
                            if (claim.BillPaymentTypeId == 1 || claim.ClaimStatusId !== 19) {
                                claim.AdjustmentDueOnDays = 0;
                                return;
                            }

                            if (!claim.DenialCheckDate || isNaN(new Date(claim.DenialCheckDate).getTime())) {
                                claim.AdjustmentDueOnDays = 0;
                                return;
                            }

                            var denialDate = new Date(claim.DenialCheckDate);
                            var expiryDate = new Date(denialDate);
                            expiryDate.setDate(expiryDate.getDate() + claim.AdjustmentFilingLimitDays);

                            var remainingDays = Math.ceil(
                                (expiryDate - today) / (1000 * 60 * 60 * 24)
                            );

                            //claim.AdjustmentDueOnDays = remainingDays > 0 ? remainingDays : 0;
                            claim.AdjustmentDueOnDays = remainingDays;
                        }


                        claim.AppealSentText = null;

                        if (claim.DenialCheckDate && claim.AppealedDate &&
                            !isNaN(new Date(claim.DenialCheckDate).getTime()) &&
                            !isNaN(new Date(claim.AppealedDate).getTime())) {

                            var checkDate = new Date(claim.DenialCheckDate);
                            var appealedDate = new Date(claim.AppealedDate);

                            // Remove time part
                            checkDate = new Date(checkDate.getFullYear(), checkDate.getMonth(), checkDate.getDate());
                            appealedDate = new Date(appealedDate.getFullYear(), appealedDate.getMonth(), appealedDate.getDate());

                            var daysDifference = Math.floor(
                                (appealedDate - checkDate) / (1000 * 60 * 60 * 24)
                            );

                            if (daysDifference >= 0) {
                                claim.AppealSentText = "Appealed D+" + daysDifference;
                            }
                        }





                    });
                    $scope.SearchClaimListObj.Count = resp.data.count || 0;
                }

                if (Ackstatus != 'AckOtherstatus' && response != 'Close') {
                    $scope.SearchClaimCountDetails(type, data, pageno);
                    $scope.activeClaimTab = null;
                } else if (response == 'Close') {
                    $scope.SearchClaimCountDetails(type, data, pageno, response);
                } else {

                }
                if ($scope.activeClaimTab == 'ALL') {
                    $scope.selectedClaimStatusIds = '';
                }

            }, function (err) {

            });

        }


        $scope.selectedClaimStatusIds = '';
        $scope.isOtherClaimDropdownOpen = false;
        $scope.otherAllChecked = false;
        $scope.otherSelectedCount = 0;
        $scope.activeClaimTabStatusIds = '';


        $scope.SearchClaimCountDetails = function (type, data, pageno, response) {
            $scope.selectedClaimStatusIds = data || "";

            $scope.SearchClaimListObj.PageNumber = pageno || 1;
            var response = response || '';
            type = type || "Transmitted";
            if (type == "Transmitted") {

                var claimStatusArray = $scope.SearchClaimListObj.ClaimStatusList.split(',');
                claimStatusArray = claimStatusArray.filter(function (statusId) {
                    return statusId !== '1' && statusId !== '2';
                });

                // Convert the array back to a string
                $scope.SearchClaimListObj.ClaimStatusList = claimStatusArray.join(',');


                if ($scope.ClaimLocationList.length > 0) {
                    var checkedTransmittedLocationList = $scope.ClaimLocationList
                        .filter(pitem => pitem.IsChecked)
                        .map(pitem => pitem.ClinicId)
                        .join(",");
                }

            }
            if ($scope.ClaimStatusListDD.length > 0) {
                data = $scope.ClaimStatusListDD
                    .filter(pitem => pitem.IsChecked)
                    .map(pitem => pitem.ClaimStatusId)
                    .join(",");
            }

            var IsClaimStatusId = false;
            if (type == 'All') {
                IsClaimStatusId = true;
            }

            var TempAddress = $filter("filter")($scope.ClaimLocationList, function (iterator, ind) { return iterator.ClinicId !== 0 && iterator.IsChecked; });
            var HospitalIDs = _.pluck(TempAddress, "BranchId").join(",");


            var TempAddress = $filter("filter")($scope.ClaimLocationList, function (iterator, ind) { return iterator.ClinicId !== 0 && iterator.IsChecked; });
            var HospitalIDs = _.pluck(TempAddress, "BranchId").join(",");

            if ($scope.SearchClaimListObj.AllPayorList.length > 0) {
                var PayorIds = $scope.SearchClaimListObj.AllPayorList
                    .map(pitem => pitem.PayorId)
                    .join(",");
            }

            var params = {
                "OrganizationId": $scope.SearchClaimListObj.OrganizationId,
                "OrganizationFacilityId": $scope.SearchClaimListObj.OrganizationFacilityId || 0,
                "FromDate": $filter('date')($scope.SearchClaimListObj.FromDate, 'MM-dd-yyyy') || "",
                "ToDate": $filter('date')($scope.SearchClaimListObj.ToDate, 'MM-dd-yyyy') || "",
                "PatientId": $scope.SearchClaimListObj.PatientId || 0,
                "SearchText": $scope.SearchClaimListObj.SearchText || "",
                "PatientMRNo": $scope.SearchClaimListObj.PatientMRNo || "",
                "PatienClaimNumber": (type == "Claims") ? $scope.SearchClaimListObj.ClaimNumber : $scope.SearchClaimListObj.PatienClaimNumber || "",
                "BatchNumber": $scope.SearchClaimListObj.BatchNumber || "",
                "BillingProviderId": $scope.SearchClaimListObj.BillingProviderId || 0,
                "RenderingProviderId": $scope.SearchClaimListObj.RenderingProviderId || 0,
                "TransmissionTypeId": $scope.SearchClaimListObj.TransmissionMethodId || 0,
                "ClaimTypeId": $scope.SearchClaimListObj.ClaimTypeId || 0,
                "PayorId": $scope.SearchClaimListObj.PayorId || 0,
                "PayorIds": PayorIds || "",
                "ClaimStatusList": data,
                "PageSize": 100,
                "PageNumber": $scope.SearchClaimListObj.PageNumber,
                "Type": type,
                "BillPaymentTypeId": $scope.SearchClaimListObj.BillPaymentTypeId,
                "CurrentResponsibilityId": $scope.SearchClaimListObj.CurrentResponsibilityId || 0,
                "IsReadytosubmit": $scope.SearchClaimListObj.IsReadytosubmit || false,
                "DenialId": $scope.SearchClaimListObj.DenialId || 0,
                "FacilityListIds": '',
                "Locationids": HospitalIDs,
                "IsClaimStatusId": IsClaimStatusId,
                "TransmissionFromDate": $scope.SearchClaimListObj.TransmissionFromDate,
                "TransmissionToDate": $scope.SearchClaimListObj.TransmissionToDate,
                "DateType": $scope.SearchClaimListObj.DateType,
            };

            eHnotePatientDataService.GetClaimsListStatusCount(params).then(function (resp) {
                console.log(resp);
                var rows = (resp && resp.data && resp.data.rows) ? resp.data.rows : [];
                var data = rows[0] || {};


                $scope.claimCountsById = {
                    1: data.NotSubmitted + data.TransmittoQueue || 0,
                    3: data.TransmittedToClearingHouse || 0,
                    16: data.ERAProcessedAsPrimary || 0,
                    17: data.ERAProcessedAsSecondary || 0,
                    18: data.ERAProcessedAsTertiary || 0,
                    19: data.ERADenied || 0,
                    24: data.ClaimClosed || 0,
                    4: data.ProcessingAtClearingHouse || 0,
                    5: data.Accepted999 || 0,
                    6: data.Rejected999 || 0,
                    7: data.AttachmentRequestByClearingHouse || 0,
                    8: data.ResubmitRequestByClearingHouse || 0,
                    9: data.AppealedByClearingHouse || 0,
                    10: data.ProcessingAtPayor || 0,
                    11: data.AcceptedByPayor || 0,
                    12: data.RejectedByPayor || 0,
                    13: data.DeniedByPayor || 0,
                    14: data.RemitInformationByPayor || 0,
                    15: data.RemitInformationByPayor || 0,
                    20: data.ERAProcessedAsPrimaryAndForwarded || 0,
                    21: data.ERAProcessedAsSecondaryAndForwarded || 0,
                    22: data.ERAReversalOfPreviousPayment || 0,
                    23: data.ERAPredeterminationPricingOnly || 0,
                    26: data.AcceptedByClearingHouse || 0,
                    27: data.RejectedByClearingHouse || 0,
                    '5,6,7,10,11,12,13,14,26,27': data.AcknowledgementCount || 0,

                };
                $scope.claimAckCounts = {
                    All: data.AllCount || 0,
                    claimAcknowledgements:
                        (data.Accepted999 || 0) +
                        (data.Rejected999 || 0) +
                     /*   (data.AcceptedByPayor || 0) +*/
                        (data.RejectedByPayor || 0) +
                        (data.DeniedByPayor || 0)
                };
                $scope.claimCounts = {
                    All: data.AllCount || 0,
                    AcceptedByPayor: data.AcceptedByPayor || 0,
                    Others:
                        (data.ProcessingAtClearingHouse || 0) +
                        (data.ResubmitRequestByClearingHouse || 0) +
                        (data.AppealedByClearingHouse || 0) +
                        (data.ProcessingAtPayor || 0) +
                        (data.RequestForInfoByPayor || 0) +
                        (data.RemitInformationByPayor || 0) +
                        (data.ERAProcessedAsPrimaryAndForwarded || 0) +
                        (data.ERAProcessedAsSecondaryAndForwarded || 0) +
                        (data.ERAReversalOfPreviousPayment || 0) +
                        (data.ERAPredeterminationPricingOnly || 0)
                };

                if ($scope.activeClaimTab == 'ALL') {
                    $scope.selectedClaimStatusIds = '';
                }

            }, function (err) {

            });

        }


        $scope.activeClaimTab = 'ALL';

        $scope.onClaimTabClick = function (status, type, subtabids, action, statustype, response, Allsubtab,Count) {
            var action = action || '';
            var response = response ||''
            var Allsubtab = Allsubtab ||''
            statustype = statustype || '';
            $scope.SearchClaimListObj.SortColumn = 'DOS';
            $scope.SearchClaimListObj.SortOrder = 'DESC';
            $scope.ClaimAckotherStatusfilter = '';
            $scope.OthersStatuslist = '';
            $scope.AcknowStatuslist = '';
            Count = Count || 0;
            if (statustype == 'AckOtherstatus') {
                $scope.ClaimAckotherStatusfilter = '';
                angular.forEach($scope.AckClaimStatuses, function (item) {
                    item.IsChecked = false;
                });

                angular.forEach($scope.otherClaimStatuses, function (item) {
                    item.IsChecked = false;
                });
            }
            angular.forEach($scope.MasterClaimStatusList, function (s) {
                s.IsChecked = false;
            });

            var SelectedClaimIds = '';
            if ($scope.ClaimStatusListDD.length > 0) {
                SelectedClaimIds = $scope.ClaimStatusListDD
                    .filter(pitem => pitem.IsChecked)
                    .map(pitem => pitem.ClaimStatusId)
                    .join(",");
            }
            //if (action != '') {
            //    $scope.activeClaimTab = SelectedClaimIds.includes(',') ? 'ALL' : null;
            //}

            $scope.activeClaimTabStatusIds = SelectedClaimIds;
            subtabids == subtabids || '';
            $scope.otherSelectedCount = 0;

            if (status == '' && subtabids != '') {

                if (type == 'All' && $scope.activeClaimTab == 'ALL') {
                    if ($scope.ClaimAckotherStatusfilter != 'AckStatus' && $scope.ClaimAckotherStatusfilter != 'Otherstatus') {
                        //$scope.selectedClaimStatusIds = "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27";
                        $scope.selectedClaimStatusIds = SelectedClaimIds;
                        $scope.activeClaimTabStatusIds = $scope.selectedClaimStatusIds;
                        $scope.SearchClaimListObj.PageNumber = 1;
                        $scope.AllOthersCheckObj.otherAllChecked = false;
                    } else{
                        $scope.activeClaimTabStatusIds = $scope.selectedClaimStatusIds;
                        $scope.SearchClaimListObj.PageNumber = 1;
                    }

                    if (action == '') {
                        $scope.SearchAllCountClaimDetails('All', $scope.selectedClaimStatusIds, $scope.SearchClaimListObj.PageNumber, statustype, response);
                    }
                    
                    if (action == '') {
                        $scope.SearchAllCountClaimDetails('All', $scope.selectedClaimStatusIds, $scope.SearchClaimListObj.PageNumber, statustype, response);
                    }
                } else if (type == 'All' && $scope.activeClaimTab == null) {
                    $scope.selectedClaimStatusIds = subtabids.toString();
                    $scope.activeClaimTabStatusIds = $scope.selectedClaimStatusIds;
                    $scope.SearchClaimListObj.PageNumber = 1;
                    $scope.AllOthersCheckObj.otherAllChecked = false;
                    if (action == '') {
                        $scope.SearchAllCountClaimDetails('All', $scope.selectedClaimStatusIds, $scope.SearchClaimListObj.PageNumber, statustype, response);
                    }
                } else if (type == 'Transmitted' && $scope.activeClaimTab == 'ALL') {
                    $scope.selectedClaimStatusIds = '3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27';
                    $scope.activeClaimTabStatusIds = $scope.selectedClaimStatusIds;
                    $scope.SearchClaimListObj.PageNumber = 1;
                    $scope.AllOthersCheckObj.otherAllChecked = false;
                    if (action == '') {
                        $scope.SearchAllCountClaimDetails('Transmitted', $scope.selectedClaimStatusIds, $scope.SearchClaimListObj.PageNumber, statustype);
                    }
                } else if (type == 'Transmitted' && $scope.activeClaimTab == null) {
                    $scope.selectedClaimStatusIds = subtabids.toString();
                    $scope.activeClaimTabStatusIds = $scope.selectedClaimStatusIds;
                    $scope.SearchClaimListObj.PageNumber = 1;
                    $scope.AllOthersCheckObj.otherAllChecked = false;
                    if (action == '') {
                        $scope.SearchAllCountClaimDetails('Transmitted', $scope.selectedClaimStatusIds, $scope.SearchClaimListObj.PageNumber, statustype);
                    }
                }


                //if (type == 'All') {
                //    if (!status) {
                //        $scope.activeClaimTab = 'ALL';
                //        $scope.selectedClaimStatusIds = "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27";
                //    } else {
                //        $scope.selectedClaimStatusIds = status.ClaimStatusId.toString();
                //        $scope.activeClaimTab = null;
                //    }
                //    $scope.activeClaimTabStatusIds = $scope.selectedClaimStatusIds;
                //    $scope.SearchClaimListObj.PageNumber = 1;
                //    $scope.AllOthersCheckObj.otherAllChecked = false;
                //    $scope.SearchAllCountClaimDetails('All', $scope.selectedClaimStatusIds, $scope.SearchClaimListObj.PageNumber);
                //} else {
                //    if (!status) {
                //        $scope.activeClaimTab = 'ALL';
                //        $scope.selectedClaimStatusIds = '3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27';
                //    } else {
                //        $scope.selectedClaimStatusIds = status.ClaimStatusId.toString();
                //        $scope.activeClaimTab = null;
                //    }
                //    $scope.activeClaimTabStatusIds = $scope.selectedClaimStatusIds;
                //    $scope.SearchClaimListObj.PageNumber = 1;
                //    $scope.AllOthersCheckObj.otherAllChecked = false;
                //    $scope.SearchAllCountClaimDetails('Transmitted', $scope.selectedClaimStatusIds, $scope.SearchClaimListObj.PageNumber);
                //}

            } else {
                if (type == 'All') {
                    if (!status) {
                        if (action != '') {
                            if (SelectedClaimIds == "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28") {
                                $scope.selectedClaimStatusIds = SelectedClaimIds;
                                $scope.activeClaimTab = 'ALL';
                            } else if (SelectedClaimIds != "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28" && $scope.activeClaimTab != 'ALL') {
                                $scope.selectedClaimStatusIds = '';
                                $scope.activeClaimTab = 'ALL';
                            }else {
                                $scope.activeClaimTab = 'ALL';
                            }
                        } else {

                            $scope.selectedClaimStatusIds = SelectedClaimIds;
                            if ($scope.selectedClaimStatusIds == "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27") {
                                $scope.activeClaimTab = 'ALL';
                            } else if (SelectedClaimIds.includes(',')) {
                                $scope.activeClaimTab = 'ALL';
                                $scope.selectedClaimStatusIds = SelectedClaimIds;
                            } else if (Allsubtab == 'Alltab') {
                                $scope.activeClaimTab = 'ALL';
                                $scope.selectedClaimStatusIds = SelectedClaimIds;
                            }
                            else {
                                $scope.activeClaimTab = null;
                            }
                        }
                        /* $scope.activeClaimTab = null;*/
                        //$scope.selectedClaimStatusIds = SelectedClaimIds;
                    } else {
                        if (status.ClaimStatusName == "Acknowledgement") {
                            $scope.selectedClaimStatusIds = '5,6,7,10,11,12,13,14,26,27';
                        }
                        else {
                            $scope.selectedClaimStatusIds = status.ClaimStatusId.toString();
                        }
                        if (action != '') {
                            $scope.activeClaimTab = 'ALL';
                            $scope.selectedClaimStatusIds = '';
                        } else {
                            $scope.activeClaimTab = null;
                        }
                        //$scope.activeClaimTab = null;
                    }

                    $scope.SearchClaimListObj.PageNumber = 1;
                    $scope.AllOthersCheckObj.otherAllChecked = false;
                    if (Count == 0 && statustype == 'AckOtherstatus') {
                        $scope.OrgClaimListdata = [];
                        $scope.ClaimListCount = 0;
                    } else if (action == '') {
                        var claimstatusIds = $scope.selectedClaimStatusIds || "";
                        if (status!=null) {
                            if (status.ClaimStatusId == 1 || status.ClaimStatusId == '1') {
                                if ($scope.ClaimStatusListDD.length > 0) {
                                    var SelectNotTransmittedQueueClaimIds = '';

                                    var filteredIds = $scope.ClaimStatusListDD
                                        .filter(pitem => (pitem.ClaimStatusId == '1' || pitem.ClaimStatusId == '2') && pitem.IsChecked)
                                        .map(pitem => pitem.ClaimStatusId)
                                        .join(",");

                                    SelectNotTransmittedQueueClaimIds = filteredIds;
                                    $scope.ClaimstatusIDsSelected = SelectNotTransmittedQueueClaimIds;
                                }
                            } else {
                                $scope.ClaimstatusIDsSelected = $scope.selectedClaimStatusIds;
                            }
                        } else {
                            $scope.ClaimstatusIDsSelected = $scope.selectedClaimStatusIds;
                        }

                        $scope.activeClaimTabStatusIds = $scope.ClaimstatusIDsSelected;
                        $scope.SearchAllCountClaimDetails('All', $scope.ClaimstatusIDsSelected, $scope.SearchClaimListObj.PageNumber, statustype, response);
                    }
                } else {
                    if (!status) {
                        $scope.activeClaimTab = 'ALL';
                        $scope.selectedClaimStatusIds = '3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27';
                    } else {
                        $scope.selectedClaimStatusIds = status.ClaimStatusId.toString();
                        $scope.activeClaimTab = null;
                    }
                    $scope.activeClaimTabStatusIds = $scope.selectedClaimStatusIds;
                    $scope.SearchClaimListObj.PageNumber = 1;
                    $scope.AllOthersCheckObj.otherAllChecked = false;
                    if (action == '') {
                        $scope.SearchAllCountClaimDetails('Transmitted', $scope.selectedClaimStatusIds, $scope.SearchClaimListObj.PageNumber, statustype, response);
                    }
                }
            }

        };

        $scope.ClaimAckotherStatusfilter = '';
        $scope.applyOtherClaimStatusFilter = function ($event, type) {
            $event.stopPropagation();

            var ids = [];
            var totalCount = 0;
            angular.forEach($scope.AckClaimStatuses, function (item) {
                item.IsChecked = false;
            });

            $scope.otherClaimStatuses.forEach(function (status) {
                if (status.IsChecked) {
                    ids.push(status.ClaimStatusId);
                    totalCount += ($scope.claimCountsById[status.ClaimStatusId] || 0);
                } else {
                    status.IsChecked = false;
                }
            });
            $scope.AcknowStatuslist = '';
            if ($scope.otherClaimStatuses.length > 0) {
                $scope.OthersStatuslist = $scope.otherClaimStatuses
                    .filter(pitem => pitem.IsChecked)
                    .map(pitem => pitem.ClaimStatusId)
                    .join(",");
            }

            $scope.ClaimAckotherStatusfilter = type;

            
            $scope.selectedClaimStatusIds = ids.join(',');
            $scope.activeClaimTabStatusIds = $scope.selectedClaimStatusIds;
            $scope.otherSelectedCount = totalCount;

            $scope.SearchClaimListObj.ClaimStatusList = $scope.selectedClaimStatusIds;
            $scope.SearchClaimListObj.PageNumber = 1;
            $scope.SearchAllCountClaimDetails('Transmitted', $scope.selectedClaimStatusIds, $scope.SearchClaimListObj.PageNumber, '', '', type);
            $scope.isOtherClaimDropdownOpen = false;
        };




        $scope.CheckAllStatus = function (val) {
            if (val) {
                angular.forEach($scope.otherClaimStatuses, function (item) {
                    item.IsChecked = true;
                });

                $scope.selectedstatus = 'All';
            } else {
                angular.forEach($scope.otherClaimStatuses, function (item) {
                    item.IsChecked = false;
                });
                $scope.selectedstatus = "Select";
            }
        }

        $scope.CheckStatus = function (val) {
            var checkedArray = _.where($scope.otherClaimStatuses, { IsChecked: true });

            $scope.AllOthersCheckObj.otherAllChecked = checkedArray.length > 0 && $scope.otherClaimStatuses.length === checkedArray.length ? true : false;

            if (checkedArray.length == 0) {
                $scope.selectedstatus = "Select";
            } else {
                if (checkedArray.length === 1) {
                    $scope.selectedstatus = checkedArray[0].ClaimStatusName;
                } else {
                    $scope.selectedstatus = "Select";
                }
            }
        };


        $scope.applyAckClaimStatusFilter = function ($event,type) {
            $event.stopPropagation();
            type = type || '';
            var ids = [];
            var totalCount = 0;

            angular.forEach($scope.otherClaimStatuses, function (item) {
                item.IsChecked = false;
            });

            $scope.AckClaimStatuses.forEach(function (status) {
                if (status.IsChecked) {
                    ids.push(status.ClaimStatusId);
                    totalCount += ($scope.claimCountsById[status.ClaimStatusId] || 0);
                } else {
                    status.IsChecked = false;
                }
            });
            $scope.OthersStatuslist = '';
            if ($scope.AckClaimStatuses.length > 0) {
                $scope.AcknowStatuslist = $scope.AckClaimStatuses
                    .filter(pitem => pitem.IsChecked)
                    .map(pitem => pitem.ClaimStatusId)
                    .join(",");
            }

            $scope.ClaimAckotherStatusfilter = type;

            
            $scope.selectedClaimStatusIds = ids.join(',');
            $scope.activeClaimTabStatusIds = $scope.selectedClaimStatusIds;
            $scope.otherSelectedCount = totalCount;
            $scope.SearchClaimListObj.ClaimStatusList = $scope.selectedClaimStatusIds;
            $scope.SearchClaimListObj.PageNumber = 1;
            $scope.SearchAllCountClaimDetails('Transmitted', $scope.selectedClaimStatusIds, $scope.SearchClaimListObj.PageNumber,type);
            $scope.isOtherClaimDropdownOpen = false;
        };

        $scope.CheckAckAllStatus = function (val) {
            if (val) {
                angular.forEach($scope.AckClaimStatuses, function (item) {
                    item.IsChecked = true;
                });

                $scope.selectedAckstatus = 'All';
            } else {
                angular.forEach($scope.AckClaimStatuses, function (item) {
                    item.IsChecked = false;
                });
                $scope.selectedAckstatus = "Select";
            }
        }

        $scope.CheckAckStatus = function (val) {
            var checkedArray = _.where($scope.AckClaimStatuses, { IsChecked: true });

            $scope.AllAckCheckObj.AckAllChecked = checkedArray.length > 0 && $scope.AckClaimStatuses.length === checkedArray.length ? true : false;

            if (checkedArray.length == 0) {
                $scope.selectedAckstatus = "Select";
            } else {
                if (checkedArray.length === 1) {
                    $scope.selectedAckstatus = checkedArray[0].ClaimStatusName;
                } else {
                    $scope.selectedAckstatus = "Select";
                }
            }
        };

        $scope.onClaimPageChange = function (pageNo, type) {

            $scope.SearchClaimListObj.PageNumber = pageNo;


            if (type == 'All') {
                if ($scope.selectedClaimStatusIds == '') {
                    $scope.selectedClaimStatusIds = "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27";
                } else {
                    $scope.selectedClaimStatusIds = $scope.selectedClaimStatusIds || ""
                }
                $scope.SearchAllCountClaimDetails('All', $scope.selectedClaimStatusIds, pageNo);
            }

            else if (type == 'PaperClaims') {
                $scope.SearchClaimListObj.TransmissionMethodId = 2;
                $scope.SearchClaimListObj.TransmissionMethod = "Paper";
                $scope.SearchAllClaimDetails(pageNo, 'All');
            } else if (type == 'PrivateClaims') {
                $scope.SearchClaimListObj.BillPaymentTypeId = 1;
                $scope.SearchAllClaimDetails(pageno, 'PrivateClaims');
            } else {
                if ($scope.selectedClaimStatusIds == '') {
                    $scope.selectedClaimStatusIds = '3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27';
                } else {
                    $scope.selectedClaimStatusIds = $scope.selectedClaimStatusIds || ""
                }
                $scope.SearchAllCountClaimDetails('Transmitted', $scope.selectedClaimStatusIds, pageNo);
            }

        };


        $scope.navtoSubtabs = function (val) {
            $scope.ClaimSubtabActive = val;
            if ($scope.ClaimSubtabActive == 12) {
                $scope.isClaimSummaryVisible = true;
            } else {
                $scope.isClaimSummaryVisible = false;
            }

        }



        $scope.PatientElectronicClaimReport = function (type) {

            if (type == "Transmitted") {

                var claimStatusArray = $scope.SearchClaimListObj.ClaimStatusList.split(',');
                claimStatusArray = claimStatusArray.filter(function (statusId) {
                    return statusId !== '1' && statusId !== '2';
                });

                $scope.SearchClaimListObj.ClaimStatusList = claimStatusArray.join(',');


                if ($scope.ClaimLocationList.length > 0) {
                    var checkedTransmittedLocationList = $scope.ClaimLocationList
                        .filter(pitem => pitem.IsChecked)
                        .map(pitem => pitem.ClinicId)
                        .join(",");
                }

            }
            var TempAddress = $filter("filter")($scope.ClaimLocationList, function (iterator, ind) { return iterator.ClinicId !== 0 && iterator.IsChecked; });
            var HospitalIDs = _.pluck(TempAddress, "BranchId").join(",");

            var TempDoctorlist = $filter("filter")($scope.mainBillerDataObj.AllDoctorsList, function (iterator) { return iterator.DoctorID !== 0; });
            var RenderingProviderIds = _.pluck(TempDoctorlist, "DoctorID").join(",");

            var SelectedClaimIds = "";
            if ($scope.ClaimStatusListDD.length > 0) {
                SelectedClaimIds = $scope.ClaimStatusListDD
                    .filter(pitem => pitem.IsChecked)
                    .map(pitem => pitem.ClaimStatusId)
                    .join(",");
            }

            $scope.ElectronicReportList = [];
            $scope.DateRangeFrom = null;
            $scope.DateRangeTo = null;
            $scope.PrintedDatenTime = null;
            $scope.TotalPages = 0;

            var IsClaimStatusId = false;
            if ($scope.selectedClaimStatusIds === "1") {
                IsClaimStatusId = true;
            }

            var StatusSelectedList = '';

            if ($scope.activeClaimTab == 'ALL' && $scope.ClaimAckotherStatusfilter == '') {
                var SelecteddataClaimIds = '';
                if ($scope.ClaimStatusListDD.length > 0) {
                    SelecteddataClaimIds = $scope.ClaimStatusListDD
                        .filter(pitem => pitem.IsChecked)
                        .map(pitem => pitem.ClaimStatusId)
                        .join(",");
                }
                StatusSelectedList = SelecteddataClaimIds;
            } else if ($scope.OthersStatuslist != '') {
                StatusSelectedList = $scope.OthersStatuslist;
            } else if ($scope.AcknowStatuslist != '') {
                StatusSelectedList = $scope.AcknowStatuslist;}
            else {

                StatusSelectedList = $scope.selectedClaimStatusIds;

                if (StatusSelectedList == '1') {
                    if ($scope.ClaimStatusListDD.length > 0) {
                        var filteredIds = $scope.ClaimStatusListDD
                            .filter(pitem => (pitem.ClaimStatusId == '1' || pitem.ClaimStatusId == '2') && pitem.IsChecked)
                            .map(pitem => pitem.ClaimStatusId)
                            .join(",");

                        StatusSelectedList = filteredIds;
                    }
                }
            }
            if ($scope.SearchClaimListObj.AllPayorList.length > 0) {
                var PayorIds = $scope.SearchClaimListObj.AllPayorList
                    .map(pitem => pitem.PayorId)
                    .join(",");
            }
            var params = {
                "OrganizationId": $scope.HospitalId,
                "FromDate": $filter('date')($scope.SearchClaimListObj.FromDate, 'MM-dd-yyyy') || "",
                "ToDate": $filter('date')($scope.SearchClaimListObj.ToDate, 'MM-dd-yyyy') || "",
                "PatientId": $scope.SearchClaimListObj.PatientId || 0,
                "SearchText": $scope.SearchClaimListObj.SearchText || "",
                "PatientMRNo": $scope.SearchClaimListObj.PatientMRNo || "",
                "PatienClaimNumber": $scope.SearchClaimListObj.PatienClaimNumber || "",
                "BatchNumber": $scope.SearchClaimListObj.BatchNumber || "",
                "BillingProviderId": $scope.SearchClaimListObj.BillingProviderId || 0,
                "RenderingProviderId": $scope.SearchClaimListObj.RenderingProviderId || 0 ,
                "ClaimTypeId": $scope.SearchClaimListObj.ClaimTypeId || 0,
                "PayorId": $scope.SearchClaimListObj.PayorId || 0,
                "PayorIds": PayorIds || "",
                "ClaimStatusId": StatusSelectedList || "",
                "Type": type,
                "BillPaymentTypeId": $scope.SearchClaimListObj.BillPaymentTypeId,
                "CurrentResponsibilityId": $scope.SearchClaimListObj.CurrentResponsibilityId || 0,
                "FacilityListIds": '',
                "Locationids": HospitalIDs,
                "TransmissionTypeId": $scope.SearchClaimListObj.TransmissionMethodId || 0,
                "IsClaimStatusId": IsClaimStatusId,
                "TransmissionFromDate": $scope.SearchClaimListObj.TransmissionFromDate,
                "TransmissionToDate": $scope.SearchClaimListObj.TransmissionToDate,
                "DenialId": 0,
                "IsReadytosubmit": false,
                "OrganizationFacilityId": 0,
                "PageNumber": 1,
                "PageSize": 100,
                "DateType": $scope.SearchClaimListObj.DateType,
            };

            eHnotePatientDataService.GetPatientElectronicClaimReportPrint(params).then(function (resp) {

                if (resp.data.status === "Success") {
                    if (resp.data.rows.length > 0) {

                        $scope.DateRangeFrom = $filter('date')(resp.data.FromDate, 'MM-dd-yyyy') || "";
                        $scope.DateRangeTo = $filter('date')(resp.data.ToDate, 'MM-dd-yyyy') || "";

                        // Step 1: rows are already flat — no PatientClaimList nesting
                        var allClaims = resp.data.rows || [];

                        // Step 2: Group by BillingProvider + PayorName
                        var grouped = _.groupBy(allClaims, function (item) {
                            return item.BillingProviderName + "|" + item.PayorName;
                        });

                        $scope.ElectronicReportList = [];

                        angular.forEach(grouped, function (claims) {

                            claims.sort(function (a, b) {
                                return new Date(b.DOSFrom) - new Date(a.DOSFrom);
                            });

                            var totalCharge = 0;
                            var totalBilled = 0;
                            var totalPtBalance = 0;

                            claims.forEach(function (c) {
                                totalCharge += c.TotalChargeAmount || 0;
                                totalBilled += c.TotalInsuranceBalance || 0;  // ← updated field
                                totalPtBalance += c.TotalPatientBalance || 0;
                            });

                            $scope.ElectronicReportList.push({
                                BillingProviderName: claims[0].BillingProviderName,
                                PayorName: claims[0].PayorName,
                                Claims: claims,
                                TotalCharge: totalCharge,
                                TotalBilled: totalBilled,
                                TotalPtBalance: totalPtBalance,
                                TotalClaimsCount: claims.length
                            });
                        });


                        // Grand totals
                        $scope.GrandTotalCharge = 0;
                        $scope.GrandTotalBilled = 0;
                        $scope.GrandTotalPtBalance = 0;
                        $scope.GrandTotalClaimsCount = 0;

                        $scope.ElectronicReportList.forEach(function (group) {
                            $scope.GrandTotalCharge += group.TotalCharge || 0;
                            $scope.GrandTotalBilled += group.TotalBilled || 0;
                            $scope.GrandTotalPtBalance += group.TotalPtBalance || 0;
                            $scope.GrandTotalClaimsCount += group.TotalClaimsCount || 0;
                        });

                        var printDate = $filter("date")(new Date(), "MMM-dd-yyyy");
                        var printTime = moment(new Date()).format("HH:mm");
                        $scope.PrintedDatenTime = printDate + ',  ' + printTime;

                        if ($scope.ElectronicReportList.length > 0) {
                            $timeout(function () {
                                var innerContents = document.getElementById('ElectronicClaimReport_Print').innerHTML;
                                var popupWinindow = window.open('scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                                popupWinindow.document.open();
                                popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()" class="bodyheightprint">' + innerContents + '</body></html>');
                                popupWinindow.document.close();
                            }, 500);
                        }
                    }
                }
            }, function () {
                alertify.error("Error loading report");
            });
        }


        $scope.SavePayorResponseDtae = function (item) {

            let mInstanceAdd = $uibModal.open({
                "templateUrl": "SavePayorResponseDtae.html",
                "backdrop": "static",
                "keyboard": false,
                "scope": $scope,
                "windowClass": "claimDeletePopupWrapper",
                "resolve": {
                    "ClaimObj": function () { return item; },
                },
                controller: function ($scope, $uibModalInstance, ClaimObj) {

                    ClaimObj.TotalPatientPayment = ClaimObj.TotalPatientPayment || 0;

                    $scope.PayorObj = {
                        "DenialReconsiderationHeaderId": item.DenialReconsiderationHeaderId || "",
                        "AjustResponseReceiveDate": $filter('date')(item.AjustResponseReceiveDate, "MM-dd-yyyy") || null,
                        "UserId": $scope.UserId,
                    };

                    $scope.closePopup = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                    $scope.saveAckDate = function (item) {

                        $scope.PayorObj.AjustResponseReceiveDate = item.AjustResponseReceiveDate;

                        eHnoteInsuranceService.UpdateDenialReconsiderationRequest($scope.PayorObj).then(function (resp) {
                            if (resp.data.status == "Success") {


                                $uibModalInstance.close();
                                $scope.SearchAdjustmentReqslist(1);

                            } else {
                                alertify.error("Failed to update.");
                            }

                        }, function () {
                            alertify.error("Error while updating.");
                        });
                    };

                }
            });
        };


        $scope.$on('navtoClaimsListScreen', function (event, id) {
            id = id || 1;
            let Id = id;
            $scope.ClaimSubtabActive = Id;
            if (Id == 1) {
                $scope.filtertabs(1, 'All', 1);
            } else if (Id == 2) {
                $scope.filtertabs(1, 'NotSubmitted', 2);
            } else if (Id == 3) {
                $scope.filtertabs(1, 'Transmitted', 3);
            } else if (Id == 4) {
                $scope.filtertabs(1, 'Denial', 4);
            } else if (Id == 5) {
                $scope.filtertabs(1, 'Rejected', 5);
            } else if (Id == 6) {
                $scope.filtertabs(1, 'acknoledge277', 6);
            } else if (Id == 7) {
                $scope.filtertabs(1, 'acknoledge999', 7);
            } else if (Id == 8) {
                $scope.filtertabs(1, 'ClaimFollowup', 8);
            } else if (Id == 9) {
                $scope.filtertabs(1, 'Queue', 9);
            } else if (Id == 10) {
                $scope.filtertabs(1, 'AdjustReq', 10);
            } else if (Id == 11) {
                $scope.filtertabs(1, 'SecondaryTransmission', 11);
            } else if (Id == 12) {
                $scope.navtoSubtabs(12);
            } else if (Id == 15) {
                $scope.filtertabs(1, 'All', 15);
            } else {
                if (Id == 13) {
                    $scope.filtertabs(1, 'All', 13);
                }
            }
        });
        $scope.ClaimRespListObj = {
            "SelectRespString": "All",
            "ClaimRespName": "",
            "AllRespCheck": false
        };
        $scope.checkAllClaimResp = function (val) {
            if (val) {
                angular.forEach($scope.ClaimDataList, function (item) {
                    item.IsChecked = true;
                });

                $scope.ClaimRespListObj.SelectRespString = 'All';
            }
            else {
                angular.forEach($scope.ClaimDataList, function (item) {
                    item.IsChecked = false;
                });

                $scope.ClaimRespListObj.SelectRespString = 'Selected';
            }
            $scope.ClaimRespToggle();
        };
        $scope.ClaimRespToggle = function (obj) {
            var checkedArray = _.where($scope.ClaimDataList, { IsChecked: true });
            $scope.ClaimRespListObj.AllRespCheck = checkedArray.length > 0 && $scope.ClaimDataList.length === checkedArray.length ? true : false;
            if ($scope.ClaimRespListObj.AllRespCheck) {
                $scope.ClaimRespListObj.SelectRespString = 'All';
                $scope.SearchClaimListObj.BillPaymentTypeId = checkedArray.map(function (status) {
                    return status.BillPaymentTypeId;
                }).join(',');
            }

            if (!$scope.ClaimRespListObj.AllRespCheck && checkedArray.length > 0) {
                $scope.ClaimRespListObj.SelectRespString = 'Selected';
                $scope.SearchClaimListObj.BillPaymentTypeId = checkedArray.map(function (status) {
                    return status.BillPaymentTypeId;
                }).join(',');
                console.log($scope.SearchClaimListObj.BillPaymentTypeId);
            }
            if (!$scope.ClaimRespListObj.AllStatusCheck && checkedArray.length === 0) {
                $scope.ClaimRespListObj.SelectRespString = 'Select';
                $scope.SearchClaimListObj.BillPaymentTypeId = checkedArray.map(function (status) {
                    return status.BillPaymentTypeId;
                }).join(',');
                console.log($scope.SearchClaimListObj.BillPaymentTypeId);
            }
        };



        //$scope.SelectAllPaperClaims = function (val) {
        //    console.log(val);
        //    $scope.IsAllPaperClaimsChecked = val;

        //    if ($scope.IsAllPaperClaimsChecked) {
        //        angular.forEach($scope.OrgClaimListdata, function (mitem) {
        //            mitem.IsSelectedClaim = true;
        //        });
        //    } else {
        //        angular.forEach($scope.OrgClaimListdata, function (mitem) {
        //            mitem.IsSelectedClaim = false;
        //        });
        //    }
        //};


        $scope.SelectAllPaperClaims = function (val) {
            console.log(val);
            $scope.filterObj.IsAllPaperClaimsChecked = val;

            if ($scope.filterObj.IsAllPaperClaimsChecked) {
                angular.forEach($scope.OrgClaimListdata, function (mitem) {
                    if (!mitem.AckId) {
                        mitem.IsSelectedClaim = true;
                    } else {
                        mitem.IsSelectedClaim = false;
                    }

                });
            } else {
                angular.forEach($scope.OrgClaimListdata, function (mitem) {
                    mitem.IsSelectedClaim = false;
                });
            }
        };

        $scope.checkSelectedClaimsandgenerateandprintAck = function () {
            var selectedClaims = $filter("filter")($scope.OrgClaimListdata, { "IsSelectedClaim": true }, true) || [];
            if (selectedClaims.length === 0) {
                alertify.error("No claims selected,Please select claims to continue");
                return false;
            }


            var groupedByPayor = {};

            selectedClaims.forEach(function (item) {

                var PayorId = 0;

                if (item.BillPaymentTypeId == 2) {
                    PayorId = item.OrganizationPayorId || 0;
                }
                else {
                    PayorId = item.OrganizationPayorId || 0;
                }

                if (!groupedByPayor[PayorId]) {
                    groupedByPayor[PayorId] = {
                        PayorId: PayorId,
                        AckId: item.AckId || 0,
                        AckNumber: "",// item.AckNumber || "",
                        OrganizationId: $scope.HospitalId,
                        AckDate: moment().format("YYYY-MM-DD"),
                        DeleteInd: "N",
                        ClaimsList: []
                    };
                }

                groupedByPayor[PayorId].ClaimsList.push({
                    AckClaimMapId: 0,
                    AckId: item.AckId || 0,
                    PatientClaimId: item.PatientClaimId,
                    AckNumber: "",// item.AckNumber || "",
                    DeleteInd: "N"
                });

            });


            var payorClaimsArray = Object.keys(groupedByPayor).map(function (key) {
                return groupedByPayor[key];
            });


            var mainreqobj = {
                UserId: $scope.UserId,
                PayorClaims: payorClaimsArray
            };

            console.log(mainreqobj);

            console.log('🚀 Batch started at', new Date().toISOString(), new Error().stack);



            eHnoteInsuranceService
                .AddUpdateManualClaimAckinfoForMultipleClaims(mainreqobj)

                // ── Step 1: Save ACK, then load ManualClaimAckData ──────
                .then(function (resp) {
                    if (resp.data[0].Status !== 'Success') {
                        return $q.reject('ACK save failed: ' + resp.data[0].Status);
                    }

                    $scope.AckId = resp.data[0].Response.AckId;

                    var ackObj = {
                        OrganizationId: $scope.HospitalId,
                        AckDate: moment().format('YYYY-MM-DD'),
                        IsClaimsBased: true,
                        PatientClaimIds: selectedClaims.map(x => x.PatientClaimId).join(','),
                        AckId: '',
                    };

                    return $scope.GetManualClaimAckData(ackObj);
                })

                // ── Step 2: Fetch ALL claim details in ONE bulk call ────────────
                .then(function () {
                    var allClaimItems = [];

                    angular.forEach($scope.ManualClaimAckData, function (ack) {
                        angular.forEach(ack.ClaimsList, function (claimItem) {
                            var formId = parseInt(claimItem.ClaimFormId);
                            if (formId === 1 || formId === 2) {
                                allClaimItems.push({
                                    PatientClaimId: claimItem.PatientClaimId,
                                    ClaimFormId: formId,
                                });
                            }
                        });
                    });

                    if (allClaimItems.length === 0) {
                        return $q.reject('No valid claims found to generate PDFs');
                    }

                    var claimIds = allClaimItems.map(function (c) { return c.PatientClaimId; });

                    // ONE bulk API call instead of N individual calls
                    return eHnoteInsuranceService
                        .GetBulkClaimDetails(claimIds)   // <-- your new bulk endpoint
                        .then(function (resp) {
                            var detailsMap = {};
                            if (resp.data && resp.data.Status === 'Success') {
                                resp.data.Data.forEach(function (claimData, idx) {
                                    if (claimData) {
                                        detailsMap[allClaimItems[idx].PatientClaimId] = {
                                            data: claimData,
                                            ClaimFormId: allClaimItems[idx].ClaimFormId,
                                        };
                                    }
                                });
                            }
                            return { allClaimItems: allClaimItems, detailsMap: detailsMap };
                        });
                })


                // ── Step 3: Generate ALL PDFs in ONE bulk API call ───────────────
                // Step 3: Generate all PDFs in parallel on frontend
                .then(function (ctx) {
                    $scope.pdfBase64List = [];

                    var readyClaims = ctx.allClaimItems.filter(function (item) {
                        return !!ctx.detailsMap[item.PatientClaimId];
                    });

                    // ── Build isolated HCFADetailsInfo/UBDetailsInfo per claim ────
                    var bulkPayload = [];

                    readyClaims.forEach(function (item) {
                        var entry = ctx.detailsMap[item.PatientClaimId];

                        if (item.ClaimFormId === 1) {
                            var HCFADetailsInfo = buildHCFADetailsInfo(entry.data, item); // isolated builder
                            bulkPayload.push({
                                PatientClaimId: item.PatientClaimId,
                                ClaimFormId: 1,
                                PrintData: HCFADetailsInfo
                            });
                        } else if (item.ClaimFormId === 2) {
                            var UBDetailsInfo = buildUBDetailsInfo(entry.data, item);     // isolated builder
                            bulkPayload.push({
                                PatientClaimId: item.PatientClaimId,
                                ClaimFormId: 2,
                                PrintData: UBDetailsInfo
                            });
                        }
                    });

                    // ── ONE call to backend instead of N calls ─────────────────────
                    return eHnoteMainAppointmentService.GenerateBulkClaimPDFs({ Claims: bulkPayload });
                })
                .then(function (resp) {
                    $scope.pdfBase64List = resp.data.Data
                        .filter(function (r) { return r.Success && r.Base64Pdf; })
                        .map(function (r) { return r.Base64Pdf; });

                    return $scope.MergeCMS1500PDF();
                })
                .then(function () {
                    return $scope.navprintPatientAck();
                })
                .catch(function (error) {
                    console.error('Batch PDF error:', error);
                    alertify.error('PDF generation failed. Please try again.');
                });
            $scope.SearchClaimListObj.TransmissionMethodId = 2;
            $scope.SearchClaimListObj.TransmissionMethod = "Paper";
            $scope.SearchAllClaimDetails(1, 'PaperClaims');
        }

        $scope.ClaimRenderingListObj = {
            "SelectRenderingString": "All",
            "ClaimRenderingName": "",
            "AllRenderingCheck": false
        };
        $scope.checkAllClaimRendering = function (val) {
            if (val) {
                angular.forEach($scope.mainBillerDataObj.AllDoctorsList, function (item) {
                    item.IsChecked = true;
                });

                $scope.ClaimRenderingListObj.SelectRenderingString = 'All';
            }
            else {
                angular.forEach($scope.mainBillerDataObj.AllDoctorsList, function (item) {
                    item.IsChecked = false;
                });

                $scope.ClaimRenderingListObj.SelectRenderingString = 'Selected';
            }
            $scope.ClaimRenderingToggle();
        };
        $scope.ClaimRenderingToggle = function (obj) {
            var checkedArray = _.where($scope.mainBillerDataObj.AllDoctorsList, { IsChecked: true });
            $scope.ClaimRenderingListObj.AllRenderingCheck = checkedArray.length > 0 && $scope.mainBillerDataObj.AllDoctorsList.length === checkedArray.length ? true : false;
            if ($scope.ClaimRenderingListObj.AllRenderingCheck) {
                $scope.ClaimRenderingListObj.SelectRenderingString = 'All';
                $scope.SearchClaimListObj.RenderingProviderId = checkedArray.map(function (status) {
                    return status.DoctorID;
                }).join(',');
            }

            if (!$scope.ClaimRenderingListObj.AllRenderingCheck && checkedArray.length > 0) {
                $scope.ClaimRenderingListObj.SelectRenderingString = 'Selected';
                $scope.SearchClaimListObj.RenderingProviderId = checkedArray.map(function (status) {
                    return status.DoctorID;
                }).join(',');
                console.log($scope.SearchClaimListObj.RenderingProviderId);
            }
            if (!$scope.ClaimRenderingListObj.AllRenderingCheck && checkedArray.length === 0) {
                $scope.ClaimRenderingListObj.SelectRenderingString = 'Select';
                $scope.SearchClaimListObj.RenderingProviderId = checkedArray.map(function (status) {
                    return status.DoctorID;
                }).join(',');
                console.log($scope.SearchClaimListObj.RenderingProviderId);
            }
        };

        $scope.ClaimCurrentResponsibilityListObj = {
            "SelectCurrentResponsibilityString": "All",
            "ClaimCurrentResponsibilityName": "",
            "AllCurrentResponsibilityCheck": false
        };
        $scope.checkAllClaimCurrentResponsibility = function (val) {
            if (val) {
                angular.forEach($scope.CurrentResponsibilityList, function (item) {
                    item.IsChecked = true;
                });

                $scope.ClaimCurrentResponsibilityListObj.SelectCurrentResponsibilityString = 'All';
            }
            else {
                angular.forEach($scope.CurrentResponsibilityList, function (item) {
                    item.IsChecked = false;
                });

                $scope.ClaimCurrentResponsibilityListObj.SelectCurrentResponsibilityString = 'Selected';
            }
            $scope.ClaimCurrentResponsibilityToggle();
        };
        $scope.ClaimCurrentResponsibilityToggle = function (obj) {
            var checkedArray = _.where($scope.CurrentResponsibilityList, { IsChecked: true });
            $scope.ClaimCurrentResponsibilityListObj.AllCurrentResponsibilityCheck = checkedArray.length > 0 && $scope.CurrentResponsibilityList.length === checkedArray.length ? true : false;
            if ($scope.ClaimCurrentResponsibilityListObj.AllCurrentResponsibilityCheck) {
                $scope.ClaimCurrentResponsibilityListObj.SelectCurrentResponsibilityString = 'All';
                $scope.SearchClaimListObj.CurrentResponsibilityId = checkedArray.map(function (status) {
                    return status.CurrentResponsibilityId;
                }).join(',');
            }

            if (!$scope.ClaimCurrentResponsibilityListObj.AllCurrentResponsibilityCheck && checkedArray.length > 0) {
                $scope.ClaimCurrentResponsibilityListObj.SelectCurrentResponsibilityString = 'Selected';
                $scope.SearchClaimListObj.CurrentResponsibilityId = checkedArray.map(function (status) {
                    return status.CurrentResponsibilityId;
                }).join(',');
                console.log($scope.SearchClaimListObj.CurrentResponsibilityId);
            }
            if (!$scope.ClaimCurrentResponsibilityListObj.AllCurrentResponsibilityCheck && checkedArray.length === 0) {
                $scope.ClaimCurrentResponsibilityListObj.SelectCurrentResponsibilityString = 'Select';
                $scope.SearchClaimListObj.CurrentResponsibilityId = checkedArray.map(function (status) {
                    return status.CurrentResponsibilityId;
                }).join(',');
                console.log($scope.SearchClaimListObj.CurrentResponsibilityId);
            }
        };

        $scope.ClaimFormatListObj = {
            "SelectFormatString": "All",
            "ClaimFormatName": "",
            "AllFormatCheck": false
        };
        $scope.checkAllClaimFormat = function (val) {
            if (val) {
                angular.forEach($scope.ClaimFormatList, function (item) {
                    item.IsChecked = true;
                });

                $scope.ClaimFormatListObj.SelectFormatString = 'All';
            }
            else {
                angular.forEach($scope.ClaimFormatList, function (item) {
                    item.IsChecked = false;
                });

                $scope.ClaimFormatListObj.SelectFormatString = 'Selected';
            }
            $scope.ClaimFormatToggle();
        };
        $scope.ClaimFormatToggle = function (obj) {
            var checkedArray = _.where($scope.ClaimFormatList, { IsChecked: true });
            $scope.ClaimFormatListObj.AllFormatCheck = checkedArray.length > 0 && $scope.ClaimFormatList.length === checkedArray.length ? true : false;
            if ($scope.ClaimFormatListObj.AllFormatCheck) {
                $scope.ClaimFormatListObj.SelectFormatString = 'All';
                $scope.SearchClaimListObj.TransmissionMethodId = checkedArray.map(function (status) {
                    return status.TransmissionMethodId;
                }).join(',');
            }

            if (!$scope.ClaimFormatListObj.AllFormatCheck && checkedArray.length > 0) {
                $scope.ClaimFormatListObj.SelectFormatString = 'Selected';
                $scope.SearchClaimListObj.TransmissionMethodId = checkedArray.map(function (status) {
                    return status.TransmissionMethodId;
                }).join(',');
                console.log($scope.SearchClaimListObj.TransmissionTypeId);
            }
            if (!$scope.ClaimFormatListObj.AllFormatCheck && checkedArray.length === 0) {
                $scope.ClaimFormatListObj.SelectFormatString = 'Select';
                $scope.SearchClaimListObj.TransmissionMethodId = checkedArray.map(function (status) {
                    return status.TransmissionMethodId;
                }).join(',');
                console.log($scope.SearchClaimListObj.TransmissionTypeId);
            }
        };

        $scope.ClaimPayorListObj = {
            "SelectPayorString": "All",
            "ClaimPayorName": "",
            "AllPayorCheck": false
        };
        $scope.checkAllClaimPayors = function (val) {
            if (val) {
                angular.forEach($scope.OrganizationPayorsList, function (item) {
                    item.IsChecked = true;
                });

                $scope.ClaimPayorListObj.SelectPayorString = 'All';
            }
            else {
                angular.forEach($scope.OrganizationPayorsList, function (item) {
                    item.IsChecked = false;
                });

                $scope.ClaimPayorListObj.SelectPayorString = 'Selected';
            }
            $scope.ClaimPayorToggle();
        };
        $scope.DisablePayorCheck = false;

        $scope.ClaimPayorToggle = function (obj) {
            var checkedArray = _.where($scope.OrganizationPayorsList, { IsChecked: true });
            $scope.DisablePayorCheck = checkedArray.length > 1;
            $scope.ClaimPayorListObj.AllFormatCheck = checkedArray.length > 0 && $scope.OrganizationPayorsList.length === checkedArray.length ? true : false;
            if ($scope.ClaimPayorListObj.AllPayorCheck) {
                $scope.ClaimPayorListObj.SelectPayorString = 'All';
                $scope.SearchClaimListObj.PayorId = checkedArray.map(function (status) {
                    return status.PayorId;
                }).join(',');
            }

            if (!$scope.ClaimPayorListObj.AllPayorCheck && checkedArray.length > 0) {
                $scope.ClaimPayorListObj.SelectPayorString = 'Selected';
                $scope.SearchClaimListObj.PayorId = checkedArray.map(function (status) {
                    return status.PayorId;
                }).join(',');
                console.log($scope.SearchClaimListObj.PayorId);
            }
            if (!$scope.ClaimPayorListObj.AllFormatCheck && checkedArray.length === 0) {
                $scope.ClaimPayorListObj.AllPayorCheck = 'Select';
                $scope.SearchClaimListObj.PayorId = checkedArray.map(function (status) {
                    return status.PayorId;
                }).join(',');
                console.log($scope.SearchClaimListObj.TransmissionTypeId);
            }
        };

        $scope.GetManualClaimAckData = function (obj) {
            console.log(obj)

            return eHnoteInsuranceService.GetManualClaimAckData(obj)
                .then(function (resp) {
                    console.log(resp)
                    // $scope.TotalClaimsChargeAmount = 0;
                    $scope.ManualClaimAckData = resp.data.rows;
                    $scope.loadOrganizationLogo();

                    angular.forEach($scope.ManualClaimAckData, function (claim) {
                        claim.TotalClaimsChargeAmount = 0;
                        angular.forEach(claim.ClaimsList, function (item) {
                            /*claim.TotalClaimsChargeAmount += Number(item.TotalChargeAmount) || 0;*/
                            angular.forEach(item.Lineitems, function (pitem) {
                                if (pitem.IsSecondaryChargeEdited == true && pitem.SecondaryTotalChargeAmount != null) {
                                    claim.TotalClaimsChargeAmount += pitem.SecondaryTotalChargeAmount || 0;
                                } else {
                                    claim.TotalClaimsChargeAmount += pitem.PrimaryTotalChargeAmount || 0;
                                }
                            });
                        });

                    });

                    console.log($scope.ManualClaimAckData)

                });
        };

        $scope.navprintPatientAck = function () {



            return $timeout(function () {

                var printContents = document.getElementById('PaperAck_print').innerHTML;

                var popupWinindow = window.open('', '_blank');

                popupWinindow.document.open();
                popupWinindow.document.write(`
            <html>
                <head>
                    <link rel="stylesheet" type="text/css" href="css/billing.css" />
                </head>
                <body onload="window.print();">
                    ${printContents}
                </body>
            </html>
        `);

                popupWinindow.document.close();
            }, 1000);
        }


        $scope.GetManualClaimAckDataandPrint = function (obj) {
            var reqobj = {
                "OrganizationId": $scope.HospitalId,
                "AckDate": obj.AckDate ? obj.AckDate : "",
                "IsClaimsBased": true,
                "PatientClaimIds": obj.PatientClaimId ? obj.PatientClaimId.toString() : "",
                "AckId": "",// obj.AckId
            };

            return eHnoteInsuranceService.GetManualClaimAckData(reqobj)
                .then(function (resp) {
                    console.log(resp)
                    //$scope.TotalClaimsChargeAmount = 0;
                    $scope.ManualClaimAckData = resp.data.rows;
                    $scope.loadOrganizationLogo();
                    angular.forEach($scope.ManualClaimAckData, function (claim) {
                        claim.TotalClaimsChargeAmount = 0;
                        angular.forEach(claim.ClaimsList, function (item) {
                            claim.TotalClaimsChargeAmount += Number(item.TotalChargeAmount) || 0;
                        });

                    });
                    if (obj.PatientClaimId) {
                        var claimobj = {
                            "PatientClaimId": obj.PatientClaimId
                        };
                        if (obj.ClaimFormId === 1) {
                            $scope.ClaimDashBoadHCFAPrint(claimobj, 'WithLine');
                        }
                        else if (obj.ClaimFormId === 2) {
                            $scope.GetPatientDetailsForUBformDetailsinBiller(claimobj, 'withTemplate');
                        }
                    }


                    console.log($scope.ManualClaimAckData)
                    $timeout(function () {
                        $scope.navprintPatientAck();
                    }, 500);

                });
        };

        $scope.arrayBufferToBase64 = function (buffer) {
            var binary = '';
            var bytes = new Uint8Array(buffer);
            for (var i = 0; i < bytes.byteLength; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return window.btoa(binary);
        };
        $scope.MergeCMS1500PDF = function () {
            var req = {
                PdfList: $scope.pdfBase64List,
                AckId: $scope.AckId,
                UserId: $scope.UserId
            };
            console.log($scope.pdfBase64List);
            eHnoteMainAppointmentService.MergeCMS1500PDF(req)
                .then(function (response) {
                    console.log(response)

                });
        };


        function GetAllManualClaimAckObj() {
            var obj = {
                "FromDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "ToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "OrganizationId": $scope.HospitalId,
                "AckNumber": "",
                "PageSize": 50,
                "PageNumber": 1,
                "Count": 0
            }
            return obj;
        };
        $scope.ManualClaimAckObj = GetAllManualClaimAckObj();

        $scope.GetAllManualClaimAckDetails = function (pageno) {

            $scope.ManualClaimAckObj.PageNumber = pageno || 1;
            $scope.IsAckList = true;
            $scope.ClaimAckListactiveTab = 'ackclaimlist';

            var obj = {
                "FromDate": $scope.ManualClaimAckObj.FromDate || null,
                "ToDate": $scope.ManualClaimAckObj.ToDate || null,
                "OrganizationId": $scope.ManualClaimAckObj.OrganizationId || 0,
                "AckNumber": $scope.ManualClaimAckObj.AckNumber || "",
                "PageSize": $scope.ManualClaimAckObj.PageSize,
                "PageNumber": $scope.ManualClaimAckObj.PageNumber,
            }

            return eHnoteInsuranceService.GetAllManualClaimAckDetails(obj)
                .then(function (resp) {
                    console.log(resp)
                    if (resp.data.status == "Success") {
                        $scope.ManualClaimAckDetails = resp.data.rows;
                        $scope.ManualClaimAckObj.Count = resp.data.count;

                        console.log($scope.ManualClaimAckDetails)
                    }


                });
        };

        $scope.refreshManualClaimAckDetails = function () {
            $scope.ManualClaimAckObj = GetAllManualClaimAckObj();
            $scope.GetAllManualClaimAckDetails(1);
        }

        $scope.getClaimAckTrustedUrl = function (url) {
            if (!url || url === '' || url === null) {
                alertify.error('No document available.');
                return;
            }
            window.open(url, '_blank');
        };

        $scope.ClaimListactiveTab = 'list'; // Default to List tab

        $scope.NavtoclaimslistandAgingscreen = function (tab) {
            $scope.ClaimListactiveTab = tab;

            if ($scope.ClaimListactiveTab == 'list') {
                $scope.SearchAllClaimDetails(1, 'All', 'Apply')
            } else {
                $scope.ClaimSubtabActive === 12
                $scope.navtoSubtabs(12);
            }

        };
        $scope.GetAllManualClaimAckDataandPrint = function (obj) {
            var reqobj = {
                "OrganizationId": obj.OrganizationId,
                "AckDate": obj.AckDate ? obj.AckDate : moment().format("YYYY-MM-DD"),
                "IsClaimsBased": true,
                "PatientClaimIds": "",
                "AckId": obj.AckId,
            };

            return eHnoteInsuranceService.GetManualClaimAckData(reqobj)
                .then(function (resp) {
                    console.log(resp)
                    //$scope.TotalClaimsChargeAmount = 0;
                    $scope.ManualClaimAckData = resp.data.rows;
                    $scope.loadOrganizationLogo();
                    angular.forEach($scope.ManualClaimAckData, function (claim) {
                        claim.TotalClaimsChargeAmount = 0;
                        angular.forEach(claim.ClaimsList, function (item) {
                            claim.TotalClaimsChargeAmount += Number(item.TotalChargeAmount) || 0;
                        });

                    });

                    console.log($scope.ManualClaimAckData)
                    $timeout(function () {
                        $scope.navprintPatientAck();
                    }, 500);

                });
        };

        function processInChunks(items, chunkSize, asyncFn) {
            var results = [];
            var chunks = [];

            for (var i = 0; i < items.length; i += chunkSize) {
                chunks.push(items.slice(i, i + chunkSize));
            }

            return chunks.reduce(function (chain, chunk) {
                return chain.then(function () {
                    var chunkPromises = chunk.map(asyncFn);
                    return $q.all(chunkPromises).then(function (chunkResults) {
                        chunkResults.forEach(function (r) {
                            if (r !== null && r !== undefined) results.push(r);
                        });
                    });
                });
            }, $q.resolve()).then(function () {
                return results;
            });
        }
        function buildHCFADetailsInfo(respData, item) {
            var HCFADetailsInfo = eHnoteCacheStorageService.GetHCFAStorageStructure(); // LOCAL var

            HCFADetailsInfo.PreAuthorizationNumber =
                respData.PrimaryInsuranceAuthorizationNumber &&
                    respData.PrimaryInsuranceAuthorizationNumber.trim() !== ''
                    ? respData.PrimaryInsuranceAuthorizationNumber
                    : (respData.SecondaryInsuranceAuthorizationNumber &&
                        respData.SecondaryInsuranceAuthorizationNumber.trim() !== ''
                        ? respData.SecondaryInsuranceAuthorizationNumber : '');

            HCFADetailsInfo.PatientDetails.fullname =
                respData.Patient[0].FirstName + ' ' + respData.Patient[0].MiddleName + ' ' +
                respData.Patient[0].LastName + ' ' + respData.Patient[0].SecondLastName;

            HCFADetailsInfo.PatientDetails.DOB = respData.DOB || '';
            HCFADetailsInfo.PatientDetails.FirstName = respData.Patient[0].FirstName;
            HCFADetailsInfo.PatientDetails.MiddleName = respData.Patient[0].MiddleName;
            HCFADetailsInfo.PatientDetails.LastName = respData.Patient[0].LastName;
            HCFADetailsInfo.PatientDetails.SecondLastName = respData.Patient[0].SecondLastName;

            var mobileObj = eHnoteUserDataService.UsMobileFormatChange(respData.PatientMobile);
            HCFADetailsInfo.PatientDetails.MobileNo = mobileObj.UsFormatMobileNumber;

            HCFADetailsInfo.PatientDetails.ContactNo = respData.ContactNo || '';
            if (HCFADetailsInfo.PatientDetails.ContactNo.length > 10) {
                var contactObj = eHnoteUserDataService.UsMobileFormatChange(respData.ContactNo);
                HCFADetailsInfo.PatientDetails.ContactNo = contactObj.UsFormatMobileNumber;
            }

            HCFADetailsInfo.PatientDetails.Title = respData.Title || '';
            HCFADetailsInfo.PatientDetails.Sex = respData.Gender;
            HCFADetailsInfo.PatientDetails.PatientDisplayId = respData.PatientDisplayId;
            HCFADetailsInfo.PatientAccountNo = respData.PatientClaimNumber || '';

            if ($scope.isIojOrgEnable) {
                if (respData.CurrentResponsibilityId == 2) HCFADetailsInfo.PatientAccountNo += 'P';
                else if (respData.CurrentResponsibilityId == 3) HCFADetailsInfo.PatientAccountNo += 'S';
            }

            if (respData.Patient.length > 0) {
                var patientresp = respData.Patient[0];
                HCFADetailsInfo.PatientDetails.CityName = patientresp.PostalAddress.CityName || '';
                HCFADetailsInfo.PatientDetails.StateName = patientresp.PostalAddress.StateName || '';
                HCFADetailsInfo.PatientDetails.StateCode = patientresp.PostalAddress.StateCode || '';
                HCFADetailsInfo.PatientDetails.ZipCode = patientresp.PostalAddress.ZipCode || '';
                HCFADetailsInfo.PatientDetails.Address1 = patientresp.PostalAddress.AddressLine1 || '';
                HCFADetailsInfo.PatientDetails.Address2 = patientresp.PostalAddress.AddressLine2 || '';
                HCFADetailsInfo.InsuranceDetails.Address = HCFADetailsInfo.PatientDetails.Address1 + ' , ' + HCFADetailsInfo.PatientDetails.Address2;
                HCFADetailsInfo.InsuranceDetails.CityName = patientresp.PostalAddress.CityName || '';
                HCFADetailsInfo.InsuranceDetails.StateName = patientresp.PostalAddress.StateName || '';
                HCFADetailsInfo.InsuranceDetails.StateCode = patientresp.PostalAddress.StateCode || '';
                HCFADetailsInfo.InsuranceDetails.ZipCode = patientresp.PostalAddress.ZipCode || '';
            }

            HCFADetailsInfo.PatientDetails.CountryCode = respData.CountryCode || '';
            HCFADetailsInfo.PatientSSN = respData.PatientSSN || '';
            HCFADetailsInfo.FeedralTaxIDNo = respData.BillingProviderTaxId || '';
            HCFADetailsInfo.EIN = 'yes';

            var currentdate = $filter('date')(new Date(), 'MM-dd-yyyy');
            HCFADetailsInfo.datesPatientUnabletoWorkincurrentoccupation.FormDate = $filter('date')(respData.DOSfrom, 'MM-dd-yyyy') || currentdate;
            HCFADetailsInfo.datesPatientUnabletoWorkincurrentoccupation.ToDate = $filter('date')(respData.DOSto, 'MM-dd-yyyy') || currentdate;
            HCFADetailsInfo.hospitalizationDatesRelatedToCurrentServices.FormDate = $filter('date')(respData.DOSfrom, 'MM-dd-yyyy') || currentdate;
            HCFADetailsInfo.hospitalizationDatesRelatedToCurrentServices.ToDate = $filter('date')(respData.DOSto, 'MM-dd-yyyy') || currentdate;

            HCFADetailsInfo.HeaderInsurance.PayorName = respData.PayorName || '';
            HCFADetailsInfo.HeaderInsurance.Address = respData.PayorAddress || '';
            HCFADetailsInfo.HeaderInsurance.PatientDisplayId = respData.PatientDisplayId || '';

            if (respData.AppointmentInsuranceDetails.length > 0) {
                var insIdx = respData.CurrentResponsibilityId == 2 ? 0
                    : respData.CurrentResponsibilityId == 3
                        ? (respData.AppointmentInsuranceDetails.length > 1 ? 1 : 0)
                        : (respData.AppointmentInsuranceDetails.length > 2 ? 2 : 0);

                var ins = respData.AppointmentInsuranceDetails[insIdx];
                HCFADetailsInfo.HeaderInsurance.Address1 = ins.PayorAddress1 || '';
                HCFADetailsInfo.HeaderInsurance.Address2 = ins.PayorAddress2 || '';
                HCFADetailsInfo.HeaderInsurance.PayorCityName = ins.PayorCityName || '';
                HCFADetailsInfo.HeaderInsurance.PayorStateName = ins.PayorStateName || '';
                HCFADetailsInfo.HeaderInsurance.PayorCountryName = ins.PayorCountryName || '';
                HCFADetailsInfo.HeaderInsurance.PayorZipCode = ins.PayorZipCode || '';
                HCFADetailsInfo.HeaderInsurance.PayorCode = ins.PayorCode || '';
                HCFADetailsInfo.HeaderInsurance.PayorStateCode = ins.PayorStateCode || '';
                HCFADetailsInfo.HeaderInsurance.UserTaxonomyCode = ins.UserTaxonomyCode || '';
                HCFADetailsInfo.PatientDetails.DoctorName = ins.DoctorName || '';
                HCFADetailsInfo.PatientDetails.RelationName = ins.RelationName || '';
                HCFADetailsInfo.PatientDetails.RelationShipId = ins.RelationShipId || '';
                HCFADetailsInfo.PatientDetails.AppointmentDate = $filter('date')(ins.AppointmentDate, 'MM-dd-yyyy') || '';
                HCFADetailsInfo.PatientDetails.InsuranceTypeCode = ins.InsuranceTypeCode || '';
                HCFADetailsInfo.HeaderInsurance.PayorId = ins.PayorId || '';
                HCFADetailsInfo.HeaderInsurance.GlobalPayorId = ins.GlobalPayorId || '';
            }

            HCFADetailsInfo.PatientDetails.DoctorName = HCFADetailsInfo.PatientDetails.DoctorName || $scope.doctorinfo.doctordata.User[0].FullName;
            HCFADetailsInfo.InsuranceDetails.PolicyId = respData.PolicyId || 0;
            HCFADetailsInfo.InsuranceDetails.InsurancePlanName = respData.ProffesionalPayerId || '';
            HCFADetailsInfo.InsuranceDetails.InsurancePayorName = respData.OrganizationPayorName || '';
            HCFADetailsInfo.InsuranceDetails.PolicyGroupId = respData.GroupId || 0;
            HCFADetailsInfo.InsuranceDetails.PolicyGroupname = respData.Groupname || 0;
            HCFADetailsInfo.PatientDetails.RelationshipToInsured = respData.RelationShipId || 0;
            HCFADetailsInfo.InsuranceDetails.IsThereAnotherHealthBenefitPlan = respData.AppointmentInsuranceDetails.length > 1 ? 'Yes' : 'No';
            HCFADetailsInfo.InsuranceDetails.InsurancePersonName = respData.FirstName + ' ' + respData.Lastname || '';
            HCFADetailsInfo.InsuranceDetails.MobileNo = HCFADetailsInfo.PatientDetails.ContactNo || '';
            HCFADetailsInfo.InsuranceDetails.Gender = respData.Gender == 'Female' ? 'F' : 'M';
            HCFADetailsInfo.InsuranceDetails.DOB = respData.DOB;
            HCFADetailsInfo.InsuranceDetails.TelephoneCode = respData.CountryCode || '';
            HCFADetailsInfo.OriginalRefNo = respData.PatientClaimNo || '';

            if (respData.AppointmentInsuranceDetails.length > 0) {
                var ai0 = respData.AppointmentInsuranceDetails[0];
                HCFADetailsInfo.InsuranceDetails.InsuredPersonFirstName1 = ai0.InsuredPersonFirstName || '';
                HCFADetailsInfo.InsuranceDetails.InsuredPersonMiddleName1 = ai0.InsuredPersonMiddleName || '';
                HCFADetailsInfo.InsuranceDetails.InsuredPersonLastName1 = ai0.InsuredPersonLastName || '';
                HCFADetailsInfo.InsuranceDetails.InsuredPersonGenderID1 = ai0.InsuredPersonGenderID || '';
                HCFADetailsInfo.InsuranceDetails.PlanTypeId = ai0.PlanTypeId || '';
                HCFADetailsInfo.InsuranceDetails.PayorPlanCode = ai0.PayorPlanCode || '';
                HCFADetailsInfo.InsuranceDetails.PayorTypeId = ai0.PayorTypeId || 0;
                HCFADetailsInfo.InsuranceDetails.CoverageName = ai0.CoverageName || '';
                HCFADetailsInfo.InsuranceDetails.PlanName = ai0.PlanName || '';
                HCFADetailsInfo.InsuranceDetails.InsurancePayorName = ai0.OrganizationPayorName || '';
                HCFADetailsInfo.InsuranceDetails.PolicyId = ai0.PolicyId || '';
            }

            if (respData.AppointmentInsuranceDetails[1] !== undefined) {
                var ai1 = respData.AppointmentInsuranceDetails[1];
                HCFADetailsInfo.InsuranceDetails.InsuredPersonFirstName2 = ai1.InsuredPersonFirstName || '';
                HCFADetailsInfo.InsuranceDetails.InsuredPersonMiddleName2 = ai1.InsuredPersonMiddleName || '';
                HCFADetailsInfo.InsuranceDetails.InsuredPersonLastName2 = ai1.InsuredPersonLastName || '';
                HCFADetailsInfo.InsuranceDetails.InsuredPersonGenderID2 = ai1.InsuredPersonGenderID || '';
                HCFADetailsInfo.InsuranceDetails.PayorName2 = ai1.OrganizationPayorName || '';
                HCFADetailsInfo.InsuranceDetails.PlanName2 = ai1.PlanName || '';
                HCFADetailsInfo.InsuranceDetails.OtherInsPolicyId = ai1.PolicyId || '';
            }

            if (respData.PatientClaimTransmission[0] !== undefined) {
                var tx = respData.PatientClaimTransmission[0];
                HCFADetailsInfo.InsuranceDetails.BillTypeFrequencyCode = tx.BillTypeFrequencyCode || '';
                HCFADetailsInfo.InsuranceDetails.TransmissionMethodId = tx.TransmissionMethodId || '';
                HCFADetailsInfo.InsuranceDetails.ReplacementControlNumber = tx.ReplacementControlNumber || '';
            }

            if (respData.AppointmentInsuranceDetails.length > 0) {
                var filtredArray = $filter('filter')(respData.AppointmentInsuranceDetails,
                    { PatientInsuranceDetailId: item.TransmitQueuePatientInsuranceId }, true) || [];
                if (filtredArray.length > 0) {
                    var f = filtredArray[0];
                    HCFADetailsInfo.HeaderInsurance.PayorName = f.PayorName || '';
                    HCFADetailsInfo.HeaderInsurance.Address1 = f.PayorAddress1 || '';
                    HCFADetailsInfo.HeaderInsurance.Address2 = f.PayorAddress2 || '';
                    HCFADetailsInfo.HeaderInsurance.PayorCityName = f.PayorCityName || '';
                    HCFADetailsInfo.HeaderInsurance.PayorStateName = f.PayorStateName || '';
                    HCFADetailsInfo.HeaderInsurance.PayorCountryName = f.PayorCountryName || '';
                    HCFADetailsInfo.HeaderInsurance.PayorZipCode = f.PayorZipCode || '';
                    HCFADetailsInfo.HeaderInsurance.PayorCode = f.PayorCode || '';
                    HCFADetailsInfo.HeaderInsurance.PayorStateCode = f.PayorStateCode || '';
                    HCFADetailsInfo.HeaderInsurance.UserTaxonomyCode = f.UserTaxonomyCode || '';
                    HCFADetailsInfo.PatientDetails.DoctorName = f.DoctorName || '';
                    HCFADetailsInfo.PatientDetails.RelationName = f.RelationName || '';
                    HCFADetailsInfo.PatientDetails.RelationShipId = f.RelationShipId || '';
                    HCFADetailsInfo.PatientDetails.AppointmentDate = $filter('date')(f.AppointmentDate, 'MM-dd-yyyy') || '';
                    HCFADetailsInfo.PatientDetails.InsuranceTypeCode = f.InsuranceTypeCode || '';
                    HCFADetailsInfo.HeaderInsurance.PayorId = f.PayorId || '';
                    HCFADetailsInfo.HeaderInsurance.GlobalPayorId = f.GlobalPayorId || '';
                    HCFADetailsInfo.InsuranceDetails.PolicyId = f.PolicyId || 0;
                    HCFADetailsInfo.InsuranceDetails.InsurancePlanName = f.ProffesionalPayerId || '';
                    HCFADetailsInfo.InsuranceDetails.InsurancePayorName = f.OrganizationPayorName || '';
                    HCFADetailsInfo.InsuranceDetails.PolicyGroupId = f.GroupId || 0;
                    HCFADetailsInfo.InsuranceDetails.PolicyGroupname = f.Groupname || 0;
                    HCFADetailsInfo.InsuranceDetails.InsurancePersonName = f.InsuredPersonFirstName + ' ' + f.InsuredPersonLastName || '';
                    HCFADetailsInfo.InsuranceDetails.MobileNo = f.ContactNo || '';
                    HCFADetailsInfo.InsuranceDetails.Gender = f.InsuredPersonGenderID;
                    HCFADetailsInfo.InsuranceDetails.DOB = f.InsuredPersonDOB;
                    HCFADetailsInfo.InsuranceDetails.TelephoneCode = '';
                    HCFADetailsInfo.InsuranceDetails.InsuredPersonFirstName1 = f.InsuredPersonFirstName || '';
                    HCFADetailsInfo.InsuranceDetails.InsuredPersonMiddleName1 = f.InsuredPersonMiddleName || '';
                    HCFADetailsInfo.InsuranceDetails.InsuredPersonLastName1 = f.InsuredPersonLastName || '';
                    HCFADetailsInfo.InsuranceDetails.InsuredPersonGenderID1 = f.InsuredPersonGenderID || '';
                    HCFADetailsInfo.InsuranceDetails.PlanTypeId = f.PlanTypeId || '';
                    HCFADetailsInfo.InsuranceDetails.PayorPlanCode = f.PayorPlanCode || '';
                    HCFADetailsInfo.InsuranceDetails.PayorTypeId = f.PayorTypeId || 0;
                    HCFADetailsInfo.InsuranceDetails.CoverageName = f.CoverageName || '';
                    HCFADetailsInfo.InsuranceDetails.PlanName = f.PlanName || '';
                    HCFADetailsInfo.InsuranceDetails.PolicyId = f.PolicyId || '';
                }
            }

            for (var d = 1; d <= 12; d++) {
                HCFADetailsInfo['Diagnosis' + d] = respData['ICD' + d] || '';
            }

            HCFADetailsInfo.PlaceOfServiceName = respData.PlaceOfServiceName || '';
            HCFADetailsInfo.PlaceOfServiceId = respData.PlaceOfServiceId || '';
            HCFADetailsInfo.ProcedureList = [];
            HCFADetailsInfo.DiagnosisList = [];
            var ProcedureListArray = [];
            var diagSno = 1;

            if (respData.PatientClaimLineItems.length > 0) {
                angular.forEach(respData.PatientClaimLineItems, function (mainitem) {
                    mainitem.DiagnosisList = mainitem.DiagnosisList || [];
                    angular.forEach(mainitem.DiagnosisList, function (subitem) {
                        var exists = $filter('filter')(HCFADetailsInfo.DiagnosisList, { DiagnosisId: subitem.DiagnosisId }, true) || [];
                        if (exists.length === 0) {
                            subitem.SNO = diagSno++;
                            subitem.Date = $filter('date')(new Date(mainitem.AppointmentDate), 'MMM-dd-yyyy');
                            HCFADetailsInfo.DiagnosisList.push(subitem);
                        }
                    });
                    ProcedureListArray.push(mainitem);
                });
            }

            HCFADetailsInfo.RenderingProviderId = respData.RenderingProviderId || null;
            HCFADetailsInfo.TaxonomyCode = '';
            if (HCFADetailsInfo.RenderingProviderId != null) {
                var rdoc = $filter('filter')($scope.allUserList, { DoctorID: HCFADetailsInfo.RenderingProviderId }, true)[0] || {};
                HCFADetailsInfo.TaxonomyCode = angular.copy(rdoc.TaxonomyCode) || '';
            }

            angular.forEach(ProcedureListArray, function (pitem) {
                ['Modifier1', 'Modifier2', 'Modifier3', 'Modifier4'].forEach(function (m) {
                    pitem[m] = (pitem[m] || '').replace(/[\n\r]/g, '').trim();
                });
                var ModifierString = [pitem.Modifier1, pitem.Modifier2, pitem.Modifier3, pitem.Modifier4].filter(Boolean).join(', ');
                var amount = Number(pitem.TotalChargeAmount).toFixed(2).split('.');
                HCFADetailsInfo.ProcedureList.push({
                    ProcedureName: pitem.ServiceName, EPSDTFamilyPlan1: '  ', IdQual1: ' ', RenderingProviderId1: ' ',
                    FromDate: $filter('date')(pitem.DOSfrom, 'MM-dd-yyyy') || '',
                    ToDate: $filter('date')(pitem.DOSto, 'MM-dd-yyyy') || '',
                    PlaceOfService: HCFADetailsInfo.PlaceOfServiceName || '',
                    PlaceOfServiceId: HCFADetailsInfo.PlaceOfServiceId || '',
                    EMG: 'NO', CPTorHCPCS: pitem.ServiceCode,
                    Modifier: ModifierString || '',
                    Modifier1: pitem.Modifier1 || '', Modifier2: pitem.Modifier2 || '',
                    Modifier3: pitem.Modifier3 || '', Modifier4: pitem.Modifier4 || '',
                    DiagnosisPointer: pitem.DiagnosisPointers || '',
                    Charges: pitem.TotalChargeAmount || 0,
                    IntegerNumber: amount[0] || 0, DecimalNumber: amount[1] || 0, Charges1: amount[1],
                    DaysOrUnits: pitem.Quantity || '', EPSDTFamilyPlan: '', IdQual: '',
                    RenderingProviderId: respData.RenderingProviderId || '',
                    RenderingProviderNPI: respData.RenderingProviderNPI || '',
                    BillingProviderNPI: respData.BillingProviderNPI || '',
                    PayorPlanCode: HCFADetailsInfo.InsuranceDetails.PayorPlanCode || 0,
                    PayorTypeId: HCFADetailsInfo.InsuranceDetails.PayorTypeId || 0,
                    UserTaxonomyCode: HCFADetailsInfo.TaxonomyCode || '',
                    DrugProductID: '', NationalDrugCode: pitem.DrugNDCID || '',
                    DrugUnit: pitem.MedicineStrength || '', DrugUom: pitem.UnitName || '',
                    DrugLinkSeqNumber: '', DrugPharmacyPresNumber: '',
                });
            });

            HCFADetailsInfo.TotalCharges = respData.TotalClaimAmount;
            HCFADetailsInfo.TotalInsurancePayment = respData.TotalInsurancePayment;
            HCFADetailsInfo.TotalInsandPatPaidAmt = respData.TotalInsurancePayment + respData.TotalPatientPayment || 0;
            HCFADetailsInfo.TypeOfPayor = respData.PayorName || '';

            if ($scope.isIojOrgEnable) {
                HCFADetailsInfo.FacilityName = respData.ServiceFacilityName || '';
                HCFADetailsInfo.FacilityStateName = respData.ServiceFacilityStateName || '';
                HCFADetailsInfo.FacilityStateCode = respData.ServiceFacilityStateCode || '';
                HCFADetailsInfo.FacilityCityName = respData.ServiceFacilityCityName || '';
                HCFADetailsInfo.FacilityZipCode = respData.ServiceFacilityZipCode || '';
                HCFADetailsInfo.FacilityNPI = respData.ServiceFacilityNPI || '';
                HCFADetailsInfo.FacilityAddress1 = respData.ServiceFacilityAddress1 || '';
                HCFADetailsInfo.FacilityAddress2 = respData.ServiceFacilityAddress2 || '';
                HCFADetailsInfo.RenderingProviderName = '';
            } else {
                HCFADetailsInfo.FacilityName = respData.FacilityName || '';
                HCFADetailsInfo.FacilityStateName = respData.FacilityStateName || '';
                HCFADetailsInfo.FacilityStateCode = respData.FacilityStateCode || '';
                HCFADetailsInfo.FacilityCityName = respData.FacilityCityName || '';
                HCFADetailsInfo.FacilityZipCode = respData.FacilityZipCode || '';
                HCFADetailsInfo.FacilityNPI = respData.FacilityNPI || '';
                HCFADetailsInfo.FacilityAddress1 = respData.FacilityAddress1 || '';
                HCFADetailsInfo.FacilityAddress2 = respData.FacilityAddress2 || '';
                HCFADetailsInfo.RenderingProviderName = respData.RenderingProviderName || '';
            }

            var filteredList = $filter('filter')($scope.OrganizationBillingProviderList,
                { OrganizationBillingProviderId: respData.BillingProviderId }, true) || [];
            if (filteredList.length > 0) {
                var bl = filteredList[0];
                HCFADetailsInfo.PostalAddress1 = bl.Box33Address1;
                HCFADetailsInfo.PostalAddress2 = bl.Box33Address2;
                HCFADetailsInfo.PostalZipCode = bl.Box33ZipCode || '';
                HCFADetailsInfo.PostalCityName = bl.Box33CityName || '';
                HCFADetailsInfo.PostalStateName = bl.Box33StateName || '';
                HCFADetailsInfo.PostalStateCode = bl.Box33StateCode || '';
                HCFADetailsInfo.BillingProviderSSN = bl.BillingProviderSSN;
                HCFADetailsInfo.BillingProviderNPI = bl.NPI;
                HCFADetailsInfo.BillingProviderName = bl.BillingProviderName;
                HCFADetailsInfo.Box33GroupName = bl.Box33GroupName || '';
                HCFADetailsInfo.BillingProviderTaxId = bl.BillingProviderTaxId || '';
                HCFADetailsInfo.Box33GroupNPI = bl.Box33GroupNPI || '';
                HCFADetailsInfo.BillingProviderTaxonomyId = bl.TaxonomyId || '';
                HCFADetailsInfo.FeedralTaxIDNo = bl.TaxId || '';
                HCFADetailsInfo.EIN = 'yes';
                if (bl.ContactMobileNumber !== '') {
                    var bobj = eHnoteUserDataService.UsMobileFormatChange(bl.ContactMobileNumber);
                    HCFADetailsInfo.BillingProviderContactNumber = bobj.UsFormatMobileNumber;
                }
            }

            HCFADetailsInfo.CurrentDate = $filter('date')(respData.AdmissionDate, 'MM/dd/yyyy');
            HCFADetailsInfo.ReferringProvider = respData.ReferringProvider || '';
            HCFADetailsInfo.ReferringProviderNPI = respData.ReferringProviderNPI || '';
            HCFADetailsInfo.ReferralNumber = respData.ReferralNumber || '';
            HCFADetailsInfo.referringProviderId = respData.ReferringProviderId || null;
            HCFADetailsInfo.ReferringProviderId = respData.ReferringProviderId || null;
            HCFADetailsInfo.OrderingProviderId = respData.OrderingProviderId || null;
            HCFADetailsInfo.orderingProviderId = respData.OrderingProviderId || null;
            HCFADetailsInfo.supervisingProviderId = respData.supervisingProviderId || null;
            HCFADetailsInfo.supervisingProviderUserId = respData.supervisingProviderUserId || null;
            HCFADetailsInfo.referringProviderUserId = respData.referringProviderUserId || null;
            HCFADetailsInfo.orderingProviderUserId = respData.orderingProviderUserId || null;
            HCFADetailsInfo.RenderingProviderId = respData.RenderingProviderId || null;
            HCFADetailsInfo.OrderingProviderName = '';
            HCFADetailsInfo.supervisingProviderName = '';

            if (HCFADetailsInfo.supervisingProviderId != null) {
                var sdoc = $filter('filter')($scope.allUserList, { DoctorID: HCFADetailsInfo.supervisingProviderId }, true)[0] || {};
                HCFADetailsInfo.TaxonomyCode = angular.copy(sdoc.TaxonomyCode) || '';
            } else if (HCFADetailsInfo.OrderingProviderId != null) {
                var odoc = $filter('filter')($scope.allUserList, { DoctorID: HCFADetailsInfo.OrderingProviderId }, true)[0] || {};
                HCFADetailsInfo.TaxonomyCode = angular.copy(odoc.TaxonomyCode) || '';
            } else if (HCFADetailsInfo.referringProviderId != null) {
                HCFADetailsInfo.TaxonomyCode = angular.copy(respData.ReferringTaxonomyCode) || '';
            }

            if (HCFADetailsInfo.OrderingProviderId != null) {
                var oname = $filter('filter')($scope.allUserList, { DoctorID: HCFADetailsInfo.OrderingProviderId }, true)[0] || {};
                HCFADetailsInfo.OrderingProviderName = angular.copy(oname.FullName + ' ' + oname.SuffixName);
            }
            if (HCFADetailsInfo.supervisingProviderId != null) {
                var sname = $filter('filter')($scope.allUserList, { DoctorID: HCFADetailsInfo.supervisingProviderId }, true)[0] || {};
                HCFADetailsInfo.supervisingProviderName = angular.copy(sname.FullName + ' ' + sname.SuffixName);
            }

            // ── Resolve suffix / provider name ───────────────────────────
            var hasSupervising = HCFADetailsInfo.supervisingProviderId != null;
            var hasOrdering = HCFADetailsInfo.OrderingProviderId != null;
            var hasReferring = HCFADetailsInfo.ReferringProviderId != null;

            if (hasSupervising && hasOrdering && hasReferring) {
                HCFADetailsInfo.Suffix = 'DQ';
                HCFADetailsInfo.PROVIDERName = HCFADetailsInfo.supervisingProviderName || '';
            } else if (!hasSupervising && hasOrdering && hasReferring) {
                HCFADetailsInfo.Suffix = 'DK';
                HCFADetailsInfo.PROVIDERName = HCFADetailsInfo.OrderingProviderName || '';
            } else if (hasReferring) {
                HCFADetailsInfo.Suffix = 'DN';
                HCFADetailsInfo.PROVIDERName = HCFADetailsInfo.ReferringProvider || '';
            } else {
                HCFADetailsInfo.Suffix = '';
                HCFADetailsInfo.PROVIDERName = '';
            }

            // ── Resolve stateadress / AmountPaid ─────────────────────────
            HCFADetailsInfo.stateadress = HCFADetailsInfo.PostalCityName
                ? HCFADetailsInfo.PostalCityName + ', ' + HCFADetailsInfo.PostalStateCode
                : HCFADetailsInfo.PostalStateCode;

            var charges1 = Math.floor(HCFADetailsInfo.TotalInsandPatPaidAmt) || 0;
            var decimalPayment = Math.round((HCFADetailsInfo.TotalInsandPatPaidAmt - charges1) * 100);
            if (decimalPayment == 0) decimalPayment = '00';
            HCFADetailsInfo.AmountPaid = parseFloat(charges1 + '.' + decimalPayment);

            // ── Resolve payor type flags ──────────────────────────────────
            if (HCFADetailsInfo.InsuranceDetails.PayorTypeId === 9 ||
                HCFADetailsInfo.InsuranceDetails.PayorTypeId === 12 ||
                HCFADetailsInfo.InsuranceDetails.PayorTypeId === 31) {
                HCFADetailsInfo.IsMedicare = true;
            } else if (HCFADetailsInfo.PatientDetails.InsuranceTypeCode == 'MC') {
                HCFADetailsInfo.IsMedicaid = true;
            } else if (HCFADetailsInfo.PatientDetails.InsuranceTypeCode == 'CH') {
                HCFADetailsInfo.IsTricare = true;
            } else if (HCFADetailsInfo.PatientDetails.InsuranceTypeCode == 'VA') {
                HCFADetailsInfo.IsChampva = true;
            } else {
                HCFADetailsInfo.IsOther = true;
            }

            if (HCFADetailsInfo.printtype == undefined) {
                HCFADetailsInfo.printtype = 'withTemplate';
            }

            return HCFADetailsInfo; // ✅ MUST return
        }

        function buildUBDetailsInfo(respData, item) {
            var UBDetailsInfo = eHnoteCacheStorageService.GetUBStorageStructure();
            var currentdate = $filter('date')(new Date(), 'MM-dd-yyyy');

            // ── Init UB storage structure ────────────────────────────
            UBDetailsInfo.Patient = angular.copy(respData);
            UBDetailsInfo.Patient.FirstName = respData.FirstName;
            UBDetailsInfo.Patient.LastName = respData.Lastname;
            UBDetailsInfo.Patient.PatientID = respData.PatientId;
            UBDetailsInfo.MedicalRecordNumber = respData.PatientDisplayId;

            UBDetailsInfo.PreAuthorizationNumber =
                respData.PrimaryInsuranceAuthorizationNumber &&
                    respData.PrimaryInsuranceAuthorizationNumber.trim() !== ''
                    ? respData.PrimaryInsuranceAuthorizationNumber
                    : (respData.SecondaryInsuranceAuthorizationNumber &&
                        respData.SecondaryInsuranceAuthorizationNumber.trim() !== ''
                        ? respData.SecondaryInsuranceAuthorizationNumber
                        : '');

            // ── Patient address ──────────────────────────────────────
            if (respData.Patient.length > 0) {
                var patientresp = respData.Patient[0];
                UBDetailsInfo.Patient.PatientID = respData.PatientId;
                UBDetailsInfo.MedicalRecordNumber = respData.PatientDisplayId;
                UBDetailsInfo.Patient.Address1 = patientresp.PostalAddress.AddressLine1 || '';
                UBDetailsInfo.Patient.Address2 = patientresp.PostalAddress.AddressLine2 || '';
                UBDetailsInfo.Patient.CityName = patientresp.PostalAddress.CityName;
                UBDetailsInfo.Patient.StateName = patientresp.PostalAddress.StateName;
                UBDetailsInfo.Patient.StateCode = patientresp.PostalAddress.StateCode;
                UBDetailsInfo.Patient.CountryName = patientresp.PostalAddress.CountryName;
                UBDetailsInfo.Patient.ZipCode = patientresp.PostalAddress.ZipCode;
                UBDetailsInfo.Patient.MiddleName = patientresp.MiddleName || '';
            }

            // ── Billing provider ─────────────────────────────────────
            UBDetailsInfo.BillingProvider = respData.BillingProviderNPI;
            UBDetailsInfo.BillingProviderobj.ProviderName = respData.BillingProviderName;
            UBDetailsInfo.FederalTaxNumber = respData.BillingProviderTaxId;
            UBDetailsInfo.BillingProviderobj.Address1 = respData.PostalAddress1 || '';
            UBDetailsInfo.BillingProviderobj.Address2 = respData.PostalAddress2 || '';

            var filteredList = $filter('filter')(
                $scope.OrganizationBillingProviderList,
                { OrganizationBillingProviderId: respData.BillingProviderId }, true
            ) || [];

            if (filteredList.length > 0) {
                var bl = filteredList[0];
                UBDetailsInfo.BillingProviderobj.PostalAddress1 = bl.Box33Address1;
                UBDetailsInfo.BillingProviderobj.PostalAddress2 = bl.Box33Address2;
                UBDetailsInfo.BillingProviderobj.PhysicalZipCode = bl.Box33ZipCode || '';
                UBDetailsInfo.BillingProviderobj.PhysicalCityName = bl.Box33CityName || '';
                UBDetailsInfo.BillingProviderobj.PhysicalStateName = bl.Box33StateName || '';
                UBDetailsInfo.BillingProviderobj.PhysicalStateCode = bl.Box33StateCode || '';
            }

            UBDetailsInfo.BillingProviderobj.AdmissionDate = $filter('date')(respData.AdmissionDate, 'M/d/yyyy') || currentdate;
            UBDetailsInfo.BillingProviderobj.City = respData.PostalCityName;
            UBDetailsInfo.BillingProviderobj.State = respData.PostalStateName;
            UBDetailsInfo.BillingProviderobj.StateCode = respData.PostalStateCode;
            UBDetailsInfo.BillingProviderobj.ZipCode = respData.PostalZipCode;
            UBDetailsInfo.CodeFieldObj[0].billingprovidertaxonomy1 = respData.BillingProviderTaxonomyId;
            UBDetailsInfo.TypeOfBill = respData.BillPaymentType;

            // ── Service location ─────────────────────────────────────
            if ($scope.isIojOrgEnable) {
                UBDetailsInfo.ServiceLocationInformation.ProviderName = respData.ServiceFacilityName || '';
                UBDetailsInfo.ServiceLocationInformation.Address1 = respData.ServiceFacilityAddress1 || '';
                UBDetailsInfo.ServiceLocationInformation.Address2 = respData.ServiceFacilityAddress2 || '';
                UBDetailsInfo.ServiceLocationInformation.City = respData.ServiceFacilityCityName || '';
                UBDetailsInfo.ServiceLocationInformation.State = respData.ServiceFacilityStateName || '';
                UBDetailsInfo.ServiceLocationInformation.StateCode = respData.ServiceFacilityStateCode || '';
                UBDetailsInfo.ServiceLocationInformation.ZipCode = respData.ServiceFacilityZipCode || '';
            } else {
                UBDetailsInfo.ServiceLocationInformation.ProviderName = respData.FacilityName || '';
                UBDetailsInfo.ServiceLocationInformation.Address1 = respData.FacilityAddress1 || '';
                UBDetailsInfo.ServiceLocationInformation.Address2 = respData.FacilityAddress2 || '';
                UBDetailsInfo.ServiceLocationInformation.City = respData.FacilityCityName || '';
                UBDetailsInfo.ServiceLocationInformation.State = respData.FacilityStateName || '';
                UBDetailsInfo.ServiceLocationInformation.StateCode = respData.FacilityStateCode || '';
                UBDetailsInfo.ServiceLocationInformation.ZipCode = respData.FacilityZipCode || '';
            }

            // ── Insurance details loop ───────────────────────────────
            angular.forEach(UBDetailsInfo.InsuranceDetails, function (mitem) {
                if (respData.AppointmentInsuranceDetails.length > 0) {
                    angular.forEach(respData.AppointmentInsuranceDetails, function (aitem) {
                        if (mitem.IdentifierId === aitem.IdentifierId) {
                            mitem.AssignmentofBenefits = aitem.AssignBenifits || 'No';
                            mitem.DocumentControlNumber = aitem.PatientInsuranceControlNumber || '';
                            mitem.InsuranceGroupNumber = aitem.GroupId || '';
                            mitem.InsuredsGroupName = aitem.GroupName || '';
                            mitem.InsuredsName = aitem.InsuredPersonLastName + ' ' + aitem.InsuredPersonFirstName + ' ' + aitem.InsuredPersonMiddleName || '';
                            mitem.InsuredsUniqueIdentifier = aitem.PolicyId || '';
                            mitem.OrganizationPayorName = aitem.OrganizationPayorName || '';
                            mitem.PayerClaimControlNumber = aitem.PayerClaimControlNumber || '';
                            mitem.OrganizationPlanId = aitem.PlanId || '';
                            mitem.OrganizationPlanName = aitem.PlanName || '';
                            mitem.PriorPayments = respData.TotalBalance || '';
                            mitem.OtherBillingProviderIdentifier = '';
                            mitem.PatientRelationship = aitem.RelationCode || '';
                            mitem.PayorId = aitem.GlobalPayorId || '';
                            mitem.PayorName = aitem.PayorName || '';
                            mitem.PayorAddress1 = aitem.PayorAddress1 || '';
                            mitem.PayorAddress2 = aitem.PayorAddress2 || '';
                            mitem.ReleaseInfo = '';
                            mitem.TreatmentAuthorizationCodes = '';
                            mitem.EmployerName = '';
                            mitem.EstimatedAmountDue = aitem.DoctorName;
                            mitem.Box78Type = aitem.Box78Type || '';
                            mitem.Box78TypeId = aitem.Box78TypeId || '';
                            mitem.Box79Type = aitem.Box79Type || '';
                            mitem.Box79TypeId = aitem.Box79TypeId || '';
                            UBDetailsInfo.Appointment.AppointmentTime = aitem.AppointmentTime
                                ? new Date(new Date().toDateString() + ' ' + aitem.AppointmentTime)
                                : null;
                        }
                    });
                }
            });

            // ── CurrentResponsibilityId based insurance block ────────
            function applyInsuranceByIdx(idx) {
                var ai = respData.AppointmentInsuranceDetails[idx];
                var ins = UBDetailsInfo.InsuranceDetails[idx];

                UBDetailsInfo.PayorName = ai.PayorName || '';
                UBDetailsInfo.PayorAddress1 = ai.PayorAddress1 || '';
                UBDetailsInfo.PayorAddress2 = ai.PayorAddress2 || '';
                UBDetailsInfo.PayorCityName = ai.PayorCityName || '';
                UBDetailsInfo.PayorStateName = ai.PayorStateName || '';
                UBDetailsInfo.PayorStateCode = ai.PayorStateCode || '';
                UBDetailsInfo.PayorZipCode = ai.PayorZipCode || '';

                UBDetailsInfo.InsuranceDetails.InsuredsName = ins.InsuredsName || '';
                UBDetailsInfo.IInsuredsName = ins.InsuredsName || '';
                UBDetailsInfo.InsuranceDetails.PatientRelationship = ins.PatientRelationship || '';
                UBDetailsInfo.IPatientRelationship = ins.PatientRelationship || '';
                UBDetailsInfo.InsuranceDetails.InsuredsUniqueIdentifier = ins.InsuredsUniqueIdentifier || '';
                UBDetailsInfo.IInsuredsUniqueIdentifier = ins.InsuredsUniqueIdentifier || '';
                UBDetailsInfo.InsuredsUniqueIdentifier = ins.InsuredsUniqueIdentifier || '';
                UBDetailsInfo.InsuranceDetails.InsuredsGroupName = ins.InsuredsGroupName || '';
                UBDetailsInfo.IInsuredsGroupName = ins.InsuredsGroupName || '';
                UBDetailsInfo.InsuranceDetails.InsuranceGroupNumber = ins.InsuranceGroupNumber || '';
                UBDetailsInfo.IInsuranceGroupNumber = ins.InsuranceGroupNumber || '';
                UBDetailsInfo.InsuranceDetails.AssignmentofBenefits = ins.AssignmentofBenefits || '';
                UBDetailsInfo.InsuranceDetails.DocumentControlNumber = ins.DocumentControlNumber || '';
                UBDetailsInfo.InsuranceDetails.OrganizationPayorName = ins.OrganizationPayorName || '';
                UBDetailsInfo.IOrganizationPayorName = ins.OrganizationPayorName || '';
                UBDetailsInfo.InsuranceDetails.OrganizationPlanId = ins.OrganizationPlanId || '';
                UBDetailsInfo.InsuranceDetails.OrganizationPlanName = ins.OrganizationPlanName || '';
                UBDetailsInfo.InsuranceDetails.PatientRelationship = ins.PatientRelationship || '';
                UBDetailsInfo.InsuranceDetails.PayorId = ins.PayorId || '';
                UBDetailsInfo.IPayorId = ins.PayorId || '';
                UBDetailsInfo.InsuranceDetails.EstimatedAmountDue = ins.EstimatedAmountDue || '';
                UBDetailsInfo.InsuranceDetails.TreatmentAuthorizationCodes = ins.TreatmentAuthorizationCodes || '';
                UBDetailsInfo.InsuranceDetails.EmployerName = ins.EmployerName || '';
                UBDetailsInfo.IEmployerName = ins.EmployerName || '';
                UBDetailsInfo.InsuranceDetails.PayerClaimNumber = ins.PayerClaimNumber || '';
                UBDetailsInfo.IPayerClaimNumber = ins.PayerClaimNumber || '';

                UBDetailsInfo.Box4Value2 = ai.Box4Value2 || '';
                UBDetailsInfo.Box4ValueId2 = ai.Box4ValueId2 || '';
                UBDetailsInfo.Box4Value3 = ai.Box4Value3 || '';
                UBDetailsInfo.Box4ValueId3 = ai.Box4ValueId3 || '';
                UBDetailsInfo.Box4Value4 = ai.Box4Value4 || '';
                UBDetailsInfo.Box4ValueId4 = ai.Box4ValueId4 || '';

                UBDetailsInfo.Box14ValueId = ai.Box14ValueId || '';
                UBDetailsInfo.Box14Value = ai.Box14Value || '';
                UBDetailsInfo.Box14ValueCode = ai.Box14ValueCode || '';
                UBDetailsInfo.Box15ValueId = ai.Box15ValueId || '';
                UBDetailsInfo.Box15Value = ai.Box15Value || '';
                UBDetailsInfo.Box15ValueCode = ai.Box15ValueCode || '';

                UBDetailsInfo.Box79Type = ai.Box79Type || '';
                UBDetailsInfo.Box79TypeId = ai.Box79TypeId || '';
                UBDetailsInfo.Box79Value = ai.Box79Value || '';
                UBDetailsInfo.Box79ValueId = ai.Box79ValueId || '';
                UBDetailsInfo.Box79ValueNPI = ai.Box79ValueNPI || '';
                UBDetailsInfo.IsBox80Checked = ai.IsBox80Checked || '';
                UBDetailsInfo.Box80Value = ai.Box80Value || '';

                if (UBDetailsInfo.Box79TypeId == 3) {
                    UBDetailsInfo.FacilityName = respData.FacilityName || '';
                    UBDetailsInfo.FacilityNPI = respData.FacilityNPI || '';
                }

                UBDetailsInfo.TotalPatientPayment = respData.TotalPatientPayment || 0;
                UBDetailsInfo.TotalPatientBalance = respData.TotalPatientBalance || 0;

                if (idx === 0) {
                    var UBtotalpatbalInteger = Math.floor(UBDetailsInfo.TotalPatientPayment);
                    var UBtotalpatbalDecimal = Math.round((UBDetailsInfo.TotalPatientPayment - UBtotalpatbalInteger) * 100);
                    UBDetailsInfo.UBtotalpatbalInteger = UBtotalpatbalInteger;
                    UBDetailsInfo.UBtotalpatbalDecimal = UBtotalpatbalDecimal == 0 ? '00' : UBtotalpatbalDecimal;
                }
            }

            var respIdx = respData.CurrentResponsibilityId == 2 ? 0
                : respData.CurrentResponsibilityId == 3 ? 1 : 2;
            if (!respData.AppointmentInsuranceDetails[respIdx]) respIdx = 0;
            applyInsuranceByIdx(respIdx);

            if (respData.CurrentResponsibilityId == 3) {
                UBDetailsInfo.IOrganizationPayorName = UBDetailsInfo.InsuranceDetails[0].OrganizationPayorName || '';
            }

            // ── TransmitQueue filter override ───────────────────────
            var filtredArray = $filter('filter')(
                respData.AppointmentInsuranceDetails,
                { PatientInsuranceDetailId: respData.TransmitQueuePatientInsuranceId }, true
            ) || [];

            if (filtredArray.length > 0) {
                var fa = filtredArray[0];

                if (fa.Box79TypeId == '1') {
                    var fp79 = $filter('filter')($scope.ClaimProviderList,
                        { OrganizationBillingProviderId: respData.BillingProviderId }, true)[0] || {};
                    UBDetailsInfo.Box79FirstName = fp79.BillingProviderName || '';
                    UBDetailsInfo.Box79ValueNPI = fp79.Box33GroupNPI || '';
                    UBDetailsInfo.Box79LastName = '';
                } else if (fa.Box79TypeId == '2') {
                    var fd79 = $filter('filter')($scope.allUserList,
                        { DoctorID: respData.RenderingProviderId }, true) || [];
                    if (fd79.length > 0) {
                        UBDetailsInfo.Box79FirstName = fd79[0].FirstName || '';
                        UBDetailsInfo.Box79LastName = fd79[0].LastName || '';
                        UBDetailsInfo.Box79ValueNPI = fd79[0].NPI || '';
                    }
                } else if (fa.Box79TypeId == '3') {
                    UBDetailsInfo.Box79FirstName = respData.FacilityName || '';
                    UBDetailsInfo.Box79ValueNPI = respData.FacilityNPI || '';
                } else {
                    UBDetailsInfo.Box79FirstName = '';
                    UBDetailsInfo.Box79LastName = '';
                    UBDetailsInfo.Box79ValueNPI = '';
                }

                if (fa.Box78TypeId == '1') {
                    var fp78 = $filter('filter')($scope.ClaimProviderList,
                        { OrganizationBillingProviderId: respData.BillingProviderId }, true)[0] || {};
                    UBDetailsInfo.Box78FirstName = fp78.BillingProviderName || '';
                    UBDetailsInfo.Box78LastName = '';
                    UBDetailsInfo.Box78ValueNPI = fp78.Box33GroupNPI || '';
                } else if (fa.Box78TypeId == '2') {
                    UBDetailsInfo.Box78FirstName = respData.ReferringProviderFirstName || '';
                    UBDetailsInfo.Box78LastName = respData.ReferringProviderLastName || '';
                    UBDetailsInfo.Box78ValueNPI = respData.ReferringProviderNPI || '';
                } else if (fa.Box78TypeId == '3') {
                    UBDetailsInfo.Box78FirstName = respData.FacilityName || '';
                    UBDetailsInfo.Box78ValueNPI = respData.FacilityNPI || '';
                } else {
                    UBDetailsInfo.Box78FirstName = '';
                    UBDetailsInfo.Box78LastName = '';
                    UBDetailsInfo.Box78ValueNPI = '';
                }
            }

            // ── Appointment / patient control ───────────────────────
          //  UBDetailsInfo.Appointment.AdmissionDate = respData.AppointmentDate;
            UBDetailsInfo.Appointment.AdmissionDate = respData.AdmissionDate;
            UBDetailsInfo.Appointment.AppointmentType = respData.AdmissionType;
            UBDetailsInfo.Appointment.AppointmentSource = respData.SourceOfAdmission;
            UBDetailsInfo.PatientControlNumber = respData.PatientClaimNumber;
            UBDetailsInfo.CurrentResponsibilityId = respData.CurrentResponsibilityId;

            if ($scope.isIojOrgEnable) {
                if (UBDetailsInfo.CurrentResponsibilityId == 2) {
                    UBDetailsInfo.PatientControlNumber += 'P';
                } else if (UBDetailsInfo.CurrentResponsibilityId == 3) {
                    UBDetailsInfo.PatientControlNumber += 'S';
                }
            }

            // ── Attending / Operating provider ──────────────────────
            var fRenderingobj = $filter('filter')($scope.allUserList, { DoctorID: respData.VisitProviderId }, true) || [];
            if (fRenderingobj.length > 0) {
                var rp = fRenderingobj[0];
                UBDetailsInfo.AttendingProviderObj.FirstName = rp.FirstName || '';
                UBDetailsInfo.AttendingProviderObj.LastName = rp.LastName || '';
                UBDetailsInfo.AttendingProviderObj.NPI = rp.NPI || '';
                UBDetailsInfo.AttendingProviderObj.UPIN = rp.UPIN !== '' ? rp.UPIN || '' : '0000000000';
                UBDetailsInfo.OperatingProviderObj.FirstName = rp.FirstName || '';
                UBDetailsInfo.OperatingProviderObj.LastName = rp.LastName || '';
                UBDetailsInfo.OperatingProviderObj.NPI = rp.NPI || '';
            }

            // ── Revenue / line items ─────────────────────────────────
            UBDetailsInfo.Box80RemarkValue1 = '';
            UBDetailsInfo.Box80RemarkValue2 = '';
            UBDetailsInfo.Box80RemarkValue3 = '';
            var remarkIndex = 1;

            if (respData.PatientClaimLineItems.length > 0) {
                angular.forEach(UBDetailsInfo.RevenueList, function (oitem) {
                    angular.forEach(respData.PatientClaimLineItems, function (ditem, index) {
                        var amount = Number(ditem.TotalChargeAmount).toFixed(2).split('.');
                        var TotalChargeIntegerNumber = amount[0];
                        var TotalChargeDecimalNumber = amount[1] == '0' ? '00' : amount[1];
                        if (index === oitem.Sno) {
                            oitem.Modifier1 = ditem.Modifier1 || '';
                            oitem.Modifier2 = ditem.Modifier2 || '';
                            oitem.Modifier3 = ditem.Modifier3 || '';
                            oitem.Modifier4 = ditem.Modifier4 || '';
                            oitem.Code = ditem.ServiceCode + ' ' + ditem.Modifier1 + ' ' + ditem.Modifier2 + ' ' + ditem.Modifier3 + ' ' + ditem.Modifier4 || '';
                            oitem.Date = $filter('date')(ditem.DOSfrom, 'yyyy-MM-dd');
                            oitem.RevenueCode = ditem.RevenueBillingCode || '';
                            oitem.RevenueCodeDescription = ditem.ServiceName;
                            oitem.Rate = ditem.UnitCharge;
                            oitem.ServiceDate = $filter('date')(ditem.DOSfrom, 'yyyy-MM-dd');
                            oitem.ServiceUnits = ditem.Quantity;
                            oitem.TotalCharges = ditem.TotalChargeAmount;
                            oitem.TotalChargeIntegerNumber = TotalChargeIntegerNumber;
                            oitem.TotalChargeDecimalNumber = TotalChargeDecimalNumber;
                            oitem.DrugProductID = ditem.MedicineId || null;
                            oitem.NationalDrugCode = ditem.DrugNDCID || '';
                            oitem.DrugUnit = ditem.MedicineStrength || '';
                            oitem.DrugUom = ditem.UnitName || '';
                            oitem.DrugLinkSeqNumber = '';
                            oitem.DrugPharmacyPresNumber = '';
                            index++;
                        }
                    });
                });

                angular.forEach(respData.PatientClaimLineItems, function (ditem) {
                    if (remarkIndex > 3) return;
                    if (ditem.Notes && ditem.Notes.trim() !== '') {
                        var formattedNote = '(' + ditem.RevenueBillingCode + ') - ' + ditem.Notes;
                        if (remarkIndex === 1) UBDetailsInfo.Box80RemarkValue1 = formattedNote;
                        else if (remarkIndex === 2) UBDetailsInfo.Box80RemarkValue2 = formattedNote;
                        else if (remarkIndex === 3) UBDetailsInfo.Box80RemarkValue3 = formattedNote;
                        remarkIndex++;
                    }
                });

                UBDetailsInfo.TotalBalance = respData.TotalBalance || 0;
                var UBIntegerBalanceNo = Math.floor(UBDetailsInfo.TotalBalance);
                var UBDecimalBalanceNo = Math.round((UBDetailsInfo.TotalBalance - UBIntegerBalanceNo) * 100);
                UBDetailsInfo.UBIntegerBalanceNo = UBIntegerBalanceNo;
                UBDetailsInfo.UBDecimalBalanceNo = UBDecimalBalanceNo == 0 ? '00' : UBDecimalBalanceNo;

                UBDetailsInfo.TotalClaimAmount = respData.TotalClaimAmount || 0;
                var UBIntegerNumber = Math.floor(UBDetailsInfo.TotalClaimAmount);
                var UBDecimalNumber = Math.round((UBDetailsInfo.TotalClaimAmount - UBIntegerNumber) * 100);
                UBDetailsInfo.UBIntegerNumber = UBIntegerNumber;
                UBDetailsInfo.UBDecimalNumber = UBDecimalNumber == 0 ? '00' : UBDecimalNumber;

                UBDetailsInfo.CreateDate = respData.SecondaryInsuranceDateOfSubmission != null
                    ? respData.SecondaryInsuranceDateOfSubmission
                    : respData.PrimaryInsuranceDateOfSubmission || null;

                UBDetailsInfo.PrincipalProcedure.Code = respData.PatientClaimLineItems[0].ServiceCode || '';
                UBDetailsInfo.PrincipalProcedure.Date = $filter('date')(respData.PatientClaimLineItems[0].DOSfrom, 'yyyy-MM-dd');
            }

            // ── Diagnosis codes ──────────────────────────────────────
            for (var i = 0; i < UBDetailsInfo.OtherDiagnosisandPOA_Firstrow.length; i++) {
                var drow = UBDetailsInfo.OtherDiagnosisandPOA_Firstrow[i];
                var icd = respData['ICD' + drow.Sno];
                if (icd) { drow.DiagnosisCode = icd; }
            }

            if (respData.PatientClaimLineItems.length > 0) {
                angular.forEach(UBDetailsInfo.OtherDiagnosisandPOA_Firstrow, function (oitem) {
                    angular.forEach(respData.PatientClaimLineItems, function (yitem) {
                        angular.forEach(yitem.DiagnosisList, function (ditem) {
                            if (ditem.Type === oitem.DiagnosisLetter && ditem.DiagnosisId != 0) {
                                oitem.DiagnosisCode = ditem.ICDCode || '';
                                oitem.PresentonAdmission = 'Y';
                            }
                            if (ditem.Type === 'A' && ditem.DiagnosisId != 0) {
                                UBDetailsInfo.PrincipleDiagnosisandPOA.DiagnosisCode = ditem.ICDCode || '';
                                UBDetailsInfo.PrincipleDiagnosisandPOA.PresentonAdmission = 'Y';
                                UBDetailsInfo.AdmittingDiagnosisCode = ditem.ICDCode || '';
                                UBDetailsInfo.PatientsReasonforVisitObj.Reason1 = ditem.ICDCode || '';
                                UBDetailsInfo.ExternalCauseofInjuryObj[0].Code = ditem.ICDCode || '';
                                UBDetailsInfo.ExternalCauseofInjuryObj[0].PresentonAdmission = 'Y';
                            } else if (ditem.Type === 'B' && ditem.DiagnosisId != 0) {
                                UBDetailsInfo.PatientsReasonforVisitObj.Reason2 = ditem.ICDCode || '';
                                UBDetailsInfo.ExternalCauseofInjuryObj[1].Code = ditem.ICDCode || '';
                                UBDetailsInfo.ExternalCauseofInjuryObj[1].PresentonAdmission = 'Y';
                            } else if (ditem.Type === 'C' && ditem.DiagnosisId != 0) {
                                UBDetailsInfo.PatientsReasonforVisitObj.Reason3 = ditem.ICDCode || '';
                                UBDetailsInfo.ExternalCauseofInjuryObj[2].Code = ditem.ICDCode || '';
                                UBDetailsInfo.ExternalCauseofInjuryObj[2].PresentonAdmission = 'Y';
                            }
                        });
                    });
                });
            }

            // ── Pad Occurrence / OccurrenceSpan / ValueCode arrays ──
            UBDetailsInfo.Occurrence = UBDetailsInfo.Occurrence || [];
            for (var i = UBDetailsInfo.Occurrence.length; i <= 3; i++) {
                UBDetailsInfo.Occurrence.push({ aCodes: '', aDate: '', bCodes: '', bDate: '' });
            }
            UBDetailsInfo.OccurrenceSpan = UBDetailsInfo.OccurrenceSpan || [];
            for (var i = UBDetailsInfo.OccurrenceSpan.length; i <= 1; i++) {
                UBDetailsInfo.OccurrenceSpan.push({ aCodes: '', aFromDates: '', aThroughDates: '', bCodes: '', bFromDates: '', bThroughDates: '' });
            }
            UBDetailsInfo.ValueCode = UBDetailsInfo.ValueCode || [];
            for (var i = UBDetailsInfo.ValueCode.length; i <= 3; i++) {
                UBDetailsInfo.ValueCode.push({ Sno: i + 1, aCode: '', aAmount: '', bCode: '', bAmount: '', cCode: '', cAmount: '', dCode: '', dAmount: '' });
            }

            // ── Final fields ─────────────────────────────────────────
            UBDetailsInfo.TotalChargeAmount = UBDetailsInfo.TotalClaimAmount;
            UBDetailsInfo.printtype = 'withTemplate';

            return UBDetailsInfo; // ✅ MUST return
        }



        $scope.PrintAllAcknowledgments = function (type) {

            $scope.AcknowledgmentCLaimList = [];

            var printDate = $filter("date")(new Date(), "MMM-dd-yyyy");
            var printTime = moment(new Date()).format("HH:mm");
            $scope.AckPrintedDatenTime = printDate + ',  ' + printTime;

            var TempAddress = $filter("filter")($scope.ClaimLocationList, function (iterator, ind) { return iterator.ClinicId !== 0 && iterator.IsChecked; });
            var HospitalIDs = _.pluck(TempAddress, "BranchId").join(",");
            if ($scope.SearchClaimListObj.AllPayorList.length > 0) {
                var PayorIds = $scope.SearchClaimListObj.AllPayorList
                    .map(pitem => pitem.PayorId)
                    .join(",");
            }
            var params = {
                "OrganizationId": $scope.SearchClaimListObj.OrganizationId,
                "OrganizationFacilityId": $scope.SearchClaimListObj.OrganizationFacilityId || 0,
                "FromDate": $filter('date')($scope.SearchClaimListObj.FromDate, 'MM-dd-yyyy') || "",
                "ToDate": $filter('date')($scope.SearchClaimListObj.ToDate, 'MM-dd-yyyy') || "",
                "PatientId": $scope.SearchClaimListObj.PatientId || 0,
                "SearchText": $scope.SearchClaimListObj.SearchText || "",
                "PatientMRNo": $scope.SearchClaimListObj.PatientMRNo || "",
                "PatienClaimNumber": (type == "Claims") ? $scope.SearchClaimListObj.ClaimNumber : $scope.SearchClaimListObj.PatienClaimNumber || "",
                "BatchNumber": $scope.SearchClaimListObj.BatchNumber || "",
                "BillingProviderId": $scope.SearchClaimListObj.BillingProviderId || 0,
                "RenderingProviderId": $scope.SearchClaimListObj.RenderingProviderId || 0,
                "TransmissionTypeId": $scope.SearchClaimListObj.TransmissionMethodId || 0,
                "ClaimTypeId": $scope.SearchClaimListObj.ClaimTypeId || 0,
                "PayorId": $scope.SearchClaimListObj.PayorId || 0,
                "PayorIds": PayorIds || "",
                "ClaimStatusList": $scope.selectedClaimStatusIds || '',
                "PageSize": 100,
                "PageNumber": $scope.SearchClaimListObj.PageNumber,
                "Type": type,
                "BillPaymentTypeId": $scope.SearchClaimListObj.BillPaymentTypeId,
                "CurrentResponsibilityId": $scope.SearchClaimListObj.CurrentResponsibilityId || 0,
                "IsReadytosubmit": $scope.SearchClaimListObj.IsReadytosubmit || false,
                "DenialId": $scope.SearchClaimListObj.DenialId || 0,
                "FacilityListIds": '',
                "Locationids": HospitalIDs,
                "TransmissionFromDate": $scope.SearchClaimListObj.TransmissionFromDate,
                "TransmissionToDate": $scope.SearchClaimListObj.TransmissionToDate,
                "DateType": $scope.SearchClaimListObj.DateType,
                "SortColumn": $scope.SearchClaimListObj.SortColumn,
                "SortOrder": $scope.SearchClaimListObj.SortOrder
            };


            eHnotePatientDataService.GetOrganizationClaimsList(params).then(function (resp) {
                console.log(resp);
                if (resp.data.status == 'Success') {
                    if (resp.data.rows.length > 0) {

                        var grouped = _.groupBy(resp.data.rows, function (claim) {
                            return claim.ClaimStatus + '||' + claim.RenderingProviderName;
                        });

                        $scope.AcknowledgmentCLaimList = Object.keys(grouped).map(function (key) {
                            var claims = grouped[key];
                            var parts = key.split('||');

                            var totalAmount = claims.reduce(function (sum, c) {
                                return sum + (c.TotalClaimAmount || 0);
                            }, 0);

                            var uniquePayors = _.uniq(_.pluck(claims, 'PayorId'));
                            var payorCount = uniquePayors.length;

                            return {
                                claimStatus: parts[0],
                                renderingProvider: parts[1],
                                claims: claims,
                                totalAmount: totalAmount,
                                payorCount: payorCount,
                                payorIds: uniquePayors,
                                ClaimStatusId: claims[0].ClaimStatusId
                            };
                        });

                        $timeout(function () {
                            var innerContents = document.getElementById('AcknowledgementPrintByClaimStatus').innerHTML;
                            var popupWinindow = window.open('scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                            popupWinindow.document.open();
                            popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()" class="bodyheightprint">' + innerContents + '</body></html>');
                            popupWinindow.document.close();
                        }, 1000);
                    }
                }
                if ($scope.activeClaimTab == 'ALL') {
                    $scope.selectedClaimStatusIds = '';
                }

            }, function (err) {
                alertify.error("Error loading report");
            });
        }
        $scope.changeDoctors = function (obj) {
            var checkedArray = _.where($scope.mainBillerDataObj.AllDoctorsList, { IsChecked: true });
            $scope.SearchClaimListObj.AllDoctorsCheck = checkedArray.length > 0 && $scope.mainBillerDataObj.AllDoctorsList.length === checkedArray.length ? true : false;

            if ($scope.SearchClaimListObj.AllDoctorsCheck) {
                $scope.SearchClaimListObj.AllDoctorsString = 'All';
                $scope.SearchClaimListObj.RenderingProviderId = checkedArray.map(function (doctor) {
                    return doctor.DoctorID;
                }).join(',');
            }
            if (!$scope.SearchClaimListObj.AllDoctorsCheck && checkedArray.length > 0) {
                $scope.SearchClaimListObj.AllDoctorsString = 'Selected';
                $scope.SearchClaimListObj.RenderingProviderId = checkedArray.map(function (doctor) {
                    return doctor.DoctorID;
                }).join(',');
            }
            if (!$scope.SearchClaimListObj.AllDoctorsCheck && checkedArray.length === 0) {
                $scope.SearchClaimListObj.AllDoctorsString = 'Select';
                $scope.SearchClaimListObj.RenderingProviderId = '';
            }
        };

        $scope.checkAllDoctors = function (val) {
            if (val) {
                angular.forEach($scope.mainBillerDataObj.AllDoctorsList, function (item) {
                    item.IsChecked = true;
                });
                $scope.SearchClaimListObj.AllDoctorsString = 'All';
            } else {
                angular.forEach($scope.mainBillerDataObj.AllDoctorsList, function (item) {
                    item.IsChecked = false;
                });
                $scope.SearchClaimListObj.AllDoctorsString = 'Selected';
            }
            $scope.changeDoctors();
        };
        $scope.claimRespToggle = function (obj) {
            var checkedArray = _.where($scope.ClaimDataList, { IsChecked: true });
            $scope.ClaimRespListObj.AllRespCheck = checkedArray.length > 0 && $scope.ClaimDataList.length === checkedArray.length ? true : false;

            if ($scope.ClaimRespListObj.AllRespCheck) {
                $scope.ClaimRespListObj.SelectRespString = 'All';
                $scope.SearchClaimListObj.BillPaymentTypeId = checkedArray.map(function (item) {
                    return item.BillPaymentTypeId;
                }).join(',');
            }
            if (!$scope.ClaimRespListObj.AllRespCheck && checkedArray.length > 0) {
                $scope.ClaimRespListObj.SelectRespString = 'Selected';
                $scope.SearchClaimListObj.BillPaymentTypeId = checkedArray.map(function (item) {
                    return item.BillPaymentTypeId;
                }).join(',');
                console.log($scope.SearchClaimListObj.BillPaymentTypeId);
            }
            if (!$scope.ClaimRespListObj.AllRespCheck && checkedArray.length === 0) {
                $scope.ClaimRespListObj.SelectRespString = 'Select';
                $scope.SearchClaimListObj.BillPaymentTypeId = '';
                console.log($scope.SearchClaimListObj.BillPaymentTypeId);
            }
        };

        $scope.checkAllClaimResp = function (val) {
            if (val) {
                angular.forEach($scope.ClaimDataList, function (item) {
                    item.IsChecked = true;
                });
                $scope.ClaimRespListObj.SelectRespString = 'All';
            } else {
                angular.forEach($scope.ClaimDataList, function (item) {
                    item.IsChecked = false;
                });
                $scope.ClaimRespListObj.SelectRespString = 'Selected';
            }
            $scope.claimRespToggle();
        };
        $scope.claimFormatToggle = function (obj) {
            var checkedArray = _.where($scope.ClaimFormatList, { IsChecked: true });
            $scope.ClaimFormatListObj.AllFormatCheck = checkedArray.length > 0 && $scope.ClaimFormatList.length === checkedArray.length ? true : false;

            if ($scope.ClaimFormatListObj.AllFormatCheck) {
                $scope.ClaimFormatListObj.SelectFormatString = 'All';
                $scope.SearchClaimListObj.TransmissionMethodId = checkedArray.map(function (item) {
                    return item.TransmissionMethodId;
                }).join(',');
            }
            if (!$scope.ClaimFormatListObj.AllFormatCheck && checkedArray.length > 0) {
                $scope.ClaimFormatListObj.SelectFormatString = 'Selected';
                $scope.SearchClaimListObj.TransmissionMethodId = checkedArray.map(function (item) {
                    return item.TransmissionMethodId;
                }).join(',');
                console.log($scope.SearchClaimListObj.TransmissionMethodId);
            }
            if (!$scope.ClaimFormatListObj.AllFormatCheck && checkedArray.length === 0) {
                $scope.ClaimFormatListObj.SelectFormatString = 'Select';
                $scope.SearchClaimListObj.TransmissionMethodId = '';
                console.log($scope.SearchClaimListObj.TransmissionMethodId);
            }
        };

        $scope.checkAllClaimFormat = function (val) {
            if (val) {
                angular.forEach($scope.ClaimFormatList, function (item) {
                    item.IsChecked = true;
                });
                $scope.ClaimFormatListObj.SelectFormatString = 'All';
            } else {
                angular.forEach($scope.ClaimFormatList, function (item) {
                    item.IsChecked = false;
                });
                $scope.ClaimFormatListObj.SelectFormatString = 'Selected';
            }
            $scope.claimFormatToggle();
        };

        var customOrder = [1, 3, 26, 27, 7, 16, 17, 19, 24];

        $scope.getCustomOrder = function (item) {
            return customOrder.indexOf(item.ClaimStatusId);
        };
        $scope.SearchDeleteClaimReqObj = {
            "FromDate": $filter('date')(new Date(), "MM-dd-yyyy"),
            "ToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
            "PageSize": 100,
            "PageNumber": 1,
            "Count": 0,
            "SortColumn": "DOS",
            "SortOrder": "DESC"
        }
        $scope.DeletedClaimsList = [];

        $scope.onDeletedClaimsPageChange = function (page) {
            $scope.DeleteClaimsHistoryList(page);
        };
        $scope.DeleteClaimsHistoryList = function (pageNo) {
            $scope.SearchDeleteClaimReqObj.PageNumber = pageNo || 1;
            var object = {
                "HospitalId": $scope.HospitalId,
                "FromDate": $scope.SearchDeleteClaimReqObj.FromDate,
                "ToDate": $scope.SearchDeleteClaimReqObj.ToDate,
                "PatientId": 0,
                "PageSize": $scope.SearchDeleteClaimReqObj.PageSize,
                "PageNumber": $scope.SearchDeleteClaimReqObj.PageNumber,
                "SortColumn": $scope.SearchDeleteClaimReqObj.SortColumn,
                "SortOrder": $scope.SearchDeleteClaimReqObj.SortOrder
            }
            eHnoteInsuranceService.DeletePatientClaimHistory(object).then(function (resp) {

                if (resp.data.status == "Success") {
                    $scope.DeletedClaimsList = resp.data.rows;
                    $scope.SearchDeleteClaimReqObj.Count = resp.data.count;
                }
            });
        }

        $scope.ResetDeletedClaims = function () {
            $scope.SearchDeleteClaimReqObj.SortColumn = 'DOS';
            $scope.SearchDeleteClaimReqObj.SortOrder = 'DESC';
            $scope.SearchDeleteClaimReqObj.FromDate = $filter('date')(new Date(), "MM-dd-yyyy"),
                $scope.SearchDeleteClaimReqObj.ToDate = $filter('date')(new Date(), "MM-dd-yyyy"),
                $scope.DeleteClaimsHistoryList();

        };

        $scope.openDenialCodeDescriptionPopup = function (item) {
            var totalWithDuplicates = item.ClaimDenials.length;
            var uniqueDenialCodes = item.ClaimDenials.filter(function (denial, index, self) {
                return index === self.findIndex(function (d) {
                    return d.DenialCode === denial.DenialCode;
                });
            });

            var modalInstance = $uibModal.open({
                templateUrl: "templates/uibpopups/denialCodesDescriptionPopup.html",
                windowClass: "modal__style--2",
                size: "md",
                backdrop: "static",
                keyboard: false,
                resolve: {
                    selectedItem: function () {
                        return {
                            PatientClaimNumber: item.PatientClaimNumber,
                            PatientFullName: item.PatientFullName,
                            PayorName: item.PayorName,
                            DOSFrom: item.DOSFrom,
                            ClaimDenials: uniqueDenialCodes,
                            uniqueCount: uniqueDenialCodes.length,
                            totalCount: totalWithDuplicates
                        };
                    }
                },
                controller: function ($scope, $uibModalInstance, selectedItem) {
                    $scope.item = selectedItem;
                    $scope.denialCodes = selectedItem.ClaimDenials;
                    $scope.uniqueCount = selectedItem.uniqueCount;
                    $scope.totalCount = selectedItem.totalCount;

                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                }
            });
        };

        $scope.setSort = function (Obj, column) {

            // Toggle sorting
            if (Obj.SortColumn === column) {
                Obj.SortOrder = (Obj.SortOrder === 'ASC') ? 'DESC' : 'ASC';
            } else {
                Obj.SortColumn = column;
                Obj.SortOrder = 'ASC';
            }

            let subTab = $scope.ClaimSubtabActive;

            // Common tabs (same API call)
            if (subTab == 1 || subTab == 14 || subTab == 11 || subTab == 15) {

                let Type = '';

                if (subTab == 1 || subTab == 14) {
                    Type = 'All';
                } else if (subTab == 11) {
                    Type = 'SecondaryTransmission';
                } else if (subTab == 15) {
                    Type = 'PrivateClaims';
                }
                $scope.SearchAllCountClaimDetails(Type, $scope.activeClaimTabStatusIds, $scope.SearchClaimListObj.PageNumber, "AckOtherstatus");
            }
            else if (subTab == 8) {
                $scope.SearchClaimFollowupslist();
            }
            else if (subTab == 5) {
                $scope.SearchRejectedFollowUps('Rejected');
            }
            else if (subTab == 10) {
                $scope.SearchAdjustmentReqslist($scope.SearchClaimAdjustReqObj.PageNumber);
            }
            else if (subTab == 16) {
                $scope.DeleteClaimsHistoryList($scope.SearchDeleteClaimReqObj.PageNumber);
            }
            else if (subTab == 4) {
                $scope.SearchDenailClaimDetails($scope.SearchClaimListObj.PageNumber, 'Denial', '', true);
            }
        };
        $scope.ManualStatusUpdateObj = {
            claim: null,
            selectedStatusObj: null,
            payorReceivedDate: null,
            notes: ''
        };

        // Datepicker popup control
        $scope.payorDatePopup = {
            opened: false
        };
        $scope.openManualStatusUpdatePopup = function (claim) {

            // Validate it's a paper claim (TransmissionTypeId = 2)
            if (claim.PatientClaimTransmission[0].TransmissionTypeId !== 2) {
                alertify.error("Manual status update is only available for paper claims");
                return;
            }

            // Check user permissions if needed
            //if (!$scope.UserAccessRights.AllAccessRights.BillerUpdateClaimStatus) {
            //    alertify.error("You don't have permission to update claim status");
            //    return;
            //}

            // Reset the update object
            $scope.ManualStatusUpdateObj = {
                claim: angular.copy(claim),
                selectedStatusObj: claim|| null,
                ClaimStatusId: claim.ClaimStatusId|| null,
                payorReceivedDate: claim.PayorReceivedDate ? $filter('date')(claim.PayorReceivedDate, 'MM-dd-yyyy') : null,
                notes: claim.Notes||''
            };
            //D: \USProject\UsWebapp\app\templates\UsClaims\manualClaimStatusUpdate.html
            // Open modal
            var modalInstance = $uibModal.open({
                "templateUrl": "templates/UsClaims/manualClaimStatusUpdate.html",
                "backdrop": "static",
                "scope": $scope,
                "size": "md",
                "resolve": {
                    "ManualStatusUpdateObj": function () { return $scope.ManualStatusUpdateObj; },
                },
                "windowClass": "modal__width--45",
                "keyboard": false,
                controller: function ($scope, $uibModal, $uibModalInstance, eHnoteInsuranceService, ManualStatusUpdateObj) {
                    $scope.ManualStatusUpdateObj.ClaimStatusId = ManualStatusUpdateObj.ClaimStatusId || 0;
                    /**
        * Handle status dropdown change
        */
                    $scope.onManualStatusChange = function (obj) {
                        // You can add validation logic here if needed
                        $scope.ManualStatusUpdateObj.ClaimStatusId = obj.ClaimStatusId || 0;
                        $scope.ManualStatusUpdateObj.selectedStatusObj.ClaimStatus = obj.ClaimStatusName || '';
                        console.log('Status changed to:', $scope.ManualStatusUpdateObj.selectedStatusObj);
                    };
                    $scope.saveManualStatusUpdate = function () {

                        // Validation
                        if (!$scope.ManualStatusUpdateObj.selectedStatusObj) {
                            alertify.error("Please select a status");
                            return;
                        }

                        //if (!$scope.ManualStatusUpdateObj.notes || $scope.ManualStatusUpdateObj.notes.trim() === '') {
                        //    alertify.error("Please provide notes for this status update");
                        //    return;
                        //}
                        if ($scope.ManualStatusUpdateObj.ClaimStatusId == ManualStatusUpdateObj.claim.ClaimStatusId && $scope.ManualStatusUpdateObj.notes == ManualStatusUpdateObj.claim.Notes) {
                            $scope.IsEventNotAdded = true;
                        } else {
                            $scope.IsEventNotAdded = false;
                        }
                       



                        // Prepare request object
                        var request = {
                            PatientClaimId: $scope.ManualStatusUpdateObj.claim.PatientClaimId,
                            NewStatusId: $scope.ManualStatusUpdateObj.ClaimStatusId,
                            NewStatusName: $scope.ManualStatusUpdateObj.selectedStatusObj.ClaimStatus,
                            PayorReceivedDate: $scope.ManualStatusUpdateObj.payorReceivedDate
                                ? $filter('date')($scope.ManualStatusUpdateObj.payorReceivedDate, "MM-dd-yyyy")
                                : null,
                            Notes: $scope.ManualStatusUpdateObj.notes,
                            UserId: $scope.UserId,
                            IsEventNotAdded: $scope.IsEventNotAdded
                        };

                        // Show loading
                        $scope.isUpdatingStatus = true;

                        // Call API
                        eHnoteInsuranceService.UpdatePaperClaimStatus(request).then(
                            function (response) {
                                $scope.isUpdatingStatus = false;

                                if (response.data.status === 'Success') {
                                    // Close modal with success flag
                                    $uibModalInstance.close('updated');
                                } else {
                                    alertify.error(response.data.message || "Error updating claim status");
                                }
                            },
                            function (error) {
                                $scope.isUpdatingStatus = false;
                                alertify.error("Error updating claim status. Please try again.");
                                console.error('Error updating claim status:', error);
                            }
                        );
                    };

                    /**
                     * Close modal
                     */
                    $scope.closeManualStatusUpdate = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                }
                });
            modalInstance.result.then(function (result) {
                if (result === 'updated') {
                    // Refresh the claim list
                    alertify.success("Claim status updated successfully");
                    $scope.SearchAllCountClaimDetails('PaperClaims', $scope.activeClaimTabStatusIds,
                        $scope.SearchClaimListObj.PageNumber, "AckOtherstatus","Close");
                }
            });
        };

        $scope.GetManualClaimAckprintData = function (Ackobj,citem,type) {
            var obj = {
                "OrganizationId": Ackobj.OrganizationId,
                "AckDate": $filter('date')(Ackobj.AckDate, 'MM-dd-yyyy') || "",
                "IsClaimsBased": true,
                "PatientClaimIds": citem.PatientClaimId.toString(),
                "AckId": Ackobj.AckId
            };
            return eHnoteInsuranceService.GetManualClaimAckData(obj)
                .then(function (resp) {
                    console.log(resp)
                    //$scope.TotalClaimsChargeAmount = 0;
                    $scope.ManualClaimAckData = resp.data.rows;
                    $scope.loadOrganizationLogo();
                    angular.forEach($scope.ManualClaimAckData, function (claim) {

                        claim.TotalClaimsChargeAmount = 0;
                        $scope.TotalSecondaryChargeAmount = 0;
                        $scope.TotalClaimsAckChargeAmount = 0;
                        angular.forEach(claim.ClaimsList, function (item) {
                            //claim.TotalClaimsChargeAmount += Number(item.TotalChargeAmount) || 0;
                            $scope.TotalClaimsAckChargeAmount += Number(item.TotalChargeAmount) || 0;
                            angular.forEach(item.Lineitems, function (litem) {
                                if (type == 'PrimaryInsAckprint') {
                                    claim.TotalClaimsChargeAmount += litem.PrimaryTotalChargeAmount;
                                } else if (type == 'SecondaryInsAckprint') {
                                    if (litem.SecondaryTotalChargeAmount != null) {
                                        claim.TotalClaimsChargeAmount += litem.SecondaryTotalChargeAmount || 0;
                                        $scope.TotalSecondaryChargeAmount += litem.SecondaryTotalChargeAmount || 0;
                                    } else {
                                        claim.TotalClaimsChargeAmount += litem.PrimaryTotalChargeAmount;
                                    }
                                   
                                }

                            })
                            //if ($scope.TotalSecondaryChargeAmount ==0) {
                            //    claim.TotalClaimsChargeAmount = $scope.TotalClaimsAckChargeAmount || 0;
                            //}
                        });

                    });
                    $scope.navprintPatientAck();
                    console.log($scope.ManualClaimAckData)

                });
        };

        $scope.navprintPatientAck = function () {

            return $timeout(function () {

                var printContents = document.getElementById('PaperAck_print').innerHTML;

                var popupWinindow = window.open('', '_blank');

                popupWinindow.document.open();
                popupWinindow.document.write(`
            <html>
                <head>
                    <link rel="stylesheet" type="text/css" href="css/billing.css" />
                </head>
                <body onload="window.print();">
                    ${printContents}
                </body>
            </html>
        `);

                popupWinindow.document.close();
            }, 1000);
        }


    }]);
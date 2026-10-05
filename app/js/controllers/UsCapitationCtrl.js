"use strict";
eHnoteWebApp.controller("UsCapitationCtrl", ["$scope", "$rootScope", "eHnoteMasterDataService", "eHnoteInsuranceService", "alertify", "$q", "eHnoteMainAppointmentService", "$filter", function ($scope, $rootScope, eHnoteMasterDataService, eHnoteInsuranceService, alertify, $q, eHnoteMainAppointmentService, $filter) {

    $scope.doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.HospitalId = 0;
    $scope.ParentHospitalId = 0;
    $scope.UserId = eHnoteMasterDataService.getLoginId();
    if ($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode
        && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID) {
        $scope.HospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        $scope.ParentHospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
    }







    function GetCapitationData() {
        var obj = {
            "OrganizationPayorBillingId": null,            
            "OrganizationId": $scope.HospitalId,           
            "UserId": $scope.UserId,
            "DeleteInd": "N",
            "IsRenderingProviderInd": true,
            "OrganizationPayorId": null,
            "PayorId": null,
            "PayorObj": "",
            "PayorName": "",
            "PlanYear": "",
            "BillingProviderId": null,
            "BillingProviderName": "",
            "totalJanuaryAmount": null,
            "totalFebruaryAmount": null,
            "totalMarchAmount": null,
            "totalAprilAmount": null,
            "totalMayAmount": null,
            "totalJuneAmount": null,
            "totalJulyAmount": null,
            "totalAugustAmount": null,
            "totalSeptemberAmount": null,
            "totalOctoberAmount": null,
            "totalNovemberAmount": null,
            "totalDecemberAmount": null,
            "BillingProviders": [],

        }
        return obj;
    };

    function GetCapitationLineitemData() {
        var obj = {
            "OrganizationPayorBillingProviderId": null,
            "DeleteInd": "N",
            "RenderingProviderObj": null,
            "BillingProviderId": null,
            "BillingProviderName": "",
            "RenderingProviderId": null,
            "RenderingProviderName": "",
            "januarypercentage": null,
            "januaryeffectiveDate": null,
            "februarypercentage": null,
            "februaryeffectiveDate": null,
            "marchpercentage": null,
            "marcheffectiveDate": null,
            "aprilpercentage": null,
            "aprileffectiveDate": null,
            "maypercentage": null,
            "mayeffectiveDate": null,
            "junepercentage": null,
            "juneeffectiveDate": null,
            "julypercentage": null,
            "julyeffectiveDate": null,
            "augustpercentage": null,
            "augusteffectiveDate": null,
            "septemberpercentage": null,
            "septembereffectiveDate": null,
            "octoberpercentage": null,
            "octobereffectiveDate": null,
            "novemberpercentage": null,
            "novembereffectiveDate": null,
            "decemberpercentage": null,
            "decembereffectiveDate": null,

        }
        return obj;
    };



    $scope.init = function () {
        $scope.Subtab = 1;
        $scope.isEditMode = false;
        $scope.CapitationList = [];
        $scope.CapitationListcount = 0;
        $scope.CapitationLineitemobj = GetCapitationLineitemData();
        $scope.Capitationobj = GetCapitationData();
        let obj = {

            "OrganizationId": $scope.HospitalId,
            "BillingProviderId":null,
            "PayorId": null,
            "PlanYear": null,
            "PageSize": 100,
            "PageNumber": 1,
        }


        eHnoteMainAppointmentService.getBranchSubSpecializationsById($scope.doctorinfo.doctordata.UserAddress[0].SubOrganizationId, $scope.HospitalId).then(function (resp) {
            if (resp.data.row.length > 0) {
                $scope.allSubSpecializationsArray = resp.data.row;
                angular.forEach($scope.allSubSpecializationsArray, function (item) {
                    item.isChecked = true;
                });

                
                var branchesList = [];
                $scope.clinicDoctorList = [];
                $scope.allUserList = [];
                $scope.selectedDoctor = "";


                var listSubSplArray = $filter("filter")($scope.allSubSpecializationsArray, function (iterator, ind) { return iterator.isChecked === true; });
                var subSplArray = _.pluck(listSubSplArray, "SubSpecializationId").join(",");

                var reqObj = {
                    "BranchId": $scope.HospitalId,
                    "SubSpecializationIdArray": subSplArray
                }


                eHnoteMainAppointmentService.getAllUsersByDepartmentId(reqObj, onGetUsersSuccess, onGetUsersFailure);
                function onGetUsersSuccess(resp) {
                    console.log(resp);
                    if (resp.rows.length > 0) {
                        $scope.allUserList = resp.rows;
                        $scope.BranchDoctorsList = angular.copy($scope.allUserList);
                        $scope.BranchDoctorsList = $filter("filter")($scope.BranchDoctorsList, function (item) {
                            return item.RoleId === 1 || item.RoleId === 3 || item.RoleId === 4 || item.RoleId === 43 || item.RoleId === 55;
                        });        

                    } else {
                        alertify.error("No Users Found in Selected Departments");
                        $scope.mainBookedAppointmentList = [];
                    }


                }

                function onGetUsersFailure(data) {
                }
            } else {
                $scope.allSubSpecializationsArray = [];
                $scope.clinicDoctorList = [];
                $scope.allUserList = [];
                $scope.selectedDoctor = "";
                alertify.error("No Departments are been added");
            }


        });


        $q.all([
            eHnoteInsuranceService.GetCapitationList(obj),
        ]).then(function (resp) {
            if (resp[0].data.Status === "Success") {
                if (resp[0].data.rows.length > 0) {
                    $scope.CapitationList = resp[0].data.rows || [];
                    $scope.CapitationListcount = resp[0].data.count || [];
                }
            }



        });


    }
    $scope.init();

    //$scope.planYears = [
    //    { id: 1, value: 2023, label: '2023' },
    //    { id: 2, value: 2024, label: '2024' },
    //    { id: 3, value: 2025, label: '2025' },
    //    { id: 4, value: 2026, label: '2026' },
    //    { id: 5, value: 2027, label: '2027' },
    //    { id: 6, value: 2028, label: '2028' }
    //];

    var generatePlanYears = function () {
        var currentYear = new Date().getFullYear();
        var startYear = currentYear - 2;
        var endYear = currentYear + 3;
        $scope.planYears = [];

        for (var year = startYear; year <= endYear; year++) {
            $scope.planYears.push({
                id: year,
                value: year,
                label: year.toString()
            });
        }
    };

    generatePlanYears();
    $scope.providerGroups = [
        { id: 1, value: 'OPH', label: 'OPH', isChecked: false },
        { id: 2, value: 'ASC', label: 'ASC', isChecked: false },
        { id: 3, value: 'OPTICA', label: 'Optica', isChecked: false }
    ];

    $scope.providerGroupOptions = [
        { id: 1, value: 'OPH', label: 'OPH' },
        { id: 2, value: 'ASC', label: 'ASC'},
        { id: 3, value: 'OPTICA', label: 'Optica'},
        { id: 4, value: 'OPH+ASC', label: 'OPH + ASC' },
        { id: 5, value: 'OPH+OPTICA', label: 'OPH + Optica' },
        { id: 6, value: 'ASC+OPTICA', label: 'ASC + Optica'},
        { id: 7, value: 'OPH+ASC+OPTICA', label: 'OPH+ASC+Optica'}
    ];

    $scope.Subinit = function () {
        $scope.CapitationLineitemobj = GetCapitationLineitemData();
        $scope.Capitationobj = GetCapitationData();
        $scope.existingProviderIdMap = {}; // ✅ clear map
        $scope.Capitationobj.BillingProviders.push($scope.CapitationLineitemobj);
    }
    $scope.navtoAddCapitation = function (tabno) {
        $scope.Subtab = tabno || "";
        if (!$scope.isEditMode) {
            $scope.Subinit();
        }
        $scope.isEditMode = false;
    }




    $scope.ChangeInd = function () {       
        $scope.Capitationobj.IsRenderingProviderInd != $scope.Capitationobj.IsRenderingProviderInd;        
        $scope.Capitationobj.BillingProviders = [];
        if ($scope.Capitationobj.IsRenderingProviderInd) {
            // ── TRUE mode: user manually picks each doctor row by row ──
            // Push one blank line item for them to start filling
            var newItem = GetCapitationLineitemData();
            newItem.BillingProviderId = $scope.Capitationobj.BillingProviderId;
            newItem.BillingProviderName = $scope.Capitationobj.BillingProviderName;
            $scope.Capitationobj.BillingProviders.push(newItem);

        } else {
            // ── FALSE mode: single shared row, all doctors get same values ──
            // Push one blank item into CapitationLineitemobj (the shared template row)
            $scope.CapitationLineitemobj = GetCapitationLineitemData();
            $scope.CapitationLineitemobj.BillingProviderId = $scope.Capitationobj.BillingProviderId;
            $scope.CapitationLineitemobj.BillingProviderName = $scope.Capitationobj.BillingProviderName;
            
        }
    };

    $scope.onClickPayor = function (Obj, MainObj) {
        $scope.Capitationobj.OrganizationPayorId = Obj.OrganizationPayorId;
        $scope.Capitationobj.PayorName = Obj.PayorName;
        $scope.Capitationobj.PayorId = Obj.PayorId;
    };

    $scope.AddLineItem = function () {
        var activeProviders = $scope.Capitationobj.BillingProviders.filter(function (item) {
            return item.DeleteInd !== "Y";
        });

        var hasEmpty = activeProviders.some(function (item) {
            return !item.RenderingProviderId;
        });

        if (hasEmpty) {
            alertify.error("Please select a Rendering Provider before adding a new row.");
            return;
        }

        var newItem = GetCapitationLineitemData();
        $scope.Capitationobj.BillingProviders.push(newItem);
    };

    $scope.ChangeDoctor = function (Id, item) {

        if (!Id) return;

        // Check if this RenderingProviderId already exists in another active row
        var isDuplicate = $scope.Capitationobj.BillingProviders.some(function (provider) {
            return provider !== item &&
                provider.DeleteInd !== "Y" &&
                provider.RenderingProviderId === Id;
        });

        if (isDuplicate) {
            alertify.error("This Rendering Provider is already added. Please select a different provider.");
            // Reset the current row selection
            item.RenderingProviderId = null;
            item.RenderingProviderName = "";
            return;
        }

        // No duplicate — assign
        var filteredArray = $filter("filter")($scope.BranchDoctorsList, { "DoctorID": Id }, true) || [];
        if (filteredArray.length > 0) {
            item.RenderingProviderId = filteredArray[0].DoctorID;
            item.RenderingProviderName = filteredArray[0].FullName;
        }
    };

    $scope.ChangeProvider = function (Id) {

        var PfiltredArray = $filter("filter")($scope.providerGroupOptions, { "id": Id }, true) || [];
        if (PfiltredArray.length > 0) {
            $scope.Capitationobj.BillingProviderId = PfiltredArray[0].id;
            $scope.Capitationobj.BillingProviderName = PfiltredArray[0].value;
        }
    };

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

    $scope.GetEOBSearchObject = function () {
        var obj = {
            "PayorObj": null,
            "PostingFromDate": null,
            "PostingToDate": null,
            "DepositFromDate": null,
            "DepositToDate": null,
            "DepositStatusId": "",
            "OrganizationBillingProviderId": "",
            "BillPaymentTypeId": null,
            "AppliedStatusId": "",
            "ReferenceNumber": "",
            "SortByName": "",
            "SortById": null,
            "PaymentMethodId": "",
            "PostingPaymentTab": 1,
            "ProcessingTypeId": 0,
            "PaymentStatusId": 0,
            "PageNumber": 1,
            "PageSize": 100,
            "PlanYear":null,
        }
        return obj;
    }

    $scope.EOBSearchObj = $scope.GetEOBSearchObject();
    $scope.refreshAllClaimDetails = function () {
        $scope.EOBSearchObj.PayorId = null;
        $scope.EOBSearchObj.BillingProviderId = null;
        $scope.EOBSearchObj.PlanYear = null;
        $scope.EOBSearchObj.PayorObj = null;
        $scope.EOBSearchObj.PageNumber = 1;
        $scope.GetCapitationList();
    }
    $scope.GetCapitationList = function () {
        let obj = {
            "OrganizationId": $scope.HospitalId,
            "PayorId": $scope.EOBSearchObj.PayorId||null,
            "PageSize": $scope.EOBSearchObj.PageSize||100,
            "PageNumber": $scope.EOBSearchObj.PageNumber||1,
            "BillingProviderId": $scope.EOBSearchObj.BillingProviderId||null,
            "PlanYear": $scope.EOBSearchObj.PlanYear||null,

        }
        eHnoteInsuranceService.GetCapitationList(obj).then(function (resp) {
            if (resp.data.Status == "Success") {
                $scope.CapitationList = resp.data.rows || [];
                $scope.CapitationListcount = resp.data.count || [];
                angular.element(document.querySelector('.popover')).remove();

            } else {
                alertify.error(resp.data.Message);
            }
        });
    }

    $scope.DeleteSelecteditem = function (item) {
        var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure want to delete? </h4>", function () {
            let obj = {
                "OrganizationPayorBillingId": item.OrganizationPayorBillingId,
                "DeleteInd": "Y",                
                "UserId": $scope.UserId,
            }
            eHnoteInsuranceService.DeleteCapitation(obj).then(function (resp) {
                if (resp.data.Status == "Success") {
                    $scope.GetCapitationList();

                } else {
                    alertify.error(resp.data.Message);
                }
            });
        }, function () {
            r = "You pressed Cancel!";
        });

    };

    $scope.SaveCapitation = function () {
        $scope.Capitationobj.PayorId = $scope.Capitationobj.PayorId || null;
        $scope.Capitationobj.PlanYear = $scope.Capitationobj.PlanYear || "";
        $scope.Capitationobj.BillingProviderId = $scope.Capitationobj.BillingProviderId || null;
        if ($scope.Capitationobj.PayorId ==null) {
            alertify.error("Please select a Payer Health Plan.");
            return;
        }
        if ($scope.Capitationobj.PlanYear=="") {
            alertify.error("Please select a Plan Year.");
            return;
        }
        if ($scope.Capitationobj.BillingProviderId==null) {
            alertify.error("Please select a Provider Group.");
            return;
        }

        var hasAtleastOneAmount = !!$scope.Capitationobj.totalJanuaryAmount || !!$scope.Capitationobj.totalFebruaryAmount || !!$scope.Capitationobj.totalMarchAmount || !!$scope.Capitationobj.totalAprilAmount || !!$scope.Capitationobj.totalMayAmount || !!$scope.Capitationobj.totalJuneAmount || !!$scope.Capitationobj.totalJulyAmount || !!$scope.Capitationobj.totalAugustAmount || !!$scope.Capitationobj.totalSeptemberAmount || !!$scope.Capitationobj.totalOctoberAmount || !!$scope.Capitationobj.totalNovemberAmount || !!$scope.Capitationobj.totalDecemberAmount;

        if (!hasAtleastOneAmount) {
            alertify.error("Please enter at least one month amount.");
            return false;
        }

        var isValid = true;

        if ($scope.Capitationobj.IsRenderingProviderInd) {
            angular.forEach($scope.Capitationobj.BillingProviders, function (item) {
                if (!isValid) return;
                if (item.RenderingProviderId == null) {
                    alertify.error("Please select billing provider.");
                    isValid = false;
                } else if (item.januarypercentage != null && item.januaryeffectiveDate == null) {
                    alertify.error("Please select january effective date.");
                    isValid = false;
                } else if (item.januarypercentage != null && !$scope.Capitationobj.totalJanuaryAmount) {
                    alertify.error("Please enter january amount.");
                    isValid = false;
                } else if (item.februarypercentage != null && item.februaryeffectiveDate == null) {
                    alertify.error("Please select february effective date.");
                    isValid = false;
                } else if (item.februarypercentage != null && !$scope.Capitationobj.totalFebruaryAmount) {
                    alertify.error("Please enter february amount.");
                    isValid = false;
                } else if (item.marchpercentage != null && item.marcheffectiveDate == null) {
                    alertify.error("Please select march effective date.");
                    isValid = false;
                } else if (item.marchpercentage != null && !$scope.Capitationobj.totalMarchAmount) {
                    alertify.error("Please enter march amount.");
                    isValid = false;
                } else if (item.aprilpercentage != null && item.aprileffectiveDate == null) {
                    alertify.error("Please select april effective date.");
                    isValid = false;
                } else if (item.aprilpercentage != null && !$scope.Capitationobj.totalAprilAmount) {
                    alertify.error("Please enter april amount.");
                    isValid = false;
                } else if (item.maypercentage != null && item.mayeffectiveDate == null) {
                    alertify.error("Please select may effective date.");
                    isValid = false;
                } else if (item.maypercentage != null && !$scope.Capitationobj.totalMayAmount) {
                    alertify.error("Please enter may amount.");
                    isValid = false;
                } else if (item.junepercentage != null && item.juneeffectiveDate == null) {
                    alertify.error("Please select june effective date.");
                    isValid = false;
                } else if (item.junepercentage != null && !$scope.Capitationobj.totalJuneAmount) {
                    alertify.error("Please enter june amount.");
                    isValid = false;
                } else if (item.julypercentage != null && item.julyeffectiveDate == null) {
                    alertify.error("Please select july effective date.");
                    isValid = false;
                } else if (item.julypercentage != null && !$scope.Capitationobj.totalJulyAmount) {
                    alertify.error("Please enter july amount.");
                    isValid = false;
                } else if (item.augustpercentage != null && item.augusteffectiveDate == null) {
                    alertify.error("Please select august effective date.");
                    isValid = false;
                } else if (item.augustpercentage != null && !$scope.Capitationobj.totalAugustAmount) {
                    alertify.error("Please enter august amount.");
                    isValid = false;
                } else if (item.septemberpercentage != null && item.septembereffectiveDate == null) {
                    alertify.error("Please select september effective date.");
                    isValid = false;
                } else if (item.septemberpercentage != null && !$scope.Capitationobj.totalSeptemberAmount) {
                    alertify.error("Please enter september amount.");
                    isValid = false;
                } else if (item.octoberpercentage != null && item.octobereffectiveDate == null) {
                    alertify.error("Please select october effective date.");
                    isValid = false;
                } else if (item.octoberpercentage != null && !$scope.Capitationobj.totalOctoberAmount) {
                    alertify.error("Please enter october amount.");
                    isValid = false;
                } else if (item.novemberpercentage != null && item.novembereffectiveDate == null) {
                    alertify.error("Please select november effective date.");
                    isValid = false;
                } else if (item.novemberpercentage != null && !$scope.Capitationobj.totalNovemberAmount) {
                    alertify.error("Please enter november amount.");
                    isValid = false;
                } else if (item.decemberpercentage != null && item.decembereffectiveDate == null) {
                    alertify.error("Please select december effective date.");
                    isValid = false;
                } else if (item.decemberpercentage != null && !$scope.Capitationobj.totalDecemberAmount) {
                    alertify.error("Please enter december amount.");
                    isValid = false;
                }
            });
        }

        if (!$scope.Capitationobj.IsRenderingProviderInd) {
            if (!isValid) return;
            if ($scope.CapitationLineitemobj.januarypercentage != null && $scope.CapitationLineitemobj.januaryeffectiveDate == null) {
                alertify.error("Please select january effective date.");
                isValid = false;
            } else if ($scope.CapitationLineitemobj.januarypercentage != null && !$scope.Capitationobj.totalJanuaryAmount) {
                alertify.error("Please enter january amount.");
                isValid = false;
            } else if ($scope.CapitationLineitemobj.februarypercentage != null && $scope.CapitationLineitemobj.februaryeffectiveDate == null) {
                alertify.error("Please select february effective date.");
                isValid = false;
            } else if ($scope.CapitationLineitemobj.februarypercentage != null && !$scope.Capitationobj.totalFebruaryAmount) {
                alertify.error("Please enter february amount.");
                isValid = false;
            } else if ($scope.CapitationLineitemobj.marchpercentage != null && $scope.CapitationLineitemobj.marcheffectiveDate == null) {
                alertify.error("Please select march effective date.");
                isValid = false;
            } else if ($scope.CapitationLineitemobj.marchpercentage != null && !$scope.Capitationobj.totalMarchAmount) {
                alertify.error("Please enter march amount.");
                isValid = false;
            } else if ($scope.CapitationLineitemobj.aprilpercentage != null && $scope.CapitationLineitemobj.aprileffectiveDate == null) {
                alertify.error("Please select april effective date.");
                isValid = false;
            } else if ($scope.CapitationLineitemobj.aprilpercentage != null && !$scope.Capitationobj.totalAprilAmount) {
                alertify.error("Please enter april amount.");
                isValid = false;
            } else if ($scope.CapitationLineitemobj.maypercentage != null && $scope.CapitationLineitemobj.mayeffectiveDate == null) {
                alertify.error("Please select may effective date.");
                isValid = false;
            } else if ($scope.CapitationLineitemobj.maypercentage != null && !$scope.Capitationobj.totalMayAmount) {
                alertify.error("Please enter may amount.");
                isValid = false;
            } else if ($scope.CapitationLineitemobj.junepercentage != null && $scope.CapitationLineitemobj.juneeffectiveDate == null) {
                alertify.error("Please select june effective date.");
                isValid = false;
            } else if ($scope.CapitationLineitemobj.junepercentage != null && !$scope.Capitationobj.totalJuneAmount) {
                alertify.error("Please enter june amount.");
                isValid = false;
            } else if ($scope.CapitationLineitemobj.julypercentage != null && $scope.CapitationLineitemobj.julyeffectiveDate == null) {
                alertify.error("Please select july effective date.");
                isValid = false;
            } else if ($scope.CapitationLineitemobj.julypercentage != null && !$scope.Capitationobj.totalJulyAmount) {
                alertify.error("Please enter july amount.");
                isValid = false;
            } else if ($scope.CapitationLineitemobj.augustpercentage != null && $scope.CapitationLineitemobj.augusteffectiveDate == null) {
                alertify.error("Please select august effective date.");
                isValid = false;
            } else if ($scope.CapitationLineitemobj.augustpercentage != null && !$scope.Capitationobj.totalAugustAmount) {
                alertify.error("Please enter august amount.");
                isValid = false;
            } else if ($scope.CapitationLineitemobj.septemberpercentage != null && $scope.CapitationLineitemobj.septembereffectiveDate == null) {
                alertify.error("Please select september effective date.");
                isValid = false;
            } else if ($scope.CapitationLineitemobj.septemberpercentage != null && !$scope.Capitationobj.totalSeptemberAmount) {
                alertify.error("Please enter september amount.");
                isValid = false;
            } else if ($scope.CapitationLineitemobj.octoberpercentage != null && $scope.CapitationLineitemobj.octobereffectiveDate == null) {
                alertify.error("Please select october effective date.");
                isValid = false;
            } else if ($scope.CapitationLineitemobj.octoberpercentage != null && !$scope.Capitationobj.totalOctoberAmount) {
                alertify.error("Please enter october amount.");
                isValid = false;
            } else if ($scope.CapitationLineitemobj.novemberpercentage != null && $scope.CapitationLineitemobj.novembereffectiveDate == null) {
                alertify.error("Please select november effective date.");
                isValid = false;
            } else if ($scope.CapitationLineitemobj.novemberpercentage != null && !$scope.Capitationobj.totalNovemberAmount) {
                alertify.error("Please enter november amount.");
                isValid = false;
            } else if ($scope.CapitationLineitemobj.decemberpercentage != null && $scope.CapitationLineitemobj.decembereffectiveDate == null) {
                alertify.error("Please select december effective date.");
                isValid = false;
            } else if ($scope.CapitationLineitemobj.decemberpercentage != null && !$scope.Capitationobj.totalDecemberAmount) {
                alertify.error("Please enter december amount.");
                isValid = false;
            }
        }

        if (!isValid) return false;

        // ✅ If IsRenderingProviderInd is FALSE
        // Build BillingProviders by looping all BranchDoctorsList
        // and applying the shared CapitationLineitemobj values to each doctor
        if (!$scope.Capitationobj.IsRenderingProviderInd) {

            $scope.Capitationobj.BillingProviders = [];

            if ($scope.isEditMode) {
                // ✅ EDIT — loop the existingProviderIdMap only
                // Every item in the map has a valid OrganizationPayorBillingProviderId → always UPDATE
                // OrganizationPayorBillingProviderId is NEVER null here → proc does UPDATE not INSERT
                angular.forEach($scope.existingProviderIdMap, function (orgPayorBillingProviderId, doctorId) {

                    var parsedDoctorId = parseInt(doctorId);
                    var doctorArr = $filter("filter")($scope.BranchDoctorsList, { "DoctorID": parsedDoctorId }, true);
                    var doctor = doctorArr.length > 0 ? doctorArr[0] : null;

                    var newItem = GetCapitationLineitemData();

                    // ── Identity columns ─────────────────────────────────────
                    newItem.OrganizationPayorBillingProviderId = orgPayorBillingProviderId; // ✅ never null
                    newItem.OrganizationPayorBillingId = $scope.Capitationobj.OrganizationPayorBillingId;

                    // ── Doctor Identity ──────────────────────────────────────
                    newItem.RenderingProviderId = parsedDoctorId;
                    newItem.RenderingProviderName = doctor ? doctor.FullName : "";
                    newItem.BillingProviderId = $scope.Capitationobj.BillingProviderId;
                    newItem.BillingProviderName = $scope.Capitationobj.BillingProviderName;
                    newItem.DeleteInd = "N";

                    // ── Shared monthly values ────────────────────────────────
                    newItem.januarypercentage = $scope.CapitationLineitemobj.januarypercentage;
                    newItem.januaryeffectiveDate = $scope.CapitationLineitemobj.januaryeffectiveDate;
                    newItem.februarypercentage = $scope.CapitationLineitemobj.februarypercentage;
                    newItem.februaryeffectiveDate = $scope.CapitationLineitemobj.februaryeffectiveDate;
                    newItem.marchpercentage = $scope.CapitationLineitemobj.marchpercentage;
                    newItem.marcheffectiveDate = $scope.CapitationLineitemobj.marcheffectiveDate;
                    newItem.aprilpercentage = $scope.CapitationLineitemobj.aprilpercentage;
                    newItem.aprileffectiveDate = $scope.CapitationLineitemobj.aprileffectiveDate;
                    newItem.maypercentage = $scope.CapitationLineitemobj.maypercentage;
                    newItem.mayeffectiveDate = $scope.CapitationLineitemobj.mayeffectiveDate;
                    newItem.junepercentage = $scope.CapitationLineitemobj.junepercentage;
                    newItem.juneeffectiveDate = $scope.CapitationLineitemobj.juneeffectiveDate;
                    newItem.julypercentage = $scope.CapitationLineitemobj.julypercentage;
                    newItem.julyeffectiveDate = $scope.CapitationLineitemobj.julyeffectiveDate;
                    newItem.augustpercentage = $scope.CapitationLineitemobj.augustpercentage;
                    newItem.augusteffectiveDate = $scope.CapitationLineitemobj.augusteffectiveDate;
                    newItem.septemberpercentage = $scope.CapitationLineitemobj.septemberpercentage;
                    newItem.septembereffectiveDate = $scope.CapitationLineitemobj.septembereffectiveDate;
                    newItem.octoberpercentage = $scope.CapitationLineitemobj.octoberpercentage;
                    newItem.octobereffectiveDate = $scope.CapitationLineitemobj.octobereffectiveDate;
                    newItem.novemberpercentage = $scope.CapitationLineitemobj.novemberpercentage;
                    newItem.novembereffectiveDate = $scope.CapitationLineitemobj.novembereffectiveDate;
                    newItem.decemberpercentage = $scope.CapitationLineitemobj.decemberpercentage;
                    newItem.decembereffectiveDate = $scope.CapitationLineitemobj.decembereffectiveDate;

                    $scope.Capitationobj.BillingProviders.push(newItem);
                });

                // Clear map after use so next Add mode is clean
                $scope.existingProviderIdMap = {};

            } else {
                // ✅ ADD — loop all BranchDoctorsList, all OrganizationPayorBillingProviderId = null → INSERT
                angular.forEach($scope.BranchDoctorsList, function (doctor) {

                    var newItem = GetCapitationLineitemData();

                    newItem.OrganizationPayorBillingProviderId = null; // new → INSERT
                    newItem.RenderingProviderId = doctor.DoctorID;
                    newItem.RenderingProviderName = doctor.FullName;
                    newItem.BillingProviderId = $scope.Capitationobj.BillingProviderId;
                    newItem.BillingProviderName = $scope.Capitationobj.BillingProviderName;
                    newItem.DeleteInd = "N";

                    newItem.januarypercentage = $scope.CapitationLineitemobj.januarypercentage;
                    newItem.januaryeffectiveDate = $scope.CapitationLineitemobj.januaryeffectiveDate;
                    newItem.februarypercentage = $scope.CapitationLineitemobj.februarypercentage;
                    newItem.februaryeffectiveDate = $scope.CapitationLineitemobj.februaryeffectiveDate;
                    newItem.marchpercentage = $scope.CapitationLineitemobj.marchpercentage;
                    newItem.marcheffectiveDate = $scope.CapitationLineitemobj.marcheffectiveDate;
                    newItem.aprilpercentage = $scope.CapitationLineitemobj.aprilpercentage;
                    newItem.aprileffectiveDate = $scope.CapitationLineitemobj.aprileffectiveDate;
                    newItem.maypercentage = $scope.CapitationLineitemobj.maypercentage;
                    newItem.mayeffectiveDate = $scope.CapitationLineitemobj.mayeffectiveDate;
                    newItem.junepercentage = $scope.CapitationLineitemobj.junepercentage;
                    newItem.juneeffectiveDate = $scope.CapitationLineitemobj.juneeffectiveDate;
                    newItem.julypercentage = $scope.CapitationLineitemobj.julypercentage;
                    newItem.julyeffectiveDate = $scope.CapitationLineitemobj.julyeffectiveDate;
                    newItem.augustpercentage = $scope.CapitationLineitemobj.augustpercentage;
                    newItem.augusteffectiveDate = $scope.CapitationLineitemobj.augusteffectiveDate;
                    newItem.septemberpercentage = $scope.CapitationLineitemobj.septemberpercentage;
                    newItem.septembereffectiveDate = $scope.CapitationLineitemobj.septembereffectiveDate;
                    newItem.octoberpercentage = $scope.CapitationLineitemobj.octoberpercentage;
                    newItem.octobereffectiveDate = $scope.CapitationLineitemobj.octobereffectiveDate;
                    newItem.novemberpercentage = $scope.CapitationLineitemobj.novemberpercentage;
                    newItem.novembereffectiveDate = $scope.CapitationLineitemobj.novembereffectiveDate;
                    newItem.decemberpercentage = $scope.CapitationLineitemobj.decemberpercentage;
                    newItem.decembereffectiveDate = $scope.CapitationLineitemobj.decembereffectiveDate;

                    $scope.Capitationobj.BillingProviders.push(newItem);
                });
            }
        }

        // ✅ If IsRenderingProviderInd is TRUE — validate rows have a doctor selected
        if ($scope.Capitationobj.IsRenderingProviderInd) {
            var activeProviders = $scope.Capitationobj.BillingProviders.filter(function (item) {
                return item.DeleteInd !== "Y";
            });
            if (activeProviders.length === 0) {
                alertify.error("Please add at least one Rendering Provider.");
                return;
            }
            var invalidRows = [];
            angular.forEach(activeProviders, function (item, index) {
                if (!item.RenderingProviderId) {
                    invalidRows.push(index + 1);
                }
            });
            if (invalidRows.length > 0) {
                alertify.error("Please select a Rendering Provider for row(s): " + invalidRows.join(", "));
                return;
            }
        }






         var obj = {
             "OrganizationPayorBillingId": $scope.Capitationobj.OrganizationPayorBillingId,
             "OrganizationId": $scope.Capitationobj.OrganizationId,
             "UserId": $scope.UserId,
             "DeleteInd": $scope.Capitationobj.DeleteInd,
             "IsRenderingProviderInd": $scope.Capitationobj.IsRenderingProviderInd,
             "OrganizationPayorId": $scope.Capitationobj.OrganizationPayorId,
             "PayorId": $scope.Capitationobj.PayorId,          
             "PayorName": $scope.Capitationobj.PayorName,
             "PlanYear": $scope.Capitationobj.PlanYear,
             "BillingProviderId": $scope.Capitationobj.BillingProviderId,
             "BillingProviderName": $scope.Capitationobj.BillingProviderName,
             "totalJanuaryAmount": $scope.Capitationobj.totalJanuaryAmount,
             "totalFebruaryAmount": $scope.Capitationobj.totalFebruaryAmount,
             "totalMarchAmount": $scope.Capitationobj.totalMarchAmount,
             "totalAprilAmount": $scope.Capitationobj.totalAprilAmount,
             "totalMayAmount": $scope.Capitationobj.totalMayAmount,
             "totalJuneAmount": $scope.Capitationobj.totalJuneAmount,
             "totalJulyAmount": $scope.Capitationobj.totalJulyAmount,
             "totalAugustAmount": $scope.Capitationobj.totalAugustAmount,
             "totalSeptemberAmount": $scope.Capitationobj.totalSeptemberAmount,
             "totalOctoberAmount": $scope.Capitationobj.totalOctoberAmount,
             "totalNovemberAmount": $scope.Capitationobj.totalNovemberAmount,
             "totalDecemberAmount": $scope.Capitationobj.totalDecemberAmount,
             "BillingProviders": $scope.Capitationobj.BillingProviders||[],

        }

        eHnoteInsuranceService.AddUpdateCapitation(obj).then(function (resp) {
            if (resp.data.status == "Success") {
                alertify.success($scope.isEditMode ? "Updated successfully" : "Added successfully");
                $scope.isEditMode = false;
                $scope.navtoAddCapitation(1);
                $scope.GetCapitationList();

            } else {
                alertify.error(resp.data.Message);
            }
        });
    }

    function formatDate(date) {
        if (!date) return null;
        return $filter('date')(date, 'MM-dd-yyyy');
    }

    $scope.EditSelecteditem = function (selectedItem) {

        var editObj = GetCapitationData();

        // ── Main Fields ──────────────────────────────────────────
        editObj.OrganizationPayorBillingId = selectedItem.OrganizationPayorBillingId;
        editObj.OrganizationId = selectedItem.OrganizationId;
        editObj.OrganizationPayorId = selectedItem.OrganizationPayorId;
        editObj.PayorId = selectedItem.PayorId;
        editObj.PayorName = selectedItem.PayorName;
        editObj.PayorObj = selectedItem.PayorName;
        editObj.PlanYear = parseInt(selectedItem.PlanYear);
        editObj.BillingProviderId = selectedItem.BillingProviderId;
        editObj.BillingProviderName = selectedItem.BillingProviderName;
        editObj.DeleteInd = selectedItem.DeleteInd === "Y" ? "Y" : "N";
        editObj.IsRenderingProviderInd = selectedItem.IsRenderingProviderInd;
   
        // ── Total Capitation Amounts ─────────────────────────────
        editObj.totalJanuaryAmount = selectedItem.totalJanuaryAmount;
        editObj.totalFebruaryAmount = selectedItem.totalFebruaryAmount;
        editObj.totalMarchAmount = selectedItem.totalMarchAmount;
        editObj.totalAprilAmount = selectedItem.totalAprilAmount;
        editObj.totalMayAmount = selectedItem.totalMayAmount;
        editObj.totalJuneAmount = selectedItem.totalJuneAmount;
        editObj.totalJulyAmount = selectedItem.totalJulyAmount;
        editObj.totalAugustAmount = selectedItem.totalAugustAmount;
        editObj.totalSeptemberAmount = selectedItem.totalSeptemberAmount;
        editObj.totalOctoberAmount = selectedItem.totalOctoberAmount;
        editObj.totalNovemberAmount = selectedItem.totalNovemberAmount;
        editObj.totalDecemberAmount = selectedItem.totalDecemberAmount;

        // ── Billing Providers (Line Items) ───────────────────────
        editObj.BillingProviders = [];

        if (selectedItem.PayorBillingProvider && selectedItem.PayorBillingProvider.length > 0) {

            // ✅ IsRenderingProviderInd = FALSE
            // All doctors share the same monthly values
            // Load values from the first provider into CapitationLineitemobj (the shared template row)
            // BillingProviders array is still populated for save to use
            if (!selectedItem.IsRenderingProviderInd) {

                var firstProvider = selectedItem.PayorBillingProvider[0];

                // ── Load shared monthly values into CapitationLineitemobj ──
                var sharedItem = GetCapitationLineitemData();

                sharedItem.BillingProviderId = selectedItem.BillingProviderId;
                sharedItem.BillingProviderName = selectedItem.BillingProviderName;

                sharedItem.januarypercentage = firstProvider.januarypercentage;
                sharedItem.januaryeffectiveDate = formatDate(firstProvider.januaryeffectiveDate);

                sharedItem.februarypercentage = firstProvider.februarypercentage;
                sharedItem.februaryeffectiveDate = formatDate(firstProvider.februaryeffectiveDate);

                sharedItem.marchpercentage = firstProvider.marchpercentage;
                sharedItem.marcheffectiveDate = formatDate(firstProvider.marcheffectiveDate);

                sharedItem.aprilpercentage = firstProvider.aprilpercentage;
                sharedItem.aprileffectiveDate = formatDate(firstProvider.aprileffectiveDate);

                sharedItem.maypercentage = firstProvider.maypercentage;
                sharedItem.mayeffectiveDate = formatDate(firstProvider.mayeffectiveDate);

                sharedItem.junepercentage = firstProvider.junepercentage;
                sharedItem.juneeffectiveDate = formatDate(firstProvider.juneeffectiveDate);

                sharedItem.julypercentage = firstProvider.julypercentage;
                sharedItem.julyeffectiveDate = formatDate(firstProvider.julyeffectiveDate);

                sharedItem.augustpercentage = firstProvider.augustpercentage;
                sharedItem.augusteffectiveDate = formatDate(firstProvider.augusteffectiveDate);

                sharedItem.septemberpercentage = firstProvider.septemberpercentage;
                sharedItem.septembereffectiveDate = formatDate(firstProvider.septembereffectiveDate);

                sharedItem.octoberpercentage = firstProvider.octoberpercentage;
                sharedItem.octobereffectiveDate = formatDate(firstProvider.octobereffectiveDate);

                sharedItem.novemberpercentage = firstProvider.novemberpercentage;
                sharedItem.novembereffectiveDate = formatDate(firstProvider.novembereffectiveDate);

                sharedItem.decemberpercentage = firstProvider.decemberpercentage;
                sharedItem.decembereffectiveDate = formatDate(firstProvider.decembereffectiveDate);

                // ✅ Set CapitationLineitemobj so the template row in HTML shows the values
                $scope.CapitationLineitemobj = sharedItem;

                $scope.existingProviderIdMap = {};
                angular.forEach(selectedItem.PayorBillingProvider, function (provider) {
                    $scope.existingProviderIdMap[provider.RenderingProviderId] =
                        provider.OrganizationPayorBillingProviderId;
                });

            } else {

                // ✅ IsRenderingProviderInd = TRUE
                // Each row is a different doctor — load all line items normally
                angular.forEach(selectedItem.PayorBillingProvider, function (provider) {

                    var lineItem = GetCapitationLineitemData();

                    lineItem.OrganizationPayorBillingProviderId = provider.OrganizationPayorBillingProviderId;
                    lineItem.OrganizationPayorBillingId = provider.OrganizationPayorBillingId;
                    lineItem.DeleteInd = provider.DeleteInd === "Y" ? "Y" : "N";
                    lineItem.BillingProviderId = provider.BillingProviderId;
                    lineItem.BillingProviderName = provider.BillingProviderName;
                    lineItem.RenderingProviderId = provider.RenderingProviderId;
                    lineItem.RenderingProviderName = provider.RenderingProviderName;
                    lineItem.RenderingProviderObj = {
                        RenderingProviderId: provider.RenderingProviderId,
                        RenderingProviderName: provider.RenderingProviderName
                    };

                    lineItem.januarypercentage = provider.januarypercentage;
                    lineItem.januaryeffectiveDate = formatDate(provider.januaryeffectiveDate);

                    lineItem.februarypercentage = provider.februarypercentage;
                    lineItem.februaryeffectiveDate = formatDate(provider.februaryeffectiveDate);

                    lineItem.marchpercentage = provider.marchpercentage;
                    lineItem.marcheffectiveDate = formatDate(provider.marcheffectiveDate);

                    lineItem.aprilpercentage = provider.aprilpercentage;
                    lineItem.aprileffectiveDate = formatDate(provider.aprileffectiveDate);

                    lineItem.maypercentage = provider.maypercentage;
                    lineItem.mayeffectiveDate = formatDate(provider.mayeffectiveDate);

                    lineItem.junepercentage = provider.junepercentage;
                    lineItem.juneeffectiveDate = formatDate(provider.juneeffectiveDate);

                    lineItem.julypercentage = provider.julypercentage;
                    lineItem.julyeffectiveDate = formatDate(provider.julyeffectiveDate);

                    lineItem.augustpercentage = provider.augustpercentage;
                    lineItem.augusteffectiveDate = formatDate(provider.augusteffectiveDate);

                    lineItem.septemberpercentage = provider.septemberpercentage;
                    lineItem.septembereffectiveDate = formatDate(provider.septembereffectiveDate);

                    lineItem.octoberpercentage = provider.octoberpercentage;
                    lineItem.octobereffectiveDate = formatDate(provider.octobereffectiveDate);

                    lineItem.novemberpercentage = provider.novemberpercentage;
                    lineItem.novembereffectiveDate = formatDate(provider.novembereffectiveDate);

                    lineItem.decemberpercentage = provider.decemberpercentage;
                    lineItem.decembereffectiveDate = formatDate(provider.decembereffectiveDate);

                    editObj.BillingProviders.push(lineItem);
                });
            }
        }

        $scope.disabledMonthsShared = {};
        $scope.totalAppliedAmountByMonth = {};
        if (selectedItem.DemiVocherlist && selectedItem.DemiVocherlist.length > 0) {
            angular.forEach(selectedItem.DemiVocherlist, function (demi) {
                var month = parseInt(demi.claimMonth);
                if (demi && month) {
                    $scope.totalAppliedAmountByMonth[month] = demi.TotalAppliedAmount || 0;
                    if (demi.TotalAppliedAmount > 0) {
                        $scope.disabledMonthsShared[month] = true;
                    }
                }
            });
        }
        $scope.isPayorDisabled = selectedItem.DemiVocherlist && selectedItem.DemiVocherlist.length > 0;
        console.log('disabledMonthsShared:', $scope.disabledMonthsShared);

        // ── Assign to Scope ──────────────────────────────────────
        $scope.Capitationobj = editObj;
        $scope.isEditMode = true;
        $scope.Subtab = 2;

        console.log('Edit Object:', $scope.Capitationobj);
        console.log('CapitationLineitemobj:', $scope.CapitationLineitemobj);
    };

    // ── RESET ROW ──────────────────────────────────────────────



    $scope.ResetLineItem = function (item, index) {
        var freshItem = GetCapitationLineitemData();
        freshItem.OrganizationPayorBillingProviderId = item.OrganizationPayorBillingProviderId;
        freshItem.RenderingProviderId = item.RenderingProviderId;
        freshItem.RenderingProviderName = item.RenderingProviderName;
        freshItem.RenderingProviderObj = item.RenderingProviderObj;
        freshItem.BillingProviderId = item.BillingProviderId;
        freshItem.BillingProviderName = item.BillingProviderName;
        freshItem.DeleteInd = "N";

        var realIndex = $scope.Capitationobj.BillingProviders.indexOf(item);
        if (realIndex > -1) {
            $scope.Capitationobj.BillingProviders[realIndex] = freshItem;
        }
    };
    // ── DELETE ROW ─────────────────────────────────────────────
    $scope.DeleteLineItem = function (item, index) {
        if (item.OrganizationPayorBillingProviderId) {
            alertify.confirm(
                "<b class='txt-centre'>Confirm!</b><h4>Are you sure want to delete?</h4>",
                function () {
                    item.DeleteInd = "Y";   // ← direct reference
                    $scope.$apply();
                    alertify.success("Deleted successfully.");
                },
                function () { }
            );
        } else {
            var realIndex = $scope.Capitationobj.BillingProviders.indexOf(item);
            if (realIndex > -1) {
                $scope.Capitationobj.BillingProviders.splice(realIndex, 1);
            }
        }
    };


    $scope.ViewSelecteditem = function (selectedItem) {
        $scope.Selecteditem = selectedItem;
        //var viewObj = GetCapitationData();

        //// ── Main Fields ──────────────────────────────────────────
        //viewObj.OrganizationPayorBillingId = selectedItem.OrganizationPayorBillingId;
        //viewObj.OrganizationPayorId = selectedItem.OrganizationPayorId;
        //viewObj.PayorId = selectedItem.PayorId;
        //viewObj.PayorName = selectedItem.PayorName;
        //viewObj.PayorObj = selectedItem.PayorName;
        //viewObj.PlanYear = parseInt(selectedItem.PlanYear);
        //viewObj.BillingProviderId = selectedItem.BillingProviderId;
        //viewObj.BillingProviderName = selectedItem.BillingProviderName;
        //viewObj.IsRenderingProviderInd = selectedItem.IsRenderingProviderInd;
        //viewObj.DeleteInd = selectedItem.DeleteInd === "Y" ? "Y" : "N";

        //// ── Total Capitation Amounts ─────────────────────────────
        //viewObj.totalJanuaryAmount = selectedItem.totalJanuaryAmount;
        //viewObj.totalFebruaryAmount = selectedItem.totalFebruaryAmount;
        //viewObj.totalMarchAmount = selectedItem.totalMarchAmount;
        //viewObj.totalAprilAmount = selectedItem.totalAprilAmount;
        //viewObj.totalMayAmount = selectedItem.totalMayAmount;
        //viewObj.totalJuneAmount = selectedItem.totalJuneAmount;
        //viewObj.totalJulyAmount = selectedItem.totalJulyAmount;
        //viewObj.totalAugustAmount = selectedItem.totalAugustAmount;
        //viewObj.totalSeptemberAmount = selectedItem.totalSeptemberAmount;
        //viewObj.totalOctoberAmount = selectedItem.totalOctoberAmount;
        //viewObj.totalNovemberAmount = selectedItem.totalNovemberAmount;
        //viewObj.totalDecemberAmount = selectedItem.totalDecemberAmount;

        //// ── Billing Providers (Line Items) ───────────────────────
        //viewObj.BillingProviders = [];

        //if (selectedItem.PayorBillingProvider && selectedItem.PayorBillingProvider.length > 0) {

        //    if (!selectedItem.IsRenderingProviderInd) {
        //        // FALSE — load first provider into ViewCapitationLineitemobj
        //        var firstProvider = selectedItem.PayorBillingProvider[0];
        //        var sharedItem = GetCapitationLineitemData();

        //        sharedItem.BillingProviderId = selectedItem.BillingProviderId;
        //        sharedItem.BillingProviderName = selectedItem.BillingProviderName;

        //        sharedItem.januarypercentage = firstProvider.januarypercentage;
        //        sharedItem.januaryeffectiveDate = formatDate(firstProvider.januaryeffectiveDate);
        //        sharedItem.februarypercentage = firstProvider.februarypercentage;
        //        sharedItem.februaryeffectiveDate = formatDate(firstProvider.februaryeffectiveDate);
        //        sharedItem.marchpercentage = firstProvider.marchpercentage;
        //        sharedItem.marcheffectiveDate = formatDate(firstProvider.marcheffectiveDate);
        //        sharedItem.aprilpercentage = firstProvider.aprilpercentage;
        //        sharedItem.aprileffectiveDate = formatDate(firstProvider.aprileffectiveDate);
        //        sharedItem.maypercentage = firstProvider.maypercentage;
        //        sharedItem.mayeffectiveDate = formatDate(firstProvider.mayeffectiveDate);
        //        sharedItem.junepercentage = firstProvider.junepercentage;
        //        sharedItem.juneeffectiveDate = formatDate(firstProvider.juneeffectiveDate);
        //        sharedItem.julypercentage = firstProvider.julypercentage;
        //        sharedItem.julyeffectiveDate = formatDate(firstProvider.julyeffectiveDate);
        //        sharedItem.augustpercentage = firstProvider.augustpercentage;
        //        sharedItem.augusteffectiveDate = formatDate(firstProvider.augusteffectiveDate);
        //        sharedItem.septemberpercentage = firstProvider.septemberpercentage;
        //        sharedItem.septembereffectiveDate = formatDate(firstProvider.septembereffectiveDate);
        //        sharedItem.octoberpercentage = firstProvider.octoberpercentage;
        //        sharedItem.octobereffectiveDate = formatDate(firstProvider.octobereffectiveDate);
        //        sharedItem.novemberpercentage = firstProvider.novemberpercentage;
        //        sharedItem.novembereffectiveDate = formatDate(firstProvider.novembereffectiveDate);
        //        sharedItem.decemberpercentage = firstProvider.decemberpercentage;
        //        sharedItem.decembereffectiveDate = formatDate(firstProvider.decembereffectiveDate);

        //        $scope.ViewCapitationLineitemobj = sharedItem;

        //    } else {
        //        // TRUE — load each provider row
        //        angular.forEach(selectedItem.PayorBillingProvider, function (provider) {
        //            var lineItem = GetCapitationLineitemData();

        //            lineItem.RenderingProviderId = provider.RenderingProviderId;
        //            lineItem.RenderingProviderName = provider.RenderingProviderName;
        //            lineItem.BillingProviderId = provider.BillingProviderId;
        //            lineItem.BillingProviderName = provider.BillingProviderName;
        //            lineItem.DeleteInd = provider.DeleteInd === "Y" ? "Y" : "N";

        //            lineItem.januarypercentage = provider.januarypercentage;
        //            lineItem.januaryeffectiveDate = formatDate(provider.januaryeffectiveDate);
        //            lineItem.februarypercentage = provider.februarypercentage;
        //            lineItem.februaryeffectiveDate = formatDate(provider.februaryeffectiveDate);
        //            lineItem.marchpercentage = provider.marchpercentage;
        //            lineItem.marcheffectiveDate = formatDate(provider.marcheffectiveDate);
        //            lineItem.aprilpercentage = provider.aprilpercentage;
        //            lineItem.aprileffectiveDate = formatDate(provider.aprileffectiveDate);
        //            lineItem.maypercentage = provider.maypercentage;
        //            lineItem.mayeffectiveDate = formatDate(provider.mayeffectiveDate);
        //            lineItem.junepercentage = provider.junepercentage;
        //            lineItem.juneeffectiveDate = formatDate(provider.juneeffectiveDate);
        //            lineItem.julypercentage = provider.julypercentage;
        //            lineItem.julyeffectiveDate = formatDate(provider.julyeffectiveDate);
        //            lineItem.augustpercentage = provider.augustpercentage;
        //            lineItem.augusteffectiveDate = formatDate(provider.augusteffectiveDate);
        //            lineItem.septemberpercentage = provider.septemberpercentage;
        //            lineItem.septembereffectiveDate = formatDate(provider.septembereffectiveDate);
        //            lineItem.octoberpercentage = provider.octoberpercentage;
        //            lineItem.octobereffectiveDate = formatDate(provider.octobereffectiveDate);
        //            lineItem.novemberpercentage = provider.novemberpercentage;
        //            lineItem.novembereffectiveDate = formatDate(provider.novembereffectiveDate);
        //            lineItem.decemberpercentage = provider.decemberpercentage;
        //            lineItem.decembereffectiveDate = formatDate(provider.decembereffectiveDate);

        //            viewObj.BillingProviders.push(lineItem);
        //        });
        //    }
        //}

        //$scope.Capitationobj = viewObj;
        $scope.Subtab = 3;
    };

    $scope.CapitationFilterPopover = {
        templateUrl: 'CapitationFilterPopover.html',
    };
    $scope.closeFilterPopover = function () {
        angular.element(document.querySelector('.popover')).remove();
    };
    $scope.ChangeInsurancePayor = function (obj) {

        
        $scope.EOBSearchObj.PayorId = obj.PayorId;
    }
    $scope.autoBindEffectiveDate = function (currentItem, month) {
        var percentageKey = month + 'percentage';
        var effectiveDateKey = month + 'effectiveDate';

        if (currentItem[percentageKey]) {
            var sourceItem = $scope.Capitationobj.BillingProviders.find(function (provider) {
                return provider.DeleteInd === 'N'
                    && provider !== currentItem
                    && provider[effectiveDateKey];
            });

            if (sourceItem) {
                currentItem[effectiveDateKey] = sourceItem[effectiveDateKey];
            }
        } else {
            currentItem[effectiveDateKey] = null;
        }
    };
}]);
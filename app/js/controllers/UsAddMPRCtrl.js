

"use strict";
eHnoteWebApp.controller("UsAddMPRCtrl", ["$scope", "$rootScope", "$location", "$filter", "alertify", "eHnoteMasterDataService", "eHnoteLoginStatusService", "localStorageFactory", "eHnoteUserAppointmentDataService", "$q", "eHnoteProcedureDataService", "eHnoteSettingsDataService",
    function ($scope, $rootScope, $location, $filter, alertify, eHnoteMasterDataService, eHnoteLoginStatusService, localStorageFactory, eHnoteUserAppointmentDataService, $q, eHnoteProcedureDataService, eHnoteSettingsDataService) {

        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
        $scope.userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
        $scope.ParenthospitalId = 0;
        $scope.HospitalId = 0;
        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
            $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
        };

        $scope.addedNewProcedure = false;
        $scope.addNewProcedure = function () {
            $scope.addedNewProcedure = true;
        };
        $scope.AllUserBranchesList = [];
        var BrachesList = [];
        function getMainOrganizationProcedureObj() {
            var obj = {
                "UserId": $scope.UserId,
                "OrganizationProcedureId": 0,
                "ProcedureId": 0,   //CPTCode Id
                "TypeOfServiceId": 0,  // Type of procedure id
                "OrganizationId": $scope.HospitalId,
                "ProcedureCode": "",
                "ProcedurePayorPlanId": "",
                "ProcedurePayorPlanName": "",
                "ProcedureName": "",
                "ProcedureDescription": "",
                "Notes": "",
                "ModifierId": 0,
                "IsFrequent": false,
                "CliaIDRequired": false,
                "MamographyCertificateRequired": false,
                "RefferingProviderRequired": false,
                "PatientRecall": false,
                "PatientRecallDays": "",
                "SlidingScaleRequired": false,
                "SlidingScaleAmount": "",
                "ApplyGlobalPeriod": false,
                "ApplyGlobalPeriodDays": "",
                "NDCCode": "",
                "RevenueCode": "",
                "UnitValue": "",
                "AnesthesiaValue": "",
                "GeneralCost": "",
                "IsActive": true,
                "DeleteInd": "N",
                "GetAllIndicator": 0,
                "ParentOrganizationId": $scope.ParenthospitalId,
                "BranchObj": $filter("filter")($scope.AllUserBranchesList, { "ClinicId": 0 }, true)[0],
                "CPTCodeProcedureObj": "",
                "ModifierObj": ""
            };

            return obj;
        }
        $scope.MainOrganizationProcedureObj = getMainOrganizationProcedureObj();

        function getDoctorsbySubSpecializations(branchId) {

            console.log(branchId);
            var branchesList = [];
            $scope.clinicDoctorList = [];
            $scope.allUserList = [];
            $scope.selectedDoctor = "";
            if (branchId === 0) {
                var TempAppListdoctoraddress = $filter("filter")(BrachesList, function (iterator, ind) { return iterator.ClinicId !== 0; });
                var hospitalID = _.pluck(TempAppListdoctoraddress, "BranchId").join(",");

                angular.forEach(TempAppListdoctoraddress, function (items) {
                    branchesList.push(items.BranchId);
                });
            } else {


                var TempAppListdoctoraddress = $filter("filter")(BrachesList, function (iterator, ind) { return iterator.ClinicId === branchId; });
                var hospitalID = _.pluck(TempAppListdoctoraddress, "BranchId").join(",");
                angular.forEach(TempAppListdoctoraddress, function (items) {
                    branchesList.push(items.BranchId);
                });
            }




            var listSubSplArray = $filter("filter")($scope.allSubSpecializationsArray, function (iterator, ind) { return iterator.isChecked === true; });
            var subSplArray = _.pluck(listSubSplArray, "SubSpecializationId").join(",");

            var reqObj = {
                "BranchId": hospitalID,
                "SubSpecializationIdArray": subSplArray
            }


            eHnoteMainAppointmentService.getAllUsersByDepartmentId(reqObj, onGetUsersSuccess, onGetUsersFailure);
            function onGetUsersSuccess(resp) {
                console.log(resp);
                if (resp.rows.length > 0) {
                    $scope.allUserList = resp.rows;

                    $scope.clinicDoctorAllList = angular.copy($scope.allUserList);
                    $scope.clinicDoctorList = [];



                    angular.forEach($scope.clinicDoctorAllList, function (Aitem) {
                        // angular.forEach(Aitem.UserBranchRoles, function (item) {
                        if (Aitem.RoleId === 1 || Aitem.RoleId === 3 || Aitem.RoleId === 4 || Aitem.RoleId === 43 || Aitem.RoleId === 16 || Aitem.RoleId === 56 || Aitem.RoleId === 57) {
                            //if ($scope.selectedBranch.ClinicId === 0) {
                            //    $scope.clinicDoctorList.push(Aitem);
                            //} else {
                            //    if (item.BranchId === $scope.selectedBranch.ClinicId) {
                            //        $scope.clinicDoctorList.push(Aitem);
                            //    }
                            //}
                            $scope.clinicDoctorList.push(Aitem);


                        }

                        //});
                    });
                    $scope.clinicDoctorList = _.uniq($scope.clinicDoctorList, false, function (p) { return p.DoctorID; });
                    var docAll = { "DoctorID": 0, "FullName": "All Doctors", "AddressID": 0, "MinPerCase": 15 };
                    $scope.clinicDoctorList.unshift(docAll);

                    var RoleID = $scope.userLoginDetails.RoleID;


                    $scope.AllUserBranchesList = BrachesList;

                    $scope.OnlyAllBranchesList = angular.copy(BrachesList);


                    angular.forEach($scope.OnlyAllBranchesList, function (item, mindex) {
                        if (item.ClinicId === 0) {
                            $scope.OnlyAllBranchesList.splice(mindex, 1)
                        }
                    });


                    $scope.masterProcedureObj.HospitalObj = $scope.AllUserBranchesList[0];
                    $scope.masterProcedureObj.HospitalId = $scope.AllUserBranchesList[0].ClinicId;
                    $scope.masterProcedureObj.AllHospitalsIndicator = 1;
                    $scope.masterMedicineObject.HospitalObj = $scope.AllUserBranchesList[0];

                } else {
                    alertify.error("No Users Found in Selected Departments");
                    $scope.mainBookedAppointmentList = [];
                }


            }

            function onGetUsersFailure(data) {
            }
        }
        function GetBranchSubSpecializations(SubOrganizationId, BranchId) {

            eHnoteMainAppointmentService.getBranchSubSpecializationsById(SubOrganizationId, BranchId).then(function (resp) {
                if (resp.data.row.length > 0) {
                    $scope.allSubSpecializationsArray = resp.data.row;
                    angular.forEach($scope.allSubSpecializationsArray, function (item) {
                        item.isChecked = true;
                    });
                    console.log($scope.allSubSpecializationsArray);
                    getDoctorsbySubSpecializations(BranchId);
                } else {
                    $scope.allSubSpecializationsArray = [];
                    $scope.clinicDoctorList = [];
                    $scope.allUserList = [];
                    $scope.selectedDoctor = "";
                    alertify.error("No Departments are been added");
                }


            });
        };
        function initializeNewBranches(data) {

            BrachesList = []

            BrachesList = eHnoteUserAppointmentDataService.RestructureNewBranches(true, data, doctorinfo) || [];



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
                "CommunicationMobileNo": ""
            };
            BrachesList.unshift(EmptyClinicObj);

            $scope.BranchesListArray = BrachesList;
            $scope.selectedBranch = $scope.BranchesListArray[0];
            $scope.AppListselectedclinic = $scope.BranchesListArray[0];

            $scope.MainSettingObj.BranchesArray = angular.copy($scope.BranchesListArray) || [];


            var RoleID = $scope.userLoginDetails.RoleID;

            if (RoleID !== 1 && RoleID !== 56) {

                $scope.clinicDoctorList = [];
                $scope.AppListdoctoraddress = BrachesList;

                $scope.defaultbranch = $filter("filter")($scope.BranchesListArray, function (item) {
                    return item.BranchId === doctorinfo.doctordata.UserAddress[0].ClinicId;
                });

                $scope.selectedBranch = $scope.defaultbranch[0];
                $scope.AppListselectedclinic = $scope.defaultbranch[0];
            }
            if ($scope.selectedBranch.BranchId === 0) {
                if (doctorinfo.doctordata.UserAddress[0].SubOrganizationId) {
                    $scope.selectedBranch.SubOrganizationId = doctorinfo.doctordata.UserAddress[0].SubOrganizationId;
                    $scope.AppListselectedclinic.SubOrganizationId = doctorinfo.doctordata.UserAddress[0].SubOrganizationId;
                }
            }
            $scope.AllUserBranchesList = [];
            $scope.AllUserBranchesList = BrachesList;

            $scope.OnlyAllBranchesList = angular.copy(BrachesList);


            angular.forEach($scope.OnlyAllBranchesList, function (item, mindex) {
                if (item.ClinicId === 0) {
                    $scope.OnlyAllBranchesList.splice(mindex, 1)
                }

            });


            $scope.masterProcedureObj.HospitalObj = $scope.AllUserBranchesList[0];
            $scope.masterProcedureObj.HospitalId = $scope.AllUserBranchesList[0].ClinicId;
            $scope.masterProcedureObj.AllHospitalsIndicator = 1;
            $scope.masterMedicineObject.HospitalObj = $scope.AllUserBranchesList[0];
            //GetBranchSubSpecializations($scope.selectedBranch.SubOrganizationId, $scope.selectedBranch.BranchId);

            $scope.defaultbranch = $filter("filter")($scope.OnlyAllBranchesList, function (item) {
                return item.ClinicId === doctorinfo.doctordata.UserAddress[0].ClinicId;
            });
            $scope.BranchSurgeryListObj = $scope.defaultbranch[0];
            $scope.surgeryOrgGetAllInd = 0;
            $scope.BranchContactListObj = $scope.defaultbranch[0];
            $scope.GetAllIndictaor = 0;
        }

        function getOrgProcedureObj() {
            var obj = {
                "OrganizationId": $scope.HospitalId,
                "ProcedureId": 0,
                "CPTCODE": "",  // cptcode tblorganizationprocedure
                "SearchText": "", // searchtext
                "ServicesTypeId": 0,
                "ProcedurePayorPlanId": 0,
                "PageNumber": 1,
                "PageSize": 10,
                "TempCount": 1,
                "BranchObj": $filter("filter")($scope.AllUserBranchesList, { "ClinicId": 0 }, true)[0]
            };
            return obj;
        };
        $scope.GetOrganizationProcedureObj = getOrgProcedureObj();

        $scope.GetOrganizationProcedure = function (pagenumber) {
            if (pagenumber == 1) {
                $scope.GetOrganizationProcedureObj.PageNumber = 1;
            }
            var obj = {
                "OrganizationId": $scope.GetOrganizationProcedureObj.OrganizationId,
                "ProcedureId": 0,
                "CPTCODE": $scope.GetOrganizationProcedureObj.CPTCODE || "",  // cptcode tblorganizationprocedure
                "SearchText": $scope.GetOrganizationProcedureObj.SearchText || "", // searchtext
                "TypeOfServiceId": $scope.GetOrganizationProcedureObj.ServicesTypeId || 0,
                "ProcedurePayorPlanId": $scope.GetOrganizationProcedureObj.ProcedurePayorPlanId || 0,
                "PageNumber": $scope.GetOrganizationProcedureObj.PageNumber || 1,
                "PageSize": $scope.GetOrganizationProcedureObj.PageSize || 10,
                "GetAllIndicator": 0,
                "ParentOrganizationId": $scope.ParenthospitalId,
                "IsFrequent": "N",
                "Status": 0 // All - 0, Active - 1, InActive -2
            };

            if ($scope.GetOrganizationProcedureObj.OrganizationId == 0) {
                obj.GetAllIndicator = 1;
            } else if ($scope.GetOrganizationProcedureObj.OrganizationId != 0) {
                obj.GetAllIndicator = 0;
            }


            eHnoteSettingsDataService.GetOrganizationProcedures(obj).then(function (response) {
                console.log(response);
                if (response.data.Status == "Success") {
                    $scope.GetOrganizationProcedureList = response.data.rows || [];
                    $scope.GetOrganizationProcedureObj.TempCount = response.data.count;
                    if ($scope.GetOrganizationProcedureList.length > 0) {
                        angular.forEach($scope.GetOrganizationProcedureList, function (item) {
                            if (item.IsFrequent == 'Y') {
                                item.IsFrequentInd = true;
                            }
                            else {
                                item.IsFrequentInd = false;
                            }
                        });
                    }
                }

            }, function (error) {
                console.log(error);

            });
        };

        $scope.init = function () {
            if ($scope.userLoginDetails.RoleID === 1) {
                if (doctorinfo !== null && doctorinfo.doctordata !== null) {
                    if (doctorinfo.doctordata.UserAddress !== null) {
                        var AllUserBranchesList = doctorinfo.doctordata.UserAddress;
                        for (var i = 0; i < AllUserBranchesList.length; i++) {
                            if (AllUserBranchesList[i].Active === "Y") {
                                BrachesList.push(AllUserBranchesList[i]);
                            }
                        }
                    }
                }
                $scope.BranchDoctorsList = [];
                var countryCode = "";
                if (doctorinfo.doctordata.UserPhone !== undefined) {
                    countryCode = doctorinfo.doctordata.UserPhone[0].PhCntryCD;
                }
                var clinicObj = {
                    "FullName": doctorinfo.doctordata.User[0].FullName,
                    "DoctorID": doctorinfo.doctordata.User[0].DoctorID,
                    "EmailId": doctorinfo.doctordata.UserEmail[0].EmailID,
                    "MobileNo": doctorinfo.doctordata.UserAddress[0].MobileNo,
                    "CountryCode": countryCode,
                    "Gender": doctorinfo.doctordata.User[0].Gender,
                    "UserBranchId": doctorinfo.doctordata.UserAddress[0].UserBranchId,
                    "Active": "Y",
                    "SpecializationId": doctorinfo.doctordata.User[0].SpecializationId,
                    "MinPerCase": doctorinfo.doctordata.UserAddress[0].ExtDetails.MinPerCase,
                    "RoleId": doctorinfo.doctordata.UserAddress[0].ExtDetails.RoleID,
                    "ClinicName": doctorinfo.doctordata.UserAddress[0].ClinicName,
                    "BranchEmail": doctorinfo.doctordata.UserAddress[0].BranchEmail
                };
                $scope.BranchDoctorsList.push(clinicObj);


                var data = localStorageFactory.getItem("allBranchesData") || [];
                initializeNewBranches(data);

            } else {

                var data = localStorageFactory.getItem("allBranchesData") || [];
                initializeNewBranches(data);
            }

      

        }




        $scope.init();


        $scope.onSelectCptCodeProcedure = function (Obj, MainObj) {
            if (Obj != undefined) {
                $scope.MainOrganizationProcedureObj.ProcedureId = Obj.ProcedureId;
                $scope.MainOrganizationProcedureObj.TypeOfServiceId = Obj.ServicesTypeId;
                $scope.MainOrganizationProcedureObj.ProcedureCode = Obj.CPTCode;
                $scope.MainOrganizationProcedureObj.ProcedureName = Obj.ProcedureName;
            }
        };
        $scope.ChangeCptCodeProcedure = function (MainObj) {
            $scope.MainOrganizationProcedureObj.ProcedureId = 0;
            $scope.MainOrganizationProcedureObj.TypeOfServiceId = 0;
            $scope.MainOrganizationProcedureObj.ProcedureCode = "";
            $scope.NewCPTObj.CPTCode = MainObj.CPTCodeProcedureObj;
        };
        $scope.LostSettingsFocus = function () {
            $scope.referralFocus = false;
            $scope.promoCodesFocus = false;
            $scope.proceduresFocus = false;
            $scope.facilityFocus = false;
            $scope.chiefComplaintsFocus = false;
            $scope.birthFocus = false;
            $scope.birthFocus = false;
            $scope.birthFocus = false;
            $scope.familyFocus = false;
            $scope.nutritionalFocus = false;
            $scope.surgicalFocus = false;
            $scope.mensturalFocus = false;
            $scope.lifeStyleFocus = false;
            $scope.vaccinationFocus = false;
            $scope.systemicFocus = false;
            $scope.oculerFocus = false;
            $scope.functionalStatusFocus = false;
            $scope.oculerSurgicalFocus = false;
            $scope.currentSystemicFocus = false;
            $scope.diagnosisFocus = false;
            $scope.billingFocus = false;
            $scope.currentTreatmentFocus = false;
        };
        $scope.onSelectModifier = function (Obj, MainObj) {
            $scope.MainOrganizationProcedureObj.ModifierId = Obj.MODIFIERID;
        };
        $scope.ChangeModifier = function (Obj) {
            $scope.MainOrganizationProcedureObj.ModifierId = 0;
        };
        $scope.changePayorPlanType = function (id) {

            let filterStatus = $filter("filter")($scope.PayorProcedureTypes, { "ProcedurePayorPlanId": id }, true) || [];
            if (filterStatus.length > 0) {
                $scope.MainOrganizationProcedureObj.ProcedurePayorPlanName = filterStatus[0].ProcedurePayorPlanName;

                $scope.MainOrganizationProcedureObj.TypeOfServiceId = filterStatus[0].ProcedurePayorPlanId;
            }

        }

        $scope.MasterProcedurePagechanged = function (pagenumber) {
            $scope.GetOrganizationProcedureObj.PageNumber = pagenumber;
            $scope.GetOrganizationProcedure();
        };
        $scope.ChangesActiveStatusForProcedure = function (item, active) {
            var obj = {
                "UserId": $scope.UserId,
                "OrganizationId": item.OrganizationId,
                "OrganizationProcedureId": item.OrganizationProcedureId,
                "IsActive": active,
            };
            eHnoteSettingsDataService.UpdateActiveStatusForProcedures(obj).then(function (resp) {
                console.log(resp);
                if (resp.data.Status === "Success") {
                    item.IsActive = active;
                    $scope.GetOrganizationProcedure();
                }
            }, function (error) {
                console.log(error);
            });
        }

        $scope.editMasterTreatItem1 = function (item, index) {
            $scope.proceduresFocus = true;
            $scope.addedNewProcedure = true;
            $scope.MainOrganizationProcedureObj.TypeOfServiceId = item.TypeOfServiceId;
            $scope.MainOrganizationProcedureObj.ProcedureCode = item.ProcedureCode;
            $scope.MainOrganizationProcedureObj.ProcedureName = item.ProcedureName;
            $scope.MainOrganizationProcedureObj.ProcedureDescription = item.ProcedureDescription || "";
            $scope.MainOrganizationProcedureObj.GeneralCost = item.GeneralCost || "";
            $scope.MainOrganizationProcedureObj.ModifierObj = item.ModifierName || "";
            $scope.MainOrganizationProcedureObj.ModifierId = item.ModifierId || 0;
            $scope.MainOrganizationProcedureObj.RevenueCode = item.RevenueCode || "";
            $scope.MainOrganizationProcedureObj.UnitValue = item.UnitValue || "";
            $scope.MainOrganizationProcedureObj.AnesthesiaValue = item.AnesthesiaValue || "";
            $scope.MainOrganizationProcedureObj.NDCCode = item.NDCCode || "";
            $scope.MainOrganizationProcedureObj.OrganizationProcedureId = item.OrganizationProcedureId || "";
            $scope.MainOrganizationProcedureObj.ProcedureId = item.ProcedureId || "";
            $scope.MainOrganizationProcedureObj.ProcedurePayorPlanId = item.ProcedurePayorPlanId || "";
            $scope.MainOrganizationProcedureObj.ProcedurePayorPlanName = item.ProcedurePayorPlanName || "";

            $scope.MainOrganizationProcedureObj.CPTCodeProcedureObj = {
                "ProcedureName": item.CPTCodeProcedureName,
                "CPTCode": item.CPTCode
            }

            //$scope.MainOrganizationProcedureObj.IsFrequent = item.IsFrequent;

            if (item.IsFrequent == "Y") {
                $scope.MainOrganizationProcedureObj.IsFrequent = true;
            } else {
                $scope.MainOrganizationProcedureObj.IsFrequent = false;
            }

            $scope.MainOrganizationProcedureObj.MamographyCertificateRequired = item.MamographyCertificateRequired;
            $scope.MainOrganizationProcedureObj.RefferingProviderRequired = item.RefferingProviderRequired;
            $scope.MainOrganizationProcedureObj.CliaIDRequired = item.CliaIDRequired;
            $scope.MainOrganizationProcedureObj.PatientRecall = item.PatientRecall;
            $scope.MainOrganizationProcedureObj.PatientRecallDays = item.PatientRecallDays || "";
            $scope.MainOrganizationProcedureObj.SlidingScaleRequired = item.SlidingScaleRequired;
            $scope.MainOrganizationProcedureObj.SlidingScaleAmount = item.SlidingScaleAmount || "";
            $scope.MainOrganizationProcedureObj.ApplyGlobalPeriod = item.ApplyGlobalPeriod;
            $scope.MainOrganizationProcedureObj.ApplyGlobalPeriodDays = item.ApplyGlobalPeriodDays || "";
            $scope.MainOrganizationProcedureObj.Notes = item.Notes || "";
            $scope.MainOrganizationProcedureObj.IsActive = item.IsActive;

        };

        $scope.ChangeProcedureFrequentStatus = function (item, ind) {
            if (ind == true) {
                var Frequentval = "Y"
            } else {
                var Frequentval = "N"
            }
            var obj = {
                "UserId": $scope.UserId,
                "OrganizationId": item.OrganizationId,
                "OrganizationProcedureId": item.OrganizationProcedureId,
                "ProcedureId": item.ProcedureId,
                "IsFrequent": Frequentval
            };
            eHnoteSettingsDataService.UpdateProcedureIsFrequentStatusById(obj).then(function (resp) {
                if (resp.data.status === "Success") {
                    alertify.success("IsFrequent Updated successfully");
                    $scope.GetOrganizationProcedure();
                }
            }, function (error) {

            });
        }

        $scope.ClearOrganizationProcedure = function () {
            $scope.GetOrganizationProcedureObj = getOrgProcedureObj();
            $scope.GetOrganizationProcedure(1);
        }

       
      

   
      $scope.MPRRankList = [
            { RankId: 1, RankName: "1st Procedure (100%)" },
            { RankId: 2, RankName: "2nd Procedure (50%)" },
            { RankId: 3, RankName: "3rd Procedure (50%)" },
            { RankId: 4, RankName: "4th Procedure (50%)" },
            { RankId: 5, RankName: "5th+ Procedure (50%)" }
        ];

        /* ── Blank MPR object factory ─────────────────────────────────────────── */
        $scope.GetMPRObj = function () {
            return {
                MPRCodeId: 0,
                OrganizationId: 0,
                ParentOrganizationId: $scope.ParentHospitalID || 0,
                ProcedureId: 0,
                OrganizationProcedureId: 0,
                CPTCode: "",
                ProcedureCode: "",
                ProcedureName: "",
                ProcedureDescription: "",
                Procedureobj: "",
                ModifierCode: "",
                ModifierObj: "",
                RankId: null,
                ReductionPercentage: null,
                ApplyToOfficeFee: true,
                ApplyToFacilityFee: true,
                ApplyToAnesthesia: false,
                EffectiveFrom: "",
                EffectiveTo: "",
                Notes: "",
                DeleteInd: "N"
            };
        };

        /* ── Search object factory ────────────────────────────────────────────── */
        $scope.GetMPRSearchObj = function () {
            return {
                SearchText: "",
                RankId: "",
                LocationId: "",
                PageNumber: 1,
                PageSize: 10
            };
        };

        /* ── State ────────────────────────────────────────────────────────────── */
        $scope.MPRObj = angular.copy($scope.GetMPRObj());
        $scope.MPRSearchObj = angular.copy($scope.GetMPRSearchObj());
        $scope.MPRList = [];
        $scope.MPRListCount = 0;
        $scope.IsShowMPRForm = false;

        /* ── Init tab ─────────────────────────────────────────────────────────── */
        $scope.InitMPRTab = function () {
            $scope.MPRObj = angular.copy($scope.GetMPRObj());
            $scope.MPRSearchObj = angular.copy($scope.GetMPRSearchObj());
            $scope.IsShowMPRForm = false;
            $scope.GetMPRList();
        };

        /* ── Load list ────────────────────────────────────────────────────────── */
        $scope.GetMPRList = function () {

            var locationIds = "";
            if ($scope.MPRSearchObj.LocationId) {
                locationIds = $scope.MPRSearchObj.LocationId.toString();
            } else {
                locationIds = $scope.filterLocationslist
                    .filter(function (p) { return p.ClinicId !== 0; })
                    .map(function (p) { return p.ClinicId; })
                    .join(",");
            }

            var req = {
                OrganizationId: locationIds,
                ParentOrganizationId: $scope.ParentHospitalID || 0,
                SearchText: $scope.MPRSearchObj.SearchText || "",
                RankId: $scope.MPRSearchObj.RankId || 0,
                PageNumber: $scope.MPRSearchObj.PageNumber || 1,
                PageSize: $scope.MPRSearchObj.PageSize || 10
            };

            eHnoteSettingsDataService.GetMPRCodeList(req).then(function (resp) {
                if (resp.data.status === "Success") {
                    $scope.MPRList = resp.data.rows || [];
                    $scope.MPRListCount = resp.data.count || 0;
                } else {
                    $scope.MPRList = [];
                    $scope.MPRListCount = 0;
                }
            }, function (err) {
                alertify.error("Failed to load MPR codes");
                console.error(err);
            });
        };

        /* ── Pagination ───────────────────────────────────────────────────────── */
        $scope.SwitchMPRPage = function (pageNo) {
            $scope.MPRSearchObj.PageNumber = pageNo;
            $scope.GetMPRList();
        };

        /* ── Search helpers ───────────────────────────────────────────────────── */
        $scope.ClearMPRSearch = function () {
            $scope.MPRSearchObj = angular.copy($scope.GetMPRSearchObj());
            $scope.GetMPRList();
        };

        /* ── Form open / close ────────────────────────────────────────────────── */
        $scope.OpenAddMPR = function () {
            $scope.MPRObj = angular.copy($scope.GetMPRObj());
            $scope.IsShowMPRForm = true;
        };

        $scope.CancelMPRForm = function () {
            $scope.IsShowMPRForm = false;
            $scope.MPRObj = angular.copy($scope.GetMPRObj());
        };

        $scope.ClearMPRForm = function () {
            $scope.MPRObj = angular.copy($scope.GetMPRObj());
        };

        /* ── Typeahead callbacks ──────────────────────────────────────────────── */
        $scope.OnSelectMPRCpt = function (item) {
            item = item || null;
            if (!item) return;
            $scope.MPRObj.ProcedureId = item.ProcedureId || 0;
            $scope.MPRObj.OrganizationProcedureId = item.OrganizationProcedureId || 0;
            $scope.MPRObj.CPTCode = item.CPTCode || "";
            $scope.MPRObj.ProcedureCode = item.ProcedureCode || "";
            $scope.MPRObj.ProcedureName = item.ProcedureName || "";
            $scope.MPRObj.ProcedureDescription = item.ProcedureDescription || "";
        };

        $scope.OnSelectMPRModifier = function (item) {
            item = item || null;
            if (!item) return;
            $scope.MPRObj.ModifierCode = item.ModifierCode || "";
        };

        /* ── Validation helper ────────────────────────────────────────────────── */
        function _validateMPR() {
            if (!$scope.MPRObj.OrganizationId) {
                alertify.error("Please select a Location"); return false;
            }
            if (!$scope.MPRObj.ProcedureId) {
                alertify.error("Please select a CPT Code"); return false;
            }
            if ($scope.MPRObj.RankId === null || $scope.MPRObj.RankId === undefined || $scope.MPRObj.RankId === "") {
                alertify.error("Please select a Rank"); return false;
            }
            if ($scope.MPRObj.ReductionPercentage === null ||
                $scope.MPRObj.ReductionPercentage === "" ||
                isNaN($scope.MPRObj.ReductionPercentage)) {
                alertify.error("Please enter a Reduction %"); return false;
            }
            var pct = parseFloat($scope.MPRObj.ReductionPercentage);
            if (pct < 0 || pct > 100) {
                alertify.error("Reduction % must be between 0 and 100"); return false;
            }
            if (!$scope.MPRObj.EffectiveFrom) {
                alertify.error("Please select an Effective Date"); return false;
            }
            if (!$scope.MPRObj.EffectiveTo) {
                alertify.error("Please select an End Date"); return false;
            }
            if (!$scope.MPRObj.ApplyToOfficeFee &&
                !$scope.MPRObj.ApplyToFacilityFee &&
                !$scope.MPRObj.ApplyToAnesthesia) {
                alertify.error("Please select at least one 'Apply To' option"); return false;
            }
            return true;
        }

        /* ── Save / Update ────────────────────────────────────────────────────── */
        $scope.SaveMPRCode = function () {

            if (!_validateMPR()) return;

            var obj = {
                UserId: $scope.UserId,
                MPRCodeId: $scope.MPRObj.MPRCodeId || 0,
                OrganizationId: $scope.MPRObj.OrganizationId || 0,
                ParentOrganizationId: $scope.ParentHospitalID || 0,
                ProcedureId: $scope.MPRObj.ProcedureId || 0,
                OrganizationProcedureId: $scope.MPRObj.OrganizationProcedureId || 0,
                CPTCode: $scope.MPRObj.CPTCode,
                ProcedureCode: $scope.MPRObj.ProcedureCode,
                ProcedureName: $scope.MPRObj.ProcedureName,
                ProcedureDescription: $scope.MPRObj.ProcedureDescription,
                ModifierCode: $scope.MPRObj.ModifierCode,
                RankId: $scope.MPRObj.RankId,
                ReductionPercentage: parseFloat($scope.MPRObj.ReductionPercentage),
                ApplyToOfficeFee: !!$scope.MPRObj.ApplyToOfficeFee,
                ApplyToFacilityFee: !!$scope.MPRObj.ApplyToFacilityFee,
                ApplyToAnesthesia: !!$scope.MPRObj.ApplyToAnesthesia,
                EffectiveFrom: $scope.MPRObj.EffectiveFrom,
                EffectiveTo: $scope.MPRObj.EffectiveTo,
                Notes: $scope.MPRObj.Notes || "",
                DeleteInd: "N"
            };

            eHnoteSettingsDataService.AddUpdateMPRCode(obj).then(function (resp) {
                var data = resp.data || resp;
                if (data.Status === "Success" || data.status === "Success") {
                    alertify.success(
                        $scope.MPRObj.MPRCodeId === 0
                            ? "MPR code added successfully"
                            : "MPR code updated successfully"
                    );
                    $scope.CancelMPRForm();
                    $scope.GetMPRList();
                } else {
                    alertify.error(data.Message || "Save failed");
                }
            }, function (err) {
                alertify.error("Failed to save MPR code");
                console.error(err);
            });
        };

        /* ── Edit ─────────────────────────────────────────────────────────────── */
        $scope.EditMPRCode = function (item) {

            $scope.MPRObj = angular.copy($scope.GetMPRObj());

            $scope.MPRObj.MPRCodeId = item.MPRCodeId || 0;
            $scope.MPRObj.OrganizationId = item.OrganizationId;
            $scope.MPRObj.ProcedureId = item.ProcedureId;
            $scope.MPRObj.OrganizationProcedureId = item.OrganizationProcedureId || 0;
            $scope.MPRObj.CPTCode = item.CPTCode;
            $scope.MPRObj.ProcedureCode = item.ProcedureCode;
            $scope.MPRObj.ProcedureName = item.ProcedureName;
            $scope.MPRObj.ProcedureDescription = item.ProcedureDescription;
            $scope.MPRObj.Procedureobj = item.CPTCode + " - " + item.ProcedureName;
            $scope.MPRObj.ModifierCode = item.ModifierCode;
            $scope.MPRObj.RankId = item.RankId;
            $scope.MPRObj.ReductionPercentage = item.ReductionPercentage;
            $scope.MPRObj.ApplyToOfficeFee = item.ApplyToOfficeFee;
            $scope.MPRObj.ApplyToFacilityFee = item.ApplyToFacilityFee;
            $scope.MPRObj.ApplyToAnesthesia = item.ApplyToAnesthesia;
            $scope.MPRObj.EffectiveFrom = $filter('date')(item.EffectiveFrom, "MM-dd-yyyy");
            $scope.MPRObj.EffectiveTo = $filter('date')(item.EffectiveTo, "MM-dd-yyyy");
            $scope.MPRObj.Notes = item.Notes;

            /* populate modifier display name */
            if (item.ModifierCode) {
                var modMatch = $filter("filter")($scope.masterModifierList,
                    { ModifierCode: item.ModifierCode }, true);
                if (modMatch.length > 0) {
                    $scope.MPRObj.ModifierObj = modMatch[0].ModifierName;
                }
            }

            $scope.IsShowMPRForm = true;

            /* smooth-scroll form into view */
            $timeout(function () {
                var el = document.querySelector(".section__style--4");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
        };

        /* ── Delete ───────────────────────────────────────────────────────────── */
        $scope.DeleteMPRCode = function (item) {
            alertify.confirm(
                "<b class='txt-centre'>Confirm!</b>" +
                "<h4 class='txt-body-centre'>Are you sure you want to delete this MPR code?</h4>",
                function () {
                    var obj = {
                        UserId: $scope.UserId,
                        MPRCodeId: item.MPRCodeId,
                        OrganizationId: item.OrganizationId,
                        ParentOrganizationId: $scope.ParentHospitalID || 0,
                        DeleteInd: "Y"
                    };
                    eHnoteSettingsDataService.AddUpdateMPRCode(obj).then(function (resp) {
                        var data = resp.data || resp;
                        if (data.Status === "Success" || data.status === "Success") {
                            alertify.success("MPR code deleted successfully");
                            $scope.GetMPRList();
                        } else {
                            alertify.error(data.Message || "Delete failed");
                        }
                    }, function (err) {
                        alertify.error("Failed to delete MPR code");
                        console.error(err);
                    });
                }
            );
        };

        /* ── Export to Excel ──────────────────────────────────────────────────── */
        $scope.ExportMPRToExcel = function () {

            if (!$scope.MPRList || !$scope.MPRList.length) {
                alertify.error("No data available to export!");
                return;
            }

            $scope.ShowRecordSaving = true;

            var data = angular.copy($scope.MPRList);

            data.forEach(function (item) {
                item.LocationName = (($scope.Locationslist || [])
                    .find(function (l) { return l.ClinicId === item.OrganizationId; }) || {}).ClinicName || "";

                item.RankName = (($scope.MPRRankList || [])
                    .find(function (r) { return r.RankId === item.RankId; }) || {}).RankName || "";

                item.ApplyToDisplay = [
                    item.ApplyToOfficeFee ? "Office" : "",
                    item.ApplyToFacilityFee ? "Facility" : "",
                    item.ApplyToAnesthesia ? "Anesthesia" : ""
                ].filter(Boolean).join(", ");

                item.EffectiveFrom = $filter('date')(item.EffectiveFrom, "MM-dd-yyyy") || "";
                item.EffectiveTo = $filter('date')(item.EffectiveTo, "MM-dd-yyyy") || "";
            });

            var exportData = data.map(function (item) {
                return {
                    "Location": item.LocationName,
                    "CPT Code": item.CPTCode,
                    "Procedure Code": item.ProcedureCode,
                    "Description": item.ProcedureName,
                    "Rank": item.RankName,
                    "Reduction %": item.ReductionPercentage,
                    "Modifier": item.ModifierCode,
                    "Apply To": item.ApplyToDisplay,
                    "Effective Date": item.EffectiveFrom,
                    "End Date": item.EffectiveTo,
                    "Notes": item.Notes
                };
            });

            var ws = XLSX.utils.json_to_sheet(exportData);
            ws['!cols'] = Object.keys(exportData[0]).map(function (k) {
                return { wch: Math.max(k.length + 6, 14) };
            });

            /* Bold grey header row */
            var headerRange = XLSX.utils.decode_range(ws['!ref']);
            for (var C = headerRange.s.c; C <= headerRange.e.c; C++) {
                var cell = XLSX.utils.encode_cell({ r: 0, c: C });
                if (ws[cell]) {
                    ws[cell].s = {
                        font: { bold: true, color: { rgb: "000000" } },
                        fill: { fgColor: { rgb: "D9D9D9" } },
                        alignment: { horizontal: "center", vertical: "center" }
                    };
                }
            }

            $timeout(function () {
                $scope.ShowRecordSaving = false;
                $scope.$apply();
                var wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "MPR_Codes");
                XLSX.writeFile(wb, "MPR_Code_List.xlsx");
            }, 800);
        };


    }]);
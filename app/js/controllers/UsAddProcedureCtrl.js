

"use strict";
eHnoteWebApp.controller("UsAddProcedureCtrl", ["$scope", "$rootScope", "$location", "$filter", "alertify", "eHnoteMasterDataService", "eHnoteLoginStatusService", "localStorageFactory", "eHnoteUserAppointmentDataService", "$q", "eHnoteProcedureDataService", "eHnoteSettingsDataService","eHnotePatientAddressDataServices",
    function ($scope, $rootScope, $location, $filter, alertify, eHnoteMasterDataService, eHnoteLoginStatusService, localStorageFactory, eHnoteUserAppointmentDataService, $q, eHnoteProcedureDataService, eHnoteSettingsDataService, eHnotePatientAddressDataServices) {

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


            eHnoteSettingsDataService.GetOrganizationProceduresSearch(obj).then(function (response) {
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

        $scope.TOSCodeList = [];
 
      

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

            $q.all([
                eHnoteProcedureDataService.GetMasterProcedureType(),
                eHnoteSettingsDataService.GetMasterModifiers(),
                eHnotePatientAddressDataServices.GetOrganizationTOSCodes($scope.ParenthospitalId),
            ]).then(function (resp) {

                if (resp[0].data.rows.length > 0) {

                    $scope.TempProcedureList = [];
                    $scope.TempProcedureList = resp[0].data.rows;
                    $scope.ProcedureListTypes = [];
                    $scope.PayorProcedureTypes = resp[0].data.PayorPlanTypes || [];
                    angular.forEach($scope.TempProcedureList, function (item) {
                        if (item.Id === 1 || item.Id === 3) {
                            $scope.ProcedureListTypes.push(item);
                        }
                    });

                }

                if (resp[1].data.rows.length > 0) {

                    $scope.ModifierList = resp[1].data.rows || [];

                }
                if (resp[2].data.rows.length > 0) {                    
                    $scope.TOSCodeList = resp[2].data.rows || [];

                }

            });


            $scope.masterProceduresLevelType = "O";
            $scope.masterProceduresPageNumber = 1;
            $scope.FilterAllHospitalsIndicator = 0;
            $scope.OrgListObj = $scope.defaultbranch[0];
            $scope.FilterProcedureHospitalId = $scope.defaultbranch[0].ClinicId;
            $scope.GetOrganizationProcedureObj = getOrgProcedureObj();
            $scope.GetOrganizationProcedure();
            $scope.MainOrganizationProcedureObj = getMainOrganizationProcedureObj();

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

        $scope.addUpdateMasterProcClick = function () {

            $scope.MainOrganizationProcedureObj.ProcedureId = $scope.MainOrganizationProcedureObj.ProcedureId || 0;
            $scope.NewCPTObj.CPTCode = $scope.NewCPTObj.CPTCode || "";
            $scope.MainOrganizationProcedureObj.CPTCode = $scope.NewCPTObj.CPTCode;

            if ($scope.MainOrganizationProcedureObj.ProcedureId == 0 && $scope.NewCPTObj.CPTCode == '') {
                alertify.error("Please Select CPT Code");
                return false;
            }
            $scope.MainOrganizationProcedureObj.ProcedurePayorPlanId = $scope.MainOrganizationProcedureObj.ProcedurePayorPlanId || 0;
            if ($scope.MainOrganizationProcedureObj.ProcedurePayorPlanId == 0) {
                alertify.error("Please Select Procedure Type");
                return false;
            }
            $scope.MainOrganizationProcedureObj.ProcedureName = $scope.MainOrganizationProcedureObj.ProcedureName || "";
            if ($scope.MainOrganizationProcedureObj.ProcedureName === "") {
                alertify.error("Please Enter Procedure Name");
                return false;
            }
            $scope.MainOrganizationProcedureObj.ProcedureCode = $scope.MainOrganizationProcedureObj.ProcedureCode || "";
            if ($scope.MainOrganizationProcedureObj.ProcedureCode == "") {
                alertify.error("Please Enter Procedure Code");
                return false;
            }
            $scope.MainOrganizationProcedureObj.ProcedureName = $scope.MainOrganizationProcedureObj.ProcedureName || "";
            if ($scope.MainOrganizationProcedureObj.ProcedureName === "") {
                alertify.error("Please Enter Procedure Name");
                return false;
            }
            


            $scope.MainOrganizationProcedureObj.PatientRecallDays = parseInt($scope.MainOrganizationProcedureObj.PatientRecallDays) || 0;
            $scope.MainOrganizationProcedureObj.ApplyGlobalPeriodDays = parseInt($scope.MainOrganizationProcedureObj.ApplyGlobalPeriodDays) || 0;

            $scope.MainOrganizationProcedureObj.UnitValue = parseFloat($scope.MainOrganizationProcedureObj.UnitValue) || 0;
            $scope.MainOrganizationProcedureObj.AnesthesiaValue = parseFloat($scope.MainOrganizationProcedureObj.AnesthesiaValue) || 0;
            $scope.MainOrganizationProcedureObj.SlidingScaleAmount = parseFloat($scope.MainOrganizationProcedureObj.SlidingScaleAmount) || 0;
            $scope.MainOrganizationProcedureObj.GeneralCost = parseFloat($scope.MainOrganizationProcedureObj.GeneralCost) || 0;

            if ($scope.MainOrganizationProcedureObj.OrganizationId != 0) {
                $scope.MainOrganizationProcedureObj.GetAllIndicator = 0;
            }
            else if ($scope.MainOrganizationProcedureObj.OrganizationId == 0) {
                $scope.MainOrganizationProcedureObj.GetAllIndicator = 1;
            }

            if ($scope.MainOrganizationProcedureObj.IsFrequent == true) {
                $scope.MainOrganizationProcedureObj.IsFrequent = "Y";
            } else if ($scope.MainOrganizationProcedureObj.IsFrequent == false) {
                $scope.MainOrganizationProcedureObj.IsFrequent = "N";
            }

            eHnoteSettingsDataService.AddUpdateOrganizationProceduresNew($scope.MainOrganizationProcedureObj).success(function (response) {

                if (response.Status === 'Success') {
                    if ($scope.MainOrganizationProcedureObj.OrganizationProcedureId == 0) {
                        alertify.success('Procedure Added Successfully');
                    } else {
                        alertify.success('Procedure Updated Successfully');
                    }
                    $scope.MainOrganizationProcedureObj = getMainOrganizationProcedureObj();
                    $scope.GetOrganizationProcedure();
                }
                if (response.status === 'Failure') {
                    alertify.error(response.Message);
                }
            }).error(function (error) {
                alertify.error("Error Occured");
            });
        };
        $scope.CancelOrganProcedure = function () {
            $scope.MainOrganizationProcedureObj = getMainOrganizationProcedureObj();
        };

        $scope.closeNewProcedure = function () {
            $scope.MainOrganizationProcedureObj = getMainOrganizationProcedureObj();
            $scope.addedNewProcedure = false;
        };






    }]);
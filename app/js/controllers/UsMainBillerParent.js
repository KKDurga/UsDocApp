
"use strict";

eHnoteWebApp.controller("UsMainBillerParent", ["$scope", "eHnoteProcedureDataService", "$rootScope", "eHnotePatientDataService", "eHnoteMasterDataService", "$location", "alertify", "eHnotePrintService", "$filter", "eHnoteLoginStatusService", "$timeout", "$uibModal", "eHnoteCacheStorageService", "eHnoteSettingsDataService", "datapersistanceFactory", "eHnotePatientAddressDataServices", "localStorageFactory", "eHnoteSurgeryService", "HInventoryService", "eHnotePatientPVService", "eHnoteInsuranceService", "eHnoteUserAppointmentDataService", "eHnoteMainAppointmentService", "eHnoteAuditServices", "InventoryService", "$q", "eHnoteDiagnosisDataServices", "USPrintService", "eHnoteReferalDataService", "eHnoteMainAdminServices", "eHnoteConditionsDataService", function ($scope, eHnoteProcedureDataService, $rootScope, eHnotePatientDataService, eHnoteMasterDataService, $location, alertify, eHnotePrintService, $filter, eHnoteLoginStatusService, $timeout, $uibModal, eHnoteCacheStorageService, eHnoteSettingsDataService, datapersistanceFactory, eHnotePatientAddressDataServices, localStorageFactory, eHnoteSurgeryService, HInventoryService, eHnotePatientPVService, eHnoteInsuranceService, eHnoteUserAppointmentDataService, eHnoteMainAppointmentService, eHnoteAuditServices, InventoryService, $q, eHnoteDiagnosisDataServices, USPrintService, eHnoteReferalDataService, eHnoteMainAdminServices, eHnoteConditionsDataService) {
    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.UserId = eHnoteMasterDataService.getLoginId();
    $scope.SelectedPayorHospital = "";
    var allbranches = localStorageFactory.getItem("allBranchesData") || [];
    var clinicAddress = eHnoteUserAppointmentDataService.RestructureNewBranches(true, allbranches, doctorinfo) || [];
    $scope.HospitalList = clinicAddress || [];
    $scope.SelectedPayorHospital = $filter("filter")($scope.HospitalList, { "BranchId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID }, true)[0];
    var object = "";
    $scope.PatientInsuranceItems = [];
    $rootScope.OldBillingObject = {
    };

    $scope.navtoBillingList = function () {
        /*    $scope.billMain.showBillingScreen = false;*/
        $location.url("/Biller");
    }
    $scope.showPaymentDetails = false;

    $scope.BillingDataobj = datapersistanceFactory.getItem("OPBilling");



    console.log($scope.BillingDataobj);


    /*    console.log($scope.parentProfileTab.MainTab);*/
    if ($scope.parentProfileTab == undefined) {

        $scope.parentProfileTab = {
            "MainTab": 1
        }

    }

    $scope.AppointmentDatesArray = [];

    $scope.currentUrl = $location.url();

    console.log($scope.currentUrl);

    $scope.IsComingFrom = "";
    if ($scope.BillingDataobj.IsComingFrom !== '') {
        $scope.IsComingFrom = $scope.BillingDataobj.IsComingFrom || '';
    } else {
        $scope.IsComingFrom = "";
    }


    console.log($scope.BillingDataobj);

    $scope.SubTab = $rootScope.ClaimSubTab || 1;
    $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
    console.log($scope.UserAccessRights);

    $scope.CurreDate = $filter("date")(new Date(), "yyyy-MM-dd")
    $scope.typeMain = "1";

    $scope.dummyArray = [];
    var pobj = {
        "TypeId": "1",
        "Date": $filter("date")(new Date(), "yyyy-MM-dd"),
        "Mode": "0",
        "Amount": "",
        "Adjustment": "",
        "Reason": "",
        "TraceId": ""
    };
    $scope.dummyArray.push(pobj);

    $scope.addMore = function () {
        var pobj = {
            "TypeId": "1",
            "Date": $filter("date")(new Date(), "yyyy-MM-dd"),
            "Mode": "2",
            "Amount": "",
            "Adjustment": "",
            "Reason": "",
            "TraceId": ""
        };
        $scope.dummyArray.push(pobj);
    };

    $scope.DummyBillingHistoryDetails = [{
        "Date": $filter("date")(new Date(), "yyyy-MM-dd"),
        "ReceiptId": "BMK0012",
        "Mode": "Cash",
        "Type": "By Patient",
        "TraceId": "",
        "Amount": 150,
        "Adjustments": 0,
        "CreatedBy": "Whales TJ"
    },
    {
        "Date": $filter("date")(new Date(), "yyyy-MM-dd"),
        "ReceiptId": "BMK0017",
        "Mode": "Cheque",
        "Type": "By Insurance",
        "Amount": 250,
        "TraceId": "122990",
        "Adjustments": 20,
        "CreatedBy": "Whales TJ"
    }];

    $scope.orgftpDetails = {
        "MasterClearingHouseId": 0,
        "ClearingHouseTypeId": 0,
        "OrganizationClearingHouseId": 0,
        "ClearingHouseDetails": {},
        "FTPAddress": "",
        "FTPUserName": "",
        "FTPPassword": "",
        "FTPFolder": ""
    };



    $scope.HospitalDetailsObj = {
        "Name": "",
        "NPI": "",
        "MobileNumber": "",
        "Address1": "",
        "CityName": "",
        "StateName": "",
        "CountryName": "",
        "ZipCode": ""
    };

    if (doctorinfo.doctordata.UserAddress.length > 0) {
        console.log(doctorinfo.doctordata.UserAddress);
        $scope.HospitalDetailsObj.Name = doctorinfo.doctordata.UserAddress[0].ClinicName || "";
        $scope.HospitalDetailsObj.NPI = doctorinfo.doctordata.UserAddress[0].NPI || "";
        $scope.HospitalDetailsObj.MobileNumber = doctorinfo.doctordata.UserAddress[0].ContactNo || "";
        $scope.HospitalDetailsObj.Address1 = doctorinfo.doctordata.UserAddress[0].Address1 || "";
        $scope.HospitalDetailsObj.CityName = doctorinfo.doctordata.UserAddress[0].CityName || "";
        $scope.HospitalDetailsObj.StateName = doctorinfo.doctordata.UserAddress[0].StateName || "";
        $scope.HospitalDetailsObj.CountryName = doctorinfo.doctordata.UserAddress[0].CountryName || "";
        $scope.HospitalDetailsObj.ZipCode = doctorinfo.doctordata.UserAddress[0].PinCode || "";
    }

    $scope.PatientOtherDetails = {
        "LastName": "",
        "FirstName": "",
        "Address1": "",
        "Address2": "",
        "CityName": "",
        "StateName": "",
        "ZipCode": "",
        "DOB": "",
        "Gender": "",
    };

    $scope.removeDummy = function (index) {
        $scope.dummyArray.splice(index, 1);
    }
    if (doctorinfo.doctordata.User[0].IsEnableEditBillingOption !== undefined) {

        $scope.editBillingOption = doctorinfo.doctordata.User[0].IsEnableEditBillingOption;
    }
    $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
    $scope.userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
    $scope.RoleId = $scope.userLoginDetails.RoleID;

    $scope.HospitalID = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
    $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
    $scope.ParentHospitalID = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
    var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
    $scope.appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();




    if ($scope.cacheStorageItem.PatientID === undefined) {
        $scope.cacheStorageItem.PatientID = $scope.appointmentinfo.PatientId || 0;
    }

    if ($scope.cacheStorageItem.appointmentid === undefined) {
        $scope.cacheStorageItem.appointmentid = $scope.appointmentinfo.AppointmentId || 0;
    }

    //if ($scope.SubTab == 2) {
    //   $scope.getpatientInvoiceIds($scope.cacheStorageItem.PatientID);
    //}



    $scope.updateAppointmentPatientTrackerstatus = function () {
        $scope.RoomTypeId = null;
        if ($scope.RoleId == 1 || $scope.RoleId == 43) {
            var SuffixId = doctorinfo.doctordata.User[0].SuffixId || 0;
            $scope.RoomTypeId = 1;
            if (SuffixId == 13) { //optha
                $scope.RoomTypeId = 12;
            }
            if (SuffixId == 10) { //doctor
                $scope.RoomTypeId = 1;
            }

        } else if ($scope.RoleId == 10) {
            $scope.RoomTypeId = 2;
        } else if ($scope.RoleId == 19) {
            $scope.RoomTypeId = 9;
        }
        else if ($scope.RoleId == 2) {
            $scope.RoomTypeId = 10;
        } else {
            $scope.RoomTypeId = null;
        }
        $scope.CurrentTime = $filter("date")(new Date(), "HH:mm:ss");
        var params = {
            "UserId": eHnoteMasterDataService.getLoginId(),
            "HospitalId": $scope.HospitalId,
            "AppointmentId": $scope.cacheStorageItem.appointmentid,
            "AppointmentTrackerDetailId": 0,
            "RoleId": $scope.RoleId,
            "DoctorId": null,
            "DoctorRoleId": null,
            "RoomTypeId": $scope.RoomTypeId,
            "RoomId": null,
            "IsSendTo": "N",
            "IsCheckedIn": "N",
            "IsCheckedOut": "N",
            "IsReCheckIn": "N",
            "IsReCheckOut": "N",
            "CurrentTime": $scope.CurrentTime,
        }
        eHnoteMainAppointmentService.AddUpdateAppointmentTrackerDetails(params).then(function (resp) {

        }, function (err) {
            console.log(err);
            alertify.error("Getting Failed");
        });

    };

    $scope.OrganizationSettingsData = datapersistanceFactory.getItem("OrganizationSettingsData");
    $scope.IsDynamicCheckInMandatory = false;
    if ($scope.OrganizationSettingsData !== undefined) {
        if ($scope.OrganizationSettingsData.AppointmentSettings !== undefined) {
            if ($scope.OrganizationSettingsData.AppointmentSettings.AppointmentCheckInDynamicStatus === 1) {
                $scope.IsDynamicCheckInMandatory = true;
            }
        }
    }
    $scope.FacilitiesList = [];
    $scope.GetOrganizationFacilitiesNew = function (pagenumber) {
        var params = {
            "OrganizationId": $scope.HospitalID || 0,
            "ParentOrganizationId": $scope.ParentHospitalID,
            "FacilityCode": "",
            "PageNumber": pagenumber,
            "PageSize": 20
        };

        eHnoteSettingsDataService.GetOrganizationBillingProviders(params).then(function (resp) {

            console.log(resp.data);

            $scope.FacilitiesList = [];
            if (resp.data.Status == "Success") {
                resp.data.rows = resp.data.rows || [];
                $scope.TotalFacilityCount = resp.data.count || 0;
                if (resp.data.rows.length > 0) {
                    $scope.FacilitiesList = resp.data.rows || [];

                    if ($scope.IsComingFrom == 'PendingClaims') {


                        console.log($scope.BillingDataobj.Selectobj);
                        if ($scope.BillingDataobj.Selectobj.BillingProvider) {
                            var bfarray = $filter("filter")($scope.FacilitiesList, { "OrganizationBillingProviderId": $scope.BillingDataobj.Selectobj.BillingProvider.OrganizationBillingProviderId }, true) || [];
                            if (bfarray.length > 0) {
                                $scope.mainBillingObject.BillingProviderObj = bfarray[0];
                            }
                        }

                    }

                }
            } else {
                alertify.error(resp.data.Message);
            }
        }, function (error) {
            console.log(error);
        });
    };

    // super bill
    $scope.LoadConsultationOrdersNew = function () {
        eHnoteSettingsDataService.GetConsultationAdvicedOrderBillItems($scope.appointmentinfo.AppointmentId, $scope.appointmentinfo.HospitalId).then(function (response) {
            console.log(response);
            if (response.data.status == "Success") {

                response.data.SuperBillObj.SuperBillId = response.data.SuperBillObj.SuperBillId || 0;


                $scope.mainBillingObject.SuperBillId = response.data.SuperBillObj.SuperBillId;
                $scope.SuperBillRemarks = response.data.SuperBillObj.SuperBillRemarks;

                response.data.SuperBillObj.SuperBillArray = response.data.SuperBillObj.SuperBillArray || [];
                $scope.SuperBillArray = response.data.SuperBillObj.SuperBillArray;
                $scope.DiagArrayList = [];
                if ($scope.SuperBillArray.length > 0) {
                    angular.forEach($scope.SuperBillArray, function (item) {
                        if (item.DiagnosisArray.length > 0) {
                            angular.forEach(item.DiagnosisArray, function (item1) {
                                $scope.DiagArrayList.push(item1);
                            });
                        }
                    });
                }

                $scope.ConsultDetailsArray = _.uniq($scope.DiagArrayList, false, function (p) { return p.DiagnosisId; });

                //angular.forEach($scope.ConsultDetailsArray, function (kitem) {
                //    angular.forEach($scope.DiagnosisListArray, function (item) {
                //        item.DiagnosisId = kitem.DiagnosisId;
                //        item.ICD10CODE = kitem.ICD10CODE;
                //        item.DiagnosisTypeId = kitem.DiagnosisTypeId || null;
                //        item.selectedDiagnosisObj = {
                //            "DiagnosisId": kitem.DiagnosisId,
                //            "ICD10CODE": kitem.ICD10CODE,
                //            "ICD10DIAGDESCRIPTION": kitem.ICD10DIAGDESCRIPTION,
                //            "ICD10DIAGNAME": kitem.ICD10DIAGNAME,
                //            "OrganizationId": kitem.OrganizationId,
                //            "SpecializationId": kitem.SpecializationId,
                //            "DiagnosisTypeId": kitem.DiagnosisTypeId || null,
                //        };

                //    }); 
                //});
                for (let i = 0; i < $scope.ConsultDetailsArray.length; i++) {
                    $scope.DiagnosisListArray[i].DiagnosisId = $scope.ConsultDetailsArray[i].DiagnosisId;
                    $scope.DiagnosisListArray[i].ICD10CODE = $scope.ConsultDetailsArray[i].ICD10CODE;
                    $scope.DiagnosisListArray[i].ICD10Code = $scope.ConsultDetailsArray[i].ICD10CODE;
                    $scope.DiagnosisListArray[i].DiagnosisTypeId = $scope.ConsultDetailsArray[i].DiagnosisTypeId || null;
                    $scope.DiagnosisListArray[i].SelectedObj = $scope.ConsultDetailsArray[i].ICD10CODE + '-' + $scope.ConsultDetailsArray[i].ICD10DIAGDESCRIPTION;
                    $scope.DiagnosisListArray[i].selectedDiagnosisObj = {
                        "DiagnosisId": $scope.ConsultDetailsArray[i].DiagnosisId,
                        "ICD10CODE": $scope.ConsultDetailsArray[i].ICD10CODE,
                        "ICD10DIAGDESCRIPTION": $scope.ConsultDetailsArray[i].ICD10DIAGDESCRIPTION,
                        "ICD10DIAGNAME": $scope.ConsultDetailsArray[i].ICD10DIAGNAME,
                        "OrganizationId": $scope.ConsultDetailsArray[i].OrganizationId,
                        "SpecializationId": $scope.ConsultDetailsArray[i].SpecializationId,
                        "DiagnosisTypeId": $scope.ConsultDetailsArray[i].DiagnosisTypeId || null,
                        "ActiveInd": "Y",
                        "DiagnosisNotes": $scope.ConsultDetailsArray[i].DiagnosisNotes || "",
                        "IsFavouriteInd": $scope.ConsultDetailsArray[i].IsFavouriteInd || false,
                        "IsFrequent": $scope.ConsultDetailsArray[i].IsFrequent || "N",
                        "OrganizationDiagnosisId": $scope.ConsultDetailsArray[i].OrganizationDiagnosisId || null,
                    };
                }




                $scope.DiagnosisListArray = $scope.DiagnosisListArray;

                angular.forEach($scope.SuperBillArray, function (item) {
                    var index = $scope.mainBillingObject.BillingDetail.length;
                    index = parseInt(index);
                    $scope.pushtoBill(item, $scope.mainBillingObject.BillingDetail[index - 1]);
                });
            }
        }, function (err) {
            console.log(err);
            alertify.error("Getting Failed");
        });
    };


    $scope.init = function () {
        $scope.newProcedureobj = {
            "count": "",
            "PageSize": 10,
            "PageNumber": 1,
            "SearchText": "",
            "SelectedObj": ""
        };
        $scope.ShowEditSummaryview = false;
        $scope.SaveasDraftorBiller = 'Biller';
        $scope.previousBillDetailsArray = [];
        $scope.ClaimStatusList = [];
        $scope.BillStatusList = [];
        $scope.PaymentReasonList = [];
        $scope.AdvicedDiagnosisList = [];
        $scope.PatientInsuranceItems = [];
        $scope.masterModifierList = [];
        $scope.patientInsurancesArray = [];
        $scope.OrganizationClearingHouseDetails = [];
        $scope.patientInsurancePlanDetailsArray = [];
        $scope.masterRevenueBillingCodes = [];
        $scope.billPaymentByModes = [];
        var mObj = datapersistanceFactory.getItem("masterDataArrays");
        $scope.masterPaymentModes = [];

        if (mObj.PaymentModes && mObj.PaymentModes.length > 0) {
            $scope.masterPaymentModes = mObj.PaymentModes;
            for (var i = $scope.masterPaymentModes.length - 1; i >= 0; i--) {
                if ($scope.masterPaymentModes[i].PaymentModeId === 33 || $scope.masterPaymentModes[i].PaymentModeId === 34 || $scope.masterPaymentModes[i].PaymentModeId === 39) {
                    $scope.masterPaymentModes.splice(i, 1);
                }
            }
        }
        $scope.POSObj = {
            'POSCODENAME': ''
        }
        $scope.ClaimActionList = angular.copy(mObj.masterClaimActionList);
        console.log($scope.ClaimActionList);

        $scope.InsurancePlanList = angular.copy(mObj.masterInsurancePlansList);
        // $scope.ClaimStatusList = angular.copy(mObj.masterClaimStatusList);
        $scope.SendViaList = angular.copy(mObj.masterClaimSendViaList);

        console.log($scope.SendViaList);

        $scope.POSCodeList = angular.copy(mObj.masterPOSCodesList);
     
        var obj = {
            "AppointmentId": $scope.cacheStorageItem.appointmentid,
            "PatientId": $scope.cacheStorageItem.PatientID,
            "SendPlanDetailsInd":1
        }

        console.log($scope.cacheStorageItem.appointmentid + "__AppointmentId");

        var clearingHouseReq = {
            "ParentOrganizationId": $scope.ParentHospitalID
        }
        $q.all([

            //eHnoteSettingsDataService.GetMasterInsuranceCoverageList(),
            eHnoteSettingsDataService.GetmasterClaimActionList(),
            eHnoteSettingsDataService.GetBillStatus(),
            eHnoteInsuranceService.GetAppointmentInsuranceDetailsListByStatus(obj),
            eHnoteInsuranceService.GetDiagnosisAssesmentPlansListById(obj),
            eHnoteSettingsDataService.GetMasterModifiers(),
            eHnotePatientDataService.GetBillingDraftByAppointmentId($scope.cacheStorageItem.appointmentid),
            eHnoteSettingsDataService.GetMasterPaymentAdjustmentCodes($scope.ParentHospitalID),
            eHnoteInsuranceService.getPatientInsuranceDtls($scope.cacheStorageItem.PatientID, 1),
            eHnoteMainAdminServices.GetOrganizationClearingHouseDetails(clearingHouseReq),
            eHnoteSettingsDataService.GetMasterRevenueBillingCodes()


        ]).then(function (resp) {
            if (resp[0].data.ClaimAction.length !== 0) {
                $scope.ClaimStatusList = resp[0].data.ClaimAction;
                $scope.billPaymentByModes = resp[0].data.BillPaymentByModes;
                $scope.billPaymentByModes = $filter("filter")($scope.billPaymentByModes, function (item) {
                    return item.BillPaymentTypeId !== 4;
                });
            }
            if (resp[1].data.BillStatus.length !== 0) {
                $scope.BillStatusList = resp[1].data.BillStatus;
            }
            if (resp[2].data.rows.length !== 0) {
                $scope.PatientInsuranceItems = resp[2].data.rows;
                //if ($scope.PatientInsuranceItems.length == 1) {
                //    // $scope.mainBillingObject.ClaimActionObj = $filter("filter")($scope.ClaimStatusList, { "ClaimActionId": $scope.PatientInsuranceItems[0].CoverageId })[0];
                //    $scope.mainBillingObject.ClaimActionObj = $filter("filter")($scope.ClaimStatusList, { "ClaimActionId": $scope.PatientInsuranceItems[0].IdentifierId })[0];
                //    $scope.ChangeClaimAction1($scope.mainBillingObject);
                //}
                //if ($scope.PatientInsuranceItems.length > 1) {
                //    $scope.mainBillingObject.ClaimActionObj = $filter("filter")($scope.ClaimStatusList, { "ClaimActionId": 10 })[0];
                //    $scope.ChangeClaimAction1($scope.mainBillingObject);
                //}
            } else {
                if ($scope.PatientInsuranceItems.length == 0) {
                    $scope.mainBillingObject.ClaimActionObj = $filter("filter")($scope.billPaymentByModes, { "BillPaymentTypeId": 1 })[0];
                    $scope.mainBillingObject.ClaimActionId = 1;
                    $scope.mainBillingObject.BillTypeId = 1;
                    $scope.ShowEditSummaryview = true;
                }
            }

            if (resp[3].data.rows.length !== 0) {
                $scope.AdvicedDiagnosisList = resp[3].data.rows;

            }
            if (resp[4].data.rows.length !== 0) {
                $scope.masterModifierList = resp[4].data.rows;
            }
            if (resp[5].data.data.rows.length !== 0) {
                $scope.BillingDraftList = resp[5].data.data.rows;
                restructureBillingDraftItems($scope.BillingDraftList, obj);
            }
            if (resp[6].data.rows.length !== 0) {
                $scope.PaymentReasonList = resp[6].data.rows || [];
            }

            if (resp[7].data.rows.length !== 0) {
                $scope.patientInsurancesArray = resp[7].data.rows;

                console.log("INS_3");

                if ($scope.patientInsurancesArray.length > 0) {
                    $scope.mainBillingObject.ClaimActionObj = $filter("filter")($scope.billPaymentByModes, { "BillPaymentTypeId": 1 })[0];
                    if ($scope.PatientInsuranceItems.length > 0) {
                        $scope.mainBillingObject.ClaimActionObj = $filter("filter")($scope.billPaymentByModes, { "BillPaymentTypeId": 2 })[0];
                    }

                    if ($scope.PatientInsuranceItems.length > 0) {
                        if ($scope.BillingDataobj.IsComingFrom == "PendingClaims") {
                            if ($scope.BillingDataobj.Selectobj.ClaimActionId != 0) {
                                $scope.mainBillingObject.ClaimActionObj = $filter("filter")($scope.billPaymentByModes, { "BillPaymentTypeId": $scope.BillingDataobj.Selectobj.ClaimActionId })[0];
                                $scope.mainBillingObject.ClaimActionId = $scope.BillingDataobj.Selectobj.ClaimActionId;
                                $scope.mainBillingObject.BillTypeId = $scope.BillingDataobj.Selectobj.ClaimActionId;
                            }
                        }
                    }
                    $scope.patientInsurancePlanDetailsArray = resp[7].data.PlanDetails || [];
                    $scope.ChangeBillByMode($scope.mainBillingObject);



                }

            }

            if ($scope.mainBillingObject.BillingDetail.length == 0) {
                var treatObject = getNewTreatmentObject();
                $scope.mainBillingObject.BillingDetail.push(treatObject);
            }

            if ($scope.IsComingFrom == 'PendingClaims') {
                var obj = {
                    "AppointmentId": $scope.cacheStorageItem.appointmentid,
                    "PatientID": $scope.cacheStorageItem.PatientID,
                }
                restructureBillingPendingItems($scope.BillingDataobj.Selectobj, obj);
            }

            if (resp[8].data.rows.length !== 0) {
                $scope.OrganizationClearingHouseDetails = resp[8].data.ConnectedClearingHouse || [];
            }
            if (resp[9].data.rows.length !== 0) {
                $scope.masterRevenueBillingCodes = resp[9].data.rows || [];
            }
            // super bill
            $scope.LoadConsultationOrdersNew();



        }, function (err) {
            console.log(err);
            alertify.error("Getting Data Failed");
        });






        function restructureBillingDraftItems(resp, obj) {
            console.log(resp[0].BillingJson);
            $scope.mainBillingObject.BillingHistoryDetails = [];
            if (resp !== undefined) {
                var data = resp[0];

                var BillingJson = JSON.parse(resp[0].BillingJson);

                // $scope.BillingCategoryType = resp.data.BillingCategoryType;
                // $scope.PaymentType = resp.data.PaymentType;

                // $scope.PaymentType = resp.data.PaymentType;
                $scope.mainBillingObject.BillingDraftId = data.BillingDraftId;
                $scope.mainBillingObject.TotalBalance = BillingJson.BillingInfo.TotalBalance;
                $scope.mainBillingObject.TotalBalance = BillingJson.BillingInfo.TotalBalance;
                $scope.mainBillingObject.TempReceivedAmt = BillingJson.BillingInfo.TotalBalance;
                $scope.mainBillingObject.TotalReceivedAmount = BillingJson.BillingInfo.TotalReceivedAmount;
                $scope.mainBillingObject.PreviousPaidAmount = checkRoundVal(BillingJson.BillingInfo.TotalReceivedAmount);
                $scope.mainBillingObject.isTotalPaid = BillingJson.BillingInfo.TotalNetAmount - BillingJson.BillingInfo.TotalReceivedAmount === 0 ? true : false;
                $scope.mainBillingObject.AppointmentID = BillingJson.BillingInfo.AppointmentID;
                $scope.mainAppointmentId = BillingJson.BillingInfo.AppointmentID;
                $scope.mainBillingObject.BillID = BillingJson.BillingInfo.BillingId;

                $scope.mainBillingObject.AppointmentDate = BillingJson.BillingInfo.AppointmentDate;
                $scope.mainBillingObject.AdmissionId = BillingJson.AdmissionId;
                $scope.mainBillingObject.BillingTypeId = BillingJson.BillingTypeId;
                $scope.mainBillingObject.InvoiceNumber = BillingJson.InvoiceId;


                $scope.mainBillingObject.ZeroBillingRemarks = BillingJson.BillingInfo.ZeroBillingRemarks;
                $scope.mainBillingObject.IsCreditBill = BillingJson.BillingInfo.IsCreditBill;
                BillingJson.BillingInfo.DiagnosisList = BillingJson.BillingInfo.DiagnosisList || [];
                if (BillingJson.BillingInfo.DiagnosisList.length > 0) {
                    angular.forEach(BillingJson.BillingInfo.DiagnosisList, function (item) {
                        angular.forEach($scope.DiagnosisListArray, function (Ditem) {
                            if (item.Type == Ditem.Type) {
                                Ditem.Type = item.Type;
                                Ditem.DiagnosisId = item.DiagnosisId;
                                Ditem.ICD10DIAGDESCRIPTION = item.ICD10DIAGDESCRIPTION;
                                Ditem.SelectedObj = item.ICD10DIAGDESCRIPTION;

                            }
                        });
                    });
                }










                if (BillingJson.BillingInfo.BillingDetail !== undefined) {
                    if (BillingJson.BillingInfo.BillingDetail.length > 0) {
                        angular.forEach(BillingJson.BillingInfo.BillingDetail, function (item, index) {


                            item.RowId = index + 1;
                            item.IsBilledItem = "Y";
                            item.PreviousBill = "Y";
                            item.IsIncluded = true;
                            item.IsConsultationBilling = false;
                            item.ProcedureHistoryId = 0;

                            if (item.selectedParticular === undefined || item.selectedParticular === "") {
                                item.selectedParticular = {
                                    "ProcedureMaxCost": item.ProcedureCost,
                                    "ProcedureName": item.ProcedureName,
                                    "ProcedureId": item.ProcedureId,
                                    "ActiveIND": "Y"
                                };
                            }
                            item.BillDate = moment(item.BillingDate).format("DD-MMM-YYYY");

                            item.selectedParticular = item.ProcedureName;


                            item.ConversionDoctorId = item.ConversionDoctorId || 0;
                            item.TreatmentDoctorId = item.TreatmentDoctorId || 0;
                            item.ConsultantDoctorId = item.ConsultantDoctorId || 0;
                            item.SalesPersonId = item.SalesPersonId || 0;
                            item.TherapistId = item.TherapistId || 0;
                            item.ConversionDoctorName = "";
                            item.TreatmentDoctorName = "";
                            item.ConsultantDoctorName = "";
                            item.SalesPersonName = "";
                            item.TherapistName = "";

                            if (item.Gst > 0) {
                                item.showIncludeTax = true;
                                item.Gst = item.Gst.toString();
                            }


                            var array = [];
                            if (item.ConversionDoctorId !== 0) {
                                array = $filter("filter")($scope.clinicDoctorList, { "DoctorID": item.ConversionDoctorId }, true);
                                if (array.length > 0) {
                                    item.ConversionDoctorName = array[0].FullName;
                                }
                            }


                            if (item.TreatmentDoctorId !== 0) {
                                array = $filter("filter")($scope.clinicDoctorList, { "DoctorID": item.TreatmentDoctorId }, true);
                                if (array.length > 0) {
                                    item.TreatmentDoctorName = array[0].FullName;
                                }
                            }
                            if (item.ConsultantDoctorId !== 0) {
                                array = $filter("filter")($scope.clinicDoctorList, { "DoctorID": item.ConsultantDoctorId }, true);
                                if (array.length > 0) {
                                    item.ConsultantDoctorName = array[0].FullName;
                                }
                            }

                            if (item.SalesPersonId !== 0) {
                                array = $filter("filter")($scope.clinicDoctorList, { "DoctorID": item.SalesPersonId }, true);
                                if (array.length > 0) {
                                    item.SalesPersonName = array[0].FullName;
                                }
                            }

                            if (item.TherapistId !== 0) {
                                array = $filter("filter")($scope.clinicDoctorList, { "DoctorID": item.TherapistId }, true);
                                if (array.length > 0) {
                                    item.TherapistName = array[0].FullName;
                                }
                            }




                            //if (item.ProcedureTypeId === 8) {
                            //    item.ProcedureTypeName = 'Inventory';
                            //} else {
                            //    var pdata = $filter("filter")($scope.ProcedureListTypes, { "Id": item.ProcedureTypeId }, true)[0];
                            //    item.ProcedureTypeName = pdata.Name;
                            //}


                            var obj = {
                                "IsInvoiceCancelled": false
                            }
                            if (obj.IsInvoiceCancelled) {
                                $scope.mainBillingObject.BillingDetail.push(item);
                            } else {
                                if (item.DeleteInd) {
                                    $scope.mainBillingObject.DeletedBillItems.push(item);
                                } else {
                                    $scope.mainBillingObject.BillingDetail.push(item);
                                }
                            }



                        });
                    }
                    var treatObject1 = getNewTreatmentObject();
                    $scope.mainBillingObject.BillingDetail.push(treatObject1);
                }






                $scope.selectedInsuranceTpaObj = "";



            }
            var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
            appointmentinfo.DoctorFullName = BillingJson.BillingInfo.DoctorName;
            appointmentinfo.HospitalName = BillingJson.BillingInfo.BranchName;
            appointmentinfo.BranchMobile = BillingJson.BillingInfo.BranchMobile;
            appointmentinfo.BranchEmail = BillingJson.BillingInfo.BranchEmail;
            //appointmentinfo.BranchAddress1 = BillingJson.BillingInfo.BranchAddress1;
            //appointmentinfo.BranchAddress2 = BillingJson.BillingInfo.BranchAddress2;



            eHnoteMasterDataService.addAppointmentInfo(appointmentinfo);


            angular.forEach($scope.mainBillingObject.BillingDetail, function (item, ind) {
                $scope.CalculateBillingItems(item, ind);
            });




            var GSTDiscountObject = eHnoteProcedureDataService.DiscountOrGSTEnabledObject($scope.mainBillingObject.BillingDetail);

            $scope.mainBillingObject.IsDiscountChecked = GSTDiscountObject.IsDiscountChecked;
            $scope.mainBillingObject.IsGSTChecked = GSTDiscountObject.IsGSTChecked;

            if ($scope.mainBillingObject.IsCreditBill === true && $scope.Billingpageno === 5) {
                $scope.mainBillingObject.TotalBalance = data.TotalBalance;
            }

            //$scope.HCFAPrintDetailsObj = $scope.GetHCFAPrintDetailsObj();
            //if (resp !== undefined) {
            //    if (data.BillingDetails !== undefined && data.BillingDetails.length > 0) {
            //        $scope.HCFAPrintDetailsObj.ProcedureListObj = angular.copy(data.BillingDetails);
            //    }
            //    if (data.DiagnosisList != undefined && data.DiagnosisList.length > 0) {
            //        $scope.HCFAPrintDetailsObj.DiagnosisListObj = angular.copy(data.DiagnosisList);
            //    }
            //}
        }


        function restructureBillingPendingItems(resp, obj) {

            $scope.mainBillingObject.BillingDetail = [];
            $scope.mainBillingObject.BillingHistoryDetails = [];


            if (resp !== undefined) {

                //    var BillingJson = JSON.parse(resp);
                var BillingJson = resp;
                $scope.mainBillingObject.BillingDraftId = null;

                $scope.mainBillingObject.ClaimStatusId = BillingJson.ClaimStatusId || 1;
                $scope.mainBillingObject.TotalBalance = BillingJson.TotalBalance;
                $scope.mainBillingObject.TempReceivedAmt = BillingJson.TotalBalance;
                $scope.mainBillingObject.TotalReceivedAmount = BillingJson.TotalReceived;
                $scope.mainBillingObject.PreviousPaidAmount = checkRoundVal(BillingJson.TotalReceived);
                $scope.mainBillingObject.isTotalPaid = BillingJson.TotalNetAmount - BillingJson.TotalReceived === 0 ? true : false;
                $scope.mainBillingObject.AppointmentID = BillingJson.AppointmentId;
                $scope.mainAppointmentId = BillingJson.AppointmentId;
                $scope.mainBillingObject.BillID = BillingJson.BillingId;
                $scope.mainBillingObject.BillingHistoryId = BillingJson.BillingHistoryId;
                $scope.mainBillingObject.AppointmentDate = BillingJson.AppointmentDate;
                $scope.mainBillingObject.AdmissionId = BillingJson.AdmissionId || null;
                $scope.mainBillingObject.BillingTypeId = BillingJson.BillingTypeId || 1;
                $scope.mainBillingObject.InvoiceNumber = BillingJson.InvoiceId;

                $scope.mainBillingObject.BillingProviderId = BillingJson.BillingProvider.OrganizationBillingProviderId;
                $scope.mainBillingObject.BillingProviderName = BillingJson.BillingProvider.BillingProviderName;


                $scope.mainBillingObject.ClaimTypeId = BillingJson.ClaimTypeId;
                $scope.mainBillingObject.PlaceOfServiceId = BillingJson.PlaceOfServiceId;



                if ($scope.mainBillingObject.PayorDetails.length > 0) {
                    angular.forEach($scope.mainBillingObject.PayorDetails, function (item) {
                        if (item.PayorId == BillingJson.PayorId) {
                            item.PatientClaimId = BillingJson.PatientClaimId || 0;
                        }
                    });
                }

                BillingJson.DiagnosisList = BillingJson.DiagnosisList || [];
                if (BillingJson.DiagnosisList.length > 0) {
                    angular.forEach(BillingJson.DiagnosisList, function (item) {
                        angular.forEach($scope.DiagnosisListArray, function (Ditem) {
                            if (item.Type == Ditem.Type) {
                                Ditem.Type = item.Type;
                                Ditem.DiagnosisId = item.DiagnosisId;
                                Ditem.ICD10DIAGDESCRIPTION = item.DiagnosisName;
                                Ditem.SelectedObj = item.DiagnosisName;
                            }
                        });
                    });
                };



                $scope.addedDiagnosisArray = [];
                if ($scope.DiagnosisListArray.length === 0) { return; }
                var array = $filter("filter")($scope.DiagnosisListArray, function (item, index) { return item.DiagnosisId !== 0; }) || [];
                if (array.length > 0) {
                    angular.forEach(array, function (ditem) {
                        var Obj = {
                            "DiagnosisId": ditem.DiagnosisId,
                            "DiagnosisName": ditem.Description,
                            "DiagnosisCode": ditem.ICD10Code,
                            "IsSelected": false,
                            "Type": ditem.Type
                        };
                        $scope.addedDiagnosisArray.push(Obj);
                    });
                }


                if (BillingJson.BillingDetails !== undefined) {
                    if (BillingJson.BillingDetails.length > 0) {
                        angular.forEach(BillingJson.BillingDetails, function (item, index) {


                            item.RowId = index + 1;
                            item.IsBilledItem = "Y";
                            item.PreviousBill = "Y";
                            item.IsIncluded = true;
                            item.IsConsultationBilling = false;
                            item.ProcedureHistoryId = 0;

                            if (item.selectedParticular === undefined || item.selectedParticular === "") {
                                item.selectedParticular = {
                                    "ProcedureMaxCost": item.ProcedureCost,
                                    "ProcedureName": item.ProcedureName,
                                    "ProcedureId": item.ProcedureId,
                                    "ActiveIND": "Y"
                                };
                            }
                            item.BillDate = moment(item.BillingDate).format("DD-MMM-YYYY");

                            item.selectedParticular = item.ProcedureName;


                            if (BillingJson.InsuranceSequenceCode == 'P') {
                                item.ActualInsuranceAmount = item.InsuranceAmount1 || 0;
                            } else {
                                item.ActualInsuranceAmount = item.InsuranceAmount2 || 0;
                            }


                            item.ActualCopayAmount = item.PatientCoPay || 0;
                            item.PatientCoPay = item.PatientCoPay || 0;
                            item.ConversionDoctorId = item.ConversionDoctorId || 0;
                            item.TreatmentDoctorId = item.TreatmentDoctorId || 0;
                            item.ConsultantDoctorId = item.ConsultantDoctorId || 0;
                            item.SalesPersonId = item.SalesPersonId || 0;
                            item.TherapistId = item.TherapistId || 0;
                            item.ConversionDoctorName = "";
                            item.TreatmentDoctorName = "";
                            item.ConsultantDoctorName = "";
                            item.SalesPersonName = "";
                            item.TherapistName = "";
                            item.RevenueBillingCodeObj = item.RevenueBillingCode;

                            if (item.Gst > 0) {
                                item.showIncludeTax = true;
                                item.Gst = item.Gst.toString();
                            }




                            item.TeethArray = _.pluck(item.TeethArray, "value");
                            item.TeethArray = _.sortBy(item.TeethArray, function (num) { return num; });


                            if (item.TeethArray.length === 0) {
                                item.TeethArray = null;
                            } else {
                                item.TeethArray = "Teeths: " + item.TeethArray.join(",") || null;
                            }







                            var array = [];
                            if (item.ConversionDoctorId !== 0) {
                                array = $filter("filter")($scope.clinicDoctorList, { "DoctorID": item.ConversionDoctorId }, true);
                                if (array.length > 0) {
                                    item.ConversionDoctorName = array[0].FullName;
                                }
                            }


                            if (item.TreatmentDoctorId !== 0) {
                                array = $filter("filter")($scope.clinicDoctorList, { "DoctorID": item.TreatmentDoctorId }, true);
                                if (array.length > 0) {
                                    item.TreatmentDoctorName = array[0].FullName;
                                }
                            }
                            if (item.ConsultantDoctorId !== 0) {
                                array = $filter("filter")($scope.clinicDoctorList, { "DoctorID": item.ConsultantDoctorId }, true);
                                if (array.length > 0) {
                                    item.ConsultantDoctorName = array[0].FullName;
                                }
                            }

                            if (item.SalesPersonId !== 0) {
                                array = $filter("filter")($scope.clinicDoctorList, { "DoctorID": item.SalesPersonId }, true);
                                if (array.length > 0) {
                                    item.SalesPersonName = array[0].FullName;
                                }
                            }

                            if (item.TherapistId !== 0) {
                                array = $filter("filter")($scope.clinicDoctorList, { "DoctorID": item.TherapistId }, true);
                                if (array.length > 0) {
                                    item.TherapistName = array[0].FullName;
                                }
                            }




                            //if (BillingJson.ClaimStatusId == 7 || BillingJson.ClaimStatusId == 11) {
                            //    item.ActualInsuranceAmount = item.InsuranceAmount1 || 0;

                            //    item.ActualCopayAmount = (item.PatientCoPay + item.ActualInsuranceAmount) || 0;
                            //    item.ActualInsuranceAmount = 0;
                            //    item.InsuranceAmount1 = 0;

                            //}

                            var obj = {
                                "IsInvoiceCancelled": false
                            }
                            if (obj.IsInvoiceCancelled) {
                                $scope.mainBillingObject.BillingDetail.push(item);
                            } else {
                                if (item.DeleteInd) {
                                    $scope.mainBillingObject.DeletedBillItems.push(item);
                                } else {
                                    $scope.mainBillingObject.BillingDetail.push(item);
                                }
                            }
                            item.addedDiagnosisArray = [];
                            if ($scope.addedDiagnosisArray.length > 0) {
                                item.addedDiagnosisArray = angular.copy($scope.addedDiagnosisArray);
                                item.DiagnosisType = "";
                                item.DiagnosisSearchType = "";
                                angular.forEach(item.addedDiagnosisArray, function (subditem) {
                                    var array = $filter("filter")(item.DiagnosisIds, { "Type": subditem.Type }, true);
                                    if (array.length > 0) {
                                        subditem.IsSelected = true;
                                        item.DiagnosisType = item.DiagnosisType + subditem.Type;
                                    }

                                });
                            }
                        });
                    }
                    var treatObject1 = getNewTreatmentObject();
                    $scope.mainBillingObject.BillingDetail.push(treatObject1);
                }







                $scope.selectedInsuranceTpaObj = "";



            }
            var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
            appointmentinfo.DoctorFullName = BillingJson.DoctorName;
            appointmentinfo.HospitalName = BillingJson.BranchName;
            appointmentinfo.BranchMobile = BillingJson.BranchMobile;
            appointmentinfo.BranchEmail = BillingJson.BranchEmail;
            //appointmentinfo.BranchAddress1 = BillingJson.BillingInfo.BranchAddress1;
            //appointmentinfo.BranchAddress2 = BillingJson.BillingInfo.BranchAddress2;



            eHnoteMasterDataService.addAppointmentInfo(appointmentinfo);


            angular.forEach($scope.mainBillingObject.BillingDetail, function (item, ind) {
                $scope.CalculateBillingItems(item, ind);
            });




            var GSTDiscountObject = eHnoteProcedureDataService.DiscountOrGSTEnabledObject($scope.mainBillingObject.BillingDetail);

            $scope.mainBillingObject.IsDiscountChecked = GSTDiscountObject.IsDiscountChecked;
            $scope.mainBillingObject.IsGSTChecked = GSTDiscountObject.IsGSTChecked;

            if ($scope.mainBillingObject.IsCreditBill === true && $scope.Billingpageno === 5) {
                $scope.mainBillingObject.TotalBalance = data.TotalBalance;
            }

            //$scope.HCFAPrintDetailsObj = $scope.GetHCFAPrintDetailsObj();
            //if (resp !== undefined) {
            //    if (data.BillingDetails !== undefined && data.BillingDetails.length > 0) {
            //        $scope.HCFAPrintDetailsObj.ProcedureListObj = angular.copy(data.BillingDetails);
            //    }
            //    if (data.DiagnosisList != undefined && data.DiagnosisList.length > 0) {
            //        $scope.HCFAPrintDetailsObj.DiagnosisListObj = angular.copy(data.DiagnosisList);
            //    }
            //}
        }

        $scope.ModifierList1 = angular.copy($scope.masterModifierList);
        $scope.ModifierList2 = angular.copy($scope.masterModifierList);
        $scope.ModifierList3 = angular.copy($scope.masterModifierList);
        $scope.ModifierList4 = angular.copy($scope.masterModifierList);
        $scope.mainBillingObject = $scope.getMainBillingObject();

        $scope.mainBillingObject.AppointmentID = $scope.cacheStorageItem.appointmentid;
        $scope.mainAppointmentId = $scope.cacheStorageItem.appointmentid;



        if ($scope.SaveasDraftorBiller == 'PendingClaims') {
            $scope.mainBillingObject.PatientClaimId = $scope.BillingDataobj.Selectobj.PatientClaimId;
        }

        $scope.selectedBillingCategoryTypeId = 1;
        $scope.selectedBillingModeId = 1;

        var brancList = localStorageFactory.getItem("allBranchesData") || [];

        OnGetDoctorSuccess(brancList);
        $scope.isofflinebilling = false;

        if ($scope.IsDynamicCheckInMandatory === true) {
            var params = {
                "AppointmentId": $scope.cacheStorageItem.appointmentid || 0,
            };
            eHnoteMainAppointmentService.GetLatestTrackerStatusById(params).then(function (resp) {
                if (resp.data.Status === 'Success') {
                    var DynamicStatusarray = resp.data.rows[0];
                    //$scope.cacheStorageItem.RoomTypeId = DynamicStatusarray.RoomTypeId || 0;
                    if (($scope.userLoginDetails.RoleID == 2) && (DynamicStatusarray.RoomTypeId == 1 || DynamicStatusarray.RoomTypeId == 2 || DynamicStatusarray.RoomTypeId == 4 || DynamicStatusarray.RoomTypeId == 12) && DynamicStatusarray.Status == 'Waiting') {
                        var r = alertify.confirm(
                            "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre pl-20 pr-20'>Patient is " + DynamicStatusarray.Status + " at " + DynamicStatusarray.RoomType + " ,Do you want to move patient to your active room or work offline? </h4>",
                            function () {
                                $scope.isofflinebilling = false;
                                $scope.updateAppointmentPatientTrackerstatus();
                            }, function () {
                                $scope.isofflinebilling = true;
                                return false;
                            });
                    }
                    else if (($scope.userLoginDetails.RoleID == 19) && (DynamicStatusarray.RoomTypeId === 1 || DynamicStatusarray.RoomTypeId === 2 || DynamicStatusarray.RoomTypeId === 4 || DynamicStatusarray.RoomTypeId === 10 || DynamicStatusarray.RoomTypeId == 12) && DynamicStatusarray.Status == 'Waiting') {
                        var r = alertify.confirm(
                            "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre pl-20 pr-20'>Patient is " + DynamicStatusarray.Status + " at " + DynamicStatusarray.RoomType + " ,Do you want to move patient to your active room or work offline? </h4>",
                            function () {
                                $scope.isofflinebilling = false;
                                $scope.updateAppointmentPatientTrackerstatus();
                            }, function () {
                                $scope.isofflinebilling = true;
                                return false;
                            });
                    }
                    else if (($scope.userLoginDetails.RoleID == 2 || $scope.userLoginDetails.RoleID == 19) && (DynamicStatusarray.RoomTypeId == 9 || DynamicStatusarray.RoomTypeId == 10) && DynamicStatusarray.Status == 'Waiting') {
                        $scope.isofflinebilling = false;
                        $scope.updateAppointmentPatientTrackerstatus();
                    }
                    else if (($scope.userLoginDetails.RoleID == 2 || $scope.userLoginDetails.RoleID == 19) && (DynamicStatusarray.RoomTypeId !== 9 && DynamicStatusarray.RoomTypeId !== 10) && DynamicStatusarray.Status == 'Active') {

                        //$scope.ShowConfirmString = "Patient is active at " + DynamicStatusarray.UserName + ", will you continue offline?";

                        //$scope.mInstanceAdd2 = $uibModal.open({
                        //    "templateUrl": "ConfirmBox.html",
                        //    "backdrop": "static",
                        //    "scope": $scope,
                        //    "keyboard": false,
                        //    "size": "md",
                        //    "controller": function ($scope, $uibModal, $uibModalInstance) {
                        //        $scope.onClickSelectedOffline = function () {
                        //            $scope.isofflinebilling = true;
                        //            $uibModalInstance.dismiss("cancel");
                        //        }
                        //        $scope.onClickClosepopup = function () {
                        //            $scope.isofflinebilling = false;
                        //            $scope.updateAppointmentPatientTrackerstatus();
                        //            $uibModalInstance.dismiss("cancel");
                        //        }
                        //    }
                        //});
                        var r = alertify.confirm(
                            "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre pl-20 pr-20'>Patient is active at " + DynamicStatusarray.UserName + ", will you continue offline? </h4>",
                            function () {
                                $scope.isofflinebilling = true;

                            }, function () {
                                $scope.isofflinebilling = true;
                                var url = "/op";
                                $location.url(url);
                                //  $scope.ChangeTab(1);
                                return false;
                            });
                    }
                    else if (($scope.userLoginDetails.RoleID == 19) && (DynamicStatusarray.RoomTypeId == 10) && DynamicStatusarray.Status == 'Active') {
                        var r = alertify.confirm(
                            "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre pl-20 pr-20'>You are trying to modify the patient data which is being worked by " + DynamicStatusarray.UserName + ", by clicking yes, data entered by them will be replaced with your data </h4>",
                            function () {
                                $scope.RoomTypeId = null;
                                if ($scope.userLoginDetails.RoleID == 1 || $scope.userLoginDetails.RoleID == 43) {
                                    var SuffixId = doctorinfo.doctordata.User[0].SuffixId || 0;
                                    $scope.RoomTypeId = 1;
                                    if (SuffixId == 13) { //optha
                                        $scope.RoomTypeId = 12;
                                    }
                                    if (SuffixId == 10) { //doctor
                                        $scope.RoomTypeId = 1;
                                    }

                                }
                                else if ($scope.userLoginDetails.RoleID == 10) {
                                    $scope.RoomTypeId = 2;
                                }
                                else if ($scope.userLoginDetails.RoleID == 2) {
                                    $scope.RoomTypeId = 10;
                                }
                                else if ($scope.userLoginDetails.RoleID == 19) {
                                    $scope.RoomTypeId = 9;
                                } else {
                                    $scope.RoomTypeId = null;
                                }
                                $scope.CurrentTime = $filter("date")(new Date(), "HH:mm:ss");
                                var params = {
                                    "UserId": eHnoteMasterDataService.getLoginId(),
                                    "HospitalId": $scope.HospitalId,
                                    "AppointmentId": $scope.cacheStorageItem.appointmentid,
                                    "AppointmentTrackerDetailId": 0,
                                    "RoleId": $scope.userLoginDetails.RoleID,
                                    "DoctorId": null,
                                    "DoctorRoleId": null,
                                    "RoomTypeId": $scope.RoomTypeId,
                                    "RoomId": null,
                                    "CurrentTime": $scope.CurrentTime,
                                    "IsSendTo": "Y",
                                    "IsRollBack": "N",
                                    "IsCheckedIn": "N",
                                    "IsCheckedOut": "N",
                                    "IsReCheckIn": "N",
                                    "IsReCheckOut": "N"
                                }
                                eHnoteMainAppointmentService.AddUpdateAppointmentTrackerDetails(params).then(function (resp) {
                                    if (resp.data.Status == "Success") {
                                        $scope.CurrentTime = $filter("date")(new Date(), "HH:mm:ss");
                                        var params = {
                                            "UserId": eHnoteMasterDataService.getLoginId(),
                                            "HospitalId": $scope.HospitalId,
                                            "AppointmentId": $scope.cacheStorageItem.appointmentid,
                                            "AppointmentTrackerDetailId": 0,
                                            "RoleId": $scope.userLoginDetails.RoleID,
                                            "DoctorId": null,
                                            "DoctorRoleId": null,
                                            "RoomTypeId": $scope.RoomTypeId,
                                            "RoomId": null,
                                            "CurrentTime": $scope.CurrentTime,
                                            "IsSendTo": "N",
                                            "IsRollBack": "N",
                                            "IsCheckedIn": "N",
                                            "IsCheckedOut": "N",
                                            "IsReCheckIn": "N",
                                            "IsReCheckOut": "N"
                                        }
                                        eHnoteMainAppointmentService.AddUpdateAppointmentTrackerDetails(params).then(function (resp) {
                                            if (resp.data.Status == "Success") {

                                            } else {
                                                //  alertify.error("Patient is Active at Doctor,You Can't Send Patient");
                                                alertify.error("Patient is Active at Another User,You Can't Send Patient");
                                            }
                                        }, function (err) {
                                            console.log(err);
                                            alertify.error("Getting Failed");
                                        });


                                    }
                                }, function (err) {
                                    console.log(err);
                                    alertify.error("Getting Failed");
                                });
                            },
                            function () {
                                $scope.isofflinebilling = true;
                                var url = "/op";
                                $location.url(url);
                                //  $scope.ChangeTab(1);
                                return false;
                            });
                    }
                    else if (($scope.userLoginDetails.RoleID == 2) && (DynamicStatusarray.RoomTypeId == 9) && DynamicStatusarray.Status == 'Active') {
                        var r = alertify.confirm(
                            "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre pl-20 pr-20'>You are trying to modify the patient data which is being worked by " + DynamicStatusarray.UserName + ", by clicking yes, data entered by them will be replaced with your data </h4>",
                            function () {
                                $scope.RoomTypeId = null;
                                if ($scope.userLoginDetails.RoleID == 1 || $scope.userLoginDetails.RoleID == 43) {
                                    var SuffixId = doctorinfo.doctordata.User[0].SuffixId || 0;
                                    $scope.RoomTypeId = 1;
                                    if (SuffixId == 13) { //optha
                                        $scope.RoomTypeId = 12;
                                    }
                                    if (SuffixId == 10) { //doctor
                                        $scope.RoomTypeId = 1;
                                    }

                                }
                                else if ($scope.userLoginDetails.RoleID == 10) {
                                    $scope.RoomTypeId = 2;
                                }
                                else if ($scope.userLoginDetails.RoleID == 2) {
                                    $scope.RoomTypeId = 10;
                                }
                                else if ($scope.userLoginDetails.RoleID == 19) {
                                    $scope.RoomTypeId = 9;
                                } else {
                                    $scope.RoomTypeId = null;
                                }
                                $scope.CurrentTime = $filter("date")(new Date(), "HH:mm:ss");
                                var params = {
                                    "UserId": eHnoteMasterDataService.getLoginId(),
                                    "HospitalId": $scope.HospitalId,
                                    "AppointmentId": $scope.cacheStorageItem.appointmentid,
                                    "AppointmentTrackerDetailId": 0,
                                    "RoleId": $scope.userLoginDetails.RoleID,
                                    "DoctorId": null,
                                    "DoctorRoleId": null,
                                    "RoomTypeId": $scope.RoomTypeId,
                                    "RoomId": null,
                                    "CurrentTime": $scope.CurrentTime,
                                    "IsSendTo": "Y",
                                    "IsRollBack": "N",
                                    "IsCheckedIn": "N",
                                    "IsCheckedOut": "N",
                                    "IsReCheckIn": "N",
                                    "IsReCheckOut": "N"
                                }
                                eHnoteMainAppointmentService.AddUpdateAppointmentTrackerDetails(params).then(function (resp) {
                                    if (resp.data.Status == "Success") {
                                        $scope.CurrentTime = $filter("date")(new Date(), "HH:mm:ss");
                                        var params = {
                                            "UserId": eHnoteMasterDataService.getLoginId(),
                                            "HospitalId": $scope.HospitalId,
                                            "AppointmentId": $scope.cacheStorageItem.appointmentid,
                                            "AppointmentTrackerDetailId": 0,
                                            "RoleId": $scope.userLoginDetails.RoleID,
                                            "DoctorId": null,
                                            "DoctorRoleId": null,
                                            "RoomTypeId": $scope.RoomTypeId,
                                            "RoomId": null,
                                            "CurrentTime": $scope.CurrentTime,
                                            "IsSendTo": "N",
                                            "IsRollBack": "N",
                                            "IsCheckedIn": "N",
                                            "IsCheckedOut": "N",
                                            "IsReCheckIn": "N",
                                            "IsReCheckOut": "N"
                                        }
                                        eHnoteMainAppointmentService.AddUpdateAppointmentTrackerDetails(params).then(function (resp) {
                                            if (resp.data.Status == "Success") {

                                            } else {
                                                //  alertify.error("Patient is Active at Doctor,You Can't Send Patient");
                                                alertify.error("Patient is Active at Another User,You Can't Send Patient");
                                            }
                                        }, function (err) {
                                            console.log(err);
                                            alertify.error("Getting Failed");
                                        });


                                    }
                                }, function (err) {
                                    console.log(err);
                                    alertify.error("Getting Failed");
                                });
                            },
                            function () {
                                $scope.isofflinebilling = true;
                                var url = "/op";
                                $location.url(url);
                                //  $scope.ChangeTab(1);
                                return false;
                            });
                    }
                    //else if (($scope.userLoginDetails.RoleID == 19) && (DynamicStatusarray.RoomTypeId !== 1 || DynamicStatusarray.RoomTypeId !== 2|| DynamicStatusarray.RoomTypeId !== 4 || DynamicStatusarray.RoomTypeId !== 10) && DynamicStatusarray.Status == 'Active') {
                    //    var r = alertify.confirm(
                    //        "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre pl-20 pr-20'>Patient is " + DynamicStatusarray.Status + " at " + DynamicStatusarray.UserName + " ,Do you want to move patient to your active room or work offline? </h4>",
                    //        function () {
                    //            $scope.RoomTypeId = null;
                    //            if ($scope.userLoginDetails.RoleID == 1 || $scope.userLoginDetails.RoleID == 43) {
                    //                var SuffixId = doctorinfo.doctordata.User[0].SuffixId || 0;
                    //                $scope.RoomTypeId = 1;
                    //                if (SuffixId == 13) { //optha
                    //                    $scope.RoomTypeId = 12;
                    //                }
                    //                if (SuffixId == 10) { //doctor
                    //                    $scope.RoomTypeId = 1;
                    //                }

                    //            } else if ($scope.userLoginDetails.RoleID == 10) {
                    //                $scope.RoomTypeId = 2;
                    //            }
                    //            else if ($scope.userLoginDetails.RoleID == 2) {
                    //                $scope.RoomTypeId = 10;
                    //            }
                    //            else if ($scope.userLoginDetails.RoleID == 19) {
                    //                $scope.RoomTypeId = 9;
                    //            } else {
                    //                $scope.RoomTypeId = null;
                    //            }                      
                    //            $scope.CurrentTime = $filter("date")(new Date(), "HH:mm:ss");
                    //            var params = {
                    //                "UserId": eHnoteMasterDataService.getLoginId(),
                    //                "HospitalId": $scope.HospitalId,
                    //                "AppointmentId": $scope.cacheStorageItem.appointmentid,
                    //                "AppointmentTrackerDetailId": 0,
                    //                "RoleId": $scope.userLoginDetails.RoleID,
                    //                "DoctorId": null,
                    //                "DoctorRoleId": null,
                    //                "RoomTypeId": $scope.RoomTypeId,
                    //                "RoomId": null,
                    //                "CurrentTime": $scope.CurrentTime,
                    //                "IsSendTo": "Y",
                    //                "IsRollBack": "N",
                    //                "IsCheckedIn": "N",
                    //                "IsCheckedOut": "N",
                    //                "IsReCheckIn": "N",
                    //                "IsReCheckOut": "N"
                    //            }                             
                    //            eHnoteMainAppointmentService.AddUpdateAppointmentTrackerDetails(params).then(function (resp) {
                    //                if (resp.data.Status == "Success") {
                    //                    $scope.CurrentTime = $filter("date")(new Date(), "HH:mm:ss");
                    //                    var params = {
                    //                        "UserId": eHnoteMasterDataService.getLoginId(),
                    //                        "HospitalId": $scope.HospitalId,
                    //                        "AppointmentId": $scope.cacheStorageItem.appointmentid,
                    //                        "AppointmentTrackerDetailId": 0,
                    //                        "RoleId": $scope.userLoginDetails.RoleID,
                    //                        "DoctorId": null,
                    //                        "DoctorRoleId": null,
                    //                        "RoomTypeId": $scope.RoomTypeId,
                    //                        "RoomId": null,
                    //                        "CurrentTime": $scope.CurrentTime,
                    //                        "IsSendTo": "N",
                    //                        "IsRollBack": "N",
                    //                        "IsCheckedIn": "N",
                    //                        "IsCheckedOut": "N",
                    //                        "IsReCheckIn": "N",
                    //                        "IsReCheckOut": "N"
                    //                    }
                    //                    eHnoteMainAppointmentService.AddUpdateAppointmentTrackerDetails(params).then(function (resp) {
                    //                        if (resp.data.Status == "Success") {

                    //                        } else {
                    //                            //  alertify.error("Patient is Active at Doctor,You Can't Send Patient");
                    //                            alertify.error("Patient is Active at Another User,You Can't Send Patient");
                    //                        }
                    //                    }, function (err) {
                    //                        console.log(err);
                    //                        alertify.error("Getting Failed");
                    //                    });


                    //                }
                    //            }, function (err) {
                    //                console.log(err);
                    //                alertify.error("Getting Failed");
                    //            });
                    //        }, function () {
                    //            $scope.isofflinebilling = true;
                    //            return false;
                    //        });
                    //}


                }
            }, function (err) {
                console.log(err);
                alertify.error("Getting Failed");
            });


        }


        $scope.GetOrganizationFacilitiesNew(1);
    };
    $scope.isDiagFromRcopia = true;


    $scope.onParticularInvoiceClick = function (obj, accordianstatus) {

        //if (!accordianstatus) {
        $scope.mainBillingObject = $scope.getMainBillingObject();
        $scope.mainBillingObject.BillingDetail = [];
        $scope.mainBillingObject.BillingHistoryDetails = [];
        $scope.mainBillingObject.ShowPaymentDetails = false;
        $scope.mainBillingObject.BillingHistoryId = obj.BillingHistoryId;
        $scope.mainBillingObject.InvoiceId = obj.InvoiceId;
        $scope.mainBillingObject.AppointmentID = obj.AppointmentId;
        $scope.getInvoiceItemsById(obj);
        var isCurrentMonth = eHnoteProcedureDataService.checkCurrentmonth(obj.CurrentDate, obj.CreatedDt, $scope.SpecializationId);
        obj.isCurrentMonth = isCurrentMonth;
        if (obj.HospitalId === $scope.HospitalID) {
            obj.isBilledHospital = true;
        }



    };


    $scope.getInvoiceItemsById = function (obj) {

        eHnotePatientDataService.GetPatientInvoiceItemsbyId(obj.BillingHistoryId, 0).then(function (resp) {
            restructureInvoiceItems(resp, obj);
        }, function (err) {
            console.log(err);
        });

    };


    function restructureInvoiceItems(resp, obj) {
        $scope.mainBillingObject.BillingHistoryDetails = [];


        if (resp !== undefined) {
            var data = resp.data;
            $scope.BillingCategoryType = resp.data.BillingCategoryType;
            $scope.PaymentType = resp.data.PaymentType;

            console.log(resp.data);
            $scope.BillingCategoryType = resp.data.BillingCategoryType;
            $scope.PaymentType = resp.data.PaymentType;
            if (data.BillingDetails !== undefined) {
                if (data.BillingDetails.length > 0) {
                    angular.forEach(data.BillingDetails, function (item, index) {


                        item.RowId = index + 1;
                        item.IsBilledItem = "Y";
                        item.PreviousBill = "Y";
                        item.IsIncluded = true;
                        item.IsConsultationBilling = false;
                        item.ProcedureHistoryId = 0;

                        if (item.selectedParticular === undefined || item.selectedParticular === "") {
                            item.selectedParticular = {
                                "ProcedureMaxCost": item.ProcedureCost,
                                "ProcedureName": item.ProcedureName,
                                "ProcedureId": item.ProcedureId,
                                "ActiveIND": "Y"
                            };
                        }
                        item.BillDate = moment(item.BillingDate).format("DD-MMM-YYYY");

                        item.selectedParticular = item.ProcedureName;


                        item.ConversionDoctorId = item.ConversionDoctorId || 0;
                        item.TreatmentDoctorId = item.TreatmentDoctorId || 0;
                        item.ConsultantDoctorId = item.ConsultantDoctorId || 0;
                        item.SalesPersonId = item.SalesPersonId || 0;
                        item.TherapistId = item.TherapistId || 0;
                        item.ConversionDoctorName = "";
                        item.TreatmentDoctorName = "";
                        item.ConsultantDoctorName = "";
                        item.SalesPersonName = "";
                        item.TherapistName = "";

                        if (item.Gst > 0) {
                            item.showIncludeTax = true;
                            item.Gst = item.Gst.toString();
                        }



                        item.TeethArray = _.pluck(item.TeethArray, "value");
                        item.TeethArray = _.sortBy(item.TeethArray, function (num) { return num; });


                        if (item.TeethArray.length === 0) {
                            item.TeethArray = null;
                        } else {
                            item.TeethArray = "Teeths: " + item.TeethArray.join(",") || null;
                        }







                        var array = [];
                        if (item.ConversionDoctorId !== 0) {
                            array = $filter("filter")($scope.clinicDoctorList, { "DoctorID": item.ConversionDoctorId }, true);
                            if (array.length > 0) {
                                item.ConversionDoctorName = array[0].FullName;
                            }
                        }


                        if (item.TreatmentDoctorId !== 0) {
                            array = $filter("filter")($scope.clinicDoctorList, { "DoctorID": item.TreatmentDoctorId }, true);
                            if (array.length > 0) {
                                item.TreatmentDoctorName = array[0].FullName;
                            }
                        }
                        if (item.ConsultantDoctorId !== 0) {
                            array = $filter("filter")($scope.clinicDoctorList, { "DoctorID": item.ConsultantDoctorId }, true);
                            if (array.length > 0) {
                                item.ConsultantDoctorName = array[0].FullName;
                            }
                        }

                        if (item.SalesPersonId !== 0) {
                            array = $filter("filter")($scope.clinicDoctorList, { "DoctorID": item.SalesPersonId }, true);
                            if (array.length > 0) {
                                item.SalesPersonName = array[0].FullName;
                            }
                        }

                        if (item.TherapistId !== 0) {
                            array = $filter("filter")($scope.clinicDoctorList, { "DoctorID": item.TherapistId }, true);
                            if (array.length > 0) {
                                item.TherapistName = array[0].FullName;
                            }
                        }

                        item.ProcedureId = item.ProcedureID || 0;
                        item.OrganizationProcedureId = item.OrganizationProcedureId || 0;
                        item.TotalAmountReceived = item.TotalAmountReceived || 0;

                        //if (item.ProcedureTypeId === 8) {
                        //    item.ProcedureTypeName = 'Inventory';
                        //} else {
                        //    var pdata = $filter("filter")($scope.ProcedureListTypes, { "Id": item.ProcedureTypeId }, true)[0];
                        //    item.ProcedureTypeName = pdata.Name;
                        //}

                        var obj = {
                            "IsInvoiceCancelled": false
                        }

                        if (obj.IsInvoiceCancelled) {
                            $scope.mainBillingObject.BillingDetail.push(item);
                        } else {
                            if (item.DeleteInd) {
                                $scope.mainBillingObject.DeletedBillItems.push(item);
                            } else {
                                $scope.mainBillingObject.BillingDetail.push(item);
                            }
                        }



                    });
                }
            }
            if (data.BillingHistoryDetails != undefined && data.BillingHistoryDetails.length > 0) {
                $scope.mainBillingObject.BillingHistoryDetails = angular.copy(data.BillingHistoryDetails);

                angular.forEach($scope.mainBillingObject.BillingHistoryDetails, function (item, ind) {
                    item.isReceiptBilledHospital = false;
                    if (item.HospitalId === $scope.HospitalID) {
                        item.isReceiptBilledHospital = true;
                    }
                });
            }

            $scope.mainBillingObject.TotalBalance = data.TotalBalance;
            $scope.mainBillingObject.TempReceivedAmt = data.TotalBalance;
            $scope.mainBillingObject.TotalReceivedAmount = data.TotalReceivedAmount;
            $scope.mainBillingObject.PreviousPaidAmount = checkRoundVal(data.TotalReceivedAmount);
            $scope.mainBillingObject.isTotalPaid = data.TotalNetAmount - data.TotalReceivedAmount === 0 ? true : false;
            $scope.mainBillingObject.AppointmentID = data.AppointmentId;
            $scope.mainAppointmentId = data.AppointmentId;
            $scope.mainBillingObject.BillID = data.BillingId;
            $scope.mainBillingObject.AppointmentDate = data.AppointmentDate;
            $scope.mainBillingObject.AdmissionId = obj.AdmissionId;
            $scope.mainBillingObject.AdmissionNumber = obj.AdmissionNumber;
            $scope.mainBillingObject.AdmissionDate = obj.AdmissionDate;
            $scope.mainBillingObject.DischargeDate = obj.DischargeDate;
            $scope.mainBillingObject.BillingTypeId = obj.BillingTypeId;
            $scope.mainBillingObject.InvoiceNumber = obj.InvoiceId;
            $scope.mainBillingObject.ZeroBillingRemarks = data.ZeroBillingRemarks;
            $scope.mainBillingObject.IsCreditBill = data.IsCreditBill;
            $scope.mainBillingObject.OrgInsuranceTpaId = data.OrgInsuranceTpaId;
            $scope.mainBillingObject.SurgeonName = data.SurgeonName;




            $scope.selectedInsuranceTpaObj = "";
            if ($scope.mainBillingObject.OrgInsuranceTpaId !== 0) {
                eHnoteInsuranceService.getPatientInsuranceDtls($scope.cacheStorageItem.PatientID, 1).then(function (response) {
                    console.log(response);
                    $scope.patientInsuranceTpasArray = [];
                    if (response.data !== undefined) {
                        if (response.data.rows !== undefined) {
                            $scope.patientInsuranceTpasArray = response.data.rows;
                            angular.forEach($scope.patientInsuranceTpasArray, function (item) {
                                if (item.OrgInsuranceTpaId === data.OrgInsuranceTpaId) {
                                    $scope.selectedInsuranceTpaObj = item;
                                    console.log($scope.selectedInsuranceTpaObj);
                                    $scope.selectedBillingCategoryTypeId = item.BillingCategoryTypeId;
                                    $scope.selectedBillingModeId = 2;
                                    $scope.IsCreditBill = true;
                                    $scope.IsCreditBillingType = 'Yes';
                                    $scope.PatientInsuranceDetailId = item.PatientInsuranceDetailId;

                                }
                            })
                        }
                    }
                });
            }


        }


        angular.forEach($scope.patientInvoicesArray, function (pitem) {
            if (pitem.BillingHistoryId === obj.BillingHistoryId) {
                angular.forEach($scope.mainBillingObject.BillingHistoryDetails, function (item, ind) {
                    if (obj.HospitalId !== item.HospitalId) {
                        pitem.isBilledHospital = false;
                    }
                });
            }
        });
        var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
        appointmentinfo.DoctorFullName = obj.DoctorName;
        appointmentinfo.HospitalName = obj.HospitalName;
        appointmentinfo.BranchMobile = obj.BranchMobile;
        appointmentinfo.BranchEmail = obj.BranchEmail;
        appointmentinfo.BranchAddress1 = obj.BranchAddress1;
        appointmentinfo.BranchAddress2 = obj.BranchAddress2;



        eHnoteMasterDataService.addAppointmentInfo(appointmentinfo);


        angular.forEach($scope.mainBillingObject.BillingDetail, function (item, ind) {
            $scope.CalculateTotalAmount(item, ind);
        });




        var GSTDiscountObject = eHnoteProcedureDataService.DiscountOrGSTEnabledObject($scope.mainBillingObject.BillingDetail);

        $scope.mainBillingObject.IsDiscountChecked = GSTDiscountObject.IsDiscountChecked;
        $scope.mainBillingObject.IsGSTChecked = GSTDiscountObject.IsGSTChecked;

        if ($scope.mainBillingObject.IsCreditBill === true && $scope.Billingpageno === 5) {
            $scope.mainBillingObject.TotalBalance = data.TotalBalance;
        }

        $scope.HCFAPrintDetailsObj = $scope.GetHCFAPrintDetailsObj();
        if (resp !== undefined) {
            if (data.BillingDetails !== undefined && data.BillingDetails.length > 0) {
                $scope.HCFAPrintDetailsObj.ProcedureListObj = angular.copy(data.BillingDetails);
            }
            if (data.DiagnosisList != undefined && data.DiagnosisList.length > 0) {
                $scope.HCFAPrintDetailsObj.DiagnosisListObj = angular.copy(data.DiagnosisList);
            }
        }
    };

    $scope.ProcedureListTypes = [];
    $scope.AllProcedureListTypes = [];
    $scope.CardTypeDetails = [];
    $scope.patientBillIdsArray = [];


    getMasterProcedureTypes();
    getMasterCardTypes();

    function getMasterProcedureTypes() {
        eHnoteProcedureDataService.getProcedureType(onsuccessProc, onfailureProc);
        function onsuccessProc(data) {
            $scope.ProcedureListTypes = angular.copy(data);
            $scope.AllProcedureListTypes = angular.copy(data);

            for (var i = $scope.ProcedureListTypes.length - 1; i >= 0; i--) {
                if ($scope.ProcedureListTypes[i].Id === 8) {
                    $scope.ProcedureListTypes.splice(i, 1);
                }
            }

            for (var i = $scope.AllProcedureListTypes.length - 1; i >= 0; i--) {
                if ($scope.AllProcedureListTypes[i].Id === 8 || $scope.AllProcedureListTypes[i].Id === 5 || $scope.AllProcedureListTypes[i].Id === 9 || $scope.AllProcedureListTypes[i].Id === 10) {
                    $scope.AllProcedureListTypes.splice(i, 1);
                }
            }

            if ($scope.SpecializationId !== 2) {
                for (var i = $scope.AllProcedureListTypes.length - 1; i >= 0; i--) {
                    if ($scope.AllProcedureListTypes[i].Id === 2) {
                        $scope.AllProcedureListTypes.splice(i, 1);
                    }
                }
            }
        }
        function onfailureProc(err) {
            console.log(err);
        }
    }
    function getMasterCardTypes() {
        eHnotePatientAddressDataServices.getCardTypes(getCardTypeSuccess, getCardTypeFailed);
        function getCardTypeSuccess(data) {
            $scope.CardTypeDetails = data;
            $scope.selectedCardType = $scope.CardTypeDetails[0].Id;
        }
        function getCardTypeFailed(err) {
            console.log(err);
        }
    }
    $scope.CalculateTotalAmount = function (subitem, index) {




        var totalAmount = 0;
        var Cgst = parseFloat(subitem.Cgst) || 0;
        var Sgst = parseFloat(subitem.Sgst) || 0;
        var DiscountCost = 0;
        var Multiplyfactor = parseFloat(subitem.Multiplyfactor) || 0;
        var ProcedureCost = parseFloat(subitem.ProcedureCost) || 0;
        totalAmount = ProcedureCost * Multiplyfactor;


        subitem.Tax = totalAmount - (totalAmount * (100 / (100 + parseFloat(subitem.Gst))));
        subitem.Tax = parseFloat(subitem.Tax) || 0;
        $scope.mainBillingObject.BillingDetail[index].Total = totalAmount;

        $scope.mainBillingObject.BillingDetail[index].TotalwithoutTax = totalAmount - subitem.Tax;

        subitem.GstAmount = parseFloat(subitem.Tax.toFixed(2));
        subitem.NetAmount = $scope.mainBillingObject.BillingDetail[index].TotalwithoutTax;







        if ($scope.mainBillingObject.includeAdvanceAmount) {
            $scope.mainBillingObject.PayableAdvanceAmount = 0;
            angular.forEach($scope.mainBillingObject.Payments, function (item, index) {
                if (item.PaymentModeId === 18) {
                    $scope.mainBillingObject.Payments.splice(index, 1);
                } else {
                    item.Amount = "";
                }
            });
        }


        $scope.SumAmount($scope.mainBillingObject);
        $scope.mainBillingObject.includeAdvanceAmount = false;
        //Remove Advance Amount Object From Paymnets Array
        if (!$scope.editinvoice) {
            $scope.mainBillingObject.Payments = $filter("filter")($scope.mainBillingObject.Payments, function (item, index) { return item.PaymentModeId !== 18; }) || [];
        }
        // IsIncludePatientAdvance(false, 1);
        if (!$scope.editinvoice) {
            $scope.mainBillingObject.PayableAdvanceAmount = 0;
            $scope.mainBillingObject.TotalCollectedAmount = 0;
        }
        $scope.mainBillingObject.DueAfterAdvanceAmt = 0;

    };

    $scope.SumAmount = function (mainitem) {



        var val = 0, valWithouitTax = 0;

        var totalgstval = 0;
        mainitem.TotalGST = 0;
        mainitem.TotalAmountToBeCollected = 0;

        //if (!$scope.editinvoice) {
        //    $scope.mainBillingObject.TotalBilledCost = 0;//
        //}

        mainitem.TotalWaviedOffAmount = 0;


        if (mainitem.BillingDetail && mainitem.BillingDetail.length > 0) {
            mainitem.BillingDetail.forEach(function (element) {
                if (element.IsIncluded) {
                    element.TotalwithoutTax = element.TotalwithoutTax || 0;
                    element.Total = element.Total || 0;
                    val += element.Total;
                    mainitem.TotalGST += element.Tax;
                    valWithouitTax += element.TotalwithoutTax;
                    mainitem.TotalAmountToBeCollected += parseFloat(element.BilledCost) || 0;
                } else {
                    element.BilledCost = "";
                }
                if (element.IsWaved) {
                    mainitem.TotalWaviedOffAmount += parseFloat(element.WaviedOffAmount) || 0;
                }
            });
        }


        angular.forEach(mainitem.BillingDetail, function (item) {
            item.Total = item.Total || 0;
            item.DiscountAmount = item.DiscountAmount || 0;
            item.DiscountCost = item.DiscountCost || 0;
            item.Total = roundto2decimals(item.Total, 2);
            item.DiscountCost = roundto2decimals(item.DiscountCost, 2);
            item.DiscountAmount = roundto2decimals(item.DiscountAmount, 2);
        });


        $scope.tempIndividualTotalAmt = checkRoundVal(mainitem.TotalAmountToBeCollected);



        mainitem.TotalSubAmount = roundto2decimals(valWithouitTax, 2);
        mainitem.TotalGST = roundto2decimals(mainitem.TotalGST, 2);


        mainitem.disableDiscount = mainitem.TotalGST === 0 ? false : true;
        mainitem.DiscountValue = mainitem.disableDiscount ? 0 : checkRoundVal(mainitem.DiscountValue);

        if ($scope.editBillingItemandCost) {
            mainitem.TotalWaviedOffAmount = roundto2decimals(mainitem.TotalWaviedOffAmount, 2);
            mainitem.TotalReceivedAmount = angular.copy(mainitem.TotalBilledCost + checkRoundVal(mainitem.PreviousPaidAmount));
            mainitem.TotalNetAmount = checkRoundVal(val - mainitem.TotalWaviedOffAmount);
            mainitem.TotalBalance = checkRoundVal(val);
            mainitem.TotalBalance = checkRoundVal(mainitem.TotalNetAmount - mainitem.TotalReceivedAmount);
        }

        if (mainitem.Mode === 'Add' || mainitem.Mode === 'Update') {
            mainitem.TotalWaviedOffAmount = roundto2decimals(mainitem.TotalWaviedOffAmount, 2);
            mainitem.TotalReceivedAmount = angular.copy(mainitem.TotalBilledCost + checkRoundVal(mainitem.PreviousPaidAmount));
            mainitem.TotalNetAmount = checkRoundVal(val - mainitem.TotalWaviedOffAmount);
            mainitem.TotalBalance = checkRoundVal(val);
            mainitem.TotalBalance = checkRoundVal(mainitem.TotalNetAmount - mainitem.TotalReceivedAmount);
        }

        if (mainitem.Mode === 'Edit') {






            mainitem.TotalWaviedOffAmount = roundto2decimals(mainitem.TotalWaviedOffAmount, 2);

            mainitem.TotalNetAmount = checkRoundVal(val - mainitem.TotalWaviedOffAmount);

            if (mainitem.includePreviousPaiAmount) {
                var totalpayable = mainitem.TotalNetAmount;



            }
            mainitem.TotalReceivedAmount = angular.copy(mainitem.TotalBilledCost + checkRoundVal(mainitem.PreviousPaidAmount));
            mainitem.TotalBalance = checkRoundVal(mainitem.TotalNetAmount - mainitem.TotalReceivedAmount);



        }

        if (totalgstval !== 0) {
            mainitem.DiscountValue = 0;
        }
        if (mainitem.DiscountValue && checkRoundVal(mainitem.DiscountValue) !== 0) {
            $scope.discountChange(mainitem);
        }

        //var TotalBilledCost = parseFloat($scope.mainBillingObject.TotalBilledCost) || 0;
        //$scope.mainBillingObject.TotalBilledCost = TotalBilledCost === 0 ? "0" : TotalBilledCost;// added by sabarish



        if (mainitem.Mode === 'Add') {
            angular.forEach($scope.mainBillingObject.Payments, function (item) {
                item.Amount = "";
                item.IsActive = false;
                item.CardNumber = "";
                item.CardTypeId = 1;
                item.NameonCard = "";
                item.VallidTill = "";
                item.ChequeNumber = "";
                item.BankName = "";
                item.TransactionNumber = "";
                item.IsPaymentModeSelected = false;
                item.IsDefaultPaymentMode = false;
                item.OtherDetailsDiv = false;
                if (item.PaymentModeId === 1) {
                    item.IsActive = true;
                }
            });
        }
    };

    $scope.GetHCFAPrintDetailsObj = function () {
        var obj = {
            "DiagnosisListObj": "",
            "ProcedureListObj": ""
        };
        return obj;
    }
    $scope.HCFAPrintDetailsObj = $scope.GetHCFAPrintDetailsObj();

    $scope.getDiagnosisListArray = function () {
        $scope.DiagnosisListArray = [
            {
                "DiagnosisId": 0,
                "ICD10Code": "",
                "Type": 'A',
                "Description": "",
                "SelectedCode": "",
                "IsFavouriteInd": false,
                "IsDiagnosisInd": false,
                "selectedDiagnosisObj": ""

            },
            {
                "DiagnosisId": 0,
                "ICD10Code": "",
                "Description": "",
                "Type": 'B',
                "SelectedCode": "",
                "IsDiagnosisInd": false,
                "IsFavouriteInd": false,
                "selectedDiagnosisObj": ""
            },
            {
                "DiagnosisId": 0,
                "ICD10Code": "",
                "Description": "",
                "Type": 'C',
                "SelectedCode": "",
                "IsDiagnosisInd": false,
                "IsFavouriteInd": false,
                "selectedDiagnosisObj": ""
            },
            {
                "DiagnosisId": 0,
                "ICD10Code": "",
                "Description": "",
                "Type": 'D',
                "SelectedCode": "",
                "IsDiagnosisInd": false,
                "IsFavouriteInd": false,
                "selectedDiagnosisObj": ""
            },
            {
                "DiagnosisId": 0,
                "ICD10Code": "",
                "Description": "",
                "Type": 'E',
                "SelectedCode": "",
                "IsDiagnosisInd": false,
                "IsFavouriteInd": false,
                "selectedDiagnosisObj": ""
            },
            {
                "DiagnosisId": 0,
                "ICD10Code": "",
                "Description": "",
                "Type": 'F',
                "SelectedCode": "",
                "IsDiagnosisInd": false,
                "IsFavouriteInd": false,
                "selectedDiagnosisObj": ""
            },
            {
                "DiagnosisId": 0,
                "ICD10Code": "",
                "Description": "",
                "Type": 'G',
                "SelectedCode": "",
                "IsDiagnosisInd": false,
                "IsFavouriteInd": false,
                "selectedDiagnosisObj": ""
            },
            {
                "DiagnosisId": 0,
                "ICD10Code": "",
                "Description": "",
                "Type": 'H',
                "SelectedCode": "",
                "IsDiagnosisInd": false,
                "IsFavouriteInd": false,
                "selectedDiagnosisObj": ""
            },
            {
                "DiagnosisId": 0,
                "ICD10Code": "",
                "Description": "",
                "Type": 'I',
                "SelectedCode": "",
                "IsDiagnosisInd": false,
                "IsFavouriteInd": false,
                "selectedDiagnosisObj": ""
            },
            {
                "DiagnosisId": 0,
                "ICD10Code": "",
                "Description": "",
                "Type": 'J',
                "SelectedCode": "",
                "IsDiagnosisInd": false,
                "IsFavouriteInd": false,
                "selectedDiagnosisObj": ""
            },
            {
                "DiagnosisId": 0,
                "ICD10Code": "",
                "Description": "",
                "Type": 'K',
                "SelectedCode": "",
                "IsDiagnosisInd": false,
                "IsFavouriteInd": false,
                "selectedDiagnosisObj": ""

            },
            {
                "DiagnosisId": 0,
                "ICD10Code": "",
                "Description": "",
                "Type": 'L',
                "SelectedCode": "",
                "IsDiagnosisInd": false,
                "IsFavouriteInd": false,
                "selectedDiagnosisObj": ""
            }
        ];
    }
    $scope.getDiagnosisListArray();
    $scope.biilobj = {
        "Type": 1,
    }
    $scope.GetPaymentObject = function () {
        return {
            "PaymentModeId": "0",
            "PaymentModeName": "",
            "PatientBillTypeId": "1",
            "Date": $filter("date")(new Date(), "yyyy-MM-dd"),
            "Amount": "",
            "TraceId": "",
            "Traceobj": "",
            "DiscountCost": null,
            "PaymentReasonId": null,
            "CardNumber": "",
            "CardTypeId": 1,
            "NameonCard": "",
            "VallidTill": "",
            "ChequeNumber": "",
            "BankName": "",
            "TransactionNumber": "",
            "IsPaymentModeSelected": false,
            "IsDefaultPaymentMode": false,
            "IsActive": false,
            "OtherDetailsDiv": false
        };
    };
    $scope.getMainBillingObject = function () {
        var object = {
            "PatientClaimId": 0,
            "ClaimDetailId": 0,
            "PatientClaimNo": "",
            "BillID": appointmentinfo.BillingId,
            "BillingHistoryId": 0,
            "IsInvestigationInvoice": false,
            "InvoiceId": "",
            "BillDate": moment().format("DD-MMM-YYYY"),
            "SubmitDate": moment().format("DD-MMM-YYYY"),
            "TotalSubAmount": "",
            "TotalChargeAmount": "",
            "TotalNetAmount": 0,
            "TotalBalance": 0,
            "UserId": doctorinfo.doctorid,
            "TotalReceivedAmount": 0,
            "TotalBilledCost": "",
            "TotalDiscountAmount": 0,
            "DiscountValue": "0",
            "DiscountType": "PERCENT",
            "PreviousPaidAmount": 0,
            "PreviousBill": "N",
            "BillingNotes": "",
            "BillingDetail": [],
            "PayorDetails": [],
            "SelectedPatientPayorPlanDetails": "",
            "BillingHistoryInfo": [],
            "PatientGSTNo": appointmentinfo.PatientGSTNO || "",
            "TotalGST": 0,
            "IsRegistrationFeePaid": "N",
            "AppointmentID": 0,
            "BillingDraftId": 0,
            "PatientAdvanceAmount": 0,
            "PayableAdvanceAmount": 0,
            "DueAfterAdvanceAmt": 0,
            "TotalCollectedAmount": 0,
            "Payments": [],
            "TempReceivedAmt": 0,
            "TotalAmountToBeCollected": 0,
            "ZeroBillingRemarks": "",
            "IsDiscountChecked": false,
            "IsGSTChecked": false,
            "TotalWaviedOffAmount": 0,
            "includeAdvanceAmount": false,
            "IsMaxDiscountAllowed": false,
            "Mode": "Add",
            "DeletedBillItems": [],
            "AdmissionId": 0,
            "AdmissionNumber": "",
            "VisitStartDate": "",
            "VisitStartTime": "",
            "VisitEndDate": "",
            "VisitEndTime": "",
            "AdmissionType": "",
            "AdmissionTypeId": "",
            "SourceOfAdmission": "",
            "SourceOfAdmissionId": "",
            "FacilityTypeId": 0,
            "FacilityType": "",
            "BillTypeClassificationId": "",
            "BillTypeClassification": "",
            "BillTypeFrequencyId": "",
            "BillTypeFrequency": "",
            "TypeOfBill": "",
            "BillingTypeId": 1,
            "InvoiceNumber": "",
            "ReceiptNumber": "",
            "ReceiptId": 0,
            "BillingHistoryDetails": "",
            "ShowPaymentDetails": false,
            "BillPaymentTypeId": 1,
            "TotalInsuranceAmount": 0,
            "TotalCopayAmount": 0,
            "DueFromInsurance": 0,
            "InsuranceCompanyName": "",
            "ClaimId": 0,
            "InsurancePolicyNo": "",
            "ClaimIntimationDate": $filter("date")(new Date(), "yyyy-MM-dd"),
            "ClaimIntimationNumber": "",
            "InsuranceCompanyAddress": "",
            "TPAAddress": "",
            "IsFinalSettlementDone": false,
            "IsCreditBill": false,
            "IsCorporateBill": false,
            "DiagnosisList": [],
            "TotalInsurancePaid": 0,
            "TotalPatientCopay": 0,
            "TotalPatientPaid": 0,
            "TotalBilledAmount": 0,
            "TotalCoInsuranceAmount": 0,
            "TotalClaimAmount": 0,
            "TotalAdjustmentAmount": 0,
            "TotalWriteOffAmount": 0,
            "TotalBillPayment": 0,
            "TotalPatientBalance": 0,
            "PatientDepositUsed": 0,
            "PatientDepositAvailable": 0,
            "PatientDepositId": null,
            "IsPatientPaid": 1,
            "ClaimActionId": "",
            "ClaimActionName": "",
            "BillActionName": "",
            "ClaimActionObj": "",
            "PlanObj": "",
            "PreAuthorizationNumber": "",
            "payorPlansListArray": [],
            "PayorObj": "",
            "ClaimStatusId": 1,
            "BillStatusId": 1,
            "ClaimStatusName": "",
            "ClaimStatusObj": "",
            "RenderingProviderId": "",
            "BillingProviderId": "",
            "AttendingProviderId": "",
            "OrderingProviderId": "",
            "RenderingProviderName": "",
            "ReferringProviderId": "",
            "ReferringNo": "",
            "ReferralObj": "",
            "ClaimSendViaId": null,
            "Shipping": "",
            "PlaceOfServiceId": "",
            "ClaimTypeId": "",
            "ClaimType": "",
            "SuperBillId": 0,
            "ClearingHouseTypeId": 0,
            "ClearingHouseType": "",
            "OrganizationClearingHouseId": 0,
            "MasterClearingHouseId": 0
        };


        $scope.dPaymentsArray = [];


        angular.forEach($scope.masterPaymentModes, function (item) {
            item.IsDefaultPaymentMode = false;
            item.IsPaymentModeSelected = false;
            var paymentobj = angular.copy($scope.GetPaymentObject());
            paymentobj.PaymentModeId = item.PaymentModeId;
            paymentobj.PaymentModeName = item.PaymentModeName;
            if (paymentobj.PaymentModeId === 1) {
                paymentobj.IsActive = true;
            }
            if (item.PaymentModeId === 1) {
                item.IsDefaultPaymentMode = true;
                paymentobj.IsPaymentModeSelected = true;
                paymentobj.IsDefaultPaymentMode = true;
                $scope.dPaymentsArray.push(paymentobj);
            }


        });

        object.Payments = angular.copy($scope.dPaymentsArray);
        return object;
    };

    $scope.ChangePayor1 = function (item, mainBillingObject) {
        if (mainBillingObject.BillTypeId == 10) {
            if (mainBillingObject.PayorDetails.length != 0) {
                mainBillingObject.PayorDetails[0].PayorId = item.PayorId;
                mainBillingObject.PayorDetails[0].PlanId = item.PlanId;
                mainBillingObject.PayorDetails[0].OrganizationPayorId = item.OrganizationPayorId;
                var filtredobj2 = $filter("filter")($scope.PatientInsuranceItems, { "PlanId": item.PlanId });
                if (filtredobj2.length > 0) {
                    $scope.mainBillingObject.PlanObj = filtredobj2[0];
                }
            }

        }

    }
    $scope.ChangePayor2 = function (item, mainBillingObject) {
        if (mainBillingObject.BillTypeId == 10) {
            if (mainBillingObject.PayorDetails.length != 0) {
                mainBillingObject.PayorDetails[1].PayorId = item.PayorId;
                mainBillingObject.PayorDetails[1].PlanId = item.PlanId;
                mainBillingObject.PayorDetails[1].OrganizationPayorId = item.OrganizationPayorId;
                var filtredobj3 = $filter("filter")($scope.PatientInsuranceItems, { "PlanId": item.PlanId });
                if (filtredobj3.length > 0) {
                    $scope.mainBillingObject.PlanObj1 = filtredobj3[0];
                }
            }

        }

    }

    $scope.ChangePayorPlan = function (item, mainBillingObject) {
        var item = item;
    }
    $scope.ChangeHospital = function (item) {
        $scope.HospitalObj = item;

        if ($scope.RoleId !== 1) {
            var doctorslist = [];
            if (item.ClinicId === 0) {

                //angular.forEach($scope.AllUserBranchesList, function (item, index) {
                //    item.Doctors = item.Doctors || [];
                //    doctorslist = doctorslist.concat(item.Doctors);
                //});
                $scope.defaultbranch = $filter("filter")($scope.AllUserBranchesList, function (item) {
                    return item.BranchId === doctorinfo.doctordata.UserAddress[0].ClinicId;
                });
                $scope.selectedBranch = $scope.defaultbranch[0];

                if (doctorinfo.doctordata.UserAddress[0].SubOrganizationId) {
                    $scope.selectedBranch.SubOrganizationId = doctorinfo.doctordata.UserAddress[0].SubOrganizationId;
                }
                GetBranchSubSpecializations($scope.selectedBranch.SubOrganizationId, $scope.selectedBranch.BranchId);

            } else {
                if ($scope.RoleId === 1) {
                    doctorslist = $scope.BranchDoctorsList || [];
                } else {
                    doctorslist = item.Doctors || [];
                }

            }
            //$scope.ReloadDoctors(doctorslist);

            GetBranchSubSpecializations(item.SubOrganizationId, item.BranchId);

            $scope.mainBillingObject.FacilityObj = "";
            $scope.mainBillingObject.FacilityId = 0;
        }

    };

    $scope.ChangeDoctor = function (doctorobj) {
        $scope.DoctorObj = doctorobj;
        $scope.mainBillingObject.RenderingProviderId = doctorobj.DoctorID;
        $scope.mainBillingObject.RenderingProviderName = doctorobj.FullName;
    };
    $scope.ChangePOSStatus1 = function (item) {
        $scope.POSObj = item;
        $scope.mainBillingObject.POSId = item.POSId;
        $scope.mainBillingObject.POSCODENAME = item.POSCODENAME;
        item.POSId = item.POSId;
    };

    function getNewTreatmentObject() {
        return {
            "RowId": 1,
            "BillDate": moment().format("DD-MMM-YYYY"),
            "ProcedureId": 0,
            "OrganizationProcedureId": 0,
            "ProcedureCost": "",
            "ProcedureName": "",
            "ProcedureTypeId": 1,
            "Notes": "",
            "BilledCost": 0,
            "DiscountCost": "",
            "Multiplyfactor": 1,
            "AdvancePaid": 0,
            "DiscountAmount": 0,
            "DiscountType": "AMOUNT",
            "Balance": 0,
            "TotalReceivedCost": 0,
            "PreviousBill": "N",
            "AppointmentID": 0,
            "Cgst": 0,
            "Sgst": 0,
            "Tax": 0,
            "Total": 0,
            "IsConsultationBilling": false,
            "IsIncluded": true,
            "PatientGSTNo": appointmentinfo.PatientGSTNO || "",
            "showIncludeTax": false,
            "ProcedureHistoryId": 0,
            "PatientInvestigationId": 0,
            "ConversionDoctorId": null,
            "TreatmentDoctorId": null,
            "ConsultantDoctorId": null,
            "SalesPersonId": null,
            "TherapistId": null,
            "IsBilledItem": "Y",
            "IsWaved": false,
            "WavedOffRemarks": "",
            "WaviedOffAmount": 0,
            "BillingHistoryDetailId": 0,
            "IsSurgeryPackageItem": false,
            "PackageItemDetailsArray": [],
            "Gst": "",
            "Igst": 0,
            "isExclusiveTax": true,
            "InventoryDetail": [],
            "GstAmount": 0,
            "NetAmount": 0,
            "DeleteInd": false,
            "BillingDetailId": 0,
            "isFastTrackAppointment": false,
            "TeethArray": "",
            "IsMultipleProcedureItems": false,
            "Status": "I", //'I'- Inserted, 'E'- Edited,'D'- Deleted,
            "Service": moment().format("MM-DD-YYYY"),
            "Thru": moment().format("MM-DD-YYYY"),
            "Modifier1": 0,
            "Modifier2": 0,
            "Modifier3": 0,
            "Modifier4": 0,
            "ModifierName1": "",
            "ModifierName2": "",
            "ModifierName3": "",
            "ModifierName4": "",
            "DiagnosisType": "",
            "DiagnosisIds": [],
            "DiagnosisList": [],
            "POSId": "",
            "TOSId": "",
            "IsCap": false,
            "ClaimActionId": "",
            "PlanId": "",
            "ClaimStatusId": 1,
            "BillStatusId": 1,
            //"SendVia": 406,
            "ClaimSendViaId": null,
            "ClaimSendVia": null,
            "Shipping": "",
            "Modifier1Obj": "",
            "Modifier2Obj": "",
            "Modifier3Obj": "",
            "Modifier4Obj": "",
            "POSObj": "",
            "TOSObj": "",
            "InsurancePlanObj": "",
            "ClaimActionObj": "",
            "ClaimStatusObj": "",
            "SendViaObj": "",
            "IsModifierChecked": false,
            "PayorId": 0,
            "PayorClaimStatusId": 0,
            "BillTypeId": 1,
            "InsuranceAmount": "",
            "InsuranceAmount1": 0,
            "InsuranceAmount2": 0,
            "InsurancePaidAmount": "",
            "InsuranceBalance": "",
            "PatientCoPay": 0,
            "PatientPaidAmount": "",
            "PatientBalence": "",
            "ActualInsuranceAmount": "",
            "ActualCopayAmount": "",
            "ChargeAmount": "",
            "AllowedAmount": "",
            "WriteOffAmount": "",
            "PaymentAmount1": "",
            "AdjustmentAmount1": "",
            "CopayAmount1": "",
            "CoInsuranceAmount1": "",
            "OtherAdjustmentAmount1": "",
            "PaymentAmount2": "",
            "AdjustmentAmount2": "",
            "CopayAmount2": "",
            "CoInsuranceAmount2": "",
            "OtherAdjustmentAmount2": "",
            "TotalAdjustmentAmount": "",
            "TotalPaymentAmount": "",
            "ShowNotes": false,
            "ModifierCode1": "",
            "ModifierCode2": "",
            "ModifierCode3": "",
            "ModifierCode4": "",
            "TotalBalance": "",
            "RevenueBillingCodeId": 0,
            "RevenueBillingCode": "",
            "RevenueBillingCodeObj": "",
            "RevenueBillingCodeName": ""
        };
    }

    function OnGetDoctorSuccess(data) {
        InitializeNewBranches(data);
    }
    $scope.getDoctorsbySubSpecializations = function (branchId) {

        console.log(branchId);
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

                var RoleID = $scope.userLoginDetails.RoleID;
                if ($scope.allUserList.length !== 0) {

                    $scope.BranchDoctorsList = angular.copy($scope.allUserList);
                }



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

                //var docAll = { "DoctorID": 0, "FullName": "All Doctors", "AddressID": 0, "MinPerCase": 15 };
                //$scope.BranchDoctorsList.unshift(docAll);

                var DoctorID = doctorinfo.doctordata.User[0].DoctorID;

                var DoctorObj = $filter("filter")($scope.BranchDoctorsList, function (item, index) { return item.DoctorID == DoctorID })[0];

                if (doctorinfo.doctordata.User[0].RoleId !== 10 && doctorinfo.doctordata.User[0].RoleId !== 55 && doctorinfo.doctordata.User[0].RoleId !== 2 && doctorinfo.doctordata.User[0].RoleId !== 11) {
                    $scope.DoctorObj = DoctorObj;
                    $scope.mainBillingObject.RenderingProviderId = $scope.DoctorObj.DoctorID;
                    $scope.mainBillingObject.RenderingProviderName = $scope.DoctorObj.FullName;
                }
                else {
                    $scope.DoctorObj = $scope.BranchDoctorsList[0];
                    $scope.mainBillingObject.RenderingProviderId = $scope.DoctorObj.DoctorID;
                    $scope.mainBillingObject.RenderingProviderName = $scope.DoctorObj.FullName;
                }

            } else {
                alertify.error("No Doctors Found in Selected Hospital");

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
                $scope.getDoctorsbySubSpecializations(BranchId);
            } else {
                $scope.allSubSpecializationsArray = [];
                $scope.clinicDoctorList = [];
                $scope.allUserList = [];
                $scope.selectedDoctor = "";
                alertify.error("No Departments are been added");
            }


        });
    };
    function InitializeNewBranches(data) {
        $scope.AllUserBranchesList = [];
        if (data.length !== 0) {
            var BrachesList = eHnoteUserAppointmentDataService.RestructureNewBranches(true, data, doctorinfo) || [];
            //var EmptyClinicObj = {
            //    "ClinicName": "All Locations",
            //    "ClinicId": 0,
            //    "Address1": "",
            //    "Address2": "",
            //    "Location": "",
            //    "StateId": "",
            //    "PinCode": "",
            //    "CountryId": "",
            //    "CityId": "",
            //    "DistrictRegion": "",
            //    "Latitude": "",
            //    "Longitude": "",
            //    "BranchEmail": "",
            //    "CountryCode": "",
            //    "mobilenum": "",
            //    "Active": "Y",
            //    "Doctors": []

            //};
            //BrachesList.unshift(EmptyClinicObj);

            $scope.AllUserBranchesList = BrachesList;
            $scope.BranchesListArray = BrachesList;
            $scope.selectedBranch = $scope.BranchesListArray[0];
            var RoleID = $scope.userLoginDetails.RoleID;

            $scope.clinicDoctorList = [];

            $scope.defaultbranch = $filter("filter")($scope.AllUserBranchesList, function (item) {
                return item.BranchId === doctorinfo.doctordata.UserAddress[0].ClinicId;
            });

            $scope.selectedBranch = $scope.defaultbranch[0];
            $scope.HospitalObj = $scope.defaultbranch[0];


            if (RoleID === 2 || RoleID === 10 || RoleID === 11 || RoleID === 58) {
                angular.forEach($scope.BranchesListArray, function (item, index) {
                    if (item.ClinicName !== "All Locations") {
                        if (item.ExtDetails.HospitalID === $scope.hospid) {
                            $scope.selectedBranch = item;
                            $scope.HospitalObj = item;
                        }
                    }
                });
            }
        }

        // InitialiseBranchDoctor();
        if ($scope.selectedBranch.BranchId === 0) {
            if (doctorinfo.doctordata.UserAddress[0].SubOrganizationId) {
                $scope.selectedBranch.SubOrganizationId = doctorinfo.doctordata.UserAddress[0].SubOrganizationId;
                //  $scope.AppListselectedclinic.SubOrganizationId = doctorinfo.doctordata.UserAddress[0].SubOrganizationId;
            }
        }

        GetBranchSubSpecializations($scope.selectedBranch.SubOrganizationId, $scope.selectedBranch.BranchId);

    }

    $scope.ChangeClaimStatus = function (item) {
        item.ClaimStatusObj = item.ClaimStatusObj || "";
        if (item.ClaimStatusObj != "") {
            item.BillStatusId = item.ClaimStatusObj.statusId;
        }
    };

    $scope.changesPreAuthoriz = function () {
        if ($scope.mainBillingObject.PayorDetails.length > 0) {
            $scope.mainBillingObject.PayorDetails[0].PreAuthorizationNumber = $scope.mainBillingObject.PreAuthorizationNumber1 || '';
        }
    };

    $scope.ChangeSendVia = function (item) {
        item.SendViaObj = item.SendViaObj || "";
        console.log(item.SendViaObj);

        item.ClaimSendViaId = item.SendViaObj.DropdownId;


        $scope.orgftpDetails.ClearingHouseTypeId = 0;
        $scope.orgftpDetails.OrganizationClearingHouseId = 0;
        $scope.orgftpDetails.MasterClearingHouseId = 0;
        $scope.orgftpDetails.FTPAddress = "";
        $scope.orgftpDetails.FTPUserName = "";
        $scope.orgftpDetails.FTPPassword = "";
        $scope.orgftpDetails.FTPFolder = "";
        $scope.orgftpDetails.FTPPort = "";
        $scope.orgftpDetails.ClearingHouseDetails = {};

        if (item.ClaimSendViaId === 1) {
            if ($scope.OrganizationClearingHouseDetails.length === 0) {
                alertify.error("There is no Clearing House Added for the Practice,Please add Clearing House to submit claim");
                return false;
            } else {

                $scope.orgftpDetails.ClearingHouseTypeId = $scope.OrganizationClearingHouseDetails[0].ClearingHouseTypeId || 0;
                $scope.orgftpDetails.OrganizationClearingHouseId = $scope.OrganizationClearingHouseDetails[0].OrganizationClearingHouseId || 0;
                $scope.orgftpDetails.MasterClearingHouseId = $scope.OrganizationClearingHouseDetails[0].MasterClearingHouseId || 0;
                $scope.orgftpDetails.ClearingHouseDetails = angular.copy($scope.OrganizationClearingHouseDetails[0]);

                if ($scope.orgftpDetails.ClearingHouseTypeId === 2) {
                    var FTPAddress = $scope.OrganizationClearingHouseDetails[0].ClaimUploadFTPHostName || "";
                    var FTPUserName = $scope.OrganizationClearingHouseDetails[0].ClaimUploadFTPUserName || "";
                    var FTPpassword = $scope.OrganizationClearingHouseDetails[0].ClaimUploadFTPPassword || "";
                    var FTPpath = $scope.OrganizationClearingHouseDetails[0].ClaimUploadFTPFolder || "";
                    var FTPPort = $scope.OrganizationClearingHouseDetails[0].ClaimUploadFTPPortNumber || "";
                    var FTPFolder = $scope.OrganizationClearingHouseDetails[0].ClaimUploadFTPFolder || "";
                    if (FTPAddress === "" && FTPUserName == "" && FTPpassword == "" && FTPpath == "") {
                        alertify.error("FTP details are missing for the selected clearing house");
                        return false;
                    } else {
                        $scope.orgftpDetails.FTPAddress = FTPAddress;
                        $scope.orgftpDetails.FTPUserName = FTPUserName;
                        $scope.orgftpDetails.FTPPassword = FTPpassword;
                        $scope.orgftpDetails.FTPFolder = FTPpath;
                        $scope.orgftpDetails.FTPPort = FTPPort;
                        $scope.orgftpDetails.FTPFolder = FTPFolder;
                    }
                }
                else {
                    if ($scope.orgftpDetails.OrganizationClearingHouseId === 0) {
                        alertify.error("There is no Clearing House Added for the Practice,Please add Clearing House to submit claim");
                        return false;
                    }
                }
            }
        }

    };
    $scope.ChangeClaimAction1 = function (item, index) {

        $scope.mainBillingObject.BillingDetail = [];

        if (item.ClaimActionObj != "") {
            $scope.mainBillingObject.ClaimActionId = item.ClaimActionObj.ClaimActionId;
            $scope.mainBillingObject.BillTypeId = item.ClaimActionObj.ClaimActionId;
        }
        if ($scope.mainBillingObject.BillTypeId === 1) {
            // var filtredobj1 = $filter("filter")($scope.PatientInsuranceItems, { "CoverageId": 1 });
            var filtredobj1 = $filter("filter")($scope.PatientInsuranceItems, { "IdentifierId": 1 });

            if (filtredobj1.length > 0) {

                $scope.mainBillingObject.PayorName = filtredobj1[0].PayorName;
                $scope.mainBillingObject.PayorId = filtredobj1[0].PayorId;
                $scope.mainBillingObject.PlanId = filtredobj1[0].PlanId;
                $scope.mainBillingObject.PlanName = filtredobj1[0].PlanName;
                $scope.mainBillingObject.PayorClaimStatusId = 1;
                $scope.mainBillingObject.InsurancePlanObj = filtredobj1[0].PayorName;
                $scope.mainBillingObject.PatientInsuranceDetailId = filtredobj1[0].PatientInsuranceDetailId;
                var filtredobj2 = $filter("filter")($scope.PatientInsuranceItems, { "PayorId": filtredobj1[0].PayorId });
                if (filtredobj2.length > 0) {
                    $scope.mainBillingObject.PayorObj = filtredobj2[0];
                }
                var filtredobj3 = $filter("filter")($scope.PatientInsuranceItems, { "PlanId": filtredobj1[0].PlanId });
                if (filtredobj3.length > 0) {
                    $scope.mainBillingObject.PlanObj = filtredobj3[0];
                }
                $scope.mainBillingObject.PayorDetails = [];
                var obj = {
                    "PatientClaimId": 0,
                    "PayorId": filtredobj1[0].PayorId,
                    "PlanId": filtredobj1[0].PlanId,
                    "OrganizationPayorId": filtredobj1[0].OrganizationPayorId,
                    "AppointmentInsuranceDetailId": filtredobj1[0].AppointmentInsuranceDetailId || 0,
                    "PreAuthorizationNumber": $scope.mainBillingObject.PreAuthorizationNumber1,
                    "PatientInsuranceDetailId": filtredobj1[0].PatientInsuranceDetailId,
                    "IsClaimSubmitted": false,
                    "IsVerified": false,
                    "VerifiedDate": "",
                    "SubmitDate": "",
                    "TotalBillAmount": null,
                    "TotalInsuranceAmount": null,
                    "DueFromInsurance": null,
                    "TotalPatientCopay": null
                }
                $scope.mainBillingObject.PayorDetails.push(obj);

            } else {
                //alertify.error("Patient Dosent Have Primary Insurance");
                //  item.InsurancePlanObj = appointmentinfo.PatientName;
                $scope.mainBillingObject.BillTypeId = 5;
                $scope.mainBillingObject.ClaimActionObj = $filter("filter")($scope.ClaimStatusList, { "CoverageId": 5 })[0];
                $scope.mainBillingObject.ClaimActionId = 5;
                $scope.CalculateBillingItems($scope.mainBillingObject, index);
            }
        }
        else if ($scope.mainBillingObject.BillTypeId === 2) {
            // var filtredobj1 = $filter("filter")($scope.PatientInsuranceItems, { "CoverageId": 2 });
            var filtredobj1 = $filter("filter")($scope.PatientInsuranceItems, { "IdentifierId": 2 });
            if (filtredobj1.length > 0) {

                var filtredobj2 = $filter("filter")($scope.PatientInsuranceItems, { "PayorId": filtredobj1[0].PayorId });
                if (filtredobj2.length > 0) {
                    $scope.mainBillingObject.PayorObj = filtredobj2[0];
                }
                var filtredobj3 = $filter("filter")($scope.PatientInsuranceItems, { "PlanId": filtredobj1[0].PlanId });
                if (filtredobj3.length > 0) {
                    $scope.mainBillingObject.PlanObj = filtredobj3[0];
                }
                $scope.mainBillingObject.PayorDetails = [];
                var obj = {
                    "PatientClaimId": 0,
                    "PayorId": filtredobj1[0].PayorId,
                    "PlanId": filtredobj1[0].PlanId,
                    "OrganizationPayorId": filtredobj1[0].OrganizationPayorId,
                    "AppointmentInsuranceDetailId": filtredobj1[0].AppointmentInsuranceDetailId || 0,
                    "PreAuthorizationNumber": $scope.mainBillingObject.PreAuthorizationNumber1,
                    "PatientInsuranceDetailId": filtredobj1[0].PatientInsuranceDetailId,
                    "TotalBillAmount": null,
                    "IsClaimSubmitted": false,
                    "IsVerified": false,
                    "VerifiedDate": "",
                    "SubmitDate": "",
                    "TotalInsuranceAmount": null,
                    "DueFromInsurance": null,
                    "TotalPatientCopay": null
                }
                $scope.mainBillingObject.PayorDetails.push(obj);
                //item.PayorName = filtredobj1[0].PayorName;
                //item.PayorId = filtredobj1[0].PayorId;
                //item.PlanId = filtredobj1[0].PlanId;
                //item.PayorClaimStatusId = 9;
                //item.InsurancePlanObj = filtredobj1[0].PayorName;
                //item.PatientInsuranceDetailId = filtredobj1[0].PatientInsuranceDetailId;

            } else {
                alertify.error("Patient Dosent Have Secondary Insurance");
                item.InsurancePlanObj = appointmentinfo.PatientName;
                item.BillTypeId = 5;
                item.ClaimActionObj = $filter("filter")($scope.ClaimStatusList, { "CoverageId": 5 })[0];
                item.ClaimActionId = 5;
                $scope.CalculateBillingItems(item, index);
            }
        }
        else if ($scope.mainBillingObject.BillTypeId === 10) {

            if ($scope.PatientInsuranceItems.length > 1) {
                //  var filtredobj1 = $filter("filter")($scope.PatientInsuranceItems, { "CoverageId": 1 });
                // var filtredobj1 = $filter("filter")($scope.PatientInsuranceItems, { "IdentifierId": 1 });
                var filtredobj1 = [];
                filtredobj1.push($scope.PatientInsuranceItems[0]);

                if (filtredobj1.length > 0) {

                    $scope.mainBillingObject.PayorName = filtredobj1[0].PayorName;
                    $scope.mainBillingObject.PayorId = filtredobj1[0].PayorId;
                    $scope.mainBillingObject.PlanId = filtredobj1[0].PlanId;
                    $scope.mainBillingObject.PlanName = filtredobj1[0].PlanName;
                    $scope.mainBillingObject.PayorClaimStatusId = 1;
                    $scope.mainBillingObject.InsurancePlanObj = filtredobj1[0].PayorName;
                    $scope.mainBillingObject.PatientInsuranceDetailId = filtredobj1[0].PatientInsuranceDetailId;
                    var filtredobj2 = $filter("filter")($scope.PatientInsuranceItems, { "PayorId": filtredobj1[0].PayorId });
                    if (filtredobj2.length > 0) {
                        $scope.mainBillingObject.PayorObj = filtredobj2[0];
                    }
                    var filtredobj3 = $filter("filter")($scope.PatientInsuranceItems, { "PlanId": filtredobj1[0].PlanId });
                    if (filtredobj3.length > 0) {
                        $scope.mainBillingObject.PlanObj = filtredobj3[0];
                    }
                    $scope.mainBillingObject.PayorDetails = [];
                    var obj = {
                        "PatientClaimId": 0,
                        "ClaimDetailId": 0,
                        "PatientClaimNo": "",
                        "PayorId": filtredobj1[0].PayorId,
                        "PlanId": filtredobj1[0].PlanId,
                        "OrganizationPayorId": filtredobj1[0].OrganizationPayorId,
                        "AppointmentInsuranceDetailId": filtredobj1[0].AppointmentInsuranceDetailId || 0,
                        "PreAuthorizationNumber": $scope.mainBillingObject.PreAuthorizationNumber1 || '',
                        "PatientInsuranceDetailId": filtredobj1[0].PatientInsuranceDetailId,
                        "IsClaimSubmitted": false,
                        "IsVerified": false,
                        "VerifiedDate": "",
                        "SubmitDate": "",
                        "TotalBillAmount": null,
                        "TotalInsuranceAmount": null,
                        "DueFromInsurance": null,
                        "TotalPatientCopay": null
                    }
                    $scope.mainBillingObject.PayorDetails.push(obj);
                } else {
                    alertify.error("Patient Dosent Have Primary Insurance");
                    //  item.InsurancePlanObj = appointmentinfo.PatientName;
                    $scope.mainBillingObject.BillTypeId = 5;
                    $scope.mainBillingObject.ClaimActionObj = $filter("filter")($scope.ClaimStatusList, { "CoverageId": 5 })[0];
                    $scope.mainBillingObject.ClaimActionId = 5;
                    $scope.CalculateBillingItems($scope.mainBillingObject, index);
                }

                //   var filtredobj4 = $filter("filter")($scope.PatientInsuranceItems, { "CoverageId": 2 });
                // var filtredobj4 = $filter("filter")($scope.PatientInsuranceItems, { "IdentifierId": 2 });


                var filtredobj4 = [];
                filtredobj4.push($scope.PatientInsuranceItems[1]);

                if (filtredobj4.length > 0) {
                    var filtredobj4 = $filter("filter")($scope.PatientInsuranceItems, { "PayorId": filtredobj4[0].PayorId });
                    if (filtredobj4.length > 0) {
                        $scope.mainBillingObject.PayorObj1 = filtredobj4[0];
                    }
                    var filtredobj5 = $filter("filter")($scope.PatientInsuranceItems, { "PlanId": filtredobj4[0].PlanId });
                    if (filtredobj5.length > 0) {
                        $scope.mainBillingObject.PlanObj1 = filtredobj5[0];
                    }


                    $scope.mainBillingObject.PayorDetails = $scope.mainBillingObject.PayorDetails || [];
                    var obj = {
                        "PatientClaimId": 0,
                        //"InsuranceSequenceCode": "P",
                        "PayorId": filtredobj4[0].PayorId,
                        "PlanId": filtredobj4[0].PlanId,
                        "OrganizationPayorId": filtredobj4[0].OrganizationPayorId,
                        "IsClaimSubmitted": false,
                        "IsVerified": false,
                        "VerifiedDate": "",
                        "SubmitDate": "",
                        "AppointmentInsuranceDetailId": filtredobj4[0].AppointmentInsuranceDetailId || 0,
                        "PreAuthorizationNumber": $scope.mainBillingObject.PreAuthorizationNumber2 || '',
                        "PatientInsuranceDetailId": filtredobj4[0].PatientInsuranceDetailId,
                        "TotalBillAmount": null,
                        "TotalInsuranceAmount": null,
                        "DueFromInsurance": null,
                        "TotalPatientCopay": null
                    }
                    $scope.mainBillingObject.PayorDetails.push(obj);
                }
            } else {
                alertify.error("Patient Dosent Have Multiple Insurance");
                item.InsurancePlanObj = appointmentinfo.PatientName;
                item.BillTypeId = 5;
                item.ClaimActionObj = $filter("filter")($scope.ClaimStatusList, { "CoverageId": 5 })[0];
                item.ClaimActionId = 5;
                $scope.CalculateBillingItems(item, index);
            }

        }
        else {
            item.PayorName = appointmentinfo.PatientName;
            item.InsurancePlanObj = appointmentinfo.PatientName;
            $scope.CalculateBillingItems(item, index);
        }


        if ($scope.mainBillingObject.BillingDetail.length == 0) {
            var treatObject1 = getNewTreatmentObject();
            $scope.mainBillingObject.BillingDetail.push(treatObject1);

        }
    }




    $scope.ChangeBillByMode = function (item, index) {


        //if ($scope.mainBillingObject.BillingHistoryId === 0) {
        //    $scope.mainBillingObject.BillingDetail = [];
        //}

        $scope.mainBillingObject.SelectedPatientPayorPlanDetails = "";
        if (item.ClaimActionObj != "") {
            $scope.mainBillingObject.ClaimActionId = item.ClaimActionObj.BillPaymentTypeId;
            $scope.mainBillingObject.BillTypeId = item.ClaimActionObj.BillPaymentTypeId;
        }


        if ($scope.mainBillingObject.BillTypeId === 1) {

        }
        else if ($scope.mainBillingObject.BillTypeId === 2) {



            var filtredobj1 = $filter("filter")($scope.patientInsurancesArray, { "IdentifierId": 1 });

            if (filtredobj1.length === 0) {
                filtredobj1 = $filter("filter")($scope.patientInsurancesArray, { "IdentifierId": 2 });
            }

            if (filtredobj1.length > 0) {

                $scope.mainBillingObject.PayorName = filtredobj1[0].PayorName;
                $scope.mainBillingObject.PayorId = filtredobj1[0].PayorId;
                $scope.mainBillingObject.PlanId = filtredobj1[0].PlanId;
                $scope.mainBillingObject.PlanName = filtredobj1[0].PlanName;
                $scope.mainBillingObject.PayorClaimStatusId = 1;
                $scope.mainBillingObject.InsurancePlanObj = filtredobj1[0].PayorName;
                $scope.mainBillingObject.PatientInsuranceDetailId = filtredobj1[0].PatientInsuranceDetailId;






                var filtredobj2 = $filter("filter")($scope.patientInsurancesArray, { "PayorId": filtredobj1[0].PayorId });
                if (filtredobj2.length > 0) {
                    $scope.mainBillingObject.PayorObj = filtredobj2[0];
                }
                var filtredobj3 = $filter("filter")($scope.patientInsurancesArray, { "PlanId": filtredobj1[0].PlanId });
                if (filtredobj3.length > 0) {
                    $scope.mainBillingObject.PlanObj = filtredobj3[0];
                }


                if ($scope.patientInsurancePlanDetailsArray.length > 0) {
                    var filteredPlanarray = $filter("filter")($scope.patientInsurancePlanDetailsArray, { "PatientInsuranceDetailId": $scope.mainBillingObject.PayorObj.PatientInsuranceDetailId });

                    if (filteredPlanarray.length > 0) {
                        $scope.mainBillingObject.SelectedPatientPayorPlanDetails = filteredPlanarray[0];
                    }
                }

                $scope.mainBillingObject.PayorDetails = [];
                var obj = {
                    "PatientClaimId": 0,
                    "PayorId": filtredobj1[0].PayorId,
                    "PlanId": filtredobj1[0].PlanId,
                    "OrganizationPayorId": filtredobj1[0].OrganizationPayorId,
                    "AppointmentInsuranceDetailId": filtredobj1[0].AppointmentInsuranceDetailId || 0,
                    "PreAuthorizationNumber": $scope.mainBillingObject.PreAuthorizationNumber1,
                    "PatientInsuranceDetailId": filtredobj1[0].PatientInsuranceDetailId,
                    "IsClaimSubmitted": false,
                    "IsVerified": false,
                    "VerifiedDate": "",
                    "SubmitDate": "",
                    "TotalBillAmount": null,
                    "TotalInsuranceAmount": null,
                    "DueFromInsurance": null,
                    "TotalPatientCopay": null
                }
                $scope.mainBillingObject.PayorDetails.push(obj);

            } else {
                alertify.error("Patient Dosent Have Primary Insurance");
                $scope.mainBillingObject.BillTypeId = 1;
                $scope.mainBillingObject.ClaimActionObj = $filter("filter")($scope.billPaymentByModes, { "BillPaymentTypeId": 1 })[0];
                $scope.mainBillingObject.ClaimActionId = 1;
                $scope.CalculateBillingItems($scope.mainBillingObject, index);
            }


        }
        else if ($scope.mainBillingObject.BillTypeId === 3) {
            var filtredobj1 = $filter("filter")($scope.patientInsurancesArray, { "IdentifierId": 2 });

            if (filtredobj1.length === 0) {
                if ($scope.patientInsurancesArray.length > 0) {
                    filtredobj1 = $filter("filter")($scope.patientInsurancesArray, { "IdentifierId": 1 });
                    alertify.error("Patient Dosent Have Secondary Insurance,Please Select Primary or Other");
                }
            }
            if (filtredobj1.length > 0) {

                var filtredobj2 = $filter("filter")($scope.patientInsurancesArray, { "PayorId": filtredobj1[0].PayorId });
                if (filtredobj2.length > 0) {
                    $scope.mainBillingObject.PayorObj1 = filtredobj2[0];
                }
                var filtredobj3 = $filter("filter")($scope.patientInsurancesArray, { "PlanId": filtredobj1[0].PlanId });
                if (filtredobj3.length > 0) {
                    $scope.mainBillingObject.PlanObj1 = filtredobj3[0];
                }
                $scope.mainBillingObject.PayorDetails = [];
                var obj = {
                    "PatientClaimId": 0,
                    "PayorId": filtredobj1[0].PayorId,
                    "PlanId": filtredobj1[0].PlanId,
                    "OrganizationPayorId": filtredobj1[0].OrganizationPayorId,
                    "IsClaimSubmitted": false,
                    "IsVerified": false,
                    "VerifiedDate": "",
                    "SubmitDate": "",
                    "AppointmentInsuranceDetailId": filtredobj1[0].AppointmentInsuranceDetailId || 0,
                    "PreAuthorizationNumber": $scope.mainBillingObject.PreAuthorizationNumber1,
                    "PatientInsuranceDetailId": filtredobj1[0].PatientInsuranceDetailId,
                    "TotalBillAmount": null,
                    "TotalInsuranceAmount": null,
                    "DueFromInsurance": null,
                    "TotalPatientCopay": null
                }
                $scope.mainBillingObject.PayorDetails.push(obj);

            } else {
                alertify.error("Patient Dosent Have Secondary Insurance");
                $scope.mainBillingObject.BillTypeId = 1;
                $scope.mainBillingObject.ClaimActionObj = $filter("filter")($scope.billPaymentByModes, { "BillPaymentTypeId": 1 })[0];
                $scope.mainBillingObject.ClaimActionId = 1;
                $scope.CalculateBillingItems($scope.mainBillingObject, index);
            }
        }
        else if ($scope.mainBillingObject.BillTypeId === 4) {


            if ($scope.patientInsurancesArray.length > 1) {

                var filtredobj1 = [];
                filtredobj1.push($scope.patientInsurancesArray[0]);

                if (filtredobj1.length > 0) {

                    $scope.mainBillingObject.PayorName = filtredobj1[0].PayorName;
                    $scope.mainBillingObject.PayorId = filtredobj1[0].PayorId;
                    $scope.mainBillingObject.PlanId = filtredobj1[0].PlanId;
                    $scope.mainBillingObject.PlanName = filtredobj1[0].PlanName;
                    $scope.mainBillingObject.PayorClaimStatusId = 1;
                    $scope.mainBillingObject.InsurancePlanObj = filtredobj1[0].PayorName;
                    $scope.mainBillingObject.PatientInsuranceDetailId = filtredobj1[0].PatientInsuranceDetailId;
                    var filtredobj2 = $filter("filter")($scope.patientInsurancesArray, { "PayorId": filtredobj1[0].PayorId });
                    if (filtredobj2.length > 0) {
                        $scope.mainBillingObject.PayorObj = filtredobj2[0];
                    }
                    var filtredobj3 = $filter("filter")($scope.patientInsurancesArray, { "PlanId": filtredobj1[0].PlanId });
                    if (filtredobj3.length > 0) {
                        $scope.mainBillingObject.PlanObj = filtredobj3[0];
                    }
                    $scope.mainBillingObject.PayorDetails = [];
                    var obj = {
                        "PatientClaimId": 0,
                        "PayorId": filtredobj1[0].PayorId,
                        "PlanId": filtredobj1[0].PlanId,
                        "OrganizationPayorId": filtredobj1[0].OrganizationPayorId,
                        "IsClaimSubmitted": false,
                        "IsVerified": false,
                        "VerifiedDate": "",
                        "SubmitDate": "",
                        "AppointmentInsuranceDetailId": filtredobj1[0].AppointmentInsuranceDetailId || 0,
                        "PreAuthorizationNumber": $scope.mainBillingObject.PreAuthorizationNumber1 || '',
                        "PatientInsuranceDetailId": filtredobj1[0].PatientInsuranceDetailId,
                        "TotalBillAmount": null,
                        "TotalInsuranceAmount": null,
                        "DueFromInsurance": null,
                        "TotalPatientCopay": null
                    }
                    $scope.mainBillingObject.PayorDetails.push(obj);
                }





                var filtredobj4 = [];
                filtredobj4.push($scope.patientInsurancesArray[1]);

                if (filtredobj4.length > 0) {
                    var filtredobj4 = $filter("filter")($scope.patientInsurancesArray, { "PayorId": filtredobj4[0].PayorId });
                    if (filtredobj4.length > 0) {
                        $scope.mainBillingObject.PayorObj1 = filtredobj4[0];
                    }
                    var filtredobj5 = $filter("filter")($scope.patientInsurancesArray, { "PlanId": filtredobj4[0].PlanId });
                    if (filtredobj5.length > 0) {
                        $scope.mainBillingObject.PlanObj1 = filtredobj5[0];
                    }


                    $scope.mainBillingObject.PayorDetails = $scope.mainBillingObject.PayorDetails || [];
                    var obj = {
                        "PatientClaimId": 0,
                        //"InsuranceSequenceCode": "P",
                        "PayorId": filtredobj4[0].PayorId,
                        "PlanId": filtredobj4[0].PlanId,
                        "OrganizationPayorId": filtredobj4[0].OrganizationPayorId,
                        "IsClaimSubmitted": false,
                        "IsVerified": false,
                        "VerifiedDate": "",
                        "SubmitDate": "",
                        "AppointmentInsuranceDetailId": filtredobj4[0].AppointmentInsuranceDetailId || 0,
                        "PreAuthorizationNumber": $scope.mainBillingObject.PreAuthorizationNumber2 || '',
                        "PatientInsuranceDetailId": filtredobj4[0].PatientInsuranceDetailId,
                        "TotalBillAmount": null,
                        "TotalInsuranceAmount": null,
                        "DueFromInsurance": null,
                        "TotalPatientCopay": null
                    }
                    $scope.mainBillingObject.PayorDetails.push(obj);
                }


            } else {
                alertify.error("Patient Dosent Have Multiple Insurance");
                $scope.mainBillingObject.BillTypeId = 1;
                $scope.mainBillingObject.ClaimActionObj = $filter("filter")($scope.billPaymentByModes, { "BillPaymentTypeId": 1 })[0];
                $scope.mainBillingObject.ClaimActionId = 1;
                $scope.CalculateBillingItems($scope.mainBillingObject, index);
            }

        }

        if ($scope.mainBillingObject.BillingDetail.length == 0) {
            var treatObject1 = getNewTreatmentObject();
            $scope.mainBillingObject.BillingDetail.push(treatObject1);
        }

        console.log($scope.mainBillingObject.BillTypeId + "__BillTypeId");
        if ($scope.mainBillingObject.BillTypeId !== 1) {
            $scope.mainBillingObject.PlanObj.Remarks = $scope.mainBillingObject.PlanObj.Remarks || "";
            if ($scope.mainBillingObject.PlanObj.Remarks != "") {
                $scope.showInsurancePlanAlert($scope.mainBillingObject.PlanObj, $scope.patientInsurancesArray);
            }
        }


    }

    $scope.onSelectRevenueBillingCode = function (obj, item) {
        console.log(obj);
        item.RevenueBillingCodeId = obj.RevenueBillingCodeId;
        item.RevenueBillingCode = obj.RevenueBillingCode;
        item.RevenueBillingCodeName = obj.RevenueBillingCodeName;
        item.RevenueBillingCodeObj = obj.RevenueBillingCode;
    }

    $scope.changeRevenueCode = function (obj, item) {
        item.RevenueBillingCodeId = 0;
        item.RevenueBillingCode = "";
        item.RevenueBillingCodeName = "";
    }

    $scope.init();
    //$scope.Insurancestatus = function () {
    //    var obj = {
    //        "AppointmentId": $scope.cacheStorageItem.appointmentid,
    //        "PatientID": $scope.cacheStorageItem.PatientID,
    //    }
    //    eHnoteInsuranceService.GetAppointmentInsuranceDetailsListByStatus(obj).then(function (response) {
    //        if (response.data !== undefined) {
    //            if (response.data.rows !== undefined) {
    //                $scope.PatientInsuranceItems = response.data.rows || [];
    //                $scope.mainBillingObject.ClaimActionObj = $filter("filter")($scope.ClaimStatusList, { "CoverageId": $scope.PatientInsuranceItems[0].CoverageId })[0];
    //                $scope.ChangeClaimAction1($scope.mainBillingObject);
    //            }
    //        }
    //    });


    //}
    //$scope.Insurancestatus();


    $scope.GetDiagnosisSearch = function (val) {
        var SearchCode = "";
        var SearchText = val;

        var object = {
            "HospitalId": $scope.HospitalID,
            "UserId": $scope.UserId,
            "SpecializationId": $scope.SpecializationId,
            "SearchText": SearchText,
            "PageSize": 10,
            "PageNumber": 1,
            "SearchICD10": SearchCode || "",
            "SearchDescription": "",
            "IsFrequent": "N",
            "ParentOrganizationId": $scope.ParentHospitalID || null
        };
        if (object.SearchText == '' || object.SearchText == undefined) {
            object.IsFrequent = 'Y';
        }
        return eHnoteSettingsDataService.getMasterDiagnosisForICD10Codes(object).then(function (response) {
            if (response.data.count !== 0) {
                if (response.data.DiagnosisList !== undefined) {
                    angular.forEach(response.data.DiagnosisList, function (kitem) {
                        kitem.ICDCodewithDIAGDESCRIPTION = kitem.ICD10CODE + '-' + kitem.ICD10DIAGDESCRIPTION;
                    });
                    return response.data.DiagnosisList.map(function (item) {
                        return item;
                    });
                }
            }
        });
    };

    $scope.changeselectDiagnosisitem = function (val, item) {
        val = val || '';
        if (val == '') {
            item.DiagnosisId = 0;
            item.DiagnosisTypeId = null;
            item.ICD10CODE = '';
            item.ICD10DIAGDESCRIPTION = '';
        }
    }

    $scope.onselectDiagnosisitem = function (val, item) {


        var List = $filter("filter")($scope.DiagnosisListArray, function (Aitem) {
            return (Aitem.DiagnosisId === val.DiagnosisId);
        });
        if (List.length > 0) {
            alertify.error('You have already Selected this Diagnosis');
            val.DiagnosisId = 0;
            val.ICD10DIAGDESCRIPTION = "";
            val.ICDCodewithDIAGDESCRIPTION = "";
            val.SelectedObj = '';
            return false;
        } else {
            item.DiagnosisId = val.DiagnosisId || 0;
            item.DiagnosisTypeId = val.DiagnosisTypeId || null;
            item.ICD10CODE = val.ICD10CODE || null;
            item.ICD10DIAGDESCRIPTION = val.ICD10DIAGDESCRIPTION || null;
            item.ICD10DIAGNAME = val.ICD10DIAGNAME || null;
            item.OrganizationId = val.OrganizationId || null;
            item.SpecializationId = val.SpecializationId || null;
        }



    }

    $scope.changeIsDiagType = function (bVal) {

        if (bVal) {


        } else {
            $scope.getDiagnosisListArray();
            angular.forEach($scope.mainBillingObject.BillingDetail, function (mitem) {
                mitem.addedDiagnosisArray = [];
            });
        }
    }
    $scope.onselectRcopiaDiagnosisitem = function (val, item) {


        var List = $filter("filter")($scope.DiagnosisListArray, function (Aitem) {
            return (Aitem.DiagnosisId === val.DiagnosisId);
        });
        if (List.length > 0) {
            alertify.error('You have already Selected this Diagnosis');
            val.DiagnosisId = 0;
            val.ICD10DIAGDESCRIPTION = "";
            val.ICDCodewithDIAGDESCRIPTION = "";
            val.SelectedObj = '';
            return false;
        }
        else {

            item.ICD10CODE = val.ICD10Code || null;
            item.ICD10DIAGDESCRIPTION = val.ICD10Description || null;
            item.ICD10DIAGNAME = val.ICD10Description || null;
            item.OrganizationId = $scope.HospitalId || null;
            item.SpecializationId = $scope.SpecializationId || null;



            var req = {
                "UserId": $scope.UserId,
                "OrganizationId": $scope.HospitalId,
                "ICD10CODE": val.ICD10Code || "",
                "ICD10Description": val.ICD10Description || "",
                "SNOMEDConceptId": val.SNOMEDConceptID || "",
                "SNOMEDDescription": val.SNOMEDDescription || "",
                "DiagnosisId": 0,
                "OrgDiagnosisId": 0
            }
            eHnoteSettingsDataService.UpdateDiagnosisFromRcopia(req).then(function (response) {

                if (response.data.status === 'Success') {
                    item.DiagnosisId = response.data.DiagnosisId;
                    item.OrganizationDiagnosisId = response.data.OrgDiagnosisId;
                }

            });

        }
    };

    $scope.FormDiagnosisList = function (item) {
        item.DiagnosisType = item.DiagnosisType.toUpperCase();
        if (item.DiagnosisType != '') {
            var list = item.DiagnosisType;
            var last = list.slice(-1);
            var list1 = $filter("filter")($scope.DiagnosisListArray, { "DiagnosisId": "", "Type": last }, true);
            if (list1.length > 0) {
                alertify.error("Please enter the selected Diagnosis");
                item.DiagnosisType = item.DiagnosisType.slice(0, item.DiagnosisType.length - 1);
                return false;
            }
        }
        var List = [];
        List = item.DiagnosisType.split("");
        $scope.FinalDiagnosisList = [];
        if (List.length > 0) {
            $scope.FinalDiagnosisList = [];
            angular.forEach(List, function (kitem) {

                var obj = {
                    "Type": kitem
                }
                $scope.FinalDiagnosisList.push(obj);
            });
        }

        if ($scope.FinalDiagnosisList.length > 0) {
            if ($scope.DiagnosisListArray.length > 0) {
                item.DiagnosisIds = [];
                angular.forEach($scope.FinalDiagnosisList, function (mitem) {
                    angular.forEach($scope.DiagnosisListArray, function (nitem) {
                        if (mitem.Type === nitem.Type) {
                            var obj = {
                                "DiagnosisId": nitem.DiagnosisId,
                                "Type": nitem.Type,
                                "DeleteInd": 'N'
                            }
                            item.DiagnosisIds.push(obj);
                        }
                    });
                });
            }
        }
    }



    $scope.calculatePayableFinalAmounts = function () {
        var totalbilledNow = 0, collectedAmount = 0;


        angular.forEach($scope.mainBillingObject.Payments, function (bitem) {
            totalbilledNow += parseFloat(bitem.Amount) || 0;
        });




        $scope.mainBillingObject.TotalBilledCost = totalbilledNow;
        $scope.mainBillingObject.TotalPatientPaid = totalbilledNow;


        $scope.mainBillingObject.TotalCollectedAmount = totalbilledNow - (parseFloat($scope.mainBillingObject.PayableAdvanceAmount) || 0);





        var billedcost = checkRoundVal($scope.mainBillingObject.TotalBilledCost);
        var checkBillAmount = 0;
        if ($scope.mainBillingObject.PreviousPaidAmount) {
            checkBillAmount = checkRoundVal($scope.mainBillingObject.TotalNetAmount) - checkRoundVal($scope.mainBillingObject.PreviousPaidAmount);
        } else {
            checkBillAmount = checkRoundVal($scope.mainBillingObject.TotalNetAmount);
        }



        if (billedcost > checkBillAmount) {
            $scope.mainBillingObject.TotalReceivedAmount = checkRoundVal($scope.mainBillingObject.PreviousPaidAmount);
            $scope.mainBillingObject.TotalBilledCost = 0;
            $scope.mainBillingObject.TotalCollectedAmount = 0;
            alertify.error("Please enter less than or equal to Total Balance");
            $scope.mainBillingObject.TotalBalance = checkRoundVal($scope.mainBillingObject.TotalNetAmount - $scope.mainBillingObject.TotalReceivedAmount);
            return false;
        } else {
            var totalReceivedAmt = 0;
            totalReceivedAmt = billedcost + checkRoundVal($scope.mainBillingObject.PreviousPaidAmount);
            $scope.mainBillingObject.TotalReceivedAmount = checkRoundVal(totalReceivedAmt);


            $scope.mainBillingObject.TotalPatientBalance
                = checkRoundVal($scope.mainBillingObject.TotalCopayAmount - $scope.mainBillingObject.TotalPatientPaid);

            $scope.mainBillingObject.TotalBalance = checkRoundVal($scope.mainBillingObject.TotalNetAmount - $scope.mainBillingObject.TotalReceivedAmount);



        }






    };

    $scope.changeAmount = function (item) {
        angular.forEach($scope.mainBillingObject.Payments, function (mitem) {
            if (mitem.PaymentModeId === item.PaymentModeId) {
                mitem.OtherDetailsDiv = true;
            } else {
                mitem.OtherDetailsDiv = false;
            }
        });

        $scope.IsValidPayment = true;
        var amountEntered = parseFloat(item.Amount) || 0;



        var totalbilledNow = 0, totalPatientBillnow = 0;
        angular.forEach($scope.mainBillingObject.Payments, function (bitem) {
            totalbilledNow += parseFloat(bitem.Amount) || 0;
            var PatientBillTypeId = parseFloat(bitem.PatientBillTypeId) || 0;
            if (PatientBillTypeId === 1) {
                totalPatientBillnow += parseFloat(bitem.Amount) || 0;
            };
        });

        var totalPatcopayt = parseFloat($scope.mainBillingObject.TotalCopayAmount) || 0;



        var patBilltypeid = parseFloat(item.PatientBillTypeId) || 0;
        if (patBilltypeid === 1) {
            if (totalPatientBillnow > totalPatcopayt) {
                item.Amount = "";
                $scope.IsValidPayment = true;
                alertify.error("Please Enter Less Than or Equal to Total Patient CoPay");
            };
        };

        $scope.calculatePayableFinalAmounts();
    }

    $scope.changePayableAmount = function (item) {
        angular.forEach($scope.mainBillingObject.Payments, function (mitem) {
            if (mitem.PaymentModeId === item.PaymentModeId) {
                mitem.OtherDetailsDiv = true;
            } else {
                mitem.OtherDetailsDiv = false;
            }
        });

        $scope.IsValidPayment = true;
        var amountEntered = parseFloat(item.Amount) || 0;
        amountEntered = parseInt(amountEntered);
        if (item.PaymentModeId === 18) {
            var advanceamt = parseInt($scope.mainBillingObject.PatientAdvanceAmount);
            if (amountEntered > advanceamt) {
                amountEntered = "";
                alertify.error("Please Enter Less Than or Equal to Advance");
            }
        }
        var totalbilledNow = 0;
        angular.forEach($scope.mainBillingObject.Payments, function (bitem) {
            totalbilledNow += parseFloat(bitem.Amount) || 0;
        });
        if ($scope.mainBillingObject.Mode === 'Update') {
            var totalBcost = parseFloat($scope.mainBillingObject.TotalBilledCost) || 0;

            if (totalbilledNow > totalBcost) {
                item.Amount = "";
                $scope.IsValidPayment = true;
                alertify.error("Please Enter Equal Amount to Billed Amount");
            } else {
                $scope.IsValidPayment = false;
            }
            $scope.calculatePayableFinalAmounts();
        }
        else {
            var totalreceived = 0, totalBal = 0;
            totalreceived = totalbilledNow + $scope.mainBillingObject.PreviousPaidAmount;
            if (totalreceived > $scope.mainBillingObject.TotalNetAmount) {
                item.Amount = "";
                $scope.IsValidPayment = true;
                alertify.error("Please Enter Less Than or Equal to Total Balence");
            } else {
                $scope.IsValidPayment = false;
            }

            $scope.calculatePayableFinalAmounts();
        }







    };


    $scope.GotoAddDeposit = function () {

        $scope.obj = {
            "PatientId": appointmentinfo.PatientID ? appointmentinfo.PatientID : cacheStorageItem.patientid,
            "Type": 'ClaimBilling',

        }
        var modalInstance = $uibModal.open({
            "templateUrl": "templates/consultation/payor/AddupdatePatientDeposits.html",
            "controller": "EhnoteAddupdatePatientDepositsCtrl",
            "resolve": {
                "Selectobj": function () { return $scope.obj; },
            },
            "size": "lg", //"md",
            "backdrop": "static",
            "keyboard": false,
            "windowClass": "inventory-full-popup"

        });


    }

    $scope.GetPatientDepositlist = function () {
        $scope.obj = {
            "PatientId": appointmentinfo.PatientID ? appointmentinfo.PatientID : cacheStorageItem.patientid,
            "Type": 'ClaimBilling',
            "appointmentinfo": appointmentinfo,
        }
        $scope.modalpayorInstance = $uibModal.open({
            "templateUrl": "templates/USBilling/uibpopups/GetPatientDepositlist.html",
            "controller": "USGetPatientDepositlistCtrl",
            "resolve": {
                "Selectobj": function () { return $scope.obj; },
            },
            "size": "lg",
            "backdrop": "static",
            "keyboard": false,
            "windowClass": "inventory-full-popup"

        });
        $scope.modalpayorInstance.result.then(function (SelectDepositListArray) {
            if (SelectDepositListArray !== undefined) {
                if (SelectDepositListArray.length != 0) {



                    $scope.showPaymentDetails = true;

                    var totalpayable = $scope.mainBillingObject.TotalNetAmount;
                    var PatAdvanceAmount = SelectDepositListArray[0].UnBilledAmount;



                    var paymentobj = angular.copy($scope.GetPaymentObject());
                    paymentobj.PaymentModeId = 9;
                    paymentobj.PaymentModeName = "Deposit";

                    var filterArray = $filter("filter")($scope.masterPaymentModes, { "PaymentModeId": paymentobj.PaymentModeId });

                    paymentobj.PaymentModeobj = filterArray[0];

                    if (totalpayable > PatAdvanceAmount) {
                        paymentobj.Amount = PatAdvanceAmount
                    } else {
                        paymentobj.Amount = totalpayable;
                    }

                    $scope.mainBillingObject.Payments.unshift(paymentobj);
                    angular.forEach($scope.mainBillingObject.Payments, function (mitem) {
                        if (mitem.PaymentModeId === paymentobj.PaymentModeId) {
                            mitem.OtherDetailsDiv = true;
                        } else {
                            mitem.OtherDetailsDiv = false;
                        }
                    });

                    $scope.IsValidPayment = true;

                    $scope.calculatePayableFinalAmounts();

                }
            }
        }, function (SelectDepositListArray) { });
    }






    $scope.PaymentaddMore = function (item) {
        item.Amount = item.Amount || null;
        if (item.Amount == null) {
            alertify.error("Enter Amount");
            return false;
        }

        var paymentobj = angular.copy($scope.GetPaymentObject());
        paymentobj.PaymentReasonId = 3;
        if ($scope.PaymentReasonList.length > 0) {
            paymentobj.PaymentReasonobj = $filter("filter")($scope.PaymentReasonList, { "AdjustmentCodeId": 3 })[0];
        }
        $scope.mainBillingObject.Payments.push(paymentobj);
    }


    $scope.searchBillItemObj = {
        "SearchText": "",
        "SpecializationId": $scope.SpecializationId,
        "BranchId": $scope.HospitalID,
        "PageSize": 10,
        "PageNumber": 1,
        "TotalBillItems": "",
        "ProcedureTypeId": 0
    }
    $scope.colorProcedureTypes = [
        {
            "ProcedureTypeId": 1,
            "color": "#106F1B"
        },
        {
            "ProcedureTypeId": 3,
            "color": "#A59C0C"
        },
        {
            "ProcedureTypeId": 6,
            "color": "#C12503"
        },
        {
            "ProcedureTypeId": 7,
            "color": "#D8038A"
        },
        {
            "ProcedureTypeId": 5,
            "color": "#3AF104"
        },
        {
            "ProcedureTypeId": 8,
            "color": "#D593F5"
        }
    ]

    $scope.autosearchAllBillableItems = function (val) {


        var params = {
            "SearchText": val,
            "SpecializationId": $scope.searchBillItemObj.SpecializationId,
            "BranchId": $scope.searchBillItemObj.BranchId,
            "PageSize": $scope.searchBillItemObj.PageSize,
            "PageNumber": $scope.searchBillItemObj.PageNumber,
            "TotalBillItems": "",
            "ProcedureTypeId": $scope.biilobj.Type || 1
        };

        return eHnoteSettingsDataService.searchAllOrgBillItems(params).then(function (resp) {
            // console.log(JSON.stringify(resp));
            $scope.allOrgBillItems = [];
            $scope.searchBillItemObj.TotalBillItems = 0;
            if (resp.data.status === 'Success') {
                if (resp.data.rows.length > 0) {
                    $scope.allOrgBillItems = resp.rows;
                    $scope.searchBillItemObj.TotalBillItems = resp.count;

                    if (val === "") {
                        var obj = {
                            "ProcedureId": 0,
                            "ProcedureName": "Frequently Added"
                        };
                        resp.data.rows.unshift(obj);
                    }

                    return resp.data.rows.map(function (mitem) {
                        mitem.alertDiv = false;
                        mitem.ProcedureNamewithAppointmentType = mitem.ProcedureName + ' - ' + mitem.AppointmentType;
                        return mitem;
                    });
                }
            }


        });

    };

    $scope.changemultiplyfactor = function (item) {


        var multiunit = parseFloat(item.Multiplyfactor) || 0;

        item.ChargeAmount = item.ProcedureCost * multiunit;
        item.AllowedAmount = item.ProcedureCost * multiunit;
        $scope.CalculateBillingItems(item);


    };




    $scope.changeInsuranceAmount1 = function (item) {
        var AllowedAmt = parseFloat(item.AllowedAmount) || 0;

        if (AllowedAmt > item.ChargeAmount) {
            alertify.error("Insurance Amount Cannot be greater than Actual Cost");
            item.AllowedAmount = item.ChargeAmount;
            item.PatientCoPay = 0;
            return false;
        } else {
            item.PatientCoPay = 0;
            item.AllowedAmount = AllowedAmt;
           // item.ActualInsuranceAmount = item.InsuranceAmount1 + parseFloat(item.InsuranceAmount2);
            //item.PatientCoPay = item.ChargeAmount - item.ActualInsuranceAmount;
            //item.ActualCopayAmount = item.PatientCoPay;

            $scope.CalculateBillingItems(item);
        }
    };

    $scope.changeInsuranceAmount2 = function (item) {
        var insamt2 = parseFloat(item.InsuranceAmount2) || 0;
        var insamt1 = parseFloat(item.InsuranceAmount1) || 0;
        if (insamt1 == 0) {
            alertify.error("Insurance 1 Amount Cannot be zero or empty");
            item.PatientCoPay = 0;
            return false;
        }
        else {

            var totInsAmt = insamt2 + insamt1;

            if (totInsAmt > item.ChargeAmount) {
                alertify.error("Insurance Amount Cannot be greater than Actual Cost");
                item.InsuranceAmount2 = 0;
                item.PatientCoPay = 0;
                return false;
            } else {
                item.PatientCoPay = 0;
                item.InsuranceAmount2 = insamt2;
                item.ActualInsuranceAmount = parseFloat(item.InsuranceAmount1) + parseFloat(item.InsuranceAmount2);

                item.PatientCoPay = item.ChargeAmount - item.ActualInsuranceAmount;
                item.ActualCopayAmount = item.PatientCoPay;
                $scope.CalculateBillingItems(item);
            }
        }


    };

    $scope.calculateProcedureCost = function (item) {
        item.ProcedureCost = parseFloat(item.ProcedureCost);
        item.ChargeAmount = parseFloat(item.Multiplyfactor) * item.ProcedureCost;
        item.AllowedAmount = item.ChargeAmount;
        item.InsuranceAmount1 = 0;
        item.InsuranceAmount2 = 0;
        item.ActualInsuranceAmount = 0;
      
        $scope.CalculateBillingItems(item);
    };

    $scope.changePatientCopay = function (item, index) {

        var patcopayamt = parseFloat(item.PatientCoPay) || 0;
        if (patcopayamt > item.AllowedAmount) {
            alertify.error("Patient Copay will not be greater than Allowed Amount");
            item.PatientCoPay = 0;
            $scope.CalculateBillingItems(item);
        } else {


            if ($scope.mainBillingObject.BillTypeId !== 1) {
                item.AllowedAmount = item.ChargeAmount - patcopayamt;
                item.ActualInsuranceAmount = item.InsuranceAmount1;
            }
            $scope.CalculateBillingItems(item);
        }




    };

    $scope.CalculateBillingItems = function (item, $index) {


        item.Multiplyfactor = item.Multiplyfactor || ""; //1
        item.ProcedureCost = item.ProcedureCost || 0;

        item.ActualCopayAmount = item.ActualCopayAmount || 0;
        item.InsuranceAmount = item.InsuranceAmount || 0;
        item.InsuranceAmount1 = item.InsuranceAmount1 || 0;
        item.InsuranceAmount2 = item.InsuranceAmount2 || 0;
        item.ActualInsuranceAmount = item.ActualInsuranceAmount || 0;
        item.PatientCoPay = item.PatientCoPay || 0;
        item.DiscountAmount = parseFloat(item.DiscountAmount) || 0;
        item.DiscountValue = parseFloat(item.DiscountValue) || 0;
        item.InsurancePaidAmount = item.InsurancePaidAmount || 0;
        item.PatientPaidAmount = item.PatientPaidAmount || 0;
        item.InsuranceBalance = 0;
        item.PatientBalence = 0;
        item.TotalReceived = item.TotalReceived || 0;
        item.TotalBalance = item.TotalBalance || 0;
        item.Cgst = 0;
        item.Sgst = 0;
        item.DiscountCost = parseFloat(item.DiscountCost) || 0;
        item.showIncludeTax = false;
        item.Igst = 0;
        item.Gst = 0;
        item.BilledCost = 0;



        var totalAmount = 0, totalInsAmount = 0, totalPatientAmt = 0, DiscountCost = 0;
        var InsuranceAmount = 0, PatientCoPay = 0, Multiplyfactor = 0, ProcedureCost = 0;
        var Cgst = parseFloat(item.Cgst) || 0;
        var Sgst = parseFloat(item.Sgst) || 0;
        Multiplyfactor = parseFloat(item.Multiplyfactor) || 0;
        ProcedureCost = parseFloat(item.ProcedureCost) || 0;
        InsuranceAmount = parseFloat(item.ActualInsuranceAmount) || 0;
        PatientCoPay = parseFloat(item.ActualCopayAmount) || 0;




        item.ChargeAmount = 0;
        totalAmount = parseFloat(item.AllowedAmount) * Multiplyfactor;
        item.ChargeAmount = totalAmount || 0;
        DiscountCost = parseFloat(item.DiscountCost) || 0;






        item.InsuranceAmount = item.ActualInsuranceAmount;
        item.PatientCoPay = item.PatientCoPay - item.DiscountAmount;

        item.InsuranceBalance = item.InsuranceAmount - item.InsurancePaidAmount;
        item.PatientBalence = item.PatientCoPay - item.PatientPaidAmount;










        if (item.isExclusiveTax) {
            item.Tax = ((Cgst + Sgst) / 100) * totalAmount;
            item.Tax = parseFloat(item.Tax) || 0;
            item.Total = totalAmount + item.Tax;
            item.TotalwithoutTax = totalAmount;
            item.GstAmount = parseFloat(item.Tax.toFixed(2));
            item.NetAmount = item.TotalwithoutTax;
        }
        else {
            item.Tax = totalAmount - (totalAmount * (100 / (100 + parseFloat(item.Gst))));
            item.Tax = parseFloat(item.Tax) || 0;
            item.Total = totalAmount;
            item.TotalwithoutTax = totalAmount - item.Tax;
            item.GstAmount = parseFloat(item.Tax.toFixed(2));
            item.NetAmount = item.TotalwithoutTax;
        }

        var totalMain = parseFloat(item.Total) || 0;
        var totalRe = parseFloat(item.TotalReceived) || 0;

        item.TotalBalance = totalMain - totalRe;
        $scope.sumTotalAmounts();
    };
    $scope.sumTotalAmounts = function () {

        var val = 0, valWithouitTax = 0, totalgstval = 0;

        $scope.mainBillingObject.BillingDetail = $scope.mainBillingObject.BillingDetail || [];
        $scope.mainBillingObject.TotalSubAmount = $scope.mainBillingObject.TotalSubAmount || 0;
        $scope.mainBillingObject.TotalChargeAmount = 0;
        $scope.mainBillingObject.TotalDiscountAmount = 0;
        $scope.mainBillingObject.TotalGST = $scope.mainBillingObject.TotalGST || 0;
        $scope.mainBillingObject.TotalInsuranceAmount = 0;
        $scope.mainBillingObject.TotalCopayAmount = 0;
        $scope.mainBillingObject.TotalNetAmount = $scope.mainBillingObject.TotalNetAmount || 0;
        $scope.mainBillingObject.TotalReceivedAmount = $scope.mainBillingObject.TotalReceivedAmount || 0;
        $scope.mainBillingObject.PreviousPaidAmount = $scope.mainBillingObject.PreviousPaidAmount || 0;
        $scope.mainBillingObject.TotalBilledCost = $scope.mainBillingObject.TotalBilledCost || 0;
        $scope.mainBillingObject.DueFromInsurance = 0;
        $scope.mainBillingObject.TotalPatientBalance = 0;
        // $scope.mainBillingObject.TotalPatientDeposit = 0;
        $scope.mainBillingObject.TotalBalance = $scope.mainBillingObject.TotalBalance || 0;

        var totalInsAmount = 0;

        if ($scope.mainBillingObject.BillingDetail.length > 0) {
            $scope.mainBillingObject.BillingDetail.forEach(function (element) {

                element.Total = roundto2decimals(element.Total, 2);
                element.DiscountCost = roundto2decimals(element.DiscountCost, 2);
                element.DiscountAmount = roundto2decimals(element.DiscountAmount, 2);
                element.TotalwithoutTax = element.TotalwithoutTax || 0;
                element.Total = element.Total || 0;
                element.TotalBalance = element.Total || 0;
                val += element.Total;
                $scope.mainBillingObject.TotalDiscountAmount += element.DiscountAmount;
                $scope.mainBillingObject.TotalGST += element.Tax;
                $scope.mainBillingObject.TotalInsuranceAmount += element.InsuranceAmount;
                totalInsAmount += element.InsuranceAmount;
                //  $scope.mainBillingObject.TotalChargeAmount += parseFloat(element.ProcedureCost) || 0;
                $scope.mainBillingObject.TotalChargeAmount += element.Multiplyfactor * element.ProcedureCost || 0;
                $scope.mainBillingObject.DueFromInsurance += parseFloat(element.InsuranceBalance) || 0;
                $scope.mainBillingObject.TotalCopayAmount += parseFloat(element.PatientCoPay) || 0;
                $scope.mainBillingObject.TotalPatientBalance += parseFloat(element.PatientBalence) || 0;
                valWithouitTax += element.TotalwithoutTax;
                $scope.mainBillingObject.TotalAmountToBeCollected += parseFloat(element.BilledCost) || 0;



            });
        }



        $scope.mainBillingObject.TotalSubAmount = roundto2decimals(valWithouitTax, 2);
        $scope.mainBillingObject.TotalGST = roundto2decimals($scope.mainBillingObject.TotalGST, 2);
        $scope.mainBillingObject.disableDiscount = $scope.mainBillingObject.TotalGST === 0 ? false : true;
        $scope.mainBillingObject.DiscountValue = $scope.mainBillingObject.disableDiscount ? 0 : checkRoundVal($scope.mainBillingObject.DiscountValue);

        $scope.mainBillingObject.TotalWaviedOffAmount = roundto2decimals($scope.mainBillingObject.TotalWaviedOffAmount, 2);
        $scope.mainBillingObject.TotalReceivedAmount = angular.copy($scope.mainBillingObject.TotalBilledCost + checkRoundVal($scope.mainBillingObject.PreviousPaidAmount));
        $scope.mainBillingObject.TotalNetAmount = checkRoundVal(val - $scope.mainBillingObject.TotalWaviedOffAmount);
        $scope.mainBillingObject.TotalBalance = checkRoundVal(val);
        $scope.mainBillingObject.TotalBalance = checkRoundVal($scope.mainBillingObject.TotalNetAmount - $scope.mainBillingObject.TotalReceivedAmount);


        angular.forEach($scope.mainBillingObject.Payments, function (item) {
            item.Amount = "";
            item.IsActive = false;
            item.CardNumber = "";
            item.CardTypeId = 1;
            item.NameonCard = "";
            item.VallidTill = "";
            item.ChequeNumber = "";
            item.BankName = "";
            item.TransactionNumber = "";
            item.IsPaymentModeSelected = false;
            item.IsDefaultPaymentMode = false;
            item.OtherDetailsDiv = false;
            item.IsChecked = false;
            if (item.PaymentModeId === 1) {
                item.IsActive = true;
                item.IsChecked = true;
            }
        });
    }
    $scope.GetInsuranceCoverageProcedureCostById = function (item) {


        var OrganizationPayorId = 0;



        if ($scope.mainBillingObject.BillTypeId === 3) {

            OrganizationPayorId = $scope.mainBillingObject.PayorObj1.OrganizationPayorId;
            $scope.mainBillingObject.PayorDetails[1].IsClaimSubmitted = true;
            $scope.mainBillingObject.PayorDetails[1].InsuranceSequenceCode = 'S';

        } else if ($scope.mainBillingObject.BillTypeId === 2 || $scope.mainBillingObject.BillTypeId === 4 || $scope.mainBillingObject.BillTypeId === 5) {


            OrganizationPayorId = $scope.mainBillingObject.PayorObj.OrganizationPayorId;
            if ($scope.mainBillingObject.PayorDetails.length > 0) {
                $scope.mainBillingObject.PayorDetails[0].InsuranceSequenceCode = 'P';
                $scope.mainBillingObject.PayorDetails[0].IsClaimSubmitted = true;
            }

        }

        if (item.OrganizationProcedureId === 0 || item.ProcedureId === 0) {
            return;
        }
        var req = {
            "ParentOrganizationId": $scope.ParenthospitalId,
            "OrganizationId": $scope.HospitalID,
            "OrganizationPayorId": OrganizationPayorId || 0,
            "OrganizationProcedureId": item.OrganizationProcedureId || 0
        };

        eHnoteSettingsDataService.GetOrganizationProcedureCostById(req).then(function (response) {

            console.log("Service Called")
            if (response.data.Status === "Success") {




                if (response.data.rows.length > 0) {


                    response.data.rows[0].AllowedAmount = response.data.rows[0].ActualCost || 0;
                    response.data.rows[0].PayorCode = response.data.rows[0].PayorCode || '0';
                    if (response.data.rows[0].PayorCode == '0') {
                        response.data.rows[0].InFacilityActualCost = response.data.rows[0].GeneralCost;
                    }

                    if (item.POSId === 24) {
                        item.ProcedureCost = response.data.rows[0].InFacilityActualCost;
                    } else {
                        item.ProcedureCost = response.data.rows[0].ActualCost;
                    };






                    if ($scope.mainBillingObject.BillTypeId !== 1) {
                        item.ServicesTypeId = item.ServicesTypeId || 0;


                        if (item.ServicesTypeId !== 0) {
                            if ($scope.patientInsurancePlanDetailsArray.length > 0) {





                                if (item.ServicesTypeId === 2 || item.ServicesTypeId === 8) {//SURGERY

                                    $scope.mainBillingObject.SelectedPatientPayorPlanDetails.GeneralCostValue = parseFloat($scope.mainBillingObject.SelectedPatientPayorPlanDetails.GeneralCostValue) || 0;
                                    if ($scope.mainBillingObject.SelectedPatientPayorPlanDetails.GeneralCostValue !== 0) {
                                        if ($scope.mainBillingObject.SelectedPatientPayorPlanDetails.GeneralValueType === "A") {
                                            item.PatientCoPay = parseFloat($scope.mainBillingObject.SelectedPatientPayorPlanDetails.GeneralCostValue);
                                        } else {
                                            item.PatientCoPay = ($scope.mainBillingObject.SelectedPatientPayorPlanDetails.GeneralCostValue / 100) * item.ProcedureCost;
                                        }

                                    }

                                }
                                else if (item.ServicesTypeId === 82 || item.ServicesTypeId === 76) {//prescription

                                    $scope.mainBillingObject.SelectedPatientPayorPlanDetails.RxCostValue = parseFloat($scope.mainBillingObject.SelectedPatientPayorPlanDetails.RxCostValue) || 0;
                                    if ($scope.mainBillingObject.SelectedPatientPayorPlanDetails.RxCostValue !== 0) {
                                        if ($scope.mainBillingObject.SelectedPatientPayorPlanDetails.RxValueType === "A") {

                                            item.PatientCoPay = parseFloat($scope.mainBillingObject.SelectedPatientPayorPlanDetails.RxCostValue);

                                        } else {

                                            item.PatientCoPay = ($scope.mainBillingObject.SelectedPatientPayorPlanDetails.RxCostValue / 100) * item.ProcedureCost;

                                        }

                                    }



                                }
                                else if (item.ServicesTypeId === 5 || item.ServicesTypeId === 4 || item.ServicesTypeId === 4) {//lab

                                    $scope.mainBillingObject.SelectedPatientPayorPlanDetails.LabCostValue = parseFloat($scope.mainBillingObject.SelectedPatientPayorPlanDetails.LabCostValue) || 0;
                                    if ($scope.mainBillingObject.SelectedPatientPayorPlanDetails.LabCostValue !== 0) {
                                        if ($scope.mainBillingObject.SelectedPatientPayorPlanDetails.LabValueType === "A") {

                                            item.PatientCoPay = parseFloat($scope.mainBillingObject.SelectedPatientPayorPlanDetails.LabCostValue);

                                        } else {

                                            item.PatientCoPay = ($scope.mainBillingObject.SelectedPatientPayorPlanDetails.LabCostValue / 100) * item.ProcedureCost;

                                        }

                                    }


                                }
                                else {


                                    $scope.mainBillingObject.SelectedPatientPayorPlanDetails.GeneralCostValue = parseFloat($scope.mainBillingObject.SelectedPatientPayorPlanDetails.GeneralCostValue) || 0;
                                    if ($scope.mainBillingObject.SelectedPatientPayorPlanDetails.GeneralCostValue !== 0) {
                                        if ($scope.mainBillingObject.SelectedPatientPayorPlanDetails.GeneralValueType === "A") {

                                            item.PatientCoPay = parseFloat($scope.mainBillingObject.SelectedPatientPayorPlanDetails.GeneralCostValue);

                                        } else {

                                            item.PatientCoPay = ($scope.mainBillingObject.SelectedPatientPayorPlanDetails.GeneralCostValue / 100) * item.ProcedureCost;

                                        }

                                    }


                                }
                            }
                        }


                        item.InsuranceAmount1 = item.ProcedureCost - item.PatientCoPay;
                        item.ActualInsuranceAmount = item.InsuranceAmount1 || 0;
                        item.ActualCopayAmount = item.PatientCoPay || 0;

                    }

                    $scope.CalculateBillingItems(item);

                }




            } else {
                alertify.error(response.data.Message);
            }
        }, function (error) {

        });


    };


    function checkRoundVal(val) {
        return val !== undefined && val !== "" && val !== null ? Math.round(val) : 0;
    }
    function roundto2decimals(value, decimals) {
        return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
    }
    function continuetoAddBillItem(treatObject) {



    };
    function precontinuetoPush(treatObject, item) {


        var filteredColorArray = $filter("filter")($scope.colorProcedureTypes, function (sitem) {
            return sitem.ProcedureTypeId === item.ProcedureTypeId;
        });

        if (filteredColorArray.length > 0) {
            treatObject.ColorCode = filteredColorArray[0].color;
        }




    }

    $scope.ProcedureChange = function (TreatmentObject, item) {
        TreatmentObject = TreatmentObject || "";


        //if (typeof TreatmentObject=='string') {
        //    console.log('string');
        //} 


        item.ProcedureId = 0;
        item.OrganizationProcedureId = 0;
        item.PatientCoPay = "";
        item.ChargeAmount = "";
        item.PatientCoPay = "";
        item.ProcedureCost = "";
        item.ServicesTypeId = 0;
        item.PlaceOfServiceId = 0;
        item.ActualCopayAmount = 0;
        item.Multiplyfactor = "";
        item.TotalBalance = "";
        item.ActualInsuranceAmount = 0;
        item.AllowedAmount = 0;
        item.InsuranceAmount = "";
        item.InsuranceAmount1 = "";
        item.InsuranceAmount2 = "";
        item.InsuranceBalance = "";
        item.InsurancePaidAmount = 0;
        item.TOSId = 0;
        item.CPTCode = '';
        item.ProcedureCode = '';

    };

    $scope.pushtoBill = function (item, mainitem) {
        $scope.onFocusProcedure = true;
        if ($scope.mainBillingObject.Mode === 'Update') {
            return false;
        }

        //if ($scope.mainBillingObject.BillingDetail.length > 1) {
        //    var filetredProducts = $filter("filter")($scope.mainBillingObject.BillingDetail, function (sitem) {
        //        return sitem.OrganizationProcedureId === item.OrganizationProcedureId;
        //    });
        //    if (filetredProducts.length > 0) {
        //        alertify.error("Item Already added to the List");
        //        mainitem.selectedParticular = '';
        //        return false;
        //    }
        //};

        var treatObject = mainitem;

        treatObject.selectedParticular = item.ProcedureCode + " - " + item.ProcedureName;
        treatObject.ProcedureName = item.ProcedureName;
        treatObject.OrganizationProcedureId = item.OrganizationProcedureId;
        treatObject.ProcedureId = item.ProcedureId || 0;
        treatObject.ProcedureTypeCode = item.ProcedureTypeCode || '';

        treatObject.CPTCode = item.ProcedureCode || '';
        treatObject.ProcedureTypeName = item.ProcedureTypeName;
        treatObject.ProcedureTypeId = item.ProcedureTypeId;
        treatObject.ProcedureCost = item.Cost || 0;
        treatObject.Multiplyfactor = item.Quantity || 1;
        //treatObject.ProcedureGeneralCost = item.GeneralCost;
        treatObject.ChargeAmount = item.ProcedureCost * treatObject.Multiplyfactor;
        treatObject.ProcedureCode = item.ProcedureCode || "";
        treatObject.IsSurgeryPackageItem = false;
        treatObject.ColorCode = "black";
        treatObject.WavedOffRemarks = item.DiscountRemarks || "";
        treatObject.DiscountType = "AMOUNT";
        treatObject.DiscountCost = item.DiscountValue || 0;
        treatObject.DiscountAmount = item.DiscountAmount || 0;
        treatObject.AppointmentTypeName = item.AppointmentType || "";

        treatObject.AppointmentTypeId = item.AppointmentTypeId || "";
        //treatObject.ProcedureCode = item.ProcCode || "";
        treatObject.TOSId = item.TypeOfServiceId; // tosId
        treatObject.ServicesTypeId = item.TypeOfServiceId; // tosId
        treatObject.addedDiagnosisArray = angular.copy($scope.addedDiagnosisArray);
        treatObject.DiagnosisIds = [];
        treatObject.DiagnosisType = "";
        treatObject.DiagnosisSearchType = "";
        treatObject.DiagnosisList = angular.copy(item.DiagnosisArray);

        item.Modifiers = item.Modifiers || "";

        if (item.Modifiers != "") {
            treatObject.SelectedObj1 = item.Modifiers[0] || "";
            treatObject.SelectedObj2 = item.Modifiers[1] || "";
            treatObject.SelectedObj3 = item.Modifiers[2] || "";
            treatObject.SelectedObj4 = item.Modifiers[3] || "";

            treatObject.Modifier1Obj = item.Modifiers[0] || "";
            if (treatObject.Modifier1Obj != "") {
                treatObject.ModifierCode1 = treatObject.Modifier1Obj.ModifierName;
                treatObject.Modifier1 = treatObject.Modifier1Obj.ModifierCode;
            }

            treatObject.Modifier2Obj = item.Modifiers[1] || "";
            if (treatObject.Modifier2Obj != "") {
                treatObject.ModifierCode2 = treatObject.Modifier2Obj.ModifierName;
                treatObject.Modifier2 = treatObject.Modifier2Obj.ModifierCode;
            }

            treatObject.Modifier3Obj = item.Modifiers[2] || "";
            if (treatObject.Modifier3Obj != "") {
                treatObject.ModifierCode3 = treatObject.Modifier3Obj.ModifierName;
                treatObject.Modifier3 = treatObject.Modifier3Obj.ModifierCode;
            }

            treatObject.Modifier4Obj = item.Modifiers[3] || "";
            if (treatObject.Modifier4Obj != "") {
                treatObject.ModifierCode4 = treatObject.Modifier4Obj.ModifierName;
                treatObject.Modifier4 = treatObject.Modifier4Obj.ModifierCode;
            }


        }
        $scope.mainBillingObject.PlaceOfServiceId = $scope.mainBillingObject.PlaceOfServiceId || 0;
        if ($scope.mainBillingObject.PlaceOfServiceId != 0) {
            treatObject.POSId = $scope.mainBillingObject.PlaceOfServiceId;
        }

        $scope.mainBillingObject.BillingDetail = $scope.mainBillingObject.BillingDetail || [];

        $scope.BillClaimActionList = [];
        $scope.mainBillingObject.TotalReceivedAmount = 0;
        $scope.mainBillingObject.TotalBilledCost = 0;


        //$scope.GetInsuranceCoverageProcedureCostById(treatObject);

        var emptybillitemsArray = $filter("filter")($scope.mainBillingObject.BillingDetail, function (bitem, index) { return bitem.OrganizationProcedureId !== 0; });

        if (emptybillitemsArray.length > 0) {
            var treatObject1 = getNewTreatmentObject();
            treatObject1.addedDiagnosisArray = angular.copy($scope.addedDiagnosisArray);
            treatObject1.DiagnosisIds = [];
            treatObject1.DiagnosisType = "";
            treatObject1.DiagnosisSearchType = "";
            treatObject1.POSId = $scope.mainBillingObject.PlaceOfServiceId;
            $scope.mainBillingObject.BillingDetail.push(treatObject1);
        }

    };

    $scope.deleteBillingItem = function (index, item) {
        alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to delete ? </h4>", function () {

            if (item.BillingDetailId != 0) {
                item.DeleteInd = true;
                item.Status = 'D';
                $scope.mainBillingObject.DeletedBillItems.push(item);
            }



            $scope.mainBillingObject.TotalReceivedAmount = 0;
            $scope.mainBillingObject.TotalBilledCost = 0;


            $scope.mainBillingObject.BillingDetail.splice(index, 1);
            angular.forEach($scope.mainBillingObject.BillingDetail, function (item, ind) {
                //  $scope.CalculateTotalAmount(item, ind);
                $scope.CalculateBillingItems(item, ind);
            });

            $scope.$apply();
        }, function () {

        });
    };

    function continuetobilling(printVal, sendDocEmail, sendPatientEmail, sendPatientSms, PrintType) {



        if ($scope.tempIndividualTotalAmt !== $scope.mainBillingObject.TotalBilledCost) {
            var totalBilledCost = $scope.mainBillingObject.TotalBilledCost;
            angular.forEach($scope.mainBillingObject.BillingDetail, function (item) {

                item.TotalAmountReceived = item.TotalAmountReceived || 0;
                var treatDue = item.Total - item.TotalAmountReceived;
                if (!item.IsWaved) {
                    if (totalBilledCost > treatDue) {
                        item.BilledCost = treatDue;
                        totalBilledCost = totalBilledCost - treatDue;
                    } else {
                        item.BilledCost = totalBilledCost;
                        totalBilledCost = 0;
                    }
                }

            });
        }


        $scope.TempBillingObject = angular.copy($scope.mainBillingObject);











        $scope.TempBillingObject.Payments = eHnotePatientDataService.ModifyPaymentsArray($scope.TempBillingObject.Payments);

        //var emptytrasactioncount = 0;
        //if ($scope.SpecializationId === 2) {
        //    angular.forEach($scope.TempBillingObject.Payments, function (pitem) {
        //        if (pitem.PaymentModeId !== 1 && pitem.PaymentModeId !== 18 && pitem.PaymentModeId !== 3) {
        //            if (pitem.TransactionNumber === '') {
        //                emptytrasactioncount++;
        //            }
        //        }
        //    });
        //}

        //if (emptytrasactioncount > 0) {
        //    alertify.error("Please Enter Transaction Number ");
        //    return false;
        //}




        if ($scope.mainBillingObject.TotalBilledCost) {
            var CostInWords = eHnotePrintService.ConvertNumberToWords($scope.mainBillingObject.TotalBilledCost);
            $scope.TempBillingObject.CostInWords = CostInWords;
            $scope.mainBillingObject.CostInWords = CostInWords;
        }
        $scope.TempBillingObject.Signature = doctorinfo.doctordata.User[0].FullName;
        $scope.TempBillingObject.IsSendMail = $scope.IsSendMail;
        $scope.TempBillingObject.IsSendSms = $scope.IsSendSms;

        $scope.TempBillingObject.DoctorEmail = appointmentinfo.DoctorEmail;

        $scope.TempBillingObject.CommunicationEmailId = appointmentinfo.CommunicationEmailId || "";


        //$scope.TempBillingObject.PatientEmail = appointmentinfo.PatientDetails.EmailId ? appointmentinfo.PatientDetails.EmailId : "";
        $scope.TempBillingObject.BranchName = appointmentinfo.BranchName || '';
        $scope.TempBillingObject.BranchEmail = appointmentinfo.BranchEmail || '';
        $scope.TempBillingObject.BranchMobile = appointmentinfo.BranchMobile || null;
        $scope.TempBillingObject.DoctorName = appointmentinfo.DoctorFullName || '';

        //  $scope.TempBillingObject.PatientGender = appointmentinfo.PatientDetails.Gender;
        $scope.TempBillingObject.BranchArea = appointmentinfo.BranchArea || '';


        $scope.SubmitPrintVal = printVal;
        $scope.SubmitPrintType = PrintType;


        $scope.TempBillingObject.TreatmentHistoryIds = "";

        $scope.TempBillingDetail = [];


        $scope.TempBillingObject.BillingDetail = $filter("filter")($scope.TempBillingObject.BillingDetail, function (item, index) {
            return item.ProcedureCost !== "" && item.IsIncluded && item.ProcedureId !== 0;
        });




        //Checking ConvesrionDoctor Mandatory

        //var IsConvesrionDoctorsSelected = eHnoteProcedureDataService.IsConversionDoctorMandatory(window.url, $scope.TempBillingObject.BillingDetail, $scope.ParentHospitalID);
        //if (!IsConvesrionDoctorsSelected) {
        //    alertify.error("Please select conversion doctor for treatment type item(s)");
        //    return;
        //}



        $scope.TempBillingObject.BillingDetail.forEach(function (item, ind) {
            item.RowId = ind + 1;
            item.Cgst = parseFloat(item.Cgst) || 0;
            item.Sgst = parseFloat(item.Sgst) || 0;
            item.Gst = parseFloat(item.Gst) || 0;
            item.Tax = parseFloat(item.Tax) || 0;
            item.ProcedureCost = parseFloat(item.ProcedureCost) || 0;
            item.BilledCost = parseFloat(item.BilledCost) || 0;
            item.TotalAmountReceived += item.BilledCost || 0;
            item.DiscountCost = parseFloat(item.DiscountCost) || 0;
            item.ProcedureId = item.ProcedureId || 0;
            if ($scope.TempBillingObject.PatientGSTNo) {
                item.PatientGSTNo = $scope.TempBillingObject.PatientGSTNo;
            }
            if (item.Service != "") {
                item.Service = $filter('date')(new Date(item.Service), "yyyy-MM-dd");
            }
            if (item.Thru != "") {
                item.Thru = $filter('date')(new Date(item.Thru), "yyyy-MM-dd");
            }
            $scope.TempBillingDetail.push(item);


        });







        $scope.TempBillingObject.AppointmentID = $scope.mainAppointmentId;

        if ($scope.PatientHeaderObj === "" || $scope.PatientHeaderObj === undefined) {
            $scope.TempBillingObject.AdmissionId = "";
        } else {
            $scope.TempBillingObject.AdmissionId = $scope.PatientHeaderObj.PatientAdmissionId;
        }



        $scope.TempBillingObject.BillingDetail = _.sortBy($scope.TempBillingDetail, "RowId");

        $scope.sendDocEmail = sendDocEmail;
        $scope.sendPatientEmail = sendPatientEmail;
        $scope.sendPatientSms = sendPatientSms;


        if (appointmentinfo.DoctorVisitRsnID === 8) {
            $scope.TempBillingObject.Type = "S";//for Surgery procedures.
        } else {
            $scope.TempBillingObject.Type = "T";// other than surgery procedures.
        }







        if ($scope.TempBillingObject) {
            $scope.TempBillingObject.TotalBilledCost = checkRoundVal($scope.TempBillingObject.TotalBilledCost);



            if ($scope.mainAppointmentId === 0) {//Book Dummy Appointment
                var Appparams = {
                    "PatientName": "",
                    "PatientMobile": "",
                    "PatientGender": "",
                    "PatientDOB": "",
                    "PatientAge": "",
                    "AppointmentID": $scope.TempBillingObject.AppointmentID,
                    "ParentAppointmentId": 0,
                    "AppointmentStatus": "B",
                    "StartTime": new Date().toLocaleTimeString("en-US", { "hour": "numeric", "minute": "numeric", "hour12": false }),
                    "EndTime": new Date().toLocaleTimeString("en-US", { "hour": "numeric", "minute": "numeric", "hour12": false }),
                    "DoctorID": 0,
                    "DayCD": $filter("date")(new Date(), "EEE").toUpperCase(),
                    "VisitUserTypeID": "",
                    "OtherVisitRsn": "",
                    "ConsultationDt": $filter("date")(new Date(), "yyyy-MM-dd"),
                    "UserBranchId": "",
                    "PatientID": appointmentinfo.PatientID ? appointmentinfo.PatientID : cacheStorageItem.patientid,
                    "UserId": doctorinfo.doctorid,
                    "USRType": "DOCTOR",
                    "DoctorVisitRsnID": 9,//Billing Type Appointment
                    "HospitalDetails": {
                        "HospitalID": $scope.HospitalID,
                        "ParentHospitalID": ""//For sms Purpose added by sabarish
                    },
                    "ReferralSourceDtls": {
                        "ReferralID": "",
                        "SubReferralID": 2
                    },
                    "CommunicationDetails": {
                        "PatientName": "",
                        "PatientMobile": "",
                        "DoctorMobile": "",
                        "HospitalName": "",
                        "DoctorName": "",
                        "AppDate": "",
                        "AppTime": "",
                        "AppClinic": "",
                        "AppToken": 0,
                        "PatientEmail": "",
                        "BranchEmail": "",
                        "DoctorEmail": "",
                        "CommunicationEmailId": "",
                        "HospitalContact": "",
                        "BrnachAddress": {
                            "Address1": "",
                            "Address2": "",
                            "Location": "",
                            "StateId": "",
                            "PinCode": "",
                            "CountryId": "",
                            "CityId": "",
                            "DistrictRegion": "",
                            "Latitude": "",
                            "Longitude": ""
                        }
                    },
                    "PreviousAppointmentDate": "",
                    "PreviousAppointmentTime": "",
                    "IsFollowUp": false,
                    "SendDocSms": false,
                    "SendDocEmail": false,
                    "SendPatientEmail": false,
                    "SendPatientSms": false,
                    "PatientEmail": "",
                    "PatientTypeId": 1,
                    "PatientTitle": "",
                    "PaidFollowup": false
                };
                $scope.TempBillingObject.IsDummyAppointment = true;
                $scope.BookDummyAppointment(Appparams, $scope.TempBillingObject, docid, appointmentinfo, appointmentinfo.PatientID, $scope.HospitalID, sendDocEmail, sendPatientEmail, sendPatientSms, appointmentinfo.DoctorID, $scope.HospitalID, $scope.ParentHospitalID);
            } else {
                if ($scope.IsDummyAppt) {
                    $scope.TempBillingObject.IsDummyAppointment = true;
                } else {
                    $scope.TempBillingObject.IsDummyAppointment = false;
                }
                mergeBillingsandContinue($scope.TempBillingObject, sendDocEmail, sendPatientEmail, sendPatientSms);
            }
        }
    }

    function mergeBillingsandContinue(mainitem, sendDocEmail, sendPatientEmail, sendPatientSms) {


        appointmentinfo.PatientID = appointmentinfo.PatientID ? appointmentinfo.PatientID : cacheStorageItem.patientid;

        var billingTypeId = 1;

        for (var i = mainitem.BillingDetail.length - 1; i >= 0; i--) {
            if (!mainitem.BillingDetail[i].IsIncluded) {
                mainitem.BillingDetail.splice(i, 1);
            }
        }


        angular.forEach(mainitem.BillingDetail, function (pitem) {
            if (pitem.AppointmentID === 0) {
                pitem.AppointmentID = mainitem.AppointmentID;
            }
        });
        mainitem.DiagnosisList = [];
        if ($scope.DiagnosisListArray.length > 0) {
            angular.forEach($scope.DiagnosisListArray, function (nitem) {
                if (nitem.DiagnosisId != 0) {
                    var obj = {
                        "DiagnosisId": nitem.DiagnosisId,
                        "ICD10DIAGDESCRIPTION": nitem.ICD10DIAGDESCRIPTION,
                        "Type": nitem.Type,
                        "DeleteInd": 'N',
                    }
                    mainitem.DiagnosisList.push(obj);
                }
            });
        }

        mainitem.IsCreditBill = $scope.IsCreditBill || false;
        mainitem.PatientInsuranceDetailId = $scope.PatientInsuranceDetailId || 0;
        if ($scope.IsCreditBillingType === 'No') {
            mainitem.IsCreditBill = false;
            mainitem.PatientInsuranceDetailId = 0;
        }
        mainitem.IsCorporateBill = false;

        mainitem.IsPatientPaid = 0;
        if (mainitem.TotalBilledCost > 0) {
            mainitem.IsPatientPaid = 1;
        }
        var docid = appointmentinfo.AppointmentDoctorId;




        if ($scope.SaveasDraftorBiller == 'Biller') {
            if ($scope.IsDynamicCheckInMandatory == true && $scope.isofflinebilling == false && $scope.BillUpdateOnLegderpopup == false) {

                $scope.OpenSendtoPopup(mainitem, docid, appointmentinfo, appointmentinfo.PatientID, sendDocEmail, sendPatientEmail, sendPatientSms, appointmentinfo.DoctorID, $scope.HospitalID, $scope.ParentHospitalID, $scope.Billingpageno, billingTypeId, doctorinfo.doctordata.UserAddress[0].IsSMSInd, doctorinfo.doctordata.UserAddress[0].SMSSenderId, onBillingSaveSuccess, onBillingSaveError);

            }
            else {
                eHnotePatientDataService.AddUpdateBilling(mainitem, docid, appointmentinfo, appointmentinfo.PatientID, sendDocEmail, sendPatientEmail, sendPatientSms, appointmentinfo.DoctorID, $scope.HospitalID, $scope.ParentHospitalID, $scope.Billingpageno, billingTypeId, doctorinfo.doctordata.UserAddress[0].IsSMSInd, doctorinfo.doctordata.UserAddress[0].SMSSenderId, onBillingSaveSuccess, onBillingSaveError);
            }
        }

        if ($scope.SaveasDraftorBiller == 'Draft') {
            if ($scope.IsDynamicCheckInMandatory == true && $scope.isofflinebilling == false && $scope.BillUpdateOnLegderpopup == false) {

                $scope.OpenSendtoPopup(mainitem, docid, appointmentinfo, appointmentinfo.PatientID, sendDocEmail, sendPatientEmail, sendPatientSms, appointmentinfo.DoctorID, $scope.HospitalID, $scope.ParentHospitalID, $scope.Billingpageno, billingTypeId, doctorinfo.doctordata.UserAddress[0].IsSMSInd, doctorinfo.doctordata.UserAddress[0].SMSSenderId, onBillingSaveSuccess, onBillingSaveError);

            }
            else {
                eHnotePatientDataService.AddUpdateBillingDraft(mainitem, docid, appointmentinfo, appointmentinfo.PatientID, sendDocEmail, sendPatientEmail, sendPatientSms, appointmentinfo.DoctorID, $scope.HospitalID, $scope.ParentHospitalID, $scope.Billingpageno, billingTypeId, doctorinfo.doctordata.UserAddress[0].IsSMSInd, doctorinfo.doctordata.UserAddress[0].SMSSenderId, onBillingDraftSaveSuccess, onBillingDraftSaveError);
            }
        }


        if ($scope.SaveasDraftorBiller == 'PendingClaims') {
            mainitem.Mode = 'Update';
            eHnotePatientDataService.AddUpdateBilling(mainitem, docid, appointmentinfo, appointmentinfo.PatientID, sendDocEmail, sendPatientEmail, sendPatientSms, appointmentinfo.DoctorID, $scope.HospitalID, $scope.ParentHospitalID, $scope.Billingpageno, billingTypeId, doctorinfo.doctordata.UserAddress[0].IsSMSInd, doctorinfo.doctordata.UserAddress[0].SMSSenderId, onBillingPendingSaveSuccess, onBillingSaveError);
        }

    }

    function preContinueBooking(printVal, sendDocEmail, sendPatientEmail, sendPatientSms, PrintType) {


        var pAmount = 0;



        $scope.mainBillingObject.RefundableAmount = 0;



        angular.forEach($scope.mainBillingObject.Payments, function (item) {
            pAmount += parseFloat(item.Amount) || 0;
        });


        if ($scope.editinvoice) {
            if (pAmount !== $scope.mainBillingObject.TotalBilledCost) {
                alertify.error("Collected amount missmatched with Billed Amount");
                return false;
            }
        }



        $scope.mainBillingObject.TotalBilledCost = pAmount;


        if ($scope.mainBillingObject.TotalAmountToBeCollected === 0) {
            continuetobilling(printVal, sendDocEmail, sendPatientEmail, sendPatientSms, PrintType);
        } else {
            if (pAmount > $scope.mainBillingObject.TotalAmountToBeCollected || pAmount < $scope.mainBillingObject.TotalAmountToBeCollected) {

                alertify.confirm("<b class='txt-centre'>Note !</b><h4 class='txt-body-centre'> Collected Amount Mismatched With Payment Details.<br>Do You Want To Continue ? </h4>", function () {
                    continuetobilling(printVal, sendDocEmail, sendPatientEmail, sendPatientSms, PrintType);
                }, function () {

                });
            } else if (pAmount === $scope.mainBillingObject.TotalAmountToBeCollected) {
                continuetobilling(printVal, sendDocEmail, sendPatientEmail, sendPatientSms, PrintType);
            }

        }

    }

    $scope.ValidateData = function () {
        var keepGoing = true;

        if ($scope.currentUrl !== '/profile') {
            if ($scope.mainBillingObject.BillingDetail.length > 0) {
                angular.forEach($scope.mainBillingObject.BillingDetail, function (pre, index) {
                    if (keepGoing) {
                        pre.ProcedureId = pre.ProcedureId || pre.ProcedureID || 0;
                        if (pre.ProcedureId != 0) {
                            if (pre.DiagnosisIds.length === 0) {
                                alertify.error("Enter Diagnosis pointers");
                                keepGoing = false;
                                return false;
                            }
                        }

                    }
                });
            }
        }

        if ($scope.mainBillingObject.ClaimTypeId === 2) {
            if ($scope.mainBillingObject.BillingDetail.length > 0) {
                angular.forEach($scope.mainBillingObject.BillingDetail, function (pre, index) {
                    if (keepGoing) {
                        pre.ProcedureId = pre.ProcedureId || pre.ProcedureID || 0;
                        if (pre.ProcedureId != 0) {
                            pre.RevenueBillingCodeId = pre.RevenueBillingCodeId || 0;
                            if (pre.RevenueBillingCodeId == 0) {
                                alertify.error("Please Add Revenue Codes");
                                keepGoing = false;
                                return false;
                            }
                        }
                    }
                });
            }
        }

        return keepGoing;
    }

    $scope.saveBilling = function (printVal, sendDocEmail, sendPatientEmail, sendPatientSms, PrintType) {

        var filteredProducts = $filter("filter")($scope.mainBillingObject.BillingDetail, function (item) {
            return item.ProcedureId !== 0;
        });
        if (filteredProducts.length === 0) {
            alertify.error("Please Add Any Procedure");
            return false;
        }






        if ($scope.mainBillingObject.Mode === 'Update') {
            var pAmount = 0;
            angular.forEach($scope.mainBillingObject.Payments, function (item) {
                pAmount += parseFloat(item.Amount) || 0;
            });
            if (pAmount !== $scope.mainBillingObject.TotalBilledCost) {
                alertify.error("Amount MissMatched");
                angular.forEach($scope.mainBillingObject.Payments, function (item) {
                    item.Amount = "";
                });
                return false;
            }
        }




        var filteredPackageProducts = $filter("filter")($scope.mainBillingObject.BillingDetail, function (item) {
            return item.ProcedureTypeId === 7 && item.IsIncluded === true && item.PackageItemDetailsArray.length > 0;
        });



        $scope.printPackageDetailIndicator = false;
        if (filteredPackageProducts.length > 0 && printVal === "Print") {
            $scope.printPackageDetailIndicator = true;
        }
        $scope.printInventoryPackageDetailIndicator = false;


        preContinueBooking(printVal, sendDocEmail, sendPatientEmail, sendPatientSms, PrintType);


    };

    $scope.DynamicStatusSelection = function (printVal, sendDocEmail, sendPatientEmail, sendPatientSms, PrintType, Type) {
        appointmentinfo.AppointmentID = appointmentinfo.AppointmentID || 0
        appointmentinfo.ConsultationDt = appointmentinfo.ConsultationDt || "";

        $scope.SaveasDraftorBiller = Type || 'Biller';

        $scope.mainBillingObject.BillingProviderId = $scope.mainBillingObject.BillingProviderId || 0;





        if ($scope.SaveasDraftorBiller === 'PendingClaims') {
            $scope.mainBillingObject.PatientClaimId = $scope.BillingDataobj.Selectobj.PatientClaimId;
        }



        if ($scope.mainBillingObject.BillingProviderId === 0) {
            alertify.error("Please Select Billing Provider");
            return false;
        }


        $scope.mainBillingObject.RenderingProviderId = $scope.mainBillingObject.RenderingProviderId || 0;
        if ($scope.mainBillingObject.RenderingProviderId === 0) {
            alertify.error("Please Select Rendering Provider");
            return false;
        }


        //if ($scope.mainBillingObject.BillingDetail.length > 0) {
        //    var filterdiagnosis = $filter("filter")($scope.mainBillingObject.BillingDetail, { "DiagnosisType": "" }, true);
        //    if (filterdiagnosis.length > 0) {             
        //        alertify.error("Please Add Diagnosis Pointer");
        //        return false;
        //    }
        //}


        var currentDayBill = false
        if (appointmentinfo.ConsultationDt !== "") {
            var currentBillDate = $filter("date")(new Date(), "yyyy-MM-dd");
            var AppointmentDate1 = new Date(appointmentinfo.ConsultationDt);
            var BillDate1 = new Date(currentBillDate);
            if (AppointmentDate1.getTime() === BillDate1.getTime()) {
                currentDayBill = true;
            }
        }



        if ($scope.mainBillingObject.PayorDetails.length !== 0) {
            angular.forEach($scope.mainBillingObject.PayorDetails, function (item) {
                item.TotalInsuranceAmount = 0;
                item.TotalPatientCopay = 0;
                item.DueFromInsurance = 0;
            });

            if ($scope.mainBillingObject.BillingDetail.length !== 0) {
                angular.forEach($scope.mainBillingObject.BillingDetail, function (item) {

                    if ($scope.mainBillingObject.BillTypeId == 4) {
                        var totalinsamt = 0;

                        totalinsamt = item.InsuranceAmount1;
                        $scope.mainBillingObject.PayorDetails[0].TotalInsuranceAmount += totalinsamt;
                        $scope.mainBillingObject.PayorDetails[0].TotalPatientCopay += item.PatientCoPay;
                        $scope.mainBillingObject.PayorDetails[0].DueFromInsurance += item.InsuranceBalance;
                        $scope.mainBillingObject.PayorDetails[0].TotalBillAmount = $scope.mainBillingObject.TotalChargeAmount;

                        if ($scope.mainBillingObject.PayorDetails.length == 2) {
                            var totalinsamt = 0;
                            totalinsamt = item.InsuranceAmount2;
                            $scope.mainBillingObject.PayorDetails[1].TotalInsuranceAmount += totalinsamt;
                            $scope.mainBillingObject.PayorDetails[1].TotalPatientCopay += item.PatientCoPay;
                            $scope.mainBillingObject.PayorDetails[1].DueFromInsurance += item.InsuranceBalance;
                            $scope.mainBillingObject.PayorDetails[1].TotalBillAmount = $scope.mainBillingObject.TotalChargeAmount;
                        }
                    }
                    else {
                        var totalinsamt = 0;
                        totalinsamt = item.InsuranceAmount1 + item.InsuranceAmount2;
                        $scope.mainBillingObject.PayorDetails[0].TotalInsuranceAmount += totalinsamt;
                        $scope.mainBillingObject.PayorDetails[0].TotalPatientCopay += item.PatientCoPay;
                        $scope.mainBillingObject.PayorDetails[0].DueFromInsurance += item.InsuranceBalance;
                        $scope.mainBillingObject.PayorDetails[0].TotalBillAmount = $scope.mainBillingObject.TotalChargeAmount;
                    }



                });
            }
        }


        if ($scope.ValidateData()) {
            $scope.saveBilling(printVal, sendDocEmail, sendPatientEmail, sendPatientSms, PrintType);

        }


    }

    function onBillingSaveSuccess(resp) {

        if (resp.data.status === "Failure") {
            $scope.DisablePayment = false;
            alertify.error("Saving billing failed");

            return;
        }
        if (resp.data.status === "Success") {
            alertify.success("Billing completed");

            if ($scope.IsComingFrom == 'OPBilling' && $scope.BillUpdateOnLegderpopup == false) {
                var object = {
                    "tabno": 1,
                };
                $scope.$emit('billingPageEvent', { "object": object });
            } else if ($scope.BillUpdateOnLegderpopup == true) {
                $scope.GetPatientInvoiceslist();
            } else {
                // $scope.billMain.showBillingScreen = false;
                $location.url("/Biller");
            }


            if ($scope.SubmitPrintVal === "Print") {
                var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
                var costinwords = eHnotePrintService.ConvertNumberToWords($scope.mainBillingObject.TotalBilledCost);
                var pDate = $filter('date')($scope.mainBillingObject.BillDate, "dd-MMM-yyyy");
                var pTime = moment($scope.mainBillingObject.BillDate).format("HH:mm");
                var pDateTime = pDate;
                $scope.PaymentTypeName = "";



                var GSTDiscountObject = eHnoteProcedureDataService.DiscountOrGSTEnabledObject($scope.mainBillingObject.BillingDetail);




                var appdate = "";
                if ($scope.Billingpageno === 1) {
                    appdate = appointmentinfo.ConsultationDt;
                } else {
                    if ($scope.AppointmentDatesArray.length > 0) {
                        appdate = $scope.AppointmentDatesArray[0].AppointmentDate;
                    } else {
                        appdate = $filter("date")(new Date(), "yyyy-MM-dd");
                    }
                }

                var billingobject = {
                    "InvoiceNumber": resp.data.InvoiceId,
                    "ReceiptNumber": resp.data.ReceiptNo,
                    "BillNumber": resp.data.BillingId,
                    "TotalNetAmount": $scope.mainBillingObject.TotalSubAmount,
                    "TotalGrossAmount": $scope.mainBillingObject.TotalNetAmount,
                    "TotalDiscountAmount": $scope.mainBillingObject.TotalDiscountAmount,
                    "TotalReceivedAmount": $scope.mainBillingObject.TotalReceivedAmount,
                    "TotalBilledCost": $scope.mainBillingObject.TotalBilledCost,
                    "TotalBalance": $scope.mainBillingObject.TotalBalance,
                    "BillingDetail": $scope.mainBillingObject.BillingDetail,
                    "UserName": userLoginDetails.displayName,
                    "DoctorName": $scope.mainBillingObject.DoctorFullName ? $scope.mainBillingObject.DoctorFullName : appointmentinfo.DoctorFullName,
                    "CostInWords": costinwords,
                    "previousPaidAmount": $scope.mainBillingObject.PreviousPaidAmount,
                    "TotalGSTAmount": $scope.mainBillingObject.TotalGST,
                    "TotalWaviedOffAmount": $scope.mainBillingObject.TotalWaviedOffAmount,
                    "Printdate": $filter("date")(new Date(), "dd-MMM-yyyy"),
                    "TotalSubAmount": $scope.mainBillingObject.TotalSubAmount,
                    "PatientGSTNo": $scope.mainBillingObject.PatientGSTNo || "",
                    "BillDate": $filter("date")(resp.data.BillDate, "dd-MMM-yyyy"),
                    "AppointmentDate": $filter("date")(appdate, "dd-MMM-yyyy"),
                    "OrgGSTNO": $scope.TempBillingObject.OrgGSTNO || "",
                    "PayableAdvanceAmount": $scope.mainBillingObject.PayableAdvanceAmount,
                    "PaymentType": $scope.PaymentTypeName,
                    "TotalCollectedAmount": $scope.mainBillingObject.TotalCollectedAmount,
                    "BillType": "OP",
                    "Payments": $scope.mainBillingObject.Payments,
                    "IsDiscountChecked": GSTDiscountObject.IsDiscountChecked,
                    "IsGSTChecked": GSTDiscountObject.IsGSTChecked,
                    "RenderingProvider": $scope.mainBillingObject.RenderingProviderName,
                    "ReferringProvider": $scope.mainBillingObject.ReferralObj.DoctorName,
                    "BillingProvider": $scope.mainBillingObject.BillingProviderName,
                    "BillingProviderNPI": $scope.mainBillingObject.BillingProviderObj.NPI,
                    "TotalInsuranceAmount": $scope.mainBillingObject.TotalInsuranceAmount,
                    "TotalChargeAmount": $scope.mainBillingObject.TotalChargeAmount,
                    "InsuranceBalance": $scope.mainBillingObject.DueFromInsurance,
                    "TotalCopayAmount": $scope.mainBillingObject.TotalCopayAmount,
                    "TotalPatientBalance": $scope.mainBillingObject.TotalPatientBalance
                };






                var printDate = $filter("date")(new Date(), "dd-MMM-yyyy");
                var printTime = moment(new Date()).format("HH:mm");
                var printDatemTime = printDate + "  " + printTime;


                appointmentinfo.PatientDetails.PatientDisplayId = resp.data.PatientDisplayId;
                eHnoteMasterDataService.addAppointmentInfo(appointmentinfo);



                var GSTNumber = "";
                if (appointmentinfo.OrgGSTNO !== undefined && appointmentinfo.OrgGSTNO !== "") {
                    GSTNumber = appointmentinfo.OrgGSTNO;
                }
                else if (billingobject !== undefined) {
                    if (billingobject.OrgGSTNO !== undefined && billingobject.OrgGSTNO !== "") {
                        GSTNumber = billingobject.OrgGSTNO;
                    }
                }



                var location = "";
                var stateName = "";
                var cityName = "";
                var countryName = "";
                var address3 = "";

                if (doctorinfo.doctordata !== undefined) {
                    if (doctorinfo.doctordata.UserAddress[0] !== undefined) {
                        if (doctorinfo.doctordata.UserAddress[0].Location !== undefined) {
                            location = doctorinfo.doctordata.UserAddress[0].Location + ',' || "";
                        }
                        if (doctorinfo.doctordata.UserAddress[0].CityName !== undefined) {
                            cityName = doctorinfo.doctordata.UserAddress[0].CityName + ',' || "";
                        }
                        if (doctorinfo.doctordata.UserAddress[0].StateName !== undefined) {
                            stateName = doctorinfo.doctordata.UserAddress[0].StateName + ',' || "";
                        }
                        if (doctorinfo.doctordata.UserAddress[0].CountryName !== undefined) {
                            countryName = doctorinfo.doctordata.UserAddress[0].CountryName + '.' || "";
                        }
                        address3 = location + cityName + stateName + countryName;
                    }
                }

                appointmentinfo.BranchName = doctorinfo.doctordata.UserAddress[0].ClinicName ? doctorinfo.doctordata.UserAddress[0].ClinicName : "";
                appointmentinfo.BranchEmail = doctorinfo.doctordata.UserAddress[0].BranchEmail ? doctorinfo.doctordata.UserAddress[0].BranchEmail : "";
                appointmentinfo.BranchMobile = doctorinfo.doctordata.UserAddress[0].MobileNo ? doctorinfo.doctordata.UserAddress[0].MobileNo : "";
                appointmentinfo.BranchPincode = doctorinfo.doctordata.UserAddress[0].PinCode ? doctorinfo.doctordata.UserAddress[0].PinCode : "";
                appointmentinfo.BranchGst = GSTNumber;
                appointmentinfo.Address1 = doctorinfo.doctordata.UserAddress[0].Address1 ? doctorinfo.doctordata.UserAddress[0].Address1 : "";
                appointmentinfo.Address2 = doctorinfo.doctordata.UserAddress[0].Address2 ? doctorinfo.doctordata.UserAddress[0].Address2 : "";
                appointmentinfo.Address3 = address3;

                var billingcatType = "Self";



                if ($scope.cacheStorageItem.BillingCategoryType === undefined) {
                    if (appointmentinfo.BillingCategoryType !== undefined) {
                        billingcatType = appointmentinfo.BillingCategoryType;
                    }
                } else {
                    billingcatType = $scope.cacheStorageItem.BillingCategoryType;
                }



                var printObj = {
                    "patientinfo": appointmentinfo,
                    "doctorinfo": doctorinfo,
                    "appointmentinfo": appointmentinfo,
                    "BillingObject": billingobject,
                    "PrintedDatenTime": printDatemTime,
                    "date": pDateTime,
                    "displayID": resp.data.PatientDisplayId,
                    "BillingCategoryType": billingcatType,
                    "PaymentType": $scope.cacheStorageItem.PaymentType || "",
                    "ReceiptName": "BILLING RECEIPT",
                    "CancelRemarks": "",
                    "PaymentType": $scope.cacheStorageItem.PaymentType || ""
                };




                if ($scope.SubmitPrintType === "A6") {
                    eHnotePrintService.newBillPrintForPartha(printObj);
                }
                else if ($scope.SubmitPrintType === "A5") {
                    eHnotePrintService.newprintA5(printObj, '', $scope.PrintObj.PrintLanguageId);
                }
                else {
                    eHnotePrintService.generateNewBillPrintCopy(printObj, '', $scope.PrintObj.PrintLanguageId);
                }



                if ($scope.printPackageDetailIndicator) {
                    eHnotePrintService.generateBillingPackageDetailPrint(printObj);
                    $scope.printPackageDetailIndicator = false;
                }

                if ($scope.printInventoryPackageDetailIndicator) {
                    eHnotePrintService.generateBillingInventoryPackageDetailPrint(printObj);
                    $scope.printInventoryPackageDetailIndicator = false;
                }



            }

        }
    }
    function onBillingSaveError(err) {
        console.log(err);
        alertify.error("Saving billing failed");
    }

    function onBillingPendingSaveSuccess(resp) {

        if (resp.data.status === "Failure") {
            $scope.DisablePayment = false;
            alertify.error("Saving billing failed");
            return;
        }

        if (resp.data.status === "Success") {
            alertify.success("Claim saved successfully");

            if ($scope.mainBillingObject.ClaimSendViaId == 1) {
                if ($scope.orgftpDetails.ClearingHouseTypeId === 1) {
                    if ($scope.mainBillingObject.ClaimStatusId == 1) {
                        $scope.ValidateClaim($scope.mainBillingObject);
                    } else {
                        $scope.SubmitClaimMain($scope.mainBillingObject);
                    }
                } else {
                    $scope.SubmitClaimMainEDI($scope.mainBillingObject);
                }
            }
            else {
                $rootScope.mInstanceAdd.close("save");
            }

        }
    }

    function onBillingDraftSaveSuccess(resp) {

        if (resp.data.status === "Failure") {
            $scope.DisablePayment = false;
            alertify.error("Saving billing failed");
            return;
        }

        if (resp.data.status === "Success") {
            alertify.success("Draft saved successfully");
            var object = {
                "tabno": 1,
            };
            $scope.$emit('billingPageEvent', { "object": object });
        }
    }
    function onBillingDraftSaveError(err) {
        console.log(err);
        alertify.error("Saving billing failed");
    }


    $scope.RemovebillingDiagnosis = function (mainitem, item) {
        var index = mainitem.DiagnosisIds.indexOf(item);
        if (index > -1) {
            mainitem.DiagnosisIds.splice(index, 1);
        }
    }


    $scope.GotoViewPayment = function () {

        $scope.obj = {
            "BillingHistoryId": $scope.mainBillingObject.BillingHistoryId,
            "BillId": $scope.mainBillingObject.BillingId
        };

        var modalInstance = $uibModal.open({
            "templateUrl": "templates/consultation/billing/GetViewPaymentLog.html",
            // "controller": "EhnoteAddupdatePatientDepositsCtrl",
            "resolve": {
                "Selectobj": function () { return $scope.obj; },
            },
            "size": "lg",
            "backdrop": "static",
            "keyboard": false,
            "controller": function ($scope, $uibModal, $uibModalInstance, Selectobj, eHnotePatientDataService) {
                $scope.Selectobj = Selectobj || '';
                $scope.inti = function () {
                    eHnotePatientDataService.GetPatientInvoiceItemsbyId($scope.Selectobj.BillingHistoryId, 0).then(function (resp) {
                        restructureInvoiceItems(resp, $scope.Selectobj);
                    }, function (err) {
                        console.log(err);
                    });
                }
                $scope.inti();


                $scope.ClosePopup = function () {
                    $uibModalInstance.dismiss("cancel");
                };
            }


        });


    };

    $scope.GotoViewDepositsPayment = function () {

        $scope.obj = {
            "PatientId": $scope.cacheStorageItem.PatientID,
            "HospitalId": $scope.HospitalId
        };

        var modalInstance = $uibModal.open({
            "templateUrl": "templates/consultation/billing/GetViewPaymentLog.html",
            // "controller": "EhnoteAddupdatePatientDepositsCtrl",
            "resolve": {
                "Selectobj": function () { return $scope.obj; },
            },
            "size": "lg",
            "backdrop": "static",
            "keyboard": false,
            "controller": function ($scope, $uibModal, $uibModalInstance, Selectobj, eHnotePatientDataService) {
                $scope.Selectobj = Selectobj || '';
                $scope.inti = function () {
                    eHnotePatientDataService.GetPatientInvoiceItemsbyId($scope.Selectobj.BillingHistoryId, 0).then(function (resp) {
                        restructureInvoiceItems(resp, $scope.Selectobj);
                    }, function (err) {
                        console.log(err);
                    });
                }
                $scope.inti();


                $scope.ClosePopup = function () {
                    $uibModalInstance.dismiss("cancel");
                };
            }
            /* "windowClass": "inventory-full-popup"*/

        });


    };

    $scope.AddDiagnosisUib = function (subitem) {
        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/USBilling/uibpopups/AddDiagnosis.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            //"size": "lg",
            "windowClass": "inventory-full-popup",
            "resolve": {
                "AdvicedDiagnosisList": function () { return $scope.AdvicedDiagnosisList; },
                "DiagnosisList": function () { return subitem.DiagnosisList; },
                "ParentHospitalID": function () { return angular.copy($scope.ParentHospitalID) }
            },
            "controller": function ($scope, $uibModal, $uibModalInstance, AdvicedDiagnosisList, DiagnosisList, ParentHospitalID) {
                $scope.AdvicedDiagnosisList = AdvicedDiagnosisList || [];
                $scope.SearchDiagnosisList = [];
                $scope.SelectedDiagnosisList = [];
                $scope.obj = { "SelectedDiagnosis": "" };
                $scope.SelectedDiagnosisList = DiagnosisList || [];
                $scope.ParentHospitalID = ParentHospitalID || null;
                $scope.newobja = {
                    "count": "",
                    "PageSize": 10,
                    "PageNumber": 1,
                    "SearchText": ""
                };
                $scope.SearchType = 1;
                $scope.changeDiagnosis = function (val, type) {
                    type = parseInt(type);
                    if (val.length >= 3) {
                        var SearchCode = "";
                        var SearchText = "";
                        if (type === 1) {
                            SearchCode = val;
                        }
                        if (type === 2) {
                            SearchText = val;
                        }
                        object = {
                            "HospitalId": $scope.HospitalID,
                            "UserId": $scope.UserId,
                            "SpecializationId": $scope.SpecializationId,
                            "SearchText": "",
                            "PageSize": $scope.newobja.PageSize,
                            "PageNumber": $scope.newobja.PageNumber,
                            "SearchCode": SearchCode || "",
                            "SearchDescription": SearchText || "",
                            "IsFrequent": "N",
                            "ParentOrganizationId": $scope.ParentHospitalID || null
                        };

                        eHnoteSettingsDataService.getMasterDiagnosisForICD10Codes(object).success(function (response) {

                            if (response.DiagnosisList !== undefined) {
                                if (response.DiagnosisList.length > 0) {
                                    $scope.SearchDiagnosisList = response.DiagnosisList;
                                    $scope.newobja.count = response.count;
                                }
                            }
                        }).error(function (error) {
                            console.log(error);
                        });
                    }
                };

                $scope.AddDiagnosis = function (kitem) {
                    $scope.SelectedDiagnosisList = $scope.SelectedDiagnosisList || [];
                    var List = $filter("filter")($scope.SelectedDiagnosisList, { "DiagnosisId": kitem.DiagnosisId }, true);
                    if (List.length === 0) {
                        if ($scope.SelectedDiagnosisList.length > 11) {
                            alertify.error("You have reached Maximum limit!");
                            return;
                        } else {
                            $scope.SelectedDiagnosisList.push(kitem);
                        }

                    } else {
                        alertify.error("Diagnosis already Recommended!");
                        return;
                    }

                }
                $scope.SelectedAdviceditem = function (kitem) {
                    $scope.SelectedDiagnosisList = $scope.SelectedDiagnosisList || [];
                    var List = $filter("filter")($scope.SelectedDiagnosisList, { "DiagnosisId": kitem.DiagnosisId }, true);
                    if (List.length === 0) {
                        if ($scope.SelectedDiagnosisList.length > 11) {
                            alertify.error("You have reached Maximum limit!");
                            return;
                        } else {
                            var obj1 = {
                                "DiagnosisId": kitem.DiagnosisId,
                                "DiagnosisTypeId": kitem.DiagnosisTypeId || null,
                                "ICD10CODE": kitem.ICD10CODE || null,
                                "ICD10DIAGDESCRIPTION": kitem.ICD10DIAGDESCRIPTION || '',
                                "ICD10DIAGNAME": kitem.ICD10DIAGNAME || '',
                                "OrganizationId": kitem.OrganizationId || null,
                                "SpecializationId": kitem.SpecializationId || null,

                            }
                            $scope.SelectedDiagnosisList.push(obj1);
                        }

                    } else {
                        alertify.error("Diagnosis already Recommended!");
                        return;
                    }

                }
                $scope.changePageDiag = function (pageno) {
                    $scope.newobja.PageNumber = pageno;
                    $scope.changeDiagnosis($scope.obj.SelectedDiagnosis, $scope.SearchType);
                };


                $scope.RemoveDiagnosis = function (item) {

                    var index = $scope.SelectedDiagnosisList.indexOf(item);
                    if (index > -1) {
                        $scope.SelectedDiagnosisList.splice(index, 1);
                    }
                }


                $scope.SaveDiagnosis = function () {
                    $scope.getDiagnosisListArray();
                    //if ($scope.SelectedDiagnosisList.length > 0) {
                    //    angular.forEach($scope.SelectedDiagnosisList, function (kitem) {
                    //        angular.forEach($scope.DiagnosisListArray, function (mitem) {
                    //            if (kitem.Type === mitem.Type) {
                    //                mitem.DiagnosisId = kitem.DiagnosisId;
                    //                mitem.ICD10Code = kitem.ICD10CODE;
                    //                mitem.Description = kitem.ICD10DIAGDESCRIPTION;
                    //                mitem.SelectedCode = kitem.ICD10CODE;
                    //            //  mitem.Type = kitem.Type;
                    //            //  mitem.IsDiagnosisInd = true;
                    //            //  mitem.IsFavouriteInd = kitem.IsFavouriteInd;
                    //                mitem.selectedDiagnosisObj = kitem.ICD10CODE + '-' + kitem.ICD10DIAGDESCRIPTION;
                    //            }
                    //        });
                    //    });
                    //}

                    //  $uibModalInstance.dismiss("cancel");
                    $uibModalInstance.close($scope.SelectedDiagnosisList);
                    $scope.obj.SelectedDiagnosis = "";
                    $scope.SelectedDiagnosisList = [];
                    $scope.SearchDiagnosisList = [];
                }

                $scope.ChangeSearchType = function () {
                    $scope.obj.SelectedDiagnosis = "";
                }
                $scope.closeItems = function () {
                    $uibModalInstance.dismiss("cancel");
                };
            }
        });
        $scope.mInstanceAdd.result.then(function (SelectedDiagnosisArray) {
            SelectedDiagnosisArray = SelectedDiagnosisArray || [];
            if (SelectedDiagnosisArray.length != 0) {
                angular.forEach(SelectedDiagnosisArray, function (item) {
                    var obj = {
                        "DiagnosisId": item.DiagnosisId,
                        "ICD10CODE": item.ICD10CODE,
                        "ICD10DIAGDESCRIPTION": item.ICD10DIAGDESCRIPTION,
                        "DeleteInd": 'N',
                        //  "ICD10DIAGNAME": item.ICD10DIAGNAME,

                    }
                    subitem.DiagnosisIds = subitem.DiagnosisIds || [];
                    subitem.DiagnosisIds.push(obj);
                });
            }
            //  subitem.DiagnosisList = SelectedDiagnosisArray;

        }, function () { });
    }

    $scope.AddModifiersUib = function (subitem) {
        $scope.mInstanceModifierAdd = $uibModal.open({
            "templateUrl": "templates/USBilling/uibpopups/AddModifiers.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            "size": "sm",
            "resolve": {
                "masterModifierList": function () { return $scope.masterModifierList; },
                "Mainitem": function () { return subitem; },
            },
            "controller": function ($scope, $uibModal, $uibModalInstance, masterModifierList, Mainitem) {
                $scope.masterModifierList = masterModifierList || [];
                $scope.ModifierList = angular.copy($scope.masterModifierList);
                $scope.Mainitem = Mainitem;
                $scope.SelectedModifiersList = [];
                if (Mainitem.Modifier1 !== '') {
                    var List = $filter("filter")($scope.masterModifierList, { "MODIFIERID": Mainitem.Modifier1 }, true);
                    if (List.length != 0) {
                        $scope.SelectedModifiersList.push(List[0]);
                    }
                }
                if (Mainitem.Modifier2 !== '') {
                    var List1 = $filter("filter")($scope.masterModifierList, { "MODIFIERID": Mainitem.Modifier2 }, true);
                    if (List1.length != 0) {
                        $scope.SelectedModifiersList.push(List1[0]);
                    }
                }
                if (Mainitem.Modifier3 !== '') {
                    var List2 = $filter("filter")($scope.masterModifierList, { "MODIFIERID": Mainitem.Modifier3 }, true);
                    if (List2.length != 0) {
                        $scope.SelectedModifiersList.push(List2[0]);
                    }
                }
                if (Mainitem.Modifier4 !== '') {
                    var List3 = $filter("filter")($scope.masterModifierList, { "MODIFIERID": Mainitem.Modifier4 }, true);
                    if (List3.length != 0) {
                        $scope.SelectedModifiersList.push(List3[0]);
                    }
                }


                //$scope.obj = {
                //    "Modifier1": '',
                //    "Modifier2": '',
                //    "Modifier3": '',
                //    "Modifier4": '',
                //    "ModifierName1": '',
                //    "ModifierName2": '',
                //    "ModifierName3": '',
                //    "ModifierName3": '',


                //};
                $scope.AddModifiers = function (kitem) {
                    $scope.SelectedModifiersList = $scope.SelectedModifiersList || [];
                    var List = $filter("filter")($scope.SelectedModifiersList, { "MODIFIERID": kitem.MODIFIERID }, true);
                    if (List.length === 0) {
                        if ($scope.SelectedModifiersList.length > 3) {
                            alertify.error("You have reached Maximum limit!");
                            return;
                        } else {
                            $scope.SelectedModifiersList.push(kitem);
                        }

                    } else {
                        alertify.error("Diagnosis already Recommended!");
                        return;
                    }

                }
                $scope.RemoveModifiers = function (item) {

                    var index = $scope.SelectedModifiersList.indexOf(item);
                    if (index > -1) {
                        $scope.SelectedModifiersList.splice(index, 1);
                    }
                }
                $scope.SaveModifiers = function () {
                    $uibModalInstance.close($scope.SelectedModifiersList);

                }
                $scope.closeItems = function () {
                    $uibModalInstance.dismiss("cancel");
                };

            }
        });
        $scope.mInstanceModifierAdd.result.then(function (SelectedModifiersList) {
            SelectedModifiersList = SelectedModifiersList || [];
            if (SelectedModifiersList.length != 0) {
                if (SelectedModifiersList.length == 1) {
                    subitem.Modifier1 = SelectedModifiersList[0].MODIFIERID;
                    subitem.ModifierName1 = SelectedModifiersList[0].ModifierName;
                    subitem.Modifier2 = '';
                    subitem.ModifierName2 = '';
                    subitem.Modifier3 = '';
                    subitem.ModifierName3 = '';
                    subitem.Modifier4 = '';
                    subitem.ModifierName4 = '';

                    subitem.ModifierCode1 = SelectedModifiersList[0].ModifierCode;
                    subitem.ModifierCode2 = '';
                    subitem.ModifierCode3 = '';
                    subitem.ModifierCode4 = '';
                }
                if (SelectedModifiersList.length == 2) {
                    subitem.Modifier1 = SelectedModifiersList[0].MODIFIERID;
                    subitem.ModifierName1 = SelectedModifiersList[0].ModifierName;
                    subitem.Modifier2 = SelectedModifiersList[1].MODIFIERID;
                    subitem.ModifierName2 = SelectedModifiersList[1].ModifierName;
                    subitem.Modifier3 = '';
                    subitem.ModifierName3 = '';
                    subitem.Modifier4 = '';
                    subitem.ModifierName4 = '';

                    subitem.ModifierCode1 = SelectedModifiersList[0].ModifierCode;
                    subitem.ModifierCode2 = SelectedModifiersList[1].ModifierCode;
                    subitem.ModifierCode3 = '';
                    subitem.ModifierCode4 = '';
                }
                if (SelectedModifiersList.length == 3) {
                    subitem.Modifier1 = SelectedModifiersList[0].MODIFIERID;
                    subitem.ModifierName1 = SelectedModifiersList[0].ModifierName;
                    subitem.Modifier2 = SelectedModifiersList[1].MODIFIERID;
                    subitem.ModifierName2 = SelectedModifiersList[1].ModifierName;
                    subitem.Modifier3 = SelectedModifiersList[2].MODIFIERID;
                    subitem.ModifierName3 = SelectedModifiersList[2].ModifierName;
                    subitem.Modifier4 = '';
                    subitem.ModifierName4 = '';

                    subitem.ModifierCode1 = SelectedModifiersList[0].ModifierCode;
                    subitem.ModifierCode2 = SelectedModifiersList[1].ModifierCode;
                    subitem.ModifierCode3 = SelectedModifiersList[2].ModifierCode;
                    subitem.ModifierCode4 = '';
                }
                if (SelectedModifiersList.length == 4) {
                    subitem.Modifier1 = SelectedModifiersList[0].MODIFIERID;
                    subitem.ModifierName1 = SelectedModifiersList[0].ModifierName;
                    subitem.Modifier2 = SelectedModifiersList[1].MODIFIERID;
                    subitem.ModifierName2 = SelectedModifiersList[1].ModifierName;
                    subitem.Modifier3 = SelectedModifiersList[2].MODIFIERID;
                    subitem.ModifierName3 = SelectedModifiersList[2].ModifierName;
                    subitem.Modifier4 = SelectedModifiersList[3].MODIFIERID;
                    subitem.ModifierName4 = SelectedModifiersList[3].ModifierName;

                    subitem.ModifierCode1 = SelectedModifiersList[0].ModifierCode;;
                    subitem.ModifierCode2 = SelectedModifiersList[1].ModifierCode;
                    subitem.ModifierCode3 = SelectedModifiersList[2].ModifierCode;
                    subitem.ModifierCode4 = SelectedModifiersList[3].ModifierCode;
                }

            }


        }, function () { });
    }

    $scope.GetFinalAdvisedItems = function () {
        eHnoteSettingsDataService.GetConsultationAdvicedFinalOrderBillItems($scope.cacheStorageItem.TreatmentPlanId, $scope.appointmentinfo.HospitalId).then(function (response) {

            if (response.data.status == "Success") {
                $scope.advisedItemsList = response.data.rows || [];
                if ($scope.advisedItemsList.length !== 0) {
                    angular.forEach($scope.advisedItemsList, function (item) {
                        $scope.pushtoBill(item);
                    });
                }


            }
        }, function (err) {
            console.log(err);
            alertify.error("Getting Failed");
        });
    };
    $scope.advisedItemspopcons = function () {
        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/advisedItems.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            "size": "lg",
            "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService) {
                $scope.closeadvisedItems = function () {
                    $uibModalInstance.dismiss("cancel");
                };

                $scope.getAdvisedItems = function () {
                    eHnoteSettingsDataService.GetConsultationAdvicedOrderBillItems($scope.appointmentinfo.AppointmentId, $scope.appointmentinfo.HospitalId).then(function (response) {

                        if (response.data.status == "Success") {
                            $scope.advisedItemsList = response.data.rows;
                            angular.forEach($scope.advisedItemsList, function (item) {
                                item.IsSelected = false;
                            });

                        }
                    }, function (err) {
                        console.log(err);
                        alertify.error("Getting Failed");
                    });
                };
                $scope.getAdvisedItems();
                $scope.addProcedures = function () {
                    $scope.selectedProcedures = [];
                    angular.forEach($scope.advisedItemsList, function (item) {
                        if (item.IsSelected) {
                            //  $scope.mainBillingObject.BillingDetail = [];

                            $scope.selectedProcedures.push(item);
                        }
                    });
                    //console.log($scope.selectedProcedures);
                    $uibModalInstance.dismiss("cancel");
                    angular.forEach($scope.selectedProcedures, function (item) {
                        //var treatObject = getNewTreatmentObject();
                        //$scope.mainBillingObject.BillingDetail.push(treatObject);
                        var index = $scope.mainBillingObject.BillingDetail.length;
                        index = parseInt(index);

                        $scope.pushtoBill(item, $scope.mainBillingObject.BillingDetail[index - 1]);
                    });
                }

                $scope.discardProcedures = function () {
                    $scope.selectedProcedures = [];
                    $uibModalInstance.dismiss("cancel");
                }
            }
        });
    }

    $scope.getModifier = function (val) {
        val = val || '';
        return eHnoteSettingsDataService.GetMasterModifiers(val).then(function (response) {
            if (response.data.count !== 0) {
                if (response.data.rows !== undefined) {
                    return response.data.rows.map(function (item) {
                        return item;
                    });
                }
            }
        });

    }
    $scope.OnSelectModifierName = function (val, item, type) {
        if (type == 1) {
            item.Modifier1 = val.ModifierCode || '';
        }
        if (type == 2) {
            item.Modifier2 = val.ModifierCode || '';
        }
        if (type == 3) {
            item.Modifier3 = val.ModifierCode || '';
        }
        if (type == 4) {
            item.Modifier4 = val.ModifierCode || '';
        }
    }

    $scope.getProcedures = function (val, ProcedureTypeId, Type) {
        if (Type === 2) {
            var object = {
                "LevelType": "O",
                "HospitalId": $scope.HospitalID,
                "UserId": $scope.UserId,
                "SpecializationId": $scope.SpecializationId,
                "SearchText": '',
                "ProcCodeSearchText": val,
                "PageSize": 10,
                "PageNumber": 1,
                "ServicesTypeId": 0,
                //"ProcedureTypeId": ProcedureTypeId,
                "AllBranchInd": 0,
                "Type": ''
            };
        } else {
            var object = {
                "LevelType": "O",
                "HospitalId": $scope.HospitalID,
                "UserId": $scope.UserId,
                "SpecializationId": $scope.SpecializationId,
                "SearchText": val,
                "PageSize": 10,
                "PageNumber": 1,
                "ServicesTypeId": 0,
                // "ProcedureTypeId": ProcedureTypeId,
                "AllBranchInd": 0,
                "Type": '',
                "ProcCodeSearchText": ""
            };
        }
        if (val === "") {
            object.Type = 'C';
        } else {
            object.Type = 'O';
        }
        return eHnoteSettingsDataService.GetMasterProcedures(object).then(function (response) {
            if (response.data.count !== 0) {
                if (response.data.ProcedureList !== undefined) {
                    return response.data.ProcedureList.map(function (item) {
                        return item;
                    });
                }
            }
        });
    };
    $scope.GetProcedureSurgerySearch = function (val, Type) {
        var object = {
            "BranchId": $scope.HospitalID,
            "SearchText": val,
            "PageSize": 10,
            "PageNumber": 1,
            "CPTSearchText": ""
        };

        return eHnoteDiagnosisDataServices.GetMasterProcedureSurgeriesList(object).then(function (response) {
            if (response.data.count !== 0) {
                if (response.data.rows !== undefined) {
                    if (val === "") {
                        var obj = {
                            "ProcedureId": "",
                            "ProcedureName": "Frequently Added"
                        };
                        response.data.rows.unshift(obj);
                    }
                    return response.data.rows.map(function (item) {
                        return item;
                    });
                }
            }
        });
    };


    $scope.patientList = [];
    $scope.GetPatientDetailsForHCFA = function () {
        var PatientDisplayId = 0;
        if ($scope.appointmentinfo.Patient == undefined) {
            PatientDisplayId = $scope.appointmentinfo.PatientDetails.PatientDisplayId
        } else {
            PatientDisplayId = $scope.appointmentinfo.Patient.PatientDisplayId
        }

        var object = {
            "ParentOrganizationId": $scope.ParentHospitalID,
            "Name": null,
            "Mobile": null,
            "PatientId": PatientDisplayId || "",
            "PageSize": 10,
            "PageNo": 1
        };
        InventoryService.SearchInvPatient(object).then(function (resp) {
            $scope.patientList = "";
            if (resp.data.data.length !== 0) {
                if (resp.data.data != undefined && resp.data.data.length > 0) {
                    $scope.patientList = resp.data.data[0] || "";
                    $scope.HCFAPrint($scope.patientList);
                }
            }
        }, function (err) { console.log(err); });
    }

    function GetDiagnosisPointer(billobj) {
        var diagnosisPointers = "";
        if (billobj.length > 0) {
            angular.forEach(billobj, function (item2) {
                angular.forEach($scope.HCFADetailsInfo.DiagnosisList, function (ditem) {
                    if (item2.DiagnosisId === ditem.DiagnosisId) {
                        if (ditem.SNO === 1) {
                            //if (diagnosisPointers != "" && ditem.SNO != '') {
                            //    diagnosisPointers = diagnosisPointers + ", " + "A";
                            //} else {
                            diagnosisPointers = diagnosisPointers + "A";
                            /*}*/
                        }
                        if (ditem.SNO === 2) {
                            //if (diagnosisPointers != "" && ditem.SNO != '') {
                            //    diagnosisPointers = diagnosisPointers + ", " + "B";
                            //} else {
                            diagnosisPointers = diagnosisPointers + "B";
                            /* }*/
                        }
                        if (ditem.SNO === 3) {
                            //if (diagnosisPointers != "" && ditem.SNO != '') {
                            //    diagnosisPointers = diagnosisPointers + ", " + "C";
                            //} else {
                            diagnosisPointers = diagnosisPointers + "C";
                            // }
                        }
                        if (ditem.SNO === 4) {
                            //if (diagnosisPointers != "" && ditem.SNO != '') {
                            //    diagnosisPointers = diagnosisPointers + ", " + "D";
                            //} else {
                            diagnosisPointers = diagnosisPointers + "D";
                            //
                        }
                        if (ditem.SNO === 5) {
                            //if (diagnosisPointers != "" && ditem.SNO != '') {
                            //    diagnosisPointers = diagnosisPointers + ", " + "E";
                            //} else {
                            diagnosisPointers = diagnosisPointers + "E";
                            //  }
                        }
                        if (ditem.SNO === 6) {
                            //if (diagnosisPointers != "" && ditem.SNO != '') {
                            //    diagnosisPointers = diagnosisPointers + ", " + "F";
                            //} else {
                            diagnosisPointers = diagnosisPointers + "F";
                            // }
                        }
                        if (ditem.SNO === 7) {
                            //if (diagnosisPointers != "" && ditem.SNO != '') {
                            //    diagnosisPointers = diagnosisPointers + ", " + "G";
                            //} else {
                            diagnosisPointers = diagnosisPointers + "G";
                            // }
                        }
                        if (ditem.SNO === 8) {
                            //if (diagnosisPointers != "" && ditem.SNO != '') {
                            //    diagnosisPointers = diagnosisPointers + ", " + "H";
                            //} else {
                            diagnosisPointers = diagnosisPointers + "H";
                            // }
                        }
                        if (ditem.SNO === 9) {
                            //if (diagnosisPointers != "" && ditem.SNO != '') {
                            //    diagnosisPointers = diagnosisPointers + ", " + "I";
                            //} else {
                            diagnosisPointers = diagnosisPointers + "I";
                            // }
                        }
                        if (ditem.SNO === 10) {
                            //if (diagnosisPointers != "" && ditem.SNO != '') {
                            //    diagnosisPointers = diagnosisPointers + ", " + "J";
                            //} else {
                            diagnosisPointers = diagnosisPointers + "J";
                            //  }
                        }
                        if (ditem.SNO === 11) {
                            //if (diagnosisPointers != "" && ditem.SNO != '') {
                            //    diagnosisPointers = diagnosisPointers + ", " + "K";
                            //} else {
                            diagnosisPointers = diagnosisPointers + "K";
                            // }
                        }
                        if (ditem.SNO === 12) {
                            //if (diagnosisPointers != "" && ditem.SNO != '') {
                            //    diagnosisPointers = diagnosisPointers + ", " + "L";
                            //} else {
                            diagnosisPointers = diagnosisPointers + "L";
                            // }
                        }
                    }
                });
            });
        }
        return diagnosisPointers;
    }

    $scope.HCFAPrint = function (item) {
        $scope.HCFADetailsInfo = eHnoteCacheStorageService.GetHCFAStorageStructure();
        var patientSuperbillObj = angular.copy($scope.mainBillingObject);

        if ($scope.patientList != undefined && $scope.patientList != null) {
            $scope.HCFADetailsInfo.PatientDetails.fullname = $scope.patientList.fullname;
            $scope.HCFADetailsInfo.PatientDetails.DOB = $scope.patientList.DOB || "";
            $scope.HCFADetailsInfo.PatientDetails.MobileNo = $scope.patientList.MobileNo || "";
            $scope.HCFADetailsInfo.PatientDetails.ContactNo = $scope.patientList.ContactNo || "";
            $scope.HCFADetailsInfo.PatientDetails.Title = $scope.patientList.Title || "";
            $scope.HCFADetailsInfo.PatientDetails.Sex = $scope.patientList.Sex;
            $scope.HCFADetailsInfo.PatientDetails.PatientDisplayId = $scope.patientList.PatientDisplayId;
            $scope.HCFADetailsInfo.PatientDetails.CityName = $scope.patientList.CityName;
            $scope.HCFADetailsInfo.PatientDetails.StateName = $scope.patientList.StateName;
            $scope.HCFADetailsInfo.PatientDetails.ZipCode = $scope.patientList.ZipCode;
            $scope.HCFADetailsInfo.PatientDetails.Address1 = $scope.patientList.Address1;
            $scope.HCFADetailsInfo.PatientDetails.Address2 = $scope.patientList.Address2;
            $scope.HCFADetailsInfo.PatientDetails.CountryCode = $scope.patientList.CountryCode || "";
            $scope.HCFADetailsInfo.PatientDetails.AreaCode = $scope.patientList.AreaCode || "";

        }

        $scope.HCFADetailsInfo.FeedralTaxIDNo = $scope.appointmentinfo.PatientDetails.SSN || 0;
        if ($scope.HCFADetailsInfo.FeedralTaxIDNo != 0) {
            $scope.HCFADetailsInfo.SSN = "yes";
        }
        //AppointmentDate
        $scope.appointmentinfo.AppointmentDate = $scope.appointmentinfo.AppointmentDate || "";
        $scope.HCFADetailsInfo.datesPatientUnabletoWorkincurrentoccupation.FormDate = $scope.appointmentinfo.AppointmentDate || "";
        $scope.HCFADetailsInfo.hospitalizationDatesRelatedToCurrentServices.FormDate = $scope.appointmentinfo.AppointmentDate || "";

        $scope.HCFADetailsInfo.ProcedureList = $scope.HCFADetailsInfo.ProcedureList || [];
        var ProcedureListArray = [];
        $scope.HCFADetailsInfo.DiagnosisList = $scope.HCFADetailsInfo.DiagnosisList || [];
        if (patientSuperbillObj.BillingDetail.length > 0) {
            var i = 1;
            angular.forEach(patientSuperbillObj.BillingDetail, function (mainitem) {
                mainitem.DiagnosisList = mainitem.DiagnosisList || [];
                //ProcedureListArray.push(mainitem);
                if (mainitem.DiagnosisList.length > 0) {
                    angular.forEach(mainitem.DiagnosisList, function (subitem) {
                        var array = $filter("filter")($scope.HCFADetailsInfo.DiagnosisList, { "DiagnosisId": subitem.DiagnosisId }, true) || [];
                        if (array.length === 0) {
                            var sno = i++;
                            subitem.SNO = sno;
                            subitem.Date = $filter("date")(new Date(mainitem.BillDate), "MMM-dd-yyyy");
                            $scope.HCFADetailsInfo.DiagnosisList.push(subitem);
                        }
                    });
                }
                ProcedureListArray.push(mainitem);
            });
        }

        if (ProcedureListArray.length > 0) {
            angular.forEach(ProcedureListArray, function (pitem) {

                var ModifierString = "" + pitem.ModifierCode1;
                if (ModifierString != "" && pitem.ModifierCode2 != '') {
                    ModifierString = ModifierString + ", " + pitem.ModifierCode2;
                } else {
                    ModifierString = ModifierString + pitem.ModifierCode2;
                }
                if (ModifierString != "" && pitem.ModifierCode3 != '') {
                    ModifierString = ModifierString + ", " + pitem.ModifierCode3;
                } else {
                    ModifierString = ModifierString + pitem.ModifierCode3;
                }
                if (ModifierString != "" && pitem.ModifierCode4 != '') {
                    ModifierString = ModifierString + ", " + pitem.ModifierCode4;
                } else {
                    ModifierString = ModifierString + pitem.ModifierCode4;
                }
                pitem.DiagnosisPointer = GetDiagnosisPointer(pitem.DiagnosisList);

                var array = {
                    "ProcedureName": pitem.ProcedureName,
                    "EPSDTFamilyPlan1": "  ",
                    "IdQual1": " ",
                    "RenderingProviderId1": " ",
                    "FromDate": pitem.Service || "",
                    "ToDate": pitem.Thru || "",
                    "PlaceOfService": pitem.POSObj.POSCODEECLAIM || "",
                    "EMG": "NO", //enter Y for “YES” or leave blank if “NO”
                    "CPTorHCPCS": pitem.ProcedureCode,
                    "Modifier": ModifierString || "",
                    "DiagnosisPointer": pitem.DiagnosisPointer || "",
                    "Charges": pitem.Total || 0, //pitem.ProcedureCost || 0,
                    "Charges1": "00",
                    "DaysOrUnits": pitem.Multiplyfactor || "",
                    "EPSDTFamilyPlan": "",
                    "IdQual": "",
                    "RenderingProviderId": ""
                };
                $scope.HCFADetailsInfo.ProcedureList.push(array);
            });
        }
        //if ($scope.HCFAPrintDetailsObj.DiagnosisListObj != undefined && $scope.HCFAPrintDetailsObj.DiagnosisListObj.length > 0) {
        //    $scope.HCFADetailsInfo.DiagnosisList = $scope.HCFAPrintDetailsObj.DiagnosisListObj;
        //}
        $scope.HCFADetailsInfo.PatientInsuranceItems = angular.copy($scope.PatientInsuranceItems) || [];
        if ($scope.HCFADetailsInfo.PatientInsuranceItems.length > 0) {
            $scope.HCFADetailsInfo.HeaderInsurance.PayorName = $scope.HCFADetailsInfo.PatientInsuranceItems[0].PayorName;
            $scope.HCFADetailsInfo.HeaderInsurance.Address = $scope.HCFADetailsInfo.PatientInsuranceItems[0].PayorAddress || "";
            $scope.HCFADetailsInfo.HeaderInsurance.CityName = $scope.HCFADetailsInfo.PatientInsuranceItems[0].CityName || "";
            $scope.HCFADetailsInfo.HeaderInsurance.StateName = $scope.HCFADetailsInfo.PatientInsuranceItems[0].StateName || "";
            $scope.HCFADetailsInfo.HeaderInsurance.ZipCode = $scope.HCFADetailsInfo.PatientInsuranceItems[0].ZipCode || "";
            $scope.HCFADetailsInfo.PatientDetails.RelationshipToInsured = "";
            var insuranceRelationId = $scope.HCFADetailsInfo.PatientInsuranceItems[0].RelationShipId || 0;
            $scope.HCFADetailsInfo.PatientDetails.RelationshipToInsured = insuranceRelationId;

            angular.forEach($scope.HCFADetailsInfo.PatientInsuranceItems, function (pitem, index) {
                if (index == 0) {
                    $scope.HCFADetailsInfo.InsuranceDetails.PolicyId = pitem.PolicyId;
                    $scope.HCFADetailsInfo.InsuranceDetails.PolicyGroupId = pitem.GroupId;
                    $scope.HCFADetailsInfo.InsuranceDetails.InsurancePlanName = pitem.PlanName;
                    // $scope.HCFADetailsInfo.InsuranceDetails.IsThereAnotherHealthBenefitPlan = pitem.GroupId;
                    // $scope.HCFADetailsInfo.InsuranceDetails.InsuranceClaimId = pitem.GroupId;
                    $scope.HCFADetailsInfo.AcceptAssignment = pitem.AcceptAssign || "No";
                    $scope.HCFADetailsInfo.OriginalRefNo = "";
                    if (pitem.RelationShipId == 1) {
                        $scope.HCFADetailsInfo.InsuranceDetails.InsurancePersonName = $scope.patientList.fullname;
                        var personaddress = "";
                        personaddress = $scope.patientList.Address1 || "";
                        $scope.patientList.Address2 = $scope.patientList.Address2 || "";
                        if (personaddress != "" && $scope.patientList.Address2 != "") {
                            personaddress = personaddress + ", " + $scope.patientList.Address2;
                        } else {
                            personaddress = personaddress + $scope.patientList.Address2;
                        }
                        $scope.HCFADetailsInfo.InsuranceDetails.Address = personaddress || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.DOB = $scope.patientList.DOB || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.CityName = $scope.patientList.CityName || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.StateName = $scope.patientList.StateName || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.ZipCode = $scope.patientList.ZipCode || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.MobileNo = $scope.patientList.MobileNo || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.TelephoneCode = $scope.patientList.CountryCode || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.Gender = $scope.patientList.Sex == "Female" ? "F" : ($scope.patientList.Sex == "Male" ? "M" : '');
                    } else {
                        $scope.HCFADetailsInfo.InsuranceDetails.InsurancePersonName = pitem.InsuredPersonFirstName;
                        $scope.HCFADetailsInfo.InsuranceDetails.Address = "";
                        $scope.HCFADetailsInfo.InsuranceDetails.CityName = "";
                        $scope.HCFADetailsInfo.InsuranceDetails.StateName = "";
                        $scope.HCFADetailsInfo.InsuranceDetails.ZipCode = "";
                        $scope.HCFADetailsInfo.InsuranceDetails.MobileNo = "";
                        $scope.HCFADetailsInfo.InsuranceDetails.DOB = pitem.InsuredPersonDOB || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.Gender = pitem.InsuredPersonGenderID;
                    }
                    $scope.HCFADetailsInfo.InsuranceDetails.IsThereAnotherHealthBenefitPlan = "No";
                } else if (index == 1) {
                    $scope.HCFADetailsInfo.OtherInsuranceDetails.OtherInsurancePolicyGroupId = pitem.GroupId;
                    $scope.HCFADetailsInfo.OtherInsuranceDetails.InsurancePlanName = pitem.PlanName;
                    if (pitem.RelationShipId == 1) {
                        $scope.HCFADetailsInfo.OtherInsuranceDetails.OtherInsuranceName = $scope.patientList.fullname;
                    } else {
                        $scope.HCFADetailsInfo.OtherInsuranceDetails.OtherInsuranceName = pitem.InsuredPersonFirstName;
                    }
                    $scope.HCFADetailsInfo.InsuranceDetails.IsThereAnotherHealthBenefitPlan = "Yes";

                    $scope.HCFADetailsInfo.OthereClaimID = "";
                    $scope.HCFADetailsInfo.ClaimCodeByNUCC = pitem.OrgEligibilityClaimNumber || "";
                }
            });
        }
        $scope.HCFADetailsInfo.DateofCurrentIllnessInjuryorPregnancy.Date = $scope.appointmentinfo.CreatedDt || "";

        patientSuperbillObj.FacilityObj = patientSuperbillObj.FacilityObj || "";
        if (patientSuperbillObj.FacilityObj != "") {
            $scope.HCFADetailsInfo.ServiceFacilityLocationInformation.ServicefacilityBranch = patientSuperbillObj.FacilityObj.Name || "";
            $scope.HCFADetailsInfo.ServiceFacilityLocationInformation.ServicefacilityAddress = patientSuperbillObj.FacilityObj.Address || "";
            $scope.HCFADetailsInfo.ServiceFacilityLocationInformation.CityName = patientSuperbillObj.FacilityObj.CityName || "";
            $scope.HCFADetailsInfo.ServiceFacilityLocationInformation.StateName = patientSuperbillObj.FacilityObj.StateName || "";
            $scope.HCFADetailsInfo.ServiceFacilityLocationInformation.ZipCode = patientSuperbillObj.FacilityObj.ZipCode || "";
        }

        //$scope.HCFADetailsInfo.HeaderInsurance.Address = "P.No 376-4/G, eggth yjtg";
        //$scope.HCFADetailsInfo.HeaderInsurance.CityName = "FR CITY";
        //$scope.HCFADetailsInfo.HeaderInsurance.StateName = "LI";
        //$scope.HCFADetailsInfo.HeaderInsurance.ZipCode = "10084";

        $scope.HCFADetailsInfo.TotalCharges = patientSuperbillObj.TotalNetAmount || 0;
        $scope.HCFADetailsInfo.AmountPaid = patientSuperbillObj.TotalReceivedAmount || 0;

        eHnotePrintService.generateHCFAPrintUS($scope.HCFADetailsInfo);

    };

    $scope.AddPayorEOB = function () {

        var modalInstance = $uibModal.open({
            "templateUrl": "templates/consultation/payor/Addupdatepayor.html",
            "controller": "EhnoteAddupdatepayorCtrl",
            "size": "lg",
            "backdrop": "static",
            "keyboard": false,
            //"windowClass": "inventory-full-popup"

        });
        modalInstance.result.then(function () {


        }, function () { });
    }





    $scope.GetPatientSuperBillPrint = function () {
        var patientSuperbillObj = angular.copy($scope.mainBillingObject);

        //  $scope.DiagnosisList = [];

        $scope.DiagnosisList = [];
        if (patientSuperbillObj.BillingDetail.length > 0) {
            var i = 1;
            angular.forEach(patientSuperbillObj.BillingDetail, function (mainitem) {
                mainitem.DiagnosisList = mainitem.DiagnosisList || [];

                if (mainitem.DiagnosisList.length > 0) {
                    angular.forEach(mainitem.DiagnosisList, function (subitem) {
                        var array = $filter("filter")($scope.DiagnosisList, { "DiagnosisId": subitem.DiagnosisId }, true) || [];
                        if (array.length === 0) {
                            var sno = i++;
                            subitem.SNO = sno;
                            subitem.Date = $filter("date")(new Date(mainitem.BillDate), "MMM-dd-yyyy");
                            $scope.DiagnosisList.push(subitem);
                        }
                    });
                    //mainitem.DiagnosisListNumbers = "";
                }
            });
        }
        var signatureString = localStorageFactory.getItem("DoctorSignatureString");


        patientSuperbillObj.BillingDetail = $filter("filter")(patientSuperbillObj.BillingDetail, function (bitem, index) { return bitem.OrganizationProcedureId !== 0; });
        var PrintInfo = {
            "PatientDetails": $scope.appointmentinfo.PatientDetails,
            "PatientInsuranceItems": $scope.PatientInsuranceItems || [],
            "DiagnosisList": $scope.DiagnosisList || [],
            "BillingDetail": patientSuperbillObj.BillingDetail || [],
            "BillingInfo": $scope.mainBillingObject,
            "ConsultationDate": $filter("date")(new Date($scope.appointmentinfo.ConsultationDt), "MMM-dd-yyyy"),
            "signatureString": signatureString
        };


        USPrintService.GeneratePatientSuperBillPrint(PrintInfo);
    }

    //get Facility
    $scope.GetOrganizationFacilities = function (val) {
        $scope.HospitalObj.ClinicId = $scope.HospitalObj.ClinicId || 0;
        if ($scope.HospitalObj.ClinicId == 0) {
            return false;
        }
        var params = {
            "BranchId": $scope.HospitalObj.ClinicId,
            "ParentOrganizationId": $scope.ParentHospitalID,
            "FacilityCode": val,
            "PageNumber": 1,
            "PageSize": 10
        };

        return eHnoteSettingsDataService.GetOrganizationFacilities(params).then(function (resp) {

            if (resp.data.Status == "Success") {
                return resp.data.rows.map(function (mitem) {
                    return mitem;
                });
            } else {
                alertify.error(resp.data.Message);
            }
        }, function (error) {
            console.log(error);
        });
    };

    //get PCp
    $scope.GetReferalPCPDoctors = function (val) {
        $scope.HospitalObj.ClinicId = $scope.HospitalObj.ClinicId || 0;
        if ($scope.HospitalObj.ClinicId == 0) {
            return false;
        }
        var searchText = "", searchNpi = "";
        if (/^[0-9]+$/.test(val)) {
            searchNpi = val;
        } else {
            searchText = val;
        }

        var newreqObj = {
            'LocationId': null,
            'PageNumber': 1,
            'PageSize': 10,
            'SearchTaxt': searchText || '',
            'SearchNPI': searchNpi || '',
            "SpecializationId": $scope.SpecializationId,
            "DeleteInd": 'N',
            "OrganizationId": $scope.HospitalObj.ClinicId
        };
        return eHnoteReferalDataService.GetReferalPCPDoctors(newreqObj).then(function (resp) {

            if (resp.data.status == "Success") {
                return resp.data.PcpRefdetails.map(function (mitem) {
                    return mitem;
                });
            } else {
                alertify.error(resp.data.Message);
            }
        }, function (error) {
            console.log(error);
        });

    };



    $scope.onSelectReferral = function (MainObj) {
        MainObj.ReferralObj = MainObj.ReferralObj || "";
        if (MainObj.ReferralObj != "") {
            $scope.mainBillingObject.ReferralObj = MainObj.ReferralObj;
            $scope.mainBillingObject.ReferringProviderId = MainObj.ReferralObj.PcpReferralId;
        } else {
            $scope.mainBillingObject.ReferringProviderId = 0;
        }
    };

    $scope.onSelectFacilities = function (MainObj) {
        MainObj.FacilityObj = MainObj.FacilityObj || "";
        if (MainObj.FacilityObj != "") {
            $scope.mainBillingObject.FacilityObj = MainObj.FacilityObj;
            $scope.mainBillingObject.FacilityId = MainObj.FacilityObj.FacilityId;

            if ($scope.mainBillingObject.BillingDetail.length > 0) {
                angular.forEach($scope.mainBillingObject.BillingDetail, function (billitem) {
                    billitem.POSId = MainObj.FacilityObj.PlaceOfServiceId;
                    if ($scope.POSCodeList.length > 0) {
                        billitem.POSObj = $filter("filter")($scope.POSCodeList, { "POSId": billitem.POSId }, true)[0] || "";
                    }
                });
            }
        } else {
            $scope.mainBillingObject.FacilityId = 0;
        }
    };
    $scope.ChangeFacility = function () {
        $scope.mainBillingObject.FacilityId = 0;
    };

    $scope.ChangeReasonStatus = function (MainObj) {
        MainObj.PaymentReasonobj = MainObj.PaymentReasonobj || "";
        if (MainObj.PaymentReasonobj != "") {
            MainObj.PaymentReasonobj = MainObj.PaymentReasonobj;
            MainObj.PaymentReasonId = MainObj.PaymentReasonobj.PaymentReasonId;
        } else {
            MainObj.PaymentReasonId = 0;
        }
    };
    $scope.ChangePaymentMode = function (MainObj) {
        MainObj.PaymentModeobj = MainObj.PaymentModeobj || "";
        if (MainObj.PaymentModeobj != "") {
            MainObj.PaymentModeobj = MainObj.PaymentModeobj;
            MainObj.PaymentModeId = MainObj.PaymentModeobj.PaymentModeId;
        } else {
            MainObj.PaymentModeId = 0;
        }
    };



    $scope.PatientDepositlist = function (item, val) {
        var obj = {
            "BranchId": $scope.HospitalId,
            "patientId": item.PatientId,
            "PageSize": 10,
            "PageNumber": 1,
            "UserId": $scope.UserId,
            "PatientDepositId": val,
        };
        // eHnoteInsuranceService.GetPayorDepositAmountList(obj).then(function (resp) {
        eHnoteInsuranceService.GetUnbilledPatientDepositsByID(obj).then(function (resp) {
            $scope.ShowPatientListArray = [];

            if (resp.data.status === "Success") {
                $scope.ShowPatientListArray = resp.data.rows || [];
                $scope.ShowPatientListArrayCount = resp.data.count || 0;
            } else {
                alertify.error(resp.data.Message);
            }
        });
    }

    $scope.showEligibilityinPopup = function (mainitem, type) {

        $scope.obj = {
            "AppointmentInsuranceDetailId": mainitem.AppointmentInsuranceDetailId,
            "PatientInsuranceDetailId": mainitem.PatientInsuranceDetailId
        };

        $scope.modalpayorInstance = $uibModal.open({
            "templateUrl": "templates/consultation/payor/PatientEligibilityResponseDetails.html",
            "size": "lg",
            "backdrop": "static",
            "resolve": {
                "Selectobj": function () { return $scope.obj; },
            },
            "keyboard": false,
            "windowClass": "inventory-full-popup",
            "controller": function ($scope, $uibModal, $uibModalInstance, Selectobj) {


                $scope.selectedObj = Selectobj;

                $scope.MainBenifitEligibilityCoverageList = [];
                $scope.BenifitEligibilityCoverageList1 = [];
                $scope.ChangePatientsInsuranceList = function () {
                    $scope.BenifitCoverageDetailListobj = 1;
                    $scope.Id = $scope.selectedObj.AppointmentInsuranceDetailId;
                    $scope.InsuranceEligibility = [];
                    $scope.selectedid = $scope.selectedObj.PatientInsuranceDetailId;
                    eHnoteInsuranceService.GetCheckInsuranceEligibilityById($scope.selectedid).then(function (resp) {
                        $scope.MainBenifitEligibilityCoverageList = [];
                        $scope.BenifitEligibilityCoverageList1 = [];
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
                $scope.ChangePatientsInsuranceList();
                $scope.BenifitCoverageDetailListobj = 1;

                $scope.CheckInsEligibility = function (val) {

                    if (val == '1') {
                        var TempInsuarance = angular.copy($scope.MainBenifitEligibilityCoverageList);
                        $scope.BenifitEligibilityCoverageList1 = [];
                        angular.forEach(TempInsuarance, function (hitem) {
                            var temarray = $filter("filter")(hitem.BenifitCoverageDetailsList, function (item, index) { return item.ServiceTypeName == hitem.ServiceTypeName }, true);
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

                $scope.CheckInsuranceEligibility1 = function (item) {
                    item.IsShowEligibility = !item.IsShowEligibility;
                }
                $scope.ClosePopup = function () {
                    $uibModalInstance.dismiss("cancel");
                };
            }
        });
    }

    $scope.TOSCodeList = [];
    $scope.getOrganizationTOSCodes = function () {
        eHnotePatientAddressDataServices.GetOrganizationTOSCodes($scope.ParentHospitalID).then(function (resp) {

            if (resp.data.rows.length > 0) {
                $scope.TOSCodeList = resp.data.rows || [];
            }
        });
    };
    $scope.getOrganizationTOSCodes();








    /*Panding Claim*/
    $scope.SubmitPendingClaims = function (submitInd) {


        if ($scope.mainBillingObject.PayorDetails.length > 0) {
            $scope.mainBillingObject.PayorDetails[0].IsVerified = true;
            $scope.mainBillingObject.PayorDetails[0].VerifiedDate = $filter('date')(new Date(), "yyyy-MM-dd");
            if (submitInd) {
                $scope.mainBillingObject.PayorDetails[0].IsClaimSubmitted = true;
                $scope.mainBillingObject.PayorDetails[0].SubmitDate = $filter('date')(new Date(), "yyyy-MM-dd");
                if ($scope.mainBillingObject.ClaimStatusId === 1) {
                    $scope.mainBillingObject.ClaimStatusId = 2;
                }
            }
        }


        $scope.mainBillingObject.ClaimSendViaId = $scope.mainBillingObject.ClaimSendViaId || null;
        $scope.mainBillingObject.FacilityId = $scope.mainBillingObject.FacilityId || null;
        $scope.mainBillingObject.ReferringProviderId = $scope.mainBillingObject.ReferringProviderId || null;
        if ($scope.mainBillingObject.ClaimSendViaId == null) {
            alertify.error("Select Claim Type");
            return false;
        }

        if ($scope.mainBillingObject.BillingProviderId == null) {
            alertify.error("Select Facility");
            return false;
        }
        if ($scope.mainBillingObject.RenderingProviderId == null) {
            alertify.error("Select Referral");
            return false;
        }

        $scope.DynamicStatusSelection('NoPrint', false, false, false, '', 'PendingClaims');
    };


    $scope.ValidateClaim = function (mainitem) {




        $scope.AllDiagnosisCodes = [];

        var DArray = [];

        angular.forEach(mainitem.BillingDetails, function (bitem) {
            angular.forEach(bitem.DiagnosisIds, function (ditem) {
                var dobj = {
                    "DiagnosisId": ditem.DiagnosisId,
                    "ICD10CODE": ditem.ICD10CODE,
                    "ICD9CODE": ditem.ICD9CODE,
                    "TypeCode10": "ABK",
                    "TypeCode9": "BK"
                }
                DArray.push(dobj);
            });
        });

        $scope.AllDiagnosisCodes = _.uniq(DArray, false, function (p) { return p.DiagnosisId; });




        if (mainitem.ClaimTypeId == 1) {
            eHnoteInsuranceService.checkPatientProfessionalClaimValidation(mainitem, $scope.AllDiagnosisCodes, onSuccess, onError);
        }
        else {
            eHnoteInsuranceService.checkPatientInstitutionalClaimValidation(mainitem, $scope.AllDiagnosisCodes, onSuccess, onError);
        }


        function onSuccess(resp) {


            resp.errors = resp.errors || [];
            if (resp.errors.length > 0) {
                $scope.openErrorPopup(resp.errors);
            } else {



                var obj = {
                    "UserId": $scope.UserId,
                    "AppointmentInsuranceDetailId": mainitem.AppointmentInsuranceDetailId,
                    "PatientClaimId": mainitem.PatientClaimId,
                    "CorrelationId": resp.claimReference.correlationId,
                    "SubmitterId": resp.claimReference.submitterId,
                    "CustomerClaimNumber": resp.claimReference.customerClaimNumber,
                    "PatientControlNumber": resp.claimReference.patientControlNumber,
                    "TimeOfResponse": resp.claimReference.timeOfResponse,
                    "ClaimType": resp.claimReference.claimType,
                    "FormatVersion": resp.claimReference.patientControlNumber,
                    "IsValidClaim": true
                }



                eHnoteInsuranceService.UpdatePatientInsuranceValidationResponse(obj).then(function (response) {

                    if (response.data.status === 'Success') {

                        $scope.SearchClaimObj = angular.copy($scope.GetClaimObj());
                        $scope.SearchClaimDashboardDetails();
                    }
                    $rootScope.mInstanceAdd.close("save");
                });


            }
        }

        function onError(reponse) {
        }


    };

    $scope.SubmitClaimMain = function (mainitem) {


        $scope.AllDiagnosisCodes = [];

        var DArray = [];

        angular.forEach(mainitem.BillingDetail, function (bitem) {
            angular.forEach(bitem.DiagnosisIds, function (ditem) {
                var dobj = {
                    "DiagnosisId": ditem.DiagnosisId,
                    "ICD10CODE": ditem.ICD10CODE,
                    "ICD9CODE": ditem.ICD9CODE,
                    "TypeCode10": "ABK",
                    "TypeCode9": "BK"
                }
                DArray.push(dobj);
            });
        });




        $scope.AllDiagnosisCodes = _.uniq(DArray, false, function (p) { return p.DiagnosisId; });


        if (mainitem.ClaimTypeId == 1) {
            eHnoteInsuranceService.checkPatientProfessionalClaimSubmission(mainitem, $scope.AllDiagnosisCodes, onSuccess, onError);
        }
        else {
            eHnoteInsuranceService.checkPatientInstitutionalClaimSubmission(mainitem, $scope.AllDiagnosisCodes, onSuccess, onError);
        }


        function onSuccess(resp) {

            resp.errors = resp.errors || [];
            if (resp.errors.length > 0) {
                $scope.openErrorPopup(resp.errors);
            } else {





                var obj = {
                    "UserId": $scope.UserId,
                    "PatientClaimId": mainitem.PatientClaimId,
                    "CorrelationId": resp.claimReference.correlationId,
                    "SubmitterId": resp.claimReference.submitterId,
                    "CustomerClaimNumber": resp.claimReference.customerClaimNumber,
                    "PatientControlNumber": resp.claimReference.patientControlNumber,
                    "TimeOfResponse": resp.claimReference.timeOfResponse,
                    "ClaimType": resp.claimReference.claimType,
                    "FormatVersion": resp.claimReference.formatVersion,
                    "RhclaimNumber": resp.claimReference.rhclaimNumber,
                    "ClaimStatusId": 2
                }




                eHnoteInsuranceService.UpdatePatientInsuranceSubmissionResponse(obj).then(function (response) {

                    if (response.data.status === 'Success') {
                        $scope.SearchClaimObj = angular.copy($scope.GetClaimObj());
                        $scope.SearchClaimDashboardDetails();
                    }
                    $rootScope.mInstanceAdd.close("save");
                });


            }
        }

        function onError(reponse) {
        }


        $rootScope.mInstanceAdd.close("save");
    };


    $scope.SubmitClaimMainEDI = function (mainitem) {


        $scope.AllDiagnosisCodes = [];

        var DArray = [];

        angular.forEach(mainitem.BillingDetail, function (bitem) {
            angular.forEach(bitem.DiagnosisIds, function (ditem) {
                var dobj = {
                    "DiagnosisId": ditem.DiagnosisId,
                    "ICD10CODE": ditem.ICD10CODE,
                    "ICD9CODE": ditem.ICD9CODE,
                    "TypeCode10": "ABK",
                    "TypeCode9": "BK",
                    "Version": 10
                }
                DArray.push(dobj);
            });
        });




        $scope.AllDiagnosisCodes = _.uniq(DArray, false, function (p) { return p.DiagnosisId; });


        if (mainitem.ClaimTypeId == 1) {
            eHnoteInsuranceService.checkPatientProfessionalClaimSubmissionUsingEdi(mainitem, $scope.AllDiagnosisCodes, $scope.cacheStorageItem.PatientID, appointmentinfo.PatientName, $scope.cacheStorageItem.appointmentid, $scope.UserId, $scope.HospitalID, $scope.orgftpDetails, $scope.HospitalDetailsObj, $scope.PatientOtherDetails, $scope.DoctorObj, onSuccess, onError);
        }
        else {
            eHnoteInsuranceService.checkPatientInstitutionalClaimSubmissionUsingEdi(mainitem, $scope.AllDiagnosisCodes, $scope.cacheStorageItem.PatientID, appointmentinfo.PatientName, $scope.cacheStorageItem.appointmentid, $scope.UserId, $scope.HospitalID, $scope.orgftpDetails, $scope.HospitalDetailsObj, $scope.PatientOtherDetails, $scope.DoctorObj, onSuccess, onError);
        }


        function onSuccess(resp) {

            $rootScope.mInstanceAdd.close("save");
        }

        function onError(reponse) {
        }


        // $rootScope.mInstanceAdd.close("save");
    };
    /*PreAuthorization popup*/
    $scope.PatientPreAuthorizationList = [];
    $scope.ShowPreAuthorizationListPopup = function (mainitem, instype) {
        mainitem = mainitem || [];
        if (mainitem.length == 0) {
            return false;
        }

        $scope.modalInstance = $uibModal.open({
            "templateUrl": "templates/consultation/payor/PatientPreAuthorizationListPopup.html",
            "size": "lg",
            "backdrop": "static",
            "resolve": {
                "Selectobj": function () { return mainitem; },
                "mainBillingObject": function () { return $scope.mainBillingObject; },
            },
            "keyboard": false,
            "windowClass": "inventory-full-popup",
            "controller": function ($scope, $uibModal, $uibModalInstance, Selectobj, mainBillingObject) {
                $scope.SelectobjList = Selectobj || [];
                $scope.mainBillingObject = mainBillingObject;

                // $scope.Selectobj = Selectobj[0] || {};
                $scope.Selectobj = {};
                if (instype === 1) {
                    var filter = $filter("filter")($scope.SelectobjList, { "PayorId": $scope.mainBillingObject.PayorObj.PayorId }) || [];
                    if (filter.length > 0) {
                        $scope.Selectobj = filter[0];
                    }
                } else if (instype === 2) {
                    var filter = $filter("filter")($scope.SelectobjList, { "PayorId": $scope.mainBillingObject.PayorObj1.PayorId }) || [];
                    if (filter.length > 0) {
                        $scope.Selectobj = filter[0];
                    }
                }

                $scope.PatientPreAuthorizationList = [];

                function getpatientPreauthorization() {
                    $scope.Selectobj = $scope.Selectobj || "";
                    if ($scope.Selectobj == "") {
                        return false;
                    }

                    var obj = {
                        "BranchId": $scope.Selectobj.HospitalId,
                        "AppointmentId": $scope.Selectobj.AppointmentId,
                        "CurrentDate": $filter("date")(new Date(), "yyyy-MM-dd"),
                        "PatientId": $scope.Selectobj.PatientId,
                        "PayorId": $scope.Selectobj.PayorId
                    };
                    return eHnoteInsuranceService.GetPreAuthorizationDetailsByAppointmentID(obj).then(function (resp) {

                        $scope.PatientPreAuthorizationList = [];
                        if (resp.data.status === "Success") {
                            if (resp.data.rows.length > 0) {
                                $scope.PatientPreAuthorizationList = resp.data.rows;
                            }
                        } else {
                            alertify.error(Message);
                        }
                    }, function (err) {
                        console.log(resp);
                    });
                };
                getpatientPreauthorization();

                $scope.SaveAuthPopup = function (item) {
                    $uibModalInstance.close(item, instype);
                }

                $scope.CloseAuthPopup = function () {
                    $uibModalInstance.dismiss("cancel");
                }
            }
        });
        $scope.modalInstance.result.then(function (resp, type) {

            if (instype === 1) {
                $scope.mainBillingObject.PreAuthorizationNumber1 = resp.PreAuthorizationNumber;
                if ($scope.mainBillingObject.PayorDetails.length > 0) {
                    $scope.mainBillingObject.PayorDetails[0].PreAuthorizationNumber = $scope.mainBillingObject.PreAuthorizationNumber1 || '';
                }
            }
            else if (instype === 2) {
                $scope.mainBillingObject.PreAuthorizationNumber2 = resp.PreAuthorizationNumber;
            }

        }, function (cancel) {

        });
    };
    /*PreAuthorization popup End*/

    $scope.OpenSendtoPopup = function (mainitem, docid, appointmentinfo, PatientID, sendDocEmail, sendPatientEmail, sendPatientSms, DoctorID, HospitalID, ParentHospitalID, Billingpageno, billingTypeId, IsSMSInd, SMSSenderId) {

        $scope.DynamicStatusInstanceAdd = $uibModal.open({
            templateUrl: "sendToPatientTemplate.html",
            /*"size": "lg",*/
            "windowClass": "modal__ninety--",
            "resolve": {
                "allUserList": function () { return $scope.allUserList },
                "HospitalID": function () { return $scope.HospitalID },
                "appointmentid": function () { return $scope.cacheStorageItem.appointmentid },
                "AppointmentDoctorID": function () { return $scope.cacheStorageItem.AppointmentDoctorID },
                "PatientID": function () { return $scope.cacheStorageItem.PatientID },
                "RoleId": function () { return $scope.userLoginDetails.RoleID },
                //"DoctorName": function () { return $scope.TempBillingObject.DoctorName }
            },
            "controller": function ($scope, $uibModal, $uibModalInstance, allUserList, HospitalID, appointmentid, PatientID, RoleId, AppointmentDoctorID) {

                $scope.allUserList = allUserList;
                $scope.HospitalID = HospitalID;
                $scope.appointmentid = appointmentid;
                $scope.AppointmentDoctorID = AppointmentDoctorID;
                $scope.PatientID = PatientID;
                $scope.RoleId = RoleId;
                //$scope.DoctorName = DoctorName;

                if ($scope.allUserList.length !== 0) {

                    $scope.AllCounsollerList = angular.copy($scope.allUserList);

                    $scope.AllTechnicianList = angular.copy($scope.allUserList);

                    $scope.AllDoctorList = angular.copy($scope.allUserList);

                    $scope.AllBillingList = angular.copy($scope.allUserList);
                    $scope.AllReceptionList = angular.copy($scope.allUserList);
                    $scope.AllOpthaList = angular.copy($scope.allUserList);

                    $scope.AllDoctorList = _.uniq($scope.AllDoctorList, false, function (p) { return p.DoctorID; });
                    $scope.AllDoctorList = $filter("filter")($scope.AllDoctorList, function (item) {
                        return item.RoleId === 1 || item.RoleId === 43;
                    });

                    $scope.AllCounsollerList = _.uniq($scope.AllCounsollerList, false, function (p) { return p.DoctorID; });
                    $scope.AllCounsollerList = $filter("filter")($scope.AllCounsollerList, function (item) {
                        return item.RoleId === 18;
                    });

                    $scope.AllTechnicianList = _.uniq($scope.AllTechnicianList, false, function (p) { return p.DoctorID; });
                    $scope.AllTechnicianList = $filter("filter")($scope.AllTechnicianList, function (item) {
                        return item.RoleId === 10 || item.RoleId === 38 || item.RoleId === 55;
                    });

                    $scope.AllBillingList = _.uniq($scope.AllBillingList, false, function (p) { return p.DoctorID; });
                    $scope.AllBillingList = $filter("filter")($scope.AllBillingList, function (item) {
                        return item.RoleId === 2 || item.RoleId === 19;
                    });

                    $scope.AllReceptionList = _.uniq($scope.AllReceptionList, false, function (p) { return p.DoctorID; });
                    $scope.AllReceptionList = $filter("filter")($scope.AllReceptionList, function (item) {
                        return item.RoleId === 2;
                    });

                    $scope.AllOpthaList = _.uniq($scope.AllOpthaList, false, function (p) { return p.DoctorID; });
                    $scope.AllOpthaList = $filter("filter")($scope.AllOpthaList, function (item) {
                        return (item.RoleId === 1 && item.SuffixId === 13) || (item.RoleId === 43 && item.SuffixId === 13);
                    });

                    eHnoteMainAdminServices.GetAllWaitingRoomType().then(function (resp) {
                        $scope.RoomTypeList = resp.data;
                        $scope.RoomTypeList = $filter("filter")(resp.data, function (item, index) { return item.Id !== 6 && item.Id !== 5 && item.Id !== 3 && item.Id !== 8 });


                    }, function (err) {
                        console.log(err);
                        alertify.error("Getting  Failed");
                    });

                }

                $scope.RoomSearchObj = {
                    "RoomTypeId": 0,
                    "RoomId": 0,
                    "RoomTypeobj": "",
                    "Opthamobj": "",
                    "OptomId": null,
                    "Technicianobj": "",
                    "TechnicianId": null,
                    "Counsellorobj": "",
                    "CounsellorId": null,
                    "DilationAssistantobj": "",
                    "DilationAssistantId": null,
                    "DoctorId": null,
                    "sendtoDoctorId": null,
                    "sendtoDoctorRoleId": null,
                    "Roomobj": "",
                    "SelectDoctor": "",
                    "otherDocInd": false,
                    "SubSpecialityObj": "",
                    "SubSpecialityId": "",
                    "NewApptStartTime": ""
                }

                $scope.ChangesRoomType = function (item) {

                    $scope.searchfilterforRoom = { "txt1": "", "txt2": "", "txt3": "", "txt4": "", "txt5": "", "txt8": "" };
                    $scope.RoomSearchObj.SelectDoctor = "";
                    $scope.RoomSearchObj.RoomTypeId = item;

                    //if ($scope.RoomSearchObj.RoomTypeId === 1) {
                    //    if ($scope.RoleId == 1 || $scope.RoleId == 43) {
                    //        $scope.RoomSearchObj.DoctorId = eHnoteMasterDataService.getLoginId();
                    //        $scope.SelectDoctor = $filter("filter")($scope.AllDoctorList, { "DoctorID": $scope.RoomSearchObj.DoctorId }, true)[0];
                    //        $scope.RoomSearchObj.SelectDoctor = $scope.SelectDoctor.FullName;
                    //    }             

                    //}
                    if ($scope.RoomSearchObj.RoomTypeId === 1) {
                        $scope.SelectDoctor = $filter("filter")($scope.AllDoctorList, { "DoctorID": $scope.AppointmentDoctorID }, true)[0];
                        $scope.RoomSearchObj.SelectDoctor = $scope.SelectDoctor.FullName;

                    }
                    var params = {
                        "HospitalId": $scope.HospitalID,
                        "RoomTypeId": $scope.RoomSearchObj.RoomTypeId,
                        "SearchText": "",
                        "PageNumber": 1,
                        "PageSize": 100
                    }
                    eHnoteSettingsDataService.GetWaitingRoomList(params).success(function (data) {
                        if (data.Status === "Success") {
                            $scope.RoomListarray = data.rows || [];
                        } else {
                            $scope.RoomListarray = [];
                        }

                    }).error(function (error) {

                    });


                }

                $scope.closeRoom = function (item) {
                    $uibModalInstance.dismiss("cancel");
                };

                $scope.ChangesRoom = function (item) {
                    item = item || null;
                    if (item !== null) {
                        $scope.RoomSearchObj.RoomId = item.RoomId || 0;
                        $scope.RoomSearchObj.RoomAvailability = item.RoomAvailability || 0;
                        $scope.RoomSearchObj.RoomCapacity = item.RoomCapacity || 0;
                    } else {
                        $scope.RoomSearchObj.RoomId = 0;
                        $scope.RoomSearchObj.RoomAvailability = 0;
                        $scope.RoomSearchObj.RoomCapacity = 0;
                    }

                };

                $scope.searchfilterforRoom = {
                    "txt1": "",
                    "txt2": "",
                    "txt3": "",
                    "txt4": "",
                    "txt5": "",
                    "txt8": "",
                    "txt9": ""
                };

                $scope.ChangesBillingUser = function (item) {
                    $scope.RoomSearchObj.SelectDoctor = item.FullName;
                    $scope.RoomSearchObj.BillingUserId = item.DoctorID;
                    $scope.RoomSearchObj.sendtoDoctorId = item.DoctorID;
                    $scope.RoomSearchObj.sendtoDoctorRoleId = item.RoleId;
                    $scope.RoomSearchObj.TechnicianId = null;
                    $scope.RoomSearchObj.OptomId = null;
                    $scope.RoomSearchObj.CounsellorId = null;
                    $scope.RoomSearchObj.DilationAssistantId = null;
                    $scope.RoomSearchObj.DoctorId = null;
                    $scope.RoomSearchObj.ARId = null;
                    $scope.searchfilterforRoom.txt9 = "";
                };

                $scope.ChangesReceptionUser = function (item) {
                    $scope.RoomSearchObj.SelectDoctor = item.FullName;
                    $scope.RoomSearchObj.TechnicianId = null;
                    $scope.RoomSearchObj.OptomId = null;
                    $scope.RoomSearchObj.CounsellorId = null;
                    $scope.RoomSearchObj.DilationAssistantId = null;
                    $scope.RoomSearchObj.DoctorId = null;
                    $scope.RoomSearchObj.ARId = null;
                    $scope.RoomSearchObj.ReceptionId = item.DoctorID;
                    $scope.RoomSearchObj.sendtoDoctorId = item.DoctorID;
                    $scope.RoomSearchObj.sendtoDoctorRoleId = item.RoleId;
                    $scope.searchfilterforRoom.txt10 = "";
                };

                $scope.ChangesRoomDoctor = function (item) {
                    $scope.RoomSearchObj.SelectDoctor = item.FullName;
                    $scope.RoomSearchObj.DoctorId = item.DoctorID;
                    $scope.RoomSearchObj.sendtoDoctorId = item.DoctorID;
                    $scope.RoomSearchObj.sendtoDoctorRoleId = item.RoleId;
                    $scope.RoomSearchObj.OptomId = null;
                    $scope.RoomSearchObj.CounsellorId = null;
                    $scope.RoomSearchObj.DilationAssistantId = null;
                    $scope.RoomSearchObj.TechnicianId = null;
                    $scope.RoomSearchObj.ARId = null;
                    $scope.searchfilterforRoom.txt1 = "";
                    $scope.RoomSearchObj.BillingUserId = null;
                };

                $scope.ChangesCounsellor = function (item) {
                    $scope.RoomSearchObj.SelectDoctor = item.FullName;
                    $scope.RoomSearchObj.CounsellorId = item.DoctorID;
                    $scope.RoomSearchObj.sendtoDoctorId = item.DoctorID;
                    $scope.RoomSearchObj.sendtoDoctorRoleId = item.RoleId;
                    $scope.RoomSearchObj.OptomId = null;
                    $scope.RoomSearchObj.TechnicianId = null;
                    $scope.RoomSearchObj.DilationAssistantId = null;
                    $scope.RoomSearchObj.DoctorId = null;
                    $scope.RoomSearchObj.ARId = null;
                    $scope.searchfilterforRoom.txt4 = "";
                    $scope.RoomSearchObj.BillingUserId = null;
                };

                $scope.ChangesTechnician = function (item) {
                    $scope.RoomSearchObj.SelectDoctor = item.FullName;
                    $scope.RoomSearchObj.TechnicianId = item.DoctorID;
                    $scope.RoomSearchObj.sendtoDoctorId = item.DoctorID;
                    $scope.RoomSearchObj.sendtoDoctorRoleId = item.RoleId;
                    $scope.RoomSearchObj.OptomId = null;
                    $scope.RoomSearchObj.CounsellorId = null;
                    $scope.RoomSearchObj.DilationAssistantId = null;
                    $scope.RoomSearchObj.DoctorId = null;
                    $scope.RoomSearchObj.ARId = null;
                    $scope.searchfilterforRoom.txt5 = "";
                    $scope.RoomSearchObj.BillingUserId = null;
                };

                $scope.ChangeOpthaUser = function (item) {
                    $scope.RoomSearchObj.SelectDoctor = item.FullName;
                    $scope.RoomSearchObj.TechnicianId = null;
                    $scope.RoomSearchObj.sendtoDoctorId = item.DoctorID;
                    $scope.RoomSearchObj.sendtoDoctorRoleId = item.RoleId;
                    $scope.RoomSearchObj.OptomId = item.DoctorID;
                    $scope.RoomSearchObj.CounsellorId = null;
                    $scope.RoomSearchObj.DilationAssistantId = null;
                    $scope.RoomSearchObj.DoctorId = null;
                    $scope.RoomSearchObj.ARId = null;
                    $scope.searchfilterforRoom.txt11 = "";
                    $scope.RoomSearchObj.BillingUserId = null;
                };

                $scope.SendToRoom1 = function (item) {

                    if ($scope.RoomSearchObj.RoomTypeId === 0) {
                        alertify.error("Select Room Type");
                        return false;
                    }
                    if ($scope.RoomSearchObj.RoomTypeId !== 7) {
                        if ($scope.RoomSearchObj.RoomId === 0) {
                            alertify.error("Select Room Type");
                            return false;
                        }
                    }


                    $scope.Time = $filter("date")(new Date(), "HH:mm");

                    var params = {
                        "UserId": eHnoteMasterDataService.getLoginId(),
                        "PatientId": $scope.PatientID,
                        "AppointmentId": $scope.appointmentid,
                        "RoomId": $scope.RoomSearchObj.RoomId,
                        "RoomTypeId": $scope.RoomSearchObj.RoomTypeId,
                        "NextCounterId": $scope.RoomSearchObj.RoomTypeId,
                        // "PreviousCounterId": $scope.cacheStorageItem.NextCounterId,
                        "StartTime": $scope.Time,
                        "PatientDynamicStatusId": 0,
                        "status": "Waiting",
                        "DoctorId": $scope.RoomSearchObj.DoctorId || null,
                        "TechnicianId": $scope.RoomSearchObj.TechnicianId || null,
                        "OptomId": $scope.RoomSearchObj.OptomId || null,
                        "DilationAssistantId": null,
                        "CounsellorId": $scope.RoomSearchObj.CounsellorId,
                        "ARId": null,
                        "IsCheckedOut": 2,
                        "RoleId": $scope.RoleId
                    }
                    if (params.RoomTypeId === 7) {
                        params.RoomId = null;
                        params.IsCheckedOut = 3;
                        params.Status = 'Completed';
                    }
                    eHnoteMainAppointmentService.AddUpdatePatientDynamicStatus(params).then(function (resp) {

                    }, function (err) {
                        console.log(err);
                        alertify.error("Getting Failed");
                    });

                    $uibModalInstance.close();

                }

                $scope.SendToRoom = function (item) {

                    if ($scope.RoomSearchObj.RoomTypeId === 0) {
                        alertify.error("Select Room Type");
                        return false;
                    }
                    //if ($scope.RoomSearchObj.RoomTypeId !== 7) {
                    //    if ($scope.RoomSearchObj.RoomId === 0) {
                    //        alertify.error("Select Room Type");
                    //        return false;
                    //    }
                    //}

                    $scope.Time = $filter("date")(new Date(), "HH:mm");
                    $scope.CurrentTime = $filter("date")(new Date(), "HH:mm:ss");
                    var params = {
                        "UserId": eHnoteMasterDataService.getLoginId(),
                        "HospitalId": $scope.HospitalID,
                        "AppointmentId": $scope.appointmentid,
                        "AppointmentTrackerDetailId": 0,
                        "RoleId": $scope.RoleId,
                        "DoctorId": $scope.RoomSearchObj.sendtoDoctorId || null,
                        "DoctorRoleId": $scope.RoomSearchObj.sendtoDoctorRoleId || null,
                        "RoomTypeId": $scope.RoomSearchObj.RoomTypeId,
                        "RoomId": $scope.RoomSearchObj.RoomId,
                        "IsSendTo": "Y",
                        "IsCheckedIn": "N",
                        "IsCheckedOut": "N",
                        "IsReCheckIn": "N",
                        "IsReCheckOut": "N",
                        "CurrentTime": $scope.CurrentTime,
                        "VisitTypeId": appointmentinfo.VisitTypeId,

                    }

                    //var params = {
                    //    "UserId": eHnoteMasterDataService.getLoginId(),
                    //    "PatientId": $scope.patientid,
                    //    "AppointmentId": $scope.appointmentid,
                    //    "RoomId": $scope.RoomSearchObj.RoomId,
                    //    "RoomTypeId": $scope.RoomSearchObj.RoomTypeId,
                    //    "NextCounterId": $scope.RoomSearchObj.RoomTypeId,
                    //    // "PreviousCounterId": $scope.cacheStorageItem.NextCounterId,
                    //    "StartTime": $scope.Time,
                    //    "PatientDynamicStatusId": 0,
                    //    "status": "Waiting",
                    //    "DoctorId": $scope.RoomSearchObj.DoctorId || null,
                    //    "TechnicianId": $scope.RoomSearchObj.TechnicianId || null,
                    //    "OptomId": $scope.RoomSearchObj.OptomId || null,
                    //    "DilationAssistantId": null,
                    //    "CounsellorId": $scope.RoomSearchObj.CounsellorId,
                    //    "ARId": null,
                    //    "IsCheckedOut": 2,
                    //    "RoleId": $scope.RoleId
                    //}

                    if (params.RoomTypeId === 7) {
                        params.RoomId = null;
                        params.IsCheckedOut = "Y";
                        // params.Status = 'Completed';
                    }
                    eHnoteMainAppointmentService.AddUpdateAppointmentTrackerDetails(params).then(function (resp) {
                        if (resp.data.Status == "Success") {

                        } else {
                            alertify.error("Consulatation Not Started");
                        }
                    }, function (err) {
                        console.log(err);
                        alertify.error("Getting Failed");
                    });

                    $uibModalInstance.close();

                }

                $scope.ChangesCheckItem = function (item, checkoutItem) {
                    if (checkoutItem === true) {
                        $scope.RoomSearchObj.RoomTypeobj = "";
                        $scope.submitbutton = "Save";
                        $scope.ChangesRoomType(item);
                    } else {
                        $scope.RoomSearchObj.RoomTypeobj = "";
                        $scope.submitbutton = "Send";
                        $scope.RoomSearchObj.RoomTypeId = 0;
                    }
                };

            },


        });

        $scope.DynamicStatusInstanceAdd.result.then(function (resp) {
            if ($scope.SaveasDraftorBiller == 'Biller') {
                eHnotePatientDataService.AddUpdateBilling(mainitem, docid, appointmentinfo, PatientID, sendDocEmail, sendPatientEmail, sendPatientSms, DoctorID, $scope.HospitalID, $scope.ParentHospitalID, $scope.Billingpageno, billingTypeId, doctorinfo.doctordata.UserAddress[0].IsSMSInd, doctorinfo.doctordata.UserAddress[0].SMSSenderId, onBillingSaveSuccess, onBillingSaveError,);

            }
            else if ($scope.SaveasDraftorBiller == 'PendingClaims') {
                if (mainitem.ClaimStatusId == 1) {
                    mainitem.ClaimStatusId = 2;
                }


                mainitem.Mode = 'Update';
                eHnotePatientDataService.AddUpdateBilling(mainitem, docid, appointmentinfo, PatientID, sendDocEmail, sendPatientEmail, sendPatientSms, DoctorID, $scope.HospitalID, $scope.ParentHospitalID, $scope.Billingpageno, billingTypeId, doctorinfo.doctordata.UserAddress[0].IsSMSInd, doctorinfo.doctordata.UserAddress[0].SMSSenderId, onBillingPendingSaveSuccess, onBillingSaveError);

            } else {
                eHnotePatientDataService.AddUpdateBillingDraft(mainitem, docid, appointmentinfo, PatientID, sendDocEmail, sendPatientEmail, sendPatientSms, DoctorID, $scope.HospitalID, $scope.ParentHospitalID, $scope.Billingpageno, billingTypeId, doctorinfo.doctordata.UserAddress[0].IsSMSInd, doctorinfo.doctordata.UserAddress[0].SMSSenderId, onBillingDraftSaveSuccess, onBillingDraftSaveError);

            }
        }, function (cancel) {
        });

    };


    $scope.changeBillingProvider = function (mainBillingObj) {


        mainBillingObj.BillingProviderId = mainBillingObj.BillingProviderObj.OrganizationBillingProviderId;
        mainBillingObj.BillingProviderName = mainBillingObj.BillingProviderObj.FacilityName;

        if (mainBillingObj.BillingProviderObj.BillingProviderTypeId === 1) {
            mainBillingObj.ClaimTypeId = 1;
            mainBillingObj.PlaceOfServiceId = 11;
        }

        if (mainBillingObj.BillingProviderObj.BillingProviderTypeId === 2) {
            mainBillingObj.ClaimTypeId = 2;
            mainBillingObj.PlaceOfServiceId = 24;
        }

        $scope.changeBillingServiceLocation(mainBillingObj);

    };
    $scope.FacilityPlaceOfServiceArray = [];
    $scope.GetPlaceOfServiceCodes = function () {
        eHnoteSettingsDataService.GetMasterPlaceOfServiceCodes().then(function (response) {
            $scope.FacilityPlaceOfServiceArray = [];
            if (response.data.status == "Success") {
                if (response.data.rows.length > 0) {
                    $scope.FacilityPlaceOfServiceArray = response.data.rows || [];
                }
            } else {
                alertify.error(response.data.Meassage);
            }
        }, function (error) {
            console.log(error);
        });
    };

    $scope.GetPlaceOfServiceCodes();


    $scope.changeClaimType = function (mainobj) {

        angular.forEach($scope.mainBillingObject.BillingDetail, function (sitem) {
            sitem.RevenueBillingCodeId = 0;
            sitem.RevenueBillingCode = "";
            sitem.RevenueBillingCodeObj = "";
            sitem.RevenueBillingCodeName = "";
        });
    };

    $scope.changeBillingServiceLocation = function (mainobj) {

        angular.forEach($scope.mainBillingObject.BillingDetail, function (sitem) {
            sitem.POSId = mainobj.PlaceOfServiceId;
            $scope.GetInsuranceCoverageProcedureCostById(sitem);
        });

    };


    $scope.GetOrganizationTypeOfService = function (text, Type, Servicetype) {
        var Type = '';
        if (Servicetype == 'Investigation') {
            Type = 'Investigation';

        } else if (Servicetype == 'Surgery') {
            Type = 'Surgery';
        }
        else if (Servicetype == 'Procedure') {
            Type = 'Procedure';
        }
        var params = {
            "OrganizationId": $scope.HospitalID,
            "ProcedureId": 0,
            "PageNumber": 1,
            "PageSize": 10,
            "CPTCODE": "",  // cptcode tblorganizationprocedure
            "SearchText": text || "", // searchtext
            "TypeOfServiceId": 0,
            "Type": Type || 0,
            "ParentOrganizationId": $scope.ParentHospitalID || null
        };

        return eHnoteSettingsDataService.GetOrganizationProceduresByType(params).then(function (resp) {
            if (resp.data.rows !== undefined) {
                return resp.data.rows.map(function (item) {
                    return item;
                });
            }
        });
    };


    $scope.GetOrganizationProcedure = function (text) {

        if ($scope.mainBillingObject.BillingProviderId === 0 || $scope.mainBillingObject.BillingProviderId === "") {
            alertify.error("Please Select Billing Provider");
            return false;

        }

        var params = {
            "OrganizationId": $scope.HospitalID,
            "ProcedureId": 0,
            "CPTCODE": "",  // cptcode tblorganizationprocedure
            "SearchText": text || "", // searchtext
            "TypeOfServiceId": 0,
            "PageNumber": 1,
            "PageSize": 10,
            "Status": 1,
            "IsFrequent": "N"
        };
        if (params.SearchText == '') {
            params.IsFrequent = 'Y';
        }

        return eHnoteSettingsDataService.GetOrganizationProcedures(params).then(function (resp) {
            if (resp.data.rows !== undefined) {
                return resp.data.rows.map(function (item) {
                    return item;
                });
            }
        });
    };

    $scope.EditInsurance = function (item) {
        item.MovetoBilling = true;
        $rootScope.$broadcast("loadBillertoPatientINsuranceEdit", item);
    };
    $scope.showPaymentDetails = false;
    $scope.addPaymentstoBill = function () {
        $scope.showPaymentDetails = true;

        if ($scope.mainBillingObject.Payments.length == 1) {
            if ($scope.mainBillingObject.Payments[0].PatientBillTypeId == "1") {
                $scope.mainBillingObject.Payments[0].PaymentReasonId = 3;
                $scope.mainBillingObject.Payments[0].PaymentReasonobj = $filter("filter")($scope.PaymentReasonList, { "AdjustmentCodeId": 3 })[0];
            }
        }
    };


    $scope.stopClosingDropDown = function (event) {
        event.stopPropagation();
    }
    $scope.addedDiagnosisArray = [];
    $scope.$watch("DiagnosisListArray", function (newVal, oldVal) {
        $scope.addedDiagnosisArray = [];
        if ($scope.DiagnosisListArray.length === 0) { return; }
        var array = $filter("filter")($scope.DiagnosisListArray, function (item, index) { return item.DiagnosisId !== 0; }) || [];
        if (array.length > 0) {
            angular.forEach(array, function (ditem) {
                var Obj = {
                    "DiagnosisId": ditem.DiagnosisId,
                    "DiagnosisName": ditem.Description,
                    "DiagnosisCode": ditem.ICD10Code,
                    "IsSelected": false,
                    "Type": ditem.Type
                };
                $scope.addedDiagnosisArray.push(Obj);
            });



            if ($scope.addedDiagnosisArray.length > 0) {
                if ($scope.mainBillingObject.BillingDetail.length > 0) {
                    angular.forEach($scope.mainBillingObject.BillingDetail, function (bitem) {
                        if (bitem.BillingDetailId === 0) {
                            bitem.addedDiagnosisArray = angular.copy($scope.addedDiagnosisArray);
                            bitem.DiagnosisIds = [];
                            bitem.DiagnosisType = "";
                            bitem.DiagnosisSearchType = "";
                        }
                    });
                }
            }
        }
    }, true);


    $scope.DiagnosisPointersTypeToggle = function (item) {
        var checkedArray = _.where(item.addedDiagnosisArray, { IsSelected: true });
        item.DiagnosisIds = [];
        item.DiagnosisType = "";
        if (checkedArray.length > 0) {
            angular.forEach(checkedArray, function (ditem) {
                var obj = {
                    "DiagnosisId": ditem.DiagnosisId,
                    "Type": ditem.Type,
                    "DeleteInd": 'N'
                }

                item.DiagnosisType = item.DiagnosisType + ditem.Type;
                item.DiagnosisIds.push(obj);
            });
        }
    };

    $scope.usmainBillingTabActive = 1;
    $scope.usBillingMainClassActiveMenu = function (menuno) {
        return (menuno === $scope.usmainBillingTabActive) ? "active" : "";
    };

    $scope.getpatientInvoiceIds = function (patientId) {
        eHnotePatientDataService.GetPatientInvoicesById(patientId).then(function (resp) {
            $scope.patientInvoicesArray = [];

            if (resp.data !== undefined) {
                if (resp.data.length > 0) {
                    $scope.patientInvoicesArray = angular.copy(resp.data);
                    angular.forEach($scope.patientInvoicesArray, function (item) {

                        item.PatientId = patientId;
                        item.isCurrentMonth = false;
                        item.isBilledHospital = false;
                        item.InvoiceStatus = "";
                        if (item.IsInvoiceCancelled) {
                            item.InvoiceStatus = "Cancelled";
                        } else {
                            if (item.TotalBalance === 0) {
                                item.InvoiceStatus = "Completed";
                            } else {
                                item.InvoiceStatus = "Due";
                            }
                        }
                    });
                }
            }
        }, function (err) {
            console.log(err);
            alertify.error("Getting Patient Billing Failed");
        });
    }
    $scope.switchusBillingCodeTab = function (index) {
        $scope.usmainBillingTabActive = index;
        if ($scope.usmainBillingTabActive == 2) {
            $scope.getpatientInvoiceIds($scope.cacheStorageItem.PatientID);
        }
    };



    $scope.GetInvociesSearchObj = function () {
        var Obj = {
            "FromDate": $filter('date')(new Date(), "MM-dd-yyyy"),
            "ToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
            "SearchText": "",
            "PatientId": 0,
            "PageSize": 10,
            "PageNumber": 1,
            "BranchId": $scope.HospitalId
        }
        return Obj;
    };
    $scope.InvociesSearchReqObj = $scope.GetInvociesSearchObj();



    if ($scope.parentProfileTab.MainTab === 7) {
        $scope.getpatientInvoiceIds($scope.cacheStorageItem.PatientID);
    }
    if ($scope.parentProfileTab.MainTab === 8) {
        $scope.getPatientDepositAmountById($scope.cacheStorageItem.PatientID);
    }

    if ($scope.parentProfileTab.MainTab === 9) {
        $scope.SearchPatientDuelist();
    }


    $scope.BillUpdateOnLegderpopup = false;
    $scope.gotoLegderPopupNew = function () {

        $scope.BillUpdateOnLegderpopup = true;
        $scope.GetPatientInvoiceSerachObj = function () {
            return {
                "FromDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "ToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "InvoiceId": "",
                "IsShowAllDueBills": false,
                "Count": 0,
                "PageSize": 10,
                "PageNumber": 1
            };
        };
        $scope.PatientInvoiceSerachObj = angular.copy($scope.GetPatientInvoiceSerachObj());
        $scope.PatientInvoicesList = [];
        $scope.SelectedInvoiceObj = "";
        $scope.ShowDuePaymentAmountView = false;
        $scope.mainBillingObject = $scope.getMainBillingObject();
        $scope.GetPatientInvoiceslist();
        $scope.ShowBillViewList = false;

        $scope.modalpayorInstance = $uibModal.open({
            "templateUrl": "templates/consultation/payor/ParticularPatientDuesList.html",
            "size": "lg",
            "backdrop": "static",
            "keyboard": false,
            "scope": $scope,
            "windowClass": "inventory-full-popup"
        });
    }

    /* $scope.gotoLegderPopup = function () {
 
         $scope.obj = {
             "PatientId": $scope.cacheStorageItem.PatientID,
             "HospitalId": $scope.HospitalId
         };
 
         $scope.modalpayorInstance = $uibModal.open({
             "templateUrl": "templates/consultation/payor/ParticularPatientDuesList.html",
             "resolve": {
                 "Selectobj": function () { return $scope.obj; },
             },
             "size": "lg",
             "backdrop": "static",
             "keyboard": false,
             "windowClass": "inventory-full-popup",
             "controller": function ($scope, $filter, $uibModal, $uibModalInstance, Selectobj, eHnoteInsuranceService) {
                 $scope.Selectobj = Selectobj || '';
 
 
 
                 $scope.PatientAllDueBillsList = [];
                 $scope.GetPatientDueObj = function () {
                     return {
                         "FromDate": $filter('date')(new Date(), "dd-MM-yyyy"),
                         "ToDate": $filter('date')(new Date(), "dd-MM-yyyy"),
                         "BranchId": $scope.Selectobj.HospitalId,
                         "SearchText": "",
                         "Patient": "",
                         "Name": "",
                         "Mobile": "",
                         "PatientId": $scope.Selectobj.PatientID,
                         "PatientClaimId": 0,
                         "Type": "",
                         "PageSize": 100,
                         "PageNumber": 1,
                         "Approvedamount": 0,
                         "ReceivedAmount": 0
                     };
                 };
                 $scope.SearchPatientDueObj = angular.copy($scope.GetPatientDueObj());
                 $scope.SearchPatientDuelist = function () {
                     var obj = {
                         "FromDate": $scope.SearchPatientDueObj.FromDate,
                         "ToDate": $scope.SearchPatientDueObj.ToDate,
                         "BranchId": $scope.SearchPatientDueObj.BranchId,
                         "PatientId": $scope.SearchPatientDueObj.PatientId,
                         "PageSize": $scope.SearchPatientDueObj.PageSize || 10,
                         "PageNumber": $scope.SearchPatientDueObj.PageNumber || 1,
                     };
                     obj.FromDate = $filter("dateFormatter")(obj.FromDate, "-");
                     obj.ToDate = $filter("dateFormatter")(obj.ToDate, "-");
 
                     eHnoteInsuranceService.GetPatientAllDueBills(obj).then(function (resp) {
                         $scope.PatientAllDueBillsList = [];
                         if (resp.data.Status === "Success") {
                             $scope.PatientAllDueBillsList = resp.data.rows || [];
                             $scope.PatientAllDueBillsListCount = resp.data.Count || 0;
 
 
 
                         } else {
                             alertify.error(resp.data.Message);
                         }
                     });
                 };
 
                 $scope.init = function () {
                     $scope.SearchPatientDuelist();
                 }
                 $scope.init();
 
 
                 $scope.ClosePopup = function () {
                     $uibModalInstance.dismiss("cancel");
                 };
             }
         });
         $scope.modalpayorInstance.result.then(function (SelectDepositListArray) {
 
             if (SelectDepositListArray.length != 0) {
                 //$scope.mainBillingObject.PatientDepositId = SelectDepositListArray[0].PatientDepositId;
                 //$scope.mainBillingObject.TotalUnBilledAmount = SelectDepositListArray[0].UnBilledAmount;
                 //// $scope.mainBillingObject.TotalPatientBalance = SelectDepositListArray[0].UnBilledAmount;
 
 
                 //var totalBal = 0;
                 ////    var amunt = $scope.mainBillingObject.TotalPatientBalance - SelectDepositListArray[0].UnBilledAmount;
                 //if ($scope.mainBillingObject.TotalPatientBalance > SelectDepositListArray[0].UnBilledAmount) {
                 //    $scope.mainBillingObject.TotalPatientBalance = $scope.mainBillingObject.TotalCopayAmount - SelectDepositListArray[0].UnBilledAmount;
                 //    $scope.mainBillingObject.PatientDepositUsed = $scope.mainBillingObject.TotalCopayAmount - $scope.mainBillingObject.TotalPatientBalance;
                 //    $scope.mainBillingObject.PatientDepositAvailable = $scope.mainBillingObject.TotalUnBilledAmount - $scope.mainBillingObject.PatientDepositUsed;
                 //} else {
 
                 //    $scope.mainBillingObject.PatientDepositUsed = $scope.mainBillingObject.TotalPatientBalance;
                 //    $scope.mainBillingObject.PatientDepositAvailable = $scope.mainBillingObject.TotalUnBilledAmount - $scope.mainBillingObject.PatientDepositUsed;
                 //}
                 //var totalpayable = $scope.mainBillingObject.TotalNetAmount;
                 //if ($scope.mainBillingObject.PreviousPaidAmount > 0) {
                 //    totalpayable = $scope.mainBillingObject.TotalNetAmount - $scope.mainBillingObject.PreviousPaidAmount;
                 //}
                 //if (totalpayable > $scope.mainBillingObject.PatientAdvanceAmount) {
                 //    $scope.mainBillingObject.PayableAdvanceAmount = $scope.mainBillingObject.PatientAdvanceAmount;
                 //} else {
                 //    $scope.mainBillingObject.PayableAdvanceAmount = totalpayable;
                 //}
 
                 //angular.forEach($scope.mainBillingObject.Payments, function (item, index) {
                 //    item.Amount = "";
                 //});
                 //var paymentobj = angular.copy($scope.GetPaymentObject());
                 //paymentobj.PaymentModeId = 49;
                 //paymentobj.PaymentModeName = "Patient Deposit";
                 //paymentobj.Amount = $scope.mainBillingObject.PatientDepositUsed;
                 //$scope.mainBillingObject.Payments.push(paymentobj);
                 //$scope.calculatePayableFinalAmounts();
 
 
                 $scope.showPaymentDetails = true;
 
                 var totalpayable = $scope.mainBillingObject.TotalNetAmount;
                 var PatAdvanceAmount = SelectDepositListArray[0].UnBilledAmount;
 
 
 
                 var paymentobj = angular.copy($scope.GetPaymentObject());
                 paymentobj.PaymentModeId = 9;
                 paymentobj.PaymentModeName = "Deposit";
 
                 var filterArray = $filter("filter")($scope.masterPaymentModes, { "PaymentModeId": paymentobj.PaymentModeId });
 
                 paymentobj.PaymentModeobj = filterArray[0];
 
                 if (totalpayable > PatAdvanceAmount) {
                     paymentobj.Amount = PatAdvanceAmount
                 } else {
                     paymentobj.Amount = totalpayable;
                 }
 
                 $scope.mainBillingObject.Payments.unshift(paymentobj);
                 angular.forEach($scope.mainBillingObject.Payments, function (mitem) {
                     if (mitem.PaymentModeId === paymentobj.PaymentModeId) {
                         mitem.OtherDetailsDiv = true;
                     } else {
                         mitem.OtherDetailsDiv = false;
                     }
                 });
 
                 $scope.IsValidPayment = true;
 
                 $scope.calculatePayableFinalAmounts();
 
             }
         }, function (SelectDepositListArray) { });
     } 
     */

    $scope.gotoDepositsPopup = function () {

        $scope.obj = {
            "PatientId": $scope.cacheStorageItem.PatientID,
            "HospitalId": $scope.HospitalId,
            "UserId": $scope.UserId,
            "AppointmentId": $scope.cacheStorageItem.appointmentid
        };

        $scope.modalpayorInstance = $uibModal.open({
            "templateUrl": "templates/consultation/payor/ParticularPatientDepositsList.html",
            "resolve": {
                "Selectobj": function () { return $scope.obj; },
                "FacilitiesList": function () { return $scope.FacilitiesList; },
                "masterPaymentModes": function () { return $scope.masterPaymentModes; },
            },
            "size": "lg",
            "backdrop": "static",
            "keyboard": false,
            "windowClass": "inventory-full-popup",
            "controller": function ($scope, $filter, $uibModal, $uibModalInstance, Selectobj, eHnoteInsuranceService, FacilitiesList, masterPaymentModes, eHnotePrintService) {
                $scope.Selectobj = Selectobj || '';
                $scope.FacilitiesList = FacilitiesList || '';
                $scope.masterPaymentModes = masterPaymentModes || '';
                $scope.GetPatientDepositsObj = function () {
                    return {
                        "PatientDepositId": 0,
                        "PatientId": $scope.Selectobj.PatientId,
                        "UserId": $scope.Selectobj.UserId,
                        "BranchId": $scope.Selectobj.HospitalId,
                        "PaymentModeId": 0,
                        "DepositDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                        "TransactionNo": "",
                        "ChequeNo": "",
                        "BankName": "",
                        "BankBranchName": "",
                        "AccountNo": 0,
                        "IFSCCode": "",
                        "AppointmentId": $scope.Selectobj.AppointmentId || 0,
                        "DepositAmount": "",
                        "DepositedBy": "",
                        "Remarks": "",
                        "CardNumber": "",
                        "CardTypeId": null,
                        "CardExpiry": "",
                        "CardHolderName": "",
                        "Selectedpatientobj": "",
                        "DeleteInd": "N",
                        "ChequeDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                        "BillingProviderObj": "",
                        "DepositTypeId": "2"
                    };
                };
                $scope.isSelected = 0;
                $scope.PatientDepositsObj = angular.copy($scope.GetPatientDepositsObj());
                $scope.GetPatientDepositsLitsObj = function () {
                    return {
                        "DepositFrom": $filter('date')(new Date(), "MM-dd-yyyy"),
                        "DepositTo": $filter('date')(new Date(), "MM-dd-yyyy"),
                        "PatientId": $scope.Selectobj.PatientId,
                        "BranchId": $scope.Selectobj.HospitalId,
                        "PaymentModeId": "0",
                        "PageSize": 10,
                        "PageNumber": 1,
                        "SearchText": "",
                        "Type": 1
                    }
                };
               

                $scope.SearchPatientDepositsObj = angular.copy($scope.GetPatientDepositsLitsObj());
                $scope.PatientDepositsListArray = [];
                $scope.getPatientDepositAmountById = function () {
                    var obj = {
                        "DepositFrom": $scope.SearchPatientDepositsObj.DepositFrom || "",
                        "DepositTo": $scope.SearchPatientDepositsObj.DepositTo || "",
                        "PatientId": $scope.SearchPatientDepositsObj.PatientId,
                        "BranchId": $scope.SearchPatientDepositsObj.BranchId,
                        "PaymentModeId": 0,
                        "PageSize": 100,
                        "PageNumber": 1,
                        "SearchText": "",
                    };

                    obj.PaymentModeId = parseInt(obj.PaymentModeId);

                    obj.DepositFrom = $filter("usdateFormatter")(obj.DepositFrom, "-");
                    obj.DepositTo = $filter("usdateFormatter")(obj.DepositTo, "-");

                    eHnoteInsuranceService.GetPatientDepositAmountList(obj).then(function (resp) {

                        $scope.PatientDepositsListArray = [];

                        if (resp.data.status === "Success") {
                            $scope.PatientDepositsListArray = resp.data.rows || [];
                        } else {
                            alertify.error(resp.data.Message);
                        }
                    });
                }

                $scope.init = function () {
                    $scope.getPatientDepositAmountById();
                }
                $scope.init();


                $scope.AddDespositePrint = function (Tempitem) {
                    var CostInWords = "";
                    CostInWords = eHnotePrintService.ConvertNumberToWords(Tempitem.DepositAmount);

                    var PrintInfo = {
                        "DepositeDetails": Tempitem,
                        "BillingType": "Deposit RECEIPT",
                        "PrintedDatenTime": "",
                        "CostInWords": CostInWords,
                        "DepositDate": $filter("date")(Tempitem.DepositDate, "MM-dd-yyyy") || "",
                        "PaymentType": Tempitem.PaymentsArray.length > 0 ? Tempitem.PaymentsArray[0].PaymentMode : ""
                    };
                    var printDate = $filter("date")(new Date(), "MMM-dd-yyyy");
                    var printTime = moment(new Date()).format("HH:mm");
                    var printDatemTime = printDate + '  ' + printTime;
                    PrintInfo.PrintedDatenTime = printDatemTime;

                    eHnotePrintService.GenerateAddPatientDepositPrint(PrintInfo);
                };


                $scope.ChangeDepositSelection = function (item) {
                    $scope.isSelected = item;
                };


                $scope.ChangeDeposite = function (item, mainitem) {
                    if (item == true) {
                        $scope.isSelected = mainitem.PatientDepositId;
                    }
                }

                $scope.AddUpdatePatientDeposit = function (item) {

                    if ($scope.PatientDepositsObj.PatientId === 0) {
                        alertify.error("Please Select Patient ");
                        return;
                    }

                    if ($scope.PatientDepositsObj.PaymentModeId === 0) {
                        alertify.error("Please Select PaymentModeId ");
                        return;
                    }
                    if ($scope.PatientDepositsObj.DepositAmount === 0) {
                        alertify.error("Please Enter Amount ");
                        return;
                    }
                    //if ($scope.PatientDepositsObj.DepositedBy === '') {
                    //    alertify.error("Please Enter Deposited By ");
                    //    return;
                    //}
                    if ($scope.PatientDepositsObj.DepositTypeId === 1) {
                        $scope.PatientDepositsObj.AppointmentId = $scope.PatientDepositsObj.AppointmentId || 0;
                        if ($scope.PatientDepositsObj.AppointmentId == 0) {
                            alertify.error("Please Select Towards Appointment");
                            return;
                        }
                    }

                    var ConvertedDate = $filter("usdateFormatter")($scope.PatientDepositsObj.DepositDate, "-");
                    var ConvertedChewuewDate = $filter("usdateFormatter")($scope.PatientDepositsObj.ChequeDate, "-");

                    var obj = {
                        "PatientDepositId": $scope.PatientDepositsObj.PatientDepositId || 0,
                        "PatientId": $scope.PatientDepositsObj.PatientId || 0,
                        "UserId": $scope.PatientDepositsObj.UserId,
                        "BranchId": $scope.PatientDepositsObj.BranchId,
                        "AppointmentId": $scope.PatientDepositsObj.AppointmentId || 0,
                        "DepositAmount": $scope.PatientDepositsObj.DepositAmount || 0,
                        "DepositedBy": $scope.PatientDepositsObj.DepositedBy || '',
                        "Remarks": $scope.PatientDepositsObj.Remarks || '',
                        "DeleteInd": "N",
                        "DepositDate": ConvertedDate,
                        "PaymentArray": [{
                            "PaymentInfoId": 0,
                            "PaymentModeId": $scope.PatientDepositsObj.PaymentModeId || 0,
                            "TransactionNo": $scope.PatientDepositsObj.TransactionNo || '',
                            "TransactionDate": ConvertedDate || '',
                            "ChequeNo": $scope.PatientDepositsObj.ChequeNo || "",
                            "BankName": $scope.PatientDepositsObj.BankName || "",
                            "BankBranchName": $scope.PatientDepositsObj.BankBranchName || "",
                            "AccountNo": $scope.PatientDepositsObj.AccountNo || 0,
                            "Amount": $scope.PatientDepositsObj.DepositAmount || 0,
                            "IFSCCode": $scope.PatientDepositsObj.IFSCCode || '',
                            "CardNumber": $scope.PatientDepositsObj.CardNumber || '',
                            "CardTypeId": $scope.PatientDepositsObj.CardTypeId || null,
                            "CardExpiry": $scope.PatientDepositsObj.CardExpiry || '',
                            "CardHolderName": $scope.PatientDepositsObj.CardHolderName || '',
                            "ChequeDate": ConvertedChewuewDate || "",
                        }],
                        "BillingProviderId": $scope.PatientDepositsObj.BillingProviderObj.BillingProviderTypeId || 0,
                        "DepositTypeId": $scope.PatientDepositsObj.DepositTypeId || 2
                    };


                    eHnoteInsuranceService.AddUpdatePatientDepositAmount(obj).then(function (resp) {
                        if (resp.data.Status === "Success") {

                            if (obj.PatientDepositId === 0) {
                                alertify.success("Added Successfully");
                            } else {
                                alertify.success("Updated Successfully");
                            }
                            $uibModalInstance.close();
                            $scope.SelectedPatientDetails.DepositsObj = angular.copy($scope.PatientDepositsObj) || "";

                            $scope.PatientDepositsObj = angular.copy($scope.GetPatientDepositsObj());
                            $scope.SearchObj = angular.copy($scope.getSearchObj());

                            // $scope.PatientDepositePrint();
                            $scope.AddDespositePrint(item);
                            $scope.SelectedPatientDetails.PatientObj = "";
                            $scope.SelectedPatientDetails.DepositsObj = "";
                        } else {
                            alertify.error(resp.data.Message);
                        }
                    });
                };

                $scope.SavePopup = function () {

                    var filterArray = $filter("filter")($scope.PatientDepositsListArray, { "PatientDepositId": $scope.isSelected });
                    if (filterArray.length === 0) {
                        alertify.error(" Select Deposit");
                        return false;
                    }

                    $scope.SelectDepositListArray = [];
                    $scope.SelectDepositListArray.push(filterArray[0]);
                    $uibModalInstance.close($scope.SelectDepositListArray);

                }

                $scope.ClosePopup = function () {
                    $uibModalInstance.dismiss("cancel");
                };
            }
        });
        $scope.modalpayorInstance.result.then(function (SelectDepositListArray) {

            if (SelectDepositListArray.length != 0) {



                $scope.showPaymentDetails = true;

                var totalpayable = $scope.mainBillingObject.TotalNetAmount;
                var PatAdvanceAmount = SelectDepositListArray[0].UnBilledAmount;



                var paymentobj = angular.copy($scope.GetPaymentObject());
                paymentobj.PaymentModeId = 9;
                paymentobj.PaymentModeName = "Deposit";

                var filterArray = $filter("filter")($scope.masterPaymentModes, { "PaymentModeId": paymentobj.PaymentModeId });

                paymentobj.PaymentModeobj = filterArray[0];

                if (totalpayable > PatAdvanceAmount) {
                    paymentobj.Amount = PatAdvanceAmount
                } else {
                    paymentobj.Amount = totalpayable;
                }

                $scope.mainBillingObject.Payments.unshift(paymentobj);
                angular.forEach($scope.mainBillingObject.Payments, function (mitem) {
                    if (mitem.PaymentModeId === paymentobj.PaymentModeId) {
                        mitem.OtherDetailsDiv = true;
                    } else {
                        mitem.OtherDetailsDiv = false;
                    }
                });

                $scope.IsValidPayment = true;

                $scope.calculatePayableFinalAmounts();

            }
        }, function (SelectDepositListArray) { });
    }

    $scope.GetPatientDetailsForUBformDetails = function () {
        var patientid = $scope.appointmentinfo.PatientID;

        eHnoteAuditServices.getParticularPatientDetailsById(patientid, ongetPatientDetailsSuccess, ongetPatientDetailsError);
        function ongetPatientDetailsSuccess(response) {
            if (response !== undefined) {
                if (response.count > 0) {
                    var Patientitem = response.rows[0];
                    $scope.GetUBformDetails(Patientitem);
                }
            }

        }

        function ongetPatientDetailsError(error) {
            console.log(error);
        }

    };

    $scope.GetUBformDetails = function (patientitem) {
        $scope.UBDetailsInfo = eHnoteCacheStorageService.GetUBStorageStructure();
        var getformdetails = angular.copy($scope.mainBillingObject);

        //billingprovider
        if (getformdetails.BillingProviderObj != undefined) {
            $scope.UBDetailsInfo.BillingProviderobj.ProviderName = getformdetails.BillingProviderObj.FacilityName || "";
            $scope.UBDetailsInfo.BillingProviderobj.Address1 = getformdetails.BillingProviderObj.PostalAddress1 || "";
            $scope.UBDetailsInfo.BillingProviderobj.Address2 = getformdetails.BillingProviderObj.PostalAddress2 || "";
            $scope.UBDetailsInfo.BillingProviderobj.City = getformdetails.BillingProviderObj.PostalCityName || "";
            $scope.UBDetailsInfo.BillingProviderobj.State = getformdetails.BillingProviderObj.PostalStateName || "";
            $scope.UBDetailsInfo.BillingProviderobj.ZipCode = getformdetails.BillingProviderObj.PostalZipCode || "";
            $scope.UBDetailsInfo.BillingProvider = getformdetails.BillingProviderObj.NPI || "";
            $scope.UBDetailsInfo.FederalTaxNumber = getformdetails.BillingProviderObj.TaxId || "";
        }
        if (patientitem != undefined) {
            $scope.UBDetailsInfo.Patient = angular.copy(patientitem);
            $scope.UBDetailsInfo.Patient.Address1 = patientitem.PermanentAddress.Address1 || "";
            $scope.UBDetailsInfo.Patient.Address2 = patientitem.PermanentAddress.Address2 || "";
            $scope.UBDetailsInfo.Patient.CityName = patientitem.PermanentAddress.CityName || "";
            $scope.UBDetailsInfo.Patient.StateName = patientitem.PermanentAddress.StateName || "";
            $scope.UBDetailsInfo.Patient.ZipCode = patientitem.PermanentAddress.ZipCode || "";
            $scope.UBDetailsInfo.Patient.CountryName = patientitem.PermanentAddress.CountryName || "";
            $scope.UBDetailsInfo.MedicalRecordNumber = patientitem.DisplayID || "";


            $scope.PatientOtherDetails.FirstName = patientitem.FirstName || "";
            $scope.PatientOtherDetails.LastName = patientitem.LastName || "";
            $scope.PatientOtherDetails.Address1 = patientitem.PermanentAddress.Address1 || "";
            $scope.PatientOtherDetails.Address2 = patientitem.PermanentAddress.Address2 || "";
            $scope.PatientOtherDetails.CityName = patientitem.PermanentAddress.CityName || "";
            $scope.PatientOtherDetails.StateName = patientitem.PermanentAddress.StateName || "";
            $scope.PatientOtherDetails.ZipCode = patientitem.PermanentAddress.ZipCode || "";
            $scope.PatientOtherDetails.DOB = patientitem.DOB || "";
            $scope.PatientOtherDetails.Gender = patientitem.Gender || "";
        }

        //var today = $filter("date")(new Date(), "yyyy-MM-dd");
        var datetime = $scope.appointmentinfo.ConsultationDt + "T" + $scope.appointmentinfo.StartTime;
        var todaytime = $filter('date')(datetime, "hh:mm a");
        $scope.UBDetailsInfo.Appointment.AdmissionDate = datetime;

        if (getformdetails.PayorObj != undefined && getformdetails.PayorObj != "") {

            if ($scope.UBDetailsInfo.InsuranceDetails.length > 0) {
                angular.forEach($scope.UBDetailsInfo.InsuranceDetails, function (nitem) {
                    if (nitem.IdentifierId === getformdetails.PayorObj.IdentifierId) {
                        nitem.PayorId = getformdetails.PayorObj.PayorId || "";
                        nitem.PayorName = getformdetails.PayorObj.PayorName || "";
                        nitem.OrganizationPayorId = getformdetails.PayorObj.OrganizationPayorId || "";
                        nitem.OrganizationPayorName = getformdetails.PayorObj.OrganizationPayorName || "";
                        nitem.OrganizationPlanId = getformdetails.PayorObj.PlanId || "";
                        nitem.OrganizationPlanName = getformdetails.PayorObj.PlanName || "";
                        nitem.ReleaseInfo = getformdetails.PayorObj.ReleaseInfo || "";
                        nitem.AssignmentofBenefits = getformdetails.PayorObj.AssignBenifits || "";
                        nitem.PriorPayments = "";
                        nitem.EstimatedAmountDue = "";
                        nitem.OtherBillingProviderIdentifier = "";
                        nitem.IdentifierId = getformdetails.PayorObj.IdentifierId || "";
                        nitem.InsuredsName = getformdetails.PayorObj.InsuredPersonFirstName || "";
                        nitem.PatientRelationship = getformdetails.PayorObj.RelationShipName || "";
                        nitem.InsuredsUniqueIdentifier = getformdetails.PayorObj.PolicyId || "";
                        nitem.InsuredsGroupName = getformdetails.PayorObj.GroupName || "";
                        nitem.InsuranceGroupNumber = getformdetails.PayorObj.GroupId || "";
                        nitem.TreatmentAuthorizationCodes = "";
                        nitem.DocumentControlNumber = getformdetails.PayorObj.PatientInsuranceControlNumber || "";
                        nitem.EmployerName = "";
                    }
                });
            }

        }

        if ($scope.DiagnosisListArray.length > 0) {
            angular.forEach($scope.UBDetailsInfo.OtherDiagnosisandPOA_Firstrow, function (oitem) {
                angular.forEach($scope.DiagnosisListArray, function (ditem) {
                    if (ditem.Type === oitem.DiagnosisLetter && ditem.DiagnosisId != 0) {
                        oitem.DiagnosisCode = ditem.ICD10CODE || "";
                        oitem.PresentonAdmission = "Y";
                    }
                    if (ditem.Type === "A" && ditem.DiagnosisId != 0) {
                        $scope.UBDetailsInfo.PrincipleDiagnosisandPOA.DiagnosisCode = ditem.ICD10CODE || "";
                        $scope.UBDetailsInfo.PrincipleDiagnosisandPOA.PresentonAdmission = "Y";
                        $scope.UBDetailsInfo.AdmittingDiagnosisCode = ditem.ICD10CODE || "";
                        $scope.UBDetailsInfo.PatientsReasonforVisitObj.Reason1 = ditem.ICD10CODE || "";
                        $scope.UBDetailsInfo.ExternalCauseofInjuryObj[0].Code = ditem.ICD10CODE || "";
                        $scope.UBDetailsInfo.ExternalCauseofInjuryObj[0].PresentonAdmission = "Y";
                    }
                    else if (ditem.Type === "B" && ditem.DiagnosisId != 0) {
                        $scope.UBDetailsInfo.PatientsReasonforVisitObj.Reason2 = ditem.ICD10CODE || "";
                        $scope.UBDetailsInfo.ExternalCauseofInjuryObj[1].Code = ditem.ICD10CODE || "";
                        $scope.UBDetailsInfo.ExternalCauseofInjuryObj[1].PresentonAdmission = "Y";
                    }
                    else if (ditem.Type === "C" && ditem.DiagnosisId != 0) {
                        $scope.UBDetailsInfo.PatientsReasonforVisitObj.Reason3 = ditem.ICD10CODE || "";
                        $scope.UBDetailsInfo.ExternalCauseofInjuryObj[2].Code = ditem.ICD10CODE || "";
                        $scope.UBDetailsInfo.ExternalCauseofInjuryObj[2].PresentonAdmission = "Y";
                    }
                });
            });
        }
        if (getformdetails.BillingDetail.length > 0) {
            angular.forEach($scope.UBDetailsInfo.OtherProcedure, function (oitem) {
                angular.forEach(getformdetails.BillingDetail, function (ditem, index) {
                    if (index + 1 === oitem.Sno && ditem.OrganizationProcedureId != 0) {
                        oitem.Code = ditem.ProcedureCode || "";
                        oitem.Date = $filter("date")(ditem.Service, "yyyy-MM-dd");
                    }
                });
            });


            $scope.UBDetailsInfo.PrincipalProcedure.Code = getformdetails.BillingDetail[0].ProcedureCode || "";
            $scope.UBDetailsInfo.PrincipalProcedure.Date = $filter("date")(getformdetails.BillingDetail[0].Service, "yyyy-MM-dd");
        }


        if ($scope.DoctorObj != "") {
            $scope.UBDetailsInfo.OperatingProviderObj.NPI = $scope.DoctorObj.NPI || "";
            $scope.UBDetailsInfo.OperatingProviderObj.QUAL = $scope.DoctorObj.UserTaxId || "";
            $scope.UBDetailsInfo.OperatingProviderObj.LastName = $scope.DoctorObj.LastName || "";
            $scope.UBDetailsInfo.OperatingProviderObj.FirstName = $scope.DoctorObj.FirstName || "";

            $scope.UBDetailsInfo.CodeFieldObj[1].billingprovidertaxonomy1 = $scope.DoctorObj.NPI || "";
        }

        $scope.GetUBinfoPrint();
    }

    $scope.GetUBinfoPrint = function () {


        //$scope.UBDetailsInfo = eHnoteCacheStorageService.GetUBStorageStructure();

        //var discharTime = today + "T" + "15:00:00";
        //$scope.UBDetailsInfo.Appointment.DischargeHour = discharTime;
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

        // $scope.UBDetailsInfo.OtherDiagnosisandPOA_Firstrow = $scope.UBDetailsInfo.OtherDiagnosisandPOA_Firstrow || [];

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
        var innerContents = document.getElementById('US_04print').innerHTML;
        // var divtable = document.getElementById('SummaryViewInUB').innerHTML;
        // var HtmlTableUB = document.getElementById('HtmlTableUB').innerHTML;
        // var divtablearray = htmlToPdfmake(divtable);
        // var HtmlTableUBarray = htmlToPdfmake(HtmlTableUB);
        // var content = [];
        // content = HtmlTableUBarray || [];
        // if (divtablearray.length > 0) {
        //     angular.forEach(divtablearray, function (item) {
        //         content.push(item);
        //     });

        // }

        //var docDefinition = {
        //    content: content,
        //    defaultStyle: {
        //        font: 'Roboto'
        //    }
        //};
        //pdfMake.createPdf(docDefinition).print();

        var popupWinindow = window.open('', 'scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
        popupWinindow.document.open();
        popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()" class="bodyheightprint">' + innerContents + '</body></html>');
        popupWinindow.document.close();

        //var popupWin = window.open('', '_blank', 'width=300,height=300');
        //popupWin.document.open();
        //popupWin.document.write(innerContents);
        //popupWin.document.close();


        //html2canvas(document.getElementById('US_04print')).then(function (canvas) {
        //    var data = canvas.toDataURL("image/png");
        //    var docDefinition = {
        //        content: [{
        //            image: data
        //        }]
        //    };
        //    pdfMake.createPdf(docDefinition).open();
        //});
    }

    $scope.ConsultationItems = [];
    $scope.LoadConsultationOrders = function () {
        eHnoteSettingsDataService.GetConsultationAdvicedOrderBillItems($scope.appointmentinfo.AppointmentId, $scope.appointmentinfo.HospitalId).then(function (response) {
            console.log(response);
            if (response.data.status == "Success") {


                response.data.InvestigationsDetails = response.data.InvestigationsDetails || [];
                response.data.ProceduresDetails = response.data.ProceduresDetails || [];
                response.data.SurgeriesDetails = response.data.SurgeriesDetails || [];

                if (response.data.InvestigationsDetails.length === 0 && response.data.ProceduresDetails.length === 0 && response.data.SurgeriesDetails.length === 0) {
                    alertify.error("No Final Orders Added in the Charting");
                    return false;
                }
                $scope.ConsultationItems = response.data;

                $scope.Investigations = $scope.ConsultationItems.InvestigationsDetails;

                //$scope.DiagArrayList = [];
                //if ($scope.Investigations.length > 0) {
                //    angular.forEach($scope.Investigations, function (item) {
                //        if (item != "") {
                //            angular.forEach(item.DiagnosisList, function (item1) {
                //                $scope.DiagArrayList.push(item1);
                //            });
                //        }
                //    });
                //}

                $scope.Procedures = $scope.ConsultationItems.ProceduresDetails;

                //if ($scope.Procedures.length > 0) {
                //    angular.forEach($scope.Procedures, function (item) {
                //        if (item != "") {
                //            angular.forEach(item.DiagnosisList, function (item1) {
                //                $scope.DiagArrayList.push(item1);
                //            });
                //        }
                //    });
                //}

                $scope.Surgeries = $scope.ConsultationItems.SurgeriesDetails;

                //if ($scope.Surgeries.length > 0) {
                //    angular.forEach($scope.Surgeries, function (item) {
                //        if (item != "") {
                //            angular.forEach(item.DiagnosisList, function (item1) {
                //                $scope.DiagArrayList.push(item1);
                //            });
                //        }
                //    });
                //}


                $scope.ConsultDetailsArray = _.uniq($scope.DiagArrayList, false, function (p) { return p.DiagnosisId; });

                $scope.ConsultationDetails = [];
                $scope.AllConsultDetails = $scope.ConsultationDetails.concat($scope.Surgeries, $scope.Investigations, $scope.Procedures);

                //$scope.AddDiagnosisName();
                $scope.addConsultation();
                //console.log($scope.ConsultationItems);
            }
        }, function (err) {
            console.log(err);
            alertify.error("Getting Failed");
        });
    };

    $scope.addConsultation = function () {


        angular.forEach($scope.AllConsultDetails, function (item) {
            var index = $scope.mainBillingObject.BillingDetail.length;
            index = parseInt(index);

            $scope.pushtoBill(item, $scope.mainBillingObject.BillingDetail[index - 1]);
        });
    };

    //$scope.AddDiagnosisName = function () {
    //    angular.forEach($scope.ConsultDetailsArray, function (item) {
    //        if (item != "") {
    //            $scope.DiagnosisListArray.push(item);
    //        }

    //        $scope.onselectDiagnosisitem(item, $scope.DiagnosisListArray);
    //    });
    //};
    //$scope.ShowUBPrint = false;
    //$scope.GetUBinfoPrint = function () {
    //    $scope.ShowUBPrint = true;;
    //}

    /*$scope.GetUBinfoPrint = function() {
        var divToPrint = document.getElementById('US_04print');
        var htmlToPrint = '' +
            '<style type="text/css">' +
            'table th, table td {' +
            'border:1px solid #000;' +
            'padding;0.5em;' +
            '}' +
            '</style>';
        htmlToPrint += divToPrint.outerHTML;
        var newWin = window.open("");
        newWin.document.write(htmlToPrint);
        newWin.print();
        newWin.close();
    }*/

    $scope.changePaymentType = function (item) {
        if (item.PatientBillTypeId == 1 || item.PatientBillTypeId == "1") {
            item.PaymentReasonId = 3;
            item.PaymentReasonobj = $filter("filter")($scope.PaymentReasonList, { "AdjustmentCodeId": 3 })[0];
        }
    };

    /* Ledger Screen functionality */
    $scope.GetPatientInvoiceslist = function (pagenumber) {
        $scope.PatientInvoiceSerachObj.PageNumber = pagenumber || 1;
        $scope.ShowDuePaymentAmountView = false;
        $scope.PatientInvoiceSerachObj.IsShowAllDueBills = false;
        $scope.ShowBillViewList = false;

        var params = {
            "FromDate": $filter("usdateFormatter")($scope.PatientInvoiceSerachObj.FromDate, "-"),
            "ToDate": $filter("usdateFormatter")($scope.PatientInvoiceSerachObj.ToDate, "-"),
            "SearchText": "",
            "PatientId": $scope.cacheStorageItem.PatientID,
            "PageSize": $scope.PatientInvoiceSerachObj.PageSize || 10,
            "PageNumber": $scope.PatientInvoiceSerachObj.PageNumber || 1,
            "BranchId": 3,
            "InvoiceId": $scope.PatientInvoiceSerachObj.InvoiceId || ""
        };
        eHnotePatientDataService.GetAllPatientInvoiceslist(params).then(function (resp) {
            if (resp.data.status == "Success") {
                if (resp.data.Invoices.length > 0) {
                    $scope.PatientInvoicesList = resp.data.Invoices || [];
                    angular.forEach($scope.PatientInvoicesList, function (pitem) {
                        pitem.IsShowItems = false;
                    });
                    $scope.PatientInvoiceSerachObj.Count = resp.data.count || 0;
                    $scope.SelectedInvoiceObj = "";
                    //if ($scope.PatientInvoicesList.length == 1) {
                    //    $scope.onClickParticulerInvoice($scope.PatientInvoicesList[0]);
                    //}
                    $scope.onClickParticulerInvoice($scope.PatientInvoicesList[0]);
                }
            } else {
                alertify.error(resp.data.Message);
            }
        }, function (error) {

        });
    }
    $scope.ClearSearch = function () {
        $scope.PatientInvoiceSerachObj = angular.copy($scope.GetPatientInvoiceSerachObj());
        $scope.SelectedInvoiceObj = "";
        $scope.GetPatientInvoiceslist();
    }
    $scope.onClickParticulerInvoice = function (item) {
        angular.forEach($scope.PatientInvoicesList, function (pitem) {
            pitem.IsShowItems = false;
        });
        item.IsShowItems = true;

        eHnotePatientDataService.GetPatientInvoiceItemsbyId(item.BillingHistoryId, 0).then(function (resp) {
            if (resp.data != undefined) {
                $scope.SelectedInvoiceObj = resp.data || "";
                $scope.SelectedInvoiceObj.BillingDetails = $scope.SelectedInvoiceObj.BillingDetails || [];

                //$scope.mainBillingObject = angular.copy($scope.getMainBillingObject());
                $scope.mainBillingObject.BillingDetail = [];
                $scope.mainBillingObject.Mode = "Add";
                restructureInvoiceItems(resp, item);
                $scope.DuePaymentObj = angular.copy($scope.GetPaymentObject());
                $scope.DuePaymentObj.PaymentModeobj = "";
                $scope.DuePaymentObj.PaymentReasonobj = "";
                $scope.mainBillingObject.Payments = [];
                $scope.mainBillingObject.BillingProviderId = resp.data.BillingProviderId;
                $scope.mainBillingObject.RenderingProviderId = resp.data.RenderingProviderId;
                $scope.mainBillingObject.BillingHistoryId = resp.data.BillingHistoryId;
                $scope.ShowDuePaymentAmountView = false;
                $scope.ShowBillViewList = false;

                angular.forEach($scope.mainBillingObject.BillingDetail, function (pitem) {
                    var dueAmount = (pitem.ProcedureCost * pitem.Multiplyfactor) - pitem.TotalAmountReceived;
                    pitem.ItemDueAmount = dueAmount;
                });

            } else {
                console.log(resp);
            }
        }, function (err) {
            console.log(err);
        });
    };
    $scope.addPaymentObj = function (item) {
        item.Amount = item.Amount || null;
        if (item.Amount == null) {
            alertify.error("Enter Amount");
            return false;
        }
        item.PaymentModeId = item.PaymentModeId || 0;
        if (item.PaymentModeId == 0) {
            alertify.error("Select Payment Mode");
            return false;
        }
        var totalbilledNow = 0;
        if (item.Edit == true) {
            angular.forEach($scope.mainBillingObject.Payments, function (bitem, index) {
                if (index != item.IndexNo) {
                    totalbilledNow += parseFloat(bitem.Amount) || 0;
                }
            });
        } else {
            angular.forEach($scope.mainBillingObject.Payments, function (bitem) {
                totalbilledNow += parseFloat(bitem.Amount) || 0;
            });
        }

        totalbilledNow += parseInt(item.Amount);
        var checkBillAmount = checkRoundVal($scope.mainBillingObject.TotalNetAmount) - checkRoundVal($scope.mainBillingObject.PreviousPaidAmount);
        if (totalbilledNow > checkBillAmount) {
            alertify.error("Please enter less than or equal to Total Balance");
            return false;
        }

        if (item.Edit == true) {
            $scope.mainBillingObject.Payments[item.IndexNo] = angular.copy(item);
        } else {
            $scope.mainBillingObject.Payments.push(angular.copy(item));
        }
        $scope.changeAmount(item);

        $scope.DuePaymentObj = angular.copy($scope.GetPaymentObject());
        $scope.DuePaymentObj.PaymentModeobj = "";
        $scope.DuePaymentObj.PaymentReasonobj = "";
        $scope.DuePaymentObj.Date = $filter("date")(new Date(), "MM-dd-yyyy");
    };
    $scope.ChangeDuePaymentMode = function (MainObj) {
        MainObj.PaymentModeobj = MainObj.PaymentModeobj || "";
        if (MainObj.PaymentModeobj != "") {
            MainObj.PaymentModeobj = MainObj.PaymentModeobj;
            MainObj.PaymentModeId = MainObj.PaymentModeobj.PaymentModeId;
        } else {
            MainObj.PaymentModeId = 0;
        }
    };
    $scope.ChangeDueReasonStatus = function (MainObj) {
        MainObj.PaymentReasonobj = MainObj.PaymentReasonobj || "";
        if (MainObj.PaymentReasonobj != "") {
            MainObj.PaymentReasonobj = MainObj.PaymentReasonobj;
            MainObj.PaymentReasonId = MainObj.PaymentReasonobj.PaymentReasonId;
        } else {
            MainObj.PaymentReasonId = 0;
        }
    };
    $scope.EditDuePayment = function (obj, index) {
        $scope.DuePaymentObj = angular.copy($scope.GetPaymentObject());
        $scope.DuePaymentObj = angular.copy(obj);
        $scope.DuePaymentObj.Edit = true;
        $scope.DuePaymentObj.IndexNo = index;
        $scope.DuePaymentObj.PaymentModeobj = $filter("filter")($scope.masterPaymentModes, { "PaymentModeId": obj.PaymentModeobj.PaymentModeId })[0];
        $scope.DuePaymentObj.PaymentReasonobj = $filter("filter")($scope.PaymentReasonList, { "AdjustmentCodeId": obj.PaymentReasonobj.AdjustmentCodeId })[0];
        $scope.DuePaymentObj.Date = $filter("date")(obj.Date, "MM-dd-yyyy");
        $scope.DuePaymentObj.PatientBillTypeId = obj.PatientBillTypeId;
        $scope.DuePaymentObj.TraceId = obj.TraceId;
        $scope.DuePaymentObj.Amount = obj.Amount;
        $scope.DuePaymentObj.Adjustment = obj.Adjustment;
    }

    $scope.ClosePopup = function () {
        $scope.modalpayorInstance.dismiss("cancel");
        $scope.mainBillingObject = angular.copy($scope.getMainBillingObject());
        if ($scope.mainBillingObject.BillingDetail.length == 0) {
            var treatObject = getNewTreatmentObject();
            $scope.mainBillingObject.BillingDetail.push(treatObject);
        }
        $scope.BillUpdateOnLegderpopup = false;
    };
    $scope.ChangeToDueList = function (checked) {
        if (checked == true) {
            var InvoicesList = angular.copy($scope.PatientInvoicesList);
            $scope.PatientInvoicesList = [];
            angular.forEach(InvoicesList, function (pitem) {
                if (pitem.TotalBalance != 0) {
                    pitem.IsShowItems = false;
                    $scope.PatientInvoicesList.push(pitem);
                }
            });
            $scope.SelectedInvoiceObj = "";

        } else {
            $scope.GetPatientInvoiceslist();
        }
        $scope.ShowDuePaymentAmountView = false;
        $scope.ShowBillViewList = false;
    }
    $scope.AddpaymentShow = function () {
        $scope.ShowDuePaymentAmountView = true;

        $scope.DuePaymentObj.PaymentReasonId = 3;
        if ($scope.PaymentReasonList.length > 0) {
            $scope.DuePaymentObj.PaymentReasonobj = $filter("filter")($scope.PaymentReasonList, { "AdjustmentCodeId": 3 })[0];
        }
    }
    $scope.onClickViewPaymentList = function () {
        $scope.ShowBillViewList = !$scope.ShowBillViewList;
    }
    $scope.onClickPaymentClear = function () {
        $scope.mainBillingObject.Payments = [];
        $scope.ShowDuePaymentAmountView = false;
        $scope.ShowBillViewList = false;
    }

    /* Ledger Screen functionality End  */

    $scope.continuetoCheckInsuranceEligibility = function (item) {
        if ($scope.PatientDetailsInfo.FirstName === "") {
            alertify.error("Please Enter Patient First Name");
            return;
        }
        //if ($scope.PatientDetailsInfo.FirstName.length < 3) {
        //    alertify.error("Please Enter Patient First Name");
        //    return;
        //}
        $scope.PatientDetailsInfo.LastName = $scope.PatientDetailsInfo.LastName || "";
        if ($scope.PatientDetailsInfo.LastName === "") {
            alertify.error("Please Enter Patient Last Name");
            return;
        }
        if ($scope.PatientDetailsInfo.DOB === "") {
            alertify.error("Please Enter Patient DOB");
            return;
        }

        if ($scope.PatientDetailsInfo.Gender === "") {
            alertify.error("Please Enter Patient Gender");
            return;
        }
        item.PatientSSN = item.PatientSSN || null;
        if (item.PatientSSN === null) {
            alertify.error("Please Enter Valid SSN Number");
            return;
        }


        var SSNno = angular.copy(item.PatientSSN) || "";
        SSNno = SSNno.toString();
        if ((SSNno == "") || (SSNno != "" && SSNno.length !== "" && SSNno.length < 9)) {
            alertify.error("Please Enter Valid SSN Number");
            return;
        }

        item.PlanId = item.PlanId || null;
        if (item.PlanId === null) {
            alertify.error("Please Select Plan");
            return;
        }
        item.PlanObj.PolicyId = item.PlanObj.PolicyId || null;
        if (item.PlanObj.PolicyId === null) {
            alertify.error("Please Enter Policy ID");
            return;
        }

        if (item.PlanObj.GlobalPayorId === null || item.PlanObj.GlobalPayorId === undefined || item.PlanObj.GlobalPayorId === "") {
            alertify.error("Invalid Payer ID. Please check and try again.");
            return;
        }
        //item.PlanObj.GroupId = item.PlanObj.GroupId || null;
        //if (item.PlanObj.GroupId === null) {
        //    alertify.error("Please Enter Group");
        //    return;
        //}

        var params = {
            "SNO": 1,
            "PatientAppointmentInsuranceDetailId": item.PatientAppointmentInsuranceDetailId || 0,
            "AppointmentId": 0,
            "AppointmentDate": $filter('date')(new Date($scope.CurreDate), "yyyy-MM-dd"),
            //"AppointmentInsuranceNumber": $scope.PatientInsuranceObj.PatientInsuranceControlNumber,
            "AppointmentInsuranceNumber": 0,
            "DoctorName": doctorinfo.doctordata.User[0].FullName || "",
            "UserProviderId": doctorinfo.doctordata.User[0].UserProviderId || "",
            "HospitalId": $scope.HospitalId,
            "AppointmentTOSCodes": [

            ],
            "NPI": doctorinfo.doctordata.User[0].NPI || 0,
            "TaxId": doctorinfo.doctordata.User[0].UserTaxId || "",
            "ProviderCode": "H",
            //"serviceProviderNumber": $scope.selectedDocObject.selectedPerson.serviceProviderNumber,
            "serviceProviderNumber": 0,
            "HospitalName": doctorinfo.doctordata.UserAddress[0].ClinicName,
            "AppointmentTime": $filter("date")(new Date(), "HH:mm"),
            "AppointmentPatientTypeId": 1,
            "AppointmentPatientType": "New Patient",
            "PatientInsuranceDetailId": item.PatientInsuranceDetailId,
            "PatientId": $scope.cacheStorageItem.PatientID,
            "PatientMrNo": $scope.PatientDisplayID,
            "Gender": $scope.PatientDetailsInfo.Gender,
            "DOB": $scope.PatientDetailsInfo.DOB,
            "FirstName": $scope.PatientDetailsInfo.FirstName,
            "LastName": $scope.PatientDetailsInfo.LastName,
            "TitleId": $scope.PatientDetailsInfo.TitleId,
            "Title": $scope.PatientDetailsInfo.Title,
            "PatientName": $scope.PatientDetailsInfo.FirstName + "" + $scope.PatientDetailsInfo.LastName,
            "PatientMobile": $scope.PatientDetailsInfo.ContactInfo.MobileNumber,
            "PatientContact": $scope.PatientDetailsInfo.ContactInfo.MobileNumber,
            "HomeNumber": $scope.PatientDetailsInfo.ContactInfo.HomeNumber,
            "HomeAreaCode": $scope.PatientDetailsInfo.ContactInfo.HomeAreaCode,
            "HomeCountryCode": $scope.PatientDetailsInfo.ContactInfo.HomeCountryCode,
            "OfficeNumber": $scope.PatientDetailsInfo.ContactInfo.OfficeNumber,
            "OfficeAreaCode": $scope.PatientDetailsInfo.ContactInfo.OfficeAreaCode,
            "OfficeCountryCode": $scope.PatientDetailsInfo.ContactInfo.OfficeCountryCode,
            "PatientGender": $scope.PatientDetailsInfo.Gender,
            "PatientSSN": $scope.PatientDetailsInfo.SocialSecurityNo,
            "PayorId": item.PayorId,
            "PayorName": item.PayorName,
            "PlanName": item.PlanName,
            "PlanTypeId": item.PlanObj.PlanTypeId,
            "PlanTypeName": item.PlanObj.PlanTypeName || "",
            "PlanId": item.PlanId,
            "InsuranceEffectiveDate": item.PayorObj.EffectiveDate || "",
            "InsuranceExpiryDate": item.PayorObj.ExpiryDate || "",
            "RelationShipId": item.PayorObj.RelationShipId,
            "RelationName": item.PayorObj.RelationName,
            "VerifiedDate": item.PayorObj.VerifiedDate || "",
            "Coinsurance": item.PayorObj.Coinsurance || null,
            "VisitCopay": item.PayorObj.VisitCopay || null,
            "CoverageId": item.PlanObj.CoverageId || 1,
            "InsuredPersonSSN": item.InsuredPersonSSN,
            "PolicyHolder": item.PolicyHolder || "",
            "InsuranceStatusId": 1,
            "InsuredPersonFirstName": item.PayorObj.InsuredPersonFirstName,
            "InsuredPersonDOB": item.PayorObj.InsuredPersonDOB,
            "InsuredPersonGenderID": item.PayorObj.InsuredPersonGenderID,
            "InsuranceStatusName": "Active",
            "PolicyHolderName": item.PayorObj.InsuredPersonGenderID || "",
            "GroupName": item.PlanObj.GroupName || "",
            "StatusId": item.PlanObj.StatusId || 1,
            "StatusName": "Not Verified",
            "MasterPayorId": item.PayorObj.GlobalPayorId,
            "OrgEligibilityClaimNumber": item.PayorObj.PatientInsuranceControlNumber,
            "PatientCoPayAmount": null,
            "PatientCoPayPercentage": null,
            "SocialSecurityNo": $scope.PatientDetailsInfo.SocialSecurityNo,
            "AddressId": null,
            "CityName": null,
            "StateName": null,
            "Pin": null,
            "PlanBeginDate": null,
            "PlanEndDate": null,
            "PolicyId": item.PlanObj.PolicyId,
            "GroupId": item.PlanObj.GroupId,
            "PlanNumber": null,
            "isSelected": false,
            "isVerified": false,
            "IsShowEligibility": false,
            "ProviderID": doctorinfo.doctordata.User[0].UserProviderId,
            "ServiceTypeobj": "",
            "SerciceFrom": $filter('date')(new Date($scope.CurreDate), "yyyy-MM-dd"),
            "ServiceTo": $filter('date')(new Date($scope.CurreDate), "yyyy-MM-dd"),
            "MemberId": "",
            "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "serviceTypeCodes": [

            ]
        };



        eHnoteInsuranceService.checkPatientInsuranceEligibilityById(params, onSuccess, onError);
        function onSuccess(resp) {
            resp.errors = resp.errors || [];
            if (resp.errors.length > 0) {

                var eparams = {
                    "UserId": $scope.UserId,
                    "AppointmentInsuranceDetailId": 0,
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

                var PlanStatusCode = "", PlanStatus = "", ResponseJson = "";

                if (resp.planStatus.length > 0) {
                    PlanStatusCode = resp.planStatus[0].statusCode;
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
                    //"PatientId": item.PatientId,
                    "PatientId": $scope.patientid,
                    "VerificationDate": $filter("date")(new Date(), "yyyy-MM-dd"),
                    "AppointmentInsuranceDetailId": 0,
                    "PatientInsuranceDetailId": item.PatientInsuranceDetailId || "",
                    "StatusId": insStatusId,
                    "OrgEligibilityClaimNumber": item.PatientInsuranceControlNumber || "",
                    "PlanStatusCode": PlanStatusCode,
                    "IdentifierId": item.IdentifierId,
                    "PlanStatus": PlanStatus,
                    "PatientCoPayAmount": 250,
                    "PatientCoPayPercentage": 0,
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
                //                "CoverageLevel": bitem.coverageLevel || '',
                //                "inPlanNetworkIndicator": bitem.inPlanNetworkIndicator || "No",
                //                "DeleteInd": false,
                //            }

                //            obj.BenifitCoverageDetailsList.push(sobj);
                //        });

                //    });
                //}

                console.log(JSON.stringify(obj));

                eHnoteInsuranceService.UpdatePatientInsuranceEligibilityResponse(obj).then(function (response) {
                    if (response.data.status === 'Success') {
                        //item.IsVerified = true;
                        //item.PatientAppointmentInsuranceDetailId = response.data.AppointmentInsuranceDetailId || 0;

                        eHnoteInsuranceService.getPatientInsuranceDtls($scope.cacheStorageItem.PatientID, 1).then(function (response) {
                            if (response.data !== undefined) {
                                $scope.mainBillingObject = response.data.rows;
                                $scope.patientInsurancesArray = response.data.rows;
                                console.log("INS_4");
                                $scope.mainBillingObject.ClaimActionObj = $filter("filter")($scope.billPaymentByModes, { "BillPaymentTypeId": 1 })[0];
                                if ($scope.PatientInsuranceItems.length > 0) {
                                    $scope.mainBillingObject.ClaimActionObj = $filter("filter")($scope.billPaymentByModes, { "BillPaymentTypeId": 2 })[0];
                                }
                            }

                        });
                    }


                });
            }

        }
        function onError(reponse) {
        }

    }

    $scope.CheckVerifyEligibityBll = function (item) {
        if ($scope.cacheStorageItem.PatientID === 0) {

        } else {
            $scope.continuetoCheckInsuranceEligibility(item);
        }
    }



    $scope.BillingPopUpClose = function () {
        $rootScope.mInstanceAdd.dismiss("cancel");
    };

    $scope.saveClaimVerify = function () {
        $rootScope.mInstanceAdd.close("save");
    };

    $scope.clearBillingClaimVerify = function () {
        $rootScope.mInstanceAdd.close("clear");
    };


    $scope.gotoSuperBillRemarksPopupNew = {
        templateUrl: 'ShowSuperBillPopovertemplate.html'
    };


    $scope.showInsurancePlanAlert = function (subitem, MainItem) {

        $scope.obj = {
            "item": subitem,
            "mainitem": MainItem
        }

        $scope.mInstanceAdd2 = $uibModal.open({
            "templateUrl": "PlanAlertBox.html",
            "backdrop": "static",
            "scope": $scope,
            "resolve": {
                "Selectobj": function () { return $scope.obj; },
            },
            "keyboard": true,
            "size": "md",
            "controller": function ($scope, $uibModal, $uibModalInstance, Selectobj) {

                console.log(Selectobj);
                $scope.planRemarks = "";

                if (Selectobj.item != undefined) {
                    $scope.planRemarks = Selectobj.item.Remarks;
                }

                $scope.onClickSelectedOffline = function () {
                    $uibModalInstance.dismiss("cancel");
                }
                $scope.onClickClosepopup = function () {
                    $uibModalInstance.dismiss("cancel");
                }
            }
        });
    }


    $scope.GetProblemsFromRcopia = function (val) {
        var searchvalue = val || "";

        if (searchvalue != "") {
            var req = {
                "VendorName": "Appolo Pharmacy",
                "VendorPassword": "abc123",
                "searchText": val || "nexium",
                "codeType": "ICD10",
                "UserId": $scope.UserId || null,
                "OrganizationId": $scope.HospitalId || null,
                "SearchType": "search_problem",
                "RcopiaVendorAccountName": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountName,
                "RcopiaVendorAccountPassword": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountPassword,
                "RcopiaPracticeId": doctorinfo.doctordata.UserAddress[0].RcopiaPracticeId
            }
            return eHnoteConditionsDataService.getProblemsDataFromRcopia(req).then(function (resp) {
                console.log(resp);
                if (resp.data.ProblemList !== undefined) {
                    return resp.data.ProblemList.map(function (item) {
                        return item;
                    });
                }
            });
        }
    }

    $scope.navtoBillingAppointmentNotes = function (item) {
        var obj = {
            "apptitem": appointmentinfo,
            "UserId": $scope.UserId,
            "HospitalId": $scope.HospitalId
        }
        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/PatientBillingNotes.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            "size": "lg",
            "resolve": {
                "mainObject": function () { return obj; },
            },
            "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService, mainObject) {

                $scope.ApptSubmitText = 'Save';
                console.log(mainObject);
                $scope.AppointmentId = mainObject.apptitem.AppointmentID;
                $scope.UserId = mainObject.UserId;
                $scope.PatientName = mainObject.apptitem.PatientName;
                $scope.VistReasonName = mainObject.apptitem.VisitReason;
                $scope.DoctorName = mainObject.apptitem.SecondUserFullName;

                $scope.AppointmentNotes = "";
                $scope.closeuibpopup = function () {
                    $uibModalInstance.dismiss("cancel");
                };

                $scope.AppointmentNotesArray = [];
                $scope.addNotestoAppointment = function (Type) {
                    if ($scope.selectedAppointmentObject.NotesTab == 1) {
                        if ($scope.AppointmentNotes === "") {
                            alertify.error("please enter notes");
                            return false;
                        }


                        if ($scope.ApptSubmitText == 'Update') {
                            $scope.obj = {
                                "AppointmentNoteId": $scope.AppointmentNoteId,
                                "AppointmentId": $scope.AppointmentId,
                                "Notes": $scope.AppointmentNotes || "",
                                "DeleteInd": "N",
                                "CreatedBy": "",
                                "UserId": $scope.UserId,
                                "CreatedDt": $filter('date')(new Date(), 'MM-dd-yyyy,hh:mm a')
                            }

                        } else {
                            $scope.obj = {
                                "AppointmentNoteId": 0,
                                "AppointmentId": $scope.AppointmentId,
                                "Notes": $scope.AppointmentNotes || "",
                                "DeleteInd": "N",
                                "CreatedBy": "",
                                "UserId": $scope.UserId,
                                "CreatedDt": $filter('date')(new Date(), 'MM-dd-yyyy,hh:mm a')
                            }
                        }
                        $scope.AppointmentNotesArray2 = [];

                        $scope.AppointmentNotesArray2.unshift($scope.obj);

                        var params = {
                            "AppointmentId": $scope.AppointmentId,
                            "UserId": $scope.UserId,
                            "AppointmentNotes": $scope.AppointmentNotesArray2,
                            "OtherNotes": $scope.selectedAppointmentObject.OtherNotes || "",
                        };
                    } else {

                        var params = {
                            "AppointmentId": $scope.AppointmentId,
                            "UserId": $scope.UserId,
                            "OtherNotes": $scope.selectedAppointmentObject.OtherNotes || "",
                            //"OtherNotesCreatedBy": $scope.selectedAppointmentObject.OtherNotesCreatedBy || "",
                            //"OtherNotesCreatedDt": $scope.selectedAppointmentObject.OtherNotesCreatedDt || null,

                        };
                    }
                    console.log(params);

                    eHnoteMainAppointmentService.AddUpdateAppointmentNotesinPopup(params).then(function (resp) {
                        console.log(resp);
                        if (resp.data.status == "Success") {
                            if (Type == "Delete" && $scope.selectedAppointmentObject.NotesTab == 2) {
                                alertify.success("Routslip Notes deleted successfully");
                            }
                            else if ($scope.selectedAppointmentObject.NotesTab == 1) {
                                alertify.success("Appointment Notes Added Successfully");
                            } else if ($scope.selectedAppointmentObject.NotesTab == 2) {
                                alertify.success("Routslip Notes added successfully");
                            }

                            $scope.AppointmentNotes = "";
                            $scope.getApptAdditionalDetails();
                        }
                        $scope.ApptSubmitText = 'Save';
                    }, function (err) {
                        console.log(err);
                        alertify.error("Getting Failed");
                    });


                    // $uibModalInstance.close("save");
                };

                $scope.ClearDetails = function () {
                    $uibModalInstance.close("save");
                }

                $scope.clearNotestoAppointment = function () {
                    $scope.AppointmentNotes = "";
                    $scope.ApptSubmitText = 'Save';
                }

                $scope.getApptAdditionalDetails = function () {

                    eHnoteMainAppointmentService.getAdditionalApptDetailsById($scope.AppointmentId).then(function (resp) {

                        resp.data = resp.data || [];
                        console.log(resp);

                        if (resp.data.length > 0) {
                            $scope.PatientName = resp.data[0].Patient.FullName || '';
                            $scope.PatientDisplayId = resp.data[0].Patient.PatientDisplayId || '';
                            $scope.PatientGender = resp.data[0].Patient.Gender || '';
                            $scope.PatientAge = resp.data[0].Patient.Age || null;
                            $scope.PatientDOB = resp.data[0].Patient.DOB || '';
                            $scope.PatientImageS3URL = resp.data[0].Patient.S3URL || '';

                            $scope.AppointmentNotesArray = resp.data[0].AppointmentNotes;
                            /*  $scope.selectedAppointmentObject.OtherNotes = resp.data[0].Patient.OtherNotes || "";*/
                            if (resp.data[0].AppointmentDetails.length > 0) {
                                $scope.selectedAppointmentObject.OtherNotes = resp.data[0].AppointmentDetails[0].OtherNotes || "";
                                $scope.selectedAppointmentObject.OtherNotesCreatedBy = resp.data[0].AppointmentDetails[0].ModifiedBy || "";
                                $scope.selectedAppointmentObject.OtherNotesCreatedDt = resp.data[0].AppointmentDetails[0].ModifiedDt || "";
                            }
                        } else {
                            $scope.AppointmentNotesArray = [];
                        }
                    }, function (err) {
                        console.log(err);
                        alertify.error("Getting data failed");
                    });
                }

                $scope.getApptAdditionalDetails();
                $scope.DeleteApptNote = function (item, index) {
                    if ($scope.UserId == item.UserId) {
                        if (item.AppointmentNoteId == 0) {
                            $scope.AppointmentNotesArray.splice(index, 1);
                        } else {
                            angular.forEach($scope.AppointmentNotesArray, function (Aitem) {
                                if (Aitem.AppointmentNoteId == item.AppointmentNoteId) {
                                    Aitem.DeleteInd = "Y";
                                }
                            });
                            var params = {
                                "AppointmentId": $scope.AppointmentId,
                                "UserId": $scope.UserId,
                                "AppointmentNotes": $scope.AppointmentNotesArray,
                                "OtherNotes": $scope.selectedAppointmentObject.OtherNotes || "",
                            };

                            console.log(params);

                            eHnoteMainAppointmentService.AddUpdateAppointmentNotesinPopup(params).then(function (resp) {
                                console.log(resp);
                                if (resp.data.status == "Success") {
                                    alertify.success("Deleted Successfully");
                                    $scope.ApptSubmitText = 'Save';
                                    $scope.AppointmentNotes = "";
                                    $scope.getApptAdditionalDetails();
                                }
                            }, function (err) {
                                console.log(err);
                                alertify.error("Getting Failed");
                            });

                        }
                    }
                }
                $scope.EditApptNote = function (item, index) {
                    $scope.AppointmentNotes = item.Notes;
                    $scope.AppointmentNoteId = item.AppointmentNoteId
                    $scope.ApptSubmitText = 'Update';


                }
                $scope.selectedAppointmentObject = {
                    "NotesTab": 1,
                    "OtherNotes": "",
                    "Routeslipnotes": "",
                    "OtherNotesCreatedBy": "",
                    "OtherNotesCreatedDt": null,
                }
                $scope.Notestabchanges = function (Type) {
                    $scope.selectedAppointmentObject.NotesTab = Type || 1;
                }
                $scope.AddOtherNotes = function () {
                    if ($scope.selectedAppointmentObject.Routeslipnotes == '') {
                        alertify.error("Please Enter Notes");
                        return false;
                    }

                    $scope.selectedAppointmentObject.OtherNotes = $scope.selectedAppointmentObject.Routeslipnotes || '';
                    $scope.selectedAppointmentObject.OtherNotesCreatedDt = $filter('date')(new Date(), "MM-dd-yyyy h:mm a") || "";
                    $scope.selectedAppointmentObject.OtherNotesCreatedBy = $scope.DoctorName || "";
                    $scope.selectedAppointmentObject.Routeslipnotes = '';
                    $scope.IsOtherUpdate = false;
                    $scope.addNotestoAppointment();
                }
                $scope.IsOtherUpdate = false;
                $scope.Editothernotes = function () {
                    $scope.selectedAppointmentObject.Routeslipnotes = $scope.selectedAppointmentObject.OtherNotes || '';
                    //$scope.ApptSubmiteText = 'Update';
                    //Mainitem.AppointmentNotesList.splice(index, 1);
                    $scope.selectedAppointmentObject.OtherNotes = '';
                    $scope.IsOtherUpdate = true;
                }
                $scope.DeleteOtherNotes = function () {
                    $scope.selectedAppointmentObject.OtherNotes = '';
                    $scope.selectedAppointmentObject.Routeslipnotes = '';
                    $scope.selectedAppointmentObject.OtherNotesCreatedDt = '';
                    $scope.selectedAppointmentObject.OtherNotesCreatedBy = '';
                    $scope.IsOtherUpdate = false;
                    $scope.addNotestoAppointment("Delete");
                }
                $scope.getOtherNotesLog = function (item) {

                    var obj = {
                        "UserId": $scope.UserId,
                        "AppointmentID": $scope.AppointmentId || 0,

                    }
                    eHnoteMainAppointmentService.GetOtherNotesLog(obj).then(function (resp) {
                        console.log(resp);
                        if (resp.data.Status === 'Success') {
                            if (resp.data.rows.length > 0) {
                                $scope.OtherNotesLogArray = [];
                                $scope.OtherNotesLogArray = angular.copy(resp.data.rows);
                            }
                        }
                    }, function (err) {
                        console.log(err);
                    });

                }
                $scope.OtherNotesLog = {
                    templateUrl: 'templates/uibpopups/OtherNotesLog.html',
                };
            }

        });
        $scope.mInstanceAdd.result.then(function (resp) {
            console.log(resp);
        }, function (cancel) {
        });
    };


    $scope.masterBillingFacilities = [
        { FacilityTypeId: 1, FacilityTypeName: "Outpatient Clinic", FacilityTypeCode: "OPH" },
        { FacilityTypeId: 2, FacilityTypeName: "Ambulatory Surgery Center", FacilityTypeCode: "ASC" },
        { FacilityTypeId: 3, FacilityTypeName: "Physician", FacilityTypeCode: "PHYSICIAN" },
        { FacilityTypeId: 4, FacilityTypeName: "Hospital", FacilityTypeCode: "HOSPITAL" },
        { FacilityTypeId: 5, FacilityTypeName: "Skilled Nursing Facility", FacilityTypeCode: "SNF" },
        { FacilityTypeId: 6, FacilityTypeName: "Urgent Care Center", FacilityTypeCode: "UCC" },
        { FacilityTypeId: 7, FacilityTypeName: "Rehabilitation Facility", FacilityTypeCode: "RF" },
        { FacilityTypeId: 8, FacilityTypeName: "Optical", FacilityTypeCode: "OPT" }
    ];
    $scope.changeBillingFacility = function (Id) {
        var filtredArray = $filter("filter")($scope.masterBillingFacilities, { "FacilityTypeId": Id }, true);
        $scope.mainBillingObject.FacilityType = filtredArray[0].FacilityTypeName;
    }


    $scope.masterBillingAdmissionTypes = [
        { AdmissionTypeId: 1, AdmissionTypeName: "Emergency", AdmissionTypeCode: "EMERGENCY" },
        { AdmissionTypeId: 2, AdmissionTypeName: "Urgent", AdmissionTypeCode: "URGENT" },
        { AdmissionTypeId: 3, AdmissionTypeName: "Elective", AdmissionTypeCode: "ELECTIVE" },
        { AdmissionTypeId: 4, AdmissionTypeName: "Newborn", AdmissionTypeCode: "NEWBORN" },
        { AdmissionTypeId: 5, AdmissionTypeName: "Trauma", AdmissionTypeCode: "TRAUMA" },
        { AdmissionTypeId: 6, AdmissionTypeName: "Neonate", AdmissionTypeCode: "NEONATE" },
        { AdmissionTypeId: 7, AdmissionTypeName: "Information not available", AdmissionTypeCode: "INFO_NOT_AVAILABLE" }
    ];

    $scope.changeBillingAdmissionType = function (Id) {
        var filtredArray = $filter("filter")($scope.masterBillingAdmissionTypes, { "AdmissionTypeId": Id }, true);
        $scope.mainBillingObject.AdmissionType = filtredArray[0].AdmissionTypeName;
    }

    $scope.masterBillingFrequencyTypes = [
        { BillFrequencyId: 0, BillFrequencyName: "Non-payment/zero claims", BillFrequencyCode: "NON_PAYMENT" },
        { BillFrequencyId: 1, BillFrequencyName: "Admit Through Discharge Claim", BillFrequencyCode: "ADMIT_DISCHARGE" },
        { BillFrequencyId: 2, BillFrequencyName: "New Claim", BillFrequencyCode: "NEW_CLAIM" },
        { BillFrequencyId: 3, BillFrequencyName: "Continuing Claim", BillFrequencyCode: "CONTINUING_CLAIM" },
        { BillFrequencyId: 4, BillFrequencyName: "Last Claim", BillFrequencyCode: "LAST_CLAIM" },
        { BillFrequencyId: 5, BillFrequencyName: "Late Charges", BillFrequencyCode: "LATE_CHARGES" },
        { BillFrequencyId: 6, BillFrequencyName: "Replacement Claim", BillFrequencyCode: "REPLACEMENT_CLAIM" },
        { BillFrequencyId: 7, BillFrequencyName: "Adjustment Claim", BillFrequencyCode: "ADJUSTMENT_CLAIM" },
        { BillFrequencyId: 8, BillFrequencyName: "Void/Cancel", BillFrequencyCode: "VOID_CANCEL" }
    ];

    $scope.changeBillingFrequencyType = function (Id) {
        var filtredArray = $filter("filter")($scope.masterBillingFrequencyTypes, { "BillFrequencyId": Id }, true);
        $scope.mainBillingObject.BillTypeFrequency = filtredArray[0].BillFrequencyName;
    }

    $scope.masterBillingStatus = [
        { BillStatusId: 1, BillStatusName: "Not Submitted" },
        { BillStatusId: 2, BillStatusName: "In Progress" },
        { BillStatusId: 3, BillStatusName: "Resolved" },
        { BillStatusId: 4, BillStatusName: "Paid" },
        { BillStatusId: 5, BillStatusName: "Un Paid" }
    ];

    $scope.changeBillingStatus = function (Id) {
        var filtredArray = $filter("filter")($scope.masterBillingStatus, { "BillStatusId": Id }, true);
        $scope.mainBillingObject.BillStatus = filtredArray[0].BillStatusName;
    }

    $rootScope.$on("PatientINsuranceEdittobiller", function (evt) {
        $scope.init();
    });
}]);



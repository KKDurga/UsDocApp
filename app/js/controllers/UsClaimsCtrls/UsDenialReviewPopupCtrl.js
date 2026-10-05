
"use strict";
eHnoteWebApp.controller("UsDenialReviewPopupCtrl", ["$scope", "$uibModalInstance", "$uibModal", "eHnoteInsuranceService", "eHnoteMasterDataService", "$q", "$filter", "datapersistanceFactory", "localStorageFactory", "eHnoteUserAppointmentDataService", "PaymentPostingDataObj", "eHnoteCacheStorageService", "eHnoteUserDataService", "eHnoteMainAppointmentService", "$timeout", "$sce", "alertify", "eHnoteSettingsDataService", "$location", function ($scope, $uibModalInstance, $uibModal, eHnoteInsuranceService, eHnoteMasterDataService, $q, $filter, datapersistanceFactory, localStorageFactory, eHnoteUserAppointmentDataService, PaymentPostingDataObj, eHnoteCacheStorageService, eHnoteUserDataService, eHnoteMainAppointmentService, $timeout, $sce, alertify,eHnoteSettingsDataService, $location) {

    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.UserId = eHnoteMasterDataService.getLoginId();
    $scope.ParenthospitalId = 0;
    $scope.HospitalId = 0;
    $scope.BranchNPI = "";
    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
        $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
        $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
        $scope.BranchNPI = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.Preference.BranchNPI;
    };
    console.log(PaymentPostingDataObj);
    $scope.mainObject = PaymentPostingDataObj.PostingPaymentData || null;
    console.log($scope.mainObject);
    $scope.mainEOBPaymentPostingObj = PaymentPostingDataObj.mainEOBPaymentPostingObj || 0;
    $scope.IsComingFrom = PaymentPostingDataObj.IsFrom || "";
    $scope.IsShowPostPaymentBtnInd = PaymentPostingDataObj.IsShowPostPaymentBtnInd || false;

    $scope.uibclose = function () {
        $uibModalInstance.close("cancel");
    };
    $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
    $scope.doctorinfo = eHnoteMasterDataService.getUserInfo();
    var NewBranchList = localStorageFactory.getItem("allBranchesData") || [];
    InitializeBranches(NewBranchList);

    function InitializeBranches(data) {
        var clinicAddress = eHnoteUserAppointmentDataService.RestructureNewBranches($scope.UserAccessRights.AllAccessRights.APPListAllBranchesAppointments, data, $scope.doctorinfo) || [];
        $scope.BranchesListArray = clinicAddress;
    }
    $scope.EOBGrandTotals = {
        "TotalClaimAmount": 0,
        "TotalInsurancePayment": 0,
        "TotalPatientResponsibilityAmount": 0,
        "TotalAdjustmentAmount": 0,
        "TotalBalance": 0
    };
    $scope.GetPatientobj = function () {
        var obj = {
            "PatientId": null,
            "FullName": "",
            "FirstName": "",
            "LastName": "",
            "DOB": "",
            "AgeInMonths": 0,
            "AgeInYears": 0,
            "MobileNo": "",
            "EmailId": "",
            "Address1": "",
            "Address2": "",
            "CityName": "",
            "StateName": "",
            "StateCode": "",
            "ZipCode": "",
            "Gender": "",
            "S3URL": "",
            "SecondaryPayerName": "",
            "PatientDisplayId": null,
            "PatientName": '',
            "PatientMobile": '',
            "BillingProviderFacilityName": '',
            "FacilityName": '',
            "PatientFullName": '',
            "TotalClaimAmount": 0,
            "TotalInsurancePayment": 0,
            "TotalAdjustmentAmount": 0,
            "TotalPatientBalance": 0,
            "TotalInsuranceBalance": 0,
            "TotalDeductibleAmount": 0,
            "TotalCoInsuranceAmount": 0,
            "TotalPatientResponsibilityAmount": 0,
            "TotalCopayAmount": 0,
            "TotalBalance": 0,
            "TotalRefundAmount": 0,
        }
        return obj;
    };

    $scope.Patientobj = angular.copy($scope.GetPatientobj());
    $scope.AjustResponseReceiveDate = null;

    $scope.mainBillerDataObj = {
        "AllBranchesList": [],
        "AllSubSpecializationsArray": [],
        "AllUsersList": [],
        "AllFacilitiesList": [],
        "AllDoctorsList": [],
        "BillingProviderList": [],
        "OrganizationLogoUrl": "",
        "Masterrefundreasons": [],
    }

    $scope.GetNewClaimTransmissionObj = function () {
        let obj = {
            "ClaimTransmissionId": 0,
            "PatientClaimId": $scope.mainObject.PatientClaimId,
            "PayorId": $scope.mainObject.PayorId,
            "PlanId": null,
            "PatientInsuranceDetailId": $scope.mainObject.PatientInsuranceDetailId,
            "AppointmentInsuranceDetailId": $scope.mainObject.AppointmentInsuranceDetailId,
            "OrganizationPayorId": $scope.mainObject.OrganizationPayorId,
            "PriorAuthorizationNumber": "",
            "ClaimSubmissionDate": null,
            "ClaimSubmissionBy": null,
            "TransmissionTypeId": 2,
            "TransmissionType": "Paper", //EDI or Paper
            "TransmissionMethodId": 7,
            "TransmissionMethod": "Replacement of Prior Claim",
            "BillTypeFrequencyId": 2,
            "BillTypeFrequency": "New Claim",
            "BillTypeFrequencyCode": "7",
            "TransmissionStatusId": 1,
            "TransmissionStatus": "Pending",//Sent or Processing
            "InsuranceLevelId": $scope.mainObject.IdentifierId == 1 ? 1 : 2,
            "InsuranceLevel": $scope.mainObject.IdentifierId == 1 ? "P" : "S",
            "ClearingHouseStatusId": null,
            "PayorControlNumber": $scope.mainObject.PayerClaimControlNumber,
            "ClearingHouseControlNumber": "",
            "ClearingHouseResponseDate": null,
            "ClearingHouseResponseStatus": "",
            "ClearingHouseResponseStatusId": null,
            "PayerResponseDate": null,
            "PayerResponseStatus": "",
            "PayerResponseStatusId": null,
            "PayerClaimControlNumber": "",
            "EOBId": null,
            "InsuranceResubmitCode": "",
            "IsAttachmentSubmitted": false,
            "IsEligibleForSecondaryClaim": true,
            "IsSecondaryClaimSubmitted": false,
            "IsEraSettled": true,
            "IsClaimVerified": true,
            "ClaimVerifiedBy": null,
            "ClaimVerifiedDate": null,
            "OrganizationClearingHouseId": null,
            "ClearingHouseName": "",
            "MasterClearingHouseId": null,
            "ClearingHouseTypeId": null,
            "ClearingHouseType": "",
            "TotalClaimAmount": $scope.mainObject.TotalClaimAmount,
            "InsurancePaymentAmount": 0,
            "PatientResponsibilityAmount": 0,
            "CoInsuranceAmount": 0,
            "DeductibleAmount": 0,
            "AllowedAmount": 0,
            "AdjustmentAmount": 0,
            "OtherAdjustmentAmount": 0,
            "WriteOffAmount": 0,
            "ReplacementControlNumber": $scope.mainObject.PayerClaimControlNumber,
            "DeleteInd": "N",
            "UsageIndicator": ""
        }
        return obj;
    }
    $scope.PatientClaimTransmissionObj = $scope.GetNewClaimTransmissionObj();


    $scope.init = function () {
        var tempadjustmentMap = {};
        $scope.OrganizationClearingHouseDetails = [];
        let obj = {
            "PatientClaimId": $scope.mainObject.PatientClaimId,
            "EraId": $scope.mainObject.EraId || 0,
            "EOBClaimInfoId": $scope.mainObject.EOBClaimInfoId
        }
        $scope.isIojOrgEnable = false;
        var currenturl = $location.absUrl().split('?')[0];
        var CurrentEnvironment = currenturl.split('/#')[0];
        if (CurrentEnvironment == "https://ioj.ehnote.com" || CurrentEnvironment == "https://insts.ehnote.com") {
            $scope.isIojOrgEnable = true;
        };

        if ($scope.isIojOrgEnable == true) {
            $scope.MasterDenialFormTypes = [
                { AppealConfigId: 1, AppealType: "General" },
                { AppealConfigId: 2, AppealType: "Triple-S" },
                { AppealConfigId: 3, AppealType: "Triple-S Advantage" },
                { AppealConfigId: 4, AppealType: "MCS" },
                { AppealConfigId: 5, AppealType: "MMM" },
                { AppealConfigId: 6, AppealType: "MSO" },
                { AppealConfigId: 7, AppealType: "MEDICARE" },
                { AppealConfigId: 8, AppealType: "MAPFRE" },
            ];
        } else {
            $scope.MasterDenialFormTypes = [
                { AppealConfigId: 1, AppealType: "General" },
            ];
        }


        $q.all([
            eHnoteInsuranceService.GetPatientClaimEOBDetails(obj),
            eHnoteSettingsDataService.GetAllMasterClaimsData($scope.HospitalId),
        ]).then(function (resp) {
            if (resp[0].data.status == "Success") {
                $scope.PatientClaimInfo = resp[0].data.PatientClaimInfo || [];
                $scope.NotSettledClaimDetails = resp[0].data.NotSettledClaimDetails || [];
                $scope.AppointmentInsuranceDetails = resp[0].data.AppointmentInsuranceDetails || [];
                //$scope.AddDenialAppealObj.ServiceDate =$filter('date')($scope.PatientClaimInfo.ClaimDate, 'MM-dd-yyyy');
                $scope.EOBCLaims = resp[0].data.EOBCLaims || [];
                if ($scope.EOBCLaims.length > 0) {
                    $scope.filteredEOBClaims = $scope.EOBCLaims.filter(function (eitem) {
                        return eitem.EOBPayorId === $scope.mainObject.EOBPayorId;
                    });
                    $scope.mainEOBPaymentPostingObj.EraId = $scope.EOBCLaims[0].EraId || 0;
                    angular.forEach($scope.EOBCLaims, function (claim) {
                        if (claim.EOBClaimLineItems && claim.EOBClaimLineItems.length > 0) {
                            claim.DOSfrom = claim.EOBClaimLineItems[0].DOSfrom;
                            claim.PayorName = claim.PayorName;
                            $scope.PayorName = claim.PayorName;
                        }
                        if ($scope.IsComingFrom === "ClaimsList") {
                            $scope.PatientClaimTransmissionObj.PatientInsuranceDetailId = claim.PatientInsuranceDetailId;
                            $scope.PatientClaimTransmissionObj.InsuranceLevelId = claim.IdentifierId == 1 ? 1 : 2;
                            $scope.PatientClaimTransmissionObj.InsuranceLevel = claim.IdentifierId == 1 ? "P" : "S";
                            $scope.PatientClaimTransmissionObj.PayorControlNumber = claim.PayerClaimControlNumber;
                            $scope.PatientClaimTransmissionObj.ReplacementControlNumber = claim.PayerClaimControlNumber;
                            $scope.PatientClaimTransmissionObj.TotalClaimAmount = claim.TotalClaimAmount;
                            $scope.mainObject.TotalClaimAmount = claim.TotalClaimAmount;
                        }
                    });
                    var eobClaims = resp[0].data.EOBCLaims;
                    var filtredEOBCLaims = $filter('filter')(eobClaims, { "EOBClaimInfoId": $scope.mainObject.EOBClaimInfoId }, true) || [];
                    $scope.PatientClaimEOBDetails = angular.copy(filtredEOBCLaims);
                    //$scope.EOBClaimSummaryDetails = angular.copy(eobClaims.filter(x => !(x.DeleteInd === "Y" && x.EraId !== 0))) || [];
                    $scope.EOBClaimSummaryDetails = angular.copy(eobClaims.filter(x => x.ERAPaidBy === 4 && x.DeleteInd !== 'Y'));

                    if ($scope.EOBClaimSummaryDetails.length > 0) {

                      

                        if ($scope.EOBClaimSummaryDetails[0].EOBClaimLineItems &&
                            $scope.EOBClaimSummaryDetails[0].EOBClaimLineItems.length > 0) {



                            $scope.EOBClaimSummaryDetails[0].EOBClaimLineItems =
                                $scope.EOBClaimSummaryDetails[0].EOBClaimLineItems.filter(function (citem) {

                                    return (citem.ServiceAdjustments || []).some(function (sitem) {
                                        return sitem.PayorPostingStatusId == 3;
                                    });

                                });

                            var DOSfrom = $scope.EOBClaimSummaryDetails[0].EOBClaimLineItems[0].DOSfrom;

                            $scope.AddDenialAppealObj.ServiceDate = $filter('date')(DOSfrom, 'MM-dd-yyyy');
                            $scope.DenialServiceDate = $filter('date')(DOSfrom, 'MM-dd-yyyy');
                        }
                        angular.forEach($scope.EOBClaimSummaryDetails, function (item) {
                            if (item.EOBClaimLineItems.length > 0) {
                                item.TotalPatientResponsibilityAmount = 0;
                                $scope.ServiceAdjustment = [];
                                angular.forEach(item.EOBClaimLineItems, function (Aitem) {
                                    item.TotalPatientResponsibilityAmount += Aitem.PatientResponsibility || 0;
                                    if (Aitem.ServiceAdjustments && Aitem.ServiceAdjustments.length > 0) {
                                        angular.forEach(Aitem.ServiceAdjustments, function (adj) {
                                            $scope.ServiceAdjustment.push(adj);
                                        });
                                    }
                                });
                                $scope.Patientobj.TotalPatientResponsibilityAmount += item.TotalPatientResponsibilityAmount || 0;
                                $scope.Patientobj.TotalAdjustmentAmount += item.TotalAdjustmentAmount
                            }
                        });
                        $scope.loadUnappealableDataFromBackend();

                    }
                }
                $scope.AllServiceAdjustmentsList = [];
                if ($scope.mainObject.AllServiceAdjustmentsList &&
                    $scope.mainObject.AllServiceAdjustmentsList.length > 0) {
                    $scope.AllServiceAdjustmentsList = $scope.mainObject.AllServiceAdjustmentsList;
                } else if ($scope.PatientClaimInfo?.PatientClaimLineItems?.length > 0) {

                    $scope.AllServiceAdjustmentsList = [];

                    angular.forEach($scope.PatientClaimInfo.PatientClaimLineItems, function (lineItem) {

                        angular.forEach(lineItem.ServiceAdjustments || [], function (adj) {

                            let found = false;

                            for (let i = 0; i < $scope.AllServiceAdjustmentsList.length; i++) {

                                let existing = $scope.AllServiceAdjustmentsList[i];

                                if (existing.GroupCode === adj.GroupCode &&existing.AdjustmentReasonCode === adj.AdjustmentReasonCode) {
                                    existing.AdjustmentAmount += Number(adj.AdjustmentAmount) || 0;
                                    found = true;
                                    break;
                                }
                            }

                            if (!found) {
                                $scope.AllServiceAdjustmentsList.push({
                                    ActiveInd: adj.ActiveInd,
                                    AdjsutmentDescription: adj.AdjsutmentDescription,
                                    AdjsutmentReason: adj.AdjsutmentReason,
                                    AdjustmentAmount: Number(adj.AdjustmentAmount) || 0,
                                    AdjustmentId: adj.AdjustmentId,
                                    AdjustmentReasonCode: adj.AdjustmentReasonCode,
                                    AdjustmentReasonId: adj.AdjustmentReasonId,
                                    ClaimLineItemId: adj.ClaimLineItemId,
                                    DeleteInd: adj.DeleteInd,
                                    EOBLineItemId: adj.EOBLineItemId,
                                    GroupCode: adj.GroupCode,
                                    Notes: adj.Notes,
                                    OrganizationId: adj.OrganizationId,
                                    ParentOrganizationId: adj.ParentOrganizationId,
                                    PayorPostingStatus: adj.PayorPostingStatus,
                                    PayorPostingStatusId: adj.PayorPostingStatusId,
                                    Pt_StateMent: adj.Pt_StateMent,
                                    Rejections: adj.Rejections,
                                    WriteOff: adj.WriteOff
                                });
                            }
                        });
                    });
                }

                $scope.AllServiceAdjustmentsList = $scope.AllServiceAdjustmentsList.filter(function (item) {
                    return item.PayorPostingStatusId !== 2 && item.PayorPostingStatusId !== 1;
                });


              

                $scope.TotalPatientRespAmount = 0;
                $scope.TotalAdjmtAmount = 0;
                $scope.AllTotalServiceAdjustmentsAmount = 0;
                angular.forEach($scope.AllServiceAdjustmentsList, function (aitem) {
                    $scope.AllTotalServiceAdjustmentsAmount += aitem.AdjustmentAmount || 0;
                    if (aitem.GroupCode === "PR") {
                        $scope.TotalPatientRespAmount += aitem.AdjustmentAmount || 0;
                    } else if (aitem.GroupCode != "PR") {
                        $scope.TotalAdjmtAmount += aitem.AdjustmentAmount || 0;
                    }

                })


                //var temptotalAdjamount = 0;
                //if ($scope.ServiceAdjustment.length>0) {
                //    angular.forEach($scope.ServiceAdjustment, function (aitem) {
                //        aitem.AdjsutmentDescription = aitem.AdjsutmentDescription || "";

                //        if (aitem.AdjsutmentDescription !== "" && aitem.DeleteInd === "N") {
                //            if (!aitem.AdjsutmentDescription.startsWith(aitem.GroupCode + "-")) {
                //                aitem.AdjsutmentDescription = aitem.GroupCode + '-' + aitem.AdjsutmentDescription;
                //            }
                //            var desc = aitem.AdjsutmentDescription;

                //            if (typeof aitem.AdjustmentAmount === "string") {
                //                aitem.AdjustmentAmount = Math.round(parseFloat(aitem.AdjustmentAmount) * 100) / 100;
                //            }
                //            if (!tempadjustmentMap[desc]) {
                //                tempadjustmentMap[desc] = angular.copy(aitem);
                //            } else {
                //                tempadjustmentMap[desc].AdjustmentAmount += aitem.AdjustmentAmount;
                //            }
                //        }

                //        aitem.AdjustmentAmount = aitem.AdjustmentAmount || null;
                //        if (aitem.AdjustmentAmount != null) {
                //            aitem.AdjustmentAmount = parseFloat(aitem.AdjustmentAmount).toFixed(2);
                //            var tempAdjAmount = parseFloat(aitem.AdjustmentAmount) || 0;
                //            temptotalAdjamount += tempAdjAmount;
                //        }
                //    });

                //    angular.forEach(tempadjustmentMap, function (aitem) {
                //        $scope.AllServiceAdjustmentsList.push(aitem);
                //    });

                //    $scope.AllServiceAdjustmentsList = _.uniq($scope.AllServiceAdjustmentsList, false, function (p) { return p.AdjsutmentDescription; });

                //}


                var data = $scope.PatientClaimInfo;
                $scope.Patientobj.TotalClaimAmount = data.TotalClaimAmount || 0;
                $scope.Patientobj.TotalInsurancePayment = data.TotalInsurancePayment || 0;
                $scope.Patientobj.TotalPatientPayment = data.TotalPatientPayment || 0;
                $scope.Patientobj.TotalPatientBalance = data.TotalPatientBalance || 0;
                $scope.Patientobj.TotalInsuranceBalance = data.TotalInsuranceBalance || 0;
                $scope.Patientobj.TotalBalance = data.TotalBalance || 0;
                $scope.Patientobj.TotalRefundAmount = data.TotalRefundAmount || 0;
                $scope.Patientobj.TotalDeductibleAmount = data.TotalDeductibleAmount || 0;
                $scope.Patientobj.TotalCoInsuranceAmount = data.TotalCoInsuranceAmount || 0;
                $scope.Patientobj.TotalCopayAmount = data.TotalCopayAmount || 0;
                $scope.Patientobj.TotalAllowedAmount = data.TotalAllowedAmount || 0;
                $scope.AddDenialAppealObj.TransmissionMethod = "Replacement of Prior Claim"|| '';
                $scope.AddDenialAppealObj.TransmissionMethodId = 7 || '';
                $scope.AddDenialAppealObj.BillTypeFrequency = data.BillTypeFrequency || '';
                $scope.AddDenialAppealObj.BillTypeFrequencyId = data.BillTypeFrequencyId || '';
                $scope.DenialReconsiderationHeaderId = data.DenialReconsiderationHeaderId || 0;
                $scope.mainObject.DenialReconsiderationHeaderId = data.DenialReconsiderationHeaderId || 0;

                $scope.ClaimTypeId = data.ClaimTypeId || 0;


                if ($scope.EOBClaimSummaryDetails[0].EOBClaimLineItems.length > 0) {

                    $scope.Patientobj.TotalClaimAmount = 0;
                    $scope.Patientobj.TotalPatientPayment = 0;
                    $scope.Patientobj.TotalAllowedAmount = 0;
                    angular.forEach($scope.EOBClaimSummaryDetails[0].EOBClaimLineItems, function (citem, index) {

                        $scope.Patientobj.TotalClaimAmount += citem.TotalChargeAmount || 0;
                        $scope.Patientobj.TotalPatientPayment += citem.PatientPayment || 0;
                        $scope.Patientobj.TotalAllowedAmount += citem.AllowedAmount || 0;

                    });
                }


            }
            if (resp[1].data.ClaimTypes.length !== 0) {               
                $scope.masterBillingFrequencyTypes = resp[1].data.MasterClaimTransmissionType || [];

                $scope.ClaimProffesionalList = $filter("filter")($scope.masterBillingFrequencyTypes, function (item) {
                    return item.TransmissionTypeId == 2 || item.TransmissionTypeId == 7 || item.TransmissionTypeId == 8;
                });
            }


            $scope.GetDenialReconsiderationRequest();
            $scope.updateUnappealablePermissions();

               
        }, function (err) {
            console.log(err);
            alertify.error("Getting Data Failed");
        });
    };

    $scope.GetDenialReconsiderationRequest = function () {

        var obj1 = {
            "DenialReconsiderationHeaderId": $scope.DenialReconsiderationHeaderId || 0
        }

        eHnoteMainAppointmentService.GetDenialReconsiderationRequestForPrint(obj1).then(function (resp) {
            console.log(resp);
            if (resp.data.rows.status === "Success") {
                var row = resp.data.rows;
                if (row.DenialReconsiderationHeaderId > 0) {

                    $scope.AddDenialAppealObj.RequestDate = row.RequestedDate ? $filter('date')(row.RequestedDate, 'MM-dd-yyyy') : "";
                    $scope.AddDenialAppealObj.AjustResponseReceiveDate = row.AjustResponseReceiveDate ? $filter('date')(row.AjustResponseReceiveDate, 'MM-dd-yyyy') : "";
                    $scope.AddDenialAppealObj.RequestTypeId = row.RequestTypeId || "";
                    $scope.AddDenialAppealObj.RequestType = row.RequestType || "";
                    $scope.AddDenialAppealObj.AppealReason = row.RequestRemarks || "";
                    $scope.showeditbutton = true;
                    $scope.updateUnappealablePermissions();

                    let sourceItems = row.ClaimLineitems || [];

                    ($scope.PatientClaimInfo.PatientClaimLineItems || []).forEach(function (Item) {

                        let match = sourceItems.find(function (src) { return src.ClaimLineItemId === Item.ClaimLineItemId; });

                        if (match) {
                            Item.DenialReconsiderationHeaderId = match.DenialReconsiderationHeaderId;
                            Item.DenialReconsiderationLineItemId = match.DenialReconsiderationLineItemId;
                        }

                    });

                } else {
                    console.log("No valid denial header found");
                }

            } else {
                console.log("API failed or rows missing");
            }
        });
    }

    $scope.init();

    $scope.DenialAppealObj = function () {
        var obj = {

            "UserId": 0,
            "DenialReconsiderationHeaderId": 0,
            "TransmissionTypeId": null,  //2
            "TransmissionType": null,   //PAPER
            "TransmissionMethodId": null,
            "TransmissionMethod": "",
            "BillTypeFrequencyId": null,
            "BillTypeFrequency": "",
            "PatientClaimId": 0,
            "PatientClaimNumber": "",
            "PayorId": null,
            "PayorName": "",
            "RequestTypeId": 0,
            "RequestType": "",
            "DenialSourceId": 0,
            "DenialSource": "",
            "RequestDate": "",
            "AjustResponseReceiveDate": null,
            "ServiceDate": "",
            "RequestedByUserId": $scope.UserId,
            "PrintedFormId": 0,
            "PrintedFormName": "",
            "PrintedOn": null,
            "RequestRemarks": "",
            "FormS3URL": null,
            "TotalAppealedAmount": 0,
            "DeleteInd": 'N',
            "ClaimLineItems": [],
            "IscheckedAdjustment": false,
            "AppealReason": ""
        }
        return obj;
    };

    $scope.AddDenialAppealObj = angular.copy($scope.DenialAppealObj());

    $scope.GetDenialLineItems = function () {
        var Obj = {
            "DenialReconsiderationLineItemId": 0,
            "DenialReconsiderationHeaderId": 0,
            "ClaimLineItemId": 0,
            "DenialReasonDescription": "",
            "ChargeAmount": 0,
            "InsurancePayment": 0,
            "AppealedAmount": 0,
            "LineStatusId": 0,
            "LineStatus": "",
            "DeleteInd": "N",
            "AdjustmentCodes": [],
        }
        return Obj;
    }


   
    $scope.language = {
        spanish: false,
        english: false
    };

    $scope.onLanguageChange = function (langId) {
        if (langId === 1) {
            $scope.language.english = false;
            $scope.selectedLanguageId = 1;
        } else {
            $scope.language.spanish = false;
            $scope.selectedLanguageId = 2;
        }
    };


    //$scope.MasterDenialFormTypes = [
    //    { AppealConfigId: 1, AppealType: "General" },
    //    { AppealConfigId: 2, AppealType: "Triple-S" },
    //    { AppealConfigId: 3, AppealType: "Triple-S Advantage" },
    //    { AppealConfigId: 4, AppealType: "MCS" },
    //    { AppealConfigId: 5, AppealType: "MMM" },
    //    { AppealConfigId: 6, AppealType: "MSO" },
    //    { AppealConfigId: 7, AppealType: "MEDICARE" },
    //    { AppealConfigId: 8, AppealType: "MAPFRE" },
    //];


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

    $scope.GetOrganizationBillingProviders();

    $scope.navtoClaimSummaryPopup = function (item) {

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
            "AppointmentTypeId": PaymentPostingDataObj?.AppointmentTypeId || null,
            "VisitId": item.VisitId || '',
            "ActionType": "EditClaim",
            "SubActionType": "Verify",
            "ScreenType": "Popup",
            "SuperBillId": null,
            "IsCreateSuperBill": false,
            "PatientClaimId": item.PatientClaimId,
            "SuperBillArray": [],
            "ClaimExpiryDate": null,
        };
        $scope.mainBillerDataObj = {
            "Tabid": 2,
            "AllBranchesList": $scope.BranchesListArray,
            "AllUsersList": $scope.mainBillerDataObj.AllUsersList || []

        }
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
        });

        $scope.mInstanceAdd.result.then(function (resp) {
            resp = resp || "";



        }, function () { });
    }

    $scope.GetEOBClaimDetails = function (Id, status) {

        let SettlementStatusList = "1";
        var EraId = 0;
        EraId = $scope.mainEOBPaymentPostingObj.EraId;
        if ($scope.Subtab == 1) {
            SettlementStatusList = "1";
            /*EraId = $scope.mainEOBPaymentPostingObj.EraId;*/
        }
        else if ($scope.Subtab == 2) {
            $scope.SearchObj.SettlementStatusId = $scope.SearchObj.SettlementStatusId || '';
            if ($scope.SearchObj.SettlementStatusId != '') {
                SettlementStatusList = $scope.SearchObj.SettlementStatusId;
            } else {
                SettlementStatusList = "2,3,4,5";
            }

        }
        else if ($scope.Subtab == 3) {
            SettlementStatusList = "6";
        }
        else if ($scope.Subtab == 4) {
            SettlementStatusList = "7";
        }
        else if ($scope.Subtab == 5) {
            SettlementStatusList = "8";
        }
        else if ($scope.Subtab == 6) {
            SettlementStatusList = "9";
        }
        else if ($scope.Subtab == 7) {
            SettlementStatusList = "10";

        }
        else {

        }
        let obj = {
            "EOBId": $scope.mainEOBPaymentPostingObj.EOBId,
            "SettlementStatusList": SettlementStatusList || "1",
            "PageSize": $scope.mainEOBPaymentPostingObj.PageSize || 50,
            "PageNumber": $scope.mainEOBPaymentPostingObj.PageNumber || 1,
            "EraId": $scope.mainEOBPaymentPostingObj.EraId || 0,
        }
        eHnoteInsuranceService.GetEOBClaimDetailsByStatus(obj).then(function (resp) {
            if (resp.data.status === "Success") {

                $scope.EOBClaimList = resp.data.rows || [];
                $scope.EOBClaimListCount = resp.data.count || 0;

                if ($scope.EOBClaimList.length > 0) {
                    angular.forEach($scope.EOBClaimList, function (Citem) {
                        var PatientBalance = 0;
                        var InsuranceBalance = 0;
                        var TotalBalance = 0;
                        var AjustmentAmount = 0;
                        Citem.ERAPaidBy = Citem.ERAPaidBy || null;
                        if (Citem.EOBClaimLineItems.length > 0) {
                            Citem.PatientClaimInfo.PatientClaimLineItems = Citem.PatientClaimInfo.PatientClaimLineItems || [];

                            angular.forEach(Citem.PatientClaimInfo.PatientClaimLineItems, function (Aitem) {

                                if ($scope.Subtab == 1) {
                                    let EOBClaim = $filter("filter")(Citem.EOBClaimLineItems, function (fitem, index) { return fitem.ClaimLineItemId === Aitem.ClaimLineItemId }, true) || [];
                                    if (EOBClaim.length > 0) {
                                        PatientBalance += EOBClaim[0].PatientBalance || 0;
                                        InsuranceBalance += EOBClaim[0].InsuranceBalance || 0;
                                        TotalBalance += EOBClaim[0].TotalBalance || 0;

                                        Aitem.AllowedAmount = EOBClaim[0].AllowedAmount || 0;
                                        Aitem.InsurancePaymentAmount = EOBClaim[0].PaymentAmount || 0;
                                        Aitem.ServiceAdjustments = [];
                                        let EobServiceAdjustments = EOBClaim[0].ServiceAdjustments || [];
                                        let EOBClaimLineItemDenials = EOBClaim[0].EOBClaimLineItemDenials || [];
                                        if (EobServiceAdjustments.length > 0) {
                                            angular.forEach(EobServiceAdjustments, function (esitem) {
                                                let obj = {
                                                    'AdjustmentAmount': esitem.AdjustmentAmount || 0,
                                                    'AdjustmentId': esitem.AdjustmentId || 0,
                                                    'AdjustmentReasonCode': esitem.AdjustmentReasonCode || 0,
                                                    'AdjustmentReasonId': esitem.AdjustmentReasonId || 0,
                                                    'EOBLineItemId': esitem.EOBLineItemId || 0,
                                                    'GroupCode': esitem.GroupCode || 0,
                                                }

                                                Aitem.ServiceAdjustments.push(obj);
                                                AjustmentAmount += esitem.AdjustmentAmount || 0;


                                            });

                                        }

                                    }
                                }
                                else if ($scope.Subtab == 3) {

                                    let EOBClaim = $filter("filter")(Citem.EOBClaimLineItems, function (fitem, index) { return fitem.ClaimLineItemId === Aitem.ClaimLineItemId }) || [];
                                    if (EOBClaim.length > 0) {
                                        PatientBalance += EOBClaim[0].PatientBalance || 0;
                                        InsuranceBalance += EOBClaim[0].InsuranceBalance || 0;
                                        TotalBalance += EOBClaim[0].TotalBalance || 0;

                                        Aitem.AllowedAmount = EOBClaim[0].AllowedAmount || 0;
                                        Aitem.InsurancePaymentAmount = EOBClaim[0].PaymentAmount || 0;

                                        Aitem.ServiceAdjustments = [];
                                        let EobServiceAdjustments = EOBClaim[0].ServiceAdjustments || [];
                                        if (EobServiceAdjustments.length > 0) {
                                            angular.forEach(EobServiceAdjustments, function (esitem) {
                                                let obj = {
                                                    'AdjustmentAmount': esitem.AdjustmentAmount || 0,
                                                    'AdjustmentId': esitem.AdjustmentId || 0,
                                                    'AdjustmentReasonCode': esitem.AdjustmentReasonCode || 0,
                                                    'AdjustmentReasonId': esitem.AdjustmentReasonId || 0,
                                                    'EOBLineItemId': esitem.EOBLineItemId || 0,
                                                    'GroupCode': esitem.GroupCode || 0,
                                                }

                                                Aitem.ServiceAdjustments.push(obj);
                                                AjustmentAmount += esitem.AdjustmentAmount || 0;


                                            });

                                        }

                                    }
                                }
                                else if ($scope.Subtab == 2) {

                                    let EOBClaim = $filter("filter")(Citem.EOBClaimLineItems, function (fitem, index) { return fitem.ClaimLineItemId === Aitem.ClaimLineItemId }) || [];
                                    if (EOBClaim.length > 0) {
                                        PatientBalance += EOBClaim[0].PatientBalance || 0;
                                        InsuranceBalance += EOBClaim[0].InsuranceBalance || 0;
                                        TotalBalance += EOBClaim[0].TotalBalance || 0;

                                        Aitem.AllowedAmount = EOBClaim[0].AllowedAmount || 0;
                                        Aitem.InsurancePaymentAmount = EOBClaim[0].PaymentAmount || 0;
                                        Aitem.ServiceAdjustments = [];
                                        let EobServiceAdjustments = EOBClaim[0].ServiceAdjustments || [];
                                        let EOBClaimLineItemDenials = EOBClaim[0].EOBClaimLineItemDenials || [];
                                        if (EobServiceAdjustments.length > 0) {
                                            angular.forEach(EobServiceAdjustments, function (esitem) {
                                                let obj = {
                                                    'AdjustmentAmount': esitem.AdjustmentAmount || 0,
                                                    'AdjustmentId': esitem.AdjustmentId || 0,
                                                    'AdjustmentReasonCode': esitem.AdjustmentReasonCode || 0,
                                                    'AdjustmentReasonId': esitem.AdjustmentReasonId || 0,
                                                    'EOBLineItemId': esitem.EOBLineItemId || 0,
                                                    'GroupCode': esitem.GroupCode || 0,
                                                }

                                                Aitem.ServiceAdjustments.push(obj);

                                                AjustmentAmount += esitem.AdjustmentAmount || 0;


                                            });

                                        }

                                        // Citem.ClaimAdjustmentAmount = AjustmentAmount;

                                    }
                                }


                                else {
                                    PatientBalance += Aitem.PatientBalance || 0;
                                    InsuranceBalance += Aitem.InsuranceBalance || 0;

                                }

                            });

                            Citem.ERAId = Citem.ERAId || null;

                            if (Citem.ERAId != null) {
                                Citem.PatientClaimInfo.TotalPatientBalance = PatientBalance;
                                Citem.PatientClaimInfo.TotalInsuranceBalance = InsuranceBalance;
                                Citem.PatientClaimInfo.TotalBalance = TotalBalance;

                            }
                            else {
                                Citem.PatientClaimInfo.TotalPatientBalance = PatientBalance;
                                Citem.PatientClaimInfo.TotalInsuranceBalance = InsuranceBalance;
                                Citem.PatientClaimInfo.TotalBalance = TotalBalance;
                            }




                        }//commented for display clima level adjustment
                        //if (AjustmentAmount != 0) {
                        //    Citem.PatientClaimInfo.TotalAdjustmentAmount = AjustmentAmount;
                        //}
                        Citem.PatientClaimInfo.TotalChargeAmount = Citem.PatientClaimInfo.TotalChargeAmount || 0;
                        if (Citem.PatientClaimInfo.TotalChargeAmount == 0) {
                            Citem.PatientClaimInfo.TotalChargeAmount = Citem.PatientClaimInfo.TotalClaimAmount;
                        }

                    });
                }
                $scope.GetParticularEobdetails(Id, status);

                status = status || "";

                if (status === "Patient") {
                    let filterEOBClaimlist = $filter("filter")($scope.EOBClaimList, function (item) { return item.EOBClaimInfoId === Id }, true) || [];
                    if (filterEOBClaimlist.length > 0) {
                        var TabName = ($scope.Subtab === 1 || $scope.Subtab === 7) ? "Post" : "Edit";
                        $scope.openPostPaymentPopup(filterEOBClaimlist[0], TabName);
                    }
                }

            } else {
                alertify.error(resp.data.Message);
            }
        });
    }

    $scope.navtoOpenProfilePopup = function (item, id, type, NotesId) {


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
            "AppointmentTypeId": PaymentPostingDataObj.AppointmentTypeId || null,
            "ActionType": "AddClaim",
            "SubActionType": "Verify",
            "ScreenType": "Popup",
            "SuperBillId": null,
            "PatientClaimId": item.PatientClaimId,
            "SuperBillArray": [],
            "NotesId": NotesId || 1,
        };
        $scope.mainBillerDataObj.AllBranchesList = $scope.BranchesListArray || [];

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

        }, function () { });
    }

    function getnewEOBPrintClaimObj() {
        var obj = {
            "PayorName": "",
            "PayorCode": "",
            "PayorNPI": "",
            "PayorAddress1": "",
            "PayorAddress2": "",
            "PayorZipCode": "",
            "PayorCity": "",
            "PayorState": "",
            "PayorWWW": "",
            "PayorContactNumber": "",
            "TraceNumber": "",
            "ChequeOrEFTDate": "",
            "TotalPaymentAmount": "",
            "TotalAdjustmentAmount": "",
            "PaymentMode": "",
            "TotalChargeAmount": "",
            "BillingProviderName": "",
            "BillingProviderNPI": "",
            "BillingProviderAddress1": "",
            "BillingProviderAddress2": "",
            "BillingProviderZipCode": "",
            "BillingProviderCity": "",
            "BillingProviderState": "",
            "BillingProviderTaxId": "",
            "BillingProviderTaxonomyId": "",
            "OrganizationName": "",
            "OrganizationAddress1": "",
            "OrganizationAddress2": "",
            "OrganizationCity": "",
            "OrganizationState": "",
            "OrganizationZipCode": "",
            "OrganizationStateCode": "",
            "OrganizationNPI": "",
            "ClaimPaymentInfo": [],
            "ClaimAdjustments": [],
            "ClaimLegends": [],
            "PrintedDatenTime": "",
            "ParsedDate": "",
            "TotalPatientResponsibilityAmount": 0,
            "ClaimAdjustmentAmount": 0,
            "TotalOtherAdjustmentAmount": 0,
            "TotalClaimsAmountData": 0,
            "AllTotalOtherAdjAmt": 0,
            "ProviderAdjustments": [],
            "LegendCodeList": [],
            "TotalWUAdjAmt": 0,
            "ParseDate": "",
            "GlobalPayorId": 0,
        };
        return obj;
    };

    $scope.EOBPrintMainObj = getnewEOBPrintClaimObj();

    $scope.navtoPrintClaimsEOB = function (item) {

        //var param = {
        //    "EraId": item.EraId || null
        //}
        $scope.EraId = $scope.mainEOBPaymentPostingObj.EraId || null;
        eHnoteInsuranceService.GetPrasedERADetailsById($scope.EraId).then(function (resp) {

            resp.data = resp.data || null;
            if (resp.data != null) {
                var ERAresp = angular.copy(resp.data);


                $scope.EOBPrintMainObj.PayorName = ERAresp.PayerName || "";
                $scope.EOBPrintMainObj.PayorCode = ERAresp.PayerCode || "";
                $scope.EOBPrintMainObj.PayorNPI = ERAresp.PayerNPI || "";
                $scope.EOBPrintMainObj.GlobalPayorId = ERAresp.GlobalPayorId || 0;
                $scope.EOBPrintMainObj.PayorAddress1 = ERAresp.PayerAddress1 || "";
                $scope.EOBPrintMainObj.PayorAddress2 = ERAresp.PayerAddress2 || "";
                $scope.EOBPrintMainObj.PayorZipCode = ERAresp.PayerZip || "";
                $scope.EOBPrintMainObj.PayorCity = ERAresp.PayerCity || "";
                $scope.EOBPrintMainObj.PayorState = ERAresp.PayerState || "";
                $scope.EOBPrintMainObj.PayorWWW = ERAresp.PayerWWW || "";
                $scope.EOBPrintMainObj.PayorContactNumber = ERAresp.PayorContactNumber || "";
                $scope.EOBPrintMainObj.TraceNumber = ERAresp.TransactionNumber || "";
                $scope.EOBPrintMainObj.PaymentMode = ERAresp.PaymentMethod || "";
                $scope.EOBPrintMainObj.ChequeOrEFTDate = ERAresp.TransactionDate || "";
                /* $scope.EOBPrintMainObj.TotalAdjustmentAmount = 0 || "";*/
                $scope.EOBPrintMainObj.TotalChargeAmount = ERAresp.TotalChargeAmount || "";
                $scope.EOBPrintMainObj.BillingProviderName = ERAresp.BillIngProviderName || "";
                $scope.EOBPrintMainObj.BillingProviderNPI = ERAresp.BillingProviderNPI || "";
                $scope.EOBPrintMainObj.BillingProviderAddress1 = ERAresp.BillingProviderAddress1 || "";
                $scope.EOBPrintMainObj.BillingProviderAddress2 = ERAresp.BillingProviderAddress2 || "";
                $scope.EOBPrintMainObj.BillingProviderZipCode = ERAresp.BillingProviderZip || "";
                $scope.EOBPrintMainObj.BillingProviderCity = ERAresp.BillingProviderCity || "";
                $scope.EOBPrintMainObj.BillingProviderState = ERAresp.BillingProviderState || "";
                $scope.EOBPrintMainObj.BillingProviderTaxID = ERAresp.BillingProviderTaxID || "";
                $scope.EOBPrintMainObj.BillingProviderTaxonomyId = ERAresp.BillingProviderTaxonomyId || "";
                $scope.EOBPrintMainObj.ParseDate = ERAresp.ParseDate || "";

                $scope.EOBPrintMainObj.OrganizationName = ERAresp.OrganizationName || "";
                $scope.EOBPrintMainObj.OrganizationAddress1 = ERAresp.OrganizationAddress1 || "";
                $scope.EOBPrintMainObj.OrganizationAddress2 = ERAresp.OrganizationAddress2 || "";
                $scope.EOBPrintMainObj.OrganizationCity = ERAresp.OrganizationCity || "";
                $scope.EOBPrintMainObj.OrganizationState = ERAresp.OrganizationState || "";
                $scope.EOBPrintMainObj.OrganizationStateCode = ERAresp.OrganizationStateCode || "";
                $scope.EOBPrintMainObj.OrganizationZipCode = ERAresp.OrganizationZipCode || "";
                $scope.EOBPrintMainObj.OrganizationNPI = $scope.BranchNPI || "";
                $scope.EOBPrintMainObj.ParsedDate = ERAresp.ParseDate || "";
                $scope.EOBPrintMainObj.TotalClaimChargeAmount = ERAresp.TotalClaimChargeAmount || 0,
                    $scope.EOBPrintMainObj.TotalPatientResponsibilityAmount = ERAresp.TotalClaimPatientRespAmount || 0,
                    $scope.EOBPrintMainObj.ClaimAdjustmentAmount = ERAresp.TotalClaimAdjustmentAmount || 0,
                    /* $scope.EOBPrintMainObj.TotalOtherAdjustmentAmount = ERAresp.TotalOtherAdjustmentAmount || 0,*/
                    $scope.EOBPrintMainObj.TotalPaymentAmount = ERAresp.TransactionAmount || 0;

                $scope.EOBPrintMainObj.ProviderAdjustments = ERAresp.ProviderAdjustments || [];
                $scope.EOBPrintMainObj.TotalWUAdjAmt = 0;
                angular.forEach($scope.EOBPrintMainObj.ProviderAdjustments, function (pitem) {
                    $scope.EOBPrintMainObj.TotalWUAdjAmt += pitem.AdjustmentAmount || 0;
                });
                $scope.EOBPrintMainObj.TotalPaidAmount = 0;
                $scope.EOBPrintMainObj.TotalVoucherAmount = 0;
                $scope.EOBPrintMainObj.TotalPaidAmount = $scope.EOBPrintMainObj.TotalPaymentAmount + $scope.EOBPrintMainObj.TotalWUAdjAmt || 0;
                $scope.EOBPrintMainObj.TotalVoucherAmount = $scope.EOBPrintMainObj.TotalPaymentAmount - $scope.EOBPrintMainObj.TotalWUAdjAmt || 0;

                var MatchedandUnMatchedClaimsList = ERAresp.Claims.concat(ERAresp.UnMatchedClaims);

                var filarray = $filter("filter")(MatchedandUnMatchedClaimsList, { "PatientClaimId": item.PatientClaimId });

                $scope.EOBPrintMainObj.TotalClaimsAmountData = 0;
                $scope.EOBPrintMainObj.AllTotalPatientRespAmt = 0;
                $scope.EOBPrintMainObj.AllTotalAdjAmount = 0;
                angular.forEach(filarray, function (cERAresp) {
                    $scope.EOBPrintMainObj.TotalClaimsAmountData += cERAresp.ClaimAmount || 0;
                    cERAresp.TotalPatientRespAmount = 0;
                    cERAresp.TotalAdjAmount = 0;
                    cERAresp.TotalOtherAdjustmentAmt = 0;
                    cERAresp.AllAdjustmentAmount = 0;
                    angular.forEach(cERAresp.ClaimLineItems, function (citem) {
                        angular.forEach(citem.LineItemAdjustments, function (aitem) {
                            if (aitem.GroupCode === "CO") {
                                cERAresp.TotalAdjAmount += aitem.AdjustmentAmount || 0;
                                $scope.EOBPrintMainObj.AllTotalAdjAmount += aitem.AdjustmentAmount || 0;
                            } else if (aitem.GroupCode === "PR") {
                                cERAresp.TotalPatientRespAmount += aitem.AdjustmentAmount || 0;
                                $scope.EOBPrintMainObj.AllTotalPatientRespAmt += aitem.AdjustmentAmount || 0;
                            } else if (aitem.GroupCode === "OA") {
                                cERAresp.TotalOtherAdjustmentAmt += aitem.AdjustmentAmount || 0;
                                $scope.EOBPrintMainObj.AllTotalOtherAdjAmt += aitem.AdjustmentAmount || 0;
                            }
                            cERAresp.AllAdjustmentAmount += aitem.AdjustmentAmount || 0;

                        })

                    })


                    cERAresp.ClaimPaymentRemark1 = cERAresp.ClaimPaymentRemark1 || '';
                    cERAresp.ClaimPaymentRemark2 = cERAresp.ClaimPaymentRemark2 || '';
                    cERAresp.ClaimPaymentRemark3 = cERAresp.ClaimPaymentRemark3 || '';
                    cERAresp.ClaimPaymentRemark4 = cERAresp.ClaimPaymentRemark4 || '';
                    cERAresp.ClaimPaymentRemark5 = cERAresp.ClaimPaymentRemark5 || '';

                    if (cERAresp.ClaimPaymentRemark1 != '') {
                        let obj = {
                            "Code": cERAresp.ClaimPaymentRemark1,
                            "Description": cERAresp.AdjsutmentReasonDescriptionk1,
                        }
                        $scope.EOBPrintMainObj.LegendCodeList.push(obj);
                    }
                    if (cERAresp.ClaimPaymentRemark2 != '') {
                        let obj = {
                            "Code": cERAresp.ClaimPaymentRemark2,
                            "Description": cERAresp.AdjsutmentReasonDescriptionk2,
                        }
                        $scope.EOBPrintMainObj.LegendCodeList.push(obj);
                    }
                    if (cERAresp.ClaimPaymentRemark3 != '') {
                        let obj = {
                            "Code": cERAresp.ClaimPaymentRemark3,
                            "Description": cERAresp.AdjsutmentReasonDescriptionk3,
                        }
                        $scope.EOBPrintMainObj.LegendCodeList.push(obj);
                    }
                    if (cERAresp.ClaimPaymentRemark4 != '') {
                        let obj = {
                            "Code": cERAresp.ClaimPaymentRemark4,
                            "Description": cERAresp.AdjsutmentReasonDescriptionk4,
                        }
                        $scope.EOBPrintMainObj.LegendCodeList.push(obj);
                    }
                    if (cERAresp.ClaimPaymentRemark5 != '') {
                        let obj = {
                            "Code": cERAresp.ClaimPaymentRemark5,
                            "Description": cERAresp.AdjsutmentReasonDescriptionk5,
                        }
                        $scope.EOBPrintMainObj.LegendCodeList.push(obj);
                    }

                });

                if ($scope.EOBPrintMainObj.LegendCodeList.length > 0) {
                    $scope.EOBPrintMainObj.LegendCodeList = _.uniq($scope.EOBPrintMainObj.LegendCodeList, false, function (p) { return p.Code; });
                }

                $scope.EOBPrintMainObj.ClaimPaymentInfo = filarray || [];
                $scope.EOBPrintMainObj.ClaimAdjustments = [];
                $scope.EOBPrintMainObj.ClaimLegends = [];
                $scope.EOBPrintMainObj.PrintedDatenTime = "";

                var tadjAmt = 0;

                var tempadjarray = [], tempadjLegendsarray = [];

                angular.forEach(filarray, function (gitem) {
                    angular.forEach(gitem.ClaimLineItems, function (sitem) {
                        sitem.TotallineItemChargeAmount = sitem.ChargedAmount * sitem.Quantity;
                        angular.forEach(sitem.LineItemAdjustments, function (aitem) {
                            tadjAmt += parseFloat(aitem.AdjustmentAmount) || 0;
                            if (tempadjarray.length > 0) {

                                var filarray = $filter("filter")(tempadjarray, { "AdjustmentCodeId": aitem.AdjustmentReasonId }, true);

                                if (filarray.length > 0) {
                                    angular.forEach(tempadjarray, function (tadjitem) {
                                        if (tadjitem.AdjustmentCodeId === aitem.AdjustmentReasonId) {
                                            tadjitem.AdjustmentAmount += parseFloat(aitem.AdjustmentAmount) || 0;
                                        }
                                    });

                                } else {
                                    var taobj = {
                                        "AdjustmentCodeId": aitem.AdjustmentReasonId,
                                        "AdjustmentCode": aitem.AdjustmentReasonCode,
                                        "AdjustmentCodeName": aitem.AdjustmentReason,
                                        "AdjustmentAmount": parseFloat(aitem.AdjustmentAmount) || 0,
                                        "GroupCode": aitem.GroupCode
                                    }
                                    tempadjarray.push(taobj);
                                }

                            }
                            else {

                                var taobj = {
                                    "AdjustmentCodeId": aitem.AdjustmentReasonId,
                                    "AdjustmentCode": aitem.AdjustmentReasonCode,
                                    "AdjustmentCodeName": aitem.AdjustmentReason,
                                    "AdjustmentAmount": parseFloat(aitem.AdjustmentAmount) || 0,
                                    "GroupCode": aitem.GroupCode
                                }
                                tempadjarray.push(taobj);
                            }

                            if (aitem.AdjustmentCode === "CO" || aitem.AdjustmentCode === "PR") {

                            } else {
                                if (tempadjLegendsarray.length > 0) {
                                    var filarray = $filter("filter")(tempadjLegendsarray, { "AdjustmentCodeId": aitem.AdjustmentReasonId }, true);
                                    if (filarray.length > 0) {
                                    } else {
                                        var taobj = {
                                            "AdjustmentCodeId": aitem.AdjustmentReasonId,
                                            "AdjustmentCode": aitem.AdjustmentReasonCode,
                                            "AdjustmentCodeName": aitem.AdjustmentReason,
                                            "GroupCode": aitem.GroupCode
                                        }
                                        tempadjLegendsarray.push(taobj);
                                    }

                                } else {
                                    var taobj = {
                                        "AdjustmentCodeId": aitem.AdjustmentReasonId,
                                        "AdjustmentCode": aitem.AdjustmentReasonCode,
                                        "AdjustmentCodeName": aitem.AdjustmentReason,
                                        "GroupCode": aitem.GroupCode
                                    }
                                    tempadjLegendsarray.push(taobj);
                                }

                            }
                        });
                    });

                });

                $scope.EOBPrintMainObj.TotalAdjustmentAmount = tadjAmt;
                $scope.EOBPrintMainObj.ClaimAdjustments = tempadjarray;
                $scope.EOBPrintMainObj.ClaimLegends = tempadjLegendsarray;

                var printDate = $filter("date")(new Date(), "MMM-dd-yyyy");
                var printTime = moment(new Date()).format("HH:mm");
                var printDatemTime = printDate + '  ' + printTime;
                $scope.EOBPrintMainObj.PrintedDatenTime = printDatemTime;



                $timeout(function () {
                    var innerContents = document.getElementById('EOBPostingprint').innerHTML;
                    var popupWinindow = window.open('scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                    popupWinindow.document.open();
                    popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()" class="bodyheightprint">' + innerContents + '</body></html>');
                    popupWinindow.document.close();
                }, 500);

            }
        });

    }

    $scope.getDoctorsbySubSpecializations = function () {


        $scope.BranchDoctorsList = [];
        $scope.allUserList = [];
        $scope.clinicDoctorList = [];
        $scope.DoctorObj = "";

        var listSubSplArray = $filter("filter")($scope.allSubSpecializationsArray, function (iterator, ind) { return iterator.isChecked === true; });
        var subSplArray = _.pluck(listSubSplArray, "SubSpecializationId").join(",");

        var reqObj = {
            "BranchId": $scope.HospitalId,
            "SubSpecializationIdArray": subSplArray || '',
        }
        eHnoteMainAppointmentService.getAllUsersByDepartmentId(reqObj, onGetUsersSuccess, onGetUsersFailure);
        function onGetUsersSuccess(resp) {
            if (resp.rows.length > 0) {
                $scope.allUserList = resp.rows;
                if (resp.rows.length > 0) {
                    $scope.allUserList = resp.rows;


                    if ($scope.allUserList.length !== 0) {

                        $scope.BranchDoctorsList = angular.copy($scope.allUserList);
                    }


                    $scope.mainBillerDataObj.AllUsersList = angular.copy($scope.allUserList);

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
                            /*     return item.RoleId === 1 || item.RoleId === 3 || item.RoleId === 4 || item.RoleId === 43 || item.RoleId === 55;*/
                            return item.RoleId === 1 || item.RoleId === 43;
                        });
                    }

                    $scope.mainBillerDataObj.AllDoctorsList = angular.copy($scope.BranchDoctorsList);
                    //var doctorAll = { "DoctorID": 0, "FullName": "All Doctors", "AddressID": 0, "MinPerCase": 15 };
                    //$scope.mainBillerDataObj.AllDoctorsList.unshift(doctorAll);
                    angular.forEach($scope.mainBillerDataObj.AllDoctorsList, function (ditem) {
                        ditem.isChecked = true;
                    });
                    $scope.selectedDoctor = 'All Doctors';

                    var DoctorID = doctorinfo.doctordata.User[0].DoctorID;

                    var DoctorObj = $filter("filter")($scope.BranchDoctorsList, function (item, index) { return item.DoctorID == DoctorID })[0];



                } else {
                    alertify.error("No Doctors Found in Selected Hospital");

                }
            } else {
                alertify.error("No Doctors Found in Selected Hospital");

            }

        }

        function onGetUsersFailure(data) {
        }
    }

    $scope.getDoctorsbySubSpecializations();

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

    function openPdf(response) {
        var blob = new Blob([response.data], { type: 'application/pdf' });
        var url = URL.createObjectURL(blob);
        window.open(url);
    }

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
       /* $scope.HCFADetailsInfo.CurrentDate = $filter('date')(new Date(), "MM/dd/yyyy");*/

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

    $scope.ClaimDashBoadHCFAPrint = function (item, type) {

        item.PatientClaimId = item.PatientClaimId || 0;

        eHnoteInsuranceService.GetParticularClaimDetailsById(item.PatientClaimId).then(function (resp) {
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

                $scope.HCFADetailsInfo.CurrentDate = $filter('date')(resp.data.AdmissionDate, "MM/dd/yyyy");

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
                $scope.HCFADetailsInfo.InsuranceDetails.InsurancePlanName = resp.data.PlanName || "";
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

                if (resp.data.PatientClaimTransmission[0] != undefined) {
                    $scope.HCFADetailsInfo.InsuranceDetails.BillTypeFrequencyCode = resp.data.PatientClaimTransmission[0].BillTypeFrequencyCode || "";
                    $scope.HCFADetailsInfo.InsuranceDetails.TransmissionMethodId = resp.data.PatientClaimTransmission[0].TransmissionMethodId || "";
                    $scope.HCFADetailsInfo.InsuranceDetails.ReplacementControlNumber = resp.data.PatientClaimTransmission[0].ReplacementControlNumber || "";
                }
                if (resp.data.AppointmentInsuranceDetails.length > 0) {

                    var filtredArray = $filter("filter")(resp.data.AppointmentInsuranceDetails, { "PatientInsuranceDetailId": item.TransmitQueuePatientInsuranceId }, true) || [];

                    if (filtredArray.length > 0) {
                        //  $scope.HCFADetailsInfo.TypeOfPayor = filtredArray[0].PayorName || "";
                        $scope.HCFADetailsInfo.HeaderInsurance.PayorName = filtredArray[0].PayorName || "";
                        $scope.HCFADetailsInfo.HeaderInsurance.Address1 = filtredArray[0].PayorAddress1 || "";
                        $scope.HCFADetailsInfo.HeaderInsurance.Address2 = filtredArray[0].PayorAddress2 || "";
                        $scope.HCFADetailsInfo.HeaderInsurance.PayorCityName = filtredArray[0].PayorCityName || "";
                        $scope.HCFADetailsInfo.HeaderInsurance.PayorStateName = filtredArray[0].PayorStateName || "";
                        $scope.HCFADetailsInfo.HeaderInsurance.PayorCountryName = filtredArray[0].PayorCountryName || "";
                        $scope.HCFADetailsInfo.HeaderInsurance.PayorZipCode = filtredArray[0].PayorZipCode || "";
                        $scope.HCFADetailsInfo.HeaderInsurance.PayorCode = filtredArray[0].PayorCode || "";
                        $scope.HCFADetailsInfo.HeaderInsurance.PayorStateCode = filtredArray[0].PayorStateCode || "";
                        $scope.HCFADetailsInfo.HeaderInsurance.UserTaxonomyCode = filtredArray[0].UserTaxonomyCode || "";
                        $scope.HCFADetailsInfo.PatientDetails.DoctorName = filtredArray[0].DoctorName || "";
                        $scope.HCFADetailsInfo.PatientDetails.RelationName = filtredArray[0].RelationName || "";
                        $scope.HCFADetailsInfo.PatientDetails.RelationShipId = filtredArray[0].RelationShipId || "";
                        $scope.HCFADetailsInfo.PatientDetails.AppointmentDate = $filter('date')(filtredArray[0].AppointmentDate, 'MM-dd-yyyy') || "";
                        $scope.HCFADetailsInfo.PatientDetails.InsuranceTypeCode = filtredArray[0].InsuranceTypeCode || "";
                        $scope.HCFADetailsInfo.HeaderInsurance.PayorId = filtredArray[0].PayorId || "";
                        $scope.HCFADetailsInfo.HeaderInsurance.GlobalPayorId = filtredArray[0].GlobalPayorId || "";

                        $scope.HCFADetailsInfo.InsuranceDetails.PolicyId = filtredArray[0].PolicyId || 0;
                        $scope.HCFADetailsInfo.InsuranceDetails.InsurancePlanName = filtredArray[0].PlanName || "";
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

                        var IntegerNumber = Math.floor(pitem.TotalChargeAmount);
                        var DecimalNumber = Math.round((pitem.TotalChargeAmount - IntegerNumber) * 100);

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
                            "Charges": pitem.TotalChargeAmount || 0,
                            "IntegerNumber": $scope.IntegerNumber || 0,
                            "DecimalNumber": $scope.DecimalNumber || 0,
                            "Charges1": "00",
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

                $scope.HCFADetailsInfo.TotalCharges = resp.data.TotalClaimAmount;
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
                    //eHnotePrintService.generateHCFAPrintUS($scope.HCFADetailsInfo, "withline");
                    //        $scope.HCFADetailsInfo.printtype = "withTemplate";

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
    $scope.DisableDenailAppeal = {
        "AppealReason": true,
        "RequestTypeId": true,
        "ServiceDate": true,
        "RequestDate":true
    }
    
    $scope.editAppealRequest = function () {
        $scope.showeditbutton = false;
        $scope.DisableDenailAppeal.AppealReason = false;
        $scope.DisableDenailAppeal.RequestTypeId = false;
        $scope.DisableDenailAppeal.RequestDate = false;
        $scope.DisableDenailAppeal.ServiceDate = false;

        $scope.AddDenialAppealObj.TransmissionMethodId = 7;
        $scope.AddDenialAppealObj.TransmissionMethod = "Replacement of Prior Claim";
        $scope.AddDenialAppealObj.BillTypeFrequencyId = 7;
        $scope.AddDenialAppealObj.BillTypeFrequency = "Replacement of Prior Claim";
        

        //$scope.DenialReconsiderationHeaderId = 0;
        $scope.AddDenialAppealObj.IscheckedAdjustment = true;
        $scope.IsEditMode = true;
        $scope.updateUnappealablePermissions();
    };

    $scope.onClickRequestAdjustment = function (item) {
        if (item === true) {
            $scope.DisableDenailAppeal.AppealReason = false;
            $scope.DisableDenailAppeal.RequestTypeId = false;
            $scope.DisableDenailAppeal.ServiceDate = false;
            $scope.DisableDenailAppeal.RequestDate = false;
        }
        else {
            $scope.DisableDenailAppeal.AppealReason = true;
            $scope.DisableDenailAppeal.RequestTypeId = true;
            $scope.DisableDenailAppeal.ServiceDate = true;
            $scope.DisableDenailAppeal.RequestDate = true;
        }
    }
    $scope.Adjustmentrequest = function () {
        var obj = {
            "DenialReconsiderationHeaderId": 0,
            "PatientClaimId": 0,
            "PatientClaimNumber": "",
            "PayorId": 0,
            "PayorName": "",
            "RequestTypeId": 0,
            "RequestType": "",
            "RequestStatusId": 0,
            "RequestStatus": "",
            "DenialSourceId": 0,
            "DenialSource": "",
            "RequestedDate": "",
            "RequestedByUserId": $scope.UserId,
            "RequestRemarks": "",
            "TotalAppealedAmount": 0,
            PatientDetails: {
                "PatientId": 0,
                "PatientName": "",
                "MRNo": "",
                "Gender": ""
            },
            "ClaimLineitems": []
        };

        return obj;
    };

    $scope.OpentoDenialAppealConfigPrint = function (item) {
        var request = {
            "DenialReconsiderationHeaderId": item
        }
        eHnoteMainAppointmentService.GetDenialReconsiderationRequestForPrint(request).then(function (resp) {
            console.log(resp);
            if (resp.data.rows.status === "Success") {
                var row = resp.data.rows;
                row.LanguageId = $scope.selectedLanguageId||0;
                $scope.DeniedServiceLines = resp.data.rows.ClaimLineitems || [];
                if (resp.data.rows.ClaimLineitems) {
                    resp.data.rows.ClaimLineitems = resp.data.rows.ClaimLineitems.filter(item => !item.IsUnappealable);
                }
                $scope.Denail = $scope.Adjustmentrequest();
                if (resp.data.rows.AppointmentInsuranceDetails.length > 0) {
                    $scope.Denail.Address1 = resp.data.rows.AppointmentInsuranceDetails[0].PayorAddress1 || "";
                    $scope.Denail.Address2 = resp.data.rows.AppointmentInsuranceDetails[0].PayorAddress2 || "";
                    $scope.Denail.PayorCityName = resp.data.rows.AppointmentInsuranceDetails[0].PayerCity || "";
                    $scope.Denail.PayorStateName = resp.data.rows.AppointmentInsuranceDetails[0].PayerState || "";
                    $scope.Denail.PayorCountryName = resp.data.rows.AppointmentInsuranceDetails[0].PayorCountryName || "";
                    $scope.Denail.PayorZipCode = resp.data.rows.AppointmentInsuranceDetails[0].PayerZip || "";
                    $scope.Denail.PayorCode = resp.data.rows.AppointmentInsuranceDetails[0].PayorCode || "";
                    $scope.Denail.PayorStateCode = resp.data.rows.AppointmentInsuranceDetails[0].PayorStateCode || "";
                    $scope.Denail.UserTaxonomyCode = resp.data.rows.AppointmentInsuranceDetails[0].UserTaxonomyCode || "";
                    $scope.Denail.DoctorName = resp.data.rows.AppointmentInsuranceDetails[0].DoctorName || "";
                    $scope.Denail.RelationName = resp.data.rows.AppointmentInsuranceDetails[0].RelationName || "";

                    $scope.Denail.AppointmentDate = $filter('date')(resp.data.rows.AppointmentInsuranceDetails[0].AppointmentDate, 'MM-dd-yyyy') || "";
                    $scope.Denail.InsuranceTypeCode = resp.data.rows.AppointmentInsuranceDetails[0].InsuranceTypeCode || "";
                    $scope.Denail.PayorId = resp.data.rows.AppointmentInsuranceDetails[0].PayorId || "";
                    $scope.Denail.GlobalPayorId = resp.data.rows.AppointmentInsuranceDetails[0].GlobalPayorId || "";
                    $scope.Denail.PayorName = resp.data.rows.AppointmentInsuranceDetails[0].PayorName || "";
                    $scope.Denail.PlanName = resp.data.rows.AppointmentInsuranceDetails[0].PlanName || "";
                    $scope.Denail.RelationShipId = resp.data.rows.AppointmentInsuranceDetails[0].RelationShipId || "";
                }
                console.log($scope.Denail.PlanName);
                angular.forEach($scope.DeniedServiceLines, function (item) {
                    $scope.DOSfrom = item.DOSfrom
                });
                $scope.Denail.DenialReconsiderationHeaderId = row.DenialReconsiderationHeaderId;
                $scope.Denail.PatientClaimId = row.PatientClaimId;
                $scope.Denail.PatientClaimNumber = row.PatientClaimNumber;
                $scope.Denail.RequestTypeId = row.RequestTypeId;
                $scope.Denail.RequestType = row.RequestType;
                $scope.Denail.RequestStatusId = row.RequestStatusId;
                $scope.Denail.RequestStatus = row.RequestStatus;
                $scope.Denail.DenialSourceId = row.DenialSourceId;
                $scope.Denail.DenialSource = row.DenialSource;
                $scope.Denail.RequestedDate = row.RequestedDate;
                $scope.Denail.RequestedByUserId = row.RequestedByUserId;
                $scope.Denail.RequestRemarks = row.RequestRemarks;
                $scope.Denail.TotalAppealedAmount = row.TotalAppealedAmount;
                $scope.Denail.RenderingProviderName = row.RenderingProviderName;
                //$scope.Denail.PayorAddress2 = row.PayorAddress2
                //$scope.Denail.PayorAddress1 = row.PayorAddress1
                //$scope.Denail.PayerCity = row.PayerCity
                //$scope.Denail.PayerState = row.PayerState
                //$scope.Denail.PayerZip = row.PayerZip
                $scope.Denail.OrganizationAddress1 = row.OrganizationAddress1;
                $scope.Denail.OrganizationAddress2 = row.OrganizationAddress2;
                $scope.Denail.OrganizationCity = row.OrganizationCity;
                $scope.Denail.OrganizationName = row.OrganizationName;
                $scope.Denail.OrganizationState = row.OrganizationState;
                $scope.Denail.OrganizationZipCode = row.OrganizationZipCode;
                $scope.Denail.Country = row.Country;
                $scope.Denail.TINNo = row.TINNo
                var obj = eHnoteUserDataService.UsMobileFormatChange(row.MobileNo);
                $scope.Denail.MobileNo = obj.UsFormatMobileNumber;
                $scope.Denail.UserName = row.UserName;
                $scope.Denail.NPI = row.NPI;
                $scope.Denail.FaxNo = row.FaxNo;
                $scope.Denail.PayerClaimControlNumber = row.PayerClaimControlNumber;
                $scope.Denail.SignatureOfUser = row.SignatureOfUser
                if ($scope.Denail.SignatureOfUser && !$scope.Denail.SignatureOfUser.startsWith('data:image')) {
                    $scope.Denail.SignatureOfUser = 'data:image/png;base64,' + $scope.Denail.SignatureOfUser;
                }
                $scope.trustedSignature = $sce.trustAsResourceUrl($scope.Denail.SignatureOfUser);
                var patient = (row.AppointmentInsuranceDetails || [])[0] || {};
                $scope.Denail.PatientDetails = {
                    PatientId: patient.PatientId,
                    PatientName: patient.PatientName,
                    MRNo: patient.PatientMrNo,
                    Gender: patient.PatientGender,
                    Age: patient.PatientAgeInYear
                };
                //$scope.Denail.AppealScope = "Partial Claim Denied";
                //if ($scope.DeniedServiceLines && $scope.DeniedServiceLines.length > 0) {
                //    var isEntireClaimDenied = true;
                //    angular.forEach($scope.DeniedServiceLines, function (item) {
                //        var insurancePayment = Number(item.InsurancePaymentAmount || 0);
                //        var paidAmount = Number(item.PaidAmount || 0);
                //        if (insurancePayment !== 0 || paidAmount !== 0) {
                //            isEntireClaimDenied = false;
                //        }
                //    });
                //    if (isEntireClaimDenied) {
                //        $scope.Denail.AppealScope = "Entire Claim Denied";
                //    }
                //}

                if (row.RequestTypeId === 1) {
                    //$timeout(function () {
                    //    var innerContents = document.getElementById('AppealConfigPrint').innerHTML;
                    //    var popupWinindow = window.open('', 'scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                    //    popupWinindow.document.open();
                    //    popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()" class="bodyheightprint">' + innerContents + '</body></html>');
                    //    popupWinindow.document.close();
                    //}, 500);

                    eHnoteMainAppointmentService.GenerateAdjustmentRequestPdf(row)
                        .then(openPdf);
                    $scope.DisableDenailAppeal.AppealReason = true;
                    $scope.DisableDenailAppeal.RequestTypeId = true;
                    $scope.DisableDenailAppeal.ServiceDate = true;
                    $scope.DisableDenailAppeal.RequestDate = true;
                } else if (row.RequestTypeId === 3) {
                    eHnoteMainAppointmentService.GenerateTripleSAdvantageAdjustment(row)
                        .then(openPdf);
                    $scope.DisableDenailAppeal.AppealReason = true;
                    $scope.DisableDenailAppeal.RequestTypeId = true;
                    $scope.DisableDenailAppeal.ServiceDate = true;
                    $scope.DisableDenailAppeal.RequestDate = true;
                } else if (row.RequestTypeId === 4) {
                    eHnoteMainAppointmentService.GenerateMcsResubmittedClaimsPdf(row)
                        .then(openPdf);
                    $scope.DisableDenailAppeal.AppealReason = true;
                    $scope.DisableDenailAppeal.RequestTypeId = true;
                    $scope.DisableDenailAppeal.ServiceDate = true;
                    $scope.DisableDenailAppeal.RequestDate = true;
                } else if (row.RequestTypeId === 5) {
                    eHnoteMainAppointmentService.GenerateMmmAdjustmentPdf(row)
                        .then(openPdf);
                    $scope.DisableDenailAppeal.AppealReason = true;
                    $scope.DisableDenailAppeal.RequestTypeId = true;
                    $scope.DisableDenailAppeal.ServiceDate = true;
                    $scope.DisableDenailAppeal.RequestDate = true;
                } else if (row.RequestTypeId === 6) {
                    eHnoteMainAppointmentService.GenerateMsoInternalAdjustmentPdf(row)
                        .then(openPdf);
                    $scope.DisableDenailAppeal.AppealReason = true;
                    $scope.DisableDenailAppeal.RequestTypeId = true;
                    $scope.DisableDenailAppeal.ServiceDate = true;
                    $scope.DisableDenailAppeal.RequestDate = true;
                } else if (row.RequestTypeId === 7) {
                    eHnoteMainAppointmentService.GenerateMedicareAdjustmentPdf(row)
                        .then(openPdf);
                    $scope.DisableDenailAppeal.AppealReason = true;
                    $scope.DisableDenailAppeal.RequestTypeId = true;
                    $scope.DisableDenailAppeal.ServiceDate = true;
                    $scope.DisableDenailAppeal.RequestDate = true;
                } else if (row.RequestTypeId === 8) {
                    eHnoteMainAppointmentService.GenerateMapfreAdjustmentPdf(row)
                        .then(openPdf);
                    $scope.DisableDenailAppeal.AppealReason = true;
                    $scope.DisableDenailAppeal.RequestTypeId = true;
                    $scope.DisableDenailAppeal.ServiceDate = true;
                    $scope.DisableDenailAppeal.RequestDate = true;
                }else {
                    eHnoteMainAppointmentService.GenerateTripleSProfessionalAdjustment(row)
                        .then(openPdf);
                    $scope.DisableDenailAppeal.AppealReason = true;
                    $scope.DisableDenailAppeal.RequestTypeId = true;
                    $scope.DisableDenailAppeal.ServiceDate = true;
                    $scope.DisableDenailAppeal.RequestDate = true;
                }

            }
            else {
                console.log('print failed');
            }
        });
    }

    $scope.SaveDenialAppealClaims = function (item, typeid) {

        typeid = typeid || 0;

        if ($scope.AddDenialAppealObj.RequestDate == "") {
            alertify.error("Please select RequestDate");
            return false;
        }
        if ($scope.AddDenialAppealObj.RequestTypeId == "") {
            alertify.error("Please select AppealForm Type");
            return false;
        }
        if ($scope.AddDenialAppealObj.AppealReason == "") {
            alertify.error("Please Enter AppealReason");
            return false;
        }
       

        var Denialobj = {
            "UserId": $scope.UserId,
            "DenialReconsiderationHeaderId": $scope.mainObject.DenialReconsiderationHeaderId || 0,
            "PatientClaimId": $scope.mainObject.PatientClaimId,
            "PatientClaimNumber": $scope.mainObject.PatientClaimNumber,
            "PayorId": $scope.mainObject.PayorId,
            "PayorName": $scope.mainObject.PayorName,
            "RequestTypeId": $scope.AddDenialAppealObj.RequestTypeId,
            "RequestType": $scope.AddDenialAppealObj.RequestType,
            "RequestStatusId": 1,
            "RequestStatus": "Requested",
            "DenialSourceId": 2,
            "DenialSource": "ERA",
            "RequestedDate": $scope.AddDenialAppealObj.RequestDate,
            "AjustResponseReceiveDate": $scope.AddDenialAppealObj.AjustResponseReceiveDate || null,
            "RequestedByUserId": $scope.UserId,
            "PrintedFormId": null,
            "PrintedFormName": null,
            "PrintedOn": null,
            "RequestRemarks": $scope.AddDenialAppealObj.AppealReason,
            "FormS3URL": null,
            "TotalAppealedAmount": $scope.mainObject.TotalClaimAmount,
            "DeleteInd": "N",
            "BillTypeFrequencyId": $scope.AddDenialAppealObj.BillTypeFrequencyId,
            "BillTypeFrequency": $scope.AddDenialAppealObj.BillTypeFrequency,
            "ClaimLineItems": [],
            "PatientClaimTransmission": $scope.PatientClaimTransmissionObj,
            "DenialStatus": "Adjustment Request Raised",
            "DenialStatusId": 3,

        }
        $scope.ClaimLineItems = [];
        $scope.syncUnappealableDataToPatientClaimLineItems();
        if (!$scope.validateUnappealableItems()) {
            return false;
        }

        $scope.PatientClaimInfo.PatientClaimLineItems =
            $scope.PatientClaimInfo.PatientClaimLineItems.filter(function (citem) {

                return (citem.ServiceAdjustments || []).some(function (sitem) {
                    return sitem.PayorPostingStatusId == 3;
                });

            });

        angular.forEach($scope.PatientClaimInfo.PatientClaimLineItems, function (item) {
            //if (!item.IsUnappealable && item.UnappealableMarkedBy) {
            //    item.UnappealableMarkedBy = null;
            //    item.UnappealableMarkedDate = null;
            //}
            let lineItemObj = {
                DenialReconsiderationLineItemId: item.DenialReconsiderationLineItemId || 0,
                DenialReconsiderationHeaderId: $scope.mainObject.DenialReconsiderationHeaderId || 0,
                ClaimLineItemId: item.ClaimLineItemId,
                DenialReasonDescription: "",
                ChargeAmount: item.TotalChargeAmount || 0,
                InsurancePayment: item.InsurancePaymentAmount || 0,
                PatientResponsibilityAmount: item.PatientResponsibilityAmount || 0,
                AppealedAmount: 0,
                LineStatusId: 1,
                LineStatus: "Requested",
                DeleteInd: "N",
                AdjustmentCodes: [],

                IsUnappealable: item.IsUnappealable || false,
                UnappealableNote: item.UnappealableNote || null,
                UnappealableMarkedBy: item.UnappealableMarkedBy || null,
                UnappealableMarkedDate: item.UnappealableMarkedDate || null,
                IsPosted: item.IsPosted || false,
                PostedDate: item.PostedDate || null,
            };

            angular.forEach(item.ServiceAdjustments || [], function (esitem) {

                let adjObj = {
                    DenialLineItemCodeId: 0,
                    DenialReconsiderationLineItemId: item.DenialReconsiderationLineItemId || 0,
                    AdjustmentReasonCode: esitem.AdjustmentReasonCode || null,
                    AdjustmentReasonId: esitem.AdjustmentReasonId || 0,
                    AdjustmentReason: esitem.AdjustmentReason || null,
                    DeleteInd: "N"
                };

                lineItemObj.AdjustmentCodes.push(adjObj);
            });

            $scope.ClaimLineItems.push(lineItemObj);
        });
        $scope.getAppealableLineItems = function () {
            return $scope.ClaimLineItems.filter(item => !item.IsUnappealable);
        };
        //angular.forEach($scope.MasterDenialFormTypes, function (mitem) {
        //    Denialobj.RequestTypeId = mitem.AppealConfigId,
        //        Denialobj.RequestType = mitem.AppealType
        //});

        Denialobj.ClaimLineItems = $scope.ClaimLineItems;

       

        eHnoteInsuranceService.AddUpdateDenialReconsiderationRequest(Denialobj).then(function (resp) {
            console.log(resp);
            if (resp.data.rows.Status === "Success") {
                var row = resp.data.rows;

                $scope.updateUnappealablePermissions();

                if ($scope.showeditbutton) {
                    alertify.success("Payer received date has been saved");
                    return false;
                }
                row.LanguageId = $scope.selectedLanguageId || 0;
                //let ClaimLineitems = angular.copy(resp.data.rows.ClaimLineitems)||[]
                if (resp.data.rows.ClaimLineitems) {
                    resp.data.rows.ClaimLineitems = resp.data.rows.ClaimLineitems.filter(item => !item.IsUnappealable);
                }
                $scope.PatientClaimInfo.ClaimLineItemUnappealableHistory = row?.ClaimLineItemUnappealableHistory ?? [];
                $scope.DeniedServiceLines = resp.data.rows.ClaimLineitems || [];
                $scope.Denail = $scope.Adjustmentrequest();
                if (resp.data.rows.AppointmentInsuranceDetails.length > 0) {
                    $scope.Denail.Address1 = resp.data.rows.AppointmentInsuranceDetails[0].PayorAddress1 || "";
                    $scope.Denail.Address2 = resp.data.rows.AppointmentInsuranceDetails[0].PayorAddress2 || "";
                    $scope.Denail.PayorCityName = resp.data.rows.AppointmentInsuranceDetails[0].PayerCity || "";
                    $scope.Denail.PayorStateName = resp.data.rows.AppointmentInsuranceDetails[0].PayerState || "";
                    $scope.Denail.PayorCountryName = resp.data.rows.AppointmentInsuranceDetails[0].PayorCountryName || "";
                    $scope.Denail.PayorZipCode = resp.data.rows.AppointmentInsuranceDetails[0].PayerZip || "";
                    $scope.Denail.PayorCode = resp.data.rows.AppointmentInsuranceDetails[0].PayorCode || "";
                    $scope.Denail.PayorStateCode = resp.data.rows.AppointmentInsuranceDetails[0].PayorStateCode || "";
                    $scope.Denail.UserTaxonomyCode = resp.data.rows.AppointmentInsuranceDetails[0].UserTaxonomyCode || "";
                    $scope.Denail.DoctorName = resp.data.rows.AppointmentInsuranceDetails[0].DoctorName || "";
                    $scope.Denail.RelationName = resp.data.rows.AppointmentInsuranceDetails[0].RelationName || "";

                    $scope.Denail.AppointmentDate = $filter('date')(resp.data.rows.AppointmentInsuranceDetails[0].AppointmentDate, 'MM-dd-yyyy') || "";
                    $scope.Denail.InsuranceTypeCode = resp.data.rows.AppointmentInsuranceDetails[0].InsuranceTypeCode || "";
                    $scope.Denail.PayorId = resp.data.rows.AppointmentInsuranceDetails[0].PayorId || "";
                    $scope.Denail.GlobalPayorId = resp.data.rows.AppointmentInsuranceDetails[0].GlobalPayorId || "";
                    $scope.Denail.PayorName = resp.data.rows.AppointmentInsuranceDetails[0].PayorName || "";
                    $scope.Denail.PlanName = resp.data.rows.AppointmentInsuranceDetails[0].PlanName || "";
                    $scope.Denail.RelationShipId = resp.data.rows.AppointmentInsuranceDetails[0].RelationShipId || "";
                }
                console.log($scope.Denail.PlanName);
                angular.forEach($scope.DeniedServiceLines, function (item) {
                    $scope.DOSfrom = item.DOSfrom
                });
                $scope.Denail.DenialReconsiderationHeaderId = row.DenialReconsiderationHeaderId;
                $scope.DenialReconsiderationHeaderId = row.DenialReconsiderationHeaderId;
                $scope.Denail.PatientClaimId = row.PatientClaimId;
                $scope.Denail.PatientClaimNumber = row.PatientClaimNumber;
                $scope.Denail.RequestTypeId = row.RequestTypeId;
                $scope.Denail.RequestType = row.RequestType;
                $scope.Denail.RequestStatusId = row.RequestStatusId;
                $scope.Denail.RequestStatus = row.RequestStatus;
                $scope.Denail.DenialSourceId = row.DenialSourceId;
                $scope.Denail.DenialSource = row.DenialSource;
                $scope.Denail.RequestedDate = row.RequestedDate;
                $scope.Denail.RequestedByUserId = row.RequestedByUserId;
                $scope.Denail.RequestRemarks = row.RequestRemarks;
                $scope.Denail.TotalAppealedAmount = row.TotalAppealedAmount;
                $scope.Denail.RenderingProviderName = row.RenderingProviderName;
                //$scope.Denail.PayorAddress2 = row.PayorAddress2
                //$scope.Denail.PayorAddress1 = row.PayorAddress1
                //$scope.Denail.PayerCity = row.PayerCity
                //$scope.Denail.PayerState = row.PayerState
                //$scope.Denail.PayerZip = row.PayerZip
                $scope.Denail.OrganizationAddress1 = row.OrganizationAddress1;
                $scope.Denail.OrganizationAddress2 = row.OrganizationAddress2;
                $scope.Denail.OrganizationCity = row.OrganizationCity;
                $scope.Denail.OrganizationName = row.OrganizationName;
                $scope.Denail.OrganizationState = row.OrganizationState;
                $scope.Denail.OrganizationZipCode = row.OrganizationZipCode;
                $scope.Denail.Country = row.Country;
                $scope.Denail.TINNo = row.TINNo
                var obj = eHnoteUserDataService.UsMobileFormatChange(row.MobileNo);
                $scope.Denail.MobileNo = obj.UsFormatMobileNumber;
                $scope.Denail.UserName = row.UserName;
                $scope.Denail.NPI = row.NPI;
                $scope.Denail.FaxNo = row.FaxNo;
                $scope.Denail.PayerClaimControlNumber = row.PayerClaimControlNumber;
                $scope.Denail.SignatureOfUser = row.SignatureOfUser
                if ($scope.Denail.SignatureOfUser && !$scope.Denail.SignatureOfUser.startsWith('data:image')) {
                    $scope.Denail.SignatureOfUser = 'data:image/png;base64,' + $scope.Denail.SignatureOfUser;
                }
                $scope.trustedSignature = $sce.trustAsResourceUrl($scope.Denail.SignatureOfUser);
                var patient = (row.AppointmentInsuranceDetails || [])[0] || {};
                $scope.Denail.PatientDetails = {
                    PatientId: patient.PatientId,
                    PatientName: patient.PatientName,
                    MRNo: patient.PatientMrNo,
                    Gender: patient.PatientGender,
                    Age: patient.PatientAgeInYear
                };
                //$scope.Denail.AppealScope = "Partial Claim Denied";
                //if ($scope.DeniedServiceLines && $scope.DeniedServiceLines.length > 0) {
                //    var isEntireClaimDenied = true;
                //    angular.forEach($scope.DeniedServiceLines, function (item) {
                //        var insurancePayment = Number(item.InsurancePaymentAmount || 0);
                //        var paidAmount = Number(item.PaidAmount || 0);
                //        if (insurancePayment !== 0 || paidAmount !== 0) {
                //            isEntireClaimDenied = false;
                //        }
                //    });
                //    if (isEntireClaimDenied) {
                //        $scope.Denail.AppealScope = "Entire Claim Denied";
                //    }
                //}

                if (typeid == 2) {
                    alertify.success("Updated successfully");
                    return false;
                }

                //angular.forEach(resp.data.rows.ClaimLineitems, function (citem, index) {
                //    var Tcount = 0;
                //    angular.forEach(citem.ServiceAdjustments, function (sitem) {
                //        if (sitem.PayorPostingStatusId == 2) {
                //            Tcount++;
                //        }
                //    });
                //    var insurancePayment = parseFloat(citem.InsurancePayment) || 0;
                //    var patientResponsibility = parseFloat(citem.PatientResponsibilityAmount) || 0;
                //    var unitCharge = parseFloat(citem.UnitCharge) || 0;
                //    if (Tcount > 0 && unitCharge === (insurancePayment + patientResponsibility)) {
                //        resp.data.rows.ClaimLineitems.splice(index, 1);
                //    }
                //});


                if (item === 1) {
                    //$timeout(function () {
                    //    var innerContents = document.getElementById('AppealConfigPrint').innerHTML;
                    //    var popupWinindow = window.open('', 'scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                    //    popupWinindow.document.open();
                    //    popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()" class="bodyheightprint">' + innerContents + '</body></html>');
                    //    popupWinindow.document.close();
                    //}, 500);

                    eHnoteMainAppointmentService.GenerateAdjustmentRequestPdf(row)
                        .then(openPdf);
                    $scope.DisableDenailAppeal.AppealReason = true;
                    $scope.DisableDenailAppeal.RequestTypeId = true;
                    $scope.DisableDenailAppeal.ServiceDate = true;
                    $scope.DisableDenailAppeal.RequestDate = true;
                    //$scope.AddDenialAppealObj = angular.copy($scope.DenialAppealObj());
                    $scope.showeditbutton = true;
                } else if (item === 3) {
                    eHnoteMainAppointmentService.GenerateTripleSAdvantageAdjustment(row)
                        .then(openPdf);
                    $scope.DisableDenailAppeal.AppealReason = true;
                    $scope.DisableDenailAppeal.RequestTypeId = true;
                    $scope.DisableDenailAppeal.ServiceDate = true;
                    $scope.DisableDenailAppeal.RequestDate = true;
                    //$scope.AddDenialAppealObj = angular.copy($scope.DenialAppealObj());
                    $scope.showeditbutton = true;
                } else if (item === 4) {
                    eHnoteMainAppointmentService.GenerateMcsResubmittedClaimsPdf(row)
                        .then(openPdf);
                    $scope.DisableDenailAppeal.AppealReason = true;
                    $scope.DisableDenailAppeal.RequestTypeId = true;
                    $scope.DisableDenailAppeal.ServiceDate = true;
                    $scope.DisableDenailAppeal.RequestDate = true;
                    $scope.showeditbutton = true;
                } else if (item === 5) {
                    eHnoteMainAppointmentService.GenerateMmmAdjustmentPdf(row)
                        .then(openPdf);
                    $scope.DisableDenailAppeal.AppealReason = true;
                    $scope.DisableDenailAppeal.RequestTypeId = true;
                    $scope.DisableDenailAppeal.ServiceDate = true;
                    $scope.DisableDenailAppeal.RequestDate = true;
                    $scope.showeditbutton = true;
                } else if (item === 6) {
                    eHnoteMainAppointmentService.GenerateMsoInternalAdjustmentPdf(row)
                        .then(openPdf);
                    $scope.DisableDenailAppeal.AppealReason = true;
                    $scope.DisableDenailAppeal.RequestTypeId = true;
                    $scope.DisableDenailAppeal.ServiceDate = true;
                    $scope.DisableDenailAppeal.RequestDate = true;
                    $scope.showeditbutton = true;
                } else if (item === 7) {
                    eHnoteMainAppointmentService.GenerateMedicareAdjustmentPdf(row)
                        .then(openPdf);
                    $scope.DisableDenailAppeal.AppealReason = true;
                    $scope.DisableDenailAppeal.RequestTypeId = true;
                    $scope.DisableDenailAppeal.ServiceDate = true;
                    $scope.DisableDenailAppeal.RequestDate = true;
                    $scope.showeditbutton = true;
                } else if (item === 8) {
                    eHnoteMainAppointmentService.GenerateMapfreAdjustmentPdf(row)
                        .then(openPdf);
                    $scope.DisableDenailAppeal.AppealReason = true;
                    $scope.DisableDenailAppeal.RequestTypeId = true;
                    $scope.DisableDenailAppeal.ServiceDate = true;
                    $scope.DisableDenailAppeal.RequestDate = true;
                    $scope.showeditbutton = true;
                } else {
                    eHnoteMainAppointmentService.GenerateTripleSProfessionalAdjustment(row)
                        .then(openPdf);
                    $scope.DisableDenailAppeal.AppealReason = true;
                    $scope.DisableDenailAppeal.RequestTypeId = true;
                    $scope.DisableDenailAppeal.ServiceDate = true;
                    $scope.DisableDenailAppeal.RequestDate = true;
                    $scope.showeditbutton = true;
                    //$scope.AddDenialAppealObj = angular.copy($scope.DenialAppealObj());
                }

                $scope.GetDenialReconsiderationRequest();
            }
            else {
                console.log('print failed');
            }
        });


    }
    function openPdf(response) {
        var blob = new Blob([response.data], { type: 'application/pdf' });
        var url = URL.createObjectURL(blob);
        window.open(url);
    }

    $scope.GetPatientDetailsForUBformDetailsinBiller = function (item, type) {

        item.PatientClaimId = item.PatientClaimId || 0;

        eHnoteInsuranceService.GetParticularClaimDetailsById(item.PatientClaimId).then(function (resp) {

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

                    $scope.UBDetailsInfo.IOrganizationPayorName = $scope.UBDetailsInfo.InsuranceDetails[0].OrganizationPayorName || "";

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


                //var filteredList = $filter("filter")($scope.allUserList, { "DoctorID": resp.data.RenderingProviderId }, true) || [];
                //if (filteredList.length > 0) {
                //    $scope.UBDetailsInfo.Box79FirstName = filteredList[0].FirstName || '';
                //    $scope.UBDetailsInfo.Box79LastName = filteredList[0].LastName || '';
                //    $scope.UBDetailsInfo.Box79ValueNPI = filteredList[0].NPI || '';
                //}


                var filtredArray = $filter("filter")(resp.data.AppointmentInsuranceDetails, { "PatientInsuranceDetailId": resp.data.TransmitQueuePatientInsuranceId }, true) || [];

                if (filtredArray.length > 0) {
                    if (filtredArray[0].Box79TypeId == "1") {  //Billing provider
                        var filterProviderList = $filter("filter")($scope.OrganizationBillingProviderList, { "OrganizationBillingProviderId": resp.data.BillingProviderId }, true)[0] || [];
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
                        var filterProviderList = $filter("filter")($scope.OrganizationBillingProviderList, { "OrganizationBillingProviderId": resp.data.BillingProviderId }, true)[0] || [];
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
                        let filterProviderList = $filter("filter")($scope.OrganizationBillingProviderList, function (item) {
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
                            return item.DoctorID == resp.data.VisitProviderId;
                        }) || [];
                        if (fRenderingobj.length > 0) {

                            $scope.UBDetailsInfo.AttendingProviderObj.FirstName = fRenderingobj[0].FirstName || "";

                            $scope.UBDetailsInfo.AttendingProviderObj.LastName = fRenderingobj[0].LastName || "";

                            $scope.UBDetailsInfo.AttendingProviderObj.NPI = fRenderingobj[0].NPI || "";

                            $scope.UBDetailsInfo.AttendingProviderObj.UPIN = fRenderingobj[0].UPIN && fRenderingobj[0].UPIN != "" ? fRenderingobj[0].UPIN : "0000000000";
                        }
                    } else if (filtredArray[0].Box76TypeId == "3") {//Facility
                        //let filetrbranch = $filter("filter")($scope.BranchServiceLocations, function (item) { return item.BranchServiceLocationId === $scope.mainClaimObject.BranchServiceLocationId; }) || [];

                        //if (filetrbranch.length > 0) {

                        $scope.UBDetailsInfo.AttendingProviderObj.FirstName = resp.data.FacilityName || '';

                            $scope.UBDetailsInfo.AttendingProviderObj.LastName = "";

                        $scope.UBDetailsInfo.AttendingProviderObj.NPI = resp.data.FacilityNPI || '';

                        //    $scope.UBDetailsInfo.AttendingProviderObj.UPIN = "0000000000";
                        /*}*/
                    }

                    if ($scope.ParentHospitalId != 2) {

                    if (filtredArray[0].Box77TypeId == "1") {   // Billing Provider

                        //var filterProviderList = $filter("filter", $scope.ClaimProviderList, { "OrganizationBillingProviderId": resp.data.BillingProviderId }, true) || [];
                        let filterProviderList = $filter("filter")($scope.OrganizationBillingProviderList, function (item) { return item.OrganizationBillingProviderId === $scope.mainClaimObject.BranchServiceLocationId; }) || [];


                        if (filterProviderList.length > 0) {

                            $scope.UBDetailsInfo.OperatingProviderObj.FirstName = filterProviderList[0].BillingProviderName || "";

                            $scope.UBDetailsInfo.OperatingProviderObj.LastName = "";

                            $scope.UBDetailsInfo.OperatingProviderObj.NPI = filterProviderList[0].Box33GroupNPI || "";
                        }

                    }
                    else if (filtredArray[0].Box77TypeId == "2") {   // Rendering Provider

                        //var fRenderingobj = $filter("filter", $scope.filteredBranchDoctorsList, { "DoctorID": $scope.mainClaimObject.VisitProviderId }, true) || [];
                        let fRenderingobj = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID === resp.data.VisitProviderId; }) || [];


                        if (fRenderingobj.length > 0) {

                            $scope.UBDetailsInfo.OperatingProviderObj.FirstName = fRenderingobj[0].FirstName || "";

                            $scope.UBDetailsInfo.OperatingProviderObj.LastName = fRenderingobj[0].LastName || "";

                            $scope.UBDetailsInfo.OperatingProviderObj.NPI = fRenderingobj[0].NPI || "";
                        }

                    }
                    else if (filtredArray[0].Box77TypeId == "3") {   // Facility

                        //let filetrbranch = $filter("filter", $scope.BranchServiceLocations, function (item) { return item.BranchServiceLocationId === $scope.mainClaimObject.BranchServiceLocationId; });

                        //if (filetrbranch.length > 0) {

                            $scope.UBDetailsInfo.OperatingProviderObj.FirstName = resp.data.FacilityName || '';

                            $scope.UBDetailsInfo.OperatingProviderObj.LastName = "";

                        $scope.UBDetailsInfo.OperatingProviderObj.NPI = resp.data.FacilityNPI || '';
                        /*}*/

                    }

                    }
                }

                $scope.UBDetailsInfo.Appointment.AdmissionDate = resp.data.AdmissionDate;
                $scope.UBDetailsInfo.Appointment.AppointmentType = resp.data.AdmissionType;
                $scope.UBDetailsInfo.Appointment.AppointmentSource = resp.data.SourceOfAdmission;
                $scope.UBDetailsInfo.PatientControlNumber = resp.data.PatientClaimNumber;
                $scope.UBDetailsInfo.CurrentResponsibilityId = resp.data.CurrentResponsibilityId;

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

                //    $scope.UBDetailsInfo.OperatingProviderObj.FirstName = fRenderingobj[0].FirstName || "";
                //    $scope.UBDetailsInfo.OperatingProviderObj.LastName = fRenderingobj[0].LastName || "";
                //    $scope.UBDetailsInfo.OperatingProviderObj.NPI = fRenderingobj[0].NPI || "";
                //}

                if (resp.data.PatientClaimLineItems.length > 0) {
                    angular.forEach($scope.UBDetailsInfo.RevenueList, function (oitem) {
                        angular.forEach(resp.data.PatientClaimLineItems, function (ditem, index) {

                            var TotalChargeIntegerNumber = Math.floor(ditem.TotalChargeAmount) || 0;
                            var TotalChargeDecimalNumber = Math.round((ditem.TotalChargeAmount - TotalChargeIntegerNumber) * 100);

                            if (TotalChargeDecimalNumber == 0) {
                                TotalChargeDecimalNumber = '00';
                            }

                            if (index === oitem.Sno) {
                                oitem.Modifier1 = ditem.Modifier1 || "";
                                oitem.Modifier2 = ditem.Modifier2 || "";
                                oitem.Modifier3 = ditem.Modifier3 || "";
                                oitem.Modifier4 = ditem.Modifier4 || "";
                                oitem.Code = ditem.ServiceCode || "";
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



    $scope.changeBillingTransmissionMethod = function (Id) {
      
        var filtredArray = $filter("filter")($scope.masterBillingFrequencyTypes, { "TransmissionTypeId": Id }, true);
        $scope.AddDenialAppealObj.TransmissionMethod = filtredArray[0].TransmissionTypeName;
        $scope.AddDenialAppealObj.BillTypeFrequencyId = filtredArray[0].TransmissionTypeId;
        $scope.AddDenialAppealObj.BillTypeFrequency = filtredArray[0].TransmissionTypeName; 
        $scope.AddDenialAppealObj.BillTypeFrequencyCode = filtredArray[0].TransmissionTypeCode;
        $scope.PatientClaimTransmissionObj.BillTypeFrequencyCode = filtredArray[0].TransmissionTypeCode;
        $scope.PatientClaimTransmissionObj.TransmissionMethodId = Id;
        $scope.PatientClaimTransmissionObj.TransmissionMethod = $scope.AddDenialAppealObj.TransmissionMethod;

        
    }
    $scope.ChangeDenialFormTypes = function (Id) {

        var selectedItem = $scope.MasterDenialFormTypes.find(x => x.AppealConfigId == Id);

        if (selectedItem) {
            $scope.AddDenialAppealObj.RequestType =
                selectedItem.AppealType;
        }
    };


    $scope.openPostPaymentPopupNew = function (item, type) {
        let mainObject = {
            "PatientId": item.PatientId,
            "PatientFullName": item.PatientFullName,
            "AppointmentId": item.AppointmentId,
            "AppointmentTypeId": item.AppointmentTypeId,
            "PatientClaimId": item.PatientClaimId,
            "EOBId": item.EOBId,
            "ReferenceNumber": item.ReferenceNumber,
            "EOBClaimInfoId": item.EOBClaimInfoId,
            "IsCapitationInd": false,
            "CapitationDiscount": null,
            "PayorId": item.PayorId,
            "PostingDate": item.PostingDate,
            "TotalUnAppliedAmount": item.TotalUnAppliedAmount,
            "TotalPaymentAmount": item.TotalPaymentAmount,
            "EraId": item.EraId,
            "Type": type || '',
            "ClaimTypeId": item.ClaimTypeId || 2,
            "ProcessingTypeId": item.ProcessingTypeId,
            "TotalAppliedAmount": item.TotalAppliedAmount,
            "IsShowPostPaymentBtnInd": $scope.IsShowPostPaymentBtnInd || false
        }

        let mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/PostPaymentpopup.html",
            "controller": "UsPostPaymentpopupCtrl",
            //"size": "lg",
            "backdrop": "static",
            "keyboard": false,
            "resolve": {
                "mainObject": function () { return angular.copy(mainObject); },
                "AllHospitalData": function () { return $scope.mainBillerDataObj; },
                "mainEOBPaymentPostingObj": function () { return angular.copy(item) },
            },
            "windowClass": "modal__popup--1",

        });
        mInstanceAdd.result.then(function (resp) {
            if (resp && resp.status === "Success") {
                let paymentSummary = resp?.data?.data?.rows || null;
                if (paymentSummary) {
                    $scope.mainObject.TotalInsurancePayment = paymentSummary.TotalInsurancePayment
                    $scope.mainObject.TotalBalance = paymentSummary.TotalBalance
                }
                $scope.init();
            }
            
            
        }, function () {

        });
    };
    $scope.onUnappealableChange = function (item) {
        if (!item.IsUnappealable) {
            item.UnappealableNote = '';
            //item.UnappealableMarkedBy = null;
            //item.UnappealableMarkedDate = null;
            item.IsPosted = false;
            item.PostedDate = null;
        } else {
            item.UnappealableMarkedBy = $scope.UserId;
            item.UnappealableMarkedDate = $filter('date')(new Date(), "MM/dd/yyyy");
            item.IsPosted = false;
            item.PostedDate = null;
        }
        $scope.syncUnappealableDataToPatientClaimLineItems();

    };
    $scope.validateUnappealableItems = function () {
        var invalid = [];
        angular.forEach($scope.PatientClaimInfo.PatientClaimLineItems, function (item) {
            if (item.IsUnappealable && !item.UnappealableNote) {
                invalid.push(item.ServiceCode || 'Line Item');
            }
        });

        if (invalid.length > 0) {
            alertify.error('Please provide notes for: ' + invalid.join(', '));
            return false;
        }
        return true;
    };
    // ADD THIS NEW FUNCTION - Syncs EOBClaimSummaryDetails with PatientClaimLineItems
    $scope.syncUnappealableDataToPatientClaimLineItems = function () {
        if (!$scope.EOBClaimSummaryDetails || !$scope.PatientClaimInfo ||
            !$scope.PatientClaimInfo.PatientClaimLineItems) {
            return;
        }

        // Create a map for fast lookup
        var patientLineItemMap = {};
        angular.forEach($scope.PatientClaimInfo.PatientClaimLineItems, function (pItem) {
            patientLineItemMap[pItem.ClaimLineItemId] = pItem;
        });

        // Sync from EOB to PatientClaimLineItems
        angular.forEach($scope.EOBClaimSummaryDetails, function (data) {
            angular.forEach(data.EOBClaimLineItems, function (eobItem) {
                var patientItem = patientLineItemMap[eobItem.ClaimLineItemId];
                if (patientItem) {
                    // Copy unappealable fields from EOB to Patient line items
                    patientItem.IsUnappealable = eobItem.IsUnappealable || false;
                    patientItem.UnappealableNote = eobItem.UnappealableNote || null;
                    patientItem.UnappealableMarkedBy = eobItem.UnappealableMarkedBy || null;
                    patientItem.UnappealableMarkedDate = eobItem.UnappealableMarkedDate || null;
                    patientItem.IsPosted = eobItem.IsPosted || false;
                    patientItem.PostedDate = eobItem.PostedDate || null;
                }
            });
        });
    };
    // ADD THIS NEW FUNCTION - Loads saved unappealable data from backend
    $scope.loadUnappealableDataFromBackend = function () {
        if (!$scope.EOBClaimSummaryDetails || !$scope.PatientClaimInfo ||
            !$scope.PatientClaimInfo.PatientClaimLineItems) {
            return;
        }

        // Create a map of saved data
        var savedDataMap = {};
        angular.forEach($scope.PatientClaimInfo.PatientClaimLineItems, function (pItem) {
            if (pItem.IsUnappealable || pItem.IsPosted) {
                savedDataMap[pItem.ClaimLineItemId] = {
                    IsUnappealable: pItem.IsUnappealable || false,
                    UnappealableNote: pItem.UnappealableNote || null,
                    UnappealableMarkedBy: pItem.UnappealableMarkedBy || null,
                    UnappealableMarkedDate: pItem.UnappealableMarkedDate || null,
                    IsPosted: pItem.IsPosted || false,
                    PostedDate: pItem.PostedDate || null
                };
            }
        });

        // Apply saved data to EOB items for display
        angular.forEach($scope.EOBClaimSummaryDetails, function (data) {
            angular.forEach(data.EOBClaimLineItems, function (eobItem) {
                var savedData = savedDataMap[eobItem.ClaimLineItemId];
                if (savedData) {
                    eobItem.IsUnappealable = savedData.IsUnappealable;
                    eobItem.UnappealableNote = savedData.UnappealableNote;
                    eobItem.UnappealableMarkedBy = savedData.UnappealableMarkedBy;
                    eobItem.UnappealableMarkedDate = savedData.UnappealableMarkedDate;
                    eobItem.IsPosted = savedData.IsPosted;
                    eobItem.PostedDate = savedData.PostedDate;
                }
            });
        });
    };
    // Add this new function in UsDenialReviewPopupCtrl.js

    $scope.SaveUnappealableStatusOnly = function () {
    

        // Sync data
        $scope.syncUnappealableDataToPatientClaimLineItems();
        // Validate first
        if (!$scope.validateUnappealableItems()) {
            return false;
        }
        // Build request
        var request = {
            UserId: $scope.UserId,
            PatientClaimId: $scope.mainObject.PatientClaimId,
            LineItems: [],
            DenialReconsiderationHeaderId: $scope.mainObject.DenialReconsiderationHeaderId || 0,

        };

        // Only send items that have IsUnappealable or IsPosted set
        angular.forEach($scope.PatientClaimInfo.PatientClaimLineItems, function (item) {
            if ((item.IsUnappealable || item.IsPosted) || (!item.IsUnappealable && item.UnappealableMarkedBy)) {
                //if (!item.IsUnappealable && item.UnappealableMarkedBy) {
                //    item.UnappealableMarkedBy = null;
                //    item.UnappealableMarkedDate = null;
                //}
                request.LineItems.push({
                    ClaimLineItemId: item.ClaimLineItemId,
                    IsUnappealable: item.IsUnappealable || false,
                    UnappealableNote: item.UnappealableNote || null,
                    UnappealableMarkedBy: item.UnappealableMarkedBy || null,
                    UnappealableMarkedDate: item.UnappealableMarkedDate || null,
                    IsPosted: item.IsPosted || false,
                    PostedDate: item.PostedDate || null
                });
            }
        });

        if (request.LineItems.length === 0) {
            alertify.error('No changes to save');
            return;
        }

        // Call API
        eHnoteInsuranceService.SaveUnappealableLineItems(request).then(function (resp) {
            if (resp.data.status === 'Success') {
                alertify.success('Unappealable status saved successfully');
                // Optionally reload data
                $scope.init();
            } else {
                alertify.error(resp.data.message || 'Failed to save');
            }
        });
    };
    // ============================================================
    // UNAPPEALABLE STATUS PERMISSIONS
    // ============================================================

    // Update permissions based on current state
    $scope.updateUnappealablePermissions = function () {
        var denialHeaderId = $scope.mainObject && $scope.mainObject.DenialReconsiderationHeaderId
            ? $scope.mainObject.DenialReconsiderationHeaderId
            : 0;

        // RULE 1: Before adjustment request raised
        if (denialHeaderId === 0) {
            $scope.canSaveUnappealable = false;
            $scope.canEditUnappealable = true;
            return;
        }

        // RULE 2: After adjustment request raised - edit mode
        if (denialHeaderId > 0 && $scope.showeditbutton) {
            $scope.canSaveUnappealable = true;
            $scope.canEditUnappealable = false;
            return;
        }

        // RULE 3: View/summary mode
        $scope.canSaveUnappealable = false;
        $scope.canEditUnappealable = true;
    };

    // Initialize permissions
    $scope.canSaveUnappealable = false;
    $scope.canEditUnappealable = true;
    $scope.unappealableStatusMessage = "";
    $scope.UanappealHistorylinfo = {
        templateUrl: 'UanappealHistorylinfo.html',
    };
}]);

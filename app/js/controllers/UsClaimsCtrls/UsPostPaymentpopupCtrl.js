
"use strict";
eHnoteWebApp.controller("UsPostPaymentpopupCtrl", ["$scope", "$uibModal", "$uibModalInstance", "eHnotePatientDataService", "mainObject", "eHnoteMasterDataService", "$filter", "$q", "eHnoteSettingsDataService", "eHnoteInsuranceService", "alertify", "$timeout", "eHnoteUserDataService", "AllHospitalData", "datapersistanceFactory", "eHnoteMainAdminServices", "localStorageFactory", "eHnoteUserAppointmentDataService", "mainEOBPaymentPostingObj","$location",
    function ($scope, $uibModal, $uibModalInstance, eHnotePatientDataService, mainObject, eHnoteMasterDataService, $filter, $q, eHnoteSettingsDataService, eHnoteInsuranceService, alertify, $timeout, eHnoteUserDataService, AllHospitalData, datapersistanceFactory, eHnoteMainAdminServices, localStorageFactory, eHnoteUserAppointmentDataService, mainEOBPaymentPostingObj, $location) {


        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.UserId = eHnoteMasterDataService.getLoginId();

        console.log($scope.UserId + "__UserId");

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
        var mObj = datapersistanceFactory.getItem("masterDataArrays");
        $scope.OrganizationSettingsData = datapersistanceFactory.getItem("OrganizationSettingsData");
        $scope.IsChargeEditedInd = false;
        if ($scope.OrganizationSettingsData.BillingSettings.IsChargeEditedInd) {
            $scope.IsChargeEditedInd = true;
        }

        $scope.isIojOrgEnable = false;
        var currenturl = $location.absUrl().split('?')[0];
        var CurrentEnvironment = currenturl.split('/#')[0];
        if (CurrentEnvironment == "https://ioj.ehnote.com" || CurrentEnvironment == "https://insts.ehnote.com" || CurrentEnvironment == "https://ehnqaehr.azurewebsites.net") {
            $scope.isIojOrgEnable = true;
        };

        $scope.IsSecondaryChargeEditInd = false;
        if ($scope.OrganizationSettingsData.BillingSettings.IsSecondaryChargeEditInd) {
            $scope.IsSecondaryChargeEditInd = true;
        }
        console.log($scope.OrganizationSettingsData);
        $scope.masterPaymentModes = [];
        if (mObj.PaymentModes && mObj.PaymentModes.length > 0) {
            $scope.masterPaymentModes = mObj.PaymentModes;

        }
        var isInformationalForwarding = false;
        var hasMA01 = false;
        var hasMA18 = false;

        $scope.uibclose = function () {
            $uibModalInstance.dismiss("cancel");
        };
        $scope.ClaimTypeId = mainObject.ClaimTypeId || 2;
        $scope.IsShowPostPaymentBtnInd = mainObject.IsShowPostPaymentBtnInd || false;

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

        $scope.CurreDate = $filter("date")(new Date(), "yyyy-MM-dd");
        $scope.CurrentPostDate = $filter("date")(new Date(), "MM-dd-yyyy");

        $scope.GetClaimLineItemObj = function () {
            let Obj = {
                "EOBLineItemId": 0,
                "ClaimLineItemId": 0,
                "PatientClaimId": 0,
                "ServiceId": 0,
                "ServiceName": "",
                "ServiceObj": "",
                "ServiceCode": "",
                "OrganizationProcedureId": null,
                "DOSfrom": "",
                "DOSto": null,
                "PlaceOfServiceId": null,
                "PlaceOfServiceName": "",
                "UnitCharge": 0,
                "Quantity": "",
                "Modifier1": "",
                "Modifier2": "",
                "Modifier3": "",
                "Modifier4": "",
                "DiagnosisPointers": "",
                "DiagnosisIds": "",
                "ServiceAdjustments": [],
                "DenialCodes": [],
                "DiagnosisList": [],
                "RevenueBillingCode": "",
                "RevenueBillingCodeId": null,
                "RenderingProviderId": null,
                "TypeOfServiceId": null,
                "TotalChargeAmount": 0,
                "InsurancePaymentAmount": 0,
                "AllowedAmount": 0,
                "CoPaymentAmount": 0,
                "AdjustmentAmount": 0,
                "DeductibleAmount": 0,
                "CoInsuranceAmount": 0,
                "PatientResponsibilityAmount": 0,
                "PatientPaymentAmount": 0,
                "WriteOffAmount": 0,
                "InsuranceBalance": 0,
                "PatientBalance": 0,
                "TotalBalance": 0,
                "DenialCodePointers": "",
                "DeleteInd": "N",
                "addedDiagnosisArray": [],//temporary diagnosis not for db
                "CurrentAllowedAmount": 0,
                "CurrentInsurancePaymentAmount": 0,
                "CurrentDeductibleAmount": 0,
                "CurrentAdjustmentAmount": 0,
                "CurrentCoInsuranceAmount": 0,
                "CurrentCoPaymentAmount": 0,
                "CurrentPatientResponsibilityAmount": 0,
                "CurrentWriteOffAmount": 0,
                "CurrentInsuranceBalance": 0,
                "CurrentPatientBalance": 0,
                "CurrentTotalBalance": 0,
                "CurrentServiceAdjustmentAmount": 0,
                "CurrentTotalChargeAmount": 0,
                "IsAllowedAmount": false,
                "IsInsurancePaymentAmount": false,
                "IsDeductibleAmount": false,
                "IsAdjustmentAmount": false,
                "IsCoInsuranceAmount": false,
                "IsCoPaymentAmount": false,
                "IsPatientResponsibilityAmount": false,
                "IsWriteOffAmount": false,
                "IsPatientBalanceReceived": false,
                "IsPatientPaymentDone": false,




            }
            return Obj;
        };
        $scope.GetNewClaimTransmissionObj = function () {
            let obj = {
                "IsChecked": false,
                "ClaimTransmissionId": 0,
                "PatientClaimId": 0,
                "PayorId": null,
                "PatientInsuranceDetailId": null,
                "AppointmentInsuranceDetailId": null,
                "OrganizationPayorId": null,
                "PriorAuthorizationNumber": "",
                "ClaimSubmissionDate": null,
                "ClaimSubmissionBy": "",
                "TransmissionTypeId": 0,
                "TransmissionType": "", //EDI or Paper
                "TransmissionMethodId": null,
                "TransmissionMethod": "", //New Claim or CorrectedClaim
                "TransmissionStatusId": null,
                "TransmissionStatus": "",//Sent or Processing
                "InsuranceLevelId": null,
                "InsuranceLevel": "",
                "ClearingHouseStatusId": null,
                "ClearingHouseControlNumber": "",
                "ClearingHouseResponseDate": "",
                "ClearingHouseResponseStatus": "",
                "ClearingHouseResponseStatusId": null,
                "PayerResponseDate": "",
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
                "ClaimVerifiedBy": "",
                "ClaimVerifiedDate": "",
                "OrganizationClearingHouseId": null,
                "ClearingHouseName": "",
                "MasterClearingHouseId": null,
                "ClearingHouseTypeId": null,
                "ClearingHouseType": "",
                "CurrentResponsibilityId": null,
                "CurrentResponsibility": "",
                "TotalClaimAmount": 0,
                "InsurancePaymentAmount": 0,
                "PatientResponsibilityAmount": 0,
                "CoInsuranceAmount": 0,
                "DeductibleAmount": 0,
                "AllowedAmount": 0,
                "AdjustmentAmount": 0,
                "OtherAdjustmentAmount": 0,
                "WriteOffAmount": 0
            }
            return obj;
        }

        $scope.PatientClaimTransmissionObj = $scope.GetNewClaimTransmissionObj();
        $scope.IsPaidbyEdit = false;
        $scope.getMainClaimObject = function () {
            let obj = {
                "UserId": $scope.UserId,
                "IsClaimEdit": false,
                "IsSecondaryInsuranceProcessed": false,
                "SuperBillId": null,
                "ActionType": "",
                "EOBClaimInfoId": 0,
                "PatientClaimId": 0,
                "PatientClaimNumber": "",
                "PatientId": mainObject.PatientId,
                "PatientFullName": mainObject.PatientFullName,
                "AppointmentId": mainObject.AppointmentId,
                "AppointmentDate": "",
                "PostingDate": $filter('date')($scope.CurrentPostDate, "MM-dd-yyyy"),// mainObject.PostingDate
                "ClaimDate": $filter('date')($scope.CurreDate, "yyyy-MM-dd"),
                "OrganizationId": $scope.HospitalId,
                "IsSecondaryInsuranceAvailable": false,
                "RenderingProviderId": null,
                "PrimaryInsuranceId": null,
                "PrimaryInsuranceDateOfSubmission": null,
                "PrimaryInsuranceAuthorizationNumber": "",
                "SecondaryInsuranceId": null,
                "PatientInsuranceDetailId": null,
                "SecondaryInsuranceDateOfSubmission": "",
                "SecondaryInsuranceAuthorizationNumber": "",
                "TransmitQueuePatientInsuranceId": 0,
                "TransmitQueueType": "",
                "TransmitQueueTypeId": null,
                "Transmit": 0,
                "ClaimStatusId": 1,
                "ClaimStatus": "Not Submitted",
                "ERAPaidBy": 0,
                "DeleteInd": "N",
                "TotalClaimAmount": 0,
                "TotalAllowedAmount": 0,
                "TotalInsurancePayment": 0,
                "FinalInsurancePayment": 0,
                "FinalClaimBalance": 0,
                "TotalClaimAdjustmentAmount": 0,
                "TotalAdjustmentAmount": 0,
                "TotalCopayAmount": 0,
                "TotalCoInsuranceAmount": 0,
                "TotalDeductibleAmount": 0,
                "TotalPaymentAmount": 0,
                "TotalPatientPayment": 0,
                "TotalWriteOffAmount": 0,
                "TotalInsuranceBalance": 0,
                "FinalPatientResponsibility": 0,
                "FinalAdjustmentAmount": 0,
                "TotalClaimBalance": 0,
                "TotalDepositAvailable": 0,
                "TotalPatientBalance": 0,
                "FinalPatientBalance": 0,
                "TotalPreviousPaidAmount": 0,
                "TotalPreviousInsurancePaidAmount": 0,
                "TotalPreviousPatientPaidAmount": 0,
                "TotalPatientResponsibilityAmount": 0,
                "TotalBalance": 0,
                "FinalTotalBalance": 0,
                "PlanName": "",
                "PayorId": 0,
                "IdentifierId": 0,
                "SecondaryPayerName": "",
                "PatientClaimLineItems": [],
                "AllServiceAdjustmentsList": [],
                "ReferenceNumber": mainObject.ReferenceNumber || "",
                "IsCurrentPatientBalanceInd": false,
                "TotalRefundAmount": 0,
                "IsPaidbyEdit": false,
                "IsClearAction": false,
                "EOBPayorName": "",
                "EOBPayorId": 0,
                "TotalPreviousInsurancePaymentAmount": 0,
                "TotalPreviousPatientPaymentAmount": 0,
                "TotalPreviousInsuranceAdjustmentAmount": 0,
                "IsSecondaryChargeEditedClaim": 0,
                "InsuranceIdentifierId": 1
            };
            return obj;
        };

        $scope.IsShowPostandCreateSecClaimbtn = false;

        $scope.DenialCodesArray = [];
        $scope.filteredDenialCodesArray = [];

        var mObj = datapersistanceFactory.getItem("masterDataArrays");
        if (mObj.DepositTypes && mObj.DepositTypes.length > 0) {
            $scope.masterDepositTypes = angular.copy(mObj.DepositTypes);
        }
        $scope.checkAndGetLineItemActualAdjustments = function (line, mainitem) {
            var isCo50AdjAvailable = false;
            var Co50AdjAmount = 0;
            let obj = {
                "adjustmentAmt": 0,
                "WriteOffAmount": 0
            }


            if (!line || !Array.isArray(line.ServiceAdjustments)) {
                return obj;
            }

            line.ServiceAdjustments.forEach(item => {

                item.AdjustmentAmount = item.AdjustmentAmount || null;
                if (item.AdjustmentReasonCode === "16" || item.AdjustmentReasonCode === "B11" || item.AdjustmentReasonCode === "5"
                    || item.AdjustmentReasonCode === "151" || item.AdjustmentReasonCode === "97" || item.AdjustmentReasonCode === "B13"
                    || item.AdjustmentReasonCode === "11" || item.AdjustmentReasonCode === "206" || item.AdjustmentReasonCode === "B22" || item.AdjustmentReasonCode === "B7") {
                    return; // continue
                }
                //else if (item.AdjustmentReasonCode === "144") {                        
                //    if (item.AdjustmentAmount !== null) {
                //        obj.WriteOffAmount += Number(item.AdjustmentAmount);
                //    }
                //}
                else if (item.AdjustmentReasonCode === "50") {
                    Co50AdjAmount = item.AdjustmentAmount;
                    isCo50AdjAvailable = true;
                    return;
                }
                else if (item.GroupCode == "OA" && item.AdjustmentReasonCode === "94") {
                    obj.adjustmentAmt += Number(item.AdjustmentAmount);
                }
                else if (item.GroupCode == "OA") {

                }
                else if (item.AdjustmentAmount !== null) {
                    obj.adjustmentAmt += Number(item.AdjustmentAmount);
                }

            });
            if (isCo50AdjAvailable && line.PreviousInsuranceAdjustmentAmount > 0) {

                if (line.PreviousInsuranceAdjustmentAmount == Co50AdjAmount) {
                    obj.adjustmentAmt = 0;
                }

            }
            //else if (line.PreviousInsuranceAdjustmentAmount > 0 && (mainitem.ERAPaidBy == 19 || mainitem.ERAPaidBy == 1)) {
            //    obj.adjustmentAmt = 0;
            //}

            return obj;
        }


        $scope.init = function () {
            $scope.mainClaimObject = angular.copy($scope.getMainClaimObject());
            $scope.Subtab = 1;
            $scope.ScreenType = mainObject.Type || '';

            $scope.CardTypesData = [];
            $scope.DepositTypes = [];
            $scope.WriteOffReasons = [];
            $scope.OrganizationFacilityList = [];
            $scope.MasterPaidByArray = [];
            $scope.EOBPatientClaimList = [];
            $scope.PatientClaimEOBDetails = [];
            $scope.EOBClaimSummaryDetails = [];

            mainObject.CheckUnAppliedAmount = mainObject.TotalUnAppliedAmount || 0;

            let EraId = 0;
            if ($scope.ScreenType == 'Post') {
                EraId = mainObject.EraId || 0;
            }

            let obj = {
                "PatientClaimId": mainObject.PatientClaimId,
                "EraId": EraId,
                "EOBClaimInfoId": mainObject.EOBClaimInfoId
            }

            let obj3 = {
                "PatientId": mainObject.PatientId || null,
                "PatientClaimId": mainObject.PatientClaimId || null,
                "EOBId": null,
            }
            var params = {
                "OrganizationId": $scope.HospitalId,
                "FacilityName": ""
            };
            let obj4 = {
                "ParentOrganizationId": $scope.ParenthospitalId,
            }
            let Capobj = {
                "OrganizationPayorBillingId": mainEOBPaymentPostingObj.OrganizationPayorBillingId,
                "OrganizationId": $scope.HospitalId,
                "PayorId": mainEOBPaymentPostingObj.PayorId,
                "PageSize": 100,
                "PageNumber": 1
            }
            //var PReq = {
            //    "ParentOrganizationId": $scope.ParenthospitalId
            //}
            $q.all([
                eHnoteSettingsDataService.GetMasterPaymentAdjustmentCodes($scope.ParenthospitalId),
                eHnoteInsuranceService.GetPatientClaimEOBDetails(obj),
                eHnoteSettingsDataService.GetAllMasterClaimsData($scope.HospitalId),
                //eHnoteMainAdminServices.GetOrganizationFacilityDetails(params),
                eHnoteInsuranceService.GetAllPatientResponsibilityDetails(obj3),
                //eHnoteInsuranceService.GetAutoWriteOffPolicy(obj4),
                eHnoteInsuranceService.GetCapitationList(Capobj),
                //eHnoteInsuranceService.GetParentOrganizationBillingSettings($scope.ParenthospitalId),
                // eHnoteSettingsDataService.GetOrganizationBillingProviders(obj1),
                // eHnoteInsuranceService.GetParticularClaimDetailsById(mainObject.PatientClaimId),


            ]).then(function (resp) {
                if (resp[0].data.rows.length !== 0) {
                    $scope.PaymentReasonList = resp[0].data.rows || [];
                    if ($scope.PaymentReasonList.length > 0) {
                        angular.forEach($scope.PaymentReasonList, function (item) {
                            item.AdjsutmentDescription = item.GroupCode + '-' + item.AdjustmentReasonCode + '-' + item.AdjsutmentReasonDescription;
                        });
                    }
                    $scope.AdjustmentCodeTypes = resp[0].data.AdjustmentCodeTypes || [];
                }
                if (resp[1].data.status == "Success") {
                    $scope.PatientClaimInfo = resp[1].data.PatientClaimInfo || [];
                    $scope.NotSettledClaimDetails = resp[1].data.NotSettledClaimDetails || [];
                    $scope.AppointmentInsuranceDetails = resp[1].data.AppointmentInsuranceDetails || [];

                    var eobClaims = (resp[1] && resp[1].data && resp[1].data.EOBCLaims) || [];
                    angular.forEach(eobClaims, function (item) {

                        var eobClaimTotalCharge = 0;

                        if (item.EOBClaimLineItems != []) {
                            $scope.mainClaimObject.IsCheckAllPayments = true;
                        }

                        angular.forEach(item.EOBClaimLineItems, function (sitem) {

                            eobClaimTotalCharge += sitem.TotalChargeAmount;
                            $scope.Patientobj.TotalPatientResponsibilityAmount += sitem.PatientResponsibility || 0;
                            // If any row is false, make overall false
                            if (!sitem.IsChecked) {
                                $scope.mainClaimObject.IsCheckAllPayments = false;
                            }

                        });
                        //item.TotalChargeAmount = eobClaimTotalCharge || 0;  
                    });
                    var filtredEOBCLaims = $filter('filter')(eobClaims, { "EOBClaimInfoId": mainObject.EOBClaimInfoId }, true) || [];
                    $scope.PatientClaimEOBDetails = angular.copy(filtredEOBCLaims);
                    $scope.PreviousSavedTotalInsurancePayementAmount = 0;
                    if ($scope.PatientClaimEOBDetails.length>0) {
                        $scope.PreviousSavedTotalInsurancePayementAmount = $scope.PatientClaimEOBDetails[0].TotalInsurancePayment;
                    }
                    
                    $scope.EOBClaimSummaryDetails = angular.copy(eobClaims.filter(x => !(x.DeleteInd === "Y" && x.EraId !== 0))) || [];
                    /*  posting summary*/
                    if ($scope.EOBClaimSummaryDetails.length > 0) {
                        angular.forEach($scope.EOBClaimSummaryDetails, function (item) {
                            item.IsSummaryInd = false;
                            item.IsEditVisible = false;

                            if (item.EOBClaimLineItems.length > 0) {
                                item.IsSummaryInd = true;
                                if (item.EOBClaimInfoId === mainObject.EOBClaimInfoId) {
                                    item.IsEditVisible = true;
                                }
                                item.TotalPreviousInsurancePaymentAmount = 0;
                                item.TotalPreviousPatientPaymentAmount = 0;
                                item.TotalPreviousInsuranceAdjustmentAmount = 0;
                                item.TotalInsuranceBalance = 0;
                                item.TotalPatientBalance = 0;
                                item.TotalPatientPayment = 0;
                                item.TotalBalance = 0;
                                item.TotalAllowedAmount = 0;
                                item.TotalPatientResponsibilityAmount = 0;
                                item.TotalChargeAmount = 0;
                                item.AllServiceAdjustmentsList = [];
                                var tempadjustmentMap = {};
                                angular.forEach(item.EOBClaimLineItems, function (Aitem) {
                                    Aitem.AllowedAmount = Aitem.AllowedAmount || 0;
                                    Aitem.CoInsuranceAmount = Aitem.CoInsuranceAmount || 0;
                                    Aitem.CoPaymentAmount = Aitem.CoPaymentAmount || 0;
                                    Aitem.DeductibleAmount = Aitem.DeductibleAmount || 0;
                                    Aitem.PatientPayment = Aitem.PatientPayment || 0;
                                    Aitem.InsuranceBalance = Aitem.InsuranceBalance || 0;
                                    Aitem.InsuranceWriteOff = Aitem.InsuranceWriteOff || 0;
                                    Aitem.PatientResponsibility = Aitem.PatientResponsibility || 0;
                                    item.TotalPatientResponsibilityAmount += Aitem.PatientResponsibility || 0;
                                    item.TotalInsuranceBalance += Aitem.InsuranceBalance || 0;
                                    item.TotalPatientBalance += Aitem.PatientBalance || 0;
                                    item.TotalPatientPayment += Aitem.PatientPayment || 0;
                                    item.TotalPreviousInsurancePaymentAmount += Aitem.PreviousInsurancePaymentAmount || 0;
                                    item.TotalPreviousPatientPaymentAmount += Aitem.PreviousPatientPaymentAmount || 0;
                                    item.TotalPreviousInsuranceAdjustmentAmount += Aitem.PreviousInsuranceAdjustmentAmount || 0;
                                    item.TotalBalance += Aitem.TotalBalance || 0;
                                    item.TotalAllowedAmount += Aitem.AllowedAmount || 0;

                                    console.log(Aitem.TotalChargeAmount + "__TotalChargeAmount");
                                    item.TotalChargeAmount += Aitem.TotalChargeAmount || 0;
                                    if (Aitem.ServiceAdjustments.length) {

                                        angular.forEach(Aitem.ServiceAdjustments, function (aitem) {
                                            aitem.AdjsutmentDescription = aitem.AdjsutmentDescription || "";

                                            if (aitem.AdjsutmentDescription !== "" && aitem.DeleteInd === "N") {
                                                if (!aitem.AdjsutmentDescription.startsWith(aitem.GroupCode + "-")) {
                                                    aitem.AdjsutmentDescription = aitem.GroupCode + '-' + aitem.AdjsutmentDescription;
                                                }
                                                var desc = aitem.AdjsutmentDescription;

                                                if (typeof aitem.AdjustmentAmount === "string") {
                                                    aitem.AdjustmentAmount = Math.round(parseFloat(aitem.AdjustmentAmount) * 100) / 100;
                                                }
                                                if (!tempadjustmentMap[desc]) {
                                                    tempadjustmentMap[desc] = angular.copy(aitem);
                                                } else {
                                                    tempadjustmentMap[desc].AdjustmentAmount += aitem.AdjustmentAmount;
                                                }
                                            }

                                        });

                                        angular.forEach(tempadjustmentMap, function (aitem) {
                                            item.AllServiceAdjustmentsList.push(aitem);
                                        });

                                        item.AllServiceAdjustmentsList = _.uniq(item.AllServiceAdjustmentsList, false, function (p) { return p.AdjsutmentDescription; });

                                    }
                                });
                                // $scope.Patientobj.TotalPatientResponsibilityAmount += item.TotalPatientResponsibilityAmount || 0;

                            }
                        });
                    }



                    $scope.EOBClaimSummaryDetails.sort(function (a, b) {
                        if (a.IsEditVisible && !b.IsEditVisible) return 1;
                        if (!a.IsEditVisible && b.IsEditVisible) return -1;
                        return 0;
                    });


                    /*  Posting add/update*/
                    if ($scope.PatientClaimEOBDetails.length > 0) {
                        angular.forEach($scope.PatientClaimEOBDetails, function (item) {
                            item.PatientClaimLineItems = [];
                            if (item.EOBClaimLineItems.length > 0) {
                                item.PatientClaimLineItems = angular.copy(item.EOBClaimLineItems) || [];
                            } else {
                                item.PatientClaimLineItems = angular.copy($scope.PatientClaimInfo.PatientClaimLineItems) || [];
                            }
                        });
                    }



                    $scope.Patientobj.FirstName = $scope.PatientClaimInfo.FirstName || '';
                    $scope.Patientobj.Lastname = $scope.PatientClaimInfo.LastName || '';
                    $scope.Patientobj.S3URL = $scope.PatientClaimInfo.S3URL || '';
                    $scope.PatientClaimInfo.PatientMobile = $scope.PatientClaimInfo.PatientMobile || "";
                    if ($scope.PatientClaimInfo.PatientMobile.length > 0) {
                        var obj = eHnoteUserDataService.UsMobileFormatChange($scope.PatientClaimInfo.PatientMobile);
                        $scope.Patientobj.PatientMobile = obj.UsFormatMobileNumber;
                    } else {
                        $scope.Patientobj.PatientMobile = "";
                    }
                    $scope.Patientobj.PatientDisplayId = $scope.PatientClaimInfo.PatientDisplayId || '';
                    $scope.Patientobj.DOB = $scope.PatientClaimInfo.DOB || '';
                    $scope.Patientobj.Gender = $scope.PatientClaimInfo.Gender || '';
                    $scope.Patientobj.AgeInMonths = $scope.PatientClaimInfo.AgeInMonths || 0;
                    $scope.Patientobj.AgeInYears = $scope.PatientClaimInfo.AgeInYears || 0;
                    $scope.Patientobj.PatientId = $scope.PatientClaimInfo.PatientId || '';
                    $scope.Patientobj.BillingProviderFacilityName = $scope.PatientClaimInfo.BillingProviderFacilityName || '';
                    $scope.Patientobj.FacilityName = $scope.PatientClaimInfo.FacilityName || '';
                    $scope.Patientobj.PatientFullName = $scope.PatientClaimInfo.PatientFullName || '';



                }
                if (resp[2].data.status == "Success") {
                    $scope.DenialCodesArray = resp[2].data.DenialCodes || [];
                    $scope.filteredDenialCodesArray = angular.copy($scope.DenialCodesArray);

                    if (resp[2].data.TransmissionMethods.length !== 0) {
                        $scope.TransmissionTypes = resp[2].data.TransmissionMethods || [];
                        $scope.TransmissionTypes = $filter("filter")($scope.TransmissionTypes, function (item) {
                            return item.TransmissionMethodId === 1 || item.TransmissionMethodId === 2;
                        });
                    }

                    if (resp[2].data.ClaimTypes.length !== 0) {
                        $scope.masterBillingFrequencyTypes = resp[2].data.MasterClaimTransmissionType || [];
                        $scope.ClaimProffesionalList = $filter("filter")($scope.masterBillingFrequencyTypes, function (item) {
                            return item.TransmissionTypeId == 2 || item.TransmissionTypeId == 7 || item.TransmissionTypeId == 8;
                        });
                    }

                    if (resp[2].data.MasterPayorPostingStatus.length !== 0) {
                        $scope.MasterPayorPostingStatus = resp[2].data.MasterPayorPostingStatus || [];
                    }

                    if (resp[2].data.Cardtype.length > 0) {
                        $scope.CardTypesData = resp[2].data.Cardtype || [];
                    }
                    if (resp[2].data.DepositTypes.length > 0) {
                        $scope.DepositTypes = resp[2].data.DepositTypes || [];
                    }
                    if (resp[2].data.WriteOffReasons.length > 0) {
                        $scope.WriteOffReasons = resp[2].data.WriteOffReasons || [];
                    }

                    if (resp[2].data.MasterPaidByArray.length > 0) {
                        $scope.MasterPaidByArray = resp[2].data.MasterPaidByArray || [];
                    }
                }

                //if (resp[3].data.status == "Success") {
                //    resp[3].data.rows = resp[3].data.rows || [];
                //    if (resp[3].data.rows.length > 0) {
                //        $scope.OrganizationFacilityList = angular.copy(resp[3].data.rows);
                //    }
                //}



                $scope.TotalPatBalanceAmnt = 0;

                if (resp[3].data.EOBClaims.length > 0) {
                    $scope.EOBPatientClaimList = resp[3].data.EOBClaims.filter(function (item) {
                        return item.SettlementStatusId != 7;
                    });

                    $scope.EOBPatientClaimList = $scope.EOBPatientClaimList.filter(function (item) {
                        return item.PatientClaimId === mainObject.PatientClaimId;
                    });

                }
                if (resp[3].data.rows.length > 0) {
                    $scope.PatientClaimList = resp[3].data.rows || [];
                    angular.forEach($scope.PatientClaimList, function (Aitem) {
                        $scope.TotalPatBalanceAmnt += Aitem.TotalPatientBalance || 0;
                    })

                }
                //if (resp[5].data.rows.length > 0) {
                //    $scope.BillingRuleList = resp[5].data.rows || [];
                //}
                if (resp[4].data.rows.length > 0) {
                    $scope.CapitationList = resp[4].data.rows || [];
                }


                //$scope.newrestructureAllClaimObj($scope.PatientClaimEOBDetails);
                // $scope.restructureClaimPostingDataNew($scope.PatientClaimEOBDetails);
                $scope.restructureClaimPostingDataNewV2($scope.PatientClaimEOBDetails);



            }, function (err) {
                console.log(err);
                alertify.error("Getting Data Failed");
            });
        };



        $scope.openOnlyThis = function (selectedItem) {
            $scope.AllPatientClaimEOBDetails.forEach(function (item) {
                item.isAccordianOpen = false;
            });
            selectedItem.isAccordianOpen = !selectedItem.isAccordianOpen;
        };

















        $scope.clearDenailCodesPopup = function (item) {

            alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to clear? </h4>", function () {
                if (item.ServiceAdjustments.length > 0) {
                    angular.forEach(item.ServiceAdjustments, function (sitem, index) {
                        if (sitem.EOBLineItemId != 0) {
                            sitem.DeleteInd = "Y";
                            sitem.ActiveInd = "N";
                        } else {
                            item.ServiceAdjustments.splice(index, 1);
                        }
                    });
                }

                let obj = {
                    "AdjustmentId": 0,
                    "EOBLineItemId": 0,
                    "ClaimLineItemId": "",
                    "GroupCode": "",
                    "AdjustmentReasonCode": 0,
                    "AdjustmentReasonId": 0,
                    "AdjustmentAmount": 0,
                    "PayorPostingStatusId": 2,
                    "AdjsutmentDescription": '',
                    "PayorPostingStatus": 'Transfer',
                    "Notes": "",
                    "DeleteInd": "N",
                    "ActiveInd": "Y",
                }
                item.ServiceAdjustments.push(obj);
                $scope.mainClaimObject.PatientClaimLineItems.push(item);
                $scope.$apply();
            }, function () {

            });
        }

        $scope.changeAdjustmentReason = function (id, item, lineitem, mainitem) {
            var templist = $filter("filter")($scope.PaymentReasonList, { "AdjustmentReasonId": id }, true) || [];
            var tempAdjlist = $filter("filter")(lineitem.ServiceAdjustments, { "AdjustmentReasonId": templist[0].AdjustmentReasonId, "DeleteInd": "N" }, true) || [];
            if (tempAdjlist.length > 0) {
                alertify.error("This adjustment code already existed!");
                return false;
            }
            if (templist.length > 0) {
                item.AdjustmentReasonCode = templist[0].AdjustmentReasonCode;
                item.AdjustmentReasonId = templist[0].AdjustmentReasonId;
                item.AdjsutmentDescription = templist[0].AdjsutmentDescription || '';
                item.PayorPostingStatusId = templist[0].PayorPostingStatusId || '';
                item.PayorPostingStatus = templist[0].PayorPostingStatusName || '';
                item.AdjsutmentReason = templist[0].AdjsutmentReasonDescription || '';
                item.GroupCode = templist[0].GroupCode || '';
                item.AdjustmentAmount = 0;
                if (item.AdjustmentReasonCode == "MA01") {
                    hasMA01 = true;
                }
                if (item.AdjustmentReasonCode == "MA18") {
                    hasMA18 = true;
                }
                isInformationalForwarding = mainitem.ERAPaidBy == 19 && lineitem.CurrentInsurancePaymentAmount == 0 && hasMA01 && hasMA18;
                if (item.AdjustmentReasonCode == "151") {
                    item.PayorPostingStatusId = 3;
                    item.PayorPostingStatus = "Denials";
                }
                else if (lineitem.CurrentInsurancePaymentAmount == 0 && isInformationalForwarding && item.AdjustmentReasonCode == "49") {
                    serviceAdjustment.PayorPostingStatusId = 3;
                    serviceAdjustment.PayorPostingStatus = "Denials";
                }
                else if (item.AdjustmentReasonCode === "144") {
                    item.PayorPostingStatusId = 1;
                    item.PayorPostingStatus = "Adjustment";
                }
                else if (item.AdjustmentReasonCode === "16") {
                    item.PayorPostingStatusId = 3;
                    item.PayorPostingStatus = "Denials";
                }
                else if (item.AdjustmentReasonCode === "B11") {
                    item.PayorPostingStatusId = 3;
                    item.PayorPostingStatus = "Denials";
                }
                else if (item.AdjustmentReasonCode === "11") {
                    item.PayorPostingStatusId = 3;
                    item.PayorPostingStatus = "Denials";
                }
                else if (item.AdjustmentReasonCode === "206") {
                    item.PayorPostingStatusId = 3;
                    item.PayorPostingStatus = "Denials";
                }
                else if (item.AdjustmentReasonCode === "97") {
                    item.PayorPostingStatusId = 3;
                    item.PayorPostingStatus = "Denials";
                }
                else if (item.GroupCode == "PR") {
                    if (item.AdjustmentReasonCode == "276") {
                        item.PayorPostingStatusId = 1;
                        item.PayorPostingStatus = "Adjustment";
                    }

                }
                else if (item.GroupCode == "PR") {
                    item.PayorPostingStatusId = 2;
                    item.PayorPostingStatus = "Transfer";
                }
                else if (item.GroupCode == "OA") {
                    item.PayorPostingStatusId = 1;
                    item.PayorPostingStatus = "Adjustment";
                }
                else if (item.GroupCode == "LQ") {
                    item.PayorPostingStatusId = 1;
                    item.PayorPostingStatus = "Adjustment";
                }
                else if (item.AdjustmentReasonCode == "B13") {
                    item.PayorPostingStatusId = 3;
                    item.PayorPostingStatus = "Denials";
                }
                else if (item.AdjustmentReasonCode == "B22") {
                    item.PayorPostingStatusId = 3;
                    item.PayorPostingStatus = "Denials";
                } else if (item.AdjustmentReasonCode == "B7") {
                    item.PayorPostingStatusId = 3;
                    item.PayorPostingStatus = "Denials";
                }
                else {
                    item.PayorPostingStatusId = 1;
                    item.PayorPostingStatus = "Adjustment";
                }






                //if (item.AdjustmentReasonCode == "144") {
                //    item.CurrentWriteOffAmount += item.AdjustmentAmount;
                //}
                //else if (item.AdjustmentReasonCode == "151" || item.AdjustmentReasonCode == "16" || item.AdjustmentReasonCode == "5" || item.AdjustmentReasonCode == "B11"|| item.AdjustmentReasonCode == "97") {
                //    item.PayorPostingStatusId = 3;
                //    item.PayorPostingStatus = 'Denials';
                //} else {

                //}



            }
            //$scope.GetTotalAdjustmentDetails(mainitem);
        };
        $scope.isDuplicateMA125Payment = function (line) {
            return line.CurrentInsurancePaymentAmount > 0 &&
                line.PreviousInsurancePaymentAmount > 0;
        }

        $scope.checkFinalPaymentAmountForMA125 = function (line) {
            let finalPaymentAmt = 0;

            if (line.previousInsurancePaymentAmount > 0) {
                const calculatedDifference =
                    line.CurrentInsurancePaymentAmount - line.previousInsurancePaymentAmount;

                finalPaymentAmt = calculatedDifference > 0
                    ? calculatedDifference
                    : 0;
            } else {
                finalPaymentAmt = line.paidAmount;
            }

            return finalPaymentAmt;
        }

        $scope.changeAdjustmentstatus = function (sub, item, mainitem) {
            var templist = $filter("filter")($scope.MasterPayorPostingStatus, { "PayorPostingStatusId": sub.PayorPostingStatusId }, true) || [];
            if (templist.length > 0) {
                sub.PayorPostingStatus = templist[0].PayorPostingStatusName;
                sub.PayorPostingStatusId = templist[0].PayorPostingStatusId;
            }

            if (sub.PayorPostingStatusId == 2) {
                if (sub.AdjustmentReasonCode == "1") {
                    item.CurrentDeductibleAmount = sub.AdjustmentAmount;
                }
                else if (sub.AdjustmentReasonCode == "2") {
                    item.CurrentCoInsuranceAmount = sub.AdjustmentAmount;
                } else {
                    if (sub.AdjustmentReasonCode == "3") {
                        item.CurrentCoPaymentAmount = sub.AdjustmentAmount;
                    }
                }
            }
            if (sub.PayorPostingStatusId == 1) {
                if (sub.AdjustmentReasonCode == "1") {
                    item.CurrentDeductibleAmount = 0;
                    item.CurrentCoInsuranceAmount = 0;
                    item.CurrentCoPaymentAmount = 0;
                }
            }

            $scope.ChangeServiceAdjustmentAmt(sub, item, mainitem);
        };


        $scope.masterPatientPaymentAdjustment = [
            { ReasonCodeId: 1, ReasonCode: 'Financial Hardship Adjustment' },
            { ReasonCodeId: 2, ReasonCode: 'Small Amount Write-off' },
            { ReasonCodeId: 3, ReasonCode: 'Bad Debt Write-off' },
            { ReasonCodeId: 4, ReasonCode: 'Charity Care Adjustment' },
            { ReasonCodeId: 5, ReasonCode: 'Uninsured Discount' },
            { ReasonCodeId: 6, ReasonCode: 'Patient Payment Plan Adjustment' },
            { ReasonCodeId: 7, ReasonCode: 'Administrative Adjustment' },
            { ReasonCodeId: 8, ReasonCode: 'Non-covered Services Adjustment' },
            { ReasonCodeId: 9, ReasonCode: 'Prompt Pay Discount' },
            { ReasonCodeId: 10, ReasonCode: 'Inability to Pay Adjustment' }
        ];



        $scope.changeAdjustment = function (typeid, mainitem) {

            var filterArray = $filter("filter")($scope.masterPatientPaymentAdjustment, { "ReasonCodeId": typeid }, true) || [];
            if (filterArray.length > 0) {
                mainitem.AdjustmentReasonCode = filterArray[0].ReasonCode;
            }
        }



        $scope.calculateLineItemPatientTotals = function () {
            var totalPatientBalance = 0, totalWriteOffAmt = 0, totalPatientPaymentBlsAmt = 0;
            angular.forEach($scope.PatientClaimList, function (Aitem) {
                let totalPaymentAmount = 0;
                let totalWriteOffAmount = 0;
                angular.forEach(Aitem.ClaimPatientResponsibility, function (sitem) {
                    var CurrentPatientBalance = parseFloat(sitem.PatientBalance) || 0;
                    var CurrentPatientPaymentAmount = parseFloat(sitem.PatientPaymentAmount) || 0;
                    var CurrentWriteOffAmount = parseFloat(sitem.WriteOffAmount) || 0;
                    totalPatientBalance += CurrentPatientBalance;
                    totalPaymentAmount += CurrentPatientPaymentAmount;
                    totalWriteOffAmount += CurrentWriteOffAmount;

                });
                Aitem.TotalPatientBalance = totalPatientBalance - (totalPaymentAmount + totalWriteOffAmount);
                Aitem.TotalPatientPayment = totalPaymentAmount;
                Aitem.TotalWriteOffAmount = totalWriteOffAmount;
                totalPatientPaymentBlsAmt += totalPaymentAmount;
                totalWriteOffAmt += totalWriteOffAmount;
            });
            $scope.TotalPatientPaymentBalance = totalPatientPaymentBlsAmt;
            $scope.TotalAdjustmentBalanceAmount = totalWriteOffAmt;
            $scope.PatientPostingObj.BilledAmount = $scope.TotalPatientPaymentBalance;
        }





        $scope.SelectAllPayments = function (Pitem) {
            angular.forEach(Pitem.PatientClaimLineItems, function (item) {
                if (Pitem.IsCheckAllPayments) {
                    item.IsChecked = true;
                } else {
                    item.IsChecked = false;
                }
            });
        }



        $scope.changevalue = function (item, mainitem, type, val) {

            val = val || null;
            if (val !== null) {
                let inputValue = val.toString();
                inputValue = inputValue.replace(/[^0-9.+-]/g, '');

                if (/^0[0-9]+/.test(inputValue)) {
                    inputValue = inputValue.replace(/^0+/, '');
                }

                if (inputValue.includes('+') || inputValue.includes('-')) {
                    const signMatch = inputValue.match(/^[-+]/);
                    const sign = signMatch ? signMatch[0] : '';
                    inputValue = sign + inputValue.replace(/[-+]/g, '');
                }
                if (inputValue.startsWith('.')) {
                    inputValue = '0' + inputValue;
                } else if (inputValue.startsWith('-.')) {
                    inputValue = '-0' + inputValue.substring(1);
                }
                if (inputValue.length > 1 && inputValue.startsWith('0') && !inputValue.startsWith('0.')) {
                    inputValue = inputValue.slice(1);
                }
                //if (inputValue.startsWith('.')) {
                //    inputValue = '';
                //}
                const decimalParts = inputValue.split('.');
                if (decimalParts.length > 2) {
                    inputValue = decimalParts[0] + '.' + decimalParts[1];
                }

                if (type == 'Allowed') {
                    item.CurrentAllowedAmount = inputValue;
                }
                else if (type == 'Inspayment') {
                    item.CurrentInsurancePaymentAmount = inputValue;
                }
                else if (type == 'Deductib') {
                    item.CurrentDeductibleAmount = inputValue;
                }
                else if (type == 'CoInsurance') {
                    item.CurrentCoInsuranceAmount = inputValue;
                }
                else if (type == 'CoPayment') {
                    item.CurrentCoPaymentAmount = inputValue;
                }
                else if (type == 'WriteOff') {
                    item.CurrentWriteOffAmount = inputValue;
                }
                else if (type == 'PatientResp') {
                    item.CurrentPatientResponsibilityAmount = inputValue;
                }
                else {

                }

                if (inputValue === '' || isNaN(parseFloat(inputValue))) {
                    val = '';
                }
            }

            if (item.EOBLineItemId != 0) {
                if (type == 'Allowed') {
                    item.IsAllowedAmount = true;
                    item.IsInsurancePaymentAmount = true;
                    item.IsDeductibleAmount = true;
                    item.IsCoInsuranceAmount = true;
                    item.IsCoPaymentAmount = true;
                    item.IsPatientResponsibilityAmount = true;
                    item.IsWriteOffAmount = true;
                }
                else if (type == 'Inspayment') {
                    item.IsInsurancePaymentAmount = true;
                }
                else if (type == 'Deductib') {
                    item.IsDeductibleAmount = true;
                }
                else if (type == 'CoInsurance') {
                    item.IsCoInsuranceAmount = true;
                }
                else if (type == 'CoPayment') {
                    item.IsCoPaymentAmount = true;
                }
                else if (type == 'PatientResp') {
                    item.IsPatientResponsibilityAmount = true;
                }
                else if (type == 'WriteOff') {
                    item.IsWriteOffAmount = true;
                } else {

                }

            }

        }

        $scope.calculateClaimLineItems = function (sitem, mainitem) {



            if (sitem.IsChecked) {
                var TotalChargeAmount = parseFloat(sitem.TotalChargeAmount) || 0;
                var deductableamt = parseFloat(sitem.CurrentDeductibleAmount) || 0;
                var CoInsuranceAmt = parseFloat(sitem.CurrentCoInsuranceAmount) || 0;
                var CoPaymentAmt = parseFloat(sitem.CurrentCoPaymentAmount) || 0;
                var PatientResponsibilityAmt = parseFloat(sitem.CurrentPatientResponsibilityAmount) || 0;
                var WriteOffAmt = parseFloat(sitem.CurrentWriteOffAmount) || 0;
                let AllowedAmount = parseFloat(sitem.CurrentAllowedAmount) || 0;
                let CurrentPaymentAmount = parseFloat(sitem.CurrentInsurancePaymentAmount) || 0;
                let PatientPaymentAmount = parseFloat(sitem.PatientPaymentAmount) || 0;
                let PreviousInsurancePaymentAmount = parseFloat(sitem.InsurancePaymentAmount) || 0;
                let PreviousWriteoffAmount = parseFloat(sitem.WriteOffAmount) || 0;
                let PreviousAllowedAmount = parseFloat(sitem.AllowedAmount) || 0;
                let PreviousAdjustmentAmount = parseFloat(sitem.AdjustmentAmount) || 0;





                let AdjustmentReasonAmount = 0;
                let PatientAdjustmentReasonAmount = 0;
                if (sitem.ServiceAdjustments.length > 0) {

                    var filterAdjustment = $filter("filter")(sitem.ServiceAdjustments, { "PayorPostingStatusId": 1 }, true) || [];
                    if (filterAdjustment.length > 0) {

                        angular.forEach(filterAdjustment, function (Aitem) {
                            if (Aitem.DeleteInd == "N") {
                                let AdjustmentAmount = parseFloat(Aitem.AdjustmentAmount) || 0;
                                AdjustmentReasonAmount += AdjustmentAmount;
                            }
                        });
                    }

                    var filterAdjustment = $filter("filter")(sitem.ServiceAdjustments, { "PayorPostingStatusId": 2 }, true) || [];
                    if (filterAdjustment.length > 0) {
                        angular.forEach(filterAdjustment, function (Aitem) {
                            if (Aitem.DeleteInd == "N") {
                                let AdjustmentAmount = parseFloat(Aitem.AdjustmentAmount) || 0;
                                PatientAdjustmentReasonAmount += AdjustmentAmount;
                            }
                        });
                    }

                    var filterDenialCodes = $filter("filter")(sitem.ServiceAdjustments, { "PayorPostingStatusId": 3 }, true) || [];
                    sitem.DenialCodes = [];
                    if (filterDenialCodes.length > 0) {

                        angular.forEach(filterDenialCodes, function (Aitem) {
                            var filterDenial = $filter("filter")(sitem.DenialCodes, { "DenialCode": Aitem.AdjustmentReasonCode }, true) || [];
                            if (filterDenial.length > 0) {
                                filterDenial[0].DenialCode = Aitem.AdjustmentReasonCode;
                                filterDenial[0].DenialCodeDescription = Aitem.AdjsutmentDescription || '';
                                filterDenial[0].AdjustmentAmount = Aitem.AdjustmentAmount || null;

                            } else {
                                var obj = {
                                    "DenialId": Aitem.DenialId || 0,
                                    "EOBLineItemId": Aitem.EOBLineItemId || 0,
                                    "ClaimLineItemId": sitem.ClaimLineItemId,
                                    "DenialCode": Aitem.AdjustmentReasonCode,
                                    "AdjustmentAmount": Aitem.AdjustmentAmount,
                                    "DenialCodeDescription": Aitem.AdjsutmentDescription || '',
                                };
                                sitem.DenialCodes.push(obj);
                            }

                        });
                    }



                    //angular.forEach(sitem.ServiceAdjustments, function (Aitem) {
                    //    if (Aitem.PayorPostingStatusId != 3 && (Aitem.AdjustmentReasonId != 45)) {
                    //        if (Aitem.PayorPostingStatusId == 1 && (Aitem.AdjustmentReasonId != 1||Aitem.AdjustmentReasonId != 2||Aitem.AdjustmentReasonId != 3)) {
                    //            let AdjustmentAmount = parseFloat(Aitem.AdjustmentAmount) || 0;
                    //            AdjustmentReasonAmount += AdjustmentAmount;
                    //        }

                    //    }
                    //});
                }
                var InsuranceBalance = 0;
                var PatientBalance = 0;


                /* sitem.CurrentPatientResponsibilityAmount = PatientAdjustmentReasonAmount;*/

                if (mainitem.IsSecondaryInsuranceAvailable) {
                    // InsuranceBalance = deductableamt + CoInsuranceAmt + CoPaymentAmt;
                    //InsuranceBalance = AllowedAmount - (CurrentPaymentAmount + PatientBalance + AdjustmentReasonAmount);
                    /*    PatientBalance = PatientResponsibilityAmt - WriteOffAmt;*/
                    PatientBalance = 0;
                    sitem.CurrentPatientResponsibilityAmount = PatientAdjustmentReasonAmount;
                    /*   InsuranceBalance = TotalChargeAmount - (CurrentPaymentAmount + AdjustmentReasonAmount + PatientAdjustmentReasonAmount);*/
                    InsuranceBalance = TotalChargeAmount - (CurrentPaymentAmount + AdjustmentReasonAmount + PatientAdjustmentReasonAmount);

                    sitem.CurrentTotalBalance = TotalChargeAmount - (CurrentPaymentAmount + AdjustmentReasonAmount + PatientPaymentAmount);
                    //if (mainitem.ERAPaidBy == "22") {
                    //    InsuranceBalance = TotalChargeAmount - (
                    //        Math.abs(CurrentPaymentAmount) +
                    //        Math.abs(AdjustmentReasonAmount) +
                    //        Math.abs(PatientAdjustmentReasonAmount) +
                    //        Math.abs(PreviousInsurancePaymentAmount)
                    //    );

                    //    sitem.CurrentTotalBalance = TotalChargeAmount - (Math.abs(CurrentPaymentAmount) + Math.abs(AdjustmentReasonAmount) + Math.abs(PatientPaymentAmount)  + Math.abs(PreviousInsurancePaymentAmount));
                    //}



                    //sitem.CurrentTotalBalance = AllowedAmount - (CurrentPaymentAmount + PatientBalance + deductableamt + CoInsuranceAmt + CoPaymentAmt + WriteOffAmt);
                }
                else {
                    //sitem.CurrentPatientResponsibilityAmount = deductableamt + CoInsuranceAmt + CoPaymentAmt;
                    sitem.CurrentPatientResponsibilityAmount = PatientAdjustmentReasonAmount;
                    PatientBalance = sitem.CurrentPatientResponsibilityAmount - WriteOffAmt;
                    InsuranceBalance = TotalChargeAmount - (CurrentPaymentAmount + PatientBalance + AdjustmentReasonAmount + WriteOffAmt);
                    //if (mainitem.ERAPaidBy == "22") {
                    //    InsuranceBalance = Math.abs(TotalChargeAmount) - (
                    //        Math.abs(CurrentPaymentAmount) +
                    //        Math.abs(PatientBalance) +
                    //        Math.abs(AdjustmentReasonAmount) +
                    //        Math.abs(WriteOffAmt)
                    //    );
                    //}  




                    if (mainitem.IdentifierId === 2) {
                        InsuranceBalance = TotalChargeAmount - (PreviousInsurancePaymentAmount + PreviousWriteoffAmount + CurrentPaymentAmount + PatientAdjustmentReasonAmount + AdjustmentReasonAmount + PreviousAdjustmentAmount);
                        sitem.CurrentTotalBalance = TotalChargeAmount - (PreviousInsurancePaymentAmount + PreviousWriteoffAmount + CurrentPaymentAmount + AdjustmentReasonAmount + PatientPaymentAmount + PreviousAdjustmentAmount + WriteOffAmt);

                    } else {

                        sitem.CurrentTotalBalance = TotalChargeAmount - (CurrentPaymentAmount + WriteOffAmt + AdjustmentReasonAmount + PatientPaymentAmount);
                    }

                }

                sitem.CurrentServiceAdjustmentAmount = AdjustmentReasonAmount + PatientAdjustmentReasonAmount;
                sitem.CurrentAdjustmentCodeAmount = AdjustmentReasonAmount;
                sitem.CurrentServiceAdjustmentAmount = sitem.CurrentServiceAdjustmentAmount.toFixed(2);
                sitem.CurrentInsuranceBalance = InsuranceBalance.toFixed(2);
                sitem.CurrentPatientBalance = PatientBalance.toFixed(2);
            }




            $scope.calculateClaimPaymentTotalAmountsNew();
            $scope.GetTotalAdjustmentDetails(mainitem);
        }

        $scope.changeClaimAllowedAmount = function (item, mainitem) {



            var allowedAmount = parseFloat(item.CurrentAllowedAmount) || 0;
            var totalChargeAmt = parseFloat(item.TotalChargeAmount) || 0;
            var PatientPaymentAmount = parseFloat(item.PatientPaymentAmount) || 0;
            var currentTotalBalance = parseFloat(item.CurrentTotalBalance) || 0;

            if (allowedAmount > 0) {
                item.IsChecked = true;
            }
            //else {
            //    item.IsChecked = false;
            //}

            var c045AdjustmentAmt = 0;
            if (mainitem.IdentifierId == 1) {

                // c045AdjustmentAmt = totalChargeAmt - allowedAmount - PatientPaymentAmount;
                //c045AdjustmentAmt = totalChargeAmt - allowedAmount;
                c045AdjustmentAmt = (mainitem.IdentifierId === 1 || mainitem.IdentifierId === 2) ? (mainitem.IdentifierId === 1 ? totalChargeAmt : currentTotalBalance) - allowedAmount : 0;
                c045AdjustmentAmt = parseFloat(c045AdjustmentAmt).toFixed(2);
                if (c045AdjustmentAmt == 0 || allowedAmount == 0) {
                    if (item.ServiceAdjustments[0].PayorPostingStatusId == 3) {

                        var templist = $filter("filter")($scope.PaymentReasonList, { "AdjustmentReasonCode": '96' }, true) || [];

                        if (templist.length > 0) {
                            item.ServiceAdjustments[0].AdjustmentReasonCode = templist[0].AdjustmentReasonCode;
                            item.ServiceAdjustments[0].AdjsutmentDescription = templist[0].AdjsutmentDescription;
                            item.ServiceAdjustments[0].AdjustmentAmount = item.ServiceAdjustments[0].AdjustmentAmount;
                            item.ServiceAdjustments[0].AdjustmentReasonId = templist[0].AdjustmentReasonId;
                            item.ServiceAdjustments[0].PayorPostingStatusId = 3;
                            item.ServiceAdjustments[0].PayorPostingStatus = 'Denials';
                        }
                        //item.ServiceAdjustments[0].AdjustmentReasonCode = '96';
                        //item.ServiceAdjustments[0].AdjsutmentDescription = 'CO-96-Non-covered charge(s). At least one Remark Code must be provided (may be comprised of either the NCPDP Reject Reason Code, or Remittance Advice Remark Code that is not an ALERT.) Note: Refer to the 835 Healthcare Policy Identification Segment (loop 2110 Service Payment Information REF), if present.';
                        //item.ServiceAdjustments[0].AdjustmentAmount = item.ServiceAdjustments[0].AdjustmentAmount;
                        //item.ServiceAdjustments[0].AdjustmentReasonId = 96;
                        //item.ServiceAdjustments[0].PayorPostingStatusId = 3;
                        //item.ServiceAdjustments[0].PayorPostingStatus = 'Denials';
                    }
                    else {
                        item.ServiceAdjustments[0].AdjustmentReasonCode = '0';
                        item.ServiceAdjustments[0].AdjsutmentDescription = '';
                        item.ServiceAdjustments[0].AdjustmentAmount = 0;
                        item.ServiceAdjustments[0].AdjustmentReasonId = null;
                        item.ServiceAdjustments[0].PayorPostingStatusId = 1;
                        item.ServiceAdjustments[0].PayorPostingStatus = 'Adjustment';
                        if (item.ServiceAdjustments.length > 0) {
                            //item.ServiceAdjustments.forEach(adj => {
                            //    adj.AdjustmentAmount = 0;
                            //});
                            angular.forEach(item.ServiceAdjustments, function (sitem, index) {
                                if (sitem.AdjustmentId != 0) {
                                    sitem.DeleteInd = "Y";
                                    sitem.ActiveInd = "N";
                                } else {
                                    item.ServiceAdjustments.splice(index, 1);
                                }
                            });
                            var filterAdjustment = $filter("filter")(item.ServiceAdjustments, { "DeleteInd": "N" }, true) || [];
                            if (filterAdjustment.length == 0) {
                                var obj = {
                                    "AdjustmentId": 0,
                                    "EOBLineItemId": item.EOBLineItemId || 0,
                                    "ClaimLineItemId": item.ClaimLineItemId,
                                    "AdjustmentReasonCode": "",
                                    "AdjustmentReasonId": "",
                                    "GroupCode": '',
                                    "AdjsutmentDescription": '',
                                    "PayorPostingStatusId": 2,
                                    "PayorPostingStatus": 'Transfer',
                                    "AdjustmentAmount": null,
                                    "Notes": "",
                                    "DeleteInd": "N",
                                    "ActiveInd": "Y",
                                }
                                item.ServiceAdjustments.push(obj);
                            }

                        }
                    }

                } else {

                    var filterAdjustment = $filter("filter")(item.ServiceAdjustments, { "AdjustmentReasonCode": '45' }, true) || [];
                    if (filterAdjustment.length > 0) {
                        filterAdjustment[0].AdjustmentReasonCode = filterAdjustment[0].AdjustmentReasonCode || '45';
                        filterAdjustment[0].AdjsutmentDescription = filterAdjustment[0].AdjsutmentDescription;
                        filterAdjustment[0].AdjustmentAmount = c045AdjustmentAmt;
                        filterAdjustment[0].AdjustmentReasonId = filterAdjustment[0].AdjustmentReasonId;
                        filterAdjustment[0].PayorPostingStatusId = 1;
                        filterAdjustment[0].PayorPostingStatus = 'Adjustment';
                        filterAdjustment[0].DeleteInd = 'N';
                    }
                    else {
                        item.ServiceAdjustments[0].AdjustmentReasonCode = '45';
                        item.ServiceAdjustments[0].AdjsutmentDescription = 'CO-45-Charge exceeds fee schedule/maximum allowable or contracted/legislated fee arrangement. (Use\nGroup Codes PR or CO depending upon liability).';
                        item.ServiceAdjustments[0].AdjustmentAmount = c045AdjustmentAmt;
                        item.ServiceAdjustments[0].AdjustmentReasonId = 45;
                        item.ServiceAdjustments[0].PayorPostingStatusId = 1;
                        item.ServiceAdjustments[0].PayorPostingStatus = 'Adjustment';
                        item.ServiceAdjustments[0].DeleteInd = 'N';
                    }

                }

            }

            //commented by durga
            //if (mainitem.IdentifierId == 2) {
            //    if (allowedAmount < PreviousInsuranceAllowedAmount) {
            //        item.CurrentAllowedAmount = allowedAmount;
            //    } else if (allowedAmount >= PreviousInsuranceAllowedAmount) {
            //        item.CurrentAllowedAmount = PreviousInsuranceAllowedAmount;
            //    }
            //}

            item.CurrentInsurancePaymentAmount = null;
            item.CurrentCoInsuranceAmount = null;
            item.CurrentCoPaymentAmount = null;
            item.CurrentAdjustmentAmount = null;
            item.CurrentPaymentAmount = null;
            item.CurrentDeductibleAmount = null;
            mainitem.AllServiceAdjustmentsList = [];

            $scope.calculateClaimLineItems(item, mainitem);



        }

        $scope.changeClaimDeductibleAmount = function (item, mainitem) {
            var DeductibleAmount = parseFloat(item.CurrentDeductibleAmount) || 0;
            var allowedAmount = parseFloat(item.CurrentAllowedAmount) || 0;
            var filterAdjustment = $filter("filter")(item.ServiceAdjustments, { "AdjustmentReasonId": 1 }, true) || [];
            if (filterAdjustment.length > 0) {
                filterAdjustment[0].PayorPostingStatusId = 2;
                filterAdjustment[0].PayorPostingStatus = 'Transfer';
                filterAdjustment[0].AdjustmentAmount = item.CurrentDeductibleAmount || null;
                filterAdjustment[0].AdjustmentReasonCode = '1';
                filterAdjustment[0].DeleteInd = 'N';
                filterAdjustment[0].ActiveInd = 'Y';
            } else {
                if (DeductibleAmount != 0) {
                    var obj = {
                        "AdjustmentId": 0,
                        "EOBLineItemId": item.EOBLineItemId || 0,
                        "ClaimLineItemId": item.ClaimLineItemId,
                        "AdjustmentReasonCode": "1",
                        "GroupCode": "PR",
                        "AdjustmentReasonId": 1,
                        "AdjsutmentDescription": "PR-1-Deductible Amount",
                        "PayorPostingStatusId": 2,
                        "PayorPostingStatus": 'Transfer',
                        "AdjustmentAmount": item.CurrentDeductibleAmount || null,
                        "Notes": "",
                        "DeleteInd": "N",
                        "ActiveInd": "Y",
                    }
                    item.ServiceAdjustments.push(obj);
                }
            }

            if (item.ServiceAdjustments.length > 1) {
                for (let i = item.ServiceAdjustments.length - 1; i >= 0; i--) {
                    if (item.ServiceAdjustments[i].AdjustmentReasonId === null || item.ServiceAdjustments[i].AdjustmentReasonId === 0) {
                        item.ServiceAdjustments.splice(i, 1);
                    }
                }
            }

            if (DeductibleAmount === 0 || DeductibleAmount == "") {
                if (item.ServiceAdjustments.length > 1) {
                    for (let i = item.ServiceAdjustments.length - 1; i >= 0; i--) {
                        if (item.ServiceAdjustments[i].AdjustmentReasonId === 1) {
                            item.ServiceAdjustments.splice(i, 1);
                        }
                    }
                }
            }

            //if (DeductibleAmount > allowedAmount) {
            //    item.CurrentDeductibleAmount = 0;
            //    alertify.error("Deductable amount cannot be higher than allowed amount");
            //}
            $scope.calculateClaimLineItems(item, mainitem);
            //$scope.calculateClaimPaymentTotalAmountsNew();
            ////$scope.calculateClaimLineItemPaymentTotals(mainitem);
            //$scope.GetTotalAdjustmentDetails(mainitem);
        };



        $scope.changeClaimCoPaymentAmount = function (item, mainitem) {
            var coPaymentAmount = parseFloat(item.CurrentCoPaymentAmount) || 0;
            var allowedAmount = parseFloat(item.CurrentAllowedAmount) || 0;

            var filterAdjustment = $filter("filter")(item.ServiceAdjustments, { "AdjustmentReasonId": 3 }, true) || [];
            if (filterAdjustment.length > 0) {
                filterAdjustment[0].PayorPostingStatusId = 2;
                filterAdjustment[0].PayorPostingStatus = 'Transfer';
                filterAdjustment[0].AdjustmentAmount = item.CurrentCoPaymentAmount || null;
                filterAdjustment[0].AdjustmentReasonCode = '3';
                filterAdjustment[0].DeleteInd = 'N';
                filterAdjustment[0].ActiveInd = 'Y';
            } else {
                if (coPaymentAmount != 0) {
                    var obj = {
                        "AdjustmentId": 0,
                        "EOBLineItemId": item.EOBLineItemId || 0,
                        "ClaimLineItemId": item.ClaimLineItemId,
                        "AdjustmentReasonCode": "3",
                        "GroupCode": "PR",
                        "AdjsutmentDescription": "PR-3-Co-payment Amount",
                        "AdjustmentReasonId": 3,
                        "PayorPostingStatusId": 2,
                        "PayorPostingStatus": 'Transfer',
                        "AdjustmentAmount": item.CurrentCoPaymentAmount || null,
                        "Notes": "",
                        "DeleteInd": "N",
                        "ActiveInd": "Y",
                    }
                    item.ServiceAdjustments.push(obj);
                }
            }

            if (item.ServiceAdjustments.length > 1) {
                for (let i = item.ServiceAdjustments.length - 1; i >= 0; i--) {
                    if (item.ServiceAdjustments[i].AdjustmentReasonId === null || item.ServiceAdjustments[i].AdjustmentReasonId === 0) {
                        item.ServiceAdjustments.splice(i, 1);
                    }
                }
            }


            if (coPaymentAmount === 0 || coPaymentAmount == "") {
                if (item.ServiceAdjustments.length > 1) {
                    for (let i = item.ServiceAdjustments.length - 1; i >= 0; i--) {
                        if (item.ServiceAdjustments[i].AdjustmentReasonId === 3) {
                            item.ServiceAdjustments.splice(i, 1);
                        }
                    }
                }
            }

            //if (coPaymentAmount > allowedAmount) {
            //    item.CurrentCoPaymentAmount = 0;
            //    alertify.error("Copay amount cannot be higher than allowed amount");
            //}
            $scope.calculateClaimLineItems(item, mainitem);
            //$scope.calculateClaimPaymentTotalAmountsNew();
            ////$scope.calculateClaimLineItemPaymentTotals(mainitem);
            //$scope.GetTotalAdjustmentDetails(mainitem);
        }

        $scope.changeClaimCoInsuranceAmount = function (item, mainitem) {
            var coInsAmount = parseFloat(item.CurrentCoInsuranceAmount) || 0;
            var allowedAmount = parseFloat(item.CurrentAllowedAmount) || 0;
            var filterAdjustment = $filter("filter")(item.ServiceAdjustments, { "AdjustmentReasonId": 2 }, true) || [];
            if (filterAdjustment.length > 0) {
                filterAdjustment[0].PayorPostingStatusId = 2;
                filterAdjustment[0].PayorPostingStatus = 'Transfer';
                filterAdjustment[0].AdjustmentAmount = item.CurrentCoInsuranceAmount || null;
                filterAdjustment[0].AdjustmentReasonCode = '2';
                filterAdjustment[0].DeleteInd = 'N';
                filterAdjustment[0].ActiveInd = 'Y';
            } else {
                if (coInsAmount != 0) {
                    var obj = {
                        "AdjustmentId": 0,
                        "EOBLineItemId": item.EOBLineItemId || 0,
                        "ClaimLineItemId": item.ClaimLineItemId,
                        "AdjustmentReasonCode": "2",
                        "GroupCode": "PR",
                        "AdjsutmentDescription": "PR-2-Coinsurance Amount",
                        "AdjustmentReasonId": 2,
                        "PayorPostingStatusId": 2,
                        "PayorPostingStatus": 'Transfer',
                        "AdjustmentAmount": item.CurrentCoInsuranceAmount || null,
                        "Notes": "",
                        "DeleteInd": "N",
                        "ActiveInd": "Y",

                    }
                    item.ServiceAdjustments.push(obj);
                }
            }

            if (item.ServiceAdjustments.length > 1) {
                for (let i = item.ServiceAdjustments.length - 1; i >= 0; i--) {
                    if (item.ServiceAdjustments[i].AdjustmentReasonId === null || item.ServiceAdjustments[i].AdjustmentReasonId === 0) {
                        item.ServiceAdjustments.splice(i, 1);
                    }
                }
            }

            if (coInsAmount === 0 || coInsAmount == "") {
                if (item.ServiceAdjustments.length > 1) {
                    for (let i = item.ServiceAdjustments.length - 1; i >= 0; i--) {
                        if (item.ServiceAdjustments[i].AdjustmentReasonId === 2) {
                            item.ServiceAdjustments.splice(i, 1);
                        }
                    }
                }
            }

            //if (coInsAmount > allowedAmount) {
            //    item.CurrentCoInsuranceAmount = 0;
            //    alertify.error("CoInsurance amount cannot be higher than allowed amount");
            //}

            $scope.calculateClaimLineItems(item, mainitem);
            //$scope.calculateClaimPaymentTotalAmountsNew();
            ////$scope.calculateClaimLineItemPaymentTotals(mainitem);
            //$scope.GetTotalAdjustmentDetails(mainitem);
        }

        $scope.changeClaimPatientRespAmount = function (item, mainitem) {
            var patientRespAmount = parseFloat(item.CurrentPatientResponsibilityAmount) || 0;
            var allowedAmount = parseFloat(item.CurrentAllowedAmount) || 0;

            //if (patientRespAmount > allowedAmount) {
            //    item.CurrentPatientResponsibilityAmount = 0;
            //    alertify.error("Patient Resp amount cannot be higher than allowed amount");
            //}

            $scope.calculateClaimLineItems(item, mainitem);
            /*  $scope.calculateClaimPaymentTotalAmountsNew();*/
            //$scope.calculateClaimLineItemPaymentTotals(mainitem);

        }



        $scope.changeClaimInsuranceWriteOffAmount = function (item, mainitem) {
            var insWriteoffAmount = parseFloat(item.CurrentWriteOffAmount) || 0;
            var allowedAmount = parseFloat(item.CurrentAllowedAmount) || 0;

            //if (insWriteoffAmount > allowedAmount) {
            //    item.CurrentWriteOffAmount = 0;
            //    alertify.error("WriteOff amount cannot be higher than allowed amount");
            //}

            $scope.calculateClaimLineItems(item, mainitem);
            //$scope.calculateClaimLineItemPaymentTotals(mainitem);
            //$scope.calculateClaimPaymentTotalAmountsNew();
        };

        $scope.changeClaimInsurancePaymentAmount = function (item, mainitem) {
            var PaymentAmount = parseFloat(item.CurrentInsurancePaymentAmount) || 0;
            var allowedAmount = parseFloat(item.CurrentAllowedAmount) || 0;
            var totalBalAmt = parseFloat(item.CurrentTotalBalance) || 0;

            if (PaymentAmount > 0 || allowedAmount > 0) {
                item.IsChecked = true;
                //item.CurrentInsurancePaymentAmount = 0;
                //alertify.error("Payment amount cannot be higher than allowed amount");
            }
            //else {
            //    item.IsChecked = false;
            //}
            $scope.calculateClaimLineItems(item, mainitem);
            //$scope.calculateClaimLineItemPaymentTotals(mainitem);
            //$scope.calculateClaimPaymentTotalAmountsNew();
        }

        $scope.DeleteAdjustmentForLineItem = function (item, mainitem, index, data) {
            alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to delete? </h4>", function () {
                if (item.AdjustmentId != 0) {
                    item.DeleteInd = "Y";
                    item.ActiveInd = "N";
                } else {
                    mainitem.ServiceAdjustments.splice(index, 1);
                }

                if (item.AdjustmentReasonId === 1) {
                    mainitem.CurrentDeductibleAmount = "";
                }
                else if (item.AdjustmentReasonId === 2) {
                    mainitem.CurrentCoInsuranceAmount = "";
                }
                else if (item.AdjustmentReasonId === 3) {
                    mainitem.CurrentCoPaymentAmount = "";
                } else {

                }


                var filterAdjustment = $filter("filter")(mainitem.ServiceAdjustments, { "DeleteInd": "N" }, true) || [];
                if (filterAdjustment.length == 0) {
                    var obj = {
                        "AdjustmentId": 0,
                        "EOBLineItemId": item.EOBLineItemId || 0,
                        "ClaimLineItemId": item.ClaimLineItemId,
                        "AdjustmentReasonCode": "",
                        "AdjustmentReasonId": "",
                        "AdjsutmentDescription": '',
                        "GroupCode": '',
                        "PayorPostingStatusId": 2,
                        "PayorPostingStatus": 'Transfer',
                        "AdjustmentAmount": null,
                        "Notes": "",
                        "DeleteInd": "N",
                        "ActiveInd": "Y",

                    }
                    mainitem.ServiceAdjustments.push(obj);
                }

                $scope.calculateClaimLineItems(mainitem, data);
                //$scope.GetTotalAdjustmentDetails(data);
                //$scope.calculateClaimLineItemPaymentTotals(data);
                $scope.$apply();
            }, function () {

            });
        }

        $scope.ChangeServiceAdjustmentAmt = function (subitem, item, mainitem) {

            if (subitem.AdjustmentReasonId === 1 && subitem.PayorPostingStatusId === 2) {
                item.CurrentDeductibleAmount = subitem.AdjustmentAmount;
            }
            else if (subitem.AdjustmentReasonId === 2 && subitem.PayorPostingStatusId === 2) {
                item.CurrentCoInsuranceAmount = subitem.AdjustmentAmount;
            }
            else if (subitem.AdjustmentReasonId === 3 && subitem.PayorPostingStatusId === 2) {
                item.CurrentCoPaymentAmount = subitem.AdjustmentAmount;
            } else {

            }
            $scope.calculateClaimLineItems(item, mainitem);
            //$scope.calculateClaimLineItemPaymentTotals(mainitem);
            // $scope.calculateClaimPaymentTotalAmountsNew();
        }

        $scope.ChangeServiceAdjustmentAmtNew = function (subitem, item, mainitem) {

            subitem.AdjustmentReasonId = subitem.AdjustmentReasonId || 0;
            subitem.AdjustmentAmount = subitem.AdjustmentAmount || 0;

            if (subitem.AdjustmentReasonId == 1) {
                item.CurrentDeductibleAmount = subitem.AdjustmentAmount;
                $scope.changeClaimDeductibleAmount(item, mainitem);
            } else if (subitem.AdjustmentReasonId == 2) {
                item.CurrentCoInsuranceAmount = subitem.AdjustmentAmount;
                $scope.changeClaimCoInsuranceAmount(item, mainitem);
            } else if (subitem.AdjustmentReasonId == 3) {
                item.CurrentCoPaymentAmount = subitem.AdjustmentAmount;
                $scope.changeClaimCoPaymentAmount(item, mainitem);
            }
        }

        $scope.calculateClaimPaymentTotalAmountsNew = function () {
            var CurrentTotalAdjustmentAmount = 0, CurrentTotalPatientBalance = 0, CurrentTotalInsurancePayment = 0, CurrentTotalClaimBalance = 0, finalPatientRespAmount = 0, finalPatientPatientBalance = 0, finalInsuranceBalance = 0, claimInsBalance = 0;
            angular.forEach($scope.AllPatientClaimEOBDetails, function (mainitem) {


                var totalChargeAmt = 0, totalPreviousAdjustmentAmt = 0, totalBalanceamt = 0, totalInsuranceBalance = 0, totalPatientBalance = 0, totalPatientResponsibility = 0, totalInsPaymentAmount = 0, totalPatPaymentAmount = 0, totalAdjustmentAmt = 0, totalCoInsAmt = 0, totalCoPayAmt = 0, totalDeductibleAmt = 0, totalWriteOffAmt = 0, totalAllowedAmt = 0, totalServiceAdjAmt = 0, totalPreviousPaidAmt = 0, totalPreviouswriteoffAmt = 0, totalaPatientPaymentAmount = 0;
                angular.forEach(mainitem.PatientClaimLineItems, function (sitem) {

                    if (sitem.IsChecked) {
                        var temptotalAdjamount = 0;
                        sitem.CurrentAdjustmentAmount = 0;
                        sitem.ServiceAdjustments = sitem.ServiceAdjustments || [];
                        if (sitem.ServiceAdjustments.length > 0) {
                            angular.forEach(sitem.ServiceAdjustments, function (Bitem) {
                                Bitem.AdjustmentAmount = parseFloat(Bitem.AdjustmentAmount) || 0;
                                if (Bitem.PayorPostingStatusId == 1) {
                                    sitem.CurrentAdjustmentAmount += Bitem.AdjustmentAmount;
                                }
                                if (Bitem.DeleteInd == "N") {
                                    temptotalAdjamount += Bitem.AdjustmentAmount;
                                }
                            });
                        }
                        sitem.CurrentServiceAdjustmentAmount = temptotalAdjamount.toFixed(2);



                        var CurrentChargeAmount = parseFloat(sitem.TotalChargeAmount) || 0;
                        var CurrentAllowedAmount = parseFloat(sitem.CurrentAllowedAmount) || 0;
                        var CurrentInsuranceBalance = parseFloat(sitem.CurrentInsuranceBalance) || 0;
                        var CurrentPatientBalance = parseFloat(sitem.CurrentPatientBalance) || 0;
                        var CurrentPatientResponsibilityAmount = parseFloat(sitem.CurrentPatientResponsibilityAmount) || 0;
                        var CurrentServiceAdjustmentAmount = parseFloat(sitem.CurrentServiceAdjustmentAmount) || 0;
                        var CurrentPreviousPaidAmt = parseFloat(sitem.PreviousPaidAmount) || 0;
                        var CurrentPreviousAdjustmentAmt = parseFloat(sitem.PreviousAdjustmentAmount) || 0;


                        console.log(mainitem.ERAPaidBy + "__mainitem.ERAPaidBy");
                        if (mainitem.ERAPaidBy === "2" || mainitem.ERAPaidBy === "3" || mainitem.ERAPaidBy === "20" || mainitem.ERAPaidBy === "21") {
                            console.log(mainitem.ERAPaidBy + "__mainitem.ERAPaidBy");
                            if (CurrentServiceAdjustmentAmount > 0 && CurrentPreviousAdjustmentAmt > 0) {
                                CurrentPreviousAdjustmentAmt = 0;
                            }

                        }


                        var CurrentInsurancePaymentAmount = parseFloat(sitem.CurrentInsurancePaymentAmount) || 0;
                        var CurrentPatientPaymentAmount = parseFloat(sitem.CurrentPatientPaymentAmount) || 0;
                        var CurrentAdjustmentAmount = parseFloat(sitem.CurrentAdjustmentAmount) || 0;
                        var CurrentWriteOffAmount = parseFloat(sitem.CurrentWriteOffAmount) || 0;
                        var CurrentCoInsuranceAmount = parseFloat(sitem.CurrentCoInsuranceAmount) || 0;
                        var CurrentCoPaymentAmount = parseFloat(sitem.CurrentCoPaymentAmount) || 0;
                        var CurrentDeductibleAmount = parseFloat(sitem.CurrentDeductibleAmount) || 0;
                        /* var CurrentTotalBalance = parseFloat(sitem.TotalBalance) || 0;*/
                        var CurrentTotalBalance = parseFloat(sitem.CurrentTotalBalance) || 0;
                        let PreviousWriteOffAmount = parseFloat(sitem.WriteOffAmount) || 0;


                        totalChargeAmt += CurrentChargeAmount;
                        totalAllowedAmt += CurrentAllowedAmount;
                        totalInsuranceBalance += CurrentInsuranceBalance;
                        claimInsBalance += CurrentChargeAmount - (CurrentInsurancePaymentAmount + CurrentAdjustmentAmount + CurrentPatientResponsibilityAmount)

                        if (mainitem.IsSecondaryInsuranceAvailable && mainitem.IdentifierId === 1) {
                            claimInsBalance += CurrentChargeAmount - (CurrentInsurancePaymentAmount + CurrentAdjustmentAmount)
                        }

                        totalPatientBalance += CurrentPatientBalance;
                        totalPatientResponsibility += CurrentPatientResponsibilityAmount;
                        totalServiceAdjAmt += CurrentServiceAdjustmentAmount;
                        totalPreviousPaidAmt += CurrentPreviousPaidAmt;
                        totalPreviousAdjustmentAmt += CurrentPreviousAdjustmentAmt;
                        totalInsPaymentAmount += CurrentInsurancePaymentAmount;
                        totalPatPaymentAmount += CurrentPatientPaymentAmount;
                        totalAdjustmentAmt += CurrentAdjustmentAmount;
                        totalWriteOffAmt += CurrentWriteOffAmount;
                        totalCoInsAmt += CurrentCoInsuranceAmount;
                        totalCoPayAmt += CurrentCoPaymentAmount;
                        totalDeductibleAmt += CurrentDeductibleAmount;
                        totalBalanceamt += CurrentTotalBalance;
                        totalPreviouswriteoffAmt += PreviousWriteOffAmount;
                    }


                });



                mainitem.TotalAllowedAmount = parseFloat(totalAllowedAmt.toFixed(2));
                mainitem.TotalInsuranceBalance = parseFloat(totalInsuranceBalance.toFixed(2));
                mainitem.TotalPatientBalance = parseFloat(totalPatientBalance.toFixed(2));
                mainitem.TotalAdjustmentAmount = parseFloat(totalServiceAdjAmt.toFixed(2));
                mainitem.TotalWriteOffAmount = parseFloat(totalWriteOffAmt.toFixed(2));
                mainitem.TotalCoInsuranceAmount = parseFloat(totalCoInsAmt.toFixed(2));
                totalPatientResponsibility = parseFloat(totalPatientResponsibility.toFixed(2));
                mainitem.TotalPatientResponsibilityAmount = totalPatientResponsibility;
                mainitem.TotalDeductibleAmount = parseFloat(totalDeductibleAmt.toFixed(2));
                mainitem.TotalInsurancePayment = parseFloat(totalInsPaymentAmount.toFixed(2));
                mainitem.TotalCopayAmount = parseFloat(totalCoPayAmt.toFixed(2));
                mainitem.TotalClaimAdjustmentAmount = parseFloat(totalServiceAdjAmt.toFixed(2));
                mainitem.TotalPaidAmount = totalInsPaymentAmount + totalPatPaymentAmount;



                console.log(mainitem.IsSecondaryInsuranceProcessed + "__IsSecondaryInsuranceProcessed" + "__" + mainitem.IdentifierId + "__IdentifierId");

                if (mainitem.IdentifierId === 2 && !mainitem.IsSecondaryInsuranceProcessed) {
                    /*    mainitem.TotalBalance = totalChargeAmt - (totalPreviousPaidAmt + totalPreviousAdjustmentAmt + totalPreviouswriteoffAmt + totalInsPaymentAmount + totalPatientResponsibility + totalServiceAdjAmt);*/
                    mainitem.TotalBalance = totalChargeAmt - (totalPreviousPaidAmt + totalPreviousAdjustmentAmt + totalPreviouswriteoffAmt + totalInsPaymentAmount + totalAdjustmentAmt);

                    mainitem.TotalInsuranceBalance = totalChargeAmt - (totalPreviousPaidAmt + totalPreviousAdjustmentAmt + totalPreviouswriteoffAmt + totalInsPaymentAmount + totalAdjustmentAmt);
                    /* mainitem.TotalInsuranceBalance = totalChargeAmt - (totalPreviousPaidAmt + totalPreviousAdjustmentAmt + totalPreviouswriteoffAmt + totalInsPaymentAmount + totalPatientResponsibility + totalServiceAdjAmt);*/
                    var Temptotalbalance = parseFloat(mainitem.TotalBalance);
                    CurrentTotalClaimBalance = Temptotalbalance || 0;

                    console.log(mainitem.TotalInsuranceBalance + "__TotalInsuranceBalance");
                } else if (mainitem.IdentifierId === 2 && mainitem.IsSecondaryInsuranceProcessed) {
                    //mainitem.TotalBalance = totalChargeAmt - (totalPreviousPaidAmt + totalPreviousAdjustmentAmt + totalPreviouswriteoffAmt + totalInsPaymentAmount + totalPatientResponsibility + totalServiceAdjAmt);
                    /*  mainitem.TotalInsuranceBalance = totalChargeAmt - (totalPreviousPaidAmt + totalPreviousAdjustmentAmt + totalPreviouswriteoffAmt + totalInsPaymentAmount + totalPatientResponsibility + totalServiceAdjAmt);*/
                    var Temptotalbalance = parseFloat(mainitem.TotalBalance);
                    CurrentTotalClaimBalance = Temptotalbalance || 0;
                    console.log(mainitem.TotalInsuranceBalance + "__TotalInsuranceBalance");
                }
                else {
                    /*   mainitem.TotalBalance = totalChargeAmt - (mainitem.TotalInsurancePayment + mainitem.TotalClaimAdjustmentAmount - totalPatPaymentAmount);*/

                    mainitem.TotalBalance = totalBalanceamt;
                    var Temptotalbalance = parseFloat(mainitem.TotalBalance);
                    CurrentTotalClaimBalance += Temptotalbalance || 0;
                }


                mainitem.TotalBalance = parseFloat(totalBalanceamt.toFixed(2));


                CurrentTotalAdjustmentAmount += totalServiceAdjAmt || 0;
                if (mainitem.IsSecondaryInsuranceAvailable) {
                    CurrentTotalPatientBalance = (mainitem.TotalDeductibleAmount + mainitem.TotalCoInsuranceAmount + mainitem.TotalCopayAmount);
                } else {
                    CurrentTotalPatientBalance += totalPatientBalance || 0;
                }
                CurrentTotalInsurancePayment += totalInsPaymentAmount || 0;

                finalPatientRespAmount += totalPatientResponsibility || 0;
                finalPatientPatientBalance += totalPatientBalance - totalPatPaymentAmount || 0;
                finalInsuranceBalance += parseFloat(mainitem.TotalInsuranceBalance) || 0;
            });

            $scope.mainClaimObject.FinalAdjustmentAmount = CurrentTotalAdjustmentAmount || 0;
            $scope.mainClaimObject.FinalPatientResponsibility = finalPatientRespAmount || 0;
            $scope.mainClaimObject.TotalPatientBalance = finalPatientPatientBalance || 0;
            $scope.mainClaimObject.TotalInsuranceBalance = finalInsuranceBalance || 0;
            $scope.mainClaimObject.FinalInsurancePayment = CurrentTotalInsurancePayment || 0;
            $scope.mainClaimObject.FinalClaimBalance = CurrentTotalClaimBalance || 0;
            $scope.mainClaimObject.FinalPatientBalance = finalPatientPatientBalance || 0;
            $scope.mainClaimObject.FinalTotalBalance = CurrentTotalClaimBalance || 0;
        }

        $scope.calculateClaimLineItemPaymentTotals = function (mainitem) {

            var InsuranceBalance = 0;
            var PatientBalance = 0;
            angular.forEach(mainitem.PatientClaimLineItems, function (sitem) {
                sitem.CurrentAdjustmentAmount = 0;
                sitem.CurrentPatientAdjustmentAmount = 0;
                var temptotalAdjamount = 0;
                var deductableamt = parseFloat(sitem.CurrentDeductibleAmount) || 0;
                var CoInsuranceAmt = parseFloat(sitem.CurrentCoInsuranceAmount) || 0;
                var CoPaymentAmt = parseFloat(sitem.CurrentCoPaymentAmount) || 0;
                var PatientResponsibilityAmt = parseFloat(sitem.CurrentPatientResponsibilityAmount) || 0;
                var WriteOffAmt = parseFloat(sitem.CurrentWriteOffAmount) || 0;
                let AllowedAmount = parseFloat(sitem.CurrentAllowedAmount) || 0;
                let CurrentPaymentAmount = parseFloat(sitem.CurrentInsurancePaymentAmount) || 0;
                var TotalChargeAmount = parseFloat(sitem.TotalChargeAmount) || 0;

                angular.forEach(sitem.ServiceAdjustments, function (Bitem) {
                    Bitem.AdjustmentAmount = parseFloat(Bitem.AdjustmentAmount) || 0;
                    if (Bitem.PayorPostingStatusId == 1) {
                        sitem.CurrentAdjustmentAmount += Bitem.AdjustmentAmount;
                    }
                    if (Bitem.PayorPostingStatusId == 2 && mainitem.IsSecondaryInsuranceAvailable) {
                        sitem.CurrentPatientAdjustmentAmount += Bitem.AdjustmentAmount;
                    }
                    if (Bitem.DeleteInd == "N") {
                        temptotalAdjamount += Bitem.AdjustmentAmount;
                    }
                });
                sitem.CurrentServiceAdjustmentAmount = temptotalAdjamount.toFixed(2);



                let InsurancePaymentAmount = parseFloat(sitem.CurrentInsurancePaymentAmount) || 0;
                let PaymentAmoun = parseFloat(sitem.CurrentPaymentAmount) || 0;
                let AdjustmentAmount = parseFloat(sitem.CurrentAdjustmentAmount) || 0;






            });
            $scope.calculateClaimPaymentTotalAmounts(mainitem);
            //$scope.calculateClaimPaymentTotalAmountsNew(mainitem);
        };

        $scope.AddNewAdjustmentForLineItem = function (sub, item, mainitem) {

            var templist = $filter("filter")($scope.PaymentReasonList, { "AdjustmentReasonId": sub.AdjustmentReasonId }, true) || [];
            if (templist.length > 0) {
                sub.AdjustmentReasonCode = templist[0].AdjustmentReasonCode;
                sub.GroupCode = templist[0].GroupCode || '';
            }

            var AdjustmentAmount = parseFloat(sub.AdjustmentAmount) || 0;
            var AdjReasonCode = sub.AdjustmentReasonCode || "";
            if (AdjReasonCode == "") {
                alertify.error("Please select adjustment code");
                return false;
            }
            if (AdjustmentAmount == 0) {
                alertify.error("Please Enter Adjustment Amount to add New");
                return false;
            }
            var obj = {
                "AdjustmentId": 0,
                "EOBLineItemId": item.EOBLineItemId || 0,
                "ClaimLineItemId": item.ClaimLineItemId,
                "AdjustmentReasonCode": "",
                "AdjustmentReasonId": "",
                "GroupCode": '',
                "AdjsutmentDescription": '',
                "PayorPostingStatusId": 2,
                "PayorPostingStatus": 'Transfer',
                "AdjustmentAmount": null,
                "Notes": "",
                "DeleteInd": "N",
                "ActiveInd": "Y",
            }
            item.ServiceAdjustments.push(obj);

            item.CurrentAdjustmentAmount = 0;

            angular.forEach(item.ServiceAdjustments, function (Bitem) {
                if (Bitem.AdjustmentReasonId != 1 && Bitem.AdjustmentReasonId != 2 && Bitem.AdjustmentReasonId != 3) {
                    Bitem.AdjustmentAmount = parseFloat(Bitem.AdjustmentAmount) || 0;
                    item.CurrentAdjustmentAmount += Bitem.AdjustmentAmount;
                }

            });

            if (sub.AdjustmentReasonId === 1 && sub.PayorPostingStatusId == 2) {
                item.CurrentDeductibleAmount = sub.AdjustmentAmount;
            }
            else if (sub.AdjustmentReasonId === 2 && sub.PayorPostingStatusId == 2) {
                item.CurrentCoInsuranceAmount = sub.AdjustmentAmount;
            }
            else if (sub.AdjustmentReasonId === 3 && sub.PayorPostingStatusId == 2) {
                item.CurrentCoPaymentAmount = sub.AdjustmentAmount;
            } else {

            }
            //$scope.calculateClaimLineItems(item, mainitem);
            //$scope.calculateClaimLineItemPaymentTotals(mainitem);

        }


        $scope.calculateClaimPaymentTotalAmounts = function (mainitem) {


            var totalBalanceamt = 0, totalPatientAdjustmentAmt = 0, totalInsuranceBalance = 0, totalChargeAmt = 0, totalPatientBalance = 0, totalPatientResponsibility = 0, totalPaymentAmount = 0, totalAdjustmentAmt = 0, totalCoInsAmt = 0, totalCoPayAmt = 0, totalDeductibleAmt = 0, totalWriteOffAmt = 0, totalAllowedAmt = 0, totallineitemsAdjAmt = 0, totallineitemsAdjCodeAmt = 0, totallineitemswriteoffAmt = 0;
            angular.forEach(mainitem.PatientClaimLineItems, function (sitem) {
                var CurrentAllowedAmount = parseFloat(sitem.CurrentAllowedAmount) || 0;
                var CurrentInsuranceBalance = parseFloat(sitem.CurrentInsuranceBalance) || 0;
                var CurrentPatientBalance = parseFloat(sitem.CurrentPatientBalance) || 0;
                var CurrentPatientResponsibilityAmount = parseFloat(sitem.CurrentPatientResponsibilityAmount) || 0;
                var CurrentInsurancePaymentAmount = parseFloat(sitem.CurrentInsurancePaymentAmount) || 0;
                var CurrentAdjustmentAmount = parseFloat(sitem.CurrentAdjustmentAmount) || 0;
                var CurrentWriteOffAmount = parseFloat(sitem.CurrentWriteOffAmount) || 0;
                var CurrentCoInsuranceAmount = parseFloat(sitem.CurrentCoInsuranceAmount) || 0;
                var CurrentCoPaymentAmount = parseFloat(sitem.CurrentCoPaymentAmount) || 0;
                var CurrentDeductibleAmount = parseFloat(sitem.CurrentDeductibleAmount) || 0;
                var CurrentServiceAdjustmentAmount = parseFloat(sitem.CurrentServiceAdjustmentAmount) || 0;
                var CurrentAdjustmentCodeAmount = parseFloat(sitem.CurrentAdjustmentCodeAmount) || 0;
                var CurrentChargeAmount = parseFloat(sitem.TotalChargeAmount) || 0;
                var PreviousWriteOffAmount = parseFloat(sitem.WriteOffAmount) || 0;
                var CurrentTotalBalance = parseFloat(sitem.TotalBalance) || 0;
                var CurrentPatientAdjustmentAmount = parseFloat(sitem.CurrentPatientAdjustmentAmount) || 0;



                totalChargeAmt += CurrentChargeAmount;
                totalAllowedAmt += CurrentAllowedAmount;
                totalInsuranceBalance += CurrentInsuranceBalance;
                totalPatientBalance += CurrentPatientBalance;
                totalPatientResponsibility += CurrentPatientResponsibilityAmount;
                totalPaymentAmount += CurrentInsurancePaymentAmount;
                totalAdjustmentAmt += CurrentAdjustmentAmount;
                totalWriteOffAmt += CurrentWriteOffAmount;
                totalCoInsAmt += CurrentCoInsuranceAmount;
                totalCoPayAmt += CurrentCoPaymentAmount;
                totalDeductibleAmt += CurrentDeductibleAmount;
                totallineitemsAdjAmt += CurrentServiceAdjustmentAmount;
                totallineitemsAdjCodeAmt += CurrentAdjustmentCodeAmount;
                totallineitemswriteoffAmt += PreviousWriteOffAmount;
                totalBalanceamt += CurrentTotalBalance;
                totalPatientAdjustmentAmt += CurrentPatientAdjustmentAmount;
            });

            mainitem.TotalAllowedAmount = parseFloat(totalAllowedAmt.toFixed(2));
            mainitem.TotalInsuranceBalance = parseFloat(totalInsuranceBalance.toFixed(2));
            mainitem.TotalPatientBalance = parseFloat(totalPatientBalance.toFixed(2));
            mainitem.TotalClaimAdjustmentAmount = parseFloat(totallineitemsAdjAmt.toFixed(2));
            mainitem.TotalAdjustmentAmount = parseFloat(totallineitemsAdjCodeAmt.toFixed(2));
            mainitem.TotalWriteOffAmount = parseFloat(totalWriteOffAmt.toFixed(2));
            mainitem.TotalInsurancePayment = parseFloat(totalPaymentAmount.toFixed(2));
            totalPatientResponsibility = parseFloat(totalPatientResponsibility.toFixed(2));
            mainitem.TotalPaidAmount = totalPaymentAmount + totalPatientResponsibility;
            mainitem.TotalCoInsuranceAmount = parseFloat(totalCoInsAmt.toFixed(2));
            mainitem.TotalCopayAmount = parseFloat(totalCoPayAmt.toFixed(2));
            mainitem.TotalPatientResponsibilityAmount = totalPatientResponsibility;
            mainitem.TotalDeductibleAmount = parseFloat(totalDeductibleAmt.toFixed(2));
            mainitem.TotalBalance = totalChargeAmt - (mainitem.TotalInsurancePayment + mainitem.TotalClaimAdjustmentAmount);
            if (mainitem.IdentifierId === 2 && totalBalanceamt !== 0) {
                mainitem.TotalBalance = totalChargeAmt - (mainitem.TotalPreviousPaidAmount + totallineitemswriteoffAmt + totalPaymentAmount + totalPatientResponsibility + totallineitemsAdjAmt);
                mainitem.TotalInsuranceBalance = totalChargeAmt - (mainitem.TotalPreviousPaidAmount + totallineitemswriteoffAmt + totalPaymentAmount + totalPatientResponsibility + totallineitemsAdjAmt);
            } else if (mainitem.IdentifierId === 2 && totalBalanceamt === 0) {
                mainitem.TotalBalance = 0;
                mainitem.TotalInsuranceBalance = 0;
            }

            if ($scope.mainClaimObject.IsSecondaryInsuranceAvailable) {
                $scope.mainClaimObject.TotalSecondaryInsPatientBalance = totalPatientAdjustmentAmt;
            } else {
                $scope.mainClaimObject.TotalPatientBalance = mainitem.TotalPatientBalance || 0;
            }
            $scope.mainClaimObject.TotalInsuranceBalance = mainitem.TotalInsuranceBalance || 0;
            $scope.mainClaimObject.TotalBalance = mainitem.TotalBalance || 0;
            $scope.mainClaimObject.TotalAdjustmentAmount = mainitem.TotalClaimAdjustmentAmount || 0;

        };

        //$scope.validateSecondaryPosting = function (currentEOB) {
        //    var appointmentInsList = $scope.AppointmentInsuranceDetails || [];
        //    var eobClaims = $scope.AllPatientClaimEOBDetails || [];

        //    eobClaims.forEach(function (eob) {
        //        var match = appointmentInsList.find(a => a.PatientInsuranceDetailId === eob.PatientInsuranceDetailId);
        //        if (match) eob.IdentifierId = match.IdentifierId;
        //    });

        //    var currentIns = appointmentInsList.find(a => a.PatientInsuranceDetailId === currentEOB.PatientInsuranceDetailId);
        //    if (!currentIns) return true; 

        //    if (currentIns.IdentifierId === 1) return true; 

        //    var prevIns = appointmentInsList.find(a => a.IdentifierId === (currentIns.IdentifierId - 1));
        //    if (!prevIns) return true; 

        //    var isPrevPosted = eobClaims.some(e =>
        //        e.PatientInsuranceDetailId === prevIns.PatientInsuranceDetailId &&
        //        e.DeleteInd === 'N' &&         
        //        [1, 19, 29].includes(e.ERAPaidBy) 
        //    );

        //    if (!isPrevPosted) {
        //        var msg = currentIns.IdentifierId === 2
        //            ? "Primary insurance posting must be completed before posting Secondary insurance."
        //            : "Secondary insurance posting must be completed before posting Tertiary insurance.";
        //        alertify.error(msg);
        //        return false;
        //    }

        //    return true; 
        //};



        $scope.EOBClaimPaymentPosting = function (val, mainitem, type, test, popup) {


            if (mainEOBPaymentPostingObj.ProcessingTypeId == 3) {
                var poolCap = parseFloat(mainEOBPaymentPostingObj.TotalPaymentAmount || 0);
                var poolCapUsed = parseFloat(mainEOBPaymentPostingObj.TotalAppliedAmount || 0);
                var remaining = poolCap - poolCapUsed;
                var claimPayment = 0;
                angular.forEach(mainitem.PatientClaimLineItems, function (lineItem) {
                    claimPayment += parseFloat(lineItem.CurrentInsurancePaymentAmount || 0);
                });
                if (poolCap > 0 && claimPayment > remaining) {
                    alertify.error(
                        "Posting failed: Insurance payment ($" + claimPayment.toFixed(2) +
                        ") exceeds pool cap balance ($" + remaining.toFixed(2) + ")."
                    );
                    return false;
                }
            }


            let IsSecondaryClaim = false;
            if (val == 'Secondary') {
                IsSecondaryClaim = true;
            }

            let IsSecondaryClaimEdit = false;
            if (val == 'SecondaryEdit') {
                IsSecondaryClaimEdit = true;
            }



            mainitem.InsuranceIdentifierId = 1;
            if (mainitem.IsSecondaryChargeEditedClaim) {
                mainitem.InsuranceIdentifierId = mainitem.IdentifierId;
            }





            let ClaimLineItems = [];
            var denialCount = 0;
            //mainitem.ERAPaidBy = parseInt(mainitem.ERAPaidBy) || 0;
            if (mainitem.ERAPaidBy == "") {
                alertify.error("Please select a Paid By");
                return false;
            }

            if (!mainitem.PayerClaimControlNumber) {
                alertify.error("Please Enter ICN Number");
                return false;
            }
            let filtredobj2 = $filter("filter")(mainitem.PatientClaimLineItems, { "IsChecked": true }) || [];
            if (filtredobj2.length == 0) {
                alertify.error("Please select any service");
                return false;
            }
            let checkUnAppliedAmount = Math.round(parseFloat(mainObject.CheckUnAppliedAmount) * 100) / 100;
            let totalInsurancePayment = Math.round(parseFloat(mainitem.TotalInsurancePayment) * 100) / 100;

            if (mainitem.ERAPaidBy !== '22') {
                if ($scope.PreviousSavedTotalInsurancePayementAmount > totalInsurancePayment) {

                }
                else if ($scope.PreviousSavedTotalInsurancePayementAmount != totalInsurancePayment) {

                    //if (checkUnAppliedAmount < totalInsurancePayment) {
                    //    alertify.error("The payment entered exceeds the check balance amount");
                    //    return false;
                    //}
                }
                else {

                }

            }
            mainObject.CheckUnAppliedAmount = checkUnAppliedAmount.toFixed(2);
            mainitem.TotalInsurancePayment = totalInsurancePayment.toFixed(2);




            let TransactionSourceId = 1;
            let TransactionSource = "Primary Insurance";
            let TransactionTypeId = 32;
            let TransactionType = "PrimaryInsurancePayment";
            mainitem.ERAPaidBy = parseInt(mainitem.ERAPaidBy) || 0;
            if (mainitem.ERAPaidBy === 1 || mainitem.ERAPaidBy === 19) {
                TransactionSourceId = 1;
                TransactionSource = "Primary Insurance";
                TransactionTypeId = 32;
                TransactionType = "PrimaryInsurancePayment";
            }
            else if (mainitem.ERAPaidBy === 2 || mainitem.ERAPaidBy === 20) {
                TransactionSourceId = 2;
                TransactionSource = "Secondary Insurance";
                TransactionTypeId = 36;
                TransactionType = "SecondaryInsPayment";
            }
            else {

            }

            let SettlementStatusId = 3;
            let SettlementStatus = "Fully Settled";

            if (filtredobj2.length == mainitem.PatientClaimLineItems.length) {
                SettlementStatusId = 3;
                SettlementStatus = "Fully Settled";
            } else {
                SettlementStatusId = 2;
                SettlementStatus = "Partially Settled";
            }

            if (mainitem.PatientClaimLineItems.length > 0) {
                angular.forEach(mainitem.PatientClaimLineItems, function (item) {
                    if (item.IsChecked) {
                        var filter = $filter("filter")(item.ServiceAdjustments, function (fitem) { return fitem.PayorPostingStatusId === 3; }, true) || [];
                        if (filter.length > 0) {
                            denialCount++;
                        };
                    }

                    if (item.ServiceAdjustments.length > 0) {

                        item.ServiceAdjustments = item.ServiceAdjustments.filter(function (sitem) {
                            if (sitem.AdjustmentAmount === 0 && sitem.AdjustmentId === 0) {
                                return false; // Remove this item by returning false
                            }
                            if (sitem.AdjustmentId != 0 && sitem.AdjustmentAmount == 0) {
                                sitem.DeleteInd = "Y";
                            }
                            sitem.ClaimLineItemId = item.ClaimLineItemId;

                            return true; // Keep the item
                        });
                    }

                    item.CurrentInsurancePaymentAmount = item.CurrentInsurancePaymentAmount || 0;
                    item.CurrentAdjustmentAmount = item.CurrentAdjustmentAmount || 0;
                    item.CurrentPatientBalance = item.CurrentPatientBalance || 0;
                    item.CurrentWriteOffAmount = item.CurrentWriteOffAmount || 0;

                   var lineCharge = 0, priorPaid = 0, priorAdj = 0,
                        remainingBalanceBeforeThisPayer = 0, currentPayment = 0,
                        currentPatientResp = 0, incrementalAdjustment = 0;
                    var isSecondaryOrTertiaryPayer = (mainitem.ERAPaidBy === 2 || mainitem.ERAPaidBy === 3 ||
                        mainitem.ERAPaidBy === 20 || mainitem.ERAPaidBy === 21);
                    var hasPriorPayerOnLine =
                        (parseFloat(item.PreviousInsurancePaymentAmount) || 0) > 0 ||
                        (parseFloat(item.PreviousInsuranceAdjustmentAmount) || 0) > 0;

                var originalAdjustmentAmount = parseFloat(item.CurrentAdjustmentAmount) || 0;

                  var priorSettledOnLine =
                        (parseFloat(item.PreviousInsurancePaymentAmount) || 0) +
                        (parseFloat(item.PreviousInsuranceAdjustmentAmount) || 0);
                    var isPriorSnapshotStale =
                        priorSettledOnLine > (parseFloat(item.TotalChargeAmount) || 0) + 0.01;

                    if (isPriorSnapshotStale) {
                        console.log("Stale prior snapshot on line item " + item.ClaimLineItemId +
                            ": prior settled " + priorSettledOnLine.toFixed(2) +
                            " exceeds charge " + (parseFloat(item.TotalChargeAmount) || 0).toFixed(2) +
                            " - keeping the payer-reported adjustment " + originalAdjustmentAmount.toFixed(2));
                    }

                    var shouldRecalculateAdjustment = (isSecondaryOrTertiaryPayer || hasPriorPayerOnLine)
                        && mainitem.ERAPaidBy !== 22
                        && !IsSecondaryClaimEdit
                        && !isPriorSnapshotStale
                        && originalAdjustmentAmount >= 0;

                    if (shouldRecalculateAdjustment && item.IsChecked) {
                        lineCharge = parseFloat(item.TotalChargeAmount) || 0;
                        priorPaid = parseFloat(item.PreviousInsurancePaymentAmount) || 0;
                        priorAdj = parseFloat(item.PreviousInsuranceAdjustmentAmount) || 0;
                        remainingBalanceBeforeThisPayer = lineCharge - priorPaid - priorAdj;

                        currentPayment = parseFloat(item.CurrentInsurancePaymentAmount) || 0;
                        currentPatientResp = parseFloat(item.CurrentPatientResponsibilityAmount) || 0;

                        incrementalAdjustment = remainingBalanceBeforeThisPayer - currentPayment - currentPatientResp;
                        if (incrementalAdjustment < 0) {
                            incrementalAdjustment = 0;
                        }

                      item.CurrentAdjustmentAmount = parseFloat(incrementalAdjustment.toFixed(2));
                    }

                    /* Backstop for a line the balance calc never touched: a reversal
                       reverses the booked adjustment, not the CAS the payer resent. */
                    if (mainitem.ERAPaidBy == 22 && item.IsChecked) {
                        item.CurrentAdjustmentAmount = -(parseFloat(item.PreviousInsuranceAdjustmentAmount) || 0);
                    }

                      if (shouldRecalculateAdjustment && item.IsChecked) {
                        var recheckBalance = lineCharge - priorPaid - priorAdj
                            - currentPayment - item.CurrentAdjustmentAmount - currentPatientResp;

                        //if (recheckBalance < -0.01 && mainitem.ERAPaidBy !== 22) {
                        //    alertify.error(
                        //        "Posting blocked on service line " +
                        //        (item.ServiceId || item.ClaimLineItemId) +
                        //        ": resulting balance is negative ($" + recheckBalance.toFixed(2) +
                        //        "). Please review Payment Amt / Patient Resp. entered for this line."
                        //    );
                        //    return; // skip this angular.forEach iteration
                        //}
                    }
                    let ClaimTransaction = [];
                    if (item.CurrentInsurancePaymentAmount == 0 && item.CurrentAdjustmentAmount == 0 && item.CurrentPatientBalance == 0 && item.CurrentWriteOffAmount == 0 && item.IsChecked) {
                        let InsurancePaymentAmount = 0;
                        let Tranobj = {
                            "ClaimTransactionId": 0,
                            "PatientInsuranceDetailId": mainitem.PatientInsuranceDetailId,
                            "ClaimLineItemId": item.ClaimLineItemId,
                            "OrganizationId": $scope.HospitalId,
                            "TransactionDate": $filter('date')($scope.CurreDate, "yyyy-MM-dd"),
                            "TransactionAmount": - + InsurancePaymentAmount,
                            "PatientAmount": 0,
                            "InsuranceAmount": -+InsurancePaymentAmount,
                            "EOBId": mainitem.EOBId,
                            "PayorId": mainitem.PrimaryInsuranceId,
                            "AdjustmentReasonId": null,
                            "AdjustmentReasonCode": "",
                            "ReferenceNumber": mainObject.ReferenceNumber,
                            "TransactionTypeId": TransactionTypeId,
                            "TransactionType": TransactionType,
                            "TransactionSourceId": TransactionSourceId,
                            "TransactionSource": TransactionSource,
                            "SettlementStatusId": SettlementStatusId || 3,
                            "SettlementStatus": SettlementStatus || "Fully Settled",
                            "TransactionNotes": "",
                            "InsuranceIdentifierId": mainitem.InsuranceIdentifierId
                        }
                        ClaimTransaction.push(Tranobj);
                    }

                    if (item.CurrentInsurancePaymentAmount != 0 && item.IsChecked) {
                        let InsurancePaymentAmount = parseFloat(item.CurrentInsurancePaymentAmount) || 0;
                        let Tranobj = {
                            "ClaimTransactionId": 0,
                            "PatientInsuranceDetailId": mainitem.PatientInsuranceDetailId,
                            "ClaimLineItemId": item.ClaimLineItemId,
                            "OrganizationId": $scope.HospitalId,
                            "TransactionDate": $filter('date')($scope.CurreDate, "yyyy-MM-dd"),
                            "TransactionAmount": - + InsurancePaymentAmount,
                            "PatientAmount": 0,
                            "InsuranceAmount": -+InsurancePaymentAmount,
                            "EOBId": mainitem.EOBId,
                            "PayorId": mainitem.PrimaryInsuranceId,
                            "AdjustmentReasonId": null,
                            "AdjustmentReasonCode": "",
                            "ReferenceNumber": mainObject.ReferenceNumber,
                            "TransactionTypeId": TransactionTypeId,
                            "TransactionType": TransactionType,
                            "TransactionSourceId": TransactionSourceId,
                            "TransactionSource": TransactionSource,
                            "SettlementStatusId": SettlementStatusId || 3,
                            "SettlementStatus": SettlementStatus || "Fully Settled",
                            "TransactionNotes": "",
                            "InsuranceIdentifierId": mainitem.InsuranceIdentifierId
                        }
                        ClaimTransaction.push(Tranobj);
                    }

                    if (item.CurrentPatientBalance != 0 && item.IsChecked) {
                        let PatientBalance = parseFloat(item.CurrentPatientBalance) || 0;
                        let Tranobj = {
                            "ClaimTransactionId": 0,
                            "ClaimLineItemId": item.ClaimLineItemId,
                            "PatientInsuranceDetailId": mainitem.PatientInsuranceDetailId,
                            "OrganizationId": $scope.HospitalId,
                            "TransactionDate": $filter('date')($scope.CurreDate, "yyyy-MM-dd"),
                            "TransactionAmount": 0,
                            "PatientAmount": PatientBalance,
                            "InsuranceAmount": -+PatientBalance || 0,
                            "EOBId": mainitem.EOBId,
                            "PayorId": mainitem.PrimaryInsuranceId,
                            "AdjustmentReasonId": null,
                            "AdjustmentReasonCode": "",
                            "ReferenceNumber": mainObject.ReferenceNumber,
                            "TransactionTypeId": 30,
                            "TransactionType": "Patient Responsibility",
                            "TransactionSourceId": TransactionSourceId,
                            "TransactionSource": TransactionSource,
                            "SettlementStatusId": SettlementStatusId || 3,
                            "SettlementStatus": SettlementStatus || "Fully Settled",
                            "TransactionNotes": "",
                            "InsuranceIdentifierId": mainitem.InsuranceIdentifierId
                        }
                        ClaimTransaction.push(Tranobj);
                    }
                    //if (mainitem.ERAPaidBy === 22) {
                    //    if (item.CurrentPatientBalance != 0 && item.IsChecked) {
                    //        let PatientBalance = parseFloat(item.CurrentPatientBalance) || 0;
                    //        let Tranobj = {
                    //            "ClaimTransactionId": 0,
                    //            "ClaimLineItemId": item.ClaimLineItemId,
                    //            "PatientInsuranceDetailId": mainitem.PatientInsuranceDetailId,
                    //            "OrganizationId": $scope.HospitalId,
                    //            "TransactionDate": $filter('date')($scope.CurreDate, "yyyy-MM-dd"),
                    //            "TransactionAmount": 0,
                    //            "PatientAmount": -+PatientBalance,
                    //            "InsuranceAmount": PatientBalance || 0,
                    //            "EOBId": mainitem.EOBId,
                    //            "PayorId": mainitem.PrimaryInsuranceId,
                    //            "AdjustmentReasonId": null,
                    //            "AdjustmentReasonCode": "",
                    //            "ReferenceNumber": mainObject.ReferenceNumber,
                    //            "TransactionTypeId": 105,
                    //            "TransactionType": "Patient Responsibility Reversal",
                    //            "TransactionSourceId": TransactionSourceId,
                    //            "TransactionSource": TransactionSource,
                    //            "SettlementStatusId": SettlementStatusId || 3,
                    //            "SettlementStatus": SettlementStatus || "Fully Settled",
                    //            "TransactionNotes": "",
                    //            "InsuranceIdentifierId": mainitem.InsuranceIdentifierId
                    //        }

                    //        ClaimTransaction.push(Tranobj);
                    //    }

                    //}
                    if (item.CurrentTotalBalance < 0 && item.PatientPaymentAmount > 0 && mainitem.ERAPaidBy !== '22' && item.IsChecked) {
                        let AdjustmentAmount = parseFloat(item.CurrentTotalBalance) || 0;
                        let Tranobj = {
                            "ClaimTransactionId": 0,
                            "ClaimLineItemId": item.ClaimLineItemId,
                            "PatientInsuranceDetailId": mainitem.PatientInsuranceDetailId,
                            "OrganizationId": $scope.HospitalId,
                            "TransactionDate": $filter('date')($scope.CurreDate, "yyyy-MM-dd"),
                            "TransactionAmount": -AdjustmentAmount,
                            "PatientAmount": -AdjustmentAmount,
                            "InsuranceAmount": 0,
                            "EOBId": mainitem.EOBId,
                            "PayorId": mainitem.PrimaryInsuranceId,
                            "AdjustmentReasonId": null,
                            "AdjustmentReasonCode": "",
                            "ReferenceNumber": mainObject.ReferenceNumber,
                            "TransactionTypeId": 101,
                            "TransactionType": "Patient Payment Reversal",
                            "TransactionSourceId": TransactionSourceId,
                            "TransactionSource": TransactionSource,
                            "SettlementStatusId": SettlementStatusId || 3,
                            "SettlementStatus": SettlementStatus || "Fully Settled",
                            "TransactionNotes": "",
                            "InsuranceIdentifierId": mainitem.InsuranceIdentifierId
                        }

                        ClaimTransaction.push(Tranobj);
                    }

                    if (item.isChargeAmountDifferent) {

                        let TotalChargeAmount = parseFloat(item.TotalChargeAmount) || 0;

                        let TranChargegobj = {
                            "ClaimTransactionId": 0,
                            "ClaimLineItemId": item.ClaimLineItemId,
                            "PatientInsuranceDetailId": mainitem.PatientInsuranceDetailId,
                            "OrganizationId": $scope.HospitalId,
                            "TransactionDate": $filter('date')($scope.CurreDate, "yyyy-MM-dd"),
                            "TransactionAmount": TotalChargeAmount,
                            "PatientAmount": 0,
                            "InsuranceAmount": TotalChargeAmount || 0,
                            "EOBId": mainitem.EOBId,
                            "PayorId": mainitem.PrimaryInsuranceId,
                            "AdjustmentReasonId": null,
                            "AdjustmentReasonCode": "",
                            "ReferenceNumber": mainObject.ReferenceNumber,
                            "TransactionTypeId": 3,
                            "TransactionType": "Charges",
                            "TransactionSourceId": TransactionSourceId,
                            "TransactionSource": TransactionSource,
                            "SettlementStatusId": SettlementStatusId || 3,
                            "SettlementStatus": SettlementStatus || "Fully Settled",
                            "TransactionNotes": "",
                            "InsuranceIdentifierId": mainitem.InsuranceIdentifierId
                        }

                        ClaimTransaction.push(TranChargegobj);

                        let ChargeAmount = parseFloat(item.CurrentTotalChargeAmount) || 0;

                        let TranReversalobj = {
                            "ClaimTransactionId": 0,
                            "ClaimLineItemId": item.ClaimLineItemId,
                            "PatientInsuranceDetailId": mainitem.PatientInsuranceDetailId,
                            "OrganizationId": $scope.HospitalId,
                            "TransactionDate": $filter('date')($scope.CurreDate, "yyyy-MM-dd"),
                            "TransactionAmount": -ChargeAmount,
                            "PatientAmount": 0,
                            "InsuranceAmount": -ChargeAmount,
                            "EOBId": mainitem.EOBId,
                            "PayorId": mainitem.PrimaryInsuranceId,
                            "AdjustmentReasonId": null,
                            "AdjustmentReasonCode": "",
                            "ReferenceNumber": mainObject.ReferenceNumber,
                            "TransactionTypeId": 108,
                            "TransactionType": "Charges Reversal",
                            "TransactionSourceId": TransactionSourceId,
                            "TransactionSource": TransactionSource,
                            "SettlementStatusId": SettlementStatusId || 3,
                            "SettlementStatus": SettlementStatus || "Fully Settled",
                            "TransactionNotes": "",
                            "InsuranceIdentifierId": mainitem.InsuranceIdentifierId
                        }

                        ClaimTransaction.push(TranReversalobj);
                    }


                    if (mainEOBPaymentPostingObj.ProcessingTypeId == 3) {
                        let co24AdjustmentAmount = 0;
                        var lineHasCO24 = (item.ServiceAdjustments || []).some(function (a) {
                            return a.GroupCode === "CO" && a.AdjustmentReasonCode === "24";
                        });
                        if (lineHasCO24) {
                            angular.forEach(item.ServiceAdjustments || [], function (adj) {
                                if (adj.GroupCode === "CO" &&
                                    adj.AdjustmentReasonCode !== "24" &&
                                    adj.AdjustmentReasonCode !== "151") {

                                    co24AdjustmentAmount += parseFloat(adj.AdjustmentAmount) || 0;
                                }
                            });

                            if (item.CurrentAdjustmentAmount != 0 && item.IsChecked) {
                                let AdjustmentAmount = parseFloat(item.CurrentAdjustmentAmount) || 0;
                                let Tranobj = {
                                    "ClaimTransactionId": 0,
                                    "ClaimLineItemId": item.ClaimLineItemId,
                                    "PatientInsuranceDetailId": mainitem.PatientInsuranceDetailId,
                                    "OrganizationId": $scope.HospitalId,
                                    "TransactionDate": $filter('date')($scope.CurreDate, "yyyy-MM-dd"),
                                    "TransactionAmount": -+AdjustmentAmount,
                                    "PatientAmount": 0,
                                    "InsuranceAmount": -+AdjustmentAmount,
                                    "EOBId": mainitem.EOBId,
                                    "PayorId": mainitem.PrimaryInsuranceId,
                                    "AdjustmentReasonId": null,
                                    "AdjustmentReasonCode": "",
                                    "ReferenceNumber": mainObject.ReferenceNumber,
                                    "TransactionTypeId": 53,
                                    "TransactionType": "CONTRACTUAL ADJUSTMENT",
                                    "TransactionSourceId": TransactionSourceId,
                                    "TransactionSource": TransactionSource,
                                    "SettlementStatusId": SettlementStatusId || 3,
                                    "SettlementStatus": SettlementStatus || "Fully Settled",
                                    "TransactionNotes": "",
                                    "InsuranceIdentifierId": mainitem.InsuranceIdentifierId
                                }

                                ClaimTransaction.push(Tranobj);
                            }
                        }

                        if (co24AdjustmentAmount != 0) {

                            let Tranobj = {
                                "ClaimTransactionId": 0,
                                "ClaimLineItemId": item.ClaimLineItemId,
                                "PatientInsuranceDetailId": mainitem.PatientInsuranceDetailId,
                                "OrganizationId": $scope.HospitalId,
                                "TransactionDate": $filter('date')($scope.CurreDate, "yyyy-MM-dd"),
                                "TransactionAmount": co24AdjustmentAmount,
                                "PatientAmount": 0,
                                "InsuranceAmount": co24AdjustmentAmount,
                                "EOBId": mainObject.EOBId,
                                "PayorId": mainitem.PrimaryInsuranceId,
                                "AdjustmentReasonId": null,
                                "AdjustmentReasonCode": "",
                                "ReferenceNumber": mainObject.ReferenceNumber,
                                "TransactionTypeId": 104,
                                "TransactionType": "Adjustment Reversal",
                                "TransactionSourceId": TransactionSourceId,
                                "TransactionSource": TransactionSource,
                                "SettlementStatusId": 7,
                                "SettlementStatus": "Cancel Payment",
                                "TransactionNotes": "",
                                "InsuranceIdentifierId": mainitem.InsuranceIdentifierId
                            }

                            ClaimTransaction.push(Tranobj);
                        }
                    } else {
                        if (item.CurrentAdjustmentAmount != 0 && item.IsChecked) {
                            let AdjustmentAmount = parseFloat(item.CurrentAdjustmentAmount) || 0;
                            // on a reversal this backs a booked adjustment out of the
                            // ledger, so it is an Adjustment Reversal - not a fresh
                            // contractual write off against the reopened charge.
                            let isReversalPosting = mainitem.ERAPaidBy == 22;
                            let Tranobj = {
                                "ClaimTransactionId": 0,
                                "ClaimLineItemId": item.ClaimLineItemId,
                                "PatientInsuranceDetailId": mainitem.PatientInsuranceDetailId,
                                "OrganizationId": $scope.HospitalId,
                                "TransactionDate": $filter('date')($scope.CurreDate, "yyyy-MM-dd"),
                                "TransactionAmount": -+AdjustmentAmount,
                                "PatientAmount": 0,
                                "InsuranceAmount": -+AdjustmentAmount,
                                "EOBId": mainitem.EOBId,
                                "PayorId": mainitem.PrimaryInsuranceId,
                                "AdjustmentReasonId": null,
                                "AdjustmentReasonCode": "",
                                "ReferenceNumber": mainObject.ReferenceNumber,
                                "TransactionTypeId": isReversalPosting ? 104 : 53,
                                "TransactionType": isReversalPosting ? "Adjustment Reversal" : "CONTRACTUAL ADJUSTMENT",
                                "TransactionSourceId": TransactionSourceId,
                                "TransactionSource": TransactionSource,
                                "SettlementStatusId": isReversalPosting ? 7 : (SettlementStatusId || 3),
                                "SettlementStatus": isReversalPosting ? "Cancel Payment" : (SettlementStatus || "Fully Settled"),
                                "TransactionNotes": "",
                                "InsuranceIdentifierId": mainitem.InsuranceIdentifierId
                            }
                            ClaimTransaction.push(Tranobj);
                        }
                    }

                    if (item.CurrentWriteOffAmount != 0 && item.IsChecked) {
                        let AdjustmentAmount = parseFloat(item.CurrentWriteOffAmount) || 0;
                        let Tranobj = {
                            "ClaimTransactionId": 0,
                            "ClaimLineItemId": item.ClaimLineItemId,
                            "PatientInsuranceDetailId": mainitem.PatientInsuranceDetailId,
                            "OrganizationId": $scope.HospitalId,
                            "TransactionDate": $filter('date')($scope.CurreDate, "yyyy-MM-dd"),
                            "TransactionAmount": -+AdjustmentAmount,
                            "PatientAmount": 0,
                            "InsuranceAmount": -+AdjustmentAmount,
                            "EOBId": mainitem.EOBId,
                            "PayorId": mainitem.PrimaryInsuranceId,
                            "AdjustmentReasonId": null,
                            "AdjustmentReasonCode": "",
                            "ReferenceNumber": mainObject.ReferenceNumber,
                            "TransactionTypeId": 13,
                            "TransactionType": "Posting Write Off",
                            "TransactionSourceId": TransactionSourceId,
                            "TransactionSource": TransactionSource,
                            "SettlementStatusId": SettlementStatusId || 3,
                            "SettlementStatus": SettlementStatus || "Fully Settled",
                            "TransactionNotes": "",
                            "InsuranceIdentifierId": mainitem.InsuranceIdentifierId
                        }

                        ClaimTransaction.push(Tranobj);
                    }



                    let prevAdjAmt = 0;
                    let TotalChargeAmount = 0;
                    let Paymentamt = 0;
                    let IsReversal = true;

                    // A stale snapshot means the payer already sent the reversal for this line as its
                    // own claim, so the prior adjustment has been backed out of the ledger. Reversing
                    // it a second time here would cancel the reversal and leave the charge unwritten off.
                    if (!isPriorSnapshotStale &&
                        (mainitem.ERAPaidBy == 2 || mainitem.ERAPaidBy == 3 || mainitem.ERAPaidBy == 20 || mainitem.ERAPaidBy == 21 || (item.PreviousInsuranceAdjustmentAmount > 0 && (mainitem.ERAPaidBy == 19 || mainitem.ERAPaidBy == 1)))) {
                        prevAdjAmt = parseFloat(item.PreviousInsuranceAdjustmentAmount) || 0;
                        TotalChargeAmount = parseFloat(item.TotalChargeAmount) || 0;
                        Paymentamt =
                            (parseFloat(item.PreviousInsurancePaymentAmount) || 0) +
                            (parseFloat(item.PreviousInsuranceAdjustmentAmount) || 0) +
                            (parseFloat(item.CurrentAdjustmentAmount) || 0) +
                            (parseFloat(item.CurrentInsurancePaymentAmount) || 0) +
                            (parseFloat(item.CurrentPatientResponsibilityAmount) || 0);

                        if (TotalChargeAmount == Paymentamt) {
                            IsReversal = false;
                        }
                    }

                    console.log(prevAdjAmt + "__prevAdjAmt");

                    if (item.IsChecked && prevAdjAmt > 0 && IsReversal && item.CurrentAdjustmentAmount > 0) {


                        let Tranobj = {
                            "ClaimTransactionId": 0,
                            "ClaimLineItemId": item.ClaimLineItemId,
                            "PatientInsuranceDetailId": mainitem.PatientInsuranceDetailId,
                            "OrganizationId": $scope.HospitalId,
                            "TransactionDate": $filter('date')($scope.CurreDate, "yyyy-MM-dd"),
                            "TransactionAmount": prevAdjAmt,
                            "PatientAmount": 0,
                            "InsuranceAmount": prevAdjAmt,
                            "EOBId": mainObject.EOBId,
                            "PayorId": mainitem.PrimaryInsuranceId,
                            "AdjustmentReasonId": null,
                            "AdjustmentReasonCode": "",
                            "ReferenceNumber": mainObject.ReferenceNumber,
                            "TransactionTypeId": 104,
                            "TransactionType": "Adjustment Reversal",
                            "TransactionSourceId": TransactionSourceId,
                            "TransactionSource": TransactionSource,
                            "SettlementStatusId": 7,
                            "SettlementStatus": "Cancel Payment",
                            "TransactionNotes": "",
                            "InsuranceIdentifierId": mainitem.InsuranceIdentifierId
                        }

                        ClaimTransaction.push(Tranobj);
                    }



                    let postobj = {
                        "EOBLineItemId": item.EOBLineItemId || null,
                        "ClaimLineItemId": item.ClaimLineItemId,
                        "PatientClaimId": item.PatientClaimId,
                        "ServiceId": item.ServiceId,
                        "PatientBalance": item.CurrentPatientBalance,
                        "InsuranceBalance": item.CurrentInsuranceBalance,
                        "PaymentAmount": item.CurrentInsurancePaymentAmount,
                        "TotalChargeAmount": item.TotalChargeAmount,
                        "AllowedAmount": item.CurrentAllowedAmount,
                        "CoInsuranceAmount": item.CurrentCoInsuranceAmount,
                        "DeductibleAmount": item.CurrentDeductibleAmount,
                        "CoPaymentAmount": item.CurrentCoPaymentAmount,
                        "AdjustmentAmount": item.CurrentAdjustmentAmount,
                        "InsuranceWriteOff": item.CurrentWriteOffAmount,
                        "PatientResponsibility": item.CurrentPatientResponsibilityAmount,
                        "OtherPatientAmount": null,
                        "PatientWriteOffAmount": null,
                        "TotalBalance": item.CurrentTotalBalance,
                        "IsChecked": item.IsChecked,
                        "ServiceAdjustments": item.ServiceAdjustments || [],
                        "DenialCodes": item.DenialCodes || [],
                        "ClaimTransaction": ClaimTransaction || [],
                        "RefundAmount": item.CurrentTotalBalance < 0 ? -(item.CurrentTotalBalance) : 0,
                        "PreviousInsurancePaymentAmount": item.PreviousInsurancePaymentAmount,
                        "PreviousPatientPaymentAmount": item.PreviousPatientPaymentAmount,
                        "PreviousInsuranceAdjustmentAmount": item.PreviousInsuranceAdjustmentAmount,
                        "PreviousInsurancePRAmount": item.PreviousInsurancePRAmount,
                        "PreviousInsuranceWriteOffAmount": item.PreviousInsuranceWriteOffAmount,
                        "PreviousInsuranceAllowedAmount": item.PreviousInsuranceAllowedAmount,
                        "PreviousPatientBalanceAmount": item.PreviousPatientBalanceAmount,
                        "Notes": item.Notes || "",
                        "NoteCode": item.NoteCode || ""
                    };
                    ClaimLineItems.push(postobj);


                });
            }

            switch (mainitem.ERAPaidBy) {
                case 1:
                    mainitem.ClaimStatusId = 16;
                    mainitem.ClaimStatus = "ERA Processed as Primary";
                    mainitem.SettlementStatusId = 3;
                    mainitem.SettlementStatus = "Fully Settled";
                    break;
                case 2:
                    mainitem.ClaimStatusId = 17;
                    mainitem.ClaimStatus = "ERA Processed as Secondary";
                    mainitem.SettlementStatusId = 3;
                    mainitem.SettlementStatus = "Fully Settled";
                    break;
                case 3:
                    mainitem.ClaimStatusId = 18;
                    mainitem.ClaimStatus = "ERA Processed as Tertiary";
                    mainitem.SettlementStatusId = 3;
                    mainitem.SettlementStatus = "Fully Settled";
                    break;
                case 4:
                    mainitem.ClaimStatusId = 19;
                    mainitem.ClaimStatus = "ERA Denied";
                    mainitem.SettlementStatusId = 6;
                    mainitem.SettlementStatus = "Denied";
                    mainitem.DenialStatus = "Pending";
                    mainitem.DenialStatusId = 2;

                    if (Number(mainitem.TotalInsuranceBalance) === 0) {
                        mainitem.DenialStatus = "Closed - Adjusted";
                        mainitem.DenialStatusId = 4;
                    }

                    break;
                case 19:
                    mainitem.ClaimStatusId = 20;
                    mainitem.ClaimStatus = "ERA Processed as Primary and Forwarded";
                    mainitem.SettlementStatusId = 8;
                    mainitem.SettlementStatus = "Forwarded to Another Payor";
                    break;
                case 20:
                    mainitem.ClaimStatusId = 21;
                    mainitem.ClaimStatus = "ERA Processed as Secondary and Forwarded";
                    mainitem.SettlementStatusId = 8;
                    mainitem.SettlementStatus = "Forwarded to Another Payor";
                    break;
                case 21:
                    mainitem.ClaimStatusId = 18;
                    mainitem.ClaimStatus = "ERA Processed as Tertiary";
                    mainitem.SettlementStatusId = 8;
                    mainitem.SettlementStatus = "Forwarded to Another Payor";
                    break;
                case 22:
                    mainitem.ClaimStatusId = 22;
                    mainitem.ClaimStatus = "ERA Reversal of Previous Payment";
                    mainitem.SettlementStatusId = 3;
                    mainitem.SettlementStatus = "Fully Settled";
                    break;
                case 23:
                    mainitem.ClaimStatusId = 23;
                    mainitem.ClaimStatus = "Not Our Claim, Forwarded to Additional Payer(s)";
                    mainitem.SettlementStatusId = 8;
                    mainitem.SettlementStatus = "Forwarded to Another Payor";
                    break;
                case 25:
                    mainitem.ClaimStatusId = 23;
                    mainitem.ClaimStatus = "ERA Predetermination Pricing Only";
                    mainitem.SettlementStatusId = 1;
                    mainitem.SettlementStatus = "Not Settled";
                    break;
                case 27:
                    mainitem.ClaimStatusId = 20;
                    mainitem.ClaimStatus = "ERA Processed as Primary and Forwarded";
                    mainitem.SettlementStatusId = 1;
                    mainitem.SettlementStatus = "Not Settled";
                    break;
                case 29:
                    mainitem.ClaimStatusId = 16;
                    mainitem.ClaimStatus = "ERA Processed as Primary,No Payment";
                    mainitem.SettlementStatusId = 1;
                    mainitem.SettlementStatus = "Not Settled";
                    break;
                default:
                    mainitem.ClaimStatusId = null;
                    mainitem.ClaimStatus = "Unknown";
                    mainitem.SettlementStatusId = 1;
                    mainitem.SettlementStatus = "Not Settled";
                    break;
            }
            if (mainitem.ERAPaidBy == 19 && mainitem.IsSecondaryInsuranceAvailable) {
                IsSecondaryClaim = true;
                $scope.PatientClaimTransmissionObj.Type = 'AutoTransmsitclaim';
                $scope.PatientClaimTransmissionObj.PatientClaimId = mainitem.PatientClaimId;
                $scope.PatientClaimTransmissionObj.AppointmentId = mainitem.AppointmentId;
                $scope.PatientClaimTransmissionObj.PatientId = mainitem.PatientId;
                $scope.PatientClaimTransmissionObj.ClaimStatusId = 20;
                $scope.PatientClaimTransmissionObj.ClaimStatus = "ERA Processed as Primary and Forwarded";
            }

           if (denialCount > 0 && mainitem.ERAPaidBy !== 22) {
                mainitem.ERAPaidBy = 4;
                mainitem.ClaimStatusId = 19;
                mainitem.ClaimStatus = "ERA Denied";
                mainitem.SettlementStatusId = 6;
                mainitem.SettlementStatus = "Denied";

                mainitem.DenialStatus = "Pending";
                mainitem.DenialStatusId = 2;

                if (Number(mainitem.TotalInsuranceBalance) === 0) {
                    mainitem.DenialStatus = "Closed - Adjusted";
                    mainitem.DenialStatusId = 4;
                }
            }

            $scope.InsurancedetailstId = "";
            if (mainitem.SecondaryInsuranceId != null) {
                $scope.InsurancedetailstId = mainitem.SecondaryInsuranceId || null;
            }
            else {
                $scope.InsurancedetailstId = $scope.PatientClaimTransmissionObj.PatientInsuranceDetailId || null;
            }

            $scope.ClaimAdjustmentRequestObj = {};
            if (mainitem.ERAPaidBy == 4 && mainitem.EraId == 0) {
                $scope.ClaimAdjustmentRequestObj.ClaimsAdjustmentRequestTrackId = 0;
                $scope.ClaimAdjustmentRequestObj.OrganizationId = $scope.HospitalId;
                $scope.ClaimAdjustmentRequestObj.PatientClaimId = mainObject.PatientClaimId;
                $scope.ClaimAdjustmentRequestObj.DenialERAId = mainitem.EraId || 0;
                $scope.ClaimAdjustmentRequestObj.TransactionNumber = mainObject.ReferenceNumber || '';
                $scope.ClaimAdjustmentRequestObj.DenialCheckDate = mainObject.PostingDate || '';
                $scope.ClaimAdjustmentRequestObj.AdjustmentRequestStatus = "Pending" || '';
                $scope.ClaimAdjustmentRequestObj.CreatedBy = $scope.UserId || 1;
                $scope.ClaimAdjustmentRequestObj.ModifiedBy = $scope.UserId || 1;
                $scope.ClaimAdjustmentRequestObj.DeleteInd = 0;
            }

            //if (ClaimLineItems.length>0) {
            //    alertify.error("Claim Line Items is empty ");
            //    return false;
            //}

            let obj = {
                "UserId": $scope.UserId,
                "OrganizationId": $scope.HospitalId,
                "EOBId": mainitem.EOBId,
                "ERAId": mainitem.EraId,
                "IsChargeEditedInd": $scope.IsChargeEditedInd,
                "PayerClaimControlNumber": mainitem.PayerClaimControlNumber || '',
                "EOBClaimInfoId": mainitem.EOBClaimInfoId || null,
                "DeleteInd": mainitem.DeleteInd || 'N',
                "PatientClaimId": mainObject.PatientClaimId,
                "IsCapitationInd": mainObject.IsCapitationInd || false,
                "ERAPaidBy": mainitem.ERAPaidBy || "",
                "PostingDate": $filter('date')(mainitem.PostingDate, "yyyy-MM-dd"),
                "PostingType": mainitem.BillPaymentType || "Insurance",
                "PostingTypeId": mainitem.BillPaymentTypeId,
                "PatientInsuranceDetailId": mainitem.PatientInsuranceDetailId,
                "InsuranceIdentifierId": mainitem.InsuranceIdentifierId,
                "TotalClaimAmount": mainitem.TotalClaimAmount,
                "TotalAllowedAmount": mainitem.TotalAllowedAmount,
                "TotalInsurancePayment": mainitem.TotalInsurancePayment,
                "TotalAdjustmentAmount": mainitem.TotalAdjustmentAmount,
                "TotalCopayAmount": mainitem.TotalCopayAmount,
                "TotalCoInsuranceAmount": mainitem.TotalCoInsuranceAmount,
                "TotalDeductibleAmount": mainitem.TotalDeductibleAmount,
                "TotalPaymentAmount": mainitem.TotalPaymentAmount,
                "TotalPatientPayment": mainitem.TotalPatientPayment,
                "TotalWriteOffAmount": mainitem.TotalWriteOffAmount,
                "TotalInsuranceBalance": mainitem.TotalInsuranceBalance,
                "TotalPatientBalance": mainitem.TotalPatientBalance,
                "TotalBalance": mainitem.TotalBalance,
                "ClaimStatusId": mainitem.ClaimStatusId,
                "ClaimStatus": mainitem.ClaimStatus,
                "SettlementStatusId": mainitem.SettlementStatusId || 3,
                "SettlementStatus": mainitem.SettlementStatus || "Fully Settled",
                "TransactionTypeId": TransactionTypeId || 32,
                "TransactionType": TransactionType || "PrimaryInsPayment",
                "ClaimLineItems": ClaimLineItems || [],
                "IsSecondaryClaim": IsSecondaryClaim || false,
                "SecondaryPatientInsuranceDetailId": $scope.InsurancedetailstId,
                "TotalRefundAmount": mainitem.TotalBalance < 0 ? -(mainitem.TotalBalance) : 0,
                "ClaimAdjustmentRequestObj": $scope.ClaimAdjustmentRequestObj,
                "ProcessingTypeId": mainEOBPaymentPostingObj.ProcessingTypeId,
                "PaymentTransactionTypeId": 2,
                "PaymentTransactionType": "Debit",
                "DenialStatus": mainitem.DenialStatus || null,
                "DenialStatusId": mainitem.DenialStatusId || null,


            }

            console.log(JSON.stringify(mainitem));

            eHnoteInsuranceService.AddUpdateEOBPaymentPosting(obj).then(function (resp) {

                if (resp.data.Status === "Success") {


                    console.log(IsSecondaryClaimEdit);


                    if (IsSecondaryClaimEdit) {

                        var objitem = {
                            "PatientId": mainitem.PatientId || null,
                            "AppointmentId": mainitem.AppointmentId || null,
                            "AppointmentTypeId": mainitem.AppointmentTypeId || null,
                            "PatientFullName": mainitem.PatientFullName || "",
                            "VisitId": mainitem.VisitId || 0,
                            "PatientClaimId": mainitem.PatientClaimId,
                        };

                        $scope.navtoClaimSummaryPopup(objitem);
                    } else {
                        if (type == 'Allocate') {
                        }
                        else {
                            if ($scope.PatientClaimTransmissionObj != undefined) {
                                if ($scope.PatientClaimTransmissionObj.Type == 'Transmsitclaim' || $scope.PatientClaimTransmissionObj.Type == 'AutoTransmsitclaim' || $scope.PatientClaimTransmissionObj.Type == 'Queue') {

                                    var PayorId = null;
                                    var PatientInsuranceDetailId = null;
                                    var AppointmentInsuranceDetailId = null;
                                    var OrganizationPayorId = null;
                                    if ($scope.AppointmentInsuranceDetails.length == 2) {
                                        var filtredpayorobj1 = $filter("filter")($scope.AppointmentInsuranceDetails, { "IdentifierId": 2 }) || [];
                                        if (filtredpayorobj1.length > 0) {
                                            PayorId = filtredpayorobj1[0].PayorId;
                                            PatientInsuranceDetailId = filtredpayorobj1[0].PatientInsuranceDetailId;
                                            AppointmentInsuranceDetailId = filtredpayorobj1[0].AppointmentInsuranceDetailId;
                                            OrganizationPayorId = filtredpayorobj1[0].OrganizationPayorId;
                                            $scope.PatientClaimTransmissionObj.TransmitQueuePatientInsuranceId = $scope.PatientClaimTransmissionObj.TransmitQueuePatientInsuranceId || null;
                                            if ($scope.PatientClaimTransmissionObj.TransmitQueuePatientInsuranceId==null) {
                                                $scope.PatientClaimTransmissionObj.TransmitQueuePatientInsuranceId = PatientInsuranceDetailId
                                            }
                                        }
                                    }

                                    let ClaimList = [];
                                    let obj1 = {
                                        "PatientClaimId": $scope.PatientClaimTransmissionObj.PatientClaimId,
                                        "PatientId": $scope.PatientClaimTransmissionObj.PatientId,
                                        "AppointmentId": $scope.PatientClaimTransmissionObj.AppointmentId
                                    }
                                    ClaimList.push(obj1)
                                    let obj = {
                                        "UserId": $scope.UserId,
                                        "OrganizationId": $scope.HospitalId,
                                        "PatientClaimId": $scope.PatientClaimTransmissionObj.PatientClaimId,
                                        "ClaimStatusId": $scope.PatientClaimTransmissionObj.ClaimStatusId,
                                        "ClaimStatus": $scope.PatientClaimTransmissionObj.ClaimStatus,
                                        "TransmissionTypeId": $scope.PatientClaimTransmissionObj.TransmissionTypeId,
                                        "TransmissionType": $scope.PatientClaimTransmissionObj.TransmissionType,
                                        "TransmissionMethodId": $scope.PatientClaimTransmissionObj.TransmissionMethodId,
                                        "TransmissionMethod": $scope.PatientClaimTransmissionObj.TransmissionMethod,
                                        "TransmitQueuePatientInsuranceId": $scope.PatientClaimTransmissionObj.TransmitQueuePatientInsuranceId,
                                        "ClaimList": ClaimList || [],
                                        "ClaimTransmissionId": 0,
                                        "PatientInsuranceDetailId": $scope.InsurancedetailstId,
                                        "AppointmentInsuranceDetailId": AppointmentInsuranceDetailId,
                                        "PayorId": PayorId,
                                        "OrganizationPayorId": OrganizationPayorId,
                                        "TotalBalance": mainitem.TotalInsuranceBalance,
                                    }

                                    eHnoteInsuranceService.UpdatePatientSecondaryClaimDetails(obj).then(function (resp) {

                                    }, function (err) {

                                    });

                                    switch ($scope.PatientClaimTransmissionObj.Type) {
                                        case 'Transmsitclaim':
                                            alertify.success("Claim Transmitted Successfully");
                                            break;
                                        case 'AutoTransmsitclaim':
                                            alertify.success("Claim Auto-Transmitted Successfully");
                                            break;
                                        case 'Queue':
                                            alertify.success("Claim Sent to Queue Successfully");
                                            break;
                                        default:
                                            alertify.success("Secondary Claim Created Successfully");
                                    }

                                }

                                if (test != 'OpenDeposit') {
                                    $scope.Subtab = 2;
                                } else {

                                }

                            }

                            if (test == 'OpenDeposit') {
                                $scope.navtoOpenAddDepositAmount('Payment', 'EditClaim', 2, mainitem);
                            } else if (popup == 'DenailPopupOpen') {
                                $scope.navtoDenailReviewandAppealPopUP(mainitem, 'Denial');
                            }
                            else {
                                if ($scope.IsShowPostPaymentBtnInd) {
                                    $uibModalInstance.close({ status: "Success", data: resp });
                                } else {
                                    $uibModalInstance.close("Success");
                                }
                            }


                        }
                    }



                } else {
                    alertify.error(resp.data.Message);
                }
            });
        }



        $scope.IsShowPaidbyERA = false;
        $scope.EditEOBClaim = function (data) {
            let EobAppliedAmount = 0;
            mainObject.CheckUnAppliedAmount = mainObject.TotalUnAppliedAmount || 0;
            if (data.PatientClaimLineItems.length > 0) {
                angular.forEach(data.PatientClaimLineItems, function (item) {
                    let paymentamount = parseFloat(item.CurrentInsurancePaymentAmount) || 0;
                    EobAppliedAmount += paymentamount;
                });
            }
            mainObject.CheckUnAppliedAmount = mainObject.TotalUnAppliedAmount + EobAppliedAmount || 0;
            // CheckUnAppliedAmount

            data.EraId = data.EraId || 0;
            if (data.EraId != 0) {
                $scope.IsShowPaidbyERA = false;
                data.IsPaidbyEdit = true;
            } else {
                $scope.IsShowPaidbyERA = true;
                data.IsPaidbyEdit = false;
            }

        };

        $scope.orgftpDetails = {
            "MasterClearingHouseId": 0,
            "ClearingHouseTypeId": 0,
            "OrganizationClearingHouseId": 0,
            "ClearingHouseDetails": {},
            "FTPAddress": "",
            "FTPUserName": "",
            "FTPPassword": "",
            "FTPFolder": "",
            "FTPPort": "",
            "FTPFolder": ""
        };



        $scope.changeDepositAmount = function () {
            const newDepositAmount = parseFloat($scope.PatientPostingObj.DepositAmount) || 0;
            $scope.PatientPostingObj.UnBilledAmount = newDepositAmount;

            if ($scope.previousDepositAmount !== newDepositAmount) {
                angular.forEach($scope.PatientClaimList, function (item) {
                    angular.forEach(item.ClaimPatientResponsibility, function (Aitem) {
                        Aitem.PatientPaymentAmount = 0;
                        Aitem.WriteOffAmount = 0;
                        Aitem.AdjustmentReasonCodeId = null;
                    });
                });

                $scope.TotalPatientPaymentBalance = 0;
                $scope.TotalAdjustmentBalanceAmount = 0;
            }

            $scope.previousDepositAmount = newDepositAmount;
        };

        $scope.changePaymentAmount = function (item) {

            var PaymentAmount = parseFloat(item.PatientPaymentAmount) || 0;
            var PatientBalance = parseFloat(item.PatientBalance) || 0;
            var WriteOffAmount = parseFloat(item.WriteOffAmount) || 0;
            var UnBilledAmount = parseFloat($scope.PatientTotalUnallocated) || 0;
            var AdjustmentAmount = PatientBalance - PaymentAmount;

            if (PaymentAmount > UnBilledAmount) {
                item.PatientPaymentAmount = 0;
                alertify.error("The Payment Amount is exceeding the Deposite amount");
                return false;
            }

            if (PaymentAmount > PatientBalance) {
                item.PatientPaymentAmount = 0;
                alertify.error("Payment amount cannot be higher than allowed amount");
                return false;
            }

            if (WriteOffAmount > AdjustmentAmount) {
                item.WriteOffAmount = 0;
                alertify.error("The adjustment amount cannot exceed. Please review the values and try again.");
                return false;
            }


            $scope.calculateLineItemPatientTotals();
        }

        $scope.ClearPatientPayment = function () {
            $scope.TotalPatientPaymentBalance = 0;
            $scope.TotalAdjustmentBalanceAmount = 0;
            angular.forEach($scope.PatientClaimList, function (item) {
                angular.forEach(item.ClaimPatientResponsibility, function (Aitem) {
                    Aitem.PatientPaymentTypeId = 0;
                    Aitem.PatientPaymentAmount = 0;
                    Aitem.WriteOffAmount = 0;
                    Aitem.AdjustmentReasonCodeId = null;
                });
            })

        }


        $scope.GetNewClaimTransmissionObj = function () {
            let obj = {
                "PatientInsuranceDetailId": null,
                "SecondaryInsuranceDateOfSubmission": null,
                "TransmissionTypeId": null,
                "TransmissionMethodId": null,
                "PatientId": mainObject.PatientId,
                "AppointmentId": mainObject.AppointmentId,
                "PatientClaimId": mainObject.PatientClaimId || null,
                "ClaimStatusId": mainObject.ClaimStatusId || null,
                "ClaimStatus": mainObject.ClaimStatus || null,
                "TransmitQueuePatientInsuranceId": mainObject.TransmitQueuePatientInsuranceId || null,
                "Type": "",
                "Selecteditem": "",
            }
            return obj;
        }

        $scope.EOBSecondaryClaimPosting = function (type, mainitem) {

            if (!mainitem.PayerClaimControlNumber) {
                alertify.error("Please Enter ICN Number");
                return false;
            }

            let filtredobj2 = $filter("filter")(mainitem.PatientClaimLineItems, { "IsChecked": true }) || [];
            if (filtredobj2.length == 0) {
                alertify.error("Please select any service");
                return false;
            }

            let checkUnAppliedAmount = Math.round(parseFloat(mainObject.CheckUnAppliedAmount) * 100) / 100;
            let totalInsurancePayment = Math.round(parseFloat(mainitem.TotalInsurancePayment) * 100) / 100;

            if (checkUnAppliedAmount < totalInsurancePayment) {
                alertify.error("The payment entered exceeds the check balance amount");
                return false;
            }

            $scope.PatientClaimTransmissionObj = $scope.GetNewClaimTransmissionObj();
            $scope.PatientClaimTransmissionObj.Selecteditem = mainitem;

            let mInstanceAdd = $uibModal.open({
                "templateUrl": "EOBSecondaryClaimpopup.html",
                "backdrop": "static",
                "keyboard": false,
                "size": "lg",
                "scope": $scope,
                "windowClass": " ",
                "controller": function ($scope, $uibModalInstance,) {

                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };


                    $scope.SaveSecondaryclaim = function (type) {
                        $scope.PatientClaimTransmissionObj.Type = type;

                        if ($scope.PatientClaimTransmissionObj.PatientInsuranceDetailId == null) {
                            alertify.error("Please select Payor");
                            return false;
                        }
                        if ($scope.PatientClaimTransmissionObj.TransmissionTypeId == null) {
                            alertify.error("Please select Format");
                            return false;
                        }
                        if ($scope.PatientClaimTransmissionObj.TransmissionMethodId == null) {
                            alertify.error("Please select Claim Type");
                            return false;
                        }

                        $uibModalInstance.close($scope.PatientClaimTransmissionObj);
                    }
                }

            });
            mInstanceAdd.result.then(function (resp) {



                if (resp.Type == 'Secondary') {
                    resp.Selecteditem.ClaimStatus = "Not Submitted";
                    resp.Selecteditem.ClaimStatusId = 1;
                    $scope.PatientClaimTransmissionObj.ClaimStatus = "Not Submitted";
                    $scope.PatientClaimTransmissionObj.ClaimStatusId = 1;
                    $scope.EOBClaimPaymentPosting(resp.Type, resp.Selecteditem, '');
                }

                if (resp.Type == 'Queue') {
                    $scope.PatientClaimTransmissionObj.ClaimStatusId = 2;
                    $scope.PatientClaimTransmissionObj.ClaimStatus = "Transmit to Queue";
                    resp.Selecteditem.ClaimStatusId = 2;
                    resp.Selecteditem.ClaimStatus = "Transmit to Queue";
                    $scope.EOBClaimPaymentPosting('Secondary', resp.Selecteditem, '');
                }
                if (resp.Type == 'Transmsitclaim') {
                    resp.Selecteditem.ClaimStatus = "Transmitted to Clearing House";
                    resp.Selecteditem.ClaimStatusId = 3;
                    $scope.PatientClaimTransmissionObj.ClaimStatus = "Transmitted to Clearing House";
                    $scope.PatientClaimTransmissionObj.ClaimStatusId = 3;
                    $scope.EOBClaimPaymentPosting('Secondary', resp.Selecteditem, '');
                }
                if (resp.Type == 'AutoTransmsitclaim') {
                    resp.Selecteditem.ClaimStatus = "Transmitted to Clearing House";
                    resp.Selecteditem.ClaimStatusId = 3;
                    $scope.PatientClaimTransmissionObj.ClaimStatus = "Transmitted to Clearing House";
                    $scope.PatientClaimTransmissionObj.ClaimStatusId = 3;
                    $scope.EOBClaimPaymentPosting('Secondary', resp.Selecteditem, '');
                }

            }, function () { });

        }

        $scope.changeTransmissionTypes = function (Id) {
            var filtredArray = $filter("filter")($scope.TransmissionTypes, { "TransmissionMethodId": Id }, true) || [];

            if (filtredArray.length > 0) {
                $scope.PatientClaimTransmissionObj.TransmissionType = filtredArray[0].TransmissionMethodCode;

            }
        }

        $scope.changeBillingTransmissionMethod = function (Id) {
            var filtredArray = $filter("filter")($scope.masterBillingFrequencyTypes, { "TransmissionTypeId": Id }, true);
            $scope.PatientClaimTransmissionObj.TransmissionMethodId = filtredArray[0].TransmissionTypeId;
            $scope.PatientClaimTransmissionObj.TransmissionMethod = filtredArray[0].TransmissionTypeName;
        }

        $scope.changeInsurancePayorClaim = function (mainObject) {


            var patientInsuranceId = parseInt(mainObject.PatientInsuranceDetailId);
            $scope.PatientClaimTransmissionObj.PatientInsuranceDetailId = patientInsuranceId;
            $scope.PatientClaimTransmissionObj.TransmitQueuePatientInsuranceId = patientInsuranceId;

            if ($scope.PatientClaimTransmissionObj.PatientInsuranceDetailId == $scope.EOBClaimSummaryDetails[0].PatientInsuranceDetailId) {
                alertify.error("This is selected insurance posting has been Done");
                $scope.PatientClaimTransmissionObj.PatientInsuranceDetailId = null;
                return false;
            }

            var filtredArray = $filter("filter")($scope.AppointmentInsuranceDetails, { "PatientInsuranceDetailId": patientInsuranceId }, true);
            if (filtredArray.length > 0) {

                $scope.PatientClaimTransmissionObj.SecondaryInsuranceDateOfSubmission = $filter('date')($scope.CurreDate, "yyyy-MM-dd");
                $scope.PatientClaimTransmissionObj.InsuranceLevelId = 2;
                $scope.PatientClaimTransmissionObj.InsuranceLevel = "S";

                if (filtredArray[0].IdentifierId == 1) {
                    $scope.PatientClaimTransmissionObj.CurrentResponsibilityId = 2;
                    $scope.PatientClaimTransmissionObj.CurrentResponsibility = "Primary Insurance";
                } else {
                    $scope.PatientClaimTransmissionObj.CurrentResponsibilityId = 3;
                    $scope.PatientClaimTransmissionObj.CurrentResponsibility = "Secondary Insurance";
                }
            }






        };
        $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
        $scope.doctorinfo = eHnoteMasterDataService.getUserInfo();
        var NewBranchList = localStorageFactory.getItem("allBranchesData") || [];
        InitializeBranches(NewBranchList);

        function InitializeBranches(data) {
            var clinicAddress = eHnoteUserAppointmentDataService.RestructureNewBranches($scope.UserAccessRights.AllAccessRights.APPListAllBranchesAppointments, data, $scope.doctorinfo) || [];
            $scope.BranchesListArray = clinicAddress;
        }

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
                "AppointmentTypeId": mainObject.AppointmentTypeId || null,
                "PatientFullName": item.PatientFullName || "",
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
                "AllUsersList": AllHospitalData?.AllUsersList || []
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

                $uibModalInstance.close("Success");

            }, function () { });
        }


        $scope.ClearEOBPaymentDetails = function (item) {
            angular.forEach(item.PatientClaimLineItems, function (aitem) {
                aitem.CurrentAdjustmentAmount = null;
                aitem.CurrentAllowedAmount = null;
                // aitem.AllowedAmount = null;
                aitem.CurrentInsurancePaymentAmount = null;
                aitem.PaymentAmount = null;
                aitem.CurrentDeductibleAmount = null;
                // aitem.DeductibleAmount = null;
                aitem.CurrentCoInsuranceAmount = null;
                aitem.CurrentCoPaymentAmount = null;
                aitem.CurrentPatientResponsibilityAmount = null;
                aitem.CurrentWriteOffAmount = null;
                aitem.PatientResponsibilityAmount = null;
                aitem.WriteOffAmount = null;
                aitem.CurrentTotalBalance = 0;
                aitem.CurrentInsuranceBalance = 0;
                aitem.CurrentPatientBalance = 0;
                aitem.PreviousPaidAmount = null;
                aitem.CurrentServiceAdjustmentAmount = null;
                if (aitem.ServiceAdjustments.length > 0) {
                    //aitem.ServiceAdjustments.forEach(adj => {
                    //    adj.AdjustmentAmount = 0;
                    //});

                    aitem.ServiceAdjustments = aitem.ServiceAdjustments.filter(function (sitem) {
                        if (sitem.AdjustmentId != 0) {
                            sitem.DeleteInd = "Y";
                            sitem.ActiveInd = "N";
                            sitem.ClaimLineItemId = aitem.ClaimLineItemId;
                            return true;
                        } else {
                            return false;
                        }
                    });
                    var filterAdjustment = $filter("filter")(aitem.ServiceAdjustments, { "DeleteInd": "N" }, true) || [];
                    if (filterAdjustment.length == 0) {
                        var obj = {
                            "AdjustmentId": 0,
                            "EOBLineItemId": aitem.EOBLineItemId || 0,
                            "ClaimLineItemId": aitem.ClaimLineItemId,
                            "AdjustmentReasonCode": "",
                            "AdjustmentReasonId": "",
                            "GroupCode": '',
                            "AdjsutmentDescription": '',
                            "PayorPostingStatusId": 2,
                            "PayorPostingStatus": 'Transfer',
                            "AdjustmentAmount": null,
                            "Notes": "",
                            "DeleteInd": "N",
                            "ActiveInd": "Y",
                        }
                        aitem.ServiceAdjustments.push(obj);
                    }
                }

                //let obj = {
                //    "AdjustmentId": 0,
                //    "EOBLineItemId": 0,
                //    "ClaimLineItemId": "",
                //    "AdjustmentReasonCode": '0',
                //    "AdjsutmentDescription": '',
                //    "AdjustmentReasonId": null,
                //    "AdjustmentAmount": null,
                //    "PayorPostingStatusId": 2,
                //    "PayorPostingStatus": 'Transfer',
                //    "Notes": "",
                //    "DeleteInd": "N"
                //}
                //aitem.ServiceAdjustments.push(obj);

                if (aitem.EOBLineItemId != 0) {
                    aitem.IsAllowedAmount = true;
                    aitem.IsInsurancePaymentAmount = true;
                    aitem.IsDeductibleAmount = true;
                    aitem.IsCoInsuranceAmount = true;
                    aitem.IsCoPaymentAmount = true;
                    aitem.IsPatientResponsibilityAmount = true;
                    aitem.IsWriteOffAmount = true;
                }
            });

            item.TotalAllowedAmount = 0;
            item.TotalInsurancePayment = 0;
            item.TotalAdjustmentAmount = 0;
            item.TotalDeductibleAmount = 0;
            item.TotalCoInsuranceAmount = 0;
            item.TotalCopayAmount = 0;
            item.TotalPatientPayment = 0;
            item.TotalWriteOffAmount = 0;
            item.TotalPreviousPaidAmount = 0;
            item.TotalBalance = 0;
            item.TotalInsuranceBalance = 0;
            item.TotalPaidAmount = 0;
            item.TotalPatientResponsibilityAmount = 0;
            item.TotalClaimAdjustmentAmount = 0;
            item.TotalPatientBalance = 0;
            item.AllServiceAdjustmentsList = [];
            $scope.mainClaimObject.FinalInsurancePayment = 0;
            $scope.mainClaimObject.FinalAdjustmentAmount = 0;
            $scope.mainClaimObject.FinalPatientResponsibility = 0;
            $scope.mainClaimObject.FinalPatientBalance = 0;
            $scope.mainClaimObject.TotalInsuranceBalance = 0;
            $scope.mainClaimObject.FinalTotalBalance = 0;
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
                "PayorStateCode": "",
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
                "OrganizationStateCode": "",
                "OrganizationZipCode": "",
                "OrganizationNPI": "",
                "ClaimPaymentInfo": [],
                "ClaimAdjustments": [],
                "ClaimLegends": [],
                "ClaimLineItemsList": [],
                "PrintedDatenTime": "",
                "ParsedDate": "",
                "TotalPatientResponsibilityAmount": 0,
                "ClaimAdjustmentAmount": 0,
                "TotalOtherAdjustmentAmount": 0,
                "AllTotalAdjAmount": 0,
                "AllTotalPatientRespAmt": 0,

                "PatientClaimNumber": "",
                "PatientFullName": "",
                "StatusId": "",
                "TotalClaimAmount": 0,
                "TotalAdjustmentAmount": 0,
                "TotalPatientBalance": 0,
                "TotalAdjandPatientRespAmt": 0,
                "PatientAccountNumner": "",
                "ControlNumber": "",
                "RenderingProviderName": "",
                "RenderingProviderNPI": "",
                "ProviderAdjustments": [],
                "LegendCodeList": [],
                "TotalWUAdjAmt": 0,
                "ParseDate": "",
                "GlobalPayorId": 0,
                "AllTotalOtherAdjAmt": 0,


            };
            return obj;
        };

        $scope.EOBPrintMainObj = getnewEOBPrintClaimObj();





        $scope.navtoPrintClaimsPosting = function (item) {

            //var param = {
            //    "EraId": item.EraId || null
            //}
            item.EraId = item.EraId || null;
            eHnoteInsuranceService.GetPrasedERADetailsById(item.EraId).then(function (resp) {

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
                        var innerContents = document.getElementById('PostingClaimprint').innerHTML;
                        var popupWinindow = window.open('scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                        popupWinindow.document.open();
                        popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()" class="bodyheightprint">' + innerContents + '</body></html>');
                        popupWinindow.document.close();
                    }, 500);



                }
            });






        }





        $scope.totalAdjustedAmountPopover = {
            templateUrl: 'totalAdjustedAmountPopover.html',
        };

        $scope.openTotalAdjustmentPopover = function (item, data) {
            angular.forEach(data.PatientClaimLineItems, function (Aitem) {
                Aitem.popoverOpen = false;
            });
            item.popoverOpen = true;

            angular.forEach(item.ServiceAdjustments, function (sitem) {
                if (["1", "2", "3"].includes(sitem.AdjustmentReasonCode) && sitem.PostingStatusId == 2) {
                    switch (sitem.AdjustmentReasonCode) {
                        case "1":
                            sitem.AdjustmentAmount = item.CurrentDeductibleAmount;
                            break;
                        case "2":
                            sitem.AdjustmentAmount = item.CurrentCoInsuranceAmount;
                            break;
                        case "3":
                            sitem.AdjustmentAmount = item.CurrentCoPaymentAmount;
                            break;
                    }
                }
            });
        };

        $scope.PopoverClose = function (item) {
            item.popoverOpen = false;
        };



        $scope.SaveTotalAdjustmentAmt = function (ServiceAdjustments, claimitem, mainitem) {
            var CurrentAdjustmentAmt = 0;

            //claimitem.CurrentDeductibleAmount = null;
            //claimitem.CurrentCoInsuranceAmount = null;
            //claimitem.CurrentCoPaymentAmount = null;

            angular.forEach(ServiceAdjustments, function (item) {
                var amount = 0;
                if (item.DeleteInd == "N") {
                    amount = parseFloat(item.AdjustmentAmount) || 0;
                    CurrentAdjustmentAmt += amount;
                }

                //if ((item.AdjustmentReasonCode == "1" || item.AdjustmentReasonCode == "2" || item.AdjustmentReasonCode == "3") && item.PayorPostingStatusId != 2) {
                //    amount = 0;
                //}

                switch (item.AdjustmentReasonCode) {
                    case "1":
                        claimitem.CurrentDeductibleAmount = amount;
                        break;
                    case "2":
                        claimitem.CurrentCoInsuranceAmount = amount;
                        break;
                    case "3":
                        claimitem.CurrentCoPaymentAmount = amount;
                        break;
                }
            });

            claimitem.CurrentServiceAdjustmentAmount = CurrentAdjustmentAmt.toFixed(2);
            /* sitem.CurrentPatientResponsibilityAmount */
            claimitem.popoverOpen = false;

            $scope.calculateClaimLineItems(claimitem, mainitem);
            //$scope.calculateClaimPaymentTotalAmountsNew();
            ////$scope.calculateClaimLineItemPaymentTotals(mainitem);
            //$scope.GetTotalAdjustmentDetails(mainitem);
        };


        $scope.GetTotalAdjustmentDetails = function (mainitem) {
            mainitem.AllServiceAdjustmentsList = [];
            $scope.AllServiceAdjustmentsDisplayList = [];

            if ($scope.EOBClaimSummaryDetails.length > 0) {
                var adjustmentMap = {};

                angular.forEach($scope.EOBClaimSummaryDetails, function (pitem) {
                    if (pitem.IdentifierId === mainitem.IdentifierId) {
                        angular.forEach(pitem.PatientClaimLineItems, function (sitem) {
                            if (sitem.ServiceAdjustments && sitem.ServiceAdjustments.length) {
                                angular.forEach(sitem.ServiceAdjustments, function (aitem) {
                                    aitem.AdjsutmentDescription = aitem.AdjsutmentDescription || "";

                                    if (aitem.AdjsutmentDescription !== "" && aitem.DeleteInd === "N") {
                                        var desc = aitem.AdjsutmentDescription;

                                        if (!adjustmentMap[desc]) {
                                            adjustmentMap[desc] = angular.copy(aitem);
                                        } else {
                                            adjustmentMap[desc].AdjustmentAmount += aitem.AdjustmentAmount;
                                        }
                                    }
                                });
                            }
                        });
                    }
                });

                angular.forEach(adjustmentMap, function (combinedItem) {
                    mainitem.AllServiceAdjustmentsList.push(combinedItem);
                });
            }
        };

        $scope.formatAdjustmentAmount = function (sub) {
            if (!sub || sub.AdjustmentAmount == null) return;

            let val = sub.AdjustmentAmount.toString().replace(/[^0-9.+-]/g, '');

            if (val.includes('+') || val.includes('-')) {
                const signMatch = val.match(/^[-+]/);
                const sign = signMatch ? signMatch[0] : '';
                val = sign + val.replace(/[-+]/g, '');
            }

            if (val.startsWith('0') && !val.startsWith('0.') && val.length > 1) {
                val = val.replace(/^0+/, '');
            }

            //  if (val.startsWith('.')) val = '';
            if (val.startsWith('.')) {
                val = '0' + val;
            } else if (val.startsWith('-.')) {
                val = '-0' + val.substring(1);
            }
            const parts = val.split('.');
            if (parts.length > 2) {
                val = parts[0] + '.' + parts[1];
            }

            //if ($scope.isIojOrgEnable) {
            //    if (sub.GroupCode == 'CO' && sub.AdjustmentReasonCode == '45') {
            //       let Abjamt= parseFloat(val) || 0;
            //        if (Abjamt >= 5) {
            //            sub.PayorPostingStatusId = 3;
            //            sub.PayorPostingStatus = 'Denials';
            //        } else {
            //            sub.PayorPostingStatusId = 1;
            //            sub.PayorPostingStatus = "Adjustment";
            //        }
            //    }
            //}
            if ($scope.isIojOrgEnable) {
                var excludedCodes = ["151", "16", "B11", "11", "206", "97", "B13", "B22", "B7", "49"];

                if (sub.GroupCode == 'CO' && excludedCodes.indexOf(sub.AdjustmentReasonCode) === -1) {
                    var adjAmount = parseFloat(val) || 0;
                    if (adjAmount >= 5) {
                        sub.PayorPostingStatusId = 3;
                        sub.PayorPostingStatus = 'Denials';
                    } else {
                        sub.PayorPostingStatusId = 1;
                        sub.PayorPostingStatus = "Adjustment";
                    }
                }
            }
            
            sub.AdjustmentAmount = val;
        };

        $scope.navtoOpenAddDepositAmount = function (type, Incomingfrom, Allocate, item) {

            $scope.Patientobj.MobileNo = $scope.Patientobj.PatientMobile;

            $scope.obj = {
                "PatientId": mainObject.PatientId,
                "ScreenType": type || '',
                "Incomingfrom": Incomingfrom || '',
                "Type": '',
                "UsersList": AllHospitalData.AllUsersList,
                "Patientobj": $scope.Patientobj,
                /* "ClaimDetailsList": $scope.ClaimDetailsList,*/
                "OrganizationFacilityList": $scope.OrganizationFacilityList,
                "DepositTypes": $scope.DepositTypes,
                "WriteOffReasons": $scope.WriteOffReasons,
                "BillingProviderName": $scope.BillingProviderName || "",
                "FacilityName": $scope.FacilityName || "",
                "TotalPatientBalance": item.TotalPatientBalance || 0,
                "AllBranchesList": AllHospitalData.AllBranchesList || [],
                "HospitalId": $scope.HospitalId || 0,
                "Allocate": Allocate || 0,
                "item": item || '',
                "CardTypesData": $scope.CardTypesData || [],
                "PatientClaimId": mainObject.PatientClaimId || null,
            }

            var modalInstance = $uibModal.open({
                "templateUrl": "templates/UsClaims/AddPatientDepositPopup.html",
                "controller": "UsAddPatientDepositsCtrl",
                "resolve": {
                    "Selectobj": function () { return $scope.obj; },
                },
                //"size": "lg",
                "backdrop": "static",
                "keyboard": false,
                "windowClass": "modal__popup--1"
                /*"windowClass": "modal__popup--1"*/

            });
            modalInstance.result.then(function (resp) {
                resp = resp || "";
                if (resp && resp.status === "Success") {
                    $uibModalInstance.close(resp);
                }

            }, function () { });
        }

        $scope.changeSelectedItemAmounts = function (sitem) {
            console.log(sitem.IsChecked)
            let AllowedAmount = parseFloat(sitem.CurrentAllowedAmount) || 0;
            let PaymtAmtAmount = parseFloat(sitem.CurrentInsurancePaymentAmount) || 0;
            $scope.mainClaimObject.IsCheckAllPayments = false;
            let filteredCheckedArray = $filter('filter')($scope.mainClaimObject.PatientClaimLineItems, { 'IsChecked': true });
            if (filteredCheckedArray.length === $scope.mainClaimObject.PatientClaimLineItems.length) {
                $scope.mainClaimObject.IsCheckAllPayments = true;
            }
            if (!sitem.IsChecked && (AllowedAmount != 0 || PaymtAmtAmount != 0)) {
                var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to unselect this item ? Totals will be updated, and only selected items will be submitted.</h4>", function () {
                    $scope.calculateClaimLineItems(sitem, $scope.mainClaimObject);
                }, function () {
                    sitem.IsChecked = true;
                });
            } else {
                $scope.calculateClaimLineItems(sitem, $scope.mainClaimObject);
            }


        }






        $scope.CancelEOBClaim = function (mainitem) {

            var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'><b>Are you sure you want to cancel the payment?</h4></br><h4 class='txt-body-centre'>If you proceed, all applied amounts will be reverted, and any patient payment will be converted back into a deposit.</h4>", function () {
                let ClaimLineItems = [];
                let TransactionSourceId = 1;
                let TransactionSource = "Primary Insurance";
                let TransactionTypeId = 32;
                let TransactionType = "PrimaryInsurancePayment";

                if (mainitem.IdentifierId == 2) {
                    TransactionSourceId = 2;
                    TransactionSource = "Secondary Insurance";
                    TransactionTypeId = 36;
                    TransactionType = "SecondaryInsPayment";
                }

                let SettlementStatusId = 1;
                let SettlementStatus = "Ready to Settle";


                if (mainitem.PatientClaimLineItems.length > 0) {
                    angular.forEach(mainitem.PatientClaimLineItems, function (item) {


                        item.CurrentInsurancePaymentAmount = item.CurrentInsurancePaymentAmount || 0;
                        item.CurrentAdjustmentAmount = item.CurrentAdjustmentAmount || 0;
                        item.CurrentPatientBalance = item.CurrentPatientBalance || 0;
                        item.PatientPaymentAmount = item.PatientPaymentAmount || 0;
                        item.CurrentWriteOffAmount = item.CurrentWriteOffAmount || 0;

                        let ClaimTransaction = [];
                        if (item.CurrentInsurancePaymentAmount != 0) {
                            let InsurancePaymentAmount = parseFloat(item.CurrentInsurancePaymentAmount) || 0;
                            let Tranobj = {
                                "ClaimTransactionId": 0,
                                "PatientInsuranceDetailId": mainitem.PatientInsuranceDetailId,
                                "ClaimLineItemId": item.ClaimLineItemId,
                                "OrganizationId": $scope.HospitalId,
                                "TransactionDate": $filter('date')($scope.CurreDate, "yyyy-MM-dd"),
                                "TransactionAmount": InsurancePaymentAmount,
                                "PatientAmount": 0,
                                "InsuranceAmount": InsurancePaymentAmount,
                                "EOBId": mainObject.EOBId,
                                "PayorId": mainitem.PrimaryInsuranceId,
                                "AdjustmentReasonId": null,
                                "AdjustmentReasonCode": "",
                                "ReferenceNumber": mainObject.ReferenceNumber,
                                "TransactionTypeId": 102,
                                "TransactionType": "Insurance Payment Reversal",
                                "TransactionSourceId": TransactionSourceId,
                                "TransactionSource": TransactionSource,
                                //"SettlementStatusId": SettlementStatusId || 1,
                                //"SettlementStatus": SettlementStatus || "Ready to Settle",
                                "SettlementStatusId": 7,
                                "SettlementStatus": "Cancel Payment",
                                "TransactionNotes": ""
                            }
                            ClaimTransaction.push(Tranobj);
                        }
                        if (item.CurrentAdjustmentAmount != 0) {
                            let AdjustmentAmount = parseFloat(item.CurrentAdjustmentAmount) || 0;
                            let Tranobj = {
                                "ClaimTransactionId": 0,
                                "ClaimLineItemId": item.ClaimLineItemId,
                                "PatientInsuranceDetailId": mainitem.PatientInsuranceDetailId,
                                "OrganizationId": $scope.HospitalId,
                                "TransactionDate": $filter('date')($scope.CurreDate, "yyyy-MM-dd"),
                                "TransactionAmount": AdjustmentAmount,
                                "PatientAmount": 0,
                                //"InsuranceAmount": 0,
                                "InsuranceAmount": AdjustmentAmount,
                                "EOBId": mainObject.EOBId,
                                "PayorId": mainitem.PrimaryInsuranceId,
                                "AdjustmentReasonId": null,
                                "AdjustmentReasonCode": "",
                                "ReferenceNumber": mainObject.ReferenceNumber,
                                "TransactionTypeId": 104,
                                "TransactionType": "Adjustment Reversal",
                                "TransactionSourceId": TransactionSourceId,
                                "TransactionSource": TransactionSource,
                                //"SettlementStatusId": SettlementStatusId || 1,
                                //"SettlementStatus": SettlementStatus || "Ready to Settle",
                                "SettlementStatusId": 7,
                                "SettlementStatus": "Cancel Payment",
                                "TransactionNotes": ""
                            }
                            //if (item.IsPatientBalanceReceived || item.IsPatientPaymentDone) {
                            //    Tranobj.InsuranceAmount = 0;
                            //}
                            ClaimTransaction.push(Tranobj);
                        }
                        if (item.CurrentPatientBalance > 0) {
                            let PatientBalance = parseFloat(item.CurrentPatientBalance) || 0;
                            let Tranobj = {
                                "ClaimTransactionId": 0,
                                "ClaimLineItemId": item.ClaimLineItemId,
                                "PatientInsuranceDetailId": mainitem.PatientInsuranceDetailId,
                                "OrganizationId": $scope.HospitalId,
                                "TransactionDate": $filter('date')($scope.CurreDate, "yyyy-MM-dd"),
                                "TransactionAmount": 0,
                                "PatientAmount": -+PatientBalance,
                                //"InsuranceAmount": 0,
                                "InsuranceAmount": PatientBalance || 0,
                                "EOBId": mainObject.EOBId,
                                "PayorId": mainitem.PrimaryInsuranceId,
                                "AdjustmentReasonId": null,
                                "AdjustmentReasonCode": "",
                                "ReferenceNumber": mainObject.ReferenceNumber,
                                "TransactionTypeId": 105,
                                "TransactionType": "Patient Responsibility Reversal",
                                "TransactionSourceId": TransactionSourceId,
                                "TransactionSource": TransactionSource,
                                //"SettlementStatusId": SettlementStatusId || 1,
                                //"SettlementStatus": SettlementStatus || "Ready to Settle",
                                "SettlementStatusId": 7,
                                "SettlementStatus": "Cancel Payment",
                                "TransactionNotes": ""
                            }

                            ClaimTransaction.push(Tranobj);
                        }
                        if (item.PatientPaymentAmount > 0) {
                            let PatientPaymentAmount = parseFloat(item.PatientPaymentAmount) || 0;
                            let Tranobj = {
                                "ClaimTransactionId": 0,
                                "ClaimLineItemId": item.ClaimLineItemId,
                                "PatientInsuranceDetailId": mainitem.PatientInsuranceDetailId,
                                "OrganizationId": $scope.HospitalId,
                                "TransactionDate": $filter('date')($scope.CurreDate, "yyyy-MM-dd"),
                                "TransactionAmount": PatientPaymentAmount,
                                "PatientAmount": PatientPaymentAmount,
                                "InsuranceAmount": 0,
                                "EOBId": mainObject.EOBId,
                                "PayorId": mainitem.PrimaryInsuranceId,
                                "AdjustmentReasonId": null,
                                "AdjustmentReasonCode": "",
                                "ReferenceNumber": mainObject.ReferenceNumber,
                                "TransactionTypeId": 101,
                                "TransactionType": "Patient Payment Reversal",
                                "TransactionSourceId": TransactionSourceId,
                                "TransactionSource": TransactionSource,
                                "SettlementStatusId": SettlementStatusId || 3,
                                "SettlementStatus": SettlementStatus || "Fully Settled",
                                "TransactionNotes": ""
                            }

                            ClaimTransaction.push(Tranobj);
                        }
                        if (item.CurrentWriteOffAmount != 0) {
                            let WriteOffAmount = parseFloat(item.CurrentWriteOffAmount) || 0;
                            let Tranobj = {
                                "ClaimTransactionId": 0,
                                "ClaimLineItemId": item.ClaimLineItemId,
                                "PatientInsuranceDetailId": mainitem.PatientInsuranceDetailId,
                                "OrganizationId": $scope.HospitalId,
                                "TransactionDate": $filter('date')($scope.CurreDate, "yyyy-MM-dd"),
                                "TransactionAmount": WriteOffAmount,
                                "PatientAmount": 0,
                                "InsuranceAmount": WriteOffAmount,
                                "EOBId": mainObject.EOBId,
                                "PayorId": mainitem.PrimaryInsuranceId,
                                "AdjustmentReasonId": null,
                                "AdjustmentReasonCode": "",
                                "ReferenceNumber": mainObject.ReferenceNumber,
                                "TransactionTypeId": 103,
                                "TransactionType": "WriteOff Reversal",
                                "TransactionSourceId": TransactionSourceId,
                                "TransactionSource": TransactionSource,
                                //"SettlementStatusId": SettlementStatusId || 1,
                                //"SettlementStatus": SettlementStatus || "Ready to Settle",
                                "SettlementStatusId": 7,
                                "SettlementStatus": "Cancel Payment",
                                "TransactionNotes": ""
                            }

                            ClaimTransaction.push(Tranobj);
                        }
                        let postobj = {
                            "EOBLineItemId": item.EOBLineItemId || null,
                            "ClaimLineItemId": item.ClaimLineItemId,
                            "PatientClaimId": item.PatientClaimId,
                            "ServiceId": item.ServiceId,
                            "PatientBalance": item.CurrentPatientBalance,
                            "InsuranceBalance": item.CurrentInsuranceBalance,
                            "PaymentAmount": item.CurrentInsurancePaymentAmount,
                            "AllowedAmount": item.CurrentAllowedAmount,
                            "CoInsuranceAmount": item.CurrentCoInsuranceAmount,
                            "DeductibleAmount": item.CurrentDeductibleAmount,
                            "CoPaymentAmount": item.CurrentCoPaymentAmount,
                            "AdjustmentAmount": item.CurrentAdjustmentAmount,
                            "InsuranceWriteOff": item.CurrentWriteOffAmount,
                            "PatientResponsibility": item.CurrentPatientResponsibilityAmount,
                            "OtherPatientAmount": null,
                            "PatientWriteOffAmount": null,
                            "TotalBalance": item.CurrentTotalBalance,
                            "ServiceAdjustments": item.ServiceAdjustments || [],
                            "DenialCodes": item.DenialCodes || [],
                            "ClaimTransaction": ClaimTransaction || [],
                        };
                        if (postobj.DenialCodes.length > 0) {
                            denialCount++;
                        }
                        ClaimLineItems.push(postobj);


                    });
                }

                $scope.InsurancedetailstId = "";
                if (mainitem.SecondaryInsuranceId != null) {
                    $scope.InsurancedetailstId = mainitem.SecondaryInsuranceId || null;
                }
                else {
                    $scope.InsurancedetailstId = $scope.PatientClaimTransmissionObj.PatientInsuranceDetailId || null;
                }



                let obj = {
                    "UserId": $scope.UserId,
                    "OrganizationId": $scope.HospitalId,
                    "EOBId": mainitem.EOBId,
                    "ERAId": mainitem.EraId,
                    // "EOBClaimInfoId": 0,
                    "PayerClaimControlNumber": mainitem.PayerClaimControlNumber || '',
                    "EOBClaimInfoId": mainitem.EOBClaimInfoId || null,
                    "DeleteInd": mainitem.DeleteInd || 'N',
                    "PatientClaimId": mainObject.PatientClaimId,
                    "PostingDate": $filter('date')(mainitem.PostingDate, "yyyy-MM-dd"),
                    "PostingType": "Insurance Payment Reversal",
                    "PostingTypeId": 10,
                    "PatientInsuranceDetailId": mainitem.PatientInsuranceDetailId,
                    "TotalClaimAmount": mainitem.TotalClaimAmount,
                    "TotalAllowedAmount": mainitem.TotalAllowedAmount,
                    //"TotalInsurancePayment": mainitem.TotalInsurancePayment,
                    "TotalInsurancePayment": 0,
                    // "TotalAdjustmentAmount": mainitem.TotalAdjustmentAmount,
                    "TotalAdjustmentAmount": 0,
                    "TotalCopayAmount": mainitem.TotalCopayAmount,
                    "TotalCoInsuranceAmount": mainitem.TotalCoInsuranceAmount,
                    "TotalDeductibleAmount": mainitem.TotalDeductibleAmount,
                    "TotalPaymentAmount": mainitem.TotalPaymentAmount,
                    "TotalPatientPayment": mainitem.TotalPatientPayment,
                    "TotalWriteOffAmount": mainitem.TotalWriteOffAmount,
                    // "TotalInsuranceBalance": mainitem.TotalInsuranceBalance,
                    "TotalInsuranceBalance": mainitem.TotalInsurancePayment + mainitem.TotalAdjustmentAmount,
                    "TotalPatientBalance": mainitem.TotalPatientBalance,
                    "TotalBalance": mainitem.TotalBalance,
                    "ClaimStatusId": mainitem.ClaimStatusId,
                    "ClaimStatus": mainitem.ClaimStatus,
                    //"SettlementStatusId": mainitem.SettlementStatusId || 3,
                    //"SettlementStatus": mainitem.SettlementStatus || "Fully Settled",
                    "SettlementStatusId": 7,
                    "SettlementStatus": "Cancel Payment",
                    "TransactionTypeId": TransactionTypeId || 32,
                    "TransactionType": TransactionType || "PrimaryInsPayment",
                    "ClaimLineItems": ClaimLineItems || [],
                    "IdentifierId": mainitem.IdentifierId || 1,
                    "SecondaryPatientInsuranceDetailId": $scope.InsurancedetailstId,


                }
                console.log(obj);
                // return false;
                eHnoteInsuranceService.CancelEOBPaymentPosting(obj).then(function (resp) {
                    console.log(resp);

                    if (resp.data.Status == "Success") {
                        $uibModalInstance.close();

                    }
                });
            }, function () {
                r = "You pressed Cancel!";
            });


        }

        $scope.IsShowDenailbutton = false;
        $scope.ERAPaidByDenial = 0;
        $scope.changePaidBy = function (paidby, maindata) {
            $scope.IsShowDenailbutton = false;
            if (paidby) {
                maindata.ERAPaidBy = paidby;

                if (maindata.ERAPaidBy == '22' || maindata.ERAPaidBy == '30') {
                    angular.forEach(maindata.PatientClaimLineItems, function (sitem) {
                    //    sitem.TotalChargeAmount = -Math.abs(sitem.TotalChargeAmount);
                        sitem.TotalChargeAmount = Math.abs(sitem.TotalChargeAmount);
                    });
                } else {
                    angular.forEach(maindata.PatientClaimLineItems, function (sitem) {
                        sitem.TotalChargeAmount = Math.abs(sitem.TotalChargeAmount);
                    });
                }
            }
            if (paidby == '4') {
                $scope.IsShowDenailbutton = true;
            }
        };

        /* Posting New Restructure - Start */

        $scope.DeleteAdjustmentForLineItemNew = function (item, mainitem, index, data) {
            alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to delete? </h4>", function () {
                if (item.AdjustmentId != 0) {
                    item.DeleteInd = "Y";
                    item.ActiveInd = "N";
                    if (item.PayorPostingStatusId === 1) {
                        const deletedAdjustmentAmount = parseFloat(item.AdjustmentAmount) || 0;
                        mainitem.AdjustmentAmount -= deletedAdjustmentAmount;
                    }
                } else {
                    mainitem.ServiceAdjustments.splice(index, 1);
                }

                if (item.AdjustmentReasonId === 1) {
                    mainitem.CurrentDeductibleAmount = "";
                }
                else if (item.AdjustmentReasonId === 2) {
                    mainitem.CurrentCoInsuranceAmount = "";
                }
                else if (item.AdjustmentReasonId === 3) {
                    mainitem.CurrentCoPaymentAmount = "";
                }


                var filterAdjustment = $filter("filter")(mainitem.ServiceAdjustments, { "DeleteInd": "N" }, true) || [];
                if (filterAdjustment.length == 0) {
                    var obj = {
                        "AdjustmentId": 0,
                        "EOBLineItemId": item.EOBLineItemId || 0,
                        "ClaimLineItemId": item.ClaimLineItemId,
                        "AdjustmentReasonCode": "",
                        "AdjustmentReasonId": "",
                        "AdjsutmentDescription": '',
                        "GroupCode": '',
                        "PayorPostingStatusId": 2,
                        "PayorPostingStatus": 'Transfer',
                        "AdjustmentAmount": null,
                        "Notes": "",
                        "DeleteInd": "N",
                        "ActiveInd": "Y",
                    }
                    mainitem.ServiceAdjustments.push(obj);
                }

                $scope.calculateClaimLineItemsNew(mainitem, data);
                $scope.$apply();
            }, function () {

            });
        }

        $scope.GetTotalAdjustmentDetailsNew = function (mainitem) {
            mainitem.AllServiceAdjustmentsList = [];

            var adjustmentMap = {};

            angular.forEach(mainitem.PatientClaimLineItems, function (sitem) {
                if (sitem.ServiceAdjustments && sitem.ServiceAdjustments.length) {
                    angular.forEach(sitem.ServiceAdjustments, function (aitem) {
                        aitem.AdjsutmentDescription = aitem.AdjsutmentDescription || "";

                        if (aitem.AdjsutmentDescription !== "" && aitem.DeleteInd === "N") {
                            var desc = aitem.AdjsutmentDescription;

                            if (!adjustmentMap[desc]) {
                                adjustmentMap[desc] = angular.copy(aitem);
                            } else {
                                adjustmentMap[desc].AdjustmentAmount += aitem.AdjustmentAmount;
                            }
                        }
                    });
                }
            });

            angular.forEach(adjustmentMap, function (combinedItem) {
                mainitem.AllServiceAdjustmentsList.push(combinedItem);
            });
        };

        $scope.calculateClaimPaymentPostingTotalsNew = function (mainitem) {
            var CurrentTotalAdjustmentAmount = 0, CurrentTotalPatientBalance = 0, CurrentTotalInsurancePayment = 0, CurrentTotalClaimBalance = 0, finalPatientRespAmount = 0, finalPatientPatientBalance = 0, finalInsuranceBalance = 0, claimInsBalance = 0;


            var totalChargeAmt = 0, totalPreviousAdjustmentAmt = 0, totalBalanceamt = 0, totalInsuranceBalance = 0, totalPatientBalance = 0, totalPatientResponsibility = 0, totalInsPaymentAmount = 0, totalPatPaymentAmount = 0, totalAdjustmentAmt = 0, totalCoInsAmt = 0, totalCoPayAmt = 0, totalDeductibleAmt = 0, totalWriteOffAmt = 0, totalAllowedAmt = 0, totalServiceAdjAmt = 0, totalPreviousPaidAmt = 0, totalPreviouswriteoffAmt = 0, totalaPatientPaymentAmount = 0;
            angular.forEach(mainitem.PatientClaimLineItems, function (sitem) {

                if (sitem.IsChecked) {
                    var temptotalAdjamount = 0;
                    sitem.CurrentAdjustmentAmount = 0;
                    sitem.ServiceAdjustments = sitem.ServiceAdjustments || [];
                    if (sitem.ServiceAdjustments.length > 0) {
                        angular.forEach(sitem.ServiceAdjustments, function (Bitem) {
                            Bitem.AdjustmentAmount = parseFloat(Bitem.AdjustmentAmount) || 0;
                            // && Bitem.AdjustmentReasonCode !== "144"
                            if (Bitem.PayorPostingStatusId == 1 && Bitem.DeleteInd == "N" && Bitem.GroupCode != "OA") {
                                sitem.CurrentAdjustmentAmount += Bitem.AdjustmentAmount;
                            }
                            //&& Bitem.AdjustmentReasonCode !== "144"
                            if (Bitem.PayorPostingStatusId !== 3 && Bitem.DeleteInd == "N") {
                                temptotalAdjamount += Bitem.AdjustmentAmount;
                            }
                        });
                    }
                    sitem.CurrentServiceAdjustmentAmount = temptotalAdjamount.toFixed(2);



                    var CurrentChargeAmount = parseFloat(sitem.TotalChargeAmount) || 0;
                    var CurrentAllowedAmount = parseFloat(sitem.CurrentAllowedAmount) || 0;
                    var CurrentInsuranceBalance = parseFloat(sitem.CurrentInsuranceBalance) || 0;
                    var CurrentPatientBalance = parseFloat(sitem.CurrentPatientBalance) || 0;
                    var CurrentPatientResponsibilityAmount = parseFloat(sitem.CurrentPatientResponsibilityAmount) || 0;
                    var CurrentServiceAdjustmentAmount = parseFloat(sitem.CurrentServiceAdjustmentAmount) || 0;
                    var CurrentPreviousPaidAmt = parseFloat(sitem.PreviousPaidAmount) || 0;
                    var CurrentPreviousAdjustmentAmt = parseFloat(sitem.PreviousAdjustmentAmount) || 0;
                    var CurrentInsurancePaymentAmount = parseFloat(sitem.CurrentInsurancePaymentAmount) || 0;
                    var CurrentPatientPaymentAmount = parseFloat(sitem.CurrentPatientPaymentAmount) || 0;
                    var CurrentAdjustmentAmount = parseFloat(sitem.CurrentAdjustmentAmount) || 0;
                    var CurrentWriteOffAmount = parseFloat(sitem.CurrentWriteOffAmount) || 0;
                    var CurrentCoInsuranceAmount = parseFloat(sitem.CurrentCoInsuranceAmount) || 0;
                    var CurrentCoPaymentAmount = parseFloat(sitem.CurrentCoPaymentAmount) || 0;
                    var CurrentDeductibleAmount = parseFloat(sitem.CurrentDeductibleAmount) || 0;
                    var CurrentTotalBalance = parseFloat(sitem.CurrentTotalBalance) || 0;
                    let PreviousWriteOffAmount = parseFloat(sitem.WriteOffAmount) || 0;


                    totalChargeAmt += CurrentChargeAmount;
                    totalAllowedAmt += CurrentAllowedAmount;
                    totalInsuranceBalance += CurrentInsuranceBalance;
                    claimInsBalance += CurrentChargeAmount - (CurrentInsurancePaymentAmount + CurrentAdjustmentAmount + CurrentPatientResponsibilityAmount)

                    if (mainitem.IsSecondaryInsuranceAvailable && mainitem.IdentifierId === 1) {
                        claimInsBalance += CurrentChargeAmount - (CurrentInsurancePaymentAmount + CurrentAdjustmentAmount)
                    }

                    totalPatientBalance += CurrentPatientBalance;
                    totalPatientResponsibility += CurrentPatientResponsibilityAmount;
                    totalServiceAdjAmt += CurrentServiceAdjustmentAmount;
                    totalPreviousPaidAmt += CurrentPreviousPaidAmt;
                    totalPreviousAdjustmentAmt += CurrentPreviousAdjustmentAmt;
                    totalInsPaymentAmount += CurrentInsurancePaymentAmount;
                    totalPatPaymentAmount += CurrentPatientPaymentAmount;
                    totalAdjustmentAmt += CurrentAdjustmentAmount;
                    totalWriteOffAmt += CurrentWriteOffAmount;
                    totalCoInsAmt += CurrentCoInsuranceAmount;
                    totalCoPayAmt += CurrentCoPaymentAmount;
                    totalDeductibleAmt += CurrentDeductibleAmount;
                    totalBalanceamt += CurrentTotalBalance;
                    totalPreviouswriteoffAmt += PreviousWriteOffAmount;
                }


            });



            mainitem.TotalAllowedAmount = parseFloat(totalAllowedAmt.toFixed(2));
            mainitem.TotalInsuranceBalance = parseFloat(totalInsuranceBalance.toFixed(2));
            mainitem.TotalPatientBalance = parseFloat(totalPatientBalance.toFixed(2));
            mainitem.TotalAdjustmentAmount = parseFloat(totalServiceAdjAmt.toFixed(2));
            mainitem.TotalWriteOffAmount = parseFloat(totalWriteOffAmt.toFixed(2));
            mainitem.TotalCoInsuranceAmount = parseFloat(totalCoInsAmt.toFixed(2));
            totalPatientResponsibility = parseFloat(totalPatientResponsibility.toFixed(2));
            mainitem.TotalPatientResponsibilityAmount = totalPatientResponsibility;
            mainitem.TotalDeductibleAmount = parseFloat(totalDeductibleAmt.toFixed(2));
            mainitem.TotalInsurancePayment = parseFloat(totalInsPaymentAmount.toFixed(2));
            mainitem.TotalCopayAmount = parseFloat(totalCoPayAmt.toFixed(2));
            mainitem.TotalClaimAdjustmentAmount = parseFloat(totalServiceAdjAmt.toFixed(2));
            mainitem.TotalPaidAmount = totalInsPaymentAmount + totalPatPaymentAmount;



            console.log(mainitem.IsSecondaryInsuranceProcessed + "__IsSecondaryInsuranceProcessed" + "__" + mainitem.IdentifierId + "__IdentifierId");

            if (mainitem.IdentifierId === 2 && !mainitem.IsSecondaryInsuranceProcessed) {
                mainitem.TotalBalance = totalChargeAmt - (totalPreviousPaidAmt + totalPreviousAdjustmentAmt + totalPreviouswriteoffAmt + totalInsPaymentAmount + totalAdjustmentAmt);

                mainitem.TotalInsuranceBalance = totalChargeAmt - (totalPreviousPaidAmt + totalPreviousAdjustmentAmt + totalPreviouswriteoffAmt + totalInsPaymentAmount + totalAdjustmentAmt);
                var Temptotalbalance = parseFloat(mainitem.TotalBalance);
                CurrentTotalClaimBalance = Temptotalbalance || 0;

                console.log(mainitem.TotalInsuranceBalance + "__TotalInsuranceBalance");
            } else if (mainitem.IdentifierId === 2 && mainitem.IsSecondaryInsuranceProcessed) {
                var Temptotalbalance = parseFloat(mainitem.TotalBalance);
                CurrentTotalClaimBalance = Temptotalbalance || 0;
                console.log(mainitem.TotalInsuranceBalance + "__TotalInsuranceBalance");
            }
            else {
                mainitem.TotalBalance = totalBalanceamt;
                var Temptotalbalance = parseFloat(mainitem.TotalBalance);
                CurrentTotalClaimBalance += Temptotalbalance || 0;
            }


            mainitem.TotalBalance = parseFloat(totalBalanceamt.toFixed(2));


            CurrentTotalAdjustmentAmount += totalServiceAdjAmt || 0;
            if (mainitem.IsSecondaryInsuranceAvailable) {
                CurrentTotalPatientBalance = (mainitem.TotalDeductibleAmount + mainitem.TotalCoInsuranceAmount + mainitem.TotalCopayAmount);
            } else {
                CurrentTotalPatientBalance += totalPatientBalance || 0;
            }
            CurrentTotalInsurancePayment += totalInsPaymentAmount || 0;

            finalPatientRespAmount += totalPatientResponsibility || 0;
            finalPatientPatientBalance += totalPatientBalance - totalPatPaymentAmount || 0;
            finalInsuranceBalance += parseFloat(mainitem.TotalInsuranceBalance) || 0;
        };

        $scope.calculateClaimLineItemsNew = function (sitem, mainitem) {

            //Type: CO - 144 = Contractual Obligation

            //Posting: Post it as an adjustment / write - off

            //Insurance balance: Reduce insurance balance

            if (sitem.IsChecked) {
                var TotalChargeAmount = parseFloat(sitem.TotalChargeAmount) || 0;
                var deductableamt = parseFloat(sitem.CurrentDeductibleAmount) || 0;
                var CoInsuranceAmt = parseFloat(sitem.CurrentCoInsuranceAmount) || 0;
                var CoPaymentAmt = parseFloat(sitem.CurrentCoPaymentAmount) || 0;
                var PatientResponsibilityAmt = parseFloat(sitem.CurrentPatientResponsibilityAmount) || 0;
                var WriteOffAmt = parseFloat(sitem.CurrentWriteOffAmount) || 0;
                let AllowedAmount = parseFloat(sitem.CurrentAllowedAmount) || 0;
                let CurrentPaymentAmount = parseFloat(sitem.CurrentInsurancePaymentAmount) || 0;
                let PatientPaymentAmount = parseFloat(sitem.PatientPaymentAmount) || 0;
                let PreviousInsurancePaymentAmount = parseFloat(sitem.PreviousInsurancePaymentAmount) || 0;
                let PreviousWriteoffAmount = parseFloat(sitem.PreviousInsuranceWriteOffAmount) || 0;
                let PreviousAllowedAmount = parseFloat(sitem.AllowedAmount) || 0;
                let PreviousAdjustmentAmount = parseFloat(sitem.PreviousInsuranceAdjustmentAmount) || 0;

                let AdjustmentReasonAmount = 0;
                let PatientAdjustmentReasonAmount = 0;
                let ForwardedAdjustmentReasonAmount = 0;
                var isPrimaryPRBalanceFromEra = false;
                if (sitem.ServiceAdjustments.length > 0) {

                    var filterAdjustment = (sitem.ServiceAdjustments || []).filter(function (item) {
                        return item.PayorPostingStatusId === 1 && item.GroupCode != "OA";// && item.AdjustmentReasonCode !== "144"
                    });

                    //var filterAdjustment = $filter("filter")(sitem.ServiceAdjustments, { "PayorPostingStatusId": 1 }, true) || [];
                    if (filterAdjustment.length > 0) {

                        angular.forEach(filterAdjustment, function (Aitem) {
                            if (Aitem.DeleteInd == "N") {
                                let AdjustmentAmount = parseFloat(Aitem.AdjustmentAmount) || 0;
                                AdjustmentReasonAmount += AdjustmentAmount;
                            }
                        });
                    }
                    //let obj = $scope.checkAndGetLineItemActualAdjustments(sitem, mainitem);
                    ////AdjustmentReasonAmount = obj.adjustmentAmt;
                    //sitem.CurrentWriteOffAmount = obj.WriteOffAmount;
                    // WriteOffAmt = parseFloat(sitem.CurrentWriteOffAmount) || 0;




                    var filterAdjustment = $filter("filter")(sitem.ServiceAdjustments, { "PayorPostingStatusId": 2 }, true) || [];


                    if (filterAdjustment.length > 0) {
                        angular.forEach(filterAdjustment, function (Aitem) {
                            if (Aitem.DeleteInd == "N") {
                                let AdjustmentAmount = parseFloat(Aitem.AdjustmentAmount) || 0;
                                PatientAdjustmentReasonAmount += AdjustmentAmount;
                            }
                        });
                    }

                    //if ($scope.BillingRuleList.length > 0) {
                    //    let filterRuleAdjustment = $filter("filter")($scope.BillingRuleList, { "Type": "DEDUCTIBLE" }, true) || [];
                    //    if (filterRuleAdjustment.length > 0) {
                    //        if (filterAdjustment.length > 0) {
                    //            angular.forEach(filterAdjustment, function (Aitem) {
                    //                if (Aitem.DeleteInd == "N") {
                    //                    let AdjustmentAmount = parseFloat(Aitem.AdjustmentAmount) || 0;
                    //                    if (Aitem.AdjustmentReasonId == 1) {
                    //                        sitem.CurrentWriteOffAmount += AdjustmentAmount;
                    //                    } else {

                    //                        PatientAdjustmentReasonAmount += AdjustmentAmount;
                    //                    }

                    //                }
                    //            });
                    //        }
                    //    }
                    //} else {
                    //    if (filterAdjustment.length > 0) {
                    //        angular.forEach(filterAdjustment, function (Aitem) {
                    //            if (Aitem.DeleteInd == "N") {
                    //                let AdjustmentAmount = parseFloat(Aitem.AdjustmentAmount) || 0;
                    //                PatientAdjustmentReasonAmount += AdjustmentAmount;
                    //            }
                    //        });
                    //    }
                    //}


                    var filterDenialCodes = $filter("filter")(sitem.ServiceAdjustments, { "PayorPostingStatusId": 3 }, true) || [];
                    sitem.DenialCodes = [];
                    if (filterDenialCodes.length > 0) {

                        angular.forEach(filterDenialCodes, function (Aitem) {
                            var filterDenial = $filter("filter")(sitem.DenialCodes, { "DenialCode": Aitem.AdjustmentReasonCode }, true) || [];
                            if (filterDenial.length > 0) {
                                filterDenial[0].DenialCode = Aitem.AdjustmentReasonCode;
                                filterDenial[0].DenialCodeDescription = Aitem.AdjsutmentDescription || '';
                                filterDenial[0].AdjustmentAmount = Aitem.AdjustmentAmount || null;

                            } else {
                                var obj = {
                                    "DenialId": Aitem.DenialId || 0,
                                    "EOBLineItemId": Aitem.EOBLineItemId || 0,
                                    "ClaimLineItemId": sitem.ClaimLineItemId,
                                    "DenialCode": Aitem.AdjustmentReasonCode,
                                    "AdjustmentAmount": Aitem.AdjustmentAmount,
                                    "DenialCodeDescription": Aitem.AdjsutmentDescription || '',
                                };
                                sitem.DenialCodes.push(obj);
                            }

                            //if (Aitem.AdjustmentReasonCode == "16" || Aitem.AdjustmentReasonCode == "5" || Aitem.AdjustmentReasonCode == "B11") {
                            //    Aitem.AdjustmentAmount = parseFloat(Aitem.AdjustmentAmount) || 0;
                            //    ForwardedAdjustmentReasonAmount += Aitem.AdjustmentAmount || 0;
                            //}
                                // Commented by Vinay on 20-08-2026.
                               // Tested and verified by Pravalika.
                        });
                    }

                }
                var InsuranceBalance = 0;
                var PatientBalance = 0;

                var isPrimaryInsPayment = true;
                if ($scope.mainClaimObject.ERAPaidBy == '2' || $scope.mainClaimObject.ERAPaidBy == '3') {
                    isPrimaryInsPayment = false;
                }

                /* A reversal backs out exactly what the forward posting booked, so the
                   adjustment comes from the ledger snapshot, not from the CAS the payer
                   resent. The payer negates those inconsistently - on one reversal CO-45
                   arrives +50 while CO-253 on the next line arrives -23 - and either sign
                   booked a contractual adjustment against a line the original posting
                   never adjusted. When the prior adjustment is 0 there is nothing to
                   reverse and the charge simply reopens in full. */
                if (mainitem.ERAPaidBy == '22') {
                    AdjustmentReasonAmount = -PreviousAdjustmentAmount;
                    sitem.CurrentAdjustmentAmount = AdjustmentReasonAmount;
                }

                sitem.CurrentPatientResponsibilityAmount = PatientAdjustmentReasonAmount + ForwardedAdjustmentReasonAmount || 0;
                // as per discussion with durga no need to consider ins writeoff
                if (mainitem.IsSecondaryInsuranceAvailable) {

                    if (isPrimaryInsPayment) {
                        PatientBalance = 0;

                        InsuranceBalance = sitem.CurrentPatientResponsibilityAmount;

                        //InsuranceBalance = TotalChargeAmount - (CurrentPaymentAmount + AdjustmentReasonAmount + PatientAdjustmentReasonAmount);


                        sitem.CurrentTotalBalance = TotalChargeAmount - (CurrentPaymentAmount + AdjustmentReasonAmount + PatientPaymentAmount + PatientAdjustmentReasonAmount);
                        //sitem.CurrentTotalBalance = TotalChargeAmount - (PreviousInsurancePaymentAmount + PreviousWriteoffAmount + CurrentPaymentAmount + AdjustmentReasonAmount + PatientPaymentAmount + PreviousAdjustmentAmount + WriteOffAmt);
                    } else {

                        PatientBalance = sitem.CurrentPatientResponsibilityAmount;
                        //InsuranceBalance = TotalChargeAmount - (CurrentPaymentAmount + AdjustmentReasonAmount + PatientAdjustmentReasonAmount);
                        InsuranceBalance = 0;

                        // sitem.CurrentTotalBalance = TotalChargeAmount - (CurrentPaymentAmount + AdjustmentReasonAmount + PatientPaymentAmount + WriteOffAmt);
                        sitem.CurrentTotalBalance = TotalChargeAmount - (PreviousInsurancePaymentAmount + CurrentPaymentAmount + AdjustmentReasonAmount + PatientPaymentAmount + PreviousAdjustmentAmount);
                    }


                }
                else {
                    if ($scope.mainClaimObject.ERAPaidBy == '19') {
                        PatientBalance = PatientAdjustmentReasonAmount;
                    } else {
                        PatientBalance = PatientAdjustmentReasonAmount + ForwardedAdjustmentReasonAmount;
                    }


                    if ($scope.mainClaimObject.ERAPaidBy == '22') {
                        /* Reconcile against the ledger: the prior payment and adjustment
                           cancel against the negated amounts this reversal posts, leaving
                           the charge open again. Adding the payer amounts to the charge
                           only landed on the right number when the CAS happened to cancel
                           the payment - a line whose CAS came back already negated
                           (CO-253 -23 against a -80 payment) zeroed the balance instead
                           of reopening the full charge. */
                        InsuranceBalance = TotalChargeAmount - (PreviousInsurancePaymentAmount + CurrentPaymentAmount + PreviousAdjustmentAmount + AdjustmentReasonAmount + PatientBalance);
                    } else {
                        InsuranceBalance = TotalChargeAmount - (CurrentPaymentAmount + PatientBalance + AdjustmentReasonAmount);
                    }

                    // InsuranceBalance = TotalChargeAmount - (CurrentPaymentAmount + PatientBalance + AdjustmentReasonAmount + WriteOffAmt);
                    

                    if (mainitem.IdentifierId === 2) {
                        InsuranceBalance = TotalChargeAmount - (PreviousInsurancePaymentAmount + CurrentPaymentAmount + PatientAdjustmentReasonAmount + AdjustmentReasonAmount + PreviousAdjustmentAmount);
                        sitem.CurrentTotalBalance = TotalChargeAmount - (PreviousInsurancePaymentAmount + CurrentPaymentAmount + AdjustmentReasonAmount + PatientPaymentAmount + PreviousAdjustmentAmount);

                    } else {
                        if ($scope.mainClaimObject.ERAPaidBy == '22') {
                            // same reconciliation as the insurance balance above
                            if (PatientPaymentAmount > 0) {
                                sitem.CurrentTotalBalance = TotalChargeAmount - (PreviousInsurancePaymentAmount + CurrentPaymentAmount + PreviousAdjustmentAmount + AdjustmentReasonAmount + PatientPaymentAmount + PatientBalance);

                            }
                            else {
                                sitem.CurrentTotalBalance = TotalChargeAmount - (PreviousInsurancePaymentAmount + CurrentPaymentAmount + PreviousAdjustmentAmount + AdjustmentReasonAmount + PatientBalance);

                            }

                        }
                        else {
                            sitem.CurrentTotalBalance = TotalChargeAmount - (CurrentPaymentAmount + AdjustmentReasonAmount + PatientPaymentAmount);

                        }

                    }

                }


                sitem.CurrentServiceAdjustmentAmount = AdjustmentReasonAmount + PatientAdjustmentReasonAmount;
                sitem.CurrentAdjustmentCodeAmount = AdjustmentReasonAmount;
                sitem.CurrentServiceAdjustmentAmount = sitem.CurrentServiceAdjustmentAmount.toFixed(2);
                sitem.CurrentPatientResponsibilityAmount = sitem.CurrentPatientResponsibilityAmount.toFixed(2);
                sitem.CurrentInsuranceBalance = InsuranceBalance.toFixed(2);
                sitem.CurrentPatientBalance = PatientBalance.toFixed(2);
            }




            $scope.calculateClaimPaymentPostingTotalsNew(mainitem);
            $scope.GetTotalAdjustmentDetailsNew(mainitem);
        };


        $scope.changeClaimChargeAmountNew = function (item, mainitem) {
            //var TotalChargeAmount = parseFloat(item.TotalChargeAmount) || 0;
            var TotalChargeAmount = 0;
            angular.forEach($scope.mainClaimObject.PatientClaimLineItems, function (item) {
                let ChargeAmount = parseFloat(item.TotalChargeAmount) || 0;
                TotalChargeAmount += ChargeAmount;
                item.isChargeAmountDifferent = parseFloat(item.TotalChargeAmount) !== parseFloat(item.CurrentTotalChargeAmount);
            });
            $scope.mainClaimObject.TotalClaimAmount = TotalChargeAmount;
            $scope.calculateClaimLineItemsNew(item, mainitem);
        }

        $scope.changeClaimAllowedAmountNew = function (item, mainitem) {

            console.log(item);
            var allowedAmount = parseFloat(item.CurrentAllowedAmount) || 0;
            var totalChargeAmt = parseFloat(item.TotalChargeAmount) || 0;
            var PatientPaymentAmount = parseFloat(item.PatientPaymentAmount) || 0;
            var currentTotalBalance = parseFloat(item.CurrentTotalBalance) || 0;

            if (allowedAmount > 0) {
                item.IsChecked = true;
            }

            var c045AdjustmentAmt = 0;
            //if (mainitem.IdentifierId == 1) {

            //    c045AdjustmentAmt = (mainitem.IdentifierId === 1 || mainitem.IdentifierId === 2) ? (mainitem.IdentifierId === 1 ? totalChargeAmt : currentTotalBalance) - allowedAmount : 0;
            //    c045AdjustmentAmt = parseFloat(c045AdjustmentAmt).toFixed(2);
            //    if (c045AdjustmentAmt == 0 || allowedAmount == 0) {
            //        if (item.ServiceAdjustments[0].PayorPostingStatusId == 3) {
            //            var templist = $filter("filter")($scope.PaymentReasonList, { "AdjustmentReasonCode": '96' }, true) || [];

            //            if (templist.length > 0) {
            //                item.ServiceAdjustments[0].GroupCode = templist[0].GroupCode||'';
            //                item.ServiceAdjustments[0].AdjustmentReasonCode = templist[0].AdjustmentReasonCode;
            //                item.ServiceAdjustments[0].AdjsutmentDescription = templist[0].AdjsutmentDescription;
            //                item.ServiceAdjustments[0].AdjustmentReasonId = templist[0].AdjustmentReasonId;
            //                item.ServiceAdjustments[0].AdjustmentAmount = item.ServiceAdjustments[0].AdjustmentAmount;
            //                item.ServiceAdjustments[0].PayorPostingStatusId = 3;
            //                item.ServiceAdjustments[0].PayorPostingStatus = 'Denials';
            //            }

            //            //item.ServiceAdjustments[0].AdjustmentReasonCode = '96';
            //            //item.ServiceAdjustments[0].AdjsutmentDescription = 'CO-96-Non-covered charge(s). At least one Remark Code must be provided (may be comprised of either the NCPDP Reject Reason Code, or Remittance Advice Remark Code that is not an ALERT.) Note: Refer to the 835 Healthcare Policy Identification Segment (loop 2110 Service Payment Information REF), if present.';
            //            //item.ServiceAdjustments[0].AdjustmentAmount = item.ServiceAdjustments[0].AdjustmentAmount;
            //            //item.ServiceAdjustments[0].AdjustmentReasonId = 96;
            //            //item.ServiceAdjustments[0].PayorPostingStatusId = 3;
            //            //item.ServiceAdjustments[0].PayorPostingStatus = 'Denials';
            //        }
            //        else {
            //            //var filterAdjustment = $filter("filter")(item.ServiceAdjustments, { "AdjustmentReasonCode": '45' }, true) || [];
            //            //if (filterAdjustment.length > 0) {
            //            //    angular.forEach(item.ServiceAdjustments, function (sitem, index) {
            //            //        if (sitem.AdjustmentReasonCode === "45" && sitem.AdjustmentId == 0) {
            //            //            item.ServiceAdjustments.splice(index, 1);
            //            //        }
            //            //        else {
            //            //            sitem.DeleteInd = "Y";
            //            //            sitem.ActiveInd = "N";
            //            //        }

            //            //    });
            //            //}

            //            //if (item.ServiceAdjustments.length > 0) {

            //            //    var filterAdjustment = $filter("filter")(item.ServiceAdjustments, { "DeleteInd": "N" }, true) || [];
            //            //    if (filterAdjustment.length == 0) {
            //            //        var obj = {
            //            //            "AdjustmentId": 0,
            //            //            "EOBLineItemId": item.EOBLineItemId || 0,
            //            //            "ClaimLineItemId": item.ClaimLineItemId,
            //            //            "AdjustmentReasonCode": "",
            //            //            "AdjustmentReasonId": "",
            //            //            "AdjsutmentDescription": '',
            //            //            "PayorPostingStatusId": 2,
            //            //            "PayorPostingStatus": 'Transfer',
            //            //            "AdjustmentAmount": null,
            //            //            "Notes": "",
            //            //            "DeleteInd": "N",
            //            //            "ActiveInd": "Y",
            //            //        }
            //            //        item.ServiceAdjustments.push(obj);
            //            //    }

            //            //}


            //            item.ServiceAdjustments = item.ServiceAdjustments
            //                .filter(a => !(a.AdjustmentReasonCode === "45" && a.AdjustmentId == 0))
            //                .map(a => {
            //                    if (a.AdjustmentReasonCode === "45") {
            //                        a.DeleteInd = "Y";
            //                        a.ActiveInd = "N";
            //                    }
            //                    return a;
            //                });


            //            var hasActive = item.ServiceAdjustments.some(a => a.DeleteInd === "N");

            //            if (!hasActive) {
            //                item.ServiceAdjustments.push({
            //                    AdjustmentId: 0,
            //                    EOBLineItemId: item.EOBLineItemId || 0,
            //                    ClaimLineItemId: item.ClaimLineItemId,
            //                    GroupCode: "",
            //                    AdjustmentReasonCode: "",
            //                    AdjustmentReasonId: "",
            //                    AdjsutmentDescription: '',
            //                    PayorPostingStatusId: 2,
            //                    PayorPostingStatus: 'Transfer',
            //                    AdjustmentAmount: null,
            //                    Notes: "",
            //                    DeleteInd: "N",
            //                    ActiveInd: "Y",
            //                });
            //            }

            //        }

            //    }
            //    else {
            //        var filterAdjustment = $filter("filter")(item.ServiceAdjustments, { "AdjustmentReasonCode": '45' }, true) || [];
            //        if (filterAdjustment.length > 0) {
            //            angular.forEach(item.ServiceAdjustments, function (sitem) {
            //                if (sitem.AdjustmentReasonCode === "45") {
            //                    sitem.AdjustmentAmount = c045AdjustmentAmt;
            //                    sitem.PayorPostingStatusId = 1;
            //                    sitem.DeleteInd = "N";
            //                    sitem.PayorPostingStatus = "Adjustment";
            //                }
            //            });
            //        }

            //        else {

            //            var servAdjObj = {
            //                "AdjustmentId": 0,
            //                "EOBLineItemId": 0,
            //                "ClaimLineItemId": item.ClaimLineItemId,
            //                "GroupCode": "CO",
            //                "AdjustmentReasonCode": "45",
            //                "AdjustmentReasonId": 45,
            //                "AdjsutmentDescription": 'CO-45-Charge exceeds fee schedule/maximum allowable or contracted/legislated fee arrangement. (Use\nGroup Codes PR or CO depending upon liability).',
            //                "PayorPostingStatusId": 1,
            //                "PayorPostingStatus": 'Adjustment',
            //                "AdjustmentAmount": c045AdjustmentAmt,
            //                "Notes": "",
            //                "DeleteInd": "N",
            //                "ActiveInd": "Y",
            //            }
            //            item.ServiceAdjustments.unshift(servAdjObj);
            //        }

            //    }

            //}

            if ($scope.mainClaimObject.EraId != 0) {
                //item.CurrentInsurancePaymentAmount = null;
                //item.CurrentCoInsuranceAmount = null;
                //item.CurrentCoPaymentAmount = null;
                //item.CurrentAdjustmentAmount = null;
                //item.CurrentPaymentAmount = null;
                // mainitem.AllServiceAdjustmentsList = [];
            }
            else {
                //item.CurrentInsurancePaymentAmount = null;
                //item.CurrentCoInsuranceAmount = null;
                //item.CurrentCoPaymentAmount = null;
                //item.CurrentAdjustmentAmount = null;
                //item.CurrentPaymentAmount = null;
                //mainitem.AllServiceAdjustmentsList = [];
            }

            if (item.DeductibleAmount > 0) {
                item.CurrentDeductibleAmount = item.DeductibleAmount;
            } else {
                item.CurrentDeductibleAmount = null;
            }


            $scope.calculateClaimLineItemsNew(item, mainitem);
        };
        $scope.changeClaimDeductibleAmountNew = function (item, mainitem) {
            var DeductibleAmount = parseFloat(item.CurrentDeductibleAmount) || 0;
            var allowedAmount = parseFloat(item.CurrentAllowedAmount) || 0;
            var filterAdjustment = $filter("filter")(item.ServiceAdjustments, { "AdjustmentReasonCode": "1" }, true) || [];
            if (filterAdjustment.length > 0) {
                filterAdjustment[0].PayorPostingStatusId = 2;
                filterAdjustment[0].PayorPostingStatus = 'Transfer';
                filterAdjustment[0].AdjustmentAmount = item.CurrentDeductibleAmount || null;
                filterAdjustment[0].AdjustmentReasonCode = '1';
                filterAdjustment[0].GroupCode = 'PR';
                filterAdjustment[0].DeleteInd = 'N';
                filterAdjustment[0].ActiveInd = 'Y';
            } else {
                if (DeductibleAmount != 0) {
                    var templist = $filter("filter")($scope.PaymentReasonList, { "AdjustmentReasonCode": '1' }, true) || [];
                    var obj = {
                        "AdjustmentId": 0,
                        "EOBLineItemId": item.EOBLineItemId || 0,
                        "ClaimLineItemId": item.ClaimLineItemId,
                        "AdjustmentReasonCode": templist[0].AdjustmentReasonCode || "1",
                        "AdjustmentReasonId": templist[0].AdjustmentReasonId || 1,
                        "AdjsutmentDescription": templist[0].AdjsutmentDescription || "PR-1-Deductible Amount",
                        "PayorPostingStatusId": 2,
                        "PayorPostingStatus": 'Transfer',
                        "AdjustmentAmount": item.CurrentDeductibleAmount || null,
                        "Notes": "",
                        "GroupCode": "PR",
                        "DeleteInd": "N",
                        "ActiveInd": "Y",
                    }
                    item.ServiceAdjustments.push(obj);
                }
            }

            if (item.ServiceAdjustments.length > 1) {
                for (let i = item.ServiceAdjustments.length - 1; i >= 0; i--) {
                    if (item.ServiceAdjustments[i].AdjustmentReasonId === null || item.ServiceAdjustments[i].AdjustmentReasonId === 0) {
                        item.ServiceAdjustments.splice(i, 1);
                    }
                }
            }

            if (DeductibleAmount === 0 || DeductibleAmount == "") {
                if (item.ServiceAdjustments.length > 1) {
                    for (let i = item.ServiceAdjustments.length - 1; i >= 0; i--) {
                        if (item.ServiceAdjustments[i].AdjustmentReasonId === 1) {
                            if (item.ServiceAdjustments[i].AdjustmentId != 0 && (item.ServiceAdjustments[i].AdjustmentAmount === "0" || item.ServiceAdjustments[i].AdjustmentAmount == null)) {
                                item.ServiceAdjustments[i].DeleteInd = 'Y';
                                item.ServiceAdjustments[i].ActiveInd = 'N';
                            } else {
                                item.ServiceAdjustments.splice(i, 1);
                            }
                        }
                    }
                }
            }


            //if ($scope.BillingRuleList.length>0) {
            //    let filterRuleAdjustment = $filter("filter")($scope.BillingRuleList, { "Type": "DEDUCTIBLE" }, true) || [];
            //    if (filterRuleAdjustment.length>0) {

            //    }
            //}

            $scope.calculateClaimLineItemsNew(item, mainitem);
        };

        $scope.changeClaimCoInsuranceAmountNew = function (item, mainitem) {
            var coInsAmount = parseFloat(item.CurrentCoInsuranceAmount) || 0;
            var allowedAmount = parseFloat(item.CurrentAllowedAmount) || 0;
            var filterAdjustment = $filter("filter")(item.ServiceAdjustments, { "AdjustmentReasonCode": "2" }, true) || [];
            if (filterAdjustment.length > 0) {
                filterAdjustment[0].PayorPostingStatusId = 2;
                filterAdjustment[0].PayorPostingStatus = 'Transfer';
                filterAdjustment[0].AdjustmentAmount = item.CurrentCoInsuranceAmount || null;
                filterAdjustment[0].AdjustmentReasonCode = '2';
                filterAdjustment[0].GroupCode = 'PR';
                filterAdjustment[0].DeleteInd = 'N';
                filterAdjustment[0].ActiveInd = 'Y';
            } else {
                if (coInsAmount != 0) {
                    let templist = $filter("filter")($scope.PaymentReasonList, { "AdjustmentReasonCode": '2' }, true) || [];
                    var obj = {
                        "AdjustmentId": 0,
                        "EOBLineItemId": item.EOBLineItemId || 0,
                        "ClaimLineItemId": item.ClaimLineItemId,
                        "AdjustmentReasonCode": templist[0].AdjustmentReasonCode || "2",
                        "AdjsutmentDescription": templist[0].AdjsutmentDescription || "PR-2-Coinsurance Amount",
                        "AdjustmentReasonId": templist[0].AdjustmentReasonId || 2,
                        "PayorPostingStatusId": 2,
                        "PayorPostingStatus": 'Transfer',
                        "AdjustmentAmount": item.CurrentCoInsuranceAmount || null,
                        "Notes": "",
                        "GroupCode": "PR",
                        "DeleteInd": "N",
                        "ActiveInd": "Y",
                    }
                    item.ServiceAdjustments.push(obj);
                }
            }

            if (item.ServiceAdjustments.length > 1) {
                for (let i = item.ServiceAdjustments.length - 1; i >= 0; i--) {
                    if (item.ServiceAdjustments[i].AdjustmentReasonId === null || item.ServiceAdjustments[i].AdjustmentReasonId === 0) {
                        item.ServiceAdjustments.splice(i, 1);
                    }
                }
            }

            if (coInsAmount === 0 || coInsAmount == "") {
                if (item.ServiceAdjustments.length > 1) {
                    for (let i = item.ServiceAdjustments.length - 1; i >= 0; i--) {
                        if (item.ServiceAdjustments[i].AdjustmentReasonId === 2) {
                            if (item.ServiceAdjustments[i].AdjustmentId != 0 && (item.ServiceAdjustments[i].AdjustmentAmount === "0" || item.ServiceAdjustments[i].AdjustmentAmount == null)) {
                                item.ServiceAdjustments[i].DeleteInd = 'Y';
                                item.ServiceAdjustments[i].ActiveInd = 'N';
                            } else {
                                item.ServiceAdjustments.splice(i, 1);
                            }

                        }
                    }
                }
            }

            $scope.calculateClaimLineItemsNew(item, mainitem);

        };

        $scope.changeClaimPatientRespAmountNew = function (item, mainitem) {
            var patientRespAmount = parseFloat(item.CurrentPatientResponsibilityAmount) || 0;
            var allowedAmount = parseFloat(item.CurrentAllowedAmount) || 0;



            $scope.calculateClaimLineItemsNew(item, mainitem);

        };

        $scope.changeClaimInsuranceWriteOffAmountNew = function (item, mainitem) {
            var insWriteoffAmount = parseFloat(item.CurrentWriteOffAmount) || 0;
            var allowedAmount = parseFloat(item.CurrentAllowedAmount) || 0;


            $scope.calculateClaimLineItemsNew(item, mainitem);
        };

        $scope.changeClaimInsurancePaymentAmountNew = function (item, mainitem) {
            var PaymentAmount = parseFloat(item.CurrentInsurancePaymentAmount) || 0;
            var allowedAmount = parseFloat(item.CurrentAllowedAmount) || 0;
            var totalBalAmt = parseFloat(item.CurrentTotalBalance) || 0;

            if (PaymentAmount > 0 || allowedAmount > 0) {
                item.IsChecked = true;
            }





            $scope.calculateClaimLineItemsNew(item, mainitem);
        };

        $scope.changeClaimCoPaymentAmountNew = function (item, mainitem) {
            var coPaymentAmount = parseFloat(item.CurrentCoPaymentAmount) || 0;
            var allowedAmount = parseFloat(item.CurrentAllowedAmount) || 0;

            var filterAdjustment = $filter("filter")(item.ServiceAdjustments, { "AdjustmentReasonCode": "3" }, true) || [];
            if (filterAdjustment.length > 0) {
                filterAdjustment[0].PayorPostingStatusId = 2;
                filterAdjustment[0].PayorPostingStatus = 'Transfer';
                filterAdjustment[0].AdjustmentAmount = item.CurrentCoPaymentAmount || null;
                filterAdjustment[0].AdjustmentReasonCode = '3';
                filterAdjustment[0].GroupCode = 'PR';
                filterAdjustment[0].DeleteInd = 'N';
                filterAdjustment[0].ActiveInd = 'Y';
            } else {
                if (coPaymentAmount != 0) {
                    let templist = $filter("filter")($scope.PaymentReasonList, { "AdjustmentReasonCode": '3' }, true) || [];
                    var obj = {
                        "AdjustmentId": 0,
                        "EOBLineItemId": item.EOBLineItemId || 0,
                        "ClaimLineItemId": item.ClaimLineItemId,
                        "AdjustmentReasonCode": templist[0].AdjustmentReasonCode || "3",
                        "AdjsutmentDescription": templist[0].AdjsutmentDescription || "PR-3-Co-payment Amount",
                        "AdjustmentReasonId": templist[0].AdjustmentReasonId || 3,
                        "PayorPostingStatusId": 2,
                        "PayorPostingStatus": 'Transfer',
                        "AdjustmentAmount": item.CurrentCoPaymentAmount || null,
                        "Notes": "",
                        "GroupCode": "PR",
                        "DeleteInd": "N",
                        "ActiveInd": "Y",
                    }
                    item.ServiceAdjustments.push(obj);
                }
            }

            if (item.ServiceAdjustments.length > 1) {
                for (let i = item.ServiceAdjustments.length - 1; i >= 0; i--) {
                    if (item.ServiceAdjustments[i].AdjustmentReasonId === null || item.ServiceAdjustments[i].AdjustmentReasonId === 0) {
                        item.ServiceAdjustments.splice(i, 1);
                    }
                }
            }


            if (coPaymentAmount === 0 || coPaymentAmount == "") {
                if (item.ServiceAdjustments.length > 1) {
                    for (let i = item.ServiceAdjustments.length - 1; i >= 0; i--) {
                        if (item.ServiceAdjustments[i].AdjustmentReasonId === 3) {
                            if (item.ServiceAdjustments[i].AdjustmentId != 0 && (item.ServiceAdjustments[i].AdjustmentAmount === "0" || item.ServiceAdjustments[i].AdjustmentAmount == null)) {
                                item.ServiceAdjustments[i].DeleteInd = 'Y';
                                item.ServiceAdjustments[i].ActiveInd = 'N';
                            } else {
                                item.ServiceAdjustments.splice(i, 1);
                            }
                        }
                    }
                }
            }


            $scope.calculateClaimLineItemsNew(item, mainitem);
        };

        $scope.totalAdjustedAmountPopoverNew = {
            templateUrl: 'totalAdjustedAmountPopoverNew.html',
        };

        $scope.openTotalAdjustmentPopoverNew = function (item, data) {
            angular.forEach(data.PatientClaimLineItems, function (Aitem) {
                Aitem.popoverOpen = false;
            });
            item.popoverOpen = true;

            angular.forEach(item.ServiceAdjustments, function (sitem) {
                if (["1", "2", "3"].includes(sitem.AdjustmentReasonCode) && sitem.PostingStatusId == 2) {
                    switch (sitem.AdjustmentReasonCode) {
                        case "1":
                            sitem.AdjustmentAmount = item.CurrentDeductibleAmount;
                            break;
                        case "2":
                            sitem.AdjustmentAmount = item.CurrentCoInsuranceAmount;
                            break;
                        case "3":
                            sitem.AdjustmentAmount = item.CurrentCoPaymentAmount;
                            break;
                    }
                }
            });
        };
        $scope.checkPatientSecondaryInsBalanceandPatientPr = function (line, isSecondaryInsAvail, isInformationalForwarding, PaidBy) {
            var response = {};

            var SecondaryInsuranceBalance = 0;
            var CurrentPatientBalance = 0;
            var CurrentPatientResponsibility = 0;
            var currentWriteOffAmount = 0;
            var currentAdjustmentAmount = 0;



            if (line.ServiceAdjustments.length > 0) {
                angular.forEach(line.ServiceAdjustments, function (item) {

                    if (item.GroupCode === "PR" && item.AdjustmentReasonCode != "276" && item.AdjustmentReasonCode != "1" && item.AdjustmentReasonCode != "2" && item.AdjustmentReasonCode != "3") {
                        CurrentPatientResponsibility += item.AdjustmentAmount || 0;

                    } else if (item.AdjustmentReasonCode === "1" || item.AdjustmentReasonCode === "2" || item.AdjustmentReasonCode === "3") {
                        let filterCOPAYRule = $filter("filter")($scope.BillingRuleList, { "Type": "COPAY" }, true) || [];
                        let filterCOINSURANCERule = $filter("filter")($scope.BillingRuleList, { "Type": "COINSURANCE" }, true) || [];
                        let filterDEDUCTIBLERule = $filter("filter")($scope.BillingRuleList, { "Type": "DEDUCTIBLE" }, true) || [];

                        //if (filterDEDUCTIBLERule.length > 0) {
                        //    currentWriteOffAmount += Math.abs(item.AdjustmentAmount || 0);
                        //} else {
                        //    CurrentPatientResponsibility += item.AdjustmentAmount || 0;
                        //}

                        CurrentPatientResponsibility += item.AdjustmentAmount || 0;

                    }
                    else if (item.AdjustmentReasonCode === "B11") {
                        CurrentPatientResponsibility += item.AdjustmentAmount || 0;

                    } else if (item.AdjustmentReasonCode === "16") {
                        CurrentPatientResponsibility += item.AdjustmentAmount || 0;

                    } else if (item.AdjustmentReasonCode === "5") {
                        CurrentPatientResponsibility += item.AdjustmentAmount || 0;
                    }
                    //else if (item.AdjustmentReasonCode === "144") {
                    //    currentWriteOffAmount += Math.abs(item.AdjustmentAmount || 0);

                    //}
                    else if (item.AdjustmentReasonCode === "151") {
                        currentWriteOffAmount += Math.abs(item.AdjustmentAmount || 0);

                    }
                    else if (item.AdjustmentReasonCode === "24") {
                        
                    } else if (item.AdjustmentReasonCode === "97") {
                        currentWriteOffAmount += Math.abs(item.AdjustmentAmount || 0);

                    } else if (item.GroupCode === "OA") {


                    }
                })
            };

            PaidBy = parseInt(PaidBy) || 0;

            if (isSecondaryInsAvail) {
                SecondaryInsuranceBalance = CurrentPatientResponsibility;
            } else if (PaidBy === 19) {
                SecondaryInsuranceBalance = CurrentPatientResponsibility;
            } else {
                CurrentPatientBalance = CurrentPatientResponsibility;
            }

            response.SecondaryInsuranceBalance = SecondaryInsuranceBalance;
            response.PatientResponsibility = CurrentPatientResponsibility;
            response.PatientBalance = CurrentPatientBalance;
            response.WriteOffAmount = currentWriteOffAmount;

            return response;
        }


        $scope.SaveTotalAdjustmentAmtNew = function (ServiceAdjustments, lineitem, mainitem) {
            var CurrentAdjustmentAmt = 0;
            var currentWriteOffAmount = 0;
            lineitem.CurrentDeductibleAmount = null;
            lineitem.CurrentCoInsuranceAmount = null;
            lineitem.CurrentCoPaymentAmount = null;

            angular.forEach(ServiceAdjustments, function (item) {
                var amount = 0;
                if (item.ActiveInd == "Y" && item.DeleteInd == "N") {
                    amount = parseFloat(item.AdjustmentAmount) || 0;
                    //if (item.AdjustmentReasonCode === "144") {
                    //    currentWriteOffAmount += amount;
                    //}
                    //else if (!["151", "16", "5"].includes(item.AdjustmentReasonCode)) {
                    //    CurrentAdjustmentAmt += amount;
                    //}
                    //else if (item.AdjustmentReasonCode == "MA125" && lineitem.CurrentInsurancePaymentAmount > 0) {
                    //    lineitem.CurrentInsurancePaymentAmount = 0;
                    //}
                    if (item.AdjustmentReasonCode == "N536") {
                        // lineitem.CurrentInsurancePaymentAmount = 0;
                    }
                    else if (item.AdjustmentReasonCode == "MA125") {
                        var checkIfPrimaryInsPaymentExisits = $scope.isDuplicateMA125Payment(lineitem);
                        if (checkIfPrimaryInsPaymentExisits) {
                            if (mainitem.ERAPaidBy === 1 || mainitem.ERAPaidBy === 19) {
                                var dupAmount = lineItem.CurrentInsurancePaymentAmount || 0;
                                item.GroupCode = "OA";
                                item.AdjustmentReasonCode = "MA125";
                                item.AdjustmentAmount = dupAmount;
                                lineItem.CurrentInsurancePaymentAmount = 0;

                            } else if (
                                mainitem.ERAPaidBy === 2 ||
                                mainitem.ERAPaidBy === 3 ||
                                mainitem.ERAPaidBy === 20 ||
                                mainitem.ERAPaidBy === 21
                            ) {

                                var finalPaymentAmount = $scope.checkFinalPaymentAmountForMA125(lineItem);
                                lineItem.CurrentInsurancePaymentAmount = finalPaymentAmount;
                            }
                        }

                    }
                    //else {
                    //    CurrentAdjustmentAmt += amount;
                    //}

                    var sbalresponse = {};
                    sbalresponse = $scope.checkPatientSecondaryInsBalanceandPatientPr(lineitem, mainitem.IsSecondaryInsuranceAvailable, isInformationalForwarding, mainitem.ERAPaidBy);
                    lineitem.CurrentPatientResponsibilityAmount = sbalresponse.PatientResponsibility;
                    lineitem.CurrentInsuranceBalance = sbalresponse.SecondaryInsuranceBalance;
                    lineitem.CurrentPatientBalance = sbalresponse.PatientBalance;
                    lineitem.CurrentWriteOffAmount = sbalresponse.WriteOffAmount;
                    let obj = $scope.checkAndGetLineItemActualAdjustments(lineitem, mainitem);
                    lineitem.CurrentServiceAdjustmentAmount = obj.adjustmentAmt;
                    lineitem.CurrentAdjustmentAmount = obj.adjustmentAmt;
                    //lineitem.CurrentWriteOffAmount = obj.WriteOffAmount;

                }

                switch (item.AdjustmentReasonCode) {
                    case "1":
                        lineitem.CurrentDeductibleAmount = amount;
                        break;
                    case "2":
                        lineitem.CurrentCoInsuranceAmount = amount;
                        break;
                    case "3":
                        lineitem.CurrentCoPaymentAmount = amount;
                        break;
                }
            });

            // lineitem.CurrentServiceAdjustmentAmount = CurrentAdjustmentAmt.toFixed(2);
            // lineitem.CurrentWriteOffAmount = currentWriteOffAmount;
            lineitem.popoverOpen = false;

            $scope.calculateClaimLineItemsNew(lineitem, mainitem);
        };




        $scope.restructureClaimPostingDataNewV2 = function () {

            $scope.mainClaimObject = angular.copy($scope.getMainClaimObject());
            var data = $scope.PatientClaimInfo;
            $scope.mainClaimObject.UserId = data.UserId || 0;
            $scope.mainClaimObject.EOBId = data.EOBId || 0;
            $scope.mainClaimObject.EOBClaimInfoId = data.EOBClaimInfoId || 0;
            $scope.mainClaimObject.EOBPayorName = data.EOBPayorName || "";
            $scope.mainClaimObject.EOBPayorId = data.EOBPayorId || 0;
            $scope.mainClaimObject.ClaimDate = data.ClaimDate || "";

            $scope.PatientClaimTransmissionObj.PayerClaimControlNumber = data.PayerClaimControlNumber;
            $scope.mainClaimObject.PayerClaimControlNumber = data.PayerClaimControlNumber || "";
            $scope.mainClaimObject.PatientClaimId = data.PatientClaimId || 0;
            $scope.mainClaimObject.ClaimStatus = $scope.PatientClaimInfo.ClaimStatus || "Not Submitted";
            $scope.mainClaimObject.ClaimStatusId = $scope.PatientClaimInfo.ClaimStatusId || 1;
            $scope.mainClaimObject.BillPaymentTypeId = data.BillPaymentTypeId || 0;
            $scope.mainClaimObject.BillPaymentType = data.BillPaymentType || "";
            $scope.mainClaimObject.PatientClaimNumber = data.PatientClaimNumber || "";
            $scope.mainClaimObject.PatientId = data.PatientId || 0;
            $scope.mainClaimObject.PatientInsuranceDetailId = data.PatientInsuranceDetailId || null;
            $scope.mainClaimObject.PrimaryInsuranceId = data.PrimaryInsuranceId || null;
            //$scope.mainClaimObject.TotalClaimAmount = data.TotalClaimAmount || 0;
            $scope.mainClaimObject.TotalAllowedAmount = data.TotalAllowedAmount || 0;
            $scope.mainClaimObject.TotalCopayAmount = data.TotalCopayAmount || 0;
            $scope.mainClaimObject.TotalCoInsuranceAmount = data.TotalCoInsuranceAmount || 0;
            $scope.mainClaimObject.TotalDeductibleAmount = data.TotalDeductibleAmount || 0;
            $scope.mainClaimObject.TotalPaymentAmount = data.TotalPaymentAmount || 0;
            $scope.mainClaimObject.TotalWriteOffAmount = data.TotalWriteOffAmount || 0;
            // $scope.mainClaimObject.TotalInsuranceBalance = data.TotalInsuranceBalance || 0;
            $scope.mainClaimObject.TotalAdjustmentAmount = data.TotalAdjustmentAmount || 0;
            $scope.mainClaimObject.TotalInsurancePayment = data.TotalInsurancePayment || 0;
            $scope.mainClaimObject.IsSecondaryChargeEditedClaim = data.IsSecondaryChargeEditedClaim || false;
            $scope.mainClaimObject.TotalDepositAvailable = data.TotalDepositAvailable || 0;

            //  $scope.mainClaimObject.TotalBalance = data.TotalBalance || 0;
            $scope.mainClaimObject.ReferenceNumber = data.ReferenceNumber || "";
            $scope.mainClaimObject.IdentifierId = data.IdentifierId || 0;




            $scope.Patientobj.TotalClaimAmount = data.TotalClaimAmount || 0;
            $scope.Patientobj.TotalInsurancePayment = data.TotalInsurancePayment || 0;
            $scope.Patientobj.TotalAdjustmentAmount = data.TotalAdjustmentAmount || 0;
            $scope.Patientobj.TotalPatientPayment = data.TotalPatientPayment || 0;
            $scope.Patientobj.TotalPatientBalance = data.TotalPatientBalance || 0;
            $scope.Patientobj.TotalInsuranceBalance = data.TotalInsuranceBalance || 0;
            $scope.Patientobj.TotalBalance = data.TotalBalance || 0;
            $scope.Patientobj.TotalRefundAmount = data.TotalRefundAmount || 0;
            $scope.Patientobj.TotalDeductibleAmount = data.TotalDeductibleAmount || 0;
            $scope.Patientobj.TotalCoInsuranceAmount = data.TotalCoInsuranceAmount || 0;
            $scope.Patientobj.TotalCopayAmount = data.TotalCopayAmount || 0;

            $scope.mainClaimObject.AllServiceAdjustmentsList = [];
            var tempadjustmentMap = {};

            $scope.IsShowPostandCreateSecClaimbtn = false;
            if (data.EraId != null && data.ERAPaidBy == 19) {
                $scope.IsShowPostandCreateSecClaimbtn = true;
            }
            $scope.mainClaimObject.isAccordianOpen = true;
            $scope.mainClaimObject.IsCheckAllPayments = true;

            console.log($scope.PatientClaimEOBDetails);
            console.log("EOB Details");
            angular.forEach($scope.PatientClaimEOBDetails, function (kitem) {
                kitem.InsuranceIdentifierId = kitem.InsuranceIdentifierId || 1;
                if (kitem.InsuranceIdentifierId == 0) {
                    var filtredobj4 = $filter("filter")(
                        $scope.AppointmentInsuranceDetails,
                        { "PatientInsuranceDetailId": kitem.PatientInsuranceDetailId },
                        true
                    ) || [];
                    if (filtredobj4.length > 0) {
                        kitem.InsuranceIdentifierId = filtredobj4[0].IdentifierId;
                    }
                }

                kitem.TotalChargeAmount = 0;

                angular.forEach(kitem.PatientClaimLineItems, function (poitem) {
                    poitem.IsChecked = true;
                    if (kitem.InsuranceIdentifierId === 1) {  
                        poitem.TotalChargeAmount = kitem.UnitCharge * kitem.Quantity;
                    } else if (kitem.InsuranceIdentifierId === 2) {
                        if (poitem.IsSecondaryChargeEdited
                            && poitem.SecondaryUnitCharge
                            && poitem.SecondaryUnitCharge > 0) {
                          
                            poitem.TotalChargeAmount = poitem.SecondaryUnitCharge * poitem.Quantity;
                        } else {
                          
                            poitem.TotalChargeAmount = poitem.UnitCharge * poitem.Quantity;
                        }
                    }

                    kitem.TotalChargeAmount += poitem.TotalChargeAmount || 0;
                });
            });

            console.log($scope.PatientClaimEOBDetails);

            var filtredobj1 = $filter("filter")($scope.PatientClaimEOBDetails, { "EOBId": mainObject.EOBId }, true) || [];
            if (filtredobj1.length == 0) {
                return false;
            }

            $scope.mainClaimObject.PatientInsuranceDetailId = filtredobj1[0].PatientInsuranceDetailId;
            var filtredobj2 = $filter("filter")($scope.AppointmentInsuranceDetails, { "PatientInsuranceDetailId": filtredobj1[0].PatientInsuranceDetailId }, true) || [];

            console.log(filtredobj2);


            if (filtredobj2.length > 0) {
                $scope.mainClaimObject.PayorId = filtredobj2[0].PayorId;
                $scope.mainClaimObject.PlanName = filtredobj2[0].PlanName;
                $scope.mainClaimObject.PayorName = filtredobj2[0].PayorName;
                $scope.mainClaimObject.AppointmentId = filtredobj2[0].AppointmentId || 0;
                $scope.mainClaimObject.IdentifierId = filtredobj2[0].IdentifierId;
                $scope.mainClaimObject.InsuranceIdentifierId = filtredobj2[0].IdentifierId;
                if ($scope.mainClaimObject.IdentifierId == 1) {
                    if ($scope.AppointmentInsuranceDetails.length > 1) {
                        $scope.mainClaimObject.IsSecondaryInsuranceAvailable = true;
                    }
                }
            }
            if ($scope.PatientClaimInfo.PatientClaimLineItems.length > 0) {

                angular.forEach($scope.PatientClaimInfo.PatientClaimLineItems, function (item) {

                    item.DOSfrom = item.DOSfrom || null;
                    item.DOSto = item.DOSto || null;
                    var serviceDatefrom = null; var serviceDateTo = null;
                    if (item.DOSfrom != null) {
                        serviceDatefrom = $filter("date")(item.DOSfrom, "MM-dd-yyyy");
                    }
                    if (item.DOSto != null) {
                        serviceDateTo = $filter("date")(item.DOSto, "MM-dd-yyyy");
                    }

                    let lineItemObj = $scope.GetClaimLineItemObj();
                    lineItemObj.ClaimLineItemId = item.ClaimLineItemId || 0;
                    lineItemObj.PatientClaimId = item.PatientClaimId || 0;
                    lineItemObj.ServiceId = item.ServiceId || 0;
                    lineItemObj.OrganizationProcedureId = item.OrganizationProcedureId || 0;
                    lineItemObj.ServiceName = item.ServiceName || "";
                    lineItemObj.ServiceObj = item.ServiceCode || "";
                    lineItemObj.ServiceCode = item.ServiceCode || "";
                    lineItemObj.OrganizationProcedureId = item.OrganizationProcedureId || null;
                    lineItemObj.DOSfrom = serviceDatefrom || null;
                    lineItemObj.DOSto = serviceDateTo || null;
                    lineItemObj.PlaceOfServiceId = item.PlaceOfServiceId || null;
                    lineItemObj.PlaceOfServiceName = item.PlaceOfServiceName || "";
                    lineItemObj.UnitCharge = item.UnitCharge || 0;
                    lineItemObj.Quantity = item.Quantity || "";
                    lineItemObj.DiagnosisList = item.DiagnosisList || "";
                    lineItemObj.RevenueBillingCode = item.RevenueBillingCode || "";
                    lineItemObj.RevenueBillingCodeId = item.RevenueBillingCodeId || null;
                    lineItemObj.RenderingProviderId = item.RenderingProviderId || null;
                    lineItemObj.TypeOfServiceId = item.TypeOfServiceId || null;

                    console.log(item.TotalChargeAmount + "_item.TotalChargeAmount");
                    lineItemObj.TotalChargeAmount = item.TotalChargeAmount || 0;
                    lineItemObj.InsurancePaymentAmount = parseFloat(item.InsurancePaymentAmount || 0).toFixed(2);
                    lineItemObj.AllowedAmount = item.AllowedAmount || 0;
                    lineItemObj.AdjustmentAmount = item.AdjustmentAmount || 0;
                    //lineItemObj.CoPaymentAmount = item.CoPaymentAmount || 0;
                    //lineItemObj.DeductibleAmount = item.DeductibleAmount || 0;
                    //lineItemObj.CoInsuranceAmount = item.CoInsuranceAmount || 0;
                    lineItemObj.CoPaymentAmount = 0;
                    lineItemObj.DeductibleAmount = 0;
                    lineItemObj.CoInsuranceAmount = 0;
                    lineItemObj.PatientPaymentAmount = parseFloat(item.PatientPaymentAmount || 0).toFixed(2);
                    lineItemObj.WriteOffAmount = item.WriteOffAmount || 0;
                    lineItemObj.InsuranceBalance = item.InsuranceBalance || 0;
                    lineItemObj.PatientBalance = parseFloat(item.PatientBalance) + parseFloat(item.PatientPaymentAmount) || 0;
                    lineItemObj.CurrentPatientBalance = item.PatientBalance || 0;
                    lineItemObj.PatientResponsibilityAmount = item.PatientResponsibility || 0;
                    lineItemObj.TotalBalance = item.TotalBalance || 0;
                    lineItemObj.CurrentTotalChargeAmount = item.TotalChargeAmount || 0; // added this reversal functionality checking
                    lineItemObj.DeleteInd = item.DeleteInd || "N";
                    lineItemObj.IsSecondaryChargeEdited = item.IsSecondaryChargeEdited || false;
                    lineItemObj.SecondaryUnitCharge = item.SecondaryUnitCharge || 0;
                    lineItemObj.SecondaryTotalChargeAmount = item.SecondaryTotalChargeAmount || 0;
                    lineItemObj.PrimaryTotalChargeAmount = item.PrimaryTotalChargeAmount || 0;

                    if ($scope.mainClaimObject.IsSecondaryChargeEditedClaim && $scope.mainClaimObject.InsuranceIdentifierId === 2 && item.IsSecondaryChargeEdited) {
                            lineItemObj.UnitCharge = item.SecondaryUnitCharge || 0;
                            lineItemObj.TotalChargeAmount = item.SecondaryTotalChargeAmount || 0;
                    }

                    if (lineItemObj.PatientBalance != 0) {
                        lineItemObj.IsPatientBalanceReceived = true;
                    }
                    if (lineItemObj.PatientPaymentAmount != 0) {
                        lineItemObj.IsPatientPaymentDone = true;
                    }

                    lineItemObj.CurrentInsuranceBalance = (item.InsuranceBalance || 0).toFixed(2);
                    lineItemObj.CurrentPatientBalance = (item.PatientBalance || 0).toFixed(2);

                    //lineItemObj.PreviousInsurancePaymentAmount = (item.InsurancePaymentAmount || 0).toFixed(2);
                    //lineItemObj.PreviousInsuranceAllowedAmount = item.AllowedAmount || 0;
                    //lineItemObj.PreviousInsuranceAdjustmentAmount = (item.AdjustmentAmount || 0).toFixed(2);
                    //lineItemObj.PreviousInsurancePRAmount = item.PatientResponsibilityAmount || 0;
                    //lineItemObj.PreviousInsuranceWriteOffAmount = item.WriteOffAmount || 0;
                    //lineItemObj.PreviousPatientPaymentAmount = (item.PatientPaymentAmount || 0).toFixed(2);
                    //lineItemObj.PreviousPatientBalanceAmount = item.PatientBalance || 0;
                    //$scope.mainClaimObject.TotalPreviousInsurancePaymentAmount += item.InsurancePaymentAmount || 0;
                    //$scope.mainClaimObject.TotalPreviousPatientPaymentAmount += item.PatientPaymentAmount || 0;
                    //$scope.mainClaimObject.TotalPreviousInsuranceAdjustmentAmount += item.AdjustmentAmount || 0;
                    //lineItemObj.PreviousPaidAmount = item.InsurancePaymentAmount + item.PatientPaymentAmount;

                    lineItemObj.PreviousPaidAmount = (lineItemObj.PreviousPaidAmount || 0).toFixed(2);

                    if (item.InsuranceBalance != 0) {
                        lineItemObj.CurrentTotalBalance = item.InsuranceBalance || 0;
                    }
                    //else {
                    //    lineItemObj.CurrentTotalBalance = item.TotalChargeAmount || 0;
                    //}

                    lineItemObj.CurrentAllowedAmount = null;
                    lineItemObj.CurrentInsurancePaymentAmount = null;
                    lineItemObj.CurrentDeductibleAmount = null;
                    lineItemObj.CurrentCoInsuranceAmount = null;
                    lineItemObj.CurrentCoPaymentAmount = null;
                    lineItemObj.CurrentPatientResponsibilityAmount = (lineItemObj.CurrentPatientResponsibilityAmount || 0).toFixed(2);
                    lineItemObj.CurrentServiceAdjustmentAmount = (lineItemObj.CurrentServiceAdjustmentAmount || 0).toFixed(2);
                    lineItemObj.CurrentWriteOffAmount = null;
                    lineItemObj.ServiceAdjustments = lineItemObj.ServiceAdjustments || [];
                    lineItemObj.IsChecked = true;

                    console.log(lineItemObj.ClaimInsuranceLineItems);

                    console.log("ClaimInsuranceLineItems");
                    lineItemObj.ClaimInsuranceLineItems = item.ClaimInsuranceLineItems || [];

                    if (lineItemObj.ServiceAdjustments.length == 0) {
                        let obj = {
                            "AdjustmentId": 0,
                            "EOBLineItemId": 0,
                            "ClaimLineItemId": "",
                            "AdjustmentReasonCode": '0',
                            "AdjsutmentDescription": '',
                            "GroupCode": '',
                            "AdjustmentReasonId": null,
                            "AdjustmentAmount": null,
                            "PayorPostingStatusId": 2,
                            "PayorPostingStatus": 'Transfer',
                            "Notes": "",
                            "DeleteInd": "N",
                            "ActiveInd": "Y",
                        }
                        lineItemObj.ServiceAdjustments.push(obj);
                    }

                    if (lineItemObj.CurrentPatientBalance != 0) {
                        $scope.mainClaimObject.IsCurrentPatientBalanceInd = true;
                    }
                    //commented by durga as we dont need allowed by default on 06-04-2026
                    //lineItemObj.CurrentAllowedAmount = item.AllowedAmount || null;
                    $scope.mainClaimObject.PatientClaimLineItems.push(lineItemObj);
                });
            }


            $scope.mainClaimObject.ERAPaidBy = filtredobj1[0].ERAPaidBy || "";
            $scope.mainClaimObject.EOBPayorName = filtredobj1[0].EOBPayorName || "";
            $scope.mainClaimObject.EOBPayorId = filtredobj1[0].EOBPayorId || 0;
            $scope.mainClaimObject.OrganizationPayorId = filtredobj1[0].OrganizationPayorId || 0;
            $scope.mainClaimObject.EOBId = filtredobj1[0].EOBId || 0;
            $scope.mainClaimObject.EOBClaimInfoId = filtredobj1[0].EOBClaimInfoId || 0;
            $scope.mainClaimObject.PayerClaimControlNumber = filtredobj1[0].PayerClaimControlNumber || "";
            $scope.mainClaimObject.ReferenceNumber = filtredobj1[0].ReferenceNumber || "";
            $scope.mainClaimObject.BillPaymentTypeId = filtredobj1[0].BillPaymentTypeId || 0;
            $scope.mainClaimObject.BillPaymentType = filtredobj1[0].BillPaymentType || "";
            $scope.mainClaimObject.PostingDate = $filter("date")(filtredobj1[0].PostingDate, "MM-dd-yyyy");
            $scope.mainClaimObject.TotalAllowedAmount = filtredobj1[0].TotalAllowedAmount || 0;
            $scope.mainClaimObject.EraId = filtredobj1[0].EraId || 0;
            $scope.mainClaimObject.RenderingProviderId = $scope.PatientClaimInfo.RenderingProviderId;


            $scope.mainClaimObject.TotalCopayAmount = filtredobj1[0].TotalCopayAmount || 0;
            $scope.mainClaimObject.TotalCoInsuranceAmount = filtredobj1[0].TotalCoInsuranceAmount || 0;
            $scope.mainClaimObject.TotalDeductibleAmount = filtredobj1[0].TotalDeductibleAmount || 0;
            $scope.mainClaimObject.TotalPaymentAmount = filtredobj1[0].TotalPaymentAmount || 0;
            $scope.mainClaimObject.TotalWriteOffAmount = filtredobj1[0].TotalWriteOffAmount || 0;
            // $scope.mainClaimObject.TotalInsuranceBalance = filtredobj1[0].TotalInsuranceBalance || 0;
            $scope.mainClaimObject.TotalAdjustmentAmount = filtredobj1[0].TotalAdjustmentAmount || 0;
            $scope.mainClaimObject.TotalInsurancePayment = filtredobj1[0].TotalInsurancePayment || 0;
            if ($scope.mainClaimObject.TotalInsurancePayment == 0) {
                $scope.mainClaimObject.PostingDate = $filter("date")($scope.CurrentPostDate, "MM-dd-yyyy");
            }
            else {
                $scope.mainClaimObject.PostingDate = $filter("date")(filtredobj1[0].PostingDate, "MM-dd-yyyy");
            }

            filtredobj1[0].ERAPaidBy = filtredobj1[0].ERAPaidBy || 0;
            if (filtredobj1[0].ERAPaidBy != 0) {
                $scope.mainClaimObject.ERAPaidBy = filtredobj1[0].ERAPaidBy.toString() || '';
                if ($scope.mainClaimObject.ERAPaidBy === '4') {
                    $scope.IsShowDenailbutton = true;
                }

            };



            console.log(filtredobj1[0].EOBClaimLineItems);

            console.log("EOBClaimLineItems");
            if (filtredobj1[0].EOBClaimLineItems.length == 0) {
                angular.forEach($scope.PatientClaimInfo.PatientClaimLineItems, function (Aitem) {
                    angular.forEach($scope.mainClaimObject.PatientClaimLineItems, function (Bitem) {
                        if (Aitem.ClaimLineItemId == Bitem.ClaimLineItemId) {
                            //Bitem.PreviousInsurancePaymentAmount = (Aitem.PreviousInsurancePaymentAmount || 0).toFixed(2);
                            //Bitem.PreviousInsuranceAllowedAmount = Aitem.PreviousAllowedAmount || 0;
                            //Bitem.PreviousInsuranceAdjustmentAmount = (Aitem.PreviousAdjustmentAmount || 0).toFixed(2);
                            //Bitem.PreviousInsurancePRAmount = Aitem.PreviousInsurancePRAmount || 0;
                            //Bitem.PreviousInsuranceWriteOffAmount = Aitem.PreviousWriteOffAmount || 0;
                            //Bitem.PreviousPatientPaymentAmount = (Aitem.PreviousPatientPaymentAmount || 0).toFixed(2);
                            //Bitem.PreviousPatientBalanceAmount = Aitem.PreviousPatientBalanceAmount || 0;



                            //if (mainObject.IsCapitationInd) {
                            //    var discountAmount = (Aitem.TotalChargeAmount * mainObject.CapitationDiscount) / 100;

                            //    Aitem.TotalBalance = parseFloat(discountAmount.toFixed(2));
                            //    Aitem.WriteOffAmount = parseFloat(discountAmount.toFixed(2));
                            //    Aitem.InsuranceBalance = parseFloat(discountAmount.toFixed(2));
                            //    Aitem.AllowedAmount = parseFloat(Aitem.TotalChargeAmount.toFixed(2));
                            //    Aitem.InsurancePaymentAmount = parseFloat((Aitem.TotalChargeAmount - discountAmount).toFixed(2));

                            //    var templist = $filter("filter")($scope.PaymentReasonList, { "AdjustmentReasonCode": '151' }, true) || [];
                            //    if (Aitem.ServiceAdjustments.length == 0) {
                            //        let obj = {
                            //            "AdjustmentId": 0,
                            //            "EOBLineItemId": Aitem.EOBLineItemId || 0,
                            //            "ClaimLineItemId": Aitem.ClaimLineItemId || "",
                            //            "AdjustmentReasonCode": templist[0].AdjustmentReasonCode,
                            //            "AdjsutmentDescription": templist[0].AdjsutmentDescription,
                            //            "GroupCode": templist[0].GroupCode || '',
                            //            "AdjustmentReasonId": templist[0].AdjustmentReasonId,
                            //            "AdjustmentAmount": Aitem.WriteOffAmount || null,
                            //            "PayorPostingStatusId": 1,
                            //            "PayorPostingStatus": 'Adjustment',
                            //            "Notes": "",
                            //            "DeleteInd": "N",
                            //            "ActiveInd": "Y",
                            //        }
                            //        Aitem.ServiceAdjustments.push(obj);
                            //    }


                            //    Bitem.CurrentInsurancePaymentAmount = (Aitem.InsurancePaymentAmount || 0).toFixed(2);
                            //    Bitem.CurrentInsuranceBalance = (Aitem.InsuranceBalance || 0).toFixed(2);
                            //    Bitem.CurrentWriteOffAmount = (Aitem.WriteOffAmount || 0).toFixed(2);
                            //    Bitem.CurrentTotalBalance = (Aitem.TotalBalance || 0).toFixed(2);
                            //    Bitem.ServiceAdjustments = Aitem.ServiceAdjustments || [];

                            //    $scope.Patientobj.TotalInsuranceBalance += Aitem.InsuranceBalance || 0;
                            //    $scope.Patientobj.TotalInsurancePayment += Aitem.InsurancePaymentAmount || 0;
                            //}
                            console.log($scope.mainClaimObject.IsSecondaryChargeEditedClaim + "_IsSecondaryChargeEditedClaim");
                            if (!$scope.mainClaimObject.IsSecondaryChargeEditedClaim) {
                                Bitem.PreviousInsurancePaymentAmount = (Aitem.InsurancePaymentAmount || 0).toFixed(2);
                                Bitem.PreviousInsuranceAllowedAmount = Aitem.AllowedAmount || 0;
                                Bitem.PreviousInsuranceAdjustmentAmount = (Aitem.AdjustmentAmount || 0).toFixed(2);
                                Bitem.PreviousInsurancePRAmount = Aitem.PatientResponsibilityAmount || 0;
                                Bitem.PreviousInsuranceWriteOffAmount = Aitem.WriteOffAmount || 0;
                                Bitem.PreviousPatientPaymentAmount = (Aitem.PatientPaymentAmount || 0).toFixed(2);
                                Bitem.PreviousPatientBalanceAmount = Aitem.PatientBalance || 0;
                                Bitem.PreviousPaidAmount = Aitem.InsurancePaymentAmount + Aitem.PatientPaymentAmount;
                                Bitem.PreviousPaidAmount = (Bitem.PreviousPaidAmount || 0).toFixed(2);

                                $scope.mainClaimObject.TotalPreviousInsurancePaymentAmount += Aitem.InsurancePaymentAmount || 0;
                                $scope.mainClaimObject.TotalPreviousPatientPaymentAmount += Aitem.PatientPaymentAmount || 0;
                                $scope.mainClaimObject.TotalPreviousInsuranceAdjustmentAmount += Aitem.AdjustmentAmount || 0;
                            }
                          

                            //Newly added by durga as on 06-04-2026
                            $scope.mainClaimObject.TotalClaimAmount += Bitem.TotalChargeAmount || 0;

                        }
                    });
                });

            }

            if ($scope.ScreenType == 'Post' && filtredobj1[0].EraId != 0) {
                if ($scope.EOBClaimSummaryDetails.length > 0) {
                    angular.forEach($scope.EOBClaimSummaryDetails, function (item) {
                        if (item.EOBClaimInfoId === $scope.mainClaimObject.EOBClaimInfoId) {
                            item.IsSummaryInd = false;
                        }
                    });
                }
                
            }
            if (filtredobj1[0].EOBClaimLineItems.length > 0) {

                $scope.mainClaimObject.IsClaimEdit = true;
                $scope.mainClaimObject.IsPaidbyEdit = true;
                $scope.mainClaimObject.IsSecondaryInsuranceProcessed = true;
                $scope.mainClaimObject.IsCheckAllPayments = true;
                angular.forEach(filtredobj1[0].EOBClaimLineItems, function (sitem) {
                    // If any row is false, make overall false
                    if (!sitem.IsChecked) {
                        $scope.mainClaimObject.IsCheckAllPayments = false;
                    }
                });
                $scope.mainClaimObject.IsClearAction = true;
                filtredobj1[0].EraId = filtredobj1[0].EraId || 0;
                if ($scope.ScreenType == 'Post' && filtredobj1[0].EraId != 0) {
                    $scope.mainClaimObject.IsClaimEdit = false;
                    $scope.mainClaimObject.IsPaidbyEdit = false;                    
                }
                //$scope.mainClaimObject.PostingDate = $filter('date')(new Date(), "MM-dd-yyyy") || "";



                angular.forEach($scope.mainClaimObject.PatientClaimLineItems, function (item) {

                    item.IsCO24Ind = false;
                    item.TotalCO24AdjustmentAmount = 0;

                    var filtredobj2 = $filter("filter")(filtredobj1[0].EOBClaimLineItems, { "ClaimLineItemId": item.ClaimLineItemId }, true) || [];

                    if (filtredobj2.length > 0) {

                        filtredobj2[0].DOSfrom = filtredobj2[0].DOSfrom || null;
                        filtredobj2[0].DOSto = filtredobj2[0].DOSto || null;
                        var serviceDatefrom = null; var serviceDateTo = null;
                        if (filtredobj2[0].DOSfrom != null) {
                            serviceDatefrom = $filter("date")(item.DOSfrom, "MM-dd-yyyy");
                        }
                        if (filtredobj2[0].DOSto != null) {
                            serviceDateTo = $filter("date")(item.DOSto, "MM-dd-yyyy");
                        }

                        item.DOSfrom = serviceDatefrom || null;
                        item.DOSto = serviceDateTo || null;

                        //if ($scope.ScreenType == 'Post' && $scope.mainClaimObject.ERAPaidBy == '22') {
                        //    item.TotalChargeAmount = -(filtredobj2[0].TotalChargeAmount || 0);
                        //} else {
                        //    item.TotalChargeAmount = filtredobj2[0].TotalChargeAmount || 0;
                        //}
                        item.EOBLineItemId = filtredobj2[0].EOBLineItemId || 0;
                        item.UnitCharge = filtredobj2[0].UnitCharge || 0;
                        item.Quantity = filtredobj2[0].Quantity || "";
                        // item.DiagnosisList = filtredobj2[0].DiagnosisList || "";


                        item.TotalChargeAmount = filtredobj2[0].TotalChargeAmount || 0;
                        item.InsurancePaymentAmount = parseFloat(filtredobj2[0].PaymentAmount || 0).toFixed(2);
                        item.AllowedAmount = filtredobj2[0].AllowedAmount || 0;
                        item.CoPaymentAmount = filtredobj2[0].CoPaymentAmount || 0;
                        item.AdjustmentAmount = filtredobj2[0].AdjustmentAmount || 0;
                        item.DeductibleAmount = filtredobj2[0].DeductibleAmount || 0;
                        item.CoInsuranceAmount = filtredobj2[0].CoInsuranceAmount || 0;
                        item.PatientPaymentAmount = parseFloat(filtredobj2[0].PatientPaymentAmount || 0).toFixed(2);
                        item.WriteOffAmount = filtredobj2[0].WriteOffAmount || 0;
                        item.InsuranceBalance = filtredobj2[0].InsuranceBalance || 0;
                        //item.PatientBalance = parseFloat(filtredobj2[0].PatientBalance) + parseFloat(filtredobj2[0].PatientPaymentAmount) || 0;
                        item.PatientBalance = parseFloat(filtredobj2[0].PatientBalance) || 0;

                        item.CurrentPatientBalance = filtredobj2[0].PatientBalance || 0;
                        item.PatientResponsibilityAmount = filtredobj2[0].PatientResponsibility || 0;
                        item.PatientResponsibility = filtredobj2[0].PatientResponsibility || 0;;
                        // item.TotalBalance = filtredobj2[0].TotalBalance || 0;

                        item.DeleteInd = filtredobj2[0].DeleteInd || "N";
                        item.IsChecked = true;


                        if (item.PatientBalance != 0) {
                            item.IsPatientBalanceReceived = true;
                        }
                        if (item.PatientPaymentAmount != 0) {
                            item.IsPatientPaymentDone = true;
                        }
                        item.CurrentInsuranceBalance = (filtredobj2[0].InsuranceBalance || 0).toFixed(2);
                        item.CurrentPatientBalance = (filtredobj2[0].PatientBalance || 0).toFixed(2);


                        //lineItemObj.PreviousInsurancePaymentAmount = (item.InsurancePaymentAmount || 0).toFixed(2);
                        //lineItemObj.PreviousInsuranceAdjustmentAmount = (item.AdjustmentAmount || 0).toFixed(2);
                        //lineItemObj.PreviousInsurancePRAmount = item.PatientResponsibilityAmount || 0;

                        console.log($scope.mainClaimObject.IsSecondaryChargeEditedClaim + "_IsSecondaryChargeEditedClaim");
                        if (!$scope.mainClaimObject.IsSecondaryChargeEditedClaim) {
                            filtredobj2[0].PreviousInsurancePaymentAmount = filtredobj2[0].PreviousInsurancePaymentAmount || 0;
                            filtredobj2[0].PreviousInsuranceAdjustmentAmount = filtredobj2[0].PreviousInsuranceAdjustmentAmount || 0;
                            filtredobj2[0].PreviousInsurancePRAmount = filtredobj2[0].PreviousInsurancePRAmount || 0;

                            if (filtredobj2[0].PreviousInsurancePaymentAmount != 0) {
                                item.PreviousInsurancePaymentAmount = (filtredobj2[0].PreviousInsurancePaymentAmount || 0).toFixed(2);
                            }
                            if (filtredobj2[0].PreviousInsuranceAdjustmentAmount != 0) {
                                item.PreviousInsuranceAdjustmentAmount = (filtredobj2[0].PreviousInsuranceAdjustmentAmount || 0).toFixed(2);

                            }
                            if (filtredobj2[0].PreviousInsurancePRAmount != 0) {
                                item.PreviousInsurancePRAmount = filtredobj2[0].PreviousInsurancePRAmount || 0;
                            }
                            if (filtredobj2[0].PreviousInsuranceAllowedAmount != 0) {
                                item.PreviousInsuranceAllowedAmount = (filtredobj2[0].PreviousInsuranceAllowedAmount || 0).toFixed(2);
                            }

                            if (filtredobj2[0].PreviousInsuranceWriteOffAmount != 0) {
                                item.PreviousInsuranceWriteOffAmount = (filtredobj2[0].PreviousInsuranceWriteOffAmount || 0).toFixed(2);
                            }
                            if (filtredobj2[0].PreviousPatientPaymentAmount != 0) {
                                item.PreviousPatientPaymentAmount = (filtredobj2[0].PreviousPatientPaymentAmount || 0).toFixed(2);
                            }
                            if (filtredobj2[0].PreviousPatientBalanceAmount != 0) {
                                item.PreviousPatientBalanceAmount = (filtredobj2[0].PreviousPatientBalanceAmount || 0).toFixed(2);
                            }
                        }

                        //item.PreviousInsuranceAllowedAmount = filtredobj2[0].PreviousInsuranceAllowedAmount || 0;
                        //item.PreviousInsuranceWriteOffAmount = filtredobj2[0].PreviousInsuranceWriteOffAmount || 0;
                        //item.PreviousPatientPaymentAmount = (filtredobj2[0].PreviousPatientPaymentAmount || 0).toFixed(2);
                        //item.PreviousPatientBalanceAmount = filtredobj2[0].PreviousPatientBalanceAmount || 0;

                       


                        item.TotalBalance = item.TotalChargeAmount - (item.InsurancePaymentAmount + item.AdjustmentAmount + item.WriteOffAmount + item.PatientResponsibilityAmount + item.PreviousInsurancePaymentAmount + item.PreviousInsuranceAdjustmentAmount + item.PreviousInsuranceWriteOffAmount + item.PreviousPatientPaymentAmount);


                        $scope.mainClaimObject.TotalPreviousInsurancePaymentAmount += filtredobj2[0].InsurancePaymentAmount || 0;
                        $scope.mainClaimObject.TotalPreviousPatientPaymentAmount += filtredobj2[0].PatientPaymentAmount || 0;
                        $scope.mainClaimObject.TotalPreviousInsuranceAdjustmentAmount += filtredobj2[0].AdjustmentAmount || 0;

                        item.PreviousPaidAmount = filtredobj2[0].InsurancePaymentAmount + filtredobj2[0].PatientPaymentAmount;
                        item.PreviousPaidAmount = (item.PreviousPaidAmount || 0).toFixed(2);

                        if (filtredobj2[0].InsuranceBalance != 0) {
                            item.CurrentTotalBalance = filtredobj2[0].InsuranceBalance || 0;
                        } else {
                            item.CurrentTotalBalance = filtredobj2[0].TotalChargeAmount || 0;
                        }

                        item.CurrentAllowedAmount = null;
                        item.CurrentInsurancePaymentAmount = null;
                        item.CurrentDeductibleAmount = null;
                        item.CurrentCoInsuranceAmount = null;
                        item.CurrentCoPaymentAmount = null;
                        item.CurrentPatientResponsibilityAmount = null;
                        item.CurrentServiceAdjustmentAmount = null;
                        item.CurrentWriteOffAmount = null;
                        item.ServiceAdjustments = filtredobj2[0].ServiceAdjustments || [];

                        item.CurrentInsurancePaymentAmount = filtredobj2[0].PaymentAmount || null;
                        item.CurrentAllowedAmount = filtredobj2[0].AllowedAmount || null;
                        item.CurrentCoPaymentAmount = filtredobj2[0].CoPaymentAmount || null;
                        item.CurrentAdjustmentAmount = filtredobj2[0].AdjustmentAmount || null;
                        item.CurrentDeductibleAmount = filtredobj2[0].DeductibleAmount || null;
                        item.CurrentCoInsuranceAmount = filtredobj2[0].CoInsuranceAmount || null;
                        item.CurrentPatientPaymentAmount = filtredobj2[0].PatientPaymentAmount || null;
                        item.CurrentWriteOffAmount = filtredobj2[0].InsuranceWriteOff || null;
                        item.CurrentInsuranceBalance = filtredobj2[0].InsuranceBalance || null;
                        item.CurrentPatientBalance = filtredobj2[0].PatientBalance || null;
                        item.CurrentPatientResponsibilityAmount = filtredobj2[0].PatientResponsibility || null;
                        // item.CurrentTotalBalance = filtredobj2[0].TotalBalance || 0;


                        var TotalChargeAmount = parseFloat(item.TotalChargeAmount) || 0;
                        var WriteOffAmt = parseFloat(item.CurrentWriteOffAmount) || 0;
                        var CurrentPaymentAmount = parseFloat(item.CurrentInsurancePaymentAmount) || 0;
                        var PatientPaymentAmount = parseFloat(item.CurrentPatientPaymentAmount) || 0;
                        var PatientBalance = parseFloat(item.CurrentPatientBalance) || 0;
                        var AdjustmentReasonAmount = parseFloat(item.CurrentAdjustmentAmount) || 0;


                        item.PreviousInsurancePaymentAmount = item.PreviousInsurancePaymentAmount || 0;
                        item.PreviousInsuranceAdjustmentAmount = item.PreviousInsuranceAdjustmentAmount || 0;
                        item.PreviousInsuranceWriteOffAmount = item.PreviousInsuranceWriteOffAmount || 0;
                        item.PreviousPatientPaymentAmount = item.PreviousPatientPaymentAmount || 0;

                        var PreviousInsurancePaymentAmount = parseFloat(item.PreviousInsurancePaymentAmount) || 0;
                        var PreviousInsuranceAdjustmentAmount = parseFloat(item.PreviousInsuranceAdjustmentAmount) || 0;
                        var PreviousInsuranceWriteOffAmount = parseFloat(item.PreviousInsuranceWriteOffAmount) || 0;
                        var PreviousPatientPaymentAmount = parseFloat(item.PreviousPatientPaymentAmount) || 0;



                        if ($scope.mainClaimObject.ERAPaidBy === "2" || $scope.mainClaimObject.ERAPaidBy === "3" || $scope.mainClaimObject.ERAPaidBy === "20" || $scope.mainClaimObject.ERAPaidBy === "21") {
                            if (AdjustmentReasonAmount > 0 && PreviousInsuranceAdjustmentAmount > 0) {
                                PreviousInsuranceAdjustmentAmount = 0;
                            }
                        }
                        var isPrimaryInsPayment = true;
                        if ($scope.mainClaimObject.ERAPaidBy == '2' || $scope.mainClaimObject.ERAPaidBy == '3') {
                            isPrimaryInsPayment = false;
                        }

                        if (!isPrimaryInsPayment) {
                            if ($scope.mainClaimObject.ERAPaidBy == '22') {
                                item.CurrentTotalBalance = TotalChargeAmount + (PatientPaymentAmount + CurrentPaymentAmount + AdjustmentReasonAmount +
                                    PreviousInsurancePaymentAmount + PreviousInsuranceAdjustmentAmount + PreviousPatientPaymentAmount);
                            }
                            else {
                                item.CurrentTotalBalance = TotalChargeAmount - (PatientPaymentAmount + CurrentPaymentAmount + AdjustmentReasonAmount +
                                    PreviousInsurancePaymentAmount + PreviousInsuranceAdjustmentAmount + PreviousPatientPaymentAmount);
                            }                 

                        } else {
                            if ($scope.mainClaimObject.ERAPaidBy == '22') {
                               // item.CurrentTotalBalance = TotalChargeAmount + (CurrentPaymentAmount + AdjustmentReasonAmount + PatientPaymentAmount);
                                if (PatientPaymentAmount > 0) {
                                    item.CurrentTotalBalance = TotalChargeAmount + (CurrentPaymentAmount + AdjustmentReasonAmount + PatientPaymentAmount + PatientBalance);

                                }
                                else {
                                    item.CurrentTotalBalance = TotalChargeAmount + (CurrentPaymentAmount + AdjustmentReasonAmount + PatientBalance);

                                }

                            }
                            else {
                                item.CurrentTotalBalance = TotalChargeAmount - (CurrentPaymentAmount + AdjustmentReasonAmount + PatientPaymentAmount);

                            }

            

                        }


                        item.CurrentTotalBalance = parseFloat(item.CurrentTotalBalance.toFixed(2));

                        var temptotalAdjamount = 0;
                        //var pr3WriteOffAmount = 0;
                        if (item.ServiceAdjustments.length > 0) {

                            angular.forEach(item.ServiceAdjustments, function (aitem) {
                                aitem.AdjsutmentDescription = aitem.AdjsutmentDescription || "";
                                aitem.ActiveInd = "Y";
                                aitem.DeleteInd = "N";

                                if (aitem.AdjsutmentDescription !== "") {
                                    if (!aitem.AdjsutmentDescription.startsWith(aitem.GroupCode + "-")) {
                                        aitem.AdjsutmentDescription = aitem.GroupCode + '-' + aitem.AdjsutmentDescription;
                                    }
                                    var desc = aitem.AdjsutmentDescription;

                                    if (typeof aitem.AdjustmentAmount === "string") {
                                        aitem.AdjustmentAmount = Math.round(parseFloat(aitem.AdjustmentAmount) * 100) / 100;
                                    }
                                    if (!tempadjustmentMap[desc]) {
                                        tempadjustmentMap[desc] = angular.copy(aitem);
                                    } else {
                                        tempadjustmentMap[desc].AdjustmentAmount += aitem.AdjustmentAmount;
                                    }
                                }

                                aitem.AdjustmentAmount = aitem.AdjustmentAmount || null;
                                if (aitem.AdjustmentAmount != null) {
                                    aitem.AdjustmentAmount = parseFloat(aitem.AdjustmentAmount).toFixed(2);
                                    var tempAdjAmount = parseFloat(aitem.AdjustmentAmount) || 0;
                                    temptotalAdjamount += tempAdjAmount;
                                }
                                //if (aitem.AdjustmentReasonId === 3 && aitem.GroupCode === "PR")
                                //{
                                //    var woAmt = aitem.AdjustmentAmount || 0;

                                //    if (typeof woAmt === "string") {
                                //        woAmt = parseFloat(woAmt);
                                //    }

                                //    pr3WriteOffAmount += woAmt;
                                //}


                                if (aitem.GroupCode === "CO" && aitem.AdjustmentReasonCode == "24") {
                                    item.IsCO24Ind = true;
                                    item.TotalCO24AdjustmentAmount += parseFloat(aitem.AdjustmentAmount || 0);
                                }

                            });

                            angular.forEach(tempadjustmentMap, function (aitem) {
                                $scope.mainClaimObject.AllServiceAdjustmentsList.push(aitem);
                            });

                            $scope.mainClaimObject.AllServiceAdjustmentsList = _.uniq($scope.mainClaimObject.AllServiceAdjustmentsList, false, function (p) { return p.AdjsutmentDescription; });

                        }
                        else {
                            let obj = {
                                "AdjustmentId": 0,
                                "EOBLineItemId": item.EOBLineItemId || 0,
                                "ClaimLineItemId": item.ClaimLineItemId || "",
                                "AdjustmentReasonCode": '0',
                                "AdjsutmentDescription": '',
                                "GroupCode": '',
                                "AdjustmentReasonId": null,
                                "AdjustmentAmount": null,
                                "PayorPostingStatusId": 2,
                                "PayorPostingStatus": 'Transfer',
                                "Notes": "",
                                "DeleteInd": "N",
                                "ActiveInd": "Y",
                            }
                            item.ServiceAdjustments.push(obj);
                        }

                        item.CurrentServiceAdjustmentAmount = temptotalAdjamount.toFixed(2);
                        // item.CurrentWriteOffAmount = (parseFloat(item.CurrentWriteOffAmount) || 0)+ pr3WriteOffAmount;

                        $scope.mainClaimObject.TotalPatientBalance += item.PatientBalance || 0;
                        $scope.mainClaimObject.TotalPatientPayment += parseFloat(item.PatientPaymentAmount) || 0;
                        $scope.mainClaimObject.TotalPatientResponsibilityAmount += item.PatientResponsibility || 0;
                        //$scope.Patientobj.TotalPatientResponsibilityAmount += item.PatientResponsibility || 0;
                        $scope.mainClaimObject.TotalBalance += item.CurrentTotalBalance || 0;
                        $scope.mainClaimObject.TotalInsuranceBalance += item.CurrentInsuranceBalance || 0;

                        item.TotalCO24AdjustmentAmount = parseFloat((item.TotalCO24AdjustmentAmount).toFixed(2));

                        //Newly added by durga as on 06-04-2026
                        $scope.mainClaimObject.TotalClaimAmount += TotalChargeAmount || 0;

                        //if (mainEOBPaymentPostingObj.ProcessingTypeId==3) {
                        //    if (item.IsCO24Ind === true && item.TotalCO24AdjustmentAmount > 0) {

                        //        var chargeAmount = parseFloat(item.TotalChargeAmount || 0);
                        //        var co24Amount = parseFloat(item.TotalCO24AdjustmentAmount || 0);
                        //        var discountPct = parseFloat($scope.Payorpercentage);

                        //        // ── Formula ───────────────────────────────────────
                        //        // DiscountAmount   = CO24Amount * DiscountPct / 100
                        //        // InsurancePaid    = ChargeAmount - DiscountAmount
                        //        // WriteOff         = DiscountAmount
                        //        // InsuranceBalance = DiscountAmount
                        //        // AllowedAmount    = ChargeAmount  (full charge)
                        //        // TotalBalance     = DiscountAmount

                        //        var discountAmount = parseFloat(((co24Amount * discountPct) / 100).toFixed(2));
                        //        var insurancePaid = parseFloat((co24Amount - discountAmount).toFixed(2));
                        //        var writeOff = discountAmount;
                        //        var insBalance = discountAmount;

                        //        // ── Override EOB values with capitation calc ──────
                        //        item.DiscountAmount = discountAmount;
                        //        item.TotalBalance = discountAmount;
                        //        item.WriteOffAmount = writeOff;
                        //        //  Aitem.InsuranceBalance = insBalance;
                        //        item.AllowedAmount = parseFloat(chargeAmount.toFixed(2));
                        //        item.InsurancePaymentAmount = insurancePaid;







                        //        var templist = $filter("filter")($scope.PaymentReasonList, { "AdjustmentReasonCode": '151' }, true) || [];
                        //        // if (Aitem.ServiceAdjustments.length == 0) {
                        //        let obj = {
                        //            "AdjustmentId": 0,
                        //            "EOBLineItemId": item.EOBLineItemId || 0,
                        //            "ClaimLineItemId": item.ClaimLineItemId || "",
                        //            "AdjustmentReasonCode": templist[0].AdjustmentReasonCode,
                        //            "AdjsutmentDescription": templist[0].AdjsutmentDescription,
                        //            "GroupCode": templist[0].GroupCode || '',
                        //            "AdjustmentReasonId": templist[0].AdjustmentReasonId,
                        //            "AdjustmentAmount": item.WriteOffAmount || null,
                        //            "PayorPostingStatusId": 1,
                        //            "PayorPostingStatus": 'Adjustment',
                        //            "Notes": "",
                        //            "DeleteInd": "N",
                        //            "ActiveInd": "Y",
                        //        }
                        //        item.ServiceAdjustments.push(obj);
                        //        // }

                        //        console.log('── CO-24 Capitation Calc ─────────────────────');
                        //        console.log('Claim Line     : ' + item.ClaimLineItemId);
                        //        console.log('ServiceCode    : ' + item.ServiceCode);
                        //        console.log('ChargeAmount   : $' + chargeAmount);
                        //        console.log('CO24 Amount    : $' + co24Amount);
                        //        console.log('Discount %     : ' + discountPct + '%');
                        //        console.log('Discount Amt   : $' + discountAmount);
                        //        console.log('Insurance Paid : $' + insurancePaid);
                        //        console.log('Write-Off      : $' + writeOff);
                        //        console.log('Ins. Balance   : $' + insBalance);
                        //        console.log('─────────────────────────────────────────────');

                        //    }
                        //}




                    }
                    else {
                        item.IsChecked = false;
                    }
                });


               

                if (mainEOBPaymentPostingObj.ProcessingTypeId == 3 && $scope.ScreenType == 'Post') {
                    $scope.Capitationfilter = $filter("filter")($scope.CapitationList[0].PayorBillingProvider, function (fitem, index) { return fitem.RenderingProviderId === $scope.mainClaimObject.RenderingProviderId }, true) || [];
                    var monthNames = [
                        'january', 'february', 'march', 'april',
                        'may', 'june', 'july', 'august',
                        'september', 'october', 'november', 'december'
                    ];

                    // ── Get month from ClaimDate ──────────────────────
                    var claimDate = new Date($scope.mainClaimObject.ClaimDate);
                    var claimMonthIdx = claimDate.getMonth();          // 0-11
                    var claimMonthName = monthNames[claimMonthIdx]
                    var pctKey = claimMonthName + 'percentage';
                    var effKey = claimMonthName + 'effectiveDate';

                    // ── Monthly capitation amount key ─────────────────
                    // e.g. "totalDecemberAmount"
                    var monthCapKey = 'total'
                        + claimMonthName.charAt(0).toUpperCase()
                        + claimMonthName.slice(1)
                        + 'Amount';
                    if ($scope.Capitationfilter.length > 0) {
                        $scope.Payorpercentage = parseFloat($scope.Capitationfilter[0][pctKey] || 0);
                        $scope.PayoreffectiveDate = $scope.Capitationfilter[0][effKey] || null;
                        $scope.MonthlyCapAmount = parseFloat($scope.CapitationList[0][monthCapKey] || 0);
                        $scope.mainClaimObject.CapitationPercentage = $scope.Payorpercentage
                    }
                    let TotalPaymentAmount = 0;
                    let TotalwriteOff = 0;
                    let TotalAdjustmentAmount = 0;
                    angular.forEach($scope.mainClaimObject.PatientClaimLineItems, function (item) {
                        let temptotalAdjamount = 0;
                        let co24Amount = 0;
                        angular.forEach(item.ServiceAdjustments, function (adj) {
                            if (adj.GroupCode === "CO" && adj.AdjustmentReasonCode == "24") {
                                adj.DeleteInd = "Y";
                                adj.ActiveInd = "N";
                                co24Amount = parseFloat(adj.AdjustmentAmount).toFixed(2);
                            } else {
                                adj.AdjustmentAmount = parseFloat(adj.AdjustmentAmount).toFixed(2);
                                var tempAdjAmount = parseFloat(adj.AdjustmentAmount) || 0;
                                temptotalAdjamount += tempAdjAmount;
                            }
                        });

                        var chargeAmount = parseFloat(item.TotalChargeAmount || 0);
                        var discountPct = parseFloat($scope.Payorpercentage);
                        var discountAmount = parseFloat(((co24Amount * discountPct) / 100).toFixed(2));
                        var insBalance = parseFloat((co24Amount - discountAmount).toFixed(2));
                        var writeOff = insBalance;
                        var insurancePaid = discountAmount;
                        item.CurrentWriteOffAmount = writeOff;
                        item.CurrentInsurancePaymentAmount = discountAmount;
                        item.CurrentTotalBalance = 0;

                        var templist = $filter("filter")($scope.PaymentReasonList, { "AdjustmentReasonCode": '151' }, true) || [];
                        // if (Aitem.ServiceAdjustments.length == 0) {
                        let obj = {
                            "AdjustmentId": 0,
                            "EOBLineItemId": item.EOBLineItemId || 0,
                            "ClaimLineItemId": item.ClaimLineItemId || "",
                            "AdjustmentReasonCode": templist[0].AdjustmentReasonCode,
                            "AdjsutmentDescription": templist[0].AdjsutmentDescription,
                            "GroupCode": templist[0].GroupCode || '',
                            "AdjustmentReasonId": templist[0].AdjustmentReasonId,
                            "AdjustmentAmount": item.CurrentWriteOffAmount || null,
                            "PayorPostingStatusId": 1,
                            "PayorPostingStatus": 'Adjustment',
                            "Notes": "",
                            "DeleteInd": "N",
                            "ActiveInd": "Y",
                        }
                        item.ServiceAdjustments.push(obj);
                        temptotalAdjamount += writeOff;
                        item.CurrentServiceAdjustmentAmount = temptotalAdjamount.toFixed(2);
                        let AdjustmentAmount = 0;
                        angular.forEach(item.ServiceAdjustments, function (adj) {
                            adj.AdjustmentAmount = parseFloat(adj.AdjustmentAmount).toFixed(2);
                            // Only sum active, non-deleted adjustments
                            if (adj.AdjustmentReasonCode != "24") {
                                var tempAdjAmount = parseFloat(adj.AdjustmentAmount) || 0;
                                AdjustmentAmount += tempAdjAmount;
                                
                            }
                        });
                        item.CurrentAdjustmentAmount = AdjustmentAmount;
                        TotalAdjustmentAmount += AdjustmentAmount;                  
                        TotalwriteOff += writeOff;
                        TotalPaymentAmount += discountAmount;
                    });

                    $scope.mainClaimObject.TotalAdjustmentAmount = TotalAdjustmentAmount || 0;
                    $scope.mainClaimObject.TotalWriteOffAmount = TotalwriteOff || 0;
                    $scope.mainClaimObject.TotalInsurancePayment = TotalPaymentAmount || 0;
                   
                }
                if (mainEOBPaymentPostingObj.ProcessingTypeId == 3) {
                    let TotalAdjustmentAmount = 0;
                    angular.forEach($scope.mainClaimObject.PatientClaimLineItems, function (item) {
                        TotalAdjustmentAmount += item.AdjustmentAmount || 0;
                    });
                    $scope.Patientobj.TotalAdjustmentAmount = TotalAdjustmentAmount || 0;
                }

                //if (mainEOBPaymentPostingObj.ProcessingTypeId == 3) {                   

                //    $scope.Payorpercentage = 0;
                //    $scope.PayoreffectiveDate = null;
                //    $scope.MonthlyCapAmount = 0;
                //    $scope.TotalPostedCapitationAmount = 0;  // running total for pool check

                //    if ($scope.CapitationList && $scope.CapitationList.length > 0) {

                //        var monthNames = [
                //            'january', 'february', 'march', 'april',
                //            'may', 'june', 'july', 'august',
                //            'september', 'october', 'november', 'december'
                //        ];

                //        var claimDate = new Date($scope.mainClaimObject.ClaimDate);
                //        var claimMonthIdx = claimDate.getMonth();   // 0 = Jan ... 11 = Dec
                //        var claimMonthName = monthNames[claimMonthIdx];
                //        var pctKey = claimMonthName + 'percentage';
                //        var effKey = claimMonthName + 'effectiveDate';
                //        var monthCapKey = 'total'
                //            + claimMonthName.charAt(0).toUpperCase()
                //            + claimMonthName.slice(1)
                //            + 'Amount';   // e.g. "totalJanuaryAmount"

                //        // Filter capitation contract by RenderingProvider (fix: RenderingProviderId now set above)
                //        $scope.Capitationfilter = $filter("filter")(
                //            $scope.CapitationList[0].PayorBillingProvider,
                //            function (fitem) {
                //                return fitem.RenderingProviderId == $scope.mainClaimObject.RenderingProviderId;
                //            },
                //            true
                //        ) || [];

                //        if ($scope.Capitationfilter.length > 0) {
                //            $scope.Payorpercentage = parseFloat($scope.Capitationfilter[0][pctKey] || 0);
                //            $scope.PayoreffectiveDate = $scope.Capitationfilter[0][effKey] || null;
                //        }

                //        $scope.MonthlyCapAmount = parseFloat($scope.CapitationList[0][monthCapKey] || 0);
                //    }

                //    angular.forEach($scope.mainClaimObject.PatientClaimLineItems, function (item) {

                //        item.IsDomiVoucherRequired = false;
                //        item.IsCapitationDenial = false;

                //        if (!item.IsCO24Ind || item.TotalCO24AdjustmentAmount <= 0) return;

                //        // ── RULE A: Exception check — other CO adj > $5 → denial ───────────
                //        var otherCOAdjTotal = 0;
                //        angular.forEach(item.ServiceAdjustments, function (adj) {
                //            if (adj.DeleteInd !== "Y"
                //                && adj.GroupCode === "CO"
                //                && adj.AdjustmentReasonCode != "24") {
                //                otherCOAdjTotal += parseFloat(adj.AdjustmentAmount || 0);
                //            }
                //        });

                //        if (otherCOAdjTotal > 5) {
                //            item.IsCapitationDenial = true;
                //            item.IsCO24Ind = false;  // remove from capitation path
                //            console.warn('Capitation EXCEPTION (Denial): ' + item.ServiceCode
                //                + ' — other CO adj total: $' + otherCOAdjTotal);
                //            return;
                //        }

                //        // ── RULE B & C: Check DOS month ─────────────────────────────────────
                //        var dosMonthIdx = null;
                //        if (item.DOSfrom) {
                //            var dosDate = new Date(item.DOSfrom);
                //            if (!isNaN(dosDate.getTime())) {
                //                dosMonthIdx = dosDate.getMonth();  // 0 = Jan, 1 = Feb ...
                //            }
                //        }

                //        if (dosMonthIdx === 0 || dosMonthIdx === 1) {
                //            // RULE B: January or February DOS → must go to Domi Voucher
                //            item.IsDomiVoucherRequired = true;
                //            item.IsCO24Ind = false;  // block from direct capitation posting
                //            console.warn('Capitation DOMI VOUCHER required: ' + item.ServiceCode
                //                + ' — DOS month: ' + (dosMonthIdx + 1));
                //        } else {
                //            // RULE C: March or later → allowed to post directly
                //            console.log('Capitation POSTING allowed: ' + item.ServiceCode
                //                + ' — DOS month: ' + (dosMonthIdx !== null ? dosMonthIdx + 1 : 'unknown'));
                //        }
                //    });


                //    // ── STEP 3: Apply capitation math to eligible lines ─────────────────────
                //    // Only lines where IsCO24Ind is still true (not cleared by Rules A or B)

                //    angular.forEach($scope.mainClaimObject.PatientClaimLineItems, function (item) {

                //        if (item.IsCO24Ind !== true || item.TotalCO24AdjustmentAmount <= 0) return;

                //        var chargeAmount = parseFloat(item.TotalChargeAmount || 0);
                //        var co24Amount = parseFloat(item.TotalCO24AdjustmentAmount || 0);
                //        var discountPct = parseFloat($scope.Payorpercentage) || 0;

                //        var discountAmount = parseFloat(((co24Amount * discountPct) / 100).toFixed(2));
                //        var insurancePaid = parseFloat((co24Amount - discountAmount).toFixed(2));
                //        var writeOff = discountAmount;

                //        // ── Override EOB amounts with capitation-calculated values ───────────
                //        item.DiscountAmount = discountAmount;
                //        item.TotalBalance = discountAmount;
                //        item.WriteOffAmount = writeOff;
                //        item.AllowedAmount = parseFloat(chargeAmount.toFixed(2));
                //        item.InsurancePaymentAmount = insurancePaid;

                //        // ── FIX 1: Mark CO-24 as deleted from ServiceAdjustments ────────────
                //        // Its amount is now split into insurancePaid + writeOff.
                //        // Keeping it would double-count in calculateClaimLineItemsNew.
                //        angular.forEach(item.ServiceAdjustments, function (adj) {
                //            if (adj.GroupCode === "CO" && adj.AdjustmentReasonCode == "24") {
                //                adj.DeleteInd = "Y";
                //                adj.ActiveInd = "N";
                //            }
                //        });

                //        // ── FIX 2: Push CO-151 write-off with correct active flags ───────────
                //        var templist = $filter("filter")(
                //            $scope.PaymentReasonList,
                //            { "AdjustmentReasonCode": '151' },
                //            true
                //        ) || [];

                //        if (templist.length > 0) {
                //            var co151obj = {
                //                "AdjustmentId": 0,
                //                "EOBLineItemId": item.EOBLineItemId || 0,
                //                "ClaimLineItemId": item.ClaimLineItemId || "",
                //                "AdjustmentReasonCode": templist[0].AdjustmentReasonCode,
                //                "AdjsutmentDescription": templist[0].AdjsutmentDescription,
                //                "GroupCode": templist[0].GroupCode || '',
                //                "AdjustmentReasonId": templist[0].AdjustmentReasonId,
                //                "AdjustmentAmount": writeOff,
                //                "PayorPostingStatusId": 1,
                //                "PayorPostingStatus": 'Adjustment',
                //                "Notes": "",
                //                "DeleteInd": "N",   // FIX: was "Y"
                //                "ActiveInd": "Y",   // FIX: was "N"
                //            };
                //            item.ServiceAdjustments.push(co151obj);
                //        }

                //        // ── FIX 3: Set Current* fields so UI and totals reflect capitation ───
                //        item.CurrentAllowedAmount = item.AllowedAmount;
                //        item.CurrentInsurancePaymentAmount = item.InsurancePaymentAmount;
                //        item.CurrentWriteOffAmount = item.WriteOffAmount;

                //        // ── Accumulate for pool limit check ──────────────────────────────────
                //        $scope.TotalPostedCapitationAmount += insurancePaid;

                //        console.log('── Capitation Applied ────────────────────────────');
                //        console.log('  Line     : ' + item.ServiceCode + ' (' + item.ClaimLineItemId + ')');
                //        console.log('  Charge   : $' + chargeAmount);
                //        console.log('  CO-24    : $' + co24Amount);
                //        console.log('  Discount : ' + discountPct + '% = $' + discountAmount);
                //        console.log('  Ins Paid : $' + insurancePaid);
                //        console.log('  Write-Off: $' + writeOff);
                //        console.log('─────────────────────────────────────────────────');
                //    });


                //    // ── STEP 4: Monthly cap pool limit alert ────────────────────────────────
                //    if ($scope.MonthlyCapAmount > 0) {
                //        var totalPosted = parseFloat($scope.TotalPostedCapitationAmount.toFixed(2));
                //        var poolLimit = parseFloat($scope.MonthlyCapAmount.toFixed(2));

                //        console.log('Capitation Pool — Posted: $' + totalPosted + ' | Limit: $' + poolLimit);

                //        if (totalPosted > poolLimit) {
                //            alertify.warning(
                //                'Capitation Pool Exceeded!\n'
                //                + 'Total posted this session : $' + totalPosted.toFixed(2) + '\n'
                //                + 'Monthly cap pool           : $' + poolLimit.toFixed(2) + '\n'
                //                + 'Excess                     : $' + (totalPosted - poolLimit).toFixed(2)
                //            );
                //        }
                //    }

                //}

            }

            $scope.ERAPaidByDenial = 0;
            if (filtredobj1[0].ERAPaidBy === 4) {
                $scope.ERAPaidByDenial = filtredobj1[0].ERAPaidBy || "";
            }
        }
        $scope.init();

        /* Posting New Restructure - End */


        $scope.openDenailCodesPopup = function (item) {
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/DenialCodesPopup.html",
                //"size": "lg",
                "backdrop": "static",
                "keyboard": false,
                "scope": $scope,
                "windowClass": "offcanves-right width-50 left-auto right-0  ",
                "controller": function ($scope, $uibModal, $uibModalInstance) {
                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };

                    $scope.isApplyForAllLineItems = false;
                    $scope.Searchtxt = "";

                    $scope.SearchDenialCodes = function (text) {
                        $timeout(function () {
                            if (text === "" || text === undefined) {
                                $scope.DenialCodesArray = angular.copy($scope.filteredDenialCodesArray);
                            } else {
                                $scope.DenialCodesArray = $filter("filter")($scope.filteredDenialCodesArray, { "DenialCode": text }) || [];
                            }
                        }, 50);
                    }

                    $scope.selectedDenialCodesArray = [];


                    $scope.saveDenialCodes = function (val) {

                        $scope.selectedDenialCodesArray = [];

                        angular.forEach($scope.DenialCodesArray, function (mitem) {
                            if (mitem.IsSelected) {
                                var obj = {
                                    "DenialId": mitem.DenialId || 0,
                                    "EOBLineItemId": mitem.EOBLineItemId || 0,
                                    "ClaimLineItemId": mitem.ClaimLineItemId || 0,
                                    "DenialCode": mitem.DenialCode,
                                    "DenialCodeDescription": mitem.DenialCodeDescription,
                                    "DeleteInd": "N"
                                };
                                $scope.selectedDenialCodesArray.push(obj);
                            }
                            mitem.DenialId = mitem.DenialId || 0;
                            if (!mitem.IsSelected && mitem.DenialId != 0) {
                                var obj = {
                                    "DenialId": mitem.DenialId || 0,
                                    "EOBLineItemId": mitem.EOBLineItemId || 0,
                                    "ClaimLineItemId": mitem.ClaimLineItemId || 0,
                                    "DenialCode": mitem.DenialCode,
                                    "DenialCodeDescription": mitem.DenialCodeDescription,
                                    "DeleteInd": "Y"
                                };
                                $scope.selectedDenialCodesArray.push(obj);
                            }
                        });

                        var obj = {
                            "status": "save",
                            "ApplyAllInd": val,
                            "selectedDenialCodes": $scope.selectedDenialCodesArray
                        }
                        $uibModalInstance.close(obj);
                    };

                    $scope.clearDenialCode = function () {
                        angular.forEach($scope.DenialCodesArray, function (ditem) {
                            ditem.IsSelected = false;
                        });
                    }

                    item.DenialCodes = item.DenialCodes || [];
                    if (item.DenialCodes.length > 0) {
                        angular.forEach($scope.DenialCodesArray, function (ditem) {
                            let filterArray = $filter("filter")(item.DenialCodes, { "DenialCode": ditem.DenialCode }, true) || [];
                            if (filterArray.length > 0) {
                                ditem.IsSelected = true;
                                ditem.ClaimLineItemId = filterArray[0].ClaimLineItemId;
                                ditem.DenialId = filterArray[0].DenialId;
                                ditem.EOBLineItemId = filterArray[0].EOBLineItemId;
                            }
                        });
                    } else {
                        angular.forEach($scope.DenialCodesArray, function (ditem) {
                            ditem.IsSelected = false;
                            ditem.ClaimLineItemId = 0;
                            ditem.DenialId = 0;
                            ditem.EOBLineItemId = 0;
                        });
                    }
                }
            });

            mInstanceAdd.result.then(function (resp) {
                console.log(resp);
                if (resp.status == 'save') {
                    item.DenialCodes = [];
                    var DenialCodePointers = "";
                    angular.forEach(resp.selectedDenialCodes, function (citem, index) {
                        citem.DeleteInd = citem.DeleteInd || "N";
                        if (citem.DeleteInd == "N") {
                            if (index === 0) {
                                DenialCodePointers = citem.DenialCode
                            } else {
                                DenialCodePointers += "," + citem.DenialCode
                            }
                        }
                    });

                    if (resp.ApplyAllInd) {

                        angular.forEach($scope.mainClaimObject.PatientClaimLineItems, function (mitem) {
                            mitem.DenialCodePointers = DenialCodePointers;
                            mitem.DenialCodes = [];
                            angular.forEach(resp.selectedDenialCodes, function (citem, index) {
                                var objj = {
                                    "DenialId": citem.DenialId || 0,
                                    "EOBLineItemId": citem.EOBLineItemId || 0,
                                    "ClaimLineItemId": mitem.ClaimLineItemId || 0,
                                    "DenialCode": citem.DenialCode,
                                    "DenialCodeDescription": citem.DenialCodeDescription,
                                    "DeleteInd": citem.DeleteInd || "N",
                                };
                                mitem.DenialCodes.push(objj);
                            });
                        });
                    } else {
                        item.DenialCodePointers = DenialCodePointers;
                        angular.forEach(resp.selectedDenialCodes, function (citem, index) {
                            var objj = {
                                "DenialId": citem.DenialId || 0,
                                "EOBLineItemId": citem.EOBLineItemId || 0,
                                "ClaimLineItemId": item.ClaimLineItemId || 0,
                                "DenialCode": citem.DenialCode,
                                "DenialCodeDescription": citem.DenialCodeDescription,
                                "DeleteInd": citem.DeleteInd || "N",
                            };
                            item.DenialCodes.push(objj);
                        });
                    }




                }
            }, function (cancel) {
            });
        };


        $scope.navtoDenailReviewandAppealPopUP = function (item, type) {

            type = type || '';
            var Obj = {
                "PostingPaymentData": item,
                "mainEOBPaymentPostingObj": mainEOBPaymentPostingObj,
                "AppointmentTypeId": mainObject.AppointmentTypeId || null,
                "IsFrom": ""
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
                /* $uibModalInstance.dismiss("cancel");*/

                if (type == 'Denial') {
                    $uibModalInstance.close("Denial");
                } else {
                    $scope.mainClaimObject.IsClaimEdit = true;

                    angular.forEach($scope.EOBClaimSummaryDetails, function (item) {
                        item.IsSummaryInd = true;
                    })
                }

            }, function () { });
        }




        $scope.SearchCPTRateFeePopUp = function (item, mainObj) {
            $scope.selectedpayor = {
                "OrganizationPayorId": mainObj.OrganizationPayorId,
                "PayorName": mainObj.PayorName,
                "ProcedureName": item.ServiceName,
                "ProcedureId": item.ServiceId,
                "CPTCode": item.ServiceCode,
                "OrganizationProcedureId": item.OrganizationProcedureId || null,
                "ClaimLineItemId": item.ClaimLineItemId,
            }
            var req = {
                "OrganizationId": $scope.HospitalId,
                "OrganizationPayorId": mainObj.OrganizationPayorId,
                //  "OrganizationPayorId": 7874,
                "CPTCODE": item.ServiceCode || "",
                "ProcedureName": item.ServiceName || "",
                "PageNumber": 1,
                "PageSize": 10,
                "Status": 0
            };

            eHnoteSettingsDataService.GetOrganizationPayorProcedureFees(req).then(function (response) {
                if (response.data.Status === "Success") {
                    $scope.RateList = response.data.rows;
                    if ($scope.RateList.length > 0) {
                        $scope.AddCreateFeePopUp($scope.RateList[0]);
                    } else {
                        $scope.AddCreateFeePopUp($scope.selectedpayor);
                    }

                }
            }, function (error) {

            });
        }

        $scope.AddCreateFeePopUp = function (item) {
            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/settings/CreateFreePopUp.html",
                //"size": "lg",
                /* "controller": "USAddnewAssessmentpopupCtrl",*/
                "backdrop": "static",
                "scope": $scope,
                "keyboard": false,
                "windowClass": "modal__sixty--",
                "resolve": {
                    "EditItem": function () { return item; },
                },
                "controller": function ($scope, $uibModal, $uibModalInstance, EditItem) {




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
                            "ActualCost": null,
                            "PreviousYearCost": null,
                            "InFacilityActualCost": null,
                            "InFacilityPreviousYearCost": null,
                            "UnitValueCost": null,
                            "AnesthesiaCost": null,
                            "Remarks": "",
                            "IsActive": true,
                            "DeleteInd": "N",
                            "PayorObj": "",
                            "ProcedureObj": "",
                            "CptcodeObj": "",
                            "GeneralCost": null,
                            "OfficeActualCost": null,
                            "IsReferralRequired": false,
                            "StartDate": null,
                            "EndDate": null,
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
                        $scope.PayorProcedureFeeObj.ActualCost = EditItem.ActualCost || null;
                        $scope.PayorProcedureFeeObj.PreviousYearCost = EditItem.PreviousYearCost || null;
                        $scope.PayorProcedureFeeObj.UnitValueCost = EditItem.UnitValueCost || null;
                        $scope.PayorProcedureFeeObj.InFacilityActualCost = EditItem.InFacilityActualCost || null;
                        $scope.PayorProcedureFeeObj.InFacilityPreviousYearCost = EditItem.InFacilityPreviousYearCost || null;
                        $scope.PayorProcedureFeeObj.AnesthesiaCost = EditItem.AnesthesiaCost || null;
                        $scope.PayorProcedureFeeObj.RequirePreAuth = EditItem.RequirePreAuth;
                        $scope.PayorProcedureFeeObj.ProvedureNotCoveredByInsurance = EditItem.ProvedureNotCoveredByInsurance;
                        $scope.PayorProcedureFeeObj.CapitatedService = EditItem.CapitatedService;
                        $scope.PayorProcedureFeeObj.IsReferralRequired = EditItem.IsReferralRequired;
                        $scope.PayorProcedureFeeObj.IsActive = EditItem.IsActive;
                        $scope.PayorProcedureFeeObj.GeneralCost = EditItem.GeneralCost || null;
                        $scope.PayorProcedureFeeObj.OfficeActualCost = EditItem.OfficeActualCost || null;
                        $scope.PayorProcedureFeeObj.OfficePreviousYearCost = EditItem.OfficePreviousYearCost || null;
                        $scope.PayorProcedureFeeObj.OfficeValueCost = EditItem.OfficeValueCost || null;
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
                            "ProcedureId": $scope.PayorProcedureFeeObj.ProcedureId || 0,
                            "CPTCODE": "",  // cptcode tblorganizationprocedure
                            "SearchText": val || "", // searchtext
                            "TypeOfServiceId": 0,
                            "PageNumber": 1,
                            "PageSize": 10,
                            "GetAllIndicator": 0,
                            "ParentOrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                            "IsFrequent": "N",
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

                        var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to update? This will update the master data and the changes will apply to all future claims.</h4>", function () {

                            $scope.PayorProcedureFeeObj.ActualCost = $scope.PayorProcedureFeeObj.ActualCost || '';
                            $scope.PayorProcedureFeeObj.InFacilityActualCost = $scope.PayorProcedureFeeObj.InFacilityActualCost || '';
                            $scope.PayorProcedureFeeObj.OfficeActualCost = $scope.PayorProcedureFeeObj.OfficeActualCost || '';
                            $scope.PayorProcedureFeeObj.OfficePreviousYearCost = $scope.PayorProcedureFeeObj.OfficePreviousYearCost || '';
                            $scope.PayorProcedureFeeObj.OfficeValueCost = $scope.PayorProcedureFeeObj.OfficeValueCost || '';
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
                            //if ($scope.PayorProcedureFeeObj.StartDate == null) {
                            //    alertify.error("Please Select Start Date");
                            //    return false;
                            //}
                            //if ($scope.PayorProcedureFeeObj.EndDate == null) {
                            //    alertify.error("Please Select End Date");
                            //    return false;
                            //}
                            if ($scope.PayorProcedureFeeObj.ActualCost == "") {
                                alertify.error("Please Enter Actual");
                                return false;
                            }
                            if ($scope.PayorProcedureFeeObj.InFacilityActualCost == "") {
                                alertify.error("Please Enter Facility Actual");
                                return false;
                            }
                            if ($scope.PayorProcedureFeeObj.OfficeActualCost == "") {
                                alertify.error("Please Enter Office Actual");
                                return false;
                            }

                            eHnoteSettingsDataService.AddUpdateOrganizationPayorProcedureFee($scope.PayorProcedureFeeObj).then(function (response) {
                                if (response.data.status == "Success") {
                                    //  $scope.PayorProcedureFeeObj = GetPayorProcedureFeeObj();
                                    $uibModalInstance.close($scope.PayorProcedureFeeObj);
                                } else {
                                    alertify.error(response.data.Message);
                                }
                            }, function (error) {

                            });
                        }, function () {

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
                var filtredProcedure = $filter('filter')($scope.mainClaimObject.PatientClaimLineItems, { "ClaimLineItemId": $scope.selectedpayor.ClaimLineItemId }, true) || [];
                if (filtredProcedure.length > 0) {
                    if (resp.CptcodeObj = filtredProcedure[0].ServiceObj) {
                        filtredProcedure[0].TotalChargeAmount = resp.ActualCost || null;
                    }
                }

            }, function (cancel) {
                console.log(cancel);
            });
        }


    }]);
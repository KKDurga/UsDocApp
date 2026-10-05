"use strict";
eHnoteWebApp.controller("UsERAClaimsDetailsCtrl", ["$scope", "eHnoteMasterDataService", "$uibModalInstance", "eHnoteInsuranceService", "Selectobj", "$q", "$filter", "eHnotePatientDataService", "$timeout", "alertify","$uibModal",
    function ($scope, eHnoteMasterDataService, $uibModalInstance, eHnoteInsuranceService, Selectobj, $q, $filter, eHnotePatientDataService, $timeout, alertify, $uibModal) {


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
        $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
        $scope.Selectobj = Selectobj;
        var currentdate = $filter('date')(new Date(), "yyyy-MM-dd");

        $scope.uibclose = function (type) {
            if (type === "reconcile") {
                $uibModalInstance.close($scope.ERAClaimsObj);
            } else {
                $uibModalInstance.close("close");
            }
        };

        $scope.ERAClaimsObj = {
            "EraId": 0,
            "OrganizationId": $scope.HospitalId,
            "OrganizationAddress1": "",
            "OrganizationAddress2": "",
            "OrganizationState": "",
            "OrganizationCity": "",
            "OrganizationZipCode": "",
            "PayorId": 0,
            "PayerName": "",
            "PayerCity": "",
            "PayerState": "",
            "PayerZip": "",
            "PayerNPI": "",
            "PaymentMethodId": 0,
            "PaymentMethod": "",
            "TransactionNumber": "",
            "TransactionDate": "",
            "TransactionAmount": 0,
            "BatchNumber": "",
            "ReceivedDate": "",
            "TotalNumberOfClaims": 0,
            "ClaimMatchedCount": 0,
            "ClaimUnmatchedCount": 0,
            "Notes": "",
            "PayerAddress1": "",
            "PayerAddress2": "",
            "DeleteInd": "N",
            "BillIngProviderId":0,
            "BillIngProviderName": "",
            "BillingProviderNPI": "",
            "BillingProviderTaxID": "",
            "BillingProviderAdditionalIdentifier": null,
            "BillingProviderAddress1": "",
            "BillingProviderAddress2": "",
            "BillingProviderCity": "",
            "BillingProviderState": "",
            "BillingProviderZip": "",
            "TotalChargeAmount": 0,
            "ClaimsList": [],
            "UnMatchedClaimsList": [],
            "ProcessingType": "Manual",
            "ProcessingTypeId": 1,
            "PaymentMethodFormat": "",
            "TransactionDate": null,
            "ERAStatus": "",
            "ERAStatusId": null,
            "PaidBy": "1",
            "TotalClaimChargeAmount": 0,
            "TotalClaimBilledAmount": 0,
            "TotalClaimPaidAmount": 0,
            "TotalClaimAdjustmentAmount": 0,
            "TotalClaimPatientRespAmount": 0,
            "ProviderAdjustments": [],
            "LegendCodeList": [],
            "TotalProviderAdjustments": 0,
            "TotalClaimOtherAdjAmount": 0,
            "OrganizationStateCode": "",
            "ParseDate": "",
            "GlobalPayorId": 0,
            "MarkedDate": "",
            "MarkedByName": "",
            "Remarks": "",
            "IsCheckedExternalSystem": false,
        }

        $scope.init = function () {

        
            $scope.LineItemAdjustmentsList = [];

            //var param = {
            //    "EraId": $scope.Selectobj.EraId || null
            //}
            $scope.Selectobj.EraId = $scope.Selectobj.EraId || null;
            $q.all([
                eHnoteInsuranceService.GetPrasedERADetailsById($scope.Selectobj.EraId),

            ]).then(function (resp) {
                resp[0].data = resp[0].data || null;
                if (resp[0].data != null) {
                    var ERAresp = angular.copy(resp[0].data);

                    $scope.ERAClaimsObj.EraId = ERAresp.EraId || 0;
                    $scope.ERAClaimsObj.OrganizationId = ERAresp.OrganizationId || 0;
                    $scope.ERAClaimsObj.PayorId = 0;
                    $scope.ERAClaimsObj.BillingProviderId = 0;
                    $scope.ERAClaimsObj.PayerName = ERAresp.PayerName || "";
                    $scope.ERAClaimsObj.GlobalPayorId = ERAresp.GlobalPayorId || "";
                    $scope.ERAClaimsObj.PayerAddress1 = ERAresp.PayerAddress1 || "";
                    $scope.ERAClaimsObj.BillingProviderName = ERAresp.BillIngProviderName || "";
                    $scope.ERAClaimsObj.BillingProviderNPI = ERAresp.BillingProviderNPI || "";
                    $scope.ERAClaimsObj.BillingProviderAddress1 = ERAresp.BillingProviderAddress1 || "";
                    $scope.ERAClaimsObj.BillingProviderAddress2 = ERAresp.BillingProviderAddress2 || "";
                    $scope.ERAClaimsObj.BillingProviderCity = ERAresp.BillingProviderCity || "";
                    $scope.ERAClaimsObj.BillingProviderStat = ERAresp.BillingProviderState || "";
                    $scope.ERAClaimsObj.BillingProviderZip = ERAresp.BillingProviderZip || "";
                    $scope.ERAClaimsObj.BillingProviderTaxID = ERAresp.BillingProviderTaxID || "";
                    $scope.ERAClaimsObj.PayerAddress1 = ERAresp.PayerAddress1 || "";
                    $scope.ERAClaimsObj.PayerAddress2 = ERAresp.PayerAddress2 || "";
                    $scope.ERAClaimsObj.PayerCity = ERAresp.PayerCity || "";
                    $scope.ERAClaimsObj.PayerState = ERAresp.PayerState || "";
                    $scope.ERAClaimsObj.PayerZip = ERAresp.PayerZip || "";
                    $scope.ERAClaimsObj.PayerNPI = ERAresp.PayerNPI || "";
                    $scope.ERAClaimsObj.ReceivedDate = ERAresp.ReceivedDate || "";
                    $scope.ERAClaimsObj.PaymentMethod = ERAresp.PaymentMethod || "";
                    $scope.ERAClaimsObj.PaymentMethodId = ERAresp.PaymentMethodId || 0;
                    $scope.ERAClaimsObj.TransactionNumber = ERAresp.TransactionNumber || "";
                    $scope.ERAClaimsObj.TransactionAmount = ERAresp.TransactionAmount || 0;
                    $scope.ERAClaimsObj.TotalChargeAmount = 0;
                    $scope.ERAClaimsObj.Notes = ERAresp.Notes || "";
                    $scope.ERAClaimsObj.CreatedDt = ERAresp.CreatedDt || "";
                    $scope.ERAClaimsObj.PaymentMethodFormat = ERAresp.PaymentMethodFormat || "";
                    $scope.ERAClaimsObj.TransactionDate = ERAresp.TransactionDate || "";
                    $scope.ERAClaimsObj.ERAStatus = ERAresp.ERAStatus || "";
                    $scope.ERAClaimsObj.ERAStatusId = ERAresp.ERAStatusId || 0;
                    $scope.ERAClaimsObj.ParseDate = ERAresp.ParseDate ||"";

                    $scope.ERAClaimsObj.OrganizationName = ERAresp.OrganizationName || "";
                    $scope.ERAClaimsObj.OrganizationAddress1 = ERAresp.OrganizationAddress1 || "";
                    $scope.ERAClaimsObj.OrganizationAddress2 = ERAresp.OrganizationAddress2 || "";
                    $scope.ERAClaimsObj.OrganizationCity = ERAresp.OrganizationCity || "";
                    $scope.ERAClaimsObj.OrganizationState = ERAresp.OrganizationState || "";
                    $scope.ERAClaimsObj.OrganizationStateCode = ERAresp.OrganizationStateCode || "";
                    $scope.ERAClaimsObj.OrganizationZipCode = ERAresp.OrganizationZipCode || "";
                    $scope.ERAClaimsObj.Remarks = ERAresp.Remarks || "";
                    $scope.ERAClaimsObj.MarkedByName = ERAresp.MarkedByName || "";
                    $scope.ERAClaimsObj.MarkedDate = ERAresp.MarkedDate || "";


                    $scope.ERAClaimsObj.LegendCodeList = [];
                    $scope.ERAClaimsObj.UnMatchedClaimsList = angular.copy(ERAresp.UnMatchedClaims) || [];
                    ERAresp.Claims = ERAresp.Claims || [];
                    ERAresp.UnMatchedClaims = ERAresp.UnMatchedClaims || [];
                    let adjustmentSummary = {};
                    if (ERAresp.Claims.length > 0) {

                        $scope.ERAClaimsObj.ClaimsList = angular.copy(ERAresp.Claims);
                        
                       
                        var PatientInsuranceDetailId = 0;
                        var PatientInsurancePayorId = 0;
                        angular.forEach($scope.ERAClaimsObj.ClaimsList, function (item) {
                            item.isOpen = true;
                     
                            item.PaidBy = parseFloat(item.PaidBy) || 0;
                            item.InsurancePolicyNumber = "";
                            if (item.PaidBy == 2) {
                                item.PatientInsuranceDetailId = item.SecondaryPatientInsuranceDetailId;
                                item.PayorId = item.SecondaryInsurancePayorId;
                                item.InsurancePolicyNumber = item.SecondaryInsurancePolicyNumber;
                            } else {
                                item.PatientInsuranceDetailId = item.PrimaryInsuranceDetailId;
                                item.PayorId = item.PrimaryInsurancePayorId;
                                item.InsurancePolicyNumber = item.PrimaryInsurancePolicyNumber;
                            }


                            $scope.ERAClaimsObj.PayorId = item.PayorId;

                            item.TotalChargeAmount = 0;
                            item.TotalBilledAmount = 0;
                            item.TotalPaidAmount = 0;
                            item.PayorId = PatientInsurancePayorId;

                            item.TotalAdjustmentAmount = 0;
                            item.TotalPatientRespAmount = 0;
                            item.TotalOtherAdjAmount = 0;
                            
                            $scope.ERAClaimsObj.PaidBy = item.PaidBy;
                            $scope.ERAClaimsObj.BillingProviderId = item.BillingProviderId;

                            angular.forEach(item.ClaimLineItems, function (citem) {
                                citem.PatientRespAmnt = 0;
                                citem.PatientRespAdjAmount = 0;
                                item.TotalChargeAmount += citem.ChargedAmount || 0;
                                item.TotalBilledAmount += citem.AllowedAmount || 0;
                                item.TotalPaidAmount += citem.PaidAmount || 0;
                               


                                console.log(citem.ServiceDate);

                                citem.ServiceDate = $filter('date')(citem.ServiceDate, "MM-dd-yyyy");
                                
                                angular.forEach(citem.LineItemAdjustments, function (litem) {

                                    litem.tempAdjustmentReasonCode = litem.AdjustmentReasonCode + '-' + litem.AdjustmentReason;

                                    if (!adjustmentSummary[litem.tempAdjustmentReasonCode]) {
                                        adjustmentSummary[litem.tempAdjustmentReasonCode] = {
                                            AdjustmentReasonCode: litem.AdjustmentReasonCode,
                                            AdjustmentReason: litem.AdjustmentReason,
                                            GroupCode: litem.GroupCode,
                                            AdjustmentAmount: 0,
                                        };
                                    }

                                 if (litem.GroupCode === "PR") {
                                        adjustmentSummary[litem.tempAdjustmentReasonCode].AdjustmentAmount += litem.AdjustmentAmount || 0;
                                     item.TotalPatientRespAmount += litem.AdjustmentAmount || 0;
                                     citem.PatientRespAdjAmount += litem.AdjustmentAmount || 0;
                                 } else {
                                     adjustmentSummary[litem.tempAdjustmentReasonCode].AdjustmentAmount += litem.AdjustmentAmount || 0;
                                     item.TotalAdjustmentAmount += litem.AdjustmentAmount || 0;
                                 }

                                    //if (litem.PayorPostingStatusId == 2) {
                                    //    citem.PatientRespAmnt += litem.AdjustmentAmount || 0;
                                    //}

                                    //if (litem.GroupCode === "CO") {
                                    //    adjustmentSummary[litem.tempAdjustmentReasonCode].AdjustmentAmount += litem.AdjustmentAmount || 0;
                                    //    item.TotalAdjustmentAmount += litem.AdjustmentAmount || 0;
                                    //} else if (litem.GroupCode === "PR") {
                                    //    adjustmentSummary[litem.tempAdjustmentReasonCode].AdjustmentAmount += litem.AdjustmentAmount || 0;
                                    //    item.TotalPatientRespAmount += litem.AdjustmentAmount || 0;
                                    //}
                                    //else if (litem.GroupCode === "OA") {
                                    //    adjustmentSummary[litem.tempAdjustmentReasonCode].AdjustmentAmount += litem.AdjustmentAmount || 0;

                                    //}

                                    //if (litem.GroupCode === "OA") {
                                    //    adjustmentSummary[litem.tempAdjustmentReasonCode].AdjustmentAmount += litem.AdjustmentAmount || 0;
                                    //    item.TotalOtherAdjAmount += litem.AdjustmentAmount || 0;

                                    //}
                                    
                                });

                            });

                          
                          
                            
                          

                            $scope.ERAClaimsObj.TotalChargeAmount += item.TotalChargeAmount;
                            $scope.ERAClaimsObj.TotalClaimChargeAmount += item.TotalChargeAmount;
                            $scope.ERAClaimsObj.TotalClaimBilledAmount += item.TotalBilledAmount;
                            $scope.ERAClaimsObj.TotalClaimPaidAmount += item.TotalPaidAmount;
                            $scope.ERAClaimsObj.TotalClaimAdjustmentAmount += item.TotalAdjustmentAmount;
                            $scope.ERAClaimsObj.TotalClaimPatientRespAmount += item.TotalPatientRespAmount;
                            $scope.ERAClaimsObj.TotalClaimOtherAdjAmount += item.TotalOtherAdjAmount;
                            item.ClaimPaymentRemark1 = item.ClaimPaymentRemark1 || '';
                            item.ClaimPaymentRemark2 = item.ClaimPaymentRemark2 || '';
                            item.ClaimPaymentRemark3 = item.ClaimPaymentRemark3 || '';
                            item.ClaimPaymentRemark4 = item.ClaimPaymentRemark4 || '';
                            item.ClaimPaymentRemark5 = item.ClaimPaymentRemark5 || '';

                            if (item.ClaimPaymentRemark1 != '') {
                                let obj = {
                                    "Code": item.ClaimPaymentRemark1,
                                    "Description": item.AdjsutmentReasonDescriptionk1,
                                }
                                $scope.ERAClaimsObj.LegendCodeList.push(obj);
                            }
                            if (item.ClaimPaymentRemark2 != '') {
                                let obj = {
                                    "Code": item.ClaimPaymentRemark2,
                                    "Description": item.AdjsutmentReasonDescriptionk2,
                                }
                                $scope.ERAClaimsObj.LegendCodeList.push(obj);
                            }
                            if (item.ClaimPaymentRemark3 != '') {
                                let obj = {
                                    "Code": item.ClaimPaymentRemark3,
                                    "Description": item.AdjsutmentReasonDescriptionk3,
                                }
                                $scope.ERAClaimsObj.LegendCodeList.push(obj);
                            }
                            if (item.ClaimPaymentRemark4 != '') {
                                let obj = {
                                    "Code": item.ClaimPaymentRemark4,
                                    "Description": item.AdjsutmentReasonDescriptionk4,
                                }
                                $scope.ERAClaimsObj.LegendCodeList.push(obj);
                            }
                            if (item.ClaimPaymentRemark5 != '') {
                                let obj = {
                                    "Code": item.ClaimPaymentRemark5,
                                    "Description": item.AdjsutmentReasonDescriptionk5,
                                }
                                $scope.ERAClaimsObj.LegendCodeList.push(obj);
                            } 

                        });


                        console.log($scope.ERAClaimsObj.TotalClaimChargeAmount + "__TotalClaimChargeAmount");
                        console.log($scope.ERAClaimsObj.TotalClaimBilledAmount + "__TotalClaimBilledAmount");
                        console.log($scope.ERAClaimsObj.TotalClaimPaidAmount + "__TotalClaimPaidAmount");
                        console.log($scope.ERAClaimsObj.TotalClaimAdjustmentAmount + "__TotalAdjustmentAmount");
                        console.log($scope.ERAClaimsObj.TotalClaimPatientRespAmount + "__TotalClaimPatientRespAmount");

                        $scope.LineItemAdjustmentsList = Object.keys(adjustmentSummary).map(function (key) {
                            return adjustmentSummary[key];
                        });
                    }
                    if (ERAresp.UnMatchedClaims.length > 0) {

                        $scope.ERAClaimsObj.UnMatchedClaimsList = angular.copy(ERAresp.UnMatchedClaims);

                      //  let adjustmentSummary = {};
                        var PatientInsuranceDetailId = 0;
                        var PatientInsurancePayorId = 0;
                        angular.forEach($scope.ERAClaimsObj.UnMatchedClaimsList, function (item) {


                            item.PaidBy = parseFloat(item.PaidBy) || 0;
                            item.InsurancePolicyNumber = "";
                            if (item.PaidBy == 2) {
                                item.PatientInsuranceDetailId = item.SecondaryPatientInsuranceDetailId;
                                item.PayorId = item.SecondaryInsurancePayorId;
                                item.InsurancePolicyNumber = item.SecondaryInsurancePolicyNumber;
                            } else {
                                item.PatientInsuranceDetailId = item.PrimaryInsuranceDetailId;
                                item.PayorId = item.PrimaryInsurancePayorId;
                                item.InsurancePolicyNumber = item.PrimaryInsurancePolicyNumber;
                            }


                            $scope.ERAClaimsObj.PayorId = item.PayorId;

                            item.TotalChargeAmount = 0;
                            item.TotalBilledAmount = 0;
                            item.TotalPaidAmount = 0;
                            item.PayorId = PatientInsurancePayorId;

                            item.TotalAdjustmentAmount = 0;
                            item.TotalPatientRespAmount = 0;
                            item.TotalOtherAdjAmount = 0;

                            $scope.ERAClaimsObj.PaidBy = item.PaidBy;
                            $scope.ERAClaimsObj.BillingProviderId = item.BillingProviderId;

                            angular.forEach(item.ClaimLineItems, function (citem) {
                                citem.PatientRespAmnt = 0;
                                citem.PatientRespAdjAmount = 0;
                                item.TotalChargeAmount += citem.ChargedAmount || 0;
                                item.TotalBilledAmount += citem.AllowedAmount || 0;
                                item.TotalPaidAmount += citem.PaidAmount || 0;



                                console.log(citem.ServiceDate);

                                citem.ServiceDate = $filter('date')(citem.ServiceDate, "MM-dd-yyyy");

                                angular.forEach(citem.LineItemAdjustments, function (litem) {

                                    litem.tempAdjustmentReasonCode = litem.AdjustmentReasonCode + '-' + litem.AdjustmentReason;

                                    if (!adjustmentSummary[litem.tempAdjustmentReasonCode]) {
                                        adjustmentSummary[litem.tempAdjustmentReasonCode] = {
                                            AdjustmentReasonCode: litem.AdjustmentReasonCode,
                                            AdjustmentReason: litem.AdjustmentReason,
                                            GroupCode: litem.GroupCode,
                                            AdjustmentAmount: 0,
                                        };
                                    }

                                    if (litem.GroupCode === "PR") {
                                        adjustmentSummary[litem.tempAdjustmentReasonCode].AdjustmentAmount += litem.AdjustmentAmount || 0;
                                        item.TotalPatientRespAmount += litem.AdjustmentAmount || 0;
                                        citem.PatientRespAdjAmount += litem.AdjustmentAmount || 0;
                                    } else {
                                        adjustmentSummary[litem.tempAdjustmentReasonCode].AdjustmentAmount += litem.AdjustmentAmount || 0;
                                        item.TotalAdjustmentAmount += litem.AdjustmentAmount || 0;
                                    }
                                    //if (litem.PayorPostingStatusId == 2) {
                                    //    citem.PatientRespAmnt += litem.AdjustmentAmount || 0;
                                    //}
                                    //if (litem.GroupCode === "CO") {
                                    //    adjustmentSummary[litem.tempAdjustmentReasonCode].AdjustmentAmount += litem.AdjustmentAmount || 0;
                                    //    item.TotalAdjustmentAmount += litem.AdjustmentAmount || 0;
                                    //} else if (litem.GroupCode === "PR") {
                                    //    adjustmentSummary[litem.tempAdjustmentReasonCode].AdjustmentAmount += litem.AdjustmentAmount || 0;
                                    //    item.TotalPatientRespAmount += litem.AdjustmentAmount || 0;
                                    //}
                                    //else if (litem.GroupCode === "OA") {
                                    //    adjustmentSummary[litem.tempAdjustmentReasonCode].AdjustmentAmount += litem.AdjustmentAmount || 0;

                                    //}
                                    //if (litem.GroupCode === "OA") {
                                    //    adjustmentSummary[litem.tempAdjustmentReasonCode].AdjustmentAmount += litem.AdjustmentAmount || 0;
                                    //    item.TotalOtherAdjAmount += litem.AdjustmentAmount || 0;
                                    //}
                                   
                                });

                            });






                            $scope.ERAClaimsObj.TotalChargeAmount += item.TotalChargeAmount;
                            $scope.ERAClaimsObj.TotalClaimChargeAmount += item.TotalChargeAmount;
                            $scope.ERAClaimsObj.TotalClaimBilledAmount += item.TotalBilledAmount;
                            $scope.ERAClaimsObj.TotalClaimPaidAmount += item.TotalPaidAmount;
                            $scope.ERAClaimsObj.TotalClaimAdjustmentAmount += item.TotalAdjustmentAmount;
                            $scope.ERAClaimsObj.TotalClaimPatientRespAmount += item.TotalPatientRespAmount;
                            $scope.ERAClaimsObj.TotalClaimOtherAdjAmount += item.TotalOtherAdjAmount;
                            item.ClaimPaymentRemark1 = item.ClaimPaymentRemark1 || '';
                            item.ClaimPaymentRemark2 = item.ClaimPaymentRemark2 || '';
                            item.ClaimPaymentRemark3 = item.ClaimPaymentRemark3 || '';
                            item.ClaimPaymentRemark4 = item.ClaimPaymentRemark4 || '';
                            item.ClaimPaymentRemark5 = item.ClaimPaymentRemark5 || '';

                            if (item.ClaimPaymentRemark1 != '') {
                                let obj = {
                                    "Code": item.ClaimPaymentRemark1,
                                    "Description": item.AdjsutmentReasonDescriptionk1,
                                }
                                $scope.ERAClaimsObj.LegendCodeList.push(obj);
                            }
                            if (item.ClaimPaymentRemark2 != '') {
                                let obj = {
                                    "Code": item.ClaimPaymentRemark2,
                                    "Description": item.AdjsutmentReasonDescriptionk2,
                                }
                                $scope.ERAClaimsObj.LegendCodeList.push(obj);
                            }
                            if (item.ClaimPaymentRemark3 != '') {
                                let obj = {
                                    "Code": item.ClaimPaymentRemark3,
                                    "Description": item.AdjsutmentReasonDescriptionk3,
                                }
                                $scope.ERAClaimsObj.LegendCodeList.push(obj);
                            }
                            if (item.ClaimPaymentRemark4 != '') {
                                let obj = {
                                    "Code": item.ClaimPaymentRemark4,
                                    "Description": item.AdjsutmentReasonDescriptionk4,
                                }
                                $scope.ERAClaimsObj.LegendCodeList.push(obj);
                            }
                            if (item.ClaimPaymentRemark5 != '') {
                                let obj = {
                                    "Code": item.ClaimPaymentRemark5,
                                    "Description": item.AdjsutmentReasonDescriptionk5,
                                }
                                $scope.ERAClaimsObj.LegendCodeList.push(obj);
                            }

                        });


                        console.log($scope.ERAClaimsObj.TotalClaimChargeAmount + "__TotalClaimChargeAmount");
                        console.log($scope.ERAClaimsObj.TotalClaimBilledAmount + "__TotalClaimBilledAmount");
                        console.log($scope.ERAClaimsObj.TotalClaimPaidAmount + "__TotalClaimPaidAmount");
                        console.log($scope.ERAClaimsObj.TotalClaimAdjustmentAmount + "__TotalAdjustmentAmount");
                        console.log($scope.ERAClaimsObj.TotalClaimPatientRespAmount + "__TotalClaimPatientRespAmount");

                        $scope.LineItemAdjustmentsList = Object.keys(adjustmentSummary).map(function (key) {
                            return adjustmentSummary[key];
                        });
                    }
                    ERAresp.ProviderAdjustments = ERAresp.ProviderAdjustments || [];
                    if (ERAresp.ProviderAdjustments.length > 0) {
                        $scope.ERAClaimsObj.ProviderAdjustments = angular.copy(ERAresp.ProviderAdjustments);
                        angular.forEach($scope.ERAClaimsObj.ProviderAdjustments, function (pitem) {

                            $scope.ERAClaimsObj.TotalProviderAdjustments += pitem.AdjustmentAmount || 0;
                        })
                    }
                    $scope.ERAClaimsObj.LegendCodeList = $scope.ERAClaimsObj.LegendCodeList || [];
                    if ($scope.ERAClaimsObj.LegendCodeList.length>0) {
                        $scope.ERAClaimsObj.LegendCodeList = _.uniq($scope.ERAClaimsObj.LegendCodeList, false, function (p) { return p.Code; });
                    }
                  
                }

            });
        }

        $scope.init();

        $scope.ApproveERAClaims = function (type) {
            var Type = type || "Approve";

            let Obj = {
                "UserId": $scope.UserId,
                "OrganizationId": $scope.ERAClaimsObj.OrganizationId,
                "EraId": $scope.ERAClaimsObj.EraId || 0,
                "EOBId": 0,
                "PostingDate": currentdate,
                "EOBName": "",
                "EOBTypeId": 1,
                "EOBType": "Insurance Payment",
                "PaymentMethodId": $scope.ERAClaimsObj.PaymentMethodId || 0,
                "PaymentMethod": $scope.ERAClaimsObj.PaymentMethod || "",
                "ProcessingTypeId": 2,
                "ProcessingType": "Electronic",
                "EOBCategory": "",
                "PaymentReceivedAt": "",
                "PaymentFormatCode": $scope.ERAClaimsObj.PaymentMethodFormat,
                "PaymentDate": $scope.ERAClaimsObj.TransactionDate || null,
                "ReferenceNumber": "",
                "PayorName": $scope.ERAClaimsObj.PayerName,
                "PayorAddress": $scope.ERAClaimsObj.PayerAddress1,
                "PayorId": $scope.ERAClaimsObj.PayorId,
                "GlobalPayorId": $scope.ERAClaimsObj.GlobalPayorId,
                "OrganizationPayorId": 0,
                "OrganizationBillingProviderId": $scope.ERAClaimsObj.BillingProviderId,
                "BillingProviderName": $scope.ERAClaimsObj.BillingProviderName,
                "BillingProviderNPI": $scope.ERAClaimsObj.BillingProviderNPI,
                "TotalPaymentAmount": $scope.ERAClaimsObj.TransactionAmount,
                "TotalAllowedAmount": 0,
                "TotalDeductAmount": 0,
                "TotalCoInsuranceAmount": 0,
                "TotalAdjustmentAmount": 0,
                "TotalWriteOffAmount": 0,
                "TotalPatientResponsibilityAmount": 0,
                "TotalDeniedAmount": 0,
                "TotalPatientResponsibilityWriteOffAmount": 0,
                "TotalAppliedAmount": 0,
                "TotalUnAppliedAmount": $scope.ERAClaimsObj.TransactionAmount,
                "TotalZeroLineItems": 0,
                "TotalDeniedLineItems": 0,
                "PayerIdentifier": $scope.ERAClaimsObj.PaidBy || "1",
                "FederalTaxPayersIdentificationNumber": "",
                "ClaimPaymentInfo": "",
                "ReceiptNumber": "",
                "ReceiptId": 0,
                "EOBFileId": 0,
                "EOBFileName": "",
                "EOBFileS3URL": "",
                "EDIFileId": 0,
                "EDIFileName": "",
                "EDIFileS3URL": "",
                "DepositedBy": "",
                "DepositDate": $scope.ERAClaimsObj.TransactionDate || null,
                "Notes": $scope.ERAClaimsObj.Notes,
                "DepositStatus": $scope.ERAClaimsObj.ERAStatus || "",
                "DepositStatusId": $scope.ERAClaimsObj.ERAStatusId || 1,
                "DocumentDetails": [],
                "DeleteInd": $scope.ERAClaimsObj.DeleteInd || "N"
            }

            eHnoteInsuranceService.AddUpdateEOBDetails(Obj, onsuccess, onerror);
            function onsuccess(resp) {
                if (resp.Status === "Success") {
                    $scope.ERAClaimsObj.EOBId = resp.EOBId || 0;

                    if (Type == "Post") {
                        $scope.ApproveAndPostERAClaims($scope.ERAClaimsObj.EOBId);
                    } else {
                        let ClaimsList = [];

                        angular.forEach($scope.ERAClaimsObj.ClaimsList, function (item) {

                            if (item.PatientClaimId !== 0) {


                                let obj = {
                                    "EOBClaimInfoId": 0,
                                    "EOBId": $scope.ERAClaimsObj.EOBId,
                                    "PatientClaimNumber": item.PatientClaimNumber || "",
                                    "PatientClaimId": item.PatientClaimId || "",
                                    "PatientControlNumber": item.PatientControlNumber || "",
                                    "PatientId": item.PatientId,
                                    "BatchId": null,
                                    "PatientInsuranceDetailId": item.PatientInsuranceDetailId || null,
                                    "EOBPageNo": "",
                                    "PostingNotes": "",
                                    "PayorOrder": null,
                                    "PayorId": item.PayorId,
                                    "PayerClaimControlNumber": "",
                                    "TotalChargeAmount": 0.0,
                                    "ClaimPaymentAmount": 0.0,
                                    "ClaimAdjustmentAmount": 0.0,
                                    "ClaimCoPayAmount": 0.0,
                                    "ClaimCoInsuranceAmount": 0.0,
                                    "ClaimAllowedAmount": 0.0,
                                    "WriteOffAmount": 0.0,
                                    "DeductibleAmount": 0.0,
                                    "PatientResponsibilityAmount": 0.0,
                                    "ClaimAdjustmentCode": "",
                                    "ClaimAdjustmentCodeDescription": "",
                                    "DenialCode": "",
                                    "DenialCodeDescription": "",
                                    "RemarkCode": "",
                                    "RemarkCodeDescription": "",
                                    "ClaimFollowUpNotes": "",
                                    "DepositStatusId": "2",
                                    "DepositStatus": "Received",
                                    "SettlementStatusId": 1,
                                    "SettlementStatus": "Not Settled",
                                    "DeleteInd": "N"
                                }

                                ClaimsList.push(obj);
                            }


                            let params = {
                                "UserId": $scope.UserId,
                                "OrganizationId": $scope.HospitalId,
                                "EOBId": $scope.ERAClaimsObj.EOBId,
                                "ClaimsList": ClaimsList || [],
                            }

                            eHnotePatientDataService.AddUpdateEOBClaimInfoDetails(params).then(function (resp) {
                                if (resp.data.Status == "Success") {
                                    $uibModalInstance.dismiss("cancel");
                                } else {
                                    alertify.error(resp.data.Message);
                                }
                            });
                        });
                    }

                  
                }
            }
            function onerror(err) {
                console.log(err);
            }
        }

        $scope.AddUpdateEOBClaim = function () {

            let ClaimsList = [];
            $scope.OrgClaimListdata = [];
            if ($scope.ERAClaimsObj.ClaimsList.length > 0) {
                angular.forEach($scope.ERAClaimsObj.ClaimsList, function (item) {

                    var params = {
                        "OrganizationId": $scope.HospitalId,
                        "OrganizationFacilityId": 0,
                        "FromDate": null,
                        "ToDate": null,
                        "PatientId": 0,
                        "PatienClaimNumber": item.PatientClaimNumber,
                        "BatchNumber": "",
                        "BillingProviderId": 0,
                        "RenderingProviderId": 0,
                        "TransmissionTypeId": 0,
                        "ClaimTypeId": 0,
                        "PayorId": 0,
                        "ClaimStatusList": "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21",
                        "PageSize": 20,
                        "PageNumber": 1,
                    };

                    eHnotePatientDataService.GetOrganizationClaimsList(params).then(function (resp) {
                        if (resp.data.status === "Success") {
                            if (resp.data.rows.length > 0) {

                                $scope.OrgClaimListdata = angular.copy(resp.data.rows);

                                angular.forEach($scope.OrgClaimListdata, function (item) {

                                    let obj = {
                                        "EOBClaimInfoId": 0,
                                        "EOBId": $scope.ERAClaimsObj.EOBId,
                                        "PatientClaimNumber": item.PatientClaimNumber || "",
                                        "PatientClaimId": item.PatientClaimId || "",
                                        "PatientControlNumber": item.PatientControlNumber || "",
                                        "PatientId": item.PatientId,
                                        "BatchId": item.BatchId || null,
                                        "PatientInsuranceDetailId": item.PrimaryInsuranceId || null,
                                        "EOBPageNo": "",
                                        "PostingNotes": "",
                                        "PayorOrder": null,
                                        "PayorId": item.PayorId,
                                        "PayerClaimControlNumber": "",
                                        "TotalChargeAmount": 0.0,
                                        "ClaimPaymentAmount": 0.0,
                                        "ClaimAdjustmentAmount": 0.0,
                                        "ClaimCoPayAmount": 0.0,
                                        "ClaimCoInsuranceAmount": 0.0,
                                        "ClaimAllowedAmount": 0.0,
                                        "WriteOffAmount": 0.0,
                                        "DeductibleAmount": 0.0,
                                        "PatientResponsibilityAmount": 0.0,
                                        "ClaimAdjustmentCode": "",
                                        "ClaimAdjustmentCodeDescription": "",
                                        "DenialCode": "",
                                        "DenialCodeDescription": "",
                                        "RemarkCode": "",
                                        "RemarkCodeDescription": "",
                                        "ClaimFollowUpNotes": "",
                                        "DepositStatusId": "2",
                                        "DepositStatus": "Received",
                                        "SettlementStatusId": 1,
                                        "SettlementStatus": "Not Settled",
                                        "DeleteInd": "N"
                                    }

                                    ClaimsList.push(obj);

                                    let params = {
                                        "UserId": $scope.UserId,
                                        "OrganizationId": $scope.HospitalId,
                                        "EOBId": $scope.ERAClaimsObj.EOBId,
                                        "ClaimsList": ClaimsList || [],
                                    }

                                    eHnotePatientDataService.AddUpdateEOBClaimInfoDetails(params).then(function (resp) {
                                        if (resp.data.Status == "Success") {
                                            $uibModalInstance.dismiss("cancel");
                                        } else {
                                            alertify.error(resp.data.Message);
                                        }
                                    });
                                });
                            }
                        }
                    });
                });
            }
        }


        function getnewEOBCLaimInfoObject() {
            var obj = {
                "UserId": $scope.UserId,
                "OrganizationId": $scope.HospitalId,
                "EOBId": $scope.ERAClaimsObj.EOBId,
                "EOBClaimInfoId": 0,
                "PatientClaimId": 0,
                "PostingDate": $filter('date')($scope.CurreDate, "yyyy-MM-dd"),
                "PostingType": "Insurance",
                "PostingTypeId": 2,
                "PatientInsuranceDetailId": 0,
                "TotalClaimAmount": 0,
                "TotalAllowedAmount": 0,
                "TotalInsurancePayment": 0,
                "TotalAdjustmentAmount": 0,
                "TotalCopayAmount": 0,
                "TotalCoInsuranceAmount": 0,
                "TotalDeductibleAmount": 0,
                "TotalPaymentAmount": 0,
                "TotalPatientPayment": 0,
                "TotalWriteOffAmount": 0,
                "TotalInsuranceBalance": 0,
                "TotalPatientBalance": 0,
                "TotalBalance": 0,
                "ClaimStatusId": 14,
                "ClaimStatus": 'ERA Processed as Primary',
                "SettlementStatusId": 3,
                "SettlementStatus": "Fully Settled",
                "TransactionTypeId": 32,
                "TransactionType": "PrimaryInsPayment",
                "ClaimLineItems": [],
                "IsSecondaryClaim": false,
                "SecondaryPatientInsuranceDetailId": 0
            };

            return obj;
        }

        $scope.ApproveAndPostERAClaims = function (EobId) {
            var obj = {
                "UserId": $scope.UserId,
                "OrganizationId": $scope.HospitalId,
                "EraId": $scope.ERAClaimsObj.EraId || 0,
                "EOBId": $scope.ERAClaimsObj.EOBId || 0,
                "EOBClaims": []
            }


            var EOBClaimsArray = [];


            let filteredEOBClaims =  $filter("filter")($scope.ERAClaimsObj.ClaimsList, function (mitem, index) { return mitem.PatientClaimId !== 0; }) || [];

            angular.forEach(filteredEOBClaims, function (mainitem) {

                var mainobj = getnewEOBCLaimInfoObject();


                let IsSecondaryClaim = false;

                if (mainitem.PaidBy == 2) {
                    IsSecondaryClaim = true;
                }
                let ClaimLineItems = [];
                var denialCount = 0;



                let TransactionSourceId = 1;
                let TransactionSource = "Primary Insurance";
                let TransactionTypeId = 32;
                let TransactionType = "PrimaryInsurancePayment";

                if (mainitem.PaidBy == 2) {
                    TransactionSourceId = 2;
                    TransactionSource = "Secondary Insurance";
                    TransactionTypeId = 36;
                    TransactionType = "SecondaryInsPayment";
                }

                let SettlementStatusId = 3;
                let SettlementStatus = "Fully Settled";





                if (mainitem.ClaimLineItems.length > 0) {
                    angular.forEach(mainitem.ClaimLineItems, function (item) {

                        let filteredServiceAdjustments = $filter("filter")(item.LineItemAdjustments, function (fitem) { return fitem.AdjustmentReasonCode != ''; }, true) || [];


                        var AdjustmentAmount = parseFloat(item.AdjustmentAmount) || 0;
                        var deductibleAmt = parseFloat(item.DeductibleAmount) || 0;
                        var AllowedAmount = parseFloat(item.AllowedAmount) || 0;
                        var CoInsuranceAmount = parseFloat(item.CoInsuranceAmount) || 0;
                        var CopayAmount = parseFloat(item.CopayAmount) || 0;
                        var CurrentPaymentAmount = parseFloat(item.PaidAmount) || 0;

                        var currentPatientBalance = deductibleAmt + CoInsuranceAmount + CopayAmount;
                        var CurrentInsuranceBalance = AllowedAmount - (deductibleAmt + CoInsuranceAmount + CopayAmount + CurrentPaymentAmount);


                        let ClaimTransaction = [];
                        if (CurrentPaymentAmount != 0) {
                            let InsurancePaymentAmount = parseFloat(CurrentPaymentAmount) || 0;
                            let Tranobj = {
                                "ClaimTransactionId": 0,
                                "PatientInsuranceDetailId": mainitem.PatientInsuranceDetailId,
                                "ClaimLineItemId": item.ClaimLineItemId,
                                "OrganizationId": $scope.HospitalId,
                                "TransactionDate": $filter('date')($scope.CurreDate, "yyyy-MM-dd"),
                                "TransactionAmount": - + InsurancePaymentAmount,
                                "PatientAmount": 0,
                                "InsuranceAmount": -+InsurancePaymentAmount,
                                "EOBId": $scope.ERAClaimsObj.EOBId,
                                "PayorId": $scope.ERAClaimsObj.PayorId,
                                "AdjustmentReasonId": null,
                                "AdjustmentReasonCode": "",
                                "ReferenceNumber": $scope.ERAClaimsObj.TransactionNumber,
                                "TransactionTypeId": TransactionTypeId,
                                "TransactionType": TransactionType,
                                "TransactionSourceId": TransactionSourceId,
                                "TransactionSource": TransactionSource,
                                "SettlementStatusId": 3,
                                "SettlementStatus": "Fully Settled",
                                "TransactionNotes": ""
                            }
                            ClaimTransaction.push(Tranobj);
                        }
                        if (AdjustmentAmount != 0) {

                            let Tranobj = {
                                "ClaimTransactionId": 0,
                                "ClaimLineItemId": item.ClaimLineItemId,
                                "PatientInsuranceDetailId": mainitem.PatientInsuranceDetailId,
                                "OrganizationId": $scope.HospitalId,
                                "TransactionDate": $filter('date')($scope.CurreDate, "yyyy-MM-dd"),
                                "TransactionAmount": -+AdjustmentAmount,
                                "PatientAmount": 0,
                                "InsuranceAmount": -+AdjustmentAmount,
                                "EOBId": $scope.ERAClaimsObj.EOBId,
                                "PayorId": $scope.ERAClaimsObj.PayorId,
                                "AdjustmentReasonId": null,
                                "AdjustmentReasonCode": "",
                                "ReferenceNumber": $scope.ERAClaimsObj.TransactionNumber,
                                "TransactionTypeId": 53,
                                "TransactionType": "CONTRACTUAL ADJUSTMENT",
                                "TransactionSourceId": TransactionSourceId,
                                "TransactionSource": TransactionSource,
                                "SettlementStatusId": 3,
                                "SettlementStatus": "Fully Settled",
                                "TransactionNotes": ""
                            }
                            ClaimTransaction.push(Tranobj);
                        }
                        if (currentPatientBalance != 0) {
                            let PatientBalance = parseFloat(currentPatientBalance) || 0;
                            let Tranobj = {
                                "ClaimTransactionId": 0,
                                "ClaimLineItemId": item.ClaimLineItemId,
                                "PatientInsuranceDetailId": mainitem.PatientInsuranceDetailId,
                                "OrganizationId": $scope.HospitalId,
                                "TransactionDate": $filter('date')($scope.CurreDate, "yyyy-MM-dd"),
                                "TransactionAmount": 0,
                                "PatientAmount": PatientBalance,
                                "InsuranceAmount": -+PatientBalance || 0,
                                "EOBId": $scope.ERAClaimsObj.EOBId,
                                "PayorId": $scope.ERAClaimsObj.PayorId,
                                "AdjustmentReasonId": null,
                                "AdjustmentReasonCode": "",
                                "ReferenceNumber": $scope.ERAClaimsObj.TransactionNumber,
                                "TransactionTypeId": 30,
                                "TransactionType": "Patient Responsibility",
                                "TransactionSourceId": TransactionSourceId,
                                "TransactionSource": TransactionSource,
                                "SettlementStatusId": SettlementStatusId || 3,
                                "SettlementStatus": SettlementStatus || "Fully Settled",
                                "TransactionNotes": ""
                            }
                            ClaimTransaction.push(Tranobj);
                        }

                        var DenialCodes = [];

                        if (CurrentPaymentAmount === 0) {
                            filteredServiceAdjustments = [];
                            angular.forEach(item.LineItemAdjustments, function (citem, index) {
                                var objj = {
                                    "DenialId": 0,
                                    "EOBLineItemId": 0,
                                    "ClaimLineItemId": item.ClaimLineItemId,
                                    "DenialCode": citem.AdjustmentReasonCode,
                                    "DenialCodeDescription": citem.AdjustmentReason,
                                };
                                DenialCodes.push(objj);
                            });
                        }




                        let postobj = {
                            "EOBLineItemId": 0,
                            "ClaimLineItemId": item.ClaimLineItemId,
                            "PatientClaimId": item.PatientClaimId,
                            "ServiceId": item.ServiceId,
                            "PatientBalance": currentPatientBalance,
                            "InsuranceBalance": CurrentInsuranceBalance,
                            "PaymentAmount": CurrentPaymentAmount,
                            "AllowedAmount": AllowedAmount,
                            "CoInsuranceAmount": CoInsuranceAmount,
                            "DeductibleAmount": deductibleAmt,
                            "CoPaymentAmount": CopayAmount,
                            "AdjustmentAmount": AdjustmentAmount,
                            "InsuranceWriteOff": 0,
                            "PatientResponsibility": currentPatientBalance,
                            "OtherPatientAmount": null,
                            "PatientWriteOffAmount": null,
                            "TotalBalance": CurrentInsuranceBalance,
                            "ServiceAdjustments": filteredServiceAdjustments || [],
                            "DenialCodes": DenialCodes || [],
                            "ClaimTransaction": ClaimTransaction || [],
                        };
                        if (postobj.DenialCodes.length > 0) {
                            denialCount++;
                        }
                        ClaimLineItems.push(postobj);


                    });
                }




                mainobj.UserId = $scope.UserId;
                mainobj.OrganizationId = $scope.HospitalId;
                mainobj.EOBId = $scope.ERAClaimsObj.EOBId;
                mainobj.EOBClaimInfoId = 0;
                mainobj.PatientClaimId = mainitem.PatientClaimId;
                mainobj.PostingDate = currentdate;
                mainobj.PostingType = "Insurance";
                mainobj.PostingTypeId = 2;
                mainobj.PatientInsuranceDetailId = mainitem.PatientInsuranceDetailId;
                mainobj.TotalClaimAmount = parseFloat(mainitem.ClaimAmount) || 0;
                mainobj.TotalAllowedAmount = parseFloat(mainitem.AllowedAmount) || 0;
                mainobj.TotalInsurancePayment = parseFloat(mainitem.PaidAmount) || 0;
                mainobj.TotalAdjustmentAmount = parseFloat(mainitem.AdjustmentAmount) || 0;
                mainobj.TotalCopayAmount = parseFloat(mainitem.CopayAmount) || 0;
                mainobj.TotalCoInsuranceAmount = parseFloat(mainitem.CoInsuranceAmount) || 0;
                mainobj.TotalDeductibleAmount = parseFloat(mainitem.DeductibleAmount) || 0;
                mainobj.TotalPaymentAmount = parseFloat(mainitem.PaidAmount) || 0;
                mainobj.TotalPatientPayment = parseFloat(mainitem.PatientAmount) || 0;
                mainobj.TotalWriteOffAmount = parseFloat(mainitem.DiscountAmount) || 0;



                mainobj.TotalInsuranceBalance = mainobj.TotalAllowedAmount - (mainobj.TotalDeductibleAmount + mainobj.TotalCoInsuranceAmount + mainobj.TotalCopayAmount + mainobj.TotalPaymentAmount);

                mainobj.TotalPatientBalance = mainobj.TotalDeductibleAmount + mainobj.TotalCoInsuranceAmount + mainobj.TotalCopayAmount;


                mainobj.TotalBalance = mainobj.TotalAllowedAmount - mainobj.TotalInsuranceBalance - mainobj.TotalPatientBalance - mainobj.TotalWriteOffAmount - mainobj.TotalPaymentAmount;


                mainobj.ClaimStatusId = 14;
                mainobj.ClaimStatus = 'ERA Processed as Primary';
                mainobj.SettlementStatusId = 3;
                mainobj.SettlementStatus = "Fully Settled";
                mainobj.TransactionTypeId = 32;
                mainobj.TransactionType = "PrimaryInsPayment";
                mainobj.ClaimLineItems = ClaimLineItems || [];
                mainobj.IsSecondaryClaim = IsSecondaryClaim || false;


                EOBClaimsArray.push(mainobj)

            });


            obj.EOBClaims = EOBClaimsArray;
            console.log(JSON.stringify(obj));

         

            eHnoteInsuranceService.UpdateERAClaimsForPaymentPosting(obj).then(function (resp) {
                if (resp.data.Status === "Success") {
                    alertify.success("Payment Updated Successfully");
                    $uibModalInstance.close("save");
                }
            });
         

         
           
        };


        $scope.saveERAEOBApprove = function () {
            var params = {
                "UserId": $scope.UserId,
                "EraId": $scope.ERAClaimsObj.EraId || 0,
                "IsPostPayment": false,
                "IsAllClaims": false,
                "PostingDate": currentdate
            }




            console.log(JSON.stringify(params));

            eHnoteInsuranceService.UpdateERAToBeActive(params, onSuccess, onError);
            function onSuccess(resp) {
                if (resp.Status === 'Success') {
                    alertify.success("Approved Successfully");
                    $scope.ERAClaimsObj.ERAStatusId = 5;
                    //$uibModalInstance.close("close");
                }
                console.log(resp);

            }
            function onError(reponse) {
            }
        }

        $scope.saveERAEOBApproveandPost = function () {
            var params = {
                "UserId": $scope.UserId,
                "EraId": $scope.ERAClaimsObj.EraId || 0,
                "IsPostPayment": true,
                "IsAllClaims": true,
                "PostingDate": currentdate,
                "ClaimsList": []
            }


           
               
            console.log(JSON.stringify(params));

            eHnoteInsuranceService.UpdateERAToBeActive(params, onSuccess, onError);
            function onSuccess(resp) {
                console.log(resp);
                if (resp.Status === 'Success') {
                    alertify.success("Posted Successfully");
                    $scope.ERAClaimsObj.ERAStatusId = 7;
                    //$uibModalInstance.close("close");
                }
             

            }
            function onError(reponse) {
            }
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
                "BillingProviderTaxID": "",
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
                "PrintedDatenTime": "",
                "ParsedDate": "",
                "TotalPatientResponsibilityAmount": 0,
                "ClaimAdjustmentAmount": 0,
                "TotalOtherAdjustmentAmount": 0,
                "TotalClaimsAmountData": 0,
                "AllTotalOtherAdjAmt": 0,
                "ProviderAdjustments": [],
                "LegendCodeList": [],
                "GlobalPayorId": 0,
            };
            return obj;
        };

        $scope.EOBPrintMainObj = getnewEOBPrintClaimObj();

        $scope.navtoPrintClaimsEOB = function (item) {


            // item.ClaimPaymentInfo = response.data.rows || [];

            //$scope.EOBPrintMainObj = getnewEOBPrintClaimObj();


            $scope.EOBPrintMainObj.PayorName = item.PayerName || "";
            $scope.EOBPrintMainObj.GlobalPayorId = item.GlobalPayorId || 0;
            $scope.EOBPrintMainObj.PayorCode = item.PayerCode || "";
            $scope.EOBPrintMainObj.PayorNPI = item.PayerNPI || "";
            $scope.EOBPrintMainObj.PayorAddress1 = item.PayerAddress1 || "";
            $scope.EOBPrintMainObj.PayorAddress2 = item.PayerAddress2 || "";
            $scope.EOBPrintMainObj.PayorZipCode = item.PayerZip || "";
            $scope.EOBPrintMainObj.PayorCity = item.PayerCity || "";
            $scope.EOBPrintMainObj.PayorState = item.PayerState || "";
            $scope.EOBPrintMainObj.PayorWWW = item.PayerWWW || "";
            $scope.EOBPrintMainObj.PayorContactNumber = item.PayorContactNumber || "";
            $scope.EOBPrintMainObj.TraceNumber = item.TransactionNumber || "";
            $scope.EOBPrintMainObj.PaymentMode = item.PaymentMethod || "";
            $scope.EOBPrintMainObj.ChequeOrEFTDate = item.TransactionDate || "";
           /* $scope.EOBPrintMainObj.TotalPaymentAmount = item.TransactionAmount || "";*/
            $scope.EOBPrintMainObj.TotalAdjustmentAmount = 0 || "";
            $scope.EOBPrintMainObj.TotalChargeAmount = item.TotalChargeAmount || "";
            $scope.EOBPrintMainObj.BillingProviderName = item.BillIngProviderName || "";
            $scope.EOBPrintMainObj.BillingProviderNPI = item.BillingProviderNPI || "";
            $scope.EOBPrintMainObj.BillingProviderAddress1 = item.BillingProviderAddress1 || "";
            $scope.EOBPrintMainObj.BillingProviderAddress2 = item.BillingProviderAddress2 || "";
            $scope.EOBPrintMainObj.BillingProviderZipCode = item.BillingProviderZip || "";
            $scope.EOBPrintMainObj.BillingProviderCity = item.BillingProviderCity || "";
            $scope.EOBPrintMainObj.BillingProviderState = item.BillingProviderState || "";
            $scope.EOBPrintMainObj.BillingProviderTaxID = item.BillingProviderTaxID || "";
            $scope.EOBPrintMainObj.BillingProviderTaxonomyId = item.BillingProviderTaxonomyId || "";

            $scope.EOBPrintMainObj.OrganizationName = item.OrganizationName || "";
            $scope.EOBPrintMainObj.OrganizationAddress1 = item.OrganizationAddress1 || "";
            $scope.EOBPrintMainObj.OrganizationAddress2 = item.OrganizationAddress2 || "";
            $scope.EOBPrintMainObj.OrganizationCity = item.OrganizationCity || "";
            $scope.EOBPrintMainObj.OrganizationState = item.OrganizationState || "";
            $scope.EOBPrintMainObj.OrganizationStateCode = item.OrganizationStateCode || "";
            $scope.EOBPrintMainObj.OrganizationZipCode = item.OrganizationZipCode || "";
            $scope.EOBPrintMainObj.OrganizationNPI = $scope.BranchNPI || "";
            $scope.EOBPrintMainObj.ParseDate = item.ParseDate || "";
            $scope.EOBPrintMainObj.TotalClaimChargeAmount = item.TotalClaimChargeAmount || 0,
                $scope.EOBPrintMainObj.TotalPatientResponsibilityAmount = item.TotalClaimPatientRespAmount || 0,
                $scope.EOBPrintMainObj.ClaimAdjustmentAmount = item.TotalClaimAdjustmentAmount || 0,
               /* $scope.EOBPrintMainObj.TotalOtherAdjustmentAmount = item.TotalOtherAdjustmentAmount || 0,*/
                $scope.EOBPrintMainObj.TotalPaymentAmount = item.TotalClaimPaidAmount || 0;

            $scope.EOBPrintMainObj.LegendCodeList = item.LegendCodeList || [];

            $scope.EOBPrintMainObj.ProviderAdjustments = item.ProviderAdjustments || [];
            $scope.EOBPrintMainObj.TotalWUAdjAmt = 0;
            angular.forEach($scope.EOBPrintMainObj.ProviderAdjustments, function (pitem) {
                $scope.EOBPrintMainObj.TotalWUAdjAmt += pitem.AdjustmentAmount || 0;
            });
            $scope.EOBPrintMainObj.TotalPaidAmount = 0;
            $scope.EOBPrintMainObj.TotalVoucherAmount = 0;
            $scope.EOBPrintMainObj.TotalPaidAmount = $scope.EOBPrintMainObj.TotalPaymentAmount + $scope.EOBPrintMainObj.TotalWUAdjAmt || 0;
            $scope.EOBPrintMainObj.TotalVoucherAmount = $scope.EOBPrintMainObj.TotalPaymentAmount - $scope.EOBPrintMainObj.TotalWUAdjAmt || 0;

            $scope.EOBPrintMainObj.TotalPaidAmount = $scope.EOBPrintMainObj.TotalPaidAmount.toFixed(2);
            $scope.EOBPrintMainObj.TotalVoucherAmount = $scope.EOBPrintMainObj.TotalVoucherAmount.toFixed(2);

                var MatchedandUnMatchedClaimsList = item.ClaimsList.concat(item.UnMatchedClaimsList);
            console.log(MatchedandUnMatchedClaimsList);
            $scope.EOBPrintMainObj.TotalClaimsAmountData = 0;
            $scope.EOBPrintMainObj.AllTotalPatientRespAmt = 0;
            $scope.EOBPrintMainObj.AllTotalAdjAmount = 0;
            angular.forEach(MatchedandUnMatchedClaimsList, function (citem) {
                $scope.EOBPrintMainObj.TotalClaimsAmountData += citem.ClaimAmount || 0;
                $scope.EOBPrintMainObj.AllTotalPatientRespAmt += citem.TotalPatientRespAmount || 0;
                $scope.EOBPrintMainObj.AllTotalOtherAdjAmt += citem.TotalOtherAdjAmount || 0;
                $scope.EOBPrintMainObj.AllTotalAdjAmount += citem.TotalAdjustmentAmount || 0;

                citem.AllAdjustmentAmount = 0;
                angular.forEach(citem.ClaimLineItems, function (pitem) {
                    angular.forEach(pitem.LineItemAdjustments, function (aitem) {
                        citem.AllAdjustmentAmount += aitem.AdjustmentAmount || 0;
                    })

                })


            });

            $scope.EOBPrintMainObj.ClaimPaymentInfo = MatchedandUnMatchedClaimsList || [];
            $scope.EOBPrintMainObj.ClaimAdjustments = [];
            $scope.EOBPrintMainObj.ClaimLegends = [];
            $scope.EOBPrintMainObj.PrintedDatenTime = "";
            

            var tadjAmt = 0;

            var tempadjarray = [], tempadjLegendsarray = [];

            angular.forEach(item.ClaimsList, function (gitem) {
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


            //angular.forEach($scope.EOBPrintMainObj.ClaimPaymentInfo, function (item) {
            //    angular.forEach(item.BillingDetails, function (bitem) {
            //        var filarray = $filter("filter")(item.ServiceLines, { "ProcedureId": bitem.ProcedureID }, true);
            //        if (filarray.length > 0) {
            //            bitem.BilledCost1 = filarray[0].PaymentAmount;
            //            filarray[0].ServiceAdjustments = filarray[0].ServiceAdjustments || [];
            //            if (filarray[0].ServiceAdjustments.length > 0) {
            //                angular.forEach(filarray[0].ServiceAdjustments, function (asitem) {
            //                    var obj = {
            //                        "ServiceAdjustmentId": 0,
            //                        "AdjustmentCodeId": "",
            //                        "ReasonCode": asitem.AdjustmentCodeId,
            //                        "AdjustmentCodeTypeId": "",
            //                        "AdjustmentCode": asitem.AdjustmentCode,
            //                        "AdjustmentAmount": asitem.AdjustmentAmount,
            //                        "DeleteInd": "N"
            //                    }


            //                    var reasonArray = $filter("filter")($scope.PaymentReasonList, { "ReasonCode": asitem.AdjustmentCodeId }, true);
            //                    if (reasonArray.length > 0) {
            //                        obj.AdjustmentCodeId = reasonArray[0].AdjustmentCodeId;

            //                    }

            //                    var adjcArray = $filter("filter")($scope.AdjustmentCodeTypes, { "AdjustmentCode": asitem.AdjustmentCode }, true);
            //                    if (adjcArray.length > 0) {
            //                        obj.AdjustmentCodeTypeId = adjcArray[0].AdjustmentTypeId;

            //                    }


            //                    bitem.ServiceAdjustments.push(obj);
            //                });
            //            }
            //        }

            //    });
            //});
            //angular.forEach($scope.EOBPrintMainObj.ClaimPaymentInfo, function (item) {
            //    item.IsPayorpayment = false;
            //    $scope.PatientResponsibilityAmount = 0;
            //    item.ClaimPaymentAmount = parseFloat(item.ClaimAdjustmentAmount)||0;
            //    $scope.IsEligibleForSecondaryClaim = false;
            //    item.ClaimAdjustmentAmount = parseFloat(item.ClaimAdjustmentAmount)||0;
            //    item.ClaimCoInsuranceAmount = parseFloat(item.ClaimCoInsuranceAmount) || 0;
            //    item.ClaimOtherAdjustmentAmount = parseFloat(item.ClaimOtherAdjustmentAmount) || 0;
            //    item.ClaimTotalAdjustmentAmount = parseFloat(item.ClaimTotalAdjustmentAmount) || 0;







            //    $scope.AllBillDetails = [];
            //    angular.forEach(item.BillingDetails, function (Aitem) {
            //        Aitem.BilledCost = Aitem.BilledCost || 0;
            //        Aitem.BilledCost1 = parseInt(Aitem.BilledCost1) || null;
            //        Aitem.AdjustmentAmount = parseFloat(Aitem.AdjustmentAmount) || 0;
            //        Aitem.TotalAdjustmentAmount = parseFloat(Aitem.TotalAdjustmentAmount) || 0;
            //        Aitem.CoInsuranceAmount = parseFloat(Aitem.CoInsuranceAmount) || 0;
            //        Aitem.PatientResponsibilityAmount = parseFloat(Aitem.PatientResponsibilityAmount) || 0;
            //        Aitem.OtherAdjustmentAmount = parseFloat(Aitem.OtherAdjustmentAmount) || 0;


            //        if (Aitem.BilledCost1 !== null) {


            //            //Aitem.BilledCost = parseFloat(Aitem.BilledCost) || null;
            //            //ReceivedAmount += Aitem.BilledCost;
            //            angular.forEach(Aitem.ServiceAdjustments, function (Bitem) {
            //                Bitem.AdjustmentAmount = parseInt(Bitem.AdjustmentAmount) || 0;
            //                Aitem.TotalAdjustmentAmount += parseInt(Bitem.AdjustmentAmount) || 0;
            //                if (Bitem.AdjustmentCodeTypeId === 5) {

            //                    console.log(Bitem.AdjustmentCodeId);

            //                    //if (Bitem.AdjustmentCodeId == 2) {
            //                    //    Aitem.CoInsuranceAmount += Bitem.AdjustmentAmount || 0;
            //                    //} else {
            //                    //    Aitem.PatientResponsibilityAmount += Bitem.AdjustmentAmount || 0;
            //                    //}
            //                    Aitem.PatientResponsibilityAmount += Bitem.AdjustmentAmount || 0;
            //                } else if (Bitem.AdjustmentCodeTypeId === 1) {
            //                    Aitem.AdjustmentAmount += Bitem.AdjustmentAmount || 0;
            //                } else {
            //                    Aitem.OtherAdjustmentAmount += Bitem.AdjustmentAmount || 0;
            //                }


            //            });
            //            var billitems = {
            //                "ProcedureCode": Aitem.CPTCode,
            //                "BillingDetailId": Aitem.BillingDetailId || 0,
            //                "ProcedureDate": "",
            //                "ChargeAmount": Aitem.TotalAmount || 0,
            //                "AllowedActualAmount": Aitem.AllowedAmount || 0,
            //                "PaymentAmount": Aitem.BilledCost,
            //                "TotalAdjustmentAmount": Aitem.TotalAdjustmentAmount || 0,
            //                "AdjustmentAmount": Aitem.AdjustmentAmount || 0,
            //                "OtherAdjustmentAmount": Aitem.OtherAdjustmentAmount || 0,
            //                "PatientResponsibility": Aitem.PatientResponsibilityAmount || 0,
            //                "CoInsurance": Aitem.CoInsuranceAmount || 0,
            //                "ServiceAdjustments": Aitem.ServiceAdjustments || [],
            //            }


            //            $scope.AllBillDetails.push(billitems);
            //            item.IsPayorpayment = true;

            //            //billitems.AllowedActualAmount = parseInt(billitems.AllowedActualAmount) || 0;
            //            //billitems.PaymentAmount = parseInt(billitems.PaymentAmount) || 0;
            //            //billitems.AdjustmentAmount = parseInt(billitems.AdjustmentAmount) || 0;
            //            //billitems.PatientResponsibility = parseInt(billitems.PatientResponsibility) || 0;
            //            //billitems.CoInsurance = parseInt(billitems.CoInsurance) || 0;

            //            //$scope.CoverageAmount += billitems.AllowedActualAmount || 0;
            //            //$scope.PatientResponsibilityAmount += billitems.PatientResponsibility || 0;
            //            //$scope.ClaimPaymentAmount = billitems.PaymentAmount || 0;
            //            //$scope.ClaimAdjustmentAmount += billitems.AdjustmentAmount || 0;

            //        }


            //    });
            //    if ($scope.AllBillDetails.length > 0) {
            //        angular.forEach($scope.AllBillDetails, function (aitem) {
            //            aitem.AllowedActualAmount = parseInt(aitem.AllowedActualAmount) || 0;
            //            aitem.PaymentAmount = parseInt(aitem.PaymentAmount) || 0;
            //            aitem.AdjustmentAmount = parseInt(aitem.AdjustmentAmount) || 0;
            //            aitem.OtherAdjustmentAmount = parseInt(aitem.OtherAdjustmentAmount) || 0;
            //            aitem.PatientResponsibility = parseInt(aitem.PatientResponsibility) || 0;
            //            aitem.CoInsurance = parseInt(aitem.CoInsurance) || 0;
            //            aitem.TotalAdjustmentAmount = parseInt(aitem.TotalAdjustmentAmount) || 0;


            //            // $scope.CoverageAmount += item.AllowedActualAmount || 0;
            //            item.PatientResponsibilityAmount += aitem.PatientResponsibility || 0;
            //            item.ClaimPaymentAmount += aitem.PaymentAmount || 0;
            //            item.ClaimAdjustmentAmount += aitem.AdjustmentAmount || 0;
            //            item.ClaimTotalAdjustmentAmount += aitem.TotalAdjustmentAmount || 0;

            //            item.ClaimCoInsuranceAmount += aitem.CoInsurance || 0;
            //            item.ClaimOtherAdjustmentAmount += aitem.OtherAdjustmentAmount || 0;

            //            if (aitem.CoInsurance != 0) {
            //                item.IsEligibleForSecondaryClaim = true;
            //            }
            //        });
            //    }

            //    $scope.EOBPrintMainObj.TotalPatientResponsibilityAmount += parseFloat(item.PatientResponsibilityAmount) || 0;
            //    $scope.EOBPrintMainObj.TotalAdjustmentAmount += parseFloat(item.ClaimTotalAdjustmentAmount) || 0;
            //    $scope.EOBPrintMainObj.ClaimAdjustmentAmount += parseFloat(item.ClaimAdjustmentAmount) || 0;
            //    $scope.EOBPrintMainObj.TotalOtherAdjustmentAmount += parseFloat(item.ClaimOtherAdjustmentAmount) || 0;
            //});




            var printDate = $filter("date")(new Date(), "MMM-dd-yyyy");
            var printTime = moment(new Date()).format("HH:mm");
            var printDatemTime = printDate + '  ' + printTime;
            $scope.EOBPrintMainObj.PrintedDatenTime = printDatemTime;




            console.log($scope.EOBPrintMainObj);


            $timeout(function () {
                var innerContents = document.getElementById('EOBClaimprint').innerHTML;
                var popupWinindow = window.open('', 'scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                popupWinindow.document.open();
                popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()" class="bodyheightprint">' + innerContents + '</body></html>');
                popupWinindow.document.close();
            }, 500);




        }

        $scope.openAccordianItem = function (item) {
            const isCurrentlyOpen = item.isOpen;
            if ($scope.ERAClaimsObj.UnMatchedClaimsList) {
                $scope.ERAClaimsObj.UnMatchedClaimsList.forEach(subItem => {
                    subItem.isOpen = false;
                });
            }
            //if ($scope.ERAClaimsObj.ClaimsList) {
            //    $scope.ERAClaimsObj.ClaimsList.forEach(subItem => {
            //        subItem.isOpen = false;
            //    });
            //}            
            item.isOpen = !isCurrentlyOpen;
        };

        $scope.handleExternalSystemCheckboxChange = function (item) {
            if (item.IsCheckedExternalSystem == true) {
                $scope.UpdateERAstatusPopup(item);
            }
        };

        $scope.UpdateERAstatusPopup = function (item) {
            var obj = {
                "Selectitem": item,
                "EraId": item.EraId,
                "UserId": $scope.UserId,
                "HospitalId": $scope.HospitalId
            }

            $scope.mInstanceAdd = $uibModal.open({
                templateUrl: "UpdateERApopup.html",
                backdrop: "static",
                size: "lg",
                keyboard: false,
                resolve: {
                    Selectobj: function () { return obj; }
                },
                controller: function ($scope, $uibModalInstance, Selectobj, eHnoteInsuranceService) {

                    $scope.getERAListObj = function () {
                        return {
                            "OrganizationId": Selectobj.HospitalId,
                            "UserId": Selectobj.UserId,
                            "EraId": Selectobj.EraId || null,
                            "ERAStatus": "External System",
                            "ERAStatusId": 9,
                            "MarkedBy": Selectobj.UserId,
                            "MarkedDate": $filter('date')(new Date(), "MM-dd-yyyy hh:mm:ss a"),
                            "Remarks": ""
                        };
                    };

                    $scope.ERAitemObj = $scope.getERAListObj();

                    $scope.close = function () {
                        Selectobj.Selectitem.IsCheckedExternalSystem = false;
                        $uibModalInstance.dismiss("cancel");
                    };

                    $scope.UpdateERAstatusByid = function () {
                        let reqObj = angular.copy($scope.ERAitemObj);
                        reqObj.Remarks = reqObj.Remarks || "";

                        eHnoteInsuranceService.UpdateERAStatus(reqObj).then(function (resp) {
                            if (resp.data[0].Status === "Success") {
                                alertify.success("Successfully Updated!");
                                $uibModalInstance.close("close");
                            }
                        }, function () {
                            alertify.error("Update failed.");
                        });
                    };
                }
            });

            $scope.mInstanceAdd.result.then(function () {
                $scope.init(); 
            }, function () {
                item.IsCheckedExternalSystem = false;
            });
        };

        $scope.ERAstatusPopover1 = {
            templateUrl: 'ERAstatusPopover1.html',
        };

        $scope.activeToggleType = 1;
        $scope.IsShowExpandIcons = false;
        $scope.toggleAllClaims = function (typeid) {
            $scope.activeToggleType = typeid;
            var expand = (typeid === 1);
            angular.forEach($scope.ERAClaimsObj.ClaimsList, function (item) {
                item.isOpen = expand;
            });
            if (typeid == 1) {
                $scope.IsShowExpandIcons = false;
            } else {
                $scope.IsShowExpandIcons = true;
            }
        };

        $scope.IsShowtoggleOpen = false;
        $scope.IsShowclaims = false;

        $scope.toggleclaimsOpen = function () {
            $scope.IsShowtoggleOpen = !$scope.IsShowtoggleOpen;

            if ($scope.IsShowtoggleOpen == false) {
                $scope.IsShowclaims = false;
            } else {
                $scope.IsShowclaims = true;
            }

        };


    }]);
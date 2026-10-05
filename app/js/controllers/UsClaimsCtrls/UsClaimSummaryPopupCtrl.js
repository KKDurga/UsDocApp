"use strict";
eHnoteWebApp.controller("UsClaimSummaryPopupCtrl", ["$scope", "$rootScope", "$uibModal", "$uibModalInstance", "eHnotePatientDataService", "datapersistanceFactory", "eHnoteInsuranceService", "$filter", "AllHospitalData", "eHnoteSettingsDataService", "eHnoteMainAdminServices", "eHnoteUserDataService", "eHnoteCacheStorageService", "$q", "alertify", "$http",
    function ($scope, $rootScope, $uibModal, $uibModalInstance, eHnotePatientDataService, datapersistanceFactory, eHnoteInsuranceService, $filter, AllHospitalData, eHnoteSettingsDataService, eHnoteMainAdminServices, eHnoteUserDataService, eHnoteCacheStorageService, $q, alertify, $http) {
        $scope.HospitalId = 0;
        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
            $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
        };

        let item = '';
        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        $scope.claimScreenParentObj = datapersistanceFactory.getItem("IsComingFromClaim");

        if ($scope.claimScreenParentObj.PatientId != 0) {
            $scope.cacheStorageItem.PatientID = $scope.claimScreenParentObj.PatientId || 0;
            $scope.cacheStorageItem.appointmentid = $scope.claimScreenParentObj.AppointmentId || 0;
            $scope.claimScreenParentObj.PatientClaimId = $scope.claimScreenParentObj.PatientClaimId || 0;
            $scope.claimScreenParentObj.SuperBillId = $scope.claimScreenParentObj.SuperBillId || 0;
            $scope.claimScreenParentObj.VisitId = $scope.claimScreenParentObj.VisitId || 0;

        }
        $scope.ClaimDetails = [];
        $scope.ServiceLineItemsArray = [];
        console.log(AllHospitalData);
        $scope.mainBillerDataObj = AllHospitalData;
        $scope.GetClaimDetails = function () {

            var claimId = $scope.claimScreenParentObj.PatientClaimId;
            eHnoteInsuranceService.GetParticularClaimDetailsById(claimId).then(function (resp) {

                $scope.ClaimDetails = resp.data || [];
                $scope.AppoinmentInsurance = $scope.ClaimDetails.AppointmentInsuranceDetails || [];
                $scope.AppoinmentInsurance.forEach(function (aitem) {
                    aitem.showclaimcontent = false;
                });
                $scope.AppoinmentInsuranceList = $scope.AppoinmentInsurance[0];

                $scope.daysUntilExpiry = 0;
                if ($scope.AppoinmentInsurance.length > 0) {
                    angular.forEach($scope.AppoinmentInsurance, function (item) {

                        $scope.AppoinmentInsuranceList.InsuranceExpiryDate = item.InsuranceExpiryDate || null;
                        if ($scope.AppoinmentInsuranceList.InsuranceExpiryDate != null) {

                            var expiryDate = new Date(item.InsuranceExpiryDate);
                            var currentDate = new Date();
                            var timeDifference = expiryDate - currentDate;
                            var dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

                            if (item.IdentifierId === 1) {
                                $scope.daysUntilExpiry = dayDifference;
                            } else {
                                $scope.secondarydaysUntilExpiry = dayDifference;
                            }

                            if (currentDate < expiryDate) {
                                $scope.daysUntilExpiry = dayDifference;
                                item.daysUntilExpiry = dayDifference;
                            } else {
                                $scope.daysUntilExpiry = "-" + Math.abs(dayDifference);
                                item.daysUntilExpiry = "-" + Math.abs(dayDifference);
                            }
                        }
                    });
                }

                $scope.PatientClaimLineItems = $scope.ClaimDetails.PatientClaimLineItems || [];
                $scope.ProcessingStatusArray = $scope.ClaimDetails.ProcessingStatusArray || [];
                $scope.ClaimPaymentPostingTransactions = $scope.ClaimDetails.ClaimPaymentPostingTransactions || [];
                $scope.PatientClaimLineItems.forEach(function (citem) {
                    citem.showTransactionContent = false;
                });
                $scope.TempDiagArrayList = [];
                $scope.ClaimTransactionsList = [];
                $scope.ServiceLineItems = [];
                if ($scope.PatientClaimLineItems.length > 0) {
                    angular.forEach($scope.PatientClaimLineItems, function (item) {

                        if (item.Modifiers) {
                            const modifiersArray = item.Modifiers.split(',').map(function (modifier) {
                                return modifier.trim();
                            });

                            const validModifiers = modifiersArray.filter(function (modifier) {
                                return modifier !== '';
                            });

                            if (validModifiers.length > 0) {
                                item.Modifiers = validModifiers.join(',');
                            } else {
                                item.Modifiers = '';
                            }
                        }

                        $scope.ServiceLineItems.push(item);
                        if (item.DiagnosisList.length > 0) {
                            angular.forEach(item.DiagnosisList, function (item1) {
                                $scope.TempDiagArrayList.push(item1);
                            });
                        }
                        if (item.ClaimTransactions.length > 0) {
                            $scope.ClaimTransactionsList.push(...item.ClaimTransactions);
                        }
                    });
                }

                var tempclaimobj = {};
                var tempclaimlist = [];
                if ($scope.ClaimTransactionsList.length > 0) {
                    angular.forEach($scope.ClaimTransactionsList, function (item) {
                        if (item.TransactionTypeId == 32 || item.TransactionTypeId == 36) {
                            tempclaimobj = angular.copy(item);
                        } else if (item.TransactionTypeId == 30) {
                            tempclaimobj.PatientAmount = item.PatientAmount;
                            tempclaimlist.push(tempclaimobj);
                            tempclaimobj = {};
                        }
                    });

                    if (tempclaimlist.length > 0) {
                        $scope.ClaimTransactionsList = angular.copy(tempclaimlist);
                        tempclaimobj = tempclaimobj || null;
                        if (tempclaimobj != null) {
                            $scope.ClaimTransactionsList.push(tempclaimobj);
                        }
                    } else {
                        $scope.ClaimTransactionsList = [];
                        $scope.ClaimTransactionsList.push(tempclaimobj);
                    }

                    $scope.mainBillerDataObj.ClaimTransactionsList = angular.copy($scope.ClaimTransactionsList);
                }



                $scope.ConsultDetailsArray = _.uniq($scope.TempDiagArrayList, false, function (p) { return p.DiagnosisId; });
                $scope.ServiceLineItemsArray = $scope.ServiceLineItems || [];

                var icdMapping = [
                    {
                        "ICD": $scope.ClaimDetails.ICD1,
                        "ICDName": $scope.ClaimDetails.ICD1Name,
                        "DiagnosisId": $scope.ClaimDetails.ICD1DiagnosisId || null,
                        "Type": "A"
                    },
                    {
                        "ICD": $scope.ClaimDetails.ICD2,
                        "ICDName": $scope.ClaimDetails.ICD2Name,
                        "DiagnosisId": $scope.ClaimDetails.ICD2DiagnosisId || null,
                        "Type": "B"
                    },
                    {
                        "ICD": $scope.ClaimDetails.ICD3,
                        "ICDName": $scope.ClaimDetails.ICD3Name,
                        "DiagnosisId": $scope.ClaimDetails.ICD3DiagnosisId || null,
                        "Type": "C"
                    },
                    {
                        "ICD": $scope.ClaimDetails.ICD4,
                        "ICDName": $scope.ClaimDetails.ICD4Name,
                        "DiagnosisId": $scope.ClaimDetails.ICD4DiagnosisId || null,
                        "Type": "D"
                    },
                    {
                        "ICD": $scope.ClaimDetails.ICD5,
                        "ICDName": $scope.ClaimDetails.ICD5Name,
                        "DiagnosisId": $scope.ClaimDetails.ICD5DiagnosisId || null,
                        "Type": "E"
                    },
                    {
                        "ICD": $scope.ClaimDetails.ICD6,
                        "ICDName": $scope.ClaimDetails.ICD6Name,
                        "DiagnosisId": $scope.ClaimDetails.ICD6DiagnosisId || null,
                        "Type": "F"
                    },
                    {
                        "ICD": $scope.ClaimDetails.ICD7,
                        "ICDName": $scope.ClaimDetails.ICD7Name,
                        "DiagnosisId": $scope.ClaimDetails.ICD7DiagnosisId || null,
                        "Type": "G"
                    },
                    {
                        "ICD": $scope.ClaimDetails.ICD8,
                        "ICDName": $scope.ClaimDetails.ICD8Name,
                        "DiagnosisId": $scope.ClaimDetails.ICD8DiagnosisId || null,
                        "Type": "H"
                    },
                    {
                        "ICD": $scope.ClaimDetails.ICD9,
                        "ICDName": $scope.ClaimDetails.ICD9Name,
                        "DiagnosisId": $scope.ClaimDetails.ICD9DiagnosisId || null,
                        "Type": "I"
                    },
                    {
                        "ICD": $scope.ClaimDetails.ICD10,
                        "ICDName": $scope.ClaimDetails.ICD10Name,
                        "DiagnosisId": $scope.ClaimDetails.ICD10DiagnosisId || null,
                        "Type": "J"
                    },
                    {
                        "ICD": $scope.ClaimDetails.ICD11,
                        "ICDName": $scope.ClaimDetails.ICD11Name,
                        "DiagnosisId": $scope.ClaimDetails.ICD11DiagnosisId || null,
                        "Type": "K"
                    },
                    {
                        "ICD": $scope.ClaimDetails.ICD12,
                        "ICDName": $scope.ClaimDetails.ICD12Name,
                        "DiagnosisId": $scope.ClaimDetails.ICD12DiagnosisId || null,
                        "Type": "L"
                    }
                ];

                if ($scope.ConsultDetailsArray.length > 0) {
                    angular.forEach(icdMapping, function (sitem) {
                        var isUnmatched = !$scope.ConsultDetailsArray.some(function (diag) {
                            return diag.ICDCode === sitem.ICD;
                        });

                        if (isUnmatched && sitem.ICD !="") {
                            var newEntry = {
                                "PatientClaimLineItemDiagnosisId": 0,
                                "ClaimLineItemId": 0,
                                "PatientClaimId": 0,
                                "DiagnosisId": sitem.DiagnosisId,
                                "ICDCode": sitem.ICD,
                                "Type": sitem.Type,
                                "DiagnosisName": sitem.ICDName,
                                "DeleteInd": "N"
                            };

                            $scope.ConsultDetailsArray.push(newEntry);
                        }

                    });
                }


               

                if ($scope.ProcessingStatusArray) {

                    angular.forEach($scope.ProcessingStatusArray, function (pitem) {
                        if (pitem.InsuranceLevelId === 1) {

                            $scope.primaryInsuranceClaimDetails.PatientInsuranceDetailId = pitem.PatientInsuranceDetailId;
                            $scope.primaryInsuranceClaimDetails.ClaimSubmissionDate = $scope.ClaimDetails.PrimaryInsuranceDateOfSubmission;
                            $scope.primaryInsuranceClaimDetails.ClaimStatusId = pitem.ClaimStatusId;
                            $scope.primaryInsuranceClaimDetails.ClaimStatus = pitem.ClaimStatus;
                            $scope.primaryInsuranceClaimDetails.ClaimAddress.Address1 = pitem.Address1;
                            $scope.primaryInsuranceClaimDetails.ClaimAddress.Address2 = pitem.Address2
                            $scope.primaryInsuranceClaimDetails.ClaimAddress.City = pitem.CityName;
                            $scope.primaryInsuranceClaimDetails.ClaimAddress.State = pitem.StateName;
                            $scope.primaryInsuranceClaimDetails.ClaimAddress.ZipCode = pitem.ZipCode;
                            $scope.primaryInsuranceClaimDetails.ClaimAddress.Country = pitem.CountryName;




                        }
                        if (pitem.InsuranceLevelId === 2) {

                            $scope.secondaryInsuranceClaimDetails.PatientInsuranceDetailId = pitem.PatientInsuranceDetailId;
                            $scope.secondaryInsuranceClaimDetails.ClaimSubmissionDate = $scope.ClaimDetails.SecondaryInsuranceDateOfSubmission;
                            $scope.secondaryInsuranceClaimDetails.ClaimStatusId = pitem.ClaimStatusId;
                            $scope.secondaryInsuranceClaimDetails.ClaimStatus = pitem.ClaimStatus;
                            $scope.secondaryInsuranceClaimDetails.ClaimAddress.Address1 = pitem.Address1;
                            $scope.secondaryInsuranceClaimDetails.ClaimAddress.Address2 = pitem.Address2
                            $scope.secondaryInsuranceClaimDetails.ClaimAddress.City = pitem.CityName;
                            $scope.secondaryInsuranceClaimDetails.ClaimAddress.State = pitem.StateName;
                            $scope.secondaryInsuranceClaimDetails.ClaimAddress.ZipCode = pitem.ZipCode;
                            $scope.secondaryInsuranceClaimDetails.ClaimAddress.Country = pitem.CountryName;



                        }
                    })
                }

                $scope.BillingProviderName = $scope.BillingProviderName || "";
                $scope.FacilityName = $scope.FacilityName || "";

                $scope.ClaimDetails.Patient = $scope.ClaimDetails.Patient || [];
                if ($scope.ClaimDetails.Patient.length > 0) {
                    var mobileno = $scope.ClaimDetails.Patient[0].MobileNo || "";
                    var obj = eHnoteUserDataService.UsMobileFormatChange(mobileno);
                    $scope.ClaimDetails.Patient[0].MobileNo = obj.UsFormatMobileNumber;
                }

            }, function (err) { console.log(err); });


        }
        // $scope.IsClaimStatus = false;
        $scope.Cliamsummary = function (item) {
            if (item.PatientInsuranceDetailId == $scope.primaryInsuranceClaimDetails.PatientInsuranceDetailId) {
                item.showclaimcontent = true;
            }
            else if (item.PatientInsuranceDetailId == $scope.secondaryInsuranceClaimDetails.PatientInsuranceDetailId) {
                item.showclaimcontent = true;
            }
            // $scope.IsClaimStatus = true;
        }
        $scope.claimEvenLogArray = [];
        $scope.PaymentSummarytab = 1;
        $scope.onPaymentsSummary = function (val) {
            $scope.PaymentSummarytab = val;
            if (val === 4) {
                $scope.getClaimEventLogList();
            }
        }


        $scope.getClaimEventLogList = function () {
            $scope.claimEvenLogArray = [];
            var params = {
                "PatientClaimId": $scope.claimScreenParentObj.PatientClaimId,
                "PatientId": $scope.claimScreenParentObj.PatientId
            }

            eHnoteInsuranceService.GetPatientClaimEventLogDetails(params).then(function (resp) {
                console.log(JSON.stringify(resp));
                if (resp.data.status == "Success") {
                    if (resp.data.rows.length > 0) {
                        $scope.claimEvenLogArray = resp.data.rows || [];
                    }
                } else {
                    alertify.error(resp.data.Message);
                }
            }, function (err) {

            });
        }
        $scope.showEligibilityHistoryPopup = function () {
            // console.log(item)
            debugger;
            $scope.obj = {
                // "PayorId": item.PayorId ,
                "PatientId": $scope.cacheStorageItem.PatientID
            }
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/UsClaims/EligibilityHistoryPopUp.html",
                "size": "lg",
                "backdrop": "static",
                "keyboard": false,
                "resolve": {
                    "Selectobj": function () { return $scope.obj; },
                    "OrganizationBase64LogoUrl": function () { return $scope.OrganizationBase64LogoUrl; },
                },
                "windowClass": "modal__ninety--  ",
                "controller": function ($scope, $uibModal, $uibModalInstance, Selectobj, OrganizationBase64LogoUrl) {

                    $scope.OrganizationBase64LogoUrl = OrganizationBase64LogoUrl || ''
                    $scope.InsuranceEligibilityHis = [];
                    $scope.InsuranceEligibilitySubscriberData = [];
                    eHnoteInsuranceService.GetEligibilityHistory(Selectobj, onsuccess, onerror);
                    function onsuccess(resp) {
                        if (resp.data.rows.length > 0) {
                            console.log(resp);
                            debugger
                            $scope.InsuranceEligibilityHis = resp.data.rows;
                            console.log($scope.InsuranceEligibilityHis);
                            $scope.navtoPatientEligibilitySummaryPopup($scope.InsuranceEligibilityHis[0]);

                        }
                    }
                    function onerror(err) {
                        console.log(err);
                    }
                    debugger;

                    $scope.navtoPatientEligibilitySummaryPopup = function (val) {
                        debugger
                        $scope.obj1 = {
                            "PatientInsuranceDetailId": val.PatientInsuranceDetailId,
                            "SubscriberId": val.SubscriberId
                        }
                        $scope.SelectedSubScriberId = $scope.obj1.SubscriberId;

                        eHnoteInsuranceService.GetEligibilitySubscribersDetails($scope.obj1, onsuccess, onerror);
                        function onsuccess(resp) {
                            if (resp.data.rows.length > 0) {
                                $scope.InsuranceEligibilitySubscriberData = resp.data.rows || [];
                                console.log($scope.InsuranceEligibilitySubscriberData)

                            }
                        }
                        function onerror(err) {
                            console.log(err);
                        }

                    }
                    $scope.ClosePopup = function () {
                        debugger
                        $uibModalInstance.dismiss("cancel");
                    };

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
                }


            });


        };
        $scope.openClaimLifeCyclePopup = function (item) {
            debugger;
            $scope.EdiClaimDetails = item;
           // $scope.Edis3UrlData = "";
            //$scope.Edis3UrlData = $scope.EdiClaimDetails.find(function (item) {
            //    return item.PatientInsuranceDetailId == $scope.EdiClaimDetails.PatientInsuranceDetailId;
            //});
            if ($scope.EdiClaimDetails.TransactionType=="837") {
                if (!$scope.EdiClaimDetails.FileS3URL || $scope.EdiClaimDetails.FileS3URL === "") {
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
                            "EdiClaimDetails": function () { return $scope.EdiClaimDetails.FileS3URL; },
                        },
                        "http": $http,
                        "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientDataService, EdiClaimDetails, $http) {

                            $scope.uibclose = function () {
                                $uibModalInstance.dismiss("cancel");
                            };
                            debugger
                            $scope.Edis3UrlData = EdiClaimDetails;
                            if ($scope.Edis3UrlData) {

                                loadFileContent($scope.Edis3UrlData);
                            }
                            function loadFileContent(edis3Url) {
                                if (edis3Url) {
                                    debugger
                                    $http.get(edis3Url)
                                        .then(function (response) {
                                            debugger
                                            $scope.fileContent = response.data;
                                        });
                                } else {
                                    $scope.fileContent = "";
                                }
                            }
                        }


                    });

                    $scope.mInstanceAdd.result.then(function (response) {
                    }, function () { });
                }


            }
            else {
                let mInstanceAdd = $uibModal.open({
                    "templateUrl": "claimAcknoledgement.html",
                    "size": "lg",
                    "backdrop": "static",
                    "keyboard": false,
                    "scope": $scope,
                    "windowClass": "  offcanves-right",
                    "controller": function ($scope, $uibModal, $uibModalInstance, eHnoteInsuranceService) {
                        $scope.uibclose = function () {
                            $uibModalInstance.dismiss("cancel");
                        };

                        $scope.ClaimAcknoledgementList = [];

                        $scope.Get277AcknowledgementsRespons = function () {
                            let obj = {
                                'PatientClaimId': item.PatientClaimId || '',
                                'TransactionId': item.TransactionId || '',
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
               // alertify.error("There is no edi for the claim");
            }
        }
        $scope.init = function () {
            $scope.Patientobj = {
                "PatientId": null,
                "FirstName": "",
                "LastName": "",
                "DOB": "",
                "Sex": "",
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
                "PatientDisplayId": null
            };
            $scope.OrganizationFacilityList = [];
            $scope.DepositTypes = [];
            var ApptInsReqObj = {
                "AppointmentId": $scope.cacheStorageItem.appointmentid,
                "PatientId": $scope.cacheStorageItem.PatientID,
                "SendPlanDetailsInd": 1
            }
            var params = {
                "OrganizationId": $scope.HospitalId,
                "FacilityName": ""
            };
            $q.all([
                eHnoteSettingsDataService.GetAllMasterClaimsData($scope.HospitalId),
                eHnoteInsuranceService.GetAppointmentInsuranceDetailsListByStatus(ApptInsReqObj),
                eHnoteMainAdminServices.GetOrganizationFacilityDetails(params),
            ]).then(function (resp) {
                if (resp[0].data.DepositTypes.length > 0) {
                    $scope.DepositTypes = resp[0].data.DepositTypes || [];
                }
                if (resp[0].data.WriteOffReasons.length > 0) {
                    $scope.WriteOffReasons = resp[0].data.WriteOffReasons || [];
                }
                if (resp[1].data.Patient != '') {
                    $scope.Patientobj.PatientId = resp[1].data.Patient.PatientId || null;
                    $scope.Patientobj.FirstName = resp[1].data.Patient.FirstName || '';
                    $scope.Patientobj.LastName = resp[1].data.Patient.LastName || '';
                    $scope.Patientobj.S3URL = resp[1].data.Patient.S3URL || '';

                    resp[1].data.Patient.PermanentAddress = resp[1].data.Patient.PermanentAddress || null;
                    if (resp[1].data.Patient.PermanentAddress != null) {
                        $scope.Patientobj.Address1 = resp[1].data.Patient.PermanentAddress.Address1 || "";
                        $scope.Patientobj.Address2 = resp[1].data.Patient.PermanentAddress.Address2 || "";
                        $scope.Patientobj.CityName = resp[1].data.Patient.PermanentAddress.CityName || "";
                        $scope.Patientobj.StateName = resp[1].data.Patient.PermanentAddress.StateName || "";
                        $scope.Patientobj.ZipCode = resp[1].data.Patient.PermanentAddress.ZipCode || "";
                        $scope.Patientobj.StateCode = resp[1].data.Patient.PermanentAddress.StateCode || "";
                    }
                    $scope.Patientobj.Gender = resp[1].data.Patient.Sex || "";

                    $scope.Patientobj.Sex = resp[1].data.Patient.Sex || '';
                    let MobileNo = resp[1].data.Patient.MobileNo || '';
                    $scope.Patientobj.EmailId = resp[1].data.Patient.EmailId || '';
                    $scope.Patientobj.PatientDisplayId = resp[1].data.Patient.PatientDisplayId || '';
                    if (resp[1].data.Patient.DOB != "") {
                        $scope.Patientobj.DOB = $filter('date')(resp[1].data.Patient.DOB, "MM-dd-yyyy");
                    }
                    if (MobileNo != '') {
                        var obj = eHnoteUserDataService.UsMobileFormatChange(MobileNo);
                        $scope.Patientobj.MobileNo = obj.UsFormatMobileNumber;
                    }

                }

                if (resp[1].data.PatientInsuranceList.length !== 0) {
                    $scope.PatientInsuranceList = resp[1].data.PatientInsuranceList || [];

                }

                if (resp[2].data.status == "Success") {
                    resp[2].data.rows = resp[2].data.rows || [];
                    if (resp[2].data.rows.length > 0) {
                        $scope.OrganizationFacilityList = angular.copy(resp[2].data.rows);
                    }
                }
            }, function (err) {
                console.log(err);
                alertify.error("Getting Data Failed");
            });
            $scope.GetClaimDetails();
        }
        $scope.init();

        $scope.showLineitemsTransaction = function (item) {

            item.showTransactionContent = !item.showTransactionContent;
        }
        $scope.uibclose = function () {
            $uibModalInstance.dismiss("cancel");
        };


        $scope.$on('AddUpdateClaim', function (event) {
            /*   $scope.uibclose();*/
            $uibModalInstance.close("save");
            //$scope.consultationModulePrint($scope.printAll);
        });

        $scope.navtoOpenPopupDetails = function (item, id) {
            let AppointmentId = null;
            let PatientId = null;
            let VisitId = 0;
            if ($scope.claimScreenParentObj != '') {
                AppointmentId = $scope.claimScreenParentObj.AppointmentId;
                PatientId = $scope.claimScreenParentObj.PatientId;
                VisitId = $scope.claimScreenParentObj.VisitId || 0;
            }
            $scope.claimScreenParentObj = {
                "PatientId": PatientId || null,
                "AppointmentId": AppointmentId || null,
                "VisitId": VisitId,
                "ActionType": "AddClaim",
                "SubActionType": "Verify",
                "ScreenType": "Popup",
                "SuperBillId": null,
                "PatientClaimId": $scope.claimScreenParentObj.PatientClaimId,
                "SuperBillArray": [],
            };

            datapersistanceFactory.set("IsComingFromClaim", $scope.claimScreenParentObj);


            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/UsClaims/ClaimPatientProfile.html",
                "size": "lg",
                "keyboard": false,
                "controller": "UsClaimPatientProfileCtrl",
                "windowClass": "offcanves-right  ",
                "resolve": {
                    "PatientInsuranceListData": function () { return item; },
                    "id": function () { return id; },
                    "AllHospitalData": function () { return $scope.mainBillerDataObj || null; },
                    "IshideIndicator": true,
                }

            });

        }


        $scope.navtoOpenClaimAddupdatePopup = function () {

            console.log($scope.claimScreenParentObj);


            let AppointmentId = null;
            let PatientId = null;
            if ($scope.claimScreenParentObj != '') {
                AppointmentId = $scope.claimScreenParentObj.AppointmentId;
                PatientId = $scope.claimScreenParentObj.PatientId;
            }
            $scope.claimScreenParentObj = {
                "PatientId": PatientId || null,
                "AppointmentId": AppointmentId || null,
                "ActionType": "EditClaim",
                "SubActionType": "Verify",
                "ScreenType": "Popup",
                "SuperBillId": null,
                "PatientClaimId": $scope.claimScreenParentObj.PatientClaimId,
                "SuperBillArray": [],
            };

            datapersistanceFactory.set("IsComingFromClaim", $scope.claimScreenParentObj);
            $uibModalInstance.dismiss("cancel");
            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/UsClaims/AddUpdateClaimPopup.html",
                "size": "lg",
                "keyboard": false,
                "controller": "UsAddUpdateClaimPopupCtrl",
                "windowClass": "modal__ninety--",
                // "windowClass": "modal__popup--1 bottom-to-top-modal in  ",
                "resolve": {
                    "mainBillerDataObj": function () { return $scope.mainBillerDataObj || null; },
                }

            });

            $scope.mInstanceAdd.result.then(function (response) {

                console.log(response);
                response = response || "";
                if (response == 'saveandcreate') {
                    $uibModalInstance.close("saveandcreate");
                } else {
                    $uibModalInstance.close("save");
                }




            }, function () { });
        }


        $scope.primaryInsuranceClaimDetails = {
            "PatientInsuranceDetailId": 0,
            "ClaimSubmissionDate": "",
            "ClaimStatusId": 0,
            "ClaimStatus": "",
            "ClaimAddress": {
                "Address1": "",
                "Address2": "",
                "City": "",
                "State": "",
                "ZipCode": "",
                "Country": ""
            }
        };

        $scope.secondaryInsuranceClaimDetails = {
            "PatientInsuranceDetailId": 0,
            "ClaimSubmissionDate": "",
            "ClaimStatusId": 0,
            "ClaimStatus": "",
            "ClaimAddress": {
                "Address1": "",
                "Address2": "",
                "City": "",
                "State": "",
                "ZipCode": "",
                "Country": ""
            }
        };

        $scope.navtoOpenAddDepositAmount = function () {
            $scope.obj = {
                "PatientId": $scope.cacheStorageItem.PatientID,
                "Type": '',
                "UsersList": $scope.mainBillerDataObj.allUserList,
                "Patientobj": $scope.Patientobj,
                "OrganizationFacilityList": $scope.OrganizationFacilityList,
                "DepositTypes": $scope.DepositTypes,
                "WriteOffReasons": $scope.WriteOffReasons,
                "PatientClaimId": $scope.claimScreenParentObj.PatientClaimId,
                "BillingProviderName": $scope.ClaimDetails.BillingProviderName || "",
                "FacilityName": $scope.ClaimDetails.FacilityName || ""
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
                $scope.GetClaimDetails();
                //$scope.SearchPatientDepositsObj = angular.copy($scope.GetPatientDepositsLitsObj());
                /*$scope.SearchPatientDepositslist("pageLoad");*/
            }, function () { });
        }


        $scope.clickviewcardpopup = function (item, type) {

            let filteredPatientInsuranceList = $scope.PatientInsuranceList.filter(function (insurance) {
                return insurance.PatientInsuranceDetailId === item.PatientInsuranceDetailId;
            });
            console.log(filteredPatientInsuranceList);
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/viewcardpopup.html",
                "backdrop": "static",
                "keyboard": false,
                "scope": $scope,
                "windowClass": "appointment-full-popup  ",
                "resolve": {
                    "InsuranceSummary": function () { return item; },
                    "TypeInsurance": function () { return type; },
                    "PatientInsuranceList": function () { return filteredPatientInsuranceList; }
                },
                "controller": function ($scope, $uibModal, $uibModalInstance, InsuranceSummary, TypeInsurance, PatientInsuranceList) {

                    $scope.InsuranceData = InsuranceSummary || [];
                    $scope.InsuranceType = TypeInsurance || ''
                    $scope.PatientInsuranceList = PatientInsuranceList || [];
                    if ($scope.PatientInsuranceList.length > 0) {
                        $scope.PatientInsuranceDocumentList = $scope.PatientInsuranceList[0].PatientDocumentDetails || [];
                    }
                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                }
            });
        };

        $scope.CalimInsurancepopup = function (item, id) {
            item = item || null;
            id = id || 0;
            if (item == null) {
                return false;
            }

            let mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/UsClaims/ClaimPatientProfile.html",
                "controller": "UsClaimPatientProfileCtrl",
                "backdrop": "static",
                "keyboard": false,
                "windowClass": "offcanves-right",
                "size": "lg",
                "resolve": {
                    "AllHospitalData": function () { return $scope.mainBillerDataObj; },
                    "PatientInsuranceListData": function () { return item; },
                    "id": function () { return id; },
                    "IshideIndicator": true,
                }
            });
        };
    }]);
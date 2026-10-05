

eHnoteWebApp.controller("EhnoteInvestigationBillingCtrl", ["$scope", "eHnoteProcedureDataService", "eHnotePatientDataService", "eHnoteMasterDataService", "$location", "alertify", "eHnotePrintService", "$filter", "eHnoteLoginStatusService", "$timeout", "$uibModal", "eHnoteCacheStorageService", "eHnoteSettingsDataService", "datapersistanceFactory", "eHnotePatientAddressDataServices", "$rootScope", "localStorageFactory", "eHnoteSurgeryService", "HInventoryService", "eHnotePatientPVService", "eHnoteLabService", "eHnoteDiagnosisDataServices", "eHnoteInsuranceService", function ($scope, eHnoteProcedureDataService, eHnotePatientDataService, eHnoteMasterDataService, $location, alertify, eHnotePrintService, $filter, eHnoteLoginStatusService, $timeout, $uibModal, eHnoteCacheStorageService, eHnoteSettingsDataService, datapersistanceFactory, eHnotePatientAddressDataServices, $rootScope, localStorageFactory, eHnoteSurgeryService, HInventoryService, eHnotePatientPVService, eHnoteLabService, eHnoteDiagnosisDataServices, eHnoteInsuranceService) {

    var object = "";

    $scope.comingFrom = $scope.comingFrom || "";
    $scope.IsSendMail = false;
    $scope.IsSendSms = false;
    $scope.HospitalArray = [];
    $scope.IsPatientDirectBilling = false;
    $scope.HospitalIdsArray = [];
    $scope.DisablePayment = true;
    $scope.DisableAmtEntry = true;
    $rootScope.patientdetailesConsultation = false;

    $scope.UserSettingsData = datapersistanceFactory.getItem("UserSettingsData");
    $scope.OrganizationSettingData = datapersistanceFactory.getItem("OrganizationSettingsData");



    $scope.InvSpecialityId = 3;
    $scope.editBillingOption = false;
    $scope.editBillingItem = false;
    $scope.showpreviousadvancerow = false;
    $scope.editBillingItemandCost = false;
    $scope.billFromInventory = false;
    $scope.ShowPaymentDetails = false;
    $scope.IsCreditBillingType = 'No';


    var doctorinfo = eHnoteMasterDataService.getUserInfo();



    if (doctorinfo.doctordata.User[0].IsEnableEditBillingOption !== undefined) {

        $scope.editBillingOption = doctorinfo.doctordata.User[0].IsEnableEditBillingOption;
    }
    $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
    var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
    $scope.HospitalID = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
    $scope.ParentHospitalID = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
    $scope.patientWiseBillHistory = [];

    $scope.check_location = $location.url();

    $scope.consultationTreatments = [];
    $scope.surgeryHistoryList = [];
    $scope.InvestigationTreatments = [];

    var mObj = datapersistanceFactory.getItem("masterDataArrays");
    $scope.masterPaymentModes = [];
    $scope.masterRefundPaymentModes = [];


    if (mObj.PaymentModes && mObj.PaymentModes.length > 0) {
        $scope.masterPaymentModes = mObj.PaymentModes;
        for (var i = $scope.masterPaymentModes.length - 1; i >= 0; i--) {
            if ($scope.masterPaymentModes[i].PaymentModeId === 33 || $scope.masterPaymentModes[i].PaymentModeId === 34 || $scope.masterPaymentModes[i].PaymentModeId === 39) {
                $scope.masterPaymentModes.splice(i, 1);
            }
        }
    }

    var filteredpaymentmodes = $filter("filter")($scope.masterPaymentModes, function (item) {
        return item.PaymentModeId === 1 || item.PaymentModeId === 2 || item.PaymentModeId === 3;
    });
    $scope.masterRefundPaymentModes = angular.copy(filteredpaymentmodes);

    if (userLoginDetails.RoleID !== undefined) {
        if (userLoginDetails.RoleID === 10 || userLoginDetails.RoleID === 2) {
            $scope.showHideCreateBillBtn = false;
        }

    }


    $scope.CallingFrom = "";
    $scope.selectedCardType = "";
    $scope.sendDocSms = false;
    $scope.sendDocEmail = false;
    $scope.sendPatientSms = false;
    $scope.sendPatientEmail = false;

    $scope.PrintObj = {};
    var printsettingObj = eHnoteMasterDataService.getPrintSettingInfo() || null;
    $scope.PrintObj.PrintLanguageId = printsettingObj.Language;
    $scope.DoctorSpecializationId = 0;
    var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();

    console.log(appointmentinfo);
    $scope.isRedirectBilling = appointmentinfo.CaptureBillingFrom;
    $scope.selecteddate = appointmentinfo.SelectedDate;

    if (appointmentinfo.PatientDetails != undefined) {
        appointmentinfo.PatientID = appointmentinfo.PatientDetails.PatientID;
    }
    if (appointmentinfo.DoctorSpecializationId === 2) {
        $scope.DoctorSpecializationId = appointmentinfo.DoctorSpecializationId;
    }

    $scope.ShowPatientGst = false;

    $scope.tempIndividualTotalAmt = 0;
    var BillItemLevelBilledCostCount = 0;
    $scope.AppointmentDatesArray = [];

    var cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();

    $scope.LastVisitedDate = appointmentinfo.LastVisitedDate;
    $scope.IsTodayAppt = false;
    $scope.IsDummyAppt = false;
    $scope.editinvoice = false;

    $scope.selectedBillingCategoryTypeId = 1;
    $scope.selectedOrgInsuranceTpaId = 0;
    $scope.selectedBillingModeId = 1;
    $scope.IsCreditBill = false;
    $scope.PatientInsuranceDetailId = 0;

    var paymentType = parseFloat(appointmentinfo.PaymentTypeId) || 1;
    $scope.selectedBillingModeId = paymentType;
    var orgInstpaId = parseFloat(appointmentinfo.OrgInsuranceTpaId) || 0;
    $scope.selectedOrgInsuranceTpaId = orgInstpaId;








    $scope.SelectedAdvanceBillObject = "";
    $scope.SelectedPatientBillId = "";
    $scope.SelectedTowards = 1;
    $scope.DummyApptBillingDetails = [];


    $rootScope.patientAllSearchHeader = false;



    $scope.viewDisID = "";


    $scope.IsPatientSelectedBilling = false;

    $scope.CreditDisablePayment = true;


    $scope.staticPreviousTotalRecievedAmount = 0;
    $scope.staticTotalBalance = 0;
    $scope.staticPreviousPaidAmount = 0;

    //$scope.tempGstNoArray = [];
    $scope.masterTreatLevelType = "O";


    if ($scope.SpecializationId === 2) {//Dentistry
        $scope.masterTreatLevelType = "G";
    }
    if ($scope.SpecializationId === 3) { //Ophthalmology
        $scope.masterTreatLevelType = "O";
    }

    $scope.CommunicationdetailsArray = $scope.UserSettingsData.CommunicationsSettings;
    angular.forEach($scope.CommunicationdetailsArray, function (item, index) {
        if (item.Mode === "doctor") {
            $scope.sendDocSms = item.SmsSettingsObj.Billing;
            $scope.sendDocEmail = item.EmailSettingObj.Billing;
        }
        if (item.Mode === "patient") {
            $scope.sendPatientSms = item.SmsSettingsObj.Billing;
            $scope.sendPatientEmail = item.EmailSettingObj.Billing;
        }
    });











    $scope.mainAppointmentId = appointmentinfo.AppointmentID || 0;
    if ($scope.mainAppointmentId === 0) {
        $scope.mainAppointmentId = appointmentinfo.AppointmentID || 0;
    }



    $scope.addNewInvObj = getAddNewInvObj();

    function getAddNewInvObj() {

        var object = {
            "InvestigationId": "",
            "OrgInvestigationId": "",
            "InvestigationObj": "",
            "InvestigationName": "",
            "InvestigationAdviceDate": moment().format("DD-MMM-YYYY"),
            "DoctorId": 0,
            "AppointmentId": 0,
            "OrganId": "",
            "OrganName": "",
            "SelectedParentAppt": "",
            "DoctorName": "",
            "IsExternalDoc": "",
            "InvestigationCost": "",
            "InvestigationCode": "",
            "Remarks": ""
        }
        return object;


    };

    $scope.InvSpecialityId = 3;
    //$scope.addNewInvObj.OrganId = 3;
    //$scope.addNewInvObj.OrganName = "Both";
    $scope.GetAllSpecialityInd = 1;
    $scope.changeInvSpeciality = function (item) {
        if (item === 0) {
            $scope.InvSpecialityId = 0;
            $scope.GetAllSpecialityInd = 0;
            $scope.addNewInvObj = getAddNewInvObj();
        }
        else {
            $scope.InvSpecialityId = 3;
            $scope.GetAllSpecialityInd = 1;
            $scope.addNewInvObj = getAddNewInvObj();
        }

    };






    $scope.advisedInvestigationsList = [];
    $scope.allAdvisedInvestigationsList = [];
    $scope.currentApptAdvisedInvestigationsList = [];
    $scope.hideAllInvestigations = false;
    $scope.GetAdvicedPatientInvestigations = function (PatientId) {
        eHnotePatientPVService.getPatientInvestigationsForBilling(PatientId, OnPVsuccess, OnPVerror);
        function OnPVsuccess(data) {
            if (data.rows.length > 0) {
                $scope.advisedInvestigationsList = data.rows;
                $scope.allAdvisedInvestigationsList = data.rows;
                $scope.hideAllInvestigations = false;

                angular.forEach($scope.advisedInvestigationsList, function (item, ind) {
                    if (item.InvCostArray.length !== 0) {

                        if ($scope.PatientTypeId === 1) {
                            if (item.InvCostArray[0].GeneralCost !== 0) {
                                item.InvestigationCost = item.InvCostArray[0].GeneralCost;
                            }
                        } else if ($scope.PatientTypeId === 2) {
                            if (item.InvCostArray[0].CgsCost !== 0) {
                                item.InvestigationCost = item.InvCostArray[0].CgsCost;
                            } else {
                                item.InvestigationCost = item.InvCostArray[0].GeneralCost;
                            }
                        } else if ($scope.PatientTypeId === 3) {
                            if (item.InvCostArray[0].SgsCost !== 0) {
                                item.InvestigationCost = item.InvCostArray[0].SgsCost;
                            } else {
                                item.InvestigationCost = item.InvCostArray[0].GeneralCost;
                            }
                        } else if ($scope.PatientTypeId === 4) {
                            if (item.InvCostArray[0].PrivateInsuranceCost !== 0) {
                                item.InvestigationCost = item.InvCostArray[0].PrivateInsuranceCost;
                            } else {
                                item.InvestigationCost = item.InvCostArray[0].GeneralCost;
                            }
                        }
                    }
                    //angular.forEach(item.InvCostArray, function (citem, ind) {
                    //    if (item.OrganId === citem.OrganId) {
                    //        if ($scope.PatientTypeId === 1) {
                    //            if (citem.GeneralCost !== 0) {
                    //                item.InvestigationCost = citem.GeneralCost;
                    //            }
                    //        } else if ($scope.PatientTypeId === 2) {
                    //            if (citem.CgsCost !== 0) {
                    //                item.InvestigationCost = citem.CgsCost;
                    //            } else {
                    //                item.InvestigationCost = citem.GeneralCost;
                    //            }
                    //        } else if ($scope.PatientTypeId === 3) {
                    //            if (citem.SgsCost !== 0) {
                    //                item.InvestigationCost = citem.SgsCost;
                    //            } else {
                    //                item.InvestigationCost = citem.GeneralCost;
                    //            }
                    //        } else if ($scope.PatientTypeId === 4) {
                    //            if (citem.PrivateInsuranceCost !== 0) {
                    //                item.InvestigationCost = citem.PrivateInsuranceCost;
                    //            } else {
                    //                item.InvestigationCost = citem.GeneralCost;
                    //            }
                    //        }

                    //        // item.InvestigationCost = Hitem.GeneralCost;
                    //    }

                    //});

                });

                angular.forEach($scope.allAdvisedInvestigationsList, function (item, ind) {
                    if (item.InvCostArray.length !== 0) {

                        if ($scope.PatientTypeId === 1) {
                            if (item.InvCostArray[0].GeneralCost !== 0) {
                                item.InvestigationCost = item.InvCostArray[0].GeneralCost;
                            }
                        } else if ($scope.PatientTypeId === 2) {
                            if (item.InvCostArray[0].CgsCost !== 0) {
                                item.InvestigationCost = item.InvCostArray[0].CgsCost;
                            } else {
                                item.InvestigationCost = item.InvCostArray[0].GeneralCost;
                            }
                        } else if ($scope.PatientTypeId === 3) {
                            if (item.InvCostArray[0].SgsCost !== 0) {
                                item.InvestigationCost = item.InvCostArray[0].SgsCost;
                            } else {
                                item.InvestigationCost = item.InvCostArray[0].GeneralCost;
                            }
                        } else if ($scope.PatientTypeId === 4) {
                            if (item.InvCostArray[0].PrivateInsuranceCost !== 0) {
                                item.InvestigationCost = item.InvCostArray[0].PrivateInsuranceCost;
                            } else {
                                item.InvestigationCost = item.InvCostArray[0].GeneralCost;
                            }
                        }
                    }
                    //angular.forEach(item.InvCostArray, function (citem, ind) {
                    //    if (item.OrganId === citem.OrganId) {


                    //        if ($scope.PatientTypeId === 1) {
                    //            if (citem.GeneralCost !== 0) {
                    //                item.InvestigationCost = citem.GeneralCost;
                    //            }
                    //        } else if ($scope.PatientTypeId === 2) {
                    //            if (citem.CgsCost !== 0) {
                    //                item.InvestigationCost = citem.CgsCost;
                    //            } else {
                    //                item.InvestigationCost = citem.GeneralCost;
                    //            }
                    //        } else if ($scope.PatientTypeId === 3) {
                    //            if (citem.SgsCost !== 0) {
                    //                item.InvestigationCost = citem.SgsCost;
                    //            } else {
                    //                item.InvestigationCost = citem.GeneralCost;
                    //            }
                    //        } else if ($scope.PatientTypeId === 4) {
                    //            if (citem.PrivateInsuranceCost !== 0) {
                    //                item.InvestigationCost = citem.PrivateInsuranceCost;
                    //            } else {
                    //                item.InvestigationCost = citem.GeneralCost;
                    //            }
                    //        }


                    //    }
                    //});
                    console.log(appointmentinfo.CaptureBillingFrom);
                    if (appointmentinfo.CaptureBillingFrom === "Appointment") {
                        $scope.hideAllInvestigations = true;
                        if (item.AppointmentId === $scope.mainAppointmentId) {
                            $scope.currentApptAdvisedInvestigationsList.push(item);
                        }
                    }

                });
            } else {
                $scope.advisedInvestigationsList = [];
            }

        }
        function OnPVerror(err) {
            alertify.error("Getting vitals failed");
        }
    }















    $scope.ProcedureListTypes = [];
    $scope.CardTypeDetails = [];
    $scope.patientBillIdsArray = [];

    $scope.CallingFrom = "init";
    getMasterProcedureTypes();
    getMasterCardTypes();

    $scope.TreatmentPlanId = appointmentinfo.TreatmentPlanId || 0;


    $scope.GetAllDoctorsFromCache = function () {
        $scope.clinicDoctorList = [];
        $scope.HospitalIdsArray = [];
        var clinicAddress = [];
        var AllBranches = localStorageFactory.getItem("allHospitalsDoctorsData");

        angular.forEach(AllBranches, function (item, index) {
            if (item.DoctorDetails !== undefined) {
                if (item.HospitalInfo.HospitalDetails.ActiveIND === "Y" && item.DoctorDetails.length > 0) {
                    item = {
                        "ClinicName": item.HospitalInfo.HospitalDetails.HospitalName,
                        "OrgGSTNO": item.HospitalInfo.HospitalDetails.OrgGSTNO || "",
                        "ClinicId": item.HospitalInfo.HospitalDetails.HospitalID,
                        "Address1": item.HospitalInfo.HospitalAddress.Address1 || "",
                        "Address2": item.HospitalInfo.HospitalAddress.Address2 || "",
                        "Area": item.HospitalInfo.HospitalAddress.Location || "",
                        "Location": item.HospitalInfo.HospitalAddress.Location,
                        "CityTown": item.HospitalInfo.HospitalAddress.CityTown,
                        "State": item.HospitalInfo.HospitalAddress.State,
                        "PinCode": item.HospitalInfo.HospitalAddress.PinCode,
                        "Country": item.HospitalInfo.HospitalAddress.Country,
                        "CountryCode": item.DoctorDetails[0].CountryCode,
                        "mobilenum": item.DoctorDetails[0].MobileNo,
                        "Active": item.HospitalInfo.HospitalDetails.ActiveIND,
                        "Doctors": item.DoctorDetails,
                        "ExtDetails": {
                            "HospitalID": item.HospitalInfo.HospitalDetails.HospitalID,
                            "PrimaryIND": "Y",
                            "AddressCommunication": [],
                            "HospitalInfo": {
                                "HospitalID": item.HospitalInfo.HospitalDetails.HospitalID,
                                "ParentHospitalID": item.HospitalInfo.HospitalDetails.ParentHospitalID,
                                "HospitalCode": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode,
                                "BranchCode": "",
                                "Preference": {}
                            }
                        }
                    };
                    $scope.HospitalIdsArray.push(item.ClinicId);
                    clinicAddress.push(item);
                }
            }
        });
        for (var i = 0; i < clinicAddress.length; i++) {
            if (clinicAddress[i].Doctors !== undefined) {
                if (clinicAddress[i].Doctors.length > 0) {
                    for (var j = 0; j < clinicAddress[i].Doctors.length; j++) {
                        $scope.clinicDoctorList.push(clinicAddress[i].Doctors[j]);
                    }
                }
            }
        }
        $scope.clinicDoctorList = $filter("filter")($scope.clinicDoctorList, function (item) {
            return item.RoleId === 1 || item.RoleId === 3 || item.RoleId === 4 || item.RoleId === 43 || item.RoleId === 16 || item.RoleId === 27 || item.RoleId === 28;
        });

        $scope.clinicDoctorList = _.uniq($scope.clinicDoctorList, false, function (p) { return p.DoctorID; });

        $scope.BillingObj.SelectedTowardsDoctor = $scope.clinicDoctorList[0];


        if (userLoginDetails.RoleID === 1) {
            $scope.HospitalIdsArray = [];
            angular.forEach(doctorinfo.doctordata.UserAddress, function (item) {
                if (item.ExtDetails !== undefined) {
                    if (item.ExtDetails.HospitalInfo !== undefined && item.ExtDetails.HospitalInfo.HospitalID !== undefined && item.ExtDetails.HospitalInfo.HospitalCode !== undefined) {
                        $scope.HospitalIdsArray.push(item.ExtDetails.HospitalInfo.HospitalID);
                    }
                }
            });
        }
    };




    $scope.getmainIvestigationBillingObject = function () {
        var object = {
            "BillID": appointmentinfo.BillingId || 0,
            "BillingHistoryId": 0,
            "IsInvestigationInvoice": true,
            "InvoiceId": "",
            "BillDate": moment().format("DD-MMM-YYYY"),
            "TotalSubAmount": "",
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
            "BillingHistoryInfo": [],
            "PatientGSTNo": appointmentinfo.PatientGSTNO || "",
            "TotalGST": 0,
            "IsRegistrationFeePaid": "N",
            "AppointmentID": 0,
            "PatientAdvanceAmount": 0,
            "PayableAdvanceAmount": 0,
            "DueAfterAdvanceAmt": 0,
            "TotalCollectedAmount": 0,
            "Payments": [],
            "TempReceivedAmt": 0,
            "TotalAmountToBeCollected": 0,
            "ZeroBillingRemarks": "",
            "IsDiscountChecked": $filter("filter")($scope.OrganizationSettingData.BillingSettings.AppointmentBilling, { "Id": 1 }, true)[0].Status,
            "IsGSTChecked": $filter("filter")($scope.OrganizationSettingData.BillingSettings.AppointmentBilling, { "Id": 2 }, true)[0].Status,
            "TotalWaviedOffAmount": 0,
            "includeAdvanceAmount": false,
            "IsMaxDiscountAllowed": false,
            "Mode": "Add",
            "DeletedBillItems": [],
            "AdmissionId": 0,
            "AdmissionNumber": "",
            "AdmissionDate": "",
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
            "TPAName": "",
            "ClaimId": 0,
            "InsurancePolicyNo": "",
            "ClaimIntimationDate": "",
            "ClaimIntimationNumber": "",
            "InsuranceCompanyAddress": "",
            "TPAAddress": "",
            "IsFinalSettlementDone": false,
            "PromoCode": "",
            "PromoCodeId": 0,
            "PromoCodeAmount": 0,
            "PromoCodeOfferValue": "",
            "PromoCodeOfferType": "",
            "IsPromoCodeApplied": false,
            "IsPromoCodeValid": false
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
            if (item.PaymentModeId === 1 || item.PaymentModeId === 2 || item.PaymentModeId === 3) {
                item.IsDefaultPaymentMode = true;
                paymentobj.IsPaymentModeSelected = true;
                paymentobj.IsDefaultPaymentMode = true;
                $scope.dPaymentsArray.push(paymentobj);
            }


        });

        object.Payments = angular.copy($scope.dPaymentsArray);
        return object;
    };



    $scope.GetBillingDoctorTypes = function () {
        eHnoteProcedureDataService.GetBillingDoctorTypes().then(function (resp) {
            $scope.BillingDoctorTypes = resp.data;
        }, function (err) {
            $scope.BillingDoctorTypes = [];
        });
    };


    $scope.staticPreviousTotalRecievedAmount = 0;
    $scope.staticTotalBalance = 0;
    $scope.staticPreviousPaidAmount = 0;
    $scope.staticBillingArray = [];
    $scope.patSearchType = 2;
    $scope.previousAppointments = [];
    $scope.UserId = 0;
    $scope.Previousconsultation = function (PatientId, UserId) {
        eHnoteDiagnosisDataServices.GetAllAppointentsbyPatientId(PatientId,UserId).then(function (resp) {
            if (resp.data !== undefined) {
                if (resp.data.rows.length > 0) {
                    console.log(resp.data);
                    $scope.previousAppointments = resp.data.rows;

                }
            }

        });
    }
    $scope.previousBillDetailsArray = [];
    $scope.init = function () {

        $scope.GetAdvicedPatientInvestigations(appointmentinfo.PatientID);
        $scope.Previousconsultation(appointmentinfo.PatientID, $scope.UserId);
        $scope.GetAllDoctorsFromCache();
        $scope.PatientTypeId = appointmentinfo.PatientDetails.PatientTypeId;


        var mPatientId = appointmentinfo.PatientID || cacheStorageItem.patientid;


        $scope.selectedBillingCategoryTypeId = 1;
        $scope.selectedBillingModeId = 1;




        if (mPatientId !== undefined && mPatientId !== "" && paymentType == 2) {

            eHnoteInsuranceService.getPatientInsuranceDtls(mPatientId).then(function (response) {
                console.log(response);
                $scope.patientInsuranceTpasArray = [];
                if (response.data !== undefined) {
                    if (response.data.rows !== undefined) {
                        $scope.patientInsuranceTpasArray = response.data.rows;
                        angular.forEach($scope.patientInsuranceTpasArray, function (item) {
                            if (item.OrgInsuranceTpaId === appointmentinfo.OrgInsuranceTpaId) {
                                $scope.selectedBillingCategoryTypeId = item.BillingCategoryTypeId;
                                $scope.selectedBillingModeId = 2;
                                if (item.PaymentType == 'Credit') {
                                    $scope.IsCreditBill = true;
                                    $scope.PatientInsuranceDetailId = item.PatientInsuranceDetailId;
                                    $scope.IsCreditBillingType = 'Yes';
                                }
                            }
                        })
                    }
                }
            });
        }

    };

    $scope.init();


    function getMasterProcedureTypes() {
        eHnoteProcedureDataService.getProcedureType(onsuccessProc, onfailureProc);
        function onsuccessProc(data) {
            $scope.ProcedureListTypes = data;
            for (var i = $scope.ProcedureListTypes.length - 1; i >= 0; i--) {
                if ($scope.ProcedureListTypes[i].Id === 8) {
                    $scope.ProcedureListTypes.splice(i, 1);
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

    $scope.newPatientBillingDetailsArray = [];
    $scope.newPatientBillingIdsArray = [];











    $scope.getInvestigationProcedures = function (val, item) {
        var object = {
            "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "SearchText": val,
            "ProcedureTypeId": $scope.selectedProcedureTypeId
        };
        return eHnoteSettingsDataService.GetProceduresByType(object).then(function (response) {

            if (response.data.ProcedureList !== undefined) {
                return response.data.ProcedureList.map(function (item) {
                    item.alertDiv = false;
                    return item;
                });
            }
            else {
                item.alertDiv = true;
            }
        });
    };





    function getPatientAdvanceAmount() {


        $scope.patientAdvanceAmount = 0;

        if (appointmentinfo.PatientID !== undefined) {
            eHnotePatientDataService.getPatientAdvanceAmount(appointmentinfo.PatientID, false).then(function (resp) {
                if (resp.data.Amount !== 0) {
                    $scope.patientAdvanceAmount = parseFloat(resp.data.Amount) || 0;
                    if ($scope.patientAdvanceAmount > 0) {
                        $scope.showPayableAdvanceBillingDiv = true;
                        $scope.mainInvBillingObject.PatientAdvanceAmount = $scope.patientAdvanceAmount;
                    }
                }
            }, function (err) {
                console.log(err);
                alertify.error("Getting Patient Billing Failed");
            });
        }
    }
    getPatientAdvanceAmount()


    //InvestigationBilling Code Added by Durga as on 01-04-2020

    $scope.showAddNewInvestionBtn = true;
    $scope.showAddNewInvestigationDiv = false;

    $scope.clickShowAddInvDiv = function () {
        $scope.showAddNewInvestigationDiv = true;
    }



    $scope.onSelectAddInvItem = function (item) {

        item.InvestigationId = item.invItemObject.ProcedureId;
        item.InvestigationName = item.invItemObject.ProcedureName;
        item.InvestigationCost = item.invItemObject.ProcedureGeneralCost;
        console.log(item);

    };

    $scope.changeAddInvItem = function (val, item) {
        val = val || null;
        if (val === null) {
            $scope.addNewInvObj = getAddNewInvObj();
        }

    };

    $scope.changeAppointmentDoctor = function (item, obj) {
        console.log(item);
        obj.DoctorId = item.DoctorID;
        obj.DoctorName = item.FullName;
        $scope.UserId = item.DoctorID;
        $scope.Previousconsultation(appointmentinfo.PatientID, $scope.UserId);
    };
    $scope.changepreviousAppointment = function (SelectedParentAppt) {
        $scope.addNewInvObj.AppointmentId = SelectedParentAppt.AppointmentId;
        $scope.addNewInvObj.DoctorName = SelectedParentAppt.DoctorName;
        $scope.addNewInvObj.DoctorId = SelectedParentAppt.UserId;

    };
    $scope.changeisdoc = function (item,addNewInvObj) {
        if (item === true) {
            $scope.addNewInvObj.DoctorName = "";
            $scope.addNewInvObj.DoctorId = 0;
        }
    };

    $scope.addNewInvestigationItemToBill = function () {

        console.log($scope.addNewInvObj);

        var treatObject = getNewTreatmentObject();

        if ($scope.addNewInvObj.InvestigationName === "") {
            alertify.error("Select InvestigationName");
            return false;
        }
        else if ($scope.addNewInvObj.OrganId === "") {
            alertify.error("Select Organ");
            return false;
        }
        else if ($scope.addNewInvObj.DoctorName === "") {
            alertify.error("Select Doctor Name");
            return false;
        }
        else if ($scope.addNewInvObj.IsExternalDoc === "") {
            if ($scope.addNewInvObj.SelectedParentAppt === "") {
                alertify.error("Select Previous Consultation");
                return false;
            }

        }

        treatObject.selectedParticular = "";
        treatObject.ProcedureID = $scope.addNewInvObj.InvestigationId;
        treatObject.OrgInvestigationId = $scope.addNewInvObj.OrgInvestigationId;
        treatObject.ProcedureName = $scope.addNewInvObj.InvestigationName;
        treatObject.BillingCode = $scope.addNewInvObj.InvestigationCode;
        treatObject.PatientInvestigationId = 0;
        treatObject.DoctorName = $scope.addNewInvObj.DoctorName;
        //$scope.TempBillingObject.AppointmentID = $scope.mainAppointmentId
        treatObject.AppointmentID = $scope.addNewInvObj.AppointmentId || $scope.mainAppointmentId;
        treatObject.OrganId = $scope.addNewInvObj.OrganId;
        treatObject.OrganName = $scope.addNewInvObj.OrganName;
        treatObject.ProcedureHistroyId = 0;
        treatObject.ProcedureCost = $scope.addNewInvObj.InvestigationCost;
        var temarray = $filter("filter")($scope.mainInvBillingObject.BillingDetail, function (item, index) { return item.ProcedureName === treatObject.ProcedureName && item.OrganId === treatObject.OrganId });
        if (temarray.length == 0) {



            $scope.mainInvBillingObject.BillingDetail.push(treatObject);
            angular.forEach($scope.mainInvBillingObject.BillingDetail, function (item, ind) {
                $scope.CalculateTotalAmount(item, ind);
            });
        } else {
            //alertify.error("Investigation already exists");
            //return;
            alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Same Billing Item Already Added.<br/> Still do you want to add?</h4> ", function () {




                $scope.mainInvBillingObject.BillingDetail.push(treatObject);
                angular.forEach($scope.mainInvBillingObject.BillingDetail, function (item, ind) {
                    $scope.f(item, ind);
                });
            }, function () {

            });
          
        }



        $scope.addNewInvObj = getAddNewInvObj();
        if ($scope.IsCreditBillingType === "Yes") {
            $scope.DisablePayment = false;
            $scope.CreditDisablePayment = false;
            $scope.IsCreditBill = true;
        }
        else {
            $scope.IsCreditBill = false;
        }

    };

    $scope.ClearNewInvestigationItemToBill = function () {
        $scope.addNewInvObj = getAddNewInvObj();
    };

    $scope.addInvItemToBill = function (mainitem) {


        if (mainitem.OrgInsuranceTpaId === 0) {


            var treatObject = getNewTreatmentObject();
            treatObject.selectedParticular = "";
            treatObject.OrgInvestigationId = mainitem.OrgInvestigationId;
            treatObject.ProcedureID = mainitem.InvestigationId;
            treatObject.ProcedureName = mainitem.InvestigationName;
            treatObject.BillingCode = mainitem.InvestigationCode;
            treatObject.PatientInvestigationId = mainitem.PatientInvestigationId;
            treatObject.AppointmentID = mainitem.AppointmentId;
            treatObject.AppointmentDoctorId = mainitem.AppointmentDoctorId;
            treatObject.DoctorName = mainitem.AppointmentDocName;
            treatObject.OrganId = mainitem.OrganId;
            treatObject.OrganName = mainitem.OrganName;
            treatObject.ProcedureHistroyId = mainitem.PatientInvestigationId;
            treatObject.DiscountAmount = mainitem.DiscountAmount;
            treatObject.DiscountCost = mainitem.DiscountCost;
            treatObject.Cgst = mainitem.Cgst;
            treatObject.Sgst = mainitem.Sgst;
            if (mainitem.DiscountType === 'A') {
                treatObject.DiscountType = 'AMOUNT';
            }
            if (mainitem.DiscountType === 'P') {
                treatObject.DiscountType = 'PERCENT';
            }
            treatObject.Gst = mainitem.GST;
            if (mainitem.InvCostArray.length !== 0) {


                    if ($scope.PatientTypeId === 1) {
                        if (mainitem.InvCostArray[0].GeneralCost !== 0) {
                            treatObject.ProcedureCost = mainitem.InvCostArray[0].GeneralCost;
                        }
                    } else if ($scope.PatientTypeId === 2) {
                        if (mainitem.InvCostArray[0].CgsCost !== 0) {
                            treatObject.ProcedureCost = mainitem.InvCostArray[0].CgsCost;
                        } else {
                            treatObject.ProcedureCost = mainitem.InvCostArray[0].GeneralCost;
                        }
                    } else if ($scope.PatientTypeId === 3) {
                        if (mainitem.InvCostArray[0].SgsCost !== 0) {
                            treatObject.ProcedureCost = mainitem.InvCostArray[0].SgsCost;
                        } else {
                            treatObject.ProcedureCost = mainitem.InvCostArray[0].GeneralCost;
                        }
                    } else if ($scope.PatientTypeId === 4) {
                        if (mainitem.InvCostArray[0].PrivateInsuranceCost !== 0) {
                            treatObject.ProcedureCost = mainitem.InvCostArray[0].PrivateInsuranceCost;
                        } else {
                            treatObject.ProcedureCost = mainitem.InvCostArray[0].GeneralCost;
                        }
                    }
            }
            //angular.forEach(mainitem.InvCostArray, function (citem) {
            //    if (citem.OrganId === mainitem.OrganId) {

            //        if ($scope.PatientTypeId === 1) {
            //            if (citem.GeneralCost !== 0) {
            //                treatObject.ProcedureCost = citem.GeneralCost;
            //            }
            //        } else if ($scope.PatientTypeId === 2) {
            //            if (citem.CgsCost !== 0) {
            //                treatObject.ProcedureCost = citem.CgsCost;
            //            } else {
            //                treatObject.ProcedureCost = citem.GeneralCost;
            //            }
            //        } else if ($scope.PatientTypeId === 3) {
            //            if (citem.SgsCost !== 0) {
            //                treatObject.ProcedureCost = citem.SgsCost;
            //            } else {
            //                treatObject.ProcedureCost = citem.GeneralCost;
            //            }
            //        } else if ($scope.PatientTypeId === 4) {
            //            if (citem.PrivateInsuranceCost !== 0) {
            //                treatObject.ProcedureCost = citem.PrivateInsuranceCost;
            //            } else {
            //                treatObject.ProcedureCost = citem.GeneralCost;
            //            }
            //        }


            //        //treatObject.ProcedureCost = citem.GeneralCost;






            //    }
            //});

            var temarray = $filter("filter")($scope.mainInvBillingObject.BillingDetail, function (item, index) { return item.PatientInvestigationId === treatObject.PatientInvestigationId });
            if (temarray.length == 0) {
                $scope.mainInvBillingObject.BillingDetail.push(treatObject);
            } else {
                alertify.error("Investigation already exists");
                return;
            }

            angular.forEach($scope.mainInvBillingObject.BillingDetail, function (item, ind) {
                $scope.CalculateTotalAmount(item, ind);
            });
        } else {


            var procId = 0;

            angular.forEach(mainitem.InvCostArray, function (eitem) {
                if (eitem.OrganId === mainitem.OrganId) {
                    procId = eitem.InvOrgBillId;
                }
            })

            var object = {
                "ProcedureTypeId": 5,
                "ProcedureId": procId,
                "OrgInsuranceTpaId": mainitem.OrgInsuranceTpaId
            }

            eHnoteSettingsDataService.getInsuranceMouCostForParticularId(object).then(function (response) {
                console.log(JSON.stringify(response));
                if (response.data.status == 'Success') {
                    mainitem.ProcedureCost = response.data.OriginalMouCost;
                    mainitem.ProcedureGeneralCost = response.data.ProcedureGeneralCost;
                }



                var treatObject = getNewTreatmentObject();
                treatObject.selectedParticular = "";
                treatObject.OrgInvestigationId = mainitem.OrgInvestigationId;
                treatObject.ProcedureID = mainitem.InvestigationId;
                treatObject.ProcedureName = mainitem.InvestigationName;
                treatObject.BillingCode = mainitem.InvestigationCode;
                treatObject.PatientInvestigationId = mainitem.PatientInvestigationId;
                treatObject.AppointmentID = mainitem.AppointmentId;
                treatObject.AppointmentDoctorId = mainitem.AppointmentDoctorId;
                treatObject.DoctorName = mainitem.AppointmentDocName;
                treatObject.OrganId = mainitem.OrganId;
                treatObject.OrganName = mainitem.OrganName;
                treatObject.ProcedureHistroyId = mainitem.PatientInvestigationId;

                if (mainitem.ProcedureCost === 0) {
                    
                    alertify.error("Insurance MOU Cost Not Added For this Item or Mou Date Exipred");

                    angular.forEach(mainitem.InvCostArray, function (citem) {
                        if (citem.OrganId === mainitem.OrganId) {
                            if (citem.GeneralCost !== 0) {
                                treatObject.ProcedureCost = citem.GeneralCost;
                            }
                        }
                    });
                } else {
                    treatObject.ProcedureCost = mainitem.ProcedureCost;
                }



                var temarray = $filter("filter")($scope.mainInvBillingObject.BillingDetail, function (item, index) { return item.PatientInvestigationId === treatObject.PatientInvestigationId });
                if (temarray.length == 0) {
                    $scope.mainInvBillingObject.BillingDetail.push(treatObject);
                } else {
                    alertify.error("Investigation already exists");
                    return;
                }

                angular.forEach($scope.mainInvBillingObject.BillingDetail, function (item, ind) {
                    $scope.CalculateTotalAmount(item, ind);
                });
                if (mainitem.ProcedureCost !== 0) {
                    if ($scope.IsCreditBillingType === "Yes") {
                        $scope.DisablePayment = false;
                        $scope.CreditDisablePayment = false;
                        $scope.IsCreditBill = true;
                    }

                }
                else {
                    if ($scope.IsCreditBillingType === "Yes") {
                        $scope.DisablePayment = false;
                        $scope.CreditDisablePayment = false;
                        $scope.IsCreditBill = true;
                    }
                    else {
                        $scope.DisablePayment = true;
                        $scope.CreditDisablePayment = true;
                        $scope.IsCreditBill = false;
                    }
                  
                }
            });
        }




    }


    $scope.mainInvBillingObject = $scope.getmainIvestigationBillingObject();





    //$scope.getNewOrgInvestigations = function (SearchText) {
    //    var params = {
    //        "InvSpecialityId": $scope.InvSpecialityId,
    //        "HospitalId": $scope.HospitalID,
    //        "GetAllIndicator": 0,
    //        "GetAllSpecialityInd": $scope.GetAllSpecialityInd,
    //        "PageSize": 10,
    //        "PageNumber": 1,
    //        "SearchText": SearchText,
    //    };
    //    return eHnoteLabService.getOrganizationInvestigationData(params).then(function (resp) {

    //        console.log(resp);
    //        if (resp.data.rows !== undefined) {
    //            return resp.data.rows.map(function (item) {
    //                return item;
    //            });
    //        }
    //    });
    //}

    $scope.getNewOrgInvestigations = function (SearchText) {
        var params = {
            "InvSpecialityId": $scope.InvSpecialityId,
            "HospitalId": $scope.HospitalID,
            "GetAllSpecialityInd": $scope.GetAllSpecialityInd,
            "PageSize": 10,
            "PageNumber": 1,
            "SearchText": SearchText,
            "OrgInsuranceTpaId": $scope.selectedOrgInsuranceTpaId,
            "BillingCategoryTypeId": $scope.selectedBillingCategoryTypeId
        };
        return eHnoteLabService.GetOrgInvestigationMouData(params).then(function (resp) {

            console.log(resp);
            if (resp.data.rows !== undefined) {
                return resp.data.rows.map(function (item) {
                    return item;
                });
            }
        });
    }

    $scope.onselectOrgInvestigation = function (item, invItemObject) {
        console.log(invItemObject);

        item.OrgInvestigationId = invItemObject.OrgInvestigationId;
        item.InvestigationId = invItemObject.InvestigationId;
        item.InvestigationName = invItemObject.InvestigationName;
        $scope.selectedRightEye = false;
        //object = {
        //    "PatientInvestigationId": 0,
        //    "OrganId": $scope.SelectedEye,
        //    "OrganName": GetEyeName($scope.SelectedEye),
        //    "OrgInvestigationId": InvObject.OrgInvestigationId,
        //    "InvestigationId": InvObject.InvestigationId,
        //    "InvestigationName": InvObject.InvestigationName,
        //    "InvestigationNotes": InvObject.InvestigationNotes || "",
        //    "InvestigationInstruction": "",
        //    "CategoryId": InvObject.CategoryId,
        //    "ActiveInd": 'Y',
        //    "Teethno": $scope.teethNos,
        //    "StatusId": InvObject.StatusId ? InvObject.StatusId : "1",
        //    "IsTreatmentInvoiced": false,
        //    "Type": $scope.Type,
        //    "Cost": 0,
        //    "Discount": 0,
        //    "ShowNote": false,
        //    "ImagesData": []
        //};
      
        if (item.InvestigationObj.InvCostArray.length !== 0) {
            item.InvestigationCost = item.InvestigationObj.InvCostArray[0].GeneralCost;
        }
       

   
        $scope.selectedRightEye = item.InvestigationName.includes("OD") || item.InvestigationName.includes("RE") || item.InvestigationName.includes('Right Eye') || item.InvestigationName.includes('R E') || item.InvestigationName.includes('R.E') || item.InvestigationName.includes('od');
        if ($scope.selectedRightEye === true) {
            item.OrganId = '1';
            item.OrganName = 'Right Eye';
        }
        $scope.selectedLeftEye = item.InvestigationName.includes("OS") || item.InvestigationName.includes("LE") || item.InvestigationName.includes('Left Eye') || item.InvestigationName.includes('L E') || item.InvestigationName.includes('L.E') || item.InvestigationName.includes('os');
        //console.log(value1);
        if ($scope.selectedLeftEye === true) {
            item.OrganId = '2';
            item.OrganName = 'Left Eye';
        }
        $scope.selectedBothEye = item.InvestigationName.includes("Both EYE") || item.InvestigationName.includes("BE") || item.InvestigationName.includes('Both Eye')  || item.InvestigationName.includes('B.E');
        //console.log(value1);
        if ($scope.selectedBothEye === true) {
            item.OrganId = '3';
            item.OrganName = 'Both Eye';
        }
        
    }
    function getNewTreatmentObject() {
        return {
            "RowId": 1,
            "BillDate": moment().format("DD-MMM-YYYY"),
            "ProcedureID": 0,
            "OrgInvestigationId": 0,
            "IsInvestigationInvoice": true,
            "ProcedureCost": "",
            "ProcedureName": "",
            "ProcedureTypeName": "Investigation",
            "BillingCode": "",
            "OrganId": "",
            "OrganName": "",
            "PatientInvestigationId": 0,
            "ProcedureTypeId": 5,
            "Notes": "",
            "BilledCost": 0,
            "DiscountCost": "",
            "Multiplyfactor": 1,
            "AdvancePaid": 0,
            "DiscountAmount": 0,
            "DiscountType": "PERCENT",
            "Balance": 0,
            "TotalReceivedCost": 0,
            "PreviousBill": "N",
            "AppointmentID": 0,
            "AppointmentDoctorId": "",
            "DoctorName": "",
            "Cgst": 0,
            "Sgst": 0,
            "Tax": 0,
            "Total": 0,
            "IsConsultationBilling": false,
            "IsIncluded": true,
            "PatientGSTNo": appointmentinfo.PatientGSTNO || "",
            "showIncludeTax": false,
            "ProcedureHistroyId": 0,
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
            "PromoCodeAmount": 0,
            "PromoCodeApplied": false,
            "Status": "I", //'I'- Inserted, 'E'- Edited,'D'- Deleted

        };
    }


    $scope.EnableDiscountOrGST = function () {

        $scope.mainInvBillingObject.IsDiscountChecked = $filter("filter")($scope.OrganizationSettingData.BillingSettings.AppointmentBilling, { "Id": 1 }, true)[0].Status;
        $scope.mainInvBillingObject.IsGSTChecked = $filter("filter")($scope.OrganizationSettingData.BillingSettings.AppointmentBilling, { "Id": 2 }, true)[0].Status;


        angular.forEach($scope.mainInvBillingObject.BillingDetail, function (item, index) {


            if (!$scope.mainInvBillingObject.IsDiscountChecked) {
                item.DiscountCost = 0;
                item.DiscountAmount = 0;
            }
            if (!$scope.mainInvBillingObject.IsGSTChecked) {
                item.Cgst = 0;
                item.Sgst = 0;
                item.Tax = 0;
                item.showIncludeTax = false;
            }
            if (item.IsIncluded) {
                item.Total = (parseFloat(item.ProcedureCost) || 0) * (parseFloat(item.Multiplyfactor) || 0);
                item.BilledCost = 0;
                item.TotalwithoutTax = item.Total;
            }
            $scope.CalculateTotalAmount(item, index);
        });
        $scope.mainInvBillingObject.TotalAmountToBeCollected = 0;


        $scope.ShowPatientGst = $scope.mainInvBillingObject.IsGSTChecked;
        $scope.mainInvBillingObject.PatientGSTNo = null;

    }
    $scope.ChangeDiscountOff = function (subitem, index) {
        var modalInstance = $uibModal.open({
            "templateUrl": "templates/consultation/billing/WavedOfRemarks.html",
            "controller": ["$scope", "$log", "subitem", "$uibModalInstance", "Type", function ($scope, $log, subitem, $uibModalInstance, Type) {
                $scope.subitem = subitem;
                $scope.Type = Type;
                $scope.cancel = function (subitem) {
                    $uibModalInstance.close(subitem);
                };
            }],
            "size": "md",
            "backdrop": "static",
            "keyboard": false,
            "resolve": {
                "subitem": function () {
                    return subitem;
                },
                "Type": function () {
                    return 5;
                }

            }

        });
        modalInstance.result.then(function (subitem) {
            if (subitem.WavedOffRemarks != "") {
                console.log(subitem);
            }
        }, function (cancel) {

        });
    };

    $scope.CalculateTotalAmount = function (subitem, index) {


        if ($scope.Billingpageno === 6) {
            $scope.promoCodeObj = {
                "PromoCode": "",
                "PromoCodeId": "",
                "OfferValue": "",
                "OfferValueType": "",
                "OfferAmount": "",
                "PromoCodeTypeId": "",
                "PromoCodeValid": false
            }

            $scope.mainInvBillingObject.PromoCode = "";
            $scope.mainInvBillingObject.PromoCodeId = 0;
            $scope.mainInvBillingObject.PromoCodeAmount = 0;
            $scope.mainInvBillingObject.PromoCodeOfferValue = "";
            $scope.mainInvBillingObject.PromoCodeOfferType = "";
            $scope.mainInvBillingObject.IsPromoCodeApplied = false;
            $scope.mainInvBillingObject.IsPromoCodeValid = false;

            angular.forEach($scope.mainInvBillingObject.BillingDetail, function (bitem) {
                console.log(bitem);
                if (bitem.ProcedureID !== 0 && bitem.IsIncluded === true) {
                    bitem.PromoCodeAmount = 0;
                    bitem.PromoCodeApplied = false;
                }
            });
        }


        subitem.DiscountCost = parseInt(subitem.DiscountCost);
        if (subitem.IsWaved) {
            subitem.Cgst = 0;
            subitem.Sgst = 0;
            subitem.DiscountCost = 0;
            subitem.showIncludeTax = false;
            subitem.Igst = 0;
            subitem.Gst = 0;
        }

        var totalAmount = 0;
        var Cgst = parseFloat(subitem.Cgst) || 0;
        var Sgst = parseFloat(subitem.Sgst) || 0;
        var Multiplyfactor = parseFloat(subitem.Multiplyfactor) || 0;
        var ProcedureCost = parseFloat(subitem.ProcedureCost) || 0;
        totalAmount = ProcedureCost * Multiplyfactor;


        var DiscountCost = parseFloat(subitem.DiscountCost) || 0;

        //changes by bindu for waive off calculations 19-02-2020


        if (!$scope.editinvoice) {
            subitem.BilledCost = 0;
        }

        if (subitem.PreviousBill == "N" && subitem.IsIncluded && subitem.ProcedureTypeId != 8) {

            if ($scope.PatientTypeId === 1) {

                if (subitem.DiscountType === "PERCENT") {
                    subitem.DiscountAmount = (DiscountCost / 100) * totalAmount;
                    totalAmount = totalAmount - subitem.DiscountAmount - subitem.PromoCodeAmount;
                    subitem.IsMaxDiscountAllowed = false;
                }
                else if (subitem.DiscountType === "AMOUNT") {

                    if (DiscountCost > totalAmount) {
                        alertify.error("Please enter less than price");
                        subitem.DiscountCost = 0;
                        $scope.mainInvBillingObject.BillingDetail[index].Total = totalAmount;
                        $scope.SumAmount($scope.mainInvBillingObject);
                        $scope.DisablePayment = true;
                        subitem.IsMaxDiscountAllowed = true;
                        return false;
                    } else {
                        totalAmount -= DiscountCost;
                        //$scope.mainInvBillingObject.BillingDetail[index].Total = totalAmount;
                        subitem.DiscountAmount = subitem.DiscountCost;
                        subitem.IsMaxDiscountAllowed = false;
                    }





                }

            }
            else {

                if (subitem.DiscountType === "PERCENT") {
                    subitem.DiscountAmount = (DiscountCost / 100) * totalAmount;
                    totalAmount = totalAmount - subitem.DiscountAmount - subitem.PromoCodeAmount;
                } else {
                    if (DiscountCost > totalAmount) {
                        alertify.error("Please enter less than price");
                        subitem.DiscountCost = 0;
                        $scope.mainInvBillingObject.BillingDetail[index].Total = totalAmount;
                        $scope.SumAmount($scope.mainInvBillingObject);
                        return false;
                    } else {
                        totalAmount -= DiscountCost;
                        //$scope.mainInvBillingObject.BillingDetail[index].Total = totalAmount;
                        subitem.DiscountAmount = subitem.DiscountCost;
                    }
                }

            }


        }





        if (subitem.isExclusiveTax) {
            subitem.Tax = ((Cgst + Sgst) / 100) * totalAmount;
            subitem.Tax = parseFloat(subitem.Tax) || 0;
            $scope.mainInvBillingObject.BillingDetail[index].Total = totalAmount + subitem.Tax;

            $scope.mainInvBillingObject.BillingDetail[index].TotalwithoutTax = totalAmount;

            subitem.GstAmount = subitem.Tax;
            subitem.NetAmount = $scope.mainInvBillingObject.BillingDetail[index].TotalwithoutTax;
        } else {
            subitem.Tax = totalAmount - (totalAmount * (100 / (100 + parseFloat(subitem.Gst))));
            subitem.Tax = parseFloat(subitem.Tax) || 0;
            $scope.mainInvBillingObject.BillingDetail[index].Total = totalAmount;

            $scope.mainInvBillingObject.BillingDetail[index].TotalwithoutTax = totalAmount - subitem.Tax;

            subitem.GstAmount = subitem.Tax;
            subitem.NetAmount = $scope.mainInvBillingObject.BillingDetail[index].TotalwithoutTax;
        }



        if (subitem.IsWaved) {
            $scope.mainInvBillingObject.BillingDetail[index].WaviedOffAmount = $scope.mainInvBillingObject.BillingDetail[index].Total;
        }


        if ($scope.mainInvBillingObject.includeAdvanceAmount) {
            $scope.mainInvBillingObject.PayableAdvanceAmount = 0;
            angular.forEach($scope.mainInvBillingObject.Payments, function (item, index) {
                if (item.PaymentModeId === 18) {
                    $scope.mainInvBillingObject.Payments.splice(index, 1);
                } else {
                    item.Amount = "";
                }
            });
        }


        $scope.SumAmount($scope.mainInvBillingObject);
        $scope.mainInvBillingObject.includeAdvanceAmount = false;
        //Remove Advance Amount Object From Paymnets Array
        if (!$scope.editinvoice) {
            $scope.mainInvBillingObject.Payments = $filter("filter")($scope.mainInvBillingObject.Payments, function (item, index) { return item.PaymentModeId !== 18; }) || [];
        }
        // IsIncludePatientAdvance(false, 1);
        if (!$scope.editinvoice) {
            $scope.mainInvBillingObject.PayableAdvanceAmount = 0;
            $scope.mainInvBillingObject.TotalCollectedAmount = 0;
        }
        $scope.mainInvBillingObject.DueAfterAdvanceAmt = 0;
        if (subitem.ProcedureCost !== 0) {
            if ($scope.IsCreditBillingType === "Yes") {
                $scope.DisablePayment = false;
                $scope.CreditDisablePayment = false;
                $scope.IsCreditBill = true;
            }
        }


    };




    $scope.SumAmount = function (mainitem) {



        var val = 0, valWithouitTax = 0;

        var totalgstval = 0;
        mainitem.TotalGST = 0;
        mainitem.TotalAmountToBeCollected = 0;

        //if (!$scope.editinvoice) {
        //    $scope.mainInvBillingObject.TotalBilledCost = 0;//
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

            item.NetAmount = parseInt(item.ProcedureCost) - item.DiscountAmount;
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
                if (totalpayable > $scope.PreviousAmountObj.PreviousTotalRecievedAmountMain) {
                    $scope.PreviousAmountObj.PreviousTotalRecievedAmount = $scope.PreviousAmountObj.PreviousTotalRecievedAmountMain;
                } else {
                    $scope.PreviousAmountObj.PreviousTotalRecievedAmount = totalpayable;
                }

                $scope.PreviousAmountObj.RefundableAmount = $scope.PreviousAmountObj.PreviousTotalRecievedAmountMain - $scope.PreviousAmountObj.PreviousTotalRecievedAmount;
            }
            mainitem.TotalReceivedAmount = angular.copy(mainitem.TotalBilledCost + checkRoundVal(mainitem.PreviousPaidAmount) + $scope.PreviousAmountObj.PreviousTotalRecievedAmount);
            mainitem.TotalBalance = checkRoundVal(mainitem.TotalNetAmount - mainitem.TotalReceivedAmount);



            angular.forEach($scope.mainInvBillingObject.Payments, function (pitem) {
                if (pitem.PaymentModeId === 39) {
                    pitem.Amount = $scope.PreviousAmountObj.PreviousTotalRecievedAmount;
                }
            });
        }

        if (totalgstval !== 0) {
            mainitem.DiscountValue = 0;
        }
        if (mainitem.DiscountValue && checkRoundVal(mainitem.DiscountValue) !== 0) {
            $scope.discountChange(mainitem);
        }



        if (mainitem.Mode === 'Add') {
            angular.forEach($scope.mainInvBillingObject.Payments, function (item) {
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



        //return val ? val : 0;
    };


    $scope.discountTypeChange = function (item, index) {
        $scope.mainInvBillingObject.BillingDetail[index].DiscountCost = "";
        $scope.CalculateTotalAmount(item, index);
    };

    $scope.AddIncludeTax = function (item, index) {
        item.showIncludeTax = !item.showIncludeTax;
        item.isExclusiveTax = true;

        if (item.showIncludeTax) {
            $scope.ShowPatientGst = true;
            item.Cgst = 9;
            item.Sgst = 9;
            item.Gst = "18";
        } else {
            $scope.ShowPatientGst = false;
            item.Cgst = 0;
            item.Sgst = 0;
            item.Gst = "";
            $scope.mainInvBillingObject.PatientGSTNo = "";
        }
        $scope.CalculateTotalAmount(item, index);
    };


    $scope.changeGstType = function (subitem, index) {
        $scope.CalculateTotalAmount(subitem, index);
    };

    $scope.changeGST = function (subitem, index) {


        var gst = parseFloat(subitem.Gst) || 0;

        var subgst = gst / 2;

        subitem.Cgst = subgst;
        subitem.Sgst = subgst;

        $scope.CalculateTotalAmount(subitem, index);
    };

    $scope.CalculateProcedureWiseAmount = function (item, index) { //using

        if (item.IsIncluded) {

            $scope.mainInvBillingObject.TotalAmountToBeCollected = 0;
            $scope.mainInvBillingObject.TotalBilledCost = 0;
            $scope.mainInvBillingObject.PayableAdvanceAmount = 0;

            angular.forEach($scope.mainInvBillingObject.BillingDetail, function (iterator) {

                var TotalAmountReceived = parseFloat(iterator.TotalAmountReceived) || 0;
                var AmountReceived = parseFloat(iterator.BilledCost) || 0;
                if ((AmountReceived + TotalAmountReceived) > iterator.Total) {
                    alertify.error("Please enter less than or equal to Total");
                    iterator.BilledCost = 0;
                    $scope.TotalErrorCount++;
                    return;
                }
                $scope.mainInvBillingObject.TotalAmountToBeCollected += AmountReceived;
            });
            $scope.tempIndividualTotalAmt = $scope.mainInvBillingObject.TotalAmountToBeCollected;
        }
    };



    $scope.IncludeDiscount = function (subitem, index, mainInvBillingObject) {
        if (mainInvBillingObject.PromoCodeApplied) {
            alertify.error("Promo Code Discount has been Applied");
            return false;
        }
        var modalInstance = $uibModal.open({
            "templateUrl": "templates/consultation/billing/WavedOfRemarks.html",
            "controller": ["$scope", "$log", "subitem", "$uibModalInstance", "Type", "index", "PatientTypeId", function ($scope, $log, subitem, $uibModalInstance, Type, index, PatientTypeId) {
                $scope.sindex = index;
                $scope.subitem = subitem;
                $scope.Billingpageno = 6;
                $scope.PatientTypeId = PatientTypeId;
                $scope.mainInvBillingObject = mainInvBillingObject;
                $scope.Type = Type;
                $scope.cancel = function (subitem, type) {
                    var type = type || "cancel";
                    if (type === 'cancel') {
                        $uibModalInstance.close(subitem);
                    } else {
                        $scope.CalculateTotalAmount(subitem, $scope.sindex)
                        $uibModalInstance.close(subitem);
                    }

                };
                $scope.discountChange = function (mainitem) {
                    if (mainitem.DiscountType === "PERCENT" && mainitem.DiscountValue && checkRoundVal(mainitem.DiscountValue) > 100) {
                        if (mainitem.DiscountType === "PERCENT") {
                            mainitem.DiscountValue = 0;
                            mainitem.TotalDiscountAmount = 0;
                            mainitem.TotalNetAmount = checkRoundVal(mainitem.TotalSubAmount);
                            alertify.error("Please enter discount below hundred");
                            return false;
                        }
                    } else {
                        if (mainitem.DiscountType === "AMOUNT" && checkRoundVal(mainitem.DiscountValue) > checkRoundVal(mainitem.TotalNetAmount)) {
                            alertify.error("Discount amount should be less than net amount");
                            mainitem.DiscountValue = 0;
                            return false;
                        }
                        var amount = checkRoundVal(mainitem.TotalSubAmount);
                        if (mainitem.DiscountValue && checkRoundVal(mainitem.DiscountValue) !== 0) {
                            if (mainitem.DiscountType === "PERCENT") {
                                amount = checkRoundVal(mainitem.TotalSubAmount) - (checkRoundVal(mainitem.DiscountValue) / 100) * checkRoundVal(mainitem.TotalSubAmount);
                                mainitem.TotalDiscountAmount = checkRoundVal((checkRoundVal(mainitem.DiscountValue) / 100) * mainitem.TotalSubAmount);

                            } else if (mainitem.DiscountType === "AMOUNT") {
                                amount = checkRoundVal(mainitem.TotalSubAmount) - checkRoundVal(mainitem.DiscountValue);
                                mainitem.TotalDiscountAmount = checkRoundVal(mainitem.DiscountValue);
                            }
                        }
                        if (mainitem.TotalReceivedAmount > amount) {
                            mainitem.TotalNetAmount = checkRoundVal(amount);
                            mainitem.TotalReceivedAmount = 0;
                            mainitem.TotalBilledCost = 0;

                            alertify.error("Collected amount should be less net amount");
                            return false;
                        } else {
                            mainitem.TotalNetAmount = checkRoundVal(amount);
                        }
                    }
                    mainitem.DiscountValue = checkRoundVal(mainitem.DiscountValue ? mainitem.DiscountValue : 0);
                };
                $scope.SumAmount = function (mainitem) {
                    var val = 0, valWithouitTax = 0;
                    var totalgstval = 0;
                    mainitem.TotalGST = 0;
                    mainitem.TotalAmountToBeCollected = 0;
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

                        mainitem.TotalNetAmount = checkRoundVal(val - mainitem.TotalWaviedOffAmount - mainitem.PromoCodeAmount);

                        if (mainitem.includePreviousPaiAmount) {
                            var totalpayable = mainitem.TotalNetAmount;
                            if (totalpayable > $scope.PreviousAmountObj.PreviousTotalRecievedAmountMain) {
                                $scope.PreviousAmountObj.PreviousTotalRecievedAmount = $scope.PreviousAmountObj.PreviousTotalRecievedAmountMain;
                            } else {
                                $scope.PreviousAmountObj.PreviousTotalRecievedAmount = totalpayable;
                            }

                            $scope.PreviousAmountObj.RefundableAmount = $scope.PreviousAmountObj.PreviousTotalRecievedAmountMain - $scope.PreviousAmountObj.PreviousTotalRecievedAmount;
                        }
                        mainitem.TotalReceivedAmount = angular.copy(mainitem.TotalBilledCost + checkRoundVal(mainitem.PreviousPaidAmount) + $scope.PreviousAmountObj.PreviousTotalRecievedAmount);
                        mainitem.TotalBalance = checkRoundVal(mainitem.TotalNetAmount - mainitem.TotalReceivedAmount);
                        angular.forEach($scope.mainInvBillingObject.Payments, function (pitem) {
                            if (pitem.PaymentModeId === 39) {
                                pitem.Amount = $scope.PreviousAmountObj.PreviousTotalRecievedAmount;
                            }
                        });
                    }

                    if (totalgstval !== 0) {
                        mainitem.DiscountValue = 0;
                    }
                    if (mainitem.DiscountValue && checkRoundVal(mainitem.DiscountValue) !== 0) {
                        $scope.discountChange(mainitem);
                    }

                    if (mainitem.Mode === 'Add') {
                        angular.forEach($scope.mainInvBillingObject.Payments, function (item) {
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



                    //return val ? val : 0;
                };
                $scope.CalculateTotalAmount = function (subitem, index) {

                    if ($scope.Billingpageno === 6) {
                        $scope.promoCodeObj = {
                            "PromoCode": "",
                            "PromoCodeId": "",
                            "OfferValue": "",
                            "OfferValueType": "",
                            "OfferAmount": "",
                            "PromoCodeTypeId": "",
                            "PromoCodeValid": false
                        }

                        $scope.mainInvBillingObject.PromoCode = "";
                        $scope.mainInvBillingObject.PromoCodeId = 0;
                        $scope.mainInvBillingObject.PromoCodeAmount = 0;
                        $scope.mainInvBillingObject.PromoCodeOfferValue = "";
                        $scope.mainInvBillingObject.PromoCodeOfferType = "";
                        $scope.mainInvBillingObject.IsPromoCodeApplied = false;
                        $scope.mainInvBillingObject.IsPromoCodeValid = false;

                        angular.forEach($scope.mainInvBillingObject.BillingDetail, function (bitem) {
                            console.log(bitem);
                            if (bitem.ProcedureID !== 0 && bitem.IsIncluded === true) {
                                bitem.PromoCodeAmount = 0;
                                bitem.PromoCodeApplied = false;
                            }
                        });
                    }

                    if (subitem.IsWaved) {
                        subitem.Cgst = 0;
                        subitem.Sgst = 0;
                        subitem.DiscountCost = 0;
                        subitem.showIncludeTax = false;
                        subitem.Igst = 0;
                        subitem.Gst = 0;
                    }

                    var totalAmount = 0;
                    var Cgst = parseFloat(subitem.Cgst) || 0;
                    var Sgst = parseFloat(subitem.Sgst) || 0;
                    var Multiplyfactor = parseFloat(subitem.Multiplyfactor) || 0;
                    var ProcedureCost = parseFloat(subitem.ProcedureCost) || 0;
                    totalAmount = ProcedureCost * Multiplyfactor;


                    var DiscountCost = parseFloat(subitem.DiscountCost) || 0;

                    //changes by bindu for waive off calculations 19-02-2020


                    if (!$scope.editinvoice) {
                        subitem.BilledCost = 0;
                    }
                    //subitem.selectedParticular = subitem.selectedParticular || "";
                    //if (subitem.PreviousBill == "N" && subitem.IsIncluded && subitem.ProcedureTypeId != 8) {
                    //    if (subitem.selectedParticular !== '') {
                    //        if ($scope.PatientTypeId === 1) {
                    //            if (subitem.selectedParticular.ProcedureMaxDiscountCost <= ProcedureCost) {
                    //                if (subitem.DiscountType === "PERCENT") {
                    //                    if (subitem.selectedParticular.ProcedureMaxDiscountCost <= (ProcedureCost - (ProcedureCost * DiscountCost / 100))) {
                    //                        subitem.selectedParticular = subitem.selectedParticular || "";
                    //                        subitem.selectedParticular.ProcedureMaxDiscountValue = subitem.selectedParticular.ProcedureMaxDiscountValue || 0;
                    //                        if (subitem.selectedParticular.ProcedureMaxDiscountValue != 0 && subitem.selectedParticular.ProcedureMaxDiscountType === 'P') {

                    //                            if (DiscountCost > subitem.selectedParticular.ProcedureMaxDiscountCostInpercentage && subitem.selectedParticular.ProcedureMaxDiscountCost > (ProcedureCost - (ProcedureCost * DiscountCost / 100))) {
                    //                                alertify.error("Please enter discount less than " + subitem.selectedParticular.ProcedureMaxDiscountCostInpercentage);
                    //                                $scope.mainInvBillingObject.BillingDetail[index].DiscountCost = 0;
                    //                                $scope.DisablePayment = true;
                    //                                subitem.IsMaxDiscountAllowed = true;
                    //                            } else {

                    //                                subitem.DiscountAmount = (DiscountCost / 100) * totalAmount;
                    //                                totalAmount = totalAmount - subitem.DiscountAmount - subitem.PromoCodeAmount;
                    //                                subitem.IsMaxDiscountAllowed = false;
                    //                                // }
                    //                            }
                    //                        } else if (subitem.selectedParticular.ProcedureMaxDiscountValue !== 0 && subitem.selectedParticular.ProcedureMaxDiscountType === 'A') {
                    //                            if (DiscountCost > subitem.selectedParticular.ProcedureMaxDiscountCostInpercentage && subitem.selectedParticular.ProcedureMaxDiscountCost > (ProcedureCost - (ProcedureCost * DiscountCost / 100))) {
                    //                                alertify.error("Please enter discount less than " + subitem.selectedParticular.ProcedureMaxDiscountCostInpercentage + " Percentage");
                    //                                $scope.mainInvBillingObject.BillingDetail[index].DiscountCost = 0;
                    //                                $scope.DisablePayment = true;
                    //                                subitem.IsMaxDiscountAllowed = true;
                    //                            }
                    //                            else {
                    //                                subitem.DiscountAmount = (DiscountCost / 100) * totalAmount;
                    //                                totalAmount = totalAmount - subitem.DiscountAmount - subitem.PromoCodeAmount;
                    //                                subitem.IsMaxDiscountAllowed = false;                                               
                    //                            }
                    //                        } else {

                    //                            subitem.DiscountAmount = (DiscountCost / 100) * totalAmount;
                    //                            totalAmount = totalAmount - subitem.DiscountAmount - subitem.PromoCodeAmount;
                    //                            subitem.IsMaxDiscountAllowed = false;
                    //                            // }
                    //                        }

                    //                    } else {
                    //                        alertify.error("Please enter In Between Actuval Cost and After Discount Cost");
                    //                        $scope.mainInvBillingObject.BillingDetail[index].DiscountCost = 0;
                    //                        subitem.IsMaxDiscountAllowed = true;
                    //                        $scope.DisablePayment = true;
                    //                        subitem.IsMaxDiscountAllowed = true;
                    //                        return false;
                    //                    }




                    //                }
                    //                else if (subitem.DiscountType === "AMOUNT") {

                    //                    if (subitem.selectedParticular.ProcedureMaxDiscountCost * Multiplyfactor <= ((ProcedureCost * Multiplyfactor - DiscountCost))) {
                    //                        subitem.selectedParticular = subitem.selectedParticular || "";

                    //                        subitem.selectedParticular.ProcedureMaxDiscountValue = subitem.selectedParticular.ProcedureMaxDiscountValue || 0;
                    //                        if (subitem.selectedParticular.ProcedureMaxDiscountValue !== 0 && subitem.selectedParticular.ProcedureMaxDiscountType === 'A') {
                    //                            if (DiscountCost > subitem.selectedParticular.ProcedureMaxDiscountCostInRupees * Multiplyfactor && subitem.selectedParticular.ProcedureMaxDiscountCost * Multiplyfactor > ((ProcedureCost - DiscountCost) * Multiplyfactor)) {
                    //                                alertify.error("Please enter discount less than " + subitem.selectedParticular.ProcedureMaxDiscountCostInRupees * Multiplyfactor);
                    //                                $scope.mainInvBillingObject.BillingDetail[index].DiscountCost = 0;
                    //                                $scope.DisablePayment = true;
                    //                                subitem.IsMaxDiscountAllowed = true;
                    //                            }
                    //                            else {
                    //                                if (DiscountCost > totalAmount) {
                    //                                    alertify.error("Please enter less than price");
                    //                                    subitem.DiscountCost = 0;
                    //                                    $scope.mainInvBillingObject.BillingDetail[index].Total = totalAmount;
                    //                                    $scope.SumAmount($scope.mainInvBillingObject);
                    //                                    $scope.DisablePayment = true;
                    //                                    subitem.IsMaxDiscountAllowed = true;
                    //                                    return false;
                    //                                } else {
                    //                                    totalAmount -= DiscountCost;
                    //                                    subitem.DiscountAmount = subitem.DiscountCost;
                    //                                    subitem.IsMaxDiscountAllowed = false;
                    //                                }
                    //                            }
                    //                        } else if (subitem.selectedParticular.ProcedureMaxDiscountValue != 0 && subitem.selectedParticular.ProcedureMaxDiscountType === 'P') {

                    //                            if (subitem.selectedParticular.ProcedureMaxDiscountCost * Multiplyfactor > ((ProcedureCost * Multiplyfactor - DiscountCost))) {
                    //                                //if (DiscountCost > subitem.selectedParticular.ProcedureMaxDiscountCostInRupees * Multiplyfactor) {
                    //                                alertify.error("Please enter discount less than " + subitem.selectedParticular.ProcedureMaxDiscountCostInRupees * Multiplyfactor);
                    //                                $scope.mainInvBillingObject.BillingDetail[index].DiscountCost = 0;
                    //                                $scope.DisablePayment = true;
                    //                                subitem.IsMaxDiscountAllowed = true;
                    //                            } else {
                    //                                if (DiscountCost > totalAmount) {
                    //                                    alertify.error("Please enter less than price");
                    //                                    subitem.DiscountCost = 0;
                    //                                    $scope.mainInvBillingObject.BillingDetail[index].Total = totalAmount;
                    //                                    $scope.SumAmount($scope.mainInvBillingObject);
                    //                                    $scope.DisablePayment = true;
                    //                                    subitem.IsMaxDiscountAllowed = true;
                    //                                    return false;
                    //                                } else {
                    //                                    totalAmount -= DiscountCost;
                    //                                    subitem.DiscountAmount = subitem.DiscountCost;
                    //                                    subitem.IsMaxDiscountAllowed = false;
                    //                                }
                    //                            }
                    //                        } else {
                    //                            if (DiscountCost > totalAmount) {
                    //                                alertify.error("Please enter less than price");
                    //                                subitem.DiscountCost = 0;
                    //                                $scope.mainInvBillingObject.BillingDetail[index].Total = totalAmount;
                    //                                $scope.SumAmount($scope.mainInvBillingObject);
                    //                                $scope.DisablePayment = true;
                    //                                subitem.IsMaxDiscountAllowed = true;
                    //                                return false;
                    //                            } else {
                    //                                totalAmount -= DiscountCost;
                    //                                subitem.DiscountAmount = subitem.DiscountCost;
                    //                                subitem.IsMaxDiscountAllowed = false;
                    //                            }
                    //                        }



                    //                    } else {
                    //                        alertify.error("Please enter In Between Actuval Cost and After Discount Cost");
                    //                        $scope.mainInvBillingObject.BillingDetail[index].DiscountCost = 0;
                    //                        subitem.IsMaxDiscountAllowed = true;
                    //                        $scope.DisablePayment = true;
                    //                        return false;
                    //                    }


                    //                    //if (DiscountCost > totalAmount) {
                    //                    //    alertify.error("Please enter less than price");
                    //                    //    subitem.DiscountCost = 0;
                    //                    //    $scope.mainInvBillingObject.BillingDetail[index].Total = totalAmount;
                    //                    //    $scope.SumAmount($scope.mainInvBillingObject);
                    //                    //    $scope.DisablePayment = true;
                    //                    //    subitem.IsMaxDiscountAllowed = true;
                    //                    //    return false;
                    //                    //} else {
                    //                    //    totalAmount -= DiscountCost;
                    //                    //    //$scope.mainInvBillingObject.BillingDetail[index].Total = totalAmount;
                    //                    //    subitem.DiscountAmount = subitem.DiscountCost;
                    //                    //    subitem.IsMaxDiscountAllowed = false;
                    //                    //}

                    //                }
                    //            } else {
                    //                alertify.error("Please enter In Between Actuval Cost and After Discount Cost");
                    //                $scope.mainInvBillingObject.BillingDetail[index].DiscountCost = 0;
                    //                subitem.IsMaxDiscountAllowed = true;
                    //                $scope.DisablePayment = true;
                    //                return false;

                    //            }
                    //        } else {
                    //            subitem.selectedParticular = subitem.selectedParticular || "";
                    //            if (subitem.selectedParticular !== '') {
                    //                if (subitem.DiscountType === "PERCENT") {
                    //                    subitem.DiscountAmount = (DiscountCost / 100) * totalAmount;
                    //                    totalAmount = totalAmount - subitem.DiscountAmount - subitem.PromoCodeAmount;
                    //                } else {
                    //                    if (DiscountCost > totalAmount) {
                    //                        alertify.error("Please enter less than price");
                    //                        subitem.DiscountCost = 0;
                    //                        $scope.mainInvBillingObject.BillingDetail[index].Total = totalAmount;
                    //                        $scope.SumAmount($scope.mainInvBillingObject);
                    //                        return false;
                    //                    } else {
                    //                        totalAmount -= DiscountCost;
                    //                        subitem.DiscountAmount = subitem.DiscountCost;
                    //                    }
                    //                }
                    //            }
                    //        }

                    //    }
                    //}
                    if (subitem.PreviousBill == "N" && subitem.IsIncluded && subitem.ProcedureTypeId != 8) {

                        if ($scope.PatientTypeId === 1) {

                            if (subitem.DiscountType === "PERCENT") {
                                subitem.DiscountAmount = (DiscountCost / 100) * totalAmount;
                                totalAmount = totalAmount - subitem.DiscountAmount - subitem.PromoCodeAmount;
                                subitem.IsMaxDiscountAllowed = false;
                            }
                            else if (subitem.DiscountType === "AMOUNT") {

                                if (DiscountCost > totalAmount) {
                                    alertify.error("Please enter less than price");
                                    subitem.DiscountCost = 0;
                                    $scope.mainInvBillingObject.BillingDetail[index].Total = totalAmount;
                                    $scope.SumAmount($scope.mainInvBillingObject);
                                    $scope.DisablePayment = true;
                                    subitem.IsMaxDiscountAllowed = true;
                                    return false;
                                } else {
                                    totalAmount -= DiscountCost;
                                    //$scope.mainInvBillingObject.BillingDetail[index].Total = totalAmount;
                                    subitem.DiscountAmount = subitem.DiscountCost;
                                    subitem.IsMaxDiscountAllowed = false;
                                }





                            }

                        }
                        else {

                            if (subitem.DiscountType === "PERCENT") {
                                subitem.DiscountAmount = (DiscountCost / 100) * totalAmount;
                                totalAmount = totalAmount - subitem.DiscountAmount - subitem.PromoCodeAmount;
                            } else {
                                if (DiscountCost > totalAmount) {
                                    alertify.error("Please enter less than price");
                                    subitem.DiscountCost = 0;
                                    $scope.mainInvBillingObject.BillingDetail[index].Total = totalAmount;
                                    $scope.SumAmount($scope.mainInvBillingObject);
                                    return false;
                                } else {
                                    totalAmount -= DiscountCost;
                                    //$scope.mainInvBillingObject.BillingDetail[index].Total = totalAmount;
                                    subitem.DiscountAmount = subitem.DiscountCost;
                                }
                            }

                        }


                    }

                    if (subitem.PreviousBill == "Y") {


                        if (subitem.DiscountType === "PERCENT") {
                            subitem.DiscountAmount = (DiscountCost / 100) * totalAmount;
                            totalAmount = totalAmount - subitem.DiscountAmount - subitem.PromoCodeAmount;
                        } else {
                            if (DiscountCost > totalAmount) {
                                alertify.error("Please enter less than price");
                                subitem.DiscountCost = 0;
                                $scope.mainInvBillingObject.BillingDetail[index].Total = totalAmount;
                                $scope.SumAmount($scope.mainInvBillingObject);
                                return false;
                            } else {
                                totalAmount -= DiscountCost;
                                subitem.DiscountAmount = subitem.DiscountCost;
                            }
                        }


                    }



                    if (subitem.isExclusiveTax) {

                        console.log(totalAmount);
                        subitem.Tax = ((Cgst + Sgst) / 100) * totalAmount;
                        subitem.Tax = parseFloat(subitem.Tax) || 0;
                        $scope.mainInvBillingObject.BillingDetail[index].Total = totalAmount + subitem.Tax;

                        $scope.mainInvBillingObject.BillingDetail[index].TotalwithoutTax = totalAmount;

                        subitem.GstAmount = parseFloat(subitem.Tax.toFixed(2));
                        subitem.NetAmount = $scope.mainInvBillingObject.BillingDetail[index].TotalwithoutTax;
                    }
                    else {
                        subitem.Tax = totalAmount - (totalAmount * (100 / (100 + parseFloat(subitem.Gst))));
                        subitem.Tax = parseFloat(subitem.Tax) || 0;
                        $scope.mainInvBillingObject.BillingDetail[index].Total = totalAmount;

                        $scope.mainInvBillingObject.BillingDetail[index].TotalwithoutTax = totalAmount - subitem.Tax;

                        subitem.GstAmount = parseFloat(subitem.Tax.toFixed(2));
                        subitem.NetAmount = $scope.mainInvBillingObject.BillingDetail[index].TotalwithoutTax;
                    }



                    if (subitem.IsWaved) {
                        $scope.mainInvBillingObject.BillingDetail[index].WaviedOffAmount = $scope.mainInvBillingObject.BillingDetail[index].Total;
                    }


                    if ($scope.mainInvBillingObject.includeAdvanceAmount) {
                        $scope.mainInvBillingObject.PayableAdvanceAmount = 0;
                        angular.forEach($scope.mainInvBillingObject.Payments, function (item, index) {
                            if (item.PaymentModeId === 18) {
                                $scope.mainInvBillingObject.Payments.splice(index, 1);
                            } else {
                                item.Amount = "";
                            }
                        });
                    }


                    $scope.SumAmount($scope.mainInvBillingObject);
                    $scope.mainInvBillingObject.includeAdvanceAmount = false;
                    //Remove Advance Amount Object From Paymnets Array
                    if (!$scope.editinvoice) {
                        $scope.mainInvBillingObject.Payments = $filter("filter")($scope.mainInvBillingObject.Payments, function (item, index) { return item.PaymentModeId !== 18; }) || [];
                    }
                    // IsIncludePatientAdvance(false, 1);
                    if (!$scope.editinvoice) {
                        $scope.mainInvBillingObject.PayableAdvanceAmount = 0;
                        $scope.mainInvBillingObject.TotalCollectedAmount = 0;
                    }
                    $scope.mainInvBillingObject.DueAfterAdvanceAmt = 0;

                    if (subitem.ProcedureCost !== 0) {
                        if ($scope.IsCreditBillingType === "Yes") {
                            $scope.DisablePayment = false;
                            $scope.CreditDisablePayment = false;
                            $scope.IsCreditBill = true;
                        }
                    }
                };

                $scope.discountTypeChange = function (subitem, index) {
                    $scope.mainInvBillingObject.BillingDetail[index].DiscountCost = "";
                    //$scope.CalculateTotalAmount(subitem, index);
                };
            }],
            "size": "md",
            "backdrop": "static",
            "keyboard": false,
            "resolve": {
                "subitem": function () {
                    return subitem;
                },
                "Type": function () {
                    return 3;
                },
                "index": function () {
                    return index;
                },
                "PatientTypeId": function () {
                    return $scope.PatientTypeId;
                }
            }

        });
        modalInstance.result.then(function (subitem) {
            if (subitem.WavedOffRemarks != "") {
                console.log(subitem);
            }
        }, function (cancel) {

        });
    };

    $scope.IncludeGst = function (subitem, index, mainInvBillingObject) {
        subitem.NetAmount = parseInt(subitem.ProcedureCost) - subitem.DiscountAmount;
        //  subitem.NetAmount = parseInt(subitem.ProcedureCost) - subitem.DiscountAmount;
        var modalInstance = $uibModal.open({
            "templateUrl": "templates/consultation/billing/WavedOfRemarks.html",
            "controller": ["$scope", "$log", "subitem", "$uibModalInstance", "Type", "index", "PatientTypeId", function ($scope, $log, subitem, $uibModalInstance, Type, index, PatientTypeId) {
                $scope.sindex = index;
                $scope.subitem = subitem;
                $scope.PatientTypeId = PatientTypeId;
                $scope.Billingpageno = 6;
                $scope.subitem.showIncludeTax = true;
                $scope.subitem.isExclusiveTax = true;
                $scope.mainInvBillingObject = mainInvBillingObject;
                $scope.Type = Type;
                $scope.cancel = function (subitem, type) {
                    var type = type || 'cancel';
                    if (type === 'cancel') {
                        subitem.showIncludeTax = false;
                        $scope.AddIncludeTax(subitem, $scope.sindex);
                        $uibModalInstance.dismiss("cancel");
                    } else {

                        $scope.AddIncludeTax(subitem, $scope.sindex, 'onClick');

                        $uibModalInstance.close(subitem);
                    }
                };
                $scope.SumAmount = function (mainitem) {
                    var val = 0, valWithouitTax = 0;
                    var totalgstval = 0;
                    mainitem.TotalGST = 0;
                    mainitem.TotalAmountToBeCollected = 0;
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

                        mainitem.TotalNetAmount = checkRoundVal(val - mainitem.TotalWaviedOffAmount - mainitem.PromoCodeAmount);

                        if (mainitem.includePreviousPaiAmount) {
                            var totalpayable = mainitem.TotalNetAmount;
                            if (totalpayable > $scope.PreviousAmountObj.PreviousTotalRecievedAmountMain) {
                                $scope.PreviousAmountObj.PreviousTotalRecievedAmount = $scope.PreviousAmountObj.PreviousTotalRecievedAmountMain;
                            } else {
                                $scope.PreviousAmountObj.PreviousTotalRecievedAmount = totalpayable;
                            }

                            $scope.PreviousAmountObj.RefundableAmount = $scope.PreviousAmountObj.PreviousTotalRecievedAmountMain - $scope.PreviousAmountObj.PreviousTotalRecievedAmount;
                        }
                        mainitem.TotalReceivedAmount = angular.copy(mainitem.TotalBilledCost + checkRoundVal(mainitem.PreviousPaidAmount) + $scope.PreviousAmountObj.PreviousTotalRecievedAmount);
                        mainitem.TotalBalance = checkRoundVal(mainitem.TotalNetAmount - mainitem.TotalReceivedAmount);
                        angular.forEach($scope.mainInvBillingObject.Payments, function (pitem) {
                            if (pitem.PaymentModeId === 39) {
                                pitem.Amount = $scope.PreviousAmountObj.PreviousTotalRecievedAmount;
                            }
                        });
                    }

                    if (totalgstval !== 0) {
                        mainitem.DiscountValue = 0;
                    }
                    if (mainitem.DiscountValue && checkRoundVal(mainitem.DiscountValue) !== 0) {
                        $scope.discountChange(mainitem);
                    }

                    if (mainitem.Mode === 'Add') {
                        angular.forEach($scope.mainInvBillingObject.Payments, function (item) {
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
                    if ($scope.IsCreditBillingType === "Yes") {
                        $scope.DisablePayment = false;
                        $scope.CreditDisablePayment = false;
                        $scope.IsCreditBill = true;
                    }


                    //return val ? val : 0;
                };
                $scope.CalculateTotalAmount = function (subitem, index) {
                    if ($scope.Billingpageno === 6) {
                        $scope.promoCodeObj = {
                            "PromoCode": "",
                            "PromoCodeId": "",
                            "OfferValue": "",
                            "OfferValueType": "",
                            "OfferAmount": "",
                            "PromoCodeTypeId": "",
                            "PromoCodeValid": false
                        }
                        $scope.mainInvBillingObject.PromoCode = "";
                        $scope.mainInvBillingObject.PromoCodeId = 0;
                        $scope.mainInvBillingObject.PromoCodeAmount = 0;
                        $scope.mainInvBillingObject.PromoCodeOfferValue = "";
                        $scope.mainInvBillingObject.PromoCodeOfferType = "";
                        $scope.mainInvBillingObject.IsPromoCodeApplied = false;
                        $scope.mainInvBillingObject.IsPromoCodeValid = false;
                        angular.forEach($scope.mainInvBillingObject.BillingDetail, function (bitem) {
                            console.log(bitem);
                            if (bitem.ProcedureID !== 0 && bitem.IsIncluded === true) {
                                bitem.PromoCodeAmount = 0;
                                bitem.PromoCodeApplied = false;
                            }
                        });
                    }
                    if (subitem.IsWaved) {
                        subitem.Cgst = 0;
                        subitem.Sgst = 0;
                        subitem.DiscountCost = 0;
                        subitem.showIncludeTax = false;
                        subitem.Igst = 0;
                        subitem.Gst = 0;
                    }
                    var totalAmount = 0;
                    var Cgst = parseFloat(subitem.Cgst) || 0;
                    var Sgst = parseFloat(subitem.Sgst) || 0;
                    var Multiplyfactor = parseFloat(subitem.Multiplyfactor) || 0;
                    var ProcedureCost = parseFloat(subitem.ProcedureCost) || 0;
                    totalAmount = ProcedureCost * Multiplyfactor;
                    var DiscountCost = parseFloat(subitem.DiscountCost) || 0;

                    //changes by bindu for waive off calculations 19-02-2020


                    if (!$scope.editinvoice) {
                        subitem.BilledCost = 0;
                    }
                    subitem.selectedParticular = subitem.selectedParticular || "";
                    if (subitem.PreviousBill == "N" && subitem.IsIncluded && subitem.ProcedureTypeId != 8) {

                        if ($scope.PatientTypeId === 1) {

                            if (subitem.DiscountType === "PERCENT") {
                                subitem.DiscountAmount = (DiscountCost / 100) * totalAmount;
                                totalAmount = totalAmount - subitem.DiscountAmount - subitem.PromoCodeAmount;
                                subitem.IsMaxDiscountAllowed = false;
                            }
                            else if (subitem.DiscountType === "AMOUNT") {

                                if (DiscountCost > totalAmount) {
                                    alertify.error("Please enter less than price");
                                    subitem.DiscountCost = 0;
                                    $scope.mainInvBillingObject.BillingDetail[index].Total = totalAmount;
                                    $scope.SumAmount($scope.mainInvBillingObject);
                                    $scope.DisablePayment = true;
                                    subitem.IsMaxDiscountAllowed = true;
                                    return false;
                                } else {
                                    totalAmount -= DiscountCost;
                                    //$scope.mainInvBillingObject.BillingDetail[index].Total = totalAmount;
                                    subitem.DiscountAmount = subitem.DiscountCost;
                                    subitem.IsMaxDiscountAllowed = false;
                                }





                            }

                        }
                        else {

                            if (subitem.DiscountType === "PERCENT") {
                                subitem.DiscountAmount = (DiscountCost / 100) * totalAmount;
                                totalAmount = totalAmount - subitem.DiscountAmount - subitem.PromoCodeAmount;
                            } else {
                                if (DiscountCost > totalAmount) {
                                    alertify.error("Please enter less than price");
                                    subitem.DiscountCost = 0;
                                    $scope.mainInvBillingObject.BillingDetail[index].Total = totalAmount;
                                    $scope.SumAmount($scope.mainInvBillingObject);
                                    return false;
                                } else {
                                    totalAmount -= DiscountCost;
                                    //$scope.mainInvBillingObject.BillingDetail[index].Total = totalAmount;
                                    subitem.DiscountAmount = subitem.DiscountCost;
                                }
                            }

                        }


                    }

                    if (subitem.PreviousBill == "Y") {


                        if (subitem.DiscountType === "PERCENT") {
                            subitem.DiscountAmount = (DiscountCost / 100) * totalAmount;
                            totalAmount = totalAmount - subitem.DiscountAmount - subitem.PromoCodeAmount;
                        } else {
                            if (DiscountCost > totalAmount) {
                                alertify.error("Please enter less than price");
                                subitem.DiscountCost = 0;
                                $scope.mainInvBillingObject.BillingDetail[index].Total = totalAmount;
                                $scope.SumAmount($scope.mainInvBillingObject);
                                return false;
                            } else {
                                totalAmount -= DiscountCost;
                                subitem.DiscountAmount = subitem.DiscountCost;
                            }
                        }


                    }

                    if (subitem.PreviousBill == "Y") {
                        if (subitem.DiscountType === "PERCENT") {
                            subitem.DiscountAmount = (DiscountCost / 100) * totalAmount;
                            totalAmount = totalAmount - subitem.DiscountAmount - subitem.PromoCodeAmount;
                        } else {
                            if (DiscountCost > totalAmount) {
                                alertify.error("Please enter less than price");
                                subitem.DiscountCost = 0;
                                $scope.mainInvBillingObject.BillingDetail[index].Total = totalAmount;
                                $scope.SumAmount($scope.mainInvBillingObject);
                                return false;
                            } else {
                                totalAmount -= DiscountCost;
                                subitem.DiscountAmount = subitem.DiscountCost;
                            }
                        }
                    }
                    if (subitem.isExclusiveTax) {
                        subitem.Tax = ((Cgst + Sgst) / 100) * totalAmount;
                        subitem.Tax = parseFloat(subitem.Tax) || 0;
                        $scope.mainInvBillingObject.BillingDetail[index].Total = totalAmount + subitem.Tax;
                        $scope.mainInvBillingObject.BillingDetail[index].TotalwithoutTax = totalAmount;
                        subitem.GstAmount = parseFloat(subitem.Tax.toFixed(2));
                        subitem.NetAmount = $scope.mainInvBillingObject.BillingDetail[index].TotalwithoutTax;
                    }
                    else {
                        subitem.Tax = totalAmount - (totalAmount * (100 / (100 + parseFloat(subitem.Gst))));
                        subitem.Tax = parseFloat(subitem.Tax) || 0;
                        $scope.mainInvBillingObject.BillingDetail[index].Total = totalAmount;
                        $scope.mainInvBillingObject.BillingDetail[index].TotalwithoutTax = totalAmount - subitem.Tax;
                        subitem.GstAmount = parseFloat(subitem.Tax.toFixed(2));
                        subitem.NetAmount = $scope.mainInvBillingObject.BillingDetail[index].TotalwithoutTax;
                    }
                    if (subitem.IsWaved) {
                        $scope.mainInvBillingObject.BillingDetail[index].WaviedOffAmount = $scope.mainInvBillingObject.BillingDetail[index].Total;
                    }

                    if ($scope.mainInvBillingObject.includeAdvanceAmount) {
                        $scope.mainInvBillingObject.PayableAdvanceAmount = 0;
                        angular.forEach($scope.mainInvBillingObject.Payments, function (item, index) {
                            if (item.PaymentModeId === 18) {
                                $scope.mainInvBillingObject.Payments.splice(index, 1);
                            } else {
                                item.Amount = "";
                            }
                        });
                    }

                    $scope.SumAmount($scope.mainInvBillingObject);
                    $scope.mainInvBillingObject.includeAdvanceAmount = false;
                    //Remove Advance Amount Object From Paymnets Array
                    if (!$scope.editinvoice) {
                        $scope.mainInvBillingObject.Payments = $filter("filter")($scope.mainInvBillingObject.Payments, function (item, index) { return item.PaymentModeId !== 18; }) || [];
                    }
                    // IsIncludePatientAdvance(false, 1);
                    if (!$scope.editinvoice) {
                        $scope.mainInvBillingObject.PayableAdvanceAmount = 0;
                        $scope.mainInvBillingObject.TotalCollectedAmount = 0;
                    }
                    $scope.mainInvBillingObject.DueAfterAdvanceAmt = 0;

                    angular.forEach($scope.mainInvBillingObject.BillingDetail, function (item, index) {
                        item.NetAmount = parseInt(item.ProcedureCost) - item.DiscountAmount;
                    });
                    if (subitem.ProcedureCost!==0) {
                        if ($scope.IsCreditBillingType === "Yes") {
                            $scope.DisablePayment = false;
                            $scope.CreditDisablePayment = false;
                            $scope.IsCreditBill = true;
                        }
                    }

                };
                $scope.discountTypeChange = function (subitem, index) {
                    $scope.mainInvBillingObject.BillingDetail[index].DiscountCost = "";
                    $scope.CalculateTotalAmount(subitem, index);
                };
                $scope.changeGstType = function (subitem, index) {
                    $scope.CalculateTotalAmount(subitem, index);
                };
                $scope.AddIncludeTax = function (item, index, type) {



                    if (item.showIncludeTax) {
                        $scope.ShowPatientGst = true;
                        if (type === 'onLoad') {
                            item.Cgst = 9;
                            item.Sgst = 9;
                            item.Gst = "18";
                        }
                    } else {
                        $scope.ShowPatientGst = false;
                        item.Cgst = 0;
                        item.Sgst = 0;
                        item.Gst = "";
                        $scope.mainInvBillingObject.PatientGSTNo = "";
                    }

                    if (type === 'onClick') {
                        $scope.CalculateTotalAmount(item, index);
                    }

                };
                $scope.changeGST = function (subitem, index) {

                    subitem.NetAmount = parseInt(subitem.ProcedureCost) - subitem.DiscountAmount;

                    var gst = parseFloat(subitem.Gst) || 0;

                    var subgst = gst / 2;

                    subitem.Cgst = subgst;
                    subitem.Sgst = subgst;

                    $scope.CalculateTotalAmount(subitem, index);
                };
                $scope.AddIncludeTax($scope.subitem, $scope.sindex, 'onLoad');

            }],
            "size": "md",
            "backdrop": "static",
            "keyboard": false,
            "resolve": {
                "subitem": function () {
                    return subitem;
                },
                "Type": function () {
                    return 6;
                },
                "index": function () {
                    return index;
                },
                "PatientTypeId": function () {
                    return $scope.PatientTypeId;
                }
            }

        });
        modalInstance.result.then(function (subitem) {

            console.log(subitem);

        }, function (cancel) {
            console.log(cancel);
        });
    };

    $scope.ChangeWavieOff = function (subitem, index) {

        if (subitem.IsWaved) {
            var modalInstance = $uibModal.open({
                "templateUrl": "templates/consultation/billing/WavedOfRemarks.html",
                "controller": ["$scope", "$log", "subitem", "$uibModalInstance", "Type", function ($scope, $log, subitem, $uibModalInstance, Type) {
                    $scope.subitem = subitem;
                    $scope.Type = Type;
                    $scope.cancel = function (subitem) {
                        $uibModalInstance.close(subitem);
                    };
                }],
                "size": "md",
                "backdrop": "static",
                "keyboard": false,
                "resolve": {
                    "subitem": function () {
                        return subitem;
                    },
                    "Type": function () {
                        return 1;
                    }

                }

            });
            modalInstance.result.then(function (subitem) {
                if (subitem.WavedOffRemarks !== "") {
                    if (subitem.IsWaved) {
                        subitem.BilledCost = 0;
                        subitem.WaviedOffAmount = subitem.Total;
                    } else {
                        subitem.WaviedOffAmount = 0;
                    }
                    $scope.CalculateTotalAmount(subitem, index);
                } else {
                    subitem.IsWaved = false;
                }



            }, function (cancel) {

            });
        } else {
            subitem.WavedOffRemarks = "";
            subitem.WaviedOffAmount = 0;
            $scope.CalculateTotalAmount(subitem, index);
        }



    };

    function roundto2decimals(value, decimals) {
        return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
    }
    function checkRoundVal(val) {
        return val !== undefined && val !== "" && val !== null ? Math.round(val) : 0;
    }

    $scope.deleteBillingItem = function (index, item) {
        alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to delete ? </h4>", function () {

            if (item.BillingDetailId != 0) {
                item.DeleteInd = true;
                item.Status = 'D';
                $scope.mainInvBillingObject.DeletedBillItems.push(item);
            }

            $scope.promoCodeObj = {
                "PromoCode": "",
                "PromoCodeId": "",
                "OfferValue": "",
                "OfferValueType": "",
                "OfferAmount": "",
                "PromoCodeTypeId": "",
                "PromoCodeValid": false
            };


            $scope.mainInvBillingObject.PromoCode = "";
            $scope.mainInvBillingObject.PromoCodeId = 0;
            $scope.mainInvBillingObject.PromoCodeAmount = 0;
            $scope.mainInvBillingObject.PromoCodeOfferValue = "";
            $scope.mainInvBillingObject.PromoCodeOfferType = "";
            $scope.mainInvBillingObject.IsPromoCodeApplied = false;
            $scope.mainInvBillingObject.IsPromoCodeValid = false;

            angular.forEach($scope.mainInvBillingObject.BillingDetail, function (bitem) {
                console.log(bitem);
                if (bitem.ProcedureID !== 0 && bitem.IsIncluded === true) {
                    bitem.PromoCodeAmount = 0;
                    bitem.PromoCodeApplied = false;
                }
            });

            $scope.mainInvBillingObject.BillingDetail.splice(index, 1);
            $scope.SumAmount($scope.mainInvBillingObject);
            $scope.$apply();
        }, function () {

        });
    };

    $scope.$watch("mainInvBillingObject.Payments", function (newVal, oldVal) {

        if ($scope.mainInvBillingObject === undefined) { return; }
        var pAmountCount = 0;
        angular.forEach($scope.mainInvBillingObject.Payments, function (item) {
            var bamount = 0;
            bamount = item.Amount;
            if (bamount === undefined || bamount === "" || bamount === "0") {
                bamount = 0;
            }
            bamount = parseInt(bamount);
            if (item.PaymentModeId !== 1) {
                if (bamount !== 0) {
                    pAmountCount++;
                }
            }
        });

        var cAmountCount = 0;
        angular.forEach($scope.mainInvBillingObject.Payments, function (item) {
            var bamount = 0;
            bamount = item.Amount;
            if (bamount === undefined || bamount === "" || bamount === "0") {
                bamount = 0;
            }
            bamount = parseInt(bamount);
            if (item.PaymentModeId === 1) {
                if (item.Amount !== "") {
                    if (bamount === 0 || bamount > 0) {
                        cAmountCount++;
                    }
                }
            }
        });




        if (pAmountCount === 0 && cAmountCount === 0) {
            $scope.DisablePayment = true;
        } else {
            $scope.DisablePayment = false;
            $scope.CreditDisablePayment = false;
        }



        if ($scope.mainInvBillingObject.Mode === 'Edit') {

            if ($scope.PreviousAmountObj.PreviousTotalRecievedAmount > 0) {
                $scope.DisablePayment = false;
                $scope.CreditDisablePayment = false;

            }
        }

    }, true);

    $scope.activeParticularPaymentMode = function (item) {
        angular.forEach($scope.mainInvBillingObject.Payments, function (mitem) {
            if (mitem.PaymentModeId === item.PaymentModeId) {
                mitem.IsActive = true;
            } else {
                mitem.IsActive = false;
                //  mitem.OtherDetailsDiv = false;
            }
        });
    };

    $scope.changePayableAmount = function (item) {



        angular.forEach($scope.mainInvBillingObject.Payments, function (mitem) {
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
            var advanceamt = parseInt($scope.mainInvBillingObject.PatientAdvanceAmount);
            if (amountEntered > advanceamt) {
                amountEntered = "";
                alertify.error("Please Enter Less Than or Equal to Advance");
            }
        }




        var totalbilledNow = 0;
        angular.forEach($scope.mainInvBillingObject.Payments, function (bitem) {
            totalbilledNow += parseFloat(bitem.Amount) || 0;
        });






        if ($scope.editBillingItemandCost) {
            var totalreceived = 0, totalBal = 0;
            totalreceived = totalbilledNow + $scope.mainInvBillingObject.PreviousPaidAmount;
            if (totalreceived > $scope.mainInvBillingObject.TotalNetAmount) {
                item.Amount = "";
                $scope.IsValidPayment = true;
                alertify.error("Please Enter Less Than or Equal to Total Balence");
            } else {
                $scope.IsValidPayment = false;
            }

            $scope.calculateFinalAmount();
        }
        else {

            if ($scope.mainInvBillingObject.Mode === 'Update') {
                var totalBcost = parseFloat($scope.mainInvBillingObject.TotalBilledCost) || 0;

                if (totalbilledNow > totalBcost) {
                    item.Amount = "";
                    $scope.IsValidPayment = true;
                    alertify.error("Please Enter Equal Amount to Billed Amount");
                } else {
                    $scope.IsValidPayment = false;
                }
            }
            else {
                var totalreceived = 0, totalBal = 0;
                totalreceived = totalbilledNow + $scope.mainInvBillingObject.PreviousPaidAmount;

                if ($scope.mainInvBillingObject.Mode === 'Edit') {
                    totalreceived = totalreceived + $scope.PreviousAmountObj.PreviousTotalRecievedAmount;
                }


                if (totalreceived > $scope.mainInvBillingObject.TotalNetAmount) {
                    item.Amount = "";
                    $scope.IsValidPayment = true;
                    alertify.error("Please Enter Less Than or Equal to Total Balence");
                } else {
                    $scope.IsValidPayment = false;
                }

                $scope.calculateFinalAmount();
            }


        }







    };

    $scope.calculateFinalAmount = function () {
        var totalbilledNow = 0, collectedAmount = 0;


        angular.forEach($scope.mainInvBillingObject.Payments, function (bitem) {

            totalbilledNow += parseFloat(bitem.Amount) || 0;
        });




        $scope.mainInvBillingObject.TotalBilledCost = totalbilledNow;



        $scope.mainInvBillingObject.TotalCollectedAmount = totalbilledNow - (parseFloat($scope.mainInvBillingObject.PayableAdvanceAmount) || 0);





        var billedcost = checkRoundVal($scope.mainInvBillingObject.TotalBilledCost);
        var checkBillAmount = 0;
        if ($scope.mainInvBillingObject.PreviousPaidAmount) {
            checkBillAmount = checkRoundVal($scope.mainInvBillingObject.TotalNetAmount) - checkRoundVal($scope.mainInvBillingObject.PreviousPaidAmount);
        } else {
            checkBillAmount = checkRoundVal($scope.mainInvBillingObject.TotalNetAmount);
        }



        if (billedcost > checkBillAmount) {
            $scope.mainInvBillingObject.TotalReceivedAmount = checkRoundVal($scope.mainInvBillingObject.PreviousPaidAmount) + $scope.PreviousAmountObj.PreviousTotalRecievedAmount;
            $scope.mainInvBillingObject.TotalBilledCost = 0;
            $scope.mainInvBillingObject.TotalCollectedAmount = 0;
            alertify.error("Please enter less than or equal to Total Balance");
            $scope.mainInvBillingObject.TotalBalance = checkRoundVal($scope.mainInvBillingObject.TotalNetAmount - $scope.mainInvBillingObject.TotalReceivedAmount);
            return false;
        } else {
            var totalReceivedAmt = 0;
            totalReceivedAmt = billedcost + checkRoundVal($scope.mainInvBillingObject.PreviousPaidAmount) + $scope.PreviousAmountObj.PreviousTotalRecievedAmount;
            $scope.mainInvBillingObject.TotalReceivedAmount = checkRoundVal(totalReceivedAmt);
            $scope.mainInvBillingObject.TotalBalance = checkRoundVal($scope.mainInvBillingObject.TotalNetAmount - $scope.mainInvBillingObject.TotalReceivedAmount);
        }






    };
    $scope.addupdateModeofpay = function (item) {

        var pmodeCount = 0;
        angular.forEach($scope.masterPaymentModes, function (mitem) {
            if (mitem.IsPaymentModeSelected) {
                pmodeCount++;
            }
        });


        if (pmodeCount > 3) {
            item.IsPaymentModeSelected = false;
            alertify.error("You can pay the bill with maximum 3 Payment Modes");
            return;
        }

        if (item.IsPaymentModeSelected) {
            angular.forEach($scope.mainInvBillingObject.Payments, function (pitem, index) {
                pitem.IsActive = false;
            });

            var paymentobj = angular.copy($scope.GetPaymentObject());
            paymentobj.PaymentModeId = item.PaymentModeId;
            paymentobj.PaymentModeName = item.PaymentModeName;
            paymentobj.IsActive = true;
            $scope.mainInvBillingObject.Payments.push(paymentobj);

        } else {
            angular.forEach($scope.mainInvBillingObject.Payments, function (pitem, index) {
                if (pitem.PaymentModeId === item.PaymentModeId) {
                    $scope.mainInvBillingObject.Payments.splice(index, 1);
                }
                if (pitem.PaymentModeId === 1) {
                    pitem.IsActive = true;
                } else {
                    pitem.IsActive = false;
                }
            });
        }

        //$scope.calculateFinalAmount();
    };

    $scope.PreviousAmountObj = {
        "PreviousTotalRecievedAmount": 0,
        "PreviousTotalRecievedAmountMain": 0,
        "UsedPreviousAmount": 0,
        "RefundableAmount": 0
    };

    $scope.ExpireremoveTagOnBackspace = function (event, name) {
        name = name || "";
        if (name !== "") {
            if (event.keyCode === 8) {
                if (name.indexOf("/") > -1) {
                    if (name.length === 2) {
                        $scope.mainInvBillingObject.PaymentInfoObject.CardDetails.CardExpDate = name;
                    }
                }

            }
            if (name.length === 2) {
                if (event.keyCode === 8) {
                    $scope.mainInvBillingObject.PaymentInfoObject.CardDetails.CardExpDate = name.substring(0, name.length - 1);
                } else {
                    $scope.mainInvBillingObject.PaymentInfoObject.CardDetails.CardExpDate = name + "/";
                }

            }
        }
    };


    $scope.changeIncludeAdvanceStatus = function (val) {

        if (val) {
            var totalpayable = $scope.mainInvBillingObject.TotalNetAmount;
            if ($scope.mainInvBillingObject.PreviousPaidAmount > 0) {
                totalpayable = $scope.mainInvBillingObject.TotalNetAmount - $scope.mainInvBillingObject.PreviousPaidAmount;
            }
            if (totalpayable > $scope.mainInvBillingObject.PatientAdvanceAmount) {
                $scope.mainInvBillingObject.PayableAdvanceAmount = $scope.mainInvBillingObject.PatientAdvanceAmount;
            } else {
                $scope.mainInvBillingObject.PayableAdvanceAmount = totalpayable;
            }

            angular.forEach($scope.mainInvBillingObject.Payments, function (item, index) {
                item.Amount = "";
            });
            var paymentobj = angular.copy($scope.GetPaymentObject());
            paymentobj.PaymentModeId = 18;
            paymentobj.PaymentModeName = "Patient Advance";
            paymentobj.Amount = $scope.mainInvBillingObject.PayableAdvanceAmount;
            $scope.mainInvBillingObject.Payments.push(paymentobj);
        }
        else {
            $scope.mainInvBillingObject.PayableAdvanceAmount = 0;

            angular.forEach($scope.mainInvBillingObject.Payments, function (item, index) {
                if (item.PaymentModeId === 18) {
                    $scope.mainInvBillingObject.Payments.splice(index, 1);
                }
                else {
                    item.Amount = "";
                }
            });

        }


        $scope.mainInvBillingObject.TotalBilledCost = $scope.mainInvBillingObject.PayableAdvanceAmount;
        $scope.mainInvBillingObject.TotalCollectedAmount = 0;
        $scope.mainInvBillingObject.DueAfterAdvanceAmt = $scope.mainInvBillingObject.TotalNetAmount - $scope.mainInvBillingObject.TotalBilledCost - $scope.mainInvBillingObject.PreviousPaidAmount;

        $scope.calculateFinalAmount();
        $scope.mainInvBillingObject.TempReceivedAmt = $scope.mainInvBillingObject.TotalReceivedAmount;


    };


    $scope.changeAdvancepayableAmt = function () {






        var PayableAdvanceAmount = parseFloat($scope.mainInvBillingObject.PayableAdvanceAmount) || 0;

        var totalpayable = $scope.mainInvBillingObject.TotalNetAmount;
        if ($scope.mainInvBillingObject.PreviousPaidAmount > 0) {
            totalpayable = $scope.mainInvBillingObject.TotalNetAmount - $scope.mainInvBillingObject.PreviousPaidAmount;
        }
        if (PayableAdvanceAmount > totalpayable) {
            alertify.error("more than Total amount not allowed");
            $scope.mainInvBillingObject.PayableAdvanceAmount = 0;
        } else {
            if (PayableAdvanceAmount > $scope.mainInvBillingObject.PatientAdvanceAmount) {
                alertify.error("more than advance amount not allowed");
                $scope.mainInvBillingObject.PayableAdvanceAmount = 0;
            }
        }





        if ($scope.mainInvBillingObject.PayableAdvanceAmount === "" || $scope.mainInvBillingObject.PayableAdvanceAmount === undefined) {
            $scope.mainInvBillingObject.PayableAdvanceAmount = 0;
        }

        $scope.mainInvBillingObject.TotalBilledCost = parseFloat($scope.mainInvBillingObject.PayableAdvanceAmount);

        $scope.mainInvBillingObject.DueAfterAdvanceAmt = $scope.mainInvBillingObject.TotalNetAmount - $scope.mainInvBillingObject.PreviousPaidAmount - $scope.mainInvBillingObject.TotalBilledCost;



        $scope.mainInvBillingObject.TotalCollectedAmount = 0;


        angular.forEach($scope.mainInvBillingObject.Payments, function (item) {
            if (item.PaymentModeId === 18) {
                item.Amount = parseFloat($scope.mainInvBillingObject.PayableAdvanceAmount) || 0;
            } else {
                item.Amount = "";
            }
        });

        $scope.calculateFinalAmount();

    };

    $scope.changeIncludePreviousAmountStatus = function (val) {


        if (val) {
            var totalpayable = $scope.mainInvBillingObject.TotalNetAmount;
            if ($scope.mainInvBillingObject.PreviousPaidAmount > 0) {
                totalpayable = $scope.mainInvBillingObject.TotalNetAmount - $scope.mainInvBillingObject.PreviousPaidAmount;
            }
            if (totalpayable > $scope.PreviousAmountObj.PreviousTotalRecievedAmountMain) {
                $scope.PreviousAmountObj.PreviousTotalRecievedAmount = $scope.PreviousAmountObj.PreviousTotalRecievedAmountMain;
            } else {
                $scope.PreviousAmountObj.PreviousTotalRecievedAmount = totalpayable;
                $scope.PreviousAmountObj.RefundableAmount = $scope.PreviousAmountObj.PreviousTotalRecievedAmountMain - totalpayable;
            }

            angular.forEach($scope.mainInvBillingObject.Payments, function (item, index) {
                item.Amount = "";
            });
        }
        else {
            $scope.PreviousAmountObj.PreviousTotalRecievedAmount = 0;
            angular.forEach($scope.mainInvBillingObject.Payments, function (item) {
                if (item.PaymentModeId === 18) {
                    item.Amount = parseFloat($scope.mainInvBillingObject.PayableAdvanceAmount) || 0;
                } else {
                    item.Amount = "";
                }
            });
            $scope.DisablePayment = true;
            $scope.PreviousAmountObj.RefundableAmount = $scope.PreviousAmountObj.PreviousTotalRecievedAmountMain;
        }


        $scope.mainInvBillingObject.TotalBilledCost = $scope.PreviousAmountObj.PreviousTotalRecievedAmount;
        $scope.mainInvBillingObject.TotalCollectedAmount = 0;

        angular.forEach($scope.mainInvBillingObject.BillingDetail, function (bitem, index) {
            $scope.CalculateTotalAmount(bitem, index);
        });

    };

    $scope.changePreviousPaidpayableAmt = function () {






        var PayableAdvanceAmount = parseFloat($scope.PreviousAmountObj.PreviousTotalRecievedAmount) || 0;

        var totalpayable = $scope.mainInvBillingObject.TotalNetAmount;

        if (PayableAdvanceAmount > totalpayable) {
            alertify.error("more than Total amount not allowed");
            $scope.PreviousAmountObj.PreviousTotalRecievedAmount = 0;
        } else {
            if (PayableAdvanceAmount > $scope.PreviousAmountObj.PreviousTotalRecievedAmountMain) {
                alertify.error("more than previous amount not allowed");
                $scope.PreviousAmountObj.PreviousTotalRecievedAmount = 0;
            }
        }







        $scope.mainInvBillingObject.TotalBilledCost = parseFloat($scope.PreviousAmountObj.PreviousTotalRecievedAmount);





        $scope.mainInvBillingObject.TotalCollectedAmount = 0;


        angular.forEach($scope.mainInvBillingObject.Payments, function (item) {
            if (item.PaymentModeId === 33) {
                item.Amount = parseFloat($scope.PreviousAmountObj.PreviousTotalRecievedAmount) || 0;
            } else {
                item.Amount = "";
            }
        });

        $scope.calculateFinalAmount();

    };




    $scope.saveInvBilling = function (printVal, sendDocEmail, sendPatientEmail, sendPatientSms, PrintType) {

        var pAmount = 0;



        $scope.mainInvBillingObject.RefundableAmount = 0;
        if ($scope.mainInvBillingObject.Mode === 'Edit') {
            var paymentobj = angular.copy($scope.GetPaymentObject());
            paymentobj.PaymentModeId = 39;
            paymentobj.PaymentModeName = "Previous Paid Amount";
            paymentobj.Amount = $scope.PreviousAmountObj.PreviousTotalRecievedAmount;
            $scope.mainInvBillingObject.Payments.push(paymentobj);
            $scope.mainInvBillingObject.RefundableAmount = $scope.PreviousAmountObj.RefundableAmount;
        }


        angular.forEach($scope.mainInvBillingObject.Payments, function (item) {
            pAmount += parseFloat(item.Amount) || 0;
        });




        //PreCheck for Zero Payment by durga as on 15-11-2019
        var singleItem = false;

        var filteredProducts = $filter("filter")($scope.mainInvBillingObject.BillingDetail, function (item) {
            return item.ProcedureID !== 0;
        });

        var filteredIncludeItems = $filter("filter")(filteredProducts, function (item) {
            return item.IsIncluded;
        });
        var filteredWavedOffItems = $filter("filter")($scope.mainInvBillingObject.BillingDetail, function (item) {
            return item.IsWaved && item.IsIncluded;
        });

        if (filteredIncludeItems.length === 1 && filteredWavedOffItems.length === 1) {
            singleItem = true;
            $scope.mainInvBillingObject.ZeroBillingRemarks = $scope.mainInvBillingObject.BillingDetail[0].WavedOffRemarks;
        }

        $scope.mainInvBillingObject.TotalBilledCost = pAmount;

        //   return false;

        if ($scope.mainInvBillingObject.TotalBilledCost === 0 && !singleItem && $scope.IsCreditBillingType === 'No') {
            var modalInstance = $uibModal.open({
                "templateUrl": "templates/consultation/billing/WavedOfRemarks.html",
                controller: function ($scope, $log, subitem, $uibModalInstance, Type) {
                    $scope.subitem = subitem;
                    $scope.Type = Type;
                    $scope.cancel = function (subitem) {
                        $uibModalInstance.close(subitem);
                    };
                },
                "size": "md",
                "backdrop": "static",
                "keyboard": false,
                "resolve": {
                    "subitem": function () {
                        return $scope.mainInvBillingObject;
                    },
                    "Type": function () {
                        return 2;
                    }

                }

            });
            modalInstance.result.then(function (subitem) {
                if ($scope.mainInvBillingObject.ZeroBillingRemarks != "") {
                    if ($scope.mainInvBillingObject.TotalAmountToBeCollected === 0) {
                        continuetobilling(printVal, sendDocEmail, sendPatientEmail, sendPatientSms, PrintType);
                    } else {
                        if (pAmount > $scope.mainInvBillingObject.TotalAmountToBeCollected || pAmount < $scope.mainInvBillingObject.TotalAmountToBeCollected) {

                            alertify.confirm("<b class='txt-centre'>Note !</b><h4 class='txt-body-centre'> Collected Amount Mismatched With Payment Details.<br>Do You Want To Continue ? </h4>", function () {
                                continuetobilling(printVal, sendDocEmail, sendPatientEmail, sendPatientSms, PrintType);
                            }, function () {

                            });
                        } else if (pAmount === $scope.mainInvBillingObject.TotalAmountToBeCollected) {
                            continuetobilling(printVal, sendDocEmail, sendPatientEmail, sendPatientSms, PrintType);
                        }

                    }
                } else {
                    alertify.error("Zero Billing Remarks Required");
                    return false;
                }


            }, function (cancel) {
            });

        } else {
            if ($scope.mainInvBillingObject.TotalAmountToBeCollected === 0) {
                continuetobilling(printVal, sendDocEmail, sendPatientEmail, sendPatientSms, PrintType);
            } else {
                if (pAmount > $scope.mainInvBillingObject.TotalAmountToBeCollected || pAmount < $scope.mainInvBillingObject.TotalAmountToBeCollected) {

                    alertify.confirm("<b class='txt-centre'>Note !</b><h4 class='txt-body-centre'> Collected Amount Mismatched With Payment Details.<br>Do You Want To Continue ? </h4>", function () {
                        continuetobilling(printVal, sendDocEmail, sendPatientEmail, sendPatientSms, PrintType);
                    }, function () {

                    });
                } else if (pAmount === $scope.mainInvBillingObject.TotalAmountToBeCollected) {
                    continuetobilling(printVal, sendDocEmail, sendPatientEmail, sendPatientSms, PrintType);
                }

            }
        }

    };




    function continuetobilling(printVal, sendDocEmail, sendPatientEmail, sendPatientSms, PrintType) {



        if ($scope.tempIndividualTotalAmt !== $scope.mainInvBillingObject.TotalBilledCost) {
            var totalBilledCost = $scope.mainInvBillingObject.TotalBilledCost;
            angular.forEach($scope.mainInvBillingObject.BillingDetail, function (item) {
                if (item.IsIncluded) {
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
                }
            });
        }


        $scope.TempBillingObject = angular.copy($scope.mainInvBillingObject);



        var GSTDiscountObject = eHnoteProcedureDataService.DiscountOrGSTEnabledObject($scope.TempBillingObject.BillingDetail);
        $scope.TempBillingObject.IsDiscountChecked = GSTDiscountObject.IsDiscountChecked;
        $scope.TempBillingObject.IsGSTChecked = GSTDiscountObject.IsGSTChecked;





        $scope.TempBillingObject.Payments = eHnotePatientDataService.ModifyPaymentsArray($scope.TempBillingObject.Payments);

        var emptytrasactioncount = 0;
        if ($scope.SpecializationId === 2) {
            angular.forEach($scope.TempBillingObject.Payments, function (pitem) {
                if (pitem.PaymentModeId !== 1 && pitem.PaymentModeId !== 18 && pitem.PaymentModeId !== 3) {
                    if (pitem.TransactionNumber === '') {
                        emptytrasactioncount++;
                    }
                }
            });
        }

        if (emptytrasactioncount > 0) {
            alertify.error("Please Enter Transaction Number ");
            return false;
        }




        if ($scope.mainInvBillingObject.TotalBilledCost) {
            var CostInWords = eHnotePrintService.ConvertNumberToWords($scope.mainInvBillingObject.TotalBilledCost);
            $scope.TempBillingObject.CostInWords = CostInWords;
            $scope.mainInvBillingObject.CostInWords = CostInWords;
        }
        $scope.TempBillingObject.Signature = doctorinfo.doctordata.User[0].FullName;













        $scope.TempBillingObject.IsSendMail = $scope.IsSendMail;
        $scope.TempBillingObject.IsSendSms = $scope.IsSendSms;

        $scope.TempBillingObject.DoctorEmail = appointmentinfo.DoctorEmail;


        $scope.TempBillingObject.PatientEmail = appointmentinfo.PatientDetails.EmailId ? appointmentinfo.PatientDetails.EmailId : "";
        $scope.TempBillingObject.BranchName = appointmentinfo.BranchName;
        $scope.TempBillingObject.BranchEmail = appointmentinfo.BranchEmail;
        $scope.TempBillingObject.BranchMobile = appointmentinfo.BranchMobile;
        $scope.TempBillingObject.DoctorName = appointmentinfo.DoctorFullName;

        $scope.TempBillingObject.PatientGender = appointmentinfo.PatientDetails.Gender;
        $scope.TempBillingObject.BranchArea = appointmentinfo.BranchArea;


        $scope.SubmitPrintVal = printVal;
        $scope.SubmitPrintType = PrintType;


        $scope.TempBillingObject.TreatmentHistoryIds = "";

        $scope.TempBillingDetail = [];


        $scope.TempBillingObject.BillingDetail = $filter("filter")($scope.TempBillingObject.BillingDetail, function (item, index) {
            item.ProcedureID = item.ProcedureID || 0;
            return item.ProcedureCost !== "" && item.IsIncluded && item.ProcedureID !== 0;
        });



        //Checking ConvesrionDoctor Mandatory

        var IsConvesrionDoctorsSelected = eHnoteProcedureDataService.IsConversionDoctorMandatory(window.url, $scope.TempBillingObject.BillingDetail, $scope.ParentHospitalID);
        if (!IsConvesrionDoctorsSelected) {
            alertify.error("Please select conversion doctor for treatment type item(s)");
            return;
        }



        $scope.TempBillingObject.BillingDetail.forEach(function (item, ind) {
            item.RowId = ind + 1;
            item.Cgst = parseFloat(item.Cgst) || 0;
            item.Sgst = parseFloat(item.Sgst) || 0;
            item.Gst = parseFloat(item.Gst) || 0;
            item.Tax = parseFloat(item.Tax) || 0;
            item.ProcedureCost = parseFloat(item.ProcedureCost) || 0;
            item.BilledCost = parseFloat(item.BilledCost) || 0;
            item.TotalAmountReceived = item.BilledCost;
            item.DiscountCost = parseFloat(item.DiscountCost) || 0;
            item.ProcedureID = item.ProcedureID || 0;
            if ($scope.TempBillingObject.PatientGSTNo) {
                item.PatientGSTNo = $scope.TempBillingObject.PatientGSTNo;
            }
            $scope.TempBillingDetail.push(item);


        });

        var TotalBilledCost = parseFloat($scope.mainInvBillingObject.TotalBilledCost) || 0;





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
                $scope.BookDummyAppointment(Appparams, $scope.TempBillingObject, doctorinfo.doctorid, appointmentinfo, appointmentinfo.PatientID, $scope.HospitalID, sendDocEmail, sendPatientEmail, sendPatientSms, appointmentinfo.DoctorID, $scope.HospitalID, $scope.ParentHospitalID);
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

        var filteredNewInvestigations = $filter("filter")(mainitem.BillingDetail, function (sitem) {
            return sitem.PatientInvestigationId === 0;
        });



        console.log(mainitem);
        // return false;
        if (filteredNewInvestigations.length > 0) {

            saveInvestigations(filteredNewInvestigations, mainitem, sendDocEmail, sendPatientEmail, sendPatientSms, billingTypeId);

        } else {

            mainitem.IsCreditBill = $scope.IsCreditBill;
            mainitem.PatientInsuranceDetailId = $scope.PatientInsuranceDetailId;
            if ($scope.IsCreditBillingType === 'No') {
                mainitem.IsCreditBill = false;
                mainitem.PatientInsuranceDetailId = 0;
            }
            if ($scope.IsCreditBillingType === 'Yes') {
                if (mainitem.IsCreditBill) {
                    mainitem.DueFromInsurance = mainitem.TotalBalance;
                    mainitem.TotalInsuranceAmount = mainitem.DueFromInsurance;
                    mainitem.TotalBalance = 0;
                    mainitem.TotalReceivedAmount = 0;
                    mainitem.TotalBilledCost = 0;
                }

            }
            eHnotePatientDataService.AddUpdateBilling(mainitem, doctorinfo.doctorid, appointmentinfo, appointmentinfo.PatientID, sendDocEmail, sendPatientEmail, sendPatientSms, appointmentinfo.DoctorID, $scope.HospitalID, $scope.ParentHospitalID, $scope.Billingpageno, billingTypeId, doctorinfo.doctordata.UserAddress[0].IsSMSInd, doctorinfo.doctordata.UserAddress[0].SMSSenderId, onBillingSaveSuccess, onBillingSaveError);
        }




    }


    $scope.BookDummyAppointment = function (Appparams, TempBillingObject, docid, appointmentinfo, PatientID, HospitalID, sendDocEmail, sendPatientEmail, sendPatientSms, DoctorID, HospitalId, ParentHospitalID) {


        eHnotePatientDataService.BookDummyAppointment(Appparams).then(function (resp) {



            if (resp.data.status === "success") {
                TempBillingObject.AppointmentID = resp.data.response.AppointmentID;
                $scope.mainAppointmentId = resp.data.response.AppointmentID;
                mergeBillingsandContinue(TempBillingObject, sendDocEmail, sendPatientEmail, sendPatientSms);
            }



        }, function (err) { console.log(err); });
    };


    function onBillingSaveSuccess(resp) {

        if (resp.data.status === "Failure") {
            $scope.DisablePayment = false;
            $scope.CreditDisablePayment = false;
            alertify.error("Saving billing failed");

            return;
        }


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

        if (resp.data.status === "Success") {
            $scope.DisablePayment = true;
            $scope.editBillingItem = false;
            $scope.editBillingItemandCost = false;
            alertify.success("Billing completed");
            if (appointmentinfo.CaptureBillingFrom === 'OpInvesitgationList') {
                $location.path("/OP");
                $rootScope.Comingfrom = "investigations";
            }
            else if (appointmentinfo.CaptureBillingFrom === 'Appointment') {
                $location.path("/OP");
                $rootScope.Comingfrom = "appointments";
            }
            if ($scope.SubmitPrintVal === "Print") {
                var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
                var costinwords = eHnotePrintService.ConvertNumberToWords($scope.mainInvBillingObject.TotalBilledCost);
                var pDate = $filter('date')($scope.mainInvBillingObject.BillDate, "dd-MMM-yyyy");
                var pTime = moment($scope.mainInvBillingObject.BillDate).format("HH:mm");
                var pDateTime = pDate;
                $scope.PaymentTypeName = "";



                var GSTDiscountObject = eHnoteProcedureDataService.DiscountOrGSTEnabledObject($scope.mainInvBillingObject.BillingDetail);


                console.log($scope.mainInvBillingObject.DoctorFullName + "__" + appointmentinfo.DoctorFullName);



                var billingobject = {
                    "InvoiceNumber": resp.data.InvoiceId,
                    "ReceiptNumber": resp.data.ReceiptNo,
                    "BillNumber": resp.data.BillingId,
                    //"TotalNetAmount": $scope.mainInvBillingObject.TotalNetAmount - $scope.mainInvBillingObject.TotalWaviedOffAmount,
                    "TotalNetAmount": $scope.mainInvBillingObject.TotalNetAmount,
                    "TotalGrossAmount": $scope.mainInvBillingObject.TotalNetAmount,
                    "TotalDiscountAmount": $scope.mainInvBillingObject.TotalDiscountAmount,
                    "TotalReceivedAmount": $scope.mainInvBillingObject.TotalReceivedAmount,
                    "TotalBilledCost": $scope.mainInvBillingObject.TotalBilledCost,
                    "TotalBalance": $scope.mainInvBillingObject.TotalBalance,
                    //"TotalBalance": $scope.mainInvBillingObject.TotalNetAmount - $scope.mainInvBillingObject.TotalReceivedAmount - $scope.mainInvBillingObject.TotalWaviedOffAmount,
                    "BillingDetail": $scope.mainInvBillingObject.BillingDetail,
                    "UserName": userLoginDetails.displayName,
                    "DoctorName": $scope.mainInvBillingObject.DoctorFullName ? $scope.mainInvBillingObject.DoctorFullName : appointmentinfo.DoctorFullName,
                    "CostInWords": costinwords,
                    "previousPaidAmount": $scope.mainInvBillingObject.PreviousPaidAmount,
                    "TotalGSTAmount": $scope.mainInvBillingObject.TotalGST,
                    "TotalWaviedOffAmount": $scope.mainInvBillingObject.TotalWaviedOffAmount,
                    "PromoCodeAmount": $scope.mainInvBillingObject.PromoCodeAmount,
                    "Printdate": $filter("date")(new Date(), "dd-MMM-yyyy"),
                    "TotalSubAmount": $scope.mainInvBillingObject.TotalSubAmount,
                    "PatientGSTNo": $scope.mainInvBillingObject.PatientGSTNo || "",
                    //"BillDate": $filter("date")(new Date(), "dd-MMM-yyyy"),
                    "BillDate": $filter("date")(resp.data.BillDate, "dd-MMM-yyyy"),
                    //"AppointmentDate": $filter("date")(appointmentinfo.ConsultationDt, "dd-MMM-yyyy"),
                    "AppointmentDate": $filter("date")(appdate, "dd-MMM-yyyy"),
                    "OrgGSTNO": $scope.TempBillingObject.OrgGSTNO || "",
                    "PayableAdvanceAmount": $scope.mainInvBillingObject.PayableAdvanceAmount,
                    "PaymentType": $scope.PaymentTypeName,
                    "TotalCollectedAmount": $scope.mainInvBillingObject.TotalCollectedAmount,
                    "BillType": "OP",
                    "Payments": $scope.mainInvBillingObject.Payments,

                    "IsDiscountChecked": GSTDiscountObject.IsDiscountChecked,
                    "IsGSTChecked": GSTDiscountObject.IsGSTChecked
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


                var printObj = {
                    "patientinfo": appointmentinfo,
                    "doctorinfo": doctorinfo,
                    "appointmentinfo": appointmentinfo,
                    "BillingObject": billingobject,
                    "PrintedDatenTime": printDatemTime,
                    "date": pDateTime,
                    "displayID": resp.data.PatientDisplayId,
                    "ReceiptName": "INVESTIGATION BILLING RECEIPT",
                    "CancelRemarks": ""
                };








                if ($scope.SubmitPrintType === "A6") {
                    eHnotePrintService.newBillPrintForPartha(printObj);
                } else {
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

            clearAll();

            var data = {
                "message": ""
            };
            //$rootScope.$emit('investigationBillingSuccess', data);



        }
    }
    function onBillingSaveError(err) {
        console.log(err);
        alertify.error("Saving billing failed");
    }


    function clearAll() {

        $scope.mainInvBillingObject = $scope.getmainIvestigationBillingObject();
        $scope.GetAdvicedPatientInvestigations(appointmentinfo.PatientID);
    }






    function saveInvestigations(filteredNewInvestigations, mainitem, sendDocEmail, sendPatientEmail, sendPatientSms, billingTypeId) {


        var InvArray = [];
        angular.forEach(filteredNewInvestigations, function (item) {

            var obj = {
                "PatientInvestigationId": 0,
                "InvSpecialityId": "",
                "InvGroupId": "",
                "OrgInvestigationId": item.OrgInvestigationId,
                "InvestigationId": item.ProcedureID || 0,
                "InvestigationName": item.ProcedureName,
                "AppointmentId": item.AppointmentID,
                "OrganId": item.OrganId,
                "OrganName": item.OrganName,
                "InvestigationNotes": "",
                "Status": "2",
                "DeleteInd": "N",
                "IsTreatmentInvoiced": true
            }
            InvArray.push(obj)
        });

        var params = {
            "UserId": doctorinfo.doctorid,
            //"AppointmentId": $scope.mainAppointmentId,
            "AppointmentDate": $filter("date")(new Date(), "yyyy-MM-dd"),
            "HospitalId": $scope.HospitalID,
            "PatientInvestigations": InvArray
        }


        eHnotePatientDataService.AddUpdatePatientInvestigations(params, onSaveSuccess, onSaveError);

        function onSaveSuccess(data) {


            console.log(JSON.stringify(data));
            if (data.status === 'Success') {


            } else {
                alertify.error("Investigations Adding Failed");
            }

            angular.forEach(mainitem.BillingDetail, function (citem) {


                if (citem.PatientInvestigationId === 0) {
                    angular.forEach(data.rows, function (ditem) {
                        if (citem.OrgInvestigationId === ditem.OrgInvestigationId && citem.OrganId === ditem.OrganId) {
                            citem.PatientInvestigationId = ditem.PatientInvestigationId;
                            citem.ProcedureHistroyId = ditem.PatientInvestigationId;
                        }
                    });
                }
            });

            console.log(JSON.stringify(mainitem));
            mainitem.IsCreditBill = $scope.IsCreditBill;
            mainitem.PatientInsuranceDetailId = $scope.PatientInsuranceDetailId;
            if ($scope.IsCreditBillingType === 'No') {
                mainitem.IsCreditBill = false;
                mainitem.PatientInsuranceDetailId = 0;
            }

            eHnotePatientDataService.AddUpdateBilling(mainitem, doctorinfo.doctorid, appointmentinfo, appointmentinfo.PatientID, sendDocEmail, sendPatientEmail, sendPatientSms, appointmentinfo.DoctorID, $scope.HospitalID, $scope.ParentHospitalID, $scope.Billingpageno, billingTypeId, doctorinfo.doctordata.UserAddress[0].IsSMSInd, doctorinfo.doctordata.UserAddress[0].SMSSenderId, onBillingSaveSuccess, onBillingSaveError);
        }
        function onSaveError(err) {
            console.log(err);

            alertify.error("Investigations Adding Failed");

        }
    }

    $scope.changeOrgan = function (obj) {

        if (obj.OrganId == '1') {
            obj.OrganName = "Right";
        }
        else if (obj.OrganId == '2') {
            obj.OrganName = "Left";
        }
        else if (obj.OrganId == '3') {
            obj.OrganName = "Both";
        }
        else if (obj.OrganId == '4') {
            obj.OrganName = "General";
        }



        if ($scope.selectedBillingModeId === 1 && $scope.selectedOrgInsuranceTpaId === 0) {
            if (obj.InvestigationObj.InvCostArray.length !==0) {
                obj.InvestigationCost = obj.InvestigationObj.InvCostArray[0].GeneralCost;
            }
            //angular.forEach(obj.InvestigationObj.InvCostArray, function (item) {
            //    if (item.OrganId === parseInt(obj.OrganId)) {
            //        obj.InvestigationCost = item.GeneralCost;
            //    }
            //});
        } else {
            if (obj.InvestigationObj.InvMouCostArray.length === 0) {
                obj.InvestigationCost = obj.InvestigationObj.InvMouCostArray[0].GeneralCost;
                //angular.forEach(obj.InvestigationObj.InvMouCostArray, function (item) {
                //    if (item.OrganId === parseInt(obj.OrganId)) {
                //        obj.InvestigationCost = item.GeneralCost;
                //    }
                //});
                alertify.error("Insurance MOU Cost Not Added For this Item or Mou Date Exipred");
            } else {
                angular.forEach(obj.InvestigationObj.InvMouCostArray, function (item) {
                    if (item.OrganId === parseInt(obj.OrganId)) {
                        if (item.OriginalMouCost === 0) {
                            alertify.error("Insurance MOU Cost Not Added For this Item or Mou Date Exipred");
                            angular.forEach(obj.InvestigationObj.InvCostArray, function (item) {
                                if (item.OrganId === parseInt(obj.OrganId)) {
                                    obj.InvestigationCost = item.GeneralCost;
                                }
                            });
                        } else {
                            obj.InvestigationCost = item.OriginalMouCost;
                        }
                    }
                });



            }

        }

    }


    $scope.backtoInvList = function () {
        $location.path("/OP");
        $rootScope.Comingfrom = "investigations";


    }


    $scope.promoCodeObj = {
        "PromoCode": "",
        "PromoCodeId": "",
        "OfferValue": "",
        "OfferValueType": "",
        "OfferAmount": "",
        "PromoCodeTypeId": "",
        "PromoCodeValid": false
    }

    $scope.validatePromoCode = function (mainbillingobj) {
        console.log(mainbillingobj);
        var params = {
            "PatientId": appointmentinfo.PatientID,
            "PromoCode": mainbillingobj.PromoCode,
            "HospitalId": $scope.ParentHospitalID
        }

        $scope.promoCodeObj = {
            "PromoCode": "",
            "PromoCodeId": "",
            "OfferValue": "",
            "OfferValueType": "",
            "OfferAmount": "",
            "PromoCodeTypeId": "",
            "PromoCodeValid": false
        }
        eHnoteSettingsDataService.validatePromoCode(params).then(function (response) {
            console.log(JSON.stringify(response));



            if (response.data.status === 'Success') {

                if (response.data.Result.length > 0) {



                    $scope.promoCodeObj.OfferValue = response.data.Result[0].OfferValue;
                    $scope.promoCodeObj.OfferValueType = response.data.Result[0].OfferValueType;
                    $scope.promoCodeObj.PromoCodeId = response.data.Result[0].PromoCodeId;
                    $scope.promoCodeObj.PromoCodeTypeId = response.data.Result[0].PromoCodeTypeId;


                    if ($scope.promoCodeObj.PromoCodeTypeId === 4) {

                        var filteredConsultationProducts = $filter("filter")($scope.mainInvBillingObject.BillingDetail, function (item) {
                            return item.ProcedureID !== 0 && item.IsIncluded === true && item.ProcedureTypeId === 5;
                        });

                        if (filteredConsultationProducts.length > 0) {


                            var isdiscountAdded = false;
                            var totalItemAmount = 0;
                            angular.forEach($scope.mainInvBillingObject.BillingDetail, function (bitem) {
                                console.log(bitem);
                                if (bitem.ProcedureID !== 0 && bitem.IsIncluded === true && bitem.ProcedureTypeId === 5) {
                                    bitem.DiscountAmount = bitem.DiscountAmount || 0;
                                    bitem.WaviedOffAmount = bitem.WaviedOffAmount || 0;
                                    totalItemAmount += bitem.NetAmount;
                                    if (bitem.DiscountAmount > 0 || bitem.WaviedOffAmount > 0) {
                                        isdiscountAdded = true;
                                    }

                                }
                            });

                            if (isdiscountAdded) {
                                alertify.error("You cannot apply this promocode,as already discount has been Applied");
                                return false;
                            } else {
                                var consultationFee = totalItemAmount;
                                console.log(consultationFee);
                                if ($scope.promoCodeObj.OfferValueType === 'Amount') {
                                    $scope.promoCodeObj.OfferAmount = $scope.promoCodeObj.OfferValue;
                                } else {
                                    $scope.promoCodeObj.OfferAmount = (consultationFee / 100) * $scope.promoCodeObj.OfferValue;
                                }

                                if ($scope.promoCodeObj.OfferAmount >= consultationFee) {
                                    alertify.error("Invalid Promo Code");
                                    $scope.InvalidPromoCode();
                                } else {


                                    console.log($scope.promoCodeObj.OfferAmount);
                                    $scope.mainInvBillingObject.PromoCodeAmount = $scope.promoCodeObj.OfferAmount;
                                    $scope.mainInvBillingObject.PromoCodeId = $scope.promoCodeObj.PromoCodeId;
                                    $scope.mainInvBillingObject.PromoCodeOfferValue = "";
                                    $scope.mainInvBillingObject.PromoCodeOfferType = "";
                                    $scope.mainInvBillingObject.IsPromoCodeApplied = true;
                                    $scope.mainInvBillingObject.IsPromoCodeValid = true;

                                    var totalofferApplicableAmount = $scope.promoCodeObj.OfferAmount;

                                    angular.forEach($scope.mainInvBillingObject.BillingDetail, function (bitem) {
                                        console.log(bitem);
                                        if (bitem.ProcedureID !== 0 && bitem.IsIncluded === true && bitem.ProcedureTypeId === 5) {
                                            bitem.PromoCodeApplied = true;
                                            if (totalofferApplicableAmount > bitem.NetAmount) {
                                                bitem.PromoCodeAmount = bitem.NetAmount;
                                                bitem.NetAmount = totalofferApplicableAmount - bitem.PromoCodeAmount;
                                                totalofferApplicableAmount = totalofferApplicableAmount - bitem.PromoCodeAmount;
                                                bitem.showIncludeTax = false;
                                                bitem.isExclusiveTax = true;
                                                bitem.Cgst = 0;
                                                bitem.Sgst = 0;
                                                bitem.Gst = "";
                                            } else {
                                                bitem.NetAmount = bitem.NetAmount - totalofferApplicableAmount;
                                                bitem.PromoCodeAmount = totalofferApplicableAmount;
                                                totalofferApplicableAmount = 0;
                                                console.log(totalofferApplicableAmount);
                                            }
                                        }
                                    });

                                    angular.forEach($scope.mainInvBillingObject.BillingDetail, function (item, ind) {
                                        $scope.calculatePromoCodeAmount(item, ind);
                                    });
                                    //$scope.calculatePromoCodeAmount($scope.promoCodeObj.OfferAmount, $scope.promoCodeObj.PromoCodeTypeId);
                                    //$scope.SumAmount($scope.mainInvBillingObject);
                                }


                            }


                        } else {
                            alertify.error("Invalid Promo Code");
                            $scope.InvalidPromoCode();
                        }

                    }

                    if ($scope.promoCodeObj.PromoCodeTypeId === 5) {





                        var filteredConsultationProducts = $filter("filter")($scope.mainInvBillingObject.BillingDetail, function (item) {
                            return item.ProcedureID !== 0 && item.IsIncluded === true;
                        });

                        if (filteredConsultationProducts.length > 0) {


                            var isdiscountAdded = false;
                            var totalItemAmount = 0;
                            angular.forEach($scope.mainInvBillingObject.BillingDetail, function (bitem) {
                                console.log(bitem);
                                if (bitem.ProcedureID !== 0 && bitem.IsIncluded === true) {
                                    bitem.DiscountAmount = bitem.DiscountAmount || 0;
                                    bitem.WaviedOffAmount = bitem.WaviedOffAmount || 0;
                                    totalItemAmount += bitem.NetAmount;
                                    if (bitem.DiscountAmount > 0 || bitem.WaviedOffAmount > 0) {
                                        isdiscountAdded = true;
                                    }

                                }
                            });

                            if (isdiscountAdded) {
                                alertify.error("You cannot apply this promocode,as already discount has been Applied");
                                return false;
                            } else {
                                var consultationFee = totalItemAmount;
                                console.log(consultationFee);
                                if ($scope.promoCodeObj.OfferValueType === 'Amount') {
                                    $scope.promoCodeObj.OfferAmount = $scope.promoCodeObj.OfferValue;
                                } else {
                                    $scope.promoCodeObj.OfferAmount = (consultationFee / 100) * $scope.promoCodeObj.OfferValue;
                                }

                                if ($scope.promoCodeObj.OfferAmount >= consultationFee) {
                                    alertify.error("Invalid Promo Code");
                                    $scope.InvalidPromoCode();
                                } else {


                                    console.log($scope.promoCodeObj.OfferAmount);
                                    $scope.mainInvBillingObject.PromoCodeAmount = $scope.promoCodeObj.OfferAmount;
                                    $scope.mainInvBillingObject.PromoCodeId = $scope.promoCodeObj.PromoCodeId;
                                    $scope.mainInvBillingObject.PromoCodeOfferValue = "";
                                    $scope.mainInvBillingObject.PromoCodeOfferType = "";
                                    $scope.mainInvBillingObject.IsPromoCodeApplied = true;
                                    $scope.mainInvBillingObject.IsPromoCodeValid = true;

                                    var totalofferApplicableAmount = $scope.promoCodeObj.OfferAmount;

                                    angular.forEach($scope.mainInvBillingObject.BillingDetail, function (bitem) {

                                        if (bitem.ProcedureID !== 0 && bitem.IsIncluded === true) {
                                            bitem.PromoCodeApplied = true;
                                            if (totalofferApplicableAmount > bitem.NetAmount) {
                                                bitem.PromoCodeAmount = bitem.NetAmount;
                                                bitem.NetAmount = totalofferApplicableAmount - bitem.PromoCodeAmount;
                                                totalofferApplicableAmount = totalofferApplicableAmount - bitem.PromoCodeAmount;
                                                bitem.showIncludeTax = false;
                                                bitem.isExclusiveTax = true;
                                                bitem.Cgst = 0;
                                                bitem.Sgst = 0;
                                                bitem.Gst = "";
                                            } else {
                                                bitem.NetAmount = bitem.NetAmount - totalofferApplicableAmount;
                                                bitem.PromoCodeAmount = totalofferApplicableAmount;
                                                totalofferApplicableAmount = 0;

                                            }
                                        }
                                    });

                                    angular.forEach($scope.mainInvBillingObject.BillingDetail, function (item, ind) {
                                        $scope.calculatePromoCodeAmount(item, ind);
                                    });

                                }


                            }


                        } else {
                            alertify.error("Invalid Promo Code");
                            $scope.InvalidPromoCode();
                        }

                    }






                }

            } else {
                alertify.error(response.data.Message);
                $scope.InvalidPromoCode();
            }


        }, function (data) {

        });
    }

    $scope.InvalidPromoCode = function () {
        $scope.promoCodeObj = {
            "PromoCode": "",
            "PromoCodeId": "",
            "OfferValue": "",
            "OfferValueType": "",
            "OfferAmount": "",
            "PromoCodeTypeId": "",
            "PromoCodeValid": false
        }

        $scope.mainInvBillingObject.PromoCode = "";
        $scope.mainInvBillingObject.PromoCodeId = 0;
        $scope.mainInvBillingObject.PromoCodeAmount = 0;
        $scope.mainInvBillingObject.PromoCodeOfferValue = "";
        $scope.mainInvBillingObject.PromoCodeOfferType = "";
        $scope.mainInvBillingObject.IsPromoCodeApplied = false;
        $scope.mainInvBillingObject.IsPromoCodeValid = false;


        angular.forEach($scope.mainInvBillingObject.BillingDetail, function (bitem) {
            console.log(bitem);
            if (bitem.ProcedureID !== 0 && bitem.IsIncluded === true) {
                bitem.PromoCodeAmount = 0;
                bitem.PromoCodeApplied = false;
            }
        });

        angular.forEach($scope.mainInvBillingObject.BillingDetail, function (item, ind) {
            $scope.calculatePromoCodeAmount(item, ind);
        });
        $scope.SumAmount($scope.mainInvBillingObject);
    }


    $scope.removePromoCode = function () {
        $scope.InvalidPromoCode();
    }


    $scope.calculatePromoCodeAmount = function (subitem, index) {





        subitem.DiscountCost = parseInt(subitem.DiscountCost);
        if (subitem.IsWaved) {
            subitem.Cgst = 0;
            subitem.Sgst = 0;
            subitem.DiscountCost = 0;
            subitem.showIncludeTax = false;
            subitem.Igst = 0;
            subitem.Gst = 0;
        }

        var totalAmount = 0;
        var Cgst = parseFloat(subitem.Cgst) || 0;
        var Sgst = parseFloat(subitem.Sgst) || 0;
        var Multiplyfactor = parseFloat(subitem.Multiplyfactor) || 0;
        var ProcedureCost = parseFloat(subitem.ProcedureCost) || 0;
        totalAmount = ProcedureCost * Multiplyfactor;


        var DiscountCost = parseFloat(subitem.DiscountCost) || 0;

        //changes by bindu for waive off calculations 19-02-2020


        if (!$scope.editinvoice) {
            subitem.BilledCost = 0;
        }

        if (subitem.PreviousBill == "N" && subitem.IsIncluded && subitem.ProcedureTypeId != 8) {

            if ($scope.PatientTypeId === 1) {

                if (subitem.DiscountType === "PERCENT") {
                    subitem.DiscountAmount = (DiscountCost / 100) * totalAmount;
                    totalAmount = totalAmount - subitem.DiscountAmount - subitem.PromoCodeAmount;
                    subitem.IsMaxDiscountAllowed = false;
                }
                else if (subitem.DiscountType === "AMOUNT") {

                    if (DiscountCost > totalAmount) {
                        alertify.error("Please enter less than price");
                        subitem.DiscountCost = 0;
                        $scope.mainInvBillingObject.BillingDetail[index].Total = totalAmount;
                        $scope.SumAmount($scope.mainInvBillingObject);
                        $scope.DisablePayment = true;
                        subitem.IsMaxDiscountAllowed = true;
                        return false;
                    } else {
                        totalAmount -= DiscountCost;
                        //$scope.mainInvBillingObject.BillingDetail[index].Total = totalAmount;
                        subitem.DiscountAmount = subitem.DiscountCost;
                        subitem.IsMaxDiscountAllowed = false;
                    }





                }

            }
            else {

                if (subitem.DiscountType === "PERCENT") {
                    subitem.DiscountAmount = (DiscountCost / 100) * totalAmount;
                    totalAmount = totalAmount - subitem.DiscountAmount - subitem.PromoCodeAmount;
                } else {
                    if (DiscountCost > totalAmount) {
                        alertify.error("Please enter less than price");
                        subitem.DiscountCost = 0;
                        $scope.mainInvBillingObject.BillingDetail[index].Total = totalAmount;
                        $scope.SumAmount($scope.mainInvBillingObject);
                        return false;
                    } else {
                        totalAmount -= DiscountCost;
                        //$scope.mainInvBillingObject.BillingDetail[index].Total = totalAmount;
                        subitem.DiscountAmount = subitem.DiscountCost;
                    }
                }

            }


        }





        if (subitem.isExclusiveTax) {
            subitem.Tax = ((Cgst + Sgst) / 100) * totalAmount;
            subitem.Tax = parseFloat(subitem.Tax) || 0;
            $scope.mainInvBillingObject.BillingDetail[index].Total = totalAmount + subitem.Tax;

            $scope.mainInvBillingObject.BillingDetail[index].TotalwithoutTax = totalAmount;

            subitem.GstAmount = subitem.Tax;
            subitem.NetAmount = $scope.mainInvBillingObject.BillingDetail[index].TotalwithoutTax;
        } else {
            subitem.Tax = totalAmount - (totalAmount * (100 / (100 + parseFloat(subitem.Gst))));
            subitem.Tax = parseFloat(subitem.Tax) || 0;
            $scope.mainInvBillingObject.BillingDetail[index].Total = totalAmount;

            $scope.mainInvBillingObject.BillingDetail[index].TotalwithoutTax = totalAmount - subitem.Tax;

            subitem.GstAmount = subitem.Tax;
            subitem.NetAmount = $scope.mainInvBillingObject.BillingDetail[index].TotalwithoutTax;
        }



        if (subitem.IsWaved) {
            $scope.mainInvBillingObject.BillingDetail[index].WaviedOffAmount = $scope.mainInvBillingObject.BillingDetail[index].Total;
        }


        if ($scope.mainInvBillingObject.includeAdvanceAmount) {
            $scope.mainInvBillingObject.PayableAdvanceAmount = 0;
            angular.forEach($scope.mainInvBillingObject.Payments, function (item, index) {
                if (item.PaymentModeId === 18) {
                    $scope.mainInvBillingObject.Payments.splice(index, 1);
                } else {
                    item.Amount = "";
                }
            });
        }


        $scope.SumAmount($scope.mainInvBillingObject);
        $scope.mainInvBillingObject.includeAdvanceAmount = false;
        //Remove Advance Amount Object From Paymnets Array
        if (!$scope.editinvoice) {
            $scope.mainInvBillingObject.Payments = $filter("filter")($scope.mainInvBillingObject.Payments, function (item, index) { return item.PaymentModeId !== 18; }) || [];
        }
        // IsIncludePatientAdvance(false, 1);
        if (!$scope.editinvoice) {
            $scope.mainInvBillingObject.PayableAdvanceAmount = 0;
            $scope.mainInvBillingObject.TotalCollectedAmount = 0;
        }
        $scope.mainInvBillingObject.DueAfterAdvanceAmt = 0;

    };

    $scope.ChangeCreditBillingType = function (val) {
        $scope.IsCreditBillingType = val;
        if (val === 'Yes') {
            $scope.DisablePayment = false;
            $scope.CreditDisablePayment = false;
            $scope.IsCreditBill = true;
        }
        else {
            // $scope.selectedBillingModeId = 1;
            $scope.DisablePayment = true;
            $scope.CreditDisablePayment = true;
           $scope.IsCreditBill = false;
        }
    };
}]);
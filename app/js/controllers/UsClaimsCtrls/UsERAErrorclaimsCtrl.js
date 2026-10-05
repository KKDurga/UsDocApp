
"use strict";
eHnoteWebApp.controller("UsERAErrorclaimsCtrl", ["$scope", "$filter", "alertify", "$q", "eHnoteMasterDataService", "eHnoteInsuranceService", "eHnotePatientDataService", "eHnoteSettingsDataService", "eHnoteUserDataService", "eHnotePrintService", "datapersistanceFactory","$uibModal",
    function ($scope, $filter, alertify, $q, eHnoteMasterDataService, eHnoteInsuranceService, eHnotePatientDataService, eHnoteSettingsDataService, eHnoteUserDataService, eHnotePrintService, datapersistanceFactory, $uibModal) {


        $scope.UserId = eHnoteMasterDataService.getLoginId();

        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.ParenthospitalId = 0;
        $scope.HospitalId = 0;
        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
            $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
        };


        $scope.getERAErrorListObj = function () {
            var Obj = {
                "OrganizationId": $scope.HospitalId,
                "PatientId": 0,
                "BillPaymentTypeId": null,
                "PageSize": 50,
                "PageNumber": 1,
                "ClaimNumber": "",
                "PayorObj": "",
                "PayorId": 0,
                "BillPaymentTypeId ": null,
                "CurrentResponsibilityId": 0,
                "FromDate": '',
                "ToDate": '',
                "PayerClaimNumber": "",
                "TransactionNumber": "",
                "ProcessedId": 0,
            }
            return Obj;
        }
        function getSelectedPatientData() {
            var obj = {
                "SearchText": "",
                "PatientId": 0,
                "SearchTypeId": 2
            }
            return obj;
        };
       
     
        $scope.SearchERAErrorListData = function (pageno) {
            $scope.ERAErrorListObj.PageNumber = pageno || 1;
            var Frezobj = {
                "FromDate": $scope.ERAErrorListObj.FromDate || '',
                "ToDate": $scope.ERAErrorListObj.ToDate || '',
                "PayorObj": $scope.ERAErrorListObj.PayorObj || '',
                "PayerClaimNumber": $scope.ERAErrorListObj.PayerClaimNumber || '',
                "TransactionNumber": $scope.ERAErrorListObj.TransactionNumber || '',
                "ProcessedId": $scope.ERAErrorListObj.ProcessedId || 0,
                "PayorId": $scope.ERAErrorListObj.PayorId || 0,
            };
            eHnoteMasterDataService.addERAUnMatchedClaimList(Frezobj);

            let param = {
                "OrganizationId": $scope.ERAErrorListObj.OrganizationId,
                "PageSize": $scope.ERAErrorListObj.PageSize,
                "PageNumber": $scope.ERAErrorListObj.PageNumber,
                "FromDate": $scope.ERAErrorListObj.FromDate,
                "ToDate": $scope.ERAErrorListObj.ToDate,
                "PatientId": $scope.ERAErrorListObj.PatientId,
                "ClaimNumber": $scope.ERAErrorListObj.ClaimNumber,
                "BillPaymentTypeId": $scope.ERAErrorListObj.BillPaymentTypeId,
                "PayorId": $scope.ERAErrorListObj.PayorId,
                "CurrentResponsibilityId": $scope.ERAErrorListObj.BillPaymentTypeId,
                "PayerClaimNumber": $scope.ERAErrorListObj.PayerClaimNumber,
                "TransactionNumber": $scope.ERAErrorListObj.TransactionNumber,
                "ProcessedId": $scope.ERAErrorListObj.ProcessedId,

            }
            eHnoteInsuranceService.GetEraErrorClaimList(param).then(function (resp) {
                console.log(resp);

                if (resp.data.status === "Success") {
                    if (resp.data.rows.length > 0) {
                        $scope.ERAErrorPatientList = resp.data.rows || [];
                        $scope.ERAErrorPatientListCount = resp.data.Count || 0;
                    } else {
                        $scope.ERAErrorPatientList = [];
                        $scope.ERAErrorPatientListCount =0;
                    }
                }

            }, function (error) {
                console.log(error);
            });
        }

        $scope.ProcessedArray = [
            {ProcessedId:1, ProcessedName:'Primary Insurance'},
            {ProcessedId:2, ProcessedName:'Secondary Insurance'},
        ]

        $scope.ChangePayorName = function (item) {
            $scope.ERAErrorListObj.PayorId = item.PayorId;
            $scope.ERAErrorListObj.PayerName = item.PayorName;
        }

        $scope.init = function () {
            $scope.PatientSearchdata = getSelectedPatientData();
            $scope.ERAErrorListObj = $scope.getERAErrorListObj();

            $scope.selectedERA_UnmatchedList = eHnoteMasterDataService.getERAUnMatchedClaimList();
            if ($scope.selectedERA_UnmatchedList != '') {
                $scope.ERAErrorListObj.FromDate = $scope.selectedERA_UnmatchedList.FromDate || null;
                $scope.ERAErrorListObj.ToDate = $scope.selectedERA_UnmatchedList.ToDate || null;
                $scope.ERAErrorListObj.PayorObj = $scope.selectedERA_UnmatchedList.PayorObj || '';
                $scope.ERAErrorListObj.PayerClaimNumber = $scope.selectedERA_UnmatchedList.PayerClaimNumber || '';
                $scope.ERAErrorListObj.TransactionNumber = $scope.selectedERA_UnmatchedList.TransactionNumber || '';
                $scope.ERAErrorListObj.ProcessedId = $scope.selectedERA_UnmatchedList.ProcessedId || 0;
                $scope.ERAErrorListObj.PayorId = $scope.selectedERA_UnmatchedList.PayorId || 0;
            } else {
                $scope.ERAErrorListObj = {
                    FromDate: moment().format("MM-DD-YYYY"),
                    ToDate: moment().format("MM-DD-YYYY"),
                    PayorObj: '',
                    PayerClaimNumber: '',
                    TransactionNumber: '',
                    ProcessedId: 0,
                }

            }
            $scope.SearchERAErrorListData(1);
            $scope.ERAErrorPatientList = [];
            $scope.ERAErrorPatientListCount = 0;

            $q.all([

                eHnoteSettingsDataService.GetAllMasterClaimsData($scope.HospitalId),   
            ]).then(function (resp) {

                if (resp[0].data.status == "Success") {
                    resp[0].data.rows = resp[0].data.rows || [];
                    if (resp[0].data.BillPaymentByModes.length > 0) {
                        $scope.ClaimDataList = angular.copy(resp[0].data.BillPaymentByModes);
                       
                    }             
                }


            }, function (err) {
                console.log(err);
                alertify.error("Getting Data Failed");
            });
        }
        $scope.init();


        $scope.RefreshERAListData = function () {

            $scope.PatientSearchdata = getSelectedPatientData();
            $scope.ERAErrorListObj = $scope.getERAErrorListObj();
            $scope.SearchERAErrorListData(1);
        }

        $scope.changeSearchType = function (id) {
            $scope.PatientSearchdata = getSelectedPatientData();
            $scope.PatientSearchdata.SearchTypeId = id;
            $scope.ERAErrorListObj.PatientId = 0;
            $scope.AllPatientList = [];
            $scope.ERAErrorListObj.ClaimNumber = '';
            $scope.ShowPatientListDrop = false;
            $scope.clearPatientSearchData();
        }


        $scope.SelectedPatient = function (patietnitem) {
            $scope.PatientSearchdata.PatientId = patietnitem.PatientID;
            $scope.ERAErrorListObj.PatientId = patietnitem.PatientID;
            $scope.PatientSearchdata.SearchText = patietnitem.FullName;

            $scope.AllPatientList = [];            
            $scope.ShowPatientListDrop = false;

            $scope.SearchERAErrorListData();
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

        $scope.GetOrganizationNewPayorAllList = function (val) {
            val = val || '';
            if (val == "") {
                $scope.ERAErrorListObj.PayorId = 0;
                $scope.ERAErrorListObj.PayerName = '';
                return false;
            }
            var param = {
                "SearchText": val || "",
                "Status": "Active",
                "PageSize": 10,
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
                        return resp.data.rows.map(function (item) {
                            return item;
                        });
                    }
                }
            }, function (error) {
                console.log(error);
            });
        };



        $scope.navtoClaimSummaryPopup = function (item) {

            item = item || '';
            let AppointmentId = null;
            let PatientId = null;
            if (item != '') {
                AppointmentId = item.AppointmentId;
                PatientId = item.PatientId;
            }
            item.PatientClaimId = item.PatientClaimId || null;
            if (item.PatientClaimId==null) {
                alertify.error("PatientClaimId Not matched");
                return false;
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
                "PatientClaimId": item.PatientClaimId,
                "SuperBillArray": [],
            };
            $scope.mainBillerDataObj.Tabid = 2;
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

            $scope.mInstanceAdd.result.then(function (response) {
                response = response || "";
                console.log(response);

            }, function () { });
        }

        $scope.ClaimDashBoadHCFAPrint = function (item, type) {

            item.PatientClaimId = item.PatientClaimId || 0;

            eHnoteInsuranceService.GetParticularClaimDetailsById(item.PatientClaimId).then(function (resp) {
                console.log(JSON.stringify(resp));

                if (resp.data.status == "Success") {

                    $scope.HCFADetailsInfo = eHnoteCacheStorageService.GetHCFAStorageStructure();

                    $scope.HCFADetailsInfo.PatientDetails.fullname = resp.data.Patient[0].FirstName + " " + resp.data.Patient[0].MiddleName + " " + resp.data.Patient[0].LastName + " " + resp.data.Patient[0].SecondLastName;
                    $scope.HCFADetailsInfo.PatientDetails.DOB = resp.data.DOB || "";

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
                    if (resp.data.Patient.length > 0) {

                        var patientresp = resp.data.Patient[0];

                        $scope.HCFADetailsInfo.PatientDetails.CityName = patientresp.PermanentAddress.CityName || "";
                        $scope.HCFADetailsInfo.PatientDetails.StateName = patientresp.PermanentAddress.StateName || "";
                        $scope.HCFADetailsInfo.PatientDetails.ZipCode = patientresp.PermanentAddress.ZipCode || "";
                        $scope.HCFADetailsInfo.PatientDetails.Address1 = patientresp.PermanentAddress.AddressLine1 || "";
                        $scope.HCFADetailsInfo.PatientDetails.Address2 = patientresp.PermanentAddress.AddressLine2 || "";

                        $scope.HCFADetailsInfo.InsuranceDetails.Address = $scope.HCFADetailsInfo.PatientDetails.Address1 + " " + $scope.HCFADetailsInfo.PatientDetails.Address2;
                        $scope.HCFADetailsInfo.InsuranceDetails.CityName = patientresp.PermanentAddress.CityName || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.StateName = patientresp.PermanentAddress.StateName || "";
                        $scope.HCFADetailsInfo.InsuranceDetails.ZipCode = patientresp.PermanentAddress.ZipCode || "";
                    }

                    $scope.HCFADetailsInfo.PatientDetails.CountryCode = resp.data.CountryCode || "";
                    $scope.HCFADetailsInfo.FeedralTaxIDNo = resp.data.PatientSSN || 0;
                    if ($scope.HCFADetailsInfo.FeedralTaxIDNo != 0) {
                        $scope.HCFADetailsInfo.SSN = "yes";
                    }

                    var currentdate = $filter('date')(new Date(), 'MM-dd-yyyy');
                    $scope.HCFADetailsInfo.datesPatientUnabletoWorkincurrentoccupation.FormDate = $filter('date')(resp.data.DOSfrom, 'MM-dd-yyyy') || currentdate;
                    $scope.HCFADetailsInfo.datesPatientUnabletoWorkincurrentoccupation.ToDate = $filter('date')(resp.data.DOSto, 'MM-dd-yyyy') || currentdate;
                    $scope.HCFADetailsInfo.hospitalizationDatesRelatedToCurrentServices.FormDate = $filter('date')(resp.data.DOSfrom, 'MM-dd-yyyy') || currentdate;
                    $scope.HCFADetailsInfo.hospitalizationDatesRelatedToCurrentServices.ToDate = $filter('date')(resp.data.DOSto, 'MM-dd-yyyy') || currentdate;


                    $scope.HCFADetailsInfo.HeaderInsurance.PayorName = resp.data.PayorName || "";
                    $scope.HCFADetailsInfo.HeaderInsurance.Address = resp.data.PayorAddress || "";
                    $scope.HCFADetailsInfo.HeaderInsurance.CityName = resp.data.PayorCityName || "";
                    $scope.HCFADetailsInfo.HeaderInsurance.StateName = resp.data.PayorStateName || "";
                    $scope.HCFADetailsInfo.HeaderInsurance.ZipCode = resp.data.PayorZipCode || "";

                    if (resp.data.AppointmentInsuranceDetails.length > 0) {
                        angular.forEach(resp.data.AppointmentInsuranceDetails, function (aitem) {
                            $scope.HCFADetailsInfo.HeaderInsurance.Address1 = aitem.PayorAddress1 || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.Address2 = aitem.PayorAddress2 || "";
                            $scope.HCFADetailsInfo.HeaderInsurance.PayorCode = aitem.PayorCode || "";
                            $scope.HCFADetailsInfo.PatientDetails.DoctorName = aitem.DoctorName || "";
                            $scope.HCFADetailsInfo.PatientDetails.RelationName = aitem.RelationName || "";
                            $scope.HCFADetailsInfo.PatientDetails.RelationShipId = aitem.RelationShipId || "";
                            $scope.HCFADetailsInfo.PatientDetails.AppointmentDate = $filter('date')(aitem.AppointmentDate, 'MM-dd-yyyy') || "";
                            $scope.HCFADetailsInfo.PatientDetails.InsuranceTypeCode = aitem.InsuranceTypeCode || "";
                        });
                    }

                    $scope.HCFADetailsInfo.PatientDetails.DoctorName = $scope.HCFADetailsInfo.PatientDetails.DoctorName || "";
                    if ($scope.HCFADetailsInfo.PatientDetails.DoctorName == "") {
                        $scope.HCFADetailsInfo.PatientDetails.DoctorName = $scope.doctorinfo.doctordata.User[0].FullName;
                    }

                    $scope.HCFADetailsInfo.InsuranceDetails.PolicyId = resp.data.PolicyId || 0;
                    $scope.HCFADetailsInfo.InsuranceDetails.InsurancePlanName = resp.data.PlanName || "";
                    $scope.HCFADetailsInfo.InsuranceDetails.PolicyGroupId = resp.data.GroupId || 0;
                    $scope.HCFADetailsInfo.InsuranceDetails.PolicyGroupname = resp.data.Groupname || 0;

                    $scope.HCFADetailsInfo.PatientDetails.RelationshipToInsured = resp.data.RelationShipId || 0;
                    $scope.HCFADetailsInfo.InsuranceDetails.IsThereAnotherHealthBenefitPlan = "No";

                    $scope.HCFADetailsInfo.InsuranceDetails.InsurancePersonName = resp.data.FirstName + " " + resp.data.Lastname || "";

                    $scope.HCFADetailsInfo.InsuranceDetails.MobileNo = $scope.HCFADetailsInfo.PatientDetails.ContactNo || "";
                    $scope.HCFADetailsInfo.InsuranceDetails.Gender = resp.data.Gender == "Female" ? "F" : "M";
                    $scope.HCFADetailsInfo.InsuranceDetails.DOB = $filter('date')(resp.data.DOB, 'MM-dd-yyyy');
                    $scope.HCFADetailsInfo.InsuranceDetails.TelephoneCode = resp.data.CountryCode || "";

                    $scope.HCFADetailsInfo.OriginalRefNo = resp.data.PatientClaimNo || "";

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
                    if (ProcedureListArray.length > 0) {
                        angular.forEach(ProcedureListArray, function (pitem) {

                            pitem.Modifier1 = pitem.Modifier1 || "";
                            pitem.Modifier2 = pitem.Modifier2 || "";
                            pitem.Modifier3 = pitem.Modifier3 || "";
                            pitem.Modifier4 = pitem.Modifier4 || "";

                            var ModifierString = "" + pitem.Modifier1;
                            if (ModifierString != "" && pitem.Modifier2 != "") {
                                ModifierString = ModifierString + ", " + pitem.Modifier2;
                            } else {
                                ModifierString = ModifierString + pitem.Modifier2;
                            }
                            if (ModifierString != "" && pitem.Modifier3 != "") {
                                ModifierString = ModifierString + ", " + pitem.Modifier3;
                            } else {
                                ModifierString = ModifierString + pitem.Modifier3;
                            }
                            if (ModifierString != "" && pitem.Modifier4 != "") {
                                ModifierString = ModifierString + ", " + pitem.Modifier4;
                            } else {
                                ModifierString = ModifierString + pitem.Modifier4;
                            }
                            pitem.DiagnosisIds = pitem.DiagnosisIds || [];
                            pitem.DiagnosisPointer = GetDiagnosisPointer(pitem.DiagnosisIds);

                            var array = {
                                "ProcedureName": pitem.ServiceName,
                                "EPSDTFamilyPlan1": "  ",
                                "IdQual1": " ",
                                "RenderingProviderId1": " ",
                                "FromDate": $filter('date')(pitem.DOSfrom, 'MM-dd-yyyy') || "",
                                "ToDate": $filter('date')(pitem.DOSto, 'MM-dd-yyyy') || "",
                                "PlaceOfService": pitem.POSCODEECLAIM || "",
                                "EMG": "NO",
                                "CPTorHCPCS": pitem.ServiceCode,
                                "Modifier": ModifierString || "",
                                "DiagnosisPointer": pitem.DiagnosisPointers || "",
                                "Charges": pitem.TotalChargeAmount || 0,
                                "Charges1": "00",
                                "DaysOrUnits": pitem.Multiplyfactor || "",
                                "EPSDTFamilyPlan": "",
                                "IdQual": "",
                                "RenderingProviderId": resp.data.RenderingProviderId || "",
                                "RenderingProviderNPI": resp.data.RenderingProviderNPI || ""
                            };
                            $scope.HCFADetailsInfo.ProcedureList.push(array);
                        });
                    }

                    $scope.HCFADetailsInfo.TotalCharges = resp.data.TotalBalance;
                    $scope.HCFADetailsInfo.TypeOfPayor = resp.data.PayorName || "";
                    $scope.HCFADetailsInfo.FacilityName = resp.data.FacilityName || "";
                    $scope.HCFADetailsInfo.FacilityStateName = resp.data.FacilityStateName || "";
                    $scope.HCFADetailsInfo.FacilityCityName = resp.data.FacilityCityName || "";
                    $scope.HCFADetailsInfo.FacilityZipCode = resp.data.FacilityZipCode || "";
                    $scope.HCFADetailsInfo.FacilityNPI = resp.data.FacilityNPI || "";
                    $scope.HCFADetailsInfo.FacilityAddress1 = resp.data.FacilityAddress1 || "";
                    $scope.HCFADetailsInfo.FacilityAddress2 = resp.data.FacilityAddress2 || "";



                    $scope.HCFADetailsInfo.PostalAddress1 = resp.data.PostalAddress1;
                    $scope.HCFADetailsInfo.PostalAddress2 = resp.data.PostalAddress2;
                    $scope.HCFADetailsInfo.PostalZipCode = resp.data.PostalZipCode || "";
                    $scope.HCFADetailsInfo.PostalCityName = resp.data.PostalCityName || "";
                    $scope.HCFADetailsInfo.PostalStateName = resp.data.PostalStateName || "";
                    $scope.HCFADetailsInfo.BillingProviderSSN = resp.data.BillingProviderSSN;
                    $scope.HCFADetailsInfo.BillingProviderNPI = resp.data.BillingProviderNPI;
                    $scope.HCFADetailsInfo.BillingProviderName = resp.data.BillingProviderName;
                    if (type == 'WithLine') {
                        eHnotePrintService.generateHCFAPrintUS($scope.HCFADetailsInfo);

                    } else {
                        eHnotePrintService.generateWithoutLineHCFAPrintUS($scope.HCFADetailsInfo);

                    }

                } else {
                    alertify.error(resp.data.Message);
                }
            }, function (error) {

            });
        }
        $scope.GetPatientDetailsForUBformDetailsinBiller = function (item) {

            item.PatientClaimId = item.PatientClaimId || 0;

            eHnoteInsuranceService.GetParticularClaimDetailsById(item.PatientClaimId).then(function (resp) {

                if (resp.data.status == "Success") {

                    $scope.UBDetailsInfo = eHnoteCacheStorageService.GetUBStorageStructure();
                    $scope.UBDetailsInfo.Patient = angular.copy(resp.data);
                    $scope.UBDetailsInfo.Patient.FirstName = resp.data.FirstName;
                    $scope.UBDetailsInfo.Patient.LastName = resp.data.Lastname;
                    $scope.UBDetailsInfo.Patient.PatientID = resp.data.PatientId;
                    $scope.UBDetailsInfo.MedicalRecordNumber = resp.data.PatientDisplayId;

                    if (resp.data.Patient.length > 0) {
                        var patientresp = resp.data.Patient[0];
                        $scope.UBDetailsInfo.Patient.PatientID = resp.data.PatientId;
                        $scope.UBDetailsInfo.MedicalRecordNumber = resp.data.PatientDisplayId;
                        $scope.UBDetailsInfo.Patient.Address1 = patientresp.PermanentAddress.AddressLine1 || "";
                        $scope.UBDetailsInfo.Patient.Address2 = patientresp.PermanentAddress.AddressLine2 || "";
                        $scope.UBDetailsInfo.Patient.CityName = patientresp.PermanentAddress.CityName;
                        $scope.UBDetailsInfo.Patient.StateName = patientresp.PermanentAddress.StateName;
                        $scope.UBDetailsInfo.Patient.CountryName = patientresp.PermanentAddress.CountryName;
                        $scope.UBDetailsInfo.Patient.ZipCode = patientresp.PermanentAddress.ZipCode;
                    }

                    $scope.UBDetailsInfo.BillingProvider = resp.data.BillingProviderNPI;
                    $scope.UBDetailsInfo.BillingProviderobj.ProviderName = resp.data.BillingProviderName;
                    $scope.UBDetailsInfo.FederalTaxNumber = resp.data.BillingProviderTaxId;
                    $scope.UBDetailsInfo.BillingProviderobj.Address1 = resp.data.PostalAddress1 || "";
                    $scope.UBDetailsInfo.BillingProviderobj.Address2 = resp.data.PostalAddress2 || "";
                    $scope.UBDetailsInfo.BillingProviderobj.City = resp.data.PostalCityName;
                    $scope.UBDetailsInfo.BillingProviderobj.State = resp.data.PostalStateName;
                    $scope.UBDetailsInfo.BillingProviderobj.ZipCode = resp.data.Postalzipcode;
                    $scope.UBDetailsInfo.CodeFieldObj[0].billingprovidertaxonomy1 = resp.data.BillingProviderTaxonomyId;
                    $scope.UBDetailsInfo.TypeOfBill = "0131";

                    $scope.UBDetailsInfo.ServiceLocationInformation.ProviderName = resp.data.FacilityName || "";
                    $scope.UBDetailsInfo.ServiceLocationInformation.Address1 = resp.data.FacilityAddress1 || "";
                    $scope.UBDetailsInfo.ServiceLocationInformation.Address2 = resp.data.FacilityAddress2 || "";
                    $scope.UBDetailsInfo.ServiceLocationInformation.City = resp.data.FacilityCityName || "";
                    $scope.UBDetailsInfo.ServiceLocationInformation.State = resp.data.FacilityStateName || "";
                    $scope.UBDetailsInfo.ServiceLocationInformation.ZipCode = resp.data.FacilityZipCode || "";

                    angular.forEach($scope.UBDetailsInfo.InsuranceDetails, function (mitem) {
                        if (resp.data.AppointmentInsuranceDetails.length > 0) {
                            angular.forEach(resp.data.AppointmentInsuranceDetails, function (aitem) {
                                if (mitem.IdentifierId === aitem.IdentifierId) {
                                    mitem.AssignmentofBenefits = aitem.AssignBenifits || 'No';
                                    mitem.DocumentControlNumber = aitem.PatientInsuranceControlNumber || "";
                                    mitem.InsuranceGroupNumber = aitem.GroupId || "";
                                    mitem.InsuredsGroupName = aitem.GroupName || "";
                                    mitem.InsuredsName = aitem.PatientName || "";
                                    mitem.InsuredsUniqueIdentifier = aitem.PolicyId || "";
                                    mitem.OrganizationPayorName = aitem.PayorName || "";
                                    mitem.OrganizationPlanId = aitem.PlanId || "";
                                    mitem.OrganizationPlanName = aitem.PlanName || "";
                                    mitem.PriorPayments = resp.data.TotalBalance || "";
                                    mitem.OtherBillingProviderIdentifier = "";
                                    mitem.PatientRelationship = aitem.RelationName || "";
                                    mitem.PayorId = aitem.PayorId;
                                    mitem.PayorName = aitem.PayorName || "";
                                    mitem.PayorAddress1 = aitem.PayorAddress1 || "";
                                    mitem.PayorAddress2 = aitem.PayorAddress2 || "";
                                    mitem.ReleaseInfo = "";
                                    mitem.TreatmentAuthorizationCodes = "";
                                    mitem.EmployerName = "";
                                    mitem.EstimatedAmountDue = aitem.DoctorName;
                                    $scope.UBDetailsInfo.Appointment.AppointmentTime = aitem.AppointmentTime;
                                }
                            })
                        }
                    });

                    $scope.UBDetailsInfo.Appointment.AdmissionDate = resp.data.AppointmentDate;
                    $scope.UBDetailsInfo.Appointment.AppointmentType = resp.data.AdmissionType;
                    $scope.UBDetailsInfo.Appointment.AppointmentSource = resp.data.SourceOfAdmission;
                    $scope.UBDetailsInfo.PatientControlNumber = resp.data.PatientClaimNumber;

                    $scope.UBDetailsInfo.OperatingProviderObj.FirstName = resp.data.RenderingProviderFirstName;
                    $scope.UBDetailsInfo.OperatingProviderObj.LastName = resp.data.RenderingProviderLastName;
                    $scope.UBDetailsInfo.OperatingProviderObj.NPI = resp.data.RenderingProviderNPI;

                    $scope.UBDetailsInfo.AttendingProviderObj.FirstName = resp.data.RenderingProviderFirstName;
                    $scope.UBDetailsInfo.AttendingProviderObj.LastName = resp.data.RenderingProviderLastName;

                    if (resp.data.PatientClaimLineItems.length > 0) {
                        angular.forEach($scope.UBDetailsInfo.RevenueList, function (oitem) {
                            angular.forEach(resp.data.PatientClaimLineItems, function (ditem, index) {
                                if (index === oitem.Sno) {
                                    oitem.Code = ditem.ServiceCode || "";
                                    oitem.Date = $filter("date")(ditem.DOSfrom, "yyyy-MM-dd");
                                    oitem.RevenueCode = ditem.RevenueBillingCode || "";
                                    oitem.RevenueCodeDescription = ditem.ServiceName;
                                    oitem.Rate = ditem.UnitCharge;
                                    oitem.ServiceDate = $filter("date")(ditem.DOSfrom, "yyyy-MM-dd");
                                    oitem.ServiceUnits = ditem.Quantity;
                                    oitem.TotalCharges = ditem.TotalChargeAmount;
                                    index++;
                                }
                            });
                        });
                        $scope.UBDetailsInfo.TotalBalance = resp.data.TotalBalance || 0;
                        $scope.UBDetailsInfo.CreateDate = resp.data.AppointmentDate || null;
                        $scope.UBDetailsInfo.PrincipalProcedure.Code = resp.data.PatientClaimLineItems[0].ServiceCode || "";
                        $scope.UBDetailsInfo.PrincipalProcedure.Date = $filter("date")(resp.data.PatientClaimLineItems[0].DOSfrom, "yyyy-MM-dd");
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


                    $scope.GetUBinfoPrint();

                }

            }, function (error) {

            });
        }






        $scope.GetUBinfoPrint = function () {
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

            $timeout(function () {
                var innerContents = document.getElementById('Ub_print').innerHTML;
                var popupWinindow = window.open('', 'scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                popupWinindow.document.open();
                popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()" class="bodyheightprint">' + innerContents + '</body></html>');
                popupWinindow.document.close();
            }, 1000);

        }


        $scope.openPrintPopup = function (item) {
            item.Type = "ViewUnMatchedClaims";
            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/UsERAClaimsPopup.html",
                "controller": "UsERAClaimsDetailsCtrl",
                //"size": "lg",
                "backdrop": "static",
                "keyboard": false,
                "windowClass": "modal__popup--1 bottom-to-top-modal",
                "resolve": {
                    "Selectobj": function () { return item; },
                },
            });

            $scope.mInstanceAdd.result.then(function (response) {

                console.log(response);
                if (response == 'close') {
                    $scope.SearchERAErrorListData();
                }

            }, function () { });
        };

        $scope.clearPatientSearchData = function () {
            $scope.ShowPatientListDrop = false;
            $scope.PatientSearchdata.SearchText = "";
            $scope.ERAErrorListObj.PatientId = 0;
            $scope.ERAErrorListObj.ClaimNumber = "";
        };
















    }]);
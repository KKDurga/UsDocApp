
    "use strict";
eHnoteWebApp.controller("UsPatientGenerateCtrl", ["$scope", "$rootScope", "$location", "$filter", "alertify", "$q", "$timeout", "eHnoteMasterDataService", "eHnoteInsuranceService", "eHnoteSettingsDataService", "eHnoteUserDataService", "$uibModal", "datapersistanceFactory","eHnotePatientDataService",
    function ($scope, $rootScope, $location, $filter, alertify, $q, $timeout, eHnoteMasterDataService, eHnoteInsuranceService, eHnoteSettingsDataService, eHnoteUserDataService, $uibModal, datapersistanceFactory, eHnotePatientDataService) {

        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;

        $scope.ParenthospitalId = 0;
        $scope.HospitalId = 0;
        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
            $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
        };

        $scope.GetPatientQueueObj = function () {
            var obj = {
                "OrganizationId": $scope.HospitalId,
                "PageSize": 100,
                "PageNumber": 1,
                "FromDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "ToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "PatientId": null,
                "PatientClaimNumber": "",
                "GenerateModeId": 0,
                "ProcessStatusId": 0,
                "HasPatientEmail": 0, //0 all- 1 true(only patients with email) or 2- false(patients without email)
                "PatientBalanceIndicator": 0,
                "PatientBalanceType": "", // > or  < 
                "PatientBalance": 0,
                "IsStatementSent": true,


            }
            return obj;
        }

        function getSelectedPatientData() {
            var obj = {
                "SearchText": "",
                "PatientId": 0,
                "SearchTypeId": 2
            }
            return obj;
        };
        $scope.PatientSearchdata = getSelectedPatientData();

        $scope.GetPatientStatementInfo = function () {
            var Obj = {
                "PatientClaimId": 0,
                "DOSFrom": "",
                "ClaimDate": "",
                "PatientId": "",
                "PatientFirstName": "",
                "PatientLastName": "",
                "PatientMrNo": "",
                "PatientClaimNumber": "",
                "TotalClaimAmount": "",
                "TotalPatientBalance": "",
                "TotalInsuranceBalance": "",
                "TotalBalance": "",
                "TotalInsurancePayment": "",
                "PrimaryInsuranceId": "",
                "PrimaryInsurancePayorName": "",
                "SecondaryInsuranceId": "",
                "SecondaryInsurancePayorName": "",
                "TotalDeductibleAmount": "",
                "TotalCoInsuranceAmount": "",
                "TotalCopayAmount": "",
                "TotalUnAppliedAmount": 0,
                "PatientAddressLine1": '',
                "PatientAddressLine2": '',
                "PatientCityName": '',
                "PatientStateName": '',
                "PatientCountryName": '',
                "PatientPinCode": '',
                "PatientHouseNo": '',
                "Address1": '',
                "Address2": '',
                "ClinicName": '',
                "ContactNo": '',
                "PinCode": '',
                "CityName": '',
                "StateName": '',
                "CountryName": '',
                "TotalPatientPayment": '',
                "TotalPatientAmount": '',
                "TotalPatientPaymentAmount": '',
                "BillingProviderName": '',
                "PostalAddress1": '',
                "PostalAddress2": '',
                "PostalCityName": '',
                "PostalStateName": '',
                "PostalZipCode": '',

            }
            return Obj;
        }

        $scope.PrintPatientInfo = angular.copy($scope.GetPatientStatementInfo());

        $scope.PatientSHAgingObj = {
            "SelectStatusString": "All",
            "PAtientAgingName": "",
            "AllStatusCheck": true
        };

        $scope.init = function () {



            $scope.HospitalAddressArray = [];
            if (doctorinfo.doctordata.UserAddress[0] !== undefined) {
                $scope.HospitalAddressArray = doctorinfo.doctordata.UserAddress[0];
                let obj = {};
                obj.Address1 = $scope.HospitalAddressArray.Address1;
                obj.Address2 = $scope.HospitalAddressArray.Address2;
                obj.ClinicName = $scope.HospitalAddressArray.ClinicName;
                obj.ContactNo = $scope.HospitalAddressArray.ContactNo || "";
                obj.PinCode = $scope.HospitalAddressArray.PinCode;
                obj.CityName = $scope.HospitalAddressArray.CityName;
                obj.StateName = $scope.HospitalAddressArray.StateName;
                obj.CountryName = $scope.HospitalAddressArray.CountryName;
                var object = eHnoteUserDataService.UsMobileFormatChange(obj.ContactNo);
                obj.ContactNo = object.UsFormatMobileNumber;
                obj.BranchAddress = doctorinfo.doctordata.UserAddress[0].Address1 + "," + doctorinfo.doctordata.UserAddress[0].Address2 + "," + doctorinfo.doctordata.UserAddress[0].CityName + "," +
                    doctorinfo.doctordata.UserAddress[0].StateName + "," + doctorinfo.doctordata.UserAddress[0].CountryName + "," + doctorinfo.doctordata.UserAddress[0].PinCode;

            }


            $scope.PatientQueueObj = $scope.GetPatientQueueObj();
            $scope.PatientStatementsQueueList = [];

            $q.all([
                eHnoteSettingsDataService.GetAllMasterClaimsData($scope.HospitalId),
                /*eHnoteInsuranceService.GetPatientgeneratedStatementsList($scope.PatientQueueObj),*/

            ]).then(function (resp) {
                if (resp[0].data.status == "Success") {

                    $scope.MasterPatientStatementProcessStatus = [];
                    $scope.MasterPatientStatementProcessedVia = [];
                    $scope.MasterPatientStatementGeneratedMode = [];
                    $scope.MasterPatientAgingData = [];
                    if (resp[0].data.MasterPatientStatementProcessStatus.length > 0) {
                        $scope.MasterPatientStatementProcessStatus = resp[0].data.MasterPatientStatementProcessStatus || [];
                    }
                    if (resp[0].data.MasterPatientStatementProcessedVia.length > 0) {
                        $scope.MasterPatientStatementProcessedVia = resp[0].data.MasterPatientStatementProcessedVia || [];
                    }

                    if (resp[0].data.MasterPatientStatementGeneratedMode.length > 0) {
                        $scope.MasterPatientStatementGeneratedMode = resp[0].data.MasterPatientStatementGeneratedMode || [];

                    } if (resp[0].data.MasterPatientAgingData.length > 0) {
                        $scope.MasterPatientAgingData = resp[0].data.MasterPatientAgingData || [];

                    }

                }
                //$scope.PatientStatementsQueueList = resp[1].data.rows;
                //$scope.PatientStatementsQueueListCount = resp[1].data.count;

                $scope.selectedPatientStatementhistoryList = eHnoteMasterDataService.getStatementhistoryfreezingList();
                if ($scope.selectedPatientStatementhistoryList != '') {
                    $scope.PatientQueueObj.FromDate = $scope.selectedPatientStatementhistoryList.FromDate || null;
                    $scope.PatientQueueObj.ToDate = $scope.selectedPatientStatementhistoryList.ToDate || null;
                    $scope.PatientQueueObj.ProcessStatusId = $scope.selectedPatientStatementhistoryList.ProcessStatusId || 0;
                    $scope.PatientQueueObj.GenerateModeId = $scope.selectedPatientStatementhistoryList.GenerateModeId || 0;
                    //$scope.PatientQueueObj.PatientBalanceType = $scope.selectedPatientStatementhistoryList.PatientBalanceType || 0;

                    $scope.selectedPatientStatementhistoryList.PatientAgingids = $scope.selectedPatientStatementhistoryList.PatientAgingids || '';
                    $scope.MasterPatientAgingData = $scope.MasterPatientAgingData || [];
                    if ($scope.MasterPatientAgingData.length > 0 && $scope.selectedPatientStatementhistoryList.PatientAgingids != '') {
                        angular.forEach($scope.MasterPatientAgingData, function (Aitem) {
                            Aitem.IsChecked = false;
                        });
                        var selectedAgingids = $scope.selectedPatientStatementhistoryList.PatientAgingids.split(",");

                        $scope.MasterPatientAgingData.forEach(pitem => {
                            pitem.IsChecked = selectedAgingids.includes(pitem.PatientAgingDataId.toString());
                        });

                        var checkedArray = _.where($scope.MasterPatientAgingData, { IsChecked: true });
                        $scope.PatientSHAgingObj.AllStatusCheck = checkedArray.length > 0 && $scope.MasterPatientAgingData.length === checkedArray.length ? true : false;

                        if ($scope.PatientSHAgingObj.AllStatusCheck) {
                            $scope.PatientSHAgingObj.SelectStatusString = 'All';
                        } else {
                            if (checkedArray.length == 0) {
                                $scope.PatientSHAgingObj.SelectStatusString = 'Select';
                            } else {
                                $scope.PatientSHAgingObj.SelectStatusString = 'Selected';
                            }
                        }
                    }
                }
                $scope.ApplyPatientQueue();

            }, function (err) {
                console.log(err);
                alertify.error("Getting Data Failed");
            });


        }
        $scope.init();


        $scope.changeSearchType = function (id) {
            $scope.PatientSearchdata.SearchTypeId = id;
            $scope.PatientQueueObj.PatientId = 0;
            $scope.AllPatientList = [];
            $scope.PatientQueueObj.PatientClaimNumber = '';
            $scope.ShowPatientListDrop = false;
        }


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

        $scope.clearPatientSearchData = function () {
            $scope.ShowPatientListDrop = false;
            $scope.PatientSearchdata.SearchText = "";
            $scope.PatientQueueObj.PatientId = 0;
            $scope.PatientQueueObj.PatientClaimNumber = '';
        };

        $scope.SelectedPatient = function (patietnitem) {
            $scope.PatientSearchdata.PatientId = patietnitem.PatientID;
            $scope.PatientQueueObj.PatientId = patietnitem.PatientID;
            $scope.PatientSearchdata.SearchText = patietnitem.FullName;
            $scope.AllPatientList = [];
            $scope.ApplyPatientQueue();
            $scope.ShowPatientListDrop = false;
        };





        $scope.ClearPatientQueue = function () {
            $scope.PatientQueueObj = $scope.GetPatientQueueObj();
            $scope.PatientSearchdata = getSelectedPatientData();
            if ($scope.MasterPatientAgingData.length > 0) {
                var PatientAgingids = $scope.MasterPatientAgingData
                    /*.filter(pitem => pitem.IsChecked)*/
                    .map(pitem => pitem.PatientAgingDataId)
                    .join(",");
            }
            var Frezobj = {
                "FromDate": $scope.PatientQueueObj.FromDate || null,
                "ToDate": $scope.PatientQueueObj.ToDate || null,
                'ProcessStatusId': $scope.PatientQueueObj.ProcessStatusId || 0,
                'GenerateModeId': $scope.PatientQueueObj.GenerateModeId || 0,
                'PatientAgingids': PatientAgingids || '',
            };
            eHnoteMasterDataService.addStatementhistoryfreezingList(Frezobj);
            $scope.init();
        }
        $scope.ApplyPatientQueue = function (pageno, type) {
            $scope.PatientQueueObj.PageNumber = pageno || 1;
            var type = (type === undefined || type === '') ? 'All' : type;

            if ($scope.MasterPatientAgingData.length > 0) {
                var PatientAgingids = $scope.MasterPatientAgingData
                    .filter(pitem => pitem.IsChecked)
                    .map(pitem => pitem.PatientAgingDataId)
                    .join(",");
            }
            var Frezobj = {
                "FromDate": $scope.PatientQueueObj.FromDate || null,
                "ToDate": $scope.PatientQueueObj.ToDate || null,
                'ProcessStatusId': $scope.PatientQueueObj.ProcessStatusId || 0,
                'GenerateModeId': $scope.PatientQueueObj.GenerateModeId || 0,
                /*'PatientBalanceType': $scope.PatientQueueObj.PatientBalanceType || 0,*/
                'PatientAgingids': PatientAgingids || '',
            };
            eHnoteMasterDataService.addStatementhistoryfreezingList(Frezobj);

            $scope.PatientQueueObj.PageNumber = pageno || 1;
            var param = {
                "OrganizationId": $scope.HospitalId,
                "PageSize": $scope.PatientQueueObj.PageSize,
                "PageNumber": $scope.PatientQueueObj.PageNumber,
                "FromDate": $scope.PatientQueueObj.FromDate,
                "ToDate": $scope.PatientQueueObj.ToDate,
                "PatientId": $scope.PatientQueueObj.PatientId,
                "PatientClaimNumber": $scope.PatientQueueObj.PatientClaimNumber,
                "GenerateModeId": $scope.PatientQueueObj.GenerateModeId,
                "ProcessStatusId": $scope.PatientQueueObj.ProcessStatusId,
                "HasPatientEmail": $scope.PatientQueueObj.HasPatientEmail,
                "PatientBalanceIndicator": $scope.PatientQueueObj.PatientBalanceIndicator,
                "PatientBalanceType": $scope.PatientQueueObj.PatientBalanceType,
                "PatientBalance": $scope.PatientQueueObj.PatientBalance,
                "IsStatementSent": $scope.PatientQueueObj.IsStatementSent,
                'PatientAgingList': PatientAgingids || ''
            }

            eHnoteInsuranceService.GetPatientgeneratedStatementsList(param).then(function (resp) {
                if (resp.data.status == "Success") {
                    $scope.PatientStatementsQueueList = resp.data.rows || [];
                    $scope.PatientStatementsQueueListCount = resp.data.count;

                    angular.forEach($scope.PatientStatementsQueueList, function (item) {
                        item.PatientMobile = item.PatientMobile || "";
                        if (item.PatientMobile != "") {
                            var obj = eHnoteUserDataService.UsMobileFormatChange(item.PatientMobile);
                            item.PatientMobile = obj.UsFormatMobileNumber;
                        }
                    });
                }
            }, function (err) { console.log(err); });


        }

        $scope.UpdateGeneratedStatement = function (item) {
            $scope.PatientStatementsListData = [];
            $scope.PatientStatementsListData.push(item);

            $scope.HospitalAddressArray = [];
            if (doctorinfo.doctordata.UserAddress[0] !== undefined) {
                $scope.HospitalAddressArray = doctorinfo.doctordata.UserAddress[0];
                $scope.BranchAddress = '';
                $scope.BranchEmail = '';
                $scope.BranchMobileNo = '';
                $scope.ClinicName = '';
                $scope.DoctorName = '';

                $scope.BranchEmail = doctorinfo.doctordata.UserAddress[0].BranchEmail;
                let MobileNo = doctorinfo.doctordata.UserAddress[0].MobileNo;
                if (MobileNo != '') {
                    var obj = eHnoteUserDataService.UsMobileFormatChange(MobileNo);
                    $scope.BranchMobileNo = obj.UsFormatMobileNumber;
                }
                $scope.BranchAddress = doctorinfo.doctordata.UserAddress[0].Address1 + "," + doctorinfo.doctordata.UserAddress[0].Address2 + "," + doctorinfo.doctordata.UserAddress[0].CityName + "," +
                    doctorinfo.doctordata.UserAddress[0].StateName + "," + doctorinfo.doctordata.UserAddress[0].CountryName + "," + doctorinfo.doctordata.UserAddress[0].PinCode;
                $scope.ClinicName = $scope.HospitalAddressArray.ClinicName;

                $scope.DoctorName = doctorinfo.doctordata.User[0].FullName;
            }

            var param = {
                "OrganizationId": $scope.HospitalId,
                "UserId": $scope.UserId,
                "PatientId": item.PatientId,
                "PatientStatementIds": item.PatientStatementId,
                "ProcessStatusId": item.ProcessStatusId||1,
                "ProcessStatus": item.ProcessStatus || "Send",
                "ProcessViaId": item.ProcessViaId,
                "ProcessVia": item.ProcessVia,
                "GeneratedMode": item.GeneratedMode,
                "GeneratedModeId": item.GeneratedModeId,
                "StatementSent": item.StatementSent || true,
                "IsEmailSent": item.IsEmailSent || false,
                "IsStatementPrintedInternal": item.IsStatementPrintedInternal || false,
                "IsStatementPrintedInPerson": item.IsStatementPrintedInPerson || false,
                "ShowInPatientPortal": item.ShowInPatientPortal || false,
                "S3URL": item.S3URL || "",
                "PatientEmail": item.PatientEmail || "",
                "PatientFullName": item.PatientFullName || "",
                "BranchAddress": $scope.BranchAddress || '',
                "BranchEmail": $scope.BranchEmail || '',
                "BranchMobileNo": $scope.BranchMobileNo || '',
                "DoctorName": $scope.DoctorName || "",
                "ClinicName": $scope.ClinicName || "",
                "EmailCommunicationProviderId": doctorinfo.doctordata.UserAddress[0].EmailCommunicationProviderId || 0,
                "EmailCommunicationEnabled": doctorinfo.doctordata.UserAddress[0].EmailCommunicationEnabled || false
            }

            eHnoteInsuranceService.UpdateGeneratedPatientStatementProcessStatus(param).then(function (resp) {
                if (resp.data.status == "Success") {
                    $scope.ApplyPatientQueue();
                    //if (item.ProcessedViaId != 1 || item.ProcessedViaId != 2) {
                    //    $scope.GetMultiplePatientStatementPrint();
                    //}
                    if (item.IsStatementPrintedInternal == true || item.IsStatementPrintedInPerson == true) {
                        $scope.PatientStatementsPrint(item);
                    }
                    if (item.ProcessVia == "Email") {
                        alertify.success("Email Sent Successfully");
                    }
                  
                }
                console.log(resp);
            }, function (err) { console.log(err); });


        }

        $scope.GetMultiplePatientStatementPrint = function () {

            $timeout(function () {
                var innerContents = document.getElementById('MultiplePatientSatement_print').innerHTML;
                var popupWinindow = window.open('', 'scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                popupWinindow.document.open();
                popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()" class="bodyheightprint">' + innerContents + '</body></html>');
                popupWinindow.document.close();
            }, 1000);

        }

        $scope.ChangeProcessStatus = function (Id, item) {
            var obj = $filter("filter")($scope.MasterPatientStatementProcessStatus, { "StatusId": Id }, true)[0];
            item.ProcessStatusId = obj.StatusId;
            item.ProcessStatus = obj.StatusName;
        }
        $scope.ChangeProcessVia = function (Id, item) {
            var obj = $filter("filter")($scope.MasterPatientStatementProcessedVia, { "ProcessedViaId": Id }, true)[0];
            item.ProcessViaId = obj.ProcessedViaId;
            item.ProcessVia = obj.ProcessedVia;
        }

        $scope.PatientAgingToggle = function () {
            var checkedArray = _.where($scope.MasterPatientAgingData, { IsChecked: true });
            $scope.PatientSHAgingObj.AllStatusCheck = checkedArray.length > 0 && $scope.MasterPatientAgingData.length === checkedArray.length ? true : false;

            if ($scope.PatientSHAgingObj.AllStatusCheck) {
                $scope.PatientSHAgingObj.SelectStatusString = 'All';
            } else {
                if (checkedArray.length == 0) {
                    $scope.PatientSHAgingObj.SelectStatusString = 'Select';
                } else {
                    $scope.PatientSHAgingObj.SelectStatusString = 'Selected';
                }
            }
        }

        $scope.CheckStatementHistoryAging = function (val) {

            if (val) {
                angular.forEach($scope.MasterPatientAgingData, function (item) {
                    item.IsChecked = true;
                });
            } else {
                angular.forEach($scope.MasterPatientAgingData, function (item) {
                    item.IsChecked = false;
                });
            }

            $scope.PatientAgingToggle();
        }



        $scope.GenerateStatementSASurl = function (item) {
            eHnoteInsuranceService.GeneratePatientStatementSASurl(item.S3URL).then(function (resp) {
                if (resp) {
                    if (resp.data != '') {
                        item.S3URL = resp.data;
                        $scope.Viewpatientstatementprocessed(item);
                    } else {
                        alertify.error("Patient statement print is not Genereted.");
                    }
                }
            }, function (err) {
                console.log(err);
            });

        }



        $scope.Viewpatientstatementprocessed = function (item) {
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "ViewPatientstatementPopup.html",
                "backdrop": "static",
                "keyboard": false,
                //"size": "lg",
                "windowClass": "modal__ninety--",
                "resolve": {

                    "obj": function () { return item; },
                    "HospitalId": function () { return $scope.HospitalId; },

                },
                "controller": function ($scope, $uibModalInstance, eHnoteMasterDataService, datapersistanceFactory, HospitalId, obj, $sce) {

                    $scope.HospitalId = HospitalId;
                    obj = obj || null;
                    $scope.GenerateStatementObj = obj || '';
                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };

                    $scope.getTrustedUrl = function (url, openInDocsViewer) {
                        var extension = url.split('?')[0].split('.').pop().toLowerCase();
                        if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(extension)) {
                            return $sce.trustAsResourceUrl(url); // use <img> instead of iframe
                        }
                        return $sce.trustAsResourceUrl(
                            openInDocsViewer ? 'https://docs.google.com/gview?embedded=true&url=' + encodeURIComponent(url) : url
                        );
                    };

                    $scope.getTrustedUrl(obj.S3URL);

                    $scope.GetStatementGenerateObj = function () {
                        var Obj = {
                            "IsCheckedPortal": false,
                            "ProcessViaId": 3,
                            "ProcessVia": "In person/rep",
                        }
                        return Obj;
                    }
                    $scope.EditpatientstatementObj = angular.copy($scope.GetStatementGenerateObj());


                    if (obj.ShowInPatientPortal == true) {
                        $scope.EditpatientstatementObj.IsCheckedPortal = obj.ShowInPatientPortal;
                    }

                    $scope.SavePatientGenerateStatement = function (item, id) {

                        if (id == 1) {
                            if (obj.PatientEmail == null || obj.PatientEmail == '') {
                                alertify.error("The patient does not have an email address.");
                                return false;
                            }
                        }

                        item = item || '';
                        id = id || '';
                        obj = obj || '';
                        if (id == 1) {
                            obj.ProcessViaId = 1;
                            obj.ProcessVia = 'Email';
                            obj.IsEmailSent = true;
                            obj.IsStatementPrintedInPerson = false;
                            obj.IsStatementPrintedInternal = false;
                        } else if (id == 2) {
                            obj.ProcessViaId = item.ProcessViaId;
                            if (obj.ProcessViaId == 3) {
                                obj.ProcessVia = "In person/rep";
                                obj.IsStatementPrintedInPerson = true;
                                obj.IsEmailSent = false;
                                obj.IsStatementPrintedInternal = false;
                            } else {
                                obj.ProcessVia = "Internal";
                                obj.IsStatementPrintedInternal = true;
                                obj.IsEmailSent = false;
                                obj.IsStatementPrintedInPerson = false;
                            }

                           
                        } else {
                            obj.ProcessViaId = 2;
                            obj.ProcessVia = 'Portal';
                            obj.ShowInPatientPortal = true;
                            obj.IsEmailSent = false;
                            obj.IsStatementPrintedInPerson = false;
                            obj.IsStatementPrintedInternal = false;
                        }
                        
                        $uibModalInstance.close(obj);
                    }


                }
            });
            mInstanceAdd.result.then(function (resp) {
                console.log(resp);
                $scope.UpdateGeneratedStatement(resp);
            }, function (cancel) {
            });
        }

        $scope.PatientStatementsPrint = function (item) {
            $scope.s3url = item.S3URL;
            if ($scope.s3url == '' || $scope.s3url == null) return;
            var printWindow = window.open($scope.s3url, '_blank');

            if (printWindow) {
                printWindow.onload = function () {
                    setTimeout(function () {
                        printWindow.focus();
                        printWindow.print();
                    }, 1000);
                };
            } else {
                alert('Please allow popups for this site to print the document.');
            }
        };

        $scope.navtoOpenProfilePopup = function (item, id) {


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
                /*"ActionType": "AddClaim",*/
                "SubActionType": "Verify",
                "ScreenType": "Popup",
                "SuperBillId": null,
                "PatientClaimId": 0,
                "SuperBillArray": [],
            };

            datapersistanceFactory.set("IsComingFromClaim", $scope.claimScreenParentObj);


            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/UsClaims/ClaimPatientProfile.html",
                "size": "lg",
                "keyboard": false,
                "controller": "UsClaimPatientProfileCtrl",
                "windowClass": "offcanves-right",
                "resolve": {
                    "AllHospitalData": function () { return $scope.mainBillerDataObj; },
                    "PatientInsuranceListData": function () { return ''; },
                    "id": function () { return id; },
                    "IshideIndicator": true,
                }

            });

            $scope.mInstanceAdd.result.then(function (resp) {
                $scope.ApplyPatientQueue();

            }, function () { });
        }

        $scope.PatientStatementAlert = function (item) {

            let obj = {
                "PatientId": item.PatientId,
                "PatientFullName": item.PatientFullName,
                "PatientDisplayID": item.PatientMrNo,
                "StatusId": 2,
                "MasterPriority": $scope.MasterPriority,
                "MasterAlertTypes": $scope.MasterAlertTypes,
                "MasterAlertTag": $scope.MasterAlertTag,
                "MasterAlertNoteType": $scope.MasterAlertNoteType,
            }

            let mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/UsClaims/AddUpdatePatientAlerts.html",
                "controller": "USPatientAlertsCtrl",
                "size": "lg",
                "backdrop": "static",
                "keyboard": false,
                "windowClass": "modal__eighty--",
                "resolve": {
                    "PatientAlertsobj": function () { return obj; },
                },
            });

            mInstanceAdd.result.then(
                function () {

                },
                function () {

                });
        };

    }]);
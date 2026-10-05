"use strict";
eHnoteWebApp.controller("UsERAListCtrl", ["$scope", "$rootScope", "$filter", "alertify", "$uibModal", "datapersistanceFactory", "$q", "$timeout", "eHnoteMasterDataService", "eHnoteInsuranceService","eHnoteSettingsDataService",
    function ($scope, $rootScope, $filter, alertify, $uibModal, datapersistanceFactory, $q, $timeout, eHnoteMasterDataService, eHnoteInsuranceService, eHnoteSettingsDataService) {

        $scope.UserId = eHnoteMasterDataService.getLoginId();
        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.ParenthospitalId = 0;
        $scope.HospitalId = 0;
        $scope.BranchNPI = "";
        $scope.checked = false;
        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
            $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
            $scope.BranchNPI = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.Preference.BranchNPI;
        };

        $scope.ClaimMatchStatusArray = [
            { EraMatchingStatusId: 0, EraMatchingStatusName: 'All' },
            { EraMatchingStatusId: 1, EraMatchingStatusName: 'Complete matching' },
            { EraMatchingStatusId: 2, EraMatchingStatusName: 'Partial matching' },
            { EraMatchingStatusId: 3, EraMatchingStatusName: 'No matching' },
        ];

        $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();

        console.log($scope.mainBillerDataObj);
        $scope.mainBillerDataObj = $scope.mainBillerDataObj || null;
        if ($scope.mainBillerDataObj != null) {
            $scope.ClaimProviderList = [];
            $scope.ClaimProviderList = $scope.mainBillerDataObj.BillingProviderList || [];
        }

        $scope.ERAPatientList = [];
        $scope.ERAListSubTab = 1;

        $scope.eraCheckedCount = function () {
            $scope.checkedEraClaimCount = $scope.ERAPatientList.filter(function (item) {
                return item.IsChecked;
            }).length;
        }

       $scope.getERAListObj = function () {
           var Obj = {
               "OrganizationId": $scope.HospitalId,
               "PageSize": 50,
               "PageNumber": 1,
               //"PostingFrom": $filter('date')(new Date(), "MM-dd-yyyy"),
               //"PostingTo": $filter('date')(new Date(), "MM-dd-yyyy"),
               //"PaymentFrom": $filter('date')(new Date(), "MM-dd-yyyy"),
               //"PaymentTo": $filter('date')(new Date(), "MM-dd-yyyy"),
               "PostingFrom": "",
               "PostingTo": "",
               "PaymentFrom": "",
               "PaymentTo": "",
               "EraFileName": "",
               "PayorId": "",
               "PayerName": "",
               "TransactionNumber": "",
               "PayerClaimNumber": "",
               "PatientClaimNumber": "",
               "PatientName": "",
               "EraStatusId": "",
               "EraMatchingStatusId": 0,
               "Count": 0,
               "AllCount": 0,
               "ApprovedCount": 0,
               "CompletedCount": 0,
               "ErrorCount": 0,
               "ExternalSystemCount": 0,
               "ParsedCount": 0,
               "PaymentAppliedCount": 0,
               "PendingCount": 0,
               "ReceivedCount": 0,
               "UploadedCount": 0,
               "SortBy": "Desc",
               "SortType": 2,
               "BillingProviderName": "",
               "BillingProviderNPI": "",
               "TotalPaidAmount": null,
               "DeleteInd": "N",
           }
           return Obj;
        }

        $scope.EdtERAListObj = $scope.getERAListObj();

        $scope.GetOrganizationNewPayorAllList = function (val) {
            val = val || '';
            if (val == "") {
                $scope.EdtERAListObj.PayorId = 0;
                $scope.EdtERAListObj.PayerName = '';
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
      

        $scope.ChangePayorName = function (item) {
            $scope.EdtERAListObj.PayorId = item.PayorId||null;
            $scope.EdtERAListObj.PayerName = item.PayorName;
        }

        $scope.SearchERAListCount = function () {

            var param = {
                "OrganizationId": $scope.HospitalId,
                "PageSize": $scope.EdtERAListObj.PageSize,
                "PaymentFrom": $scope.EdtERAListObj.PaymentFrom,
                "PaymentTo": $scope.EdtERAListObj.PaymentTo,
                "PostingFrom": $scope.EdtERAListObj.PostingFrom,
                "PostingTo": $scope.EdtERAListObj.PostingTo,
                "EraFileName": $scope.EdtERAListObj.EraFileName,
                "PayorId": $scope.EdtERAListObj.PayorId || "",
                "PayerName": $scope.EdtERAListObj.PayerName,
                "TransactionNumber": $scope.EdtERAListObj.TransactionNumber,
                "PayerClaimNumber": $scope.EdtERAListObj.PayerClaimNumber,
                "PatientClaimNumber": $scope.EdtERAListObj.PatientClaimNumber,
                "PatientName": $scope.EdtERAListObj.PatientName,
                "BatchNumber": $scope.EdtERAListObj.BatchNumber,
                "EraMatchingStatusId": $scope.EdtERAListObj.EraMatchingStatusId,
                "SortType": $scope.EdtERAListObj.SortType,
                "SortBy": $scope.EdtERAListObj.SortBy
            }
            eHnoteInsuranceService.GetAllParsedERAListCount(param).then(function (resp) {
                console.log(resp);
                if (resp.data.status === "Success") {
                    if (resp.data.rows.length > 0) {
                        let countobj = resp.data.rows[0];
                        $scope.EdtERAListObj.AllCount = countobj.AllCount || 0;
                        $scope.EdtERAListObj.ApprovedCount = countobj.Approved || 0;
                        $scope.EdtERAListObj.CompletedCount = countobj.Completed || 0;
                        $scope.EdtERAListObj.ErrorCount = countobj.Error || 0;
                        $scope.EdtERAListObj.ExternalSystemCount = countobj.ExternalSystem || 0;
                        $scope.EdtERAListObj.ParsedCount = countobj.Parsed || 0;
                        $scope.EdtERAListObj.PaymentAppliedCount = countobj.PaymentApplied || 0;
                        $scope.EdtERAListObj.PendingCount = countobj.Pending || 0;
                        $scope.EdtERAListObj.ReceivedCount = countobj.Received || 0;
                        $scope.EdtERAListObj.UploadedCount = countobj.Uploaded || 0;
                    }
                }
            }, function (error) {
                console.log(error);
            });
        }


        $scope.SearchERAListData = function (pageno, type) {
            $scope.EdtERAListObj.PageNumber = pageno || 1;
            var type = (type === undefined || type === '') ? 'All' : type;

            var Frezobj = {
                "PaymentFromDate": $scope.EdtERAListObj.PaymentFrom || '',
                "PaymentToDate": $scope.EdtERAListObj.PaymentTo || '',
                "PostingFrom": $scope.EdtERAListObj.PostingFrom || '',
                "PostingTo": $scope.EdtERAListObj.PostingTo || '',
                "PayorObj": $scope.EdtERAListObj.PayorObj || '',
                "EraStatusId": $scope.EdtERAListObj.EraStatusId || 0,
                "EraMatchingStatusId": $scope.EdtERAListObj.EraMatchingStatusId || 0,
                "TransactionNumber": $scope.EdtERAListObj.TransactionNumber || '',
                "PayerClaimNumber": $scope.EdtERAListObj.PayerClaimNumber || '',
                "PatientClaimNumber": $scope.EdtERAListObj.PatientClaimNumber || '',
                "PatientName": $scope.EdtERAListObj.PatientName || '',
                "PayerName": $scope.EdtERAListObj.PayerName || '',
            };
            eHnoteMasterDataService.addERAFilterList(Frezobj);

            
            var param = {
                "OrganizationId": $scope.HospitalId,
                "PageSize": $scope.EdtERAListObj.PageSize,
                "PageNumber": $scope.EdtERAListObj.PageNumber,
                "PaymentFrom": $scope.EdtERAListObj.PaymentFrom,
                "PaymentTo": $scope.EdtERAListObj.PaymentTo,
                "PostingFrom": $scope.EdtERAListObj.PostingFrom,
                "PostingTo": $scope.EdtERAListObj.PostingTo,
                "EraFileName": $scope.EdtERAListObj.EraFileName,
                "PayorId": $scope.EdtERAListObj.PayorId || "",
                "PayerName": $scope.EdtERAListObj.PayerName,
                "TransactionNumber": $scope.EdtERAListObj.TransactionNumber,
                "PayerClaimNumber": $scope.EdtERAListObj.PayerClaimNumber,
                "PatientClaimNumber": $scope.EdtERAListObj.PatientClaimNumber,
                "PatientName": $scope.EdtERAListObj.PatientName,
                "BatchNumber": $scope.EdtERAListObj.BatchNumber,
                "EraStatusId": $scope.EdtERAListObj.EraStatusId || "",
                "EraMatchingStatusId": $scope.EdtERAListObj.EraMatchingStatusId,
                "SortType": $scope.EdtERAListObj.SortType,
                "SortBy": $scope.EdtERAListObj.SortBy,
                "BillingProviderName": $scope.EdtERAListObj.BillingProviderName,
                "BillingProviderNPI": $scope.EdtERAListObj.BillingProviderNPI,
                "TotalPaidAmount": $scope.EdtERAListObj.TotalPaidAmount,
            }
            eHnoteInsuranceService.GetAllParsedERAList(param).then(function (resp) {
                console.log(resp);
                
                if (resp.data.status === "Success") {
                    if (resp.data.rows.length > 0) {
                        $scope.ERAPatientList = resp.data.rows || [];
                        $scope.ERAPatientList.forEach(item => item.openPanelInd = false);
                        $scope.EdtERAListObj.Count = resp.data.count || 0;
                

                    } else {
                        $scope.ERAPatientList = resp.data.rows || [];
                        $scope.EdtERAListObj.Count = resp.data.count || 0;
                    }
                    $scope.SearchERAListCount();
                }
                if ($scope.eraListModal) {
                    $scope.eraListModal.close();
                    $scope.eraListModal = null;
                }
            }, function (error) {
                console.log(error);
            });
            $scope.checked = false;
        }

        $scope.ERAObj = {
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
            "BillIngProviderId": 0,
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
        $scope.ERAClaimsObj = angular.copy($scope.ERAObj);
        $scope.init = function() {


            $q.all([

                eHnoteSettingsDataService.GetAllMasterClaimsData($scope.HospitalId),
            ]).then(function (resp) {

                if (resp[0].data.status == "Success") {
                    $scope.ERAStatusDataArray = [];
                    resp[0].data.rows = resp[0].data.rows || [];
                    if (resp[0].data.MasterERASTatus.length > 0) {
                        $scope.ERAStatusDataArray = angular.copy(resp[0].data.MasterERASTatus);
                    }
                }
            }, function (err) {
                console.log(err);
                alertify.error("Getting Data Failed");
            });

            $scope.selectedERAList = eHnoteMasterDataService.getERAFilterList();
            if ($scope.selectedERAList != '') {
                $scope.EdtERAListObj.PaymentFrom = $scope.selectedERAList.PaymentFromDate || null;
                $scope.EdtERAListObj.PaymentTo = $scope.selectedERAList.PaymentToDate || null;
                $scope.EdtERAListObj.PostingFrom = $scope.selectedERAList.PostingFrom || null;
                $scope.EdtERAListObj.PostingTo = $scope.selectedERAList.PostingTo || null;
                $scope.EdtERAListObj.PayorObj = $scope.selectedERAList.PayorObj || '';
                $scope.EdtERAListObj.EraMatchingStatusId = $scope.selectedERAList.EraMatchingStatusId || 0;
                $scope.EdtERAListObj.TransactionNumber = $scope.selectedERAList.TransactionNumber || '';
                $scope.EdtERAListObj.PayerName = $scope.selectedERAList.PayerName || '';
            } else {
                $scope.EdtERAListObj = $scope.getERAListObj();
            }

            $scope.SearchERAListData();

        }

        $scope.init();
        $scope.openPrintPopup = function (item) {
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
                response = response || "";
                console.log(response);
                if (response === 'close') {
                    $scope.SearchERAListData();
                } else {
                    if (typeof response === 'object' && response !== null) {
                        response.ClaimsList = response.ClaimsList || [];
                        const isAllPaidDenial = response.ClaimsList.length && response.ClaimsList.every(c => c.PaidBy === 4);
                        const isApproved = response.ERAStatusId === 5;
                        $scope.switchClaimBillerSubTab(3, response.EraId, isAllPaidDenial, isApproved);
                    }
                }
              
            }, function () { });
        };
   

        $scope.RefreshERAListData = function () {
            $scope.EdtERAListObj.PaymentFrom = "";
            $scope.EdtERAListObj.PaymentTo = "";
            $scope.EdtERAListObj.PostingFrom = "";
            $scope.EdtERAListObj.PostingTo = "";
            $scope.EdtERAListObj.EraFileName = "";
            $scope.EdtERAListObj.PayorObj = null;
            $scope.EdtERAListObj.PayorId = "";
            $scope.EdtERAListObj.TransactionNumber = '';
            $scope.EdtERAListObj.BatchNumber = '';
            $scope.EdtERAListObj.EraStatusId = null;
            $scope.EdtERAListObj.EraMatchingStatusId = 0;
            $scope.EdtERAListObj.PayerName = "";
            $scope.EdtERAListObj.SortBy = "Desc";
            $scope.EdtERAListObj.SortType = 2;
            $scope.EdtERAListObj.PayerClaimNumber = "";
            $scope.EdtERAListObj.PatientClaimNumber = "";
            $scope.EdtERAListObj.PatientName = "";
            $scope.EdtERAListObj.BillingProviderName = "";
            $scope.EdtERAListObj.BillingProviderNPI = "";
            $scope.EdtERAListObj.TotalPaidAmount = null;
            $scope.activePopover = null;
            $scope.SearchERAListData();
        }


        $scope.DeleteERAListDAta = function (item) {
            item = item || null; 

            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure want to delete this ERA/FTP Details? </h4>", function () {

                var param = {
                    "UserId": $scope.UserId,
                    "EraId": item.EraId,
                    "DeleteInd": "Y"
                }
                eHnoteInsuranceService.UpdateParsedEraFile(param, onsuccess, onerror);
                function onsuccess(resp) {
                    console.log(resp);
                    if (resp.data.status == "Success") {
                        $scope.SearchERAListData();
                        alertify.success("Successfully Deleted!");
                    }
                }
                function onerror(err) {
                    console.log(err);
                }


            }, function () {
                r = "You pressed Cancel!";
            });
        }
       
        $scope.EraIds = "";
        var currentdate = $filter('date')(new Date(), "yyyy-MM-dd");
        $scope.FilteredEras = [];
        $scope.IsCheckAllEras = function (ischeck) {
            
            if (ischeck) {
                angular.forEach($scope.ERAPatientList, function (item) {
                    if (item.ERAStatusId == 6 || item.ERAStatusId == 7 || item.ERAStatusId == 9) {
                        item.IsChecked = false;
                    } else {
                        item.IsChecked = true;
                    }
                   
                })
                $scope.FilteredEras = $scope.ERAPatientList || [];
                //$scope.EraIds = $scope.ERAPatientList.map(function (status) {
                //    return status.EraId;
                //}).join(',');
                $scope.eraCheckedCount();
            }
            else {
                angular.forEach($scope.ERAPatientList, function (item) {
                    item.IsChecked = false;
                })
                $scope.FilteredEras = $scope.ERAPatientList || [];
                $scope.eraCheckedCount();
            }
           
        }

        $scope.checkEraToggle = function (item) {
            var checkedlist = _.where($scope.ERAPatientList, { IsChecked: true });

            $scope.checked = checkedlist.length > 0 && $scope.ERAPatientList.length === checkedlist.length ? true : false;
            if ($scope.checked) {
                $scope.FilteredEras = checkedlist || [];
                //$scope.EraIds = checkedlist.map(function (status) {
                //    return status.EraId;
                //}).join(',');
            }

            if (!$scope.checked && checkedlist.length > 0) {
               
                //$scope.EraIds = checkedlist.map(function (status) {
                //    return status.EraId;
                //}).join(',');
                $scope.FilteredEras = checkedlist || []
            }

        }
        $scope.$watch('ERAPatientList', function (newVal, oldVal) {
            $scope.eraCheckedCount();
        }, true);
        $scope.saveBulkERAEOBApprove = function () {
            var approveEras = _.where($scope.ERAPatientList, { IsChecked: true });
            if (approveEras.length==0) {
                alertify.success("Please Select the Eras");
                return false;
            }
            if ($scope.FilteredEras.length > 0) {
                var bulkApproveEras = _.where($scope.FilteredEras, { IsChecked: true, ERAStatusId:3 })
                $scope.EraIds = bulkApproveEras.map(function (status) {
                    return status.EraId;
                }).join(',');
            }
            var params = {
                "UserId": $scope.UserId,
                "EraId": $scope.EraIds || 0,
                "IsPostPayment": false,
                "IsAllClaims": false,
                "PostingDate": currentdate
            }




            console.log(JSON.stringify(params));

            eHnoteInsuranceService.BulkErasUpadate(params, onSuccess, onError);
            function onSuccess(resp) {
                if (resp.Status === 'Success') {
                    $scope.SearchERAListData();
                    alertify.success("Approved Successfully");
                    /*   $uibModalInstance.dismiss("cancel");*/
                }
                else {
                    $scope.SearchERAListData();
                    alertify.success("Approved Failed");
                }
                console.log(resp);

            }
            function onError(reponse) {
                $scope.SearchERAListData();
                alertify.error("Approved Failed");

            }
        }
        $scope.saveBulkERAEOBApproveandPost = function () {

            var PostEras = _.where($scope.ERAPatientList, { IsChecked: true });
            if (PostEras.length == 0) {
                alertify.success("Please Select the Eras");
                return false;
            }

            if ($scope.FilteredEras.length > 0) {
                var bulkApprovePostEras = _.filter($scope.FilteredEras, function (era) {
                    return era.IsChecked === true && era.ERAStatusId !== 6 && era.ERAStatusId !== 7;
                });
                $scope.EraIds = bulkApprovePostEras.map(function (status) {
                    return status.EraId;
                }).join(',');
            }
            var params = {
                "UserId": $scope.UserId,
                "EraId": $scope.EraIds || 0,
                "IsPostPayment": true,
                "IsAllClaims": true,
                "PostingDate": currentdate,
                "ClaimsList": []
            }




            console.log(JSON.stringify(params));

            eHnoteInsuranceService.BulkErasUpadate(params, onSuccess, onError);
            function onSuccess(resp) {
                console.log(resp);
                if (resp.Status === 'Success') {
                    $scope.SearchERAListData();
                    alertify.success("Posted Successfully");
                    /*  $uibModalInstance.close("save");*/
                }
                else {
                    $scope.SearchERAListData();
                    alertify.success("Posted Failed");
                }


            }
            function onError(reponse) {
                $scope.SearchERAListData();
                alertify.error("Approved Failed");

            }
        }
        $scope.eraListFilterPopover = {
            templateUrl: 'eraListFilterPopover.html',
        };

        $scope.ReconcileApprovedList = function (item) {
            //$scope.$emit('ReconcileClaimInPosting');
            $scope.switchClaimBillerSubTab(3, item.EraId, false, false);
            //$scope.switchClaimBillerSubTab(3, item.EraId, false, false, $scope.ERAClaimsObj.ERAStatusId);

            
        };


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

                    //ERAresp.Claims = ERAresp.Claims || [];
                    //ERAresp.UnMatchedClaims = ERAresp.UnMatchedClaims || [];

                    var MatchedandUnMatchedClaimsList = ERAresp.Claims.concat(ERAresp.UnMatchedClaims);
                    console.log(MatchedandUnMatchedClaimsList);
                    $scope.EOBPrintMainObj.TotalClaimsAmountData = 0;
                    $scope.EOBPrintMainObj.AllTotalPatientRespAmt = 0;
                    $scope.EOBPrintMainObj.AllTotalAdjAmount = 0;
                    angular.forEach(MatchedandUnMatchedClaimsList, function (cERAresp) {
                        $scope.EOBPrintMainObj.TotalClaimsAmountData += cERAresp.ClaimAmount || 0;
                        cERAresp.TotalPatientRespAmount = 0;
                        cERAresp.TotalAdjAmount = 0;
                        cERAresp.TotalOtherAdjustmentAmt = 0;
                        cERAresp.AllAdjustmentAmount = 0;
                        angular.forEach(cERAresp.ClaimLineItems, function (citem) {
                            citem.TotalCOAmount = 0;
                            citem.TotalPRAmount = 0;
                            citem.TotalOAAmt = 0;
                            angular.forEach(citem.LineItemAdjustments, function (aitem) {
                                if (aitem.GroupCode === "CO") {
                                    citem.TotalCOAmount += aitem.AdjustmentAmount || 0;
                                    cERAresp.TotalAdjAmount += aitem.AdjustmentAmount || 0;
                                    $scope.EOBPrintMainObj.AllTotalAdjAmount += aitem.AdjustmentAmount || 0;
                                } else if (aitem.GroupCode === "PR") {
                                    citem.TotalPRAmount += aitem.AdjustmentAmount || 0;
                                    cERAresp.TotalPatientRespAmount += aitem.AdjustmentAmount || 0;
                                    $scope.EOBPrintMainObj.AllTotalPatientRespAmt += aitem.AdjustmentAmount || 0;
                                } else if (aitem.GroupCode === "OA") {
                                    citem.TotalOAAmt += aitem.AdjustmentAmount || 0;
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

                    $scope.EOBPrintMainObj.ClaimPaymentInfo = MatchedandUnMatchedClaimsList || [];
                    $scope.EOBPrintMainObj.ClaimAdjustments = [];
                    $scope.EOBPrintMainObj.ClaimLegends = [];
                    $scope.EOBPrintMainObj.PrintedDatenTime = "";


                    var tadjAmt = 0;

                    var tempadjarray = [], tempadjLegendsarray = [];

                    angular.forEach(ERAresp.Claims, function (gitem) {
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




                    console.log($scope.EOBPrintMainObj);


                    $timeout(function () {
                        var innerContents = document.getElementById('ERAClaimprint').innerHTML;
                        var popupWinindow = window.open('scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                        popupWinindow.document.open();
                        popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()" class="bodyheightprint">' + innerContents + '</body></html>');
                        popupWinindow.document.close();
                    }, 500);



                }
            });






        }
        $scope.closeFilterPopover = function () {
            angular.element(document.querySelector('.popover')).remove();
        };





        $scope.UpdateERAstatusPopup = function (item) {
            var obj = {
                "Selectitem": item,
                "EraId": item.EraId,
                "UserId": $scope.UserId,
                "HospitalId": $scope.HospitalId
            }
            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "UpdateERApopup.html",
                "backdrop": "static",
                "size": "lg",
                "keyboard": false,
                "windowClass": "",
                "resolve": {
                    "Selectobj": function () { return obj; },
                },
                "controller": function ($scope, $uibModalInstance, Selectobj, eHnoteInsuranceService) {

                    $scope.getERAListObj = function () {
                        var Obj = {
                            "OrganizationId": Selectobj.HospitalId,
                            "UserId": Selectobj.UserId,
                            "EraId": Selectobj.EraId||null,
                            "ERAStatus": "External System",
                            "ERAStatusId": 9,
                            "MarkedBy": Selectobj.UserId,
                            "MarkedDate": $filter('date')(new Date(), "MM-dd-yyyy hh:mm:ss a"),
                            "Remarks": "",
                        }
                        return Obj;
                    }

                    $scope.ERAitemObj = $scope.getERAListObj();

                    $scope.close = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                   

                    $scope.UpdateERAstatusByid = function () {
                        let reqObj = {
                            "OrganizationId": $scope.ERAitemObj.OrganizationId,
                            "UserId": $scope.ERAitemObj.UserId,
                            "EraId": $scope.ERAitemObj.EraId || null,
                            "ERAStatus": $scope.ERAitemObj.ERAStatus,
                            "ERAStatusId": $scope.ERAitemObj.ERAStatusId||9,
                            "MarkedBy": $scope.ERAitemObj.MarkedBy,
                            "MarkedDate": $scope.ERAitemObj.MarkedDate,
                            "Remarks": $scope.ERAitemObj.Remarks||"",
                        }
                        eHnoteInsuranceService.UpdateERAStatus(reqObj).then(function (resp) {
                            if (resp.data[0].Status === "Success") {
                                alertify.success("Successfully Updated!");
                                $uibModalInstance.close("close");

                            }
                        }, function (err) {
                            alertify.error("Fetching data failed!");

                        });
                     
                    }
                }
            });

            $scope.mInstanceAdd.result.then(function (response) {

                console.log(response);
                if (response == 'close') {
                    $scope.SearchERAListData();
                }

            }, function () { });
        };

        $scope.ERAstatusPopover = {
            templateUrl: 'ERAstatusPopover.html',
        };
        $scope.ERAstatusPopover1 = {
            templateUrl: 'ERAstatusPopover1.html',
        };
        
        $scope.IsPopupupOpen = false;
        $scope.openPanel = function (item) {
            $scope.ERAPatientList.forEach(sitem => sitem.openPanelInd = false);
            item.openPanelInd = true;
            $scope.ERAClaimsObj = angular.copy($scope.ERAObj);
            $scope.IsPopupupOpen = true;
            $scope.SelectListitem = item;
            //var param = {
            //    "EraId": item.EraId || null
            //}
            item.EraId = item.EraId || null;
            eHnoteInsuranceService.GetPrasedERADetailsById(item.EraId).then(function (resp) {
                resp.data = resp.data || null;
                if (resp.data != null) {
                    var ERAresp = angular.copy(resp.data);

                    $scope.ERAClaimsObj.EraId = ERAresp.EraId || 0;
                    $scope.ERAClaimsObj.OrganizationId = ERAresp.OrganizationId || 0;
                    $scope.ERAClaimsObj.PayorId = 0;
                    $scope.ERAClaimsObj.BillingProviderId = 0;
                    $scope.ERAClaimsObj.EraFileS3URL = ERAresp.EraFileS3URL || "";
                    $scope.ERAClaimsObj.EraFileName = ERAresp.EraFileName || "";
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
                    $scope.ERAClaimsObj.ParseDate = ERAresp.ParseDate || "";

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
                            item.InsurancePolicyNumber = item.PatientIdentifier||"";
                            //if (item.PaidBy == 2) {
                            //    item.PatientInsuranceDetailId = item.SecondaryPatientInsuranceDetailId;
                            //    item.PayorId = item.SecondaryInsurancePayorId;
                            //    item.InsurancePolicyNumber = item.SecondaryInsurancePolicyNumber;
                            //} else {
                            //    item.PatientInsuranceDetailId = item.PrimaryInsuranceDetailId;
                            //    item.PayorId = item.PrimaryInsurancePayorId;
                            //    item.InsurancePolicyNumber = item.PrimaryInsurancePolicyNumber;
                            //}


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


                        $scope.LineItemAdjustmentsList = Object.keys(adjustmentSummary).map(function (key) {
                            return adjustmentSummary[key];
                        });
                    }
                    if (ERAresp.UnMatchedClaims.length > 0) {

                        $scope.ERAClaimsObj.UnMatchedClaimsList = angular.copy(ERAresp.UnMatchedClaims);

                        var PatientInsuranceDetailId = 0;
                        var PatientInsurancePayorId = 0;
                        angular.forEach($scope.ERAClaimsObj.UnMatchedClaimsList, function (item) {


                            item.PaidBy = parseFloat(item.PaidBy) || 0;
                            item.InsurancePolicyNumber = "";
                            item.InsurancePolicyNumber = item.PatientIdentifier || "";
                            //if (item.PaidBy == 2) {
                            //    item.PatientInsuranceDetailId = item.SecondaryPatientInsuranceDetailId;
                            //    item.PayorId = item.SecondaryInsurancePayorId;
                            //    item.InsurancePolicyNumber = item.SecondaryInsurancePolicyNumber;
                            //} else {
                            //    item.PatientInsuranceDetailId = item.PrimaryInsuranceDetailId;
                            //    item.PayorId = item.PrimaryInsurancePayorId;
                            //    item.InsurancePolicyNumber = item.PrimaryInsurancePolicyNumber;
                            //}


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
                    if ($scope.ERAClaimsObj.LegendCodeList.length > 0) {
                        $scope.ERAClaimsObj.LegendCodeList = _.uniq($scope.ERAClaimsObj.LegendCodeList, false, function (p) { return p.Code; });
                    }

                }
            });
        };

        $scope.closePanel = function () {
            $scope.IsPopupupOpen = false;
            $scope.ERAPatientList.forEach(item => item.openPanelInd = false);
        };
        $scope.sampleArray = [
            { isOpen:false},
            { isOpen:false},
            { isOpen:false},
            { isOpen:false},
            { isOpen:false},
            { isOpen:false},
            { isOpen:false},
            { isOpen:false},
            { isOpen:false},
            { isOpen:false},
            { isOpen:false},
            { isOpen:false}
        ]
               
        $scope.openAccordianItem = function (item) {
            item.isOpen = !item.isOpen;
        };

        $scope.saveERAEOBApprove = function () {
            var params = {
                "UserId": $scope.UserId,
                "EraId": $scope.ERAClaimsObj.EraId || 0,
                "IsPostPayment": false,
                "IsAllClaims": false,
                "PostingDate": currentdate
            }


            eHnoteInsuranceService.UpdateERAToBeActive(params, onSuccess, onError);
            function onSuccess(resp) {
                if (resp.Status === 'Success') {
                    alertify.success("Approved Successfully");
                    $scope.ERAClaimsObj.ERAStatusId = 5;
                }
                
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

            eHnoteInsuranceService.UpdateERAToBeActive(params, onSuccess, onError);
            function onSuccess(resp) {
                console.log(resp);
                if (resp.Status === 'Success') {
                    alertify.success("Posted Successfully");
                    $scope.ERAClaimsObj.ERAStatusId = 7;
                    
                }

            }
            function onError(reponse) {
            }
        }

        $scope.PrintPirticularERAItem = function (item) {


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

            var printDate = $filter("date")(new Date(), "MMM-dd-yyyy");
            var printTime = moment(new Date()).format("HH:mm");
            var printDatemTime = printDate + '  ' + printTime;
            $scope.EOBPrintMainObj.PrintedDatenTime = printDatemTime;

            $timeout(function () {
                var innerContents = document.getElementById('ERAClaimprint').innerHTML;
                var popupWinindow = window.open('', 'scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                popupWinindow.document.open();
                popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()" class="bodyheightprint">' + innerContents + '</body></html>');
                popupWinindow.document.close();
            }, 500);
        }

        $scope.setSelectedCitem = function (item) {
            $scope.selectedCitem = item;
        };
        $scope.eraListFilterPopup = function () {
            $scope.eraListModal = $uibModal.open({
                "templateUrl": "EraListfilterpopup.html",
                "backdrop": "static",
                "keyboard": false,
                "scope": $scope,
                "windowClass": "right-to-left-modal offcanves-right modal__width--30",
                "controller": function ($scope, $uibModalInstance) {
                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };

                }
            });
            $scope.eraListModal.result.then(function (resp) {
                $scope.eraListModal = null;
            }, function () { });
        };

        $scope.$on("OpenERAListFilterPopup", function () {
            $scope.eraListFilterPopup();
        });
        $scope.openERAAdjustmentAmmount = {
            templateUrl: 'openERAAdjustmentAmmount.html',
        };



        $scope.dynamicERAPaymentSort = {
            templateUrl: 'dynamicERAPaymentSort.html',
            "scope": $scope
        };

        $scope.ERAPaymentDateSortOrder = function (val) {
            $scope.EdtERAListObj.SortType = val;
            $scope.EdtERAListObj.SortBy = (val === 2) ? 'Desc' : 'Asc';
            $scope.SearchERAListData($scope.EdtERAListObj.PageNumber);
        };


        $scope.downloadEDIFile = function (textToSend) {
            if (!textToSend || !textToSend.EraFileS3URL) {
                alertify.error("Invalid file information.");
                return;
            }

            const fileUrl = textToSend.EraFileS3URL;
            const filename = textToSend.EraFileName || "EDI_File.txt";

            fetch(fileUrl, {
                method: "GET",
                mode: "cors"   // important for S3
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.blob();
                })
                .then(blob => {
                    const blobUrl = window.URL.createObjectURL(blob);

                    const a = document.createElement("a");
                    a.href = blobUrl;
                    a.download = filename;
                    a.style.display = "none";

                    document.body.appendChild(a);
                    a.click();

                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(blobUrl);
                })
                .catch(err => {
                    console.error("Download error:", err);
                    alertify.error("Failed to download EDI file.");
                });
        };

        $scope.downloadERAFromContent = function (eraFileContent) {

            if (!eraFileContent) {
                alertify.error("ERA file content is empty.");
                return;
            }

            // Ensure correct line breaks for EDI
            const content = eraFileContent.replace(/~/g, "~\r\n");

            // Create blob (plain text EDI)
            const blob = new Blob([content], {
                type: "text/plain;charset=utf-8;"
            });

            // Create download link
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement("a");

            a.href = blobUrl;
            a.download = "ERA_835.edi"; // or .835
            a.style.display = "none";

            document.body.appendChild(a);
            a.click();

            document.body.removeChild(a);
            window.URL.revokeObjectURL(blobUrl);
        };

        $scope.ToggleERASubTab = function (id) {
            $scope.EdtERAListObj.EraStatusId = id === 1 ? "" : id === 2 ? "7" : "3,5";
            $scope.ERAListSubTab = id;
            $scope.SearchERAListData();
        };

        $scope.dynamicERAListfilters = {
            templateUrl: 'dynamicERAListfilters.html',
            "scope": $scope
        };

        $scope.filterConfig = {
            payer: { label: 1, placeholder: 'Search Payor', model: 'PayerName', type: 'text' },
            check: { label: 2, placeholder: 'Search Check Number', model: 'TransactionNumber', type: 'text' },
            payment: { label: 3, model: 'PaymentFrom', type: 'date' },
            received: { label: 4, model: 'PostingFrom', type: 'date' },
            provider: { label: 5, placeholder: 'Search Provider', model: 'BillingProviderName', type: 'text' },
            total: { label: 6, placeholder: 'Search Amount', model: 'TotalPaidAmount', type: 'text' }
        };

        $scope.setFilter = function (type) {
            let cfg = $scope.filterConfig[type];
            $scope.filterObj = {
                label: cfg.label,
                placeholder: cfg.placeholder,
                type: cfg.type,
                key: type,
                npiModel: $scope.EdtERAListObj[cfg.npiModel],
                model: $scope.EdtERAListObj[cfg.model]
            };

            $scope.activePopover = ($scope.activePopover === type) ? null : type;

        };


        $scope.activePopover = null;

        $scope.closeFilter = function () {
            $scope.activePopover = null;
        };


        $scope.SearchDynamicFilter = function (label, val) {
            val = val || "";
            if (label == 1) {
                $scope.EdtERAListObj.PayerName = val;
            } else if (label == 2) {
                $scope.EdtERAListObj.TransactionNumber = val;
            } else if (label == 3) {
                $scope.EdtERAListObj.PaymentFrom = val;
                $scope.EdtERAListObj.PaymentTo = val;
            } else if (label == 4) {
                $scope.EdtERAListObj.PostingFrom = val;
                $scope.EdtERAListObj.PostingTo = val;
            } else if (label == 5) {
                $scope.EdtERAListObj.BillingProviderName = val || "";
                $scope.EdtERAListObj.BillingProviderNPI = $scope.filterObj.npiModel || "";
            } else {
                val = val || 0;
                $scope.EdtERAListObj.TotalPaidAmount = parseFloat(val).toFixed(2);
            }
            $scope.SearchERAListData();
            $scope.activePopover = null;
        }


}]);
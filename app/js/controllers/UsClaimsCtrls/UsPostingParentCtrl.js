"use strict";
eHnoteWebApp.controller("UsPostingParentCtrl", ["$scope", "$rootScope", "$filter", "alertify", "$uibModal", "datapersistanceFactory", "$q", "$timeout", "eHnoteMasterDataService", "eHnoteSettingsDataService","eHnotePatientDataService",
    function ($scope, $rootScope, $filter, alertify, $uibModal, datapersistanceFactory, $q, $timeout, eHnoteMasterDataService, eHnoteSettingsDataService, eHnotePatientDataService) {
        $scope.doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.HospitalId = 0;
        $scope.ParentHospitalId = 0;
        if ($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode
            && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID) {
            $scope.HospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            $scope.ParentHospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        }
        $scope.PostingSubTabs = 1;
        $rootScope.showTabs = true;
        $scope.SwitchPostingSubTabs = function (tabchange) {
            $scope.PostingSubTabs = tabchange;
        }
        $scope.serchobj = {
            "ClaimStatusList": "",
            "OrganizationId": $scope.HospitalId,
            "ClaimNumber": "",
        };


        $scope.SearchPatientwithClaimId = function (pageno, type) {
            var type = (type === undefined || type === '') ? 'All' : type;
            var params = {
                "OrganizationId": $scope.serchobj.OrganizationId,
                "OrganizationFacilityId": 0,
                "FromDate": "",
                "ToDate": "",
                "PatientId": 0,
                "SearchText": "",
                "PatientMRNo": "",
                "PatienClaimNumber": $scope.serchobj.ClaimNumber || "",
                "BatchNumber": "",
                "BillingProviderId": 0,
                "RenderingProviderId": 0,
                "TransmissionTypeId": 0,
                "ClaimTypeId": 0,
                "PayorId": 0,
                "ClaimStatusList": $scope.serchobj.ClaimStatusList,
                "PageSize": 100,
                "PageNumber": 1,
                "Type": type,
                "BillPaymentTypeId": 0,
                "CurrentResponsibilityId": 0,
                "DenialId": 0
            };

            eHnotePatientDataService.GetOrganizationClaimsListData(params).then(function (resp) {
                console.log(resp);

                resp.data.rows = resp.data.rows || [];
                if (resp.data.rows.length > 0) {
                        $scope.navtoClaimSummaryPopup(resp.data.rows[0]);
                }
            }, function (err) {

            });
            $scope.serchobj.ClaimNumber = "";
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
                "ActionType": "EditClaim",
                "SubActionType": "Verify",
                "ScreenType": "Popup",
                "SuperBillId": null,
                "SuperBillArray": [],
                "PatientClaimId": item.PatientClaimId,
                "SuperBillId": item.SuperBillId || null,
                "SuperBillArray": item.SuperBillArray || [],
                "SuperBillDiagnosisArray": item.SuperBillDiagnosisArray || []
            };
            $scope.mainBillerDataObj.Tabid = 2;
            $scope.mainBillerDataObj.PatientId = $scope.mainBillerDataObj.PatientId || 0;
            $scope.mainBillerDataObj.PatientId = PatientId || 0;
            datapersistanceFactory.set("IsComingFromClaim", $scope.claimScreenParentObj);

            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/UsClaims/AddUpdateClaimPopup.html",
                "controller": "UsAddUpdateClaimPopupCtrl",
                "backdrop": "static",
                "keyboard": false,
                "windowClass": "modal__ninety--",
                "resolve": {
                    "mainBillerDataObj": function () { return $scope.mainBillerDataObj; },
                }
            });
            $scope.mInstanceAdd.result.then(function (resp) {
                resp = resp || "";

            }, function () { });
        }

        //$scope.GetAllMasterClaimsData = function () {
        //    $scope.MasterClaimStatusList = [];
        //    eHnoteSettingsDataService.GetAllMasterClaimsData($scope.HospitalId).then(function (resp) {
        //        if (resp.data.status == "Success") {
        //            resp.data.rows = resp.data.rows || [];

        //            if (resp.data.ClaimStatus.length > 0) {
        //                $scope.MasterClaimStatusList = angular.copy(resp.data.ClaimStatus);
        //                //$scope.ClaimStatusListDD = angular.copy(resp[0].data.ClaimStatus);
        //                //$scope.ClaimStatusListDD.forEach(function (item) {
        //                //    item.IsChecked = true;
        //                //});
        //                $scope.serchobj.ClaimStatusList = $scope.MasterClaimStatusList.map(function (status) {
        //                    return status.ClaimStatusId;
        //                }).join(',');
        //                console.log($scope.serchobj.ClaimStatusList);
        //            }
        //        }
        //        console.log(resp);
        //    }, function (err) {

        //    });

        //}
        //$scope.GetAllMasterClaimsData();
        $scope.init = function () {

            $scope.MasterClaimStatusList = [];

            $q.all([

                eHnoteSettingsDataService.GetAllMasterClaimsData($scope.HospitalId),


            ]).then(function (resp) {

                if (resp[0].data.status == "Success") {
                    resp[0].data.rows = resp[0].data.rows || [];

                    if (resp[0].data.ClaimStatus.length > 0) {
                        $scope.MasterClaimStatusList = angular.copy(resp[0].data.ClaimStatus);
                        //$scope.ClaimStatusListDD = angular.copy(resp[0].data.ClaimStatus);
                        //$scope.ClaimStatusListDD.forEach(function (item) {
                        //    item.IsChecked = true;
                        //});
                        $scope.serchobj.ClaimStatusList = $scope.MasterClaimStatusList.map(function (status) {
                            return status.ClaimStatusId;
                        }).join(',');
                        console.log($scope.serchobj.ClaimStatusList);
                    }
                }
                console.log(resp);


                //  $scope.GetAllClaimStatusList()

            }, function (err) {
                console.log(err);
                alertify.error("Getting Data Failed");
            });

        }
        $scope.init();

        $scope.postingFromToCalender = {
            templateUrl: 'templates/UIBPopovers/fromToCalender.html',
        };

        $scope.depositFromToCalender = {
            templateUrl: 'templates/UIBPopovers/fromToCalender.html'
        };
        $scope.closeFilterPopover = function () {
            angular.element(document.querySelector('.popover')).remove();
        };

        $scope.$on('navtoPostingsListScreen', function (event, id) {
            $scope.PostingSubTabs = id;
            $scope.SwitchPostingSubTabs(id);
        });
    }]);

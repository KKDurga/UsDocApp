"use strict";
eHnoteWebApp.controller("UsAuditGridContainerCtrl", [
    "$scope", "$uibModal", "$uibModalInstance", "$timeout", "PObj",
    "eHnoteInsuranceService", "eHnoteMasterDataService", "eHnoteReferalDataService",
    "eHnoteSettingsDataService", "$filter", "alertify",
    function ($scope, $uibModal, $uibModalInstance, $timeout, PObj,
        eHnoteInsuranceService, eHnoteMasterDataService, eHnoteReferalDataService,
        eHnoteSettingsDataService, $filter, alertify) {

        /* ═══════════════════════════════════════════════
           GRID API
        ═══════════════════════════════════════════════ */
        let gridApi = null;

        $scope.close = function () {
            $uibModalInstance.dismiss("cancel");
        };

        /* ═══════════════════════════════════════════════
           USER / HOSPITAL INFO
        ═══════════════════════════════════════════════ */
        $scope.doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.HospitalId = 0;
        $scope.ParentHospitalId = 0;
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        $scope.SpecializationId = $scope.doctorinfo.doctordata.User[0].SpecializationId;

        if ($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo &&
            $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode &&
            $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID) {
            $scope.HospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            $scope.ParentHospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        }

        /* ═══════════════════════════════════════════════
           RESOLVE DATA
        ═══════════════════════════════════════════════ */
        $scope.MainPobj = angular.copy(PObj.Mainobj) || {};
        $scope.InsSubTab = PObj.type || '';          // 'BillingProvider' | 'RenderingProvider' | 'Payor'
        $scope.SelectedId = PObj.id || '';
        $scope.AuditPopupCount = 0;

        /* ═══════════════════════════════════════════════
           STATIC DATE-RANGE ARRAYS  (same as parent)
        ═══════════════════════════════════════════════ */
        $scope.PaymentDateRangeArray = [
            { Id: 1, Name: 'Today' },
            { Id: 4, Name: 'This month' },
            { Id: 5, Name: 'Last month' },
            { Id: 6, Name: 'Last 2 months' },
            { Id: 7, Name: 'Last 3 months' },
            { Id: 9, Name: 'This year' },
            { Id: 10, Name: 'Last year' },
            { Id: 11, Name: 'Custom Date' }
        ];

        $scope.ServiceDateRangeArray = [
            { Id: 1, Name: 'Today' },
            { Id: 3, Name: 'Last week' },
            { Id: 4, Name: 'This month' },
            { Id: 5, Name: 'Last month' },
            { Id: 6, Name: 'Last 2 months' },
            { Id: 7, Name: 'Last 3 months' },
            { Id: 9, Name: 'This year' },
            { Id: 10, Name: 'Last year' },
            { Id: 11, Name: 'Custom Date' }
        ];

        /* ═══════════════════════════════════════════════
           POPOVER
        ═══════════════════════════════════════════════ */
        $scope.payerFilterPopover = { templateUrl: 'InspayerFilterPopover.html' };
        $scope.isPopoverOpen = false;
        $scope.togglePopover = function () { $scope.isPopoverOpen = !$scope.isPopoverOpen; };
        $scope.closeFilterPopover = function () {
            angular.element(document.querySelector('.popover')).remove();
            $scope.isPopoverOpen = false;
        };

        /* ═══════════════════════════════════════════════
           SEARCH TEXT (rendering provider dropdown)
        ═══════════════════════════════════════════════ */
        $scope.auditPopupSearchTxt = { rendering: '' };

        /* ═══════════════════════════════════════════════
           DATE-RANGE HELPERS
        ═══════════════════════════════════════════════ */
        function _fmt(d) {
            return d ? $filter('date')(d, 'MM-dd-yyyy') : '';
        }

        $scope.setInsuranceCheckDateRange = function (id) {
            var d = new Date(), from, to = new Date();
            switch (id) {
                case 1: from = new Date(d); break;
                case 4: from = new Date(d.getFullYear(), d.getMonth(), 1); break;
                case 5:
                    from = new Date(d.getFullYear(), d.getMonth() - 1, 1);
                    to = new Date(d.getFullYear(), d.getMonth(), 0);
                    break;
                case 6: from = new Date(d.getFullYear(), d.getMonth() - 2, 1); break;
                case 7: from = new Date(d.getFullYear(), d.getMonth() - 3, 1); break;
                case 9: from = new Date(d.getFullYear(), 0, 1); break;
                case 10:
                    from = new Date(d.getFullYear() - 1, 0, 1);
                    to = new Date(d.getFullYear() - 1, 11, 31);
                    break;
                case 11: from = null; to = null; break;
                default: from = new Date(d.getFullYear(), d.getMonth(), 1);
            }
            $scope.MainPobj.ChkPostedFromDate = _fmt(from);
            $scope.MainPobj.ChkPostedToDate = _fmt(to);
        };

        $scope.setDOSDateRange = function (id) {
            var d = new Date(), from, to = new Date();
            switch (id) {
                case 1: from = new Date(d); break;
                case 3: from = new Date(d.setDate(d.getDate() - 7)); break;
                case 4: from = new Date(d.getFullYear(), d.getMonth(), 1); break;
                case 5:
                    from = new Date(d.getFullYear(), d.getMonth() - 1, 1);
                    to = new Date(d.getFullYear(), d.getMonth(), 0);
                    break;
                case 6: from = new Date(d.getFullYear(), d.getMonth() - 2, 1); break;
                case 7: from = new Date(d.getFullYear(), d.getMonth() - 3, 1); break;
                case 9: from = new Date(d.getFullYear(), 0, 1); break;
                case 10:
                    from = new Date(d.getFullYear() - 1, 0, 1);
                    to = new Date(d.getFullYear() - 1, 11, 31);
                    break;
                case 11: from = null; to = null; break;
                default: from = ''; to = '';
            }
            $scope.MainPobj.DOSFromDate = _fmt(from);
            $scope.MainPobj.DOSToDate = _fmt(to);
        };


       

        $scope.setAuditCreateDateRange = function (id) {
            var d = new Date(), from, to = new Date();
            switch (id) {
                case 1: from = new Date(d); break;
                case 4: from = new Date(d.getFullYear(), d.getMonth(), 1); break;
                case 5:
                    from = new Date(d.getFullYear(), d.getMonth() - 1, 1);
                    to = new Date(d.getFullYear(), d.getMonth(), 0);
                    break;
                case 6: from = new Date(d.getFullYear(), d.getMonth() - 2, 1); break;
                case 7: from = new Date(d.getFullYear(), d.getMonth() - 3, 1); break;
                case 9: from = new Date(d.getFullYear(), 0, 1); break;
                case 10:
                    from = new Date(d.getFullYear() - 1, 0, 1);
                    to = new Date(d.getFullYear() - 1, 11, 31);
                    break;
                case 11: from = null; to = null; break;
                default: from = ''; to = '';
            }
            $scope.MainPobj.ClaimStartDate = auditFormatDate(from);
            $scope.MainPobj.ClaimEndDate = auditFormatDate(to);
        };

        

        $scope.setAuditChkDateRange = function (id) {
            var d = new Date(), from, to = new Date();
            switch (id) {
                case 1: from = new Date(d); break;
                case 4: from = new Date(d.getFullYear(), d.getMonth(), 1); break;
                case 5:
                    from = new Date(d.getFullYear(), d.getMonth() - 1, 1);
                    to = new Date(d.getFullYear(), d.getMonth(), 0);
                    break;
                case 6: from = new Date(d.getFullYear(), d.getMonth() - 2, 1); break;
                case 7: from = new Date(d.getFullYear(), d.getMonth() - 3, 1); break;
                case 9: from = new Date(d.getFullYear(), 0, 1); break;
                case 10:
                    from = new Date(d.getFullYear() - 1, 0, 1);
                    to = new Date(d.getFullYear() - 1, 11, 31);
                    break;
                case 11: from = null; to = null; break;
                default: from = ''; to = '';
            }
            $scope.MainPobj.CheckStartDate = auditFormatDate(from);
            $scope.MainPobj.CheckEndDate = auditFormatDate(to);
        };


        /* ═══════════════════════════════════════════════
           INIT — pre-select the row the user clicked on
        ═══════════════════════════════════════════════ */
        $scope.init = function () {

            if ($scope.InsSubTab === 'BillingProvider') {

                // Pre-select only the clicked billing provider
                angular.forEach($scope.MainPobj.BillingProviderList, function (item) {
                    item.IsChecked = (item.OrganizationBillingProviderId == $scope.SelectedId);
                });

                // Sync header checkbox & label
                var cnt = $scope.MainPobj.BillingProviderList.filter(function (i) { return i.IsChecked; }).length;
                $scope.MainPobj.AllBillingProviderStatusCheck = cnt === $scope.MainPobj.BillingProviderList.length;
                $scope.MainPobj.SelectBillingProviderString =
                    cnt === 0 ? 'Select Billing Provider' :
                        ($scope.MainPobj.AllBillingProviderStatusCheck ? 'All' : 'Selected');

                // Ensure all rendering providers remain checked (no restriction)
                //angular.forEach($scope.MainPobj.RenderingProviderList, function (item) {
                //    item.IsChecked = true;
                //});
                //$scope.MainPobj.AllRenderingStatusCheck = true;
                //$scope.MainPobj.SelectRenderingStatusString = 'All Doctors';

            }
            else if ($scope.InsSubTab === 'RenderingProvider') {

                // Pre-select only the clicked rendering provider
                angular.forEach($scope.MainPobj.RenderingProviderList, function (item) {
                    item.IsChecked = (item.DoctorID == $scope.SelectedId);
                });

                // Sync header checkbox & label
                var cnt = $scope.MainPobj.RenderingProviderList.filter(function (i) { return i.IsChecked; }).length;
                $scope.MainPobj.AllRenderingStatusCheck = cnt === $scope.MainPobj.RenderingProviderList.length;
                $scope.MainPobj.SelectRenderingStatusString =
                    cnt === 0 ? 'Select' :
                        cnt === 1 ? ($scope.MainPobj.RenderingProviderList.find(function (i) { return i.IsChecked; }).SecondUserFullName || 'Selected') :
                            ($scope.MainPobj.AllRenderingStatusCheck ? 'All Doctors' : 'Selected');

                // Ensure all billing providers remain checked (no restriction)
                //angular.forEach($scope.MainPobj.BillingProviderList, function (item) {
                //    item.IsChecked = true;
                //});
                //$scope.MainPobj.AllBillingProviderStatusCheck = true;
                //$scope.MainPobj.SelectBillingProviderString = 'All';
            }
            else if ($scope.InsSubTab === 'Payor') {                             

                // Pre-filter by the clicked payor via the AllPayorList mechanism
                // (parent passes MasterPayorId as SelectedId)
                if ($scope.SelectedId && $scope.SelectedId !== '') {
                    var clickedItem = PObj.selecteditem || {};
                    // Ensure AllPayorList contains only the clicked payor on open
                    $scope.MainPobj.AllPayorList = [{
                        PayorId: clickedItem.OrganizationPayorId || $scope.SelectedId,
                        PayorName: clickedItem.OrganizationPayorName || ''
                    }];
                }

                // All providers remain unrestricted
                //angular.forEach($scope.MainPobj.BillingProviderList, function (i) { i.IsChecked = true; });
                //angular.forEach($scope.MainPobj.RenderingProviderList, function (i) { i.IsChecked = true; });
                //$scope.MainPobj.AllBillingProviderStatusCheck = true;
                //$scope.MainPobj.SelectBillingProviderString = 'All';
                //$scope.MainPobj.AllRenderingStatusCheck = true;
                //$scope.MainPobj.SelectRenderingStatusString = 'All Doctors';
            }

            $scope.pageload();
        };

        /* ═══════════════════════════════════════════════
           BUILD PAYLOAD HELPER
        ═══════════════════════════════════════════════ */
        // In UsAuditGridContainerCtrl — update buildPopupPayload to include IsProviderType

        function buildPopupPayload(startRow, endRow, sortModel) {
            var obj = $scope.MainPobj;

            var LocationIds = (obj.AllBranchesList || [])
                .filter(function (x) { return x.IsChecked && x.ClinicId !== 0; })
                .map(function (x) { return x.ClinicId; }).join(',');

            var BillingProviderIds = (obj.BillingProviderList || [])
                .filter(function (x) { return x.IsChecked; })
                .map(function (x) { return x.OrganizationBillingProviderId; }).join(',');

            var RenderingProviderIds = (obj.RenderingProviderList || [])
                .filter(function (x) { return x.IsChecked; })
                .map(function (x) { return x.DoctorID; }).join(',');

            var UserIds = (obj.AllUsersList || [])
                .filter(function (x) { return x.IsChecked; })
                .map(function (x) { return x.DoctorID; }).join(',');

            var MasterPayorIds = null;
            var AllMasterPayorsInd = 1;
            if (obj.AllPayorList && obj.AllPayorList.length > 0) {
                MasterPayorIds = obj.AllPayorList.map(function (p) { return p.PayorId; }).join(',');
                AllMasterPayorsInd = 0;
            }

            var ProcedureIds = null;
            var AllProcedureInd = 1;
            if (obj.AllProcedureList && obj.AllProcedureList.length > 0) {
                ProcedureIds = obj.AllProcedureList.map(function (p) { return p.ProcedureId; }).join(',');
                AllProcedureInd = 0;
            }

            var PcpReferralIds = null;
            var AllReferralProviderInd = 1;
            if (obj.AllReferalList && obj.AllReferalList.length > 0) {
                PcpReferralIds = obj.AllReferalList.map(function (p) { return p.PcpReferralId; }).join(',');
                AllReferralProviderInd = 0;
            }

            if ($scope.InsSubTab === 'Payor') { AllMasterPayorsInd = 0; }

            // ✅ Derive IsProviderType from InsSubTab
            var IsProviderType = 'BillingProvider';
            if ($scope.InsSubTab === 'RenderingProvider') {
                IsProviderType = 'RenderingProvider';
            }

            
            if ($scope.InsSubTab === 'RenderingProvider') { IsProviderType = 'RenderingProvider'; }
            else if ($scope.InsSubTab === 'Payor') { IsProviderType = 'Payor'; }

            var SortColumn = '';
            var SortDirection = '';
            if (sortModel && sortModel.length > 0) {
                SortColumn = sortModel[0].colId;      // 'DateOfServiceFrom'
                SortDirection = sortModel[0].sort;    // 'asc' or 'desc'
            }


            return {
                "ParentOrganization": $scope.ParentHospitalId,
                "OrganizationId": $scope.HospitalId,
                "AllLocationInd": LocationIds ? 0 : 1,
                "LocationIds": LocationIds || "",
                "AllBillingProviderInd": BillingProviderIds ? 0 : 1,
                "BillingProviderIds": BillingProviderIds || null,
                "AllRenderingProviderInd": RenderingProviderIds ? 0 : 1,
                "RenderingProviderIds": RenderingProviderIds || null,
                "AllMasterPayorsInd": AllMasterPayorsInd,
                "MasterPayorIds": MasterPayorIds,
                "AllProcedureInd": AllProcedureInd,
                "ProcedureIds": ProcedureIds,
                "AllReferralProviderInd": AllReferralProviderInd,
               // "ReferralProviderIds": PcpReferralIds,
                "ReferalUserIds": PcpReferralIds,
                "AllPostingUsersInd": UserIds ? 0 : 1,
                "PostingUserIds": UserIds || "",
                "ChkPostedToDate": obj.ChkPostedToDate || "",
                "ChkPostedFromDate": obj.ChkPostedFromDate || "",
                "DOSFrom": obj.DOSFromDate || "",
                "DOSTo": obj.DOSToDate || "",
                "IsProviderType": IsProviderType,   // ✅ Added
                "StartRow": startRow,
                "EndRow": endRow,
                "CheckDate": obj.CheckDate || "",
                "CheckStartDate": obj.CheckStartDate || "",
                "CheckEndDate": obj.CheckEndDate || "",
                "ChkDateRangeId": obj.ChkDateRangeId || "",
                "ClaimStartDate": obj.ClaimStartDate || "",
                "ClaimEndDate": obj.ClaimEndDate || "",
                "SortColumn": SortColumn || "",
                "SortDirection": SortDirection || "",


            };
        }

        /* ═══════════════════════════════════════════════
           AG-GRID COLUMN DEFS
           (matches screenshot: Billing P, Billing NPI,
            Reader/Record, Patient, Claim, DOS, POS,
            Payor, Policy, CPT, Proc, Units, Charges,
            Ins Paid, Adj Codes, Adj, Ins Bal,
            Posting Date, Check Date, Check No,
            Create Date, Created By, User)
        ═══════════════════════════════════════════════ */
        var auditPopupColumnDefs ="";

        if ($scope.InsSubTab === 'RenderingProvider') {
            var auditPopupColumnDefs = [
                { headerName: "Rendering Provider", field: "RenderingProviderName", minWidth: 220, pinned: 'left' },
                { headerName: "Rendering NPI", field: "RenderingProviderNPI", minWidth: 160 },
                { headerName: "Billing Provider", field: "BillingProviderName", minWidth: 220 },
                { headerName: "Billing NPI", field: "BillingProviderNPI", minWidth: 160 },
                { headerName: "POS", field: "PlaceOfServiceId", minWidth: 120 },
                { headerName: "Claim No", field: "ClaimNumber", minWidth: 140 },
                { headerName: "Create Date", field: "CreateDate", minWidth: 160, sortable: true },
                { headerName: "Record No", field: "PatientMrNo", minWidth: 150 },
                { headerName: "FirstName", field: "PatientFirstName", minWidth: 180 },
                { headerName: "LastName", field: "PatientLastName", minWidth: 180 },
                { headerName: "City Name", field: "CityName", minWidth: 150 },
                { headerName: "State", field: "StateCode", minWidth: 120 },
                { headerName: "InsuranceName", field: "PayorName", minWidth: 180 },
                { headerName: "IsPrimary", field: "IsIdentifier", minWidth: 130 },
                { headerName: "CardContractNo", field: "CardContractNo", minWidth: 180 },
                { headerName: "CardGroup", field: "CardGroup", minWidth: 140 },
                { headerName: "PayerICN", field: "PayerICN", minWidth: 150 },
                { headerName: "Procedure Code", field: "ProcedureCode", minWidth: 180 },
                { headerName: "Modifier1", field: "Modifier1", minWidth: 130 },
                { headerName: "CPTDesc", field: "ProcedureName", minWidth: 180 },
                { headerName: "DOS", field: "DateOfServiceFrom", minWidth: 140, sortable: true },
                { headerName: "Units", field: "Units", minWidth: 100 },
                { headerName: "Charges", field: "ChargeAmount", minWidth: 140 },
                { headerName: "Insurance Paid", field: "InsAmtPaid", minWidth: 170 },
                { headerName: "Adjustment", field: "InsAmtAdj", minWidth: 140 },
                { headerName: "Insurance Bal", field: "InsBalance", minWidth: 180 },
                { headerName: "Check/EFT No", field: "CheckNumber", minWidth: 180 },
                { headerName: "Check/EFT Date", field: "CheckDate", minWidth: 180, sortable: true },
                { headerName: "ChkAmtPaid", field: "ChkAmtPaid", minWidth: 150 },
                /*{ headerName: "Ins PaymentAmount", field: "InsPaymentAmount", minWidth: 150 },*/
                { headerName: "Patient Charge", field: "PatientCharge", minWidth: 180 },
                { headerName: "Patient PaymentDate", field: "PatientPaymentDate", minWidth: 180 },
                { headerName: "Patient Payment", field: "PatientPayment", minWidth: 180 },
                { headerName: "PatientAdjs", field: "WriteOffAmount", minWidth: 150 },
                { headerName: "Patient Bal", field: "PatientBalance", minWidth: 150 },
                { headerName: "UserName", field: "UserName", minWidth: 150 },
                { headerName: "sDxID1", field: "ICDCodes", minWidth: 150 },
                { headerName: "Posting Date", field: "PostingDate", minWidth: 150, sortable: true },
                { headerName: "ProvReferringNPI", field: "ProvReferringNPI", minWidth: 180 },
                { headerName: "ProvReferringName", field: "ProvReferringName", minWidth: 200 },
            ];
        } else if ($scope.InsSubTab === 'Payor') {
            var auditPopupColumnDefs = [
                { headerName: "InsuranceName", field: "PayorName", minWidth: 180, pinned: 'left' },                
                { headerName: "Billing Provider", field: "BillingProviderName", minWidth: 220 },
                { headerName: "Billing NPI", field: "BillingProviderNPI", minWidth: 160 },
                { headerName: "Rendering Provider", field: "RenderingProviderName", minWidth: 220 },
                { headerName: "Rendering NPI", field: "RenderingProviderNPI", minWidth: 160 },
                { headerName: "POS", field: "PlaceOfServiceId", minWidth: 120 },
                { headerName: "Claim No", field: "ClaimNumber", minWidth: 140 },
                { headerName: "Create Date", field: "CreateDate", minWidth: 160, sortable: true },
                { headerName: "Record No", field: "PatientMrNo", minWidth: 150 },
                { headerName: "FirstName", field: "PatientFirstName", minWidth: 180 },
                { headerName: "LastName", field: "PatientLastName", minWidth: 180 },
                { headerName: "City Name", field: "CityName", minWidth: 150 },
                { headerName: "State", field: "StateCode", minWidth: 120 },

                { headerName: "IsPrimary", field: "IsIdentifier", minWidth: 130 },
                { headerName: "CardContractNo", field: "CardContractNo", minWidth: 180 },
                { headerName: "CardGroup", field: "CardGroup", minWidth: 140 },
                { headerName: "PayerICN", field: "PayerICN", minWidth: 150 },
                { headerName: "Procedure Code", field: "ProcedureCode", minWidth: 180 },
                { headerName: "Modifier1", field: "Modifier1", minWidth: 130 },
                { headerName: "CPTDesc", field: "ProcedureName", minWidth: 180 },
                { headerName: "DOS", field: "DateOfServiceFrom", minWidth: 140, sortable: true },
                { headerName: "Units", field: "Units", minWidth: 100 },
                { headerName: "Charges", field: "ChargeAmount", minWidth: 140 },
                { headerName: "Insurance Paid", field: "InsAmtPaid", minWidth: 170 },
                { headerName: "Adjustment", field: "InsAmtAdj", minWidth: 140 },
                { headerName: "Insurance Bal", field: "InsBalance", minWidth: 180 },
                { headerName: "Check/EFT No", field: "CheckNumber", minWidth: 180 },
                { headerName: "Check/EFT Date", field: "CheckDate", minWidth: 180, sortable: true },
                { headerName: "ChkAmtPaid", field: "ChkAmtPaid", minWidth: 150 },
                /*{ headerName: "Ins PaymentAmount", field: "InsPaymentAmount", minWidth: 150 },*/
                { headerName: "Patient PaymentDate", field: "PatientPaymentDate", minWidth: 180 },
                { headerName: "Patient Charge", field: "PatientCharge", minWidth: 180 },
                { headerName: "Patient Payment", field: "PatientPayment", minWidth: 180 },
                { headerName: "PatientAdjs", field: "WriteOffAmount", minWidth: 150 },
                { headerName: "Patient Bal", field: "PatientBalance", minWidth: 150 },
                { headerName: "UserName", field: "UserName", minWidth: 150 },
                { headerName: "sDxID1", field: "ICDCodes", minWidth: 150 },
                { headerName: "Posting Date", field: "PostingDate", minWidth: 150, sortable: true },
                { headerName: "ProvReferringNPI", field: "ProvReferringNPI", minWidth: 180 },
                { headerName: "ProvReferringName", field: "ProvReferringName", minWidth: 200 },
            ];
        } else {
            var auditPopupColumnDefs = [
                { headerName: "Billing Provider", field: "BillingProviderName", minWidth: 220, pinned: 'left' },
                { headerName: "Billing NPI", field: "BillingProviderNPI", minWidth: 160 },
                { headerName: "Rendering Provider", field: "RenderingProviderName", minWidth: 220 },
                { headerName: "Rendering NPI", field: "RenderingProviderNPI", minWidth: 160 },
                { headerName: "POS", field: "PlaceOfServiceId", minWidth: 120 },
                { headerName: "Claim No", field: "ClaimNumber", minWidth: 140 },
                { headerName: "Create Date", field: "CreateDate", minWidth: 160, sortable: true },
                { headerName: "Record No", field: "PatientMrNo", minWidth: 150 },
                { headerName: "FirstName", field: "PatientFirstName", minWidth: 180 },
                { headerName: "LastName", field: "PatientLastName", minWidth: 180 },
                { headerName: "City Name", field: "CityName", minWidth: 150 },
                { headerName: "State", field: "StateCode", minWidth: 120 },
                { headerName: "InsuranceName", field: "PayorName", minWidth: 180 },
                { headerName: "IsPrimary", field: "IsIdentifier", minWidth: 130 },
                { headerName: "CardContractNo", field: "CardContractNo", minWidth: 180 },
                { headerName: "CardGroup", field: "CardGroup", minWidth: 140 },
                { headerName: "PayerICN", field: "PayerICN", minWidth: 150 },
                { headerName: "Procedure Code", field: "ProcedureCode", minWidth: 180 },
                { headerName: "Modifier1", field: "Modifier1", minWidth: 130 },
                { headerName: "CPTDesc", field: "ProcedureName", minWidth: 180 },
                { headerName: "DOS", field: "DateOfServiceFrom", minWidth: 140, sortable: true },
                { headerName: "Units", field: "Units", minWidth: 100 },
                { headerName: "Charges", field: "ChargeAmount", minWidth: 140 },
                { headerName: "Insurance Paid", field: "InsAmtPaid", minWidth: 170 },
                { headerName: "Adjustment", field: "InsAmtAdj", minWidth: 140 },
                { headerName: "Insurance Bal", field: "InsBalance", minWidth: 180 },
                { headerName: "Check/EFT No", field: "CheckNumber", minWidth: 180 },
                { headerName: "Check/EFT Date", field: "CheckDate", minWidth: 180,sortable: true},
                { headerName: "ChkAmtPaid", field: "ChkAmtPaid", minWidth: 150 },
               /* { headerName: "Ins PaymentAmount", field: "InsPaymentAmount", minWidth: 150 },*/
                { headerName: "Patient PaymentDate", field: "PatientPaymentDate", minWidth: 180 },
                { headerName: "Patient Charge", field: "PatientCharge", minWidth: 180 },
                { headerName: "Patient Payment", field: "PatientPayment", minWidth: 180 },
                { headerName: "PatientAdjs", field: "WriteOffAmount", minWidth: 150 },
                { headerName: "Patient Bal", field: "PatientBalance", minWidth: 150 },
                { headerName: "UserName", field: "UserName", minWidth: 150 },
                { headerName: "sDxID1", field: "ICDCodes", minWidth: 150 },
                { headerName: "Posting Date", field: "PostingDate", minWidth: 150, sortable: true },
                { headerName: "ProvReferringNPI", field: "ProvReferringNPI", minWidth: 180 },
                { headerName: "ProvReferringName", field: "ProvReferringName", minWidth: 200 },
            ];
        }

        /* ═══════════════════════════════════════════════
           FORMAT DATE FIELDS ON ROWS
        ═══════════════════════════════════════════════ */
        function formatRows(rows) {
            rows.forEach(function (item) {
                item.DateOfServiceFrom = _fmt(item.DateOfServiceFrom);
                item.DateOfServiceTo = _fmt(item.DateOfServiceTo);
                item.PostingDate = _fmt(item.PostingDate);
                item.CheckDate = _fmt(item.CheckDate);   // was CheckEFTDate
                item.CreateDate = _fmt(item.CreateDate);
                item.PatientPaymentDate = _fmt(item.PatientPaymentDate);
            });
        }

        /* ═══════════════════════════════════════════════
           PAGE LOAD — init grid inside rendered modal
        ═══════════════════════════════════════════════ */
        $scope.pageload = function () {

            $uibModalInstance.rendered.then(function () {

                var gridDiv = document.getElementById('InspopupAgGrid');
                if (!gridDiv) { console.warn('AuditGridContainer: ag-Grid div not found'); return; }

                if (gridApi) { gridApi.destroy(); gridApi = null; }

                var gridOptions = {
                    columnDefs: auditPopupColumnDefs,
                    defaultColDef: {
                        flex: 1,
                        minWidth: 100,
                        sortable: false,
                        filter: false,
                        resizable: true,
                        suppressHeaderMenuButton: false
                    },
                    rowModelType: 'serverSide',
                    cacheBlockSize: 100,
                    maxBlocksInCache: 10,
                    animateRows: false,

                    onGridReady: function (params) {
                        gridApi = params.api;

                        var ds = {
                            getRows: function (ssParams) {
                                var payload = buildPopupPayload(
                                    ssParams.request.startRow,
                                    ssParams.request.endRow,
                                    ssParams.request.sortModel
                                );

                                eHnoteInsuranceService.GetAuditSummaryDetailReport_New(payload)
                                    .then(function (resp) {
                                        if (resp.data.status === "Success") {
                                            var rows = resp.data.rows || [];
                                            var totalCount = resp.data.Count || 0;
                                            $scope.AuditPopupCount = totalCount;

                                            formatRows(rows);
                                            if (ssParams.request.startRow === 0) {

                                                $scope.audittotalCharges = 0;
                                                $scope.audittotalInsPaid = 0;
                                                $scope.audittotalAdjustment = 0;
                                                $scope.audittotalInsBalance = 0;
                                                $scope.audittotalChkAmtPaid = 0;
                                                $scope.audittotalPatientPaid = 0;
                                                $scope.audittotalPatientCharge = 0;
                                                $scope.audittotalPatientPayment = 0;
                                                $scope.audittotalPatientBalance = 0;
                                                $scope.auditpatientAdj = 0;
                                            }

                                            // Current block totals
                                            const currentCharges =
                                                rows.reduce(function (s, r) {
                                                    return s + (parseFloat(r.ChargeAmount) || 0);
                                                }, 0);

                                            const currentInsPaid =
                                                rows.reduce(function (s, r) {
                                                    return s + (parseFloat(r.InsAmtPaid) || 0);
                                                }, 0);

                                            const currentAdjustment =
                                                rows.reduce(function (s, r) {
                                                    return s + (parseFloat(r.InsAmtAdj) || 0);
                                                }, 0);

                                            const currentInsBalance =
                                                rows.reduce(function (s, r) {
                                                    return s + (parseFloat(r.InsBalance) || 0);
                                                }, 0);

                                            const currentChkAmtPaid =
                                                rows.reduce(function (s, r) {
                                                    return s + (parseFloat(r.ChkAmtPaid) || 0);
                                                }, 0);

                                            const currentPatientPaid =
                                                rows.reduce(function (s, r) {
                                                    return s + (parseFloat(r.PatientPaymentAmount) || 0);
                                                }, 0);

                                            const currentPatientCharge =
                                                rows.reduce(function (s, r) {
                                                    return s + (parseFloat(r.PatientCharge) || 0);
                                                }, 0);

                                            const currentPatientPayment =
                                                rows.reduce(function (s, r) {
                                                    return s + (parseFloat(r.PatientPayment) || 0);
                                                }, 0);

                                            const currentPatientBalance =
                                                rows.reduce(function (s, r) {
                                                    return s + (parseFloat(r.PatientBalance) || 0);
                                                }, 0);

                                            const currentPatientAdj =
                                                rows.reduce(function (s, r) {
                                                    return s + (parseFloat(r.WriteOffAmount) || 0);
                                                }, 0);

                                            // Add scrolling totals
                                            $scope.audittotalCharges += currentCharges;
                                            $scope.audittotalInsPaid += currentInsPaid;
                                            $scope.audittotalAdjustment += currentAdjustment;
                                            $scope.audittotalInsBalance += currentInsBalance;
                                            $scope.audittotalChkAmtPaid += currentChkAmtPaid;
                                            $scope.audittotalPatientPaid += currentPatientPaid;
                                            $scope.audittotalPatientCharge += currentPatientCharge;
                                            $scope.audittotalPatientPayment += currentPatientPayment;
                                            $scope.audittotalPatientBalance += currentPatientBalance;
                                            $scope.auditpatientAdj += currentPatientAdj;
                                            var totalsRow = {
                                                ChargeAmount: $scope.audittotalCharges.toFixed(2),
                                                InsAmtPaid: $scope.audittotalInsPaid.toFixed(2),
                                                InsAmtAdj: $scope.audittotalAdjustment.toFixed(2),
                                                InsBalance: $scope.audittotalInsBalance.toFixed(2),
                                                ChkAmtPaid: $scope.audittotalChkAmtPaid.toFixed(2),
                                                PatientPaymentAmount: $scope.audittotalPatientPaid.toFixed(2),
                                                PatientCharge: $scope.audittotalPatientCharge.toFixed(2),
                                                PatientPayment: $scope.audittotalPatientPayment.toFixed(2),
                                                PatientBalance: $scope.audittotalPatientBalance.toFixed(2),
                                                PatientAdj: $scope.auditpatientAdj.toFixed(2),
                                            };
                                            if ($scope.InsSubTab === "Payor") {
                                                totalsRow.PayorName = 'TOTALS';              
                                            } else if ($scope.InsSubTab === "RenderingProvider") {
                                                totalsRow.RenderingProviderName = 'TOTALS';  
                                            } else {
                                                totalsRow.BillingProviderName = 'TOTALS';    
                                            }
                                            gridApi.setGridOption('pinnedBottomRowData', [totalsRow]);
                                            if (totalCount === 0) {
                                                ssParams.success({ rowData: [], rowCount: 0 });
                                                return;
                                            }
                                            var lastRow = ssParams.request.endRow >= totalCount ? totalCount : -1;
                                            ssParams.success({ rowData: rows, rowCount: lastRow });
                                        } else {
                                            $scope.AuditPopupCount = 0;
                                            ssParams.fail();
                                        }
                                    })
                                    .catch(function () {
                                        $scope.AuditPopupCount = 0;
                                        ssParams.fail();
                                    });
                            }
                        };

                        params.api.setGridOption('serverSideDatasource', ds);
                    }
                };

                gridApi = agGrid.createGrid(gridDiv, gridOptions);
            });
        };

        /* ═══════════════════════════════════════════════
           APPLY FILTER
        ═══════════════════════════════════════════════ */
        $scope.ClickForInsuranceFilteredData = function () {
            angular.element(document.querySelector('.popover')).remove();
            $scope.isPopoverOpen = false;
            if (gridApi) {
                gridApi.refreshServerSide({ purge: true });
            } else {
                $scope.pageload();
            }
        };

        /* ═══════════════════════════════════════════════
           CLEAR FILTERS
        ═══════════════════════════════════════════════ */
        $scope.ClearInsuranceFilters = function () {
            angular.element(document.querySelector('.popover')).remove();
            $scope.isPopoverOpen = false;

            var d = new Date();
            $scope.MainPobj.ServiceDateRangeId = 4;
            $scope.MainPobj.ChkPostedFromDate = _fmt(new Date(d.getFullYear(), d.getMonth(), 1));
            $scope.MainPobj.ChkPostedToDate = _fmt(new Date());            
            $scope.MainPobj.ChkDateRangeId = '';
            $scope.MainPobj.DOSFromDate = '';
            $scope.MainPobj.DOSToDate = '';
            $scope.MainPobj.CheckStartDate = '';
            $scope.MainPobj.CheckEndDate = '';
            $scope.setDOSDateRange(4);
            $scope.MainPobj.ChkPostedDateRangeId = '';
            $scope.MainPobj.ChkPostedFromDate = '';
            $scope.MainPobj.ChkPostedToDate = '';

            angular.forEach($scope.MainPobj.BillingProviderList, function (i) { i.IsChecked = true; });
            angular.forEach($scope.MainPobj.RenderingProviderList, function (i) { i.IsChecked = true; });
            angular.forEach($scope.MainPobj.AllUsersList, function (i) { i.IsChecked = true; });
            angular.forEach($scope.MainPobj.AllBranchesList, function (i) { i.IsChecked = true; });

            $scope.MainPobj.AllBillingProviderStatusCheck = true;
            $scope.MainPobj.SelectBillingProviderString = 'All';
            $scope.MainPobj.AllRenderingStatusCheck = true;
            $scope.MainPobj.SelectRenderingStatusString = 'All Doctors';
            $scope.MainPobj.AllUserStatusCheck = true;
            $scope.MainPobj.SelectUserStatusString = 'All';

            $scope.MainPobj.AllPayorList = [];
            $scope.MainPobj.AllProcedureList = [];
            $scope.MainPobj.AllReferalList = [];
            if ($scope.InsSubTab === 'Payor' && PObj.selecteditem) {
                $scope.MainPobj.AllPayorList = [{
                    PayorId: PObj.selecteditem.MasterPayorId || $scope.SelectedId,
                    PayorName: PObj.selecteditem.MasterPayorName || ''
                }];
            } else {
                $scope.MainPobj.AllPayorList = [];
            }


            $scope.init();
        };



        $scope.setAuditChkPostedDateRange = function (id) {
            var d = new Date(), from, to = new Date();
            switch (id) {
                case 1: from = new Date(d); break;
                case 4: from = new Date(d.getFullYear(), d.getMonth(), 1); break;
                case 5:
                    from = new Date(d.getFullYear(), d.getMonth() - 1, 1);
                    to = new Date(d.getFullYear(), d.getMonth(), 0);
                    break;
                case 6: from = new Date(d.getFullYear(), d.getMonth() - 2, 1); break;
                case 7: from = new Date(d.getFullYear(), d.getMonth() - 3, 1); break;
                case 9: from = new Date(d.getFullYear(), 0, 1); break;
                case 10:
                    from = new Date(d.getFullYear() - 1, 0, 1);
                    to = new Date(d.getFullYear() - 1, 11, 31);
                    break;
                case 11: from = null; to = null; break;
                default: from = ''; to = '';
            }
            $scope.MainPobj.ChkPostedFromDate = auditFormatDate(from);
            $scope.MainPobj.ChkPostedToDate = auditFormatDate(to);
        };

        $scope.setAuditChkDateRange = function (id) {
            var d = new Date(), from, to = new Date();
            switch (id) {
                case 1: from = new Date(d); break;
                case 4: from = new Date(d.getFullYear(), d.getMonth(), 1); break;
                case 5:
                    from = new Date(d.getFullYear(), d.getMonth() - 1, 1);
                    to = new Date(d.getFullYear(), d.getMonth(), 0);
                    break;
                case 6: from = new Date(d.getFullYear(), d.getMonth() - 2, 1); break;
                case 7: from = new Date(d.getFullYear(), d.getMonth() - 3, 1); break;
                case 9: from = new Date(d.getFullYear(), 0, 1); break;
                case 10:
                    from = new Date(d.getFullYear() - 1, 0, 1);
                    to = new Date(d.getFullYear() - 1, 11, 31);
                    break;
                case 11: from = null; to = null; break;
                default: from = ''; to = '';
            }
            $scope.MainPobj.CheckStartDate = auditFormatDate(from);
            $scope.MainPobj.CheckEndDate = auditFormatDate(to);
        };

        /* ═══════════════════════════════════════════════
           BILLING PROVIDER TOGGLES
        ═══════════════════════════════════════════════ */
        $scope.checkInsuranceAllBillingProviders = function (val) {
            angular.forEach($scope.MainPobj.BillingProviderList, function (i) { i.IsChecked = val; });
            $scope.MainPobj.SelectBillingProviderString = val ? 'All' : 'Select Billing Provider';
        };

        $scope.InsuranceProviderToggle = function () {
            var cnt = $scope.MainPobj.BillingProviderList.filter(function (i) { return i.IsChecked; }).length;
            $scope.MainPobj.AllBillingProviderStatusCheck = cnt === $scope.MainPobj.BillingProviderList.length;
            $scope.MainPobj.SelectBillingProviderString = cnt === 0 ? 'Select Billing Provider' :
                ($scope.MainPobj.AllBillingProviderStatusCheck ? 'All' : 'Selected');
        };

        /* ═══════════════════════════════════════════════
           RENDERING PROVIDER TOGGLES
        ═══════════════════════════════════════════════ */
        $scope.checkAllRendering = function (val) {
            angular.forEach($scope.MainPobj.RenderingProviderList, function (i) { i.IsChecked = val; });
            $scope.MainPobj.AllRenderingStatusCheck = val;
            $scope.MainPobj.SelectRenderingStatusString = val ? 'All Doctors' : 'Select';
        };

        $scope.InsuranceRenderingToggle = function () {
            var checked = $scope.MainPobj.RenderingProviderList.filter(function (i) { return i.IsChecked; });
            $scope.MainPobj.AllRenderingStatusCheck = checked.length === $scope.MainPobj.RenderingProviderList.length;
            $scope.MainPobj.SelectRenderingStatusString =
                checked.length === 0 ? 'Select' :
                    checked.length === 1 ? checked[0].SecondUserFullName + '-' + checked[0].NPI : 'Selected';
        };

        /* ═══════════════════════════════════════════════
           USER TOGGLES
        ═══════════════════════════════════════════════ */
        $scope.checkAllInsuranceUser = function (val) {
            angular.forEach($scope.MainPobj.AllUsersList, function (i) { i.IsChecked = val; });
            $scope.MainPobj.AllUserStatusCheck = val;
            $scope.MainPobj.SelectUserStatusString = val ? 'All' : 'Select';
        };

        $scope.InsuranceUserToggle = function () {
            var checked = $scope.MainPobj.AllUsersList.filter(function (i) { return i.IsChecked; });
            $scope.MainPobj.AllUserStatusCheck = checked.length === $scope.MainPobj.AllUsersList.length;
            $scope.MainPobj.SelectUserStatusString = checked.length === 0 ? 'Select' :
                ($scope.MainPobj.AllUserStatusCheck ? 'All' : 'Selected');
        };

        /* ═══════════════════════════════════════════════
           PAYOR TYPEAHEAD
        ═══════════════════════════════════════════════ */
        $scope.GetOrganizationNewPayorAllList = function (val) {
            var param = {
                "SearchText": val || "", "Status": "Active",
                "PageSize": 10, "PageNumber": 1,
                "UserId": $scope.UserId, "SpecializationId": $scope.SpecializationId,
                "OrganizationId": $scope.HospitalId, "ParentOrganizationId": $scope.ParentHospitalId,
                "GetAllIndicator": 0, "PayorId": 0, "PayorTypeId": 0
            };
            return eHnoteInsuranceService.GetOrganizationInsurancePayorsList(param).then(function (resp) {
                if (resp.data.count !== 0 && resp.data.rows) { return resp.data.rows; }
            });
        };

        $scope.ChangeInsurancePayor = function (item) {
            var exists = $filter('filter')($scope.MainPobj.AllPayorList, { PayorId: item.OrganizationPayorId }, true);
            if (exists.length > 0) { alertify.error('Payor is already selected'); return; }
            $scope.MainPobj.AllPayorList.push({ PayorId: item.OrganizationPayorId, PayorName: item.OrganizationPayorName });
            $scope.MainPobj.PayorObj = '';
        };
        $scope.DeletePayor = function (i) { $scope.MainPobj.AllPayorList.splice(i, 1); };
        $scope.ClearAllPayor = function () { $scope.MainPobj.AllPayorList = []; };

        /* ═══════════════════════════════════════════════
           PROCEDURE TYPEAHEAD
        ═══════════════════════════════════════════════ */
        $scope.GetOrganizationProcedure = function (text) {
            var params = {
                "OrganizationId": $scope.HospitalId, "ProcedureId": 0, "CPTCODE": "",
                "SearchText": text || "", "TypeOfServiceId": 0,
                "PageNumber": 1, "PageSize": 10, "Status": 1,
                "IsFrequent": text ? 'N' : 'Y',
                "ParentOrganizationId": $scope.ParentHospitalId || null
            };
            return eHnoteSettingsDataService.GetOrganizationProceduresSearchEngine(params).then(function (resp) {
                if (resp.data.rows) {
                    return resp.data.rows.filter(function (i) { return i.IsActive; });
                }
            });
        };

        $scope.onselectServiceItem = function (item) {
            var exists = $filter('filter')($scope.MainPobj.AllProcedureList, { ProcedureId: item.ProcedureId }, true);
            if (exists.length > 0) { alertify.error('Procedure is already selected'); return; }
            $scope.MainPobj.AllProcedureList.push({ ProcedureId: item.ProcedureId, ProcedureName: item.ProcedureName });
            $scope.MainPobj.ServiceObj = '';
        };
        $scope.DeleteProcedure = function (i) { $scope.MainPobj.AllProcedureList.splice(i, 1); };
        $scope.ClearAllProcedure = function () { $scope.MainPobj.AllProcedureList = []; };

        /* ═══════════════════════════════════════════════
           REFERRAL TYPEAHEAD
        ═══════════════════════════════════════════════ */
        $scope.GetReferalPCPDoctors = function (val, typeid) {
            var searchText = '', searchNpi = '';
            if (/^[0-9]+$/.test(val)) { searchNpi = val; } else { searchText = val; }
            return eHnoteReferalDataService.GetReferalPCPDoctors({
                'LocationId': null, 'PageNumber': 1, 'PageSize': 10,
                'SearchTaxt': searchText, 'NPI': searchNpi,
                'SpecializationId': null, 'RefaralTypeId': typeid,
                'DeleteInd': 'N', 'OrganizationId': $scope.HospitalId
            }).then(function (resp) {
                return resp.data.status === 'Success' ? resp.data.PcpRefdetails : [];
            });
        };

        $scope.onSelectReferral = function (item) {
            var exists = $filter('filter')($scope.MainPobj.AllReferalList, { PcpReferralId: item.PcpReferralId }, true);
            if (exists.length > 0) { alertify.error('Referral already selected'); return; }
            $scope.MainPobj.AllReferalList.push({ PcpReferralId: item.PcpReferralId, FullName: item.FullName });
            $scope.MainPobj.ReferringObj = '';
        };
        $scope.DeleteReferal = function (i) { $scope.MainPobj.AllReferalList.splice(i, 1); };
        $scope.ClearAllReferal = function () { $scope.MainPobj.AllReferalList = []; };

        /* ═══════════════════════════════════════════════
           EXCEL EXPORT
        ═══════════════════════════════════════════════ */

        $scope.GetExcelReportsObj = function () {
            let obj = {
                "ExportJobId": 0,
                "UserId": $scope.UserId,
                "RequestedByUserId": $scope.UserId || null,
                "RequestedByUserName": "",
                "OrganizationId": $scope.HospitalId,
                "ParentOrganizationId": $scope.ParentHospitalId,
                "ReportName": "Audit Report",
                "ReportId": 15,
                "StatusId": 1,
                "StatusName": "Pending",
                "IsManualExport": true,
                "CSVFileName": "",
                "CSVFileExt": ".csv",
                "CSVFileUrl": null,
                "ErrorMessage": null,
                "startedOn": new Date(),
                "CompletedOn": null,
                "DeleteInd": "N",
                "AllBranchesList": $scope.MainPobj.AllBranchesList,
                "AllBillingProviderList": $scope.MainPobj.BillingProviderList,
                "AllUsersList": $scope.MainPobj.AllUsersList,
                "AllRenderingProviderList": $scope.MainPobj.RenderingProviderDoctorsList,
                "AllMasterPaymentsMethods": $scope.MainPobj.AllMasterPaymentsMethods,
                "RequestType": "Immediate",

            };

            return obj;
        }
        $scope.ExcelReportsObj = $scope.GetExcelReportsObj();



        $scope.ClickForAuditPopupExcel = function () {
            const LocationIds = ($scope.MainPobj.AllBranchesList || [])
                .filter(x => x.IsChecked && x.ClinicId !== 0)
                .map(x => x.ClinicId)
                .join(",");
            const BillingProviderIds = ($scope.MainPobj.BillingProviderList || [])
                .filter(x => x.IsChecked)
                .map(x => x.OrganizationBillingProviderId)
                .join(",");
            const RenderingProviderIds = ($scope.MainPobj.RenderingProviderList || [])
                .filter(x => x.IsChecked)
                .map(x => x.DoctorID)
                .join(",");
            const UserIds = ($scope.MainPobj.AllUsersList || [])
                .map(x => x.DoctorID)
                .join(",");
            const PaymentModeIds = ($scope.MainPobj.AllMasterPaymentsMethods || [])
                .filter(x => x.IsChecked)
                .map(x => x.PaymentModeId)
                .join(",");

            var MasterPayorIds = null;
            if ($scope.MainPobj.AllPayorList.length > 0) {
                MasterPayorIds = $scope.MainPobj.AllPayorList
                    .map(pitem => pitem.PayorId)
                    .join(",");

            }

            var PcpReferralIds = null;
            var AllReferralProviderInd = 1;
            if ($scope.MainPobj.AllReferalList && $scope.MainPobj.AllReferalList.length > 0) {
                PcpReferralIds = $scope.MainPobj.AllReferalList.map(function (p) { return p.PcpReferralId; }).join(',');
                AllReferralProviderInd = 0;
            }

         

            var ProcedureIds = null;
            var AllProcedureInd = 1;
            if ($scope.MainPobj.AllProcedureList && $scope.MainPobj.AllProcedureList.length > 0) {
                ProcedureIds = $scope.MainPobj.AllProcedureList.map(function (p) { return p.ProcedureId; }).join(',');
                AllProcedureInd = 0;
            }

            var MasterPayorIds = null;
            var AllMasterPayorsInd = 1;
            if ($scope.MainPobj.AllPayorList && $scope.MainPobj.AllPayorList.length > 0) {
                MasterPayorIds = $scope.MainPobj.AllPayorList.map(function (p) { return p.PayorId; }).join(',');
                AllMasterPayorsInd = 0;
            }

            let filtredArray = $filter("filter")($scope.MainPobj.AllUsersList, { "DoctorID": $scope.UserId }, true) || [];
            if (filtredArray.length > 0) {
                $scope.ExcelReportsObj.RequestedByUserName = filtredArray[0].FullName || "";
            }
            var startDate = new Date($scope.MainPobj.PaymentFromDate);
            var endDate = new Date($scope.MainPobj.PaymentToDate);

            // Calculate difference in days
            var diffTime = endDate - startDate;
            var diffDays = diffTime / (1000 * 60 * 60 * 24);

            // Condition
            if (diffDays <= 7) {
                $scope.ExcelReportsObj.RequestType = "Immediate";
            } else {
                $scope.ExcelReportsObj.RequestType = "TaskRun";
            }

            $scope.ExcelReportsObj.ReportId = 15;
            $scope.ExcelReportsObj.ReportName = "Audit Report";


            let obj = {
                "ExportJobId": $scope.ExcelReportsObj.ExportJobId,
                "RequestedByUserId": $scope.ExcelReportsObj.RequestedByUserId,
                "RequestedByUserName": $scope.ExcelReportsObj.RequestedByUserName,
                "UserId": $scope.UserId,
                "OrganizationId": $scope.ExcelReportsObj.OrganizationId,
                "ParentOrganizationId": $scope.ExcelReportsObj.ParentOrganizationId,
                "ReportName": $scope.ExcelReportsObj.ReportName,
                "ReportId": $scope.ExcelReportsObj.ReportId,
                "StatusId": $scope.ExcelReportsObj.StatusId,
                "StatusName": $scope.ExcelReportsObj.StatusName,
                "IsManualExport": $scope.ExcelReportsObj.IsManualExport,
                "CSVFileName": $scope.ExcelReportsObj.CSVFileName,
                "CSVFileExt": $scope.ExcelReportsObj.CSVFileExt,
                "CSVFileUrl": $scope.ExcelReportsObj.CSVFileUrl,
                "ErrorMessage": $scope.ExcelReportsObj.ErrorMessage,
                "StartedOn": $scope.ExcelReportsObj.StartedOn,
                "CompletedOn": $scope.ExcelReportsObj.CompletedOn,
                "DeleteInd": $scope.ExcelReportsObj.DeleteInd,
                "RequestType": $scope.ExcelReportsObj.RequestType,
                "RequestDetails": {
                    "ParentOrganization": $scope.ParentHospitalId,
                    "OrganizationId": $scope.HospitalId,
                    "PaymentFromDate": "",
                    "PaymentToDate": "",
                    "AllLocationInd": LocationIds ? 0 : 1,
                    "LocationIds": LocationIds,
                    "AllBillingProviderInd": BillingProviderIds ? 0 : 1,
                    "BillingProviderIds": BillingProviderIds,
                    "AllRenderingProviderInd": RenderingProviderIds ? 0 : 1,
                    "RenderingProviderIds": RenderingProviderIds,
                    "AllPostingUsersInd": UserIds ? 0 : 1,
                    "UserIds": UserIds,
                    "AllMasterPayorsInd": AllMasterPayorsInd,
                    "MasterPayorIds": MasterPayorIds || null,
                    "AllProcedureInd": AllProcedureInd,
                    "ProcedureIds": ProcedureIds || null,
                    "AllReferralProviderInd": AllReferralProviderInd,
                    "ReferralProviderIds": PcpReferralIds || null,
                    "PaymentModeIds": PaymentModeIds || null,
                    "DOSStartDate": $scope.MainPobj.DOSFromDate,
                    "DOSEndDate": $scope.MainPobj.DOSToDate,
                    "ChkPostedToDate": $scope.MainPobj.ChkPostedToDate || "",
                    "ChkPostedFromDate": $scope.MainPobj.ChkPostedFromDate || "",
                    "CheckDate": $scope.MainPobj.CheckDate || "",                   
                    "CheckStartDate": $scope.MainPobj.CheckStartDate || "",
                    "CheckEndDate": $scope.MainPobj.CheckEndDate || "",
                    "ChkDateRangeId": $scope.MainPobj.ChkDateRangeId || "",
                    "ClaimStartDate": $scope.MainPobj.ClaimStartDate || "",
                    "ClaimEndDate": $scope.MainPobj.ClaimEndDate || "",
                    "IsProviderType": $scope.InsSubTab === 'RenderingProvider' ? 'RenderingProvider'
                        : $scope.InsSubTab === 'Payor' ? 'Payor': 'BillingProvider'
                }
                
         
            };

            eHnoteInsuranceService.InitiateAuditDetailedCSVData(obj).then(function (resp) {
                if (resp.data.status == "Success") {
                    alertify.success("Excel file exported successfully");
                    return false;
                } else {
                    alertify.error(resp.data.Message);
                }
            });


        }

        /* ═══════════════════════════════════════════════
           BOOT
        ═══════════════════════════════════════════════ */
        $scope.init();



        $scope.GetExcelDetailsObj = function () {
            let obj = {

                "UserId": $scope.UserId,
                "RequestedByUserId": null,
                "OrganizationId": $scope.HospitalId,
                "ParentOrganizationId": $scope.ParentHospitalId,
                "FromDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "ToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "PageSize": 100,
                "PageNumber": 1,
                "StatusId": null,
                "ReportId": null,
                "SelectUserStatusString": "All",
                "AllUserStatusCheck": true,
                "UserFullName": "",
                "AllUsersList": angular.copy($scope.MainPobj.AllUsersList) || [],
            };

            return obj;


        }

        $scope.ExcelDetailsObj = $scope.GetExcelDetailsObj();

        $scope.GetExportStatusList = function (activeMasterReportId) {

            let obj = {
                "OrganizationId": $scope.ExcelDetailsObj.OrganizationId,
                "RequestedByUserId": $scope.ExcelDetailsObj.RequestedByUserId,
                "FromDate": "",
                "ToDate": "",
                "PageSize": $scope.ExcelDetailsObj.PageSize,
                "PageNumber": $scope.ExcelDetailsObj.PageNumber,
                "StatusId": $scope.ExcelDetailsObj.StatusId,
                "ReportId": $scope.ExcelDetailsObj.ReportId,
            };

            eHnoteInsuranceService.GetReportExportJobsStatusList(obj).then(function (resp) {
                if (resp.data.status == "Success") {
                    let allReports = resp.data.rows || [];
                    $scope.ExportSummarylist = allReports.filter(function (item) {
                        return item.MasterReportId === activeMasterReportId;
                    });

                } else {
                    alertify.error(resp.data.Message);
                }
            });
        }
        $scope.excelExports = function () {
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/USBilling/uibpopups/excelExport.html",
                //"size": "lg",
                "backdrop": "static",
                "keyboard": false,
                "scope": $scope,
                "windowClass": "modal__seventy--",
                "controller": function ($scope, $uibModal, $uibModalInstance) {
                    $scope.ExcelReportsObj.ReportId = 15;
                    $scope.ExcelReportsObj.ReportName = "Audit Report";
                    $scope.activeMasterReportId = $scope.ExcelReportsObj.ReportId;
                    $scope.GetExportStatusList($scope.activeMasterReportId);
                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                }
            });
        };
    }


]);
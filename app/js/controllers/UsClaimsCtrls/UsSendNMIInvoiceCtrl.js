"use strict";
 
eHnoteWebApp.controller("UsSendNMIInvoiceCtrl", ["$scope", "$rootScope", "$filter", "alertify", "$uibModal", "datapersistanceFactory", "$q", "$timeout", "$uibModalInstance", "eHnoteMasterDataService", "eHnotePatientDataService", "eHnoteMainAppointmentService", "eHnoteLoginStatusService", "$location", "invoiceData",
    function ($scope, $rootScope, $filter, alertify, $uibModal, datapersistanceFactory, $q, $timeout, $uibModalInstance, eHnoteMasterDataService, eHnotePatientDataService, eHnoteMainAppointmentService, eHnoteLoginStatusService, $location, invoiceData) {




        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.ParenthospitalId = 0;
        $scope.HospitalId = 0;
        $scope.defaultBillingProviderId = 0;
        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
            $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
            $scope.UserFullName = doctorinfo.doctordata.User[0].SecondUserFullName;
            $scope.defaultBillingProviderId = doctorinfo.doctordata.UserAddress[0].DefaultBillingProviderId || 0;
        };

        var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();

        $scope.UserId = eHnoteMasterDataService.getLoginId();

        $scope.SourceType = invoiceData.SourceType || 'Claim';   // 'Claim' or 'POS'
        $scope.AllowEditLineItems = invoiceData.AllowEditLineItems !== false;  // default true
        $scope.IsSending = false;
        $scope.ValidationErrors = {};

        $scope.InvoiceObj = {
            // EMR context
            OrganizationId: invoiceData.OrganizationId,
            PatientId: invoiceData.PatientId,
            UserId: invoiceData.UserId,
            AppointmentId: invoiceData.AppointmentId || null,
            PatientClaimId: invoiceData.PatientClaimId || null,
            BillingProviderId: invoiceData.BillingProviderId || null,
            RenderingProviderId: invoiceData.RenderingProviderId || null,
            OrganizationFacilityId: invoiceData.OrganizationFacilityId || null,
            DepositTypeId: invoiceData.DepositTypeId || 1,

            // Patient snapshot
            PatientMrNo: invoiceData.PatientMrNo || '',
            PatientFirstName: invoiceData.PatientFirstName || '',
            PatientLastName: invoiceData.PatientLastName || '',
            PatientEmail: invoiceData.PatientEmail || '',
            PatientPhone: (invoiceData.PatientPhone || '').replace(/\D/g, ''),

            // Amounts
            InvoiceAmount: 0,
            SubTotalAmount: 0,
            TaxAmount: invoiceData.TaxAmount || 0,
            ShippingAmount: 0,
            DiscountAmount: invoiceData.DiscountAmount || 0,

            // Invoice config
            Currency: 'USD',
            PaymentTerms: 'upon_receipt',
            PaymentMethodsAllowed: ['cc'],
            OrderDescription: invoiceData.OrderDescription || '',
            OrderId: invoiceData.OrderId || '',
            PONumber: '',

            // Billing address — pull from patient if available
            BillingAddress1: invoiceData.BillingAddress1 || '',
            BillingAddress2: invoiceData.BillingAddress2 || '',
            BillingCity: invoiceData.BillingCity || '',
            BillingState: invoiceData.BillingState || '',
            BillingZip: invoiceData.BillingZip || '',
            BillingCountry: invoiceData.BillingCountry || 'US',

            // Line items
            LineItems: [],

            // Notes
            Notes: ''
        };

        // ── Initialize line items from caller's data ──────────────────────
        if (invoiceData.LineItems && invoiceData.LineItems.length > 0) {
            angular.forEach(invoiceData.LineItems, function (li, idx) {
                $scope.InvoiceObj.LineItems.push({
                    LineNumber: idx + 1,
                    ProductId: li.ProductId || 0,
                    ProductCode: li.ProductCode || li.CPTCode || '',
                    ProductDescription: li.ProductDescription || li.ServiceName || li.Description || '',
                    CommodityCode: li.CommodityCode || '',
                    UnitOfMeasure: li.UnitOfMeasure || 'EACH',
                    UnitCost: parseFloat(li.UnitCost || li.UnitCharge || 0),
                    Quantity: parseInt(li.Quantity || 1, 10),
                    TotalAmount: parseFloat(li.TotalAmount || li.TotalChargeAmount || 0),
                    TaxAmount: parseFloat(li.TaxAmount || 0),
                    TaxRate: parseFloat(li.TaxRate || 0),
                    DiscountAmount: parseFloat(li.DiscountAmount || 0),
                    DiscountRate: parseFloat(li.DiscountRate || 0),
                    CPTCode: li.CPTCode || li.ProcedureCode || '',
                    DiagnosisCode: li.DiagnosisCode || '',
                    PatientClaimLineItemId: li.PatientClaimLineItemId || null,
                    DeleteInd: 'N'
                });
            });
        }

        // ── Payment methods checkboxes — sync with PaymentMethodsAllowed ──
        $scope.PaymentMethods = {
            cc: true,
            ck: false,
            cs: false
        };

        $scope.UpdatePaymentMethods = function () {
            var methods = [];
            if ($scope.PaymentMethods.cc) methods.push('cc');
            if ($scope.PaymentMethods.ck) methods.push('ck');
            if ($scope.PaymentMethods.cs) methods.push('cs');
            $scope.InvoiceObj.PaymentMethodsAllowed = methods.length > 0 ? methods : ['cc'];
        };

        // ── Payment terms options ─────────────────────────────────────────
        $scope.PaymentTermsOptions = [
            { value: 'upon_receipt', label: 'Upon Receipt' },
            { value: '7', label: 'Net 7 Days' },
            { value: '15', label: 'Net 15 Days' },
            { value: '30', label: 'Net 30 Days' },
            { value: '60', label: 'Net 60 Days' }
        ];

        // ════════════════════════════════════════════════════════════════
        //  LINE ITEM MANAGEMENT
        // ════════════════════════════════════════════════════════════════
        $scope.AddCustomLineItem = function () {
            $scope.InvoiceObj.LineItems.push({
                LineNumber: $scope.InvoiceObj.LineItems.length + 1,
                ProductId: 0,
                ProductCode: '',
                ProductDescription: '',
                UnitCost: 0,
                Quantity: 1,
                TotalAmount: 0,
                TaxAmount: 0,
                DiscountAmount: 0,
                UnitOfMeasure: 'EACH',
                DeleteInd: 'N'
            });

            $scope.RecalculateInvoiceTotal();
        };

        $scope.RemoveLineItem = function (item, index) {
            $scope.InvoiceObj.LineItems.splice(index, 1);

            // Re-number remaining items
            angular.forEach($scope.InvoiceObj.LineItems, function (li, i) {
                li.LineNumber = i + 1;
            });

            $scope.RecalculateInvoiceTotal();
        };

        $scope.RecalculateLineItem = function (li) {
            var qty = parseInt(li.Quantity || 0, 10);
            var cost = parseFloat(li.UnitCost || 0);

            li.TotalAmount = parseFloat((qty * cost).toFixed(2));
            $scope.RecalculateInvoiceTotal();
        };

        $scope.RecalculateInvoiceTotal = function () {
            var subtotal = 0;

            angular.forEach($scope.InvoiceObj.LineItems, function (li) {
                if (li.DeleteInd !== 'Y') {
                    subtotal += parseFloat(li.TotalAmount || 0);
                }
            });

            $scope.InvoiceObj.SubTotalAmount = parseFloat(subtotal.toFixed(2));

            // Total = subtotal + tax - discount
            var total = subtotal
                + parseFloat($scope.InvoiceObj.TaxAmount || 0)
                - parseFloat($scope.InvoiceObj.DiscountAmount || 0);

            $scope.InvoiceObj.InvoiceAmount = parseFloat(total.toFixed(2));
        };

        // Trigger initial calculation
        $scope.RecalculateInvoiceTotal();

        // ════════════════════════════════════════════════════════════════
        //  VALIDATION
        // ════════════════════════════════════════════════════════════════
        $scope.ValidateInvoice = function () {
            $scope.ValidationErrors = {};

            // Email validation
            if (!$scope.InvoiceObj.PatientEmail || $scope.InvoiceObj.PatientEmail.trim() === '') {
                $scope.ValidationErrors.PatientEmail = 'Patient email is required';
                return false;
            }

            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test($scope.InvoiceObj.PatientEmail)) {
                $scope.ValidationErrors.PatientEmail = 'Please enter a valid email address';
                return false;
            }

            // Amount validation
            if (!$scope.InvoiceObj.InvoiceAmount || $scope.InvoiceObj.InvoiceAmount <= 0) {
                alertify.error('Invoice total must be greater than $0.00');
                return false;
            }

            // Line items validation
            var activeItems = $scope.InvoiceObj.LineItems.filter(function (li) {
                return li.DeleteInd !== 'Y';
            });

            if (activeItems.length === 0) {
                alertify.error('Please add at least one line item');
                return false;
            }

            for (var i = 0; i < activeItems.length; i++) {
                var li = activeItems[i];
                if (!li.ProductCode && !li.CPTCode) {
                    alertify.error('Line ' + (i + 1) + ': Product code is required');
                    return false;
                }
                if (!li.ProductDescription) {
                    alertify.error('Line ' + (i + 1) + ': Description is required');
                    return false;
                }
                if (parseFloat(li.UnitCost || 0) <= 0) {
                    alertify.error('Line ' + (i + 1) + ': Unit cost must be greater than 0');
                    return false;
                }
                if (parseInt(li.Quantity || 0, 10) <= 0) {
                    alertify.error('Line ' + (i + 1) + ': Quantity must be greater than 0');
                    return false;
                }
            }

            // Payment methods validation
            if (!$scope.InvoiceObj.PaymentMethodsAllowed || $scope.InvoiceObj.PaymentMethodsAllowed.length === 0) {
                alertify.error('Please select at least one allowed payment method');
                return false;
            }

            return true;
        };

        // ════════════════════════════════════════════════════════════════
        //  SEND INVOICE
        // ════════════════════════════════════════════════════════════════
        $scope.SendInvoice = function () {

            if (!$scope.ValidateInvoice()) {
                return;
            }

            $scope.IsSending = true;

            // Build clean payload — strip out UI-only fields
            var payload = angular.copy($scope.InvoiceObj);

            // Trim email
            payload.PatientEmail = payload.PatientEmail.trim();

            // Remove deleted line items
            payload.LineItems = payload.LineItems.filter(function (li) {
                return li.DeleteInd !== 'Y';
            });

            console.log('Send Invoice Request:', JSON.stringify(payload));

            eHnotePaymentGatewayService.CreateNMIInvoice(payload).then(function (resp) {

                $scope.IsSending = false;
                var res = resp.data || {};

                if (res.Status === 'Success' || res.status === 'Success') {
                    alertify.success('Invoice sent to ' + payload.PatientEmail);
                    $uibModalInstance.close({
                        Status: 'Success',
                        NMIInvoiceId: res.NMIInvoiceId,
                        InvoiceStatus: res.InvoiceStatus,
                        Amount: res.Amount,
                        Email: res.Email
                    });
                } else {
                    alertify.error(res.Message || 'Failed to send invoice');
                }
            }, function (err) {
                $scope.IsSending = false;
                console.error('Send Invoice error:', err);
                alertify.error('Failed to send invoice. Please try again.');
            });
        };

        // ════════════════════════════════════════════════════════════════
        //  CANCEL
        // ════════════════════════════════════════════════════════════════
        $scope.cancel = function () {
            if ($scope.IsSending) return;
            $uibModalInstance.dismiss('cancel');
        };
    }]);
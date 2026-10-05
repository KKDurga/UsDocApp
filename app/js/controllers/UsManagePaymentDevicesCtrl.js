"use strict";
/*  Admin -> NMI Settings.

    Two tabs live in here.

    Tab 1  NMI Merchants
        List of the merchant accounts with branch / status / text filters and an
        add-update section that opens above the list.
        Gateway credentials are never returned by the list endpoint, so they can
        only be captured while adding. On edit they show masked and disabled.

    Tab 2  NMI Payment Devices
        Same shape. Adding a device registers it with NMI first and the row is
        saved with whatever NMI answers, so the registration code and the merchant
        cannot be changed afterwards. Editing and activating / de-activating only
        touch the saved row.

    Endpoints
        GetOrganizationNMIMerchantAccounts  -> merchant list, and the merchants of
                                               the branch picked on the device form
        AddUpdateNMIMerchantAccount         -> merchant insert / update / status
        GetOrganizationPOIDeviceList        -> device list
        NMIRegisterDevice                   -> register with NMI + save
        AddUpdateNMIPOIDevice               -> save the device row only  */
eHnoteWebApp.controller("UsManagePaymentDevicesCtrl", ["$scope", "$filter", "alertify", "eHnoteMasterDataService", "eHnoteUserAppointmentDataService", "localStorageFactory", "eHnotePaymentGatewayService", function ($scope, $filter, alertify, eHnoteMasterDataService, eHnoteUserAppointmentDataService, localStorageFactory, eHnotePaymentGatewayService) {

    var ACTIVE = 1, INACTIVE = 2, FAILED = 3;

    var doctorinfo = eHnoteMasterDataService.getUserInfo();

    $scope.UserId = eHnoteMasterDataService.getLoginId();
    $scope.ParenthospitalId = 0;
    $scope.HospitalId = 0;

    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined) {
        $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
    }

    /*  ==================================================================
        Tabs
        ==================================================================  */
    $scope.NMIActiveTab = "Merchants";

    $scope.switchNMITab = function (tab) {
        $scope.NMIActiveTab = tab;

        if (tab === "Merchants" && $scope.MerchantList.length === 0) {
            $scope.GetMerchantList();
        }
        if (tab === "Devices" && $scope.DeviceList.length === 0) {
            $scope.GetDeviceList();
        }
    };

    /*  ==================================================================
        Shared response helpers

        The two NMI procs do not answer in the same shape. The device one sends
        back Status: 'Success', the merchant one sends back Success: 1, so every
        call is read through these instead of testing one field.
        ==================================================================  */
    function isSuccessResponse(data) {
        if (!data) { return false; }
        return data.Status === "Success" || data.Success === 1 || data.Success === true;
    }

    function getResponseMessage(data, fallback) {
        return (data && data.Message) ? data.Message : fallback;
    }

    /*  Several save columns are written straight through by the procs, with only a
        null being read as "leave the stored value alone". An absent field must
        therefore go across as null and never as an empty string.  */
    function keepStoredWhenMissing(value) {
        return (value === undefined || value === null) ? null : value;
    }

    /*  yyyy-MM-dd is the one layout SQL Server reads the same way whatever the
        server's DATEFORMAT is set to.  */
    function toSqlDate(value) {
        if (!value) { return null; }
        var parsed = angular.isDate(value) ? value : new Date(value);
        if (isNaN(parsed.getTime())) { return null; }
        return $filter("date")(parsed, "yyyy-MM-dd");
    }

    /*  ==================================================================
        Branch list shared by both tabs
        ==================================================================  */
    $scope.NMIBranchesList = [];   /*  includes the "All Branches" entry, used by the filters  */
    $scope.NMIBranchesOnly = [];   /*  real branches only, used by the add / edit forms  */

    function InitializeNMIBranches() {
        var data = localStorageFactory.getItem("allBranchesData") || [];
        var branches = eHnoteUserAppointmentDataService.RestructureNewBranches(true, data, doctorinfo) || [];

        var list = [];
        angular.forEach(branches, function (item) {
            if (item.BranchId !== undefined && item.BranchId !== null && item.BranchId !== 0) {
                list.push({
                    "BranchId": item.BranchId,
                    "BranchName": item.BranchName || item.ClinicName || "",
                    "SubOrganizationId": item.SubOrganizationId || 0
                });
            }
        });

        list = _.uniq(list, false, function (item) { return item.BranchId; });

        $scope.NMIBranchesOnly = angular.copy(list);

        list.unshift({ "BranchId": 0, "BranchName": "All Branches", "SubOrganizationId": 0 });
        $scope.NMIBranchesList = list;
    }
    InitializeNMIBranches();

    /*  Rows come back with an OrganizationId only, so the branch name is resolved here.  */
    $scope.getNMIBranchName = function (organizationId) {
        if (organizationId === undefined || organizationId === null) { return ""; }
        var match = $filter("filter")($scope.NMIBranchesOnly, { "BranchId": organizationId }, true) || [];
        return match.length > 0 ? match[0].BranchName : "";
    };

    /*  ==================================================================
        Tab 1 : NMI Merchants
        ==================================================================  */
    $scope.MaskedSecureValue = "••••••••••";

    $scope.MerchantStatusList = [
        { "StatusId": ACTIVE, "StatusName": "Active" },
        { "StatusId": INACTIVE, "StatusName": "InActive" }
    ];

    $scope.MerchantStatusFilterList = [
        { "Value": "", "Text": "All" },
        { "Value": "Active", "Text": "Active" },
        { "Value": "InActive", "Text": "InActive" }
    ];

    $scope.MerchantList = [];          /*  rows as returned by the server  */
    $scope.MerchantFilteredList = [];  /*  after the free text search  */
    $scope.MerchantPagedList = [];     /*  current page of MerchantFilteredList  */

    $scope.ShowMerchantForm = false;
    $scope.IsMerchantEditMode = false;
    $scope.IsSavingMerchant = false;

    function getDefaultMerchantSearchObj() {
        return {
            "BranchId": $scope.HospitalId || 0,
            "Status": "",
            "SearchText": "",
            "PageNumber": 1,
            "PageSize": 10
        };
    }
    $scope.MerchantSearchObj = getDefaultMerchantSearchObj();

    function getNewMerchantObj() {
        return {
            "NMIMerchantId": 0,
            "OrganizationId": $scope.HospitalId || "",
            "MerchantName": "",
            "MerchantGatewayId": "",
            "MerchentUsername": "",
            "MerchentPassword": "",
            "PrivateAPIKey": "",
            "PrivateV4APIKey": "",
            "WebhookSigningKey": "",
            "TokenizationKey": "",
            "PublicCheckOutKey": "",
            "WebhookUrl": "",
            "ProcessorId": "",
            "ProcessorName": "",
            "StatusId": ACTIVE,
            "StatusName": "Active"
        };
    }
    $scope.MerchantObj = getNewMerchantObj();

    /*  The merchant proc decides active off DeleteInd and hands it back as IsActive,
        StatusId is only carried alongside it. Read the flag, not the status.  */
    $scope.isMerchantActive = function (item) {
        if (!item) { return false; }
        if (item.IsActive !== undefined && item.IsActive !== null) {
            return item.IsActive === true || item.IsActive === 1;
        }
        return item.DeleteInd === false || item.DeleteInd === 0;
    };

    $scope.GetMerchantList = function () {
        var getAllIndicator = !$scope.MerchantSearchObj.BranchId;   /*  0 / "" means All Branches  */

        var params = {
            "OrganizationId": getAllIndicator ? null : $scope.MerchantSearchObj.BranchId,
            "ParentOrganizationId": $scope.ParenthospitalId,
            "GetAllIndicator": getAllIndicator,
            "IsActive": $scope.MerchantSearchObj.Status === "Active" ? true
                : $scope.MerchantSearchObj.Status === "InActive" ? false
                    : null
        };

        if (getAllIndicator && !params.ParentOrganizationId) {
            alertify.error("Parent organization could not be resolved for this user.");
            return;
        }

        eHnotePaymentGatewayService.GetOrganizationNMIMerchantAccounts(params).then(function (resp) {
            var data = resp.data || {};
            $scope.MerchantList = [];

            if (isSuccessResponse(data)) {
                $scope.MerchantList = data.rows || data.Rows || [];
            } else {
                alertify.error(getResponseMessage(data, "Unable to load the merchant accounts."));
            }

            $scope.ApplyMerchantSearchText();
        }, function (err) {
            console.log(err);
            alertify.error("Unable to load the merchant accounts.");
        });
    };

    /*  Free text search and paging are done on the client - the list endpoint
        takes no search or page parameters.  */
    $scope.ApplyMerchantSearchText = function () {
        var searchText = ($scope.MerchantSearchObj.SearchText || "").toLowerCase().trim();

        $scope.MerchantFilteredList = $filter("filter")($scope.MerchantList, function (item) {
            if (searchText === "") { return true; }
            return ((item.MerchantName || "").toLowerCase().indexOf(searchText) > -1)
                || ((item.MerchantGatewayId || "").toLowerCase().indexOf(searchText) > -1)
                || ((item.MerchentUsername || "").toLowerCase().indexOf(searchText) > -1)
                || ((item.ProcessorName || "").toLowerCase().indexOf(searchText) > -1);
        }) || [];

        var lastPage = Math.ceil($scope.MerchantFilteredList.length / $scope.MerchantSearchObj.PageSize) || 1;
        if ($scope.MerchantSearchObj.PageNumber > lastPage) {
            $scope.MerchantSearchObj.PageNumber = lastPage;
        }

        $scope.MerchantPageChanged();
    };

    $scope.MerchantPageChanged = function () {
        var start = ($scope.MerchantSearchObj.PageNumber - 1) * $scope.MerchantSearchObj.PageSize;
        $scope.MerchantPagedList = $scope.MerchantFilteredList.slice(start, start + $scope.MerchantSearchObj.PageSize);
    };

    $scope.ApplyMerchantFilters = function () {
        $scope.MerchantSearchObj.PageNumber = 1;
        $scope.GetMerchantList();
    };

    $scope.ClearMerchantFilters = function () {
        $scope.MerchantSearchObj = getDefaultMerchantSearchObj();
        $scope.GetMerchantList();
    };

    $scope.ShowAddMerchant = function () {
        $scope.MerchantObj = getNewMerchantObj();
        $scope.IsMerchantEditMode = false;
        $scope.ShowMerchantForm = true;
    };

    $scope.EditMerchant = function (item) {
        $scope.MerchantObj = getNewMerchantObj();

        $scope.MerchantObj.NMIMerchantId = item.NMIMerchantId || 0;
        $scope.MerchantObj.OrganizationId = item.OrganizationId || "";
        $scope.MerchantObj.MerchantName = item.MerchantName || "";
        $scope.MerchantObj.MerchantGatewayId = item.MerchantGatewayId || "";
        $scope.MerchantObj.MerchentUsername = item.MerchentUsername || "";
        $scope.MerchantObj.WebhookUrl = item.WebhookUrl || "";
        $scope.MerchantObj.ProcessorId = item.ProcessorId || "";
        $scope.MerchantObj.ProcessorName = item.ProcessorName || "";
        $scope.MerchantObj.StatusId = $scope.isMerchantActive(item) ? ACTIVE : INACTIVE;

        /*  The proc will not hand the credentials back, only whether each one is
            filled in, which is what the masked boxes are driven off.  */
        $scope.MerchantObj.HasPassword = (item.HasPassword === true || item.HasPassword === 1);
        $scope.MerchantObj.HasPrivateAPIKey = (item.HasPrivateAPIKey === true || item.HasPrivateAPIKey === 1);
        $scope.MerchantObj.HasPrivateV4APIKey = (item.HasPrivateV4APIKey === true || item.HasPrivateV4APIKey === 1);
        $scope.MerchantObj.HasWebhookSigningKey = (item.HasWebhookSigningKey === true || item.HasWebhookSigningKey === 1);

        /*  These two are not held back by the proc, so their presence is read off the
            value. They are carried on the object as well because the save proc writes
            them straight through - sending a blank would empty the stored value.  */
        $scope.MerchantObj.TokenizationKey = item.TokenizationKey;
        $scope.MerchantObj.PublicCheckOutKey = item.PublicCheckOutKey;
        $scope.MerchantObj.HasTokenizationKey = !!item.TokenizationKey;
        $scope.MerchantObj.HasPublicCheckOutKey = !!item.PublicCheckOutKey;

        $scope.IsMerchantEditMode = true;
        $scope.ShowMerchantForm = true;
    };

    $scope.CancelMerchantForm = function () {
        $scope.ShowMerchantForm = false;
        $scope.IsMerchantEditMode = false;
        $scope.MerchantObj = getNewMerchantObj();
    };

    /*  Clear wipes the entered values but keeps the section open.  */
    $scope.ClearMerchantForm = function () {
        var nmiMerchantId = $scope.MerchantObj.NMIMerchantId;
        var organizationId = $scope.MerchantObj.OrganizationId;

        $scope.MerchantObj = getNewMerchantObj();

        if ($scope.IsMerchantEditMode) {
            $scope.MerchantObj.NMIMerchantId = nmiMerchantId;
            $scope.MerchantObj.OrganizationId = organizationId;
        }
    };

    function validateMerchantObj() {
        if (!$scope.MerchantObj.OrganizationId) {
            alertify.error("Please select a branch.");
            return false;
        }
        if (!($scope.MerchantObj.MerchantName || "").trim()) {
            alertify.error("Please enter the merchant name.");
            return false;
        }
        if (!($scope.MerchantObj.MerchantGatewayId || "").trim()) {
            alertify.error("Please enter the merchant gateway id.");
            return false;
        }
        if (!($scope.MerchantObj.MerchentUsername || "").trim()) {
            alertify.error("Please enter the merchant username.");
            return false;
        }
        if (!$scope.IsMerchantEditMode && !($scope.MerchantObj.PrivateAPIKey || "").trim()) {
            alertify.error("Please enter the private API key.");
            return false;
        }
        return true;
    }

    function buildMerchantRequest(source, isEdit) {
        /*  DeleteInd is what the read proc reports back as IsActive, so the status
            picked on screen has to drive both or the row reads as unchanged.  */
        var isActive = (source.StatusId || ACTIVE) === ACTIVE;

        return {
            "NMIMerchantId": source.NMIMerchantId || 0,
            "OrganizationId": source.OrganizationId,
            "MerchantName": (source.MerchantName || "").trim(),
            "MerchantGatewayId": (source.MerchantGatewayId || "").trim(),
            "MerchentUsername": (source.MerchentUsername || "").trim(),

            /*  The proc keeps these when they arrive blank, which is how the masked
                boxes stay out of the way on an update.  */
            "MerchentPassword": isEdit ? "" : (source.MerchentPassword || ""),
            "PrivateAPIKey": isEdit ? "" : (source.PrivateAPIKey || ""),
            "PrivateV4APIKey": isEdit ? "" : (source.PrivateV4APIKey || ""),
            "WebhookSigningKey": isEdit ? "" : (source.WebhookSigningKey || ""),

            /*  These two are different - the proc writes them straight through, so a
                blank would empty the stored value. Send back what came off the row,
                or null when it is absent, which the proc reads as "leave it".  */
            "TokenizationKey": keepStoredWhenMissing(source.TokenizationKey),
            "PublicCheckOutKey": keepStoredWhenMissing(source.PublicCheckOutKey),

            "WebhookUrl": (source.WebhookUrl || "").trim(),
            "ProcessorId": (source.ProcessorId || "").trim(),
            "ProcessorName": (source.ProcessorName || "").trim(),
            "StatusId": isActive ? ACTIVE : INACTIVE,
            "StatusName": isActive ? "Active" : "InActive",
            "DeleteInd": !isActive,
            "UserId": $scope.UserId
        };
    }

    $scope.SaveMerchant = function () {
        if ($scope.IsSavingMerchant) { return; }
        if (!validateMerchantObj()) { return; }

        var isEdit = $scope.MerchantObj.NMIMerchantId > 0;
        var params = buildMerchantRequest($scope.MerchantObj, isEdit);

        $scope.IsSavingMerchant = true;
        eHnotePaymentGatewayService.AddUpdateNMIMerchantAccount(params).then(function (resp) {
            var data = resp.data || {};

            if (isSuccessResponse(data)) {
                alertify.success(isEdit ? "Merchant account updated successfully" : "Merchant account added successfully");
                $scope.CancelMerchantForm();
                $scope.GetMerchantList();
            } else {
                alertify.error(getResponseMessage(data, "Unable to save the merchant account."));
            }
        }, function (err) {
            console.log(err);
            alertify.error("Unable to save the merchant account.");
        }).finally(function () {
            $scope.IsSavingMerchant = false;
        });
    };

    $scope.ToggleMerchantStatus = function (item) {
        var makeActive = !$scope.isMerchantActive(item);
        var confirmText = makeActive
            ? "Activate the merchant account " + (item.MerchantName || "") + "?"
            : "De-activate the merchant account " + (item.MerchantName || "") + "? It will no longer be used for payments or device registration.";

        alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>" + confirmText + "</h4>", function () {
            var source = angular.copy(item);
            source.StatusId = makeActive ? ACTIVE : INACTIVE;

            /*  Always treated as an update, so the stored credentials are left alone.  */
            eHnotePaymentGatewayService.AddUpdateNMIMerchantAccount(buildMerchantRequest(source, true)).then(function (resp) {
                var data = resp.data || {};

                if (isSuccessResponse(data)) {
                    alertify.success(makeActive ? "Merchant account activated" : "Merchant account de-activated");
                } else {
                    alertify.error(getResponseMessage(data, "Unable to update the merchant status."));
                }
                $scope.GetMerchantList();
            }, function (err) {
                console.log(err);
                alertify.error("Unable to update the merchant status.");
                $scope.GetMerchantList();
            });
        }, function () {
            /*  re-draw so the checkbox snaps back to the stored value  */
            $scope.GetMerchantList();
        });
    };

    /*  Careful here - on this table DeleteInd is the same column the read proc
        reports as IsActive, so a deleted merchant reads back as InActive rather
        than disappearing, and the toggle can bring it back. Devices behave the way
        you would expect, their list proc filters deleted rows out.  */
    $scope.DeleteMerchant = function (item) {
        var confirmText = "Delete the merchant account " + (item.MerchantName || "") + "? "
            + "It will stop being used for payments and device registration, and will stay in this list as InActive.";

        alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>" + confirmText + "</h4>", function () {
            var source = angular.copy(item);
            source.StatusId = INACTIVE;

            var params = buildMerchantRequest(source, true);
            params.DeleteInd = true;

            eHnotePaymentGatewayService.AddUpdateNMIMerchantAccount(params).then(function (resp) {
                var data = resp.data || {};

                if (isSuccessResponse(data)) {
                    alertify.success("Merchant account deleted");
                } else {
                    alertify.error(getResponseMessage(data, "Unable to delete the merchant account."));
                }
                $scope.GetMerchantList();
            }, function (err) {
                console.log(err);
                alertify.error("Unable to delete the merchant account.");
                $scope.GetMerchantList();
            });
        }, function () {
            return;
        });
    };

    /*  ==================================================================
        Tab 2 : NMI Payment Devices
        ==================================================================  */
    $scope.DeviceStatusFilterList = [
        { "Value": "", "Text": "All" },
        { "Value": "Active", "Text": "Active" },
        { "Value": "InActive", "Text": "InActive" },
        { "Value": "Failed", "Text": "Failed" }
    ];

    $scope.DeviceList = [];
    $scope.DeviceFilteredList = [];
    $scope.DevicePagedList = [];

    $scope.BranchMerchantList = [];       /*  active merchants of the branch picked on the form  */
    $scope.IsLoadingBranchMerchants = false;

    $scope.ShowDeviceForm = false;
    $scope.IsDeviceEditMode = false;
    $scope.IsSavingDevice = false;

    function getDefaultDeviceSearchObj() {
        return {
            "BranchId": $scope.HospitalId || 0,
            "Status": "",
            "SearchText": "",
            "PageNumber": 1,
            "PageSize": 10
        };
    }
    $scope.DeviceSearchObj = getDefaultDeviceSearchObj();

    function getNewDeviceObj() {
        return {
            "NMIDeviceId": 0,
            "OrganizationId": $scope.HospitalId || "",
            "NMIMerchantId": "",
            "MerchantName": "",
            "PoiDeviceId": "",
            "RegistrationCode": "",
            "DeviceName": "",
            "DeviceNumber": "",
            "DeviceType": "",
            "RegistrationDate": null,
            "DeviceDescription": "",
            "IsDefault": "N",
            "IsDefaultCheckbox": false,
            "StatusId": ACTIVE
        };
    }
    $scope.DeviceObj = getNewDeviceObj();

    $scope.getDeviceStatusName = function (statusId) {
        return statusId === ACTIVE ? "Active" : statusId === FAILED ? "Failed" : "InActive";
    };

    /*  The list proc returns IsDefault as the raw column, so it arrives as 0 / 1 or
        true / false, while the save request has always carried Y / N.  */
    $scope.isDeviceDefault = function (item) {
        var value = item ? item.IsDefault : null;
        return value === true || value === 1 || value === "1" || value === "Y" || value === "y";
    };

    /*  Proc_GetOrganizationPOIDeviceList works out the parent organization from the
        OrganizationId it is handed and then returns the devices of every branch
        under that parent, so a branch id must always go across - a null one comes
        back empty. Narrowing to one branch is done below, on OrganizationId.  */
    $scope.GetDeviceList = function () {
        var params = {
            "OrganizationId": $scope.DeviceSearchObj.BranchId || $scope.HospitalId || $scope.ParenthospitalId,
            "StatusId": 0
        };

        if (!params.OrganizationId) {
            alertify.error("Branch could not be resolved for this user.");
            return;
        }

        eHnotePaymentGatewayService.GetOrganizationPOIDeviceList(params).then(function (resp) {
            var data = resp.data || {};
            $scope.DeviceList = [];

            if (isSuccessResponse(data)) {
                $scope.DeviceList = data.rows || data.Rows || [];
            } else {
                alertify.error(getResponseMessage(data, "Unable to load the payment devices."));
            }

            $scope.ApplyDeviceSearchText();
        }, function (err) {
            console.log(err);
            alertify.error("Unable to load the payment devices.");
        });
    };

    /*  Branch, status and free text are all applied here - the endpoint hands back
        the whole organization every time.  */
    $scope.ApplyDeviceSearchText = function () {
        var searchText = ($scope.DeviceSearchObj.SearchText || "").toLowerCase().trim();
        var status = $scope.DeviceSearchObj.Status;
        var branchId = $scope.DeviceSearchObj.BranchId;

        $scope.DeviceFilteredList = $filter("filter")($scope.DeviceList, function (item) {
            if (branchId && item.OrganizationId !== branchId) { return false; }

            if (status !== "" && $scope.getDeviceStatusName(item.StatusId) !== status) { return false; }

            if (searchText === "") { return true; }
            return ((item.DeviceName || "").toLowerCase().indexOf(searchText) > -1)
                || ((item.DeviceNumber || "").toLowerCase().indexOf(searchText) > -1)
                || ((item.DeviceType || "").toLowerCase().indexOf(searchText) > -1)
                || ((item.MerchantName || "").toLowerCase().indexOf(searchText) > -1);
        }) || [];

        var lastPage = Math.ceil($scope.DeviceFilteredList.length / $scope.DeviceSearchObj.PageSize) || 1;
        if ($scope.DeviceSearchObj.PageNumber > lastPage) {
            $scope.DeviceSearchObj.PageNumber = lastPage;
        }

        $scope.DevicePageChanged();
    };

    $scope.DevicePageChanged = function () {
        var start = ($scope.DeviceSearchObj.PageNumber - 1) * $scope.DeviceSearchObj.PageSize;
        $scope.DevicePagedList = $scope.DeviceFilteredList.slice(start, start + $scope.DeviceSearchObj.PageSize);
    };

    $scope.ApplyDeviceFilters = function () {
        $scope.DeviceSearchObj.PageNumber = 1;
        $scope.GetDeviceList();
    };

    $scope.ClearDeviceFilters = function () {
        $scope.DeviceSearchObj = getDefaultDeviceSearchObj();
        $scope.GetDeviceList();
    };

    /*  Branch drives which merchants can be picked, the same way the rest of the
        admin screens drive their dependent dropdowns.  */
    $scope.onDeviceBranchSelect = function () {
        $scope.DeviceObj.NMIMerchantId = "";
        $scope.DeviceObj.MerchantName = "";
        $scope.BranchMerchantList = [];

        if (!$scope.DeviceObj.OrganizationId) { return; }

        var params = {
            "OrganizationId": $scope.DeviceObj.OrganizationId,
            "ParentOrganizationId": $scope.ParenthospitalId,
            "GetAllIndicator": false,
            "IsActive": true
        };

        $scope.IsLoadingBranchMerchants = true;
        eHnotePaymentGatewayService.GetOrganizationNMIMerchantAccounts(params).then(function (resp) {
            var data = resp.data || {};

            if (isSuccessResponse(data)) {
                $scope.BranchMerchantList = data.rows || data.Rows || [];
            } else {
                alertify.error(getResponseMessage(data, "Unable to load the merchant accounts for this branch."));
            }

            if ($scope.BranchMerchantList.length === 0) {
                alertify.error("This branch has no active merchant account. Add one on the NMI Merchants tab first.");
            } else if ($scope.BranchMerchantList.length === 1) {
                $scope.DeviceObj.NMIMerchantId = $scope.BranchMerchantList[0].NMIMerchantId;
                $scope.onDeviceMerchantSelect();
            }
        }, function (err) {
            console.log(err);
            alertify.error("Unable to load the merchant accounts for this branch.");
        }).finally(function () {
            $scope.IsLoadingBranchMerchants = false;
        });
    };

    $scope.onDeviceMerchantSelect = function () {
        var match = $filter("filter")($scope.BranchMerchantList, { "NMIMerchantId": $scope.DeviceObj.NMIMerchantId }, true) || [];
        $scope.DeviceObj.MerchantName = match.length > 0 ? (match[0].MerchantName || "") : "";
    };

    $scope.ShowAddDevice = function () {
        $scope.DeviceObj = getNewDeviceObj();
        $scope.BranchMerchantList = [];
        $scope.IsDeviceEditMode = false;
        $scope.ShowDeviceForm = true;

        if ($scope.DeviceObj.OrganizationId) {
            $scope.onDeviceBranchSelect();
        }
    };

    $scope.EditDevice = function (item) {
        $scope.DeviceObj = getNewDeviceObj();

        $scope.DeviceObj.NMIDeviceId = item.NMIDeviceId || 0;
        $scope.DeviceObj.OrganizationId = item.OrganizationId || "";
        $scope.DeviceObj.NMIMerchantId = item.NMIMerchantId || "";
        $scope.DeviceObj.MerchantName = item.MerchantName || "";
        $scope.DeviceObj.PoiDeviceId = item.PoiDeviceId || "";
        $scope.DeviceObj.RegistrationCode = item.RegistrationCode || "";
        $scope.DeviceObj.DeviceName = item.DeviceName || "";
        $scope.DeviceObj.DeviceNumber = item.DeviceNumber || "";
        $scope.DeviceObj.DeviceType = item.DeviceType || "";
        $scope.DeviceObj.RegistrationDate = item.RegistrationDate ? $filter("date")(item.RegistrationDate, "MM-dd-yyyy") : null;
        $scope.DeviceObj.DeviceDescription = item.DeviceDescription || "";
        $scope.DeviceObj.IsDefaultCheckbox = $scope.isDeviceDefault(item);
        $scope.DeviceObj.IsDefault = $scope.DeviceObj.IsDefaultCheckbox ? "Y" : "N";
        $scope.DeviceObj.StatusId = item.StatusId || ACTIVE;

        /*  Carried only so the save can hand them straight back - the update rewrites
            every column and keeps nothing behind.
            DeviceMake, DeviceModel and LastTransactionDate are in the table but are
            NOT in the list endpoint's select, so they arrive undefined here and the
            save blanks them. Adding those three columns to the select is what fixes
            it, this passes them through as soon as they are there.  */
        $scope.DeviceObj.ErrorCode = item.ErrorCode;
        $scope.DeviceObj.ErrorDescription = item.ErrorDescription;
        $scope.DeviceObj.DeRegistrationDate = item.DeRegistrationDate;
        $scope.DeviceObj.DeviceMake = item.DeviceMake;
        $scope.DeviceObj.DeviceModel = item.DeviceModel;
        $scope.DeviceObj.LastTransactionDate = item.LastTransactionDate;

        $scope.BranchMerchantList = [];
        $scope.IsDeviceEditMode = true;
        $scope.ShowDeviceForm = true;
    };

    $scope.CancelDeviceForm = function () {
        $scope.ShowDeviceForm = false;
        $scope.IsDeviceEditMode = false;
        $scope.BranchMerchantList = [];
        $scope.DeviceObj = getNewDeviceObj();
    };

    /*  Clear wipes the entered values but keeps the section open. On edit the
        branch, merchant and registration code are fixed, so they stay put.  */
    $scope.ClearDeviceForm = function () {
        if ($scope.IsDeviceEditMode) {
            $scope.DeviceObj.DeviceName = "";
            $scope.DeviceObj.DeviceNumber = "";
            $scope.DeviceObj.DeviceType = "";
            $scope.DeviceObj.RegistrationDate = null;
            $scope.DeviceObj.DeviceDescription = "";
            $scope.DeviceObj.IsDefault = "N";
            $scope.DeviceObj.IsDefaultCheckbox = false;
            return;
        }

        var organizationId = $scope.DeviceObj.OrganizationId;
        $scope.DeviceObj = getNewDeviceObj();
        $scope.DeviceObj.OrganizationId = organizationId;
        $scope.onDeviceBranchSelect();
    };

    $scope.toggleDefaultIndicator = function () {
        $scope.DeviceObj.IsDefault = $scope.DeviceObj.IsDefaultCheckbox ? "Y" : "N";
    };

    function validateDeviceObj() {
        if (!$scope.DeviceObj.OrganizationId) {
            alertify.error("Please select a branch.");
            return false;
        }
        if (!$scope.IsDeviceEditMode) {
            if (!$scope.DeviceObj.NMIMerchantId) {
                alertify.error("Please select a merchant account.");
                return false;
            }
            if (!($scope.DeviceObj.RegistrationCode || "").trim()) {
                alertify.error("Please enter the registration code shown on the device.");
                return false;
            }
        }
        if (!($scope.DeviceObj.DeviceName || "").trim()) {
            alertify.error("Please enter the device name.");
            return false;
        }
        return true;
    }

    function buildDeviceRequest(source) {
        var statusId = source.StatusId || ACTIVE;

        return {
            "UserId": $scope.UserId,
            "OrganizationId": source.OrganizationId,
            "NMIDeviceId": source.NMIDeviceId || 0,
            "NMIMerchantId": source.NMIMerchantId || 0,
            "MerchantName": source.MerchantName || "",
            "PoiDeviceId": source.PoiDeviceId || "",
            "RegistrationCode": (source.RegistrationCode || "").trim(),

            /*  DeviceNickname is what NMI stores against the device, keep it the
                same as the name shown here.  */
            "DeviceName": (source.DeviceName || "").trim(),
            "DeviceNickname": (source.DeviceName || "").trim(),

            /*  Sent as yyyy-MM-dd so the proc's conversion into a DATETIME cannot be
                read the wrong way round by the server's date format.  */
            "RegistrationDate": toSqlDate(source.RegistrationDate),
            "DeRegistrationDate": keepStoredWhenMissing(source.DeRegistrationDate),

            "DeviceNumber": (source.DeviceNumber || "").trim(),
            "DeviceType": (source.DeviceType || "").trim(),
            "DeviceDescription": (source.DeviceDescription || "").trim(),

            /*  The proc reads these two as the literal 'Y', anything else is 0.  */
            "IsDefault": $scope.isDeviceDefault(source) ? "Y" : "N",
            "DeleteInd": "N",

            "StatusId": statusId,
            "StatusName": $scope.getDeviceStatusName(statusId),

            /*  The update overwrites every column from the request, nothing is kept
                behind, so anything already on the row has to be handed back or it is
                lost. See the note in EditDevice about the three columns the list
                endpoint does not return.  */
            "ErrorCode": keepStoredWhenMissing(source.ErrorCode),
            "ErrorDescription": keepStoredWhenMissing(source.ErrorDescription),
            "DeviceMake": keepStoredWhenMissing(source.DeviceMake),
            "DeviceModel": keepStoredWhenMissing(source.DeviceModel),
            "LastTransactionDate": keepStoredWhenMissing(source.LastTransactionDate)
        };
    }

    $scope.SaveDevice = function () {
        if ($scope.IsSavingDevice) { return; }
        if (!validateDeviceObj()) { return; }

        var isEdit = $scope.IsDeviceEditMode;
        var params = buildDeviceRequest($scope.DeviceObj);

        /*  Add goes out to NMI first, edit only rewrites the saved row.  */
        var request = isEdit
            ? eHnotePaymentGatewayService.AddUpdateNMIPOIDevice(params)
            : eHnotePaymentGatewayService.NMIRegisterDevice(params);

        $scope.IsSavingDevice = true;
        request.then(function (resp) {
            var data = resp.data || {};

            if (isSuccessResponse(data)) {
                alertify.success(isEdit ? "Device updated successfully" : "Device registered successfully");
                $scope.CancelDeviceForm();
                $scope.GetDeviceList();
            } else {
                /*  A failed registration is still written away with the NMI error on it.  */
                alertify.error(data.ErrorDescription || data.Error || getResponseMessage(data, "Unable to save the device."));
                if (!isEdit) { $scope.GetDeviceList(); }
            }
        }, function (err) {
            console.log(err);
            alertify.error(isEdit ? "Unable to save the device." : "Unable to register the device with NMI.");
        }).finally(function () {
            $scope.IsSavingDevice = false;
        });
    };

    $scope.ToggleDeviceStatus = function (item) {
        var makeActive = item.StatusId !== ACTIVE;
        var deviceLabel = item.DeviceName || item.DeviceNumber || "this device";
        var confirmText = makeActive
            ? "Activate " + deviceLabel + "?"
            : "De-activate " + deviceLabel + "? It will no longer be offered when taking a payment.";

        alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>" + confirmText + "</h4>", function () {
            var source = angular.copy(item);
            source.StatusId = makeActive ? ACTIVE : INACTIVE;

            eHnotePaymentGatewayService.AddUpdateNMIPOIDevice(buildDeviceRequest(source)).then(function (resp) {
                var data = resp.data || {};

                if (isSuccessResponse(data)) {
                    alertify.success(makeActive ? "Device activated" : "Device de-activated");
                } else {
                    alertify.error(getResponseMessage(data, "Unable to update the device status."));
                }
                $scope.GetDeviceList();
            }, function (err) {
                console.log(err);
                alertify.error("Unable to update the device status.");
                $scope.GetDeviceList();
            });
        }, function () {
            /*  re-draw so the checkbox snaps back to the stored value  */
            $scope.GetDeviceList();
        });
    };

    /*  The device list proc only returns rows with deleteind = 0, so this really
        does take the device off the screen.  */
    $scope.DeleteDevice = function (item) {
        var deviceLabel = item.DeviceName || item.DeviceNumber || "this device";
        var confirmText = "Delete " + deviceLabel + "? It will be removed from this list and can no longer take payments.";

        alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>" + confirmText + "</h4>", function () {
            var source = angular.copy(item);
            source.StatusId = INACTIVE;

            var params = buildDeviceRequest(source);
            params.DeleteInd = "Y";

            eHnotePaymentGatewayService.AddUpdateNMIPOIDevice(params).then(function (resp) {
                var data = resp.data || {};

                if (isSuccessResponse(data)) {
                    alertify.success("Device deleted");
                } else {
                    alertify.error(getResponseMessage(data, "Unable to delete the device."));
                }
                $scope.GetDeviceList();
            }, function (err) {
                console.log(err);
                alertify.error("Unable to delete the device.");
                $scope.GetDeviceList();
            });
        }, function () {
            return;
        });
    };

    /*  Merchants is the tab that opens first.  */
    $scope.GetMerchantList();

}]);

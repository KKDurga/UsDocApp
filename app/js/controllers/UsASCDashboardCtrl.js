"use strict";
eHnoteWebApp.controller("UsASCDashboardCtrl", ["$scope", "$rootScope", "$location", "$filter", "eHnoteLoginStatusService", "eHnoteMasterDataService", "eHnotePatientDataService", "alertify", "eHnoteCacheStorageService", "eHnoteUserAppointmentDataService", "eHnoteAuditServices", "Lightbox", "$timeout", "$uibModal", "localStorageFactory", "eHnoteMainAppointmentService", "eHnoteUserDataService", "eHnoteSurgeryService", "$q", "eHnotePatientVisitReasonServices", "eHnoteSettingsDataService", "eHnoteInsuranceService", function ($scope, $rootScope, $location, $filter, eHnoteLoginStatusService, eHnoteMasterDataService, eHnotePatientDataService, alertify, eHnoteCacheStorageService, eHnoteUserAppointmentDataService, eHnoteAuditServices, Lightbox, $timeout, $uibModal, localStorageFactory, eHnoteMainAppointmentService, eHnoteUserDataService, eHnoteSurgeryService, $q, eHnotePatientVisitReasonServices, eHnoteSettingsDataService, eHnoteInsuranceService) {
    var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
    var doctorInfo = eHnoteMasterDataService.getUserInfo();
    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorageStructure();
    var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
    $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();

    $scope.RoleId = userLoginDetails.RoleID;
    $scope.HospitalID = 0;
    $scope.ParentHospitalID = 0;
    $scope.AllUserBranchesList = [];
    $scope.BranchDoctorsList = [];
    $scope.patientsList = [];
    $scope.patientListIndex = 0;
    $scope.patientAuditDataArray = [];
    $scope.selectedpatientId = 0;
    $scope.selectedpatientName = "";
    $scope.DoctorID = doctorInfo.doctordata.User[0].DoctorID;
    var BrachesList = [];
    var doctorInfo = eHnoteMasterDataService.getUserInfo();
    $scope.UserId = eHnoteMasterDataService.getLoginId();
    $scope.SpecializationId = doctorInfo.doctordata.User[0].SpecializationId;
    if (doctorInfo.doctordata.UserAddress !== undefined && doctorInfo.doctordata.UserAddress[0].ExtDetails !== undefined && doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID !== undefined) {
        $scope.HospitalID = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        $scope.ParentHospitalID = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
    }

    var DashboardDefaultBusinessDays = 15;
    var dashboardRequestToken = 0;

    $scope.DashboardSummaryCards = [];

    $scope.stopClosingDropDown = function (event) {
        event.stopPropagation();
    };



    function addBusinessDays(date, days) {
        let result = moment(date);
        let added = 0;
        while (added < days) {
            result.add(1, "days");
            if (result.day() !== 0 && result.day() !== 6) {
                added++;
            }
        }
        return result;
    }

    /* PayorObj and ServiceObj hold the typeahead text; the picked items live in the lists. */
    function getDashboardFilter() {
        return {
            "FromDate": moment().format("MM-DD-YYYY"),
            "ToDate": addBusinessDays(moment(), DashboardDefaultBusinessDays).format("MM-DD-YYYY"),
            "PayorObj": "",
            "ServiceObj": "",
            "AllPayorList": [],
            "AllProcedureList": []
        };
    }

    /* A multi select dropdown: every item starts checked, which means "All". */
    function getFilterGroup(title, list) {
        let group = { "Title": title, "List": list || [], "AllCheck": true, "SearchText": "", "SelectedText": "All" };
        $scope.checkAllDashboardItems(group);
        return group;
    }

    function updateSelectedText(group) {
        let checkedArray = _.where(group.List, { isChecked: true });
        group.AllCheck = checkedArray.length === group.List.length;
        if (group.AllCheck) {
            group.SelectedText = "All";
        } else if (checkedArray.length === 1) {
            group.SelectedText = checkedArray[0].DisplayName;
        } else if (checkedArray.length > 1) {
            group.SelectedText = checkedArray.length + " Selected";
        } else {
            group.SelectedText = "Select " + group.Title;
        }
    }

    $scope.checkAllDashboardItems = function (group) {
        angular.forEach(group.List, function (item) {
            item.isChecked = group.AllCheck;
        });
        updateSelectedText(group);
    };

    $scope.toggleDashboardItem = function (group) {
        updateSelectedText(group);
    };

    /* Proc_GetAScDashBoard has no "all" flag for locations or doctors, so "All" still sends every id. */
    function getCheckedIds(group, key) {
        return _.pluck(_.where(group.List, { isChecked: true }), key).join(",");
    }

    /* The branches come from UsASCParentCtrl, which loads them from local storage before this tab renders. */
    function getDashboardLocations() {
        let branches = ($scope.mainAscParentObj && $scope.mainAscParentObj.AllBranchesList) || [];
        return branches.filter(function (item) { return item.ClinicId !== 0; }).map(function (item) {
            return { "ClinicId": item.ClinicId, "BranchId": item.BranchId, "DisplayName": item.BranchName || item.ClinicName };
        });
    }

    /* With no branches loaded the proc still gets the logged in hospital. */
    function getLocationIds() {
        return getCheckedIds($scope.DashboardLocations, "ClinicId") || String($scope.HospitalID);
    }

    function getDashboardDoctors(users) {
        let doctors = (users || []).filter(function (item) { return item.RoleId === 1 || item.RoleId === 43; });
        doctors = _.uniq(doctors, false, function (item) { return item.DoctorID; });
        return doctors.map(function (item) {
            return { "DoctorID": item.DoctorID, "DisplayName": item.SecondUserFullName + (item.NPI ? " - " + item.NPI : "") };
        });
    }

    var subSpecializationIdsPromise = null;
    var doctorRequestToken = 0;

    /* The sub specializations don't change with the location, so they load once. */
    function getSubSpecializationIds() {
        if (!subSpecializationIdsPromise) {
            subSpecializationIdsPromise = eHnoteMainAppointmentService.getBranchSubSpecializationsById(doctorInfo.doctordata.UserAddress[0].SubOrganizationId, $scope.HospitalID).then(function (resp) {
                return _.pluck((resp.data && resp.data.row) || [], "SubSpecializationId").join(",");
            }, function (err) {
                subSpecializationIdsPromise = null;
                return $q.reject(err);
            });
        }
        return subSpecializationIdsPromise;
    }

    /* Loads the doctors of the checked locations, the same way the ASC list does. allUserList in local storage
       can't be used: it is only written once the ASC list loads, and only for one branch.
       Resolves once the doctors are in, even when loading them failed. */
    function loadDashboardDoctors() {
        let branchIds = getCheckedIds($scope.DashboardLocations, "BranchId");
        let requestToken = ++doctorRequestToken;

        if (!branchIds && $scope.DashboardLocations.List.length > 0) {
            $scope.DashboardDoctors = getFilterGroup("Doctor", []);
            return $q.when();
        }

        return getSubSpecializationIds().then(function (subSpecializationIds) {
            if (requestToken !== doctorRequestToken) {
                return;
            }
            if (!subSpecializationIds) {
                alertify.error("No Users are been added");
                return;
            }
            let reqObj = {
                "BranchId": branchIds || String($scope.HospitalID),
                "SubSpecializationIdArray": subSpecializationIds
            };
            let deferred = $q.defer();
            eHnoteMainAppointmentService.getAllUsersByDepartmentId(reqObj, function (data) {
                /* A newer location change already asked for other doctors. */
                if (requestToken === doctorRequestToken) {
                    $scope.DashboardDoctors = getFilterGroup("Doctor", getDashboardDoctors(data && data.rows));
                }
                deferred.resolve();
            }, function (err) {
                console.log(err);
                alertify.error("Getting Doctors Failed");
                deferred.resolve();
            });
            return deferred.promise;
        }, function (err) {
            console.log(err);
            alertify.error("Getting Doctors Failed");
        });
    }

    /* Changing the locations reloads the doctors of the checked branches. */
    $scope.checkAllDashboardLocations = function () {
        $scope.checkAllDashboardItems($scope.DashboardLocations);
        loadDashboardDoctors();
    };

    $scope.toggleDashboardLocation = function () {
        $scope.toggleDashboardItem($scope.DashboardLocations);
        loadDashboardDoctors();
    };

    /* More Filter popover: payer and procedure are typeahead searches that add to a list. */
    $scope.payerFilterPopover = {
        templateUrl: 'payerFilterPopover.html',
    };
    $scope.isPopoverOpen = false;
    $scope.togglePopover = function () {
        $scope.isPopoverOpen = !$scope.isPopoverOpen;
    };
    $scope.closeFilterPopover = function () {
        angular.element(document.querySelector('.popover')).remove();
        $scope.isPopoverOpen = false;
    };

    $scope.GetDashboardPayors = function (val) {
        let params = {
            "SearchText": val || "",
            "Status": "Active",
            "PageSize": 10,
            "PageNumber": 1,
            "UserId": $scope.UserId,
            "SpecializationId": $scope.SpecializationId,
            "OrganizationId": $scope.HospitalID,
            "ParentOrganizationId": $scope.ParentHospitalID,
            "GetAllIndicator": 0,
            "PayorId": 0,
            "PayorTypeId": 0
        };
        return eHnoteInsuranceService.GetOrganizationInsurancePayorsList(params).then(function (resp) {
            return (resp.data && resp.data.rows) || [];
        }, function (err) {
            console.log(err);
            return [];
        });
    };

    /* An empty search returns the frequently used procedures. */
    $scope.GetDashboardProcedures = function (text) {
        let params = {
            "OrganizationId": $scope.HospitalID,
            "ProcedureId": 0,
            "CPTCODE": "",
            "SearchText": text || "",
            "TypeOfServiceId": 0,
            "PageNumber": 1,
            "PageSize": 10,
            "Status": 1,
            "IsFrequent": text ? "N" : "Y",
            "ParentOrganizationId": $scope.ParentHospitalID || null
        };
        return eHnoteSettingsDataService.GetOrganizationProceduresSearchEngine(params).then(function (resp) {
            let rows = (resp.data && resp.data.rows) || [];
            return rows.filter(function (item) { return item.IsActive == true; });
        }, function (err) {
            console.log(err);
            return [];
        });
    };

    $scope.onSelectDashboardPayor = function (item) {
        $scope.DashboardFilter.PayorObj = "";
        if (_.findWhere($scope.DashboardFilter.AllPayorList, { "PayorId": item.OrganizationPayorId })) {
            alertify.error("Payer is already selected");
            return;
        }
        $scope.DashboardFilter.AllPayorList.push({ "PayorId": item.OrganizationPayorId, "PayorName": item.OrganizationPayorName });
    };

    $scope.onSelectDashboardProcedure = function (item) {
        $scope.DashboardFilter.ServiceObj = "";
        if (_.findWhere($scope.DashboardFilter.AllProcedureList, { "ProcedureId": item.ProcedureId })) {
            alertify.error("Procedure is already selected");
            return;
        }
        $scope.DashboardFilter.AllProcedureList.push({ "ProcedureId": item.ProcedureId, "ProcedureCode": item.ProcedureCode, "ProcedureName": item.ProcedureName });
    };

    $scope.DeleteDashboardPayor = function (index) {
        $scope.DashboardFilter.AllPayorList.splice(index, 1);
    };

    $scope.DeleteDashboardProcedure = function (index) {
        $scope.DashboardFilter.AllProcedureList.splice(index, 1);
    };

    $scope.ClearAllDashboardPayors = function () {
        $scope.DashboardFilter.AllPayorList = [];
    };

    $scope.ClearAllDashboardProcedures = function () {
        $scope.DashboardFilter.AllProcedureList = [];
    };

    $scope.ResetMoreFilters = function () {
        $scope.DashboardFilter.PayorObj = "";
        $scope.DashboardFilter.ServiceObj = "";
        $scope.DashboardFilter.AllPayorList = [];
        $scope.DashboardFilter.AllProcedureList = [];
    };

    $scope.ApplyMoreFilters = function () {
        $scope.closeFilterPopover();
        $scope.ApplyASCDashboardFilters();
    };


    $scope.Summryobj = {
        "ASCAppointments": 0,
        "PreAdmissionAppointments": 0,
        "LaserAppointments": 0
    }

    /* The summary and the details send the same filters. Returns null when a filter is invalid. */
    function getDashboardParams() {
        let fromDate = moment($scope.DashboardFilter.FromDate, "MM-DD-YYYY");
        let toDate = moment($scope.DashboardFilter.ToDate, "MM-DD-YYYY");

        if (!fromDate.isValid() || !toDate.isValid()) {
            alertify.error("Please select From and To dates");
            return null;
        }
        let unselectedGroup = _.find([$scope.DashboardLocations, $scope.DashboardDoctors], function (group) {
            return group.List.length > 0 && !_.findWhere(group.List, { isChecked: true });
        });
        if (unselectedGroup) {
            alertify.error("Please select at least one " + unselectedGroup.Title);
            return null;
        }

        let payorIds = _.pluck($scope.DashboardFilter.AllPayorList, "PayorId").join(",");
        let procedureIds = _.pluck($scope.DashboardFilter.AllProcedureList, "ProcedureId").join(",");

        /* The request shape Proc_GetAScDashBoard reads. An Ind flag of 1 with null ids means every payer or procedure.
           "TotDate" is the proc's own key name. */
        let details = $scope.DashboardDetails;
        return {
            "ParentOrganization": $scope.ParentHospitalID,
            "AllLocationInd": 0,
            "LocationIds": getLocationIds(),
            "DoctorIds": getCheckedIds($scope.DashboardDoctors, "DoctorID"),
            "AllMasterPayorsInd": payorIds ? 0 : 1,
            "MasterPayorIds": payorIds || null,
            "AllProcedureInd": procedureIds ? 0 : 1,
            "ProcedureIds": procedureIds || null,
            "FromDate": fromDate.format("YYYY-MM-DD"),
            "TotDate": toDate.format("YYYY-MM-DD"),
            "LocationName": getDashboardLocationNames(),
            "PageSize": 100,
            "PageNumber": 1,
            "BandTitle": details.BandTitle,
            "View": details.View,
            "Metrics": details.Metrics.map(function (metric) {
                return { "Key": metric.Key, "Label": metric.Label, "Tone": metric.Tone, "Bold": !!metric.Bold };
            }),
        };
    }

    $scope.GetASCDashboardSummary = function () {
        let params = getDashboardParams();
        if (!params) {
            return;
        }

        let requestToken = ++dashboardRequestToken;
        $scope.DashboardSummaryCards = [];

        eHnoteSurgeryService.GetASCDashboardSummary(params).then(function (resp) {
            if (resp.data.Status === "Success") {
                $scope.Summryobj.ASCAppointments = resp.data.ASCAppointments || 0;
                $scope.Summryobj.PreAdmissionAppointments = resp.data.PreAdmissionAppointments || 0;
                $scope.Summryobj.LaserAppointments = resp.data.LaserAppointments || 0;
            }
        }, function (err) {
            console.log(err);

        });
    };

    /* View Details on a card. The id is the AppointmentTypeStatusId the ASC lists send;
       Prefix and BandTitle follow the ASC reporting sheet ("Surgery Confirmed" under "Surgeries"). */
    var DashboardDetailTypes = {
        "7": { "Name": "Pre-Admission", "Prefix": "Pre-Admission", "BandTitle": "Pre-Admissions" },
        "4": { "Name": "ASC", "Prefix": "Surgery", "BandTitle": "Surgeries" },
        "14": { "Name": "Laser", "Prefix": "Laser", "BandTitle": "Lasers" }
    };
    var detailsRequestToken = 0;

    /* The sheet rows, one per count column of Proc_GetDatewiseAppointmentStatusCount. Tone colors the text like the
       reporting sheet: good green, bad red, neutral gray for a cancellation or no-show that still has a future appointment. */
    function getDashboardDetailMetrics(prefix) {
        return [
            { "Key": "Appointments", "Label": prefix + " Appointments", "Tone": "total", "Bold": true },
            { "Key": "Confirmed", "Label": prefix + " Confirmed", "Tone": "good" },
            { "Key": "NotConfirmed", "Label": prefix + " Not Confirmed", "Tone": "bad" },
            { "Key": "NotConfirmedNoAnswer", "Label": prefix + " Not Confirmed - No Answer", "Tone": "bad" },
            { "Key": "CancellationsWithFutureAppointment", "Label": prefix + " Cancellations with Future Appointment", "Tone": "neutral" },
            { "Key": "CancellationsWithoutFutureAppointment", "Label": prefix + " Cancellations without Future Appointment", "Tone": "bad" },
            { "Key": "NoShowWithFutureAppointment", "Label": prefix + " No-Show with Future Appointment", "Tone": "neutral" },
            { "Key": "NoShowWithoutFutureAppointment", "Label": prefix + " No-Show without Future Appointment", "Tone": "bad" },
            { "Key": "CompleteStatus", "Label": "Complete Status", "Tone": "good", "Bold": true },
            { "Key": "IncompleteStatus", "Label": "Incomplete Status", "Tone": "bad", "Bold": true }
        ];
    }

    /* Confirmed + No Answer + Not Confirmed add up to the day's appointments, so they stack. They are states, so they
       wear the status colors (good, warning, critical); only this order, warning in the middle, keeps green and red
       apart for colorblind readers. Warning is a light step, so the legend and the table carry its values too. */
    var DashboardConfirmationSeries = [
        { "Key": "Confirmed", "Name": "Confirmed", "Color": "#0ca30c" },
        { "Key": "NotConfirmedNoAnswer", "Name": "Not Confirmed - No Answer", "Color": "#fab219" },
        { "Key": "NotConfirmed", "Name": "Not Confirmed", "Color": "#d03b3b" }
    ];

    function getDashboardDetailChart(days, rows) {
        return {
            "chart": {
                "bgColor": "#ffffff",
                "canvasBgColor": "#ffffff",
                "showBorder": "0",
                "showCanvasBorder": "0",
                "baseFont": "system-ui, -apple-system, Segoe UI, sans-serif",
                "baseFontColor": "#52514e",
                "yAxisName": "Appointments",
                "showValues": "0",
                "showSum": "1",
                "sumValueFontColor": "#0b0b0b",
                "divLineColor": "#e1e0d9",
                "divLineThickness": "1",
                "divLineIsDashed": "0",
                "showAlternateHGridColor": "0",
                "usePlotGradientColor": "0",
                "showPlotBorder": "1",
                "plotBorderColor": "#ffffff",
                "plotBorderThickness": "2",
                "plotBorderAlpha": "100",
                "maxColWidth": "24",
                "legendPosition": "top",
                "legendBorderAlpha": "0",
                "legendShadow": "0",
                "legendBgAlpha": "0",
                "drawCrossLine": "1",
                "plotToolText": "$label<br>$seriesName: <b>$dataValue</b>"
            },
            "categories": [{ "category": days.map(function (day) { return { "label": day.ShortDate }; }) }],
            "dataset": DashboardConfirmationSeries.map(function (series) {
                return {
                    "seriesName": series.Name,
                    "color": series.Color,
                    "data": rows.map(function (row) { return { "value": row[series.Key] || 0 }; })
                };
            })
        };
    }

    /* Providers is null while the provider proc is still loading. View is the radio choice: "AppointmentStatus" or "Provider". */
    $scope.DashboardDetails = { "Show": false, "View": "AppointmentStatus", "AppointmentTypeStatusId": 0, "Name": "", "BandTitle": "", "Metrics": [], "Days": [], "Rows": [], "Totals": {}, "ChartSource": null, "Providers": null, "ProvidersFailed": false, "ProviderSearch": "", "ProviderCount": 0, "ProviderPageNumber": 1, "ProviderPageSize": 20 };

    /* The detail procs return { status, rows }; a plain array of rows is taken as is. */
    function getResponseRows(resp) {
        return Array.isArray(resp.data) ? resp.data : ((resp.data && resp.data.rows) || []);
    }

    function sumMetrics(rows) {
        let totals = {};
        angular.forEach($scope.DashboardDetails.Metrics, function (metric) {
            totals[metric.Key] = rows.reduce(function (sum, row) { return sum + (row[metric.Key] || 0); }, 0);
        });
        return totals;
    }

    function getDashboardDays(dates) {
        return dates.map(function (date) {
            let day = moment(date, "YYYY-MM-DD");
            return { "Weekday": day.format("dddd"), "ShortDate": day.format("D-MMM") };
        });
    }

    /* A provider row's counts are camelCase (notConfirmedNoAnswer); the metric Key is the same name capitalized. */
    function getDashboardProviderCell(date, counts) {
        let cell = { "Date": date };
        angular.forEach(counts, function (value, key) {
            cell[key.charAt(0).toUpperCase() + key.slice(1)] = value;
        });
        return cell;
    }

    /* One block per doctor, a column per date. The busiest doctor comes first and is the only one expanded, so a long list stays short. */
    function getDashboardProviderGroups(dates, providerRows) {
        let groups = providerRows.map(function (row) {
            let data = row.data || {};
            let cells = dates.map(function (date) { return getDashboardProviderCell(date, data[date]); });
            return {
                "DoctorId": row.UserId,
                "DoctorName": (row.name || "").trim(),
                "Cells": cells,
                "Totals": sumMetrics(cells),
                "Expanded": false
            };
        });
        groups = _.sortBy(groups, function (group) { return -group.Totals.Appointments; });
        if (groups.length > 0) {
            groups[0].Expanded = true;
        }
        return groups;
    }

    /* Only the proc for the selected radio is called; changing the radio calls this again. providerPageNumber comes
       from the provider pager; any other load starts the provider list over at page 1. */
    function loadDashboardDetails(providerPageNumber) {
        let params = getDashboardParams();
        if (!params) {
            return;
        }
        params.AppointmentTypeStatusIDList = String($scope.DashboardDetails.AppointmentTypeStatusId);

        let requestToken = ++detailsRequestToken;
        $scope.DashboardDetails.Days = [];
        $scope.DashboardDetails.Rows = [];
        $scope.DashboardDetails.Totals = {};
        $scope.DashboardDetails.Providers = null;
        $scope.DashboardDetails.ProvidersFailed = false;
        $scope.DashboardDetails.ProviderPageNumber = providerPageNumber || 1;
        if (!providerPageNumber) {
            $scope.DashboardDetails.ProviderCount = 0;
        }

        if ($scope.DashboardDetails.View === "Provider") {
            loadDashboardProviderDetails(params, requestToken);
        } else {
            loadDashboardStatusDetails(params, requestToken);
        }
    }

    function loadDashboardStatusDetails(params, requestToken) {
        eHnoteSurgeryService.GetASCDatewiseAppointmentStatusCount(params).then(function (resp) {
            /* The radio or the filters changed while this was loading. */
            if (requestToken !== detailsRequestToken) {
                return;
            }
            if (resp.data.status == 'Success') {
                let rows = resp.data.rows || [];
                let days = getDashboardDays(rows.map(function (row) { return row.Date; }));
                $scope.DashboardDetails.Days = days;
                $scope.DashboardDetails.Rows = rows;
                $scope.DashboardDetails.Totals = sumMetrics(rows);
                $scope.DashboardDetails.ChartSource = getDashboardDetailChart(days, rows);
            }
        }, function (err) {
            console.log(err);
            if (requestToken === detailsRequestToken) {
                alertify.error("Error in Getting ASC Dashboard Details");
            }
        });
    }

    /* The provider proc returns { status, Count, rows: [{ UserId, name, data: { "2026-09-17": { appointments, ... } } }] },
       so the date columns come from the data keys. It pages by doctor, and Count is the number of doctors in total. */
    function loadDashboardProviderDetails(params, requestToken) {
        params.PageSize = $scope.DashboardDetails.ProviderPageSize;
        params.PageNumber = $scope.DashboardDetails.ProviderPageNumber;
        eHnoteSurgeryService.GetASCDatewiseProviderAppointmentStatusCount(params).then(function (resp) {
            if (requestToken !== detailsRequestToken) {
                return;
            }
            let providerRows = getResponseRows(resp);
            $scope.DashboardDetails.ProviderCount = (resp.data && resp.data.Count) || providerRows.length;
            let dates = [];
            angular.forEach(providerRows, function (row) {
                angular.forEach(row.data, function (counts, date) {
                    if (dates.indexOf(date) === -1) {
                        dates.push(date);
                    }
                });
            });
            dates.sort();
            $scope.DashboardDetails.Days = getDashboardDays(dates);
            $scope.DashboardDetails.Providers = getDashboardProviderGroups(dates, providerRows);
        }, function (err) {
            console.log(err);
            if (requestToken !== detailsRequestToken) {
                return;
            }
            $scope.DashboardDetails.ProvidersFailed = true;
            $scope.DashboardDetails.Providers = [];
            $scope.DashboardDetails.ProviderCount = 0;
        });
    }

    $scope.changeDashboardDetailsView = function () {
        loadDashboardDetails();
    };

    $scope.changeProviderPage = function () {
        loadDashboardDetails($scope.DashboardDetails.ProviderPageNumber);
    };

    $scope.toggleProvider = function (provider) {
        provider.Expanded = !provider.Expanded;
    };

    $scope.setAllProvidersExpanded = function (expanded) {
        angular.forEach($scope.DashboardDetails.Providers, function (provider) {
            provider.Expanded = expanded;
        });
    };

    /* Clicking a count opens the patients behind it: Proc_GetDatewiseAppointmentStatusDetail takes the same request
       as the sheet plus Type, the clicked row. It pages, so Count says how many patients there are in total. */
    var DashboardDetailPopupPageSize = 100;
    var popupRequestToken = 0;

    $scope.DashboardDetailPopup = { "Show": false, "Title": "", "Loading": false, "Failed": false, "Rows": [], "Count": 0, "PageNumber": 1, "Request": null };

    $scope.closeDashboardDetailPopup = function () {
        $scope.DashboardDetailPopup.Show = false;
    };

    function loadDashboardDetailPopupPage(pageNumber) {
        let popup = $scope.DashboardDetailPopup;
        let reqObj = angular.extend({}, popup.Request, { "PageSize": DashboardDetailPopupPageSize, "PageNumber": pageNumber });
        let requestToken = ++popupRequestToken;
        popup.Loading = true;

        eHnoteSurgeryService.GetASCDatewiseAppointmentStatusDetail(reqObj).then(function (resp) {
            /* Another cell was clicked while this one was loading. */
            if (requestToken !== popupRequestToken) {
                return;
            }
            let data = resp.data || {};
            popup.Loading = false;
            if (data.status === "Success" || data.Status === "Success") {
                let rows = data.rows || [];
                popup.Rows = pageNumber === 1 ? rows : popup.Rows.concat(rows);
                popup.Count = data.Count || popup.Rows.length;
                popup.PageNumber = pageNumber;
            } else {
                popup.Failed = true;
            }
        }, function (err) {
            console.log(err);
            if (requestToken !== popupRequestToken) {
                return;
            }
            popup.Loading = false;
            popup.Failed = true;
        });
    }

    /* date is a row's Date, or null from the Total column, which asks for the whole range.
       provider is the doctor block the cell sits in, or null in the overall sheet. */
    $scope.openDashboardDetailPopup = function (metric, date, provider) {
        let params = getDashboardParams();
        if (!params) {
            return;
        }

        let title = (provider ? provider.DoctorName + " - " : "") + metric.Label + " - ";
        title += date ? moment(date, "YYYY-MM-DD").format("D-MMM") : $scope.DashboardFilter.FromDate + " to " + $scope.DashboardFilter.ToDate;

        let reqObj = angular.extend({}, params, {
            "Type": metric.Key,
            "AppointmentTypeStatusIDList": String($scope.DashboardDetails.AppointmentTypeStatusId),
            "FromDate": date || params.FromDate,
            "TotDate": date || params.TotDate,
            "DoctorIds": provider ? String(provider.DoctorId) : params.DoctorIds
        });

        $scope.DashboardDetailPopup = { "Show": true, "Title": title, "Loading": true, "Failed": false, "Rows": [], "Count": 0, "PageNumber": 1, "Request": reqObj };
        loadDashboardDetailPopupPage(1);
    };

    $scope.loadMoreDetailPopupRows = function () {
        loadDashboardDetailPopupPage($scope.DashboardDetailPopup.PageNumber + 1);
    };

    $scope.getDashboardDetailInfo = function (appointmentTypeStatusId) {
        let type = DashboardDetailTypes[appointmentTypeStatusId];
        $scope.DashboardDetails.Show = true;
        $scope.DashboardDetails.View = "AppointmentStatus";
        $scope.DashboardDetails.AppointmentTypeStatusId = appointmentTypeStatusId;
        $scope.DashboardDetails.Name = type.Name;
        $scope.DashboardDetails.BandTitle = type.BandTitle;
        $scope.DashboardDetails.Metrics = getDashboardDetailMetrics(type.Prefix);
        loadDashboardDetails();
    };

    $scope.HideDashboardDetails = function () {
        $scope.DashboardDetails.Show = false;
    };

    /* Excel export goes through the same job pipeline as the Lead Generation and OD reports: the api writes the job
       row, builds the xlsx (while the request waits for a short range, queued for a long one) and the Excel exports
       popup hands out the file. The provider view exports every doctor, not just the page on screen. */
    var ASC_EXPORT_REPORT_ID = 18;

    $scope.ASCExport = { "Busy": false };
    $scope.ExportSummarylist = [];

    function getDashboardLocationNames() {
        let group = $scope.DashboardLocations;
        if (group.AllCheck || group.List.length === 0) {
            return "All Locations";
        }
        return _.pluck(_.where(group.List, { isChecked: true }), "DisplayName").join(", ");
    }

    $scope.ClickForASCExcelExport = function () {
        let params = getDashboardParams();
        if (!params) {
            return;
        }
        params.AppointmentTypeStatusIDList = String($scope.DashboardDetails.AppointmentTypeStatusId);

       
        params.UserIds = params.DoctorIds;
        params.LocationId = params.LocationIds;
        /* null as on screen - this tab has no visit reason filter, and an empty list is not "every reason" */
        params.VisitReasonIds = params.VisitReasonIdList || null;
        

        let details = $scope.DashboardDetails;
        let reportName = details.Name + " Appointments Details" + (details.View === "Provider" ? " by Provider" : "") + " - " + $scope.DashboardFilter.FromDate + " to " + $scope.DashboardFilter.ToDate;
        let days = moment(params.TotDate, "YYYY-MM-DD").diff(moment(params.FromDate, "YYYY-MM-DD"), "days");

        let reqObj = {
            "ExportJobId": 0,
            "UserId": $scope.UserId,
            "RequestedByUserId": $scope.UserId,
            "RequestedByUserName": doctorInfo.doctordata.User[0].FullName || "",
            "OrganizationId": $scope.HospitalID,
            "ParentOrganizationId": $scope.ParentHospitalID,
            /* titles the sheet, so it names the service type exported - ASC, Pre-Admission or Laser */
            "ReportName": reportName,
            "ReportId": 18,
            "StatusId": 1,
            "StatusName": "Pending",
            "IsManualExport": true,
            "CSVFileName": "",
            "CSVFileExt": ".xlsx",
            "CSVFileUrl": null,
            "ErrorMessage": null,
            "StartedOn": new Date(),
            "CompletedOn": null,
            "DeleteInd": "N",
            "RequestType": days <= 7 ? "Immediate" : "TaskRun",
            /* The sheet's rows as the screen labels them - the api reads Metrics here, not inside RequestDetails,
               so without them the sheet has headers and no rows. */
            "Metrics": params.Metrics,
            /* the request the sheet's own procs read */
            "RequestDetails": params,
            
            //"RequestDetails": {
            //    "View": details.View,
            //    "BandTitle": details.BandTitle,
            //    "LocationName": getDashboardLocationNames(),
            //    "Metrics": details.Metrics.map(function (metric) {
            //        return { "Key": metric.Key, "Label": metric.Label, "Tone": metric.Tone, "Bold": !!metric.Bold };
            //    }),
            //    "Filter": params
            //}
        };

        $scope.ASCExport.Busy = true;
        eHnoteInsuranceService.InitiateASCReportCSVData(reqObj).then(function (resp) {
            $scope.ASCExport.Busy = false;
            if (resp.data.status == "Success") {
                alertify.success("Excel export started - check the download list for the file.");
            } else {
                alertify.error(resp.data.Message || "Excel export failed");
            }
        }, function (err) {
            console.log(err);
            $scope.ASCExport.Busy = false;
            alertify.error("Excel export failed");
        });
    };

    /* The list holds every report's jobs, so only the ASC export's are kept. */
    function loadASCExportStatusList() {
        let reqObj = {
            "OrganizationId": $scope.HospitalID,
            "RequestedByUserId": $scope.UserId,
            "FromDate": "",
            "ToDate": "",
            "PageSize": 100,
            "PageNumber": 1,
            "StatusId": 0,
            "ReportId": 18
        };
        eHnoteInsuranceService.GetReportExportJobsStatusList(reqObj).then(function (resp) {
            if (resp.data.status == "Success") {
                $scope.ExportSummarylist = (resp.data.rows || []).filter(function (item) {
                    return item.MasterReportId === ASC_EXPORT_REPORT_ID;
                });
            } else {
                alertify.error(resp.data.Message);
            }
        }, function (err) {
            console.log(err);
            alertify.error("Getting Excel Exports Failed");
        });
    }

    $scope.ASCExcelStatus = function () {
        $scope.ExcelReportsObj = { "ReportId": ASC_EXPORT_REPORT_ID, "ReportName": "ASC Reports" };
        $scope.ExportSummarylist = [];

        $uibModal.open({
            "templateUrl": "templates/USBilling/uibpopups/excelExport.html",
            "backdrop": "static",
            "keyboard": false,
            "scope": $scope,
            "windowClass": "modal__seventy--",
            "controller": ["$scope", "$uibModalInstance", function ($scope, $uibModalInstance) {
                loadASCExportStatusList();
                $scope.uibclose = function () {
                    $uibModalInstance.dismiss("cancel");
                };
            }]
        });
    };

    /* Apply refreshes the summary, and the details too while they are open. */
    $scope.ApplyASCDashboardFilters = function () {
        if (!getDashboardParams()) {
            return;
        }
        $scope.GetASCDashboardSummary();
        if ($scope.DashboardDetails.Show) {
            loadDashboardDetails();
        }
    };

    $scope.ResetASCDashboardFilters = function () {
        $scope.DashboardFilter = getDashboardFilter();

        $scope.DashboardLocations = getFilterGroup("Location", $scope.DashboardLocations.List);
        loadDashboardDoctors().then(function () {
            $scope.ApplyASCDashboardFilters();
        });
    };

    $scope.InitASCDashboard = function () {
        $scope.DashboardFilter = getDashboardFilter();

        $scope.DashboardLocations = getFilterGroup("Location", getDashboardLocations());
        /* The proc needs the doctor ids, so the first summary waits for the doctors. */
        $scope.DashboardDoctors = getFilterGroup("Doctor", []);
        loadDashboardDoctors().then(function () {
            $scope.GetASCDashboardSummary();
        });
    };

    $scope.InitASCDashboard();

}]);

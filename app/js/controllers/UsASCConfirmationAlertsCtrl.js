"use strict";
eHnoteWebApp.controller("UsASCConfirmationAlertsCtrl", ["$scope", "$q", "alertify", "eHnoteMasterDataService", "eHnoteMainAppointmentService", "eHnoteSurgeryService", "eHnotePatientVisitReasonServices", "eHnoteInsuranceService", function ($scope, $q, alertify, eHnoteMasterDataService, eHnoteMainAppointmentService, eHnoteSurgeryService, eHnotePatientVisitReasonServices, eHnoteInsuranceService) {
    var doctorInfo = eHnoteMasterDataService.getUserInfo();
    var alertsRequestToken = 0;
    var alertsDoctorRequestToken = 0;
    var alertsPopupRequestToken = 0;
    var alertsSubSpecializationIdsPromise = null;
    /* The organization's visit reasons don't change with the other filters, so they load once and Reset reuses them. */
    var alertsVisitReasonsList = [];
    /* The request the sheet on screen was loaded with, so a double-click opens the patients behind those numbers
       even when a filter was changed afterwards without Apply. */
    var alertsLoadedParams = null;

    /* The Confirmation Alerts Screen sheet of the ASC dashboard requirement: period by procedure date, three weeks by default. */
    var AlertsDefaultWeeks = 3;
    var AlertsDetailPageSize = 100;

    /* Service Type, one at a time - the AppointmentTypeStatusIds the ASC Reports cards send. Clinic Procedures has no
       id yet, so it is not offered. The first one is the default. */
    var AlertServiceTypes = [
        { "AppointmentTypeStatusId": 4, "DisplayName": "Surgeries" },
        { "AppointmentTypeStatusId": 7, "DisplayName": "Pre-Admission" },
        { "AppointmentTypeStatusId": 14, "DisplayName": "Lasers" }
    ];
    $scope.AlertServiceTypes = AlertServiceTypes;

    /* The rows under each service type, in the requirement's order and wording. Keys are the count columns of
       Proc_GetDatewiseAppointmentStatusCount (and the detail proc's Type); Tone colors the text like the ASC Reports sheet. */
    var AlertTotalMetric = { "Key": "Appointments", "Label": "Appointments", "Tone": "total", "Bold": true };
    var AlertMetrics = [
        { "Key": "Confirmed", "Label": "Confirmed", "Tone": "good" },
        { "Key": "NotConfirmed", "Label": "Not Confirmed", "Tone": "bad" },
        { "Key": "NotConfirmedNoAnswer", "Label": "Calls Unanswered", "Tone": "bad" },
        { "Key": "CancellationsWithoutFutureAppointment", "Label": "Cancelled without future appointment", "Tone": "bad" },
        { "Key": "CancellationsWithFutureAppointment", "Label": "Cancelled with future appointment", "Tone": "neutral" },
        { "Key": "NoShowWithoutFutureAppointment", "Label": "No-Show without future appointment", "Tone": "bad", "Bold": true },
        { "Key": "NoShowWithFutureAppointment", "Label": "No-Show with future appointment", "Tone": "neutral", "Bold": true }
    ];
    var AlertCountKeys = [AlertTotalMetric.Key].concat(_.pluck(AlertMetrics, "Key"));

    /* The chart's stacked series, one per kind of alert. Colors are categorical slots 1-5, checked for colorblind separation. */
    var AlertChartSeries = [
        { "Name": "Not Confirmed and/or Calls Unanswered", "Keys": ["NotConfirmed", "NotConfirmedNoAnswer"], "Color": "#2a78d6" },
        { "Name": "Cancelled Without Future Appointment", "Keys": ["CancellationsWithoutFutureAppointment"], "Color": "#eb6834" },
        { "Name": "Cancelled With Future Appointment", "Keys": ["CancellationsWithFutureAppointment"], "Color": "#1baf7a" },
        { "Name": "No-Show Without Future Appointment", "Keys": ["NoShowWithoutFutureAppointment"], "Color": "#eda100" },
        { "Name": "No-Show With Future Appointment", "Keys": ["NoShowWithFutureAppointment"], "Color": "#e87ba4" }
    ];
    /* Everything but Confirmed - what a doctor's "alerts" count adds up. */
    var AlertKeys = _.flatten(_.pluck(AlertChartSeries, "Keys"));

    /* ---------- filters ---------- */

    /* Same multi select shape the ASC Reports tab uses - every item starts checked, which means "All". */
    function getAlertsFilterGroup(title, list) {
        let group = { "Title": title, "List": list || [], "AllCheck": true, "SearchText": "", "SelectedText": "All" };
        $scope.checkAllDashboardItems(group);
        return group;
    }

    function getAlertsCheckedIds(group, key) {
        return _.pluck(_.where(group.List, { isChecked: true }), key).join(",");
    }

    /* PayorObj and ServiceObj hold the typeahead text; the picked items live in the lists. */
    function getAlertsFilter() {
        return {
            "FromDate": moment().format("MM-DD-YYYY"),
            "ToDate": moment().add(AlertsDefaultWeeks, "weeks").format("MM-DD-YYYY"),
            "AppointmentTypeStatusId": AlertServiceTypes[0].AppointmentTypeStatusId,
            "PayorObj": "",
            "ServiceObj": "",
            "AllPayorList": [],
            "AllProcedureList": []
        };
    }

    /* The branches come from UsASCParentCtrl, the same list the ASC Reports Location filter shows. */
    function getAlertsLocations() {
        let branches = ($scope.mainAscParentObj && $scope.mainAscParentObj.AllBranchesList) || [];
        return branches.filter(function (item) { return item.ClinicId !== 0; }).map(function (item) {
            return { "ClinicId": item.ClinicId, "BranchId": item.BranchId, "DisplayName": item.BranchName || item.ClinicName };
        });
    }

    function resetAlertsFilters() {
        $scope.AlertsFilter = getAlertsFilter();
        $scope.AlertsLocations = getAlertsFilterGroup("Location", getAlertsLocations());
        $scope.AlertsDoctors = getAlertsFilterGroup("Doctor", []);
        $scope.AlertsVisitReasons = getAlertsFilterGroup("Visit Reason", angular.copy(alertsVisitReasonsList));
    }

    /* The parent organization's visit reasons, the list the ASC appointments list filters by. The proc gets their
       ParentAppointmentVisitReasonId, as that list sends it. Resolves even when loading failed - the filter then stays "All". */
    function loadAlertsVisitReasons() {
        return eHnotePatientVisitReasonServices.GetParentOrgApptVisitReasons({ "ParentOrganizationId": $scope.ParentHospitalID || 0 }).then(function (resp) {
            alertsVisitReasonsList = _.sortBy(((resp.data && resp.data.rows) || []).map(function (item) {
                return { "VisitReasonId": item.ParentAppointmentVisitReasonId, "DisplayName": item.AppointmentVisitReason || "" };
            }), "DisplayName");
            $scope.AlertsVisitReasons = getAlertsFilterGroup("Visit Reason", angular.copy(alertsVisitReasonsList));
        }, function (err) {
            console.log(err);
            alertify.error("Getting Visit Reasons Failed");
        });
    }

    /* The sub specializations don't change with the location, so they load once. */
    function getAlertsSubSpecializationIds() {
        if (!alertsSubSpecializationIdsPromise) {
            alertsSubSpecializationIdsPromise = eHnoteMainAppointmentService.getBranchSubSpecializationsById(doctorInfo.doctordata.UserAddress[0].SubOrganizationId, $scope.HospitalID).then(function (resp) {
                return _.pluck((resp.data && resp.data.row) || [], "SubSpecializationId").join(",");
            }, function (err) {
                alertsSubSpecializationIdsPromise = null;
                return $q.reject(err);
            });
        }
        return alertsSubSpecializationIdsPromise;
    }

    /* The doctors of the checked locations, loaded the way the ASC Reports tab loads its own.
       Resolves once the doctors are in, even when loading them failed. */
    function loadAlertsDoctors() {
        let branchIds = getAlertsCheckedIds($scope.AlertsLocations, "BranchId");
        let requestToken = ++alertsDoctorRequestToken;

        if (!branchIds && $scope.AlertsLocations.List.length > 0) {
            $scope.AlertsDoctors = getAlertsFilterGroup("Doctor", []);
            return $q.when();
        }

        return getAlertsSubSpecializationIds().then(function (subSpecializationIds) {
            if (requestToken !== alertsDoctorRequestToken) {
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
                if (requestToken === alertsDoctorRequestToken) {
                    let doctors = ((data && data.rows) || []).filter(function (item) { return item.RoleId === 1 || item.RoleId === 43; });
                    doctors = _.uniq(doctors, false, function (item) { return item.DoctorID; }).map(function (item) {
                        return { "DoctorID": item.DoctorID, "DisplayName": item.SecondUserFullName + (item.NPI ? " - " + item.NPI : "") };
                    });
                    $scope.AlertsDoctors = getAlertsFilterGroup("Doctor", doctors);
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
    $scope.checkAllAlertsLocations = function () {
        $scope.checkAllDashboardItems($scope.AlertsLocations);
        loadAlertsDoctors();
    };

    $scope.toggleAlertsLocation = function () {
        $scope.toggleDashboardItem($scope.AlertsLocations);
        loadAlertsDoctors();
    };

    /* More Filter popover: Health Plan (payer) and Procedure are typeahead searches that add to a list.
       The searches are the ASC Reports tab's own GetDashboardPayors and GetDashboardProcedures. */
    $scope.AlertsPopover = { "IsOpen": false, "TemplateUrl": "confirmationAlertsFilterPopover.html" };

    $scope.closeAlertsPopover = function () {
        $scope.AlertsPopover.IsOpen = false;
    };

    $scope.onSelectAlertsPayor = function (item) {
        $scope.AlertsFilter.PayorObj = "";
        if (_.findWhere($scope.AlertsFilter.AllPayorList, { "PayorId": item.OrganizationPayorId })) {
            alertify.error("Payer is already selected");
            return;
        }
        $scope.AlertsFilter.AllPayorList.push({ "PayorId": item.OrganizationPayorId, "PayorName": item.OrganizationPayorName });
    };

    $scope.onSelectAlertsProcedure = function (item) {
        $scope.AlertsFilter.ServiceObj = "";
        if (_.findWhere($scope.AlertsFilter.AllProcedureList, { "ProcedureId": item.ProcedureId })) {
            alertify.error("Procedure is already selected");
            return;
        }
        $scope.AlertsFilter.AllProcedureList.push({ "ProcedureId": item.ProcedureId, "ProcedureCode": item.ProcedureCode, "ProcedureName": item.ProcedureName });
    };

    $scope.DeleteAlertsPayor = function (index) {
        $scope.AlertsFilter.AllPayorList.splice(index, 1);
    };

    $scope.DeleteAlertsProcedure = function (index) {
        $scope.AlertsFilter.AllProcedureList.splice(index, 1);
    };

    $scope.ResetAlertsMoreFilters = function () {
        $scope.AlertsFilter.PayorObj = "";
        $scope.AlertsFilter.ServiceObj = "";
        $scope.AlertsFilter.AllPayorList = [];
        $scope.AlertsFilter.AllProcedureList = [];
    };

    $scope.ApplyAlertsMoreFilters = function () {
        $scope.closeAlertsPopover();
        $scope.ApplyConfirmationAlerts();
    };

    /* Checks the filter bar and builds the request the date-wise procs read - the same shape the ASC Reports tab sends.
       Returns null when a filter is not filled in. */
    function getAlertsParams() {
        let fromDate = moment($scope.AlertsFilter.FromDate, "MM-DD-YYYY");
        let toDate = moment($scope.AlertsFilter.ToDate, "MM-DD-YYYY");

        if (!fromDate.isValid() || !toDate.isValid()) {
            alertify.error("Please select From and To dates");
            return null;
        }
        if (fromDate.isAfter(toDate)) {
            alertify.error("From date should not be greater than To date");
            return null;
        }
        let unselectedGroup = _.find([$scope.AlertsLocations, $scope.AlertsDoctors, $scope.AlertsVisitReasons], function (group) {
            return group.List.length > 0 && !_.findWhere(group.List, { isChecked: true });
        });
        if (unselectedGroup) {
            alertify.error("Please select at least one " + unselectedGroup.Title);
            return null;
        }

        let payorIds = _.pluck($scope.AlertsFilter.AllPayorList, "PayorId").join(",");
        let procedureIds = _.pluck($scope.AlertsFilter.AllProcedureList, "ProcedureId").join(",");

        return {
            "ParentOrganization": $scope.ParentHospitalID,
            "AllLocationInd": 0,
            "LocationIds": getAlertsCheckedIds($scope.AlertsLocations, "ClinicId") || String($scope.HospitalID),
            "DoctorIds": getAlertsCheckedIds($scope.AlertsDoctors, "DoctorID"),
            "AllMasterPayorsInd": payorIds ? 0 : 1,
            "MasterPayorIds": payorIds || null,
            "AllProcedureInd": procedureIds ? 0 : 1,
            "ProcedureIds": procedureIds || null,
            /* Every ticked id goes, "All" included, like locations and doctors. Null only when the list didn't load. */
            "AllVisitReasonInd": 0,
            "VisitReasonIdList": getAlertsCheckedIds($scope.AlertsVisitReasons, "VisitReasonId") || null,
            "FromDate": fromDate.format("YYYY-MM-DD"),
            "TotDate": toDate.format("YYYY-MM-DD"),
            "PageSize": 100,
            "PageNumber": 1
        };
    }

    /* ---------- sheet ---------- */

    function getAlertsResult() {
        return { "Group": "General", "Loading": false, "Failed": false, "Days": [], "Sections": [], "Rows": [], "Providers": [], "ProviderCount": 0, "ProviderPageNumber": 1, "ProviderPageSize": 20, "ChartSource": null };
    }

    function isAlertsSuccess(resp) {
        return !!(resp.data && (resp.data.status === "Success" || resp.data.Status === "Success"));
    }

    function getAlertsDays(dates) {
        return dates.map(function (date) {
            let day = moment(date, "YYYY-MM-DD");
            return { "Date": date, "Weekday": day.format("dddd"), "ShortDate": day.format("D-MMM") };
        });
    }

    function addAlertsDates(dates, list) {
        angular.forEach(list, function (date) {
            if (dates.indexOf(date) === -1) {
                dates.push(date);
            }
        });
    }

    /* One service type's counts, a cell per date column, with the Total column. */
    function getAlertsSection(type, cells) {
        let totals = {};
        AlertCountKeys.forEach(function (key) {
            totals[key] = cells.reduce(function (sum, cell) { return sum + (Number(cell[key]) || 0); }, 0);
        });
        return { "AppointmentTypeStatusId": type.AppointmentTypeStatusId, "Label": type.DisplayName, "Cells": cells, "Totals": totals };
    }

    /* The provider proc's counts are camelCase (notConfirmedNoAnswer); the sheet keys are the same names capitalized. */
    function getAlertsProviderCell(date, counts) {
        let cell = { "Date": date };
        angular.forEach(counts, function (value, key) {
            cell[key.charAt(0).toUpperCase() + key.slice(1)] = value;
        });
        return cell;
    }

    /* The sheet is one flat list of rows - a band row per service type, then its metric rows - so the template needs a
       single ng-repeat, in the General sheet and inside each doctor's block alike. */
    function getAlertsRows(sections) {
        let rows = [];
        sections.forEach(function (section) {
            rows.push({ "Label": section.Label, "Section": section, "Metric": AlertTotalMetric, "IsBand": true });
            AlertMetrics.forEach(function (metric) {
                rows.push({ "Label": metric.Label, "Section": section, "Metric": metric, "IsBand": false });
            });
        });
        return rows;
    }

    function getAlertsSectionsTotal(sections, keys) {
        return sections.reduce(function (sum, section) {
            return sum + keys.reduce(function (keySum, key) { return keySum + (section.Totals[key] || 0); }, 0);
        }, 0);
    }

    /* Alerts per service date: a stacked series per kind of alert for the selected service type. The sheet above is
       the table view of the same numbers. */
    function getAlertsChart(days, sections) {
        if (days.length === 0 || sections.length === 0) {
            return null;
        }
        return {
            "chart": {
                "bgColor": "#ffffff",
                "canvasBgColor": "#ffffff",
                "showBorder": "0",
                "showCanvasBorder": "0",
                "baseFont": "system-ui, -apple-system, Segoe UI, sans-serif",
                "baseFontColor": "#52514e",
                "yAxisName": "Alerts",
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
            "dataset": AlertChartSeries.map(function (series) {
                return {
                    "seriesName": series.Name,
                    "color": series.Color,
                    "data": days.map(function (day, dayIndex) {
                        let value = 0;
                        sections.forEach(function (section) {
                            series.Keys.forEach(function (key) { value += Number(section.Cells[dayIndex][key]) || 0; });
                        });
                        return { "value": value };
                    })
                };
            })
        };
    }

    /* Builds the rows, the doctors' counts and the chart from the loaded counts. */
    function buildAlertsRows() {
        let result = $scope.AlertsResult;

        result.Rows = getAlertsRows(result.Sections);
        result.ChartSource = getAlertsChart(result.Days, result.Sections);
        result.Providers.forEach(function (provider) {
            provider.Rows = getAlertsRows(provider.Sections);
            provider.AppointmentCount = getAlertsSectionsTotal(provider.Sections, [AlertTotalMetric.Key]);
            provider.AlertCount = getAlertsSectionsTotal(provider.Sections, AlertKeys);
        });
    }

    $scope.togglePopover = function () {
        $scope.AlertsPopover.IsOpen = !$scope.AlertsPopover.IsOpen;
    };

    /* General: Proc_GetDatewiseAppointmentStatusCount for the selected service type, a row per date. A response that
       isn't Success counts as no appointments, like the ASC Reports sheet. */
    function loadAlertsGeneral(params, type) {
        let request = angular.extend({}, params, { "AppointmentTypeStatusIDList": String(type.AppointmentTypeStatusId) });
        return eHnoteSurgeryService.GetDatewiseAppointmentCountStatus(request).then(function (resp) {
            let rows = isAlertsSuccess(resp) ? (resp.data.rows || []) : [];
            let dates = [];
            addAlertsDates(dates, _.pluck(rows, "Date"));
            dates.sort();

            let rowsByDate = {};
            rows.forEach(function (row) { rowsByDate[row.Date] = row; });
            let section = getAlertsSection(type, dates.map(function (date) { return rowsByDate[date]; }));
            return { "Group": "General", "Days": getAlertsDays(dates), "Sections": [section], "Providers": [] };
        });
    }

    /* Provider: Proc_GetDatewiseProviderAppointmentStatusCount for the selected service type and page - a row per doctor,
       zeros included. It pages by doctor, and Count is the number of doctors in total. */
    function loadAlertsProviders(params, type, pageNumber) {
        let request = angular.extend({}, params, { "AppointmentTypeStatusIDList": String(type.AppointmentTypeStatusId), "PageSize": $scope.AlertsResult.ProviderPageSize, "PageNumber": pageNumber });
        return eHnoteSurgeryService.GetASCDatewiseProviderAppointmentStatusCount(request).then(function (resp) {
            let isSuccess = isAlertsSuccess(resp);
            let rows = isSuccess ? (resp.data.rows || []) : [];
            let dates = [];
            rows.forEach(function (row) { addAlertsDates(dates, Object.keys(row.data || {})); });
            dates.sort();

            let providers = rows.map(function (row) {
                let data = row.data || {};
                let section = getAlertsSection(type, dates.map(function (date) { return getAlertsProviderCell(date, data[date]); }));
                return { "DoctorId": row.UserId, "DoctorName": (row.name || "").trim(), "Sections": [section], "Rows": [], "Expanded": false };
            });
            return { "Group": "Provider", "Days": getAlertsDays(dates), "Sections": [], "Providers": providers, "ProviderCount": (isSuccess && Number(resp.data.Count)) || providers.length };
        });
    }

    /* providerPageNumber comes from the provider pager; any other load starts the doctors over at page 1. */
    function loadConfirmationAlerts(providerPageNumber) {
        let params = getAlertsParams();
        if (!params) {
            return;
        }
        let type = _.findWhere(AlertServiceTypes, { "AppointmentTypeStatusId": $scope.AlertsFilter.AppointmentTypeStatusId });
        let group = $scope.AlertsView.Group;
        let result = $scope.AlertsResult;
        let requestToken = ++alertsRequestToken;

        result.Loading = true;
        result.Failed = false;
        result.ProviderPageNumber = providerPageNumber || 1;
        if (!providerPageNumber) {
            result.ProviderCount = 0;
        }

        let request = group === "Provider" ? loadAlertsProviders(params, type, result.ProviderPageNumber) : loadAlertsGeneral(params, type);
        request.then(function (loaded) {
            /* The filters, the group or the page changed while this was loading. */
            if (requestToken !== alertsRequestToken) {
                return;
            }
            alertsLoadedParams = params;
            angular.extend(result, loaded, { "Loading": false });
            buildAlertsRows();
            /* The first doctor with alerts opens, so a long page stays short. */
            let firstWithAlerts = _.find(result.Providers, function (provider) { return provider.AlertCount > 0; });
            if (firstWithAlerts) {
                firstWithAlerts.Expanded = true;
            }
        }, function (err) {
            if (requestToken !== alertsRequestToken) {
                return;
            }
            console.log(err);
            angular.extend(result, { "Loading": false, "Failed": true, "Days": [], "Sections": [], "Rows": [], "Providers": [], "ProviderCount": 0, "ChartSource": null });
            alertify.error("Getting Confirmation Alerts Failed");
        });
    }

    $scope.ApplyConfirmationAlerts = function () {
        loadConfirmationAlerts();
    };

    $scope.changeAlertsGroup = function () {
        loadConfirmationAlerts();
    };

    $scope.changeAlertsProviderPage = function () {
        loadConfirmationAlerts($scope.AlertsResult.ProviderPageNumber);
    };

    $scope.ResetConfirmationAlerts = function () {
        resetAlertsFilters();
        loadAlertsDoctors().then(function () {
            loadConfirmationAlerts();
        });
    };

    $scope.toggleAlertsProvider = function (provider) {
        provider.Expanded = !provider.Expanded;
    };

    $scope.setAllAlertsProvidersExpanded = function (expanded) {
        angular.forEach($scope.AlertsResult.Providers, function (provider) {
            provider.Expanded = expanded;
        });
    };

    /* ---------- patients popup ---------- */

    /* Double-clicking a count opens the patients behind it - Proc_GetDatewiseAppointmentStatusDetail, the same list the
       ASC Reports sheet opens. date is null from the Total column; provider is null in the General sheet. */
    $scope.AlertsDetailPopup = { "Show": false, "Title": "", "Loading": false, "Failed": false, "Rows": [], "Count": 0, "PageNumber": 1, "Request": null };

    function loadAlertsDetailPage(pageNumber) {
        let popup = $scope.AlertsDetailPopup;
        let reqObj = angular.extend({}, popup.Request, { "PageSize": AlertsDetailPageSize, "PageNumber": pageNumber });
        let requestToken = ++alertsPopupRequestToken;
        popup.Loading = true;

        eHnoteSurgeryService.GetDatewiseAppointmentDetailsByType(reqObj).then(function (resp) {
            /* Another count was double-clicked while this one was loading. */
            if (requestToken !== alertsPopupRequestToken) {
                return;
            }
            popup.Loading = false;
            if (isAlertsSuccess(resp)) {
                let rows = resp.data.rows || [];
                popup.Rows = pageNumber === 1 ? rows : popup.Rows.concat(rows);
                popup.Count = resp.data.Count || popup.Rows.length;
                popup.PageNumber = pageNumber;
            } else {
                popup.Failed = true;
            }
        }, function (err) {
            console.log(err);
            if (requestToken !== alertsPopupRequestToken) {
                return;
            }
            popup.Loading = false;
            popup.Failed = true;
        });
    }

    $scope.openAlertsDetailPopup = function (row, date, provider) {
        let params = alertsLoadedParams;
        if (!params) {
            return;
        }

        let title = (provider ? provider.DoctorName + " - " : "") + row.Section.Label + " - " + row.Metric.Label + " - ";
        title += date ? moment(date, "YYYY-MM-DD").format("D-MMM") : moment(params.FromDate, "YYYY-MM-DD").format("MM-DD-YYYY") + " to " + moment(params.TotDate, "YYYY-MM-DD").format("MM-DD-YYYY");

        let reqObj = angular.extend({}, params, {
            "Type": row.Metric.Key,
            "AppointmentTypeStatusIDList": String(row.Section.AppointmentTypeStatusId),
            "FromDate": date || params.FromDate,
            "TotDate": date || params.TotDate,
            "DoctorIds": provider ? String(provider.DoctorId) : params.DoctorIds
        });

        $scope.AlertsDetailPopup = { "Show": true, "Title": title, "Loading": true, "Failed": false, "Rows": [], "Count": 0, "PageNumber": 1, "Request": reqObj };
        loadAlertsDetailPage(1);
    };

    $scope.loadMoreAlertsDetailRows = function () {
        loadAlertsDetailPage($scope.AlertsDetailPopup.PageNumber + 1);
    };

    $scope.closeAlertsDetailPopup = function () {
        $scope.AlertsDetailPopup.Show = false;
    };

    /* ---------- export / print ---------- */

    function getAlertsPeriodText() {
        let params = alertsLoadedParams;
        return params ? moment(params.FromDate, "YYYY-MM-DD").format("MM-DD-YYYY") + " to " + moment(params.TotDate, "YYYY-MM-DD").format("MM-DD-YYYY") : "";
    }

    function getAlertsLocationNames() {
        let group = $scope.AlertsLocations;
        if (group.AllCheck || group.List.length === 0) {
            return "All Locations";
        }
        return _.pluck(_.where(group.List, { isChecked: true }), "DisplayName").join(", ");
    }

    $scope.AlertsExport = { "Busy": false };

    /* Excel goes through the ASC Reports export job (InitiateASCReportCSVData, report 18): the api builds the xlsx
       (while the request waits for a week or less, queued for longer) and the Excel exports popup of the ASC Reports
       tab hands out the file. The Provider group exports every doctor, not just the page on screen. */
    $scope.ExportConfirmationAlerts = function () {
        if ($scope.AlertsExport.Busy) {
            return;
        }
        let params = getAlertsParams();
        if (!params) {
            return;
        }
        let type = _.findWhere(AlertServiceTypes, { "AppointmentTypeStatusId": $scope.AlertsFilter.AppointmentTypeStatusId });
        let isProvider = $scope.AlertsView.Group === "Provider";

        /* The same keys the ASC Reports export adds; BandTitle heads the sheet, View picks the provider proc. */
        angular.extend(params, {
            "AppointmentTypeStatusIDList": String(type.AppointmentTypeStatusId),
            "UserIds": params.DoctorIds,
            "LocationId": params.LocationIds,
            "VisitReasonIds": params.VisitReasonIdList || "",
            "BandTitle": type.DisplayName,
            "View": isProvider ? "Provider" : "General",
            "LocationName": getAlertsLocationNames()
        });
        let days = moment(params.TotDate, "YYYY-MM-DD").diff(moment(params.FromDate, "YYYY-MM-DD"), "days");

        let reqObj = {
            "ExportJobId": 0,
            "UserId": $scope.UserId,
            "RequestedByUserId": $scope.UserId,
            "RequestedByUserName": doctorInfo.doctordata.User[0].FullName || "",
            "OrganizationId": $scope.HospitalID,
            "ParentOrganizationId": $scope.ParentHospitalID,
            "ReportName": "Confirmation Alerts - " + type.DisplayName + (isProvider ? " by Provider" : "") + " - " + $scope.AlertsFilter.FromDate + " to " + $scope.AlertsFilter.ToDate,
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
            /* The sheet's rows as the screen labels them - the api reads Metrics here, not inside RequestDetails. */
            "Metrics": [AlertTotalMetric].concat(AlertMetrics).map(function (metric) {
                return { "Key": metric.Key, "Label": metric.Label, "Tone": metric.Tone, "Bold": !!metric.Bold };
            }),
            "RequestDetails": params
        };

        $scope.AlertsExport.Busy = true;
        eHnoteInsuranceService.InitiateASCReportCSVData(reqObj).then(function (resp) {
            $scope.AlertsExport.Busy = false;
            if (resp.data.status == "Success") {
                alertify.success("Excel export started - check the download list for the file.");
            } else {
                alertify.error(resp.data.Message || "Excel export failed");
            }
        }, function (err) {
            console.log(err);
            $scope.AlertsExport.Busy = false;
            alertify.error("Excel export failed");
        });
    };

    /* Prints the sheet as it is on screen, in its own window so the app around it stays out of the page. */
    $scope.PrintConfirmationAlerts = function () {
        let sheet = document.getElementById("div__ConfirmationAlertsSheet--");
        if (!sheet || $scope.AlertsResult.Days.length === 0) {
            alertify.error("No data to print");
            return;
        }
        let printWindow = window.open("", "_blank");
        if (!printWindow) {
            alertify.error("Please allow pop-ups to print");
            return;
        }
        printWindow.document.write(
            "<html><head><title>Confirmation Alerts</title><style>" +
            "body{font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:11px;color:#0b0b0b;-webkit-print-color-adjust:exact;print-color-adjust:exact;}" +
            "table{border-collapse:collapse;}th,td{border:1px solid #dddddd;padding:3px 6px;white-space:nowrap;text-align:center;}" +
            ".asc-sheet__label{text-align:right;}.asc-sheet__caption{font-style:italic;}" +
            ".asc-sheet__band td{background:#dde8f3;font-weight:700;}.asc-sheet__provider td{background:#fff8d6;font-weight:700;text-align:left;}" +
            ".tone-good{color:#006300;}.tone-bad{color:#d03b3b;}.tone-neutral{color:#52514e;}.tone-total,.asc-sheet__bold,.asc-sheet__total{font-weight:700;}" +
            "</style></head><body><h3>Confirmation Alerts " + getAlertsPeriodText() + "</h3>" + sheet.innerHTML + "</body></html>");
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };

    /* ---------- init ---------- */

    $scope.InitConfirmationAlerts = function () {
        $scope.AlertsView = { "Group": "General" };
        $scope.AlertsResult = getAlertsResult();
        resetAlertsFilters();
        /* The procs need the doctor ids and the Visit Reason filter its list, so the first load waits for both. */
        $q.all([loadAlertsDoctors(), loadAlertsVisitReasons()]).then(function () {
            loadConfirmationAlerts();
        });
    };

    $scope.InitConfirmationAlerts();

}]);

"use strict";
/*
 * Admin > Users > "Time Slots (New)" tab - guided schedule wizard.
 * List -> 4 steps (Basics & hours, Slot detail, Applies, Review) -> one save.
 * API: Admin/GetUserSchedulesV2, Admin/SaveUserScheduleV2, Admin/SetUserScheduleActiveV2
 * Reads the provider from the parent EhnoteAdminUserCtrl scope (MainUserObj.BasicInfo).
 * Times are held as Date objects (Angular 1.4 input[type=time]) and sent as "HH:mm".
 */
eHnoteWebApp.controller('TimeSlotsV2Ctrl', ['$scope', '$filter', '$timeout', 'alertify', 'eHnoteMasterDataService', 'eHnoteMainAdminServices', 'eHnotePatientVisitReasonServices', 'eHnoteInsuranceService', 'eHnoteScheduleV2ViewService',
    function ($scope, $filter, $timeout, alertify, eHnoteMasterDataService, eHnoteMainAdminServices, eHnotePatientVisitReasonServices, eHnoteInsuranceService, scheduleV2View) {

        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        var hospitalInfo = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo;
        var basicInfo = ($scope.MainUserObj && $scope.MainUserObj.BasicInfo) || {};

        var DAYS = [
            { id: 1, name: "Mon" }, { id: 2, name: "Tue" }, { id: 3, name: "Wed" }, { id: 4, name: "Thu" },
            { id: 5, name: "Fri" }, { id: 6, name: "Sat" }, { id: 7, name: "Sun" }
        ];
        // One list, shared with the doctor profile's Schedule tab
        var REPEATS = scheduleV2View.REPEATS;
        var DURATIONS = [5, 10, 15, 20, 30, 45, 60, 90, 120];

        // Everything lives under one object so nothing leaks into the parent controller's scope
        var vm = $scope.tsv2 = {
            days: DAYS,
            repeats: scheduleV2View.selectableRepeats(),
            durations: DURATIONS,
            stepLabels: ["Basics & hours", "Slot detail", "Applies", "Review"],
            view: "list",
            step: 1,
            loading: false,
            saving: false,
            schedules: [],
            otherVisibleCount: 3,
            expanded: {},
            branches: [],
            reasonsByBranch: {},
            onlineReasons: [],
            payors: [],
            openPicker: null,
            showPayerInfo: false
        };

        /* ------------------------------------------------------------ helpers */

        function pad(n) { return (n < 10 ? "0" : "") + n; }
        function hhmmToDate(s) {
            var p = (s || "00:00").split(":");
            return new Date(1970, 0, 1, parseInt(p[0], 10) || 0, parseInt(p[1], 10) || 0, 0);
        }
        // "HH:mm" is what the API stores and what internal keys are built from.
        function dateToHhmm(d) { return d ? pad(d.getHours()) + ":" + pad(d.getMinutes()) : ""; }
        // Everything shown on screen uses 12-hour AM/PM, like the classic Time Slots screen.
        function dateToAmPm(d) {
            if (!d) return "";
            var h = d.getHours(), suffix = h < 12 ? "AM" : "PM";
            return ((h % 12) || 12) + ":" + pad(d.getMinutes()) + " " + suffix;
        }
        function mins(d) { return d ? d.getHours() * 60 + d.getMinutes() : 0; }
        function minsToDate(m) { return new Date(1970, 0, 1, Math.floor(m / 60), m % 60, 0); }
        function ymd(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
        function parseYmd(s) {
            if (!s) return null;
            var p = s.substring(0, 10).split("-");
            return new Date(parseInt(p[0], 10), parseInt(p[1], 10) - 1, parseInt(p[2], 10));
        }
        function dayIdOf(date) { return (date.getDay() + 6) % 7 + 1; } // Mon=1 .. Sun=7
        function dayName(id) { return DAYS[id - 1].name; }
        function isOk(resp) {
            var d = resp && resp.data ? resp.data : resp;
            return d && (d.status === "Success" || d.Status === "Success");
        }
        vm.fmtTime = dateToAmPm;
        vm.dayName = dayName;
        // Dates are shown MM-DD-YYYY; the API keeps yyyy-MM-dd
        vm.fmtDate = function (v) {
            var d = (typeof v === "string") ? parseYmd(v) : v;
            return d ? pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + "-" + d.getFullYear() : "";
        };

        /* ------------------------------------------------------------ lookups */

        function loadBranches() {
            var roles = basicInfo.UserBranchRoles || [];
            vm.branches = (basicInfo.UserWorkingBranches || []).map(function (b) {
                var role = roles.filter(function (r) { return r.BranchId === b.BranchId; })[0];
                return {
                    BranchId: b.BranchId,
                    BranchName: b.BranchName,
                    UserBranchId: b.UserBranchId,
                    // The provider's Average Consultation Time (Manage Users > profile)
                    // is what the duration starts at. The branch role's walk-in average
                    // is only a fallback for a provider who has no profile duration set.
                    DefaultDuration: parseInt(basicInfo.AverageConsultationTime, 10) || parseInt(role && role.WalkInAvgConslTime, 10) || 15
                };
            });
        }
        function branchById(id) { return vm.branches.filter(function (b) { return b.BranchId === id; })[0]; }
        vm.branchDefaultDuration = function (branchId) {
            var b = branchById(branchId);
            return b ? b.DefaultDuration : 15;
        };

        function loadReasons(branchId) {
            if (!branchId || vm.reasonsByBranch[branchId]) return;
            vm.reasonsByBranch[branchId] = [];
            // Same request as the appointment list's visit reason filter (EhnoteNewAppointmentListCtrl)
            eHnotePatientVisitReasonServices.GetOrganizationActiveAppointmentVisitReasonsById({
                "OrganizationId": branchId, "VisitTypeId": 0, "SearchText": ""
            }).then(function (resp) {
                var rows = (resp.data && resp.data.rows) || [];
                vm.reasonsByBranch[branchId] = rows.filter(function (r) { return r.ActiveIND === "Y"; });
            });
        }
        vm.reasonsFor = function (g) { return vm.reasonsByBranch[g.branchId] || []; };

        // Online slots use the organisation's online visit reasons (same call as the classic screen)
        function loadOnlineReasons() {
            eHnotePatientVisitReasonServices.GetOnlineAppointmentVisitReasons({
                "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ParentOrganizationId || hospitalInfo.ParentHospitalID,
                "SearchText": "", "IsActive": 0
            }).then(function (resp) {
                vm.onlineReasons = ((resp.data && resp.data.rows) || []).sort(function (a, b) {
                    return (a.OnlineVisitReason || "").localeCompare(b.OnlineVisitReason || "", undefined, { numeric: true, sensitivity: "base" });
                });
            });
        }

        function loadPayors() {
            eHnoteInsuranceService.GetOrganizationInsurancePayorsList({
                "SearchText": "", "Status": "Active", "PageSize": 1000, "PageNumber": 1,
                "UserId": eHnoteMasterDataService.getLoginId(), "SpecializationId": $scope.SpecializationId,
                "OrganizationId": hospitalInfo.HospitalID, "ParentOrganizationId": hospitalInfo.ParentHospitalID,
                "GetAllIndicator": 0, "PayorId": 0, "PayorTypeId": 0
            }).then(function (resp) {
                var rows = (resp.data && resp.data.rows) || [];
                rows.unshift({ "PayorId": 0, "OrganizationPayorId": 0, "PayorName": "Self Pay", "PayorTypeId": 38 });
                vm.payors = rows;
            });
        }

        /* ------------------------------------------------------------ server -> model */

        // Mapping the GetUserSchedulesV2 payload into this screen's model is shared
        // with the doctor profile's Schedule tab - see eHnoteScheduleV2ViewService.
        function fromServer(row) { return scheduleV2View.fromServer(row); }

        /* ------------------------------------------------------------ list */

        vm.load = function () {
            vm.loading = true;
            eHnoteMainAdminServices.GetUserSchedulesV2({
                "UserId": basicInfo.UserId, "BranchId": hospitalInfo.HospitalID, "UserScheduleId": 0
            }).then(function (resp) {
                vm.loading = false;
                if (!isOk(resp)) { alertify.error((resp.data && resp.data.Message) || "Could not load schedules"); return; }
                vm.schedules = (resp.data.rows || []).map(fromServer);
                vm.schedules.forEach(function (s) { s.groups.forEach(function (g) { loadReasons(g.branchId); }); });
            }, function () {
                vm.loading = false;
                alertify.error("Could not load schedules");
            });
        };

        vm.activeSchedules = function () { return vm.schedules.filter(function (s) { return s.activeNow; }); };
        vm.otherSchedules = function () { return vm.schedules.filter(function (s) { return !s.activeNow; }); };
        vm.showMore = function () { vm.otherVisibleCount += 3; };
        vm.toggleExpanded = function (key) { vm.expanded[key] = !vm.expanded[key]; };

        vm.dateSummary = function (s) {
            if (s.dateMode === "custom") {
                return s.customDates.length + " one-off date" + (s.customDates.length === 1 ? "" : "s");
            }
            var rep = REPEATS.filter(function (r) { return r.id === s.everyType; })[0];
            return (s.fromDate ? vm.fmtDate(s.fromDate) : "?") + " → " + (s.toDate ? vm.fmtDate(s.toDate) : "?") + " · " + (rep ? rep.name : "");
        };

        vm.durationSummary = scheduleV2View.durationSummary;
        vm.createdSummary = scheduleV2View.createdSummary;

        // Day cap for the list card. Groups can differ, so only summarise when they
        // agree; where they don't, each group's own line carries its cap.
        vm.capSummary = function (s) {
            var caps = s.groups.map(function (g) { return parseInt(g.maxPerDay, 10) || 0; });
            if (!caps.length || caps[0] <= 0) return "";
            var same = caps.every(function (c) { return c === caps[0]; });
            return same ? "Max " + caps[0] + "/day" : "";
        };

        vm.deleteSchedule = function (s) {
            alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure want to delete this schedule?</h4> ", function () {
                eHnoteMainAdminServices.DeleteUserScheduledSlots({
                    "UserId": eHnoteMasterDataService.getLoginId(),
                    "DoctorId": s.doctorId,
                    "BranchId": s.branchId,
                    "UserScheduleId": s.id,
                    "DeleteInd": "Y"
                }, function (resp) {
                    if (isOk(resp)) { alertify.success("Schedule deleted"); vm.load(); }
                    else { alertify.error((resp && resp.Message) || "Delete failed"); }
                }, function () { alertify.error("Some Error Occured"); });
            }, function () { });
        };

        /* ------------------------------------------------------------ wizard: open */

        function emptyBuilding() {
            var b = vm.branches[0] || {};
            return {
                days: [], branchId: b.BranchId, start: hhmmToDate("08:00"), end: hhmmToDate("17:00"),
                duration: b.DefaultDuration || 15, maxSlots: 1, maxPerDay: 0
            };
        }

        function openWizard(model) {
            vm.model = model;
            vm.building = emptyBuilding();
            vm.editingGroupIndex = null;
            vm.editingSlotsGroup = null;
            vm.openPicker = null;
            vm.expandedSummary = null;
            // Leaving the wizard with the "Pick times" panel open used to carry its
            // ticked times into the next schedule, so clear it and its cache here.
            vm.bulk = null;
            bulkCache = { key: null, list: [] };
            vm.step = 1;
            var first = model.customDates[0] ? parseYmd(model.customDates[0]) : (model.fromDate || new Date());
            vm.cal = { year: first.getFullYear(), month: first.getMonth() };
            model.groups.forEach(function (g) { loadReasons(g.branchId); });
            vm.view = "wizard";
        }

        vm.startNew = function () {
            var from = new Date(); from.setHours(0, 0, 0, 0);
            openWizard({
                id: 0, doctorId: basicInfo.UserId, branchId: hospitalInfo.HospitalID,
                name: "", payerRestricted: false, active: true, isV2: true,
                // To is left empty on purpose - the user has to choose when it ends
                dateMode: "recurring", everyType: 1, fromDate: from, toDate: null, customDates: [], groups: []
            });
        };

        vm.edit = function (s) {
            if (s.isLegacyOnly) return;
            openWizard(angular.copy(s));
        };

        vm.backToList = function () { vm.view = "list"; vm.load(); };

        // Leaving the wizard throws away everything entered since it opened, so only
        // walk out silently when there is nothing to lose.
        vm.cancelSchedule = function () {
            var touched = (vm.model.name || "").trim() || vm.model.groups.length;
            if (!touched) { vm.backToList(); return; }
            alertify.confirm(
                "<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Discard this schedule? Nothing entered here has been saved.</h4> ",
                function () { $timeout(function () { vm.backToList(); }); },
                function () { });
        };

        // Same checks whether the user clicks Save & Continue or a tab at the top:
        // every step before the one being opened has to be complete.
        vm.goStep = function (n) {
            if (n > 1 && !validateBasics(true)) return;
            if (n > 2 && !validateSlots(true)) return;
            if (n > 3 && !validateDates(true)) return;
            vm.openPicker = null;
            vm.step = n;
        };

        function validateBasics(showError) {
            var msg = null;
            if (!(vm.model.name || "").trim()) msg = "Enter a schedule name";
            else if (!vm.model.groups.length) msg = "Add at least one day group first";
            if (msg && showError) alertify.error(msg);
            return !msg;
        }

        /* ------------------------------------------------------------ step 1: day groups */

        vm.dayTaken = function (dayId) {
            return vm.model.groups.some(function (g, i) { return i !== vm.editingGroupIndex && g.days.indexOf(dayId) >= 0; });
        };
        vm.toggleBuildingDay = function (dayId) {
            if (vm.dayTaken(dayId)) return;
            var i = vm.building.days.indexOf(dayId);
            if (i >= 0) vm.building.days.splice(i, 1); else vm.building.days.push(dayId);
            vm.building.days.sort();
        };
        vm.onBuildingBranch = function () { vm.building.duration = vm.branchDefaultDuration(vm.building.branchId); };

        vm.saveGroup = function () {
            var b = vm.building;
            if (!b.days.length) { alertify.error("Select at least one day"); return; }
            if (!b.start || !b.end || mins(b.end) <= mins(b.start)) { alertify.error("End time must be after start time"); return; }
            var branch = branchById(b.branchId);
            if (!branch) { alertify.error("Select a branch"); return; }
            var data = {
                days: b.days.slice(), branchId: branch.BranchId, branchName: branch.BranchName, userBranchId: branch.UserBranchId,
                start: b.start, end: b.end, duration: parseInt(b.duration, 10),
                maxSlots: parseInt(b.maxSlots, 10) || 1, maxPerDay: parseInt(b.maxPerDay, 10) || 0
            };
            if (vm.editingGroupIndex !== null) {
                var g = vm.model.groups[vm.editingGroupIndex];
                // Slot detail and the picked dates are built on this group's branch,
                // hours, duration and days. Once any of those move the old setup no
                // longer fits, so ask before dropping it rather than keeping a
                // configuration that does not match what the group now says.
                if (dependentsBroken(g, data)) {
                    alertify.confirm(
                        "<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>" +
                        resetWarning(g, data) + " Continue?</h4> ",
                        // $timeout, not $apply: alertify may fire this inside a digest
                        function () { $timeout(function () { applyGroupEdit(g, data); }); },
                        function () { });
                    return;
                }
                applyGroupEdit(g, data);
            } else {
                data.slots = [];
                vm.model.groups.push(data);
                loadReasons(data.branchId);
                vm.building = emptyBuilding();
            }
        };

        // Which of this group's settings the later steps are built on
        function dependentsBroken(g, data) {
            var slotsAffected = g.slots.length && (g.branchId !== data.branchId ||
                mins(g.start) !== mins(data.start) || mins(g.end) !== mins(data.end) ||
                g.duration !== data.duration);
            return !!(slotsAffected || datesDroppedBy(g, data).length);
        }

        // Custom dates that would be left on a weekday no group covers any more
        function datesDroppedBy(g, data) {
            if (vm.model.dateMode !== "custom" || !vm.model.customDates.length) return [];
            var covered = {};
            vm.model.groups.forEach(function (x) {
                (x === g ? data.days : x.days).forEach(function (d) { covered[d] = true; });
            });
            return vm.model.customDates.filter(function (ds) { return !covered[dayIdOf(parseYmd(ds))]; });
        }

        function resetWarning(g, data) {
            var parts = [];
            if (g.slots.length && (g.branchId !== data.branchId || mins(g.start) !== mins(data.start) ||
                mins(g.end) !== mins(data.end) || g.duration !== data.duration)) {
                parts.push("the " + g.slots.length + " slot" + (g.slots.length === 1 ? "" : "s") + " configured for this group");
            }
            var dropped = datesDroppedBy(g, data);
            if (dropped.length) parts.push(dropped.length + " picked date" + (dropped.length === 1 ? "" : "s") + " that no longer fall on a scheduled day");
            return "This change clears " + parts.join(" and ") + ".";
        }

        function applyGroupEdit(g, data) {
            if (g.branchId !== data.branchId || mins(g.start) !== mins(data.start) ||
                mins(g.end) !== mins(data.end) || g.duration !== data.duration) {
                g.slots = [];
                if (vm.editingSlotsGroup === vm.editingGroupIndex) vm.editingSlotsGroup = null;
                vm.bulk = null;
                bulkCache = { key: null, list: [] };
            }
            var dropped = datesDroppedBy(g, data);
            angular.extend(g, data);
            dropped.forEach(function (ds) {
                var i = vm.model.customDates.indexOf(ds);
                if (i >= 0) vm.model.customDates.splice(i, 1);
            });
            vm.editingGroupIndex = null;
            loadReasons(data.branchId);
            vm.building = emptyBuilding();
        }
        vm.editGroup = function (i) {
            var g = vm.model.groups[i];
            vm.editingGroupIndex = i;
            vm.building = { days: g.days.slice(), branchId: g.branchId, start: g.start, end: g.end, duration: g.duration, maxSlots: g.maxSlots, maxPerDay: g.maxPerDay || 0 };
        };
        vm.cancelEditGroup = function () { vm.editingGroupIndex = null; vm.building = emptyBuilding(); };
        vm.removeGroup = function (i) {
            vm.model.groups.splice(i, 1);
            if (vm.editingGroupIndex === i) vm.cancelEditGroup();
        };

        /* ------------------------------------------------------------ step 2: slot detail */

        vm.toggleEditSlots = function (gi) { vm.editingSlotsGroup = vm.editingSlotsGroup === gi ? null : gi; vm.openPicker = null; };
        vm.toggleSummary = function (gi) { vm.expandedSummary = vm.expandedSummary === gi ? null : gi; };

        vm.sortedSlots = function (g) {
            return g.slots.slice().sort(function (a, b) { return mins(a.start) - mins(b.start); });
        };

        vm.addSlot = function (g) {
            var startM = mins(g.start);
            g.slots.forEach(function (s) { startM = Math.max(startM, mins(s.end)); });
            var endM = mins(g.end);
            if (startM >= endM) startM = Math.max(mins(g.start), endM - g.duration);
            var stopM = Math.min(startM + 60, endM);
            var slot = {
                type: "Availability", start: minsToDate(startM), end: minsToDate(stopM),
                duration: g.duration, maxSlots: g.maxSlots, reasons: [], onlineReasons: [], payors: []
            };
            if (wouldExceedDayCap(g, slotBookings(slot))) {
                alertify.error(dayCapMsg(g));
                return;
            }
            g.slots.push(slot);
            markNew([slot]);
        };
        vm.removeSlot = function (g, s) { g.slots.splice(g.slots.indexOf(s), 1); };

        vm.onSlotType = function (s) {
            s.onlineReasons = s.onlineReasons || [];
            if (s.type === "Break") {
                var span = mins(s.end) - mins(s.start);
                if (span > 0) s.duration = span;
                // a break blocks booking, so it has no reasons, payors or max slots
                s.reasons = []; s.onlineReasons = []; s.payors = []; s.maxSlots = null;
                s.reasonsNone = false; s.onlineNone = false; s.payorsNone = false;
            }
            // reason lists are per type: walk-in reasons vs online reasons
            if (s.type === "Availability") { s.onlineReasons = []; s.onlineNone = false; }
            if (s.type === "Online") { s.reasons = []; s.reasonsNone = false; }
        };

        vm.durationOptions = function (current) {
            var list = DURATIONS.slice();
            if (current && list.indexOf(current) < 0) { list.push(current); list.sort(function (a, b) { return a - b; }); }
            return list;
        };

        vm.slotInfo = function (g, s) {
            var span = mins(s.end) - mins(s.start);
            var info = { span: span, count: 0, warnings: [] };
            if (!s.start || !s.end || span <= 0) { info.warnings.push("End must be after start."); return info; }
            info.count = Math.floor(span / s.duration);
            if (mins(s.start) < mins(g.start) || mins(s.end) > mins(g.end)) {
                info.warnings.push("Outside the group hours (" + dateToAmPm(g.start) + " – " + dateToAmPm(g.end) + ").");
            }
            if (s.duration > span) {
                info.warnings.push("Slot duration " + s.duration + " min doesn't fit in a " + span + "-min block — widen the end time or pick a shorter duration.");
            } else if (span % s.duration !== 0) {
                info.warnings.push("The last " + (span % s.duration) + " min won't be bookable — the block isn't a multiple of " + s.duration + " min.");
            }
            var sorted = vm.sortedSlots(g), next = sorted[sorted.indexOf(s) + 1];
            if (next && mins(s.end) > mins(next.start)) {
                info.warnings.push("Overlaps the next row (starts " + dateToAmPm(next.start) + ") — shorten this block's end time.");
            }
            return info;
        };

        // pickers (reasons / payors)
        vm.togglePicker = function (key, $event) {
            if ($event) $event.stopPropagation();
            vm.openPicker = vm.openPicker === key ? null : key;
            vm.pickerSearch = { text: "" };
        };
        /* An empty saved list means "every reason accepted", so empty cannot also stand
         * for "none picked" - every schedule saved before this would load as empty and
         * read as none. The cleared state is held in its own flag instead:
         *     reasonsNone = false, reasons = []      -> all (what the API stores)
         *     reasonsNone = false, reasons = [a, b]  -> just those
         *     reasonsNone = true,  reasons = []      -> none, cleared by unticking All
         * "None" is an editing state only: validateSlots refuses to leave step 2 with
         * it, because a slot the API accepts with no reasons would mean all again.
         */
        function reasonRow(r) { return { ReasonId: r.ReasonId, VisitTypeId: r.VisitTypeId, Reason: r.Reason }; }

        vm.hasReason = function (s, r) {
            if (s.reasonsNone) return false;
            return !s.reasons.length || s.reasons.some(function (x) { return x.ReasonId === r.ReasonId; });
        };
        vm.allReasons = function (s, g) {
            if (s.reasonsNone) return false;
            return !s.reasons.length || s.reasons.length === vm.reasonsFor(g).length;
        };
        vm.toggleReason = function (g, s, r) {
            if (s.reasonsNone) {            // first pick after clearing
                s.reasonsNone = false;
                s.reasons = [reasonRow(r)];
                if (r.DefaultDurationMinutes) s.duration = parseInt(r.DefaultDurationMinutes, 10);
                return;
            }
            if (!s.reasons.length) {        // unticking one while All is on = all the others
                s.reasons = vm.reasonsFor(g)
                    .filter(function (x) { return x.ReasonId !== r.ReasonId; })
                    .map(reasonRow);
                if (!s.reasons.length) s.reasonsNone = true;
                return;
            }
            var i = -1;
            s.reasons.forEach(function (x, k) { if (x.ReasonId === r.ReasonId) i = k; });
            if (i >= 0) {
                s.reasons.splice(i, 1);
                // emptying the list by hand means none, not a silent jump back to all
                if (!s.reasons.length) s.reasonsNone = true;
            } else {
                s.reasons.push(reasonRow(r));
                // first reason with a default length sets the slot duration (like the classic screen)
                if (s.reasons.length === 1 && r.DefaultDurationMinutes) s.duration = parseInt(r.DefaultDurationMinutes, 10);
            }
        };
        // Ticking All selects everything; unticking it clears everything.
        vm.setAllReasons = function (s, g) {
            s.reasonsNone = vm.allReasons(s, g);
            s.reasons = [];
        };
        // Button label: one pick shows its name, several show the count, all show "All"
        vm.reasonLabel = function (s, g) {
            if (s.reasonsNone) return "No visit reasons";
            if (vm.allReasons(s, g)) return "All visit reasons";
            return s.reasons.length === 1 ? reasonName(s.reasons[0]) : s.reasons.length + " selected";
        };
        // Saved reasons may come back without a name; take it from the loaded reason lists
        function reasonName(x) {
            if (x.Reason) return x.Reason;
            var found = null;
            Object.keys(vm.reasonsByBranch).some(function (k) {
                found = vm.reasonsByBranch[k].filter(function (r) { return String(r.ReasonId) === String(x.ReasonId); })[0];
                return !!found;
            });
            return found ? found.Reason : x.ReasonId;
        }
        vm.reasonSummary = function (s) {
            return s.reasons.length ? s.reasons.map(reasonName).join(", ") : "";
        };

        function onlineRow(r) { return { ParentOnlineAppointmentVisitReasonId: r.ParentOnlineAppointmentVisitReasonId, OnlineVisitReason: r.OnlineVisitReason }; }

        vm.hasOnlineReason = function (s, r) {
            if (s.onlineNone) return false;
            var list = s.onlineReasons || [];
            return !list.length || list.some(function (x) { return x.ParentOnlineAppointmentVisitReasonId === r.ParentOnlineAppointmentVisitReasonId; });
        };
        vm.allOnlineReasons = function (s) {
            if (s.onlineNone) return false;
            var list = s.onlineReasons || [];
            return !list.length || list.length === vm.onlineReasons.length;
        };
        vm.toggleOnlineReason = function (s, r) {
            s.onlineReasons = s.onlineReasons || [];
            if (s.onlineNone) {
                s.onlineNone = false;
                s.onlineReasons = [onlineRow(r)];
                return;
            }
            if (!s.onlineReasons.length) {
                s.onlineReasons = vm.onlineReasons
                    .filter(function (x) { return x.ParentOnlineAppointmentVisitReasonId !== r.ParentOnlineAppointmentVisitReasonId; })
                    .map(onlineRow);
                if (!s.onlineReasons.length) s.onlineNone = true;
                return;
            }
            var i = -1;
            s.onlineReasons.forEach(function (x, k) { if (x.ParentOnlineAppointmentVisitReasonId === r.ParentOnlineAppointmentVisitReasonId) i = k; });
            if (i >= 0) {
                s.onlineReasons.splice(i, 1);
                if (!s.onlineReasons.length) s.onlineNone = true;
            } else {
                s.onlineReasons.push(onlineRow(r));
            }
        };
        vm.setAllOnlineReasons = function (s) {
            s.onlineNone = vm.allOnlineReasons(s);
            s.onlineReasons = [];
        };
        vm.onlineReasonLabel = function (s) {
            var list = s.onlineReasons || [];
            if (s.onlineNone) return "No online visit reasons";
            if (vm.allOnlineReasons(s)) return "All online visit reasons";
            return list.length === 1 ? (list[0].OnlineVisitReason || list[0].ParentOnlineAppointmentVisitReasonId) : list.length + " selected";
        };
        vm.onlineReasonSummary = function (s) {
            return (s.onlineReasons || []).map(function (x) { return x.OnlineVisitReason || x.ParentOnlineAppointmentVisitReasonId; }).join(", ");
        };

        function payorRow(p) {
            return { OrganizationPayorId: p.OrganizationPayorId, PayorId: p.PayorId, PayorTypeId: p.PayorTypeId, PayorTypeName: p.PayorTypeName || "", PayorName: p.PayorName };
        }
        vm.hasPayor = function (s, p) {
            if (s.payorsNone) return false;
            return !s.payors.length || s.payors.some(function (x) { return x.PayorId === p.PayorId; });
        };
        vm.allPayors = function (s) {
            if (s.payorsNone) return false;
            return !s.payors.length || s.payors.length === vm.payors.length;
        };
        vm.togglePayor = function (s, p) {
            if (s.payorsNone) {
                s.payorsNone = false;
                s.payors = [payorRow(p)];
                return;
            }
            if (!s.payors.length) {
                s.payors = vm.payors.filter(function (x) { return x.PayorId !== p.PayorId; }).map(payorRow);
                if (!s.payors.length) s.payorsNone = true;
                return;
            }
            var i = -1;
            s.payors.forEach(function (x, k) { if (x.PayorId === p.PayorId) i = k; });
            if (i >= 0) {
                s.payors.splice(i, 1);
                if (!s.payors.length) s.payorsNone = true;
            } else {
                s.payors.push(payorRow(p));
            }
        };
        vm.setAllPayors = function (s) {
            s.payorsNone = vm.allPayors(s);
            s.payors = [];
        };
        vm.payorLabel = function (s) {
            if (s.payorsNone) return "No payors";
            if (vm.allPayors(s)) return "All payors";
            return s.payors.length === 1 ? s.payors[0].PayorName : s.payors.length + " selected";
        };
        vm.payorSummary = function (s) { return s.payors.map(function (x) { return x.PayorName; }).join(", "); };

        // Shared with the doctor profile's Schedule tab - see eHnoteScheduleV2ViewService.
        // reasonName is passed in because only this screen holds the branch reason lists.
        vm.summaryRows = function (g) {
            return scheduleV2View.summaryRows(g, {
                payerRestricted: !!(vm.model && vm.model.payerRestricted),
                reasonName: reasonName
            });
        };

        // Bookings one slot can take: its max x the number of pieces it splits into.
        function slotBookings(s) {
            if (!s || s.type === "Break") return 0;
            var span = mins(s.end) - mins(s.start);
            if (span <= 0 || !s.duration) return 0;
            return Math.floor(span / s.duration) * (parseInt(s.maxSlots, 10) || 0);
        }

        // Bookings a day can take: per-slot max x number of slots (breaks don't count)
        vm.dayTotal = function (g) {
            var total = 0;
            g.slots.forEach(function (s) { total += slotBookings(s); });
            return total;
        };

        // The classic screen refuses the add outright once the day cap would be broken
        // ("Overall Max slot limit cannot be exceeded!"), rather than letting the row in.
        // extra = bookings the pending add would contribute. 0 cap = no limit, as in classic.
        function wouldExceedDayCap(g, extra) {
            var cap = parseInt(g.maxPerDay, 10) || 0;
            return cap > 0 && (vm.dayTotal(g) + extra) > cap;
        }

        // Short, plain wording for the day cap.
        function dayCapMsg(g) {
            var cap = parseInt(g.maxPerDay, 10) || 0;
            return "Maximum " + cap + " slot" + (cap === 1 ? "" : "s") + " are allowed per day.";
        }

        // Newly added rows flash briefly so it is obvious where a bulk pick landed.
        function markNew(slots) {
            slots.forEach(function (s) { s.isNew = true; });
            $timeout(function () { slots.forEach(function (s) { delete s.isNew; }); }, 2500);
        }

        /* ---------- add several slots at once ("Pick times", like the classic Select Timeslot) ---------- */

        vm.openBulk = function (g, gi) {
            vm.bulk = {
                gi: gi, type: "Availability", duration: g.duration, maxSlots: g.maxSlots,
                // Start every: how far apart the offered start times are. The classic
                // advanced-slots screen stepped by the schedule's own grid, so a 60-min
                // slot could start at 9:00, 9:05, 9:10 ... and a window like
                // 9:30 - 10:30 is reachable. Stepping by the slot length instead only
                // ever offers 8:00, 9:00, 10:00 and 9:30 - 10:30 cannot be built.
                step: g.duration,
                reasons: [], onlineReasons: [], payors: [], picked: {}
            };
            vm.openPicker = null;
            pickVersion++;
        };
        vm.closeBulk = function () { vm.bulk = null; vm.openPicker = null; };

        // Start every: anything up to the slot length itself
        vm.bulkStepOptions = function () {
            var d = parseInt(vm.bulk.duration, 10) || 0;
            var list = DURATIONS.filter(function (x) { return x <= d; });
            if (d && list.indexOf(d) < 0) list.push(d);
            var cur = parseInt(vm.bulk.step, 10);
            if (cur && list.indexOf(cur) < 0) list.push(cur);
            return list.sort(function (a, b) { return a - b; });
        };

        // Candidate windows across the group hours: each is `duration` long and they
        // start every `step` minutes, so neighbouring options overlap on purpose.
        vm.bulkTimes = function (g) {
            var list = [], endM = mins(g.end);
            var d = parseInt(vm.bulk.duration, 10) || g.duration;
            var step = parseInt(vm.bulk.step, 10) || d;
            for (var m = mins(g.start); m + d <= endM; m += step) {
                var end = m + d;
                var taken = g.slots.some(function (s) { return mins(s.start) < end && mins(s.end) > m; });
                list.push({
                    key: dateToHhmm(minsToDate(m)), m: m, end: end, taken: taken,
                    label: dateToAmPm(minsToDate(m)) + " – " + dateToAmPm(minsToDate(end))
                });
            }
            return list;
        };
        var bulkCache = { key: null, list: [] };
        vm.bulkTimesCached = function (g) {
            var key = [vm.bulk.duration, vm.bulk.step, dateToHhmm(g.start), dateToHhmm(g.end), g.slots.length,
                g.slots.map(function (s) { return dateToHhmm(s.start) + dateToHhmm(s.end); }).join()].join("|");
            if (bulkCache.key !== key) { bulkCache = { key: key, list: vm.bulkTimes(g) }; pickVersion++; }
            return bulkCache.list;
        };

        /* Overlapping candidates: once 9:30 - 10:30 is ticked, 10:00 - 11:00 can no
         * longer be added. Worked out once per change of the picks rather than per
         * candidate per digest, since a 5-min step over a working day is ~100 of them.
         */
        var pickVersion = 0, blockedCache = { v: -1, map: {} };
        function blockedMap(g) {
            var list = vm.bulkTimesCached(g), picked = [], map = {};
            list.forEach(function (t) { if (vm.bulk.picked[t.key]) picked.push(t); });
            list.forEach(function (t) {
                if (vm.bulk.picked[t.key]) return;          // a pick never blocks itself
                map[t.key] = picked.some(function (p) { return p.m < t.end && p.end > t.m; });
            });
            return map;
        }
        // true when this window cannot be added: already covered by a saved slot, or
        // it would overlap one of the windows ticked in this batch.
        vm.bulkBlocked = function (g, t) {
            if (t.taken) return true;
            if (blockedCache.v !== pickVersion) blockedCache = { v: pickVersion, map: blockedMap(g) };
            return !!blockedCache.map[t.key];
        };

        // The ticked times are keyed by start time, so they mean something different
        // at another length - start the selection over, and never step wider than the slot.
        vm.onBulkDuration = function () {
            vm.bulk.picked = {};
            var d = parseInt(vm.bulk.duration, 10) || 0;
            if (d && (parseInt(vm.bulk.step, 10) || 0) > d) vm.bulk.step = d;
            pickVersion++;
        };
        vm.onBulkStep = function () { vm.bulk.picked = {}; pickVersion++; };

        vm.toggleBulkTime = function (g, t) {
            if (vm.bulkBlocked(g, t)) return;
            vm.bulk.picked[t.key] = !vm.bulk.picked[t.key];
            pickVersion++;
        };
        vm.bulkPickedCount = function () {
            return Object.keys(vm.bulk.picked).filter(function (k) { return vm.bulk.picked[k]; }).length;
        };
        // Fills the day back to back from the first free time, skipping anything that
        // would overlap - with overlapping candidates, ticking literally everything
        // would never be a valid batch.
        vm.bulkSelectAll = function (g) {
            if (vm.bulkPickedCount()) { vm.bulk.picked = {}; pickVersion++; return; }
            var lastEnd = -1;
            vm.bulkTimesCached(g).forEach(function (t) {
                if (t.taken || t.m < lastEnd) return;
                vm.bulk.picked[t.key] = true;
                lastEnd = t.end;
            });
            pickVersion++;
        };
        vm.bulkAdd = function (g) {
            var b = vm.bulk, d = parseInt(b.duration, 10) || g.duration;
            if (b.type === "Break") { b.reasons = []; b.onlineReasons = []; b.payors = []; b.reasonsNone = false; b.onlineNone = false; b.payorsNone = false; }

            // the picks apply to every slot added, so a cleared list has to be resolved first
            if (b.type === "Availability" && b.reasonsNone) { alertify.error("Pick at least one visit reason, or tick All visit reasons"); return; }
            if (b.type === "Online" && b.onlineNone) { alertify.error("Pick at least one online visit reason, or tick All online visit reasons"); return; }

            var pending = [];
            vm.bulkTimesCached(g).forEach(function (t) {
                if (t.taken || !b.picked[t.key]) return;
                pending.push({
                    type: b.type, start: minsToDate(t.m), end: minsToDate(t.m + d), duration: d,
                    maxSlots: b.type === "Break" ? null : (parseInt(b.maxSlots, 10) || 0),
                    reasons: angular.copy(b.reasons), onlineReasons: angular.copy(b.onlineReasons), payors: angular.copy(b.payors)
                });
            });
            if (!pending.length) { alertify.error("Tick at least one time"); return; }

            // Classic checks the whole batch at once (max x number of ticked timeslots) and
            // refuses it, so the panel stays open for the max or the picks to be lowered.
            var extra = 0;
            pending.forEach(function (s) { extra += slotBookings(s); });
            if (wouldExceedDayCap(g, extra)) {
                alertify.error(dayCapMsg(g));
                return;
            }

            pending.forEach(function (s) { g.slots.push(s); });
            markNew(pending);
            alertify.success(pending.length + " slot" + (pending.length === 1 ? "" : "s") + " added");
            vm.closeBulk();
        };

        function validateSlots(showError) {
            var msg = null;
            vm.model.groups.some(function (g) {
                var cap = parseInt(g.maxPerDay, 10) || 0;
                if (cap > 0 && vm.dayTotal(g) > cap) {
                    msg = dayCapMsg(g);
                    return true;
                }
                return false;
            });
            if (msg) { if (showError) alertify.error(msg); return false; }

            // A slot saved with nothing picked would be read back as "all", so the
            // cleared state has to be resolved before leaving this step.
            vm.model.groups.some(function (g) {
                return g.slots.some(function (s) {
                    var where = g.days.map(dayName).join("/") + " " + dateToAmPm(s.start) + ": ";
                    if (s.type === "Availability" && s.reasonsNone) { msg = where + "pick at least one visit reason, or tick All visit reasons."; return true; }
                    if (s.type === "Online" && s.onlineNone) { msg = where + "pick at least one online visit reason, or tick All online visit reasons."; return true; }
                    if (s.type !== "Break" && vm.model.payerRestricted && s.payorsNone) { msg = where + "pick at least one payor, or tick All payors."; return true; }
                    return false;
                });
            });
            if (msg) { if (showError) alertify.error(msg); return false; }

            vm.model.groups.some(function (g) {
                return g.slots.some(function (s) {
                    var w = vm.slotInfo(g, s).warnings.filter(function (x) { return x.indexOf("won't be bookable") < 0; });
                    if (w.length) { msg = g.days.map(dayName).join("/") + " " + dateToAmPm(s.start) + ": " + w[0]; return true; }
                    return false;
                });
            });
            if (msg && showError) alertify.error(msg);
            return !msg;
        }

        /* ------------------------------------------------------------ step 3: applies */

        vm.setDateMode = function (m) { vm.model.dateMode = m; };

        vm.calendar = function () {
            var y = vm.cal.year, m = vm.cal.month;
            var first = new Date(y, m, 1);
            var offset = (first.getDay() + 6) % 7;
            var total = new Date(y, m + 1, 0).getDate();
            var rows = Math.ceil((offset + total) / 7);
            var cursor = new Date(y, m, 1 - offset);
            var weeks = [];
            for (var r = 0; r < rows; r++) {
                var week = [];
                for (var i = 0; i < 7; i++) {
                    week.push({ ds: ymd(cursor), day: cursor.getDate(), inMonth: cursor.getMonth() === m, hasHours: vm.dayHasGroup(dayIdOf(cursor)) });
                    cursor.setDate(cursor.getDate() + 1);
                }
                weeks.push(week);
            }
            return weeks;
        };
        // Cache per month so ng-repeat keeps a stable array between digests
        var calCache = { key: null, weeks: [] };
        vm.weeks = function () {
            var key = vm.cal.year + "-" + vm.cal.month + "-" + vm.model.groups.map(function (g) { return g.days.join(""); }).join("|");
            if (calCache.key !== key) { calCache = { key: key, weeks: vm.calendar() }; }
            return calCache.weeks;
        };
        vm.monthTitle = function () { return $filter("date")(new Date(vm.cal.year, vm.cal.month, 1), "MMMM yyyy"); };
        vm.navCal = function (delta) {
            var m = vm.cal.month + delta, y = vm.cal.year;
            if (m < 0) { m = 11; y--; } if (m > 11) { m = 0; y++; }
            vm.cal = { year: y, month: m };
        };
        vm.dayHasGroup = function (dayId) { return vm.model.groups.some(function (g) { return g.days.indexOf(dayId) >= 0; }); };
        vm.isPicked = function (ds) { return vm.model.customDates.indexOf(ds) >= 0; };
        vm.toggleDate = function (ds) {
            var i = vm.model.customDates.indexOf(ds);
            if (i >= 0) vm.model.customDates.splice(i, 1); else vm.model.customDates.push(ds);
            vm.model.customDates.sort();
        };
        vm.weekAllPicked = function (week) { return week.every(function (c) { return vm.isPicked(c.ds); }); };
        vm.toggleWeek = function (week) {
            var all = vm.weekAllPicked(week);
            week.forEach(function (c) {
                var i = vm.model.customDates.indexOf(c.ds);
                if (all && i >= 0) vm.model.customDates.splice(i, 1);
                if (!all && i < 0) vm.model.customDates.push(c.ds);
            });
            vm.model.customDates.sort();
        };
        vm.monthAllPicked = function () { return vm.weeks().every(vm.weekAllPicked); };
        vm.toggleMonth = function () {
            var all = vm.monthAllPicked();
            vm.weeks().forEach(function (w) { if (vm.weekAllPicked(w) === all) vm.toggleWeek(w); });
        };
        vm.datesWithoutHours = function () {
            return vm.model.customDates.filter(function (ds) { return !vm.dayHasGroup(dayIdOf(parseYmd(ds))); });
        };

        function validateDates(showError) {
            var m = vm.model, msg = null;
            if (m.dateMode === "custom") {
                if (!m.customDates.length) msg = "Pick at least one date";
            } else {
                if (!m.fromDate || !m.toDate) msg = "Enter From and To dates";
                else if (m.toDate < m.fromDate) msg = "From date must be on or before To date";
            }
            if (msg && showError) alertify.error(msg);
            return !msg;
        }

        /* ------------------------------------------------------------ step 4: review & save */

        vm.repeatName = function (id) { var r = REPEATS.filter(function (x) { return x.id === id; })[0]; return r ? r.name : ""; };

        function toRequest() {
            var m = vm.model;
            return {
                "UserId": eHnoteMasterDataService.getLoginId(),
                "DoctorId": basicInfo.UserId,
                "BranchId": hospitalInfo.HospitalID,
                "UserScheduleId": m.id || 0,
                "UserScheduleName": (m.name || "").trim(),
                "IsInsuranceBasedScheduling": !!m.payerRestricted,
                "IsActive": !!m.active,
                "DateMode": m.dateMode === "custom" ? "Custom" : "Recurring",
                "ScheduleEveryType": m.dateMode === "custom" ? 0 : m.everyType,
                "FromDate": m.dateMode === "custom" ? null : ymd(m.fromDate),
                "ToDate": m.dateMode === "custom" ? null : ymd(m.toDate),
                "CustomDates": m.dateMode === "custom" ? m.customDates.slice() : [],
                "Groups": m.groups.map(function (g, i) {
                    return {
                        "DayGroupNo": i + 1,
                        "DayIds": g.days.slice(),
                        "BranchId": g.branchId,
                        "UserBranchId": g.userBranchId,
                        "StartTime": dateToHhmm(g.start),
                        "EndTime": dateToHhmm(g.end),
                        "DurationMinutes": g.duration,
                        "MaxSlots": g.maxSlots,
                        "MaxPerDay": parseInt(g.maxPerDay, 10) || 0,   // -> tblUserScheduleDetail.MaximumOverAllSlots
                        "Slots": g.slots.map(function (s) {
                            return {
                                "SlotType": s.type,
                                "StartTime": dateToHhmm(s.start),
                                "EndTime": dateToHhmm(s.end),
                                "DurationMinutes": s.duration,
                                "MaxNumberOfSlots": s.type === "Break" ? 0 : (parseInt(s.maxSlots, 10) || 0),
                                "VisitReasons": s.type === "Availability" ? s.reasons.map(function (r) { return { "ReasonId": r.ReasonId, "VisitTypeId": r.VisitTypeId }; }) : [],
                                "OnlineVisitReasons": s.type === "Online" ? (s.onlineReasons || []).map(function (r) {
                                    return { "ParentOnlineAppointmentVisitReasonId": r.ParentOnlineAppointmentVisitReasonId, "OnlineVisitReason": r.OnlineVisitReason };
                                }) : [],
                                "PayorTypes": (s.type === "Break" || !m.payerRestricted) ? [] : s.payors
                            };
                        })
                    };
                })
            };
        }

        vm.save = function () {
            if (!validateBasics(true)) { vm.step = 1; return; }
            if (!validateSlots(true)) { vm.step = 2; return; }
            if (!validateDates(true)) { vm.step = 3; return; }
            vm.saving = true;
            eHnoteMainAdminServices.SaveUserScheduleV2(toRequest()).then(function (resp) {
                vm.saving = false;
                if (!isOk(resp)) { alertify.error((resp.data && resp.data.Message) || "Save failed"); return; }
                var d = resp.data;
                var note = vm.model.active ? (" — " + d.DatesGenerated + " bookable date" + (d.DatesGenerated === 1 ? "" : "s")) : " (inactive)";
                alertify.success("Schedule saved" + note);
                if (d.DatesMoved > 0) {
                    alertify.log(d.DatesMoved + " date" + (d.DatesMoved === 1 ? " was" : "s were") + " taken over from other schedules of this provider on the same branch.");
                }
                vm.backToList();
            }, function () {
                vm.saving = false;
                alertify.error("Some Error Occured");
            });
        };

        /* ------------------------------------------------------------ init */

        loadBranches();
        loadPayors();
        loadOnlineReasons();
        vm.load();
    }]);

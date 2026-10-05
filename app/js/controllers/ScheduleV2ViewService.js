"use strict";
/*
 * Shared read side of the V2 schedule model (Admin/GetUserSchedulesV2).
 *
 * Both screens that show V2 schedules use this, so one payload is always read
 * and worded the same way:
 *   - Admin > Users > Time Slots (New)  -> TimeSlotsV2Ctrl
 *   - Doctor profile > Schedule tab      -> ProfileScheduleV2Ctrl
 *
 * Read only: it maps a server row to the view model and formats it. Saving,
 * payor/reason lookups and the wizard's edit state stay in TimeSlotsV2Ctrl.
 */
eHnoteWebApp.service('eHnoteScheduleV2ViewService', [function () {

    var svc = this;

    var DAYS = [
        { id: 1, name: "Mon" }, { id: 2, name: "Tue" }, { id: 3, name: "Wed" }, { id: 4, name: "Thu" },
        { id: 5, name: "Fri" }, { id: 6, name: "Sat" }, { id: 7, name: "Sun" }
    ];
    // The full set the classic Connect screen offers - the new screen must not drop any.
    var REPEATS = [
        { id: 1, name: "Every Week" }, { id: 2, name: "Every Even Week" },
        { id: 3, name: "Every Odd Week" }, { id: 4, name: "Every First Week" },
        { id: 5, name: "Every Second Week" }, { id: 6, name: "Every Third Week" },
        { id: 7, name: "Every Fourth Week" }, { id: 8, name: "Every Fifth Week" },
        { id: 9, name: "Every Last Week" }, { id: 10, name: "Every Alternate Week" }
    ];

    // Repeat 4-9 need the DB change in DBHandoff/TimeSlotsV2_RepeatOptions_DB_Changes.sql:
    // until it is deployed, Proc_SaveUserScheduleV2 rejects them outright
    // ("ScheduleEveryType must be 1, 2, 3 or 10") and the date generator would
    // treat them as every week. FLIP THIS TO true ONCE THAT SCRIPT IS APPLIED.
    var ALLOW_EXTENDED_REPEATS = false;

    svc.DAYS = DAYS;
    svc.REPEATS = REPEATS;
    // What the Repeat dropdown may offer. REPEATS stays complete so an existing
    // schedule saved with any value still shows the right name.
    svc.selectableRepeats = function () {
        if (ALLOW_EXTENDED_REPEATS) return REPEATS;
        return REPEATS.filter(function (r) { return [1, 2, 3, 10].indexOf(r.id) >= 0; });
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
    function ymd(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
    function parseYmd(s) {
        if (!s) return null;
        var p = s.substring(0, 10).split("-");
        return new Date(parseInt(p[0], 10), parseInt(p[1], 10) - 1, parseInt(p[2], 10));
    }
    function sameIds(a, b) {
        var x = (a || []).slice().sort().join(","), y = (b || []).slice().sort().join(",");
        return x === y;
    }

    svc.pad = pad;
    svc.hhmmToDate = hhmmToDate;
    svc.dateToHhmm = dateToHhmm;
    svc.dateToAmPm = dateToAmPm;
    svc.mins = mins;
    svc.ymd = ymd;
    svc.parseYmd = parseYmd;
    svc.sameIds = sameIds;
    svc.dayName = function (id) { return (DAYS[id - 1] || {}).name || ""; };
    svc.repeatName = function (id) {
        var r = REPEATS.filter(function (x) { return x.id === id; })[0];
        return r ? r.name : "";
    };
    // Dates are shown MM-DD-YYYY; the API keeps yyyy-MM-dd
    svc.fmtDate = function (v) {
        var d = (typeof v === "string") ? parseYmd(v) : v;
        return d ? pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + "-" + d.getFullYear() : "";
    };
    svc.isOk = function (resp) {
        var d = resp && resp.data ? resp.data : resp;
        return d && (d.status === "Success" || d.Status === "Success");
    };

    /* ------------------------------------------------------ server -> model */

    // Save expands every window into one row per duration piece; fold consecutive
    // identical pieces back into the window the user entered.
    svc.mergePieces = function (rows, type) {
        var out = [];
        rows.slice().sort(function (a, b) { return a.StartTime < b.StartTime ? -1 : 1; }).forEach(function (r) {
            var reasons = type !== "Availability" ? [] : (r.VisitReasons || []).map(function (v) {
                return { ReasonId: v.ReasonId, VisitTypeId: v.VisitTypeId, Reason: v.Reason };
            });
            var onlineReasons = type !== "Online" ? [] : (r.OnlineVisitReasons || []).map(function (v) {
                return { ParentOnlineAppointmentVisitReasonId: v.ParentOnlineAppointmentVisitReasonId, OnlineVisitReason: v.OnlineVisitReason };
            });
            var payors = type === "Break" ? [] : (r.PayorTypes || []);
            var piece = {
                type: type,
                start: hhmmToDate(r.StartTime),
                end: hhmmToDate(r.EndTime),
                duration: r.DurationMinutes || (mins(hhmmToDate(r.EndTime)) - mins(hhmmToDate(r.StartTime))),
                maxSlots: type === "Break" ? null : (r.MaxNumberOfSlots || 0),   // breaks take no bookings
                reasons: reasons,
                onlineReasons: onlineReasons,
                payors: payors
            };
            var last = out[out.length - 1];
            if (last && mins(last.end) === mins(piece.start) && last.duration === piece.duration &&
                last.maxSlots === piece.maxSlots &&
                sameIds(last.reasons.map(function (x) { return x.ReasonId; }), piece.reasons.map(function (x) { return x.ReasonId; })) &&
                sameIds(last.onlineReasons.map(function (x) { return x.ParentOnlineAppointmentVisitReasonId; }),
                        piece.onlineReasons.map(function (x) { return x.ParentOnlineAppointmentVisitReasonId; })) &&
                sameIds(last.payors.map(function (x) { return x.PayorId; }), piece.payors.map(function (x) { return x.PayorId; }))) {
                last.end = piece.end;
            } else {
                out.push(piece);
            }
        });
        return out;
    };

    svc.fromServer = function (row) {
        var avg = parseInt(row.AverageConsultationTime, 10) || 15;
        var groupsByKey = {};
        var groups = [];

        // Proc_GetUserSchedulesV2 returns the day rows as UserScheduleDetails (older draft: Days)
        (row.UserScheduleDetails || row.Days || []).forEach(function (d) {
            var slots = svc.mergePieces(d.SlotsList || [], "Availability")
                .concat(svc.mergePieces(d.BreakSlots || [], "Break"))
                .concat(svc.mergePieces(d.OnlineSlots || [], "Online"));
            var duration = d.DurationMinutes || avg;
            var start = hhmmToDate(d.StartTime), end = hhmmToDate(d.EndTime);

            /* Drop the synthetic all-reasons window the save writes for a group that has
             * NO custom slots but whose duration differs from the schedule grid, so the
             * group comes back as "even default slots" rather than one fake custom slot.
             *
             * duration !== avg is what makes this safe to do. Proc_SaveUserScheduleV2
             * only writes that window when the group's duration differs from the grid
             * (its section 6b: "WHERE gd.DurationMinutes <> @v_GridMinutes"), and the
             * grid is stored as AverageConsultationTime. Without that check, a day the
             * user really did fill - every timeslot ticked, all visit reasons, at the
             * grid duration - merges back into one full-window all-reasons row that
             * looks identical to the synthetic one, and every slot was discarded on
             * edit ("No slots yet" on a schedule saved with 36 slots).
             */
            var avail = slots.filter(function (s) { return s.type === "Availability"; });
            if (duration !== avg && avail.length === 1 &&
                mins(avail[0].start) === mins(start) && mins(avail[0].end) === mins(end) &&
                avail[0].duration === duration && !avail[0].reasons.length && !avail[0].payors.length) {
                slots = slots.filter(function (s) { return s.type === "Break"; });
            }

            var sig = d.DayGroupNo ? ("g" + d.DayGroupNo) : JSON.stringify([d.BranchId, d.StartTime, d.EndTime, duration,
                slots.map(function (s) { return [s.type, dateToHhmm(s.start), dateToHhmm(s.end), s.duration, s.maxSlots, s.reasons.map(function (x) { return x.ReasonId; })]; })]);

            if (!groupsByKey[sig]) {
                groupsByKey[sig] = {
                    days: [],
                    branchId: d.BranchId,
                    branchName: d.BranchName,
                    userBranchId: d.UserBranchId,
                    start: start,
                    end: end,
                    duration: duration,
                    maxSlots: d.DefaultMaxSlots || (avail[0] && avail[0].maxSlots) || 1,
                    maxPerDay: d.MaximumOverAllSlots || 0,   // 0 = no daily limit
                    slots: slots
                };
                groups.push(groupsByKey[sig]);
            }
            groupsByKey[sig].days.push(d.DayId);
        });
        groups.forEach(function (g) { g.days.sort(); });

        var type = (row.Type || "").toString();
        // DateMode comes from the proc; [Type] is the fallback for classic schedules
        var isCustom = row.DateMode ? row.DateMode === "Custom" : (type === "Custom" || type === "Date");
        var customDates = (row.CustomDates && row.CustomDates.length)
            ? row.CustomDates
            : (isCustom ? (row.UserDaySlots || row.Dates || []).map(function (x) { return x.SlotDate; }) : []);
        var everyType = parseInt(row.ScheduleEveryType, 10) || 1;

        // A schedule whose From date is still ahead is Active, not "Upcoming": the
        // provider has switched it on, it simply has not started running yet.
        var today = ymd(new Date());
        var status = !row.IsActive ? "Inactive"
            : (row.ToDate && today > row.ToDate) ? "Expired"
            : "Active";

        return {
            id: row.UserScheduleId,
            doctorId: row.DoctorId,
            branchId: row.BranchId,
            name: row.UserScheduleName || "",
            payerRestricted: !!row.IsInsuranceBasedScheduling,
            active: row.IsActive !== false,
            // "Active now" lists what is switched on, so a not-yet-started schedule
            // belongs there too - only inactive and expired ones drop to the rest.
            activeNow: !!row.ScheduleActiveStatus || status === "Active",
            status: status,
            isV2: !!row.IsV2Schedule,
            isLegacyOnly: !!row.IsLegacyOnly,
            dateMode: isCustom ? "custom" : "recurring",
            everyType: REPEATS.some(function (r) { return r.id === everyType; }) ? everyType : 1,
            repeatNeedsReview: !isCustom && !REPEATS.some(function (r) { return r.id === everyType; }),
            // Added by DBHandoff/TimeSlotsV2_CreatedInfo_DB_Changes.sql - absent until
            // that is applied, and the screen then simply shows no created line.
            createdAt: row.CreatedDt || null,
            createdBy: row.CreatedByName || "",
            fromDate: parseYmd(row.FromDate),
            toDate: parseYmd(row.ToDate),
            customDates: customDates.slice().sort(),
            groups: groups
        };
    };

    /* ------------------------------------------------------------- display */

    svc.dateSummary = function (s) {
        if (s.dateMode === "custom") {
            return s.customDates.length + " one-off date" + (s.customDates.length === 1 ? "" : "s");
        }
        var rep = REPEATS.filter(function (r) { return r.id === s.everyType; })[0];
        return (s.fromDate ? svc.fmtDate(s.fromDate) : "?") + " → " + (s.toDate ? svc.fmtDate(s.toDate) : "?") +
            " · " + (rep ? rep.name : "");
    };

    // Slot length(s) for the collapsed group line, so the duration can be read
    // without opening the slot list. Breaks are left out - they take no bookings.
    // A group with mixed lengths shows each of them, e.g. "45m / 90m".
    svc.durationSummary = function (g) {
        var seen = {};
        (g.slots || []).forEach(function (s) {
            if (s.type !== "Break" && s.duration) seen[s.duration] = true;
        });
        var list = Object.keys(seen).map(Number).sort(function (a, b) { return a - b; });
        if (!list.length && g.duration) list = [g.duration];
        return list.map(function (d) { return d + "m"; }).join(" / ");
    };

    // "Created 10-01-2026 07:40 AM by Vijay Admin" for the list card, or "" while
    // the proc does not return the created fields yet.
    svc.createdSummary = function (s) {
        if (!s.createdAt) return "";
        var d = new Date(s.createdAt);
        if (isNaN(d.getTime())) return "";
        var h = d.getHours(), suffix = h < 12 ? "AM" : "PM";
        var out = "Created " + svc.fmtDate(d) + " " + ((h % 12) || 12) + ":" + pad(d.getMinutes()) + " " + suffix;
        return s.createdBy ? out + " by " + s.createdBy : out;
    };

    svc.sortedSlots = function (g) {
        return g.slots.slice().sort(function (a, b) { return mins(a.start) - mins(b.start); });
    };

    // One line per configured slot: "8:00 AM – 11:00 AM | ASC surgery | 60m · max 1".
    // opts.reasonName lets the wizard resolve a reason that came back without a name;
    // opts.payerRestricted appends the payors, as the wizard's review step does.
    svc.buildSummaryRows = function (g, opts) {
        opts = opts || {};
        var nameOf = opts.reasonName || function (x) { return x.Reason || ""; };
        return svc.sortedSlots(g).map(function (s) {
            var span = mins(s.end) - mins(s.start);
            var count = s.duration ? Math.floor(span / s.duration) : 1;
            var text = s.type === "Break"
                ? (count > 1 ? "Break — " + count + " × " + s.duration + "-min segments" : "Break — blocks booking")
                : s.type === "Online"
                    ? ("Online — " + ((s.onlineReasons || []).length
                        ? s.onlineReasons.map(function (x) { return x.OnlineVisitReason || x.ParentOnlineAppointmentVisitReasonId; }).join(", ")
                        : "all online visit reasons"))
                    : (s.reasons.length ? s.reasons.map(nameOf).join(", ") : "All visit reasons");
            if (s.type !== "Break" && opts.payerRestricted && s.payors.length) {
                text += " · " + s.payors.map(function (x) { return x.PayorName; }).join(", ");
            }
            return {
                time: dateToAmPm(s.start) + " – " + dateToAmPm(s.end),
                text: text,
                meta: s.duration + "m" + (s.type === "Break" ? "" : " · max " + s.maxSlots)
            };
        });
    };

    // ng-repeat compares items by reference, so this must return the SAME array while
    // nothing changed - rebuilding it every digest causes "$digest() iterations reached".
    svc.summarySig = function (g, payerRestricted) {
        return (payerRestricted ? "1" : "0") + "#" + g.slots.map(function (s) {
            return [s.type, dateToHhmm(s.start), dateToHhmm(s.end), s.duration, s.maxSlots,
                (s.reasons || []).map(function (x) { return x.ReasonId; }).join("."),
                (s.onlineReasons || []).map(function (x) { return x.ParentOnlineAppointmentVisitReasonId; }).join("."),
                (s.payors || []).map(function (x) { return x.PayorId; }).join(".")].join("|");
        }).join(";");
    };

    svc.summaryRows = function (g, opts) {
        opts = opts || {};
        var sig = svc.summarySig(g, opts.payerRestricted);
        if (g.$$sumSig === sig) return g.$$sumRows;
        g.$$sumSig = sig;
        g.$$sumRows = svc.buildSummaryRows(g, opts);
        return g.$$sumRows;
    };

    // Bookings one slot can take: its max x the number of pieces it splits into.
    svc.slotBookings = function (s) {
        if (!s || s.type === "Break") return 0;
        var span = mins(s.end) - mins(s.start);
        if (span <= 0 || !s.duration) return 0;
        return Math.floor(span / s.duration) * (parseInt(s.maxSlots, 10) || 0);
    };

    // Bookings a day group can take: per-slot max x number of slots (breaks don't count)
    svc.dayTotal = function (g) {
        var total = 0;
        (g.slots || []).forEach(function (s) { total += svc.slotBookings(s); });
        return total;
    };
}]);

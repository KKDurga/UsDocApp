! function(e, t) { "object" == typeof exports && "object" == typeof module ? module.exports = t(require("angular"), function() {
        try {
            return require("interact.js") } catch (e) {} }(), require("moment")) : "function" == typeof define && define.amd ? define(["angular", "interact", "moment"], t) : "object" == typeof exports ? exports.angularBootstrapCalendarModuleName = t(require("angular"), function() {
        try {
            return require("interact.js") } catch (e) {} }(), require("moment")) : e.angularBootstrapCalendarModuleName = t(e.angular, e.interact, e.moment) }(this, function(e, t, n) {
    return function(e) {
        function t(a) {
            if (n[a]) return n[a].exports;
            var i = n[a] = { exports: {}, id: a, loaded: !1 };
            return e[a].call(i.exports, i, i.exports, t), i.loaded = !0, i.exports }
        var n = {};
        return t.m = e, t.c = n, t.p = "", t(0) }([function(e, t, n) { "use strict";

        function a(e) { e.keys().forEach(e) }
        n(8);
        var i = n(12),
            r = {},
            l = n(13);
        l.keys().forEach(function(e) {
            var t = e.replace("./", ""),
                n = "mwl/" + t,
                a = t.replace(".html", "");
            r[a] = { cacheTemplateName: n, template: l(e) } }), e.exports = i.module("mwl.calendar", []).config(["calendarConfig", function(e) { i.forEach(r, function(t, n) { e.templates[n] || (e.templates[n] = t.cacheTemplateName) }) }]).run(["$templateCache", function(e) { i.forEach(r, function(t) { e.get(t.cacheTemplateName) || e.put(t.cacheTemplateName, t.template) }) }]).name, a(n(23)), a(n(37)), a(n(42)) }, , , , , , , , function(e, t) {}, , , , function(t, n) { t.exports = e }, function(e, t, n) {
        function a(e) {
            return n(i(e)) }

        function i(e) {
            return r[e] || function() {
                throw new Error("Cannot find module '" + e + "'.") }() }
        var r = { "./calendar.html": 14, "./calendarDayView.html": 15, "./calendarHourList.html": 16, "./calendarMonthCell.html": 17, "./calendarMonthCellEvents.html": 18, "./calendarMonthView.html": 19, "./calendarSlideBox.html": 20, "./calendarWeekView.html": 21, "./calendarYearView.html": 22 };
        a.keys = function() {
            return Object.keys(r) }, a.resolve = i, e.exports = a, a.id = 13 }, function(e, t) { e.exports = '<div class="cal-context" ng-switch="vm.view">\n\n  <div class="alert alert-danger" ng-switch-default>The value passed to the view attribute of the calendar is not set</div>\n\n  <div class="alert alert-danger" ng-hide="vm.viewDate">The value passed to view-date attribute of the calendar is not set </div>\n\n  <mwl-calendar-year\n    events="vm.events"\n    view-date="vm.viewDate"\n    on-event-click="vm.onEventClick"\n    on-event-times-changed="vm.onEventTimesChanged"\n    on-edit-event-click="vm.onEditEventClick"\n    on-delete-event-click="vm.onDeleteEventClick"\n    on-timespan-click="vm.onTimespanClick"\n    edit-event-html="vm.editEventHtml"\n    delete-event-html="vm.deleteEventHtml"\n    cell-is-open="vm.cellIsOpen"\n    cell-modifier="vm.cellModifier"\n    ng-switch-when="year"\n  ></mwl-calendar-year>\n\n  <mwl-calendar-month\n    events="vm.events"\n    view-date="vm.viewDate"\n    on-event-click="vm.onEventClick"\n    on-event-times-changed="vm.onEventTimesChanged"\n    on-edit-event-click="vm.onEditEventClick"\n    on-delete-event-click="vm.onDeleteEventClick"\n    on-timespan-click="vm.onTimespanClick"\n    edit-event-html="vm.editEventHtml"\n    delete-event-html="vm.deleteEventHtml"\n    cell-is-open="vm.cellIsOpen"\n    cell-modifier="vm.cellModifier"\n    ng-switch-when="month"\n    ></mwl-calendar-month>\n\n  <mwl-calendar-week\n    events="vm.events"\n    view-date="vm.viewDate"\n    on-event-click="vm.onEventClick"\n    on-event-times-changed="vm.onEventTimesChanged"\n    day-view-start="vm.dayViewStart"\n    day-view-end="vm.dayViewEnd"\n    day-view-split="vm.dayViewSplit"\n    on-timespan-click="vm.onTimespanClick"\n    ng-switch-when="week"\n    ></mwl-calendar-week>\n\n  <mwl-calendar-day\n    events="vm.events"\n    view-date="vm.viewDate"\n    on-event-click="vm.onEventClick"\n    on-event-times-changed="vm.onEventTimesChanged"\n    on-timespan-click="vm.onTimespanClick"\n    day-view-start="vm.dayViewStart"\n    day-view-end="vm.dayViewEnd"\n    day-view-split="vm.dayViewSplit"\n    ng-switch-when="day"\n    ></mwl-calendar-day>\n</div>\n' }, function(e, t) { e.exports = '<div class="cal-day-box">\n  <div class="row-fluid clearfix cal-row-head">\n    <div class="span1 col-xs-1 cal-cell" ng-bind="vm.calendarConfig.i18nStrings.timeLabel"></div>\n    <div class="span11 col-xs-11 cal-cell" ng-bind="vm.calendarConfig.i18nStrings.eventsLabel"></div>\n  </div>\n\n  <div class="cal-day-panel clearfix" ng-style="{height: vm.dayViewHeight + \'px\'}">\n\n    <mwl-calendar-hour-list\n      day-view-start="vm.dayViewStart"\n      day-view-end="vm.dayViewEnd"\n      day-view-split="vm.dayViewSplit"\n      on-timespan-click="vm.onTimespanClick"\n      view-date="vm.viewDate">\n    </mwl-calendar-hour-list>\n\n    <div\n      class="pull-left day-event day-highlight"\n      ng-repeat="event in vm.view track by event.$id"\n      ng-class="\'dh-event-\' + event.type + \' \' + event.cssClass"\n      ng-style="{top: event.top + \'px\', left: event.left + 85 + \'px\', height: event.height + \'px\'}"\n      mwl-draggable="event.draggable === true"\n      axis="\'xy\'"\n      snap-grid="{y: 30, x: 50}"\n      on-drag="vm.eventDragged(event, y)"\n      on-drag-end="vm.eventDragComplete(event, y)"\n      mwl-resizable="event.resizable === true && event.endsAt"\n      resize-edges="{top: true, bottom: true}"\n      on-resize="vm.eventResized(event, edge, y)"\n      on-resize-end="vm.eventResizeComplete(event, edge, y)">\n\n      <span class="cal-hours">\n        <span ng-show="event.top == 0"><span ng-bind="(event.tempStartsAt || event.startsAt) | calendarDate:\'day\':true"></span>, </span>\n        <span ng-bind="(event.tempStartsAt || event.startsAt) | calendarDate:\'time\':true"></span>\n      </span>\n      <a href="javascript:;" class="event-item" ng-click="vm.onEventClick({calendarEvent: event})">\n        <span ng-bind-html="vm.$sce.trustAsHtml(event.title) | calendarTruncateEventTitle:20:event.height"></span>\n      </a>\n\n    </div>\n\n  </div>\n\n</div>\n' }, function(e, t) { e.exports = '<div class="cal-day-panel-hour">\n\n  <div ng-repeat="hour in vm.hours track by $index" class="{{ hour.TimeSlotDetail.Available == \'A\' ? \'\' :\'\'}} cal-day-hour">\n\n    <div\n      class="row-fluid cal-day-hour-part"\n      ng-click="vm.onTimespanClick({calendarDate: hour})">\n      <div class="span1 col-xs-1"><strong ng-bind="hour.label"></strong></div>\n      <div class="span11 col-xs-11"></div>\n    </div>\n\n     </div>\n\n</div>\n' }, function(e, t) { e.exports = '<div\n  mwl-droppable\n  on-drop="vm.handleEventDrop(dropData.event, day.date, dropData.draggedFromDate)"\n  class="cal-month-day {{ day.cssClass }}"\n  ng-class="{\n            \'cal-day-outmonth\': !day.inMonth,\n            \'cal-day-inmonth\': day.inMonth,\n            \'cal-day-weekend\': day.isWeekend,\n            \'cal-day-past\': day.isPast,\n            \'cal-day-today\': day.isToday,\n            \'cal-day-future\': day.isFuture\n          }">\n\n  <small\n    class="cal-events-num badge badge-important pull-left"\n    ng-show="day.badgeTotal > 0"\n    ng-bind="day.badgeTotal">\n  </small>\n\n  <span\n    class="pull-right"\n    data-cal-date\n    ng-click="vm.calendarCtrl.dateClicked(day.date)"\n    ng-bind="day.label">\n  </span>\n\n  <div class="cal-day-tick" ng-show="dayIndex === vm.openDayIndex && vm.view[vm.openDayIndex].events.length > 0">\n    <i class="glyphicon glyphicon-chevron-up"></i>\n    <i class="fa fa-chevron-up"></i>\n  </div>\n\n  <ng-include src="vm.calendarConfig.templates.calendarMonthCellEvents"></ng-include>\n\n  <div id="cal-week-box" ng-if="$first && rowHovered">\n    {{ vm.calendarConfig.i18nStrings.weekNumber.replace(\'{week}\', day.date.week()) }}\n  </div>\n\n</div>\n' }, function(e, t) { e.exports = '<div class="events-list" ng-show="day.events.length > 0">\n  <a\n    ng-repeat="event in day.events | orderBy:\'startsAt\' track by event.$id"\n    href="javascript:;"\n    ng-click="vm.onEventClick({calendarEvent: event})"\n    class="pull-left event"\n    ng-class="\'event-\' + event.type + \' \' + event.cssClass"\n    ng-mouseenter="vm.highlightEvent(event, true)"\n    ng-mouseleave="vm.highlightEvent(event, false)"\n    tooltip-append-to-body="true"\n    uib-tooltip-html="((event.startsAt | calendarDate:\'time\':true) + (vm.calendarConfig.displayEventEndTimes && event.endsAt ? \' - \' + (event.endsAt | calendarDate:\'time\':true) : \'\') + \' - \' + event.title) | calendarTrustAsHtml"\n    mwl-draggable="event.draggable === true"\n    drop-data="{event: event, draggedFromDate: day.date.toDate()}">\n  </a>\n</div>\n' }, function(e, t) { e.exports = '<div class="cal-row-fluid cal-row-head">\n\n  <div class="cal-cell1" ng-repeat="day in vm.weekDays track by $index" ng-bind="day"></div>\n\n</div>\n<div class="cal-month-box">\n\n  <div\n    ng-repeat="rowOffset in vm.monthOffsets track by rowOffset"\n    ng-mouseenter="rowHovered = true"\n    ng-mouseleave="rowHovered = false">\n    <div class="cal-row-fluid cal-before-eventlist">\n      <div\n        ng-repeat="day in vm.view | calendarLimitTo:7:rowOffset track by $index"\n        ng-init="dayIndex = vm.view.indexOf(day)"\n        class="cal-cell1 cal-cell {{ day.highlightClass }}"\n        ng-click="vm.dayClicked(day, false, $event)"\n        ng-class="{pointer: day.events.length > 0}">\n        <ng-include src="vm.calendarConfig.templates.calendarMonthCell"></ng-include>\n      </div>\n    </div>\n\n    <mwl-calendar-slide-box\n      is-open="vm.openRowIndex === $index && vm.view[vm.openDayIndex].events.length > 0"\n      events="vm.view[vm.openDayIndex].events"\n      on-event-click="vm.onEventClick"\n      edit-event-html="vm.editEventHtml"\n      on-edit-event-click="vm.onEditEventClick"\n      delete-event-html="vm.deleteEventHtml"\n      on-delete-event-click="vm.onDeleteEventClick">\n    </mwl-calendar-slide-box>\n\n  </div>\n\n</div>\n' }, function(e, t) { e.exports = '<div class="cal-slide-box" uib-collapse="vm.isCollapsed" mwl-collapse-fallback="vm.isCollapsed">\n  <div class="cal-slide-content cal-event-list">\n    <ul class="unstyled list-unstyled">\n\n      <li\n        ng-repeat="event in vm.events | orderBy:\'startsAt\' track by event.$id"\n        ng-class="event.cssClass"\n        mwl-draggable="event.draggable === true"\n        drop-data="{event: event}">\n        <span class="pull-left event" ng-class="\'event-\' + event.type"></span>\n        &nbsp;\n        <a\n          href="javascript:;"\n          class="event-item"\n          ng-click="vm.onEventClick({calendarEvent: event})">\n          <span ng-bind-html="vm.$sce.trustAsHtml(event.title)"></span>\n          (<span ng-bind="event.startsAt | calendarDate:(isMonthView ? \'time\' : \'datetime\'):true"></span><span ng-if="vm.calendarConfig.displayEventEndTimes && event.endsAt"> - <span ng-bind="event.endsAt | calendarDate:(isMonthView ? \'time\' : \'datetime\'):true"></span></span>)\n        </a>\n\n        <a\n          href="javascript:;"\n          class="event-item-edit"\n          ng-if="vm.editEventHtml && event.editable !== false"\n          ng-bind-html="vm.$sce.trustAsHtml(vm.editEventHtml)"\n          ng-click="vm.onEditEventClick({calendarEvent: event})">\n        </a>\n\n        <a\n          href="javascript:;"\n          class="event-item-delete"\n          ng-if="vm.deleteEventHtml && event.deletable !== false"\n          ng-bind-html="vm.$sce.trustAsHtml(vm.deleteEventHtml)"\n          ng-click="vm.onDeleteEventClick({calendarEvent: event})">\n        </a>\n      </li>\n\n    </ul>\n  </div>\n</div>\n' }, function(e, t) { e.exports = '<div class="cal-week-box" ng-class="{\'cal-day-box\': vm.showTimes}">\n  <div class="cal-row-fluid cal-row-head">\n\n    <div\n      class="cal-cell1"\n      ng-repeat="day in vm.view.days track by $index"\n      ng-class="{\n        \'cal-day-weekend\': day.isWeekend,\n        \'cal-day-past\': day.isPast,\n        \'cal-day-today\': day.isToday,\n        \'cal-day-future\': day.isFuture}"\n      mwl-element-dimensions="vm.dayColumnDimensions">\n\n      <span ng-bind="day.weekDayLabel"></span>\n      <br>\n      <small>\n        <span\n          data-cal-date\n          ng-click="vm.calendarCtrl.dateClicked(day.date)"\n          class="pointer"\n          ng-bind="day.dayLabel">\n        </span>\n      </small>\n\n    </div>\n\n  </div>\n\n  <div class="cal-day-panel clearfix" ng-style="{height: vm.showTimes ? (vm.dayViewHeight + \'px\') : \'auto\'}">\n\n    <mwl-calendar-hour-list\n      day-view-start="vm.dayViewStart"\n      day-view-end="vm.dayViewEnd"\n      day-view-split="vm.dayViewSplit"\n      view-date="vm.viewDate"\n      on-timespan-click="vm.onTimespanClick"\n      ng-if="vm.showTimes">\n    </mwl-calendar-hour-list>\n\n    <div class="row">\n      <div class="col-xs-12">\n        <div\n          class="cal-row-fluid "\n          ng-repeat="event in vm.view.events track by event.$id">\n          <div\n            ng-class="\'cal-cell\' + (vm.showTimes ? 1 : event.daySpan) + (vm.showTimes ? \'\' : \' cal-offset\' + event.dayOffset) + \' day-highlight dh-event-\' + event.type + \' \' + event.cssClass"\n            ng-style="{\n              top: vm.showTimes ? ((event.top + 2) + \'px\') : \'auto\',\n              position: vm.showTimes ? \'absolute\' : \'inherit\',\n              width: vm.showTimes ? (\'116px\') : \'\',\n              left: vm.showTimes ? (116 * event.dayOffset) + 63 + \'px\' : \'\'\n            }"\n            data-event-class\n            mwl-draggable="event.draggable === true"\n            axis="vm.showTimes ? \'xy\' : \'x\'"\n            snap-grid="vm.showTimes ? {x: vm.dayColumnDimensions.width, y: 30} : {x: vm.dayColumnDimensions.width}"\n            on-drag="vm.tempTimeChanged(event, y)"\n            on-drag-end="vm.weekDragged(event, x, y)"\n            mwl-resizable="event.resizable === true && event.endsAt && !vm.showTimes"\n            resize-edges="{left: true, right: true}"\n            on-resize-end="vm.weekResized(event, edge, x)">\n            <strong ng-bind="(event.tempStartsAt || event.startsAt) | calendarDate:\'time\':true" ng-show="vm.showTimes"></strong>\n            <a\n              href="javascript:;"\n              ng-click="vm.onEventClick({calendarEvent: event})"\n              class="event-item"\n              ng-bind-html="vm.$sce.trustAsHtml(event.title)"\n              uib-tooltip-html="event.title | calendarTrustAsHtml"\n              tooltip-placement="left"\n              tooltip-append-to-body="true">\n            </a>\n          </div>\n        </div>\n      </div>\n\n    </div>\n\n  </div>\n</div>\n' }, function(e, t) { e.exports = '<div class="cal-year-box">\n  <div ng-repeat="rowOffset in [0, 4, 8] track by rowOffset">\n    <div class="row cal-before-eventlist">\n      <div\n        class="span3 col-md-3 col-xs-6 cal-cell {{ day.cssClass }}"\n        ng-repeat="month in vm.view | calendarLimitTo:4:rowOffset track by $index"\n        ng-init="monthIndex = vm.view.indexOf(month)"\n        ng-click="vm.monthClicked(month, false, $event)"\n        ng-class="{pointer: month.events.length > 0, \'cal-day-today\': month.isToday}"\n        mwl-droppable\n        on-drop="vm.handleEventDrop(dropData.event, month.date)">\n\n        <span\n          class="pull-right"\n          data-cal-date\n          ng-click="vm.calendarCtrl.dateClicked(month.date)"\n          ng-bind="month.label">\n        </span>\n\n        <small\n          class="cal-events-num badge badge-important pull-left"\n          ng-show="month.badgeTotal > 0"\n          ng-bind="month.badgeTotal">\n        </small>\n\n        <div\n          class="cal-day-tick"\n          ng-show="monthIndex === vm.openMonthIndex && vm.view[vm.openMonthIndex].events.length > 0">\n          <i class="glyphicon glyphicon-chevron-up"></i>\n          <i class="fa fa-chevron-up"></i>\n        </div>\n\n      </div>\n    </div>\n\n    <mwl-calendar-slide-box\n      is-open="vm.openRowIndex === $index && vm.view[vm.openMonthIndex].events.length > 0"\n      events="vm.view[vm.openMonthIndex].events"\n      on-event-click="vm.onEventClick"\n      edit-event-html="vm.editEventHtml"\n      on-edit-event-click="vm.onEditEventClick"\n      delete-event-html="vm.deleteEventHtml"\n      on-delete-event-click="vm.onDeleteEventClick">\n    </mwl-calendar-slide-box>\n\n  </div>\n\n</div>\n' }, function(e, t, n) {
        function a(e) {
            return n(i(e)) }

        function i(e) {
            return r[e] || function() {
                throw new Error("Cannot find module '" + e + "'.") }() }
        var r = { "./mwlCalendar.js": 24, "./mwlCalendarDay.js": 25, "./mwlCalendarHourList.js": 26, "./mwlCalendarMonth.js": 27, "./mwlCalendarSlideBox.js": 28, "./mwlCalendarWeek.js": 29, "./mwlCalendarYear.js": 30, "./mwlCollapseFallback.js": 31, "./mwlDateModifier.js": 32, "./mwlDraggable.js": 33, "./mwlDroppable.js": 34, "./mwlElementDimensions.js": 35, "./mwlResizable.js": 36 };
        a.keys = function() {
            return Object.keys(r) }, a.resolve = i, e.exports = a, a.id = 23 }, function(e, t, n) { "use strict";
        var a = n(12);
        a.module("mwl.calendar").controller("MwlCalendarCtrl", ["$scope", "$log", "$timeout", "$attrs", "$locale", "moment", "calendarTitle", function(e, t, n, i, r, l, s) {
            function o(e) {
                return e.startsAt || t.warn("Bootstrap calendar: ", "Event is missing the startsAt field", e), a.isDate(e.startsAt) || t.warn("Bootstrap calendar: ", "Event startsAt should be a javascript date object", e), a.isDefined(e.endsAt) && (a.isDate(e.endsAt) || t.warn("Bootstrap calendar: ", "Event endsAt should be a javascript date object", e), l(e.startsAt).isAfter(l(e.endsAt)) && t.warn("Bootstrap calendar: ", "Event cannot start after it finishes", e)), !0 }

            function d() { s[c.view] && a.isDefined(i.viewTitle) && (c.viewTitle = s[c.view](c.viewDate)), c.events = c.events.filter(o).map(function(e, t) {
                    return Object.defineProperty(e, "$id", { enumerable: !1, configurable: !0, value: t }), e });
                var t = l(c.viewDate),
                    r = !0;
                v.clone().startOf(c.view).isSame(t.clone().startOf(c.view)) && !v.isSame(t) && c.view === m && (r = !1), v = t, m = c.view, r && n(function() { e.$broadcast("calendar.refreshView") }) }
            var c = this;
            c.events = c.events || [], c.changeView = function(e, t) { c.view = e, c.viewDate = t }, c.dateClicked = function(e) {
                var t = l(e).toDate(),
                    n = { year: "month", month: "day", week: "day" };
                c.onViewChangeClick({ calendarDate: t, calendarNextView: n[c.view] }) !== !1 && c.changeView(n[c.view], t) };
            var v = l(c.viewDate),
                m = c.view,
                u = !1;
            e.$watchGroup(["vm.viewDate", "vm.view", "vm.cellIsOpen", function() {
                return l.locale() + r.id }], function() { u ? d() : (u = !0, e.$watch("vm.events", d, !0)) }) }]).directive("mwlCalendar", ["calendarConfig", function(e) {
            return { templateUrl: e.templates.calendar, restrict: "E", scope: { events: "=", view: "=", viewTitle: "=?", viewDate: "=", editEventHtml: "=?", deleteEventHtml: "=?", cellIsOpen: "=?", onEventClick: "&", onEventTimesChanged: "&", onEditEventClick: "&", onDeleteEventClick: "&", onTimespanClick: "&", onViewChangeClick: "&", cellModifier: "&", dayViewStart: "@", dayViewEnd: "@", dayViewSplit: "@" }, controller: "MwlCalendarCtrl as vm", bindToController: !0 } }]) }, function(e, t, n) { "use strict";
        var a = n(12);
        a.module("mwl.calendar").controller("MwlCalendarDayCtrl", ["$scope", "$sce", "moment", "calendarHelper", "calendarConfig", function(e, t, n, a, i) {
            var r = this;
            r.calendarConfig = i, r.$sce = t, a.setEvent(r.events), e.$on("calendar.refreshView", function() { r.dayViewSplit = r.dayViewSplit || 30, a.setEvent(r.events), r.dayViewHeight = 360, r.view = a.getDayView(r.events, r.viewDate, r.dayViewStart, r.dayViewEnd, r.dayViewSplit) }), r.eventDragComplete = function(e, t) {
                var a = t * r.dayViewSplit,
                    i = n(e.startsAt).add(a, "minutes"),
                    l = n(e.endsAt).add(a, "minutes");
                delete e.tempStartsAt, r.onEventTimesChanged({ calendarEvent: e, calendarNewEventStart: i.toDate(), calendarNewEventEnd: e.endsAt ? l.toDate() : null }) }, r.eventDragged = function(e, t) {
                var a = t * r.dayViewSplit;
                e.tempStartsAt = n(e.startsAt).add(a, "minutes").toDate() }, r.eventResizeComplete = function(e, t, a) {
                var i = a * r.dayViewSplit,
                    l = n(e.startsAt),
                    s = n(e.endsAt); "start" === t ? l.add(i, "minutes") : s.add(i, "minutes"), delete e.tempStartsAt, r.onEventTimesChanged({ calendarEvent: e, calendarNewEventStart: l.toDate(), calendarNewEventEnd: s.toDate() }) }, r.eventResized = function(e, t, a) {
                var i = a * r.dayViewSplit; "start" === t && (e.tempStartsAt = n(e.startsAt).add(i, "minutes").toDate()) } }]).directive("mwlCalendarDay", ["calendarConfig", function(e) {
            return { templateUrl: e.templates.calendarDayView, restrict: "E", require: "^mwlCalendar", scope: { events: "=", viewDate: "=", onEventClick: "=", onEventTimesChanged: "=", onTimespanClick: "=", dayViewStart: "=", dayViewEnd: "=", dayViewSplit: "=" }, controller: "MwlCalendarDayCtrl as vm", bindToController: !0 } }]) }, function(e, t, n) { "use strict";
        var a = n(12);
        a.module("mwl.calendar").controller("MwlCalendarHourListCtrl", ["$scope", "moment", "calendarConfig", "calendarHelper", function(e, t, n, a) {
            function i() { o = a.getEvent(), r = t(s.dayViewStart || "05:00", "HH:mm"), l = t(s.dayViewEnd || "23:00", "HH:mm"), s.dayViewSplit = parseInt(s.dayViewSplit), s.hours = [];
                var e = t(s.viewDate).clone().hours(r.hours()).minutes(r.minutes()).seconds(r.seconds()),
                    i = 19;
                30 == s.dayViewSplit ? i = 37 : 20 == s.dayViewSplit ? i = 56 : 15 == s.dayViewSplit ? i = 75 : 10 == s.dayViewSplit ? i = 113 : 5 == s.dayViewSplit && (i = 227);
                for (var d = [], c = 0; i >= c; c++)
                    d.push({
                        label: a.formatDate(e, n.dateFormats.hour),
                        date: e.clone(),
                        minuteStart: e.clone().format("HH:mm:ss"),
                        DoctorStTime: "",
                        DoctorEdTime: "",
                        clinicName: "",
                         addressConsultId: "",
                        addressId: "",
                        doctorId: "",
                        consultationDate: "",
                        DayCD: "",
                        TimeSlotDetail: {}
                    }), e.add(s.dayViewSplit, "minute");
                if (o.length > 0)
                    for (var v = 0; v < d.length; v++) {
                        for (var m, u, f, p, w, h, g, y, C = !1, D = { StartTime: "", EndTime: "", Available: "A", TokenNumber: 0, PatientInfo: {} }, E = "0", k = 0; k < o[0].slotinfo.count; k++) { m = k;
                            for (var b = 0; b < o[0].slotinfo.rows[k].SlotList.length; b++)
                                if (o[0].slotinfo.rows[k].SlotList[b].StartTime + ":00" == d[v].minuteStart && 0 == C) {
                                    var x = o[0].slotinfo.rows[k].SlotList[b];
                                    D.StartTime = x.StartTime,
                                    D.Available = x.Available,
                                    D.EndTime = x.EndTime,
                                    D.TokenNumber = x.TokenNumber,
                                    E = o[0].slotinfo.rows[m].AddressConsultID,
                                    void 0 !== x.PatientInfo && (D.PatientInfo = x.PatientInfo),
                                    C = !0
                                }
                            h = o[0].slotinfo.rows[m].DayCD, "0" == E && (E = o[0].slotinfo.rows[m].AddressConsultID), u = o[0].slotinfo.rows[m].ConsultationDate, f = o[0].slotinfo.rows[m].UserBranchId, p = o[0].slotinfo.rows[m].DoctorID, w = o[0].slotinfo.rows[m].ClinicName, g = o[0].slotinfo.rows[m].StartTime, y = o[0].slotinfo.rows[m].EndTime }
                        s.hours.push({ label: d[v].label, date: d[v].date, minuteStart: d[v].minuteStart, DoctorStTime: g, DoctorEdTime: y, clinicName: w, addressConsultId: parseInt(E), addressId: f, doctorId: p, consultationDate: u, DayCD: h, TimeSlotDetail: D }) } }
            var r, l, s = this,
                o = a.getEvent();
            t.locale();
            e.$on("calendar.refreshView", function() { i() }), e.$watchGroup(["vm.dayViewStart", "vm.dayViewEnd", "vm.dayViewSplit", "vm.viewDate"], function() { i() }) }]).directive("mwlCalendarHourList", ["calendarConfig", function(e) {
            return { restrict: "E", templateUrl: e.templates.calendarHourList, controller: "MwlCalendarHourListCtrl as vm", scope: { viewDate: "=", dayViewStart: "=", dayViewEnd: "=", dayViewSplit: "=", onTimespanClick: "=" }, bindToController: !0 } }]) }, function(e, t, n) { "use strict";
        var a = n(12);
        a.module("mwl.calendar").controller("MwlCalendarMonthCtrl", ["$scope", "moment", "calendarHelper", "calendarConfig", function(e, t, n, a) {
            var i = this;
            i.calendarConfig = a, i.openRowIndex = null, e.$on("calendar.refreshView", function() { i.weekDays = n.getWeekDayNames(), i.view = n.getMonthView(i.events, i.viewDate, i.cellModifier);
                var e = Math.floor(i.view.length / 7);
                i.monthOffsets = [];
                for (var a = 0; e > a; a++) i.monthOffsets.push(7 * a);
                i.cellIsOpen && null === i.openRowIndex && (i.openDayIndex = null, i.view.forEach(function(e) { e.inMonth && t(i.viewDate).startOf("day").isSame(e.date) && i.dayClicked(e, !0) })) }), i.dayClicked = function(e, t, n) {
                if (t || (i.onTimespanClick({ calendarDate: e.date.toDate(), $event: n }), !n || !n.defaultPrevented)) { i.openRowIndex = null;
                    var a = i.view.indexOf(e);
                    a === i.openDayIndex ? (i.openDayIndex = null, i.cellIsOpen = !1) : (i.openDayIndex = a, i.openRowIndex = Math.floor(a / 7), i.cellIsOpen = !0) } }, i.highlightEvent = function(e, t) { i.view.forEach(function(n) {
                    if (delete n.highlightClass, t) {
                        var a = n.events.indexOf(e) > -1;
                        a && (n.highlightClass = "day-highlight dh-event-" + e.type) } }) }, i.handleEventDrop = function(e, a, r) {
                var l = t(e.startsAt).date(t(a).date()).month(t(a).month()),
                    s = n.adjustEndDateFromStartDiff(e.startsAt, l, e.endsAt);
                i.onEventTimesChanged({ calendarEvent: e, calendarDate: a, calendarNewEventStart: l.toDate(), calendarNewEventEnd: s ? s.toDate() : null, calendarDraggedFromDate: r }) } }]).directive("mwlCalendarMonth", ["calendarConfig", function(e) {
            return { templateUrl: e.templates.calendarMonthView, restrict: "E", require: "^mwlCalendar", scope: { events: "=", viewDate: "=", onEventClick: "=", onEditEventClick: "=", onDeleteEventClick: "=", onEventTimesChanged: "=", editEventHtml: "=", deleteEventHtml: "=", cellIsOpen: "=", onTimespanClick: "=", cellModifier: "=" }, controller: "MwlCalendarMonthCtrl as vm", link: function(e, t, n, a) { e.vm.calendarCtrl = a }, bindToController: !0 } }]) }, function(e, t, n) { "use strict";
        var a = n(12);
        a.module("mwl.calendar").controller("MwlCalendarSlideBoxCtrl", ["$sce", "$scope", "$timeout", "calendarConfig", function(e, t, n, a) {
            var i = this;
            i.$sce = e, i.calendarConfig = a, i.isCollapsed = !0, t.$watch("vm.isOpen", function(e) { n(function() { i.isCollapsed = !e }) }) }]).directive("mwlCalendarSlideBox", ["calendarConfig", function(e) {
            return { restrict: "E", templateUrl: e.templates.calendarSlideBox, replace: !0, controller: "MwlCalendarSlideBoxCtrl as vm", require: ["^?mwlCalendarMonth", "^?mwlCalendarYear"], link: function(e, t, n, a) { e.isMonthView = !!a[0], e.isYearView = !!a[1] }, scope: { isOpen: "=", events: "=", onEventClick: "=", editEventHtml: "=", onEditEventClick: "=", deleteEventHtml: "=", onDeleteEventClick: "=" }, bindToController: !0 } }]) }, function(e, t, n) { "use strict";
        var a = n(12);
        a.module("mwl.calendar").controller("MwlCalendarWeekCtrl", ["$scope", "$sce", "moment", "calendarHelper", "calendarConfig", function(e, t, n, a, i) {
            var r = this;
            r.showTimes = i.showTimesOnWeekView, r.$sce = t, e.$on("calendar.refreshView", function() { r.dayViewSplit = r.dayViewSplit || 30, r.dayViewHeight = 360, r.showTimes ? r.view = a.getWeekViewWithTimes(r.events, r.viewDate, r.dayViewStart, r.dayViewEnd, r.dayViewSplit) : r.view = a.getWeekView(r.events, r.viewDate) }), r.weekDragged = function(e, t, a) {
                var i = n(e.startsAt).add(t, "days"),
                    l = n(e.endsAt).add(t, "days");
                if (a) {
                    var s = a * r.dayViewSplit;
                    i = i.add(s, "minutes"), l = l.add(s, "minutes") }
                delete e.tempStartsAt, r.onEventTimesChanged({ calendarEvent: e, calendarNewEventStart: i.toDate(), calendarNewEventEnd: e.endsAt ? l.toDate() : null }) }, r.weekResized = function(e, t, a) {
                var i = n(e.startsAt),
                    l = n(e.endsAt); "start" === t ? i.add(a, "days") : l.add(a, "days"), r.onEventTimesChanged({ calendarEvent: e, calendarNewEventStart: i.toDate(), calendarNewEventEnd: l.toDate() }) }, r.tempTimeChanged = function(e, t) {
                var a = t * r.dayViewSplit;
                e.tempStartsAt = n(e.startsAt).add(a, "minutes").toDate() } }]).directive("mwlCalendarWeek", ["calendarConfig", function(e) {
            return { templateUrl: e.templates.calendarWeekView, restrict: "E", require: "^mwlCalendar", scope: { events: "=", viewDate: "=", onEventClick: "=", onEventTimesChanged: "=", dayViewStart: "=", dayViewEnd: "=", dayViewSplit: "=", onTimespanClick: "=" }, controller: "MwlCalendarWeekCtrl as vm", link: function(e, t, n, a) { e.vm.calendarCtrl = a }, bindToController: !0 } }]) }, function(e, t, n) { "use strict";
        var a = n(12);
        a.module("mwl.calendar").controller("MwlCalendarYearCtrl", ["$scope", "moment", "calendarHelper", function(e, t, n) {
            var a = this;
            a.openMonthIndex = null, e.$on("calendar.refreshView", function() { a.view = n.getYearView(a.events, a.viewDate, a.cellModifier), a.cellIsOpen && null === a.openMonthIndex && (a.openMonthIndex = null, a.view.forEach(function(e) { t(a.viewDate).startOf("month").isSame(e.date) && a.monthClicked(e, !0) })) }), a.monthClicked = function(e, t, n) {
                if (t || (a.onTimespanClick({ calendarDate: e.date.toDate(), $event: n }), !n || !n.defaultPrevented)) { a.openRowIndex = null;
                    var i = a.view.indexOf(e);
                    i === a.openMonthIndex ? (a.openMonthIndex = null, a.cellIsOpen = !1) : (a.openMonthIndex = i, a.openRowIndex = Math.floor(i / 4), a.cellIsOpen = !0) } }, a.handleEventDrop = function(e, i) {
                var r = t(e.startsAt).month(t(i).month()),
                    l = n.adjustEndDateFromStartDiff(e.startsAt, r, e.endsAt);
                a.onEventTimesChanged({ calendarEvent: e, calendarDate: i, calendarNewEventStart: r.toDate(), calendarNewEventEnd: l ? l.toDate() : null }) } }]).directive("mwlCalendarYear", ["calendarConfig", function(e) {
            return { templateUrl: e.templates.calendarYearView, restrict: "E", require: "^mwlCalendar", scope: { events: "=", viewDate: "=", onEventClick: "=", onEventTimesChanged: "=", onEditEventClick: "=", onDeleteEventClick: "=", editEventHtml: "=", deleteEventHtml: "=", cellIsOpen: "=", onTimespanClick: "=", cellModifier: "=" }, controller: "MwlCalendarYearCtrl as vm", link: function(e, t, n, a) { e.vm.calendarCtrl = a }, bindToController: !0 } }]) }, function(e, t, n) { "use strict";
        var a = n(12);
        a.module("mwl.calendar").controller("MwlCollapseFallbackCtrl", ["$scope", "$attrs", "$element", function(e, t, n) { e.$watch(t.mwlCollapseFallback, function(e) { e ? n.addClass("ng-hide") : n.removeClass("ng-hide") }) }]).directive("mwlCollapseFallback", ["$injector", function(e) {
            return e.has("uibCollapseDirective") ? {} : { restrict: "A", controller: "MwlCollapseFallbackCtrl" } }]) }, function(e, t, n) { "use strict";
        var a = n(12);
        a.module("mwl.calendar").controller("MwlDateModifierCtrl", ["$element", "$attrs", "$scope", "moment", function(e, t, n, i) {
            function r() { a.isDefined(t.setToToday) ? l.date = new Date : a.isDefined(t.increment) ? l.date = i(l.date).add(1, l.increment).toDate() : a.isDefined(t.decrement) && (l.date = i(l.date).subtract(1, l.decrement).toDate()), n.$apply() }
            var l = this;
            e.bind("click", r), n.$on("$destroy", function() { e.unbind("click", r) }) }]).directive("mwlDateModifier", function() {
            return { restrict: "A", controller: "MwlDateModifierCtrl as vm", scope: { date: "=", increment: "=", decrement: "=" }, bindToController: !0 } }) }, function(e, t, n) { "use strict";
        var a = n(12);
        a.module("mwl.calendar").controller("MwlDraggableCtrl", ["$element", "$scope", "$window", "$parse", "$attrs", "$timeout", "interact", function(e, t, n, i, r, l, s) {
            function o(e, t) {
                return e.css("-ms-transform", t).css("-webkit-transform", t).css("transform", t) }

            function d() {
                return i(r.mwlDraggable)(t) }

            function c(e, t, n) {
                var a = { x: e, y: t };
                return n && n.x && (a.x /= n.x), n && n.y && (a.y /= n.y), a }
            if (s) {
                var v, m;
                r.snapGrid && (m = i(r.snapGrid)(t), v = { targets: [s.createSnapGrid(m)] }), s(e[0]).draggable({ snap: v, onstart: function(e) { d() && (a.element(e.target).addClass("dragging-active"), e.target.dropData = i(r.dropData)(t), e.target.style.pointerEvents = "none", r.onDragStart && (i(r.onDragStart)(t), t.$apply())) }, onmove: function(e) {
                        if (d()) {
                            var l = a.element(e.target),
                                s = (parseFloat(l.attr("data-x")) || 0) + (e.dx || 0),
                                v = (parseFloat(l.attr("data-y")) || 0) + (e.dy || 0);
                            switch (i(r.axis)(t)) {
                                case "x":
                                    v = 0;
                                    break;
                                case "y":
                                    s = 0 } "static" === n.getComputedStyle(l[0]).position && l.css("position", "relative"), o(l, "translate(" + s + "px, " + v + "px)").css("z-index", 50).attr("data-x", s).attr("data-y", v), r.onDrag && (i(r.onDrag)(t, c(s, v, m)), t.$apply()) } }, onend: function(e) {
                        if (d()) {
                            var n = a.element(e.target),
                                s = n.attr("data-x"),
                                v = n.attr("data-y");
                            e.target.style.pointerEvents = "auto", r.onDragEnd && (i(r.onDragEnd)(t, c(s, v, m)), t.$apply()), l(function() { o(n, "").css("z-index", "auto").removeAttr("data-x").removeAttr("data-y").removeClass("dragging-active") }) } } }), t.$on("$destroy", function() { s(e[0]).unset() }) } }]).directive("mwlDraggable", function() {
            return { restrict: "A", controller: "MwlDraggableCtrl" } }) }, function(e, t, n) { "use strict";
        var a = n(12);
        a.module("mwl.calendar").controller("MwlDroppableCtrl", ["$element", "$scope", "$parse", "$attrs", "interact", function(e, t, n, i, r) { r && (r(e[0]).dropzone({ ondragenter: function(e) { a.element(e.target).addClass("drop-active") }, ondragleave: function(e) { a.element(e.target).removeClass("drop-active") }, ondropdeactivate: function(e) { a.element(e.target).removeClass("drop-active") }, ondrop: function(e) { e.relatedTarget.dropData && (n(i.onDrop)(t, { dropData: e.relatedTarget.dropData }), t.$apply()) } }), t.$on("$destroy", function() { r(e[0]).unset() })) }]).directive("mwlDroppable", function() {
            return { restrict: "A", controller: "MwlDroppableCtrl" } }) }, function(e, t, n) { "use strict";
        var a = n(12);
        a.module("mwl.calendar").controller("MwlElementDimensionsCtrl", ["$element", "$scope", "$parse", "$attrs", function(e, t, n, a) { n(a.mwlElementDimensions).assign(t, { width: e[0].offsetWidth, height: e[0].offsetHeight }) }]).directive("mwlElementDimensions", function() {
            return { restrict: "A", controller: "MwlElementDimensionsCtrl" } }) }, function(e, t, n) {
        "use strict";
        var a = n(12);
        a.module("mwl.calendar").controller("MwlResizableCtrl", ["$element", "$scope", "$parse", "$attrs", "$timeout", "interact", function(e, t, n, i, r, l) {
            function s() {
                return n(i.mwlResizable)(t) }

            function o(e, t, n) {
                var a = {};
                return a.edge = e, "start" === e ? (a.x = t.data("x"), a.y = t.data("y")) : "end" === e && (a.x = parseFloat(t.css("width").replace("px", "")) - m.width, a.y = parseFloat(t.css("height").replace("px", "")) - m.height), n && n.x && (a.x = Math.round(a.x / n.x)), n && n.y && (a.y = Math.round(a.y / n.y)), a
            }
            if (l) {
                var d, c;
                i.snapGrid && (c = n(i.snapGrid)(t), d = { targets: [l.createSnapGrid(c)] });
                var v, m = {},
                    u = {};
                l(e[0]).resizable({ edges: n(i.resizeEdges)(t), snap: d, onstart: function(e) {
                        if (s()) { v = "end";
                            var t = a.element(e.target);
                            m.height = t[0].offsetHeight, m.width = t[0].offsetWidth, u.height = t.css("height"), u.width = t.css("width") } }, onmove: function(e) {
                        if (s()) {
                            var r = a.element(e.target),
                                l = parseFloat(r.data("x") || 0),
                                d = parseFloat(r.data("y") || 0);
                            r.css({ width: e.rect.width + "px", height: e.rect.height + "px" }), l += e.deltaRect.left, d += e.deltaRect.top, r.css("transform", "translate(" + l + "px," + d + "px)"), r.data("x", l), r.data("y", d), (0 !== e.deltaRect.left || 0 !== e.deltaRect.top) && (v = "start"), i.onResize && (n(i.onResize)(t, o(v, r, c)), t.$apply()) } }, onend: function(e) {
                        if (s()) {
                            var l = a.element(e.target),
                                d = o(v, l, c);
                            r(function() { l.data("x", null).data("y", null).css({ transform: "", width: u.width, height: u.height }) }), i.onResizeEnd && (n(i.onResizeEnd)(t, d), t.$apply()) } } }), t.$on("$destroy", function() { l(e[0]).unset() }) }
        }]).directive("mwlResizable", function() {
            return { restrict: "A", controller: "MwlResizableCtrl" } })
    }, function(e, t, n) {
        function a(e) {
            return n(i(e)) }

        function i(e) {
            return r[e] || function() {
                throw new Error("Cannot find module '" + e + "'.") }() }
        var r = { "./calendarDate.js": 38, "./calendarLimitTo.js": 39, "./calendarTruncateEventTitle.js": 40, "./calendarTrustAsHtml.js": 41 };
        a.keys = function() {
            return Object.keys(r) }, a.resolve = i, e.exports = a, a.id = 37 }, function(e, t, n) { "use strict";
        var a = n(12);
        a.module("mwl.calendar").filter("calendarDate", ["calendarHelper", "calendarConfig", function(e, t) {
            function n(n, a, i) {
                return i === !0 && (a = t.dateFormats[a]), e.formatDate(n, a) }
            return n.$stateful = !0, n }]) }, function(e, t, n) { "use strict";
        var a = n(12);
        a.module("mwl.calendar").filter("calendarLimitTo", ["limitToFilter", function(e) {
            return a.version.minor >= 4 ? e : function(e, t, n) {
                return t = Math.abs(Number(t)) === 1 / 0 ? Number(t) : parseInt(t), isNaN(t) ? e : (a.isNumber(e) && (e = e.toString()), a.isArray(e) || a.isString(e) ? (n = !n || isNaN(n) ? 0 : parseInt(n), n = 0 > n && n >= -e.length ? e.length + n : n, t >= 0 ? e.slice(n, n + t) : 0 === n ? e.slice(t, e.length) : e.slice(Math.max(0, n + t), n)) : e) } }]) }, function(e, t, n) { "use strict";
        var a = n(12);
        a.module("mwl.calendar").filter("calendarTruncateEventTitle", function() {
            return function(e, t, n) {
                return e ? e.length >= t && e.length / 20 > n / 30 ? e.substr(0, t) + "..." : e : "" } }) }, function(e, t, n) { "use strict";
        var a = n(12);
        a.module("mwl.calendar").filter("calendarTrustAsHtml", ["$sce", function(e) {
            return function(t) {
                return e.trustAsHtml(t) } }]) }, function(e, t, n) {
        function a(e) {
            return n(i(e)) }

        function i(e) {
            return r[e] || function() {
                throw new Error("Cannot find module '" + e + "'.") }() }
        var r = { "./calendarConfig.js": 43, "./calendarHelper.js": 44, "./calendarTitle.js": 45, "./interact.js": 46, "./moment.js": 48 };
        a.keys = function() {
            return Object.keys(r) }, a.resolve = i, e.exports = a, a.id = 42 }, function(e, t, n) { "use strict";
        var a = n(12);
        a.module("mwl.calendar").constant("calendarConfig", { allDateFormats: { angular: { date: { hour: "h:mma", day: "d MMM", month: "MMMM", weekDay: "EEEE", time: "HH:mm", datetime: "MMM d, h:mm a" }, title: { day: "EEEE d MMMM, yyyy", week: "Week {week} of {year}", month: "MMMM yyyy", year: "yyyy" } }, moment: { date: { hour: "ha", day: "D MMM", month: "MMMM", weekDay: "dddd", time: "HH:mm", datetime: "MMM D, h:mm a" }, title: { day: "dddd D MMMM, YYYY", week: "Week {week} of {year}", month: "MMMM YYYY", year: "YYYY" } } }, get dateFormats() {
                return this.allDateFormats[this.dateFormatter].date }, get titleFormats() {
                return this.allDateFormats[this.dateFormatter].title }, dateFormatter: "angular", displayEventEndTimes: !1, showTimesOnWeekView: !0, displayAllMonthEvents: !1, i18nStrings: { eventsLabel: "Appointment Details", timeLabel: "Time", weekNumber: "Week {week}" }, templates: {} }) }, function(e, t, n) { "use strict";
        var a = n(12);
        a.module("mwl.calendar").factory("calendarHelper", ["dateFilter", "moment", "calendarConfig", function(e, t, n) {
            function i(a, i) {
                return "angular" === n.dateFormatter ? e(t(a).toDate(), i) : "moment" === n.dateFormatter ? t(a).format(i) : void 0 }

            function r(e, n, a) {
                if (!a) return a;
                var i = t(n).diff(t(e));
                return t(a).add(i) }

            function l(e, n, i) {
                var l = t(e.start),
                    s = t(e.end),
                    o = t(i);
                if (a.isDefined(n)) {
                    switch (n) {
                        case "year":
                            l.set({ year: o.year() });
                            break;
                        case "month":
                            l.set({ year: o.year(), month: o.month() });
                            break;
                        default:
                            throw new Error("Invalid value (" + n + ") given for recurs on. Can only be year or month.") }
                    s = r(e.start, l, s) }
                return { start: l, end: s } }

            function s(e, n, a) { n = t(n), a = t(a);
                var i = l({ start: e.startsAt, end: e.endsAt || e.startsAt }, e.recursOn, n),
                    r = i.start,
                    s = i.end;
                return r.isAfter(n) && r.isBefore(a) || s.isAfter(n) && s.isBefore(a) || r.isBefore(n) && s.isAfter(a) || r.isSame(n) || s.isSame(a) }

            function o(e, t, n) {
                return e.filter(function(e) {
                    return s(e, t, n) }) }

            function d(e, n, a) {
                var i = t(e).startOf(n),
                    r = t(e).endOf(n);
                return o(a, i, r) }

            function c(e) {
                return e.filter(function(e) {
                    return e.incrementsBadgeTotal !== !1 }).length }

            function v() {
                for (var e = [], a = 0; 7 > a;) e.push(i(t().weekday(a++), n.dateFormats.weekDay));
                return e }

            function m(e, a, r) {
                for (var l = [], s = d(a, "year", e), v = t(a).startOf("year"), m = 0; 12 > m;) {
                    var u = v.clone(),
                        f = u.clone().endOf("month"),
                        p = o(s, u, f),
                        w = { label: i(u, n.dateFormats.month), isToday: u.isSame(t().startOf("month")), events: p, date: u, badgeTotal: c(p) };
                    r({ calendarCell: w }), l.push(w), v.add(1, "month"), m++ }
                return l }

            function u(e, a, i) {
                var r, l = t(a).startOf("month"),
                    s = l.clone().startOf("week"),
                    d = t(a).endOf("month").endOf("week");
                r = n.displayAllMonthEvents ? o(e, s, d) : o(e, l, l.clone().endOf("month"));
                for (var v = [], m = t().startOf("day"); s.isBefore(d);) {
                    var u = s.month() === t(a).month(),
                        f = [];
                    (u || n.displayAllMonthEvents) && (f = o(r, s, s.clone().endOf("day")));
                    var p = { label: s.date(), date: s.clone(), inMonth: u, isPast: m.isAfter(s), isToday: m.isSame(s), isFuture: m.isBefore(s), isWeekend: [0, 6].indexOf(s.day()) > -1, events: f, badgeTotal: c(f) };
                    i({ calendarCell: p }), v.push(p), s.add(1, "day") }
                return v }

            function f(e, a) {
                for (var r = t(a).startOf("week"), s = t(a).endOf("week"), d = r.clone(), c = [], v = t().startOf("day"); c.length < 7;) c.push({ weekDayLabel: i(d, n.dateFormats.weekDay), date: d.clone(), dayLabel: i(d, n.dateFormats.day), isPast: d.isBefore(v), isToday: d.isSame(v), isFuture: d.isAfter(v), isWeekend: [0, 6].indexOf(d.day()) > -1 }), d.add(1, "day");
                var m = o(e, r, s).map(function(e) {
                    var n, a, i = t(r).startOf("day"),
                        o = t(s).startOf("day"),
                        d = l({ start: t(e.startsAt).startOf("day"), end: t(e.endsAt || e.startsAt).startOf("day") }, e.recursOn, i),
                        c = d.start,
                        v = d.end;
                    return n = c.isBefore(i) || c.isSame(i) ? 0 : c.diff(i, "days"), v.isAfter(o) && (v = o), c.isBefore(i) && (c = i), a = t(v).diff(c, "days") + 1, e.daySpan = a, e.dayOffset = n, e });
                return { days: c, events: m } }

            function p(e, n, a, i, r) {
                var l = t(a || "05:00", "HH:mm").hours(),
                    d = t(i || "23:00", "HH:mm").hours(),
                    c = 60 / r * 30,
                    v = t(n).startOf("day").add(l, "hours"),
                    m = t(n).startOf("day").add(d, "hours"),
                    u = (d - l + 1) * c,
                    f = c / 60,
                    p = [],
                    w = o(e, t(n).startOf("day").toDate(), t(n).endOf("day").toDate());
                return w.map(function(e) {
                    if (t(e.startsAt).isBefore(v) ? e.top = 0 : e.top = t(e.startsAt).startOf("minute").diff(v.startOf("minute"), "minutes") * f - 2, t(e.endsAt || e.startsAt).isAfter(m)) {
                        var n = e.startsAt;
                        console.log(t(e.endsAt || e.startsAt).diff(n, "minutes")), e.endsAt ? e.height = t(e.endsAt || e.startsAt).diff(n, "minutes") * f : e.height = 30, console.log(e.height) } else {
                        var n = e.startsAt;
                        t(e.startsAt).isBefore(v) && (n = v.toDate()), e.endsAt ? e.height = t(e.endsAt || e.startsAt).diff(n, "minutes") * f : e.height = 30 }
                    return e.top - e.height > u && (e.height = 0), e.left = 0, e }).filter(function(e) {
                    return e.height > 0 }).map(function(e) {
                    var t = !0;
                    return p.forEach(function(n, a) {
                        var i = !0;
                        n.forEach(function(t) {
                            (s(e, t.startsAt, t.endsAt || t.startsAt) || s(t, e.startsAt, e.endsAt || e.startsAt)) && (i = !1) }), i && t && (t = !1, e.left = 150 * a, p[a].push(e)) }), t && (e.left = 150 * p.length, p.push([e])), e }) }

            function w(e, n, a, i, r) {
                var l = f(e, n),
                    s = [];
                return l.days.forEach(function(e) {
                    var n = l.events.filter(function(n) {
                            return t(n.startsAt).startOf("day").isSame(t(e.date).startOf("day")) }),
                        o = p(n, e.date, a, i, r);
                    s = s.concat(o) }), l.events = s, l }

            function h(e, n, a) {
                var i = t(e || "05:00", "HH:mm"),
                    r = t(n || "23:00", "HH:mm"),
                    l = 60 / a * 30;
                return (r.diff(i, "hours") + 1) * l + 2 }

            function g(e) { C = e }

            function y() {
                return C }
            var C = [];
            return { getWeekDayNames: v, getYearView: m, getMonthView: u, getWeekView: f, getDayView: p, getWeekViewWithTimes: w, getDayViewHeight: h, adjustEndDateFromStartDiff: r, formatDate: i, eventIsInPeriod: s, setEvent: g, getEvent: y } }]) }, function(e, t, n) { "use strict";
        var a = n(12);
        a.module("mwl.calendar").factory("calendarTitle", ["moment", "calendarConfig", "calendarHelper", function(e, t, n) {
            function a(e) {
                return n.formatDate(e, t.titleFormats.day) }

            function i(n) {
                var a = t.titleFormats.week;
                return a.replace("{week}", e(n).isoWeek()).replace("{year}", e(n).format("YYYY")) }

            function r(e) {
                return n.formatDate(e, t.titleFormats.month) }

            function l(e) {
                return n.formatDate(e, t.titleFormats.year) }
            return { day: a, week: i, month: r, year: l } }]) }, function(e, t, n) { "use strict";
        var a, i = n(12);
        try { a = n(47) } catch (r) { a = null }
        i.module("mwl.calendar").constant("interact", a) }, function(e, n) {
        if ("undefined" == typeof t) {
            var a = new Error('Cannot find module "undefined"');
            throw a.code = "MODULE_NOT_FOUND", a }
        e.exports = t }, function(e, t, n) { "use strict";
        var a = n(12),
            i = n(49);
        a.module("mwl.calendar").constant("moment", i) }, function(e, t) { e.exports = n }])
});

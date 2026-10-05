"use strict";
/*
 * Doctor profile > Schedule tab (new design).
 *
 * Same data and same presentation as Admin > Users > "Time Slots (New)": it calls
 * Admin/GetUserSchedulesV2 per provider and maps it with eHnoteScheduleV2ViewService,
 * so a schedule reads identically on both screens. The only difference is that this
 * screen is read-only apart from Connect, which still goes through the profile
 * controller's connectScheduleFromList().
 *
 * Providers come from the parent EhnoteUserProfileCtrl's ConnectedUserScheduleSlotsArray
 * (citem.DoctorId / DoctorFullName / RoleName). Schedules are fetched the first time a
 * provider is expanded, not all up front.
 */
eHnoteWebApp.controller('ProfileScheduleV2Ctrl', ['$scope', 'alertify', 'eHnoteMasterDataService', 'eHnoteMainAdminServices', 'eHnoteScheduleV2ViewService',
    function ($scope, alertify, eHnoteMasterDataService, eHnoteMainAdminServices, scheduleV2View) {

        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        var hospitalInfo = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo;

        var vm = this;

        vm.expanded = {};          // "<doctorId>_<scheduleId>_<groupIndex>" -> bool
        vm.byDoctor = {};          // doctorId -> { loading, error, schedules[] }
        vm.otherVisibleCount = {}; // doctorId -> how many inactive schedules are shown

        /* ------------------------------------------------------------- display */

        vm.fmtTime = scheduleV2View.dateToAmPm;
        vm.dayName = scheduleV2View.dayName;
        vm.dateSummary = scheduleV2View.dateSummary;
        vm.summaryRows = function (g) { return scheduleV2View.summaryRows(g); };
        vm.dayTotal = scheduleV2View.dayTotal;
        vm.durationSummary = scheduleV2View.durationSummary;
        vm.createdSummary = scheduleV2View.createdSummary;

        vm.toggleExpanded = function (key) { vm.expanded[key] = !vm.expanded[key]; };

        /* ---------------------------------------------------------------- load */

        function stateFor(citem) {
            var id = citem.DoctorId;
            if (!vm.byDoctor[id]) vm.byDoctor[id] = { loading: false, loaded: false, error: "", schedules: [] };
            return vm.byDoctor[id];
        }
        vm.state = stateFor;

        vm.load = function (citem) {
            var st = stateFor(citem);
            if (st.loading || st.loaded) return;
            st.loading = true;
            st.error = "";
            eHnoteMainAdminServices.GetUserSchedulesV2({
                "UserId": citem.DoctorId, "BranchId": hospitalInfo.HospitalID, "UserScheduleId": 0
            }).then(function (resp) {
                st.loading = false;
                if (!scheduleV2View.isOk(resp)) {
                    st.error = (resp.data && resp.data.Message) || "Could not load schedules";
                    return;
                }
                st.schedules = ((resp.data && resp.data.rows) || []).map(scheduleV2View.fromServer);
                st.loaded = true;
                vm.otherVisibleCount[citem.DoctorId] = 3;
            }, function () {
                st.loading = false;
                st.error = "Could not load schedules";
            });
        };

        // Expanding is display only - the schedules are already loaded.
        vm.toggleDoctor = function (citem) {
            if ($scope.OnClickShowUerSchedules) $scope.OnClickShowUerSchedules(citem);
        };

        // Load every provider as soon as the list arrives, so opening a provider shows
        // its schedules straight away rather than firing a request on each expand.
        $scope.$watch(function () {
            return ($scope.ConnectedUserScheduleSlotsArray || []).map(function (c) { return c.DoctorId; }).join(",");
        }, function () {
            ($scope.ConnectedUserScheduleSlotsArray || []).forEach(function (c) { vm.load(c); });
        });

        /* --------------------------------------------------------------- lists */

        vm.activeSchedules = function (citem) {
            return stateFor(citem).schedules.filter(function (s) { return s.activeNow; });
        };
        vm.otherSchedules = function (citem) {
            return stateFor(citem).schedules.filter(function (s) { return !s.activeNow; });
        };
        vm.visibleCount = function (citem) { return vm.otherVisibleCount[citem.DoctorId] || 3; };
        vm.showMore = function (citem) {
            vm.otherVisibleCount[citem.DoctorId] = vm.visibleCount(citem) + 3;
        };

        /* ------------------------------------------------------------- connect */

        vm.canConnect = function () {
            return $scope.UserAccessRights && $scope.UserAccessRights.AllAccessRights &&
                $scope.UserAccessRights.AllAccessRights.ProfileConnectScheduleButton;
        };

        // Connect is unchanged: it wants the raw schedule row from the old feed, so
        // match this card back to it by UserScheduleId before handing it over.
        vm.connect = function (s, citem) {
            var raw = (citem.UserSchedule || []).filter(function (x) { return x.UserScheduleId === s.id; })[0];
            if (!raw) {
                alertify.error("This schedule is not available to connect yet — reload the page and try again.");
                return;
            }
            if ($scope.connectScheduleFromList) $scope.connectScheduleFromList(raw, citem);
        };
    }
]);

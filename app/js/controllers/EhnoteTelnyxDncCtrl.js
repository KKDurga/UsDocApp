"use strict";
/*  Admin > Do Not Call List
 *
 *  The list of numbers the practice must not dial, and the audited way to take a
 *  number back off it. Adding happens in the Call Center; this screen exists so the
 *  list can be reviewed and lifted in one place rather than only row by row.
 */
eHnoteWebApp.controller('EhnoteTelnyxDncCtrl',
    ['$scope', 'eHnoteMasterDataService', 'eHnoteMainAppointmentService', 'alertify',
    function ($scope, eHnoteMasterDataService, eHnoteMainAppointmentService, alertify) {

        var doctorinfo = eHnoteMasterDataService.getUserInfo();

        $scope.HospitalId = 0;
        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined) {
            $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        }
        $scope.UserId = eHnoteMasterDataService.getLoginId();

        $scope.dncRows = [];
        $scope.dncTotalCount = 0;
        $scope.dncList = {
            Search: '',
            IncludeRemoved: false,
            PageNumber: 1,
            PageSize: 25
        };

        // (939) 397-8532 from +19393978532 / 9393978532; left alone when it is not a
        // 10 digit US number, so short codes and junk stay readable as entered.
        $scope.fmtPhone = function (n) {
            if (!n) { return '—'; }
            var d = ('' + n).replace(/\D/g, '');
            if (d.length === 11 && d.charAt(0) === '1') { d = d.substring(1); }
            if (d.length !== 10) { return n; }
            return '(' + d.substring(0, 3) + ') ' + d.substring(3, 6) + '-' + d.substring(6);
        };

        $scope.loadDncList = function () {
            eHnoteMainAppointmentService.GetTelnyxDncList({
                "HospitalId": $scope.HospitalId,
                "Search": $scope.dncList.Search || '',
                "IncludeRemoved": !!$scope.dncList.IncludeRemoved,
                "PageNumber": $scope.dncList.PageNumber,
                "PageSize": $scope.dncList.PageSize
            }).then(function (resp) {
                var d = (resp && resp.data) || {};
                if (d.Status !== 'Success') {
                    alertify.error(d.Message || 'Could not load the Do Not Call list');
                    return;
                }
                $scope.dncRows = d.rows || [];
                $scope.dncTotalCount = parseInt(d.TotalCount, 10) || 0;
            }, function () {
                alertify.error('Could not load the Do Not Call list');
            });
        };

        $scope.applyDncFilter = function () {
            $scope.dncList.PageNumber = 1;
            $scope.loadDncList();
        };

        $scope.clearDncFilter = function () {
            $scope.dncList.Search = '';
            $scope.dncList.IncludeRemoved = false;
            $scope.dncList.PageNumber = 1;
            $scope.loadDncList();
        };

        /* ── Removal ──
           A reason is required. The row is soft deleted server side, so the period the
           number spent on the list stays provable after the block is lifted. */

        $scope.dncRemove = { show: false };

        $scope.openDncRemove = function (d) {
            $scope.dncRemove = {
                show: true,
                number: d.PhoneNumber,
                removalReason: '',
                saving: false
            };
        };

        $scope.closeDncRemove = function () { $scope.dncRemove = { show: false }; };

        $scope.confirmDncRemove = function () {
            if (!$scope.dncRemove.removalReason || !$scope.dncRemove.removalReason.trim()) {
                alertify.error('Please enter a reason for removing this number');
                return;
            }

            $scope.dncRemove.saving = true;
            eHnoteMainAppointmentService.RemoveTelnyxNumberFromDnc({
                "HospitalId": $scope.HospitalId,
                "UserId": $scope.UserId,
                "PhoneNumber": $scope.dncRemove.number,
                "RemovalReason": $scope.dncRemove.removalReason.trim()
            }).then(function (resp) {
                $scope.dncRemove.saving = false;
                var d = (resp && resp.data) || {};
                if (d.Status !== 'Success') {
                    alertify.error(d.Message || 'Could not remove the number');
                    return;
                }
                alertify.success('Removed from Do Not Call');
                $scope.closeDncRemove();
                $scope.loadDncList();
            }, function () {
                $scope.dncRemove.saving = false;
                alertify.error('Could not remove the number');
            });
        };

        $scope.loadDncList();
    }]);

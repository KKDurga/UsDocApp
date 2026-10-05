

"use strict";
eHnoteWebApp.controller("UsODReportGridContainerCtrl", ["$scope", "$uibModalInstance", "$timeout", "PObj", "eHnoteMainDashboardDataServices", "eHnoteMasterDataService", "$filter", "alertify",
    function ($scope, $uibModalInstance, $timeout, PObj, eHnoteMainDashboardDataServices, eHnoteMasterDataService, $filter, alertify) {

        let gridApi = null;

        $scope.close = function () {
            $uibModalInstance.dismiss("cancel");
        };

        /* ---------------- USER / HOSPITAL INFO ---------------- */
        $scope.doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.HospitalId = 0;
        $scope.ParentHospitalId = 0;
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        if ($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode
            && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID) {
            $scope.HospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            $scope.ParentHospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        }

        $scope.MainPobj = PObj.Mainobj || {};
        $scope.SelectedId = PObj.id || '';

        /* the cell that was clicked on the OD grid:
           { doctorName, doctorRow, month, metric, value, isDateWise } */
        $scope.CellInfo = PObj.selecteditem || {};

        $scope.MetricLabels = {
            TotalAppointmentsScheduled: 'Total Appointments Scheduled',
            NewAppointments: 'New Appointments',
            NewAppointmentsSeen: 'New Appointments Seen',
            TotalSeen: 'Total Seen',
            NoShow: 'No Show',
            Cancelled: 'Cancelled'
        };

        $scope.MetricLabel = $scope.MetricLabels[$scope.CellInfo.metric] || $scope.CellInfo.metric || '';
        $scope.ODDetailsCount = 0;

        /* the metric tabs shown on the details popup - same order the grid
           puts the columns in, so the one that was clicked reads as selected */
        $scope.MetricTabs = [
            { key: 'TotalAppointmentsScheduled', label: 'Total Sched.' },
            { key: 'NewAppointments', label: 'New Appts' },
            { key: 'NewAppointmentsSeen', label: 'New Seen' },
            { key: 'TotalSeen', label: 'Total Seen' },
            { key: 'NoShow', label: 'No Show' },
            { key: 'Cancelled', label: 'Cancelled' }
        ];

        /* ---------------- display formatting ----------------

           Everything on this popup follows the us conventions the report is
           read in: MM-DD-YYYY dates, (999) 999-9999 phone numbers and the
           doctor shown the way they sign - "Dr. Steve Smith, MD".
           ---------------------------------------------------- */

        /* the api hands dates back in a few shapes ("2026-08-31",
           "2026-08-31T00:00:00", "2026-08-31 10:30:00", "08/31/2026"); the
           angular date filter returns the input untouched for the ones it
           cannot read, so they are parsed here first */
        function toDate(value) {
            if (!value) { return null; }
            if (value instanceof Date) { return value; }

            var text = String(value).trim();
            var parts = text.split('T')[0].split(' ')[0].split(/[-\/]/);

            if (parts.length === 3) {
                if (parts[0].length === 4) {
                    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
                }
                return new Date(Number(parts[2]), Number(parts[0]) - 1, Number(parts[1]));
            }

            var loose = new Date(text);
            return isNaN(loose.getTime()) ? null : loose;
        }

        function usDate(value) {
            var parsed = toDate(value);
            return parsed ? $filter('date')(parsed, 'MM-dd-yyyy') : '';
        }

        /* "9900990011" -> "(990) 099-0011". Anything that is not a ten digit
           us number (or eleven with the country code) is left as it came */
        function usPhone(value) {
            if (!value) { return ''; }

            var digits = String(value).replace(/\D/g, '');
            if (digits.length === 11 && digits.charAt(0) === '1') {
                digits = digits.substring(1);
            }
            if (digits.length !== 10) { return String(value); }

            return digits.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        }

        /* first non empty value out of the row - the details proc spells a few
           of these differently per metric, so the likely names are all tried */
        function firstValue(row, fields) {
            for (var i = 0; i < fields.length; i++) {
                var value = (row || {})[fields[i]];
                if (value !== undefined && value !== null && String(value).trim() !== '') {
                    return String(value).trim();
                }
            }
            return '';
        }

        /* "Dr. Steve Smith, MD" - the prefix and the credentials are only
           added when the name the api returns does not already carry them */
        function doctorName(row) {
            var name = firstValue(row, ['AppointmentDoctoreName', 'AppointmentDoctorName', 'DoctorFullName', 'DoctorName']);
            if (!name) { return ''; }

            if (!/^dr\.?\s/i.test(name)) { name = 'Dr. ' + name; }

            var credentials = firstValue(row, ['SuffixName', 'DoctorSuffixName', 'Suffix', 'Degree', 'Qualification', 'Credentials']);
            if (credentials && name.toUpperCase().indexOf(credentials.toUpperCase()) === -1) {
                name = name + ', ' + credentials;
            }

            return name;
        }

        /* the bucket in the title - a month reads as "Aug-2026" already, a day
           comes back as a raw date key and has to be put into us format */
        $scope.BucketLabel = $scope.CellInfo.isDateWise
            ? usDate($scope.CellInfo.month)
            : ($scope.CellInfo.month || '');

        /* the doctor / visit reason selection carried over from the report */
        function selectedIds(list, idField) {
            return (list || [])
                .filter(function (item) { return item.isChecked; })
                .map(function (item) { return item[idField]; })
                .join(",");
        }

        /* reloads the details grid for the given metric - called on open and
           whenever a metric tab is clicked */
        $scope.LoadODDetails = function (metric) {
            if (metric) { $scope.CellInfo.metric = metric; }
            $scope.MetricLabel = $scope.MetricLabels[$scope.CellInfo.metric] || $scope.CellInfo.metric || '';

            if (!gridApi) { return; }

            $scope.ODDetailsCount = 0;
            gridApi.setGridOption('rowData', []);

            var isDaily = !!$scope.CellInfo.isDateWise;
            var bucket = $scope.CellInfo.month || '';

            /* daily drills into a single day, so the clicked date is the whole
               range; monthly keeps the range the report was run with */
            var startDate = isDaily ? bucket : $scope.MainPobj.PaymentFromDate;
            var endDate = isDaily ? bucket : $scope.MainPobj.PaymentToDate;

            const payload = {
                "Type": $scope.CellInfo.metric || '',
                "ReportType": isDaily ? "daily" : "monthly",
                "Month": bucket,
                "ParentOrganizationId": $scope.ParentHospitalId,
                "AllLocationInd": 0,
                // the branch selection the report was run with - "3,683"
                "LocationId": String($scope.MainPobj.LocationId || $scope.HospitalId || ''),
                "DoctorId": String($scope.SelectedId || ''),
                "UserIds": String($scope.SelectedId || ''),
                "VisitReasonIds": selectedIds($scope.MainPobj.VisitReasonList, 'ParentAppointmentVisitReasonId'),
                "StartDate": startDate,
                "EndDate": endDate,
                "PageSize": 100,
                "PageNumber": 1
            };

            // daily and monthly details come from different procs / endpoints
            var loadDetails = $scope.CellInfo.isDateWise
                ? eHnoteMainDashboardDataServices.GetODDailyReportAppointmentWiseDetails
                : eHnoteMainDashboardDataServices.GetODReportAppointmentWiseDetails;

            loadDetails(payload)
                .then(function (resp) {
                    if (resp.data.status === "Success") {
                        $scope.ODDetailsCount = resp.data.Count || 0;
                        gridApi.setGridOption('rowData', resp.data.rows || []);
                    } else {
                        alertify.error(resp.data.Message);
                    }
                })
                .catch(function () {
                    console.error('OD report details load failed');
                });
        };

        $scope.pageload = function () {
            $uibModalInstance.rendered.then(function () {

                const gridDiv = document.getElementById('ODDetailsAgGrid');
                if (!gridDiv) {
                    console.warn('OD details ag-Grid div not found');
                    return;
                }
                if (gridApi) {
                    gridApi.destroy();
                    gridApi = null;
                }

                function dateFormatter(p) {
                    return usDate(p.value);
                }

                function phoneFormatter(p) {
                    return usPhone(p.value);
                }

                const columnDefs = [
                    { headerName: 'Patient Name', field: 'FullName', width: 200, pinned: 'left' },
                    { headerName: 'MR #', field: 'MRNumber', width: 130 },
                    { headerName: 'DOB', field: 'DOB', width: 110, valueFormatter: dateFormatter },
                    { headerName: 'Age', field: 'AgeInYears', width: 80, type: 'numericColumn' },
                    { headerName: 'Gender', field: 'Gender', width: 100 },
                    { headerName: 'Mobile', field: 'MobileNo', width: 150, valueFormatter: phoneFormatter },
                    { headerName: 'Email', field: 'EmailId', width: 200 },
                    { headerName: 'Appt Date', field: 'AppointmentDate', width: 120, valueFormatter: dateFormatter },
                    { headerName: 'Visit Reason', field: 'AppointmentVisitReason', width: 200 },
                    // built off the whole row, so it sorts on what is shown
                   // { headerName: 'Doctor', colId: 'DoctorName', width: 220, valueGetter: function (p) { return doctorName(p.data); } }
                    { headerName: 'Doctor', field: 'AppointmentDoctoreName', width: 220 }
                ];

                const gridOptions = {
                    columnDefs: columnDefs,
                    rowData: [],
                    defaultColDef: {
                        sortable: true,
                        filter: false,
                        resizable: true,
                        suppressMovable: true,
                        suppressHeaderMenuButton: true
                    },
                    animateRows: false,
                    onGridReady: function (params) {
                        gridApi = params.api;
                        $scope.LoadODDetails();
                    }
                };

                gridApi = agGrid.createGrid(gridDiv, gridOptions);
            });
        };

        $scope.pageload();

    }]);

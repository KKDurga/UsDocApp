

"use strict";
eHnoteWebApp.controller("UsLeadGenerationGridContainerCtrl", ["$scope", "$uibModal", "$uibModalInstance", "$timeout", "PObj", "eHnoteMainDashboardDataServices", "eHnoteMasterDataService", "eHnoteReferalDataService", "eHnoteSettingsDataService", "$filter", "alertify",
    function ($scope, $uibModal, $uibModalInstance, $timeout, PObj, eHnoteMainDashboardDataServices, eHnoteMasterDataService, eHnoteReferalDataService, eHnoteSettingsDataService, $filter, alertify) {


        let gridApi = null;
        $scope.close = function () {
            //if (gridApi) {
            //    gridApi.destroy();
            //    gridApi = null;
            //}
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
        $scope.InsSubTab = PObj.type || '';
        $scope.SelectedId = PObj.id || '';

        $scope.PaymentDateRangeArray = [
            { Id: 1, Name: 'Today' },
            /* { Id: 2, Name: 'Yesterday' },*/
            /* { Id: 3, Name: 'Last week' },*/
            { Id: 4, Name: 'This month' },
            { Id: 5, Name: 'Last month' },
            { Id: 6, Name: 'Last 2 months' },
            { Id: 7, Name: 'Last 3 months' },
            //{ Id: 8, Name: 'Last 6 months' },
            { Id: 9, Name: 'This year' },
            { Id: 10, Name: 'Last year' },
            { Id: 11, Name: 'Custom Date' }
        ];

        $scope.setInsuranceCheckDateRange = function (selectedRangeId) {
            var currentDate = new Date();

            switch (selectedRangeId) {
                case 1: // Today
                    $scope.MainPobj.PaymentFromDate = new Date(currentDate);
                    $scope.MainPobj.PaymentToDate = new Date(currentDate);
                    break;
                case 2: // Yesterday
                    $scope.MainPobj.PaymentFromDate = new Date(currentDate.setDate(currentDate.getDate() - 1));
                    var currentDate = new Date();
                    $scope.MainPobj.PaymentToDate = new Date(currentDate.setDate(currentDate.getDate() - 1))// new Date(); // Reset to current date
                    break;
                case 3: // Last week
                    $scope.MainPobj.PaymentFromDate = new Date(currentDate.setDate(currentDate.getDate() - 7));
                    $scope.MainPobj.PaymentToDate = new Date(); // Reset to current date
                    break;
                case 4: // This month
                    $scope.MainPobj.PaymentFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                    $scope.MainPobj.PaymentToDate = new Date(); // Reset to current date
                    break;
                case 5: // Last month
                    $scope.MainPobj.PaymentFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
                    $scope.MainPobj.PaymentToDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0); // Last day of the previous month
                    break;
                case 6: // Last 2 months
                    $scope.MainPobj.PaymentFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1);
                    $scope.MainPobj.PaymentToDate = new Date(); // Reset to current date
                    break;
                case 7: // Last 3 months
                    $scope.MainPobj.PaymentFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, 1);
                    $scope.MainPobj.PaymentToDate = new Date(); // Reset to current date
                    break;
                case 8: // Last 6 months
                    $scope.MainPobj.PaymentFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 6, 1);
                    $scope.MainPobj.PaymentToDate = new Date(); // Reset to current date
                    break;
                case 9: // This year
                    $scope.MainPobj.PaymentFromDate = new Date(currentDate.getFullYear(), 0, 1); // January 1st of current year
                    $scope.MainPobj.PaymentToDate = new Date(); // Reset to current date
                    break;
                case 10: // Last year
                    $scope.MainPobj.PaymentFromDate = new Date(currentDate.getFullYear() - 1, 0, 1); // January 1st of last year
                    $scope.MainPobj.PaymentToDate = new Date(currentDate.getFullYear() - 1, 11, 31); // December 31st of last year
                    break;
                case 11: // Custom Date
                    $scope.MainPobj.PaymentFromDate = null;
                    $scope.MainPobj.PaymentToDate = null;
                    break;
                default:
                    $scope.MainPobj.PaymentFromDate = "";
                    $scope.MainPobj.PaymentToDate = "";
            }

            $scope.MainPobj.PaymentFromDate = $scope.MainPobj.PaymentFromDate;
            $scope.MainPobj.PaymentToDate = $scope.MainPobj.PaymentToDate;

            if ($scope.MainPobj.PaymentFromDate != '') {
                $scope.MainPobj.PaymentFromDate = $filter('date')($scope.MainPobj.PaymentFromDate, "MM-dd-yyyy");
            }
            if ($scope.MainPobj.PaymentToDate != '') {
                $scope.MainPobj.PaymentToDate = $filter('date')($scope.MainPobj.PaymentToDate, "MM-dd-yyyy");
            }
        };

        /* the metric that was clicked on the monthly grid:
           { doctorName, doctorRow, month, metric, value } */
        $scope.CellInfo = PObj.selecteditem || {};

        $scope.MetricLabels = {
            scheduled: 'Scheduled',
            seen: 'Seen',
            surgeries: 'Surgeries'
        };

        /* the metric tabs shown on the details popup */
        $scope.MetricTabs = [
            { key: 'scheduled', label: 'Scheduled' },
            { key: 'seen', label: 'Seen' },
            { key: 'surgeries', label: 'Surgeries' }
        ];

        /* the bucket in the title - a month reads as "Aug-2026" already, a day
           comes back as a raw date key and has to be put into us format */
        $scope.BucketLabel = $scope.CellInfo.isDateWise
            ? usDate($scope.CellInfo.month)
            : ($scope.CellInfo.month || '');

        
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
        $scope.usDate = usDate;

        /* toDate drops everything after the T - the creation stamp needs the
           clock time too, and "2026-05-22T14:34:58.347" carries no zone, so it
           is read as local rather than let Date shift it */
        function toDateTime(value) {
            if (!value) { return null; }
            if (value instanceof Date) { return value; }

            var text = String(value).trim();
            var match = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?/.exec(text);
            if (match) {
                return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]),
                                Number(match[4]), Number(match[5]), Number(match[6] || 0));
            }

            var loose = new Date(text);
            return isNaN(loose.getTime()) ? toDate(text) : loose;
        }

        /* same date, with the clock time - used for the appointment creation stamp */
        function usDateTime(value) {
            var parsed = toDateTime(value);
            return parsed ? $filter('date')(parsed, 'MM-dd-yyyy hh:mm a') : '';
        }
        $scope.usDateTime = usDateTime;

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

        /* the details proc returns the surgery as a procedure code / name pair -
           show both when they are there, otherwise whichever one came back */
        function surgeryName(row) {
            var code = firstValue(row, ['ProcedureCode', 'SurgeryProcedureCode', 'SurgeryCode']);
            var name = firstValue(row, ['ProcedureName', 'SurgeryName', 'SurgeryTypeName', 'SurgeryProcedureName', 'Surgery']);

            if (code && name) { return code + ' - ' + name; }
            return name || code;
        }

        /* reloads the details grid for the given metric - called on open and
           whenever a metric tab is clicked */
        $scope.LoadLeadDetails = function (metric) {
            if (metric) { $scope.CellInfo.metric = metric; }
            $scope.MetricLabel = $scope.MetricLabels[$scope.CellInfo.metric] || '';
            $scope.SurgeryDetailsCount = 0;

            if (!gridApi) { return; }
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
                // the branch selection the report was run with - "3,683"
                "LocationId": String($scope.MainPobj.LocationId || $scope.HospitalId || ''),
                "DoctorId": String($scope.SelectedId || ''),
                "UserIds": String($scope.SelectedId || ''),
                "StartDate": startDate,
                "EndDate": endDate,
                "PageSize": 100,
                "PageNumber": 1
            };

            eHnoteMainDashboardDataServices.GetNewPatientLeadGenerationReportAppointmentWiseSurgeryDetails(payload)
                .then(function (resp) {
                    if (resp.data.status === "Success") {
                        $scope.SurgeryDetailsCount = resp.data.Count || 0;
                        gridApi.setGridOption('rowData', resp.data.rows || []);
                    } else {
                        alertify.error(resp.data.Message);
                    }
                })
                .catch(function () {
                    console.error('Lead generation details load failed');
                });
        };

        $scope.init = function () {
            $scope.InSubTab = PObj.type === 'SurgeryDetails' ? 'SurgeryDetails' : 'MonthlyReport';
            $scope.MetricLabel = $scope.MetricLabels[$scope.CellInfo.metric] || '';
            $scope.pageload();
        }

        $scope.checkAllLeadUser = function (val) {
            if (val) {
                angular.forEach($scope.MainPobj.AllDoctorList, function (item) {
                    item.isChecked = true;
                });
                $scope.MainPobj.SelectUserStatusString = 'All Doctors';
            } else {
                angular.forEach($scope.MainPobj.AllDoctorList, function (item) {
                    item.isChecked = false;
                });
                $scope.MainPobj.SelectUserStatusString = 'Select';
            }
            var checkedArray = _.where($scope.MainPobj.AllDoctorList, { isChecked: true });
            $scope.MainPobj.AllDoctorCheck = checkedArray.length > 0 && $scope.MainPobj.AllDoctorList.length === checkedArray.length ? true : false;

        };

        $scope.LeadUserToggle = function (item) {
            var checkedArray = _.where($scope.MainPobj.AllDoctorList, { isChecked: true });
            $scope.MainPobj.AllUserStatusCheck = checkedArray.length > 0 && $scope.MainPobj.AllDoctorList.length === checkedArray.length ? true : false;

            if (checkedArray.length == 0) {
                $scope.MainPobj.SelectUserStatusString = "Select";
            } else {
                if (checkedArray.length === 1) {
                    $scope.MainPobj.SelectUserStatusString = checkedArray[0].SecondUserFullName + '-' + checkedArray[0].NPI;
                } else {
                    $scope.MainPobj.SelectUserStatusString = "Selected";
                }
            }

        };

        $scope.pageload = function () {
            let UserIds = ($scope.MainPobj.AllDoctorList || [])
                .filter(pitem => pitem.isChecked)
                .map(pitem => pitem.DoctorID)
                .join(",");
            if ($scope.InSubTab == 'SurgeryDetails') {
                $scope.SurgeryDetailsCount = 0;

                $uibModalInstance.rendered.then(function () {

                    const gridDiv = document.getElementById('LeadDetailsAgGrid');
                    if (!gridDiv) {
                        console.warn('Lead details ag-Grid div not found');
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

                    function dateTimeFormatter(p) {
                        return usDateTime(p.value);
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
                        { headerName: 'Appt Created Date', field: 'AppointmentCreatedDt', width: 180, valueFormatter: dateTimeFormatter },
                        { headerName: 'Visit Reason', field: 'AppointmentVisitReason', width: 200 },
                        // built off the whole row, so they sort on what is shown
                        { headerName: 'Surgery', colId: 'SurgeryName', width: 200, valueGetter: function (p) { return surgeryName(p.data); } },
                       // { headerName: 'Doctor', colId: 'DoctorName', width: 220, valueGetter: function (p) { return doctorName(p.data); } },
                        { headerName: 'Doctor', field: 'AppointmentDoctorName', width: 220 }
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
                            $scope.LoadLeadDetails();
                        }
                    };

                    gridApi = agGrid.createGrid(gridDiv, gridOptions);
                });
            }
            else if ($scope.InSubTab == 'MonthlyReport') {
                $scope.MonthlyReportCount = 0;

                $uibModalInstance.rendered.then(function () {

                    const gridDiv = document.getElementById('InspopupAgGrid');
                    if (!gridDiv) {
                        console.warn('Popup ag-Grid div not found');
                        return;
                    }
                    if (gridApi) {
                        gridApi.destroy();
                        gridApi = null;
                    }

                    /* ---------- helpers ---------- */

                    function monthToDate(label) {
                        const map = {
                            Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
                            Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
                        };
                        const parts = label.split('-');
                        return new Date(Number(parts[1]), map[parts[0]] || 0, 1);
                    }

                    // factory so each cell closes over the correct month + key
                    function metricCol(month, key, header) {
                        return {
                            headerName: header,
                            width: 90,
                            type: 'numericColumn',
                            valueGetter: function (p) {
                                if (p.data && p.data.data && p.data.data[month]) {
                                    return p.data.data[month][key];
                                }
                                return 0;
                            }
                        };
                    }

                    function buildColumnDefs(rows) {
                        const monthSet = {};
                        angular.forEach(rows, function (r) {
                            angular.forEach(r.data || {}, function (v, m) { monthSet[m] = true; });
                        });
                        const months = Object.keys(monthSet).sort(function (a, b) {
                            return monthToDate(a) - monthToDate(b);
                        });

                        const cols = [
                            { headerName: 'Doctor', field: 'name', pinned: 'left', width: 220 }
                        ];

                        angular.forEach(months, function (month) {
                            cols.push({
                                headerName: month,
                                children: [
                                    metricCol(month, 'scheduled', 'Sched.'),
                                    metricCol(month, 'seen', 'Seen'),
                                    metricCol(month, 'surgeries', 'Surg.')
                                ]
                            });
                        });

                        return cols;
                    }

                    /* ---------- grid ---------- */

                    const gridOptions = {
                        columnDefs: [],
                        rowData: [],
                        defaultColDef: {
                            sortable: false,
                            filter: false,
                            resizable: true,
                            suppressMovable: true,
                            suppressHeaderMenuButton: true
                        },
                        animateRows: false,
                        onGridReady: function (params) {
                            gridApi = params.api;

                            const payload = {
                                "ReportType": "monthly",
                                "ParentOrganizationId": $scope.ParentHospitalId,
                                "AllLocationInd": 0,
                                // the branch selection the report was run with - "3,683"
                                "LocationId": String($scope.MainPobj.LocationId || $scope.HospitalId || ''),
                                "UserIds": UserIds,
                                "StartDate": $scope.MainPobj.PaymentFromDate,
                                "EndDate": $scope.MainPobj.PaymentToDate,
                                "PageSize": 100,
                                "PageNumber": 1
                            };

                            eHnoteMainDashboardDataServices.GetNewPatientLeadGenerationReport(payload)
                                .then(function (resp) {
                                    if (resp.data.status === "Success") {
                                        const rows = resp.data.rows || [];
                                        $scope.MonthlyReportCount = resp.data.Count;
                                        gridApi.setGridOption('columnDefs', buildColumnDefs(rows));
                                        gridApi.setGridOption('rowData', rows);
                                    }
                                })
                                .catch(function () {
                                    console.error('Monthly report load failed');
                                });
                        }
                    };

                    gridApi = agGrid.createGrid(gridDiv, gridOptions);
                });
            }
            else if ($scope.InSubTab == 'MonthlyReportBack') {
                $scope.MonthlyReportCount = 0;

                $uibModalInstance.rendered.then(function () {

                    const gridDiv = document.getElementById('InspopupAgGrid');
                    if (!gridDiv) {
                        console.warn('Popup ag-Grid div not found');
                        return;
                    }
                    if (gridApi) {
                        gridApi.destroy();
                        gridApi = null;
                    }

                    /* ---------- helpers ---------- */

                    function monthToDate(label) {
                        const map = {
                            Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
                            Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
                        };
                        const parts = label.split('-');
                        return new Date(Number(parts[1]), map[parts[0]] || 0, 1);
                    }

                    // read the count out of a metric cell that may be
                    // an object ({count, details}), a bare number, or missing
                    function metricCount(row, month, key) {
                        var cell = row && row.data && row.data[month] ? row.data[month][key] : null;
                        if (cell == null) return 0;
                        return typeof cell === 'object' ? (cell.count || 0) : cell;
                    }

                    // the API names each list differently per metric
                    var detailsFieldMap = {
                        scheduled: 'ScheduledAppointmentsDetails',
                        seen: 'SeenAppointmentsDetails',
                        surgeries: 'SurgeriesAppointmentsDetails'
                    };

                    // read the details array out of a metric cell
                    function metricDetails(row, month, key) {
                        var cell = row && row.data && row.data[month] ? row.data[month][key] : null;
                        if (!cell) return [];
                        // use the mapped field name, but fall back to a few
                        // likely alternatives so a naming tweak won't break it
                        return cell[detailsFieldMap[key]]
                            || cell.details
                            || cell.Details
                            || [];
                    }

                    // factory so each cell closes over the correct month + key
                    function metricCol(month, key, header) {
                        return {
                            headerName: header,
                            width: 90,
                            type: 'numericColumn',
                            // custom props so onCellClicked knows what was clicked
                            metricMonth: month,
                            metricKey: key,
                            valueGetter: function (p) {
                                return metricCount(p.data, month, key);
                            },
                            // pointer + link style only when there's something to click
                            cellStyle: function (p) {
                                return p.value > 0
                                    ? { cursor: 'pointer', color: '#2a6ebb', textDecoration: 'underline' }
                                    : null;
                            }
                        };
                    }

                    function buildColumnDefs(rows) {
                        const monthSet = {};
                        angular.forEach(rows, function (r) {
                            angular.forEach(r.data || {}, function (v, m) { monthSet[m] = true; });
                        });
                        const months = Object.keys(monthSet).sort(function (a, b) {
                            return monthToDate(a) - monthToDate(b);
                        });

                        const cols = [
                            { headerName: 'Doctor', field: 'name', pinned: 'left', width: 220 }
                        ];

                        angular.forEach(months, function (month) {
                            cols.push({
                                headerName: month,
                                children: [
                                    metricCol(month, 'scheduled', 'Sched.'),
                                    metricCol(month, 'seen', 'Seen'),
                                    metricCol(month, 'surgeries', 'Surg.')
                                ]
                            });
                        });

                        return cols;
                    }

                    /* ---------- grid ---------- */

                    const gridOptions = {
                        columnDefs: [],
                        rowData: [],
                        defaultColDef: {
                            sortable: false,
                            filter: false,
                            resizable: true,
                            suppressMovable: true,
                            suppressHeaderMenuButton: true
                        },
                        animateRows: false,
                        onCellClicked: function (params) {
                            var colDef = params.colDef || {};
                            if (!colDef.metricKey) return;      // ignore the Doctor column
                            if (!(params.value > 0)) return;    // nothing behind a 0

                            var month = colDef.metricMonth;
                            var key = colDef.metricKey;
                            var details = metricDetails(params.data, month, key);

                            $scope.showLeadDetails({
                                doctor: params.data.name,
                                month: month,
                                metricLabel: colDef.headerName,   // Sched. / Seen / Surg.
                                details: details
                            });
                        },
                        onGridReady: function (params) {
                            gridApi = params.api;

                            const payload = {
                                "ReportType": "monthly",
                                "ParentOrganizationId": $scope.ParentHospitalId,
                                "AllLocationInd": 0,
                                // the branch selection the report was run with - "3,683"
                                "LocationId": String($scope.MainPobj.LocationId || $scope.HospitalId || ''),
                                "UserIds": UserIds,
                                "StartDate": $scope.MainPobj.PaymentFromDate,
                                "EndDate": $scope.MainPobj.PaymentToDate,
                                "PageSize": 100,
                                "PageNumber": 1
                            };

                            eHnoteMainDashboardDataServices.GetNewPatientLeadGenerationReport(payload)
                                .then(function (resp) {
                                    if (resp.data.status === "Success") {
                                        const rows = resp.data.rows || [];
                                        $scope.MonthlyReportCount = resp.data.Count;
                                        gridApi.setGridOption('columnDefs', buildColumnDefs(rows));
                                        gridApi.setGridOption('rowData', rows);
                                    }
                                })
                                .catch(function () {
                                    console.error('Monthly report load failed');
                                });
                        }
                    };

                    gridApi = agGrid.createGrid(gridDiv, gridOptions);
                });
            }
            else {

            }
        };

        $scope.init();





    }]);
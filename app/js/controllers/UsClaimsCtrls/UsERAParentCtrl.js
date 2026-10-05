"use strict";
eHnoteWebApp.controller("UsERAParentCtrl", ["$scope", "$rootScope", "$filter", "alertify", "$uibModal", "datapersistanceFactory", "$q", "$timeout", "eHnoteMasterDataService", "eHnoteSettingsDataService", "eHnotePatientDataService","eHnoteInsuranceService",
    function ($scope, $rootScope, $filter, alertify, $uibModal, datapersistanceFactory, $q, $timeout, eHnoteMasterDataService, eHnoteSettingsDataService, eHnotePatientDataService,eHnoteInsuranceService) {
        $scope.doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.HospitalId = 0;
        $scope.ParentHospitalId = 0;
        if ($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode
            && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID) {
            $scope.HospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            $scope.ParentHospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        }
        $scope.UserId = eHnoteMasterDataService.getLoginId();

        $scope.ERASubTabs = 1;
        $scope.SwitchERASubTabs = function (tabchange) {
            $scope.ERASubTabs = tabchange;
        }
        
        $scope.serchobj = {
            "ClaimStatusList": "",
            "OrganizationId": $scope.HospitalId,
            "ClaimNumber": "",
        };


        $scope.SearchPatientwithClaimId = function (pageno, type) {
            var type = (type === undefined || type === '') ? 'All' : type;
            var params = {
                "OrganizationId": $scope.serchobj.OrganizationId,
                "OrganizationFacilityId": 0,
                "FromDate": "",
                "ToDate": "",
                "PatientId": 0,
                "SearchText": "",
                "PatientMRNo": "",
                "PatienClaimNumber": $scope.serchobj.ClaimNumber || "",
                "BatchNumber": "",
                "BillingProviderId": 0,
                "RenderingProviderId": 0,
                "TransmissionTypeId": 0,
                "ClaimTypeId": 0,
                "PayorId": 0,
                "ClaimStatusList": $scope.serchobj.ClaimStatusList,
                "PageSize": 100,
                "PageNumber": 1,
                "Type": type,
                "BillPaymentTypeId": 0,
                "CurrentResponsibilityId": 0,
                "DenialId": 0
            };

            eHnotePatientDataService.GetOrganizationClaimsListData(params).then(function (resp) {
                console.log(resp);

                resp.data.rows = resp.data.rows || [];
                if (resp.data.rows.length > 0) {
                        $scope.navtoClaimSummaryPopup(resp.data.rows[0]);
                }
            }, function (err) {

            });
            $scope.serchobj.ClaimNumber = "";
        }

        $scope.navtoClaimSummaryPopup = function (item) {

            item = item || '';
            let AppointmentId = null;
            let PatientId = null;
            if (item != '') {
                AppointmentId = item.AppointmentId;
                PatientId = item.PatientId;
            }

            $scope.claimScreenParentObj = {
                "PatientId": PatientId || null,
                "AppointmentId": AppointmentId || null,
                "AppointmentDate": item.AppointmentDate || null,
                "PatientFullName": item.PatientFullName || "",
                "ActionType": "EditClaim",
                "SubActionType": "Verify",
                "ScreenType": "Popup",
                "SuperBillId": null,
                "SuperBillArray": [],
                "PatientClaimId": item.PatientClaimId,
                "SuperBillId": item.SuperBillId || null,
                "SuperBillArray": item.SuperBillArray || [],
                "SuperBillDiagnosisArray": item.SuperBillDiagnosisArray || [],
                "OrganizationFacilityId": item.OrganizationFacilityId || 0
            };
            $scope.mainBillerDataObj.Tabid = 2;
            $scope.mainBillerDataObj.PatientId = $scope.mainBillerDataObj.PatientId || 0;
            $scope.mainBillerDataObj.PatientId = PatientId || 0;
            datapersistanceFactory.set("IsComingFromClaim", $scope.claimScreenParentObj);

            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/UsClaims/AddUpdateClaimPopup.html",
                "controller": "UsAddUpdateClaimPopupCtrl",
                "backdrop": "static",
                "keyboard": false,
                "windowClass": "modal__ninety--",
                "resolve": {
                    "mainBillerDataObj": function () { return $scope.mainBillerDataObj; },
                }
            });
            $scope.mInstanceAdd.result.then(function (resp) {
                resp = resp || "";

            }, function () { });
        }

        $scope.init = function () {

            $scope.MasterClaimStatusList = [];

            $q.all([

                eHnoteSettingsDataService.GetAllMasterClaimsData($scope.HospitalId),

            ]).then(function (resp) {

                if (resp[0].data.status == "Success") {
                    resp[0].data.rows = resp[0].data.rows || [];

                    if (resp[0].data.ClaimStatus.length > 0) {
                        $scope.MasterClaimStatusList = angular.copy(resp[0].data.ClaimStatus);
                        //$scope.ClaimStatusListDD = angular.copy(resp[0].data.ClaimStatus);
                        //$scope.ClaimStatusListDD.forEach(function (item) {
                        //    item.IsChecked = true;
                        //});
                        $scope.serchobj.ClaimStatusList = $scope.MasterClaimStatusList.map(function (status) {
                            return status.ClaimStatusId;
                        }).join(',');
                        console.log($scope.serchobj.ClaimStatusList);
                    }
                }
                console.log(resp);


                //  $scope.GetAllClaimStatusList()

            }, function (err) {
                console.log(err);
                alertify.error("Getting Data Failed");
            });

        }
        $scope.init();

        $scope.ERAListFilterNewPopup = function () {
            $scope.$broadcast("OpenERAListFilterPopup");

        };
        $scope.Export = {
            "EraDateRange": "",
            "PaymentToDate": "",
            "PaymentFromDate":""
        }
        $scope.Export.EraDateRange = 4;
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
        $scope.GetExporttoExcelObj = function () {
            var obj = {
                "UserId": $scope.UserId || null,
                "UserName": "",
                "PaymentFromDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "PaymentToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "DOSFromDate": "",
                "DOSToDate": "",
                "PayorObj": "",
                "ServiceObj": "",
                "ReferringObj": "",
                "PaymentDateRangeId": 1,
                "ServiceDateRangeId": 0,
                "PaymentTo": null,
                "SelectPaymentStatusString": "Select",
                "SelectRenderingStatusString": "Select",
                "SelectUserStatusString": "Select",
                "SelectLocationString": "Select",
                "LocationName": "",
                "AllStatusCheck": false,
                "AllRenderingStatusCheck": false,
                "AllUserStatusCheck": false,
                "AllLocationStatusCheck": false,
                "RenderingProviderList": $scope.mainBillerDataObj.AllDoctorsList || [],
                "AllUsersList": $scope.mainBillerDataObj.AllUsersList || [],
                "AllBranchesList": $scope.mainBillerDataObj.AllBranchesList || [],
                "BillingProviderList": $scope.mainBillerDataObj.BillingProviderList || [],
                "SelectBillingProviderString": "All",
                "BillingProviderName": "",
                "AllBillingProviderStatusCheck": true,
                "AllDoctorCheck": true,
                "AllPayorList": [],
                "AllReferalList": [],
                "AllProcedureList": [],
                "AllBillingProviderInd": 1,
                "AllRenderingProviderInd": 1,
                "AllLocationInd": 1,
                "AllMasterPayorsInd": 1,
                "AllProcedureInd": 1,
                "AllReferralProviderInd": 1,
                "AllPostingUsersInd": 1,
                "MonthsArray": [],

            }
            return obj;
        }
        $scope.ExporttoExcelObj = angular.copy($scope.GetExporttoExcelObj());

        $scope.GetExcelReportsObj = function () {
            let obj = {
                "ExportJobId": 0,
                "UserId": $scope.UserId,
                "RequestedByUserId": $scope.UserId || null,
                "RequestedByUserName": "",
                "OrganizationId": $scope.HospitalId,
                "ParentOrganizationId": $scope.ParentHospitalId,
                "ReportName": "ERA Detailed report",
                "ReportId": 8,
                "StatusId": 1,
                "StatusName": "Pending",
                "IsManualExport": true,
                "CSVFileName": "",
                "CSVFileExt": ".csv",
                "CSVFileUrl": null,
                "ErrorMessage": null,
                "startedOn": new Date(),
                "CompletedOn": null,
                "DeleteInd": "N",
                "AllBranchesList": "",
                "AllBillingProviderList": "",
                "AllUsersList": "",
                "AllRenderingProviderList": "",
                "AllMasterPaymentsMethods":"",
                "RequestType": "Immediate",

            };

            return obj;
        }


        $scope.ExcelReportsObj = $scope.GetExcelReportsObj();
        $scope.setInsuranceCheckDateRange = function (selectedRangeId) {
            var currentDate = new Date();

            switch (selectedRangeId) {
                case 1: // Today
                    $scope.ExporttoExcelObj.PaymentFromDate = new Date(currentDate);
                    $scope.ExporttoExcelObj.PaymentToDate = new Date(currentDate);
                    break;
                case 2: // Yesterday
                    $scope.ExporttoExcelObj.PaymentFromDate = new Date(currentDate.setDate(currentDate.getDate() - 1));
                    var currentDate = new Date();
                    $scope.ExporttoExcelObj.PaymentToDate = new Date(currentDate.setDate(currentDate.getDate() - 1))// new Date(); // Reset to current date
                    break;
                case 3: // Last week
                    $scope.ExporttoExcelObj.PaymentFromDate = new Date(currentDate.setDate(currentDate.getDate() - 7));
                    $scope.ExporttoExcelObj.PaymentToDate = new Date(); // Reset to current date
                    break;
                case 4: // This month
                    $scope.ExporttoExcelObj.PaymentFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                    $scope.ExporttoExcelObj.PaymentToDate = new Date(); // Reset to current date
                    break;
                case 5: // Last month
                    $scope.ExporttoExcelObj.PaymentFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
                    $scope.ExporttoExcelObj.PaymentToDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0); // Last day of the previous month
                    break;
                case 6: // Last 2 months
                    var result = getLastCompletedMonthsInfo(2);

                    $scope.ExporttoExcelObj.PaymentFromDate = result.startDate;
                    $scope.ExporttoExcelObj.PaymentToDate = result.endDate;
                    $scope.ExporttoExcelObj.MonthsArray = result.months;

                    //$scope.InsuranceReportsObj.PaymentFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1);
                    //$scope.InsuranceReportsObj.PaymentToDate = new Date(); // Reset to current date
                    break;
                case 7: // Last 3 months

                    var result = getLastCompletedMonthsInfo(3);

                    $scope.ExporttoExcelObj.PaymentFromDate = result.startDate;
                    $scope.ExporttoExcelObj.PaymentToDate = result.endDate;
                    $scope.ExporttoExcelObj.MonthsArray = result.months;


                    //$scope.InsuranceReportsObj.PaymentFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, 1);
                    //$scope.InsuranceReportsObj.PaymentToDate = new Date(); // Reset to current date
                    break;
                case 8: // Last 6 months
                    $scope.ExporttoExcelObj.PaymentFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 6, 1);
                    $scope.ExporttoExcelObj.PaymentToDate = new Date(); // Reset to current date
                    break;
                case 9: // This year
                    $scope.ExporttoExcelObj.PaymentFromDate = new Date(currentDate.getFullYear(), 0, 1); // January 1st of current year
                    $scope.ExporttoExcelObj.PaymentToDate = new Date(); // Reset to current date
                    break;
                case 10: // Last year
                    $scope.ExporttoExcelObj.PaymentFromDate = new Date(currentDate.getFullYear() - 1, 0, 1); // January 1st of last year
                    $scope.ExporttoExcelObj.PaymentToDate = new Date(currentDate.getFullYear() - 1, 11, 31); // December 31st of last year
                    break;
                case 11: // Custom Date
                    $scope.ExporttoExcelObj.PaymentFromDate = null;
                    $scope.ExporttoExcelObj.PaymentToDate = null;
                    break;
                default:
                    $scope.ExporttoExcelObj.PaymentFromDate = moment().format("MM-DD-YYYY") || null;
                    $scope.ExporttoExcelObj.PaymentToDate = moment().format("MM-DD-YYYY") || null;
            }

            $scope.ExporttoExcelObj.PaymentFromDate = $scope.ExporttoExcelObj.PaymentFromDate;
            $scope.ExporttoExcelObj.PaymentToDate = $scope.ExporttoExcelObj.PaymentToDate;

            if ($scope.ExporttoExcelObj.PaymentFromDate != '') {
                $scope.ExporttoExcelObj.PaymentFromDate = $filter('date')($scope.ExporttoExcelObj.PaymentFromDate, "MM-dd-yyyy");
            }
            if ($scope.ExporttoExcelObj.PaymentToDate != '') {
                $scope.ExporttoExcelObj.PaymentToDate = $filter('date')($scope.ExporttoExcelObj.PaymentToDate, "MM-dd-yyyy");
            }
        };
        function getLastCompletedMonthsInfo(monthCount) {

            var now = new Date();

            // End date = last day of previous month
            var endDate = new Date(now.getFullYear(), now.getMonth(), 0);

            // Start date = first day of (endDate - (monthCount - 1))
            var startDate = new Date(
                endDate.getFullYear(),
                endDate.getMonth() - (monthCount - 1),
                1
            );

            // Build months array
            var monthsArray = [];

            for (var i = monthCount - 1; i >= 0; i--) {
                var d = new Date(endDate.getFullYear(), endDate.getMonth() - i, 1);
                monthsArray.push(moment(d).format("MMM-YYYY"));
            }

            return {
                startDate: startDate,
                endDate: endDate,
                months: monthsArray
            };
        }
        $scope.ERAExportToExcelPopup = function () {
            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "ExporttoExcel.html",
                "size": "md",
                "keyboard": false,
                "backdrop": 'static',
                "windowClass": "modal__width--25",
                "scope": $scope,

                "resolve": {

                },
                "controller": function ($scope,$uibModalInstance,) {

                    $scope.uibclose = function () {
                        $scope.Export.EraDateRange = 4;
                        $uibModalInstance.dismiss("cancel");
                    };

                }


            });
        }
        $scope.ClickForERAExceldData = function () {
            var startDate = new Date($scope.ExporttoExcelObj.PaymentFromDate);
            var endDate = new Date($scope.ExporttoExcelObj.PaymentToDate);

            // Calculate difference in days
            var diffTime = endDate - startDate;
            var diffDays = diffTime / (1000 * 60 * 60 * 24);

            // Condition
            if (diffDays <= 7) {
                $scope.ExcelReportsObj.RequestType = "Immediate";
            } else {
                $scope.ExcelReportsObj.RequestType = "TaskRun";
            }
            let obj = {
                "ExportJobId": $scope.ExcelReportsObj.ExportJobId,
                "RequestedByUserId": $scope.ExcelReportsObj.RequestedByUserId,
                "RequestedByUserName": $scope.ExcelReportsObj.RequestedByUserName,
                "UserId": $scope.UserId,
                "OrganizationId": $scope.ExcelReportsObj.OrganizationId,
                "ParentOrganizationId": $scope.ExcelReportsObj.ParentOrganizationId,
                "ReportName": $scope.ExcelReportsObj.ReportName,
                "ReportId": $scope.ExcelReportsObj.ReportId,
                "StatusId": $scope.ExcelReportsObj.StatusId,
                "StatusName": $scope.ExcelReportsObj.StatusName,
                "IsManualExport": $scope.ExcelReportsObj.IsManualExport,
                "CSVFileName": $scope.ExcelReportsObj.CSVFileName,
                "CSVFileExt": $scope.ExcelReportsObj.CSVFileExt,
                "CSVFileUrl": $scope.ExcelReportsObj.CSVFileUrl,
                "ErrorMessage": $scope.ExcelReportsObj.ErrorMessage,
                "StartedOn": $scope.ExcelReportsObj.StartedOn,
                "CompletedOn": $scope.ExcelReportsObj.CompletedOn,
                "DeleteInd": $scope.ExcelReportsObj.DeleteInd,
                "RequestType": $scope.ExcelReportsObj.RequestType,
                "TypeofCsvdata":"ERADataExportandExcel",
                "RequestDetails": {
                    "PaymentFromDate": $scope.ExporttoExcelObj.PaymentFromDate,
                    "PaymentToDate": $scope.ExporttoExcelObj.PaymentToDate,
                    "LocationIds": "",
                    "BillingProviderIds": "",
                    "RenderingProviderIds": "",
                    "UserIds": "",
                    "MasterPayorIds": "" || null,
                    "ProcedureIds": "" || null,
                    "ReferralProviderIds": "" || null,
                    "PaymentModeIds": "" || null,
                    "DOSStartDate": "",
                    "DOSEndDate": ""
                }
            };

            eHnoteInsuranceService.InitiateInsuranceDetailedPaymentCSVData(obj).then(function (resp) {
                if (resp.data.status == "Success") {
                    $scope.Export.EraDateRange = 4;
                    alertify.success("Excel file exported successfully");
                    if ($scope.mInstanceAdd) {
                        $scope.mInstanceAdd.dismiss("cancel");
                    }

                } else {
                    alertify.error(resp.data.Message);
                }
            });
        }

        $scope.$on('navtoERAListScreenNew', function (event, id) {
            $scope.ERASubTabs = id;
            $scope.SwitchERASubTabs(id);
        });

        $scope.GetExcelDetailsObj = function () {
            let obj = {

                "UserId": $scope.UserId,
                "RequestedByUserId": null,
                "OrganizationId": $scope.HospitalId,
                "ParentOrganizationId": $scope.ParentHospitalId,
                "FromDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "ToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "PageSize": 100,
                "PageNumber": 1,
                "StatusId": null,
                "ReportId": null,
                "SelectUserStatusString": "All",
                "AllUserStatusCheck": true,
                "UserFullName": "",
                "AllUsersList": angular.copy($scope.mainBillerDataObj.AllUsersList) || [],
            };

            return obj;


        }

        $scope.ExcelDetailsObj = $scope.GetExcelDetailsObj();

        $scope.GetExportStatusList = function (activeMasterReportId) {

            let obj = {
                "OrganizationId": $scope.ExcelDetailsObj.OrganizationId,
                "RequestedByUserId": $scope.ExcelDetailsObj.RequestedByUserId,
                "FromDate":"",
                "ToDate": "",
                "PageSize": $scope.ExcelDetailsObj.PageSize,
                "PageNumber": $scope.ExcelDetailsObj.PageNumber,
                "StatusId": $scope.ExcelDetailsObj.StatusId,
                "ReportId": $scope.ExcelDetailsObj.ReportId,
            };

            eHnoteInsuranceService.GetReportExportJobsStatusList(obj).then(function (resp) {
                if (resp.data.status == "Success") {
                    let allReports = resp.data.rows || [];
                    $scope.ExportSummarylist = allReports.filter(function (item) {
                        return item.MasterReportId === activeMasterReportId;
                    });
                } else {
                    alertify.error(resp.data.Message);
                }
            });
        }
        $scope.excelExports = function () {
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/USBilling/uibpopups/excelExport.html",
                //"size": "lg",
                "backdrop": "static",
                "keyboard": false,
                "scope": $scope,
                "windowClass": "modal__seventy--",
                "controller": function ($scope, $uibModal, $uibModalInstance) {
                    $scope.activeMasterReportId = $scope.ExcelReportsObj.ReportId;
                    $scope.ExcelReportsObj.ReportName ="ERA Detailed report"
                    $scope.GetExportStatusList($scope.activeMasterReportId);
                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                }
            });
        };
}]);

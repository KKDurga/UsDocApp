
"use strict";
eHnoteWebApp.controller("UsAgingRejectedclaimsCtrl", ["$scope", "$timeout", "eHnoteInsuranceService", "eHnoteMasterDataService", "eHnoteLoginStatusService", "eHnoteSettingsDataService", "$filter", "alertify", "eHnotePatientDataService", "datapersistanceFactory", "$uibModal",
    function ($scope, $timeout, eHnoteInsuranceService, eHnoteMasterDataService, eHnoteLoginStatusService, eHnoteSettingsDataService, $filter, alertify, eHnotePatientDataService, datapersistanceFactory, $uibModal) {



        $scope.doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.SpecializationId = $scope.doctorinfo.doctordata.User[0].SpecializationId;
        $scope.DoctorId = $scope.doctorinfo.doctordata.User[0].DoctorID;
        $scope.GetAllIndicator = 0;
        $scope.userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
        $scope.HospitalId = 0;
        $scope.ParentHospitalId = 0;
        if ($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode
            && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID) {
            $scope.HospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            $scope.ParentHospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        }
        $scope.ClaimLocationList = [];
        $scope.ClaimProviderList = [];
        $scope.ClaimProviderList = $scope.mainBillerDataObj.BillingProviderList || [];
        $scope.ClaimLocationList = angular.copy($scope.mainBillerDataObj.AllBranchesList);
        $scope.AllUsersList = $scope.mainBillerDataObj.AllUsersList || [];

        $scope.BranchDoctorsList = angular.copy($scope.AllUsersList);

        $scope.BranchDoctorsList = $filter("filter")($scope.BranchDoctorsList, function (item) {
            return item.RoleId === 1 || item.RoleId === 3 || item.RoleId === 4 || item.RoleId === 43 || item.RoleId === 55;
        });

        $scope.HospitalAddressArray = [];
        if (doctorinfo.doctordata.UserAddress[0] !== undefined) {
            $scope.HospitalAddressArray = doctorinfo.doctordata.UserAddress[0];
        }
        $scope.toDataURL = function (dataURL, callback) {
            var xhr = new XMLHttpRequest();
            xhr.onload = function () {
                var reader = new FileReader();
                reader.onloadend = function () {
                    callback(reader.result);
                };
                reader.readAsDataURL(xhr.response);
            };
            xhr.open('GET', dataURL);
            xhr.responseType = 'blob';
            xhr.send();
        };
        $scope.HospitalAddressArray.OrganizationLogoUrl = $scope.HospitalAddressArray.OrganizationLogoUrl || '';
        if ($scope.HospitalAddressArray.OrganizationLogoUrl != '') {
            $scope.toDataURL($scope.HospitalAddressArray.OrganizationLogoUrl, function (dataURL) {
                $scope.HospitalAddressArray.OrganizationBase64 = dataURL;
            });
        }

        $scope.getAckowledgement = function () {
            var Obj = {
                "OrganizationId": $scope.HospitalId,
                "FromDate": $filter('date')(new Date(new Date().setFullYear(new Date().getFullYear() - 1)), "MM-dd-yyyy"),
                "ToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "AllUserStatusCheck": false,
                "PayorObj": null,
                "PayorId": 0,
                "Type": "Claim with Error",
                "IsDOsDate": false,
                "IsShowAmount": false,
                "PayorName": "",
                "ClaimNumber": "",
                "BillingProviderId": null,
                "SelectUserStatusString": "Select",
                "SelectRenderingStatusString": "All Doctors",
                "AllRenderingStatusCheck": false,
                "AllUserStatusCheck": false,
                "UserId": null,
                "OrganizationPayorId": "",
                "RenderingProviderList": $scope.BranchDoctorsList||[],
                "PayorId": 0,
                "PageSize": 100,
                "PageNumber": 1,
                "Count": 0
            }
            return Obj;
        }

        $scope.Agingtotals = {
            "TotalToday": 0,
            "Total1to3Days": 0,
            "Total4to7Days": 0,
            "Total8to14Days": 0,
            "Total15to29Days": 0,
            "Total30to44Days": 0,
            "Total45to59Days": 0,
            "Total60to89Days": 0,
            "Total90+Days": 0,
            "TotalDays": 0
        }

        $scope.AlertClaimList = [
            {
                "ClaimTypeId": 1,
                "ClaimTypeName": "Claim with Error",
            },
            {
                "ClaimTypeId": 2,
                "ClaimTypeName": "Claim without Acknowledgement",
            },
            {
                "ClaimTypeId": 3,
                "ClaimTypeName": "Not Transmitted",
            },
            //{
            //    "ClaimTypeId": 4,
            //    "ClaimTypeName": "Claim closed",
            //},
            //{
            //    "ClaimTypeId": 5,
            //    "ClaimTypeName": "Forwarded to Secondary",
            //},
            //{
            //    "ClaimTypeId": 6,
            //    "ClaimTypeName": "Denial Followup",
            //},
        ];

        $scope.SearchAgingRejected = function () {

            var TempAddress = $filter("filter")($scope.ClaimLocationList, function (iterator, ind) { return iterator.ClinicId !== 0 && iterator.IsChecked; });
            var HospitalIDs = _.pluck(TempAddress, "BranchId").join(",");
            const UserIds = ($scope.AllUsersList || [])
                .map(x => x.DoctorID)
                .join(",");

            const RenderingProviderIds = ($scope.SearchAckmtObj.RenderingProviderList || [])
                .filter(x => x.IsChecked)
                .map(x => x.DoctorID)
                .join(",");

            let obj = {
                "OrganizationId": $scope.SearchAckmtObj.OrganizationId,
                "FromDate": $scope.SearchAckmtObj.FromDate,
                "ToDate": $scope.SearchAckmtObj.ToDate,
                "BillingProviderId": $scope.SearchAckmtObj.BillingProviderId,
                "PayorId": $scope.SearchAckmtObj.PayorId,
                "UserId": UserIds,
                "RenderingProviderIds": RenderingProviderIds,
                "Type": $scope.SearchAckmtObj.Type,
                "IsShowAmount": $scope.SearchAckmtObj.IsShowAmount,
                "IsDOsDate": $scope.SearchAckmtObj.IsDOsDate,
                "PageSize": $scope.SearchAckmtObj.PageSize,
                "PageNumber": $scope.SearchAckmtObj.PageNumber,
                "Locationids": HospitalIDs
            }


            eHnoteInsuranceService.Get277RejctedSummarylist(obj).then(function (resp) {
                if (resp.data.status == "Success") {
                    $scope.RejctedClaimdetails = [];
                    $scope.selectedAgingPayorId = null;
                    $scope.selectedAgingRange = null;
                    $scope.Agingtotals.TotalToday = resp.data["TotalToday"];
                    $scope.Agingtotals.Total1to3Days = resp.data["Total1-3Days"];
                    $scope.Agingtotals.Total4to7Days = resp.data["Total4-7Days"];
                    $scope.Agingtotals.Total8to14Days = resp.data["Total8-14Days"];
                    $scope.Agingtotals.Total15to29Days = resp.data["Total15-29Days"];
                    $scope.Agingtotals.Total30to44Days = resp.data["Total30-44Days"];
                    $scope.Agingtotals.Total45to59Days = resp.data["Total45-59Days"];
                    $scope.Agingtotals.Total60to89Days = resp.data["Total60-89Days"];
                    $scope.Agingtotals["Total90+Days"] = resp.data["Total90+Days"];
                    $scope.Agingtotals["TotalDays"] = resp.data["TotalDays"];

                    $scope.RejctedSummarylist = resp.data.rows || [];
                    $scope.RejctedSummaryCount = resp.data.Count || 0;


                    let page = $scope.SearchAckmtObj.PageNumber;
                    let size = $scope.SearchAckmtObj.PageSize;
                    let total = $scope.RejctedSummaryCount;

                    $scope.startRecord = total === 0 ? 0 : ((page - 1) * size) + 1;
                    $scope.endRecord = Math.min(page * size, total);

                } else {
                    alertify.error(resp.data.Message);
                }
            });
        }

        $scope.checkAllRendering = function (val) {
            if (val) {
                angular.forEach($scope.SearchAckmtObj.RenderingProviderList, function (item) {
                    item.IsChecked = true;
                });
                $scope.SearchAckmtObj.SelectRenderingStatusString = 'All Doctors';
            } else {
                angular.forEach($scope.SearchAckmtObj.RenderingProviderList, function (item) {
                    item.IsChecked = false;
                });
                $scope.SearchAckmtObj.SelectRenderingStatusString = 'Select';
            }
            var checkedArray = _.where($scope.SearchAckmtObj.RenderingProviderList, { IsChecked: true });
            $scope.SearchAckmtObj.AllRenderingStatusCheck = checkedArray.length > 0 && $scope.SearchAckmtObj.RenderingProviderList.length === checkedArray.length ? true : false;

        };

        $scope.InsuranceRenderingToggle = function (item) {
            var checkedArray = _.where($scope.SearchAckmtObj.RenderingProviderList, { IsChecked: true });
            $scope.SearchAckmtObj.AllRenderingStatusCheck = checkedArray.length > 0 && $scope.SearchAckmtObj.RenderingProviderList.length === checkedArray.length ? true : false;

            if (checkedArray.length == 0) {
                $scope.SearchAckmtObj.SelectRenderingStatusString = "Select";
            } else {
                if (checkedArray.length === 1) {
                    $scope.SearchAckmtObj.SelectRenderingStatusString = checkedArray[0].SecondUserFullName + '-' + checkedArray[0].NPI;
                } else {
                    $scope.SearchAckmtObj.SelectRenderingStatusString = "Selected";
                }
            }

        };

        $scope.getClaimdetails = function () {
            var Obj = {
                "OrganizationId": $scope.HospitalId,
                "FromDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "ToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "PayorId": 0,
                "PayorName": "",
                "PageSize": 10,
                "PageNumber": 1,
                "Type": "",
                "Range": "",
                "TotalAmount": "",
                "Count": 0
            }
            return Obj;
        }

        $scope.init = function () {

            if ($scope.BranchDoctorsList.length > 0) {
                angular.forEach($scope.BranchDoctorsList, function (item) {
                    item.IsChecked = true;
                });
            }

            $scope.SearchAckmtObj = angular.copy($scope.getAckowledgement());
            $scope.ClaimdetailsObj = angular.copy($scope.getClaimdetails());
            $scope.RejctedSummarylist = [];
            $scope.RejctedSummaryCount = 0;
            $scope.SearchAgingRejected();
            if ($scope.AllUsersList.length > 0) {
                angular.forEach($scope.AllUsersList, function (item) {
                    item.IsChecked = true;
                });
            }



        }
        $scope.init();
        $scope.SearchPatientwithClaimId = function (pageno, type) {

            var ClaimStatusList = $scope.MasterClaimStatusList.map(function (status) {
                return status.ClaimStatusId;
            }).join(',');

            var type = (type === undefined || type === '') ? 'All' : type;
            var params = {
                "OrganizationId": $scope.SearchAckmtObj.OrganizationId,
                "OrganizationFacilityId": 0,
                "FromDate": "",
                "ToDate": "",
                "PatientId": 0,
                "SearchText": "",
                "PatientMRNo": "",
                "PatienClaimNumber": $scope.SearchAckmtObj.ClaimNumber || "",
                "BatchNumber": "",
                "BillingProviderId": 0,
                "RenderingProviderId": 0,
                "TransmissionTypeId": 0,
                "ClaimTypeId": 0,
                "PayorId": 0,
                "ClaimStatusList": ClaimStatusList,
                "PageSize": 100,
                "PageNumber": 1,
                "Type": type,
                "BillPaymentTypeId": 0,
                "CurrentResponsibilityId": 0,
                "DenialId": 0
            };

            eHnotePatientDataService.GetOrganizationClaimsListData(params).then(function (resp) {
                console.log(resp);
                $scope.ClaimListCount = resp.data.count;
                resp.data.rows = resp.data.rows || [];
                if (resp.data.rows.length > 0) {
                    $scope.navtoClaimSummaryPopup(resp.data.rows[0]);
                }
            }, function (err) {

            });
            $scope.SearchAckmtObj.ClaimNumber = "";

        }

        $scope.checkAllInsuranceUser = function (val) {
            if (val) {
                angular.forEach($scope.AllUsersList, function (item) {
                    item.IsChecked = true;
                });
                $scope.SearchAckmtObj.SelectUserStatusString = 'All Doctors';
            } else {
                angular.forEach($scope.AllUsersList, function (item) {
                    item.IsChecked = false;
                });
                $scope.SearchAckmtObj.SelectUserStatusString = 'Select';
            }
            var checkedArray = _.where($scope.AllUsersList, { IsChecked: true });
            $scope.SearchAckmtObj.AllUserStatusCheck = checkedArray.length > 0 && $scope.AllUsersList.length === checkedArray.length ? true : false;

        };


        $scope.ChangesUser = function (item) {
            var checkedArray = _.where($scope.AllUsersList, { IsChecked: true });
            $scope.SearchAckmtObj.AllUserStatusCheck = checkedArray.length > 0 && $scope.AllUsersList.length === checkedArray.length ? true : false;

            if (checkedArray.length == 0) {
                $scope.SearchAckmtObj.SelectUserStatusString = "Select";
            } else {
                if (checkedArray.length === 1) {
                    $scope.SearchAckmtObj.SelectUserStatusString = checkedArray[0].SecondUserFullName + '-' + checkedArray[0].NPI;
                } else {
                    $scope.SearchAckmtObj.SelectUserStatusString = "Selected";
                }
            }

        };



        $scope.GetOrganizationNewPayorAllList = function (val) {

            var param = {
                "SearchText": val || "",
                "Status": "Active",
                "PageSize": 10,
                "PageNumber": 1,
                "UserId": $scope.UserId,
                "SpecializationId": $scope.SpecializationId,
                "OrganizationId": $scope.HospitalId,
                "ParentOrganizationId": $scope.ParentHospitalId,
                "GetAllIndicator": 0,
                "PayorId": 0,
                "PayorTypeId": 0
            };
            return eHnoteInsuranceService.GetOrganizationInsurancePayorsList(param).then(function (resp) {
                if (resp.data.count !== 0) {
                    if (resp.data.rows !== undefined) {
                        return resp.data.rows.map(function (item) {
                            return item;
                        });
                    }
                }
            }, function (error) {
                console.log(error);
            });
        };


        $scope.ChangeInsurancePayor = function (obj) {

            $scope.SearchAckmtObj.PayorId = obj.PayorId;
            $scope.SearchAckmtObj.PayorName = obj.PayorName;
            $scope.SearchAckmtObj.PayorCode = obj.PayorCode;
            $scope.SearchAckmtObj.OrganizationPayorId = obj.OrganizationPayorId;

        }

        $scope.refreshDetails = function () {
            $scope.SearchAckmtObj = angular.copy($scope.getAckowledgement());
            $scope.SearchAgingRejected();

        }


        $scope.selectedAgingKey = null;
        $scope.selectedAgingItem = null;
        $scope.selectedAgingPayorId = null;
        $scope.selectedAgingRange = null;

        $scope.setAgingDates = function (item, range) {

            if ($scope.selectedAgingItem === item && $scope.selectedAgingKey === range) {
                $scope.selectedAgingItem = null;
                $scope.selectedAgingKey = null;
                $scope.selectedAgingPayorId = null;
                $scope.selectedAgingRange = null;
            } else {

                if ($scope.selectedAgingItem) {
                    $scope.selectedAgingItem.selectedAging = null;
                }

                item.selectedAging = range;
                $scope.selectedAgingItem = item;
                $scope.selectedAgingKey = range;
            }
            $scope.selectedAgingPayorId = item.MasterPayorId;
            $scope.selectedAgingRange = range;

            var today = new Date();
            var fromDate = new Date();
            var toDate = new Date();

            switch (range) {

                case "1-3Days":
                    fromDate.setDate(today.getDate() - 3);
                    toDate.setDate(today.getDate() - 1);
                    break;

                case "4-7Days":
                    fromDate.setDate(today.getDate() - 7);
                    toDate.setDate(today.getDate() - 4);
                    break;

                case "8-14Days":
                    fromDate.setDate(today.getDate() - 14);
                    toDate.setDate(today.getDate() - 8);
                    break;

                case "15-29Days":
                    fromDate.setDate(today.getDate() - 29);
                    toDate.setDate(today.getDate() - 15);
                    break;

                case "30-44Days":
                    fromDate.setDate(today.getDate() - 44);
                    toDate.setDate(today.getDate() - 30);
                    break;

                case "45-59Days":
                    fromDate.setDate(today.getDate() - 59);
                    toDate.setDate(today.getDate() - 45);
                    break;

                case "60-89Days":
                    fromDate.setDate(today.getDate() - 89);
                    toDate.setDate(today.getDate() - 60);
                    break;

                case "90+Days":
                    fromDate.setDate(today.getDate() - 9999); // or any older start date
                    toDate.setDate(today.getDate() - 90);
                    break;
            }

            $scope.ClaimdetailsObj.FromDate = fromDate;
            $scope.ClaimdetailsObj.ToDate = toDate;
            if ($scope.ClaimdetailsObj.FromDate != '') {
                $scope.ClaimdetailsObj.FromDate = $filter('date')($scope.ClaimdetailsObj.FromDate, "MM-dd-yyyy");
            }
            if ($scope.ClaimdetailsObj.ToDate != '') {
                $scope.ClaimdetailsObj.ToDate = $filter('date')($scope.ClaimdetailsObj.ToDate, "MM-dd-yyyy");
            }


            $scope.GetRejctedBypayorClaimlist(item, range, $scope.SearchAckmtObj.Type);
        };


        $scope.GetRejctedBypayorClaimlist = function (item, range, Type) {

            var TempAddress = $filter("filter")($scope.ClaimLocationList, function (iterator, ind) { return iterator.ClinicId !== 0 && iterator.IsChecked; });
            var HospitalIDs = _.pluck(TempAddress, "BranchId").join(",");
            $scope.ClaimdetailsObj.PayorName = item.MasterPayorName;
            $scope.ClaimdetailsObj.PayorId = item.MasterPayorId;
            $scope.ClaimdetailsObj.Range = range;
            $scope.ClaimdetailsObj.Type = Type;

            const RenderingProviderIds = ($scope.SearchAckmtObj.RenderingProviderList || [])
                .filter(x => x.IsChecked)
                .map(x => x.DoctorID)
                .join(",");


            let obj = {
                "OrganizationId": $scope.SearchAckmtObj.OrganizationId,
                "FromDate": $scope.ClaimdetailsObj.FromDate,
                "ToDate": $scope.ClaimdetailsObj.ToDate,
                "IsDOsDate": $scope.SearchAckmtObj.IsDOsDate,
                "Locationids": HospitalIDs,
                "UserId": 0,
                "Type": Type,
                // "PayorId": $scope.SearchAckmtObj.PayorId,
                "PayorId": item.MasterPayorId,
                "PageSize": $scope.ClaimPagination.PageSize,
                "PageNumber": $scope.ClaimPagination.PageNumber,
                "BillingProviderId": $scope.SearchAckmtObj.BillingProviderId,
                "RenderingProviderIds": RenderingProviderIds,
                "IsShowAmount": $scope.SearchAckmtObj.IsShowAmount,
            }


            eHnoteInsuranceService.GetRejctedBypayorClaimlist(obj).then(function (resp) {
                if (resp.data.status == "Success") {
                    $scope.RejctedClaimdetails = resp.data.rows || [];
                    $scope.RejctedClaimdetailsCount = resp.data.Count || 0;
                    $scope.ClaimsTotalAmount = resp.data.TotalClaimAmount || 0;
                    $scope.ClaimsInsuranceBalance = resp.data.TotalInsuranceBalance || 0;
                    $scope.ClaimdetailsObj.Count = resp.data.Count || 0;
                    if ($scope.RejctedClaimdetails.length > 0) {
                        let amount = 0;
                        angular.forEach($scope.RejctedClaimdetails, function (item) {
                            item.isOpen = false;
                            amount += item.TotalClaimAmount;
                        });
                        $scope.ClaimdetailsObj.TotalAmount = amount;
                    }

                    let page = $scope.ClaimPagination.PageNumber;
                    let size = $scope.ClaimPagination.PageSize;
                    let total = $scope.RejctedClaimdetailsCount;

                    $scope.claimStart = total === 0 ? 0 : ((page - 1) * size) + 1;
                    $scope.claimEnd = Math.min(page * size, total);

                } else {
                    alertify.error(resp.data.Message);
                }
            });
        }

        $scope.openAccordianItem = function (item) {
            const isCurrentlyOpen = item.isOpen;
            $scope.RejctedClaimdetails.forEach(subItem => {
                subItem.isOpen = false;
            });
            item.isOpen = !isCurrentlyOpen;
        };
        $scope.navtoClaimSummaryPopup = function (item, type) {

            item = item || '';
            type = type || "";
            let AppointmentId = null;
            let PatientId = null;
            if (item != '') {
                AppointmentId = item.AppointmentId;
                PatientId = item.PatientId;
            }

            $scope.claimScreenParentObj = {
                "PatientId": PatientId || null,
                "AppointmentId": AppointmentId || null,
                "PatientFullName": item.PatientFullName || "",
                "VisitId": item.VisitId || '',
                "ActionType": "EditClaim",
                "SubActionType": "Verify",
                "ScreenType": "Popup",
                "SuperBillId": null,
                "ResponcibilityId": item.CurrentResponsibilityId || 0,
                "IsCreateSuperBill": false,
                "PatientClaimId": item.PatientClaimId,
                "SuperBillArray": [],
                "ClaimExpiryDate": null,
                "AppointmentDoctorId": item.RenderingProviderId || 0,
                "PageNumber": 1,
                "type": type,
            };

            $scope.mainBillerDataObj.PatientId = PatientId || 0;
            $scope.mainBillerDataObj.HospitalId = $scope.HospitalId || 0;
            datapersistanceFactory.set("IsComingFromClaim", $scope.claimScreenParentObj);
            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/UsClaims/AddUpdateClaimPopup.html",
                "size": "lg",
                "keyboard": false,
                "controller": "UsAddUpdateClaimPopupCtrl",
                "windowClass": "modal__popup--1",
                "resolve": {
                    "mainBillerDataObj": function () { return $scope.mainBillerDataObj || null; },
                }
            });

            $scope.mInstanceAdd.result.then(function (resp) {
                console.log(resp);


            }, function () { });
        }



        $scope.GetExcelReportsObj = function () {
            let obj = {
                "ExportJobId": 0,
                "UserId": $scope.UserId,
                "RequestedByUserId": $scope.UserId || null,
                "RequestedByUserName": "",
                "OrganizationId": $scope.HospitalId,
                "ParentOrganizationId": $scope.ParentHospitalId,
                "ReportName": "Claim with Error",
                "ReportId": 9,
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
                "RequestType": "Immediate",


            };

            return obj;
        }


        $scope.ExcelReportsObj = $scope.GetExcelReportsObj();

        $scope.ClickForExceldData = function (Type) {







            var startDate = new Date($scope.SearchAckmtObj.FromDate);
            var endDate = new Date($scope.SearchAckmtObj.ToDate);

            // Calculate difference in days
            var diffTime = endDate - startDate;
            var diffDays = diffTime / (1000 * 60 * 60 * 24);

            // Condition
            if (diffDays <= 7) {
                $scope.ExcelReportsObj.RequestType = "Immediate";
            } else {
                $scope.ExcelReportsObj.RequestType = "TaskRun";
            }

            if (Type == 'Claim with Error') {
                $scope.ExcelReportsObj.ReportId = 9;
                $scope.ExcelReportsObj.ReportName = "Claim with Error";
            }
            else if (Type == 'Claim without Acknowledgement') {
                $scope.ExcelReportsObj.ReportId = 10;
                $scope.ExcelReportsObj.ReportName = "Claim without Acknowledgement";
            }
            else if (Type == 'Not Transmitted') {
                $scope.ExcelReportsObj.ReportId = 11;
                $scope.ExcelReportsObj.ReportName = "Not Transmitted";
            }
            else if (Type == 'Claim closed') {
                $scope.ExcelReportsObj.ReportId = 12;
                $scope.ExcelReportsObj.ReportName = "Claim closed";
            }
            else if (Type == 'Forwarded to Secondary') {
                $scope.ExcelReportsObj.ReportId = 13;
                $scope.ExcelReportsObj.ReportName = "Forwarded to Secondary";
            }
            else if (Type == 'Denial Followup') {
                $scope.ExcelReportsObj.ReportId = 14;
                $scope.ExcelReportsObj.ReportName = "Denial Followup";
            }
            else {

            }
            var TempAddress = $filter("filter")($scope.ClaimLocationList, function (iterator, ind) { return iterator.ClinicId !== 0 && iterator.IsChecked; });
            var HospitalIDs = _.pluck(TempAddress, "BranchId").join(",");

            const RenderingProviderIds = ($scope.SearchAckmtObj.RenderingProviderList || [])
                .filter(x => x.IsChecked)
                .map(x => x.DoctorID)
                .join(",");

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
                "PayorId": $scope.ClaimdetailsObj.PayorId,
                "FromDate": $scope.ClaimdetailsObj.FromDate,
                "ToDate": $scope.ClaimdetailsObj.ToDate,
                "Type": Type,
                "IsDOsDate": $scope.SearchAckmtObj.IsDOsDate,
                "LocationIds": HospitalIDs,
                "BillingProviderId": $scope.SearchAckmtObj.BillingProviderId,
                "RenderingProviderIds": RenderingProviderIds,
                "IsShowAmount": $scope.SearchAckmtObj.IsShowAmount,
                "RequestDetails": {
                    "PaymentFromDate": $scope.SearchAckmtObj.FromDate,
                    "PaymentToDate": $scope.SearchAckmtObj.ToDate,
                    "LocationIds": HospitalIDs,
                    "BillingProviderIds": null,
                    "RenderingProviderIds": null,
                    "UserIds": null,
                    "MasterPayorIds": $scope.ClaimdetailsObj.PayorId,
                    "ProcedureIds": null,
                    "ReferralProviderIds": null,
                    "PaymentModeIds": null,
                    "DOSStartDate": "",
                    "DOSEndDate": ""
                }
            };

            eHnoteInsuranceService.InitiateClaimAgingCSVData(obj).then(function (resp) {
                if (resp.data.status == "Success") {
                    alertify.success("Excel file exported successfully");
                    return false;
                } else {
                    alertify.error(resp.data.Message);
                }
            });


        }

        $scope.ClearSelectedData = function () {
            $scope.RejctedClaimdetails = [];
            $scope.RejctedClaimdetailsCount = 0;
            $scope.selectedAgingPayorId = null;
            $scope.selectedAgingRange = null;
        }


        $scope.ClickForPrintdData = function () {


            $scope.PrintRejctedClaimdetails = angular.copy($scope.RejctedClaimdetails);

            $timeout(function () {
                var innerContents = document.getElementById('ClaimAgingReport').innerHTML;
                var popupWinindow = window.open('scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                popupWinindow.document.open();
                //  popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()" class="bodyheightprint">' + innerContents + '</body></html>');
                popupWinindow.document.write(`<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()" class="bodyheightprint"> ${innerContents}</body></html>`);
                popupWinindow.document.close();
            }, 500);

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
                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                }
            });
        };




        $scope.navtoOpenDenialpopupmanagement = function (item) {
            //var matchedObj = $scope.OrgClaimListdata.find(function (sitem) {
            //    return sitem.PatientClaimId === item.PatientClaimId;
            //});
            var Obj = {
                "PostingPaymentData": item,
                "mainEOBPaymentPostingObj": $scope.mainBillerDataObj,
                "IsFrom": "ClaimsList"
            }

            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/UsClaims/UsDenialReviewandAppealPopup.html",
                "size": "lg",
                "keyboard": false,
                "controller": "UsDenialReviewPopupCtrl",
                "windowClass": "modal__popup--1",
                'backdrop': 'static',
                "resolve": {
                    "PaymentPostingDataObj": function () { return Obj },
                }

            })
            $scope.mInstanceAdd.result.then(function (resp) {
                resp = resp || "";
                $scope.SearchAdjustmentReqslist(1);
                //$uibModalInstance.close();
            }, function () { });
        }

        $scope.changePage = function (page) {

            let size = $scope.SearchAckmtObj.PageSize || 100;
            let total = $scope.RejctedSummaryCount;
            let maxPage = Math.ceil(total / size);

            if (page < 1 || page > maxPage) return;

            $scope.SearchAckmtObj.PageNumber = page;

            $scope.SearchAgingRejected();
        };

        $scope.ClaimPagination = {
            PageNumber: 1,
            PageSize: 100
        };

        $scope.changeClaimPage = function (page, item, range) {

            let size = $scope.ClaimPagination.PageSize;
            let total = $scope.RejctedClaimdetailsCount;
            let maxPage = Math.ceil(total / size);

            if (page < 1 || page > maxPage) return;

            $scope.ClaimPagination.PageNumber = page;

            item.MasterPayorId = item.PayorId || 0;
            item.MasterPayorName = item.PayorName || '';

            $scope.GetRejctedBypayorClaimlist(item, range, $scope.SearchAckmtObj.Type);
        };


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
                "AllUsersList": angular.copy($scope.AllUsersList) || [],
            };

            return obj;


        }

        $scope.ExcelDetailsObj = $scope.GetExcelDetailsObj();

        $scope.GetExportStatusList = function (activeMasterReportId) {

            let obj = {
                "OrganizationId": $scope.ExcelDetailsObj.OrganizationId,
                "RequestedByUserId": $scope.ExcelDetailsObj.RequestedByUserId,
                "FromDate": "",
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
                    if ($scope.SearchAckmtObj.Type == 'Claim with Error') {
                        $scope.ExcelReportsObj.ReportId = 9;
                        $scope.ExcelReportsObj.ReportName = "Claim with Error";
                    }
                    else if ($scope.SearchAckmtObj.Type == 'Claim without Acknowledgement') {
                        $scope.ExcelReportsObj.ReportId = 10;
                        $scope.ExcelReportsObj.ReportName = "Claim without Acknowledgement";
                    }
                    else if ($scope.SearchAckmtObj.Type == 'Not Transmitted') {
                        $scope.ExcelReportsObj.ReportId = 11;
                        $scope.ExcelReportsObj.ReportName = "Not Transmitted";
                    }
                    else if ($scope.SearchAckmtObj.Type == 'Claim closed') {
                        $scope.ExcelReportsObj.ReportId = 12;
                        $scope.ExcelReportsObj.ReportName = "Claim closed";
                    }
                    else if ($scope.SearchAckmtObj.Type == 'Forwarded to Secondary') {
                        $scope.ExcelReportsObj.ReportId = 13;
                        $scope.ExcelReportsObj.ReportName = "Forwarded to Secondary";
                    }
                    else if ($scope.SearchAckmtObj.Type == 'Denial Followup') {
                        $scope.ExcelReportsObj.ReportId = 14;
                        $scope.ExcelReportsObj.ReportName = "Denial Followup";
                    }
                    else {

                    }
                    $scope.activeMasterReportId = $scope.ExcelReportsObj.ReportId;
                    $scope.GetExportStatusList($scope.activeMasterReportId);
                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                }
            });
        };
    }]);
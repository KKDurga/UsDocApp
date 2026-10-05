"use strict";

eHnoteWebApp.controller("EhnoteDashBoardCtrl", ["$scope", "$rootScope", "$filter", "eHnoteLoginStatusService", "eHnoteMasterDataService", "$location", "eHnoteMainDashboardDataServices", "$timeout", "alertify", "eHnoteUserAppointmentDataService", "localStorageFactory", "datapersistanceFactory", "eHnoteAccountUserServices", "$interval", "OpticalService", "InventoryService", "ReportUtilites", "eHnoteSurgeryService", "$sce", "$window", "eHnoteMainAppointmentService", "eHnotePatientDataService", "USPrintService", "$uibModal", "eHnotePatientAddressDataServices", "eHnotePatientVisitReasonServices", "eHnoteReferalDataService", "$q", "eHnoteUserDataService", "eHnoteInsuranceService", function ($scope, $rootScope, $filter, eHnoteLoginStatusService, eHnoteMasterDataService, $location, eHnoteMainDashboardDataServices, $timeout, alertify, eHnoteUserAppointmentDataService, localStorageFactory, datapersistanceFactory, eHnoteAccountUserServices, $interval, OpticalService, InventoryService, ReportUtilites, eHnoteSurgeryService, $sce, $window, eHnoteMainAppointmentService, eHnotePatientDataService, USPrintService, $uibModal, eHnotePatientAddressDataServices, eHnotePatientVisitReasonServices, eHnoteReferalDataService, $q, eHnoteUserDataService, eHnoteInsuranceService,) {

    $scope.maxSize = 10;
    $scope.exportMaxSize = 50000;
    $scope.GetAllIndicator = 1;
    $scope.SelectedDoctor = null;
    $scope.dashboardTab = 'summary';
    var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();

    $scope.UserId = eHnoteMasterDataService.getLoginId();
    if (userLoginDetails.loggedinStatus) {
        $rootScope.showMainPageHeader = true;
    } else {
        $rootScope.showMainPageHeader = false;
        datapersistanceFactory.clearAll();
        $location.path('/login');
        return;
    }
    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
    var BranchesList = [];
    $scope.loadType = "onLoad";

    $scope.ViewsObj = {
        "ShowDashboard": false,
        "ForApptStatistics": false,
        "ForMonthlyApptStatistics": false,
        "InternalReferralReport": false,
        "ExternalReferralReport": false,
        "UserReport": false,
        "IOLReport":false,
        "SurgeryApptReport":false,
        "PatApptInsReport":false,
    };
    $scope.AllDoctorsObj = {
        "AllDoctorCheck": true,
        "AllVisitReasonsCheck": true,
        "AllAppointmentTypeStatusCheck": true,
        "AllResonTypeCheck": false
    }
    $scope.LocationTypeObj = {
        SelectLocationString: "Select Location",
    }
    $scope.View = "";
    $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
    var parentHospitalId;
    var ParentHospitalName = doctorinfo.doctordata.UserAddress[0].ClinicName;
    $scope.hospitalid1 = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalID;
    $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID || 0;
    $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;

   
    $scope.searchtxtb = { "txt1": "", "txt2": "" };
    $scope.searchDoctorInDashBoard = { "txt1": "", "txt2": "" };

    $scope.DashboardWalkinApptDetails = [];
    $scope.DashboardCancelledApptDetails = [];
    $scope.DashboardNoShowApptDetails = [];

    $scope.GetNewPatientReportObj = {
        "FromDate": "",
        "Todate": "" ,
        "DoctorIds": "",
        "VisitReasonIds": "",
        "FromMonth":"",
        "ToMonth": "",
        "AllReferalDoctorCheck": false,
        "AllInternalDoctorCheck": false,
    }
    $scope.GetDataOnMainDashBoardObj =
    {
        "dashboard_StartDate": "",
        "dashboard_EndDate": "",
        "DoctorIds": "",
        "VisitTypeId": null
    }
    $scope.MainDashBoardPieChartObj =
    {
        "AllAppointments": "",
        "CancelledAppointments": "",
        "ASCAppointments": "",
        "NewAppointments": "",
        "ClinicfollowupAppointments": "",
        "CoordinatorAppointments": "",
        "PostOpfollowupAppointments": "",
        "PreOpAppointments": "",
        "PreadmissionAppointments": "",
        "TechnicianAppointments": "",
        "RescheduleAppointments":"",
        "WalkinAppointments":"",
    }
    $scope.MainDashBoardPieChartObjWithOutDoctors = {
        "AllAppointments": "",
        "CancelledAppointments": "",
        "ASCAppointments": "",
        "NewAppointments": "",
        "ClinicfollowupAppointments": "",
        "CoordinatorAppointments": "",
        "PostOpfollowupAppointments": "",
        "PreOpAppointments": "",
        "PreadmissionAppointments": "",
        "TechnicianAppointments": "",
        "RescheduleAppointments": "",
        "NoShowAppointments": "",
        "WalkinAppointments": "",
    }

    $scope.DashboardAppointmentTypes = [
        {
            "Id": 1,
            "Name": "New Appointment"
        },
        {
            "Id": 2,
            "Name": "Clinic Follow Up"
        },
        {
            "Id": 3,
            "Name": "Post-Op Follow Up"
        },
        {
            "Id": 4,
            "Name": "ASC"
        },
        {
            "Id": 5,
            "Name": "Technician/Investigation"
        },
        {
            "Id": 6,
            "Name": "Pre-Op"
        },
        {
            "Id": 7,
            "Name": "Pre-Admission"
        },
        {
            "Id": 8,
            "Name": "Coordinator"
        },
    ];


    $scope.ListCountsObj = {
        "CancelAppointmentsCount": null,
        "SameDayCancelAppointmentsCount": null,
        "WalkinAppointmentsCount": null,
        "NoShowAppointmentsCount": null,
        "SeenAppointmentsCount": null,
        "SamedayCancelCheckinAppointmentCount": null,
        "SeenNewAppointmentsCount": null,
        "NewAppointmentsCount": null,
        "ClinicFollowupAppointmentsCount": null,
        "PostOpFollowupAppointmentsCount": null,
        "ASCAppointmentsCount": null,
        "TechnicianAppointmentsCount": null,
        "PreOPAppointmentsCount": null,
        "PreAdmissionAppointmentsCount": null,
        "CoordinatorAppointmentsCount": null,
        "AllAppointmentsCount": null,
        "ActiveAppointmentsCount": null,
        "RescheduleAppointmentsCount": null,
        "ApptStatusReportCount": null,
        "PlanedRescheduleAppointmentsCount": null,
        "LastMinRescheduleAppointmentsCount": null,
        "CheckinRescheduleAppointmentsCount": null,
        "WaitingAppointmentsCount": null

    };



    $scope.GetImplants = function () {
        var Obj = {
            "CategoryType": "Lens",
            "CategoryId": null,
            "SubCategoryId": null,
            "SubCategoryName": '',
            "ItemMasterId": null,
            "OrganizationItemId": null,
            "StockDetailId": null,
            "ChildMasterId": null,
            "DipoterId": null,
            "Power": "",
            "BarCodeDetailId": null,
            "BarCodeId": null,
            "ImplantName": "",
            "SerialNumber": "",
            "LensTypeId": null,
            "LensType": "",
            "ManufacturerId": null,
            "Manufacturer": "",
            "BatchNumber": "",
            "ModelId": null,
            "ModelName": "",
            "ModelNumber": "",
            "StatusId": 0,
            "StatusName": "",
            "Remarks": "",
            "DeleteInd": "N",
            "IolConsumeId": 0,
            "SelectedObject": "",
            "IsDisabled": true,
            "IsSearchDisabled": false,
            "IsEdit": false,
            "IsIolSelected": false,
            "OrganId": $scope.OrganId || null,
            "OrganName": '',
            "OrganArray": [{
                "OrganId": 1,
                "OrganName": "OD",
            },
            {
                "OrganId": 2,
                "OrganName": "OS",
            },
                //{
                //    "OrganId": 3,
                //    "OrganName": "OU",
                //    }
            ],
        }
        return Obj;
    };

    $scope.ImplantsObj = angular.copy($scope.GetImplants());

    $scope.selectedDashBoardDoctor = 'All';
    var hospitalCode;
    $scope.mainHospitalId = 0;
    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID !== undefined) {
        parentHospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        $scope.UrlparentHospitalId = parentHospitalId;
        $scope.mainHospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID || 0;
        hospitalCode = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;

    }
    var d = new Date();
    //d.setMonth(d.getMonth() - 1);
    $scope.RoleId = userLoginDetails.RoleID;
    var Object = {};

    var mObj = datapersistanceFactory.getItem("masterDataArrays");
    $scope.masterPaymentModes = [];
    if (mObj.PaymentModes && mObj.PaymentModes.length > 0) {
        $scope.masterPaymentModes = mObj.PaymentModes;
    }
    $scope.dashboard = {
        'startDate': $filter('date')(new Date(d), "dd-MMMM-yyyy"),
        'endDate': $filter('date')(new Date(), "dd-MMMM-yyyy"),
        'hospitalList': '',
        'doctorList': ''
    };
    $scope.detailedPage = {
        'startDate': $filter('date')(new Date(d), "dd-MMMM-yyyy"),
        'endDate': $filter('date')(new Date(), "dd-MMMM-yyyy"),
        'hospitalList': '',
        'doctorList': '',
        'paymentType': ''
    };
    $scope.outstanding = {
        'Filter': 'branch'
    };
    $scope.targetData = {
        'RevenueTarget': '',
        'TargetType': 'MONTHLY'
    };
    $scope.showGraph = true;
    $scope.showData = false;
    var initialLoad = true;
    $scope.activeMenu = {
        "value": "Snapshot"
    };
    $scope.readAdminAccess = false;
    var single_doctorListing = [];
    $scope.HospitalIdsList = [];
    $scope.DashBoardData = {};
    $scope.SurgeryData = {};

    $scope.AllUserBranchesList = [];
    $scope.BranchDoctorsList = [];


    $scope.hospitalDetails = [];
    $scope.SubOrganizationList = [];
    $scope.SelectedSubOrganization = "";
    $scope.SubOrganizationIdsList = [];
    $scope.SubDepartmentId = "";
    var currentdate = new Date();

    $scope.dashboard_StartDate = $filter('date')(new Date(currentdate), "dd-MMM-yyyy");
    $scope.dashboard_EndDate = $filter('date')(new Date(), "dd-MMM-yyyy");


    $scope.IncentiveReportArray = [];
    $scope.TreatmentReportArray = [];
    $scope.DailyReportArray = [];
    $scope.DaycollectionReportArray = [];

    $scope.dashboard_Date = $filter('date')(new Date(d), "dd-MMMM-yyyy");



    $scope.showDashBoard = function (val) {

        $scope.showDashBordDetailsDiv = false;
        $scope.SelectedDoctor = null;
        $scope.getDoctorInfoByHospitalId(val);
        $scope.viewtype = "";
    };
    $scope.getChatDetails = function () {
        var reqObj = {
            "HospitalID": $scope.SelectedHospital === undefined || $scope.SelectedHospital === null ? doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID : $scope.SelectedHospital.ClinicId,
            "DoctorId": $scope.SelectedDoctor === undefined || $scope.SelectedDoctor === null ? 0 : $scope.SelectedDoctor.DoctorID,
            "StartDate": $scope.dashboard_StartDate,
            "EndDate": $scope.dashboard_EndDate,
            "GetAllIndicator": $scope.GetAllIndicator,
            "SubOrganizationId": $scope.SelectedSubOrganization === undefined || $scope.SelectedSubOrganization === null ? 0 : $scope.SelectedSubOrganization.SubOrganizationId,
            "DepartmentId": $scope.SelectedDepartment === undefined || $scope.SelectedDepartment === null ? 0 : $scope.SelectedDepartment.SubSpecializationId
        };
        eHnoteMainDashboardDataServices.getTrendingDashBoardDetails(reqObj).then(function (response) {
            $scope.patientAgeArray = [];
            $scope.appointArray = [];
            $scope.treatmentArray = [];
            if (response.data.Age) {
                var i = 0;
                response.data.Age.forEach(function (item) {
                    var strText;
                    switch (item.AgeId) {
                        case 1:
                            strText = '0-10';
                            break;
                        case 2:
                            strText = '10-25';
                            break;
                        case 3:
                            strText = '25-50';
                            break;
                        case 4:
                            strText = '50-75';
                            break;
                        case 5:
                            strText = '75-100';
                            break;
                    }
                    if (item.Count === 0) {
                        i++;
                    }
                    $scope.patientAgeArray.push({ label: 'Age (' + strText + ')', value: item.Count });
                });
                if (response.data.Age.length === i) {
                    $scope.patientAgeArray = [];
                }
            }
            if (response.data.AppointmentStatus) {
                response.data.AppointmentStatus.forEach(function (item) {
                    //var strText = item.StatusFlag === 'B' ? 'Booked' : (item.StatusFlag === 'C' ? 'Cancelled' : ((item.StatusFlag === 'E' ? 'Completed' : '')));
                    var strText = item.StatusFlag === 'B' ? 'Booked' : (item.StatusFlag === 'C' ? 'Cancelled' : ((item.StatusFlag === 'E' ? 'Completed' : (item.StatusFlag === 'O' ? 'Ongoing' : ''))));
                    $scope.appointArray.push({ label: strText, value: item.Count });
                });
            }
            if (response.data.Treatment) {
                response.data.Treatment.forEach(function (item) {
                    $scope.treatmentArray.push({ label: item.Treatment, value: item.Pcount });
                });
            }
            $timeout(function () {
                if ($scope.patientAgeArray.length > 0 && angular.element('#patient-donut-chat').length > 0) {
                    angular.element('#patient-donut-chat').html('');
                    bindChat('patient-donut-chat', $scope.patientAgeArray, 0);
                }

                if ($scope.appointArray.length > 0 && angular.element('#appointment-donut-chat').length > 0) {
                    angular.element('#appointment-donut-chat').html('');
                    bindChat('appointment-donut-chat', $scope.appointArray, 0);
                }

                if ($scope.treatmentArray.length > 0 && angular.element('#treatment-donut-chat').length > 0) {
                    angular.element('#treatment-donut-chat').html('');
                    bindChat('treatment-donut-chat', $scope.treatmentArray, 0);
                }
            }, 500);

        }, function (err) {
            console.log(err);
            alertify.error(err.data.Message);
        });
    };
    $scope.getLocationBasedDoctorsData = function () {
        var locationIds = $scope.ApptBranchLocations
            .filter(pitem => pitem.IsChecked && pitem.ClinicId !== 0)
            .map(pitem => pitem.ClinicId)
            .join(",");

        var usersReqParams = { "BranchId": locationIds };
        var obj = {
            "OrganizationId": locationIds,
            "VisitTypeId": 0,
            "SearchText": "",
        };
        $q.all([
            eHnoteMainAppointmentService.getAllUsersByDepartmentIdNew(usersReqParams),
            //eHnotePatientVisitReasonServices.GetOrganizationActiveAppointmentVisitReasonsById(obj)
            eHnotePatientVisitReasonServices.GetOrganizationActiveAndInActiveApptVisitReasons(obj)
        ]).then(function (results) {
            // Process doctors data
            var doctorsResp = results[0];
            console.log("resp Doctors Names", doctorsResp);
            let doctorRows = doctorsResp.data.rows || [];
            let clinicDoctorList = _.uniq(doctorRows, false, function (p) { return p.DoctorID; });
           
            $scope.NewPatientReportDoctorList = $filter("filter")(clinicDoctorList, function (item) {
                    return item.RoleId === 1 || item.RoleId === 43;
            });
            //$scope.NewPatientReportDoctorList = angular.copy(clinicDoctorList);
            console.log("$scope.NewPatientReportDoctorList",$scope.NewPatientReportDoctorList)
            angular.forEach($scope.NewPatientReportDoctorList, function (citem) {
                citem.id = citem.DoctorID;
                citem.title = citem.FullName;
                citem.isChecked = true;
            });
            updateDoctorsString();
            $scope.AllDoctorsObj.AllDoctorCheck = false;
            /* keep the referral reports Role filter applied after the doctor list reloads */
            if ($scope.ViewsObj && ($scope.ViewsObj.InternalReferralReport || $scope.ViewsObj.ExternalReferralReport) && $scope.ReferralReportRoleObj && !$scope.ReferralReportRoleObj.AllRoleCheck) {
                $scope.applyReferralReportRoleFilter();
            }

            // Process visit reasons
            var visitReasonsResp = results[1];
            console.log("visitReasonsResp", visitReasonsResp)
            if (visitReasonsResp.data !== undefined) {
                angular.forEach(visitReasonsResp.data.rows, function (item) {
                    item.isChecked = true;
                });
                $scope.Visitreasons = angular.copy(visitReasonsResp.data.rows);
                $scope.AllVisitreasons = angular.copy(visitReasonsResp.data.rows);
                console.log("$scope.VisitReasons", $scope.Visitreasons)
            }
        }).catch(function (err) {
            console.error("Error fetching data:", err);
        });
    }

    /* $scope.getLocationBasedDoctorsData = function () {
         var locationIds = $scope.ApptBranchLocations
             .filter(pitem => pitem.IsChecked && pitem.ClinicId !== 0)
             .map(pitem => pitem.ClinicId)
             .join(",");
         var usersReqParams = { "BranchId": locationIds };
         eHnoteMainAppointmentService.getAllUsersByDepartmentIdNew(usersReqParams)
             .then(function (resp) {
                 console.log("resp Doctors Names", resp);
                 let doctorRows = resp.data.rows || [];
                 $scope.NewPatientReportDoctorList = angular.copy(doctorRows);
                 angular.forEach($scope.NewPatientReportDoctorList, function (citem) {
                     citem.id = citem.DoctorID;
                     citem.title = citem.FullName;
                     citem.isChecked = true;
                 });
                 updateDoctorsString();
                 $scope.AllDoctorsObj.AllDoctorCheck = false;
             }, function (err) {
                 console.error("Error fetching doctors:", err);
             });
     }*/
    $scope.changeAppointmentBranch = function (obj) {
        if (obj.ClinicId === 0) {
            angular.forEach($scope.ApptBranchLocations, function (mitem) {
                mitem.IsChecked = obj.IsChecked;
            });
        } else {
            const allChecked = $scope.ApptBranchLocations.every(mitem => mitem.IsChecked || mitem.ClinicId === 0);
            $scope.ApptBranchLocations.find(mitem => mitem.ClinicId === 0).IsChecked = allChecked;
        }

        if (obj.IsChecked) {
            $scope.selectedBranch = obj;
        }

        updateLocationString();
        $scope.getLocationBasedDoctorsData();
        $scope.AppListselectedclinic = angular.copy(obj);
        console.log("$scope.AppListselectedclinic Clinics:--", $scope.AppListselectedclinic);
    };

    function updateLocationString() {
        const selectedLocations = $scope.ApptBranchLocations.filter(mitem => mitem.IsChecked && mitem.ClinicId !== 0);

        if (selectedLocations.length === 0) {
            $scope.LocationTypeObj.SelectLocationString = "Select Location";
        } else if (selectedLocations.length === 1) {
            $scope.LocationTypeObj.SelectLocationString = selectedLocations[0].ClinicName;
        } else if (selectedLocations.length === $scope.ApptBranchLocations.length - 1) {  // Exclude "All Locations"
            $scope.LocationTypeObj.SelectLocationString = "All Locations";
        } else {
            $scope.LocationTypeObj.SelectLocationString = "Selected";
        }
    }


    function updateDoctorsString() {
        const selectedDoctors = $scope.NewPatientReportDoctorList.filter(mitem => mitem.isChecked);
        if (selectedDoctors.length === 0) {
            $scope.selectedDoctors = "Select Doctor";
        } else if (selectedDoctors.length === 1 && selectedDoctors[0].ClinicId !== 0) {
            $scope.selectedDoctors = selectedDoctors[0].SecondUserFullName;
        } else if (selectedDoctors.length === $scope.NewPatientReportDoctorList.length) {
            $scope.selectedDoctors = "All Doctors";
        } else {
            $scope.selectedDoctors = "Selected";
        }
    }
    $scope.GetMainDashBoardDetails = function (HospitalIdsList, DoctorID, SubOrganizationIdsList, SubDepartmentIdsList) {
        var selectedLocations = $scope.ApptBranchLocations.filter(item => item.IsChecked == true && item.hospitalID != 0);
        console.log(selectedLocations);
        if (selectedLocations.length == 0) {
            alertify.error("Please Select Location")
            return false;
        }
        var selectedDoctors = $filter("filter")($scope.NewPatientReportDoctorList, function (iterator, ind) { return iterator.isChecked == true; });
        if (selectedDoctors.length == 0) {
            alertify.error("Please Select Doctor");
            return false;
        }
        var newlist = "";
        for (var i in $scope.NewPatientReportDoctorList) {
            if ($scope.NewPatientReportDoctorList[i].isChecked) {
                newlist += "," + $scope.NewPatientReportDoctorList[i].DoctorID;
            }
        }
        if (newlist.charAt(0) === ",") {
            newlist = newlist.slice(1);
        }
        var isMultipleHospitals = Array.isArray(HospitalIdsList)? HospitalIdsList.length > 1: String(HospitalIdsList).split(',').length > 1;
        var req = {
            "Fromdate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_StartDate), "yyyy-MM-dd"),
            "Todate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_EndDate), "yyyy-MM-dd"),
            "HospitalIdsList": HospitalIdsList,
            "GetAllHospitalInd": isMultipleHospitals,
            "DoctorsIds": newlist || "",
        };
        eHnoteMainDashboardDataServices.GetMainDashBoardDetails(req).then(function (resp) {



            $scope.DashBoardData.DashBoardDetails = resp.data;
            $scope.MainDashBoardPieChartObj = resp.data;
            myDashBoardMainReportPieChartWithOutDoctors(HospitalIdsList);
            var TotalAppointments = '<b>Total Appts</b> ' + $scope.MainDashBoardPieChartObj.AllAppointments;
            $scope.myDataSourceOnDashBoard = {
                chart: {
                    //caption: "Eye Disorder Referral",
                    //subcaption: "For all users in 2017",
                    showpercentvalues: "",
                    defaultcenterlabel: TotalAppointments,
                    aligncaptionwithcanvas: "0",
                    captionpadding: "0",
                    decimals: "2",
                    plottooltext:
                        "<b>$value</b> of Appointments <b>$label</b>",
                    centerlabel: "",
                    theme: "fusion"
                },
                data: [
                    {
                        label: "<b>Cancelled Appointments</b>",
                        value: $scope.MainDashBoardPieChartObj.TotalCancelledAppointments || 0
                    },
                    {
                        label: "<b>New Appointments</b>",
                        value: $scope.MainDashBoardPieChartObj.NewAppointments || 0
                    },
                    {
                        label: "<b>ASC Appointments</b>",
                        value: $scope.MainDashBoardPieChartObj.ASCAppointments || 0
                    },
                    {
                        label: "<b>Clinic follow-up Appointments</b>",
                        value: $scope.MainDashBoardPieChartObj.ClinicfollowupAppointments || 0
                    },
                    {
                        label: "<b>Co-ordinator Appointments</b>",
                        value: $scope.MainDashBoardPieChartObj.CoordinatorAppointments || 0
                    },
                    {
                        label: "<b>Post Op followup Appointments</b>",
                        value: $scope.MainDashBoardPieChartObj.PostOpfollowupAppointments || 0
                    },
                    {
                        label: "<b>Pre Op Appointments</b>",
                        value: $scope.MainDashBoardPieChartObj.PreOpAppointments || 0
                    },
                    {
                        label: "<b>Pre admission Appointments</b>",
                        value: $scope.MainDashBoardPieChartObj.PreadmissionAppointments || 0
                    },
                    {
                        label: "<b>Technician Appointments</b>",
                        value: $scope.MainDashBoardPieChartObj.TechnicianAppointments || 0
                    },
                    {
                        label: "<b>Reschedule Appointments</b>",
                        value: $scope.MainDashBoardPieChartObj.RescheduleAppointments || 0
                    }
                ]
            };

            if ($scope.DashBoardData.DashBoardDetails.TreatmentRevenue !== undefined) {
                $scope.DashBoardData.DashBoardDetails.TreatmentRevenue = $scope.DashBoardData.DashBoardDetails.TreatmentRevenue;
            } else {
                $scope.DashBoardData.DashBoardDetails.TreatmentRevenue = 0;
            }
            if ($scope.DashBoardData.DashBoardDetails.Patients !== undefined) {
                $scope.DashBoardData.DashBoardDetails.Patients = $scope.DashBoardData.DashBoardDetails.Patients;
            } else {
                $scope.DashBoardData.DashBoardDetails.Patients = 0;
            }
            if ($scope.DashBoardData.DashBoardDetails.LabReport !== undefined) {
                $scope.DashBoardData.DashBoardDetails.LabReport = $scope.DashBoardData.DashBoardDetails.LabReport;
            } else {
                $scope.DashBoardData.DashBoardDetails.LabReport = 0;
            }

            $scope.ViewsObj.ShowDashboard = true;

        }, function (err) {
            console.log(err);
            alertify.error(err.data.Message);
        });
        //$scope.getChatDetails();
        $timeout(function () {
            $scope.getChatDetails();
        }, 200);
    };
    function myDashBoardMainReportPieChartWithOutDoctors(HospitalIdsList) {
      
        var WithOutDoctorListreq = {
            "Fromdate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_StartDate), "yyyy-MM-dd"),
            "Todate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_EndDate), "yyyy-MM-dd"),
            "HospitalIdsList": HospitalIdsList || "",
        };
        eHnoteMainDashboardDataServices.GetMainDashBoardDetailsWithOutDoctor(WithOutDoctorListreq).then(function (resp) {



            /*$scope.DashBoardData.DashBoardDetails = resp.data;*/
            $scope.MainDashBoardPieChartObjWithOutDoctors = resp.data;
            var TotalAppointments = '<b>Total Appts</b> ' + $scope.MainDashBoardPieChartObjWithOutDoctors.AllAppointments;
            $scope.ChangeByFiltermyDataSourceOnDashBoard = {
                chart: {
                    //caption: "Eye Disorder Referral",
                    //subcaption: "For all users in 2017",
                    showpercentvalues: "",
                    defaultcenterlabel: TotalAppointments,
                    aligncaptionwithcanvas: "0",
                    captionpadding: "0",
                    decimals: "2",
                    plottooltext:
                        "<b>$value</b> of Appointments <b>$label</b>",
                    centerlabel: "",
                    theme: "fusion"
                },
                data: [
                    {
                        label: "<b>Cancelled Appointments</b>",
                        value: $scope.MainDashBoardPieChartObjWithOutDoctors.CancelledAppointments || 0
                    },
                    {
                        label: "<b>New Appointments</b>",
                        value: $scope.MainDashBoardPieChartObjWithOutDoctors.NewAppointments || 0
                    },
                    {
                        label: "<b>ASC Appointments</b>",
                        value: $scope.MainDashBoardPieChartObjWithOutDoctors.ASCAppointments || 0
                    },
                    {
                        label: "<b>Clinic follow-up Appointments</b>",
                        value: $scope.MainDashBoardPieChartObjWithOutDoctors.ClinicfollowupAppointments || 0
                    },
                    {
                        label: "<b>Co-ordinator Appointments</b>",
                        value: $scope.MainDashBoardPieChartObjWithOutDoctors.CoordinatorAppointments || 0
                    },
                    {
                        label: "<b>Post Op followup Appointments</b>",
                        value: $scope.MainDashBoardPieChartObjWithOutDoctors.PostOpfollowupAppointments || 0
                    },
                    {
                        label: "<b>Pre Op Appointments</b>",
                        value: $scope.MainDashBoardPieChartObjWithOutDoctors.PreOpAppointments || 0
                    },
                    {
                        label: "<b>Pre admission Appointments</b>",
                        value: $scope.MainDashBoardPieChartObjWithOutDoctors.PreadmissionAppointments || 0
                    },
                    {
                        label: "<b>Technician Appointments</b>",
                        value: $scope.MainDashBoardPieChartObjWithOutDoctors.TechnicianAppointments || 0
                    },
                    {
                        label: "<b>Reschedule Appointments</b>",
                        value: $scope.MainDashBoardPieChartObjWithOutDoctors.RescheduleAppointments || 0
                    }
                ]
            };
        }, function (err) {
            console.log(err);
            alertify.error(err.data.Message);
        });
        //$scope.getChatDetails();
        $timeout(function () {
            $scope.getChatDetails();
        }, 200);
    }
    $scope.myDataSourceOnDashBoard = {
        chart: {
            //caption: "Eye Disorder Referral",
            //subcaption: "For all users in 2017",
            showpercentvalues: "",
            defaultcenterlabel: "",
            aligncaptionwithcanvas: "0",
            captionpadding: "0",
            decimals: "2",
            plottooltext:
                "<b>$percentValue</b> Appointments <b>$label</b>",
            centerlabel: "# Appointments: $value",
            theme: "fusion"
        },
        data: [
            {
                label: "Cancelled Appointments",
                value: $scope.MainDashBoardPieChartObj.CancelledAppointments || 0
            },
            {
                label: "ASC Appointments",
                value: $scope.MainDashBoardPieChartObj.NewAppointments || 0
            },
            {
                label: "ASC Appointments",
                value: $scope.MainDashBoardPieChartObj.ASCAppointments || 0
            },
            {
                label: "Clinic follow-up ointments",
                value: $scope.MainDashBoardPieChartObj.ClinicfollowupAppointments || 0
            },
            {
                label: "Co-ordinator Appointments",
                value: $scope.MainDashBoardPieChartObj.CoordinatorAppointments || 0
            },
            {
                label: "Post Op followup Appointments",
                value: $scope.MainDashBoardPieChartObj.PostOpfollowupAppointments || 0
            },
            {
                label: "Pre Op Appointments",
                value: $scope.MainDashBoardPieChartObj.PreOpAppointments || 0
            },
            {
                label: "Pre admission Appointments",
                value: $scope.MainDashBoardPieChartObj.PreadmissionAppointments || 0
            },
            {
                label: "Technician Appointments",
                value: $scope.MainDashBoardPieChartObj.TechnicianAppointments || 0
            },
            {
                label: "Reschedule Appointments",
                value: $scope.MainDashBoardPieChartObj.RescheduleAppointments || 0
            }
        ]
    };
    $scope.ChangeByFiltermyDataSourceOnDashBoard = {
        chart: {
            //caption: "Eye Disorder Referral",
            //subcaption: "For all users in 2017",
            showpercentvalues: "",
            defaultcenterlabel: 0,
            aligncaptionwithcanvas: "0",
            captionpadding: "0",
            decimals: "2",
            plottooltext:
                "<b>$value</b> of Appointments <b>$label</b>",
            centerlabel: "",
            theme: "fusion"
        },
        data: [
            {
                label: "<b>Cancelled Appointments</b>",
                value: $scope.MainDashBoardPieChartObjWithOutDoctors.CancelledAppointments || 0
            },
            {
                label: "<b>New Appointments</b>",
                value: $scope.MainDashBoardPieChartObjWithOutDoctors.NewAppointments || 0
            },
            {
                label: "<b>ASC Appointments</b>",
                value: $scope.MainDashBoardPieChartObjWithOutDoctors.ASCAppointments || 0
            },
            {
                label: "<b>Clinic follow-up ointments</b>",
                value: $scope.MainDashBoardPieChartObjWithOutDoctors.ClinicfollowupAppointments || 0
            },
            {
                label: "<b>Co-ordinator Appointments</b>",
                value: $scope.MainDashBoardPieChartObjWithOutDoctors.CoordinatorAppointments || 0
            },
            {
                label: "<b>Post Op followup Appointments</b>",
                value: $scope.MainDashBoardPieChartObjWithOutDoctors.PostOpfollowupAppointments || 0
            },
            {
                label: "<b>Pre Op Appointments</b>",
                value: $scope.MainDashBoardPieChartObjWithOutDoctors.PreOpAppointments || 0
            },
            {
                label: "<b>Pre admission Appointments</b>",
                value: $scope.MainDashBoardPieChartObjWithOutDoctors.PreadmissionAppointments || 0
            },
            {
                label: "<b>Technician Appointments</b>",
                value: $scope.MainDashBoardPieChartObjWithOutDoctors.TechnicianAppointments || 0
            },
            {
                label: "<b>Reschedule Appointments</b>",
                value: $scope.MainDashBoardPieChartObjWithOutDoctors.RescheduleAppointments || 0
            }
        ]
    };
    $scope.GetSurgeryDashBoardDetails = function (HospitalIdsList, DoctorID) {
        var req = {
            "Fromdate": $filter("date")(new Date($scope.dashboard_StartDate), "yyyy-MM-dd"),
            "Todate": $filter("date")(new Date($scope.dashboard_EndDate), "yyyy-MM-dd"),
            "HospitalIdsList": HospitalIdsList.length > 0 ? HospitalIdsList : "",
            "UserId": DoctorID,
            "SpecializationId": doctorinfo.doctordata.User[0].SpecializationId
        };
        eHnoteMainDashboardDataServices.GetSurgeryDashBoardDetails(req).then(function (resp) {
            $scope.SurgeryData = resp.data;

        }, function (err) {
            console.log(err);
            alertify.error(err.data.Message);
        });

        //$scope.getChatDetails();
    };


    $scope.DashBoardAccess = {
        "summaryAllBranchesAccess": false,
        "summaryAllDoctorsAccess": false,
        "summaryRevenueBlocksAccess": false,
        "reportsScreensAccess": false,
        "summaryScreensAccess": false,
        "revenueReportsAccess": false,
        "reveueCountReportAccess ": false,
        "exclusiveReportAccess": false,
        "AdditionalReportAccess": false
    };

    $scope.UserAccessList = [];

    function getDoctorsbySubSpecializations(branchId) {

        console.log(branchId);
        var branchesList = [];
        $scope.clinicDoctorList = [];
        $scope.allUserList = [];
        $scope.selectedDoctor = "";
        $scope.InternalReportDoctorList = [];
        $scope.MultiselectUserlist = [];
        if (branchId === 0) {
            var TempAppListdoctoraddress = $filter("filter")($scope.hospitalDetails, function (iterator, ind) { return iterator.ClinicId !== 0; });
            var hospitalID = _.pluck(TempAppListdoctoraddress, "BranchId").join(",");

            angular.forEach(TempAppListdoctoraddress, function (items) {
                branchesList.push(items.BranchId);
            });
        } else {


            var TempAppListdoctoraddress = $filter("filter")($scope.hospitalDetails, function (iterator, ind) { return iterator.ClinicId === branchId; });
            var hospitalID = _.pluck(TempAppListdoctoraddress, "BranchId").join(",");
            angular.forEach(TempAppListdoctoraddress, function (items) {
                branchesList.push(items.BranchId);
            });
        }





        if ($scope.SubDepartmentId !== "") {

            var listSubSplArray = $filter("filter")($scope.allSubSpecializationsArray, function (iterator, ind) { return iterator.SubSpecializationId === $scope.SubDepartmentId; });
        }
        else {
            var listSubSplArray = $scope.allSubSpecializationsArray;
        }
        var subSplArray = _.pluck(listSubSplArray, "SubSpecializationId").join(",");

        var reqObj = {
            "BranchId": hospitalID,
            "SubSpecializationIdArray": subSplArray
        }



        eHnoteMainAppointmentService.getAllUsersByDepartmentId(reqObj, onGetUsersSuccess, onGetUsersFailure);
        function onGetUsersSuccess(resp) {
            if (resp.rows.length > 0) {
                $scope.allUserList = resp.rows||[];
                $scope.AllDoctorList = $scope.allUserList;

                $scope.AllDoctorList = _.uniq($scope.AllDoctorList, false, function (p) { return p.DoctorID; });
                $scope.AllDoctorList = $filter("filter")($scope.AllDoctorList, function (item) {
                    return item.RoleId === 1 || item.RoleId === 43;
                });
                if ($scope.allUserList.length > 0) {
                    $scope.MultiselectUserlist = [];
                    angular.forEach($scope.allUserList, function (ritem) {
                        if (ritem.RoleId === 2 || ritem.RoleId === 17 || ritem.RoleId === 62 || ritem.RoleId === 63 || ritem.RoleId === 64 || ritem.RoleId === 65 || ritem.RoleId === 66 || ritem.RoleId === 67 || ritem.RoleId === 68 || ritem.RoleId === 69 || ritem.RoleId === 70 || ritem.RoleId === 71 || ritem.RoleId === 20) {
                            $scope.MultiselectUserlist.push(ritem);
                        }
                    });
                }
                var RoleID = userLoginDetails.RoleID;
                $scope.NewPatientReportDoctorList = $scope.AllDoctorList;
                $scope.ApptInsuranceReportDoctorList = angular.copy($scope.AllDoctorList);
                if ($scope.NewPatientReportDoctorList.length > 0) {
                    angular.forEach($scope.NewPatientReportDoctorList, function (citem, $index) {
                        citem.id = citem.DoctorID;
                        citem.title = citem.FullName;
                        citem.isChecked = true;
                    });
                }
                if ($scope.ApptInsuranceReportDoctorList.length > 0) {
                    angular.forEach($scope.ApptInsuranceReportDoctorList, function (citem, $index) {
                        citem.id = citem.DoctorID;
                        citem.title = citem.FullName;
                        citem.isChecked = true;
                    });
                }
                $scope.InternalReportDoctorList = angular.copy($scope.AllDoctorList)||[];
                if ($scope.InternalReportDoctorList.length > 0) {
                    angular.forEach($scope.InternalReportDoctorList, function (citem, $index) {
                        citem.id = citem.DoctorID;
                        citem.title = citem.FullName;
                        citem.isChecked = false;
                    });
                }

                var selectedDoctors = $filter("filter")($scope.NewPatientReportDoctorList, function (iterator, ind) { return iterator.isChecked == true; });
                if (selectedDoctors.length === $scope.NewPatientReportDoctorList.length) {
                    $scope.GetNewPatientReportObj.AllDoctorCheck = true;
                    $scope.PatientSurgeryApptObj.AllDoctorCheck = true;
                    $scope.PatientApptInsObj.AllDoctorCheck = true;
                    $scope.GetDataOnMainDashBoardObj.AllDoctorCheck = true;
                    $scope.selectedDoctors = 'All';
                    $scope.selectedApptInsDoctor = 'All';
                }
                var selectedInternalDoctors = $filter("filter")($scope.InternalReportDoctorList, function (iterator, ind) { return iterator.isChecked == true; });
                if (selectedInternalDoctors.length === $scope.InternalReportDoctorList.length) {
                    $scope.GetNewPatientReportObj.AllInternalDoctorCheck = true;

                    $scope.selectedInternalDoctors = 'All';
                } else {
                    $scope.GetNewPatientReportObj.AllInternalDoctorCheck = false;
                    $scope.selectedInternalDoctors = 'Select Referal Doctor';
                }
                console.log($scope.dashboardTab);

                console.log($scope.loadType +"__loadType");


                if ($scope.dashboardTab === "reports") {

                    $scope.AllUserBranchesList = $scope.hospitalDetails;

                    $scope.BranchDoctorsList = $scope.allUserList;

                    $scope.AllCounselorsList = $filter("filter")($scope.BranchDoctorsList, function (item) {
                        return item.RoleId === 18;

                    }) || [];
                    var docAll = { "DoctorID": 0, "FullName": "All Doctors", "AddressID": 0, "MinPerCase": 15 };
                    $scope.AllCounselorsList.unshift(docAll);


                    angular.forEach($scope.BranchDoctorsList, function (Aitem) {
                        angular.forEach(Aitem.UserBranchRoles, function (item) {
                            if (item.RoleId === 1 || item.RoleId === 3 || item.RoleId === 4 || item.RoleId === 43 || item.RoleId === 56 || item.RoleId === 57) {
                                $scope.AllConversionList.push(Aitem);
                            }
                        });
                    });
                    var docAll = { "DoctorID": 0, "FullName": "All Doctors", "AddressID": 0, "MinPerCase": 15 };
                    $scope.AllConversionList.unshift(docAll);

                    angular.forEach($scope.BranchDoctorsList, function (Aitem) {
                        angular.forEach(Aitem.UserBranchRoles, function (item) {
                            if (item.RoleId === 10) {
                                $scope.AllOptomDocList.push(Aitem);
                            }
                        });
                    });
                    var docAll = { "DoctorID": 0, "FullName": "All Optometrists", "AddressID": 0, "MinPerCase": 15 };
                    $scope.AllOptomDocList.unshift(docAll);


                    angular.forEach($scope.BranchDoctorsList, function (Aitem) {
                        angular.forEach(Aitem.UserBranchRoles, function (item) {
                            if (item.RoleId === 1 || item.RoleId === 3 || item.RoleId === 4 || item.RoleId === 43 || item.RoleId === 56 || item.RoleId === 57) {
                                $scope.BranchDoctorsList.push(Aitem);
                            }
                        });
                    });
                    var docAll = { "DoctorID": 0, "FullName": "All Doctors", "AddressID": 0, "MinPerCase": 15 };
                    $scope.BranchDoctorsList.unshift(docAll);

                    var currentClinic = doctorinfo.doctordata.UserAddress[0];
                    if ($scope.AllUserBranchesList.length > 0) {
                        angular.forEach($scope.AllUserBranchesList, function (value, key) {

                            if ($scope.BranchDoctorsList.length > 0) {
                                $scope.BranchDoctorsList = _.uniq($scope.BranchDoctorsList, false, function (p) {
                                    return p.DoctorID;
                                });

                            }


                        });
                    }


                    if ($scope.loadType === 'onLoad') {
                        $scope.reportSearch.HospitalId = [];
                        $scope.reportSearch.HospitalObj = $filter("filter")($scope.AllUserBranchesList, { "ClinicId": $scope.selectedBranch.BranchId }, true)[0];
                        if ($scope.reportSearch.HospitalObj.ClinicId === 0) {
                            $scope.reportSearch.HospitalId = GetAllHospitalIds();
                            $scope.reportSearch.AllHospitalsIndicator = 1;
                        } else {
                            $scope.reportSearch.HospitalId.push($scope.reportSearch.HospitalObj.ClinicId);
                            $scope.reportSearch.AllHospitalsIndicator = 0;
                        }
                    }
                    $scope.reportSearch.SubOrganizationId = $scope.reportSearch.SubOrganizationId || 0;

                    if ($scope.reportSearch.SubOrganizationId === 0) {
                        $scope.reportSearch.SubOrganizationObj = $scope.SubOrganizationReportList[0];
                        $scope.reportSearch.SubOrganizationId = $scope.SubOrganizationReportList[0].SubOrganizationId;
                        $scope.clearReportSearch();
                    }


                    $scope.reportSearch.DoctorObj = $scope.BranchDoctorsList[0];
                    $scope.reportSearch.DoctorId = $scope.BranchDoctorsList[0].DoctorID;
                    $scope.reportSearch.CounselorObj = $scope.AllCounselorsList[0];
                    $scope.reportSearch.CounselorDoctorId = $scope.AllCounselorsList[0].DoctorID;
                    $scope.reportSearch.ConversionObj = $scope.AllConversionList[0];
                    $scope.reportSearch.ConversionDoctorId = $scope.AllConversionList[0].DoctorID;

                    $scope.reportSearch.OptomObj = $scope.AllOptomDocList[0];
                    $scope.reportSearch.OptomDoctorId = $scope.AllOptomDocList[0].DoctorID;

                    if ($scope.RoleId === 1 || $scope.RoleId === 56) {
                        $scope.reportSearch.AllDoctorsIndicator = 0;
                    } else {
                        $scope.reportSearch.AllDoctorsIndicator = 1;
                    }
                    $scope.reportSearch.DepartmentId = $scope.reportSearch.DepartmentId || 0;

                    if ($scope.reportSearch.DepartmentId === 0) {
                        $scope.reportSearch.DepartmentObj = $scope.allSubSpecializationsReportArray[0];
                        $scope.reportSearch.DepartmentId = $scope.allSubSpecializationsReportArray[0].SubSpecializationId;
                    }
                    // $scope.clearReportSearch();

                } else {

                    //$scope.clinicDoctorList = angular.copy($scope.allUserList);

                    $scope.SelectedHospital = $filter("filter")($scope.hospitalDetails, function (item, index) { return item.ClinicId === branchId; })[0];

                    $scope.SelectedHospitalIdsList = [];
                    $scope.clinicDoctorAllList = [];
                    $scope.clinicDoctorAllList = $scope.allUserList;
                    //$scope.clinicDoctorList = $filter("filter")($scope.clinicDoctorList, function (item) {
                    //    return item.RoleId === 1 || item.RoleId === 3 || item.RoleId === 4 || item.RoleId === 43 || item.RoleId === 56 || item.RoleId === 57;
                    //});
                    angular.forEach($scope.clinicDoctorAllList, function (Aitem) {
                        angular.forEach(Aitem.UserBranchRoles, function (item) {
                            if (item.RoleId === 1 || item.RoleId === 3 || item.RoleId === 4 || item.RoleId === 43 || item.RoleId === 16 || item.RoleId === 56 || item.RoleId === 57) {
                                $scope.clinicDoctorList.push(Aitem);
                                //  console.log($scope.clinicDoctorList);
                            }

                        });
                    });
                    $scope.clinicDoctorList = _.uniq($scope.clinicDoctorList, false, function (p) { return p.DoctorID; });

                    if ($scope.SelectedHospital !== undefined && $scope.SelectedHospital !== "") {
                        $scope.SelectedHospitalIdsList.push($scope.SelectedHospital.ClinicId);
                        $scope.GetAllIndicator = 0;
                    }
                    else {
                        $scope.SelectedHospitalIdsList = GetAllHospitalIds();
                        $scope.GetAllIndicator = 1;
                    }



                    $scope.SelectedSubOrganization = $filter("filter")($scope.SubOrganizationList, function (item, index) { return item.SubOrganizationId === $scope.SubOrganizationId; })[0];
                    $scope.SelectedSubOrganizationIdsList = [];
                    if ($scope.SelectedSubOrganization !== undefined && $scope.SelectedSubOrganization !== "") {
                        $scope.SelectedSubOrganizationIdsList.push($scope.SelectedSubOrganization.SubOrganizationId);
                    }
                    else {
                        $scope.SubOrganizationIdsList = GetAllSubOrganizationIds();
                    }
                    //$scope.SelectedSubOrganizationIdsList.push($scope.SelectedSubOrganization.SubOrganizationId);
                    $scope.SelectedSubDepartmentIdsList = [];
                    if ($scope.SubDepartmentId != "") {
                        $scope.SelectedDepartment = $filter("filter")($scope.allSubSpecializationsArray, function (item, index) { return item.SubSpecializationId === $scope.SubDepartmentId; })[0];
                        $scope.SelectedSubDepartmentIdsList.push($scope.SelectedDepartment.SubSpecializationId);
                    }
                    else {
                        $scope.SelectedSubDepartmentIdsList = [];
                        angular.forEach($scope.allSubSpecializationsArray, function (mitems) {
                            $scope.SelectedSubDepartmentIdsList.push(mitems.SubSpecializationId);
                        });
                    }
                    $scope.SubDepartmentIdsList = $scope.SelectedSubDepartmentIdsList;

                    //if ($scope.loadType==="onLoad") {
                    //    $scope.GetMainDashBoardDetails($scope.SelectedHospitalIdsList, 0, $scope.SelectedSubOrganizationIdsList, $scope.SelectedSubDepartmentIdsList);
                    //};

                }
                $scope.selectedUsers = '';
                if ($scope.MultiselectUserlist.length>0) {
                    if (RoleID === 2 || RoleID === 17 || RoleID === 62 || RoleID === 63 || RoleID === 64 || RoleID === 65 || RoleID === 66 || RoleID === 67 || RoleID === 68 || RoleID === 69 || RoleID === 70 || RoleID === 71 || RoleID === 20) {
                        angular.forEach($scope.MultiselectUserlist, function (citem, $index) {
                            if (doctorinfo.doctordata.User[0].DoctorID == citem.DoctorID) {
                                citem.isChecked = true;
                                $scope.selectedUsers = citem.UserFullName + '-' + citem.NPI;
                            } else {
                                citem.isChecked = false;
                            }
                        });
                        $scope.AllUsersCheck = false;
                    } else {
                        angular.forEach($scope.MultiselectUserlist, function (item) {
                            item.isChecked = true;
                        });
                        $scope.selectedUsers = 'All';
                        $scope.AllUsersCheck = true;
                    }
                }

            } else {
                alertify.error("No Users Found in Selected Departments");
                $scope.mainBookedAppointmentList = [];
                $scope.SelectedSubDepartmentIdsList = [];
                if ($scope.SubDepartmentId != "") {
                    $scope.SelectedDepartment = $filter("filter")($scope.allSubSpecializationsArray, function (item, index) { return item.SubSpecializationId === $scope.SubDepartmentId; })[0];
                    $scope.SelectedSubDepartmentIdsList.push($scope.SelectedDepartment.SubSpecializationId);
                }
                else {
                    $scope.SelectedSubDepartmentIdsList = [];
                    angular.forEach($scope.allSubSpecializationsArray, function (mitems) {
                        $scope.SelectedSubDepartmentIdsList.push(mitems.SubSpecializationId);
                    });
                }
                $scope.SubDepartmentIdsList = $scope.SelectedSubDepartmentIdsList;
                //if ($scope.loadType === "onLoad") {
                //    $scope.GetMainDashBoardDetails($scope.SelectedHospitalIdsList, 0, $scope.SelectedSubOrganizationIdsList, $scope.SelectedSubDepartmentIdsList);
                //};
            }


        }

        function onGetUsersFailure(data) {
        }
    }

    function getDoctorsbySubSpecializationsForReports(branchId) {


        var branchesList = [];
        $scope.clinicDoctorList = [];
        $scope.allUserList = [];
        $scope.selectedDoctor = "";
        //$scope.BranchDoctorsList = [];

        if (branchId === 0) {
            var TempAppListdoctoraddress = $filter("filter")($scope.AllUserBranchesList, function (iterator, ind) { return iterator.ClinicId !== 0; });
            var hospitalID = _.pluck(TempAppListdoctoraddress, "BranchId").join(",");

            angular.forEach(TempAppListdoctoraddress, function (items) {
                branchesList.push(items.BranchId);
            });
        } else {


            var TempAppListdoctoraddress = $filter("filter")($scope.AllUserBranchesList, function (iterator, ind) { return iterator.ClinicId === branchId; });
            var hospitalID = _.pluck(TempAppListdoctoraddress, "BranchId").join(",");
            angular.forEach(TempAppListdoctoraddress, function (items) {
                branchesList.push(items.BranchId);
            });
        }
        $scope.reportSearch.DepartmentId = $scope.reportSearch.DepartmentId || "";

        if ($scope.reportSearch.DepartmentId !== "" && $scope.reportSearch.DepartmentId !== 0) {

            var listSubSplArray = $filter("filter")($scope.allSubSpecializationsReportArray, function (iterator, ind) { return iterator.SubSpecializationId === $scope.reportSearch.DepartmentId; });
        }
        else {
            var listSubSplArray = $scope.allSubSpecializationsReportArray;
        }
        var subSplArray = _.pluck(listSubSplArray, "SubSpecializationId").join(",");

        var reqObj = {
            "BranchId": hospitalID,
            "SubSpecializationIdArray": subSplArray
        }



        eHnoteMainAppointmentService.getAllUsersByDepartmentId(reqObj, onGetUsersSuccess, onGetUsersFailure);
        function onGetUsersSuccess(resp) {

            if (resp.rows.length > 0) {
                $scope.allUserList = resp.rows;

                var RoleID = userLoginDetails.RoleID;


                if ($scope.dashboardTab === "reports") {

                    $scope.BranchDoctorsList = $scope.allUserList;



                    $scope.AllCounselorsList = $filter("filter")($scope.BranchDoctorsList, function (item) {
                        return item.RoleId === 18;

                    }) || [];
                    var docAll = { "DoctorID": 0, "FullName": "All Doctors", "AddressID": 0, "MinPerCase": 15 };
                    $scope.AllCounselorsList.unshift(docAll);

                    angular.forEach($scope.BranchDoctorsList, function (Aitem) {
                        angular.forEach(Aitem.UserBranchRoles, function (item) {
                            if (item.RoleId === 1 || item.RoleId === 3 || item.RoleId === 4 || item.RoleId === 43 || item.RoleId === 56 || item.RoleId === 57) {
                                $scope.AllConversionList.push(Aitem);
                            }
                        });
                    });
                    var docAll = { "DoctorID": 0, "FullName": "All Doctors", "AddressID": 0, "MinPerCase": 15 };
                    $scope.AllConversionList.unshift(docAll);

                    $scope.AllOptomDocList = $filter("filter")($scope.BranchDoctorsList, function (item) {
                        return item.RoleId === 10;
                    }) || [];
                    var docAll = { "DoctorID": 0, "FullName": "All Optometrists", "AddressID": 0, "MinPerCase": 15 };
                    $scope.AllOptomDocList.unshift(docAll);


                    angular.forEach($scope.BranchDoctorsList, function (Aitem) {
                        angular.forEach(Aitem.UserBranchRoles, function (item) {
                            if (item.RoleId === 1 || item.RoleId === 3 || item.RoleId === 4 || item.RoleId === 43 || item.RoleId === 56 || item.RoleId === 57) {
                                $scope.BranchDoctorsList.push(Aitem);
                            }
                        });
                    });
                    var docAll = { "DoctorID": 0, "FullName": "All Doctors", "AddressID": 0, "MinPerCase": 15 };
                    $scope.BranchDoctorsList.unshift(docAll);
                    if ($scope.BranchDoctorsList.length > 0) {
                        $scope.BranchDoctorsList = _.uniq($scope.BranchDoctorsList, false, function (p) {
                            return p.DoctorID;
                        });

                    }
                    var currentClinic = doctorinfo.doctordata.UserAddress[0];
                    //if ($scope.AllUserBranchesList.length > 0) {
                    //    angular.forEach($scope.AllUserBranchesList, function (value, key) {

                    //        if ($scope.BranchDoctorsList.length > 0) {
                    //            $scope.BranchDoctorsList = _.uniq($scope.BranchDoctorsList, false, function (p) {
                    //                return p.DoctorID;
                    //            });

                    //        }


                    //    });
                    //}
                    if ($scope.dashboardTab === "reports") {
                        var subAll = { "SubOrganizationId": 0, "SubOrganizationName": "All SubOrganizations" };
                        $scope.SubOrganizationReportList.unshift(subAll);
                        if ($scope.SubOrganizationReportList.length > 0) {
                            $scope.SubOrganizationReportList = _.uniq($scope.SubOrganizationReportList, false, function (p) {
                                return p.SubOrganizationId;
                            });

                        }

                        var depAll = { "SubSpecializationId": 0, "SubSpecializationName": "All Departments" };
                        $scope.allSubSpecializationsReportArray.unshift(depAll);
                        if ($scope.allSubSpecializationsReportArray.length > 0) {
                            $scope.allSubSpecializationsReportArray = _.uniq($scope.allSubSpecializationsReportArray, false, function (p) {
                                return p.SubSpecializationId;
                            });

                        }
                    }
                    console.log($scope.loadType);
                    if ($scope.loadType === 'onLoad') {
                        $scope.reportSearch.HospitalId = [];
                        $scope.reportSearch.HospitalObj = $filter("filter")($scope.AllUserBranchesList, { "ClinicId": $scope.selectedBranch.BranchId }, true)[0];
                        if ($scope.reportSearch.HospitalObj.ClinicId === 0) {
                            $scope.reportSearch.HospitalId = GetAllHospitalIds();
                            $scope.reportSearch.AllHospitalsIndicator = 1;
                        } else {
                            $scope.reportSearch.HospitalId.push($scope.reportSearch.HospitalObj.ClinicId);
                            $scope.reportSearch.AllHospitalsIndicator = 0;
                        }
                        $scope.reportSearch.FromDate = $filter('date')(new Date($scope.reportSearch.FromDate), "dd-MMM-yyyy");
                        $scope.reportSearch.ToDate = $filter('date')(new Date($scope.reportSearch.ToDate), "dd-MMM-yyyy");
                    }
                    $scope.reportSearch.SubOrganizationId = $scope.reportSearch.SubOrganizationId || 0;

                    if ($scope.reportSearch.SubOrganizationId === 0) {
                        $scope.reportSearch.SubOrganizationObj = $scope.SubOrganizationReportList[0];
                        $scope.reportSearch.SubOrganizationId = $scope.SubOrganizationReportList[0].SubOrganizationId;
                        $scope.clearReportSearch();
                    }


                    $scope.reportSearch.DoctorObj = $scope.BranchDoctorsList[0];
                    $scope.reportSearch.DoctorId = $scope.BranchDoctorsList[0].DoctorID;
                    $scope.reportSearch.CounselorObj = $scope.AllCounselorsList[0];
                    $scope.reportSearch.CounselorDoctorId = $scope.AllCounselorsList[0].DoctorID;
                    $scope.reportSearch.ConversionObj = $scope.AllConversionList[0];
                    $scope.reportSearch.ConversionDoctorId = $scope.AllConversionList[0].DoctorID;

                    $scope.reportSearch.OptomObj = $scope.AllOptomDocList[0];
                    $scope.reportSearch.OptomDoctorId = $scope.AllOptomDocList[0].DoctorID;

                    if ($scope.RoleId === 1 || $scope.RoleId === 56) {
                        $scope.reportSearch.AllDoctorsIndicator = 0;
                    } else {
                        $scope.reportSearch.AllDoctorsIndicator = 1;
                    }
                    $scope.reportSearch.DepartmentId = $scope.reportSearch.DepartmentId || 0;

                    if ($scope.reportSearch.DepartmentId === 0) {
                        $scope.reportSearch.DepartmentObj = $scope.allSubSpecializationsReportArray[0];
                        $scope.reportSearch.DepartmentId = $scope.allSubSpecializationsReportArray[0].SubSpecializationId;
                    }
                    //  $scope.clearReportSearch();
                    if ($scope.allUserList.length > 0) {
                        $scope.MultiselectUserlist = [];
                        angular.forEach($scope.allUserList, function (ritem) {
                            if (ritem.RoleId === 2 || ritem.RoleId === 17 || ritem.RoleId === 62 || ritem.RoleId === 63 || ritem.RoleId === 64 || ritem.RoleId === 65 || ritem.RoleId === 66 || ritem.RoleId === 67 || ritem.RoleId === 68 || ritem.RoleId === 69 || ritem.RoleId === 70 || ritem.RoleId === 71 || ritem.RoleId === 20) {
                                $scope.MultiselectUserlist.push(ritem);
                            }
                        });
                    }

                }
                $scope.selectedUsers = '';
                if ($scope.MultiselectUserlist.length > 0) {
                    if (RoleID === 2 || RoleID === 17 || RoleID === 62 || RoleID === 63 || RoleID === 64 || RoleID === 65 || RoleID === 66 || RoleID === 67 || RoleID === 68 || RoleID === 69 || RoleID === 70 || RoleID === 71 || RoleID === 20) {
                        angular.forEach($scope.MultiselectUserlist, function (citem, $index) {
                            citem.DoctorfullNamewithNPI = '';
                            citem.DoctorfullNamewithNPI = citem.NPI + '-' + citem.SecondUserFullName;
                            if (doctorinfo.doctordata.User[0].DoctorID == citem.DoctorID) {
                                citem.isChecked = true;
                                $scope.selectedUsers = citem.UserFullName + '-' + citem.NPI;
                            } else {
                                citem.isChecked = false;
                            }
                        });
                        $scope.AllUsersCheck = false;
                    } else {
                        angular.forEach($scope.MultiselectUserlist, function (item) {
                            item.isChecked = true;
                            item.DoctorfullNamewithNPI = '';
                            item.DoctorfullNamewithNPI = item.NPI + '-' + item.SecondUserFullName;
                        });
                        $scope.selectedUsers = 'All';
                        $scope.AllUsersCheck = true;
                    }

                }

            } else {
                alertify.error("No Users Found in Selected Departments");
                $scope.mainBookedAppointmentList = [];
                $scope.BranchDoctorsList = [];
            }


        }

        function onGetUsersFailure(data) {
        }
    }
    function GetBranchSubSpecializations(SubOrganizationId, BranchId) {

        eHnoteMainAppointmentService.getBranchSubSpecializationsById(SubOrganizationId, BranchId).then(function (resp) {
            if (resp.data.row.length > 0) {
                $scope.allSubSpecializationsArray = [];
                $scope.allSubSpecializationsReportArray = [];
                $scope.allSubSpecializationsArray = resp.data.row;
                $scope.allSubSpecializationsReportArray = resp.data.row;
                //angular.forEach($scope.allSubSpecializationsArray, function (item) {
                //    item.isChecked = true;
                //});


                getDoctorsbySubSpecializations(BranchId);
            } else {
                $scope.allSubSpecializationsArray = [];
                $scope.clinicDoctorList = [];
                $scope.allUserList = [];
                $scope.selectedDoctor = "";
                alertify.error("No Departments are been added");
            }


        });
    };

    function GetBranchSubSpecializationsforReports(SubOrganizationId, BranchId) {

        eHnoteMainAppointmentService.getBranchSubSpecializationsById(SubOrganizationId, BranchId).then(function (resp) {
            if (resp.data.row.length > 0) {
                $scope.allSubSpecializationsReportArray = [];
                $scope.allSubSpecializationsReportArray = resp.data.row;

                getDoctorsbySubSpecializationsForReports(BranchId);
            } else {
                $scope.allSubSpecializationsReportArray = [];
                $scope.clinicDoctorList = [];
                $scope.AllUserBranchesList = [];
                $scope.allUserList = [];
                $scope.selectedDoctor = "";
                alertify.error("No Departments are been added");
            }


        });
    };
    function initializeNewBranches(data) {
        $scope.hospitalDetails = [];
        var clinicAddress = eHnoteUserAppointmentDataService.RestructureNewBranches($scope.UserAccessRights.AllAccessRights.SummaryAllBranchesReports, data, doctorinfo) || [];
        $scope.hospitalDetails = clinicAddress;
        //if (clinicAddress.length > 0) {
        //    var List = $filter("filter")(clinicAddress, { "SubOrganizationId": $scope.SubOrganizationId }, true);
        //    $scope.hospitalDetails = List;
        //}
        var EmptyClinicObj = {
            "ClinicName": "All Locations",
            "ClinicId": 0,
            "BranchName": "All Locations",
            "BranchId": 0,
            "SubOrganizationId": 0,
            "Address1": "",
            "Address2": "",
            "Location": "",
            "StateId": "",
            "PinCode": "",
            "CountryId": "",
            "CityId": "",
            "DistrictRegion": "",
            "Latitude": "",
            "Longitude": "",
            "BranchEmail": "",
            "CountryCode": "",
            "mobilenum": "",
            "Active": "Y",
            "Doctors": [],
            "CommunicationCountryCode": "",
            "CommunicationMobileNo": "",
            "IsChecked": false
        };
        clinicAddress.unshift(EmptyClinicObj);

        let locationsList = clinicAddress.map(item => {
            item.IsChecked = false;
            if ($scope.HospitalId === item.BranchId) {
                item.IsChecked = true;
                $scope.LocationTypeObj.SelectLocationString = item.BranchName;
            }
            return item;
        })
        
        $scope.ApptBranchLocations = locationsList || [];
        console.log(" $scope.ApptBranchLocations", $scope.ApptBranchLocations)
        $scope.HospitalIdsList = [];
        angular.forEach(clinicAddress, function (item, index) {
            $scope.HospitalIdsList.push(item.BranchId);
        });

        $scope.defaultbranch1 = $filter("filter")(clinicAddress, function (item) {
            return item.BranchId === doctorinfo.doctordata.UserAddress[0].ClinicId;
        });


        if ($scope.defaultbranch1.length > 0) {
            $scope.selectedBranch = $scope.defaultbranch1[0];
        }
        else {
            $scope.selectedBranch = clinicAddress[0];
        }

        if ($scope.defaultbranch1.length > 0) {
            $scope.SelectedHospital = $scope.defaultbranch1[0];
        }
        else {
            $scope.SelectedHospital = clinicAddress[0];
        }

        // GetBranchSubSpecializations($scope.selectedBranch.SubOrganizationId, $scope.selectedBranch.BranchId);


        GetBranchSubSpecializations($scope.SubOrganizationId, $scope.selectedBranch.BranchId);
    }

    function initializeReportNewBranches(data) {
        var clinicAddress = eHnoteUserAppointmentDataService.RestructureNewBranches($scope.UserAccessRights.AllAccessRights.SummaryAllBranchesReports, data, doctorinfo) || [];


        var EmptyClinicObj = {
            "ClinicName": "All Locations",
            "ClinicId": 0,
            "Address1": "",
            "Address2": "",
            "Location": "",
            "StateId": "",
            "PinCode": "",
            "CountryId": "",
            "CityId": "",
            "DistrictRegion": "",
            "Latitude": "",
            "Longitude": "",
            "BranchEmail": "",
            "CountryCode": "",
            "mobilenum": "",
            "Active": "Y",
            "Doctors": []

        };
        clinicAddress.unshift(EmptyClinicObj);

        clinicAddress = _.uniq(clinicAddress, false, function (p) {
            return p.ClinicId;
        });


        $scope.AllUserBranchesList = clinicAddress;

        $scope.defaultbranch = $filter("filter")(clinicAddress, function (item) {
            return item.BranchId === doctorinfo.doctordata.UserAddress[0].ClinicId;
        });
        $scope.selectedBranch = $scope.defaultbranch[0];
        if ($scope.SubOrganizationReportList.length > 0) {
            var List = $filter("filter")($scope.SubOrganizationReportList, { "SubOrganizationId": $scope.selectedBranch.SubOrganizationId}, true);
            if (List.length > 0) {
                $scope.reportSearch.SubOrganizationObj = List[0];
                $scope.reportSearch.SubOrganizationId = List[0].SubOrganizationId;
            }
        }


        $scope.reportSearch.HospitalObj = $scope.defaultbranch[0];

        // GetBranchSubSpecializations($scope.selectedBranch.SubOrganizationId, $scope.selectedBranch.BranchId);

        // GetBranchSubSpecializationsforReports($scope.SubOrganizationId, $scope.selectedBranch.BranchId);

        GetBranchSubSpecializationsforReports($scope.selectedBranch.SubOrganizationId,$scope.selectedBranch.BranchId);
    }



    function checkUserAccessPermissions() {

        angular.forEach($scope.UserAccessList, function (item) {
            if (item.AccessCategoryId === 7 && item.ActiveInd === "Y") {
                angular.forEach(item.AccessList, function (citem) {
                    if (citem.AccessRightId === 37 && citem.ActiveInd === "Y") {
                        $scope.DashBoardAccess.summaryAllBranchesAccess = true;
                    }
                    if (citem.AccessRightId === 87 && citem.ActiveInd === "Y") {
                        $scope.DashBoardAccess.summaryAllDoctorsAccess = true;
                    }
                    if (citem.AccessRightId === 88 && citem.ActiveInd === "Y") {
                        $scope.DashBoardAccess.summaryRevenueBlocksAccess = true;
                    }
                    if (citem.AccessRightId === 89 && citem.ActiveInd === "Y") {
                        $scope.DashBoardAccess.reportsScreensAccess = true;
                    }
                    if (citem.AccessRightId === 90 && citem.ActiveInd === "Y") {
                        $scope.DashBoardAccess.revenueReportsAccess = true;
                    }

                    if (citem.AccessRightId === 91 && citem.ActiveInd === "Y") {
                        $scope.DashBoardAccess.reveueCountReportAccess = true;
                    }
                    if (citem.AccessRightId === 92 && citem.ActiveInd === "Y") {
                        $scope.DashBoardAccess.exclusiveReportAccess = true;
                    }
                    if (citem.AccessRightId === 142 && citem.ActiveInd === "Y") {
                        $scope.DashBoardAccess.AdditionalReportAccess = true;
                    }
                    if (citem.AccessRightId === 143 && citem.ActiveInd === "Y") {
                        $scope.DashBoardAccess.summaryScreensAccess = true;
                    }
                });
            }
        });
    }





    //$timeout(function () {
    //    $scope.getChatDetails();
    //}, 200);

    function OnGetDoctorSuccess(data) {
        $scope.hospitalDetails = [];


        angular.forEach(data, function (i) {
            $scope.hospitalDetails.push(i);
            $scope.HospitalIdsList.push(i.HospitalInfo.HospitalDetails.HospitalID);
        });





        $scope.hospitalDetails = $scope.hospitalDetails.filter(function (item, pos) { return $scope.hospitalDetails.indexOf(item) === pos; });




        if (!$scope.DashBoardAccess.summaryAllBranchesAccess) {

            if (doctorinfo !== null && doctorinfo.doctordata !== null) {
                if (doctorinfo.doctordata.UserAddress !== null) {
                    var appListdoctoraddress = doctorinfo.doctordata.UserAddress;

                    var TemphospitalDetails = angular.copy($scope.hospitalDetails);

                    $scope.hospitalDetails = [];

                    angular.forEach(appListdoctoraddress, function (iterator, ind) {
                        if (iterator.Active === "Y") {
                            var Index = TemphospitalDetails.findIndex(record => record.HospitalInfo.HospitalDetails.HospitalID === iterator.ExtDetails.HospitalID);
                            if (Index > -1) {
                                $scope.hospitalDetails.push(TemphospitalDetails[Index]);
                            }
                        }
                    });
                }
            }
        }


        $scope.SelectedHospital = $filter("filter")($scope.hospitalDetails, function (item, index) { return item.HospitalInfo.HospitalDetails.HospitalID === $scope.hospitalid1; })[0];

        $scope.SelectedHospitalIdsList = [];
        /// $scope.clinicDoctorList = $scope.SelectedHospital.DoctorDetails;
        $scope.clinicDoctorAllList = $scope.SelectedHospital.DoctorDetails;
        $scope.clinicDoctorList = $filter("filter")($scope.clinicDoctorAllList, function (item) {
            return item.RoleId === 1 || item.RoleId === 3 || item.RoleId === 4 || item.RoleId === 43 || item.RoleId === 56 || item.RoleId === 57;
        });
        $scope.SelectedHospitalIdsList.push($scope.SelectedHospital.HospitalInfo.HospitalDetails.HospitalID);
        $scope.GetAllIndicator = 0;
        //$scope.GetMainDashBoardDetails($scope.SelectedHospitalIdsList, 0, $scope.SubOrganizationIdsList, $scope.SubDepartmentIdsList);
    }

    $scope.getDoctorInfoByHospitalId = function (val) {
        console.log("val", val)
        let hospitalIdsList = val
            .filter(hItem => hItem.IsChecked&&hItem.ClinicId != 0)
            .map(item => item.ClinicId)
            .join(',');
        $scope.HospitalIdsList = [];

        if (val === null) {
            $scope.HospitalIdsList = GetAllHospitalIds();
            // $scope.Search.DoctorId = null;
            $scope.GetAllIndicator = 1;
            $scope.clinicDoctorList = [];

        } else {
            $scope.clinicDoctorList = val.DoctorDetails;
            $scope.clinicDoctorList = $filter("filter")($scope.clinicDoctorList, function (item) {
                return item.RoleId === 1 || item.RoleId === 3 || item.RoleId === 4 || item.RoleId === 43 || item.RoleId === 56 || item.RoleId === 57;
            });
            // $scope.HospitalIdsList.push(val.HospitalInfo.HospitalDetails.HospitalID);
            $scope.HospitalIdsList.push(val.ClinicId);
            $scope.GetAllIndicator = 0;
        }


        if ($scope.reportSearch.DoctorId !== undefined && $scope.reportSearch.DoctorId !== null) {
            $scope.GetMainDashBoardDetails(hospitalIdsList, doctorinfo.doctordata.User[0].DoctorID, $scope.SubOrganizationIdsList, $scope.SubDepartmentIdsList);
        } else {
            $scope.GetMainDashBoardDetails(hospitalIdsList, 0, $scope.SubOrganizationIdsList, $scope.SubDepartmentIdsList);
        }

    };


    $scope.changeNewBranch = function (val) {

        $scope.HospitalIdsList = [];

        if (val === null) {
            $scope.HospitalIdsList = GetAllHospitalIds();
            // $scope.Search.DoctorId = null;
            $scope.GetAllIndicator = 1;
            $scope.clinicDoctorList = [];
            if (doctorinfo.doctordata.UserAddress[0].SubOrganizationId) {
                $scope.selectedBranch.SubOrganizationId = doctorinfo.doctordata.UserAddress[0].SubOrganizationId;
            }
            // $scope.GetMainDashBoardDetails($scope.HospitalIdsList, doctorinfo.doctordata.User[0].DoctorID, $scope.SubOrganizationIdsList, $scope.SubDepartmentIdsList);
            GetBranchSubSpecializations($scope.selectedBranch.SubOrganizationId, 0);
        } else {


            $scope.HospitalIdsList.push(val.ClinicId);
            $scope.GetAllIndicator = 0;
            $scope.selectedBranch = val;
            // GetBranchSubSpecializations($scope.selectedBranch.SubOrganizationId, $scope.selectedBranch.BranchId, $scope.SubOrganizationIdsList, $scope.SubDepartmentIdsList);
            GetBranchSubSpecializations($scope.selectedBranch.SubOrganizationId, $scope.selectedBranch.BranchId);
        }


        //if ($scope.reportSearch.DoctorId !== undefined && $scope.reportSearch.DoctorId !== null) {
        //    $scope.GetMainDashBoardDetails($scope.HospitalIdsList, doctorinfo.doctordata.User[0].DoctorID);
        //} else {
        //    $scope.GetMainDashBoardDetails($scope.HospitalIdsList, 0);
        //}

    };

    function GetAllSubOrganizationIds() {
        var ids = [];
        angular.forEach($scope.SubOrganizationList, function (item, index) {
            ids.push(item.SubOrganizationId);
        });
        return ids;
    }

    function GetAllHospitalIds() {
        var ids = [];
        angular.forEach($scope.hospitalDetails, function (item, index) {
            ids.push(item.ClinicId);
        });
        return ids;
    }
    function GetAllDepartmentIds() {
        var ids = [];
        angular.forEach($scope.allSubSpecializationsArray, function (item, index) {
            ids.push(item.SubSpecializationId);
        });
        return ids;
    }

    $scope.changeDoctor = function (selectedDoctor) {
        //$scope.GetMainDashBoardDetails($scope.HospitalIdsList, selectedDoctor === null ? 0 : selectedDoctor.DoctorID);
        //$scope.GetMainDashBoardDetails($scope.SelectedHospitalIdsList, selectedDoctor === null ? 0 : selectedDoctor.DoctorID, $scope.SubOrganizationIdsList, $scope.SubDepartmentIdsList);

    };


    $scope.getMasterSurgeryCategoryList = function () {
        eHnoteSurgeryService.GetMasterSurgerySpecializations(callbacksuccess, callbackerror);
        function callbacksuccess(data) {
            if (data !== undefined) {
                if (data.length > 0) {
                    $scope.masterSurgeryCatergoryList = data;
                    //console.log($scope.masterSurgeryCatergoryList);
                }
            }
        }
        function callbackerror(error) {
            console.log(error);
        }
    }
    $scope.getMasterSurgeryCategoryList();

    $scope.changeDate = function () {
        //$scope.SelectedDoctor = $scope.SelectedDoctor || null;
        //if ($scope.SelectedDoctor !== null) {
        //    if ($scope.SelectedHospital === null) {
        //        $scope.GetMainDashBoardDetails($scope.HospitalIdsList, doctorinfo.doctordata.User[0].DoctorID, $scope.SubOrganizationIdsList, $scope.SubDepartmentIdsList);
        //    } else {
        //        $scope.SelectedHospitalIdsList = [];
        //        $scope.SelectedHospitalIdsList.push($scope.SelectedHospital.ClinicId);
        //        $scope.GetMainDashBoardDetails($scope.SelectedHospitalIdsList, doctorinfo.doctordata.User[0].DoctorID, $scope.SubOrganizationIdsList, $scope.SubDepartmentIdsList);
        //    }

        //}
        //else {
        //    $scope.SelectedHospital = $scope.SelectedHospital || null;
        //    if ($scope.SelectedHospital === null) {
        //        $scope.GetMainDashBoardDetails($scope.HospitalIdsList, 0, $scope.SubOrganizationIdsList, $scope.SubDepartmentIdsList);
        //    } else {
        //        $scope.SelectedHospitalIdsList = [];
        //        $scope.SelectedHospitalIdsList.push($scope.SelectedHospital.ClinicId);
        //        $scope.GetMainDashBoardDetails($scope.SelectedHospitalIdsList, 0, $scope.SubOrganizationIdsList, $scope.SubDepartmentIdsList);
        //    }

        //}

    };
    if (doctorinfo.doctordata.UserSetting !== undefined) {
        if (doctorinfo.doctordata.UserSetting.CurrencyCode !== undefined) {
            $scope.currencyType = doctorinfo.doctordata.UserSetting.CurrencyCode;
        } else {
            $scope.currencyType = "INR";
        }
    }
    $scope.isUserHavingAccess = doctorinfo.isUserHavingAccess;
    $scope.patientVisitStatus = true;

    $scope.appointmentStatusview = true;

    $scope.maxSize = 10;
    function isInteger(x) {
        return x % 1 === 0;
    }
    $scope.currentPage = 1;
    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.showDashBordDetailsDiv = false;
    $scope.ShowApptStatusDiv = false;

    $scope.viewtype = '';
    $scope.modeType = 0;
/* It is only works on IOJ production*/
    $scope.isShowSpeciality = false;
    if (window.location.origin === "https://ioj.ehnote.com" ||window.location.origin === "https://insts.ehnote.com") {
        $scope.isShowSpeciality = true;
    }
/*---------------------------------------*/




    $scope.getDashboardDetailInfo = function (type, exportType, date, modeType, data) {
        $scope.modeType = modeType;
        $scope.viewtype = type;
        var hospitalIdsList = $scope.ApptBranchLocations
            .filter(mitem => mitem.IsChecked && mitem.ClinicId !== 0)
            .map(mitem => mitem.ClinicId)
            .join(',');
        /* $scope.GetDataOnMainDashBoardObj.VisitTypeId = null;*/
        if (type !== "PlanedReschedule" && type !== "LastMinReschedule" && type !== "CheckinReschedule") {
            $scope.ShowApptStatusDiv = true;
        } else {
            $scope.ShowApptStatusDiv = false;
        }
        if (exportType !== "export") {
            $scope.showDashBordDetailsDiv = true;
            $scope.currentPage = 1;
            $scope.currencyType = 'INR';
            $scope.pagination.currentPage = 1;

            angular.forEach($scope.appointmentTypes, function (item) {
                item.isChecked = true;
            });

            $scope.AllDoctorsObj.AllAppointmentTypeStatusCheck = true;
            $scope.AllDoctorsObj.selectVisitType = "All";

            var filteredVisitReasons = angular.copy($scope.AllVisitreasons);
            $scope.Visitreasons = angular.copy($scope.AllVisitreasons);

            angular.forEach($scope.Visitreasons, function (item) {
                item.isChecked = true;
            });

            $scope.AllDoctorsObj.AllVisitReasonsCheck = true;
            $scope.AllDoctorsObj.selectedVisitReason = "All";

            angular.forEach($scope.confirmationStatusArray, function (item) {
                item.IsChecked = true;
            });

            $scope.StatusListObj.AllStatusCheck = true;
            $scope.StatusListObj.SelectStatusString = "All";

            //Booking Type

            angular.forEach($scope.BookingTypesArray, function (item) {
                item.IsChecked = true;
            });
            $scope.BookedTypeObj.SelectStatusString = 'All';
            $scope.BookedTypeObj.AllStatusCheck = true;

            //Booking Status

            angular.forEach($scope.BookedstatusFilterList, function (item) {
                item.IsChecked = true;
            });
            $scope.BookedStatusListObj.AllStatusCheck = true;
            $scope.BookedStatusListObj.SelectStatusString = 'All';

        }
        switch (type) {
            case 'AllAppointments':
                getAllTotalAppointmentsDetails(hospitalIdsList, exportType);
                break;
            case 'CancelledAppointments':
                getAllCancelAppointmentsDetails(1, exportType);
                break;
            case 'RescheduleAppointments':
                getRescheduleAppointments(hospitalIdsList, exportType);
                break;
            case 'ASCAppointments':
                if (exportType !== "export") {
                    filteredVisitReasons = $filter('filter')($scope.AllVisitreasons, { 'VisitTypeId': 4 }, true);
                    $scope.Visitreasons = angular.copy(filteredVisitReasons);
                }

                getAscAppointmentsDeatils(hospitalIdsList, exportType);
                break;
            case 'NewAppointmentsDashBoard':
                filteredVisitReasons = $filter('filter')($scope.AllVisitreasons, { 'VisitTypeId': 1 }, true);
               /* $scope.NewApptVisitReasonsList = $filter("filter")(filteredVisitReasons, function (item) {
                    return item.ReasonId === 81 || item.ReasonId === 42 || item.ReasonId === 19 || item.ReasonId == 119;
                });
                $scope.Visitreasons = angular.copy($scope.NewApptVisitReasonsList);*/
                if ($scope.isShowSpeciality) {
                    $scope.NewApptVisitReasonsList = $filter("filter")(filteredVisitReasons, function (item) {
                        return item.ReasonId === 81 || item.ReasonId === 42 || item.ReasonId === 19 || item.ReasonId === 119;
                    });
                    $scope.Visitreasons = angular.copy($scope.NewApptVisitReasonsList);
                } else {
                    $scope.Visitreasons = filteredVisitReasons;
                }
                getNewAppointmentDetails(hospitalIdsList, exportType);
                break;
            case 'ClinicfollowupAppointments':
                filteredVisitReasons = $filter('filter')($scope.AllVisitreasons, { 'VisitTypeId': 2 }, true);
                $scope.Visitreasons = angular.copy(filteredVisitReasons);

                getClinicfollowupAppointments(hospitalIdsList, exportType);
                break;
            case 'CoordinatorAppointments':
                filteredVisitReasons = $filter('filter')($scope.AllVisitreasons, { 'VisitTypeId': 8 }, true);
                $scope.Visitreasons = angular.copy(filteredVisitReasons);

                getCoordinatorAppointments(hospitalIdsList, exportType);
                break;
            case 'PostOpfollowupAppointments':
                filteredVisitReasons = $filter('filter')($scope.AllVisitreasons, { 'VisitTypeId': 3 }, true);
                $scope.Visitreasons = angular.copy(filteredVisitReasons);

                getPostOpfollowupAppointments(hospitalIdsList, exportType);
                break;
            case 'PreOpAppointments':
                filteredVisitReasons = $filter('filter')($scope.AllVisitreasons, { 'VisitTypeId': 6 }, true);
                $scope.Visitreasons = angular.copy(filteredVisitReasons);

                getPreOpAppointments(hospitalIdsList, exportType);
                break;
            case 'PreadmissionAppointments':
                filteredVisitReasons = $filter('filter')($scope.AllVisitreasons, { 'VisitTypeId': 7 }, true);
                $scope.Visitreasons = angular.copy(filteredVisitReasons);

                getPreadmissionAppointment(hospitalIdsList, exportType);
                break;
            case 'TechnicianAppointments':
                filteredVisitReasons = $filter('filter')($scope.AllVisitreasons, { 'VisitTypeId': 5 }, true);
                $scope.Visitreasons = angular.copy(filteredVisitReasons);

                getTechnicianAppointments(hospitalIdsList, exportType);
                break;
            case 'Revenue':
                $scope.getRevenueDetails(1, exportType);
                break;
            case 'SurgeryTotalRevenue':
                $scope.getSurgeryRevenueDetails(1, exportType);
                break;
            case 'OutStanding':
                getOutstandingDetails(1, exportType);
                break;
            case 'PatientVisits':
                getPatientVisitDetails(1, exportType);
                break;
            case 'PaidFollowupAppointments':
                getPaidFollowupAppointments(1, exportType);
                break;
            case 'AppointmentStats':
                getAppointmentDetails(1, exportType);
                break;
            case 'PatientDetails':
                getPatientDetails(1, exportType);
                break;
            case 'TreatmentRevenue':
                getTreatmentDetails(1, exportType);
                break;
            case 'Labreport':
                getLabDetails(1, exportType);
                break;
            case 'BalanceSheet':
                getBranchwiseDetails(1, exportType);
                break;
            case 'ReferralReport':
                getReferrlReportDetails(1, exportType);
                break;
            case 'DiagnosisReport':
                getDiagnosisReportDetails(1, exportType);
                break;
            case 'SurgeryReport':
                getSurgeryReportDetails(1, exportType);
                break;
            case 'MissedAppointments':
                getMissedAppointmentsReportDetails(1, exportType);
                break;
            case 'RevenueDetail':
                $scope.getPaymentDetails(1, exportType, date, $scope.modeType, data);
                break;
            case 'SurgeryRevenueDetail':
                $scope.getSurgeryPaymentDetails(1, exportType, date, $scope.modeType, data);
                break;
            case 'FollowupAppointmentStats':
                getFollowupAppointmentDetails(1, exportType);
                break;
            case 'OldAppointmentStats':
                getOldAppointmentDetails(1, exportType);
                break;
            case 'SurgeryAppointmentStats':
                getSurgeryAppointmentDetails(1, exportType);
                break;
            case 'PharmacySale':
                getPharmacySaleDetails(1, exportType);
                break;
            case 'OpticalSale':
                getOpticalSaleDetails(1, exportType);
                break;
            case 'WalkinAppointmentsDashBoard':
                getWalkinApptDetails(hospitalIdsList, exportType);
                break;
            case 'CancelledAppointmentsDetails':
                getCancelledApptDetails(hospitalIdsList, exportType);
                break;
            case 'NoShowAppointmentDetails':
                getNoShowApptDetails(hospitalIdsList, exportType);
                break;
            case 'SameDayCancelledAppointmentsDetails':
                GetSameDayCancelAppointmentDetails(hospitalIdsList, exportType);
                break;
            case 'SeenAppointmentsDashBoard':
                GetSeenAppointmentDetails(hospitalIdsList, exportType);
                break;
            case 'SameDayCheckedInCancelledAppointmentsDetails':
                GetSameDayCheckedInCancelledAppointmentDetails(hospitalIdsList, exportType);
                break;
            case 'SeenNewAppointmentsDashBoard':
                filteredVisitReasons = $filter('filter')($scope.AllVisitreasons, { 'VisitTypeId': 1 }, true);
                if ($scope.isShowSpeciality) {
                    $scope.NewApptVisitReasonsList = $filter("filter")(filteredVisitReasons, function (item) {
                        return item.ReasonId === 81 || item.ReasonId === 42 || item.ReasonId === 19 || item.ReasonId === 119;
                    });
                    $scope.Visitreasons = angular.copy($scope.NewApptVisitReasonsList);
                } else {
                    $scope.Visitreasons = filteredVisitReasons;
                }
                GetSeenNewAppointmentDetails(hospitalIdsList, exportType);
                break;

            case 'ActiveAppointments':               
                getActiveAppointmentsDetails(hospitalIdsList, exportType);
                break;
            case 'PlanedReschedule':                
                GetPlanedRescheduleAppointmentDetails(hospitalIdsList, exportType);
                break;
            case 'LastMinReschedule':                
                GetLastMinRescheduleAppointmentDetails(hospitalIdsList, exportType);
                break;

            case 'CheckinReschedule':               
                GetCheckinRescheduleAppointmentDetails(hospitalIdsList, exportType);
                break;
            case 'waitingAppointments':
                GetwaitingAppointmentsDetails(hospitalIdsList, exportType);
                break;
            //case 'saleDetail':
            //    $scope.getPaymentDetails1(1, exportType, date, $scope.modeType, data);
            //    break;

        }
    };

    $scope.pagination = { currentPage: 1 };
    $scope.outstandingData = { "Outstanding": [], "count": 0 };
    function getOutstandingDetails(pageno, reportType) {
        var params = {
            "DoctorId": $scope.SelectedDoctor === undefined || $scope.SelectedDoctor === null ? 0 : $scope.SelectedDoctor.DoctorID,
            "DashboardType": 'OutStanding',
            "HospitalID": $scope.SelectedHospital === undefined || $scope.SelectedHospital === null ? doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID : $scope.SelectedHospital.ClinicId,
            "StartDate": $scope.dashboard_StartDate,
            "EndDate": $scope.dashboard_EndDate,
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNo": pageno,
            "GetAllIndicator": $scope.GetAllIndicator,
            "SubOrganizationId": $scope.SelectedSubOrganization === undefined || $scope.SelectedSubOrganization === null ? 0 : $scope.SelectedSubOrganization.SubOrganizationId,
            "DepartmentId": $scope.SelectedDepartment === undefined || $scope.SelectedDepartment === null ? 0 : $scope.SelectedDepartment.SubSpecializationId
        };

        eHnoteMainDashboardDataServices.getMainDashboardDetailInfo(params).then(function (resp) {
            //$scope.outstandingData.Outstanding = [];
            //$scope.outstandingData.count = 0;
            if (reportType === 'export') {
                resp.data.Outstanding = resp.data.Outstanding || [];
                generateTable(resp.data.Outstanding, $scope.viewtype);
            } else {
                $scope.outstandingData.Outstanding = [];
                $scope.outstandingData.count = 0;
                if (resp.data.count === 0) {
                    $scope.outstandingData.Outstanding = [];
                    $scope.outstandingData.count = 0;
                } else {
                    $scope.outstandingData = resp.data;
                    //$scope.exportMaxSize = $scope.outstandingData.count;
                    $scope.pagewisetotal = 0;
                    for (var i = 0; i < $scope.outstandingData.Outstanding.length; i++) {
                        var product = $scope.outstandingData.Outstanding[i];
                        $scope.pagewisetotal += (product.outstanding);
                    }

                }

            }

        }, function (err) {
            console.log(err);
            alertify.error(err.data.Message);
        });
    }


    $scope.revenueData = {
        "Revenue": [],
        "count": 0
    };
    $scope.getRevenueDetails = function (pageno, reportType) {
        var params = {
            "DoctorId": $scope.SelectedDoctor === undefined || $scope.SelectedDoctor === null ? 0 : $scope.SelectedDoctor.DoctorID,
            "DashboardType": 'REVENUE',
            "HospitalID": $scope.SelectedHospital === undefined || $scope.SelectedHospital === null ? doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID : $scope.SelectedHospital.ClinicId,
            "StartDate": $scope.dashboard_StartDate,
            "EndDate": $scope.dashboard_EndDate,
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNo": pageno,
            "GetAllIndicator": $scope.GetAllIndicator,
            "SubOrganizationId": $scope.SelectedSubOrganization === undefined || $scope.SelectedSubOrganization === null ? 0 : $scope.SelectedSubOrganization.SubOrganizationId,
            "DepartmentId": $scope.SelectedDepartment === undefined || $scope.SelectedDepartment === null ? 0 : $scope.SelectedDepartment.SubSpecializationId
        };
        eHnoteMainDashboardDataServices.getMainDashboardDetailInfo(params).then(function (resp) {
            if (reportType === 'export') {
                resp.data.Revenue = resp.data.Revenue || [];
                generateTable(resp.data.Revenue, $scope.viewtype);
            } else {
                $scope.revenueData.Revenue = [];
                $scope.revenueData.count = 0;
                if (resp.data.count === 0) {
                    $scope.revenueData.Revenue = [];
                    $scope.revenueData.count = 0;
                } else {
                    $scope.revenueData = resp.data;
                    //$scope.exportMaxSize = $scope.revenueData.count;
                    $scope.pagewisetotal = 0;
                    //for (var i = 0; i < $scope.revenueData.Revenue.length; i++) {
                    //    var product = $scope.revenueData.Revenue[i];
                    //    $scope.pagewisetotal += (product.TotalRevenue);
                    //}
                    angular.forEach($scope.revenueData.Revenue, function (item, index) {
                        item.revenueitem = {};
                        item.revenueitem.RevenueDetail = [];
                        item.maxSize = 0;
                    });
                }
            }
        }, function (err) {
            console.log(err);
            alertify.error(err.data.Message);
        });
    };

    //start surgeryrevenue
    $scope.SurgeryRevenueData = {
        "SurgeryRevenue": [],
        "count": 0
    };
    $scope.getSurgeryRevenueDetails = function (pageno, reportType) {
        var params = {
            "DoctorId": $scope.SelectedDoctor === undefined || $scope.SelectedDoctor === null ? 0 : $scope.SelectedDoctor.DoctorID,
            "HospitalID": $scope.SelectedHospital === undefined || $scope.SelectedHospital === null ? doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID : $scope.SelectedHospital.ClinicId,
            "StartDate": $scope.dashboard_StartDate,
            "EndDate": $scope.dashboard_EndDate,
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNo": pageno,
            "DashboardType": 'Surgery Revenue',
            // "DashboardType": 'SurgeryRevenue',
            "GetAllIndicator": $scope.GetAllIndicator
        };
        eHnoteMainDashboardDataServices.getMainDashboardDetailInfo(params).then(function (resp) {
            if (reportType === 'export') {
                resp.data.Revenue = resp.data.SurgeryRevenue || [];
                generateTable(resp.data.Revenue, $scope.viewtype);
                $scope.SurgeryRevenueData.SurgeryRevenue = resp.data.SurgeryRevenue || [];
            } else {
                $scope.SurgeryRevenueData.SurgeryRevenue = resp.data.SurgeryRevenue || [];
                $scope.SurgeryRevenueData.count = resp.data.count;

            }
        }, function (err) {
            console.log(err);
            alertify.error(err.data.Message);
        });
    };
    //end

    $scope.patientVisitData = {
        "PatientVisits": [],
        "count": 0
    };
    function getPatientVisitDetails(pageno, reportType) {


        var params = {
            "DoctorId": $scope.SelectedDoctor === undefined || $scope.SelectedDoctor === null ? 0 : $scope.SelectedDoctor.DoctorID,
            "DashboardType": 'PatientVisits',
            "HospitalID": $scope.SelectedHospital === undefined || $scope.SelectedHospital === null ? doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID : $scope.SelectedHospital.ClinicId,
            "StartDate": $scope.dashboard_StartDate,
            "EndDate": $scope.dashboard_EndDate,
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNo": pageno,
            "GetAllIndicator": $scope.GetAllIndicator
        };



        eHnoteMainDashboardDataServices.getMainDashboardDetailInfo(params).then(function (resp) {
            //$scope.patientVisitData.PatientVisits = [];
            //$scope.patientVisitData.count = 0;
            if (reportType === 'export') {
                resp.data.PatientVisits = resp.data.PatientVisits || [];
                generateTable(resp.data.PatientVisits, $scope.viewtype);
            } else {
                $scope.patientVisitData.PatientVisits = [];
                $scope.patientVisitData.count = 0;
                if (resp.data.count === 0) {
                    $scope.patientVisitData.PatientVisits = [];
                    $scope.patientVisitData.count = 0;
                } else {
                    $scope.patientVisitData = resp.data;
                    //$scope.exportMaxSize = $scope.patientVisitData.count;
                }

            }

        }, function (err) {
            console.log(err);
            alertify.error(err.data.Message);
        });
    }


    $scope.PaidFollowupAppointmentsData = {
        "PaidFollowupAppointments": [],
        "count": 0
    };
    function getPaidFollowupAppointments(pageno, reportType) {


        var params = {
            "DoctorId": $scope.SelectedDoctor === undefined || $scope.SelectedDoctor === null ? 0 : $scope.SelectedDoctor.DoctorID,
            "DashboardType": 'PaidFollowupAppointments',
            "HospitalID": $scope.SelectedHospital === undefined || $scope.SelectedHospital === null ? doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID : $scope.SelectedHospital.ClinicId,
            "StartDate": $scope.dashboard_StartDate,
            "EndDate": $scope.dashboard_EndDate,
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNo": pageno,
            "GetAllIndicator": $scope.GetAllIndicator,
            "SubOrganizationId": $scope.SelectedSubOrganization === undefined || $scope.SelectedSubOrganization === null ? 0 : $scope.SelectedSubOrganization.SubOrganizationId,
            "DepartmentId": $scope.SelectedDepartment === undefined || $scope.SelectedDepartment === null ? 0 : $scope.SelectedDepartment.SubSpecializationId
        };



        eHnoteMainDashboardDataServices.getMainDashboardDetailInfo(params).then(function (resp) {
            //$scope.patientVisitData.PatientVisits = [];
            //$scope.patientVisitData.count = 0;
            if (reportType === 'export') {
                resp.data.PaidFollowupAppointments = resp.data.PaidFollowupAppointments || [];
                generateTable(resp.data.PaidFollowupAppointments, $scope.viewtype);
            } else {
                $scope.PaidFollowupAppointmentsData.PaidFollowupAppointments = [];
                $scope.PaidFollowupAppointmentsData.count = 0;
                if (resp.data.count === 0) {
                    $scope.PaidFollowupAppointmentsData.PaidFollowupAppointments = [];
                    $scope.PaidFollowupAppointmentsData.count = 0;
                } else {
                    $scope.PaidFollowupAppointmentsData = resp.data;
                    //$scope.exportMaxSize = $scope.PaidFollowupAppointmentsData.count;
                }

            }

        }, function (err) {
            console.log(err);
            alertify.error(err.data.Message);
        });
    }


    $scope.appointmentData = {
        "AppointmentStats": [],
        "count": 0
    };
    function getAppointmentDetails(pageno, reportType) {

        var params = {
            "DoctorId": $scope.SelectedDoctor === undefined || $scope.SelectedDoctor === null ? 0 : $scope.SelectedDoctor.DoctorID,
            "DashboardType": 'AppointmentStats',
            "HospitalID": $scope.SelectedHospital === undefined || $scope.SelectedHospital === null ? doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID : $scope.SelectedHospital.ClinicId,
            "StartDate": $scope.dashboard_StartDate,
            "EndDate": $scope.dashboard_EndDate,
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNo": pageno,
            "GetAllIndicator": $scope.GetAllIndicator,
            "SubOrganizationId": $scope.SelectedSubOrganization === undefined || $scope.SelectedSubOrganization === null ? 0 : $scope.SelectedSubOrganization.SubOrganizationId,
            "DepartmentId": $scope.SelectedDepartment === undefined || $scope.SelectedDepartment === null ? 0 : $scope.SelectedDepartment.SubSpecializationId
        };

        eHnoteMainDashboardDataServices.getMainDashboardDetailInfo(params).then(function (resp) {
            //$scope.appointmentData.AppointmentStats = [];
            //$scope.appointmentData.count = 0;
            if (reportType === 'export') {
                resp.data.AppointmentStats = resp.data.AppointmentStats || [];
                generateTable(resp.data.AppointmentStats, $scope.viewtype);
            } else {
                $scope.appointmentData.AppointmentStats = [];
                $scope.appointmentData.count = 0;
                if (resp.data.count === 0) {
                    $scope.appointmentData.AppointmentStats = [];
                    $scope.appointmentData.count = 0;
                } else {
                    $scope.appointmentData = resp.data;
                    //$scope.appointmentData.AppointmentStats.forEach(function (element) {
                    //    element.appointmentTime = moment.utc(moment(element.AppointmentEndTime, "HH:mm:ss").diff(moment(element.AppointmentStartTime, "HH:mm:ss"))).format('HH:mm');
                    //});
                    //$scope.exportMaxSize = $scope.appointmentData.count;
                }


            }

        }, function (err) {
            console.log(err);
            alertify.error(err.data.Message);
        });
    }
    $scope.ReferrlReportData = {
        "ReferrlReport": [],
        "count": 0
    };
    function getReferrlReportDetails(pageno, reportType) {

        var params = {
            "DoctorId": $scope.SelectedDoctor === undefined || $scope.SelectedDoctor === null ? 0 : $scope.SelectedDoctor.DoctorID,
            "DashboardType": 'ReferralReport',
            "HospitalID": $scope.SelectedHospital === undefined || $scope.SelectedHospital === null ? doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID : $scope.SelectedHospital.ClinicId,
            "StartDate": $scope.dashboard_StartDate,
            "EndDate": $scope.dashboard_EndDate,
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNo": pageno,
            "GetAllIndicator": $scope.GetAllIndicator,
            "SubOrganizationId": $scope.SelectedSubOrganization === undefined || $scope.SelectedSubOrganization === null ? 0 : $scope.SelectedSubOrganization.SubOrganizationId,
            "DepartmentId": $scope.SelectedDepartment === undefined || $scope.SelectedDepartment === null ? 0 : $scope.SelectedDepartment.SubSpecializationId
        };

        eHnoteMainDashboardDataServices.getMainDashboardDetailInfo(params).then(function (resp) {
            //$scope.appointmentData.AppointmentStats = [];
            //$scope.appointmentData.count = 0;
            if (reportType === 'export') {
                resp.data.ReferrlReport = resp.data.ReferrlReport || [];
                generateTable(resp.data.ReferrlReport, $scope.viewtype);

            } else {
                $scope.ReferrlReportData.ReferrlReport = [];
                $scope.ReferrlReportData.count = 0;
                if (resp.data.count === 0) {
                    $scope.ReferrlReportData.ReferrlReport = [];
                    $scope.ReferrlReportData.count = 0;
                } else {
                    $scope.ReferrlReportData = resp.data;
                    //$scope.appointmentData.AppointmentStats.forEach(function (element) {
                    //    element.appointmentTime = moment.utc(moment(element.AppointmentEndTime, "HH:mm:ss").diff(moment(element.AppointmentStartTime, "HH:mm:ss"))).format('HH:mm');
                    //});
                    //$scope.exportMaxSize = $scope.ReferrlReportData.count;
                }


            }

        }, function (err) {
            console.log(err);
            alertify.error(err.data.Message);
        });
    }
    $scope.DiagnosisReportData = {
        "DiagnosisReport": [],
        "count": 0
    };
    function getDiagnosisReportDetails(pageno, reportType) {

        var params = {
            "DoctorId": $scope.SelectedDoctor === undefined || $scope.SelectedDoctor === null ? 0 : $scope.SelectedDoctor.DoctorID,
            "DashboardType": 'DiagnosisReport',
            "HospitalID": $scope.SelectedHospital === undefined || $scope.SelectedHospital === null ? doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID : $scope.SelectedHospital.ClinicId,
            "StartDate": $scope.dashboard_StartDate,
            "EndDate": $scope.dashboard_EndDate,
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNo": pageno,
            "GetAllIndicator": $scope.GetAllIndicator,
            "SpecializationId": doctorinfo.doctordata.User[0].SpecializationId,
            "SubOrganizationId": $scope.SelectedSubOrganization === undefined || $scope.SelectedSubOrganization === null ? 0 : $scope.SelectedSubOrganization.SubOrganizationId,
            "DepartmentId": $scope.SelectedDepartment === undefined || $scope.SelectedDepartment === null ? 0 : $scope.SelectedDepartment.SubSpecializationId
        };

        eHnoteMainDashboardDataServices.getMainDashboardDetailInfo(params).then(function (resp) {
            //$scope.appointmentData.AppointmentStats = [];
            //$scope.appointmentData.count = 0;
            if (reportType === 'export') {
                resp.data.DiagnosisReport = resp.data.DiagnosisReport || [];
                generateTable(resp.data.DiagnosisReport, $scope.viewtype);
            } else {
                $scope.DiagnosisReportData.DiagnosisReport = [];
                $scope.DiagnosisReportData.count = 0;
                if (resp.data.count === 0) {
                    $scope.DiagnosisReportData.DiagnosisReport = [];
                    $scope.DiagnosisReportData.count = 0;
                } else {
                    $scope.DiagnosisReportData = resp.data;
                    //$scope.appointmentData.AppointmentStats.forEach(function (element) {
                    //    element.appointmentTime = moment.utc(moment(element.AppointmentEndTime, "HH:mm:ss").diff(moment(element.AppointmentStartTime, "HH:mm:ss"))).format('HH:mm');
                    //});
                    //$scope.exportMaxSize = $scope.DiagnosisReportData.count;
                }


            }

        }, function (err) {
            console.log(err);
            alertify.error(err.data.Message);
        });
    }

    $scope.SurgeryReportData = {
        "SurgeryReport": [],
        "count": 0
    };
    function getSurgeryReportDetails(pageno, reportType) {

        var params = {
            "DoctorId": $scope.SelectedDoctor === undefined || $scope.SelectedDoctor === null ? 0 : $scope.SelectedDoctor.DoctorID,
            "DashboardType": 'SurgeryReport',
            "HospitalID": $scope.SelectedHospital === undefined || $scope.SelectedHospital === null ? doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID : $scope.SelectedHospital.ClinicId,
            "StartDate": $scope.dashboard_StartDate,
            "EndDate": $scope.dashboard_EndDate,
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNo": pageno,
            "GetAllIndicator": $scope.GetAllIndicator,
            "SpecializationId": doctorinfo.doctordata.User[0].SpecializationId
        };

        eHnoteMainDashboardDataServices.getMainDashboardDetailInfo(params).then(function (resp) {
            //$scope.appointmentData.AppointmentStats = [];
            //$scope.appointmentData.count = 0;
            if (reportType === 'export') {
                resp.data.SurgeryReport = resp.data.SurgeryReport || [];
                generateTable(resp.data.SurgeryReport, $scope.viewtype);
            } else {
                $scope.SurgeryReportData.SurgeryReport = [];
                $scope.SurgeryReportData.count = 0;
                if (resp.data.count === 0) {
                    $scope.SurgeryReportData.SurgeryReport = [];
                    $scope.SurgeryReportData.count = 0;
                } else {
                    $scope.SurgeryReportData = resp.data;
                    //$scope.appointmentData.AppointmentStats.forEach(function (element) {
                    //    element.appointmentTime = moment.utc(moment(element.AppointmentEndTime, "HH:mm:ss").diff(moment(element.AppointmentStartTime, "HH:mm:ss"))).format('HH:mm');
                    //});
                    //$scope.exportMaxSize = $scope.SurgeryReportData.count;
                }


            }

        }, function (err) {
            console.log(err);
            alertify.error(err.data.Message);
        });
    }

    $scope.MissedAppointmentstData = {
        "MissedAppointments": [],
        "count": 0
    };

    function getMissedAppointmentsReportDetails(pageno, reportType) {

        var params = {
            "DoctorId": $scope.SelectedDoctor === undefined || $scope.SelectedDoctor === null ? 0 : $scope.SelectedDoctor.DoctorID,
            "DashboardType": 'MissedAppointments',
            "HospitalID": $scope.SelectedHospital === undefined || $scope.SelectedHospital === null ? doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID : $scope.SelectedHospital.ClinicId,
            "StartDate": $scope.dashboard_StartDate,
            "EndDate": $scope.dashboard_EndDate,
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNo": pageno,
            "GetAllIndicator": $scope.GetAllIndicator,
            "SpecializationId": doctorinfo.doctordata.User[0].SpecializationId,
            "SubOrganizationId": $scope.SelectedSubOrganization === undefined || $scope.SelectedSubOrganization === null ? 0 : $scope.SelectedSubOrganization.SubOrganizationId,
            "DepartmentId": $scope.SelectedDepartment === undefined || $scope.SelectedDepartment === null ? 0 : $scope.SelectedDepartment.SubSpecializationId
        };

        eHnoteMainDashboardDataServices.getMainDashboardDetailInfo(params).then(function (resp) {
            //$scope.appointmentData.AppointmentStats = [];
            //$scope.appointmentData.count = 0;
            if (reportType === 'export') {

                resp.data.MissedAppointments = resp.data.MissedAppointments || [];
                generateTable(resp.data.MissedAppointments, $scope.viewtype);
            } else {
                $scope.MissedAppointmentstData.MissedAppointments = [];
                $scope.MissedAppointmentstData.count = 0;
                if (resp.data.count === 0) {
                    $scope.MissedAppointmentstData.MissedAppointments = [];
                    $scope.MissedAppointmentstData.count = 0;
                } else {
                    $scope.MissedAppointmentstData = resp.data;
                    //$scope.appointmentData.AppointmentStats.forEach(function (element) {
                    //    element.appointmentTime = moment.utc(moment(element.AppointmentEndTime, "HH:mm:ss").diff(moment(element.AppointmentStartTime, "HH:mm:ss"))).format('HH:mm');
                    //});
                    //$scope.exportMaxSize = $scope.MissedAppointmentstData.count;
                }


            }

        }, function (err) {
            console.log(err);
            alertify.error(err.data.Message);
        });
    }



    $scope.patientData = {
        "PatientDetails": [],
        "count": 0
    };
    function getPatientDetails(pageno, reportType) {

        var params = {
            "DoctorId": $scope.SelectedDoctor === undefined || $scope.SelectedDoctor === null ? 0 : $scope.SelectedDoctor.DoctorID,
            "DashboardType": 'PatientDetails',
            "HospitalID": $scope.SelectedHospital === undefined || $scope.SelectedHospital === null ? doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID : $scope.SelectedHospital.ClinicId,
            "StartDate": $scope.dashboard_StartDate,
            "EndDate": $scope.dashboard_EndDate,
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNo": pageno,
            "GetAllIndicator": $scope.GetAllIndicator
        };

        eHnoteMainDashboardDataServices.getMainDashboardDetailInfo(params).then(function (resp) {
            //$scope.patientData.PatientDetails = [];
            //$scope.patientData.count = 0;
            if (reportType === 'export') {
                generateTable(resp.data.PatientDetails, $scope.viewtype);
            } else {
                $scope.patientData.PatientDetails = [];
                $scope.patientData.count = 0;
                if (resp.data.count === 0) {
                    $scope.patientData.PatientDetails = [];
                    $scope.patientData.count = 0;
                } else {
                    $scope.patientData = resp.data;
                    //$scope.exportMaxSize = $scope.patientData.count;
                }
            }

        }, function (err) {
            console.log(err);
            alertify.error(err.data.Message);
        });
    }

    $scope.treatmentRevenueData = {
        "TreatmentRevenue": [],
        "count": 0
    };
    function getTreatmentDetails(pageno, reportType) {

        var params = {
            "DoctorId": $scope.SelectedDoctor === undefined || $scope.SelectedDoctor === null ? 0 : $scope.SelectedDoctor.DoctorID,
            "DashboardType": 'TreatmentRevenue',
            "HospitalID": $scope.SelectedHospital === undefined || $scope.SelectedHospital === null ? doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID : $scope.SelectedHospital.ClinicId,
            "StartDate": $scope.dashboard_StartDate,
            "EndDate": $scope.dashboard_EndDate,
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNo": pageno,
            "GetAllIndicator": $scope.GetAllIndicator
        };

        eHnoteMainDashboardDataServices.getMainDashboardDetailInfo(params).then(function (resp) {
            //$scope.treatmentRevenueData.TreatmentRevenue = [];
            //$scope.treatmentRevenueData.count = 0;
            if (reportType === 'export') {

                resp.data.TreatmentRevenue = resp.data.TreatmentRevenue || [];
                angular.forEach(resp.data.TreatmentRevenue, function (item) {
                    item.PatientGSTNo = item.PatientGSTNo ? item.PatientGSTNo : '';
                });
                generateTable(resp.data.TreatmentRevenue, $scope.viewtype);
            } else {
                $scope.treatmentRevenueData.TreatmentRevenue = [];
                $scope.treatmentRevenueData.count = 0;
                if (resp.data.count === 0) {
                    $scope.treatmentRevenueData.TreatmentRevenue = [];
                    $scope.treatmentRevenueData.count = 0;
                } else {
                    $scope.treatmentRevenueData = resp.data;
                    //$scope.exportMaxSize = $scope.treatmentRevenueData.count;
                    $scope.pagewisetotal = 0;
                    for (var i = 0; i < $scope.treatmentRevenueData.TreatmentRevenue.length; i++) {

                        var product = $scope.treatmentRevenueData.TreatmentRevenue[i];
                        // $scope.pagewisetotal += (product.Total);
                        $scope.pagewisetotal += parseInt(product.Total);
                        // $scope.treatmentRevenueData.TreatmentRevenue[i].Tax = product.Tax ? Math.round(product.Tax) : 0;
                        //$scope.treatmentRevenueData.TreatmentRevenue[i].Tax = tax ? Math.round(tax) : 0;

                        var Multiplyfactor = parseFloat(product.Multiplyfactor) || 0;
                        var ProcedureCost = parseFloat(product.ProcedureCost) || 0;
                        totalAmount = ProcedureCost * Multiplyfactor;
                        if (product.DiscountCost && Math.round(product.DiscountCost) !== 0) {
                            if (product.DiscountType === "PERCENT") {
                                product.DiscountAmount = checkRoundVal((checkRoundVal(product.DiscountCost) / 100) * totalAmount);
                                totalAmount = Math.round(totalAmount) - (Math.round(product.DiscountCost) / 100) * totalAmount;
                            } else if (product.DiscountType === "AMOUNT") {
                                totalAmount = Math.round(totalAmount) - Math.round(product.DiscountCost);
                                product.DiscountAmount = checkRoundVal(product.DiscountCost);
                            }
                        }
                        totalAmount = Math.round(totalAmount);
                        product.Tax = ((parseInt(product.Cgst) + parseInt(product.Sgst)) / 100) * totalAmount;
                        $scope.treatmentRevenueData.TreatmentRevenue[i].Tax = product.Tax ? Math.round(product.Tax) : 0;
                    }
                }
            }

        }, function (err) {
            console.log(err);
            alertify.error(err.data.Message);
        });
    }
    function checkRoundVal(val) {
        return val !== undefined && val !== "" && val !== null ? Math.round(val) : 0;
    }

    $scope.labData = {
        "Labreport": [],
        "count": 0
    };
    function getLabDetails(pageno, reportType) {

        var params = {
            "DoctorId": $scope.SelectedDoctor === undefined || $scope.SelectedDoctor === null ? 0 : $scope.SelectedDoctor.DoctorID,
            "DashboardType": 'Labreport',
            "HospitalID": $scope.SelectedHospital === undefined || $scope.SelectedHospital === null ? doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID : $scope.SelectedHospital.ClinicId,
            "StartDate": $scope.dashboard_StartDate,
            "EndDate": $scope.dashboard_EndDate,
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNo": pageno,
            "GetAllIndicator": $scope.GetAllIndicator
        };

        eHnoteMainDashboardDataServices.getMainDashboardDetailInfo(params).then(function (resp) {
            //$scope.labData.Labreport = [];
            //$scope.labData.count = 0;
            if (reportType === 'export') {

                resp.data.Labreport = resp.data.Labreport || [];
                generateTable(resp.data.Labreport, $scope.viewtype);
            } else {
                $scope.labData.Labreport = [];
                $scope.labData.count = 0;
                if (resp.data.count === 0) {
                    $scope.labData.Labreport = [];
                    $scope.labData.count = 0;
                } else {
                    $scope.labData = resp.data;
                    //$scope.exportMaxSize = $scope.labData.count;
                }
            }

        }, function (err) {
            console.log(err);
            alertify.error(err.data.Message);
        });
    }

    $scope.branchwiseData = {
        "BalanceSheet": [],
        "count": 0
    };
    function getBranchwiseDetails(pageno, reportType) {

        var params = {
            "DoctorId": $scope.SelectedDoctor === undefined || $scope.SelectedDoctor === null ? 0 : $scope.SelectedDoctor.DoctorID,
            "DashboardType": 'BalanceSheet',
            "HospitalID": $scope.SelectedHospital === undefined || $scope.SelectedHospital === null ? doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID : $scope.SelectedHospital.ClinicId,
            "StartDate": $scope.dashboard_StartDate,
            "EndDate": $scope.dashboard_EndDate,
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNo": pageno,
            "GetAllIndicator": $scope.GetAllIndicator
        };

        eHnoteMainDashboardDataServices.getMainDashboardDetailInfo(params).then(function (resp) {
            //$scope.branchwiseData.BalanceSheet = [];
            //$scope.branchwiseData.count = 0;
            if (reportType === 'export') {
                resp.data.BalanceSheet = resp.data.BalanceSheet || [];

                generateTable(resp.data.BalanceSheet, $scope.viewtype);
            } else {
                $scope.branchwiseData.BalanceSheet = [];
                $scope.branchwiseData.count = 0;
                if (resp.data.count === 0) {
                    $scope.branchwiseData.BalanceSheet = [];
                    $scope.branchwiseData.count = 0;
                } else {
                    $scope.branchwiseData = resp.data;
                    //$scope.exportMaxSize = $scope.branchwiseData.count;
                }
            }

        }, function (err) {
            console.log(err);
            alertify.error(err.data.Message);
        });
    }



    $scope.pageChanged = function (currentPage, viewtype, date, data, PaymentMode) {

        switch (viewtype) {
            case 'AllAppointments':
                getAllTotalAppointmentsDetails(1, exportType);
                break;
            case 'CancelledAppointments':
                getAllCancelAppointmentsDetails(1, exportType);
                break;
            case 'RescheduleAppointments':
                getRescheduleAppointments(1, exportType);
                break;
            case 'ASCAppointments':
                getAscAppointmentsDeatils(1, exportType);
                break;
            case 'NewAppointmentsDashBoard':
                getNewAppointmentDetails(1, exportType);
                break;
            case 'ClinicfollowupAppointments':
                getClinicfollowupAppointments(1, exportType);
                break;
            case 'CoordinatorAppointments':
                getCoordinatorAppointments(1, exportType);
                break;
            case 'PostOpfollowupAppointments':
                getPostOpfollowupAppointments(1, exportType);
                break;
            case 'PreOpAppointments':
                getPreOpAppointments(1, exportType);
                break;
            case 'PreadmissionAppointments':
                getPreadmissionAppointment(1, exportType);
                break;
            case 'TechnicianAppointments':
                getTechnicianAppointments(1, exportType);
                break;
            case 'Revenue':
                $scope.getRevenueDetails(currentPage);
                break;
            case 'SurgeryTotalRevenue':
                $scope.getSurgeryRevenueDetails(currentPage);
                break;
            case 'OutStanding':
                getOutstandingDetails(currentPage);
                break;
            case 'PatientVisits':
                getPatientVisitDetails(currentPage);
                break;
            case 'PaidFollowupAppointments':
                getPaidFollowupAppointments(currentPage);
                break;
            case 'AppointmentStats':
                getAppointmentDetails(currentPage);
                break;
            case 'PatientDetails':
                getPatientDetails(currentPage);
                break;
            case 'TreatmentRevenue':
                getTreatmentDetails(currentPage);
                break;
            case 'Labreport':
                getLabDetails(currentPage);
                break;
            case 'BalanceSheet':
                getBranchwiseDetails(currentPage);
                break;
            case 'ReferralReport':
                getReferrlReportDetails(currentPage);
                break;
            case 'DiagnosisReport':
                getDiagnosisReportDetails(currentPage);
                break;
            case 'SurgeryReport':
                getSurgeryReportDetails(1, currentPage);
                break;
            case 'MissedAppointments':
                getMissedAppointmentsReportDetails(currentPage);
                break;
            case 'RevenueDetail':
                $scope.getPaymentDetails(currentPage, viewtype, date, PaymentMode, data);
                break;
            case 'SurgeryRevenueDetail':
                $scope.getSurgeryPaymentDetails(currentPage, viewtype, date, PaymentMode, data);
                break;

            case 'FollowupAppointmentStats':
                getFollowupAppointmentDetails(currentPage);
                break;
            case 'OldAppointmentStats':
                getOldAppointmentDetails(currentPage);
                break;
            case 'SurgeryAppointmentStats':
                getSurgeryAppointmentDetails(currentPage);
                break;
            case 'PharmacySale':
                getPharmacySaleDetails(currentPage);
                break;
            case 'OpticalSale':
                getOpticalSaleDetails(currentPage);
                break;
            case 'CancelledAppointments':
                getCancelAppointmentsDetails(currentPage);
                break;
            case 'AllAppointments':
                getTotalAppointmentsDetails(currentPage);
                break;


        }
    };


    $scope.FollowappointmentData = {
        "FollowupAppointmentStats": [],
        "count": 0
    };
    function getFollowupAppointmentDetails(pageno, reportType) {

        var params = {
            "DoctorId": $scope.SelectedDoctor === undefined || $scope.SelectedDoctor === null ? 0 : $scope.SelectedDoctor.DoctorID,
            "DashboardType": 'FollowupAppointmentStats',
            "HospitalID": $scope.SelectedHospital === undefined || $scope.SelectedHospital === null ? doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID : $scope.SelectedHospital.ClinicId,
            "StartDate": $scope.dashboard_StartDate,
            "EndDate": $scope.dashboard_EndDate,
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNo": pageno,
            "GetAllIndicator": $scope.GetAllIndicator,
            "SubOrganizationId": $scope.SelectedSubOrganization === undefined || $scope.SelectedSubOrganization === null ? 0 : $scope.SelectedSubOrganization.SubOrganizationId,
            "DepartmentId": $scope.SelectedDepartment === undefined || $scope.SelectedDepartment === null ? 0 : $scope.SelectedDepartment.SubSpecializationId
        };

        eHnoteMainDashboardDataServices.getMainDashboardDetailInfo(params).then(function (resp) {
            if (reportType === 'export') {

                resp.data.FollowupAppointmentStats = resp.data.FollowupAppointmentStats || [];
                generateTable(resp.data.FollowupAppointmentStats, $scope.viewtype);
            } else {
                $scope.FollowappointmentData.FollowupAppointmentStats = [];
                $scope.FollowappointmentData.count = 0;
                if (resp.data.count === 0) {
                    $scope.FollowappointmentData.FollowupAppointmentStats = [];
                    $scope.FollowappointmentData.count = 0;
                } else {
                    $scope.FollowappointmentData = resp.data;
                    //$scope.exportMaxSize = $scope.FollowappointmentData.count;
                }
            }

        }, function (err) {
            console.log(err);
            alertify.error(err.data.Message);
        });
    }


    $scope.OldappointmentData = {
        "OldAppointmentStats": [],
        "count": 0
    };
    function getOldAppointmentDetails(pageno, reportType) {

        var params = {
            "DoctorId": $scope.SelectedDoctor === undefined || $scope.SelectedDoctor === null ? 0 : $scope.SelectedDoctor.DoctorID,
            "DashboardType": 'OldAppointmentStats',
            "HospitalID": $scope.SelectedHospital === undefined || $scope.SelectedHospital === null ? doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID : $scope.SelectedHospital.ClinicId,
            "StartDate": $scope.dashboard_StartDate,
            "EndDate": $scope.dashboard_EndDate,
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNo": pageno,
            "GetAllIndicator": $scope.GetAllIndicator,
            "SubOrganizationId": $scope.SelectedSubOrganization === undefined || $scope.SelectedSubOrganization === null ? 0 : $scope.SelectedSubOrganization.SubOrganizationId,
            "DepartmentId": $scope.SelectedDepartment === undefined || $scope.SelectedDepartment === null ? 0 : $scope.SelectedDepartment.SubSpecializationId
        };

        eHnoteMainDashboardDataServices.getMainDashboardDetailInfo(params).then(function (resp) {
            if (reportType === 'export') {

                resp.data.OldAppointmentStats = resp.data.OldAppointmentStats || [];
                generateTable(resp.data.OldAppointmentStats, $scope.viewtype);
            } else {
                $scope.OldappointmentData.OldAppointmentStats = [];
                $scope.OldappointmentData.count = 0;
                if (resp.data.count === 0) {
                    $scope.OldappointmentData.OldAppointmentStats = [];
                    $scope.OldappointmentData.count = 0;
                } else {
                    $scope.OldappointmentData = resp.data;
                    //$scope.exportMaxSize = $scope.OldappointmentData.count;
                }
            }

        }, function (err) {
            console.log(err);
            alertify.error(err.data.Message);
        });
    }


    $scope.SurgeryappointmentData = {
        "SurgeryAppointmentStats": [],
        "count": 0
    };
    function getSurgeryAppointmentDetails(pageno, reportType) {

        var params = {
            "DoctorId": $scope.SelectedDoctor === undefined || $scope.SelectedDoctor === null ? 0 : $scope.SelectedDoctor.DoctorID,
            "DashboardType": 'SurgeryAppointmentStats',
            "HospitalID": $scope.SelectedHospital === undefined || $scope.SelectedHospital === null ? doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID : $scope.SelectedHospital.ClinicId,
            "StartDate": $scope.dashboard_StartDate,
            "EndDate": $scope.dashboard_EndDate,
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNo": pageno,
            "GetAllIndicator": $scope.GetAllIndicator,
            "SubOrganizationId": $scope.SelectedSubOrganization === undefined || $scope.SelectedSubOrganization === null ? 0 : $scope.SelectedSubOrganization.SubOrganizationId,
            "DepartmentId": $scope.SelectedDepartment === undefined || $scope.SelectedDepartment === null ? 0 : $scope.SelectedDepartment.SubSpecializationId
        };

        eHnoteMainDashboardDataServices.getMainDashboardDetailInfo(params).then(function (resp) {
            if (reportType === 'export') {
                resp.data.SurgeryAppointmentStats = resp.data.SurgeryAppointmentStats || [];
                generateTable(resp.data.SurgeryAppointmentStats, $scope.viewtype);
            } else {
                $scope.SurgeryappointmentData.SurgeryAppointmentStats = [];
                $scope.SurgeryappointmentData.count = 0;
                if (resp.data.count === 0) {
                    $scope.SurgeryappointmentData.SurgeryAppointmentStats = [];
                    $scope.SurgeryappointmentData.count = 0;
                } else {
                    $scope.SurgeryappointmentData = resp.data;
                    //$scope.exportMaxSize = $scope.SurgeryappointmentData.count;
                }
            }

        }, function (err) {
            console.log(err);
            alertify.error(err.data.Message);
        });
    }



    $scope.PharmacySaleData = {
        "PharmacySale": [],
        "count": 0
    };
    function getPharmacySaleDetails(pageno, reportType) {
        var params = {
            "DoctorId": $scope.SelectedDoctor === undefined || $scope.SelectedDoctor === null ? 0 : $scope.SelectedDoctor.DoctorID,
            "DashboardType": 'PharmacySale',
            "HospitalID": $scope.SelectedHospital === undefined || $scope.SelectedHospital === null ? doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID : $scope.SelectedHospital.ClinicId,
            "StartDate": $scope.dashboard_StartDate,
            "EndDate": $scope.dashboard_EndDate,
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNo": pageno,
            "GetAllIndicator": $scope.GetAllIndicator
        };

        eHnoteMainDashboardDataServices.getMainDashboardDetailInfo(params).then(function (resp) {
            if (reportType === 'export') {

                resp.data.PharmacySale = resp.data.PharmacySale || [];
                generateTable(resp.data.PharmacySale, $scope.viewtype);
            } else {
                $scope.PharmacySaleData.PharmacySale = [];
                $scope.PharmacySaleData.count = 0;
                if (resp.data.count === 0) {
                    $scope.PharmacySaleData.PharmacySale = [];
                    $scope.PharmacySaleData.count = 0;
                } else {
                    $scope.PharmacySaleData = resp.data;
                    //$scope.exportMaxSize = $scope.PharmacySaleData.count;
                }
            }

        }, function (err) {
            console.log(err);
            alertify.error(err.data.Message);
        });
    }

    $scope.OpticalSaleData = {
        "OpticalSale": [],
        "count": 0
    };
    function getOpticalSaleDetails(pageno, reportType) {
        var params = {
            "DoctorId": $scope.SelectedDoctor === undefined || $scope.SelectedDoctor === null ? 0 : $scope.SelectedDoctor.DoctorID,
            "DashboardType": 'OpticalSale',
            "HospitalID": $scope.SelectedHospital === undefined || $scope.SelectedHospital === null ? doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID : $scope.SelectedHospital.ClinicId,
            "StartDate": $scope.dashboard_StartDate,
            "EndDate": $scope.dashboard_EndDate,
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNo": pageno,
            "GetAllIndicator": $scope.GetAllIndicator
        };

        eHnoteMainDashboardDataServices.getMainDashboardDetailInfo(params).then(function (resp) {
            if (reportType === 'export') {
                resp.data.OpticalSale = resp.data.OpticalSale || [];
                generateTable(resp.data.OpticalSale, $scope.viewtype);
            } else {
                $scope.OpticalSaleData.OpticalSale = [];
                $scope.OpticalSaleData.count = 0;
                if (resp.data.count === 0) {
                    $scope.OpticalSaleData.OpticalSale = [];
                    $scope.OpticalSaleData.count = 0;
                } else {
                    $scope.OpticalSaleData = resp.data;
                    //$scope.exportMaxSize = $scope.OpticalSaleData.count;
                }
            }

        }, function (err) {
            console.log(err);
            alertify.error(err.data.Message);
        });
    }



    $scope.TotalAppointmentDataReport = {
        "AllAppointments": [],
        "count": 0
    };
    function getAllTotalAppointmentsDetails(HospitalIdsList,type) {
        var selectedDoctors = $filter("filter")($scope.NewPatientReportDoctorList, function (iterator, ind) { return iterator.isChecked == true; });
        if (selectedDoctors.length == 0) {
            alertify.error("Please Select Doctor");
            return false;
        }
        var newlist = "";
        for (var i in $scope.NewPatientReportDoctorList) {
            if ($scope.NewPatientReportDoctorList[i].isChecked) {
                newlist += "," + $scope.NewPatientReportDoctorList[i].DoctorID;
            }
        }
        if (newlist.charAt(0) === ",") {
            newlist = newlist.slice(1);
        }

        let newlist1 = "";
        for (let i in $scope.Visitreasons) {
            if ($scope.Visitreasons[i].isChecked) {
                //newlist1 += "," + $scope.Visitreasons[i].ReasonId;
                newlist1 += "," + $scope.Visitreasons[i].ParentAppointmentVisitReasonId;
            }
        }

        if (newlist1.charAt(0) === ",") {
            newlist1 = newlist1.slice(1);
        }

        let newlist2 = "";
        for (let i in $scope.appointmentTypes) {
            if ($scope.appointmentTypes[i].isChecked) {
                newlist2 += "," + $scope.appointmentTypes[i].Id;
            }
        }

        if (newlist2.charAt(0) === ",") {
            newlist2 = newlist2.slice(1);
        }

        let list5 = "";
        for (var i in $scope.AppointmentStatusArray) {
            if ($scope.AppointmentStatusArray[i].IsChecked) {
                list5 += "," + $scope.AppointmentStatusArray[i].AppointmentStatusId;
            }
        }
        if (list5.charAt(0) === ",") {
            list5 = list5.slice(1);
        }

        let list4 = "";
        for (var i in $scope.BookedstatusFilterList) {
            if ($scope.BookedstatusFilterList[i].IsChecked) {
                list4 += "," + $scope.BookedstatusFilterList[i].Id;
            }
        }
        if (list4.charAt(0) === ",") {
            list4 = list4.slice(1);
        }

        let list6 = "";
        for (var i in $scope.BookingTypesArray) {
            if ($scope.BookingTypesArray[i].IsChecked) {
                list6 += "," + $scope.BookingTypesArray[i].BookingTypeId;
            }
        }
        if (list6.charAt(0) === ",") {
            list6 = list6.slice(1);
        }

        var req = {
            "Fromdate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_StartDate), "yyyy-MM-dd"),
            "Todate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_EndDate), "yyyy-MM-dd"),
            "HospitalIdsList": HospitalIdsList.length > 0 ? HospitalIdsList : "",
            "DoctorsIds": newlist || "",
            //"VisitTypeId": $scope.GetDataOnMainDashBoardObj.VisitTypeId || null,
            "AppointmentTypeIds": newlist2,
            "VisitReasons": newlist1,
            "AppointmentStatusIds": list5 || "",
            "BookingStatusIds": list4 || "",
            "BookingTypeIds": list6 || "",
            "DashboardType": 10
        };
        eHnoteMainDashboardDataServices.GetDashboardAppointmentDetails(req).then(function (resp) {
            if (resp.data.status === "Success") {
                if (resp.data.rows.length > 0) {
                    let tempArray = [];
                    angular.forEach(resp.data.rows, function (kitem) {
                        kitem.ContentShow = false;
                        angular.forEach(kitem.AppointmentDetails, function (hitem) {
                            let today = $filter('date')(new Date(), "yyyy-MM-dd");
                            let datetime = today + " " + hitem.StartTime;
                            hitem.StartTime = $filter('date')(new Date(datetime), "hh:mm a");
                            tempArray.push(hitem);
                        });
                    });
                    $scope.ListCountsObj.AllAppointmentsCount = tempArray.length || 0;
                }
                $scope.DashboardAllApptDetails = angular.copy(resp.data.rows);

                if (type == "export") {
                    generateTableNew($scope.DashboardAllApptDetails, $scope.viewtype);
                }

            }

        }, function () {


        });
    }

    $scope.CancelAppointmentData = {
        "CancelledAppointments": [],
        "count": 0
    };
    function getCancelAppointmentsDetails(pageno, reportType) {
        var params = {
            "DoctorId": $scope.SelectedDoctor === undefined || $scope.SelectedDoctor === null ? 0 : $scope.SelectedDoctor.DoctorID,
            "DashboardType": 'CancelledAppointments',
            "HospitalID": $scope.SelectedHospital === undefined || $scope.SelectedHospital === null ? doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID : $scope.SelectedHospital.ClinicId,
            "StartDate": $scope.dashboard_StartDate,
            "EndDate": $scope.dashboard_EndDate,
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNo": pageno,
            "GetAllIndicator": $scope.GetAllIndicator,
            "SubOrganizationId": $scope.SelectedSubOrganization === undefined || $scope.SelectedSubOrganization === null ? 0 : $scope.SelectedSubOrganization.SubOrganizationId,
            "DepartmentId": $scope.SelectedDepartment === undefined || $scope.SelectedDepartment === null ? 0 : $scope.SelectedDepartment.SubSpecializationId
        };

        eHnoteMainDashboardDataServices.getMainDashboardDetailInfo(params).then(function (resp) {
            if (reportType === 'export') {
                resp.data.CancelledAppointments = resp.data.CancelledAppointments || [];
                generateTable(resp.data.CancelledAppointments, $scope.viewtype);
            } else {
                $scope.CancelAppointmentData.CancelledAppointments = [];
                $scope.CancelAppointmentData.count = 0;
                if (resp.data.count === 0) {
                    $scope.CancelAppointmentData.CancelledAppointments = [];
                    $scope.CancelAppointmentData.count = 0;
                } else {
                    $scope.CancelAppointmentData = resp.data;
                    //$scope.exportMaxSize = $scope.CancelAppointmentData.count;
                }
            }

        }, function (err) {
            console.log(err);
            alertify.error(err.data.Message);
        });
    }

    $scope.CancelAllAppointmentsData = {
        "AllAppointments": [],
        "count": 0
    };
    function getAllCancelAppointmentsDetails(pageno, reportType) {
        var newlist = "";
        for (var i in $scope.NewPatientReportDoctorList) {
            if ($scope.NewPatientReportDoctorList[i].isChecked) {
                newlist += "," + $scope.NewPatientReportDoctorList[i].DoctorID;
            }
        }
        if (newlist.charAt(0) === ",") {
            newlist = newlist.slice(1);
        }
        var DashBoardFromDate = $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_StartDate), "yyyy-MM-dd");
        var DashBoardToDate = $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_EndDate), "yyyy-MM-dd");
        var params = {
            "DoctorIds": newlist || "",
            "DashboardType": 'CancelledAppointments',
            "HospitalID": $scope.SelectedHospital === undefined || $scope.SelectedHospital === null ? doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID : $scope.SelectedHospital.ClinicId,
            "StartDate": DashBoardFromDate || "",
            "EndDate": DashBoardToDate || "",
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNo": pageno,
            "GetAllIndicator": $scope.GetAllIndicator,
            "ReportType": reportType,
        };

        eHnoteMainDashboardDataServices.getPatientMainDashboardDetailInfo(params).then(function (resp) {
            //if (reportType === 'export') {
            //    resp.data.AllAppointments = resp.data.AllAppointments || [];
            //    generateTable(resp.data.AllAppointments, $scope.viewtype);
            //}
            if (params.ReportType === 'export') {
                if (resp.data !== "") {
                    var file = new Blob([resp.data], { type: "text/csv" });
                    saveAs(file, "AllAppointments" + 1 + ".csv");
                }
            }
            else {
                //if (reportType === 'export') {
                //    resp.data.AllAppointments = resp.data.AllAppointments || [];
                //    generateTable(resp.data.AllAppointments, $scope.viewtype);
                //}
                //else {
                $scope.CancelAllAppointmentsData.AllAppointments = [];
                $scope.CancelAllAppointmentsData.count = 0;
                if (resp.data.count === 0) {
                    $scope.CancelAllAppointmentsData.AllAppointments = [];
                    $scope.CancelAllAppointmentsData.count = 0;
                } else {
                    $scope.CancelAllAppointmentsData = resp.data;
                    //$scope.exportMaxSize = $scope.TotalAppointmentData.count;
                }
            }

            // }

        }, function (err) {
            console.log(err);
            alertify.error(err.data.Message);
        });
    }

    $scope.ASCAppointmentData = {
        "AllAppointments": [],
        "count": 0
    };
    function getAscAppointmentsDeatils(HospitalIdsList,type) {
        var selectedDoctors = $filter("filter")($scope.NewPatientReportDoctorList, function (iterator, ind) { return iterator.isChecked == true; });
        if (selectedDoctors.length == 0) {
            alertify.error("Please Select Doctor");
            return false;
        }
        var newlist = "";
        for (var i in $scope.NewPatientReportDoctorList) {
            if ($scope.NewPatientReportDoctorList[i].isChecked) {
                newlist += "," + $scope.NewPatientReportDoctorList[i].DoctorID;
            }
        }
        if (newlist.charAt(0) === ",") {
            newlist = newlist.slice(1);
        }

        let newlist1 = "";
        for (let i in $scope.Visitreasons) {
            if ($scope.Visitreasons[i].isChecked) {
                newlist1 += "," + $scope.Visitreasons[i].ReasonId;
            }
        }

        if (newlist1.charAt(0) === ",") {
            newlist1 = newlist1.slice(1);
        }

        let list5 = "";
        for (var i in $scope.AppointmentStatusArray) {
            if ($scope.AppointmentStatusArray[i].IsChecked) {
                list5 += "," + $scope.AppointmentStatusArray[i].AppointmentStatusId;
            }
        }
        if (list5.charAt(0) === ",") {
            list5 = list5.slice(1);
        }

        let list4 = "";
        for (var i in $scope.BookedstatusFilterList) {
            if ($scope.BookedstatusFilterList[i].IsChecked) {
                list4 += "," + $scope.BookedstatusFilterList[i].Id;
            }
        }
        if (list4.charAt(0) === ",") {
            list4 = list4.slice(1);
        }
        let list6 = "";
        for (var i in $scope.BookingTypesArray) {
            if ($scope.BookingTypesArray[i].IsChecked) {
                list6 += "," + $scope.BookingTypesArray[i].BookingTypeId;
            }
        }
        if (list6.charAt(0) === ",") {
            list6 = list6.slice(1);
        }

        var req = {
            "Fromdate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_StartDate), "yyyy-MM-dd"),
            "Todate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_EndDate), "yyyy-MM-dd"),
            "HospitalIdsList": HospitalIdsList.length > 0 ? HospitalIdsList : "",
            "DoctorsIds": newlist || "",
            "VisitTypeId": 4,
            "VisitReasons": newlist1,
            //"AppointmentStatusIds": list5 || "",
            "BookingStatusIds": list4 || "",
            "BookingTypeIds": list6 || "",
            "DashboardType": 4
        };
        eHnoteMainDashboardDataServices.GetDashboardAppointmentDetails(req).then(function (resp) {
            if (resp.data.status === "Success") {
                if (resp.data.rows.length > 0) {
                    let tempArray = [];
                    angular.forEach(resp.data.rows, function (kitem) {
                        kitem.ContentShow = false;
                        angular.forEach(kitem.AppointmentDetails, function (hitem) {
                            let today = $filter('date')(new Date(), "yyyy-MM-dd");
                            let datetime = today + " " + hitem.StartTime;
                            hitem.StartTime = $filter('date')(new Date(datetime), "hh:mm a");
                            tempArray.push(hitem);
                        });
                    });
                    $scope.ListCountsObj.ASCAppointmentsCount = tempArray.length || 0;
                }
                $scope.DashboardASCApptDetails = angular.copy(resp.data.rows);

                if (type == "export") {
                    generateTableNew($scope.DashboardASCApptDetails, $scope.viewtype);
                }

            }

        }, function () {


        });
    }

    $scope.NewAppointmentsData = {
        "AllAppointments": [],
        "count": 0
    };
    function getNewAppointmentDetails(HospitalIdsList,type) {
        var selectedDoctors = $filter("filter")($scope.NewPatientReportDoctorList, function (iterator, ind) { return iterator.isChecked == true; });
        if (selectedDoctors.length == 0) {
            alertify.error("Please Select Doctor");
            return false;
        }
        var newlist = "";
        for (var i in $scope.NewPatientReportDoctorList) {
            if ($scope.NewPatientReportDoctorList[i].isChecked) {
                newlist += "," + $scope.NewPatientReportDoctorList[i].DoctorID;
            }
        }
        if (newlist.charAt(0) === ",") {
            newlist = newlist.slice(1);
        }

        let newlist1 = "";
        for (let i in $scope.Visitreasons) {
            if ($scope.Visitreasons[i].isChecked) {
                newlist1 += "," + $scope.Visitreasons[i].ReasonId;
            }
        }

        if (newlist1.charAt(0) === ",") {
            newlist1 = newlist1.slice(1);
        }

        let list5 = "";
        for (var i in $scope.AppointmentStatusArray) {
            if ($scope.AppointmentStatusArray[i].IsChecked) {
                list5 += "," + $scope.AppointmentStatusArray[i].AppointmentStatusId;
            }
        }
        if (list5.charAt(0) === ",") {
            list5 = list5.slice(1);
        }

        let list4 = "";
        for (var i in $scope.BookedstatusFilterList) {
            if ($scope.BookedstatusFilterList[i].IsChecked) {
                list4 += "," + $scope.BookedstatusFilterList[i].Id;
            }
        }
        if (list4.charAt(0) === ",") {
            list4 = list4.slice(1);
        }
        let list6 = "";
        for (var i in $scope.BookingTypesArray) {
            if ($scope.BookingTypesArray[i].IsChecked) {
                list6 += "," + $scope.BookingTypesArray[i].BookingTypeId;
            }
        }
        if (list6.charAt(0) === ",") {
            list6 = list6.slice(1);
        }

        var req = {
            "Fromdate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_StartDate), "yyyy-MM-dd"),
            "Todate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_EndDate), "yyyy-MM-dd"),
            "HospitalIdsList": HospitalIdsList.length > 0 ? HospitalIdsList : "",
            "DoctorsIds": newlist || "",
            "VisitTypeId": 1,
            "VisitReasons": newlist1,
            //"AppointmentStatusIds": list5 || "",
            "BookingStatusIds": list4 || "",
            "BookingTypeIds": list6 || "",
            "DashboardType": 1
        };
        eHnoteMainDashboardDataServices.GetDashboardAppointmentDetails(req).then(function (resp) {
            if (resp.data.status === "Success") {
                if (resp.data.rows.length > 0) {
                    let tempArray = [];
                    angular.forEach(resp.data.rows, function (kitem) {
                        kitem.ContentShow = false;
                        angular.forEach(kitem.AppointmentDetails, function (hitem) {
                            let today = $filter('date')(new Date(), "yyyy-MM-dd");
                            let datetime = today + " " + hitem.StartTime;
                            hitem.StartTime = $filter('date')(new Date(datetime), "hh:mm a");
                            tempArray.push(hitem);
                        });
                    });
                    $scope.ListCountsObj.NewAppointmentsCount = tempArray.length || 0;
                }
                $scope.DashboardNewApptDetails = angular.copy(resp.data.rows);


                if (type == "export") {
                    generateTableNew($scope.DashboardNewApptDetails, $scope.viewtype)
                }

            }

        }, function () {


        });
    }

    $scope.ClinicfollowupAppointmentsData = {
        "AllAppointments": [],
        "count": 0
    };
    function getClinicfollowupAppointments(HospitalIdsList,type) {
        var selectedDoctors = $filter("filter")($scope.NewPatientReportDoctorList, function (iterator, ind) { return iterator.isChecked == true; });
        if (selectedDoctors.length == 0) {
            alertify.error("Please Select Doctor");
            return false;
        }
        var newlist = "";
        for (var i in $scope.NewPatientReportDoctorList) {
            if ($scope.NewPatientReportDoctorList[i].isChecked) {
                newlist += "," + $scope.NewPatientReportDoctorList[i].DoctorID;
            }
        }
        if (newlist.charAt(0) === ",") {
            newlist = newlist.slice(1);
        }

        let newlist1 = "";
        for (let i in $scope.Visitreasons) {
            if ($scope.Visitreasons[i].isChecked) {
                newlist1 += "," + $scope.Visitreasons[i].ReasonId;
            }
        }

        if (newlist1.charAt(0) === ",") {
            newlist1 = newlist1.slice(1);
        }


        let list5 = "";
        for (var i in $scope.AppointmentStatusArray) {
            if ($scope.AppointmentStatusArray[i].IsChecked) {
                list5 += "," + $scope.AppointmentStatusArray[i].AppointmentStatusId;
            }
        }
        if (list5.charAt(0) === ",") {
            list5 = list5.slice(1);
        }

        let list4 = "";
        for (var i in $scope.BookedstatusFilterList) {
            if ($scope.BookedstatusFilterList[i].IsChecked) {
                list4 += "," + $scope.BookedstatusFilterList[i].Id;
            }
        }
        if (list4.charAt(0) === ",") {
            list4 = list4.slice(1);
        }

        let list6 = "";
        for (var i in $scope.BookingTypesArray) {
            if ($scope.BookingTypesArray[i].IsChecked) {
                list6 += "," + $scope.BookingTypesArray[i].BookingTypeId;
            }
        }
        if (list6.charAt(0) === ",") {
            list6 = list6.slice(1);
        }

        var req = {
            "Fromdate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_StartDate), "yyyy-MM-dd"),
            "Todate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_EndDate), "yyyy-MM-dd"),
            "HospitalIdsList": HospitalIdsList.length > 0 ? HospitalIdsList : "",
            "DoctorsIds": newlist || "",
            "VisitTypeId": 2,
            "VisitReasons": newlist1,
            //"AppointmentStatusIds": list5 || "",
            "BookingStatusIds": list4 || "",
            "BookingTypeIds": list6 || "",
            "DashboardType": 2
        };
        eHnoteMainDashboardDataServices.GetDashboardAppointmentDetails(req).then(function (resp) {
            if (resp.data.status === "Success") {
                if (resp.data.rows.length > 0) {
                    let tempArray = [];
                    angular.forEach(resp.data.rows, function (kitem) {
                        kitem.ContentShow = false;
                        angular.forEach(kitem.AppointmentDetails, function (hitem) {
                            let today = $filter('date')(new Date(), "yyyy-MM-dd");
                            let datetime = today + " " + hitem.StartTime;
                            hitem.StartTime = $filter('date')(new Date(datetime), "hh:mm a");
                            tempArray.push(hitem);
                        });
                    });
                    $scope.ListCountsObj.ClinicFollowupAppointmentsCount = tempArray.length || 0;
                }
                $scope.DashboardClinicFollowupApptDetails = angular.copy(resp.data.rows);

                if (type == "export") {
                    generateTableNew($scope.DashboardClinicFollowupApptDetails, $scope.viewtype);
                }

            }

        }, function () {


        });
    }

    $scope.CoordinatorAppointmentsData = {
        "AllAppointments": [],
        "count": 0
    };
    function getCoordinatorAppointments(HospitalIdsList,type) {
        var selectedDoctors = $filter("filter")($scope.NewPatientReportDoctorList, function (iterator, ind) { return iterator.isChecked == true; });
        if (selectedDoctors.length == 0) {
            alertify.error("Please Select Doctor");
            return false;
        }
        var newlist = "";
        for (var i in $scope.NewPatientReportDoctorList) {
            if ($scope.NewPatientReportDoctorList[i].isChecked) {
                newlist += "," + $scope.NewPatientReportDoctorList[i].DoctorID;
            }
        }
        if (newlist.charAt(0) === ",") {
            newlist = newlist.slice(1);
        }

        let newlist1 = "";
        for (let i in $scope.Visitreasons) {
            if ($scope.Visitreasons[i].isChecked) {
                newlist1 += "," + $scope.Visitreasons[i].ReasonId;
            }
        }

        if (newlist1.charAt(0) === ",") {
            newlist1 = newlist1.slice(1);
        }


        let list5 = "";
        for (var i in $scope.AppointmentStatusArray) {
            if ($scope.AppointmentStatusArray[i].IsChecked) {
                list5 += "," + $scope.AppointmentStatusArray[i].AppointmentStatusId;
            }
        }
        if (list5.charAt(0) === ",") {
            list5 = list5.slice(1);
        }

        let list4 = "";
        for (var i in $scope.BookedstatusFilterList) {
            if ($scope.BookedstatusFilterList[i].IsChecked) {
                list4 += "," + $scope.BookedstatusFilterList[i].Id;
            }
        }
        if (list4.charAt(0) === ",") {
            list4 = list4.slice(1);
        }

        let list6 = "";
        for (var i in $scope.BookingTypesArray) {
            if ($scope.BookingTypesArray[i].IsChecked) {
                list6 += "," + $scope.BookingTypesArray[i].BookingTypeId;
            }
        }
        if (list6.charAt(0) === ",") {
            list6 = list6.slice(1);
        }

        var req = {
            "Fromdate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_StartDate), "yyyy-MM-dd"),
            "Todate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_EndDate), "yyyy-MM-dd"),
            "HospitalIdsList": HospitalIdsList.length > 0 ? HospitalIdsList : "",
            "DoctorsIds": newlist || "",
            "VisitTypeId": 8,
            "VisitReasons": newlist1,
            //"AppointmentStatusIds": list5 || "",
            "BookingStatusIds": list4 || "",
            "BookingTypeIds": list6 || "",
            "DashboardType": 8
        };
        eHnoteMainDashboardDataServices.GetDashboardAppointmentDetails(req).then(function (resp) {
            if (resp.data.status === "Success") {
                if (resp.data.rows.length > 0) {
                    let tempArray = [];
                    angular.forEach(resp.data.rows, function (kitem) {
                        kitem.ContentShow = false;
                        angular.forEach(kitem.AppointmentDetails, function (hitem) {
                            let today = $filter('date')(new Date(), "yyyy-MM-dd");
                            let datetime = today + " " + hitem.StartTime;
                            hitem.StartTime = $filter('date')(new Date(datetime), "hh:mm a");
                            tempArray.push(hitem);
                        });
                    });
                    $scope.ListCountsObj.CoordinatorAppointmentsCount = tempArray.length || 0;
                }
                $scope.DashboardCoordinatorApptDetails = angular.copy(resp.data.rows);

                if (type == "export") {
                    generateTableNew($scope.DashboardCoordinatorApptDetails, $scope.viewtype);
                }

            }

        }, function () {


        });
    }

    $scope.PostOpfollowupAppointmentsData = {
        "AllAppointments": [],
        "count": 0
    };
    function getPostOpfollowupAppointments(HospitalIdsList,type) {
        var selectedDoctors = $filter("filter")($scope.NewPatientReportDoctorList, function (iterator, ind) { return iterator.isChecked == true; });
        if (selectedDoctors.length == 0) {
            alertify.error("Please Select Doctor");
            return false;
        }
        var newlist = "";
        for (var i in $scope.NewPatientReportDoctorList) {
            if ($scope.NewPatientReportDoctorList[i].isChecked) {
                newlist += "," + $scope.NewPatientReportDoctorList[i].DoctorID;
            }
        }
        if (newlist.charAt(0) === ",") {
            newlist = newlist.slice(1);
        }

        let newlist1 = "";
        for (let i in $scope.Visitreasons) {
            if ($scope.Visitreasons[i].isChecked) {
                newlist1 += "," + $scope.Visitreasons[i].ReasonId;
            }
        }

        if (newlist1.charAt(0) === ",") {
            newlist1 = newlist1.slice(1);
        }

        let list5 = "";
        for (var i in $scope.AppointmentStatusArray) {
            if ($scope.AppointmentStatusArray[i].IsChecked) {
                list5 += "," + $scope.AppointmentStatusArray[i].AppointmentStatusId;
            }
        }
        if (list5.charAt(0) === ",") {
            list5 = list5.slice(1);
        }

        let list4 = "";
        for (var i in $scope.BookedstatusFilterList) {
            if ($scope.BookedstatusFilterList[i].IsChecked) {
                list4 += "," + $scope.BookedstatusFilterList[i].Id;
            }
        }
        if (list4.charAt(0) === ",") {
            list4 = list4.slice(1);
        }

        let list6 = "";
        for (var i in $scope.BookingTypesArray) {
            if ($scope.BookingTypesArray[i].IsChecked) {
                list6 += "," + $scope.BookingTypesArray[i].BookingTypeId;
            }
        }
        if (list6.charAt(0) === ",") {
            list6 = list6.slice(1);
        }

        var req = {
            "Fromdate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_StartDate), "yyyy-MM-dd"),
            "Todate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_EndDate), "yyyy-MM-dd"),
            "HospitalIdsList": HospitalIdsList.length > 0 ? HospitalIdsList : "",
            "DoctorsIds": newlist || "",
            "VisitTypeId": 3,
            "VisitReasons": newlist1,
            //"AppointmentStatusIds": list5 || "",
            "BookingStatusIds": list4 || "",
            "BookingTypeIds": list6 || "",
            "DashboardType": 3
        };
        eHnoteMainDashboardDataServices.GetDashboardAppointmentDetails(req).then(function (resp) {
            if (resp.data.status === "Success") {
                if (resp.data.rows.length > 0) {
                    let tempArray = [];
                    angular.forEach(resp.data.rows, function (kitem) {
                        kitem.ContentShow = false;
                        angular.forEach(kitem.AppointmentDetails, function (hitem) {
                            let today = $filter('date')(new Date(), "yyyy-MM-dd");
                            let datetime = today + " " + hitem.StartTime;
                            hitem.StartTime = $filter('date')(new Date(datetime), "hh:mm a");
                            tempArray.push(hitem);
                        });
                    });
                    $scope.ListCountsObj.PostOpFollowupAppointmentsCount = tempArray.length || 0;
                }
                $scope.DashboardPostOpFollowupApptDetails = angular.copy(resp.data.rows);

                if (type == "export") {
                    generateTableNew($scope.DashboardPostOpFollowupApptDetails, $scope.viewtype);
                }

            }

        }, function () {


        });
    }

    $scope.PreOpAppointmentsData = {
        "AllAppointments": [],
        "count": 0
    };
    function getPreOpAppointments(HospitalIdsList,type) {
        var selectedDoctors = $filter("filter")($scope.NewPatientReportDoctorList, function (iterator, ind) { return iterator.isChecked == true; });
        if (selectedDoctors.length == 0) {
            alertify.error("Please Select Doctor");
            return false;
        }
        var newlist = "";
        for (var i in $scope.NewPatientReportDoctorList) {
            if ($scope.NewPatientReportDoctorList[i].isChecked) {
                newlist += "," + $scope.NewPatientReportDoctorList[i].DoctorID;
            }
        }
        if (newlist.charAt(0) === ",") {
            newlist = newlist.slice(1);
        }

        let newlist1 = "";
        for (let i in $scope.Visitreasons) {
            if ($scope.Visitreasons[i].isChecked) {
                newlist1 += "," + $scope.Visitreasons[i].ReasonId;
            }
        }

        if (newlist1.charAt(0) === ",") {
            newlist1 = newlist1.slice(1);
        }

        let list5 = "";
        for (var i in $scope.AppointmentStatusArray) {
            if ($scope.AppointmentStatusArray[i].IsChecked) {
                list5 += "," + $scope.AppointmentStatusArray[i].AppointmentStatusId;
            }
        }
        if (list5.charAt(0) === ",") {
            list5 = list5.slice(1);
        }

        let list4 = "";
        for (var i in $scope.BookedstatusFilterList) {
            if ($scope.BookedstatusFilterList[i].IsChecked) {
                list4 += "," + $scope.BookedstatusFilterList[i].Id;
            }
        }
        if (list4.charAt(0) === ",") {
            list4 = list4.slice(1);
        }

        let list6 = "";
        for (var i in $scope.BookingTypesArray) {
            if ($scope.BookingTypesArray[i].IsChecked) {
                list6 += "," + $scope.BookingTypesArray[i].BookingTypeId;
            }
        }
        if (list6.charAt(0) === ",") {
            list6 = list6.slice(1);
        }

        var req = {
            "Fromdate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_StartDate), "yyyy-MM-dd"),
            "Todate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_EndDate), "yyyy-MM-dd"),
            "HospitalIdsList": HospitalIdsList.length > 0 ? HospitalIdsList : "",
            "DoctorsIds": newlist || "",
            "VisitTypeId": 6,
            "VisitReasons": newlist1,
            //"AppointmentStatusIds": list5 || "",
            "BookingStatusIds": list4 || "",
            "BookingTypeIds": list6 || "",
            "DashboardType": 6
        };
        eHnoteMainDashboardDataServices.GetDashboardAppointmentDetails(req).then(function (resp) {
            if (resp.data.status === "Success") {
                if (resp.data.rows.length > 0) {
                    let tempArray = [];
                    angular.forEach(resp.data.rows, function (kitem) {
                        kitem.ContentShow = false;
                        angular.forEach(kitem.AppointmentDetails, function (hitem) {
                            let today = $filter('date')(new Date(), "yyyy-MM-dd");
                            let datetime = today + " " + hitem.StartTime;
                            hitem.StartTime = $filter('date')(new Date(datetime), "hh:mm a");
                            tempArray.push(hitem);
                        });
                    });
                    $scope.ListCountsObj.PreOPAppointmentsCount = tempArray.length || 0;
                }
                $scope.DashboardPreOpApptDetails = angular.copy(resp.data.rows);

                if (type == "export") {
                    generateTableNew($scope.DashboardPreOpApptDetails, $scope.viewtype);
                }

            }

        }, function () {


        });
    }

    $scope.PreadmissionAppointmentsData = {
        "AllAppointments": [],
        "count": 0
    };
    function getPreadmissionAppointment(HospitalIdsList,type) {
        var selectedDoctors = $filter("filter")($scope.NewPatientReportDoctorList, function (iterator, ind) { return iterator.isChecked == true; });
        if (selectedDoctors.length == 0) {
            alertify.error("Please Select Doctor");
            return false;
        }
        var newlist = "";
        for (var i in $scope.NewPatientReportDoctorList) {
            if ($scope.NewPatientReportDoctorList[i].isChecked) {
                newlist += "," + $scope.NewPatientReportDoctorList[i].DoctorID;
            }
        }
        if (newlist.charAt(0) === ",") {
            newlist = newlist.slice(1);
        }

        let newlist1 = "";
        for (let i in $scope.Visitreasons) {
            if ($scope.Visitreasons[i].isChecked) {
                newlist1 += "," + $scope.Visitreasons[i].ReasonId;
            }
        }

        if (newlist1.charAt(0) === ",") {
            newlist1 = newlist1.slice(1);
        }

        let list5 = "";
        for (var i in $scope.AppointmentStatusArray) {
            if ($scope.AppointmentStatusArray[i].IsChecked) {
                list5 += "," + $scope.AppointmentStatusArray[i].AppointmentStatusId;
            }
        }
        if (list5.charAt(0) === ",") {
            list5 = list5.slice(1);
        }

        let list4 = "";
        for (var i in $scope.BookedstatusFilterList) {
            if ($scope.BookedstatusFilterList[i].IsChecked) {
                list4 += "," + $scope.BookedstatusFilterList[i].Id;
            }
        }
        if (list4.charAt(0) === ",") {
            list4 = list4.slice(1);
        }

        let list6 = "";
        for (var i in $scope.BookingTypesArray) {
            if ($scope.BookingTypesArray[i].IsChecked) {
                list6 += "," + $scope.BookingTypesArray[i].BookingTypeId;
            }
        }
        if (list6.charAt(0) === ",") {
            list6 = list6.slice(1);
        }

        var req = {
            "Fromdate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_StartDate), "yyyy-MM-dd"),
            "Todate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_EndDate), "yyyy-MM-dd"),
            "HospitalIdsList": HospitalIdsList.length > 0 ? HospitalIdsList : "",
            "DoctorsIds": newlist || "",
            "VisitTypeId": 7,
            "VisitReasons": newlist1,
            //"AppointmentStatusIds": list5 || "",
            "BookingStatusIds": list4 || "",
            "BookingTypeIds": list6 || "",
            "DashboardType": 7
        };
        eHnoteMainDashboardDataServices.GetDashboardAppointmentDetails(req).then(function (resp) {
            if (resp.data.status === "Success") {
                if (resp.data.rows.length > 0) {
                    let tempArray = [];
                    angular.forEach(resp.data.rows, function (kitem) {
                        kitem.ContentShow = false;
                        angular.forEach(kitem.AppointmentDetails, function (hitem) {
                            let today = $filter('date')(new Date(), "yyyy-MM-dd");
                            let datetime = today + " " + hitem.StartTime;
                            hitem.StartTime = $filter('date')(new Date(datetime), "hh:mm a");
                            tempArray.push(hitem);
                        });
                    });
                    $scope.ListCountsObj.PreAdmissionAppointmentsCount = tempArray.length || 0;
                }
                $scope.DashboardPreAdmissionApptDetails = angular.copy(resp.data.rows);

                if (type == "export") {
                    generateTableNew($scope.DashboardPreAdmissionApptDetails, $scope.viewtype);
                }

            }

        }, function () {


        });
    }

    $scope.TechnicianAppointmentsData = {
        "AllAppointments": [],
        "count": 0
    };
    function getTechnicianAppointments(HospitalIdsList,type) {
        var selectedDoctors = $filter("filter")($scope.NewPatientReportDoctorList, function (iterator, ind) { return iterator.isChecked == true; });
        if (selectedDoctors.length == 0) {
            alertify.error("Please Select Doctor");
            return false;
        }
        var newlist = "";
        for (var i in $scope.NewPatientReportDoctorList) {
            if ($scope.NewPatientReportDoctorList[i].isChecked) {
                newlist += "," + $scope.NewPatientReportDoctorList[i].DoctorID;
            }
        }
        if (newlist.charAt(0) === ",") {
            newlist = newlist.slice(1);
        }


        let newlist1 = "";
        for (let i in $scope.Visitreasons) {
            if ($scope.Visitreasons[i].isChecked) {
                newlist1 += "," + $scope.Visitreasons[i].ReasonId;
            }
        }

        if (newlist1.charAt(0) === ",") {
            newlist1 = newlist1.slice(1);
        }

        let list5 = "";
        for (var i in $scope.AppointmentStatusArray) {
            if ($scope.AppointmentStatusArray[i].IsChecked) {
                list5 += "," + $scope.AppointmentStatusArray[i].AppointmentStatusId;
            }
        }
        if (list5.charAt(0) === ",") {
            list5 = list5.slice(1);
        }

        let list4 = "";
        for (var i in $scope.BookedstatusFilterList) {
            if ($scope.BookedstatusFilterList[i].IsChecked) {
                list4 += "," + $scope.BookedstatusFilterList[i].Id;
            }
        }
        if (list4.charAt(0) === ",") {
            list4 = list4.slice(1);
        }

        let list6 = "";
        for (var i in $scope.BookingTypesArray) {
            if ($scope.BookingTypesArray[i].IsChecked) {
                list6 += "," + $scope.BookingTypesArray[i].BookingTypeId;
            }
        }
        if (list6.charAt(0) === ",") {
            list6 = list6.slice(1);
        }

        var req = {
            "Fromdate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_StartDate), "yyyy-MM-dd"),
            "Todate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_EndDate), "yyyy-MM-dd"),
            "HospitalIdsList": HospitalIdsList.length > 0 ? HospitalIdsList : "",
            "DoctorsIds": newlist || "",
            "VisitTypeId": 5,
            "VisitReasons": newlist1,
            //"AppointmentStatusIds": list5 || "",
            "BookingStatusIds": list4 || "",
            "BookingTypeIds": list6 || "",
            "DashboardType": 5
        };
        eHnoteMainDashboardDataServices.GetDashboardAppointmentDetails(req).then(function (resp) {
            if (resp.data.status === "Success") {
                if (resp.data.rows.length > 0) {
                    let tempArray = [];
                    angular.forEach(resp.data.rows, function (kitem) {
                        kitem.ContentShow = false;
                        angular.forEach(kitem.AppointmentDetails, function (hitem) {
                            let today = $filter('date')(new Date(), "yyyy-MM-dd");
                            let datetime = today + " " + hitem.StartTime;
                            hitem.StartTime = $filter('date')(new Date(datetime), "hh:mm a");
                            tempArray.push(hitem);
                        });
                    });
                    $scope.ListCountsObj.TechnicianAppointmentsCount = tempArray.length || 0;
                }
                $scope.DashboardTechnicianApptDetails = angular.copy(resp.data.rows);

                if (type == "export") {
                    generateTableNew($scope.DashboardTechnicianApptDetails, $scope.viewtype);
                }

            }

        }, function () {


        });
    }

    $scope.RescheduleAppointmentsData = {
        "AllAppointments": [],
        "count": 0
    };
    function getRescheduleAppointments(HospitalIdsList,type) {
        var selectedDoctors = $filter("filter")($scope.NewPatientReportDoctorList, function (iterator, ind) { return iterator.isChecked == true; });
        if (selectedDoctors.length == 0) {
            alertify.error("Please Select Doctor");
            return false;
        }
        var newlist = "";
        for (var i in $scope.NewPatientReportDoctorList) {
            if ($scope.NewPatientReportDoctorList[i].isChecked) {
                newlist += "," + $scope.NewPatientReportDoctorList[i].DoctorID;
            }
        }
        if (newlist.charAt(0) === ",") {
            newlist = newlist.slice(1);
        }

        let newlist1 = "";
        for (let i in $scope.Visitreasons) {
            if ($scope.Visitreasons[i].isChecked) {
                //newlist1 += "," + $scope.Visitreasons[i].ReasonId;
                newlist1 += "," + $scope.Visitreasons[i].ParentAppointmentVisitReasonId;
            }
        }

        if (newlist1.charAt(0) === ",") {
            newlist1 = newlist1.slice(1);
        }

        let newlist2 = "";
        for (let i in $scope.appointmentTypes) {
            if ($scope.appointmentTypes[i].isChecked) {
                newlist2 += "," + $scope.appointmentTypes[i].Id;
            }
        }

        if (newlist2.charAt(0) === ",") {
            newlist2 = newlist2.slice(1);
        }

        let list3 = "";
        for (let i in $scope.confirmationStatusArray) {
            if ($scope.confirmationStatusArray[i].IsChecked) {
                list3 += "," + $scope.confirmationStatusArray[i].ConfirmationStatusId;
            }
        }
        if (list3.charAt(0) === ",") {
            list3 = list3.slice(1);
        }

        let list5 = "";
        for (var i in $scope.AppointmentStatusArray) {
            if ($scope.AppointmentStatusArray[i].IsChecked) {
                list5 += "," + $scope.AppointmentStatusArray[i].AppointmentStatusId;
            }
        }
        if (list5.charAt(0) === ",") {
            list5 = list5.slice(1);
        }

        let list4 = "";
        for (var i in $scope.BookedstatusFilterList) {
            if ($scope.BookedstatusFilterList[i].IsChecked) {
                list4 += "," + $scope.BookedstatusFilterList[i].Id;
            }
        }
        if (list4.charAt(0) === ",") {
            list4 = list4.slice(1);
        }

        let list6 = "";
        for (var i in $scope.BookingTypesArray) {
            if ($scope.BookingTypesArray[i].IsChecked) {
                list6 += "," + $scope.BookingTypesArray[i].BookingTypeId;
            }
        }
        if (list6.charAt(0) === ",") {
            list6 = list6.slice(1);
        }

        var req = {
            "Fromdate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_StartDate), "yyyy-MM-dd"),
            "Todate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_EndDate), "yyyy-MM-dd"),
            "HospitalIdsList": HospitalIdsList.length > 0 ? HospitalIdsList : "",
            "DoctorsIds": newlist || "",
            //"VisitTypeId": $scope.GetDataOnMainDashBoardObj.VisitTypeId || null,
            "AppointmentTypeIds": newlist2,
            "VisitReasons": newlist1,
            //"AppointmentStatusIds": list5 || "",
            "BookingStatusIds": list4 || "",
            "BookingTypeIds": list6 || "",
            // "BookingTypeIds": list6 || "",
            // "StatusIds": list3,
            "DashboardType": 11
        };
        eHnoteMainDashboardDataServices.GetDashboardAppointmentDetails(req).then(function (resp) {
            if (resp.data.status === "Success") {
                if (resp.data.rows.length > 0) {
                    let tempArray = [];
                    angular.forEach(resp.data.rows, function (kitem) {
                        kitem.ContentShow = false;
                        angular.forEach(kitem.AppointmentDetails, function (hitem) {
                            let today = $filter('date')(new Date(), "yyyy-MM-dd");
                            let datetime = today + " " + hitem.StartTime;
                            hitem.StartTime = $filter('date')(new Date(datetime), "hh:mm a");
                            tempArray.push(hitem);
                        });
                    });
                    $scope.ListCountsObj.RescheduleAppointmentsCount = tempArray.length || 0;
                }
                $scope.DashboardRescheduleApptDetails = angular.copy(resp.data.rows);

                if (type == "export") {
                    generateTableNew($scope.DashboardRescheduleApptDetails, $scope.viewtype);
                }

            }

        }, function () {


        });
    }

    function generateTableDailyReport(jsonData, typeValue) {
        var headerdata = [];
        var colHeader = [];
        headerdata = jsonData.filter(function (i, n) {
            return ((i.Type >= 1 && i.Type <= 5));
        });
        for (var i = 0; i < headerdata.length; i++) {
            colHeader.push(headerdata[i].Name);
            colHeader.push(headerdata[i].Amount);
        }
        // CREATE DYNAMIC TABLE.
        var table = document.createElement("table");
        table.style = "border: 1px solid #000;";

        var tr = table.insertRow(-1);
        // TABLE ROW.

        var tabHead = tr.insertCell(-1);
        tabHead.style = "width:96px;border: 1px solid #000;text-align:center;font-weight: bold; font-size:18px;";
        tabHead.colSpan = 6;
        tabHead.innerHTML = "Daily Report";
        // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.
        var tr = table.insertRow(-1);               // TABLE ROW.

        var tabHead = tr.insertCell(-1);
        tabHead.style = "width:96px;border: 1px solid #000;text-align:center;font-weight: bold;";
        tabHead.colSpan = 6;
        tabHead.innerHTML = $scope.reportSearch.HospitalObj.ClinicName;

        tr = table.insertRow(-1);
        tabHead = tr.insertCell(-1);
        tabHead.style = "width:96px;border: 1px solid #000;text-align:center;";
        tabHead.colSpan = 6;
        tabHead.innerHTML = $scope.reportSearch.HospitalObj.Address1 + ' ' +
            $scope.reportSearch.HospitalObj.Address2 + ' ' + $scope.reportSearch.HospitalObj.MobileNumber;

        tr = table.insertRow(-1);
        var tabHead1 = tr.insertCell(-1);
        tabHead1.style = "width:96px;border: 1px solid #000;text-align:center;font-weight: bold;";
        tabHead1.colSpan = 6;
        //tabHead1.innerHTML = "DAILY REPORT [" + new Date().toLocaleString() + "]"
        tabHead1.innerHTML = "Date:" + $scope.reportSearch.FromDate;

        tr = table.insertRow(-1);
        for (var i = 0; i < colHeader.length; i++) {
            if ((i + 1) % 6 === 1 || i === 0) {
                tr = table.insertRow(-1);
            }
            //tr.style = "border: 1px solid #000;";
            var tabCell = tr.insertCell(-1);
            tabCell.style = "width:96px;border: 1px solid #000;";
            tabCell.innerHTML = colHeader[i];
        }

        headerdata = jsonData.filter(function (i, n) {
            return (i.Type >= 9 && i.Type <= 14);
        });

        tr = table.insertRow(-1);
        var tabExp = tr.insertCell(-1);
        tabExp.style = "width:96px;border: 1px solid #000;";
        tabExp.innerHTML = headerdata[0].Name;
        tabExp = tr.insertCell(-1);
        tabExp.style = "width:96px;border: 1px solid #000;";
        tabExp.innerHTML = headerdata[0].Amount;

        tabExp = tr.insertCell(-1);
        tabExp.style = "width:96px;border: 1px solid #000;";
        tabExp.innerHTML = headerdata[1].Name;
        tabExp = tr.insertCell(-1);
        tabExp.style = "width:96px;border: 1px solid #000;";
        tabExp.innerHTML = parseFloat(headerdata[1].Amount); //headerdata[1].Amount

        tabExp = tr.insertCell(-1);
        tabExp.style = "width:96px;border: 1px solid #000;";
        tabExp.innerHTML = headerdata[2].Name;
        tabExp = tr.insertCell(-1);
        tabExp.style = "width:96px;border: 1px solid #000;";
        tabExp.innerHTML = parseFloat(headerdata[2].Amount);//headerdata[2].Amount

        tr = table.insertRow(-1);

        tabExp = tr.insertCell(-1);
        tabExp.style = "width:96px;border: 1px solid #000;";
        tabExp.innerHTML = headerdata[3].Name;
        tabExp = tr.insertCell(-1);
        tabExp.style = "width:96px;border: 1px solid #000;";
        tabExp.innerHTML = parseFloat(headerdata[3].Amount);  //headerdata[3].Amount

        tabExp = tr.insertCell(-1);
        tabExp.style = "width:96px;border: 1px solid #000;";
        tabExp.innerHTML = headerdata[4].Name;
        tabExp = tr.insertCell(-1);
        tabExp.style = "width:96px;border: 1px solid #000;";
        tabExp.innerHTML = parseFloat(headerdata[4].Amount);//headerdata[4].Amount

        tabExp = tr.insertCell(-1);
        tabExp.style = "width:96px;border: 1px solid #000;";
        tabExp.innerHTML = headerdata[5].Name;
        tabExp = tr.insertCell(-1);
        tabExp.style = "width:96px;border: 1px solid #000;";
        //tabExp.colSpan = 5;
        tabExp.innerHTML = headerdata[5].Amount;

        generateDailyReportPayments(5, jsonData, table);
        generateDailyReportExpenses(8, jsonData, table);

        download(table);
    }

    function generateDailyReportExpenses(typeid, jsonData, table) {
        var cashdata = jsonData.filter(function (i, n) {
            return i.Type === typeid;
        });
        table.insertRow(-1);
        var tr = table.insertRow(-1);
        tr = table.insertRow(-1);

        tr = table.insertRow(-1);
        var tc = tr.insertCell(-1);
        tc.colSpan = 6;
        tc.style = "width:96px;border: 1px solid #000;text-align:center;";
        tc.innerHTML = "EXPENSE DETAILS";

        tr = table.insertRow(-1);
        tc = tr.insertCell(-1);
        tc.colSpan = 5;
        tc.style = "width:96px;border: 1px solid #000;";
        tc.innerHTML = "Description";

        tc = tr.insertCell(-1);
        tc.style = "width:96px;border: 1px solid #000;";
        tc.innerHTML = "Amount";
        var iAmount = 0;
        for (var i = 0; i < cashdata.length; i++) {
            tr = table.insertRow(-1);
            //tr.style = "border: 1px solid #000;";
            var tcDesc = tr.insertCell(-1);
            tcDesc.style = "width:96px;border: 1px solid #000;";
            tcDesc.colSpan = 5;
            tcDesc.innerHTML = cashdata[i].Name;

            var tcAmount = tr.insertCell(-1);
            tcAmount.style = "width:96px;border: 1px solid #000;";
            tcAmount.innerHTML = cashdata[i].Amount;
            iAmount = iAmount + parseInt(cashdata[i].Amount);
        }
        tr = table.insertRow(-1);
        tc = tr.insertCell(-1);
        tc.colSpan = 5;
        tc.style = "width:96px;border: 1px solid #000;text-align:right";
        tc.innerHTML = "Total Amount";
        tc = tr.insertCell(-1);
        tc.style = "width:96px;border: 1px solid #000;";
        tc.innerHTML = iAmount;
    }

    function generateDailyReportPayments(typeid, jsonData, table) {
        var cashdata = jsonData.filter(function (i, n) {
            return i.Type === typeid;
        });
        table.insertRow(-1);
        var tr = table.insertRow(-1);

        for (var i = 0; i < cashdata.length; i++) {


            tr = table.insertRow(-1);

            tr = table.insertRow(-1);
            var tc = tr.insertCell(-1);
            tc.colSpan = 6;
            tc.style = "width:96px;border: 1px solid #000;text-align:center;";
            tc.innerHTML = cashdata[i].Name.toUpperCase() + " PAYMENT DETAILS";

            tr = table.insertRow(-1);
            tc = tr.insertCell(-1);
            tc.style = "width:96px;border: 1px solid #000;";
            tc.innerHTML = "Reg No";

            tc = tr.insertCell(-1);
            tc.colSpan = 3;
            tc.style = "width:96px;border: 1px solid #000;";
            tc.innerHTML = "Patient Name";

            tc = tr.insertCell(-1);
            tc.style = "width:96px;border: 1px solid #000;";
            tc.innerHTML = "Mobile";

            tc = tr.insertCell(-1);
            tc.style = "width:96px;border: 1px solid #000;";
            tc.innerHTML = "Amount";

            if (cashdata[i].Details === undefined || cashdata[i].Details === null) {
                tr = table.insertRow(-1);
                tc = tr.insertCell(-1);
                tc.colSpan = 5;
                tc.style = "width:96px;border: 1px solid #000;text-align:right";
                tc.innerHTML = "Total Amount";
                tc = tr.insertCell(-1);
                tc.style = "width:96px;border: 1px solid #000;";
                tc.innerHTML = "0";
                continue;
            }
            var detailsjsonData = JSON.parse(cashdata[i].Details);
            for (var j = 0; j < detailsjsonData.length; j++) {
                tr = table.insertRow(-1);


                //tr.style = "border: 1px solid #000;";
                var tcRegNo = tr.insertCell(-1);
                tcRegNo.style = "width:96px;border: 1px solid #000;";
                tcRegNo.innerHTML = detailsjsonData[j].RegNo;

                var tcPatName = tr.insertCell(-1);
                tcPatName.style = "width:96px;border: 1px solid #000;";
                tcPatName.colSpan = 3;
                tcPatName.innerHTML = detailsjsonData[j].PatientName;

                var tcMobile = tr.insertCell(-1);
                tcMobile.style = "width:96px;border: 1px solid #000;";
                tcMobile.innerHTML = (detailsjsonData[j].Mobile === 0 ? '' : detailsjsonData[j].Mobile);

                var tcAmount = tr.insertCell(-1);
                tcAmount.style = "width:96px;border: 1px solid #000;";
                tcAmount.innerHTML = detailsjsonData[j].Amount;
            }
            tr = table.insertRow(-1);
            tc = tr.insertCell(-1);
            tc.colSpan = 5;
            tc.style = "width:96px;border: 1px solid #000;text-align:right";
            tc.innerHTML = "Total Amount";
            tc = tr.insertCell(-1);
            tc.style = "width:96px;border: 1px solid #000;";
            tc.innerHTML = cashdata[i].Amount;

        }
    }

    //export code start here


    function generateTable(jsonData, typeValue) {
        var ReportName = "";
        var reports_exportData = [];
        if (typeValue === "Revenue") {
            ReportName = "Total Revenue";
            reports_exportData.length = 0;
            var pay_type;
            angular.forEach(jsonData, function (itemExports) {

                reports_exportData.push({
                    //'Date': moment(itemExports.ConsultationDate).format("DD-MMMM-YYYY"),
                    //'Amount Received': itemExports.TotalRevenue,
                    //'Branch': itemExports.Hospital,
                    //// 'Payment Type': pay_type,
                    //'Doctor Name': itemExports.Doctor,
                    //'Patient': itemExports.Patient
                    'SNO': itemExports.SNO,
                    'Date': moment(itemExports.Date).format("DD-MMMM-YYYY"),
                    'TotalRevenue': itemExports.TotalRevenue,
                    'CardAmount': itemExports.CardAmount,
                    'CashAmount': itemExports.CashAmount,
                    'ChequeAmount': itemExports.ChequeAmount,
                    'Others': itemExports.Others,
                    "Insurance": itemExports.InsuranceAmount,
                    "TotalRevenue": itemExports.TotalRevenue
                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "PatientVisits") {
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Consultation Date': $filter('date')(new Date(itemExports.ConsultationDate), "dd-MMMM-yyyy"),
                    'MR No': itemExports.PatientDisplayId ? itemExports.PatientDisplayId : '',
                    'Patient Name': itemExports.PatientName,
                    'Gender': (itemExports.Sex === 'Female') ? 'Female' : 'Male',
                    'DOB': $filter('date')(new Date(itemExports.DOB), "dd-MMMM-yyyy"),
                    'Doctor Name': itemExports.DoctorName,
                    'Branch': itemExports.Branch
                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "SurgeryTotalRevenue") {
            ReportName = "Surgery Revenue";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {

                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Date': moment(itemExports.Date).format("DD-MMMM-YYYY"),
                    'TotalRevenue': itemExports.TotalRevenue,
                    'CardAmount': itemExports.CardAmount,
                    'CashAmount': itemExports.CashAmount,
                    'ChequeAmount': itemExports.ChequeAmount,
                    'Others': itemExports.Others

                });
            });
            jsonData = reports_exportData;
        }

        else if (typeValue === "SurgeryRevenueDetail") {
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {

                var TreatmentName = "";
                var TreatmentDoctor = "";
                angular.forEach(itemExports.treatment, function (item1, index) {
                    TreatmentName = item1.TreatmentName;
                    TreatmentDoctor = item1.TreatmentDoctor;

                });
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Date': moment(itemExports.Date).format("DD-MMMM-YYYY"),
                    'MR No': itemExports.PatientDisplayId ? itemExports.PatientDisplayId : '',
                    'Patient Name': itemExports.Patient,
                    'Doctor Name': itemExports.Doctor,
                    'Treatment': TreatmentName ? TreatmentName : '',
                    'Treatment Doctor': TreatmentDoctor ? TreatmentDoctor : '',
                    'Branch': itemExports.Hospital,
                    'Amount': itemExports.TotalBilledCost,
                    //'Payment Mode ': itemExports.PaymentMode
                    'Payment Mode ': itemExports.PaymentMode === undefined || itemExports.PaymentMode === null ? '' : itemExports.PaymentMode
                });
            });
            jsonData = reports_exportData;
        }

        else if (typeValue === "AppointmentStats") {
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Appointment Date': $filter('date')(new Date(itemExports.AppointmentDate), "dd-MMMM-yyyy"),
                    'MR No': itemExports.PatientDisplayId ? itemExports.PatientDisplayId : '',
                    'Appointment Time': itemExports.AppointmentStartTime,
                    'Doctor Name': itemExports.DoctorName,
                    'Patient Name': itemExports.PatientName ? itemExports.PatientName : '',
                    'Branch Name': itemExports.Branch,
                    //'Appointment Type': itemExports.AppointmentType,
                    'Category': itemExports.PatientTypeName,
                    'Referral Source': itemExports.ReferralSource,
                    'Checked In': itemExports.CheckedIn,
                    'Status': itemExports.Status
                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "OutStanding") {
            ReportName = "Total OutStanding";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Appointment Date': itemExports.AppointmentDate,
                    'MR No': itemExports.PatientDisplayId ? itemExports.PatientDisplayId : '',
                    'Patient Name': itemExports.PatientName,
                    'Outstanding Amount': itemExports.outstanding,
                    'Branch': itemExports.Branch,
                    'Doctor Name': itemExports.Doctor
                });
            });
            jsonData = reports_exportData;
        }




        else if (typeValue === "PatientDetails") {
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Consultation Date': itemExports.ConsultationDate,
                    'MR No': itemExports.PatientDisplayId ? itemExports.PatientDisplayId : '',
                    'Patient Name': itemExports.PatientName,
                    'Gender': itemExports.Gender,
                    'Age': itemExports.Age,
                    'Contact': itemExports.Contact,
                    'EmailId': itemExports.EmailId,
                    'Doctor Name': itemExports.DoctorName,
                    'Hospital': itemExports.Hospital
                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "Labreport") {
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Name': itemExports.name,
                    'Test Name': itemExports.Testname,
                    'lab Count': itemExports.labCount
                });
            });
            jsonData = reports_exportData;
        } else if (typeValue === "treatmentRevenueData") {
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Date': $filter('date')(new Date(itemExports.AppointmentDate), "dd-MMMM-yyyy"),
                    'First Name': itemExports.FirstName,
                    'GST No': itemExports.PatientGSTNo ? itemExports.PatientGSTNo : '',
                    'Treatment Name': itemExports.TreatmentName,
                    'Procedure Cost': itemExports.ProcedureCost,
                    'Units': itemExports.Multiplyfactor,
                    'Cgst': itemExports.Cgst,
                    'Sgst': itemExports.Sgst,
                    'Tax Amount': itemExports.Tax,
                    'Discount Amount': itemExports.DiscountAmount,
                    'Total': itemExports.Total
                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "branchwiseData") {
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Branch': itemExports.Branch,
                    'Revenue': itemExports.Revenue,
                    'outstanding ': itemExports.outstanding
                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "RevenueDetail") {
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Date': moment(itemExports.Date).format("DD-MMMM-YYYY"),
                    'MR No': itemExports.PatientDisplayId ? itemExports.PatientDisplayId : '',
                    'Patient Name': itemExports.Patient,
                    'Doctor Name': itemExports.Doctor,
                    'Treatment Doctor': itemExports.TreatmentDoctordata ? itemExports.TreatmentDoctordata : '',
                    'Branch': itemExports.Hospital,
                    'Treatment': itemExports.TreatmentData ? itemExports.TreatmentData : '',
                    'Amount': itemExports.TotalBilledCost,
                    'CreatedBy': itemExports.CreatedBy,
                    //'Payment Mode ': itemExports.PaymentMode
                    'Payment Mode ': itemExports.PaymentMode === undefined || itemExports.PaymentMode === null ? '' : itemExports.PaymentMode
                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "InsuranceRevenueDetails") {
            ReportName = "Insurance Revenue Report";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Date': moment(itemExports.Date).format("DD-MMMM-YYYY"),
                    'MR No': itemExports.PatientDisplayId ? itemExports.PatientDisplayId : '',
                    'Patient Name': itemExports.Patient,
                    'Doctor Name': itemExports.Doctor,
                    'Treatment Doctor': itemExports.TreatmentDoctordata ? itemExports.TreatmentDoctordata : '',
                    'Branch': itemExports.Hospital,
                    'Treatment': itemExports.TreatmentData ? itemExports.TreatmentData : '',
                    'Amount': itemExports.TotalBilledCost,
                    'CreatedBy': itemExports.CreatedBy,
                    //'Payment Mode ': itemExports.PaymentMode
                    'Payment Mode': itemExports.PaymentMode === undefined || itemExports.PaymentMode === null ? '' : itemExports.PaymentMode
                });
            });
            jsonData = reports_exportData;
        }

        else if (typeValue === "FollowupAppointmentStats") {

            ReportName = "Followup Appointments";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Appointment Date': $filter('date')(new Date(itemExports.AppointmentDate), "dd-MMMM-yyyy"),
                    'MR No': itemExports.PatientDisplayId ? itemExports.PatientDisplayId : '',
                    'Appointment Time': itemExports.AppointmentStartTime,
                    'Doctor Name': itemExports.DoctorName,
                    'Patient Name': itemExports.PatientName ? itemExports.PatientName : '',
                    'Branch Name': itemExports.Branch,
                    'Appointment Type': itemExports.AppointmentType,
                    'Category': itemExports.PatientTypeName,
                    'Status': itemExports.Status
                });
            });
            jsonData = reports_exportData;
        }

        else if (typeValue === "OldAppointmentStats") {
            ReportName = "Old Appointments";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Appointment Date': $filter('date')(new Date(itemExports.AppointmentDate), "dd-MMMM-yyyy"),
                    'MR No': itemExports.PatientDisplayId ? itemExports.PatientDisplayId : '',
                    'Appointment Time': itemExports.AppointmentStartTime,
                    'Doctor Name': itemExports.DoctorName,
                    'Patient Name': itemExports.PatientName ? itemExports.PatientName : '',
                    'Branch Name': itemExports.Branch,
                    'Appointment Type': itemExports.AppointmentType,
                    'Category': itemExports.PatientTypeName,
                    'Checked In': itemExports.CheckedIn,
                    'Status': itemExports.Status
                });
            });
            jsonData = reports_exportData;
        }

        else if (typeValue === "AllAppointments") {
            ReportName = "Total Appointments";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Appointment Date': $filter('date')(new Date(itemExports.AppointmentDate), "dd-MMMM-yyyy"),
                    'MR No': itemExports.PatientDisplayId ? itemExports.PatientDisplayId : '',
                    'Appointment Time': itemExports.AppointmentStartTime,
                    'Doctor Name': itemExports.DoctorName,
                    'Patient Name': itemExports.PatientName ? itemExports.PatientName : '',
                    'Gender': itemExports.Gender,
                    'Age': itemExports.Age ? itemExports.Age : '',
                    'Branch Name': itemExports.Branch,
                    'Appointment Type': itemExports.AppointmentType,
                    'Category': itemExports.PatientTypeName,
                    'Referral Source': itemExports.ReferralSource,
                    'Checked In': itemExports.CheckedIn,
                    'Status': itemExports.Status
                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "SurgeryAppointmentStats") {

            ReportName = "Surgery Appointment";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Appointment Date': $filter('date')(new Date(itemExports.AppointmentDate), "dd-MMMM-yyyy"),
                    'MR No': itemExports.PatientDisplayId ? itemExports.PatientDisplayId : '',
                    'Appointment Time': itemExports.AppointmentStartTime,
                    'Doctor Name': itemExports.DoctorName,
                    'Patient Name': itemExports.PatientName ? itemExports.PatientName : '',
                    'Branch Name': itemExports.Branch,
                    'Appointment Type': itemExports.AppointmentType,
                    'Category': itemExports.PatientTypeName,
                    'Checked In': itemExports.CheckedIn,
                    'Status': itemExports.Status
                });
            });
            jsonData = reports_exportData;
        }

        else if (typeValue === "DiagnosisReport") {
            ReportName = "Diagnosis Report";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Diagnosis Name': itemExports.TemplateTitle,
                    'Branch Name': itemExports.Name,
                    'Diagnosis Count': itemExports.DiagnosisCount
                });
            });
            jsonData = reports_exportData;
        }

        else if (typeValue === "PharmacySale") {
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'MR No': itemExports.PatientDisplayId ? itemExports.PatientDisplayId : 'OutPatient',
                    'Patient Name': itemExports.PatientName,
                    'Branch Name': itemExports.Branch,
                    'Total Amount': itemExports.TotalAmount
                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "MissedAppointments") {

            ReportName = "Missed Appointments";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Appointment Date': itemExports.AppointmentDate,
                    'MR NO': itemExports.PatientDisplayId,
                    'AppointmentStart Time': itemExports.AppointmentEndTime,
                    'Patient Name': itemExports.PatientName,
                    'Doctor Name': itemExports.DoctorName ? itemExports.DoctorName : '',
                    'Branch Name': itemExports.Branch,
                    'Appointment Type': itemExports.AppointmentType,
                    'Category': itemExports.PatientTypeName

                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "PaidFollowupAppointments") {
            ReportName = "PaidFollowup Appointments";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Appointment Date': itemExports.AppointmentDate,
                    'MR NO': itemExports.PatientDisplayId,
                    'AppointmentStart Time': itemExports.AppointmentEndTime,
                    'Patient Name': itemExports.PatientName,
                    'Doctor Name': itemExports.DoctorName ? itemExports.DoctorName : '',
                    'Branch Name': itemExports.Branch,
                    'Appointment Type': itemExports.AppointmentType,
                    'Category': itemExports.PatientTypeName,
                    'Checked In': itemExports.CheckedIn,
                    'Status': itemExports.Status

                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "OpticalSale") {
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'MR No': itemExports.PatientDisplayId ? itemExports.PatientDisplayId : 'OutPatient',
                    'Patient Name': itemExports.PatientName,
                    'Branch Name': itemExports.Branch,
                    'Total Amount': itemExports.TotalAmount

                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "CancelledAppointments") {

            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Appointment Date': itemExports.AppointmentDate,
                    'Appointment StartTime': itemExports.AppointmentStartTime,
                    'MR No': itemExports.PatientDisplayId ? itemExports.PatientDisplayId : 'OutPatient',
                    'Patient Name': itemExports.PatientName,
                    'Doctor Name': itemExports.DoctorName,
                    'Appointment Type': itemExports.AppointmentType,
                    'Category': itemExports.PatientTypeName,
                    'Branch Name': itemExports.Branch,
                    'Checked In': itemExports.CheckedIn,
                    'Status': itemExports.Status,
                    'Reason': itemExports.CancelReason
                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "TreatmentRevenue") {
            ReportName = "Treatment Revenue";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Name': itemExports.Name,
                    'Amount': itemExports.Amount

                });
            });
            jsonData = reports_exportData;
        }

        else if (typeValue === "AdvicedGlassReportByConsultation") {
            ReportName = "AdvicedGlassReportByConsultation";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    "Appointment Date": moment(itemExports.AppointmentDate).format("DD-MMM-YYYY"),
                    "MR NO": itemExports.MRNO,
                    "Patient Name": itemExports.PatientName,
                    "Gender": itemExports.Gender,
                    "Mobile No": itemExports.MobileNo,
                    " New Glass LensType": itemExports.NewGlassLensType,
                    "New Glass LensCoating": itemExports.NewGlassLensCoating,
                    "Glass Suggested Date": moment(itemExports.GlassSuggestedDate).format("DD-MMM-YYYY"),
                    "Glass Modified Date": moment(itemExports.GlassModifiedDate).format("DD-MMM-YYYY"),
                    "Branch": itemExports.OrgName,
                    "Appointment Doctor": itemExports.AppointmentDoctor,
                    "Adviced By": itemExports.AdvicedBy
                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "GlassConvertionReport") {
            ReportName = "GlassConvertionReport";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    //"Bill Id": itemExports.InvoiceId,
                    "MR NO": itemExports.MRNO,
                    "Receipt Id": itemExports.ReceiptId,
                    "Patient Name": itemExports.PatientName,
                    "AppointmentDate": moment(itemExports.AppointmentDate).format("DD-MMM-YYYY"),
                    // "AppointmentId": itemExports.AppointmentId,
                    "Product": itemExports.Product,
                    "Model": itemExports.Model,
                    "Coating": itemExports.CoatingName,
                    "Power": itemExports.PowerName,
                    "Size": itemExports.SizeName,
                    "Colour": itemExports.ColourName
                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "OutPatientReVenue") {
            ReportName = "OutPatient ReVenue";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Name': itemExports.Name,
                    'Amount': Math.round(itemExports.Amount)
                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "SurgeryRevenue") {
            ReportName = "Surgery Revenue";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Name': itemExports.Name,
                    'Amount': itemExports.Amount

                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "InvestigationRevenue") {
            ReportName = "Investigation Revenue";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Name': itemExports.Name ? itemExports.Name : '',
                    'Amount': itemExports.Amount.toFixed(2)

                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "LabRevenue") {
            ReportName = "Lab Revenue";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Name': itemExports.Name,
                    'Amount': itemExports.Amount

                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "Incentive") {
            ReportName = "Incentive Report";
            reports_exportData.length = 0;
            if (doctorinfo.doctordata.User[0].SpecializationId === 2) {
                angular.forEach(jsonData, function (itemExports) {
                    reports_exportData.push({
                        'SNO': itemExports.SNO,
                        'Date': $filter('date')(new Date(itemExports.BillingDate), "dd-MMMM-yyyy"),
                        'MR No': itemExports.PatientDisplayId,
                        'Patient Name': itemExports.FirstName,
                        "Receipt No": itemExports.ReceiptId,
                        'Procedure Type': itemExports.ProcedureType,
                        'Treatment Name': itemExports.ProcedureName ? itemExports.ProcedureName : '',
                        'Total Amount': itemExports.TotalAmount,
                        'Conversion Doctor Name': itemExports.ConversionDoctorName ? itemExports.ConversionDoctorName : '',
                        'Conversion Amount': itemExports.ConversionAmount ? itemExports.ConversionAmount : '',
                        'Treatment Doctor Name': itemExports.TreatmentDoctorName ? itemExports.TreatmentDoctorName : '',
                        'Treatment Amount': itemExports.TreatmentAmount ? itemExports.TreatmentAmount : '',
                        'Consultant Doctor Name': itemExports.ConsultantDoctorName ? itemExports.ConsultantDoctorName : '',
                        'Region': itemExports.Region ? itemExports.Region : '',
                        'State': itemExports.State ? itemExports.State : ''
                    });
                });
            }
            else {
                angular.forEach(jsonData, function (itemExports) {
                    reports_exportData.push({
                        'SNO': itemExports.SNO,
                        'Date': $filter('date')(new Date(itemExports.BillingDate), "dd-MMMM-yyyy"),
                        'MR No': itemExports.PatientDisplayId,
                        'Patient Name': itemExports.FirstName,
                        "Receipt No": itemExports.ReceiptId,
                        'Total Amount': itemExports.TotalAmount,
                        'Treatment Name': itemExports.ProcedureName,
                        'Treatment Doctor Name': itemExports.TreatmentDoctorName ? itemExports.TreatmentDoctorName : '',
                        'TreatmentAmount': itemExports.TreatmentAmount ? itemExports.TreatmentAmount : '',
                        'Consultant Doctor Name': itemExports.ConsultantDoctorName ? itemExports.ConsultantDoctorName : '',
                        'Region': itemExports.Region ? itemExports.Region : '',
                        'State': itemExports.State ? itemExports.State : ''
                    });
                });
            }



            jsonData = reports_exportData;
        }
        else if (typeValue === "TreatmentReport") {
            ReportName = "Treatment Report";
            reports_exportData.length = 0;
            if (doctorinfo.doctordata.User[0].SpecializationId === 2) {
                angular.forEach(jsonData, function (itemExports) {
                    //itemExports.CardNumber = itemExports.CardNumber.replace(/.(?=.{4})/g, 'x');
                    // itemExports.CardNumber = itemExports.CardNumber.replace(/\d{4}(?= \d{4})/g, "xxxx");
                    var PaymentType = "";
                    angular.forEach(itemExports.PaymentType, function (item1, index) {
                        if (itemExports.PaymentType.length - 1 === index) {
                            PaymentType += item1.Name;
                        }
                        else {
                            PaymentType += item1.Name + ',';
                        }
                    });

                    reports_exportData.push({
                        'SNO': itemExports.SNO,
                        'Date': $filter('date')(new Date(itemExports.BillingDate), "dd-MMMM-yyyy"),
                        'OP No': itemExports.PatientDisplayId,
                        'Patient Name': itemExports.FirstName,
                        "Branch Name": itemExports.OrgName,
                        // "Department": itemExports.ProcedureType,
                        "Code": itemExports.ProcCode,
                        'Procedure': itemExports.Name,
                        'Treatment Doctor Name': itemExports.TreatmentDoctorName ? itemExports.TreatmentDoctorName : '',
                        'Converting Doctor Name': itemExports.ConversionDoctorName ? itemExports.ConversionDoctorName : '',
                        'Mode Of Payment': PaymentType ? PaymentType : '',
                        'Branch Receipt No': itemExports.ReceiptId,
                        'Transaction Id': itemExports.TransactionNumber,
                        'Card Last 4 Digits Number': itemExports.CardNumber,
                        'Card Type': itemExports.CardType,
                        'Amount': itemExports.TotalAmount,
                        'Region': itemExports.Region ? itemExports.Region : '',
                        'State': itemExports.State ? itemExports.State : ''
                    });
                });
            } else {
                angular.forEach(jsonData, function (itemExports) {
                    //itemExports.CardNumber = itemExports.CardNumber.replace(/.(?=.{4})/g, 'x');
                    //   itemExports.CardNumber = itemExports.CardNumber.replace(/\d{4}(?= \d{4})/g, "xxxx");
                    var PaymentType = "";
                    angular.forEach(itemExports.PaymentType, function (item1, index) {
                        if (itemExports.PaymentType.length - 1 === index) {
                            PaymentType += item1.Name;
                        }
                        else {
                            PaymentType += item1.Name + ',';
                        }
                    });
                    reports_exportData.push({
                        'SNO': itemExports.SNO,
                        'Date': $filter('date')(new Date(itemExports.BillingDate), "dd-MMMM-yyyy"),
                        'OP No': itemExports.PatientDisplayId,
                        'Patient Name': itemExports.FirstName,
                        "Branch Name": itemExports.OrgName,
                        "Department": itemExports.ProcedureType,
                        "Code": itemExports.ProcCode,
                        'Procedure': itemExports.Name,
                        'Treatment Doctor Name': itemExports.TreatmentDoctorName ? itemExports.TreatmentDoctorName : '',
                        // 'Converting Doctor Name': itemExports.ConversionDoctorName ? itemExports.ConversionDoctorName : '',
                        'Mode Of Payment': PaymentType ? PaymentType : '',
                        'Branch Receipt No': itemExports.ReceiptId,
                        'Transaction Id': itemExports.TransactionNumber,
                        'Card Last 4 Digits Number': itemExports.CardNumber,
                        'Card Type': itemExports.CardType,
                        'Amount': itemExports.TotalAmount,
                        'Region': itemExports.Region ? itemExports.Region : '',
                        'State': itemExports.State ? itemExports.State : ''
                    });
                });
            }

            jsonData = reports_exportData;
        }
        //else if (typeValue === "DayWiseCollection") {
        //    reports_exportData.length = 0;
        //    angular.forEach(jsonData, function (itemExports) {
        //        reports_exportData.push({
        //            'Mode of Payment': itemExports.RowLabels ? itemExports.RowLabels : '',
        //            'Out Patient': itemExports.OutPatient,
        //            'Investigation': itemExports.Investigation,
        //            'Surgery': itemExports.Surgery,
        //            'Procedures': itemExports.Procedures,
        //            'Pharmacy': itemExports.Pharmacy,
        //            'Optical': itemExports.Optical,
        //            'TotalCost': itemExports.GrandTotal

        //        });
        //    });
        //    jsonData = reports_exportData;
        //}



        else if (typeValue === "DailyReport") {
            ReportName = "Daily Report";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports, Index) {
                reports_exportData.push({
                    'Sl.No': Index + 1,
                    'Particulars': itemExports.Name,
                    'Details': itemExports.Value
                    //"Receipt No": itemExports.ReceiptId,
                    //'Total Amount': itemExports.TotalAmount,
                    //'Treatment Name': itemExports.ProcedureName,
                    //'Conversion Amount': itemExports.ConversionAmount,f
                    //'TreatmentAmount': itemExports.TreatmentAmount
                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "ReferralReport") {
            ReportName = "Referral Report";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports, Index) {
                reports_exportData.push({
                    'SNO': Index + 1,
                    //'Doctor': itemExports.Doctor ? itemExports.Doctor : '',
                    'Source': itemExports.RefSourceName || "",
                    //'Paid Followup': itemExports.PaidFollowup,
                    //'Free Followup': itemExports.FreeFollowup,
                    // 'Total': itemExports.Total
                    'Total': itemExports.ReferralCount

                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "Doctor OPD Report") {
            ReportName = "Doctor OPD Report";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Doctor': itemExports.Doctor ? itemExports.Doctor : '',
                    'New Patients': itemExports.NewPatients,
                    'Old Patients': itemExports.OldPatients,
                    'Paid Followup': itemExports.PaidFollowup,
                    'Free Followup': itemExports.FreeFollowup,
                    'Total Patients': itemExports.TotalPatients,
                    'Total Amount': itemExports.TotalAmount

                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "Out Patient Report") {
            ReportName = "Out Patient Report";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Doctor': itemExports.Doctor ? itemExports.Doctor : '',
                    'New Patients': itemExports.NewPatients,
                    'Old Patients': itemExports.OldPatients,
                    'Paid Followup': itemExports.PaidFollowup,
                    'Free Followup': itemExports.FreeFollowup,
                    'Total Patients': itemExports.TotalPatients


                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "Patient Category Report") {
            ReportName = "Patient Category Report";
            reports_exportData.length = 0;

            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Category': itemExports.Category,
                    'Total': itemExports.Total
                    //"From Date": $scope.reportSearch.FromDate,
                    //"To Date": $scope.reportSearch.ToDate,
                    //"Hospital Name": $scope.reportSearch.HospitalObj.ClinicName

                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "Doctor Surgery  Report") {
            ReportName = "Doctor Surgery  Report";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Mr NO': itemExports.MRNO,
                    'Patient Name': itemExports.PatientName,
                    'Age': itemExports.Age,
                    'Sex': itemExports.Sex,
                    'Mobile No': itemExports.MobileNo ? itemExports.MobileNo : '',
                    'Procedure': itemExports.Procedure,
                    'Doctor': itemExports.Doctor,
                    'Branch': itemExports.Branch,
                    'Counselor': itemExports.Counselor,
                    'Remarks': itemExports.Remarks



                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "Surgery Performed Report") {
            ReportName = "Surgery Performed Report";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Mr NO': itemExports.MRNO,
                    'Patien tName': itemExports.PatientName,
                    'Date': $filter("date")(itemExports.SuggestedDate, "dd-MM-yyyy"),
                    // 'Age': itemExports.Age,
                    //   'Sex': itemExports.Sex,
                    //   'Mobile No': itemExports.MobileNo ? itemExports.MobileNo : '',
                    'Category': itemExports.Category,
                    'Surgery': itemExports.SurgeryName,
                    'PackageName': itemExports.PackageName,
                    'Doctor': itemExports.Doctor,
                    'Counselor': itemExports.Counselor,
                    'Status': itemExports.Status,
                    'Branch': itemExports.Branch,
                    'Remarks': itemExports.Remarks


                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "Procedure Report") {
            ReportName = "Procedure Report";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Date': $filter("date")(itemExports.Date, "dd-MM-yyyy"),
                    'Mr NO': itemExports.MRNO,
                    'PatientName': itemExports.PatientName,
                    'Age': itemExports.Age,
                    'Sex': itemExports.Sex,
                    'Mobile No': itemExports.MobileNo ? itemExports.MobileNo : '',
                    'Procedure': itemExports.Procedure,
                    'Doctor': itemExports.Doctor,
                    'Branch': itemExports.Branch



                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "Investigation Report") {
            ReportName = "Investigation Report";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Date': $filter("date")(itemExports.Date, "dd-MM-yyyy"),
                    'Mr NO': itemExports.MRNO,
                    'PatientName': itemExports.PatientName,
                    'Age': itemExports.Age,
                    'Sex': itemExports.Sex,
                    'Mobile No': itemExports.MobileNo ? itemExports.MobileNo : '',
                    'Investigation': itemExports.Investigation,
                    'Doctor': itemExports.Doctor,
                    'Branch': itemExports.Branch



                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "Surgery Cost Report") {
            ReportName = "Surgery Cost Report";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Mr NO': itemExports.MRNO,
                    'Patient Name': itemExports.PatientName,
                    'Age': itemExports.Age,
                    'Sex': itemExports.Sex,
                    'Mobile No': itemExports.MobileNo ? itemExports.MobileNo : '',
                    'Procedure': itemExports.Procedure,
                    'Admission Id': itemExports.AdmissionId,
                    'SurgeryPackageCost': itemExports.SurgeryPackageCost,
                    'Doctor': itemExports.Doctor,
                    'Branch': itemExports.Branch,
                    'Counselor': itemExports.Counselor,
                    'Remarks': itemExports.Remarks



                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "Investigation Cost Report") {
            ReportName = "Investigation Cost Report";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Mr NO': itemExports.MRNO,
                    'Patient Name': itemExports.PatientName,
                    'Age': itemExports.Age,
                    'Sex': itemExports.Sex,
                    'Mobile No': itemExports.MobileNo ? itemExports.MobileNo : '',
                    'Investigation': itemExports.Investigation,
                    'Price': itemExports.Cost,
                    'Doctor': itemExports.Doctor,
                    'Branch': itemExports.Branch



                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "Procedure Cost Report") {
            ReportName = "Procedure Cost Report";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Mr NO': itemExports.MRNO,
                    'Patient Name': itemExports.PatientName,
                    'Age': itemExports.Age,
                    'Sex': itemExports.Sex,
                    'Mobile No': itemExports.MobileNo ? itemExports.MobileNo : '',
                    'Procedure': itemExports.Procedure,
                    'Price': itemExports.Cost,
                    'Doctor': itemExports.Doctor,
                    'Branch': itemExports.Branch



                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "Lab Report") {
            ReportName = "Lab Report";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Date': $filter("date")(itemExports.Date, "dd-MM-yyyy"),
                    'Mr NO': itemExports.MRNO,
                    'Patient Name': itemExports.PatientName,
                    'Age': itemExports.Age,
                    'Sex': itemExports.Sex,
                    'Mobile No': itemExports.MobileNo ? itemExports.MobileNo : '',
                    'Lab': itemExports.Lab,
                    'Doctor': itemExports.Doctor,
                    'Branch': itemExports.Branch



                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "Lab Cost Report") {
            ReportName = "Lab Cost Report";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Mr NO': itemExports.MRNO,
                    'PatientName': itemExports.PatientName,
                    'Age': itemExports.Age,
                    'Sex': itemExports.Sex,
                    'Mobile No': itemExports.MobileNo ? itemExports.MobileNo : '',
                    'Lab': itemExports.Lab,
                    'Price': itemExports.Cost,
                    'Doctor': itemExports.Doctor,
                    'Branch': itemExports.Branch



                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "Surgery Performed Count Report") {
            ReportName = "Surgery Performed Count Report";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Surgery': itemExports.PackageName,
                    // 'Surgery Package Name': itemExports.SurgeryPackageName,
                    //'Surgery Cost': itemExports.SurgeryCost,
                    'Doctor': itemExports.Doctor,
                    'Counselor': itemExports.Counselor,
                    'Branch': itemExports.Branch,
                    'Total': itemExports.Total


                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "Investigation Count Report") {
            ReportName = "Investigation Count Report";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Investigation': itemExports.Investigation,
                    //'Investigation Cost': itemExports.InvestigationCost,
                    'Branch': itemExports.Branch,
                    'Doctor': itemExports.Doctor,
                    'Total': itemExports.Total


                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "ReferralWise Cost Report") {
            ReportName = "ReferralWise Cost Report";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Source': itemExports.Source,
                    'Amount': itemExports.Amount

                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "Form3c Report") {
            ReportName = "Form3c Report";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                var ProcedureName = "";
                angular.forEach(itemExports.BilingDetails, function (item1, index) {
                    if (itemExports.BilingDetails.length - 1 === index) {
                        ProcedureName += item1.ProcedureName;
                    }
                    else {
                        ProcedureName += item1.ProcedureName + ',';
                    }
                });

                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Date Of Receipt': itemExports.DateOfReceipt,
                    'Mr NO': itemExports.MRNO,
                    'Patient Name': itemExports.PatientName,
                    'Procedure Type': ProcedureName,
                    'Receipt Id': itemExports.ReceiptId,
                    'Fee Received': itemExports.FeeReceived

                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "Advance Amount") {
            ReportName = "Advance Amount";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Patient Id': itemExports.PatientDisplayId,
                    'Patient Name': itemExports.PatientName,
                    'Branch': itemExports.Branch,
                    'Payment Type': itemExports.PaymentType,
                    'Amount': itemExports.Amount

                });
            });
            jsonData = reports_exportData;
        }

        else if (typeValue === "Investigation") {
            ReportName = "Investigation Revenue Report";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Appointment Date': itemExports.AppointmentDate,
                    'Bill Date': itemExports.BillDate,
                    'Patient Id': itemExports.MRNO,
                    'Patient Name': itemExports.PatientName,
                    'Branch': itemExports.Branch,
                    'Doctor': itemExports.Doctor,
                    'Investigation': itemExports.Investigation,
                    'Price': itemExports.Cost,
                    'Paid': itemExports.BilledCost,
                    'Waived Off': itemExports.IsWaved ? 'Yes' : 'No'

                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "Surgery") {
            ReportName = "Surgery Revenue Report";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    //  'Appointment Date': itemExports.AppointmentDate,
                    'Admission Date': itemExports.AdmissionDate,
                    'Bill Date': itemExports.BillDate,
                    'Patient Id': itemExports.MRNO,
                    'Patient Name': itemExports.PatientName,
                    'Branch': itemExports.Branch,
                    'Doctor': itemExports.Doctor,
                    'Procedure': itemExports.Procedure,
                    'Price': itemExports.SurgeryPackageCost,
                    'Paid': itemExports.BilledCost,
                    'Waived Off': itemExports.IsWaved ? 'Yes' : 'No'

                });
            });
            jsonData = reports_exportData;
        }

        else if (typeValue === "Lab") {
            ReportName = "Lab Revenue Report";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Appointment Date': itemExports.AppointmentDate,
                    'Bill Date': itemExports.BillDate,
                    'Patient Id': itemExports.MRNO,
                    'Patient Name': itemExports.PatientName,
                    'Branch': itemExports.Branch,
                    'Doctor': itemExports.Doctor,
                    'Investigation': itemExports.Investigation,
                    'Price': itemExports.Cost,
                    'Paid': itemExports.BilledCost,
                    'Waived Off': itemExports.IsWaved ? 'Yes' : 'No'

                });
            });
            jsonData = reports_exportData;
        }

        else if (typeValue === "Procedure") {
            ReportName = "Treatment Revenue Report";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Appointment Date': itemExports.AppointmentDate,
                    'Bill Date': itemExports.BillDate,
                    'Patient Id': itemExports.MRNO,
                    'Patient Name': itemExports.PatientName,
                    'Branch': itemExports.Branch,
                    'Doctor': itemExports.Doctor,
                    'Procedure': itemExports.Procedure,
                    'Price': itemExports.Cost,
                    'Paid': itemExports.BilledCost,
                    'Waived Off': itemExports.IsWaved ? 'Yes' : 'No'

                });
            });
            jsonData = reports_exportData;
        }
        //optical
        else if (typeValue === "Purchase") {
            ReportName = "Purchase Report";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    "GRN No": itemExports.PurchaseInvoiceId,
                    "Invoice No": itemExports.InvoiceNumber,
                    "Inv Date": itemExports.PurchaseDate,
                    //"Discount": itemExports.DiscountValue,
                    "Total": itemExports.TotalAmount,
                    "Branch Name": itemExports.OrganizationName
                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "PurchaseReturns") {
            ReportName = "PurchaseReturns Report";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    "Invoice No": itemExports.OptInvoiceNo,
                    "Return Date": itemExports.ReturnDate,
                    "Product": itemExports.ProductName,
                    "Model": itemExports.Model,
                    "Size": itemExports.Size,
                    "Colour": itemExports.Colour,
                    "Quantity": itemExports.ReturnQuantity,
                    "Return Amount": itemExports.ReturnedAmount,
                    "Branch": itemExports.OrganizationName
                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "Sales") {
            ReportName = "Sales Report";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    // 'SNO': itemExports.SNO,
                    //// "Bill Id": itemExports.BillId,
                    // "Bill Date": itemExports.BillDate,
                    // "Paid Date": itemExports.PaidDate,
                    // "Name": itemExports.PatientName,
                    // "Mobile": itemExports.MobileNo,
                    // "Doctor": itemExports.DoctorName,
                    // "Status": itemExports.Status,
                    // "Total Received": itemExports.TotalReceived,
                    // "Branch": itemExports.OrganizationName

                    "SNO": itemExports.SNO,
                    "Date": $filter("date")(itemExports.Date, "dd-MM-yyyy"),
                    "Cash": itemExports.CashAmount,
                    "Card": itemExports.CardAmount,
                    "Cheque": itemExports.ChequeAmount,
                    "Wallet": itemExports.Others,
                    "TotalRevenue": itemExports.TotalRevenue

                });
            });
            jsonData = reports_exportData;
        }

        else if (typeValue === "saleDetail") {
            ReportName = "Sales Report";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    "SNO": itemExports.SNO,
                    "MR NO": itemExports.MRNO,
                    "Receipt NO": itemExports.ReceiptId,
                    // "Bill Id": itemExports.BillId,
                    "Bill Date": itemExports.BillDate,
                    "Paid Date": itemExports.PaidDate,
                    "Name": itemExports.PatientName,
                    "Mobile": itemExports.MobileNo ? itemExports.MobileNo : '',
                    "Doctor": itemExports.DoctorName,
                    "Status": itemExports.Status,
                    "Total Received": itemExports.TotalReceived,
                    "PaymentMode": itemExports.PaymentMode,
                    "Branch": itemExports.OrganizationName


                });
            });
            jsonData = reports_exportData;
        }

        else if (typeValue === "SalesReturns") {
            ReportName = "SalesReturns Report";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    // "Bill Id": itemExports.BillId,
                    "MR NO": itemExports.MRNO,
                    "Receipt Id": itemExports.ReceiptId,
                    "Bill Date": $filter("date")(itemExports.BillDate, "dd-MM-yyyy"),
                    "Return Date": itemExports.ReturnedDate,
                    "Patient Name": itemExports.PatientName,
                    "Product": itemExports.Product,
                    "Model": itemExports.Model,
                    "Size": itemExports.Size,
                    "Colour": itemExports.Colour,
                    "Quantity": itemExports.ReturnQuantity,
                    "Mobile": itemExports.MobileNo,
                    "Return Amount": itemExports.ReturnedAmount,
                    "Branch": itemExports.OrganizationName
                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "DeliveredOrder") {
            ReportName = "DeliveredOrder Report";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    // "Bill Id": itemExports.BillId,
                    "MR NO": itemExports.MRNO,
                    "Receipt Id": itemExports.ReceiptId,
                    "Bill Date": itemExports.BillDate,
                    "Name": itemExports.PatientName,
                    "MobileNo": itemExports.MobileNo,
                    "Category": itemExports.Category,
                    "Product": itemExports.Product,
                    "Model": itemExports.Model,
                    "Colour": itemExports.Colour,
                    "Size": itemExports.Size,
                    "Deliverd By": itemExports.deliveredBy,
                    "Deliverd Date": itemExports.DeliveryDate
                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "TotalSales") {
            ReportName = "TotalSales Report";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({

                    "MR NO": itemExports.PatientDisplayId,
                    "Receipt NO": itemExports.ReceiptId,
                    "Bill Date": $filter("date")(itemExports.BillDate, "dd-MM-yyyy"),
                    "BillId": itemExports.BillId,
                    "Name": itemExports.PatientName,
                    "Mobile": itemExports.MobileNo ? itemExports.MobileNo : '',
                    "Total Received": itemExports.TotalAmount,
                    "TotalAmount": itemExports.TotalAmount,
                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "Not-Delivered") {
            ReportName = "Not-Delivered Report";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    //"Bill Id": itemExports.BillId,
                    "MR NO": itemExports.MRNO,
                    "Receipt Id": itemExports.ReceiptId,
                    "Bill Date": itemExports.BillDate,
                    "Name": itemExports.PatientName,
                    "MobileNo": itemExports.MobileNo,
                    "Category": itemExports.Category,
                    "Product": itemExports.Product,
                    "Model": itemExports.Model,
                    "Colour": itemExports.Colour,
                    "Size": itemExports.Size,
                    "Delivered By": itemExports.deliveredBy,
                    "Status": itemExports.Status
                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "OutstandingReport") {
            ReportName = "Outstanding Report";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    //"Bill Id": itemExports.OpticalConsumeId,
                    "MR NO": itemExports.MRNO,
                    "Receipt Id": itemExports.ReceiptId,
                    "Patient Name": itemExports.PatientName,
                    "Branch Name": itemExports.Branch,
                    "Authorized By": itemExports.AuthorizedBy,
                    "Outstanding Amount": itemExports.OutstandingAmount
                });
            });
            jsonData = reports_exportData;
        }
        //pharmacy
        else if (typeValue === "Pharmacy-Purchases") {
            ReportName = "Purchase Report";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    "GRN No": itemExports.PurchaseInvoiceId,
                    "Invoice No": itemExports.InvoiceNo,
                    "Inv Date": itemExports.PurchaseDate,
                    "Discount": itemExports.DiscountValue,
                    "Total": itemExports.TotalAmount,
                    "Branch Name": itemExports.OrganizationName
                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "Pharmacy Purchases Returns") {
            ReportName = "PurchaseReturns Report";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    "Invoice Id": itemExports.PurchaseInvoiceId,
                    "Invoice Date": $filter("date")(itemExports.InvoiceDate, "dd-MM-yyyy"),
                    "Return Date": $filter("date")(itemExports.ReturnDate, "dd-MM-yyyy"),
                    "Product Name": itemExports.ProductName,
                    "Quantity(Strips)": itemExports.ReturnQuantity,
                    "Return Amount": itemExports.ReturnedAmount,
                    "Branch": itemExports.OrganizationName
                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "Pharmacy Sales") {
            ReportName = "Sales Report";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    //'SNO': itemExports.SNO,
                    //// "Bill Id": itemExports.BillId,
                    //"MR NO": itemExports.MRNO,
                    //"Receipt Id": itemExports.ReceiptId,
                    //"Bill Date": itemExports.BillDate,
                    //"Paid Date": itemExports.PaidDate,
                    //"Name": itemExports.PatientName,
                    //"Mobile": itemExports.MobileNo ? itemExports.MobileNo : '',
                    //"Total Sale": itemExports.TotalAmount,
                    //"Branch": itemExports.OrganizationName
                    "SNO": itemExports.SNO,
                    "Date": $filter("date")(itemExports.Date, "dd-MM-yyyy"),
                    "Cash": itemExports.CashAmount,
                    "Card": itemExports.CardAmount,
                    "Cheque": itemExports.ChequeAmount,
                    "Wallet": itemExports.Others,
                    "TotalRevenue": itemExports.TotalRevenue
                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "Pharmacy saleDetail") {
            ReportName = "saleDetail Report";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    "SNO": itemExports.SNO,
                    "MR NO": itemExports.PatientDisplayId,
                    "Receipt NO": itemExports.ReceiptId,
                    "Bill Date": itemExports.BillDate,
                    "Paid Date": itemExports.PaidDate,
                    "Name": itemExports.PatientName,
                    "Mobile": itemExports.MobileNo ? itemExports.MobileNo : '',
                    "Doctor": itemExports.DoctorName,
                    "Total Received": itemExports.TotalAmount,
                    "PaymentMode": itemExports.PaymentMode,
                    "Branch": itemExports.OrganizationName


                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "Pharmacy Sale Return") {
            ReportName = "SalesReturns Report";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    // "Bill Id": itemExports.BillId,
                    "MR NO": itemExports.MRNO,
                    "Receipt Id": itemExports.ReceiptId,
                    "Bill Date": $filter("date")(itemExports.BillDate, "dd-MM-yyyy"),
                    "Return Date": itemExports.ReturnedDate,
                    "Name": itemExports.PatientName,
                    "Mobile": itemExports.MobileNo ? itemExports.MobileNo : '',
                    "Product": itemExports.ItemName,
                    "Quantity": itemExports.ReturnQuantity,
                    "Return Amount": itemExports.ReturnedAmount,
                    "Branch": itemExports.OrganizationName
                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "SalesReportByProduct") {
            ReportName = "SalesReportByProduct";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    "Product": itemExports.Product,
                    "Quantity": itemExports.Quantity,
                    "Amount": itemExports.Amount,
                    "Branch": itemExports.OrganizationName
                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "PurchaseReportByGST") {
            ReportName = "PurchaseReportByGST";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    "Purchase Invoice Id": itemExports.PurchaseInvoiceId,
                    "InvoiceNo": itemExports.InvoiceNo,
                    "Invoice Date": $filter("date")(itemExports.InvoiceDate, "dd-MM-yyyy"),
                    "Feed Date": $filter("date")(itemExports.FeedDate, "dd-MM-yyyy"),
                    "Branch": itemExports.Branch,
                    "GST(0%)": itemExports.GST0,
                    "GST(5%)": itemExports.GST5,
                    "GST(12%)": itemExports.GST12,
                    "GST(18%)": itemExports.GST18,
                    "GST(28%)": itemExports.GST28,
                    "Tax(0%)": itemExports.Tax0,
                    "Tax(5%)": itemExports.Tax5,
                    "Tax(12%)": itemExports.Tax12,
                    "Tax(18%)": itemExports.Tax18,
                    "Tax(28%)": itemExports.Tax28,
                    "Net Amount": itemExports.NetAmount
                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "AdvicedPrscptnReportByConSultation") {
            ReportName = "AdvicedPrscptnReportByConSultation";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    "SNO": itemExports.SNO,
                    "Appointment Date": moment(itemExports.AppointmentDate).format("DD-MMM-YYYY"),
                    "MR NO": itemExports.MRNO,
                    "Patient Name": itemExports.PatientName,
                    "Gender": itemExports.Gender,
                    "Mobile No": itemExports.MobileNo ? itemExports.MobileNo : '',
                    "Doctor": itemExports.AppointmentDoctor,
                    "Branch": itemExports.OrgName
                });
            });
            jsonData = reports_exportData;
        }

        else if (typeValue === "SaleReportByGST") {
            ReportName = "SaleReportByGST";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    "Consume Id": itemExports.ConsumeId,
                    "Feed Date": $filter("date")(itemExports.FeedDate, "dd-MM-yyyy"),
                    "PatientName": itemExports.PatientName,
                    "GSTNumber": itemExports.GSTNumber,
                    "Branch": itemExports.Branch,
                    "GST(0%)": itemExports.GST0,
                    "GST(5%)": itemExports.GST5,
                    "GST(12%)": itemExports.GST12,
                    "GST(18%)": itemExports.GST18,
                    "GST(28%)": itemExports.GST28,
                    "Tax(0%)": itemExports.Tax0,
                    "Tax(5%)": itemExports.Tax5,
                    "Tax(12%)": itemExports.Tax12,
                    "Tax(18%)": itemExports.Tax18,
                    "Tax(28%)": itemExports.Tax28,
                    "Net Amount": itemExports.NetAmount
                });
            });
            jsonData = reports_exportData;
        }

        else if (typeValue === "PharmaExpiryStockReport") {
            ReportName = "Expiry Stock Report";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    "SNo": itemExports.SNo,
                    "Purchase Date": $filter("date")(itemExports.PurchaseDate, "dd-MM-yyyy"),
                    "Stock DetailId": itemExports.StockDetailId,
                    "Product Name": itemExports.ItemName ? itemExports.ItemName : '',
                    "BatchNumber": itemExports.BatchNumber,
                    "Invoice No": itemExports.InvoiceNo,
                    "Available Stock": itemExports.AvailableStock,
                    "Quantity Sold": itemExports.QuantitySold,
                    "Medicine Type": itemExports.MedicineType,
                    "No Of Units": itemExports.NoOfUnits,
                    "No Of Items": itemExports.NoOfItems,
                    "Free Strips": itemExports.FreeStrips,
                    //"Inventory ItemDetailsId": itemExports.InventoryItemDetailsId,
                    //"Expiry Date": $filter("date")(itemExports.ExpiryDate, "dd-MM-yyyy"),
                    "Expiry Date": itemExports.ExpiryDate,
                    "Branch": itemExports.name
                });
            });
            jsonData = reports_exportData;
        }

        else if (typeValue === "PharmaReadyToExpireStockReport") {
            ReportName = "Ready To Expire Stock Report";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    "SNo": itemExports.SNo,
                    "Purchase Date": $filter("date")(itemExports.PurchaseDate, "dd-MM-yyyy"),
                    "Stock DetailId": itemExports.StockDetailId,
                    "Product Name": itemExports.ItemName ? itemExports.ItemName : '',
                    "BatchNumber": itemExports.BatchNumber,
                    "Invoice No": itemExports.InvoiceNo,
                    "Available Stock": itemExports.AvailableStock,
                    "Quantity Sold": itemExports.QuantitySold,
                    "Medicine Type": itemExports.MedicineType,
                    "No Of Units": itemExports.NoOfUnits,
                    "No Of Items": itemExports.NoOfItems,
                    "Free Strips": itemExports.FreeStrips,
                    "Expiry Date": itemExports.ExpiryDate,
                    "Branch": itemExports.name
                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "pharmaNonMovingStockReport") {
            ReportName = "Non Moving Stock Report";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    "SNo": itemExports.SNO,
                    "Purchase Date": $filter("date")(itemExports.PurchaseDate, "dd-MM-yyyy"),
                    "Product Name": itemExports.Product ? itemExports.Product : '',
                    "Batch Number": itemExports.BatchNumber,
                    "Available Stock": itemExports.AvailableStock,
                    "Used Stock": itemExports.UsedStock,
                    "PurchaseReturned": itemExports.PurchaseReturnedStock,
                    "Transfered Stock": itemExports.TransferedStock,
                    "Total Stock": itemExports.TotalStock,
                    "Expiry": itemExports.Expiry
                });
            });
            jsonData = reports_exportData;
        }
        //endpharmacy
        else if (typeValue === "Department Revenue Report") {
            ReportName = "Department Revenue Report";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Department': itemExports.Department,
                    'Treatment': itemExports.Treatment,
                    'Amount': itemExports.Revenue
                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "Diagnosis Report") {
            ReportName = "Diagnosis Report";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'MR NO': itemExports.MRNO,
                    'Patient Name': itemExports.PatientName,
                    'Age': itemExports.Age,
                    'Branch': itemExports.Branch,
                    'Doctor Name': itemExports.DoctorName,
                    'Diagnosis': itemExports.Diagnosis,
                    // 'Referred To': itemExports.ReferredTo,
                    'Advised By': itemExports.AdvisedBy,
                    'Optometrist': itemExports.Optometrist,
                    'Appointment Date': itemExports.AppointmentDate,
                    'Visited Date': itemExports.LastVisitedDate
                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "InvestigationAdvisedReport") {
            ReportName = "Investigation Advised Report";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'MR NO': itemExports.MRNO,
                    'Patient Name': itemExports.PatientName,
                    'InvestigationName': itemExports.InvestigationName,
                    'Eye': itemExports.Organ,
                    'Doctor Name': itemExports.AppointmentDoctor,
                    'Investigated  By': itemExports.AdvisedBy,
                    'Branch': itemExports.OrgName,
                    'Status': itemExports.Status

                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "surgeryAdvisedReport") {
            ReportName = "surgery Advised Report";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'MR NO': itemExports.MRNO,
                    'Patient Name': itemExports.PatientName,
                    'Surgery Package Name': itemExports.SurgeryPackageName,
                    'Surgery': itemExports.Surgery,
                    'Category': itemExports.Category,
                    'Eye': itemExports.Organ,
                    'Surgeon': itemExports.Surgeon,
                    'Suggested Date': $filter("date")(itemExports.SuggestedDate, "dd-MM-yyyy"),
                    'Advised By': itemExports.AdvisedBy,
                    'Branch': itemExports.Branch

                });
            });
            jsonData = reports_exportData;
        }

        else if (typeValue === "Surgery Count Report ByStatus") {
            ReportName = "Surgery Count Report ByStatus";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNo': itemExports.SNo,
                    'Doctor': itemExports.Doctor,
                    'Counselor': itemExports.Counselor,
                    'Booked': itemExports.AppointmentBooked,
                    'Adviced': itemExports.Adviced,
                    'Accepted': itemExports.Accepted,
                    'Admitted': itemExports.Admitted,
                    'Discharged': itemExports.Discharged,
                    'FollowUp': itemExports.FollowUp
                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "Consolidated Incentive Report") {
            ReportName = "Consolidated Incentive Report";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Doctor Name': itemExports.DoctorName,
                    'Total Treatment Amount': itemExports.TotalTreatmentAmount,
                    'Incentive Treatment Amount': itemExports.IncentiveTreatmentAmount,
                    'Total Conversion Amount': itemExports.TTotalConversionAmount,
                    'Incentive Conversion Amount': itemExports.IncentiveConversionAmount,
                    'Total Referral Amount': itemExports.TotalRefferalAmount,
                    'Incentive Referral Amount': itemExports.IncentiveRefferalAmount
                });
            });
            jsonData = reports_exportData;
        }




        else if (typeValue === "ConvertedPatientReportByTreatment") {
            ReportName = "ConvertedPatientReportByTreatment";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Appointment Date': itemExports.AppointmentDate,
                    'MR NO': itemExports.MRNO,
                    'Patient Name': itemExports.PatientName,
                    'Status': itemExports.Status,
                    'Branch': itemExports.OrgName

                });
            });
            jsonData = reports_exportData;
        }

        else if (typeValue === "Accounts Bank Deposit") {
            ReportName = "Accounts Bank Deposit";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Date': itemExports.Date,
                    'BankName': itemExports.BankName,
                    'Amount': itemExports.Amount,
                    'Transaction Id': itemExports.TransactionId,
                    'AddedBy': itemExports.AddedBy,
                    'Comments': itemExports.Comments,
                    'Branch': itemExports.Branch

                });
            });
            jsonData = reports_exportData;
        }

        else if (typeValue === "GST Report") {
            ReportName = "GST Report";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Billing Date': itemExports.BillingDate,
                    'MR NO': itemExports.MRNO,
                    'Patient Name': itemExports.PatientName,
                    'Procedure Name': itemExports.ProcedureName,
                    'Total Received': itemExports.Totalreceived,
                    'GST': itemExports.GST,
                    'Branch': itemExports.OrganizationName

                });
            });
            jsonData = reports_exportData;
        }


        else if (typeValue === "OptomCountReport") {
            ReportName = "OptomCountReport";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    // 'Ongoing': itemExports.Ongoing,
                    // 'Saved': itemExports.Saved,
                    // 'Completed': itemExports.Completed
                    'SNO': itemExports.SNO,
                    'Optometrist': itemExports.Optometrist,
                    'Count': itemExports.PatientCount

                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "FutureAppointmentsReportByPatient") {
            ReportName = "Future Appointments Report By Patient";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Appointment Date': itemExports.AppointmentDate,
                    'MR NO': itemExports.PatientDisplayId,
                    'Patient Name': itemExports.PatientName,
                    'MobileNo': itemExports.MobileNo,
                    'Appointment Doctor': itemExports.AppointmentDoctorName ? itemExports.AppointmentDoctorName : '',
                    'Branch': itemExports.AppointmentHospitalName ? itemExports.AppointmentHospitalName : '',
                    'Status': itemExports.AppointmentStatus == 'B' ? 'Booked' : itemExports.AppointmentStatus == 'E' ? 'Completed' : itemExports.AppointmentStatus == 'C' ? 'Cancelled' : itemExports.AppointmentStatus == 'O' ? 'OnGoing' : '',

                });
            });
            jsonData = reports_exportData;
        }

        else if (typeValue === "IndividualDailyReport") {
            ReportName = "IndividualDailyReport";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                if ($scope.SpecializationId != 2) {
                    reports_exportData.push({
                        'SNO': itemExports.SNO,
                        'Mode of Payment': itemExports.RowLabels,
                        'OP&OT': itemExports.OPOT,
                        'Pharmacy': itemExports.Pharmacy,
                        'Optical': itemExports.Optical,
                        'Total': itemExports.Total
                    });
                }
                else {
                    reports_exportData.push({
                        'SNO': itemExports.SNO,
                        'Mode of Payment': itemExports.RowLabels,
                        'OP&OT': itemExports.OPOT,
                        'Pharmacy': itemExports.Pharmacy,
                        'Total': itemExports.Total

                    });
                }

            });
            jsonData = reports_exportData;
        }

        else if (typeValue === "Waived Off Report") {
            ReportName = "Waived Off Report";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {

                if ($scope.SpecializationId != 16) {
                    reports_exportData.push({
                        'SNO': itemExports.SNO,
                        'MR No': itemExports.MRNO,
                        'Patient Name': itemExports.PatientName,
                        'Mobile No': itemExports.MobileNo ? itemExports.MobileNo : '',
                        'Branch': itemExports.Branch,
                        'Appointment Doctor': itemExports.AppointmentDoctor,
                        'Procedure Name': itemExports.ProcedureName ? itemExports.ProcedureName : '',
                        //'Procedure Name': Procedure ? Procedure : '',
                        'Treatment Doctor': itemExports.TreatmentDoctor,
                        'Conversion Doctor': itemExports.ConversionDoctor,
                        'Wavied Off Amount': itemExports.WaviedOffAmount,
                        'Status': itemExports.Status
                    });
                }
                else {
                    reports_exportData.push({
                        'SNO': itemExports.SNO,
                        'MR No': itemExports.MRNO,
                        'Patient Name': itemExports.PatientName,
                        'Mobile No': itemExports.MobileNo ? itemExports.MobileNo : '',
                        'Branch': itemExports.Branch,
                        'Appointment Doctor': itemExports.AppointmentDoctor,
                        'Procedure Name': itemExports.ProcedureName ? itemExports.ProcedureName : '',
                        //'Procedure Name': Procedure ? Procedure : '',
                        'Treatment Doctor': itemExports.TreatmentDoctor,
                        'Conversion Doctor': itemExports.Therapist,
                        'Referral Doctor': itemExports.SalesPerson,
                        'Wavied Off Amount': itemExports.WaviedOffAmount,
                        'Status': itemExports.Status

                    });
                }





                //var Procedure = "";
                //var ReceiptId = "";
                //angular.forEach(itemExports.ProcedureName, function (item1, index) {
                //    if (itemExports.ProcedureName.length - 1 === index) {
                //        Procedure += item1.procedureName;
                //        ReceiptId += item1.ReceiptId;
                //    }
                //    else {
                //        Procedure += item1.procedureName + ',';                       
                //    }
                //});

            });
            jsonData = reports_exportData;
        }



        else if (typeValue === "DynamicSurgeryConvertedReport") {
            ReportName = "DynamicSurgeryConvertedReport";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                //var Procedure = "";
                //angular.forEach(itemExports.ProcedureName, function (item1, index) {
                //    if (itemExports.ProcedureName.length - 1 === index) {
                //        Procedure += item1.procedureName;
                //    }
                //    else {
                //        Procedure += item1.procedureName + ',';
                //    }
                //});
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'MR NO': itemExports.MRNO,
                    'Patient Name': itemExports.PatientName,
                    'Suggested Date': $filter("date")(itemExports.SuggestedDate, "dd-MM-yyyy"),
                    'Category': itemExports.Category ? itemExports.Category : '',
                    'Surgery': itemExports.Surgery ? itemExports.Surgery : '',
                    'Surgery Package Name': itemExports.SurgeryPackageName,
                    'Eye': itemExports.Organ ? itemExports.Organ : '',
                    'Surgeon': itemExports.Surgeon,
                    'Counselor': itemExports.Counselor ? itemExports.Counselor : '',
                    'Status': itemExports.Status,
                    'Branch': itemExports.Branch
                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "AccountRevenue") {
            ReportName = "Account Revenue";
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Branch': itemExports.Branch,
                    'New OP': itemExports.NewOp,
                    'Old Op': itemExports.OldOp,
                    'Followup': itemExports.Followup,
                    'Total Op': itemExports.TotalOp,
                    'Cash': itemExports.Cash,
                    'Card': itemExports.Card,
                    'Cheque': itemExports.Cheque,
                    'Paytm': itemExports.Paytm,
                    'Bank': itemExports.Bank,
                    'Bajaj': itemExports.Bajaj,
                    'BharatPe': itemExports.BharatPe,
                    //'CGHS': itemExports.CGHS,
                    'CapitalFloat': itemExports.CapitalFloat,
                    'CreditFair': itemExports.CreditFair,
                    'EZFINANZ': itemExports.EZFINANZ,
                    //'EHS': itemExports.EHS,
                    //'ECHS': itemExports.ECHSCredit,
                    'OnlineTransfer': itemExports.OnlineTransfer,
                    'FreeCharge': itemExports.FreeCharge,
                    'GooglePay': itemExports.GooglePay,
                    'HDFCEMI': itemExports.HDFCEMI,
                    'HDFCPaperLess': itemExports.HDFCPaperLess,
                    'INSURANCE': itemExports.INSURANCE,
                    'Liquiloans': itemExports.Liquiloans,
                    'MobiKwik': itemExports.MobiKwik,
                    'MEDIBuddy': itemExports.MEDIBuddy,
                    //'NTRVS': itemExports.NTRVS,
                    'Online': itemExports.Online,
                    'PhonePe': itemExports.PhonePe,
                    'PatientAdvance': itemExports.PatientAdvance,
                    'RGICredit': itemExports.RGICredit,
                    // 'ReturnAdvance': itemExports.ReturnAdvance,
                    //'RefundAmount': itemExports.RefundAmount,
                    'RDT': itemExports.RDT,
                    //'Waived': itemExports.Waived,
                    'UPI': itemExports.UPI,
                    'Total': itemExports.Total
                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "AccountExpenses") {
            ReportName = "Account Expenses";
            // tableToExcel(table, "Sheet 1", "" + ReportName + "Report.xls");
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Branch': itemExports.Branch,
                    'New OP': itemExports.NewOP,
                    'Old Op': itemExports.OldOp,
                    'Followup': itemExports.Followup,
                    'Total Op': itemExports.TotalOp,
                    'Salaries Payments': itemExports.SalariesPayments,
                    'Drinking Water Charges': itemExports.DrinkingWaterCharges,
                    'Repairs Maintenance': itemExports.RepairsMaintenance,
                    'Dental Material Purchases': itemExports.DentalMaterialPurchases,
                    'Lab Charges': itemExports.LabCharges,
                    'Hospital Maintenance Payments': itemExports.HospitalMaintenancePayments,
                    'Advertisement Payments': itemExports.AdvertisementPayments,
                    'Electricity Expenses': itemExports.ElectricityExpenses,
                    'Telephone Expenses': itemExports.TelephoneExpenses,
                    'Petrol Expenses': itemExports.PetrolExpenses,
                    'Camp Expenses': itemExports.CampExpenses,
                    'Consultation Payments': itemExports.ConsultationPayments,
                    'Postage Charges': itemExports.PostageCharges,
                    'StaffWelfare': itemExports.StaffWelfare,
                    'TravelConveyance': itemExports.TravelConveyance,
                    'PrintingStationery': itemExports.PrintingStationery,
                    'MedicalExpenses': itemExports.MedicalExpenses,
                    'Employee Adavance': itemExports.EmployeeAdavance,
                    'UniformandBadges': itemExports.UniformandBadges,
                    'Incentivesand Commission': itemExports.IncentivesandCommission,
                    'Head Office': itemExports.HeadOffice,
                    'Total': itemExports.Total
                });
            });
            jsonData = reports_exportData;
        }
        else if (typeValue === "AccountExpenses") {
            ReportName = "Account Expenses";
            // tableToExcel(table, "Sheet 1", "" + ReportName + "Report.xls");
            reports_exportData.length = 0;
            angular.forEach(jsonData, function (itemExports) {
                reports_exportData.push({
                    'SNO': itemExports.SNO,
                    'Branch': itemExports.Branch,
                    'New OP': itemExports.NewOP,
                    'Old Op': itemExports.OldOp,
                    'Followup': itemExports.Followup,
                    'Total Op': itemExports.TotalOp,
                    'Salaries Payments': itemExports.SalariesPayments,
                    'Drinking Water Charges': itemExports.DrinkingWaterCharges,
                    'Repairs Maintenance': itemExports.RepairsMaintenance,
                    'Dental Material Purchases': itemExports.DentalMaterialPurchases,
                    'Lab Charges': itemExports.LabCharges,
                    'Hospital Maintenance Payments': itemExports.HospitalMaintenancePayments,
                    'Advertisement Payments': itemExports.AdvertisementPayments,
                    'Electricity Expenses': itemExports.ElectricityExpenses,
                    'Telephone Expenses': itemExports.TelephoneExpenses,
                    'Petrol Expenses': itemExports.PetrolExpenses,
                    'Camp Expenses': itemExports.CampExpenses,
                    'Consultation Payments': itemExports.ConsultationPayments,
                    'Postage Charges': itemExports.PostageCharges,
                    'StaffWelfare': itemExports.StaffWelfare,
                    'TravelConveyance': itemExports.TravelConveyance,
                    'PrintingStationery': itemExports.PrintingStationery,
                    'MedicalExpenses': itemExports.MedicalExpenses,
                    'Employee Adavance': itemExports.EmployeeAdavance,
                    'UniformandBadges': itemExports.UniformandBadges,
                    'Incentivesand Commission': itemExports.IncentivesandCommission,
                    'Head Office': itemExports.HeadOffice,
                    'Total': itemExports.Total
                });
            });
            jsonData = reports_exportData;
        }
        var col = [];
        if (jsonData.length === 0) {
            return;
        }
        for (var i = 0; i < jsonData.length; i++) {
            for (var key in jsonData[i]) {
                if (col.indexOf(key) === -1) {
                    col.push(key);
                }
            }
        }
        // CREATE DYNAMIC TABLE.
        var table = document.createElement("table");
        table.style = "border: 1px solid #000;";
        // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.
        if (ReportName !== "") {
            var tr = table.insertRow(-1);              // TABLE ROW.        
            tabHead = tr.insertCell(-1);
            tabHead.style = "border: 1px solid #000;text-align:center;font-weight: bold; font-size:18px;";
            tabHead.colSpan = 5;
            tabHead.innerHTML = ReportName;
            if ($scope.reportSearch.HospitalId.length > 2) {
                tr = table.insertRow(-1);
                tabHead = tr.insertCell(-1);
                tabHead.style = "border: 1px solid #000;text-align:center;";
                tabHead.colSpan = 5;
                tabHead.innerHTML = ParentHospitalName;
            }

            else {
                //tr = table.insertRow(-1);
                //tabHead = tr.insertCell(-1);
                //tabHead.style = "border: 1px solid #000;text-align:center;"
                //tabHead.colSpan = 5;
                //tabHead.innerHTML = $scope.reportSearch.DoctorObj.FullName;
                var tr = table.insertRow(-1);
                var tabHead = tr.insertCell(-1);
                tabHead.style = "border: 1px solid #000;text-align:center;font-weight: bold;";
                tabHead.colSpan = 5;
                // tabHead.innerHTML = $scope.reportSearch.HospitalObj.ClinicName || $scope.SelectedHospital.HospitalInfo.HospitalDetails.ClinicName;
                tabHead.innerHTML = $scope.reportSearch.HospitalObj.ClinicName || $scope.SelectedHospital.ClinicName;
            }

            //var tabHead = tr.insertCell(-1);
            //tabHead.style = "border: 1px solid #000;text-align:center;font-weight: bold;"
            //tabHead.colSpan = 5;
            //tabHead.innerHTML = $scope.reportSearch.HospitalObj.ClinicName;

            tr = table.insertRow(-1);
            tabHead = tr.insertCell(-1);
            tabHead.style = "border: 1px solid #000;text-align:center;";
            tabHead.colSpan = 5;
            if ($scope.dashboardTab === 'reports') {
                tabHead.innerHTML = "From:" + $scope.reportSearch.FromDate + " - " + "To:" + $scope.reportSearch.ToDate;
            }
            else {
                tabHead.innerHTML = "From:" + $scope.dashboard_StartDate + " - " + "To:" + $scope.dashboard_EndDate;
            }
            // tabHead.innerHTML = $scope.reportSearch.ToDate;
            if ($scope.SpecializationId !== 2) {
                tr = table.insertRow(-1);
                tabHead = tr.insertCell(-1);
                tabHead.style = "border: 1px solid #000;text-align:center;";
                tabHead.colSpan = 5;
                tabHead.innerHTML = ($scope.reportSearch.DepartmentObj !== undefined ? $scope.reportSearch.DepartmentObj.SubSpecializationName : '') || ($scope.SelectedDepartment === null || $scope.SelectedDepartment === undefined || $scope.SelectedDepartment === 0 ? "All Departments" : $scope.SelectedDepartment.SubSpecializationName);
            }

            tr = table.insertRow(-1);
            tabHead = tr.insertCell(-1);
            tabHead.style = "border: 1px solid #000;text-align:center;";
            tabHead.colSpan = 5;
            tabHead.innerHTML = $scope.reportSearch.DoctorObj.FullName || ($scope.SelectedDoctor === null ? "All Doctors" : $scope.SelectedDoctor.FullName);



        }
        //tr = table.insertRow(-1);
        //var tabHead1 = tr.insertCell(-1);
        //tabHead1.style = "border: 1px solid #000;text-align:center;font-weight: bold;"
        //tabHead1.colSpan = 5;
        //tabHead1.innerHTML = "[" + new Date().toLocaleString() + "]"

        var tr = table.insertRow(-1);               // TABLE ROW.
        for (var i = 0; i < col.length; i++) {
            var th = document.createElement("th");      // TABLE HEADER.
            th.innerHTML = col[i];
            tr.appendChild(th);
            tr.style = "background:#1e977c;color:#fff;width:100px";
        }
        // ADD JSON DATA TO THE TABLE AS ROWS.
        for (var i = 0; i < jsonData.length; i++) {
            tr = table.insertRow(-1);
            tr.style = "border: 1px solid #000;";
            for (var j = 0; j < col.length; j++) {
                var tabCell = tr.insertCell(-1);
                tabCell.innerHTML = jsonData[i][col[j]];
            }
        }
        if ($scope.View === "exportRevenue") {
            tr = table.insertRow(-1);
            var tcRegNo = tr.insertCell(-1);
            tcRegNo.style = "border: 1px solid #000;text-align:right;font-weight: bold; font-size:18px;";
            tcRegNo.colSpan = 9;
            tcRegNo.innerHTML = 'Total Revenue : ' + $scope.exporttotal;
        };


        download(table);
    }

    var tableToExcel = (function () {
        var uri = 'data:application/vnd.ms-excel;base64,',
            template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
            base64 = function (s) {
                return window.btoa(unescape(encodeURIComponent(s)));
            }, format = function (s, c) {
                return s.replace(/{(\w+)}/g, function (m, p) {
                    return c[p];
                });
            };
        return function (table, name, filename) {
            if (!table.nodeType) table = document.getElementById(table);
            var ctx = {
                worksheet: name || 'Worksheet',
                table: table.innerHTML
            };
            var link = document.createElement("a");
            link.href = uri + base64(format(template, ctx));
            //set the visibility hidden so it will not effect on your web-layout
            link.style = "visibility:hidden";
            link.download = filename;
            //this part will append the anchor tag and remove it after automatic click
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };
    })();

    //function download(table) {
    //    tableToExcel(table, 'Sheet 1', 'dataDownload.xls');
    //}
    function download(table) {
        tableToExcel(table, "Sheet 1", "" + $scope.viewtype + "Report.xls");
    }


    $scope.treatmentArray = [{ label: "Retinal cryopexy", value: 30 },
    { label: "Corneal surgery", value: 30 },
    { label: "Eye muscle surgery", value: 60 }
    ];


    function bindChat(id, dataArray, selectIndex) {
        Morris.Donut({
            element: id,
            data: dataArray
        }).select(selectIndex | 0);
    }
    //function treatmentChat() {
    //    Morris.Donut({
    //        element: 'treatment-donut-chat',
    //        data: $scope.treatmentArray
    //    }).select(0);
    //}


    $scope.showMainReportsScreen = true;
    $scope.revenueitem = {
        "RevenueDetail": [],
        "count": 0
    };

    $scope.getPaymentDetails = function (pageno, reportType, date, modeType, data) {
        $scope.modeType = modeType;
        var params = {
            "DoctorId": $scope.SelectedDoctor === undefined || $scope.SelectedDoctor === null ? 0 : $scope.SelectedDoctor.DoctorID,
            "HospitalID": $scope.SelectedHospital === undefined || $scope.SelectedHospital === null ? doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID : $scope.SelectedHospital.ClinicId,
            "Date": $filter('date')(new Date(date), "dd-MMMM-yyyy"),
            "PageSize": reportType === "export" ? $scope.exportMaxSize : $scope.maxSize,
            "PageNo": pageno,
            "GetAllIndicator": $scope.GetAllIndicator,
            "PaymentModeType": modeType,
            "SubOrganizationId": $scope.SelectedSubOrganization === undefined || $scope.SelectedSubOrganization === null ? 0 : $scope.SelectedSubOrganization.SubOrganizationId,
            "DepartmentId": $scope.SelectedDepartment === undefined || $scope.SelectedDepartment === null ? 0 : $scope.SelectedDepartment.SubSpecializationId
        };
        eHnoteMainDashboardDataServices.GetDashBoardInfoByPaymentMode(params).then(function (resp) {
            if (reportType === "export") {
                data.revenueitem.RevenueDetail = data.revenueitem.RevenueDetail || [];

                angular.forEach(resp.data.RevenueDetail, function (item) {
                    item.TreatmentData = "";
                    item.TreatmentDoctordata = "";
                    if (item.treatment !== undefined) {
                        $scope.treatmentList = [];
                        angular.forEach(item.treatment, function (mitem) {
                            if (mitem.IsWaved) {
                                mitem.TreatmentName += "(W.O)";
                            }
                            $scope.treatmentList.push(mitem.TreatmentName);
                        });
                        if ($scope.treatmentList.length > 0) {
                            item.TreatmentData = $scope.treatmentList.join(",");
                        }
                        $scope.treatmentDocList = [];
                        angular.forEach(item.treatment, function (ditem) {

                            if (ditem.TreatmentDoctor !== null) {
                                $scope.treatmentDocList.push(ditem.TreatmentDoctor);
                            }
                        });
                        if ($scope.treatmentDocList.length > 0) {
                            item.TreatmentDoctordata = $scope.treatmentDocList.join(",");
                        }
                    }
                });
                $scope.View = "exportRevenue";
                $scope.exporttotal = 0;
                for (var i = 0; i < resp.data.RevenueDetail.length; i++) {
                    var product = resp.data.RevenueDetail[i];
                    $scope.exporttotal += (product.TotalBilledCost);
                }
                generateTable(resp.data.RevenueDetail, $scope.viewtype);

            } else {
                $scope.View = "";
                data.revenueitem.RevenueDetail = [];
                data.revenueitem.count = 0;
                if (resp.data.count === 0) {
                    data.revenueitem.RevenueDetail = [];
                    data.revenueitem.count = 0;
                } else {
                    data.revenueitem = resp.data;
                    data.revenueitem.RevenueDetail = data.revenueitem.RevenueDetail || [];

                    angular.forEach(data.revenueitem.RevenueDetail, function (item) {
                        item.TreatmentData = "";
                        item.TreatmentDoctordata = "";
                        item.TreatmentconDoctordata = "";
                        if (item.treatment !== undefined) {
                            $scope.treatmentList = [];
                            angular.forEach(item.treatment, function (mitem) {
                                if (mitem.IsWaved) {
                                    mitem.TreatmentName += "(W.O)";
                                }
                                $scope.treatmentList.push(mitem.TreatmentName);
                            });
                            if ($scope.treatmentList.length > 0) {
                                item.TreatmentData = $scope.treatmentList.join(",");
                            }
                            $scope.treatmentDocList = [];
                            angular.forEach(item.treatment, function (ditem) {
                                if (ditem.TreatmentDoctor !== null) {
                                    $scope.treatmentDocList.push(ditem.TreatmentDoctor);
                                }
                            });
                            if ($scope.treatmentDocList.length > 0) {
                                item.TreatmentDoctordata = $scope.treatmentDocList.join(",");
                            }


                            $scope.treatmentConList = [];
                            angular.forEach(item.treatment, function (citem) {
                                if (citem.ConversionDoctor !== null) {
                                    $scope.treatmentConList.push(citem.ConversionDoctor);
                                }
                            });
                            if ($scope.treatmentConList.length > 0) {
                                item.TreatmentconDoctordata = $scope.treatmentConList.join(",");
                            }
                        }
                    });

                    data.maxSize = resp.data.count;
                    //$scope.exportMaxSize = resp.data.count;
                }
            }
        }, function (err) {
            console.log(err);
            alertify.error(err.data.Message);
        });
    };


    //start
    $scope.getSurgeryPaymentDetails = function (pageno, reportType, date, modeType, data) {
        $scope.modeType = modeType;
        var params = {
            "DoctorId": $scope.SelectedDoctor === undefined || $scope.SelectedDoctor === null ? 0 : $scope.SelectedDoctor.DoctorID,
            "HospitalID": $scope.SelectedHospital === undefined || $scope.SelectedHospital === null ? doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID : $scope.SelectedHospital.ClinicId,
            "Date": $filter('date')(new Date(date), "dd-MMMM-yyyy"),
            "PageSize": reportType === "export" ? $scope.exportMaxSize : $scope.maxSize,
            "PageNo": pageno,
            "GetAllIndicator": $scope.GetAllIndicator,
            "PaymentModeType": modeType
        };
        eHnoteMainDashboardDataServices.GetDashboardSurgeryRevenueDetail(params).then(function (resp) {
            if (reportType === "export") {
                $scope.SurgeryRevenueDetailexport = resp.data.SurgeryRevenueDetail || [];
                generateTable($scope.SurgeryRevenueDetailexport, $scope.viewtype);

            }
            else {
                $scope.SurgeryRevenueDetail = resp.data.SurgeryRevenueDetail || [];
                $scope.SurgeryRevenueDetailcount = resp.data.count;
            }

        }, function (err) {
            console.log(err);
            alertify.error(err.data.Message);
        });
    };
    //end

    $scope.showMoreReports = false;
    $scope.MoreReports = function () {
        if ($scope.showMoreReports) {
            $scope.showMoreReports = false;
        } else {
            $scope.showMoreReports = true;
        }

    };


    $scope.AllCounselorsList = [];
    $scope.AllConversionList = [];
    $scope.AllOptomDocList = [];



    var d = new Date();
    $scope.reportSearch = {
        "FromDate": $filter('date')(new Date(d), "yyyy-MM-dd"),
        "ToDate": $filter('date')(new Date(d), "yyyy-MM-dd"),
        "EndDate": $filter("date")(new Date().setDate(new Date().getDate() + 60), "dd-MM-yyyy"),
        "AllHospitalsIndicator": 1,
        "HospitalId": parentHospitalId,
        "HospitalObj": "",
        "AllDoctorsIndicator": 1,
        "DoctorId": 0,
        "ConversionObj": "",
        "ConversionDoctorId": 0,
        "DoctorObj": "",
        "PageSize": 10,
        "PageNumber": 1,
        "CounselorObj": "",
        "CounselorDoctorId": "0",
        "OptomObj": "",
        "OptomDoctorId": 0,
        "Category": null,
        "StatusId": 0
    };
    $scope.navtoReportsTab = function () {

        if (userLoginDetails.RoleID === 1 || userLoginDetails.RoleID === 56) {




            $scope.BranchDoctorsList = [];
            var countryCode = "";
            if (doctorinfo.doctordata.UserPhone !== undefined) {
                countryCode = doctorinfo.doctordata.UserPhone[0].PhCntryCD;
            }
            var clinicObj = {
                "FullName": doctorinfo.doctordata.User[0].FullName,
                "DoctorID": doctorinfo.doctordata.User[0].DoctorID,
                "EmailId": doctorinfo.doctordata.UserEmail[0].EmailID,
                "MobileNo": doctorinfo.doctordata.UserAddress[0].MobileNo,
                "CountryCode": countryCode,
                "Gender": doctorinfo.doctordata.User[0].Gender,
                "UserBranchId": doctorinfo.doctordata.UserAddress[0].UserBranchId,
                "Active": "Y",
                "SpecializationId": doctorinfo.doctordata.User[0].SpecializationId,
                "MinPerCase": doctorinfo.doctordata.UserAddress[0].ExtDetails.MinPerCase,
                "RoleId": doctorinfo.doctordata.UserAddress[0].ExtDetails.RoleID,
                "ClinicName": doctorinfo.doctordata.UserAddress[0].ClinicName,
                "BranchEmail": doctorinfo.doctordata.UserAddress[0].BranchEmail
            };
            $scope.BranchDoctorsList.push(clinicObj);
            $scope.AllCounselorsList = angular.copy(clinicObj);

        }
        //var data = localStorageFactory.getItem("allHospitalsDoctorsData") || [];
        //InitializeBranches(data);

        var NewBranchList = localStorageFactory.getItem("allBranchesData") || [];
        //InitializeReportBranches(NewBranchList);
        initializeReportNewBranches(NewBranchList);

    };


    function InitializeBranches(data) {


        BranchesList = eHnoteUserAppointmentDataService.RestructureBranches($scope.DashBoardAccess.summaryAllBranchesAccess, data, doctorinfo) || [];
        var EmptyClinicObj = {
            "ClinicName": "All Locations",
            "ClinicId": 0,
            "Address1": "",
            "Address2": "",
            "Location": "",
            "StateId": "",
            "PinCode": "",
            "CountryId": "",
            "CityId": "",
            "DistrictRegion": "",
            "Latitude": "",
            "Longitude": "",
            "BranchEmail": "",
            "CountryCode": "",
            "mobilenum": "",
            "Active": "Y",
            "Doctors": []

        };
        BranchesList.unshift(EmptyClinicObj);

        InitialiseBranchDoctor();
    }

    function InitializeReportBranches(data) {

        BranchesList = eHnoteUserAppointmentDataService.RestructureNewBranches($scope.UserAccessRights.AllAccessRights.SummaryAllBranchesReports, data, doctorinfo) || [];
        //  $scope.hospitalDetails = BranchesList;
        var EmptyClinicObj = {
            "ClinicName": "All Locations",
            "ClinicId": 0,
            "Address1": "",
            "Address2": "",
            "Location": "",
            "StateId": "",
            "PinCode": "",
            "CountryId": "",
            "CityId": "",
            "DistrictRegion": "",
            "Latitude": "",
            "Longitude": "",
            "BranchEmail": "",
            "CountryCode": "",
            "mobilenum": "",
            "Active": "Y",
            "Doctors": []

        };
        BranchesList.unshift(EmptyClinicObj);
        BranchesList = _.uniq(BranchesList, false, function (p) {
            return p.ClinicId;
        });
        $scope.defaultbranch = $filter("filter")(BranchesList, function (item) {
            return item.BranchId === doctorinfo.doctordata.UserAddress[0].ClinicId;
        });

        $scope.selectedBranch = $scope.defaultbranch[0];

        //GetBranchSubSpecializations($scope.selectedBranch.SubOrganizationId, $scope.selectedBranch.BranchId);
        if ($scope.dashboardTab === 'reports') {
            GetBranchSubSpecializationsforReports($scope.SubOrganizationId, $scope.selectedBranch.BranchId);
        }
        else {
            GetBranchSubSpecializations($scope.SubOrganizationId, $scope.selectedBranch.BranchId);
        }
    }

    function InitialiseBranchDoctor() {
        //$scope.AllUserBranchesList = [];
        //var item = doctorinfo.doctordata.UserAddress[0];
        $scope.AllUserBranchesList = BranchesList;
        if ($scope.RoleId === 1 || userLoginDetails.RoleID === 56) {
            //BranchesList = [];
            //var EmptyClinicObj = {
            //    "ClinicName": "All Locations",
            //    "ClinicId": 0,
            //    "Address1": "",
            //    "Address2": "",
            //    "Location": "",
            //    "StateId": "",
            //    "PinCode": "",
            //    "CountryId": "",
            //    "CityId": "",
            //    "DistrictRegion": "",
            //    "Latitude": "",
            //    "Longitude": "",
            //    "BranchEmail": "",
            //    "CountryCode": "",
            //    "mobilenum": "",
            //    "Active": "Y",
            //    "Doctors": []
            //};
            //BranchesList.unshift(EmptyClinicObj);
            //if (doctorinfo !== null && doctorinfo.doctordata !== null) {
            //    if (doctorinfo.doctordata.UserAddress !== null) {
            //        var appListdoctoraddress = doctorinfo.doctordata.UserAddress;
            //        for (var i = 0; i < appListdoctoraddress.length; i++) {
            //            if (appListdoctoraddress[i].Active === "Y") {
            //                BranchesList.push(appListdoctoraddress[i]);
            //            }
            //        }
            //    }
            //}

            //$scope.AllUserBranchesList = BranchesList;

            //$scope.clinicDoctorList = [];


            var countryCode = "";
            if (doctorinfo.doctordata.UserPhone !== undefined) {
                countryCode = doctorinfo.doctordata.UserPhone[0].PhCntryCD;
            }
            var docObj = {
                "FullName": doctorinfo.doctordata.User[0].FullName,
                "DoctorID": doctorinfo.doctordata.User[0].DoctorID,
                "EmailId": doctorinfo.doctordata.UserEmail[0].EmailID,
                "MobileNo": doctorinfo.doctordata.UserAddress[0].MobileNo,
                "CountryCode": countryCode,
                "Gender": doctorinfo.doctordata.User[0].Gender,
                "UserBranchId": doctorinfo.doctordata.UserAddress[0].UserBranchId,
                "Active": "Y",
                "SpecializationId": doctorinfo.doctordata.User[0].SpecializationId,
                "MinPerCase": doctorinfo.doctordata.UserAddress[0].ExtDetails.MinPerCase,
                "RoleId": doctorinfo.doctordata.UserAddress[0].ExtDetails.RoleID,
                "ClinicName": doctorinfo.doctordata.UserAddress[0].ClinicName,
                "BranchEmail": doctorinfo.doctordata.UserAddress[0].BranchEmail
            };

            $scope.BranchDoctorsList.push(docObj);
            // $scope.BranchDoctorsListConversion.push(docObj);
            $scope.AllCounselorsList = angular.copy(docObj);
            $scope.AllConversionList = angular.copy(docObj);
            $scope.AllOptomDocList = angular.copy(docObj);


        } else {
            //$scope.AllUserBranchesList = BranchesList;
            angular.forEach($scope.AllUserBranchesList, function (iterator, index1) {
                iterator.Doctors = iterator.Doctors || [];
                $scope.BranchDoctorsList = $scope.BranchDoctorsList.concat(iterator.Doctors);
            });

            $scope.AllCounselorsList = $filter("filter")($scope.BranchDoctorsList, function (item) {
                return item.RoleId === 18;

            }) || [];
            var docAll = { "DoctorID": 0, "FullName": "All Doctors", "AddressID": 0, "MinPerCase": 15 };
            $scope.AllCounselorsList.unshift(docAll);

            $scope.AllConversionList = $filter("filter")($scope.BranchDoctorsList, function (item) {
                return item.RoleId === 1 || item.RoleId === 3 || item.RoleId === 4 || item.RoleId === 43 || item.RoleId === 56 || item.RoleId === 57 ;

            }) || [];
            var docAll = { "DoctorID": 0, "FullName": "All Doctors", "AddressID": 0, "MinPerCase": 15 };
            $scope.AllConversionList.unshift(docAll);

            $scope.AllOptomDocList = $filter("filter")($scope.BranchDoctorsList, function (item) {
                return item.RoleId === 10;

            }) || [];
            var docAll = { "DoctorID": 0, "FullName": "All Optometrists", "AddressID": 0, "MinPerCase": 15 };
            $scope.AllOptomDocList.unshift(docAll);


            $scope.BranchDoctorsList = $filter("filter")($scope.BranchDoctorsList, function (item) {
                return item.RoleId === 1 || item.RoleId === 3 || item.RoleId === 4 || item.RoleId === 43 || item.RoleId === 56 || item.RoleId === 57;
            });
            var docAll = { "DoctorID": 0, "FullName": "All Doctors", "AddressID": 0, "MinPerCase": 15 };
            $scope.BranchDoctorsList.unshift(docAll);

        }

        var currentClinic = doctorinfo.doctordata.UserAddress[0];
        if ($scope.AllUserBranchesList.length > 0) {
            angular.forEach($scope.AllUserBranchesList, function (value, key) {
                if (currentClinic.ExtDetails !== undefined && currentClinic.ExtDetails.HospitalID !== undefined && value.ExtDetails !== undefined && value.ExtDetails.HospitalID !== undefined && currentClinic.ExtDetails.HospitalID === value.ExtDetails.HospitalID) {
                    if ($scope.BranchDoctorsList.length > 0) {
                        $scope.BranchDoctorsList = _.uniq($scope.BranchDoctorsList, false, function (p) {
                            return p.DoctorID;
                        });
                    }
                }


            });
        }

        $scope.reportSearch.HospitalId = [];
        $scope.reportSearch.HospitalObj = $filter("filter")($scope.AllUserBranchesList, { "ClinicId": $scope.hospitalid1 }, true)[0];
        if ($scope.reportSearch.HospitalObj.ClinicId === 0) {
            $scope.reportSearch.HospitalId = GetAllHospitalIds();
            $scope.reportSearch.AllHospitalsIndicator = 1;
        } else {
            $scope.reportSearch.HospitalId.push($scope.reportSearch.HospitalObj.ClinicId);
            $scope.reportSearch.AllHospitalsIndicator = 0;
        }


        // $scope.reportSearch.SubOrganizationObj = $scope.SubOrganizationList[0];
        // $scope.reportSearch.SubOrganizationId = $scope.SubOrganizationList[0].SubOrganizationId;

        $scope.reportSearch.DoctorObj = $scope.BranchDoctorsList[0];
        $scope.reportSearch.DoctorId = $scope.BranchDoctorsList[0].DoctorID;
        $scope.reportSearch.CounselorObj = $scope.AllCounselorsList[0];
        $scope.reportSearch.CounselorDoctorId = $scope.AllCounselorsList[0].DoctorID;
        $scope.reportSearch.ConversionObj = $scope.AllConversionList[0];
        $scope.reportSearch.ConversionDoctorId = $scope.AllConversionList[0].DoctorID;

        $scope.reportSearch.OptomObj = $scope.AllOptomDocList[0];
        $scope.reportSearch.OptomDoctorId = $scope.AllOptomDocList[0].DoctorID;

        if ($scope.RoleId === 1 || $scope.RoleId === 56) {
            $scope.reportSearch.AllDoctorsIndicator = 0;
        } else {
            $scope.reportSearch.AllDoctorsIndicator = 1;
        }

        $scope.clearReportSearch();



    }


    $scope.changeStatus = function (item) {

        item = parseInt(item) || null;
        if (item !== null) {
            $scope.reportSearch.StatusId = item;
        }
        else {
            $scope.reportSearch.StatusId = 0;
        }
    };

    $scope.changeCategory = function (item) {
        item = item || null;
        if (item != null) {
            $scope.reportSearch.Category = item.Name;
        }
        else {
            $scope.reportSearch.Category = null;
        }
    };
    Array.prototype.unique = function () {
        var a = this.concat();
        for (var i = 0; i < a.length; ++i) {
            for (var j = i + 1; j < a.length; ++j) {

                if (a[i].$$hashKey) {
                    delete a[i].$$hashKey;
                }
                if (a[j].$$hashKey) {
                    delete a[j].$$hashKey;
                }
                if (a[i] === a[j]) {
                    a.splice(j--, 1);
                }
            }
        }
        return a;
    };


    $scope.ReloadDoctors = function (doctorslist) {

        $scope.BranchDoctorsList = angular.copy(doctorslist);

        $scope.AllCounselorsList = $filter("filter")($scope.BranchDoctorsList, function (item) {
            return item.RoleId === 18;

        });
        var docAll = { "DoctorID": 0, "FullName": "All Doctors", "AddressID": 0, "MinPerCase": 15 };
        $scope.AllCounselorsList.unshift(docAll);
        //AllCounselorsList
        $scope.AllConversionList = $filter("filter")($scope.BranchDoctorsList, function (item) {
            return item.RoleId === 1 || item.RoleId === 3 || item.RoleId === 4 || item.RoleId === 43 || item.RoleId === 56 || item.RoleId === 57;
        });
        var docAll = { "DoctorID": 0, "FullName": "All Doctors", "AddressID": 0, "MinPerCase": 15 };
        $scope.AllConversionList.unshift(docAll);

        $scope.AllOptomDocList = $filter("filter")($scope.BranchDoctorsList, function (item) {
            return item.RoleId === 10;
        });
        var docAll = { "DoctorID": 0, "FullName": "All Optometrists", "AddressID": 0, "MinPerCase": 15 };
        $scope.AllOptomDocList.unshift(docAll);


        //AllConversionList
        $scope.BranchDoctorsList = $filter("filter")($scope.BranchDoctorsList, function (item) {
            return item.RoleId === 1 || item.RoleId === 3 || item.RoleId === 4 || item.RoleId === 43 || item.RoleId === 56 || item.RoleId === 57;
        });
        var docAll = {};

        if ($scope.BranchDoctorsList.length > 0) {
            docAll = { "DoctorID": 0, "FullName": "All Doctors", "AddressID": 0, "MinPerCase": 15 };
            $scope.BranchDoctorsList.unshift(angular.copy(docAll));
        } else {
            if ($scope.RoleId !== 1 && $scope.RoleId !== 56) {
                docAll = { "DoctorID": 0, "FullName": "No Docotors", "AddressID": 0, "MinPerCase": 15 };
                $scope.BranchDoctorsList.push(angular.copy(docAll));
            }
        }

        $scope.reportSearch.DoctorObj = $scope.BranchDoctorsList[0];
        $scope.reportSearch.DoctorId = $scope.BranchDoctorsList[0].DoctorID;
        $scope.reportSearch.CounselorObj = $scope.AllCounselorsList[0];
        $scope.reportSearch.CounselorDoctorId = $scope.AllCounselorsList[0].DoctorID;
        $scope.reportSearch.ConversionObj = $scope.AllConversionList[0];
        $scope.reportSearch.ConversionDoctorId = $scope.AllConversionList[0].DoctorID;
        $scope.reportSearch.OptomObj = $scope.AllOptomDocList[0];
        $scope.reportSearch.OptomDoctorId = $scope.AllOptomDocList[0].DoctorID;

    };
    $scope.ChangeHospital = function (item) {
        //$scope.hospitalsList = [];
        var doctorslist = [];
        $scope.reportSearch.HospitalId = [];
        $scope.reportSearch.HospitalObj = item;
        //$scope.hospitalsList.push(item);
        //$scope.reportSearch.HospitalObj = $scope.hospitalsList.ClinicId;
        if (item.ClinicId === 0) {
            $scope.reportSearch.HospitalId = GetAllHospitalIds();
        } else {
            $scope.reportSearch.HospitalId.push(item.ClinicId);
        }

        if (item.ClinicId === 0) {
            angular.forEach($scope.AllUserBranchesList, function (item, index) {
                var tempdoctors = item.Doctors || [];
                doctorslist = doctorslist.concat(tempdoctors);
                doctorslist = _.uniq(doctorslist, false, function (p) {
                    return p.DoctorID;
                });
            });
            $scope.reportSearch.AllHospitalsIndicator = 1;
        } else {
            doctorslist = item.Doctors || [];
            $scope.reportSearch.AllHospitalsIndicator = 0;
        }
        if ($scope.RoleId !== 1 && $scope.RoleId !== 56) {
            $scope.ReloadDoctors(doctorslist);
        }



    };



    $scope.ChangeNewHospital = function (item) {

        var doctorslist = [];
        $scope.reportSearch.HospitalId = [];
        $scope.reportSearch.HospitalObj = item;
        $scope.hospitalid1 = item.ClinicId;
        $scope.loadType = "onChange";
        if (item.ClinicId === 0) {
            $scope.reportSearch.HospitalId = GetAllHospitalIds();
        } else {
            $scope.reportSearch.HospitalId.push(item.ClinicId);
        }

        if (item.ClinicId === 0) {

            $scope.reportSearch.AllHospitalsIndicator = 1;
            $scope.defaultbranch = $filter("filter")($scope.AllUserBranchesList, function (item) {
                return item.BranchId === doctorinfo.doctordata.UserAddress[0].ClinicId;
            });

            $scope.selectedBranch = $scope.defaultbranch[0];
        } else {
            $scope.selectedBranch = item;
            $scope.reportSearch.AllHospitalsIndicator = 0;
        }





        // GetBranchSubSpecializations($scope.selectedBranch.SubOrganizationId, $scope.selectedBranch.BranchId);
        GetBranchSubSpecializationsforReports($scope.selectedBranch.SubOrganizationId, $scope.selectedBranch.BranchId);

    };

    $scope.ChangeNewSubOrganizationList = function (item) {
        $scope.reportSearch.SubOrganizationObj = item;
        $scope.reportSearch.SubOrganizationId = item.SubOrganizationId;
        if ($scope.reportSearch.SubOrganizationId === 0) {

            $scope.reportSearch.HospitalObj.ClinicId = 0;
            $scope.reportSearch.HospitalObj = $filter("filter")($scope.AllUserBranchesList, { "ClinicId": $scope.reportSearch.HospitalObj.ClinicId }, true)[0];
            $scope.reportSearch.DepartmentObj = $scope.allSubSpecializationsReportArray[0];
            $scope.reportSearch.DepartmentId = $scope.allSubSpecializationsReportArray[0].SubSpecializationId;
        }
        // $scope.getAllBranchesBySubOrganizationId($scope.reportSearch.SubOrganizationId);
        else {
            $scope.getAllReportBranchesBySubOrganizationId($scope.reportSearch.SubOrganizationId);
        }

    }
    $scope.ChangeDoctor = function (doctorobj) {
        $scope.reportSearch.DoctorObj = doctorobj;
        $scope.reportSearch.DoctorId = doctorobj.DoctorID;
        $scope.reportSearch.AllDoctorsIndicator = 0;
        if (doctorobj.DoctorID === 0) {
            $scope.reportSearch.AllDoctorsIndicator = 1;
        }

    };
    $scope.ChangeCounsel = function (counselobj) {
        $scope.reportSearch.CounselorObj = counselobj;
        $scope.reportSearch.CounselorDoctorId = counselobj.DoctorID;
    };
    $scope.ChangeOptom = function (OptomObj) {
        $scope.reportSearch.OptomObj = OptomObj;
        $scope.reportSearch.OptomDoctorId = OptomObj.DoctorID;
    };

    $scope.ChangeConversion = function (ConversionObj) {
        $scope.reportSearch.ConversionObj = ConversionObj;
        $scope.reportSearch.ConversionDoctorId = ConversionObj.DoctorID;
    };
    $scope.ChangeReportType = function (Obj) {
        $scope.reportSearch.selectedReportObj = Obj;
        $scope.reportSearch.ReportTypeId = Obj.Id;


    };

    $scope.AllReports = [];

    $scope.revenuTreatmentWiseArray = [];
    $scope.revenueTreatmentwiseArrayCount = 0;
    $scope.treatrevenuemaxsize = 5;
    $scope.AllReports = [
        {
            "Id": 0,
            "Name": "Select a Report"
        },
        //{
        //    "Id": 1,
        //    "Name": "Appointment Wise Report",
        //},
        //{
        //    "Id": 2,
        //    "Name": "Treatment Wise Report",
        //},
        {
            "Id": 3,
            "Name": "Incenitive Report"
        }
    ];

    $scope.getDoctorsRevenueTreatWise = function (obj) {
        var params = obj;

        eHnoteMainDashboardDataServices.getAllDoctorsTreatmentRevenue(params, onsuccess, onerror);
        function onsuccess(data) {
            $scope.revenuTreatmentWiseArray = [];
            $scope.revenueTreatmentwiseArrayCount = 0;
            if (data.count !== 0) {
                if (data.rows.length > 0) {
                    $scope.revenuTreatmentWiseArray = data.rows;
                    $scope.revenueTreatmentwiseArrayCount = data.count;
                }
            }
        }
        function onerror(error) {
            $scope.revenuTreatmentWiseArray = [];
            $scope.revenueTreatmentwiseArrayCount = 0;
            console.log(error);
        }
    };

    $scope.revenueDetailedReportPageSize = 10;
    $scope.revenueDetailedReportPageNo = 1;
    $scope.revenuTreatmentWiseDetailedArray = [];
    $scope.revenueTreatmentwiseDetailedArrayCount = 0;

    $scope.getDoctorRevenueTreatWiseDetails = function (obj) {
        var params = {
            "UserId": obj.UserId,
            "HospitalId": obj.HospitalId,
            "FromDate": $scope.reportSearch.FromDate,
            "ToDate": $scope.reportSearch.ToDate,
            "PageSize": $scope.revenueDetailedReportPageSize,
            "PageNumber": $scope.revenueDetailedReportPageNo
        };

        eHnoteMainDashboardDataServices.getDoctorTreatmentRevenueDetails(params, onsuccess, onerror);
        function onsuccess(data) {
            $scope.revenuTreatmentWiseDetailedArray = [];
            $scope.revenueTreatmentwiseDetailedArrayCount = 0;
            if (data.count !== 0) {
                if (data.rows.length > 0) {
                    $scope.revenuTreatmentWiseDetailedArray = data.rows;
                    $scope.revenueTreatmentwiseDetailedArrayCount = data.count;
                    $scope.showTreatRevenueTreatmentwiseDetailPopup = true;

                }
            }


        }
        function onerror(error) {
            console.log(error);
        }
    };

    $scope.searchForSelectedReport = function () {

        $scope.getDoctorsRevenueTreatWise($scope.reportSearch);

    };

    $scope.clearReportSearch = function () {
        $scope.reportSearch = {
            "FromDate": $filter('date')(new Date(d), "dd-MMM-yyyy"),
            "ToDate": $filter('date')(new Date(d), "dd-MMM-yyyy"),
            "EndDate": $filter("date")(new Date().setDate(new Date().getDate() + 60), "dd-MM-yyyy"),
            "AllHospitalsIndicator": 1,
            "HospitalId": GetAllHospitalIds(),
            "HospitalObj": "",
            "AllDoctorsIndicator": 1,
            "DoctorId": 0,
            "ConversionObj": "",
            "ConversionDoctorId": 0,
            "DoctorObj": "",
            "PageSize": 10,
            "PageNumber": 1,
            "CounselorObj": "",
            "CounselorDoctorId": 0,
            "OptomObj": "",
            "OptomDoctorId": 0,
            "Category": null,
            "SubOrganizationObj": "",
            "SubOrganizationId": 0,
            "DepartmentObj": "",
            "DepartmentId": 0
        };



        if ($scope.reportSearch.SubOrganizationId === 0) {
            $scope.reportSearch.SubOrganizationObj = $scope.SubOrganizationReportList[0];
            $scope.reportSearch.SubOrganizationId = $scope.SubOrganizationReportList[0].SubOrganizationId;
        }
        $scope.reportSearch.HospitalId = [];
        $scope.reportSearch.HospitalObj = $filter("filter")($scope.AllUserBranchesList, { "ClinicId": $scope.hospitalid1 }, true)[0];
        if ($scope.reportSearch.HospitalObj.ClinicId === 0) {
            $scope.reportSearch.HospitalId = GetAllHospitalIds();
            $scope.reportSearch.AllHospitalsIndicator = 1;
        } else {
            $scope.reportSearch.HospitalId.push($scope.reportSearch.HospitalObj.ClinicId);
            $scope.reportSearch.AllHospitalsIndicator = 0;
        }

        $scope.reportSearch.DoctorObj = $scope.BranchDoctorsList[0];
        $scope.reportSearch.CounselorObj = $scope.BranchDoctorsList[0];
        if ($scope.BranchDoctorsList.length > 0) {
            $scope.reportSearch.DoctorId = $scope.BranchDoctorsList[0].DoctorID;
        }

        $scope.reportSearch.ConversionObj = $scope.AllConversionList[0];
        $scope.reportSearch.ConversionDoctorId = $scope.AllConversionList[0].DoctorID;
        $scope.reportSearch.OptomObj = $scope.AllOptomDocList[0];
        $scope.reportSearch.OptomDoctorId = $scope.AllOptomDocList[0].DoctorID;
        if ($scope.RoleId === 1 || $scope.RoleId === 56) {
            $scope.reportSearch.AllDoctorsIndicator = 0;
        } else {
            $scope.reportSearch.AllDoctorsIndicator = 1;
        }
        if ($scope.reportSearch.DepartmentId === 0) {
            $scope.reportSearch.DepartmentObj = $scope.allSubSpecializationsReportArray[0];
            $scope.reportSearch.DepartmentId = $scope.allSubSpecializationsReportArray[0].SubSpecializationId;
        }
        var NewBranchList = localStorageFactory.getItem("allBranchesData") || [];
        // initializeReportNewBranches(NewBranchList);
    };

    $scope.selectedTreatRevneueObj = "";
    $scope.showDetailedRevenueReport = function (item) {
        $scope.selectedTreatRevneueObj = item;
        $scope.getDoctorRevenueTreatWiseDetails(item);

    };
    $scope.closeTreatRevenueDetailPopup = function () {
        $scope.showTreatRevenueTreatmentwiseDetailPopup = false;
        $scope.revenueDetailedReportPageNo = 1;
        $scope.selectedTreatRevneueObj = "";
    };

    $scope.changeTreatRevenuePage = function (pageno) {
        $scope.reportSearch.PageNumber = pageno;
        $scope.getDoctorsRevenueTreatWise($scope.reportSearch);
    };

    $scope.changeTreatRevenueDetailsPage = function (pageno) {
        $scope.revenueDetailedReportPageNo = pageno;
        $scope.getDoctorRevenueTreatWiseDetails($scope.selectedTreatRevneueObj);
    };



    $scope.switchdashboardTab = function (type) {
        $scope.dashboardTab = type;
        $scope.showDashBordDetailsDiv = false;
        backToUserLocationId()
        if (type === "reports") {
            $scope.showdentalDashBordDetailsDiv = false;

            $scope.showMainReportsScreen = true;
            $scope.showComingSoonDiv = false;
            $scope.showIncentiveEligiblReportDiv = false;
            $scope.showIncentiveReportDiv = false;
            $scope.showDynamicSurgeryConvertedReportDiv = false;
            $scope.showTreatmentReportDiv = false;
            $scope.showDailyReportDiv = false;
            $scope.showDaywisecollectionReportDiv = false;
            $scope.showOPReferralReportDiv = false;
            $scope.showOPDoctorReportDiv = false;
            $scope.showOPSurgeryAppointmentReportDiv = false;
            $scope.showOPSurgeryPerformedReportDiv = false;
            $scope.showOPProcedureReportDiv = false;
            $scope.showOPInvestigationReportDiv = false;
            $scope.showOPSurgeryCostReportDiv = false;
            $scope.showOPInvestigationCostReportDiv = false;
            $scope.showOPProcedureCostReportDiv = false;
            $scope.showOPLabReportDiv = false;
            $scope.showOPLabCostReportDiv = false;
            $scope.showOPSurgeryPerformedCountReportDiv = false;
            $scope.showOPInvestigationCountReportDiv = false;
            $scope.showOPReferralWiseCostReportDiv = false;
            $scope.showOPForm3CReportDiv = false;
            $scope.showTreatmentRevenueReportDiv = false;
            $scope.showOutPatientReVenueReportDiv = false;
            $scope.showSurgeryRevenueReportDiv = false;
            $scope.showInvestigationRevenueReportDiv = false;
            $scope.showLabRevenueReportDiv = false;
            $scope.showAccountRevenueReportDiv = false;
            $scope.showAccountExpensesReportDiv = false;
            $scope.showAccountsBankDepositReportDiv = false;
            $scope.showwaivedoffReportDiv = false;
            $scope.showNewPatientReportData = true;
            $scope.showAppointmentStatisticsReportData = true;

            $scope.Visitreasons = angular.copy($scope.AllVisitreasons);

            $scope.navtoReportsTab();
            //$scope.GetSurgeryDashBoardDetails($scope.HospitalIdsList, 0);
        }
        if (type === 'summary') {
            if (doctorinfo.doctordata.UserSubOrganization !== undefined) {
                doctorinfo.doctordata.UserSubOrganization = doctorinfo.doctordata.UserSubOrganization || [];
                if (doctorinfo.doctordata.UserSubOrganization.length > 0) {

                    $scope.SubOrganizationList = [];
                    $scope.SubOrganizationReportList = [];

                    $scope.SubOrganizationList = doctorinfo.doctordata.UserSubOrganization;
                    $scope.SubOrganizationList = $filter("filter")($scope.SubOrganizationList, function (item) {
                        return item.SubOrganizationId != 0;
                    });
                    $scope.SubOrganizationReportList = doctorinfo.doctordata.UserSubOrganization;
                    if ($scope.SubOrganizationList.length > 0) {
                        $scope.SelectedSubOrganization = $scope.SubOrganizationList[0];
                        $scope.SubOrganizationId = $scope.SubOrganizationList[0].SubOrganizationId;
                        $scope.SubOrganizationIdsList = [];
                        angular.forEach($scope.SubOrganizationList, function (item, index) {
                            $scope.SubOrganizationIdsList.push(item.SubOrganizationId);
                        });
                    }
                }
            }
            var data = localStorageFactory.getItem("allBranchesData") || [];
            initializeNewBranches(data);
        }
        if (type === 'LeadGeneration') {
            $scope.AllUsersList = [];
            if ($scope.SubDepartmentId !== "") {

                var listSubSplArray = $filter("filter")($scope.allSubSpecializationsArray, function (iterator, ind) { return iterator.SubSpecializationId === $scope.SubDepartmentId; });
            }
            else {
                var listSubSplArray = $scope.allSubSpecializationsArray;
            }
            var subSplArray = _.pluck(listSubSplArray, "SubSpecializationId").join(",");

            var usersReqParams = {
                "BranchId": $scope.HospitalId,
                "SubSpecializationIdArray": subSplArray
            };
           
            $q.all([
                eHnoteMainAppointmentService.getAllUsersByDepartmentIdNew(usersReqParams)
                
            ]).then(function (resp) {
                if (resp[0].data.status == "Success") {
                    let doctorRows = resp[0].data.rows || [];
                    $scope.AllUsersList = _.uniq(doctorRows, false, function (p) { return p.DoctorID; });
                    $scope.AllDoctorList = angular.copy($scope.AllUsersList || []);
                    $scope.AllDoctorList = $filter("filter")($scope.AllDoctorList, function (item) {
                        return item.RoleId === 1 || item.RoleId === 43;
                    });

                    // the tab title only opens the dropdown - the report waits
                    // for Daily or Monthly to be picked
                    $scope.prepareLeadGenReport();
                }



            }).catch(function (err) {
                console.error("Error fetching data:", err);
            });
        }
        if (type === 'ODReport') {
            // the OD report needs the same doctor list the lead generation tab
            // builds, so reuse it and only refetch when it has not been loaded
            if (($scope.AllDoctorList || []).length > 0) {
                $scope.prepareODReport();
            } else {
                var odSubSplArray = _.pluck($scope.allSubSpecializationsArray, "SubSpecializationId").join(",");

                eHnoteMainAppointmentService.getAllUsersByDepartmentIdNew({
                    "BranchId": $scope.HospitalId,
                    "SubSpecializationIdArray": odSubSplArray
                }).then(function (resp) {
                    if (resp.data.status == "Success") {
                        let doctorRows = resp.data.rows || [];
                        $scope.AllUsersList = _.uniq(doctorRows, false, function (p) { return p.DoctorID; });
                        $scope.AllDoctorList = $filter("filter")(angular.copy($scope.AllUsersList), function (item) {
                            return item.RoleId === 1 || item.RoleId === 43;
                        });
                    }
                    $scope.prepareODReport();
                }).catch(function (err) {
                    console.error("Error fetching data:", err);
                });
            }
        }
        // 'providerProductivity' needs nothing here - that tab is an ng-include of
        // templates/UsClaims/Reports/ProviderProductivityReports.html, which boots
        // USProviderProductivityCtrl on its own.

    };



    $scope.PaymentDateRangeArray = [
        //{ Id: 1, Name: 'Today' },
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

    /* the Daily Lead Generation and OD reports leave the long ranges off their
       Date dropdown - Last 3 months, This year, Last year. Monthly keeps them all. */
    var DailyReportHiddenRangeIds = [7, 9, 10];
    $scope.DailyReportDateRangeArray = $scope.PaymentDateRangeArray.filter(function (r) {
        return DailyReportHiddenRangeIds.indexOf(r.Id) === -1;
    });

    $scope.setInsuranceCheckDateRange = function (selectedRangeId) {
        var currentDate = new Date();

        switch (selectedRangeId) {
            case 1: // Today
                $scope.LeadGenReportsObj.PaymentFromDate = new Date(currentDate);
                $scope.LeadGenReportsObj.PaymentToDate = new Date(currentDate);
                break;
            case 2: // Yesterday
                $scope.LeadGenReportsObj.PaymentFromDate = new Date(currentDate.setDate(currentDate.getDate() - 1));
                var currentDate = new Date();
                $scope.LeadGenReportsObj.PaymentToDate = new Date(currentDate.setDate(currentDate.getDate() - 1))// new Date(); // Reset to current date
                break;
            case 3: // Last week
                $scope.LeadGenReportsObj.PaymentFromDate = new Date(currentDate.setDate(currentDate.getDate() - 7));
                $scope.LeadGenReportsObj.PaymentToDate = new Date(); // Reset to current date
                break;
            case 4: // This month
                $scope.LeadGenReportsObj.PaymentFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                $scope.LeadGenReportsObj.PaymentToDate = new Date(); // Reset to current date
                break;
            case 5: // Last month
                $scope.LeadGenReportsObj.PaymentFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
                $scope.LeadGenReportsObj.PaymentToDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0); // Last day of the previous month
                break;
            case 6: // Last 2 months
                $scope.LeadGenReportsObj.PaymentFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1);
                $scope.LeadGenReportsObj.PaymentToDate = new Date(); // Reset to current date
                break;
            case 7: // Last 3 months
                $scope.LeadGenReportsObj.PaymentFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, 1);
                $scope.LeadGenReportsObj.PaymentToDate = new Date(); // Reset to current date
                break;
            case 8: // Last 6 months
                $scope.LeadGenReportsObj.PaymentFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 6, 1);
                $scope.LeadGenReportsObj.PaymentToDate = new Date(); // Reset to current date
                break;
            case 9: // This year
                $scope.LeadGenReportsObj.PaymentFromDate = new Date(currentDate.getFullYear(), 0, 1); // January 1st of current year
                $scope.LeadGenReportsObj.PaymentToDate = new Date(); // Reset to current date
                break;
            case 10: // Last year
                $scope.LeadGenReportsObj.PaymentFromDate = new Date(currentDate.getFullYear() - 1, 0, 1); // January 1st of last year
                $scope.LeadGenReportsObj.PaymentToDate = new Date(currentDate.getFullYear() - 1, 11, 31); // December 31st of last year
                break;
            case 11: // Custom Date
                $scope.LeadGenReportsObj.PaymentFromDate = null;
                $scope.LeadGenReportsObj.PaymentToDate = null;
                break;
            default:
                $scope.LeadGenReportsObj.PaymentFromDate = "";
                $scope.LeadGenReportsObj.PaymentToDate = "";
        }

        $scope.LeadGenReportsObj.PaymentFromDate = $scope.LeadGenReportsObj.PaymentFromDate;
        $scope.LeadGenReportsObj.PaymentToDate = $scope.LeadGenReportsObj.PaymentToDate;

        if ($scope.LeadGenReportsObj.PaymentFromDate != '') {
            $scope.LeadGenReportsObj.PaymentFromDate = $filter('date')($scope.LeadGenReportsObj.PaymentFromDate, "MM-dd-yyyy");
        }
        if ($scope.LeadGenReportsObj.PaymentToDate != '') {
            $scope.LeadGenReportsObj.PaymentToDate = $filter('date')($scope.LeadGenReportsObj.PaymentToDate, "MM-dd-yyyy");
        }
    };

    $scope.GetMasterImplantsRelatedData = function () {
        let req = {
            "ParentOrganizationId": $scope.ParenthospitalId,
        }

        InventoryService.GetInventoryMasterIOLData(req).then(function (resp) {
            if (resp.data != undefined) {

                $scope.TypesofLens = resp.data.TypesofLens || [];
                $scope.Manufacturers = resp.data.Manufacturers || [];
                $scope.DiopterArray = resp.data.DiopterArray || [];
                $scope.IOLStatusArray = resp.data.IOLStatusArray || [];
                $scope.HospitalModels = resp.data.HospitalModels || [];
                $scope.Subcategory = resp.data.Subcategory || [];

                $scope.SubTypecategory = $filter('filter')($scope.Subcategory, { 'CategoryId': 10 }, true) || [];
                if ($scope.IOLStatusArray.length > 0) {
                    angular.forEach($scope.IOLStatusArray, function (item) {
                        item.IsChecked = true;
                    });
                }
            }
        });

    }
    $scope.GetMasterImplantsRelatedData();

    $scope.init = function () {
        if (doctorinfo !== "") {

            if (doctorinfo.doctordata.UserSubOrganization !== undefined) {
                doctorinfo.doctordata.UserSubOrganization = doctorinfo.doctordata.UserSubOrganization || [];
                if (doctorinfo.doctordata.UserSubOrganization.length > 0) {

                    $scope.SubOrganizationList = [];
                    $scope.SubOrganizationReportList = [];
                    $scope.SubOrganizationList = doctorinfo.doctordata.UserSubOrganization;
                    $scope.SubOrganizationReportList = doctorinfo.doctordata.UserSubOrganization;
                    if ($scope.SubOrganizationList.length > 0) {
                        $scope.SelectedSubOrganization = $scope.SubOrganizationList[0];
                        $scope.SubOrganizationId = $scope.SubOrganizationList[0].SubOrganizationId;
                        $scope.SubOrganizationIdsList = [];
                        angular.forEach($scope.SubOrganizationList, function (item, index) {
                            $scope.SubOrganizationIdsList.push(item.SubOrganizationId);
                        });
                    }
                }
            }
        }


        var data = localStorageFactory.getItem("allBranchesData") || [];
        initializeNewBranches(data);

        console.log($scope.UserAccessRights.SubAccessCategories.DashBoardSummary)
        if ($scope.UserAccessRights.SubAccessCategories.DashBoardSummary) {
            $scope.dashboardTab = 'summary';
        }
        else if ($scope.UserAccessRights.SubAccessCategories.DashBoardReports) {
            $scope.dashboardTab = 'reports';
        }
        else if ($scope.UserAccessRights.SubAccessCategories.DashBoardAdditionalReports) {
            $scope.dashboardTab = 'additionalReports';
        }

        $scope.switchdashboardTab($scope.dashboardTab);

        $scope.appointmentTypes = [];
        $scope.MasterReasonTypes = [];
        eHnotePatientAddressDataServices.getAppointmentTypes(onTypesSuccess, onTypesFailed);
        function onTypesSuccess(data) {

            $scope.appointmentTypes = data;
            angular.forEach($scope.appointmentTypes, function (mitem) {
                mitem.isChecked = true;
            });
            $scope.AllDoctorsObj.AllAppointmentTypeStatusCheck = true;
            $scope.selectVisitType = "All";
        }
        function onTypesFailed(err) {
            console.log(err);
        }
        //eHnotePatientVisitReasonServices.GetParentOrgReasonTypes($scope.ParenthospitalId).then(function (resp) {
        //    if (resp.data.rows.length !== 0) {
        //        $scope.MasterReasonTypes = resp.data.rows;
        //        angular.forEach($scope.MasterReasonTypes, function (sitem) {
        //            sitem.isChecked = false;
        //        });
        //        var selectedInternalDoctors = $filter("filter")($scope.MasterReasonTypes, function (iterator, ind) { return iterator.isChecked == true; });
        //        if (selectedInternalDoctors.length === $scope.MasterReasonTypes.length) {
        //            $scope.AllDoctorsObj.AllResonTypeCheck = true;

        //            $scope.selectResonType = 'All';
        //        } else {
        //            $scope.AllDoctorsObj.AllResonTypeCheck = false;
        //            $scope.selectResonType = 'Select ResonType';
        //        }
        //    }
        //});
        var reqObj = {
            'LocationId': null,
            'PageNumber': 1,
            'PageSize': 10,
            'SearchTaxt':'',
            "SpecializationId": null,
            "DeleteInd": "N",
            "OrganizationId": $scope.HospitalId,
            "RefaralTypeId": 5

        };
        //eHnoteReferalDataService.GetReferalPCPDoctors(reqObj).then(function (resp) {

        //    if (resp.data.status === "Success") {
        //        $scope.ReferalPCPDoctorsList = resp.data.PcpRefdetails;
        //        $scope.ReferalPCPDoctorsListCount = resp.data.count;

        //        angular.forEach($scope.ReferalPCPDoctorsList, function (sitem) {
        //            if (sitem.DeleteInd == "N") {
        //                sitem.UserActiveStatus = true;
        //                sitem.isChecked = false;
        //            } else {
        //                sitem.UserActiveStatus = false;
        //                sitem.isChecked = false;
        //            }
        //        });

        //    }
        //    else {
        //        alertify.error(resp.data.Message);
        //    }

        //});
        $q.all([
            eHnotePatientVisitReasonServices.GetParentOrgReasonTypes($scope.ParenthospitalId),
            eHnoteReferalDataService.GetReferalPCPDoctors(reqObj)
        ]).then(function (resp) {
            if (resp[0].data.rows.length !== 0) {
                $scope.MasterReasonTypes = resp[0].data.rows;
                angular.forEach($scope.MasterReasonTypes, function (sitem) {
                    sitem.isChecked = false;
                });
                var selectedInternalDoctors = $filter("filter")($scope.MasterReasonTypes, function (iterator, ind) { return iterator.isChecked == true; });
                if (selectedInternalDoctors.length === $scope.MasterReasonTypes.length) {
                    $scope.AllDoctorsObj.AllResonTypeCheck = true;

                    $scope.selectResonType = 'All';
                } else {
                    $scope.AllDoctorsObj.AllResonTypeCheck = false;
                    $scope.selectResonType = 'Select ResonType';
                }
            }
            if (resp[1].data.status === "Success") {
                $scope.ReferalPCPDoctorsList = resp[1].data.PcpRefdetails;
                $scope.ReferalPCPDoctorsListCount = resp[1].data.count;

                angular.forEach($scope.ReferalPCPDoctorsList, function (sitem) {
                    if (sitem.DeleteInd == "N") {
                        sitem.UserActiveStatus = true;
                        sitem.isChecked = false;
                    } else {
                        sitem.UserActiveStatus = false;
                        sitem.isChecked = false;
                    }
                });

            }
        })
    };
    $scope.init();

    $scope.GetIncentiveReport = function (PageNumber, reportType) {

        // $scope.reportSearch.FromDate = $filter("dateFormatter")($scope.reportSearch.FromDate, "-");
        // $scope.reportSearch.ToDate = $filter("dateFormatter")($scope.reportSearch.ToDate, "-");
        Object = {
            "DoctorId": $scope.reportSearch.DoctorId,
            "ParentOrganizationId": parentHospitalId,
            "HospitalID": $scope.reportSearch.HospitalId,
            "AllHospitalsIndicator": $scope.reportSearch.AllHospitalsIndicator,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageNumber": PageNumber ? PageNumber : 1,
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "ReportType": reportType,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId,
            "DepartmentId": $scope.reportSearch.DepartmentId
        };

        eHnoteMainDashboardDataServices.GetIncentiveReport(Object).then(function (resp) {
            if (reportType === 'export' && $scope.reportSearch.AllHospitalsIndicator == 1) {
                if (resp.data != "") {
                    var file = new Blob([resp.data], { type: "text/csv" });
                    saveAs(file, "IncentiveReport" + 1 + ".csv");
                }
            } else {
                if (resp.data.status === "Success") {
                    if (reportType === 'export') {
                        resp.data.rows = resp.data.rows || [];
                        $scope.incentiveExportHistry = resp.data.rows;
                        generateTable($scope.incentiveExportHistry, 'Incentive');
                    } else {
                        $scope.IncentiveReportArray = resp.data.rows;
                        $scope.TotalIncentiveReportCount = resp.data.count;
                        //$scope.exportMaxSize = resp.data.count;


                    }
                }
            }




        }, function (err) { });
    };

    $scope.GetTreatmentReport = function (PageNumber, reportType) {
        Object = {
            "DoctorId": $scope.reportSearch.DoctorId,
            "ParentOrganizationId": parentHospitalId,
            "HospitalID": $scope.reportSearch.HospitalId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId,
            "DepartmentId": $scope.reportSearch.DepartmentId
        };
        eHnoteMainDashboardDataServices.GetTreatmentReport(Object).then(function (resp) {

            if (resp.data.status === "Success") {
                if (reportType === 'export') {
                    resp.data.rows = resp.data.rows || [];
                    $scope.TreatmentExportHistry = resp.data.rows;
                    generateTable($scope.TreatmentExportHistry, 'TreatmentReport');
                }
                else {
                    $scope.TreatmentReportArray = resp.data.rows;
                    //angular.forEach($scope.TreatmentReportArray, function (item) {
                    //    item.CardNumber = item.CardNumber.replace(/\d{4}(?= \d{4})/g, "xxxx");
                    //});
                    $scope.TotalTreatmentReportCount = resp.data.count;
                    //$scope.exportMaxSize = resp.data.count;
                }
            }
        }, function (err) { });
    };
    //report 39
    $scope.GetDynamicSurgeryConvertedReport = function (PageNumber, reportType) {
        Object = {
            "Category": $scope.reportSearch.Category || null,
            "DoctorId": $scope.reportSearch.DoctorId,
            "ParentOrganizationId": parentHospitalId,
            "HospitalList": $scope.reportSearch.HospitalId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId,
            "DepartmentId": $scope.reportSearch.DepartmentId
        };
        eHnoteMainDashboardDataServices.GetDynamicSurgeryConvertedReport(Object).then(function (resp) {

            if (resp.data.status === "Success") {
                if (reportType === 'export') {
                    resp.data.SurgeryPerformedReport = resp.data.SurgeryPerformedReport || [];
                    $scope.DynamicSurgeryConvertedExportHistry = resp.data.SurgeryPerformedReport;
                    generateTable($scope.DynamicSurgeryConvertedExportHistry, 'DynamicSurgeryConvertedReport');
                }
                else {
                    $scope.DynamicSurgeryReportArray = resp.data.SurgeryPerformedReport;
                    $scope.TotalDynamicSurgeryReportCount = resp.data.Count;

                }
            }
        }, function (err) { });
    };

    //report 40
    $scope.GetDailyReport = function (PageNumber, reportType) {
        Object = {
            "DoctorId": $scope.reportSearch.DoctorId,
            "ParentOrganizationId": parentHospitalId,
            "HospitalsList": $scope.reportSearch.HospitalId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId,
            "DepartmentId": $scope.reportSearch.DepartmentId
        };
        eHnoteMainDashboardDataServices.GetDailyReport(Object).then(function (resp) {

            if (resp.data.status === "Success") {
                if (reportType === 'export') {
                    resp.data.rows = resp.data.rows || [];
                    $scope.DailyExportHistry = resp.data.rows;
                    //generateTable($scope.DailyExportHistry, 'DailyReport');
                    generateTableDailyReport($scope.DailyExportHistry, 'DailyReport');
                }
                else {
                    $scope.DailyReportArray = resp.data.rows;
                    angular.forEach($scope.DailyReportArray, function (data, index) {
                        data.ContentShow = false;
                    });
                    $scope.TotalDailyReportCount = resp.data.count;
                    //$scope.exportMaxSize = resp.data.count == 0 ? $scope.exportMaxSize : resp.data.count;
                }
            }


        }, function (err) { });
    };


    //startreports
    //$scope.GetDaycollectionReport = function (PageNumber, reportType) {
    //    Object = {
    //        "DoctorId": $scope.reportSearch.DoctorId,
    //        "ParentOrganizationId": parentHospitalId,
    //        "HospitalList": $scope.reportSearch.HospitalId,
    //        "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
    //        "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
    //        //"PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
    //        //"PageNumber": PageNumber ? PageNumber : 1
    //    };
    //    eHnoteMainDashboardDataServices.GetDaycollectionReport(Object).then(function (resp) {

    //        if (resp.data.status === "Success") {
    //            if (reportType === 'export') {
    //                $scope.DaycollectionExportHistry = resp.data.DaywiseReport;             
    //                generateTable($scope.DaycollectionExportHistry, 'DayWiseCollection');
    //            }
    //            else {
    //                $scope.DaycollectionReportArray = resp.data.DaywiseReport;                   
    //            }
    //        }
    //    }, function (err) { });
    //};

    //endreports
    //  exec Proc_getDetailInfoReport'{"ProcedureType":"TreatmentRevenue","ParentOrganizationId":92,"HospitalList":[92],"StartDate":"2019-06-13","EndDate":"2019-06-13","PageSize":10,"PageNumber":1}'

    // $scope.TreatmentRevenueArray = [];
    $scope.TreatmentRevenueReportData = {
        "TreatmentRevenueArray": [],
        "count": 0
    };
    $scope.GetTreatmentRevenueReport = function (PageNumber, reportType) {
        Object = {
            "DoctorId": $scope.reportSearch.DoctorId,
            "ProcedureType": 'TreatmentRevenue',
            "ParentOrganizationId": parentHospitalId,
            "HospitalList": $scope.reportSearch.HospitalId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId,
            "DepartmentId": $scope.reportSearch.DepartmentId
            // "GetAllIndicator": $scope.GetAllIndicator
        };
        eHnoteMainDashboardDataServices.GetTreatmentRevenueReport(Object).then(function (resp) {

            //  if (resp.data.status === "Success") {
            if (reportType === 'export') {
                resp.data.TreatmentRevenue = resp.data.TreatmentRevenue || [];
                $scope.Report1ExportHistry = resp.data.TreatmentRevenue;
                generateTable($scope.Report1ExportHistry, 'TreatmentRevenue');
            }
            else {
                $scope.TreatmentRevenueReportData.TreatmentRevenueArray = resp.data.TreatmentRevenue;
                $scope.TotalTreatmentRevenueCount = resp.data.Count;

            }
            // }
        }, function (err) { });
    };
    $scope.OutPatientReVenueData = {
        "OutPatientReVenueArray": [],
        "count": 0
    };
    $scope.GetOutPatientReVenueReport = function (PageNumber, reportType) {
        Object = {
            "DoctorId": $scope.reportSearch.DoctorId,
            "ProcedureType": 'OutPatientReVenue',
            "ParentOrganizationId": parentHospitalId,
            "HospitalList": $scope.reportSearch.HospitalId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId,
            "DepartmentId": $scope.reportSearch.DepartmentId
        };
        eHnoteMainDashboardDataServices.GetTreatmentRevenueReport(Object).then(function (resp) {

            // if (resp.data.status === "Success") {
            if (reportType === 'export') {
                resp.data.OutPatientReVenue = resp.data.OutPatientReVenue || [];
                $scope.Report1ExportHistry = resp.data.OutPatientReVenue;
                generateTable($scope.Report1ExportHistry, 'OutPatientReVenue');
            }
            else {
                $scope.OutPatientReVenueData.OutPatientReVenueArray = resp.data.OutPatientReVenue;
                $scope.TotalOutPatientReVenueCount = resp.data.Count;

            }
            //  }
        }, function (err) { });
    };
    $scope.SurgeryRevenueData = {
        "SurgeryRevenueArray": [],
        "count": 0
    };
    $scope.GetSurgeryRevenueReport = function (PageNumber, reportType) {
        Object = {
            "DoctorId": $scope.reportSearch.DoctorId,
            "ProcedureType": 'SurgeryRevenue',
            "ParentOrganizationId": parentHospitalId,
            "HospitalList": $scope.reportSearch.HospitalId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId,
            "DepartmentId": $scope.reportSearch.DepartmentId
        };
        eHnoteMainDashboardDataServices.GetTreatmentRevenueReport(Object).then(function (resp) {

            //  if (resp.data.status === "Success") {
            if (reportType === 'export') {
                resp.data.SurgeryRevenue = resp.data.SurgeryRevenue || [];
                $scope.Report1ExportHistry = resp.data.SurgeryRevenue;
                generateTable($scope.Report1ExportHistry, 'SurgeryRevenue');
            }
            else {
                $scope.SurgeryRevenueData.SurgeryRevenueArray = resp.data.SurgeryRevenue;
                $scope.TotalSurgeryRevenueCount = resp.data.Count;

            }
            // }
        }, function (err) { });
    };
    $scope.InvestigationRevenueData = {
        "InvestigationRevenueArray": [],
        "count": 0
    };
    $scope.GetInvestigationRevenueReport = function (PageNumber, reportType) {
        Object = {
            "DoctorId": $scope.reportSearch.DoctorId,
            "ProcedureType": 'InvestigationRevenue',
            "ParentOrganizationId": parentHospitalId,
            "HospitalList": $scope.reportSearch.HospitalId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId,
            "DepartmentId": $scope.reportSearch.DepartmentId
        };
        eHnoteMainDashboardDataServices.GetTreatmentRevenueReport(Object).then(function (resp) {

            //  if (resp.data.status === "Success") {
            if (reportType === 'export') {
                resp.data.InvestigationRevenue = resp.data.InvestigationRevenue || [];
                $scope.Report1ExportHistry = resp.data.InvestigationRevenue;
                generateTable($scope.Report1ExportHistry, 'InvestigationRevenue');
            }
            else {
                $scope.InvestigationRevenueData.InvestigationRevenueArray = resp.data.InvestigationRevenue;
                $scope.TotalInvestigationRevenueCount = resp.data.Count;

            }
            // }
        }, function (err) { });
    };
    $scope.LabRevenueData = {
        "LabRevenueArray": [],
        "count": 0
    };
    $scope.GetLabRevenueReport = function (PageNumber, reportType) {
        Object = {
            "DoctorId": $scope.reportSearch.DoctorId,
            "ProcedureType": 'LabRevenue',
            "ParentOrganizationId": parentHospitalId,
            "HospitalList": $scope.reportSearch.HospitalId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId,
            "DepartmentId": $scope.reportSearch.DepartmentId
        };
        eHnoteMainDashboardDataServices.GetTreatmentRevenueReport(Object).then(function (resp) {

            //  if (resp.data.status === "Success") {
            if (reportType === 'export') {
                resp.data.LabRevenue = resp.data.LabRevenue || [];
                $scope.Report1ExportHistry = resp.data.LabRevenue;
                generateTable($scope.Report1ExportHistry, 'LabRevenue');
            }
            else {
                $scope.LabRevenueData.LabRevenueArray = resp.data.LabRevenue;
                $scope.TotalLabRevenueCount = resp.data.Count;

            }
            // }
        }, function (err) { });
    };
    //report1
    $scope.GetOPReferralReport = function (PageNumber, reportType) {
        Object = {
            "DoctorId": $scope.reportSearch.DoctorId,
            "ParentOrganizationId": parentHospitalId,
            "HospitalList": $scope.reportSearch.HospitalId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1
        };
        eHnoteMainDashboardDataServices.GetOPReferralReport(Object).then(function (resp) {

            if (resp.data.status === "Success") {
                if (reportType === 'export') {
                    resp.data.ReferralReport = resp.data.ReferralReport || [];
                    $scope.Report1ExportHistry = resp.data.ReferralReport;
                    generateTable($scope.Report1ExportHistry, 'Referral Report');
                }
                else {
                    $scope.ReferralReportArray = resp.data.ReferralReport;
                    $scope.TotalReferralReportCount = resp.data.Count;

                }
            }
        }, function (err) { });
    };
    //end report1

    //report2
    $scope.GetOPDoctorReport = function (PageNumber, reportType) {
        Object = {
            "DoctorId": $scope.reportSearch.DoctorId,
            "ParentOrganizationId": parentHospitalId,
            "HospitalList": $scope.reportSearch.HospitalId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId,
            "DepartmentId": $scope.reportSearch.DepartmentId
        };
        eHnoteMainDashboardDataServices.GetOPDoctorReport(Object).then(function (resp) {

            if (resp.data.status === "Success") {
                if (reportType === 'export') {
                    resp.data.DoctorReport = resp.data.DoctorReport || [];
                    $scope.Report2ExportHistry = resp.data.DoctorReport;

                    generateTable($scope.Report2ExportHistry, 'Doctor OPD Report');
                }
                else {
                    $scope.DoctorReportArray = resp.data.DoctorReport;

                    $scope.TotalDoctorReportCount = resp.data.Count;


                }
            }
        }, function (err) { });
    };


    $scope.GetOutPatientReport = function (PageNumber, reportType) {
        Object = {
            "DoctorId": $scope.reportSearch.DoctorId,
            "ParentOrganizationId": parentHospitalId,
            "HospitalList": $scope.reportSearch.HospitalId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId,
            "DepartmentId": $scope.reportSearch.DepartmentId

        };
        eHnoteMainDashboardDataServices.GetOPDoctorReport(Object).then(function (resp) {

            if (resp.data.status === "Success") {
                if (reportType === 'export') {
                    resp.data.DoctorReport = resp.data.DoctorReport || [];
                    $scope.Report2ExportHistry = resp.data.DoctorReport;

                    generateTable($scope.Report2ExportHistry, 'Out Patient Report');
                }
                else {
                    $scope.OutPatientReportArray = resp.data.DoctorReport;

                    $scope.TotalOutPatientCount = resp.data.Count;


                }
            }
        }, function (err) { });
    };
    // endreport2


    $scope.GetSmsHistoryReport = function (PageNumber, reportType) {
        Object = {
            "DoctorId": $scope.reportSearch.DoctorId,
            "ParentOrganizationId": parentHospitalId,
            "HospitalList": $scope.reportSearch.HospitalId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1
        };
        eHnoteMainDashboardDataServices.GetSmsHistoryReport(Object).then(function (resp) {

            if (resp.data.status === "Success") {
                if (reportType === 'export') {
                    resp.data.SmsHistoryReport = resp.data.SMSHistory || [];
                    $scope.ReportSmsHistoryReport = resp.data.SMSHistory;

                    generateTable($scope.ReportSmsHistoryReport, 'SmsHistory');
                }
                else {
                    $scope.SmsHistoryReportArray = resp.data.SMSHistory;
                    $scope.TotalSmsHistoryCount = resp.data.Count;


                }
            }
        }, function (err) { });
    };
    //report3
    $scope.GetOPCategoryReport = function (PageNumber, reportType) {
        Object = {
            "DoctorId": $scope.reportSearch.DoctorId,
            "ParentOrganizationId": parentHospitalId,
            "HospitalList": $scope.reportSearch.HospitalId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId,
            "DepartmentId": $scope.reportSearch.DepartmentId
            // "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            //"PageNumber": PageNumber ? PageNumber : 1
        };
        eHnoteMainDashboardDataServices.GetOPCategoryReport(Object).then(function (resp) {

            if (resp.data.status === "Success") {
                if (reportType === 'export') {
                    resp.data.CategoryReport = resp.data.CategoryReport || [];
                    $scope.Report3ExportHistry = resp.data.CategoryReport;
                    generateTable($scope.Report3ExportHistry, 'Patient Category Report');
                }
                else {
                    $scope.CategoryReportArray = resp.data.CategoryReport;
                    $scope.TotalCategoryReportCount = resp.data.Count;

                }
            }
        }, function (err) { });
    };
    // endreport3


    //report4
    $scope.GetOPSurgeryAppointmentReport = function (PageNumber, reportType) {

        Object = {
            //"IsParentOrganization":false,
            "DoctorId": $scope.reportSearch.DoctorId,
            "ParentOrganizationId": parentHospitalId,
            "HospitalList": $scope.reportSearch.HospitalId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId,
            "DepartmentId": $scope.reportSearch.DepartmentId
        };
        eHnoteMainDashboardDataServices.GetOPSurgeryAppointmentReport(Object).then(function (resp) {

            if (resp.data.status === "Success") {
                if (reportType === 'export') {
                    resp.data.SurgeryAppointmentReport = resp.data.SurgeryAppointmentReport || [];
                    $scope.Report4ExportHistry = resp.data.SurgeryAppointmentReport;
                    generateTable($scope.Report4ExportHistry, 'Doctor Surgery  Report');
                }
                else {
                    $scope.SurgeryAppointmentReportArray = resp.data.SurgeryAppointmentReport;
                    $scope.TotalSurgeryAppointmentReportCount = resp.data.Count;

                }
            }
        }, function (err) { });
    };
    // endreport4


    //report5
    $scope.GetOPSurgeryPerformedReport = function (PageNumber, reportType) {

        Object = {
            "Category": $scope.reportSearch.Category || null,
            //"IsParentOrganization":false,
            "DoctorId": $scope.reportSearch.DoctorId,
            "ParentOrganizationId": parentHospitalId,
            "HospitalList": $scope.reportSearch.HospitalId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId,
            "DepartmentId": $scope.reportSearch.DepartmentId
        };
        eHnoteMainDashboardDataServices.GetOPSurgeryPerformedReport(Object).then(function (resp) {

            if (resp.data.status === "Success") {
                if (reportType === 'export') {
                    resp.data.SurgeryPerformedReport = resp.data.SurgeryPerformedReport || [];
                    $scope.Report5ExportHistry = resp.data.SurgeryPerformedReport;
                    generateTable($scope.Report5ExportHistry, 'Surgery Performed Report');
                }
                else {
                    $scope.SurgeryPerformedReportArray = resp.data.SurgeryPerformedReport;
                    $scope.TotalSurgeryPerformedReportArrayCount = resp.data.Count;

                }
            }
        }, function (err) { });
    };
    // endreport5

    //report6
    $scope.GetOPProcedureReport = function (PageNumber, reportType) {

        Object = {
            //"IsParentOrganization":false,
            "DoctorId": $scope.reportSearch.DoctorId,
            "ParentOrganizationId": parentHospitalId,
            "HospitalList": $scope.reportSearch.HospitalId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId,
            "DepartmentId": $scope.reportSearch.DepartmentId
        };
        eHnoteMainDashboardDataServices.GetOPProcedureReport(Object).then(function (resp) {

            if (resp.data.status === "Success") {
                if (reportType === 'export') {

                    resp.data.Report = resp.data.Report || [];
                    $scope.Report6ExportHistry = resp.data.Report;
                    generateTable($scope.Report6ExportHistry, 'Procedure Report');
                }
                else {
                    $scope.ProcedureReportArray = resp.data.Report;
                    $scope.TotalProcedureReportCount = resp.data.count;

                }
            }
        }, function (err) { });
    };
    // endreport6

    //report7
    $scope.GetOPInvestigationReport = function (PageNumber, reportType) {

        Object = {
            //"IsParentOrganization":false,
            "DoctorId": $scope.reportSearch.DoctorId,
            "ParentOrganizationId": parentHospitalId,
            "HospitalList": $scope.reportSearch.HospitalId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId,
            "DepartmentId": $scope.reportSearch.DepartmentId
        };
        eHnoteMainDashboardDataServices.GetOPInvestigationReport(Object).then(function (resp) {

            if (resp.data.status === "Success") {
                if (reportType === 'export') {
                    resp.data.Report = resp.data.Report || [];
                    $scope.Report7ExportHistry = resp.data.Report;
                    generateTable($scope.Report7ExportHistry, 'Investigation Report');
                }
                else {
                    $scope.InvestigationReportArray = resp.data.Report;
                    $scope.TotalInvestigationReportCount = resp.data.Count;

                }
            }
        }, function (err) { });
    };
    // endreport7
    $scope.GetInvestigationAdvisedReport = function (PageNumber, reportType) {
        Object = {
            //"IsParentOrganization":false,
            "DoctorId": $scope.reportSearch.DoctorId,
            //  "ParentOrganizationId": parentHospitalId,
            "HospitalList": $scope.reportSearch.HospitalId,
            'Type': 'Investigation',
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "StatusId": $scope.reportSearch.StatusId ? $scope.reportSearch.StatusId : 0,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId,
            "DepartmentId": $scope.reportSearch.DepartmentId
        };
        eHnoteMainDashboardDataServices.GetSuggestedReportByType(Object).then(function (resp) {
            if (reportType === 'export') {
                resp.data.rows = resp.data.rows || [];
                $scope.InvestigationAdvisedExportHistry = resp.data.rows;
                generateTable($scope.InvestigationAdvisedExportHistry, 'InvestigationAdvisedReport');
            }
            else {
                $scope.InvestigationAdvisedReportArray = resp.data.rows;
                $scope.TotalInvestigationAdvisedReportCount = resp.data.count;

            }

        }, function (err) { });
    };
    //report8
    $scope.GetsurgeryAdvisedReport = function (PageNumber, reportType) {
        Object = {
            //"IsParentOrganization":false,
            "DoctorId": $scope.reportSearch.DoctorId,
            //  "ParentOrganizationId": parentHospitalId,
            "HospitalList": $scope.reportSearch.HospitalId,
            'Type': 'Surgery',
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId,
            "DepartmentId": $scope.reportSearch.DepartmentId
        };
        eHnoteMainDashboardDataServices.GetSuggestedReportByType(Object).then(function (resp) {


            if (reportType === 'export') {
                resp.data.rows = resp.data.rows || [];
                $scope.surgeryAdvisedExportHistry = resp.data.rows;
                generateTable($scope.surgeryAdvisedExportHistry, 'surgeryAdvisedReport');
            }
            else {
                $scope.surgeryAdvisedReportArray = resp.data.rows;
                $scope.TotalsurgeryAdvisedReportCount = resp.data.count;

            }

        }, function (err) { });
    };
    //report8
    $scope.GetOPSurgeryCostReport = function (PageNumber, reportType) {

        Object = {
            //"IsParentOrganization":false,
            "DoctorId": $scope.reportSearch.DoctorId,
            "ParentOrganizationId": parentHospitalId,
            "HospitalList": $scope.reportSearch.HospitalId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId,
            "DepartmentId": $scope.reportSearch.DepartmentId
        };
        eHnoteMainDashboardDataServices.GetOPSurgeryCostReport(Object).then(function (resp) {

            if (resp.data.status === "Success") {
                if (reportType === 'export') {
                    resp.data.SurgeryCostReport = resp.data.SurgeryCostReport || [];
                    $scope.Report8ExportHistry = resp.data.SurgeryCostReport;
                    generateTable($scope.Report8ExportHistry, 'Surgery Cost Report');
                }
                else {
                    $scope.SurgeryCostReportArray = resp.data.SurgeryCostReport;
                    $scope.TotalSurgeryCostReportCount = resp.data.Count;

                }
            }
        }, function (err) { });
    };
    // endreport8


    //report9
    $scope.GetOPInvestigationCostReport = function (PageNumber, reportType) {

        Object = {
            //"IsParentOrganization":false,
            "DoctorId": $scope.reportSearch.DoctorId,
            "ParentOrganizationId": parentHospitalId,
            "HospitalList": $scope.reportSearch.HospitalId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId,
            "DepartmentId": $scope.reportSearch.DepartmentId
        };
        eHnoteMainDashboardDataServices.GetOPInvestigationCostReport(Object).then(function (resp) {

            if (resp.data.status === "Success") {
                if (reportType === 'export') {
                    resp.data.Report = resp.data.Report || [];
                    $scope.Report9ExportHistry = resp.data.Report;
                    generateTable($scope.Report9ExportHistry, 'Investigation Cost Report');
                }
                else {
                    $scope.InvestigationCostReportArray = resp.data.Report;
                    $scope.TotalInvestigationCostReportCount = resp.data.Count;

                }
            }
        }, function (err) { });
    };
    // endreport9


    //report10
    $scope.GetOPProcedureCostReport = function (PageNumber, reportType) {

        Object = {
            //"IsParentOrganization":false,
            "DoctorId": $scope.reportSearch.DoctorId,
            "ParentOrganizationId": parentHospitalId,
            "HospitalList": $scope.reportSearch.HospitalId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId,
            "DepartmentId": $scope.reportSearch.DepartmentId
        };
        eHnoteMainDashboardDataServices.GetOPProcedureCostReport(Object).then(function (resp) {

            if (resp.data.status === "Success") {
                if (reportType === 'export') {
                    resp.data.Report = resp.data.Report || [];
                    $scope.Report10ExportHistry = resp.data.Report;
                    generateTable($scope.Report10ExportHistry, 'Procedure Cost Report');
                }
                else {
                    $scope.ProcedureCostReportArray = resp.data.Report;
                    $scope.TotalProcedureCostReportCount = resp.data.Count;

                }
            }
        }, function (err) { });
    };
    // endreport10

    //report11
    $scope.GetOPLabReport = function (PageNumber, reportType) {

        Object = {
            //"IsParentOrganization":false,
            "DoctorId": $scope.reportSearch.DoctorId,
            "ParentOrganizationId": parentHospitalId,
            "HospitalList": $scope.reportSearch.HospitalId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId,
            "DepartmentId": $scope.reportSearch.DepartmentId
        };
        eHnoteMainDashboardDataServices.GetOPLabReport(Object).then(function (resp) {

            if (resp.data.status === "Success") {
                if (reportType === 'export') {
                    resp.data.Report = resp.data.Report || [];
                    $scope.Report11ExportHistry = resp.data.Report;
                    generateTable($scope.Report11ExportHistry, 'Lab Report');
                }
                else {
                    $scope.LabReportArray = resp.data.Report;
                    $scope.TotalLabReportCount = resp.data.Count;

                }
            }
        }, function (err) { });
    };
    // endreport11


    //report12
    $scope.GetOPLabCostReport = function (PageNumber, reportType) {

        Object = {
            //"IsParentOrganization":false,
            "DoctorId": $scope.reportSearch.DoctorId,
            "ParentOrganizationId": parentHospitalId,
            "HospitalList": $scope.reportSearch.HospitalId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId,
            "DepartmentId": $scope.reportSearch.DepartmentId
        };
        eHnoteMainDashboardDataServices.GetOPLabCostReport(Object).then(function (resp) {

            if (resp.data.status === "Success") {
                if (reportType === 'export') {
                    resp.data.Report = resp.data.Report || [];
                    $scope.Report12ExportHistry = resp.data.Report;
                    generateTable($scope.Report12ExportHistry, 'Lab Cost Report');
                }
                else {
                    $scope.LabCostReportArray = resp.data.Report;
                    $scope.TotalLabCostReportCount = resp.data.Count;

                }
            }
        }, function (err) { });
    };
    // endreport12


    //report13
    $scope.GetOpSurgeryPerformedCountReport = function (PageNumber, reportType) {

        Object = {
            //"IsParentOrganization":false,
            "DoctorId": $scope.reportSearch.DoctorId,
            "ParentOrganizationId": parentHospitalId,
            "HospitalList": $scope.reportSearch.HospitalId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId,
            "DepartmentId": $scope.reportSearch.DepartmentId
        };
        eHnoteMainDashboardDataServices.GetOpSurgeryPerformedCountReport(Object).then(function (resp) {

            if (resp.data.status === "Success") {
                if (reportType === 'export') {
                    resp.data.SurgeryPerformedReport = resp.data.SurgeryPerformedReport || [];
                    $scope.Report13ExportHistry = resp.data.SurgeryPerformedReport;
                    generateTable($scope.Report13ExportHistry, 'Surgery Performed Count Report');
                }
                else {
                    $scope.SurgeryPerformedCountReportArray = resp.data.SurgeryPerformedReport;
                    $scope.TotalSurgeryPerformedCount = resp.data.Count;

                }
            }
        }, function (err) { });
    };
    // endreport13

    //report14
    $scope.GetOpInvestigationCountReport = function (PageNumber, reportType) {

        Object = {
            //"IsParentOrganization":false,
            "DoctorId": $scope.reportSearch.DoctorId,
            "ParentOrganizationId": parentHospitalId,
            "HospitalList": $scope.reportSearch.HospitalId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId,
            "DepartmentId": $scope.reportSearch.DepartmentId
        };
        eHnoteMainDashboardDataServices.GetOpInvestigationCountReport(Object).then(function (resp) {

            if (resp.data.status === "Success") {
                if (reportType === 'export') {
                    resp.data.Report = resp.data.Report || [];
                    $scope.Report14ExportHistry = resp.data.Report;
                    generateTable($scope.Report14ExportHistry, 'Investigation Count Report');
                }
                else {
                    $scope.InvestigationCountReportArray = resp.data.Report;
                    $scope.TotalInvestigationCount = resp.data.Count;

                }
            }
        }, function (err) { });
    };
    // endreport14


    //report15
    $scope.GetOpReferralWiseCostReport = function (PageNumber, reportType) {

        Object = {
            //"IsParentOrganization":false,
            "DoctorId": $scope.reportSearch.DoctorId,
            "ParentOrganizationId": parentHospitalId,
            "HospitalList": $scope.reportSearch.HospitalId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId,
            "DepartmentId": $scope.reportSearch.DepartmentId
        };
        eHnoteMainDashboardDataServices.GetOpReferralWiseCostReport(Object).then(function (resp) {

            if (resp.data.status === "Success") {
                if (reportType === 'export') {
                    resp.data.ReferralReport = resp.data.ReferralReport || [];
                    $scope.Report15ExportHistry = resp.data.ReferralReport;
                    generateTable($scope.Report15ExportHistry, 'ReferralWise Cost Report');
                }
                else {
                    $scope.ReferralWiseCostReportArray = resp.data.ReferralReport;
                    $scope.TotalReferralWiseCostReport = resp.data.Count;

                }
            }
        }, function (err) { });
    };
    // endreport15

    //report16GetForm3CReport
    $scope.GetOpForm3CReport = function (PageNumber, reportType) {

        Object = {
            //"IsParentOrganization":false,
            "DoctorId": $scope.reportSearch.DoctorId,
            "ParentOrganizationId": parentHospitalId,
            "HospitalList": $scope.reportSearch.HospitalId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1
        };
        eHnoteMainDashboardDataServices.GetOpForm3CReport(Object).then(function (resp) {

            if (resp.data.status === "Success") {
                if (reportType === 'export') {
                    resp.data.Form3CReport = resp.data.Form3CReport || [];
                    $scope.Report16ExportHistry = resp.data.Form3CReport;
                    generateTable($scope.Report16ExportHistry, 'Form3c Report');
                }
                else {
                    $scope.Form3CReportArray = resp.data.Form3CReport;
                    $scope.TotalForm3CReport = resp.data.Count;

                }
            }
        }, function (err) { });
    };
    // endreport16

    //report17
    $scope.GetOpAdvanceRevenueDetailReport = function (PageNumber, reportType) {

        Object = {
            //"IsParentOrganization":false,
            "DoctorId": $scope.reportSearch.DoctorId,
            "ParentOrganizationId": parentHospitalId,
            "HospitalList": $scope.reportSearch.HospitalId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId,
            "DepartmentId": $scope.reportSearch.DepartmentId
        };
        eHnoteMainDashboardDataServices.GetOpAdvanceRevenueDetailReport(Object).then(function (resp) {


            if (reportType === 'export') {
                resp.data.AdvanceRevenue = resp.data.AdvanceRevenue || [];
                $scope.Report17ExportHistry = resp.data.AdvanceRevenue;
                generateTable($scope.Report17ExportHistry, 'Advance Amount');
            }
            else {
                $scope.AdvanceRevenueDetailArray = resp.data.AdvanceRevenue;
                $scope.TotalAdvanceRevenueDetailReport = resp.data.count;

            }

        }, function (err) { });
    };
    // endreport17

    //stratreport18

    $scope.GetAccountRevenueReport = function (PageNumber, reportType) {

        Object = {
            "DoctorId": $scope.reportSearch.DoctorId,
            "HospitalList": $scope.reportSearch.HospitalId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "AllHospitalsIndicator": $scope.reportSearch.AllHospitalsIndicator,
            "ReportType": reportType,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId,
            "DepartmentId": $scope.reportSearch.DepartmentId
        };
        eHnoteMainDashboardDataServices.GetDailyReportByBranch(Object).then(function (resp) {
            if (reportType === 'export' && $scope.reportSearch.AllHospitalsIndicator == 1) {
                if (resp.data != "") {
                    var file = new Blob([resp.data], { type: "text/csv" });
                    saveAs(file, "AccountRevenueReport" + 1 + ".csv");
                }
            } else {

                if (reportType === 'export') {
                    resp.data.Report = resp.data.Report || [];
                    $scope.AccountRevenueExportHistry = resp.data.Report;
                    generateTable($scope.AccountRevenueExportHistry, 'AccountRevenue');
                }
                else {
                    $scope.AccountRevenueArray = resp.data.Report;
                    $scope.TotalAccountRevenueReport = resp.data.Count;

                }

            }

        }, function (err) { });
    };
    // endreport18
    $scope.GetAccountExpensesReport = function (PageNumber, reportType) {

        Object = {
            "HospitalList": $scope.reportSearch.HospitalId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "ParentOrganizationId": parentHospitalId,
            "AllHospitalsIndicator": $scope.reportSearch.AllHospitalsIndicator,
            "ReportType": reportType
        };
        eHnoteMainDashboardDataServices.GetExpensesReportByBranch(Object).then(function (resp) {
            if (reportType === 'export' && $scope.reportSearch.AllHospitalsIndicator == 1) {
                if (resp.data != "") {
                    var file = new Blob([resp.data], { type: "text/csv" });
                    saveAs(file, "AccountExpensesReport" + 1 + ".csv");
                }
            } else {

                if (reportType === 'export') {
                    resp.data.Report = resp.data.Report || [];
                    $scope.AccountExpensesExportHistry = resp.data.Report;
                    generateTable($scope.AccountExpensesExportHistry, 'AccountExpenses');
                }
                else {
                    $scope.AccountExpensesArray = resp.data.Report;
                    $scope.TotalAccountExpensesReport = resp.data.Count;

                }
            }

        }, function (err) { });
    };

    $scope.GetAccountsBankDepositReport = function (PageNumber, reportType) {

        Object = {
            //"HospitalList": $scope.reportSearch.HospitalId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "ParentOrganizationId": parentHospitalId,
            //"AllHospitalsIndicator": $scope.reportSearch.AllHospitalsIndicator,
            //"ReportType": reportType
        };
        eHnoteMainDashboardDataServices.GetAccountsBankDepositReport(Object).then(function (resp) {
            //if (reportType === 'export' && $scope.reportSearch.AllHospitalsIndicator == 1) {
            //    if (resp.data != "") {
            //        var file = new Blob([resp.data], { type: "text/csv" });
            //        saveAs(file, "AccountExpensesReport" + 1 + ".csv");
            //    }
            //    } else {

            if (reportType === 'export') {
                resp.data.Report = resp.data.Report || [];
                $scope.AccountBankDepositExportHistry = resp.data.Report;
                generateTable($scope.AccountBankDepositExportHistry, 'Accounts Bank Deposit');
            }
            else {
                $scope.AccountBankDepositArray = resp.data.Report;
                $scope.TotalAccountBankDepositReport = resp.data.Count;

            }
            //  }

        }, function (err) { });
    };
    // endreport19
    $scope.GetWaivedOffReport = function (PageNumber, reportType) {

        Object = {
            "DoctorId": $scope.reportSearch.DoctorId,
            "ParentOrganizationId": parentHospitalId,
            "HospitalList": $scope.reportSearch.HospitalId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "AllHospitalsIndicator": $scope.reportSearch.AllHospitalsIndicator,
            "ReportType": reportType,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId,
            "DepartmentId": $scope.reportSearch.DepartmentId
        };
        eHnoteMainDashboardDataServices.GetWaviedOffPatientReport(Object).then(function (resp) {
            if (reportType === 'export' && $scope.reportSearch.AllHospitalsIndicator == 1) {
                if (resp.data != "") {
                    var file = new Blob([resp.data], { type: "text/csv" });
                    saveAs(file, "Waived Off Report" + 1 + ".csv");
                }
            } else {
                if (resp.data.Status === "Success") {
                    if (reportType === 'export') {
                        resp.data.rows = resp.data.rows || [];
                        $scope.WaivedOffExportHistry = resp.data.rows;
                        generateTable($scope.WaivedOffExportHistry, 'Waived Off Report');
                    }
                    else {
                        $scope.WaivedOffArray = resp.data.rows;
                        $scope.TotalWaivedOffReport = resp.data.count;

                    }
                }
            }

            //if (reportType === 'export') {
            //    resp.data.rows = resp.data.rows || [];
            //    $scope.WaivedOffExportHistry = resp.data.rows;
            //    generateTable($scope.WaivedOffExportHistry, 'Waived Off Report');
            //}
            //else {
            //    $scope.WaivedOffArray = resp.data.rows;
            //    $scope.TotalWaivedOffReport = resp.data.count;

            //}

        }, function (err) { });
    };
    //endreport20
    $scope.GetInvestigationDetailReport = function (PageNumber, reportType) {
        Object = {
            "DoctorId": $scope.reportSearch.DoctorId,
            "ProcedureType": 'Investigation',
            "ParentOrganizationId": parentHospitalId,
            "HospitalList": $scope.reportSearch.HospitalId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1
        };
        eHnoteMainDashboardDataServices.GetAllProcedureCostReport(Object).then(function (resp) {


            if (reportType === 'export') {
                resp.data.Report = resp.data.Report || [];
                $scope.InvestigationDetailExportHistry = resp.data.Report;
                generateTable($scope.InvestigationDetailExportHistry, 'Investigation');
            }
            else {
                $scope.InvestigationDetailArray = resp.data.Report;
                $scope.TotalInvestigationDetailReport = resp.data.Count;

            }

        }, function (err) { });
    };
    //endreport21
    $scope.GetSurgeryDetailReport = function (PageNumber, reportType) {
        Object = {
            "DoctorId": $scope.reportSearch.DoctorId,
            "ProcedureType": 'Surgery',
            "ParentOrganizationId": parentHospitalId,
            "HospitalList": $scope.reportSearch.HospitalId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1

        };
        eHnoteMainDashboardDataServices.GetAllProcedureCostReport(Object).then(function (resp) {
            if (reportType === 'export') {
                resp.data.Report = resp.data.Report || [];
                $scope.SurgeryDetailExportHistry = resp.data.Report;
                generateTable($scope.SurgeryDetailExportHistry, 'Surgery');
            }
            else {
                $scope.SurgeryDetailArray = resp.data.Report;
                $scope.TotalSurgeryDetailReport = resp.data.Count;

            }

        }, function (err) { });
    };
    //endreport22
    $scope.GetLabDetailReport = function (PageNumber, reportType) {
        Object = {
            "DoctorId": $scope.reportSearch.DoctorId,
            "ProcedureType": 'Lab',
            "ParentOrganizationId": parentHospitalId,
            "HospitalList": $scope.reportSearch.HospitalId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1
        };
        eHnoteMainDashboardDataServices.GetAllProcedureCostReport(Object).then(function (resp) {


            if (reportType === 'export') {
                resp.data.Report = resp.data.Report || [];
                $scope.LabDetailExportHistry = resp.data.Report;
                generateTable($scope.LabDetailExportHistry, 'Lab');
            }
            else {
                $scope.LabDetailArray = resp.data.Report;
                $scope.TotalLabDetailReport = resp.data.Count;

            }

        }, function (err) { });
    };
    //endreport22
    $scope.GetDepartmentReport = function (PageNumber, reportType) {

        Object = {
            "DoctorId": $scope.reportSearch.DoctorId,
            "ParentOrganizationId": parentHospitalId,
            "HospitalsList": $scope.reportSearch.HospitalId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "SpecializationId": $scope.SpecializationId,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId,
            "DepartmentId": $scope.reportSearch.DepartmentId

        };
        eHnoteMainDashboardDataServices.GetTreatmentRevenueReportByBranch(Object).then(function (resp) {


            if (reportType === 'export') {
                resp.data.rows = resp.data.rows || [];
                $scope.DepartmentExportHistry = resp.data.rows;
                generateTable($scope.DepartmentExportHistry, 'Department Revenue Report');
            }
            else {
                $scope.DepartmentArray = resp.data.rows;
                $scope.TotalDepartmentReport = resp.data.count;

            }

        }, function (err) { });
    };
    //endreport23
    $scope.GetProcedureDetailReport = function (PageNumber, reportType) {
        Object = {
            "DoctorId": $scope.reportSearch.DoctorId,
            "ProcedureType": 'Procedure',
            "ParentOrganizationId": parentHospitalId,
            "HospitalList": $scope.reportSearch.HospitalId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "AllHospitalsIndicator": $scope.reportSearch.AllHospitalsIndicator,
            "ReportType": reportType
        };
        eHnoteMainDashboardDataServices.GetAllProcedureCostReport(Object).then(function (resp) {
            if (reportType === 'export' && $scope.reportSearch.AllHospitalsIndicator === 1) {
                if (resp.data !== "") {
                    var file = new Blob([resp.data], { type: "text/csv" });
                    saveAs(file, "ProcedureDetailReport" + 1 + ".csv");
                }
            } else {


                if (reportType === 'export') {
                    resp.data.Report = resp.data.Report || [];
                    $scope.ProcedureDetailExportHistry = resp.data.Report;
                    generateTable($scope.ProcedureDetailExportHistry, 'Procedure');
                }
                else {
                    $scope.ProcedureDetailArray = resp.data.Report;
                    $scope.TotalProcedureDetailReport = resp.data.Count;

                }
            }

        }, function (err) { });
    };
    //endreport24
    //endreport25

    $scope.GetPurchaseReturnsReport = function (PageNumber, reportType) {

        Object = {
            //"DoctorId": $scope.reportSearch.DoctorId,
            "IsParentOrganization": true,
            //  "OrganizationId": $scope.SelectedHospital === undefined || $scope.SelectedHospital === null ? doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID : $scope.SelectedHospital.HospitalInfo.HospitalDetails.HospitalID,
            "OrganizationId": $scope.reportSearch.HospitalObj.ClinicId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId
        };
        if (Object.OrganizationId === null || Object.OrganizationId === 0) {
            Object.OrganizationId = parentHospitalId;
        } else {
            Object.IsParentOrganization = false;
        }
        OpticalService.GetOpticalPurchaseReturnsReport(Object).then(function (resp) {


            if (reportType === 'export') {
                resp.data.rows = resp.data.rows || [];
                $scope.PurchaseReturnsExportHistry = resp.data.rows;
                generateTable($scope.PurchaseReturnsExportHistry, 'PurchaseReturns');
            }
            else {
                $scope.PurchaseReturnsArray = resp.data.rows;
                $scope.TotalPurchaseReturnsReport = resp.data.count;

            }

        }, function (err) { });
    };

    //endreport26
    $scope.GetPurchaseReport = function (PageNumber, reportType) {
        Object = {
            // "DoctorId": $scope.reportSearch.DoctorId,
            "IsParentOrganization": true,
            "OrganizationId": $scope.reportSearch.HospitalObj.ClinicId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId

        };
        if (Object.OrganizationId === null || Object.OrganizationId === 0) {
            Object.OrganizationId = parentHospitalId;
        } else {
            Object.IsParentOrganization = false;
        }
        OpticalService.GetOpticalPurchaseReport(Object).then(function (resp) {


            if (reportType === 'export') {
                resp.data.rows = resp.data.rows || [];
                $scope.PurchaseExportHistry = resp.data.rows;
                generateTable($scope.PurchaseExportHistry, 'Purchase');
            }
            else {
                $scope.PurchaseArray = resp.data.rows;
                $scope.TotalPurchaseReport = resp.data.count;

            }

        }, function (err) { });
    };
    //endreport27
    $scope.GetOpticalSalesDetailReport = function (PageNumber, reportType) {
        Object = {
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "HospitalID": $scope.reportSearch.HospitalObj.ClinicId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "GetAllIndicator": 1,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId
        };


        if (Object.HospitalID === null || Object.HospitalID === 0) {
            Object.HospitalID = parentHospitalId;
        } else {
            Object.GetAllIndicator = 0;
        }

        OpticalService.GetOpticalSalesDetailReport(Object).then(function (resp) {
            if (reportType === 'export') {
                resp.data.rows = resp.data.rows || [];
                $scope.SalesExportHistry = resp.data.SalesRevenue;
                generateTable($scope.SalesExportHistry, 'Sales');
            }
            else {
                $scope.SalesArray = resp.data.SalesRevenue;
                $scope.TotalSalesReport = resp.data.Count;

            }
        }, function (err) {
            $scope.Page.TotalCount = 0;
            $scope.ListArray = [];
            alertify.error("Getting Sales Report Failed");
            console.log(err);
        });
    };

    $scope.GetOpticalSalesHistory = function (PageNumber, reportType) {
        Object = {
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "HospitalID": $scope.reportSearch.HospitalObj.ClinicId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "GetAllIndicator": 1,

        };


        if (Object.HospitalID === null || Object.HospitalID === 0) {
            Object.HospitalID = parentHospitalId;
        } else {
            Object.GetAllIndicator = 0;
        }

        OpticalService.GetOpticalSalesHistory(Object).then(function (resp) {
            if (reportType === 'export') {
                resp.data.rows = resp.data.rows || [];
                $scope.TotalSalesHistry = resp.data.rows;
                generateTable($scope.TotalSalesHistry, 'TotalSales');
            }
            else {
                $scope.TotalSalesArray = resp.data.rows;
                $scope.TotalSalesAmountReport = resp.data.count;

            }
        }, function (err) {
            $scope.Page.TotalCount = 0;
            $scope.ListArray = [];
            alertify.error("Getting Sales Report Failed");
            console.log(err);
        });
    };

    //endsalereport

    $scope.getPaymentDetails1 = function (pageno, reportType, date, modeType, data, type) {
        Object = {
            "PageSize": $scope.maxSize,
            "PageNumber": pageno,
            "OrganizationId": $scope.reportSearch.HospitalObj.ClinicId,
            "PaymentModeId": modeType || 0,
            "Date": date,
            "IsParentOrganization": true
        };
        if (Object.OrganizationId === null || Object.OrganizationId === 0) {
            Object.OrganizationId = parentHospitalId;
        } else {
            Object.IsParentOrganization = false;
        }
        if (type === "export") {
            Object.PageNumber = 1;
            Object.PageSize = $scope.TotalCount ? $scope.TotalCount : 10;
        }
        OpticalService.GetOpticalSalesReport(Object).then(function (resp) {
            if (resp.data.Status === "Success") {
                if (type === "export") {
                    //$scope.ViewType = "saleDetail";
                    $scope.SalesDetailExportHistry = resp.data.rows;
                    generateTable($scope.SalesDetailExportHistry, 'saleDetail');
                    //$scope.GenerateTable(resp.data.rows);

                } else {
                    $scope.SearchFilterDiv = true;
                    $scope.TotalCount = resp.data.count;
                    $scope.ListArray1 = resp.data.rows;
                }
            }
            else {
                $scope.TotalCount = 0;
                $scope.ListArray1 = [];
                alertify.error(resp.data.Message);
            }
        }, function (err) {
            $scope.TotalCount = 0;
            $scope.ListArray1 = [];
            alertify.error("Getting Purchase Report Failed");
            console.log(err);
        });


    };

    //pharmacy start
    $scope.getPaymentDetails2 = function (pageno, reportType, date, modeType, data, type) {
        Object = {
            "PageSize": $scope.maxSize,
            "PageNumber": pageno,
            "OrganizationId": $scope.reportSearch.HospitalObj.ClinicId,
            "PaymentModeId": modeType || 0,
            "Date": date,
            "IsParentOrganization": true
        };
        if (Object.OrganizationId === null || Object.OrganizationId === 0) {
            Object.OrganizationId = parentHospitalId;
        } else {
            Object.IsParentOrganization = false;
        }
        if (type === "export") {
            Object.PageNumber = 1;
            Object.PageSize = $scope.TotalCount ? $scope.TotalCount : 10;
        }
        InventoryService.GetPharmaSalesReport(Object).then(function (resp) {
            if (resp.data.Status === "Success") {
                if (type === "export") {
                    //$scope.ViewType = "saleDetail";
                    $scope.SalesDetailExportHistry = resp.data.rows;
                    generateTable($scope.SalesDetailExportHistry, 'Pharmacy saleDetail');
                    //$scope.GenerateTable(resp.data.rows);

                } else {
                    $scope.SearchFilterDiv = true;
                    $scope.TotalCount = resp.data.count;
                    $scope.ListArray1 = resp.data.rows;
                }
            }
            else {
                $scope.TotalCount = 0;
                $scope.ListArray1 = [];
                alertify.error(resp.data.Message);
            }
        }, function (err) {
            $scope.TotalCount = 0;
            $scope.ListArray1 = [];
            alertify.error("Getting Purchase Report Failed");
            console.log(err);
        });


    };

    //endsale
    //$scope.GetSalesReport = function (PageNumber, reportType) {
    //    Object = {

    //        "IsParentOrganization": true,
    //        "OrganizationId": $scope.reportSearch.HospitalObj.ClinicId,
    //        "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
    //        "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
    //        "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
    //        "PageNumber": PageNumber ? PageNumber : 1
    //    };
    //    if (Object.OrganizationId === null || Object.OrganizationId === 0) {
    //        Object.OrganizationId = parentHospitalId;
    //    } else {
    //        Object.IsParentOrganization = false;
    //    }
    //    OpticalService.GetOpticalSalesReport(Object).then(function (resp) {


    //        //if (reportType === 'export') {
    //        //    resp.data.rows = resp.data.rows || [];
    //        //    $scope.SalesExportHistry = resp.data.rows;
    //        //    generateTable($scope.SalesExportHistry, 'Sales');
    //        //}
    //        //else {
    //        //    $scope.SalesArray = resp.data.rows;
    //        //    $scope.TotalSalesReport = resp.data.count;

    //        //}

    //    }, function (err) { });
    //};
    //endreport28
    $scope.GetSalesReturnsReport = function (PageNumber, reportType) {
        Object = {
            //"DoctorId": $scope.reportSearch.DoctorId,
            "IsParentOrganization": true,
            "OrganizationId": $scope.reportSearch.HospitalObj.ClinicId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId
        };
        if (Object.OrganizationId === null || Object.OrganizationId === 0) {
            Object.OrganizationId = parentHospitalId;
        } else {
            Object.IsParentOrganization = false;
        }
        OpticalService.GetOpticalSalesReturnsReport(Object).then(function (resp) {


            if (reportType === 'export') {
                resp.data.rows = resp.data.rows || [];
                $scope.SalesReturnsExportHistry = resp.data.rows;
                generateTable($scope.SalesReturnsExportHistry, 'SalesReturns');
            }
            else {
                $scope.SalesReturnsArray = resp.data.rows;
                $scope.TotalSalesReturnsReport = resp.data.count;

            }

        }, function (err) { });
    };
    //endreport29
    $scope.GetDeliveredOrderReport = function (PageNumber, reportType) {
        Object = {
            //"DoctorId": $scope.reportSearch.DoctorId,
            "IsParentOrganization": true,
            "OrganizationId": $scope.reportSearch.HospitalObj.ClinicId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId
        };
        if (Object.OrganizationId === null || Object.OrganizationId === 0) {
            Object.OrganizationId = parentHospitalId;
        } else {
            Object.IsParentOrganization = false;
        }
        OpticalService.GetOpticalDeliveredOrderReport(Object).then(function (resp) {


            if (reportType === 'export') {
                resp.data.rows = resp.data.rows || [];
                $scope.DeliveredOrderExportHistry = resp.data.rows;
                generateTable($scope.DeliveredOrderExportHistry, 'DeliveredOrder');
            }
            else {
                $scope.DeliveredOrderArray = resp.data.rows;
                $scope.TotalDeliveredOrderReport = resp.data.count;

            }

        }, function (err) { });
    };


    //endreport30
    $scope.GetNotDeliveredReport = function (PageNumber, reportType) {
        Object = {
            //"DoctorId": $scope.reportSearch.DoctorId,
            "IsParentOrganization": true,
            "OrganizationId": $scope.reportSearch.HospitalObj.ClinicId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId
        };
        if (Object.OrganizationId === null || Object.OrganizationId === 0) {
            Object.OrganizationId = parentHospitalId;
        } else {
            Object.IsParentOrganization = false;
        }
        OpticalService.GetOpticalNotDeliveredOrderReport(Object).then(function (resp) {


            if (reportType === 'export') {
                resp.data.rows = resp.data.rows || [];
                $scope.NotDeliveredExportHistry = resp.data.rows;
                generateTable($scope.NotDeliveredExportHistry, 'Not-Delivered');
            }
            else {
                $scope.NotDeliveredArray = resp.data.rows;
                $scope.TotalNotDeliveredReport = resp.data.count;

            }

        }, function (err) { });
    };

    //endreport31
    $scope.GetPharmacyPurchaseReport = function (PageNumber, reportType) {
        Object = {
            //"DoctorId": $scope.reportSearch.DoctorId,
            "IsParentOrganization": true,
            "OrganizationId": $scope.reportSearch.HospitalObj.ClinicId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId
        };
        if (Object.OrganizationId === null || Object.OrganizationId === 0) {
            Object.OrganizationId = parentHospitalId;
        } else {
            Object.IsParentOrganization = false;
        }
        InventoryService.GetPharmaPurchaseReport(Object).then(function (resp) {
            if (reportType === 'export') {
                // resp.data.Report = resp.data.rows || [];
                $scope.PharmacyPurchasesExportHistry = resp.data.rows;
                generateTable($scope.PharmacyPurchasesExportHistry, 'Pharmacy-Purchases');
            }
            else {
                $scope.PharmacyPurchasesArray = resp.data.rows;
                $scope.TotalPharmacyPurchasesReport = resp.data.count;

            }

        }, function (err) { });
    };

    //endreport32
    $scope.GetPharmacyPurchaseReturnsReport = function (PageNumber, reportType) {
        Object = {
            //"DoctorId": $scope.reportSearch.DoctorId,
            "IsParentOrganization": true,
            "OrganizationId": $scope.reportSearch.HospitalObj.ClinicId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId
        };
        if (Object.OrganizationId === null || Object.OrganizationId === 0) {
            Object.OrganizationId = parentHospitalId;
        } else {
            Object.IsParentOrganization = false;
        }
        InventoryService.GetPharmaPurchaseReturnReport(Object).then(function (resp) {


            if (reportType === 'export') {
                // resp.data.Report = resp.data.rows || [];
                $scope.PharmacyPurchasesReturnsExportHistry = resp.data.rows;
                generateTable($scope.PharmacyPurchasesReturnsExportHistry, 'Pharmacy Purchases Returns');
            }
            else {
                $scope.PharmacyPurchaseReturnsArray = resp.data.rows;
                $scope.TotalPharmacyPurchaseReturnsReport = resp.data.count;

            }

        }, function (err) { });
    };

    //endreport33
    //$scope.GetPharmacySalesReport = function (PageNumber, reportType) {
    //    Object = {
    //        //"DoctorId": $scope.reportSearch.DoctorId,
    //        "IsParentOrganization": true,
    //        "OrganizationId": $scope.reportSearch.HospitalObj.ClinicId,
    //        "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
    //        "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
    //        "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
    //        "PageNumber": PageNumber ? PageNumber : 1
    //    };
    //    if (Object.OrganizationId === null || Object.OrganizationId === 0) {
    //        Object.OrganizationId = parentHospitalId;
    //    } else {
    //        Object.IsParentOrganization = false;
    //    }
    //    InventoryService.GetPharmaSalesReport(Object).then(function (resp) {


    //        if (reportType === 'export') {
    //            //resp.data.Report = resp.data.rows || [];
    //            $scope.PharmacySalesExportHistry = resp.data.rows;
    //            generateTable($scope.PharmacySalesExportHistry, 'Pharmacy Sales');
    //        }
    //        else {
    //            $scope.PharmacySalesArray = resp.data.rows;
    //            $scope.TotalPharmacySalesReport = resp.data.count;

    //        }

    //    }, function (err) { });
    //};

    $scope.GetPharmaSalesDetailReport = function (PageNumber, reportType) {
        Object = {
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "HospitalID": $scope.reportSearch.HospitalObj.ClinicId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "GetAllIndicator": 1,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId
        };


        if (Object.HospitalID === null || Object.HospitalID === 0) {
            Object.HospitalID = parentHospitalId;
        } else {
            Object.GetAllIndicator = 0;
        }

        InventoryService.GetPharmaSalesDetailReport(Object).then(function (resp) {
            if (resp.data.Status === "Success") {
                if (reportType === "export") {
                    $scope.PharmacySalesExportHistry = resp.data.SalesRevenue;
                    generateTable($scope.PharmacySalesExportHistry, 'Pharmacy Sales');
                } else {
                    $scope.PharmacySalesArray = resp.data.SalesRevenue;
                    $scope.TotalSalesReport = resp.data.Count;
                }
            } else {
                $scope.TotalSalesReport = 0;
                $scope.PharmacySalesArray = [];
                alertify.error(resp.data.Message);
            }
        }, function (err) {
            $scope.Page.TotalCount = 0;
            $scope.ListArray = [];
            alertify.error("Getting Sales Report Failed");
            console.log(err);
        });
    };


    //endreport34
    $scope.GetPharmacySaleReturnReport = function (PageNumber, reportType) {
        Object = {
            //"DoctorId": $scope.reportSearch.DoctorId,
            "IsParentOrganization": true,
            "OrganizationId": $scope.reportSearch.HospitalObj.ClinicId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId
        };
        if (Object.OrganizationId === null || Object.OrganizationId === 0) {
            Object.OrganizationId = parentHospitalId;
        } else {
            Object.IsParentOrganization = false;
        }
        InventoryService.GetPharmaSalesReturnsReport(Object).then(function (resp) {


            if (reportType === 'export') {
                //resp.data.Report = resp.data.rows || [];
                $scope.PharmacySaleReturnExportHistry = resp.data.rows;
                generateTable($scope.PharmacySaleReturnExportHistry, 'Pharmacy Sale Return');
            }
            else {
                $scope.PharmacySaleReturnArray = resp.data.rows;
                $scope.TotalPharmacySaleReturnReport = resp.data.count;

            }

        }, function (err) { });
    };

    //endreport35
    $scope.GetDiagnosisReport = function (PageNumber, reportType) {
        Object = {
            "DoctorId": $scope.reportSearch.DoctorId,
            "SearchText": $scope.searchPatientTxt ? $scope.searchPatientTxt : "",
            "ParentOrganizationId": parentHospitalId,
            "HospitalList": $scope.reportSearch.HospitalId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId,
            "DepartmentId": $scope.reportSearch.DepartmentId

        };
        eHnoteMainDashboardDataServices.GetOphthaDiagnosisReport(Object).then(function (resp) {


            if (reportType === 'export') {
                //  resp.data.Report = resp.data.rows || [];
                $scope.DiagnosisExportHistry = resp.data.rows;
                generateTable($scope.DiagnosisExportHistry, 'Diagnosis Report');
            }
            else {
                $scope.DiagnosisArray = resp.data.rows;
                $scope.TotalDiagnosisReport = resp.data.count;

            }

        }, function (err) { });
    };
    //endreport36
    $scope.GetOutstandingReport = function (PageNumber, reportType) {
        Object = {
            //"DoctorId": $scope.reportSearch.DoctorId,
            "IsParentOrganization": true,
            "OrganizationId": $scope.reportSearch.HospitalObj.ClinicId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId
        };
        if (Object.OrganizationId === null || Object.OrganizationId === 0) {
            Object.OrganizationId = parentHospitalId;
        } else {
            Object.IsParentOrganization = false;
        }
        OpticalService.GetOpticalOutstandingReport(Object).then(function (resp) {


            if (reportType === 'export') {
                // resp.data.Report = resp.data.rows || [];
                $scope.OutstandingReportExportHistry = resp.data.rows;
                generateTable($scope.OutstandingReportExportHistry, 'OutstandingReport');
            }
            else {
                $scope.OutstandingReportArray = resp.data.rows;
                $scope.TotalOutstandingReportReport = resp.data.count;

            }

        }, function (err) { });
    };

    $scope.GetGlassConvertionReport = function (PageNumber, reportType) {
        Object = {
            "IsParentOrganization": true,
            "OrganizationId": $scope.reportSearch.HospitalObj.ClinicId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId
        };
        if (Object.OrganizationId === null || Object.OrganizationId === 0) {
            Object.OrganizationId = parentHospitalId;
        } else {
            Object.IsParentOrganization = false;
        }
        OpticalService.GetGlassConvertionReport(Object).then(function (resp) {
            if (reportType === 'export') {
                $scope.GlassConvertionReportExportHistry = resp.data.rows;
                generateTable($scope.GlassConvertionReportExportHistry, 'GlassConvertionReport');
            }
            else {
                $scope.GlassConvertionReportArray = resp.data.rows;
                $scope.TotalGlassConvertionReport = resp.data.count;

            }

        }, function (err) { });
    };


    $scope.GetAdvicedGlassReportByConsultation = function (PageNumber, reportType) {
        Object = {
            "IsParentOrganization": true,
            "OrganizationId": $scope.reportSearch.HospitalObj.ClinicId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "DoctorId": $scope.reportSearch.DoctorId,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId
        };
        if (Object.OrganizationId === null || Object.OrganizationId === 0) {
            Object.OrganizationId = parentHospitalId;
        } else {
            Object.IsParentOrganization = false;
        }
        OpticalService.GetAdvicedGlassReportByConsultation(Object).then(function (resp) {
            if (reportType === 'export') {
                $scope.AdvicedGlassReportByConsultationExportHistry = resp.data.rows;
                generateTable($scope.AdvicedGlassReportByConsultationExportHistry, 'AdvicedGlassReportByConsultation');
            }
            else {
                $scope.AdvicedGlassReportByConsultationArray = resp.data.rows;
                $scope.TotalAdvicedGlassReportByConsultation = resp.data.count;

            }

        }, function (err) { });
    };

    //endreport37
    $scope.GetConsolidatedIncentiveReport = function (PageNumber, reportType) {
        Object = {
            // "TreatmentDoctorId": $scope.reportSearch.DoctorId,
            //  "ConvesionDoctorId": $scope.reportSearch.ConversionDoctorId,
            "DoctorId": $scope.reportSearch.DoctorId,
            "ParentOrganizationId": parentHospitalId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1
        };
        eHnoteMainDashboardDataServices.GetConsolidatedIncentiveReport(Object).then(function (resp) {


            if (reportType === 'export') {
                resp.data.rows = resp.data.rows || [];
                $scope.ConsolidatedIncentiveExportHistry = resp.data.rows;
                generateTable($scope.ConsolidatedIncentiveExportHistry, 'Consolidated Incentive Report');
            }
            else {
                $scope.ConsolidatedIncentiveArray = resp.data.rows;
                $scope.TotalConsolidatedIncentiveReport = resp.data.count;

            }

        }, function (err) { });
    };

    // endreport38
    $scope.GetSurgeryByStatusReport = function (PageNumber, reportType) {
        //'{"DoctorId":0,"CounselorId":0,"ParentOrganizationId":3,"HospitalsList":[3],"StartDate":"2019-08-01","EndDate":"2019-08-23"}'
        Object = {
            "DoctorId": $scope.reportSearch.DoctorId,
            "CounselorId": $scope.reportSearch.CounselorDoctorId,
            "HospitalsList": $scope.reportSearch.HospitalId,
            "ParentOrganizationId": parentHospitalId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId,
            "DepartmentId": $scope.reportSearch.DepartmentId
        };
        eHnoteMainDashboardDataServices.GetSurgeryCountReportByStatus(Object).then(function (resp) {


            if (reportType === 'export') {
                resp.data.rows = resp.data.rows || [];
                $scope.SurgeryByStatusExportHistry = resp.data.rows;
                generateTable($scope.SurgeryByStatusExportHistry, 'Surgery Count Report ByStatus');
            }
            else {
                $scope.SurgeryByStatusArray = resp.data.rows;
                $scope.TotalSurgeryByStatusReport = resp.data.count;

            }

        }, function (err) { });
    };

    //endreport39
    $scope.GetPharmaSalesReportByProductReport = function (PageNumber, reportType) {
        Object = {
            //"DoctorId": $scope.reportSearch.DoctorId,
            "IsParentOrganization": true,
            "OrganizationId": $scope.reportSearch.HospitalObj.ClinicId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId
        };
        if (Object.OrganizationId === null || Object.OrganizationId === 0) {
            Object.OrganizationId = parentHospitalId;
        } else {
            Object.IsParentOrganization = false;
        }
        InventoryService.GetPharmaSalesReportByProductReport(Object).then(function (resp) {


            if (reportType === 'export') {
                resp.data.rows = resp.data.rows || [];
                $scope.PharmacySalesReportByProductExportHistry = resp.data.rows;
                generateTable($scope.PharmacySalesReportByProductExportHistry, 'SalesReportByProduct');
            }
            else {
                $scope.SalesReportByProductArray = resp.data.rows;
                $scope.TotalSalesReportByProduct = resp.data.count;

            }

        }, function (err) { });
    };

    //endreport40
    $scope.GetPharmaPurchaseReportByGST = function (PageNumber, reportType) {
        Object = {
            //"DoctorId": $scope.reportSearch.DoctorId,
            "IsParentOrganization": true,
            "OrganizationId": $scope.reportSearch.HospitalObj.ClinicId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId
        };
        if (Object.OrganizationId === null || Object.OrganizationId === 0) {
            Object.OrganizationId = parentHospitalId;
        } else {
            Object.IsParentOrganization = false;
        }
        InventoryService.GetPharmaPurchaseReportByGST(Object).then(function (resp) {


            if (reportType === 'export') {
                resp.data.rows = resp.data.rows || [];
                $scope.PurchaseReportByGSTExportHistry = resp.data.rows;
                generateTable($scope.PurchaseReportByGSTExportHistry, 'PurchaseReportByGST');
            }
            else {
                $scope.PurchaseReportByGSTArray = resp.data.rows;
                $scope.TotalPurchaseReportByGST = resp.data.count;

            }

        }, function (err) { });
    };

    //report41

    $scope.GetPharmaSaleReportByGST = function (PageNumber, reportType) {
        Object = {
            //"DoctorId": $scope.reportSearch.DoctorId,
            "IsParentOrganization": true,
            "OrganizationId": $scope.reportSearch.HospitalObj.ClinicId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId
        };
        if (Object.OrganizationId === null || Object.OrganizationId === 0) {
            Object.OrganizationId = parentHospitalId;
        } else {
            Object.IsParentOrganization = false;
        }
        InventoryService.GetPharmaSaleReportByGST(Object).then(function (resp) {


            if (reportType === 'export') {
                resp.data.rows = resp.data.rows || [];
                $scope.PharmacySaleReportByGSTExportHistry = resp.data.rows;
                generateTable($scope.PharmacySaleReportByGSTExportHistry, 'SaleReportByGST');
            }
            else {
                $scope.SaleReportByGSTArray = resp.data.rows;
                $scope.TotalSaleReportByGST = resp.data.count;

            }

        }, function (err) { });
    };
    //report42
    $scope.GetPharmacyConvertedPrscptnReport = function (PageNumber, reportType) {

        Object = {
            //"DoctorId": $scope.reportSearch.DoctorId,
            "IsParentOrganization": true,
            "OrganizationId": $scope.reportSearch.HospitalObj.ClinicId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId
        };
        if (Object.OrganizationId === null || Object.OrganizationId === 0) {
            Object.OrganizationId = parentHospitalId;
        } else {
            Object.IsParentOrganization = false;
        }
        InventoryService.GetPharmaConvertedPrscptnReport(Object).then(function (resp) {


            if (reportType === 'export') {
                resp.data.rows = resp.data.rows || [];
                $scope.PharmaConvertedPrscptnReportExportHistry = resp.data.rows;
                generateTable($scope.PharmaConvertedPrscptnReportExportHistry, 'ConvertedPrscptnReport');
            }
            else {
                $scope.ConvertedPrscptnReportArray = resp.data.rows;
                $scope.TotalConvertedPrscptnReport = resp.data.count;

            }

        }, function (err) { });
    };
    //report42
    $scope.GetPharmaAdvicedPrscptnReportByConSultation = function (PageNumber, reportType) {

        Object = {
            "DoctorId": 0,
            "IsParentOrganization": true,
            "OrganizationId": $scope.reportSearch.HospitalObj.ClinicId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId
        };
        if (Object.OrganizationId === null || Object.OrganizationId === 0) {
            Object.OrganizationId = parentHospitalId;
        } else {
            Object.IsParentOrganization = false;
        }
        InventoryService.GetPharmaAdvicedPrscptnReportByConSultation(Object).then(function (resp) {


            if (reportType === 'export') {
                resp.data.rows = resp.data.rows || [];
                $scope.PharmaAdvicedPrscptnReportByConSultationExportHistry = resp.data.rows;
                generateTable($scope.PharmaAdvicedPrscptnReportByConSultationExportHistry, 'AdvicedPrscptnReportByConSultation');
            }
            else {
                $scope.AdvicedPrscptnReportByConSultationArray = resp.data.rows;
                $scope.TotalAdvicedPrscptnReportByConSultation = resp.data.count;

            }

        }, function (err) { });
    };
    //report42
    $scope.GetPharmaExpiryStockReport = function (PageNumber, reportType) {
        Object = {
            //"DoctorId": 0,
            "IsExpiry": 'Expired',
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "OrganizationId": $scope.reportSearch.HospitalObj.ClinicId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "GetallIndicator": true,
            "SearchText": $scope.searchPatientTxt ? $scope.searchPatientTxt : null,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId
        };
        if (Object.OrganizationId === null || Object.OrganizationId === 0) {
            Object.OrganizationId = parentHospitalId;
        } else {
            Object.GetallIndicator = false;
        }
        InventoryService.GetPharmaExpiryStockReport(Object).then(function (resp) {
            //$scope.searchPatientTxt = "";
            if (reportType === 'export') {
                resp.data.rows = resp.data.rows || [];
                $scope.PharmaExpiryStockExportHistry = resp.data.Rows;
                generateTable($scope.PharmaExpiryStockExportHistry, 'PharmaExpiryStockReport');
            }
            else {
                $scope.ExpiryStockArray = resp.data.Rows;
                $scope.TotalExpiryStock = resp.data.count;

            }

        }, function (err) { });
    };
    //report44
    $scope.GetPharmaReadyToExpireStockReport = function (PageNumber, reportType) {
        Object = {
            //"DoctorId": 0,
            "IsExpiry": 'ReadyToExpire',
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "OrganizationId": $scope.reportSearch.HospitalObj.ClinicId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.EndDate), "yyyy-MM-dd"),
            "GetallIndicator": true,
            "SearchText": $scope.searchPatientTxt ? $scope.searchPatientTxt : null
        };
        if (Object.OrganizationId === null || Object.OrganizationId === 0) {
            Object.OrganizationId = parentHospitalId;
        } else {
            Object.GetallIndicator = false;
        }
        InventoryService.GetPharmaReadyToExpireStockReport(Object).then(function (resp) {
            //$scope.searchPatientTxt = "";
            if (reportType === 'export') {
                resp.data.rows = resp.data.rows || [];
                $scope.PharmaReadyToExpireExportHistry = resp.data.Rows;
                generateTable($scope.PharmaReadyToExpireExportHistry, 'PharmaReadyToExpireStockReport');
            }
            else {
                $scope.ReadyToExpireStockArray = resp.data.Rows;
                $scope.TotalReadyToExpire = resp.data.count;

            }

        }, function (err) { });
    };
    //report45
    $scope.GetpharmaNonMovingStockReport = function (PageNumber, reportType) {
        Object = {

            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "OrganizationId": $scope.reportSearch.HospitalObj.ClinicId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "GetallIndicator": true,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId
            // "SearchText": $scope.searchPatientTxt ? $scope.searchPatientTxt : null
        };
        if (Object.OrganizationId === null || Object.OrganizationId === 0) {
            Object.OrganizationId = parentHospitalId;
        } else {
            Object.GetallIndicator = false;
        }
        InventoryService.GetpharmaNonMovingStockReport(Object).then(function (resp) {
            //$scope.searchPatientTxt = "";
            if (reportType === 'export') {
                resp.data.rows = resp.data.rows || [];
                $scope.NonMovingStockExportHistry = resp.data.rows;
                generateTable($scope.NonMovingStockExportHistry, 'pharmaNonMovingStockReport');
            }
            else {
                $scope.NonMovingStockArray = resp.data.rows;
                $scope.TotalNonMovingStock = resp.data.Count;

            }

        }, function (err) { });
    };
    //report42
    $scope.GetGSTReport = function (PageNumber, reportType) {

        Object = {
            //"IsParentOrganization":false,
            "DoctorId": $scope.reportSearch.DoctorId,
            "ParentOrganizationId": parentHospitalId,
            "HospitalList": $scope.reportSearch.HospitalId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId,
            "DepartmentId": $scope.reportSearch.DepartmentId
        };
        eHnoteMainDashboardDataServices.GetGSTReport(Object).then(function (resp) {
            if (reportType === 'export') {
                resp.data.rows = resp.data.rows || [];
                $scope.GSTReportExportHistry = resp.data.rows;
                generateTable($scope.GSTReportExportHistry, 'GST Report');
            }
            else {
                $scope.GSTReportDetailArray = resp.data.rows;
                $scope.TotalGSTDetailReport = resp.data.count;

            }

        }, function (err) { });
    };

    //report42
    $scope.GetIndividualDailyReport = function (PageNumber, reportType) {

        Object = {
            //"IsParentOrganization":false,
            "DoctorId": $scope.reportSearch.DoctorId,
            "ParentOrganizationId": parentHospitalId,
            "HospitalList": $scope.reportSearch.HospitalId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            // "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            // "PageNumber": PageNumber ? PageNumber : 1
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId,
            "DepartmentId": $scope.reportSearch.DepartmentId
        };
        eHnoteMainDashboardDataServices.GetIndividualDailyReport(Object).then(function (resp) {
            if (reportType === 'export') {
                resp.data.rows = resp.data.rows || [];
                $scope.IndividualDailyReportExportHistry = resp.data.DaywiseReport;
                generateTable($scope.IndividualDailyReportExportHistry, 'IndividualDailyReport');
            }
            else {
                $scope.IndividualDailyReportArray = resp.data.DaywiseReport;
                $scope.TotalIndividualDailyReport = resp.data.count;

            }

        }, function (err) { });
    };




    $scope.GetOptomCountReport = function (PageNumber, reportType) {

        Object = {
            "IsParentOrganization": true,
            "OrganizationId": $scope.reportSearch.HospitalObj.ClinicId,
            "UserId": $scope.reportSearch.OptomDoctorId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId,
            "DepartmentId": $scope.reportSearch.DepartmentId
        };
        if (Object.OrganizationId === null || Object.OrganizationId === 0) {
            Object.OrganizationId = parentHospitalId;
        } else {
            Object.IsParentOrganization = false;
        }
        eHnoteMainDashboardDataServices.GetOptomCountReport(Object).then(function (resp) {
            if (reportType === 'export') {
                //resp.data.Report = resp.data.Report || [];
                $scope.OptomCountExportHistry = resp.data.rows;
                generateTable($scope.OptomCountExportHistry, 'OptomCountReport');
            }
            else {
                $scope.OptomCountArray = resp.data.rows;
                $scope.TotalOptomCount = resp.data.Count;

            }


        }, function (err) { });
    };
    //report41


    $scope.GetConvertedPatientReportByTreatment = function (PageNumber, reportType) {

        Object = {
            //"IsParentOrganization": true,
            // "OrganizationId": $scope.reportSearch.HospitalObj.ClinicId,
            "HospitalsList": $scope.reportSearch.HospitalId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1
        };
        //if (Object.OrganizationId === null || Object.OrganizationId === 0) {
        //    Object.OrganizationId = parentHospitalId;
        //} else {
        //    Object.IsParentOrganization = false;
        //}
        eHnoteMainDashboardDataServices.GetConvertedPatientReportByTreatment(Object).then(function (resp) {
            if (reportType === 'export') {
                //resp.data.Report = resp.data.Report || [];
                $scope.ConvertedPatientReportByTreatmentExportHistry = resp.data.rows;
                generateTable($scope.ConvertedPatientReportByTreatmentExportHistry, 'ConvertedPatientReportByTreatment');
            }
            else {
                $scope.ConvertedPatientReportByTreatmentArray = resp.data.rows;
                $scope.TotalConvertedPatientReportByTreatment = resp.data.Count;

            }


        }, function (err) { });
    };
    //report41

    $scope.GetFutureAppointmentsReportByPatient = function (PageNumber, reportType) {
        Object = {
            "DoctorId": $scope.reportSearch.DoctorId,
            "IsParentOrganization": true,
            "OrganizationId": $scope.reportSearch.HospitalObj.ClinicId,
            "Date": $scope.reportSearch.FromDate,
            // "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNumber": PageNumber ? PageNumber : 1,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId,
            "DepartmentId": $scope.reportSearch.DepartmentId
        };
        if (Object.OrganizationId === null || Object.OrganizationId === 0) {
            Object.OrganizationId = parentHospitalId;
        } else {
            Object.IsParentOrganization = false;
        }
        eHnoteMainDashboardDataServices.GetFutureAppointmentsReportByPatient(Object).then(function (resp) {
            if (reportType === 'export') {
                resp.data.rows = resp.data.rows || [];
                $scope.FutureAppointmentsExportHistry = resp.data.rows;
                generateTable($scope.FutureAppointmentsExportHistry, 'FutureAppointmentsReportByPatient');
            }
            else {
                $scope.FutureAppointmentsArray = resp.data.rows;
                $scope.TotalFutureAppointments = resp.data.count;

            }

        }, function (err) { });
    };
    //endreport45
    //endreport27

    $scope.GetInsuranceRevenueDetails = function (PageNumber, reportType) {
        Object = {
            "DoctorId": $scope.reportSearch.DoctorId,
            "PageSize": reportType === 'export' ? $scope.exportMaxSize : $scope.maxSize,
            "PageNo": PageNumber ? PageNumber : 1,
            "HospitalID": $scope.reportSearch.HospitalObj.ClinicId,
            "StartDate": $filter("date")(new Date($scope.reportSearch.FromDate), "yyyy-MM-dd"),
            "EndDate": $filter("date")(new Date($scope.reportSearch.ToDate), "yyyy-MM-dd"),
            "GetAllIndicator": 1,
            "SubOrganizationId": $scope.reportSearch.SubOrganizationId,
            "DepartmentId": $scope.reportSearch.DepartmentId
        };


        if (Object.HospitalID === null || Object.HospitalID === 0) {
            Object.HospitalID = parentHospitalId;
        } else {
            Object.GetAllIndicator = 0;
        }

        eHnoteMainDashboardDataServices.GetInsuranceRevenueDetails(Object).then(function (resp) {

            if (resp.data.status === "Success") {
                if (reportType === 'export') {
                    resp.data.RevenueDetail = resp.data.RevenueDetail || [];
                    $scope.InsuranceRevenueExportHistry = resp.data.RevenueDetail;
                    angular.forEach($scope.InsuranceRevenueExportHistry , function (item) {
                        item.TreatmentData = "";
                        item.TreatmentDoctordata = "";
                        if (item.treatment !== undefined) {
                            $scope.treatmentList = [];
                            angular.forEach(item.treatment, function (mitem) {
                                if (mitem.IsWaved) {
                                    mitem.TreatmentName += "(W.O)";
                                }
                                $scope.treatmentList.push(mitem.TreatmentName);
                            });
                            if ($scope.treatmentList.length > 0) {
                                item.TreatmentData = $scope.treatmentList.join(",");
                            }
                            $scope.treatmentDocList = [];
                            angular.forEach(item.treatment, function (ditem) {

                                if (ditem.TreatmentDoctor !== null) {
                                    $scope.treatmentDocList.push(ditem.TreatmentDoctor);
                                }
                            });
                            if ($scope.treatmentDocList.length > 0) {
                                item.TreatmentDoctordata = $scope.treatmentDocList.join(",");
                            }
                        }
                    });
                    generateTable($scope.InsuranceRevenueExportHistry, 'InsuranceRevenueDetails');
                }
                else {
                    $scope.InsuranceRevenueArray = resp.data.RevenueDetail;

                    angular.forEach($scope.InsuranceRevenueArray, function (item) {
                        item.TreatmentData = "";
                        item.TreatmentDoctordata = "";
                        item.TreatmentconDoctordata = "";
                        if (item.treatment !== undefined) {
                            $scope.treatmentList = [];
                            angular.forEach(item.treatment, function (mitem) {
                                if (mitem.IsWaved) {
                                    mitem.TreatmentName += "(W.O)";
                                }
                                $scope.treatmentList.push(mitem.TreatmentName);
                            });
                            if ($scope.treatmentList.length > 0) {
                                item.TreatmentData = $scope.treatmentList.join(",");
                            }
                            $scope.treatmentDocList = [];
                            angular.forEach(item.treatment, function (ditem) {
                                if (ditem.TreatmentDoctor !== null) {
                                    $scope.treatmentDocList.push(ditem.TreatmentDoctor);
                                }
                            });
                            if ($scope.treatmentDocList.length > 0) {
                                item.TreatmentDoctordata = $scope.treatmentDocList.join(",");
                            }


                            $scope.treatmentConList = [];
                            angular.forEach(item.treatment, function (citem) {
                                if (citem.ConversionDoctor !== null) {
                                    $scope.treatmentConList.push(citem.ConversionDoctor);
                                }
                            });
                            if ($scope.treatmentConList.length > 0) {
                                item.TreatmentconDoctordata = $scope.treatmentConList.join(",");
                            }
                        }
                    });
                    $scope.TotalInsuranceRevenueReport = resp.data.count;

                }
            }
        }, function (err) { });
    };

    $scope.ChangeReportPage = function (PageNumber, type) {
        if (type === "TreatmentRevenue") {
            $scope.GetTreatmentRevenueReport(PageNumber);
        }
        if (type === "OutPatientReVenue") {
            $scope.GetOutPatientReVenueReport(PageNumber);
        }
        if (type === "SurgeryRevenue") {
            $scope.GetSurgeryRevenueReport(PageNumber);
        }
        if (type === "InvestigationRevenue") {
            $scope.GetInvestigationRevenueReport(PageNumber);
        }
        if (type === "LabRevenue") {
            $scope.GetLabRevenueReport(PageNumber);
        }
        if (type === "IncentiveReport") {
            $scope.GetIncentiveReport(PageNumber);
        }
        if (type === "DynamicSurgeryConvertedReport") {
            $scope.GetDynamicSurgeryConvertedReport(PageNumber);
        }
        if (type === "TreatmentReport") {
            $scope.GetTreatmentReport(PageNumber);
        }
        if (type === "DailyReport") {
            $scope.GetDailyReport(PageNumber);
        }
        if (type === "Referral Report") {
            $scope.GetOPReferralReport(PageNumber);
        }
        if (type === "Doctor OPD Report") {
            $scope.GetOPDoctorReport(PageNumber);
        }
        if (type === "Out Patient Report") {
            $scope.GetOutPatientReport(PageNumber);
        }
        if (type === "Patient Category Report") {
            $scope.GetOPCategoryReport(PageNumber);
        }
        if (type === "Doctor Surgery  Report") {
            $scope.GetOPSurgeryAppointmentReport(PageNumber);
        }
        if (type === "FutureAppointmentsReportByPatient") {
            $scope.GetFutureAppointmentsReportByPatient(PageNumber);
        }

        if (type === "Surgery Performed Report") {
            $scope.GetOPSurgeryPerformedReport(PageNumber);
        }
        if (type === "Procedure Report") {
            $scope.GetOPProcedureReport(PageNumber);
        }
        if (type === "Investigation Report") {
            $scope.GetOPInvestigationReport(PageNumber);
        }
        if (type === "Surgery Cost Report") {
            $scope.GetOPSurgeryCostReport(PageNumber);
        }
        if (type === "Investigation Cost Report") {
            $scope.GetOPInvestigationCostReport(PageNumber);
        }
        if (type === "Procedure Cost Report") {
            $scope.GetOPProcedureCostReport(PageNumber);
        }
        if (type === "Lab Report") {
            $scope.GetOPLabReport(PageNumber);
        }
        if (type === "Lab Cost Report") {
            $scope.GetOPLabCostReport(PageNumber);
        }
        if (type === "Surgery Performed Count Report") {
            $scope.GetOpSurgeryPerformedCountReport(PageNumber);
        }
        if (type === "Investigation Count Report") {
            $scope.GetOpInvestigationCountReport(PageNumber);
        }
        if (type === "ReferralWise Cost Report") {
            $scope.GetOpReferralWiseCostReport(PageNumber);
        }
        if (type === "Form3c Report") {
            $scope.GetOpForm3CReport(PageNumber);
        }
        if (type === "Advance Amount") {
            $scope.GetOpAdvanceRevenueDetailReport(PageNumber);
        }
        if (type === "AccountRevenue") {
            $scope.GetAccountRevenueReport(PageNumber);
        }
        if (type === "AccountExpenses") {
            $scope.GetAccountExpensesReport(PageNumber);
        }
        if (type === "Accounts Bank Deposit") {
            $scope.GetAccountsBankDepositReport(PageNumber);
        }
        if (type === "GST Report") {
            $scope.GetGSTReport(PageNumber);
        }
        if (type === "InsuranceRevenueDetails") {
            $scope.GetInsuranceRevenueDetails(PageNumber);
        }

        if (type === "IndividualDailyReport") {
            $scope.GetIndividualDailyReport(PageNumber);
        }
        if (type === "OptomCountReport") {
            $scope.GetOptomCountReport(PageNumber);
        }
        if (type === "InvestigationAdvisedReport") {
            $scope.GetInvestigationAdvisedReport(PageNumber);
        }
        if (type === "surgeryAdvisedReport") {
            $scope.GetsurgeryAdvisedReport(PageNumber);
        }


        if (type === "Department Revenue Report") {
            $scope.GetDepartmentReport(PageNumber);
        }

        if (type === "Investigation") {
            $scope.GetInvestigationDetailReport(PageNumber);
        }
        if (type === "Lab") {
            $scope.GetLabDetailReport(PageNumber);
        }
        if (type === "Surgery") {
            $scope.GetSurgeryDetailReport(PageNumber);
        }
        if (type === "Waived Off Report") {
            $scope.GetWaivedOffReport(PageNumber);
        }

        if (type === "Procedure") {
            $scope.GetProcedureDetailReport(PageNumber);
        }

        //optical
        if (type === "PurchaseReturns") {
            $scope.GetPurchaseReturnsReport(PageNumber);
        }
        if (type === "Purchase") {
            $scope.GetPurchaseReport(PageNumber);
        }
        if (type === "Sales") {
            // $scope.GetSalesReport(PageNumber);
            $scope.GetOpticalSalesDetailReport(PageNumber);

        }
        if (type === "SalesReturns") {
            $scope.GetSalesReturnsReport(PageNumber);
        }
        if (type === "DeliveredOrder") {
            $scope.GetDeliveredOrderReport(PageNumber);
        }
        if (type === "TotalSales") {
            $scope.GetOpticalSalesHistory(PageNumber);
        }

        if (type === "Not-Delivered") {
            $scope.GetNotDeliveredReport(PageNumber);
        }
        if (type === "OutstandingReport") {
            $scope.GetOutstandingReport(PageNumber);
        }
        if (type === "GlassConverstionReport") {
            $scope.GetGlassConverstionReport(PageNumber);
        }

        if (type === "AdvicedGlassReportByConsultation") {
            $scope.GetAdvicedGlassReportByConsultation(PageNumber);
        }
        //pharmacy
        if (type === "Pharmacy-Purchases") {
            $scope.GetPharmacyPurchaseReport(PageNumber);
        }
        if (type === "Pharmacy Purchases Returns") {
            $scope.GetPharmacyPurchaseReturnsReport(PageNumber);
        }
        if (type === "Pharmacy Sales") {
            // $scope.GetPharmacySalesReport(PageNumber);
            $scope.GetPharmaSalesDetailReport(PageNumber);
        }
        if (type === "Pharmacy Sale Return") {
            $scope.GetPharmacySaleReturnReport(PageNumber);
        }
        if (type === "SalesReportByProduct") {
            $scope.GetPharmaSalesReportByProductReport(PageNumber);
        }
        if (type === "PurchaseReportByGST") {
            $scope.GetPharmaPurchaseReportByGST(PageNumber);
        }
        if (type === "SaleReportByGST") {
            $scope.GetPharmaSaleReportByGST(PageNumber);
        }
        if (type === "ConvertedPrscptnReport") {
            $scope.GetPharmacyConvertedPrscptnReport(PageNumber);
        }
        if (type === "AdvicedPrscptnReportByConSultation") {
            $scope.GetPharmaAdvicedPrscptnReportByConSultation(PageNumber);
        }
        if (type === "PharmaExpiryStockReport") {
            $scope.GetPharmaExpiryStockReport(PageNumber);
        }
        if (type === "PharmaReadyToExpireStockReport") {
            $scope.GetPharmaReadyToExpireStockReport(PageNumber);
        }
        if (type === "pharmaNonMovingStockReport") {
            $scope.GetpharmaNonMovingStockReport(PageNumber);
        }
        // end pharmacy
        if (type === "Diagnosis Report") {
            $scope.GetDiagnosisReport(PageNumber);
        }
        if (type === "Consolidated Incentive Report") {
            $scope.GetConsolidatedIncentiveReport(PageNumber);
        }
        if (type === "Surgery Count Report ByStatus") {
            $scope.GetSurgeryByStatusReport(PageNumber);
        }

        if (type === "ConvertedPatientReportByTreatment") {
            $scope.GetConvertedPatientReportByTreatment(PageNumber);
        }
        if (type === "SmsHistory") {
            $scope.GetSmsHistoryReport(PageNumber);
        }
    };

    $scope.showIncentiveEligiblReportDiv = false;
    $scope.showComingSoonDiv = false;
    $scope.showIncentiveReportDiv = false;
    $scope.showDynamicSurgeryConvertedReportDiv = false;
    $scope.showTreatmentReportDiv = false;
    $scope.showDailyReportDiv1 = false;
    $scope.showDailyReportDiv = false;
    $scope.showOPDoctorReportDiv = false;
    $scope.showOPSurgeryAppointmentReportDiv = false;
    $scope.showOPSurgeryPerformedReportDiv = false;
    $scope.showOPProcedureReportDiv = false;
    $scope.showOPInvestigationReportDiv = false;
    $scope.showOPSurgeryCostReportDiv = false;
    $scope.showOPInvestigationCostReportDiv = false;
    $scope.showOPProcedureCostReportDiv = false;
    $scope.showOPLabReportDiv = false;
    $scope.showOPLabCostReportDiv = false;
    $scope.showOPSurgeryPerformedCountReportDiv = false;
    $scope.showOPInvestigationCountReportDiv = false;
    $scope.showOPReferralWiseCostReportDiv = false;
    $scope.showOPForm3CReportDiv = false;
    $scope.showDaywisecollectionReportDiv = false;
    $scope.showOpAdvanceRevenueDetailDiv = false;
    $scope.showDailyReportDiv = false;
    $scope.showAccountRevenueReportDiv = false;
    $scope.showAccountExpensesReportDiv = false;
    $scope.showAccountsBankDepositReportDiv = false;
    $scope.showGSTReportDiv = false;
    $scope.showInsuranceRevenueDetailsDiv = false;
    $scope.showIndividualDailyReportDiv = false;
    $scope.showOptomCountReportDiv = false;
    $scope.showInvestigationAdvisedReportDiv = false;
    $scope.showsurgeryAdvisedReportDiv = false;
    $scope.showFutureAppointmentsReportByPatientDiv = false;

    $scope.showDepartmentReportDiv = false;
    $scope.showInvestigationDetailReportDiv = false;
    $scope.showLabDetailReportDiv = false;
    $scope.showSurgeryDetailReportDiv = false;
    $scope.showProcedureDetailReportDiv = false;
    $scope.showSurgeryCountReportByStatusDiv = false;
    //optical
    $scope.showPurchaseReturnsReportDiv = false;
    $scope.showPurchaseReportDiv = false;
    $scope.showSalesReportDiv = false;
    $scope.showSalesReturnsReportDiv = false;
    $scope.showDeliveredOrderReportDiv = false;
    $scope.showTotalSalesDiv = false;
    $scope.showNotDeliveredOrderReportDiv = false;
    $scope.showOutstandingReportReportDiv = false;
    $scope.showGlassConvertionReportDiv = false;
    $scope.showAdvicedGlassReportByConsultationDiv = false;
    $scope.showConvertedPatientReportByTreatmentDiv = false;


    //pharmacy
    $scope.showPharmacyPurchaseReportDiv = false;
    $scope.showPharmacyPurchaseReturnsReportDiv = false;
    $scope.showPharmacySalesReportDiv = false;
    $scope.showPharmacySaleReturnReportDiv = false;
    $scope.showSalesReportByProducttDiv = false;
    $scope.showPurchaseReportByGSTDiv = false;
    $scope.showSaleReportByGSTDiv = false;
    $scope.showPharmacyConvertedPrscptnReportDiv = false;
    $scope.showPharmacyAdvicedPrscptnReportByConSultationDiv = false;
    $scope.ShowReadyToExpirediv = false;

    $scope.showDiagnosisReportDiv = false;

    $scope.navtoDashBoardReport = function (type) {

        $scope.showfromdatediv1 = true;
        $scope.showfromdatediv = false;

        $scope.showConsolidatedReportDivDoc = false;

        $scope.showMainReportsScreen = false;
        $scope.showIncentiveEligiblReportDiv = false;
        $scope.showComingSoonDiv = false;
        $scope.showTreatmentRevenueReportDiv = false;
        $scope.showOutPatientReVenueReportDiv = false;
        $scope.showSurgeryRevenueReportDiv = false;
        $scope.showInvestigationRevenueReportDiv = false;
        $scope.showLabRevenueReportDiv = false;
        $scope.showIncentiveReportDiv = false;
        $scope.showDynamicSurgeryConvertedReportDiv = false;
        $scope.showTreatmentReportDiv = false;
        $scope.showAccountRevenueReportDiv = false;
        $scope.showAccountExpensesReportDiv = false;
        $scope.showAccountsBankDepositReportDiv = false;
        $scope.showDailyReportJobrunDiv = false;
        $scope.showexcelexport = true;


        $scope.showInvestigationDetailReportDiv = false;
        $scope.showLabDetailReportDiv = false;
        $scope.showSurgeryDetailReportDiv = false;
        $scope.showDepartmentReportDiv = false;
        $scope.showProcedureDetailReportDiv = false;
        $scope.showSurgeryCountReportByStatusDiv = false;
        $scope.showGSTReportDiv = false;
        $scope.showInsuranceRevenueDetailsDiv = false;
        $scope.showIndividualDailyReportDiv = false;
        $scope.showOptomCountReportDiv = false;
        $scope.showInvestigationAdvisedReportDiv = false;
        $scope.showsurgeryAdvisedReportDiv = false;
        $scope.showFutureAppointmentsReportByPatientDiv = false;

        $scope.showConvertedPatientReportByTreatmentDiv = false;
        $scope.showPurchaseReturnsReportDiv = false;
        $scope.showPurchaseReportDiv = false;
        $scope.showSalesReportDiv = false;
        $scope.showSalesReturnsReportDiv = false;
        $scope.showDeliveredOrderReportDiv = false;
        $scope.showNotDeliveredOrderReportDiv = false;
        $scope.showOutstandingReportReportDiv = false;
        $scope.showGlassConvertionReportDiv = false;
        $scope.showAdvicedGlassReportByConsultationDiv = false;


        $scope.showPharmacyPurchaseReportDiv = false;
        $scope.showPharmacyPurchaseReturnsReportDiv = false;
        $scope.showPharmacySalesReportDiv = false;
        $scope.showPharmacySaleReturnReportDiv = false;
        $scope.showSalesReportByProducttDiv = false;
        $scope.showPurchaseReportByGSTDiv = false;
        $scope.showSaleReportByGSTDiv = false;
        $scope.showPharmacyConvertedPrscptnReportDiv = false;
        $scope.showPharmacyAdvicedPrscptnReportByConSultationDiv = false;
        $scope.showPharmaReadyToExpireStockReportDiv = false;
        $scope.showPharmaNonMovingStockReportDiv = false;
        $scope.ShowReadyToExpirediv = false;

        $scope.showDiagnosisReportDiv = false;
        $scope.showDiagnosisSearchTextDiv = false;
        $scope.showConversionDailyReportDivDoc = false;
        $scope.showCounselorsDailyReportDivDoc = false;
        $scope.showOptomCountReportDivDoc = false;
        $scope.showInvestigationAdvisedReportDiv = false;
        $scope.showsurgeryAdvisedReportDiv = false;
        $scope.showCategorylistDivDoc = false;
        $scope.showStatusIdDivDoc = false;
        $scope.showTotalSalesDiv = false;

        $scope.showConsolidatedIncentiveReporttDiv = false;
        $scope.showSmsHistoryDiv = false;
        $scope.showNewPatientReportData = false;
        $scope.showAppointmentStatisticsReportData = false;
        $scope.showApptStatusReportData = false;
        $scope.showExternalDoctorReportData = false;
        $scope.showInternalDoctorReportData = false;
        $scope.showUserReportData = false
        $scope.ViewsObj.UserReport = false;
        $scope.ViewsObj.SurgeryApptReport = false;
        $scope.showSurgeryApptReportData = false;
        $scope.showApptInsuranceReport = false;

        $scope.ViewsObj.IOLReport = false;
        $scope.showIOLReportData = false;
        // $scope.showConversionDailyReportDivDoc = false;
        //   switch (type) {
        $scope.viewtype = type;


        var pickedDate = new Date();
        var startSunday = new Date(pickedDate);
        startSunday.setDate(pickedDate.getDate() - pickedDate.getDay());
        var startMonth = new Date(pickedDate);
        startMonth.setDate(1);
        $scope.startDate = Math.max(startMonth, startSunday);
        var endSaturday = new Date(pickedDate);
        endSaturday.setDate(pickedDate.getDate() + 6 - pickedDate.getDay());
        var endMonth = new Date(pickedDate);
        endMonth.setMonth(pickedDate.getMonth() + 1);//Add a month
        endMonth.setDate(0);// to select last day of previous month.
        var endDate = Math.min(endMonth, endSaturday);
        console.log("End", new Date(endDate));
        $scope.GetNewPatientReportObj.FromDate = $filter('date')($scope.startDate, "MM-dd-yyyy");
        $scope.PatientSurgeryApptObj.FromDate = $filter('date')($scope.startDate, "MM-dd-yyyy");
        $scope.GetNewPatientReportObj.ToDate = $filter('date')(endDate, "MM-dd-yyyy");
        $scope.PatientApptInsObj.FromDate = $filter('date')($scope.startDate, "MM-dd-yyyy");
        $scope.GetNewPatientReportObj.FromMonth = new Date();
        $scope.GetNewPatientReportObj.ToMonth = new Date();
        //$scope.GetNewPatientReportObj.ToDate = $filter('date')(new Date(), "MM-dd-yyyy");
        //$scope.GetNewPatientReportObj.FromDate = moment($scope.currentdate).subtract(6, 'days').format('MM-DD-YYYY');
        //var FromDate = $filter('date')($scope.GetNewPatientReportObj.FromDate, "yyyy-MM-dd"); //YYYY-MM-DD
        //var ToDate = $filter('date')($scope.GetNewPatientReportObj.ToDate, "yyyy-MM-dd"); //YYYY-MM-DD
        var dateArr = getDateArray($scope.GetNewPatientReportObj.FromDate, $scope.GetNewPatientReportObj.ToDate);
        console.log(dateArr);
        $scope.Datecontainer = [];
        angular.forEach(dateArr, function (item) {
            $scope.Datecontainer.push($filter('date')(new Date(item), "yyyy-MM-dd"));
        });
        $scope.DatecontainerColspan = $scope.Datecontainer.length + 1;

        angular.forEach($scope.appointmentTypes, function (item) {
            item.isChecked = true;
        });

        $scope.AllDoctorsObj.AllAppointmentTypeStatusCheck = true;
        $scope.selectVisitType = 'All';

        angular.forEach($scope.Visitreasons, function (item) {
            item.isChecked = true;
        });

        $scope.AllDoctorsObj.AllVisitReasonsCheck = true;
        $scope.selectedVisitReason = 'All';

        angular.forEach($scope.confirmationStatusArray, function (item) {
            item.IsChecked = true;
        });

        $scope.StatusListObj.AllStatusCheck = true;
        $scope.StatusListObj.SelectStatusString = 'All';
        $scope.MasterReasonTypes = $scope.MasterReasonTypes || [];
        if ($scope.MasterReasonTypes.length > 0) {
            angular.forEach($scope.MasterReasonTypes, function (sitem) {
                sitem.isChecked = true;
            });
            var selectedInternalDoctors = $filter("filter")($scope.MasterReasonTypes, function (iterator, ind) { return iterator.isChecked == true; });
            if (selectedInternalDoctors.length === $scope.MasterReasonTypes.length) {
                $scope.AllDoctorsObj.AllResonTypeCheck = true;

                $scope.selectResonType = 'All';
            } else {
                $scope.AllDoctorsObj.AllResonTypeCheck = false;
                $scope.selectResonType = 'Select ResonType';
            }

        }
        $scope.ReferalPCPDoctorsList = $scope.ReferalPCPDoctorsList || [];
        if ($scope.ReferalPCPDoctorsList.length > 0) {
            angular.forEach($scope.ReferalPCPDoctorsList, function (sitem) {
                if (sitem.DeleteInd == "N") {
                    sitem.isChecked = true;
                } else {
                    sitem.isChecked = false;
                }
            });
            var checkedArray = _.where($scope.ReferalPCPDoctorsList, { isChecked: true });
            $scope.GetNewPatientReportObj.AllReferalDoctorCheck = checkedArray.length > 0 && $scope.ReferalPCPDoctorsList.length === checkedArray.length ? true : false;
            $scope.selectedReferalDoctors = 'Select Referal Doctors';
            if ($scope.GetNewPatientReportObj.AllReferalDoctorCheck) {
                $scope.selectedReferalDoctors = 'All';
            }

        }
        $scope.InternalReportDoctorList = $scope.InternalReportDoctorList || [];
        if ($scope.InternalReportDoctorList.length > 0) {
            angular.forEach($scope.InternalReportDoctorList, function (sitem) {

                sitem.isChecked = true;

            });
            $scope.selectedInternalDoctors = 'Select Referal Doctors';
            var checkedArray = _.where($scope.InternalReportDoctorList, { isChecked: true });
            $scope.GetNewPatientReportObj.AllInternalDoctorCheck = checkedArray.length > 0 && $scope.InternalReportDoctorList.length === checkedArray.length ? true : false;
            if ($scope.GetNewPatientReportObj.AllInternalDoctorCheck) {
                $scope.selectedInternalDoctors = 'All';
            }
        }
        //if ($scope.AppointmentStatusArray.length > 0) {
        //    angular.forEach($scope.AppointmentStatusArray, function (kitem) {
        //        kitem.IsChecked = true;

        //    });
        //    $scope.StatusListObj.SelectStatusString = 'All';
        //    $scope.StatusListObj.AllStatusCheck = true;
        //}
        // }
        if (type === "New Patient Report") {
            $scope.showNewReport = true;
            $scope.showTreatmentRevenueReportDiv = false;
            $scope.showDailyReportDivDoc = false;
            $scope.showDailyReportDiv1 = true;
            $scope.showConsolidatedReportDivDoc = true;
            $scope.showfromdatediv1 = false;
            $scope.showNewPatientReportData = true;
            $scope.showApptStatusReportData = false;
            $scope.showSurgeryApptReportData = false;
            $scope.showApptInsuranceReport = false;
            $scope.ViewsObj.ForApptStatistics = false;
            $scope.showAppointmentMonthlyStatisticsReportData = false;
            $scope.ViewsObj.InternalReferralReport = false;
            $scope.ViewsObj.ExternalReferralReport = false;
            $scope.ViewsObj.SurgeryApptReport = false;
            $scope.ViewsObj.PatApptInsReport = false;
            /*  $scope.NewPatientReportOnDashBoard();*/

        }
        if (type === "AppointmentStatisticsReport") {
            $scope.showNewReport = false;
            $scope.showTreatmentRevenueReportDiv = false;
            $scope.showDailyReportDivDoc = false;
            $scope.showDailyReportDiv1 = true;
            $scope.showConsolidatedReportDivDoc = true;
            $scope.showfromdatediv1 = false;
            $scope.showApptStatusReportData = false;
            $scope.showAppointmentMonthlyStatisticsReportData = false;
            $scope.showSurgeryApptReportData = false;
            $scope.showApptInsuranceReport = false;
            $scope.showAppointmentStatisticsReportData = true;

            $scope.ViewsObj.ForApptStatistics = true;
            $scope.ViewsObj.ForMonthlyApptStatistics = false;
            $scope.ViewsObj.InternalReferralReport = false;
            $scope.ViewsObj.ExternalReferralReport = false;
            $scope.ViewsObj.SurgeryApptReport = false;
            $scope.ViewsObj.PatApptInsReport = false;
            /*  $scope.NewPatientReportOnDashBoard();*/

        }

        if (type === "SurgeryAppointmentReport") {
            $scope.showNewReport = false;
            $scope.showTreatmentRevenueReportDiv = false;
            $scope.showDailyReportDivDoc = false;
            $scope.showDailyReportDiv1 = true;
            $scope.showConsolidatedReportDivDoc = true;
            $scope.showfromdatediv1 = false;
            $scope.showAppointmentStatisticsReportData = false;
            $scope.showAppointmentMonthlyStatisticsReportData = false;
            $scope.showApptStatusReportData = false;
            $scope.showSurgeryApptReportData = true;
            $scope.showApptInsuranceReport = false;

            $scope.ViewsObj.ForApptStatistics = false;
            $scope.ViewsObj.ForMonthlyApptStatistics = false;
            $scope.ViewsObj.InternalReferralReport = false;
            $scope.ViewsObj.ExternalReferralReport = false;
            $scope.ViewsObj.SurgeryApptReport = true;
            $scope.ViewsObj.PatApptInsReport = false;
            $scope.GetSurgeryAppointmentsList();
            
        }

        if (type === "AppointmentStatusReport") {
            $scope.showNewReport = false;
            $scope.showTreatmentRevenueReportDiv = false;
            $scope.showDailyReportDivDoc = false;
            $scope.showDailyReportDiv1 = true;
            $scope.showConsolidatedReportDivDoc = true;
            $scope.showfromdatediv1 = false;
            $scope.showAppointmentStatisticsReportData = false;
            $scope.showAppointmentMonthlyStatisticsReportData = false;
            $scope.showSurgeryApptReportData = false;
            $scope.showApptInsuranceReport = false;
            $scope.showApptStatusReportData = true;

            $scope.ViewsObj.ForApptStatistics = true;
            $scope.ViewsObj.ForMonthlyApptStatistics = false;
            $scope.ViewsObj.InternalReferralReport = false;
            $scope.ViewsObj.ExternalReferralReport = false;
            $scope.ViewsObj.SurgeryApptReport = false;
            $scope.ViewsObj.PatApptInsReport = false;

        }

        if (type === "AppointmentsMonthlyStatisticsReport") {
            $scope.showNewReport = false;
            $scope.showTreatmentRevenueReportDiv = false;
            $scope.showDailyReportDivDoc = false;
            $scope.showDailyReportDiv1 = true;
            $scope.showConsolidatedReportDivDoc = true;
            $scope.showfromdatediv1 = false;
            $scope.showApptStatusReportData = false;
            $scope.showSurgeryApptReportData = false;
            $scope.showApptInsuranceReport = false;
            $scope.showAppointmentMonthlyStatisticsReportData = true;
            $scope.ViewsObj.ForApptStatistics = false;
            $scope.ViewsObj.ForMonthlyApptStatistics = true;
            $scope.ViewsObj.ExternalReferralReport = false;
            $scope.ViewsObj.InternalReferralReport = false;
            $scope.ViewsObj.SurgeryApptReport = false;
            $scope.ViewsObj.PatApptInsReport = false;
            $scope.DatePickerOptions = {                
                datepickerMode: "'month'",
                minMode: "'month'",
                minDate: "minDate",
                showWeeks: "false"
            };
            /*  $scope.NewPatientReportOnDashBoard();*/
        }
        if (type == "InternalReferralReport" || type == "ExternalReferralReport") {
            if ($scope.AppointmentStatusArray.length > 0) {
                angular.forEach($scope.AppointmentStatusArray, function (kitem) {
                    kitem.IsChecked = false;
                    if (kitem.AppointmentStatusId == 1 || kitem.AppointmentStatusId == 2 || kitem.AppointmentStatusId == 3 || kitem.AppointmentStatusId == 4) {
                        kitem.IsChecked = true;
                    }
                });
                $scope.StatusListObj.SelectStatusString = 'Selected';
                $scope.StatusListObj.AllStatusCheck = false;
            }
            /* both referral reports start with Role = All so the Role dropdown
               and the Doctor List selection stay in sync */
            $scope.checkAllReferralReportRoles(true);
        }
        if (type === "InternalReferralReport") {
            $scope.showNewReport = false;
            $scope.showTreatmentRevenueReportDiv = false;
            $scope.showDailyReportDivDoc = false;
            $scope.showDailyReportDiv1 = true;
            $scope.showConsolidatedReportDivDoc = true;
            $scope.showfromdatediv1 = false;
            $scope.showAppointmentStatisticsReportData = false;
            $scope.showAppointmentMonthlyStatisticsReportData = false;
            $scope.showApptStatusReportData = false;
            $scope.showSurgeryApptReportData = false;
            $scope.showApptInsuranceReport = false;
            $scope.showExternalDoctorReportData = false;
            $scope.showInternalDoctorReportData = true;
            $scope.ViewsObj.ForApptStatistics = false;
            $scope.ViewsObj.ForMonthlyApptStatistics = false;
            $scope.ViewsObj.InternalReferralReport = true;
            $scope.ViewsObj.ExternalReferralReport = false;
            $scope.ViewsObj.SurgeryApptReport = false;
            $scope.ViewsObj.PatApptInsReport = false;
        }
        if (type === "ExternalReferralReport") {
            $scope.showNewReport = false;
            $scope.showTreatmentRevenueReportDiv = false;
            $scope.showDailyReportDivDoc = false;
            $scope.showDailyReportDiv1 = true;
            $scope.showConsolidatedReportDivDoc = true;
            $scope.showfromdatediv1 = false;
            $scope.showAppointmentStatisticsReportData = false;
            $scope.showAppointmentMonthlyStatisticsReportData = false;
            $scope.showSurgeryApptReportData = false;
            $scope.showApptInsuranceReport = false;
            $scope.showApptStatusReportData = false;
            $scope.showExternalDoctorReportData = true;
            $scope.showInternalDoctorReportData = false;
            $scope.ViewsObj.ForApptStatistics = false;
            $scope.ViewsObj.ForMonthlyApptStatistics = false;
            $scope.ViewsObj.ExternalReferralReport = true;
            $scope.ViewsObj.InternalReferralReport = false;
            $scope.ViewsObj.SurgeryApptReport = false;
            $scope.ViewsObj.PatApptInsReport = false;
        }

        if (type === "UserReports") {
            if ($scope.UserAppointmentStatusArray.length > 0) {
                angular.forEach($scope.UserAppointmentStatusArray, function (kitem) {
                    kitem.IsChecked = true;

                });
                $scope.StatusListObj.SelectStatusString = 'All';
                $scope.StatusListObj.AllUserStatusCheck = true;
            }
            $scope.showNewReport = false;
            $scope.showTreatmentRevenueReportDiv = false;
            $scope.showDailyReportDivDoc = false;
            $scope.showDailyReportDiv1 = true;
            $scope.showConsolidatedReportDivDoc = true;
            $scope.showfromdatediv1 = false;
            $scope.showAppointmentStatisticsReportData = false;
            $scope.showAppointmentMonthlyStatisticsReportData = false;
            $scope.showApptStatusReportData = false;
            $scope.showSurgeryApptReportData = false;
            $scope.showApptInsuranceReport = false;
            $scope.showExternalDoctorReportData = false;
            $scope.showInternalDoctorReportData = false;
            $scope.showUserReportData = true;
            $scope.ViewsObj.ForApptStatistics = false;
            $scope.ViewsObj.ForMonthlyApptStatistics = false;
            $scope.ViewsObj.InternalReferralReport = false;
            $scope.ViewsObj.ExternalReferralReport = false;
            $scope.ViewsObj.UserReport = true;
            $scope.ViewsObj.SurgeryApptReport = false;
            $scope.ViewsObj.PatApptInsReport = false;
        }

        if (type === "IOLReports") {

            $scope.showIOLReportData = true;
            $scope.ViewsObj.IOLReport = true;
            $scope.showNewReport = false;
            $scope.showTreatmentRevenueReportDiv = false;
            $scope.showDailyReportDivDoc = false;
            $scope.showDailyReportDiv1 = true;
            $scope.showConsolidatedReportDivDoc = true;
            $scope.showfromdatediv1 = false;
         
            $scope.showApptStatusReportData = false;
            $scope.showExternalDoctorReportData = false;
            $scope.showInternalDoctorReportData = false;
            $scope.showSurgeryApptReportData = false;
            $scope.showApptInsuranceReport = false;
            $scope.ViewsObj.ForApptStatistics = false;
            $scope.ViewsObj.ForMonthlyApptStatistics = false;
            $scope.ViewsObj.InternalReferralReport = false;
            $scope.ViewsObj.ExternalReferralReport = false;
            $scope.ViewsObj.UserReport = false;
            $scope.ViewsObj.SurgeryApptReport = false;
            $scope.ViewsObj.PatApptInsReport = false;

            $scope.showAppointmentStatisticsReportData = false;
            $scope.showAppointmentMonthlyStatisticsReportData = false;
            $scope.showNewPatientReportData = false;
       
        }

        if (type === "AppointmentInsuranceReport") {
            $scope.showNewReport = false;
            $scope.showTreatmentRevenueReportDiv = false;
            $scope.showDailyReportDivDoc = false;
            $scope.showDailyReportDiv1 = true;
            $scope.showConsolidatedReportDivDoc = true;
            $scope.showfromdatediv1 = false;
            $scope.showAppointmentStatisticsReportData = false;
            $scope.showAppointmentMonthlyStatisticsReportData = false;
            $scope.showApptStatusReportData = false;
            $scope.showSurgeryApptReportData = false;
            $scope.showApptInsuranceReport = true;

            $scope.ViewsObj.ForApptStatistics = false;
            $scope.ViewsObj.ForMonthlyApptStatistics = false;
            $scope.ViewsObj.InternalReferralReport = false;
            $scope.ViewsObj.ExternalReferralReport = false;
            $scope.ViewsObj.SurgeryApptReport = false;
            $scope.ViewsObj.PatApptInsReport = true;
            $scope.GetAppointmentInsuranceReportsData();
            
        }

        if (type === "TreatmentRevenue") {
            $scope.showTreatmentRevenueReportDiv = true;
            $scope.showDailyReportDivDoc = false;
            $scope.showfromdatediv1 = true;
            $scope.GetTreatmentRevenueReport(1);
        }
        if (type === "OutPatientReVenue") {
            $scope.showOutPatientReVenueReportDiv = true;
            $scope.showDailyReportDivDoc = false;
            $scope.showfromdatediv1 = true;
            $scope.GetOutPatientReVenueReport(1);
        }
        if (type === "SurgeryRevenue") {
            $scope.showSurgeryRevenueReportDiv = true;
            $scope.showDailyReportDivDoc = false;
            $scope.showfromdatediv1 = true;
            $scope.GetSurgeryRevenueReport(1);
        }
        if (type === "InvestigationRevenue") {
            $scope.showInvestigationRevenueReportDiv = true;
            $scope.showDailyReportDivDoc = false;
            $scope.showfromdatediv1 = true;
            $scope.GetInvestigationRevenueReport(1);
        }
        if (type === "LabRevenue") {
            $scope.showLabRevenueReportDiv = true;
            $scope.showDailyReportDivDoc = false;
            $scope.showfromdatediv1 = true;
            $scope.GetLabRevenueReport(1);
        }
        if (type === "IncentiveEligibleReport") {
            $scope.showIncentiveEligiblReportDiv = true;
            $scope.showDailyReportDivDoc = false;
            $scope.showfromdatediv1 = true;
            $scope.getDoctorsRevenueTreatWise($scope.reportSearch);
        }

        if (type === "IncentiveReport") {
            $scope.showIncentiveReportDiv = true;
            $scope.showDailyReportDivDoc = false;
            $scope.showfromdatediv1 = true;
            $scope.GetIncentiveReport(1);
        }

        if (type === "DynamicSurgeryConvertedReport") {
            $scope.showDynamicSurgeryConvertedReportDiv = true;
            $scope.showDailyReportDivDoc = false;
            $scope.showfromdatediv1 = true;
            $scope.showCategorylistDivDoc = true;
            $scope.GetDynamicSurgeryConvertedReport(1);
        }

        if (type === "TreatmentReport") {
            $scope.showTreatmentReportDiv = true;
            $scope.showDailyReportDivDoc = false;
            $scope.showfromdatediv1 = true;
            $scope.GetTreatmentReport(1);
        }

        if (type === "DailyReport") {
            $scope.showDailyReportDiv1 = true;
            $scope.showDailyReportDiv = true;
            $scope.showDailyReportJobrunDiv = true;
            $scope.showDailyReportDivDoc = true;
            $scope.GetDailyReport(1);
        }

        //if (type === "DayWiseCollection") {
        //    $scope.showDaywisecollectionReportDiv = true;
        //    $scope.GetDaycollectionReport(1);
        //}
        if (type === "Referral Report") {
            $scope.showOPReferralReportDiv = true;
            $scope.GetOPReferralReport(1);
        }
        if (type === "Doctor OPD Report") {
            $scope.showOPDoctorReportDiv = true;
            $scope.GetOPDoctorReport(1);
        }
        if (type === "Patient Category Report") {
            $scope.showOPCategoryReportDiv = true;
            $scope.GetOPCategoryReport(1);
        }

        if (type === "Out Patient Report") {
            $scope.showOutPatientReporttDiv = true;
            $scope.GetOutPatientReport(1);
        }

        if (type === "SmsHistory") {
            $scope.showSmsHistoryDiv = true;
            $scope.showDailyReportDivDoc = true;
            $scope.showexcelexport = false;
            $scope.GetSmsHistoryReport(1);
        }
        if (type === "Doctor Surgery  Report") {
            $scope.showOPSurgeryAppointmentReportDiv = true;
            $scope.GetOPSurgeryAppointmentReport(1);
        }
        if (type === "Surgery Performed Report") {
            $scope.showOPSurgeryPerformedReportDiv = true;
            $scope.showCategorylistDivDoc = true;
            $scope.GetOPSurgeryPerformedReport(1);
        }
        if (type === "Procedure Report") {
            $scope.showOPProcedureReportDiv = true;
            $scope.GetOPProcedureReport(1);
        }
        if (type === "Investigation Report") {
            $scope.showOPInvestigationReportDiv = true;
            $scope.GetOPInvestigationReport(1);
        }
        if (type === "InvestigationAdvisedReport") {
            $scope.showInvestigationAdvisedReportDiv = true;
            $scope.showStatusIdDivDoc = true;
            $scope.GetInvestigationAdvisedReport(1);
        }
        if (type === "surgeryAdvisedReport") {
            $scope.showsurgeryAdvisedReportDiv = true;
            $scope.GetsurgeryAdvisedReport(1);
        }


        if (type === "Surgery Cost Report") {
            $scope.showOPSurgeryCostReportDiv = true;
            $scope.GetOPSurgeryCostReport(1);
        }
        if (type === "Investigation Cost Report") {
            $scope.showOPInvestigationCostReportDiv = true;
            $scope.showDailyReportDivDoc = false;
            $scope.GetOPInvestigationCostReport(1);
        }
        if (type === "Procedure Cost Report") {
            $scope.showOPProcedureCostReportDiv = true;
            $scope.GetOPProcedureCostReport(1);
        }
        if (type === "Lab Report") {
            $scope.showOPLabReportDiv = true;
            $scope.showDailyReportDivDoc = false;
            $scope.GetOPLabReport(1);
        }
        if (type === "Lab Cost Report") {
            $scope.showOPLabCostReportDiv = true;
            $scope.GetOPLabCostReport(1);
        }
        if (type === "Surgery Performed Count Report") {
            $scope.showOPSurgeryPerformedCountReportDiv = true;
            $scope.GetOpSurgeryPerformedCountReport(1);
        }
        if (type === "Investigation Count Report") {
            $scope.showOPInvestigationCountReportDiv = true;
            $scope.GetOpInvestigationCountReport(1);
        }
        if (type === "ReferralWise Cost Report") {
            $scope.showOPReferralWiseCostReportDiv = true;
            $scope.GetOpReferralWiseCostReport(1);
        }
        if (type === "Form3c Report") {
            $scope.showOPForm3CReportDiv = true;
            $scope.showDailyReportDivDoc = false;
            $scope.GetOpForm3CReport(1);
        }
        if (type === "Advance Amount") {
            $scope.showOpAdvanceRevenueDetailDiv = true;
            $scope.GetOpAdvanceRevenueDetailReport(1);
        }

        if (type === "AccountRevenue") {
            $scope.showDailyReportDivDoc = false;
            $scope.showAccountRevenueReportDiv = true;
            $scope.GetAccountRevenueReport(1);
        }
        if (type === "GST Report") {
            $scope.showDailyReportDivDoc = false;
            $scope.showGSTReportDiv = true;
            $scope.GetGSTReport(1);
        }
        if (type === "InsuranceRevenueDetails") {
            $scope.showDailyReportDivDoc = false;
            $scope.showInsuranceRevenueDetailsDiv = true;
            $scope.GetInsuranceRevenueDetails(1);
        }

        if (type === "IndividualDailyReport") {
            $scope.showDailyReportDivDoc = false;
            $scope.showIndividualDailyReportDiv = true;
            $scope.GetIndividualDailyReport(1);
        }
        if (type === "OptomCountReport") {
            $scope.showDailyReportDivDoc = true;
            $scope.showOptomCountReportDivDoc = true;
            $scope.showOptomCountReportDiv = true;
            $scope.GetOptomCountReport(1);
        }
        if (type === "FutureAppointmentsReportByPatient") {
            $scope.showDailyReportDivDoc = false;
            $scope.showDailyReportDiv1 = true;
            $scope.showfromdatediv = true;
            $scope.showfromdatediv1 = false;
            $scope.showFutureAppointmentsReportByPatientDiv = true;
            $scope.GetFutureAppointmentsReportByPatient(1);
        }

        if (type === "AccountExpenses") {
            $scope.showDailyReportDivDoc = true;
            $scope.showAccountExpensesReportDiv = true;
            $scope.GetAccountExpensesReport(1);
        }
        if (type === "Accounts Bank Deposit") {
            $scope.showDailyReportDivDoc = true;
            $scope.showConsolidatedReportDivDoc = true;
            $scope.showAccountsBankDepositReportDiv = true;
            $scope.GetAccountsBankDepositReport(1);
        }
        if (type === "Waived Off Report") {
            $scope.showDailyReportDivDoc = false;
            $scope.showwaivedoffReportDiv = true;
            $scope.GetWaivedOffReport(1);
        }


        if (type === "Department Revenue Report") {
            $scope.showDailyReportDivDoc = false;
            $scope.showDepartmentReportDiv = true;
            $scope.GetDepartmentReport(1);
        }
        if (type === "Investigation") {
            $scope.showDailyReportDivDoc = false;
            $scope.showInvestigationDetailReportDiv = true;
            $scope.GetInvestigationDetailReport(1);
        }
        if (type === "Lab") {
            $scope.showDailyReportDivDoc = false;
            $scope.showLabDetailReportDiv = true;
            $scope.GetLabDetailReport(1);
        }
        if (type === "Surgery") {
            $scope.showDailyReportDivDoc = false;
            $scope.showSurgeryDetailReportDiv = true;
            $scope.GetSurgeryDetailReport(1);
        }
        if (type === "Procedure") {
            $scope.showDailyReportDivDoc = false;
            $scope.showProcedureDetailReportDiv = true;
            $scope.GetProcedureDetailReport(1);
        }
        if (type === "Surgery Count Report ByStatus") {
            $scope.showDailyReportDivDoc = false;
            $scope.showCounselorsDailyReportDivDoc = true;
            $scope.showSurgeryCountReportByStatusDiv = true;
            $scope.GetSurgeryByStatusReport(1);
        }

        if (type === "ConvertedPatientReportByTreatment") {
            $scope.showDailyReportDivDoc = true;
            $scope.showConvertedPatientReportByTreatmentDiv = true;
            $scope.GetConvertedPatientReportByTreatment(1);
        }

        //optical
        if (type === "PurchaseReturns") {
            $scope.showDailyReportDivDoc = true;
            $scope.showPurchaseReturnsReportDiv = true;
            $scope.GetPurchaseReturnsReport(1);
        }
        if (type === "Purchase") {
            $scope.showDailyReportDivDoc = true;
            $scope.showPurchaseReportDiv = true;
            $scope.GetPurchaseReport(1);
        }
        if (type === "Sales") {
            $scope.showDailyReportDivDoc = true;
            $scope.showSalesReportDiv = true;
            // $scope.GetSalesReport(1);
            $scope.GetOpticalSalesDetailReport(1);

        }
        if (type === "SalesReturns") {
            $scope.showDailyReportDivDoc = true;
            $scope.showSalesReturnsReportDiv = true;
            $scope.GetSalesReturnsReport(1);
        }
        if (type === "DeliveredOrder") {
            $scope.showDailyReportDivDoc = true;
            $scope.showDeliveredOrderReportDiv = true;
            $scope.GetDeliveredOrderReport(1);
        }
        if (type === "TotalSales") {
            $scope.showDailyReportDivDoc = true;
            $scope.showTotalSalesDiv = true;
            $scope.GetOpticalSalesHistory(1);
        }
        if (type === "Not-Delivered") {
            $scope.showDailyReportDivDoc = true;
            $scope.showNotDeliveredOrderReportDiv = true;
            $scope.GetNotDeliveredReport(1);
        }
        if (type === "OutstandingReport") {
            $scope.showDailyReportDivDoc = true;
            $scope.showOutstandingReportReportDiv = true;
            $scope.GetOutstandingReport(1);
        }
        if (type === "GlassConvertionReport") {
            $scope.showDailyReportDivDoc = true;
            $scope.showGlassConvertionReportDiv = true;
            $scope.GetGlassConvertionReport(1);
        }

        if (type === "AdvicedGlassReportByConsultation ") {
            $scope.showDailyReportDivDoc = false;
            $scope.showAdvicedGlassReportByConsultationDiv = true;
            $scope.GetAdvicedGlassReportByConsultation(1);
        }

        //pharmacy
        if (type === "Pharmacy-Purchases") {
            $scope.showDailyReportDivDoc = true;
            $scope.showPharmacyPurchaseReportDiv = true;
            $scope.GetPharmacyPurchaseReport(1);
        }
        if (type === "Pharmacy Purchases Returns") {
            $scope.showDailyReportDivDoc = true;
            $scope.showPharmacyPurchaseReturnsReportDiv = true;
            $scope.GetPharmacyPurchaseReturnsReport(1);
        }
        if (type === "Pharmacy Sales") {
            $scope.showDailyReportDivDoc = true;
            $scope.showPharmacySalesReportDiv = true;
            // $scope.GetPharmacySalesReport(1);
            $scope.GetPharmaSalesDetailReport(1);

        }
        if (type === "Pharmacy Sale Return") {
            $scope.showDailyReportDivDoc = true;
            $scope.showPharmacySaleReturnReportDiv = true;
            $scope.GetPharmacySaleReturnReport(1);
        }
        if (type === "SalesReportByProduct") {
            $scope.showDailyReportDivDoc = true;
            $scope.showSalesReportByProducttDiv = true;
            $scope.GetPharmaSalesReportByProductReport(1);
        }
        if (type === "PurchaseReportByGST") {
            $scope.showDailyReportDivDoc = true;
            $scope.showPurchaseReportByGSTDiv = true;
            $scope.GetPharmaPurchaseReportByGST(1);
        }
        if (type === "SaleReportByGST") {
            $scope.showDailyReportDivDoc = true;
            $scope.showSaleReportByGSTDiv = true;
            $scope.GetPharmaSaleReportByGST(1);
        }
        if (type === "ConvertedPrscptnReport") {
            $scope.showDailyReportDivDoc = true;
            $scope.showexcelexport = false;
            $scope.showPharmacyConvertedPrscptnReportDiv = true;
            $scope.GetPharmacyConvertedPrscptnReport(1);
        }

        if (type === "AdvicedPrscptnReportByConSultation") {
            $scope.showDailyReportDivDoc = true;
            $scope.showexcelexport = true;
            $scope.showPharmacyAdvicedPrscptnReportByConSultationDiv = true;
            $scope.GetPharmaAdvicedPrscptnReportByConSultation(1);
        }
        if (type === "PharmaExpiryStockReport") {
            $scope.showDailyReportDivDoc = true;
            $scope.showDailyReportDiv1 = true;
            $scope.showfromdatediv1 = false;
            $scope.showfromdatediv = false;
            $scope.showDiagnosisSearchTextDiv = true;
            $scope.showPharmaExpiryStockReportDiv = true;
            $scope.GetPharmaExpiryStockReport(1);
        }
        if (type === "PharmaReadyToExpireStockReport") {
            $scope.showDailyReportDivDoc = true;
            $scope.showDiagnosisSearchTextDiv = true;
            $scope.showDailyReportDiv1 = true;
            $scope.ShowReadyToExpirediv = true;
            $scope.showPharmaReadyToExpireStockReportDiv = true;
            $scope.GetPharmaReadyToExpireStockReport(1);
        }
        if (type === "pharmaNonMovingStockReport") {
            $scope.showDailyReportDivDoc = true;
            //$scope.showDiagnosisSearchTextDiv = true;
            $scope.showPharmaNonMovingStockReportDiv = true;
            $scope.GetpharmaNonMovingStockReport(1);
        }




        if (type === "Diagnosis Report") {
            $scope.showDailyReportDivDoc = true;
            $scope.showDiagnosisReportDiv = true;
            $scope.showDiagnosisSearchTextDiv = true;
            $scope.GetDiagnosisReport(1);
        }
        if (type === "Consolidated Incentive Report") {
            $scope.showDailyReportDivDoc = false;
            $scope.showConsolidatedReportDivDoc = true;
            $scope.showConsolidatedIncentiveReporttDiv = true;
            $scope.showConversionDailyReportDivDoc = true;
            $scope.GetConsolidatedIncentiveReport(1);
        }
    };



    $scope.changeReportDate2 = function (item) {
        if (item != undefined) {
            $scope.reportSearch.FromDate = item;
            $scope.reportSearch.FromDate = $filter("dateFormatter")($scope.reportSearch.FromDate, "-");
        }
    };
    function backToUserLocationId() {
        $scope.ApptBranchLocations.forEach(hItem => {
            hItem.IsChecked = hItem.ClinicId === $scope.HospitalId;
        });
        updateLocationString();
        return $scope.ApptBranchLocations.filter(item => item.ClinicId !== 0);
    }

    $scope.navtoMainReportScreen = function () {
        backToUserLocationId();
        $scope.showfromdatediv1 = true;
        $scope.showfromdatediv = false;
        $scope.showDailyReportDiv1 = false;

        $scope.showMainReportsScreen = true;
        $scope.showComingSoonDiv = false;
        $scope.showIncentiveEligiblReportDiv = false;
        $scope.showIncentiveReportDiv = false;
        $scope.showDynamicSurgeryConvertedReportDiv = false;
        $scope.showTreatmentReportDiv = false;
        $scope.showDailyReportDiv = false;
        $scope.showDaywisecollectionReportDiv = false;
        $scope.showOPReferralReportDiv = false;
        $scope.showOPDoctorReportDiv = false;
        $scope.showOPCategoryReportDiv = false;
        $scope.showOutPatientReporttDiv = false;
        $scope.showOPSurgeryAppointmentReportDiv = false;
        $scope.showOPSurgeryPerformedReportDiv = false;
        $scope.showOPProcedureReportDiv = false;
        $scope.showOPInvestigationReportDiv = false;
        $scope.showOPSurgeryCostReportDiv = false;
        $scope.showOPInvestigationCostReportDiv = false;
        $scope.showOPProcedureCostReportDiv = false;
        $scope.showOPLabReportDiv = false;
        $scope.showOPLabCostReportDiv = false;
        $scope.showOPSurgeryPerformedCountReportDiv = false;
        $scope.showOPInvestigationCountReportDiv = false;
        $scope.showOPReferralWiseCostReportDiv = false;
        $scope.showOPForm3CReportDiv = false;
        $scope.showOpAdvanceRevenueDetailDiv = false;
        $scope.showAccountRevenueReportDiv = false;
        $scope.showAccountExpensesReportDiv = false;
        $scope.showAccountsBankDepositReportDiv = false;
        $scope.showwaivedoffReportDiv = false;
        $scope.showGSTReportDiv = false;
        $scope.showInsuranceRevenueDetailsDiv = false;
        $scope.showIndividualDailyReportDiv = false;
        $scope.showOptomCountReportDiv = false;
        $scope.showFutureAppointmentsReportByPatientDiv = false;

        $scope.showDepartmentReportDiv = false;
        $scope.showInvestigationDetailReportDiv = false;
        $scope.showLabDetailReportDiv = false;
        $scope.showSurgeryDetailReportDiv = false;
        $scope.showProcedureDetailReportDiv = false;
        $scope.showSurgeryCountReportByStatusDiv = false;

        $scope.showConvertedPatientReportByTreatmentDiv = false;
        $scope.showPurchaseReturnsReportDiv = false;
        $scope.showPurchaseReportDiv = false;
        $scope.showSalesReportDiv = false;
        $scope.showSalesReturnsReportDiv = false;
        $scope.showDeliveredOrderReportDiv = false;
        $scope.showNotDeliveredOrderReportDiv = false;
        $scope.showOutstandingReportReportDiv = false;
        $scope.showGlassConvertionReportDiv = false;
        $scope.showAdvicedGlassReportByConsultationDiv = false;

        $scope.showPharmacyPurchaseReportDiv = false;
        $scope.showPharmacyPurchaseReturnsReportDiv = false;
        $scope.showPharmacySalesReportDiv = false;
        $scope.showPharmacySaleReturnReportDiv = false;
        $scope.showSalesReportByProducttDiv = false;
        $scope.showPurchaseReportByGSTDiv = false;
        $scope.showSaleReportByGSTDiv = false;
        $scope.showPharmacyConvertedPrscptnReportDiv = false;
        $scope.showPharmacyAdvicedPrscptnReportByConSultationDiv = false;
        $scope.showPharmaExpiryStockReportDiv = false;
        $scope.showPharmaReadyToExpireStockReportDiv = false;
        $scope.showPharmaNonMovingStockReportDiv = false;
        $scope.ShowReadyToExpirediv = false;



        $scope.showDiagnosisReportDiv = false;
        $scope.showConsolidatedIncentiveReporttDiv = false;
        $scope.Category = null;
        $scope.clearReportSearch();
    };

    $scope.searchPatientAppointmentList = function (txt) {

        txt = txt || "";
        if (txt === "") {
            $scope.searchPatientTxt = "";

        } else {
            if (txt.length > 3 && !isNaN(txt)) {
                $scope.searchPatientTxt = txt;

            }
        }

    };


    $scope.getReportExport = function () {
        if ($scope.showIncentiveReportDiv) {
            $scope.GetIncentiveReport(1, 'export');
        }
        if ($scope.showDynamicSurgeryConvertedReportDiv) {
            $scope.GetDynamicSurgeryConvertedReport(1, 'export');
        }
        if ($scope.showTreatmentReportDiv) {
            $scope.GetTreatmentReport(1, 'export');
        }
        if ($scope.showDailyReportDiv) {
            $scope.GetDailyReport(1, 'export');
        }
        //if ($scope.showDaywisecollectionReportDiv ) {
        //    $scope.GetDaycollectionReport(1, 'export'); 
        //}
        if ($scope.showTreatmentRevenueReportDiv) {
            $scope.GetTreatmentRevenueReport(1, 'export');
        }
        if ($scope.showOutPatientReVenueReportDiv) {
            $scope.GetOutPatientReVenueReport(1, 'export');
        }
        if ($scope.showSurgeryRevenueReportDiv) {
            $scope.GetSurgeryRevenueReport(1, 'export');
        }
        if ($scope.showInvestigationRevenueReportDiv) {
            $scope.GetInvestigationRevenueReport(1, 'export');
        }
        if ($scope.showLabRevenueReportDiv) {
            $scope.GetLabRevenueReport(1, 'export');
        }
        if ($scope.showOPReferralReportDiv) {
            $scope.GetOPReferralReport(1, 'export');
        }
        if ($scope.showOPDoctorReportDiv) {
            $scope.GetOPDoctorReport(1, 'export');
        }
        if ($scope.showOPCategoryReportDiv) {
            $scope.GetOPCategoryReport(1, 'export');
        }
        if ($scope.showOutPatientReporttDiv) {
            $scope.GetOutPatientReport(1, 'export');
        }
        if ($scope.showOPSurgeryAppointmentReportDiv) {
            $scope.GetOPSurgeryAppointmentReport(1, 'export');
        }
        if ($scope.showOPSurgeryPerformedReportDiv) {
            $scope.GetOPSurgeryPerformedReport(1, 'export');
        }
        if ($scope.showOPProcedureReportDiv) {
            $scope.GetOPProcedureReport(1, 'export');
        }
        if ($scope.showOPInvestigationReportDiv) {
            $scope.GetOPInvestigationReport(1, 'export');
        }
        if ($scope.showInvestigationAdvisedReportDiv) {
            $scope.GetInvestigationAdvisedReport(1, 'export');
        }
        if ($scope.showsurgeryAdvisedReportDiv) {
            $scope.GetsurgeryAdvisedReport(1, 'export');
        }
        if ($scope.showOPSurgeryCostReportDiv) {
            $scope.GetOPSurgeryCostReport(1, 'export');
        }
        if ($scope.showOPInvestigationCostReportDiv) {
            $scope.GetOPInvestigationCostReport(1, 'export');
        }
        if ($scope.showOPProcedureCostReportDiv) {
            $scope.GetOPProcedureCostReport(1, 'export');
        }
        if ($scope.showOPLabReportDiv) {
            $scope.GetOPLabReport(1, 'export');
        }
        if ($scope.showOPLabCostReportDiv) {
            $scope.GetOPLabCostReport(1, 'export');
        }
        if ($scope.showOPSurgeryPerformedCountReportDiv) {
            $scope.GetOpSurgeryPerformedCountReport(1, 'export');
        }
        if ($scope.showOPInvestigationCountReportDiv) {
            $scope.GetOpInvestigationCountReport(1, 'export');
        }
        if ($scope.showOPReferralWiseCostReportDiv) {
            $scope.GetOpReferralWiseCostReport(1, 'export');
        }
        if ($scope.showOPForm3CReportDiv) {
            $scope.GetOpForm3CReport(1, 'export');
        }
        if ($scope.showOpAdvanceRevenueDetailDiv) {
            $scope.GetOpAdvanceRevenueDetailReport(1, 'export');
        }
        if ($scope.showAccountRevenueReportDiv) {
            $scope.GetAccountRevenueReport(1, 'export');
        }
        if ($scope.showAccountExpensesReportDiv) {
            $scope.GetAccountExpensesReport(1, 'export');
        }
        if ($scope.showAccountsBankDepositReportDiv) {
            $scope.GetAccountsBankDepositReport(1, 'export');
        }
        if ($scope.showwaivedoffReportDiv) {
            $scope.GetWaivedOffReport(1, 'export');
        }
        if ($scope.showGSTReportDiv) {
            $scope.GetGSTReport(1, 'export');
        }
        if ($scope.showInsuranceRevenueDetailsDiv) {
            $scope.GetInsuranceRevenueDetails(1, 'export');
        }
        if ($scope.showIndividualDailyReportDiv) {
            $scope.GetIndividualDailyReport(1, 'export');
        }
        if ($scope.showOptomCountReportDiv) {
            $scope.GetOptomCountReport(1, 'export');
        }
        if ($scope.showFutureAppointmentsReportByPatientDiv) {
            $scope.GetFutureAppointmentsReportByPatient(1, 'export');
        }

        if ($scope.showDepartmentReportDiv) {
            $scope.GetDepartmentReport(1, 'export');
        }
        if ($scope.showInvestigationDetailReportDiv) {
            $scope.GetInvestigationDetailReport(1, 'export');
        }
        if ($scope.showLabDetailReportDiv) {
            $scope.GetLabDetailReport(1, 'export');
        }
        if ($scope.showSurgeryDetailReportDiv) {
            $scope.GetSurgeryDetailReport(1, 'export');
        }
        if ($scope.showProcedureDetailReportDiv) {
            $scope.GetProcedureDetailReport(1, 'export');
        }
        if ($scope.showSurgeryCountReportByStatusDiv) {
            $scope.GetSurgeryByStatusReport(1, 'export');
        }

        if ($scope.showConvertedPatientReportByTreatmentDiv) {
            $scope.GetConvertedPatientReportByTreatment(1, 'export');
        }
        if ($scope.showPurchaseReturnsReportDiv) {
            $scope.GetPurchaseReturnsReport(1, 'export');
        }
        if ($scope.showPurchaseReportDiv) {
            $scope.GetPurchaseReport(1, 'export');
        }
        if ($scope.showSalesReportDiv) {
            //$scope.GetSalesReport(1, 'export');
            $scope.GetOpticalSalesDetailReport(1, 'export');

        }
        if ($scope.showSalesReturnsReportDiv) {
            $scope.GetSalesReturnsReport(1, 'export');
        }
        if ($scope.showDeliveredOrderReportDiv) {
            $scope.GetDeliveredOrderReport(1, 'export');
        }
        if ($scope.showTotalSalesDiv) {
            $scope.GetOpticalSalesHistory(1, 'export');
        }
        if ($scope.showNotDeliveredOrderReportDiv) {
            $scope.GetNotDeliveredReport(1, 'export');
        }
        if ($scope.showOutstandingReportReportDiv) {
            $scope.GetOutstandingReport(1, 'export');
        }
        if ($scope.showGlassConvertionReportDiv) {
            $scope.GetGlassConvertionReport(1, 'export');
        }

        if ($scope.showAdvicedGlassReportByConsultationDiv) {
            $scope.GetAdvicedGlassReportByConsultation(1, 'export');
        }

        if ($scope.showPharmacyPurchaseReportDiv) {
            $scope.GetPharmacyPurchaseReport(1, 'export');
        }
        if ($scope.showPharmacyPurchaseReturnsReportDiv) {
            $scope.GetPharmacyPurchaseReturnsReport(1, 'export');
        }
        if ($scope.showPharmacySalesReportDiv) {
            // $scope.GetPharmacySalesReport(1, 'export');
            $scope.GetPharmaSalesDetailReport(1, 'export');
        }
        if ($scope.showPharmacySaleReturnReportDiv) {
            $scope.GetPharmacySaleReturnReport(1, 'export');
        }
        if ($scope.showSalesReportByProducttDiv) {
            $scope.GetPharmaSalesReportByProductReport(1, 'export');
        }
        if ($scope.showPurchaseReportByGSTDiv) {
            $scope.GetPharmaPurchaseReportByGST(1, 'export');
        }
        if ($scope.showSaleReportByGSTDiv) {
            $scope.GetPharmaSaleReportByGST(1, 'export');
        }
        if ($scope.showPharmacyConvertedPrscptnReportDiv) {
            $scope.GetPharmacyConvertedPrscptnReport(1, 'export');
        }
        if ($scope.showPharmacyAdvicedPrscptnReportByConSultationDiv) {
            $scope.GetPharmaAdvicedPrscptnReportByConSultation(1, 'export');
        }
        if ($scope.showPharmaExpiryStockReportDiv) {
            $scope.GetPharmaExpiryStockReport(1, 'export');
        }
        if ($scope.showPharmaReadyToExpireStockReportDiv) {
            $scope.GetPharmaReadyToExpireStockReport(1, 'export');
        }
        if ($scope.showPharmaNonMovingStockReportDiv) {
            $scope.GetpharmaNonMovingStockReport(1, 'export');
        }



        if ($scope.showDiagnosisReportDiv) {
            $scope.GetDiagnosisReport(1, 'export');
        }

        if ($scope.showConsolidatedIncentiveReporttDiv) {
            $scope.GetConsolidatedIncentiveReport(1, 'export');
        }
    };

    $scope.changeReportDate = function () {
        if ($scope.showIncentiveReportDiv) {
            $scope.GetIncentiveReport(1);
        }
        if ($scope.showDynamicSurgeryConvertedReportDiv) {
            $scope.GetDynamicSurgeryConvertedReport(1);
        }
        if ($scope.showTreatmentReportDiv) {
            $scope.GetTreatmentReport(1);
        }
        if ($scope.showDailyReportDiv) {
            $scope.GetDailyReport(1);
        }
        //if ($scope.showDaywisecollectionReportDiv ) {
        //    $scope.GetDaycollectionReport(1);
        //}
        if ($scope.showTreatmentRevenueReportDiv) {
            $scope.GetTreatmentRevenueReport(1);
        }
        if ($scope.showOutPatientReVenueReportDiv) {
            $scope.GetOutPatientReVenueReport(1);
        }
        if ($scope.showSurgeryRevenueReportDiv) {
            $scope.GetSurgeryRevenueReport(1);
        }
        if ($scope.showInvestigationRevenueReportDiv) {
            $scope.GetInvestigationRevenueReport(1);
        }
        if ($scope.showLabRevenueReportDiv) {
            $scope.GetLabRevenueReport(1);
        }

        if ($scope.showOPReferralReportDiv) {
            $scope.GetOPReferralReport(1);
        }
        if ($scope.showOPDoctorReportDiv) {
            $scope.GetOPDoctorReport(1);
        }
        if ($scope.showOPCategoryReportDiv) {
            $scope.GetOPCategoryReport(1);
        }
        if ($scope.showOutPatientReporttDiv) {
            $scope.GetOutPatientReport(1);
        }
        if ($scope.showOPSurgeryAppointmentReportDiv) {
            $scope.GetOPSurgeryAppointmentReport(1);
        }
        if ($scope.showOPSurgeryPerformedReportDiv) {
            $scope.GetOPSurgeryPerformedReport(1);
        }
        if ($scope.showOPProcedureReportDiv) {
            $scope.GetOPProcedureReport(1);
        }
        if ($scope.showOPInvestigationReportDiv) {
            $scope.GetOPInvestigationReport(1);
        }
        if ($scope.showInvestigationAdvisedReportDiv) {
            $scope.GetInvestigationAdvisedReport(1);
        }
        if ($scope.showsurgeryAdvisedReportDiv) {
            $scope.GetsurgeryAdvisedReport(1);
        }

        if ($scope.showOPSurgeryCostReportDiv) {
            $scope.GetOPSurgeryCostReport(1);
        }
        if ($scope.showOPInvestigationCostReportDiv) {
            $scope.GetOPInvestigationCostReport(1);
        }
        if ($scope.showOPProcedureCostReportDiv) {
            $scope.GetOPProcedureCostReport(1);
        }
        if ($scope.showOPLabReportDiv) {
            $scope.GetOPLabReport(1);
        }
        if ($scope.showOPLabCostReportDiv) {
            $scope.GetOPLabCostReport(1);
        }
        if ($scope.showOPSurgeryPerformedCountReportDiv) {

            $scope.GetOpSurgeryPerformedCountReport(1);
        }
        if ($scope.showOPInvestigationCountReportDiv) {
            $scope.GetOpInvestigationCountReport(1);
        }
        if ($scope.showOPReferralWiseCostReportDiv) {
            $scope.GetOpReferralWiseCostReport(1);
        }

        if ($scope.showOPForm3CReportDiv) {
            $scope.GetOpForm3CReport(1);
        }
        if ($scope.showOpAdvanceRevenueDetailDiv) {
            $scope.GetOpAdvanceRevenueDetailReport(1);
        }
        if ($scope.showAccountRevenueReportDiv) {
            $scope.GetAccountRevenueReport(1);
        }
        if ($scope.showAccountExpensesReportDiv) {
            $scope.GetAccountExpensesReport(1);
        }
        if ($scope.showAccountsBankDepositReportDiv) {
            $scope.GetAccountsBankDepositReport(1);
        }
        if ($scope.showwaivedoffReportDiv) {
            $scope.GetWaivedOffReport(1);
        }
        if ($scope.showGSTReportDiv) {
            $scope.GetGSTReport(1);
        }
        if ($scope.showInsuranceRevenueDetailsDiv) {
            $scope.GetInsuranceRevenueDetails(1);
        }
        if ($scope.showIndividualDailyReportDiv) {
            $scope.GetIndividualDailyReport(1);
        }
        if ($scope.showOptomCountReportDiv) {
            $scope.GetOptomCountReport(1);
        }
        if ($scope.showFutureAppointmentsReportByPatientDiv) {
            $scope.GetFutureAppointmentsReportByPatient(1);
        }
        if ($scope.showDepartmentReportDiv) {
            $scope.GetDepartmentReport(1);
        }
        if ($scope.showInvestigationDetailReportDiv) {
            $scope.GetInvestigationDetailReport(1);
        }
        if ($scope.showLabDetailReportDiv) {
            $scope.GetLabDetailReport(1);
        }
        if ($scope.showSurgeryDetailReportDiv) {
            $scope.GetSurgeryDetailReport(1);
        }
        if ($scope.showProcedureDetailReportDiv) {
            $scope.GetProcedureDetailReport(1);
        }
        if ($scope.showSurgeryCountReportByStatusDiv) {
            $scope.GetSurgeryByStatusReport(1);
        }

        if ($scope.showConvertedPatientReportByTreatmentDiv) {
            $scope.GetConvertedPatientReportByTreatment(1);
        }
        if ($scope.showPurchaseReturnsReportDiv) {
            $scope.GetPurchaseReturnsReport(1);
        }
        if ($scope.showPurchaseReportDiv) {
            $scope.GetPurchaseReport(1);
        }
        if ($scope.showSalesReportDiv) {
            //$scope.GetSalesReport(1);
            $scope.GetOpticalSalesDetailReport(1);

        }
        if ($scope.showSalesReturnsReportDiv) {
            $scope.GetSalesReturnsReport(1);
        }
        if ($scope.showDeliveredOrderReportDiv) {
            $scope.GetDeliveredOrderReport(1);
        }
        if ($scope.showTotalSalesDiv) {
            $scope.GetOpticalSalesHistory(1);
        }
        if ($scope.showNotDeliveredOrderReportDiv) {
            $scope.GetNotDeliveredReport(1);
        }
        if ($scope.showOutstandingReportReportDiv) {
            $scope.GetOutstandingReport(1);
        }
        if ($scope.showGlassConvertionReportDiv) {
            $scope.GetGlassConvertionReport(1);
        }
        if ($scope.showAdvicedGlassReportByConsultationDiv) {
            $scope.GetAdvicedGlassReportByConsultation(1);
        }

        if ($scope.showPharmacyPurchaseReportDiv) {
            $scope.GetPharmacyPurchaseReport(1);
        }
        if ($scope.showPharmacyPurchaseReturnsReportDiv) {
            $scope.GetPharmacyPurchaseReturnsReport(1);
        }
        if ($scope.showPharmacySalesReportDiv) {
            // $scope.GetPharmacySalesReport(1);
            $scope.GetPharmaSalesDetailReport(1);
        }
        if ($scope.showPharmacySaleReturnReportDiv) {
            $scope.GetPharmacySaleReturnReport(1);
        }
        if ($scope.showSalesReportByProducttDiv) {
            $scope.GetPharmaSalesReportByProductReport(1);
        }
        if ($scope.showPurchaseReportByGSTDiv) {
            $scope.GetPharmaPurchaseReportByGST(1);
        }

        if ($scope.showSaleReportByGSTDiv) {
            $scope.GetPharmaSaleReportByGST(1);
        }
        if ($scope.showPharmacyConvertedPrscptnReportDiv) {
            $scope.GetPharmacyConvertedPrscptnReport(1);
        }
        if ($scope.showPharmacyAdvicedPrscptnReportByConSultationDiv) {
            $scope.GetPharmaAdvicedPrscptnReportByConSultation(1);
        }
        if ($scope.showPharmaExpiryStockReportDiv) {
            $scope.GetPharmaExpiryStockReport(1);
        }
        if ($scope.showPharmaReadyToExpireStockReportDiv) {
            $scope.GetPharmaReadyToExpireStockReport(1);
        }
        if ($scope.showPharmaNonMovingStockReportDiv) {
            $scope.GetpharmaNonMovingStockReport(1);
        }


        if ($scope.showDiagnosisReportDiv) {
            $scope.GetDiagnosisReport(1);
        }

        if ($scope.showConsolidatedIncentiveReporttDiv) {
            $scope.GetConsolidatedIncentiveReport(1);
        }
        if ($scope.showSmsHistoryDiv) {
            $scope.GetSmsHistoryReport(1);
        }
    };

    $scope.HideContent = function (pageno, reportType, modeType, data) {
        data.ContentShow = !data.ContentShow;
    };
    $scope.ShowContent = function (pageno, reportType, modeType, data) {

        angular.forEach($scope.DailyReportArray, function (data, index) {
            data.ContentShow = false;
        });

        data.ContentShow = !data.ContentShow;

        //var date = new Date();
        if (data.ContentShow) {
            $scope.modeType = modeType;
            var data = JSON.parse(data.Details);
            $scope.DailyBillingDetails = data;
            $scope.TotalDailyBillingDetailsCount = data.length;
        }

    };


    //$scope.getDailyPaymentDetails = function (pageno, reportType, date, modeType, data) {
    //    data.ContentShow = !data.ContentShow;

    //    var date = new Date();
    //    //var date = $scope.Object.StartDate;
    //    $scope.modeType = modeType;
    //    var params = {
    //        "DoctorId": $scope.SelectedDoctor === undefined || $scope.SelectedDoctor === null ? 0 : $scope.SelectedDoctor.DoctorID,
    //        "HospitalsList": $scope.reportSearch.HospitalId, 
    //        "Date": date,
    //        "PageSize": reportType === "export" ? $scope.exportMaxSize : $scope.maxSize,
    //        "PageNo": pageno,
    //        //"GetAllIndicator": $scope.GetAllIndicator,
    //        "PaymentModeType": modeType
    //    };
    //    eHnoteMainDashboardDataServices.GetDailyBillingDetailInfo(params).then(function (resp) {
    //        $scope.DailyBillingDetails = [];
    //        $scope.DailyBillingDetails = resp.data;
    //        $scope.TotalDailyBillingDetailsCount = resp.data.count;    
    //        //GetDailyBillingDetailInfo
    //    }, function (err) {
    //        console.log(err);
    //        alertify.error(err.data.Message);
    //    });
    //};

    $scope.Date = null;
    $scope.Jobrun = function () {
        eHnoteAccountUserServices.GetAccountsCashBalanceJob($scope.hospitalid1, $scope.Date, onSuccessBranches, onFailedBranches);
        function onSuccessBranches(data) {

            $scope.branchDashboard = data;
            $scope.GetDailyReport();
            //alertify.success("Successfully Run Job");
            alertify.success(data.message);
        }
        function onFailedBranches(data) {
            alertify.error(data.message);
        }
    };

    //function Dashboardlist2() {
    //    $scope.currentDate = new Date();
    //    $scope.currentTime = new Date().getTime();


    //}
    //Dashboardlist2();

    $interval(callAtInterval, 60000);

    function callAtInterval() {
        var Hours = new Date().getHours();


        //if (Hours >= 19 && Hours <= 10) {
        //    $scope.ShowJob = true;
        //} else {
        //    $scope.ShowJob = false;
        //}


        if (Hours >= 19) {
            $scope.ShowJob = true;
        }
        else if (Hours <= 10) {
            $scope.ShowJob = true;
        } else {
            $scope.ShowJob = false;
        }
    }



    //$scope.navtoPharmacyReport = function () {
    //    var url = "";
    //    url = "/Pharmacy";
    //    $location.url(url);
    //    $timeout(function () {
    //        $rootScope.$broadcast("ShowDashboard", true);
    //    }, 300);
    //};

    //$scope.navtoOpticalReport = function () {
    //    //var url = "";
    //    //$rootScope.$broadcast("ShowDashboardOptical", true);
    //    //url = "/Optical";
    //    //$location.url(url);
    //    var url = "";
    //    url = "/Optical";
    //    $location.url(url);
    //    $timeout(function () {
    //        $rootScope.$broadcast("ShowDashboardOptical", true);
    //    }, 300);
    //};
    $scope.showdentalDashBordDetailsDiv = false;
    $scope.navtoDentalDashBoardReport = function (type, exportType) {
        //$rootScope.$broadcast("GetreportData", type);
        $scope.viewtype1 = type;
        $scope.showdentalDashBordDetailsDiv = true;
        $scope.showMainReportsScreen = false;
        $scope.showComingSoonDiv = true;
        var obj = { "type": type };
        ReportUtilites.setLeadData(obj);

        //$rootScope.$on("CallAppointmentList", function (type) {
        //    $scope.viewtype1 = type;
        //}

    };

    $scope.showDashBoard1 = function (val) {

        $scope.showDashBordDetailsDiv = false;
        $scope.showdentalDashBordDetailsDiv = false;
        $scope.showMainReportsScreen = true;
        $scope.SelectedDoctor = null;

        //$scope.getDoctorInfoByHospitalId(val);
    };


    //Access Code Added by durga as on 02-10-2019

    var windowObjectReference;
    $scope.BaseUrl = "https://ehnote-reportviewer.azurewebsites.net/reportviewer.aspx?ParentOrganizationId=";//dev       
    $scope.chnageReport = function (reportName) {

        $scope.ReportName = reportName;
        //$scope.SubSpecializationName = "";
        //$scope.Suborganization = "";

        $scope.SSRSReportUrl = $scope.BaseUrl + $scope.UrlparentHospitalId + "&reportName=" + $scope.ReportName + "&rs:Command=Render&rs:Embed=true";


        var strWindowFeatures = "menubar=no,location=no,resizable=yes,scrollbars=yes,status=yes,width=560,height=400,left=10,top=150";
        windowObjectReference = $window.open($scope.SSRSReportUrl, "Report Viewer", strWindowFeatures);


    };
    $scope.ShowSSRSScreen = false;
    $scope.navtoSSRSReportScreen = function () {
        $scope.ShowSSRSScreen = false;
    };

    //$scope.changeNewSubOrganization = function (val) {
    //    var SubOrganizationId = val.SubOrganizationId;
    //    GetBranchSubSpecializations(SubOrganizationId, $scope.selectedBranch.BranchId);
    //};

    $scope.getAllBranchesBySubOrganizationId = function (subOrganizationId) {
        eHnoteMainAppointmentService.getAllBranchesBySubOrganizationId(subOrganizationId, onHospitalListSuccess, OnHospitalListFailed);
        function onHospitalListSuccess(data) {
            if (data.rows.length > 0) {
                $scope.allBranchesArray = [];
                $scope.allBranchesArray = data.rows;
                initializeNewBranches($scope.allBranchesArray);
            } else {
                $scope.allBranchesArray = [];
            }
        }
        function OnHospitalListFailed(error) {
            console.log(error);
        }
    };

    $scope.getAllReportBranchesBySubOrganizationId = function (subOrganizationId) {
        eHnoteMainAppointmentService.getAllBranchesBySubOrganizationId(subOrganizationId, onHospitalListSuccess, OnHospitalListFailed);
        function onHospitalListSuccess(data) {
            if (data.rows.length > 0) {
                $scope.allBranchesArray = [];
                $scope.allBranchesArray = data.rows;
                initializeReportNewBranches($scope.allBranchesArray);
            } else {
                $scope.allBranchesArray = [];
            }
        }
        function OnHospitalListFailed(error) {
            console.log(error);
        }
    };

    $scope.changeNewSubOrganization = function (val) {

        $scope.SubOrganizationIdsList  = [];

        $scope.loadType = "onChange";

        if (val === null) {
            $scope.SubOrganizationIdsList = GetAllSubOrganizationIds();
            $scope.HospitalIdsList = GetAllHospitalIds();
            $scope.GetAllIndicator = 1;
            $scope.SelectedHospital = null;
            $scope.SubOrganizationId = 0;
            var BranchId = 0;
            $scope.SelectedDepartment = "";
            $scope.SubDepartmentId = "";
            getDoctorsbySubSpecializations(BranchId);
        } else {
            $scope.SubOrganizationId = val.SubOrganizationId;
            $scope.getAllBranchesBySubOrganizationId($scope.SubOrganizationId);
            $scope.SubOrganizationIdsList.push(val.SubOrganizationId);
            $scope.GetAllIndicator = 0;
            GetBranchSubSpecializations($scope.SubOrganizationId, $scope.selectedBranch.BranchId);
        }

    };

    $scope.changeNewDepartment = function (val) {

        $scope.SubDepartmentIdsList = [];

        if (val === null) {
            $scope.SubDepartmentId = "";
            $scope.SubDepartmentIdsList = GetAllDepartmentIds();
            $scope.GetAllIndicator = 1;
            getDoctorsbySubSpecializations($scope.selectedBranch.BranchId);



            // $scope.GetMainDashBoardDetails($scope.HospitalIdsList, doctorinfo.doctordata.User[0].DoctorID, $scope.SubOrganizationIdsList, $scope.SubDepartmentIdsList);

        } else {

            $scope.SubDepartmentId = val.SubSpecializationId;
            $scope.SubDepartmentIdsList.push(val.SubSpecializationId);
            $scope.GetAllIndicator = 0;
            getDoctorsbySubSpecializations($scope.selectedBranch.BranchId);
        }

    };

    $scope.ChangeNewDepartmentList = function (item) {
        $scope.reportSearch.DepartmentObj = item;
        $scope.reportSearch.DepartmentId = item.SubSpecializationId;
        // getDoctorsbySubSpecializations($scope.selectedBranch.BranchId);

        getDoctorsbySubSpecializationsForReports($scope.selectedBranch.BranchId);
    };

    $scope.searchMainReports = function () {
        $scope.hospitalClinicIds = $scope.ApptBranchLocations.filter(hitem => hitem.IsChecked == true && hitem.ClinicId != 0).map(h => h.ClinicId).join(',');        
        $scope.GetMainDashBoardDetails($scope.hospitalClinicIds, $scope.selectedDoctor === null ? 0 : $scope.selectedDoctor.DoctorID, $scope.SubOrganizationIdsList, $scope.SubDepartmentIdsList);
        if ($scope.showDashBordDetailsDiv && $scope.viewtype == 'WalkinAppointmentsDashBoard') {
            getWalkinApptDetails($scope.hospitalClinicIds);
        }

        if ($scope.showDashBordDetailsDiv && $scope.viewtype == 'CancelledAppointmentsDetails') {
            getCancelledApptDetails($scope.hospitalClinicIds);
        }

        if ($scope.showDashBordDetailsDiv && $scope.viewtype == 'NoShowAppointmentDetails') {
            getNoShowApptDetails($scope.hospitalClinicIds);
        }

        if ($scope.showDashBordDetailsDiv && $scope.viewtype == 'SameDayCancelledAppointmentsDetails') {
            GetSameDayCancelAppointmentDetails($scope.hospitalClinicIds);
        }

        if ($scope.showDashBordDetailsDiv && $scope.viewtype == 'SeenAppointmentsDashBoard') {
            GetSeenAppointmentDetails($scope.hospitalClinicIds);
        }

        if ($scope.showDashBordDetailsDiv && $scope.viewtype == 'SameDayCheckedInCancelledAppointmentsDetails') {
            GetSameDayCheckedInCancelledAppointmentDetails($scope.hospitalClinicIds)
        }

        // to be moved to prod - worked on 28-09-2023

        if ($scope.showDashBordDetailsDiv && $scope.viewtype == 'NewAppointmentsDashBoard') {
            getNewAppointmentDetails($scope.hospitalClinicIds)
        }

        if ($scope.showDashBordDetailsDiv && $scope.viewtype == 'ClinicfollowupAppointments') {
            getClinicfollowupAppointments($scope.hospitalClinicIds)
        }

        if ($scope.showDashBordDetailsDiv && $scope.viewtype == 'PostOpfollowupAppointments') {
            getPostOpfollowupAppointments($scope.hospitalClinicIds)
        }

        if ($scope.showDashBordDetailsDiv && $scope.viewtype == 'ASCAppointments') {
            getAscAppointmentsDeatils($scope.hospitalClinicIds)
        }

        if ($scope.showDashBordDetailsDiv && $scope.viewtype == 'TechnicianAppointments') {
            getTechnicianAppointments($scope.hospitalClinicIds)
        }

        if ($scope.showDashBordDetailsDiv && $scope.viewtype == 'PreOpAppointments') {
            getPreOpAppointments($scope.hospitalClinicIds)
        }

        if ($scope.showDashBordDetailsDiv && $scope.viewtype == 'PreadmissionAppointments') {
            getPreadmissionAppointment($scope.hospitalClinicIds)
        }

        if ($scope.showDashBordDetailsDiv && $scope.viewtype == 'CoordinatorAppointments') {
            getCoordinatorAppointments($scope.hospitalClinicIds)
        }

        if ($scope.showDashBordDetailsDiv && $scope.viewtype == 'AllAppointments') {
            getAllTotalAppointmentsDetails($scope.hospitalClinicIds)
        }

        if ($scope.showDashBordDetailsDiv && $scope.viewtype == 'ActiveAppointments') {
            getActiveAppointmentsDetails($scope.hospitalClinicIds)
        }

        if ($scope.showDashBordDetailsDiv && $scope.viewtype == 'RescheduleAppointments') {
            getRescheduleAppointments($scope.hospitalClinicIds)
        }

        if ($scope.showDashBordDetailsDiv && $scope.viewtype == 'SeenNewAppointmentsDashBoard') {
            GetSeenNewAppointmentDetails($scope.hospitalClinicIds)
        }




    }

    $scope.GetNewPatientReportObj.FromDate = $filter('date')(new Date(), "MM-dd-yyyy");
    $scope.GetNewPatientReportObj.ToDate = $filter('date')(new Date(), "MM-dd-yyyy");
    $scope.stopClosingDropDown = function () {
        event.stopPropagation();
    }
    $scope.CountAppointmenEachVisitReason = [];
    $scope.Visttotalname = "68- Nuevos (<60 años) OPH" || '';
    $scope.NewPatientReportTotalAppt = [];
    $scope.NewPatientReportOnDashBoard = function (ExcelObj) {

        if (!eHnoteMainAppointmentService.Is7DaysCount($scope.GetNewPatientReportObj.FromDate, $scope.GetNewPatientReportObj.ToDate)) {
            alertify.log("More than 31 days not allowed");
            return;
        }
        var selectedDoctors = $filter("filter")($scope.NewPatientReportDoctorList, function (iterator, ind) { return iterator.isChecked == true; });
        if (selectedDoctors.length === 0) {
            alertify.error("Please Select Doctor");
            return false;
        }
        let newlist1 = "";
        for (let i in $scope.Visitreasons) {
            if ($scope.Visitreasons[i].isChecked) {
                //newlist1 += "," + $scope.Visitreasons[i].ReasonId;
                newlist1 += "," + $scope.Visitreasons[i].ParentAppointmentVisitReasonId;
            }
        }
        let locationIds = $scope.ApptBranchLocations
            .filter(pitem => pitem.IsChecked && pitem.ClinicId !== 0)
            .map(pitem => pitem.ClinicId)
            .join(",");
        //var FromDate = $filter('date')($scope.GetNewPatientReportObj.FromDate, "yyyy-MM-dd");
        var FromDate = $filter('date')(new Date($scope.GetNewPatientReportObj.FromDate), "yyyy-MM-dd");
        var ToDate = $filter('date')(new Date($scope.GetNewPatientReportObj.ToDate), "yyyy-MM-dd");
        var newlist = "";
        for (var i in $scope.NewPatientReportDoctorList) {
            if ($scope.NewPatientReportDoctorList[i].isChecked) {
                newlist += "," + $scope.NewPatientReportDoctorList[i].DoctorID;
            }
        }
        if (newlist.charAt(0) === ",") {
            newlist = newlist.slice(1);
        }
        var obj = {
            "FromDate": FromDate || "",
            "ToDate": ToDate || "",
            "DoctorIds": newlist || [],
            "HospitalId": locationIds,
            "VisitReasonIds": "19,42,81,119",
            /*"VisitReasonIds": "3866,3,4082,3748,3878,3906,4008",*/
            "ReportType": ExcelObj || "",
            "UserId": eHnoteMasterDataService.getLoginId(),
        }
        eHnotePatientDataService.GetDoctorAppointmentCountByDashBoard(obj).then(function (resp) {
            console.log(resp);
            if (resp.data.Status === 'Success') {

                //if (ExcelObj === 'export') {
                //    generateTableNewPatientReport(resp.data.rows, 'export');
                //}
                if ($scope.GetNewPatientReportObj.FromDate != '') {
                    var FromDate = $scope.GetNewPatientReportObj.FromDate;
                }
                if ($scope.GetNewPatientReportObj.ToDate != '') {
                    var ToDate = $scope.GetNewPatientReportObj.ToDate;
                }
                var dateArr = getDateArray(FromDate, ToDate);
                console.log(dateArr);
                $scope.Datecontainer = [];
                $scope.DatecontainerColspan = $scope.Datecontainer.length + 1;
                $scope.DashBoardNewPatientReport = resp.data.rows || [];
                $scope.NewPatientDashBoardReport = angular.copy($scope.DashBoardNewPatientReport);
                $scope.CountAppointmenEachVisitReason = resp.data.CountAppointmenEachVisitReason || [];
                //if ($scope.CountAppointmenEachVisitReason.length != 0) {
                //    $scope.VRColspan = $scope.CountAppointmenEachVisitReason.length || 0;
                //}
                angular.forEach(dateArr, function (item) {
                    $scope.Datecontainer.push($filter('date')(new Date(item), "yyyy-MM-dd"));
                });
                if ($scope.NewPatientDashBoardReport.length > 0) {
                    angular.forEach($scope.NewPatientDashBoardReport, function (aitem) {
                        angular.forEach(aitem.VisitReasons, function (subitem) {
                            subitem.VisitReasonwiseApptList = [];
                            subitem.VisitReasonDataList = [];
                            subitem.VisitReasonData = subitem.VisitReasonData || [];
                            if ($scope.Visitreasons.length > 0) {
                                $scope.Visitreasons.forEach(item => {
                                    if (item.ReasonId === subitem.VisitReasonId) {
                                        subitem.VisitReasonName = item.Reason
                                    }
                                })
                            }
                            if (subitem.VisitReasonData.length > 0) {
                                angular.forEach($scope.Datecontainer, function (ditem) {
                                    var filtervisit = $filter('filter')(subitem.VisitReasonData, { 'AppointmentDate': ditem }, true) || [];
                                    if (filtervisit.length === 0) {
                                        var obj = {
                                            "AppointmentCount": "",
                                            "AppointmentDate": ditem,
                                        };
                                        subitem.VisitReasonwiseApptList.push(obj);
                                    } else {
                                        subitem.VisitReasonwiseApptList.push(filtervisit[0]);
                                    }
                                });
                            }
                            else {
                                angular.forEach($scope.Datecontainer, function (ditem) {
                                    var obj = {
                                        "AppointmentCount": "",
                                        "AppointmentDate": ditem
                                    };
                                    subitem.VisitReasonDataList.push(obj);
                                });
                            }
                        });
                        if (aitem.AppointmentDatesArray.length > 0) {
                            aitem.AppointmentDatesList = [];
                            angular.forEach($scope.Datecontainer, function (ditem) {
                                var filterdate = $filter('filter')(aitem.AppointmentDatesArray, { 'AppointmentDate': ditem }, true) || [];
                                if (filterdate.length === 0) {
                                    var obj = {
                                        "AppointmentCount": "",
                                        "AppointmentDate": ditem
                                    };
                                    aitem.AppointmentDatesList.push(obj);
                                } else {
                                    aitem.AppointmentDatesList.push(filterdate[0]);
                                }
                            });
                        } else {
                            aitem.AppointmentDatesList = [];
                            angular.forEach($scope.Datecontainer, function (ditem) {
                                var obj = {
                                    "AppointmentCount": "",
                                    "AppointmentDate": ditem
                                };
                                aitem.AppointmentDatesList.push(obj);
                            });
                        }
                    });
                }

                //if ($scope.CountAppointmenEachVisitReason.length > 0) {
                //    var temptotalvisitcount = [];
                //    angular.forEach($scope.Datecontainer, function (ditem) {
                //        var filtervisitTotal = $filter('filter')($scope.CountAppointmenEachVisitReason, { 'AppointmentDate': ditem }, true) || [];
                //        if (filtervisitTotal.length != 0) {
                //            let Visita = $filter('filter')(filtervisitTotal, { 'VisitReasonId': 19 }, true) || [];
                //            let CVA = $filter('filter')(filtervisitTotal, { 'VisitReasonId': 42 }, true) || [];
                //            let Possiblesx = $filter('filter')(filtervisitTotal, { 'VisitReasonId': 119 }, true) || [];
                //            let Nuevos = $filter('filter')(filtervisitTotal, { 'VisitReasonId': 81 }, true) || [];
                //            angular.forEach(filtervisitTotal, function (fitem) {


                //                var obj = {
                //                    "AptCount": fitem.AptCount || "",
                //                    "VisitReason": fitem.VisitReason || "",
                //                    "VisitReasonId": fitem.VisitReasonId || "",
                //                };
                //                    temptotalvisitcount.push(obj);

                //            });
                //            if (Visita.length==0) {
                //                var obj = {
                //                    "AptCount": "",
                //                    "VisitReason": "",
                //                    "VisitReasonId": 19,
                //                };
                //                temptotalvisitcount.push(obj);
                //            }
                //            if (CVA.length == 0) {
                //                var obj = {
                //                    "AptCount": "",
                //                    "VisitReason": "",
                //                    "VisitReasonId": 42,
                //                };
                //                temptotalvisitcount.push(obj);
                //            }
                //            if (Possiblesx.length == 0) {
                //                var obj = {
                //                    "AptCount": "",
                //                    "VisitReason": "",
                //                    "VisitReasonId": 119,
                //                };
                //                temptotalvisitcount.push(obj);
                //            }
                //            if (Nuevos.length == 0) {
                //                var obj = {
                //                    "AptCount": "",
                //                    "VisitReason": "",
                //                    "VisitReasonId": 81,
                //                };
                //                temptotalvisitcount.push(obj);
                //            }
                //        } else {
                //            //var obj = {
                //            //    "AptCount":  "",
                //            //    "VisitReason":  "",
                //            //    "VisitReasonId":  "",
                //            //};
                //            //temptotalvisitcount.push(obj);
                //        }


                //    });
                //    $scope.CountAppointmenEachVisitReason=temptotalvisitcount || [];
                //}
                $scope.NewPatientReportTotalAppt=[];
                $scope.NewPatientReportTotalApptCountByDate = [];
                if (resp.data.TotalAppointmentstCountByDate.length > 0) {
                    $scope.NewPatientReportTotalApptCountByDate = angular.copy(resp.data.TotalAppointmentstCountByDate);
                }
                if ($scope.NewPatientReportTotalApptCountByDate.length > 0) {
                     
                    angular.forEach($scope.Datecontainer, function (ditem) {
                        var filterdate = $filter('filter')($scope.NewPatientReportTotalApptCountByDate, { 'AppointmentDate': ditem }, true) || [];
                        if (filterdate.length === 0) {
                            var obj = {
                                "AppointmentCount": "",
                                "AppointmentDate": ditem
                            };
                            $scope.NewPatientReportTotalAppt.push(obj);
                        } else {
                            $scope.NewPatientReportTotalAppt.push(filterdate[0]);
                        }
                    });
                } else {
                    $scope.ShowTotalAppt = [];
                    angular.forEach($scope.Datecontainer, function (ditem) {
                        var obj = {
                            "AppointmentCount": "",
                            "AppointmentDate": ditem
                        };
                        $scope.NewPatientReportTotalAppt.push(obj);
                    });
                }

                $scope.AllDoctorsTotalAppointments = resp.data.AllDoctorsTotalAppointments|| 0;

                $scope.TotalExpectedMaximum = resp.data.TotalExpectedMaximum||"";
                if (ExcelObj === 'export') {
                    generateTableNewPatientReport($scope.NewPatientDashBoardReport, 'export', $scope.NewPatientReportTotalAppt, $scope.AllDoctorsTotalAppointments, $scope.TotalExpectedMaximum, $scope.CountAppointmenEachVisitReason);
                }
                console.log($scope.NewPatientReportTotalAppt);
                console.log($scope.VisitreasonByApptArray);
                console.log($scope.NewPatientDashBoardReport);
                angular.forEach($scope.NewPatientDashBoardReport, function (item) {
                    //item.shorttime = $filter('date')(new Date(item.ConsultationDt + " " + item.StartTime), "hh:mm a");
                    //if (item.Patient.MobileNo.length > 0) {
                    //    var obj = eHnoteUserDataService.UsMobileFormatChange(item.Patient.MobileNo);
                    //    item.Patient.MobileNoUsFormate = obj.UsFormatMobileNumber;
                    //}
                });

                /* $scope.gridOptions.data = $scope.NewPatientDashBoardReport;*/



            }
        }, function (err) {
            console.log(err);
        });
    }



    $scope.DoctorToggle = function (item) {
        var checkedArray = _.where($scope.NewPatientReportDoctorList, { isChecked: true });
        $scope.GetNewPatientReportObj.AllDoctorCheck = checkedArray.length > 0 && $scope.NewPatientReportDoctorList.length === checkedArray.length ? true : false;

        if (checkedArray.length == 0) {
            $scope.selectedDoctors = "Select Doctor";
        } else {
            if (checkedArray.length === 1) {
                //$scope.selectedDoctors = checkedArray[0].NPI + '-' + checkedArray[0].UserFullName;
                $scope.selectedDoctors = checkedArray[0].UserFullName + '-' + checkedArray[0].NPI;
            } else {
                $scope.selectedDoctors = "Selected Doctors";
            }
        }
    };
    $scope.checkAllDoctor = function (val) {
        if (val) {
            angular.forEach($scope.NewPatientReportDoctorList, function (item) {
                item.isChecked = true;
            });

            $scope.selectedDoctors = 'All';
        } else {
            angular.forEach($scope.NewPatientReportDoctorList, function (item) {
                item.isChecked = false;
            });
            $scope.selectedDoctors = 'Select Doctors';
        }
        var checkedArray = _.where($scope.NewPatientReportDoctorList, { isChecked: true });
        $scope.GetNewPatientReportObj.AllDoctorCheck = checkedArray.length > 0 && $scope.NewPatientReportDoctorList.length === checkedArray.length ? true : false;

    };

    /* Internal Referral Report - Role filter (loads the Doctor List by SuffixName) */
    $scope.ReferralReportRoleList = [
        { RoleValue: "OD", RoleName: "OD", isChecked: true },
        { RoleValue: "MD", RoleName: "MD", isChecked: true }
    ];
    $scope.ReferralReportRoleObj = { AllRoleCheck: true, SelectedRoleName: "All" };

    function isDoctorOfRole(doctor, role) {
        var suffixName = (doctor.SuffixName || "").toString().trim().toUpperCase();
        if (suffixName !== "") {
            return suffixName === role;
        }
        /* fall back to the suffix id when the row carries no suffix name (10 - MD, 13 - OD) */
        var suffixId = parseInt(doctor.SuffixId, 10);
        return role === "OD" ? suffixId === 13 : suffixId === 10;
    }

    function updateReferralReportRoleString() {
        var checkedRoles = _.where($scope.ReferralReportRoleList, { isChecked: true });
        $scope.ReferralReportRoleObj.AllRoleCheck = checkedRoles.length === $scope.ReferralReportRoleList.length;
        if (checkedRoles.length === 0) {
            $scope.ReferralReportRoleObj.SelectedRoleName = "Select Role";
        } else if ($scope.ReferralReportRoleObj.AllRoleCheck) {
            $scope.ReferralReportRoleObj.SelectedRoleName = "All";
        } else {
            $scope.ReferralReportRoleObj.SelectedRoleName = checkedRoles[0].RoleName;
        }
    }

    $scope.applyReferralReportRoleFilter = function () {
        updateReferralReportRoleString();
        if (!$scope.NewPatientReportDoctorList || $scope.NewPatientReportDoctorList.length === 0) {
            return;
        }
        var checkedRoles = _.where($scope.ReferralReportRoleList, { isChecked: true });
        angular.forEach($scope.NewPatientReportDoctorList, function (doctor) {
            if ($scope.ReferralReportRoleObj.AllRoleCheck) {
                /* "All" keeps every doctor of the list (OD, MD and any other suffix) selected */
                doctor.isChecked = true;
                return;
            }
            doctor.isChecked = checkedRoles.some(function (role) {
                return isDoctorOfRole(doctor, role.RoleValue);
            });
        });
        var checkedArray = _.where($scope.NewPatientReportDoctorList, { isChecked: true });
        $scope.GetNewPatientReportObj.AllDoctorCheck = checkedArray.length > 0 && $scope.NewPatientReportDoctorList.length === checkedArray.length ? true : false;
        $scope.AllDoctorsObj.AllDoctorCheck = $scope.GetNewPatientReportObj.AllDoctorCheck;
        if (checkedArray.length === 0) {
            $scope.selectedDoctors = "Select Doctor";
        } else if (checkedArray.length === 1) {
            $scope.selectedDoctors = checkedArray[0].UserFullName + '-' + checkedArray[0].NPI;
        } else if (checkedArray.length === $scope.NewPatientReportDoctorList.length) {
            $scope.selectedDoctors = "All Doctors";
        } else {
            $scope.selectedDoctors = "Selected Doctors";
        }
    };

    /* ticking a single role - "All" follows automatically once both are ticked */
    $scope.ReferralReportRoleToggle = function (item) {
        /* The role only pre-selects the Doctor List, the user can still add/remove
           any doctor manually before hitting Search. */
        $scope.applyReferralReportRoleFilter();
    };

    /* ticking "All" ticks both OD and MD, unticking it clears both */
    $scope.checkAllReferralReportRoles = function (val) {
        angular.forEach($scope.ReferralReportRoleList, function (item) {
            item.isChecked = val;
        });
        $scope.applyReferralReportRoleFilter();
    };
    $scope.selectedReferalDoctors = 'Select Referal Doctors';
    $scope.checkReferalAllDoctor = function (val) {
        if (val) {
            angular.forEach($scope.ReferalPCPDoctorsList, function (item) {
                item.isChecked = true;
            });

            $scope.selectedReferalDoctors = 'All';
        } else {
            angular.forEach($scope.ReferalPCPDoctorsList, function (item) {
                item.isChecked = false;
            });
            $scope.selectedReferalDoctors = 'Select Referal Doctors';
        }
        var checkedArray = _.where($scope.ReferalPCPDoctorsList, { isChecked: true });
        $scope.GetNewPatientReportObj.AllReferalDoctorCheck = checkedArray.length > 0 && $scope.ReferalPCPDoctorsList.length === checkedArray.length ? true : false;

    };
    $scope.ReferalDoctorToggle = function (item) {
        var checkedArray = _.where($scope.ReferalPCPDoctorsList, { isChecked: true });
        $scope.GetNewPatientReportObj.AllReferalDoctorCheck = checkedArray.length > 0 && $scope.ReferalPCPDoctorsList.length === checkedArray.length ? true : false;

        if (checkedArray.length == 0) {
            $scope.selectedReferalDoctors = "Select Referal Doctor";
        } else {
            if (checkedArray.length === 1) {
                //$scope.selectedDoctors = checkedArray[0].NPI + '-' + checkedArray[0].UserFullName;
                $scope.selectedReferalDoctors = checkedArray[0].FullName + '-' + checkedArray[0].SuffixName;
            } else {
                $scope.selectedReferalDoctors = "Selected Referal Doctors";
            }
        }
    };

    $scope.selectedInternalDoctors = 'Select Referal Doctors';
    $scope.InternalDoctorToggle = function (item) {
        var checkedArray = _.where($scope.InternalReportDoctorList, { isChecked: true });
        $scope.GetNewPatientReportObj.AllInternalDoctorCheck = checkedArray.length > 0 && $scope.InternalReportDoctorList.length === checkedArray.length ? true : false;

        if (checkedArray.length == 0) {
            $scope.selectedInternalDoctors = "Select Referal Doctor";
        } else {
            if (checkedArray.length === 1) {
                //$scope.selectedDoctors = checkedArray[0].NPI + '-' + checkedArray[0].UserFullName;
                $scope.selectedInternalDoctors = checkedArray[0].UserFullName + '-' + checkedArray[0].NPI;
            } else {
                $scope.selectedInternalDoctors = "Selected Referal Doctors";
            }
        }
    };
    $scope.checkAllInternalDoctor = function (val) {
        if (val) {
            angular.forEach($scope.InternalReportDoctorList, function (item) {
                item.isChecked = true;
            });

            $scope.selectedInternalDoctors = 'All';
        } else {
            angular.forEach($scope.InternalReportDoctorList, function (item) {
                item.isChecked = false;
            });
            $scope.selectedInternalDoctors = 'Select Referal Doctors';
        }
        var checkedArray = _.where($scope.InternalReportDoctorList, { isChecked: true });
        $scope.GetNewPatientReportObj.AllInternalDoctorCheck = checkedArray.length > 0 && $scope.InternalReportDoctorList.length === checkedArray.length ? true : false;

    };
    $scope.selectResonType = 'Select ResonType ';
    $scope.checkAllResonTypes = function (val) {
        if (val) {
            angular.forEach($scope.MasterReasonTypes, function (item) {
                item.isChecked = true;
            });

            $scope.selectResonType = 'All';
        } else {
            angular.forEach($scope.MasterReasonTypes, function (item) {
                item.isChecked = false;
            });
            $scope.selectResonType = 'Select ResonType';
        }
        var checkedArray = _.where($scope.MasterReasonTypes, { isChecked: true });
        $scope.AllDoctorsObj.AllResonTypeCheck = checkedArray.length > 0 && $scope.MasterReasonTypes.length === checkedArray.length ? true : false;

    };
    $scope.ReasonTypeToggle = function (item) {
        var checkedArray = _.where($scope.MasterReasonTypes, { isChecked: true });
        $scope.AllDoctorsObj.AllResonTypeCheck = checkedArray.length > 0 && $scope.MasterReasonTypes.length === checkedArray.length ? true : false;

        if (checkedArray.length == 0) {
            $scope.selectResonType = "Select ResonType";
        } else {
            if (checkedArray.length === 1) {
                //$scope.selectedDoctors = checkedArray[0].NPI + '-' + checkedArray[0].UserFullName;
                $scope.selectResonType = checkedArray[0].ReasonTypeName ;
            } else {
                $scope.selectResonType = "Selected ResonTypes";
            }
        }
    };
    var getDateArray = function (FromDate, ToDate) {
        var arr = new Array();
        /* var dt = new Date(FromDate);*/
        var dt = new Date(FromDate + ' ' + "00:00:00");
        while (dt <= new Date(ToDate)) {
            arr.push(new Date(dt));
            dt.setDate(dt.getDate() + 1);
        }
        return arr;
    }

    var getDateArrayNew = function (FromDate, ToDate) {
        var arr = new Array();
        /* var dt = new Date(FromDate);*/
        var dt = new Date(FromDate + ' ' + "00:00:00");
        while (dt <= new Date(ToDate + ' ' + "00:00:00")) {
            arr.push(new Date(dt));
            dt.setDate(dt.getDate() + 1);
        }
        return arr;
    }
    $scope.PrintOnNewPatientReportOnDashBoard = function () {

        console.log($scope.NewPatientDashBoardReport);
        console.log($scope.Datecontainer);

        var CreatedByName = "";
        if (doctorinfo.doctordata.User.length > 0) {
            CreatedByName = doctorinfo.doctordata.User[0].FullName || "";
        }
        var FromDate = $filter('date')($scope.GetNewPatientReportObj.FromDate, "yyyy-MM-dd");
        var ToDate = $filter('date')($scope.GetNewPatientReportObj.ToDate, "yyyy-MM-dd");
        var DatesList = [];
        if ($scope.Datecontainer.length > 0) {
            angular.forEach($scope.Datecontainer, function (ditrm) {
                var obj = {
                    "Date": ditrm,
                    "Shortdate": $filter('date')(ditrm, "MM/dd")
                }
                DatesList.push(obj);
            });
        }
        var NewPatientReportTotalAppt = angular.copy($scope.NewPatientReportTotalAppt);
        var AllDoctorsTotalAppointments = angular.copy($scope.AllDoctorsTotalAppointments)
        var TotalExpectedMaximum = angular.copy($scope.TotalExpectedMaximum)
        var obj = {
            "HospitalId": $scope.SelectedHospital === undefined || $scope.SelectedHospital === null ? doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID : $scope.SelectedHospital.ClinicId || "",
            "FromDate": FromDate||"",
            "ToDate": ToDate||"",
            "DoctorId": $scope.GetNewPatientReportObj.DoctorId || 0,
            "Datecontainer": DatesList || [],
            "DataStoring": $scope.NewPatientDashBoardReport || [],
            "NewPatientReportTotalAppt": NewPatientReportTotalAppt || [],
            "AllDoctorsTotalAppointments": AllDoctorsTotalAppointments || 0,
            "TotalExpectedMaximum": TotalExpectedMaximum||0,
            "CreatedBy": CreatedByName,
            "CountAppointmenEachVisitReason": $scope.CountAppointmenEachVisitReason|| [],

        };
        if ($scope.Datecontainer.length < 21) {
            if ($scope.Datecontainer.length > 13) {
                USPrintService.GetNewReportPatientprintWithLandScapeOnDashBoard(obj);
            }
            else {
                USPrintService.GetNewReportPatientprintOnDashBoard(obj);
            }
        }
        else {
            alertify.error("Above 20 Days Print is not allowed");
        }
    }

    $scope.GetDataOnMainDashBoardObj.dashboard_StartDate = $filter('date')(new Date(), "MM-dd-yyyy");
    $scope.GetDataOnMainDashBoardObj.dashboard_EndDate = $filter('date')(new Date(), "MM-dd-yyyy");

    $scope.DashBoardDoctorToggle = function () {
        var checkedArray = _.where($scope.NewPatientReportDoctorList, { isChecked: true });
        $scope.GetDataOnMainDashBoardObj.AllDoctorCheck = checkedArray.length > 0 && $scope.NewPatientReportDoctorList.length === checkedArray.length ? true : false;

        if (checkedArray.length == 0) {
            $scope.selectedDashBoardDoctor = "Select Doctor";
        } else {
            if (checkedArray.length === 1) {
                //$scope.selectedDoctors = checkedArray[0].NPI + '-' + checkedArray[0].UserFullName;
                $scope.selectedDashBoardDoctor = checkedArray[0].UserFullName + '-' + checkedArray[0].NPI;
            } else {
                $scope.selectedDashBoardDoctor = "Selected Doctors";
            }
        }
    }

    $scope.DashBoardcheckAllDoctor = function (val) {
        if (val) {
            angular.forEach($scope.NewPatientReportDoctorList, function (item) {
                item.isChecked = true;
            });

            $scope.selectedDashBoardDoctor = 'All';
        } else {
            angular.forEach($scope.NewPatientReportDoctorList, function (item) {
                item.isChecked = false;
            });
            $scope.selectedDashBoardDoctor = 'Select Doctors';
        }
        var checkedArray = _.where($scope.NewPatientReportDoctorList, { isChecked: true });
        $scope.GetDataOnMainDashBoardObj.AllDoctorCheck = checkedArray.length > 0 && $scope.NewPatientReportDoctorList.length === checkedArray.length ? true : false;
    };


    $scope.VisitREsonlist =  [{ "Type": "Actual Appointments", "Total": 10, "Avg": 20, "YeartoDay": 10, "Averageforyear": 10, "AppointmentDatesList": [{ "AppointmentCount": 7, "AppointmentDate": "2023-08-17", }, { "AppointmentCount": 8, "AppointmentDate": "2023-08-18" }, { "AppointmentCount": 21, "AppointmentDate": "2023-08-19" }, { "AppointmentCount": "", "AppointmentDate": "2023-08-20" }, { "AppointmentCount": 15, "AppointmentDate": "2023-08-21" }, { "AppointmentCount": 25, "AppointmentDate": "2023-08-22" }, { "AppointmentCount": 5, "AppointmentDate": "2023-08-23" }, { "AppointmentCount": 6, "AppointmentDate": "2023-08-24" }, { "AppointmentCount": 5, "AppointmentDate": "2023-08-25" }] }, { "Type": "Actual Appointments", "Total": 10, "Avg": 20, "YeartoDay": 10, "Averageforyear": 10, "AppointmentDatesList": [{ "AppointmentCount": 7, "AppointmentDate": "2023-08-17", }, { "AppointmentCount": 8, "AppointmentDate": "2023-08-18" }, { "AppointmentCount": 21, "AppointmentDate": "2023-08-19" }, { "AppointmentCount": "", "AppointmentDate": "2023-08-20" }, { "AppointmentCount": 15, "AppointmentDate": "2023-08-21" }, { "AppointmentCount": 25, "AppointmentDate": "2023-08-22" }, { "AppointmentCount": 5, "AppointmentDate": "2023-08-23" }, { "AppointmentCount": 6, "AppointmentDate": "2023-08-24" }, { "AppointmentCount": 5, "AppointmentDate": "2023-08-25" }] }, { "Type": "Actual Appointments", "Total": 10, "Avg": 20, "YeartoDay": 10, "Averageforyear": 10, "AppointmentDatesList": [{ "AppointmentCount": 7, "AppointmentDate": "2023-08-17", }, { "AppointmentCount": 8, "AppointmentDate": "2023-08-18" }, { "AppointmentCount": 21, "AppointmentDate": "2023-08-19" }, { "AppointmentCount": "", "AppointmentDate": "2023-08-20" }, { "AppointmentCount": 15, "AppointmentDate": "2023-08-21" }, { "AppointmentCount": 25, "AppointmentDate": "2023-08-22" }, { "AppointmentCount": 5, "AppointmentDate": "2023-08-23" }, { "AppointmentCount": 6, "AppointmentDate": "2023-08-24" }, { "AppointmentCount": 5, "AppointmentDate": "2023-08-25" }] }] 

    $scope.ExportNewPatientReportOnDashBoard = function (ExcelObj) {
        $scope.NewPatientReportOnDashBoard(ExcelObj);

    }
    function generateTableNewPatientReport(jsonData, typeValue, NewPatientReportTotalAppt, AllDoctorsTotalAppointments, TotalExpectedMaximum, CountAppointmenEachdateArray) {
        var ReportName = "";
        var reports_exportData = [];
        if (typeValue === "export") {
            ReportName = "New Patient Report";
            reports_exportData.length = 0;
            console.log($scope.Datecontainer);
            $scope.DateArrayforExcel = angular.copy($scope.Datecontainer);
            var ExpectedMaximum = "Exp Max";
            $scope.DateArrayforExcel.unshift(ExpectedMaximum);
            var DoctorName = "Doctor Name";
            $scope.DateArrayforExcel.unshift(DoctorName);
            var TotalAppointments = "Total Appointments";
            $scope.DateArrayforExcel.push(TotalAppointments);
            var col = [];
            var TotalValue = [];
            var AllTotalAppointments = '';
            var TotalExpeMaximum = '';
            if (jsonData.length === 0) {
                return;
            }
            col = $scope.DateArrayforExcel;
            TotalValue = NewPatientReportTotalAppt;
            AllTotalAppointments = AllDoctorsTotalAppointments
            TotalExpeMaximum = TotalExpectedMaximum;
            //for (var i = 0; i < jsonData.length; i++) {
            //    for (var key in jsonData[i]) {
            //        if (col.indexOf(key) === -1) {
            //            col.push(key);
            //        }
            //    }
            //}
            // CREATE DYNAMIC TABLE.
            var table = document.createElement("table");
            table.style = "border: 1px solid #000;";
            // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.
            if (ReportName !== "") {

                if ($scope.reportSearch.HospitalId.length > 2) {
                    tr = table.insertRow(-1);
                    tabHead = tr.insertCell(-1);
                    tabHead.style = "border: 1px solid #000;text-align:center;";
                    tabHead.colSpan = 5;
                    tabHead.innerHTML = ParentHospitalName;
                }

                else {
                    //tr = table.insertRow(-1);
                    //tabHead = tr.insertCell(-1);
                    //tabHead.style = "border: 1px solid #000;text-align:center;"
                    //tabHead.colSpan = 5;
                    //tabHead.innerHTML = $scope.reportSearch.DoctorObj.FullName;
                    var tr = table.insertRow(-1);
                    var tabHead = tr.insertCell(-1);
                    tabHead.style = "border: 1px solid #000;text-align:center;font-weight: bold;";
                    tabHead.colSpan = 5;
                    // tabHead.innerHTML = $scope.reportSearch.HospitalObj.ClinicName || $scope.SelectedHospital.HospitalInfo.HospitalDetails.ClinicName;
                    tabHead.innerHTML = $scope.reportSearch.HospitalObj.ClinicName || $scope.SelectedHospital.ClinicName;
                }




                var tr = table.insertRow(-1);              // TABLE ROW.        
                tabHead = tr.insertCell(-1);
                tabHead.style = "border: 1px solid #000;text-align:center;font-weight: bold;";
                tabHead.colSpan = 5;
                tabHead.innerHTML = ReportName;


                //var tabHead = tr.insertCell(-1);
                //tabHead.style = "border: 1px solid #000;text-align:center;font-weight: bold;"
                //tabHead.colSpan = 5;
                //tabHead.innerHTML = $scope.reportSearch.HospitalObj.ClinicName;

                tr = table.insertRow(-1);
                tabHead = tr.insertCell(-1);
                tabHead.style = "border: 1px solid #000;text-align:center;";
                tabHead.colSpan = 5;

                if ($scope.dashboardTab === 'reports') {
                    tabHead.innerHTML = "From:" + $scope.GetNewPatientReportObj.FromDate + " - " + "To:" + $scope.GetNewPatientReportObj.ToDate;
                }
                else {
                    tabHead.innerHTML = "From:" + $scope.GetNewPatientReportObj.FromDate + " - " + "To:" + $scope.GetNewPatientReportObj.ToDate;
                }
                // tabHead.innerHTML = $scope.reportSearch.ToDate;
                if ($scope.SpecializationId !== 2) {
                    tr = table.insertRow(-1);
                    tabHead = tr.insertCell(-1);
                    tabHead.style = "";
                    tabHead.colSpan = 5;
                    //tabHead.innerHTML = ($scope.reportSearch.DepartmentObj !== undefined ? $scope.reportSearch.DepartmentObj.SubSpecializationName : '') || ($scope.SelectedDepartment === null || $scope.SelectedDepartment === undefined || $scope.SelectedDepartment === 0 ? "All Departments" : $scope.SelectedDepartment.SubSpecializationName);
                }

                tr = table.insertRow(-1);
                tabHead = tr.insertCell(-1);
                tabHead.style = "";
                tabHead.colSpan = 5;
                // tabHead.innerHTML = $scope.reportSearch.DoctorObj.FullName || ($scope.SelectedDoctor === null ? "All Doctors" : $scope.SelectedDoctor.FullName);



            }
            //tr = table.insertRow(-1);
            //var tabHead1 = tr.insertCell(-1);
            //tabHead1.style = "border: 1px solid #000;text-align:center;font-weight: bold;"
            //tabHead1.colSpan = 5;
            //tabHead1.innerHTML = "[" + new Date().toLocaleString() + "]"

            var tr = table.insertRow(-1);               // TABLE ROW.
            for (var i = 0; i < col.length; i++) {
                var th = document.createElement("th");      // TABLE HEADER.
                th.innerHTML = col[i];
                tr.appendChild(th);
                tr.style = "border: 1px solid;background:#1e977c;color:#fff;width:100px";
            }



            // ADD JSON DATA TO THE TABLE AS ROWS.
            for (var i = 0; i < jsonData.length; i++) {
                tr = table.insertRow(-1);
                tr.style = "border: 1px solid #000;background:#FFFFE0;font-weight: bold";
                for (var j = 0; j < col.length; j++) {
                    var tabCell = tr.insertCell(-1);
                    var last = col.length - 1;
                    if (j == 0) {
                        tabCell.innerHTML = jsonData[i].DoctorName;
                    }
                    else if (j == 1) {
                        tabCell.innerHTML = jsonData[i].ExpectedMaximum;
                    }
                    else if (last==j){
                        tabCell.innerHTML = jsonData[i].TotalAppointments;
                    }
                    else {
                        var k = j - 2;
                        tabCell.innerHTML = jsonData[i].AppointmentDatesList[k].AppointmentCount;
                    }

                }

                for (let k = 0; k < jsonData[i].VisitReasons.length; k++) {
                    tr = table.insertRow(-1);
                    tr.style = "border: 1px solid #000;";
                    for (var j = 0; j < col.length; j++) {
                        var tabCell = tr.insertCell(-1);
                        if (j < 1) {
                            tabCell.innerHTML = jsonData[i].VisitReasons[k].VisitReasonName;
                        }
                        else if (last == j) {
                            tabCell.innerHTML = jsonData[i].VisitReasons[k].VisitReasonAppointmentsCount;
                        }
                        else if (j == 1) {
                            console.log('checking');
                        }
                        else {
                            var s = j - 2;

                            if (jsonData[i].VisitReasons.length > 0) {
                                if (jsonData[i].VisitReasons[k].VisitReasonwiseApptList.length > 0) {
                                    tabCell.innerHTML = jsonData[i].VisitReasons[k].VisitReasonwiseApptList[s].AppointmentCount;
                                } else {
                                    tabCell.innerHTML = "";
                                }
                            } else {
                                tabCell.innerHTML = "";
                            }
                        }
                    }
                }
            }



            // new Adding Appt 
            CountAppointmenEachdateArray = CountAppointmenEachdateArray || []
            if (CountAppointmenEachdateArray.length > 0) {
                tr = table.insertRow(-1);
                tr.style = "border: 1px solid #000;background:#DAF7A6;font-weight: bold";
                for (var j = 0; j < col.length; j++) {
                    var tabCell = tr.insertCell(-1);
                    var last = col.length - 1;
                    if (j == 0) {
                        tabCell.innerHTML = "Total VisitReason Count";
                    }
                    else if (j == 1) {
                        tabCell.innerHTML = "";
                    }
                    else if (last == j) {
                        tabCell.innerHTML = "";
                    }
                    else {
                        tabCell.innerHTML = "";
                    }

                }
                for (var i = 0; i < CountAppointmenEachdateArray.length; i++) {
                    tr = table.insertRow(-1);
                    tr.style = "border: 1px solid #000;";
                    for (var j = 0; j < col.length; j++) {
                        var tabCell = tr.insertCell(-1);
                        var last = col.length - 1;
                        if (j == 0) {
                            tabCell.innerHTML = CountAppointmenEachdateArray[i].VisitReason;
                        }
                        else if (j == 1) {
                            tabCell.innerHTML = '';
                        }
                        else if (last == j) {
                            tabCell.innerHTML = '';
                        } else {
                            var s = j - 2;
                            if (CountAppointmenEachdateArray[i] != undefined) {
                                if (CountAppointmenEachdateArray[i].AppointmentCountsEachReason != undefined) {
                                    if (CountAppointmenEachdateArray[i].AppointmentCountsEachReason.length > 0) {
                                        /*      for (let c = 0; c < CountAppointmenEachdateArray[k].AppointmentCountsEachReason.length; c++) {*/
                                        tabCell.innerHTML = CountAppointmenEachdateArray[i].AppointmentCountsEachReason[s].AppointmentCount||'';
                                        /*}*/
                                    }
                                }
                            }
                        }
                    }

                }
            }
            tr = table.insertRow(-1);
            tr.style = "border: 1px solid;background:#90EE90;color:#000;width:100px";
            for (var j = 0; j < col.length; j++) {
                var tabCell = tr.insertCell(-1);

                if (j == 0) {
                    tabCell.innerHTML = 'Total Appointments';
                }
                else if (j == 1) {
                    if (TotalExpeMaximum == undefined) {
                        tabCell.innerHTML = 0;
                    }
                    else {
                        tabCell.innerHTML = TotalExpeMaximum;
                    }
                }
                else if (last == j) {
                    tabCell.innerHTML = AllTotalAppointments;
                }
                else {
                    var k = j - 2;
                    if (NewPatientReportTotalAppt[k].TotalCount == undefined) {
                        tabCell.innerHTML = 0;
                    }
                    else {
                        tabCell.innerHTML = NewPatientReportTotalAppt[k].TotalCount;
                    }
                }
            }
            download(table);
        }
    }


    $scope.NavtoNewPatientReportBarGraph = function () {
        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/dashboard/NewPatientReportBarGraph.html",
            "backdrop": "static",
            "scope": $scope,
            "keyboard": false,
            /* "size": "lg",*/
            //"windowClass": "newassessmentspopupuib",
            "windowClass": "appointment-full-popup",
            "resolve": {
                "NewPatientDashBoardReport": function () { return angular.copy($scope.NewPatientDashBoardReport); },
                "Datecontainer": function () { return angular.copy($scope.Datecontainer); },
            },
            "controller": function ($scope, $uibModal, $uibModalInstance, NewPatientDashBoardReport, Datecontainer) {

                $scope.NewPatientDashBoardReport = NewPatientDashBoardReport;
                $scope.NewDatesArray = Datecontainer;
                $scope.NewPatientReportDatesArray = [];
                angular.forEach($scope.NewDatesArray, function (ditem) {
                    var NewDates = $filter('date')(ditem, "MM/dd");
                    $scope.NewPatientReportDatesArray.push(NewDates);
                });
                var ExpextedMax = 'Exp Max';
                $scope.NewPatientReportDatesArray.unshift(ExpextedMax);
                $scope.closeuibPopup = function () {
                    $uibModalInstance.dismiss("cancel");
                };
                $scope.categorys = [];
                getDateForNewPatientReport($scope.NewPatientReportDatesArray);
                function getDateForNewPatientReport(Dates) {
                    console.log(Dates);
                    angular.forEach(Dates, function (item) {
                        let obj = {
                            "label": item
                        };
                        $scope.categorys.push(obj);
                    })
                }
                $scope.dataset= [];
                angular.forEach($scope.NewPatientDashBoardReport, function (aitem) {
                    let  overallobj = {
                        "seriesname": aitem.DoctorName||"",
                        "data": []
                    }
                    let data = {
                        "value": aitem.ExpectedMaximum || ""
                    }
                    overallobj.data.unshift(data);

                    angular.forEach(aitem.AppointmentDatesList, function (Apptitem) {
                        let data = {
                            "value": Apptitem.AppointmentCount
                        }
                        overallobj.data.push(data);
                    });
                    $scope.dataset.push(overallobj);
                });
                console.log($scope.dataset);
                $scope.NewPatientReportGraphforEachDoctor = {
                    chart: {
                        xaxisname: "Dates Wise Appointments",
                        yaxisname: "Appointments",
                        formatnumberscale: "1",
                        plottooltext: "<b>$dataValue Appts</b> - <b>$seriesName</b>  -  <b>$label</b>",
                        theme: "fusion",
                        drawcrossline: "1"
                    },
                    categories: [
                        {
                            category: $scope.categorys
                        }
                    ],
                    dataset: $scope.dataset
                };
            },
        });
    }

    function getWalkinApptDetails(HospitalIdsList,type) {
        var selectedDoctors = $filter("filter")($scope.NewPatientReportDoctorList, function (iterator, ind) { return iterator.isChecked == true; });
        if (selectedDoctors.length == 0) {
            alertify.error("Please Select Doctor");
            return false;
        }
        var newlist = "";
        for (var i in $scope.NewPatientReportDoctorList) {
            if ($scope.NewPatientReportDoctorList[i].isChecked) {
                newlist += "," + $scope.NewPatientReportDoctorList[i].DoctorID;
            }
        }
        if (newlist.charAt(0) === ",") {
            newlist = newlist.slice(1);
        }

        let newlist1 = "";
        for (let i in $scope.Visitreasons) {
            if ($scope.Visitreasons[i].isChecked) {
                newlist1 += "," + $scope.Visitreasons[i].ReasonId;
            }
        }

        if (newlist1.charAt(0) === ",") {
            newlist1 = newlist1.slice(1);
        }

        let newlist2 = "";
        for (let i in $scope.appointmentTypes) {
            if ($scope.appointmentTypes[i].isChecked) {
                newlist2 += "," + $scope.appointmentTypes[i].Id;
            }
        }

        if (newlist2.charAt(0) === ",") {
            newlist2 = newlist2.slice(1);
        }

        let list5 = "";
        for (var i in $scope.AppointmentStatusArray) {
            if ($scope.AppointmentStatusArray[i].IsChecked) {
                list5 += "," + $scope.AppointmentStatusArray[i].AppointmentStatusId;
            }
        }
        if (list5.charAt(0) === ",") {
            list5 = list5.slice(1);
        }

        let list4 = "";
        for (var i in $scope.BookedstatusFilterList) {
            if ($scope.BookedstatusFilterList[i].IsChecked) {
                list4 += "," + $scope.BookedstatusFilterList[i].Id;
            }
        }
        if (list4.charAt(0) === ",") {
            list4 = list4.slice(1);
        }

        //var req = {
        //    "Fromdate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_StartDate), "yyyy-MM-dd"),
        //    "Todate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_EndDate), "yyyy-MM-dd"),
        //    "HospitalIdsList": HospitalIdsList.length > 0 ? HospitalIdsList : "",
        //    "DoctorsIds": newlist || "",
        //    "VisitTypeId": $scope.GetDataOnMainDashBoardObj.VisitTypeId || null
        //};
        //eHnoteMainDashboardDataServices.GetWalkinAppointmentsDetails(req).then(function (resp) {
        //    if (resp.data.status === "Success") {
        //        if (resp.data.rows.length > 0) {
        //            let tempArray = [];
        //            angular.forEach(resp.data.rows, function (kitem) {
        //                kitem.ContentShow = false;
        //                angular.forEach(kitem.WalkinPatientAppointment, function (hitem) {
        //                    let today = $filter('date')(new Date(),"yyyy-MM-dd");
        //                    let datetime = today + " " + hitem.StartTime;
        //                    hitem.StartTime = $filter('date')(new Date(datetime), "hh:mm a");
        //                    tempArray.push(hitem);
        //                });
        //            });
        //            $scope.ListCountsObj.WalkinAppointmentsCount = tempArray.length || 0;
        //        }
        //        $scope.DashboardWalkinApptDetails = angular.copy(resp.data.rows);
        //    }

        //}, function () {


        //});

        let list6 = "";
        for (var i in $scope.BookingTypesArray) {
            if ($scope.BookingTypesArray[i].IsChecked) {
                list6 += "," + $scope.BookingTypesArray[i].BookingTypeId;
            }
        }
        if (list6.charAt(0) === ",") {
            list6 = list6.slice(1);
        }

        var req = {
            "Fromdate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_StartDate), "yyyy-MM-dd"),
            "Todate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_EndDate), "yyyy-MM-dd"),
            "HospitalIdsList": HospitalIdsList.length > 0 ? HospitalIdsList : "",
            "DoctorsIds": newlist || "",
            //"VisitTypeId": $scope.GetDataOnMainDashBoardObj.VisitTypeId || null,
            "AppointmentTypeIds": newlist2,
            "VisitReasons": newlist1,
            //"AppointmentStatusIds": list5 || "",
            "BookingStatusIds": list4 || "",
            "BookingTypeIds": list6 || "",
            "DashboardType": 13
        };
        eHnoteMainDashboardDataServices.GetDashboardAppointmentDetails(req).then(function (resp) {
            if (resp.data.status === "Success") {
                if (resp.data.rows.length > 0) {
                    let tempArray = [];
                    angular.forEach(resp.data.rows, function (kitem) {
                        kitem.ContentShow = false;
                        angular.forEach(kitem.AppointmentDetails, function (hitem) {
                            let today = $filter('date')(new Date(), "yyyy-MM-dd");
                            let datetime = today + " " + hitem.StartTime;
                            hitem.StartTime = $filter('date')(new Date(datetime), "hh:mm a");
                            tempArray.push(hitem);
                        });
                    });
                    $scope.ListCountsObj.WalkinAppointmentsCount = tempArray.length || 0;
                }
                $scope.DashboardWalkinApptDetails = angular.copy(resp.data.rows);


                if (type == "export") {
                    generateTableNew($scope.DashboardWalkinApptDetails, $scope.viewtype);
                }

            }

        }, function () {


        });



    }

    $scope.ShowContent = function (item) {
        item.ContentShow = !item.ContentShow;
    };

    function getCancelledApptDetails(HospitalIdsList,type) {
        var selectedDoctors = $filter("filter")($scope.NewPatientReportDoctorList, function (iterator, ind) { return iterator.isChecked == true; });
        if (selectedDoctors.length == 0) {
            alertify.error("Please Select Doctor");
            return false;
        }
        var newlist = "";
        for (var i in $scope.NewPatientReportDoctorList) {
            if ($scope.NewPatientReportDoctorList[i].isChecked) {
                newlist += "," + $scope.NewPatientReportDoctorList[i].DoctorID;
            }
        }
        if (newlist.charAt(0) === ",") {
            newlist = newlist.slice(1);
        }

        let newlist1 = "";
        for (let i in $scope.Visitreasons) {
            if ($scope.Visitreasons[i].isChecked) {
                newlist1 += "," + $scope.Visitreasons[i].ReasonId;
            }
        }

        if (newlist1.charAt(0) === ",") {
            newlist1 = newlist1.slice(1);
        }

        let newlist2 = "";
        for (let i in $scope.appointmentTypes) {
            if ($scope.appointmentTypes[i].isChecked) {
                newlist2 += "," + $scope.appointmentTypes[i].Id;
            }
        }

        if (newlist2.charAt(0) === ",") {
            newlist2 = newlist2.slice(1);
        }

        let list3 = "";
        for (let i in $scope.confirmationStatusArray) {
            if ($scope.confirmationStatusArray[i].IsChecked) {
                list3 += "," + $scope.confirmationStatusArray[i].ConfirmationStatusId;
            }
        }
        if (list3.charAt(0) === ",") {
            list3 = list3.slice(1);
        }


        //var req = {
        //    "Fromdate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_StartDate), "yyyy-MM-dd"),
        //    "Todate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_EndDate), "yyyy-MM-dd"),
        //    "HospitalIdsList": HospitalIdsList.length > 0 ? HospitalIdsList : "",
        //    "DoctorsIds": newlist || "",
        //    "VisitTypeId": $scope.GetDataOnMainDashBoardObj.VisitTypeId || null
        //};
        //eHnoteMainDashboardDataServices.GetCancelledAppointmentsDetails(req).then(function (resp) {
        //    if (resp.data.status === "Success") {
        //        if (resp.data.rows.length > 0) {
        //            let tempArray = [];
        //            angular.forEach(resp.data.rows, function (kitem) {
        //                kitem.ContentShow = false;
        //                angular.forEach(kitem.CancelAppointment, function (hitem) {
        //                    let today = $filter('date')(new Date(), "yyyy-MM-dd");
        //                    let datetime = today + " " + hitem.StartTime;
        //                    hitem.StartTime = $filter('date')(new Date(datetime), "hh:mm a");
        //                    tempArray.push(hitem);
        //                });
        //            });

        //            $scope.ListCountsObj.CancelAppointmentsCount = tempArray.length || 0;
        //        }
        //        $scope.DashboardCancelledApptDetails = angular.copy(resp.data.rows);
        //    }

        //}, function () {


        //});

        let list5 = "";
        for (var i in $scope.AppointmentStatusArray) {
            if ($scope.AppointmentStatusArray[i].IsChecked) {
                list5 += "," + $scope.AppointmentStatusArray[i].AppointmentStatusId;
            }
        }
        if (list5.charAt(0) === ",") {
            list5 = list5.slice(1);
        }

        let list4 = "";
        for (var i in $scope.BookedstatusFilterList) {
            if ($scope.BookedstatusFilterList[i].IsChecked) {
                list4 += "," + $scope.BookedstatusFilterList[i].Id;
            }
        }
        if (list4.charAt(0) === ",") {
            list4 = list4.slice(1);
        }

        let list6 = "";
        for (var i in $scope.BookingTypesArray) {
            if ($scope.BookingTypesArray[i].IsChecked) {
                list6 += "," + $scope.BookingTypesArray[i].BookingTypeId;
            }
        }
        if (list6.charAt(0) === ",") {
            list6 = list6.slice(1);
        }

        var req = {
            "Fromdate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_StartDate), "yyyy-MM-dd"),
            "Todate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_EndDate), "yyyy-MM-dd"),
            "HospitalIdsList": HospitalIdsList.length > 0 ? HospitalIdsList : "",
            "DoctorsIds": newlist || "",
            //"VisitTypeId": $scope.GetDataOnMainDashBoardObj.VisitTypeId || null,
            "AppointmentTypeIds": newlist2,
            "VisitReasons": newlist1,
            //"AppointmentStatusIds": list5 || "",
            "BookingStatusIds": list4 || "",
            "BookingTypeIds": list6 || "",
            //  "BookingTypeIds": list6 || "",
            //"StatusIds": list3,
            "DashboardType": 16
        };
        eHnoteMainDashboardDataServices.GetDashboardAppointmentDetails(req).then(function (resp) {
            if (resp.data.status === "Success") {
                if (resp.data.rows.length > 0) {
                    let tempArray = [];
                    angular.forEach(resp.data.rows, function (kitem) {
                        kitem.ContentShow = false;
                        angular.forEach(kitem.AppointmentDetails, function (hitem) {
                            let today = $filter('date')(new Date(), "yyyy-MM-dd");
                            let datetime = today + " " + hitem.StartTime;
                            hitem.StartTime = $filter('date')(new Date(datetime), "hh:mm a");
                            tempArray.push(hitem);
                        });
                    });
                    $scope.ListCountsObj.CancelAppointmentsCount = tempArray.length || 0;
                }
                $scope.DashboardCancelledApptDetails = angular.copy(resp.data.rows);

                if (type == "export") {
                    generateTableNew($scope.DashboardCancelledApptDetails, $scope.viewtype);
                }

            }

        }, function () {

        });


    }

    function getNoShowApptDetails(HospitalIdsList,type) {
        var selectedDoctors = $filter("filter")($scope.NewPatientReportDoctorList, function (iterator, ind) { return iterator.isChecked == true; });
        if (selectedDoctors.length == 0) {
            alertify.error("Please Select Doctor");
            return false;
        }
        var newlist = "";
        for (var i in $scope.NewPatientReportDoctorList) {
            if ($scope.NewPatientReportDoctorList[i].isChecked) {
                newlist += "," + $scope.NewPatientReportDoctorList[i].DoctorID;
            }
        }
        if (newlist.charAt(0) === ",") {
            newlist = newlist.slice(1);
        }

        let newlist1 = "";
        for (let i in $scope.Visitreasons) {
            if ($scope.Visitreasons[i].isChecked) {
                newlist1 += "," + $scope.Visitreasons[i].ReasonId;
            }
        }

        if (newlist1.charAt(0) === ",") {
            newlist1 = newlist1.slice(1);
        }


        let newlist2 = "";
        for (let i in $scope.appointmentTypes) {
            if ($scope.appointmentTypes[i].isChecked) {
                newlist2 += "," + $scope.appointmentTypes[i].Id;
            }
        }

        if (newlist2.charAt(0) === ",") {
            newlist2 = newlist2.slice(1);
        }

        let list3 = "";
        for (let i in $scope.confirmationStatusArray) {
            if ($scope.confirmationStatusArray[i].IsChecked) {
                list3 += "," + $scope.confirmationStatusArray[i].ConfirmationStatusId;
            }
        }
        if (list3.charAt(0) === ",") {
            list3 = list3.slice(1);
        }

        //var req = {
        //    "Fromdate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_StartDate), "yyyy-MM-dd"),
        //    "Todate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_EndDate), "yyyy-MM-dd"),
        //    "HospitalIdsList": HospitalIdsList.length > 0 ? HospitalIdsList : "",
        //    "DoctorsIds": newlist || "",
        //    "VisitTypeId": $scope.GetDataOnMainDashBoardObj.VisitTypeId || null
        //};
        //eHnoteMainDashboardDataServices.GetNoShowAppointmentsDetails(req).then(function (resp) {
        //    if (resp.data.status === "Success") {
        //        if (resp.data.rows.length > 0) {
        //            let tempArray = [];
        //            angular.forEach(resp.data.rows, function (kitem) {
        //                kitem.ContentShow = false;
        //                angular.forEach(kitem.NoShowPatientAppointment, function (hitem) {
        //                    let today = $filter('date')(new Date(), "yyyy-MM-dd");
        //                    let datetime = today + " " + hitem.StartTime;
        //                    hitem.StartTime = $filter('date')(new Date(datetime), "hh:mm a");
        //                    tempArray.push(hitem);
        //                });
        //            });
        //            $scope.ListCountsObj.NoShowAppointmentsCount = tempArray.length || 0;
        //        }
        //        $scope.DashboardNoShowApptDetails = angular.copy(resp.data.rows);

        //    }

        //}, function () {


        //});

        let list5 = "";
        for (var i in $scope.AppointmentStatusArray) {
            if ($scope.AppointmentStatusArray[i].IsChecked) {
                list5 += "," + $scope.AppointmentStatusArray[i].AppointmentStatusId;
            }
        }
        if (list5.charAt(0) === ",") {
            list5 = list5.slice(1);
        }

        let list4 = "";
        for (var i in $scope.BookedstatusFilterList) {
            if ($scope.BookedstatusFilterList[i].IsChecked) {
                list4 += "," + $scope.BookedstatusFilterList[i].Id;
            }
        }
        if (list4.charAt(0) === ",") {
            list4 = list4.slice(1);
        }

        let list6 = "";
        for (var i in $scope.BookingTypesArray) {
            if ($scope.BookingTypesArray[i].IsChecked) {
                list6 += "," + $scope.BookingTypesArray[i].BookingTypeId;
            }
        }
        if (list6.charAt(0) === ",") {
            list6 = list6.slice(1);
        }
        var req = {
            "Fromdate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_StartDate), "yyyy-MM-dd"),
            "Todate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_EndDate), "yyyy-MM-dd"),
            "HospitalIdsList": HospitalIdsList.length > 0 ? HospitalIdsList : "",
            "DoctorsIds": newlist || "",
            //"VisitTypeId": $scope.GetDataOnMainDashBoardObj.VisitTypeId || null,
            "AppointmentTypeIds": newlist2,
            "VisitReasons": newlist1,
            //"AppointmentStatusIds": list5 || "",
            "BookingStatusIds": list4 || "",
            "BookingTypeIds": list6 || "",
            "DashboardType": 14
        };
        eHnoteMainDashboardDataServices.GetDashboardAppointmentDetails(req).then(function (resp) {
            if (resp.data.status === "Success") {
                if (resp.data.rows.length > 0) {
                    let tempArray = [];
                    angular.forEach(resp.data.rows, function (kitem) {
                        kitem.ContentShow = false;
                        angular.forEach(kitem.AppointmentDetails, function (hitem) {
                            let today = $filter('date')(new Date(), "yyyy-MM-dd");
                            let datetime = today + " " + hitem.StartTime;
                            hitem.StartTime = $filter('date')(new Date(datetime), "hh:mm a");
                            tempArray.push(hitem);
                        });
                    });
                    $scope.ListCountsObj.NoShowAppointmentsCount = tempArray.length || 0;
                }
                $scope.DashboardNoShowApptDetails = angular.copy(resp.data.rows);


                if (type == "export") {
                    generateTableNew($scope.DashboardNoShowApptDetails, $scope.viewtype);
                }

            }

        }, function () {


        });


    }

    function GetSameDayCancelAppointmentDetails (HospitalIdsList,type) {

        var selectedDoctors = $filter("filter")($scope.NewPatientReportDoctorList, function (iterator, ind) { return iterator.isChecked == true; });
        if (selectedDoctors.length == 0) {
            alertify.error("Please Select Doctor");
            return false;
        }
        var newlist = "";
        for (var i in $scope.NewPatientReportDoctorList) {
            if ($scope.NewPatientReportDoctorList[i].isChecked) {
                newlist += "," + $scope.NewPatientReportDoctorList[i].DoctorID;
            }
        }
        if (newlist.charAt(0) === ",") {
            newlist = newlist.slice(1);
        }

        let newlist1 = "";
        for (let i in $scope.Visitreasons) {
            if ($scope.Visitreasons[i].isChecked) {
                newlist1 += "," + $scope.Visitreasons[i].ReasonId;
            }
        }

        if (newlist1.charAt(0) === ",") {
            newlist1 = newlist1.slice(1);
        }

        let newlist2 = "";
        for (let i in $scope.appointmentTypes) {
            if ($scope.appointmentTypes[i].isChecked) {
                newlist2 += "," + $scope.appointmentTypes[i].Id;
            }
        }

        if (newlist2.charAt(0) === ",") {
            newlist2 = newlist2.slice(1);
        }

        let list3 = "";
        for (let i in $scope.confirmationStatusArray) {
            if ($scope.confirmationStatusArray[i].IsChecked) {
                list3 += "," + $scope.confirmationStatusArray[i].ConfirmationStatusId;
            }
        }
        if (list3.charAt(0) === ",") {
            list3 = list3.slice(1);
        }

        //var req = {
        //    "Fromdate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_StartDate), "yyyy-MM-dd"),
        //    "Todate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_EndDate), "yyyy-MM-dd"),
        //    "HospitalIdsList": HospitalIdsList.length > 0 ? HospitalIdsList : "",
        //    "DoctorsIds": newlist || "",
        //    "VisitTypeId": $scope.GetDataOnMainDashBoardObj.VisitTypeId || null
        //};
        //eHnoteMainDashboardDataServices.GetSameDayCancelAppointmentDetails(req).then(function (resp) {
        //    if (resp.data.status === "Success") {
        //        if (resp.data.rows.length > 0) {
        //            let tempArray = [];
        //            angular.forEach(resp.data.rows, function (kitem) {
        //                kitem.ContentShow = false;
        //                angular.forEach(kitem.SamedayCancelAppointment, function (hitem) {
        //                    let today = $filter('date')(new Date(), "yyyy-MM-dd");
        //                    let datetime = today + " " + hitem.StartTime;
        //                    hitem.StartTime = $filter('date')(new Date(datetime), "hh:mm a");
        //                    tempArray.push(hitem);
        //                });
        //            });
        //            $scope.ListCountsObj.SameDayCancelAppointmentsCount = tempArray.length || 0;
        //        }
        //        $scope.DashboardSameDayCancelApptDetails = angular.copy(resp.data.rows);

        //    }

        //}, function () {


        //});
        let list5 = "";
        for (var i in $scope.AppointmentStatusArray) {
            if ($scope.AppointmentStatusArray[i].IsChecked) {
                list5 += "," + $scope.AppointmentStatusArray[i].AppointmentStatusId;
            }
        }
        if (list5.charAt(0) === ",") {
            list5 = list5.slice(1);
        }

        let list4 = "";
        for (var i in $scope.BookedstatusFilterList) {
            if ($scope.BookedstatusFilterList[i].IsChecked) {
                list4 += "," + $scope.BookedstatusFilterList[i].Id;
            }
        }
        if (list4.charAt(0) === ",") {
            list4 = list4.slice(1);
        }

        let list6 = "";
        for (var i in $scope.BookingTypesArray) {
            if ($scope.BookingTypesArray[i].IsChecked) {
                list6 += "," + $scope.BookingTypesArray[i].BookingTypeId;
            }
        }
        if (list6.charAt(0) === ",") {
            list6 = list6.slice(1);
        }

        var req = {
            "Fromdate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_StartDate), "yyyy-MM-dd"),
            "Todate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_EndDate), "yyyy-MM-dd"),
            "HospitalIdsList": HospitalIdsList.length > 0 ? HospitalIdsList : "",
            "DoctorsIds": newlist || "",
            //"VisitTypeId": $scope.GetDataOnMainDashBoardObj.VisitTypeId || null,
            "AppointmentTypeIds": newlist2,
            "VisitReasons": newlist1,
            //"AppointmentStatusIds": list5 || "",
            "BookingStatusIds": list4 || "",
            "BookingTypeIds": list6 || "",
            // "BookingTypeIds": list6 || "",
            //"StatusIds": list3,
            "DashboardType": 17
        };
        eHnoteMainDashboardDataServices.GetDashboardAppointmentDetails(req).then(function (resp) {
            if (resp.data.status === "Success") {
                if (resp.data.rows.length > 0) {
                    let tempArray = [];
                    angular.forEach(resp.data.rows, function (kitem) {
                        kitem.ContentShow = false;
                        angular.forEach(kitem.AppointmentDetails, function (hitem) {
                            let today = $filter('date')(new Date(), "yyyy-MM-dd");
                            let datetime = today + " " + hitem.StartTime;
                            hitem.StartTime = $filter('date')(new Date(datetime), "hh:mm a");
                            tempArray.push(hitem);
                        });
                    });
                    $scope.ListCountsObj.SameDayCancelAppointmentsCount = tempArray.length || 0;
                }
                $scope.DashboardSameDayCancelApptDetails = angular.copy(resp.data.rows);

                if (type == "export") {
                    generateTableNew($scope.DashboardSameDayCancelApptDetails, $scope.viewtype);
                }
            }

        }, function () {

        });

    };

    function GetSeenAppointmentDetails(HospitalIdsList,type) {

        var selectedDoctors = $filter("filter")($scope.NewPatientReportDoctorList, function (iterator, ind) { return iterator.isChecked == true; });
        if (selectedDoctors.length == 0) {
            alertify.error("Please Select Doctor");
            return false;
        }
        var newlist = "";
        for (var i in $scope.NewPatientReportDoctorList) {
            if ($scope.NewPatientReportDoctorList[i].isChecked) {
                newlist += "," + $scope.NewPatientReportDoctorList[i].DoctorID;
            }
        }
        if (newlist.charAt(0) === ",") {
            newlist = newlist.slice(1);
        }

        let newlist1 = "";
        for (let i in $scope.Visitreasons) {
            if ($scope.Visitreasons[i].isChecked) {
                newlist1 += "," + $scope.Visitreasons[i].ReasonId;
            }
        }

        if (newlist1.charAt(0) === ",") {
            newlist1 = newlist1.slice(1);
        }

        let newlist2 = "";
        for (let i in $scope.appointmentTypes) {
            if ($scope.appointmentTypes[i].isChecked) {
                newlist2 += "," + $scope.appointmentTypes[i].Id;
            }
        }

        if (newlist2.charAt(0) === ",") {
            newlist2 = newlist2.slice(1);
        }

        let list3 = "";
        for (let i in $scope.confirmationStatusArray) {
            if ($scope.confirmationStatusArray[i].IsChecked) {
                list3 += "," + $scope.confirmationStatusArray[i].ConfirmationStatusId;
            }
        }
        if (list3.charAt(0) === ",") {
            list3 = list3.slice(1);
        }

        let list5 = "";
        for (var i in $scope.AppointmentStatusArray) {
            if ($scope.AppointmentStatusArray[i].IsChecked) {
                list5 += "," + $scope.AppointmentStatusArray[i].AppointmentStatusId;
            }
        }
        if (list5.charAt(0) === ",") {
            list5 = list5.slice(1);
        }

        let list4 = "";
        for (var i in $scope.BookedstatusFilterList) {
            if ($scope.BookedstatusFilterList[i].IsChecked) {
                list4 += "," + $scope.BookedstatusFilterList[i].Id;
            }
        }
        if (list4.charAt(0) === ",") {
            list4 = list4.slice(1);
        }

        let list6 = "";
        for (var i in $scope.BookingTypesArray) {
            if ($scope.BookingTypesArray[i].IsChecked) {
                list6 += "," + $scope.BookingTypesArray[i].BookingTypeId;
            }
        }
        if (list6.charAt(0) === ",") {
            list6 = list6.slice(1);
        }

        var req = {
            "Fromdate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_StartDate), "yyyy-MM-dd"),
            "Todate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_EndDate), "yyyy-MM-dd"),
            "HospitalIdsList": HospitalIdsList.length > 0 ? HospitalIdsList : "",
            "DoctorsIds": newlist || "",
            //"VisitTypeId": $scope.GetDataOnMainDashBoardObj.VisitTypeId || null,
            "AppointmentTypeIds": newlist2,
            "VisitReasons": newlist1,
            //"AppointmentStatusIds": list5 || "",
            "BookingStatusIds": list4 || "",
            "BookingTypeIds": list6 || "",
            "DashboardType": 15
        };
        eHnoteMainDashboardDataServices.GetDashboardAppointmentDetails(req).then(function (resp) {
            if (resp.data.status === "Success") {
                if (resp.data.rows.length > 0) {
                    let tempArray = [];
                    angular.forEach(resp.data.rows, function (kitem) {
                        kitem.ContentShow = false;
                        angular.forEach(kitem.AppointmentDetails, function (hitem) {
                            let today = $filter('date')(new Date(), "yyyy-MM-dd");
                            let datetime = today + " " + hitem.StartTime;
                            hitem.StartTime = $filter('date')(new Date(datetime), "hh:mm a");
                            tempArray.push(hitem);
                        });
                    });
                    $scope.ListCountsObj.SeenAppointmentsCount = tempArray.length || 0;
                }
                $scope.DashboardSeenApptDetails = angular.copy(resp.data.rows);


                if (type == "export") {
                    generateTableNew($scope.DashboardSeenApptDetails, $scope.viewtype);
                }

            }

        }, function () {


        });



    };

    // appointment statistics reports

    var mObj = datapersistanceFactory.getItem("masterDataArrays");

    $scope.AppointmentStatusArray = [];
    $scope.BookingTypesArray = [];
    mObj.masterAppointmentStatus = mObj.masterAppointmentStatus || [];
    if (mObj.masterAppointmentStatus.length > 0) {
        $scope.AppointmentStatusArray = mObj.masterAppointmentStatus || [];

    } else {

        $scope.AppointmentStatusArray = [
            {
                "AppointmentStatusId": 1,
                "StatusName": "Not Checked In",

            },
            {
                "AppointmentStatusId": 2,
                "StatusName": "Check In",

            },
            {
                "AppointmentStatusId": 3,
                "StatusName": "Check  Out",

            },
            {
                "AppointmentStatusId": 4,
                "StatusName": "Express Check Out",

            },
            {
                "AppointmentStatusId": 5,
                "StatusName": "Planned Cancel",

            },
            {
                "AppointmentStatusId": 6,
                "StatusName": "Check-In Cancelled",

            },
            {
                "AppointmentStatusId": 7,
                "StatusName": "Same Day Cancelled",

            },
            {
                "AppointmentStatusId": 8,
                "StatusName": "Planed Reschedule",

            },
            {
                "AppointmentStatusId": 9,
                "StatusName": "Same Day Reschedule",

            },
            {
                "AppointmentStatusId": 10,
                "StatusName": "Check-In Reschedule",

            },
            {
                "AppointmentStatusId": 11,
                "StatusName": "No Show",

            }
        ]

    };
    if ($scope.AppointmentStatusArray.length > 0) {
        angular.forEach($scope.AppointmentStatusArray, function (kitem) {
            kitem.IsChecked = true;

        });
    }
    $scope.UserAppointmentStatusArray = $filter("filter")($scope.AppointmentStatusArray, function (item) {
        return item.AppointmentStatusId === 1 || item.AppointmentStatusId === 5 || item.AppointmentStatusId === 7 || item.AppointmentStatusId === 8 || item.AppointmentStatusId === 9 ;
    })||[];


    mObj.masterBookingTypes = mObj.masterBookingTypes || [];
    if (mObj.masterBookingTypes.length > 0) {
        $scope.BookingTypesArray = mObj.masterBookingTypes || [];

    } else {
        $scope.BookingTypesArray = [
            {
                "BookingTypeId": 1,
                "BookingType": "WalkIn",

            },
            {
                "BookingTypeId": 2,
                "BookingType": "Waiting",

            },
            {
                "BookingTypeId": 3,
                "BookingType": "By Appointment",

            }
        ]
    };

    if ($scope.BookingTypesArray.length > 0) {
        angular.forEach($scope.BookingTypesArray, function (kitem) {
            kitem.IsChecked = true;
        });
    }


    $scope.getBookedstatusArray = [
        {
            "Id": 1,
            "Name": "Confirmed",
            "IsChecked": true
        },
        {
            "Id": 2,
            "Name": "Not Confirmed",
            "IsChecked": true
        }]
    $scope.BookedstatusFilterList = angular.copy($scope.getBookedstatusArray);


    $scope.BookedTypeObj = {
        "SelectStatusString": "Select Status",
        "Name": "",
        "AllStatusCheck": true
    };
    $scope.checkAllBookedType = function (val) {
        if (val) {
            angular.forEach($scope.BookingTypesArray, function (item) {
                item.IsChecked = true;
            });

            $scope.BookedTypeObj.SelectStatusString = 'All';
        }
        else {
            angular.forEach($scope.BookingTypesArray, function (item) {
                item.IsChecked = false;
            });

            $scope.BookedTypeObj.SelectStatusString = 'Select Status';
        }

    };
    $scope.BookedTypeToggle = function (obj) {
        var checkedArray = _.where($scope.BookingTypesArray, { IsChecked: true });
        $scope.BookedTypeObj.AllStatusCheck = checkedArray.length > 0 && $scope.BookingTypesArray.length === checkedArray.length ? true : false;
        if ($scope.BookedTypeObj.AllStatusCheck) {
            $scope.BookedTypeObj.SelectStatusString = 'All';
        }

        if (!$scope.BookedTypeObj.AllStatusCheck && checkedArray.length > 0) {
            $scope.BookedTypeObj.SelectStatusString = 'Selected';
        }
    };



    $scope.StatusListObj = {
        "SelectStatusString": "Select Status",
        "Name": "",
        "AllStatusCheck": false,
        "AllUserStatusCheck": false,
        "SelectUserStatusString": "Select Status",
    };

    $scope.checkAllStatus = function (val) {
        if (val) {
            angular.forEach($scope.AppointmentStatusArray, function (item) {
                item.IsChecked = true;
            });

            $scope.StatusListObj.SelectStatusString = 'All';
        }
        else {
            angular.forEach($scope.AppointmentStatusArray, function (item) {
                item.IsChecked = false;
            });

            $scope.StatusListObj.SelectStatusString = 'Select Status';
        }

    };
    $scope.StatusToggle = function (obj) {
        var checkedArray = _.where($scope.AppointmentStatusArray, { IsChecked: true });
        $scope.StatusListObj.AllStatusCheck = checkedArray.length > 0 && $scope.AppointmentStatusArray.length === checkedArray.length ? true : false;
        if ($scope.StatusListObj.AllStatusCheck) {
            $scope.StatusListObj.SelectStatusString = 'All';
        }

        if (!$scope.StatusListObj.AllStatusCheck && checkedArray.length > 0) {
            $scope.StatusListObj.SelectStatusString = 'Selected';
        }
    };
    $scope.UserStatusToggle = function (obj) {
        var checkedArray = _.where($scope.UserAppointmentStatusArray, { IsChecked: true });
        $scope.StatusListObj.AllUserStatusCheck = checkedArray.length > 0 && $scope.UserAppointmentStatusArray.length === checkedArray.length ? true : false;
        if ($scope.StatusListObj.AllUserStatusCheck) {
            $scope.StatusListObj.SelectUserStatusString = 'All';
        }

        if (!$scope.StatusListObj.AllUserStatusCheck && checkedArray.length > 0) {
            $scope.StatusListObj.SelectUserStatusString = 'Selected';
        }
    };
    $scope.checkAllUserStatus = function (val) {
        if (val) {
            angular.forEach($scope.UserAppointmentStatusArray, function (item) {
                item.IsChecked = true;
            });

            $scope.StatusListObj.SelectUserStatusString = 'All';
        }
        else {
            angular.forEach($scope.UserAppointmentStatusArray, function (item) {
                item.IsChecked = false;
            });

            $scope.StatusListObj.SelectUserStatusString = 'Select Status';
        }

    };


    $scope.BookedStatusListObj = {
        "SelectStatusString": "Select Status",
        "Name": "",
        "AllStatusCheck": true
    };
    $scope.checkAllBookedStatus = function (val) {
        if (val) {
            angular.forEach($scope.BookedstatusFilterList, function (item) {
                item.IsChecked = true;
            });

            $scope.BookedStatusListObj.SelectStatusString = 'All';
        }
        else {
            angular.forEach($scope.BookedstatusFilterList, function (item) {
                item.IsChecked = false;
            });

            $scope.BookedStatusListObj.SelectStatusString = 'Select Status';
        }

    };
    $scope.BookedStatusToggle = function (obj) {
        var checkedArray = _.where($scope.BookedstatusFilterList, { IsChecked: true });
        $scope.BookedStatusListObj.AllStatusCheck = checkedArray.length > 0 && $scope.BookedstatusFilterList.length === checkedArray.length ? true : false;
        if ($scope.BookedStatusListObj.AllStatusCheck) {
            $scope.BookedStatusListObj.SelectStatusString = 'All';
        }

        if (!$scope.BookedStatusListObj.AllStatusCheck && checkedArray.length > 0) {
            $scope.BookedStatusListObj.SelectStatusString = 'Selected';
        }
    };





    $scope.AppointmentTypeToggle = function (item) {
        var checkedArray = _.where($scope.appointmentTypes, { isChecked: true });
        $scope.AllDoctorsObj.AllAppointmentTypeStatusCheck = checkedArray.length > 0 && $scope.appointmentTypes.length === checkedArray.length ? true : false;
        if ($scope.AllDoctorsObj.AllAppointmentTypeStatusCheck) {
            $scope.selectVisitType = 'All';
        } else {
            if (checkedArray.length > 0) {
                $scope.selectVisitType = 'Selected';
            }
        }
    };

    $scope.checkAllAppointmenTypeStatus = function (val) {
        if (val) {
            angular.forEach($scope.appointmentTypes, function (item) {
                item.isChecked = true;
            });

            $scope.selectVisitType = 'All';
        }
        else {
            angular.forEach($scope.appointmentTypes, function (item) {
                item.isChecked = false;
            });

            $scope.selectVisitType = 'All Visit Types';
        }
        var checkedArray = _.where($scope.appointmentTypes, { isChecked: true });
        $scope.AllDoctorsObj.AllAppointmentTypeStatusCheck = checkedArray.length > 0 && $scope.appointmentTypes.length === checkedArray.length ? true : false;
    };

    $scope.GetVisitReasonsNew = function () {
        var obj = {
            "OrganizationId": $scope.hospitalid1,
            "UserId": doctorinfo.doctorid,
            "VisitTypeId": 0,
            "visitReasonSearch": "",
            "PageNumber": 1,
            "PageSize": 1000,
            "IsFrequent": "N"
        };
        //eHnotePatientVisitReasonServices.GetOrganizationActiveAppointmentVisitReasonsById(obj).then(function (resp) {
        eHnotePatientVisitReasonServices.GetOrganizationActiveAndInActiveApptVisitReasons(obj).then(function (resp) {
            if (resp.data !== undefined) {
                if (resp.data.rows.length > 0) {
                    angular.forEach(resp.data.rows, function (item) {
                        item.isChecked = true;
                    });
                    $scope.Visitreasons = angular.copy(resp.data.rows);
                    $scope.AllVisitreasons = angular.copy(resp.data.rows);

                }
            }
        });
    };
    $scope.GetVisitReasonsNew();

    $scope.selectedVisitReason = "All Visit Reasons";

    $scope.checkAllVisitReasons = function (val) {
        if (val) {
            angular.forEach($scope.Visitreasons, function (item) {
                item.isChecked = true;
            });
            $scope.selectedVisitReason = 'All';
        } else {
            angular.forEach($scope.Visitreasons, function (item) {
                item.isChecked = false;
            });
            $scope.selectedVisitReason = 'Select Visit Reasons';
        }
        var checkedArray = _.where($scope.Visitreasons, { isChecked: true });
        $scope.AllDoctorsObj.AllVisitReasonsCheck = checkedArray.length > 0 && $scope.Visitreasons.length === checkedArray.length ? true : false;
    };

    $scope.VisitRsnToggle = function (item) {
        var checkedArray = _.where($scope.Visitreasons, { isChecked: true });
        $scope.AllDoctorsObj.AllVisitReasonsCheck = checkedArray.length > 0 && $scope.Visitreasons.length === checkedArray.length ? true : false;

        if ($scope.AllDoctorsObj.AllVisitReasonsCheck) {
            $scope.selectedVisitReason = 'All';
        } else {
            if (checkedArray.length > 0) {
                $scope.selectedVisitReason = 'Selected';
            }
        }

    };


    /*$scope.DatesListNew = ["2023-09-06", "2023-09-07", "2023-09-08", "2023-09-09", "2023-09-10", "2023-09-11","2023-09-12"];*/

    $scope.ApptStatisticsArray1 = [
        {
            "Type": "Active Appts",
            "Total": 44,
            "Average": 44,
            "AppointmentDatesList": [
                {
                    "AppointmentCount": 44,
                    "AppointmentDate": "2023-09-06"
                },
                {
                    "AppointmentCount": 12,
                    "AppointmentDate": "2023-09-07"
                },
                {
                    "AppointmentCount": 1,
                    "AppointmentDate": "2023-09-08"
                },
                {
                    "AppointmentCount": 2,
                    "AppointmentDate": "2023-09-09"
                },
                {
                    "AppointmentCount": 3,
                    "AppointmentDate": "2023-09-10"
                },
                {
                    "AppointmentCount": 5,
                    "AppointmentDate": "2023-09-11"
                },
                {
                    "AppointmentCount": 0,
                    "AppointmentDate": "2023-09-12"
                },
            ]
        },
        {
            "Type": "New Appts",
            "Total": 10,
            "Average": 10,
            "AppointmentDatesList": [
                {
                    "AppointmentCount": 44,
                    "AppointmentDate": "2023-09-06"
                },
                {
                    "AppointmentCount": 12,
                    "AppointmentDate": "2023-09-07"
                },
                {
                    "AppointmentCount": 1,
                    "AppointmentDate": "2023-09-08"
                },
                {
                    "AppointmentCount": 2,
                    "AppointmentDate": "2023-09-09"
                },
                {
                    "AppointmentCount": 3,
                    "AppointmentDate": "2023-09-10"
                },
                {
                    "AppointmentCount": 5,
                    "AppointmentDate": "2023-09-11"
                },
                {
                    "AppointmentCount": 0,
                    "AppointmentDate": "2023-09-12"
                },
            ]
        },
        {
            "Type": "Cancelled Appts (same day)",
            "Total": 1,
            "Average": 1,
            "AppointmentDatesList": [
                {
                    "AppointmentCount": 44,
                    "AppointmentDate": "2023-09-06"
                },
                {
                    "AppointmentCount": 12,
                    "AppointmentDate": "2023-09-07"
                },
                {
                    "AppointmentCount": 1,
                    "AppointmentDate": "2023-09-08"
                },
                {
                    "AppointmentCount": 2,
                    "AppointmentDate": "2023-09-09"
                },
                {
                    "AppointmentCount": 3,
                    "AppointmentDate": "2023-09-10"
                },
                {
                    "AppointmentCount": 5,
                    "AppointmentDate": "2023-09-11"
                },
                {
                    "AppointmentCount": 0,
                    "AppointmentDate": "2023-09-12"
                },
            ]
        },
        {
            "Type": "No Show Appts",
            "Total": 1,
            "Average": 1,
            "AppointmentDatesList": [
                {
                    "AppointmentCount": 44,
                    "AppointmentDate": "2023-09-06"
                },
                {
                    "AppointmentCount": 12,
                    "AppointmentDate": "2023-09-07"
                },
                {
                    "AppointmentCount": 1,
                    "AppointmentDate": "2023-09-08"
                },
                {
                    "AppointmentCount": 2,
                    "AppointmentDate": "2023-09-09"
                },
                {
                    "AppointmentCount": 3,
                    "AppointmentDate": "2023-09-10"
                },
                {
                    "AppointmentCount": 5,
                    "AppointmentDate": "2023-09-11"
                },
                {
                    "AppointmentCount": 0,
                    "AppointmentDate": "2023-09-12"
                },
            ]
        },
        {
            "Type": "Cancelled (same day) + No Show",
            "Total": 1,
            "Average": 1,
            "AppointmentDatesList": [
                {
                    "AppointmentCount": 44,
                    "AppointmentDate": "2023-09-06"
                },
                {
                    "AppointmentCount": 12,
                    "AppointmentDate": "2023-09-07"
                },
                {
                    "AppointmentCount": 1,
                    "AppointmentDate": "2023-09-08"
                },
                {
                    "AppointmentCount": 2,
                    "AppointmentDate": "2023-09-09"
                },
                {
                    "AppointmentCount": 3,
                    "AppointmentDate": "2023-09-10"
                },
                {
                    "AppointmentCount": 5,
                    "AppointmentDate": "2023-09-11"
                },
                {
                    "AppointmentCount": 0,
                    "AppointmentDate": "2023-09-12"
                },
            ]
        },
        {
            "Type": "Seen Appts",
            "Total": 0,
            "Average": 0,
            "AppointmentDatesList": [
                {
                    "AppointmentCount": 44,
                    "AppointmentDate": "2023-09-06"
                },
                {
                    "AppointmentCount": 12,
                    "AppointmentDate": "2023-09-07"
                },
                {
                    "AppointmentCount": 1,
                    "AppointmentDate": "2023-09-08"
                },
                {
                    "AppointmentCount": 2,
                    "AppointmentDate": "2023-09-09"
                },
                {
                    "AppointmentCount": 3,
                    "AppointmentDate": "2023-09-10"
                },
                {
                    "AppointmentCount": 5,
                    "AppointmentDate": "2023-09-11"
                },
                {
                    "AppointmentCount": 0,
                    "AppointmentDate": "2023-09-12"
                },
            ]
        },
        {
            "Type": "Walkin Appts",
            "Total": 1,
            "Average": 1,
            "AppointmentDatesList": [
                {
                    "AppointmentCount": 44,
                    "AppointmentDate": "2023-09-06"
                },
                {
                    "AppointmentCount": 12,
                    "AppointmentDate": "2023-09-07"
                },
                {
                    "AppointmentCount": 1,
                    "AppointmentDate": "2023-09-08"
                },
                {
                    "AppointmentCount": 2,
                    "AppointmentDate": "2023-09-09"
                },
                {
                    "AppointmentCount": 3,
                    "AppointmentDate": "2023-09-10"
                },
                {
                    "AppointmentCount": 5,
                    "AppointmentDate": "2023-09-11"
                },
                {
                    "AppointmentCount": 0,
                    "AppointmentDate": "2023-09-12"
                },
            ]
        },
        {
            "Type": "Seen + Walkin",
            "Total": 0,
            "Average": 0,
            "AppointmentDatesList": [
                {
                    "AppointmentCount": 44,
                    "AppointmentDate": "2023-09-06"
                },
                {
                    "AppointmentCount": 12,
                    "AppointmentDate": "2023-09-07"
                },
                {
                    "AppointmentCount": 1,
                    "AppointmentDate": "2023-09-08"
                },
                {
                    "AppointmentCount": 2,
                    "AppointmentDate": "2023-09-09"
                },
                {
                    "AppointmentCount": 3,
                    "AppointmentDate": "2023-09-10"
                },
                {
                    "AppointmentCount": 5,
                    "AppointmentDate": "2023-09-11"
                },
                {
                    "AppointmentCount": 0,
                    "AppointmentDate": "2023-09-12"
                },
            ]
        },
        {
            "Type": "Confirmed",
            "Total": 0,
            "Average": 0,
            "AppointmentDatesList": [
                {
                    "AppointmentCount": 44,
                    "AppointmentDate": "2023-09-06"
                },
                {
                    "AppointmentCount": 12,
                    "AppointmentDate": "2023-09-07"
                },
                {
                    "AppointmentCount": 1,
                    "AppointmentDate": "2023-09-08"
                },
                {
                    "AppointmentCount": 2,
                    "AppointmentDate": "2023-09-09"
                },
                {
                    "AppointmentCount": 3,
                    "AppointmentDate": "2023-09-10"
                },
                {
                    "AppointmentCount": 5,
                    "AppointmentDate": "2023-09-11"
                },
                {
                    "AppointmentCount": 0,
                    "AppointmentDate": "2023-09-12"
                },
            ]
        },
        {
            "Type": "Not Confirmed",
            "Total": 0,
            "Average": 0,
            "AppointmentDatesList": [
                {
                    "AppointmentCount": 44,
                    "AppointmentDate": "2023-09-06"
                },
                {
                    "AppointmentCount": 12,
                    "AppointmentDate": "2023-09-07"
                },
                {
                    "AppointmentCount": 1,
                    "AppointmentDate": "2023-09-08"
                },
                {
                    "AppointmentCount": 2,
                    "AppointmentDate": "2023-09-09"
                },
                {
                    "AppointmentCount": 3,
                    "AppointmentDate": "2023-09-10"
                },
                {
                    "AppointmentCount": 5,
                    "AppointmentDate": "2023-09-11"
                },
                {
                    "AppointmentCount": 0,
                    "AppointmentDate": "2023-09-12"
                },
            ]
        },
        {
            "Type": "No Show Confirmed",
            "Total": 0,
            "Average": 0,
            "AppointmentDatesList": [
                {
                    "AppointmentCount": 44,
                    "AppointmentDate": "2023-09-06"
                },
                {
                    "AppointmentCount": 12,
                    "AppointmentDate": "2023-09-07"
                },
                {
                    "AppointmentCount": 1,
                    "AppointmentDate": "2023-09-08"
                },
                {
                    "AppointmentCount": 2,
                    "AppointmentDate": "2023-09-09"
                },
                {
                    "AppointmentCount": 3,
                    "AppointmentDate": "2023-09-10"
                },
                {
                    "AppointmentCount": 5,
                    "AppointmentDate": "2023-09-11"
                },
                {
                    "AppointmentCount": 0,
                    "AppointmentDate": "2023-09-12"
                },
            ]
        },
        {
            "Type": "No Show No Confirmed",
            "Total": 0,
            "Average": 0,
            "AppointmentDatesList": [
                {
                    "AppointmentCount": 44,
                    "AppointmentDate": "2023-09-06"
                },
                {
                    "AppointmentCount": 12,
                    "AppointmentDate": "2023-09-07"
                },
                {
                    "AppointmentCount": 1,
                    "AppointmentDate": "2023-09-08"
                },
                {
                    "AppointmentCount": 2,
                    "AppointmentDate": "2023-09-09"
                },
                {
                    "AppointmentCount": 3,
                    "AppointmentDate": "2023-09-10"
                },
                {
                    "AppointmentCount": 5,
                    "AppointmentDate": "2023-09-11"
                },
                {
                    "AppointmentCount": 0,
                    "AppointmentDate": "2023-09-12"
                },
            ]
        },
        {
            "Type": "Total No Show",
            "Total": 0,
            "Average": 0,
            "AppointmentDatesList": [
                {
                    "AppointmentCount": 44,
                    "AppointmentDate": "2023-09-06"
                },
                {
                    "AppointmentCount": 12,
                    "AppointmentDate": "2023-09-07"
                },
                {
                    "AppointmentCount": 1,
                    "AppointmentDate": "2023-09-08"
                },
                {
                    "AppointmentCount": 2,
                    "AppointmentDate": "2023-09-09"
                },
                {
                    "AppointmentCount": 3,
                    "AppointmentDate": "2023-09-10"
                },
                {
                    "AppointmentCount": 5,
                    "AppointmentDate": "2023-09-11"
                },
                {
                    "AppointmentCount": 0,
                    "AppointmentDate": "2023-09-12"
                },
            ]
        },
    ];

    $scope.ApptStatisticsArray = [];

    $scope.GetApptStatistics = function (type) {

        if (!eHnoteMainAppointmentService.Is7DaysCount($scope.GetNewPatientReportObj.FromDate, $scope.GetNewPatientReportObj.ToDate)) {
            alertify.log("More than 31 days not allowed");
            return;
        }
        let selectedDoctors = $filter("filter")($scope.NewPatientReportDoctorList, function (iterator, ind) { return iterator.isChecked == true; });
        if (selectedDoctors.length === 0) {
            alertify.error("Please Select Doctor");
            return false;
        }
        $scope.hospitalClinicIds = $scope.ApptBranchLocations.filter(hitem => hitem.IsChecked == true).map(h => h.ClinicId);
        var hospitalIds = $scope.hospitalClinicIds.join(',')
        var getAllHospitalInd = $scope.hospitalClinicIds.length > 1 ? true : false;
        let FromDate = $filter('date')(new Date($scope.GetNewPatientReportObj.FromDate), "yyyy-MM-dd");
        let ToDate = $filter('date')(new Date($scope.GetNewPatientReportObj.ToDate), "yyyy-MM-dd");
        let newlist = "";
        for (let i in $scope.NewPatientReportDoctorList) {
            if ($scope.NewPatientReportDoctorList[i].isChecked) {
                newlist += "," + $scope.NewPatientReportDoctorList[i].DoctorID;
            }
        }
        if (newlist.charAt(0) === ",") {
            newlist = newlist.slice(1);
        }

        let list1 = "";
        for (let i in $scope.appointmentTypes) {
            if ($scope.appointmentTypes[i].isChecked) {
                list1 += "," + $scope.appointmentTypes[i].Id;
            }
        }
        if (list1.charAt(0) === ",") {
            list1 = list1.slice(1);
        }

        let list2 = "";
        for (let i in $scope.Visitreasons) {
            if ($scope.Visitreasons[i].isChecked) {
                list2 += "," + $scope.Visitreasons[i].ReasonId;
            }
        }
        if (list2.charAt(0) === ",") {
            list2 = list2.slice(1);
        }



        let list3 = "";
        for (var i in $scope.BookingTypesArray) {
            if ($scope.BookingTypesArray[i].IsChecked) {
                list3 += "," + $scope.BookingTypesArray[i].BookingTypeId;
            }
        }
        if (list3.charAt(0) === ",") {
            list3 = list3.slice(1);
        }


        var list5 = "";
        for (var i in $scope.AppointmentStatusArray) {
            if ($scope.AppointmentStatusArray[i].IsChecked) {
                list5 += "," + $scope.AppointmentStatusArray[i].AppointmentStatusId;
            }
        }
        if (list5.charAt(0) === ",") {
            list5 = list5.slice(1);
        }

        let list4 = "";
        for (var i in $scope.BookedstatusFilterList) {
            if ($scope.BookedstatusFilterList[i].IsChecked) {
                list4 += "," + $scope.BookedstatusFilterList[i].Id;
            }
        }
        if (list4.charAt(0) === ",") {
            list4 = list4.slice(1);
        }

        let req = {
            "HospitalId": hospitalIds,
            "GetAllHospitalInd": getAllHospitalInd,
            "FromDate": FromDate,
            "ToDate": ToDate,
            "DoctorIds": newlist || "",
            "AppointmentTypeIds": list1 || "",
            "VisitReasonIds": list2 || "",
            "BookingTypeIds": list3 || "",
            "AppointmentStatusIds": list5 || "",
            "BookingStatusIds": list4 || "",
            "UserId": eHnoteMasterDataService.getLoginId(),
            /*"ReportName": "ByDoctor"*/
        };

        let datesArray = getDateArrayNew(FromDate, ToDate);
        $scope.DatesListNew = angular.copy(datesArray);

        $scope.ApptStatisticsArray = [];

        eHnoteMainDashboardDataServices.GetAppointmentStatisticsData(req).then(function (resp) {
            console.log(resp);
            if (resp.data.Status === "Success") {
                if (resp.data.rows.length > 0) {
                    angular.forEach(resp.data.rows, function (item) {
                        angular.forEach(item.AppointmentDatesList, function (kitem) {
                            kitem.Day = $filter('date')(kitem.AppointmentDate, "EEE");
                        });
                    });
                    $scope.ApptStatisticsArray = angular.copy(resp.data.rows);
                    $scope.ApptStatisticsPersantageArray = [];
                    if ($scope.ApptStatisticsArray.length > 0) {
                        angular.forEach($scope.ApptStatisticsArray, function (sitem) {
                            if (sitem.Type == "Cancelled Appts (same day)" || sitem.Type == "No Show Appts" || sitem.Type == "Cancelled (same day) + No Show" ||
                                sitem.Type == "Confirmed" || sitem.Type == "Not Confirmed" || sitem.Type == "No Show Confirmed" || sitem.Type == "No Show Not Confirmed"
                                || sitem.Type == "SumOf No Show Appts" || sitem.Type == "New Appts General" || sitem.Type == "Seen New Appts General" || sitem.Type == "Active Appts" || sitem.Type == "No show/cancelled new general") {
                                $scope.ApptStatisticsPersantageArray.push(sitem);
                            }
                        });
                        console.log('hello');
                    }
                }
            }


            $scope.removeElementsByTypeDaily = function (typeToRemove) {
                $scope.ApptStatisticsArray = $scope.ApptStatisticsArray.filter(function (item) {
                    return item.Type !== typeToRemove;
                });
            };
            $scope.removeElementsByTypeDaily('No show/cancelled new general');

            if (type == "export") {
                generateTableForDailyApptStatisticsReport($scope.ApptStatisticsArray, $scope.ApptStatisticsPersantageArray)
            }

        }, function (err) {
            //console.log(err);
        });

    };

    function GetSameDayCheckedInCancelledAppointmentDetails(HospitalIdsList,type) {

        var selectedDoctors = $filter("filter")($scope.NewPatientReportDoctorList, function (iterator, ind) { return iterator.isChecked == true; });
        if (selectedDoctors.length == 0) {
            alertify.error("Please Select Doctor");
            return false;
        }
        let newlist = "";
        for (var i in $scope.NewPatientReportDoctorList) {
            if ($scope.NewPatientReportDoctorList[i].isChecked) {
                newlist += "," + $scope.NewPatientReportDoctorList[i].DoctorID;
            }
        }
        if (newlist.charAt(0) === ",") {
            newlist = newlist.slice(1);
        }

        let newlist1 = "";
        for (let i in $scope.Visitreasons) {
            if ($scope.Visitreasons[i].isChecked) {
                newlist1 += "," + $scope.Visitreasons[i].ReasonId;
            }
        }

        if (newlist1.charAt(0) === ",") {
            newlist1 = newlist1.slice(1);
        }

        let newlist2 = "";
        for (let i in $scope.appointmentTypes) {
            if ($scope.appointmentTypes[i].isChecked) {
                newlist2 += "," + $scope.appointmentTypes[i].Id;
            }
        }

        if (newlist2.charAt(0) === ",") {
            newlist2 = newlist2.slice(1);
        }

        let list3 = "";
        for (let i in $scope.confirmationStatusArray) {
            if ($scope.confirmationStatusArray[i].IsChecked) {
                list3 += "," + $scope.confirmationStatusArray[i].ConfirmationStatusId;
            }
        }
        if (list3.charAt(0) === ",") {
            list3 = list3.slice(1);
        }


        //var req = {
        //    "Fromdate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_StartDate), "yyyy-MM-dd"),
        //    "Todate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_EndDate), "yyyy-MM-dd"),
        //    "HospitalIdsList": HospitalIdsList.length > 0 ? HospitalIdsList : "",
        //    "DoctorsIds": newlist || "",
        //    "VisitTypeId": $scope.GetDataOnMainDashBoardObj.VisitTypeId || null
        //};
        //eHnoteMainDashboardDataServices.GetSameDayCheckedInCancelledAppointmentDetails(req).then(function (resp) {
        //    if (resp.data.status === "Success") {
        //        if (resp.data.rows.length > 0) {
        //            let tempArray = [];
        //            angular.forEach(resp.data.rows, function (kitem) {
        //                kitem.ContentShow = false;
        //                angular.forEach(kitem.SamedayCancelCheckinAppointment, function (hitem) {
        //                    let today = $filter('date')(new Date(), "yyyy-MM-dd");
        //                    let datetime = today + " " + hitem.StartTime;
        //                    hitem.StartTime = $filter('date')(new Date(datetime), "hh:mm a");
        //                    tempArray.push(hitem);
        //                });
        //            });
        //            $scope.ListCountsObj.SamedayCancelCheckinAppointmentCount = tempArray.length || 0;
        //        }
        //        $scope.DashboardSameDayCancelCheckinApptDetails = angular.copy(resp.data.rows);
        //    }

        //}, function () {

        //});

        let list5 = "";
        for (var i in $scope.AppointmentStatusArray) {
            if ($scope.AppointmentStatusArray[i].IsChecked) {
                list5 += "," + $scope.AppointmentStatusArray[i].AppointmentStatusId;
            }
        }
        if (list5.charAt(0) === ",") {
            list5 = list5.slice(1);
        }

        let list4 = "";
        for (var i in $scope.BookedstatusFilterList) {
            if ($scope.BookedstatusFilterList[i].IsChecked) {
                list4 += "," + $scope.BookedstatusFilterList[i].Id;
            }
        }
        if (list4.charAt(0) === ",") {
            list4 = list4.slice(1);
        }

        let list6 = "";
        for (var i in $scope.BookingTypesArray) {
            if ($scope.BookingTypesArray[i].IsChecked) {
                list6 += "," + $scope.BookingTypesArray[i].BookingTypeId;
            }
        }
        if (list6.charAt(0) === ",") {
            list6 = list6.slice(1);
        }

        var req = {
            "Fromdate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_StartDate), "yyyy-MM-dd"),
            "Todate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_EndDate), "yyyy-MM-dd"),
            "HospitalIdsList": HospitalIdsList.length > 0 ? HospitalIdsList : "",
            "DoctorsIds": newlist || "",
            //"VisitTypeId": $scope.GetDataOnMainDashBoardObj.VisitTypeId || null,
            "AppointmentTypeIds": newlist2,
            "VisitReasons": newlist1,
            //"AppointmentStatusIds": list5 || "",
            "BookingStatusIds": list4 || "",
            "BookingTypeIds": list6 || "",
            //"StatusIds": list3,
            // "BookingTypeIds": list6 || "",
            "DashboardType": 18
        };
        eHnoteMainDashboardDataServices.GetDashboardAppointmentDetails(req).then(function (resp) {
            if (resp.data.status === "Success") {
                if (resp.data.rows.length > 0) {
                    let tempArray = [];
                    angular.forEach(resp.data.rows, function (kitem) {
                        kitem.ContentShow = false;
                        angular.forEach(kitem.AppointmentDetails, function (hitem) {
                            let today = $filter('date')(new Date(), "yyyy-MM-dd");
                            let datetime = today + " " + hitem.StartTime;
                            hitem.StartTime = $filter('date')(new Date(datetime), "hh:mm a");
                            tempArray.push(hitem);
                        });
                    });
                    $scope.ListCountsObj.SamedayCancelCheckinAppointmentCount = tempArray.length || 0;
                }
                $scope.DashboardSameDayCancelCheckinApptDetails = angular.copy(resp.data.rows);


                if (type == "export") {
                    generateTableNew($scope.DashboardSameDayCancelCheckinApptDetails, $scope.viewtype);
                }

            }

        }, function () {


        });



    };

    function GetSeenNewAppointmentDetails(HospitalIdsList,type) {

        var selectedDoctors = $filter("filter")($scope.NewPatientReportDoctorList, function (iterator, ind) { return iterator.isChecked == true; });
        if (selectedDoctors.length == 0) {
            alertify.error("Please Select Doctor");
            return false;
        }
        var newlist = "";
        for (var i in $scope.NewPatientReportDoctorList) {
            if ($scope.NewPatientReportDoctorList[i].isChecked) {
                newlist += "," + $scope.NewPatientReportDoctorList[i].DoctorID;
            }
        }
        if (newlist.charAt(0) === ",") {
            newlist = newlist.slice(1);
        }

        let newlist1 = "";
        for (let i in $scope.Visitreasons) {
            if ($scope.Visitreasons[i].isChecked) {
                newlist1 += "," + $scope.Visitreasons[i].ReasonId;
            }
        }

        if (newlist1.charAt(0) === ",") {
            newlist1 = newlist1.slice(1);
        }


        let list3 = "";
        for (let i in $scope.confirmationStatusArray) {
            if ($scope.confirmationStatusArray[i].IsChecked) {
                list3 += "," + $scope.confirmationStatusArray[i].ConfirmationStatusId;
            }
        }
        if (list3.charAt(0) === ",") {
            list3 = list3.slice(1);
        }

        let list5 = "";
        for (var i in $scope.AppointmentStatusArray) {
            if ($scope.AppointmentStatusArray[i].IsChecked) {
                list5 += "," + $scope.AppointmentStatusArray[i].AppointmentStatusId;
            }
        }
        if (list5.charAt(0) === ",") {
            list5 = list5.slice(1);
        }

        let list4 = "";
        for (var i in $scope.BookedstatusFilterList) {
            if ($scope.BookedstatusFilterList[i].IsChecked) {
                list4 += "," + $scope.BookedstatusFilterList[i].Id;
            }
        }
        if (list4.charAt(0) === ",") {
            list4 = list4.slice(1);
        }

        let list6 = "";
        for (var i in $scope.BookingTypesArray) {
            if ($scope.BookingTypesArray[i].IsChecked) {
                list6 += "," + $scope.BookingTypesArray[i].BookingTypeId;
            }
        }
        if (list6.charAt(0) === ",") {
            list6 = list6.slice(1);
        }
        var req = {
            "Fromdate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_StartDate), "yyyy-MM-dd"),
            "Todate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_EndDate), "yyyy-MM-dd"),
            "HospitalIdsList": HospitalIdsList.length > 0 ? HospitalIdsList : "",
            "DoctorsIds": newlist || "",
            "VisitTypeId": $scope.GetDataOnMainDashBoardObj.VisitTypeId || null,
            "VisitReasons": newlist1,
            //"AppointmentStatusIds": list5 || "",
            "BookingStatusIds": list4 || "",
            "BookingTypeIds": list6 || "",
            "DashboardType": 12
        };
        eHnoteMainDashboardDataServices.GetDashboardAppointmentDetails(req).then(function (resp) {
            if (resp.data.status === "Success") {
                if (resp.data.rows.length > 0) {
                    let tempArray = [];
                    angular.forEach(resp.data.rows, function (kitem) {
                        kitem.ContentShow = false;
                        angular.forEach(kitem.AppointmentDetails, function (hitem) {
                            let today = $filter('date')(new Date(), "yyyy-MM-dd");
                            let datetime = today + " " + hitem.StartTime;
                            hitem.StartTime = $filter('date')(new Date(datetime), "hh:mm a");
                            tempArray.push(hitem);
                        });
                    });
                    $scope.ListCountsObj.SeenNewAppointmentsCount = tempArray.length || 0;
                }
                $scope.DashboardSeenNewApptDetails = angular.copy(resp.data.rows);


                if (type == "export") {
                    generateTableNew($scope.DashboardSeenNewApptDetails, $scope.viewtype);
                }

            }

        }, function () {


        });

    };

    function getActiveAppointmentsDetails(HospitalIdsList,type) {
        var selectedDoctors = $filter("filter")($scope.NewPatientReportDoctorList, function (iterator, ind) { return iterator.isChecked == true; });
        if (selectedDoctors.length == 0) {
            alertify.error("Please Select Doctor");
            return false;
        }
        var newlist = "";
        for (var i in $scope.NewPatientReportDoctorList) {
            if ($scope.NewPatientReportDoctorList[i].isChecked) {
                newlist += "," + $scope.NewPatientReportDoctorList[i].DoctorID;
            }
        }
        if (newlist.charAt(0) === ",") {
            newlist = newlist.slice(1);
        }

        let newlist1 = "";
        for (let i in $scope.Visitreasons) {
            if ($scope.Visitreasons[i].isChecked) {
                newlist1 += "," + $scope.Visitreasons[i].ParentAppointmentVisitReasonId;
            }
        }

        if (newlist1.charAt(0) === ",") {
            newlist1 = newlist1.slice(1);
        }

        let newlist2 = "";
        for (let i in $scope.appointmentTypes) {
            if ($scope.appointmentTypes[i].isChecked) {
                newlist2 += "," + $scope.appointmentTypes[i].Id;
            }
        }

        if (newlist2.charAt(0) === ",") {
            newlist2 = newlist2.slice(1);
        }

        let list3 = "";
        for (let i in $scope.confirmationStatusArray) {
            if ($scope.confirmationStatusArray[i].IsChecked) {
                list3 += "," + $scope.confirmationStatusArray[i].ConfirmationStatusId;
            }
        }
        if (list3.charAt(0) === ",") {
            list3 = list3.slice(1);
        }

        let list5 = "";
        for (var i in $scope.AppointmentStatusArray) {
            if ($scope.AppointmentStatusArray[i].IsChecked) {
                list5 += "," + $scope.AppointmentStatusArray[i].AppointmentStatusId;
            }
        }
        if (list5.charAt(0) === ",") {
            list5 = list5.slice(1);
        }

        let list4 = "";
        for (var i in $scope.BookedstatusFilterList) {
            if ($scope.BookedstatusFilterList[i].IsChecked) {
                list4 += "," + $scope.BookedstatusFilterList[i].Id;
            }
        }
        if (list4.charAt(0) === ",") {
            list4 = list4.slice(1);
        }

        let list6 = "";
        for (var i in $scope.BookingTypesArray) {
            if ($scope.BookingTypesArray[i].IsChecked) {
                list6 += "," + $scope.BookingTypesArray[i].BookingTypeId;
            }
        }
        if (list6.charAt(0) === ",") {
            list6 = list6.slice(1);
        }

        var req = {
            "Fromdate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_StartDate), "yyyy-MM-dd"),
            "Todate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_EndDate), "yyyy-MM-dd"),
            "HospitalIdsList": HospitalIdsList.length > 0 ? HospitalIdsList : "",
            "GetAllHospitalInd": HospitalIdsList.length > 1 ? true : false,
            "DoctorsIds": newlist || "",
            //"VisitTypeId": $scope.GetDataOnMainDashBoardObj.VisitTypeId || null,
            "AppointmentTypeIds": newlist2,
            "VisitReasons": newlist1,
            //"AppointmentStatusIds": list5 || "",
            "BookingStatusIds": list4 || "",
            "BookingTypeIds": list6 || "",
            "DashboardType": 9
        };
        eHnoteMainDashboardDataServices.GetDashboardAppointmentDetails(req).then(function (resp) {
            if (resp.data.status === "Success") {
                if (resp.data.rows.length > 0) {
                    let tempArray = [];
                    angular.forEach(resp.data.rows, function (kitem) {
                        kitem.ContentShow = false;
                        angular.forEach(kitem.AppointmentDetails, function (hitem) {
                            let today = $filter('date')(new Date(), "yyyy-MM-dd");
                            let datetime = today + " " + hitem.StartTime;
                            hitem.StartTime = $filter('date')(new Date(datetime), "hh:mm a");
                            tempArray.push(hitem);
                        });
                    });
                    $scope.ListCountsObj.ActiveAppointmentsCount = tempArray.length || 0;
                }
                $scope.DashboardActiveApptDetails = angular.copy(resp.data.rows);

                if (type == "export") {
                    generateTableNew($scope.DashboardActiveApptDetails, $scope.viewtype)
                }

            }

        }, function () {


        });
    };

    $scope.dashboardinfoPopover = {
        templateUrl: 'templates/uibpopups/dashboardinfoPopover.html',
    };

    function generateTableNew(jsonData, typeValue) {

        let ReportName = "";
        let reports_exportData = [];

        if (typeValue === "NewAppointmentsDashBoard") {
            ReportName = "New Appt General";
        }
        else if (typeValue === "ActiveAppointments") {
            ReportName = "Active Appointments";
        }
        else if (typeValue === "ClinicfollowupAppointments") {
            ReportName = "Clinic FollowUp Appointments";
        }
        else if (typeValue === "PostOpfollowupAppointments") {
            ReportName = "Post Op FollowUp Appointments";
        }
        else if (typeValue === "ASCAppointments") {
            ReportName = "ASC Appointments";
        }
        else if (typeValue === "TechnicianAppointments") {
            ReportName = "Technician Appointments";
        }
        else if (typeValue === "PreOpAppointments") {
            ReportName = "Pre-Op Appointments";
        }
        else if (typeValue === "PreadmissionAppointments") {
            ReportName = "PreAdmission Appointments";
        }
        else if (typeValue === "CoordinatorAppointments") {
            ReportName = "Coordinator Appointments";
        }
        else if (typeValue === "RescheduleAppointments") {
            ReportName = "Reschedule Appointments";
        }
        else if (typeValue === "AllAppointments") {
            ReportName = "All Appointments";
        }
        else if (typeValue === "SeenNewAppointmentsDashBoard") {
            ReportName = "New appt general seen";
        }
        else if (typeValue === "WalkinAppointmentsDashBoard") {
            ReportName = "Walkin Appointments";
        }
        else if (typeValue === "NoShowAppointmentDetails") {
            ReportName = "No Show Appointments";
        }
        else if (typeValue === "SeenAppointmentsDashBoard") {
            ReportName = "Seen Appointments";
        }
        else if (typeValue === "CancelledAppointmentsDetails") {
            ReportName = "Cancelled Appointments";
        }
        else if (typeValue === "SameDayCancelledAppointmentsDetails") {
            ReportName = "Sameday Cancelled Appointments";
        }
        else if (typeValue === "SameDayCheckedInCancelledAppointmentsDetails") {
            ReportName = "Sameday Cancelled(CheckedIn) Appointments";
        }

        reports_exportData.length = 0;
        let counter = 0;
        angular.forEach(jsonData, function (item) {
            angular.forEach(item.AppointmentDetails, function (itemExports) {

                if (typeValue === "AllAppointments") {
                    if (itemExports.AppointmentNotes.length > 0) {
                        let tempArray = [];
                        angular.forEach(itemExports.AppointmentNotes, function (kitem,index) {
                            kitem.Notes = "NOTE" + (index + 1) + " : " + kitem.Notes;
                            tempArray.push(kitem.Notes);
                        });
                        itemExports.Notes = tempArray.join(", ");
                    } else {
                        itemExports.Notes = "";
                    }
                    reports_exportData.push({
                        'SNO': ++counter,
                        'Appt Date & time': moment(itemExports.AppointmentDate).format("MM-DD-YYYY") + ',' + itemExports.StartTime,
                        'MR.No': (itemExports.Mrno != null) ? itemExports.Mrno : '',
                        //'Old MR.No': (itemExports.OldMrno != null) ? itemExports.OldMrno : '',
                        'Patient': itemExports.PatientName,
                        'Visit Type': itemExports.AppointmentType,
                        'Visit Reason': itemExports.VisitReason,
                        'Appt.Status': itemExports.AppointmentStatusName,
                        'Location': itemExports.LocationName,
                        'Doctor': itemExports.SecondUserFullName,
                        "Profile Status": itemExports.ProfileStatus,
                        "Appt.Notes": itemExports.Notes,
                    });
                } else {
                    reports_exportData.push({
                        'SNO': ++counter,
                        'Appt Date & time': moment(itemExports.AppointmentDate).format("MM-DD-YYYY") + ',' + itemExports.StartTime,
                        'MR.No': (itemExports.Mrno != null) ? itemExports.Mrno : '',
                        //'Old MR.No': (itemExports.OldMrno != null) ? itemExports.OldMrno : '',
                        'Patient': itemExports.PatientName,
                        'Visit Type': itemExports.AppointmentType,
                        'Visit Reason': itemExports.VisitReason,
                        //'Appt.Status': itemExports.AppointmentStatusName,
                        'Appt.Status': itemExports.AppointmentStatusName,
                        'Location': itemExports.LocationName,
                        'Doctor': itemExports.SecondUserFullName,
                        "Profile Status": itemExports.ProfileStatus
                    });
                }
            });
        });
        jsonData = reports_exportData;

        var col = [];
        if (jsonData.length === 0) {
            return;
        }
        for (var i = 0; i < jsonData.length; i++) {
            for (var key in jsonData[i]) {
                if (col.indexOf(key) === -1) {
                    col.push(key);
                }
            }
        }

        //let newlist1 = "";
        //for (let i in $scope.Visitreasons) {
        //    if ($scope.Visitreasons[i].isChecked) {
        //        newlist1 += "," + $scope.Visitreasons[i].Reason;
        //    }
        //}

        //if (newlist1.charAt(0) === ",") {
        //    newlist1 = newlist1.slice(1);
        //}

        //let newlist2 = "";
        //for (let i in $scope.appointmentTypes) {
        //    if ($scope.appointmentTypes[i].isChecked) {
        //        newlist2 += "," + $scope.appointmentTypes[i].Name;
        //    }
        //}

        //if (newlist2.charAt(0) === ",") {
        //    newlist2 = newlist2.slice(1);
        //}




        // CREATE DYNAMIC TABLE.
        var table = document.createElement("table");
        table.style = "border: 1px solid #000;";
        // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.
        if (ReportName !== "") {
            var tr = table.insertRow(-1);              // TABLE ROW.        
            tabHead = tr.insertCell(-1);
            tabHead.style = "border: 1px solid #000;text-align:center;font-weight: bold;";
            tabHead.colSpan = col.length;
            tabHead.innerHTML = ReportName;

            var tr = table.insertRow(-1);
            var tabHead = tr.insertCell(-1);
            tabHead.style = "border: 1px solid #000;text-align:center;font-weight: bold;";
            tabHead.colSpan = col.length;
            tabHead.innerHTML = $scope.SelectedHospital.ClinicName;

            tr = table.insertRow(-1);
            tabHead = tr.insertCell(-1);
            tabHead.style = "border: 1px solid #000;text-align:center;";
            tabHead.colSpan = col.length;
            if ($scope.dashboardTab === 'reports') {
                tabHead.innerHTML = "From:" + $scope.reportSearch.FromDate + " - " + "To:" + $scope.reportSearch.ToDate;
            }
            else {
                tabHead.innerHTML = "From:" + $scope.GetDataOnMainDashBoardObj.dashboard_StartDate + " - " + "To:" + $scope.GetDataOnMainDashBoardObj.dashboard_EndDate;
            }

            //var tr = table.insertRow(-1);
            //var tabHead = tr.insertCell(-1);
            //tabHead.style = "border: 1px solid #000;text-align:center;font-weight: bold;";
            //tabHead.colSpan = col.length;
            //tabHead.innerHTML = "Visit Types: " + newlist2;

            //var tr = table.insertRow(-1);
            //var tabHead = tr.insertCell(-1);
            //tabHead.style = "border: 1px solid #000;text-align:center;font-weight: bold;";
            //tabHead.colSpan = 100;
            //tabHead.innerHTML = "Visit Reasons: " + newlist1;

        }

        var tr = table.insertRow(-1);               // TABLE ROW.
        for (var i = 0; i < col.length; i++) {
            var th = document.createElement("th");      // TABLE HEADER.
            th.innerHTML = col[i];
            tr.appendChild(th);
            tr.style = "background:#1e977c;color:#fff;width:100px";
        }
        // ADD JSON DATA TO THE TABLE AS ROWS.
        for (var i = 0; i < jsonData.length; i++) {
            tr = table.insertRow(-1);
            tr.style = "border: 1px solid #000;";
            for (var j = 0; j < col.length; j++) {
                var tabCell = tr.insertCell(-1);
                tabCell.innerHTML = jsonData[i][col[j]];
            }
        }

        var tr = table.insertRow(-1);
        var tabHead = tr.insertCell(-1);
        tabHead.style = "border: 1px solid #000;text-align:center;font-weight: bold;";
        tabHead.colSpan = col.length;
        tabHead.innerHTML = "Total Appointments: " + counter;

        download(table);

    }

    $scope.ApptStatusReportData = [];

    $scope.GetApptStatusReportData = function (type) {

        if (!eHnoteMainAppointmentService.Is7DaysCount($scope.GetNewPatientReportObj.FromDate, $scope.GetNewPatientReportObj.ToDate)) {
            alertify.log("More than 31 days not allowed");
            return;
        }
        let selectedDoctors = $filter("filter")($scope.NewPatientReportDoctorList, function (iterator, ind) { return iterator.isChecked == true; });
        if (selectedDoctors.length === 0) {
            alertify.error("Please Select Doctor");
            return false;
        }
        //let selectedUsers = $filter("filter")($scope.MultiselectUserlist, function (iterator, ind) { return iterator.isChecked == true; });
        //if (selectedUsers.length === 0) {
        //    alertify.error("Please Select Doctor");
        //    return false;
        //}
        $scope.hospitalClinicIds = $scope.ApptBranchLocations.filter(hitem => hitem.IsChecked == true).map(h => h.ClinicId);
        var hospitalIds = $scope.hospitalClinicIds.join(',')
        var getAllHospitalInd = $scope.hospitalClinicIds.length > 1 ? true : false;
        let FromDate = $filter('date')(new Date($scope.GetNewPatientReportObj.FromDate), "yyyy-MM-dd");
        let ToDate = $filter('date')(new Date($scope.GetNewPatientReportObj.ToDate), "yyyy-MM-dd");
       
        let newReportsDoctorsList = _.uniq($scope.NewPatientReportDoctorList, false, p => p.DoctorID);
        console.log("newReportsDoctorsList", newReportsDoctorsList)
        let newlist = newReportsDoctorsList
            .filter(doctor => doctor.isChecked)
            .map(doctor => doctor.DoctorID)
            .join(',');

        console.log(newlist);

        let list1 = "";
        for (let i in $scope.appointmentTypes) {
            if ($scope.appointmentTypes[i].isChecked) {
                list1 += "," + $scope.appointmentTypes[i].Id;
            }
        }
        if (list1.charAt(0) === ",") {
            list1 = list1.slice(1);
        }

        let list2 = "";
        for (let i in $scope.Visitreasons) {
            if ($scope.Visitreasons[i].isChecked) {
                list2 += "," + $scope.Visitreasons[i].ReasonId;
            }
        }
        if (list2.charAt(0) === ",") {
            list2 = list2.slice(1);
        }

        let list3 = "";
        for (var i in $scope.BookingTypesArray) {
            if ($scope.BookingTypesArray[i].IsChecked) {
                list3 += "," + $scope.BookingTypesArray[i].BookingTypeId;
            }
        }
        if (list3.charAt(0) === ",") {
            list3 = list3.slice(1);
        }


        var list5 = "";
        for (var i in $scope.AppointmentStatusArray) {
            if ($scope.AppointmentStatusArray[i].IsChecked) {
                list5 += "," + $scope.AppointmentStatusArray[i].AppointmentStatusId;
            }
        }
        if (list5.charAt(0) === ",") {
            list5 = list5.slice(1);
        }

        let list4 = "";
        for (var i in $scope.BookedstatusFilterList) {
            if ($scope.BookedstatusFilterList[i].IsChecked) {
                list4 += "," + $scope.BookedstatusFilterList[i].Id;
            }
        }
        if (list4.charAt(0) === ",") {
            list4 = list4.slice(1);
        }
        //var UserlistIds = "";
        //for (var i in $scope.MultiselectUserlist) {
        //    if ($scope.MultiselectUserlist[i].isChecked) {
        //        UserlistIds += "," + $scope.MultiselectUserlist[i].DoctorID;
        //    }
        //}
        //if (UserlistIds.charAt(0) === ",") {
        //    UserlistIds = UserlistIds.slice(1);
        //}

        let req = {
            "HospitalId": hospitalIds,
            "GetAllHospitalInd": getAllHospitalInd,
            "FromDate": FromDate,
            "ToDate": ToDate,
            "DoctorIds": newlist || "",
            "AppointmentTypeIds": list1 || "",
            "VisitReasonIds": list2 || "",
            "BookingTypeIds": list3 || "",
            "AppointmentStatusIds": list5 || "",
            "BookingStatusIds": list4 || "",
            "UserId": eHnoteMasterDataService.getLoginId(),
            /*"ReportName": "ByDoctor"*/
            /*"UserIds": UserlistIds||'',*/
        };

        //$scope.ApptStatusReportData = [];

        eHnoteMainDashboardDataServices.GetAppointmentStatusReportData(req).then(function (resp) {
            if (resp.data.Status === "Success") {
                if (resp.data.rows.length > 0) {
                    let tempArray = [];
                    angular.forEach(resp.data.rows, function (kitem) {
                        angular.forEach(kitem.AppointmentDetails, function (hitem) {
                            let today = $filter('date')(new Date(), "yyyy-MM-dd");
                            let datetime = today + " " + hitem.AppointmentStartTime;
                            hitem.AppointmentStartTime = $filter('date')(new Date(datetime), "hh:mm a");
                            tempArray.push(hitem);
                            hitem.MobileNo = hitem.MobileNo || '';
                            hitem.MobileNoUsFormate = '';
                            if (hitem.MobileNo != '') {
                                var obj = eHnoteUserDataService.UsMobileFormatChange(hitem.MobileNo);
                                hitem.MobileNoUsFormate = obj.UsFormatMobileNumber;
                            }
                            hitem.DOB = hitem.DOB || '';
                            hitem.FormatedDOB = '';
                            if (hitem.DOB != '') {
                                hitem.FormatedDOB = moment(hitem.DOB).format("MM-DD-YYYY");
                            }
                        });
                    });
                    $scope.ListCountsObj.ApptStatusReportCount = tempArray.length || 0;
                }
                $scope.ApptStatusReportData = angular.copy(resp.data.rows);
            }

            if (type == "export") {
                generateTableForApptStatusReport($scope.ApptStatusReportData)
            }



        }, function (err) {
            //console.log(err);
        });

    };

    function generateTableForApptStatusReport(jsonData) {
        let ReportName = "Appointment Status Report";
        let reports_exportData = [];

        reports_exportData.length = 0;
        let counter = 0;
        angular.forEach(jsonData, function (item) {
            angular.forEach(item.AppointmentDetails, function (itemExports) {
                itemExports.UserName = itemExports.UserName || '';
                if (itemExports.AppointmentNotes.length > 0) {
                    let tempArray = [];
                    angular.forEach(itemExports.AppointmentNotes, function (hitem,index) {
                        //hitem.Notes = (index + 1) + "." + hitem.Notes;
                        tempArray.push(hitem.Notes);
                    });
                    tempArray = tempArray.join(", ");
                    itemExports.Notes = angular.copy(tempArray);
                    //itemExports.Notes = tempArray;
                } else {
                    itemExports.Notes = "";
                }

                reports_exportData.push({
                    'SNO': ++counter,
                    'Appt Date & time': moment(itemExports.AppointmentDate).format("MM-DD-YYYY") + ', ' + itemExports.AppointmentStartTime,
                    'MR.No': (itemExports.MrNo != null) ? itemExports.MrNo : '',
                    //'Old MR.No': (itemExports.OldMrno != null) ? itemExports.OldMrno : '',
                    'Patient': itemExports.PatientName,
                    'DOB': itemExports.FormatedDOB,
                    'Mobile No.': itemExports.MobileNoUsFormate,
                    'Visit Type': itemExports.AppointmentType,
                    'Visit Reason': itemExports.VisitReason,
                    'Appt.Status': itemExports.AppointmentStatusName,
                    'Appt.User': itemExports.UserName,
                    'Location': itemExports.LocationName,
                    'Doctor': itemExports.DoctorName,
                    "Appt.Notes": itemExports.Notes,
                });
            });
        });
        jsonData = reports_exportData;

        var col = [];
        if (jsonData.length === 0) {
            return;
        }
        for (var i = 0; i < jsonData.length; i++) {
            for (var key in jsonData[i]) {
                if (col.indexOf(key) === -1) {
                    col.push(key);
                }
            }
        }

        // CREATE DYNAMIC TABLE.
        var table = document.createElement("table");
        table.style = "border: 1px solid #000;";
        // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.
        if (ReportName !== "") {
            var tr = table.insertRow(-1);              // TABLE ROW.        
            tabHead = tr.insertCell(-1);
            tabHead.style = "border: 1px solid #000;text-align:center;font-weight: bold;";
            tabHead.colSpan = col.length;
            tabHead.innerHTML = ReportName;

            var tr = table.insertRow(-1);
            var tabHead = tr.insertCell(-1);
            tabHead.style = "border: 1px solid #000;text-align:center;font-weight: bold;";
            tabHead.colSpan = col.length;
            tabHead.innerHTML = $scope.SelectedHospital.ClinicName;

            tr = table.insertRow(-1);
            tabHead = tr.insertCell(-1);
            tabHead.style = "border: 1px solid #000;text-align:center;";
            tabHead.colSpan = col.length;
            if ($scope.dashboardTab === 'reports') {
                tabHead.innerHTML = "From:" + $scope.GetNewPatientReportObj.FromDate + " - " + "To:" + $scope.GetNewPatientReportObj.ToDate;
            }

        }

        var tr = table.insertRow(-1);               // TABLE ROW.
        for (var i = 0; i < col.length; i++) {
            var th = document.createElement("th");      // TABLE HEADER.
            th.innerHTML = col[i];
            tr.appendChild(th);
            tr.style = "background:#1e977c;color:#fff;width:100px";
        }
        // ADD JSON DATA TO THE TABLE AS ROWS.
        for (var i = 0; i < jsonData.length; i++) {
            tr = table.insertRow(-1);
            tr.style = "border: 1px solid #000;";
            for (var j = 0; j < col.length; j++) {
                var tabCell = tr.insertCell(-1);
                tabCell.innerHTML = jsonData[i][col[j]];
            }
        }

        var tr = table.insertRow(-1);
        var tabHead = tr.insertCell(-1);
        tabHead.style = "border: 1px solid #000;text-align:center;font-weight: bold;";
        tabHead.colSpan = 10;
        tabHead.innerHTML = "Total Appointments: " + counter;

        download(table);

    }

    $scope.MonthlyApptStatisticsArray = [];

    $scope.MonthsArray = [
        "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"
    ];

    $scope.GetMonthlyApptStatisticsData = function (type) {

        if ($scope.GetNewPatientReportObj.FromMonth == "" || $scope.GetNewPatientReportObj.ToMonth == "") {
            alertify.error("Please Select months!");
            return false;
        }

        let selectedDoctors = $filter("filter")($scope.NewPatientReportDoctorList, function (iterator, ind) { return iterator.isChecked == true; });
        if (selectedDoctors.length === 0) {
            alertify.error("Please Select Doctor");
            return false;
        }
        $scope.hospitalClinicIds = $scope.ApptBranchLocations.filter(hitem => hitem.IsChecked == true).map(h => h.ClinicId);
        var hospitalIds = $scope.hospitalClinicIds.join(',')
        var getAllHospitalInd = $scope.hospitalClinicIds.length > 1 ? true : false;
        //let FromDate = $filter('date')(new Date($scope.GetNewPatientReportObj.FromDate), "yyyy-MM-dd");
        //let ToDate = $filter('date')(new Date($scope.GetNewPatientReportObj.ToDate), "yyyy-MM-dd");

        let Smonth = $scope.GetNewPatientReportObj.FromMonth.getMonth();
        let Emonth = $scope.GetNewPatientReportObj.ToMonth.getMonth();

        if (Smonth > Emonth) {
            alertify.error("Please select proper month!");
            return;
        }

        let FromMonth = $filter('date')(new Date($scope.GetNewPatientReportObj.FromMonth), "yyyy-MM-dd");
        let ToMonth = $filter('date')(new Date($scope.GetNewPatientReportObj.ToMonth), "yyyy-MM-dd");

        let newlist = "";
        for (let i in $scope.NewPatientReportDoctorList) {
            if ($scope.NewPatientReportDoctorList[i].isChecked) {
                newlist += "," + $scope.NewPatientReportDoctorList[i].DoctorID;
            }
        }
        if (newlist.charAt(0) === ",") {
            newlist = newlist.slice(1);
        }

        let list1 = "";
        for (let i in $scope.appointmentTypes) {
            if ($scope.appointmentTypes[i].isChecked) {
                list1 += "," + $scope.appointmentTypes[i].Id;
            }
        }
        if (list1.charAt(0) === ",") {
            list1 = list1.slice(1);
        }

        let list2 = "";
        for (let i in $scope.Visitreasons) {
            if ($scope.Visitreasons[i].isChecked) {
                list2 += "," + $scope.Visitreasons[i].ReasonId;
            }
        }
        if (list2.charAt(0) === ",") {
            list2 = list2.slice(1);
        }


        let list3 = "";
        for (var i in $scope.BookingTypesArray) {
            if ($scope.BookingTypesArray[i].IsChecked) {
                list3 += "," + $scope.BookingTypesArray[i].BookingTypeId;
            }
        }
        if (list3.charAt(0) === ",") {
            list3 = list3.slice(1);
        }


        var list5 = "";
        for (var i in $scope.AppointmentStatusArray) {
            if ($scope.AppointmentStatusArray[i].IsChecked) {
                list5 += "," + $scope.AppointmentStatusArray[i].AppointmentStatusId;
            }
        }
        if (list5.charAt(0) === ",") {
            list5 = list5.slice(1);
        }

        let list4 = "";
        for (var i in $scope.BookedstatusFilterList) {
            if ($scope.BookedstatusFilterList[i].IsChecked) {
                list4 += "," + $scope.BookedstatusFilterList[i].Id;
            }
        }
        if (list4.charAt(0) === ",") {
            list4 = list4.slice(1);
        }



        let req = {
            "HospitalId": hospitalIds,
            "GetAllHospitalInd": getAllHospitalInd,
            //"Year": year,
            "FromMonth": FromMonth,
            "ToMonth": ToMonth,
            "DoctorIds": newlist || "",
            "AppointmentTypeIds": list1 || "",
            "VisitReasonIds": list2 || "",
            "BookingTypeIds": list3 || "",
            "AppointmentStatusIds": list5 || "",
            "BookingStatusIds": list4 || "",
            "UserId": eHnoteMasterDataService.getLoginId()
        };

        eHnoteMainDashboardDataServices.GetAppointmentsCountByYear(req).then(function (resp) {
            console.log(resp);
            if (resp.data.Status === "Success") {
                if (resp.data.rows.length > 0) {
                    $scope.MonthlyApptStatisticsArray = angular.copy(resp.data.rows);
                    $scope.MonthlyApptStatisticsPersnatageArray = [];
                    if ($scope.MonthlyApptStatisticsArray.length > 0) {
                        let tempArray = [];
                        angular.forEach($scope.MonthlyApptStatisticsArray[0].AppointmentDatesList, function (item) {
                            tempArray.push(item.Month);
                            $scope.MonthsArray = angular.copy(tempArray);

                        });

                        angular.forEach($scope.MonthlyApptStatisticsArray, function (mitem) {
                            if (mitem.Type == "Cancelled Appts (same day)" || mitem.Type == "No Show Appts" || mitem.Type == "Cancelled (same day) + No Show" ||
                                mitem.Type == "Confirmed" || mitem.Type == "Not Confirmed" || mitem.Type == "No Show Confirmed" || mitem.Type == "No Show Not Confirmed"
                                || mitem.Type == "SumOf No Show Appts" || mitem.Type == "New Appts General" || mitem.Type == "Seen New Appts General" || mitem.Type == "Active Appts" ||mitem.Type == "No show/cancelled new general") {
                                $scope.MonthlyApptStatisticsPersnatageArray.push(mitem);
                            }
                        });

                    }
                }
            }

            $scope.removeElementsByTypeMonthly = function (typeToRemove) {
                $scope.MonthlyApptStatisticsArray = $scope.MonthlyApptStatisticsArray.filter(function (item) {
                    return item.Type !== typeToRemove;
                });
            };
            $scope.removeElementsByTypeMonthly('No show/cancelled new general');

            if (type == "export") {
                generateTableForMonthlyApptStatisticsData($scope.MonthlyApptStatisticsArray, $scope.MonthlyApptStatisticsPersnatageArray, FromMonth, ToMonth)
            }

        }, function (err) {
            //console.log(err);
        });

    };

    function generateTableForDailyApptStatisticsReport(jsonData,PersantageJson) {
        let ReportName = "Daily Appointment Statistics Report";
        let reports_exportData = [];
        reports_exportData.length = 0;
        let counter = 0;

        angular.forEach(jsonData, function (kitem) {
            let obj = {
                "Type": kitem.Type,
            };
            angular.forEach(kitem.AppointmentDatesList, function (item) {
                item.AppointmentDate = $filter('date')(item.AppointmentDate, "MM-dd-yyyy");
                obj[item.AppointmentDate] = item.AppointmentCount;
            });
            obj["Total"] = kitem.Total;
            obj["Average"] = kitem.Average;
            //obj["Percentage"] = kitem.Percentage + "%";

            reports_exportData.push(obj);
        });

        if (PersantageJson.length > 0) {
            angular.forEach(PersantageJson, function (kitem) {
                let pobj = {
                    "Type":"% of "+ kitem.Type,
                };
                angular.forEach(kitem.AppointmentDatesList, function (item) {
                    item.AppointmentDate = $filter('date')(item.AppointmentDate, "MM-dd-yyyy");
                    if (item.IndividualPercentage != 0) {
                        pobj[item.AppointmentDate] = $filter('number')(item.IndividualPercentage, 0) + "%";
                    }
                    else {
                        pobj[item.AppointmentDate] = "-";
                    }

                });

                //if (kitem.Total != 0) {
                //    pobj["Total"] = kitem.Total + "%";
                //}
                //else {
                //    pobj["Total"] = kitem.Total;
                //}  

                if (kitem.AvgPercentage != 0) {
                    pobj["Total"] = kitem.AvgPercentage + "%";
                }
                else {
                    pobj["Total"] = kitem.AvgPercentage;
                }
                pobj["Average"] = '-';  //kitem.Average
                //pobj["Percentage"] = kitem.Percentage + "%";

                reports_exportData.push(pobj);
            });
        }
        jsonData = reports_exportData;

        var col = [];
        if (jsonData.length === 0) {
            return;
        }
        for (var i = 0; i < jsonData.length; i++) {
            for (var key in jsonData[i]) {
                if (col.indexOf(key) === -1) {
                    col.push(key);
                }
            }
        }

        // CREATE DYNAMIC TABLE.
        var table = document.createElement("table");
        table.style = "border: 1px solid #000;";
        // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.
        if (ReportName !== "") {
            var tr = table.insertRow(-1);              // TABLE ROW.        
            tabHead = tr.insertCell(-1);
            tabHead.style = "border: 1px solid #000;text-align:center;font-weight: bold;";
            tabHead.colSpan = col.length;
            tabHead.innerHTML = ReportName;

            var tr = table.insertRow(-1);
            var tabHead = tr.insertCell(-1);
            tabHead.style = "border: 1px solid #000;text-align:center;font-weight: bold;";
            tabHead.colSpan = col.length;
            tabHead.innerHTML = $scope.ApptBranchLocations
                .filter(item => item.IsChecked === true && item.ClinicId !== 0)
                .map(hItem => hItem.ClinicName)
                .join(',');

            tr = table.insertRow(-1);
            tabHead = tr.insertCell(-1);
            tabHead.style = "border: 1px solid #000;text-align:center;";
            tabHead.colSpan = col.length;
            if ($scope.dashboardTab === 'reports') {
                tabHead.innerHTML = "From:" + $scope.GetNewPatientReportObj.FromDate + " - " + "To:" + $scope.GetNewPatientReportObj.ToDate;
            }
        }

        var tr = table.insertRow(-1);               // TABLE ROW.
        for (var i = 0; i < col.length; i++) {
            var th = document.createElement("th");      // TABLE HEADER.
            th.innerHTML = col[i];
            tr.appendChild(th);
            tr.style = "background:#1e977c;color:#fff;width:100px";
        }
        // ADD JSON DATA TO THE TABLE AS ROWS.
        for (var i = 0; i < jsonData.length; i++) {
            tr = table.insertRow(-1);
            tr.style = "border: 1px solid #000;";
            for (var j = 0; j < col.length; j++) {
                var tabCell = tr.insertCell(-1);
                tabCell.innerHTML = jsonData[i][col[j]];
            }
        }

        download(table);

    }

    function generateTableForMonthlyApptStatisticsData(jsonData, PersantageJson, FromMonth,ToMonth) {
        let ReportName = "Monthly Appointment Statistics Report";
        let reports_exportData = [];

        reports_exportData.length = 0;
        let counter = 0;

        angular.forEach(jsonData, function (kitem) {
            let obj = {
                "Type": kitem.Type,
            };
            angular.forEach(kitem.AppointmentDatesList, function (item) {
                obj[item.Month] = item.AppointmentCount;
            });
            obj["Total"] = kitem.Total;
            obj["Average"] = kitem.Average;

            reports_exportData.push(obj);
        });
        if (PersantageJson.length > 0) {
            angular.forEach(PersantageJson, function (kitem) {
                let pobj = {
                    "Type": "% of " + kitem.Type,
                };
                angular.forEach(kitem.AppointmentDatesList, function (item) {
                    if (item.IndividualPercentage != 0) {
                        //pobj[item.AppointmentDate] = $filter('number')(item.IndividualPercentage, 0) + "%";
                        pobj[item.Month] = $filter('number')(item.IndividualPercentage, 0) + "%";
                    } else {
                        pobj[item.Month] = '-';
                    }

                });
                //if (kitem.Total != 0) {
                //    pobj["Total"] = kitem.Total + "%";
                //}
                //else {
                //    pobj["Total"] = kitem.Total;
                //}

                if (kitem.AvgPercentage != 0) {
                    pobj["Total"] = kitem.AvgPercentage + "%";
                }
                else {
                    pobj["Total"] = kitem.AvgPercentage;
                }
                pobj["Average"] = '-';   //kitem.Average
                reports_exportData.push(pobj);
            });
        }
        jsonData = reports_exportData;

        var col = [];
        if (jsonData.length === 0) {
            return;
        }
        for (var i = 0; i < jsonData.length; i++) {
            for (var key in jsonData[i]) {
                if (col.indexOf(key) === -1) {
                    col.push(key);
                }
            }
        }

        FromMonth = $filter('date')(FromMonth, 'MMMM-yyyy');
        ToMonth = $filter('date')(ToMonth, 'MMMM-yyyy');
        // CREATE DYNAMIC TABLE.
        var table = document.createElement("table");
        table.style = "border: 1px solid #000;";
        // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.
        if (ReportName !== "") {
            var tr = table.insertRow(-1);              // TABLE ROW.        
            tabHead = tr.insertCell(-1);
            tabHead.style = "border: 1px solid #000;text-align:center;font-weight: bold;";
            tabHead.colSpan = col.length;
            tabHead.innerHTML = ReportName;

            var tr = table.insertRow(-1);
            var tabHead = tr.insertCell(-1);
            tabHead.style = "border: 1px solid #000;text-align:center;font-weight: bold;";
            tabHead.colSpan = col.length;
            tabHead.innerHTML = $scope.ApptBranchLocations
                .filter(item => item.IsChecked === true && item.ClinicId !== 0)
                .map(hItem => hItem.ClinicName)
                .join(',');

            tr = table.insertRow(-1);
            tabHead = tr.insertCell(-1);
            tabHead.style = "border: 1px solid #000;text-align:center;";
            tabHead.colSpan = col.length;
            if ($scope.dashboardTab === 'reports') {
                //tabHead.innerHTML = "From:" + $scope.GetNewPatientReportObj.FromMonth + " - " + "To:" + $scope.GetNewPatientReportObj.ToMonth;
                tabHead.innerHTML = "From:" + FromMonth + " - " + "To:" +ToMonth;
            }

        }

        var tr = table.insertRow(-1);               // TABLE ROW.
        for (var i = 0; i < col.length; i++) {
            var th = document.createElement("th");      // TABLE HEADER.
            th.innerHTML = col[i];
            tr.appendChild(th);
            tr.style = "background:#1e977c;color:#fff;width:100px";
        }
        // ADD JSON DATA TO THE TABLE AS ROWS.
        for (var i = 0; i < jsonData.length; i++) {
            tr = table.insertRow(-1);
            tr.style = "border: 1px solid #000;";
            for (var j = 0; j < col.length; j++) {
                var tabCell = tr.insertCell(-1);
                tabCell.innerHTML = jsonData[i][col[j]];
            }
        }

        download(table);

    }

    function GetPlanedRescheduleAppointmentDetails(HospitalIdsList, type) {

        var selectedDoctors = $filter("filter")($scope.NewPatientReportDoctorList, function (iterator, ind) { return iterator.isChecked == true; });
        if (selectedDoctors.length == 0) {
            alertify.error("Please Select Doctor");
            return false;
        }
        var newlist = "";
        for (var i in $scope.NewPatientReportDoctorList) {
            if ($scope.NewPatientReportDoctorList[i].isChecked) {
                newlist += "," + $scope.NewPatientReportDoctorList[i].DoctorID;
            }
        }
        if (newlist.charAt(0) === ",") {
            newlist = newlist.slice(1);
        }

        let newlist1 = "";
        for (let i in $scope.Visitreasons) {
            if ($scope.Visitreasons[i].isChecked) {
                newlist1 += "," + $scope.Visitreasons[i].ReasonId;
            }
        }

        if (newlist1.charAt(0) === ",") {
            newlist1 = newlist1.slice(1);
        }

        let newlist2 = "";
        for (let i in $scope.appointmentTypes) {
            if ($scope.appointmentTypes[i].isChecked) {
                newlist2 += "," + $scope.appointmentTypes[i].Id;
            }
        }

        if (newlist2.charAt(0) === ",") {
            newlist2 = newlist2.slice(1);
        }

        let list3 = "";
        for (let i in $scope.confirmationStatusArray) {
            if ($scope.confirmationStatusArray[i].IsChecked) {
                list3 += "," + $scope.confirmationStatusArray[i].ConfirmationStatusId;
            }
        }
        if (list3.charAt(0) === ",") {
            list3 = list3.slice(1);
        }

        //let list5 = "";
        //for (var i in $scope.AppointmentStatusArray) {
        //    if ($scope.AppointmentStatusArray[i].IsChecked) {
        //        list5 += "," + $scope.AppointmentStatusArray[i].AppointmentStatusId;
        //    }
        //}
        //if (list5.charAt(0) === ",") {
        //    list5 = list5.slice(1);
        //}

        let list4 = "";
        for (var i in $scope.BookedstatusFilterList) {
            if ($scope.BookedstatusFilterList[i].IsChecked) {
                list4 += "," + $scope.BookedstatusFilterList[i].Id;
            }
        }
        if (list4.charAt(0) === ",") {
            list4 = list4.slice(1);
        }

        let list6 = "";
        for (var i in $scope.BookingTypesArray) {
            if ($scope.BookingTypesArray[i].IsChecked) {
                list6 += "," + $scope.BookingTypesArray[i].BookingTypeId;
            }
        }
        if (list6.charAt(0) === ",") {
            list6 = list6.slice(1);
        }

        var req = {
            "Fromdate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_StartDate), "yyyy-MM-dd"),
            "Todate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_EndDate), "yyyy-MM-dd"),
            "HospitalIdsList": HospitalIdsList.length > 0 ? HospitalIdsList : "",
            "DoctorsIds": newlist || "",
            //"VisitTypeId": $scope.GetDataOnMainDashBoardObj.VisitTypeId || null,
            "AppointmentTypeIds": newlist2,
            "VisitReasons": newlist1,
            "AppointmentStatusIds": 8 || "",
            "BookingStatusIds": list4 || "",
            "BookingTypeIds": list6 || "",
            "DashboardType": 20
        };
        eHnoteMainDashboardDataServices.GetDashboardAppointmentDetails(req).then(function (resp) {
            if (resp.data.status === "Success") {
                if (resp.data.rows.length > 0) {
                    let tempArray = [];
                    angular.forEach(resp.data.rows, function (kitem) {
                        kitem.ContentShow = false;
                        angular.forEach(kitem.AppointmentDetails, function (hitem) {
                            let today = $filter('date')(new Date(), "yyyy-MM-dd");
                            let datetime = today + " " + hitem.StartTime;
                            hitem.StartTime = $filter('date')(new Date(datetime), "hh:mm a");
                            tempArray.push(hitem);
                        });
                    });
                    $scope.ListCountsObj.PlanedRescheduleAppointmentsCount = tempArray.length || 0;
                }
                $scope.PlanedRescheduleAppointmentDetails = angular.copy(resp.data.rows);
                if (type == "export") {
                    generateTableNew($scope.PlanedRescheduleAppointmentDetails, $scope.viewtype);
                }
            }
        }, function () {
        });
    };
    function GetLastMinRescheduleAppointmentDetails(HospitalIdsList, type) {

        var selectedDoctors = $filter("filter")($scope.NewPatientReportDoctorList, function (iterator, ind) { return iterator.isChecked == true; });
        if (selectedDoctors.length == 0) {
            alertify.error("Please Select Doctor");
            return false;
        }
        var newlist = "";
        for (var i in $scope.NewPatientReportDoctorList) {
            if ($scope.NewPatientReportDoctorList[i].isChecked) {
                newlist += "," + $scope.NewPatientReportDoctorList[i].DoctorID;
            }
        }
        if (newlist.charAt(0) === ",") {
            newlist = newlist.slice(1);
        }

        let newlist1 = "";
        for (let i in $scope.Visitreasons) {
            if ($scope.Visitreasons[i].isChecked) {
                newlist1 += "," + $scope.Visitreasons[i].ReasonId;
            }
        }

        if (newlist1.charAt(0) === ",") {
            newlist1 = newlist1.slice(1);
        }

        let newlist2 = "";
        for (let i in $scope.appointmentTypes) {
            if ($scope.appointmentTypes[i].isChecked) {
                newlist2 += "," + $scope.appointmentTypes[i].Id;
            }
        }

        if (newlist2.charAt(0) === ",") {
            newlist2 = newlist2.slice(1);
        }

        let list3 = "";
        for (let i in $scope.confirmationStatusArray) {
            if ($scope.confirmationStatusArray[i].IsChecked) {
                list3 += "," + $scope.confirmationStatusArray[i].ConfirmationStatusId;
            }
        }
        if (list3.charAt(0) === ",") {
            list3 = list3.slice(1);
        }

        //let list5 = "";
        //for (var i in $scope.AppointmentStatusArray) {
        //    if ($scope.AppointmentStatusArray[i].IsChecked) {
        //        list5 += "," + $scope.AppointmentStatusArray[i].AppointmentStatusId;
        //    }
        //}
        //if (list5.charAt(0) === ",") {
        //    list5 = list5.slice(1);
        //}

        let list4 = "";
        for (var i in $scope.BookedstatusFilterList) {
            if ($scope.BookedstatusFilterList[i].IsChecked) {
                list4 += "," + $scope.BookedstatusFilterList[i].Id;
            }
        }
        if (list4.charAt(0) === ",") {
            list4 = list4.slice(1);
        }

        let list6 = "";
        for (var i in $scope.BookingTypesArray) {
            if ($scope.BookingTypesArray[i].IsChecked) {
                list6 += "," + $scope.BookingTypesArray[i].BookingTypeId;
            }
        }
        if (list6.charAt(0) === ",") {
            list6 = list6.slice(1);
        }

        var req = {
            "Fromdate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_StartDate), "yyyy-MM-dd"),
            "Todate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_EndDate), "yyyy-MM-dd"),
            "HospitalIdsList": HospitalIdsList.length > 0 ? HospitalIdsList : "",
            "DoctorsIds": newlist || "",
            "AppointmentTypeIds": newlist2,
            "VisitReasons": newlist1,
            "AppointmentStatusIds": 9 || "",
            "BookingStatusIds": list4 || "",
            "BookingTypeIds": list6 || "",
            "DashboardType": 21
        };
        eHnoteMainDashboardDataServices.GetDashboardAppointmentDetails(req).then(function (resp) {
            if (resp.data.status === "Success") {
                if (resp.data.rows.length > 0) {
                    let tempArray = [];
                    angular.forEach(resp.data.rows, function (kitem) {
                        kitem.ContentShow = false;
                        angular.forEach(kitem.AppointmentDetails, function (hitem) {
                            let today = $filter('date')(new Date(), "yyyy-MM-dd");
                            let datetime = today + " " + hitem.StartTime;
                            hitem.StartTime = $filter('date')(new Date(datetime), "hh:mm a");
                            tempArray.push(hitem);
                        });
                    });
                    $scope.ListCountsObj.LastMinRescheduleAppointmentsCount = tempArray.length || 0;
                }
                $scope.LastMinRescheduleAppointmentDetails = angular.copy(resp.data.rows);
                if (type == "export") {
                    generateTableNew($scope.LastMinRescheduleAppointmentDetails, $scope.viewtype);
                }
            }
        }, function () {
        });
    };
    function GetCheckinRescheduleAppointmentDetails(HospitalIdsList, type) {

        var selectedDoctors = $filter("filter")($scope.NewPatientReportDoctorList, function (iterator, ind) { return iterator.isChecked == true; });
        if (selectedDoctors.length == 0) {
            alertify.error("Please Select Doctor");
            return false;
        }
        var newlist = "";
        for (var i in $scope.NewPatientReportDoctorList) {
            if ($scope.NewPatientReportDoctorList[i].isChecked) {
                newlist += "," + $scope.NewPatientReportDoctorList[i].DoctorID;
            }
        }
        if (newlist.charAt(0) === ",") {
            newlist = newlist.slice(1);
        }

        let newlist1 = "";
        for (let i in $scope.Visitreasons) {
            if ($scope.Visitreasons[i].isChecked) {
                newlist1 += "," + $scope.Visitreasons[i].ReasonId;
            }
        }

        if (newlist1.charAt(0) === ",") {
            newlist1 = newlist1.slice(1);
        }

        let newlist2 = "";
        for (let i in $scope.appointmentTypes) {
            if ($scope.appointmentTypes[i].isChecked) {
                newlist2 += "," + $scope.appointmentTypes[i].Id;
            }
        }

        if (newlist2.charAt(0) === ",") {
            newlist2 = newlist2.slice(1);
        }

        let list3 = "";
        for (let i in $scope.confirmationStatusArray) {
            if ($scope.confirmationStatusArray[i].IsChecked) {
                list3 += "," + $scope.confirmationStatusArray[i].ConfirmationStatusId;
            }
        }
        if (list3.charAt(0) === ",") {
            list3 = list3.slice(1);
        }

        //let list5 = "";
        //for (var i in $scope.AppointmentStatusArray) {
        //    if ($scope.AppointmentStatusArray[i].IsChecked) {
        //        list5 += "," + $scope.AppointmentStatusArray[i].AppointmentStatusId;
        //    }
        //}
        //if (list5.charAt(0) === ",") {
        //    list5 = list5.slice(1);
        //}

        let list4 = "";
        for (var i in $scope.BookedstatusFilterList) {
            if ($scope.BookedstatusFilterList[i].IsChecked) {
                list4 += "," + $scope.BookedstatusFilterList[i].Id;
            }
        }
        if (list4.charAt(0) === ",") {
            list4 = list4.slice(1);
        }

        let list6 = "";
        for (var i in $scope.BookingTypesArray) {
            if ($scope.BookingTypesArray[i].IsChecked) {
                list6 += "," + $scope.BookingTypesArray[i].BookingTypeId;
            }
        }
        if (list6.charAt(0) === ",") {
            list6 = list6.slice(1);
        }

        var req = {
            "Fromdate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_StartDate), "yyyy-MM-dd"),
            "Todate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_EndDate), "yyyy-MM-dd"),
            "HospitalIdsList": HospitalIdsList.length > 0 ? HospitalIdsList : "",
            "DoctorsIds": newlist || "",
            "AppointmentTypeIds": newlist2,
            "VisitReasons": newlist1,
            "AppointmentStatusIds": 10 || "",
            "BookingStatusIds": list4 || "",
            "BookingTypeIds": list6 || "",
            "DashboardType": 22
        };
        eHnoteMainDashboardDataServices.GetDashboardAppointmentDetails(req).then(function (resp) {
            if (resp.data.status === "Success") {
                if (resp.data.rows.length > 0) {
                    let tempArray = [];
                    angular.forEach(resp.data.rows, function (kitem) {
                        kitem.ContentShow = false;
                        angular.forEach(kitem.AppointmentDetails, function (hitem) {
                            let today = $filter('date')(new Date(), "yyyy-MM-dd");
                            let datetime = today + " " + hitem.StartTime;
                            hitem.StartTime = $filter('date')(new Date(datetime), "hh:mm a");
                            tempArray.push(hitem);
                        });
                    });
                    $scope.ListCountsObj.CheckinRescheduleAppointmentsCount = tempArray.length || 0;
                }
                $scope.CheckinRescheduleAppointmentDetails = angular.copy(resp.data.rows);
                if (type == "export") {
                    generateTableNew($scope.CheckinRescheduleAppointmentDetails, $scope.viewtype);
                }
            }
        }, function () {
        });
    };
    function GetwaitingAppointmentsDetails(HospitalIdsList, type) {

        var selectedDoctors = $filter("filter")($scope.NewPatientReportDoctorList, function (iterator, ind) { return iterator.isChecked == true; });
        if (selectedDoctors.length == 0) {
            alertify.error("Please Select Doctor");
            return false;
        }
        var newlist = "";
        for (var i in $scope.NewPatientReportDoctorList) {
            if ($scope.NewPatientReportDoctorList[i].isChecked) {
                newlist += "," + $scope.NewPatientReportDoctorList[i].DoctorID;
            }
        }
        if (newlist.charAt(0) === ",") {
            newlist = newlist.slice(1);
        }

        let newlist1 = "";
        for (let i in $scope.Visitreasons) {
            if ($scope.Visitreasons[i].isChecked) {
                newlist1 += "," + $scope.Visitreasons[i].ReasonId;
            }
        }

        if (newlist1.charAt(0) === ",") {
            newlist1 = newlist1.slice(1);
        }

        let newlist2 = "";
        for (let i in $scope.appointmentTypes) {
            if ($scope.appointmentTypes[i].isChecked) {
                newlist2 += "," + $scope.appointmentTypes[i].Id;
            }
        }

        if (newlist2.charAt(0) === ",") {
            newlist2 = newlist2.slice(1);
        }

        let list3 = "";
        for (let i in $scope.confirmationStatusArray) {
            if ($scope.confirmationStatusArray[i].IsChecked) {
                list3 += "," + $scope.confirmationStatusArray[i].ConfirmationStatusId;
            }
        }
        if (list3.charAt(0) === ",") {
            list3 = list3.slice(1);
        }

        let list5 = "";
        for (var i in $scope.AppointmentStatusArray) {
            if ($scope.AppointmentStatusArray[i].IsChecked) {
                list5 += "," + $scope.AppointmentStatusArray[i].AppointmentStatusId;
            }
        }
        if (list5.charAt(0) === ",") {
            list5 = list5.slice(1);
        }

        let list4 = "";
        for (var i in $scope.BookedstatusFilterList) {
            if ($scope.BookedstatusFilterList[i].IsChecked) {
                list4 += "," + $scope.BookedstatusFilterList[i].Id;
            }
        }
        if (list4.charAt(0) === ",") {
            list4 = list4.slice(1);
        }

        let list6 = "";
        for (var i in $scope.BookingTypesArray) {
            if ($scope.BookingTypesArray[i].IsChecked) {
                list6 += "," + $scope.BookingTypesArray[i].BookingTypeId;
            }
        }
        if (list6.charAt(0) === ",") {
            list6 = list6.slice(1);
        }

        var req = {
            "Fromdate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_StartDate), "yyyy-MM-dd"),
            "Todate": $filter("date")(new Date($scope.GetDataOnMainDashBoardObj.dashboard_EndDate), "yyyy-MM-dd"),
            "HospitalIdsList": HospitalIdsList.length > 0 ? HospitalIdsList : "",
            "DoctorsIds": newlist || "",
            "AppointmentTypeIds": newlist2,
            "VisitReasons": newlist1,
            //"AppointmentStatusIds": list5 || "",
            "BookingStatusIds": list4 || "",
            "BookingTypeIds": 2 || "",
            "DashboardType": 19
        };
        eHnoteMainDashboardDataServices.GetDashboardAppointmentDetails(req).then(function (resp) {
            if (resp.data.status === "Success") {
                if (resp.data.rows.length > 0) {
                    let tempArray = [];
                    angular.forEach(resp.data.rows, function (kitem) {
                        kitem.ContentShow = false;
                        angular.forEach(kitem.AppointmentDetails, function (hitem) {
                            let today = $filter('date')(new Date(), "yyyy-MM-dd");
                            let datetime = today + " " + hitem.StartTime;
                            hitem.StartTime = $filter('date')(new Date(datetime), "hh:mm a");
                            tempArray.push(hitem);
                        });
                    });
                    $scope.ListCountsObj.WaitingAppointmentsCount = tempArray.length || 0;
                }
                $scope.WaitingAppointmentsDetails = angular.copy(resp.data.rows);
                if (type == "export") {
                    generateTableNew($scope.WaitingAppointmentsDetails, $scope.viewtype);
                }
            }
        }, function () {
        });
    };

    function generateTableForExternalDoctorsReport(jsonData) {
        let ReportName = "New Book Appt report (External Doctor)";
        let reports_exportData = [];
        reports_exportData.length = 0;
        let counter = 0;
        let Appdata=[];
        var obj = {
            'SNO': '',
            'Appt Date & time': '',
            'MR.No': '',
            //'Old MR.No': (itemExports.OldMrno != null) ? itemExports.OldMrno : '',
            'Patient Name': '',
            'Appt Doctor': '',
            'Reason Type': '',
            'Visit Reason': '',
            'Appt.Status': '',
            'Referral Name': '',
        }
        Appdata.push(obj);
        if (jsonData.length === 0) {
            return;
        }
        var col = [];
        for (var i = 0; i < Appdata.length; i++) {
            for (var key in Appdata[i]) {
                if (col.indexOf(key) === -1) {
                    col.push(key);
                }
            }
        }

        // CREATE DYNAMIC TABLE.
        var table = document.createElement("table");
        table.style = "border: 1px solid #000;";
        // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.
        if (ReportName !== "") {
            var tr = table.insertRow(-1);              // TABLE ROW.        
            tabHead = tr.insertCell(-1);
            tabHead.style = "border: 1px solid #000;text-align:center;font-weight: bold;";
            tabHead.colSpan = col.length;
            tabHead.innerHTML = ReportName;

            var tr = table.insertRow(-1);
            var tabHead = tr.insertCell(-1);
            tabHead.style = "border: 1px solid #000;text-align:center;font-weight: bold;";
            tabHead.colSpan = col.length;
            tabHead.innerHTML = $scope.SelectedHospital.ClinicName;

            tr = table.insertRow(-1);
            tabHead = tr.insertCell(-1);
            tabHead.style = "border: 1px solid #000;text-align:center;";
            tabHead.colSpan = col.length;
            if ($scope.dashboardTab === 'reports') {
                tabHead.innerHTML = "From:" + $scope.GetNewPatientReportObj.FromDate + " - " + "To:" + $scope.GetNewPatientReportObj.ToDate;
            }

        }

        var tr = table.insertRow(-1);               // TABLE ROW.
        for (var i = 0; i < col.length; i++) {
            var th = document.createElement("th");      // TABLE HEADER.
            th.innerHTML = col[i];
            tr.appendChild(th);
            tr.style = "background:#1e977c;color:#fff;width:100px";
        }



        for (var i = 0; i < jsonData.length; i++) {

            //DctrName_Date Time
            let tr = table.insertRow(-1);
            tr.style = "solid #000;background:#FFFFE0;font-weight: bold";
            let dcCell = tr.insertCell(-1);
            dcCell.innerHTML = jsonData[i].OtherProviderDoctorName + ' ' + "(Count:" + jsonData[i].AppointmentCount + ")";
            //DctrName_Date Time

            for (let k = 0; k < jsonData[i].AppointmentDetails.length; k++) {
                let itr = table.insertRow(-1);
                itr.style = "border: 1px solid #000;";

                var formattedDate = moment(jsonData[i].AppointmentDetails[k].AppointmentDate).format("MM-DD-YYYY") || '';
                var reasontype = ''
                if (jsonData[i].AppointmentDetails[k].ReasonTypeId != undefined) {
                    var reasonfilter = $filter("filter")($scope.MasterReasonTypes, { "ReasonTypeId": jsonData[i].AppointmentDetails[k].ReasonTypeId }, true) || [];
                    if (reasonfilter.length > 0) {
                        reasontype = reasonfilter[0].ReasonTypeName || '';
                    }
                }
                for (var j = 0; j < col.length; j++) {
                    var tabCell = itr.insertCell(-1);
                    if (j == 0) {
                        tabCell.innerHTML = k + 1;
                    } else if (j == 1) {
                        tabCell.innerHTML = formattedDate + ', ' + jsonData[i].AppointmentDetails[k].AppointmentStartTime || '';
                    } else if (j == 2) {
                        tabCell.innerHTML = jsonData[i].AppointmentDetails[k].PatientDisplayId || '';
                    } else if (j == 3) {
                        tabCell.innerHTML = jsonData[i].AppointmentDetails[k].PatientName || '';
                    } else if (j == 4) {
                        tabCell.innerHTML = jsonData[i].AppointmentDetails[k].DoctorName || '';
                    }
                    else if (j == 5) {
                        tabCell.innerHTML = reasontype || '';
                    } else if (j == 6) {
                        tabCell.innerHTML = jsonData[i].AppointmentDetails[k].VisitReason || '';
                    }
                    else if (j == 7) {
                        tabCell.innerHTML = jsonData[i].AppointmentDetails[k].AppointmentStatusName || '';
                    }
                    else if (j == 8) {
                        tabCell.innerHTML = jsonData[i].OtherProviderDoctorName || '';
                    }
                    /*tabCell.innerHTML = '';*/
                }
            }
        }

        download(table);

    }


    $scope.ExternalDoctorReport = [];
    $scope.GetExternalDoctorReport = function (type) {

        if (!eHnoteMainAppointmentService.Is7DaysCount($scope.GetNewPatientReportObj.FromDate, $scope.GetNewPatientReportObj.ToDate)) {
            alertify.log("More than 31 days not allowed");
            return;
        }
        let selectedDoctors = $filter("filter")($scope.NewPatientReportDoctorList, function (iterator, ind) { return iterator.isChecked == true; });
        if (selectedDoctors.length === 0) {
            alertify.error("Please Select Doctor");
            return false;
        }
        let selectedReferalDoctors = $filter("filter")($scope.ReferalPCPDoctorsList, function (iterator, ind) { return iterator.isChecked == true; });
        if (selectedReferalDoctors.length === 0) {
            alertify.error("Please Select The Referral Doctor");
            return false;
        }
        let selectedReasonTypes = $filter("filter")($scope.MasterReasonTypes, function (iterator, ind) { return iterator.isChecked == true; });
        if (selectedReasonTypes.length === 0) {
            alertify.error("Please Select The Reson Type");
            return false;
        }
        $scope.hospitalClinicIds = $scope.ApptBranchLocations.filter(hitem => hitem.IsChecked == true).map(h => h.ClinicId);
        var hospitalIds = $scope.hospitalClinicIds.join(',');
        var getAllHospitalInd = $scope.hospitalClinicIds.length > 1 ? true : false;
        let FromDate = $filter('date')(new Date($scope.GetNewPatientReportObj.FromDate), "yyyy-MM-dd");
        let ToDate = $filter('date')(new Date($scope.GetNewPatientReportObj.ToDate), "yyyy-MM-dd");
        let newlist = "";
        for (let i in $scope.NewPatientReportDoctorList) {
            if ($scope.NewPatientReportDoctorList[i].isChecked) {
                newlist += "," + $scope.NewPatientReportDoctorList[i].DoctorID;
            }
        }
        if (newlist.charAt(0) === ",") {
            newlist = newlist.slice(1);
        }

        let list1 = "";
        for (let i in $scope.ReferalPCPDoctorsList) {
            if ($scope.ReferalPCPDoctorsList[i].isChecked) {
                list1 += "," + $scope.ReferalPCPDoctorsList[i].DoctorID;
            }
        }
        if (list1.charAt(0) === ",") {
            list1 = list1.slice(1);
        }

        let list2 = "";
        for (let i in $scope.MasterReasonTypes) {
            if ($scope.MasterReasonTypes[i].isChecked) {
                list2 += "," + $scope.MasterReasonTypes[i].ReasonTypeId;
            }
        }
        if (list2.charAt(0) === ",") {
            list2 = list2.slice(1);
        }


        var list5 = "";
        for (var i in $scope.AppointmentStatusArray) {
            if ($scope.AppointmentStatusArray[i].IsChecked) {
                list5 += "," + $scope.AppointmentStatusArray[i].AppointmentStatusId;
            }
        }
        if (list5.charAt(0) === ",") {
            list5 = list5.slice(1);
        }



        let req = {
            "HospitalId": hospitalIds,
            "GetAllHospitalInd": getAllHospitalInd,
            "FromDate": FromDate,
            "ToDate": ToDate,
            "DoctorIds": newlist || "",
            "ReferalPCPDoctorsIDs": list1 || "",
            "ReasonTypeIDs": list2 || "",

            "AppointmentStatusIds": list5 || "",

            "UserId": eHnoteMasterDataService.getLoginId(),
            /*"ReportName": "ByDoctor"*/
        };

        let datesArray = getDateArrayNew(FromDate, ToDate);
        $scope.DatesListNew = angular.copy(datesArray);

        $scope.ExternalDoctorReport = [];

        eHnoteMainDashboardDataServices.GetExternalDoctorReport(req).then(function (resp) {
            console.log(resp);
            if (resp.data.Status === "Success") {
                if (resp.data.rows.length > 0) {
                    $scope.ExternalDoctorReport = resp.data.rows || [];
                    angular.forEach($scope.ExternalDoctorReport, function (kitem) {
                        angular.forEach(kitem.AppointmentDetails, function (hitem) {
                            let today = $filter('date')(new Date(), "yyyy-MM-dd");
                            let datetime = today + " " + hitem.AppointmentStartTime;
                            hitem.AppointmentStartTime = $filter('date')(new Date(datetime), "hh:mm a");
                        });
                    });
                }
            }

            if (type == 'export') {
                generateTableForExternalDoctorsReport($scope.ExternalDoctorReport);
            }


        }, function (err) {
            //console.log(err);
        });

    };

    function generateTableForinternalDoctorsReport(jsonData) {
        let ReportName = "New Book Appt report (Internal Doctor)";
        let reports_exportData = [];
        reports_exportData.length = 0;
        let counter = 0;
        let Appdata = [];
        var obj = {
            'SNO': '',
            'Appt Date & time': '',
            'MR.No': '',
            'Patient Name': '',
            'Appt Doctor': '',
            'Visit Reason': '',
            'Appt.Status': '',
            'Refferal doctor': '',
        }
        Appdata.push(obj);
        if (jsonData.length === 0) {
            return;
        }
        var col = [];
        for (var i = 0; i < Appdata.length; i++) {
            for (var key in Appdata[i]) {
                if (col.indexOf(key) === -1) {
                    col.push(key);
                }
            }
        }

        // CREATE DYNAMIC TABLE.
        var table = document.createElement("table");
        table.style = "border: 1px solid #000;";
        // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.
        if (ReportName !== "") {
            var tr = table.insertRow(-1);              // TABLE ROW.        
            tabHead = tr.insertCell(-1);
            tabHead.style = "border: 1px solid #000;text-align:center;font-weight: bold;";
            tabHead.colSpan = col.length;
            tabHead.innerHTML = ReportName;

            var tr = table.insertRow(-1);
            var tabHead = tr.insertCell(-1);
            tabHead.style = "border: 1px solid #000;text-align:center;font-weight: bold;";
            tabHead.colSpan = col.length;
            tabHead.innerHTML = $scope.SelectedHospital.ClinicName;

            tr = table.insertRow(-1);
            tabHead = tr.insertCell(-1);
            tabHead.style = "border: 1px solid #000;text-align:center;";
            tabHead.colSpan = col.length;
            if ($scope.dashboardTab === 'reports') {
                tabHead.innerHTML = "From:" + $scope.GetNewPatientReportObj.FromDate + " - " + "To:" + $scope.GetNewPatientReportObj.ToDate;
            }

        }

        var tr = table.insertRow(-1);               // TABLE ROW.
        for (var i = 0; i < col.length; i++) {
            var th = document.createElement("th");      // TABLE HEADER.
            th.innerHTML = col[i];
            tr.appendChild(th);
            tr.style = "background:#1e977c;color:#fff;width:100px";
        }



        for (var i = 0; i < jsonData.length; i++) {

            //DctrName_Date Time
            let tr = table.insertRow(-1);
            tr.style = "solid #000;background:#FFFFE0;font-weight: bold";
            let dcCell = tr.insertCell(-1);
            dcCell.innerHTML = jsonData[i].SurgeryReferralDoctorName + ' ' + "(Count:" + jsonData[i].AppointmentCount + ")";
            //DctrName_Date Time

            for (let k = 0; k < jsonData[i].AppointmentDetails.length; k++) {
                let itr = table.insertRow(-1);
                itr.style = "border: 1px solid #000;";

                var formattedDate = moment(jsonData[i].AppointmentDetails[k].AppointmentDate).format("MM-DD-YYYY") || '';
                for (var j = 0; j < col.length; j++) {
                    var tabCell = itr.insertCell(-1);
                    if (j == 0) {
                        tabCell.innerHTML = k + 1;
                    } else if (j == 1) {
                        tabCell.innerHTML = formattedDate + ', ' + jsonData[i].AppointmentDetails[k].AppointmentStartTime || '';
                    } else if (j == 2) {
                        tabCell.innerHTML = jsonData[i].AppointmentDetails[k].PatientDisplayId || '';
                    } else if (j == 3) {
                        tabCell.innerHTML = jsonData[i].AppointmentDetails[k].PatientName || '';
                    } else if (j == 4) {
                        tabCell.innerHTML = jsonData[i].AppointmentDetails[k].SecondUserFullName || '';
                    }
                    else if (j == 5) {
                        tabCell.innerHTML = jsonData[i].AppointmentDetails[k].VisitReason || '';
                    }
                    else if (j == 6) {
                        tabCell.innerHTML = jsonData[i].AppointmentDetails[k].AppointmentStatusName || '';
                    }
                    else if (j == 7) {
                        tabCell.innerHTML = jsonData[i].SurgeryReferralDoctorName || '';
                    }

                    /*tabCell.innerHTML = '';*/
                }
            }
        }

        download(table);

    }
    $scope.InternalDoctorReport = [];
    $scope.GetInternalDoctorReport = function (type) {

        if (!eHnoteMainAppointmentService.Is7DaysCount($scope.GetNewPatientReportObj.FromDate, $scope.GetNewPatientReportObj.ToDate)) {
            alertify.log("More than 31 days not allowed");
            return;
        }
        let selectedDoctors = $filter("filter")($scope.NewPatientReportDoctorList, function (iterator, ind) { return iterator.isChecked == true; });
        if (selectedDoctors.length === 0) {
            alertify.error("Please Select Doctor");
            return false;
        }
        let selectedReferalDoctors = $filter("filter")($scope.InternalReportDoctorList, function (iterator, ind) { return iterator.isChecked == true; });
        if (selectedReferalDoctors.length === 0) {
            alertify.error("Please Select The Referral Doctor");
            return false;
        }
        let selectedReasonTypes = $filter("filter")($scope.MasterReasonTypes, function (iterator, ind) { return iterator.isChecked == true; });
        if (selectedReasonTypes.length === 0) {
            alertify.error("Please Select The Reson Type");
            return false;
        }

        $scope.hospitalClinicIds = $scope.ApptBranchLocations.filter(hitem => hitem.IsChecked == true).map(h => h.ClinicId);
        var hospitalIds = $scope.hospitalClinicIds.join(',');
        var getAllHospitalInd = $scope.hospitalClinicIds.length > 1 ? true : false;
        let FromDate = $filter('date')(new Date($scope.GetNewPatientReportObj.FromDate), "yyyy-MM-dd");
        let ToDate = $filter('date')(new Date($scope.GetNewPatientReportObj.ToDate), "yyyy-MM-dd");
        let newlist = "";
        for (let i in $scope.NewPatientReportDoctorList) {
            if ($scope.NewPatientReportDoctorList[i].isChecked) {
                newlist += "," + $scope.NewPatientReportDoctorList[i].DoctorID;
            }
        }
        if (newlist.charAt(0) === ",") {
            newlist = newlist.slice(1);
        }

        let list1 = "";
        for (let i in $scope.InternalReportDoctorList) {
            if ($scope.InternalReportDoctorList[i].isChecked) {
                list1 += "," + $scope.InternalReportDoctorList[i].DoctorID;
            }
        }
        if (list1.charAt(0) === ",") {
            list1 = list1.slice(1);
        }

        //let list2 = "";
        //for (let i in $scope.MasterReasonTypes) {
        //    if ($scope.MasterReasonTypes[i].isChecked) {
        //        list2 += "," + $scope.MasterReasonTypes[i].ReasonTypeId;
        //    }
        //}
        //if (list2.charAt(0) === ",") {
        //    list2 = list2.slice(1);
        //}

        var list5 = "";
        for (var i in $scope.AppointmentStatusArray) {
            if ($scope.AppointmentStatusArray[i].IsChecked) {
                list5 += "," + $scope.AppointmentStatusArray[i].AppointmentStatusId;
            }
        }
        if (list5.charAt(0) === ",") {
            list5 = list5.slice(1);
        }
        let list2 = "";
        for (let i in $scope.Visitreasons) {
            if ($scope.Visitreasons[i].isChecked) {
                list2 += "," + $scope.Visitreasons[i].ReasonId;
            }
        }
        if (list2.charAt(0) === ",") {
            list2 = list2.slice(1);
        }


        let req = {
            "HospitalId": hospitalIds,
            "GetAllHospitalInd": getAllHospitalInd,
            "FromDate": FromDate,
            "ToDate": ToDate,
            "DoctorIds": newlist || "",
            "InternalReferalDoctorIds": list1 || "",
            "VisitReasonIds": list2 || "",

            "AppointmentStatusIds": list5 || "",

            "UserId": eHnoteMasterDataService.getLoginId(),
            /*"ReportName": "ByDoctor"*/
        };

        let datesArray = getDateArrayNew(FromDate, ToDate);
        /*  $scope.DatesListNew = angular.copy(datesArray);*/
        $scope.InternalDoctorReport = [];

        eHnoteMainDashboardDataServices.GetInternalDoctorReport(req).then(function (resp) {
            console.log(resp);
            if (resp.data.Status === "Success") {
                if (resp.data.rows.length > 0) {
                    $scope.InternalDoctorReport = resp.data.rows || [];
                    angular.forEach($scope.InternalDoctorReport, function (kitem) {
                        angular.forEach(kitem.AppointmentDetails, function (hitem) {
                            let today = $filter('date')(new Date(), "yyyy-MM-dd");
                            let datetime = today + " " + hitem.AppointmentStartTime;
                            hitem.AppointmentStartTime = $filter('date')(new Date(datetime), "hh:mm a");
                        });
                    });
                }
            }

            if (type == 'export') {
                generateTableForinternalDoctorsReport($scope.InternalDoctorReport);
            }


        }, function (err) {
            //console.log(err);
        });

    };
    $scope.checkAllUsers = function (val) {
        if (val) {
            angular.forEach($scope.MultiselectUserlist, function (item) {
                item.isChecked = true;
            });

            $scope.selectedUsers = 'All';
        } else {
            angular.forEach($scope.MultiselectUserlist, function (item) {
                item.isChecked = false;
            });

            $scope.selectedUsers = 'Select Users';
        }
        var checkedArray = _.where($scope.MultiselectUserlist, { isChecked: true });
        $scope.AllUsersCheck = checkedArray.length > 0 && $scope.MultiselectUserlist.length === checkedArray.length ? true : false;

    };
    $scope.UsersToggle = function (item) {
        var checkedArray = _.where($scope.MultiselectUserlist, { isChecked: true });
        $scope.AllUsersCheck = checkedArray.length > 0 && $scope.MultiselectUserlist.length === checkedArray.length ? true : false;

        if (checkedArray.length == 0) {
            $scope.selectedUsers = "Select User";
        } else {
            if (checkedArray.length === 1) {
                $scope.selectedUsers = checkedArray[0].FullName + '-' + checkedArray[0].NPI;
            } else {
                if ($scope.AllUsersCheck) {
                    $scope.selectedUsers = "All";
                } else {
                    $scope.selectedUsers = "Selected Users";
                }
            }
        }

    };
    $scope.UserStatusData = [];
    $scope.TotalBooked = 0, $scope.TotalResheduled = 0, $scope.TotalCancelled = 0, $scope.TotalCount = 0;
    $scope.GetUserReportData = function (type) {

        if (!eHnoteMainAppointmentService.Is7DaysCount($scope.GetNewPatientReportObj.FromDate, $scope.GetNewPatientReportObj.ToDate)) {
            alertify.log("More than 31 days not allowed");
            return;
        }
        let selectedDoctors = $filter("filter")($scope.NewPatientReportDoctorList, function (iterator, ind) { return iterator.isChecked == true; });
        if (selectedDoctors.length === 0) {
            alertify.error("Please Select Doctor");
            return false;
        }
        //let selectedUsers = $filter("filter")($scope.MultiselectUserlist, function (iterator, ind) { return iterator.isChecked == true; });
        //if (selectedUsers.length === 0) {
        //    alertify.error("Please Select Doctor");
        //    return false;
        //}
        $scope.hospitalClinicIds = $scope.ApptBranchLocations.filter(hitem => hitem.IsChecked == true).map(h => h.ClinicId);
        var hospitalIds = $scope.hospitalClinicIds.join(',')
        var getAllHospitalInd = $scope.hospitalClinicIds.length > 1 ? true : false;
        let FromDate = $filter('date')(new Date($scope.GetNewPatientReportObj.FromDate), "yyyy-MM-dd");
        let ToDate = $filter('date')(new Date($scope.GetNewPatientReportObj.ToDate), "yyyy-MM-dd");
        let newlist = "";
        for (let i in $scope.NewPatientReportDoctorList) {
            if ($scope.NewPatientReportDoctorList[i].isChecked) {
                newlist += "," + $scope.NewPatientReportDoctorList[i].DoctorID;
            }
        }
        if (newlist.charAt(0) === ",") {
            newlist = newlist.slice(1);
        }

        let list1 = "";
        for (let i in $scope.appointmentTypes) {
            if ($scope.appointmentTypes[i].isChecked) {
                list1 += "," + $scope.appointmentTypes[i].Id;
            }
        }
        if (list1.charAt(0) === ",") {
            list1 = list1.slice(1);
        }

        let list2 = "";
        for (let i in $scope.Visitreasons) {
            if ($scope.Visitreasons[i].isChecked) {
                list2 += "," + $scope.Visitreasons[i].ReasonId;
            }
        }
        if (list2.charAt(0) === ",") {
            list2 = list2.slice(1);
        }

        let list3 = "";
        for (var i in $scope.BookingTypesArray) {
            if ($scope.BookingTypesArray[i].IsChecked) {
                list3 += "," + $scope.BookingTypesArray[i].BookingTypeId;
            }
        }
        if (list3.charAt(0) === ",") {
            list3 = list3.slice(1);
        }


        var list5 = "";
        for (var i in $scope.UserAppointmentStatusArray) {
            if ($scope.UserAppointmentStatusArray[i].IsChecked) {
                list5 += "," + $scope.UserAppointmentStatusArray[i].AppointmentStatusId;
            }
        }
        if (list5.charAt(0) === ",") {
            list5 = list5.slice(1);
        }

        let list4 = "";
        for (var i in $scope.BookedstatusFilterList) {
            if ($scope.BookedstatusFilterList[i].IsChecked) {
                list4 += "," + $scope.BookedstatusFilterList[i].Id;
            }
        }
        if (list4.charAt(0) === ",") {
            list4 = list4.slice(1);
        }
        var UserlistIds = "";
        for (var i in $scope.MultiselectUserlist) {
            if ($scope.MultiselectUserlist[i].isChecked) {
                UserlistIds += "," + $scope.MultiselectUserlist[i].DoctorID;
            }
        }
        if (UserlistIds.charAt(0) === ",") {
            UserlistIds = UserlistIds.slice(1);
        }

        let req = {
            "HospitalId": hospitalIds,
            "GetAllHospitalInd": getAllHospitalInd,
            "FromDate": FromDate,
            "ToDate": ToDate,
            "DoctorIds": newlist || "",
            "AppointmentTypeIds": list1 || "",
            "VisitReasonIds": list2 || "",
            "BookingTypeIds": list3 || "",
            "AppointmentStatusIds": list5 || "",
            "BookingStatusIds": list4 || "",
            "UserId": eHnoteMasterDataService.getLoginId(),
            /*"ReportName": "ByDoctor"*/
            "UserIds": UserlistIds || '',
        };

        $scope.UserStatusData = [];

        eHnoteMainDashboardDataServices.GetUserReportData(req).then(function (resp) {
            if (resp.data.Status === "Success") {
                if (resp.data.rows.length > 0) {
                    let tempArray = [];
                    $scope.TotalBooked = 0, $scope.TotalResheduled = 0, $scope.TotalCancelled = 0, $scope.TotalCount = 0;
                    angular.forEach(resp.data.rows, function (kitem) {
                        kitem.IsshowAddtinalAppoint = false;
                        kitem.Booked = kitem.Booked || 0;
                        kitem.Reschedule = kitem.Reschedule || 0;
                        kitem.Cancelled = kitem.Cancelled || 0;
                        kitem.Total = kitem.Total || 0;

                        $scope.TotalBooked += kitem.Booked
                        $scope.TotalResheduled += kitem.Reschedule
                        $scope.TotalCancelled += kitem.Cancelled
                        $scope.TotalCount += kitem.Total

                        kitem.Day = $filter('date')(kitem.CreatedDate, "EEE") || '';
                        let dateTimeString = kitem.CreatedDate || ''
                        kitem.CreatedDate = $filter('date')(dateTimeString, 'MM-dd-yyyy');
                        angular.forEach(kitem.AppointmentDetails, function (hitem) {
                            //let today = $filter('date')(new Date(), "yyyy-MM-dd");
                            //let datetime = today + " " + hitem.AppointmentStartTime;
                            let dateTimeString = hitem.CreatedDt||''
                            hitem.CreatedDt = $filter('date')(dateTimeString, 'MM-dd-yyyy ,hh:mm a');
                            tempArray.push(hitem);
                            hitem.notes = '';
                            let nttempArray = [];
                            //if (hitem.AppointmentNotes.length > 0) {
                            //    angular.forEach(hitem.AppointmentNotes, function (nhitem, index) {
                            //        nhitem.Notes = (index + 1) + "." + nhitem.Notes;
                            //        nttempArray.push(nhitem.Notes);
                            //    });
                            //    nttempArray = nttempArray.join(", ");
                            //    hitem.notes = angular.copy(nttempArray);
                            //}
                            /* "Appt.Notes": itemExports.Notes,*/
                        });

                    });
                    /*    $scope.ListCountsObj.ApptStatusReportCount = tempArray.length || 0;*/
                }
                $scope.UserStatusData = angular.copy(resp.data.rows);
            }

            if (type == "export") {
                GenerateUserReportDataReport($scope.UserStatusData)
            }



        }, function (err) {
            //console.log(err);
        });

    };
    $scope.ViewAdditinaldata = function (item) {
        item.IsshowAddtinalAppoint = !item.IsshowAddtinalAppoint || false;
    }

    function GenerateUserReportDataReport(jsonData) {
        let ReportName = "User Appointments Report";
        let reports_exportData = [];
        reports_exportData.length = 0;
        let counter = 0;
        let Appdata = [];
        var obj = {
            'SNO': '',
            'Appt Created Date': '',
            'Day': '',
            //'Old MR.No': (itemExports.OldMrno != null) ? itemExports.OldMrno : '',
            'Booked': '',
            'Resheduled': '',
            'Cancelled': '',
            'Total': '',
        }

        Appdata.push(obj);
        if (jsonData.length === 0) {
            return;
        }
        var col = [];
        for (var i = 0; i < Appdata.length; i++) {
            for (var key in Appdata[i]) {
                if (col.indexOf(key) === -1) {
                    col.push(key);
                }
            }
        }
        let UserAppdata = [];
        var Detailsobj = {
            'SNO': '',
            'Created Date&Time': '',
            'Appt.Date ': '',
            'MR.No': '',
            //'Old MR.No': (itemExports.OldMrno != null) ? itemExports.OldMrno : '',
            'Patient': '',
            'Doctor': '',
            'Visit Type': '',
            'Visit Reason': '',
            'Appt.Status': '',
            'Appt.User': '',

            //'Appt Notes': '',
            //'Visit Type': '',
            //'Visit Reason': '',
        }
        UserAppdata.push(Detailsobj);
        var Appcol = [];
        for (var i = 0; i < UserAppdata.length; i++) {
            for (var key in UserAppdata[i]) {
                if (Appcol.indexOf(key) === -1) {
                    Appcol.push(key);
                }
            }
        }

        // CREATE DYNAMIC TABLE.
        var table = document.createElement("table");
        table.style = "border: 1px solid #000;";
        // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.
        if (ReportName !== "") {
            var tr = table.insertRow(-1);              // TABLE ROW.        
            tabHead = tr.insertCell(-1);
            tabHead.style = "border: 1px solid #000;text-align:center;font-weight: bold;";
            tabHead.colSpan = col.length;
            tabHead.innerHTML = ReportName;

            var tr = table.insertRow(-1);
            var tabHead = tr.insertCell(-1);
            tabHead.style = "border: 1px solid #000;text-align:center;font-weight: bold;";
            tabHead.colSpan = col.length;
            tabHead.innerHTML = $scope.SelectedHospital.ClinicName;

            tr = table.insertRow(-1);
            tabHead = tr.insertCell(-1);
            tabHead.style = "border: 1px solid #000;text-align:center;";
            tabHead.colSpan = col.length;
            if ($scope.dashboardTab === 'reports') {
                tabHead.innerHTML = "From:" + $scope.GetNewPatientReportObj.FromDate + " - " + "To:" + $scope.GetNewPatientReportObj.ToDate;
            }

        }

        var tr = table.insertRow(-1);               // TABLE ROW.
        for (var i = 0; i < col.length; i++) {
            var th = document.createElement("th");      // TABLE HEADER.
            th.innerHTML = col[i];
            tr.appendChild(th);
            tr.style = "background:#1e977c;color:#fff;width:100px";
        }



        for (var i = 0; i < jsonData.length; i++) {

            //DctrName_Date Time
            let tr = table.insertRow(-1);
            tr.style = "border: 1px solid #000;background:#FFFFE0;font-weight: bold";
            tr.colSpan = col.length;
            /* let dcCell = tr.insertCell(-1);*/
            let count = 0
            for (var u = 0; u < col.length; u++) {
                count = u + 1;
                let dcCell = tr.insertCell(-1);
                if (u == 0) {
                    dcCell.innerHTML = i + 1;
                }
                else if (u == 1) {
                    dcCell.innerHTML = jsonData[i].CreatedDate;
                }
                else if (u == 2) {
                    dcCell.innerHTML = jsonData[i].Day;
                }
                else if (u == 3) {
                    dcCell.innerHTML = jsonData[i].Booked;
                }
                else if (u == 4) {
                    dcCell.innerHTML = jsonData[i].Reschedule;
                }
                else if (u == 5) {
                    dcCell.innerHTML = jsonData[i].Cancelled;
                }
                else if (u == 6) {
                    dcCell.innerHTML = jsonData[i].Total;
                }
            }


        }
        //extra row
        tr = table.insertRow(-1);
        let extra = tr.insertCell(-1);
        extra.style = "border: 1px solid #211D07;text-align:center;";
        extra.colSpan = Appcol.length;


        tr = table.insertRow(-1);

        let tabHeadapp = tr.insertCell(-1);
        tabHeadapp.style = "border: 1px solid #211D07;text-align:center;";
        tabHeadapp.colSpan = Appcol.length;
        tabHeadapp.innerHTML = 'Detailed Created Appointment list';
        for (var i = 0; i < jsonData.length; i++) {
            tr = table.insertRow(-1);
            let tabHead = tr.insertCell(-1);
            tabHead.style = "border: 1px solid #000;text-align:center;";
            tabHead.colSpan = Appcol.length;
            if (jsonData[i].Total == 0 && jsonData[i].AppointmentDetails.length == 0) {
                tabHead.innerHTML = " No Appointments Were Created On  " + jsonData[i].CreatedDate;
            }


            else if (jsonData[i].Total != 0 && jsonData[i].AppointmentDetails.length > 0) {
                tabHead.innerHTML = jsonData[i].CreatedDate; + " , " + jsonData[i].Day;
                let extrarow = table.insertRow(-1);
                extrarow.style = "solid #000;";
                let trh = table.insertRow(-1);               // TABLE ROW.
                for (var aph = 0; aph < Appcol.length; aph++) {
                    var th = document.createElement("th");      // TABLE HEADER.
                    th.innerHTML = Appcol[aph];
                    trh.appendChild(th);
                    trh.style = "background:#DAF7A6;color:#190721;width:100px";
                }
                for (let k = 0; k < jsonData[i].AppointmentDetails.length; k++) {
                    let itr = table.insertRow(-1);
                    itr.style = "border: 1px solid #000;";

                    //var formattedDate = moment(jsonData[u].AppointmentDetails[k].AppointmentDate).format("MM-DD-YYYY") || '';
                    for (let j = 0; j < Appcol.length; j++) {
                        var tabCell = itr.insertCell(-1);
                        if (j == 0) {
                            tabCell.innerHTML = k + 1;
                        }
                        else if (j == 1) {
                            tabCell.innerHTML = jsonData[i].AppointmentDetails[k].CreatedDt || '';
                        }
                        else if (j == 2) {
                            tabCell.innerHTML = jsonData[i].AppointmentDetails[k].AppointmentDate || '';
                        } else if (j == 3) {
                            tabCell.innerHTML = jsonData[i].AppointmentDetails[k].MrNo || '';
                        } else if (j == 4) {
                            tabCell.innerHTML = jsonData[i].AppointmentDetails[k].PatientName || '';
                        } else if (j == 5) {
                            tabCell.innerHTML = jsonData[i].AppointmentDetails[k].DoctorName || '';
                        }
                        else if (j == 6) {
                            tabCell.innerHTML = jsonData[i].AppointmentDetails[k].VisitType || '';
                        }
                        else if (j == 7) {
                            tabCell.innerHTML = jsonData[i].AppointmentDetails[k].VisitReason || '';
                        }
                        else if (j == 8) {
                            tabCell.innerHTML = jsonData[i].AppointmentDetails[k].AppointmentStatusName || '';
                        }
                        else if (j == 9) {
                            tabCell.innerHTML = jsonData[i].AppointmentDetails[k].UserName || '';
                        }

                        //else if (j == 10) {
                        //    tabCell.innerHTML = jsonData[i].AppointmentDetails[k].notes || '';
                        //}

                        /*tabCell.innerHTML = '';*/
                    }
                }
                let extraroww = table.insertRow(-1);
                extraroww.style = "solid #000;";
            }
            //else {
            //    tr = table.insertRow(-1);
            //    let emptytabHead = tr.insertCell(-1);
            //    emptytabHead.style = "border: 1px solid #211D07;text-align:center;";
            //    emptytabHead.colSpan = Appcol.length;
            //    emptytabHead.innerHTML = 'No Appointments Were Created on  ' + jsonData[i].CreatedDate; + " , " + jsonData[i].Day;
            //}
        }
        tr = table.insertRow(-1);
        tabHead = tr.insertCell(-1);
        tabHead.style = "border: 1px solid #211D07;text-align:center;";
        tabHead.colSpan = Appcol.length;
        if ($scope.dashboardTab === 'reports') {
            tabHead.innerHTML = "Total Booked Appts:" + $scope.TotalBooked + "," + " Total Resheduled Appts: " + $scope.TotalResheduled + "," + " Total Cancelled Appts: " + $scope.TotalCancelled + "," + " Total  Appts Count: " + $scope.TotalCount;
        }
        download(table);

    }



    //IOL Report 

    $scope.IOLReportsarray = [];
    $scope.GetIOLReportData = function (type) {

        if (!eHnoteMainAppointmentService.Is7DaysCount($scope.GetNewPatientReportObj.FromDate, $scope.GetNewPatientReportObj.ToDate)) {
            alertify.log("More than 31 days not allowed");
            return;
        }
         
        let FromDate = $filter('date')(new Date($scope.GetNewPatientReportObj.FromDate), "yyyy-MM-dd");
        let ToDate = $filter('date')(new Date($scope.GetNewPatientReportObj.ToDate), "yyyy-MM-dd");
 



        let locationIds = $scope.ApptBranchLocations
            .filter(pitem => pitem.IsChecked && pitem.ClinicId !== 0)
            .map(pitem => pitem.ClinicId)
            .join(",");
       
        var newlist = "";
        for (var i in $scope.NewPatientReportDoctorList) {
            if ($scope.NewPatientReportDoctorList[i].isChecked) {
                newlist += "," + $scope.NewPatientReportDoctorList[i].DoctorID;
            }
        }
        if (newlist.charAt(0) === ",") {
            newlist = newlist.slice(1);
        }

        let IOL = "";
        for (var i in $scope.IOLStatusArray) {
            if ($scope.IOLStatusArray[i].IsChecked) {
                IOL += "," + $scope.IOLStatusArray[i].Name;
            }
        }
        if (IOL.charAt(0) === ",") {
            IOL = IOL.slice(1);
        }

        if (IOL == "") {
            $scope.GetAllIndicator = true;
        } else {
            $scope.GetAllIndicator = false;
        }

        let req = {
            "DoctorIds": newlist || [],
            "HospitalId": locationIds,
            "FromDate": FromDate,
            "ToDate": ToDate,
            "Manufacture": $scope.ImplantsObj.Manufacturer||"",
            "Power": $scope.ImplantsObj.Power || "",
            "SerialNumber": $scope.ImplantsObj.SerialNumber||"",
            "StatusName": IOL||"",
            "PageSize": 10,
            "PageNumber": 1,
            "GetAllIndicator": $scope.GetAllIndicator
        };

        $scope.IOLReportsarray = [];

        eHnoteMainDashboardDataServices.GetOrganizationIOLdetails(req).then(function (resp) {
            if (resp.data.status === "Success") {
                if (resp.data.rows.length > 0) {

                    $scope.IOLReportsarray = resp.data.rows ||  [];
                   
                }
              
            }

            if (type == "export") {
                GenerateIOLReportData($scope.IOLReportsarray)
            }



        }, function (err) {
            //console.log(err);
        });

    };


    $scope.ChangeManufacturers = function (item) {
        let ManufacturerArray = $filter('filter')($scope.Manufacturers, { 'ManufacturerId': item }, true);
        if (ManufacturerArray.length > 0) {
            $scope.ImplantsObj.Manufacturer = ManufacturerArray[0].Manufacturer;
        } else {
            $scope.ImplantsObj.Manufacturer = "";
        }
    }
    $scope.ChangeDiopterArray = function (item) {
        let DiopterArray = $filter('filter')($scope.DiopterArray, { 'Id': item }, true);
        if (DiopterArray.length > 0) {
            $scope.ImplantsObj.Power = DiopterArray[0].Power;
        } else {
            $scope.ImplantsObj.Power = "";
        }
    }

    $scope.ChangeIOLStatusArray = function (item) {
        let IOLStatusArray = $filter('filter')($scope.IOLStatusArray, { 'Id': item }, true);
        if (IOLStatusArray.length > 0) {
            $scope.ImplantsObj.StatusName = IOLStatusArray[0].Name;
        } else {
            $scope.ImplantsObj.StatusName = "";
        }
    }



    function GenerateIOLReportData(jsonData) {
        let ReportName = "IOL Stock Reports";
        let reports_exportData = [];
        reports_exportData.length = 0;
        let counter = 0;
        let Appdata = [];
        var obj = {
            'SNO': '',
            'Created Date': '',
            'Serial Number': '',         
            'Manufaturer': '',
            'Model': '',
            'Power': '',
            'Status': '',
            'Appt Date':'',
            'Patient': '',
            'Mr.No': '',
            'Procedure': '',
            'Doctor': '',
            'Organ': '',
            'Added by':''
        }
           
        Appdata.push(obj);
        if (jsonData.length === 0) {
            return;
        }
        var col = [];
        for (var i = 0; i < Appdata.length; i++) {
            for (var key in Appdata[i]) {
                if (col.indexOf(key) === -1) {
                    col.push(key);
                }
            }
        }

        // CREATE DYNAMIC TABLE.
        var table = document.createElement("table");
        table.style = "border: 1px solid #000;";
        // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.
        if (ReportName !== "") {
            var tr = table.insertRow(-1);              // TABLE ROW.        
            tabHead = tr.insertCell(-1);
            tabHead.style = "border: 1px solid #000;text-align:center;font-weight: bold;";
            tabHead.colSpan = col.length;
            tabHead.innerHTML = ReportName;

            var tr = table.insertRow(-1);
            var tabHead = tr.insertCell(-1);
            tabHead.style = "border: 1px solid #000;text-align:center;font-weight: bold;";
            tabHead.colSpan = col.length;
            tabHead.innerHTML = $scope.SelectedHospital.ClinicName;

            //tr = table.insertRow(-1);
            //tabHead = tr.insertCell(-1);
            //tabHead.style = "border: 1px solid #000;text-align:center;";
            //tabHead.colSpan = col.length;
            //if ($scope.dashboardTab === 'reports') {
            //    tabHead.innerHTML = "From:" + $scope.GetNewPatientReportObj.FromDate + " - " + "To:" + $scope.GetNewPatientReportObj.ToDate;


               
            //}



            let isAllAvailable = jsonData.every(item => item.StatusName === 'Available');

            if ($scope.dashboardTab === 'reports' && !isAllAvailable) {
                tr = table.insertRow(-1);
                tabHead = tr.insertCell(-1);
                tabHead.style = "border: 1px solid #000;text-align:center;";
                tabHead.colSpan = col.length;
                tabHead.innerHTML = "From:" + $scope.GetNewPatientReportObj.FromDate + " - " + "To:" + $scope.GetNewPatientReportObj.ToDate;
            }

        }

        var tr = table.insertRow(-1);               // TABLE ROW.
        for (var i = 0; i < col.length; i++) {
            var th = document.createElement("th");      // TABLE HEADER.
            th.innerHTML = col[i];
            tr.appendChild(th);
            tr.style = "background:#1e977c;color:#fff;width:100px";
        }



        for (var i = 0; i < jsonData.length; i++) {

          
            let tr = table.insertRow(-1);
            tr.style = "border: 1px solid #000;background:#FFFFE0;font-weight: bold";
            tr.colSpan = col.length;
          
            let count = 0
            for (var u = 0; u < col.length; u++) {
                count = u + 1;
                let dcCell = tr.insertCell(-1);
                if (u == 0) {
                    dcCell.innerHTML = i + 1;
                }
                else if (u == 1) {
                    dcCell.innerHTML = $filter('date')(jsonData[i].Createddate, 'MM/dd/yyyy');
                   
                }
                else if (u == 2) {
                    dcCell.innerHTML = jsonData[i].SerialNo;
                }
                else if (u == 3) {
                    dcCell.innerHTML = jsonData[i].Manufacturer;
                }
                else if (u == 4) {
                    dcCell.innerHTML = jsonData[i].ModelName;
                }
                else if (u == 5) {
                    dcCell.innerHTML = jsonData[i].Power;
                }
                else if (u == 6) {
                    dcCell.innerHTML = jsonData[i].StatusName;
                }
                else if (u == 7) {
                    dcCell.innerHTML = jsonData[i].AppointmentDate;
                }
                else if (u == 8) {
                    dcCell.innerHTML = jsonData[i].PatientName;
                }
                else if (u == 9) {
                    dcCell.innerHTML = jsonData[i].MRNO;
                }
                else if (u == 10) {
                    dcCell.innerHTML = jsonData[i].ProcedureName;
                }
                else if (u == 11) {
                    dcCell.innerHTML = jsonData[i].DoctorName;
                }
                else if (u == 12) {
                    dcCell.innerHTML = jsonData[i].OrganName;
                }
                else if (u == 13) {
                    dcCell.innerHTML = jsonData[i].AddedByUser;
                }
            }      
        }   
        download(table);
                                                                                                                                                                          
    }


    $scope.IOLStatusObj = {
        "SelectStatusString": "Select Status",
        "Name": "",
        "AllStatusCheck": true
    };

   
    $scope.IOLStatusObj.SelectStatusString = 'All';
    //$scope.IOLStatusObj.AllStatusCheck = true;


   
    $scope.checkAllIOLType = function (val) {
        if (val) {
            angular.forEach($scope.IOLStatusArray, function (item) {
                item.IsChecked = true;
            });

            $scope.IOLStatusObj.SelectStatusString = 'All';
        }
        else {
            angular.forEach($scope.IOLStatusArray, function (item) {
                item.IsChecked = false;
            });

            $scope.IOLStatusObj.SelectStatusString = 'Select Status';
        }

    };
    $scope.IOLTypeToggle = function (obj) {
        var checkedArray = _.where($scope.IOLStatusArray, { IsChecked: true });
        $scope.IOLStatusObj.AllStatusCheck = checkedArray.length > 0 && $scope.IOLStatusArray.length === checkedArray.length ? true : false;
        if ($scope.IOLStatusObj.AllStatusCheck) {
            $scope.IOLStatusObj.SelectStatusString = 'All';
        }

        if (!$scope.IOLStatusObj.AllStatusCheck && checkedArray.length > 0) {
            $scope.IOLStatusObj.SelectStatusString = 'Selected';
        }
    };

    function getSelectedPatient() {
        var obj = {
            "SearchText": "",
            "PatientId": 0,
            "SearchTypeId": 2
        }
        return obj;
    };
    $scope.PatientSearch = getSelectedPatient();



    $scope.LoadPatientSearch = function (val) {


        if (val == undefined || val == null || val == "") {
            $scope.AllPatientList = [];
            $scope.PatientSearch.PatientId = 0;
            $scope.ShowPatientListDrop = false;
            return false;
        }
        var param = {
            "PageSize": 21,
            "UserId": "",
            "PageNumber": 1,
            "SearchText": "",
            "Count": 0,
            "SearchDetails": { "listdocpatients": "Y" },
            "EndAge": 0,
            "StartAge": 0,
            "StartDate": "",
            "EndDate": ""
        };

        let doctorInfo = eHnoteMasterDataService.getUserInfo();
        if (doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            param['HospitalID'] = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            if ($scope.UserRoleId === 1 || $scope.UserRoleId === 56) {
                $scope.HospitalArray = [];
                angular.forEach(doctorInfo.doctordata.UserAddress, function (item) {
                    if (item.ExtDetails !== undefined) {
                        if (item.ExtDetails.HospitalInfo !== undefined && item.ExtDetails.HospitalInfo.HospitalID !== undefined && item.ExtDetails.HospitalInfo.HospitalCode !== undefined) {
                            var Obj = {
                                "HospitalName": item.ClinicName,
                                "HospitalID": item.ExtDetails.HospitalInfo.HospitalID,
                                "ActiveIND": "Y",
                                "isChecked": true,
                                "BranchId": item.ExtDetails.HospitalInfo.HospitalID
                            };
                            $scope.HospitalArray.push(Obj);
                        }
                    }
                });
            }
        }
        var list = [];
        angular.forEach($scope.HospitalArray, function (items) {
            if (items.isChecked) {
                list.push(items.BranchId);
            }
        });
        param["HospitalIDLst"] = list;
        eHnoteMasterDataService.addPatientSearchInfo(param);
        var object = {
            "UserId": $scope.UserId,
            "HospitalID": $scope.HospitalId,
            "HospitalIDLst": param.HospitalIDLst.toString(),
            "SearchText": $scope.PatientSearch.SearchText || "",
            "SearchTypeID": $scope.PatientSearch.SearchTypeId || 0,
        }
        if ($scope.PatientSearch.SearchTypeId == 1) {
            object.Name = val;
        } else if ($scope.PatientSearch.SearchTypeId == 2) {
            object.PatientId = val;
        }
        eHnotePatientDataService.SearchAllPatientData(object, OnGetopSearchPatientSuccess, OnGetopPatientSearchError)
    };
    $scope.ShowPatientListDrop = false;
    function OnGetopSearchPatientSuccess(data) {

        if (data.count > 0) {
            $scope.count = data.count;
            $scope.AllPatientList = [];
            if (data.rows.length > 0) {
                $scope.AllPatientList = data.rows || [];
            }
            else {
                $scope.count = 0;
                $scope.AllPatientList = [];
            }
        }

        if (data.count > 0) {
            $scope.count = data.count;
            $scope.AllPatientList = [];
            $scope.patientDetailsList = [];
            $scope.patientinitval = {};
            angular.forEach(data.rows, function (item) {
                $scope.patientinitval = {};
                var array_list = ['#af77c6', '#e4c120', '#69b3e7', '#ed9945', '#90c752'];
                var val = array_list[Math.floor(Math.random() * array_list.length)];
                if (item.EmailID !== undefined) {
                    $scope.patientinitval.EmailID = item.EmailID;
                }

                $scope.patientinitval.PatientID = item.PatientId;
                $scope.patientinitval.Title = item.Title;
                $scope.patientinitval.S3URL = item.S3URL || "";
                $scope.patientinitval.FullName = item.FullName;
                $scope.patientinitval.DOB = item.DOB;
                $scope.patientinitval.AgeInYears = item.AgeInYears;
                $scope.patientinitval.AgeInMonths = item.AgeInMonths;
                $scope.patientinitval.AgeInDays = item.AgeInDays;
                $scope.patientinitval.AltCountryCode = item.AltCountryCode || '';
                $scope.patientinitval.Altareacode = item.Altareacode || '';
                $scope.patientinitval.AltHomeNumber = item.AltHomeNumber || '';

                $scope.patientinitval.Gender = item.Gender;
                $scope.patientinitval.LastVisited = item.LastVisited;
                $scope.patientinitval.CountryCode = item.CountryCode;
                $scope.patientinitval.PhoneNumber = item.PhoneNumber;
                $scope.patientinitval.CurrentAge = item.CurrentAge;
                $scope.patientinitval.colors = val;
                $scope.patientinitval.OldMrno = item.OldMrno || "";
                $scope.patientinitval.patientCaseBillingAmtInfo = item.patientCaseBillingAmtInfo;
                $scope.patientinitval.patientdisplayid = item.DisplayID;
                $scope.patientinitval.Reviewed = item.Reviewed === undefined ? "N" : item.Reviewed;
                $scope.patientinitval.familydisplayid = item.FamilyDisplayID;

                $scope.patientinitval.ReferralSourceId = item.ReferralSourceId;
                $scope.patientinitval.Due = item.Due;
                $scope.patientinitval.PatientTypeId = item.PatientTypeId;
                $scope.patientinitval.IsVIPInd = item.IsVIPInd || false;
                $scope.patientinitval.IsResearchInd = item.IsResearchInd || false;
                $scope.patientinitval.IsHighRiskInd = item.IsHighRiskInd || false;
                $scope.patientinitval.DisplayID = item.DisplayID || "";
                $scope.patientinitval.Altareacode = item.Altareacode || "";
                $scope.patientinitval.AltHomeNumber = item.AltHomeNumber || "";
                $scope.patientinitval.InsuranceDetails = item.InsuranceDetails || [];
                var obj = eHnoteUserDataService.UsMobileFormatChange(item.Altareacode + item.AltHomeNumber);
                $scope.patientinitval.MobileNo = obj.UsFormatMobileNumber;
                var previouspatval = angular.copy($scope.patientinitval);
                $scope.patientDetailsList.push(previouspatval);
            });
            $scope.AllPatientList = $scope.patientDetailsList;

            $scope.noresult = false;
            $scope.showloading = false;
            $scope.$broadcast('scroll.infiniteScrollComplete');
        } else {
            $scope.count = 0;
            $scope.AllPatientList = [];
        }
        if ($scope.PatientSearch.SearchText != "") {
            $scope.ShowPatientListDrop = true;
        }
    }
    function OnGetopPatientSearchError() {
        $scope.count = 0;
        $scope.AllPatientList = [];
        $scope.PatientSearch.SearchText = "";
    }

    $scope.clearPatientSearchData = function () {
        $scope.ShowPatientListDrop = false;
        $scope.PatientSearch.SearchText = "";
        $scope.PatientSearch.PatientId = 0;
        $scope.PatientSurgeryApptObj.PatientId = 0;
        $scope.GetSurgeryAppointmentsList();
    };

    $scope.changeSearchType = function (id) {
        $scope.PatientSearch = getSelectedPatient();
        $scope.PatientSearch.SearchTypeId = id;
        $scope.PatientSurgeryApptObj.PatientId = 0;
        $scope.AllPatientList = [];
        if ($scope.PatientSearch.SearchText == '') {
            $scope.ShowPatientListDrop = false;
        }
    }



    $scope.SelectedPatient = function (patietnitem) {
        $scope.PatientSearch.PatientId = patietnitem.PatientID;
        $scope.PatientSurgeryApptObj.PatientId = patietnitem.PatientID;
        $scope.PatientSearch.SearchText = patietnitem.FullName;
        $scope.AllPatientList = [];
        $scope.ShowPatientListDrop = false;
        $scope.GetSurgeryAppointmentsList();
    };


    $scope.getSurgeryApptObj = function () {
        var Obj = {
            "PatientId": null,
            "FromDate":"",
            "ToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
            "DoctorIds":"",
            "VisitReasonIds":"",
            "PatientMrNo":"",
            "SearchText":"",
            "AllDoctorCheck":"",
            
        }
        return Obj;
    }

    $scope.PatientSurgeryApptObj = $scope.getSurgeryApptObj();

    $scope.DoctorSurgeryApptToggle = function (item) {
        var checkedArray = _.where($scope.NewPatientReportDoctorList, { isChecked: true });
        $scope.PatientSurgeryApptObj.AllDoctorCheck = checkedArray.length > 0 && $scope.NewPatientReportDoctorList.length === checkedArray.length ? true : false;

        if (checkedArray.length == 0) {
            $scope.selectedDoctors = "Select Doctor";
        } else {
            if (checkedArray.length === 1) {
                //$scope.selectedDoctors = checkedArray[0].NPI + '-' + checkedArray[0].UserFullName;
                $scope.selectedDoctors = checkedArray[0].UserFullName + '-' + checkedArray[0].NPI;
            } else {
                $scope.selectedDoctors = "Selected Doctors";
            }
        }
    };

    $scope.checkAllDoctorSurgeryAppt = function (val) {
        if (val) {
            angular.forEach($scope.NewPatientReportDoctorList, function (item) {
                item.isChecked = true;
            });

            $scope.selectedDoctors = 'All';
        } else {
            angular.forEach($scope.NewPatientReportDoctorList, function (item) {
                item.isChecked = false;
            });
            $scope.selectedDoctors = 'Select Doctors';
        }
        var checkedArray = _.where($scope.NewPatientReportDoctorList, { isChecked: true });
        $scope.PatientSurgeryApptObj.AllDoctorCheck = checkedArray.length > 0 && $scope.NewPatientReportDoctorList.length === checkedArray.length ? true : false;

    };


    $scope.GetSurgeryAppointmentsList = function () {


        $scope.hospitalClinicIds = $scope.ApptBranchLocations.filter(hitem => hitem.IsChecked == true).map(h => h.ClinicId);
        var hospitalIds = $scope.hospitalClinicIds.join(',')

        var selectedDoctors = $filter("filter")($scope.NewPatientReportDoctorList, function (iterator, ind) { return iterator.isChecked == true; });
        if (selectedDoctors.length == 0) {
            alertify.error("Please Select Doctor");
            return false;
        }
        var newDoctorslist = "";
        for (var i in $scope.NewPatientReportDoctorList) {
            if ($scope.NewPatientReportDoctorList[i].isChecked) {
                newDoctorslist += "," + $scope.NewPatientReportDoctorList[i].DoctorID;
            }
        }
        if (newDoctorslist.charAt(0) === ",") {
            newDoctorslist = newDoctorslist.slice(1);
        }

        let newvisitreasonlist = "";
        for (let i in $scope.Visitreasons) {
            if ($scope.Visitreasons[i].isChecked) {
                newvisitreasonlist += "," + $scope.Visitreasons[i].ReasonId;
            }
        }

        if (newvisitreasonlist.charAt(0) === ",") {
            newvisitreasonlist = newvisitreasonlist.slice(1);
        }

        $scope.SurgeryApptsListArray = [];

        var params = {
            "PatientId": $scope.PatientSurgeryApptObj.PatientId,
            "FromDate": $scope.PatientSurgeryApptObj.FromDate,
            "ToDate": $scope.PatientSurgeryApptObj.ToDate,
            "HospitalIds": hospitalIds,
            "DoctorIds": newDoctorslist,
            "VisitReasonIds": newvisitreasonlist,
            "PatientMrNo": $scope.PatientSurgeryApptObj.PatientMrNo,
            "SearchText": $scope.PatientSurgeryApptObj.SearchText,
        }
        eHnoteMainDashboardDataServices.GetSurgeryAppointmentReportsData(params).then(function (res) {

            if (res.data.AppointmentList.length > 0) {
                $scope.SurgeryApptsListArray = res.data.AppointmentList || [];
            }


        }, function (err) {

        });

    }
    function getPatientApptInsObj() {
        return {
            SearchText: "",
            PatientId: 0,
            SearchTypeId: 2
        };
    }

    $scope.patientApptInsSearch = getPatientApptInsObj();
    $scope.getApptInsObj = function () {
        return {
            "PatientId": null,
            "FromDate": $filter('date')(new Date(), "MM-dd-yyyy"),
            "ToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
            "DoctorIds": "",
            "PatientMrNo": "",
            "SearchText": "",
            "AllDoctorCheck": true,
            "PayorObj": ""
        };
    };
    $scope.PatientApptInsObj = $scope.getApptInsObj();
    $scope.searchtxtApptIns = { "txt1": "", "txt2": "" };
    $scope.selectedApptInsDoctor = 'All';
    $scope.LoadPatientApptInsSearch = function (val) {


        if (val == undefined || val == null || val == "") {
            $scope.AllPatientList1 = [];
            $scope.PatientSearch.PatientId = 0;
            $scope.ShowPatientListDrop1 = false;
            return false;
        }
        var param = {
            "PageSize": 21,
            "UserId": "",
            "PageNumber": 1,
            "SearchText": "",
            "Count": 0,
            "SearchDetails": { "listdocpatients": "Y" },
            "EndAge": 0,
            "StartAge": 0,
            "StartDate": "",
            "EndDate": ""
        };

        let doctorInfo = eHnoteMasterDataService.getUserInfo();
        if (doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            param['HospitalID'] = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            if ($scope.UserRoleId === 1 || $scope.UserRoleId === 56) {
                $scope.HospitalArray = [];
                angular.forEach(doctorInfo.doctordata.UserAddress, function (item) {
                    if (item.ExtDetails !== undefined) {
                        if (item.ExtDetails.HospitalInfo !== undefined && item.ExtDetails.HospitalInfo.HospitalID !== undefined && item.ExtDetails.HospitalInfo.HospitalCode !== undefined) {
                            var Obj = {
                                "HospitalName": item.ClinicName,
                                "HospitalID": item.ExtDetails.HospitalInfo.HospitalID,
                                "ActiveIND": "Y",
                                "isChecked": true,
                                "BranchId": item.ExtDetails.HospitalInfo.HospitalID
                            };
                            $scope.HospitalArray.push(Obj);
                        }
                    }
                });
            }
        }
        var list = [];
        angular.forEach($scope.HospitalArray, function (items) {
            if (items.isChecked) {
                list.push(items.BranchId);
            }
        });
        param["HospitalIDLst"] = list;
        eHnoteMasterDataService.addPatientSearchInfo(param);
        var object = {
            "UserId": $scope.UserId,
            "HospitalID": $scope.HospitalId,
            "HospitalIDLst": param.HospitalIDLst.toString(),
            "SearchText": $scope.patientApptInsSearch.SearchText || "",
            "SearchTypeID": $scope.patientApptInsSearch.SearchTypeId || 0,
        }
        if ($scope.patientApptInsSearch.SearchTypeId == 1) {
            object.Name = val;
        } else if ($scope.patientApptInsSearch.SearchTypeId == 2) {
            object.PatientId = val;
        }
        eHnotePatientDataService.SearchAllPatientData(object, OnGetopSearchPatientSuccess1, OnGetopPatientSearchError1)
    };
    $scope.ShowPatientListDrop1 = false;
    function OnGetopSearchPatientSuccess1(data) {

        if (data.count > 0) {
            $scope.count = data.count;
            $scope.AllPatientList1 = [];
            if (data.rows.length > 0) {
                $scope.AllPatientList1 = data.rows || [];
            }
            else {
                $scope.count = 0;
                $scope.AllPatientList1 = [];
            }
        }

        if (data.count > 0) {
            $scope.count = data.count;
            $scope.AllPatientList1 = [];
            $scope.patientDetailsList = [];
            $scope.patientinitval = {};
            angular.forEach(data.rows, function (item) {
                $scope.patientinitval = {};
                var array_list = ['#af77c6', '#e4c120', '#69b3e7', '#ed9945', '#90c752'];
                var val = array_list[Math.floor(Math.random() * array_list.length)];
                if (item.EmailID !== undefined) {
                    $scope.patientinitval.EmailID = item.EmailID;
                }

                $scope.patientinitval.PatientID = item.PatientId;
                $scope.patientinitval.Title = item.Title;
                $scope.patientinitval.S3URL = item.S3URL || "";
                $scope.patientinitval.FullName = item.FullName;
                $scope.patientinitval.DOB = item.DOB;
                $scope.patientinitval.AgeInYears = item.AgeInYears;
                $scope.patientinitval.AgeInMonths = item.AgeInMonths;
                $scope.patientinitval.AgeInDays = item.AgeInDays;
                $scope.patientinitval.AltCountryCode = item.AltCountryCode || '';
                $scope.patientinitval.Altareacode = item.Altareacode || '';
                $scope.patientinitval.AltHomeNumber = item.AltHomeNumber || '';

                $scope.patientinitval.Gender = item.Gender;
                $scope.patientinitval.LastVisited = item.LastVisited;
                $scope.patientinitval.CountryCode = item.CountryCode;
                $scope.patientinitval.PhoneNumber = item.PhoneNumber;
                $scope.patientinitval.CurrentAge = item.CurrentAge;
                $scope.patientinitval.colors = val;
                $scope.patientinitval.OldMrno = item.OldMrno || "";
                $scope.patientinitval.patientCaseBillingAmtInfo = item.patientCaseBillingAmtInfo;
                $scope.patientinitval.patientdisplayid = item.DisplayID;
                $scope.patientinitval.Reviewed = item.Reviewed === undefined ? "N" : item.Reviewed;
                $scope.patientinitval.familydisplayid = item.FamilyDisplayID;

                $scope.patientinitval.ReferralSourceId = item.ReferralSourceId;
                $scope.patientinitval.Due = item.Due;
                $scope.patientinitval.PatientTypeId = item.PatientTypeId;
                $scope.patientinitval.IsVIPInd = item.IsVIPInd || false;
                $scope.patientinitval.IsResearchInd = item.IsResearchInd || false;
                $scope.patientinitval.IsHighRiskInd = item.IsHighRiskInd || false;
                $scope.patientinitval.DisplayID = item.DisplayID || "";
                $scope.patientinitval.Altareacode = item.Altareacode || "";
                $scope.patientinitval.AltHomeNumber = item.AltHomeNumber || "";
                $scope.patientinitval.InsuranceDetails = item.InsuranceDetails || [];
                var obj = eHnoteUserDataService.UsMobileFormatChange(item.Altareacode + item.AltHomeNumber);
                $scope.patientinitval.MobileNo = obj.UsFormatMobileNumber;
                var previouspatval = angular.copy($scope.patientinitval);
                $scope.patientDetailsList.push(previouspatval);
            });
            $scope.AllPatientList1 = $scope.patientDetailsList;

            $scope.noresult = false;
            $scope.showloading = false;
            $scope.$broadcast('scroll.infiniteScrollComplete');
        } else {
            $scope.count = 0;
            $scope.AllPatientList1 = [];
        }
        if ($scope.patientApptInsSearch.SearchText != "") {
            $scope.ShowPatientListDrop1 = true;
        }
    }
    function OnGetopPatientSearchError1() {
        $scope.count = 0;
        $scope.AllPatientList1 = [];
        $scope.patientApptInsSearch.SearchText = "";
    }

    $scope.clearPatientApptInsSearchData = function () {
        $scope.ShowPatientListDrop1 = false;
        $scope.patientApptInsSearch.SearchText = "";
        $scope.patientApptInsSearch.PatientId = 0;
        $scope.PatientApptInsObj.PayorObj = "";
        $scope.GetAppointmentInsuranceReportsData();
    };

    $scope.changeSearchApptInsType = function (id) {
        $scope.patientApptInsSearch = getPatientApptInsObj();
        $scope.patientApptInsSearch.SearchTypeId = id;
        $scope.PatientSurgeryApptObj.PatientId = 0;
        $scope.AllPatientList1 = [];
        if ($scope.patientApptInsSearch.SearchText == '') {
            $scope.ShowPatientListDrop1 = false;
        }
    }



    $scope.SelectedPatientApptIns = function (patietnitem) {
        $scope.patientApptInsSearch.PatientId = patietnitem.PatientID;
        $scope.PatientSurgeryApptObj.PatientId = patietnitem.PatientID;
        $scope.patientApptInsSearch.SearchText = patietnitem.FullName;
        $scope.AllPatientList1 = [];
        $scope.ShowPatientListDrop1 = false;
        $scope.GetSurgeryAppointmentsList();
    };

    $scope.ChangePayorName = function (item) {
        $scope.PatientApptInsObj.PayorId = item.PayorId;
        $scope.PatientApptInsObj.PayorName = item.PayorName;
    }
    $scope.GetOrganizationNewPayorAllList = function (val) {

        if (val == undefined || val == null || val == "") {
            $scope.PatientApptInsObj.PayorId = 0;
            return false;
        }

        var param = {
            "SearchText": val || "",
            "Status": "Active",
            "PageSize": 10,
            "PageNumber": 1,
            "UserId": $scope.UserId,
            "SpecializationId": $scope.SpecializationId,
            "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
            "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
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
    $scope.checkAllDoctorApptIns = function (val) {
        angular.forEach($scope.ApptInsuranceReportDoctorList, function (item) {
            item.isChecked = val;
        });

        $scope.selectedApptInsDoctor = val ? 'All' : 'Select Doctors';

        var checkedArray = _.where($scope.ApptInsuranceReportDoctorList, { isChecked: true });
        $scope.PatientApptInsObj.AllDoctorCheck = checkedArray.length === $scope.ApptInsuranceReportDoctorList.length;
    };

    $scope.DoctorApptInsToggle = function () {
        var checkedArray = _.where($scope.ApptInsuranceReportDoctorList, { isChecked: true });
        $scope.PatientApptInsObj.AllDoctorCheck = checkedArray.length === $scope.ApptInsuranceReportDoctorList.length;

        if (checkedArray.length === 0) {
            $scope.selectedApptInsDoctor = "Select Doctor";
        } else if (checkedArray.length === 1) {
            $scope.selectedApptInsDoctor = checkedArray[0].UserFullName + '-' + checkedArray[0].NPI;
        } else {
            $scope.selectedApptInsDoctor = "Selected Doctors";
        }
    };

    $scope.GetAppointmentInsuranceReportsData = function () {


        $scope.hospitalClinicIds = $scope.ApptBranchLocations.filter(hitem => hitem.IsChecked == true).map(h => h.ClinicId);
        var hospitalIds = $scope.hospitalClinicIds.join(',')

        var selectedDoctors = $filter("filter")($scope.ApptInsuranceReportDoctorList, function (iterator, ind) { return iterator.isChecked == true; });
        if (selectedDoctors.length == 0) {
            alertify.error("Please Select Doctor");
            return false;
        }
        var newDoctorslist = "";
        for (var i in $scope.ApptInsuranceReportDoctorList) {
            if ($scope.ApptInsuranceReportDoctorList[i].isChecked) {
                newDoctorslist += "," + $scope.ApptInsuranceReportDoctorList[i].DoctorID;
            }
        }
        if (newDoctorslist.charAt(0) === ",") {
            newDoctorslist = newDoctorslist.slice(1);
        }


        var params = {
            "PatientId": $scope.patientApptInsSearch.PatientId,
            "FromDate": $scope.PatientApptInsObj.FromDate,
            "ToDate": $scope.PatientApptInsObj.ToDate,
            "hospitalIds": hospitalIds,
            "DoctorIds": newDoctorslist,
            "PayorName": $scope.PatientApptInsObj.PayorName,
            "PayorId": $scope.PatientApptInsObj.PayorId || 0,
        }
        eHnoteMainDashboardDataServices.GetAppointmentInsuranceReportsData(params).then(function (res) {

            if (res.data.Status === "Success" ) {
                $scope.ApptsInsListArray = res.data.AppointmentList || [];
            }


        }, function (err) {

        });

    }
    $scope.ClearAppointmentInsuranceReportsData = function () {
        $scope.ApptBranchLocations = [];
        var NewBranchList = localStorageFactory.getItem("allBranchesData") || [];
        initializeNewBranches(NewBranchList, "PageLoad");

        $scope.searchtxtb.txt1 = "";
        $scope.patientApptInsSearch.SearchText = "";
        $scope.patientApptInsSearch.PatientId = 0;
        $scope.PatientApptInsObj.PayorObj = "";
        $scope.PatientApptInsObj.ToDate = $filter('date')(new Date(), "MM-dd-yyyy");
        $scope.PatientApptInsObj.FromDate = $filter('date')($scope.startDate, "MM-dd-yyyy");
        $scope.GetAppointmentInsuranceReportsData();
    }

    $scope.coordinatorPerformance = function () {
        let mInstanceAdd = $uibModal.open({
            "templateUrl": "CoordinatorPerformance.html",
            "size": "lg",
            "backdrop": "static",
            "keyboard": false,
            "scope": $scope,
            //"windowClass": "modal__sixty--",
            "controller": function ($scope, $uibModal, $uibModalInstance) {
                $scope.uibclose = function () {
                    $uibModalInstance.dismiss("cancel");
                };
            }
        });
    };
    $scope.waitingTimePerformanceReport = function () {
        let mInstanceAdd = $uibModal.open({
            "templateUrl": "WaitingTimePerformanceReport.html",
            "size": "lg",
            "backdrop": "static",
            "keyboard": false,
            "scope": $scope,
            //"windowClass": "modal__sixty--",
            "controller": function ($scope, $uibModal, $uibModalInstance) {
                $scope.uibclose = function () {
                    $uibModalInstance.dismiss("cancel");
                };
            }
        });
    };
    $scope.CoordinatorAndWaitingTimePerformance = false;
    if ($window.location.host == "portal.ehnote.com" && $scope.HospitalId == 12) {
        $scope.CoordinatorAndWaitingTimePerformance = true;
    }




    /* =====================================================================
       BRANCH / LOCATION FILTER - Lead Generation + OD reports

       Both reports open on the branch the user is logged in to and let them
       widen the selection when they have access to more than one. Each
       report keeps its own copy of the branch list so a location picked on
       one tab does not move the other. The api takes the branch ids as a
       comma separated string - "3,683".
       ===================================================================== */

    function buildReportBranchList() {
        var branchData = localStorageFactory.getItem("allBranchesData") || [];
        var allBranchesAccess = ($scope.UserAccessRights && $scope.UserAccessRights.AllAccessRights)
            ? $scope.UserAccessRights.AllAccessRights.SummaryAllBranchesReports
            : true;

        var branches = angular.copy(
            eHnoteUserAppointmentDataService.RestructureNewBranches(allBranchesAccess, branchData, doctorinfo) || []);

        branches.unshift({
            "ClinicName": "All Locations",
            "BranchName": "All Locations",
            "ClinicId": 0,
            "BranchId": 0,
            "IsChecked": false
        });

        // the login user's own branch is what the report opens with
        var hasDefault = false;
        angular.forEach(branches, function (item) {
            item.IsChecked = item.ClinicId !== 0 && item.BranchId === $scope.HospitalId;
            if (item.IsChecked) { hasDefault = true; }
        });

        // their branch is not in the list - keep the report on the first one
        // rather than opening with nothing selected
        if (!hasDefault && branches.length > 1) {
            branches[1].IsChecked = true;
        }

        return branches;
    }

    function reportLocationIds(reportObj) {
        var ids = ((reportObj || {}).AllBranchesList || [])
            .filter(function (item) { return item.IsChecked && item.ClinicId !== 0; })
            .map(function (item) { return item.ClinicId; })
            .join(",");

        // the report is always scoped to at least the branch the user is on
        return ids || String($scope.HospitalId || '');
    }

    function reportLocationString(reportObj) {
        var list = (reportObj || {}).AllBranchesList || [];
        var selected = list.filter(function (item) { return item.IsChecked && item.ClinicId !== 0; });

        if (selected.length === 0) { return "Select Location"; }
        if (selected.length === 1) { return selected[0].BranchName; }
        if (selected.length === list.length - 1) { return "All Locations"; }   // minus the "All Locations" row
        return "Selected";
    }

    /* keeps the "All Locations" row in step with the individual branches, then
       refreshes the label and the id string the report sends */
    function applyReportBranchSelection(reportObj, item) {
        var list = (reportObj || {}).AllBranchesList || [];

        if (item.ClinicId === 0) {
            angular.forEach(list, function (mitem) { mitem.IsChecked = item.IsChecked; });
        } else {
            var allRow = $filter('filter')(list, { "ClinicId": 0 }, true)[0];
            if (allRow) {
                allRow.IsChecked = list.every(function (mitem) {
                    return mitem.IsChecked || mitem.ClinicId === 0;
                });
            }
        }

        /* a report is always scoped to at least one branch - unticking the
           last one snaps back to the branch the user is logged in to, so the
           label and the data the api returns never disagree */
        var stillSelected = list.filter(function (mitem) {
            return mitem.IsChecked && mitem.ClinicId !== 0;
        });
        if (stillSelected.length === 0) {
            var ownBranch = $filter('filter')(list, { "BranchId": $scope.HospitalId }, true)[0];
            if (!ownBranch && list.length > 1) { ownBranch = list[1]; }
            if (ownBranch) { ownBranch.IsChecked = true; }
        }

        reportObj.SelectLocationString = reportLocationString(reportObj);
        reportObj.LocationName = reportObj.SelectLocationString;
        reportObj.LocationId = reportLocationIds(reportObj);
    }

    /* the doctor and visit reason lists are branch scoped, so a location
       change has to pull them again before the report reloads */
    function loadBranchScopedDoctors(locationIds) {
        var subSplArray = _.pluck($scope.allSubSpecializationsArray || [], "SubSpecializationId").join(",");

        return eHnoteMainAppointmentService.getAllUsersByDepartmentIdNew({
            "BranchId": locationIds,
            "SubSpecializationIdArray": subSplArray
        }).then(function (resp) {
            if (resp.data.status !== "Success") { return []; }

            var doctorRows = _.uniq(resp.data.rows || [], false, function (p) { return p.DoctorID; });
            return $filter("filter")(doctorRows, function (item) {
                return item.RoleId === 1 || item.RoleId === 43;
            });
        });
    }

    function loadBranchScopedVisitReasons(locationIds) {
        return eHnotePatientVisitReasonServices.GetOrganizationActiveAndInActiveApptVisitReasons({
            "OrganizationId": locationIds,
            "VisitTypeId": 0,
            "SearchText": ""
        }).then(function (resp) {
            return (resp.data && resp.data.rows) ? resp.data.rows : [];
        });
    }

    $scope.GetLeadGenReportsObj = function () {
        var obj = {
            "UserId": $scope.UserId || null,
            "UserName": "",
            "PaymentFromDate": $filter('date')(new Date(), "MM-dd-yyyy"),
            "PaymentToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
            "DateRangeId": 1,
            "ServiceDateRangeId": 0,
            "SelectUserStatusString": "All Doctors",
            "SelectDoctorString": "All Doctors",
            "SelectLocationString": "Select Location",
            "LocationName": "",
            "LocationId": "",
            "AllUserStatusCheck": false,
            "AllLocationStatusCheck": false,
            "AllUsersList": [],
            "AllDoctorList": [],
            "AllBranchesList": buildReportBranchList(),
            "AllBillingProviderStatusCheck": true,
            "AllDoctorCheck": true,
            "AllLocationInd": 1,


        }

        // opens on the login user's branch
        obj.SelectLocationString = reportLocationString(obj);
        obj.LocationName = obj.SelectLocationString;
        obj.LocationId = reportLocationIds(obj);

        return obj;
    }
    
    $scope.navtoOpenInsuranceGridReport = function (tabno) {
        angular.forEach($scope.AllDoctorList, function (citem) {
            citem.id = citem.DoctorID;
            citem.title = citem.FullName;
            citem.isChecked = true;
        });
        $scope.InSubTab = tabno || "";
        if (tabno == 'Dailyreport') {
            $timeout(function () {
                $scope.InsuranceBillingProviderlist = [];
                $scope.GetInsurancePaymentGroupbyBillingProvider();
            }, 500);
        }
        else if (tabno == 'MonthlyReport') {
            $timeout(function () {
                $scope.LeadGenReportsObj = angular.copy($scope.GetLeadGenReportsObj());
                $scope.LeadGenReportsObj.AllDoctorList = $scope.AllDoctorList || [];
                $scope.LeadGenReportsObj.DateRangeId = 4;
                var currentDate = new Date();
                $scope.LeadGenReportsObj.PaymentFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                if ($scope.LeadGenReportsObj.PaymentFromDate != '') {
                    $scope.LeadGenReportsObj.PaymentFromDate = $filter('date')($scope.LeadGenReportsObj.PaymentFromDate, "MM-dd-yyyy");
                }
                if ($scope.LeadGenReportsObj.PaymentToDate != '') {
                    $scope.LeadGenReportsObj.PaymentToDate = $filter('date')($scope.LeadGenReportsObj.PaymentToDate, "MM-dd-yyyy");
                }
                $scope.LeadGenerationMonthlyReportlist = [];
              //  $scope.GetNewPatientLeadGenerationMonthlyReportSummary();
                $scope.getPatientLeadGenerationReport();
            }, 500);
        }
        else {
        }

    };

    /* 'daily' -> one column group per date, 'monthly' -> one per month.
       Chosen from the Lead Generation Reports tab dropdown - nothing loads
       until the user picks one. */
    $scope.LeadSubTab = '';

    // fills the filter bar without hitting the api - the tab title only opens
    // the dropdown, the report itself waits for Daily or Monthly
    $scope.prepareLeadGenReport = function () {
        angular.forEach($scope.AllDoctorList, function (citem) {
            citem.id = citem.DoctorID;
            citem.title = citem.FullName;
            citem.isChecked = true;
        });

        $scope.LeadGenReportsObj = angular.copy($scope.GetLeadGenReportsObj());
        $scope.LeadGenReportsObj.AllDoctorList = $scope.AllDoctorList || [];
        $scope.LeadGenReportsObj.DateRangeId = 4;          // This month
        $scope.setInsuranceCheckDateRange(4);

        $scope.LeadGenerationMonthlyReportlist = [];
    };

    /* ---------- Lead Generation location + doctor filters ---------- */

    var leadGenBranchTimer = null;

    $scope.changeLeadGenBranch = function (item) {
        applyReportBranchSelection($scope.LeadGenReportsObj, item);

        // ticking several branches in a row should cost one reload, not one each
        $timeout.cancel(leadGenBranchTimer);
        leadGenBranchTimer = $timeout(function () {
            var locationIds = $scope.LeadGenReportsObj.LocationId;

            loadBranchScopedDoctors(locationIds).then(function (doctors) {
                angular.forEach(doctors, function (citem) {
                    citem.id = citem.DoctorID;
                    citem.title = citem.FullName;
                    citem.isChecked = true;
                });

                $scope.LeadGenReportsObj.AllDoctorList = doctors;
                $scope.LeadGenReportsObj.AllDoctorCheck = true;
                $scope.LeadGenReportsObj.SelectDoctorString = 'All Doctors';

                $scope.getPatientLeadGenerationReport();
            }).catch(function (err) {
                console.error('Lead generation branch change failed', err);
            });
        }, 600);
    };

    $scope.LeadGencheckAllDoctors = function (val) {
        angular.forEach($scope.LeadGenReportsObj.AllDoctorList, function (item) {
            item.isChecked = !!val;
        });
        $scope.LeadGenReportsObj.SelectDoctorString = val ? 'All Doctors' : 'Select';
    };

    $scope.LeadGenDoctorToggle = function () {
        var checked = $filter('filter')($scope.LeadGenReportsObj.AllDoctorList, { isChecked: true }, true) || [];
        $scope.LeadGenReportsObj.AllDoctorCheck = checked.length > 0 && checked.length === $scope.LeadGenReportsObj.AllDoctorList.length;

        if (checked.length === 0) {
            $scope.LeadGenReportsObj.SelectDoctorString = 'Select';
        } else if ($scope.LeadGenReportsObj.AllDoctorCheck) {
            $scope.LeadGenReportsObj.SelectDoctorString = 'All Doctors';
        } else if (checked.length === 1) {
            $scope.LeadGenReportsObj.SelectDoctorString = checked[0].SecondUserFullName + '-' + checked[0].NPI;
        } else {
            $scope.LeadGenReportsObj.SelectDoctorString = 'Selected Doctors';
        }
    };

    $scope.navtoLeadGenReport = function (reportType) {
        if (reportType) { $scope.LeadSubTab = reportType; }

        if (!$scope.LeadSubTab) {
            alertify.error("Please select Daily or Monthly report to continue.");
            return false;
        }

        $scope.prepareLeadGenReport();

        $timeout(function () {
            $scope.getPatientLeadGenerationReport();
        }, 500);
    };

    $scope.ClickForInsuranceFilteredData = function () {
        angular.element(document.querySelector('.popover')).remove();
        $scope.getPatientLeadGenerationReport();
    }

    $scope.ClearInsuranceFilters = function () {
        angular.element(document.querySelector('.popover')).remove();

        // filters back to the defaults the tab opens with - every doctor on,
        // the report back on the login user's branch
        $scope.prepareLeadGenReport();

        $scope.getPatientLeadGenerationReport();
    };


    $scope.getPatientLeadGenerationReport = function () {
        if (!$scope.LeadSubTab) {
            alertify.error("Please select Daily or Monthly report to continue.");
            return false;
        }
        if (!$scope.LeadGenReportsObj) { return; }

        var UserIds = $scope.LeadGenReportsObj.AllDoctorList
            .filter(function (pitem) { return pitem.isChecked; })
            .map(function (pitem) { return pitem.DoctorID; })
            .join(",");

        var gridDiv = document.getElementById('InspopupAgGrid');
        if (!gridDiv) {
            console.warn('Popup ag-Grid div not found');
            return;
        }

        // destroy a grid left over from a previous entry into this tab
        if ($scope.monthlyGridApi) {
            try { $scope.monthlyGridApi.destroy(); } catch (e) { /* noop */ }
            $scope.monthlyGridApi = null;
        }

        var isDateWise = $scope.LeadSubTab === 'daily';

        /* ---------- helpers ---------- */

        // "Aug-2026" (month wise) or a date key like "2026-08-05" (day wise)
        function bucketToDate(label) {
            var map = {
                Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
                Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
            };
            var parts = String(label).split(/[-\/]/);

            if (parts.length === 2) {
                return new Date(Number(parts[1]), map[parts[0]] || 0, 1);
            }
            if (parts.length === 3) {
                if (parts[0].length === 4) {
                    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
                }
                if (map[parts[0]] !== undefined) {
                    return new Date(Number(parts[2]), map[parts[0]], Number(parts[1]));
                }
                return new Date(Number(parts[2]), Number(parts[0]) - 1, Number(parts[1]));
            }
            var loose = new Date(label);
            return isNaN(loose.getTime()) ? new Date(0) : loose;
        }

        function bucketHeader(label) {
            if (!isDateWise) { return label; }
            var d = bucketToDate(label);
            return d.getTime() ? $filter('date')(d, 'dd MMM') : label;
        }

        // the pinned row is a total, not a doctor - it reads bold and nothing
        // in it drills down, so it never gets the clickable cursor
        function isSummaryCell(p) {
            return !!(p.node && p.node.rowPinned);
        }

        function summaryCellStyle(p) {
            return isSummaryCell(p) ? { fontWeight: '700' } : null;
        }

        function metricCol(bucket, key, header) {
            return {
                headerName: header,
                width: 100,
                wrapHeaderText: true,
                autoHeaderHeight: true,
                type: 'numericColumn',
                month: bucket,       // bucket key sent to the details api
                metricKey: key,
                valueGetter: function (p) {
                    if (p.data && p.data.data && p.data.data[bucket]) {
                        return Number(p.data.data[bucket][key]) || 0;
                    }
                    return 0;
                },
                cellStyle: function (p) {
                    if (isSummaryCell(p)) { return { fontWeight: '700' }; }
                    return p.value > 0 ? { cursor: 'pointer' } : null;
                }
            };
        }

        // one row under the grid carrying every doctor's numbers added up, per
        // bucket and metric - the buckets come off the rows, same as the columns
        function buildSummaryRow(rows) {
            var summary = { name: 'Total', IsSummaryRow: true, data: {} };

            angular.forEach(rows, function (r) {
                angular.forEach(r.data || {}, function (cell, bucket) {
                    if (!summary.data[bucket]) {
                        summary.data[bucket] = { scheduled: 0, seen: 0, surgeries: 0 };
                    }
                    angular.forEach(['scheduled', 'seen', 'surgeries'], function (k) {
                        summary.data[bucket][k] += Number(cell && cell[k]) || 0;
                    });
                });
            });

            return [summary];
        }

        function buildColumnDefs(rows) {
            // collect unique bucket keys WITHOUT Object.keys
            var bucketMap = {};
            var buckets = [];
            angular.forEach(rows, function (r) {
                angular.forEach(r.data || {}, function (v, m) {
                    if (!bucketMap[m]) {
                        bucketMap[m] = true;
                        buckets.push(m);
                    }
                });
            });

            buckets.sort(function (a, b) {
                return bucketToDate(a) - bucketToDate(b);
            });

            var cols = [
                { headerName: 'Doctor', field: 'name', pinned: 'left', width: 220, cellStyle: summaryCellStyle }
            ];

            angular.forEach(buckets, function (bucket) {
                cols.push({
                    headerName: bucketHeader(bucket),
                    children: [
                        metricCol(bucket, 'scheduled', 'Sched.'),
                        metricCol(bucket, 'seen', 'Seen'),
                        metricCol(bucket, 'surgeries', 'Surg.')
                    ]
                });
            });

            return cols;
        }

        /* ---------- grid ---------- */

        var gridOptions = {
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

                // ignore the summary row and the pinned "Doctor" name column
                if (params.node && params.node.rowPinned) { return; }
                if (!colDef.metricKey) { return; }

                var clicked = {
                    doctorName: params.data.name,
                    doctorRow: params.data,          // whole row if you need the id
                    month: colDef.month,          // "Jul-2026" or the date bucket
                    metric: colDef.metricKey,      // "scheduled" | "seen" | "surgeries"
                    value: params.value,          // the number that was clicked
                    isDateWise: isDateWise
                };

                // Angular may be outside a digest here, so wrap the call
                $scope.$applyAsync(function () {
                    $scope.OnMonthlyCellClicked(clicked);
                });
            },

            onGridReady: function (params) {
                $scope.monthlyGridApi = params.api;

                var payload = {
                    "ReportType": $scope.LeadSubTab,
                    "ParentOrganizationId": $scope.ParenthospitalId,
                    "AllLocationInd": 0,
                    // comma separated when more than one branch is picked - "3,683"
                    "LocationId": reportLocationIds($scope.LeadGenReportsObj),
                    "UserIds": UserIds,
                    "StartDate": $scope.LeadGenReportsObj.PaymentFromDate,
                    "EndDate": $scope.LeadGenReportsObj.PaymentToDate,
                    "PageSize": 1000,
                    "PageNumber": 1
                };

                // daily and monthly are backed by different procs / endpoints
                var loadReport = isDateWise
                    ? eHnoteMainDashboardDataServices.GetNewPatientLeadGenerationDailyReport
                    : eHnoteMainDashboardDataServices.GetNewPatientLeadGenerationReport;

                loadReport(payload)
                    .then(function (resp) {
                        if (resp.data.status === "Success") {
                            var rows = resp.data.rows || [];
                            $scope.MonthlyReportCount = resp.data.Count;
                            $scope.monthlyGridApi.setGridOption('columnDefs', buildColumnDefs(rows));
                            $scope.monthlyGridApi.setGridOption('rowData', rows);
                            $scope.monthlyGridApi.setGridOption('pinnedBottomRowData', buildSummaryRow(rows));
                        }
                    })
                    .catch(function (err) {
                        console.error('Monthly report load failed', err);
                    });
            }
        };

        $scope.monthlyGridApi = agGrid.createGrid(gridDiv, gridOptions);

    }

    $scope.OnMonthlyCellClicked = function (info) {
        // info.doctorName, info.month, info.metric, info.value, info.doctorRow
        if (!(info.value > 0)) { return; }   // nothing behind a 0

        var row = info.doctorRow || {};
        var doctorId = row.DoctorId || row.doctorId || row.UserId || row.id || '';

        $scope.openInsurancePaymentPopup(doctorId, 'SurgeryDetails', info);
    };

    $scope.GetNewPatientLeadGenerationMonthlyReportSummary = function () {

        $scope.InsBillingProviderCharList = [];
        $scope.InsBillingProviderSummaryChartList = [];

        let UserIds = ($scope.LeadGenReportsObj.AllDoctorList || [])
            .filter(pitem => pitem.isChecked)
            .map(pitem => pitem.DoctorID)
            .join(",");

        let obj = {
            "ReportType": "monthly",
            "ParentOrganizationId": $scope.ParenthospitalId,
            "AllLocationInd": 0,
            "LocationId": reportLocationIds($scope.LeadGenReportsObj),
            "UserIds": UserIds || "",
            "StartDate": $scope.LeadGenReportsObj.PaymentFromDate || "",
            "EndDate": $scope.LeadGenReportsObj.PaymentToDate || "",
            "PageSize": 1000,
            "PageNumber": 1
        };

        eHnoteMainDashboardDataServices.GetNewPatientLeadGenerationReportSummary(obj).then(function (resp) {
            if (resp.data.status == "Success") {
                $scope.LeadGenerationMonthlyReportlist = resp.data.row || [];
            } else {
                alertify.error(resp.data.Message);
            }
        });
    };


    $scope.GetInsBillingProviderChart = function () {

        // 1️⃣ Get container
        if (!InsBillingProviderchartContainer) {
            InsBillingProviderchartContainer =
                document.getElementById("InsBillingProviderBarChart");
        }
        if (!InsBillingProviderchartContainer) return;

        // 2️⃣ Prepare data (ONLY PAYMENT)
        const chartData = angular.isArray($scope.InsBillingProviderCharList)
            ? $scope.InsBillingProviderCharList.map(item => ({
                month: item.Month,
                provider: item.DoctorName,
                payment: Number(item.TotalPaymentAmount) || 0
            }))
            : [];

        // ✅ If no data → clear chart
        if (!chartData.length) {
            if (InsbillingProviderChart) {
                InsbillingProviderChart.destroy();
                InsbillingProviderChart = null;
            }
            return;
        }

        // 3️⃣ Build series (NO custom colors)
        const providers = [...new Set(chartData.map(x => x.provider))];
        const series = [];

        providers.forEach(provider => {
            series.push({
                type: "bar",
                xKey: "month",
                yKey: "payment",
                yName: provider + " - Ins Payment",
                data: chartData.filter(x => x.provider === provider)
            });
        });

        // 4️⃣ Chart options
        const options = {
            container: InsBillingProviderchartContainer,

            series: series,

            legend: { position: "top" },

            tooltip: {
                renderer: function (params) {
                    const value = Number(params.datum[params.yKey] || 0);
                    return {
                        content: `${params.yName}: $${value.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}`
                    };
                }
            },

            axes: [
                {
                    type: "category",
                    position: "bottom",
                    title: { text: "Month" }
                },
                {
                    type: "number",
                    position: "left",
                    title: { text: "Amount ($)" },
                    label: {
                        formatter: p =>
                            `$ ${Number(p.value).toLocaleString("en-US", {
                                maximumFractionDigits: 2
                            })}`
                    }
                }
            ]
        };

        // 5️⃣ Destroy & create
        if (InsbillingProviderChart) {
            InsbillingProviderChart.destroy();
        }

        InsbillingProviderChart = agCharts.AgCharts.create(options);
    };

    $scope.GetInsuranceSummarybyRenderingProvider = function () {

        $scope.InsBillingProviderCharList = [];
        $scope.InsBillingProviderSummaryChartList = [];
        var Locationids = $scope.ApptBranchLocations
            .filter(pitem => pitem.IsChecked && pitem.ClinicId !== 0)
            .map(pitem => pitem.ClinicId)
            .join(",");

        let UserIds = $scope.NewPatientReportDoctorList
            .filter(pitem => pitem.isChecked)
            .map(pitem => pitem.DoctorID)
            .join(",");
        
        let obj = {
            "ReportType": "monthly",
            "ParentOrganizationId": $scope.ParenthospitalId,
            "AllLocationInd": 0,
          //  "LocationId": Locationids || "",
            "LocationId": $scope.HospitalId|| "",
            "UserIds": UserIds || "",      
            "StartDate": $scope.LeadGenReportsObj.PaymentFromDate || "",
            "EndDate": $scope.LeadGenReportsObj.PaymentToDate || "",
            "PageSize": 1000,
            "PageNumber": 1
        };

        eHnoteMainDashboardDataServices.GetNewPatientLeadGenerationReport(obj).then(function (resp) {
            if (resp.data.status == "Success") {
                $scope.InsuranceBillingProviderlist = resp.data.rows || [];

                $scope.InsBillingProviderCharList = resp.data.MonthWiseData || [];

                $scope.ShowBillingProviderMonthsDataSummary = false;

                if ($scope.InsBillingProviderCharList.length > 0) {

                    if ($scope.LeadGenReportsObj.PaymentDateRangeId == 7 || $scope.LeadGenReportsObj.PaymentDateRangeId == 6) {
                        $scope.ShowBillingProviderMonthsDataSummary = true;
                        $scope.MonthsArray = $scope.LeadGenReportsObj.MonthsArray;
                        $scope.InsBillingProviderSummaryChartList = buildMonthWisePaymentMapTable($scope.InsBillingProviderCharList, $scope.MonthsArray, 'InsBillingProvider');
                    } else {
                        $scope.ShowBillingProviderMonthsDataSummary = false;
                    }
                    $scope.InsBillingProviderCharList = sortMonthWiseDataByYear($scope.InsBillingProviderCharList);

                    $timeout(function () {

                        InsBillingProviderchartContainer = $document[0].getElementById("InsBillingProviderBarChart");
                        $scope.GetInsBillingProviderChart();
                    }, 0);
                }

            } else {
                alertify.error(resp.data.Message);
            }
        });
    };



    $scope.showLeadDetails = function (info) {
        $uibModal.open({
            size: 'lg',
            backdrop: true,
            controller: ['$scope', '$uibModalInstance', 'PObj',
                function ($scope, $uibModalInstance, PObj) {
                    $scope.info = PObj;
                    $scope.closeDetails = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                }],
            resolve: { PObj: function () { return info; } },
            template:
                '<div class="modal-header">' +
                '  <button type="button" class="close" ng-click="closeDetails()">&times;</button>' +
                '  <h4 class="modal-title">{{info.metricLabel}} — {{info.doctor}} ({{info.month}})</h4>' +
                '</div>' +
                '<div class="modal-body" style="max-height:70vh;overflow:auto;">' +
                '  <div ng-if="!info.details.length" class="text-muted">No patients found.</div>' +
                '  <table ng-if="info.details.length" class="table table-striped table-bordered">' +
                '    <thead><tr>' +
                '      <th>#</th><th>Patient</th><th>MR #</th><th>DOB</th>' +
                '      <th>Gender</th><th>Mobile</th><th>Appt Date</th><th>Visit Reason</th>' +
                '    </tr></thead>' +
                '    <tbody>' +
                '      <tr ng-repeat="p in info.details">' +
                '        <td>{{$index + 1}}</td>' +
                '        <td>{{p.FullName}}</td>' +
                '        <td>{{p.MRNumber}}</td>' +
                '        <td>{{p.DOB}}</td>' +
                '        <td>{{p.Gender || "-"}}</td>' +
                '        <td>{{p.MobileNo}}</td>' +
                '        <td>{{p.AppointmentDate}}</td>' +
                '        <td>{{p.AppointmentVisitReason}}</td>' +
                '      </tr>' +
                '    </tbody>' +
                '  </table>' +
                '</div>' +
                '<div class="modal-footer">' +
                '  <button class="btn btn-default" ng-click="closeDetails()">Close</button>' +
                '</div>'
        });
    };

    $scope.openInsurancePaymentPopup = function (id, type, item) {
        let obj = {
            "id": id || 1,
            "type": type || '',
            "Mainobj": angular.copy($scope.LeadGenReportsObj),
            "selecteditem": item,
        }
        let mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/UsClaims/Reports/LeadGenerationGridContainer.html",
            "backdrop": "static",
            "keyboard": false,
            "resolve": {
                "PObj": function () { return obj; }
            },
            "windowClass": "offcanves-right",
            "controller": "UsLeadGenerationGridContainerCtrl",

        });
    }


    /* =====================================================================
       OD REPORT
       Same shape as the Lead Generation monthly report - doctor rows, one
       column group per month (or per day for a short range), a Total group
       and a pinned grand-total row - plus a Visit Reason filter.
       ===================================================================== */

    $scope.GetODReportObj = function () {
        var obj = {
            "PaymentFromDate": "",
            "PaymentToDate": "",
            "DateRangeId": 4,
            "SelectDoctorString": "All Doctors",
            "SelectVisitReasonString": "All Visit Reasons",
            "SelectLocationString": "Select Location",
            "LocationName": "",
            "LocationId": "",
            "AllDoctorCheck": true,
            "AllVisitReasonCheck": true,
            "AllDoctorList": [],
            "VisitReasonList": [],
            "AllBranchesList": buildReportBranchList()
        };

        // opens on the login user's branch
        obj.SelectLocationString = reportLocationString(obj);
        obj.LocationName = obj.SelectLocationString;
        obj.LocationId = reportLocationIds(obj);

        return obj;
    };

    $scope.setODReportDateRange = function (selectedRangeId) {
        var currentDate = new Date();

        switch (selectedRangeId) {
            case 1: // Today
                $scope.ODReportsObj.PaymentFromDate = new Date(currentDate);
                $scope.ODReportsObj.PaymentToDate = new Date(currentDate);
                break;
            case 4: // This month
                $scope.ODReportsObj.PaymentFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                $scope.ODReportsObj.PaymentToDate = new Date();
                break;
            case 5: // Last month
                $scope.ODReportsObj.PaymentFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
                $scope.ODReportsObj.PaymentToDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
                break;
            case 6: // Last 2 months
                $scope.ODReportsObj.PaymentFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1);
                $scope.ODReportsObj.PaymentToDate = new Date();
                break;
            case 7: // Last 3 months
                $scope.ODReportsObj.PaymentFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, 1);
                $scope.ODReportsObj.PaymentToDate = new Date();
                break;
            case 9: // This year
                $scope.ODReportsObj.PaymentFromDate = new Date(currentDate.getFullYear(), 0, 1);
                $scope.ODReportsObj.PaymentToDate = new Date();
                break;
            case 10: // Last year
                $scope.ODReportsObj.PaymentFromDate = new Date(currentDate.getFullYear() - 1, 0, 1);
                $scope.ODReportsObj.PaymentToDate = new Date(currentDate.getFullYear() - 1, 11, 31);
                break;
            case 11: // Custom Date
                $scope.ODReportsObj.PaymentFromDate = null;
                $scope.ODReportsObj.PaymentToDate = null;
                break;
            default:
                $scope.ODReportsObj.PaymentFromDate = "";
                $scope.ODReportsObj.PaymentToDate = "";
        }

        if ($scope.ODReportsObj.PaymentFromDate) {
            $scope.ODReportsObj.PaymentFromDate = $filter('date')($scope.ODReportsObj.PaymentFromDate, "MM-dd-yyyy");
        }
        if ($scope.ODReportsObj.PaymentToDate) {
            $scope.ODReportsObj.PaymentToDate = $filter('date')($scope.ODReportsObj.PaymentToDate, "MM-dd-yyyy");
        }
    };

    /* ---------- filter dropdowns ---------- */

    $scope.ODcheckAllDoctors = function (val) {
        angular.forEach($scope.ODReportsObj.AllDoctorList, function (item) {
            item.isChecked = !!val;
        });
        $scope.ODReportsObj.SelectDoctorString = val ? 'All Doctors' : 'Select';
    };

    $scope.ODDoctorToggle = function () {
        var checked = $filter('filter')($scope.ODReportsObj.AllDoctorList, { isChecked: true }, true) || [];
        $scope.ODReportsObj.AllDoctorCheck = checked.length > 0 && checked.length === $scope.ODReportsObj.AllDoctorList.length;

        if (checked.length === 0) {
            $scope.ODReportsObj.SelectDoctorString = 'Select';
        } else if ($scope.ODReportsObj.AllDoctorCheck) {
            $scope.ODReportsObj.SelectDoctorString = 'All Doctors';
        } else if (checked.length === 1) {
            $scope.ODReportsObj.SelectDoctorString = checked[0].SecondUserFullName + '-' + checked[0].NPI;
        } else {
            $scope.ODReportsObj.SelectDoctorString = 'Selected Doctors';
        }
    };

    var odBranchTimer = null;

    /* pulls the doctor and visit reason lists for whatever branches are now
       selected, then reloads the grid */
    function reloadODBranchScopedFilters() {
        var locationIds = $scope.ODReportsObj.LocationId;

        return $q.all([
            loadBranchScopedDoctors(locationIds),
            loadBranchScopedVisitReasons(locationIds)
        ]).then(function (results) {
            var doctors = results[0] || [];
            var visitReasons = results[1] || [];

            angular.forEach(doctors, function (citem) { citem.isChecked = true; });
            angular.forEach(visitReasons, function (citem) { citem.isChecked = true; });

            $scope.ODReportsObj.AllDoctorList = doctors;
            $scope.ODReportsObj.VisitReasonList = visitReasons;
            $scope.ODReportsObj.AllDoctorCheck = true;
            $scope.ODReportsObj.AllVisitReasonCheck = true;
            $scope.ODReportsObj.SelectDoctorString = 'All Doctors';
            $scope.ODReportsObj.SelectVisitReasonString = 'All Visit Reasons';

            $scope.getODReport();
        }).catch(function (err) {
            console.error('OD report branch change failed', err);
        });
    }

    $scope.changeODReportBranch = function (item) {
        applyReportBranchSelection($scope.ODReportsObj, item);

        // ticking several branches in a row should cost one reload, not one each
        $timeout.cancel(odBranchTimer);
        odBranchTimer = $timeout(reloadODBranchScopedFilters, 600);
    };

    $scope.ODcheckAllVisitReasons = function (val) {
        angular.forEach($scope.ODReportsObj.VisitReasonList, function (item) {
            item.isChecked = !!val;
        });
        $scope.ODReportsObj.SelectVisitReasonString = val ? 'All Visit Reasons' : 'Select';
    };

    $scope.ODVisitReasonToggle = function () {
        var checked = $filter('filter')($scope.ODReportsObj.VisitReasonList, { isChecked: true }, true) || [];
        $scope.ODReportsObj.AllVisitReasonCheck = checked.length > 0 && checked.length === $scope.ODReportsObj.VisitReasonList.length;

        if (checked.length === 0) {
            $scope.ODReportsObj.SelectVisitReasonString = 'Select';
        } else if ($scope.ODReportsObj.AllVisitReasonCheck) {
            $scope.ODReportsObj.SelectVisitReasonString = 'All Visit Reasons';
        } else if (checked.length === 1) {
            $scope.ODReportsObj.SelectVisitReasonString = checked[0].Reason;
        } else {
            $scope.ODReportsObj.SelectVisitReasonString = 'Selected';
        }
    };

    /* ---------- entry points ---------- */

    /* 'daily' -> one row per doctor per date, 'monthly' -> one column group
       per month. Chosen from the OD Reports tab dropdown - nothing loads until
       the user picks one. */
    $scope.ODSubTab = '';

    // fills the filter bar without hitting the api - the tab title only opens
    // the dropdown, the report itself waits for Daily or Monthly
    $scope.prepareODReport = function () {
        $scope.ODReportsObj = angular.copy($scope.GetODReportObj());

        angular.forEach($scope.AllDoctorList, function (citem) {
            citem.isChecked = true;
        });
        angular.forEach($scope.AllVisitreasons, function (citem) {
            citem.isChecked = true;
        });

        $scope.ODReportsObj.AllDoctorList = $scope.AllDoctorList || [];
        $scope.ODReportsObj.VisitReasonList = $scope.AllVisitreasons || [];
        $scope.ODReportsObj.DateRangeId = 4;
        $scope.setODReportDateRange(4);
    };

    $scope.navtoODReport = function (reportType) {
        if (reportType) { $scope.ODSubTab = reportType; }

        if (!$scope.ODSubTab) {
            alertify.error("Please select Daily or Monthly report to continue.");
            return false;
        }

        $scope.prepareODReport();

        $timeout(function () {
            $scope.getODReport();
        }, 500);
    };

    $scope.ClickForODFilteredData = function () {
        angular.element(document.querySelector('.popover')).remove();
        $scope.getODReport();
    };

    $scope.ClearODFilters = function () {
        angular.element(document.querySelector('.popover')).remove();

        $scope.ODcheckAllDoctors(true);
        $scope.ODcheckAllVisitReasons(true);
        $scope.ODReportsObj.AllDoctorCheck = true;
        $scope.ODReportsObj.AllVisitReasonCheck = true;
        $scope.ODReportsObj.DateRangeId = 4;
        $scope.setODReportDateRange(4);

        // back to the login user's branch, with the doctor / visit reason
        // lists pulled again for it
        $scope.ODReportsObj.AllBranchesList = buildReportBranchList();
        $scope.ODReportsObj.SelectLocationString = reportLocationString($scope.ODReportsObj);
        $scope.ODReportsObj.LocationName = $scope.ODReportsObj.SelectLocationString;
        $scope.ODReportsObj.LocationId = reportLocationIds($scope.ODReportsObj);

        $timeout.cancel(odBranchTimer);
        reloadODBranchScopedFilters();
    };

    $scope.getODReport = function () {
        if (!$scope.ODSubTab) {
            alertify.error("Please select Daily or Monthly report to continue.");
            return false;
        }
        if (!$scope.ODReportsObj) { return; }

        var UserIds = ($scope.ODReportsObj.AllDoctorList || [])
            .filter(function (pitem) { return pitem.isChecked; })
            .map(function (pitem) { return pitem.DoctorID; })
            .join(",");

        var VisitReasonIds = ($scope.ODReportsObj.VisitReasonList || [])
            .filter(function (pitem) { return pitem.isChecked; })
            .map(function (pitem) { return pitem.ParentAppointmentVisitReasonId; })
            .join(",");

        var gridDiv = document.getElementById('ODReportAgGrid');
        if (!gridDiv) {
            console.warn('OD report ag-Grid div not found');
            return;
        }

        if ($scope.odGridApi) {
            try { $scope.odGridApi.destroy(); } catch (e) { /* noop */ }
            $scope.odGridApi = null;
        }

        var isDateWise = $scope.ODSubTab === 'daily';

        /* ---------- helpers ---------- */

        // "Aug-2026" (month wise) or a date key (day wise)
        function bucketToDate(label) {
            var map = {
                Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
                Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
            };
            var parts = String(label).split(/[-\/]/);

            if (parts.length === 2) {
                return new Date(Number(parts[1]), map[parts[0]] || 0, 1);
            }
            if (parts.length === 3) {
                if (parts[0].length === 4) {
                    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
                }
                if (map[parts[0]] !== undefined) {
                    return new Date(Number(parts[2]), map[parts[0]], Number(parts[1]));
                }
                return new Date(Number(parts[2]), Number(parts[0]) - 1, Number(parts[1]));
            }
            var loose = new Date(label);
            return isNaN(loose.getTime()) ? new Date(0) : loose;
        }

        function bucketHeader(label) {
            if (!isDateWise) { return label; }
            var d = bucketToDate(label);
            return d.getTime() ? $filter('date')(d, 'dd MMM') : label;
        }

        // friendlier headers for the metric keys the proc returns; anything not
        // listed falls back to the key itself, so a new metric still renders
        var metricHeaders = {
            TotalAppointmentsScheduled: 'Total Sched.',
            NewAppointments: 'New Appts',
            NewAppointmentsSeen: 'New Seen',
            TotalSeen: 'Total Seen',
            NoShow: 'No Show',
            Cancelled: 'Cancelled'
        };

        function headerFor(key) {
            return metricHeaders[key] || key;
        }

        // the pinned row is a total, not a doctor - it reads bold and nothing
        // in it drills down, so it never gets the clickable cursor
        function isSummaryCell(p) {
            return !!(p.node && p.node.rowPinned);
        }

        function summaryCellStyle(p) {
            return isSummaryCell(p) ? { fontWeight: '700' } : null;
        }

        function metricCol(bucket, key) {
            return {
                headerName: headerFor(key),
                width: 120,
                wrapHeaderText: true,
                autoHeaderHeight: true,
                type: 'numericColumn',
                bucket: bucket,
                metricKey: key,
                valueGetter: function (p) {
                    if (p.data && p.data.data && p.data.data[bucket]) {
                        return Number(p.data.data[bucket][key]) || 0;
                    }
                    return 0;
                },
                cellStyle: function (p) {
                    if (isSummaryCell(p)) { return { fontWeight: '700' }; }
                    return p.value > 0 ? { cursor: 'pointer' } : null;
                }
            };
        }

        function totalCol(key) {
            return {
                headerName: headerFor(key),
                width: 120,
                wrapHeaderText: true,
                autoHeaderHeight: true,
                type: 'numericColumn',
                pinned: 'right',
                cellStyle: { fontWeight: '700' },
                valueGetter: function (p) {
                    var sum = 0;
                    angular.forEach((p.data && p.data.data) || {}, function (cell) {
                        sum += Number(cell && cell[key]) || 0;
                    });
                    return sum;
                }
            };
        }

        // buckets and metric keys both come from the response, so the grid
        // follows whatever the proc returns without a code change here
        function collectBuckets(rows) {
            var seen = {};
            var buckets = [];
            angular.forEach(rows, function (r) {
                angular.forEach(r.data || {}, function (v, b) {
                    if (!seen[b]) {
                        seen[b] = true;
                        buckets.push(b);
                    }
                });
            });
            buckets.sort(function (a, b) {
                return bucketToDate(a) - bucketToDate(b);
            });
            return buckets;
        }

        function collectMetricKeys(rows) {
            var seen = {};
            var keys = [];
            angular.forEach(rows, function (r) {
                angular.forEach(r.data || {}, function (cell) {
                    angular.forEach(cell || {}, function (v, k) {
                        if (!seen[k]) {
                            seen[k] = true;
                            keys.push(k);
                        }
                    });
                });
            });
            return keys;
        }

        function buildColumnDefs(buckets, metricKeys) {
            var cols = [
                { headerName: 'Doctor', field: 'DoctorName', pinned: 'left', width: 220, cellStyle: summaryCellStyle }
            ];

            angular.forEach(buckets, function (bucket) {
                cols.push({
                    headerName: bucketHeader(bucket),
                    children: metricKeys.map(function (key) {
                        return metricCol(bucket, key);
                    })
                });
            });

            //if (metricKeys.length) {
            //    cols.push({
            //        headerName: 'Total',
            //        children: metricKeys.map(function (key) {
            //            return totalCol(key);
            //        })
            //    });
            //}

            return cols;
        }

        function buildSummaryRow(rows, buckets, metricKeys) {
            var summary = { DoctorName: 'Total', IsSummaryRow: true, data: {} };

            angular.forEach(buckets, function (b) {
                summary.data[b] = {};
                angular.forEach(metricKeys, function (k) { summary.data[b][k] = 0; });
            });

            angular.forEach(rows, function (r) {
                angular.forEach(r.data || {}, function (cell, b) {
                    if (!summary.data[b]) { summary.data[b] = {}; }
                    angular.forEach(metricKeys, function (k) {
                        summary.data[b][k] = (summary.data[b][k] || 0) + (Number(cell && cell[k]) || 0);
                    });
                });
            });

            return [summary];
        }

        /* ---------- grid ---------- */

        var gridOptions = {
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

                if (params.node && params.node.rowPinned) { return; }
                if (!colDef.metricKey) { return; }

                var clicked = {
                    doctorName: params.data.DoctorName,
                    doctorRow: params.data,
                    // monthly: the bucket lives on the column, daily: on the row
                    month: colDef.bucket || params.data.Bucket,
                    metric: colDef.metricKey,
                    value: params.value,
                    isDateWise: isDateWise
                };

                $scope.$applyAsync(function () {
                    $scope.OnODCellClicked(clicked);
                });
            },

            onGridReady: function (params) {
                $scope.odGridApi = params.api;

                var payload = {
                    "ReportType": $scope.ODSubTab,
                    "ParentOrganizationId": $scope.ParenthospitalId,
                    "AllLocationInd": 0,
                    // comma separated when more than one branch is picked - "3,683"
                    "LocationId": reportLocationIds($scope.ODReportsObj),
                    "UserIds": UserIds,
                    "VisitReasonIds": VisitReasonIds,
                    "StartDate": $scope.ODReportsObj.PaymentFromDate,
                    "EndDate": $scope.ODReportsObj.PaymentToDate,
                    "PageSize": 100,
                    "PageNumber": 1
                };

                // daily and monthly are backed by different procs / endpoints
                var loadReport = isDateWise
                    ? eHnoteMainDashboardDataServices.GetODDailyReport
                    : eHnoteMainDashboardDataServices.GetODReport;

                loadReport(payload)
                    .then(function (resp) {
                        if (resp.data.status === "Success") {
                            var rows = resp.data.rows || [];
                            var buckets = collectBuckets(rows);
                            var metricKeys = collectMetricKeys(rows);

                            $scope.ODReportCount = resp.data.Count;

                            // same pivot for both - one column group per bucket,
                            // the date sitting on top exactly where the month does
                            $scope.odGridApi.setGridOption('columnDefs', buildColumnDefs(buckets, metricKeys));
                            $scope.odGridApi.setGridOption('rowData', rows);
                            $scope.odGridApi.setGridOption('pinnedBottomRowData', buildSummaryRow(rows, buckets, metricKeys));
                        } else {
                            alertify.error(resp.data.Message);
                        }
                    })
                    .catch(function (err) {
                        console.error('OD report load failed', err);
                    });
            }
        };

        $scope.odGridApi = agGrid.createGrid(gridDiv, gridOptions);
    };

    $scope.OnODCellClicked = function (info) {
        if (!(info.value > 0)) { return; }   // nothing behind a 0

        var row = info.doctorRow || {};
        var doctorId = row.DoctorId || row.doctorId || row.UserId || row.id || '';

        $scope.openODReportPopup(doctorId, 'ODDetails', info);
    };

    $scope.openODReportPopup = function (id, type, item) {
        let obj = {
            "id": id || 1,
            "type": type || '',
            "Mainobj": angular.copy($scope.ODReportsObj),
            "selecteditem": item,
        };
        $uibModal.open({
            "templateUrl": "templates/UsClaims/Reports/ODReportGridContainer.html",
            "backdrop": "static",
            "keyboard": false,
            "resolve": {
                "PObj": function () { return obj; }
            },
            "windowClass": "offcanves-right",
            "controller": "UsODReportGridContainerCtrl"
        });
    };


    /* =====================================================================
       EXCEL EXPORT - Lead Generation + OD

       Same pipeline the billing reports use: the job row is written first,
       the api then builds the csv (inline for a short range, queued for a
       long one) and the status popup hands out the download link.
       ===================================================================== */

    $scope.LEAD_GEN_EXPORT_REPORT_ID = 16;
    $scope.OD_EXPORT_REPORT_ID = 17;

    function loggedInUserName() {
        /* AllDoctorList is filtered down to providers, so a front desk or admin
           login is not in it and the export lands with a blank user - the
           unfiltered AllUsersList is the one to read, the same way the audit and
           insurance exports do it */
        var me = $filter('filter')($scope.AllUsersList || [], { 'DoctorID': $scope.UserId }, true) || [];
        if (me.length === 0) {
            me = $filter('filter')($scope.AllDoctorList || [], { 'DoctorID': $scope.UserId }, true) || [];
        }
        return me.length > 0 ? (me[0].FullName || me[0].SecondUserFullName || '') : '';
    }

    /* the period the report was run for, read off the same dropdown list the
       filter bar is built from - the export row and the sheet title carry it so
       two exports of the same report can be told apart in the download list */
    function dashboardPeriodLabel(dateRangeId) {
        var match = ($scope.PaymentDateRangeArray || []).filter(function (r) {
            return r.Id === Number(dateRangeId);
        });
        return match.length > 0 ? match[0].Name : '';
    }

    /* "OD Daily Report" -> "OD Daily Report - Custom Date" */
    function withPeriod(reportName, dateRangeId) {
        var period = dashboardPeriodLabel(dateRangeId);
        return period ? reportName + ' - ' + period : reportName;
    }

    function buildReportExportObj(reportId, reportName, fromDate, toDate, requestDetails) {
        // a short range is cheap enough to build inline, longer ones are queued
        var from = new Date(fromDate);
        var to = new Date(toDate);
        var diffDays = (to - from) / (1000 * 60 * 60 * 24);

        return {
            "ExportJobId": 0,
            "UserId": $scope.UserId,
            "RequestedByUserId": $scope.UserId,
            "RequestedByUserName": loggedInUserName(),
            "OrganizationId": $scope.HospitalId,
            "ParentOrganizationId": $scope.ParenthospitalId,
            "ReportName": reportName,
            "ReportId": reportId,
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
            "RequestType": (isNaN(diffDays) || diffDays <= 7) ? "Immediate" : "TaskRun",
            "RequestDetails": requestDetails
        };
    }

    $scope.ExportSummarylist = [];

    $scope.GetReportExportStatusList = function (activeMasterReportId) {
        let obj = {
            "OrganizationId": $scope.HospitalId,
            "RequestedByUserId": $scope.UserId,
            "FromDate": "",
            "ToDate": "",
            "PageSize": 100,
            "PageNumber": 1,
            "StatusId": 0,
            "ReportId": activeMasterReportId
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
    };

    function openExportStatusPopup(reportId, reportName) {
        $scope.ExcelReportsObj = { "ReportId": reportId, "ReportName": reportName };

        $uibModal.open({
            "templateUrl": "templates/USBilling/uibpopups/excelExport.html",
            "backdrop": "static",
            "keyboard": false,
            "scope": $scope,
            "windowClass": "modal__seventy--",
            "controller": ["$scope", "$uibModalInstance", function ($scope, $uibModalInstance) {
                $scope.GetReportExportStatusList(reportId);
                $scope.uibclose = function () {
                    $uibModalInstance.dismiss("cancel");
                };
            }]
        });
    }

    /* ---------- Lead Generation ---------- */

    $scope.LeadGenReportName = function () {
        return $scope.LeadSubTab === 'daily'
            ? 'Lead Generation Daily Report'
            : 'Lead Generation Monthly Report';
    };

    $scope.ClickForLeadGenExcelExport = function () {
        if (!$scope.LeadSubTab) {
            alertify.error("Please select Daily or Monthly report to continue.");
            return false;
        }

        var UserIds = ($scope.LeadGenReportsObj.AllDoctorList || [])
            .filter(function (pitem) { return pitem.isChecked; })
            .map(function (pitem) { return pitem.DoctorID; })
            .join(",");

        var obj = buildReportExportObj(
            $scope.LEAD_GEN_EXPORT_REPORT_ID,
            withPeriod($scope.LeadGenReportName(), $scope.LeadGenReportsObj.DateRangeId),
            $scope.LeadGenReportsObj.PaymentFromDate,
            $scope.LeadGenReportsObj.PaymentToDate,
            {
                "ReportType": $scope.LeadSubTab,
                "ParentOrganizationId": $scope.ParenthospitalId,
                "AllLocationInd": 0,
                "LocationId": reportLocationIds($scope.LeadGenReportsObj),
                // the export file is named after the period, and the sheet is titled with the branch
                "DateRangeId": $scope.LeadGenReportsObj.DateRangeId,
                "LocationName": $scope.LeadGenReportsObj.SelectLocationString,
                "UserIds": UserIds,
                "StartDate": $scope.LeadGenReportsObj.PaymentFromDate,
                "EndDate": $scope.LeadGenReportsObj.PaymentToDate
            }
        );

        eHnoteInsuranceService.InitiateLeadGenerationReportCSVData(obj).then(function (resp) {
            if (resp.data.status == "Success") {
                alertify.success("Excel export started - check the download list for the file.");
            } else {
                alertify.error(resp.data.Message);
            }
        });
    };

    $scope.LeadGenExcelStatus = function () {
        openExportStatusPopup($scope.LEAD_GEN_EXPORT_REPORT_ID, $scope.LeadGenReportName());
    };

    /* ---------- OD Report ---------- */

    $scope.ODReportName = function () {
        return $scope.ODSubTab === 'daily' ? 'OD Daily Report' : 'OD Monthly Report';
    };

    $scope.ClickForODExcelExport = function () {
        if (!$scope.ODSubTab) {
            alertify.error("Please select Daily or Monthly report to continue.");
            return false;
        }

        var UserIds = ($scope.ODReportsObj.AllDoctorList || [])
            .filter(function (pitem) { return pitem.isChecked; })
            .map(function (pitem) { return pitem.DoctorID; })
            .join(",");

        var VisitReasonIds = ($scope.ODReportsObj.VisitReasonList || [])
            .filter(function (pitem) { return pitem.isChecked; })
            .map(function (pitem) { return pitem.ParentAppointmentVisitReasonId; })
            .join(",");

        var obj = buildReportExportObj(
            $scope.OD_EXPORT_REPORT_ID,
            $scope.ODReportName(),
            $scope.ODReportsObj.PaymentFromDate,
            $scope.ODReportsObj.PaymentToDate,
            {
                "ReportType": $scope.ODSubTab,
                "ParentOrganizationId": $scope.ParenthospitalId,
                "AllLocationInd": 0,
                "LocationId": reportLocationIds($scope.ODReportsObj),
                // the export file is named after the period, and the sheet is titled with the branch
                "DateRangeId": $scope.ODReportsObj.DateRangeId,
                "LocationName": $scope.ODReportsObj.SelectLocationString,
                "UserIds": UserIds,
                "VisitReasonIds": VisitReasonIds,
                "StartDate": $scope.ODReportsObj.PaymentFromDate,
                "EndDate": $scope.ODReportsObj.PaymentToDate
            }
        );

        eHnoteInsuranceService.InitiateODReportCSVData(obj).then(function (resp) {
            if (resp.data.status == "Success") {
                alertify.success("Excel export started - check the download list for the file.");
            } else {
                alertify.error(resp.data.Message);
            }
        });
    };

    $scope.ODExcelStatus = function () {
        openExportStatusPopup($scope.OD_EXPORT_REPORT_ID, $scope.ODReportName());
    };

}]);

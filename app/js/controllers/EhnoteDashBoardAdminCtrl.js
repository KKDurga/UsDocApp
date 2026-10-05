
eHnoteWebApp.controller('EhnoteDashBoardAdminCtrl', ['$scope', 'eHnoteMasterDataService', 'eHnoteMainAdminServices', '$filter', 'NgMap', 'alertify', function ($scope, eHnoteMasterDataService, eHnoteMainAdminServices, $filter, NgMap, alertify) {
    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    var parentHospitalId;
    var hospitalCode;
    var hospitalId;
    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID !== undefined) {
        parentHospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        hospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        hospitalCode = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
    }
    function loadData() {
        var params = {
            "HospitalID": parentHospitalId,
            "UserId": doctorinfo.doctordata.User[0].DoctorID,
            "USRType": "ADMIN",
            "SubOrganizationId":doctorinfo.doctordata.UserAddress[0].SubOrganizationId
        };
        eHnoteMainAdminServices.getDashboard(params, onDashboardSuccess, onDashboardError);
        function onDashboardSuccess(data) {
            $scope.dashboardData = data;
        }
        function onDashboardError(data) {
        }
    }

    //function DumyloadData() {
    //    var params = {
    //        "HospitalID": parentHospitalId,
    //        "UserId": doctorinfo.doctordata.User[0].DoctorID,
    //        "USRType": "ADMIN"
    //    };
    //    eHnoteMainAdminServices.getDashboard1(params, onDashboardSuccess, onDashboardError);
    //    function onDashboardSuccess(data) {
    //        $scope.dashboardData = data;
    //    }
    //    function onDashboardError(data) {
    //    }
    //}
    function branchListing(pageSize) {
        pageSize = pageSize || 15;
        var get_branches = {
            "pageNumber": 1,
            "HospitalID": parseInt(parentHospitalId),
            "pageSize": parseInt(pageSize),
            "IncludeDoctors": "N",
            "IncludeBranch": "Y",
            "ActiveHospital": "Y",
            "ActiveDoctor": "Y"
        };
        
        eHnoteMainAdminServices.getHospitalDetails(get_branches, onSuccessBranches, onFailedBranches);
    }
    function onSuccessBranches(data) {
        $scope.branchDetail = data.rows.length;
        $scope.BranchWiseDocorList = data.rows;
        $scope.count = data.count;
        $scope.totalItems = data.count;
        $scope.statsCount = data.Stats;
        var clinicAddress = [];
        angular.forEach($scope.BranchWiseDocorList, function (item, index) {
            if (item.DoctorDetails !== undefined) {
                if (item.HospitalInfo.HospitalDetails.ActiveIND === "Y" && item.DoctorDetails.length > 0) {
                    var item = {
                        "ClinicName": item.HospitalInfo.HospitalDetails.HospitalName,
                        "OrgGSTNO": item.HospitalInfo.HospitalDetails.OrgGSTNO || "",
                        "ClinicId": item.HospitalInfo.HospitalDetails.HospitalID,
                        "Address1": item.HospitalInfo.HospitalAddress.Address1 || "",
                        "Address2": item.HospitalInfo.HospitalAddress.Address2 || "",
                        "Area": item.HospitalInfo.HospitalAddress.Location || "",
                        "Location": item.HospitalInfo.HospitalAddress.Location,
                        "CityTown": item.HospitalInfo.HospitalAddress.CityTown,
                        "State": item.HospitalInfo.HospitalAddress.State,
                        "PinCode": item.HospitalInfo.HospitalAddress.PinCode,
                        "Country": item.HospitalInfo.HospitalAddress.Country,
                        "CountryCode": item.DoctorDetails[0].CountryCode,
                        "mobilenum": item.DoctorDetails[0].MobileNo,
                        "Active": item.HospitalInfo.HospitalDetails.ActiveIND,
                        "Doctors": item.DoctorDetails,
                        "IsRestrictAppointmentSlot": item.HospitalInfo.HospitalDetails.IsRestrictAppointmentSlot,
                        "SMSSenderId": item.HospitalInfo.HospitalDetails.SMSSenderId,
                        "IsSMSInd": item.HospitalInfo.HospitalDetails.IsSMSInd,
                        "FeedBackURL": item.HospitalInfo.HospitalDetails.FeedBackURL,
                        "MaxSMSCount": item.HospitalInfo.HospitalDetails.MaxSMSCount,
                        "SMSPurchased": item.HospitalInfo.HospitalDetails.SMSPurchased,
                        "NavigationURL": item.HospitalInfo.HospitalDetails.NavigationURL,
                        "IsPrintInsturctions": item.HospitalInfo.HospitalDetails.IsPrintInsturctions,
                        "ExtDetails": {
                            "HospitalID": item.HospitalInfo.HospitalDetails.HospitalID,
                            "PrimaryIND": "Y",
                            "AddressCommunication": [],
                            "HospitalInfo": {
                                "HospitalID": item.HospitalInfo.HospitalDetails.HospitalID,
                                "ParentHospitalID": item.HospitalInfo.HospitalDetails.ParentHospitalID,
                                "HospitalCode": "",
                                "BranchCode": "",
                                "Preference": {}
                            }
                        },
                        "MedRegNo": item.DoctorDetails[0].MedRegNo,
                        "IsSurgeryCostRestricted": item.HospitalInfo.HospitalDetails.IsSurgeryCostRestricted
                    };
                    clinicAddress.push(item);
                }
            }
        });
        $scope.clinicDoctorList = [];
        angular.forEach(clinicAddress, function (item, index) {
            item.Doctors = item.Doctors || [];
            $scope.clinicDoctorList = $scope.clinicDoctorList.concat(item.Doctors);
        });
        if ($scope.clinicDoctorList.length > 0) {
            $scope.clinicDoctorList = _.uniq($scope.clinicDoctorList, false, function (p) { return p.DoctorID; });
        }
    }
    function onFailedBranches(data) {
    }
    loadData();
   // DumyloadData();
    branchListing();
    $scope.showscreen = 1;
    $scope.clickShow = function (id) {
        $scope.showscreen = id;
    }
}]);
"use strict";
eHnoteWebApp.controller("USAddUpdateContactLenspopupCtrl", ["$scope", "$rootScope", "$uibModalInstance", "$filter", "alertify", "eHnoteMasterDataService", "eHnoteDbStaticDataService", "cacheStorageItem", "eHnoteMainAppointmentService", "datapersistanceFactory", "eHnoteDiagnosisDataServices", "allUserList", "eHnotePatientDataService", "$uibModal", "checkInvArray", "$q", "eHnoteUserDataService", "LogObj", "eHnoteSurgeryService","$window","$timeout",
    function ($scope, $rootScope, $uibModalInstance, $filter, alertify, eHnoteMasterDataService, eHnoteDbStaticDataService, cacheStorageItem, eHnoteMainAppointmentService, datapersistanceFactory, eHnoteDiagnosisDataServices, allUserList, eHnotePatientDataService, $uibModal, checkInvArray, $q, eHnoteUserDataService, LogObj, eHnoteSurgeryService, $window, $timeout) {

        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
        $scope.ParenthospitalId = 0;
        $scope.HospitalId = 0;
        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
            $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            $scope.SubOrginactionID = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.SubHospitalID;
        };

        var mObj = datapersistanceFactory.getItem("masterDataArrays");
        $scope.cacheStorageItem = angular.copy(cacheStorageItem);
        $scope.AllInvestigationData = angular.copy(mObj.masterFindings);
        $scope.selectedPatientData = eHnoteMasterDataService.getpatientData();
        $scope.subtab = 1;
        $scope.allUserList = allUserList;
        $scope.SphericalRadio = 'SphMinus';
        $scope.CylRadio = 'CylMinus';
        $scope.LogObj = LogObj || "";
        /*$scope.AxisRadio = 'AxisPlus';*/

        $scope.selectAllCLObj = {
            "SelectAllChecked": false
        }

        $scope.cat = checkInvArray[0] || [];
        $scope.cat.CategoryDetails = $filter("filter")($scope.cat.CategoryDetails, function (iterator, ind) { return iterator.SubCategoryId == 68 }) || [];

        $scope.PaitentDetails = {
            "FullName": $scope.selectedPatientData.Patient[0].FullName || "",
            "PatientDisplayId": $scope.selectedPatientData.Patient[0].PatientDisplayId || "",
            "MobileNo": $scope.selectedPatientData.Patient[0].MobileNo || 0,
            "DOB": $scope.selectedPatientData.Patient[0].DOB || "",
            "AgeInYears": $scope.selectedPatientData.Patient[0].AgeInYears || 0,
            "AgeInMonths": $scope.selectedPatientData.Patient[0].AgeInMonths || 0,
            "S3URL": $scope.selectedPatientData.Patient[0].S3URL || '',
            "SocialSecurityNo": $scope.selectedPatientData.Patient[0].SocialSecurityNo || '',
            "BloodGroupName": $scope.selectedPatientData.Patient[0].PatientOtherDetails[0].BloodGroupName || '',
            "MaritalStatusName": $scope.selectedPatientData.Patient[0].PatientOtherDetails[0].MaritalStatus || '',
            "ExternalComanagerName": $scope.selectedPatientData.Patient[0].ExternalComanagerName || '',
            "InternalComanagerName": $scope.selectedPatientData.Patient[0].InternalComanagerName || '',
            "PCPDoctorName": $scope.selectedPatientData.Patient[0].PCPDoctorName || '',
            "RefferalName": $scope.selectedPatientData.Patient[0].ReferralName || '',
            "Gender": $scope.selectedPatientData.Patient[0].Gender == "Male" ? "M" : $scope.selectedPatientData.Patient[0].Gender == "Female" ? "F" : "",
            "ContactInfo": {
                "EmailID": $scope.selectedPatientData.Patient[0].EmailId || '',
            }
        }
        $scope.PostalAddressSummaryObj = {
            "AddressId": $scope.selectedPatientData.PatientAddress.PostalAddress.AddressId || 0,
            "AddressLine1": $scope.selectedPatientData.PatientAddress.PostalAddress.AddressLine1 || "",
            "AddressLine2": $scope.selectedPatientData.PatientAddress.PostalAddress.AddressLine2 || "",
            "ZipCode": $scope.selectedPatientData.PatientAddress.PostalAddress.ZipCode || "",
            "CountyId": $scope.selectedPatientData.PatientAddress.PostalAddress.CountyId || 0,
            "CountyName": $scope.selectedPatientData.PatientAddress.PostalAddress.CountyName || "",
            "CityName": $scope.selectedPatientData.PatientAddress.PostalAddress.CityName || "",
            "CityId": $scope.selectedPatientData.PatientAddress.PostalAddress.CityId || 0,
            "StateName": $scope.selectedPatientData.PatientAddress.PostalAddress.StateName || "",
            "StateId": $scope.selectedPatientData.PatientAddress.PostalAddress.StateId || 0,
            "CountryName": $scope.selectedPatientData.PatientAddress.PostalAddress.CountryName || "",
            "CountryId": $scope.selectedPatientData.PatientAddress.PostalAddress.CountryId || 0,
        }

        $scope.PermanentAddressSummaryObj = {
            "AddressId": $scope.selectedPatientData.PatientAddress.PermanentAddress.AddressId || 0,
            "AddressLine1": $scope.selectedPatientData.PatientAddress.PermanentAddress.AddressLine1 || "",
            "AddressLine2": $scope.selectedPatientData.PatientAddress.PermanentAddress.AddressLine2 || "",
            "ZipCode": $scope.selectedPatientData.PatientAddress.PermanentAddress.ZipCode || "",
            "CountyId": $scope.selectedPatientData.PatientAddress.PermanentAddress.CountyId || 0,
            "CountyName": $scope.selectedPatientData.PatientAddress.PermanentAddress.CountyName || "",
            "CityName": $scope.selectedPatientData.PatientAddress.PermanentAddress.CityName || "",
            "CityId": $scope.selectedPatientData.PatientAddress.PermanentAddress.CityId || 0,
            "StateName": $scope.selectedPatientData.PatientAddress.PermanentAddress.StateName || "",
            "StateId": $scope.selectedPatientData.PatientAddress.PermanentAddress.StateId || 0,
            "CountryName": $scope.selectedPatientData.PatientAddress.PermanentAddress.CountryName || "",
            "CountryId": $scope.selectedPatientData.PatientAddress.PermanentAddress.CountryId || 0,
        }

        $scope.DemographicSummaryObj = {
            "LanguageName": $scope.selectedPatientData.Patient[0].AdditionalInfo.LanguageName || "",
            "Proficiency": $scope.selectedPatientData.Patient[0].AdditionalInfo.Proficiency || "",
            "SexualOrientation": $scope.selectedPatientData.Patient[0].AdditionalInfo.SexualOrientation || "",
            "GenderIdentityStatus": $scope.selectedPatientData.Patient[0].AdditionalInfo.GenderIdentity || "",
        }

        $scope.PatientMNumber = $scope.selectedPatientData.Patient[0].Altareacode + $scope.selectedPatientData.Patient[0].PatientHomeNumber;

        var obj = eHnoteUserDataService.UsMobileFormatChange($scope.PatientMNumber);
        $scope.PatientMobileNumber = obj.UsFormatMobileNumber;

        $scope.PatientOfficeNumber = $scope.selectedPatientData.Patient[0].OfficeAreaCode + $scope.selectedPatientData.Patient[0].PatientOfficeNumber;

        var obj1 = eHnoteUserDataService.UsMobileFormatChange($scope.PatientOfficeNumber);
        $scope.PatientOfficeNumber = obj1.UsFormatMobileNumber;


        if ($scope.cat.CategoryDetails.length>0) {
            angular.forEach($scope.cat.CategoryDetails, function (aditem) {
                if (aditem.SubCategoryDetails.length > 0) {
                    var list = 0;
                    angular.forEach(aditem.SubCategoryDetails, function (item) {
                        if (item.IsSubChildCategoryChecked == false) {
                            list++;
                        }
                    })
                    if (list == 0) {
                        $scope.selectAllCLObj.SelectAllChecked = true;
                    }
                    else {
                        $scope.selectAllCLObj.SelectAllChecked = false;
                    }
                }
            });
        }
       
        function GetSphericalPlusList() {
            return [
                { "Value": "+0.25", "selected": false }, { "Value": "+0.50", "selected": false }, { "Value": "+0.75", "selected": false }, { "Value": "+1.00", "selected": false },
                { "Value": "+1.25", "selected": false }, { "Value": "+1.50", "selected": false }, { "Value": "+1.75", "selected": false }, { "Value": "+2.00", "selected": false },
                { "Value": "+2.25", "selected": false }, { "Value": "+2.50", "selected": false }, { "Value": "+2.75", "selected": false }, { "Value": "+3.00", "selected": false },
                { "Value": "+3.25", "selected": false }, { "Value": "+3.50", "selected": false }, { "Value": "+3.75", "selected": false }, { "Value": "+4.0", "selected": false },
                { "Value": "+4.25", "selected": false }, { "Value": "+4.50", "selected": false }, { "Value": "+4.75", "selected": false }, { "Value": "+5.00", "selected": false },
                { "Value": "+5.25", "selected": false }, { "Value": "+5.50", "selected": false }, { "Value": "+5.75", "selected": false }, { "Value": "+6.00", "selected": false },
                { "Value": "+6.25", "selected": false }, { "Value": "+6.50", "selected": false }, { "Value": "+6.75", "selected": false }, { "Value": "+7.00", "selected": false },
                { "Value": "+7.25", "selected": false }, { "Value": "+7.50", "selected": false }, { "Value": "+7.75", "selected": false }, { "Value": "+8.00", "selected": false },
                { "Value": "+8.25", "selected": false }, { "Value": "+8.50", "selected": false }, { "Value": "+8.75", "selected": false }, { "Value": "+9.00", "selected": false },
                { "Value": "+9.25", "selected": false }, { "Value": "+9.50", "selected": false }, { "Value": "+9.75", "selected": false }, { "Value": "+10.00", "selected": false },
                { "Value": "+10.25", "selected": false }, { "Value": "+10.50", "selected": false }, { "Value": "+10.75", "selected": false }, { "Value": "+11.00", "selected": false },
                { "Value": "+11.25", "selected": false }, { "Value": "+11.50", "selected": false }, { "Value": "+11.75", "selected": false }, { "Value": "+12.00", "selected": false },
                { "Value": "+12.25", "selected": false }, { "Value": "+12.50", "selected": false }, { "Value": "+12.75", "selected": false }, { "Value": "+13.00", "selected": false },
                { "Value": "+13.25", "selected": false }, { "Value": "+13.50", "selected": false }, { "Value": "+13.75", "selected": false }, { "Value": "+14.00", "selected": false },
                { "Value": "+14.25", "selected": false }, { "Value": "+14.50", "selected": false }, { "Value": "+14.75", "selected": false }, { "Value": "+15.00", "selected": false },
                { "Value": "+15.25", "selected": false }, { "Value": "+15.50", "selected": false }, { "Value": "+15.75", "selected": false }, { "Value": "+16.00", "selected": false },
                { "Value": "+16.25", "selected": false }, { "Value": "+16.50", "selected": false }, { "Value": "+16.75", "selected": false }, { "Value": "+17.00", "selected": false },
                { "Value": "+17.25", "selected": false }, { "Value": "+17.50", "selected": false }, { "Value": "+17.75", "selected": false }, { "Value": "+18.00", "selected": false },
                { "Value": "+18.25", "selected": false }, { "Value": "+18.50", "selected": false }, { "Value": "+18.75", "selected": false }, { "Value": "+19.00", "selected": false },
                { "Value": "+19.25", "selected": false }, { "Value": "+19.50", "selected": false }, { "Value": "+19.75", "selected": false }, { "Value": "+20.0", "selected": false }];
        }

        function GetSphericalBothList() {
            return [{ "Value": "+0.25", "selected": false }, { "Value": "+0.50", "selected": false }, { "Value": "+0.75", "selected": false },
            { "Value": "-0.25", "selected": false }, { "Value": "-0.50", "selected": false }, { "Value": "-0.75", "selected": false },
            { "Value": "+1.00", "selected": false }, { "Value": "+1.25", "selected": false }, { "Value": "+1.50", "selected": false }, { "Value": "+1.75", "selected": false },
            { "Value": "-1.00", "selected": false }, { "Value": "-1.25", "selected": false }, { "Value": "-1.50", "selected": false }, { "Value": "-1.75", "selected": false },
            { "Value": "+2.00", "selected": false }, { "Value": "+2.25", "selected": false }, { "Value": "+2.50", "selected": false }, { "Value": "+2.75", "selected": false },
            { "Value": "-2.00", "selected": false }, { "Value": "-2.25", "selected": false }, { "Value": "-2.50", "selected": false }, { "Value": "-2.75", "selected": false },
            { "Value": "+3.00", "selected": false }, { "Value": "+3.25", "selected": false }, { "Value": "+3.50", "selected": false }, { "Value": "+3.75", "selected": false },
            { "Value": "-3.00", "selected": false }, { "Value": "-3.25", "selected": false }, { "Value": "-3.50", "selected": false }, { "Value": "-3.75", "selected": false },
            { "Value": "+4.0", "selected": false }, { "Value": "+4.25", "selected": false }, { "Value": "+4.50", "selected": false }, { "Value": "+4.75", "selected": false },
            { "Value": "-4.00", "selected": false }, { "Value": "-4.25", "selected": false }, { "Value": "-4.50", "selected": false }, { "Value": "-4.75", "selected": false },
            { "Value": "+5.00", "selected": false }, { "Value": "+5.25", "selected": false }, { "Value": "+5.50", "selected": false }, { "Value": "+5.75", "selected": false },
            { "Value": "-5.00", "selected": false }, { "Value": "-5.25", "selected": false }, { "Value": "-5.50", "selected": false }, { "Value": "-5.75", "selected": false },
            { "Value": "+6.00", "selected": false }, { "Value": "+6.25", "selected": false }, { "Value": "+6.50", "selected": false }, { "Value": "+6.75", "selected": false },
            { "Value": "-6.00", "selected": false }, { "Value": "-6.25", "selected": false }, { "Value": "-6.50", "selected": false }, { "Value": "-6.75", "selected": false },
            { "Value": "+7.00", "selected": false }, { "Value": "+7.25", "selected": false }, { "Value": "+7.50", "selected": false }, { "Value": "+7.75", "selected": false },
            { "Value": "-7.00", "selected": false }, { "Value": "-7.25", "selected": false }, { "Value": "-7.50", "selected": false }, { "Value": "-7.75", "selected": false },
            { "Value": "+8.00", "selected": false }, { "Value": "+8.25", "selected": false }, { "Value": "+8.50", "selected": false }, { "Value": "+8.75", "selected": false },
            { "Value": "-8.00", "selected": false }, { "Value": "-8.25", "selected": false }, { "Value": "-8.50", "selected": false }, { "Value": "-8.75", "selected": false },
            { "Value": "+9.00", "selected": false }, { "Value": "+9.25", "selected": false }, { "Value": "+9.50", "selected": false }, { "Value": "+9.75", "selected": false },
            { "Value": "-9.00", "selected": false }, { "Value": "-9.25", "selected": false }, { "Value": "-9.50", "selected": false }, { "Value": "-9.75", "selected": false },
            { "Value": "+10.00", "selected": false }, { "Value": "+10.25", "selected": false }, { "Value": "+10.50", "selected": false }, { "Value": "+10.75", "selected": false },
            { "Value": "-10.00", "selected": false }, { "Value": "-10.25", "selected": false }, { "Value": "-10.50", "selected": false }, { "Value": "-10.75", "selected": false },
            { "Value": "+11.00", "selected": false }, { "Value": "+11.25", "selected": false }, { "Value": "+11.50", "selected": false }, { "Value": "+11.75", "selected": false },
            { "Value": "-11.00", "selected": false }, { "Value": "-11.25", "selected": false }, { "Value": "-11.50", "selected": false }, { "Value": "-11.75", "selected": false },
            { "Value": "+12.00", "selected": false }, { "Value": "+12.25", "selected": false }, { "Value": "+12.50", "selected": false }, { "Value": "+12.75", "selected": false },
            { "Value": "-12.00", "selected": false }, { "Value": "-12.25", "selected": false }, { "Value": "-12.50", "selected": false }, { "Value": "-12.75", "selected": false },
            { "Value": "+13.00", "selected": false }, { "Value": "+13.25", "selected": false }, { "Value": "+13.50", "selected": false }, { "Value": "+13.75", "selected": false },
            { "Value": "-14.00", "selected": false }, { "Value": "-14.25", "selected": false }, { "Value": "-14.50", "selected": false }, { "Value": "-14.75", "selected": false },
            { "Value": "+15.00", "selected": false }, { "Value": "+15.25", "selected": false }, { "Value": "+15.50", "selected": false }, { "Value": "+15.75", "selected": false },
            { "Value": "-15.00", "selected": false }, { "Value": "-15.25", "selected": false }, { "Value": "-15.50", "selected": false }, { "Value": "-15.75", "selected": false },
            { "Value": "+16.00", "selected": false }, { "Value": "+16.25", "selected": false }, { "Value": "+16.50", "selected": false }, { "Value": "+16.75", "selected": false },
            { "Value": "-16.00", "selected": false }, { "Value": "-16.25", "selected": false }, { "Value": "-16.50", "selected": false }, { "Value": "-16.75", "selected": false },
            { "Value": "+17.00", "selected": false }, { "Value": "+17.25", "selected": false }, { "Value": "+17.50", "selected": false }, { "Value": "+17.75", "selected": false },
            { "Value": "-17.00", "selected": false }, { "Value": "-17.25", "selected": false }, { "Value": "-17.50", "selected": false }, { "Value": "-17.75", "selected": false },
            { "Value": "+18.00", "selected": false }, { "Value": "+18.25", "selected": false }, { "Value": "+18.50", "selected": false }, { "Value": "+18.75", "selected": false },
            { "Value": "-18.00", "selected": false }, { "Value": "-18.25", "selected": false }, { "Value": "-18.50", "selected": false }, { "Value": "-18.75", "selected": false },
            { "Value": "+19.00", "selected": false }, { "Value": "+19.25", "selected": false }, { "Value": "+19.50", "selected": false }, { "Value": "+19.75", "selected": false },
            { "Value": "-19.00", "selected": false }, { "Value": "-19.25", "selected": false }, { "Value": "-19.50", "selected": false }, { "Value": "-19.75", "selected": false },
            { "Value": "-20.00", "selected": false }, { "Value": "+20.00", "selected": false }, { "Value": "Plano", "selected": false },
            ];
        };

        function GetSphericalMinusList() {
            return [
                { "Value": "-0.25", "selected": false }, { "Value": "-0.50", "selected": false }, { "Value": "-0.75", "selected": false }, { "Value": "-1.00", "selected": false },
                { "Value": "-1.25", "selected": false }, { "Value": "-1.50", "selected": false }, { "Value": "-1.75", "selected": false }, { "Value": "-2.00", "selected": false },
                { "Value": "-2.25", "selected": false }, { "Value": "-2.50", "selected": false }, { "Value": "-2.75", "selected": false }, { "Value": "-3.00", "selected": false },
                { "Value": "-3.25", "selected": false }, { "Value": "-3.50", "selected": false }, { "Value": "-3.75", "selected": false }, { "Value": "-4.00", "selected": false },
                { "Value": "-4.25", "selected": false }, { "Value": "-4.50", "selected": false }, { "Value": "-4.75", "selected": false }, { "Value": "-5.00", "selected": false },
                { "Value": "-5.25", "selected": false }, { "Value": "-5.50", "selected": false }, { "Value": "-5.75", "selected": false }, { "Value": "-6.0", "selected": false },
                { "Value": "-6.25", "selected": false }, { "Value": "-6.50", "selected": false }, { "Value": "-6.75", "selected": false }, { "Value": "-7.00", "selected": false },
                { "Value": "-7.25", "selected": false }, { "Value": "-7.50", "selected": false }, { "Value": "-7.75", "selected": false }, { "Value": "-8.00", "selected": false },
                { "Value": "-8.25", "selected": false }, { "Value": "-8.50", "selected": false }, { "Value": "-8.75", "selected": false }, { "Value": "-9.00", "selected": false },
                { "Value": "-9.25", "selected": false }, { "Value": "-9.50", "selected": false }, { "Value": "-9.75", "selected": false }, { "Value": "-10.00", "selected": false },
                { "Value": "-10.25", "selected": false }, { "Value": "-10.50", "selected": false }, { "Value": "-10.75", "selected": false }, { "Value": "-11.00", "selected": false },
                { "Value": "-11.25", "selected": false }, { "Value": "-11.50", "selected": false }, { "Value": "-11.75", "selected": false }, { "Value": "-12.00", "selected": false },
                { "Value": "-12.25", "selected": false }, { "Value": "-12.50", "selected": false }, { "Value": "-12.75", "selected": false }, { "Value": "-13.00", "selected": false },
                { "Value": "-13.25", "selected": false }, { "Value": "-13.50", "selected": false }, { "Value": "-13.75", "selected": false }, { "Value": "-14.00", "selected": false },
                { "Value": "-14.25", "selected": false }, { "Value": "-14.50", "selected": false }, { "Value": "-14.75", "selected": false }, { "Value": "-15.00", "selected": false },
                { "Value": "-15.25", "selected": false }, { "Value": "-15.50", "selected": false }, { "Value": "-15.75", "selected": false }, { "Value": "-16.00", "selected": false },
                { "Value": "-16.25", "selected": false }, { "Value": "-16.50", "selected": false }, { "Value": "-16.75", "selected": false }, { "Value": "-17.00", "selected": false },
                { "Value": "-17.25", "selected": false }, { "Value": "-17.50", "selected": false }, { "Value": "-17.75", "selected": false }, { "Value": "-18.00", "selected": false },
                { "Value": "-18.25", "selected": false }, { "Value": "-18.50", "selected": false }, { "Value": "-18.75", "selected": false }, { "Value": "-19.00", "selected": false },
                { "Value": "-19.25", "selected": false }, { "Value": "-19.50", "selected": false }, { "Value": "-19.75", "selected": false }, { "Value": "-20.00", "selected": false }];
        };
        function GetCylPlusList() {
            return [
                { "Value": "+0.25", "selected": false }, { "Value": "+0.50", "selected": false }, { "Value": "+0.75", "selected": false }, { "Value": "+1.00", "selected": false },
                { "Value": "+1.25", "selected": false }, { "Value": "+1.50", "selected": false }, { "Value": "+1.75", "selected": false }, { "Value": "+2.00", "selected": false },
                { "Value": "+2.25", "selected": false }, { "Value": "+2.50", "selected": false }, { "Value": "+2.75", "selected": false }, { "Value": "+3.00", "selected": false },
                { "Value": "+3.25", "selected": false }, { "Value": "+3.50", "selected": false }, { "Value": "+3.75", "selected": false }, { "Value": "+4.00", "selected": false },
                { "Value": "+4.25", "selected": false }, { "Value": "+4.50", "selected": false }, { "Value": "+4.75", "selected": false }, { "Value": "+5.00", "selected": false },
                { "Value": "+5.25", "selected": false }, { "Value": "+5.50", "selected": false }, { "Value": "+5.75", "selected": false }, { "Value": "+6.00", "selected": false }];
        };
        //function GetCylMinusList() {
        //    return [
        //        { "Value": "-0.25", "selected": false }, { "Value": "-0.50", "selected": false }, { "Value": "-0.75", "selected": false }, { "Value": "-1.00", "selected": false },
        //        { "Value": "-1.25", "selected": false }, { "Value": "-1.50", "selected": false }, { "Value": "-1.75", "selected": false }, { "Value": "-2.00", "selected": false },
        //        { "Value": "-2.25", "selected": false }, { "Value": "-2.50", "selected": false }, { "Value": "-2.75", "selected": false }, { "Value": "-3.00", "selected": false },
        //        { "Value": "-3.25", "selected": false }, { "Value": "-3.50", "selected": false }, { "Value": "-3.75", "selected": false }, { "Value": "-4.00", "selected": false },
        //        { "Value": "-4.25", "selected": false }, { "Value": "-4.50", "selected": false }, { "Value": "-4.75", "selected": false }, { "Value": "-5.00", "selected": false },
        //        { "Value": "-5.25", "selected": false }, { "Value": "-5.50", "selected": false }, { "Value": "-5.75", "selected": false }, { "Value": "-6.00", "selected": false }
        //    ]
        //};
        function GetCylMinusList() {
            return [
                { "Value": "-0.75", "selected": false },
                { "Value": "-1.25", "selected": false },
                { "Value": "-1.75", "selected": false },
                { "Value": "-2.25", "selected": false },
                { "Value": "-2.75", "selected": false },
                { "Value": "-3.25", "selected": false },
                { "Value": "-3.75", "selected": false },
                { "Value": "-4.25", "selected": false }
            ];
        }

        function GetCylBothList() {
            return [
                { "Value": "Sphere", "selected": false }, { "Value": "-0.25", "selected": false }, { "Value": "-0.50", "selected": false }, { "Value": "-0.75", "selected": false }, { "Value": "-1.00", "selected": false },
                { "Value": "-1.25", "selected": false }, { "Value": "-1.50", "selected": false }, { "Value": "-1.75", "selected": false }, { "Value": "-2.00", "selected": false },
                { "Value": "-2.25", "selected": false }, { "Value": "-2.50", "selected": false }, { "Value": "-2.75", "selected": false }, { "Value": "-3.00", "selected": false },
                { "Value": "-3.25", "selected": false }, { "Value": "-3.50", "selected": false }, { "Value": "-3.75", "selected": false }, { "Value": "-4.00", "selected": false },
                { "Value": "-4.25", "selected": false }, { "Value": "-4.50", "selected": false }, { "Value": "-4.75", "selected": false }, { "Value": "-5.00", "selected": false },
                { "Value": "-5.25", "selected": false }, { "Value": "-5.50", "selected": false }, { "Value": "-5.75", "selected": false }, { "Value": "-6.00", "selected": false }]
        };


        function GetAxisPlusList() {
            var r = 0;
            var array = [];
            while (r <= 180) {
                var obj = {
                    "Id": r, "Value": r.toString(), "selected": false
                };
                array.push(obj);
                r++;
            }
            return array;
        }


        function GetAxisMinusList() {
            return [
                { "Value": "-0", "selected": false }, { "Value": "-5", "selected": false }, { "Value": "-10", "selected": false }, { "Value": "-15", "selected": false },
                { "Value": "-20", "selected": false }, { "Value": "-25", "selected": false }, { "Value": "-30", "selected": false }, { "Value": "-35", "selected": false },
                { "Value": "-40", "selected": false }, { "Value": "-45", "selected": false }, { "Value": "-50", "selected": false }, { "Value": "-55", "selected": false },
                { "Value": "-60", "selected": false }, { "Value": "-65", "selected": false }, { "Value": "-70", "selected": false }, { "Value": "-75", "selected": false },
                { "Value": "-80", "selected": false }, { "Value": "-85", "selected": false }, { "Value": "-90", "selected": false }, { "Value": "-95", "selected": false },
                { "Value": "-100", "selected": false }, { "Value": "-105", "selected": false }, { "Value": "-110", "selected": false }, { "Value": "-115", "selected": false },
                { "Value": "-120", "selected": false }, { "Value": "-125", "selected": false }, { "Value": "-130", "selected": false }, { "Value": "-135", "selected": false }, { "Value": "-140", "selected": false },
                { "Value": "-145", "selected": false }, { "Value": "-150", "selected": false }, { "Value": "-155", "selected": false }, { "Value": "-160", "selected": false },
                { "Value": "-165", "selected": false }, { "Value": "-170", "selected": false }, { "Value": "-175", "selected": false }, { "Value": "-180", "selected": false }]
        };


        function GetBCList() {
            return [
                { "Value": 8.3, "selected": false }, { "Value": 8.4, "selected": false }, { "Value": 8.5, "selected": false }, { "Value": 8.6, "selected": false }, { "Value": 8.7, "selected": false }, { "Value": 8.8, "selected": false }, { "Value": 8.9, "selected": false },
                { "Value": 9.0, "selected": false }, { "Value": 9.1, "selected": false }, { "Value": 9.2, "selected": false }, { "Value": 9.3, "selected": false },
                { "Value": 9.4, "selected": false }, { "Value": 9.5, "selected": false }, { "Value": 9.6, "selected": false }, { "Value": 9.7, "selected": false },
                { "Value": 9.8, "selected": false }, { "Value": 9.9, "selected": false }, { "Value": 10.0, "selected": false },
            ]
        };
        function GetDiaList() {
            return [
                { "Value": 13.0, "selected": false }, { "Value": 13.5, "selected": false }, { "Value": 14.0, "selected": false }, { "Value": 14.5, "selected": false }, { "Value": 14.1, "selected": false }, { "Value": 14.2, "selected": false }, { "Value": 14.3, "selected": false }, { "Value": 14.4, "selected": false },
                { "Value": 15.0, "selected": false }, { "Value": 15.5, "selected": false }, { "Value": 16.0, "selected": false }, { "Value": 13.8, "selected": false },
            ]
        };
        function GetKeratometryList() {
            return [{ "Id": 1, "Value": "30.00", "selected": false }, { "Id": 2, "Value": "30.25", "selected": false }, { "Id": 3, "Value": "30.50", "selected": false }, { "Id": 4, "Value": "30.75", "selected": false },
            { "Id": 5, "Value": "31.00", "selected": false }, { "Id": 6, "Value": "31.25", "selected": false }, { "Id": 7, "Value": "31.50", "selected": false }, { "Id": 8, "Value": "31.75", "selected": false },
            { "Id": 9, "Value": "32.00", "selected": false }, { "Id": 10, "Value": "32.25", "selected": false }, { "Id": 11, "Value": "32.50", "selected": false }, { "Id": 12, "Value": "32.75", "selected": false },
            { "Id": 13, "Value": "33.00", "selected": false }, { "Id": 14, "Value": "33.25", "selected": false }, { "Id": 15, "Value": "33.50", "selected": false }, { "Id": 16, "Value": "33.75", "selected": false },
            { "Id": 17, "Value": "34.00", "selected": false }, { "Id": 18, "Value": "34.25", "selected": false }, { "Id": 19, "Value": "34.50", "selected": false }, { "Id": 20, "Value": "34.75", "selected": false },
            { "Id": 21, "Value": "35.00", "selected": false }, { "Id": 22, "Value": "35.25", "selected": false }, { "Id": 23, "Value": "35.50", "selected": false }, { "Id": 24, "Value": "35.75", "selected": false },
            { "Id": 25, "Value": "36.00", "selected": false }, { "Id": 26, "Value": "36.25", "selected": false }, { "Id": 27, "Value": "36.50", "selected": false }, { "Id": 28, "Value": "36.75", "selected": false },
            { "Id": 29, "Value": "37.00", "selected": false }, { "Id": 30, "Value": "37.25", "selected": false }, { "Id": 31, "Value": "37.50", "selected": false }, { "Id": 32, "Value": "37.75", "selected": false },
            { "Id": 33, "Value": "38.00", "selected": false }, { "Id": 34, "Value": "38.25", "selected": false }, { "Id": 35, "Value": "38.50", "selected": false }, { "Id": 36, "Value": "38.75", "selected": false },
            { "Id": 37, "Value": "39.00", "selected": false }, { "Id": 38, "Value": "39.25", "selected": false }, { "Id": 39, "Value": "39.50", "selected": false }, { "Id": 40, "Value": "39.75", "selected": false },
            { "Id": 41, "Value": "40.00", "selected": false }, { "Id": 42, "Value": "40.25", "selected": false }, { "Id": 43, "Value": "40.50", "selected": false }, { "Id": 44, "Value": "40.75", "selected": false },
            { "Id": 45, "Value": "41.00", "selected": false }, { "Id": 46, "Value": "41.25", "selected": false }, { "Id": 47, "Value": "41.50", "selected": false }, { "Id": 48, "Value": "41.75", "selected": false },
            { "Id": 49, "Value": "42.00", "selected": false }, { "Id": 50, "Value": "42.25", "selected": false }, { "Id": 51, "Value": "42.50", "selected": false }, { "Id": 52, "Value": "42.75", "selected": false },
            { "Id": 53, "Value": "43.00", "selected": false }, { "Id": 54, "Value": "43.25", "selected": false }, { "Id": 55, "Value": "43.50", "selected": false }, { "Id": 56, "Value": "43.75", "selected": false },
            { "Id": 57, "Value": "44.00", "selected": false }, { "Id": 58, "Value": "44.25", "selected": false }, { "Id": 59, "Value": "44.50", "selected": false }, { "Id": 60, "Value": "44.75", "selected": false },
            { "Id": 61, "Value": "45.00", "selected": false }, { "Id": 62, "Value": "45.25", "selected": false }, { "Id": 63, "Value": "45.50", "selected": false }, { "Id": 64, "Value": "45.75", "selected": false },
            { "Id": 65, "Value": "46.00", "selected": false }, { "Id": 66, "Value": "46.25", "selected": false }, { "Id": 67, "Value": "46.50", "selected": false }, { "Id": 68, "Value": "46.75", "selected": false },
            { "Id": 69, "Value": "47.00", "selected": false }, { "Id": 70, "Value": "47.25", "selected": false }, { "Id": 71, "Value": "47.50", "selected": false }, { "Id": 72, "Value": "47.75", "selected": false },
            { "Id": 73, "Value": "48.00", "selected": false }, { "Id": 74, "Value": "48.25", "selected": false }, { "Id": 75, "Value": "48.50", "selected": false }, { "Id": 76, "Value": "48.75", "selected": false },
            { "Id": 77, "Value": "49.00", "selected": false }, { "Id": 78, "Value": "49.25", "selected": false }, { "Id": 79, "Value": "49.50", "selected": false }, { "Id": 80, "Value": "49.75", "selected": false },
            { "Id": 81, "Value": "50.00", "selected": false }, { "Id": 82, "Value": "50.25", "selected": false }, { "Id": 83, "Value": "50.50", "selected": false }, { "Id": 84, "Value": "50.75", "selected": false },
            { "Id": 85, "Value": "51.00", "selected": false }, { "Id": 86, "Value": "51.25", "selected": false }, { "Id": 87, "Value": "51.50", "selected": false }, { "Id": 88, "Value": "51.75", "selected": false },
            { "Id": 89, "Value": "52.00", "selected": false }, { "Id": 90, "Value": "52.25", "selected": false }, { "Id": 91, "Value": "52.50", "selected": false }, { "Id": 92, "Value": "52.75", "selected": false },
            { "Id": 93, "Value": "53.00", "selected": false }, { "Id": 94, "Value": "53.25", "selected": false }, { "Id": 95, "Value": "53.50", "selected": false }, { "Id": 96, "Value": "53.75", "selected": false },
            { "Id": 97, "Value": "54.00", "selected": false }, { "Id": 98, "Value": "54.25", "selected": false }, { "Id": 99, "Value": "54.50", "selected": false }, { "Id": 100, "Value": "54.75", "selected": false },
            { "Id": 101, "Value": "55.00", "selected": false }, { "Id": 102, "Value": "55.25", "selected": false }, { "Id": 103, "Value": "55.50", "selected": false }, { "Id": 104, "Value": "55.75", "selected": false },
            { "Id": 105, "Value": "56.00", "selected": false }, { "Id": 106, "Value": "56.25", "selected": false }, { "Id": 107, "Value": "56.50", "selected": false }, { "Id": 108, "Value": "56.75", "selected": false },
            { "Id": 109, "Value": "57.00", "selected": false }, { "Id": 110, "Value": "57.25", "selected": false }, { "Id": 111, "Value": "57.50", "selected": false }, { "Id": 112, "Value": "57.75", "selected": false },
            { "Id": 113, "Value": "58.00", "selected": false }, { "Id": 114, "Value": "58.25", "selected": false }, { "Id": 115, "Value": "58.50", "selected": false }, { "Id": 116, "Value": "58.75", "selected": false },
            { "Id": 117, "Value": "59.00", "selected": false }, { "Id": 118, "Value": "59.25", "selected": false }, { "Id": 119, "Value": "59.50", "selected": false }, { "Id": 120, "Value": "59.75", "selected": false },
            { "Id": 121, "Value": "60.00", "selected": false }]
        };
        function GetDistanceList() {
            return [{ "Value": "20/16", "selected": false }, { "Value": "20/20", "selected": false }, { "Value": "20/25", "selected": false }, { "Value": "20/30", "selected": false },
            { "Value": "20/35", "selected": false }, { "Value": "20/40", "selected": false }, { "Value": "20/60", "selected": false },
            { "Value": "20/100", "selected": false }, { "Value": "20/200", "selected": false }, { "Value": "20/320", "selected": false },
            { "Value": "20/400", "selected": false }, { "Value": "20/500", "selected": false }, { "Value": "20/600", "selected": false }, { "Value": "20/800", "selected": false },
            { "Value": "HM", "selected": false }, { "Value": "HM+", "selected": false }, { "Value": "PL", "selected": false }, { "Value": "NPL", "selected": false },
            { "Value": "CF CF", "selected": false }, { "Value": "CF 1/2", "selected": false }, { "Value": "CF 1", "selected": false }, { "Value": "CF 3", "selected": false },
            { "Value": "CF 3m", "selected": false }, { "Value": "CF 2m", "selected": false }, { "Value": "CF 1m", "selected": false }, { "Value": "CSM", "selected": false },
            { "Value": "FFL", "selected": false }, { "Value": "Defer", "selected": false }, { "Value": "PL+PR Accurate", "selected": false },
            { "Value": "PL + PR Inaccurate", "selected": false }, { "Value": "NI", "selected": false }, { "Value": "Prosthetic", "selected": false },

            ];
        };

        function GetMovementList() {
            return [
                { "Value": "0", "selected": false }, { "Value": "0.25mm", "selected": false },
                { "Value": "0.50mm", "selected": false }, { "Value": "0.75mm", "selected": false },
                { "Value": "1.0mm", "selected": false }, { "Value": ">1.0mm", "selected": false }
            ]
        };
        function GetDegreesList() {
            return [
                { "Value": "0", "selected": false }, { "Value": "5", "selected": false },
                { "Value": "10", "selected": false }, { "Value": "15", "selected": false },
                { "Value": "20", "selected": false }, { "Value": "25", "selected": false },
                { "Value": "30", "selected": false }, { "Value": "35", "selected": false },
            ]
        };

        function GetCLDesignTypeList() {
            return [
                { "Value": "Spherical", "selected": false }, { "Value": "Toric", "selected": false },
                { "Value": "Toric MF", "selected": false }, { "Value": "Multifocal", "selected": false }, { "Value": "Legacy", "selected": false }
            ]
        };

        function GetColorList() {
            return [
                { "Value": "Amber", "selected": false }, { "Value": "Amethyst", "selected": false },
                { "Value": "Aqua", "selected": false }, { "Value": "Aquamarine", "selected": false }, { "Value": "Aqua Seas", "selected": false },
                { "Value": "Auburn", "selected": false }, { "Value": "Autumn", "selected": false }
            ]
        };

        function GetProductList() {
            return [
                { "Value": "Cooper Vision", "selected": false }, { "Value": "J & J", "selected": false }, { "Value": "Acuvue", "selected": false },
                { "Value": "Biotrue", "selected": false }, { "Value": "Bausch & Lomb", "selected": false }, { "Value": "Acuvue Oasis", "selected": false }
            ]
        };
        function GetDirectionList() {
            return [
                { "Value": "Clockwise", "selected": false }, { "Value": "Counter Clockwise", "selected": false }
            ]
        };
        function GetCoverageList() {
            return [
                { "Value": "Full", "selected": false }, { "Value": "Partial", "selected": false }
            ]
        };
        function GetCentrationList() {
            return [
                { "Value": "Centre", "selected": false }, { "Value": "Nasal", "selected": false }, { "Value": "Temporal", "selected": false }, { "Value": "Inferior", "selected": false },
                { "Value": "Superior", "selected": false }, { "Value": "Full", "selected": false }, { "Value": "Flat", "selected": false }, { "Value": "Steep", "selected": false },
            ]
        };
        function GetComfortList() {
            return [
                { "Value": "Good", "selected": false }, { "Value": "Poor", "selected": false }
            ]
        };

        function GetAddtionList() {
            return [{ "Value": "+0.25", "selected": false }, { "Value": "+0.50", "selected": false }, { "Value": "+0.75", "selected": false }, { "Value": "+1.00", "selected": false },
            { "Value": "+1.25", "selected": false }, { "Value": "+1.50", "selected": false }, { "Value": "+1.75", "selected": false }, { "Value": "+2.00", "selected": false },
            { "Value": "+2.25", "selected": false }, { "Value": "+2.50", "selected": false }, { "Value": "+2.75", "selected": false }, { "Value": "+3.00", "selected": false },
            { "Value": "+3.25", "selected": false }, { "Value": "+3.50", "selected": false }, { "Value": "+3.75", "selected": false }, { "Value": "+4.0", "selected": false }];
        };

        $scope.obj = {
            "ContactLensDetails": []
        }

        $scope.AddAuditLogNew = function (selectedItem) {
            $scope.LogObj.LogArray = [];
            let SubModuleName = selectedItem.SubModuleName || "";
            let SubModuleId = selectedItem.SubModuleId || 0;
            let ScreenType = selectedItem.ScreenType || "";
            let ActionType = selectedItem.ActionType || "Accessed";
            let ActionDescription = selectedItem.ActionDescription || "";
            let OldActionDescription = selectedItem.OldActionDescription || "";
            let NewActionDescription = selectedItem.NewActionDescription || "";
            let obj = {
                "LogId": 0,
                "ModuleId": 1,
                "ModuleName": "OUTPatient",
                "SubModuleId": SubModuleId,
                "SubModuleName": SubModuleName,
                "ScreenType": ScreenType,
                "ActionType": ActionType,
                // "ActionDescription": ActionDescription,
                "OldActionDescription": OldActionDescription,
                "NewActionDescription": NewActionDescription,
                "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
            };
            $scope.LogObj.LogArray.push(obj);
            eHnoteSurgeryService.AddAuditLog($scope.LogObj).then(function (resp) {
                if (resp.data.status == "Success") {
                    console.log("Added");
                }
            });
        }


        function formVisionDetailsVisualActivityData() {
            $scope.tempContactLens = [];
            $scope.obj.ContactLensDetails = [];

            $scope.ContactLensInvestigations = $filter("filter")($scope.AllInvestigationData, { "CategoryId": 295 }, true);
            angular.forEach($scope.ContactLensInvestigations, function (item, index) {
                if (item.InvestigationId === 2084 || item.InvestigationId === 2078) {

                    var object = {
                        "ContactLensId" : 0,
                        "ConsultationID" : 0,
                        "InvestigationId": item.InvestigationId,
                        "CategoryId": item.CategoryId,
                        "CategoryName": "Contact Lens",
                        "Investigation": item.Investigation,
                        "InvestigationDesc": item.Investigation,
                        "DeleteInd": "N",
                        "IsInvData": false,
                        "InvestigationDetails": []

                    };

                    $scope.tempContactLens.push(object);
                }

            });
            $scope.obj.ContactLensDetails = angular.copy($scope.tempContactLens);
        };

        $scope.closeuib = function () {
            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to close this? Any unsaved data will be lost?", function () {
                $uibModalInstance.dismiss("cancel");
                $scope.$digest();
            }, function () {
                r = "You pressed Cancel!";
            });
        };

        $scope.GetRGPContactobj = function () {
            return {
                "TypeName": "",
                "TypeId": null,
                "SubInvestigationName": "",
                "SubInvestigationId": null,
                "SubTypeName": "Basic",
                "SelectedEye": "OD",
                "AdvancedSubType": "Fit",
                "IsEdit": false,
                "ContactLensDetailId":0,
                "DeleteInd": "N",
                "BasicODDesignType": "",
                "BasicODSeries": "",
                "BasicODAdd": "",
                "BasicODSph": "",
                "BasicODCyl": "",
                "BasicODAxis": "",
                "BasicODBC": "",
                "BasicODDia": "",
                "BasicODKeratometry": "",
                "BasicODColor": "",
                "BasicODProduct": "",
                "BasicODVaDistance": "",
                "BasicODVaNear": "",
                "BasicODVaIntermediate": "",
                "BasicOSSeries": "",
                "BasicOSAdd": "", 
                "BasicOSDesignType": "",
                "BasicOSSph": "",
                "BasicOSCyl": "",
                "BasicOSAxis": "",
                "BasicOSBC": "",
                "BasicOSDia": "",
                "BasicOSKeratometry": "",
                "BasicOSColor": "",
                "BasicOSProduct": "",
                "BasicOSVaDistance": "",
                "BasicOSVaNear": "",
                "BasicOSVaIntermediate": "",
                "BasicOUVaDistance": "",
                "BasicOUVaNear": "",
                "BasicOUVaIntermediate": "",
                "BasicInstructions": "",
                "BasicRemarks": "",
                "ReplacementSchedule": "",
                "RxExpiration": "",
                "AdvancedFitODComfort": "",
                "AdvancedFitODCentration": "",
                "AdvancedFitODCoverage": "",
                "AdvancedFitODMovement": "",
                "AdvancedFitODDegrees": "",
                "AdvancedFitODDirection": "",
                "AdvancedFitOSComfort": "",
                "AdvancedFitOSCentration": "",
                "AdvancedFitOSCoverage": "",
                "AdvancedFitOSMovement": "",
                "AdvancedFitOSDegrees": "",
                "AdvancedFitOSDirection": "",
                "AdvancedRefractionODSph": "",
                "AdvancedRefractionODCyl": "",
                "AdvancedRefractionODAxis": "",
                "AdvancedRefractionODVaDistance": "",
                "AdvancedRefractionODVaNear": "",
                "AdvancedRefractionODVaIntermediate": "",
                "AdvancedRefractionOSSph": "",
                "AdvancedRefractionOSCyl": "",
                "AdvancedRefractionOSAxis": "",
                "AdvancedRefractionOSVaDistance": "",
                "AdvancedRefractionOSVaNear": "",
                "AdvancedRefractionOSVaIntermediate": "",
                "AdvancedRefractionOUVaDistance": "",
                "AdvancedRefractionOUVaNear": "",
                "AdvancedRefractionOUVaIntermediate": "",
                "ODSpecialInstructions": "",
                "OSSpecialInstructions": "",
                "AdvancedRefractionRemarks": "",
                "showstatus": false,
                "IsBasicRemarksInd": false,
                "IsBasicInstructionsInd": false,
                "IsAdvanceRemarksInd": false,
                "Sno": null,
                "SphericalSwitch": 2,
                "CylindricalSwitch": 2,
            };
        };

        $scope.GetContactobj = function () {
            return {
                "TypeName": "",
                "TypeId": null,
                "SubInvestigationName": "",
                "SubInvestigationId": null,
                "SubTypeName": "Basic",
                "SelectedEye": "OD",
                "AdvancedSubType": "Fit",
                "IsEdit": false,
                "ContactLensDetailId" : 0,
                "DeleteInd": "N",
                "BasicODDesignType": "",
                "BasicODSph": "",
                "BasicODCyl": "",
                "BasicODAxis": "",
                "BasicODAdd": "",
                "BasicODBC": "",
                "BasicODDia": "",
                "BasicODKeratometry": "",
                "BasicODColor": "",
                "BasicODProduct": "",
                "BasicOSSeries": "",
                "BasicODSeries": "",
                "BasicODVaDistance": "",
                "BasicODVaNear": "",
                "BasicODVaIntermediate": "",
                "BasicOSDesignType": "",
                "BasicOSSph": "",
                "BasicOSCyl": "",
                "BasicOSAxis": "",
                "BasicOSAdd": "",
                "BasicOSBC": "",
                "BasicOSDia": "",
                "BasicOSKeratometry": "",
                "BasicOSColor": "",
                "BasicOSProduct": "",
                "BasicOSVaDistance": "",
                "BasicOSVaNear": "",
                "BasicOSVaIntermediate": "",
                "BasicOUVaDistance": "",
                "BasicOUVaNear": "",
                "BasicOUVaIntermediate": "",
                "BasicInstructions": "",
                "BasicRemarks": "",
                "ReplacementSchedule": "",
                "RxExpiration": "",
                "AdvancedFitODComfort": "",
                "AdvancedFitODCentration": "",
                "AdvancedFitODCoverage": "",
                "AdvancedFitODMovement": "",
                "AdvancedFitODDegrees": "",
                "AdvancedFitODDirection": "",
                "AdvancedFitOSComfort": "",
                "AdvancedFitOSCentration": "",
                "AdvancedFitOSCoverage": "",
                "AdvancedFitOSMovement": "",
                "AdvancedFitOSDegrees": "",
                "AdvancedFitOSDirection": "",
                "AdvancedRefractionODSph": "",
                "AdvancedRefractionODCyl": "",
                "AdvancedRefractionODAxis": "",
                "AdvancedRefractionODAdd": "",
                "AdvancedRefractionODVaDistance": "",
                "AdvancedRefractionODVaNear": "",
                "AdvancedRefractionODVaIntermediate": "",
                "AdvancedRefractionOSSph": "",
                "AdvancedRefractionOSCyl": "",
                "AdvancedRefractionOSAxis": "",
                "AdvancedRefractionOSAdd": "",
                "AdvancedRefractionOSVaDistance": "",
                "AdvancedRefractionOSVaNear": "",
                "AdvancedRefractionOSVaIntermediate": "",
                "AdvancedRefractionOUVaDistance": "",
                "AdvancedRefractionOUVaNear": "",
                "AdvancedRefractionOUVaIntermediate": "",
                "ODSpecialInstructions": "",
                "OSSpecialInstructions": "",
                "AdvancedRefractionRemarks": "",
                "showstatus": false,
                "IsBasicRemarksInd": false,
                "IsBasicInstructionsInd": false,
                "IsAdvanceRemarksInd": false,
                "Sno": null,
                "SphericalSwitch": 2,
                "CylindricalSwitch": 2,
            };
        };

        $scope.GetCLFocusObj = function () {
            return {
                "ODCyl": false,
                "ODAxis": false,
                "ODBC": false,
                "ODDia": false,
                "ODKerato": false,
                "ODColor": false,
                "ODProduct": false,
                "ODVAN": false,
                "ODVAI": false,
                "ODCentration": false,
                "ODCoverage": false,
                "ODMovement": false,
                "ODDegrees": false,
                "ODDirection": false,
                "OSDesign": false,
                "OSSph": false,
                "OSCyl": false,
                "OSAxis": false,
                "OSBC": false,
                "OSDia": false,
                "OSKerato": false,
                "OSColor": false,
                "OSProduct": false,
                "OSVAD": false,
                "OSVAN": false,
                "OSVAI": false,
                "OUVAD": false,
                "OUVAN": false,
                "OUVAI": false,
                "OSComfort": false,
                "OSCentration": false,
                "OSCoverage": false,
                "OSMovement": false,
                "OSDegrees": false,
                "OSDirection": false,
                "AODComfort": false,
                "AODCent": false,
                "AODCover": false,
                "AODMove": false,
                "AODDegree": false,
                "AODSph": false,
                "AODCyl": false,
                "AODAxis": false,
                "AODVAD": false,
                "AODVAN": false,
                "AODVAI": false,
                "AOSComfort": false,
                "AOSCent": false,
                "AOSCover": false,
                "AOSMove": false,
                "AOSDegree": false,
                "AOSSph": false,
                "AOSCyl": false,
                "AOSAxis": false,
                "AOSVAD": false,
                "AOSVAN": false,
                "AOSVAI": false,
                "AOUVAD": false,
                "AOUVAN": false,
                "AOUVAI": false,
                "ODSeries": false,
                "OSSeries": false,
                "ODAdd": false,
                "OSAdd": false,
                "AODAdd": false,
                "AOSAdd": false,
            };
        };

        function setCLFocus(field) {
            $scope.CLFocusObj = $scope.GetCLFocusObj();
            $timeout(function () {
                $scope.CLFocusObj[field] = true;
            });
        }

        $scope.lensClick = function (tab) {
            $scope.lenstab = tab;
            $scope.inputypeTab = 1;
            if ($scope.lenstab == 1) {
                $scope.subLenstab = 1;
                if ($scope.RGPContactobj.TypeId == 1) {
                    $scope.ChangeRGPType('Wearing', 1);
                } else if ($scope.RGPContactobj.TypeId == 2) {
                    $scope.ChangeRGPType('Trial', 2);
                } else if ($scope.RGPContactobj.TypeId == 3) {
                    $scope.ChangeRGPType('Final', 3);
                } else {
                    $scope.ChangeRGPType('DispensedTrial', 4);
                }
            }
            else if ($scope.lenstab == 2) {
                $scope.subLenstab = 3;
                if ($scope.Contactobj.TypeName == 'Wearing') {
                    $scope.ChangeType('Wearing', 1);
                } else if ($scope.Contactobj.TypeName == 'Trial') {
                    $scope.ChangeType('Trial', 2);
                } else if ($scope.Contactobj.TypeName == 'Final') {
                    $scope.ChangeType('Final', 3);
                } else {
                    $scope.ChangeType('DispensedTrial', 4);
                }
            } else {
                $scope.subtabobj.CLsubtab = 1;
                $scope.subtabobj.RGPsubtab = 1;

                if ($scope.lenstab == 1) {
                    $scope.subLenstab = 1;
                    if ($scope.RGPContactobj.TypeId == 1) {
                        $scope.ChangeRGPType('Wearing', 1);
                    } else if ($scope.RGPContactobj.TypeId == 2) {
                        $scope.ChangeRGPType('Trial', 2);
                    } else if ($scope.RGPContactobj.TypeId == 3) {
                        $scope.ChangeRGPType('Final', 3);
                    } else {
                        $scope.ChangeRGPType('DispensedTrial', 4);
                    }
                } else {
                    $scope.subLenstab = 3;
                    if ($scope.Contactobj.TypeName == 'Wearing') {
                        $scope.ChangeType('Wearing', 1);
                    } else if ($scope.Contactobj.TypeName == 'Trial') {
                        $scope.ChangeType('Trial', 2);
                    } else if ($scope.Contactobj.TypeName == 'Final') {
                        $scope.ChangeType('Final', 3);
                    } else {
                        $scope.ChangeType('DispensedTrial', 4);
                    }
                }
            }

            $scope.CLSphericalListBoth = GetSphericalBothList();
            $scope.CLDesignTypeList = GetCLDesignTypeList();
            $scope.CLCylindricalListBoth = GetCylBothList();
            $scope.SphericalPlusList = GetSphericalPlusList();
            $scope.SphericalMinusList = GetSphericalMinusList();
            $scope.CylPlusList = GetCylPlusList();
            $scope.CylMinusList = GetCylMinusList();
            $scope.AxisPlusList = GetAxisPlusList();
            $scope.BCList = GetBCList();
            $scope.DiaList = GetDiaList();
            $scope.KeratometryList = GetKeratometryList();
            $scope.DistanceList = GetDistanceList();
            $scope.NearList = GetDistanceList();
            $scope.IntermediateList = GetDistanceList();
            $scope.CLColorList = GetColorList();
            $scope.CLProductList = GetProductList();
            $scope.MovementList = GetMovementList();
            $scope.DegreesList = GetDegreesList();
            $scope.CLDirectionList = GetDirectionList();
            $scope.CLCoverageList = GetCoverageList();
            $scope.CLCentrationList = GetCentrationList();
            $scope.CLComfortList = GetComfortList();
            $scope.AdvanceSphericalPlusList = GetSphericalPlusList();
            $scope.AdvanceSphericalMinusList = GetSphericalMinusList();
            $scope.AdvanceCylMinusList = GetCylMinusList();
            $scope.AdvanceAxisPlusList = GetAxisPlusList();
            $scope.AdvanceDistanceList = GetDistanceList();
            $scope.AdvanceNearList = GetDistanceList();
            $scope.AdvanceIntermediateList = GetDistanceList();

            $scope.Contactobj = angular.copy($scope.GetContactobj());
            $scope.RGPContactobj = angular.copy($scope.GetRGPContactobj());
            if (tab == 1) {
                $scope.Contactobj.TypeName = 'Wearing';
                $scope.Contactobj.TypeId = 1;
            } else if (tab == 2) {
                $scope.RGPContactobj.TypeName = 'Wearing';
                $scope.RGPContactobj.TypeId = 1;
                $scope.RGPContactobj.SubLenstab = 1;
            }
        };
        $scope.sublensClick = function (subtab) {

            $scope.CLSphericalListBoth = GetSphericalBothList();
            $scope.CLDesignTypeList = GetCLDesignTypeList();
            $scope.CLCylindricalListBoth = GetCylBothList();
            $scope.SphericalPlusList = GetSphericalPlusList();
            $scope.SphericalMinusList = GetSphericalMinusList();
            $scope.CylPlusList = GetCylPlusList();
            $scope.CylMinusList = GetCylMinusList();
            $scope.AxisPlusList = GetAxisPlusList();
            $scope.AddtionList = GetAddtionList();
            $scope.BCList = GetBCList();
            $scope.DiaList = GetDiaList();
            $scope.KeratometryList = GetKeratometryList();
            $scope.DistanceList = GetDistanceList();
            $scope.NearList = GetDistanceList();
            $scope.IntermediateList = GetDistanceList();
            $scope.CLColorList = GetColorList();
            $scope.CLProductList = GetProductList();
            $scope.MovementList = GetMovementList();
            $scope.DegreesList = GetDegreesList();
            $scope.CLDirectionList = GetDirectionList();
            $scope.CLCoverageList = GetCoverageList();
            $scope.CLCentrationList = GetCentrationList();
            $scope.CLComfortList = GetComfortList();

            $scope.subLenstab = subtab;
            if (subtab == 1) {
                $scope.onClickInputText(1, 'OD');
            } else {
                $scope.onClickInputText(1, 'OD', 'Fit');
            }
            
            $scope.Contactobj.SelectedEye = "OD";
            $scope.Contactobj.AdvancedSubType = "Fit";
        };


        



        $scope.init = function () {
            formVisionDetailsVisualActivityData();
            $scope.Contactobj = angular.copy($scope.GetContactobj());
            $scope.RGPContactobj = angular.copy($scope.GetRGPContactobj());
            //$scope.GetMasterContactLens();
            $scope.lenstab = 1;
            $scope.subLenstab = 1;
            $scope.Contactobj.TypeName = "Wearing";
            $scope.Contactobj.TypeId = 1;
            $scope.CLSphericalListBoth = GetSphericalBothList();
            $scope.CLDesignTypeList = GetCLDesignTypeList();
            $scope.CLCylindricalListBoth = GetCylBothList();
            $scope.SphericalPlusList = GetSphericalPlusList();
            $scope.SphericalMinusList = GetSphericalMinusList();
            $scope.CylPlusList = GetCylPlusList();
            $scope.CylMinusList = GetCylMinusList();
            $scope.AxisPlusList = GetAxisPlusList();
            $scope.AddtionList = GetAddtionList();
            $scope.BCList = GetBCList();
            $scope.DiaList = GetDiaList();
            $scope.KeratometryList = GetKeratometryList();
            $scope.DistanceList = GetDistanceList();
            $scope.NearList = GetDistanceList();
            $scope.IntermediateList = GetDistanceList();
            $scope.CLColorList = GetColorList();
            $scope.CLProductList = GetProductList();
            $scope.MovementList = GetMovementList();
            $scope.DegreesList = GetDegreesList();
            $scope.CLDirectionList = GetDirectionList();
            $scope.CLCoverageList = GetCoverageList();
            $scope.CLCentrationList = GetCentrationList();
            $scope.CLComfortList = GetComfortList();


            (function () {
                var resizeTimer;

                function isTouchDevice() {
                    return (
                        (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) ||
                        navigator.maxTouchPoints > 1 ||
                        'ontouchstart' in window
                    );
                }
                function getPhysicalWidth() {
                    return window.screen.width || window.innerWidth;
                }

                $scope.checkDevice = function () {
                    var physicalWidth = getPhysicalWidth();
                    var touch = isTouchDevice();


                    $scope.isTablet = touch && physicalWidth >= 768 && physicalWidth <= 1366;

                    if ($scope.isTablet) {
                        $scope.subtabobj = {
                            "CLsubtab": 2,
                            "RGPsubtab": 2,
                        }
                    } else {
                        $scope.subtabobj = {
                            "CLsubtab": 1,
                            "RGPsubtab": 1,
                        }
                    }


                };

                $scope.checkDevice();


                function debouncedResize() {
                    clearTimeout(resizeTimer);
                    resizeTimer = setTimeout(function () {
                        $scope.$apply(function () {
                            $scope.checkDevice();
                        });
                    }, 150);
                }

                angular.element($window).bind('resize orientationchange', debouncedResize);


                $scope.$on('$destroy', function () {
                    angular.element($window).unbind('resize orientationchange', debouncedResize);
                    clearTimeout(resizeTimer);
                });
            })();
           


               
            if ($scope.cat.CategoryDetails.length > 0) {
                angular.forEach($scope.cat.CategoryDetails, function (item) {
                    if (item.SubCategoryDetails.length > 0) {
                        angular.forEach(item.SubCategoryDetails, function (mitem) {
                            if (mitem.SubCategoryChildId == 104 && mitem.IsSubChildCategoryChecked == true) {
                                $scope.Softlenstab = true;

                            }
                            if (mitem.SubCategoryChildId == 102 && mitem.IsSubChildCategoryChecked == true) {
                                $scope.Rgplenstab = true;
                                $scope.RGPContactobj.TypeId = 1;
                                $scope.RGPContactobj.TypeName = "Wearing";
                            }
                        });
                    }

                });
            }

            if ($scope.Rgplenstab) {
                $scope.lenstab = 2;
                $scope.RGPContactobj.SubLenstab = 1;
                
            }

            if ($scope.Softlenstab) {
                $scope.lenstab = 1;

            }

            $q.all([
                eHnoteDiagnosisDataServices.GetAllMasterConsultationData(),
            ]).then(function (resp) {
                if (resp[0].data.status === "Success") {
                    $scope.MasterContactLensBrands = resp[0].data.MasterContactLensBrands || [];
                    $scope.MasterColorList = resp[0].data.MasterContactLens || [];
                    $scope.ProductsMainarray = [];
                    $scope.BrandsMainarray = [];
                    $scope.BCMainarray = [];
                    $scope.DiaMainarray = [];
                    $scope.FilterBClist = [];
                    $scope.FilterDialist = [];
                    $scope.MainColorlist = [];
                    if ($scope.MasterContactLensBrands.length > 0) {
                        angular.forEach($scope.MasterContactLensBrands, function (item) {
                            if ((item.ProductId == 6 && item.BrandsArray.length > 0) || (item.ProductName == 'ABB')) {
                                var obj = {
                                    "ContactLensMasterID": item.ContactLensMasterID||0,
                                    "ProductId": item.ProductId || 0,
                                    "ProductName": item.ProductName || "",
                                    "Value": item.ProductName||"",
                                    "selected": item.selected||false,
                                }
                                $scope.ProductsMainarray.push(obj);
                            }
                            if (item.ProductId == 6 && item.BrandsArray.length > 0) {
                                angular.forEach(item.BrandsArray, function (bitem) {
                                    var obj = {
                                        "ContactLensMasterID": item.ContactLensMasterID || 0,
                                        //"ProductId": item.ProductId || 0,
                                        "ProductName": item.ProductName || "",
                                        "BrandId": bitem.BrandId || 0,
                                        "Value": bitem.BrandName || "",
                                        "BaseCurve": bitem.BaseCurve || "",
                                        "Diameter": bitem.Diameter || "",
                                        "selected": bitem.selected || false,

                                    }
                                    //var obj1 = {
                                    //    "ContactLensMasterID": item.ContactLensMasterID || 0,
                                    //    //"ProductId": item.ProductId || 0,
                                    //    "ProductName": item.ProductName || "",
                                    //    "BrandId": bitem.BrandId || 0,
                                    //   /* "Value": bitem.BrandName || "",*/
                                    //    "Value": bitem.BaseCurve || "",
                                    //    "selected": bitem.selected || false,
                                    //}
                                    //var obj2 = {
                                    //    "ContactLensMasterID": item.ContactLensMasterID || 0,
                                    //    //"ProductId": item.ProductId || 0,
                                    //    "ProductName": item.ProductName || "",
                                    //    "BrandId": bitem.BrandId || 0,
                                    //    /* "Value": bitem.BrandName || "",*/
                                    //    "Value": bitem.Diameter || "",
                                    //    "selected": bitem.selected || false,
                                    //}

                                    $scope.BrandsMainarray.push(obj);
                                    //$scope.BCMainarray.push(obj1);
                                    //$scope.DiaMainarray.push(obj2);


                                });
                            }
                        });
                    }
                    if ($scope.ProductsMainarray.length > 0) {
                        $scope.FilterProductlist = angular.copy($scope.ProductsMainarray);
                    }
                    if ($scope.BrandsMainarray.length > 0) {
                        $scope.FilterBrandlist = angular.copy($scope.BrandsMainarray);
                    }


                    if ($scope.MasterColorList.length > 0) {
                        angular.forEach($scope.MasterColorList, function (item) {
                            if (item.ColorId == 5) {
                                var obj = {
                                    "ContactLensMasterID": item.ContactLensMasterID || 0,
                                    "Value": item.ColorName || "",
                                    "selected": item.selected || false,
                                }
                                $scope.MainColorlist.push(obj);
                            }
                        });
                    }
                    //if ($scope.BCMainarray.length > 0) {
                    //    $scope.FilterBClist = angular.copy($scope.BCMainarray);
                    //}
                    //if ($scope.DiaMainarray.length > 0) {
                    //    $scope.FilterDialist = angular.copy($scope.DiaMainarray);
                    //}
                }
            });
        }

        $scope.GetMasterContactLens = function () {
            eHnoteDiagnosisDataServices.GetMasterContactLens().then(function (resp) {
                if (resp.data.status === "Success") {
                    console.log(resp);
                    $scope.CentrationList = resp.data.Centration || [];
                    $scope.ColorList = resp.data.Color || [];
                    $scope.ComfortList = resp.data.Comfort || [];
                    $scope.CoverageList = resp.data.Coverage || [];
                    $scope.DirectionList = resp.data.Direction || [];
                    $scope.ProductList = resp.data.Product || [];
                    $scope.DesignTypeList = resp.data.DesignType || [];
                }

            });
        }
        $scope.init();

        if ($scope.cacheStorageItem.ContactLensDetails.length > 0) {
            angular.forEach($scope.cacheStorageItem.ContactLensDetails, function (item) {
                angular.forEach($scope.obj.ContactLensDetails, function (hitem) {
                    if (item.InvestigationId == hitem.InvestigationId) {
                        hitem.ContactLensId = item.ContactLensId;
                        hitem.ConsultationID = $scope.cacheStorageItem.ConsultationID || 0;
                        hitem.InvestigationDetails = item.InvestigationDetails || [];
                    }

                    if (hitem.InvestigationDetails.length > 0) {
                        angular.forEach(hitem.InvestigationDetails, function (titem) {
                            titem.CreatedDateTime = titem.CreatedDateTime || null;
                            if (titem.CreatedDateTime) {
                                titem.CreatedDateTime = normalizeToMDY(titem.CreatedDateTime);
                            }
                        });
                    }
                });
            });
        }


       
        const OD_FIELDS = [
            { key: "BasicODProduct", label: "Manufacturer" },
            { key: "BasicODSeries", label: "Series" },
            { key: "BasicODBC", label: "BC" },
            { key: "BasicODDia", label: "Diameter" },
            { key: "BasicODColor", label: "Colour" },
            { key: "BasicODDesignType", label: "Design Type" },
            { key: "BasicODSph", label: "Sph" },
            { key: "BasicODCyl", label: "Cyl" },
            { key: "BasicODAxis", label: "Axis" },
            { key: "BasicODAdd", label: "Add" },
            { key: "BasicODVaDistance", label: "VA (D)" },
            { key: "BasicODVaNear", label: "VA (N)" },
            { key: "BasicODVaIntermediate", label: "VA (I)" }
        ];
        const OS_FIELDS = [
            { key: "BasicOSProduct", label: "Manufacturer" },
            { key: "BasicOSSeries", label: "Series" },
            { key: "BasicOSBC", label: "BC" },
            { key: "BasicOSDia", label: "Diameter" },
            { key: "BasicOSColor", label: "Colour" },
            { key: "BasicOSDesignType", label: "Design Type" },
            { key: "BasicOSSph", label: "Sph" },
            { key: "BasicOSCyl", label: "Cyl" },
            { key: "BasicOSAxis", label: "Axis" },
            { key: "BasicOSAdd", label: "Add" },
            { key: "BasicOSVaDistance", label: "VA (D)" },
            { key: "BasicOSVaNear", label: "VA (N)" },
            { key: "BasicOSVaIntermediate", label: "VA (I)" }
        ];
        const OU_FIELDS = [
            { key: "BasicOUVaDistance", label: "VA (D)" },
            { key: "BasicOUVaNear", label: "VA (N)" },
            { key: "BasicOUVaIntermediate", label: "VA (I)" }
        ];
        const ADV_FIT_OD_FIELDS = [
            { key: "AdvancedFitODComfort", label: "Comfort" },
            { key: "AdvancedFitODCentration", label: "Centration" },
            { key: "AdvancedFitODCoverage", label: "Coverage" },
            { key: "AdvancedFitODMovement", label: "Movement" },
            { key: "AdvancedFitODDegrees", label: "Degree" },
            { key: "AdvancedFitODDirection", label: "Direction" }
        ];

        const ADV_FIT_OS_FIELDS = [
            { key: "AdvancedFitOSComfort", label: "Comfort" },
            { key: "AdvancedFitOSCentration", label: "Centration" },
            { key: "AdvancedFitOSCoverage", label: "Coverage" },
            { key: "AdvancedFitOSMovement", label: "Movement" },
            { key: "AdvancedFitOSDegrees", label: "Degree" },
            { key: "AdvancedFitOSDirection", label: "Direction" }
        ];
        const ADV_REF_OD_FIELDS = [
            { key: "AdvancedRefractionODSph", label: "Sph" },
            { key: "AdvancedRefractionODCyl", label: "Cyl" },
            { key: "AdvancedRefractionODAxis", label: "Axis" },
            { key: "AdvancedRefractionODAdd", label: "Add" },
            { key: "AdvancedRefractionODVaDistance", label: "Va(D)" },
            { key: "AdvancedRefractionODVaNear", label: "Va(N)" },
            { key: "AdvancedRefractionODVaIntermediate", label: "Va(I)" }
        ];

        const ADV_REF_OS_FIELDS = [
            { key: "AdvancedRefractionOSSph", label: "Sph" },
            { key: "AdvancedRefractionOSCyl", label: "Cyl" },
            { key: "AdvancedRefractionOSAxis", label: "Axis" },
            { key: "AdvancedRefractionOSAdd", label: "Add" },
            { key: "AdvancedRefractionOSVaDistance", label: "Va(D)" },
            { key: "AdvancedRefractionOSVaNear", label: "Va(N)" },
            { key: "AdvancedRefractionOSVaIntermediate", label: "Va(I)" }
        ];

        const ADV_REF_OU_FIELDS = [
            { key: "AdvancedRefractionOUVaDistance", label: "Va(D)" },
            { key: "AdvancedRefractionOUVaNear", label: "Va(N)" },
            { key: "AdvancedRefractionOUVaIntermediate", label: "Va(I)" }
        ];

        function getChangedParts(fields, oldItem, newItem, isOld) {
            let parts = [];
            fields.forEach(f => {
                let o = oldItem?.[f.key] ?? "";
                let n = newItem?.[f.key] ?? "";
                if (String(o) !== String(n)) {
                    parts.push(`${f.label} : ${isOld ? o : n}`);
                }
            });
            return parts;
        }
        function formatDate(dateVal, format = "MM-dd-yyyy hh:mm a") {
            if (!dateVal) return "";

            if (dateVal instanceof Date) {
                return $filter('date')(dateVal, format);
            }

            if (typeof dateVal === "string") {
                let normalized = dateVal
                    .replace(" ", "T"); // make it ISO-like

                let parsed = new Date(normalized);

                if (!isNaN(parsed.getTime())) {
                    return $filter('date')(parsed, format);
                }
            }

            return dateVal;
        }

        //function formatWearingDiff(oldItem, newItem, wearingNo, isOld) {

        //    let odParts = getChangedParts(OD_FIELDS, oldItem, newItem, isOld);
        //    let osParts = getChangedParts(OS_FIELDS, oldItem, newItem, isOld);
        //    let ouParts = getChangedParts(OU_FIELDS, oldItem, newItem, isOld);

        //    let notesChanged =
        //        String(oldItem?.BasicRemarks ?? "") !== String(newItem?.BasicRemarks ?? "");
        //    let instrChanged =
        //        String(oldItem?.BasicInstructions ?? "") !== String(newItem?.BasicInstructions ?? "");

        //    if (
        //        odParts.length === 0 &&
        //        osParts.length === 0 &&
        //        ouParts.length === 0 &&
        //        !notesChanged &&
        //        !instrChanged
        //    ) return "";

        //    let ref = isOld ? oldItem : newItem;
        //    let lines = [];

        //    lines.push(`Wearing ${wearingNo}`);
        //    lines.push(`Basic`);

        //    if (odParts.length) lines.push(`OD - ${odParts.join(" , ")}`);
        //    if (osParts.length) lines.push(`OS - ${osParts.join(" , ")}`);
        //    if (ouParts.length) lines.push(`OU - ${ouParts.join(" , ")}`);

        //    if (notesChanged)
        //        lines.push(`Notes : ${isOld ? oldItem?.BasicRemarks || "" : newItem?.BasicRemarks || ""}`);

        //    if (instrChanged)
        //        lines.push(`Wearing Instructions : ${isOld ? oldItem?.BasicInstructions || "" : newItem?.BasicInstructions || ""}`);
        //    //lines.push(
        //    //    `Added by : ${ref?.GivenByName || ""}, ${ref?.CreatedDateTime}`
        //    //);
        //    const createdOn = formatDate(ref?.CreatedDateTime, "MM-dd-yyyy hh:mm a");

        //    lines.push(
        //        `Added by : ${ref?.GivenByName || ""}, ${createdOn}`
        //    );

        //    return lines.join("\n");
        //}

        function formatWearingDiff(oldItem, newItem, wearingNo, isOld) {

            let odParts = getChangedParts(OD_FIELDS, oldItem, newItem, isOld);
            let osParts = getChangedParts(OS_FIELDS, oldItem, newItem, isOld);
            let ouParts = getChangedParts(OU_FIELDS, oldItem, newItem, isOld);

            let notesChanged =
                String(oldItem?.BasicRemarks ?? "") !== String(newItem?.BasicRemarks ?? "");
            let instrChanged =
                String(oldItem?.BasicInstructions ?? "") !== String(newItem?.BasicInstructions ?? "");

            /* ----------- NEW FIELDS CHANGE CHECK ----------- */

            let replChanged =
                String(oldItem?.ReplacementSchedule ?? "") !== String(newItem?.ReplacementSchedule ?? "");

            let rxExpChanged =
                String(oldItem?.RxExpiration ?? "") !== String(newItem?.RxExpiration ?? "");

            /* ---------------------------------------------- */

            if (
                odParts.length === 0 &&
                osParts.length === 0 &&
                ouParts.length === 0 &&
                !notesChanged &&
                !instrChanged &&
                !replChanged &&
                !rxExpChanged
            ) return "";

            let ref = isOld ? oldItem : newItem;
            let lines = [];

            lines.push(`Wearing ${wearingNo}`);
            lines.push(`Basic`);

            if (odParts.length) lines.push(`OD - ${odParts.join(" , ")}`);
            if (osParts.length) lines.push(`OS - ${osParts.join(" , ")}`);
            if (ouParts.length) lines.push(`OU - ${ouParts.join(" , ")}`);

            if (notesChanged)
                lines.push(`Notes : ${isOld ? oldItem?.BasicRemarks || "" : newItem?.BasicRemarks || ""}`);

            if (instrChanged)
                lines.push(`Wearing Instructions : ${isOld ? oldItem?.BasicInstructions || "" : newItem?.BasicInstructions || ""}`);

            /* ----------- ADDING NEW LOG FIELDS ----------- */

            if (replChanged)
                lines.push(`Replacement Schedule : ${isOld ? oldItem?.ReplacementSchedule || "" : newItem?.ReplacementSchedule || ""}`);

            if (rxExpChanged)
                lines.push(`Rx Expiration : ${isOld ? oldItem?.RxExpiration || "" : newItem?.RxExpiration || ""}`);

            /* --------------------------------------------- */

            const createdOn = formatDate(ref?.CreatedDateTime, "MM-dd-yyyy hh:mm a");

            lines.push(
                `Added by : ${ref?.GivenByName || ""}, ${createdOn}`
            );

            return lines.join("\n");
        }

        //function formatTrialDiff(oldItem, newItem, trialNo, isOld,type) {
        //    type = type || "";
        //    let lines = [];
        //    let ref = isOld ? oldItem : newItem;

        //    /* ================= BASIC ================= */

        //    let odBasic = getChangedParts(OD_FIELDS, oldItem, newItem, isOld);
        //    let osBasic = getChangedParts(OS_FIELDS, oldItem, newItem, isOld);
        //    let ouBasic = getChangedParts(OU_FIELDS, oldItem, newItem, isOld);

        //    let notesChanged =
        //        String(oldItem?.BasicRemarks ?? "") !== String(newItem?.BasicRemarks ?? "");
        //    let instrChanged =
        //        String(oldItem?.BasicInstructions ?? "") !== String(newItem?.BasicInstructions ?? "");
        //    let finalexpiration =
        //        String(oldItem?.RxExpiration ?? "") !== String(newItem?.RxExpiration ?? "");
        //    let finalreplacement =
        //        String(oldItem?.ReplacementSchedule ?? "") !== String(newItem?.ReplacementSchedule ?? "");
        //    let hasBasic =
        //        odBasic.length || osBasic.length || ouBasic.length || notesChanged || instrChanged;

        //    if (hasBasic) {
        //        lines.push(`${type} ${trialNo}`);
        //        lines.push(`Basic`);

        //        if (odBasic.length) lines.push(`OD - ${odBasic.join(" , ")}`);
        //        if (osBasic.length) lines.push(`OS - ${osBasic.join(" , ")}`);
        //        if (ouBasic.length) lines.push(`OU - ${ouBasic.join(" , ")}`);

        //        if (notesChanged)
        //            lines.push(`Notes : ${isOld ? oldItem.BasicRemarks || "" : newItem.BasicRemarks || ""}`);

        //        if (instrChanged)
        //            lines.push(`Wearing Instructions : ${isOld ? oldItem.BasicInstructions || "" : newItem.BasicInstructions || ""}`);

        //      //  if (type=="Final") {
        //            if (finalexpiration)
        //                lines.push(`Rx Expiration : ${isOld ? oldItem.RxExpiration || "" : newItem.RxExpiration || ""}`);
        //            if (finalreplacement)
        //                lines.push(`Replacement Schedule  : ${isOld ? oldItem.ReplacementSchedule || "" : newItem.ReplacementSchedule || ""}`);
        //      //  }
        //    }

        //    /* ================= ADVANCED – FIT ================= */

        //    let odFit = getChangedParts(ADV_FIT_OD_FIELDS, oldItem, newItem, isOld);
        //    let osFit = getChangedParts(ADV_FIT_OS_FIELDS, oldItem, newItem, isOld);

        //    if (odFit.length || osFit.length) {
        //        lines.push(``);
        //        lines.push(`${type} ${trialNo}`);
        //        lines.push(`Advance - Fit`);
        //       // lines.push(`Fit`);

        //        if (odFit.length) lines.push(`OD - ${odFit.join(" , ")}`);
        //        if (osFit.length) lines.push(`OS - ${osFit.join(" , ")}`);
        //    }

        //    /* ================= ADVANCED – OVER REFRACTION ================= */

        //    let odRef = getChangedParts(ADV_REF_OD_FIELDS, oldItem, newItem, isOld);
        //    let osRef = getChangedParts(ADV_REF_OS_FIELDS, oldItem, newItem, isOld);
        //    let ouRef = getChangedParts(ADV_REF_OU_FIELDS, oldItem, newItem, isOld);

        //    let refRemarksChanged =
        //        String(oldItem?.AdvancedRefractionRemarks ?? "") !==
        //        String(newItem?.AdvancedRefractionRemarks ?? "");

        //    if (odRef.length || osRef.length || ouRef.length || refRemarksChanged) {
        //        lines.push(``);
        //        lines.push(`Advance - Over Refraction`);

        //        if (odRef.length) lines.push(`OD - ${odRef.join(" , ")}`);
        //        if (osRef.length) lines.push(`OS - ${osRef.join(" , ")}`);
        //        if (ouRef.length) lines.push(`OU - ${ouRef.join(" , ")}`);

        //        if (refRemarksChanged)
        //            lines.push(
        //                `Notes : ${isOld ? oldItem.AdvancedRefractionRemarks || "" : newItem.AdvancedRefractionRemarks || ""}`
        //            );
        //    }

        //    if (lines.length === 0) return "";
        //    const createdOn = formatDate(ref?.CreatedDateTime, "MM-dd-yyyy hh:mm a");

        //    lines.push(
        //        `Added by : ${ref?.GivenByName || ""}, ${createdOn}`
        //    );

        //    return lines.join("\n");
        //}


        function formatTrialDiff(oldItem, newItem, trialNo, isOld, type) {

            type = type || "";
            let lines = [];
            let ref = isOld ? oldItem : newItem;

            /* ================= BASIC ================= */

            let odBasic = getChangedParts(OD_FIELDS, oldItem, newItem, isOld);
            let osBasic = getChangedParts(OS_FIELDS, oldItem, newItem, isOld);
            let ouBasic = getChangedParts(OU_FIELDS, oldItem, newItem, isOld);

            let notesChanged =
                String(oldItem?.BasicRemarks ?? "") !== String(newItem?.BasicRemarks ?? "");

            let instrChanged =
                String(oldItem?.BasicInstructions ?? "") !== String(newItem?.BasicInstructions ?? "");

            /* -------- NEW FIELDS -------- */

            let finalexpiration =
                String(oldItem?.RxExpiration ?? "") !== String(newItem?.RxExpiration ?? "");

            let finalreplacement =
                String(oldItem?.ReplacementSchedule ?? "") !== String(newItem?.ReplacementSchedule ?? "");

            /* IMPORTANT FIX — include new fields */
            let hasBasic =
                odBasic.length ||
                osBasic.length ||
                ouBasic.length ||
                notesChanged ||
                instrChanged ||
                finalexpiration ||
                finalreplacement;

            if (hasBasic) {

                lines.push(`${type} ${trialNo}`);
                lines.push(`Basic`);

                if (odBasic.length) lines.push(`OD - ${odBasic.join(" , ")}`);
                if (osBasic.length) lines.push(`OS - ${osBasic.join(" , ")}`);
                if (ouBasic.length) lines.push(`OU - ${ouBasic.join(" , ")}`);

                if (notesChanged)
                    lines.push(`Notes : ${isOld ? oldItem?.BasicRemarks || "" : newItem?.BasicRemarks || ""}`);

                if (instrChanged)
                    lines.push(`Wearing Instructions : ${isOld ? oldItem?.BasicInstructions || "" : newItem?.BasicInstructions || ""}`);

                /* ---- ADD THESE ---- */

                if (finalexpiration)
                    lines.push(`Rx Expiration : ${isOld ? oldItem?.RxExpiration || "" : newItem?.RxExpiration || ""}`);

                if (finalreplacement)
                    lines.push(`Replacement Schedule : ${isOld ? oldItem?.ReplacementSchedule || "" : newItem?.ReplacementSchedule || ""}`);
            }

            /* ================= ADVANCED – FIT ================= */

            let odFit = getChangedParts(ADV_FIT_OD_FIELDS, oldItem, newItem, isOld);
            let osFit = getChangedParts(ADV_FIT_OS_FIELDS, oldItem, newItem, isOld);

            if (odFit.length || osFit.length) {
                lines.push(``);
                lines.push(`${type} ${trialNo}`);
                lines.push(`Advance - Fit`);

                if (odFit.length) lines.push(`OD - ${odFit.join(" , ")}`);
                if (osFit.length) lines.push(`OS - ${osFit.join(" , ")}`);
            }

            /* ================= ADVANCED – OVER REFRACTION ================= */

            let odRef = getChangedParts(ADV_REF_OD_FIELDS, oldItem, newItem, isOld);
            let osRef = getChangedParts(ADV_REF_OS_FIELDS, oldItem, newItem, isOld);
            let ouRef = getChangedParts(ADV_REF_OU_FIELDS, oldItem, newItem, isOld);

            let refRemarksChanged =
                String(oldItem?.AdvancedRefractionRemarks ?? "") !==
                String(newItem?.AdvancedRefractionRemarks ?? "");

            if (odRef.length || osRef.length || ouRef.length || refRemarksChanged) {
                lines.push(``);
                lines.push(`Advance - Over Refraction`);

                if (odRef.length) lines.push(`OD - ${odRef.join(" , ")}`);
                if (osRef.length) lines.push(`OS - ${osRef.join(" , ")}`);
                if (ouRef.length) lines.push(`OU - ${ouRef.join(" , ")}`);

                if (refRemarksChanged)
                    lines.push(
                        `Notes : ${isOld ? oldItem?.AdvancedRefractionRemarks || "" : newItem?.AdvancedRefractionRemarks || ""}`
                    );
            }

            if (lines.length === 0) return "";

            const createdOn = formatDate(ref?.CreatedDateTime, "MM-dd-yyyy hh:mm a");

            lines.push(
                `Added by : ${ref?.GivenByName || ""}, ${createdOn}`
            );

            return lines.join("\n");
        }

        $scope.compareSoftLensandRGPData = function () {

            const newInv = ($scope.obj.ContactLensDetails || [])
                .find(x => x.InvestigationId === 2084);

            const oldInv = ($scope.LogObj.ContactLensDetails || [])
                .find(x => x.InvestigationId === 2084);

            const newList = (newInv?.InvestigationDetails || [])
                .filter(x => x.TypeId === 1);

            const oldList = (oldInv?.InvestigationDetails || [])
                .filter(x => x.TypeId === 1);

            const trailnewList = (newInv?.InvestigationDetails || [])
                .filter(x => x.TypeId === 2);

            const trailoldList = (oldInv?.InvestigationDetails || [])
                .filter(x => x.TypeId === 2);

            const finalnewList = (newInv?.InvestigationDetails || [])
                .filter(x => x.TypeId === 3);

            const finaloldList = (oldInv?.InvestigationDetails || [])
                .filter(x => x.TypeId === 3);

            const dispfinalnewList = (newInv?.InvestigationDetails || [])
                .filter(x => x.TypeId === 4);

            const dispfinaloldList = (oldInv?.InvestigationDetails || [])
                .filter(x => x.TypeId === 4);

            ////// RGP //////
            const RgpnewInv = ($scope.obj.ContactLensDetails || [])
                .find(x => x.InvestigationId === 2078);

            const RgpoldInv = ($scope.LogObj.ContactLensDetails || [])
                .find(x => x.InvestigationId === 2078);

            const rgpnewList = (RgpnewInv?.InvestigationDetails || [])
                .filter(x => x.TypeId === 1);

            const rgpoldList = (RgpoldInv?.InvestigationDetails || [])
                .filter(x => x.TypeId === 1);

            const rgptrailnewList = (RgpnewInv?.InvestigationDetails || [])
                .filter(x => x.TypeId === 2);

            const rgptrailoldList = (RgpoldInv?.InvestigationDetails || [])
                .filter(x => x.TypeId === 2);

            const rgpfinalnewList = (RgpnewInv?.InvestigationDetails || [])
                .filter(x => x.TypeId === 3);

            const rgpfinaloldList = (RgpoldInv?.InvestigationDetails || [])
                .filter(x => x.TypeId === 3);

            const rgpdispfinalnewList = (RgpnewInv?.InvestigationDetails || [])
                .filter(x => x.TypeId === 4);

            const rgpdispfinaloldList = (RgpoldInv?.InvestigationDetails || [])
                .filter(x => x.TypeId === 4);

            let oldDescArr = [];
            let newDescArr = [];
            let weadltCount = 0;
            let weadltDescArr = [];

            let traildltCount = 0;
            let traildltDescArr = [];
            let trailoldDescArr = [];
            let trailnewDescArr = [];

            let finaldltCount = 0;
            let finaldltDescArr = [];
            let finaloldDescArr = [];
            let finalnewDescArr = [];

            let dispfinaldltCount = 0;
            let dispfinaldltDescArr = [];
            let dispfinaloldDescArr = [];
            let dispfinalnewDescArr = [];
            ////// RGP ////
            let rgpoldDescArr = [];
            let rgpnewDescArr = [];
            let rgpweadltCount = 0;
            let rgpweadltDescArr = [];

            let rgptraildltCount = 0;
            let rgptraildltDescArr = [];
            let rgptrailoldDescArr = [];
            let rgptrailnewDescArr = [];

            let rgpfinaldltCount = 0;
            let rgpfinaldltDescArr = [];
            let rgpfinaloldDescArr = [];
            let rgpfinalnewDescArr = [];

            let rgpdispfinaldltCount = 0;
            let rgpdispfinaldltDescArr = [];
            let rgpdispfinaloldDescArr = [];
            let rgpdispfinalnewDescArr = [];

            /// SLP Wearing//
            oldList.forEach((oldItem, idx) => {
                const exists = newList.find(n => n.ContactLensDetailId === oldItem.ContactLensDetailId);
                if (!exists || exists.DeleteInd === 'Y') {
                    weadltDescArr.push(formatWearingDiff(oldItem, {}, idx+1,true));
                    weadltCount++;
                }
            });
            newList.forEach((newItem, idx) => {
                if (newItem.DeleteInd === 'Y') return;
                const oldItem = oldList.find(
                    o => o.ContactLensDetailId === newItem.ContactLensDetailId
                );

                const wearingNo = idx + 1;

                // Added
                if (!oldItem) {
                    let newTxt = formatWearingDiff({}, newItem, wearingNo, false);
                    if (newTxt) newDescArr.push(newTxt);
                }
                // Edited
                else {
                    let oldTxt = formatWearingDiff(oldItem, newItem, wearingNo, true);
                    let newTxt = formatWearingDiff(oldItem, newItem, wearingNo, false);

                    if (oldTxt && newTxt) {
                        oldDescArr.push(oldTxt);
                        newDescArr.push(newTxt);
                    }
                }
            });

            if (oldDescArr.length>0|| newDescArr.length>0) {

                let obj = {
                    LogId: 0,
                    ModuleId: 1,
                    ModuleName: "OUTPatient",
                    SubModuleId: 51,
                    SubModuleName: "Contact Lens",
                    ScreenType: "Soft Contact Lens(Wearing)",
                    ActionType: oldDescArr.join("\n\n") ? 'Edited' : 'Added',
                    OldActionDescription: oldDescArr.join("\n\n"),
                    NewActionDescription: newDescArr.join("\n\n"),
                    ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss")
                };

                $scope.LogObj.LogArray.push(obj);
            }
            if (weadltCount > 0) {
                const logObj = {
                    LogId: 0,
                    ModuleId: 1,
                    ModuleName: "OUTPatient",
                    SubModuleId: 51,
                    SubModuleName: "Contact Lens",
                    ScreenType: "Soft Contact Lens(Wearing)",
                    ActionType: "Deleted",
                    OldActionDescription: weadltDescArr.join('\n').trim(),
                    NewActionDescription: "",
                    ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss")
                };
                $scope.LogObj.LogArray.push(logObj);
            }

            ///SLP Wearing End//

            ///SLP Trail////

            trailoldList.forEach((oldItem, idx) => {
                const exists = trailnewList.find(n => n.ContactLensDetailId === oldItem.ContactLensDetailId);
                if (!exists || exists.DeleteInd === 'Y') {
                    traildltDescArr.push(formatTrialDiff(oldItem, {}, idx+1,true,"Trail"));
                    traildltCount++;
                }
            });
            trailnewList.forEach((newItem, idx) => {
                if (newItem.DeleteInd === 'Y') return;
                const oldItem = trailoldList.find(
                    o => o.ContactLensDetailId === newItem.ContactLensDetailId
                );

                const trailNo = idx + 1;

                // Added
                if (!oldItem) {
                    let newTxt = formatTrialDiff({}, newItem, trailNo, false,"Trail");
                    if (newTxt) trailnewDescArr.push(newTxt);
                }
                // Edited
                else {
                    let oldTxt = formatTrialDiff(oldItem, newItem, trailNo, true,"Trail");
                    let newTxt = formatTrialDiff(oldItem, newItem, trailNo, false, "Trail");

                    if (oldTxt && newTxt) {
                        trailoldDescArr.push(oldTxt);
                        trailnewDescArr.push(newTxt);
                    }
                }
            });

            if (trailoldDescArr.length>0 || trailnewDescArr.length>0) {

                let obj = {
                    LogId: 0,
                    ModuleId: 1,
                    ModuleName: "OUTPatient",
                    SubModuleId: 51,
                    SubModuleName: "Contact Lens",
                    ScreenType: "Soft Contact Lens(Trail)",
                    ActionType: trailoldDescArr.join("\n\n") ? 'Edited' : 'Added',
                    OldActionDescription: trailoldDescArr.join("\n\n"),
                    NewActionDescription: trailnewDescArr.join("\n\n"),
                    ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss")
                };

                $scope.LogObj.LogArray.push(obj);
            }
            if (traildltCount > 0) {
                const logObj = {
                    LogId: 0,
                    ModuleId: 1,
                    ModuleName: "OUTPatient",
                    SubModuleId: 51,
                    SubModuleName: "Contact Lens",
                    ScreenType: "Soft Contact Lens(Trail)",
                    ActionType: "Deleted",
                    OldActionDescription: traildltDescArr.join('\n').trim(),
                    NewActionDescription: "",
                    ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss")
                };
                $scope.LogObj.LogArray.push(logObj);
            }

              ///SLP Trail End////

            ///SLP Final///
            finaloldList.forEach((oldItem, idx) => {
                const exists = finalnewList.find(n => n.ContactLensDetailId === oldItem.ContactLensDetailId);
                if (!exists || exists.DeleteInd === 'Y') {
                    finaldltDescArr.push(formatTrialDiff(oldItem, {}, idx + 1, true,"Final"));
                    finaldltCount++;
                }
            });
            finalnewList.forEach((newItem, idx) => {
                if (newItem.DeleteInd === 'Y') return;
                const oldItem = finaloldList.find(
                    o => o.ContactLensDetailId === newItem.ContactLensDetailId
                );

                const finalNo = idx + 1;

                // Added
                if (!oldItem) {
                    let newTxt = formatTrialDiff({}, newItem, finalNo, false, "Final");
                    if (newTxt) finalnewDescArr.push(newTxt);
                }
                // Edited
                else {
                    let oldTxt = formatTrialDiff(oldItem, newItem, finalNo, true, "Final");
                    let newTxt = formatTrialDiff(oldItem, newItem, finalNo, false, "Final");

                    if (oldTxt && newTxt) {
                        finaloldDescArr.push(oldTxt);
                        finalnewDescArr.push(newTxt);
                    }
                }
            });

            if (finaloldDescArr.length > 0 || finalnewDescArr.length > 0) {

                let obj = {
                    LogId: 0,
                    ModuleId: 1,
                    ModuleName: "OUTPatient",
                    SubModuleId: 51,
                    SubModuleName: "Contact Lens",
                    ScreenType: "Soft Contact Lens(Final)",
                    ActionType: finaloldDescArr.join("\n\n") ? 'Edited' : 'Added',
                    OldActionDescription: finaloldDescArr.join("\n\n"),
                    NewActionDescription: finalnewDescArr.join("\n\n"),
                    ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss")
                };

                $scope.LogObj.LogArray.push(obj);
            }
            if (finaldltCount > 0) {
                const logObj = {
                    LogId: 0,
                    ModuleId: 1,
                    ModuleName: "OUTPatient",
                    SubModuleId: 51,
                    SubModuleName: "Contact Lens",
                    ScreenType: "Soft Contact Lens(Final)",
                    ActionType: "Deleted",
                    OldActionDescription: finaldltDescArr.join('\n').trim(),
                    NewActionDescription: "",
                    ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss")
                };
                $scope.LogObj.LogArray.push(logObj);
            }

            /// SLP Final End///

            //SLP Disp.Trail///
            dispfinaloldList.forEach((oldItem, idx) => {
                const exists = dispfinalnewList.find(n => n.ContactLensDetailId === oldItem.ContactLensDetailId);
                if (!exists || exists.DeleteInd === 'Y') {
                    dispfinaldltDescArr.push(formatTrialDiff(oldItem, {}, idx + 1, true,"Disp.Trail"));
                    dispfinaldltCount++;
                }
            });
            dispfinalnewList.forEach((newItem, idx) => {
                if (newItem.DeleteInd === 'Y') return;
                const oldItem = dispfinaloldList.find(
                    o => o.ContactLensDetailId === newItem.ContactLensDetailId
                );

                const finalNo = idx + 1;

                // Added
                if (!oldItem) {
                    let newTxt = formatTrialDiff({}, newItem, finalNo, false, "Disp.Trail");
                    if (newTxt) dispfinalnewDescArr.push(newTxt);
                }
                // Edited
                else {
                    let oldTxt = formatTrialDiff(oldItem, newItem, finalNo, true, "Disp.Trail");
                    let newTxt = formatTrialDiff(oldItem, newItem, finalNo, false, "Disp.Trail");

                    if (oldTxt && newTxt) {
                        dispfinaloldDescArr.push(oldTxt);
                        dispfinalnewDescArr.push(newTxt);
                    }
                }
            });

            if (dispfinaloldDescArr.length > 0 || dispfinalnewDescArr.length > 0) {

                let obj = {
                    LogId: 0,
                    ModuleId: 1,
                    ModuleName: "OUTPatient",
                    SubModuleId: 51,
                    SubModuleName: "Contact Lens",
                    ScreenType: "Soft Contact Lens(Dispenced Trail)",
                    ActionType: dispfinaloldDescArr.join("\n\n") ? 'Edited' : 'Added',
                    OldActionDescription: dispfinaloldDescArr.join("\n\n"),
                    NewActionDescription: dispfinalnewDescArr.join("\n\n"),
                    ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss")
                };

                $scope.LogObj.LogArray.push(obj);
            }
            if (dispfinaldltCount > 0) {
                const logObj = {
                    LogId: 0,
                    ModuleId: 1,
                    ModuleName: "OUTPatient",
                    SubModuleId: 51,
                    SubModuleName: "Contact Lens",
                    ScreenType: "Soft Contact Lens(Dispenced Trail)",
                    ActionType: "Deleted",
                    OldActionDescription: dispfinaldltDescArr.join('\n').trim(),
                    NewActionDescription: "",
                    ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss")
                };
                $scope.LogObj.LogArray.push(logObj);
            }

            //SLP Disp.Trail End///

            ///RGP Wearing///
            rgpoldList.forEach((oldItem, idx) => {
                const exists = rgpnewList.find(n => n.ContactLensDetailId === oldItem.ContactLensDetailId);
                if (!exists || exists.DeleteInd === 'Y') {
                    rgpweadltDescArr.push(formatWearingDiff(oldItem, {}, idx + 1, true));
                    rgpweadltCount++;
                }
            });
            rgpnewList.forEach((newItem, idx) => {
                if (newItem.DeleteInd === 'Y') return;
                const oldItem = rgpoldList.find(
                    o => o.ContactLensDetailId === newItem.ContactLensDetailId
                );

                const wearingNo = idx + 1;

                // Added
                if (!oldItem) {
                    let newTxt = formatWearingDiff({}, newItem, wearingNo, false);
                    if (newTxt) rgpnewDescArr.push(newTxt);
                }
                // Edited
                else {
                    let oldTxt = formatWearingDiff(oldItem, newItem, wearingNo, true);
                    let newTxt = formatWearingDiff(oldItem, newItem, wearingNo, false);

                    if (oldTxt && newTxt) {
                        rgpoldDescArr.push(oldTxt);
                        rgpnewDescArr.push(newTxt);
                    }
                }
            });

            if (rgpoldDescArr.length > 0 || rgpnewDescArr.length > 0) {

                let obj = {
                    LogId: 0,
                    ModuleId: 1,
                    ModuleName: "OUTPatient",
                    SubModuleId: 51,
                    SubModuleName: "Contact Lens",
                    ScreenType: "RGP Lens(Wearing)",
                    ActionType: rgpoldDescArr.join("\n\n") ? 'Edited' : 'Added',
                    OldActionDescription: rgpoldDescArr.join("\n\n"),
                    NewActionDescription: rgpnewDescArr.join("\n\n"),
                    ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss")
                };

                $scope.LogObj.LogArray.push(obj);
            }
            if (rgpweadltCount > 0) {
                const logObj = {
                    LogId: 0,
                    ModuleId: 1,
                    ModuleName: "OUTPatient",
                    SubModuleId: 51,
                    SubModuleName: "Contact Lens",
                    ScreenType: "RGP Lens(Wearing)",
                    ActionType: "Deleted",
                    OldActionDescription: rgpweadltDescArr.join('\n').trim(),
                    NewActionDescription: "",
                    ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss")
                };
                $scope.LogObj.LogArray.push(logObj);
            }

            ///RGP Wearing End///

            ///RGP Trail////

            rgptrailoldList.forEach((oldItem, idx) => {
                const exists = rgptrailnewList.find(n => n.ContactLensDetailId === oldItem.ContactLensDetailId);
                if (!exists || exists.DeleteInd === 'Y') {
                    rgptraildltDescArr.push(formatTrialDiff(oldItem, {}, idx + 1, true,"Trail"));
                    rgptraildltCount++;
                }
            });
            rgptrailnewList.forEach((newItem, idx) => {
                if (newItem.DeleteInd === 'Y') return;
                const oldItem = rgptrailoldList.find(
                    o => o.ContactLensDetailId === newItem.ContactLensDetailId
                );

                const trailNo = idx + 1;

                // Added
                if (!oldItem) {
                    let newTxt = formatTrialDiff({}, newItem, trailNo, false, "Trail");
                    if (newTxt) rgptrailnewDescArr.push(newTxt);
                }
                // Edited
                else {
                    let oldTxt = formatTrialDiff(oldItem, newItem, trailNo, true, "Trail");
                    let newTxt = formatTrialDiff(oldItem, newItem, trailNo, false, "Trail");

                    if (oldTxt && newTxt) {
                        rgptrailoldDescArr.push(oldTxt);
                        rgptrailnewDescArr.push(newTxt);
                    }
                }
            });

            if (rgptrailoldDescArr.length > 0 || rgptrailnewDescArr.length > 0) {

                let obj = {
                    LogId: 0,
                    ModuleId: 1,
                    ModuleName: "OUTPatient",
                    SubModuleId: 51,
                    SubModuleName: "Contact Lens",
                    ScreenType: "RGP Lens(Trail)",
                    ActionType: rgptrailoldDescArr.join("\n\n") ? 'Edited' : 'Added',
                    OldActionDescription: rgptrailoldDescArr.join("\n\n"),
                    NewActionDescription: rgptrailnewDescArr.join("\n\n"),
                    ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss")
                };

                $scope.LogObj.LogArray.push(obj);
            }
            if (rgptraildltCount > 0) {
                const logObj = {
                    LogId: 0,
                    ModuleId: 1,
                    ModuleName: "OUTPatient",
                    SubModuleId: 51,
                    SubModuleName: "Contact Lens",
                    ScreenType: "RGP Lens(Trail)",
                    ActionType: "Deleted",
                    OldActionDescription: rgptraildltDescArr.join('\n').trim(),
                    NewActionDescription: "",
                    ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss")
                };
                $scope.LogObj.LogArray.push(logObj);
            }

              ///RGP Trail End////

            ///RGP Final///
            rgpfinaloldList.forEach((oldItem, idx) => {
                const exists = rgpfinalnewList.find(n => n.ContactLensDetailId === oldItem.ContactLensDetailId);
                if (!exists || exists.DeleteInd === 'Y') {
                    rgpfinaldltDescArr.push(formatTrialDiff(oldItem, {}, idx + 1, true,"Final"));
                    rgpfinaldltCount++;
                }
            });
            rgpfinalnewList.forEach((newItem, idx) => {
                if (newItem.DeleteInd === 'Y') return;
                const oldItem = rgpfinaloldList.find(
                    o => o.ContactLensDetailId === newItem.ContactLensDetailId
                );

                const finalNo = idx + 1;

                // Added
                if (!oldItem) {
                    let newTxt = formatTrialDiff({}, newItem, finalNo, false, "Final");
                    if (newTxt) rgpfinalnewDescArr.push(newTxt);
                }
                // Edited
                else {
                    let oldTxt = formatTrialDiff(oldItem, newItem, finalNo, true, "Final");
                    let newTxt = formatTrialDiff(oldItem, newItem, finalNo, false, "Final");

                    if (oldTxt && newTxt) {
                        rgpfinaloldDescArr.push(oldTxt);
                        rgpfinalnewDescArr.push(newTxt);
                    }
                }
            });

            if (rgpfinaloldDescArr.length > 0 || rgpfinalnewDescArr.length > 0) {

                let obj = {
                    LogId: 0,
                    ModuleId: 1,
                    ModuleName: "OUTPatient",
                    SubModuleId: 51,
                    SubModuleName: "Contact Lens",
                    ScreenType: "RGP Lens(Final)",
                    ActionType: rgpfinaloldDescArr.join("\n\n") ? 'Edited' : 'Added',
                    OldActionDescription: rgpfinaloldDescArr.join("\n\n"),
                    NewActionDescription: rgpfinalnewDescArr.join("\n\n"),
                    ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss")
                };

                $scope.LogObj.LogArray.push(obj);
            }
            if (rgpfinaldltCount > 0) {
                const logObj = {
                    LogId: 0,
                    ModuleId: 1,
                    ModuleName: "OUTPatient",
                    SubModuleId: 51,
                    SubModuleName: "Contact Lens",
                    ScreenType: "RGP Lens(Final)",
                    ActionType: "Deleted",
                    OldActionDescription: rgpfinaldltDescArr.join('\n').trim(),
                    NewActionDescription: "",
                    ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss")
                };
                $scope.LogObj.LogArray.push(logObj);
            }

            /// RGP Final End///

            //RGP Disp.Trail///
            rgpdispfinaloldList.forEach((oldItem, idx) => {
                const exists = rgpdispfinalnewList.find(n => n.ContactLensDetailId === oldItem.ContactLensDetailId);
                if (!exists || exists.DeleteInd === 'Y') {
                    rgpdispfinaldltDescArr.push(formatTrialDiff(oldItem, {}, idx + 1, true,"Disp.Trail"));
                    rgpdispfinaldltCount++;
                }
            });
            rgpdispfinalnewList.forEach((newItem, idx) => {
                if (newItem.DeleteInd === 'Y') return;
                const oldItem = rgpdispfinaloldList.find(
                    o => o.ContactLensDetailId === newItem.ContactLensDetailId
                );

                const finalNo = idx + 1;

                // Added
                if (!oldItem) {
                    let newTxt = formatTrialDiff({}, newItem, finalNo, false, "Disp.Trail");
                    if (newTxt) rgpdispfinalnewDescArr.push(newTxt);
                }
                // Edited
                else {
                    let oldTxt = formatTrialDiff(oldItem, newItem, finalNo, true, "Disp.Trail");
                    let newTxt = formatTrialDiff(oldItem, newItem, finalNo, false, "Disp.Trail");

                    if (oldTxt && newTxt) {
                        rgpdispfinaloldDescArr.push(oldTxt);
                        rgpdispfinalnewDescArr.push(newTxt);
                    }
                }
            });

            if (rgpdispfinaloldDescArr.length > 0 || rgpdispfinalnewDescArr.length > 0) {

                let obj = {
                    LogId: 0,
                    ModuleId: 1,
                    ModuleName: "OUTPatient",
                    SubModuleId: 51,
                    SubModuleName: "Contact Lens",
                    ScreenType: "RGP Lens(Dispenced Trail)",
                    ActionType: rgpdispfinaloldDescArr.join("\n\n") ? 'Edited' : 'Added',
                    OldActionDescription: rgpdispfinaloldDescArr.join("\n\n"),
                    NewActionDescription: rgpdispfinalnewDescArr.join("\n\n"),
                    ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss")
                };

                $scope.LogObj.LogArray.push(obj);
            }
            if (rgpdispfinaldltCount > 0) {
                const logObj = {
                    LogId: 0,
                    ModuleId: 1,
                    ModuleName: "OUTPatient",
                    SubModuleId: 51,
                    SubModuleName: "Contact Lens",
                    ScreenType: "RGP Lens(Dispenced Trail)",
                    ActionType: "Deleted",
                    OldActionDescription: rgpdispfinaldltDescArr.join('\n').trim(),
                    NewActionDescription: "",
                    ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss")
                };
                $scope.LogObj.LogArray.push(logObj);
            }

            //RGP Disp.Trail End///

        };

        $scope.IsClickSaveContactLensBtn = false;

        $scope.SaveContactData = function () {
            $scope.LogObj.LogArray = [];
            $scope.IsClickSaveContactLensBtn = true;
            let GivenByName = '';
            var Arraylist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.UserId }, true) || [];
            if (Arraylist.length > 0) {
                GivenByName = Arraylist[0].FirstName + Arraylist[0].LastName + ' ' + Arraylist[0].SuffixName;
            }

          
            if ($scope.Contactobj.BasicODDesignType != '' || $scope.Contactobj.BasicODSph != '' || $scope.Contactobj.BasicODCyl != '' || $scope.Contactobj.BasicOSSeries != '' || $scope.Contactobj.BasicODSeries != ''
                || $scope.Contactobj.BasicODAxis != '' || $scope.Contactobj.BasicODBC != '' || $scope.Contactobj.BasicODDia != ''
                || $scope.Contactobj.BasicODKeratometry != '' || $scope.Contactobj.BasicODColor != '' || $scope.Contactobj.BasicODProduct != ''
                || $scope.Contactobj.BasicODVaDistance != '' || $scope.Contactobj.BasicODVaNear != '' || $scope.Contactobj.BasicODVaIntermediate != ''
                || $scope.Contactobj.BasicOSDesignType != '' || $scope.Contactobj.BasicOSSph != '' || $scope.Contactobj.BasicOSCyl != ''
                || $scope.Contactobj.BasicOSAxis != '' || $scope.Contactobj.BasicOSBC != '' || $scope.Contactobj.BasicOSDia != ''
                || $scope.Contactobj.BasicOSKeratometry != '' || $scope.Contactobj.BasicOSColor != '' || $scope.Contactobj.BasicOSProduct != ''
                || $scope.Contactobj.BasicOSVaDistance != '' || $scope.Contactobj.BasicOSVaNear != '' || $scope.Contactobj.BasicOSVaIntermediate != ''
                || $scope.Contactobj.BasicOUVaDistance != '' || $scope.Contactobj.BasicOUVaNear != '' || $scope.Contactobj.BasicOUVaIntermediate != ''
                || $scope.Contactobj.AdvancedFitODComfort != '' || $scope.Contactobj.AdvancedFitODCentration != '' || $scope.Contactobj.AdvancedFitODCoverage != ''
                || $scope.Contactobj.AdvancedFitODMovement != '' || $scope.Contactobj.AdvancedFitODDegrees != '' || $scope.Contactobj.AdvancedFitODDirection != ''
                || $scope.Contactobj.AdvancedFitOSComfort != '' || $scope.Contactobj.AdvancedFitOSCentration != '' || $scope.Contactobj.AdvancedFitOSCoverage != ''
                || $scope.Contactobj.AdvancedFitOSMovement != '' || $scope.Contactobj.AdvancedFitOSDegrees != '' || $scope.Contactobj.AdvancedFitOSDirection != ''
                || $scope.Contactobj.AdvancedRefractionODSph != '' || $scope.Contactobj.AdvancedRefractionODCyl != '' || $scope.Contactobj.AdvancedRefractionODAxis != ''
                || $scope.Contactobj.AdvancedRefractionODVaDistance != '' || $scope.Contactobj.AdvancedRefractionODVaNear != '' || $scope.Contactobj.AdvancedRefractionODVaIntermediate != ''
                || $scope.Contactobj.AdvancedRefractionOSSph != '' || $scope.Contactobj.AdvancedRefractionOSCyl != '' || $scope.Contactobj.AdvancedRefractionOSAxis != ''
                || $scope.Contactobj.AdvancedRefractionOSVaDistance != '' || $scope.Contactobj.AdvancedRefractionOSVaNear != '' || $scope.Contactobj.AdvancedRefractionOSVaIntermediate != ''
                || $scope.Contactobj.AdvancedRefractionOUVaDistance != '' || $scope.Contactobj.AdvancedRefractionOUVaNear != '' || $scope.Contactobj.AdvancedRefractionOUVaIntermediate != ''
            ) {
                $scope.AddNewContactobj();
            } else {

            }

            if ($scope.RGPContactobj.BasicODDesignType != '' || $scope.RGPContactobj.BasicODColor != '' || $scope.RGPContactobj.BasicODProduct != ''

                || $scope.RGPContactobj.BasicODSeries != '' || $scope.RGPContactobj.BasicODBC != '' || $scope.RGPContactobj.BasicODDia != ''
                || $scope.RGPContactobj.BasicODSph != '' || $scope.RGPContactobj.BasicODCyl != '' || $scope.RGPContactobj.BasicODAxis != ''
                || $scope.RGPContactobj.BasicODAdd != ''
                || $scope.RGPContactobj.BasicODVaDistance != '' || $scope.RGPContactobj.BasicODVaNear != '' || $scope.RGPContactobj.BasicODVaIntermediate != ''
                || $scope.RGPContactobj.BasicOSSeries != '' || $scope.RGPContactobj.BasicOSBC != '' || $scope.RGPContactobj.BasicOSDia != ''
                || $scope.RGPContactobj.BasicOSSph != '' || $scope.RGPContactobj.BasicOSCyl != '' || $scope.RGPContactobj.BasicOSAxis != ''
                || $scope.RGPContactobj.BasicOSAdd != ''

                || $scope.RGPContactobj.BasicOSDesignType != '' || $scope.RGPContactobj.BasicOSColor != '' || $scope.RGPContactobj.BasicOSProduct != ''
                || $scope.RGPContactobj.BasicOSVaDistance != '' || $scope.RGPContactobj.BasicOSVaNear != '' || $scope.RGPContactobj.BasicOSVaIntermediate != ''
                || $scope.RGPContactobj.BasicOUVaDistance != '' || $scope.RGPContactobj.BasicOUVaNear != '' || $scope.RGPContactobj.BasicOUVaIntermediate != ''
                || $scope.RGPContactobj.AdvancedFitODComfort != '' || $scope.RGPContactobj.AdvancedFitODCentration != '' || $scope.RGPContactobj.AdvancedFitODCoverage != ''
                || $scope.RGPContactobj.AdvancedFitODMovement != '' || $scope.RGPContactobj.AdvancedFitODDegrees != '' || $scope.RGPContactobj.AdvancedFitODDirection != ''
                || $scope.RGPContactobj.AdvancedFitOSComfort != '' || $scope.RGPContactobj.AdvancedFitOSCentration != '' || $scope.RGPContactobj.AdvancedFitOSCoverage != ''
                || $scope.RGPContactobj.AdvancedFitOSMovement != '' || $scope.RGPContactobj.AdvancedFitOSDegrees != '' || $scope.RGPContactobj.AdvancedFitOSDirection != ''
                || $scope.RGPContactobj.AdvancedRefractionODSph != '' || $scope.RGPContactobj.AdvancedRefractionODCyl != '' || $scope.RGPContactobj.AdvancedRefractionODAxis != ''
                || $scope.RGPContactobj.AdvancedRefractionODVaDistance != '' || $scope.RGPContactobj.AdvancedRefractionODVaNear != '' || $scope.RGPContactobj.AdvancedRefractionODVaIntermediate != ''
                || $scope.RGPContactobj.AdvancedRefractionOSSph != '' || $scope.RGPContactobj.AdvancedRefractionOSCyl != '' || $scope.RGPContactobj.AdvancedRefractionOSAxis != ''
                || $scope.RGPContactobj.AdvancedRefractionOSVaDistance != '' || $scope.RGPContactobj.AdvancedRefractionOSVaNear != '' || $scope.RGPContactobj.AdvancedRefractionOSVaIntermediate != ''
                || $scope.RGPContactobj.AdvancedRefractionOUVaDistance != '' || $scope.RGPContactobj.AdvancedRefractionOUVaNear != '' || $scope.RGPContactobj.AdvancedRefractionOUVaIntermediate != ''
            ) {
                $scope.AddNewRGPContactobj();
            } else {

            }
            if ($scope.Contactobj.BasicODDesignType != '' || $scope.Contactobj.BasicODSph != '' || $scope.Contactobj.BasicODCyl != '' || $scope.Contactobj.BasicOSSeries != '' || $scope.Contactobj.BasicODSeries != ''
                || $scope.Contactobj.BasicODAxis != '' || $scope.Contactobj.BasicODBC != '' || $scope.Contactobj.BasicODDia != ''
                || $scope.Contactobj.BasicODKeratometry != '' || $scope.Contactobj.BasicODColor != '' || $scope.Contactobj.BasicODProduct != ''
                || $scope.Contactobj.BasicODVaDistance != '' || $scope.Contactobj.BasicODVaNear != '' || $scope.Contactobj.BasicODVaIntermediate != ''
                || $scope.Contactobj.BasicOSDesignType != '' || $scope.Contactobj.BasicOSSph != '' || $scope.Contactobj.BasicOSCyl != ''
                || $scope.Contactobj.BasicOSAxis != '' || $scope.Contactobj.BasicOSBC != '' || $scope.Contactobj.BasicOSDia != ''
                || $scope.Contactobj.BasicOSKeratometry != '' || $scope.Contactobj.BasicOSColor != '' || $scope.Contactobj.BasicOSProduct != ''
                || $scope.Contactobj.BasicOSVaDistance != '' || $scope.Contactobj.BasicOSVaNear != '' || $scope.Contactobj.BasicOSVaIntermediate != ''
                || $scope.Contactobj.BasicOUVaDistance != '' || $scope.Contactobj.BasicOUVaNear != '' || $scope.Contactobj.BasicOUVaIntermediate != ''
                || $scope.Contactobj.AdvancedFitODComfort != '' || $scope.Contactobj.AdvancedFitODCentration != '' || $scope.Contactobj.AdvancedFitODCoverage != ''
                || $scope.Contactobj.AdvancedFitODMovement != '' || $scope.Contactobj.AdvancedFitODDegrees != '' || $scope.Contactobj.AdvancedFitODDirection != ''
                || $scope.Contactobj.AdvancedFitOSComfort != '' || $scope.Contactobj.AdvancedFitOSCentration != '' || $scope.Contactobj.AdvancedFitOSCoverage != ''
                || $scope.Contactobj.AdvancedFitOSMovement != '' || $scope.Contactobj.AdvancedFitOSDegrees != '' || $scope.Contactobj.AdvancedFitOSDirection != ''
                || $scope.Contactobj.AdvancedRefractionODSph != '' || $scope.Contactobj.AdvancedRefractionODCyl != '' || $scope.Contactobj.AdvancedRefractionODAxis != ''
                || $scope.Contactobj.AdvancedRefractionODVaDistance != '' || $scope.Contactobj.AdvancedRefractionODVaNear != '' || $scope.Contactobj.AdvancedRefractionODVaIntermediate != ''
                || $scope.Contactobj.AdvancedRefractionOSSph != '' || $scope.Contactobj.AdvancedRefractionOSCyl != '' || $scope.Contactobj.AdvancedRefractionOSAxis != ''
                || $scope.Contactobj.AdvancedRefractionOSVaDistance != '' || $scope.Contactobj.AdvancedRefractionOSVaNear != '' || $scope.Contactobj.AdvancedRefractionOSVaIntermediate != ''
                || $scope.Contactobj.AdvancedRefractionOUVaDistance != '' || $scope.Contactobj.AdvancedRefractionOUVaNear != '' || $scope.Contactobj.AdvancedRefractionOUVaIntermediate != ''
            ) {
                var Object = angular.copy($scope.Contactobj);
                angular.forEach($scope.obj.ContactLensDetails, function (aitem) {
                    if (aitem.InvestigationId == 2084) {

                        Object.GivenByName = GivenByName;
                        Object.CreatedDateTime = $filter('date')(new Date(), 'MM-dd-yyyy,hh:mm a');

                        if (Object.TypeName == 'Wearing') {
                            Object.TypeId = 1;
                            Object.SubInvestigationId = 1;
                            Object.SubInvestigationName = 'Wearing';
                            aitem.InvestigationDetails.push(Object);
                        }
                        if (Object.TypeName == 'Trial') {
                            Object.TypeId = 2;
                            Object.SubInvestigationId = 2;
                            Object.SubInvestigationName = 'Trial';
                            aitem.InvestigationDetails.push(Object);
                        }
                        if (Object.TypeName == 'Final') {
                            Object.TypeId = 3;
                            Object.SubInvestigationId = 3;
                            Object.SubInvestigationName = 'Final';
                            aitem.InvestigationDetails.push(Object);
                        }
                        if (Object.TypeName == 'DispensedTrial') {
                            Object.TypeId = 4;
                            Object.SubInvestigationId = 4;
                            Object.SubInvestigationName = 'DispensedTrial';
                            aitem.InvestigationDetails.push(Object);
                        }

                    }
                });
                $scope.Contactobj = angular.copy($scope.GetContactobj());
            }
            if ($scope.RGPContactobj.BasicODDesignType != '' || $scope.RGPContactobj.BasicODColor != '' || $scope.RGPContactobj.BasicODProduct != ''

                || $scope.RGPContactobj.BasicODSeries != '' || $scope.RGPContactobj.BasicODBC != '' || $scope.RGPContactobj.BasicODDia != ''
                || $scope.RGPContactobj.BasicODSph != '' || $scope.RGPContactobj.BasicODCyl != '' || $scope.RGPContactobj.BasicODAxis != ''
                || $scope.RGPContactobj.BasicODAdd != ''
                || $scope.RGPContactobj.BasicODVaDistance != '' || $scope.RGPContactobj.BasicODVaNear != '' || $scope.RGPContactobj.BasicODVaIntermediate != ''
                || $scope.RGPContactobj.BasicOSSeries != '' || $scope.RGPContactobj.BasicOSBC != '' || $scope.RGPContactobj.BasicOSDia != ''
                || $scope.RGPContactobj.BasicOSSph != '' || $scope.RGPContactobj.BasicOSCyl != '' || $scope.RGPContactobj.BasicOSAxis != ''
                || $scope.RGPContactobj.BasicOSAdd != ''

                || $scope.RGPContactobj.BasicOSDesignType != '' || $scope.RGPContactobj.BasicOSColor != '' || $scope.RGPContactobj.BasicOSProduct != ''
                || $scope.RGPContactobj.BasicOSVaDistance != '' || $scope.RGPContactobj.BasicOSVaNear != '' || $scope.RGPContactobj.BasicOSVaIntermediate != ''
                || $scope.RGPContactobj.BasicOUVaDistance != '' || $scope.RGPContactobj.BasicOUVaNear != '' || $scope.RGPContactobj.BasicOUVaIntermediate != ''
                || $scope.RGPContactobj.AdvancedFitODComfort != '' || $scope.RGPContactobj.AdvancedFitODCentration != '' || $scope.RGPContactobj.AdvancedFitODCoverage != ''
                || $scope.RGPContactobj.AdvancedFitODMovement != '' || $scope.RGPContactobj.AdvancedFitODDegrees != '' || $scope.RGPContactobj.AdvancedFitODDirection != ''
                || $scope.RGPContactobj.AdvancedFitOSComfort != '' || $scope.RGPContactobj.AdvancedFitOSCentration != '' || $scope.RGPContactobj.AdvancedFitOSCoverage != ''
                || $scope.RGPContactobj.AdvancedFitOSMovement != '' || $scope.RGPContactobj.AdvancedFitOSDegrees != '' || $scope.RGPContactobj.AdvancedFitOSDirection != ''
                || $scope.RGPContactobj.AdvancedRefractionODSph != '' || $scope.RGPContactobj.AdvancedRefractionODCyl != '' || $scope.RGPContactobj.AdvancedRefractionODAxis != ''
                || $scope.RGPContactobj.AdvancedRefractionODVaDistance != '' || $scope.RGPContactobj.AdvancedRefractionODVaNear != '' || $scope.RGPContactobj.AdvancedRefractionODVaIntermediate != ''
                || $scope.RGPContactobj.AdvancedRefractionOSSph != '' || $scope.RGPContactobj.AdvancedRefractionOSCyl != '' || $scope.RGPContactobj.AdvancedRefractionOSAxis != ''
                || $scope.RGPContactobj.AdvancedRefractionOSVaDistance != '' || $scope.RGPContactobj.AdvancedRefractionOSVaNear != '' || $scope.RGPContactobj.AdvancedRefractionOSVaIntermediate != ''
                || $scope.RGPContactobj.AdvancedRefractionOUVaDistance != '' || $scope.RGPContactobj.AdvancedRefractionOUVaNear != '' || $scope.RGPContactobj.AdvancedRefractionOUVaIntermediate != ''
            ) {

                var Object = angular.copy($scope.RGPContactobj);
                angular.forEach($scope.obj.ContactLensDetails, function (aitem) {

                    Object.GivenByName = GivenByName;
                    Object.CreatedDateTime = $filter('date')(new Date(), 'MM-dd-yyyy,hh:mm a');

                    if (aitem.InvestigationId == 2078) {
                        if (Object.TypeName == 'Wearing') {
                            Object.TypeId = 1;
                            Object.SubInvestigationId = 1;
                            Object.SubInvestigationName == 'Wearing'
                            aitem.InvestigationDetails.push(Object);
                        }
                        if (Object.TypeName == 'Trial') {
                            Object.TypeId = 2;
                            Object.SubInvestigationId = 2;
                            Object.SubInvestigationName == 'Trial'
                            aitem.InvestigationDetails.push(Object);
                        }
                        if (Object.TypeName == 'Final') {
                            Object.TypeId = 3;
                            Object.SubInvestigationId = 3;
                            Object.SubInvestigationName == 'Final'
                            aitem.InvestigationDetails.push(Object);
                        }
                        if (Object.TypeName == 'DispensedTrial') {
                            Object.TypeId = 4;
                            Object.SubInvestigationId = 4;
                            Object.SubInvestigationName = "DispensedTrial";
                            aitem.InvestigationDetails.push(Object);
                        }
                    }
                });
                $scope.RGPContactobj = angular.copy($scope.GetRGPContactobj());
            }
            if ($scope.obj.ContactLensDetails &&$scope.obj.ContactLensDetails.length > 0) {
                $scope.compareSoftLensandRGPData();
            }

            var ContactlensReq =
            {
                //"ConsultationID": $scope.cacheStorageItem.ConsultationID || 0,
                "UserId": $scope.UserId || 0,
                "AppointmentID": $scope.cacheStorageItem.appointmentid || 0,
                "ContactLensDetails": $scope.obj.ContactLensDetails || [],
                "VisitId": $scope.cacheStorageItem.PatientVisitId,
                "Logs": {}

            }
            if ($scope.LogObj.LogArray.length > 0) {
                ContactlensReq.Logs = $scope.LogObj || {};
            }
            eHnotePatientDataService.AddUpdateContactLensDetails(ContactlensReq).then(function (resp) {
                if (resp.data.Status == "Success") {
                    alertify.success("Saved Successfully");
                    $scope.IsClickSaveContactLensBtn = false;
                    $uibModalInstance.close($scope.obj);

                }
                else {
                    $scope.IsClickSaveContactLensBtn = false;
                    alertify.error('save is failed');
                }
                
            });

           
        }
    

        $scope.DelectSelectedItem = function (mainitem, Aitem) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to delete this values?", function () {
                var index = mainitem.InvestigationDetails.indexOf(Aitem);
                if (Aitem.ContactLensDetailId === 0) {
                    if (index > -1) {
                        mainitem.InvestigationDetails.splice(index, 1);
                    }
                } else {
                    mainitem.InvestigationDetails[index].DeleteInd = 'Y';
                }

                $scope.$digest();
            }, function () {
                r = "";
            });
        };



        function getRequiredObject(type) {
            if (type == 'ODSph') {
                $scope.SphericalMinusList = GetSphericalMinusList();
            }
            else if (type == 'ODCyl' || type == 'OSCyl') {
                $scope.CylMinusList = GetCylMinusList();
            }
            else if (type == 'ODAxis' || type == 'OSAxis' || type == 'AODAxis' || type == 'AOSAxis') {
                $scope.AdvanceAxisPlusList = GetAxisPlusList();
                $scope.AxisPlusList = GetAxisPlusList();
            }
            else if (type == 'ODAdd' || type == 'OSAdd' || type == 'AODAdd' || type == 'AOSAdd') {
                $scope.AddtionList = GetAddtionList();
                $scope.AdvanceAddtionList = GetAddtionList();
            }
            else if (type == 'ODBC' || type == 'OSBC') {
                $scope.BCList = GetBCList();
            }
            else if (type == 'ODDia' || type == 'OSDia') {

                $scope.DiaList = GetDiaList();
            }
            else if (type == 'ODDist' || type == 'OSDist' || type == 'OUDist' || type == 'AODVAD' || type == 'AOSVAD' || type == 'AOUVAN') {
                $scope.DistanceList = GetDistanceList();
                $scope.AdvanceDistanceList = GetDistanceList();
                $scope.AdvanceNearList = GetDistanceList();
                $scope.AdvanceIntermediateList = GetDistanceList();
            }
            else if (type == 'ODNear' || type == 'OSNear' || type == 'OUNear' || type == 'AOUVAD' || type == 'AODVAN' || type == 'AOSVAN') {
                $scope.NearList = GetDistanceList();
                $scope.AdvanceDistanceList = GetDistanceList();
                $scope.AdvanceNearList = GetDistanceList();
                $scope.AdvanceIntermediateList = GetDistanceList();
            }
            else if (type == 'ODInter' || type == 'OSInter' || type == 'OUInter' || type == 'AODVAI' || type == 'AOSVAI' || type == 'AOUVAI') {
                $scope.IntermediateList = GetDistanceList();
                $scope.AdvanceDistanceList = GetDistanceList();
                $scope.AdvanceNearList = GetDistanceList();
                $scope.AdvanceIntermediateList = GetDistanceList();
            }
            else if (type == 'OSSph') {
                $scope.CLSphericalListBoth = GetSphericalBothList();
            }
            else if (type == 'OSCyl' || type == 'AODCyl' || type == 'AOSCyl') {
                $scope.CLCylindricalListBoth = GetCylBothList();
            }
            else if (type == 'AODComfort' || type == 'AOSComfort') {
                $scope.CLComfortList = GetComfortList();
            }
            else if (type == 'AODCent' || type == 'AOSCent') {
                $scope.CLCentrationList = GetCentrationList();
            }
            else if (type == 'AODCover' || type == 'AOSCover') {
                $scope.CLCoverageList = GetCoverageList();
            }
            else if (type == 'AODMove' || type == 'AOSMove') {
                $scope.MovementList = GetMovementList();
            }
            else if (type == 'AODDegree' || type == 'AOSDegree') {
                $scope.DegreesList = GetDegreesList();
            }
            else if (type == 'AODDirect' || type == 'AOSDirect') {
                $scope.CLDirectionList = GetDirectionList();
            }
            else if (type == 'AODSph' || type == 'AOSSph') {
                $scope.CLSphericalListBoth = GetSphericalBothList();
            }
            else if (type == 'AODSph' || type == 'AOSSph') {
                $scope.CLSphericalListBoth = GetSphericalBothList();
            }
            $scope.AdvanceSphericalPlusList = GetSphericalPlusList();
            $scope.AdvanceSphericalMinusList = GetSphericalMinusList();
            $scope.AdvanceAddtionList = GetAddtionList();
        }

        /*Soft start*/       
        $scope.ChangeSelectedEye = function (Eyetype, item,type) {
            item = item || "";
            type = type || "";
            $scope.Contactobj.SelectedEye = Eyetype;  
            getRequiredObject(type)         
           
            if ($scope.AdvanceIntermediateList && $scope.AdvanceIntermediateList.length > 0) {
                angular.forEach($scope.AdvanceIntermediateList, function (aitem) {
                    aitem.selected = false;
                });
            }
            if ($scope.AdvanceNearList && $scope.AdvanceNearList.length > 0) {
                angular.forEach($scope.AdvanceNearList, function (aitem) {
                    aitem.selected = false;
                });
            }
            if ($scope.AdvanceDistanceList && $scope.AdvanceDistanceList.length > 0) {
                angular.forEach($scope.AdvanceDistanceList, function (aitem) {
                    aitem.selected = false;
                });
            }
            if ($scope.AdvanceAddtionList && $scope.AdvanceAddtionList.length > 0) {
                angular.forEach($scope.AdvanceAddtionList, function (aitem) {
                    aitem.selected = false;
                });
            }
            if ($scope.AdvanceAxisPlusList && $scope.AdvanceAxisPlusList.length > 0) {
                angular.forEach($scope.AdvanceAxisPlusList, function (aitem) {
                    aitem.selected = false;
                });
            }          
            if ($scope.AdvanceCylMinusList &&  $scope.AdvanceCylMinusList.length > 0) {
                angular.forEach($scope.AdvanceCylMinusList, function (aitem) {
                    aitem.selected = false;
                });
            }
            if ($scope.SphericalPlusList && $scope.SphericalPlusList.length > 0) {
                angular.forEach($scope.SphericalPlusList, function (aitem) {
                    aitem.selected = false;
                });
            }
            if ($scope.AdvanceSphericalMinusList && $scope.AdvanceSphericalMinusList.length > 0) {
                angular.forEach($scope.AdvanceSphericalMinusList, function (aitem) {
                    aitem.selected = false;
                });
            }
            if ($scope.CLDirectionList && $scope.CLDirectionList.length > 0) {
                angular.forEach($scope.CLDirectionList, function (aitem) {
                    aitem.selected = false;
                });
            }
            if ($scope.DegreesList && $scope.DegreesList.length > 0) {
                angular.forEach($scope.DegreesList, function (aitem) {
                    aitem.selected = false;
                });
            }
            if ($scope.MovementList && $scope.MovementList.length > 0) {
                angular.forEach($scope.MovementList, function (aitem) {
                    aitem.selected = false;
                });
            }
            if ($scope.CLCoverageList && $scope.CLCoverageList.length > 0) {
                angular.forEach($scope.CLCoverageList, function (aitem) {
                    aitem.selected = false;
                });
            }
            if ($scope.CLCentrationList && $scope.CLCentrationList.length > 0) {
                angular.forEach($scope.CLCentrationList, function (aitem) {
                    aitem.selected = false;
                });
            }
            if ($scope.CLComfortList &&  $scope.CLComfortList.length > 0) {
                angular.forEach($scope.CLComfortList, function (aitem) {
                    aitem.selected = false;
                });
            }
            if ($scope.IntermediateList &&   $scope.IntermediateList.length > 0) {
                angular.forEach($scope.IntermediateList, function (aitem) {
                    aitem.selected = false;
                });
            }
            if ($scope.NearList && $scope.NearList.length > 0) {
                angular.forEach($scope.NearList, function (aitem) {
                    aitem.selected = false;
                });
            }
            if ($scope.DistanceList && $scope.DistanceList.length > 0) {
                angular.forEach($scope.DistanceList, function (aitem) {
                    aitem.selected = false;
                });
            }
            if ($scope.BCList && $scope.BCList.length > 0) {
                angular.forEach($scope.BCList, function (aitem) {
                    aitem.selected = false;
                });
            }
            if ($scope.DiaList && $scope.DiaList.length > 0) {
                angular.forEach($scope.DiaList, function (aitem) {
                    aitem.selected = false;
                });
            }
            if ($scope.CylMinusList && $scope.CylMinusList.length > 0) {
                angular.forEach($scope.CylMinusList, function (aitem) {
                    aitem.selected = false;
                });
            }
            if ($scope.AxisPlusList && $scope.AxisPlusList.length > 0) {
                angular.forEach($scope.AxisPlusList, function (aitem) {
                    aitem.selected = false;
                });
            }
            if ($scope.AddtionList && $scope.AddtionList.length > 0) {
                angular.forEach($scope.AddtionList, function (aitem) {
                    aitem.selected = false;
                });
            }
            if ($scope.SphericalMinusList &&  $scope.SphericalMinusList.length > 0) {
                angular.forEach($scope.SphericalMinusList, function (aitem) {
                    aitem.selected = false;
                });
            }
            if ($scope.FilterProductlist && $scope.FilterProductlist.length > 0) {
                angular.forEach($scope.FilterProductlist, function (aitem) {
                    aitem.selected = false;
                });
            }
            if ($scope.BrandsMainarray && $scope.BrandsMainarray.length > 0) {
                angular.forEach($scope.BrandsMainarray, function (aitem) {
                    aitem.selected = false;
                });
            }
            if ($scope.MainColorlist  && $scope.MainColorlist.length > 0) {
                angular.forEach($scope.MainColorlist, function (aitem) {
                    aitem.selected = false; 
                });
            }
            //getRefreshedObjects(type)
            if ($scope.FilterProductlist.length > 0 && (type == 'ODProd'|| type == 'OSProd')){
                angular.forEach($scope.FilterProductlist, function (bitem) {
                    bitem.selected = false;
                });
            }
            if ($scope.BrandsMainarray.length > 0 && (type == 'ODSeri' || type == 'OSSeri')){
                angular.forEach($scope.BrandsMainarray, function (bitem) {
                    bitem.selected = false;
                });
            }
            if ($scope.MainColorlist.length > 0 && (type == 'ODColor' || type == 'OSColor')) {
                angular.forEach($scope.MainColorlist, function (bitem) {
                    bitem.selected = false;
                });
            }
            if (item != "") {
                if (item.ContactLensMasterID == 22 || item.ContactLensMasterID == 23 || item.ContactLensMasterID == 26 || item.ContactLensMasterID == 33 || item.ContactLensMasterID == 34 || item.ProductName == 'ABB') {
                    $scope.FilterBrandlist = [];
                    angular.forEach($scope.BrandsMainarray, function (bitem) {
                        if (bitem.ContactLensMasterID == item.ContactLensMasterID) {
                            var obj = {
                                "ContactLensMasterID": bitem.ContactLensMasterID || 0,
                                //"ProductId": item.ProductId || 0,
                                "ProductName": bitem.ProductName || "",
                                "BrandId": bitem.BrandId || 0,
                                "Value": bitem.Value || "",
                                "BaseCurve": bitem.BaseCurve || "",
                                "Diameter": bitem.Diameter || "",
                                "selected": bitem.selected || false,

                            }
                            $scope.FilterBrandlist.push(obj);
                        }

                    });
                    if (item.BrandId !== undefined) {
                        if ($scope.FilterBrandlist.length > 0 && type === "ODSeri") {
                            angular.forEach($scope.FilterBrandlist, function (fitem) {
                                if (fitem.BrandId == item.BrandId) {
                                    //if (Eyetype == 'OD') {
                                        $scope.Contactobj.BasicODBC = fitem.BaseCurve;
                                        $scope.Contactobj.BasicODDia = fitem.Diameter;
                                        $scope.Contactobj.BasicODSeries = '';
                                        $scope.Contactobj.BasicODSeries = item.Value;
                                    /*}*/ 
                                }
                            });
                        }
                        if ($scope.FilterBrandlist.length > 0 && type === "OSSeri") {
                            angular.forEach($scope.FilterBrandlist, function (fitem) {
                                if (fitem.BrandId == item.BrandId) {
                                 
                                        $scope.Contactobj.BasicOSBC = fitem.BaseCurve;
                                        $scope.Contactobj.BasicOSDia = fitem.Diameter;
                                        $scope.Contactobj.BasicOSSeries = '';
                                        $scope.Contactobj.BasicOSSeries = item.Value;
                                    
                                }
                            });
                        }
                    }
                    if (Eyetype == 'OD') {
                        $scope.Contactobj.BasicODProduct = ''
                        $scope.Contactobj.BasicODProduct = item.ProductName
                    }
                    if (Eyetype == 'OS') {
                        $scope.Contactobj.BasicOSProduct = ''
                        $scope.Contactobj.BasicOSProduct = item.ProductName
                    }
                }
            }
            else {
                if ($scope.ProductsMainarray.length > 0) {
                    $scope.FilterProductlist = angular.copy($scope.ProductsMainarray);
                }
                if ($scope.BrandsMainarray.length > 0) {
                    $scope.FilterBrandlist = angular.copy($scope.BrandsMainarray);
                }
                //if (type == 'ODSeri') {
                //    $scope.CLFocusObj.ODSeries = true;
                //}
                if (type == 'ODProd') {
                    if (Eyetype == 'OD') {
                        $scope.Contactobj.BasicODSeries = '';
                    } 
                }
                else if (type == 'OSProd') {
                    if (Eyetype == 'OS') {
                            $scope.Contactobj.BasicOSSeries = '';
                    }
                }
            }

            var Design = "";
            var Sph = "";
            var Cyl = "";
            var Axis = "";
            var ADD = "";
            var BC = "";
            var Dia = "";
            var Kerato = "";
            var Color = "";
            var Prod = "";
            var Dist = "";
            var Near = "";
            var Inter = "";
            var AComfort = "";
            var ACent = "";
            var ACover = "";
            var AMove = "";
            var ADegree = "";
            var ADirect = "";
            var ASph = "";
            var ACyl = "";
            var AAxis = "";
            var AAdd = "";
            var ADist = "";
            var ANear = "";
            var AInter = "";
            var Series = "";
            if (Eyetype == "OD") {
                Design = $scope.Contactobj.BasicODDesignType || "";
                Sph = $scope.Contactobj.BasicODSph || "";
                Cyl = $scope.Contactobj.BasicODCyl || "";
                Axis = $scope.Contactobj.BasicODAxis || "";
                ADD = $scope.Contactobj.BasicODAdd || "";
                BC = $scope.Contactobj.BasicODBC || "";
                Dia = $scope.Contactobj.BasicODDia || "";
                Kerato = $scope.Contactobj.BasicODKeratometry || "";
                Color = $scope.Contactobj.BasicODColor || "";
                Prod = $scope.Contactobj.BasicODProduct || "";
                Series = $scope.Contactobj.BasicODSeries || "";
                Dist = $scope.Contactobj.BasicODVaDistance || "";
                Near = $scope.Contactobj.BasicODVaNear || "";
                Inter = $scope.Contactobj.BasicODVaIntermediate || "";
                AComfort = $scope.Contactobj.AdvancedFitODComfort || "";
                ACent = $scope.Contactobj.AdvancedFitODCentration || "";
                ACover = $scope.Contactobj.AdvancedFitODCoverage || "";
                AMove = $scope.Contactobj.AdvancedFitODMovement || "";
                ADegree = $scope.Contactobj.AdvancedFitODDegrees || "";
                ADirect = $scope.Contactobj.AdvancedFitODDirection || "";
                ASph = $scope.Contactobj.AdvancedRefractionODSph || "";
                ACyl = $scope.Contactobj.AdvancedRefractionODCyl || "";
                AAxis = $scope.Contactobj.AdvancedRefractionODAxis || "";
                AAdd = $scope.Contactobj.AdvancedRefractionODAdd || "";
                ADist = $scope.Contactobj.AdvancedRefractionODVaDistance || "";
                ANear = $scope.Contactobj.AdvancedRefractionODVaNear || "";
                AInter = $scope.Contactobj.AdvancedRefractionODVaIntermediate || "";
            }
            else if (Eyetype == "OS") {
                Design = $scope.Contactobj.BasicOSDesignType || "";
                Sph = $scope.Contactobj.BasicOSSph || "";
                Cyl = $scope.Contactobj.BasicOSCyl || "";
                Axis = $scope.Contactobj.BasicOSAxis || "";
                ADD = $scope.Contactobj.BasicOSAdd || "";
                BC = $scope.Contactobj.BasicOSBC || "";
                Dia = $scope.Contactobj.BasicOSDia || "";
                Kerato = $scope.Contactobj.BasicOSKeratometry || "";
                Color = $scope.Contactobj.BasicOSColor || "";
                Prod = $scope.Contactobj.BasicOSProduct || "";
                Series = $scope.Contactobj.BasicOSSeries || "";
                Dist = $scope.Contactobj.BasicOSVaDistance || "";
                Near = $scope.Contactobj.BasicOSVaNear || "";
                Inter = $scope.Contactobj.BasicOSVaIntermediate || "";
                AComfort = $scope.Contactobj.AdvancedFitOSComfort || "";
                ACent = $scope.Contactobj.AdvancedFitOSCentration || "";
                ACover = $scope.Contactobj.AdvancedFitOSCoverage || "";
                AMove = $scope.Contactobj.AdvancedFitOSMovement || "";
                ADegree = $scope.Contactobj.AdvancedFitOSDegrees || "";
                ADirect = $scope.Contactobj.AdvancedFitOSDirection || "";
                ASph = $scope.Contactobj.AdvancedRefractionOSSph || "";
                ACyl = $scope.Contactobj.AdvancedRefractionOSCyl || "";
                AAxis = $scope.Contactobj.AdvancedRefractionOSAxis || "";
                AAdd = $scope.Contactobj.AdvancedRefractionOSAdd || "";
                ADist = $scope.Contactobj.AdvancedRefractionOSVaDistance || "";
                ANear = $scope.Contactobj.AdvancedRefractionOSVaNear || "";
                AInter = $scope.Contactobj.AdvancedRefractionOSVaIntermediate || "";
            } else {
                Dist = $scope.Contactobj.BasicOUVaDistance || "";
                Near = $scope.Contactobj.BasicOUVaNear || "";
                Inter = $scope.Contactobj.BasicOUVaIntermediate || "";
                ADist = $scope.Contactobj.AdvancedRefractionOUVaDistance || "";
                ANear = $scope.Contactobj.AdvancedRefractionOUVaNear || "";
                AInter = $scope.Contactobj.AdvancedRefractionOUVaIntermediate || "";
            }

            if (Design != "") {
                var filter = $filter("filter")($scope.CLDesignTypeList, { "Value": Design }, true) || [];
                if (filter.length > 0) {
                    filter[0].selected = true;
                }
            }
            if (Sph != "") {
                $scope.Contactobj.SphericalSwitch = 2;
                var filter = $filter("filter")($scope.SphericalPlusList, { "Value": Sph }, true) || [];
                if (filter.length > 0) {
                    filter[0].selected = true;
                    $scope.Contactobj.SphericalSwitch = 1;
                }
                var filter1 = $filter("filter")($scope.SphericalMinusList, { "Value": Sph }, true) || [];
                if (filter1.length > 0) {
                    filter1[0].selected = true;
                    $scope.Contactobj.SphericalSwitch = 2;
                }
            }
            if (Cyl != "") {
                $scope.Contactobj.CylindricalSwitch = 2;
                var filter = $filter("filter")($scope.CylPlusList, { "Value": Cyl }, true) || [];
                if (filter.length > 0) {
                    filter[0].selected = true;
                    $scope.Contactobj.CylindricalSwitch = 1;
                }
                var filter1 = $filter("filter")($scope.CylMinusList, { "Value": Cyl }, true) || [];
                if (filter1.length > 0) {
                    filter1[0].selected = true;
                    $scope.Contactobj.CylindricalSwitch = 2;
                }
            }
            if (Axis != "") {
                var filter = $filter("filter")($scope.AxisPlusList, { "Value": Axis }, true) || [];
                if (filter.length > 0) {
                    filter[0].selected = true;
                }
            }
            if (ADD != "") {
                var filter = $filter("filter")($scope.AddtionList, { "Value": ADD }, true) || [];
                if (filter.length > 0) {
                    filter[0].selected = true;
                }
            }
            if (BC != "") {
                var filter = $filter("filter")($scope.BCList, { "Value": Number(BC) }, true) || [];
                if (filter.length > 0) {
                    filter[0].selected = true;
                }
            }
            if (Dia != "") {
                var filter = $filter("filter")($scope.DiaList, { "Value": Number(Dia) }, true) || [];
                if (filter.length > 0) {
                    filter[0].selected = true;
                }
            }
            if (Kerato != "") {
                var filter = $filter("filter")($scope.KeratometryList, { "Value": Kerato }, true) || [];
                if (filter.length > 0) {
                    filter[0].selected = true;
                }
            }
            if (Color != "") {
                var filter = $filter("filter")($scope.MainColorlist, { "Value": Color }, true) || [];
                if (filter.length > 0) {
                    filter[0].selected = true;
                }
            }
            if (Prod != "") {
                var filter = $filter("filter")($scope.FilterProductlist, { "Value": Prod }, true) || [];
                if (filter.length > 0) {
                    filter[0].selected = true;
                }
            }
            if (Series != "") {
                var filter = $filter("filter")($scope.BrandsMainarray, { "Value": Series }, true) || [];
                if (filter.length > 0) {
                    filter[0].selected = true;
                }
            }
            if (Dist != "") {
                var filter = $filter("filter")($scope.DistanceList, { "Value": Dist }, true) || [];
                if (filter.length > 0) {
                    filter[0].selected = true;
                }
            }
            if (Near != "") {
                var filter = $filter("filter")($scope.NearList, { "Value": Near }, true) || [];
                if (filter.length > 0) {
                    filter[0].selected = true;
                }
            }
            if (Inter != "") {
                var filter = $filter("filter")($scope.IntermediateList, { "Value": Inter }, true) || [];
                if (filter.length > 0) {
                    filter[0].selected = true;
                }
            }
            if (AComfort != "") {
                var filter = $filter("filter")($scope.CLComfortList, { "Value": AComfort }, true) || [];
                if (filter.length > 0) {
                    filter[0].selected = true;
                }
            }
            if (ACent != "") {
                var filter = $filter("filter")($scope.CLCentrationList, { "Value": ACent }, true) || [];
                if (filter.length > 0) {
                    filter[0].selected = true;
                }
            }
            if (ACover != "") {
                var filter = $filter("filter")($scope.CLCoverageList, { "Value": ACover }, true) || [];
                if (filter.length > 0) {
                    filter[0].selected = true;
                }
            }
            if (AMove != "") {
                var filter = $filter("filter")($scope.MovementList, { "Value": AMove }, true) || [];
                if (filter.length > 0) {
                    filter[0].selected = true;
                }
            }
            if (ADegree != "") {
                var filter = $filter("filter")($scope.DegreesList, { "Value": ADegree }, true) || [];
                if (filter.length > 0) {
                    filter[0].selected = true;
                }
            }
            if (ADirect != "") {
                var filter = $filter("filter")($scope.CLDirectionList, { "Value": ADirect }, true) || [];
                if (filter.length > 0) {
                    filter[0].selected = true;
                }
            }
            if (ASph != "") {
                var filter = $filter("filter")($scope.AdvanceSphericalPlusList, { "Value": ASph }, true) || [];
                if (filter.length > 0) {
                    filter[0].selected = true;
                    $scope.Contactobj.SphericalSwitch = 1;
                }
                var filter1 = $filter("filter")($scope.AdvanceSphericalMinusList, { "Value": ASph }, true) || [];
                if (filter1.length > 0) {
                    filter1[0].selected = true;
                    $scope.Contactobj.SphericalSwitch = 2;
                }
            }
            if (ACyl != "") {
                $scope.Contactobj.CylindricalSwitch = 2;
                var filter1 = $filter("filter")($scope.AdvanceCylMinusList, { "Value": ACyl }, true) || [];
                if (filter1.length > 0) {
                    filter1[0].selected = true;
                    $scope.Contactobj.CylindricalSwitch = 2;
                }
            }
            if (AAxis != "") {
                var filter = $filter("filter")($scope.AdvanceAxisPlusList, { "Value": AAxis }, true) || [];
                if (filter.length > 0) {
                    filter[0].selected = true;
                }
            }
            if (AAdd != "") {
                var filter = $filter("filter")($scope.AdvanceAddtionList, { "Value": AAdd }, true) || [];
                if (filter.length > 0) {
                    filter[0].selected = true;
                }
            }
            if (ADist != "") {
                var filter = $filter("filter")($scope.AdvanceDistanceList, { "Value": ADist }, true) || [];
                if (filter.length > 0) {
                    filter[0].selected = true;
                }
            }
            if (ANear != "") {
                var filter = $filter("filter")($scope.AdvanceNearList, { "Value": ANear }, true) || [];
                if (filter.length > 0) {
                    filter[0].selected = true;
                }
            }
            if (AInter != "") {
                var filter = $filter("filter")($scope.AdvanceIntermediateList, { "Value": AInter }, true) || [];
                if (filter.length > 0) {
                    filter[0].selected = true;
                }
            }

           
            if (item != '' && type == 'ODSeri') {
                if ($scope.Contactobj.BasicODBC == '') {
                    if (type == 'ODSeri') {
                        setCLFocus('ODBC');
                    }
                } else {
                    setCLFocus('ODColor');
                }
            }
           
            //if (item != '') {
            //    if (type == 'OSProd') {
            //        $scope.CLFocusObj = $scope.GetCLFocusObj();
            //        $scope.CLFocusObj.OSSeries = true;
            //    }
            //}
            if (item != '' && type == 'OSSeri') {
                if ($scope.Contactobj.BasicOSBC == '') {
                    if (type == 'OSSeri') {
                        setCLFocus('OSBC');
                    }
                } else {
                    setCLFocus('OSColor');
                }
            }
           


        }

        $scope.changeSelectedItem = function (item, arrayList, Eye, head, Subtab) {
            if (Subtab == 1) {
                angular.forEach(arrayList, function (aitem) {
                    aitem.selected = false;
                });
                if (Eye == "OD") {
                    if (head == "Sph") {
                        $scope.Contactobj.BasicODSph = item.Value;
                        item.selected = true;
                    }
                    if (head == 'Cyl') {
                        $scope.Contactobj.BasicODCyl = item.Value;
                        item.selected = true;
                    }
                    if (head == 'Axis') {
                        $scope.Contactobj.BasicODAxis = item.Value;
                        item.selected = true;
                    }
                    if (head == 'Add') {
                        $scope.Contactobj.BasicODAdd = item.Value;
                        item.selected = true;
                    }
                    if (head == 'BC') {
                        $scope.Contactobj.BasicODBC = item.Value;
                        item.selected = true;
                    }
                    if (head == 'Dia') {
                        $scope.Contactobj.BasicODDia = item.Value;
                        item.selected = true;
                    }
                    if (head == 'Keratometry') {
                        $scope.Contactobj.BasicODKeratometry = item.Value;
                        item.selected = true;
                    }
                    if (head == 'VaDistance') {
                        $scope.Contactobj.BasicODVaDistance = item.Value;
                        item.selected = true;
                    }
                    if (head == 'VaNear') {
                        $scope.Contactobj.BasicODVaNear = item.Value;
                        item.selected = true;
                    }
                    if (head == 'VaIntermediate') {
                        $scope.Contactobj.BasicODVaIntermediate = item.Value;
                        item.selected = true;
                    }
                    if (head == 'Movement') {
                        $scope.Contactobj.AdvancedFitODMovement = item.Value;
                        item.selected = true;
                    }
                    if (head == 'Degrees') {
                        $scope.Contactobj.AdvancedFitODDegrees = item.Value;
                        item.selected = true;
                    }
                }
                if (Eye == "OS") {
                    if (head == "Sph") {
                        $scope.Contactobj.BasicOSSph = item.Value;
                        item.selected = true;
                    }
                    if (head == 'Cyl') {
                        $scope.Contactobj.BasicOSCyl = item.Value;
                        item.selected = true;
                    }
                    if (head == 'Axis') {
                        $scope.Contactobj.BasicOSAxis = item.Value;
                        item.selected = true;
                    }
                    if (head == 'Add') {
                        $scope.Contactobj.BasicOSAdd = item.Value;
                        item.selected = true;
                    }
                    if (head == 'BC') {
                        $scope.Contactobj.BasicOSBC = item.Value;
                        item.selected = true;
                    }
                    if (head == 'Dia') {
                        $scope.Contactobj.BasicOSDia = item.Value;
                        item.selected = true;
                    }
                    if (head == 'Keratometry') {
                        $scope.Contactobj.BasicOSKeratometry = item.Value;
                        item.selected = true;
                    }
                    if (head == 'VaDistance') {
                        $scope.Contactobj.BasicOSVaDistance = item.Value;
                        item.selected = true;
                    }
                    if (head == 'VaNear') {
                        $scope.Contactobj.BasicOSVaNear = item.Value;
                        item.selected = true;
                    }
                    if (head == 'VaIntermediate') {
                        $scope.Contactobj.BasicOSVaIntermediate = item.Value;
                        item.selected = true;
                    }
                    if (head == 'Movement') {
                        $scope.Contactobj.AdvancedFitOSMovement = item.Value;
                        item.selected = true;
                    }
                    if (head == 'Degrees') {
                        $scope.Contactobj.AdvancedFitOSDegrees = item.Value;
                        item.selected = true;
                    }
                }
                if (Eye == "OU") {
                    if (head == 'VaDistance') {
                        $scope.Contactobj.BasicOUVaDistance = item.Value;
                        item.selected = true;
                    }
                    if (head == 'VaNear') {
                        $scope.Contactobj.BasicOUVaNear = item.Value;
                        item.selected = true;
                    }
                    if (head == 'VaIntermediate') {
                        $scope.Contactobj.BasicOUVaIntermediate = item.Value;
                        item.selected = true;
                    }
                }
            }
            if (Subtab == 2) {
                angular.forEach(arrayList, function (aitem) {
                    aitem.selected = false;
                });
                if (Eye == "OD") {
                    if (head == "Sph") {
                        $scope.Contactobj.AdvancedRefractionODSph = item.Value;
                        item.selected = true;
                    }
                    if (head == 'Cyl') {
                        $scope.Contactobj.AdvancedRefractionODCyl = item.Value;
                        item.selected = true;
                    }
                    if (head == 'Axis') {
                        $scope.Contactobj.AdvancedRefractionODAxis = item.Value;
                        item.selected = true;
                    }
                    if (head == 'Add') {
                        $scope.Contactobj.AdvancedRefractionODAdd = item.Value;
                        item.selected = true;
                    }
                    if (head == 'VaDistance') {
                        $scope.Contactobj.AdvancedRefractionODVaDistance = item.Value;
                        item.selected = true;
                    }
                    if (head == 'VaNear') {
                        $scope.Contactobj.AdvancedRefractionODVaNear = item.Value;
                        item.selected = true;
                    }
                    if (head == 'VaIntermediate') {
                        $scope.Contactobj.AdvancedRefractionODVaIntermediate = item.Value;
                        item.selected = true;
                    }
                    if (head == 'Movement') {
                        $scope.Contactobj.AdvancedFitODMovement = item.Value;
                        item.selected = true;
                    }
                    if (head == 'Degrees') {
                        $scope.Contactobj.AdvancedFitODDegrees = item.Value;
                        item.selected = true;
                    }
                }
                if (Eye == "OS") {
                    if (head == "Sph") {
                        $scope.Contactobj.AdvancedRefractionOSSph = item.Value;
                        item.selected = true;
                    }
                    if (head == 'Cyl') {
                        $scope.Contactobj.AdvancedRefractionOSCyl = item.Value;
                        item.selected = true;
                    }
                    if (head == 'Axis') {
                        $scope.Contactobj.AdvancedRefractionOSAxis = item.Value;
                        item.selected = true;
                    }
                    if (head == 'Add') {
                        $scope.Contactobj.AdvancedRefractionOSAdd = item.Value;
                        item.selected = true;
                    }
                    if (head == 'VaDistance') {
                        $scope.Contactobj.AdvancedRefractionOSVaDistance = item.Value;
                        item.selected = true;
                    }
                    if (head == 'VaNear') {
                        $scope.Contactobj.AdvancedRefractionOSVaNear = item.Value;
                        item.selected = true;
                    }
                    if (head == 'VaIntermediate') {
                        $scope.Contactobj.AdvancedRefractionOSVaIntermediate = item.Value;
                        item.selected = true;
                    }
                    if (head == 'Movement') {
                        $scope.Contactobj.AdvancedFitOSMovement = item.Value;
                        item.selected = true;
                    }
                    if (head == 'Degrees') {
                        $scope.Contactobj.AdvancedFitOSDegrees = item.Value;
                        item.selected = true;
                    }
                }
                if (Eye == "OU") {
                    if (head == 'VaDistance') {
                        $scope.Contactobj.AdvancedRefractionOUVaDistance = item.Value;
                        item.selected = true;
                    }
                    if (head == 'VaNear') {
                        $scope.Contactobj.AdvancedRefractionOUVaNear = item.Value;
                        item.selected = true;
                    }
                    if (head == 'VaIntermediate') {
                        $scope.Contactobj.AdvancedRefractionOUVaIntermediate = item.Value;
                        item.selected = true;
                    }
                }
            }
        }

        $scope.changeitem = function (item, Eye, type, arrayList) {

            angular.forEach(arrayList, function (aitem) {
                aitem.selected = false;
            });

            if (Eye == "OD") {
                if (type == 'DesignType') {
                    $scope.Contactobj.BasicODDesignType = item.Value || '';
                    item.selected = true;
                }
                if (type == 'Color') {
                    $scope.Contactobj.BasicODColor = item.Value || '';
                    item.selected = true;
                }
                if (type == 'Product') {
                    $scope.Contactobj.BasicODProduct = item.Value || '';
                    item.selected = true;
                }
                if (type == 'Series') {
                    $scope.Contactobj.BasicODSeries = item.Value || '';
                    item.selected = true;
                }
                if (type == 'Comfort') {
                    $scope.Contactobj.AdvancedFitODComfort = item.Value || '';
                    item.selected = true;
                }
                if (type == 'Centration') {
                    $scope.Contactobj.AdvancedFitODCentration = item.Value || '';
                    item.selected = true;
                }
                if (type == 'Coverage') {
                    $scope.Contactobj.AdvancedFitODCoverage = item.Value || '';
                    item.selected = true;
                }
                if (type == 'Direction') {
                    $scope.Contactobj.AdvancedFitODDirection = item.Value || '';
                    item.selected = true;
                }
                if (type == 'Movement') {
                    $scope.Contactobj.AdvancedFitODMovement = item.Value || '';
                    item.selected = true;
                }
                if (type == 'Degrees') {
                    $scope.Contactobj.AdvancedFitODDegrees = item.Value || '';
                    item.selected = true;
                }
            }
            if (Eye == "OS") {
                if (type == 'DesignType') {
                    $scope.Contactobj.BasicOSDesignType = item.Value || '';
                    item.selected = true;
                }
                if (type == 'Color') {
                    $scope.Contactobj.BasicOSColor = item.Value || '';
                    item.selected = true;
                }
                if (type == 'Product') {
                    $scope.Contactobj.BasicOSProduct = item.Value || '';
                    item.selected = true;
                }
                if (type == 'Series') {
                    $scope.Contactobj.BasicOSSeries = item.Value || '';
                    item.selected = true;
                }
                if (type == 'Comfort') {
                    $scope.Contactobj.AdvancedFitOSComfort = item.Value || '';
                    item.selected = true;
                }
                if (type == 'Centration') {
                    $scope.Contactobj.AdvancedFitOSCentration = item.Value || '';
                    item.selected = true;
                }
                if (type == 'Coverage') {
                    $scope.Contactobj.AdvancedFitOSCoverage = item.Value || '';
                    item.selected = true;
                }
                if (type == 'Direction') {
                    $scope.Contactobj.AdvancedFitOSDirection = item.Value || '';
                    item.selected = true;
                }
                if (type == 'Movement') {
                    $scope.Contactobj.AdvancedFitOSMovement = item.Value || '';
                    item.selected = true;
                }
                if (type == 'Degrees') {
                    $scope.Contactobj.AdvancedFitOSDegrees = item.Value || '';
                    item.selected = true;
                }
            }

        }

        $scope.CopyODtoOS = function (subLenstab, type) {
            if (subLenstab == 1) {
                $scope.Contactobj.BasicOSDesignType = angular.copy($scope.Contactobj.BasicODDesignType);
                $scope.Contactobj.BasicOSSph = angular.copy($scope.Contactobj.BasicODSph);
                $scope.Contactobj.BasicOSCyl = angular.copy($scope.Contactobj.BasicODCyl);
                $scope.Contactobj.BasicOSAxis = angular.copy($scope.Contactobj.BasicODAxis);
                $scope.Contactobj.BasicOSAdd = angular.copy($scope.Contactobj.BasicODAdd);
                $scope.Contactobj.BasicOSBC = angular.copy($scope.Contactobj.BasicODBC);
                $scope.Contactobj.BasicOSDia = angular.copy($scope.Contactobj.BasicODDia);
                $scope.Contactobj.BasicOSKeratometry = angular.copy($scope.Contactobj.BasicODKeratometry);
                $scope.Contactobj.BasicOSColor = angular.copy($scope.Contactobj.BasicODColor);
                $scope.Contactobj.BasicOSProduct = angular.copy($scope.Contactobj.BasicODProduct);
                $scope.Contactobj.BasicOSSeries = angular.copy($scope.Contactobj.BasicODSeries);
                $scope.Contactobj.BasicOSVaDistance = angular.copy($scope.Contactobj.BasicODVaDistance);
                $scope.Contactobj.BasicOSVaNear = angular.copy($scope.Contactobj.BasicODVaNear);
                $scope.Contactobj.BasicOSVaNear = angular.copy($scope.Contactobj.BasicODVaNear);
                $scope.Contactobj.BasicOSVaIntermediate = angular.copy($scope.Contactobj.BasicODVaIntermediate);
            }
            if (subLenstab == 2 && type == 'Advance') {
                $scope.Contactobj.AdvancedFitOSComfort = angular.copy($scope.Contactobj.AdvancedFitODComfort);
                $scope.Contactobj.AdvancedFitOSCentration = angular.copy($scope.Contactobj.AdvancedFitODCentration);
                $scope.Contactobj.AdvancedFitOSCoverage = angular.copy($scope.Contactobj.AdvancedFitODCoverage);
                $scope.Contactobj.AdvancedFitOSMovement = angular.copy($scope.Contactobj.AdvancedFitODMovement);
                $scope.Contactobj.AdvancedFitOSDegrees = angular.copy($scope.Contactobj.AdvancedFitODDegrees);
                $scope.Contactobj.AdvancedFitOSDirection = angular.copy($scope.Contactobj.AdvancedFitODDirection);
                $scope.Contactobj.AdvancedRefractionOSSph = angular.copy($scope.Contactobj.AdvancedRefractionODSph);
                $scope.Contactobj.AdvancedRefractionOSCyl = angular.copy($scope.Contactobj.AdvancedRefractionODCyl);
                $scope.Contactobj.AdvancedRefractionOSAxis = angular.copy($scope.Contactobj.AdvancedRefractionODAxis);
                $scope.Contactobj.AdvancedRefractionOSAdd = angular.copy($scope.Contactobj.AdvancedRefractionODAdd);
                $scope.Contactobj.AdvancedRefractionOSVaDistance = angular.copy($scope.Contactobj.AdvancedRefractionODVaDistance);
                $scope.Contactobj.AdvancedRefractionOSVaNear = angular.copy($scope.Contactobj.AdvancedRefractionODVaNear);
                $scope.Contactobj.AdvancedRefractionOSVaIntermediate = angular.copy($scope.Contactobj.AdvancedRefractionODVaIntermediate);

            }
        }

        $scope.AddNewContactobj = function (typename) {

            if ($scope.Contactobj.BasicODDesignType != '' || $scope.Contactobj.BasicODSph != '' || $scope.Contactobj.BasicODCyl != ''
                || $scope.Contactobj.BasicODAxis != '' || $scope.Contactobj.BasicODBC != '' || $scope.Contactobj.BasicODDia != ''
                || $scope.Contactobj.BasicODKeratometry != '' || $scope.Contactobj.BasicODColor != '' || $scope.Contactobj.BasicODProduct != '' || $scope.Contactobj.BasicODSeries != ''
                || $scope.Contactobj.BasicODVaDistance != '' || $scope.Contactobj.BasicODVaNear != '' || $scope.Contactobj.BasicODVaIntermediate != ''
                || $scope.Contactobj.BasicOSDesignType != '' || $scope.Contactobj.BasicOSSph != '' || $scope.Contactobj.BasicOSCyl != ''
                || $scope.Contactobj.BasicOSAxis != '' || $scope.Contactobj.BasicOSBC != '' || $scope.Contactobj.BasicOSDia != ''
                || $scope.Contactobj.BasicOSKeratometry != '' || $scope.Contactobj.BasicOSColor != '' || $scope.Contactobj.BasicOSProduct != '' || $scope.Contactobj.BasicOSSeries != ''
                || $scope.Contactobj.BasicOSVaDistance != '' || $scope.Contactobj.BasicOSVaNear != '' || $scope.Contactobj.BasicOSVaIntermediate != ''
                || $scope.Contactobj.BasicOUVaDistance != '' || $scope.Contactobj.BasicOUVaNear != '' || $scope.Contactobj.BasicOUVaIntermediate != ''
                || $scope.Contactobj.AdvancedFitODComfort != '' || $scope.Contactobj.AdvancedFitODCentration != '' || $scope.Contactobj.AdvancedFitODCoverage != ''
                || $scope.Contactobj.AdvancedFitODMovement != '' || $scope.Contactobj.AdvancedFitODDegrees != '' || $scope.Contactobj.AdvancedFitODDirection != ''
                || $scope.Contactobj.AdvancedFitOSComfort != '' || $scope.Contactobj.AdvancedFitOSCentration != '' || $scope.Contactobj.AdvancedFitOSCoverage != ''
                || $scope.Contactobj.AdvancedFitOSMovement != '' || $scope.Contactobj.AdvancedFitOSDegrees != '' || $scope.Contactobj.AdvancedFitOSDirection != ''
                || $scope.Contactobj.AdvancedRefractionODSph != '' || $scope.Contactobj.AdvancedRefractionODCyl != '' || $scope.Contactobj.AdvancedRefractionODAxis != ''
                || $scope.Contactobj.AdvancedRefractionODVaDistance != '' || $scope.Contactobj.AdvancedRefractionODVaNear != '' || $scope.Contactobj.AdvancedRefractionODVaIntermediate != ''
                || $scope.Contactobj.AdvancedRefractionOSSph != '' || $scope.Contactobj.AdvancedRefractionOSCyl != '' || $scope.Contactobj.AdvancedRefractionOSAxis != ''
                || $scope.Contactobj.AdvancedRefractionOSVaDistance != '' || $scope.Contactobj.AdvancedRefractionOSVaNear != '' || $scope.Contactobj.AdvancedRefractionOSVaIntermediate != ''
                || $scope.Contactobj.AdvancedRefractionOUVaDistance != '' || $scope.Contactobj.AdvancedRefractionOUVaNear != '' || $scope.Contactobj.AdvancedRefractionOUVaIntermediate != ''
                || $scope.Contactobj.BasicODAdd != '' || $scope.Contactobj.BasicOSAdd != ''
            ) {
                var Object = angular.copy($scope.Contactobj);

                let GivenByName = '';
                var Arraylist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.UserId }, true) || [];
                if (Arraylist.length > 0) {
                    GivenByName = Arraylist[0].SecondUserFullName;
                }

                if ($scope.obj.ContactLensDetails.length > 0) {
                    angular.forEach($scope.obj.ContactLensDetails, function (aitem) {
                        if (aitem.InvestigationId == 2084) {
                            Object.TypeId = $scope.Contactobj.TypeId;
                            Object.TypeName = $scope.Contactobj.TypeName;
                            Object.SubInvestigationId = $scope.Contactobj.TypeId;
                            Object.SubInvestigationName = $scope.Contactobj.TypeName;
                            Object.GivenByName = GivenByName;
                            Object.CreatedDateTime = $filter('date')(new Date(), 'MM-dd-yyyy,hh:mm a');
                            Object.Sno = $scope.Contactobj.Sno >= 0 ? $scope.Contactobj.Sno : null;

                            if (Object.Sno != null) {
                                if (aitem.InvestigationDetails.length > 0) {
                                    let templist = $filter("filter")(aitem.InvestigationDetails, function (item) { return item.Sno == $scope.Contactobj.Sno }, true) || [];
                                    if (templist.length > 0) {
                                        templist[0].BasicODDesignType = $scope.Contactobj.BasicODDesignType;
                                        templist[0].BasicODSph = $scope.Contactobj.BasicODSph;
                                        templist[0].BasicODCyl = $scope.Contactobj.BasicODCyl;
                                        templist[0].BasicODAxis = $scope.Contactobj.BasicODAxis;
                                        templist[0].BasicODAdd = $scope.Contactobj.BasicODAdd;
                                        templist[0].BasicODBC = $scope.Contactobj.BasicODBC;
                                        templist[0].BasicODDia = $scope.Contactobj.BasicODDia;
                                        templist[0].BasicODKeratometry = $scope.Contactobj.BasicODKeratometry;
                                        templist[0].BasicODColor = $scope.Contactobj.BasicODColor;
                                        templist[0].BasicODProduct = $scope.Contactobj.BasicODProduct;
                                        templist[0].BasicODSeries = $scope.Contactobj.BasicODSeries;
                                        templist[0].BasicODVaDistance = $scope.Contactobj.BasicODVaDistance;
                                        templist[0].BasicODVaNear = $scope.Contactobj.BasicODVaNear;
                                        templist[0].BasicODVaIntermediate = $scope.Contactobj.BasicODVaIntermediate;

                                        templist[0].BasicOSDesignType = $scope.Contactobj.BasicOSDesignType;
                                        templist[0].BasicOSSph = $scope.Contactobj.BasicOSSph;
                                        templist[0].BasicOSCyl = $scope.Contactobj.BasicOSCyl;
                                        templist[0].BasicOSAxis = $scope.Contactobj.BasicOSAxis;
                                        templist[0].BasicOSAdd = $scope.Contactobj.BasicOSAdd;
                                        templist[0].BasicOSBC = $scope.Contactobj.BasicOSBC;
                                        templist[0].BasicOSDia = $scope.Contactobj.BasicOSDia;
                                        templist[0].BasicOSKeratometry = $scope.Contactobj.BasicOSKeratometry;
                                        templist[0].BasicOSColor = $scope.Contactobj.BasicOSColor;
                                        templist[0].BasicOSProduct = $scope.Contactobj.BasicOSProduct;
                                        templist[0].BasicOSSeries = $scope.Contactobj.BasicOSSeries;
                                        templist[0].BasicOSVaDistance = $scope.Contactobj.BasicOSVaDistance;
                                        templist[0].BasicOSVaNear = $scope.Contactobj.BasicOSVaNear;
                                        templist[0].BasicOSVaIntermediate = $scope.Contactobj.BasicOSVaIntermediate;

                                        templist[0].BasicOUVaDistance = $scope.Contactobj.BasicOUVaDistance;
                                        templist[0].BasicOUVaNear = $scope.Contactobj.BasicOUVaNear;
                                        templist[0].BasicOUVaIntermediate = $scope.Contactobj.BasicOUVaIntermediate;
                                        templist[0].BasicRemarks = $scope.Contactobj.BasicRemarks || "";
                                        templist[0].BasicInstructions = $scope.Contactobj.BasicInstructions || "";
                                        templist[0].AdvancedRefractionRemarks = $scope.Contactobj.AdvancedRefractionRemarks || "";
                                        templist[0].GivenByName = GivenByName || "";
                                        templist[0].CreatedDateTime = $filter('date')(new Date(), 'MM-dd-yyyy,hh:mm a');
                                        templist[0].RxExpiration = $scope.Contactobj.RxExpiration || "";
                                        templist[0].ReplacementSchedule = $scope.Contactobj.ReplacementSchedule || "";

                                        templist[0].AdvancedFitODComfort = $scope.Contactobj.AdvancedFitODComfort || "";
                                        templist[0].AdvancedFitODCentration = $scope.Contactobj.AdvancedFitODCentration || "";
                                        templist[0].AdvancedFitODCoverage = $scope.Contactobj.AdvancedFitODCoverage || "";
                                        templist[0].AdvancedFitODMovement = $scope.Contactobj.AdvancedFitODMovement || "";
                                        templist[0].AdvancedFitODDegrees = $scope.Contactobj.AdvancedFitODDegrees || "";
                                        templist[0].AdvancedFitODDirection = $scope.Contactobj.AdvancedFitODDirection || "";
                                        templist[0].AdvancedRefractionODSph = $scope.Contactobj.AdvancedRefractionODSph || "";
                                        templist[0].AdvancedRefractionODCyl = $scope.Contactobj.AdvancedRefractionODCyl || "";
                                        templist[0].AdvancedRefractionODAxis = $scope.Contactobj.AdvancedRefractionODAxis || "";
                                        templist[0].AdvancedRefractionODAdd = $scope.Contactobj.AdvancedRefractionODAdd || "";
                                        templist[0].AdvancedRefractionODVaDistance = $scope.Contactobj.AdvancedRefractionODVaDistance || "";
                                        templist[0].AdvancedRefractionODVaNear = $scope.Contactobj.AdvancedRefractionODVaNear || "";
                                        templist[0].AdvancedRefractionODVaIntermediate = $scope.Contactobj.AdvancedRefractionODVaIntermediate || "";

                                        templist[0].AdvancedFitOSComfort = $scope.Contactobj.AdvancedFitOSComfort || "";
                                        templist[0].AdvancedFitOSCentration = $scope.Contactobj.AdvancedFitOSCentration || "";
                                        templist[0].AdvancedFitOSCoverage = $scope.Contactobj.AdvancedFitOSCoverage || "";
                                        templist[0].AdvancedFitOSMovement = $scope.Contactobj.AdvancedFitOSMovement || "";
                                        templist[0].AdvancedFitOSDegrees = $scope.Contactobj.AdvancedFitOSDegrees || "";
                                        templist[0].AdvancedFitOSDirection = $scope.Contactobj.AdvancedFitOSDirection || "";
                                        templist[0].AdvancedRefractionOSSph = $scope.Contactobj.AdvancedRefractionOSSph || "";
                                        templist[0].AdvancedRefractionOSCyl = $scope.Contactobj.AdvancedRefractionOSCyl || "";
                                        templist[0].AdvancedRefractionOSAxis = $scope.Contactobj.AdvancedRefractionOSAxis || "";
                                        templist[0].AdvancedRefractionOSAdd = $scope.Contactobj.AdvancedRefractionOSAdd || "";
                                        templist[0].AdvancedRefractionOSVaDistance = $scope.Contactobj.AdvancedRefractionOSVaDistance || "";
                                        templist[0].AdvancedRefractionOSVaNear = $scope.Contactobj.AdvancedRefractionOSVaNear || "";
                                        templist[0].AdvancedRefractionOSVaIntermediate = $scope.Contactobj.AdvancedRefractionOSVaIntermediate || "";

                                        templist[0].AdvancedRefractionOUVaDistance = $scope.Contactobj.AdvancedRefractionOUVaDistance || "";
                                        templist[0].AdvancedRefractionOUVaNear = $scope.Contactobj.AdvancedRefractionOUVaNear || "";
                                        templist[0].AdvancedRefractionOUVaIntermediate = $scope.Contactobj.AdvancedRefractionOUVaIntermediate || "";
                                        aitem.IsInvSummaryShow = true;
                                    }
                                }
                            }
                            else {
                                let index = aitem.InvestigationDetails.length;
                                Object.Sno = index;
                                aitem.InvestigationDetails.push(Object);
                            }



                        }
                    });
                }
                $scope.subLenstab = 1;
                $scope.Contactobj = angular.copy($scope.GetContactobj());
                if (typename == 'Wearing') {
                    $scope.Contactobj.TypeId = 1;
                    $scope.Contactobj.TypeName = 'Wearing';
                } else if (typename == 'Trial') {
                    $scope.Contactobj.TypeId = 2;
                    $scope.Contactobj.TypeName = 'Trial';
                } else if (typename == 'Final') {
                    $scope.Contactobj.TypeId = 3;
                    $scope.Contactobj.TypeName = 'Final';
                } else if (typename == 'DispensedTrial') {
                    $scope.Contactobj.TypeId = 4;
                    $scope.Contactobj.TypeName = 'DispensedTrial';
                }
            } else {
                alertify.error('Select any one value');
                return false;
            }

            $scope.CLSphericalListBoth = GetSphericalBothList();
            $scope.CLDesignTypeList = GetCLDesignTypeList();
            $scope.CLCylindricalListBoth = GetCylBothList();
            $scope.SphericalPlusList = GetSphericalPlusList();
            $scope.SphericalMinusList = GetSphericalMinusList();
            $scope.CylPlusList = GetCylPlusList();
            $scope.CylMinusList = GetCylMinusList();
            $scope.AxisPlusList = GetAxisPlusList();
            $scope.AddtionList = GetAddtionList();
            $scope.BCList = GetBCList();
            $scope.DiaList = GetDiaList();
            $scope.KeratometryList = GetKeratometryList();
            $scope.DistanceList = GetDistanceList();
            $scope.NearList = GetDistanceList();
            $scope.IntermediateList = GetDistanceList();
            $scope.CLColorList = GetColorList();
            $scope.CLProductList = GetProductList();
            $scope.MovementList = GetMovementList();
            $scope.DegreesList = GetDegreesList();
            $scope.CLDirectionList = GetDirectionList();
            $scope.CLCoverageList = GetCoverageList();
            $scope.CLCentrationList = GetCentrationList();
            $scope.CLComfortList = GetComfortList();
            if ($scope.FilterProductlist.length > 0) {
                angular.forEach($scope.FilterProductlist, function (aitem) {
                    aitem.selected = false;
                });
            }
            if ($scope.BrandsMainarray.length > 0) {
                angular.forEach($scope.BrandsMainarray, function (aitem) {
                    aitem.selected = false;
                });
            }
            if ($scope.MainColorlist.length > 0) {
                angular.forEach($scope.MainColorlist, function (aitem) {
                    aitem.selected = false;
                });
            }
        }

        $scope.ChangeType = function (Type, Id) {

            $scope.subLenstab = 1;
            $scope.Contactobj.SelectedEye = "OD";
            

            $scope.CLSphericalListBoth = GetSphericalBothList();
            $scope.CLDesignTypeList = GetCLDesignTypeList();
            $scope.CLCylindricalListBoth = GetCylBothList();
            $scope.SphericalPlusList = GetSphericalPlusList();
            $scope.SphericalMinusList = GetSphericalMinusList();
            $scope.CylPlusList = GetCylPlusList();
            $scope.CylMinusList = GetCylMinusList();
            $scope.AxisPlusList = GetAxisPlusList();
            $scope.BCList = GetBCList();
            $scope.DiaList = GetDiaList();
            $scope.KeratometryList = GetKeratometryList();
            $scope.DistanceList = GetDistanceList();
            $scope.NearList = GetDistanceList();
            $scope.IntermediateList = GetDistanceList();
            $scope.CLColorList = GetColorList();
            $scope.CLProductList = GetProductList();
            $scope.MovementList = GetMovementList();
            $scope.DegreesList = GetDegreesList();
            $scope.CLDirectionList = GetDirectionList();
            $scope.CLCoverageList = GetCoverageList();
            $scope.CLCentrationList = GetCentrationList();
            $scope.CLComfortList = GetComfortList();
            if ($scope.FilterProductlist.length > 0) {
                angular.forEach($scope.FilterProductlist, function (aitem) {
                    aitem.selected = false;
                });
            }
            if ($scope.BrandsMainarray.length > 0) {
                angular.forEach($scope.BrandsMainarray, function (aitem) {
                    aitem.selected = false;
                });
            }
            if ($scope.MainColorlist.length > 0) {
                angular.forEach($scope.MainColorlist, function (aitem) {
                    aitem.selected = false;
                });
            }
            if ($scope.Contactobj.BasicODDesignType == '' && $scope.Contactobj.BasicODSph == '' && $scope.Contactobj.BasicODCyl == '' && $scope.Contactobj.BasicODAxis == '' && $scope.Contactobj.BasicODBC == '' && $scope.Contactobj.BasicODDia == ''
                && $scope.Contactobj.BasicODKeratometry == '' && $scope.Contactobj.BasicODColor == '' && $scope.Contactobj.BasicODProduct == '' && $scope.Contactobj.BasicODVaDistance == '' && $scope.Contactobj.BasicODVaNear == '' && $scope.Contactobj.BasicODVaIntermediate == '' && $scope.Contactobj.BasicODSeries == ''
                && $scope.Contactobj.BasicOSDesignType == '' && $scope.Contactobj.BasicOSSph == '' && $scope.Contactobj.BasicOSCyl == '' && $scope.Contactobj.BasicOSAxis == '' && $scope.Contactobj.BasicOSBC == '' && $scope.Contactobj.BasicOSDia == ''
                && $scope.Contactobj.BasicOSKeratometry == '' && $scope.Contactobj.BasicOSColor == '' && $scope.Contactobj.BasicOSProduct == '' && $scope.Contactobj.BasicOSVaDistance == '' && $scope.Contactobj.BasicOSVaNear == '' && $scope.Contactobj.BasicOSVaIntermediate == '' && $scope.Contactobj.BasicOSSeries == ''
                && $scope.Contactobj.BasicOUVaDistance == '' && $scope.Contactobj.BasicOUVaNear == '' && $scope.Contactobj.BasicOUVaIntermediate == '' && $scope.Contactobj.AdvancedFitODComfort == '' && $scope.Contactobj.AdvancedFitODCentration == '' && $scope.Contactobj.AdvancedFitODCoverage == ''
                && $scope.Contactobj.AdvancedFitODMovement == '' && $scope.Contactobj.AdvancedFitODDegrees == '' && $scope.Contactobj.AdvancedFitODDirection == '' && $scope.Contactobj.AdvancedFitOSComfort == '' && $scope.Contactobj.AdvancedFitOSCentration == '' && $scope.Contactobj.AdvancedFitOSCoverage == ''
                && $scope.Contactobj.AdvancedFitOSMovement == '' && $scope.Contactobj.AdvancedFitOSDegrees == '' && $scope.Contactobj.AdvancedFitOSDirection == '' && $scope.Contactobj.AdvancedRefractionODSph == '' && $scope.Contactobj.AdvancedRefractionODCyl == '' && $scope.Contactobj.AdvancedRefractionODAxis == ''
                && $scope.Contactobj.AdvancedRefractionODVaDistance == '' && $scope.Contactobj.AdvancedRefractionODVaNear == '' && $scope.Contactobj.AdvancedRefractionODVaIntermediate == '' && $scope.Contactobj.AdvancedRefractionOSSph == '' && $scope.Contactobj.AdvancedRefractionOSCyl == '' && $scope.Contactobj.AdvancedRefractionOSAxis == ''
                && $scope.Contactobj.AdvancedRefractionOSVaDistance == '' && $scope.Contactobj.AdvancedRefractionOSVaNear == '' && $scope.Contactobj.AdvancedRefractionOSVaIntermediate == '' && $scope.Contactobj.AdvancedRefractionOUVaDistance == '' && $scope.Contactobj.AdvancedRefractionOUVaNear == '' && $scope.Contactobj.AdvancedRefractionOUVaIntermediate == ''
               
            ) { }
            else {
                $scope.AddNewContactobj();
            }

            $scope.Contactobj.TypeName = Type;
            $scope.Contactobj.TypeId = Id;
            $scope.Contactobj.RxExpiration = "";
            $scope.Contactobj.ReplacementSchedule = "";
        }

        $scope.OnSelectCL = function (type) {
            if (type == 'ODDesign') {
                setCLFocus('ODSph');
            }
            if (type == 'ODSph') {
                setCLFocus('ODCyl');
            }
            if (type == 'ODCyl') {
                setCLFocus('ODAxis');
            }
            if (type == 'ODAxis') {
                setCLFocus('ODAdd');
            }
            if (type == 'ODAdd') {
                setCLFocus('OSProduct');
            }
            if (type == 'ODBC') {
                setCLFocus('ODDia');
            }
            if (type == 'ODDia') {
                setCLFocus('ODColor');
            }
            if (type == 'ODKerato') {
                setCLFocus('ODColor');
            }
            if (type == 'ODColor') {
                setCLFocus('ODSph');
            }
            if (type == 'ODProd') {
                setCLFocus('ODSeries');
            }
            if (type == 'ODSeri') {
                setCLFocus('ODBC');
            }
            if (type == 'ODDist') {
                setCLFocus('ODVAN');
            }
            if (type == 'ODNear') {
                setCLFocus('ODVAI');
            }
            if (type == 'ODInter') {
                setCLFocus('OSVAD');
            }
            if (type == 'OSDesign') {
                setCLFocus('OSSph');
            }
            if (type == 'OSSph') {
                setCLFocus('OSCyl');
            }
            if (type == 'OSCyl') {
                setCLFocus('OSAxis');
            }
            if (type == 'OSAxis') {
                setCLFocus('OSAdd');
            }
            if (type == 'OSBC') {
                setCLFocus('OSDia');
            }
            if (type == 'OSDia') {
                setCLFocus('OSColor');
            }
            if (type == 'OSProd') {
                setCLFocus('OSSeries');
            }
            if (type == 'OSSeri') {
                setCLFocus('ODBC');
            }
            if (type == 'OSKerato') {
                setCLFocus('OSColor');
            }
            if (type == 'OSColor') {
                setCLFocus('OSSph');
            }
            if (type == 'OSDist') {
                setCLFocus('OSVAN');
            }
            if (type == 'OSNear') {
                setCLFocus('OSVAI');
            }
            if (type == 'OSInter') {
                setCLFocus('OUVAD');
            }
            if (type == 'OUDist') {
                setCLFocus('OUVAN');
            }
            if (type == 'OUNear') {
                setCLFocus('OUVAI');
            }
            if (type == 'AODComfort') {
                setCLFocus('AODCent');
            }
            if (type == 'AODCent') {
                setCLFocus('AODCover');
            }
            if (type == 'AODCover') {
                setCLFocus('AODMove');
            }
            if (type == 'AODMove') {
                setCLFocus('AODDegree');
            }
            if (type == 'AODDegree') {
                setCLFocus('AODDirect');
            }
            if (type == 'AODDirect') {
                setCLFocus('AODSph');
            }
            if (type == 'AODSph') {
                setCLFocus('AODCyl');
            }
            if (type == 'AODCyl') {
                setCLFocus('AODAxis');
            }
            if (type == 'AODAxis') {
                setCLFocus('AODAdd');
            }
            if (type == 'AODAdd') {
                setCLFocus('AODVAD');
            }
            if (type == 'AODVAD') {
                setCLFocus('AODVAN');
            }
            if (type == 'AODVAN') {
                setCLFocus('AODVAI');
            }
            if (type == 'AODVAI') {
                setCLFocus('AOSComfort');
            }
            if (type == 'AOSComfort') {
                setCLFocus('AOSCent');
            }
            if (type == 'AOSCent') {
                setCLFocus('AOSCover');
            }
            if (type == 'AOSCover') {
                setCLFocus('AOSMove');
            }
            if (type == 'AOSMove') {
                setCLFocus('AOSDegree');
            }
            if (type == 'AOSDegree') {
                setCLFocus('AOSDirect');
            }
            if (type == 'AOSDirect') {
                setCLFocus('AOSSph');
            }
            if (type == 'AOSSph') {
                setCLFocus('AOSCyl');
            }
            if (type == 'AOSCyl') {
                setCLFocus('AOSAxis');
            }
            if (type == 'AOSAxis') {
                setCLFocus('AOSAdd');
            }
            if (type == 'AOSAdd') {
                setCLFocus('AOSVAD');
            }
            if (type == 'AOSVAD') {
                setCLFocus('AOSVAN');
            }
            if (type == 'AOSVAN') {
                setCLFocus('AOSVAI');
            }
            if (type == 'AOSVAI') {
                setCLFocus('AOUVAD');
            }
            if (type == 'AOUVAD') {
                setCLFocus('AOUVAN');
            }
            if (type == 'AOUVAN') {
                setCLFocus('AOUVAI');
            }
        }
        /*Soft End*/



        /*RGP start*/
        $scope.changeRGPitem = function (item, Eye, type, arrayList) {

            angular.forEach(arrayList, function (aitem) {
                aitem.selected = false;
            });

            if (Eye == "OD") {

                if (type == 'BC') {
                    $scope.RGPContactobj.BasicODBC = item.Value || '';
                    item.selected = true;
                }

                if (type == 'Dia') {
                    $scope.RGPContactobj.BasicODDia = item.Value || '';
                    item.selected = true;
                }
                if (type == 'Sph') {
                    $scope.RGPContactobj.BasicODSph = item.Value || '';
                    item.selected = true;
                } 

                if (type == 'Cyl') {
                    $scope.RGPContactobj.BasicODCyl = item.Value || '';
                    item.selected = true;
                }

                if (type == 'Axis') {
                    $scope.RGPContactobj.BasicODAxis = item.Value || '';
                    item.selected = true;
                }

                if (type == 'Add') {
                    $scope.RGPContactobj.BasicODAdd = item.Value || '';
                    item.selected = true;
                }


                if (type == 'DesignType') {
                    $scope.RGPContactobj.BasicODDesignType = item.Value || '';
                    item.selected = true;
                }
                if (type == 'Color') {
                    $scope.RGPContactobj.BasicODColor = item.Value || '';
                    item.selected = true;
                }
                if (type == 'Product') {
                    $scope.RGPContactobj.BasicODProduct = item.Value || '';
                    item.selected = true;
                }
                if (type == 'VaDistance') {
                    $scope.RGPContactobj.BasicODVaDistance = item.Value || '';
                    item.selected = true;
                }
                if (type == 'VaNear') {
                    $scope.RGPContactobj.BasicODVaNear = item.Value || '';
                    item.selected = true;
                }
                if (type == 'VaIntermediate') {
                    $scope.RGPContactobj.BasicODVaIntermediate = item.Value || '';
                    item.selected = true;
                }
                if (type == 'Comfort') {
                    $scope.RGPContactobj.AdvancedFitODComfort = item.Value || '';
                    item.selected = true;
                }
                if (type == 'Centration') {
                    $scope.RGPContactobj.AdvancedFitODCentration = item.Value || '';
                    item.selected = true;
                }
                if (type == 'Coverage') {
                    $scope.RGPContactobj.AdvancedFitODCoverage = item.Value || '';
                    item.selected = true;
                }
                if (type == 'Movement') {
                    $scope.RGPContactobj.AdvancedFitODMovement = item.Value || '';
                    item.selected = true;
                }
                if (type == 'Degrees') {
                    $scope.RGPContactobj.AdvancedFitODDegrees = item.Value || '';
                    item.selected = true;
                }
                if (type == 'Direction') {
                    $scope.RGPContactobj.AdvancedFitODDirection = item.Value || '';
                    item.selected = true;
                }
                if (type == 'ASph') {
                    $scope.RGPContactobj.AdvancedRefractionODSph = item.Value || '';
                    item.selected = true;
                }
                if (type == 'ACyl') {
                    $scope.RGPContactobj.AdvancedRefractionODCyl = item.Value || '';
                    item.selected = true;
                }
                if (type == 'AAxis') {
                    $scope.RGPContactobj.AdvancedRefractionODAxis = item.Value || '';
                    item.selected = true;
                }
                if (type == 'AVaDistance') {
                    $scope.RGPContactobj.AdvancedRefractionODVaDistance = item.Value || '';
                    item.selected = true;
                }
                if (type == 'AVaNear') {
                    $scope.RGPContactobj.AdvancedRefractionODVaNear = item.Value || '';
                    item.selected = true;
                }
                if (type == 'AVaIntermediate') {
                    $scope.RGPContactobj.AdvancedRefractionODVaIntermediate = item.Value || '';
                    item.selected = true;
                }
            }
            if (Eye == "OS") {
                if (type == 'BC') {
                    $scope.RGPContactobj.BasicOSBC = item.Value || '';
                    item.selected = true;
                }

                if (type == 'Dia') {
                    $scope.RGPContactobj.BasicOSDia = item.Value || '';
                    item.selected = true;
                }
                if (type == 'Sph') {
                    $scope.RGPContactobj.BasicOSSph = item.Value || '';
                    item.selected = true;
                }

                if (type == 'Cyl') {
                    $scope.RGPContactobj.BasicOSCyl = item.Value || '';
                    item.selected = true;
                }

                if (type == 'Axis') {
                    $scope.RGPContactobj.BasicOSAxis = item.Value || '';
                    item.selected = true;
                }

                if (type == 'Add') {
                    $scope.RGPContactobj.BasicOSAdd = item.Value || '';
                    item.selected = true;
                }
                if (type == 'DesignType') {
                    $scope.RGPContactobj.BasicOSDesignType = item.Value || '';
                    item.selected = true;
                }
                if (type == 'Color') {
                    $scope.RGPContactobj.BasicOSColor = item.Value || '';
                    item.selected = true;
                }
                if (type == 'Product') {
                    $scope.RGPContactobj.BasicOSProduct = item.Value || '';
                    item.selected = true;
                }
                if (type == 'VaDistance') {
                    $scope.RGPContactobj.BasicOSVaDistance = item.Value || '';
                    item.selected = true;
                }
                if (type == 'VaNear') {
                    $scope.RGPContactobj.BasicOSVaNear = item.Value || '';
                    item.selected = true;
                }
                if (type == 'VaIntermediate') {
                    $scope.RGPContactobj.BasicOSVaIntermediate = item.Value || '';
                    item.selected = true;
                }
                if (type == 'Comfort') {
                    $scope.RGPContactobj.AdvancedFitOSComfort = item.Value || '';
                    item.selected = true;
                }
                if (type == 'Centration') {
                    $scope.RGPContactobj.AdvancedFitOSCentration = item.Value || '';
                    item.selected = true;
                }
                if (type == 'Coverage') {
                    $scope.RGPContactobj.AdvancedFitOSCoverage = item.Value || '';
                    item.selected = true;
                }
                if (type == 'Direction') {
                    $scope.RGPContactobj.AdvancedFitOSDirection = item.Value || '';
                    item.selected = true;
                }
                if (type == 'Movement') {
                    $scope.RGPContactobj.AdvancedFitOSMovement = item.Value || '';
                    item.selected = true;
                }
                if (type == 'Degrees') {
                    $scope.RGPContactobj.AdvancedFitOSDegrees = item.Value || '';
                    item.selected = true;
                }
                if (type == 'ASph') {
                    $scope.RGPContactobj.AdvancedRefractionOSSph = item.Value || '';
                    item.selected = true;
                }
                if (type == 'ACyl') {
                    $scope.RGPContactobj.AdvancedRefractionOSCyl = item.Value || '';
                    item.selected = true;
                }
                if (type == 'AAxis') {
                    $scope.RGPContactobj.AdvancedRefractionOSAxis = item.Value || '';
                    item.selected = true;
                }
                if (type == 'AVaDistance') {
                    $scope.RGPContactobj.AdvancedRefractionOSVaDistance = item.Value || '';
                    item.selected = true;
                }
                if (type == 'AVaNear') {
                    $scope.RGPContactobj.AdvancedRefractionOSVaNear = item.Value || '';
                    item.selected = true;
                }
                if (type == 'AVaIntermediate') {
                    $scope.RGPContactobj.AdvancedRefractionOSVaIntermediate = item.Value || '';
                    item.selected = true;
                }
            }
            if (Eye == "OU") {
                if (type == 'VaDistance') {
                    $scope.RGPContactobj.BasicOUVaDistance = item.Value;
                    item.selected = true;
                }
                if (type == 'VaNear') {
                    $scope.RGPContactobj.BasicOUVaNear = item.Value;
                    item.selected = true;
                }
                if (type == 'VaIntermediate') {
                    $scope.RGPContactobj.BasicOUVaIntermediate = item.Value;
                    item.selected = true;
                }
                if (type == 'AVaDistance') {
                    $scope.RGPContactobj.AdvancedRefractionOUVaDistance = item.Value;
                    item.selected = true;
                }
                if (type == 'AVaNear') {
                    $scope.RGPContactobj.AdvancedRefractionOUVaNear = item.Value;
                    item.selected = true;
                }
                if (type == 'AVaIntermediate') {
                    $scope.RGPContactobj.AdvancedRefractionOUVaIntermediate = item.Value;
                    item.selected = true;
                }
            }
        }

        $scope.changeRGPSelectedItem = function (item, arrayList, Eye, head, Subtab) {
            if (Subtab == 3) {
                angular.forEach(arrayList, function (aitem) {
                    aitem.selected = false;
                });
                if (Eye == "OD") {

                    if (head == 'VaDistance') {
                        $scope.RGPContactobj.BasicODVaDistance = item.Value;
                        item.selected = true;
                    }
                    if (head == 'VaNear') {
                        $scope.RGPContactobj.BasicODVaNear = item.Value;
                        item.selected = true;
                    }
                    if (head == 'VaIntermediate') {
                        $scope.RGPContactobj.BasicODVaIntermediate = item.Value;
                        item.selected = true;
                    }
                    if (head == 'Movement') {
                        $scope.RGPContactobj.AdvancedFitODMovement = item.Value;
                        item.selected = true;
                    }
                    if (head == 'Degrees') {
                        $scope.RGPContactobj.AdvancedFitODDegrees = item.Value;
                        item.selected = true;
                    }
                }
                if (Eye == "OS") {

                    if (head == 'VaDistance') {
                        $scope.RGPContactobj.BasicOSVaDistance = item.Value;
                        item.selected = true;
                    }
                    if (head == 'VaNear') {
                        $scope.RGPContactobj.BasicOSVaNear = item.Value;
                        item.selected = true;
                    }
                    if (head == 'VaIntermediate') {
                        $scope.RGPContactobj.BasicOSVaIntermediate = item.Value;
                        item.selected = true;
                    }
                    if (head == 'Movement') {
                        $scope.RGPContactobj.AdvancedFitOSMovement = item.Value;
                        item.selected = true;
                    }
                    if (head == 'Degrees') {
                        $scope.RGPContactobj.AdvancedFitOSDegrees = item.Value;
                        item.selected = true;
                    }
                }
                if (Eye == "OU") {
                    if (head == 'VaDistance') {
                        $scope.RGPContactobj.BasicOUVaDistance = item.Value;
                        item.selected = true;
                    }
                    if (head == 'VaNear') {
                        $scope.RGPContactobj.BasicOUVaNear = item.Value;
                        item.selected = true;
                    }
                    if (head == 'VaIntermediate') {
                        $scope.RGPContactobj.BasicOUVaIntermediate = item.Value;
                        item.selected = true;
                    }
                }
            }
            if (Subtab == 4) {
                angular.forEach(arrayList, function (aitem) {
                    aitem.selected = false;
                });
                if (Eye == "OD") {
                    if (head == "Sph") {
                        $scope.RGPContactobj.AdvancedRefractionODSph = item.Value;
                        item.selected = true;
                    }
                    if (head == 'Cyl') {
                        $scope.RGPContactobj.AdvancedRefractionODCyl = item.Value;
                        item.selected = true;
                    }
                    if (head == 'Axis') {
                        $scope.RGPContactobj.AdvancedRefractionODAxis = item.Value;
                        item.selected = true;
                    }

                    if (head == 'VaDistance') {
                        $scope.RGPContactobj.AdvancedRefractionODVaDistance = item.Value;
                        item.selected = true;
                    }
                    if (head == 'VaNear') {
                        $scope.RGPContactobj.AdvancedRefractionODVaNear = item.Value;
                        item.selected = true;
                    }
                    if (head == 'VaIntermediate') {
                        $scope.RGPContactobj.AdvancedRefractionODVaIntermediate = item.Value;
                        item.selected = true;
                    }
                    if (head == 'Movement') {
                        $scope.RGPContactobj.AdvancedFitODMovement = item.Value;
                        item.selected = true;
                    }
                    if (head == 'Degrees') {
                        $scope.RGPContactobj.AdvancedFitODDegrees = item.Value;
                        item.selected = true;
                    }
                }
                if (Eye == "OS") {
                    if (head == "Sph") {
                        $scope.RGPContactobj.AdvancedRefractionOSSph = item.Value;
                        item.selected = true;
                    }
                    if (head == 'Cyl') {
                        $scope.RGPContactobj.AdvancedRefractionOSCyl = item.Value;
                        item.selected = true;
                    }
                    if (head == 'Axis') {
                        $scope.RGPContactobj.AdvancedRefractionOSAxis = item.Value;
                        item.selected = true;
                    }

                    if (head == 'VaDistance') {
                        $scope.RGPContactobj.AdvancedRefractionOSVaDistance = item.Value;
                        item.selected = true;
                    }
                    if (head == 'VaNear') {
                        $scope.RGPContactobj.AdvancedRefractionOSVaNear = item.Value;
                        item.selected = true;
                    }
                    if (head == 'VaIntermediate') {
                        $scope.RGPContactobj.AdvancedRefractionOSVaIntermediate = item.Value;
                        item.selected = true;
                    }
                    if (head == 'Movement') {
                        $scope.RGPContactobj.AdvancedFitOSMovement = item.Value;
                        item.selected = true;
                    }
                    if (head == 'Degrees') {
                        $scope.RGPContactobj.AdvancedFitOSDegrees = item.Value;
                        item.selected = true;
                    }
                }
                if (Eye == "OU") {
                    if (head == 'VaDistance') {
                        $scope.RGPContactobj.AdvancedRefractionOUVaDistance = item.Value;
                        item.selected = true;
                    }
                    if (head == 'VaNear') {
                        $scope.RGPContactobj.AdvancedRefractionOUVaNear = item.Value;
                        item.selected = true;
                    }
                    if (head == 'VaIntermediate') {
                        $scope.RGPContactobj.AdvancedRefractionOUVaIntermediate = item.Value;
                        item.selected = true;
                    }
                }
            }
        }

        $scope.ChangeRGPSelectedEye = function (Eyetype,type) {
            $scope.RGPContactobj.SelectedEye = Eyetype;
            getRequiredObject(type)          
            $scope.ChangeRGPAutoFill($scope.RGPContactobj.SelectedEye);
            /*$scope.OnSelectRGPValues(type);*/
        }

        $scope.ChangeRGPAutoFill = function (Eye) {         

            if ($scope.AdvanceIntermediateList &&  $scope.AdvanceIntermediateList.length > 0) {
                angular.forEach($scope.AdvanceIntermediateList, function (aitem) {
                    aitem.selected = false;
                });
            }
            if ($scope.AdvanceNearList &&  $scope.AdvanceNearList.length > 0) {
                angular.forEach($scope.AdvanceNearList, function (aitem) {
                    aitem.selected = false;
                });
            }

            if ($scope.AdvanceDistanceList && $scope.AdvanceDistanceList.length > 0) {
                angular.forEach($scope.AdvanceDistanceList, function (aitem) {
                    aitem.selected = false;
                });
            }
            if ($scope.AdvanceAxisPlusList &&  $scope.AdvanceAxisPlusList.length > 0) {
                angular.forEach($scope.AdvanceAxisPlusList, function (aitem) {
                    aitem.selected = false;
                });
            }

            if ($scope.AdvanceCylMinusList && $scope.AdvanceCylMinusList.length > 0) {
                angular.forEach($scope.AdvanceCylMinusList, function (aitem) {
                    aitem.selected = false;
                });
            }
            if ($scope.AdvanceSphericalMinusList && $scope.AdvanceSphericalMinusList.length > 0) {
                angular.forEach($scope.AdvanceSphericalMinusList, function (aitem) {
                    aitem.selected = false;
                });
            }

            if ($scope.AdvanceSphericalPlusList && $scope.AdvanceSphericalPlusList.length > 0) {
                angular.forEach($scope.AdvanceSphericalPlusList, function (aitem) {
                    aitem.selected = false;
                });
            }

            if ($scope.CLDirectionList && $scope.CLDirectionList.length > 0) {
                angular.forEach($scope.CLDirectionList, function (aitem) {
                    aitem.selected = false;
                });
            }


            if ($scope.DegreesList && $scope.DegreesList.length > 0) {
                angular.forEach($scope.DegreesList, function (aitem) {
                    aitem.selected = false;
                });
            }


            if ($scope.MovementList && $scope.MovementList.length > 0) {
                angular.forEach($scope.MovementList, function (aitem) {
                    aitem.selected = false;
                });
            }

            if ($scope.CLCoverageList &&  $scope.CLCoverageList.length > 0) {
                angular.forEach($scope.CLCoverageList, function (aitem) {
                    aitem.selected = false;
                });
            }

            if ($scope.CLCentrationList &&  $scope.CLCentrationList.length > 0) {
                angular.forEach($scope.CLCentrationList, function (aitem) {
                    aitem.selected = false;
                });
            }

            if ($scope.CLComfortList && $scope.CLComfortList.length > 0) {
                angular.forEach($scope.CLComfortList, function (aitem) {
                    aitem.selected = false;
                });
            }
            if ($scope.IntermediateList && $scope.IntermediateList.length > 0) {
                angular.forEach($scope.IntermediateList, function (aitem) {
                    aitem.selected = false;
                });
            }
            if ($scope.NearList && $scope.NearList.length > 0) {
                angular.forEach($scope.NearList, function (aitem) {
                    aitem.selected = false;
                });
            }
            if ($scope.DistanceList && $scope.DistanceList.length > 0) {
                angular.forEach($scope.DistanceList, function (aitem) {
                    aitem.selected = false;
                });
            }
            if ($scope.AddtionList && $scope.AddtionList.length > 0) {
                angular.forEach($scope.AddtionList, function (aitem) {
                    aitem.selected = false;
                });
            }

            if ($scope.AxisPlusList &&  $scope.AxisPlusList.length > 0) {
                angular.forEach($scope.AxisPlusList, function (aitem) {
                    aitem.selected = false;
                });
            }

            if ($scope.CylMinusList &&  $scope.CylMinusList.length > 0) {
                angular.forEach($scope.CylMinusList, function (aitem) {
                    aitem.selected = false;
                });
            }
            if ($scope.CylPlusList && $scope.CylPlusList.length > 0) {
                angular.forEach($scope.CylPlusList, function (aitem) {
                    aitem.selected = false;
                });
            }

            if ($scope.SphericalMinusList &&  $scope.SphericalMinusList.length > 0) {
                angular.forEach($scope.SphericalMinusList, function (aitem) {
                    aitem.selected = false;
                });
            }
            if ($scope.SphericalPlusList && $scope.SphericalPlusList.length > 0) {
                angular.forEach($scope.SphericalPlusList, function (aitem) {
                    aitem.selected = false;
                });
            }
            if ($scope.CLDesignTypeList &&  $scope.CLDesignTypeList.length > 0) {
                angular.forEach($scope.CLDesignTypeList, function (aitem) {
                    aitem.selected = false;
                });
            }
            if ($scope.CLColorList && $scope.CLColorList.length > 0) {
                angular.forEach($scope.CLColorList, function (aitem) {
                    aitem.selected = false;
                });
            }
            if ($scope.DiaList &&  $scope.DiaList.length > 0) {
                angular.forEach($scope.DiaList, function (aitem) {
                    aitem.selected = false;
                });
            }

            if ($scope.BCList && $scope.BCList.length > 0) {
                angular.forEach($scope.BCList, function (aitem) {
                    aitem.selected = false;
                });
            }

            if ($scope.CLProductList && $scope.CLProductList.length > 0) {
                angular.forEach($scope.CLProductList, function (aitem) {
                    aitem.selected = false;
                });
            }

            var Design = "";
            var Color = "";
            var Prod = "";
            var Dist = "";
            var Near = "";
            var Inter = "";
            var AComfort = "";
            var ACent = "";
            var ACover = "";
            var AMove = "";
            var ADegree = "";
            var ADirect = "";
            var ASph = "";
            var ACyl = "";
            var AAxis = "";
            var ADist = "";
            var ANear = "";
            var AInter = "";
            var BC = "";
            var Dia = "";
            var Sph = "";
            var Cyl = "";
            var Axis = "";
            var Add = "";
            if (Eye == "OD") {
                Add = $scope.RGPContactobj.BasicODAdd || "";
                Axis = $scope.RGPContactobj.BasicODAxis || "";
                Cyl = $scope.RGPContactobj.BasicODCyl || "";
                Sph = $scope.RGPContactobj.BasicODSph || "";
                Dia = $scope.RGPContactobj.BasicODDia || "";
                BC = $scope.RGPContactobj.BasicODBC || "";
                Design = $scope.RGPContactobj.BasicODDesignType || "";
                Color = $scope.RGPContactobj.BasicODColor || "";
                Prod = $scope.RGPContactobj.BasicODProduct || "";
                Dist = $scope.RGPContactobj.BasicODVaDistance || "";
                Near = $scope.RGPContactobj.BasicODVaNear || "";
                Inter = $scope.RGPContactobj.BasicODVaIntermediate || "";
                AComfort = $scope.RGPContactobj.AdvancedFitODComfort || "";
                ACent = $scope.RGPContactobj.AdvancedFitODCentration || "";
                ACover = $scope.RGPContactobj.AdvancedFitODCoverage || "";
                AMove = $scope.RGPContactobj.AdvancedFitODMovement || "";
                ADegree = $scope.RGPContactobj.AdvancedFitODDegrees || "";
                ADirect = $scope.RGPContactobj.AdvancedFitODDirection || "";
                ASph = $scope.RGPContactobj.AdvancedRefractionODSph || "";
                ACyl = $scope.RGPContactobj.AdvancedRefractionODCyl || "";
                AAxis = $scope.RGPContactobj.AdvancedRefractionODAxis || "";
                ADist = $scope.RGPContactobj.AdvancedRefractionODVaDistance || "";
                ANear = $scope.RGPContactobj.AdvancedRefractionODVaNear || "";
                AInter = $scope.RGPContactobj.AdvancedRefractionODVaIntermediate || "";
            }
            else if (Eye == "OS") {
                Add = $scope.RGPContactobj.BasicOSAdd || "";
                Axis = $scope.RGPContactobj.BasicOSAxis || "";
                Cyl = $scope.RGPContactobj.BasicOSCyl || "";
                Sph = $scope.RGPContactobj.BasicOSSph || "";
                Dia = $scope.RGPContactobj.BasicOSDia || "";
                BC = $scope.RGPContactobj.BasicOSBC || "";
             
                Design = $scope.RGPContactobj.BasicOSDesignType || "";
                Color = $scope.RGPContactobj.BasicOSColor || "";
                Prod = $scope.RGPContactobj.BasicOSProduct || "";
                Dist = $scope.RGPContactobj.BasicOSVaDistance || "";
                Near = $scope.RGPContactobj.BasicOSVaNear || "";
                Inter = $scope.RGPContactobj.BasicOSVaIntermediate || "";
                AComfort = $scope.RGPContactobj.AdvancedFitOSComfort || "";
                ACent = $scope.RGPContactobj.AdvancedFitOSCentration || "";
                ACover = $scope.RGPContactobj.AdvancedFitOSCoverage || "";
                AMove = $scope.RGPContactobj.AdvancedFitOSMovement || "";
                ADegree = $scope.RGPContactobj.AdvancedFitOSDegrees || "";
                ADirect = $scope.RGPContactobj.AdvancedFitOSDirection || "";
                ASph = $scope.RGPContactobj.AdvancedRefractionOSSph || "";
                ACyl = $scope.RGPContactobj.AdvancedRefractionOSCyl || "";
                AAxis = $scope.RGPContactobj.AdvancedRefractionOSAxis || "";
                ADist = $scope.RGPContactobj.AdvancedRefractionOSVaDistance || "";
                ANear = $scope.RGPContactobj.AdvancedRefractionOSVaNear || "";
                AInter = $scope.RGPContactobj.AdvancedRefractionOSVaIntermediate || "";
            }
            else {
                Dist = $scope.RGPContactobj.BasicOUVaDistance || "";
                Near = $scope.RGPContactobj.BasicOUVaNear || "";
                Inter = $scope.RGPContactobj.BasicOUVaIntermediate || "";
                ADist = $scope.RGPContactobj.AdvancedRefractionOUVaDistance || "";
                ANear = $scope.RGPContactobj.AdvancedRefractionOUVaNear || "";
                AInter = $scope.RGPContactobj.AdvancedRefractionOUVaIntermediate || "";
            } 
            if (BC != "") {
                
                var filter = $filter("filter")($scope.BCList, { "Value": BC }, true) || [];
                if (filter.length > 0) {
                    filter[0].selected = true;
                }
            } 
            if (Dia != "") {
                var filter = $filter("filter")($scope.DiaList , { "Value": Dia }, true) || [];
                if (filter.length > 0) {
                    filter[0].selected = true;
                }
            } 
            if (Sph != "") {
                $scope.RGPContactobj.SphericalSwitch = 2;
                var filter = $filter("filter")($scope.SphericalMinusList, { "Value": Sph }, true) || [];
                if (filter.length > 0) {
                    filter[0].selected = true;
                    $scope.RGPContactobj.SphericalSwitch = 2;
                }
                var filter1 = $filter("filter")($scope.SphericalPlusList, { "Value": Sph }, true) || [];
                if (filter1.length > 0) {
                    filter1[0].selected = true;
                    $scope.RGPContactobj.SphericalSwitch = 1;
                }
            }
            if (Cyl != "") {
                $scope.RGPContactobj.CylindricalSwitch = 2;
                var filter = $filter("filter")($scope.CylPlusList, { "Value": Cyl }, true) || [];
                if (filter.length > 0) {
                    filter[0].selected = true;
                    $scope.RGPContactobj.CylindricalSwitch = 1;
                }
                var filter1 = $filter("filter")($scope.CylMinusList, { "Value": Cyl }, true) || [];
                if (filter1.length > 0) {
                    filter1[0].selected = true;
                    $scope.RGPContactobj.CylindricalSwitch = 2;
                }
            }
            if (Axis != "") {
                var filter = $filter("filter")($scope.AxisPlusList, { "Value": Axis }, true) || [];
                if (filter.length > 0) {
                    filter[0].selected = true;
                } 
            } 

            if (Add != "") {
                var filter = $filter("filter")($scope.AddtionList, { "Value": Add }, true) || [];
                if (filter.length > 0) {
                    filter[0].selected = true;
                }
            }
            if (Design != "") {
                var filter = $filter("filter")($scope.CLDesignTypeList, { "Value": Design }, true) || [];
                if (filter.length > 0) {
                    filter[0].selected = true;
                }
            }
            if (Color != "") {
                var filter = $filter("filter")($scope.CLColorList, { "Value": Color }, true) || [];
                if (filter.length > 0) {
                    filter[0].selected = true;
                }
            }
            if (Prod != "") {
                var filter = $filter("filter")($scope.CLProductList, { "Value": Prod }, true) || [];
                if (filter.length > 0) {
                    filter[0].selected = true;
                }
            }
            if (Dist != "") {
                var filter = $filter("filter")($scope.DistanceList, { "Value": Dist }, true) || [];
                if (filter.length > 0) {
                    filter[0].selected = true;
                }
            }
            if (Near != "") {
                var filter = $filter("filter")($scope.NearList, { "Value": Near }, true) || [];
                if (filter.length > 0) {
                    filter[0].selected = true;
                }
            }
            if (Inter != "") {
                var filter = $filter("filter")($scope.IntermediateList, { "Value": Inter }, true) || [];
                if (filter.length > 0) {
                    filter[0].selected = true;
                }
            }
            if (AComfort != "") {
                var filter = $filter("filter")($scope.CLComfortList, { "Value": AComfort }, true) || [];
                if (filter.length > 0) {
                    filter[0].selected = true;
                }
            }
            if (ACent != "") {
                var filter = $filter("filter")($scope.CLCentrationList, { "Value": ACent }, true) || [];
                if (filter.length > 0) {
                    filter[0].selected = true;
                }
            }
            if (ACover != "") {
                var filter = $filter("filter")($scope.CLCoverageList, { "Value": ACover }, true) || [];
                if (filter.length > 0) {
                    filter[0].selected = true;
                }
            }
            if (AMove != "") {
                var filter = $filter("filter")($scope.MovementList, { "Value": AMove }, true) || [];
                if (filter.length > 0) {
                    filter[0].selected = true;
                }
            }
            if (ADegree != "") {
                var filter = $filter("filter")($scope.DegreesList, { "Value": ADegree }, true) || [];
                if (filter.length > 0) {
                    filter[0].selected = true;
                }
            }
            if (ADirect != "") {
                var filter = $filter("filter")($scope.CLDirectionList, { "Value": ADirect }, true) || [];
                if (filter.length > 0) {
                    filter[0].selected = true;
                }
            }
            if (ASph != "") {
                var filter = $filter("filter")($scope.AdvanceSphericalPlusList, { "Value": ASph }, true) || [];
                if (filter.length > 0) {
                    filter[0].selected = true;
                    $scope.Contactobj.SphericalSwitch = 1;
                }
                var filter1 = $filter("filter")($scope.AdvanceSphericalMinusList, { "Value": ASph }, true) || [];
                if (filter1.length > 0) {
                    filter1[0].selected = true;
                    $scope.Contactobj.SphericalSwitch = 2;
                }
            }
            if (ACyl != "") {
                $scope.Contactobj.CylindricalSwitch = 2;
                var filter1 = $filter("filter")($scope.AdvanceCylMinusList, { "Value": ACyl }, true) || [];
                if (filter1.length > 0) {
                    filter1[0].selected = true;
                    $scope.Contactobj.CylindricalSwitch = 2;
                }
            }
            if (AAxis != "") {
                var filter = $filter("filter")($scope.AdvanceAxisPlusList, { "Value": AAxis }, true) || [];
                if (filter.length > 0) {
                    filter[0].selected = true;
                }
            }
            if (ADist != "") {
                var filter = $filter("filter")($scope.AdvanceDistanceList, { "Value": ADist }, true) || [];
                if (filter.length > 0) {
                    filter[0].selected = true;
                }
            }
            if (ANear != "") {
                var filter = $filter("filter")($scope.AdvanceNearList, { "Value": ANear }, true) || [];
                if (filter.length > 0) {
                    filter[0].selected = true;
                }
            }
            if (AInter != "") {
                var filter = $filter("filter")($scope.AdvanceIntermediateList, { "Value": AInter }, true) || [];
                if (filter.length > 0) {
                    filter[0].selected = true;
                }
            }
        }
        $scope.OnSelectRGPValues = function (type) {

            if (type == 'ODProd') {
                setCLFocus('ODSeries');
            }
            if (type == 'ODDesign') {
                setCLFocus('ODSph');
            }
            if (type == 'ODSph') {
                setCLFocus('ODCyl');
            }
            if (type == 'ODCyl') {
                setCLFocus('ODAxis');
            }
            if (type == 'ODAxis') {
                setCLFocus('ODAdd');
            }
            if (type == 'ODAdd') {
                setCLFocus('OSProduct');
            }
            if (type == 'ODBC') {
                setCLFocus('ODDia');
            }
            if (type == 'ODDia') {
                setCLFocus('ODColor');
            }
            if (type == 'ODColor') {
                setCLFocus('ODDesign');
            }
            if (type == 'OSColor') {
                setCLFocus('OSDesign');
            }
            if (type == 'OSDesign') {
                setCLFocus('OSSph');
            }
            if (type == 'OSProduct') {
                setCLFocus('OSSeries');
            }
            if (type == 'OSSeries') {
                setCLFocus('OSBC');
            }
            if (type == 'OSDesign') {
                setCLFocus('OSSph');
            }

            if (type == 'OSSph') {
                setCLFocus('OSCyl');
            }
            if (type == 'OSCyl') {
                setCLFocus('OSAxis');
            }
            if (type == 'OSAxis') {
                setCLFocus('OSAdd');
            }
            if (type == 'OSAdd') {
                setCLFocus('OSDist');
            }
            if (type == 'OSBC') {
                setCLFocus('OSDia');
            }
            if (type == 'OSDia') {
                setCLFocus('OSColor');
            }
            if (type == 'ODDist') {
                setCLFocus('ODVAN');
            }
            if (type == 'ODNear') {
                setCLFocus('ODVAI');
            }
            if (type == 'ODInter') {
                setCLFocus('OSVAD');
            }

            if (type == 'OSDist') {
                setCLFocus('OSVAN');
            }
            if (type == 'OSNear') {
                setCLFocus('OSVAI');
            }
            if (type == 'OSInter') {
                setCLFocus('OUVAD');
            }
            if (type == 'OUDist') {
                setCLFocus('OUVAN');
            }
            if (type == 'OUNear') {
                setCLFocus('OUVAI');
            }
            if (type == 'AODComfort') {
                setCLFocus('AODCent');
            }
            if (type == 'AODCent') {
                setCLFocus('AODCover');
            }
            if (type == 'AODCover') {
                setCLFocus('AODMove');
            }
            if (type == 'AODMove') {
                setCLFocus('AODDegree');
            }
            if (type == 'AODDegree') {
                setCLFocus('AODDirect');
            }
            if (type == 'AODDirect') {
                setCLFocus('AODSph');
            }
            if (type == 'AODSph') {
                setCLFocus('AODCyl');
            }
            if (type == 'AODCyl') {
                setCLFocus('AODAxis');
            }
            if (type == 'AODAxis') {
                setCLFocus('AODAdd');
            }
            if (type == 'AODAdd') {
                setCLFocus('AODVAD');
            }
            if (type == 'AODVAD') {
                setCLFocus('AODVAN');
            }
            if (type == 'AODVAN') {
                setCLFocus('AODVAI');
            }
            if (type == 'AODVAI') {
                setCLFocus('AOSComfort');
            }
            if (type == 'AOSComfort') {
                setCLFocus('AOSCent');
            }
            if (type == 'AOSCent') {
                setCLFocus('AOSCover');
            }
            if (type == 'AOSCover') {
                setCLFocus('AOSMove');
            }
            if (type == 'AOSMove') {
                setCLFocus('AOSDegree');
            }
            if (type == 'AOSDegree') {
                setCLFocus('AOSDirect');
            }
            if (type == 'AOSDirect') {
                setCLFocus('AOSSph');
            }
            if (type == 'AOSSph') {
                setCLFocus('AOSCyl');
            }
            if (type == 'AOSCyl') {
                setCLFocus('AOSAxis');
            }
            if (type == 'AOSAxis') {
                setCLFocus('AOSAdd');
            }
            if (type == 'AOSAdd') {
                setCLFocus('AOSVAD');
            }
            if (type == 'AOSVAD') {
                setCLFocus('AOSVAN');
            }
            if (type == 'AOSVAN') {
                setCLFocus('AOSVAI');
            }
            if (type == 'AOSVAI') {
                setCLFocus('AOUVAD');
            }
            if (type == 'AOUVAD') {
                setCLFocus('AOUVAN');
            }
            if (type == 'AOUVAN') {
                setCLFocus('AOUVAI');
            }

        }

        $scope.clickmenupopover = {
            templateUrl: 'templates/uibpopups/menu-popover.html',
        };




        $scope.CheckSubCategory = function (aditem, id) {

            angular.forEach(aditem.SubCategoryDetails, function (ritem) {
                if (ritem.SubCategoryChildId == id) {
                    if (!ritem.IsSubChildCategoryChecked) {
                        if (ritem.SubCategoryChildId == 102  ) {
                            ritem.IsSubChildCategoryChecked = true;
                            ritem.Active = 'Y';
                            $scope.Rgplenstab = true;
                            $scope.RGPContactobj.SubLenstab = 1;
                        }
                        if (ritem.SubCategoryChildId == 104) {
                            ritem.IsSubChildCategoryChecked = true;
                            ritem.Active = 'Y';
                            $scope.Softlenstab = true;
                        }
                        
                    } else {
                        ritem.IsSubChildCategoryChecked = false;
                        ritem.Active = 'N';
                        $scope.Rgplenstab = false;
                        $scope.Softlenstab = false;
                    }
                }
                var Arraylist = $filter("filter")(aditem.SubCategoryDetails, function (kitem) { return kitem.SubCategoryChildId == 104 && kitem.IsSubChildCategoryChecked == true }, true) || [];
                if (Arraylist.length > 0) {
                    $scope.lenstab = 1;
                    $scope.Softlenstab = true;

                }
                var Arraylist = $filter("filter")(aditem.SubCategoryDetails, function (kitem) { return kitem.SubCategoryChildId == 102 && kitem.IsSubChildCategoryChecked == true }, true) || [];
                if (Arraylist.length > 0) {
                    $scope.lenstab = 2;
                    $scope.RGPContactobj.SubLenstab = 1;
                    $scope.Rgplenstab = true;

                }

            });
            if (aditem.SubCategoryDetails.length > 0) {
                var list = 0;
                angular.forEach(aditem.SubCategoryDetails, function (item) {
                    if (item.IsSubChildCategoryChecked == false) {
                        list++;
                    }

                })
                if (list == 0) {
                    $scope.selectAllCLObj.SelectAllChecked = true;
                }
                else {
                    $scope.selectAllCLObj.SelectAllChecked = false;
                }
            }
      
        };
       
        $scope.SelectAllSubcategories = function (item) {
            angular.forEach($scope.cat.CategoryDetails, function (aditem) {
                angular.forEach(aditem.SubCategoryDetails, function (ritem) {
                    ritem.IsSubChildCategoryChecked = $scope.selectAllCLObj.SelectAllChecked;
                    if (ritem.IsSubChildCategoryChecked) {
                        $scope.Softlenstab = true;
                        $scope.Rgplenstab = true;
                        item.Active = 'Y';
                        ritem.IsSubChildCategoryChecked = true;

                    }
                    else {
                        $scope.Softlenstab = false;
                        $scope.Rgplenstab = false;
                        item.Active = 'N';
                        ritem.IsSubChildCategoryChecked = false;
                    }
                });
            });
           
      
        }
   

        $scope.AddNewRGPContactobj = function (typeid) {
            if ($scope.RGPContactobj.BasicODDesignType != '' || $scope.RGPContactobj.BasicODColor != '' || $scope.RGPContactobj.BasicODProduct != ''

                || $scope.RGPContactobj.BasicODSeries != '' || $scope.RGPContactobj.BasicODBC != '' || $scope.RGPContactobj.BasicODDia != ''
                || $scope.RGPContactobj.BasicODSph != '' || $scope.RGPContactobj.BasicODCyl != '' || $scope.RGPContactobj.BasicODAxis != '' || $scope.RGPContactobj.BasicODAdd != ''
                || $scope.RGPContactobj.BasicOSSeries != '' || $scope.RGPContactobj.BasicOSBC != '' || $scope.RGPContactobj.BasicOSDia != ''
                || $scope.RGPContactobj.BasicOSSph != '' || $scope.RGPContactobj.BasicOSCyl != '' || $scope.RGPContactobj.BasicOSAxis != '' || $scope.RGPContactobj.BasicOSAdd != ''
                || $scope.RGPContactobj.BasicODVaDistance != '' || $scope.RGPContactobj.BasicODVaNear != '' || $scope.RGPContactobj.BasicODVaIntermediate != ''
                || $scope.RGPContactobj.BasicOSDesignType != '' || $scope.RGPContactobj.BasicOSColor != '' || $scope.RGPContactobj.BasicOSProduct != ''
                || $scope.RGPContactobj.BasicOSVaDistance != '' || $scope.RGPContactobj.BasicOSVaNear != '' || $scope.RGPContactobj.BasicOSVaIntermediate != ''
                || $scope.RGPContactobj.BasicOUVaDistance != '' || $scope.RGPContactobj.BasicOUVaNear != '' || $scope.RGPContactobj.BasicOUVaIntermediate != ''
                || $scope.RGPContactobj.AdvancedFitODComfort != '' || $scope.RGPContactobj.AdvancedFitODCentration != '' || $scope.RGPContactobj.AdvancedFitODCoverage != ''
                || $scope.RGPContactobj.AdvancedFitODMovement != '' || $scope.RGPContactobj.AdvancedFitODDegrees != '' || $scope.RGPContactobj.AdvancedFitODDirection != ''
                || $scope.RGPContactobj.AdvancedFitOSComfort != '' || $scope.RGPContactobj.AdvancedFitOSCentration != '' || $scope.RGPContactobj.AdvancedFitOSCoverage != ''
                || $scope.RGPContactobj.AdvancedFitOSMovement != '' || $scope.RGPContactobj.AdvancedFitOSDegrees != '' || $scope.RGPContactobj.AdvancedFitOSDirection != ''
                || $scope.RGPContactobj.AdvancedRefractionODSph != '' || $scope.RGPContactobj.AdvancedRefractionODCyl != '' || $scope.RGPContactobj.AdvancedRefractionODAxis != ''
                || $scope.RGPContactobj.AdvancedRefractionODVaDistance != '' || $scope.RGPContactobj.AdvancedRefractionODVaNear != '' || $scope.RGPContactobj.AdvancedRefractionODVaIntermediate != ''
                || $scope.RGPContactobj.AdvancedRefractionOSSph != '' || $scope.RGPContactobj.AdvancedRefractionOSCyl != '' || $scope.RGPContactobj.AdvancedRefractionOSAxis != ''
                || $scope.RGPContactobj.AdvancedRefractionOSVaDistance != '' || $scope.RGPContactobj.AdvancedRefractionOSVaNear != '' || $scope.RGPContactobj.AdvancedRefractionOSVaIntermediate != ''
                || $scope.RGPContactobj.AdvancedRefractionOUVaDistance != '' || $scope.RGPContactobj.AdvancedRefractionOUVaNear != '' || $scope.RGPContactobj.AdvancedRefractionOUVaIntermediate != ''
            ) {

                var Object = angular.copy($scope.RGPContactobj);

                let GivenByName = '';
                var Arraylist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.UserId }, true) || [];
                if (Arraylist.length > 0) {
                    GivenByName = Arraylist[0].SecondUserFullName;
                }

                if ($scope.obj.ContactLensDetails.length > 0) {
                    angular.forEach($scope.obj.ContactLensDetails, function (aitem) {
                        if (aitem.InvestigationId == 2078) {
                            Object.TypeId = $scope.RGPContactobj.TypeId;
                            Object.TypeName = $scope.RGPContactobj.TypeName;
                            Object.SubInvestigationId = $scope.RGPContactobj.TypeId;
                            Object.SubInvestigationName = $scope.RGPContactobj.TypeName;
                            Object.GivenByName = GivenByName;
                            Object.CreatedDateTime = $filter('date')(new Date(), 'MM-dd-yyyy,hh:mm a');
                            Object.Sno = $scope.RGPContactobj.Sno >= 0 ? $scope.RGPContactobj.Sno : null;

                            if (Object.Sno != null) {
                                if (aitem.InvestigationDetails.length > 0) {
                                    let templist = $filter("filter")(aitem.InvestigationDetails, function (item) { return item.Sno == $scope.RGPContactobj.Sno }, true) || [];
                                    if (templist.length > 0) {
                                        templist[0].BasicODDesignType = $scope.RGPContactobj.BasicODDesignType;
                                        templist[0].BasicODSph = $scope.RGPContactobj.BasicODSph;
                                        templist[0].BasicODCyl = $scope.RGPContactobj.BasicODCyl;
                                        templist[0].BasicODAxis = $scope.RGPContactobj.BasicODAxis;
                                        templist[0].BasicODBC = $scope.RGPContactobj.BasicODBC;
                                        templist[0].BasicODDia = $scope.RGPContactobj.BasicODDia;
                                        templist[0].BasicODKeratometry = $scope.RGPContactobj.BasicODKeratometry;
                                        templist[0].BasicODColor = $scope.RGPContactobj.BasicODColor;
                                        templist[0].BasicODProduct = $scope.RGPContactobj.BasicODProduct;
                                        templist[0].BasicODSeries = $scope.RGPContactobj.BasicODSeries;
                                        templist[0].BasicODAdd = $scope.RGPContactobj.BasicODAdd;
                                        templist[0].BasicODVaDistance = $scope.RGPContactobj.BasicODVaDistance;
                                        templist[0].BasicODVaNear = $scope.RGPContactobj.BasicODVaNear;
                                        templist[0].BasicODVaIntermediate = $scope.RGPContactobj.BasicODVaIntermediate;

                                        templist[0].BasicOSDesignType = $scope.RGPContactobj.BasicOSDesignType;
                                        templist[0].BasicOSSph = $scope.RGPContactobj.BasicOSSph;
                                        templist[0].BasicOSCyl = $scope.RGPContactobj.BasicOSCyl;
                                        templist[0].BasicOSAxis = $scope.RGPContactobj.BasicOSAxis;
                                        templist[0].BasicOSBC = $scope.RGPContactobj.BasicOSBC;
                                        templist[0].BasicOSDia = $scope.RGPContactobj.BasicOSDia;
                                        templist[0].BasicOSSeries = $scope.RGPContactobj.BasicOSSeries;
                                        templist[0].BasicOSAdd = $scope.RGPContactobj.BasicOSAdd;
                                        templist[0].BasicOSKeratometry = $scope.RGPContactobj.BasicOSKeratometry;
                                        templist[0].BasicOSColor = $scope.RGPContactobj.BasicOSColor;
                                        templist[0].BasicOSProduct = $scope.RGPContactobj.BasicOSProduct;
                                        templist[0].BasicOSVaDistance = $scope.RGPContactobj.BasicOSVaDistance;
                                        templist[0].BasicOSVaNear = $scope.RGPContactobj.BasicOSVaNear;
                                        templist[0].BasicOSVaIntermediate = $scope.RGPContactobj.BasicOSVaIntermediate;

                                        templist[0].BasicOUVaDistance = $scope.RGPContactobj.BasicOUVaDistance;
                                        templist[0].BasicOUVaNear = $scope.RGPContactobj.BasicOUVaNear;
                                        templist[0].BasicOUVaIntermediate = $scope.RGPContactobj.BasicOUVaIntermediate;
                                        templist[0].BasicRemarks = $scope.RGPContactobj.BasicRemarks || "";
                                        templist[0].BasicInstructions = $scope.RGPContactobj.BasicInstructions || "";
                                        templist[0].AdvancedRefractionRemarks = $scope.RGPContactobj.AdvancedRefractionRemarks || "";
                                        templist[0].GivenByName = GivenByName || "";
                                        templist[0].CreatedDateTime = $filter('date')(new Date(), 'MM-dd-yyyy,hh:mm a');
                                        templist[0].RxExpiration = $scope.RGPContactobj.RxExpiration || "";
                                        templist[0].ReplacementSchedule = $scope.RGPContactobj.ReplacementSchedule || "";

                                        templist[0].AdvancedFitODComfort = $scope.RGPContactobj.AdvancedFitODComfort || "";
                                        templist[0].AdvancedFitODCentration = $scope.RGPContactobj.AdvancedFitODCentration || "";
                                        templist[0].AdvancedFitODCoverage = $scope.RGPContactobj.AdvancedFitODCoverage || "";
                                        templist[0].AdvancedFitODMovement = $scope.RGPContactobj.AdvancedFitODMovement || "";
                                        templist[0].AdvancedFitODDegrees = $scope.RGPContactobj.AdvancedFitODDegrees || "";
                                        templist[0].AdvancedFitODDirection = $scope.RGPContactobj.AdvancedFitODDirection || "";
                                        templist[0].AdvancedRefractionODSph = $scope.RGPContactobj.AdvancedRefractionODSph || "";
                                        templist[0].AdvancedRefractionODCyl = $scope.RGPContactobj.AdvancedRefractionODCyl || "";
                                        templist[0].AdvancedRefractionODAxis = $scope.RGPContactobj.AdvancedRefractionODAxis || "";
                                        templist[0].AdvancedRefractionODVaDistance = $scope.RGPContactobj.AdvancedRefractionODVaDistance || "";
                                        templist[0].AdvancedRefractionODVaNear = $scope.RGPContactobj.AdvancedRefractionODVaNear || "";
                                        templist[0].AdvancedRefractionODVaIntermediate = $scope.RGPContactobj.AdvancedRefractionODVaIntermediate || "";

                                        templist[0].AdvancedFitOSComfort = $scope.RGPContactobj.AdvancedFitOSComfort || "";
                                        templist[0].AdvancedFitOSCentration = $scope.RGPContactobj.AdvancedFitOSCentration || "";
                                        templist[0].AdvancedFitOSCoverage = $scope.RGPContactobj.AdvancedFitOSCoverage || "";
                                        templist[0].AdvancedFitOSMovement = $scope.RGPContactobj.AdvancedFitOSMovement || "";
                                        templist[0].AdvancedFitOSDegrees = $scope.RGPContactobj.AdvancedFitOSDegrees || "";
                                        templist[0].AdvancedFitOSDirection = $scope.RGPContactobj.AdvancedFitOSDirection || "";
                                        templist[0].AdvancedRefractionOSSph = $scope.RGPContactobj.AdvancedRefractionOSSph || "";
                                        templist[0].AdvancedRefractionOSCyl = $scope.RGPContactobj.AdvancedRefractionOSCyl || "";
                                        templist[0].AdvancedRefractionOSAxis = $scope.RGPContactobj.AdvancedRefractionOSAxis || "";
                                        templist[0].AdvancedRefractionOSVaDistance = $scope.RGPContactobj.AdvancedRefractionOSVaDistance || "";
                                        templist[0].AdvancedRefractionOSVaNear = $scope.RGPContactobj.AdvancedRefractionOSVaNear || "";
                                        templist[0].AdvancedRefractionOSVaIntermediate = $scope.RGPContactobj.AdvancedRefractionOSVaIntermediate || "";

                                        templist[0].AdvancedRefractionOUVaDistance = $scope.RGPContactobj.AdvancedRefractionOUVaDistance || "";
                                        templist[0].AdvancedRefractionOUVaNear = $scope.RGPContactobj.AdvancedRefractionOUVaNear || "";
                                        templist[0].AdvancedRefractionOUVaIntermediate = $scope.RGPContactobj.AdvancedRefractionOUVaIntermediate || "";
                                        templist[0].ODSpecialInstructions = $scope.RGPContactobj.ODSpecialInstructions || "";
                                        templist[0].OSSpecialInstructions = $scope.RGPContactobj.OSSpecialInstructions || "";
                                        aitem.IsInvSummaryShow = true;
                                    }
                                }
                            }
                            else {
                                let index = aitem.InvestigationDetails.length;
                                Object.Sno = index;
                                aitem.InvestigationDetails.push(Object);
                            }
                        }
                    });
                }

                $scope.RGPContactobj = angular.copy($scope.GetRGPContactobj());
                if (typeid == 1) {
                    $scope.RGPContactobj.TypeId = 1;
                    $scope.RGPContactobj.TypeName = 'Wearing';
                } else if (typeid == 2) {
                    $scope.RGPContactobj.TypeId = 2;
                    $scope.RGPContactobj.TypeName = 'Trial';
                } else if (typeid == 3) {
                    $scope.RGPContactobj.TypeId = 3;
                    $scope.RGPContactobj.TypeName = 'Final';
                } else if (typeid == 4) {
                    $scope.RGPContactobj.TypeId = 4;
                    $scope.RGPContactobj.TypeName = 'DispensedTrial';
                }

            } else {
                alertify.error('Select any one value');
                return false;
            }

           
            $scope.RGPContactobj.SubLenstab = 1;
            $scope.CLSphericalListBoth = GetSphericalBothList();
            $scope.CLDesignTypeList = GetCLDesignTypeList();
            $scope.CLCylindricalListBoth = GetCylBothList();
            $scope.SphericalPlusList = GetSphericalPlusList();
            $scope.SphericalMinusList = GetSphericalMinusList();
            $scope.CylPlusList = GetCylPlusList();
            $scope.CylMinusList = GetCylMinusList();
            $scope.AxisPlusList = GetAxisPlusList();
            $scope.BCList = GetBCList();
            $scope.DiaList = GetDiaList();
            $scope.KeratometryList = GetKeratometryList();
            $scope.DistanceList = GetDistanceList();
            $scope.NearList = GetDistanceList();
            $scope.IntermediateList = GetDistanceList();
            $scope.CLColorList = GetColorList();
            $scope.CLProductList = GetProductList();
            $scope.MovementList = GetMovementList();
            $scope.DegreesList = GetDegreesList();
            $scope.CLDirectionList = GetDirectionList();
            $scope.CLCoverageList = GetCoverageList();
            $scope.CLCentrationList = GetCentrationList();
            $scope.CLComfortList = GetComfortList();
            $scope.AdvanceSphericalPlusList = GetSphericalPlusList();
            $scope.AdvanceSphericalMinusList = GetSphericalMinusList();
            $scope.AdvanceCylMinusList = GetCylMinusList();
            $scope.AdvanceAxisPlusList = GetAxisPlusList();
            $scope.AdvanceDistanceList = GetDistanceList();
            $scope.AdvanceNearList = GetDistanceList();
            $scope.AdvanceIntermediateList = GetDistanceList();
        }

        $scope.CopyRGPODtoOS = function (subLenstab, type) {
            if (subLenstab == 1) {
                $scope.RGPContactobj.BasicOSDesignType = angular.copy($scope.RGPContactobj.BasicODDesignType);
                $scope.RGPContactobj.BasicOSColor = angular.copy($scope.RGPContactobj.BasicODColor);
                $scope.RGPContactobj.BasicOSProduct = angular.copy($scope.RGPContactobj.BasicODProduct);
                $scope.RGPContactobj.BasicOSBC = angular.copy($scope.RGPContactobj.BasicODBC);
                $scope.RGPContactobj.BasicOSSeries = angular.copy($scope.RGPContactobj.BasicODSeries);
                $scope.RGPContactobj.BasicOSDia = angular.copy($scope.RGPContactobj.BasicODDia);
                $scope.RGPContactobj.BasicOSSph = angular.copy($scope.RGPContactobj.BasicODSph);
                $scope.RGPContactobj.BasicOSCyl = angular.copy($scope.RGPContactobj.BasicODCyl);
                $scope.RGPContactobj.BasicOSAxis = angular.copy($scope.RGPContactobj.BasicODAxis);
                $scope.RGPContactobj.BasicOSAdd = angular.copy($scope.RGPContactobj.BasicODAdd);
                $scope.RGPContactobj.BasicOSVaDistance = angular.copy($scope.RGPContactobj.BasicODVaDistance);
                $scope.RGPContactobj.BasicOSVaNear = angular.copy($scope.RGPContactobj.BasicODVaNear);
                $scope.RGPContactobj.BasicOSVaNear = angular.copy($scope.RGPContactobj.BasicODVaNear);
                $scope.RGPContactobj.BasicOSVaIntermediate = angular.copy($scope.RGPContactobj.BasicODVaIntermediate);
                $scope.RGPContactobj.OSSpecialInstructions = angular.copy($scope.RGPContactobj.ODSpecialInstructions);
            }
            if (subLenstab == 2 && type == 'Advance') {
                $scope.RGPContactobj.AdvancedFitOSComfort = angular.copy($scope.RGPContactobj.AdvancedFitODComfort);
                $scope.RGPContactobj.AdvancedFitOSCentration = angular.copy($scope.RGPContactobj.AdvancedFitODCentration);
                $scope.RGPContactobj.AdvancedFitOSCoverage = angular.copy($scope.RGPContactobj.AdvancedFitODCoverage);
                $scope.RGPContactobj.AdvancedFitOSMovement = angular.copy($scope.RGPContactobj.AdvancedFitODMovement);
                $scope.RGPContactobj.AdvancedFitOSDegrees = angular.copy($scope.RGPContactobj.AdvancedFitODDegrees);
                $scope.RGPContactobj.AdvancedFitOSDirection = angular.copy($scope.RGPContactobj.AdvancedFitODDirection);
                $scope.RGPContactobj.AdvancedRefractionOSSph = angular.copy($scope.RGPContactobj.AdvancedRefractionODSph);
                $scope.RGPContactobj.AdvancedRefractionOSCyl = angular.copy($scope.RGPContactobj.AdvancedRefractionODCyl);
                $scope.RGPContactobj.AdvancedRefractionOSAxis = angular.copy($scope.RGPContactobj.AdvancedRefractionODAxis);
                $scope.RGPContactobj.AdvancedRefractionOSVaDistance = angular.copy($scope.RGPContactobj.AdvancedRefractionODVaDistance);
                $scope.RGPContactobj.AdvancedRefractionOSVaNear = angular.copy($scope.RGPContactobj.AdvancedRefractionODVaNear);
                $scope.RGPContactobj.AdvancedRefractionOSVaIntermediate = angular.copy($scope.RGPContactobj.AdvancedRefractionODVaIntermediate);
            }
        }
        $scope.ChangeRGPType = function (Type, Id){
            

            $scope.RGPContactobj.SubLenstab = 1;
            $scope.RGPContactobj.SelectedEye = 'OD';


            $scope.CLSphericalListBoth = GetSphericalBothList();
            $scope.CLDesignTypeList = GetCLDesignTypeList();
            $scope.CLCylindricalListBoth = GetCylBothList();
            $scope.SphericalPlusList = GetSphericalPlusList();
            $scope.SphericalMinusList = GetSphericalMinusList();
            $scope.CylPlusList = GetCylPlusList();
            $scope.CylMinusList = GetCylMinusList();
            $scope.AxisPlusList = GetAxisPlusList();
            $scope.BCList = GetBCList();
            $scope.DiaList = GetDiaList();
            $scope.KeratometryList = GetKeratometryList();
            $scope.DistanceList = GetDistanceList();
            $scope.NearList = GetDistanceList();
            $scope.IntermediateList = GetDistanceList();
            $scope.CLColorList = GetColorList();
            $scope.CLProductList = GetProductList();
            $scope.MovementList = GetMovementList();
            $scope.DegreesList = GetDegreesList();
            $scope.CLDirectionList = GetDirectionList();
            $scope.CLCoverageList = GetCoverageList();
            $scope.CLCentrationList = GetCentrationList();
            $scope.CLComfortList = GetComfortList();

            if ($scope.RGPContactobj.BasicODDesignType == '' && $scope.RGPContactobj.BasicODSph == '' && $scope.RGPContactobj.BasicODCyl == '' && $scope.RGPContactobj.BasicODAxis == '' && $scope.RGPContactobj.BasicODBC == '' && $scope.RGPContactobj.BasicODDia == ''
                && $scope.RGPContactobj.BasicODKeratometry == '' && $scope.RGPContactobj.BasicODColor == '' && $scope.RGPContactobj.BasicODProduct == '' && $scope.RGPContactobj.BasicODVaDistance == '' && $scope.RGPContactobj.BasicODVaNear == '' && $scope.RGPContactobj.BasicODVaIntermediate == ''
                && $scope.RGPContactobj.BasicOSDesignType == '' && $scope.RGPContactobj.BasicOSSph == '' && $scope.RGPContactobj.BasicOSCyl == '' && $scope.RGPContactobj.BasicOSAxis == '' && $scope.RGPContactobj.BasicOSBC == '' && $scope.RGPContactobj.BasicOSDia == ''
                && $scope.RGPContactobj.BasicOSKeratometry == '' && $scope.RGPContactobj.BasicOSColor == '' && $scope.RGPContactobj.BasicOSProduct == '' && $scope.RGPContactobj.BasicOSVaDistance == '' && $scope.RGPContactobj.BasicOSVaNear == '' && $scope.RGPContactobj.BasicOSVaIntermediate == ''
                && $scope.RGPContactobj.BasicOUVaDistance == '' && $scope.RGPContactobj.BasicOUVaNear == '' && $scope.RGPContactobj.BasicOUVaIntermediate == '' && $scope.RGPContactobj.AdvancedFitODComfort == '' && $scope.RGPContactobj.AdvancedFitODCentration == '' && $scope.RGPContactobj.AdvancedFitODCoverage == ''
                && $scope.RGPContactobj.AdvancedFitODMovement == '' && $scope.RGPContactobj.AdvancedFitODDegrees == '' && $scope.RGPContactobj.AdvancedFitODDirection == '' && $scope.RGPContactobj.AdvancedFitOSComfort == '' && $scope.RGPContactobj.AdvancedFitOSCentration == '' && $scope.RGPContactobj.AdvancedFitOSCoverage == ''
                && $scope.RGPContactobj.AdvancedFitOSMovement == '' && $scope.RGPContactobj.AdvancedFitOSDegrees == '' && $scope.RGPContactobj.AdvancedFitOSDirection == '' && $scope.RGPContactobj.AdvancedRefractionODSph == '' && $scope.RGPContactobj.AdvancedRefractionODCyl == '' && $scope.RGPContactobj.AdvancedRefractionODAxis == ''
                && $scope.RGPContactobj.AdvancedRefractionODVaDistance == '' && $scope.RGPContactobj.AdvancedRefractionODVaNear == '' && $scope.RGPContactobj.AdvancedRefractionODVaIntermediate == '' && $scope.RGPContactobj.AdvancedRefractionOSSph == '' && $scope.RGPContactobj.AdvancedRefractionOSCyl == '' && $scope.RGPContactobj.AdvancedRefractionOSAxis == ''
                && $scope.RGPContactobj.AdvancedRefractionOSVaDistance == '' && $scope.RGPContactobj.AdvancedRefractionOSVaNear == '' && $scope.RGPContactobj.AdvancedRefractionOSVaIntermediate == '' && $scope.RGPContactobj.AdvancedRefractionOUVaDistance == '' && $scope.RGPContactobj.AdvancedRefractionOUVaNear == '' && $scope.RGPContactobj.AdvancedRefractionOUVaIntermediate == ''

            ) { }
            else {
                $scope.AddNewRGPContactobj();
            }

            $scope.RGPContactobj.TypeName = Type;
            $scope.RGPContactobj.TypeId = Id;
            $scope.RGPContactobj.RxExpiration = "";
            $scope.RGPContactobj.ReplacementSchedule = "";
        }

        $scope.changeRgpTab = function (tab) {
            $scope.rgpTabs = tab;
        };
        $scope.RGPsublensClick = function (subtab) {
            $scope.RGPContactobj.SubLenstab = subtab;
            $scope.RGPContactobj.SelectedEye = "OD";
        };
        $scope.ChangeRGPAdvancedtype = function (RGPobj) {
            $scope.RGPContactobj.SelectedEye = "OD";
        }

    

        $scope.ClearRGPDetails = function (mainid, subid, sno) {

            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to Clear This values?", function () {
                if ($scope.lenstab == 2) {
                    $scope.RGPContactobj = angular.copy($scope.GetRGPContactobj());
                    $scope.RGPContactobj.TypeId = mainid;
                    $scope.RGPContactobj.TypeName = mainid == 1 ? 'Wearing' : mainid == 2 ? 'Trial' : mainid == 3 ? 'Final' : mainid == 4 ? 'DispensedTrial' : '';
                    $scope.RGPContactobj.SubLenstab = subid;
                    $scope.RGPContactobj.Sno = sno;
                    $scope.CLDesignTypeList = GetCLDesignTypeList();
                    $scope.CLCylindricalListBoth = GetCylBothList();
                    $scope.SphericalPlusList = GetSphericalPlusList();
                    $scope.SphericalMinusList = GetSphericalMinusList();
                    $scope.CylPlusList = GetCylPlusList();
                    $scope.CylMinusList = GetCylMinusList();
                    $scope.AxisPlusList = GetAxisPlusList();
                    $scope.BCList = GetBCList();
                    $scope.DiaList = GetDiaList();
                    $scope.KeratometryList = GetKeratometryList();
                    $scope.DistanceList = GetDistanceList();
                    $scope.NearList = GetDistanceList();
                    $scope.IntermediateList = GetDistanceList();
                    $scope.CLColorList = GetColorList();
                    $scope.CLProductList = GetProductList();
                    $scope.MovementList = GetMovementList();
                    $scope.DegreesList = GetDegreesList();
                    $scope.CLDirectionList = GetDirectionList();
                    $scope.CLCoverageList = GetCoverageList();
                    $scope.CLCentrationList = GetCentrationList();
                    $scope.CLComfortList = GetComfortList();
                    $scope.AdvanceSphericalPlusList = GetSphericalPlusList();
                    $scope.AdvanceSphericalMinusList = GetSphericalMinusList();
                    $scope.AdvanceCylMinusList = GetCylMinusList();
                    $scope.AdvanceAxisPlusList = GetAxisPlusList();
                    $scope.AdvanceDistanceList = GetDistanceList();
                    $scope.AdvanceNearList = GetDistanceList();
                    $scope.AdvanceIntermediateList = GetDistanceList();
                }
                else {

                }
                $scope.$digest();
            }, function () {
                r = "You pressed Cancel!";
            });
        }

        $scope.EditRGPDetails = function (item, index, typeid, callFrom, actionSection) {

            $scope.RGPContactobj = angular.copy($scope.GetRGPContactobj());
            $scope.RGPContactobj.Sno = item.Sno;
            item.Sno = item.Sno;
            if (typeid == 1) {
                $scope.RGPContactobj.SubLenstab = 1;
            } else {
                $scope.RGPContactobj.SubLenstab = 2;
            } 
            $scope.RGPContactobj.BasicODSeries = item.BasicODSeries;
            $scope.RGPContactobj.BasicODBC = item.BasicODBC;
            $scope.RGPContactobj.BasicODDia = item.BasicODDia;
            $scope.RGPContactobj.BasicODSph = item.BasicODSph;
            $scope.RGPContactobj.BasicODCyl = item.BasicODCyl;
            $scope.RGPContactobj.BasicODAxis = item.BasicODAxis;
            $scope.RGPContactobj.BasicODDesignType = item.BasicODDesignType;
            $scope.RGPContactobj.BasicODColor = item.BasicODColor;
            $scope.RGPContactobj.BasicODProduct = item.BasicODProduct;
            $scope.RGPContactobj.BasicODVaDistance = item.BasicODVaDistance;
            $scope.RGPContactobj.BasicODVaNear = item.BasicODVaNear;
            $scope.RGPContactobj.BasicODVaIntermediate = item.BasicODVaIntermediate;
            $scope.RGPContactobj.BasicOSSeries = item.BasicOSSeries;
            $scope.RGPContactobj.BasicOSBC = item.BasicOSBC;
            $scope.RGPContactobj.BasicOSDia = item.BasicOSDia;
            $scope.RGPContactobj.BasicOSSph = item.BasicOSSph;
            $scope.RGPContactobj.BasicOSCyl = item.BasicOSCyl;
            $scope.RGPContactobj.BasicOSAxis = item.BasicOSAxis;
            $scope.RGPContactobj.BasicOSAdd = item.BasicOSAdd;
            $scope.RGPContactobj.BasicODAdd = item.BasicODAdd;

            $scope.RGPContactobj.BasicOSDesignType = item.BasicOSDesignType;
            $scope.RGPContactobj.BasicOSColor = item.BasicOSColor;
            $scope.RGPContactobj.BasicOSProduct = item.BasicOSProduct;
            $scope.RGPContactobj.BasicOSVaDistance = item.BasicOSVaDistance;
            $scope.RGPContactobj.BasicOSVaNear = item.BasicOSVaNear;
            $scope.RGPContactobj.BasicOSVaIntermediate = item.BasicOSVaIntermediate;

            $scope.RGPContactobj.BasicOUVaDistance = item.BasicOUVaDistance;
            $scope.RGPContactobj.BasicOUVaNear = item.BasicOUVaNear;
            $scope.RGPContactobj.BasicOUVaIntermediate = item.BasicOUVaIntermediate;

            $scope.RGPContactobj.BasicRemarks = item.BasicRemarks || "";
            $scope.RGPContactobj.BasicInstructions = item.BasicInstructions || "";
            $scope.RGPContactobj.AdvancedRefractionRemarks = item.AdvancedRefractionRemarks || "";
            $scope.RGPContactobj.TypeId = item.TypeId || null;
            $scope.RGPContactobj.TypeName = item.TypeName || "";
            $scope.RGPContactobj.SubInvestigationId = item.SubInvestigationId || null;
            $scope.RGPContactobj.SubInvestigationName = item.SubInvestigationName || "";
            $scope.RGPContactobj.RxExpiration = item.RxExpiration || "";
            $scope.RGPContactobj.ReplacementSchedule = item.ReplacementSchedule || "";

            if ($scope.RGPContactobj.BasicRemarks != "") {
                $scope.RGPContactobj.IsBasicRemarksInd = true;
            }
            if ($scope.RGPContactobj.BasicInstructions != "") {
                $scope.RGPContactobj.IsBasicInstructionsInd = true;
            }
            if ($scope.RGPContactobj.AdvancedRefractionRemarks != "") {
                $scope.RGPContactobj.IsAdvanceRemarksInd = true;
            }

            $scope.RGPContactobj.AdvancedFitODComfort = item.AdvancedFitODComfort || "";
            $scope.RGPContactobj.AdvancedFitODCentration = item.AdvancedFitODCentration || "";
            $scope.RGPContactobj.AdvancedFitODCoverage = item.AdvancedFitODCoverage || "";
            $scope.RGPContactobj.AdvancedFitODMovement = item.AdvancedFitODMovement || "";
            $scope.RGPContactobj.AdvancedFitODDegrees = item.AdvancedFitODDegrees || "";
            $scope.RGPContactobj.AdvancedFitODDirection = item.AdvancedFitODDirection || "";
            $scope.RGPContactobj.AdvancedRefractionODSph = item.AdvancedRefractionODSph || "";
            $scope.RGPContactobj.AdvancedRefractionODCyl = item.AdvancedRefractionODCyl || "";
            $scope.RGPContactobj.AdvancedRefractionODAxis = item.AdvancedRefractionODAxis || "";
            $scope.RGPContactobj.AdvancedRefractionODVaDistance = item.AdvancedRefractionODVaDistance || "";
            $scope.RGPContactobj.AdvancedRefractionODVaNear = item.AdvancedRefractionODVaNear || "";
            $scope.RGPContactobj.AdvancedRefractionODVaIntermediate = item.AdvancedRefractionODVaIntermediate || "";

            $scope.RGPContactobj.AdvancedFitOSComfort = item.AdvancedFitOSComfort || "";
            $scope.RGPContactobj.AdvancedFitOSCentration = item.AdvancedFitOSCentration || "";
            $scope.RGPContactobj.AdvancedFitOSCoverage = item.AdvancedFitOSCoverage || "";
            $scope.RGPContactobj.AdvancedFitOSMovement = item.AdvancedFitOSMovement || "";
            $scope.RGPContactobj.AdvancedFitOSDegrees = item.AdvancedFitOSDegrees || "";
            $scope.RGPContactobj.AdvancedFitOSDirection = item.AdvancedFitOSDirection || "";
            $scope.RGPContactobj.AdvancedRefractionOSSph = item.AdvancedRefractionOSSph || "";
            $scope.RGPContactobj.AdvancedRefractionOSCyl = item.AdvancedRefractionOSCyl || "";
            $scope.RGPContactobj.AdvancedRefractionOSAxis = item.AdvancedRefractionOSAxis || "";
            $scope.RGPContactobj.AdvancedRefractionOSVaDistance = item.AdvancedRefractionOSVaDistance || "";
            $scope.RGPContactobj.AdvancedRefractionOSVaNear = item.AdvancedRefractionOSVaNear || "";
            $scope.RGPContactobj.AdvancedRefractionOSVaIntermediate = item.AdvancedRefractionOSVaIntermediate || "";

            $scope.RGPContactobj.AdvancedRefractionOUVaDistance = item.AdvancedRefractionOUVaDistance || "";
            $scope.RGPContactobj.AdvancedRefractionOUVaNear = item.AdvancedRefractionOUVaNear || "";
            $scope.RGPContactobj.AdvancedRefractionOUVaIntermediate = item.AdvancedRefractionOUVaIntermediate || "";
            $scope.RGPContactobj.ODSpecialInstructions = item.ODSpecialInstructions || "";
            $scope.RGPContactobj.OSSpecialInstructions = item.OSSpecialInstructions || "";

            $scope.CLSphericalListBoth = GetSphericalBothList();
            $scope.CLDesignTypeList = GetCLDesignTypeList();
            $scope.CLCylindricalListBoth = GetCylBothList();
            $scope.SphericalPlusList = GetSphericalPlusList();
            $scope.SphericalMinusList = GetSphericalMinusList();
            $scope.CylPlusList = GetCylPlusList();
            $scope.CylMinusList = GetCylMinusList();
            $scope.AxisPlusList = GetAxisPlusList();
            $scope.BCList = GetBCList();
            $scope.DiaList = GetDiaList();
            $scope.KeratometryList = GetKeratometryList();
            $scope.DistanceList = GetDistanceList();
            $scope.NearList = GetDistanceList();
            $scope.IntermediateList = GetDistanceList();
            $scope.CLColorList = GetColorList();
            $scope.CLProductList = GetProductList();
            $scope.MovementList = GetMovementList();
            $scope.DegreesList = GetDegreesList();
            $scope.CLDirectionList = GetDirectionList();
            $scope.CLCoverageList = GetCoverageList();
            $scope.CLCentrationList = GetCentrationList();
            $scope.CLComfortList = GetComfortList();
            $scope.AdvanceSphericalPlusList = GetSphericalPlusList();
            $scope.AdvanceSphericalMinusList = GetSphericalMinusList();
            $scope.AdvanceCylMinusList = GetCylMinusList();
            $scope.AdvanceAxisPlusList = GetAxisPlusList();
            $scope.AdvanceDistanceList = GetDistanceList();
            $scope.AdvanceNearList = GetDistanceList();
            $scope.AdvanceIntermediateList = GetDistanceList();
            $scope.RGPContactobj.SelectedEye = "OD";
            $scope.AddtionList = GetAddtionList();
            // hightlight selected values
            if ($scope.RGPContactobj.BasicODSph !== "") {
                let tempSphArray = $filter('filter')($scope.SphericalPlusList, { "Value": $scope.RGPContactobj.BasicODSph }, true) || [];
                if (tempSphArray.length > 0) {
                    let tempSphObj = tempSphArray[0];
                    let SphIndex = $scope.SphericalPlusList.indexOf(tempSphObj);
                    $scope.SphericalPlusList[SphIndex].selected = true;
                    $scope.RGPContactobj.SphericalSwitch = 1;
                } else {
                    let tempSphArray = $filter('filter')($scope.SphericalMinusList, { "Value": $scope.RGPContactobj.BasicODSph }, true) || [];
                    if (tempSphArray.length > 0) {
                        let tempSphObj = tempSphArray[0];
                        let SphIndex = $scope.SphericalMinusList.indexOf(tempSphObj);
                        $scope.SphericalMinusList[SphIndex].selected = true;
                        $scope.RGPContactobj.SphericalSwitch = 2;
                    }
                }
            }
            if ($scope.RGPContactobj.BasicODCyl !== "") {
                let tempCylArray = $filter('filter')($scope.CylPlusList, { "Value": $scope.RGPContactobj.BasicODCyl }, true) || [];
                if (tempCylArray.length > 0) {
                    let tempCylObj = tempCylArray[0];
                    let CylIndex = $scope.CylPlusList.indexOf(tempCylObj);
                    $scope.CylPlusList[CylIndex].selected = true;
                    $scope.RGPContactobj.CylindricalSwitch = 1;
                } else {
                    let tempCylArray = $filter('filter')($scope.CylMinusList, { "Value": $scope.RGPContactobj.BasicODCyl }, true) || [];
                    if (tempCylArray.length > 0) {
                        let tempCylObj = tempCylArray[0];
                        let CylIndex = $scope.CylMinusList.indexOf(tempCylObj);
                        $scope.CylMinusList[CylIndex].selected = true;
                        $scope.RGPContactobj.CylindricalSwitch = 2;
                    }
                }
            }

            if ($scope.RGPContactobj.BasicODBC !== "") {
                let tempAxisArray = $filter('filter')($scope.BCList, { "Value": Number($scope.RGPContactobj.BasicODBC) }, true);
                if (tempAxisArray.length > 0) {
                    let tempAxisObj = tempAxisArray[0];
                    let AxisIndex = $scope.BCList.indexOf(tempAxisObj);
                    $scope.BCList[AxisIndex].selected = true;
                }
            }

            if ($scope.RGPContactobj.BasicODDia !== "") {
                let tempAxisArray = $filter('filter')($scope.DiaList, { "Value": Number($scope.RGPContactobj.BasicODDia) }, true);
                if (tempAxisArray.length > 0) {
                    let tempAxisObj = tempAxisArray[0];
                    let AxisIndex = $scope.DiaList.indexOf(tempAxisObj);
                    $scope.DiaList[AxisIndex].selected = true;
                }
            }
            if ($scope.RGPContactobj.BasicODCyl !== "") {
                let tempAxisArray = $filter('filter')($scope.CLCylindricalListBoth, { "Value": $scope.RGPContactobj.BasicODCyl }, true);
                if (tempAxisArray.length > 0) {
                    let tempAxisObj = tempAxisArray[0];
                    let AxisIndex = $scope.CLCylindricalListBoth.indexOf(tempAxisObj);
                    $scope.CLCylindricalListBoth[AxisIndex].selected = true;
                }
            }

            if ($scope.RGPContactobj.BasicODAxis !== "") {
                let tempAxisArray = $filter('filter')($scope.AxisPlusList, { "Value": $scope.RGPContactobj.BasicODAxis }, true);
                if (tempAxisArray.length > 0) {
                    let tempAxisObj = tempAxisArray[0];
                    let AxisIndex = $scope.AxisPlusList.indexOf(tempAxisObj);
                    $scope.AxisPlusList[AxisIndex].selected = true;
                }
            }

            if ($scope.RGPContactobj.BasicODAdd !== "") {
                let tempAxisArray = $filter('filter')($scope.AddtionList, { "Value": $scope.RGPContactobj.BasicODAdd }, true);
                if (tempAxisArray.length > 0) {
                    let tempAxisObj = tempAxisArray[0];
                    let AxisIndex = $scope.AddtionList.indexOf(tempAxisObj);
                    $scope.AddtionList[AxisIndex].selected = true;
                }
            }

            if ($scope.RGPContactobj.BasicODDesignType !== "") {
                let tempAxisArray = $filter('filter')($scope.CLDesignTypeList, { "Value": $scope.RGPContactobj.BasicODDesignType }, true);
                if (tempAxisArray.length > 0) {
                    let tempAxisObj = tempAxisArray[0];
                    let AxisIndex = $scope.CLDesignTypeList.indexOf(tempAxisObj);
                    $scope.CLDesignTypeList[AxisIndex].selected = true;
                }
            }
            if ($scope.RGPContactobj.BasicODColor !== "") {
                let tempAxisArray = $filter('filter')($scope.CLColorList, { "Value": $scope.RGPContactobj.BasicODColor }, true) || [];
                if (tempAxisArray.length > 0) {
                    let tempAxisObj = tempAxisArray[0];
                    let AxisIndex = $scope.CLColorList.indexOf(tempAxisObj);
                    $scope.CLColorList[AxisIndex].selected = true;
                }
            }
            if ($scope.RGPContactobj.BasicODProduct !== "") {
                let tempAxisArray = $filter('filter')($scope.CLProductList, { "Value": $scope.RGPContactobj.BasicODProduct }, true) || [];
                if (tempAxisArray.length > 0) {
                    let tempAxisObj = tempAxisArray[0];
                    let AxisIndex = $scope.CLProductList.indexOf(tempAxisObj);
                    $scope.CLProductList[AxisIndex].selected = true;
                }
            }
            if ($scope.RGPContactobj.BasicODVaDistance !== "") {
                let tempAxisArray = $filter('filter')($scope.DistanceList, { "Value": $scope.RGPContactobj.BasicODVaDistance }, true) || [];
                if (tempAxisArray.length > 0) {
                    let tempAxisObj = tempAxisArray[0];
                    let AxisIndex = $scope.DistanceList.indexOf(tempAxisObj);
                    $scope.DistanceList[AxisIndex].selected = true;
                }
            }
            if ($scope.RGPContactobj.BasicODVaNear !== "") {
                let tempAxisArray = $filter('filter')($scope.NearList, { "Value": $scope.RGPContactobj.BasicODVaNear }, true) || [];
                if (tempAxisArray.length > 0) {
                    let tempAxisObj = tempAxisArray[0];
                    let AxisIndex = $scope.NearList.indexOf(tempAxisObj);
                    $scope.NearList[AxisIndex].selected = true;
                }
            }
            if ($scope.RGPContactobj.BasicODVaIntermediate !== "") {
                let tempAxisArray = $filter('filter')($scope.IntermediateList, { "Value": $scope.RGPContactobj.BasicODVaIntermediate }, true) || [];
                if (tempAxisArray.length > 0) {
                    let tempAxisObj = tempAxisArray[0];
                    let AxisIndex = $scope.IntermediateList.indexOf(tempAxisObj);
                    $scope.IntermediateList[AxisIndex].selected = true;
                }
            }

            if ($scope.RGPContactobj.AdvancedFitODComfort !== "") {
                let tempAxisArray = $filter('filter')($scope.CLComfortList, { "Value": $scope.RGPContactobj.AdvancedFitODComfort }, true) || [];
                if (tempAxisArray.length > 0) {
                    let tempAxisObj = tempAxisArray[0];
                    let AxisIndex = $scope.CLComfortList.indexOf(tempAxisObj);
                    $scope.CLComfortList[AxisIndex].selected = true;
                }
            }
            if ($scope.RGPContactobj.AdvancedFitODCentration !== "") {
                let tempAxisArray = $filter('filter')($scope.CLCentrationList, { "Value": $scope.RGPContactobj.AdvancedFitODCentration }, true) || [];
                if (tempAxisArray.length > 0) {
                    let tempAxisObj = tempAxisArray[0];
                    let AxisIndex = $scope.CLCentrationList.indexOf(tempAxisObj);
                    $scope.CLCentrationList[AxisIndex].selected = true;
                }
            }
            if ($scope.RGPContactobj.AdvancedFitODCoverage !== "") {
                let tempAxisArray = $filter('filter')($scope.CLCoverageList, { "Value": $scope.RGPContactobj.AdvancedFitODCoverage }, true) || [];
                if (tempAxisArray.length > 0) {
                    let tempAxisObj = tempAxisArray[0];
                    let AxisIndex = $scope.CLCoverageList.indexOf(tempAxisObj);
                    $scope.CLCoverageList[AxisIndex].selected = true;
                }
            }
            if ($scope.RGPContactobj.AdvancedFitODMovement !== "") {
                let tempAxisArray = $filter('filter')($scope.MovementList, { "Value": $scope.RGPContactobj.AdvancedFitODMovement }, true) || [];
                if (tempAxisArray.length > 0) {
                    let tempAxisObj = tempAxisArray[0];
                    let AxisIndex = $scope.MovementList.indexOf(tempAxisObj);
                    $scope.MovementList[AxisIndex].selected = true;
                }
            }
            if ($scope.RGPContactobj.AdvancedFitODDegrees !== "") {
                let tempAxisArray = $filter('filter')($scope.DegreesList, { "Value": $scope.RGPContactobj.AdvancedFitODDegrees }, true) || [];
                if (tempAxisArray.length > 0) {
                    let tempAxisObj = tempAxisArray[0];
                    let AxisIndex = $scope.DegreesList.indexOf(tempAxisObj);
                    $scope.DegreesList[AxisIndex].selected = true;
                }
            }
            if ($scope.RGPContactobj.AdvancedFitODDirection !== "") {
                let tempAxisArray = $filter('filter')($scope.CLDirectionList, { "Value": $scope.RGPContactobj.AdvancedFitODDirection }, true) || [];
                if (tempAxisArray.length > 0) {
                    let tempAxisObj = tempAxisArray[0];
                    let AxisIndex = $scope.CLDirectionList.indexOf(tempAxisObj);
                    $scope.CLDirectionList[AxisIndex].selected = true;
                }
            }
            if ($scope.RGPContactobj.AdvancedRefractionODSph !== "") {
                let tempAxisArray = $filter('filter')($scope.AdvanceSphericalMinusList, { "Value": $scope.RGPContactobj.AdvancedRefractionODSph }, true) || [];
                if (tempAxisArray.length > 0) {
                    let tempAxisObj = tempAxisArray[0];
                    let AxisIndex = $scope.AdvanceSphericalMinusList.indexOf(tempAxisObj);
                    $scope.AdvanceSphericalMinusList[AxisIndex].selected = true;
                }
            }
            if ($scope.RGPContactobj.AdvancedRefractionODCyl !== "") {
                let tempAxisArray = $filter('filter')($scope.AdvanceCylMinusList, { "Value": $scope.RGPContactobj.AdvancedRefractionODCyl }, true) || [];
                if (tempAxisArray.length > 0) {
                    let tempAxisObj = tempAxisArray[0];
                    let AxisIndex = $scope.AdvanceCylMinusList.indexOf(tempAxisObj);
                    $scope.AdvanceCylMinusList[AxisIndex].selected = true;
                }
            }
            if ($scope.RGPContactobj.AdvancedRefractionODAxis !== "") {
                let tempAxisArray = $filter('filter')($scope.AdvanceAxisPlusList, { "Value": $scope.RGPContactobj.AdvancedRefractionODAxis }, true) || [];
                if (tempAxisArray.length > 0) {
                    let tempAxisObj = tempAxisArray[0];
                    let AxisIndex = $scope.AdvanceAxisPlusList.indexOf(tempAxisObj);
                    $scope.AdvanceAxisPlusList[AxisIndex].selected = true;
                }
            }
            if ($scope.RGPContactobj.AdvancedRefractionODVaDistance !== "") {
                let tempAxisArray = $filter('filter')($scope.AdvanceDistanceList, { "Value": $scope.RGPContactobj.AdvancedRefractionODVaDistance }, true) || [];
                if (tempAxisArray.length > 0) {
                    let tempAxisObj = tempAxisArray[0];
                    let AxisIndex = $scope.AdvanceDistanceList.indexOf(tempAxisObj);
                    $scope.AdvanceDistanceList[AxisIndex].selected = true;
                }
            }
            if ($scope.RGPContactobj.AdvancedRefractionODVaNear !== "") {
                let tempAxisArray = $filter('filter')($scope.AdvanceNearList, { "Value": $scope.RGPContactobj.AdvancedRefractionODVaNear }, true) || [];
                if (tempAxisArray.length > 0) {
                    let tempAxisObj = tempAxisArray[0];
                    let AxisIndex = $scope.AdvanceNearList.indexOf(tempAxisObj);
                    $scope.AdvanceNearList[AxisIndex].selected = true;
                }
            }
            if ($scope.RGPContactobj.AdvancedRefractionODVaIntermediate !== "") {
                let tempAxisArray = $filter('filter')($scope.AdvanceIntermediateList, { "Value": $scope.RGPContactobj.AdvancedRefractionODVaIntermediate }, true) || [];
                if (tempAxisArray.length > 0) {
                    let tempAxisObj = tempAxisArray[0];
                    let AxisIndex = $scope.AdvanceIntermediateList.indexOf(tempAxisObj);
                    $scope.AdvanceIntermediateList[AxisIndex].selected = true;
                }
            }

            callFrom = callFrom || "";
            actionSection = actionSection || "";
            $scope.CloseGridPopupIfSectionChanged(
                callFrom,
                actionSection
            );
            $scope.RefreshGridAfterAction();
        }
        function pushIfValue(arr, label, value) {
            if (value !== null && value !== undefined && value !== "") {
                arr.push(`${label} : ${value}`);
            }
        }

        function formatContactLensCopy(item) {

            if (!item) return "";

            let lines = [];

           /////////BASIC////////////
            let basicOD = [];
            let basicOS = [];
            let basicOU = [];

            pushIfValue(basicOD, "Manufacturer", item.BasicODProduct);
            pushIfValue(basicOD, "Series", item.BasicODSeries);
            pushIfValue(basicOD, "BC", item.BasicODBC);
            pushIfValue(basicOD, "Diameter", item.BasicODDia);
            pushIfValue(basicOD, "Colour", item.BasicODColor);
            pushIfValue(basicOD, "Design Type", item.BasicODDesignType);
            pushIfValue(basicOD, "Sph", item.BasicODSph);
            pushIfValue(basicOD, "Cyl", item.BasicODCyl);
            pushIfValue(basicOD, "Axis", item.BasicODAxis);
            pushIfValue(basicOD, "Add", item.BasicODAdd);
            pushIfValue(basicOD, "VA (D)", item.BasicODVaDistance);
            pushIfValue(basicOD, "VA (N)", item.BasicODVaNear);
            pushIfValue(basicOD, "VA (I)", item.BasicODVaIntermediate);

            pushIfValue(basicOS, "Manufacturer", item.BasicOSProduct);
            pushIfValue(basicOS, "Series", item.BasicOSSeries);
            pushIfValue(basicOS, "BC", item.BasicOSBC);
            pushIfValue(basicOS, "Diameter", item.BasicOSDia);
            pushIfValue(basicOS, "Colour", item.BasicOSColor);
            pushIfValue(basicOS, "Design Type", item.BasicOSDesignType);
            pushIfValue(basicOS, "Sph", item.BasicOSSph);
            pushIfValue(basicOS, "Cyl", item.BasicOSCyl);
            pushIfValue(basicOS, "Axis", item.BasicOSAxis);
            pushIfValue(basicOS, "Add", item.BasicOSAdd);
            pushIfValue(basicOS, "VA (D)", item.BasicOSVaDistance);
            pushIfValue(basicOS, "VA (N)", item.BasicOSVaNear);
            pushIfValue(basicOS, "VA (I)", item.BasicOSVaIntermediate);

            pushIfValue(basicOU, "VA (D)", item.BasicOUVaDistance);
            pushIfValue(basicOU, "VA (N)", item.BasicOUVaNear);
            pushIfValue(basicOU, "VA (I)", item.BasicOUVaIntermediate);

            if (basicOD.length || basicOS.length || basicOU.length || item.BasicRemarks || item.BasicInstructions) {
                lines.push("Basic");

                if (basicOD.length) lines.push(`OD - ${basicOD.join(" , ")}`);
                if (basicOS.length) lines.push(`OS - ${basicOS.join(" , ")}`);
                if (basicOU.length) lines.push(`OU - ${basicOU.join(" , ")}`);

                if (item.BasicRemarks) lines.push(`Notes : ${item.BasicRemarks}`);
                if (item.BasicInstructions) lines.push(`Wearing Instructions : ${item.BasicInstructions}`);
                if (item.RxExpiration) lines.push(`Rx.Expiration : ${item.RxExpiration}`);
                if (item.ReplacementSchedule) lines.push(`Replacement Schedule : ${item.ReplacementSchedule}`);
            }
               //////ADVANCE////////////
            let advFitOD = [];
            let advFitOS = [];
            let advRefOD = [];
            let advRefOS = [];
            let advRefOU = [];

            pushIfValue(advFitOD, "Comfort", item.AdvancedFitODComfort);
            pushIfValue(advFitOD, "Centration", item.AdvancedFitODCentration);
            pushIfValue(advFitOD, "Coverage", item.AdvancedFitODCoverage);
            pushIfValue(advFitOD, "Movement", item.AdvancedFitODMovement);
            pushIfValue(advFitOD, "Degree", item.AdvancedFitODDegrees);
            pushIfValue(advFitOD, "Direction", item.AdvancedFitODDirection);

            pushIfValue(advFitOS, "Comfort", item.AdvancedFitOSComfort);
            pushIfValue(advFitOS, "Centration", item.AdvancedFitOSCentration);
            pushIfValue(advFitOS, "Coverage", item.AdvancedFitOSCoverage);
            pushIfValue(advFitOS, "Movement", item.AdvancedFitOSMovement);
            pushIfValue(advFitOS, "Degree", item.AdvancedFitOSDegrees);
            pushIfValue(advFitOS, "Direction", item.AdvancedFitOSDirection);

            pushIfValue(advRefOD, "Sph", item.AdvancedRefractionODSph);
            pushIfValue(advRefOD, "Cyl", item.AdvancedRefractionODCyl);
            pushIfValue(advRefOD, "Axis", item.AdvancedRefractionODAxis);
            pushIfValue(advRefOD, "Add", item.AdvancedRefractionODAdd);
            pushIfValue(advRefOD, "VA (D)", item.AdvancedRefractionODVaDistance);
            pushIfValue(advRefOD, "VA (N)", item.AdvancedRefractionODVaNear);
            pushIfValue(advRefOD, "VA (I)", item.AdvancedRefractionODVaIntermediate);

            pushIfValue(advRefOS, "Sph", item.AdvancedRefractionOSSph);
            pushIfValue(advRefOS, "Cyl", item.AdvancedRefractionOSCyl);
            pushIfValue(advRefOS, "Axis", item.AdvancedRefractionOSAxis);
            pushIfValue(advRefOS, "Add", item.AdvancedRefractionOSAdd);
            pushIfValue(advRefOS, "VA (D)", item.AdvancedRefractionOSVaDistance);
            pushIfValue(advRefOS, "VA (N)", item.AdvancedRefractionOSVaNear);
            pushIfValue(advRefOS, "VA (I)", item.AdvancedRefractionOSVaIntermediate);

            pushIfValue(advRefOU, "VA (D)", item.AdvancedRefractionOUVaDistance);
            pushIfValue(advRefOU, "VA (N)", item.AdvancedRefractionOUVaNear);
            pushIfValue(advRefOU, "VA (I)", item.AdvancedRefractionOUVaIntermediate);

            if (
                advFitOD.length || advFitOS.length ||
                advRefOD.length || advRefOS.length || advRefOU.length ||
                item.AdvancedRefractionRemarks
            ) {
                lines.push("");
                lines.push("Advance");

                if (advFitOD.length || advFitOS.length) {
                    lines.push("Fit");
                    if (advFitOD.length) lines.push(`OD - ${advFitOD.join(" , ")}`);
                    if (advFitOS.length) lines.push(`OS - ${advFitOS.join(" , ")}`);
                }

                if (advRefOD.length || advRefOS.length || advRefOU.length) {
                    lines.push("Over Refraction");
                    if (advRefOD.length) lines.push(`OD - ${advRefOD.join(" , ")}`);
                    if (advRefOS.length) lines.push(`OS - ${advRefOS.join(" , ")}`);
                    if (advRefOU.length) lines.push(`OU - ${advRefOU.join(" , ")}`);
                }

                if (item.AdvancedRefractionRemarks)
                    lines.push(`Notes : ${item.AdvancedRefractionRemarks}`);
            }

            return lines.join("\n");
        }

        $scope.CopyRGPDetails = function (item, index, typeid, callFrom, actionSection) {
            $scope.LogObj.LogArray = [];
            var confirmationMessage = "Are you sure you want to copy " + item.SubInvestigationName + " values";
            if ($scope.lenstab == 2) {
                var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>" + confirmationMessage + ' into ' + $scope.RGPContactobj.TypeName + '?' + "</h4>", function () {

                    $scope.RGPContactobj.Sno = null;
                    if (typeid == 1) {
                        $scope.RGPContactobj.SubLenstab = 1;
                    } else {
                        $scope.RGPContactobj.SubLenstab = 2;
                    }
                    $scope.RGPContactobj.BasicODDesignType = item.BasicODDesignType || "";
                    $scope.RGPContactobj.BasicODColor = item.BasicODColor || "";
                    $scope.RGPContactobj.BasicODProduct = item.BasicODProduct || "";
                    $scope.RGPContactobj.BasicODVaDistance = item.BasicODVaDistance || "";
                    $scope.RGPContactobj.BasicODVaNear = item.BasicODVaNear || "";
                    $scope.RGPContactobj.BasicODVaIntermediate = item.BasicODVaIntermediate || "";

                    $scope.RGPContactobj.BasicODSeries = item.BasicODSeries || "";
                    $scope.RGPContactobj.BasicODBC = item.BasicODBC || "";
                    $scope.RGPContactobj.BasicODDia = item.BasicODDia || "";
                    $scope.RGPContactobj.BasicODSph = item.BasicODSph || "";
                    $scope.RGPContactobj.BasicODCyl = item.BasicODCyl || "";
                    $scope.RGPContactobj.BasicODAxis = item.BasicODAxis || "";
                    $scope.RGPContactobj.BasicODAdd = item.BasicODAdd || "";
                    $scope.RGPContactobj.BasicOSSeries = item.BasicOSSeries || "";
                    $scope.RGPContactobj.BasicOSBC = item.BasicOSBC || "";
                    $scope.RGPContactobj.BasicOSDia = item.BasicOSDia || "";
                    $scope.RGPContactobj.BasicOSSph = item.BasicOSSph || "";
                    $scope.RGPContactobj.BasicOSCyl = item.BasicOSCyl || "";
                    $scope.RGPContactobj.BasicOSAxis = item.BasicOSAxis || "";
                    $scope.RGPContactobj.BasicOSAdd = item.BasicOSAdd || "";
                    $scope.RGPContactobj.BasicOSDesignType = item.BasicOSDesignType || "";
                    $scope.RGPContactobj.BasicOSColor = item.BasicOSColor || "";
                    $scope.RGPContactobj.BasicOSProduct = item.BasicOSProduct || "";
                    $scope.RGPContactobj.BasicOSVaDistance = item.BasicOSVaDistance || "";
                    $scope.RGPContactobj.BasicOSVaNear = item.BasicOSVaNear || "";
                    $scope.RGPContactobj.BasicOSVaIntermediate = item.BasicOSVaIntermediate || "";

                    $scope.RGPContactobj.BasicOUVaDistance = item.BasicOUVaDistance || "";
                    $scope.RGPContactobj.BasicOUVaNear = item.BasicOUVaNear || "";
                    $scope.RGPContactobj.BasicOUVaIntermediate = item.BasicOUVaIntermediate || "";

                    $scope.RGPContactobj.BasicRemarks = item.BasicRemarks || "";
                    $scope.RGPContactobj.BasicInstructions = item.BasicInstructions || "";
                    $scope.RGPContactobj.AdvancedRefractionRemarks = item.AdvancedRefractionRemarks || "";
                    $scope.RGPContactobj.RxExpiration = item.RxExpiration || "";
                    $scope.RGPContactobj.ReplacementSchedule = item.ReplacementSchedule || "";

                    if ($scope.RGPContactobj.BasicRemarks != "") {
                        $scope.RGPContactobj.IsBasicRemarksInd = true;
                    }
                    if ($scope.RGPContactobj.BasicInstructions != "") {
                        $scope.RGPContactobj.IsBasicInstructionsInd = true;
                    }
                    if ($scope.RGPContactobj.AdvancedRefractionRemarks != "") {
                        $scope.RGPContactobj.IsAdvanceRemarksInd = true;
                    }

                    $scope.RGPContactobj.AdvancedFitODComfort = item.AdvancedFitODComfort || "";
                    $scope.RGPContactobj.AdvancedFitODCentration = item.AdvancedFitODCentration || "";
                    $scope.RGPContactobj.AdvancedFitODCoverage = item.AdvancedFitODCoverage || "";
                    $scope.RGPContactobj.AdvancedFitODMovement = item.AdvancedFitODMovement || "";
                    $scope.RGPContactobj.AdvancedFitODDegrees = item.AdvancedFitODDegrees || "";
                    $scope.RGPContactobj.AdvancedFitODDirection = item.AdvancedFitODDirection || "";
                    $scope.RGPContactobj.AdvancedRefractionODSph = item.AdvancedRefractionODSph || "";
                    $scope.RGPContactobj.AdvancedRefractionODCyl = item.AdvancedRefractionODCyl || "";
                    $scope.RGPContactobj.AdvancedRefractionODAxis = item.AdvancedRefractionODAxis || "";
                    $scope.RGPContactobj.AdvancedRefractionODVaDistance = item.AdvancedRefractionODVaDistance || "";
                    $scope.RGPContactobj.AdvancedRefractionODVaNear = item.AdvancedRefractionODVaNear || "";
                    $scope.RGPContactobj.AdvancedRefractionODVaIntermediate = item.AdvancedRefractionODVaIntermediate || "";

                    $scope.RGPContactobj.AdvancedFitOSComfort = item.AdvancedFitOSComfort || "";
                    $scope.RGPContactobj.AdvancedFitOSCentration = item.AdvancedFitOSCentration || "";
                    $scope.RGPContactobj.AdvancedFitOSCoverage = item.AdvancedFitOSCoverage || "";
                    $scope.RGPContactobj.AdvancedFitOSMovement = item.AdvancedFitOSMovement || "";
                    $scope.RGPContactobj.AdvancedFitOSDegrees = item.AdvancedFitOSDegrees || "";
                    $scope.RGPContactobj.AdvancedFitOSDirection = item.AdvancedFitOSDirection || "";
                    $scope.RGPContactobj.AdvancedRefractionOSSph = item.AdvancedRefractionOSSph || "";
                    $scope.RGPContactobj.AdvancedRefractionOSCyl = item.AdvancedRefractionOSCyl || "";
                    $scope.RGPContactobj.AdvancedRefractionOSAxis = item.AdvancedRefractionOSAxis || "";
                    $scope.RGPContactobj.AdvancedRefractionOSVaDistance = item.AdvancedRefractionOSVaDistance || "";
                    $scope.RGPContactobj.AdvancedRefractionOSVaNear = item.AdvancedRefractionOSVaNear || "";
                    $scope.RGPContactobj.AdvancedRefractionOSVaIntermediate = item.AdvancedRefractionOSVaIntermediate || "";

                    $scope.RGPContactobj.AdvancedRefractionOUVaDistance = item.AdvancedRefractionOUVaDistance || "";
                    $scope.RGPContactobj.AdvancedRefractionOUVaNear = item.AdvancedRefractionOUVaNear || "";
                    $scope.RGPContactobj.AdvancedRefractionOUVaIntermediate = item.AdvancedRefractionOUVaIntermediate || "";

                    $scope.RGPContactobj.ODSpecialInstructions = item.ODSpecialInstructions || "";
                    $scope.RGPContactobj.OSSpecialInstructions = item.OSSpecialInstructions || "";

                    //Logs//
                    let copyText = formatContactLensCopy(item);
                    if (copyText && copyText.trim() !== "") {
                        let LogItem = {
                            "LogId": 0,
                            "ModuleId": 1,
                            "ModuleName": "OUTPatient",
                            "SubModuleId": 51,
                            "SubModuleName": "Contact Lens",
                            "ScreenType": "RGP Lens",
                            "ActionType": "Accessed",
                            "OldActionDescription": "",
                            "NewActionDescription": `Copy ${item.SubInvestigationName} values into ${$scope.RGPContactobj.TypeName}\n` +
                                `Copied values are:\n${copyText}`,
                        }
                        $scope.AddAuditLogNew(LogItem);

                    }
                    //Logs//
                    $scope.CLSphericalListBoth = GetSphericalBothList();
                    $scope.CLDesignTypeList = GetCLDesignTypeList();
                    $scope.CLCylindricalListBoth = GetCylBothList();
                    $scope.SphericalPlusList = GetSphericalPlusList();
                    $scope.SphericalMinusList = GetSphericalMinusList();
                    $scope.CylPlusList = GetCylPlusList();
                    $scope.CylMinusList = GetCylMinusList();
                    $scope.AxisPlusList = GetAxisPlusList();
                    $scope.BCList = GetBCList();
                    $scope.DiaList = GetDiaList();
                    $scope.KeratometryList = GetKeratometryList();
                    $scope.DistanceList = GetDistanceList();
                    $scope.NearList = GetDistanceList();
                    $scope.IntermediateList = GetDistanceList();
                    $scope.CLColorList = GetColorList();
                    $scope.CLProductList = GetProductList();
                    $scope.MovementList = GetMovementList();
                    $scope.DegreesList = GetDegreesList();
                    $scope.CLDirectionList = GetDirectionList();
                    $scope.CLCoverageList = GetCoverageList();
                    $scope.CLCentrationList = GetCentrationList();
                    $scope.CLComfortList = GetComfortList();
                    $scope.AdvanceSphericalPlusList = GetSphericalPlusList();
                    $scope.AdvanceSphericalMinusList = GetSphericalMinusList();
                    $scope.AdvanceCylMinusList = GetCylMinusList();
                    $scope.AdvanceAxisPlusList = GetAxisPlusList();
                    $scope.AdvanceDistanceList = GetDistanceList();
                    $scope.AdvanceNearList = GetDistanceList();
                    $scope.AdvanceIntermediateList = GetDistanceList();
                    $scope.RGPContactobj.SelectedEye = "OD";

                    // hightlight selected values

                    if ($scope.RGPContactobj.BasicODSph !== "") {
                        let tempSphArray = $filter('filter')($scope.SphericalPlusList, { "Value": $scope.RGPContactobj.BasicODSph }, true) || [];
                        if (tempSphArray.length > 0) {
                            let tempSphObj = tempSphArray[0];
                            let SphIndex = $scope.SphericalPlusList.indexOf(tempSphObj);
                            $scope.SphericalPlusList[SphIndex].selected = true;
                            $scope.RGPContactobj.SphericalSwitch = 1;
                        } else {
                            let tempSphArray = $filter('filter')($scope.SphericalMinusList, { "Value": $scope.RGPContactobj.BasicODSph }, true) || [];
                            if (tempSphArray.length > 0) {
                                let tempSphObj = tempSphArray[0];
                                let SphIndex = $scope.SphericalMinusList.indexOf(tempSphObj);
                                $scope.SphericalMinusList[SphIndex].selected = true;
                                $scope.RGPContactobj.SphericalSwitch = 2;
                            }
                        }
                    }
                    if ($scope.RGPContactobj.BasicODCyl !== "") {
                        let tempCylArray = $filter('filter')($scope.CylPlusList, { "Value": $scope.RGPContactobj.BasicODCyl }, true) || [];
                        if (tempCylArray.length > 0) {
                            let tempCylObj = tempCylArray[0];
                            let CylIndex = $scope.CylPlusList.indexOf(tempCylObj);
                            $scope.CylPlusList[CylIndex].selected = true;
                            $scope.RGPContactobj.CylindricalSwitch = 1;
                        } else {
                            let tempCylArray = $filter('filter')($scope.CylMinusList, { "Value": $scope.RGPContactobj.BasicODCyl }, true) || [];
                            if (tempCylArray.length > 0) {
                                let tempCylObj = tempCylArray[0];
                                let CylIndex = $scope.CylMinusList.indexOf(tempCylObj);
                                $scope.CylMinusList[CylIndex].selected = true;
                                $scope.RGPContactobj.CylindricalSwitch = 2;
                            }
                        }
                    }

                    if ($scope.RGPContactobj.BasicODBC !== "") {
                        let tempAxisArray = $filter('filter')($scope.BCList, { "Value": Number($scope.RGPContactobj.BasicODBC) }, true);
                        if (tempAxisArray.length > 0) {
                            let tempAxisObj = tempAxisArray[0];
                            let AxisIndex = $scope.BCList.indexOf(tempAxisObj);
                            $scope.BCList[AxisIndex].selected = true;
                        }
                    }

                    if ($scope.RGPContactobj.BasicODDia !== "") {
                        let tempAxisArray = $filter('filter')($scope.DiaList, { "Value": Number($scope.RGPContactobj.BasicODDia) }, true);
                        if (tempAxisArray.length > 0) {
                            let tempAxisObj = tempAxisArray[0];
                            let AxisIndex = $scope.DiaList.indexOf(tempAxisObj);
                            $scope.DiaList[AxisIndex].selected = true;
                        }
                    }
                    if ($scope.RGPContactobj.BasicODCyl !== "") {
                        let tempAxisArray = $filter('filter')($scope.CLCylindricalListBoth, { "Value": $scope.RGPContactobj.BasicODCyl }, true);
                        if (tempAxisArray.length > 0) {
                            let tempAxisObj = tempAxisArray[0];
                            let AxisIndex = $scope.CLCylindricalListBoth.indexOf(tempAxisObj);
                            $scope.CLCylindricalListBoth[AxisIndex].selected = true;
                        }
                    }

                    if ($scope.RGPContactobj.BasicODAxis !== "") {
                        let tempAxisArray = $filter('filter')($scope.AxisPlusList, { "Value": $scope.RGPContactobj.BasicODAxis }, true);
                        if (tempAxisArray.length > 0) {
                            let tempAxisObj = tempAxisArray[0];
                            let AxisIndex = $scope.AxisPlusList.indexOf(tempAxisObj);
                            $scope.AxisPlusList[AxisIndex].selected = true;
                        }
                    }

                    if ($scope.RGPContactobj.BasicODAdd !== "") {
                        let tempAxisArray = $filter('filter')($scope.AddtionList, { "Value": $scope.RGPContactobj.BasicODAdd }, true);
                        if (tempAxisArray.length > 0) {
                            let tempAxisObj = tempAxisArray[0];
                            let AxisIndex = $scope.AddtionList.indexOf(tempAxisObj);
                            $scope.AddtionList[AxisIndex].selected = true;
                        }
                    }

                    if ($scope.RGPContactobj.BasicODDesignType !== "") {
                        let tempAxisArray = $filter('filter')($scope.CLDesignTypeList, { "Value": $scope.RGPContactobj.BasicODDesignType }, true);
                        if (tempAxisArray.length > 0) {
                            let tempAxisObj = tempAxisArray[0];
                            let AxisIndex = $scope.CLDesignTypeList.indexOf(tempAxisObj);
                            $scope.CLDesignTypeList[AxisIndex].selected = true;
                        }
                    }
                    if ($scope.RGPContactobj.BasicODColor !== "") {
                        let tempAxisArray = $filter('filter')($scope.CLColorList, { "Value": $scope.RGPContactobj.BasicODColor }, true) || [];
                        if (tempAxisArray.length > 0) {
                            let tempAxisObj = tempAxisArray[0];
                            let AxisIndex = $scope.CLColorList.indexOf(tempAxisObj);
                            $scope.CLColorList[AxisIndex].selected = true;
                        }
                    }
                    if ($scope.RGPContactobj.BasicODProduct !== "") {
                        let tempAxisArray = $filter('filter')($scope.CLProductList, { "Value": $scope.RGPContactobj.BasicODProduct }, true) || [];
                        if (tempAxisArray.length > 0) {
                            let tempAxisObj = tempAxisArray[0];
                            let AxisIndex = $scope.CLProductList.indexOf(tempAxisObj);
                            $scope.CLProductList[AxisIndex].selected = true;
                        }
                    }
                    if ($scope.RGPContactobj.BasicODVaDistance !== "") {
                        let tempAxisArray = $filter('filter')($scope.DistanceList, { "Value": $scope.RGPContactobj.BasicODVaDistance }, true) || [];
                        if (tempAxisArray.length > 0) {
                            let tempAxisObj = tempAxisArray[0];
                            let AxisIndex = $scope.DistanceList.indexOf(tempAxisObj);
                            $scope.DistanceList[AxisIndex].selected = true;
                        }
                    }
                    if ($scope.RGPContactobj.BasicODVaNear !== "") {
                        let tempAxisArray = $filter('filter')($scope.NearList, { "Value": $scope.RGPContactobj.BasicODVaNear }, true) || [];
                        if (tempAxisArray.length > 0) {
                            let tempAxisObj = tempAxisArray[0];
                            let AxisIndex = $scope.NearList.indexOf(tempAxisObj);
                            $scope.NearList[AxisIndex].selected = true;
                        }
                    }
                    if ($scope.RGPContactobj.BasicODVaIntermediate !== "") {
                        let tempAxisArray = $filter('filter')($scope.IntermediateList, { "Value": $scope.RGPContactobj.BasicODVaIntermediate }, true) || [];
                        if (tempAxisArray.length > 0) {
                            let tempAxisObj = tempAxisArray[0];
                            let AxisIndex = $scope.IntermediateList.indexOf(tempAxisObj);
                            $scope.IntermediateList[AxisIndex].selected = true;
                        }
                    }
                    if ($scope.RGPContactobj.AdvancedFitODComfort !== "") {
                        let tempAxisArray = $filter('filter')($scope.CLComfortList, { "Value": $scope.RGPContactobj.AdvancedFitODComfort }, true) || [];
                        if (tempAxisArray.length > 0) {
                            let tempAxisObj = tempAxisArray[0];
                            let AxisIndex = $scope.CLComfortList.indexOf(tempAxisObj);
                            $scope.CLComfortList[AxisIndex].selected = true;
                        }
                    }
                    if ($scope.RGPContactobj.AdvancedFitODCentration !== "") {
                        let tempAxisArray = $filter('filter')($scope.CLCentrationList, { "Value": $scope.RGPContactobj.AdvancedFitODCentration }, true) || [];
                        if (tempAxisArray.length > 0) {
                            let tempAxisObj = tempAxisArray[0];
                            let AxisIndex = $scope.CLCentrationList.indexOf(tempAxisObj);
                            $scope.CLCentrationList[AxisIndex].selected = true;
                        }
                    }
                    if ($scope.RGPContactobj.AdvancedFitODCoverage !== "") {
                        let tempAxisArray = $filter('filter')($scope.CLCoverageList, { "Value": $scope.RGPContactobj.AdvancedFitODCoverage }, true) || [];
                        if (tempAxisArray.length > 0) {
                            let tempAxisObj = tempAxisArray[0];
                            let AxisIndex = $scope.CLCoverageList.indexOf(tempAxisObj);
                            $scope.CLCoverageList[AxisIndex].selected = true;
                        }
                    }
                    if ($scope.RGPContactobj.AdvancedFitODMovement !== "") {
                        let tempAxisArray = $filter('filter')($scope.MovementList, { "Value": $scope.RGPContactobj.AdvancedFitODMovement }, true) || [];
                        if (tempAxisArray.length > 0) {
                            let tempAxisObj = tempAxisArray[0];
                            let AxisIndex = $scope.MovementList.indexOf(tempAxisObj);
                            $scope.MovementList[AxisIndex].selected = true;
                        }
                    }
                    if ($scope.RGPContactobj.AdvancedFitODDegrees !== "") {
                        let tempAxisArray = $filter('filter')($scope.DegreesList, { "Value": $scope.RGPContactobj.AdvancedFitODDegrees }, true) || [];
                        if (tempAxisArray.length > 0) {
                            let tempAxisObj = tempAxisArray[0];
                            let AxisIndex = $scope.DegreesList.indexOf(tempAxisObj);
                            $scope.DegreesList[AxisIndex].selected = true;
                        }
                    }
                    if ($scope.RGPContactobj.AdvancedFitODDirection !== "") {
                        let tempAxisArray = $filter('filter')($scope.CLDirectionList, { "Value": $scope.RGPContactobj.AdvancedFitODDirection }, true) || [];
                        if (tempAxisArray.length > 0) {
                            let tempAxisObj = tempAxisArray[0];
                            let AxisIndex = $scope.CLDirectionList.indexOf(tempAxisObj);
                            $scope.CLDirectionList[AxisIndex].selected = true;
                        }
                    }
                    if ($scope.RGPContactobj.AdvancedRefractionODSph !== "") {
                        let tempAxisArray = $filter('filter')($scope.AdvanceSphericalMinusList, { "Value": $scope.RGPContactobj.AdvancedRefractionODSph }, true) || [];
                        if (tempAxisArray.length > 0) {
                            let tempAxisObj = tempAxisArray[0];
                            let AxisIndex = $scope.AdvanceSphericalMinusList.indexOf(tempAxisObj);
                            $scope.AdvanceSphericalMinusList[AxisIndex].selected = true;
                        }
                    }
                    if ($scope.RGPContactobj.AdvancedRefractionODCyl !== "") {
                        let tempAxisArray = $filter('filter')($scope.AdvanceCylMinusList, { "Value": $scope.RGPContactobj.AdvancedRefractionODCyl }, true) || [];
                        if (tempAxisArray.length > 0) {
                            let tempAxisObj = tempAxisArray[0];
                            let AxisIndex = $scope.AdvanceCylMinusList.indexOf(tempAxisObj);
                            $scope.AdvanceCylMinusList[AxisIndex].selected = true;
                        }
                    }
                    if ($scope.RGPContactobj.AdvancedRefractionODAxis !== "") {
                        let tempAxisArray = $filter('filter')($scope.AdvanceAxisPlusList, { "Value": $scope.RGPContactobj.AdvancedRefractionODAxis }, true) || [];
                        if (tempAxisArray.length > 0) {
                            let tempAxisObj = tempAxisArray[0];
                            let AxisIndex = $scope.AdvanceAxisPlusList.indexOf(tempAxisObj);
                            $scope.AdvanceAxisPlusList[AxisIndex].selected = true;
                        }
                    }
                    if ($scope.RGPContactobj.AdvancedRefractionODVaDistance !== "") {
                        let tempAxisArray = $filter('filter')($scope.AdvanceDistanceList, { "Value": $scope.RGPContactobj.AdvancedRefractionODVaDistance }, true) || [];
                        if (tempAxisArray.length > 0) {
                            let tempAxisObj = tempAxisArray[0];
                            let AxisIndex = $scope.AdvanceDistanceList.indexOf(tempAxisObj);
                            $scope.AdvanceDistanceList[AxisIndex].selected = true;
                        }
                    }
                    if ($scope.RGPContactobj.AdvancedRefractionODVaNear !== "") {
                        let tempAxisArray = $filter('filter')($scope.AdvanceNearList, { "Value": $scope.RGPContactobj.AdvancedRefractionODVaNear }, true) || [];
                        if (tempAxisArray.length > 0) {
                            let tempAxisObj = tempAxisArray[0];
                            let AxisIndex = $scope.AdvanceNearList.indexOf(tempAxisObj);
                            $scope.AdvanceNearList[AxisIndex].selected = true;
                        }
                    }
                    if ($scope.RGPContactobj.AdvancedRefractionODVaIntermediate !== "") {
                        let tempAxisArray = $filter('filter')($scope.AdvanceIntermediateList, { "Value": $scope.RGPContactobj.AdvancedRefractionODVaIntermediate }, true) || [];
                        if (tempAxisArray.length > 0) {
                            let tempAxisObj = tempAxisArray[0];
                            let AxisIndex = $scope.AdvanceIntermediateList.indexOf(tempAxisObj);
                            $scope.AdvanceIntermediateList[AxisIndex].selected = true;
                        }
                    }

                    callFrom = callFrom || "";
                    actionSection = actionSection || "";

                    $scope.CloseGridPopupIfSectionChanged(
                        callFrom,
                        actionSection
                    );
                    $scope.RefreshGridAfterAction();
                    $scope.$digest();
                }, function () {
                    r = "You pressed Cancel!";
                });
            }
        }

        /*RGP End*/

        $scope.ChangeAdvancedTab = function (type) {
            $scope.Contactobj.AdvancedSubType = type;
            $scope.Contactobj.SelectedEye = "OS";
            if (type == "Refraction") {
                $scope.onClickInputText(1, 'OD');
            }
            $scope.Contactobj.SelectedEye = "OD";
        }
        $scope.OnSelectSCLValues = function (type, item) {
            if (type == 'ODDesign') {
                setCLFocus('ODSph');
            }
            if (type == 'ODSph') {
                setCLFocus('ODCyl');
            }
            if (type == 'ODCyl') {
                setCLFocus('ODAxis');
            }
            if (type == 'ODAxis') {
                setCLFocus('ODAdd');
            }
            if (type == 'ODAdd') {
                setCLFocus('OSProduct');
            }
            if (type == 'ODBC') {
                setCLFocus('ODDia');
            }
            if (type == 'ODDia') {
                setCLFocus('ODColor');
            }
            if (type == 'ODKerato') {
                setCLFocus('ODColor');
            }
            if (type == 'ODColor') {
                setCLFocus('ODSph');
            }
            if (item != '') {
                if (type == 'ODProd') {
                    setCLFocus('ODSeries');
                }
            }

            if (type == 'ODDist') {
                setCLFocus('ODVAN');
            }
            if (type == 'ODNear') {
                setCLFocus('ODVAI');
            }
            if (type == 'ODInter') {
                setCLFocus('OSVAD');
            }
            if (type == 'OSDesign') {
                setCLFocus('OSSph');
            }
            if (type == 'OSSph') {
                setCLFocus('OSCyl');
            }
            if (type == 'OSCyl') {
                setCLFocus('OSAxis');
            }
            if (type == 'OSAxis') {
                setCLFocus('OSAdd');
            }
            if (type == 'OSBC') {
                setCLFocus('OSDia');
            }
            if (type == 'OSDia') {
                setCLFocus('OSColor');
            }


            if (type == 'OSKerato') {
                setCLFocus('OSColor');
            }
            if (type == 'OSColor') {
                setCLFocus('OSSph');
            }
            if (type == 'OSDist') {
                setCLFocus('OSVAN');
            }
            if (type == 'OSNear') {
                setCLFocus('OSVAI');
            }
            if (type == 'OSInter') {
                setCLFocus('OUVAD');
            }
            if (type == 'OUDist') {
                setCLFocus('OUVAN');
            }
            if (type == 'OUNear') {
                setCLFocus('OUVAI');
            }
            if (type == 'AODComfort') {
                setCLFocus('AODCent');
            }
            if (type == 'AODCent') {
                setCLFocus('AODCover');
            }
            if (type == 'AODCover') {
                setCLFocus('AODMove');
            }
            if (type == 'AODMove') {
                setCLFocus('AODDegree');
            }
            if (type == 'AODDegree') {
                setCLFocus('AODDirect');
            }
            if (type == 'AODDirect') {
                setCLFocus('AODSph');
            }
            if (type == 'AODSph') {
                setCLFocus('AODCyl');
            }
            if (type == 'AODCyl') {
                setCLFocus('AODAxis');
            }
            if (type == 'AODAxis') {
                setCLFocus('AODAdd');
            }
            if (type == 'AODAdd') {
                setCLFocus('AODVAD');
            }
            if (type == 'AODVAD') {
                setCLFocus('AODVAN');
            }
            if (type == 'AODVAN') {
                setCLFocus('AODVAI');
            }
            if (type == 'AODVAI') {
                setCLFocus('AOSComfort');
            }
            if (type == 'AOSComfort') {
                setCLFocus('AOSCent');
            }
            if (type == 'AOSCent') {
                setCLFocus('AOSCover');
            }
            if (type == 'AOSCover') {
                setCLFocus('AOSMove');
            }
            if (type == 'AOSMove') {
                setCLFocus('AOSDegree');
            }
            if (type == 'AOSDegree') {
                setCLFocus('AOSDirect');
            }
            if (type == 'AOSDirect') {
                setCLFocus('AOSSph');
            }
            if (type == 'AOSSph') {
                setCLFocus('AOSCyl');
            }
            if (type == 'AOSCyl') {
                setCLFocus('AOSAxis');
            }
            if (type == 'AOSAxis') {
                setCLFocus('AOSAdd');
            }
            if (type == 'AOSAdd') {
                setCLFocus('AOSVAD');
            }
            if (type == 'AOSVAD') {
                setCLFocus('AOSVAN');
            }
            if (type == 'AOSVAN') {
                setCLFocus('AOSVAI');
            }
            if (type == 'AOSVAI') {
                setCLFocus('AOUVAD');
            }
            if (type == 'AOUVAD') {
                setCLFocus('AOUVAN');
            }
            if (type == 'AOUVAN') {
                setCLFocus('AOUVAI');
            }
            if (type == 'OSProd') {
                setCLFocus('OSSeries');
            }

            if (item != '' && type == 'ODSeri') {
                if ($scope.Contactobj.BasicODBC == '') {
                    if (type == 'ODSeri') {
                        setCLFocus('ODBC');
                    }
                } else {
                    setCLFocus('ODColor');
                }
            }
            if (item != '' && type == 'OSSeri') {
                if ($scope.Contactobj.BasicOSBC == '') {
                    if (type == 'OSSeri') {
                        setCLFocus('OSBC');
                    }
                } else {
                    setCLFocus('OSColor');
                }
            }
        }
        $scope.onClickInputText = function (SubTab, EyeType, Type, item,focus) {
            Type = Type || "";
            item = item || "";
            if (SubTab == 1) {
                $scope.OnSelectSCLValues(focus, item);         
                if ($scope.subLenstab == 1) {
                    $scope.Contactobj.SelectedEye = EyeType;
                    $scope.ChangeSelectedEye(EyeType, item,focus);
                }
                else if ($scope.subLenstab == 2) {
                    if (Type == "Fit") {
                        $scope.Contactobj.AdvancedSubType = "Fit";
                        $scope.Contactobj.SelectedEye = EyeType;
                        $scope.ChangeSelectedEye(EyeType, item, focus);
                    } else {
                        $scope.Contactobj.AdvancedSubType = "Refraction";
                        $scope.Contactobj.SelectedEye = EyeType;
                        $scope.ChangeSelectedEye(EyeType, item, focus);
                    }
                }
            }
            else if (SubTab == 2) {
                $scope.OnSelectRGPValues(focus);
                if ($scope.subLenstab == 1) {
                    $scope.RGPContactobj.SelectedEye = EyeType;
                    $scope.ChangeRGPSelectedEye(EyeType,focus);
                }
                else if ($scope.subLenstab == 2) {
                    if (Type == "Fit") {
                        $scope.RGPContactobj.AdvancedSubType = "Fit";
                        $scope.RGPContactobj.SelectedEye = EyeType;
                        $scope.ChangeRGPSelectedEye(EyeType,focus);
                    } else {
                        $scope.RGPContactobj.AdvancedSubType = "Refraction";
                        $scope.RGPContactobj.SelectedEye = EyeType;
                        $scope.ChangeRGPSelectedEye(EyeType,focus);
                    }
                }
            }
        }
        $scope.ChangesstatusSoftLens = function (item) {
            item.showstatus = !item.showstatus;
        }
        $scope.ChangesstatusRGP = function (item) {
            item.showstatus = !item.showstatus;
        }
        $scope.$watch("obj.ContactLensDetails", function (newVal, oldVal) {
            if ($scope.obj.ContactLensDetails === undefined) { return; }
            if ($scope.obj.ContactLensDetails.length > 0) {
                angular.forEach($scope.obj.ContactLensDetails, function (item) {
                    item.IsInvSummaryShow = false;
                    if (item.DeleteInd == "N") {
                        if (item.InvestigationDetails.length > 0) {//DeleteInd
                            var i = 0;
                            angular.forEach(item.InvestigationDetails, function (Iitem) {
                                //Iitem.CreatedDateTime = $filter('date')(Iitem.CreatedDateTime, 'MM-dd-yyyy,hh:mm a');
                                Iitem.Sno = i++;
                            });
                            var Filter = $filter("filter")(item.InvestigationDetails, { "DeleteInd": "N" }, true) || [];
                            if (Filter.length > 0) {
                                item.IsInvSummaryShow = true;
                            }
                        }
                    }
                });
            }
        }, true);

        $scope.ContactLensBasicWear = function (type) {
            if (type == 1) {
                $scope.Contactobj.IsBasicRemarksInd = !$scope.Contactobj.IsBasicRemarksInd;
            } else {
                $scope.Contactobj.IsBasicInstructionsInd = !$scope.Contactobj.IsBasicInstructionsInd;
            }
        }


        $scope.EditContactLens = function (item, index, typeid, callFrom, actionSection) {

            $scope.Contactobj = angular.copy($scope.GetContactobj());
            $scope.Contactobj.Sno = item.Sno;
            item.Sno = item.Sno;
            if (typeid == 1) {
                $scope.subLenstab = 1;
            } else {
                $scope.subLenstab = 2;
            }
            $scope.Contactobj.BasicODDesignType = item.BasicODDesignType;
            $scope.Contactobj.BasicODSph = item.BasicODSph;
            $scope.Contactobj.BasicODCyl = item.BasicODCyl;
            $scope.Contactobj.BasicODAxis = item.BasicODAxis;
            $scope.Contactobj.BasicODAdd = item.BasicODAdd;
            $scope.Contactobj.BasicODBC = item.BasicODBC;
            $scope.Contactobj.BasicODDia = item.BasicODDia;
            $scope.Contactobj.BasicODKeratometry = item.BasicODKeratometry;
            $scope.Contactobj.BasicODColor = item.BasicODColor;
            $scope.Contactobj.BasicODProduct = item.BasicODProduct;
            $scope.Contactobj.BasicODSeries = item.BasicODSeries;
            $scope.Contactobj.BasicODVaDistance = item.BasicODVaDistance;
            $scope.Contactobj.BasicODVaNear = item.BasicODVaNear;
            $scope.Contactobj.BasicODVaIntermediate = item.BasicODVaIntermediate;

            $scope.Contactobj.BasicOSDesignType = item.BasicOSDesignType;
            $scope.Contactobj.BasicOSSph = item.BasicOSSph;
            $scope.Contactobj.BasicOSCyl = item.BasicOSCyl;
            $scope.Contactobj.BasicOSAxis = item.BasicOSAxis;
            $scope.Contactobj.BasicOSAdd = item.BasicOSAdd;
            $scope.Contactobj.BasicOSBC = item.BasicOSBC;
            $scope.Contactobj.BasicOSDia = item.BasicOSDia;
            $scope.Contactobj.BasicOSKeratometry = item.BasicOSKeratometry;
            $scope.Contactobj.BasicOSColor = item.BasicOSColor;
            $scope.Contactobj.BasicOSProduct = item.BasicOSProduct;
            $scope.Contactobj.BasicOSSeries = item.BasicOSSeries;
            $scope.Contactobj.BasicOSVaDistance = item.BasicOSVaDistance;
            $scope.Contactobj.BasicOSVaNear = item.BasicOSVaNear;
            $scope.Contactobj.BasicOSVaIntermediate = item.BasicOSVaIntermediate;

            $scope.Contactobj.BasicOUVaDistance = item.BasicOUVaDistance;
            $scope.Contactobj.BasicOUVaNear = item.BasicOUVaNear;
            $scope.Contactobj.BasicOUVaIntermediate = item.BasicOUVaIntermediate;

            $scope.Contactobj.BasicRemarks = item.BasicRemarks || "";
            $scope.Contactobj.BasicInstructions = item.BasicInstructions || "";
            $scope.Contactobj.AdvancedRefractionRemarks = item.AdvancedRefractionRemarks || "";
            $scope.Contactobj.TypeId = item.TypeId || null;
            $scope.Contactobj.TypeName = item.TypeName || "";
            $scope.Contactobj.SubInvestigationId = item.SubInvestigationId || null;
            $scope.Contactobj.SubInvestigationName = item.SubInvestigationName || "";
            $scope.Contactobj.RxExpiration = item.RxExpiration || "";
            $scope.Contactobj.ReplacementSchedule = item.ReplacementSchedule || "";

            if ($scope.Contactobj.BasicRemarks != "") {
                $scope.Contactobj.IsBasicRemarksInd = true;
            }
            if ($scope.Contactobj.BasicInstructions != "") {
                $scope.Contactobj.IsBasicInstructionsInd = true;
            }
            if ($scope.Contactobj.AdvancedRefractionRemarks != "") {
                $scope.Contactobj.IsAdvanceRemarksInd = true;
            }

            $scope.Contactobj.AdvancedFitODComfort = item.AdvancedFitODComfort || "";
            $scope.Contactobj.AdvancedFitODCentration = item.AdvancedFitODCentration || "";
            $scope.Contactobj.AdvancedFitODCoverage = item.AdvancedFitODCoverage || "";
            $scope.Contactobj.AdvancedFitODMovement = item.AdvancedFitODMovement || "";
            $scope.Contactobj.AdvancedFitODDegrees = item.AdvancedFitODDegrees || "";
            $scope.Contactobj.AdvancedFitODDirection = item.AdvancedFitODDirection || "";
            $scope.Contactobj.AdvancedRefractionODSph = item.AdvancedRefractionODSph || "";
            $scope.Contactobj.AdvancedRefractionODCyl = item.AdvancedRefractionODCyl || "";
            $scope.Contactobj.AdvancedRefractionODAxis = item.AdvancedRefractionODAxis || "";
            $scope.Contactobj.AdvancedRefractionODAdd = item.AdvancedRefractionODAdd || "";
            $scope.Contactobj.AdvancedRefractionODVaDistance = item.AdvancedRefractionODVaDistance || "";
            $scope.Contactobj.AdvancedRefractionODVaNear = item.AdvancedRefractionODVaNear || "";
            $scope.Contactobj.AdvancedRefractionODVaIntermediate = item.AdvancedRefractionODVaIntermediate || "";

            $scope.Contactobj.AdvancedFitOSComfort = item.AdvancedFitOSComfort || "";
            $scope.Contactobj.AdvancedFitOSCentration = item.AdvancedFitOSCentration || "";
            $scope.Contactobj.AdvancedFitOSCoverage = item.AdvancedFitOSCoverage || "";
            $scope.Contactobj.AdvancedFitOSMovement = item.AdvancedFitOSMovement || "";
            $scope.Contactobj.AdvancedFitOSDegrees = item.AdvancedFitOSDegrees || "";
            $scope.Contactobj.AdvancedFitOSDirection = item.AdvancedFitOSDirection || "";
            $scope.Contactobj.AdvancedRefractionOSSph = item.AdvancedRefractionOSSph || "";
            $scope.Contactobj.AdvancedRefractionOSCyl = item.AdvancedRefractionOSCyl || "";
            $scope.Contactobj.AdvancedRefractionOSAxis = item.AdvancedRefractionOSAxis || "";
            $scope.Contactobj.AdvancedRefractionOSAdd = item.AdvancedRefractionOSAdd || "";
            $scope.Contactobj.AdvancedRefractionOSVaDistance = item.AdvancedRefractionOSVaDistance || "";
            $scope.Contactobj.AdvancedRefractionOSVaNear = item.AdvancedRefractionOSVaNear || "";
            $scope.Contactobj.AdvancedRefractionOSVaIntermediate = item.AdvancedRefractionOSVaIntermediate || "";

            $scope.Contactobj.AdvancedRefractionOUVaDistance = item.AdvancedRefractionOUVaDistance || "";
            $scope.Contactobj.AdvancedRefractionOUVaNear = item.AdvancedRefractionOUVaNear || "";
            $scope.Contactobj.AdvancedRefractionOUVaIntermediate = item.AdvancedRefractionOUVaIntermediate || "";

            $scope.CLSphericalListBoth = GetSphericalBothList();
            $scope.CLDesignTypeList = GetCLDesignTypeList();
            $scope.CLCylindricalListBoth = GetCylBothList();
            $scope.SphericalPlusList = GetSphericalPlusList();
            $scope.SphericalMinusList = GetSphericalMinusList();
            $scope.CylPlusList = GetCylPlusList();
            $scope.CylMinusList = GetCylMinusList();
            $scope.AxisPlusList = GetAxisPlusList();
            $scope.AddtionList = GetAddtionList();
            $scope.BCList = GetBCList();
            $scope.DiaList = GetDiaList();
            $scope.KeratometryList = GetKeratometryList();
            $scope.DistanceList = GetDistanceList();
            $scope.NearList = GetDistanceList();
            $scope.IntermediateList = GetDistanceList();
            $scope.CLColorList = GetColorList();
            $scope.CLProductList = GetProductList();
            $scope.MovementList = GetMovementList();
            $scope.DegreesList = GetDegreesList();
            $scope.CLDirectionList = GetDirectionList();
            $scope.CLCoverageList = GetCoverageList();
            $scope.CLCentrationList = GetCentrationList();
            $scope.CLComfortList = GetComfortList();
            $scope.AdvanceSphericalPlusList = GetSphericalPlusList();
            $scope.AdvanceSphericalMinusList = GetSphericalMinusList();
            $scope.AdvanceCylMinusList = GetCylMinusList();
            $scope.AdvanceAxisPlusList = GetAxisPlusList();
            $scope.AdvanceDistanceList = GetDistanceList();
            $scope.AdvanceNearList = GetDistanceList();
            $scope.AdvanceIntermediateList = GetDistanceList();
            $scope.Contactobj.SelectedEye = "OD";


            if ($scope.FilterProductlist && $scope.FilterProductlist.length > 0) {
                angular.forEach($scope.FilterProductlist, function (aitem) {
                    aitem.selected = false;
                });
            }
            if ($scope.BrandsMainarray && $scope.BrandsMainarray.length > 0) {
                angular.forEach($scope.BrandsMainarray, function (aitem) {
                    aitem.selected = false;
                });
            }
            if ($scope.MainColorlist && $scope.MainColorlist.length > 0) {
                angular.forEach($scope.MainColorlist, function (aitem) {
                    aitem.selected = false;
                });
            }

            // hightlight selected values

            if ($scope.Contactobj.BasicODSeries !== "") {
                let tempAxisArray = $filter('filter')($scope.BrandsMainarray, { "Value": $scope.Contactobj.BasicODSeries }, true) || [];
                if (tempAxisArray.length > 0) {
                    let tempAxisObj = tempAxisArray[0];
                    let AxisIndex = $scope.BrandsMainarray.indexOf(tempAxisObj);
                    $scope.BrandsMainarray[AxisIndex].selected = true;
                }
            }

            if ($scope.Contactobj.BasicODAdd !== "") {
                let tempAxisArray = $filter('filter')($scope.AddtionList, { "Value": $scope.Contactobj.BasicODAdd }, true) || [];
                if (tempAxisArray.length > 0) {
                    let tempAxisObj = tempAxisArray[0];
                    let AxisIndex = $scope.AddtionList.indexOf(tempAxisObj);
                    $scope.AddtionList[AxisIndex].selected = true;
                }
            }
            if ($scope.Contactobj.BasicODDesignType !== "") {
                let tempAxisArray = $filter('filter')($scope.CLDesignTypeList, { "Value": $scope.Contactobj.BasicODDesignType }, true);
                if (tempAxisArray.length > 0) {
                    let tempAxisObj = tempAxisArray[0];
                    let AxisIndex = $scope.CLDesignTypeList.indexOf(tempAxisObj);
                    $scope.CLDesignTypeList[AxisIndex].selected = true;
                }
            }
            if ($scope.Contactobj.BasicODSph !== "") {
                let tempSphArray = $filter('filter')($scope.SphericalPlusList, { "Value": $scope.Contactobj.BasicODSph }, true) || [];
                if (tempSphArray.length > 0) {
                    let tempSphObj = tempSphArray[0];
                    let SphIndex = $scope.SphericalPlusList.indexOf(tempSphObj);
                    $scope.SphericalPlusList[SphIndex].selected = true;
                    $scope.Contactobj.SphericalSwitch = 1;
                } else {
                    let tempSphArray = $filter('filter')($scope.SphericalMinusList, { "Value": $scope.Contactobj.BasicODSph }, true) || [];
                    if (tempSphArray.length > 0) {
                        let tempSphObj = tempSphArray[0];
                        let SphIndex = $scope.SphericalMinusList.indexOf(tempSphObj);
                        $scope.SphericalMinusList[SphIndex].selected = true;
                        $scope.Contactobj.SphericalSwitch = 2;
                    }
                }
            }
            if ($scope.Contactobj.BasicODCyl !== "") {
                let tempCylArray = $filter('filter')($scope.CylPlusList, { "Value": $scope.Contactobj.BasicODCyl }, true) || [];
                if (tempCylArray.length > 0) {
                    let tempCylObj = tempCylArray[0];
                    let CylIndex = $scope.CylPlusList.indexOf(tempCylObj);
                    $scope.CylPlusList[CylIndex].selected = true;
                    $scope.Contactobj.CylindricalSwitch = 1;
                } else {
                    let tempCylArray = $filter('filter')($scope.CylMinusList, { "Value": $scope.Contactobj.BasicODCyl }, true) || [];
                    if (tempCylArray.length > 0) {
                        let tempCylObj = tempCylArray[0];
                        let CylIndex = $scope.CylMinusList.indexOf(tempCylObj);
                        $scope.CylMinusList[CylIndex].selected = true;
                        $scope.Contactobj.CylindricalSwitch = 2;
                    }
                }
            }
            if ($scope.Contactobj.BasicODAxis !== "") {
                let tempAxisArray = $filter('filter')($scope.AxisPlusList, { "Value": $scope.Contactobj.BasicODAxis }, true) || [];
                if (tempAxisArray.length > 0) {
                    let tempAxisObj = tempAxisArray[0];
                    let AxisIndex = $scope.AxisPlusList.indexOf(tempAxisObj);
                    $scope.AxisPlusList[AxisIndex].selected = true;
                }
            }
            if ($scope.Contactobj.BasicODBC !== "") {
               
                let tempAxisArray = $filter('filter')($scope.BCList, { "Value": Number($scope.Contactobj.BasicODBC) }, true) || [];
                if (tempAxisArray.length > 0) {
                    let tempAxisObj = tempAxisArray[0];
                    let AxisIndex = $scope.BCList.indexOf(tempAxisObj);
                    $scope.BCList[AxisIndex].selected = true;
                }
            }
            if ($scope.Contactobj.BasicODDia !== "") {
                let tempAxisArray = $filter('filter')($scope.DiaList, { "Value": Number($scope.Contactobj.BasicODDia) }, true) || [];
                
                if (tempAxisArray.length > 0) {
                    let tempAxisObj = tempAxisArray[0];
                    let AxisIndex = $scope.DiaList.indexOf(tempAxisObj);
                    $scope.DiaList[AxisIndex].selected = true;
                }
            }
            if ($scope.Contactobj.BasicODKeratometry !== "") {
                let tempAxisArray = $filter('filter')($scope.KeratometryList, { "Value": $scope.Contactobj.BasicODKeratometry }, true) || [];
                if (tempAxisArray.length > 0) {
                    let tempAxisObj = tempAxisArray[0];
                    let AxisIndex = $scope.KeratometryList.indexOf(tempAxisObj);
                    $scope.KeratometryList[AxisIndex].selected = true;
                }
            }
            if ($scope.Contactobj.BasicODColor !== "") {
                let tempAxisArray = $filter('filter')($scope.MainColorlist, { "Value": $scope.Contactobj.BasicODColor }, true) || [];
                if (tempAxisArray.length > 0) {
                    let tempAxisObj = tempAxisArray[0];
                    let AxisIndex = $scope.MainColorlist.indexOf(tempAxisObj);
                    $scope.MainColorlist[AxisIndex].selected = true;
                }
            }
            if ($scope.Contactobj.BasicODProduct !== "") {
                let tempAxisArray = $filter('filter')($scope.FilterProductlist, { "Value": $scope.Contactobj.BasicODProduct }, true) || [];
                if (tempAxisArray.length > 0) {
                    let tempAxisObj = tempAxisArray[0];
                    let AxisIndex = $scope.FilterProductlist.indexOf(tempAxisObj);
                    $scope.FilterProductlist[AxisIndex].selected = true;
                }
            }
            if ($scope.Contactobj.BasicODVaDistance !== "") {
                let tempAxisArray = $filter('filter')($scope.DistanceList, { "Value": $scope.Contactobj.BasicODVaDistance }, true) || [];
                if (tempAxisArray.length > 0) {
                    let tempAxisObj = tempAxisArray[0];
                    let AxisIndex = $scope.DistanceList.indexOf(tempAxisObj);
                    $scope.DistanceList[AxisIndex].selected = true;
                }
            }
            if ($scope.Contactobj.BasicODVaNear !== "") {
                let tempAxisArray = $filter('filter')($scope.NearList, { "Value": $scope.Contactobj.BasicODVaNear }, true) || [];
                if (tempAxisArray.length > 0) {
                    let tempAxisObj = tempAxisArray[0];
                    let AxisIndex = $scope.NearList.indexOf(tempAxisObj);
                    $scope.NearList[AxisIndex].selected = true;
                }
            }
            if ($scope.Contactobj.BasicODVaIntermediate !== "") {
                let tempAxisArray = $filter('filter')($scope.IntermediateList, { "Value": $scope.Contactobj.BasicODVaIntermediate }, true) || [];
                if (tempAxisArray.length > 0) {
                    let tempAxisObj = tempAxisArray[0];
                    let AxisIndex = $scope.IntermediateList.indexOf(tempAxisObj);
                    $scope.IntermediateList[AxisIndex].selected = true;
                }
            }

            if ($scope.Contactobj.AdvancedFitODComfort !== "") {
                let tempAxisArray = $filter('filter')($scope.CLComfortList, { "Value": $scope.Contactobj.AdvancedFitODComfort }, true) || [];
                if (tempAxisArray.length > 0) {
                    let tempAxisObj = tempAxisArray[0];
                    let AxisIndex = $scope.CLComfortList.indexOf(tempAxisObj);
                    $scope.CLComfortList[AxisIndex].selected = true;
                }
            }
            if ($scope.Contactobj.AdvancedFitODCentration !== "") {
                let tempAxisArray = $filter('filter')($scope.CLCentrationList, { "Value": $scope.Contactobj.AdvancedFitODCentration }, true) || [];
                if (tempAxisArray.length > 0) {
                    let tempAxisObj = tempAxisArray[0];
                    let AxisIndex = $scope.CLCentrationList.indexOf(tempAxisObj);
                    $scope.CLCentrationList[AxisIndex].selected = true;
                }
            }
            if ($scope.Contactobj.AdvancedFitODCoverage !== "") {
                let tempAxisArray = $filter('filter')($scope.CLCoverageList, { "Value": $scope.Contactobj.AdvancedFitODCoverage }, true) || [];
                if (tempAxisArray.length > 0) {
                    let tempAxisObj = tempAxisArray[0];
                    let AxisIndex = $scope.CLCoverageList.indexOf(tempAxisObj);
                    $scope.CLCoverageList[AxisIndex].selected = true;
                }
            }
            if ($scope.Contactobj.AdvancedFitODMovement !== "") {
                let tempAxisArray = $filter('filter')($scope.MovementList, { "Value": $scope.Contactobj.AdvancedFitODMovement }, true) || [];
                if (tempAxisArray.length > 0) {
                    let tempAxisObj = tempAxisArray[0];
                    let AxisIndex = $scope.MovementList.indexOf(tempAxisObj);
                    $scope.MovementList[AxisIndex].selected = true;
                }
            }
            if ($scope.Contactobj.AdvancedFitODDegrees !== "") {
                let tempAxisArray = $filter('filter')($scope.DegreesList, { "Value": $scope.Contactobj.AdvancedFitODDegrees }, true) || [];
                if (tempAxisArray.length > 0) {
                    let tempAxisObj = tempAxisArray[0];
                    let AxisIndex = $scope.DegreesList.indexOf(tempAxisObj);
                    $scope.DegreesList[AxisIndex].selected = true;
                }
            }
            if ($scope.Contactobj.AdvancedFitODDirection !== "") {
                let tempAxisArray = $filter('filter')($scope.CLDirectionList, { "Value": $scope.Contactobj.AdvancedFitODDirection }, true) || [];
                if (tempAxisArray.length > 0) {
                    let tempAxisObj = tempAxisArray[0];
                    let AxisIndex = $scope.CLDirectionList.indexOf(tempAxisObj);
                    $scope.CLDirectionList[AxisIndex].selected = true;
                }
            }
            if ($scope.Contactobj.AdvancedRefractionODSph !== "") {
                let tempAxisArray = $filter('filter')($scope.AdvanceSphericalMinusList, { "Value": $scope.Contactobj.AdvancedRefractionODSph }, true) || [];
                if (tempAxisArray.length > 0) {
                    let tempAxisObj = tempAxisArray[0];
                    let AxisIndex = $scope.AdvanceSphericalMinusList.indexOf(tempAxisObj);
                    $scope.AdvanceSphericalMinusList[AxisIndex].selected = true;
                }
            }
            if ($scope.Contactobj.AdvancedRefractionODCyl !== "") {
                let tempAxisArray = $filter('filter')($scope.AdvanceCylMinusList, { "Value": $scope.Contactobj.AdvancedRefractionODCyl }, true) || [];
                if (tempAxisArray.length > 0) {
                    let tempAxisObj = tempAxisArray[0];
                    let AxisIndex = $scope.AdvanceCylMinusList.indexOf(tempAxisObj);
                    $scope.AdvanceCylMinusList[AxisIndex].selected = true;
                }
            }
            if ($scope.Contactobj.AdvancedRefractionODAxis !== "") {
                let tempAxisArray = $filter('filter')($scope.AdvanceAxisPlusList, { "Value": $scope.Contactobj.AdvancedRefractionODAxis }, true) || [];
                if (tempAxisArray.length > 0) {
                    let tempAxisObj = tempAxisArray[0];
                    let AxisIndex = $scope.AdvanceAxisPlusList.indexOf(tempAxisObj);
                    $scope.AdvanceAxisPlusList[AxisIndex].selected = true;
                }
            }
            if ($scope.Contactobj.AdvancedRefractionODVaDistance !== "") {
                let tempAxisArray = $filter('filter')($scope.AdvanceDistanceList, { "Value": $scope.Contactobj.AdvancedRefractionODVaDistance }, true) || [];
                if (tempAxisArray.length > 0) {
                    let tempAxisObj = tempAxisArray[0];
                    let AxisIndex = $scope.AdvanceDistanceList.indexOf(tempAxisObj);
                    $scope.AdvanceDistanceList[AxisIndex].selected = true;
                }
            }
            if ($scope.Contactobj.AdvancedRefractionODVaNear !== "") {
                let tempAxisArray = $filter('filter')($scope.AdvanceNearList, { "Value": $scope.Contactobj.AdvancedRefractionODVaNear }, true) || [];
                if (tempAxisArray.length > 0) {
                    let tempAxisObj = tempAxisArray[0];
                    let AxisIndex = $scope.AdvanceNearList.indexOf(tempAxisObj);
                    $scope.AdvanceNearList[AxisIndex].selected = true;
                }
            }
            if ($scope.Contactobj.AdvancedRefractionODVaIntermediate !== "") {
                let tempAxisArray = $filter('filter')($scope.AdvanceIntermediateList, { "Value": $scope.Contactobj.AdvancedRefractionODVaIntermediate }, true) || [];
                if (tempAxisArray.length > 0) {
                    let tempAxisObj = tempAxisArray[0];
                    let AxisIndex = $scope.AdvanceIntermediateList.indexOf(tempAxisObj);
                    $scope.AdvanceIntermediateList[AxisIndex].selected = true;
                }
            }
            callFrom = callFrom || "";
            actionSection = actionSection || "";

            $scope.CloseGridPopupIfSectionChanged(
                callFrom,
                actionSection
            );
            $scope.RefreshGridAfterAction();
        }

        $scope.ClearContactLens = function (typename, typeId, subtabid, sno) {

            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to Clear This values?", function () {
                if ($scope.lenstab == 1) {
                    $scope.Contactobj = angular.copy($scope.GetContactobj());
                    $scope.Contactobj.TypeName = typename;
                    $scope.Contactobj.TypeId = typeId;
                    $scope.Contactobj.Sno = sno;
                    $scope.subLenstab = subtabid;
                    $scope.CLSphericalListBoth = GetSphericalBothList();
                    $scope.CLDesignTypeList = GetCLDesignTypeList();
                    $scope.CLCylindricalListBoth = GetCylBothList();
                    $scope.SphericalPlusList = GetSphericalPlusList();
                    $scope.SphericalMinusList = GetSphericalMinusList();
                    $scope.CylPlusList = GetCylPlusList();
                    $scope.CylMinusList = GetCylMinusList();
                    $scope.AxisPlusList = GetAxisPlusList();
                    $scope.BCList = GetBCList();
                    $scope.DiaList = GetDiaList();
                    $scope.KeratometryList = GetKeratometryList();
                    $scope.DistanceList = GetDistanceList();
                    $scope.NearList = GetDistanceList();
                    $scope.IntermediateList = GetDistanceList();
                    $scope.CLColorList = GetColorList();
                    $scope.CLProductList = GetProductList();
                    $scope.MovementList = GetMovementList();
                    $scope.DegreesList = GetDegreesList();
                    $scope.CLDirectionList = GetDirectionList();
                    $scope.CLCoverageList = GetCoverageList();
                    $scope.CLCentrationList = GetCentrationList();
                    $scope.CLComfortList = GetComfortList();
                    $scope.AdvanceSphericalPlusList = GetSphericalPlusList();
                    $scope.AdvanceSphericalMinusList = GetSphericalMinusList();
                    $scope.AdvanceCylMinusList = GetCylMinusList();
                    $scope.AdvanceAxisPlusList = GetAxisPlusList();
                    $scope.AdvanceDistanceList = GetDistanceList();
                    $scope.AdvanceNearList = GetDistanceList();
                    $scope.AdvanceIntermediateList = GetDistanceList();
                }
                else {

                }
                $scope.$digest();
            }, function () {
                r = "You pressed Cancel!";
            });
        }

        $scope.CopyContactLens = function (item, index, typeid, callFrom, actionSection) {
            $scope.LogObj.LogArray = [];
            var confirmationMessage = "Are you sure you want to copy " + item.SubInvestigationName + " values";
            if ($scope.lenstab == 1) {
                var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>" + confirmationMessage + ' into ' + $scope.Contactobj.TypeName + '?' + "</h4>", function () {

                    $scope.Contactobj.Sno = null;
                    if (typeid == 1) {
                        $scope.subLenstab = 1;
                    } else {
                        $scope.subLenstab = 2;
                    }
                    $scope.Contactobj.BasicODDesignType = item.BasicODDesignType || "";
                    $scope.Contactobj.BasicODSph = item.BasicODSph || "";
                    $scope.Contactobj.BasicODCyl = item.BasicODCyl || "";
                    $scope.Contactobj.BasicODAxis = item.BasicODAxis || "";
                    $scope.Contactobj.BasicODAdd = item.BasicODAdd || "";
                    $scope.Contactobj.BasicODBC = item.BasicODBC || "";
                    $scope.Contactobj.BasicODDia = item.BasicODDia || "";
                    $scope.Contactobj.BasicODKeratometry = item.BasicODKeratometry || "";
                    $scope.Contactobj.BasicODColor = item.BasicODColor || "";
                    $scope.Contactobj.BasicODProduct = item.BasicODProduct || "";
                    $scope.Contactobj.BasicODSeries = item.BasicODSeries || "";
                    $scope.Contactobj.BasicODVaDistance = item.BasicODVaDistance || "";
                    $scope.Contactobj.BasicODVaNear = item.BasicODVaNear || "";
                    $scope.Contactobj.BasicODVaIntermediate = item.BasicODVaIntermediate || "";

                    $scope.Contactobj.BasicOSDesignType = item.BasicOSDesignType || "";
                    $scope.Contactobj.BasicOSSph = item.BasicOSSph || "";
                    $scope.Contactobj.BasicOSCyl = item.BasicOSCyl || "";
                    $scope.Contactobj.BasicOSAxis = item.BasicOSAxis || "";
                    $scope.Contactobj.BasicOSAdd = item.BasicOSAdd || "";
                    $scope.Contactobj.BasicOSBC = item.BasicOSBC || "";
                    $scope.Contactobj.BasicOSDia = item.BasicOSDia || "";
                    $scope.Contactobj.BasicOSKeratometry = item.BasicOSKeratometry || "";
                    $scope.Contactobj.BasicOSColor = item.BasicOSColor || "";
                    $scope.Contactobj.BasicOSProduct = item.BasicOSProduct || "";
                    $scope.Contactobj.BasicOSSeries = item.BasicOSSeries || "";
                    $scope.Contactobj.BasicOSVaDistance = item.BasicOSVaDistance || "";
                    $scope.Contactobj.BasicOSVaNear = item.BasicOSVaNear || "";
                    $scope.Contactobj.BasicOSVaIntermediate = item.BasicOSVaIntermediate || "";

                    $scope.Contactobj.BasicOUVaDistance = item.BasicOUVaDistance || "";
                    $scope.Contactobj.BasicOUVaNear = item.BasicOUVaNear || "";
                    $scope.Contactobj.BasicOUVaIntermediate = item.BasicOUVaIntermediate || "";

                    $scope.Contactobj.BasicRemarks = item.BasicRemarks || "";
                    $scope.Contactobj.BasicInstructions = item.BasicInstructions || "";
                    $scope.Contactobj.AdvancedRefractionRemarks = item.AdvancedRefractionRemarks || "";
                    $scope.Contactobj.RxExpiration = item.RxExpiration || "";
                    $scope.Contactobj.ReplacementSchedule = item.ReplacementSchedule || "";

                    if ($scope.Contactobj.BasicRemarks != "") {
                        $scope.Contactobj.IsBasicRemarksInd = true;
                    }
                    if ($scope.Contactobj.BasicInstructions != "") {
                        $scope.Contactobj.IsBasicInstructionsInd = true;
                    }
                    if ($scope.Contactobj.AdvancedRefractionRemarks != "") {
                        $scope.Contactobj.IsAdvanceRemarksInd = true;
                    }

                    $scope.Contactobj.AdvancedFitODComfort = item.AdvancedFitODComfort || "";
                    $scope.Contactobj.AdvancedFitODCentration = item.AdvancedFitODCentration || "";
                    $scope.Contactobj.AdvancedFitODCoverage = item.AdvancedFitODCoverage || "";
                    $scope.Contactobj.AdvancedFitODMovement = item.AdvancedFitODMovement || "";
                    $scope.Contactobj.AdvancedFitODDegrees = item.AdvancedFitODDegrees || "";
                    $scope.Contactobj.AdvancedFitODDirection = item.AdvancedFitODDirection || "";
                    $scope.Contactobj.AdvancedRefractionODSph = item.AdvancedRefractionODSph || "";
                    $scope.Contactobj.AdvancedRefractionODCyl = item.AdvancedRefractionODCyl || "";
                    $scope.Contactobj.AdvancedRefractionODAxis = item.AdvancedRefractionODAxis || "";
                    $scope.Contactobj.AdvancedRefractionODAdd = item.AdvancedRefractionODAdd || "";
                    $scope.Contactobj.AdvancedRefractionODVaDistance = item.AdvancedRefractionODVaDistance || "";
                    $scope.Contactobj.AdvancedRefractionODVaNear = item.AdvancedRefractionODVaNear || "";
                    $scope.Contactobj.AdvancedRefractionODVaIntermediate = item.AdvancedRefractionODVaIntermediate || "";

                    $scope.Contactobj.AdvancedFitOSComfort = item.AdvancedFitOSComfort || "";
                    $scope.Contactobj.AdvancedFitOSCentration = item.AdvancedFitOSCentration || "";
                    $scope.Contactobj.AdvancedFitOSCoverage = item.AdvancedFitOSCoverage || "";
                    $scope.Contactobj.AdvancedFitOSMovement = item.AdvancedFitOSMovement || "";
                    $scope.Contactobj.AdvancedFitOSDegrees = item.AdvancedFitOSDegrees || "";
                    $scope.Contactobj.AdvancedFitOSDirection = item.AdvancedFitOSDirection || "";
                    $scope.Contactobj.AdvancedRefractionOSSph = item.AdvancedRefractionOSSph || "";
                    $scope.Contactobj.AdvancedRefractionOSCyl = item.AdvancedRefractionOSCyl || "";
                    $scope.Contactobj.AdvancedRefractionOSAxis = item.AdvancedRefractionOSAxis || "";
                    $scope.Contactobj.AdvancedRefractionOSAdd = item.AdvancedRefractionOSAdd || "";
                    $scope.Contactobj.AdvancedRefractionOSVaDistance = item.AdvancedRefractionOSVaDistance || "";
                    $scope.Contactobj.AdvancedRefractionOSVaNear = item.AdvancedRefractionOSVaNear || "";
                    $scope.Contactobj.AdvancedRefractionOSVaIntermediate = item.AdvancedRefractionOSVaIntermediate || "";

                    $scope.Contactobj.AdvancedRefractionOUVaDistance = item.AdvancedRefractionOUVaDistance || "";
                    $scope.Contactobj.AdvancedRefractionOUVaNear = item.AdvancedRefractionOUVaNear || "";
                    $scope.Contactobj.AdvancedRefractionOUVaIntermediate = item.AdvancedRefractionOUVaIntermediate || "";

                    $scope.CLSphericalListBoth = GetSphericalBothList();
                    $scope.CLDesignTypeList = GetCLDesignTypeList();
                    $scope.CLCylindricalListBoth = GetCylBothList();
                    $scope.SphericalPlusList = GetSphericalPlusList();
                    $scope.SphericalMinusList = GetSphericalMinusList();
                    $scope.CylPlusList = GetCylPlusList();
                    $scope.CylMinusList = GetCylMinusList();
                    $scope.AxisPlusList = GetAxisPlusList();
                    $scope.AddtionList = GetAddtionList();
                    $scope.BCList = GetBCList();
                    $scope.DiaList = GetDiaList();
                    $scope.KeratometryList = GetKeratometryList();
                    $scope.DistanceList = GetDistanceList();
                    $scope.NearList = GetDistanceList();
                    $scope.IntermediateList = GetDistanceList();
                    $scope.CLColorList = GetColorList();
                    $scope.CLProductList = GetProductList();
                    $scope.MovementList = GetMovementList();
                    $scope.DegreesList = GetDegreesList();
                    $scope.CLDirectionList = GetDirectionList();
                    $scope.CLCoverageList = GetCoverageList();
                    $scope.CLCentrationList = GetCentrationList();
                    $scope.CLComfortList = GetComfortList();
                    $scope.AdvanceSphericalPlusList = GetSphericalPlusList();
                    $scope.AdvanceSphericalMinusList = GetSphericalMinusList();
                    $scope.AdvanceCylMinusList = GetCylMinusList();
                    $scope.AdvanceAxisPlusList = GetAxisPlusList();
                    $scope.AdvanceAddtionList = GetAddtionList();
                    $scope.AdvanceDistanceList = GetDistanceList();
                    $scope.AdvanceNearList = GetDistanceList();
                    $scope.AdvanceIntermediateList = GetDistanceList();
                    $scope.Contactobj.SelectedEye = "OD";

                    //Logs//
                    let copyText = formatContactLensCopy(item);
                    if (copyText && copyText.trim() !== "") {
                        let LogItem = {
                            "LogId": 0,
                            "ModuleId": 1,
                            "ModuleName": "OUTPatient",
                            "SubModuleId": 51,
                            "SubModuleName": "Contact Lens",
                            "ScreenType": "Soft Contact Lens",
                            "ActionType": "Accessed",
                            "OldActionDescription": "",
                            "NewActionDescription": `Copy ${item.SubInvestigationName} values into ${$scope.Contactobj.TypeName}\n` +
                                `Copied values are:\n${copyText}`,
                        }
                        $scope.AddAuditLogNew(LogItem);
                    }
                    //Logs//
                    // hightlight selected values


                    if ($scope.Contactobj.BasicODSeries !== "") {
                        let tempAxisArray = $filter('filter')($scope.BrandsMainarray, { "Value": $scope.Contactobj.BasicODSeries }, true) || [];
                        if (tempAxisArray.length > 0) {
                            let tempAxisObj = tempAxisArray[0];
                            let AxisIndex = $scope.BrandsMainarray.indexOf(tempAxisObj);
                            $scope.BrandsMainarray[AxisIndex].selected = true;
                        }
                    }

                    if ($scope.Contactobj.BasicODDesignType !== "") {
                        let tempAxisArray = $filter('filter')($scope.CLDesignTypeList, { "Value": $scope.Contactobj.BasicODDesignType }, true);
                        if (tempAxisArray.length > 0) {
                            let tempAxisObj = tempAxisArray[0];
                            let AxisIndex = $scope.CLDesignTypeList.indexOf(tempAxisObj);
                            $scope.CLDesignTypeList[AxisIndex].selected = true;
                        }
                    }
                    if ($scope.Contactobj.BasicODSph !== "") {
                        let tempSphArray = $filter('filter')($scope.SphericalPlusList, { "Value": $scope.Contactobj.BasicODSph }, true) || [];
                        if (tempSphArray.length > 0) {
                            let tempSphObj = tempSphArray[0];
                            let SphIndex = $scope.SphericalPlusList.indexOf(tempSphObj);
                            $scope.SphericalPlusList[SphIndex].selected = true;
                            $scope.Contactobj.SphericalSwitch = 1;
                        } else {
                            let tempSphArray = $filter('filter')($scope.SphericalMinusList, { "Value": $scope.Contactobj.BasicODSph }, true) || [];
                            if (tempSphArray.length > 0) {
                                let tempSphObj = tempSphArray[0];
                                let SphIndex = $scope.SphericalMinusList.indexOf(tempSphObj);
                                $scope.SphericalMinusList[SphIndex].selected = true;
                                $scope.Contactobj.SphericalSwitch = 2;
                            }
                        }
                    }
                    if ($scope.Contactobj.BasicODCyl !== "") {
                        let tempCylArray = $filter('filter')($scope.CylPlusList, { "Value": $scope.Contactobj.BasicODCyl }, true);
                        if (tempCylArray.length > 0) {
                            let tempCylObj = tempCylArray[0];
                            let CylIndex = $scope.CylPlusList.indexOf(tempCylObj);
                            $scope.CylPlusList[CylIndex].selected = true;
                            $scope.Contactobj.CylindricalSwitch = 1;
                        } else {
                            let tempCylArray = $filter('filter')($scope.CylMinusList, { "Value": $scope.Contactobj.BasicODCyl }, true);
                            if (tempCylArray.length > 0) {
                                let tempCylObj = tempCylArray[0];
                                let CylIndex = $scope.CylMinusList.indexOf(tempCylObj);
                                $scope.CylMinusList[CylIndex].selected = true;
                                $scope.Contactobj.CylindricalSwitch = 2;
                            }
                        }
                    }
                    if ($scope.Contactobj.BasicODAxis !== "") {
                        let tempAxisArray = $filter('filter')($scope.AxisPlusList, { "Value": $scope.Contactobj.BasicODAxis }, true);
                        if (tempAxisArray.length > 0) {
                            let tempAxisObj = tempAxisArray[0];
                            let AxisIndex = $scope.AxisPlusList.indexOf(tempAxisObj);
                            $scope.AxisPlusList[AxisIndex].selected = true;
                        }
                    }
                    if ($scope.Contactobj.BasicODAdd !== "") {
                        let tempAxisArray = $filter('filter')($scope.AddtionList, { "Value": $scope.Contactobj.BasicODAdd }, true);
                        if (tempAxisArray.length > 0) {
                            let tempAddObj = tempAxisArray[0];
                            let AxisIndex = $scope.AddtionList.indexOf(tempAddObj);
                            $scope.AddtionList[AxisIndex].selected = true;
                        }
                    }
                    if ($scope.Contactobj.BasicODBC !== "") {
                        let tempAxisArray = $filter('filter')($scope.BCList, { "Value": Number($scope.Contactobj.BasicODBC) }, true);
                        if (tempAxisArray.length > 0) {
                            let tempAxisObj = tempAxisArray[0];
                            let AxisIndex = $scope.BCList.indexOf(tempAxisObj);
                            $scope.BCList[AxisIndex].selected = true;
                        }
                    }
                    if ($scope.Contactobj.BasicODDia !== "") {
                        let tempAxisArray = $filter('filter')($scope.DiaList, { "Value": Number($scope.Contactobj.BasicODDia) }, true);
                        if (tempAxisArray.length > 0) {
                            let tempAxisObj = tempAxisArray[0];
                            let AxisIndex = $scope.DiaList.indexOf(tempAxisObj);
                            $scope.DiaList[AxisIndex].selected = true;
                        }
                    }
                    if ($scope.Contactobj.BasicODKeratometry !== "") {
                        let tempAxisArray = $filter('filter')($scope.KeratometryList, { "Value": $scope.Contactobj.BasicODKeratometry }, true);
                        if (tempAxisArray.length > 0) {
                            let tempAxisObj = tempAxisArray[0];
                            let AxisIndex = $scope.KeratometryList.indexOf(tempAxisObj);
                            $scope.KeratometryList[AxisIndex].selected = true;
                        }
                    }
                    if ($scope.Contactobj.BasicODColor !== "") {
                        let tempAxisArray = $filter('filter')($scope.MainColorlist, { "Value": $scope.Contactobj.BasicODColor }, true);
                        if (tempAxisArray.length > 0) {
                            let tempAxisObj = tempAxisArray[0];
                            let AxisIndex = $scope.MainColorlist.indexOf(tempAxisObj);
                            $scope.MainColorlist[AxisIndex].selected = true;
                        }
                    }
                    if ($scope.Contactobj.BasicODProduct !== "") {
                        let tempAxisArray = $filter('filter')($scope.FilterProductlist, { "Value": $scope.Contactobj.BasicODProduct }, true);
                        if (tempAxisArray.length > 0) {
                            let tempAxisObj = tempAxisArray[0];
                            let AxisIndex = $scope.FilterProductlist.indexOf(tempAxisObj);
                            $scope.FilterProductlist[AxisIndex].selected = true;
                        }
                    }
                    if ($scope.Contactobj.BasicODVaDistance !== "") {
                        let tempAxisArray = $filter('filter')($scope.DistanceList, { "Value": $scope.Contactobj.BasicODVaDistance }, true);
                        if (tempAxisArray.length > 0) {
                            let tempAxisObj = tempAxisArray[0];
                            let AxisIndex = $scope.DistanceList.indexOf(tempAxisObj);
                            $scope.DistanceList[AxisIndex].selected = true;
                        }
                    }
                    if ($scope.Contactobj.BasicODVaNear !== "") {
                        let tempAxisArray = $filter('filter')($scope.NearList, { "Value": $scope.Contactobj.BasicODVaNear }, true);
                        if (tempAxisArray.length > 0) {
                            let tempAxisObj = tempAxisArray[0];
                            let AxisIndex = $scope.NearList.indexOf(tempAxisObj);
                            $scope.NearList[AxisIndex].selected = true;
                        }
                    }
                    if ($scope.Contactobj.BasicODVaIntermediate !== "") {
                        let tempAxisArray = $filter('filter')($scope.IntermediateList, { "Value": $scope.Contactobj.BasicODVaIntermediate }, true);
                        if (tempAxisArray.length > 0) {
                            let tempAxisObj = tempAxisArray[0];
                            let AxisIndex = $scope.IntermediateList.indexOf(tempAxisObj);
                            $scope.IntermediateList[AxisIndex].selected = true;
                        }
                    }
                    if ($scope.Contactobj.AdvancedFitODComfort !== "") {
                        let tempAxisArray = $filter('filter')($scope.CLComfortList, { "Value": $scope.Contactobj.AdvancedFitODComfort }, true) || [];
                        if (tempAxisArray.length > 0) {
                            let tempAxisObj = tempAxisArray[0];
                            let AxisIndex = $scope.CLComfortList.indexOf(tempAxisObj);
                            $scope.CLComfortList[AxisIndex].selected = true;
                        }
                    }
                    if ($scope.Contactobj.AdvancedFitODCentration !== "") {
                        let tempAxisArray = $filter('filter')($scope.CLCentrationList, { "Value": $scope.Contactobj.AdvancedFitODCentration }, true) || [];
                        if (tempAxisArray.length > 0) {
                            let tempAxisObj = tempAxisArray[0];
                            let AxisIndex = $scope.CLCentrationList.indexOf(tempAxisObj);
                            $scope.CLCentrationList[AxisIndex].selected = true;
                        }
                    }
                    if ($scope.Contactobj.AdvancedFitODCoverage !== "") {
                        let tempAxisArray = $filter('filter')($scope.CLCoverageList, { "Value": $scope.Contactobj.AdvancedFitODCoverage }, true) || [];
                        if (tempAxisArray.length > 0) {
                            let tempAxisObj = tempAxisArray[0];
                            let AxisIndex = $scope.CLCoverageList.indexOf(tempAxisObj);
                            $scope.CLCoverageList[AxisIndex].selected = true;
                        }
                    }
                    if ($scope.Contactobj.AdvancedFitODMovement !== "") {
                        let tempAxisArray = $filter('filter')($scope.MovementList, { "Value": $scope.Contactobj.AdvancedFitODMovement }, true) || [];
                        if (tempAxisArray.length > 0) {
                            let tempAxisObj = tempAxisArray[0];
                            let AxisIndex = $scope.MovementList.indexOf(tempAxisObj);
                            $scope.MovementList[AxisIndex].selected = true;
                        }
                    }
                    if ($scope.Contactobj.AdvancedFitODDegrees !== "") {
                        let tempAxisArray = $filter('filter')($scope.DegreesList, { "Value": $scope.Contactobj.AdvancedFitODDegrees }, true) || [];
                        if (tempAxisArray.length > 0) {
                            let tempAxisObj = tempAxisArray[0];
                            let AxisIndex = $scope.DegreesList.indexOf(tempAxisObj);
                            $scope.DegreesList[AxisIndex].selected = true;
                        }
                    }
                    if ($scope.Contactobj.AdvancedFitODDirection !== "") {
                        let tempAxisArray = $filter('filter')($scope.CLDirectionList, { "Value": $scope.Contactobj.AdvancedFitODDirection }, true) || [];
                        if (tempAxisArray.length > 0) {
                            let tempAxisObj = tempAxisArray[0];
                            let AxisIndex = $scope.CLDirectionList.indexOf(tempAxisObj);
                            $scope.CLDirectionList[AxisIndex].selected = true;
                        }
                    }
                    if ($scope.Contactobj.AdvancedRefractionODSph !== "") {
                        let tempAxisArray = $filter('filter')($scope.AdvanceSphericalMinusList, { "Value": $scope.Contactobj.AdvancedRefractionODSph }, true) || [];
                        if (tempAxisArray.length > 0) {
                            let tempAxisObj = tempAxisArray[0];
                            let AxisIndex = $scope.AdvanceSphericalMinusList.indexOf(tempAxisObj);
                            $scope.AdvanceSphericalMinusList[AxisIndex].selected = true;
                        }
                    }
                    if ($scope.Contactobj.AdvancedRefractionODCyl !== "") {
                        let tempAxisArray = $filter('filter')($scope.AdvanceCylMinusList, { "Value": $scope.Contactobj.AdvancedRefractionODCyl }, true) || [];
                        if (tempAxisArray.length > 0) {
                            let tempAxisObj = tempAxisArray[0];
                            let AxisIndex = $scope.AdvanceCylMinusList.indexOf(tempAxisObj);
                            $scope.AdvanceCylMinusList[AxisIndex].selected = true;
                        }
                    }
                    if ($scope.Contactobj.AdvancedRefractionODAxis !== "") {
                        let tempAxisArray = $filter('filter')($scope.AdvanceAxisPlusList, { "Value": $scope.Contactobj.AdvancedRefractionODAxis }, true) || [];
                        if (tempAxisArray.length > 0) {
                            let tempAxisObj = tempAxisArray[0];
                            let AxisIndex = $scope.AdvanceAxisPlusList.indexOf(tempAxisObj);
                            $scope.AdvanceAxisPlusList[AxisIndex].selected = true;
                        }
                    }
                    if ($scope.Contactobj.AdvancedRefractionODVaDistance !== "") {
                        let tempAxisArray = $filter('filter')($scope.AdvanceDistanceList, { "Value": $scope.Contactobj.AdvancedRefractionODVaDistance }, true) || [];
                        if (tempAxisArray.length > 0) {
                            let tempAxisObj = tempAxisArray[0];
                            let AxisIndex = $scope.AdvanceDistanceList.indexOf(tempAxisObj);
                            $scope.AdvanceDistanceList[AxisIndex].selected = true;
                        }
                    }
                    if ($scope.Contactobj.AdvancedRefractionODVaNear !== "") {
                        let tempAxisArray = $filter('filter')($scope.AdvanceNearList, { "Value": $scope.Contactobj.AdvancedRefractionODVaNear }, true) || [];
                        if (tempAxisArray.length > 0) {
                            let tempAxisObj = tempAxisArray[0];
                            let AxisIndex = $scope.AdvanceNearList.indexOf(tempAxisObj);
                            $scope.AdvanceNearList[AxisIndex].selected = true;
                        }
                    }
                    if ($scope.Contactobj.AdvancedRefractionODVaIntermediate !== "") {
                        let tempAxisArray = $filter('filter')($scope.AdvanceIntermediateList, { "Value": $scope.Contactobj.AdvancedRefractionODVaIntermediate }, true) || [];
                        if (tempAxisArray.length > 0) {
                            let tempAxisObj = tempAxisArray[0];
                            let AxisIndex = $scope.AdvanceIntermediateList.indexOf(tempAxisObj);
                            $scope.AdvanceIntermediateList[AxisIndex].selected = true;
                        }
                    }
                    callFrom = callFrom || "";
                    actionSection = actionSection || "";
                    $scope.CloseGridPopupIfSectionChanged(
                        callFrom,
                        actionSection
                    );
                    $scope.RefreshGridAfterAction();
                    $scope.$digest();
                }, function () {
                    r = "You pressed Cancel!";
                });
            }
        }

        $scope.CopyAdanceDetails = function (type,typeid) {
            if (typeid == 1) {
                if (type == 'Fit') {
                    $scope.Contactobj.AdvancedFitOSComfort = angular.copy($scope.Contactobj.AdvancedFitODComfort);
                    $scope.Contactobj.AdvancedFitOSCentration = angular.copy($scope.Contactobj.AdvancedFitODCentration);
                    $scope.Contactobj.AdvancedFitOSCoverage = angular.copy($scope.Contactobj.AdvancedFitODCoverage);
                    $scope.Contactobj.AdvancedFitOSMovement = angular.copy($scope.Contactobj.AdvancedFitODMovement);
                    $scope.Contactobj.AdvancedFitOSDegrees = angular.copy($scope.Contactobj.AdvancedFitODDegrees);
                    $scope.Contactobj.AdvancedFitOSDirection = angular.copy($scope.Contactobj.AdvancedFitODDirection);
                }
                else {
                    $scope.Contactobj.AdvancedRefractionOSSph = angular.copy($scope.Contactobj.AdvancedRefractionODSph);
                    $scope.Contactobj.AdvancedRefractionOSCyl = angular.copy($scope.Contactobj.AdvancedRefractionODCyl);
                    $scope.Contactobj.AdvancedRefractionOSAxis = angular.copy($scope.Contactobj.AdvancedRefractionODAxis);
                    $scope.Contactobj.AdvancedRefractionOSAdd = angular.copy($scope.Contactobj.AdvancedRefractionODAdd);
                    $scope.Contactobj.AdvancedRefractionOSVaDistance = angular.copy($scope.Contactobj.AdvancedRefractionODVaDistance);
                    $scope.Contactobj.AdvancedRefractionOSVaNear = angular.copy($scope.Contactobj.AdvancedRefractionODVaNear);
                    $scope.Contactobj.AdvancedRefractionOSVaIntermediate = angular.copy($scope.Contactobj.AdvancedRefractionODVaIntermediate);
                }
            } else {

                if (type == 'Fit') {
                    $scope.RGPContactobj.AdvancedFitOSComfort = angular.copy($scope.RGPContactobj.AdvancedFitODComfort);
                    $scope.RGPContactobj.AdvancedFitOSCentration = angular.copy($scope.RGPContactobj.AdvancedFitODCentration);
                    $scope.RGPContactobj.AdvancedFitOSCoverage = angular.copy($scope.RGPContactobj.AdvancedFitODCoverage);
                    $scope.RGPContactobj.AdvancedFitOSMovement = angular.copy($scope.RGPContactobj.AdvancedFitODMovement);
                    $scope.RGPContactobj.AdvancedFitOSDegrees = angular.copy($scope.RGPContactobj.AdvancedFitODDegrees);
                    $scope.RGPContactobj.AdvancedFitOSDirection = angular.copy($scope.RGPContactobj.AdvancedFitODDirection);
                }
                else {
                    $scope.RGPContactobj.AdvancedRefractionOSSph = angular.copy($scope.RGPContactobj.AdvancedRefractionODSph);
                    $scope.RGPContactobj.AdvancedRefractionOSCyl = angular.copy($scope.RGPContactobj.AdvancedRefractionODCyl);
                    $scope.RGPContactobj.AdvancedRefractionOSAxis = angular.copy($scope.RGPContactobj.AdvancedRefractionODAxis);
                    $scope.RGPContactobj.AdvancedRefractionOSAdd = angular.copy($scope.RGPContactobj.AdvancedRefractionODAdd);
                    $scope.RGPContactobj.AdvancedRefractionOSVaDistance = angular.copy($scope.RGPContactobj.AdvancedRefractionODVaDistance);
                    $scope.RGPContactobj.AdvancedRefractionOSVaNear = angular.copy($scope.RGPContactobj.AdvancedRefractionODVaNear);
                    $scope.RGPContactobj.AdvancedRefractionOSVaIntermediate = angular.copy($scope.RGPContactobj.AdvancedRefractionODVaIntermediate);
                }
            }
        }
        function getAllobjects() {
            $scope.CLSphericalListBoth = GetSphericalBothList();
            $scope.CLDesignTypeList = GetCLDesignTypeList();
            $scope.CLCylindricalListBoth = GetCylBothList();
            $scope.SphericalPlusList = GetSphericalPlusList();
            $scope.SphericalMinusList = GetSphericalMinusList();
            $scope.CylPlusList = GetCylPlusList();
            $scope.CylMinusList = GetCylMinusList();
            $scope.AxisPlusList = GetAxisPlusList();
            $scope.AddtionList = GetAddtionList();
            $scope.BCList = GetBCList();
            $scope.DiaList = GetDiaList();
            $scope.KeratometryList = GetKeratometryList();
            $scope.DistanceList = GetDistanceList();
            $scope.NearList = GetDistanceList();
            $scope.IntermediateList = GetDistanceList();
            $scope.CLColorList = GetColorList();
            $scope.CLProductList = GetProductList();
            $scope.MovementList = GetMovementList();
            $scope.DegreesList = GetDegreesList();
            $scope.CLDirectionList = GetDirectionList();
            $scope.CLCoverageList = GetCoverageList();
            $scope.CLCentrationList = GetCentrationList();
            $scope.CLComfortList = GetComfortList();
            $scope.AdvanceSphericalPlusList = GetSphericalPlusList();
            $scope.AdvanceSphericalMinusList = GetSphericalMinusList();
            $scope.AdvanceCylMinusList = GetCylMinusList();
            $scope.AdvanceAxisPlusList = GetAxisPlusList();
            $scope.AdvanceDistanceList = GetDistanceList();
            $scope.AdvanceNearList = GetDistanceList();
            $scope.AdvanceIntermediateList = GetDistanceList();
        }
        $scope.onClickGridView = function () {
            getAllobjects()
            if ($scope.lenstab == 1) {
                $scope.subtabobj.CLsubtab = 2;
                if ($scope.Contactobj.SelectedEye == "OD") {
                    $scope.ChangeSelectedEye('OD');
                } else if ($scope.Contactobj.SelectedEye == "OS") {
                    $scope.ChangeSelectedEye('OS');
                } else {
                    $scope.ChangeSelectedEye('OU');
                }
            } else if ($scope.lenstab == 2) {
                $scope.subtabobj.RGPsubtab = 2;
                if ($scope.RGPContactobj.SelectedEye == "OD") {
                    $scope.ChangeRGPSelectedEye('OD');
                } else if ($scope.RGPContactobj.SelectedEye == "OS") {
                    $scope.ChangeRGPSelectedEye('OS');
                } else {
                    $scope.ChangeRGPSelectedEye('OU');
                }
            }
        }

        $scope.Historypopupnew = function (tab, type, from) {
            var HistoryTab = 19;
            type = type || 2;
            from = from || "";
            let LogItem = {
                "LogId": 0,
                "ModuleId": 1,
                "ModuleName": "OUTPATIENT",
                "SubModuleId": 51,
                "SubModuleName": "Contact Lens",
                "ScreenType": "History",
                "ActionType": "Accessed",
                "OldActionDescription": "",
                "NewActionDescription": "History from Contact Lens",
            }
            $scope.AddAuditLogNew(LogItem);
            var $uibModalInstance = $uibModal.open({
                "templateUrl": "templates/UsNewConsultation/uibpopup/Historypopupnew.html",
                "controller": "HistorypopupnewCtrl",
                "backdrop": "static",
                //"scope": $scope,
                //"size": "lg",
              /*  "windowClass": "offcanves-right  ",*/
                "windowClass": "modal__popup--1 bottom-to-top-modal  ",
                "keyboard": false,
                "resolve": {
                    "HistoryTab": function () { return HistoryTab },
                    "Patientid": function () { return angular.copy($scope.cacheStorageItem.PatientID) },
                    "HospitalId": function () { return angular.copy($scope.HospitalId) },
                    "VisionObj": function () { return angular.copy($scope.VisionObj) },
                    "obj": function () { return angular.copy($scope.obj) },
                    "RefractionDetails": function () { return angular.copy($scope.PreviousInvestigationIdArray) },
                    "TonometrySubList": function () { return angular.copy($scope.TonometrySubList) },
                    "cacheStorageItem": function () { return angular.copy($scope.cacheStorageItem) },
                    "type": function () { return type },
                    "Comingfrom": function () { return from },
                },

            });

            $uibModalInstance.result.then(function (resp) {
                    let obj = angular.copy(resp.Contactobj);
                let GivenByName = '';
                var Arraylist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.UserId }, true);
                if (Arraylist.length > 0) {
                    GivenByName = Arraylist[0].FullName;
                }
                if (obj.SLPArray.length > 0) {
                    angular.forEach($scope.obj.ContactLensDetails, function (mitem) {
                        let index = mitem.InvestigationDetails.length;
                        angular.forEach(obj.SLPArray, function (item) {
                          if (mitem.InvestigationId == item.InvestigationId) {
                              var InvObj = {
                                  "TypeName": item.TypeName,
                                  "TypeId": item.TypeId,
                                  "SubInvestigationName": item.SubInvestigationName,
                                  "SubInvestigationId": item.SubInvestigationId,
                                  //"SubTypeName": "Basic",
                                  //"SelectedEye": "OD",
                                  //"AdvancedSubType": "Fit",
                                  "IsEdit": false,
                                  "ContactLensDetailId": 0,
                                  "DeleteInd": "N",
                                  "BasicODDesignType": item.BasicODDesignType || '',
                                  "BasicODSph": item.BasicODSph || '',
                                  "BasicODCyl": item.BasicODCyl || '',
                                  "BasicODAxis": item.BasicODAxis || '',
                                  "BasicODBC": item.BasicODBC || '',
                                  "BasicODDia": item.BasicODDia || '',
                                  "BasicODKeratometry": item.BasicODKeratometry || '',
                                  "BasicODColor": item.BasicODColor || '',
                                  "BasicODProduct": item.BasicODProduct || '',
                                  "BasicODAdd": item.BasicODAdd || '',
                                  "BasicOSAdd": item.BasicOSAdd || '',
                                  "BasicODSeries": item.BasicODSeries || '',
                                  "BasicOSSeries": item.BasicOSSeries || '',
                                  "BasicODVaDistance": item.BasicODVaDistance || '',
                                  "BasicODVaNear": item.BasicODVaNear || '',
                                  "BasicODVaIntermediate": item.BasicODVaIntermediate || '',
                                  "BasicOSDesignType": item.BasicOSDesignType || '',
                                  "BasicOSSph": item.BasicOSSph || '',
                                  "BasicOSCyl": item.BasicOSCyl || '',
                                  "BasicOSAxis": item.BasicOSAxis || '',
                                  "BasicOSBC": item.BasicOSBC || '',
                                  "BasicOSDia": item.BasicOSDia || '',
                                  "BasicOSKeratometry": item.BasicOSKeratometry || '',
                                  "BasicOSColor": item.BasicOSColor || '',
                                  "BasicOSProduct": item.BasicOSProduct || '',
                                  "BasicOSVaDistance": item.BasicOSVaDistance || '',
                                  "BasicOSVaNear": item.BasicOSVaNear || '',
                                  "BasicOSVaIntermediate": item.BasicOSVaIntermediate || '',
                                  "BasicOUVaDistance": item.BasicOUVaDistance || '',
                                  "BasicOUVaNear": item.BasicOUVaNear || '',
                                  "BasicOUVaIntermediate": item.BasicOUVaIntermediate || '',
                                  "BasicInstructions": item.BasicInstructions || '',
                                  "BasicRemarks": "",
                                  "ReplacementSchedule": "",
                                  "RxExpiration": "",
                                  "AdvancedFitODComfort": item.AdvancedFitODComfort || '',
                                  "AdvancedFitODCentration": item.AdvancedFitODCentration || '',
                                  "AdvancedFitODCoverage": item.AdvancedFitODCoverage || '',
                                  "AdvancedFitODMovement": item.AdvancedFitODMovement || '',
                                  "AdvancedFitODDegrees": item.AdvancedFitODDegrees || '',
                                  "AdvancedFitODDirection": item.AdvancedFitODDirection || '',
                                  "AdvancedFitOSComfort": item.AdvancedFitOSComfort || '',
                                  "AdvancedFitOSCentration": item.AdvancedFitOSCentration || '',
                                  "AdvancedFitOSCoverage": item.AdvancedFitOSCoverage || '',
                                  "AdvancedFitOSMovement": item.AdvancedFitOSMovement || '',
                                  "AdvancedFitOSDegrees": item.AdvancedFitOSDegrees || '',
                                  "AdvancedFitOSDirection": item.AdvancedFitOSDirection || '',
                                  "AdvancedRefractionODSph": item.AdvancedRefractionODSph || '',
                                  "AdvancedRefractionODCyl": item.AdvancedRefractionODCyl || '',
                                  "AdvancedRefractionODAxis": item.AdvancedRefractionODAxis || '',
                                  "AdvancedRefractionODVaDistance": item.AdvancedRefractionODVaDistance || '',
                                  "AdvancedRefractionODVaNear": item.AdvancedRefractionODVaNear || '',
                                  "AdvancedRefractionODVaIntermediate": item.AdvancedRefractionODVaIntermediate || '',
                                  "AdvancedRefractionOSSph": item.AdvancedRefractionOSSph || '',
                                  "AdvancedRefractionOSCyl": item.AdvancedRefractionOSCyl || '',
                                  "AdvancedRefractionOSAxis": item.AdvancedRefractionOSAxis || '',
                                  "AdvancedRefractionOSVaDistance": item.AdvancedRefractionOSVaDistance || '',
                                  "AdvancedRefractionOSVaNear": item.AdvancedRefractionOSVaNear || '',
                                  "AdvancedRefractionOSVaIntermediate": item.AdvancedRefractionOSVaIntermediate || '',
                                  "AdvancedRefractionOUVaDistance": item.AdvancedRefractionOUVaDistance || '',
                                  "AdvancedRefractionOUVaNear": item.AdvancedRefractionOUVaNear || '',
                                  "AdvancedRefractionOUVaIntermediate": item.AdvancedRefractionOUVaIntermediate || '',
                                  "AdvancedRefractionODAdd": item.AdvancedRefractionODAdd || '',
                                  "AdvancedRefractionOSAdd": item.AdvancedRefractionOSAdd || '',
                                  "ODSpecialInstructions": "",
                                  "OSSpecialInstructions": "",
                                  "AdvancedRefractionRemarks": "",
                                  //"showstatus": false,
                                  //"IsBasicRemarksInd": false,
                                  //"IsBasicInstructionsInd": false,
                                  //"IsAdvanceRemarksInd": false,
                                  "Sno": index + 1,
                                  //"SphericalSwitch": 2,
                                  //"CylindricalSwitch": 2,
                                  "GivenByName": GivenByName,
                                  "CreatedDateTime": $filter('date')(new Date(), 'MM-dd-yyyy,hh:mm a'),
                              }
                              mitem.InvestigationDetails.push(InvObj);
                          }
                        });
                    });
                }

                if (obj.RGPArray.length > 0) {
                    angular.forEach($scope.obj.ContactLensDetails, function (mitem) {
                        let index = mitem.InvestigationDetails.length;
                        angular.forEach(obj.RGPArray, function (item) {
                            if (mitem.InvestigationId == item.InvestigationId) {
                                var InvObj = {
                                    "TypeName": item.TypeName,
                                    "TypeId": item.TypeId,
                                    "SubInvestigationName": item.SubInvestigationName,
                                    "SubInvestigationId": item.SubInvestigationId,
                                    //"SubTypeName": "Basic",
                                    //"SelectedEye": "OD",
                                    //"AdvancedSubType": "Fit",
                                    "IsEdit": false,
                                    "ContactLensDetailId": 0,
                                    "DeleteInd": "N",
                                    "BasicODDesignType": item.BasicODDesignType || '',
                                    "BasicODSph": item.BasicODSph || '',
                                    "BasicODCyl": item.BasicODCyl || '',
                                    "BasicODAxis": item.BasicODAxis || '',
                                    "BasicODBC": item.BasicODBC || '',
                                    "BasicODDia": item.BasicODDia || '',
                                    "BasicODKeratometry": item.BasicODKeratometry || '',
                                    "BasicODColor": item.BasicODColor || '',
                                    "BasicODProduct": item.BasicODProduct || '',
                                    "BasicODVaDistance": item.BasicODVaDistance || '',
                                    "BasicODVaNear": item.BasicODVaNear || '',
                                    "BasicODAdd": item.BasicODAdd || '',
                                    "BasicOSAdd": item.BasicOSAdd || '',
                                    "BasicODSeries": item.BasicODSeries || '',
                                    "BasicOSSeries": item.BasicOSSeries || '',
                                    "BasicODVaIntermediate": item.BasicODVaIntermediate || '',
                                    "BasicOSDesignType": item.BasicOSDesignType || '',
                                    "BasicOSSph": item.BasicOSSph || '',
                                    "BasicOSCyl": item.BasicOSCyl || '',
                                    "BasicOSAxis": item.BasicOSAxis || '',
                                    "BasicOSBC": item.BasicOSBC || '',
                                    "BasicOSDia": item.BasicOSDia || '',
                                    "BasicOSKeratometry": item.BasicOSKeratometry || '',
                                    "BasicOSColor": item.BasicOSColor || '',
                                    "BasicOSProduct": item.BasicOSProduct || '',
                                    "BasicOSVaDistance": item.BasicOSVaDistance || '',
                                    "BasicOSVaNear": item.BasicOSVaNear || '',
                                    "BasicOSVaIntermediate": item.BasicOSVaIntermediate || '',
                                    "BasicOUVaDistance": item.BasicOUVaDistance || '',
                                    "BasicOUVaNear": item.BasicOUVaNear || '',
                                    "BasicOUVaIntermediate": item.BasicOUVaIntermediate || '',
                                    "BasicInstructions": item.BasicInstructions || '',
                                    "BasicRemarks": "",
                                    "ReplacementSchedule": "",
                                    "RxExpiration": "",
                                    "AdvancedFitODComfort": item.AdvancedFitODComfort || '',
                                    "AdvancedFitODCentration": item.AdvancedFitODCentration || '',
                                    "AdvancedFitODCoverage": item.AdvancedFitODCoverage || '',
                                    "AdvancedFitODMovement": item.AdvancedFitODMovement || '',
                                    "AdvancedFitODDegrees": item.AdvancedFitODDegrees || '',
                                    "AdvancedFitODDirection": item.AdvancedFitODDirection || '',
                                    "AdvancedFitOSComfort": item.AdvancedFitOSComfort || '',
                                    "AdvancedFitOSCentration": item.AdvancedFitOSCentration || '',
                                    "AdvancedFitOSCoverage": item.AdvancedFitOSCoverage || '',
                                    "AdvancedFitOSMovement": item.AdvancedFitOSMovement || '',
                                    "AdvancedFitOSDegrees": item.AdvancedFitOSDegrees || '',
                                    "AdvancedFitOSDirection": item.AdvancedFitOSDirection || '',
                                    "AdvancedRefractionODSph": item.AdvancedRefractionODSph || '',
                                    "AdvancedRefractionODCyl": item.AdvancedRefractionODCyl || '',
                                    "AdvancedRefractionODAxis": item.AdvancedRefractionODAxis || '',
                                    "AdvancedRefractionODVaDistance": item.AdvancedRefractionODVaDistance || '',
                                    "AdvancedRefractionODVaNear": item.AdvancedRefractionODVaNear || '',
                                    "AdvancedRefractionODVaIntermediate": item.AdvancedRefractionODVaIntermediate || '',
                                    "AdvancedRefractionOSSph": item.AdvancedRefractionOSSph || '',
                                    "AdvancedRefractionOSCyl": item.AdvancedRefractionOSCyl || '',
                                    "AdvancedRefractionOSAxis": item.AdvancedRefractionOSAxis || '',
                                    "AdvancedRefractionOSVaDistance": item.AdvancedRefractionOSVaDistance || '',
                                    "AdvancedRefractionOSVaNear": item.AdvancedRefractionOSVaNear || '',
                                    "AdvancedRefractionOSVaIntermediate": item.AdvancedRefractionOSVaIntermediate || '',
                                    "AdvancedRefractionOUVaDistance": item.AdvancedRefractionOUVaDistance || '',
                                    "AdvancedRefractionOUVaNear": item.AdvancedRefractionOUVaNear || '',
                                    "AdvancedRefractionOUVaIntermediate": item.AdvancedRefractionOUVaIntermediate || '',
                                    "ODSpecialInstructions": "",
                                    "OSSpecialInstructions": "",
                                    "AdvancedRefractionRemarks": "",
                                    //"showstatus": false,
                                    //"IsBasicRemarksInd": false,
                                    //"IsBasicInstructionsInd": false,
                                    //"IsAdvanceRemarksInd": false,
                                    "Sno": index + 1,
                                    //"SphericalSwitch": 2,
                                    //"CylindricalSwitch": 2,
                                    "GivenByName": GivenByName,
                                    "CreatedDateTime": $filter('date')(new Date(), 'MM-dd-yyyy,hh:mm a'),
                                }
                                mitem.InvestigationDetails.push(InvObj);
                            }
                        });
                    });
                }

            }, function () { });
        }



        $scope.softContactLensTabs = '';
        $scope.rgpTabs = '';

        $scope.changeSoftContactLensTab = function (tab) {
            $scope.softContactLensTabs = tab;
        };

        $scope.changeRgpTab = function (tab) {
            $scope.rgpTabs = tab;
        };
        $scope.IsKeypadEnable = false;
        $scope.inputypeTab  = 1;
        $scope.Changeinputype = function (tab) {
            $scope.inputypeTab = tab || 0;
            $scope.IsKeypadEnable = false;

            if (tab==3) {
                $scope.IsKeypadEnable = true;

            }


        }

        $scope.contactLenseDatagrid = function (section) {

            $scope.GridPopupSection = section || "";
            $scope.GridPopupInstance = $uibModal.open({
                "templateUrl": "contactLenseDatagrid.html",
                //"size": "lg",
                "backdrop": "static",
                "keyboard": false,
                "scope": $scope,
                "windowClass": "modal__popup--1 bottom-to-top-modal pt__180--",
                "controller": function ($scope, $uibModal, $uibModalInstance) {
                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                        $scope.GridPopupInstance = null;
                        $scope.GridPopupSection = null;
                    };
                }
            });
            $scope.GridPopupInstance.result.finally(function () {
                $scope.GridPopupInstance = null;
                $scope.GridPopupSection = null;
            });
        };
        $scope.openAddNotesPopup = function (type) {
            $scope.PopupFocusType = type;

            var modal = $uibModal.open({
                templateUrl: "addNotesPopup.html",
                keyboard: false,
                backdrop: "static",
                scope: $scope,
                windowClass: "modal__threeFifty--px",
                controller: function ($scope, $uibModalInstance) {

                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                }
            });

            modal.rendered.then(function () {

                $timeout(function () {

                    var id = "";

                    if ($scope.PopupFocusType === "Notes") {

                        if ($scope.lenstab === 1) {
                            id = ($scope.subLenstab === 1)
                                ? "txtBasicRemarks"
                                : "txtAdvancedRemarks";
                        }
                        else {
                            id = ($scope.RGPContactobj.SubLenstab === 1)
                                ? "txtRGPBasicRemarks"
                                : "txtRGPAdvancedRemarks";
                        }

                    } else {

                        id = ($scope.lenstab === 1)
                            ? "txtBasicInstructions"
                            : "txtRGPBasicInstructions";
                    }

                    var el = document.getElementById(id);

                    if (el) {
                        el.focus();

                        // Safari retry
                        setTimeout(function () {
                            if (document.activeElement !== el) {
                                el.focus();
                            }
                        }, 100);
                    }

                }, 0);

            });
        };


        //$scope.openAddNotesPopup = function (type) {
        //    $scope.PopupFocusType = type;
        //    let mInstanceAdd = $uibModal.open({
        //        "templateUrl": "addNotesPopup.html",
        //        "keyboard": false,
        //        "backdrop": "static",
        //        "scope": $scope,
        //        "windowClass": "modal__threeFifty--px",
        //        "controller": function ($scope, $uibModalInstance, $timeout) {
        //            $scope.uibclose = function () {
        //                $uibModalInstance.dismiss("cancel");
        //            };

        //            $timeout(function () {

        //                if ($scope.PopupFocusType === "Notes") {

        //                    if ($scope.lenstab === 1) {

        //                        if ($scope.subLenstab === 1)
        //                            document.getElementById("txtBasicRemarks")?.focus();
        //                        else
        //                            document.getElementById("txtAdvancedRemarks")?.focus();

        //                    }
        //                    else {

        //                        if ($scope.RGPContactobj.SubLenstab === 1)
        //                            document.getElementById("txtRGPBasicRemarks")?.focus();
        //                        else
        //                            document.getElementById("txtRGPAdvancedRemarks")?.focus();

        //                    }

        //                }
        //                else {

        //                    if ($scope.lenstab === 1)
        //                        document.getElementById("txtBasicInstructions")?.focus();
        //                    else
        //                        document.getElementById("txtRGPBasicInstructions")?.focus();

        //                }

        //            }, 100);

                
        //        }
        //    });
        //};


        var isTouchDevice =
            ('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0);
        $scope.isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        $scope.isMobile = isTouchDevice;
        $scope.isMobile = isTouchDevice;
        if (!$scope.isMobile) {
            $scope.IsKeypadEnable = true;

        }
        console.log(isTouchDevice);



        $scope.GridObj = {
            LensType: "",
            ConfigName: "",
            Eye: "",
            CurrentIndex: 1,
            TotalCount: 0,
            Header: "",
            Field: "",
            InputId: "",
            Type: "",
            List: [],
            PlusList: [],
            MinusList: [],
            SelectedSign: "+",
            IsPlusMinus: false,
            SummaryConfigName:""
        };

        $scope.GridConfigurations = {

            Soft: {

                Basic: [
                    // Manufacturer
                    //======================
                    {
                        Header: "Manufacturer",
                        Type: "Normal",

                        GetField: function (eye) {
                            return "Basic" + eye + "Product";
                        },

                        GetInputId: function (eye) {
                            return eye + "Prod";
                        },

                        GetList: function () {
                            return $scope.FilterProductlist || [];
                        }
                    },

                    //======================
                    // Series
                    //======================
                    {
                        Header: "Series",
                        Type: "Normal",

                        GetField: function (eye) {
                            return "Basic" + eye + "Series";
                        },

                        GetInputId: function (eye) {
                            return eye + "Seri";
                        },

                        GetList: function () {
                            return $scope.BrandsMainarray || [];
                        }
                    },

                    //======================
                    // BC
                    //======================
                    {
                        Header: "BC",
                        Type: "Normal",

                        GetField: function (eye) {
                            return "Basic" + eye + "BC";
                        },

                        GetInputId: function (eye) {
                            return eye + "BC";
                        },

                        GetList: function () {
                            return $scope.BCList || [];
                        }
                    },

                    //======================
                    // Diameter
                    //======================
                    {
                        Header: "Diameter",
                        Type: "Normal",

                        GetField: function (eye) {
                            return "Basic" + eye + "Dia";
                        },

                        GetInputId: function (eye) {
                            return eye + "Dia";
                        },

                        GetList: function () {
                            return $scope.DiaList || [];
                        }
                    },

                    //======================
                    // Color
                    //======================
                    {
                        Header: "Color",
                        Type: "Normal",

                        GetField: function (eye) {
                            return "Basic" + eye + "Color";
                        },

                        GetInputId: function (eye) {
                            return eye + "Color";
                        },

                        GetList: function () {
                            return $scope.MainColorlist || [];
                        }
                    },

                    //======================
                    // Sphere
                    //======================
                    {
                        Header: "Sphere",
                        Type: "Power",

                        GetField: function (eye) {
                            return "Basic" + eye + "Sph";
                        },

                        GetInputId: function (eye) {
                            return eye + "Sph";
                        },

                        PlusList: function () {
                            return $scope.SphericalPlusList || [];
                        },

                        MinusList: function () {
                            return $scope.SphericalMinusList || [];
                        }
                    },

                    {
                        Header: "Cylinder",
                        Type: "Normal",

                        GetField: function (eye) {
                            return "Basic" + eye + "Cyl";
                        },

                        GetInputId: function (eye) {
                            return eye + "Cyl";
                        },
                        GetList: function () {
                            return $scope.CylMinusList || [];
                        },
                    },

                    //======================
                    // Axis
                    //======================
                    {
                        Header: "Axis",
                        Type: "Normal",

                        GetField: function (eye) {
                            return "Basic" + eye + "Axis";
                        },

                        GetInputId: function (eye) {
                            return eye + "Axis";
                        },

                        GetList: function () {
                            return $scope.AxisPlusList || [];
                        }
                    },

                    //======================
                    // Add
                    //======================
                    {
                        Header: "Add",
                        Type: "Normal",

                        GetField: function (eye) {
                            return "Basic" + eye + "Add";
                        },

                        GetInputId: function (eye) {
                            return eye + "Add";
                        },

                        GetList: function () {
                            return $scope.AddtionList || [];
                        }
                    },

                    //======================
                    // VA Distance
                    //======================
                    {
                        Header: "VA(D)",
                        Type: "Normal",

                        GetField: function (eye) {
                            return "Basic" + eye + "VaDistance";
                        },

                        GetInputId: function (eye) {
                            return eye + "Dist";
                        },

                        GetList: function () {
                            return $scope.DistanceList || [];
                        }
                    },

                    //======================
                    // VA Near
                    //======================
                    {
                        Header: "VA(N)",
                        Type: "Normal",

                        GetField: function (eye) {
                            return "Basic" + eye + "VaNear";
                        },

                        GetInputId: function (eye) {
                            return eye + "Near";
                        },

                        GetList: function () {
                            return $scope.NearList || [];
                        }
                    },

                    //======================
                    // VA Intermediate
                    //======================
                    {
                        Header: "VA(I)",
                        Type: "Normal",

                        GetField: function (eye) {
                            return "Basic" + eye + "VaIntermediate";
                        },

                        GetInputId: function (eye) {
                            return eye + "VAI";
                        },

                        GetList: function () {
                            return $scope.IntermediateList || [];
                        }
                    }




                ],

                AdvancedFit: [
                    {
                        Header: "Comfort",
                        Type: "Normal",

                        GetField: function (eye) {
                            return "AdvancedFit" + eye + "Comfort";
                        },

                        GetInputId: function (eye) {
                            return "A" + eye + "Comfort";
                        },

                        GetList: function () {
                            return $scope.CLComfortList || [];
                        }
                    },

                    //======================
                    // Centration
                    //======================
                    {
                        Header: "Centration",
                        Type: "Normal",

                        GetField: function (eye) {
                            return "AdvancedFit" + eye + "Centration";
                        },

                        GetInputId: function (eye) {
                            return "A" + eye + "Cent";
                        },

                        GetList: function () {
                            return $scope.CLCentrationList || [];
                        }
                    },

                    //======================
                    // Coverage
                    //======================
                    {
                        Header: "Coverage",
                        Type: "Normal",

                        GetField: function (eye) {
                            return "AdvancedFit" + eye + "Coverage";
                        },

                        GetInputId: function (eye) {
                            return "A" + eye + "Cover";
                        },

                        GetList: function () {
                            return $scope.CLCoverageList || [];
                        }
                    },

                    //======================
                    // Movement
                    //======================
                    {
                        Header: "Movement",
                        Type: "Normal",

                        GetField: function (eye) {
                            return "AdvancedFit" + eye + "Movement";
                        },

                        GetInputId: function (eye) {
                            return "A" + eye + "Move";
                        },

                        GetList: function () {
                            return $scope.MovementList || [];
                        }
                    },

                    //======================
                    // Degrees
                    //======================
                    {
                        Header: "Degrees",
                        Type: "Normal",

                        GetField: function (eye) {
                            return "AdvancedFit" + eye + "Degrees";
                        },

                        GetInputId: function (eye) {
                            return "A" + eye + "Degree";
                        },

                        GetList: function () {
                            return $scope.DegreesList || [];
                        }
                    },

                    //======================
                    // Direction
                    //======================
                    {
                        Header: "Direction",
                        Type: "Normal",

                        GetField: function (eye) {
                            return "AdvancedFit" + eye + "Direction";
                        },

                        GetInputId: function (eye) {
                            return "A" + eye + "Direct";
                        },

                        GetList: function () {
                            return $scope.CLDirectionList || [];
                        }
                    }
                ],

                AdvancedRefraction: [

                    {
                        Header: "Sphere",
                        Type: "Power",

                        GetField: function (eye) {
                            return "AdvancedRefraction" + eye + "Sph";
                        },

                        GetInputId: function (eye) {
                            return "A" + eye + "Sph";
                        },

                        PlusList: function () {
                            return $scope.AdvanceSphericalPlusList || [];
                        },

                        MinusList: function () {
                            return $scope.AdvanceSphericalMinusList || [];
                        }
                    },

                    //======================
                    // Cylinder
                    //======================
                    {
                        Header: "Cylinder",
                        Type: "Normal",

                        GetField: function (eye) {
                            return "AdvancedRefraction" + eye + "Cyl";
                        },

                        GetInputId: function (eye) {
                            return "A" + eye + "Cyl";
                        },
                        GetList: function () {
                            return $scope.CylMinusList || [];
                        },
                    },

                    //======================
                    // Axis
                    //======================
                    {
                        Header: "Axis",
                        Type: "Normal",

                        GetField: function (eye) {
                            return "AdvancedRefraction" + eye + "Axis";
                        },

                        GetInputId: function (eye) {
                            return "A" + eye + "Axis";
                        },

                        GetList: function () {
                            return $scope.AxisPlusList || [];
                        }
                    },

                    //======================
                    // Add
                    //======================
                    {
                        Header: "Add",
                        Type: "Normal",

                        GetField: function (eye) {
                            return "AdvancedRefraction" + eye + "Add";
                        },

                        GetInputId: function (eye) {
                            return "A" + eye + "Add";
                        },

                        GetList: function () {
                            return $scope.AdvanceAddtionList || [];
                        }
                    },

                    //======================
                    // VA Distance
                    //======================
                    {
                        Header: "VA(D)",
                        Type: "Normal",

                        GetField: function (eye) {
                            return "AdvancedRefraction" + eye + "VaDistance";
                        },

                        GetInputId: function (eye) {
                            return "A" + eye + "VAD";
                        },

                        GetList: function () {
                            return $scope.DistanceList || [];
                        }
                    },

                    //======================
                    // VA Near
                    //======================
                    {
                        Header: "VA(N)",
                        Type: "Normal",

                        GetField: function (eye) {
                            return "AdvancedRefraction" + eye + "VaNear";
                        },

                        GetInputId: function (eye) {
                            return "A" + eye + "VAN";
                        },

                        GetList: function () {
                            return $scope.NearList || [];
                        }
                    },

                    //======================
                    // VA Intermediate
                    //======================
                    {
                        Header: "VA(I)",
                        Type: "Normal",

                        GetField: function (eye) {
                            return "AdvancedRefraction" + eye + "VaIntermediate";
                        },

                        GetInputId: function (eye) {
                            return "A" + eye + "VAI";
                        },

                        GetList: function () {
                            return $scope.IntermediateList || [];
                        }
                    }

                ]

            },

            RGP: {

                Basic: [
                    {
                        Header: "Manufacturer",
                        Type: "Normal",

                        GetField: function (eye) {
                            return "Basic" + eye + "Product";
                        },

                        GetInputId: function (eye) {
                            return eye + "Prod";
                        },

                        GetList: function () {
                            return $scope.CLProductList || [];
                        }
                    },

                    //======================
                    // 2. BC
                    //======================
                    {
                        Header: "BC",
                        Type: "Normal",

                        GetField: function (eye) {
                            return "Basic" + eye + "BC";
                        },

                        GetInputId: function (eye) {
                            return eye + "BC";
                        },

                        GetList: function () {
                            return $scope.BCList || [];
                        }
                    },

                    //======================
                    // 3. Diameter
                    //======================
                    {
                        Header: "Diameter",
                        Type: "Normal",

                        GetField: function (eye) {
                            return "Basic" + eye + "Dia";
                        },

                        GetInputId: function (eye) {
                            return eye + "Dia";
                        },

                        GetList: function () {
                            return $scope.DiaList || [];
                        }
                    },

                    //======================
                    // 4. Color
                    //======================
                    {
                        Header: "Color",
                        Type: "Normal",

                        GetField: function (eye) {
                            return "Basic" + eye + "Color";
                        },

                        GetInputId: function (eye) {
                            return eye + "Color";
                        },

                        GetList: function () {
                            return $scope.CLColorList || [];
                        }
                    },

                    //======================
                    // 5. Design Type
                    //======================
                    {
                        Header: "Design Type",
                        Type: "Normal",

                        GetField: function (eye) {
                            return "Basic" + eye + "DesignType";
                        },

                        GetInputId: function (eye) {
                            return eye + "Design";
                        },

                        GetList: function () {
                            return $scope.CLDesignTypeList || [];
                        }
                    },

                    //======================
                    // 6. Sphere
                    //======================
                    {
                        Header: "Sphere",
                        Type: "Power",

                        GetField: function (eye) {
                            return "Basic" + eye + "Sph";
                        },

                        GetInputId: function (eye) {
                            return eye + "Sph";
                        },

                        PlusList: function () {
                            return $scope.SphericalPlusList || [];
                        },

                        MinusList: function () {
                            return $scope.SphericalMinusList || [];
                        }
                    },

                    //======================
                    // 7. Cylinder
                    //======================
                    {
                        Header: "Cylinder",
                        Type: "Normal",

                        GetField: function (eye) {
                            return "Basic" + eye + "Cyl";
                        },

                        GetInputId: function (eye) {
                            return eye + "Cyl";
                        },

                        GetList: function () {
                            return $scope.CylMinusList || [];
                        },
                    },

                    //======================
                    // 8. Axis
                    //======================
                    {
                        Header: "Axis",
                        Type: "Normal",

                        GetField: function (eye) {
                            return "Basic" + eye + "Axis";
                        },

                        GetInputId: function (eye) {
                            return eye + "Axis";
                        },

                        GetList: function () {
                            return $scope.AxisPlusList || [];
                        }
                    },

                    //======================
                    // 9. Add
                    //======================
                    {
                        Header: "Add",
                        Type: "Normal",

                        GetField: function (eye) {
                            return "Basic" + eye + "Add";
                        },

                        GetInputId: function (eye) {
                            return eye + "Add";
                        },

                        GetList: function () {
                            return $scope.AddtionList || [];
                        }
                    },

                    //======================
                    // 10. VA Distance
                    //======================
                    {
                        Header: "VA(D)",
                        Type: "Normal",

                        GetField: function (eye) {
                            return "Basic" + eye + "VaDistance";
                        },

                        GetInputId: function (eye) {
                            return eye + "Dist";
                        },

                        GetList: function () {
                            return $scope.DistanceList || [];
                        }
                    },

                    //======================
                    // 11. VA Near
                    //======================
                    {
                        Header: "VA(N)",
                        Type: "Normal",

                        GetField: function (eye) {
                            return "Basic" + eye + "VaNear";
                        },

                        GetInputId: function (eye) {
                            return eye + "Near";
                        },

                        GetList: function () {
                            return $scope.NearList || [];
                        }
                    },

                    //======================
                    // 12. VA Intermediate
                    //======================
                    {
                        Header: "VA(I)",
                        Type: "Normal",

                        GetField: function (eye) {
                            return "Basic" + eye + "VaIntermediate";
                        },

                        GetInputId: function (eye) {
                            return eye + "Inter";
                        },

                        GetList: function () {
                            return $scope.IntermediateList || [];
                        }
                    }

                ],
                AdvancedFit: [
                    {
                        Header: "Comfort",
                        Type: "Normal",

                        GetField: function (eye) {
                            return "AdvancedFit" + eye + "Comfort";
                        },

                        GetInputId: function (eye) {
                            return "A" + eye + "Comfort";
                        },

                        GetList: function () {
                            return $scope.CLComfortList || [];
                        }
                    },

                    //======================
                    // Centration
                    //======================
                    {
                        Header: "Centration",
                        Type: "Normal",

                        GetField: function (eye) {
                            return "AdvancedFit" + eye + "Centration";
                        },

                        GetInputId: function (eye) {
                            return "A" + eye + "Cent";
                        },

                        GetList: function () {
                            return $scope.CLCentrationList || [];
                        }
                    },

                    //======================
                    // Coverage
                    //======================
                    {
                        Header: "Coverage",
                        Type: "Normal",

                        GetField: function (eye) {
                            return "AdvancedFit" + eye + "Coverage";
                        },

                        GetInputId: function (eye) {
                            return "A" + eye + "Cover";
                        },

                        GetList: function () {
                            return $scope.CLCoverageList || [];
                        }
                    },

                    //======================
                    // Movement
                    //======================
                    {
                        Header: "Movement",
                        Type: "Normal",

                        GetField: function (eye) {
                            return "AdvancedFit" + eye + "Movement";
                        },

                        GetInputId: function (eye) {
                            return "A" + eye + "Move";
                        },

                        GetList: function () {
                            return $scope.MovementList || [];
                        }
                    },

                    //======================
                    // Degrees
                    //======================
                    {
                        Header: "Degrees",
                        Type: "Normal",

                        GetField: function (eye) {
                            return "AdvancedFit" + eye + "Degrees";
                        },

                        GetInputId: function (eye) {
                            return "A" + eye + "Degree";
                        },

                        GetList: function () {
                            return $scope.DegreesList || [];
                        }
                    },

                    //======================
                    // Direction
                    //======================
                    {
                        Header: "Direction",
                        Type: "Normal",

                        GetField: function (eye) {
                            return "AdvancedFit" + eye + "Direction";
                        },

                        GetInputId: function (eye) {
                            return "A" + eye + "Direct";
                        },

                        GetList: function () {
                            return $scope.CLDirectionList || [];
                        }
                    }

                ],
                AdvancedRefraction: [
                    {
                        Header: "Sphere",
                        Type: "Power",

                        GetField: function (eye) {
                            return "AdvancedRefraction" + eye + "Sph";
                        },

                        GetInputId: function (eye) {
                            return "A" + eye + "Sph";
                        },

                        PlusList: function () {
                            return $scope.AdvanceSphericalPlusList || [];
                        },

                        MinusList: function () {
                            return $scope.AdvanceSphericalMinusList || [];
                        }
                    },

                    //======================
                    // 2. Cylinder
                    //======================
                    {
                        Header: "Cylinder",
                        Type: "Normal",

                        GetField: function (eye) {
                            return "AdvancedRefraction" + eye + "Cyl";
                        },

                        GetInputId: function (eye) {
                            return "A" + eye + "Cyl";
                        },

                        GetList: function () {
                            return $scope.CylMinusList || [];
                        },

                        
                    },

                    //======================
                    // 3. Axis
                    //======================
                    {
                        Header: "Axis",
                        Type: "Normal",

                        GetField: function (eye) {
                            return "AdvancedRefraction" + eye + "Axis";
                        },

                        GetInputId: function (eye) {
                            return "A" + eye + "Axis";
                        },

                        GetList: function () {
                            return $scope.AxisPlusList || [];
                        }
                    },

                    //======================
                    // 4. VA Distance
                    //======================
                    {
                        Header: "VA(D)",
                        Type: "Normal",

                        GetField: function (eye) {
                            return "AdvancedRefraction" + eye + "VaDistance";
                        },

                        GetInputId: function (eye) {
                            return "A" + eye + "VAD";
                        },

                        GetList: function () {
                            return $scope.DistanceList || [];
                        }
                    },

                    //======================
                    // 5. VA Near
                    //======================
                    {
                        Header: "VA(N)",
                        Type: "Normal",

                        GetField: function (eye) {
                            return "AdvancedRefraction" + eye + "VaNear";
                        },

                        GetInputId: function (eye) {
                            return "A" + eye + "VAN";
                        },

                        GetList: function () {
                            return $scope.NearList || [];
                        }
                    },

                    //======================
                    // 6. VA Intermediate
                    //======================
                    {
                        Header: "VA(I)",
                        Type: "Normal",

                        GetField: function (eye) {
                            return "AdvancedRefraction" + eye + "VaIntermediate";
                        },

                        GetInputId: function (eye) {
                            return "A" + eye + "VAI";
                        },

                        GetList: function () {
                            return $scope.IntermediateList || [];
                        }
                    }
                ]

            }

        };

        $scope.LoadGridPage = function () {

            var pageIndex = $scope.GridObj.CurrentIndex - 1;

            // Map OU pages to actual configuration indexes
            if ($scope.GridObj.Eye == "OU") {

                if ($scope.GridObj.ConfigName == "Basic") {

                    // 1→10, 2→11, 3→12
                    pageIndex += 9;

                }
                else if ($scope.GridObj.ConfigName == "AdvancedRefraction") {
                    if ($scope.GridObj.LensType == "Soft") {
                        pageIndex += 4;   // Soft has Add
                    }
                    else {
                        pageIndex += 3;   // RGP without Add
                    }

                }
            }

            // Get configuration based on Lens Type
            var config = $scope.GridConfigurations
            [$scope.GridObj.LensType]
            [$scope.GridObj.ConfigName][pageIndex];

            if (!config)
                return;

            $scope.GridObj.Header = config.Header;
            $scope.GridObj.Field = config.GetField($scope.GridObj.Eye);
            $scope.GridObj.InputId = config.GetInputId($scope.GridObj.Eye);
            $scope.GridObj.Type = config.Type;
            $scope.GridObj.IsPlusMinus = (config.Type == "Power");

            // Select the appropriate object
            var obj = ($scope.GridObj.LensType == "RGP")
                ? $scope.RGPContactobj
                : $scope.Contactobj;

            if ($scope.GridObj.IsPlusMinus) {

                var currentValue = obj[$scope.GridObj.Field];

                if (currentValue !== undefined &&
                    currentValue !== null &&
                    currentValue !== "") {

                    var valueString =
                        currentValue.toString().trim();

                    if (valueString.charAt(0) === "-") {
                        $scope.GridObj.SelectedSign = "-";
                    }
                    else {
                        $scope.GridObj.SelectedSign = "+";
                    }
                }
                else {
                    $scope.GridObj.SelectedSign = "+";
                }

                $scope.GridObj.PlusList = angular.copy(config.PlusList());
                $scope.GridObj.MinusList = angular.copy(config.MinusList());

                angular.forEach($scope.GridObj.PlusList, function (item) {
                    item.selected = (item.Value == obj[$scope.GridObj.Field]);
                });

                angular.forEach($scope.GridObj.MinusList, function (item) {
                    item.selected = (item.Value == obj[$scope.GridObj.Field]);
                });

            }
            else {

                $scope.GridObj.List = angular.copy(config.GetList());

                angular.forEach($scope.GridObj.List, function (item) {
                    item.selected = (item.Value == obj[$scope.GridObj.Field]);
                });

            }

        };

        $scope.CloseGridPopupIfSectionChanged = function (callFrom, actionSection) {

            // If function is called from somewhere other than GridPopup,
            // don't do anything.
            if (callFrom !== "GridPopup")
                return;

            // If GridPopup is not open, don't do anything.
            if (!$scope.GridPopupInstance)
                return;

            var currentSection = ($scope.GridPopupSection || "").toLowerCase();
            var clickedSection = (actionSection || "").toLowerCase();

            // Same section -> KEEP POPUP OPEN
            if (currentSection === clickedSection) {
                return;
            }

            // Different section -> CLOSE POPUP
            $scope.GridPopupInstance.dismiss("cancel");
            $scope.GridPopupInstance = null;
        };

        $scope.OpenGridOrDropdown = function (lensType, configName, eye, pageNo, $event) {

            if ($scope.inputypeTab != 2)
                return;

            if ($event) {
                $event.preventDefault();
                $event.stopPropagation();
            }

            $scope.GridObj.LensType = lensType;       // Soft / RGP
            $scope.GridObj.ConfigName = configName;   // Basic / AdvancedFit / AdvancedRefraction
            $scope.GridObj.Eye = eye;

            $scope.GridObj.SummaryConfigName = configName;

            var configs = $scope.GridConfigurations[lensType][configName];

            if (eye == "OU") {

                if (configName == "Basic") {

                    $scope.GridObj.CurrentIndex = pageNo;
                    $scope.GridObj.TotalCount = 3;

                }
                else if (configName == "AdvancedRefraction") {

                    $scope.GridObj.CurrentIndex = pageNo;
                    $scope.GridObj.TotalCount = 3;

                }
                else {

                    $scope.GridObj.CurrentIndex = pageNo;
                    $scope.GridObj.TotalCount = configs.length;

                }

            }
            else {

                $scope.GridObj.CurrentIndex = pageNo;
                $scope.GridObj.TotalCount = configs.length;

            }

            $scope.LoadGridPage();

            var popupSection =
                (configName === "Basic")
                    ? "Basic"
                    : "advance";

            $scope.contactLenseDatagrid(popupSection);

        };

        $scope.NextPage = function () {

            if ($scope.GridObj.CurrentIndex >= $scope.GridObj.TotalCount)
                return;

            $scope.GridObj.CurrentIndex++;

            $scope.LoadGridPage();
        };

        $scope.PreviousPage = function () {

            if ($scope.GridObj.CurrentIndex <= 1)
                return;

            $scope.GridObj.CurrentIndex--;

            $scope.LoadGridPage();
        };

        $scope.ChangePowerSign = function (Sign) {

            if (!$scope.GridObj.IsPlusMinus)
                return;

            $scope.GridObj.SelectedSign = Sign;

            var obj =
                ($scope.GridObj.LensType === "RGP")
                    ? $scope.RGPContactobj
                    : $scope.Contactobj;

            var currentValue =
                obj[$scope.GridObj.Field];

            var List =
                (Sign == "+")
                    ? $scope.GridObj.PlusList
                    : $scope.GridObj.MinusList;

            angular.forEach(List, function (item) {

                item.selected =
                    (item.Value == currentValue);

            });

        };

        $scope.SelectGridItem = function (Item) {

            var List;

            if ($scope.GridObj.IsPlusMinus) {

                List = ($scope.GridObj.SelectedSign == "+")
                    ? $scope.GridObj.PlusList
                    : $scope.GridObj.MinusList;

            }
            else {

                List = $scope.GridObj.List;

            }

            angular.forEach(List, function (x) {
                x.selected = false;
            });

            Item.selected = true;

            // Get target object
            var obj = ($scope.GridObj.LensType === "RGP")
                ? $scope.RGPContactobj
                : $scope.Contactobj;

            // Set selected value
            obj[$scope.GridObj.Field] = Item.Value;
            // ===== Added Data =====
            $scope.GridAddedData = {
                Eye: $scope.GridObj.Eye,
                Header: $scope.GridObj.Header,
                Value: Item.Value
            };
            if ($scope.GridObj.CurrentIndex < $scope.GridObj.TotalCount) {
                $scope.NextPage();
            }

        };

        $scope.getInvestigationId = function () {
            return $scope.lenstab == 1 ? 2084 : 2078;
        };

        function normalizeToMDY(value) {
            if (!value) return null;

            if (value instanceof Date) {
                return value;
            }

            var formats = [
                "MM-DD-YYYY h:mm A",
                "MM-DD-YYYY hh:mm A",
                "MM-DD-YYYY HH:mm:ss",
                "MM-DD-YYYY HH:mm",
                "YYYY-MM-DD h:mm A",
                "YYYY-MM-DD HH:mm:ss",
                "YYYY-MM-DD HH:mm",
                "YYYY-MM-DDTHH:mm:ss",
                "MM-DD-YYYY",
                "YYYY-MM-DD"
            ];

            var m = moment(value, formats, true);

            // Fallback for browser-supported date strings
            if (!m.isValid()) {
                m = moment(value);
            }

            return m.isValid() ? m.toDate() : null;
        }

        function parseDateTime(value) {

            if (!value) return null;

            if (angular.isDate(value)) {
                return value;
            }

            var m = moment(value, [
                "MM-DD-YYYY h:mm A",
                "MM-DD-YYYY hh:mm A",
                "MM-DD-YYYY,hh:mm A",
                "YYYY-MM-DD HH:mm:ss",
                moment.ISO_8601
            ], true);

            return m.isValid() ? m.toDate() : value;
        }

        $scope.clGridEyeVal = function (section, field) {
            var g = $scope.GridObj;
            if (!g) return "";
            var obj = (g.LensType === "RGP") ? $scope.RGPContactobj : $scope.Contactobj;
            if (!obj) return "";
            var eye = g.Eye || 'OD';
            return obj[section + eye + field] || "";
        };

        $scope.ClearCurrentGridData = function () {

            if (!$scope.GridObj.ConfigName)
                return;

            var obj = ($scope.GridObj.LensType === "RGP")
                ? $scope.RGPContactobj
                : $scope.Contactobj;

            var configs = $scope.GridConfigurations[$scope.GridObj.LensType];

            // Basic
            angular.forEach(configs.Basic, function (config) {

                ["OD", "OS", "OU"].forEach(function (eye) {

                    if (config.GetField) {

                        var field = config.GetField(eye);

                        if (field && obj.hasOwnProperty(field))
                            obj[field] = "";

                    }

                });

            });

            // Advanced Fit
            if (configs.AdvancedFit) {

                angular.forEach(configs.AdvancedFit, function (config) {

                    ["OD", "OS"].forEach(function (eye) {

                        var field = config.GetField(eye);

                        if (field && obj.hasOwnProperty(field))
                            obj[field] = "";

                    });

                });

            }

            // Advanced Refraction
            if (configs.AdvancedRefraction) {

                angular.forEach(configs.AdvancedRefraction, function (config) {

                    ["OD", "OS", "OU"].forEach(function (eye) {

                        var field = config.GetField(eye);

                        if (field && obj.hasOwnProperty(field))
                            obj[field] = "";

                    });

                });

            }

            // Refresh current popup
            if ($scope.GridObj.ConfigName) {
                $scope.LoadGridPage();
            }

        };
        $scope.switchCLGridEye = function (eye) {
            var g = $scope.GridObj;
            g.Eye = eye;
            g.CurrentIndex = 1;

            var configs = $scope.GridConfigurations[g.LensType][g.ConfigName];

            if (eye === 'OU') {
                if (g.ConfigName === 'Basic') {
                    g.TotalCount = 3;
                } else if (g.ConfigName === 'AdvancedRefraction') {
                    g.TotalCount = 3;
                } else {
                    g.TotalCount = configs.length;
                }
            } else {
                g.TotalCount = configs.length;
            }

            $scope.LoadGridPage();
        };
        $scope.addNewFromCLGrid = function () {
            if ($scope.lenstab === 1) {
                $scope.AddNewContactobj($scope.Contactobj.TypeName);
            } else if ($scope.lenstab === 2) {
                $scope.AddNewRGPContactobj($scope.RGPContactobj.TypeId);
            }
            if ($scope.GridPopupInstance) {
                $scope.GridPopupInstance.dismiss('cancel');
                $scope.GridPopupInstance = null;
            }
        };

        var restorePromise = null;

        $scope.reopenList = function (evt) {

            // This logic is only for tablet
            if (!$scope.isTablet) {
                return;
            }

            if (!evt || !evt.target) {
                return;
            }

            var el = angular.element(evt.target);
            var ctrl = el.controller('ngModel');

            if (!ctrl) {
                return;
            }

            // Cancel previous restore
            if (restorePromise) {
                $timeout.cancel(restorePromise);
                restorePromise = null;
            }

            // Store current selected value
            el.data('originalValue', ctrl.$viewValue);

            // Clear view value only to open complete typeahead list
            ctrl.$setViewValue('');
            ctrl.$render();
        };


        $scope.restoreIfEmpty = function (evt) {

            // This logic is only for tablet
            if (!$scope.isTablet) {
                return;
            }

            if (!evt || !evt.target) {
                return;
            }

            var el = angular.element(evt.target);
            var ctrl = el.controller('ngModel');

            if (!ctrl) {
                return;
            }

            restorePromise = $timeout(function () {

                var originalValue = el.data('originalValue');

                if (!ctrl.$viewValue && originalValue) {
                    ctrl.$setViewValue(originalValue);
                    ctrl.$render();
                }

                el.removeData('originalValue');
                restorePromise = null;

            }, 250);
        };

        $scope.RefreshGridAfterAction = function () {

            // Grid popup is not open
            if (!$scope.GridPopupInstance)
                return;

            // Grid configuration is not available
            if (!$scope.GridObj || !$scope.GridObj.ConfigName)
                return;

            // Recalculate selected/highlighted value
            $scope.LoadGridPage();

            // Make sure Angular updates the UI immediately
            if (!$scope.$$phase) {
                $scope.$evalAsync();
            }
        };
        
    }]);

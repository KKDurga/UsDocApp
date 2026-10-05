"use strict";
eHnoteWebApp.controller("USNewPatientRegisterPopupCtrl", ["$scope", "$http", "$log", "$rootScope", "$compile", "$q", "$location", "$ocLazyLoad", "$uibModal", "$routeParams", "$filter", "$timeout", "eHnoteMainAppointmentService", "eHnoteLoginStatusService", "eHnoteDiagnosisDataServices", "datapersistanceFactory", "eHnoteMasterDataService", "eHnotePatientDataService", "eHnoteProcedureDataService", "alertify", "eHnoteCacheStorageService", "eHnoteAuditServices", "eHnoteDbStaticDataService", "eHnotePatientAddressDataServices", "eHnoteUserDataService", function ($scope, $http, $log, $rootScope, $compile, $q, $location, $ocLazyLoad, $uibModal, $routeParams, $filter, $timeout, eHnoteMainAppointmentService, eHnoteLoginStatusService, eHnoteDiagnosisDataServices, datapersistanceFactory, eHnoteMasterDataService, eHnotePatientDataService, eHnoteProcedureDataService, alertify, eHnoteCacheStorageService, eHnoteAuditServices, eHnoteDbStaticDataService, eHnotePatientAddressDataServices, eHnoteUserDataService) {
    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
    $scope.userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();

    $scope.UserId = eHnoteMasterDataService.getLoginId();
    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.ParenthospitalId = 0; $scope.HospitalId = 0;
    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
        $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID
    }

    var mObj = datapersistanceFactory.getItem("masterDataArrays");
    $scope.BloodGroupList = angular.copy(mObj.masterBloodGroupList);
    $scope.MartialStatusList = angular.copy(mObj.masterMartialStatusList);
    $scope.TitlesList = [];
   
    function GetPatientDetailsInfo() {
        var obj = {
            "UserId": $scope.UserId,
            "HospitalId": $scope.HospitalId,
            "PatientID": 0,
            "PatientProfilePicDetails": [],
            "PatientTagId": "",
            "PatientTagName": "",
            "PatientTagObj": "",
            "Title": "",
            "TitleId": 0,
            "FirstName": "",
            "MiddleName": "",
            "LastName": "",
            "DOB": "",
            "SocialSecurityNo": "",
            "Gender": "Male",
            "MaritalStatusID": null,
            "MaritalStatusName": "",
            "BloodGroupObj": {},
            "BloodGroupName": "",
            "BloodGroupId": 0,
            "MobileNumber": "",
            "DisplayMobileNumber": "",
            "DisplayAlternateNumber": "",
            "ContactInfo": {
                "PatientHomeCode": "",
                "PatientHomeNumber": "",
                "PatientOfficeCode": "",
                "PatientOfficeNumber": "",
                "EmailID": "",
                "HomeCountryCode":"+1",
                "HomeAreaCode":"",
                "HomeNumber":"",
                "OfficeCountryCode":"+1",
                "OfficeAreaCode":"",
                "OfficeNumber": "",
                "AuthorizationId": "",
                "IsPatientSmsInd": false,
                "IsPatientEmailInd": false
            },
            "CurrentAge": "",
            "S3URL": "",
            "LeadSourceInd": "N",
            "PatientDisplayID": "",
            "Age": "",
            "ageinYears": "",
            "ageinMonths": "",  
            "ageinDays": "",
            "SecondLastName": "",
            "PreviousName": "",
            "SecondLastNameInd": true,
            "IsNoChargePatient": false,
            "OccupationId": null,
            "OccupationDescription": "",
            "EmployerPhoneNo": "",
            "EmergencyContactName": "",
            "EmeregecyContactNo": "",
            "FatherName": "",
            "MotherName": "",
            "Guardian": "",
            "Employer": "",
        }
        if (doctorinfo.doctordata.UserAddress.length > 0) {
            obj.HomeCountryCode = doctorinfo.doctordata.UserAddress[0].CountryCode;
            obj.OfficeCountryCode = doctorinfo.doctordata.UserAddress[0].CountryCode;
        }
        return obj;
    }
    $scope.PatientDetailsInfo = GetPatientDetailsInfo();


    $scope.formatUSNumber = function (phoneNumberString) {
        phoneNumberString = phoneNumberString.substring(0, 10);
        $scope.USnumberString = phoneNumberString || "";
        if ($scope.USnumberString != "") {
            console.log($scope.USnumberString);
            const match = phoneNumberString
                .replace(/\D+/g, '')
                .match(/([^\d]*\d[^\d]*){1,10}$/)[0]
            const part1 = match.length > 3 ? `(${match.substring(0, 3)})` : match
            const part2 = match.length > 3 ? ` ${match.substring(3, 6)}` : ''
            const part3 = match.length > 6 ? `-${match.substring(6, 10)}` : ''
            //  return `${part1}${part2}${part3}`;
            $scope.PatientDetailsInfo.DisplayMobileNumber = part1 + part2 + part3;

            if ($scope.USnumberString.length > 9) {
                var Area = $scope.USnumberString.slice(0, 3);
                $scope.PatientDetailsInfo.ContactInfo.HomeAreaCode = Area;
                var contact = $scope.USnumberString.substring(3, ($scope.USnumberString.toString()).length);
                $scope.PatientDetailsInfo.ContactInfo.HomeNumber = contact;
            }
        } else {
            $scope.PatientDetailsInfo.DisplayMobileNumber = "";
            $scope.PatientDetailsInfo.ContactInfo.HomeAreaCode = "";
            $scope.PatientDetailsInfo.ContactInfo.HomeNumber = "";
        }
    }
    $scope.formatUSNumber1 = function (phoneNumberString) {
        $scope.USAlternatenumberString = phoneNumberString || "";
        if ($scope.USAlternatenumberString != "") {
            console.log($scope.USAlternatenumberString);
            const match = phoneNumberString
                .replace(/\D+/g, '')
                .match(/([^\d]*\d[^\d]*){1,10}$/)[0]
            const part1 = match.length > 3 ? `(${match.substring(0, 3)})` : match
            const part2 = match.length > 3 ? ` ${match.substring(3, 6)}` : ''
            const part3 = match.length > 6 ? `-${match.substring(6, 10)}` : ''
            //  return `${part1}${part2}${part3}`;
            $scope.PatientDetailsInfo.DisplayAlternateNumber = part1 + part2 + part3;

            if ($scope.USAlternatenumberString.length > 9) {
                var Area = $scope.USAlternatenumberString.slice(0, 3);
                $scope.PatientDetailsInfo.ContactInfo.OfficeAreaCode = Area;
                var contact = $scope.USAlternatenumberString.substring(3, ($scope.USAlternatenumberString.toString()).length);
                $scope.PatientDetailsInfo.ContactInfo.OfficeNumber = contact;
            } else if ($scope.USAlternatenumberString.length <= 9) {
                var Area = $scope.USAlternatenumberString.slice(0, 3);
                $scope.PatientDetailsInfo.ContactInfo.OfficeAreaCode = Area;
                var contact = $scope.USAlternatenumberString.substring(3, ($scope.USAlternatenumberString.toString()).length);
                $scope.PatientDetailsInfo.ContactInfo.OfficeNumber = contact;
            }
        } else {
            $scope.PatientDetailsInfo.DisplayAlternateNumber = "";
            $scope.PatientDetailsInfo.ContactInfo.OfficeAreaCode = "";
            $scope.PatientDetailsInfo.ContactInfo.OfficeNumber = "";
        }
    }

    $scope.AreaCodeFocus = false;
    $scope.home = function () {
        if ($scope.PatientDetailsInfo.ContactInfo.HomeAreaCode.toString().length === 3) {
            $scope.AreaCodeFocus = true;
        }
        else {
            $scope.AreaCodeFocus = false;
        }
    };

    $scope.OfficeNumberFocus = false;
    $scope.office = function () {
        if ($scope.PatientDetailsInfo.ContactInfo.OfficeAreaCode.toString().length === 3) {
            $scope.OfficeNumberFocus = true;
        }
        else {
            $scope.OfficeNumberFocus = false;
        }
    };
    $scope.AreaCodeArrayList = [
        { "Id": 1, "CodeName": "+1" },
        { "Id": 2, "CodeName": "+91" },
        { "Id": 3, "CodeName": "+315" },
        { "Id": 4, "CodeName": "+325" }
    ];
    $scope.PatientDetailsInfo.ContactInfo.PatientHomeCode = $scope.AreaCodeArrayList[0].CodeName;
    $scope.PatientDetailsInfo.ContactInfo.PatientOfficeCode = $scope.AreaCodeArrayList[0].CodeName;
    $scope.PatientDetailsInfo.ageinYears = "";
    $scope.PatientDetailsInfo.ageinMonths = "";
    $scope.PatientDetailsInfo.ageinDays = "";

    $scope.GetTitle = function () {
        eHnoteDbStaticDataService.GetAllTitlesByParentId($scope.ParenthospitalId).then(function (resp) {
            $scope.TitlesList = resp.data;
            //$scope.PatientDetailsInfo.TitleId = $scope.TitlesList[0].Id;
            //$scope.PatientDetailsInfo.Title = $scope.TitlesList[0].Name;
        }, function (err) {
            console.log(err);
            alertify.error("Getting Titles Failed");
        });
    };
    $scope.GetAllHospitalEquipments = function () {
        var obj = {
            "ParentOrganizationId": $scope.ParenthospitalId || 0
        }
        eHnotePatientAddressDataServices.GetAllHospitalEquipments(obj).then(function (resp) {
            if (resp.data.rows.length > 0) {
                angular.forEach(resp.data.rows, function (item) {
                    item.IsChecked = false;
                });
                $scope.HospitalEquipmentList = resp.data.rows;
            }
        });
    };

    $scope.GetTitle();
    $scope.GetAllHospitalEquipments();

    $scope.changeTagPatient = function (Tagobj) {
        if (Tagobj == null || Tagobj == "") {
            $scope.PatientDetailsInfo.PatientTagId = "";
        }
    }
    if (!isNaN($scope.PatientSearch.SearchText)) {
       // $scope.PatientDetailsInfo.ContactInfo.PatientHomeNumber = $scope.PatientSearch.SearchText;
        var HomeAreaCode = $scope.PatientSearch.SearchText.slice(0,3);
        var HomeNumber = $scope.PatientSearch.SearchText.slice(3);
        $scope.PatientDetailsInfo.ContactInfo.HomeAreaCode = HomeAreaCode ||'';
        $scope.PatientDetailsInfo.ContactInfo.HomeNumber = HomeNumber||'';
       // $scope.PatientDetailsInfo.ContactInfo.HomeNumber = $scope.PatientSearch.SearchText;
        if ($scope.patSearchType == 3) {
            var phoneNumberString = $scope.PatientDetailsInfo.ContactInfo.HomeAreaCode + $scope.PatientDetailsInfo.ContactInfo.HomeNumber;
            $scope.formatUSNumber(phoneNumberString);
        }
    } else {
        if ($scope.patSearchType == 1) {
            $scope.PatientDetailsInfo.FirstName = $scope.PatientSearch.SearchText;
        }
    }


    $scope.getDate = function (Tmpfromdate, patientObj, tempObj) {
        if (Tmpfromdate != "") {
            $scope.BSMSind1 = true;
            //$scope.BSMSind = true;
            $scope.PatientDetailsInfo.BSMSind = true;
        }
        var todate = new Date();
        var age = [];
        var fromdate = new Date(Tmpfromdate);
        var y = [todate.getFullYear(), fromdate.getFullYear()];
        var ydiff = y[0] - y[1];
        var m = [todate.getMonth(), fromdate.getMonth()];
        var mdiff = m[0] - m[1];
        var d = [todate.getDate(), fromdate.getDate()];
        var ddiff = d[0] - d[1];
        if (mdiff < 0 || (mdiff === 0 && ddiff < 0)) --ydiff;
        if (mdiff < 0) mdiff += 12;
        if (ddiff < 0) {
            fromdate.setMonth(m[1] + 1, 0);
            ddiff = fromdate.getDate() - d[1] + d[0];
            --mdiff;
        }
        if (ydiff > 0) age.push(ydiff + ' year' + (ydiff > 1 ? 's ' : ' '));
        if (mdiff > 0) age.push(mdiff + ' month' + (mdiff > 1 ? 's' : ''));
        if (ddiff > 0) age.push(ddiff + ' day' + (ddiff > 1 ? 's' : ''));
        if (age.length > 1) age.splice(age.length - 1, 0, ' and ');
        if (patientObj === "PatientDOB") {
            $scope.ageinYears = ydiff.toString();
            $scope.ageinMonths = mdiff.toString();
            $scope.ageinDays = ddiff.toString();
            if ($scope.ageinMonths === "-1") {
                $scope.ageinMonths = "";
            }
            var curAge = $scope.ageinYears + '.' + $scope.ageinMonths;
            $scope.PatientDetailsInfo.CurrentAge = curAge;
        }

        if (tempObj != undefined) {
            tempObj.ageinYears = ydiff.toString();
            tempObj.ageinMonths = mdiff.toString();
            tempObj.ageinDays = ddiff.toString();
            if (tempObj.ageinMonths === "-1") {
                tempObj.ageinMonths = "";
            }
            var curAge = tempObj.ageinYears + '.' + tempObj.ageinMonths;
            tempObj.CurrentAge = curAge;
            tempObj.Age = tempObj.ageinYears;
        }
    };

    $scope.PatientSave = function (type) {

        var FirstName = $scope.PatientDetailsInfo.FirstName;
        var LastName = $scope.PatientDetailsInfo.LastName;
        var MiddleName = $scope.PatientDetailsInfo.MiddleName || "";
        var SecondLastName = $scope.PatientDetailsInfo.SecondLastName || "";

        function isValidName(name) {
            const regex = /[a-zA-Z]/;
            return regex.test(name);
        }
        
        if ($scope.PatientDetailsInfo.FirstName === null || $scope.PatientDetailsInfo.FirstName === "" || $scope.PatientDetailsInfo.FirstName === undefined) {
            $scope.ValidateIndictor = true;
            alertify.error("Please Enter Patient First Name");
            return false;
        }
        if ($scope.PatientDetailsInfo.FirstName.length < 2) {
            $scope.ValidateIndictor = true;
            alertify.error("Please Enter First Name Minimum 2 letters");
            return false;
        }

        if (!isValidName(FirstName)) {
            alertify.error("Please enter at least one letter in the First Name");
            return false;
        }
        if ($scope.PatientDetailsInfo.MiddleName != "") {
            if (!isValidName(MiddleName)) {
                alertify.error("Please enter at least one letter in the Middle Name");
                return false;
            }
        }

        $scope.PatientDetailsInfo.LastName = $scope.PatientDetailsInfo.LastName || "";
        if ($scope.PatientDetailsInfo.LastName === "") {
            $scope.ValidateIndictor = true;
            alertify.error("Please Enter Patient Last Name");
            return false;
        }
        if (!isValidName(LastName)) {
            alertify.error("Please enter at least one letter in the Last Name.");
            return false;
        }

      
       

        if ($scope.IsSecondLastNameMandatory) {
            $scope.PatientDetailsInfo.SecondLastName = $scope.PatientDetailsInfo.SecondLastName || "";
            if ($scope.PatientDetailsInfo.SecondLastName === "") {
                $scope.ValidateIndictor = true;
                alertify.error("Please Enter Patient Second Last Name");
                return false;
            }
        }
        //if (!isValidName(SecondLastName)) {
        //    alertify.error("Please enter at least one letter in the Second Last Name.");
        //    return false;
        //}

        if ($scope.PatientDetailsInfo.DOB === null || $scope.PatientDetailsInfo.DOB === "" || $scope.PatientDetailsInfo.DOB === undefined) {
            $scope.ValidateIndictor = true;
            alertify.error("Please Enter Patient DOB");
            return false;
        }
        if ($scope.PatientDetailsInfo.ageinYears === null || $scope.PatientDetailsInfo.ageinYears === "" || $scope.PatientDetailsInfo.ageinYears === undefined) {
            $scope.ValidateIndictor = true;
            alertify.error("Please Select Patient Age");
            return false;
        }

        //var SSNno = angular.copy($scope.PatientDetailsInfo.SocialSecurityNo) || "";
        //SSNno = SSNno.toString();
        //if (SSNno != "" && SSNno.length !== "" && SSNno.length < 9) {
        //    $scope.ValidateIndictor = true;
        //    alertify.error("Please Enter Valid SSN Number");
        //    return false;
        //}

        if ($scope.PatientDetailsInfo.SocialSecurityNo === undefined) {
            $scope.ValidateIndictor = true;
            alertify.error("Please Enter Valid SSN Number");
            return false;
        } else if ($scope.PatientDetailsInfo.SocialSecurityNo.length > 9) {
            $scope.ValidateIndictor = true;
            alertify.error("Please Enter Valid SSN Number");
            return false;
        }    

        if ($scope.PatientDetailsInfo.Gender === null || $scope.PatientDetailsInfo.Gender === "" || $scope.PatientDetailsInfo.Gender === undefined) {
            $scope.ValidateIndictor = true;
            alertify.error("Please Enter Patient Gender");
            return false;
        }
       
        //if ($scope.PatientDetailsInfo.ContactInfo.PatientHomeNumber === null || $scope.PatientDetailsInfo.ContactInfo.PatientHomeNumber === "" || $scope.PatientDetailsInfo.ContactInfo.PatientHomeNumber === undefined) {
        //    $scope.ValidateIndictor = true;
        //    alertify.error("Please Enter Valid Mobile Number");
        //    return false;
        //}
        //var MobileNumber = angular.copy($scope.PatientDetailsInfo.ContactInfo.PatientHomeNumber) || "";
        //MobileNumber = MobileNumber.toString();
        //if (MobileNumber.length !== 10) {
        //    $scope.ValidateIndictor = true;
        //    alertify.error("Please Enter Valid Mobile Number");
        //    return false;
        //}
        //var ContactNumber = angular.copy($scope.PatientDetailsInfo.ContactInfo.PatientOfficeNumber);
        //ContactNumber = ContactNumber.toString();
        //if (ContactNumber.length !== 0 && ContactNumber.length < 10) {
        //    $scope.ValidateIndictor = true;
        //    alertify.error("Please Enter Valid Mobile Number");
        //    return false;
        //}


        //$scope.PatientDetailsInfo.ContactInfo.HomeAreaCode = $scope.PatientDetailsInfo.ContactInfo.HomeAreaCode || '';
        //if ($scope.PatientDetailsInfo.ContactInfo.HomeAreaCode == '' || ($scope.PatientDetailsInfo.ContactInfo.HomeAreaCode.toString()).length < 2) {
        //    $scope.ValidateIndictor = true;
        //    alertify.error("Please Enter Valid Mobile Number");
        //    return false;
        //}
        //var HomeAreaCode = angular.copy($scope.PatientDetailsInfo.ContactInfo.HomeAreaCode) || "";
        //if ((HomeAreaCode.toString()).length < 3) {
        //    $scope.ValidateIndictor = true;
        //    alertify.error("Please Enter Valid Mobile Number");
        //    return false;
        //}

        //var MobileNumber = angular.copy($scope.PatientDetailsInfo.ContactInfo.HomeNumber) || "";
        //if ((MobileNumber.toString()).length != 7) {
        //    $scope.ValidateIndictor = true;
        //    alertify.error("Please Enter Valid Mobile Number");
        //    return false;
        //}
        var DisplayContactnumber = angular.copy($scope.PatientDetailsInfo.DisplayMobileNumber) || "";
        if ((DisplayContactnumber.toString()).length < 0 || DisplayContactnumber == "") {
            $scope.ValidateIndictor = true;
            alertify.error("Please Enter Your Mobile Number");
            return false;
        }

        var DisplayContactnumber = angular.copy($scope.PatientDetailsInfo.DisplayMobileNumber) || "";
        if ($scope.PatientDetailsInfo.DisplayMobileNumber != '' || $scope.PatientDetailsInfo.DisplayMobileNumber != '') {
            if ((DisplayContactnumber.toString()).length < 14) {
                alertify.error("Please Enter Valid Mobile Number");
                return false;
            }
        }

        $scope.PatientDetailsInfo.ContactInfo.OfficeAreaCode = $scope.PatientDetailsInfo.ContactInfo.OfficeAreaCode || '';
        if ($scope.PatientDetailsInfo.ContactInfo.OfficeAreaCode != '' || $scope.PatientDetailsInfo.ContactInfo.OfficeNumber != '') {
            if (($scope.PatientDetailsInfo.ContactInfo.OfficeAreaCode.toString()).length < 2) {
                $scope.ValidateIndictor = true;
                alertify.error("Please Enter Valid Alternate Number");
                return false;
            }
        }
        var Contactnumber = angular.copy($scope.PatientDetailsInfo.ContactInfo.OfficeNumber) || "";
        if ($scope.PatientDetailsInfo.ContactInfo.OfficeAreaCode != '' || $scope.PatientDetailsInfo.ContactInfo.OfficeNumber != '') {
            if ((Contactnumber.toString()).length < 7) {
                $scope.ValidateIndictor = true;
                alertify.error("Please Enter Valid Alternate Number");
                return false;
            }
        }
        $scope.PatientDetailsInfo.EmployerPhoneNo = $scope.PatientDetailsInfo.EmployerPhoneNo || "";
        if ($scope.PatientDetailsInfo.EmployerPhoneNo != '') {
            if ($scope.PatientDetailsInfo.EmployerPhoneNo.length < 14) {
                $scope.ValidateIndictor = true;
                alertify.error("Please Enter Valid Office Mobile Number");
                return false;
            }
        }
        $scope.PatientDetailsInfo.EmeregecyContactNo = $scope.PatientDetailsInfo.EmeregecyContactNo || "";
        if ($scope.PatientDetailsInfo.EmeregecyContactNo != '') {
            if ($scope.PatientDetailsInfo.EmeregecyContactNo.length < 14) {
                $scope.ValidateIndictor = true;
                alertify.error("Please Enter Valid Emergency Mobile Number");
                return false;
            }
        }


        //PatientDetailsInfo.SocialSecurityNo
       
        //EmailID
        if ($scope.PatientDetailsInfo.ContactInfo.EmailID == undefined) {
            $scope.ValidateIndictor = true;
            alertify.error("Please Enter Valid Email ID");
            return false;
        }
        $scope.PatientDetailsInfo.PatientTagId = $scope.PatientDetailsInfo.PatientTagId || "";

        $scope.PatientTagList = [];
        let selectedpatientTagsList = $filter('filter')($scope.HospitalEquipmentList, { 'IsChecked': true }, true);
        $scope.PatientTagList = angular.copy(selectedpatientTagsList);

        $scope.Finalsubmit = type || "";
        var param = {
            "UserId": $scope.PatientDetailsInfo.UserId,
            "HospitalId": $scope.PatientDetailsInfo.HospitalId,
            "PatientId": $scope.PatientDetailsInfo.PatientID || 0,
            "TitleId": $scope.PatientDetailsInfo.TitleId,
            "FirstName": $scope.PatientDetailsInfo.FirstName,
            "MiddleName": $scope.PatientDetailsInfo.MiddleName,
            "LastName": $scope.PatientDetailsInfo.LastName,
            "SecondLastName": $scope.PatientDetailsInfo.SecondLastName,
            "PreviousName": $scope.PatientDetailsInfo.PreviousName,
            "DOB": $filter("date")(new Date($scope.PatientDetailsInfo.DOB), "yyyy-MM-dd") || "",
            "Age": $scope.PatientDetailsInfo.ageinYears,
            "SSN": $scope.PatientDetailsInfo.SocialSecurityNo,
            "Gender": $scope.PatientDetailsInfo.Gender,
            "PatientTagId": $scope.PatientDetailsInfo.PatientTagId == "" ? null : $scope.PatientDetailsInfo.PatientTagId,
            "MaritalStatusId": $scope.PatientDetailsInfo.MaritalStatusID,
            "BloodGroupId": $scope.PatientDetailsInfo.BloodGroupId !== 0 ? $scope.PatientDetailsInfo.BloodGroupId : null,
            "CountryCode": $scope.PatientDetailsInfo.ContactInfo.PatientHomeCode,
            "MobileNumber": $scope.PatientDetailsInfo.ContactInfo.PatientHomeNumber,
            "AreaCode": $scope.PatientDetailsInfo.ContactInfo.PatientOfficeCode,
            "ContactNumber": $scope.PatientDetailsInfo.ContactInfo.PatientOfficeNumber,
            "LeadSourceInd": "N",
            "PatientS3Url": $scope.PatientDetailsInfo.S3URL != "" ? $scope.PatientDetailsInfo.S3URL : "",
            "EmailID": $scope.PatientDetailsInfo.ContactInfo.EmailID,
            "FullName": $scope.PatientDetailsInfo.FirstName + $scope.PatientDetailsInfo.LastName || "",
            "DeviceEntityTypeId": 2,

            "HomeCountryCode": $scope.PatientDetailsInfo.ContactInfo.HomeCountryCode || "",
            "HomeAreaCode": $scope.PatientDetailsInfo.ContactInfo.HomeAreaCode || "",
            "HomeNumber": $scope.PatientDetailsInfo.ContactInfo.HomeNumber || "",
            "OfficeCountryCode": $scope.PatientDetailsInfo.ContactInfo.OfficeCountryCode || "",
            "OfficeAreaCode": $scope.PatientDetailsInfo.ContactInfo.OfficeAreaCode ||"",
            "OfficeNumber": $scope.PatientDetailsInfo.ContactInfo.OfficeNumber || "",
            "MobileNo": "",
            "ContactNo": "",
            "IsPatientSmsInd": $scope.PatientDetailsInfo.ContactInfo.IsPatientSmsInd,
            "IsPatientEmailInd": $scope.PatientDetailsInfo.ContactInfo.IsPatientEmailInd,
            "IsAllowAiAutomatedCalls": $scope.PatientDetailsInfo.IsAllowAiAutomatedCalls || false,
            "IsNoChargePatient": $scope.PatientDetailsInfo.IsNoChargePatient,
            "OccupationId": $scope.PatientDetailsInfo.OccupationId || null,
            "OccupationDescription": $scope.PatientDetailsInfo.OccupationDescription,
            "EmployerPhoneNo": $scope.PatientDetailsInfo.EmployerPhoneNo,
            "EmergencyContactName": $scope.PatientDetailsInfo.EmergencyContactName,
            "EmeregecyContactNo": $scope.PatientDetailsInfo.EmeregecyContactNo,
            "FatherName": $scope.PatientDetailsInfo.FatherName ||'',
            "MotherName": $scope.PatientDetailsInfo.MotherName || '',
            "Guardian": $scope.PatientDetailsInfo.Guardian || '',
            "Employer": $scope.PatientDetailsInfo.Employer || '',
            "PatientTagList": $scope.PatientTagList,
            "BirthSex": $scope.PatientDetailsInfo.BirthSex
        };
        param.MobileNo = param.MobileNo.concat(param.HomeCountryCode, param.HomeAreaCode, param.HomeNumber) || "";
        param.ContactNo = param.ContactNo.concat(param.OfficeCountryCode, param.OfficeAreaCode, param.OfficeNumber) || "";

       var picdetails = {
            "patientProfilePicDetails": ""
        };
        if ($scope.PatientDetailsInfo.PatientProfilePicDetails != undefined && $scope.PatientDetailsInfo.PatientProfilePicDetails.length > 0) {
            picdetails.patientProfilePicDetails = $scope.PatientDetailsInfo.PatientProfilePicDetails;
        }
       // return false;
        eHnotePatientDataService.USRegisterPatient(param, picdetails, OnAddPatientSuccess, OnAddPatientError);
        function OnAddPatientSuccess(respo) {
            console.log(respo);
            if (respo.status === "success") {
                $scope.PatientDetailsInfo.PatientID = respo.PatientId;
                $scope.getPatientCaseHistoryItem($scope.PatientDetailsInfo);
            } else {
                alertify.error(respo.Message);
            }
        }
        function OnAddPatientError(error) {
            console.log(error);
        }
    };

    $scope.changeTitle = function (Titleid) {
        if (Titleid != null) {
            var filtertitle = $filter("filter")($scope.TitlesList, { "Id": Titleid }, true) || [];
            if (filtertitle.length > 0) {
                $scope.PatientDetailsInfo.Title = filtertitle[0].Name;
                $scope.PatientDetailsInfo.TitleId = filtertitle[0].Id;
            }

            if ($scope.PatientDetailsInfo.Title === "Mr" || $scope.PatientDetailsInfo.Title === "Master" || $scope.PatientDetailsInfo.Title === "Baby Of" || $scope.PatientDetailsInfo.Title === "Dr" || $scope.PatientDetailsInfo.Title === "SMT.") {
                $scope.PatientDetailsInfo.Gender = 'Male';
            }
            else if ($scope.PatientDetailsInfo.Title === "Mrs" || $scope.PatientDetailsInfo.Title === "Miss" || $scope.PatientDetailsInfo.Title === 'Ms' || $scope.PatientDetailsInfo.Title === "Baby") {
                $scope.PatientDetailsInfo.Gender = 'Female';
            }
            else {
                $scope.PatientDetailsInfo.Gender = "";
            }
        }
    }
    $scope.selectPrintImgLogo1 = function (file) {
        $scope.PatientDetailsInfo.PatientProfilePicDetails = [];

        $scope.isLogoDefault = false;
        $scope.isLogoThumbnailDefault = true;
        $scope.isLogoS3URLDefault = false;
        $scope.IsModifedLogo = true;

        $scope.PatientDetailsInfo.S3URL = '';
        $scope.file = "";

        $scope.file = file;
        if ($scope.file != null) {
            var pName = $scope.file.name, name = "";
            var type = $scope.file.type.split("/")[1];
            if (pName.length > 9) {
                name = pName.substring(0, 9) + "..." + "." + type;
            } else {
                name = angular.copy(pName) + '.' + type;
            }


            var obj = {
                "file": $scope.file,
                "DocumentTypeId": "",
                "DeleteInd": false,
                "DocumentId": 0,
                "DocumentExt": $scope.file.type,
                "DisplayName": name
            };

            if ($scope.file.type != 'application/pdf') {
                $scope.PatientDetailsInfo.PatientProfilePicDetails.push(obj);
            }

            angular.element("input[type='file']").val(null);
        }
    };

    $scope.removeImage = function (item) {
        alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure want to delete? </h4>", function () {
            $scope.IsModifedLogo = false;
            $scope.PatientDetailsInfo.S3URL = '';
            $scope.PatientDetailsInfo.PatientProfilePicDetails = [];
            $scope.file = "";

        }, function () {
            return;
        });
    }


    $scope.getDate = function (Tmpfromdate, patientObj, tempObj) {
        if (Tmpfromdate != "") {
            $scope.BSMSind1 = true;
            //$scope.BSMSind = true;
            $scope.PatientDetailsInfo.BSMSind = true;
        }
        var todate = new Date();
        var age = [];
        var fromdate = new Date(Tmpfromdate);
        var y = [todate.getFullYear(), fromdate.getFullYear()];
        var ydiff = y[0] - y[1];
        var m = [todate.getMonth(), fromdate.getMonth()];
        var mdiff = m[0] - m[1];
        var d = [todate.getDate(), fromdate.getDate()];
        var ddiff = d[0] - d[1];
        if (mdiff < 0 || (mdiff === 0 && ddiff < 0)) --ydiff;
        if (mdiff < 0) mdiff += 12;
        if (ddiff < 0) {
            fromdate.setMonth(m[1] + 1, 0);
            ddiff = fromdate.getDate() - d[1] + d[0];
            --mdiff;
        }
        if (ydiff > 0) age.push(ydiff + ' year' + (ydiff > 1 ? 's ' : ' '));
        if (mdiff > 0) age.push(mdiff + ' month' + (mdiff > 1 ? 's' : ''));
        if (ddiff > 0) age.push(ddiff + ' day' + (ddiff > 1 ? 's' : ''));
        if (age.length > 1) age.splice(age.length - 1, 0, ' and ');
        if (patientObj === "PatientDOB") {
            $scope.PatientDetailsInfo.ageinYears = ydiff.toString();
            $scope.PatientDetailsInfo.ageinMonths = mdiff.toString();
            $scope.PatientDetailsInfo.ageinDays = ddiff.toString();
            if ($scope.PatientDetailsInfo.ageinMonths === "-1") {
                $scope.PatientDetailsInfo.ageinMonths = "";
            }
            var curAge = $scope.PatientDetailsInfo.ageinYears + '.' + $scope.PatientDetailsInfo.ageinMonths;
            $scope.PatientDetailsInfo.CurrentAge = curAge;
        }

        if (tempObj != undefined) {
            tempObj.ageinYears = ydiff.toString();
            tempObj.ageinMonths = mdiff.toString();
            tempObj.ageinDays = ddiff.toString();
            if (tempObj.ageinMonths === "-1") {
                tempObj.ageinMonths = "";
            }
            var curAge = tempObj.ageinYears + '.' + tempObj.ageinMonths;
            tempObj.CurrentAge = curAge;
            tempObj.Age = tempObj.ageinYears;
        }
    };

    $scope.getDateOfBirth = function (year, month, day) {
        year = parseInt(year) || 0;
        month = parseInt(month) || 0;
        day = parseInt(day) || 0;
        var today = new Date();
        var todayYear = today.getFullYear();
        var todaymonth = today.getMonth() + 1;
        var dateNow = today.getDate();
        var dobyear = todayYear - year;
        if (todaymonth > month) {
            var dobmonth = todaymonth - month;
        }
        if (todaymonth <= month) {
            dobyear = dobyear - 1;
            dobmonth = todaymonth - month;
            dobmonth = 12 + dobmonth;
        }

        if (dateNow > day)
            var dateAge = dateNow - day;
        else {
            dobmonth--;
            dateAge = 30 + dateNow - day;

            if (dobmonth < 0) {
                dobmonth = 11;
                dobyear--;
            }
        }
        dobmonth = dobmonth < 10 ? "0" + dobmonth : dobmonth;
        dateAge = dateAge < 10 ? "0" + dateAge : dateAge;
        if (dateAge === "00") {
            dateAge = "01";
        }
        return dobmonth + "/" + dateAge + "/" + dobyear;
    };
    function daysInMonth(month, year) {
        var today = new Date();
        var todayYear = today.getFullYear();
        var todaymonth = today.getMonth() + 1;
        var dobyear = todayYear - year;
        if (todaymonth > month) {
            var dobmonth = todaymonth - month;
        }
        if (todaymonth <= month) {
            dobyear = dobyear - 1;
            dobmonth = todaymonth - month;
            dobmonth = 12 + dobmonth;
        }
        var d = new Date(dobyear, dobmonth, 0).getDate();
        getdateslist(d);
        return d;
    }
    $scope.GetDaysArray = eHnoteDbStaticDataService.GetMonthsin31daysArray();
    function getdateslist(d) {
        if (d === 31) {
            $scope.GetDaysArray = eHnoteDbStaticDataService.GetMonthsin31daysArray();
        }
        else if (d === 30) {
            $scope.GetDaysArray = eHnoteDbStaticDataService.GetMonthsin30daysArray();
        }
        else if (d === 28) {
            $scope.GetDaysArray = eHnoteDbStaticDataService.GetMonthsin30daysArray();
        }
        else if (d === 29) {
            $scope.GetDaysArray = eHnoteDbStaticDataService.GetMonthsin29daysArray();
        }
        else {
            $scope.GetDaysArray = eHnoteDbStaticDataService.GetMonthsin31daysArray();
        }
    };
    $scope.setAgeandMonth = function (year, month, days) {
        $scope.PatientDetailsInfo.ageinYears = year;
        $scope.PatientDetailsInfo.ageinMonths = month || "";
        $scope.PatientDetailsInfo.ageinDays = days || "";
        if ($scope.ageinYears != "") {
            $scope.PatientDetailsInfo.BSMSind = false;
        }
        var curAge = $scope.PatientDetailsInfo.ageinYears + '.' + $scope.PatientDetailsInfo.ageinMonths;
        $scope.PatientDetailsInfo.CurrentAge = curAge;
        var dob = $scope.getDateOfBirth($scope.PatientDetailsInfo.ageinYears, $scope.PatientDetailsInfo.ageinMonths, $scope.PatientDetailsInfo.ageinDays);
        $scope.PatientDetailsInfo.DOB = moment(dob).format('MM-DD-YYYY');
        daysInMonth(month, year);
        if ($scope.PatientDetailsInfo.ageinYears === "" && $scope.PatientDetailsInfo.ageinMonths === "" && $scope.PatientDetailsInfo.ageinDays === "") {
            $scope.PatientDetailsInfo.DOB = "";
        }
        $scope.PatientDetailsInfo.ageinYears = $scope.PatientDetailsInfo.ageinYears || "";
        if ($scope.PatientDetailsInfo.ageinYears !== "") {
            $scope.PatientDetailsInfo.DOB = moment(dob).format('MM-DD-YYYY');
        }
        else {
            $scope.PatientDetailsInfo.DOB = "";
        }
    };

    $scope.newcaptureimage = function () {

        $scope.modelIntance = $uibModal.open({
            "size": 'md',
            "templateUrl": 'loadNewpopup.html',
            "scope": $scope,
            "backdrop": "static",
            "keyboard": false
        });
    };
    $scope.save = function () {
        var abc = document.getElementById('printresult');

        $scope.splitStrings1 = abc.innerHTML;


        function dataURLtoFile(dataurl, filename) {
            var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]),
                n = bstr.length,
                u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, { type: mime });
        }

        $scope.file = dataURLtoFile($scope.splitStrings1, 'Profile');
        $scope.selectPrintImgLogo1($scope.file);

        $scope.modelIntance.dismiss('cancel');

    };
    $scope.cancelCapturePopup = function () {
        $scope.PatientDetailsInfo.S3URL = '';
        $scope.PatientDetailsInfo.PatientProfilePicDetails = [];
        $scope.modelIntance.dismiss('cancel');

    }

    $scope.AllCountryCodeList = [];
    $scope.countries = eHnotePatientAddressDataServices.getCountries(getcountriesSuccess, getcountriesFailed);
    function getcountriesSuccess(data) {
        $scope.Allcountries = data;

        $scope.AllCountryCodeList = [];
        angular.forEach($scope.Allcountries, function (citem) {
            citem.InternationalDialing = citem.InternationalDialing || "";
            if (citem.InternationalDialing != '') {
                $scope.AllCountryCodeList.push(citem);
            }
        });
        $scope.AllCountryCodeList = _.uniq($scope.AllCountryCodeList, false, function (p) { return p.InternationalDialing; });
    }
    function getcountriesFailed(data) {
    }


    $scope.Patientauthorized = [
        { "Id": 1, "Name": "SMS" },
        { "Id": 2, "Name": "Email" },
        { "Id": 3, "Name": "SMS & Email" },
        { "Id": 4, "Name": "Not Authorized " }
    ];
    $scope.changePatientAuthorization = function (AuthorizationId) {
        if (AuthorizationId === null) {
            $scope.PatientDetailsInfo.ContactInfo.AuthorizationId = "";
            return false;
        }

        $scope.PatientDetailsInfo.ContactInfo.AuthorizationId = AuthorizationId || "";
        if ($scope.PatientDetailsInfo.ContactInfo.AuthorizationId == 1) {
            $scope.PatientDetailsInfo.ContactInfo.IsPatientSmsInd = true;
            $scope.PatientDetailsInfo.ContactInfo.IsPatientEmailInd = false;
        }
        else if ($scope.PatientDetailsInfo.ContactInfo.AuthorizationId == 2) {
            $scope.PatientDetailsInfo.ContactInfo.IsPatientSmsInd = false;
            $scope.PatientDetailsInfo.ContactInfo.IsPatientEmailInd = true;
        }
        else if ($scope.PatientDetailsInfo.ContactInfo.AuthorizationId == 3) {
            $scope.PatientDetailsInfo.ContactInfo.IsPatientSmsInd = true;
            $scope.PatientDetailsInfo.ContactInfo.IsPatientEmailInd = true;
        }
        else if ($scope.PatientDetailsInfo.ContactInfo.AuthorizationId == 4) {
            $scope.PatientDetailsInfo.ContactInfo.IsPatientSmsInd = false;
            $scope.PatientDetailsInfo.ContactInfo.IsPatientEmailInd = false;
        }

    };

    //$scope.ChangeTitleBasedGender = function (Gender) {
    //    if (Gender === "Female") {
    //        $scope.PatientDetailsInfo.TitleId = 3;
    //    } else {
    //        $scope.PatientDetailsInfo.TitleId = 1;
    //    }
    //};

    $scope.ChangeSecondLastNameInd = function (SecondLastNameInd) {
        SecondLastNameInd = !SecondLastNameInd;
    };

    $scope.ChangeNoChargePatient = function (NoChargePatient) {
        NoChargePatient = !NoChargePatient;
    };

    var mObj = datapersistanceFactory.getItem("masterDataArrays");

    $scope.OccupationsList = angular.copy(mObj.masterOccupationsList);

    $scope.ChangeOccupation = function (id) {
        if (id === null) {
            $scope.PatientDetailsInfo.OccupationDescription = "";
        } else {
            $scope.PatientDetailsInfo.OccupationDescription = id;
        }
        // $scope.PatientDesignatedInfo.OccupationDescription = item.occupation;
    };

    $scope.changePhNumber = function (item) {
        item = item.toString()
        var obj = eHnoteUserDataService.UsMobileFormatChange(item);
        $scope.PatientDetailsInfo.EmployerPhoneNo = obj.UsFormatMobileNumber;
    };

    $scope.changeEmeregecyContact = function (item) {
        item = item.toString()
        var obj = eHnoteUserDataService.UsMobileFormatChange(item);
        $scope.PatientDetailsInfo.EmeregecyContactNo = obj.UsFormatMobileNumber;
    };

    $scope.ONchangeocupation = function (item) {
        $scope.PatientDetailsInfo.OccupationId = item.OccupationId;
        $scope.PatientDetailsInfo.OccupationDescription = item.occupation;

    }
    $scope.OrganizationSettingsData = datapersistanceFactory.getItem("OrganizationSettingsData");
    $scope.IsSecondLastNameMandatory = false;
    if ($scope.OrganizationSettingsData.PatientRegistration.IsSecondLastNameMandatory === 1) {
        $scope.IsSecondLastNameMandatory = true;
    }
    else {
        $scope.IsSecondLastNameMandatory = false;
    }

    $scope.IsPreviousNameMandatory = false;
    if ($scope.OrganizationSettingsData.PatientRegistration.IsPreviousNameMandatory === 1) {
        $scope.IsPreviousNameMandatory = true;
    }
    else {
        $scope.IsPreviousNameMandatory = false;
    }
    $scope.stopClosingDropDown = function (event) {
        event.stopPropagation();
    };

    $scope.TagPatientObj = {
        "SelectTag": "Select Tag Patient",
        "PatientTag": "",
        "AllPatientTagsCheck": false,
    };

    $scope.checkAllPatientTags = function (val) {
        if (val) {
            angular.forEach($scope.HospitalEquipmentList, function (item) {
                item.IsChecked = true;
            });

            $scope.TagPatientObj.SelectTag = 'All';
        }
        else {
            angular.forEach($scope.HospitalEquipmentList, function (item) {
                item.IsChecked = false;
            });

            $scope.TagPatientObj.SelectTag = 'Select Tag Patient';
        }

    };

    $scope.PatientTagToggle = function (item) {
        var checkedArray = _.where($scope.HospitalEquipmentList, { IsChecked: true });
        $scope.TagPatientObj.AllPatientTagsCheck = checkedArray.length > 0 && $scope.HospitalEquipmentList.length === checkedArray.length ? true : false;
        if ($scope.TagPatientObj.AllPatientTagsCheck) {
            $scope.TagPatientObj.SelectTag = 'All';
        }

        if (!$scope.TagPatientObj.AllPatientTagsCheck && checkedArray.length > 0) {
            $scope.TagPatientObj.SelectTag = 'Selected';
        }
        if (checkedArray.length > 4) {
            item.IsChecked = false;
            alertify.error("Patient Tag Limit is Reached");
            return false;
        }
    };

    $scope.SpecialCharactersAlert = function (Type, firstName) {
        var specialcharaters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.`~<>\/?]/;
        if (specialcharaters.test(firstName)) {
            if (Type == 1) {
                $scope.PatientDetailsInfo.FirstName = $scope.PatientDetailsInfo.FirstName.replace(/[^\w\s]/gi, '');
                $scope.PatientDetailsInfo.FirstName = $scope.PatientDetailsInfo.FirstName.replace(/_/g, '');
            }
            else if (Type == 2) {
                $scope.PatientDetailsInfo.MiddleName = $scope.PatientDetailsInfo.MiddleName.replace(/[^\w\s]/gi, '');
                $scope.PatientDetailsInfo.MiddleName = $scope.PatientDetailsInfo.MiddleName.replace(/_/g, '');
            }
            else if (Type == 3) {
                $scope.PatientDetailsInfo.LastName = $scope.PatientDetailsInfo.LastName.replace(/[^\w\s]/gi, '');
                $scope.PatientDetailsInfo.LastName = $scope.PatientDetailsInfo.LastName.replace(/_/g, '');
            }
            else {
                $scope.PatientDetailsInfo.SecondLastName = $scope.PatientDetailsInfo.SecondLastName.replace(/[^\w\s]/gi, '');
                $scope.PatientDetailsInfo.SecondLastName = $scope.PatientDetailsInfo.SecondLastName.replace(/_/g, '');
            }
            alertify.error("Special Characters are not allowed. Please check");
            return false;
        }
    }

}]);
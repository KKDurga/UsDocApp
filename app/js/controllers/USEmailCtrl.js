//USEmailCtrl
"use strict";
eHnoteWebApp.controller("USEmailCtrl", ["$scope", "$rootScope", "$filter", "alertify", "eHnoteMasterDataService", "eHnoteLoginStatusService", "$uibModalInstance", "eHnotePatientDataService", "localStorageFactory", "eHnoteUserDataService","eHnoteDiagnosisDataServices",
    function ($scope, $rootScope, $filter, alertify, eHnoteMasterDataService, eHnoteLoginStatusService, $uibModalInstance, eHnotePatientDataService, localStorageFactory, eHnoteUserDataService, eHnoteDiagnosisDataServices) {

        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();

        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode
            && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID) {
            var hospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
            $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            $scope.ParentHospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.UserRoleId = doctorinfo.RoleID || 0;
        }
        $scope.SpecializationId = 0;
        $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
        $scope.UserId = eHnoteMasterDataService.getLoginId();
      

        $scope.Tab = "1";
        $scope.subTab = "1";
        $scope.uibclose = function () {
            $uibModalInstance.dismiss("cancel");
        };

        $scope.init = function () {
            $scope.MailSentBoxDetails = [];
            $scope.MailInBoxDetails = [];
            $scope.CaseHistory = [];
            $scope.patSearchType = 4;
            onBranchesload();
        }

        function onBranchesload(data) {
            
            var data = localStorageFactory.getItem("allBranchesData") || [];
            $scope.hospitalDetails = data;
            $scope.HospitalArray = [];
            angular.forEach($scope.hospitalDetails, function (item, index) {
                $scope.HospitalArray.push(item.HospitalInfo.HospitalDetails);
                $scope.HospitalArray[index].isChecked = true;
            });
        }
        $scope.init();

        $scope.ClickOPPatientSearchIcon = function () {
            $scope.SearchByTextOPHeader();
        }

        $scope.PatientSearch = {
            "SearchText": ""
        };

        $scope.SearchByTextOPHeader = function (type) {
            if ($scope.PatientSearch.SearchText != '') {
                $scope.PatientsArray = [];
                var name = $scope.PatientSearch.SearchText;
                if (name === undefined || name === '') {
                    type = 'click';
                }
                /*if ((name && name.length >= 3) || type === 'click') {*/
                if (name && name.length >= 3 || $scope.patSearchType !== 1) {
                    $scope.Emailid = "";

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

                    if (!isNaN(name) && $scope.patSearchType == 3) {
                        if (name.length < 10) {
                            param.hasparam = false;
                            return;
                        }
                    }
                    if (!isNaN(name)) {
                        param.PhoneNumber = name;
                        param.hasparam = true;
                        param.SearchText = "";
                    } else {
                        param.SearchText = name;
                        param.hasparam = true;
                        param.PhoneNumber = "";
                    }
                    param.UserId = eHnoteMasterDataService.getLoginId();
                    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
                        param['HospitalID'] = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
                        $scope.CheckHospitalId = {};
                        if ($scope.UserRoleId === 1 || $scope.UserRoleId === 56) {
                            $scope.HospitalArray = [];
                            angular.forEach(doctorinfo.doctordata.UserAddress, function (item) {
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
                    var doctorinfoaccess = eHnoteMasterDataService.getUserInfo();
                
     
                    if (param.PhoneNumber !== "") {
                        var object = {
                            "UserId": eHnoteMasterDataService.getLoginId(),
                            "HospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                            "HospitalIDLst": param.HospitalIDLst.toString(),
                            "SearchText": param.PhoneNumber || '',
                            "SearchTypeID": $scope.patSearchType || 0,
                        }
                        eHnotePatientDataService.SearchAllPatientData(object, OnGetopSearchPatientSuccess, OnGetopPatientSearchError, $scope.sendhospcode);
                    } else {
                        var object = {
                            "UserId": eHnoteMasterDataService.getLoginId(),
                            "HospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                            "HospitalIDLst": param.HospitalIDLst.toString(),
                            "SearchText": param.SearchText || "",
                            "SearchTypeID": $scope.patSearchType || 0,
                        }
                        eHnotePatientDataService.SearchAllPatientData(object, OnGetopSearchPatientSuccess, OnGetopPatientSearchError, $scope.sendhospcode);
                    }
                }
            }

        };

        function OnGetopSearchPatientSuccess(data) {
            if (data.count > 0) {
                $scope.count = data.count;
                $scope.PatientsArray = [];
                $scope.patientpushval = [];
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
                    var obj = eHnoteUserDataService.UsMobileFormatChange(item.Altareacode + item.AltHomeNumber);
                    $scope.patientinitval.MobileNo = obj.UsFormatMobileNumber;
                    var previouspatval = angular.copy($scope.patientinitval);
                    $scope.patientpushval.push(previouspatval);
                });
                $scope.PatientsArray = $scope.patientpushval;

                $scope.noresult = false;
                $scope.showloading = false;
                $scope.$broadcast('scroll.infiniteScrollComplete');
            } else {
                $scope.count = 0;
                $scope.PatientsArray = [];
            }
            if ($scope.PatientSearch.SearchText != "") {
                $scope.ShowPatientListDrop = true;
            }
        }
        function OnGetopPatientSearchError() {
            $scope.count = 0;
            $scope.PatientsArray = [];
            $scope.PatientSearch.SearchText = "";
        }

        $scope.SentBox = function () {
            var object = {
                "UserId": $scope.UserId,
                "HospitalId": $scope.HospitalId,
                "PageSize": 10,
                "PageNumber": 1,

            };
            eHnotePatientDataService.GetMailSentBoxDetails(object).then(function (resp) {
                if (resp.data.MailSentBoxDetails.length > 0) {
                    $scope.MailSentBoxDetails = resp.data.MailSentBoxDetails || [];
                } else {
                    $scope.MailSentBoxDetails = [];
                }
            
            }, function (err) {
                alertify.error(err.data.ExceptionMessage);
            });
        }

        $scope.InBox = function () {
            var object = {
                "UserId": $scope.UserId,
                "HospitalId": $scope.HospitalId,
                "PageSize": 10,
                "PageNumber": 1,

            };
            eHnotePatientDataService.GetMailInBoxDetails(object).then(function (resp) {
                if (resp.data.MailInBoxDetails.length > 0) {
                    $scope.MailInBoxDetails = resp.data.MailInBoxDetails || [];
                } else {
                    $scope.MailInBoxDetails = [];
                }
            }, function (err) {
                alertify.error(err.data.ExceptionMessage);
            });
        }

        $scope.SendmailReq = {
            "PatientId": null,
            "TextBody": "",
            "To": "",
            "CC": "",
            "Subject": "",
            "HospitalID": $scope.HospitalId,
            "UserId": $scope.UserId,
            "send": true,
            "DoctorEmail": "",
        }

        $scope.PatientData = {
            "PatientId":null,
            "FullName":'',
            "Age":'',
            "PhoneNumber":'',
            "MRNo":'',
            "Gender":'',
        }

        $scope.getselectedPatient = function (item) {
            $scope.PatientData.PatientId = item.PatientID;
            $scope.PatientData.FullName = item.FullName;
            $scope.PatientData.PhoneNumber = item.PhoneNumber;
            $scope.PatientData.Age = item.Age;
            $scope.PatientData.MRNo = item.DisplayID;
            $scope.PatientData.Gender = item.Gender;
            $scope.ShowPatientListDrop = false;
        }
        $scope.ChartObj = {
           
            "AppointmentId": null,
            "AppointmentDate": null,
            "IsComingFromChart": false,
            "DoctorId": null,

        }

        $scope.ChangesConsultation = function (item) {
            var ConsultationId = item.ConsultationId || 0;
            var AppointmentId = item.AppointmentId || 0;
            $scope.ChartObj.DoctorId = item.DoctorId || 0;
            $scope.ChartObj.AppointmentId = item.AppointmentId || 0;
            $scope.ChartObj.AppointmentDate = item.AppointmentDate || 0;

            $scope.SelectedAppointmentId = item.AppointmentId || 0;
            $scope.GetPatientAppointmenthistroy(ConsultationId, AppointmentId);

            var currentdate = $filter("date")(new Date(), "yyyy-MM-dd");
            if (currentdate === $scope.ChartObj.AppointmentDate) {
                $scope.IsAppointmentToday = true;
            } else {
                $scope.IsAppointmentToday = false;
            }
        }


        $scope.GetOpthaPatientCaseHistory = function () {
            if ($scope.PatientData.PatientId == null) {
                alertify.error("Select Patient")
                return false;
            }
            $scope.CaseHistory = [];
            var AppointmentTypeIds = null;
            AppointmentTypeIds = "1,2,3,5,6,8,9";


            var object = {
                "PatientID": $scope.PatientData.PatientId,
                "HospitalID": $scope.HospitalId,
                "AppointmentTypeIds": AppointmentTypeIds
            };
            eHnotePatientDataService.GetAppointmentsForCaseHistory(object).then(function (resp) {
                if (resp.data !== undefined) {
                    if (resp.data.length > 0) {
                        $scope.CaseHistory = resp.data;
                        var ConsultationId = resp.data[0].ConsultationId || 0;
                        var AppointmentId = resp.data[0].AppointmentId || 0;

                        $scope.ChartObj.DoctorId = resp.data[0].DoctorId || 0;
                        $scope.ChartObj.AppointmentId = resp.data[0].AppointmentId || 0;
                        $scope.ChartObj.AppointmentDate = resp.data[0].AppointmentDate || 0;
                        $scope.SelectedAppointmentId = resp.data[0].AppointmentId || 0;
                   

                        $scope.GetPatientAppointmenthistroy(ConsultationId, AppointmentId);

                        var currentdate = $filter("date")(new Date(), "yyyy-MM-dd");
                        if (currentdate === $scope.ChartObj.AppointmentDate) {
                            $scope.IsAppointmentToday = true;
                        } else {
                            $scope.IsAppointmentToday = false;
                        }
                    }
                }
                if (resp.data.status === "Failure") {
                    alertify.error("Getting Casehistory Failed");
                    return;
                }
            }, function (err) {
                alertify.error("Getting Casehistory Failed");
                $scope.CaseHistory = [];
            });
        };

        $scope.GetPatientAppointmenthistroy = function (consultationid, AppointmentID) {
            var type = 0;
            if (consultationid === 0) {
                type = 1;
            }
            var object = {
                "AppointmentId": AppointmentID,
                "Type": type
            };
            eHnotePatientDataService.GetPatientConsultationDetailsByApptId(object).then(function (resp) {
                if (resp.data !== undefined) {
                    $scope.treatmentData = resp.data;
                    $scope.treatmentArray = [];

                    angular.forEach(resp.data, function (item) {
                        if (AppointmentID === item.AppointmentId) {

                            // to show appointmnt date, time and doctor name
                            let ApptTime = item.AppointmentDt + ' ' + item.AppointmentTime;
                            ApptTime = $filter('date')(new Date(ApptTime), "hh:mm a");
                            item.AppointmentTime = ApptTime;

                            $scope.treatmentArray.push(item);
                        }
                    });

                    if (resp.data.length > 0) {
                        $scope.referalMailBind = resp.data[0].ReferralDocemail || "";
                        $scope.referalDoctorID = resp.data[0].ReferalDoctorId;
                     
                    }

                    $scope.SelectedPlanArray = $filter("filter")($scope.treatmentData, { "AppointmentId": AppointmentID }, true);
                    if ($scope.SelectedPlanArray.length > 0) {
                        $scope.RestructureToconsultation($scope.SelectedPlanArray[0], consultationid);
                        // $scope.ConsultationObj.SummaryView = true;
                    }
                  

                   

                }
            }, function (err) {
                alertify.error(err.data.ExceptionMessage);
            });
        };


        $scope.SaveEmailpopup = function () {

            if ($scope.SendmailReq.To == '') {
                alertify.error("Enter Doctor Email");
                return false;
            }
            if ($scope.SendmailReq.Subject == '') {
                alertify.error("Enter Subject");
                return false;
            }
            if ($scope.SendmailReq.TextBody == '') {
                alertify.error("Enter Text Body");
                return false;
            }
            var obj = {
                "DoctorEmail": $scope.SendmailReq.To || "",
                "TextBody": $scope.SendmailReq.TextBody || "",
                "Subject": $scope.SendmailReq.Subject || "",
                "HospitalID": $scope.HospitalId,
                "UserId": $scope.UserId,
                "send": true,
                "receive": true,
                "PatientId": $scope.SendmailReq.PatientId,
                "PHIEmail": "",
            }


            eHnoteDiagnosisDataServices.SendemailData1(obj).then(function (response) {

                if (response.data.status === 'success') {
                    $scope.SendmailReq = {
                        "PatientId": null,
                        "TextBody": "",
                        "To": "",
                        "CC": "",
                        "Subject": "",
                        "HospitalID": $scope.HospitalId,
                        "UserId": $scope.UserId,
                        "send": true,
                        "DoctorEmail": "",
                    }
                }
            });
        }

    }]);
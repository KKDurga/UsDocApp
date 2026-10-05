//USEmailCtrl
"use strict";
eHnoteWebApp.controller("USEmailNotificationCtrl", ["$scope", "$rootScope", "$filter", "alertify", "eHnoteMasterDataService", "eHnoteLoginStatusService", "$uibModal", "$uibModalInstance", "eHnotePatientDataService", "localStorageFactory", "eHnoteUserDataService", "eHnoteDiagnosisDataServices", "eHnoteMainAppointmentService", "$sce", "$http", "downloadpdfService",
    function ($scope, $rootScope, $filter, alertify, eHnoteMasterDataService, eHnoteLoginStatusService, $uibModal, $uibModalInstance, eHnotePatientDataService, localStorageFactory, eHnoteUserDataService, eHnoteDiagnosisDataServices, eHnoteMainAppointmentService, $sce, $http, downloadpdfService) {

        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
        $scope.SubOrganizationId = doctorinfo.doctordata.UserAddress[0].SubOrganizationId;

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
        $scope.currentdate = $filter("date")(new Date(), "yyyy-MM-dd");
        $scope.AllDoctorList = [];
        $scope.itemsperpage = 10;
        $scope.maxSize = 5;
        $scope.currentPage = 1;

        function formatDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }

        var currentnewDate = new Date();
        var thirtyDaysAgo = new Date(currentnewDate);
        thirtyDaysAgo.setDate(currentnewDate.getDate() - 30);
        $scope.thirtyDaysAgoDate = formatDate(thirtyDaysAgo);



        console.log($scope.thirtyDaysAgoDate);


        $scope.PHIEmailUserArray = [
            { "Id": 1, "Value": "ehnote@test.directproject.net" },
            { "Id": 2, "Value": "ehnote-edge2015@directtest.interopengine.com" },

        ]


        $scope.EmailTab = 1;
        $scope.EmailSubTab = 1;
        $scope.SelectedAppointmentId = 0;
        $scope.uibclose = function () {
            $uibModalInstance.dismiss("cancel");
        };


        



        function requestEmailEmptyRequestObj() {
            var obj = {
                "OrganizationId": $scope.HospitalId,
                "PageSize": 10,
                "PageNumber": 1,
                "FromDate": $scope.thirtyDaysAgoDate,
                "ToDate": $scope.currentdate,
                "ProviderId": $scope.UserId,
                "PatientId": 0,
                "StatusId": 0,
                "EmailType": "Receive",
            }
            return obj;
        }

        $scope.TotalInboxCount = 0;
        $scope.newEmailReqObj = requestEmailEmptyRequestObj();
        $scope.GetAllInMailBoxDetails = function (IszipfileInd) {

            var params = {
                "OrganizationId": $scope.newEmailReqObj.OrganizationId,
                "PageSize": $scope.newEmailReqObj.PageSize,
                "PageNumber": $scope.newEmailReqObj.PageNumber,
                "FromDate": $scope.newEmailReqObj.FromDate,
                "ToDate": $scope.newEmailReqObj.ToDate,
                "ProviderId": $scope.newEmailReqObj.ProviderId,
                "PatientId": $scope.newEmailReqObj.PatientId,
                "StatusId": $scope.newEmailReqObj.StatusId,
                "EmailType": $scope.newEmailReqObj.EmailType

            };
            eHnotePatientDataService.GetAllInMailBoxDetails(params).then(function (resp) {
                if (resp.data.count > 0) {
                    $scope.MailsInboxDetails = resp.data.rows || [];


                    console.log($scope.MailsInboxDetails);



                    angular.forEach($scope.MailsInboxDetails, function (mitem) {
                        mitem.IsActive = false;
                        if (mitem.AttachmentsArray.length > 0) {
                            angular.forEach(mitem.AttachmentsArray, function (sitem) {
                                if (sitem.ExtractArray.length > 0) {
                                    angular.forEach(sitem.ExtractArray, function (citem) {
                                        citem.IsCCDA = false;
                                        if (citem.FileExt == ".XML" || citem.FileExt == ".xml") {
                                            if (citem.MimeType ==="application/xml") {
                                                citem.IsCCDA = true;
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    });
                    $scope.TotalInboxCount = resp.data.count;
                   /* && IszipfileInd*/
                    if ($scope.MailsInboxDetails.length > 0) {
                        $scope.MailsInboxDetails[0].IsActive = true;
                        $scope.showIndividualEmailDetails($scope.MailsInboxDetails[0]);
                    }
                } else {
                    $scope.MailsInboxDetails = [];
                }

            }, function (err) {
                alertify.error(err.data.ExceptionMessage);
            });
        };
        $scope.Accordionobj = {
            "IsShowChiefComplaintsData": true,
            "IsShowROSData": true,
            "IsShowVisionPerceptionData": true,
            "IsShowContactLensData": true,
            "IsShowExaminationData": true,
            "IsShowAssessmentData": true,
            "IsShowOrdersData": true,
            "IsShowMedicalRXData": true,
            "IsShowGlassRXData": true,
            "IsShowProceduresData": true,
            "IsShowSuperBillData": true,
            "IsShowGeneralPlanData": true
        }
        $scope.init = function () {
            $scope.serverurl = "https://ehnotedevstorage.blob.core.windows.net";
            $scope.MailInBoxDetails = [];
            $scope.GetAllInMailBoxDetails();
            $scope.MailSentBoxDetails = [];
            $scope.MailInBoxDetails = [];
            $scope.CaseHistory = [];
            $scope.patSearchType = 4;
            $scope.MailsInboxDetails = [];

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


        $scope.CCDAChartObj = {
            "IsComingform": "CCDA",
            "PatientId": null,
            "AppointmentId": null,
        }

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

        //$scope.InBox = function () {
        //    var object = {
        //        "UserId": $scope.UserId,
        //        "HospitalId": $scope.HospitalId,
        //        "PageSize": 10,
        //        "PageNumber": 1,

        //    };
        //    eHnotePatientDataService.GetMailInBoxDetails(object).then(function (resp) {
        //        if (resp.data.MailInBoxDetails.length > 0) {
        //            $scope.MailInBoxDetails = resp.data.MailInBoxDetails || [];
        //        } else {
        //            $scope.MailInBoxDetails = [];
        //        }
        //    }, function (err) {
        //        alertify.error(err.data.ExceptionMessage);
        //    });
        //}




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
            "PatientId": null,
            "FullName": '',
            "Age": '',
            "PhoneNumber": '',
            "MRNo": '',
            "Gender": '',
        }

        $scope.getselectedPatient = function (item) {
            $scope.PatientData.PatientId = item.PatientID;
            $scope.PatientData.FullName = item.FullName;
            $scope.PatientData.PhoneNumber = item.PhoneNumber;
            $scope.PatientData.Age = item.Age;
            $scope.PatientData.MRNo = item.DisplayID;
            $scope.PatientData.Gender = item.Gender;
            $scope.ShowPatientListDrop = false;
            $scope.newSendEmailReqObj.PatientId = item.PatientID;
          /*  $scope.EmailSubTab = 1;*/
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


            if ($scope.currentdate === $scope.ChartObj.AppointmentDate) {
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


                        if ($scope.currentdate === $scope.ChartObj.AppointmentDate) {
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

                            $scope.CCDAChartObj.AppointmentId = item.AppointmentId;
                            $scope.CCDAChartObj.PatientId = item.PatientArray[0].PatientId;
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
                    $scope.newSendEmailReqObj = getSendEmailEmptyRequestObj();

                }
            });
        }
        // // incoming messages code starts here
        $scope.GetInbox = function () {
            $scope.GetAllInMailBoxDetails();
        };
        function getReceiveEmailEmptyRequestObj() {
            var obj = {
                "FromEmail": "",
                "ToEmail": "",
                "CreatedDate": "",
                "EmailSubject": "",
                "EmailBody": "",
                "AttachmentsArray": [],
                "toUsername": "",
                "showEmailDetails": false,
                "DirectSecureMessageId":0
                //"ToEmail": "",
                //"RecipientAddress": "",

            }
            return obj;
        }
        $scope.newEmailReqObj = getReceiveEmailEmptyRequestObj();

        $scope.showIndividualEmailDetails = function (item) {
            console.log(item)
            var formattedDate = $filter('date')(new Date(item.CreatedDate), 'EEE MM-dd-yyyy HH:mm');

            var username = item.ToEmail.substring(0, item.ToEmail.indexOf('@'));
            $scope.newEmailReqObj.showEmailDetails = true;
            $scope.newEmailReqObj.CreatedDate = formattedDate;
            $scope.newEmailReqObj.FromEmail = item.FromEmail;
            $scope.newEmailReqObj.ToEmail = item.ToEmail;
            $scope.newEmailReqObj.EmailSubject = item.EmailSubject;
            $scope.newEmailReqObj.toUsername = username
            $scope.newEmailReqObj.EmailBody = item.EmailBody;
            $scope.newEmailReqObj.AttachmentsArray = item.AttachmentsArray;
            $scope.newEmailReqObj.DirectSecureMessageId = item.DirectSecureMessageId;


        }

        //$scope.reconcileAttachent = function (item) {
        //    $scope.attachmenturl = "https://ehnotedevstorage.blob.core.windows.net" + item.S3URL
        //}

        $scope.getLatestIncomingMessages = function () {
            var object = {
                "OrganizationId": $scope.HospitalId,
                "PageSize": 10,
                "PageNumber": 1,
                "FromDate": $scope.currentdate,
                "ToDate": $scope.currentdate,
                "ProviderId": $scope.UserId,
                "PatientId": 0,
                "StatusId": 0,
                "USPhiMailUser": $scope.newSendEmailReqObj.USPhiMailUser,
                "EmailType": "Receive"

            };
            eHnotePatientDataService.GetLatestInMailBoxDetails(object).then(function (resp) {

                console.log(resp);
                $scope.newEmailReqObj = requestEmailEmptyRequestObj();
                $scope.GetAllInMailBoxDetails();

            }, function (err) {
                alertify.error(err.data.ExceptionMessage);
                $scope.newEmailReqObj = requestEmailEmptyRequestObj();
                $scope.GetAllInMailBoxDetails();
            });
        };
        $scope.getFinalDeliveryMessages = function () {
            var object = {
                "OrganizationId": $scope.HospitalId,
                "PageSize": 10,
                "PageNumber": 1,
                "ProviderId": $scope.UserId,
                "USPhiMailUser": $scope.newSendEmailReqObj.USPhiMailUser,


            };
            eHnotePatientDataService.GetFinalDeliveryPHIEMail(object).then(function (resp) {

                console.log(resp);
                $scope.newEmailReqObj = requestEmailEmptyRequestObj();
                $scope.GetAllInMailBoxDetails();

            }, function (err) {
                //  alertify.error(err.data.ExceptionMessage);
                $scope.newEmailReqObj = requestEmailEmptyRequestObj();
                $scope.GetAllInMailBoxDetails();
            });
        };

        // incoming messages code endds here


        $scope.switchtoSubEmailTab = function (tabno) {
            $scope.EmailTab = tabno;
            if (tabno === 2) {
                $scope.getSentPHIEmail();
            };

            if (tabno == 1) {
                $scope.newEmailReqObj = requestEmailEmptyRequestObj();
                $scope.GetAllInMailBoxDetails();
                $scope.TotalInboxCount = 0;
            };
        };

        $scope.navtoComposeNewEmail = function () {
            $scope.EmailTab = 3;
        }



        //durga latest code as on 20-09-2023
        function getSendEmailEmptyRequestObj() {

            var CreatedByName = "";
            if (doctorinfo.doctordata.User.length > 0) {
                CreatedByName = doctorinfo.doctordata.User[0].FullName || "";
            }
            var obj = {
                "UserId": $scope.UserId,
                "OrganizationId": $scope.HospitalId,
                "PatientId": 0,
                "AppointmentId": 0,
                "DirectSecureMessageId": 0,
                "FromEmail": "",
                "ToEmail": "",
                "RecipientAddress": "",
                "MessageType": "Transaction of Care",
                "MessageTypeId": 1,
                "EmailBody": "",
                "EmailSubject": "",
                "USPhiMailUser": "ehnote@test.directproject.net",
                "Status": "Pending",
                "StatusId": 1,
                "ExternalStatus": "Pending",
                "ExternalMessageId": "",
                "CreatedByUser": CreatedByName,
                "CreatedDate": $scope.currentdate,
                "EmailType": "Send",
                "EmailTypeId": 1,
                "DeleteInd": "N",
                "AppointmentReferalId":"",
                "AttachmentsArray": [],
                "DocumentType": ""
            }
            return obj;
        }

        $scope.newSendEmailReqObj = getSendEmailEmptyRequestObj();



        $scope.SendPHIEmail = function () {


            if ($scope.newSendEmailReqObj.ToEmail == '') {
                alertify.error("Enter To Email");
                return false;
            }
            if ($scope.newSendEmailReqObj.EmailSubject == '') {
                alertify.error("Enter Subject");
                return false;
            }
            if ($scope.newSendEmailReqObj.EmailBody == '') {
                alertify.error("Enter Email Body");
                return false;
            }



            var params = {
                "UserId": $scope.UserId,
                "AppointmentId": $scope.newSendEmailReqObj.AppointmentId,
                "PatientId": $scope.newSendEmailReqObj.PatientId,
                "AppointmentReferalId": 0,
                "ReferalTypeId": 2,
                "ReferalType": "Electonic",
                "ReferalEmailId": $scope.newSendEmailReqObj.ToEmail,
                "ReferalDoctorName": "",
                "ReferalOrganizationName": "",
                "ReferalNote": $scope.newSendEmailReqObj.EmailBody,
            }

            console.log(params);


            eHnoteMainAppointmentService.AddUpdateAppointmentReminderDetails(params).then(function (resp) {

                console.log(resp);


                $scope.newSendEmailReqObj.AppointmentReferalId = resp.data.AppointmentReferalId;

                eHnoteDiagnosisDataServices.SendPhiEmailData($scope.newSendEmailReqObj).then(function (response) {


                    console.log(JSON.stringify(response))
                    if (response.data.status === 'Success') {
                        $scope.newSendEmailReqObj = getSendEmailEmptyRequestObj();
                        $scope.PatientData.PatientId = 0;
                        $scope.PatientSearch.SearchText = "";
                        $scope.treatmentArray = [];
                        alertify.success("Email Sent Successfully");
                        $scope.switchtoSubEmailTab(2);
                    } else {
                        alertify.error(response.data.Message);
                    }

                });

                //eHnoteDiagnosisDataServices.SendPhiEmailData1($scope.newSendEmailReqObj, callbackSuccessonAppointment, ErroronAppointment);
                //function callbackSuccessonAppointment(data) {
                //    if (response.data.status === 'Success') {
                //        $scope.newSendEmailReqObj = getSendEmailEmptyRequestObj();
                //        alertify.success("Email Sent Successfully");
                //    } else {
                //        alertify.success("Some Error Occurred");
                //    }
                //}
                //function ErroronAppointment(err) {
                //    console.log(err);
                //}
            }, function (err) {
                alertify.error("Getting Failed");
            })






        };

        $scope.SwitchToSUbTabEmail = function (subtabno) {
            $scope.EmailSubTab = subtabno;

            if (subtabno == 2) {
                if ($scope.newSendEmailReqObj.PatientId == null) {
                    alertify.error("Please Select Patient");
                    return false;
                }
                $scope.GetOpthaPatientCaseHistory();
            }
        }



        $scope.CCDACreationOptions = {
            "Allergies": true,
            "Problems": true,
            "Procedure": true,
            "Careplan": true,
            "Careteam": true,
            "Immunization": true,
            "HealthConcerns": true,
            "HealthGoals": true,
            "Prescription": true,
            "MedictionStatement": true,
            "Vitals": true,
            "Referrals": true,
            "Encounter": true,
            "MentalStatus": true,
            "SmokingStatus": true,
            "AssessmentPlan": true,
            "DischargeInstructions": true,
            "DischargeMedications": true,
            "LabInvestigations": true,
            "TreatmentPlan": true
        };

        //$scope.CCDACreationOptions = {
        //    "Allergies": false,
        //    "Problems": false,
        //    "Procedure": false,
        //    "Careplan": false,
        //    "Careteam": false,
        //    "Immunization": false,
        //    "HealthConcerns": false,
        //    "HealthGoals": false,
        //    "Prescription": false,
        //    "MedictionStatement": false,
        //    "Vitals": false,
        //    "Referrals": false,
        //    "Encounter": false,
        //    "MentalStatus": false,
        //    "SmokingStatus": false,
        //    "AssessmentPlan": false,
        //    "DischargeInstructions": false,
        //    "DischargeMedications": false,
        //    "LabInvestigations":false,
        //    "TreatmentPlan":false
        //};

        $scope.getAttachmentFromtheSelectedData = function (item) {
            console.log(item);
            var type = 0;
            if (item.ConsultationId === 0) {
                type = 1;
            }
            var obj = {
                "PatientId": $scope.newSendEmailReqObj.PatientId,
                "AppointmentId": item.AppointmentId,
                "Type": type,
                "UserId": $scope.UserId,
                "Allergies": $scope.CCDACreationOptions.Allergies,
                "Problems": $scope.CCDACreationOptions.Problems,
                "Procedure": $scope.CCDACreationOptions.Procedure,
                "Careplan": $scope.CCDACreationOptions.Careplan,
                "Careteam": $scope.CCDACreationOptions.Careteam,
                "Immunization": $scope.CCDACreationOptions.Immunization,
                "HealthConcerns": $scope.CCDACreationOptions.HealthConcerns,
                "HealthGoals": $scope.CCDACreationOptions.HealthGoals,
                "Prescription": $scope.CCDACreationOptions.Prescription,
                "MedictionStatement": $scope.CCDACreationOptions.MedictionStatement,
                "Vitals": $scope.CCDACreationOptions.Vitals,
                "Referrals": $scope.CCDACreationOptions.Referrals,
                "Encounter": $scope.CCDACreationOptions.Encounter,
                "MentalStatus": $scope.CCDACreationOptions.MentalStatus,
                "SmokingStatus": $scope.CCDACreationOptions.SmokingStatus,
                "AssessmentPlan": $scope.CCDACreationOptions.AssessmentPlan,
                "DischargeInstructions": $scope.CCDACreationOptions.DischargeInstructions,
                "DischargeMedications": $scope.CCDACreationOptions.DischargeMedications,
                "LabInvestigations": $scope.CCDACreationOptions.LabInvestigations,
                "TreatmentPlan": $scope.CCDACreationOptions.TreatmentPlan,
                "DocumentType": "CCD"
            };

            $scope.newSendEmailReqObj.AppointmentId = item.AppointmentId;

            eHnoteDiagnosisDataServices.GetCCDACreate(obj).then(function (resp) {
                if (resp.data != null) {
                    console.log(JSON.stringify(resp.data));

                    if (resp.data != "") {

                        var patname = $scope.PatientData.FullName.replace(/ /g, "");
                        var attachmentObj = {
                            "FileId": 0,
                            "FileName": patname + "_" + "Attachment",
                            "S3URL": resp.data,
                            "ExternalFileName": patname + "_" + "Attachment",
                            "FileExt": ".xml",
                            "MimeType": "application/xml",
                            "CreatedByUser": doctorinfo.doctordata.User[0].FullName,
                            "CreatedDate": $scope.currentdate,
                            "DeleteInd": "N",
                            "DirectSecureMessageId": 0
                        }
                        $scope.newSendEmailReqObj.AttachmentsArray.push(attachmentObj)

                        $scope.EmailSubTab = 1;


                    } else {

                    }
                }
            });

        };

        $scope.getAttachmentFromtheSelectedDataNew = function (item, val) {

            console.log(item);

            angular.forEach($scope.newSendEmailReqObj.AttachmentsArray, function (item, index) {
                item.IsRemoved = false;
            });

            if (val === "CCD") {

                if ($scope.newSendEmailReqObj.AttachmentsArray.length > 0) {
                    angular.forEach($scope.newSendEmailReqObj.AttachmentsArray, function (item, index) {
                        if (item.DocumentType == 'Referral' && item.FileExt == '.xml') {
                            item.IsRemoved = true;
                        }

                    });

                    let tempArray = $filter('filter')($scope.newSendEmailReqObj.AttachmentsArray, { 'IsRemoved': false }, true);
                    $scope.newSendEmailReqObj.AttachmentsArray = angular.copy(tempArray);
                }

                var type = 0;
                if (item.ConsultationId === 0) {
                    type = 1;
                }
                var obj = {
                    "PatientId": $scope.newSendEmailReqObj.PatientId,
                    "AppointmentId": item.AppointmentId,
                    "Type": type,
                    "UserId": $scope.UserId,
                    "Allergies": $scope.CCDACreationOptions.Allergies,
                    "Problems": $scope.CCDACreationOptions.Problems,
                    "Procedure": $scope.CCDACreationOptions.Procedure,
                    "Careplan": $scope.CCDACreationOptions.Careplan,
                    "Careteam": $scope.CCDACreationOptions.Careteam,
                    "Immunization": $scope.CCDACreationOptions.Immunization,
                    "HealthConcerns": $scope.CCDACreationOptions.HealthConcerns,
                    "HealthGoals": $scope.CCDACreationOptions.HealthGoals,
                    "Prescription": $scope.CCDACreationOptions.Prescription,
                    "MedictionStatement": $scope.CCDACreationOptions.MedictionStatement,
                    "Vitals": $scope.CCDACreationOptions.Vitals,
                    "Referrals": $scope.CCDACreationOptions.Referrals,
                    "Encounter": $scope.CCDACreationOptions.Encounter,
                    "MentalStatus": $scope.CCDACreationOptions.MentalStatus,
                    "SmokingStatus": $scope.CCDACreationOptions.SmokingStatus,
                    "AssessmentPlan": $scope.CCDACreationOptions.AssessmentPlan,
                    "DischargeInstructions": $scope.CCDACreationOptions.DischargeInstructions,
                    "DischargeMedications": $scope.CCDACreationOptions.DischargeMedications,
                    "LabInvestigations": $scope.CCDACreationOptions.LabInvestigations,
                    "TreatmentPlan": $scope.CCDACreationOptions.TreatmentPlan,
                    "DocumentType": "CCD"
                };

                $scope.newSendEmailReqObj.AppointmentId = item.AppointmentId;

                eHnoteDiagnosisDataServices.GetCCDACreate(obj).then(function (resp) {
                    if (resp.data != null) {
                        console.log(JSON.stringify(resp.data));

                        if (resp.data != "") {

                            var patname = $scope.PatientData.FullName.replace(/ /g, "");
                            var attachmentObj = {
                                "FileId": 0,
                                "FileName": patname + "_" + "Attachment",
                                "S3URL": resp.data,
                                "ExternalFileName": patname + "_" + "Attachment",
                                "FileExt": ".xml",
                                "MimeType": "application/xml",
                                "CreatedByUser": doctorinfo.doctordata.User[0].FullName,
                                "CreatedDate": $scope.currentdate,
                                "DeleteInd": "N",
                                "DirectSecureMessageId": 0,
                                "DocumentType": "CCD"
                            }
                            $scope.newSendEmailReqObj.AttachmentsArray.push(attachmentObj)

                            $scope.EmailSubTab = 1;


                        } else {

                        }
                    }
                });
            } else if (val === "Referral") {
                if ($scope.newSendEmailReqObj.AttachmentsArray.length > 0) {
                    angular.forEach($scope.newSendEmailReqObj.AttachmentsArray, function (item, index) {
                        if (item.DocumentType == 'CCD' && item.FileExt == '.xml') {
                            item.IsRemoved = true;
                        }

                    });

                    let tempArray = $filter('filter')($scope.newSendEmailReqObj.AttachmentsArray, { 'IsRemoved': false }, true);
                    $scope.newSendEmailReqObj.AttachmentsArray = angular.copy(tempArray);
                }

                var type = 0;
                if (item.ConsultationId === 0) {
                    type = 1;
                }
                var obj = {
                    "PatientId": $scope.newSendEmailReqObj.PatientId,
                    "AppointmentId": item.AppointmentId,
                    "Type": type,
                    "UserId": $scope.UserId,
                    "Allergies": $scope.CCDACreationOptions.Allergies,
                    "Problems": $scope.CCDACreationOptions.Problems,
                    "Procedure": $scope.CCDACreationOptions.Procedure,
                    "Careplan": $scope.CCDACreationOptions.Careplan,
                    "Careteam": $scope.CCDACreationOptions.Careteam,
                    "Immunization": $scope.CCDACreationOptions.Immunization,
                    "HealthConcerns": $scope.CCDACreationOptions.HealthConcerns,
                    "HealthGoals": $scope.CCDACreationOptions.HealthGoals,
                    "Prescription": $scope.CCDACreationOptions.Prescription,
                    "MedictionStatement": $scope.CCDACreationOptions.MedictionStatement,
                    "Vitals": $scope.CCDACreationOptions.Vitals,
                    "Referrals": $scope.CCDACreationOptions.Referrals,
                    "Encounter": $scope.CCDACreationOptions.Encounter,
                    "MentalStatus": $scope.CCDACreationOptions.MentalStatus,
                    "SmokingStatus": $scope.CCDACreationOptions.SmokingStatus,
                    "AssessmentPlan": $scope.CCDACreationOptions.AssessmentPlan,
                    "DischargeInstructions": $scope.CCDACreationOptions.DischargeInstructions,
                    "DischargeMedications": $scope.CCDACreationOptions.DischargeMedications,
                    "LabInvestigations": $scope.CCDACreationOptions.LabInvestigations,
                    "TreatmentPlan": $scope.CCDACreationOptions.TreatmentPlan,
                    "DocumentType": "Referral"
                };

                $scope.newSendEmailReqObj.AppointmentId = item.AppointmentId;

                eHnoteDiagnosisDataServices.GetCCDACreate(obj).then(function (resp) {
                    if (resp.data != null) {
                        console.log(JSON.stringify(resp.data));

                        if (resp.data != "") {

                            var patname = $scope.PatientData.FullName.replace(/ /g, "");
                            var attachmentObj = {
                                "FileId": 0,
                                "FileName": patname + "_" + "Attachment",
                                "S3URL": resp.data,
                                "ExternalFileName": patname + "_" + "Attachment",
                                "FileExt": ".xml",
                                "MimeType": "application/xml",
                                "CreatedByUser": doctorinfo.doctordata.User[0].FullName,
                                "CreatedDate": $scope.currentdate,
                                "DeleteInd": "N",
                                "DirectSecureMessageId": 0,
                                "DocumentType": "Referral"
                            }
                            $scope.newSendEmailReqObj.AttachmentsArray.push(attachmentObj)

                            $scope.EmailSubTab = 1;


                        } else {

                        }
                    }
                });
            }
        };

        $scope.RemoveAttachment = function (item) {
            let index = $scope.newSendEmailReqObj.AttachmentsArray.indexOf(item);
            if (index > -1) {
                $scope.newSendEmailReqObj.AttachmentsArray.splice(index, 1);
            }

            if ($scope.newSendEmailReqObj.AttachmentsArray.length === 0) {
                $scope.newSendEmailReqObj.DocumentType = "";
            }
        };


        $scope.GetPdfGenerate = function (item) {

            let tempArray = $filter('filter')($scope.newSendEmailReqObj.AttachmentsArray, { 'FileExt': '.pdf' }, true);

            if (tempArray.length > 0) {
                alertify.error("pdf is already attached!");
                return;
            }

            var TempConsultationPlan = angular.copy(item);

            var req = {
                "UserId": $scope.UserId,
                "ConsultationId": TempConsultationPlan.ConsultationId || "",
                "AppointmentId": TempConsultationPlan.AppointmentId || "",
                "AppointmentDt": TempConsultationPlan.AppointmentDt || "",
                "AppointmentDate": TempConsultationPlan.AppointmentDt || "",
                "PatientId": TempConsultationPlan.PatientArray[0].PatientId || "",
                "AppointmentTime": TempConsultationPlan.AppointmentTime || "",
                "Appointmentwith": TempConsultationPlan.Appointmentwith || "",
                "FollowUpDuration": TempConsultationPlan.FollowUpDuration || "",
                "FollowUpDurationType": TempConsultationPlan.FollowUpDurationType || "",
                "FollowUpNotes": TempConsultationPlan.FollowUpNotes || "",
                "FollowUpDate": TempConsultationPlan.FollowUpDate || "",
                "ScribeName": TempConsultationPlan.ScribeName || "",
                "ReturnToOfficeNotes": TempConsultationPlan.ReturnToOfficeNotes || "",
                "OverallChartNotes": TempConsultationPlan.OverallChartNotes || "",
                "ModifiedBy": TempConsultationPlan.ModifiedBy || "",
                "ModifiedDate": TempConsultationPlan.ModifiedDate || "",
                "StatusFlag": TempConsultationPlan.StatusFlag || "",
                "RoleName": TempConsultationPlan.RoleName || "",
                "DoctorId": TempConsultationPlan.DoctorId || "",
                "DoctorName": TempConsultationPlan.Appointmentwith || "",
                "isSendRefLetterMail": false,
                "BranchId": TempConsultationPlan.BranchId || "",
                "BranchName": TempConsultationPlan.BranchName || "",
                "BranchPhone": TempConsultationPlan.BranchMobile || "",
                "BranchEmail": TempConsultationPlan.BranchEmail || "",
                "BranchAddress": TempConsultationPlan.BranchAddress || "",
                "PatientName": TempConsultationPlan.PatientArray[0].FullName || "",
                "ReferalDoctorName": TempConsultationPlan.ReferalDoctorName || "",
                "emailAddresses": TempConsultationPlan.emailAddresses || '',
                "OrgGSTNO": TempConsultationPlan.AppointmentId || "",
                "PatientDisplayId": TempConsultationPlan.PatientArray[0].PatientDisplayId || "",
                "PatientGender": TempConsultationPlan.PatientArray[0].PatientGender || "",
                "PatientAge": TempConsultationPlan.PatientArray[0].PatientAge || "",
                "PatientGst": TempConsultationPlan.AppointmentId || "",
                "PhoneNumber": TempConsultationPlan.PatientArray[0].PhoneNumber || "",
                "PachymetryAvgODValue": TempConsultationPlan.PachymetryAvgODValue || "",
                "PachymetryAvgOSValue": TempConsultationPlan.PachymetryAvgOSValue || "",
                "ChiefComplaints": [],
                "Vitals": TempConsultationPlan.Vitals || [],
                "OccularHistory": TempConsultationPlan.OccularHistory || [],
                "AllergyItems": TempConsultationPlan.AllergyItems || [],
                "MedicalConditions": [],
                "OccularSurgicalHistory": TempConsultationPlan.OccularSurgicalHistory || [],
                "CurrentEyeMedications": TempConsultationPlan.CurrentEyeMedications || [],
                "SystemicHistory": TempConsultationPlan.SystemicHistory || [],
                "SurgicalHistory": TempConsultationPlan.SurgicalHistory || [],
                "SurgicalHistory": TempConsultationPlan.SurgicalHistory || [],
                "BirthHistory": TempConsultationPlan.BirthHistory || [],
                "FamilyHistory": TempConsultationPlan.FamilyHistory || [],
                "FunctionalStatusHistory": TempConsultationPlan.FunctionalStatusHistory || [],
                "VaccinationHistory": TempConsultationPlan.VaccinationHistory || [],
                "NutritionalHistory": TempConsultationPlan.NutritionalHistory || [],
                "MenstrualHistory": TempConsultationPlan.MenstrualHistory || [],
                "HealthConcerns": TempConsultationPlan.PatientHealthConcerns || [],
                "HealthGoals": TempConsultationPlan.PatientGoals || [],
                "LifestyleHistory": TempConsultationPlan.LifestyleHistory || [],
                "VisionDetails": TempConsultationPlan.VisionDetails || [],
                "AutoRefractionDetails": TempConsultationPlan.AutoRefractionArray || [],
                "RetinoscopyRefractionDetails": TempConsultationPlan.RetinoscopyRefractionArray || [],
                "PGPRefractionDetails": TempConsultationPlan.PGPrefractionArray || [],
                "ManifestRefractionDetails": TempConsultationPlan.ManifestRefractionArray || [],
                "OverRefractionDetails": TempConsultationPlan.OverRefractionArray || [],
                "CycloplegicRefractionDetails": TempConsultationPlan.CycloplegicRefractionArray || [],
                "FinalGlassRxDetails": TempConsultationPlan.FinalGlassRxArray || [],
                "TonoMetryDetails": TempConsultationPlan.Tonometry || [],
                "PupilSizeDetails": TempConsultationPlan.PupilSizeDetails || [],
                "PachymetryDetails": TempConsultationPlan.Pachymetry || [],
                "GlareDetails": TempConsultationPlan.GlareArray || [],
                "KeratometryDetails": TempConsultationPlan.KeratometryValues || [],
                "ContactLensDetails": TempConsultationPlan.ContactLensDetails || [],
                "AnteriorSegmentArrayNew": TempConsultationPlan.AnteriorSegmentDetails || [],
                "PosteriorSegmentDetails": TempConsultationPlan.PosteriorSegmentDetails || [],
                "NineGazeExtraOcularDetails": TempConsultationPlan.NineGazeExtraOcularDetails || [],
                "SquintDetails": TempConsultationPlan.SquintDetails || [],
                "GlassDetails": TempConsultationPlan.GlassDetails || [],
                "OPProceduresArray": TempConsultationPlan.OPProceduresArray || [],
                "SquintPossibleDiagnosis": TempConsultationPlan.SquintPossibleDiagnosis || "",
                "DryEyeEvalutionDetails": TempConsultationPlan.DryEyeEvaluationData || [],
                "ColorVisionDetails": TempConsultationPlan.ColorVisionDetails || [],
                "LacrimalPatiencyDetails": TempConsultationPlan.LacrimalPatiencyDetails || [],
                "GonioscopyDetails": TempConsultationPlan.GonioscopyDetails || [],
                "PrescriptionDetails": TempConsultationPlan.PatientPrescription.PrescriptionDetails || [],
                "AssessmentPlan": TempConsultationPlan.AssessmentPlan || [],
                "InvestigationsDetails": TempConsultationPlan.InvestigationsDetails || [],
                "SurgeriesDetails": TempConsultationPlan.SurgeriesDetails || [],
                "ProceduresDetails": TempConsultationPlan.ProceduresDetails || [],
                "ReferralDetails": TempConsultationPlan.ReferralDetails || [],
                "HeadPosterDetails": TempConsultationPlan.HeadPosterDetails || [],
            }
            req.isSendRefLetterMail = false;
            if (TempConsultationPlan.ChiefComplaints.length > 0) {
                angular.forEach(TempConsultationPlan.ChiefComplaints, function (Citems) {
                    var checifobj = {
                        "ChiefComplaintId": Citems.ChiefComplaintId || 0,
                        "ChiefComplaintName": Citems.ChiefComplaintName || "",
                        "Description": Citems.Description || "",
                        "OrganId": Citems.OrganId || 0,
                        "Duration": 1,
                        "DurationType": Citems.DurationType || '',
                        "Remarks": Citems.Remarks || "",
                    }
                    req.ChiefComplaints.push(checifobj);
                })
            }
            eHnoteDiagnosisDataServices.GetDemoViewConsultationPdf(req).then(function (resp) {
                if (resp.data.Message == 'Success') {
                    $scope.DemoConsultationPdfUrl = [];
                    $scope.DemoConsultationPdfUrl = resp.data.data || [];
                    if ($scope.DemoConsultationPdfUrl.Attachments.length > 0) {
                        angular.forEach($scope.DemoConsultationPdfUrl.Attachments, function (item) {
                            var patname = TempConsultationPlan.PatientArray[0].FullName.replace(/ /g, "");
                            var attachmentObj = {
                                "FileId": 0,
                                "FileName": patname + "_" + "Attachment",
                                "S3URL": item.S3Url,
                                "ExternalFileName": patname + "_" + "Attachment",
                                "FileExt": item.FileExt,
                                "MimeType": "application/pdf",
                                "CreatedByUser": doctorinfo.doctordata.User[0].FullName,
                                "CreatedDate": $scope.currentdate,
                                "DeleteInd": "N",
                                "DirectSecureMessageId": 0
                            }

                            $scope.newSendEmailReqObj.AttachmentsArray.push(attachmentObj);
                        })
                        $scope.EmailSubTab = 1;

                    }

                    /*$scope.GetPatientAllAppointmentDataExportInfo();*/
                }
            })


        }

        //$scope.viewAttachment = function () {
        //    var s3url = $scope.newSendEmailReqObj.AttachmentsArray[0].S3URL;
        //    window.open(s3url);
        //};

        $scope.viewAttachment = function (item) {
            var url = item.S3URL;
            window.open(url);
        };


        $scope.sentEmailsArray = [];


        $scope.SentEmailIndex = 0;
        $scope.sentEMailGetReqObj = {
            "OrganizationId": $scope.HospitalId,
            "PageSize": 10,
            "PageNumber": 1,
            "FromDate": $scope.thirtyDaysAgoDate,
            "ToDate": $scope.currentdate,
            "ProviderId": $scope.UserId,
            "PatientId": 0,
            "StatusId": 0,
            "EmailType": "Send"
        };

        function getnewSelectedEmailObj() {
            var obj = {
                "DirectSecureMessageId": 0,
                "FromEmail": "",
                "ToEmail": "",
                "RecipientAddress": "",
                "UserId": $scope.UserId,
                "OrganizationId": $scope.HospitalId,
                "PatientId": 0,
                "PatientFirstName": "",
                "PatientLastName": "",
                "PatientFullName": "",
                "ProviderFirstName": "",
                "ProviderLastName": "",
                "AppointmentId": 0,
                "AppointmentDate": "",
                "MessageType": "Transaction of Care",
                "MessageTypeId": 1,
                "EmailBody": "",
                "EmailSubject": "",
                "Status": "",
                "StatusId": 0,
                "ExternalStatus": "",
                "ExternalMessageId": "",
                "CreatedByUser": "",
                "CreatedDate": "",
                "EmailType": "Send",
                "EmailTypeId": 1,
                "DeleteInd": "N",
                "AttachmentsArray": [

                ]
            };
            return obj;
        }




        $scope.getSentPHIEmail = function () {
            var params = {
                "OrganizationId": $scope.sentEMailGetReqObj.OrganizationId,
                "PageSize": $scope.sentEMailGetReqObj.PageSize,
                "PageNumber": $scope.sentEMailGetReqObj.PageNumber,
                "FromDate": $scope.sentEMailGetReqObj.FromDate,
                "ToDate": $scope.sentEMailGetReqObj.ToDate,
                "ProviderId": $scope.sentEMailGetReqObj.ProviderId,
                "PatientId": $scope.sentEMailGetReqObj.PatientId,
                "StatusId": $scope.sentEMailGetReqObj.StatusId,
                "EmailType": $scope.sentEMailGetReqObj.EmailType
            }
            eHnoteDiagnosisDataServices.GetSentEmails(params).then(function (response) {

                console.log(JSON.stringify(response));

                if (response.data.rows.length > 0) {
                    $scope.sentEmailsArray = response.data.rows;

                    if ($scope.sentEmailsArray.length > 0) {
                        restructureSelectedEmail($scope.sentEmailsArray[0]);
                    }

                }
            });
        };


        $scope.openSelectedEmailDetails = function (item) {
            restructureSelectedEmail(item);
        }

        function restructureSelectedEmail(item) {
            $scope.SentEmailIndex = 0;
            $scope.selectedEmailObj = getnewSelectedEmailObj();
            $scope.selectedEmailObj.DirectSecureMessageId = item.DirectSecureMessageId;
            $scope.SentEmailIndex = item.DirectSecureMessageId;
            $scope.selectedEmailObj.AttachmentsArray = item.AttachmentsArray || [];
            $scope.selectedEmailObj.EmailBody = item.EmailBody;
            $scope.selectedEmailObj.EmailSubject = item.EmailSubject;
            $scope.selectedEmailObj.FromEmail = item.FromEmail;
            $scope.selectedEmailObj.ToEmail = item.ToEmail;
            $scope.selectedEmailObj.ExternalMessageId = item.ExternalMessageId;
            $scope.selectedEmailObj.Status = item.Status;
            $scope.selectedEmailObj.ExternalStatus = item.ExternalStatus;
            $scope.selectedEmailObj.CreatedDate = item.CreatedDate;
        }
        // $scope.getSentPHIEmail();


        $scope.viewSentAttachments = function (item) {

            console.log(item);
            window.open(item.S3URL);
        };

        // reconcile logic added

    

        $scope.files = "";


        $scope.FilesObj = {
            "TempImagesArray": [],
            "UserId": $scope.UserId,
            "HospitalId": $scope.HospitalId,

        }

        $scope.selectedImgs = function (files) {



            files = files || [];
            if (files.length > 0) {
                angular.forEach(files, function (item) {
                    // files = item || [];
                    $scope.file = item;
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
                            "S3URL": "",
                            "DeleteInd": false,
                            "DocumentID": 0,
                            "DisplayName": $scope.file.name || "",
                            "FileName": $scope.file.name || "",
                            "DocumentExt": $scope.file.type,

                        };

                        $scope.FilesObj.TempImagesArray.push(obj);


                        angular.element("input[type='file']").val(null);
                        console.log($scope.FilesObj);
                    }
                });
            }

        };


        $scope.reconcileAttachent = function (item) {
            //if (item != null) {
            //    var url = "https://ehnotedevstorage.blob.core.windows.net" + item.S3URL;
            //     $scope.SavePatientData(url);
            //}

            var obj = {
                "AttachmentItem": item,
                "UserId": $scope.UserId,
                "HospitalId": $scope.HospitalId
            }

            var CCDAChartObj = {
                "IsComingform": "CCDA",
                "PatientId": null,
                "AppointmentId": null,
            }
        /*    "templateUrl": "templates/uibpopups/EmailConfigureAttachmentView.html",*/
            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/EmailAttachmentView.html",
                "backdrop": "static",
                "keyboard": false,
                "scope": $scope,
                "windowClass": "modal-full-email",
                //"windowClass": "zindexpopup",
                "resolve": {
                    "AttachmentObj": obj,
                    "CCDAChartObj": CCDAChartObj                   
                },
                "size": "lg",
                "controller": function ($scope, $uibModalInstance, AttachmentObj, alertify, eHnotePatientDataService, CCDAChartObj, eHnoteCacheStorageService, eHnoteMasterDataService, datapersistanceFactory, $location) {

                    console.log(AttachmentObj);

                    
                    $scope.AttachmentObj = AttachmentObj;
                    $scope.CCDAChartObj = CCDAChartObj;
                    $scope.closePopup = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                    $scope.treatmentArray = [];
                    $scope.selectedPatientData = '';
                    $scope.selectedResourcesArray = [
                        {
                            "ResourceTemplateId": 0,
                            "ResourceId": 1,
                            "ResourceName": "Allergies",
                            "CCDaTempArray": [],
                            "DeleteInd": "N",
                            "IsShow": true,
                            "Order": 0
                        },
                        {
                            "ResourceTemplateId": 0,
                            "ResourceId": 2,
                            "CCDaTempArray": [],
                            "ResourceName": "Encounters",
                            "DeleteInd": "N",
                            "IsShow": true,
                            "Order": 0
                        },
                        {
                            "ResourceTemplateId": 0,
                            "ResourceId": 3,
                            "CCDaTempArray": [],
                            "ResourceName": "Medications",
                            "DeleteInd": "N",
                            "IsShow": true,
                            "Order": 0
                        },
                        {
                            "ResourceTemplateId": 0,
                            "ResourceId": 4,
                            "CCDaTempArray": [],
                            "ResourceName": "Immunizations",
                            "DeleteInd": "N",
                            "IsShow": true,
                            "Order": 0
                        },
                        {
                            "ResourceTemplateId": 0,
                            "ResourceId": 5,
                            "CCDaTempArray": [],
                            "ResourceName": "Assessment Plan",
                            "DeleteInd": "N",
                            "IsShow": true,
                            "Order": 0
                        },
                        {
                            "ResourceTemplateId": 0,
                            "ResourceId": 6,
                            "CCDaTempArray": [],
                            "ResourceName": "Careplan",
                            "DeleteInd": "N",
                            "IsShow": true,
                            "Order": 0
                        },
                        {
                            "ResourceTemplateId": 0,
                            "ResourceId": 7,
                            "CCDaTempArray": [],
                            "ResourceName": "Treatmentplan",
                            "DeleteInd": "N",
                            "IsShow": true,
                            "Order": 0
                        },
                        {
                            "ResourceTemplateId": 0,
                            "ResourceId": 8,
                            "CCDaTempArray": [],
                            "ResourceName": "Reason For Referral",
                            "DeleteInd": "N",
                            "IsShow": true,
                            "Order": 0
                        },
                        {
                            "ResourceTemplateId": 0,
                            "ResourceId": 9,
                            "CCDaTempArray": [],
                            "ResourceName": "Problems",
                            "DeleteInd": "N",
                            "IsShow": true,
                            "Order": 0
                        },
                        {
                            "ResourceTemplateId": 0,
                            "ResourceId": 10,
                            "CCDaTempArray": [],
                            "ResourceName": "Procedures",
                            "DeleteInd": "N",
                            "IsShow": true,
                            "Order": 0
                        },
                        {
                            "ResourceTemplateId": 0,
                            "ResourceId": 11,
                            "CCDaTempArray": [],
                            "ResourceName": "Functional Status",
                            "DeleteInd": "N",
                            "IsShow": true,
                            "Order": 0
                        },
                        {
                            "ResourceTemplateId": 0,
                            "ResourceId": 12,
                            "CCDaTempArray": [],
                            "ResourceName": "Congitive Status",
                            "DeleteInd": "N",
                            "IsShow": true,
                            "Order": 0
                        },
                        {
                            "ResourceTemplateId": 0,
                            "ResourceId": 13,
                            "CCDaTempArray": [],
                            "ResourceName": "Results",
                            "DeleteInd": "N",
                            "IsShow": true,
                            "Order": 0
                        },
                        {
                            "ResourceTemplateId": 0,
                            "ResourceId": 14,
                            "CCDaTempArray": [],
                            "ResourceName": "SocialHistory",
                            "DeleteInd": "N",
                            "IsShow": true,
                            "Order": 0
                        },
                        {
                            "ResourceTemplateId": 0,
                            "ResourceId": 15,
                            "CCDaTempArray": [],
                            "ResourceName": "Vital Signs",
                            "DeleteInd": "N",
                            "IsShow": true,
                            "Order": 0
                        },
                        {
                            "ResourceTemplateId": 0,
                            "ResourceId": 16,
                            "CCDaTempArray": [],
                            "ResourceName": "Health Goals",
                            "DeleteInd": "N",
                            "IsShow": true,
                            "Order": 0
                        },
                        {
                            "ResourceTemplateId": 0,
                            "ResourceId": 17,
                            "CCDaTempArray": [],
                            "ResourceName": "Health Concerns",
                            "DeleteInd": "N",
                            "IsShow": true,
                            "Order": 0
                        },
                        {
                            "ResourceTemplateId": 0,
                            "ResourceId": 18,
                            "CCDaTempArray": [],
                            "ResourceName": "Progress Note",
                            "DeleteInd": "N",
                            "IsShow": true,
                            "Order": 0
                        },
                        {
                            "ResourceTemplateId": 0,
                            "ResourceId": 19,
                            "CCDaTempArray": [],
                            "ResourceName": "Physical Note",
                            "DeleteInd": "N",
                            "IsShow": true,
                            "Order": 0
                        },
                        {
                            "ResourceTemplateId": 0,
                            "ResourceId": 20,
                            "CCDaTempArray": [],
                            "ResourceName": "Consultation Note",
                            "DeleteInd": "N",
                            "IsShow": true,
                            "Order": 0
                        },
                        {
                            "ResourceTemplateId": 0,
                            "ResourceId": 21,
                            "CCDaTempArray": [],
                            "ResourceName": "Device/Implant",
                            "DeleteInd": "N",
                            "IsShow": true,
                            "Order": 0
                        },
                        {
                            "ResourceTemplateId": 0,
                            "ResourceId": 22,
                            "CCDaTempArray": [],
                            "ResourceName": "Laboratory Note",
                            "DeleteInd": "N",
                            "IsShow": true,
                            "Order": 0
                        },
                        {
                            "ResourceId": 23,
                            "ResourceTemplateId": 0,
                            "CCDaTempArray": [],
                            "ResourceName": "Procedure Note",
                            "DeleteInd": "N",
                            "IsShow": true,
                            "Order": 0
                        },
                        {
                            "ResourceId": 24,
                            "ResourceTemplateId": 0,
                            "CCDaTempArray": [],
                            "ResourceName": "Discharge Instructions",
                            "DeleteInd": "N",
                            "IsShow": true,
                            "Order": 0
                        }
                    ];

                    $scope.selectedResource = "";
                    $scope.CCDATemp = {
                        "ActiveUserTemplate": [],
                        "MainResourcesArray": $scope.selectedResourcesArray||[],
                    }
                
                    

                    $scope.GetUserCCDATemplateDetails = function () {
                        var obj = {
                            "DoctorId": $scope.AttachmentObj.UserId
                        }
                        eHnoteMainAppointmentService.GetUserCCDATemplateDetails(obj).then(function (resp) {
                            if (resp.data.status == "success") {
                                $scope.TemplatesList = [];
                                $scope.TemplatesList = resp.data.TemplatesList || [];
                                $scope.SavePatientData(AttachmentObj.AttachmentItem.S3URL);
                                if ($scope.TemplatesList.length > 0) {
                                    $scope.CCDATemp.ActiveUserTemplate = [];
                                    angular.forEach($scope.TemplatesList, function (item) {                                      
                                        if (item.ActiveInd) {                                         
                                            $scope.CCDATemp.ActiveUserTemplate = item.ResourcesArray;                                            
                                        } 
                                    });
                                }
                            }
                        });
                    }
                    $scope.GetUserCCDATemplateDetails();

                    $scope.LoadFinaldata = function () {
                        if ($scope.FinalResourceArray.length > 0) {
                            angular.forEach($scope.FinalResourceArray, function (Aitem) {
                                if (Aitem.ResourceId == 1) {
                                    Aitem.CCDaTempArray = $scope.selectedPatientData.AllergyList || [];
                                }
                                else if (Aitem.ResourceId == 2) {
                                    Aitem.CCDaTempArray = $scope.selectedPatientData.EncounterDiagnosis || [];
                                }
                                else if (Aitem.ResourceId == 3) {
                                    Aitem.CCDaTempArray = $scope.selectedPatientData.CurrentSystemicMedications || [];
                                }
                                else if (Aitem.ResourceId == 4) {
                                    Aitem.CCDaTempArray = $scope.selectedPatientData.ImmunizationHistory || [];
                                }
                                else if (Aitem.ResourceId == 5) {
                                    $scope.selectedPatientData.AssessmentNotes = $scope.selectedPatientData.AssessmentNotes || null;
                                    if ($scope.selectedPatientData.AssessmentNotes != null) {
                                        let obj = {
                                            "AssessmentNotes": $scope.selectedPatientData.AssessmentNotes
                                        }
                                        Aitem.CCDaTempArray = [];
                                        Aitem.CCDaTempArray.push(obj);
                                    }
                                }
                                else if (Aitem.ResourceId == 6) {
                                    Aitem.CCDaTempArray = $scope.selectedPatientData.Careplan || [];
                                }
                                else if (Aitem.ResourceId == 7) {
                                    Aitem.CCDaTempArray = $scope.selectedPatientData.Treatmentplan || [];
                                }
                                else if (Aitem.ResourceId == 9) {
                                    Aitem.CCDaTempArray = $scope.selectedPatientData.AssessmentPlan || [];
                                }
                                else if (Aitem.ResourceId == 10) {
                                    Aitem.CCDaTempArray = $scope.selectedPatientData.Procedure || [];
                                }
                                else if (Aitem.ResourceId == 11) {
                                    Aitem.CCDaTempArray = $scope.selectedPatientData.FunctionalHistory || [];
                                }
                                else if (Aitem.ResourceId == 12) {
                                    Aitem.CCDaTempArray = $scope.selectedPatientData.MentalStatus || [];
                                }
                                else if (Aitem.ResourceId == 13) {
                                    Aitem.CCDaTempArray = $scope.selectedPatientData.Results || [];
                                }
                                else if (Aitem.ResourceId == 14) {
                                    Aitem.CCDaTempArray = $scope.selectedPatientData.SocialHistory || [];
                                }
                                else if (Aitem.ResourceId == 15) {
                                    Aitem.CCDaTempArray = $scope.selectedPatientData.Vitals || [];
                                }
                                else if (Aitem.ResourceId == 16) {
                                    Aitem.CCDaTempArray = $scope.selectedPatientData.GoalsList || [];
                                }
                                else if (Aitem.ResourceId == 17) {
                                    Aitem.CCDaTempArray = $scope.selectedPatientData.HealthConcernList || [];
                                }
                                else if (Aitem.ResourceId == 21) {
                                    Aitem.CCDaTempArray = $scope.selectedPatientData.ImplantCCDAList || [];
                                } else {

                                }

                            });
                        }
                    }

                    $scope.SavePatientData = function (url) {
                        eHnoteDiagnosisDataServices.ExtractReconcileDataFromUrl(url, AttachmentObj.HospitalId).then(function (resp) {
                            console.log(JSON.stringify(resp))
                            alertify.success("The XML file has been successfully uploaded and processed.");
                            $scope.selectedPatientData = resp.data;
                            if ($scope.selectedPatientData.PatientList.length > 0) {
                                angular.forEach($scope.selectedPatientData.PatientList, function (item) {
                                    item.IsSelectedPatient = false;
                                });                             
                            }
                            if ($scope.CCDATemp.ActiveUserTemplate.length > 0) {
                                $scope.FinalResourceArray = angular.copy($scope.CCDATemp.ActiveUserTemplate);
                                angular.forEach($scope.FinalResourceArray, function (item) {
                                    item.CCDaTempArray = [];
                                });
                            } else {
                                $scope.FinalResourceArray = angular.copy($scope.selectedResourcesArray);
                            }
                            $scope.LoadFinaldata();
                          
                            //if ($scope.selectedPatientData.AllergyList.length > 0) {
                            //    let filetrarray = $filter("filter")($scope.configurationResourceArray, function (iterator, ind) { return iterator.ResourceId == 1 }) || [];
                            //    if (filetrarray.length>0) {
                            //        filetrarray.CCDaTempArray = $scope.selectedPatientData.AllergyList || [];
                            //    }
                            //}

                        }, function (err) {
                            alertify.error(err.data.ExceptionMessage);
                        });
                    }



                
                   

                    $scope.ChangePatient = function (val, item) {
                        if ($scope.selectedPatientData.PatientList.length > 0) {
                            angular.forEach($scope.selectedPatientData.PatientList, function (item) {
                                item.IsSelectedPatient = false;
                            });
                        }
                        item.IsSelectedPatient = val;
                        if (item.IsSelectedPatient == true) {
                            $scope.selectedPatientData.PatientId = item.PatientId;
                            $scope.selectedPatientData.FirstName = item.PatientFirstName + item.PatientLastName;
                            $scope.selectedPatientData.MobileNumber = item.PatientMobile;
                            $scope.selectedPatientData.Gender = item.PatientGender;
                            $scope.selectedPatientData.DOB = item.PatientDOB;
                            $scope.GetOpthaPatientCaseHistory();
                        } else {
                            $scope.selectedPatientData.PatientId = null;
                        }


                        $scope.selectedPatientData.IsAlleryReconcile = true;
                        $scope.selectedPatientData.IsMedicationReconcile = true;
                        $scope.selectedPatientData.IsProblemReconcile = true;
                    }


               


                    $scope.AddUpdatePatient = function () {

                        //   var patientfullname = $scope.selectedPatientData.PatientName + " " + $scope.selectedPatientData.FamilyName;
                        var params = {
                            "DirectSecureMessageId": $scope.AttachmentObj.AttachmentItem.DirectSecureMessageId,
                            "PatientId": $scope.selectedPatientData.PatientId,
                            "FirstName": $scope.selectedPatientData.FirstName,
                            "MiddleName": $scope.selectedPatientData.MiddleName,
                            "LastName": $scope.selectedPatientData.LastName,
                            "MobileNumber": $scope.selectedPatientData.MobileNumber,
                            "HomeNumber": $scope.selectedPatientData.HomeNumber,
                            "HomeAreaCode": $scope.selectedPatientData.HomeAreaCode,
                            "HomeCountryCode": $scope.selectedPatientData.HomeCountryCode,
                            "OfficeAreaCode": $scope.selectedPatientData.OfficeAreaCode,
                            "OfficeCountryCode": $scope.selectedPatientData.OfficeCountryCode,
                            "OfficeNumber": $scope.selectedPatientData.OfficeNumber,
                            "Gender": $scope.selectedPatientData.Gender,
                            "DOB": $scope.selectedPatientData.DOB,
                            "UserId": $scope.AttachmentObj.UserId,
                            "HospitalId": $scope.AttachmentObj.HospitalId,
                            "PatientAddress": {
                                "Address1": $scope.selectedPatientData.PatientAddress.Address1,
                                "CityId": null,
                                "CityName": $scope.selectedPatientData.PatientAddress.CityName,
                                "StateId": null,
                                "StateName": $scope.selectedPatientData.PatientAddress.StateName,
                                "ZipCode": $scope.selectedPatientData.PatientAddress.ZipCode,
                                "CountryId": null,
                                "CountryName": $scope.selectedPatientData.PatientAddress.CountryName,
                            },
                        }

                        eHnoteMainAppointmentService.CCDAAddUpdatePatient(params).then(function (resp) {
                            if (resp.data.status == "success") {
                                alertify.success("Patient Added Successfully");
                                $scope.selectedPatientData.PatientId = resp.data.PatientId;
                                $scope.selectedPatientData.PatientDisplayId = resp.data.PatientDisplayId;
                            }
                        }, function (err) {
                            alertify.error("Getting Failed");
                        });
                    }


                    $scope.ExistingPatient = function () {
                        $scope.AddUpdatePatient();
                    }

                    $scope.ChartObj = {
                        "IsMergeApptview": false,
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


                        if ($scope.currentdate === $scope.ChartObj.AppointmentDate) {
                            $scope.IsAppointmentToday = true;
                        } else {
                            $scope.IsAppointmentToday = false;
                        }
                    }

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

                                        $scope.CCDAChartObj.AppointmentId = item.AppointmentId;
                                        $scope.CCDAChartObj.PatientId = item.PatientArray[0].PatientId;
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

                            }
                        }, function (err) {
                            alertify.error(err.data.ExceptionMessage);
                        });
                    };


                    $scope.GetOpthaPatientCaseHistory = function () {
                        $scope.CaseHistory = [];
                        var AppointmentTypeIds = null;
                        AppointmentTypeIds = "1,2,3,5,6,8,9,10,4,7,14";


                        var object = {
                            "PatientID": $scope.selectedPatientData.PatientId,
                            "HospitalID": AttachmentObj.HospitalId,
                            "AppointmentTypeIds": AppointmentTypeIds
                        };
                        eHnotePatientDataService.GetAppointmentsForCaseHistory(object).then(function (resp) {
                            if (resp.data !== undefined) {
                                if (resp.data.length > 0) {
                                    $scope.CaseHistory = resp.data;
                                    var ConsultationId = resp.data[0].ConsultationId || 0;
                                    var AppointmentId = resp.data[0].AppointmentId || 0;
                                    $scope.AppointmentTypeId = resp.data[0].AppointmentTypeId || 0;
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


                    $scope.AddUpdateBookAppointment = function () {
                        $scope.CurrentTime = $filter("date")(new Date(), "HH:mm:ss");
                        var obj = {
                            "AppointmentId": null,
                            //"PatientId": null,
                            "DoctorID": $scope.AttachmentObj.UserId || null,
                            "UserId": $scope.AttachmentObj.UserId,
                            "HospitalId": $scope.AttachmentObj.HospitalId,
                            "IsCheckedIn": 1,
                            "VisitTypeId": 10,
                            "VisitReason": 4174,
                            "SubSpecializationId": 11,
                            "ConfirmationStatusId": 2,
                            "ConsultationDt": "",
                            "AppointmentStatus": "D",
                            "CurrentTime": $scope.CurrentTime,
                            "StartTime": "19:00",
                            "EndTime": "19:15",
                        }


                        $scope.selectedPatientData.DirectSecureMessageId = $scope.AttachmentObj.AttachmentItem.DirectSecureMessageId;

                        $scope.selectedPatientData.IsAlleryReconcile = true;
                        $scope.selectedPatientData.IsMedicationReconcile = true;
                        $scope.selectedPatientData.IsProblemReconcile = true;


                        $scope.selectedPatientData.UserId = $scope.AttachmentObj.UserId;
                        $scope.selectedPatientData.HospitalId = $scope.AttachmentObj.HospitalId;
                        $scope.selectedPatientData.DoctorID = obj.DoctorID;
                        $scope.selectedPatientData.IsCheckedIn = obj.IsCheckedIn;
                        $scope.selectedPatientData.VisitTypeId = obj.VisitTypeId;
                        $scope.selectedPatientData.VisitReason = obj.VisitReason;
                        $scope.selectedPatientData.SubSpecializationId = obj.SubSpecializationId;
                        $scope.selectedPatientData.ConfirmationStatusId = obj.ConfirmationStatusId;
                        //  $scope.selectedPatientData.ConsultationDt = obj.ConsultationDt;
                        $scope.selectedPatientData.AppointmentStatus = obj.AppointmentStatus;
                        $scope.selectedPatientData.CurrentTime = obj.CurrentTime;
                        //$scope.selectedPatientData.StartTime = obj.StartTime;
                        //$scope.selectedPatientData.EndTime = obj.EndTime;

                        $scope.selectedPatientData.MergeAppointmentId = $scope.ChartObj.AppointmentId || null;

                        if ($scope.selectedPatientData.ApptStartTime != '') {
                            $scope.selectedPatientData.StartTime = $scope.selectedPatientData.ApptStartTime || '19:00';
                        }
                        if ($scope.selectedPatientData.ApptEndTime != '') {
                            $scope.selectedPatientData.EndTime = $scope.selectedPatientData.ApptEndTime || '19:15';
                        }

                        if ($scope.selectedPatientData.ImmunizationHistory.length > 0) {
                            var filetrODarray = $filter("filter")($scope.selectedPatientData.ImmunizationHistory, function (iterator, ind) { return iterator.HistoryName != null }) || [];
                            $scope.selectedPatientData.ImmunizationHistory = filetrODarray;
                        }
                        if ($scope.selectedPatientData.SocialHistory.length > 0) {
                            var filetrODarray = $filter("filter")($scope.selectedPatientData.SocialHistory, function (iterator, ind) { return iterator.HistoryName != null }) || [];
                            $scope.selectedPatientData.SocialHistory = filetrODarray;
                        }
                        if ($scope.selectedPatientData.MedicationList.length > 0) {
                            var filetrMedicineNamearray = $filter("filter")($scope.selectedPatientData.MedicationList, function (iterator, ind) { return iterator.PlanName != null }) || [];
                            $scope.selectedPatientData.MedicationList = filetrMedicineNamearray;
                        }
                        if ($scope.selectedPatientData.Procedure.length > 0) {
                            var filetrProcedurearray = $filter("filter")($scope.selectedPatientData.Procedure, function (iterator, ind) { return iterator.Description != null }) || [];
                            $scope.selectedPatientData.Procedure = filetrProcedurearray;
                        }
                        if ($scope.selectedPatientData.EncounterDiagnosis.length > 0) {
                            var filetrProcedurearray = $filter("filter")($scope.selectedPatientData.EncounterDiagnosis, function (iterator, ind) { return iterator.EncounterName != null }) || [];
                            $scope.selectedPatientData.EncounterDiagnosis = filetrProcedurearray;
                        }

                        if ($scope.selectedPatientData.ImplantsList.length > 0) {
                            angular.forEach($scope.selectedPatientData.ImplantsList, function (item) {
                                $scope.Implantsobj = {
                                    "PatientImplantId": null,
                                    "DateOfImplant": item.DateOfImplant,
                                    "UDI": item.UDI || '',
                                    "DeviceType": '',
                                    "LotNumber": '',
                                    "Location": '',
                                    "OwnerId": '',
                                    "OwnerName": '',
                                    "ModelType": '',
                                    "DeleteInd": 'N',
                                    "ManufacturerName": item.CompanyName,
                                    "ManufactureDate": item.ManufacturingDate,
                                    "DeviceName": item.BrandName,
                                    "DeviceTypeName": "other",
                                    "Snomed": item.Snomed,
                                    "DI": item.DI,
                                    "DeviceDescription": item.DeviceDescription || '',
                                    "GMDNPTName": item.GmdnPTName,
                                    "GMDNPTDefinition": item.GmdnPTDefinition,
                                    "DeviceIDIssuingAgency": item.IssuingAgency,
                                    "SerialNumber": item.SerialNumber,
                                    "ModelNumber": item.VersionModelNumber,
                                    "MRISafetyStatus": item.MRISafetyStatus,
                                    "ProductBatchNo": item.ProductBatchNo,
                                    "ProductSerialNo": item.ProductSerialNo,
                                    "ExpiryDate": item.ExpirationDate,
                                    "Entered": item.Entered,
                                    "ProviderId": item.ProviderId || '',
                                    "StaffId": item.StaffId || '',
                                    "Comments": item.Comments || '',
                                    "StatusId": item.StatusId || '',

                                }
                                $scope.selectedPatientData.ImplantCCDAList.push($scope.Implantsobj);
                            })
                        }

                        eHnoteMainAppointmentService.CCDAAddUpdateAppointmentWithConsultation($scope.selectedPatientData).then(function (resp) {
                            if (resp.data.status == "Success") {

                                let AppointmentId = resp.data.AppointmentId;
                                let ConsultationId = resp.data.ConsultationId;

                                if ($scope.selectedPatientData.MergeAppointmentId != null) {
                                    $scope.ChartObj.IsMergeApptview = true;
                                    $scope.GetPatientAppointmenthistroy(ConsultationId, AppointmentId);
                                }

                                alertify.success("Appointment Added Successfully");
                                $uibModalInstance.dismiss("cancel");

                               

                                $scope.FilesObj = {
                                    "TempImagesArray": [],
                                    "UserId": $scope.UserId,
                                    "HospitalId": $scope.HospitalId,

                                }
                                $scope.selectedPatientData = "";
                            } else {
                                alertify.error("Appointment Already Exists For This Patient");
                            }
                        }, function (err) {
                            alertify.error("Getting Failed");
                        })
                    }




                    $scope.UpdateMergeandview = function () {

                        $scope.expapptdoctor = "";
                 


                        var filetr1array = $filter("filter")($scope.treatmentArray[0].CCDADocumentDetails, function (iterator, ind) { return iterator.TypeId == 2 }) || [];
                        if (filetr1array.length > 0) {
                            $scope.expapptdoctor = filetr1array[0].FirstName + filetr1array[0].LastName;
                        }
                        $scope.ChartObj.IsMergeApptview = true;
                        if ($scope.treatmentArray[0].AllergyItems.length > 0) {
                            angular.forEach($scope.treatmentArray[0].AllergyItems, function (item) {
                                var filetrarray = $filter("filter")($scope.selectedPatientData.AllergyList, function (iterator, ind) { return iterator.AllergyName == item.AllergyName }) || [];

                                if (filetrarray.length == 0) {
                                    let obj = {
                                        "AllergyId": item.AllergyId,
                                        "AllergyName": item.AllergyName,
                                        "EXpApptDoctor": $scope.expapptdoctor,
                                        "ModifiedDt": item.ModifiedDt,
                                        "isduplicatrRecd": false,
                                        "DeleteInd": null,
                                        "ObservationCode": null,
                                        "ObservationCodeSystem": null,
                                        "ObservationCodeSystemName": null,
                                        "ObservationName": null,
                                        "PatientDetailId": null,
                                        "ReactionId": null,
                                        "ReactionName": item.ReactionName,
                                        "SeverityId": null,
                                        "SeverityName": item.SeverityName,
                                        "StatusId": null,
                                        "StatusName": item.StatusName,
                                        "code": null,
                                        "codeSystem": null,
                                        "codeSystemName": null,
                                    }

                                    $scope.selectedPatientData.AllergyList.push(obj);
                                }
                                else {
                                    let obj = {
                                        "AllergyId": item.AllergyId,
                                        "AllergyName": item.AllergyName,
                                        "EXpApptDoctor": $scope.expapptdoctor,
                                        "ModifiedDt": item.ModifiedDt,
                                        "isduplicatrRecd": true,
                                        "DeleteInd": null,
                                        "ObservationCode": null,
                                        "ObservationCodeSystem": null,
                                        "ObservationCodeSystemName": null,
                                        "ObservationName": null,
                                        "PatientDetailId": null,
                                        "ReactionId": null,
                                        "ReactionName": item.ReactionName,
                                        "SeverityId": null,
                                        "SeverityName": item.SeverityName,
                                        "StatusId": null,
                                        "StatusName": item.StatusName,
                                        "code": null,
                                        "codeSystem": null,
                                        "codeSystemName": null,
                                    }

                                    $scope.selectedPatientData.AllergyList.push(obj)
                                }
                          




                            });

                        }

                        if ($scope.treatmentArray[0].CurrentSystemicMedicationsHistory.length > 0) {
                            angular.forEach($scope.treatmentArray[0].CurrentSystemicMedicationsHistory, function (item) {
                                var filetrarray = $filter("filter")($scope.selectedPatientData.CurrentSystemicMedications, function (iterator, ind) { return iterator.MedicineName == item.MedicineName }) || [];

                                if (filetrarray.length == 0) {
                                    let obj = {
                                        "MedicineId": item.MedicineId,
                                        "MedicineName": item.MedicineName,
                                        "EXpApptDoctor": $scope.expapptdoctor,
                                        "ModifiedDt": item.ModifiedDt,
                                        "isduplicatrRecd": false,
                                        "DeleteInd": "N",
                                        "Directions": "",
                                        "EffectiveDate": item.StartDate,
                                        "Indications": "",
                                        "PatientInstructions": "",
                                        "PatientMedicineId": "",
                                        "RouteCode": "",
                                        "RouteCodeSystem": "",
                                        "RouteCodeSystemName": "",
                                        "RouteName": "",
                                        "SNOMED": "",
                                        "StatusName": "",
                                        "doseQuantity": item.Quantity,
                                        "manufacturedMaterialCode": "",
                                        "manufacturedMaterialCodeSystem": "",

                                    }


                                    $scope.selectedPatientData.CurrentSystemicMedications.push(obj);
                                }
                                else {
                                    let obj = {
                                        "MedicineId": item.MedicineId,
                                        "MedicineName": item.MedicineName,
                                        "EXpApptDoctor": $scope.expapptdoctor,
                                        "ModifiedDt": item.ModifiedDt,
                                        "isduplicatrRecd": true,
                                        "DeleteInd": "N",
                                        "Directions": "",
                                        "EffectiveDate": item.StartDate,
                                        "Indications": "",
                                        "PatientInstructions": "",
                                        "PatientMedicineId": "",
                                        "RouteCode": "",
                                        "RouteCodeSystem": "",
                                        "RouteCodeSystemName": "",
                                        "RouteName": "",
                                        "SNOMED": "",
                                        "StatusName": "",
                                        "doseQuantity": item.Quantity,
                                        "manufacturedMaterialCode": "",
                                        "manufacturedMaterialCodeSystem": "",

                                    }
                                    $scope.selectedPatientData.CurrentSystemicMedications.push(obj);
                                }
                              
                           

                            });

                        }

                        if ($scope.treatmentArray[0].AssessmentPlan.length > 0) {
                            angular.forEach($scope.treatmentArray[0].AssessmentPlan, function (item) {
                                if (item.Type == "General") {
                                    var filetrarray = $filter("filter")($scope.selectedPatientData.AssessmentPlan, function (iterator, ind) { return iterator.DiagnosisName == item.DiagnosisName }) || [];

                                    if (filetrarray.length == 0) {
                                        let obj = {
                                            "AssessmentPlanId": item.AssessmentPlan.AssessmentPlanId,
                                            "ConsultationDiagnosisId": item.ConsultationDiagnosisId,
                                            "DiagnosisName": item.DiagnosisName,
                                            "EXpApptDoctor": $scope.expapptdoctor,
                                            "ModifiedDt": item.ModifiedDt,
                                            "isduplicatrRecd": false,
                                            "DeleteInd": "N",
                                            "FromDate": item.OnSetDate,
                                            "ObservationCode": "",
                                            "ObservationCodeSystem": "",
                                            "ObservationCodeSystemName": "",
                                            "ProblemCode": item.SnomedCode,
                                            "ProblemCodeSystem": "",
                                            "ProblemCodeSystemName": "",
                                            "SNOMEDCode": item.SnomedCode,
                                            "StatusId": "",
                                            "StatusName": item.StatusList[0].DiagnosisStatus,
                                            "ToDate": "",
                                        }

                                        $scope.selectedPatientData.AssessmentPlan.push(obj);
                                    }
                                    else {
                                        let obj = {
                                            "AssessmentPlanId": item.AssessmentPlan.AssessmentPlanId,
                                            "ConsultationDiagnosisId": item.ConsultationDiagnosisId,
                                            "DiagnosisName": item.DiagnosisName,
                                            "ModifiedDt": item.ModifiedDt,
                                            "EXpApptDoctor": $scope.expapptdoctor,
                                            "isduplicatrRecd": true,
                                            "DeleteInd": "N",
                                            "FromDate": item.OnSetDate,
                                            "ObservationCode": "",
                                            "ObservationCodeSystem": "",
                                            "ObservationCodeSystemName": "",
                                            "ProblemCode": item.SnomedCode,
                                            "ProblemCodeSystem": "",
                                            "ProblemCodeSystemName": "",
                                            "SNOMEDCode": item.SnomedCode,
                                            "StatusId": "",
                                            "StatusName": item.StatusList[0].DiagnosisStatus,
                                            "ToDate": "",
                                        }

                                        $scope.selectedPatientData.AssessmentPlan.push(obj);
                                    }
                                }

                               

                            });

                        }

                        if ($scope.selectedPatientData.IsAlleryReconcile == false) {
                            if ($scope.selectedPatientData.AllergyList.length > 0) {
                                angular.forEach($scope.selectedPatientData.AllergyList, function (item) {
                                    item.IsAlleryReconcile = false;
                                });
                            }
                        }
                        if ($scope.selectedPatientData.IsAlleryReconcile == true) {
                            if ($scope.selectedPatientData.AllergyList.length > 0) {
                                angular.forEach($scope.selectedPatientData.AllergyList, function (item) {
                                    item.IsAlleryReconcile = true;
                                });
                            }
                        }

                        if ($scope.selectedPatientData.IsMedicationReconcile == true) {
                            if ($scope.selectedPatientData.CurrentSystemicMedications.length > 0) {
                                angular.forEach($scope.selectedPatientData.CurrentSystemicMedications, function (item) {
                                    item.IsMedicationReconcile = true;
                                });
                            }
                        }
                        if ($scope.selectedPatientData.IsProblemReconcile == true) {
                            if ($scope.selectedPatientData.AssessmentPlan.length > 0) {
                                angular.forEach($scope.selectedPatientData.AssessmentPlan, function (item) {
                                    item.IsProblemReconcile = true;
                                });
                            }
                        }

                        $scope.LoadFinaldata();
                    }

                    $scope.Changetype = function (item) {
                        if (item.ResourceId == 1) {
                            $scope.selectedPatientData.IsAlleryReconcile = item.IsAlleryReconcile;
                        }
                        else if (item.ResourceId == 3) {
                            $scope.selectedPatientData.IsMedicationReconcile = item.IsMedicationReconcile;
                        }
                        else if (item.ResourceId == 9) {
                            $scope.selectedPatientData.IsProblemReconcile = item.IsProblemReconcile;
                        } else {
             
                        }
                    }

                    $scope.AddUpdateMergeBookAppointment = function () {
                        $scope.CurrentTime = $filter("date")(new Date(), "HH:mm:ss");
                        var obj = {
                            "AppointmentId": null,
                            //"PatientId": null,
                            "DoctorID": $scope.AttachmentObj.UserId || null,
                            "UserId": $scope.AttachmentObj.UserId,
                            "HospitalId": $scope.AttachmentObj.HospitalId,
                            "IsCheckedIn": 1,
                            "VisitTypeId": 10,
                            "VisitReason": 4174,
                            "SubSpecializationId": 11,
                            "ConfirmationStatusId": 2,
                            "ConsultationDt": "",
                            "AppointmentStatus": "D",
                            "CurrentTime": $scope.CurrentTime,
                            "StartTime": "19:00",
                            "EndTime": "19:15",
                        }

                        $scope.selectedPatientData.DirectSecureMessageId = $scope.AttachmentObj.AttachmentItem.DirectSecureMessageId;
                        $scope.selectedPatientData.MergeAppointmentId = $scope.ChartObj.AppointmentId || null;

                        $scope.selectedPatientData.UserId = $scope.AttachmentObj.UserId;
                        $scope.selectedPatientData.HospitalId = $scope.AttachmentObj.HospitalId;
                        $scope.selectedPatientData.DoctorID = obj.DoctorID;
                        $scope.selectedPatientData.IsCheckedIn = obj.IsCheckedIn;
                        $scope.selectedPatientData.VisitTypeId = obj.VisitTypeId;
                        $scope.selectedPatientData.VisitReason = obj.VisitReason;
                        $scope.selectedPatientData.SubSpecializationId = obj.SubSpecializationId;
                        $scope.selectedPatientData.ConfirmationStatusId = obj.ConfirmationStatusId;
                        //  $scope.selectedPatientData.ConsultationDt = obj.ConsultationDt;
                        $scope.selectedPatientData.AppointmentStatus = obj.AppointmentStatus;
                        $scope.selectedPatientData.CurrentTime = obj.CurrentTime;
                        //$scope.selectedPatientData.StartTime = obj.StartTime;
                        //$scope.selectedPatientData.EndTime = obj.EndTime;


                        //if ($scope.selectedPatientData.MergeAppointmentId !=null) {
                        //    $scope.selectedPatientData.ConsultationDt = $filter("date")(new Date(), "yyyy-MM-dd")
                        //}

                        if ($scope.selectedPatientData.ApptStartTime != '') {
                            $scope.selectedPatientData.StartTime = $scope.selectedPatientData.ApptStartTime || '19:00';
                        }
                        if ($scope.selectedPatientData.ApptEndTime != '') {
                            $scope.selectedPatientData.EndTime = $scope.selectedPatientData.ApptEndTime || '19:15';
                        }

                        if ($scope.selectedPatientData.AllergyList.length > 0) {
                            var filetrODarray = $filter("filter")($scope.selectedPatientData.AllergyList, function (iterator, ind) { return iterator.AllergyId == null }) || [];
                            $scope.selectedPatientData.AllergyList = filetrODarray;
                        }
                        if ($scope.selectedPatientData.CurrentSystemicMedications.length > 0) {
                            var filetrODarray = $filter("filter")($scope.selectedPatientData.CurrentSystemicMedications, function (iterator, ind) { return iterator.MedicineId == null }) || [];
                            $scope.selectedPatientData.CurrentSystemicMedications = filetrODarray;
                        }
                        if ($scope.selectedPatientData.AssessmentPlan.length > 0) {
                            var filetrODarray = $filter("filter")($scope.selectedPatientData.AssessmentPlan, function (iterator, ind) { return iterator.ConsultationDiagnosisId == null }) || [];
                            $scope.selectedPatientData.AssessmentPlan = filetrODarray;
                        }


                        if ($scope.selectedPatientData.ImmunizationHistory.length > 0) {
                            var filetrODarray = $filter("filter")($scope.selectedPatientData.ImmunizationHistory, function (iterator, ind) { return iterator.HistoryName != null }) || [];
                            $scope.selectedPatientData.ImmunizationHistory = filetrODarray;
                        }
                        if ($scope.selectedPatientData.SocialHistory.length > 0) {
                            var filetrODarray = $filter("filter")($scope.selectedPatientData.SocialHistory, function (iterator, ind) { return iterator.HistoryName != null }) || [];
                            $scope.selectedPatientData.SocialHistory = filetrODarray;
                        }
                        if ($scope.selectedPatientData.MedicationList.length > 0) {
                            var filetrMedicineNamearray = $filter("filter")($scope.selectedPatientData.MedicationList, function (iterator, ind) { return iterator.PlanName != null }) || [];
                            $scope.selectedPatientData.MedicationList = filetrMedicineNamearray;
                        }
                        if ($scope.selectedPatientData.Procedure.length > 0) {
                            var filetrProcedurearray = $filter("filter")($scope.selectedPatientData.Procedure, function (iterator, ind) { return iterator.Description != null }) || [];
                            $scope.selectedPatientData.Procedure = filetrProcedurearray;
                        }
                        if ($scope.selectedPatientData.EncounterDiagnosis.length > 0) {
                            var filetrProcedurearray = $filter("filter")($scope.selectedPatientData.EncounterDiagnosis, function (iterator, ind) { return iterator.EncounterName != null }) || [];
                            $scope.selectedPatientData.EncounterDiagnosis = filetrProcedurearray;
                        }

                        if ($scope.selectedPatientData.ImplantsList.length > 0) {
                            angular.forEach($scope.selectedPatientData.ImplantsList, function (item) {
                                $scope.Implantsobj = {
                                    "PatientImplantId": null,
                                    "DateOfImplant": item.DateOfImplant,
                                    "UDI": item.UDI || '',
                                    "DeviceType": '',
                                    "LotNumber": '',
                                    "Location": '',
                                    "OwnerId": '',
                                    "OwnerName": '',
                                    "ModelType": '',
                                    "DeleteInd": 'N',
                                    "ManufacturerName": item.CompanyName,
                                    "ManufactureDate": item.ManufacturingDate,
                                    "DeviceName": item.BrandName,
                                    "DeviceTypeName": "other",
                                    "Snomed": item.Snomed,
                                    "DI": item.DI,
                                    "DeviceDescription": item.DeviceDescription || '',
                                    "GMDNPTName": item.GmdnPTName,
                                    "GMDNPTDefinition": item.GmdnPTDefinition,
                                    "DeviceIDIssuingAgency": item.IssuingAgency,
                                    "SerialNumber": item.SerialNumber,
                                    "ModelNumber": item.VersionModelNumber,
                                    "MRISafetyStatus": item.MRISafetyStatus,
                                    "ProductBatchNo": item.ProductBatchNo,
                                    "ProductSerialNo": item.ProductSerialNo,
                                    "ExpiryDate": item.ExpirationDate,
                                    "Entered": item.Entered,
                                    "ProviderId": item.ProviderId || '',
                                    "StaffId": item.StaffId || '',
                                    "Comments": item.Comments || '',
                                    "StatusId": item.StatusId || '',

                                }
                                $scope.selectedPatientData.ImplantCCDAList.push($scope.Implantsobj);
                            })
                        }

                        eHnoteMainAppointmentService.CCDAAddUpdateAppointmentWithConsultation($scope.selectedPatientData).then(function (resp) {
                            if (resp.data.status == "Success") {
                                $scope.ChartObj.IsMergeApptview = false;
                                $scope.treatmentArray = [];
                                alertify.success("Appointment Added Successfully");
                               // $uibModalInstance.dismiss("cancel");
                                let AppointmentId = resp.data.AppointmentId;
                                let ConsultationId = resp.data.ConsultationId;
                                let PatientId = resp.data.PatientId;

                                $scope.CCDAChartObj.AppointmentId = AppointmentId;
                                $scope.CCDAChartObj.PatientId = PatientId;

                                $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorageStructure();
                                $scope.cacheStorageItem.PatientID = $scope.CCDAChartObj.PatientId;
                                $scope.cacheStorageItem.patientid = $scope.CCDAChartObj.PatientId;
                                eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
                                eHnoteMasterDataService.addPatientDetailsforBarcode('');
                                datapersistanceFactory.set("CCDASeletedPatient", $scope.CCDAChartObj);
                                $location.url("/profile");
                                $uibModalInstance.close();
                                $scope.FilesObj = {
                                    "TempImagesArray": [],
                                    "UserId": $scope.UserId,
                                    "HospitalId": $scope.HospitalId,

                                }
                                $scope.selectedPatientData = "";
                            } else {
                                alertify.error("Appointment Already Exists For This Patient");
                            }
                        }, function (err) {
                            alertify.error("Getting Failed");
                        })
                    }


                    $scope.openCCDATemplateCreationPop = function () {

                        var obj = {
                            "UserId": $scope.AttachmentObj.UserId,
                            "HospitalId": $scope.AttachmentObj.HospitalId
                        }
                        $scope.mInstanceAdd = $uibModal.open({
                            "templateUrl": "templates/uibpopups/CCDAResourceManagementPopup.html",
                            "backdrop": "static",
                            "scope": $scope,
                            "keyboard": false,
                            "size": "md",
                            "windowClass": "ccaTemplates",
                            "resolve": {
                                "mainObject": function () { return obj; }
                            },
                            "controller": "CCDAResourceConfiguration"
                        });
                        $scope.mInstanceAdd.result.then(function (resp) {
                            console.log(resp);
                            $scope.GetUserCCDATemplateDetails();

                        }, function (cancel) {
                        });
                    }
                }
            });

            $scope.mInstanceAdd.result.then(function (result) {

                $uibModalInstance.dismiss("cancel");
                console.log(result);
            }, function (error) {
                console.log(error);
            });
        }


        $scope.reconcileAttachentAzipped = function (mitem,item) {
            console.log(mitem);

            $scope.reconcileAttachent(item, mitem.OriginalReceivedS3URL);
        }


        $scope.justvalidate = function (item, MainObj) {

          



            var params = {
                "UserId": $scope.UserId,
                "ccdaValidationId": 0,
                "validationObjective": "C-CDA_IG_Plus_Vocab",
                "referenceFileName": "NT_Bad_PatientPreviousName_r11_v2.xml",
                "severityLevel": "ERROR",
                "curesUpdate": "true",
                "svap2022": "false",
                "svap2023": "false",
                "ccdaFileName": "",
                "status": "completed",
                "S3Url": item.S3URL,
                "ccdaDocumentType": "",
                "ccdaVersion": "",
                "AppointmentId": 0,
                "PatientId": 0,
                "HospitalId": $scope.HospitalId,
                "DirectSecureMessageId": MainObj.DirectSecureMessageId,
                "FileId": item.FileId,
                "CCDAValidationDetails": [

                ]

            };

          

            eHnoteMainAppointmentService.CCDAValidationandGenerate(params).then(function (resp) {
                console.log(resp);
                if (resp.data.status == "success") {
                    $scope.errorsDetails = resp.data.CCDAValidationDetails || [];

                    var obj = {
                        "AttachmentItem": item,
                        "UserId": $scope.UserId,
                        "HospitalId": $scope.HospitalId,
                        "DirectSecureMessageId": MainObj.DirectSecureMessageId,
                        "FileId": item.FileId,
                        "serviceError": resp.data.serviceError,
                        "serviceErrorMessage": resp.data.serviceErrorMessage,
                        "errorsDetails": $scope.errorsDetails,
                        "showConfigure":false
                    }



                    $scope.mInstanceAdd = $uibModal.open({
                        "templateUrl": "templates/uibpopups/ValidatationCCDAView.html",
                        "backdrop": "static",
                        "keyboard": false,
                        "windowClass": "modal-full-email",
                        //"windowClass": "zindexpopup",
                        "resolve": {
                            "AttachmentObj": obj
                        },
                        "size": "lg",
                        "controller": function ($scope, $uibModalInstance, $sce, AttachmentObj, alertify, eHnotePatientDataService, downloadpdfService) {

                            console.log(AttachmentObj);
                            $scope.totalErrorsCount = 0;
                            $scope.AttachmentObj = AttachmentObj;
                            $scope.closePopup = function () {
                                $uibModalInstance.dismiss("cancel");
                            };

                            $scope.ZerroErrorsWithParseError = false;
                            $scope.staticAccordianArray = [{
                                "isaccordianOpen": true,
                                "Name": "CCDA",
                                "Id": 1,
                            },
                            {
                                "isaccordianOpen": true,
                                "Name": "Errors",
                                "Id": 2,
                            }]

                            $scope.ccdaIframeUrl = $sce.trustAsResourceUrl($scope.AttachmentObj.AttachmentItem
                                .S3URL);
                            $scope.errorsDetails = $scope.AttachmentObj.errorsDetails || [];
                            $scope.parseFailedErrorMsg = "";
                            $scope.parseFailedErrorMsgDescription = "";

                            if ($scope.AttachmentObj.serviceError == "True" || $scope.AttachmentObj.serviceError == "true" || $scope.AttachmentObj.serviceError == true) {
                                $scope.ZerroErrorsWithParseError = true;
                                $scope.parseFailedErrorMsg = "";
                                $scope.parseFailedErrorMsgDescription = $scope.AttachmentObj.serviceErrorMessage;


                            }

                            if ($scope.errorsDetails.length > 0) {
                                $scope.totalErrorsCount = $scope.errorsDetails.length;
                            }


                            //$scope.errorsDetails = [
                            //    {
                            //        "ErrorDescription": "Consol Problem Section SHALL contain exactly one [1..1] code (CONF:15409)/@code='11450-4' Problem List (CodeSystem: 2.16.840.1.113883.6.1 LOINC) (CONF:15410)",
                            //        "ErrorPath": "/ClinicalDocument/component/structuredBody/component[7]/section",
                            //        "LineNumber": 10
                            //    },
                            //    {
                            //        "ErrorDescription": "Consol Problem Concern Act SHALL contain exactly one [1..1] statusCode (Concern Status), which SHALL be selected from ValueSet ProblemActStatusCode 2.16.840.1.113883.11.20.9.19 STATIC 2011-09-09 (CONF:9029)",
                            //        "ErrorPath": "/ClinicalDocument/component/structuredBody/component[7]/section",
                            //        "LineNumber": 872
                            //    }
                            //]



                            $scope.GetCCDAXmlData = function () {
                                //var abc = url;
                                //window.open(abc);


                                var a = document.createElement("a");
                                downloadpdfService.downloadPdf($scope.AttachmentObj.AttachmentItem.S3URL).then(function (result) {
                                    if ($scope.AttachmentObj.AttachmentItem.FileExt === "application/pdf" || $scope.AttachmentObj.AttachmentItem.FileExt === ".pdf") {
                                        var file = new Blob([result.data], { type: 'application/pdf' });
                                    }
                                    if ($scope.AttachmentObj.AttachmentItem.FileExt === "image/jpeg" || $scope.AttachmentObj.AttachmentItem.FileExt === "image/jpg" || $scope.AttachmentObj.AttachmentItem.FileExt === "image/png" || $scope.AttachmentObj.AttachmentItem.FileExt === ".png" || $scope.AttachmentObj.AttachmentItem.FileExt === ".jpg") {
                                        var file = new Blob([result.data], { type: 'image/png' });
                                    }

                                    if ($scope.AttachmentObj.AttachmentItem.FileExt === ".XML" || $scope.AttachmentObj.AttachmentItem.FileExt === ".xml") {
                                        var file = new Blob([result.data], { type: 'application/xml' });
                                    }
                                    var fileURL = window.URL.createObjectURL(file);
                                    a.href = fileURL;
                                    a.download = $scope.AttachmentObj.AttachmentItem.FileName;
                                    a.click();
                                    a.remove();
                                }, function (err) {

                                    console.log(err);
                                });
                            }


                           


                        }
                    });

                    $scope.mInstanceAdd.result.then(function (result) {


                        console.log(result);
                    }, function (error) {
                        console.log(error);
                    });

                } else {
                    alertify.error("Some Error Occured");
                }
            }, function (err) {
                alertify.error("Getting Failed");
            })






        }        


        $scope.validateandView = function (item, MainObj, ExtractFileId) {


            var ExtractFileId = ExtractFileId || 0;


            var params = {
                "UserId": $scope.UserId,
                "ccdaValidationId": 0,
                "validationObjective": "C-CDA_IG_Plus_Vocab",
                "referenceFileName": "NT_Bad_PatientPreviousName_r11_v2.xml",
                "severityLevel": "ERROR",
                "curesUpdate": "true",
                "svap2022": "false",
                "svap2023": "false",
                "ccdaFileName": "",
                "status": "completed",
                "S3Url": item.S3URL,
                "OriginalReceivedS3URL": item.OriginalReceivedS3URL,
                "ccdaDocumentType": "",
                "ccdaVersion": "",
                "AppointmentId": 0,
                "PatientId": 0,
                "ExtractFileId": ExtractFileId,
                "HospitalId": $scope.HospitalId,
                "DirectSecureMessageId": item.DirectSecureMessageId,
                "FileId": item.FileId,
                "CCDAValidationDetails": []
            };



            eHnoteMainAppointmentService.GetCCDADocumentandValidateNew(params).then(function (resp) {
                console.log(resp);
                if (resp.data.status == "success") {
                    $scope.errorsDetails = resp.data.CCDAValidationDetails || [];
                    item.S3URL = resp.data.S3Url;
                    var obj = {
                        "AttachmentItem": item,
                        "UserId": $scope.UserId,
                        "HospitalId": $scope.HospitalId,
                        "DirectSecureMessageId": MainObj.DirectSecureMessageId,
                        "FileId": item.FileId,
                        "serviceError": resp.data.serviceError,
                        "serviceErrorMessage": resp.data.serviceErrorMessage,
                        "errorsDetails": $scope.errorsDetails,
                        "showConfigure": true
                    }



                    $scope.mInstanceAdd = $uibModal.open({
                        "templateUrl": "templates/uibpopups/ValidatationCCDAView.html",
                        "backdrop": "static",
                        "keyboard": false,
                        "windowClass": "modal-full-email",
                        "scope": $scope,
                        "resolve": {
                            "AttachmentObj": obj
                        },
                        "size": "lg",
                        "controller": function ($scope, $uibModalInstance, $sce, AttachmentObj, alertify, eHnotePatientDataService, downloadpdfService) {

                            console.log(AttachmentObj);
                            $scope.totalErrorsCount = 0;
                            $scope.AttachmentObj = AttachmentObj;
                            $scope.closePopup = function () {
                                $uibModalInstance.dismiss("cancel");
                            };

                            $scope.showActualCCDA = false;
                            $scope.ZerroErrorsWithParseError = false;
                            $scope.staticAccordianArray = [{
                                "isaccordianOpen": true,
                                "Name": "CCDA",
                                "Id": 1,
                            },
                            {
                                "isaccordianOpen": true,
                                "Name": "Errors",
                                "Id": 2,
                            }]

                            $scope.ccdaIframeUrl = $sce.trustAsResourceUrl($scope.AttachmentObj.AttachmentItem
                                .S3URL);


                            $scope.viewOriginalCCDA = function (result) {
                               
                                    $scope.showActualCCDA = result;
                                

                                if ($scope.showActualCCDA) {
                                    $scope.ccdaIframeUrl = $sce.trustAsResourceUrl($scope.AttachmentObj.AttachmentItem
                                        .OriginalReceivedS3URL);
                                } else {
                                    $scope.ccdaIframeUrl = $sce.trustAsResourceUrl($scope.AttachmentObj.AttachmentItem
                                        .S3URL);
                                }
                               
                            };
                            $scope.errorsDetails = $scope.AttachmentObj.errorsDetails || [];
                            $scope.parseFailedErrorMsg = "";
                            $scope.parseFailedErrorMsgDescription = "";

                            if ($scope.AttachmentObj.serviceError == "True" || $scope.AttachmentObj.serviceError == "true" || $scope.AttachmentObj.serviceError == true) {
                                $scope.ZerroErrorsWithParseError = true;
                                $scope.parseFailedErrorMsg = "";
                                $scope.parseFailedErrorMsgDescription = $scope.AttachmentObj.serviceErrorMessage;


                            }

                            if ($scope.errorsDetails.length > 0) {
                                $scope.totalErrorsCount = $scope.errorsDetails.length;
                            }


                            //$scope.errorsDetails = [
                            //    {
                            //        "ErrorDescription": "Consol Problem Section SHALL contain exactly one [1..1] code (CONF:15409)/@code='11450-4' Problem List (CodeSystem: 2.16.840.1.113883.6.1 LOINC) (CONF:15410)",
                            //        "ErrorPath": "/ClinicalDocument/component/structuredBody/component[7]/section",
                            //        "LineNumber": 10
                            //    },
                            //    {
                            //        "ErrorDescription": "Consol Problem Concern Act SHALL contain exactly one [1..1] statusCode (Concern Status), which SHALL be selected from ValueSet ProblemActStatusCode 2.16.840.1.113883.11.20.9.19 STATIC 2011-09-09 (CONF:9029)",
                            //        "ErrorPath": "/ClinicalDocument/component/structuredBody/component[7]/section",
                            //        "LineNumber": 872
                            //    }
                            //]



                            $scope.GetCCDAXmlData = function () {
                                //var abc = url;
                                //window.open(abc);

                                var s3url = "";

                                if ($scope.showActualCCDA) {
                                    s3url = $scope.AttachmentObj.AttachmentItem.OriginalReceivedS3URL;
                                } else {
                                    s3url = $scope.AttachmentObj.AttachmentItem.S3URL;
                                }

                                var a = document.createElement("a");
                                downloadpdfService.downloadPdf(s3url).then(function (result) {
                                    if ($scope.AttachmentObj.AttachmentItem.FileExt === "application/pdf" || $scope.AttachmentObj.AttachmentItem.FileExt === ".pdf") {
                                        var file = new Blob([result.data], { type: 'application/pdf' });
                                    }
                                    if ($scope.AttachmentObj.AttachmentItem.FileExt === "image/jpeg" || $scope.AttachmentObj.AttachmentItem.FileExt === "image/jpg" || $scope.AttachmentObj.AttachmentItem.FileExt === "image/png" || $scope.AttachmentObj.AttachmentItem.FileExt === ".png" || $scope.AttachmentObj.AttachmentItem.FileExt === ".jpg") {
                                        var file = new Blob([result.data], { type: 'image/png' });
                                    }

                                    if ($scope.AttachmentObj.AttachmentItem.FileExt === ".XML" || $scope.AttachmentObj.AttachmentItem.FileExt === ".xml") {
                                        var file = new Blob([result.data], { type: 'application/xml' });
                                    }
                                    var fileURL = window.URL.createObjectURL(file);
                                    a.href = fileURL;
                                    a.download = $scope.AttachmentObj.AttachmentItem.FileName;
                                    a.click();
                                    a.remove();
                                }, function (err) {

                                    console.log(err);
                                });
                            }


                            $scope.ConvertGeneratedCCDAOrder = function () {
                                console.log($scope.AttachmentObj.AttachmentItem.S3URL);



                                var params = {
                                    "OriginalReceivedS3URL": $scope.AttachmentObj.AttachmentItem.OriginalReceivedS3URL,
                                    "S3Url": $scope.AttachmentObj.AttachmentItem.S3URL,
                                    "UserId": $scope.AttachmentObj.UserId,
                                    "HospitalId": $scope.AttachmentObj.HospitalId,
                                    "FileName": $scope.AttachmentObj.AttachmentItem.FileName
                                };



                                eHnoteMainAppointmentService.ConvertGeneratedCCDAOrder(params).then(function (resp) {
                                    console.log(resp);

                                    console.log(resp.data.S3URL);

                                    $scope.ccdaIframeUrl = $sce.trustAsResourceUrl(resp.data.S3URL);

                                }, function (err) {
                                    alertify.error("Getting Failed");
                                })

                                

                            };                            

                            $scope.openCCDATemplateCreationPop = function () {

                                var obj = {
                                    "UserId": $scope.AttachmentObj.UserId,
                                    "HospitalId": $scope.AttachmentObj.HospitalId
                                }
                                $scope.mInstanceAdd = $uibModal.open({
                                    "templateUrl": "templates/uibpopups/CCDAResourceManagementPopup.html",
                                    "backdrop": "static",
                                    "scope": $scope,
                                    "keyboard": false,
                                    "size": "md",
                                    "windowClass": "ccaTemplates",
                                    "resolve": {
                                        "mainObject": function () { return obj; }
                                    },
                                    "controller": "CCDAResourceConfiguration"
                                });
                                $scope.mInstanceAdd.result.then(function (resp) {
                                    console.log(resp);
                                    $scope.ConvertGeneratedCCDAOrder();

                                }, function (cancel) {
                                });
                            }


                        }
                    });

                    $scope.mInstanceAdd.result.then(function (result) {


                        console.log(result);
                    }, function (error) {
                        console.log(error);
                    });

                } else {
                    alertify.error("Some Error Occured");
                }
            }, function (err) {
                alertify.error("Getting Failed");
            })






        };
        $scope.validateandViewZipped = function (item, Mainitem, MainObj) {
            
            $scope.validateandView(item, MainObj, item.ExtractFileId);
        }

        $scope.ExtractZipFiles = function (item) {

            console.log(item);
            var url = item.S3URL;
            // window.open(url);
            $scope.ExtractedFiles = [];
            var extension = "";
            if (item.S3URL) {

                if (item.S3URL.indexOf(".zip") > -1 || item.S3URL.indexOf(".ZIP") > -1) {
                    //$http.get(url, { responseType: 'arraybuffer' })
                    //    .then(function (response) {
                    //        return JSZip.loadAsync(response.data);
                    //    })
                    //    .then(function (zip) {
                    //        zip.forEach(function (relativePath, file) {
                    //            // if (relativePath.endsWith('.XML')) {
                    //            file.async('string').then(function (content) {
                    //                $scope.ExtractedFiles = [];
                    //                var obj = {
                    //                    "FileName": file.name,
                    //                    "Content": content,
                    //                    "FileId": item.FileId
                    //                }
                    //                $scope.ExtractedFiles.push(obj);
                    //                if ($scope.ExtractedFiles.length > 0) {
                    //                    var extractobj = {
                    //                        "UserId": $scope.UserId,
                    //                        "HospitalId": $scope.HospitalId,
                    //                        "Files": $scope.ExtractedFiles,
                    //                        "FileId": item.FileId,
                    //                        "DirectSecureMessageId": item.DirectSecureMessageId
                    //                    }
                    //                    eHnoteDiagnosisDataServices.AddUpdateMailExtractFiles(extractobj).then(function (resp) {
                    //                        if (resp.data.Status === "Success") {
                    //                            console.log(resp.data);
                    //                            item.ExtractArray = resp.data.rows || [];
                    //                            var IszipfileInd = true;
                    //                            $scope.GetAllInMailBoxDetails(IszipfileInd);
                    //                        }
                    //                    });
                    //                }

                    //            });

                    //            //}

                    //        });

                    //    })




                    $http.get(url, { responseType: 'arraybuffer' })
                        .then(function (response) {
                            return JSZip.loadAsync(response.data);
                        })
                        .then(function (zip) {
                            var extractedFiles = []; // Create an array to store all extracted files
                            var promises = []; // Array to store promises for each file extraction
                            zip.forEach(function (relativePath, file) {
                                var promise = file.async('string').then(function (content) {
                                    var fileName = "";
                                    if (content !== '') {
                                        var filePath = file.name;
                                        fileName = filePath.split('/').pop();
                                    } else {
                                        fileName = file.name;
                                    };

                                   // file.name = fileName;
                                    var obj = {
                                        "FileName": fileName,
                                        "Content": content,
                                        "FileId": item.FileId  
                                    };
                                    extractedFiles.push(obj);
                                });

                                promises.push(promise);
                            });

                            // Wait for all file extraction promises to resolve
                            return Promise.all(promises).then(function () {
                                return extractedFiles; // Return the array of extracted files
                            });
                        })
                        .then(function (allExtractedFiles) {


                            console.log(allExtractedFiles);

                            $scope.filefoldername = "IHE_XDM/SUBSET01/";
                            var List1 = $filter("filter")(allExtractedFiles, function (Ditem) { return Ditem.Content === ''; }) || [];
                            if (List1.length  > 0) {
                                $scope.filefoldername = List1[0].FileName;
                            }
                            var extractobj = {
                                "UserId": $scope.UserId,
                                "HospitalId": $scope.HospitalId,
                                "Files": allExtractedFiles,
                                "FileId": item.FileId,
                                "FolderPathName": $scope.filefoldername,
                                "DirectSecureMessageId": item.DirectSecureMessageId
                            }
                            
                            eHnoteDiagnosisDataServices.AddUpdateMailExtractFiles(extractobj).then(function (resp) {
                                if (resp.data.Status === "Success") {
                                    console.log(resp.data);
                                    item.ExtractArray = resp.data.rows || [];
                                    var IszipfileInd = true;
                                    $scope.GetAllInMailBoxDetails(IszipfileInd);
                                }
                            });
                        })
                        .catch(function (error) {
                            
                        });

                }

            }

        }

        $scope.ViewAttachmentReacv = function (item) {
            var url = item.S3URL;
            window.open(url);
        }


        $scope.ViewAttachmentReacv11 = function (item) {


            eHnoteDiagnosisDataServices.GetCCDAS3Url(item.S3URL).then(function (resp) {
                if (resp.data != null) {

                }
            });
        }




        //reconcile logic ended.



        $scope.pageChanged = function (pageNo) {
            $scope.newEmailReqObj.PageNumber = pageNo;
            $scope.GetAllInMailBoxDetails();
        };


        $scope.closePopup = function () {
            $uibModalInstance.dismiss("cancel");
        }

        $scope.NavigateToChart = function () {
            //$scope.CCDAChartObj.AppointmentId = 1236803;
            //$scope.CCDAChartObj.PatientId = 519818;
            $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorageStructure();
            $scope.cacheStorageItem.PatientID = $scope.CCDAChartObj.PatientId;
            $scope.cacheStorageItem.patientid = $scope.CCDAChartObj.PatientId;
            eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
            datapersistanceFactory.set("CCDASeletedPatient", $scope.CCDAChartObj);
            $location.url("/profile");
        }

        $scope.openCCDATemplateCreationPopup = function () {

            var obj = {
                "UserId": $scope.UserId,
                "HospitalId":$scope.HospitalId
            }
            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/CCDAResourceManagementPopup.html",
                "backdrop": "static",
                "scope": $scope,
                "keyboard": false,
                "size": "md",
                "windowClass": "ccaTemplates",
                "resolve": {
                    "mainObject": function () { return obj; }
                },
                "controller": "CCDAResourceConfiguration"
            });
            $scope.mInstanceAdd.result.then(function (resp) {
                console.log(resp);
                 

            }, function (cancel) {
            });
        }

        $scope.Getdoclist = function () {
            eHnoteMainAppointmentService.getBranchSubSpecializationsById($scope.SubOrganizationId, $scope.HospitalId).then(function (resp) {
                if (resp.data.status === "Success") {
                    if (resp.data.row.length > 0) {
                        $scope.allSubSpecializationsArray = resp.data.row;
                        $scope.listSubSplArray = angular.copy(resp.data.row);
                        angular.forEach($scope.allSubSpecializationsArray, function (item) {
                            item.isChecked = true;
                        });
                    }
                    var listSubSplArray = $filter("filter")($scope.allSubSpecializationsArray, function (iterator, ind) { return iterator.isChecked === true; });
                    var subSplArray = _.pluck(listSubSplArray, "SubSpecializationId").join(",");
                    var reqObj = {
                        "BranchId": $scope.HospitalId,
                        "SubSpecializationIdArray": subSplArray
                    }

                    eHnoteMainAppointmentService.getAllUsersByDepartmentId(reqObj, onGetUsersSuccess, onGetUsersFailure);
                    function onGetUsersSuccess(resp) {
                        $scope.allUserList = [];
                        $scope.MultiselectDoctorlist = [];
                      
                        if (resp.rows.length > 0) {
                            $scope.allUserList = resp.rows;
                            $scope.AllDoctorList = angular.copy($scope.allUserList);
                            $scope.AllDoctorList = _.uniq($scope.AllDoctorList, false, function (p) { return p.DoctorID; });
                            $scope.AllDoctorList = $filter("filter")($scope.AllDoctorList, function (item) {
                                return item.RoleId === 1 || item.RoleId === 43;
                            });
                        }
                    }
                    function onGetUsersFailure(data) {
                    }
                }
            });
        }

        $scope.Getdoclist();


        $scope.selectedImgs = function (files) {
            files = files || [];
            if (files.length > 0) {
                angular.forEach(files, function (item) {
                    $scope.file = item;
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
                            "S3URL": "",
                            "DeleteInd": false,
                            "DocumentID": 0,
                            "DisplayName": $scope.file.name || "",
                            "FileName": $scope.file.name || "",
                            "DocumentExt": $scope.file.type,
                        };

                        $scope.FilesObj.TempImagesArray.push(obj);
                    }
                });
            }

        };

        $scope.SaveUploadData = function () {
            var obj = {
                "TempImagesArray": $scope.FilesObj.TempImagesArray || [],
                "UserId": $scope.UserId,
                "HospitalId": $scope.HospitalId,
            }
            $scope.treatmentArray = [];
            if (obj.TempImagesArray.length == 0) {
                alertify.error('Select XMl file');
                return false;
            }
            eHnoteDiagnosisDataServices.AddEmailfileUpload(obj, OnFilesObjMaterialSuccess, OnFilesObjMaterialError);

            function OnFilesObjMaterialSuccess(data) {
                alertify.success("The XML file has been successfully uploaded and processed.");
                angular.element("input[type='file']").val(null);
                    if (data.TempImagesArray.length > 0) {
                        angular.forEach(data.TempImagesArray, function (item) {
                            var patname = $scope.PatientData.FullName.replace(/ /g, "");                        
                            var attachmentObj = {
                                "FileId": 0,
                                //"FileName": patname + "_" + "Attachment",
                                "FileName": item.FileName + "_" + "Attachment",
                                "S3URL": item.S3URL,
                              //  "ExternalFileName": patname + "_" + "Attachment",
                                "ExternalFileName": item.FileName + "_" + "Attachment",
                                "FileExt": ".xml",
                                "MimeType": "application/xml",
                                "CreatedByUser": doctorinfo.doctordata.User[0].FullName,
                                "CreatedDate": $scope.currentdate,
                                "DeleteInd": "N",
                                "DirectSecureMessageId": 0
                            }
                            $scope.newSendEmailReqObj.AttachmentsArray.push(attachmentObj);

                        })
                    }
            }

            function OnFilesObjMaterialError(data) {
                console.log(data);
                $scope.IsDisabled = false;
            }
        }
    }]);
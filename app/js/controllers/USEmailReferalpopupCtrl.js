"use strict";
eHnoteWebApp.controller("USEmailReferalpopupCtrl", ["$scope", "$rootScope", "$uibModalInstance", "eHnoteMasterDataService", "eHnoteAuditServices", "eHnoteMainAdminServices", "eHnoteReferalDataService", "eHnoteUserAppointmentDataService", "taRegisterTool", "$uibModal", "ChartObj", "ScreenType", "eHnoteDiagnosisDataServices", "eHnotePatientDataService", "$filter", "alertify", "eHnoteMainAppointmentService", "$q", "eHnoteUserDataService", "eHnoteSettingsDataService", "eHnoteLoginStatusService", "localStorageFactory", "BranchList", "$sce", "eHnoteCacheStorageService", "$timeout", "UsEmailPrintHelperService", 'datapersistanceFactory', "USPrintService",
    function ($scope, $rootScope, $uibModalInstance, eHnoteMasterDataService, eHnoteAuditServices, eHnoteMainAdminServices, eHnoteReferalDataService, eHnoteUserAppointmentDataService, taRegisterTool, $uibModal, ChartObj, ScreenType, eHnoteDiagnosisDataServices, eHnotePatientDataService, $filter, alertify, eHnoteMainAppointmentService, $q, eHnoteUserDataService, eHnoteSettingsDataService, eHnoteLoginStatusService, localStorageFactory, BranchList, $sce, eHnoteCacheStorageService, $timeout, UsEmailPrintHelperService, datapersistanceFactory, USPrintService) {


        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
        $scope.SelectedObj = ChartObj || {};
        $scope.UserRoleId = doctorinfo.RoleID || 0;
        $scope.userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
        $scope.ParentHospitalId = 0;
        $scope.HospitalId = 0;
        var tonometryDetails = [];
        var pcpAddress = [];
        var assessmentsAndPlans = [];
        var visionDetails = [];
        var posteriorSegmentDetailsArr = [];
        var anteriorSegmentDetailsArr = [];
        var refferalProviderAdress = {};
        $scope.PatientASCApptdetails = {};
        var referralTypeName = "";
        var mObj = datapersistanceFactory.getItem("masterDataArrays");
        $scope.RelationShipTypeList = angular.copy(mObj.masterRelationTypes);

        $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
        let ComingFromScreenType = ScreenType || '';
        $scope.ScreenType = angular.copy(ScreenType)|| "";
        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            $scope.ParentHospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        }
        $scope.searchProviderObj = {
            searchName: ''
        }
        $scope.BranchList = BranchList || [];
        if ($scope.BranchList.length > 0) {
            $scope.BranchList = $filter("filter")($scope.BranchList, function (iterator, ind) { return iterator.ClinicId !== 0; });
        }

        var appoint_info = eHnoteMasterDataService.getAppointmentInfo();
        $scope.isFax = ($scope.SelectedObj?.fax != null) ? $scope.SelectedObj.fax : false || true;
        $scope.message = $scope.SelectedObj.message || 2;
        $scope.EmailTab = 4;
        $scope.EmailSubTab = 1;
        // $scope.PaitentDetails = {
        //    "FullName": appoint_info.PatientDetails.FullName || "",
        //    "PatientDisplayId": appoint_info.PatientDetails.PatientDisplayId || "",
        //    "MobileNo": appoint_info.PatientDetails.MobileNo || 0,
        //    "DOB": appoint_info.PatientDetails.DOB || "",
        //    "Age": appoint_info.PatientDetails.Age || "",
        //    "Gender": appoint_info.PatientDetails.Gender || "",
        //    "VisitReason": appoint_info.VisitReason || "",
        //}

        function getPaitentDetailsObj() {
            return {
                "FullName": "",
                "PatientDisplayId": "",
                "MobileNo": 0,
                "DOB": "",
                "Age": "",
                "Gender": "",
                "VisitReason": "",
                "PatientMobile": null,
                "PatientGender": null,
                "PatientAge": null,
                "PatientDOB": null,
                "PatientFirstName": null,
                "PatientLastName": null,
                "PatientMrNo": null,
                "PatientSSN": null,
                "PatientCity": "",
                "PatientState": "",
                "PatientAddress1": "",
                "PatientAddress2": "",
                "PatientZipCode": "",
                "PatientContactNumber": null,
                "PatientBloodGroup": null,
                "PatientNationality": "",
                "PatientEmail": null,
                "PatientMaritalStatus": "",
                "faxNumber": ""
            }
        }
        $scope.PaitentDetails = getPaitentDetailsObj();

        $scope.PHIEmailUserArray = [
            { "Id": 1, "Value": "ehnote@test.directproject.net" },
            { "Id": 2, "Value": "ehnote-edge2015@directtest.interopengine.com" },

        ]

        $scope.ConsenttypeList = [
            { "Id": 1, "Value": "Consents" },
            { "Id": 2, "Value": "Letter" },

        ]
        $scope.faxobj = {
            "callerId": null,
            "Faxcountrycode": "+1",
            "FaxAreacode": "",
            "FaxHomeNumber": "",
            "ToFaxcountrycode": "+1",
            "ToFaxAreacode": "",
            "ToFaxHomeNumber": "",
            "ToRefFaxcountrycode": "+1",
            "ToRefFaxAreacode": "",
            "ToRefFaxHomeNumber": "",
        }


        $scope.faxFromObject = {
            "selectedDoctor": "",
            "selectedClinic": "",
            "FromFaxNumber": "",
            "Subject": ""
        }

        $scope.LocationTypeObj = {
            "SelectLocationString": "All Locations",
            "Name": "",
            "AllLocationCheck": true
        };
        $scope.IncomingfaxLocationTypeObj = {
            "SelectLocationString": "All Locations",
            "Name": "",
            "AllLocationCheck": true
        };

        $scope.selectedDoctor = null;
        $scope.selectedClinic = null;
        $scope.selectedReferal = null;
        $scope.selectedPCP = null;
        $scope.selectedProvider = null;
        $scope.AttachmentdDocumnets = [];
        $scope.faxNumber = null;
        $scope.subject = null;
        $scope.SelectedPatientId = ChartObj ? ChartObj.PatientId : null;
        $scope.SelectedPatientId = $scope.SelectedPatientId || null;
        $scope.Notes = null;
        $scope.Priority = false;
        $scope.reffaxNumber = null;
        $scope.OrgnizationName = null;
        $scope.ToOrgnizationName = null;
        $scope.selectedTo = 'Provider';
        $scope.refferalTo = 'PCP';
        $scope.clinicDoctorList = [];
        $scope.searchReferalDoctors = [];
        $scope.ParentFaxId = 0;
        $scope.GetAllUsers = function () {
            //
            eHnoteMainAppointmentService.getBranchSubSpecializationsById(doctorinfo.doctordata.UserAddress[0].SubOrganizationId, $scope.HospitalId).then(function (resp) {
                if (resp.data.status === "Success") {
                    if (resp.data.row.length > 0) {
                        $scope.allSubSpecializationsArray = resp.data.row;
                        //console.log('clinic' + $scope.allSubSpecializationsArray);
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
                        if (resp.rows.length > 0) {
                            //
                            $scope.clinicDoctorList = resp.rows;
                            //console.log('from' + $scope.clinicDoctorList);

                            //$scope.PerformedByArray = [];
                            //$scope.clinicDoctorList = $scope.clinicDoctorList || [];
                            //if ($scope.clinicDoctorList.length > 0) {
                            //    $scope.PerformedByArray = $scope.clinicDoctorList.filter((x) => x.RoleId == 1 || x.RoleId == 8 || x.RoleId == 30 || x.RoleId == 43 || x.RoleId == 56 || x.RoleId == 57);
                            //}
                        } else {
                            alertify.error("No Users Found in Selected Departments");
                        }
                    }

                    function onGetUsersFailure(data) {
                    }

                }
            });
        };
        $scope.GetAllUsers();
        $scope.PCPReferalDoctors = [];
        $scope.PCPDoctorsList = [];
        $scope.selectedPCPDoctorName = "";
        $scope.initfacility = function () {

            $scope.FacilityPlaceOfServiceArray = [];
            $scope.OrganizationFacilityList = [];
            let referalIdList = [1, 2]
            referalIdList.forEach(id => {
                getPCPReferalDoctors(id)
            })
            var obj = {
                "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                "FacilityName": ""
            }

            $q.all([

                eHnoteMainAdminServices.GetOrganizationFacilityDetails(obj)
            ]).then(function (resp) {


                if (resp[0].data.status == "Success") {
                    resp[0].data.rows = resp[0].data.rows || [];
                    if (resp[0].data.rows.length > 0) {
                        $scope.OrganizationFacilityList = angular.copy(resp[0].data.rows);
                    }
                }
            });
        }
        $scope.initfacility();

        function getPCPReferalDoctors(id) {
            var param = {
                'LocationId': null,
                'PageNumber': 1,
                'PageSize': 1500,
                'SearchTaxt': "",
                "SpecializationId": null,
                "DeleteInd": 'N',
                "NPI": null,
                "RefaralTypeId": id,
                "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID
            };
            return eHnoteReferalDataService.GetReferalPCPDoctors(param).then(function (resp) {
                if (resp.data.count !== 0) {
                    if (resp.data.PcpRefdetails.length > 0) {
                        if (id === 1) {
                            $scope.PCPDoctorsList = angular.copy(resp.data.PcpRefdetails);
                        }
                        else if (id === 2) {
                            $scope.PCPReferalDoctors = angular.copy(resp.data.PcpRefdetails);
                        }
                    }
                }
            }, function (error) {

            });
        }
        $scope.GetMasterFaxStatus = function () {
            eHnotePatientDataService.GetMasterFaxStatus().then(function (resp) {
                if (resp.data.status === "Success") {
                    var statusList = resp.data.FaxStatus.map(function (item) {
                        item.IsChecked = (item.FaxStatusId === 1 || item.FaxStatusId === 2);
                        return item;
                    });
                    statusList.unshift({
                        FaxStatusId: 0,
                        FaxStatusName: "All Statuses",
                        IsChecked: false
                    });
                    $scope.SplitStatusArray = statusList;
                    const checkedItems = statusList.filter(item => item.IsChecked && item.FaxStatusId !== 0);
                    if (checkedItems.length === 1) {
                        $scope.IncomingfaxStatusTypeObj = {
                            SelectLocationString: checkedItems[0].FaxStatusName
                        };
                    } else if (checkedItems.length > 1) {
                        $scope.IncomingfaxStatusTypeObj = {
                            SelectLocationString: "Select Statuses"
                        };
                    } else {
                        $scope.IncomingfaxStatusTypeObj = {
                            SelectLocationString: "Select Status"
                        };
                    }
                    $scope.incomingFaxStatusIds = checkedItems.map(item => item.FaxStatusId).join(',');
                }
            });
        };

        $scope.selectedPatientObj = {
            "PatientName": "",
        }
        $scope.incomingfaxcurrentPage = 1;
        $scope.incomingfaxpageChanged = function (incomingfaxcurrentPage) {
            $scope.incomingfaxcurrentPage = incomingfaxcurrentPage;
            $scope.filterInboundFaxes();
        }
        $scope.outboundFaxDetails = {
            // "JobId": "",
            "FaxStatus": "",
            "FaxNumber": "",
            "FromDate": $filter('date')(new Date(), "MM-dd-yyyy"),
            "ToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
            "PatientId": null,
            // "ToName": "",

        }
        $scope.inboundFaxDetails = {
            "FromDate":"", // $filter('date')(new Date(), "MM-dd-yyyy"),
            "ToDate":"",// $filter('date')(new Date(), "MM-dd-yyyy"),
            "FromNumber": "",
            "ToNumber": "",
            "PatientId": null,
        }
        $scope.filterOutboundFaxes = function () {
            if ($scope.outgoingFaxLocationIds) {
                $scope.outgoingFaxLocationIds = $scope.outgoingFaxLocationIds;
            } else {
                $scope.outgoingFaxLocationIds = $scope.HospitalId;
            }
            var obj = {
                // "JobId": $scope.outboundFaxDetails.JobId || "",
                "FaxStatus": $scope.outboundFaxDetails.FaxStatus || "",
                "FaxNumber": $scope.outboundFaxDetails.FaxNumber || "",
                "FromDate": $scope.outboundFaxDetails.FromDate || "",
                "ToDate": $scope.outboundFaxDetails.ToDate || "",
                "PatientId": $scope.SelectedObj.PatientId || 0,
                //"ToName": $scope.outboundFaxDetails.ToName || "",
                "Locationids": $scope.outgoingFaxLocationIds
            }

            eHnotePatientDataService.GetOutBoundFaxTransactions(obj).then(function (resp) {
                if (resp.data.Status == "Success") {

                    $scope.sentFaxList = resp.data.rows || [];
                    //alertify.success("OutboundFaxes filtered Sucessfully")

                    if ($scope.sentFaxList.length > 0) {
                        angular.forEach($scope.sentFaxList, function (item) {

                            item.CallerId = item.CallerId || null;
                            if (item.CallerId != null) {
                                var Number = eHnoteUserDataService.FaxUsMobileFormatChange(item.CallerId);
                                item.CallerId = Number.UsFormatMobileNumber;

                            }
                            item.FaxNumber = item.FaxNumber || null;
                            if (item.FaxNumber != null) {
                                var Number = eHnoteUserDataService.FaxUsMobileFormatChange(item.FaxNumber);
                                item.FaxNumber = Number.UsFormatMobileNumber;

                            }
                            if (item.PatientFaxFiles.length > 0) {
                                angular.forEach(item.PatientFaxFiles, function (patitem) {
                                    patitem.DocumentName = patitem.FileName || '';
                                    patitem.S3URL = patitem.FileUrl || '';
                                });
                            }
                        });
                    }
                }
                else {
                    alertify.error("Failed")
                }

            })
        }

        $scope.filterInboundFaxes = function () {
            if ($scope.incomingFaxLocationIds) {
                $scope.incomingFaxLocationIds = $scope.incomingFaxLocationIds;
            } else {
                $scope.incomingFaxLocationIds = $scope.HospitalId;
            }
            var obj = {
                "FromDate": $scope.inboundFaxDetails.FromDate || "",
                "ToDate": $scope.inboundFaxDetails.ToDate || "",
                "FromNumber": $scope.inboundFaxDetails.FromNumber,
                "ToNumber": $scope.inboundFaxDetails.ToNumber,
                "PatientId": $scope.SelectedObj.PatientId || 0,
                "Locationids": $scope.incomingFaxLocationIds ,
                "PageSize": 100,
                "PageNumber": $scope.incomingfaxcurrentPage,
                "StatusId": $scope.incomingFaxStatusIds||"1, 2"
            }

            eHnotePatientDataService.GetInBoundFaxTransactions(obj).then(function (resp) {
                if (resp.data.Status == "Success") {
                    $scope.receiveFaxList = resp.data.rows;
                    $scope.receiveFaxList.forEach(function (fax) {
                        let allUsers = [];
                        if (fax.selectedPdfUrls && fax.selectedPdfUrls.length) {
                            fax.selectedPdfUrls.forEach(function (pdf) {
                                if (pdf.ConnectedUsers && pdf.ConnectedUsers.length) {
                                    allUsers = allUsers.concat(pdf.ConnectedUsers);
                                }
                            });
                        }
                        fax.AllConnectedUsers = allUsers;
                    });
                    $scope.totalItems = resp.data.count;
                    //alertify.success("Faxes Received Sucessfully")
                    if ($scope.receiveFaxList.length > 0) {
                        angular.forEach($scope.receiveFaxList, function (item) {
                            item.FromNumber = item.FromNumber || null;
                            if (item.FromNumber != null) {
                                var Number = eHnoteUserDataService.FaxUsMobileFormatChange(item.FromNumber);
                                item.FromNumber = Number.UsFormatMobileNumber;

                            }
                            item.ToNumber = item.ToNumber || null;
                            if (item.ToNumber != null) {
                                var Number = eHnoteUserDataService.FaxUsMobileFormatChange(item.ToNumber);
                                item.ToNumber = Number.UsFormatMobileNumber;

                            }
                            item.DocumentName = item.FaxStatus || '';
                            item.S3URL = item.S3Url || '';

                        });
                    }
                }
                else {
                    alertify.error("Failed")
                }

            })
        }

        $scope.resetfilterOutboundFaxes = function () {
            $scope.outboundFaxDetails = {
                // "JobId": "",
                "FaxStatus": "",
                "FaxNumber": "",
                "FromDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "ToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "PatientId": null,
                // "ToName": "",
            }
            $scope.selectedPatientObj.PatientName = null;
            $scope.filterOutboundFaxes();
        }
        $scope.resetfilterInboundFaxes = function () {
            $scope.inboundFaxDetails = {
                "FromDate":"",// $filter('date')(new Date(), "MM-dd-yyyy"),
                "ToDate":"",// $filter('date')(new Date(), "MM-dd-yyyy"),
                "FromNumber": "",
                "ToNumber": "",
                "PatientId": null,
                "StatusId":""
            }
            $scope.selectedPatientObj.PatientName = null;
            $scope.minincomingfaxDate = null;
            $scope.incomingFaxStatusIds = "";
            $scope.GetMasterFaxStatus();
            $scope.filterInboundFaxes();
        }

        $scope.resetfilterOutboundFaxes();
        $scope.resetfilterInboundFaxes();
        function getSendEmailEmptyRequestObj() {

            var CreatedByName = "";
            if (doctorinfo.doctordata.User.length > 0) {
                CreatedByName = doctorinfo.doctordata.User[0].FullName || "";
            }
            var obj = {
                "UserId": $scope.UserId,
                "OrganizationId": $scope.HospitalId,
                "PatientId": appoint_info.PatientID || 0,
                "AppointmentId": 0,//$scope.SelectedAppointmentId||
                "DirectSecureMessageId": 0,
                "FromEmail": "",
                "ToEmail": $scope.SelectedObj.EmailID || "",
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
                "AppointmentReferalId": "",
                "AttachmentsArray": [],
                "DocumentType": "",
                "VenderType": "PHIMail",

            }
            return obj;
        }

        $scope.newSendEmailReqObj = getSendEmailEmptyRequestObj();

        function getEmailReqObj() {
            let obj = {
                "DoctorEmail": $scope.SelectedObj.EmailID || "",
                "TextBody": "",
                "HeaderText": "",
                "AppointmentId": 0,//$scope.SelectedObj.AppointmentId ||
                "Subject": "",
                "PHIEmail": "",
                "NormalEmail": 2,
                "IsChartCCDAChecked": false,
                "IsChartPdfChecked": false,
                "CCDALink": "",
                "pdfurl": "",
                "AttachmentsArray": [],
                "IsMailFromWebApp": false,
                "IsMailFromPatientPortal": false,
                "IsMailFromPatient": false,
                "ConsentId": null,
            }
            return obj;
        }
        $scope.eObj = getEmailReqObj();
        var patientParticularDetailsObj = {};
        $scope.selectedPatientdata = function (item) {

            console.log(item)
            appoint_info.PatientID = item;
            $scope.SelectedPatientId = appoint_info.PatientID;
            eHnoteAuditServices.getParticularPatientDetailsById($scope.SelectedPatientId, ongetPatientDetailsSuccess, ongetPatientDetailsError);
            function ongetPatientDetailsSuccess(response) {
                if (response.count > 0) {
                    var patientitem = response.rows[0];
                    patientParticularDetailsObj = angular.copy(patientitem);
                    console.log(patientitem)
                    $scope.PaitentDetails.FullName = patientitem.FullName;
                    $scope.PaitentDetails.Age = patientitem.Age;
                    $scope.PaitentDetails.Gender = patientitem.Gender;
                    $scope.PaitentDetails.VisitReason = patientitem.VisitReason;
                    $scope.PaitentDetails.PatientMobile = patientitem.PhoneNumber || '';
                    $scope.PaitentDetails.PatientGender = patientitem.Gender;
                    $scope.PaitentDetails.PatientAge = patientitem.Age;
                    $scope.PaitentDetails.PatientDOB = patientitem.DOB;
                    $scope.PaitentDetails.DisplayID = patientitem.DisplayID;
                    $scope.PaitentDetails.S3URL = patientitem.S3URL;

                    $scope.PaitentDetails.PatientMrNo = patientitem.OldMrno;
                    $scope.PaitentDetails.PatientSSN = patientitem.SocialSecurityNo;
                    $scope.PaitentDetails.PatientCity = patientitem.CityName;
                    $scope.PaitentDetails.PatientState = patientitem.StateName;
                    $scope.PaitentDetails.PatientAddress1 = patientitem.Address1;
                    $scope.PaitentDetails.PatientAddress2 = patientitem.Address2;
                    $scope.PaitentDetails.PatientZipCode = patientitem.ZipCode;
                    $scope.PaitentDetails.PatientContactNumber = patientitem.OfficeNumber;
                    $scope.PaitentDetails.PatientBloodGroup = patientitem.BloodGroup;
                    $scope.PaitentDetails.PatientNationality = patientitem.CountryName;
                    $scope.PaitentDetails.PatientEmail = patientitem.EmailID;
                    $scope.PaitentDetails.PatientMaritalStatus = patientitem.MaritalStatusId;
                    $scope.PaitentDetails.faxNumber = patientitem.FaxNumber;

                    if ($scope.PaitentDetails.PatientMobile != "") {
                        var PatMobile = eHnoteUserDataService.UsMobileFormatChange($scope.PaitentDetails.PatientMobile);
                        $scope.PaitentDetails.PatientMobile = PatMobile.UsFormatMobileNumber;
                    }
                    // $scope.optionsArray[1].ToProderList[0].faxNumber = patientitem.FaxNumber;
                    if (patientitem.FaxNumber != "") {
                        var FaxNumber = eHnoteUserDataService.UsMobileFormatChange(patientitem.FaxNumber);
                        $scope.optionsArray[1].ToProderList[0].faxNumber = FaxNumber.UsFormatMobileNumber;
                    }
                    $scope.optionsArray[1].ToProderList[0].PatientFullName = patientitem.FullName;
                    //$scope.openAttachDocumentsPopup();
                    $scope.ShowPatientListDrop = false;

                    $scope.HeaderPatientSearchObj.IsShowSearchRemoveInd = false;
                    if (patientitem.PermanentAddress.Address1 != '' || patientitem.PermanentAddress.Address2 != '' || patientitem.PermanentAddress.CityName != '' || patientitem.PermanentAddress.StateName != '' || patientitem.PermanentAddress.ZipCode != '') {
                        $scope.PaitentDetails.PatientAddress = patientitem.PermanentAddress.Address1 + "," + patientitem.PermanentAddress.Address2 + "," + '' + patientitem.PermanentAddress.CityName + "," + patientitem.PermanentAddress.StateName + "," + patientitem.PermanentAddress.ZipCode;
                    }
                    patientParticularDetailsObj.ExternalComanagerName = '';
                    patientParticularDetailsObj.InternalComanagerName = '';
                    patientParticularDetailsObj.ExtrenalDetails = '';
                    patientParticularDetailsObj.PCPDoctorName = '';
                }
            }
            function ongetPatientDetailsError(error) {
                console.log(error);
            }

        }




        $scope.obj = {
            "Selected": ""
        }

        $scope.optionsArray = [
            { Id: 1, Name: 'Providers', TypeId: 2, isChecked: false, disabled: false, ToProderList: [] },
            { Id: 2, Name: 'Patient', TypeId: 0, isChecked: false, disabled: false, ToProderList: [] },
            { Id: 3, Name: 'Pharmacies', TypeId: 7, isChecked: false, disabled: false, ToProderList: [] },
            { Id: 4, Name: 'Insurance Cos', TypeId: 3, isChecked: false, disabled: false, ToProderList: [] },
            { Id: 5, Name: 'Attorneys', TypeId: 3, isChecked: false, disabled: false, ToProderList: [] },
            { Id: 6, Name: 'Referral Doc', TypeId: 2, isChecked: false, disabled: false, ToProderList: [] },
            { Id: 7, Name: 'PCPs', TypeId: 1, isChecked: false, disabled: false, ToProderList: [] },
            { Id: 8, Name: 'Other', TypeId: 3, isChecked: false, disabled: false, ToProderList: [] }
        ];
        $scope.ToTemplateData = {
            "selectedProvider": null,
            "PatientFullName": $scope.PaitentDetails.FullName,
            "ToProviderdata": null,
            "OrgnizationName": null,
            "faxNumber": $scope.PaitentDetails.faxNumber,
        }

        $scope.optionsArray.forEach(function (option) {
            option.ToProderList.push(angular.copy($scope.ToTemplateData));
        });
        $scope.editorToolbarButtonConfig = [
            ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
            ['bold', 'italics', 'underline', 'ul', 'ol', 'justifyLeft', 'justifyCenter', 'justifyRight', "html"],
            /*['undo', 'redo', 'clear', 'insertLogo', 'insertDynamicText', 'fontname', 'fontsize'],*/
            ['undo', 'redo', 'clear'],
        ];
        $scope.mainConsentObj = {
            "HtmlContent": "",
            "IsSideBarAddFieldsShow": false,
            "IsSideBarAddSignatureShow": false,
            "IsSideBarUploadFilesShow": false,
            "IsShowTemplates": true,
            "IsNewEmptyDoc": false,
            "IsTemplateEmptyDoc": false,
            "IsDirectSave": true,
            "IsFromPatient": true,
            "IsFontName": false,
            "IsFontSize": false,
            "Notes": "",
            "PatientSignString": "",
            "PatientIntialSignString": "",
            "StaffUserId": 0,
            "StaffSignString": "",
            "ProviderSignString": "",
            "CounselorUserId": 0,
            "CounselorSignString": "",
            "AnesthesistUserId": 0,
            "AnesthesistSignString": "",
            "GaurdianSignString": "",
            "GaurdianFirstName": "",
            "GaurdianLastName": "",
            "GaurdianRelationShipId": "",
            "PatientSignedDateTime": "",
            "ProviderUserId": 0,
            "ProviderSignedDateTime": "",
            "CounselorSignedDateTime": "",
            "AnesthesistSignedDateTime": "",
            "GaurdianSignedDateTime": "",
            "StaffSignedDateTime":"",
        };
        taRegisterTool('testTool', {
            buttontext: 'Test',
            tooltiptext: 'Test Tool',
            action: function ($deferred, restoreSelection) {
                this.$editor().wrapSelection('insertHTML', '<span class="test-span">Foo</span>');
            },
            activeState: function (commonElement) {
                if (commonElement) {
                    return $(commonElement).hasClass('test-span');
                }
            }
        });
        taRegisterTool('fontname', {
            tooltiptext: 'Font Name',
            display: "<span class='bar-btn-dropdown dropdown'>" +
                "<button class='btn btn-blue dropdown-toggle' type='button' ng-disabled='showHtml()' style='padding-top: 4px'><i class='fa fa-font'></i><i class='fa fa-caret-down'></i></button>" +
                "<ul class='dropdown-menu'><li ng-repeat='o in options'><button class='btn btn-blue checked-dropdown' style='font-family: {{o.css}}; width: 100%' type='button' ng-click='action($event, o.css)'><i ng-if='o.active' class='fa fa-check'></i>{{o.name}}</button></li></ul></span>",
            action: function (event, font) {
                Ediotor = this;
                $scope.mainConsentObj.IsSideBarAddFieldsShow = false;
                $scope.mainConsentObj.IsSideBarAddSignatureShow = false;
                $scope.mainConsentObj.IsSideBarUploadFilesShow = false;
                $scope.mainConsentObj.IsShowTemplates = false;
                $scope.mainConsentObj.IsTemplateEmptyDoc = false;
                $scope.mainConsentObj.IsFontName = true;
                $scope.mainConsentObj.IsFontSize = false;


                return this.$editor().wrapSelection('fontname', font);
            },
            options: [
                { name: 'Sans-Serif', css: 'Arial, Helvetica, sans-serif' },
                { name: 'Serif', css: "'times new roman', serif" },
                { name: 'Wide', css: "'arial black', sans-serif" },
                { name: 'Narrow', css: "'arial narrow', sans-serif" },
                { name: 'Comic Sans MS', css: "'comic sans ms', sans-serif" },
                { name: 'Courier New', css: "'courier new', monospace" },
                { name: 'Garamond', css: 'garamond, serif' },
                { name: 'Georgia', css: 'georgia, serif' },
                { name: 'Tahoma', css: 'tahoma, sans-serif' },
                { name: 'Trebuchet MS', css: "'trebuchet ms', sans-serif" },
                { name: "Helvetica", css: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
                { name: 'Verdana', css: 'verdana, sans-serif' },
                { name: 'Proxima Nova', css: 'proxima_nova_rgregular' }
            ]
        });
        taRegisterTool('fontsize', {
            tooltiptext: 'Font Size',
            display: "<span class='bar-btn-dropdown dropdown'>" +
                "<button class='btn btn-blue dropdown-toggle' type='button' ng-disabled='showHtml()' style='padding-top: 4px'><i class='fa fa-text-height'></i><i class='fa fa-caret-down'></i></button>" +
                "<ul class='dropdown-menu'><li ng-repeat='o in options'><button class='btn btn-blue checked-dropdown' style='font-size: {{o.css}}; width: 100%' type='button' ng-click='action($event, o.value)'><i ng-if='o.active' class='fa fa-check'></i> {{o.name}}</button></li></ul>" +
                "</span>",
            action: function (event, size) {
                Ediotor = this;
                $scope.mainConsentObj.IsSideBarAddFieldsShow = false;
                $scope.mainConsentObj.IsSideBarAddSignatureShow = false;
                $scope.mainConsentObj.IsSideBarUploadFilesShow = false;
                $scope.mainConsentObj.IsShowTemplates = false;
                $scope.mainConsentObj.IsTemplateEmptyDoc = false;
                $scope.mainConsentObj.IsFontName = false;
                $scope.mainConsentObj.IsFontSize = true;


                this.$editor().wrapSelection('fontsize', size);

            },
            options: [
                { name: 'xx-small', css: 'xx-small', value: 1 },
                { name: 'x-small', css: 'x-small', value: 2 },
                { name: 'small', css: 'small', value: 3 },
                { name: 'medium', css: 'medium', value: 4 },
                { name: 'large', css: 'large', value: 5 },
                { name: 'x-large', css: 'x-large', value: 6 },
                { name: 'xx-large', css: 'xx-large', value: 7 }

            ]
        });
        taRegisterTool('insertDynamicText', {
            buttontext: 'Add Field',
            tooltiptext: 'Add Custom Field',
            action: function () {
                Ediotor = this;
                $scope.mainConsentObj.IsSideBarAddFieldsShow = true;
                $scope.mainConsentObj.IsSideBarAddSignatureShow = false;
                $scope.mainConsentObj.IsSideBarUploadFilesShow = false;
                $scope.mainConsentObj.IsShowTemplates = false;
                $scope.mainConsentObj.IsTemplateEmptyDoc = false;



                //var mInstanceAdd = $uibModal.open({
                //    "templateUrl": "templates/settings/AdditionalFieldsPopup.html",
                //    "backdrop": "static",
                //    "keyboard": false,
                //    "size": "lg",
                //    "controller": function ($scope, $uibModal, $uibModalInstance, eHnoteSettingsDataService) {
                //        $scope.tabno = 1;
                //        $scope.SelectedFieldItem = "";
                //        $scope.PatientFieldsArray = [
                //            {
                //                "Id": 1,
                //                "Name": "PatientName",
                //                "Value": "#PatientName#"
                //            },
                //            {
                //                "Id": 2,
                //                "Name": "PatientMrNo",
                //                "Value": "#PatientMrNo#"
                //            },
                //            {
                //                "Id": 3,
                //                "Name": "PatientMobile",
                //                "Value": "#PatientMobile#"
                //            }
                //        ];

                //        $scope.DoctorFieldsArray = [
                //            {
                //                "Id": 1,
                //                "Name": "Doctor Name",
                //                "Value": "#DoctorName#"
                //            },
                //            {
                //                "Id": 2,
                //                "Name": "Doctor Mobile",
                //                "Value": "#DoctorMobile#"
                //            },
                //            {
                //                "Id": 3,
                //                "Name": "Doctor Specialization",
                //                "Value": "#DoctorSpecialization#"
                //            }
                //        ];

                //        $scope.HospitalFieldsArray = [
                //            {
                //                "Id": 1,
                //                "Name": "Hospital Name",
                //                "Value": "#HospitalName#"
                //            },
                //            {
                //                "Id": 2,
                //                "Name": "Hospital Mobile",
                //                "Value": "#HospitalMobile#"
                //            },
                //            {
                //                "Id": 3,
                //                "Name": "Hospital Address",
                //                "Value": "#HospitalAddress#"
                //            }
                //        ];

                //        $scope.changeFieldValue = function (text) {
                //            //console.log(text);
                //            $scope.SelectedFieldItem = text;
                //        };


                //        $scope.SaveFieldDetails = function (resp) {
                //            //console.log(resp);
                //            $uibModalInstance.close(resp);
                //        }

                //        $scope.ClearDetails = function () {
                //            $uibModalInstance.close("Close");
                //        };


                //        $scope.createfeeuibclose = function () {
                //            $uibModalInstance.dismiss("cancel");
                //        };

                //        $scope.MainFieldsArray = [];
                //        $scope.GetMasterConsentFields = function () {
                //            $scope.FieldCategoriesArray = [];
                //            $scope.FieldValuesArray = [];
                //            $scope.MainFieldsArray = [];
                //            eHnoteSettingsDataService.GetMasterConsentFields().success(function (data) {
                //                $scope.MainFieldsArray = data.FieldsArray;
                //            }).error(function (error) {
                //                alertify.error("Getting MasterConsentFields failed");
                //            });


                //        };
                //        $scope.GetMasterConsentFields();
                //    }
                //});

                //mInstanceAdd.result.then(function (resp) {
                //    //console.log(resp);


                //    var htmltext = "<span id='N" + resp + "'> #" + resp + "# </span>";




                //    var tsthis = textAngularManager.retrieveEditor('htmlcontentconsent');
                //    //console.log(tsthis)




                //    var element = $compile(htmltext)(tsthis.scope.$parent);

                //    tsthis.scope.displayElements.text[0].focus();
                //    insertNodeAtCursor(element[0]);
                //    return placeCaretAtEnd(element[0])

                //}, function (cancel) {
                //    //console.log(cancel);
                //});


                function insertTextAtCursor(text) {
                    var sel, range;
                    if (window.getSelection) {
                        sel = window.getSelection();
                        if (sel.getRangeAt && sel.rangeCount) {
                            range = sel.getRangeAt(0);
                            range.deleteContents();
                            range.insertNode(document.createTextNode(text));
                        }
                    } else if (document.selection && document.selection.createRange) {
                        document.selection.createRange().text = text;
                    }
                }

                function moveCaret(charCount) {
                    var sel, range;
                    if (window.getSelection) {
                        sel = window.getSelection();
                        if (sel.rangeCount > 0) {
                            var textNode = sel.focusNode;
                            sel.collapse(textNode.nextSibling, charCount);
                        }
                    } else if ((sel = window.document.selection)) {
                        if (sel.type != "Control") {
                            range = sel.createRange();
                            range.move("character", charCount);
                            range.select();
                        }
                    }
                }


                function insertNodeAtCursor(node) {
                    var sel, range, html;
                    if (window.getSelection) {
                        sel = window.getSelection();
                        if (sel.getRangeAt && sel.rangeCount) {
                            sel.getRangeAt(0).insertNode(node);
                        }
                    } else if (document.selection && document.selection.createRange) {
                        range = document.selection.createRange();
                        html = (node.nodeType == 3) ? node.data : node.outerHTML;
                        range.pasteHTML(html);
                    }
                }
                function placeCaretAtEnd(el) {
                    el.focus();
                    if (typeof window.getSelection != "undefined"
                        && typeof document.createRange != "undefined") {
                        var range = document.createRange();
                        range.setStartAfter(el);
                        range.setEndAfter(el);
                        var sel = window.getSelection();
                        sel.removeAllRanges();
                        sel.addRange(range);
                    } else if (typeof document.body.createTextRange != "undefined") {
                        var textRange = document.body.createTextRange();
                        textRange.moveToElementText(el);
                        textRange.collapse(false);
                        textRange.select();
                    }
                }


            },
        });
        taRegisterTool('insertSignature', {
            buttontext: 'Add Sign',
            tooltiptext: 'Add Signature From Topaz',
            action: function () {
                // Ediotor = this;
                //$scope.mainConsentObj.IsSideBarAddFieldsShow = false;
                //$scope.mainConsentObj.IsSideBarAddSignatureShow = true;
                //$scope.mainConsentObj.IsSideBarUploadFilesShow = false;


                var mInstanceAdd = $uibModal.open({
                    "templateUrl": "templates/settings/AdditionalSigantureFieldPopup.html",
                    "backdrop": "static",
                    "keyboard": false,
                    "controller": function ($scope, $uibModal, $uibModalInstance) {
                        $scope.tabno = 1;
                        $scope.SelectedFieldItem = "";



                        var tmr;

                        var resetIsSupported = false;




                        function onLoadSIg() {
                            if (IsSigWebInstalled()) {
                                resetIsSupported = GetResetSupported();
                                if (!resetIsSupported) {
                                    var sigweb_link = document.createElement("a");
                                    sigweb_link.href = "https://www.topazsystems.com/software/sigweb.exe";
                                    sigweb_link.innerHTML = "https://www.topazsystems.com/software/sigweb.exe";

                                    var note = document.getElementById("sigWebVrsnNote");
                                    note.innerHTML = "There is a newer version of SigWeb available here: ";
                                    note.appendChild(sigweb_link);
                                }
                            }
                            else {
                                alert("Unable to communicate with SigWeb. Please confirm that SigWeb is installed and running on this PC.");
                            }
                        }
                        onLoadSIg();


                        function GetResetSupported() {
                            var minSigWebVersionResetSupport = "1.6.4.0";

                            if (isOlderSigWebVersionInstalled(minSigWebVersionResetSupport)) {
                                //console.log("Old SigWeb version installed.");
                                return false;
                            }
                            return true;
                        }

                        function isOlderSigWebVersionInstalled(cmprVer) {
                            var sigWebVer = GetSigWebVersion();
                            if (sigWebVer != "") {
                                return isOlderVersion(cmprVer, sigWebVer);
                            } else {
                                return false;
                            }
                        }

                        function isOlderVersion(oldVer, newVer) {
                            const oldParts = oldVer.split('.')
                            const newParts = newVer.split('.')
                            for (var i = 0; i < newParts.length; i++) {
                                const a = parseInt(newParts[i]) || 0
                                const b = parseInt(oldParts[i]) || 0
                                if (a < b) return true
                                if (a > b) return false
                            }
                            return false;
                        }

                        $scope.signPlusObj = {
                            "readyToSign": false,
                            "SignString": ""
                        }



                        $scope.OnSign = function () {
                            if (IsSigWebInstalled()) {
                                var ctx = document.getElementById('signPadUD').getContext('2d');
                                SetDisplayXSize(500);
                                SetDisplayYSize(100);
                                SetTabletState(0, tmr);
                                SetJustifyMode(0);
                                ClearTablet();
                                SetKeyString("0000000000000000");
                                SetEncryptionMode(0);
                                if (tmr == null) {
                                    tmr = SetTabletState(1, ctx, 50);
                                }
                                else {
                                    SetTabletState(0, tmr);
                                    tmr = null;
                                    tmr = SetTabletState(1, ctx, 50);
                                }
                                $scope.signPlusObj.readyToSign = true;
                            } else {
                                alert("Unable to communicate with SigWeb. Please confirm that SigWeb is installed and running on this PC.");
                            }
                        };

                        $scope.OnClear = function () {
                            ClearTablet();
                            $uibModalInstance.close("Close");
                            //var ctx = document.getElementById('cnv').getContext('2d');
                            //ClearTablet();
                            //ctx.clearReact(0,0,50,50)

                            //SetTabletState(0, tmr);

                        }


                        $scope.saveDrawNew = function () {
                            if (NumberOfTabletPoints() == 0) {
                                alert("Please sign before continuing");
                            }
                            else {
                                SetTabletState(0, tmr);


                                //NOW, EXTRACT THE SIGNATURE IN THE TOPAZ BIOMETRIC FORMAT -- SIGSTRING
                                //OR AS A BASE64-ENCODED PNG IMAGE
                                //OR BOTH

                                //********************USE THIS SECTION IF YOU WISH TO APPLY AUTOKEY TO YOUR TOPAZ SIGNATURE
                                //READ ABOUT AUTOKEY AND THE TOPAZ SIGNATURE FORMAT HERE: http://topazsystems.com/links/robustsignatures.pdf
                                //AUTOKEY IS CRITICAL TO SAVING AN eSIGN-COMPLIANT SIGNATURE
                                //AUTOKEY ONLY APPLIES TO THE TOPAZ-FORMAT SIGSTRING AND DOES NOT APPLY TO AN IMAGE OF THE SIGNATURE
                                //AUTOKEY ALLOWS THE DEVELOPER TO CRYPTOGRAPHICALLY BIND THE TOPAZ SIGNATURE TO A SET OF DATA
                                //THE PURPOSE OF THIS IS TO SHOW THAT THE SIGNATURE IS BEING APPLIED TO THE DATA YOU PASS IN USING AutoKeyAddData()
                                //IN GENERAL TOPAZ RECOMMENDS REPLICATING A TRADITIONAL 'PAPER AND PEN' APPROACH
                                //IN OTHER WORDS, IF YOU WERE TO PRINT OUT ON PAPER THE TERMS/INFORMATION THE SIGNER IS SUPPOSED TO READ AND AGREE WITH
                                //THE DATA ON THIS PAPER IS WHAT SHOULD IN WHOLE BE PASSED INTO AUTOKEYADDANSIDATA() DIGITALLY
                                //THE TOPAZ SIGSTRING IS THEN BOUND TO THIS DATA, AND CAN ONLY BE SUCCESSFULLY DECRYPTED LATER USING THIS DATA
                                //AUTOKEYADDDATA IS DEPRECATED AND REPLACED BY AUTOKEYADDANSIDATA

                                var CryptoData = "";
                                CryptoData = "This represents sample data the signer reads and is agreeing to when signing.";
                                CryptoData = CryptoData + "Concatenate all this data into a single variable.";
                                AutoKeyAddANSIData(CryptoData);
                                SetEncryptionMode(2);

                                //*******END AUTOKEY SECTION


                                //NOTE THAT THE AUTOKEY SECTION ABOVE IS NOT REQUIRED TO RETURN A TOPAZ SIGSTRING
                                //BUT IT IS STRONGLY RECOMMENDED IF YOU REQUIRE eSIGN COMPLIANCE
                                //RETURN THE TOPAZ-FORMAT SIGSTRING
                                SetSigCompressionMode(1);
                                //alert("KEYSTRING:" + GetKeyString());
                                $scope.signPlusObj.SignString = GetSigString();
                                //THIS RETURNS THE SIGNATURE IN TOPAZ'S OWN FORMAT WITH BIOMETRIC INFORMATION


                                //TO RETURN THIS SIGSTRING LATER TO A NEW WEB PAGE USING SIGWEB, REPEAT THE CODE FROM THIS FUNCTION ABOVE STARTING AFTER SetTabletState(0, tmr)
                                //BUT AT THE END USE SetSigString() INSTEAD OF GetSigString()
                                //NOTE THAT SetSigString() TAKES 2 ARGUMENTS
                                //SetSigString(str SigString, context canvas)

                                //TO RETURN A BASE64-ENCODED PNG IMAGE OF THE SIGNATURE
                                SetImageXSize(500);
                                SetImageYSize(100);
                                SetImagePenWidth(5);
                                GetSigImageB64(SignedImageCallback);
                                function SignedImageCallback(str) {

                                    var convertedSignatureObj = "data:image/png;base64," + str;



                                    $scope.signPlusObj.readyToSign = false;
                                    // ClearTablet();
                                    const canvas = document.getElementById("signPadUD");
                                    const ctx = canvas.getContext("2d");
                                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                                    var resp = '<img src="' + convertedSignatureObj + '">';
                                    //console.log(resp);
                                    $uibModalInstance.close(resp);

                                }


                            }
                        }











                    }
                });

                mInstanceAdd.result.then(function (resp) {
                    //console.log(resp);
                    //var text = resp;

                    //insertTextAtCursor(text);
                    //return moveCaret(1);
                    var tsthis = textAngularManager.retrieveEditor('htmlcontentconsent');
                    var tsthis = textAngularManager.retrieveEditor('htmlcontentconsent1');
                    //console.log(tsthis)




                    var element = $compile(resp)(tsthis.scope.$parent);

                    tsthis.scope.displayElements.text[0].focus();
                    insertNodeAtCursor(element[0]);
                    return placeCaretAtEnd(element[0])


                    /*   return tsthis.scope.wrapSelection('insertHtml', resp);*/

                }, function (cancel) {
                    //console.log(cancel);
                });







                function insertNodeAtCursor(node) {
                    var sel, range, html;
                    if (window.getSelection) {
                        sel = window.getSelection();
                        if (sel.getRangeAt && sel.rangeCount) {
                            sel.getRangeAt(0).insertNode(node);
                        }
                    } else if (document.selection && document.selection.createRange) {
                        range = document.selection.createRange();
                        html = (node.nodeType == 3) ? node.data : node.outerHTML;
                        range.pasteHTML(html);
                    }
                }
                function placeCaretAtEnd(el) {
                    el.focus();
                    if (typeof window.getSelection != "undefined"
                        && typeof document.createRange != "undefined") {
                        var range = document.createRange();
                        range.setStartAfter(el);
                        range.setEndAfter(el);
                        var sel = window.getSelection();
                        sel.removeAllRanges();
                        sel.addRange(range);
                    } else if (typeof document.body.createTextRange != "undefined") {
                        var textRange = document.body.createTextRange();
                        textRange.moveToElementText(el);
                        textRange.collapse(false);
                        textRange.select();
                    }
                }

                var text = "Date";
                /*      insertTextAtCursor(String.fromCharCode(169));*/
                insertTextAtCursor(text);
                return moveCaret(1);
            },
        });

        //$scope.ChangeTemplate = function (item) {
        //    //document.getElementById('htmlcontentconsent').innerHTML = "";
        //    $scope.mainConsentObj.HtmlContent = "";
        //    $scope.mainConsentObj.HtmlContent = item.PDFcontent || '';
        //    // document.getElementById('htmlcontentconsent').innerHTML = item.PDFcontent;


        //}

        $scope.showEditor = true;
        $scope.ChangeTemplate = function (item) {
            // Clear model first

            $scope.showEditor = false;
            $scope.mainConsentObj.HtmlContent = '';
            $scope.mainConsentObj.PatientSignString = '';
            $scope.mainConsentObj.PatientIntialSignString = '';
            $scope.mainConsentObj.StaffSignString = '';
            $scope.mainConsentObj.ProviderSignString = '';
            $scope.mainConsentObj.CounselorSignString = '';
            $scope.mainConsentObj.AnesthesistSignString = '';
            $scope.mainConsentObj.GaurdianSignString = '';

            // Force DOM to update
            $timeout(function () {
                // Assign new content after small delay
                $scope.mainConsentObj.HtmlContent = item.PDFcontent || '';
                $scope.showEditor = true;
                // Force apply to update view
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
                setTimeout(attachHeaderKeyGuard, 300);
            }, 100); // 200ms to allow text-angular to refresh cleanly
        };


        $scope.ChangeTemplate1 = function (item) {
            // document.getElementById('htmlcontentconsent1').innerHTML = "";
            $scope.mainConsentObj.Notes = "";
            if (item && item.PDFcontent) {
                $scope.mainConsentObj.Notes = item.PDFcontent;
                document.getElementById('htmlcontentconsent1').innerHTML = item.PDFcontent;
            }


        };
        $scope.ClearFaxPatientValues = function () {
            $scope.mainConsentObj.Notes = "";
            //document.getElementById('htmlcontentconsent1').innerHTML = "";
        }
        $scope.uibclose = function () {
            $uibModalInstance.dismiss("cancel");
        };

        $scope.ChangesTab = function (tab) {
            $scope.EmailSubTab = tab;
            if ($scope.EmailSubTab == 1) {
                $scope.eObj = getEmailReqObj();

            }
            if ($scope.EmailSubTab == 3) {
                $scope.eObj = getEmailReqObj();
                $scope.eObj.DoctorEmail = appoint_info.PatientDetails.EmailId || '';
                let DoctorName = $scope.SelectedObj.DoctorName || '';
                let HospitalName = doctorinfo.doctordata.UserAddress[0].ClinicName || '';
                $scope.eObj.TextBody = "Hello,\n This is Dr." + DoctorName + " from " + HospitalName + ", would like to share case sheet with you.\n Thankyou, ";

            }
        }
        $scope.viewAttachment = function (item) {
            var url = item.S3URL;
            window.open(url);
        };
        $scope.splitpdfpagepopup = function (item) {
            $scope.selectedRowId = item.TransactionId;
            $scope.mInstanceAddC = $uibModal.open({
                "templateUrl": "templates/UsNewConsultation/uibpopup/SplitPdfPageDataView.html",
                "backdrop": "static",
                "keyboard": false,
                "windowClass": "modal__ninetynine-- z-index-six",
                "resolve": {
                    "mainObject": function () { return item; }
                },
                "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService, eHnotePatientDataService, mainObject, eHnoteUserDataService) {
                    console.log(mainObject);
                    $scope.ParentHospitalId = 0;
                    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined &&
                        doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
                        $scope.ParentHospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
                        $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
                    }

                    $scope.UserId = mainObject.UserId;
                    $scope.HospitalId = mainObject.HospitalId;
                    $scope.closeuibpopup = function () {
                        $uibModalInstance.dismiss("cancel");
                    };

                    $scope.MainFaxItem = mainObject;

                    $scope.GetSplitPdfPageData = function () {
                        var object = {
                            "InBoundTransactionId": $scope.MainFaxItem.InBoundTransactionId
                        };
                        eHnotePatientDataService.GetSplitPdfPageData(object).then(function (resp) {
                            if (resp.data.Status === "Success") {
                                var combinedList = [];

                                angular.forEach(resp.data.rows, function (patient) {
                                    if (patient.selectedPdfUrls && patient.selectedPdfUrls.length > 0) {
                                        patient.selectedPdfUrls.forEach(function (pdf) {
                                            pdf.PatientFirstName = pdf.FirstName;
                                            pdf.PatientLastName = pdf.LastName;
                                            pdf.PatientDisplayId = pdf.PatientDisplayId;
                                            pdf.SplitStatus = pdf.SplitStatus;

                                            combinedList.push(pdf);
                                        });
                                    }
                                });

                                $scope.Splitpdfpagedata = combinedList;
                                if (combinedList.length > 0) {
                                    $scope.SplitviewAttachment(combinedList[0]);

                                    $timeout(function () {
                                        const firstRow = document.querySelector('tr[ng-repeat]');
                                        if (firstRow) firstRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    }, 300);
                                }
                            }
                        });
                    };

                    $scope.GetSplitPdfPageData();
                    $scope.selectRow = function (item) {
                        $scope.selectedRow = item;

                        $timeout(function () {
                            const activeRow = document.querySelector('tr.row-active');
                            if (activeRow) {
                                activeRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }
                        }, 200);
                    };

                    $scope.SplitviewAttachment = function (item) {
                        $scope.selectedRow = item;
                        $scope.SelectedPdfName = item.FileName;
                        $scope.SelectedPdfUrl = item.FileUrl;// This must be a public or signed URL to a PDF
                    };

                    $scope.getsplittrustedview = function (url) {
                        //if (!url) return null;
                        //var encodedUrl = encodeURIComponent(url);
                        //var viewerUrl = 'https://docs.google.com/gview?embedded=true&url=' + encodedUrl + "#pagemode=none&zoom=66";
                        //return $sce.trustAsResourceUrl(viewerUrl);
                        var modifiedUrl = url + "#pagemode=none&zoom=66";
                        return $sce.trustAsResourceUrl(modifiedUrl);
                    };

                }

            });
            $scope.mInstanceAddC.result.then(function (resp) {
                console.log(resp);
                $timeout(function () {
                    const row = document.querySelector('[data-fax-id="' + $scope.selectedRowId + '"]');
                    if (row) row.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            }, function (cancel) {
                console.log("connect refresh");
            });
        };
        $scope.SplitviewAttachment = function (item) {
            var url = item.FileUrl;
            window.open(url);
        }
        $scope.navtoDocumentsPopup = function () {
            $scope.AppointmentPatientdata = [];
            $scope.AppointmentPatientdata.push(doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalAddress);
            $scope.SelectedObj.PatientId = appoint_info.PatientID || 0;
            $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
            $scope.SelectedPatientobj = {
                "FullName": $scope.cacheStorageItem.FullName,
                "S3URL": $scope.cacheStorageItem.S3URL,
                "PatientDisplayId": $scope.cacheStorageItem.PatientDisplayID,
                "Gender": $scope.cacheStorageItem.Gender,
                "Age": $scope.cacheStorageItem.Age,
                "DOB": $scope.cacheStorageItem.DOB,
            };


            var sobj = {
                "mainitem": $scope.SelectedApptObj,
                "UserId": $scope.UserId,
                "HospitalId": $scope.HospitalId,
                "AppointmentId": appoint_info.AppointmentId,
                "ParentHospitalId": $scope.ParentHospitalId,
                "PatientId": appoint_info.PatientID,
                "HospitalAddress": $scope.AppointmentPatientdata,
                "ConsentTemplateId": 0,
                "selectedArray": [],
                "selectedObj": "",
                "Page": "List",
                "PatientDetails": $scope.SelectedPatientobj || '',
            }

            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/DocumentsPopup.html",
                "backdrop": "static",
                "resolve": {
                    "ParentObject": function () { return sobj; }
                },
                "keyboard": false,
                "controller": "UsPatientDocumentsCtrl",
                "windowClass": "modal__popup--1 bottom-to-top-modal"
            });
            $scope.mInstanceAdd.result.then(function (result) {
                //console.log(result);
            }, function (cancel) {
            });
        }

        $scope.Includeclinicalsummary = function () {

            console.log($scope.SelectedPatientId)
            $scope.SelectedPatientId = $scope.SelectedPatientId || 0;
            if ($scope.SelectedPatientId == 0) {
                alertify.error("Please select a patient");
                return false;
            }
            let resolveObj = {
                "ChartObj": angular.copy($scope.SelectedObj),
                "categoryListObj": $scope.GetCategoryListObj,
                "chartSelectAllObj": $scope.ChartSelectALLobj,
                "PastVisitSummaryGrid": $scope.PastVisitSummaryGrid,
                "TempIsCheckArray": $scope.TempIsCheckArray,
                "ParentHospitalId": $scope.ParentHospitalId,
                "clinicDoctorList": $scope.clinicDoctorList
            }

            let mInstancesummaryAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/Includeclinicalsummary.html",
                //"size": "lg",
                "backdrop": "static",
                "keyboard": false,
                "resolve": {
                    "resolveObj": function () { return resolveObj}
                },
                "windowClass": "modal__popup--1 bottom-to-top-modal  ",
                "controller":"USFaxAttachmentGenerator"
            });
            mInstancesummaryAdd.result.then(function (resp) {

                resp = resp || {};
                var attachments = resp.attachments || [];
                var categoryList = resp.categoryList || [];
                var chartSelectAllObj = resp.chartSelectAllObj || {};
                var PastVisitSummaryGrid = resp.PastVisitSummaryGrid || {};
                var TempIsCheckArray = resp.TempIsCheckArray || [];
                var attachmentObj = {
                    "FileId": 0,
                    "FileName": attachments[0].FileName,
                    "S3URL": attachments[0].S3URL,
                    "fileUrl": attachments[0].S3URL,
                    "ExternalFileName": null,
                    "FileExt": attachments[0].FileExt || null,
                    "ConsultationId": null,
                    "MimeType": null,
                    "CreatedByUser": attachments[0].CreatedByUser,
                    "CreatedDate": attachments[0].CreatedDate,
                    "DeleteInd": "N",
                    "DirectSecureMessageId": 0
                };
                $scope.eObj.AttachmentsArray.push(attachmentObj);

                $scope.GetCategoryListObj = categoryList;
                $scope.ChartSelectALLobj = chartSelectAllObj;
                $scope.PastVisitSummaryGrid = PastVisitSummaryGrid;
                $scope.TempIsCheckArray = TempIsCheckArray;
                if (attachments.length > 0) {
                    angular.forEach(attachments, function (fitem) {
                        var attachmentObj = {
                            "FileId": 0,
                            "fileName": fitem.FileName,
                            "fileUrl": fitem.S3URL,
                            "ExternalFileName": fitem.ExternalFileName,
                            "FileExt": fitem.FileExt||"",
                            "ConsultationId": null,
                            "MimeType": null,
                            "CreatedByUser": doctorinfo.doctordata.User[0].FullName,
                            "CreatedDate": $scope.currentdate,
                            "DeleteInd": "N",
                            "DirectSecureMessageId": 0
                        };
                        $scope.AttachmentdDocumnets.push(attachmentObj);
                        $scope.AttachmentdDocumnets = $scope.AttachmentdDocumnets.filter(function (item, index, self) {
                            return index === self.findIndex(function (a) {
                                return (a.fileName || a.FileName) === (item.fileName || item.FileName);
                            });
                        });
                    });
                }

            }, function () {
                // Modal dismissed
            });
        };


        //$scope.SendCCDAandPdfAttachmentsToMail = function () {
        //    if ($scope.eObj.DoctorEmail == '') {
        //        alertify.error("Enter To Email Address");
        //        return false;
        //    }
        //    if ($scope.eObj.IsChartPdfChecked == false && $scope.eObj.IsChartCCDAChecked == false) {
        //        if ($scope.eObj.Subject == '') {
        //            alertify.error("Enter Subject ");
        //            return false;
        //        }
        //    }
        //    $scope.eObj.TextBody = $scope.mainConsentObj.HtmlContent || '';
        //    if ($scope.eObj.TextBody == '') {
        //        alertify.error("Enter TextBody ");
        //        return false;
        //    }


        //    if ($scope.eObj.IsChartPdfChecked == false && $scope.eObj.IsChartCCDAChecked == false) {
        //        var AppointmentId = $scope.eObj.AppointmentId;
        //        var ConsultationId = $scope.eObj.ConsultationId;
        //        var type = 0;
        //        if (ConsultationId === 0) {
        //            type = 1;
        //        }
        //        var req = {
        //            "AppointmentId": AppointmentId,
        //            "Type": type
        //        };
        //        eHnotePatientDataService.GetPatientConsultationDetailsByApptId(req).then(function (resp) {
        //            if (resp.data != undefined) {
        //                if (resp.data.length !== 0) {
        //                    $scope.ConsultationMailMsg = resp.data;
        //                    $scope.ConsultationDataByApptIdArray = [];
        //                    angular.forEach(resp.data, function (item) {
        //                        if (AppointmentId === item.AppointmentId) {
        //                            // to show appointmnt date, time and doctor name
        //                            let ApptTime = item.AppointmentDt + ' ' + item.AppointmentTime;
        //                            ApptTime = $filter('date')(new Date(ApptTime), "hh:mm a");
        //                            item.AppointmentTime = ApptTime;
        //                            $scope.ConsultationDataByApptIdArray.push(item);
        //                        }
        //                    });
        //                }
        //                if ($scope.ConsultationDataByApptIdArray.length > 0) {
        //                    var TempConsultationPlan = angular.copy($scope.ConsultationDataByApptIdArray[0]);
        //                    TempConsultationPlan.emailAddresses = $scope.eObj.DoctorEmail || "";
        //                    TempConsultationPlan.subject = $scope.eObj.Subject || "";
        //                    TempConsultationPlan.TextBody = $scope.eObj.TextBody || "";
        //                    TempConsultationPlan.IsChartCCDAChecked = $scope.eObj.IsChartCCDAChecked;
        //                    TempConsultationPlan.IsChartPdfChecked = $scope.eObj.IsChartPdfChecked;

        //                    var Conreq = {
        //                        "UserId": $scope.UserId,
        //                        "ConsultationId": TempConsultationPlan.ConsultationId || "",
        //                        "AppointmentId": TempConsultationPlan.AppointmentId || "",
        //                        "AppointmentDt": TempConsultationPlan.AppointmentDt || "",
        //                        "AppointmentDate": TempConsultationPlan.AppointmentDt || "",
        //                        "PatientId": TempConsultationPlan.PatientArray[0].PatientId || "",
        //                        "AppointmentTime": TempConsultationPlan.AppointmentTime || "",
        //                        "Appointmentwith": TempConsultationPlan.Appointmentwith || "",
        //                        "DoctorId": TempConsultationPlan.DoctorId || "",
        //                        "DoctorName": TempConsultationPlan.Appointmentwith || "",
        //                        "isSendRefLetterMail": false,
        //                        "BranchId": TempConsultationPlan.BranchId || "",
        //                        "BranchName": TempConsultationPlan.BranchName || "",
        //                        "BranchPhone": TempConsultationPlan.BranchMobile || "",
        //                        "BranchEmail": TempConsultationPlan.BranchEmail || "",
        //                        "BranchAddress": TempConsultationPlan.BranchAddress || "",
        //                        "PatientName": TempConsultationPlan.PatientArray[0].FullName || "",
        //                        "ReferalDoctorName": TempConsultationPlan.ReferalDoctorName || "",
        //                        "emailAddresses": TempConsultationPlan.emailAddresses || '',
        //                        "subject": TempConsultationPlan.subject || '',
        //                        "TextBody": TempConsultationPlan.TextBody || '',
        //                        "IsChartCCDAChecked": TempConsultationPlan.IsChartCCDAChecked,
        //                        "IsChartPdfChecked": TempConsultationPlan.IsChartPdfChecked,
        //                    }
        //                    Conreq.isSendRefLetterMail = false;
        //                    Conreq.IsMailFromWebApp = true;
        //                    eHnoteDiagnosisDataServices.SendConsultationMsgToMail(Conreq).then(function (resp) {
        //                        if (resp.data.Message = "Success") {
        //                            alertify.success("Mail send Successfully");
        //                            $scope.eObj = getEmailReqObj();
        //                            $scope.mainConsentObj.HtmlContent = '';
        //                            $scope.ClosePop();
        //                        }
        //                        else {
        //                            alertify.success("Mail sending is Failed");
        //                            return false;
        //                        }
        //                    });


        //                }
        //            }
        //        });
        //    }

        //}

        $scope.SendPatientCCDAToMail = function () {

            if ($scope.eObj.DoctorEmail == '') {
                alertify.error("Enter To Email Address");
                return false;
            }
            if ($scope.eObj.Subject == '') {
                alertify.error("Enter Subject ");
                return false;
            }
            if ($scope.eObj.TextBody == '') {
                alertify.error("Enter TextBody ");
                return false;
            }



            var AppointmentId = $scope.eObj.AppointmentId;


            var req2 = {
                "AppointmentId": AppointmentId,
                "Type": 0
            };
            $q.all([

                eHnotePatientDataService.GetPatientConsultationDetailsByApptId(req2),
            ]).then(function (resp) {

                if (resp[0].data.length !== 0) {
                    $scope.ConsultationDataByApptId = resp[0].data;
                    $scope.ConsultationDataByApptIdArray = [];

                    angular.forEach(resp[0].data, function (item) {
                        if (AppointmentId === item.AppointmentId) {
                            // to show appointmnt date, time and doctor name
                            let ApptTime = item.AppointmentDt + ' ' + item.AppointmentTime;
                            ApptTime = $filter('date')(new Date(ApptTime), "hh:mm a");
                            item.AppointmentTime = ApptTime;
                            $scope.ConsultationDataByApptIdArray.push(item);
                        }
                    });
                }

                var IsNKISelected = false;
                if ($scope.ConsultationDataByApptIdArray.length > 0) {
                    var TempConsultationPlan = angular.copy($scope.ConsultationDataByApptIdArray[0]);
                    TempConsultationPlan.emailAddresses = $scope.eObj.DoctorEmail || "";
                    TempConsultationPlan.IsChartCCDAChecked = $scope.eObj.IsChartCCDAChecked;
                    TempConsultationPlan.IsChartPdfChecked = $scope.eObj.IsChartPdfChecked;
                    TempConsultationPlan.IsMailFromPatientPortal = $scope.eObj.IsMailFromPatientPortal || "";
                    TempConsultationPlan.IsMailFromWebApp = $scope.eObj.IsMailFromWebApp || "";

                    var BranchMobile = eHnoteUserDataService.UsMobileFormatChange(TempConsultationPlan.BranchMobile);
                    TempConsultationPlan.BranchMobile = BranchMobile.UsFormatMobileNumber;

                    var PhoneNumber = eHnoteUserDataService.UsMobileFormatChange(TempConsultationPlan.PatientArray[0].PhoneNumber);
                    var ContactNo = eHnoteUserDataService.UsMobileFormatChange(TempConsultationPlan.PatientArray[0].ContactNo);
                    TempConsultationPlan.PatientArray[0].PhoneNumber = PhoneNumber.UsFormatMobileNumber;
                    if (TempConsultationPlan.PatientArray[0].ContactNo.length > 10) {
                        TempConsultationPlan.PatientArray[0].ContactNo = ContactNo.UsFormatMobileNumber;
                    } else {
                        TempConsultationPlan.PatientArray[0].ContactNo = "";
                    }
                    TempConsultationPlan.PatientArray[0].DOB = TempConsultationPlan.PatientArray[0].DOB || "";

                    var Conreq = {
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
                        "BVPossibleDiagnosis": TempConsultationPlan.BVPossibleDiagnosis || "",
                        "BranchArea": TempConsultationPlan.BranchArea || "",
                        "BranchPhoneNo": TempConsultationPlan.BranchMobile || "",
                        "BranchEmail": TempConsultationPlan.BranchEmail || "",
                        "BranchAddress": TempConsultationPlan.BranchAddress || "",
                        "PatientName": TempConsultationPlan.PatientArray[0].FullName || "",
                        "PreviousName": TempConsultationPlan.PatientArray[0].PreviousName || "",
                        "ReferalDoctorName": TempConsultationPlan.ReferalDoctorName || "",
                        "emailAddresses": TempConsultationPlan.emailAddresses || '',
                        "OrgGSTNO": TempConsultationPlan.AppointmentId || "",
                        "PatientDisplayId": TempConsultationPlan.PatientArray[0].PatientDisplayId || "",
                        "PatientGender": TempConsultationPlan.PatientArray[0].PatientGender || "",
                        "TitleId": TempConsultationPlan.PatientArray[0].TitleId || "",
                        "PatientAge": TempConsultationPlan.PatientArray[0].PatientAge || "",
                        "PatientGst": TempConsultationPlan.AppointmentId || "",
                        "PatientPhoneNumber": TempConsultationPlan.PatientArray[0].PhoneNumber || "",
                        "ContactNo": TempConsultationPlan.PatientArray[0].ContactNo || "",
                        "PatientDOB": TempConsultationPlan.PatientArray[0].DOB || "",
                        "PachymetryAvgODValue": TempConsultationPlan.PachymetryAvgODValue || "",
                        "PachymetryAvgOSValue": TempConsultationPlan.PachymetryAvgOSValue || "",
                        "ChiefComplaints": [],
                        "ImplantList": [],
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
                        "IsChartCCDAChecked": TempConsultationPlan.IsChartCCDAChecked,
                        "IsChartPdfChecked": TempConsultationPlan.IsChartPdfChecked,
                        "subject": TempConsultationPlan.subject || '',
                        "TextBody": TempConsultationPlan.TextBody || '',
                        "NearInvestigationdetails": TempConsultationPlan.NearInvestigationdetails || [],
                        "LacrimalPatencyRemarks": TempConsultationPlan.LacrimalPatencyRemarks || "",
                        "IsMailFromWebApp": TempConsultationPlan.IsMailFromWebApp || false,
                        "IsMailFromPatientPortal": TempConsultationPlan.IsMailFromPatientPortal || false,
                        "PupilSizeRemarks": TempConsultationPlan.PupilSizeRemarks || "",
                        "PachymetryRemarks": TempConsultationPlan.PachymetryRemarks || "",
                        "DilationArray": TempConsultationPlan.DilationArray || [],
                        "LabInvestigations": TempConsultationPlan.LabInvestigations || [],
                        "PhysicalEvaluation": TempConsultationPlan.CustomAllergyRemarks || [],
                        "PsychiatryData": TempConsultationPlan.PsychiatryData || [],
                        "ROSOverAllRemarks": TempConsultationPlan.ROSOverAllRemarks,
                        "OPProcedures": TempConsultationPlan.OPProceduresArray || [],
                        "CurrentSystemicHistory": TempConsultationPlan.CurrentSystemicMedicationsHistory || [],
                        "ROSAllergyHeaders": [],
                        "IsNKISelected": IsNKISelected,
                        "PsychologicalObservations": $scope.ScoreObject,
                        "labinvestigationNotes": TempConsultationPlan.labinvestigationNotes || "",
                        "OverallProcedureNotes": TempConsultationPlan.OverallProcedureNotes || ""
                    }
                    Conreq.isSendRefLetterMail = false;
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
                                "PatientName": TempConsultationPlan.PatientArray[0].FullName || "",
                            }
                            Conreq.ChiefComplaints.push(checifobj);
                        })
                    }

                    TempConsultationPlan.ImplantList = TempConsultationPlan.ImplantList || [];
                    if (TempConsultationPlan.ImplantList.length > 0) {
                        angular.forEach(TempConsultationPlan.ImplantList, function (ImpItem) {
                            var Impobj = {
                                "DeviceDescription": ImpItem.DeviceDescription || 0,
                                "Location": ImpItem.Location || "",
                                "UDI": ImpItem.UDI || ""
                            }
                            Conreq.ImplantList.push(Impobj);
                        })
                    }
                }
                //Pdf Mail Sending
                $scope.eObj.IsChartPdfChecked = true;
                if ($scope.eObj.IsChartPdfChecked) {
                    Conreq = Conreq || "";
                    Conreq.IsChartPdfChecked = $scope.eObj.IsChartPdfChecked;
                }
                else {
                    Conreq.IsChartPdfChecked = $scope.eObj.IsChartPdfChecked;
                }
                //CCDA Link 

                if ($scope.eObj.TextBody != "") {
                    Conreq.EmailBody = $scope.eObj.TextBody || "";
                } else {
                    Conreq.EmailBody = "";
                }

                Conreq.IsMailFromWebApp = true;
                Conreq.IsMailFromPatientPortal = false;
                eHnoteDiagnosisDataServices.GetSendConsultationPdfCCDAAttachmentToMail(Conreq).then(function (resp) {
                    if (resp.data.Message == "Success") {
                        alertify.success("Mail send Successfully");
                        $scope.eObj = getEmailReqObj();
                        $scope.ClearAll();
                        $scope.ClearPatientInfo();
                    }
                });
            }, function (err) {
                //console.log(err);
                alertify.error("Getting Data Failed");
            });


        }





        $scope.SendPHIEmail = function () {


            if ($scope.newSendEmailReqObj.ToEmail == '') {
                alertify.error("Enter To Email");
                return false;
            }
            if ($scope.newSendEmailReqObj.EmailSubject == '') {
                alertify.error("Enter Subject");
                return false;
            }
            $scope.newSendEmailReqObj.EmailBody = $scope.mainConsentObj.HtmlContent || '';
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

            //console.log(params);


            eHnoteMainAppointmentService.AddUpdateAppointmentReminderDetails(params).then(function (resp) {

                //console.log(resp);


                $scope.newSendEmailReqObj.AppointmentReferalId = resp.data.AppointmentReferalId;

                eHnoteDiagnosisDataServices.SendPhiEmailData($scope.newSendEmailReqObj).then(function (response) {


                    //console.log(JSON.stringify(response))
                    if (response.data.status === 'Success') {
                        $scope.newSendEmailReqObj = getSendEmailEmptyRequestObj();
                        $scope.PatientData.PatientId = 0;
                        $scope.PatientSearch.SearchText = "";
                        $scope.treatmentArray = [];
                        alertify.success("Email Sent Successfully");

                    } else {
                        alertify.error(response.data.Message);
                    }

                });


            }, function (err) {
                alertify.error("Getting Failed");
            })






        };







        $scope.RemoveAttachment = function (item) {

            let index = $scope.eObj.AttachmentsArray.indexOf(item);
            if (index > -1) {
                $scope.eObj.AttachmentsArray.splice(index, 1);
            }
            if ($scope.eObj.AttachmentsArray.length === 0) {
                $scope.eObj.DocumentType = "";
            }
        };


        $scope.AttachmentdDocumnets = $rootScope.AttachmentdDocumnets || [];

        // Watch for changes in $rootScope.AttachmentdDocumnets
        $scope.$watch(function () {
            return $rootScope.AttachmentdDocumnets;
        }, function (newVal) {
            if (newVal) {
                $scope.AttachmentdDocumnets = angular.copy(newVal);
            }
        });
        $scope.scanInsImageDocuments = function (type) {
            console.log(type);

            var obj = {
                "PatientId": $scope.SelectedObj.PatientID || null,
                "AppointmentId": $scope.SelectedObj.AppointmentId || null,
                "PatientName": $scope.SelectedObj.PatientName || '',
                "Tab": "Insurance",
            }

            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/UsNewConsultation/uibpopup/PatientDocumentScanner.html",
                "backdrop": "static",
                "scope": $scope,
                "size": "md",
                "resolve": {
                    "mainObject": function () { return obj; }
                },
                "windowClass": "modal__eighty--  ",
                "keyboard": false,
                "controller": "DocumentScannerCtrl",

            });

            $scope.mInstanceAdd.result.then(function (result) {
                if (result !== "") {

                    console.log(result);
                    if (type === "front") {
                        $scope.frontItemS3Url = true;
                        $scope.frontS3Url = result.S3URL;
                        result.IsBackSidefile = false;
                        result.DisplayName = "front";
                        result.DocumentName = result.DocumentName || "FrontScan";

                        var attachmentObj = {
                            "FileId": 0,
                            "fileName": result.DocumentName,
                            "fileUrl": result.S3URL,
                            "ExternalFileName": result.DocumentName,
                            "FileExt": null,
                            "ConsultationId": null,
                            "MimeType": null,
                            "CreatedByUser": doctorinfo.doctordata.User[0].FullName,
                            "CreatedDate": $scope.currentdate,
                            "DeleteInd": "N",
                            "DirectSecureMessageId": 0
                        };
                        $scope.AttachmentdDocumnets.push(attachmentObj);
                        console.log($rootScope.AttachmentdDocumnets);
                    }
                }
            }, function (cancel) {
            });

        }

        $scope.clearfaxDetails = function () {
            $scope.selectedDoctor = null;
            $scope.selectedClinic = null;
            $scope.faxobj.callerId = null;
            $scope.selectedProvider = null;
            $scope.OrgnizationName = null;
            $scope.faxNumber = null;
            $scope.selectedPCP = null;
            $scope.ToOrgnizationName = null;
            $scope.PaitentDetails.FullName = null;
            $scope.reffaxNumber = null;
            $scope.selectedReferal = null;
            $scope.AttachmentdDocumnets = null;
            $scope.mainConsentObj.Notes = null;
            $scope.subject = null;
            $scope.Priority = false;
            $scope.frontItemS3Url = false;
            $scope.frontS3Url = null;
        }
        //$scope.changeFromFaxNumber = function (item) {
        //    
        //    $scope.faxobj.callerId = item;
        //};

        $scope.selectedOption = null;
        $scope.SelectedTolist = [];
        $scope.SelectedOpt = 2;
        $scope.AddToData = function (item, option) {
            $scope.USnumberString = item.faxNumber || "";

            if (option.isChecked) {

                if ($scope.USnumberString !== "") {
                    const cleanedNumber = item.faxNumber.replace(/\D+/g, '');
                    if (cleanedNumber.length === 10) {
                        item.cleanFaxNumber = cleanedNumber;
                    }
                }
                item.disabled = true;
                $scope.SelectedTolist.push(item);
            } else {

                $scope.SelectedTolist = $scope.SelectedTolist.filter(i => i !== item);
                item.selectedProvider = "";
                item.PatientFullName = "";
                item.ToProviderdata = "";
                item.OrgnizationName = "";
                item.faxNumber = "";
            }
        };

        //$scope.AddToData = function (item,option) {
        //    
        //    $scope.USnumberString = item.faxNumber || "";
        //    if ($scope.USnumberString !== "") {
        //        const cleanedNumber = item.faxNumber.replace(/\D+/g, '');
        //        if (cleanedNumber.length === 10) {
        //            item.cleanFaxNumber = cleanedNumber;
        //        } 
        //    }
        //    item.disabled = true;
        //    $scope.SelectedTolist.push(item);

        //    //console.log($scope.SelectedTolist);
        //    //$scope.USnumberString = option.ToProderList[0].faxNumber || "";
        //    //if ($scope.USnumberString !== "") {
        //    //    const cleanedNumber = option.ToProderList[0].faxNumber.replace(/\D+/g, '');
        //    //    if (cleanedNumber.length === 10) {
        //    //        option.ToProderList[0].cleanFaxNumber = cleanedNumber;
        //    //    } 
        //    //}
        //    //option.ToProderList[0].disabled = true;
        //    //$scope.SelectedTolist.push(option);
        //};

        $scope.onProviderChange = function (selectedOption) {

            $scope.faxNumber = "";
            $scope.searchDoctors = [];
            $scope.selectedProvider = null;
            if (selectedOption.TypeId == 2 || selectedOption.TypeId == 7 || selectedOption.TypeId == 1) {
                $scope.SelectedOpt = selectedOption.TypeId;
                $scope.searchPharmacyDoctors(selectedOption.TypeId);


            } else if (selectedOption.TypeId == 0) {
                $scope.SelectedOpt = selectedOption.TypeId;
                const patientData = $scope.selectedPatientdata($scope.SelectedPatientId);
                if (patientData && patientData.Patient && patientData.Patient.length > 0) {
                    $scope.PaitentDetails.FullName = patientData.Patient[0].FullName;
                    $scope.PaitentDetails.faxNumber = patientData.Patient[0].FaxNumber;
                    $scope.ToTemplateData.PatientFullName = $scope.PaitentDetails.FullName;
                    $scope.ToTemplateData.faxNumber = patientData.Patient[0].FaxNumber;
                } else {
                    console.log("No patient data available.");
                }
            }
            else {

            }
        };
        $scope.SetLastOpenedFax = function (faxId) {
            eHnoteCacheStorageService.addCacheStorage({ lastOpenedFaxId: faxId });
        };

        $scope.navtoConnectPatient = function (citem) {
            var obj = {
                "apptitem": "",
                "faxItem": citem,
                "UserId": $scope.UserId,
                "HospitalId": $scope.HospitalId
            }
            $scope.mInstanceAddC = $uibModal.open({
                "templateUrl": "templates/UsNewConsultation/uibpopup/PatientFaxViewerandConnect.html",
                "backdrop": "static",
                "keyboard": false,
                "windowClass": "modal__ninetynine--  ",
                "resolve": {
                    "mainObject": function () { return obj; }
                },
                "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService, mainObject, eHnoteUserDataService) {
                    console.log(mainObject);
                    $scope.ParentHospitalId = 0;
                    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
                        $scope.ParentHospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
                        $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
                    }
                    $scope.UserId = mainObject.UserId;
                    $scope.HospitalId = mainObject.HospitalId;


                    $scope.MainFaxItem = mainObject.faxItem;
                    $scope.patientsearchInd = 1;
                    $scope.PatientSearchobj = {
                        "SearchText": ""
                    };
                    $scope.selectedViewer = 'connect';
                    //$scope.gettrustedurl = function (url) {
                    //    var encodedurl = encodeuricomponent(url);
                    //    var modifiedurl = 'https://docs.google.com/gview?embedded=true&url=' + encodedurl + "#pagemode=none&zoom=66";
                    //    return $sce.trustasresourceurl(modifiedurl);

                    //}
                    $scope.closeuibpopup = function () {
                        $uibModalInstance.dismiss("cancel");
                    };

                    $scope.clearSearchDetails = function () {
                        $scope.PatientSearchobj.SearchText = "";

                        $scope.MergingPatient.PatientId = 0;
                        $scope.MergingPatient.FullName = "";
                        $scope.MergingPatient.FirstName = "";
                        $scope.MergingPatient.LastName = "";
                        $scope.MergingPatient.Gender = "";
                        $scope.MergingPatient.DOB = "";
                        $scope.MergingPatient.Age = "";
                        $scope.MergingPatient.MobileNo = "";
                        $scope.MergingPatient.ContactNo = "";
                        $scope.MergingPatient.EmailId = "";
                        $scope.MergingPatient.PatientDisplayId = "";
                        $scope.MergingPatient.OldMrno = "";
                        $scope.MergingPatient.PatientInsuranceDetails = [];
                        $scope.MergeAddReqObj.MergedPatientId = 0;
                        $scope.MergeAddReqObj.MergeRemarks = null;
                        $scope.ShowPatientListDrop = true;
                        $scope.MergingPatient.CreatedDt = "";
                        $scope.MergingPatient.CreatedBy = "";
                        $scope.PatientsArray = [];
                    };

                    $scope.MergeAddReqObj = {
                        "CurrentPatientId": $scope.PatientId,
                        "AppointmentId": $scope.AppointmentId,
                        "MergedPatientId": 0,
                        "UserId": $scope.UserId,
                        "MergeRemarks": ""
                    };





                    $scope.MergingPatient = {
                        "PatientId": 0,
                        "FirstName": "",
                        "LastName": "",
                        "FullName": "",
                        "Gender": "",
                        "DOB": "",
                        "Age": "",
                        "MobileNo": "",
                        "ContactNo": "",
                        "EmailId": "",
                        "PatientDisplayId": "",
                        "OldMrno": "",
                        "CreatedDt": "",
                        "CreatedBy": "",
                        "PatientInsuranceDetails": []
                    };
                    $scope.ShowPatientListDrop = false;
                    $scope.SearchPatientByMrNO = function () {
                        $scope.activeIndex = 0;
                        if ($scope.PatientSearchobj.SearchText != '') {
                            $scope.PatientsArray = [];
                            var name = $scope.PatientSearchobj.SearchText;
                            //if ($scope.patientsearchInd === 5) {
                            //    name = name + " 00:00:00";

                            //    var parsedDate = new Date(name);
                            //    if (!isNaN(parsedDate.getTime())) {
                            //        name = $filter('date')(parsedDate, "yyyy-MM-dd");
                            //    } else {

                            //        alertify.error("Invalid date format:", name);
                            //        name = "";

                            //        return false;
                            //    }
                            //}
                            if (/^\d{8}$/.test(name)) {

                                var month = name.substring(0, 2);
                                var day = name.substring(2, 4);
                                var year = name.substring(4, 8);

                                var formattedDate = year + "-" + month + "-" + day;
                                var parsedDate = new Date(formattedDate);

                                if (!isNaN(parsedDate.getTime())) {
                                    name = formattedDate;
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

                                    param.StartDate = name;
                                    param.hasparam = true;
                                    param.SearchText = "";
                                    param.PhoneNumber = "";
                                } else {
                                    param = {
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
                                    param.PhoneNumber = name;
                                    param.hasparam = true;
                                    param.SearchText = "";
                                }
                            }



                            if (name.includes("/") || name.includes("-")) {
                                // Replace '/' with '-' to maintain consistency
                                name = name.replace(/\//g, "-");
                                // Parse the date
                                var parsedDate = new Date(name + " 00:00:00");

                                if (!isNaN(parsedDate.getTime())) {
                                    // If it's a valid date, format it correctly
                                    name = $filter('date')(parsedDate, "yyyy-MM-dd");
                                } else {
                                    // Handle invalid date input
                                    if ($scope.patSearchType === 5) {
                                        alertify.error("Invalid date format: " + name);
                                        name = "";
                                        return false;
                                    }
                                }
                            }

                            if (name && name.length >= 4) {
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

                                param.SearchText = name;
                                param.hasparam = true;
                                param.PhoneNumber = "";
                                param.UserId = eHnoteMasterDataService.getLoginId();

                                var list = [];
                                list.push($scope.HospitalId);
                                param["HospitalIDLst"] = list;
                                var doctorinfoaccess = eHnoteMasterDataService.getUserInfo();
                                eHnoteMasterDataService.addPatientSearchInfo(param);

                                var object = {
                                    "UserId": $scope.UserId,
                                    "HospitalID": $scope.HospitalId,
                                    "HospitalIDLst": param.HospitalIDLst.toString(),
                                    "SearchText": param.SearchText || "",
                                    "SearchTypeID": $scope.patientsearchInd || 0,
                                    "ParentOrganizationId": $scope.ParentHospitalId

                                }
                                eHnotePatientDataService.SearchAllPatientDataNew(object, OnGetopSearchPatientSuccess, OnGetopPatientSearchError, "");
                            }
                        }

                    };

                    function OnGetopSearchPatientSuccess(response) {

                        console.log(response)
                        if (response.count > 0) {
                            $scope.count = response.count;
                            if (response.rows.length > 0) {
                                console.log(response.rows[0]);
                                if ($scope.patientsearchInd == 4 || $scope.patientsearchInd == 2) {

                                    if (response.rows[0].PatientId === $scope.MergeAddReqObj.CurrentPatientId) {
                                        alertify.error("Same patient cannot be merged");
                                        return false;
                                    }

                                    $scope.MergingPatient.PatientId = response.rows[0].PatientId || 0;
                                    $scope.MergingPatient.FullName = response.rows[0].FullName || "";
                                    $scope.MergingPatient.FirstName = response.rows[0].FirstName || "";
                                    $scope.MergingPatient.LastName = response.rows[0].LastName || "";
                                    $scope.MergingPatient.Gender = response.rows[0].Gender || "";
                                    $scope.MergingPatient.DOB = response.rows[0].DOB || "";
                                    $scope.MergingPatient.Age = response.rows[0].Age || "";
                                    $scope.MergingPatient.MobileNo = response.rows[0].PhoneNumber;
                                    $scope.MergingPatient.ContactNo = response.rows[0].AltHomeNumber;
                                    $scope.MergingPatient.EmailId = response.rows[0].EmailID || "";
                                    $scope.MergingPatient.PatientDisplayId = response.rows[0].DisplayID || "";
                                    $scope.MergingPatient.OldMrno = response.rows[0].OldMrno || "";
                                    $scope.MergingPatient.PatientInsuranceDetails = [];
                                    $scope.MergeAddReqObj.MergedPatientId = $scope.MergingPatient.PatientId;
                                    $scope.MergingPatient.CreatedDt = response.rows[0].CreatedDt || "";
                                    $scope.MergingPatient.CreatedBy = response.rows[0].CreatedBy || "";

                                    if (response.rows[0].AltHomeNumber != '') {
                                        var MNumber = response.rows[0].Altareacode + response.rows[0].AltHomeNumber
                                        var obj = eHnoteUserDataService.UsMobileFormatChange(MNumber);
                                        $scope.MergingPatient.MobileNo = obj.UsFormatMobileNumber;
                                    }
                                } else {

                                    $scope.PatientsArray = response.rows || [];
                                    angular.forEach($scope.PatientsArray, function (pitem) {
                                        pitem.S3URL = "";
                                        var array_list = ['#af77c6', '#e4c120', '#69b3e7', '#ed9945', '#90c752'];
                                        var val = array_list[Math.floor(Math.random() * array_list.length)];

                                        pitem.colors = val;
                                        pitem.S3URL = "";
                                    });

                                    $scope.ShowPatientListDrop = true;
                                }
                            }

                        } else {
                            $scope.count = 0;
                            $scope.PatientsArray = [];
                        }
                    }
                    function OnGetopPatientSearchError() {
                        $scope.count = 0;
                        $scope.PatientsArray = [];
                        $scope.PatientSearchobj.SearchText = "";
                    }

                    $scope.SelectedMergepatient = function (patientitem) {
                        console.log(patientitem.PatientId)
                        $scope.SelectedPatientId = patientitem.PatientId;
                        eHnoteAuditServices.getPatientDetailsById($scope.SelectedPatientId, ongetPatientDetailsSuccess, ongetPatientDetailsError);
                        function ongetPatientDetailsSuccess(response) {
                            if (response.Patient && response.Patient.length > 0) {

                                var patientitem = response.Patient[0];
                                if (patientitem != "") {

                                    if (patientitem.PatientID === $scope.MergeAddReqObj.CurrentPatientId) {
                                        alertify.error("Same patient cannot be merged");
                                        return false;
                                    }

                                    $scope.ShowPatientListDrop = false;
                                    $scope.MergingPatient.PatientId = patientitem.PatientID || 0;
                                    $scope.MergingPatient.FullName = patientitem.FullName || "";
                                    $scope.MergingPatient.FirstName = patientitem.FirstName || "";
                                    $scope.MergingPatient.LastName = patientitem.LastName || "";
                                    $scope.MergingPatient.Gender = patientitem.Gender || "";
                                    $scope.MergingPatient.DOB = patientitem.DOB || "";
                                    $scope.MergingPatient.Age = patientitem.Age || "";
                                    $scope.MergingPatient.MobileNo = patientitem.MobileNo;
                                    $scope.MergingPatient.ContactNo = patientitem.PatientHomeNumber;
                                    $scope.MergingPatient.EmailId = patientitem.EmailId || "";
                                    $scope.MergingPatient.PatientDisplayId = patientitem.PatientDisplayId || "";
                                    $scope.MergingPatient.OldMrno = patientitem.OldMrno || "";
                                    $scope.MergingPatient.PatientInsuranceDetails = [];
                                    $scope.MergeAddReqObj.MergedPatientId = $scope.MergingPatient.PatientId;
                                    $scope.MergingPatient.CreatedDt = patientitem.CreatedDt || "";
                                    $scope.MergingPatient.CreatedBy = patientitem.CreatedBy || "";

                                    if (patientitem.PatientHomeNumber != '') {
                                        var MNumber = patientitem.Altareacode + patientitem.PatientHomeNumber
                                        var obj = eHnoteUserDataService.UsMobileFormatChange(MNumber);
                                        $scope.MergingPatient.MobileNo = obj.UsFormatMobileNumber;
                                    }

                                    $scope.PatientsArray = [];
                                } else {
                                    $scope.changeMergePatientSearch();
                                }

                            }
                        }
                        function ongetPatientDetailsError(error) {
                            console.log(error);
                        }

                    };
                    $scope.ChangePatientSearch = function () {
                        $scope.PatientsArray = [];
                        $scope.PatientSearchobj.SearchText = "";
                        $scope.ShowPatientListDrop = false;
                    }

                    $scope.changeMergePatientSearch = function () {
                        $scope.activeIndex = 0;
                        $scope.MergingPatient.PatientId = 0;
                        $scope.MergingPatient.FullName = "";
                        $scope.MergingPatient.FirstName = "";
                        $scope.MergingPatient.LastName = "";
                        $scope.MergingPatient.Gender = "";
                        $scope.MergingPatient.DOB = "";
                        $scope.MergingPatient.Age = "";
                        $scope.MergingPatient.MobileNo = "";
                        $scope.MergingPatient.ContactNo = "";
                        $scope.MergingPatient.EmailId = "";
                        $scope.MergingPatient.PatientDisplayId = "";
                        $scope.MergingPatient.OldMrno = "";
                        $scope.MergingPatient.PatientInsuranceDetails = [];
                        $scope.MergeAddReqObj.MergedPatientId = 0;
                        $scope.ShowPatientListDrop = false;
                    };


                    $scope.ClearDetails = function () {
                        $uibModalInstance.close("save");
                    }

                    $scope.saveConnectedPatientDetails = function () {



                        if ($scope.MergingPatient.PatientId === 0) {
                            alertify.error("Please Select a Patient To Connect");
                            return false;
                        }

                        console.log($scope.MergingPatient);

                        var object = {
                            "UserId": $scope.UserId,
                            "InBoundTransactionId": $scope.MainFaxItem.InBoundTransactionId,
                            "PatientId": $scope.MergingPatient.PatientId,
                            "PatientConnectedRemarks": $scope.MergeAddReqObj.MergeRemarks,
                        };

                        eHnotePatientDataService.UpdatePatientToIncomingFax(object).then(function (resp) {

                            if (resp.data[0].Status) {
                                alertify.success("saved successfully");
                                $uibModalInstance.dismiss("cancel");
                            }

                        }, function (err) {
                            console.log(err);
                        });


                    }

                    $scope.activeIndex = 0;
                    $scope.PatientsArray = [];

                    $scope.scrollToActiveItem = function () {
                        var container = document.querySelector('.overflow-y-auto.slim-scroll');
                        if (!container) return;

                        var items = container.querySelectorAll('ul.list__unstyled-- li');
                        if ($scope.activeIndex >= items.length) return;

                        var activeItem = items[$scope.activeIndex];
                        if (!activeItem) return;

                        container.scrollTop = activeItem.offsetTop;
                    };


                    $scope.onInputKeydownFaxViewer = function (event) {
                        const len = $scope.PatientsArray.length;
                        switch (event.key) {
                            case 'ArrowDown':
                                if ($scope.activeIndex < len - 1) {
                                    $scope.activeIndex++;
                                    $scope.scrollToActiveItem();
                                }
                                event.preventDefault();
                                break;
                            case 'ArrowUp':
                                if ($scope.activeIndex > 0) {
                                    $scope.activeIndex--;
                                    $scope.scrollToActiveItem();
                                }
                                event.preventDefault();
                                break;
                            case 'Enter':
                                const item = $scope.PatientsArray[$scope.activeIndex];
                                if (item) $scope.SelectedMergepatient(item);
                                event.preventDefault();
                                break;
                        }
                    };
                }
            });
            $scope.mInstanceAddC.result.then(function (resp) {
                console.log(resp);
                $scope.filterInboundFaxes();

            }, function (cancel) {
                console.log("connect refresh");
                $scope.filterInboundFaxes();

            });
        }

        $scope.navtoShowPDFpreview = function (item) {


            var obj = {
                "Item": item
            }
            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/pdfViewerPopup.html",
                "backdrop": "static",
                "scope": $scope,
                "keyboard": false,
                "windowClass": "modal__eighty--",
                "resolve": {
                    "mainObject": function () { return obj; }
                },
                "controller": function ($scope, $uibModal, $uibModalInstance, $sce, eHnotePatientPVService, mainObject, eHnoteUserDataService) {

                    $scope.pdfList = [
                        {
                            name: mainObject.Item.DocumentName, url: mainObject.Item.S3URL,
                            openInDocsViewer: mainObject.Item.Direction === "inbound"
                        },
                    ];
                    $scope.closeuibpopup = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                    $scope.isImageFile = function (url) {
                        var extension = url.split('?')[0].split('.').pop().toLowerCase(); // remove SAS params
                        return ['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(extension);
                    };

                    $scope.getTrustedUrl = function (url, openInDocsViewer) {
                        var extension = url.split('?')[0].split('.').pop().toLowerCase();
                        if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(extension)) {
                            return $sce.trustAsResourceUrl(url); // use <img> instead of iframe
                        }
                        return $sce.trustAsResourceUrl(
                            openInDocsViewer ? 'https://docs.google.com/gview?embedded=true&url=' + encodeURIComponent(url) : url
                        );
                    };




                }
            });
            $scope.mInstanceAdd.result.then(function (resp) {


            }, function (cancel) {
            });
        };
        $scope.GenerateMultiFiles = function () {

            $scope.MultiFiles = $rootScope.AttachmentdDocumnets.map(function (file) {
                return file.fileUrl; // Assuming fileUrl is the URL you want to send
            });
            eHnotePatientDataService.ConvertMultiplePdfFilesToPdf($scope.MultiFiles).then(function (resp) {
                if (resp != undefined) {

                    console.log(resp);
                }
                else {
                    alertify.error("Failed")
                }

            })
        }
        function stripHTML(input) {
            // var docContent = stripHTML($scope.mainConsentObj.Notes) || 'No content available';
            //var obj = {
            //    "content": docContent
            //};
            var div = document.createElement('div');
            div.innerHTML = input || '';
            return div.textContent || div.innerText || '';
        }

        $scope.saveAsDocument = async function () {

            if ($scope.mainConsentObj.Notes !== null && $scope.mainConsentObj.Notes !== "" && $scope.mainConsentObj.Notes !== undefined) {

                const resp = await eHnotePatientDataService.CreateTextPdf($scope.mainConsentObj.Notes);
                if (resp != undefined) {
                    ;
                    console.log(resp)
                    var attachmentObj = {
                        "FileId": 0,
                        "fileName": resp.data.Name,
                        "fileUrl": resp.data.Uri,
                        "ExternalFileName": null,
                        "FileExt": null,
                        "ConsultationId": null,
                        "MimeType": null,
                        "CreatedByUser": doctorinfo.doctordata.User[0].FullName,
                        "CreatedDate": $scope.currentdate,
                        "DeleteInd": "N",
                        "DirectSecureMessageId": 0
                    };

                    if ($scope.AttachmentdDocumnets.length >= 1) {
                        $scope.AttachmentdDocumnets.unshift(attachmentObj);
                    }
                    else {
                        $scope.AttachmentdDocumnets.push(attachmentObj);
                    }
                    $scope.SendFaxRequestAsync();

                }
                else {
                    alertify.error("Failed")

                }
            }
            else {
                $scope.SendFaxRequestAsync();
            }

        };
        $scope.resetFileInput = function (event) {
            event.target.value = null;
        };
        $scope.onChangeLocalFileSelect = function (files) {
            if (!files || !files.length) return;
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'image/gif'];

            const validFiles = files.filter(file => allowedTypes.includes(file.type));

            if (!validFiles.length) {
                alertify.error("Only PDF and image files are allowed.");
                return;
            }
            angular.forEach(files, function (file) {
                if (!file) return;

                var DocumentArray = [{
                    file: [file],
                    DeleteInd: "N",
                    DocumentId: 0,
                    DocumentExt: "",
                    DocumentName: file.name
                }];

                var uploadObj = {
                    UserId: eHnoteMasterDataService.getLoginId(),
                    HospitalId: $scope.HospitalId,
                    S3Url: "",
                    DocumentArray: DocumentArray
                };

                eHnotePatientDataService.GetFileUploadToS3UrlForLocalFiles(uploadObj, function onSuccess(resp) {
                    if (resp) {
                        var attachmentObj = {
                            FileId: 0,
                            FileName: file.name,
                            FileUrl: resp,
                            S3URL: resp,
                            ExternalFileName: null,
                            FileExt: file.type,
                            ConsultationId: null,
                            MimeType: file.type,
                            CreatedByUser: doctorinfo.doctordata.User[0].FullName,
                            CreatedDate: $scope.currentdate,
                            DeleteInd: "N",
                            DirectSecureMessageId: 0
                        };
                        $scope.AttachmentdDocumnets.push(attachmentObj);
                        // $scope.eObj.AttachmentsArray.push(attachmentObj);
                        var exists = $scope.eObj.AttachmentsArray.some(function (a) {
                            return a.FileName === attachmentObj.FileName && a.S3URL === attachmentObj.S3URL;
                        });

                        if (!exists) {
                            $scope.eObj.AttachmentsArray.push(angular.copy(attachmentObj));
                        }
                    }
                }, function onError(err) {
                    alertify.error("File upload failed for: " + file.name);
                });
            });
        };
        $scope.saveDocumentasFax = async function () {
            $scope.SelectedPatientId = $scope.SelectedPatientId || 0;
            /* if ($scope.SelectedPatientId === 0) {
                 alertify.error("Please Select a Patient");
                 return false;
             }*/
            $scope.faxFromObject.selectedDoctor = $scope.faxFromObject.selectedDoctor || '';
            if ($scope.faxFromObject.selectedDoctor == '') {
                alertify.error("Please Select  Provider");
                return false;
            }

            //$scope.faxFromObject.FromFaxNumber = $scope.faxFromObject.FromFaxNumber || '';
            //if ($scope.faxFromObject.FromFaxNumber == '') {
            //    alertify.error("Please Enter From Fax Number");
            //    return false;
            //}

            let numericCallerId = $scope.faxFromObject.FromFaxNumber.replace(/\D/g, '');

            if (numericCallerId.length !== 10) {
                alertify.error("Please enter a valid From Number");
                return;
            }
            $scope.PaitentDetails.faxNumber = $scope.PaitentDetails.faxNumber || '';
            //if ($scope.PaitentDetails.faxNumber == '') {
            //    alertify.error("Please Enter Send Fax Number");
            //    return false;
            //}                  

            //var FaxSendList = $filter("filter")($scope.FaxReceiversList, function (iterator) { return iterator.CategoryId == 0 || iterator.FaxNumber == '' || iterator.ReceiverName == ''; });
            //var lastItem = $scope.FaxReceiversList[$scope.FaxReceiversList.length - 1];
            //if (lastItem.CategoryId == 0 || (lastItem.FaxNumber == ''|| lastItem.ReceiverName == '') {
            //    alertify.error("Please enter the Send To fax number");
            //    return false;
            //}
            var isInvalid = $scope.FaxReceiversList.some(function (item, index) {
                let faxNumber = item.FaxNumber || '';
                faxNumber = faxNumber.replace(/\D/g, '');
                if (item.CategoryId == 0) {
                    alertify.error("Please Select To Details.");
                    return true;
                }
                if (!item.ReceiverName) {
                    alertify.error("Please enter the Receiver Name");
                    return true;
                }

                if (faxNumber.length !== 10) {
                    alertify.error("Please enter valid To Fax Number");
                    return true;
                }

                return false;
            });

            if (isInvalid) {
                return false;
            }

            if (!$scope.SelectedPatientId) {
                $scope.AttachmentdDocumnets = $scope.AttachmentdDocumnets || []
                if ($scope.AttachmentdDocumnets.length === 0) {
                    alertify.error("Please Attach Documents");
                    return false;
                }
            }
            if ($scope.SelectedOrgObj.OrganizationMobileNumber != '') {
                var obj = eHnoteUserDataService.UsMobileFormatChange($scope.SelectedOrgObj.OrganizationMobileNumber);
                $scope.PatientMobileNumber = obj.UsFormatMobileNumber;
            }


            if ($scope.PatientAppointmentConsentForms && $scope.PatientAppointmentConsentForms.length > 0) {
                let item = $scope.PatientAppointmentConsentForms.find(f => f.ConsentTypeName === "Fax Cover Letter");
                if (item) {
                    let HtmlContent = angular.copy(item.PDFcontent) || "";
                    HtmlContent = HtmlContent
                        .replace(/##HospitalName##/g, doctorinfo.doctordata.UserAddress[0].ClinicName || "")
                        .replace(/##HospitalAddress##/g, $scope.SelectedOrgObj.OrganizationAddress[0].Address1 + "," + $scope.SelectedOrgObj.OrganizationAddress[0].Address2 + "," + '' + $scope.SelectedOrgObj.OrganizationAddress[0].CityName + "," + $scope.SelectedOrgObj.OrganizationAddress[0].StateName + "," + $scope.SelectedOrgObj.OrganizationAddress[0].ZipCode + "," + doctorinfo.doctordata.UserAddress[0].CountryName || "")                        .replace(/##FaxFromNumber##/g, $scope.PatientMobileNumber || "",)
                        .replace(/##FaxDate##/g, moment().format("MM-DD-YYYY"))
                        .replace(/##FaxToNumber##/g, $scope.FaxReceiversList[0].FaxNumber || "")
                    // .replace(/##FaxPagesCount##/g, $scope.FaxPagesCount || "");
                    let object = {
                        "HtmlContent": HtmlContent
                    };
                    setTimeout(attachHeaderKeyGuard, 300);
                    const resp = await eHnotePatientDataService.CreateTextForManualPdf(object);

                    if (resp !== undefined) {
                        let attachmentObj = {
                            "FileId": 0,
                            "fileName": resp.data.Name,
                            "fileUrl": resp.data.Uri,
                            "ExternalFileName": null,
                            "FileExt": null,
                            "ConsultationId": null,
                            "MimeType": null,
                            "CreatedByUser": doctorinfo.doctordata.User[0].FullName,
                            "CreatedDate": $scope.currentdate,
                            "DeleteInd": "N",
                            "DirectSecureMessageId": 0
                        };

                        // $scope.AttachmentdDocumnets.unshift(attachmentObj);
                        $scope.AttachmentdDocumnets.splice(0, 0, attachmentObj);
                    } else {
                        console.error("Fax Cover Letter PDF creation failed");
                    }

                }
            }
            if ($scope.mainConsentObj.HtmlContent !== null && $scope.mainConsentObj.HtmlContent !== "" && $scope.mainConsentObj.HtmlContent !== undefined) {
                let HtmlContent = angular.copy($scope.mainConsentObj.HtmlContent) || '';
                if (HtmlContent != '') {
                    let TextBody = document.querySelector('[id^="taTextElement"]').innerHTML;
                    if (TextBody != '') {
                        HtmlContent= angular.copy(TextBody) || '';
                    }
                }
                let object = {
                    "HtmlContent": HtmlContent||""
                }
                setTimeout(attachHeaderKeyGuard, 300);
                const resp = await eHnotePatientDataService.CreateTextForManualPdf(object);
                if (resp != undefined) {

                    console.log(resp)
                    var attachmentObj = {
                        "FileId": 0,
                        "fileName": resp.data.Name,
                        "fileUrl": resp.data.Uri,
                        "ExternalFileName": null,
                        "FileExt": null,
                        "ConsultationId": null,
                        "MimeType": null,
                        "CreatedByUser": doctorinfo.doctordata.User[0].FullName,
                        "CreatedDate": $scope.currentdate,
                        "DeleteInd": "N",
                        "DirectSecureMessageId": 0
                    };

                    //if ($scope.AttachmentdDocumnets.length >= 1) {
                    //    $scope.AttachmentdDocumnets.unshift(attachmentObj);
                    //}
                    //else {
                    //    $scope.AttachmentdDocumnets.push(attachmentObj);
                    //}
                    $scope.AttachmentdDocumnets.splice(1, 0, attachmentObj);
                    $scope.SendFaxRequestAsyncNew();
                    //$scope.SendFaxRequestAsync();
                }
                else {
                    alertify.error("Failed")

                }
            }
            else {
                //$scope.SendFaxRequestAsync();
                $scope.SendFaxRequestAsyncNew();
            }

        };

        $scope.SendFaxRequestAsyncNew = async function () {


            if ($scope.AttachmentdDocumnets.length == 0) {
                alertify.error("Please Attach Atleast One File");
                return false;
            }

            angular.forEach($scope.AttachmentdDocumnets, function (file) {
                if (file.fileName) {
                    file.fileName = file.fileName.replace(/\s+/g, '');
                }
                else if (file.FileName) {
                    file.fileName = file.FileName.replace(/\s+/g, '');
                    delete file.FileName;
                }
            });

            var FaxReceversList = $filter("filter")($scope.FaxReceiversList, function (iterator) {
                return iterator.CategoryId !== 0 && iterator.FaxNumber !== '' && iterator.ReceiverName !== '';
            });

            let faxPromises = FaxReceversList.map(async (fitem, index) => {

                let obj = {
                    "UserId": $scope.UserId,
                    "PatientFaxId": 0,
                    "PatientId": $scope.SelectedPatientId,
                    "OrganizationId": $scope.HospitalId,
                    "AppointmentId": 0,
                    "VisitId": 0,
                    "callerId": $scope.faxobj.Faxcountrycode + $scope.faxobj.FaxAreacode + $scope.faxobj.FaxHomeNumber,
                    "Faxcountrycode": $scope.faxobj.Faxcountrycode,
                    "FaxAreacode": $scope.faxobj.FaxAreacode,
                    "FaxHomeNumber": $scope.faxobj.FaxHomeNumber,
                    "templateId": "",
                    "subject": $scope.faxFromObject.Subject,
                    "Notes": "Hello",
                    "Priority": fitem.IsHighPriority,
                    "from_name": null,
                    "to_name": null,
                    "message": null,
                    "FaxDate": null,
                    "FaxStatusId": 1,
                    "FaxStatus": 'Sending',
                    "FaxStatusCode": null,
                    "JobId": "",
                    "DirectionTypeId": null,
                    "DirectionType": null,
                    "S3URL": null,
                    "DeliveryStatusId": null,
                    "DeliveryStatus": null,
                    "TransactionId": null,
                    "TransactionDate": null,
                    "NumberId": null,
                    "OrderId": null,
                    "FaxCallLength": null,
                    "FaxCallStart": null,
                    "FaxCallEnd": null,
                    "FaxTotalPages": null,
                    "FaxPages": null,
                    "RetryCount": 0,
                    "ExternalId": 0,
                    "DeleteInd": "N",
                    "FromProviderId": $scope.faxFromObject.selectedDoctor.DoctorID,
                    "FromProviderName": $scope.faxFromObject.selectedDoctor.SecondUserFullName,
                    "FromClinicName": $scope.faxFromObject.selectedClinic ? $scope.faxFromObject.selectedClinic.ClinicName : null,
                    "faxData": $scope.AttachmentdDocumnets || [],
                    "ToProviderId": fitem.ReceiverId ? fitem.ReceiverId : $scope.SelectedPatientId,
                    "ToProviderName": fitem.ReceiverName,
                    "ToClinicName": fitem.ClinicName,
                    "faxNumber": fitem.FaxCountryCode + fitem.FaxAreaCode + fitem.FaxHomeNumber,
                    "ParentFaxId": 0,
                    "ToFaxcountrycode": fitem.FaxCountryCode,
                    "ToFaxAreacode": fitem.FaxAreaCode,
                    "ToFaxHomeNumber": fitem.FaxHomeNumber
                };


                return eHnoteDiagnosisDataServices.SendFaxRequestAsync(obj);
            });

            try {
                let results = await Promise.all(faxPromises);
                alertify.success("Fax send Successfully");
                console.log("All fax requests processed successfully", results);
                $scope.$apply(() => { // Force AngularJS to detect changes
                    $scope.FaxReceiversList = [];
                    $scope.AttachmentdDocumnets = [];
                    $scope.selectedDoctor = null;
                    $scope.selectedClinic = null;
                    $scope.faxobj.callerId = null;

                    $scope.faxobj.callerId = "";
                    $scope.faxobj.Faxcountrycode = "+1";
                    $scope.faxobj.FaxAreacode = "";
                    $scope.faxobj.FaxHomeNumber = "";
                    $scope.faxobj.ToFaxcountrycode = "";
                    $scope.faxobj.ToFaxAreacode = "";
                    $scope.faxobj.ToFaxHomeNumber = "";
                    $scope.faxobj.ToRefFaxcountrycode = "";
                    $scope.faxobj.ToRefFaxAreacode = "";
                    $scope.faxobj.ToRefFaxHomeNumber = "";

                    $scope.faxFromObject.selectedDoctor = "";
                    $scope.faxFromObject.selectedClinic = "";
                    $scope.faxFromObject.FromFaxNumber = "";
                    $scope.faxFromObject.Subject = "";
                    $scope.eObj.AttachmentsArray = [];
                    $scope.ClearAll();
                    if ((ChartObj.message === undefined || ChartObj.message !== 1) && (ChartObj.patientclear === undefined || ChartObj.patientclear !== 1)) {
                        $scope.ClearPatientInfo();
                    }
                });

            } catch (error) {
                console.error("Error sending faxes", error);
            }

            $scope.resetfilterOutboundFaxes();
            $scope.resetfilterInboundFaxes();






        }
        $scope.SendFaxRequestAsync = async function () {

            if ($scope.selectedDoctor == null) {
                alertify.error("Please Select  Provider");
                return false;
            }
            //if ($scope.selectedClinic == null) {
            //    alertify.error("Please Select  Clinic Name ");
            //    return false;
            //}
            if ($scope.faxobj.callerId == null) {
                alertify.error("Please Enter From Fax Number");
                return false;
            }
            //if (!$scope.selectedProvider && (!$scope.PaitentDetails || !$scope.PaitentDetails.FullName)) {
            //    alertify.error("Please Select Patient / Provider");
            //    return false;
            //}
            //if ($scope.faxNumber == null) {
            //    alertify.error("Please Enter Patient / Provider  Fax Number");
            //    return false;
            //}
            if ($scope.selectedPCP) {
                if (!$scope.reffaxNumber) {
                    alertify.error("Please Enter PCP / Referal Fax Number");
                    return false;
                }
            }

            if ($scope.AttachmentdDocumnets == null) {
                alertify.error("Please Attach Atleast One File");
                return false;
            }

            var count = ($scope.selectedPCP != null || $scope.selectedReferal != null) ? 2 : 1;
            if (count == 1) {
                for (let i = 0; i < $scope.SelectedTolist.length; i++) {

                    var obj =
                    {
                        "UserId": $scope.UserId,
                        "PatientFaxId": 0,
                        "PatientId": $scope.SelectedPatientId,
                        "OrganizationId": $scope.HospitalId,
                        "AppointmentId": 0,
                        "VisitId": 121 || "",
                        "callerId": $scope.faxobj.Faxcountrycode + $scope.faxobj.FaxAreacode + $scope.faxobj.FaxHomeNumber, //$scope.faxobj.callerId,

                        "Faxcountrycode": $scope.faxobj.Faxcountrycode,
                        "FaxAreacode": $scope.faxobj.FaxAreacode,
                        "FaxHomeNumber": $scope.faxobj.FaxHomeNumber,
                        "ToFaxcountrycode": $scope.faxobj.ToFaxcountrycode,
                        "ToFaxAreacode": $scope.faxobj.ToFaxAreacode,
                        "ToFaxHomeNumber": $scope.faxobj.ToFaxHomeNumber,
                        "templateId": "",
                        "subject": $scope.subject,
                        "Notes": $scope.mainConsentObj.Notes,
                        "Priority": $scope.Priority,
                        "from_name": null,
                        "to_name": null,
                        "message": null,
                        "FaxDate": null,
                        "FaxStatusId": 1,
                        "FaxStatus": 'Sending',
                        "FaxStatusCode": null,
                        "JobId": "",
                        "DirectionTypeId": null,
                        "DirectionType": null,
                        "S3URL": null,
                        "DeliveryStatusId": null,
                        "DeliveryStatus": null,
                        "TransactionId": null,
                        "TransactionDate": null,
                        "NumberId": null,
                        "OrderId": null,
                        "FaxCallLength": null,
                        "FaxCallStart": null,
                        "FaxCallEnd": null,
                        "FaxTotalPages": null,
                        "FaxPages": null,
                        "RetryCount": 0,
                        "ExternalId": 0,
                        "DeleteInd": "N",
                        "FromProviderId": $scope.selectedDoctor.DoctorID,
                        "FromProviderName": $scope.selectedDoctor.SecondUserFullName,
                        "FromClinicName": $scope.selectedClinic == null ? null : $scope.selectedClinic.ClinicName,

                        "ToProviderId":
                            ($scope.SelectedTolist[i].TypeId === 2 ||
                                $scope.SelectedTolist[i].TypeId === 7 ||
                                $scope.SelectedTolist[i].TypeId === 1)
                                ? ($scope.SelectedTolist[i].TypeId === 3
                                    ? 0
                                    : $scope.SelectedTolist[i].selectedProvider.PcpReferralId)
                                : ($scope.SelectedTolist[i].TypeId === 3) ? 0 : $scope.SelectedPatientId,
                        "ToProviderName":
                            ($scope.SelectedTolist[i].TypeId === 2 ||
                                $scope.SelectedTolist[i].TypeId === 7 ||
                                $scope.SelectedTolist[i].TypeId === 1)
                                ? ($scope.SelectedTolist[i].TypeId === 3
                                    ? $scope.SelectedTolist[i].ToProviderdata
                                    : $scope.SelectedTolist[i].selectedProvider.FullName)
                                : ($scope.SelectedTolist[i].TypeId === 3) ? $scope.SelectedTolist[i].ToProviderdata : $scope.PaitentDetails.FullName,
                        "ToClinicName": $scope.SelectedTolist[i].OrgnizationName,
                        "faxNumber": $scope.faxobj.ToFaxcountrycode + $scope.SelectedTolist[i].cleanFaxNumber,


                        //"callerId":  $scope.refcallerId,
                        //"ToProviderId": refferalTo == 'PCP' ? $scope.selectedPCP.PcpReferralId : $scope.selectedReferal.PcpReferralId,
                        //"ToProviderName": refferalTo == 'PCP' ? $scope.selectedPCP.FullName : $scope.selectedReferal.FullName,
                        //"ToClinicName": $scope.ToOrgnizationName,
                        "ParentFaxId": 0,
                        "faxData": $scope.AttachmentdDocumnets || []
                    };

                    const resp = await eHnoteDiagnosisDataServices.SendFaxRequestAsync(obj);
                    if (resp !== undefined) {
                        //$scope.selectedDoctor = null;
                        //$scope.selectedClinic = null;
                        //$scope.faxobj.callerId = null;
                        //$scope.selectedProvider = null;
                        //$scope.OrgnizationName = null;
                        //$scope.faxNumber = null;
                        //$scope.selectedPCP = null;
                        //$scope.PaitentDetails.FullName = null;
                        //$scope.ToOrgnizationName = null;
                        //$scope.reffaxNumber = null;
                        //$scope.selectedReferal = null;
                        //$scope.AttachmentdDocumnets = null;
                        //$scope.mainConsentObj.Notes = null;
                        //$scope.subject = null;
                        //$scope.Priority = false;

                        $scope.EmailTab = 4;
                        // $scope.PaitentDetails.FullName = null;
                        //return $scope.faxData;
                    }

                }
                alertify.success("Fax send Successfully");

            }
            else {
                for (let i = 1; i <= count; i++) {

                    var obj =
                    {
                        "UserId": $scope.UserId,
                        "PatientFaxId": 0,
                        "PatientId": $scope.SelectedPatientId,
                        "OrganizationId": $scope.HospitalId,
                        "AppointmentId": 0,
                        "VisitId": 121 || "",
                        "callerId": $scope.faxobj.Faxcountrycode + $scope.faxobj.FaxAreacode + $scope.faxobj.FaxHomeNumber, //$scope.faxobj.callerId,

                        "templateId": "",
                        "subject": $scope.subject,
                        "Notes": $scope.mainConsentObj.Notes,
                        "Priority": $scope.Priority,
                        "from_name": null,
                        "to_name": null,
                        "message": null,
                        "FaxDate": null,
                        "FaxStatusId": 1,
                        "FaxStatus": 'Sending',
                        "FaxStatusCode": null,
                        "JobId": "",
                        "DirectionTypeId": null,
                        "DirectionType": null,
                        "S3URL": null,
                        "DeliveryStatusId": null,
                        "DeliveryStatus": null,
                        "TransactionId": null,
                        "TransactionDate": null,
                        "NumberId": null,
                        "OrderId": null,
                        "FaxCallLength": null,
                        "FaxCallStart": null,
                        "FaxCallEnd": null,
                        "FaxTotalPages": null,
                        "FaxPages": null,
                        "RetryCount": 0,
                        "ExternalId": 0,
                        "DeleteInd": "N",
                        "FromProviderId": $scope.selectedDoctor.DoctorID,
                        "FromProviderName": $scope.selectedDoctor.SecondUserFullName,
                        "FromClinicName": $scope.selectedClinic == null ? null : $scope.selectedClinic.ClinicName,
                        //"ToProviderId": $scope.selectedProvider.PcpReferralId,
                        //"ToProviderName": $scope.selectedProvider.FullName,
                        //"ToClinicName": $scope.OrgnizationName,
                        //"callerId": $scope.callerId,
                        ////"callerId":  $scope.refcallerId,
                        ////"ToProviderId": refferalTo == 'PCP' ? $scope.selectedPCP.PcpReferralId : $scope.selectedReferal.PcpReferralId,
                        ////"ToProviderName": refferalTo == 'PCP' ? $scope.selectedPCP.FullName : $scope.selectedReferal.FullName,
                        ////"ToClinicName": $scope.ToOrgnizationName,
                        // "ParentFaxId": 0,
                        "faxData": $scope.AttachmentdDocumnets || []
                    };
                    if (i == 1) {
                        for (let j = 0; j < $scope.SelectedTolist.length; j++) {

                            obj.ToProviderId = ($scope.SelectedTolist[i].TypeId === 2 ||
                                $scope.SelectedTolist[i].TypeId === 7 ||
                                $scope.SelectedTolist[i].TypeId === 1)
                                ? ($scope.SelectedTolist[i].TypeId === 3
                                    ? 0
                                    : $scope.SelectedTolist[i].selectedProvider.PcpReferralId)
                                : ($scope.SelectedTolist[i].TypeId === 3) ? 0 : $scope.SelectedPatientId;
                            obj.ToProviderName = ($scope.SelectedTolist[i].TypeId === 2 ||
                                $scope.SelectedTolist[i].TypeId === 7 ||
                                $scope.SelectedTolist[i].TypeId === 1)
                                ? ($scope.SelectedTolist[i].TypeId === 3
                                    ? $scope.SelectedTolist[i].ToProviderdata
                                    : $scope.SelectedTolist[i].selectedProvider.FullName)
                                : ($scope.SelectedTolist[i].TypeId === 3) ? $scope.SelectedTolist[i].ToProviderdata : $scope.PaitentDetails.FullName;
                            obj.ToClinicName = $scope.SelectedTolist[j].OrgnizationName;
                            obj.faxNumber = $scope.faxobj.ToFaxcountrycode + $scope.SelectedTolist[j].cleanFaxNumber;
                            obj.ParentFaxId = 0;
                            obj.ToFaxcountrycode = $scope.faxobj.ToFaxcountrycode;
                            obj.ToFaxAreacode = $scope.faxobj.ToFaxAreacode;
                            obj.ToFaxHomeNumber = $scope.faxobj.ToFaxHomeNumber;

                            //
                            const resp = await eHnoteDiagnosisDataServices.SendFaxRequestAsync(obj);

                            if (resp !== undefined) {
                                $scope.ParentFaxId = resp.data.PatientFaxId;

                                //$scope.selectedDoctor = null;
                                //$scope.selectedClinic = null;
                                //$scope.selectedReferal = null;
                                //$scope.selectedPCP = null;
                                //$scope.selectedProvider = null;
                                //$scope.faxNumber = null;
                                //$scope.callerId = null;
                                //$scope.refcallerId = null;
                                //$scope.OrgnizationName = null;
                                //$scope.ToOrgnizationName = null;
                                //return $scope.faxData;


                            }
                            alertify.success("Fax send Successfully");

                        }
                    }
                    else {

                        obj.ToProviderId = $scope.refferalTo == 'PCP' ? $scope.selectedPCP.PcpReferralId : $scope.selectedReferal.PcpReferralId;
                        obj.ToProviderName = $scope.refferalTo == 'PCP' ? $scope.selectedPCP.FullName : $scope.selectedReferal.FullName;
                        obj.ToClinicName = $scope.ToOrgnizationName;
                        obj.faxNumber = $scope.faxobj.ToRefFaxcountrycode + $scope.faxobj.ToRefFaxAreacode + $scope.faxobj.ToRefFaxHomeNumber;
                        obj.ParentFaxId = $scope.ParentFaxId;
                        obj.ToFaxcountrycode = $scope.faxobj.ToRefFaxcountrycode;
                        obj.ToFaxAreacode = $scope.faxobj.ToRefFaxAreacode;
                        obj.ToFaxHomeNumber = $scope.faxobj.ToRefFaxHomeNumber;

                        const resp = await eHnoteDiagnosisDataServices.SendFaxRequestAsync(obj);

                        if (resp !== undefined) {

                            $scope.ParentFaxId = resp.data.PatientFaxId;
                            $scope.selectedDoctor = null;
                            $scope.selectedClinic = null;
                            $scope.faxobj.callerId = null;
                            $scope.selectedProvider = null;
                            $scope.OrgnizationName = null;
                            $scope.faxNumber = null;
                            $scope.selectedPCP = null;
                            $scope.PaitentDetails.FullName = null;
                            $scope.ToOrgnizationName = null;
                            $scope.reffaxNumber = null;
                            $scope.selectedReferal = null;
                            $scope.AttachmentdDocumnets = null;
                            $scope.mainConsentObj.Notes = null;
                            $scope.subject = null;
                            $scope.Priority = false;
                            $scope.EmailTab = 4;
                        }

                    }
                    alertify.success("Fax send Successfully");
                }

            }

            $scope.AttachmentdDocumnets = [];
            $scope.resetfilterOutboundFaxes();
            $scope.resetfilterInboundFaxes();



        }
        $scope.ReceiveFaxStatus = function (jobid) {
            var obj =
            {
                "jobId": jobid
            };
            eHnoteDiagnosisDataServices.ReceiveFaxStatus(obj).then(function (resp) {
                //
                if (resp.data !== undefined) {

                    return resp.data;


                }
            }, function (err) {
                alertify.error(err.data.ExceptionMessage);
            });
        }



        function extractAndCleanConsentHtml() {
            var rawHtml = document.querySelector('[id^="taTextElement"]').innerHTML
                || $scope.mainConsentObj.HtmlContent
                || '';

            var HEADER_CONFIG_REGEX = /<!--HEADER-CONFIG:([\s\S]*?)-->/;

            // ✅ Extract full cfg — same as EhnoteConsentFormParentCtrl
            var cfg = null;
            var match = rawHtml.match(HEADER_CONFIG_REGEX);
            if (match && match[1]) {
                try { cfg = JSON.parse(match[1]); } catch (e) { cfg = null; }
            }
            var hasHeader = cfg && cfg.IsApplied === true;

            // ✅ Extract body — same as EhnoteConsentFormParentCtrl extractBodyHtml
            function extractBodyHtml(html) {
                var clean = html.replace(HEADER_CONFIG_REGEX, '');
                var startTag = clean.indexOf('class="doc-header-block"');
                if (startTag === -1) startTag = clean.indexOf("class='doc-header-block'");
                if (startTag !== -1) {
                    var divStart = clean.lastIndexOf('<div', startTag);
                    var depth = 0, i = divStart;
                    while (i < clean.length) {
                        if (clean.substr(i, 4) === '<div') depth++;
                        else if (clean.substr(i, 6) === '</div>') {
                            depth--;
                            if (depth === 0) {
                                clean = clean.slice(0, divStart) + clean.slice(i + 6);
                                break;
                            }
                        }
                        i++;
                    }
                }
                return clean.trim();
            }

            var bodyHtml = extractBodyHtml(rawHtml);
            // Strip HTML comments (StartFragment/EndFragment)
            bodyHtml = bodyHtml.replace(/<!--[\s\S]*?-->/g, '');
            // Strip the org logo image from body — header handles logo separately
            /* bodyHtml = bodyHtml.replace(/<img[^>]*id=["']imgOrgLogo["'][^>]*\/?>/gi, '');*/
            // Strip its empty wrapper paragraph if any
            bodyHtml = bodyHtml.replace(/<p[^>]*>\s*<\/p>/gi, '');


            // ✅ Clean dark mode styles
            var cleanContainer = document.createElement('div');
            cleanContainer.innerHTML = bodyHtml;
            //cleanContainer.querySelectorAll('*').forEach(function (el) {
            //    el.style.backgroundColor = 'white';
            //    el.style.color = 'black';
            //});

            // ✅ Get plain text for footer reference
            var headerText = '';
            if (hasHeader && cfg) {
                var tempDiv = document.createElement('div');
                tempDiv.innerHTML = cfg.singleHtml || cfg.leftHtml || cfg.left3Html || '';
                headerText = (tempDiv.innerText || tempDiv.textContent || '').trim();
            }

            return {
                bodyHtml: cleanContainer.innerHTML,
                headerText: headerText,
                headerCfg: hasHeader ? cfg : null
            };
        }

        function isEditorEmpty(html) {
            if (!html) return true;

            var div = document.createElement("div");
            div.innerHTML = html;

            var text = (div.textContent || div.innerText || "")
                .replace(/\u00A0/g, " ")
                .trim();

            return text.length === 0;
        }

        $scope.SendReferalAttachmentsToMail = function () {

            if ($scope.eObj.DoctorEmail == '') {
                alertify.error("Enter To Email Address");
                return false;
            }
            if ($scope.eObj.IsChartPdfChecked == false && $scope.eObj.IsChartCCDAChecked == false) {
                if ($scope.eObj.Subject == '') {
                    alertify.error("Enter Subject ");
                    return false;
                }
            }
            var extracted = extractAndCleanConsentHtml();

            $scope.eObj.TextBody = extracted.bodyHtml || '';
            $scope.eObj.HeaderText = extracted.headerText || '';
            $scope.eObj.HeaderCfg = extracted.headerCfg || null;

            //$scope.eObj.TextBody = angular.copy($scope.mainConsentObj.HtmlContent) || '';
            //if ($scope.eObj.TextBody != '') {
            //    let TextBody = document.querySelector('[id^="taTextElement"]').innerHTML;
            //    if (TextBody != '') {
            //        $scope.eObj.TextBody = angular.copy(TextBody) || '';
            //    }
            //}
            //if ($scope.eObj.TextBody != '') {
            //    let rawHtml = document.querySelector('[id^="taTextElement"]').innerHTML;

            //    if (rawHtml != '') {
            //        var parser = document.createElement('div');
            //        parser.innerHTML = rawHtml;

            //        var headerEl = parser.querySelector('.consent-header-block');
            //        if (headerEl) {
            //            headerEl.remove(); 
            //        }

            //        $scope.eObj.TextBody = parser.innerHTML || '';
            //    }
            //}
            //if ($scope.eObj.TextBody == '') {
            //    alertify.error("Enter TextBody ");
            //    return false;
            //}

            if (isEditorEmpty($scope.eObj.TextBody)) {
                alertify.error("Enter TextBody");
                return false;
            }

            var TempConsultationPlan = {};
            TempConsultationPlan.emailAddresses = $scope.eObj.DoctorEmail || "";
            TempConsultationPlan.IsMailFromPatient = $scope.eObj.IsMailFromPatient || "";
            TempConsultationPlan.subject = $scope.eObj.Subject || "";
            TempConsultationPlan.TextBody = $scope.eObj.TextBody || "";
            TempConsultationPlan.HeaderText = $scope.eObj.HeaderText || "";
            TempConsultationPlan.HeaderCfg = $scope.eObj.HeaderCfg || null;
            TempConsultationPlan.IsChartCCDAChecked = $scope.eObj.IsChartCCDAChecked;
            TempConsultationPlan.IsChartPdfChecked = $scope.eObj.IsChartPdfChecked;
            if ($scope.BranchList.length > 0) {
                const branchInfo = $filter('filter')($scope.BranchList, { 'BranchId': $scope.HospitalId }, true);
                const branch = branchInfo && branchInfo.length > 0 ? branchInfo[0] : null;
                TempConsultationPlan.BranchId = branch?.BranchId || 0;
                TempConsultationPlan.BranchEmail = branch?.BranchEmail || "";
                TempConsultationPlan.BranchName = branch?.BranchName || "";
                TempConsultationPlan.BranchAddress = (branch?.Address1 || '') + (branch?.Address2 || '');
            }
            if ($scope.SelectedApptObj!=null) {
                TempConsultationPlan.AppointmentId = $scope.SelectedApptObj.AppointmentId || 0;
                TempConsultationPlan.AppointmentDt = $scope.SelectedApptObj.AppointmentDate || 0;
                TempConsultationPlan.Appointmentwith = $scope.SelectedApptObj.AppointmentDoctorFullName || "";
            }

            var currentdate = $filter("date")(new Date(), "yyyy-MM-dd");
            let CreatedByName = "";
            if (doctorinfo.doctordata.User.length > 0) {
                CreatedByName = doctorinfo.doctordata.User[0].FullName || "";
            }
            var Conreq = {
                "UserId": $scope.UserId,
                "OrganizationId": $scope.HospitalId,
                "CreatedByUser": CreatedByName,
                "CreatedDate": currentdate,
                "DeleteInd": "N",
                "Status": "Pending",
                "StatusId": 1,
                "MessageType": "Referal",
                "MessageTypeId": 2,
                "ExternalStatus": "Pending",
                "ExternalMessageId": "",
                "EmailType": "Send",
                "EmailTypeId": 1,
                "VenderType": "Mailgun",
                // "ConsultationId": TempConsultationPlan.ConsultationId || "",
                "AppointmentId": TempConsultationPlan.AppointmentId || "",
                // "AppointmentDt": TempConsultationPlan.AppointmentDt || "",
                "AppointmentDate": TempConsultationPlan.AppointmentDt || "",
                "PatientId": $scope.SelectedPatientId || "",
                // "AppointmentTime": TempConsultationPlan.AppointmentTime || "",
                //"Appointmentwith": TempConsultationPlan.Appointmentwith || "",
                "DoctorId": TempConsultationPlan.DoctorId || "",
                "DoctorName": TempConsultationPlan.Appointmentwith || "",
                "isSendRefLetterMail": false,
                // "BranchId": TempConsultationPlan.BranchId || "",
                "BranchName": TempConsultationPlan.BranchName || "",
                "BranchPhone": TempConsultationPlan.BranchMobile || "",
                "BranchEmail": TempConsultationPlan.BranchEmail || "",
                "BranchAddress": TempConsultationPlan.BranchAddress || "",
                "PatientName": $scope.PaitentDetails.FullName || "",
                // "ReferalDoctorName": TempConsultationPlan.ReferalDoctorName || "",
                "emailAddresses": TempConsultationPlan.emailAddresses || '',
                "EmailSubject": TempConsultationPlan.subject || '',
                "EmailBody": TempConsultationPlan.TextBody || '',
                "HeaderText": TempConsultationPlan.HeaderText || '',
                "HeaderCfg": $scope.eObj.HeaderCfg|| null,
                "ToEmail": TempConsultationPlan.emailAddresses || '',
                "IsChartCCDAChecked": TempConsultationPlan.IsChartCCDAChecked,
                "IsChartPdfChecked": TempConsultationPlan.IsChartPdfChecked,
                "AttachmentsArray": $scope.eObj.AttachmentsArray || [],
                "EmailCommunicationProviderId": doctorinfo.doctordata.UserAddress[0].EmailCommunicationProviderId || 0,
                "EmailCommunicationEnabled": doctorinfo.doctordata.UserAddress[0].EmailCommunicationEnabled || false,
                "IsMailFromPatient": TempConsultationPlan.IsMailFromPatient || false,

            }
            Conreq.isSendRefLetterMail = false;
            Conreq.IsMailFromWebApp = true;
            eHnoteDiagnosisDataServices.SendReferalToMail(Conreq).then(function (resp) {
                if (resp.data.Message == "Success") {
                    alertify.success("Mail send Successfully");
                    $scope.eObj = getEmailReqObj();
                    $scope.mainConsentObj.HtmlContent = '';
                    // Force text-angular to update (very important)
                    $timeout(function () {
                        var taEditorElement = document.getElementById('htmlcontentconsent');
                        if (taEditorElement) {
                            var contentEditable = taEditorElement.querySelector('.ta-bind');
                            if (contentEditable) {
                                contentEditable.innerHTML = ''; // Editor content ni empty cheyadam
                            }
                        }
                    }, 100);
                    // for clearing the data
                    $scope.ClearAll();
                    if ((ChartObj.message === undefined || ChartObj.message !== 1) &&(ChartObj.patientclear === undefined || ChartObj.patientclear !== 1)) {
                        $scope.ClearPatientInfo();
                    }
                    //$scope.ClearPatientInfo();

                }
                else {
                    alertify.success("Mail sending is Failed");
                    return false;
                }
            });

            ////let body = document.getElementById("htmlcontentconsent");
            ////let body1 = document.getElementById("htmlcontentconsent").innerText;
            ////$scope.eObj.TextBody = body1;
            //var req = {
            //    "AppointmentId": $scope.SelectedObj.AppointmentId,
            //    "Type": 1
            //};
            //eHnotePatientDataService.GetPatientConsultationDetailsByApptId(req).then(function (resp) {
            //    if (resp.data != undefined) {
            //        if (resp.data.length !== 0) {
            //            $scope.ConsultationMailMsg = resp.data;
            //            $scope.ConsultationDataByApptIdArray = [];
            //            angular.forEach(resp.data, function (item) {
            //                if ($scope.SelectedObj.AppointmentId === item.AppointmentId) {
            //                    // to show appointmnt date, time and doctor name
            //                    let ApptTime = item.AppointmentDt + ' ' + item.AppointmentTime;
            //                    ApptTime = $filter('date')(new Date(ApptTime), "hh:mm a");
            //                    item.AppointmentTime = ApptTime;
            //                    $scope.ConsultationDataByApptIdArray.push(item);
            //                }
            //            });
            //        }
            //        if ($scope.ConsultationDataByApptIdArray.length > 0) {


            //        }
            //    }
            //});

        }
        $scope.SearchFaxProviderList = function (val) {
            if (!$scope.clinicDoctorList) {
                return [];
            }
            let filtered = $scope.clinicDoctorList.filter(item => item.RoleId === 1 || item.RoleId === 43);
            if (val) {
                filtered = $filter('filter')(filtered, { FullName: val });
            }
            return filtered;
        }




        $scope.addSigatureoftheUser = function () {
            let PatientName = $scope.SelectedPatObj.FirstName + $scope.SelectedPatObj.LastName;
            let PatientId = $scope.SelectedObj.PatientId;
            $scope.clinicDoctorList = $scope.clinicDoctorList || [];
            var obj = {
                "PatientId": PatientId,
                "PatientName": PatientName,
                'AllUserList': $scope.clinicDoctorList,
                'UserId': $scope.UserId || 0,
                'UserRoleId': $scope.UserRoleId || 0,
                'HospitalId': $scope.HospitalId || 0,
                "PatientSignString": $scope.mainConsentObj.PatientSignString||'',
                "PatientIntialSignString": $scope.mainConsentObj.PatientIntialSignString||'',
                "StaffUserId": $scope.mainConsentObj.StaffUserId || '',
                "StaffSignedDateTime": $scope.mainConsentObj.StaffSignedDateTime || '',
                "StaffSignString": $scope.mainConsentObj.StaffSignString || '',
                "CounselorSignedDateTime": $scope.mainConsentObj.CounselorSignedDateTime || '',
                "CounselorUserId": $scope.mainConsentObj.CounselorUserId || 0,
                "CounselorSignString": $scope.mainConsentObj.CounselorSignString || '',
                "AnesthesistUserId": $scope.mainConsentObj.AnesthesistUserId || '',
                "AnesthesistSignedDateTime": $scope.mainConsentObj.AnesthesistSignedDateTime || '',
                "AnesthesistSignString": $scope.mainConsentObj.AnesthesistSignString||'',
                "GaurdianSignString": $scope.mainConsentObj.GaurdianSignString || '',
                "RelationShipTypeList": $scope.RelationShipTypeList || [],
                "GaurdianFirstName": $scope.mainConsentObj.GaurdianFirstName || '',
                "GaurdianLastName": $scope.mainConsentObj.GaurdianLastName || '',
                "GaurdianRelationShipId": $scope.mainConsentObj.GaurdianRelationShipId || '',
                "PatientSignedDateTime": $scope.mainConsentObj.PatientSignedDateTime || '',
                "ProviderSignString": $scope.mainConsentObj.ProviderSignString || '',
                "ProviderSignedDateTime": $scope.mainConsentObj.ProviderSignedDateTime || '',
                "ProviderUserId": $scope.mainConsentObj.ProviderUserId || 0,

                "GaurdianSignedDateTime": $scope.mainConsentObj.GaurdianSignedDateTime || '',



            }
            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "addsignatuurepopovertemplatenew.html",
                "backdrop": "static",
                // "scope": $scope,
                "size": "lg",
                "resolve": {
                    "mainObject": function () { return obj; }
                },
                "windowClass": "zindexpopup",
                "keyboard": false,
                "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService, mainObject, datapersistanceFactory) {

                    $scope.mainObject = mainObject || '';
                    $scope.RoleId = mainObject.UserRoleId || 0;
                    $scope.UserId = mainObject.UserId || 0;

                    $scope.signaturesTab = {
                        "Patient": true,
                        "Staff": true,
                        "Provider": true,
                        "Anesthesist": true,
                        "Counselor": true,
                        "Gaurdian": true,
                        "activeSigatureTab": 1
                    };

                    $scope.RelationShipTypeList = mainObject.RelationShipTypeList || [];

                    $scope.OrganizationSettingsData = datapersistanceFactory.getItem("OrganizationSettingsData");
                    $scope.OrgDigitalSignType = $scope.OrganizationSettingsData.AppointmentSettings.DigitalSigatureType || "Drawing";

                    $scope.activeSigatureTab = 1;
                    $scope.switchSignatureTab = function (tabono) {
                        $scope.signaturesTab.activeSigatureTab = tabono;

                        if ($scope.signPlusObj.StaffUserId == 0) {
                            $scope.signPlusObj.StaffUserObj = "";
                        }

                        if ($scope.signaturesTab.activeSigatureTab === 2 && $scope.UserId == $scope.signPlusObj.StaffUserId && $scope.signPlusObj.StaffSignString == '') {
                            $scope.OnLoadUserSignature($scope.signPlusObj.StaffUserObj, 'Staff', 'signStaffPadUD');
                        }
                        if ($scope.signaturesTab.activeSigatureTab === 3 && $scope.UserId == $scope.signPlusObj.ProviderUserId && $scope.signPlusObj.ProviderSignString == '') {
                            $scope.OnLoadUserSignature($scope.signPlusObj.ProviderUserObj, 'Provider', 'signProviderPadUD');
                        }
                        if ($scope.signaturesTab.activeSigatureTab === 4 && $scope.UserId == $scope.signPlusObj.CounselorUserId && $scope.signPlusObj.CounselorSignString == '') {
                            $scope.OnLoadUserSignature($scope.signPlusObj.CounselorUserObj, 'Counselor', 'signCounsellorPadUD');
                        }
                        if ($scope.signaturesTab.activeSigatureTab === 5 && $scope.UserId == $scope.signPlusObj.AnesthesistUserId && $scope.signPlusObj.AnesthesistSignString == '') {
                            $scope.OnLoadUserSignature($scope.signPlusObj.AnesthesistUserObj, 'Anesthesist', 'signAnesthesistPadUD');
                        }
                    };
                    function addnewsignPlusObj() {
                        var obj = {
                            "PatientConsentDocumentId": 0,
                            "patientreadyToSign": false,
                            "staffreadyToSign": false,
                            "providerreadyToSign": false,
                            "counselorreadyToSign": false,
                            "anesthesistreadyToSign": false,
                            "gaurdianreadyToSign": false,
                            "PatientSignBy": "Drawing",
                            "DoctorSignBy": "Drawing",
                            "StaffSignBy": "Drawing",
                            "CounselorSignBy": "Drawing",
                            "AnesthesistSignBy": "Drawing",
                            "GaurdianSignBy": "Drawing",
                            "PatientSignString": "",
                            "StaffSignString": "",
                            "StaffUserId": "",
                            "StaffUserObj": "",
                            "ProviderSignString": "",
                            "ProviderUserId": 0,
                            "ProviderUserObj": "",
                            "CounselorSignString": "",
                            "CounselorUserId": "",
                            "CounselorUserObj": "",
                            "AnesthesistSignString": "",
                            "AnesthesistUserId": "",
                            "AnesthesistUserObj": "",
                            "GaurdianSignString": "",
                            "GaurdianUserObj": "",
                            "GaurdianUserId": "",
                            "GaurdianFirstName": "",
                            "GaurdianLastName": "",
                            "GaurdianRelationShipId": "",
                            "PatientName": $scope.mainObject.PatientName,
                            "IsPatientDigitalSignTaken": false,
                            "IsStaffDigitalSignTaken": false,
                            "IsProviderDigitalSignTaken": false,
                            "IsCounselorDigitalSignTaken": false,
                            "IsAnesthesistDigitalSignTaken": false,
                            "IsGaurdianDigitalSignTaken": false,
                            "PatientSignedDateTime": "",
                            "ProviderSignedDateTime": "",
                            "StaffSignedDateTime": "",
                            "CounselorSignedDateTime": "",
                            "AnesthesistSignedDateTime": "",
                            "GaurdianSignedDateTime": "",
                            "PatientIntialSignString": "",
                            "ShowPatientCanvas": true,
                            "ShowPatientInitialCanvas": false,
                            "ValidatePassword": "",
                            "StaffValidate": false,
                            "ProviderValidate": false,
                            "CounselorValidate": false,
                            "AnesthesistValidate": false,
                        };
                        return obj;
                    }
                    $scope.signPlusObj = addnewsignPlusObj();

                    var tmr; var resetIsSupported = false;
                    $scope.signPlusObj.ShowPatientCanvas = true;
                    $scope.signPlusObj.ShowPatientInitialCanvas = false;
                    $scope.signPlusObj.SelectedPatientType = 'PatientName';

                    if ($scope.mainObject.AllUserList.length > 0) {
                        $scope.allUserList = $scope.mainObject.AllUserList;
                        $scope.StaffList = [];
                        $scope.ProviderList = [];
                        $scope.CounsellorList = [];
                        $scope.AnesthesistList = [];
                        $scope.GaurdianList = [];
                        $scope.StaffList = angular.copy($scope.allUserList);
                        $scope.ProviderList = angular.copy($scope.allUserList);
                        $scope.CounsellorList = angular.copy($scope.allUserList);
                        $scope.AnesthesistList = angular.copy($scope.allUserList);
                        $scope.GaurdianList = angular.copy($scope.allUserList);


                        $scope.ProviderList = $filter("filter")($scope.ProviderList, function (item) {
                            return item.RoleId === 1 || item.RoleId === 43;
                        });

                        $scope.CounsellorList = $filter("filter")($scope.CounsellorList, function (item) {
                            return item.RoleId === 18;
                        });

                        $scope.AnesthesistList = $filter("filter")($scope.AnesthesistList, function (item) {
                            return item.RoleId === 30;
                        });

                        $scope.StaffList = $filter("filter")($scope.StaffList, function (item) {
                            return item.RoleId === 8 || item.RoleId === 10 || item.RoleId === 18 || item.RoleId === 66 || item.RoleId === 67;
                        });
                    }

                    // Role Based Disable sign Pad
                    $scope.signPlusObj.PatientSignCanvasDisable = true;
                    $scope.signPlusObj.PatientGaurdianCanvasDisable = true;
                    $scope.signPlusObj.ProviderCanvasDisable = true;
                    $scope.signPlusObj.CounselorCanvasDisable = true;
                    $scope.signPlusObj.StaffCanvasDisable = true;
                    $scope.signPlusObj.AnesthesistCanvasDisable = true;

                    if ($scope.RoleId == 1 || $scope.RoleId == 43) {

                        $scope.signPlusObj.ProviderCanvasDisable = false;

                        var Providerfilterlist = $filter("filter")($scope.ProviderList, { "DoctorID": mainObject.UserId }, true) || [];
                        if (Providerfilterlist.length > 0) {
                            $scope.signPlusObj.ProviderUserObj = Providerfilterlist[0] || '';
                            $scope.signPlusObj.ProviderUserId = Providerfilterlist[0].DoctorID;
                            $scope.signPlusObj.ProviderValidate = true;
                        }

                    }
                    if ($scope.RoleId == 8 || item.RoleId === 10 || $scope.RoleId == 18 || $scope.RoleId == 66 || $scope.RoleId == 67) {
                        if ($scope.mainObject.StaffSignString == '') {
                            $scope.signPlusObj.StaffCanvasDisable = false;
                        }
                        $scope.signPlusObj.PatientSignCanvasDisable = false;
                        $scope.signPlusObj.PatientGaurdianCanvasDisable = false;

                        var Stafffilterlist = $filter("filter")($scope.StaffList, { "DoctorID": mainObject.UserId }, true) || [];
                        if (Stafffilterlist.length > 0 && !$scope.signPlusObj.StaffUserId) {
                            $scope.signPlusObj.StaffUserObj = Stafffilterlist[0] || '';
                            $scope.signPlusObj.StaffUserId = Stafffilterlist[0].DoctorID;
                            $scope.signPlusObj.StaffValidate = true;
                        }

                    }
                    if ($scope.RoleId == 18) {
                        if ($scope.mainObject.CounselorSignString == '') {
                            $scope.signPlusObj.CounselorCanvasDisable = false;
                        }

                        $scope.signPlusObj.PatientSignCanvasDisable = false;
                        $scope.signPlusObj.PatientGaurdianCanvasDisable = false;

                        var Counselorfilterlist = $filter("filter")($scope.CounsellorList, { "DoctorID": mainObject.UserId }, true) || [];
                        if (Counselorfilterlist.length > 0) {
                            $scope.signPlusObj.CounselorUserObj = Counselorfilterlist[0] || '';
                            $scope.signPlusObj.CounselorUserId = Counselorfilterlist[0].DoctorID;
                            $scope.signPlusObj.CounselorValidate = true;
                        }


                    }
                    if ($scope.RoleId == 30 && $scope.mainObject.AnesthesistSignString == '') {
                        $scope.signPlusObj.AnesthesistCanvasDisable = false;

                        var Anesthesistfilterlist = $filter("filter")($scope.AnesthesistList, { "DoctorID": mainObject.UserId }, true) || [];
                        if (Anesthesistfilterlist.length > 0) {
                            $scope.signPlusObj.AnesthesistUserObj = Anesthesistfilterlist[0] || '';
                            $scope.signPlusObj.AnesthesistUserId = Anesthesistfilterlist[0].DoctorID;
                            $scope.signPlusObj.AnesthesistValidate = true;
                        }

                    }

                    if ($scope.mainObject.PatientSignString != '') {
                        $scope.signPlusObj.IsPatientDigitalSignTaken = true;
                        $scope.signPlusObj.PatientSignString = $scope.mainObject.PatientSignString;
                        $scope.signPlusObj.PatientSignedDateTime = $filter('date')($scope.mainObject.PatientSignedDateTime, "MM-dd-yyyy hh:mm a");
                    }

                    if ($scope.mainObject.PatientIntialSignString != '') {
                        $scope.signPlusObj.IsPatientDigitalSignTaken = true;
                        $scope.signPlusObj.PatientIntialSignString = $scope.mainObject.PatientIntialSignString;
                    }

                    if ($scope.mainObject.GaurdianSignString != '') {
                        $scope.signPlusObj.IsGaurdianDigitalSignTaken = true;
                        $scope.signPlusObj.GaurdianSignString = $scope.mainObject.GaurdianSignString || "";
                        $scope.signPlusObj.GaurdianFirstName = $scope.mainObject.GaurdianFirstName || '';
                        $scope.signPlusObj.GaurdianLastName = $scope.mainObject.GaurdianLastName || '';
                        $scope.signPlusObj.GaurdianRelationShipId = $scope.mainObject.GaurdianRelationShipId || '';
                        $scope.signPlusObj.GaurdianSignedDateTime = $filter('date')($scope.mainObject.GaurdianSignedDateTime, "MM-dd-yyyy hh:mm a");

                    }

                    if ($scope.mainObject.ProviderSignString != '') {
                        $scope.signPlusObj.IsProviderDigitalSignTaken = true;
                        $scope.signPlusObj.ProviderSignString = $scope.mainObject.ProviderSignString || "";
                        $scope.signPlusObj.ProviderSignedDateTime = $filter('date')($scope.mainObject.ProviderSignedDateTime, "MM-dd-yyyy hh:mm a");

                        $scope.signPlusObj.ProviderUserId = $scope.mainObject.ProviderUserId || 0;
                        var Providerfilterlist = $filter("filter")($scope.ProviderList, { "DoctorID": $scope.signPlusObj.ProviderUserId }, true) || [];
                        if (Providerfilterlist.length > 0) {
                            $scope.signPlusObj.ProviderUserObj = Providerfilterlist[0] || '';
                        }
                    }

                    if ($scope.mainObject.StaffSignString != '') {
                        $scope.signPlusObj.IsStaffDigitalSignTaken = true;
                        $scope.signPlusObj.StaffSignString = $scope.mainObject.StaffSignString;
                        $scope.signPlusObj.StaffSignedDateTime = $filter('date')($scope.mainObject.StaffSignedDateTime, "MM-dd-yyyy hh:mm a");
                        $scope.signPlusObj.StaffUserId = $scope.mainObject.StaffUserId || 0;
                        var Stafffilterlist = $filter("filter")($scope.StaffList, { "DoctorID": $scope.signPlusObj.StaffUserId }, true) || [];
                        if (Stafffilterlist.length > 0) {
                            $scope.signPlusObj.StaffUserObj = Stafffilterlist[0] || '';
                        }
                    }
                    if ($scope.mainObject.CounselorSignString != '') {
                        $scope.signPlusObj.IsCounselorDigitalSignTaken = true;
                        $scope.signPlusObj.CounselorSignString = $scope.mainObject.CounselorSignString;
                        $scope.signPlusObj.CounselorSignedDateTime = $filter('date')($scope.mainObject.CounselorSignedDateTime, "MM-dd-yyyy hh:mm a");
                        $scope.signPlusObj.CounselorUserId = $scope.mainObject.CounselorUserId || 0;

                        var Counselorfilterlist = $filter("filter")($scope.CounsellorList, { "DoctorID": $scope.mainObject.CounselorUserId }, true) || [];
                        if (Counselorfilterlist.length > 0) {
                            $scope.signPlusObj.CounselorUserObj = Counselorfilterlist[0] || '';
                        }
                    }
                    if ($scope.mainObject.AnesthesistSignString != '') {
                        $scope.signPlusObj.IsAnesthesistDigitalSignTaken = true;
                        $scope.signPlusObj.AnesthesistSignString = $scope.mainObject.AnesthesistSignString;
                        $scope.signPlusObj.AnesthesistSignedDateTime = $filter('date')($scope.mainObject.AnesthesistSignedDateTime, "MM-dd-yyyy hh:mm a");
                        $scope.signPlusObj.AnesthesistUserId = $scope.mainObject.AnesthesistUserId || 0;
                        var Anesthesistfilterlist = $filter("filter")($scope.AnesthesistList, { "DoctorID": $scope.signPlusObj.AnesthesistUserId }, true) || [];
                        if (Anesthesistfilterlist.length > 0) {
                            $scope.signPlusObj.AnesthesistUserObj = Anesthesistfilterlist[0] || '';
                        }
                    }

                    $uibModalInstance.rendered.then(function () {
                        if ($scope.signPlusObj.IsPatientDigitalSignTaken) {
                            if ($scope.signPlusObj.PatientSignString != "") {
                                $scope.signPlusObj.patientreadyToSign = true;
                                $scope.signPlusObj.IsPatientDigitalSignTaken = true;
                                var canvas = document.getElementById('signPatientPadUD');
                                var context = canvas.getContext('2d');
                                var image = new Image();
                                image.onload = function () {
                                    context.drawImage(image, 0, 0, canvas.width, canvas.height);
                                };
                                image.src = $scope.signPlusObj.PatientSignString;

                                $scope.signPlusObj.PatientIntialSignString = $scope.signPlusObj.PatientIntialSignString || "";
                                if ($scope.signPlusObj.PatientIntialSignString != "") {

                                    var canvaspi = document.getElementById('signPatientIntialPadUD');
                                    var contextpi = canvaspi.getContext('2d');
                                    var imagepi = new Image();
                                    imagepi.onload = function () {
                                        var centerXp = canvaspi.width / 2 - imagepi.width / 2;
                                        var centerYp = canvaspi.height / 2 - imagepi.height / 2;
                                        contextpi.drawImage(imagepi, 0, 0, canvaspi.width, canvaspi.height);
                                    };
                                    imagepi.src = $scope.signPlusObj.PatientIntialSignString;
                                }
                            }

                        }

                        if ($scope.signPlusObj.IsStaffDigitalSignTaken) {
                            if ($scope.signPlusObj.StaffSignString != "") {
                                $scope.signPlusObj.staffreadyToSign = true;
                                //$scope.GetSignatureDeleteObj.StaffSignature = true;
                                var canvasS = document.getElementById('signStaffPadUD');
                                var contextS = canvasS.getContext('2d');
                                var imageS = new Image();
                                imageS.onload = function () {
                                    contextS.drawImage(imageS, 0, 0, canvasS.width, canvasS.height);
                                };
                                imageS.src = $scope.signPlusObj.StaffSignString;
                            }
                        }

                        if ($scope.signPlusObj.IsProviderDigitalSignTaken) {

                            if ($scope.signPlusObj.ProviderSignString != "") {
                                $scope.signPlusObj.providerreadyToSign = true;
                                var canvasD = document.getElementById('signProviderPadUD');
                                var contextD = canvasD.getContext('2d');
                                var imageD = new Image();
                                imageD.onload = function () {
                                    contextD.drawImage(imageD, 0, 0, canvasD.width, canvasD.height);
                                };
                                imageD.src = $scope.signPlusObj.ProviderSignString;
                            }
                        }

                        if ($scope.signPlusObj.IsCounselorDigitalSignTaken) {
                            if ($scope.signPlusObj.CounselorSignString != "") {
                                //$scope.GetSignatureDeleteObj.CounselorSignature = true;
                                $scope.signPlusObj.counselorreadyToSign = true;
                                var canvasC = document.getElementById('signCounsellorPadUD');
                                var contextC = canvasC.getContext('2d');
                                var imageC = new Image();
                                imageC.onload = function () {
                                    contextC.drawImage(imageC, 0, 0, canvasC.width, canvasC.height);
                                };
                                imageC.src = $scope.signPlusObj.CounselorSignString;
                            }
                        }

                        if ($scope.signPlusObj.IsAnesthesistDigitalSignTaken) {
                            if ($scope.signPlusObj.AnesthesistSignString != "") {
                                //$scope.GetSignatureDeleteObj.AnesthesistSignature = true;
                                $scope.signPlusObj.anesthesistreadyToSign = true;
                                var canvasA = document.getElementById('signAnesthesistPadUD');
                                var contextA = canvasA.getContext('2d');
                                var imageA = new Image();
                                imageA.onload = function () {
                                    contextA.drawImage(imageA, 0, 0, canvasA.width, canvasA.height);
                                };
                                imageA.src = $scope.signPlusObj.AnesthesistSignString;
                            }
                        }

                        if ($scope.signPlusObj.IsGaurdianDigitalSignTaken) {
                            if ($scope.signPlusObj.GaurdianSignString != "") {
                                //$scope.GetSignatureDeleteObj.GaurdianSignature = true;
                                $scope.signPlusObj.gaurdianreadyToSign = true;
                                var canvasG = document.getElementById('signGaurdianPadUD');
                                var contextG = canvasG.getContext('2d');
                                var imageG = new Image();
                                imageG.onload = function () {
                                    contextG.drawImage(imageG, 0, 0, canvasG.width, canvasG.height);
                                };
                                imageG.src = $scope.signPlusObj.GaurdianSignString;
                            }
                        }

                    });


                    $scope.SearchStaffList = function (val) {
                        $scope.StaffList = $scope.StaffList || [];
                        $scope.FilterStaffList = angular.copy($scope.StaffList);
                        val = val || "";
                        if (val !== null) {
                            $scope.FilterStaffList = $filter("filter")($scope.FilterStaffList, { "FullName": val });
                            return $scope.FilterStaffList.map(function (item) {
                                return item;

                            });
                        }
                    }

                    $scope.SearchProviderList = function (val) {
                        $scope.ProviderList = $scope.ProviderList || [];
                        $scope.FilterProviderList = angular.copy($scope.ProviderList);
                        val = val || "";
                        if (val !== null) {
                            $scope.FilterProviderList = $filter("filter")($scope.FilterProviderList, { "FullName": val });
                            return $scope.FilterProviderList.map(function (item) {
                                return item;

                            });
                        }
                    }

                    $scope.SearchCounsellorList = function (val) {
                        $scope.CounsellorList = $scope.CounsellorList || [];
                        $scope.FilterCounsellorList = angular.copy($scope.CounsellorList);
                        val = val || "";
                        if (val !== null) {
                            $scope.FilterCounsellorList = $filter("filter")($scope.FilterCounsellorList, { "FullName": val });
                            return $scope.FilterCounsellorList.map(function (item) {
                                return item;

                            });
                        }
                    }

                    $scope.SearchAnesthesistList = function (val) {
                        $scope.AnesthesistList = $scope.AnesthesistList || [];
                        $scope.FilterAnesthesistList = angular.copy($scope.AnesthesistList);
                        val = val || "";
                        if (val !== null) {
                            $scope.FilterAnesthesistList = $filter("filter")($scope.FilterAnesthesistList, { "FullName": val });
                            return $scope.FilterAnesthesistList.map(function (item) {
                                return item;

                            });
                        }
                    }

                    $scope.SearchGaurdianList = function (val) {
                        $scope.GaurdianList = $scope.GaurdianList || [];
                        $scope.FilterGaurdianList = angular.copy($scope.GaurdianList);
                        val = val || "";
                        if (val !== null) {
                            $scope.FilterGaurdianList = $filter("filter")($scope.FilterGaurdianList, { "FullName": val });
                            return $scope.FilterGaurdianList.map(function (item) {
                                return item;

                            });
                        }
                    }
                    $scope.onSelectUser = function (type, obj) {
                        if (type == 'Staff') {
                            console.log(obj);
                            $scope.signPlusObj.ValidatePassword = '';
                            $scope.OnClearStaffSignature();
                            $scope.signPlusObj.StaffUserId = obj.DoctorID;

                            //if ($scope.signPlusObj.StaffUserId == $scope.ParentObject.UserId) {
                            if ($scope.signPlusObj.StaffUserId == $scope.UserId) {
                                $scope.signPlusObj.StaffValidate = true;
                                $scope.signPlusObj.StaffCanvasDisable = false;
                                $scope.OnLoadUserSignature($scope.signPlusObj.StaffUserObj, 'Staff', 'signStaffPadUD');
                            } else {
                                $scope.signPlusObj.StaffValidate = false;
                                $scope.signPlusObj.StaffCanvasDisable = true;
                            }
                        }

                        if (type == 'Provider') {
                            console.log(obj);
                            $scope.signPlusObj.ValidatePassword = '';
                            $scope.OnClearProviderSignature();
                            $scope.signPlusObj.ProviderUserId = obj.DoctorID;

                            if ($scope.signPlusObj.ProviderUserId == $scope.UserId) {
                                $scope.signPlusObj.ProviderValidate = true;

                                $scope.signPlusObj.ProviderCanvasDisable = false;

                                $scope.OnLoadUserSignature($scope.signPlusObj.ProviderUserObj, 'Provider', 'signProviderPadUD');
                            } else {
                                $scope.signPlusObj.ProviderValidate = false;

                                $scope.signPlusObj.ProviderCanvasDisable = true;
                            }
                        }
                        if (type == 'Counselor') {
                            console.log(obj);
                            $scope.signPlusObj.ValidatePassword = '';
                            $scope.OnClearCounsellorSignature();
                            $scope.signPlusObj.CounselorUserId = obj.DoctorID;

                            if ($scope.signPlusObj.CounselorUserId == $scope.UserId) {
                                $scope.signPlusObj.CounselorValidate = true;

                                $scope.signPlusObj.CounselorCanvasDisable = false;
                                $scope.OnLoadUserSignature($scope.signPlusObj.CounselorUserObj, 'Counselor', 'signCounsellorPadUD');
                            } else {
                                $scope.signPlusObj.CounselorValidate = false;

                                $scope.signPlusObj.CounselorCanvasDisable = true;
                            }

                        }
                        if (type == 'Anesthesist') {
                            console.log(obj);
                            $scope.signPlusObj.ValidatePassword = '';
                            $scope.OnClearAnesthesistSignature();
                            $scope.signPlusObj.AnesthesistUserId = obj.DoctorID;

                            if ($scope.signPlusObj.AnesthesistUserId == $scope.UserId) {
                                $scope.signPlusObj.AnesthesistValidate = true;

                                $scope.signPlusObj.AnesthesistCanvasDisable = false;
                                $scope.OnLoadUserSignature($scope.signPlusObj.AnesthesistUserObj, 'Anesthesist', 'signAnesthesistPadUD');
                            } else {
                                $scope.signPlusObj.AnesthesistValidate = false;

                                $scope.signPlusObj.AnesthesistCanvasDisable = true;
                            }
                        }
                    }

                    $scope.OnSignGaurdianSignature = function () {
                        $scope.signPlusObj.gaurdianreadyToSign = true;
                        if (IsSigWebInstalled()) {
                            var ctx = document.getElementById('signGaurdianPadUD').getContext('2d');
                            SetDisplayXSize(500);
                            SetDisplayYSize(100);
                            SetTabletState(0, tmr);
                            SetJustifyMode(0);
                            ClearTablet();
                            SetKeyString("0000000000000000");
                            SetEncryptionMode(0);
                            if (tmr == null) {
                                tmr = SetTabletState(1, ctx, 50);
                            }
                            else {
                                SetTabletState(0, tmr);
                                tmr = null;
                                tmr = SetTabletState(1, ctx, 50);
                            }

                        } else {
                            alert("Unable to communicate with SigWeb. Please confirm that SigWeb is installed and running on this PC.");
                        }
                    };
                    $scope.OnClearGaurdianSignature = function () {
                        ClearTablet();


                        var canvas = document.getElementById('signGaurdianPadUD');
                        var context = canvas.getContext('2d');
                        context.clearRect(0, 0, canvas.width, canvas.height);
                        $scope.signPlusObj.IsGaurdianDigitalSignTaken = false;
                        $scope.signPlusObj.GaurdianSignString = "";
                        $scope.signPlusObj.gaurdianreadyToSign = false;
                        $scope.signPlusObj.GaurdianSignBy = 'Drawing';

                    }

                    $scope.saveGaurdianSignatureDraw = function (pageno, type) {
                        var tabno = pageno || 0;
                        var savetype = type || "";
                        $scope.signPlusObj.GaurdianSignedDateTime = $filter('date')(new Date(), "MM-dd-yyyy hh:mm a");
                        if ($scope.signPlusObj.GaurdianSignBy == "Topaz") {
                            if (NumberOfTabletPoints() == 0) {
                                //alert("Please sign before continuing");
                                if ($scope.MainPatientSignedObj.IsGaurdianSignatureDone) {
                                    if (savetype == "complete") {
                                        $scope.savecompleteSignature();
                                    } else {
                                        if (tabno !== 0) {
                                            $scope.signaturesTab.activeSigatureTab = tabno;
                                        }
                                    }
                                } else {
                                    alertify.error("Please add Signature");
                                }
                            }
                            else {
                                SetTabletState(0, tmr);




                                var CryptoData = "";
                                CryptoData = "This represents sample data the signer reads and is agreeing to when signing.";
                                CryptoData = CryptoData + "Concatenate all this data into a single variable.";
                                AutoKeyAddANSIData(CryptoData);
                                SetEncryptionMode(2);

                                SetSigCompressionMode(2);



                                SetImageXSize(1200);
                                SetImageYSize(800);
                                SetImagePenWidth(10);
                                GetSigImageB64(SignedImageCallback);
                                function SignedImageCallback(str) {

                                    var convertedSignatureObj = "data:image/png;base64," + str;

                                    $scope.signPlusObj.GaurdianSignString = convertedSignatureObj;
                                    console.log($scope.signPlusObj.GaurdianSignString);
                                    alertify.success("Signature added Successfully ");

                                    if (savetype == "complete") {
                                        $scope.savecompleteSignature();
                                    } else {
                                        if (tabno !== 0) {
                                            $scope.signaturesTab.activeSigatureTab = tabno;
                                        }
                                    }
                                }


                            }
                        } else {
                            var canvas = document.getElementById('signGaurdianPadUD');
                            var sign = canvas.toDataURL();

                            console.log(sign);


                            if (sign === 'data:image/png;base64,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') {
                                alertify.error("Please sign to continue");
                                return false;
                            }

                            $scope.signPlusObj.GaurdianSignString = sign;
                            console.log($scope.signPlusObj.GaurdianSignString);
                            alertify.success("Signature added Successfully ");

                            if (savetype == "complete") {
                                $scope.savecompleteSignature();
                            } else {
                                if (tabno !== 0) {
                                    $scope.signaturesTab.activeSigatureTab = tabno;
                                }
                            }
                        }
                    }


                    $scope.OnSignAnesthesistSignature = function () {
                        $scope.signPlusObj.anesthesistreadyToSign = true;
                        if (IsSigWebInstalled()) {
                            var ctx = document.getElementById('signAnesthesistPadUD').getContext('2d');
                            SetDisplayXSize(500);
                            SetDisplayYSize(100);
                            SetTabletState(0, tmr);
                            SetJustifyMode(0);
                            ClearTablet();
                            SetKeyString("0000000000000000");
                            SetEncryptionMode(0);
                            if (tmr == null) {
                                tmr = SetTabletState(1, ctx, 50);
                            }
                            else {
                                SetTabletState(0, tmr);
                                tmr = null;
                                tmr = SetTabletState(1, ctx, 50);
                            }

                        } else {
                            alert("Unable to communicate with SigWeb. Please confirm that SigWeb is installed and running on this PC.");
                        }
                    };
                    $scope.OnClearAnesthesistSignature = function () {
                        ClearTablet();

                        var canvas = document.getElementById('signAnesthesistPadUD');
                        var context = canvas.getContext('2d');
                        context.clearRect(0, 0, canvas.width, canvas.height);
                        $scope.signPlusObj.IsAnesthesistDigitalSignTaken = false;
                        $scope.signPlusObj.AnesthesistSignString = "";
                        $scope.signPlusObj.anesthesistreadyToSign = false;
                        $scope.signPlusObj.AnesthesistSignBy = 'Drawing';

                    }
                    $scope.saveAnesthesistSignatureDraw = function () {
                        if (NumberOfTabletPoints() == 0) {
                            //alert("Please sign before continuing");
                            alertify.error("Please add Signature");
                        }
                        else {
                            SetTabletState(0, tmr);




                            var CryptoData = "";
                            CryptoData = "This represents sample data the signer reads and is agreeing to when signing.";
                            CryptoData = CryptoData + "Concatenate all this data into a single variable.";
                            AutoKeyAddANSIData(CryptoData);
                            SetEncryptionMode(2);

                            SetSigCompressionMode(1);



                            SetImageXSize(500);
                            SetImageYSize(100);
                            SetImagePenWidth(5);
                            GetSigImageB64(SignedImageCallback);
                            function SignedImageCallback(str) {

                                var convertedSignatureObj = "data:image/png;base64," + str;

                                $scope.signPlusObj.AnesthesistSignString = convertedSignatureObj;
                                //console.log($scope.signPlusObj.AnesthesistSignString);
                                alertify.success("Signature added Successfully ");
                            }


                        }
                    }


                    $scope.OnSignCounsellorSignature = function () {
                        $scope.signPlusObj.counselorreadyToSign = true;
                        if (IsSigWebInstalled()) {
                            var ctx = document.getElementById('signCounsellorPadUD').getContext('2d');
                            SetDisplayXSize(500);
                            SetDisplayYSize(100);
                            SetTabletState(0, tmr);
                            SetJustifyMode(0);
                            ClearTablet();
                            SetKeyString("0000000000000000");
                            SetEncryptionMode(0);
                            if (tmr == null) {
                                tmr = SetTabletState(1, ctx, 50);
                            }
                            else {
                                SetTabletState(0, tmr);
                                tmr = null;
                                tmr = SetTabletState(1, ctx, 50);
                            }

                        } else {
                            alert("Unable to communicate with SigWeb. Please confirm that SigWeb is installed and running on this PC.");
                        }
                    };
                    $scope.OnClearCounsellorSignature = function () {
                        ClearTablet();
                        var canvas = document.getElementById('signCounsellorPadUD');
                        var context = canvas.getContext('2d');
                        context.clearRect(0, 0, canvas.width, canvas.height);
                        $scope.signPlusObj.IsCounselorDigitalSignTaken = false;
                        $scope.signPlusObj.CounselorSignString = "";
                        $scope.signPlusObj.counselorreadyToSign = false;
                        $scope.signPlusObj.CounselorSignBy = 'Drawing';

                    }
                    $scope.saveCounsellorSignatureDraw = function () {
                        if (NumberOfTabletPoints() == 0) {
                            //alert("Please sign before continuing");
                            alertify.error("Please add Signature");
                        }
                        else {
                            SetTabletState(0, tmr);




                            var CryptoData = "";
                            CryptoData = "This represents sample data the signer reads and is agreeing to when signing.";
                            CryptoData = CryptoData + "Concatenate all this data into a single variable.";
                            AutoKeyAddANSIData(CryptoData);
                            SetEncryptionMode(2);

                            SetSigCompressionMode(1);



                            SetImageXSize(500);
                            SetImageYSize(100);
                            SetImagePenWidth(5);
                            GetSigImageB64(SignedImageCallback);
                            function SignedImageCallback(str) {

                                var convertedSignatureObj = "data:image/png;base64," + str;

                                $scope.signPlusObj.CounselorSignString = convertedSignatureObj;
                                //console.log($scope.signPlusObj.CounselorSignString);
                                alertify.success("Signature added Successfully ");
                            }


                        }
                    }


                    $scope.OnSignProviderSignature = function () {
                        $scope.signPlusObj.providerreadyToSign = true;
                        if (IsSigWebInstalled()) {
                            var ctx = document.getElementById('signProviderPadUD').getContext('2d');
                            SetDisplayXSize(500);
                            SetDisplayYSize(100);
                            SetTabletState(0, tmr);
                            SetJustifyMode(0);
                            ClearTablet();
                            SetKeyString("0000000000000000");
                            SetEncryptionMode(0);
                            if (tmr == null) {
                                tmr = SetTabletState(1, ctx, 50);
                            }
                            else {
                                SetTabletState(0, tmr);
                                tmr = null;
                                tmr = SetTabletState(1, ctx, 50);
                            }

                        } else {
                            alert("Unable to communicate with SigWeb. Please confirm that SigWeb is installed and running on this PC.");
                        }
                    };
                    $scope.OnClearProviderSignature = function () {
                        ClearTablet();

                        var canvas = document.getElementById('signProviderPadUD');
                        var context = canvas.getContext('2d');
                        context.clearRect(0, 0, canvas.width, canvas.height);
                        $scope.signPlusObj.IsPatientDigitalSignTaken = false;
                        $scope.signPlusObj.ProviderSignString = "";
                        $scope.signPlusObj.providerreadyToSign = false;
                        $scope.signPlusObj.DoctorSignBy = 'Drawing';

                    }
                    $scope.saveProviderSignatureDraw = function () {
                        if (NumberOfTabletPoints() == 0) {
                            //alert("Please sign before continuing");
                            alertify.error("Please add Signature");

                        }
                        else {
                            SetTabletState(0, tmr);




                            var CryptoData = "";
                            CryptoData = "This represents sample data the signer reads and is agreeing to when signing.";
                            CryptoData = CryptoData + "Concatenate all this data into a single variable.";
                            AutoKeyAddANSIData(CryptoData);
                            SetEncryptionMode(2);

                            SetSigCompressionMode(1);



                            SetImageXSize(500);
                            SetImageYSize(100);
                            SetImagePenWidth(5);
                            GetSigImageB64(SignedImageCallback);
                            function SignedImageCallback(str) {

                                var convertedSignatureObj = "data:image/png;base64," + str;

                                $scope.signPlusObj.ProviderSignString = convertedSignatureObj;
                                //console.log($scope.signPlusObj.ProviderSignString);
                                alertify.success("Signature added Successfully ");
                            }


                        }
                    }


                    $scope.OnSignStaffSignature = function () {
                        $scope.signPlusObj.staffreadyToSign = true;
                        if (IsSigWebInstalled()) {
                            var ctx = document.getElementById('signStaffPadUD').getContext('2d');
                            SetDisplayXSize(500);
                            SetDisplayYSize(100);
                            SetTabletState(0, tmr);
                            SetJustifyMode(0);
                            ClearTablet();
                            SetKeyString("0000000000000000");
                            SetEncryptionMode(0);
                            if (tmr == null) {
                                tmr = SetTabletState(1, ctx, 50);
                            }
                            else {
                                SetTabletState(0, tmr);
                                tmr = null;
                                tmr = SetTabletState(1, ctx, 50);
                            }

                        } else {
                            alert("Unable to communicate with SigWeb. Please confirm that SigWeb is installed and running on this PC.");
                        }
                    };
                    $scope.OnClearStaffSignature = function () {
                        ClearTablet();

                        var canvas = document.getElementById('signStaffPadUD');
                        var context = canvas.getContext('2d');
                        context.clearRect(0, 0, canvas.width, canvas.height);
                        $scope.signPlusObj.IsStaffDigitalSignTaken = false;
                        $scope.signPlusObj.StaffSignString = "";
                        $scope.signPlusObj.staffreadyToSign = false;
                        $scope.signPlusObj.StaffSignBy = 'Drawing';
                        $scope.signPlusObj.StaffCanvasDisable = false;
                    }
                    $scope.saveStaffSignatureDraw = function () {
                        if (NumberOfTabletPoints() == 0) {
                            //alert("Please sign before continuing");
                            alertify.error("Please add Signature");
                        }
                        else {
                            SetTabletState(0, tmr);




                            var CryptoData = "";
                            CryptoData = "This represents sample data the signer reads and is agreeing to when signing.";
                            CryptoData = CryptoData + "Concatenate all this data into a single variable.";
                            AutoKeyAddANSIData(CryptoData);
                            SetEncryptionMode(2);

                            SetSigCompressionMode(1);



                            SetImageXSize(500);
                            SetImageYSize(100);
                            SetImagePenWidth(5);
                            GetSigImageB64(SignedImageCallback);
                            function SignedImageCallback(str) {

                                var convertedSignatureObj = "data:image/png;base64," + str;

                                $scope.signPlusObj.StaffSignString = convertedSignatureObj;

                                // $scope.signPlusObj.patientreadyToSign = false;

                                //console.log($scope.signPlusObj.StaffSignString);
                                alertify.success("Signature added Successfully ");


                            }


                        }
                    }


                    $scope.OnSignPatientSignature = function () {
                        $scope.signPlusObj.patientreadyToSign = true;
                        if (IsSigWebInstalled()) {
                            var ctx = document.getElementById('signPatientPadUD').getContext('2d');
                            SetDisplayXSize(500);
                            SetDisplayYSize(100);
                            SetTabletState(0, tmr);
                            SetJustifyMode(0);
                            ClearTablet();
                            SetKeyString("0000000000000000");
                            SetEncryptionMode(0);
                            if (tmr == null) {
                                tmr = SetTabletState(1, ctx, 50);
                            }
                            else {
                                SetTabletState(0, tmr);
                                tmr = null;
                                tmr = SetTabletState(1, ctx, 50);
                            }

                        } else {
                            alert("Unable to communicate with SigWeb. Please confirm that SigWeb is installed and running on this PC.");
                        }
                    };
                    $scope.OnClearPatientSignature = function () {
                        ClearTablet();
                        var canvas = document.getElementById('signPatientPadUD');
                        var context = canvas.getContext('2d');
                        context.clearRect(0, 0, canvas.width, canvas.height);
                        $scope.signPlusObj.IsPatientDigitalSignTaken = false;
                        $scope.signPlusObj.PatientSignBy = 'Drawing';
                        $scope.signPlusObj.PatientSignString = '';

                    }
                    $scope.savePatientSignatureDraw = function () {
                        if (NumberOfTabletPoints() == 0) {
                            // alert("Please sign before continuing");
                            alertify.error("Please add Signature");
                        }
                        else {
                            SetTabletState(0, tmr);




                            var CryptoData = "";
                            CryptoData = "This represents sample data the signer reads and is agreeing to when signing.";
                            CryptoData = CryptoData + "Concatenate all this data into a single variable.";
                            AutoKeyAddANSIData(CryptoData);
                            SetEncryptionMode(2);

                            SetSigCompressionMode(1);



                            SetImageXSize(500);
                            SetImageYSize(100);
                            SetImagePenWidth(5);
                            GetSigImageB64(SignedImageCallback);
                            function SignedImageCallback(str) {

                                var convertedSignatureObj = "data:image/png;base64," + str;

                                $scope.signPlusObj.PatientSignString = convertedSignatureObj;

                                // $scope.signPlusObj.patientreadyToSign = false;

                                //console.log($scope.signPlusObj.PatientSignString);

                                alertify.success("Signature added Successfully ");

                            }


                        }
                    }


                    $scope.closeuib = function () {
                        $uibModalInstance.dismiss("cancel");
                    };

                    function GetResetSupported() {
                        var minSigWebVersionResetSupport = "1.6.4.0";

                        if (isOlderSigWebVersionInstalled(minSigWebVersionResetSupport)) {
                            //console.log("Old SigWeb version installed.");
                            return false;
                        }
                        return true;
                    }

                    function isOlderSigWebVersionInstalled(cmprVer) {
                        var sigWebVer = GetSigWebVersion();
                        if (sigWebVer != "") {
                            return isOlderVersion(cmprVer, sigWebVer);
                        } else {
                            return false;
                        }
                    }

                    function isOlderVersion(oldVer, newVer) {
                        const oldParts = oldVer.split('.')
                        const newParts = newVer.split('.')
                        for (var i = 0; i < newParts.length; i++) {
                            const a = parseInt(newParts[i]) || 0
                            const b = parseInt(oldParts[i]) || 0
                            if (a < b) return true
                            if (a > b) return false
                        }
                        return false;
                    }


                    $scope.onLoadSIg = function () {
                        if (IsSigWebInstalled()) {
                            resetIsSupported = GetResetSupported();
                            if (!resetIsSupported) {
                                var sigweb_link = document.createElement("a");
                                sigweb_link.href = "https://www.topazsystems.com/software/sigweb.exe";
                                sigweb_link.innerHTML = "https://www.topazsystems.com/software/sigweb.exe";

                                var note = document.getElementById("sigWebVrsnNote");
                                note.innerHTML = "There is a newer version of SigWeb available here: ";
                                note.appendChild(sigweb_link);
                            }

                            //$scope.OnSignPatientSignature();
                        }
                        else {
                            alert("Unable to communicate with SigWeb. Please confirm that SigWeb is installed and running on this PC.");
                        }
                    }



                    $scope.activeSigatureTab = 1;

                    $scope.onLoadSIg();

                    $scope.savecompleteSignature = function () {

                        $uibModalInstance.close($scope.signPlusObj);
                    }

                    $scope.savePatientSignatureDrawtoDB = function (pageno, type) {
                        var tabno = pageno || 0;
                        var savetype = type || "";
                        $scope.signPlusObj.PatientSignedDateTime = $filter('date')(new Date(), "MM-dd-yyyy hh:mm a");
                        if ($scope.signPlusObj.PatientSignBy == "Topaz") {
                            if (NumberOfTabletPoints() == 0) {
                                if ($scope.MainPatientSignedObj.IsPatientSignatureDone) {
                                    if (savetype == "complete") {
                                        $scope.savecompleteSignature();
                                    } else {
                                        if (tabno !== 0) {
                                            $scope.signaturesTab.activeSigatureTab = tabno;
                                        }
                                    }
                                } else {
                                    alertify.error("Please sign to continue");
                                }
                            }
                            else {
                                SetTabletState(0, tmr);
                                var CryptoData = "";
                                CryptoData = "This represents sample data the signer reads and is agreeing to when signing.";
                                CryptoData = CryptoData + "Concatenate all this data into a single variable.";
                                AutoKeyAddANSIData(CryptoData);
                                SetEncryptionMode(2);

                                SetSigCompressionMode(2);



                                SetImageXSize(1200);
                                SetImageYSize(800);
                                SetImagePenWidth(10);
                                if ($scope.signPlusObj.ShowPatientCanvas) {
                                    GetSigImageB64(SignedImageCallback);
                                    function SignedImageCallback(str) {

                                        var convertedSignatureObj = "data:image/png;base64," + str;

                                        $scope.signPlusObj.PatientSignString = convertedSignatureObj;

                                        console.log($scope.signPlusObj.PatientSignString);

                                        if (savetype == "complete") {
                                            $scope.savecompleteSignature();
                                        } else {
                                            if (tabno !== 0) {
                                                $scope.signaturesTab.activeSigatureTab = tabno;
                                            }
                                        }

                                    }

                                } else if ($scope.signPlusObj.ShowPatientInitialCanvas) {
                                    GetSigImageB64(SignedImageCallback);
                                    function SignedImageCallback(str2) {

                                        var convertedSignatureObj2 = "data:image/png;base64," + str2;
                                        $scope.signPlusObj.PatientIntialSignString = convertedSignatureObj2;

                                        if (savetype == "complete") {
                                            $scope.savecompleteSignature();
                                        } else {
                                            if (tabno !== 0) {
                                                $scope.signaturesTab.activeSigatureTab = tabno;
                                            }
                                        }
                                    }

                                } else { }

                            }
                        } else {
                            if ($scope.signPlusObj.ShowPatientCanvas) {
                                var canvas = document.getElementById('signPatientPadUD');
                                var sign = canvas.toDataURL();
                                //if (savetype !== '' && sign === 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAAAXNSR0IArs4c6QAABGJJREFUeF7t1AEJAAAMAsHZv/RyPNwSyDncOQIECEQEFskpJgECBM5geQICBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAgQdWMQCX4yW9owAAAABJRU5ErkJggg==') {
                                if (savetype !== '' && sign === 'data:image/png;base64,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') {
                                    alertify.error("Please sign to continue");
                                    return false;
                                }
                                if (sign !== 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAF2UlEQVR4AezU227bOhAFUOP8/0efvDhokNiWRJGcyyoKtLElcmbtYP/38IcAAQJJBBRWkqCMSYDA46Gw/BYQIJBGQGGliWp8UCcQyC6gsLInaH4CjQQUVqOwrUogu4DCyp6g+Qn8JVD0M4VVNFhrEagooLAqpmonAkUFFFbRYK1FoKKAwvorVZ8RIBBSQGGFjMVQBAj8JaCw/lLxGQECIQUUVshYDLVOwE2ZBBRWprTMSqC5gMJq/gtgfQKZBBRWprTMSqC5wGBhNdezPgECSwUU1lJulxEgMCKgsEb0vEuAwFIBhbWUO/VlhiewXUBhbY/AAAQIHBVQWEelPEeAwHYBhbU9AgMQiCcQdSKFFTUZcxEg8EtAYf0i8QEBAlEFFFbUZMxFgMAvAYX1i2T8AycQIDBHQGHNcXUqAQITBBTWBFRHEiAwR0BhzXF1ahcBey4VUFhLuV1GgMCIgMIa0fMuAQJLBRTWUm6XESAwIrC3sEYm9y4BAu0EFFa7yC1MIK+AwsqbnckJtBNQWO0i37WwewmMCyiscUMnECCwSEBhLYJ2DQEC4wIKa9zQCQQI/BSY9pPCmkbrYAIE7hZQWHeLOo8AgWkCCmsarYMJELhbQGHdLTp+nhMIEHghoLBewPiYAIF4AgorXiYmIkDghYDCegHjYwIrBNxxTkBhnfPyNAECGwUU1kZ8VxMgcE5AYZ3z8jQBAhsFUhfWRjdXEyCwQUBhbUB3JQEC1wQU1jU3bxEgsEFAYW1Ad+UFAa8Q+BJQWF8I/hIgkENAYeXIyZQECHwJKKwvBH8JEIgk8HoWhfXaxjcECAQTUFjBAjEOAQKvBRTWaxvfECAQTEBhBQtkfBwnEKgroLDqZmszAuUEFFa5SC1EoK6Awqqbrc3qC7TbUGG1i9zCBPIKKKy82ZmcQDsBhdUucgsTyCvQubDypmZyAk0FFFbT4K1NIKOAwsqYmpkJNBVQWE2D77a2fWsIKKwaOdqCQAsBhdUiZksSqCGgsGrkaAsCLQQOFVYLCUsSIBBeQGGFj8iABAg8BRTWU8K/BAiEF1BY4SNaPKDrCAQWUFiBwzEaAQI/BRTWTw8/ESAQWEBhBQ7HaATmCuQ7XWHly8zEBNoKKKy20VucQD4BhZUvMxMTaCugsC5H70UCBFYLKKzV4u4jQOCygMK6TOdFAgRWCyis1eLuyyhg5iACCitIEMYgQOCzgML6bOQJAgSCCCisIEEYgwCBzwIrCuvzFJ4gQIDAAQGFdQDJIwQIxBBQWDFyMAUBAgcEFNYBJI8cF/AkgZkCCmumrrMJELhVQGHdyukwAgRmCiismbrOJlBZYMNuCmsDuisJELgmoLCuuXmLAIENAgprA7orCRC4JqCwrrmNv+UEAgROCyis02ReIEBgl4DC2iXvXgIETgsorNNkXiBwVsDzdwkorLsknUOAwHQBhTWd2AUECNwloLDuknQOAQLTBRIU1nQDFxAgkERAYSUJypgECDweCstvAQECaQQUVpqoWgxqSQJvBRTWWx5fEiAQSUBhRUrDLAQIvBVQWG95fEmAwCyBK+cqrCtq3iFAYIuAwtrC7lICBK4IKKwrat4hQGCLgMLawj5+qRMIdBRQWB1TtzOBpAIKK2lwxibQUUBhdUzdzrkETPstoLC+KfyHAIHoAgorekLmI0DgW0BhfVP4DwEC0QXqF1b0BMxHgMBhAYV1mMqDBAjsFlBYuxNwPwEChwUU1mEqD8YXMGF1AYVVPWH7ESgkoLAKhWkVAtUFFFb1hO1HoJDAP4VVaCurECBQUkBhlYzVUgRqCiismrnaikBJAYVVMtaPS3mAQEoBhZUyNkMT6CmgsHrmbmsCKQUUVsrYDE3guEClJxVWpTTtQqC4gMIqHrD1CFQSUFiV0rQLgeICCutDwL4mQCCOgMKKk4VJCBD4IKCwPgD5mgCBOAIKK04WJtkt4P7wAgorfEQGJEDgKaCwnhL+JUAgvIDCCh+RAQkQeAr8DwAA//+Cw3OPAAAABklEQVQDAOx/AS0pote3AAAAAElFTkSuQmCC') {
                                    $scope.signPlusObj.PatientSignString = sign;
                                }
                            }
                            if ($scope.signPlusObj.ShowPatientInitialCanvas) {
                                var intialcanvas = document.getElementById('signPatientIntialPadUD');
                                var sign2 = intialcanvas.toDataURL();
                                if (savetype !== '' && sign2 === 'data:image/png;base64,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') {
                                    alertify.error("Please sign to continue");
                                    return false;
                                }
                                if (sign2 !== 'data:image/png;base64,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') {
                                    $scope.signPlusObj.PatientIntialSignString = sign2;
                                }
                            }

                            if (savetype == "complete") {
                                $scope.savecompleteSignature();
                            } else {
                                if (tabno !== 0) {
                                    $scope.signaturesTab.activeSigatureTab = tabno;
                                }
                            }

                        }


                    }
                    $scope.saveUserSignatureDrawtoDB = function (obj, type, pageno, savetype, signtype) {
                        var tabno = pageno || 0;
                        var savetype = savetype || "";
                        var digitalsigntype = signtype || "Drawing";

                        if (digitalsigntype == "Topaz") {

                            if (NumberOfTabletPoints() == 0) {
                                if ($scope.MainPatientSignedObj.IsStaffSignatureDone) {
                                    if (savetype == "complete") {
                                        $scope.savecompleteSignature();
                                    } else {
                                        if (tabno !== 0) {
                                            $scope.signaturesTab.activeSigatureTab = tabno;
                                        }
                                    }
                                } else {
                                    alertify.error("Please add Signature");
                                }
                            }
                            else {
                                SetTabletState(0, tmr);




                                var CryptoData = "";
                                CryptoData = "This represents sample data the signer reads and is agreeing to when signing.";
                                CryptoData = CryptoData + "Concatenate all this data into a single variable.";
                                AutoKeyAddANSIData(CryptoData);
                                SetEncryptionMode(2);

                                SetSigCompressionMode(1);




                                SetImageXSize(1200);
                                SetImageYSize(800);
                                SetImagePenWidth(10);
                                GetSigImageB64(SignedImageCallback);
                                function SignedImageCallback(str) {

                                    var convertedSignatureObj = "data:image/png;base64," + str;

                                    var siguserid = 0;

                                    if (type == 'Staff') {
                                        $scope.signPlusObj.StaffSignedDateTime = $filter('date')(new Date(), "MM-dd-yyyy hh:mm a");
                                        $scope.signPlusObj.StaffSignString = convertedSignatureObj;
                                        siguserid = $scope.signPlusObj.StaffUserId;
                                    }
                                    else if (type == 'Provider') {
                                        $scope.signPlusObj.ProviderSignedDateTime = $filter('date')(new Date(), "MM-dd-yyyy hh:mm a");
                                        siguserid = $scope.signPlusObj.ProviderUserId;
                                        $scope.signPlusObj.ProviderSignString = convertedSignatureObj;
                                    }
                                    else if (type == 'Counselor') {
                                        $scope.signPlusObj.CounselorSignedDateTime = $filter('date')(new Date(), "MM-dd-yyyy hh:mm a");
                                        siguserid = $scope.signPlusObj.CounselorUserId;
                                        $scope.signPlusObj.CounselorSignString = convertedSignatureObj;
                                    }
                                    else if (type == 'Anesthesist') {
                                        $scope.signPlusObj.AnesthesistSignedDateTime = $filter('date')(new Date(), "MM-dd-yyyy hh:mm a");
                                        siguserid = $scope.signPlusObj.AnesthesistUserId;
                                        $scope.signPlusObj.AnesthesistSignString = convertedSignatureObj;
                                    }


                                    if (savetype == "complete") {
                                        $scope.savecompleteSignature();
                                    } else {
                                        if (tabno !== 0) {
                                            $scope.signaturesTab.activeSigatureTab = tabno;
                                        }
                                    }

                                }


                            }
                        } else {

                            var canvasId = "";
                            if (type == "Staff") {
                                canvasId = "signStaffPadUD";
                                if ($scope.signPlusObj.StaffUserId == 0) {
                                    alertify.error("please select a user");
                                    return false;
                                }
                            }
                            else if (type == "Provider") {
                                canvasId = "signProviderPadUD";
                                if ($scope.signPlusObj.ProviderUserId == 0) {
                                    alertify.error("please select a user");
                                    return false;
                                }
                            }
                            else if (type == "Counselor") {
                                canvasId = "signCounsellorPadUD";
                                if ($scope.signPlusObj.CounselorUserId == 0) {
                                    alertify.error("please select a user");
                                    return false;
                                }
                            }
                            else if (type == "Anesthesist") {
                                canvasId = "signAnesthesistPadUD";
                                if ($scope.signPlusObj.AnesthesistUserId == 0) {
                                    alertify.error("please select a user");
                                    return false;
                                }
                            }
                            var canvas = document.getElementById(canvasId);
                            var convertedSignatureObj = canvas.toDataURL();

                            console.log(convertedSignatureObj);


                            if (convertedSignatureObj === 'data:image/png;base64,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') {
                                alertify.error("Please sign to continue");
                                return false;
                            }


                            var siguserid = 0;

                            if (type == 'Staff') {
                                $scope.signPlusObj.StaffSignedDateTime = $filter('date')(new Date(), "MM-dd-yyyy hh:mm a");
                                $scope.signPlusObj.StaffSignString = convertedSignatureObj;
                                siguserid = $scope.signPlusObj.StaffUserId;
                            }
                            else if (type == 'Provider') {
                                $scope.signPlusObj.ProviderSignedDateTime = $filter('date')(new Date(), "MM-dd-yyyy hh:mm a");
                                siguserid = $scope.signPlusObj.ProviderUserId;
                                $scope.signPlusObj.ProviderSignString = convertedSignatureObj;
                            }
                            else if (type == 'Counselor') {
                                $scope.signPlusObj.CounselorSignedDateTime = $filter('date')(new Date(), "MM-dd-yyyy hh:mm a");
                                siguserid = $scope.signPlusObj.CounselorUserId;
                                $scope.signPlusObj.CounselorSignString = convertedSignatureObj;
                            }
                            else if (type == 'Anesthesist') {
                                $scope.signPlusObj.AnesthesistSignedDateTime = $filter('date')(new Date(), "MM-dd-yyyy hh:mm a");
                                siguserid = $scope.signPlusObj.AnesthesistUserId;
                                $scope.signPlusObj.AnesthesistSignString = convertedSignatureObj;
                            }

                            if (savetype == "complete") {
                                $scope.savecompleteSignature();
                            } else {
                                if (tabno !== 0) {
                                    $scope.signaturesTab.activeSigatureTab = tabno;
                                }
                            }


                        }


                    }
                    $scope.SavePatientSignacture = function (Subtype) {
                        $scope.savePatientSignatureDrawtoDB();
                        if (Subtype == 'PatientName') {
                            $scope.signPlusObj.ShowPatientCanvas = true;
                            $scope.signPlusObj.ShowPatientInitialCanvas = false;
                        } else {
                            $scope.signPlusObj.ShowPatientCanvas = false;
                            $scope.signPlusObj.ShowPatientInitialCanvas = true;
                        }
                        $scope.signPlusObj.PatientSignBy = "Drawing";
                    }

                    $scope.saveandnextSignatures = function (type) {
                        var Tab = 0;

                        if (type == "Patient") {
                            var PatientSignatureelements = document.querySelectorAll('[id^="NPatientSignature"]');
                            PatientSignatureelements.forEach(function (element) {
                                if (element.querySelector('table')) {
                                    element.innerHTML = '##PatientSignature##';
                                }
                            });

                            var PatientSignatureDateelements = document.querySelectorAll('[id^="NPatientSignDateTime"]');
                            PatientSignatureDateelements.forEach(function (element) {
                                element.innerHTML = '##PatientSignDateTime##';
                            });

                            var PatientSignatureelements = document.querySelectorAll('[id^="NPatientIntialSignature"]');
                            PatientSignatureelements.forEach(function (element) {
                                if (element.querySelector('table')) {
                                    element.innerHTML = '##PatientIntialSignature##';
                                }
                            });

                            if ($scope.signaturesTab.Staff) {
                                Tab = 2;
                            } else if ($scope.signaturesTab.Provider) {
                                Tab = 3;
                            } else if ($scope.signaturesTab.Counselor) {
                                Tab = 4;
                            } else if ($scope.signaturesTab.Anesthesist) {
                                Tab = 5;
                            } else if ($scope.signaturesTab.Gaurdian) {
                                Tab = 6;
                            }

                            $scope.savePatientSignatureDrawtoDB(Tab, "SaveAndNext");

                        }
                        else if (type == "Staff") {

                            var StaffSignatureelements = document.querySelectorAll('[id^="NStaffSignature"]');
                            StaffSignatureelements.forEach(function (element) {
                                if (element.querySelector('table')) {
                                    element.innerHTML = '##StaffSignature##';
                                }
                            });

                            var StaffSignatureDateelements = document.querySelectorAll('[id^="NStaffSignedDateTime"]');
                            StaffSignatureDateelements.forEach(function (element) {
                                element.innerHTML = '##StaffSignedDateTime##';
                            });

                            if ($scope.signaturesTab.Provider) {
                                Tab = 3;
                            } else if ($scope.signaturesTab.Counselor) {
                                Tab = 4;
                            } else if ($scope.signaturesTab.Anesthesist) {
                                Tab = 5;
                            } else if ($scope.signaturesTab.Gaurdian) {
                                Tab = 6;
                            }

                            $scope.saveUserSignatureDrawtoDB($scope.signPlusObj.StaffUserObj, type, Tab, '', $scope.signPlusObj.StaffSignBy);

                        }
                        else if (type == "Provider") {

                            var ProviderSignatureelements = document.querySelectorAll('[id^="NProviderSignature"]');
                            ProviderSignatureelements.forEach(function (element) {
                                if (element.querySelector('table')) {
                                    element.innerHTML = '##ProviderSignature##';
                                }
                            });
                            var ProviderSignatureDateelements = document.querySelectorAll('[id^="NProviderSignedDateTime"]');
                            ProviderSignatureDateelements.forEach(function (element) {
                                element.innerHTML = '##ProviderSignedDateTime##';
                            });

                            if ($scope.signaturesTab.Counselor) {
                                Tab = 4;
                            } else if ($scope.signaturesTab.Anesthesist) {
                                Tab = 5;
                            } else if ($scope.signaturesTab.Gaurdian) {
                                Tab = 6;
                            }

                            $scope.saveUserSignatureDrawtoDB($scope.signPlusObj.ProviderUserObj, type, Tab, '', $scope.signPlusObj.DoctorSignBy);

                        }
                        else if (type == "Counselor") {

                            var CounselorSignatureelements = document.querySelectorAll('[id^="NCounselorSignature"]');
                            CounselorSignatureelements.forEach(function (element) {
                                if (element.querySelector('table')) {
                                    element.innerHTML = '##CounselorSignature##';
                                }
                            });

                            var CounselorSignatureDateelements = document.querySelectorAll('[id^="NCounselorSignDateTime"]');
                            CounselorSignatureDateelements.forEach(function (element) {
                                element.innerHTML = '##CounselorSignDateTime##';
                            });

                            if ($scope.signaturesTab.Anesthesist) {
                                Tab = 5;
                            } else if ($scope.signaturesTab.Gaurdian) {
                                Tab = 6;
                            }

                            $scope.saveUserSignatureDrawtoDB($scope.signPlusObj.CounselorUserObj, type, Tab, '', $scope.signPlusObj.CounselorSignBy);

                        }
                        else if (type == "Anesthesist") {

                            var AnesthesiaSignatureelements = document.querySelectorAll('[id^="NAnesthesistSignature"]');
                            AnesthesiaSignatureelements.forEach(function (element) {
                                if (element.querySelector('table')) {
                                    element.innerHTML = '##AnesthesistSignature##';
                                }
                            });

                            var AnesthesiaSignatureDateelements = document.querySelectorAll('[id^="NAnesthesistSignDateTime"]');
                            AnesthesiaSignatureDateelements.forEach(function (element) {
                                element.innerHTML = '##AnesthesistSignDateTime##';
                            });

                            if ($scope.signaturesTab.Gaurdian) {
                                Tab = 6;
                            }
                            $scope.saveUserSignatureDrawtoDB($scope.signPlusObj.AnesthesistUserObj, type, Tab, '', $scope.signPlusObj.AnesthesistSignBy);

                        }
                        else {

                            var GaurdianSigantureelements = document.querySelectorAll('[id^="NGaurdianSiganture"]');
                            GaurdianSigantureelements.forEach(function (element) {
                                if (element.querySelector('table')) {
                                    element.innerHTML = '##GaurdianSiganture##';
                                }
                            });

                            var GaurdianSigantureDateelements = document.querySelectorAll('[id^="NGaurdianSignDateTime"]');
                            GaurdianSigantureDateelements.forEach(function (element) {
                                element.innerHTML = '##GaurdianSignDateTime##';
                            });

                            $scope.signaturesTab.activeSigatureTab = 1;
                        }

                        if ($scope.signaturesTab.activeSigatureTab === 2 && $scope.UserId == $scope.signPlusObj.StaffUserId && $scope.signPlusObj.StaffSignString == '') {
                            $scope.OnLoadUserSignature($scope.signPlusObj.StaffUserObj, 'Staff', 'signStaffPadUD');
                        } else if ($scope.signaturesTab.activeSigatureTab === 3 && $scope.UserId == $scope.signPlusObj.ProviderUserId && $scope.signPlusObj.ProviderSignString == '') {
                            $scope.OnLoadUserSignature($scope.signPlusObj.ProviderUserObj, 'Provider', 'signProviderPadUD');
                        } else if ($scope.signaturesTab.activeSigatureTab === 4 && $scope.UserId == $scope.signPlusObj.CounselorUserId && $scope.signPlusObj.CounselorSignString == '') {
                            $scope.OnLoadUserSignature($scope.signPlusObj.CounselorUserObj, 'Counselor', 'signCounsellorPadUD');
                        } else if ($scope.signaturesTab.activeSigatureTab === 5 && $scope.UserId == $scope.signPlusObj.AnesthesistUserId && $scope.signPlusObj.AnesthesistSignString == '') {
                            $scope.OnLoadUserSignature($scope.signPlusObj.AnesthesistUserObj, 'Anesthesist', 'signAnesthesistPadUD');
                        }
                    }

                    $scope.saveandcompleteSignatures = function (type) {

                        if (type == "Patient") {
                            var PatientSignatureelements = document.querySelectorAll('[id^="NPatientSignature"]');
                            PatientSignatureelements.forEach(function (element) {
                                if (element.querySelector('table')) {
                                    element.innerHTML = '##PatientSignature##';
                                }
                            });

                            var PatientSignatureDateelements = document.querySelectorAll('[id^="NPatientSignDateTime"]');
                            PatientSignatureDateelements.forEach(function (element) {
                                element.innerHTML = '##PatientSignDateTime##';
                            });

                            var PatientSignatureelements = document.querySelectorAll('[id^="NPatientIntialSignature"]');
                            PatientSignatureelements.forEach(function (element) {
                                if (element.querySelector('table')) {
                                    element.innerHTML = '##PatientIntialSignature##';
                                }
                            });

                            $scope.savePatientSignatureDrawtoDB(2, 'complete');

                        }
                        else if (type == "Staff") {
                            var StaffSignatureelements = document.querySelectorAll('[id^="NStaffSignature"]');
                            StaffSignatureelements.forEach(function (element) {
                                if (element.querySelector('table')) {
                                    element.innerHTML = '##StaffSignature##';
                                }
                            });

                            var StaffSignatureDateelements = document.querySelectorAll('[id^="NStaffSignedDateTime"]');
                            StaffSignatureDateelements.forEach(function (element) {
                                element.innerHTML = '##StaffSignedDateTime##';
                            });

                            $scope.saveUserSignatureDrawtoDB($scope.signPlusObj.StaffUserObj, type, 3, 'complete', $scope.signPlusObj.StaffSignBy);

                        }
                        else if (type == "Provider") {

                            var ProviderSignatureelements = document.querySelectorAll('[id^="NProviderSignature"]');
                            ProviderSignatureelements.forEach(function (element) {
                                if (element.querySelector('table')) {
                                    element.innerHTML = '##ProviderSignature##';
                                }
                            });
                            var ProviderSignatureDateelements = document.querySelectorAll('[id^="NProviderSignedDateTime"]');
                            ProviderSignatureDateelements.forEach(function (element) {
                                element.innerHTML = '##ProviderSignedDateTime##';
                            });

                            $scope.saveUserSignatureDrawtoDB($scope.signPlusObj.ProviderUserObj, type, 4, 'complete', $scope.signPlusObj.DoctorSignBy);

                        }
                        else if (type == "Counselor") {


                            var CounselorSignatureelements = document.querySelectorAll('[id^="NCounselorSignature"]');
                            CounselorSignatureelements.forEach(function (element) {
                                if (element.querySelector('table')) {
                                    element.innerHTML = '##CounselorSignature##';
                                }
                            });

                            var CounselorSignatureDateelements = document.querySelectorAll('[id^="NCounselorSignDateTime"]');
                            CounselorSignatureDateelements.forEach(function (element) {
                                element.innerHTML = '##CounselorSignDateTime##';
                            });
                            $scope.saveUserSignatureDrawtoDB($scope.signPlusObj.CounselorUserObj, type, 5, 'complete', $scope.signPlusObj.CounselorSignBy);

                        }
                        else if (type == "Anesthesist") {
                            var AnesthesiaSignatureelements = document.querySelectorAll('[id^="NAnesthesistSignature"]');
                            AnesthesiaSignatureelements.forEach(function (element) {
                                if (element.querySelector('table')) {
                                    element.innerHTML = '##AnesthesistSignature##';
                                }
                            });

                            var AnesthesiaSignatureDateelements = document.querySelectorAll('[id^="NAnesthesistSignDateTime"]');
                            AnesthesiaSignatureDateelements.forEach(function (element) {
                                element.innerHTML = '##AnesthesistSignDateTime##';
                            });
                            $scope.saveUserSignatureDrawtoDB($scope.signPlusObj.AnesthesistUserObj, type, 6, 'complete', $scope.signPlusObj.AnesthesistSignBy);

                        } else if (type == "Gaurdian") {

                            var GaurdianSigantureelements = document.querySelectorAll('[id^="NGaurdianSiganture"]');
                            GaurdianSigantureelements.forEach(function (element) {
                                if (element.querySelector('table')) {
                                    element.innerHTML = '##GaurdianSiganture##';
                                }
                            });

                            var GaurdianSigantureDateelements = document.querySelectorAll('[id^="NGaurdianSignDateTime"]');
                            GaurdianSigantureDateelements.forEach(function (element) {
                                element.innerHTML = '##GaurdianSignDateTime##';
                            });

                            $scope.saveGaurdianSignatureDraw(6, 'complete');
                        }
                    }

                    $scope.OnLoadUserSignature = function (obj, type, cId) {

                        obj = obj || "";
                        if (obj != "") {
                            eHnoteSettingsDataService.GetUserEncryptedSig(obj.DoctorID).then(function (response) {
                                console.log(response);

                                response.data.UserEncryptedSig = response.data.UserEncryptedSig || "";

                                if (response.data.UserEncryptedSig == '') {
                                    alertify.error("There is no signature added for this user");
                                    return false;
                                }

                                if (response.data.UserEncryptedSig != "") {


                                    var canvas = document.getElementById(cId);
                                    var context = canvas.getContext('2d');
                                    var image = new Image();
                                    image.onload = function () {
                                        var centerX = canvas.width / 2 - image.width / 2;
                                        var centerY = canvas.height / 2 - image.height / 2;
                                        context.drawImage(image, centerX, centerY);
                                    };
                                    image.src = response.data.UserEncryptedSig;

                                    if (type == 'Staff') {
                                        $scope.signPlusObj.staffreadyToSign = true;
                                        $scope.signPlusObj.IsStaffDigitalSignTaken = true;
                                        $scope.signPlusObj.StaffSignString = response.data.UserEncryptedSig;
                                    }
                                    else if (type == 'Provider') {
                                        $scope.signPlusObj.providerreadyToSign = true;
                                        $scope.signPlusObj.IsProviderDigitalSignTaken = true;
                                        $scope.signPlusObj.ProviderSignString = response.data.UserEncryptedSig;
                                    }
                                    else if (type == 'Counselor') {
                                        $scope.signPlusObj.counselorreadyToSign = true;
                                        $scope.signPlusObj.IsCounselorDigitalSignTaken = true;
                                        $scope.signPlusObj.CounselorSignString = response.data.UserEncryptedSig;
                                    }
                                    else if (type == 'Anesthesist') {
                                        $scope.signPlusObj.anesthesistreadyToSign = true;
                                        $scope.signPlusObj.IsAnesthesistDigitalSignTaken = true;
                                        $scope.signPlusObj.AnesthesistSignString = response.data.UserEncryptedSig;
                                    }
                                }

                            }, function (err) {

                            });
                        } else {
                            alertify.error("please select a user");
                            return false;
                        }
                    }

                    $scope.PatientValidateLoadSignOff = function (obj, type, cId) {

                        let DoctorId = null;

                        if (type == 'Staff') {
                            $scope.signPlusObj.StaffUserId = $scope.signPlusObj.StaffUserId || null;
                            $scope.signPlusObj.ValidatePassword = $scope.signPlusObj.ValidatePassword || "";
                            $scope.signPlusObj.DoctorId = $scope.signPlusObj.StaffUserId || null;
                        }

                        if (type == 'Provider') {
                            $scope.signPlusObj.ProviderUserId = $scope.signPlusObj.ProviderUserId || null;
                            $scope.signPlusObj.DoctorId = $scope.signPlusObj.ProviderUserId;
                            $scope.signPlusObj.ValidatePassword = $scope.signPlusObj.ValidatePassword || "";

                        }
                        if (type == 'Counselor') {
                            $scope.signPlusObj.CounselorUserId = $scope.signPlusObj.CounselorUserId || null;
                            $scope.signPlusObj.DoctorId = $scope.signPlusObj.CounselorUserId;
                            $scope.signPlusObj.ValidatePassword = $scope.signPlusObj.ValidatePassword || "";

                        }
                        if (type == 'Anesthesist') {
                            $scope.signPlusObj.AnesthesistUserId = $scope.signPlusObj.AnesthesistUserId || null;
                            $scope.signPlusObj.DoctorId = $scope.signPlusObj.AnesthesistUserId;
                            $scope.signPlusObj.ValidatePassword = $scope.signPlusObj.ValidatePassword || "";

                        }

                        if ($scope.signPlusObj.DoctorId == null) {
                            alertify.error("Select User");
                            return false;
                        }


                        $scope.signPlusObj.ValidatePassword = $scope.signPlusObj.ValidatePassword || "";
                        if ($scope.signPlusObj.ValidatePassword == "") {
                            alertify.error("Please Enter Valid Password");
                            return false;
                        }

                        let params = {
                            "UserId": $scope.mainObject.UserId,
                            "OrganizationId": $scope.mainObject.HospitalId,
                            "PatientId": $scope.mainObject.PatientId || 0,
                            "AppointmentId": $scope.mainObject.AppointmentId || 0,
                            "SignatureUserId": $scope.signPlusObj.DoctorId || null,
                            "SignaturePassword": $scope.signPlusObj.ValidatePassword || "",
                            "ConsentFormId": 0
                        }

                        eHnoteSettingsDataService.GetValidateConsentUserSig(params).then(function (response) {
                            if (response.data.status == "Success") {

                                response.data.UserEncryptedSig = response.data.UserEncryptedSig || "";

                                if (response.data.UserEncryptedSig == '') {
                                    alertify.error("There is no signature added for this user");
                                    return false;
                                }
                                if (response.data.UserEncryptedSig != "") {
                                    var canvas = document.getElementById(cId);
                                    var context = canvas.getContext('2d');
                                    var image = new Image();
                                    image.onload = function () {
                                        var centerX = canvas.width / 2 - image.width / 2;
                                        var centerY = canvas.height / 2 - image.height / 2;
                                        context.drawImage(image, centerX, centerY);
                                    };
                                    image.src = response.data.UserEncryptedSig;
                                    $scope.signPlusObj.ValidatePassword = "";
                                    if (type == 'Staff') {
                                        $scope.signPlusObj.staffreadyToSign = true;
                                        $scope.signPlusObj.IsStaffDigitalSignTaken = true;
                                        $scope.signPlusObj.StaffSignString = response.data.UserEncryptedSig;

                                    }
                                    else if (type == 'Provider') {
                                        $scope.signPlusObj.providerreadyToSign = true;
                                        $scope.signPlusObj.IsProviderDigitalSignTaken = true;
                                        $scope.signPlusObj.ProviderSignString = response.data.UserEncryptedSig;
                                    }
                                    else if (type == 'Counselor') {
                                        $scope.signPlusObj.counselorreadyToSign = true;
                                        $scope.signPlusObj.IsCounselorDigitalSignTaken = true;
                                        $scope.signPlusObj.CounselorSignString = response.data.UserEncryptedSig;
                                    }
                                    else if (type == 'Anesthesist') {
                                        $scope.signPlusObj.anesthesistreadyToSign = true;
                                        $scope.signPlusObj.IsAnesthesistDigitalSignTaken = true;
                                        $scope.signPlusObj.AnesthesistSignString = response.data.UserEncryptedSig;
                                    }
                                }

                            } else if (response.data.Status == "Failure") {
                                $scope.signPlusObj.ValidatePassword = "";
                                alertify.error("Invalid Password");
                                return false;
                            }

                        }, function (err) {

                        });
                    };

                    $scope.OnSignPatientInitialSignature = function () {

                        if (IsSigWebInstalled()) {
                            var ctx = document.getElementById('signPatientIntialPadUD').getContext('2d');
                            SetDisplayPenWidth(5);
                            SetDisplayXSize(1200);
                            SetDisplayYSize(700);
                            SetTabletState(0, tmr);
                            // SetJustifyMode(0);
                            SetJustifyMode(5)
                            ClearTablet();
                            SetEncryptionMode(3);
                            AutoKeyAddData("0000000000000000");
                            SetKeyString("0000000000000000");

                            if (tmr == null) {
                                tmr = SetTabletState(1, ctx, 50);
                            }
                            else {
                                SetTabletState(0, tmr);
                                tmr = null;
                                tmr = SetTabletState(1, ctx, 50);
                            }

                        } else {
                            alert("Unable to communicate with SigWeb. Please confirm that SigWeb is installed and running on this PC.");
                        }
                    };
                    $scope.OnClearPatientIntialSignature = function () {
                        var intialcanvas = document.getElementById('signPatientIntialPadUD');
                        var intialcontext = intialcanvas.getContext('2d');
                        intialcontext.clearRect(0, 0, intialcanvas.width, intialcanvas.height);
                        $scope.signPlusObj.PatientIntialSignString = '';

                    }
                }
            });
            $scope.mInstanceAdd.result.then(function (result) {

                $scope.fillCustomSignatureValues(result);
            }, function (cancel) {
            });
        };

        function getRandom4DigitNumber() {
            return Math.floor(Math.random() * 9000) + 1000; // Generates a random 4-digit number
        }

        $scope.fillCustomSignatureValues = function (resp) {

            if (resp.PatientSignString != "") {
                var random4DigitNumber = getRandom4DigitNumber();

                var patientsignaturedom = '<table><tr><td><img class="imgSignature" style = "width:150px;80px;display:inline-block;" id="PatientImg_' + random4DigitNumber + '" src="' + resp.PatientSignString + '"></td></tr></table>';
                var PatientSignatureelements = document.querySelectorAll('[id^="NPatientSignature"]');
                PatientSignatureelements.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##PatientSignature##/g, patientsignaturedom);
                });
                $scope.mainConsentObj.PatientSignString = resp.PatientSignString || '';

                $scope.mainConsentObj.PatientSignedDateTime = $filter('date')(resp.PatientSignedDateTime, "MM-dd-yyyy hh:mm a") || '';

                var PatientSigDateTimeElement = document.querySelectorAll('[id^="NPatientSignDateTime"]');
                PatientSigDateTimeElement.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##PatientSignDateTime##/g, $scope.mainConsentObj.PatientSignedDateTime);
                });
            }
            if (resp.PatientIntialSignString != "") {
                var random4DigitNumber = getRandom4DigitNumber();
                var patientintsignaturedom = '<table><tr><td><img class="imgSignature" style="width:150px;80px;display:inline-block;" id="PatientImg_' + random4DigitNumber + '" src="' + resp.PatientIntialSignString + '"></td></tr></table>';
                var PatientintSignatureelements = document.querySelectorAll('[id^="NPatientIntialSignature"]');
                PatientintSignatureelements.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##PatientIntialSignature##/g, patientintsignaturedom);
                });
                $scope.mainConsentObj.PatientIntialSignString = resp.PatientIntialSignString || '';
            }
            if (resp.StaffSignString != "") {
                var random4DigitNumber = getRandom4DigitNumber();
                var staffsignaturedom = '<table><tr><td><img class="imgSignature" style = "width:150px;80px;display:inline-block;" id="PatientImg_' + random4DigitNumber + '" src="' + resp.StaffSignString + '"></td></tr></table>';
                var StaffSignatureelements = document.querySelectorAll('[id^="NStaffSignature"]');
                StaffSignatureelements.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##StaffSignature##/g, staffsignaturedom);
                });
                $scope.mainConsentObj.StaffUserId = resp.StaffUserId || 0;
                $scope.mainConsentObj.StaffSignString = resp.StaffSignString || '';

                $scope.mainConsentObj.StaffSignedDateTime = $filter('date')(resp.StaffSignedDateTime, "MM-dd-yyyy hh:mm a") || '';
                var StaffSigDateTimeElement = document.querySelectorAll('[id^="NStaffSignedDateTime"]');
                StaffSigDateTimeElement.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##StaffSignedDateTime##/g, $scope.mainConsentObj.StaffSignedDateTime);
                });
            }
            if (resp.ProviderSignString != "") {
                var random4DigitNumber = getRandom4DigitNumber();
                var providersignaturedom = '<table><tr><td><img class="imgSignature" style = "width:150px;80px;display:inline-block;" id="PatientImg_' + random4DigitNumber + '" src="' + resp.ProviderSignString + '"></td></tr></table>';

                var ProviderSignatureelements = document.querySelectorAll('[id^="NProviderSignature"]');
                ProviderSignatureelements.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##ProviderSignature##/g, providersignaturedom);
                });
                $scope.mainConsentObj.ProviderUserId = resp.ProviderUserId || 0;
                $scope.mainConsentObj.ProviderSignString = resp.ProviderSignString || '';
                $scope.mainConsentObj.ProviderSignedDateTime = $filter('date')(resp.ProviderSignedDateTime, "MM-dd-yyyy hh:mm a") || '';

                var ProviderSigDateTimeElement = document.querySelectorAll('[id^="NProviderSignedDateTime"]');
                ProviderSigDateTimeElement.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##ProviderSignedDateTime##/g, $scope.mainConsentObj.ProviderSignedDateTime);
                });
            }
            if (resp.CounselorSignString != "") {
                var random4DigitNumber = getRandom4DigitNumber();
                var CounselorSignaturedom = '<table><tr><td><img class="imgSignature" style = "width:150px;80px;display:inline-block;" id="PatientImg_' + random4DigitNumber + '" src="' + resp.CounselorSignString + '"></td></tr></table>';

                var CounselorSignatureelements = document.querySelectorAll('[id^="NCounselorSignature"]');
                CounselorSignatureelements.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##CounselorSignature##/g, CounselorSignaturedom);
                });
                $scope.mainConsentObj.CounselorUserId = resp.CounselorUserId || 0;
                $scope.mainConsentObj.CounselorSignString = resp.CounselorSignString || '';
                $scope.mainConsentObj.CounselorSignedDateTime = $filter('date')(resp.CounselorSignedDateTime, "MM-dd-yyyy hh:mm a") || '';

                var CounselorSigDateTimeElement = document.querySelectorAll('[id^="NCounselorSignDateTime"]');
                CounselorSigDateTimeElement.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##CounselorSignDateTime##/g, $scope.mainConsentObj.CounselorSignedDateTime);
                });
            }
            if (resp.AnesthesistSignString != "") {
                var random4DigitNumber = getRandom4DigitNumber();
                var anesthesistsignaturedom = '<table><tr><td><img class="imgSignature" style = "width:150px;80px;display:inline-block;" id="PatientImg_' + random4DigitNumber + '" src="' + resp.AnesthesistSignString + '"></td></tr></table>';


                var AnesthesistSignatureelements = document.querySelectorAll('[id^="NAnesthesistSignature"]');
                AnesthesistSignatureelements.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##AnesthesistSignature##/g, anesthesistsignaturedom);
                });
                $scope.mainConsentObj.AnesthesistUserId = resp.AnesthesistUserId || 0;
                $scope.mainConsentObj.AnesthesistSignString = resp.AnesthesistSignString || '';
                $scope.mainConsentObj.AnesthesistSignedDateTime = $filter('date')(resp.AnesthesistSignedDateTime, "MM-dd-yyyy hh:mm a") || '';

                var AnesthesistSigDateTimeElement = document.querySelectorAll('[id^="NAnesthesistSignDateTime"]');
                AnesthesistSigDateTimeElement.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##AnesthesistSignDateTime##/g, $scope.mainConsentObj.AnesthesistSignedDateTime);
                });
                if (resp.AnesthesistUserObj && resp.AnesthesistUserObj.FullName) {
                    const anesthesistName = resp?.AnesthesistUserObj?.FullName || ""
                    let AnesthesistNameElement = document.querySelectorAll('[id^="NAnesthesiologistName"]');
                    AnesthesistNameElement.forEach(function (element) {
                        element.innerHTML = element.innerHTML.replace(/##AnesthesiologistName##/g, anesthesistName);
                    });
                }
            }
            if (resp.GaurdianSignString != "") {
                var random4DigitNumber = getRandom4DigitNumber();
                var gaurdiansignaturedom = '<table><tr><td><img class="imgSignature" style = "width:150px;80px;display:inline-block;" id="PatientImg_' + random4DigitNumber + '" src="' + resp.GaurdianSignString + '"></td></tr></table>';

                var GaurdianSigantureelements = document.querySelectorAll('[id^="NGaurdianSiganture"]');
                GaurdianSigantureelements.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##GaurdianSiganture##/g, gaurdiansignaturedom);
                });
                $scope.mainConsentObj.GaurdianSignString = resp.GaurdianSignString || '';
                $scope.mainConsentObj.GaurdianFirstName = resp.GaurdianFirstName || '';
                $scope.mainConsentObj.GaurdianLastName = resp.GaurdianLastName || '';
                $scope.mainConsentObj.GaurdianRelationShipId = resp.GaurdianRelationShipId || '';

                $scope.mainConsentObj.GaurdianSignedDateTime = $filter('date')(resp.GaurdianSignedDateTime, "MM-dd-yyyy hh:mm a") || '';

                var relationshipname = "";
                let temparray = $filter('filter')($scope.RelationShipTypeList, { 'RelationId': $scope.mainConsentObj.GaurdianRelationShipId }, true);
                if (temparray.length > 0) {
                    relationshipname = temparray[0].RelationName || "";
                }
                var GaurdianRelationShipElement = document.querySelectorAll('[id^="NGaurdianRelationShip"]');
                GaurdianRelationShipElement.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##GaurdianRelationShip##/g, relationshipname);
                });
                var GaurdianNameElement = document.querySelectorAll('[id^="NPatientGaurdianName"]');
                GaurdianNameElement.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##PatientGaurdianName##/g, $scope.mainConsentObj.GaurdianFirstName + " " + $scope.mainConsentObj.GaurdianLastName);
                });

                var GaurdianSigDateTimeElement = document.querySelectorAll('[id^="NGaurdianSignDateTime"]');
                GaurdianSigDateTimeElement.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##GaurdianSignDateTime##/g, $scope.mainConsentObj.GaurdianSignedDateTime);
                });
            }
        }

        $scope.FillPatientValues = function () {
            // $scope.selectedPatientSurgeryObj = $scope.ParentObject.mainitem;
            //var HospitalAddress = $scope.selectedHospitalAddress[0].Address1 + "," + $scope.selectedHospitalAddress[0].Address2 + ","+'<br>' + $scope.selectedHospitalAddress[0].CityName + "," + $scope.selectedHospitalAddress[0].StateName + "," + $scope.selectedHospitalAddress[0].CountryName + "," + $scope.selectedHospitalAddress[0].PinCode
            $scope.SelectedPatObj = $scope.SelectedPatObj || null;

            if ($scope.SelectedPatObj !== null) {
                $scope.SelectedPatObj.PermanentAddress = $scope.SelectedPatObj.PermanentAddress || [];
                $scope.SelectedPatObj.PostalAddress = $scope.SelectedPatObj.PostalAddress || [];
                if ($scope.SelectedPatObj.PermanentAddress.length > 0) {
                    $scope.SelectedPatObj.PermanentAddress[0].Address1 = $scope.SelectedPatObj.PermanentAddress[0].Address1 || '';
                    $scope.SelectedPatObj.PermanentAddress[0].Address2 = $scope.SelectedPatObj.PermanentAddress[0].Address2 || '';
                    $scope.SelectedPatObj.PermanentAddress[0].CityName = $scope.SelectedPatObj.PermanentAddress[0].CityName || '';
                    $scope.SelectedPatObj.PermanentAddress[0].StateName = $scope.SelectedPatObj.PermanentAddress[0].StateName || '';
                    $scope.SelectedPatObj.PermanentAddress[0].ZipCode = $scope.SelectedPatObj.PermanentAddress[0].ZipCode || '';

                    if ($scope.SelectedPatObj.PermanentAddress[0].Address1 !== "" || $scope.SelectedPatObj.PermanentAddress[0].Address2 !== "" || $scope.SelectedPatObj.PermanentAddress[0].CityName !== "" || $scope.SelectedPatObj.PermanentAddress[0].StateName !== "" || $scope.SelectedPatObj.PermanentAddress[0].ZipCode !== "") {
                        var PatientPermanentAddress = $scope.SelectedPatObj.PermanentAddress[0].Address1 + "," + $scope.SelectedPatObj.PermanentAddress[0].Address2 + "," + '' + $scope.SelectedPatObj.PermanentAddress[0].CityName + "," + $scope.SelectedPatObj.PermanentAddress[0].StateName + "," + $scope.SelectedPatObj.PermanentAddress[0].ZipCode;
                    } else {
                        var PatientPermanentAddress = "";
                    }
                }
                if ($scope.SelectedPatObj.PostalAddress.length > 0) {
                    $scope.SelectedPatObj.PostalAddress[0].Address1 = $scope.SelectedPatObj.PostalAddress[0].Address1 || '';
                    $scope.SelectedPatObj.PostalAddress[0].Address2 = $scope.SelectedPatObj.PostalAddress[0].Address2 || '';
                    $scope.SelectedPatObj.PostalAddress[0].CityName = $scope.SelectedPatObj.PostalAddress[0].CityName || '';
                    $scope.SelectedPatObj.PostalAddress[0].StateName = $scope.SelectedPatObj.PostalAddress[0].StateName || '';
                    $scope.SelectedPatObj.PostalAddress[0].StateName = $scope.SelectedPatObj.PostalAddress[0].StateName || '';
                    $scope.SelectedPatObj.PostalAddress[0].ZipCode = $scope.SelectedPatObj.PostalAddress[0].ZipCode || '';

                    if ($scope.SelectedPatObj.PostalAddress[0].Address1 !== "" || $scope.SelectedPatObj.PostalAddress[0].Address2 !== "" || $scope.SelectedPatObj.PostalAddress[0].CityName !== "" || $scope.SelectedPatObj.PostalAddress[0].StateName !== "" || $scope.SelectedPatObj.PostalAddress[0].ZipCode !== "") {
                        var PatientPostalAddress = $scope.SelectedPatObj.PostalAddress[0].Address1 + "," + $scope.SelectedPatObj.PostalAddress[0].Address2 + "," + '' + $scope.SelectedPatObj.PostalAddress[0].CityName + "," + $scope.SelectedPatObj.PostalAddress[0].StateName + "," + $scope.SelectedPatObj.PostalAddress[0].ZipCode;
                    } else {
                        var PatientPostalAddress = "";
                    }
                }
            }
            $scope.SelectedOrgObj = $scope.SelectedOrgObj || null;
            if ($scope.SelectedOrgObj !== null) {
                $scope.SelectedOrgObj.OrganizationAddress = $scope.SelectedOrgObj.OrganizationAddress || [];
                if ($scope.SelectedOrgObj.OrganizationAddress.length > 0) {
                    var OrganizationAddress = $scope.SelectedOrgObj.OrganizationAddress[0].Address1 + "," + $scope.SelectedOrgObj.OrganizationAddress[0].Address2 + "," + '' + $scope.SelectedOrgObj.OrganizationAddress[0].CityName + "," + $scope.SelectedOrgObj.OrganizationAddress[0].StateName + "," + $scope.SelectedOrgObj.OrganizationAddress[0].ZipCode;
                }
            }

            //if ($scope.SelectedPatObj.PermanentAddress.length > 0) {
            //    if ($scope.SelectedPatObj.PermanentAddress[0].Address1 !== "" || $scope.SelectedPatObj.PermanentAddress[0].Address2 !== "" || $scope.SelectedPatObj.PermanentAddress[0].CityName !== "" || $scope.SelectedPatObj.PermanentAddress[0].StateName !== "" || $scope.SelectedPatObj.PermanentAddress[0].ZipCode !== "") {
            //        var PatientPermanentAddress = $scope.SelectedPatObj.PermanentAddress[0].Address1 + "," + $scope.SelectedPatObj.PermanentAddress[0].Address2 + "," + '' + $scope.SelectedPatObj.PermanentAddress[0].CityName + "," + $scope.SelectedPatObj.PermanentAddress[0].StateName + "," + $scope.SelectedPatObj.PermanentAddress[0].ZipCode;
            //    } else {
            //        var PatientPermanentAddress = "";
            //    }
            //}
            //if ($scope.SelectedPatObj.PostalAddress.length > 0) {
            //    if ($scope.SelectedPatObj.PostalAddress[0].Address1 !== "" || $scope.SelectedPatObj.PostalAddress[0].Address2 !== "" || $scope.SelectedPatObj.PostalAddress[0].CityName !== "" || $scope.SelectedPatObj.PostalAddress[0].StateName !== "" || $scope.SelectedPatObj.PostalAddress[0].ZipCode !== "") {
            //        var PatientPostalAddress = $scope.SelectedPatObj.PostalAddress[0].Address1 + "," + $scope.SelectedPatObj.PostalAddress[0].Address2 + "," + '' + $scope.SelectedPatObj.PostalAddress[0].CityName + "," + $scope.SelectedPatObj.PostalAddress[0].StateName + "," + $scope.SelectedPatObj.PostalAddress[0].ZipCode;
            //    } else {
            //        var PatientPostalAddress = "";
            //    }
            //}
            $scope.AssessmentPlan = $scope.AssessmentPlan || [];
            var DiagnosisName = '';
            if ($scope.AssessmentPlan.length > 0) {
                angular.forEach($scope.AssessmentPlan, function (item) {
                    if (DiagnosisName == '') {
                        DiagnosisName = item.DiagnosisName;
                    } else {
                        DiagnosisName = DiagnosisName + '\n' + item.DiagnosisName;
                    }


                });
            }
            $scope.BillingList = $scope.BillingList || [];
            if ($scope.BillingList.length > 0) {
                $scope.BillingList[0].PolicyId = $scope.BillingList[0].PolicyId || '';
                $scope.BillingList[0].RelationName = $scope.BillingList[0].RelationName || '';

                var PolicyId = $scope.BillingList[0].PolicyId || '';
                var RelationName = $scope.BillingList[0].RelationName || '';
            }
            $scope.CurrentDate = $filter('date')(new Date(), "MM-dd-yyyy");


            $scope.PatientFillObj = {
                "PatientName": $scope.SelectedPatObj.FullName || '',
                "PatientGender": $scope.SelectedPatObj.Gender || "",
                "PatientAge": patientParticularDetailsObj.AgeInYears || "",
                "PatientDOB": $filter('date')($scope.SelectedPatObj.DOB, "MM-dd-yyyy") || "",// $scope.SelectedPatObj.DOB || "",
                "PatientFirstName": $scope.SelectedPatObj.FirstName || "",
                "PatientLastName": $scope.SelectedPatObj.LastName || "",
                "PatientMrNo": $scope.SelectedPatObj.MrNumber || "",
                "PatientSSN": $scope.SelectedPatObj.SSN || "",
                "PatientCity": "",
                "PatientState": "",
                "PatientAddress1": "",
                "PatientAddress2": "",
                "PatientZipCode": "",
                "PatientBloodGroup": $scope.SelectedPatObj.BloodGroup || "",
                "PatientNationality": "",
                "PatientEmail": $scope.SelectedPatObj.Email || "",
                "PatientMaritalStatus": "",
                "OrganizationAddress": OrganizationAddress || "",
                "BranchName": $scope.SelectedOrgObj.OrganizationName || "",
                "DoctorFullName": $scope.SelectedApptObj.AppointmentDoctorFullName || "",
                "DoctorMobile": $scope.SelectedApptObj.AppointmentDoctorMobile || "",
                "DoctorSpecializationName": $scope.SelectedApptObj.Specialization || "",
                "HospitalContactNumber": $scope.SelectedOrgObj.OrganizationMobileNumber || "",
                "PatientPermanentAddress": PatientPermanentAddress || "",
                "PatientVisitDiagnosis": DiagnosisName || "",
                "PatientPostalAddress": PatientPostalAddress || "",
                "SurgeryDate": "",
                "SurgeryProcedureName": "",
                "SurgeryProcedureCPTCode": "",
                "SurgeryStartTime": "",
                "SurgeryEndTime": "",
                "SurgeryAppointmentTime": "",
                "SurgeryEye": "",
                "PreAdmissionAppointmentDate": "",
                "PreAdmissionTime": "",
                "SurgeryDiagnosis": "",
                "SurgeryAnesthesiaType": "",
                "AnesthetistName": "",
                "SurgeryKlonopinTiming": "",
                "ReferralDoctorFullName": "",
                "ReferralDoctorAddress": "",
                "GaurdianRelationShipId": "",
                "PolicyId": PolicyId || "",
                "RelationName": RelationName || "",
                "TotalPatientClaimBalance": $scope.TotalPatientClaimBalance || 0,
                "VisitDate": $scope.VisitDate || "",
                "CurrentDate": $scope.CurrentDate || "",
                "primaryInsuranceName": "",
                "secondaryInsuranceName": "",
                "PatientHomeNumber": "",
                "PCPName": "",
                "PCPAddress": "",
                "CoManagerName": "",
                "CoManagerAddress": "",
                "ExternalComanagerName": "",
                "TonometryIOPDetails": "",
                "AssessmentsAndPlans": "",
                "VisionDetails": "",
                "PosteriorSegmentDetails": "",
                "AnteriorSegmentDetails":"",

            };
            if ($scope.PatientFillObj.VisitDate != '') {
                $scope.PatientFillObj.VisitDate = $filter('date')($scope.PatientFillObj.VisitDate, "MM-dd-yyyy");
            }

            if ($scope.PatientFillObj.RelationName == 'Self') {
                $scope.PatientFillObj.RelationName = $scope.SelectedPatObj.FullName || '';
            }

            if ($scope.PatientFillObj.PatientDOB != '') {
                $scope.PatientDOB = $filter('date')($scope.PatientFillObj.PatientDOB, "MM-dd-yyyy");
            }
            $scope.PatientMobileNumber = '';
            if ($scope.SelectedPatObj.MobileNumber != '') {
                var obj = eHnoteUserDataService.UsMobileFormatChange($scope.SelectedPatObj.MobileNumber);
                $scope.PatientMobileNumber = obj.UsFormatMobileNumber;
            }
            if ($scope.PatientFillObj.HospitalContactNumber != '') {
                var obj = eHnoteUserDataService.UsMobileFormatChange($scope.PatientFillObj.HospitalContactNumber);
                $scope.PatientFillObj.HospitalContactNumber = obj.UsFormatMobileNumber;
            }

            if ($scope.PatientFillObj.DoctorMobile != '') {
                var obj = eHnoteUserDataService.UsMobileFormatChange($scope.PatientFillObj.DoctorMobile);
                $scope.PatientFillObj.DoctorMobile = obj.UsFormatMobileNumber;
            }

            if ($scope.PatientASCApptdetails !== undefined) {
                $scope.PatientFillObj.SurgeryDate = $filter('date')($scope.PatientASCApptdetails.SurgeryDate, "MM-dd-yyyy") || "";
                $scope.PatientFillObj.SurgeryProcedureName = $scope.PatientASCApptdetails.SurgeryProcedureName || "";
                $scope.PatientFillObj.SurgeryProcedureCPTCode = $scope.PatientASCApptdetails.SurgeryProcedureCPTCode || "";
                $scope.PatientFillObj.SurgeryStartTime = $scope.PatientASCApptdetails.SurgeryStartTime || "";
                $scope.PatientFillObj.SurgeryAppointmentTime = $scope.PatientASCApptdetails.SurgryAppointmentTime || "";
                if ($scope.PatientFillObj.SurgeryAppointmentTime != '' && $scope.PatientFillObj.SurgeryDate != '') {
                    let Surgdate = $scope.PatientFillObj.SurgeryDate + " " + $scope.PatientFillObj.SurgeryAppointmentTime;
                    $scope.PatientFillObj.SurgeryAppointmentTime = $filter('date')(new Date(Surgdate), "hh:mm a");
                }

                $scope.PatientFillObj.SurgeryEndTime = $scope.PatientASCApptdetails.SurgeryEndTime || "";

                $scope.PatientFillObj.SurgeryEye = $scope.PatientASCApptdetails.SurgeryEye || "";
                $scope.PatientFillObj.PreAdmissionAppointmentDate = $filter('date')($scope.PatientASCApptdetails.PreAdmissionAppointmentDate, "MM-dd-yyyy") || "";
                $scope.PatientFillObj.PreAdmissionTime = $scope.PatientASCApptdetails.PreAdmissionAppointmentTime || "";

                if ($scope.PatientFillObj.PreAdmissionTime != '' && $scope.PatientFillObj.PreAdmissionAppointmentDate != '') {
                    let Surgdate = $scope.PatientFillObj.PreAdmissionAppointmentDate + " " + $scope.PatientFillObj.PreAdmissionTime;
                    $scope.PatientFillObj.PreAdmissionTime = $filter('date')(new Date(Surgdate), "hh:mm a");
                }

                $scope.PatientASCApptdetails.DiagnosisList = $scope.PatientASCApptdetails.DiagnosisList || [];
                if ($scope.PatientASCApptdetails.DiagnosisList.length > 0) {
                    angular.forEach($scope.PatientASCApptdetails.DiagnosisList, function (ditem) {
                        $scope.PatientFillObj.SurgeryDiagnosis += ditem.DiagnosisName + " ;";
                    });
                }
                $scope.PatientASCApptdetails.AnesthesiaTypelist = $scope.PatientASCApptdetails.AnesthesiaTypelist || [];
                if ($scope.PatientASCApptdetails.AnesthesiaTypelist.length > 0) {
                    angular.forEach($scope.PatientASCApptdetails.AnesthesiaTypelist, function (ditem) {
                        $scope.PatientFillObj.SurgeryAnesthesiaType += ditem.AnesthesiaType + " ;";
                    });
                }

                $scope.PatientFillObj.AnesthetistName = $scope.PatientASCApptdetails.AnesthetistName || "";
                $scope.PatientFillObj.CordinatorIOLType = $scope.PatientASCApptdetails.CordinatorIOLType || "";




                $scope.PatientASCApptdetails.ASCMedications = $scope.PatientASCApptdetails.ASCMedications || [];
                if ($scope.PatientASCApptdetails.ASCMedications.length > 0) {
                    angular.forEach($scope.PatientASCApptdetails.ASCMedications, function (Kitem) {
                        if (Kitem.MedicationTime && Kitem.MedicationTime.length > 0) {
                            $scope.PatientFillObj.SurgeryKlonopinTiming = Kitem.MedicationTime[0].MedicationTime || "";
                        }
                    });
                }
            }
            const insuranceDetails = patientParticularDetailsObj?.PatientInsuranceDetails || [];
            insuranceDetails.forEach(item => {
                const insuranceName = `${item.OrganizationPayorName} , ${item.PlanName}`;
                if (item.IdentifierId === 1) {
                    $scope.PatientFillObj.primaryInsuranceName = insuranceName;
                } else if (item.IdentifierId === 2) {
                    $scope.PatientFillObj.secondaryInsuranceName = insuranceName;
                }
            });
            if (patientParticularDetailsObj?.ContactNo || $scope.SelectedPatObj?.PCPDoctorName || $scope.SelectedPatObj?.InternalComanagerName || $scope.SelectedPatObj?.ExternalComanagerName) {
                let contactNumber = patientParticularDetailsObj?.ContactNo;
                let usFormatNumber = contactNumber ? eHnoteUserDataService.UsMobileFormatChange(contactNumber) :'';
                $scope.PatientFillObj.PatientHomeNumber = usFormatNumber ? usFormatNumber.UsFormatMobileNumber : '';
                console.log(patientParticularDetailsObj.ContactNo, $scope.PatientFillObj.PatientHomeNumber)
                $scope.PatientFillObj.PCPName = $scope.SelectedPatObj.PCPDoctorName || "";
                $scope.PatientFillObj.ExternalComanagerName = $scope.SelectedPatObj.ExternalComanagerName || "";
            }
            const exteranlCoMangerAdderss = $scope.SelectedPatObj?.ExtrenalDetails || null;
            if (exteranlCoMangerAdderss) {
                const addressParts = [
                    exteranlCoMangerAdderss.Address1,
                    exteranlCoMangerAdderss.Address2,
                    exteranlCoMangerAdderss.CityName,
                    exteranlCoMangerAdderss.StateName,
                    exteranlCoMangerAdderss.ZipCode,
                    exteranlCoMangerAdderss.CountyName
                ].filter(part => part);
                $scope.PatientFillObj.CoManagerAddress = addressParts.join(', ');
            }
            if (pcpAddress && pcpAddress.length > 0) {
                const pcpDocAdress = pcpAddress[0];
                const addressParts = [
                    pcpDocAdress.Address1,
                    pcpDocAdress.Address2,
                    pcpDocAdress.CityName,
                    pcpDocAdress.StateName,
                    pcpDocAdress.ZipCode,
                    pcpDocAdress.CountyName
                ].filter(part => part);
                $scope.PatientFillObj.PCPAddress = addressParts.join(', ');
            }
            if (refferalProviderAdress) {
                const addressParts = [
                    refferalProviderAdress.Address1,
                    refferalProviderAdress.Address2,
                    refferalProviderAdress.CityName,
                    refferalProviderAdress.StateName,
                    refferalProviderAdress.ZipCode,
                    refferalProviderAdress.CountyName
                ].filter(part => part);
                $scope.PatientFillObj.ReferralDoctorAddress = addressParts.join(', ') || '';
            }
            if (tonometryDetails.length > 0) {
                let tonometryText = "IOP: ";

                tonometryDetails.forEach((item, index) => {
                    let rightEyeValue = item.BeforeDilationRightEye || "-";
                    let leftEyeValue = item.BeforeDilationLeftEye || "-";
                    let dropName = item.DropMedicineName || "-";
                    tonometryText += `OD: ${rightEyeValue}, OS: ${leftEyeValue}, Drop: ${dropName}`;
                    if (index < tonometryDetails.length - 1) {
                        tonometryText += " <br/> ";
                    }
                });

                $scope.PatientFillObj.TonometryIOPDetails = tonometryText;
            }
            if (visionDetails && visionDetails.length > 0) {
                let visualAcuityText = " <br/> <b>Visual Acuity:</b> <br/>";
                visionDetails = visionDetails.filter(item => item.InvestigationId == 5 || item.InvestigationId == 4);
                visionDetails.forEach((item, index) => {
                    let label = item.InvestigationDesc || '-';
                    if (label.toLowerCase().startsWith('cc')) {
                        label = 'CC';
                    }

                    const OD_D = item.RightEyeValues?.Distance || '-';
                    const OD_N = item.RightEyeValues?.Near || '-';

                    const OS_D = item.LeftEyeValues?.Distance || '-';
                    const OS_N = item.LeftEyeValues?.Near || '-';

                    const OU_D = item.BothEyeValues?.Distance || '-';
                    const OU_N = item.BothEyeValues?.Near || '-';

                    visualAcuityText += `${label} → OD: ${OD_D} (D), ${OD_N} (N), OS: ${OS_D} (D), ${OS_N} (N), OU: ${OU_D} (D), ${OU_N} (N)`;

                    if (index < visionDetails.length - 1) {
                        visualAcuityText += " <br/> ";
                    }
                });

                $scope.PatientFillObj.VisionDetails = visualAcuityText;
            }

            if (assessmentsAndPlans && assessmentsAndPlans.length > 0) {
                let assessmentsText = "<br/><b>Assessment & Plans</b><br/>";

                assessmentsAndPlans.forEach((item, index) => {
                    let diagnosisName = item.DiagnosisName?.trim() || "-";
                    let icdCode = item.ICD10CODE || "-";
                    assessmentsText += `${index + 1}. ${diagnosisName} - ${icdCode}<br/>`;

                    const plan = item.AssessmentPlan;
                    if (plan) {
                        const planDetails = [
                            { label: "Plan of Discussion", value: plan.PlanofDiscussionsNotes },
                            { label: "Patient Instructions", value: plan.PatientInstructions },
                            { label: "Doctor Notes", value: plan.DoctorNotes },
                            { label: "Actions Taken", value: plan.ActionsTaken },
                            { label: "Assessments Notes", value: plan.AssessmentsNotes }
                        ];

                        planDetails.forEach(detail => {
                            if (detail.value) {
                                assessmentsText += `${detail.label}: ${detail.value}<br/>`;
                            }
                        });
                    }
                });

                $scope.PatientFillObj.AssessmentsAndPlans = assessmentsText;
            }

            if (posteriorSegmentDetailsArr && posteriorSegmentDetailsArr.length > 0) {
                $scope.PatientFillObj.PosteriorSegmentDetails = aspsText(posteriorSegmentDetailsArr,'Posterior');
            }
            if (anteriorSegmentDetailsArr && anteriorSegmentDetailsArr.length > 0) {
                $scope.PatientFillObj.AnteriorSegmentDetails = aspsText(anteriorSegmentDetailsArr,'Anterior');
            }

            function aspsText(segmentArr, segmentLabel) {
                if (!segmentArr || segmentArr.length === 0) return "";

                let examText = `<br/><b>Exam Data - ${segmentLabel} Segment</b><br/>`;

                segmentArr.forEach(item => {
                    const investigationName = item.InvestigationDesc?.trim() || "-";

                    if (item.InvestigationId === 6) {
                        const odValues = [
                            `MRD1: ${item.RMRD1 || "-"}`,
                            `MRD2: ${item.RMRD2 || "-"}`,
                            `MRDcNS: ${item.RMRDcNS || "-"}`,
                            `PFH: ${item.RPFH || "-"}`,
                            `LF: ${item.RLF || "-"}`
                        ];
                        const osValues = [
                            `MRD1: ${item.LMRD1 || "-"}`,
                            `MRD2: ${item.LMRD2 || "-"}`,
                            `MRDcNS: ${item.LMRDcNS || "-"}`,
                            `PFH: ${item.LPFH || "-"}`,
                            `LF: ${item.LLF || "-"}`
                        ];
                        examText += `<b>${investigationName}</b> - OD: ${odValues.join(", ")} &nbsp;&nbsp; OS: ${osValues.join(", ")}<br/>`;

                    } else if (item.InvestigationId === 32) {
                        const odValues = [
                            `Horizontal: ${item.RHorizontal || "-"}`,
                            `Vertical: ${item.RVertical || "-"}`,
                            `DPS: ${item.RDPS || "-"}`
                        ];
                        const osValues = [
                            `Horizontal: ${item.LHorizontal || "-"}`,
                            `Vertical: ${item.LVertical || "-"}`,
                            `DPS: ${item.LDPS || "-"}`
                        ];
                        examText += `<b>${investigationName}</b> - OD: ${odValues.join(", ")} &nbsp;&nbsp; OS: ${osValues.join(", ")}<br/>`;

                    } else {
                        const remarks = item.RemarksArray || [];

                        const odRemarks = remarks
                            .filter(r => r.OrganId === 1 && r.ActiveInd === "Y" && r.DeleteInd === "N")
                            .map(r => r.FindingValue?.trim())
                            .filter(Boolean);

                        const osRemarks = remarks
                            .filter(r => r.OrganId === 2 && r.ActiveInd === "Y" && r.DeleteInd === "N")
                            .map(r => r.FindingValue?.trim())
                            .filter(Boolean);

                        const odText = odRemarks.length > 0 ? odRemarks.join(", ") : "-";
                        const osText = osRemarks.length > 0 ? osRemarks.join(", ") : "-";

                        examText += `<b>${investigationName}</b> - OD: ${odText} &nbsp;&nbsp; OS: ${osText}<br/>`;
                    }
                });

                return examText;
            }
            if (patientParticularDetailsObj.ReferralName) {
                $scope.PatientFillObj.ReferralDoctorFullName = patientParticularDetailsObj?.ReferralName || "";
            }
            //    document.getElementById('htmlcontentconsent').innerText = document.getElementById('htmlcontentconsent').innerText.replace(/##PatientName##/g, $scope.PatientFillObj.PatientName);
            document.getElementById('htmlcontentconsent').innerHTML = document.getElementById('htmlcontentconsent').innerHTML.replace(/##PatientName##/g, $scope.PatientFillObj.PatientName);
            document.getElementById('htmlcontentconsent').innerHTML = document.getElementById('htmlcontentconsent').innerHTML.replace(/##PatientMobile##/g, $scope.PatientMobileNumber);
            document.getElementById('htmlcontentconsent').innerHTML = document.getElementById('htmlcontentconsent').innerHTML.replace(/##PatientGender##/g, $scope.PatientFillObj.PatientGender);
            document.getElementById('htmlcontentconsent').innerHTML = document.getElementById('htmlcontentconsent').innerHTML.replace(/##PatientAge##/g, $scope.PatientFillObj.PatientAge);
            document.getElementById('htmlcontentconsent').innerHTML = document.getElementById('htmlcontentconsent').innerHTML.replace(/##PatientMrNo##/g, $scope.PatientFillObj.PatientMrNo);
            document.getElementById('htmlcontentconsent').innerHTML = document.getElementById('htmlcontentconsent').innerHTML.replace(/##PatientFirstName##/g, $scope.PatientFillObj.PatientFirstName);
            document.getElementById('htmlcontentconsent').innerHTML = document.getElementById('htmlcontentconsent').innerHTML.replace(/##PatientLastName##/g, $scope.PatientFillObj.PatientLastName);
            document.getElementById('htmlcontentconsent').innerHTML = document.getElementById('htmlcontentconsent').innerHTML.replace(/##PatientSSN##/g, $scope.PatientFillObj.PatientSSN);
            document.getElementById('htmlcontentconsent').innerHTML = document.getElementById('htmlcontentconsent').innerHTML.replace(/##PatientEmail##/g, $scope.PatientFillObj.PatientEmail);
            document.getElementById('htmlcontentconsent').innerHTML = document.getElementById('htmlcontentconsent').innerHTML.replace(/##PatientDOB##/g, $scope.PatientFillObj.PatientDOB);
            document.getElementById('htmlcontentconsent').innerHTML = document.getElementById('htmlcontentconsent').innerHTML.replace(/##PatientBloodGroup##/g, $scope.PatientFillObj.PatientBloodGroup);
            document.getElementById('htmlcontentconsent').innerHTML = document.getElementById('htmlcontentconsent').innerHTML.replace(/##PatientPermanentAddress##/g, $scope.PatientFillObj.PatientPermanentAddress);
            document.getElementById('htmlcontentconsent').innerHTML = document.getElementById('htmlcontentconsent').innerHTML.replace(/##PatientPostalAddress##/g, $scope.PatientFillObj.PatientPostalAddress);
            var diagnosis = $scope.PatientFillObj.PatientVisitDiagnosis.replace(/\n/g, '<br>');
            document.getElementById('htmlcontentconsent').innerHTML = document.getElementById('htmlcontentconsent').innerHTML.replace(/##PatientVisitDiagnosis##/g, diagnosis);


            document.getElementById('htmlcontentconsent').innerHTML = document.getElementById('htmlcontentconsent').innerHTML.replace(/##HospitalName##/g, $scope.PatientFillObj.BranchName);
            document.getElementById('htmlcontentconsent').innerHTML = document.getElementById('htmlcontentconsent').innerHTML.replace(/##HospitalAddress##/g, $scope.PatientFillObj.OrganizationAddress);
            document.getElementById('htmlcontentconsent').innerHTML = document.getElementById('htmlcontentconsent').innerHTML.replace(/##HospitalContactNumber##/g, $scope.PatientFillObj.HospitalContactNumber);

            document.getElementById('htmlcontentconsent').innerHTML = document.getElementById('htmlcontentconsent').innerHTML.replace(/##DoctorName##/g, $scope.PatientFillObj.DoctorFullName);
            document.getElementById('htmlcontentconsent').innerHTML = document.getElementById('htmlcontentconsent').innerHTML.replace(/##DoctorMobile##/g, $scope.PatientFillObj.DoctorMobile);
            document.getElementById('htmlcontentconsent').innerHTML = document.getElementById('htmlcontentconsent').innerHTML.replace(/##DoctorSpecializationName##/g, $scope.PatientFillObj.DoctorSpecializationName);
            // document.getElementById('htmlcontentconsent').innerHTML = document.getElementById('htmlcontentconsent').innerHTML.replace(/##HospitalAddress##/g, $scope.PatientFillObj.HospitalAddress);

            document.getElementById('htmlcontentconsent').innerHTML = document.getElementById('htmlcontentconsent').innerHTML.replace(/##PolicyNumber##/g, $scope.PatientFillObj.PolicyId);
            document.getElementById('htmlcontentconsent').innerHTML = document.getElementById('htmlcontentconsent').innerHTML.replace(/##InsuredPersonName##/g, $scope.PatientFillObj.RelationName);
            document.getElementById('htmlcontentconsent').innerHTML = document.getElementById('htmlcontentconsent').innerHTML.replace(/##PatientDueAmount##/g, $scope.PatientFillObj.TotalPatientClaimBalance);
            document.getElementById('htmlcontentconsent').innerHTML = document.getElementById('htmlcontentconsent').innerHTML.replace(/##AppointmentDate##/g, $scope.PatientFillObj.VisitDate);
            document.getElementById('htmlcontentconsent').innerHTML = document.getElementById('htmlcontentconsent').innerHTML.replace(/##CurrentDate##/g, $scope.PatientFillObj.CurrentDate);
            document.getElementById('htmlcontentconsent').innerHTML = document.getElementById('htmlcontentconsent').innerHTML.replace(/##PrimaryInsuranceName##/g, $scope.PatientFillObj.primaryInsuranceName);
            document.getElementById('htmlcontentconsent').innerHTML = document.getElementById('htmlcontentconsent').innerHTML.replace(/##SecondaryInsuranceName##/g, $scope.PatientFillObj.secondaryInsuranceName);
            document.getElementById('htmlcontentconsent').innerHTML = document.getElementById('htmlcontentconsent').innerHTML.replace(/##PatientHomeNumber##/g, $scope.PatientFillObj.PatientHomeNumber);
            document.getElementById('htmlcontentconsent').innerHTML = document.getElementById('htmlcontentconsent').innerHTML.replace(/##IOPValue##/g, $scope.PatientFillObj.TonometryIOPDetails);
            document.getElementById('htmlcontentconsent').innerHTML = document.getElementById('htmlcontentconsent').innerHTML.replace(/##AssessmentPlans##/g, $scope.PatientFillObj.AssessmentsAndPlans);
            document.getElementById('htmlcontentconsent').innerHTML = document.getElementById('htmlcontentconsent').innerHTML.replace(/##VisualActivityData##/g, $scope.PatientFillObj.VisionDetails);
            document.getElementById('htmlcontentconsent').innerHTML = document.getElementById('htmlcontentconsent').innerHTML.replace(/##PatientPosteriorData##/g, $scope.PatientFillObj.PosteriorSegmentDetails);
            document.getElementById('htmlcontentconsent').innerHTML = document.getElementById('htmlcontentconsent').innerHTML.replace(/##PatientAnteriorData##/g, $scope.PatientFillObj.AnteriorSegmentDetails);

            if ($scope.PatientFillObj.PCPName || $scope.PatientFillObj.PCPAddress || $scope.PatientFillObj.ExternalComanagerName || $scope.PatientFillObj.CoManagerAddress || $scope.PatientFillObj.ReferralDoctorFullName || $scope.PatientFillObj.ReferralDoctorAddress) {
                document.getElementById('htmlcontentconsent').innerHTML = document.getElementById('htmlcontentconsent').innerHTML.replace(/##PCPName##/g, $scope.PatientFillObj.PCPName);
                document.getElementById('htmlcontentconsent').innerHTML = document.getElementById('htmlcontentconsent').innerHTML.replace(/##PCPAddress##/g, $scope.PatientFillObj.PCPAddress);
                document.getElementById('htmlcontentconsent').innerHTML = document.getElementById('htmlcontentconsent').innerHTML.replace(/##Co-ManagerName##/g, $scope.PatientFillObj.ExternalComanagerName);
                document.getElementById('htmlcontentconsent').innerHTML = document.getElementById('htmlcontentconsent').innerHTML.replace(/##Co-ManagerAddress##/g, $scope.PatientFillObj.CoManagerAddress);
                var ReferalProviderElement = document.querySelectorAll('[id^="NReferralProviderName"]');
                ReferalProviderElement.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##ReferralProviderName##/g, $scope.PatientFillObj.ReferralDoctorFullName);
                });

                var ReferalProviderAddressElement = document.querySelectorAll('[id^="NReferalProviderAddress"]');
                ReferalProviderAddressElement.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##ReferalProviderAddress##/g, $scope.PatientFillObj.ReferralDoctorAddress);
                });
            }
            /* document.getElementById('imgOrgLogo').src = "";*/

            /*     var nbase64c = "data:image/png;base64," + base64c;*/

            // var nbase64c = "data:image/png;base64,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";

            var SurgeryDateElement = document.querySelectorAll('[id^="NSurgeryDate"]');
            SurgeryDateElement.forEach(function (element) {
                element.innerHTML = element.innerHTML.replace(/##SurgeryDate##/g, $scope.PatientFillObj.SurgeryDate);
            });

            var SurgeryNameElement = document.querySelectorAll('[id^="NSurgeryName"]');
            SurgeryNameElement.forEach(function (element) {
                element.innerHTML = element.innerHTML.replace(/##SurgeryName##/g, $scope.PatientFillObj.SurgeryProcedureName + " (" + $scope.PatientFillObj.SurgeryProcedureCPTCode + " )");
            });

            var SurgeryStartTimeElement = document.querySelectorAll('[id^="NStartTimeOfSurgery"]');
            SurgeryStartTimeElement.forEach(function (element) {
                element.innerHTML = element.innerHTML.replace(/##StartTimeOfSurgery##/g, $scope.PatientFillObj.SurgeryStartTime);
            });
            var SurgeryEndTimeElement = document.querySelectorAll('[id^="NEndtimeOfSurgery"]');
            SurgeryEndTimeElement.forEach(function (element) {
                element.innerHTML = element.innerHTML.replace(/##EndtimeOfSurgery##/g, $scope.PatientFillObj.SurgeryEndTime);
            });

            var SurgeryAppointmentTimeElement = document.querySelectorAll('[id^="NSurgeryAppointmentTime"]');
            SurgeryAppointmentTimeElement.forEach(function (element) {
                element.innerHTML = element.innerHTML.replace(/##SurgeryAppointmentTime##/g, $scope.PatientFillObj.SurgeryAppointmentTime);
            });

            var SelectedEye = "";
            var Spanishsurgeryeye = "";
            if ($scope.PatientFillObj.SurgeryEye === "OD") {
                SelectedEye = "Right Eye";
                Spanishsurgeryeye = "Ojo derecho";
            } else if ($scope.PatientFillObj.SurgeryEye === "OS") {
                SelectedEye = "Left Eye";
                Spanishsurgeryeye = "Ojo izquirdo";
            } else if ($scope.PatientFillObj.SurgeryEye === "OU") {
                SelectedEye = "Both Eyes";
                Spanishsurgeryeye = "Ambos ojos";
            }

            var SurgeryEyeElement = document.querySelectorAll('[id^="NSurgeryEye"]');
            SurgeryEyeElement.forEach(function (element) {
                element.innerHTML = element.innerHTML.replace(/##SurgeryEye##/g, SelectedEye); //$scope.PatientFillObj.SurgeryEye
            });
            var SpanishsurgeryeyeElement = document.querySelectorAll('[id^="NSpanishsurgeryeye"]');
            SpanishsurgeryeyeElement.forEach(function (element) {
                element.innerHTML = element.innerHTML.replace(/##Spanishsurgeryeye##/g, Spanishsurgeryeye);
            });

            var SurgeryPreAdmissionDateelement = document.querySelectorAll('[id^="NPreAdmissionDate"]');
            SurgeryPreAdmissionDateelement.forEach(function (element) {
                element.innerHTML = element.innerHTML.replace(/##PreAdmissionDate##/g, $scope.PatientFillObj.PreAdmissionAppointmentDate);
            });

            var PreAdmissionTimeElement = document.querySelectorAll('[id^="NPreAdmissionTime"]');
            PreAdmissionTimeElement.forEach(function (element) {
                element.innerHTML = element.innerHTML.replace(/##PreAdmissionTime##/g, $scope.PatientFillObj.PreAdmissionTime);
            });

            var SurgeryDiagnosisElement = document.querySelectorAll('[id^="NSurgeryDiagnosis"]');
            SurgeryDiagnosisElement.forEach(function (element) {
                element.innerHTML = element.innerHTML.replace(/##SurgeryDiagnosis##/g, $scope.PatientFillObj.SurgeryDiagnosis);
            });

            if ($scope.PatientFillObj.SurgeryAnesthesiaType != '') {
                var SurgeryAnesthesiaTypeElement = document.querySelectorAll('[id^="NSurgeryAnesthesiaType"]');
                SurgeryAnesthesiaTypeElement.forEach(function (element) {
                    element.innerHTML = element.innerHTML.replace(/##SurgeryAnesthesiaType##/g, $scope.PatientFillObj.SurgeryAnesthesiaType);
                });
            }

            var AnesthesistNameElement = document.querySelectorAll('[id^="NAnesthesiologistName"]');
            AnesthesistNameElement.forEach(function (element) {
                element.innerHTML = element.innerHTML.replace(/##AnesthesiologistName##/g, $scope.PatientFillObj.AnesthetistName);
            });

            var SurgeryKlonopinelements = document.querySelectorAll('[id^="NPreOpKlonopinTime"]');
            SurgeryKlonopinelements.forEach(function (element) {
                element.innerHTML = element.innerHTML.replace(/##PreOpKlonopinTime##/g, $scope.PatientFillObj.SurgeryKlonopinTiming);
            });
        };
        $scope.FillPatientValues1 = function () {
            $scope.PatientFillObj = {
                "PatientName": $scope.PaitentDetails.FullName,
                "PatientMobile": $scope.PaitentDetails.MobileNo || "",
                "PatientGender": $scope.PaitentDetails.Gender || "",
                "PatientAge": $scope.PaitentDetails.Age || "",
                "PatientDOB": $scope.PaitentDetails.DOB || "",
                "PatientFirstName": $scope.PaitentDetails.FirstName || "",
                "PatientLastName": $scope.PaitentDetails.LastName || "",
                "PatientMrNo": $scope.PaitentDetails.PatientDisplayId || "",
                "PatientSSN": $scope.PaitentDetails.SSN || "",
                "PatientCity": "",
                "PatientState": "",
                "PatientAddress1": "",
                "PatientAddress2": "",
                "PatientZipCode": "",
                "PatientContactNumber": $scope.PaitentDetails.ContactNo || "",
                "PatientBloodGroup": $scope.PaitentDetails.BloodGroup,
                "PatientNationality": "",
                "PatientEmail": $scope.PaitentDetails.EmailId || "",
                "PatientMaritalStatus": "",
                "BranchName": doctorinfo.doctordata.UserAddress[0].ClinicName,
                "DoctorFullName": doctorinfo.doctordata.User[0].FullName,
                "DoctorMobile": doctorinfo.doctordata.User[0].MobileNo,
                "HospitalAddress": doctorinfo.doctordata.UserAddress[0].Address1 + " " + doctorinfo.doctordata.UserAddress[0].Address1

            };

            if ($scope.PatientFillObj.PatientDOB != '') {
                $scope.PatientDOB = $filter('date')($scope.PatientFillObj.PatientDOB, "MM-dd-yyyy");
            }

            if ($scope.PatientFillObj.PatientMobile != '') {
                var obj = eHnoteUserDataService.UsMobileFormatChange($scope.PatientFillObj.PatientMobile);
                $scope.PatientMobileNumber = obj.UsFormatMobileNumber;
            }

            if ($scope.PatientFillObj.DoctorMobile != '') {
                var obj = eHnoteUserDataService.UsMobileFormatChange($scope.PatientFillObj.DoctorMobile);
                $scope.DoctorMobileNumber = obj.UsFormatMobileNumber;
            }

            //    document.getElementById('htmlcontentconsent').innerText = document.getElementById('htmlcontentconsent').innerText.replace(/##PatientName##/g, $scope.PatientFillObj.PatientName);
            document.getElementById('htmlcontentconsent1').innerHTML = document.getElementById('htmlcontentconsent1').innerHTML.replace(/##PatientName##/g, $scope.PatientFillObj.PatientName);
            document.getElementById('htmlcontentconsent1').innerHTML = document.getElementById('htmlcontentconsent1').innerHTML.replace(/##PatientMobile##/g, $scope.PatientFillObj.PatientMobile);
            document.getElementById('htmlcontentconsent1').innerHTML = document.getElementById('htmlcontentconsent1').innerHTML.replace(/##PatientGender##/g, $scope.PatientFillObj.PatientGender);
            document.getElementById('htmlcontentconsent1').innerHTML = document.getElementById('htmlcontentconsent1').innerHTML.replace(/##PatientAge##/g, $scope.PatientFillObj.PatientAge);
            document.getElementById('htmlcontentconsent1').innerHTML = document.getElementById('htmlcontentconsent1').innerHTML.replace(/##PatientMrNo##/g, $scope.PatientFillObj.PatientMrNo);
            document.getElementById('htmlcontentconsent1').innerHTML = document.getElementById('htmlcontentconsent1').innerHTML.replace(/##PatientFirstName##/g, $scope.PatientFillObj.PatientFirstName);
            document.getElementById('htmlcontentconsent1').innerHTML = document.getElementById('htmlcontentconsent1').innerHTML.replace(/##PatientLastName##/g, $scope.PatientFillObj.PatientLastName);
            document.getElementById('htmlcontentconsent1').innerHTML = document.getElementById('htmlcontentconsent1').innerHTML.replace(/##PatientSSN##/g, $scope.PatientFillObj.PatientSSN);
            document.getElementById('htmlcontentconsent1').innerHTML = document.getElementById('htmlcontentconsent1').innerHTML.replace(/##PatientEmail##/g, $scope.PatientFillObj.PatientEmail);
            document.getElementById('htmlcontentconsent1').innerHTML = document.getElementById('htmlcontentconsent1').innerHTML.replace(/##PatientDOB##/g, $scope.PatientDOB);
            document.getElementById('htmlcontentconsent1').innerHTML = document.getElementById('htmlcontentconsent1').innerHTML.replace(/##PatientBloodGroup##/g, $scope.PatientFillObj.PatientBloodGroup);


            document.getElementById('htmlcontentconsent1').innerHTML = document.getElementById('htmlcontentconsent1').innerHTML.replace(/##HospitalName##/g, $scope.PatientFillObj.BranchName);

            document.getElementById('htmlcontentconsent1').innerHTML = document.getElementById('htmlcontentconsent1').innerHTML.replace(/##DoctorName##/g, $scope.PatientFillObj.DoctorFullName);
            document.getElementById('htmlcontentconsent1').innerHTML = document.getElementById('htmlcontentconsent1').innerHTML.replace(/##DoctorMobile##/g, $scope.DoctorMobileNumber);
            document.getElementById('htmlcontentconsent1').innerHTML = document.getElementById('htmlcontentconsent1').innerHTML.replace(/##HospitalAddress##/g, $scope.PatientFillObj.HospitalAddress);

            $scope.mainConsentObj.Notes = document.getElementById('htmlcontentconsent1').innerHTML;
            /* document.getElementById('imgOrgLogo').src = "";*/

            /*     var nbase64c = "data:image/png;base64," + base64c;*/

            // var nbase64c = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAjsAAAC/CAMAAAAvtu2OAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAMAUExURQAAAAAAAAEBAQICAgcGBwMDAwAAAAoNEAICAgICAiIfIAICAgAAAAAAAAUEBCIfIAAAAAEBAQAAAAAAAAYGBgAAAABrtwAAAAEBAQAAAAAAAAAAAAAAAAMCAgICAgAAAAQDAwAAAAAAAAAAAJmZmZmZmZmZmWuOrZmZmYGYrJmZmQBrtwAAAAAAAABrt7q8vpmZmZmZmpiZmbq8vq2vsQAAAABrt6Okpbq+wQBrtyMgIQBrt5qamwAAAAAAAJmZmbW9wiIfILq8vrq8vri+wgAAAABrtyIfIJiZmiIfILi6vABrt7i6vCMgIY6+2Lm7vQBrtyMhIrm7vRFKciQhIrW4uwBrtwBrt5aZmwRrtrq8vpqbmwBrtwAAAABrtyEgIpmZmQAAACMgIaTF2ABrty1JXJmZmQBrt5mZmbm7vW6v0iIfIABrtyIfICIfIC02OxxMbZeXmDNETyeNxSIfIABrt5mZmVOjz5mZmSMiIy0qKyIfIJmZmXFxcj2YyyRKZSqPxBOFwgpThyyLx1qbv6uusARDciJklEaItSpUcEBVYVdgZjNNX2iBkzl4qUtxizRpj0RgcSUyPoOWo////7q8vgBrswBrtwBwugBzvJmZmQB2vgB0vQBttwB7wQBuuQF3vwBstQBsswF1vjSDxSyAwwBstAByuwBttABqsgBrtC+BxABxuzKCxTeDxR1+wimAwxh9whR8wQFyvABpsABcmwBwuwB1twCBwQB7vABwtEOIyACEwwBZlwh8wUCGxwBeniJ+wgBlqwBWkwB+vwBgojmExQB4uiB+wgBytQ58wQBmrQBOhgBTjz6GxwBLgQBipgBQiwBHeiR/wwKHxjuFxiZ/wz2FxgBAdwBkqSSPyiuRyiCLxwA5cQBnrwB4vTGUy/L4/BqJxg+CwwBktiIfIFWf0b7b7gyLyg10vhmOy/n8/v3+/xOIxQ2Ixefy+QBfsny43dfq9bLW7Guv2QBEhABVpzyExVqm1Y/D40ec0ABLlaLN6Mni8j6XzjaPyvzSxL8AAACUdFJOUwA3EQgOFxQBAgWAIUJgJEA8CytlHlvycTJGS25pJ3ZSGy9WT9DBkARxCqHu4dAx4K9hQPoasGARKvdg+iaAk/FM0rzvPPQV9zPgnJaMU3J+522u6DJeu0F+3sxKJaPPjvm+SVRwwLiA3mySrqqf7JncVqjhyFCZs4d3FbvpIdHQ0fDv/qV89+PBxZNstI/RqsqpzsPby1LGAAAgAElEQVR42u2dCVzVZfb/v7KIiOJGuCuuQECoQCii4oK47/sOmrumablk27TMzG+a5fd6sci+NaAMM6XXqPxP1JRNhW1O02IZpoL9HC0Rzdz7n/Ns3+e73YtGjcj3pAL3Xi7EffM5n3PO8zxfRbHDDjvssMMOO+ywww477LDDDjvssMMOO+ywww477LDDDjvssMMOO+ywww477LDDjlsPL9dh/5AaQwQOjFs1YdyIeeEj500eWEdmmrkIG6E7PiLjJk8Lj0ghET5hYB2oEXR4Ows9QvZP+s5Sm1GTR4xM4RExLc7LBTZaZoKjI0cthZhEAt+LGxUZ7U5Cj5DNz50UAyePiEhRI3xypFNuVGqCIwcCLqtXr3700U1PnIAoF3HiiU2Pb4F7Ji3lEMkA2fzcCREcNy48RY55FpKj4yZ64NLVWx599EmKy7ffHj9C4vhx/Ivx7YkTB45iPLHp0S2rlw6UAJL4sV+AhhrRM6dFaMBJmTbKGhyOTeTSSYDNphPlJ4CYL774gjKDuGB8p4+/v3zgaDoQtGXS0oFt2mj4sfFpqBYnTg9OxLiBzgXH2xty1OpNICmUGsDmP4gMheTfEH83xL9pAEDFWU9smRTnIfix8WmoHmfCyBRdTBvoDBxIU3GTtmwCU/PFl19+idz85z8EG8oGI+Vlk1A5ejl9Z+bjq5du1+Bj09OwTM7MeSl1JoeCEzlpy6PfCm7+85///B+EhA3F5IAx9AgdzU3f9NQoDwM+9qvSINo4RslJGTHKGTijiOAckblRsZGgecUsjBQdzX7l8UljBD42PQ0lRuldDlblM52AM3DSluMnjn/xNYKj48YUm7e1oUeISNCB4rS3QXwIPkx8bHpu94gbYQAnJWJysCU5kUu3HDlx/Es9OIwbISnAxlFBy0svwR81zBDCz83O3hJn09NwyDHaHDA6kSbkUMlZCqnqWwkciRuZGgjEIz09vbiYE/MuDS1BGoCAnvzHZ7oBPiJ12fQ0KHLC46wkZ+AkMMdffP01Aef/DODkQBylkZmVlZVOyCku3QmRm52dm72fhYyQDBDhJx/o2c7psX3PbetzzMhJGRdtSg7Y49WQq75GyRHgCG4Qm5w8EpmFhVlZhenFjtJiR1kZkFNWBuwAPBD5u3YV7cLgDAmCVB/9Sknqo3FUe2zpuV3bOdPMyAkfZU5O9KQtaq7i4Eh6Q8DJJNxkUc1xYJSWIjlEeQg++flFBRAagIQACWu9+6Utj9j03LYRPSHCDJ0JwaY2J3rSo+VaySGKo+UmszCrkLOD+ABAjmKQn9KdQBCyQ8Unvyg1VcsP0x8pe71UsymuqRtzzTY8t1fMHOladITmRAI5R4TLURVHTVSZBJ3CQvxLUhZjCC2Po7gUExdRHgZPSSrFp2AX54enL8FP5f7VnkiPJD32q3ZbpCtTo5MyLdpEdEBzNp0Q5AjFyZEFJzOT/pvJCMpU9Ycmr+LSMpa4uPKkcnyKzPABgN6teXxAU564bHhukwg2T1cRq6zIYZWVkBxVcZAVJIejQ98WMoYKGTyYvEB6SoXryc4vKUlV+ZHwkeh5u3LQJCE9dt66PaqrcFPRCR9oQo730kfLNeQIj5OXd5SwkqeCIyIv8yilJ4vi48jKor6HZS4qPTI9BabiU3mQ5q02NG/Z8PzXRSfFZb4SFjluC89WSI5BcjgqeUJ68ihPMk3c9qSD7SGZi8CTT02Pnp5dcuH+0tsFNU8F6KTHfgX/e07HXHRSJpuIzkCoymltRciRwJG5wY/yWLbKk2kSWYzVXOnppVR6hPJIIWvPfpWe/Rd/42fDc1uE12RTp5MyMs7M6Dxx4ktKzr8lcjSKk5mXaZKw9HewkosmLtbqydXDk6oruzg9AE+ADc9t0NMZkeLS6nB04h498IVBc4zWRmVFpC3+IM1bMD7p6HxYwYXwaNKWSk8+z1wUn3cRHk9memx4bjOTnDIv0ig6q8n04QsiOio5ebSEkqEhtjiPx1GRxqQb6UNZyU4sszA9qQZ4ZNdM4+JvfMD0SPDYr+QvHqsiLFxysAGdpZvKv0RyjhNysLI6SiDIytJgw9QGIgdX83wNn3PkRDmBRdUc7oWwZCfNnuJSNW3ll6Q6S1wk9lN43Bg8tvD84hE4zpyclHGBMjqkjYyiA+nqyLeMHJyLE9uiy1YYJ764dO2b2rNnknkcq71+7cLXx8tpwZWXJ5JYIe8Ussk6rbZSU1MtExehZ//+gotP2fD8FyPSwupIBRYXnVFUdI4cZ9nqFSSn0EAOsHHi68vHki3i9Pkrx9WkpZbraHp4rY5dwhIzeNSSi0RlzRwbntuuNNeiQ7qBk56govOdIOcoedX1/vjElW84J2eOHTt99vp5jNqzp4+d5refvXCEoZMn0hYRH0epWJaRn5pqLj0CHnhbs28j9TzuNjy/uEseaYHOKkO+2kJFh6WrV9gyrqxCneRcus715ez5C1e+BptTWAbhAOPz5Y1Ll2uPsSR29twJoT1sSqG2CU0tj9717Mc3F/8wQ8Bj++VfMuIiXKGjmuQTWF4d/46TwxKNFp0T51iqOnP93Ncv51ZVpeWWOQqJs8ly5KZVVVXlHb90jXug819D/SVMTyGfrYu0VWQJT/4uFgWpF5/q6kNKdVt4ftGYWUd0IF+VH6FO5++ADq5Vp0tHkZ0sVo5nZh4/z8A5ff5GWk2aIy/HGFkAVPmFWpa9zt6QO4rMMvOlqJbKo9JTkLr74Ef9tfDYL+svgk5KHdAhTR2Rrwg5b7+dzufgkvAc58nqzPkjoC+ClvJyPT9lNWWXznLncwVU6Sibj7JyS4zVTdiRR1yIzr7dF//Q1pd1mG14/uvoTNZbnUcrIF8dOf4dJ4euntCwU35N1FEXqqpUbrQh1Kcm7xo3zrVHRJeQmh6Hg3WYs/OLipzBg+js23fw4u8pPNTy2FnrdkJnFFgdmq8AHbo9Bn0JRSeLtgVPihKq9smaQgmbCjXwfcCHApRWdUF8yuXyTGGaCTy8SZidb2J5VHoIO5UHL86d0dbHj/hlW3j+uzZ5nAYdb++lT3xL8hU4HSI6xXSHDCWHlugnakX3pnZvDSOHEbNXDUoQU5+smksCnuQrbI0GeB5QtGICj2XWYvBAADuVBw++cfH3PSTLYwvPz16cW6EzLVCLzqQK4pK/Y6LzElLjKObsgFBkZl5SG3/XT1UxzVGp2bMH/uwx4JMnw3O+nA1LSdoqJguZqV9OtYYndTey88YbF3/dimctW3h+gZagVV9nXrAOnfIvSGlO0QFyMEqL0x3E66C9zTuvonPsxxokh8nNHmMwfgg9eTWXpYHFEb4VJxPnomQwarIew5Sdwxd/3wHg4Vmr0QnPgmWz5ob4w39TFo1/MNhw9+jx48ffU39fLdqqmxweqUcHx5hgdYhJfgnZgVcVZYdvmDl+VkXnzIWqHCE5HJfnn39+D/7R4FNeAfDsLLwuzSousVEpmamTYktkLfNSPZXaHWTnD00wa0GtxexyIwIneMWUkMFpIvz9Z83WPeKeQWlp99bb1wu0mmGNHKhFZ3UOogNWB0QH18wU03XpDlZkgT25IY+qrudmcdER3GhD4ENsc82V09JnX2NbcuhUHZcS5lrVWoSeVNQdROejj178nVZ4Gg05gSv8JXAYPou0KnOPf32yM8GqxIrToVNOhuYkX+FqK7qPc2exw0FW+0GNdUEz5bxSRUVHcPPOO/CHBXwk00PgSbsmf35tOZ1vFRI3vrOsVM1aBab8CHau/rFJj7bcLjci4blnyiCkZXBIyKJZa9fOmusfQukZH/hzsWNZnU/QJayjGnQYOaWQsBxod8Ann9NMyM+n5QnNIeQwcP5BgwLE8SH0VN2QhSf5bPnRzDwyJ2NrmAGdXeZ1upadF3+d1IHY5cYlPMv8qc4sW8Bl6J7xhKZBc0f/POxY+uQRgXqvo1Gd3J25gE5ZqVpladE5c7KKiw7VHErNxxjwr5Geioo8x/VkrfLkieGEo7TMWZ0us/PW6y/+rkkHKjy01GoU6Iz3N8lQgfcS+xOyQGLHf1A9sRM4z4VPNlOdd9/dn51N4UF2KDqXtQtzrjsyKTqUnH9QcD5V42MGEIMHXU/VuTPJWuXJ4365uJjNtcxLLQoPYeett966+sfWTajwxDaapEXRMVIRvNZfC0/9xWSrjDVK2xI8cYSh8zZHJzeXpSzqlLWqk3zmXI0kOkxvPn1BxKcvEHo+/sc7nB6AJ/fI6WQdPNgjRN0pVuv0EmfsQMp66/Wrv04ijqep24Q2jSRpkYQ1ZYH1XaPrv7MT4XwUwdAZ9cRxc3RKSYcH4LmkXw94I42j8847VHEoNH/GEABRemji2ru3vOwb3dN8w1ahYgdSTCZcsvPq679rTUott3Ez3V0nrdgBY27tpxc7IPZnh2LMgMi62GRnfDyIdy6q718gy4w1L1BGJ/LxE1+rCWv//l0MnbKy4mJaoR/RryWt3VuokvMPpjh/1gbS8ylmLiY9e/dWXdY/z2W6HiM9i00m+FqMEkt23gK/8+bvWtAez8zwaNfs3J3R59Z+fP0y+v7s7PTJCKrD6zjFaV5C5Rm0rJ6/sVUW6EQM5LKD48/gR8u16Oxiboehk5VVcVr/ml/L3UvRIeR8yrn5i4g//4Xpz6dceoC1qpOGJ7rEdCfdwc8FsxQelZ2rf2yBwhPgOSZlguuk1fDZWQHllP9s6/vXgmH2r9+sFelijSmTnadyvtSjky0yFjHK1/Wv+JlzVRwdmq003Pzlr4wfSo+at3J/NLCTfCSTrSGUSq0SV+z8qSO45a5+nk0jImLvfHaCQ9LSBq918oDR+IDx9fp9We2nmeelKbEOkIVeDB1cpcdS1s6d1Otoe4I0bqQhO5CwPpbJ+asIhg9NXZ9i3kJ2TlXUGp7pbB5bWka2qZPVp1bCQ9l5Hdj59USWtOaljHOZtG6SnfnCgGycM587n/muPutWrVFd2Fk2yJWskEcE16dRdp6xGDpxFUe+PHJcUp18xg6kEAdxO08a0Tn7QhZXHZquNOAIgCg+JG+h8uzZo20t07hAc1ZxMZ5JaD3UUtl58cU3fxXDkta4FCI89cjOgIwBxl/83ne7stXD+v987MwFt+NcVQJBeGhbZ/SyZctkYxQ4e/yikJCQubOW6eGbvXYu3L72wUCzJ5zmqsZiPpksEhTogOxgmYXoUNlJN2pFcu3zpxCdjxk6gpznRKj0SMqzp+qcyR6u43z5KWenqKAg1RU7HUmLx/PpFBSe+mRnpQk7czLudonAz8fOaLDC/i4aOOMBr1nGWWjgihB/Nvga7D9Lfo4Fc9kdg0LGj66z7IQHS7LjvvoAXV9KW4KATlE+sztlZaXFKDyXjK/2mdq9e3nCIuhoyPmblh45bVVdOGN8tut0LIFVepnTKn23xE4nmrT6g4zGujA8N8fOMBN2+rpkp/fPyM6DgMMUF4+ZDSSEGGYSC+YO0sxNV3hp6npOlbGCG+d0BMqbgq98QZZ64SCCoFOA7NDmDp6MnJ5+6rSJVFw/tRcrLI3qEGxECHxU5QF20i6ZPdsVtmVCrMQoKnDKzqtvvv8/nTBp+QQMwLWPdzg7qClrXVXxyM5oHTuzCSAhUxbh4JRMvmYFqv2iQSFrV6yYhbpkKOEiLdqCIzQZa9O3rMSi6EC2ELKD8whgxyzLJH/j2PMOQ0clhzDzTwiVHhkeFJ60k2a7j89mZrE6C82y1cJlyg5a5VffPPQ/vToSwxOA/i262R3Nzix41V12b6YwBCR2CDr+46moBN87BQr5QWvpT2qROn6fvch/0Oy6TSM0Rhky1hd0rRczO8BOdjbv7hDZ2ZtswQ74ZKywKDqMnH+qwfCR4MGslWvKTvJJFB6ss8os9/kxdkjKUtnx88R1bZNvip3g2FjtkfVKdGxscL2zExw7JjbQSd0dOybSS89O9Bj9t8assv+DrtgBGgbfq2EHC/e0KfdoJ1+0hbggRC7pH5yiYycw3OnidpaxDhwRZof4ZJAdapXRKxOjfMGcnVPPM7MjoYPIfPLJJz/A308YPVR6VL9swU5tFl3/VVoqWssF5l5ZsNOddXiwcx4eWCd2+vWGSntjnwyI3kHqy9q/N9ywpE//4AG9MTIyVuKb5YhM7yCF3LYjYxh5G4u3yZAE9Z4TS+5ZQj+rN4cgCJ8UnjXItHCOnkPuHra8f7DKTuTWleRbmxNtISkuxUnLzizDGGP8IGa67x1MExynSmeWR1nITqSETvTjL9PFycLsFJSwKgtVB6uswrNW7Hz8sQGdT1ho6eHwYIPZPGclJ98gVysRwpNvXmjtO0jtDmGHmGW/AFJMxtWJHdCG4H4ZLHqzLk4g3LJk5Q64ZWVQhhQrWW9Qvi1jDN42RytIYzSPYI2hYerzGFVM6a/evWMHZ0e9cccAAzshN8/OPcbqzGsWc07L4C6vm+4LTpAz1qSjUj+ZoJNawq0yYac4/UqyJTufEp/M0aGa88lnLIAfmrme+5sotkB4LHQn+Ruy4L1U7fCUFDlh583332Ps+ASQ/89pdWVnORASqwSO6QvwBLM7h/WH9yKDVmbM1+cs0VeWcpaBHZOctRUkZeuYYCV6wENLMoxGCL74sDlwd/CYOag0lB0Ad0dQrFdgbNCOjCUbDTlr9k3nrLWQoFaYVfujie44ecZA83HEyGhJdgZuOqGaHYIOsJOfT1NWKV1+cd6SnU8/VWWHiQ4w8wGLzz77gWiPLDwvWLOTvBfPcqLdQZKzTA1P5cHDb72FKev9Q1ORnQ7ADllRGxFdN3Z6Z9zNcsh89pqNyVjChuyBQQPqiR3AoB/vTcdCctqobxZl3M2/38CgYfT7gO9nObsxunfGklgzLFz1DzVeGQsvY6d5PG0hLvC3WtDhJGWpsuMNRjmdbad56SU0O2QzQglFJxfnoABPxRkrdt4xoPPDJyo6nB4ZHnQ8luycJLpT5rxIr8Qyi9idX03t2YsW6U+T/6+ZdWNHsrx3k6wEr3M/6zrr1tiBJNZPdVNAwjDNKgu4+yFDnRW8kusgGp9hGcs1k06XbWV4Sf3ZoJ2zc08IaxZq13KE0KQ1i1RgFmOOyS7djvvAJ75lO7FExmKyA68gS1knky3Z4W6Heh2iOh9oQgMPs8uW7JwvLXVIR3abjrR2V77B7Y6enWl1Y2dlsPwSxpL08lB9s9NH/jKgPEu0X6JPRu9AAzv9iZeSlEkWHsgwaXNdLfABKPwDJXbgk0zECtVoLq/BBvuvNdWeEU6KLJqx3FcfxaMuNOioKQtzVnp61jVLdv7BG8pEduSE9RoEg0cWHufsQNIqLqWXZ8vOzS4y7fBwdsDuTG/ZkxTpnJ2RwXXzO9Iv6jCSS/pn7AiuX3Zi9Q6nb8Yw6UvE6nIYZWe5po0Qm6Fp+iwIcb3CYgUu/5L7ynDDIBNLE8Laz6zj7L/oQYNVDDZvDA60lB1a2RQUyVbZssri7NCURTLWD59xbFhQen6g8IhSy5qdH0td5qzdaJWJ3fl+A2PHNyBIs4S27uzAR/j6RA/L6BNbr+wEZSzRtnWABGkKH5QxLNDATiBo0wApdmj7SVBoDXbeHPQSD+HsgLPxv8fUFoXwSRfZ6+U/d3adZlkjtLJjyFgFqcgOX6nsyErfk+ySHeZ2PhPs/D8SFB5QHm3SsmbnErvMhPUqjN1QZpGU9f6h738r2HnaeDGDurHDGisboUS/e0w9snO31qxA7JA/RX83+TZiM/SxXC8qUwKdjrz8uTRJumNWSk3h7IC+LJvib9zfZbUpK06SncgnXqaHM73NjDJ5fUqKxFJlR1ZW1pNO2eFOGY0yovPaBwwcCR6StVS3bM3ONdLeYefHEb9TYMEOVFnfP6DLWXzScvPsKAOwTu6z0au+2OljcFB95CVky3UtavJtoH/uq4kgfWltqLc1NmauGHlxdpaBEJk0o/3lsarXg4uQnkFaI266FzScL1JG2Zn09reS7BQwdgryWc4Ct1OcnnXFCTvGlPWahA6Dh1geNWk5yVln6dovdh5GkYnfkezOe9vu0rEz0utW2VECSWO594B6Y6evgZ2HLD6Q2HEqK+MHO1+FsWKQuJ+zg8Os8aYLDBdpPDbSo01u05wV6Cg7bbYc/Y6csfMSY4f+nhfxicROws5Jl+wwp8wyliU7PGlZs3PsVGmZOkc36Q3u3ld5+CMqO+/9CtmhddYEjZW7FXZQe5aLHt1PZme5YfbVO2Or+kE/XVOA5yynuyVIWTQ32NkCDD6f4uwE+5st3FgGEOoEbIW/rpif59Qpg+zEvfLdv2XZoa8Ps8pkmOWwHGbp2BEpS4MOh4clredcsXP6lHpUN8hOkaXdwZS1od1dPdkijHG6zfW3xA785vfhVbJLdrY6Z6dvRm9d3bJE23PeYWQnOMNkAKv3M4MXBVrX52lTgrXskFH5bBNLbViss0i1QCTMBqHhsuysLoaMhUd7SeyU0HEWLbPSHU5KdMaO1u58YMrOD9zwuGAnuUK6OMmuImNjmaQs0tx57/tn293FZxLTUlya5bqwowT2YYLggp2HNDnHhJ2N2uYMaRnHaj4aY6zRe7taVY9jzEGLgi3RERlNsHMvfMZcHW24rHmuSXnvL3880lnKAtnxePyAUXbg5WJ2BzfXoO44YedjAztOdcc1O3s11yYpMdskwVPWh81bCnbm6Q+/u0V24EVdydiZ74ydrZpOzHKVHf5swcMMjkYWosAd2qRFvw0o7J1v8QucBS/74CkmVTfZFqqu0RDs4J6uQdolY2Q8+qDJnELDjvUuYio7S9PpqdvalKWWWaWlKDuF5+uoO5+5YOdvdWeHnrRcZCI7LGWB7Ezvwtmh63dcFFp1Y2cASybD1N6dxE4/FTHpVe6fYWQHJ6FyAuqv6xUGZZh8G9HDMpZrNCLSFB7jHGHBIi060hoMdEH+a6VnnR3CFzUvkzqCyNhcF+xEBGtS1t/ZiRdkwRd/gYTfwRLduAn9lnNWHdg5fWqnNJEwooMpi8kOpCxSouNidz9tRr5pdqIVvaAMUymQ2BFiEyzpxoAlEjsi6QSvzNihpqX5S3SrFgN7y3NyLwZdf80QLHK5cTFhIDm0YLC/dCJc4IOz6KrS2YoJO6T6GjSXP3z0eHVf8qxBU/i2iWBgcvAKF+yM0KSsowbZKVDZISc24Z6+k3X0yj9Y684Pda6zyM4+ugKjyOz8FC47731/fzveGvQb8BPZ6bd8Pn3JNi5hetObsTFGYgdSCoEsNpLoBh3GBwYtGdaPs9Mvo7cX+ywldkfGkjnUmkT3zchYqRvyR+6AZ2C6MqA3r+/uVtsEkVuHmS5EvZeuT/cPmTV+2b33rli7yJ/cMGjRaMWUHYXQ5j93/L2zH1w2ixwZxobns+Cz/Bfh7eOxuxwy2gU7E6SUNerAy+w4SmBHyE6J1N5x1IUdPkR3xo52ouWMHWZ28GpahpHEbuaUiexM79xOlOj9xeqSW2QnI2NYv61Bc/oIBQE2lgcFPbRypcRO7JKMlVuDtvbBZISLxXY8hI/IWDJAGCFwyH3mBPXtTRZ/xa7EZ50TtHX5EnWRmTSkwH5Sn75Bc+ApMpYwTAIfwoVifYOC+uLCxj6m7mfBLH/9kXFpg0KWeSkW7JD6Gx/jz97yQ57WDmLbbuhQS+uiTNiZKdudTLywEUtZBVLKEuMsPI07q/CKy76ydiRh1t/5Z91052wxNzv5+QWGrX2y7Hz+bBfVKqtN0FvMWVvZcr0lWwPVhYRkYaG8pxhUiTyI5KI5S9iSwDGSie7L1vwxuWEPyRg2x6SwDuZfNKP3fNV2bVwp1jRutByXz/LX7pqZskxXe2nP/bpnrkrbYP8V4kTke8W2LQBKV7RHWHR3WMpavfNlcuA/TVnSa1Qk2srknLgfXcyzWF/5B15oGWYSH/wgs+NsJvENv+a12TVJqOy8TousD5u3E1Y5YEQd2BnQn1ZO8/vLxTP/KHhj337L+wVJv+jzH1reb+sAL/xE4Vtity5f/lB/ln0i+98NH22EV2JMf2GLB/RdvrzvfP7qRMOz9unXd6NFPw/uXr6835wxmm/Ka8Ac+JyHgpzuTh5976wp/iEkIOsY6y79mXGz1/IHazaGglWiN8+9Vw/3SGurDLLj8XgmdTvIjpCdApWdsrJSkrOOu2TnOW1j+TVBzmt8CY9Axzk75wQ7JvU5ys5HVHY+/HxDF9Uqe46sAzt3XAQuuGf2PfeYr8owOW9wNDx6gYn8we0LTNgOt+oMkpQ15okDVHY07JTgamU+Ry8lZ6eUH6vrHP0HVqYjPa+p7NAl73WZo5/krR2TeQQ5AIO5nQ8/f6AL7yr7BgxIaYzsOF0E9pPPqpxnVWaRlBX3yoEDlB19yhLsFFOzfL0O63eeY4uV5QU8H7D1O7qFg87W79BrpQM7BfoKHTIW7QsSdDZ0bqfanadVXbWx4V3mwT+NHeOywWlSylpafMAoO6mQKwAduuaUjrPSCy8nO1+v/FdZeMSa09c+MKwbpCnL2bpBdt3QIsM4gpxvSossMDsoOyxldfXznJZShxq9UcVs/zpsBHQa48xLdMbOpFyJnVSVHVpnZdMTvzBpFV5KdrnW/Tlpm4R2vfInn3yiWzZovdb9uqjPNejsJuhUvoFu500mO114he7rF6DanXk2NnRqOth0veBNxGTzg1Oo3XF7Kh/Q0bNTwpcriwZPemHWnmTrPTYvvCDvk9DDAzb5B7L+QjR3nLJzgdfnRnb2SUYZZEdOWfMN2+wbfYxPSwv5aYc4xZkfE0fY8XB7KptdbESjOzjO4g2e0lJilgsLa6339mm2hf6T77L5DLGhm/vo1lB5Y6j1/qwfcwU6JQUiWRkzFsqOmrImmFwIrJHHXNfnrbiIgeatQbTKbTy2P17MZAfYkdFRt4WWlTkoO5ed7QtVsxZPW2RfKCCkbirWbki32lN8+lSuScJCdvbto7uyiJCFVLMAABswSURBVFH+1+f3d6aNQXrqV7jZZbobfZn1Ew8eDLZkB+zOI5s4O/v3F+iuNSSag2SQnlX4ZLL1WQZCeP7KjzJge9HpllAZHSY7luycz2ZmR4MOxr5KOWM91p7KDk1ZY0wurNK4Y8EU10eEuYxw03XunJ13TVNWqmyW6eG4VkkLz1D5WDp+h29Jp0dh/PMT/SEq/AAey7MMaEO5pECjOrvJJbMOqxnrmeZEdphT9nzasCiycZdY43FBxqCffN7pODPdoWWWmyU7tDeI7JQRr4zsXHBy/o4eHvkEHvUEFekIFSt2ju3kC9xF0tpN2akkxzXRruC/vnqWyA5xynhJAOkXZKSNDm6NwKl64E99nlVO2dlP0DGwAylLbSw7cLF7VubzydbnfpHDm/6snhgnHRmnOTROPXDQgp1zNGMBOSXahEUaysLsbGiPsiPmEQNS7DJL73X0m63qxSyvUsusRzZlv/02s8padujGUHIMBr1cX2Fm5nlzdvaSY0715w1yfp4zHjfo5LzB5L3U7BQVqF6ZokM7O9TsgFEWskMugTTB5GJgjTpmzVpRH9ezMZyhMlli5/FdVHYMOYvoTj6fpJOpRKapW649tZdevUY+clA6IVecc8rQoacNWrFzjbqdAlpmFaTuTmWqI5sdzFjU7dACPWD7yLpZ5Q4tIFr7mmzg8uygvttEUZq2dfoj9fER77Zt16VJM+tH+gY0bAanmfSV6TTLzfOpSpUdCR6cSYDj4efvIDuFWYWZtabsVNBT3dkJTuoBy/DfX/n5uOJ4ZXLKKTlf2eyM3OQnqVEWFTpPWJVv8JUXiA5mLCyyuOzMNKwSMI+wxIULF0aFxQ81vKIt43uy99qEhSpKryinP9EhQ9g7zYbGL1wYGtrG8pFD2zdsdmaaHIFB2ztNkZ2XTNgh8NDu4E6xdLAw02wBWO2eU3vY1Y8+NbskgETOn9XLkewxP5v7fD5Bh5Gze7cRHTQ7zyxuz1rKdBzRdEQd7U5YLyoGUfFN9OyExvcg73hFhQI7fi3qxk77UE8AqKcpOy384J8mbRs2O9ERxjk6YydgTuVLnB2d4cG2rlj+RS5tXVhYeN3sXHeHuHSW5lIk5FIS7GoA/GIkn/JT3feYXAQJ4h3CjhiCCnToyZTMJ3/1QHs6yepIiyzPMSZH1TtjR/Eaiq+5hp2odvSmIWGdQl3+RAU7Ye2cfLEed4JxGmFcv0PbO00D+qcydDQrThk7bCyBp7qnU3iOmBTVR8r27BHKw+iRr2QjrkMiq86evbkmzvscjiLUJV+MHPQ6aon1r6/ua49GWciOZ9NxKXXs7nB2FK+woXp2lKGJ3pCs4n1a3Aw7d93p7OiSVkSgys6qd/dbsFMgRlpleHpTFhWey2bzp70qPFx6JH7Uq6/xi68hOoV7jQf6nDmVz3KWXnX4CmVEZ0M3krFIfU4uYPNIhGFhmyt2lJ4ASLcmTReGDfHm7HgnDlXaxrdQkJ0m3TDpDI2C8OxJnFCTzvBP66jQxC5eEjtDwzzoO+6dE0OjwG97DvVcGBrWRfGJiopPjOqstIOv2BpuaY/+vAl5QshiPRNDw4Z4NAh2gkca1itzdub7FyE67+6XTsCg7JRI691L8Qgewo7x0mtnLlWJSz6Si4UaL9z3wgsyOfSKoblfGsusk0x1SnBoLmSn8g0NOtObM6PcEY0yXu1xQkpdK3SVnYD4pkpUy6hOrcOacHaUpqFDQoGQFswrtw/r2HphlI83BaXXQkXpHtqyawtULMGOW1hoNzd8p8uQAO+W8e6KD4DTtXVYe28fn7BOPk3RK3sktm7WFQWqZVinJkMTfdyVoaE9fVpHhbk1CHjGGYYS3O/4/aYG0TGwUwJJC9IWa/GUUccD7Bj3S5y5XCWuUvwOS1zSlWapy6HkIDrvsIvNpl05bWaUS+QZqEDnI4HO58/cT9BhGQvq86aPjKxrypLYaRPvo0SF+SqKt8hZitIjfqEi2HEHupRmkHgEO+7x6KCbxndQ2VGadUqMH4p+GT8Ibav4xLdGfQrlOQvYIVe4GALEhWJln9hC6RjaFNPmwoUNgp2BhgYPr7P85rxB0dGyg+eoYH+Oz9LVpJVpyFrXs/LUq6PTa4ayK1zjJYpf4Fcp1lzkusJwkWuIU3LCYssEVdV5n6Dz1QM0Y3XnGUsnO87Xfans+MW7KVHtNX4HsXFX2QkgtmdhT5WdjvEtMcK6Sexg0ygxlChIs4DQHqA7JIPFe6vsEH0CdtzjSZbrrCxsz74F7wbolqep/R2/oMr9BJ39u/I1hgfeZ3MJkrXIFR9xJUZhnt6nnN3jKK+QrnLN8UGAPmbxD/UC1wSd8jyjVf5Rh47W60jo8BqLGmWt7KyqIzst4TWO6qVnh9bWlJ1mKBPuoR1UdlqGtSfRWssOPAhgaJEYFhXP2VGATJWdgKFhiZjpMD02C+uohLEGQLxfg2AnTl9osb6yp998/33795uww9a7894yu1woZi19rXXmSlV5BcCzV4WH8iPFO/zq1iRfVVSUO8r1CF4g673QZzlB575u1OywjIXXRdfk45HBdWPHO2yIK3aUnmE9OyUKcwPsdI8y1FnMMQ9V2oWBUQ41ZccztIu30n4oPnHLXlFRzZTE7vR7iG8Yhke3W2Kgyo7vby5SdHbpCi2cRpYUFKlbi8kVrhGeG3rDU5NTTujZw7WH8YME0bfPPy+JTkV5eU7VpTNmXcEieQC6r7KSn/x/SIMOMTssY42JSKn7LIuz470w1MMlO17tQ4eike5GyvnOCxXP+AA9OzTrJA5RQnGmoWOnA2WHfD6yA2I3FCVnCP1ad4U1kDJ9lG4ayubongG+fWsINyA7enZIzuLCw87hIZZHt+z9bEUZwCO0h+GDBD3PsWHgENGBh+bk5X6jM01k77mEDh4MVymur0bReYyjg2aHZiyPESbXOXDBTrMWiaHY7kV2PMI6WLHTeSide/WI90X3uxD7hgCPd7vuKjsL2wE97cB3Iztt43u0ldnpBT9lxo571NCuoFt08OUW2g3eaR3fqUH2B6dxdpoG+MyYW4Pk5OtqdJ6zxNFxONVy0LSVqV3Jc+ZCTU4OoWevoEcFSHCD4FDRyclJe1JbZdXmQnWuOS+FrNch3eQ3JdVp34WuvKBmBzLWzJS69pQJO2GJiYlh8ay3guy4xbewYqdjWLe7WmNa6RYflRgGuoPTq8So0KgAlZ0WYaFRYaEtiKQsjAoLaymx0y00KtQD2AkIjRoatjA0SmkSNuSu1lhi+cJnJYb2bDD9wYGyto9UGzw+XZ+6SHTHiE4J2WojejxljlJWqGce1c6iavMcOUhPhSo9LJ4X7+3l5CA6ObqBxNmd6JLpIKtEReewOsNi6NCmIDc7nm6PhJtc/tQ6uvaA8OHTJx8gqFkP+pGbOhlvA5rk4aN4t0+MWpgYj5QE9Grh7UGMrWenTvjWU51otO1FijPFp1dXpYef4k3nV21RYXp0ClACgJU2HVu4u7X28mpHnnAo/azW7g2ouTxBe/AXZ8ev68bKSrI+2XChKpKzSoTjKXM4gB1wPFmFmZkaeM6cQ+HJIa6ngoqPhqC9DBxOTk7Vj6f16OAMq0QaRuwzRQdLLMnseIwzOd+jnmIISVl+8W3q6wnbLUR31DTUT2lwER2u8ZSiSPdt+5uL6EzNrhaDK8BK1KsVM8tDRuoaz3NsT1UOo4fgU0Fp2UP+cHAEOTmlWrdznSasopIiRg/OsESBJdCRSqwmPajZmW92+dN6ioVkVOVN+nj1EkM700la1wY41YrTVOlsbx+Y5bZzLlbCi0WnR3p2Sgro5mKEpxQrdbp2OStLux7jfJojJ0eHDyeIfITgMHJy8mo0fcHL2cgNae1QeJjqcJeMg4ivnqWqg+h0pOiA2dFmrIj6XePeOrRz6yZ3JQ6ttyfsEdqtdZPuiVENciQqC/woxg4ang5/uLgP6dmnpaeELB4skCzPzjK+hBBtz/FjmqyVmaNGOQGIQVROQ7235sZpwxCLbuWjurObrrmgh+ACOYDO/Rp0mE/2mJZS97bgzYdvt6ELh7aoxycMwCfs5dUg2QmWfk0neKmGp0fQxcMHD1Zy8dFWWgUF+mKLspOVmZknZZ7TF2oKczRRXm6AhqMjqc5psmIHlC2/JJ8fXqDLV//66hlzdFb9jBnLDutaa2SwZHg6/ObiwTcOAj6UHv0+LdCeXeKaNqxQR3YyM09qlCc3pw6RVXNFQudcLiWHbiKmS3f2iYtF4PpSsDobFuvQoT5Z2xUMj7Rf3581pG7IKjVpte3wu7cuvgFB6NHlLSI78oG5jnQHdcsYFeel9nJuVZ5LdNKqLqgJ6+yTKDj5+WnZLHAosY9eGoueCUc7guCSO7fTo6MzO6PsV/cXK9TnUXZo0mry+4uHD3N4VOlhB+aW8FqLrsZwsP3pJG9lfinmUmdqv65Jc05Pbs2J86rqXNiVTTQHnpmzUySJDrM6D5ACC1uCEjpNPbQNZXsP+s8fgSNkt0yTFlRaHVr/AeA5LEmP3CHk83SmPPQsJ5yqkziq7tE7c+1EVU2ZFTjpVVV551TRuZyOsBDJyeWnKXPRIYeYEtEBq8MGEVp02oxLSbnZPVnNb79oSA1CJVgMRUdIlVaPJpC1PvroI0JPpcH0pJaUSPDsJMuXsVSHv5mgPUeviL03p89fqaipScvK1OhPXmZWblVN4Y3Lx7jonD5XwU795+QgOrsrJZPMrY45Ok9rF5XUaQdkq9svvBuU8kQKmzCKJi3qllv//uLrH70l6JHgIdedTZXhKeNb1HnFlZV3Q5RcZ45dvvRlYW4VibQ09tZx5Mq52jOcnLOXjrJD/3MZOTtzkRx6zMWrjBzIV9gQZOjgIEJFR1diBdoZ5ZeFZwRJWlx4Wv/x6lsQhB4T6cFii1oTZMdByy3GDjE+FZdU43O69vy1y+dOXrny9Zc3rly5cPna+drTZ1TJ2VNcXMyvcsQju2QfX2/BnM7nX00n+coMHe0EdESw/ar+0vAw4WlKhafFn66+Tug5LOiRG8zoe3bRBINr30vJbIuCk07pOXri5DVpQRfCcuY0/iN1c765cCQdycErgpaRq0bQ4/+Ldh+UPLIQHeqSyaILgo4vRWd+hI3OfxmeeYEa4ekI8Lz+uqn0lBTgeTgl/JLp5PRTcoQlWYmani7UJ+/JC5evnzE9L6P22rkbp+CTQLHIaKO4TFxQtogbHT6D4KLDrQ5BpwdHJ06DzjQbnV8UHmaYZ2qFZ+KvER4UHyY92rxVlFpSJA6wROkppvyIqosjVPHkyQvnIFGdxThWC+nrwskbexA0YIZ8kgPfc9BroOcX7a4UVzvnHlmIDnPJLVp3IDMsTzc9OuNsr/PLRjQt1UdGaoQH4XnxRao9phVXQUHBLgEPOmZWrqfzsiudyhCLzMLCzMJMIk7p6eINvFOcTigC3QGfQzRHl65IeUVEB/MVsTo9ujJ0ZkbczGqvm4vNU01uXLfO9SfGDG9EfR7aJBzHS60An7aYtWIQHsSH0nOQao9GfIpYWQ1uBcstmR6uQBwji6BihXY5N41frVoiB9LVA7LoMKvT1YfMsLTFecTM+v2xxMzQl/XwNylJUXwC1Nu2myyi6Dq1MUnPKvLrG0eEB5vLJGt1ivnT1VdN6JHazCX5ZAEzkZ6daF0cTHSyZPWRQFKZkW8tJprDpp6UHFZd0XTFRAfqK2p1SIHl5qFd7BV+c6suJgIZM3Bd8cRWgEPAREXxjJkRoyjuMd6KdwwuHJzYVZkxcca2JCRm20RvJWZ9zESlVSvFZ2zzmDY+8AldJyrbhy+O8YT3YpJIY29GTJI3sAX3KZ4TJ27HW7bFeMDNMUkeitImZntMDK4hbBOzLakZf4hbjOfUGG+/bRO9Gig8o8JZ1kLhwazVFrJWp+5/uvrmi5b00OlofrZoE+Ju42IVkiwXksMfB+Rk55fsY7UVkiOMzmMsXTHRofmKumQ3j+2aVRcjbnL8uRgSy/CxzZTN62IS3JR11QFwi291KyWmeqIyMQHXeA2fqjRPGL4GP65eMzZmxlj4QFmzzuPh6rHDPWPGKsrU4fB5Y4fPUBZXD18/1ldptq56eMLYAAXvi0kYOzZhouJb/fDwxfg06xOSFL/qNcMTQLy2j12/OcEPH4K3zqgevm79Zvg62xq06Rnh7c2zFrE8nbr/79Wrr776qqDnsH5CWsJWoZL9orRcd8jak8UAseIIPDJITtE+vglCozkb7u/GezrcJGO+QqvT1MMjVrNTaPLN/tYCJ62qq5NmVM/wXr/NIyGhufv6qcrDa5TNCQ8rDxNTg+yM9VbWrFG2rff13q5MBSSAHUAAJIuxo6wHjUmq7qC4P7wZYGireGxeg/d5JkxVvBavb9OqOknxVJoPB67WN/Orbq7gGtPF67crHu5+1TFKs8Xr3eE7UKZWb1cWb264eWsy5K3JLGuRWgssT6fu//MmwiPo4eKjqg8rt6hlZs0eh0OkrCxjuhI5y1FaWpaLcytic1RyPpTI0YgOzVfU6syXd4CG38Lg/OE1a+DPOnjFmo/dtn7b+qnr2wAFE6tBeKpncHaAjsUPKx4PJzT3smaHvOoTq73XrUGXtB7vg48gJ1W38lpXvc6dPM2Maj8/+rwMzZgESFtwE9wBD6fP1mAD81acN8taDJ5e3af+6er7Ej28WyjhI+bq2GWmEy5Ojwk07A4HNpNx9rCPVVZgc2RypsvkcKej5iutSx4XfQv/u0nVCUmtqiGvKNtBdUB5FiuK13BQnc0JVAFUdhSvqaAjnB1Pws56lZ3mkPqUqQkkDcIHyE4ryIEKKoqSNHYdeZqk6u2cnTUP068PZqdVte8dwY4SPCElYpSatQCeFgDPXf/7/tU339SKz2G2OIzgQ7uEquuhvsdBmze8JHeIugrvIIKTXcT3P1DJsSBHLzqIziOy1QmPu6X/Wy90O8PH4gAS3c66akwnU8HdoOPxXbddYmfb1BnD14ELSorZDuy4VzdPgnw3ccZwuHfsulZJPglrkqauX6zMSFiXNDWhObLjPXzzxInDNzeb2HzGms3A04xWY9dQwWqO9mlxUoyv+1h4yNiHlTuDHcVrVPjIWAM8Paf++irQw/B5XeDzxkEhPyX5YgaOvR7eLST4kH+QIsJMMZ0+ZOOKQA6OLDlAzuePMXI6C3J0ojNfWukVMeFWW8lTwZzGEIM6A5JNW0w4ivtwb/I3ab2v8nCMMhUUovkaZeLwhM2+Sps1CcO3rwN12rZ+bJLX4oThqEgT14NN6rA5YWxzgLAVvN3WjOSzgDUJ64G/GXBLK/DK6xPWeSgBY6Gg3wxPMHVsArzrhw9xU7qCu05Cd/1ww67VvQInh0d6uxPLw+Hp1L1ny//91dX336T4vCiS10d8jQ8BSE1cZRwe2mzGgPeoItGFOeRiEMANVRyt5DwjkYNGR01XXHQ85As5jbgNz/xHdjTRvFE0C728IifEauBBw9zzrqnPHjpE6FGTF+Xno8NUgUgGS+VrM3bqgl9pOJWeZvEG40YLDklWDwwR2YoYHdINxPIKRQdNsscYqb4Kn3kb/gybrdncSNnxajYQs1YbNwFPi069et7VcttvD31/6P33tfjQWTsnCC00H7kXoQtigbus8JDJyoOQpQ5/RLgh4LyJ4HByvhLJSibHIDpPS0v0J9+Wk8/tm5MaJTsEnmas2JLg6a7SQ/h5lfHDBYghhAxRGTpYCf8dRFwgcOk8QgPUELmhgiODAy5nw32LebIykuPLyJFEJ2JCtGLH7Q8PyVst22377a++p/gI/REAvf66oIhiJAW58XUiNkgNYCO4YeBMv49LDqutBDmkGyicjhCdiHH2NprbEZ5mMjy+OBcFeIj0tOvywPT3vn/v0KFDGn4YQRqM5KD30EcKbig44HEYOKrkoENWyWnLyZHKq5ETbHJuW+Eh8BDD7AfwCOlBeu5H8UF8VAESCIkAUggtnBjCDFID2AhuSFm1QQVHJKuevVRymNFx83hknOpz7GzVAOBxA3hE3iLS07Jdu84PID7fv0cAogRxhqyCPOSQjpvPpz/2wGKeqrjk0GQlk8M8Mp9BzJtprw1sAPCw8YSPkB5OTxfAZ/qH33//4XsYh2SGTOIQg4Zgo3LDBUcDDk1WnBxfRk6b+cwjR0wb5eVlv0INBh7MW0R6OD13IT1dOt8P8gP8cIJUiniImwkz1N4gNmBwHuDcEI8jg9OJ9nN6yJozho0g5q2KtMlpcPAw6VHpofg0B342TP8QkPgXIATxnoEXAQ1S88z0DY89e/9ilRstOFRyKDm+gpxHxpHqKnzCQC+bnIYBDynVqelh0iPRI/Dp0rlz++YP3PfYhunTkQ8SQIp4H5EBpXlmOlBzH3E3AhvKDQeHuRxMVj1oVU7J2T4ZjU74uFGBXjY6DQkeSXqgWlfp4eID+FB+Ordv3/z++5+9DyDaABjxgA8ee+w+yFAqNAIbyo2qOAIc1s8h5Hisgrp83oRRgc1schpm3hKJS9CD4oP4qPwgQIgQRDc12stBHiFhQ7jh4JBcRSWHVOVITpuZ4SOnrYqFb8Mmp2HCQ6RHQ48QH5K8GD+UIIqQWXShIbDh3FCPQ8FRkxWSM2DyqjHe3jY5DTpvUdcj6GHig+oj88MIYgzpgt7TkmGjckMFRwWHJiuoytu4u8MXtsm5I6RHRw/iQ5IX4YcCxBCSMOK8CGiQGjTGghvicSg4VHJIsqLkNLPJuTOkR9Aj4SPkp1MvBKg7gnGXefSk0AA1DBvGDREcqjgEHJQcm5w7lh4UHxkf4AcAQoIAIcKQSfQi0AA1AhvKDQiODA6RHJucOwseQQ+4Zio+BB/KDwKEBCFChCFDdKTQIDUUG8oNy1R6cLjNscm58+gh4hPgB8mL8gMAcYIYRLqgdzRh1DBskBsUHBNwbHLuTHo4Pqg+RH58uyJAlCBEyDTwPkoNw0bixgansdBDxIfjQ/ghAAFBBCGEyBD0jq5IDVEbkqeAGyY4Mjg2OXcmPUZ8CD8UICAIEUKGDIG3U61BagAbrjc2OI2MHpa7JH4YQAQhSpEc5DZyN6WGYSNxY4PTyMSHeh/kBwFCghAhTpEc9OamlBqODXKjExwbnEakPkJ/ECCKEIVIF/QOD06NwMYGp/Hio/JDCWIMmUUbAY0GG5ubxomPzA8niDOkDX4fo0aDjc1No+WHAcQJkinSASNRY2NjhwCIE6SFSE+MRI2NjR1agmSGtKE+wqbGDhcQ6cP+2dhhhx122GGHHXbYYYcddthhhx122GGHHXbYYUcjif8PNOmKqY8q5AkAAAAASUVORK5CYII=";






        };

        $scope.isprioritychecked = function () {
            if ($scope.Priority) {
                $scope.Priority = true;
            } else {
                $scope.Priority = false;
            }

        }
        //
        $scope.DeleteAttachment = function (consultation) {

            $scope.AttachmentdDocumnets = $scope.AttachmentdDocumnets.filter(function (attachment) {
                return attachment.ConsultationId !== consultation.ConsultationId || attachment.fileName !== consultation.fileName;
            });
        }

        $scope.onMessageChange = function (messageType) {
            $scope.message = messageType;
            if ($scope.message === 3) {
                $scope.resetfilterOutboundFaxes();
            }
            else if ($scope.message === 2) {
                $scope.resetfilterInboundFaxes();
            } else if ($scope.message === 4) {

            } else if ($scope.message === 5) {
                $scope.GetOutgoingEmailDetails();
            } else if ($scope.message === 6) {
                $scope.resetfilterAssignedUserFaxes();
            }
            else {
                "create message tab";
                $scope.patientpushval = [];
                $scope.PatientsArray = [];
                $scope.PatientSearch.SearchText = "";
                $scope.ShowPatientListDrop = false;
            }
        };

        function getoutboundEmail() {
            return {
                "ExternalStatus": "",
                "FaxNumber": "",
                "FromDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "ToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "EmailId": null,
                "EmailTypeId": null,
            }
        }

        $scope.outboundEmail = getoutboundEmail();

        //faxoutboundfilter


        $scope.onSelectPatientName = function (selectedpatient) {

            if (selectedpatient) {
                // $scope.selectedDoctor = selectedDoctor.SecondUserFullName;
                $scope.outboundFaxDetails.PatientId = selectedpatient.PatientId;
                $scope.selectedPatientObj.PatientName = selectedpatient.FullName;
                $scope.patients = [];
            }
        };
        $scope.onSelectPatientName1 = function (selectedpatient) {

            if (selectedpatient) {
                // $scope.selectedDoctor = selectedDoctor.SecondUserFullName;
                $scope.inboundFaxDetails.PatientId = selectedpatient.PatientId;
                $scope.selectedPatientObj.PatientName = selectedpatient.FullName;
                $scope.patients = [];
            }
        };

        //// $scope.selectedDoctor = "";
        // $scope.onSelectUser = function (selectedDoctor) {
        //     
        //     if (selectedDoctor) {
        //        // $scope.selectedDoctor = selectedDoctor.SecondUserFullName;
        //         $scope.selectedDoctorDetails = selectedDoctor;
        //     }
        // };
        //// $scope.selectedClinic = "";
        //$scope.onSelectfacilityName = function (selectedClinic) {
        //    ;
        //    if (selectedClinic) {
        //        //$scope.selectedClinic = selectedClinic.SubSpecializationName;
        //        if (selectedClinic.ContactFax) {
        //            $scope.faxNumber = selectedClinic.ContactFax;
        //        }
        //        else {
        //            alertify.error("Please Enter Fax Number")
        //            $scope.faxNumber = null;
        //        }

        //    }
        //};
        $scope.combinedFaxList = [];

        $scope.onSelectfacilityName = function (selectedItem) {
            if (selectedItem) {
                const facility = $scope.OrganizationFacilityList.find(item => item.FacilityName === selectedItem.FacilityName);
                if (facility) {
                    // Create the combined fax list
                    $scope.combinedFaxList = [facility.FaxNumber, facility.ContactFax].filter(Boolean);

                    // Apply formatting to each number
                    $scope.combinedFaxList = $scope.combinedFaxList.map(faxNumber => {
                        const USnumberString = faxNumber || "";
                        if (USnumberString) {
                            const match = USnumberString.replace(/\D+/g, '').match(/([^\d]*\d[^\d]*){1,10}$/)[0];
                            const part1 = match.length > 3 ? `(${match.substring(0, 3)})` : match;
                            const part2 = match.length > 3 ? ` ${match.substring(3, 6)}` : '';
                            const part3 = match.length > 6 ? `-${match.substring(6, 10)}` : '';
                            return `${part1}${part2}${part3}`;
                        }
                        return "";
                    });

                    console.log("Formatted Combined Fax List:", $scope.combinedFaxList);

                    // Assign callerId if there's only one number in the list
                    if ($scope.combinedFaxList.length === 1) {
                        $scope.faxFromObject.FromFaxNumber = $scope.combinedFaxList[0];
                        $scope.changeFaxcallerIdValue($scope.faxFromObject.FromFaxNumber);
                    }
                }
            }
            console.log("Fax Number:", $scope.faxobj.callerId);
        };

        $scope.onSelectBranchName = function (selectedItem) {
            if (selectedItem) {
                const branchData = $scope.BranchList.find(item => item.ClinicId === selectedItem.ClinicId);
                if (branchData) {

                    var fitem = $scope.removeFormatting(branchData.FaxNumber);
                    $scope.USnumberString = fitem || "";
                    if ($scope.USnumberString != "") {
                        const match = fitem
                            .replace(/\D+/g, '')
                            .match(/([^\d]*\d[^\d]*){1,10}$/)[0]
                        const part1 = match.length > 3 ? `(${match.substring(0, 3)})` : match
                        const part2 = match.length > 3 ? ` ${match.substring(3, 6)}` : ''
                        const part3 = match.length > 6 ? `-${match.substring(6, 10)}` : ''
                        //  return `${part1}${part2}${part3}`;
                        $scope.faxFromObject.FromFaxNumber = part1 + part2 + part3;

                        if ($scope.USnumberString.length > 9) {
                            var Area = $scope.USnumberString.slice(0, 3);
                            $scope.faxobj.FaxAreacode = Area;
                            var contact = $scope.USnumberString.substring(3, ($scope.USnumberString.toString()).length);
                            $scope.faxobj.FaxHomeNumber = contact;
                        }
                    }
                    else {
                        $scope.faxFromObject.FromFaxNumber = "";
                    }
                    // Create the combined fax list

                    //$scope.combinedFaxList = [branchData.FaxNumber].filter(Boolean);

                    //// Apply formatting to each number
                    //$scope.combinedFaxList = $scope.combinedFaxList.map(faxNumber => {
                    //    const USnumberString = faxNumber || "";
                    //    if (USnumberString) {
                    //        const match = USnumberString.replace(/\D+/g, '').match(/([^\d]*\d[^\d]*){1,10}$/)[0];
                    //        const part1 = match.length > 3 ? `(${match.substring(0, 3)})` : match;
                    //        const part2 = match.length > 3 ? ` ${match.substring(3, 6)}` : '';
                    //        const part3 = match.length > 6 ? `-${match.substring(6, 10)}` : '';
                    //        return `${part1}${part2}${part3}`;
                    //    }
                    //    return "";
                    //});

                    //console.log("Formatted Combined Fax List:", $scope.combinedFaxList);

                    //// Assign callerId if there's only one number in the list
                    //if ($scope.combinedFaxList.length === 1) {
                    //    $scope.faxFromObject.FromFaxNumber = $scope.combinedFaxList[0];
                    //    $scope.changeFaxcallerIdValue($scope.faxFromObject.FromFaxNumber);
                    //} else {
                    //    $scope.faxFromObject.FromFaxNumber = "";
                    //}
                }
            }
            console.log("Fax Number:", $scope.faxobj.callerId);
        };

        $scope.changeBranchFaxnumber = function () {
            $scope.faxobj.callerId = null;
        }



        //$scope.changeFaxNumber = function (item) {
        //    item = item.toString()
        //    var obj = eHnoteUserDataService.UsMobileFormatChange(item);
        //    $scope.faxobj.callerId = obj.UsFormatMobileNumber;
        //};
        $scope.changeFaxcallerIdNumber = function (fitem) {

            $scope.USnumberString = fitem || "";
            if ($scope.USnumberString != "") {
                const match = fitem
                    .replace(/\D+/g, '')
                    .match(/([^\d]*\d[^\d]*){1,10}$/)[0]
                const part1 = match.length > 3 ? `(${match.substring(0, 3)})` : match
                const part2 = match.length > 3 ? ` ${match.substring(3, 6)}` : ''
                const part3 = match.length > 6 ? `-${match.substring(6, 10)}` : ''
                //  return `${part1}${part2}${part3}`;
                $scope.faxFromObject.FromFaxNumber = part1 + part2 + part3;

                if ($scope.USnumberString.length > 9) {
                    var Area = $scope.USnumberString.slice(0, 3);
                    $scope.faxobj.FaxAreacode = Area;
                    var contact = $scope.USnumberString.substring(3, ($scope.USnumberString.toString()).length);
                    $scope.faxobj.FaxHomeNumber = contact;
                }
            }
        }
        $scope.removeFormatting = function (faxNumber) {
            return faxNumber.replace(/\D+/g, ''); // Remove all non-digit characters
        };
        $scope.changeFaxcallerIdValue = function (fitem) {

            fitem = $scope.removeFormatting(fitem);
            $scope.USnumberString = fitem || "";
            if ($scope.USnumberString != "") {
                const match = fitem
                    .replace(/\D+/g, '')
                    .match(/([^\d]*\d[^\d]*){1,10}$/)[0]
                const part1 = match.length > 3 ? `(${match.substring(0, 3)})` : match
                const part2 = match.length > 3 ? ` ${match.substring(3, 6)}` : ''
                const part3 = match.length > 6 ? `-${match.substring(6, 10)}` : ''
                //  return `${part1}${part2}${part3}`;
                $scope.faxFromObject.FromFaxNumber = part1 + part2 + part3;

                if ($scope.USnumberString.length > 9) {
                    var Area = $scope.USnumberString.slice(0, 3);
                    $scope.faxobj.FaxAreacode = Area;
                    var contact = $scope.USnumberString.substring(3, ($scope.USnumberString.toString()).length);
                    $scope.faxobj.FaxHomeNumber = contact;
                }
            }
        }

        $scope.changeFaxfaxnumberNumber = function (fitem, Id) {

            $scope.USnumberString = fitem || "";
            if ($scope.USnumberString != "") {
                const match = fitem
                    .replace(/\D+/g, '')
                    .match(/([^\d]*\d[^\d]*){1,10}$/)[0]
                const part1 = match.length > 3 ? `(${match.substring(0, 3)})` : match
                const part2 = match.length > 3 ? ` ${match.substring(3, 6)}` : ''
                const part3 = match.length > 6 ? `-${match.substring(6, 10)}` : ''
                //  return `${part1}${part2}${part3}`;
                $scope.optionsArray[(Id - 1)].ToProderList[0].faxNumber = part1 + part2 + part3;

                if ($scope.USnumberString.length > 9) {
                    var Area = $scope.USnumberString.slice(0, 3);
                    $scope.faxobj.ToFaxAreacode = Area;
                    var contact = $scope.USnumberString.substring(3, ($scope.USnumberString.toString()).length);
                    $scope.faxobj.ToFaxHomeNumber = contact;
                }
            }
        }
        $scope.changeFaxreffaxNumberNumber = function (fitem) {

            $scope.USnumberString = fitem.FaxNumber || "";
            if ($scope.USnumberString != "") {
                const match = fitem.FaxNumber
                    .replace(/\D+/g, '')
                    .match(/([^\d]*\d[^\d]*){1,10}$/)[0]
                const part1 = match.length > 3 ? `(${match.substring(0, 3)})` : match
                const part2 = match.length > 3 ? ` ${match.substring(3, 6)}` : ''
                const part3 = match.length > 6 ? `-${match.substring(6, 10)}` : ''

                fitem.FaxNumber = part1 + part2 + part3;

                if ($scope.USnumberString.length > 9) {

                    var Area = $scope.USnumberString.slice(0, 3);
                    fitem.FaxAreaCode = Area;
                    var contact = $scope.USnumberString.substring(3, ($scope.USnumberString.toString()).length);
                    fitem.FaxHomeNumber = contact;
                }
            }
        }
        $scope.changeFaxreffaxNumberNumbersdata = function (fitem) {

            fitem.FaxNumber = $scope.removeFormatting(fitem.FaxNumber);
            $scope.USnumberString = fitem.FaxNumber || "";
            if ($scope.USnumberString != "") {
                const match = fitem.FaxNumber
                    .replace(/\D+/g, '')
                    .match(/([^\d]*\d[^\d]*){1,10}$/)[0]
                const part1 = match.length > 3 ? `(${match.substring(0, 3)})` : match
                const part2 = match.length > 3 ? ` ${match.substring(3, 6)}` : ''
                const part3 = match.length > 6 ? `-${match.substring(6, 10)}` : ''

                fitem.FaxNumber = part1 + part2 + part3;

                if ($scope.USnumberString.length > 9) {

                    var Area = $scope.USnumberString.slice(0, 3);
                    fitem.FaxAreaCode = Area;
                    var contact = $scope.USnumberString.substring(3, ($scope.USnumberString.toString()).length);
                    fitem.FaxHomeNumber = contact;
                }
            }
        }
        //// $scope.selectedProvider = "";
        $scope.onSelectToprovider = function (selectedProvider, option) {

            if (selectedProvider) {
                if (selectedProvider.Fax != "") {
                    var FaxNumber = eHnoteUserDataService.UsMobileFormatChange(selectedProvider.Fax);
                    if (option.TypeId == 2) {
                        $scope.optionsArray[(option.Id - 1)].ToProderList[0].faxNumber = FaxNumber.UsFormatMobileNumber;
                    }
                    else if (option.TypeId == 7) {
                        $scope.optionsArray[(option.Id - 1)].ToProderList[0].faxNumber = FaxNumber.UsFormatMobileNumber;
                    }
                    else if (option.TypeId == 1) {
                        $scope.optionsArray[(option.Id - 1)].ToProderList[0].faxNumber = FaxNumber.UsFormatMobileNumber;
                    }
                    else {

                    }

                }
                /*$scope.faxNumber = selectedProvider.Fax;*/
            }
        };

        // //$scope.selectedPCP = "";
        $scope.onSelectPCP = function (selectedPCP) {
            if (selectedPCP) {
                if (selectedPCP.Fax != "") {
                    var FaxNumber = eHnoteUserDataService.UsMobileFormatChange(selectedPCP.Fax);
                    $scope.reffaxNumber = FaxNumber.UsFormatMobileNumber;
                }
                // $scope.reffaxNumber = selectedPCP.Fax;
            }
        }
        // $scope.selectedReferal = "";
        $scope.onSelectRefferal = function (selectedReferal) {
            if (selectedReferal) {
                if (selectedReferal.Fax != "") {
                    var FaxNumber = eHnoteUserDataService.UsMobileFormatChange(selectedReferal.Fax);
                    $scope.reffaxNumber = FaxNumber.UsFormatMobileNumber;
                }
                //$scope.reffaxNumber = selectedReferal.Fax;
            }
        }

        //patient saerch
        $scope.PatientSearch = {
            "SearchText": ""
        };
        $scope.HeaderPatientSearchObj = {
            "IsShowSearchInd": true,
            "IsShowSearchRemoveInd": false,
            "Ismedicineorder": false
        };
        if ($scope.ScreenType == '') {
            $scope.HeaderPatientSearchObj.IsShowSearchRemoveInd = true;
        }
        $scope.patSearchType = 1;
        $scope.PatientsArray = [];
        $scope.HospitalArray = [];
        $scope.ShowPatientListDrop = false;
        $scope.clearPatientSearchData = function () {
            $scope.ShowPatientListDrop = false;
            $scope.PatientSearch.SearchText = "";
        };
        $scope.ChangePatientSearch = function (type) {
            $scope.ShowPatientListDrop = false;
            $scope.PatientSearch.SearchText = "";
            if (type === 1) {
                $scope.patSearchType = type
            } else if (type === 3) {
                $scope.patSearchType = type
            }
            else if (type === 2) {
                $scope.patSearchType = type
            }
            else {
                $scope.patSearchType = type
            }
        }
        $scope.ClickFaxPatientSearchIcon = function () {
            $scope.SearchByTextFaxHeader();
        };
        $scope.SearchByTextFaxHeader = function (type) {
            if ($scope.PatientSearch.SearchText != '') {
                $scope.PatientsArray = [];
                var name = $scope.PatientSearch.SearchText;
                if (name === undefined || name === '') {
                    type = 'click';
                }

                //if ($scope.patSearchType === 5) {
                //    name = name + " 00:00:00";
                //    var parsedDate = new Date(name);
                //    if (!isNaN(parsedDate.getTime())) {
                //        name = $filter('date')(parsedDate, "yyyy-MM-dd");
                //    } else {
                //        alertify.error("Invalid date format:", name);
                //        name = "";
                //        return false;
                //    }
                //}
                if (/^\d{8}$/.test(name)) {

                    var month = name.substring(0, 2);
                    var day = name.substring(2, 4);
                    var year = name.substring(4, 8);

                    var formattedDate = year + "-" + month + "-" + day;
                    var parsedDate = new Date(formattedDate);

                    if (!isNaN(parsedDate.getTime())) {
                        name = formattedDate;
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

                        param.StartDate = name;
                        param.hasparam = true;
                        param.SearchText = "";
                        param.PhoneNumber = "";
                    } else {
                        param = {
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
                        param.PhoneNumber = name;
                        param.hasparam = true;
                        param.SearchText = "";
                    }
                }



                if (name.includes("/") || name.includes("-")) {
                    // Replace '/' with '-' to maintain consistency
                    name = name.replace(/\//g, "-");
                    // Parse the date
                    var parsedDate = new Date(name + " 00:00:00");

                    if (!isNaN(parsedDate.getTime())) {
                        // If it's a valid date, format it correctly
                        name = $filter('date')(parsedDate, "yyyy-MM-dd");
                    } else {
                        // Handle invalid date input
                        if ($scope.patSearchType === 5) {
                            alertify.error("Invalid date format: " + name);
                            name = "";
                            return false;
                        }
                    }
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
                    $scope.HospitalArray = $scope.HospitalArray || [];
                    if ($scope.HospitalArray.length > 0) {
                        angular.forEach($scope.HospitalArray, function (items) {
                            if (items.isChecked) {
                                list.push(items.BranchId);
                            }
                        });
                    } else {
                        var data = localStorageFactory.getItem("allBranchesData") || [];
                        angular.forEach(data, function (item, index) {
                            item.HospitalInfo.HospitalDetails.isChecked = true;
                            $scope.HospitalArray.push(item.HospitalInfo.HospitalDetails);
                        });
                        angular.forEach($scope.HospitalArray, function (items) {
                            if (items.isChecked) {
                                list.push(items.BranchId);
                            }
                        });
                    }
                    param["HospitalIDLst"] = list;
                    var doctorinfoaccess = eHnoteMasterDataService.getUserInfo();
                    eHnoteMasterDataService.addPatientSearchInfo(param);
                    if (param.PhoneNumber !== "") {
                        var object = {
                            "UserId": eHnoteMasterDataService.getLoginId(),
                            "HospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                            "HospitalIDLst": param.HospitalIDLst.toString(),
                            "SearchText": param.PhoneNumber || '',
                            "SearchTypeID": $scope.patSearchType || 0,
                            "ParentOrganizationId": $scope.ParentHospitalId,
                        }
                        eHnotePatientDataService.SearchAllPatientDataNew(object, OnGetopSearchPatientSuccess, OnGetopPatientSearchError, $scope.sendhospcode);
                    } else {
                        var object = {
                            "UserId": eHnoteMasterDataService.getLoginId(),
                            "HospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                            "HospitalIDLst": param.HospitalIDLst.toString(),
                            "SearchText": param.SearchText || "",
                            "SearchTypeID": $scope.patSearchType || 0,
                            "ParentOrganizationId": $scope.ParentHospitalId,
                        }
                        eHnotePatientDataService.SearchAllPatientDataNew(object, OnGetopSearchPatientSuccess, OnGetopPatientSearchError, $scope.sendhospcode);
                    }
                }
            }
            else {
                $scope.PatientsArray = [];
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
                    /*   $scope.patientinitval.S3URL = item.S3URL || "";*/
                    $scope.patientinitval.S3URL = "";
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
                    //var obj = eHnoteUserDataService.UsMobileFormatChange(item.Altareacode + item.AltHomeNumber);
                    //$scope.patientinitval.MobileNo = obj.UsFormatMobileNumber;
                    var PhoneNumber = item.PhoneNumber || 0;
                    if (PhoneNumber.length > 0) {
                        var obj = eHnoteUserDataService.UsMobileFormatChange(PhoneNumber);
                        $scope.patientinitval.MobileNo = obj.UsFormatMobileNumber;
                    }
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

        $scope.SearchByText = function (text, type) {
            $scope.patients = [];
            if (type === 'Name') {
                $scope.selectedPatientObj.PatientName = text;
            }
            if ($scope.selectedPatientObj.PatientName.length >= 3) {
                var param = {
                    "PageSize": 30,
                    "UserId": eHnoteMasterDataService.getLoginId(),
                    "SearchText": $scope.selectedPatientObj.PatientName,
                    "PatientDisplayId": null,
                    "OldPatientMRNO": null,
                    "DOBSearch": null || "",
                    "PageNumber": 1,
                    "StartAge": 0,
                    "PhoneNumber": "",
                    "EndAge": 0,
                    "IncludeCommDetails": "Y",
                    "SearchDetails": {
                        "listdocpatients": "Y"
                    },
                    "SearchMobile": 0,
                    "ParentOrganizationId": $scope.ParentHospitalId
                };

                if ($scope.RoleId === 1) {
                    param.HospitalIDLst = [doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID];

                    param.DoctorID = eHnoteMasterDataService.getLoginId();
                    param.GetAllSpecializationInd = true;
                    param.GetAllPatientInd = true;


                    eHnotePatientDataService.SearchAllPatientNew(param, OnGetSearchPatientSuccess, OnGetPatientError);
                } else {

                    if ($scope.listval.length > 0) {
                        param.HospitalIDLst = $scope.listval;
                    } else {
                        $scope.listval.push(doctorinfo.doctordata.UserParentBranch[0].OrganizationId);
                    }
                    param.HospitalIDLst = $scope.listval;
                    param.DoctorID = eHnoteMasterDataService.getLoginId();
                    param.GetAllSpecializationInd = true;
                    param.GetAllPatientInd = true;


                    eHnotePatientDataService.SearchAllPatientNew(param, OnGetSearchPatientSuccess, OnGetPatientError);
                }
            }


        };
        function OnGetSearchPatientSuccess(data) {
            if (data.rows !== undefined) {

                $scope.patients = angular.copy(data.rows);
            }
        }
        function OnGetPatientError(err) {
            console.log(err);
        }
        $scope.selectedPatient = function (item) {

            console.log(item.PatientID)
            appoint_info.PatientID = item.PatientID;
            $scope.SelectedPatientId = appoint_info.PatientID;
            eHnoteAuditServices.getParticularPatientDetailsById($scope.SelectedPatientId, ongetPatientDetailsSuccess, ongetPatientDetailsError);
            function ongetPatientDetailsSuccess(response) {
                if (response.count > 0) {

                    var patientitem = response.rows[0];
                    patientParticularDetailsObj = angular.copy(patientitem);
                    $scope.PaitentDetails.FullName = patientitem.FullName;
                    $scope.PaitentDetails.Age = patientitem.Age;
                    $scope.PaitentDetails.Gender = patientitem.Gender;
                    $scope.PaitentDetails.VisitReason = patientitem.VisitReason;
                    $scope.PaitentDetails.faxNumber = patientitem.FaxNumber;
                    $scope.newSendEmailReqObj.ToEmail = patientitem.EmailID;
                    $scope.eObj.DoctorEmail = patientitem.EmailID;
                    $scope.SelectedObj.EmailID = patientitem.EmailID;
                    $scope.PaitentDetails.PatientDOB = patientitem.DOB;
                    $scope.PaitentDetails.DisplayID = patientitem.DisplayID;
                    $scope.PaitentDetails.S3URL = patientitem.S3URL;
                    $scope.PaitentDetails.PatientMobile = patientitem.PhoneNumber || '';
                    if ($scope.PaitentDetails.PatientMobile != "") {
                        var PatMobile = eHnoteUserDataService.UsMobileFormatChange($scope.PaitentDetails.PatientMobile);
                        $scope.PaitentDetails.PatientMobile = PatMobile.UsFormatMobileNumber;
                    }
                    if (patientitem.PermanentAddress.Address1 != '' || patientitem.PermanentAddress.Address2 != '' || patientitem.PermanentAddress.CityName != '' || patientitem.PermanentAddress.StateName != '' || patientitem.PermanentAddress.ZipCode != '') {
                        $scope.PaitentDetails.PatientAddress = patientitem.PermanentAddress.Address1 + "," + patientitem.PermanentAddress.Address2 + "," + '' + patientitem.PermanentAddress.CityName + "," + patientitem.PermanentAddress.StateName + "," + patientitem.PermanentAddress.ZipCode;
                    }
                    if (patientitem.FaxNumber != "") {
                        var FaxNumber = eHnoteUserDataService.UsMobileFormatChange(patientitem.FaxNumber);
                        $scope.optionsArray[1].ToProderList[0].faxNumber = FaxNumber.UsFormatMobileNumber;
                    }
                    $scope.optionsArray[1].ToProderList[0].PatientFullName = patientitem.FullName;
                    $scope.ShowPatientListDrop = false;
                    if ($scope.SelectedObj != undefined) {
                        $scope.SelectedObj.PatientID = item.PatientID;
                        $scope.SelectedObj.AppointmentId = 0;
                        $scope.SelectedObj.VisitId = 0;
                    }
                    patientParticularDetailsObj.ExternalComanagerName = '';
                    patientParticularDetailsObj.InternalComanagerName = '';
                    patientParticularDetailsObj.ExtrenalDetails = '';
                    patientParticularDetailsObj.PCPDoctorName = '';
                    $scope.SelectedPatObj = angular.copy(patientParticularDetailsObj);
                    $scope.SelectedPatObj.Email = patientitem.EmailID;
                    $scope.SelectedPatObj.MrNumber = patientitem.DisplayID;
                    $scope.SelectedPatObj.SSN = patientitem.SocialSecurityNo;
                    $scope.SelectedPatObj.MobileNumber = patientitem.PhoneNumber;
                    $scope.SelectedPatObj.PermanentAddress = [{
                        Address1: patientitem.PermanentAddress.Address1 || '',
                        Address2: patientitem.PermanentAddress.Address2 || '',
                        CityName: patientitem.PermanentAddress.CityName || '',
                        StateName: patientitem.PermanentAddress.StateName || '',
                        ZipCode: patientitem.PermanentAddress.ZipCode || ''
                    }];
                    $scope.SelectedPatObj.PostalAddress = [{
                        Address1: patientitem.PostalAddress.AddressLine1||'',
                        Address2: patientitem.PostalAddress.AddressLine2||'',
                        CityName: patientitem.PostalAddress.CityName||'',
                        StateName: patientitem.PostalAddress.StateName||'',
                        ZipCode: patientitem.PostalAddress.ZipCode||''
                    }];

                }
            }
            function ongetPatientDetailsError(error) {
                console.log(error);
            }
            $scope.HeaderPatientSearchObj.IsShowSearchRemoveInd = false;
            $scope.PatientSearch.SearchText = '';
            $scope.GetPatientVisitData($scope.SelectedPatientId);
            // $scope.GetPatientConsentFieldsData(item);
        }


        $scope.openAttachDocumentsPopup = function () {
            if ($scope.SelectedPatientId == null) {
                alertify.error("Please Select  Patient");
                return false;
            }
            else {
                $scope.faxDocumentAttachPopup = $uibModal.open({
                    "templateUrl": "templates/uibpopups/attachDocuments.html",
                    //"size": "lg",
                    "backdrop": "static",
                    "keyboard": false,
                    "windowClass": "modal__popup--1 bottom-to-top-modal",
                    "resolve": {
                        "ChartObj": function () {
                            // Return a copy of the attachment documents and include the PatientID
                            return {
                                attachments: angular.copy($scope.eObj.AttachmentsArray),
                                patientID: $scope.SelectedPatientId,
                                visitid: $scope.mainReferalObj.VisitId
                            };
                        }
                    },
                    "scope": $scope,
                    "controller": "UsFaxDocumentUploadAttachCtrl",
                });
                $scope.faxDocumentAttachPopup.result.then(function (data) {
                    console.log(data);
                    let AttachmentdDocumnets = data || [];
                    if (AttachmentdDocumnets.length > 0) {
                        $scope.eObj.AttachmentsArray = AttachmentdDocumnets || [];
                        $scope.AttachmentdDocumnets = AttachmentdDocumnets || [];
                        //angular.forEach(AttachmentdDocumnets, function (item) {
                        //    var existingIndex = $scope.eObj.AttachmentsArray.findIndex(function (attachment) {
                        //        return attachment.DocumentID === item.DocumentID;
                        //    });
                        //    if (item.isSelected === false) {
                        //        if (existingIndex !== -1) {
                        //            $scope.eObj.AttachmentsArray.splice(existingIndex, 1);
                        //        }
                        //    } else {
                        //        if (existingIndex !== -1) {
                        //            $scope.eObj.AttachmentsArray[existingIndex] = item;
                        //        } else {
                        //            $scope.eObj.AttachmentsArray.push(item);
                        //        }
                        //    }
                        //});
                    }
                }, function (cancel) {
                });
            }
        };

        $scope.changeTab = function (tabno) {
            console.log("Selected Tab:" + tabno);
            if (tabno == 2) {
                $scope.clinicDoctorList = $scope.clinicDoctorList || [];
                $scope.BranchList = $scope.BranchList || [];
                if ($scope.clinicDoctorList.length > 0) {
                    $scope.faxFromObject.selectedDoctor = $filter('filter')($scope.clinicDoctorList, { 'DoctorID': $scope.UserId }, true)[0];
                }
                if ($scope.BranchList.length > 0) {
                    $scope.faxFromObject.selectedClinic = $filter('filter')($scope.BranchList, { 'BranchId': $scope.HospitalId }, true)[0];
                    $scope.onSelectBranchName($scope.faxFromObject.selectedClinic);
                }
            }
            else if (tabno == 5) {
                if ($scope.ScreenType == 'Patient') {
                    $scope.SelectedObj.PatientId = $scope.SelectedObj.PatientId || 0;
                    $scope.GetPatientVisitData($scope.SelectedObj.PatientId);
                }
                $scope.ScreenType = '';

            }
            else {
                if (tabno == 1) {
                    $scope.eObj.EmailCategoryId = 2;
                    $scope.eObj.IsMailFromPatient = true;
                }
            }
        };
        $scope.openPatientSearch = function () {
            $scope.HeaderPatientSearchObj.IsShowSearchRemoveInd = true;
            $scope.mainConsentObj.HtmlContent = "";
            $scope.ClearAll();
            $scope.SelectedPatientId = null;
            if ($scope.FaxReceiversList.length > 0) {
                $scope.FaxReceiversList = [];
                $scope.emptyFaxObj = addNewFaxReceiverObj();
                $scope.FaxReceiversList.push($scope.emptyFaxObj);
                $scope.faxFromObject.selectedDoctor = '';
                $scope.faxFromObject.selectedClinic = '';
                $scope.faxFromObject.FromFaxNumber = '';
                $scope.faxFromObject.Subject = '';

            }
        };

        $scope.changeMailReceiverCategory = function () {
            $scope.eObj.IsMailFromPatient = false;
            if ($scope.eObj.EmailCategoryId == 2) {
                $scope.eObj.IsMailFromPatient = true;
            }
        }

        $scope.getUserDisplayInfo = function (users) {
            const uniqueUserIds = new Set();
            const uniqueUsers = users.filter(user => {
                if (uniqueUserIds.has(user.AssignedUserId)) return false;
                uniqueUserIds.add(user.AssignedUserId);
                return true;
            });

            const topUsers = uniqueUsers.slice(0, 3);
            const remainingUsers = uniqueUsers.slice(3);

            return {
                topUsers: topUsers,
                remainingCount: remainingUsers.length,
                remainingNames: remainingUsers.map(user => user.AssignedUserName).join(', ')
            };
        };
        $scope.init = function () {
            $scope.listval = [];

            if ($scope.ScreenType === "Patient") {
                if ($scope.SelectedPatientId != null) {
                    $scope.selectedPatientdata($scope.SelectedPatientId);
                }
            }


            $scope.checkval = doctorinfo.doctordata.UserParentBranch;
            angular.forEach($scope.checkval, function (item) {
                $scope.listval.push(item.OrganizationId);
            });
            var NewBranchList = localStorageFactory.getItem("allBranchesData") || [];
            InitializeBranches(NewBranchList);
            $scope.PatientAppointmentConsentForms = [];
            var obj = {
                "ParentOrganizationId": $scope.ParentHospitalId,
                "Type": 1,
                "ConsentTypeId": 0,
                "SearchText": "",
                "PageSize": 50,
                "PageNumber": 1
            };

            var Requestype = "ASC";
            if ($scope.SelectedObj.AppointmentTypeId === 7) {
                Requestype = "PreOp";
            }
            else if ($scope.SelectedObj.AppointmentTypeId === 4 || $scope.SelectedObj.AppointmentTypeId === 14) {
                Requestype = "ASC";
            } else {
                Requestype = "OutPatient";
            }
            var params = {
                "PatientId": $scope.SelectedObj.PatientId,
                "AppointmentId": $scope.SelectedObj.AppointmentId,
                "OrganizationId": $scope.HospitalId,
                "Requestype": Requestype,
                "VisitId": $scope.SelectedObj.VisitId,
            };
            $q.all([
                //eHnoteMainAppointmentService.getAdditionalApptDetailsById(0),//$scope.SelectedObj.AppointmentId
                eHnoteSettingsDataService.GetPatientAppointmentConsentFieldsData(params),
                eHnoteSettingsDataService.GetConsentsByOrganizationAndType(obj),
                eHnoteSettingsDataService.GetMasterEmailTypeData(),
            ]).then(function (resp) {
                //if (resp[0].data.length !== 0) {
                //    $scope.SelectedApptObj = resp[0].data[0];
                //}

                if (resp[0].data.status == "Success") {
                    $scope.AssessmentPlan = [];
                    $scope.BillingList = [];
                    if (resp[0].data.AppointmentDetails != undefined) {
                        $scope.SelectedApptObj = resp[0].data.AppointmentDetails;
                    }
                    if (resp[0].data.PatientDetails != undefined) {
                        $scope.SelectedPatObj = angular.copy(resp[0].data.PatientDetails);
                        pcpAddress = resp[0].data.PatientDetails.PCP || [];
                    }
                    if (resp[0].data.AssessmentPlan.length > 0) {
                        $scope.AssessmentPlan = resp[0].data.AssessmentPlan || [];
                        assessmentsAndPlans = angular.copy(resp[0].data.AssessmentPlan) || [];
                    }
                    if (resp[0].data.OrganizationDetails != undefined) {
                        $scope.SelectedOrgObj = resp[0].data.OrganizationDetails;
                    }
                    if (resp[0].data.Billing.length > 0) {
                        $scope.BillingList = resp[0].data.Billing || [];
                    }
                    resp[0].data.Visitdate = resp[0].data.Visitdate || '';
                    if (resp[0].data.Visitdate !== '') {
                        $scope.VisitDate = resp[0].data.Visitdate || '';
                    }
                    resp[0].data.TotalPatientClaimBalance = resp[0].data.TotalPatientClaimBalance || 0;
                    if (resp[0].data.TotalPatientClaimBalance !== 0) {
                        $scope.TotalPatientClaimBalance = resp[0].data.TotalPatientClaimBalance || 0;
                    }
                    if (resp[0].data.Tonometry.length > 0) {
                        tonometryDetails = resp[0].data.Tonometry || [];
                    }
                    if (resp[0].data.VisionDetails.length > 0) {
                        visionDetails = resp[0].data.VisionDetails || [];
                    }
                    if (resp[0].data.AnteriorSegmentDetails.length > 0) {
                        anteriorSegmentDetailsArr = resp[0].data.AnteriorSegmentDetails || [];
                    }
                    if (resp[0].data.PosteriorSegmentDetails.length > 0) {
                        posteriorSegmentDetailsArr = resp[0].data.PosteriorSegmentDetails || [];
                    }
                    if (resp[0].data.ReferalDetails) {
                        refferalProviderAdress = resp[0].data.ReferalDetails || {};
                    }
                    if (resp[0].data.ASCDetails != undefined) {
                        $scope.PatientASCApptdetails = resp[0].data.ASCDetails;
                    }

                    $scope.ReferralDoctorFirstName = resp[0].data.ReferalDetails.ReferralDoctorFirstName || "";
                    $scope.ReferralDoctorLastName = resp[0].data.ReferalDetails.ReferralDoctorLastName || "";
                    $scope.ReferralDoctorFullName = $scope.ReferralDoctorFirstName + " " + $scope.ReferralDoctorLastName;
                    $scope.ReferralDoctorNPI = resp[0].data.ReferalDetails.ReferralDoctorNPI;

                    if (resp[0].data.ReferalDetails.length > 0) {
                        $scope.ReferralDoctorAddress = resp[0].data.ReferalDetails.Address1 + " " + resp[0].data.ReferalDetails.Address2 + "," + '<br>' + resp[0].data.ReferalDetails.CityName + "," + resp[0].data.ReferalDetails.StateName + "," + resp[0].data.ReferalDetails.ZipCode;
                    } else {
                        $scope.ReferralDoctorAddress = "";
                    }
                }

                if (resp[1].data.rows.length !== 0) {
                    $scope.PatientAppointmentConsentForms = resp[1].data.rows || [];
                    $scope.PatientAppointmentLetters = resp[1].data.LetterArray || [];

                }

                $scope.GetMasterEmailTypeDataArray = [];
                if (resp[2].data.status == "Success") {
                    $scope.GetMasterEmailTypeDataArray = resp[2].data.rows || [];
                }
            });
            $scope.GetMasterFaxStatus();
        }
        $scope.init();

        $scope.GetConsentsByOrganizationAndType = function (text) {
            $scope.SelectedPatientId = $scope.SelectedPatientId || 0;
            if ($scope.SelectedPatientId == 0) {
                alertify.error("Please select a patient");
                return false;
            }
            var obj = {
                "ParentOrganizationId": $scope.ParentHospitalId,
                "Type": 1,
                "ConsentTypeId": 0,
                "SearchText": text,
                "PageSize": 50,
                "PageNumber": 1
            };

            return eHnoteSettingsDataService.GetConsentsByOrganizationAndType(obj).then(function (resp) {
                if (resp.data.rows !== undefined) {
                    return resp.data.rows.map(function (item) {
                        return item;
                    });

                }
            });
        };
        $scope.mainReferalObj = {
            "Mode": '0',
            "VisitId": 0
        };

        $scope.manualReferralObj = {
            "ReferalEmailId": "",
            "ReferalDoctorName": "",
            "ReferalOrganizationName": "",
            "ReferalNote": null,
            "EmailSubject": "",
            "EmailBody": ""
        }

        $scope.SaveManualReferalAppointment = function () {

            var params = {
                "UserId": $scope.UserId,
                "AppointmentId": appoint_info.AppointmentId,
                "PatientId": appoint_info.PatientID,
                "ConsultationId": appoint_info.ConsultationId,
                "AppointmentReferalId": 0,
                "ReferalTypeId": 1,
                "ReferalType": "Manual",
                "ReferalEmailId": $scope.manualReferralObj.ReferalEmailId,
                "ReferalDoctorName": $scope.manualReferralObj.ReferalDoctorName,
                "ReferalOrganizationName": $scope.manualReferralObj.ReferalOrganizationName,
                "ReferalNote": $scope.manualReferralObj.ReferalNote,
                "ReferalEmailSubject": $scope.manualReferralObj.EmailSubject,
                "ReferalEmailBody": $scope.manualReferralObj.EmailBody,

            }
            eHnoteMainAppointmentService.AddUpdateAppointmentReminderDetails(params).then(function (resp) {

                console.log(resp);

                if (resp.data.status == "success") {

                    var ConsultationId = appoint_info.ConsultationId;
                    var type = 0;
                    if (ConsultationId === 0) {
                        type = 1;
                    }
                    var object = {
                        "AppointmentId": appoint_info.AppointmentId || 0,
                        "Type": type,
                        "VisitId": appoint_info.ConsultationId || 0

                    };

                    eHnotePatientDataService.GetPatientConsultationDetailsByApptId(object).then(function (resp) {


                        $scope.manualReferralObj.ReferalEmailId = "";
                        $scope.manualReferralObj.ReferalDoctorName = "";
                        $scope.manualReferralObj.ReferalOrganizationName = "";
                        $scope.manualReferralObj.ReferalNote = "";
                        $scope.manualReferralObj.EmailBody = "";

                        if (resp.data !== undefined) {
                            $scope.treatmentData = resp.data;
                            $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
                            var IsNKISelected = $scope.cacheStorageItem.isNKISelected;

                            var TempConsultationPlan = angular.copy($scope.treatmentData[0]);

                            var count1 = 0;
                            var pachyODAvgValue = 0;
                            var pachyOSAvgValue = 0;
                            angular.forEach(TempConsultationPlan.Pachymetry, function (pitem) {
                                pachyODAvgValue += parseInt(pitem.RightEye) || 0;
                                pachyOSAvgValue += parseInt(pitem.LeftEye) || 0;
                                count1++;
                            });
                            TempConsultationPlan.PachymetryAvgODValue = parseFloat(pachyODAvgValue / count1).toFixed(2) || 0;
                            TempConsultationPlan.PachymetryAvgOSValue = parseFloat(pachyOSAvgValue / count1).toFixed(2) || 0;

                            var BranchMobile = eHnoteUserDataService.UsMobileFormatChange(TempConsultationPlan.BranchMobile);
                            TempConsultationPlan.BranchMobile = BranchMobile.UsFormatMobileNumber;

                            var PhoneNumber = eHnoteUserDataService.UsMobileFormatChange(TempConsultationPlan.PatientArray[0].PhoneNumber);
                            TempConsultationPlan.PatientArray[0].PhoneNumber = PhoneNumber.UsFormatMobileNumber;
                            TempConsultationPlan.PatientArray[0].DOB = TempConsultationPlan.PatientArray[0].DOB || "";

                            var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
                            if (TempConsultationPlan != "") {
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
                                    "BranchPhoneNo": TempConsultationPlan.BranchMobile || "",
                                    "BranchArea": TempConsultationPlan.BranchArea || "",
                                    "BVPossibleDiagnosis": TempConsultationPlan.BVPossibleDiagnosis || "",
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
                                    "PatientPhoneNumber": TempConsultationPlan.PatientArray[0].PhoneNumber || "",
                                    "PatientDOB": TempConsultationPlan.PatientArray[0].DOB || "",
                                    "PachymetryAvgODValue": TempConsultationPlan.PachymetryAvgODValue || "",
                                    "PachymetryAvgOSValue": TempConsultationPlan.PachymetryAvgOSValue || "",
                                    "ChiefComplaints": [],
                                    "ImplantList": [],
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
                                    "NearInvestigationdetails": TempConsultationPlan.NearInvestigationdetails || [],
                                    "LacrimalPatencyRemarks": TempConsultationPlan.LacrimalPatencyRemarks || "",
                                    "PupilSizeRemarks": TempConsultationPlan.PupilSizeRemarks || "",
                                    "PachymetryRemarks": TempConsultationPlan.PachymetryRemarks || "",
                                    "DilationArray": TempConsultationPlan.DilationArray || [],
                                    "LabInvestigations": TempConsultationPlan.LabInvestigations || [],
                                    "PhysicalEvaluation": TempConsultationPlan.CustomAllergyRemarks || [],
                                    "PsychiatryData": TempConsultationPlan.PsychiatryData || [],
                                    "ROSOverAllRemarks": TempConsultationPlan.ROSOverAllRemarks,
                                    "OPProcedures": TempConsultationPlan.OPProceduresArray || [],
                                    "CurrentSystemicHistory": TempConsultationPlan.CurrentSystemicMedicationsHistory || [],
                                    "ROSAllergyHeaders": $scope.cacheStorageItem.ROSAllergyHeaders || [],
                                    "IsNKISelected": IsNKISelected || "",
                                    "PsychologicalObservations": $scope.ScoreObject,
                                    "labinvestigationNotes": TempConsultationPlan.labinvestigationNotes || "",
                                    "OverallProcedureNotes": TempConsultationPlan.OverallProcedureNotes || "",

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
                                            "PatientName": TempConsultationPlan.PatientArray[0].FullName || "",
                                        }
                                        req.ChiefComplaints.push(checifobj);
                                    })
                                }
                                TempConsultationPlan.ImplantList = TempConsultationPlan.ImplantList || [];
                                if (TempConsultationPlan.ImplantList.length > 0) {
                                    angular.forEach(TempConsultationPlan.ImplantList, function (ImpItem) {
                                        var Impobj = {
                                            "DeviceDescription": ImpItem.DeviceDescription || 0,
                                            "Location": ImpItem.Location || "",
                                            "UDI": ImpItem.UDI || ""
                                        }
                                        req.ImplantList.push(Impobj);
                                    })
                                }
                            }

                            eHnoteDiagnosisDataServices.GetDemoViewConsultationPdf(req).then(function (resp) {



                                if (resp.data.Message == 'Success') {
                                    $scope.DemoConsultationPdfUrl = [];
                                    $scope.DemoConsultationPdfUrl = resp.data.data || [];
                                    if ($scope.DemoConsultationPdfUrl != "") {
                                        if ($scope.DemoConsultationPdfUrl.Attachments.length > 0) {


                                            var s3Pdfurl = $scope.DemoConsultationPdfUrl.Attachments[0].S3Url;

                                            window.open(s3Pdfurl);
                                        }
                                        else {
                                            $scope.eObj.pdfurl = "";
                                        }
                                    } else {
                                        $scope.eObj.pdfurl = "";
                                    }
                                }
                                else {
                                    $scope.eObj.IsChartPdfChecked = false;
                                    alertify.error("pdf genaratoin is fails ");
                                    return false;
                                }
                            })

                        }
                    }, function (err) {
                        alertify.error(err.data.ExceptionMessage);
                    });
                } else {
                    alertify.error("Appointment Already Exists For This Patient");
                }
            }, function (err) {
                alertify.error("Getting Failed");
            })
        }
        // calcTopMargin moved to USPrintService.HeaderHelpers.calcPdfTopMargin
        $scope.ManualPdfCreateContent = function () {
            var H = USPrintService.HeaderHelpers;
            //var fullHtml = $scope.mainConsentObj && $scope.mainConsentObj.HtmlContent;
   var fullHtml = document.querySelector('[id^="taTextElement"]').innerHTML
                || $scope.mainConsentObj.HtmlContent
                || '';
            var cfg = H.extractHeaderConfig(fullHtml) || $scope.headerConfig || {};
            var hasHeader = cfg.IsApplied === true;
            var bodyHtml = H.extractBodyHtml(fullHtml);
            var headerHtml = hasHeader ? H.buildHeaderDiv(cfg) : '';

            var printDoc = [
                '<!DOCTYPE html>',
                '<html>',
                '<head>',
                '<meta charset="utf-8">',
                '<title> </title>',
                '<style>',
                '@page { size: A4; margin: 15mm; }',
                '@media print {',
                '   body { margin: 0; }',
                '   .no-print { display: none !important; }',
                '}',
                'body {',
                '   font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;',
                '   font-size: 11pt; line-height: 1.4; color: #000;',
                '   margin: 0; padding: 0;',
                '}',

                // ── Repeating header via <thead> ─────────────────────────────
                'table.print-doc { width: 100%; border-collapse: collapse; }',
                'table.print-doc thead { display: table-header-group; }',
                'table.print-doc td.print-header-cell { padding: 0 0 3pt 0; }',
                'table.print-doc td.print-body-cell   { padding: 3pt 0 0 0; vertical-align: top; }',

                // ── Header layout container ──────────────────────────────────
                '.doc-header-block {',
                '   margin: 0 !important;',
                '   padding: 0 !important;',
                '   pointer-events: auto !important;',
                '   user-select: auto !important;',
                '   background: transparent !important;',          // no grey tint in print
                //'   border-bottom: 1px solid #e0e0e0 !important;',
                '}',

                // ── Header inner table — exact 2-column alignment ────────────
                '.doc-header-block table {',
                '   width: 100% !important;',
                '   table-layout: fixed !important;',
                '   border-collapse: collapse !important;',
                '   margin: 0 !important;',
                '}',
                '.doc-header-block td {',
                '   vertical-align: middle !important;',            // ← middle-align logo with title
                '   padding: 0 !important;',
                '}',
                '.doc-header-block td:first-child {',
                '   padding-right: 16px !important;',        // increased from 12
                '   white-space: nowrap;',
                '}',

                // ── Logo — force clean sizing ────────────────────────────────
                '.doc-header-block img {',
                '   max-height: 70px !important;',           // only cap height, not width
                '   height: auto !important;',
                '   object-fit: contain !important;',
                '   display: block !important;',
                '   margin: 0 !important;',
                // don't override width — buildHeaderDiv set the exact px from cfg.logoSize
                '}',

                // ── RESET header-internal text — kill browser default h1/h2/h3 margins ──
                '.doc-header-block h1,',
                '.doc-header-block h2,',
                '.doc-header-block h3,',
                '.doc-header-block h4,',
                '.doc-header-block h5,',
                '.doc-header-block h6,',
                '.doc-header-block p,',
                '.doc-header-block div {',
                '   margin: 0 !important;',                         // ← THIS IS THE KEY FIX
                '   padding: 0 !important;',
                '   line-height: 1.3 !important;',
                '}',
                '.doc-header-block h1 { font-size: 18px; font-weight: bold; }',
                '.doc-header-block h2 { font-size: 16px; font-weight: bold; }',
                '.doc-header-block h3 { font-size: 14px; font-weight: bold; }',
                '.doc-header-block h4 { font-size: 13px; font-weight: bold; }',
                '.doc-header-block h5 { font-size: 12px; font-weight: bold; }',
                '.doc-header-block h6 { font-size: 11px; font-weight: bold; }',
                '.doc-header-block p,',
                '.doc-header-block div { font-size: 11px; }',

                // ── Body ─────────────────────────────────────────────────────
                '.doc-body p, .doc-body div { margin: 4px 0; }',

                // ── Print toolbar ────────────────────────────────────────────
                '.print-bar {',
                '   position: sticky; top: 0; z-index: 9999;',
                '   background: #fff8e1; border-bottom: 1px solid #e0c674;',
                '   padding: 10px 14px; text-align: center;',
                '   font-family: Arial, sans-serif; font-size: 13px; color: #333;',
                '}',
                '.print-bar .tip { display:block; font-weight:600; color:#8a6d3b; margin-bottom:6px; }',
                '.print-bar button {',
                '   background: #1a5c4a; color: #fff; border: none;',
                '   padding: 8px 20px; font-size: 14px; border-radius: 4px;',
                '   cursor: pointer; margin: 0 4px;',
                '}',
                '.print-bar button.secondary { background: #888; }',

                '</style>',
                '</head>',
                '<body>',

                '<div class="print-bar no-print">',
                //'   <span class="tip">',
                //'       &#9432; Tip: in the print dialog, open "More settings" and uncheck ',
                //'       <b>"Headers and footers"</b> to hide the date and URL.',
                //'   </span>',
                '   <button onclick="window.print()">&#128424; Print / Save as PDF</button>',
                '   <button class="secondary" onclick="window.close()">Close</button>',
                '</div>',

                '<table class="print-doc">',
                hasHeader
                    ? '<thead><tr><td class="print-header-cell">' + headerHtml + '</td></tr></thead>'
                    : '',
                '<tbody><tr><td class="print-body-cell"><div class="doc-body">',
                bodyHtml,
                '</div></td></tr></tbody>',
                '</table>',

                '</body>',
                '</html>'
            ].join('\n');

            var w = window.open('', '_blank');
            if (!w) {
                alertify.error('Please allow pop-ups to preview the document.');
                return;
            }
            w.document.open();
            w.document.write(printDoc);
            w.document.close();
            w.focus();
        };
        $scope.ManualPdfCreateContent1 = async function () {
            var H = USPrintService.HeaderHelpers;

            // IMPORTANT: Read from the MODEL first — it always contains the
            // <!--HEADER-CONFIG:...--> comment. textAngular's live DOM sometimes
            // strips HTML comments, which makes extractHeaderConfig return null,
            // which breaks the page header on page 1 (pdfmake falls back because
            // `pageMargins[1]` gets the default `hasHeader=false` value of 20pt,
            // too small to fit the header — so pdfmake skips it on page 1).
            var modelHtml = $scope.mainConsentObj && $scope.mainConsentObj.HtmlContent;
            var fullHtml;
            if (modelHtml) {
                fullHtml = modelHtml;
            } else {
                // No model — fall back to live DOM. We won't have cfg, but at least
                // the body will render. No header in this case.
                var domEl = document.querySelector('[id^="taTextElement"]');
                fullHtml = (domEl && domEl.innerHTML) || '';
            }

            var cfg = H.extractHeaderConfig(fullHtml) || {};
            var hasHeader = cfg.IsApplied === true;
            var bodyHtml = H.extractBodyHtml(fullHtml);
            try {
                var _tmpDiv = document.createElement('div');
                _tmpDiv.innerHTML = bodyHtml;
                var _hdrBlock = _tmpDiv.querySelector('.doc-header-block');
                if (_hdrBlock) { _hdrBlock.parentNode.removeChild(_hdrBlock); }

                // Strip ALL leading empty blocks (<p>, <div>, <br>) left over from old spacer logic.
                // These render as blank vertical space in PDF for no reason.
                function isEmptyBlock(el) {
                    if (!el || el.nodeType !== 1) return false;
                    var tag = el.tagName;
                    if (tag !== 'P' && tag !== 'DIV' && tag !== 'BR') return false;
                    // Element counts as empty if its text (ignoring nbsp/zero-width) is empty
                    var txt = (el.textContent || '')
                        .replace(/\u00A0|\u200B/g, '')
                        .trim();
                    if (txt.length > 0) return false;
                    // Also must not contain <img> or other non-text content
                    if (el.querySelector && el.querySelector('img,table,hr,input,span[id]')) return false;
                    return true;
                }
                while (_tmpDiv.firstChild) {
                    var fc = _tmpDiv.firstChild;
                    // Skip whitespace text nodes
                    if (fc.nodeType === 3 && !fc.nodeValue.replace(/\u00A0|\u200B|\s/g, '')) {
                        _tmpDiv.removeChild(fc);
                        continue;
                    }
                    // Skip HTML comments
                    if (fc.nodeType === 8) { _tmpDiv.removeChild(fc); continue; }
                    if (isEmptyBlock(fc)) { _tmpDiv.removeChild(fc); continue; }
                    break;
                }

                bodyHtml = _tmpDiv.innerHTML;
            } catch (e) {
                bodyHtml = bodyHtml.replace(/<div[^>]*class="[^"]*doc-header-block[^"]*"[\s\S]*?<\/table>\s*<\/div>/gi, '').trim();
                // Fallback: regex-strip leading empty paragraphs/divs
                var prev;
                do {
                    prev = bodyHtml;
                    bodyHtml = bodyHtml
                        .replace(/^\s*<p[^>]*>\s*(<br\s*\/?>)?\s*<\/p>/i, '')
                        .replace(/^\s*<div[^>]*>\s*(<br\s*\/?>)?\s*<\/div>/i, '')
                        .replace(/^\s*<br\s*\/?>/i, '')
                        .trim();
                } while (bodyHtml !== prev);
            }
            var pdfContent = H.buildPdfContent(bodyHtml);

            var docDefinition = {
                content: pdfContent,
                header: hasHeader ? H.buildPageHeader(cfg) : null,
                footer: H.buildPageFooter(),
                pageBreakBefore: function (n) {
                    return n.style && n.style.indexOf('pdf-pagebreak-before') > -1;
                },
                defaultStyle: { font: 'Roboto' },
                pageSize: 'A4',
                pageOrientation: 'portrait',
                pageMargins: [40, hasHeader ? H.calcPdfTopMargin(cfg) : 20, 40, 50],
                styles: { tableExample: { margin: [0, 5, 0, 5] } }
            };
            console.log(docDefinition,'EmailRefaral manualodf')

            pdfMake.createPdf(docDefinition).print();
        };
        $scope.SaveManualReferalAppointmentNew = function () {
            //if ($scope.eObj.AttachmentsArray.length == 0) {
            //    alertify.error("There is No Attached Summary");
            //    return false;
            //}
            let AppointmentId = 0;
            if ($scope.mainReferalObj!=null) {
                AppointmentId = $scope.mainReferalObj.VisitId || 0;
            }
            if (AppointmentId == 0) {
                alertify.error("Please Select Visit");
                return false;
            }
            var params = {
                "UserId": $scope.UserId,
                "AppointmentId": AppointmentId,
                "PatientId": appoint_info.PatientID||null,
                "ConsultationId": appoint_info.ConsultationId||null,
                "AppointmentReferalId": 0,
                "ReferalTypeId": 1,
                "ReferalType": "Manual",
                "ReferalEmailId": $scope.manualReferralObj.ReferalEmailId,
                "ReferalDoctorName": $scope.manualReferralObj.ReferalDoctorName,
                "ReferalOrganizationName": $scope.manualReferralObj.ReferalOrganizationName,
                "ReferalNote": $scope.manualReferralObj.ReferalNote,
                "ReferalEmailSubject": $scope.manualReferralObj.EmailSubject,
                "ReferalEmailBody": $scope.manualReferralObj.EmailBody,

            }
            eHnoteMainAppointmentService.AddUpdateAppointmentReminderDetails(params).then(function (resp) {
                if (resp.data.status == "success") {
                    $scope.mainConsentObj.HtmlContent = $scope.mainConsentObj.HtmlContent || '';
                    setTimeout(attachHeaderKeyGuard, 300);
                    if ($scope.mainConsentObj.HtmlContent !== '') {
                        $scope.ManualPdfCreateContent();
                    } else {
                        $scope.eObj.AttachmentsArray = $scope.eObj.AttachmentsArray || [];
                        if ($scope.eObj.AttachmentsArray.length>0) {
                            for (let i = 0; i < $scope.eObj.AttachmentsArray.length; i++) {
                                window.open($scope.eObj.AttachmentsArray[i].S3URL);
                            }
                            $scope.ClearAll();
                            $scope.ClearPatientInfo();
                        }

                    }


                }
            }, function (err) {
                alertify.error("Getting Failed");
            })
        }

        $scope.sendDocumentsThrough = function (type) {

            if (type == 'Email') {
                $scope.SendReferalAttachmentsToMail();
            }
            else if (type == 'Fax') {
                $scope.saveDocumentasFax();
            }
            else if (type == 'CCDA') {
                $scope.SendPatientCCDAToMail();
            }
            else if (type == 'DirectMessage') {

            }
            else if (type == 'Manual') {
                //$scope.SaveManualReferalAppointment();
                $scope.SaveManualReferalAppointmentNew();
            }
        }


        $scope.MasterFaxReceviersCategoryData = [
            /* {
                 "CategoryId": 1,
                 "CategoryName": "Provider"
             },*/
            {
                "CategoryId": 2,
                "CategoryName": "Patient"
            },
            {
                "CategoryId": 3,
                "CategoryName": "Pharmacy"
            },
            {
                "CategoryId": 4,
                "CategoryName": "Attorny"
            },
            {
                "CategoryId": 5,
                "CategoryName": "Referral"
            },
            {
                "CategoryId": 6,
                "CategoryName": "PCP"
            },
            {
                "CategoryId": 7,
                "CategoryName": "Insurance COS"
            },
            {
                "CategoryId": 8,
                "CategoryName": "Other"
            }
        ];


        $scope.FaxReceiversList = [];

        function addNewFaxReceiverObj() {
            var obj = {
                "CategoryId": 0,
                "CategoryName": "",
                "ReceiverName": "",
                "ReceiverId": 0,
                "ClinicName": "",
                "ClinicId": 0,
                "FaxNumber": "",
                "FaxCountryCode": "+1",
                "FaxAreaCode": "",
                "FaxHomeNumber": "",
                "ReceiverObj": "",
                "ClinicalObj": "",
                "IsHighPriority": false,
                "selectedPCPReferralDoctor":''
            }
            return obj;
        };
        $scope.emptyFaxObj = addNewFaxReceiverObj();
        $scope.FaxReceiversList.push($scope.emptyFaxObj);

        $scope.navtoaddnewFaxReceiver = function (fitem) {
            var CategoryId = parseFloat(fitem.CategoryId) || 0;
            if (CategoryId === 0) {
                alertify.error("please select a category");
                return false;
            }

            var ReceiverName = fitem.ReceiverName || "";
            if (ReceiverName === "") {
                alertify.error("please enter the Receiver Name");
                return false;
            }

            var FaxNumber = fitem.FaxNumber || "";
            if (FaxNumber === "") {
                alertify.error("please enter the FaxNumber");
                return false;
            }

            $scope.emptyFaxObj = addNewFaxReceiverObj();
            $scope.FaxReceiversList.push($scope.emptyFaxObj);
        }

        $scope.onSelectFaxprovider = function (obj, mainobj) {

            mainobj.FaxNumber = '';
            mainobj.ReceiverName = obj.FullName;
            mainobj.ReceiverId = obj.DoctorID;
            mainobj.ClinicName = obj.PCPOrganization;
            mainobj.selectedPCPReferralDoctor = obj.FullName;
            /*$scope.selectedPCPReferralDoctorName = obj.FullName;*/
            if (obj.Fax != "") {
                var FaxNumber = eHnoteUserDataService.UsMobileFormatChange(obj.Fax);
                mainobj.FaxNumber = FaxNumber.UsFormatMobileNumber;
                $scope.changeFaxreffaxNumberNumbersdata(mainobj);
            }
        };

        $scope.changeFaxReceiverCategory = function (CatId, obj) {
            if (!CatId) {
                obj.CategoryId = "";
            }
            referralTypeName = $scope.MasterFaxReceviersCategoryData.filter(item => item.CategoryId === CatId).map(item => item.CategoryName).join('');
            obj.ReceiverObj = '';
            obj.ClinicName = '';
            obj.FaxNumber = '';
            obj.ReceiverName = '';
            obj.selectedPCPReferralDoctor = "";
            if (CatId === 2) {
                $scope.SelectedPatientId = $scope.SelectedPatientId || null;
                if ($scope.SelectedPatientId == null) {
                    obj.CategoryId = '';
                    obj.ReceiverName = "";
                    obj.FaxNumber = "";
                    alertify.error("Please select Patient");
                    return false;
                }
                obj.ReceiverName = $scope.PaitentDetails.FullName || "";
                if ($scope.PaitentDetails.faxNumber != '') {
                    var FaxNumber = eHnoteUserDataService.UsMobileFormatChange($scope.PaitentDetails.faxNumber);
                    obj.FaxNumber = FaxNumber.UsFormatMobileNumber;
                    $scope.changeFaxreffaxNumberNumbersdata(obj);

                }
            }
        };

        $scope.GetPatientVisitData = function (id) {
            var obj = {
                "PatientId": id || null
            }
            eHnotePatientDataService.GetAllAppointmentsByPatientId(obj).then(function (resp) {
                if (resp.data.status == "Success") {
                    $scope.AllVisitsArray = [];
                    if (resp.data.VisitsArray.length > 0) {
                        $scope.AllVisitsArray = resp.data.VisitsArray || [];
                        if ($scope.AllVisitsArray.length > 0) {
                            angular.forEach($scope.AllVisitsArray, function (item) {
                                item.AppointmentformatDate = moment(item.VisitDate).format('MM-DD-YYYY');
                                $scope.AllVisitsArray.forEach(function (item) {
                                    item.AppointmentformatDate = moment(item.VisitDate).format('MM-DD-YYYY');
                                });

                                if ($scope.SelectedObj && $scope.SelectedObj.VisitId) {
                                    $scope.mainReferalObj.VisitId = $scope.SelectedObj.VisitId;
                                }
                            });
                        }
                        ComingFromScreenType = ComingFromScreenType || '';
                        if (ComingFromScreenType == 'Patient') {
                            $scope.SelectedObj.VisitId = $scope.SelectedObj.VisitId || 0;
                            if ($scope.AllVisitsArray.length > 0) {
                                let Selectedpatientvisit = $filter("filter")($scope.AllVisitsArray, function (item) {
                                    return item.VisitId == $scope.SelectedObj.VisitId;
                                }) || [];
                                if (Selectedpatientvisit.length > 0) {
                                    $scope.mainReferalObj.VisitId = Selectedpatientvisit.VisitId || 0;
                                }
                            }
                        }
                        if (!$scope.mainReferalObj.VisitId && $scope.SelectedObj && $scope.SelectedObj.VisitId) {
                            $scope.mainReferalObj.VisitId = $scope.SelectedObj.VisitId;
                        }
                    }

                }


            }, function (err) {

            });
        };
        if ($scope.SelectedPatientId) {
            $scope.GetPatientVisitData($scope.SelectedPatientId);
        }
        $scope.GetPatientConsentFieldsData = function (visit,appointmentid) {
            visit = visit || 0;
            appointmentid = appointmentid || 0;
            var Requestype = "ASC";
            if ($scope.SelectedObj.AppointmentTypeId === 7) {
                Requestype = "PreOp";
            }
            else if ($scope.SelectedObj.AppointmentTypeId === 4 || $scope.SelectedObj.AppointmentTypeId === 14) {
                Requestype = "ASC";
            } else {
                Requestype = "OutPatient";
            }
            var params = {
                "PatientId": $scope.SelectedPatientId||0,
                "AppointmentId": appointmentid,
                "OrganizationId": $scope.HospitalId,
                "Requestype": Requestype,
                "VisitId": visit,
            };
            eHnoteSettingsDataService.GetPatientAppointmentConsentFieldsData(params).then(function (resp) {
                if (resp.data.status == "Success") {
                    $scope.AssessmentPlan = [];
                    $scope.BillingList = [];
                    if (resp.data.AppointmentDetails != undefined) {
                        $scope.SelectedApptObj = resp.data.AppointmentDetails;
                    }
                    if (resp.data.PatientDetails != undefined) {
                        $scope.SelectedPatObj = angular.copy(resp.data.PatientDetails);
                        pcpAddress = resp.data.PatientDetails.PCP || [];
                    }
                    if (resp.data.OrganizationDetails != undefined) {
                        $scope.SelectedOrgObj = resp.data.OrganizationDetails;
                    }
                    if (resp.data.AssessmentPlan.length > 0) {
                        $scope.AssessmentPlan = resp.data.AssessmentPlan || [];
                        assessmentsAndPlans = angular.copy(resp.data.AssessmentPlan) || [];
                    }
                    if (resp.data.Billing.length > 0) {
                        $scope.BillingList = resp.data.Billing || [];
                    }
                    resp.data.Visitdate = resp.data.Visitdate || '';
                    if (resp.data.Visitdate !== '') {
                        $scope.VisitDate = resp.data.Visitdate || '';
                    }
                    resp.data.TotalPatientClaimBalance = resp.data.TotalPatientClaimBalance || 0;
                    if (resp.data.TotalPatientClaimBalance !== 0) {
                        $scope.TotalPatientClaimBalance = resp.data.TotalPatientClaimBalance || 0;
                    }

                    if (resp.data.ASCDetails != undefined) {
                        $scope.PatientASCApptdetails = resp.data.ASCDetails;
                    }
                    if (resp.data.Tonometry.length > 0) {
                        tonometryDetails = resp.data.Tonometry || [];
                    }
                    if (resp.data.VisionDetails.length > 0) {
                        visionDetails = resp.data.VisionDetails || [];
                    }
                    if (resp.data.AnteriorSegmentDetails.length > 0) {
                        anteriorSegmentDetailsArr = resp.data.AnteriorSegmentDetails || [];
                    }
                    if (resp.data.PosteriorSegmentDetails.length > 0) {
                        posteriorSegmentDetailsArr = resp.data.PosteriorSegmentDetails || [];
                    }
                    if (resp.data.ReferalDetails) {
                        refferalProviderAdress = resp.data.ReferalDetails || {};
                    }
                    $scope.ReferralDoctorFirstName = resp.data.ReferalDetails.ReferralDoctorFirstName || "";
                    $scope.ReferralDoctorLastName = resp.data.ReferalDetails.ReferralDoctorLastName || "";
                    $scope.ReferralDoctorFullName = $scope.ReferralDoctorFirstName + " " + $scope.ReferralDoctorLastName;
                    $scope.ReferralDoctorNPI = resp.data.ReferalDetails.ReferralDoctorNPI;

                    if (resp.data.ReferalDetails.length > 0) {
                        $scope.ReferralDoctorAddress = resp.data.ReferalDetails.Address1 + " " + resp.data.ReferalDetails.Address2 + "," + '<br>' + resp.data.ReferalDetails.CityName + "," + resp.data.ReferalDetails.StateName + "," + resp.data.ReferalDetails.ZipCode;
                    } else {
                        $scope.ReferralDoctorAddress = "";
                    }
                }
            }, function (err) {

            });
        };

        $scope.addUpdateAppointmentReqObj = {
            "ReferalDoctorName": "",
            "ReferalOrganizationName": "",
        }
        $scope.ClearPatientInfo = function () {
            $scope.SelectedPatientId = null;
            $scope.HeaderPatientSearchObj.IsShowSearchRemoveInd = true;
            $scope.PaitentDetails = getPaitentDetailsObj();
        }
        $scope.ClearAll = function () {
            $scope.mainReferalObj.Mode = '0';
            $scope.mainReferalObj.VisitId = "";
            $scope.eObj = getEmailReqObj();
            $scope.eObj.DoctorEmail = '';
            $scope.faxFromObject.selectedDoctor = '';
            $scope.faxFromObject.selectedClinic = '';
            $scope.faxFromObject.FromFaxNumber = '';
            $scope.faxFromObject.Subject = '';
            $scope.FaxReceiversList = [];
            $scope.emptyFaxObj = addNewFaxReceiverObj();
            $scope.FaxReceiversList.push($scope.emptyFaxObj);

            $scope.newSendEmailReqObj = getSendEmailEmptyRequestObj();

            $scope.addUpdateAppointmentReqObj.ReferalDoctorName = '';
            $scope.addUpdateAppointmentReqObj.ReferalOrganizationName = '';

            // Clear the text-angular content
            $scope.mainConsentObj.HtmlContent = '';

            tonometryDetails = [];
            pcpAddress = [];
            assessmentsAndPlans = [];
            visionDetails = [];
            posteriorSegmentDetailsArr = [];
            anteriorSegmentDetailsArr = [];
            refferalProviderAdress = {};
            patientParticularDetailsObj = {};
            angular.forEach($scope.PatientFillObj, function (value, key) {
                $scope.PatientFillObj[key] = "";
            });
            $scope.SelectedPatObj.ExternalComanagerName = "";
            $scope.SelectedPatObj.PCPDoctorName = "";
            $scope.SelectedPatObj.ExtrenalDetails = "";
            $scope.PatientAppointmentList = [];
            // Force text-angular to update (very important)
            $timeout(function () {
                var taEditorElement = document.getElementById('htmlcontentconsent');
                if (taEditorElement) {
                    var contentEditable = taEditorElement.querySelector('.ta-bind');
                    if (contentEditable) {
                        contentEditable.innerHTML = ''; // Editor content ni empty cheyadam
                    }
                }
            }, 100);
        };

        $scope.DeleteFax = function (item) {
            var index = $scope.FaxReceiversList.indexOf(item);
            if (index > -1) {
                $scope.FaxReceiversList.splice(index, 1);
            }
        }

        $scope.patiendetilsopen = function () {
            let patientId = $scope.SelectedPatientId  || 0;
            eHnoteAuditServices.getPatientDetailsById(patientId, ongetPatientDetailsSuccess, ongetPatientDetailsError);
            function ongetPatientDetailsSuccess(data) {
                if (data !== undefined) {
                    var selectedPatientData = data;

                    $scope.PaitentDetailsRef = {
                        "FullName": selectedPatientData.Patient[0].FullName || "",
                        "PatientDisplayId": selectedPatientData.Patient[0].PatientDisplayId || "",
                        "DisplayID": selectedPatientData.Patient[0].PatientDisplayId || "",
                        "MobileNo": selectedPatientData.Patient[0].MobileNo || 0,
                        "DOB": selectedPatientData.Patient[0].DOB || "",
                        "AgeInYears": selectedPatientData.Patient[0].AgeInYears || 0,
                        "AgeInMonths": selectedPatientData.Patient[0].AgeInMonths || 0,
                        "S3URL": selectedPatientData.Patient[0].S3URL || "",
                        "SocialSecurityNo": selectedPatientData.Patient[0].SocialSecurityNo || "",
                        "BloodGroupName": selectedPatientData.Patient[0].PatientOtherDetails[0].BloodGroupName || "",
                        "MaritalStatusName": selectedPatientData.Patient[0].PatientOtherDetails[0].MaritalStatus || "",
                        "ExternalComanagerName": selectedPatientData.Patient[0].ExternalComanagerName || '',
                        "InternalComanagerName": selectedPatientData.Patient[0].InternalComanagerName || '',
                        "ContactInfo": {
                            "EmailID": selectedPatientData.Patient[0].EmailId || "",
                        }
                    }

                    $scope.PostalAddressSummaryObj = {
                        "AddressId": selectedPatientData.PatientAddress.PostalAddress.AddressId || 0,
                        "AddressLine1": selectedPatientData.PatientAddress.PostalAddress.AddressLine1 || "",
                        "AddressLine2": selectedPatientData.PatientAddress.PostalAddress.AddressLine2 || "",
                        "ZipCode": selectedPatientData.PatientAddress.PostalAddress.ZipCode || "",
                        "CountyId": selectedPatientData.PatientAddress.PostalAddress.CountyId || 0,
                        "CountyName": selectedPatientData.PatientAddress.PostalAddress.CountyName || "",
                        "CityName": selectedPatientData.PatientAddress.PostalAddress.CityName || "",
                        "CityId": selectedPatientData.PatientAddress.PostalAddress.CityId || 0,
                        "StateName": selectedPatientData.PatientAddress.PostalAddress.StateName || "",
                        "StateId": selectedPatientData.PatientAddress.PostalAddress.StateId || 0,
                        "CountryName": selectedPatientData.PatientAddress.PostalAddress.CountryName || "",
                        "CountryId": selectedPatientData.PatientAddress.PostalAddress.CountryId || 0,
                    }

                    $scope.PermanentAddressSummaryObj = {
                        "AddressId": selectedPatientData.PatientAddress.PermanentAddress.AddressId || 0,
                        "AddressLine1": selectedPatientData.PatientAddress.PermanentAddress.AddressLine1 || "",
                        "AddressLine2": selectedPatientData.PatientAddress.PermanentAddress.AddressLine2 || "",
                        "ZipCode": selectedPatientData.PatientAddress.PermanentAddress.ZipCode || "",
                        "CountyId": selectedPatientData.PatientAddress.PermanentAddress.CountyId || 0,
                        "CountyName": selectedPatientData.PatientAddress.PermanentAddress.CountyName || "",
                        "CityName": selectedPatientData.PatientAddress.PermanentAddress.CityName || "",
                        "CityId": selectedPatientData.PatientAddress.PermanentAddress.CityId || 0,
                        "StateName": selectedPatientData.PatientAddress.PermanentAddress.StateName || "",
                        "StateId": selectedPatientData.PatientAddress.PermanentAddress.StateId || 0,
                        "CountryName": selectedPatientData.PatientAddress.PermanentAddress.CountryName || "",
                        "CountryId": selectedPatientData.PatientAddress.PermanentAddress.CountryId || 0,
                    }

                    $scope.PatientOfficeNumber = selectedPatientData.Patient[0].OfficeAreaCode + selectedPatientData.Patient[0].PatientOfficeNumber;
                    var obj1 = eHnoteUserDataService.UsMobileFormatChange($scope.PatientOfficeNumber);
                    $scope.PatientOfficeNumber = obj1.UsFormatMobileNumber;

                    $scope.PatientMobileNumber = selectedPatientData.Patient[0].MobileNo;
                    var obj2 = eHnoteUserDataService.UsMobileFormatChange($scope.PatientMobileNumber);
                    $scope.PatientMobileNumber = obj2.UsFormatMobileNumber;

                    $scope.DemographicSummaryObj = {
                        "LanguageName": selectedPatientData.Patient[0].AdditionalInfo.LanguageName || "",
                        "Proficiency": selectedPatientData.Patient[0].AdditionalInfo.Proficiency || "",
                        "SexualOrientation": selectedPatientData.Patient[0].AdditionalInfo.SexualOrientation || "",
                        "GenderIdentityStatus": selectedPatientData.Patient[0].AdditionalInfo.GenderIdentity || "",
                    }

                }
            }
            function ongetPatientDetailsError(error) {
                console.log(error);
            }
        }



        $scope.ChangeSelectedtype = function (item) {
            $scope.PatientAppointmentList = [];
            if (item.Id == 1) {
                $scope.PatientAppointmentList = angular.copy($scope.PatientAppointmentConsentForms)||[];
            } else if (item.Id == 2) {
                $scope.PatientAppointmentList = angular.copy($scope.PatientAppointmentLetters)||[];

            }
        }
        $scope.SelectedVist = function (visit) {
            visit = visit || 0;
            $scope.AllVisitsArray = $scope.AllVisitsArray || [];
            if ($scope.AllVisitsArray.length>0) {
                var List = $filter("filter")($scope.AllVisitsArray, function (kitem) { return kitem.VisitId == visit}, true);
            }
            if (List.length > 0) {
                var appointmentid = List[0].AppointmentId;

                $scope.SelectedObj.VisitId = visit;

                appoint_info.AppointmentId = List[0].AppointmentId || 0;

                $scope.GetPatientConsentFieldsData(visit,appointmentid);

            }


        }





        $scope.resetfilterEmailDetails = function () {
            $scope.outboundEmail = getoutboundEmail();

            $scope.GetOutgoingEmailDetails();
        }


        $scope.GetOutgoingEmailDetails = function () {

            var obj = {
                "OrganizationId": $scope.HospitalId,
                "ExternalStatus": $scope.outboundEmail.ExternalStatus,
                "FromDate": $scope.outboundEmail.FromDate,
                "ToDate": $scope.outboundEmail.ToDate ,
                "EmailId": $scope.outboundEmail.EmailId ,
                "EmailTypeId": $scope.outboundEmail.EmailTypeId ,
            }
            eHnotePatientDataService.GetOutgoingEmailDetails(obj).then(function (resp) {

                if (resp.data.Status == "Success") {

                    $scope.OutgoingEmaildetails = resp.data.rows || [];
                    $scope.OutgoingEmaildetailsNew = resp.data.rowsNew || [];
                } else {
                    $scope.OutgoingEmaildetails = [];
                    $scope.OutgoingEmaildetailsNew = [];
                }

            });
        }



        $scope.getFilteredList = function (viewValue) {
            if (!viewValue) return $scope.PatientAppointmentList;

            var filtered = $scope.PatientAppointmentList.filter(function (item) {
                return item.DocumentName.toLowerCase().indexOf(viewValue.toLowerCase()) !== -1;
            });
            return filtered;
        };

        //Locations 

        $scope.stopClosingDropDown = function (event) {
            event.stopPropagation();
        }
        function InitializeBranches(data) {
            var clinicAddress = eHnoteUserAppointmentDataService.RestructureNewBranches($scope.UserAccessRights.AllAccessRights.APPListAllBranchesAppointments, data, doctorinfo) || [];

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
            $scope.BranchesListArray = clinicAddress;
            $scope.ApptBranchLocations = angular.copy(clinicAddress);
            $scope.ApptBranchLocationsincomingfax = angular.copy(clinicAddress);
            var selectedClinicId = doctorinfo.doctordata.UserAddress[0].ClinicId;
            var matchedItemoutgoingfax = $filter("filter")($scope.ApptBranchLocations, { BranchId: selectedClinicId }, true)[0];
            var matchedItemincomingfax = $filter("filter")($scope.ApptBranchLocationsincomingfax, { BranchId: selectedClinicId }, true)[0];

            if (matchedItemoutgoingfax) {
                matchedItemoutgoingfax.IsChecked = true;
                $scope.LocationTypeObj.SelectLocationString = matchedItemoutgoingfax.BranchName;
            }
            if (matchedItemincomingfax) {
                matchedItemincomingfax.IsChecked = true;
                $scope.IncomingfaxLocationTypeObj.SelectLocationString = matchedItemincomingfax.BranchName;
            }
            var locationIds = $scope.ApptBranchLocations
                .filter(function (pitem) {
                    return pitem.IsChecked && pitem.ClinicId !== 0;
                })
                .map(function (pitem) {
                    return pitem.ClinicId;
                })
                .join(",");
            var faxlocationIds = $scope.ApptBranchLocationsincomingfax
                .filter(function (pitem) {
                    return pitem.IsChecked && pitem.ClinicId !== 0;
                })
                .map(function (pitem) {
                    return pitem.ClinicId;
                })
                .join(",");
            $scope.outgoingFaxLocationIds = locationIds;
            $scope.incomingFaxLocationIds = faxlocationIds

        };
        $scope.changeAppointmentBranch = function (obj) {

            if (obj.IsChecked) {
                $scope.LocationTypeObj.SelectLocationString = "Selected";
                if (obj.ClinicId === 0) {
                    angular.forEach($scope.ApptBranchLocations, function (mitem) {
                        mitem.IsChecked = true;
                    });

                    $scope.LocationTypeObj.SelectLocationString = "All Locations";
                }
                else {
                    if ($scope.ApptBranchLocations.every(mitem => mitem.ClinicId === 0 || mitem.IsChecked)) {
                        $scope.ApptBranchLocations.forEach(mitem => {
                            if (mitem.ClinicId === 0) {
                                mitem.IsChecked = true;

                                $scope.LocationTypeObj.SelectLocationString = "All Locations";
                            }
                        });
                    }

                }

            }
            else {
                if (obj.ClinicId === 0) {
                    angular.forEach($scope.ApptBranchLocations, function (mitem) {
                        mitem.IsChecked = false;
                    });
                }
                else {
                    angular.forEach($scope.ApptBranchLocations, function (mitem) {
                        if (mitem.ClinicId === 0) {
                            mitem.IsChecked = false;
                        }
                    });

                }

                $scope.LocationTypeObj.SelectLocationString = "Selected";

                var nofalsecount = 0;
                angular.forEach($scope.ApptBranchLocations, function (mitem) {
                    if (mitem.IsChecked) {
                        nofalsecount++;
                    }
                });
                if (nofalsecount === 0) {
                    $scope.LocationTypeObj.SelectLocationString = "Select Location";
                }
            }

            $scope.selectedBranch = obj;
            $scope.AppListselectedclinic = angular.copy(obj);

            var locationIds = $scope.ApptBranchLocations
                .filter(pitem => pitem.IsChecked && pitem.ClinicId !== 0) // Exclude ClinicId === 0
                .map(pitem => pitem.ClinicId)
                .join(",");

            $scope.outgoingFaxLocationIds = locationIds;
        }
        $scope.onIncomingFaxBranchChange = function (obj) {

            if (obj.IsChecked) {
                $scope.IncomingfaxLocationTypeObj.SelectLocationString = "Selected";
                if (obj.ClinicId === 0) {
                    angular.forEach($scope.ApptBranchLocationsincomingfax, function (mitem) {
                        mitem.IsChecked = true;
                    });

                    $scope.IncomingfaxLocationTypeObj.SelectLocationString = "All Locations";
                }
                else {
                    if ($scope.ApptBranchLocationsincomingfax.every(mitem => mitem.ClinicId === 0 || mitem.IsChecked)) {
                        $scope.ApptBranchLocationsincomingfax.forEach(mitem => {
                            if (mitem.ClinicId === 0) {
                                mitem.IsChecked = true;

                                $scope.IncomingfaxLocationTypeObj.SelectLocationString = "All Locations";
                            }
                        });
                    }

                }

            }
            else {
                if (obj.ClinicId === 0) {
                    angular.forEach($scope.ApptBranchLocationsincomingfax, function (mitem) {
                        mitem.IsChecked = false;
                    });
                }
                else {
                    angular.forEach($scope.ApptBranchLocationsincomingfax, function (mitem) {
                        if (mitem.ClinicId === 0) {
                            mitem.IsChecked = false;
                        }
                    });

                }

                $scope.IncomingfaxLocationTypeObj.SelectLocationString = "Selected";

                var nofalsecount = 0;
                angular.forEach($scope.ApptBranchLocationsincomingfax, function (mitem) {
                    if (mitem.IsChecked) {
                        nofalsecount++;
                    }
                });
                if (nofalsecount === 0) {
                    $scope.IncomingfaxLocationTypeObj.SelectLocationString = "Select Location";
                }
            }

            $scope.selectedBranch = obj;
            $scope.AppListselectedclinic = angular.copy(obj);

            var faxlocationIds = $scope.ApptBranchLocationsincomingfax
                .filter(pitem => pitem.IsChecked && pitem.ClinicId !== 0) // Exclude ClinicId === 0
                .map(pitem => pitem.ClinicId)
                .join(",");

            $scope.incomingFaxLocationIds = faxlocationIds
        };
        $scope.navtoPdfSplit = function (item) {
            $scope.selectedRowId = item.TransactionId;
            $scope.selectedFaxItemId = item.UserInboundTransactionId;
            var obj = {
                "apptitem": "",
                "faxItem": item,
                "UserId": $scope.UserId,
                "HospitalId": $scope.HospitalId
            }
            $scope.mInstanceAddC = $uibModal.open({
                "templateUrl": "templates/UsNewConsultation/uibpopup/PatientFaxViewerandConnect.html",
                "backdrop": "static",
                "keyboard": false,
                "windowClass": "modal__popup--1 bottom-to-top-modal",
                "resolve": {
                    "mainObject": function () { return obj; },
                    "UsersList": function () { return $scope.clinicDoctorList; },
                },
                "controller": function ($scope, $uibModal, $timeout, $uibModalInstance, eHnotePatientPVService, mainObject, UsersList, eHnoteUserDataService) {
                    console.log(mainObject);
                    $scope.ParentHospitalId = 0;
                    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
                        $scope.ParentHospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
                        $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
                        $scope.LoggedUserName = doctorinfo.doctordata.User[0].SecondUserFullName;
                    }
                    $scope.UserId = mainObject.UserId;
                    $scope.HospitalId = mainObject.HospitalId;


                    $scope.MainFaxItem = mainObject.faxItem;
                    $scope.patientsearchInd = 1;
                    $scope.PatientSearchobj = {
                        "SearchText": ""
                    };
                    $scope.UsersList = [];
                    $scope.UsersList = UsersList;
                    item = item || "";
                    $scope.IncomingFaxFromNumber = item.FromNumber;
                    $scope.IncomingFaxToNumber = item.ToNumber;
                    $scope.FromFaxToNumber = item.FromNumber;
                    $scope.CreatedDt = item.CreatedDt;
                    $scope.Assigneduserdate = item.AssignedUserDate;
                    $scope.Assignedcreatedtime = item.Assignedcreatedtime;
                    $scope.CreatedTime = item.CreatedTime;
                    $scope.TransactionId = item.TransactionId;
                    $scope.SplitStatus = item.SplitStatus;
                    $scope.SplitStatusId = item.SplitStatusId ;
                    $scope.stopClosingDropDown = function (event) {
                        event.stopPropagation();
                    }
                    $scope.FaxcoverLetterdata = [];
                    $scope.FaxcoverLetterdata = [item];
                    $scope.Faxcoverletteraddress = doctorinfo.doctordata.UserAddress
                    $scope.searchtxtb = { "txt1": "", "txt2": "" };
                    $scope.searchtxtb.txt1 = "";
                    $scope.UserId = eHnoteMasterDataService.getLoginId();
                    $scope.AllDoctorsObj = {
                        "AllDoctorCheck": false
                    }

                    $scope.checkAllDoctor = function (val) {
                        if (val) {
                            angular.forEach($scope.UsersList, function (item) {
                                item.isChecked = true;
                            });

                            $scope.selectedDoctors = 'All';
                        } else {
                            angular.forEach($scope.UsersList, function (item) {
                                item.isChecked = false;
                            });

                            $scope.selectedDoctors = 'Select Doctors';
                        }
                        var checkedArray = _.where($scope.UsersList, { isChecked: true });
                        $scope.AllDoctorsObj.AllDoctorCheck = checkedArray.length > 0 && $scope.UsersList.length === checkedArray.length ? true : false;

                    };
                    $scope.DoctorToggle = function (item) {
                        var checkedArray = _.where($scope.UsersList, { isChecked: true });
                        $scope.AllDoctorsObj.AllDoctorCheck = checkedArray.length > 0 && $scope.UsersList.length === checkedArray.length ? true : false;

                        if (checkedArray.length == 0) {
                            $scope.selectedDoctors = "Select Doctor";
                        } else {
                            if (checkedArray.length === 1) {
                                //$scope.selectedDoctors = checkedArray[0].NPI + '-' + checkedArray[0].UserFullName;
                                $scope.selectedDoctors = checkedArray[0].SecondUserFullName + '-' + checkedArray[0].NPI;
                            } else {
                                $scope.selectedDoctors = "Selected Doctors";
                            }
                        }

                    };
                    $scope.getSelectedDoctorText = function () {
                        const selected = $scope.UsersList.filter(user => user.isChecked);
                        if (selected.length === 0) {
                            return 'Assign To User';
                        } else if (selected.length === 1) {
                            return selected[0].SecondUserFullName;
                        } else {
                            return `${selected.length} Selected`;
                        }
                    };

                    $scope.closeuibpopup = function () {
                        $uibModalInstance.dismiss("cancel");
                    };

                    $scope.clearSearchDetails = function () {
                        $scope.PatientSearchobj.SearchText = "";

                        $scope.MergingPatient.PatientId = 0;
                        $scope.MergingPatient.FullName = "";
                        $scope.MergingPatient.FirstName = "";
                        $scope.MergingPatient.LastName = "";
                        $scope.MergingPatient.Gender = "";
                        $scope.MergingPatient.DOB = "";
                        $scope.MergingPatient.Age = "";
                        $scope.MergingPatient.MobileNo = "";
                        $scope.MergingPatient.ContactNo = "";
                        $scope.MergingPatient.EmailId = "";
                        $scope.MergingPatient.PatientDisplayId = "";
                        $scope.MergingPatient.OldMrno = "";
                        $scope.MergingPatient.PatientInsuranceDetails = [];
                        $scope.MergeAddReqObj.MergedPatientId = 0;
                        $scope.MergeAddReqObj.MergeRemarks = null;
                        $scope.ShowPatientListDrop = true;
                        $scope.MergingPatient.CreatedDt = "";
                        $scope.MergingPatient.CreatedBy = "";
                        $scope.PatientsArray = [];
                    };

                    $scope.MergeAddReqObj = {
                        "CurrentPatientId": $scope.PatientId,
                        "AppointmentId": $scope.AppointmentId,
                        "MergedPatientId": 0,
                        "UserId": $scope.UserId,
                        "MergeRemarks": ""
                    };

                    $scope.MergingPatient = {
                        "PatientId": 0,
                        "FirstName": "",
                        "LastName": "",
                        "FullName": "",
                        "Gender": "",
                        "DOB": "",
                        "Age": "",
                        "MobileNo": "",
                        "ContactNo": "",
                        "EmailId": "",
                        "PatientDisplayId": "",
                        "OldMrno": "",
                        "CreatedDt": "",
                        "CreatedBy": "",
                        "PatientInsuranceDetails": []
                    };
                    $scope.ShowPatientListDrop = false;
                    $scope.SearchPatientByMrNO = function () {
                        if ($scope.PatientSearchobj.SearchText != '') {
                            $scope.PatientsArray = [];
                            var name = $scope.PatientSearchobj.SearchText;
                            //if ($scope.patientsearchInd === 5) {
                            //    name = name + " 00:00:00";

                            //    var parsedDate = new Date(name);
                            //    if (!isNaN(parsedDate.getTime())) {
                            //        name = $filter('date')(parsedDate, "yyyy-MM-dd");
                            //    } else {

                            //        alertify.error("Invalid date format:", name);
                            //        name = "";

                            //        return false;
                            //    }
                            //}
                            if (/^\d{8}$/.test(name)) {

                                var month = name.substring(0, 2);
                                var day = name.substring(2, 4);
                                var year = name.substring(4, 8);

                                var formattedDate = year + "-" + month + "-" + day;
                                var parsedDate = new Date(formattedDate);

                                if (!isNaN(parsedDate.getTime())) {
                                    name = formattedDate;
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

                                    param.StartDate = name;
                                    param.hasparam = true;
                                    param.SearchText = "";
                                    param.PhoneNumber = "";
                                } else {
                                    param = {
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
                                    param.PhoneNumber = name;
                                    param.hasparam = true;
                                    param.SearchText = "";
                                }
                            }



                            if (name.includes("/") || name.includes("-")) {
                                // Replace '/' with '-' to maintain consistency
                                name = name.replace(/\//g, "-");
                                // Parse the date
                                var parsedDate = new Date(name + " 00:00:00");

                                if (!isNaN(parsedDate.getTime())) {
                                    // If it's a valid date, format it correctly
                                    name = $filter('date')(parsedDate, "yyyy-MM-dd");
                                } else {
                                    // Handle invalid date input
                                    if ($scope.patSearchType === 5) {
                                        alertify.error("Invalid date format: " + name);
                                        name = "";
                                        return false;
                                    }
                                }
                            }

                            if (name && name.length >= 4) {
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

                                param.SearchText = name;
                                param.hasparam = true;
                                param.PhoneNumber = "";
                                param.UserId = eHnoteMasterDataService.getLoginId();

                                var list = [];
                                list.push($scope.HospitalId);
                                param["HospitalIDLst"] = list;
                                var doctorinfoaccess = eHnoteMasterDataService.getUserInfo();
                                eHnoteMasterDataService.addPatientSearchInfo(param);

                                var object = {
                                    "UserId": $scope.UserId,
                                    "HospitalID": $scope.HospitalId,
                                    "HospitalIDLst": param.HospitalIDLst.toString(),
                                    "SearchText": param.SearchText || "",
                                    "SearchTypeID": $scope.patientsearchInd || 0,
                                    "ParentOrganizationId": $scope.ParentHospitalId

                                }
                                eHnotePatientDataService.SearchAllPatientDataNew(object, OnGetopSearchPatientSuccess, OnGetopPatientSearchError, "");
                            }
                        }

                    };

                    function OnGetopSearchPatientSuccess(response) {

                        console.log(response)
                        if (response.count > 0) {
                            $scope.count = response.count;
                            if (response.rows.length > 0) {
                                console.log(response.rows[0]);
                                if ($scope.patientsearchInd == 4 || $scope.patientsearchInd == 2) {

                                    if (response.rows[0].PatientId === $scope.MergeAddReqObj.CurrentPatientId) {
                                        alertify.error("Same patient cannot be merged");
                                        return false;
                                    }

                                    $scope.MergingPatient.PatientId = response.rows[0].PatientId || 0;
                                    $scope.MergingPatient.FullName = response.rows[0].FullName || "";
                                    $scope.MergingPatient.FirstName = response.rows[0].FirstName || "";
                                    $scope.MergingPatient.LastName = response.rows[0].LastName || "";
                                    $scope.MergingPatient.Gender = response.rows[0].Gender || "";
                                    $scope.MergingPatient.DOB = response.rows[0].DOB || "";
                                    $scope.MergingPatient.Age = response.rows[0].Age || "";
                                    $scope.MergingPatient.MobileNo = response.rows[0].PhoneNumber;
                                    $scope.MergingPatient.ContactNo = response.rows[0].AltHomeNumber;
                                    $scope.MergingPatient.EmailId = response.rows[0].EmailID || "";
                                    $scope.MergingPatient.PatientDisplayId = response.rows[0].DisplayID || "";
                                    $scope.MergingPatient.OldMrno = response.rows[0].OldMrno || "";
                                    $scope.MergingPatient.PatientInsuranceDetails = [];
                                    $scope.MergeAddReqObj.MergedPatientId = $scope.MergingPatient.PatientId;
                                    $scope.MergingPatient.CreatedDt = response.rows[0].CreatedDt || "";
                                    $scope.MergingPatient.CreatedBy = response.rows[0].CreatedBy || "";

                                    if (response.rows[0].AltHomeNumber != '') {
                                        var MNumber = response.rows[0].Altareacode + response.rows[0].AltHomeNumber
                                        var obj = eHnoteUserDataService.UsMobileFormatChange(MNumber);
                                        $scope.MergingPatient.MobileNo = obj.UsFormatMobileNumber;
                                    }
                                } else {

                                    $scope.PatientsArray = response.rows || [];
                                    angular.forEach($scope.PatientsArray, function (pitem) {
                                        pitem.S3URL = "";
                                        var array_list = ['#af77c6', '#e4c120', '#69b3e7', '#ed9945', '#90c752'];
                                        var val = array_list[Math.floor(Math.random() * array_list.length)];

                                        pitem.colors = val;
                                        pitem.S3URL = "";
                                    });

                                    $scope.ShowPatientListDrop = true;
                                }
                            }

                        } else {
                            $scope.count = 0;
                            $scope.PatientsArray = [];
                        }
                    }
                    function OnGetopPatientSearchError() {
                        $scope.count = 0;
                        $scope.PatientsArray = [];
                        $scope.PatientSearchobj.SearchText = "";
                    }

                    $scope.SelectedMergepatient = function (patientitem) {
                        console.log(patientitem.PatientId)
                        $scope.SelectedPatientId = patientitem.PatientId;
                        eHnoteAuditServices.getPatientDetailsById($scope.SelectedPatientId, ongetPatientDetailsSuccess, ongetPatientDetailsError);
                        function ongetPatientDetailsSuccess(response) {
                            if (response.Patient && response.Patient.length > 0) {

                                var patientitem = response.Patient[0];
                                if (patientitem != "") {

                                    if (patientitem.PatientID === $scope.MergeAddReqObj.CurrentPatientId) {
                                        alertify.error("Same patient cannot be merged");
                                        return false;
                                    }

                                    $scope.ShowPatientListDrop = false;
                                    $scope.MergingPatient.PatientId = patientitem.PatientID || 0;
                                    $scope.MergingPatient.FullName = patientitem.FullName || "";
                                    $scope.MergingPatient.FirstName = patientitem.FirstName || "";
                                    $scope.MergingPatient.LastName = patientitem.LastName || "";
                                    $scope.MergingPatient.Gender = patientitem.Gender || "";
                                    $scope.MergingPatient.DOB = patientitem.DOB || "";
                                    $scope.MergingPatient.Age = patientitem.Age || "";
                                    $scope.MergingPatient.MobileNo = patientitem.MobileNo;
                                    $scope.MergingPatient.ContactNo = patientitem.PatientHomeNumber;
                                    $scope.MergingPatient.EmailId = patientitem.EmailId || "";
                                    $scope.MergingPatient.PatientDisplayId = patientitem.PatientDisplayId || "";
                                    $scope.MergingPatient.OldMrno = patientitem.OldMrno || "";
                                    $scope.MergingPatient.PatientInsuranceDetails = [];
                                    $scope.MergeAddReqObj.MergedPatientId = $scope.MergingPatient.PatientId;
                                    $scope.MergingPatient.CreatedDt = patientitem.CreatedDt || "";
                                    $scope.MergingPatient.CreatedBy = patientitem.CreatedBy || "";

                                    if (patientitem.PatientHomeNumber != '') {
                                        var MNumber = patientitem.Altareacode + patientitem.PatientHomeNumber
                                        var obj = eHnoteUserDataService.UsMobileFormatChange(MNumber);
                                        $scope.MergingPatient.MobileNo = obj.UsFormatMobileNumber;
                                    }

                                    $scope.PatientsArray = [];
                                } else {
                                    $scope.changeMergePatientSearch();
                                }

                            }
                        }
                        function ongetPatientDetailsError(error) {
                            console.log(error);
                        }

                    };
                    $scope.ChangePatientSearch = function () {
                        $scope.PatientsArray = [];
                        $scope.PatientSearchobj.SearchText = "";
                        $scope.ShowPatientListDrop = false;
                    }

                    $scope.changeMergePatientSearch = function () {

                        $scope.MergingPatient.PatientId = 0;
                        $scope.MergingPatient.FullName = "";
                        $scope.MergingPatient.FirstName = "";
                        $scope.MergingPatient.LastName = "";
                        $scope.MergingPatient.Gender = "";
                        $scope.MergingPatient.DOB = "";
                        $scope.MergingPatient.Age = "";
                        $scope.MergingPatient.MobileNo = "";
                        $scope.MergingPatient.ContactNo = "";
                        $scope.MergingPatient.EmailId = "";
                        $scope.MergingPatient.PatientDisplayId = "";
                        $scope.MergingPatient.OldMrno = "";
                        $scope.MergingPatient.PatientInsuranceDetails = [];
                        $scope.MergeAddReqObj.MergedPatientId = 0;
                        $scope.ShowPatientListDrop = false;
                    };

                    $scope.ClearDetails = function () {
                        $uibModalInstance.close("save");
                    }
                    $scope.GetMasterFaxStatus = function () {
                        eHnotePatientDataService.GetMasterFaxStatus().then(function (resp) {
                            if (resp.data.status === "Success") {
                                $scope.SplitStatusArray = resp.data.FaxStatus;
                            }
                        });
                    }
                    $scope.GetMasterFaxStatus();
                    $scope.saveConnectedPatientDetails = function () {



                        //if ($scope.MergingPatient.PatientId === 0) {
                        //    alertify.error("Please Select a Patient To Connect");
                        //    return false;
                        //}



                        //$scope.selectedPdfUrls = $scope.PdfSplit
                        //    .filter(function (sitem) {
                        //        return sitem.checked;
                        //    })
                        //    .map(function (sitem) {
                        //        return {
                        //            FileUrl: sitem.FileUrl,
                        //            FileName: sitem.FileName,
                        //            PatientId: $scope.MergingPatient.PatientId,
                        //            InBoundTransactionFileId: sitem.InBoundTransactionFileId
                        //        };
                        //    });

                        //if ($scope.selectedPdfUrls.length === 0) {
                        //    alertify.error("Please select at least one PDF to connect.");
                        //    return false;
                        //}
                        //console.log($scope.MergingPatient);


                        var payloadUrls = [];

                        if ($scope.selectedPdfUrls && $scope.selectedPdfUrls.length > 0) {
                            payloadUrls = $scope.selectedPdfUrls.map(function (item) {
                                return {
                                    FileUrl: item.FileUrl,
                                    FileName: item.FileName,
                                    PatientId: $scope.MergingPatient.PatientId,
                                    InBoundTransactionFileId: item.InBoundTransactionFileId || 0,
                                    IsCompleteFile: false,
                                    DeleteInd: 'N',
                                };
                            });
                        }
                        else if ($scope.MainFaxItem && ($scope.MainFaxItem.S3URL || $scope.MainFaxItem.S3Url)) {
                            payloadUrls.push({
                                FileUrl: $scope.MainFaxItem.S3URL || $scope.MainFaxItem.S3Url,
                                FileName: $scope.MainFaxItem.OriginalFileName || 'MainDocument.pdf',
                                PatientId: $scope.MergingPatient.PatientId,
                                InBoundTransactionFileId: 0,
                                IsCompleteFile: true,
                                DeleteInd: 'N',
                            });
                        } else {
                            payloadUrls.push({
                                FileUrl: item.FileUrl,
                                FileName: $scope.MainFaxItem.OriginalFileName || 'MainDocument.pdf',
                                PatientId: $scope.MergingPatient.PatientId,
                                InBoundTransactionFileId: 0,
                                IsCompleteFile: true,
                                DeleteInd: 'N',
                            });
                        }
                        var selectedUserIds = $scope.UsersList
                            .filter(u => u.isChecked)
                            .map(u => u.DoctorID);

                        var userAssignments = selectedUserIds.map(function (userId) {
                            return {
                                InBoundTransactionFileId: userId.InBoundTransactionFileId,
                                UserInboundTransactionId: 0,
                                InboundTransactionId: $scope.MainFaxItem.InBoundTransactionId,
                                PatientId: $scope.MergingPatient.PatientId,
                                AssignedUserId: userId,
                                OrganizationId: $scope.MainFaxItem.OrganizationId,
                                DeleteInd: 'N',
                                UserId: $scope.UserId
                            };
                        });
                        var hasPatient = $scope.MergingPatient.PatientId && $scope.MergingPatient.PatientId !== 0;
                        var hasUserAssignments = userAssignments.length > 0;
                        var isDone = $scope.statusSelection === 'Done';
                        var isAcknowledged = $scope.statusSelection === 'Acknowledged';
                        var hasCompleteFile = payloadUrls.some(file => file.IsCompleteFile === true);
                        //var splitStatus = "Unassign";
                        //if (isDone) {
                        //    splitStatus = "Done";
                        //} else if (isAcknowledged) {
                        //    splitStatus = "Acknowledged";
                        //} else if (hasPatient || hasUserAssignments) {
                        //    splitStatus = "Action Required";
                        //}
                        var splitStatus = "New";
                        if (isDone) {
                            splitStatus = "Done";
                        } else if (isAcknowledged) {
                            splitStatus = "Acknowledged";
                        } else if (hasCompleteFile && hasUserAssignments) {
                            splitStatus = "Forwarded";
                        } else if (hasPatient || hasUserAssignments) {
                            splitStatus = "Action Required";
                        }
                        // Dynamically match from SplitStatusArray
                        var matchedStatus = ($scope.SplitStatusArray || []).find(function (item) {
                            return (item.FaxStatusName || '').toLowerCase().trim() === splitStatus.toLowerCase();
                        });

                        var splitStatusId = matchedStatus ? matchedStatus.FaxStatusId : null;
                        var splitStatusName = matchedStatus ? matchedStatus.FaxStatusName : splitStatus;
                        var object = {
                            "OrganizationId": $scope.MainFaxItem.OrganizationId,
                            "UserId": $scope.UserId,
                            "InBoundTransactionId": $scope.MainFaxItem.InBoundTransactionId,
                            "PatientId": $scope.MergingPatient.PatientId,
                            "PatientConnectedRemarks": $scope.MergeAddReqObj.MergeRemarks,
                            "PatientName": $scope.MergingPatient.FullName || '',
                            "SplitStatus": splitStatusName,
                            "SplitStatusId": splitStatusId,
                            "IsDeletedWhenSplitFile": $scope.IsDeletedWhenSplitFile,
                            "faxOption": $scope.faxOption,
                        };

                        if (payloadUrls.length > 0) {
                            object.selectedPdfUrls = payloadUrls;
                        }
                        if (userAssignments .length>0) {
                            object.ConnectedUser= userAssignments
                        }
                        eHnotePatientDataService.UpdatePatientToIncomingFax(object).then(function (resp) {

                            if (resp.data[0].Status) {
                                alertify.success("saved successfully");
                                $scope.UsersList.forEach(function (user) {
                                    user.isChecked = false;
                                    user.selected = false;
                                });
                                item.SplitStatus = object.SplitStatus;
                                $scope.SplitStatus = object.SplitStatus;
                                $scope.SplitStatusId = object.SplitStatusId;
                                $scope.MergeAddReqObj.MergeRemarks = "";
                                $scope.searchtxtb.txt1 = "";
                                $scope.AllDoctorsObj.AllDoctorCheck = false;
                                $scope.clearSearchDetails();
                                //  $scope.markAsDone();
                                $scope.onStatusChange();
                                // $uibModalInstance.dismiss("cancel");
                                $scope.mInstanceAdd.dismiss("cancel");
                            }

                        }, function (err) {
                            console.log(err);
                        });


                    }
                    $scope.Splitstatuschange = function (statusName) {
                        var matchedStatus = ($scope.SplitStatusArray || []).find(function (status) {
                            return (status.FaxStatusName || '').toLowerCase().trim() === statusName.toLowerCase();
                        });

                        var statusId = matchedStatus ? matchedStatus.FaxStatusId : statusName;

                        var object = {
                            "SplitStatus": statusName,
                            "SplitStatusId": statusId,
                            "InBoundTransactionId": $scope.MainFaxItem.InBoundTransactionId,
                        };
                        eHnotePatientDataService.AddUpdateSplitStatus(object).then(function (resp) {
                            if (resp.data.Status = "Success") {
                                $scope.SplitStatus = statusName;
                            }
                        });
                    }
                    $scope.GetSplitFaxFiles = function () {
                        var object = {
                            "InBoundTransactionId": $scope.MainFaxItem.InBoundTransactionId
                        }
                        eHnotePatientDataService.GetSplitFaxFiles(object).then(function (resp) {
                            if (resp.data.Status = "Success") {
                                $scope.SplitFAxData = angular.copy(resp.data.rows[0]);
                                $scope.SplitFAxFiles = $scope.SplitFAxData.FilesArray;
                            }
                        });
                    }
                    //if (item.IsAttachmentSplitDone === false) {
                    //    var object = {
                    //        "UserId": $scope.UserId,
                    //        "S3URL": item.S3URL,
                    //        "InBoundTransactionId": $scope.MainFaxItem.InBoundTransactionId,
                    //        "PatientId": $scope.MergingPatient.PatientId,
                    //        "OrganizationId": item.OrganizationId,
                    //        "FileName": "",
                    //        "IsDeletedWhenSplitFile": false,

                    //    }
                    //    eHnotePatientDataService.AddUpdatesplitfaxfiles(object).then(function (resp) {
                    //        $scope.PdfSplit = [];
                    //        if (resp.data.Status === "Success") {
                    //            $scope.GetSplitFaxFiles();
                    //        }
                    //    });
                    //} else {
                    //    $scope.GetSplitFaxFiles();
                    //}

                    $scope.selectedViewer = 'split';
                    //$scope.getsplittrustedurl = function (url) {
                    //    var encodedUrl = encodeURIComponent(url);
                    //    var modifiedUrl = 'https://docs.google.com/gview?embedded=true&url=' + encodedUrl + "#pagemode=none&zoom=66";
                    //    return $sce.trustAsResourceUrl(modifiedUrl);
                    //};
                    //$scope.previewPdf = function (url) {
                    //    $scope.SelectedPdfUrl = url;
                    //    $scope.SelectedPdfName = url ? url.split('/').pop() : 'No file selected';
                    //};
                    //$scope.toggleCheck = function (item) {
                    //    item.checked = !item.checked;
                    //    if (item.checked) {
                    //        $scope.SelectedPdfUrl = item.FileUrl;
                    //        $scope.SelectedPdfName = item.FileUrl.split('/').pop();
                    //    } else {
                    //        const anyChecked = $scope.PdfSplit.some(pdf => pdf.checked);
                    //        if (!anyChecked) {
                    //            $scope.SelectedPdfUrl = null;
                    //            $scope.SelectedPdfName = 'No file selected';
                    //        }
                    //    }
                    //};
                    $scope.focusPatientSearchInput = function () {
                        $timeout(function () {
                            const inputElement = document.getElementById('single-button');
                            if (inputElement) {
                                inputElement.focus();
                            }
                        }, 100);
                    };

                    $scope.thumbnails = [];
                    $scope.selectedPages = [];
                    $scope.renderedPages = [];
                    $scope.visiblePages = [];
                    $scope.pdfDoc = null;

                    $timeout(function () {
                        $scope.loadPDF();
                    }, 0);
                    /* Load PDF and thumbnails*/
                    $scope.loadPDF = function () {
                        if (item.UserInboundTransactionId) {
                            const url = item.FileUrl;
                            /* const url = "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf";*/
                            $scope.pdfDoc = null;
                            $scope.thumbnails = [];
                            $scope.renderedPages = [];
                            $scope.selectedPages = [];
                            $scope.visiblePages = [];
                            pdfjsLib.getDocument({
                                url: url,
                                withCredentials: false
                            }).promise.then(function (pdfDoc_) {
                                $scope.pdfDoc = pdfDoc_;

                                const totalPages = pdfDoc_.numPages;

                                // Fill renderedPages and load thumbnails
                                for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
                                    $scope.renderedPages.push({ pageNum });
                                    renderThumbnail(pageNum);
                                }

                                // Initially show all pages
                                $scope.visiblePages = Array.from({ length: totalPages }, (_, i) => i + 1);
                                // Render each page into canvas (after DOM updates)
                                $timeout(() => {
                                    $scope.visiblePages.forEach(renderFullPage);
                                }, 100);
                                $scope.$applyAsync();
                            }).catch(err => {
                                console.error("Error loading PDF:", err);
                            });
                        } else {
                            const url = $scope.MainFaxItem.S3URL || $scope.MainFaxItem.S3Url;
                            /* const url = "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf";*/
                            $scope.pdfDoc = null;
                            $scope.thumbnails = [];
                            $scope.renderedPages = [];
                            $scope.selectedPages = [];
                            $scope.visiblePages = [];
                            pdfjsLib.getDocument({
                                url: url,
                                withCredentials: false
                            }).promise.then(function (pdfDoc_) {
                                $scope.pdfDoc = pdfDoc_;

                                const totalPages = pdfDoc_.numPages;

                                // Fill renderedPages and load thumbnails
                                for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
                                    $scope.renderedPages.push({ pageNum });
                                    renderThumbnail(pageNum);
                                }

                                // Initially show all pages
                                $scope.visiblePages = Array.from({ length: totalPages }, (_, i) => i + 1);
                                // Render each page into canvas (after DOM updates)
                                $timeout(() => {
                                    $scope.visiblePages.forEach(renderFullPage);
                                }, 100);
                                $scope.$applyAsync();
                            }).catch(err => {
                                console.error("Error loading PDF:", err);
                            });
                        };
                        /* Generate thumbnail for sidebar*/


                    }
                    function renderThumbnail(pageNum) {
                        $rootScope.$broadcast("loader_show");
                        if ($scope.thumbnails.some(t => t.page === pageNum)) return;

                        $scope.pdfDoc.getPage(pageNum).then(function (page) {
                            const scale = 1.0;
                            const viewport = page.getViewport({ scale });

                            const canvas = document.createElement('canvas');
                            const context = canvas.getContext('2d');
                            canvas.width = viewport.width;
                            canvas.height = viewport.height;

                            page.render({ canvasContext: context, viewport }).promise.then(() => {
                                const imageData = canvas.toDataURL("image/jpeg", 0.7);

                                const { jsPDF } = window.jspdf;
                                const pdf = new jsPDF({
                                    orientation: viewport.width > viewport.height ? 'landscape' : 'portrait',
                                    unit: "pt",
                                    format: [viewport.width, viewport.height]
                                });

                                // embed image into new PDF
                                pdf.addImage(imageData, 'JPEG', 0, 0, viewport.width, viewport.height, undefined, 'FAST');

                                const arrayBuffer = pdf.output("arraybuffer");
                                const uint8Array = new Uint8Array(arrayBuffer);
                                const binary = Array.from(uint8Array).map(b => String.fromCharCode(b)).join('');
                                const base64 = btoa(binary);

                                const thumb = {
                                    page: pageNum,
                                    selected: false,
                                    image: imageData,
                                    FileName: `page-${pageNum}.pdf`,
                                    FileUrl: `data:application/pdf;base64,${base64}`,
                                    pdfData: base64
                                };

                                $scope.$apply(() => {
                                    $scope.thumbnails.push(thumb);
                                });
                                //    $rootScope.$broadcast("loader_hide");
                            });
                        });
                    }
                    $scope.openAllUsersDropdown = function () {
                        $timeout(function () {
                            var input = document.getElementById('allUsersSearchInput');
                            if (input) {
                                input.focus();
                            }
                        }, 100); // wait for dropdown to render
                    };

                    //function uploadBase64ToS3(thumbObj) {
                    //    if (!thumbObj || !thumbObj.pdfData || thumbObj.uploaded) return;

                    //    if (!thumbObj.FileName) {
                    //        thumbObj.FileName = `page-${thumbObj.page}-${generateGUID()}.pdf`;
                    //    }

                    //    const payload = {
                    //        FileName: thumbObj.FileName,
                    //        Base64Data: thumbObj.pdfData
                    //    };

                    //    return eHnotePatientDataService.UploadBase64ToS3(payload).then(function (resp) {
                    //        if (resp.data.Status === "Success") {
                    //            thumbObj.FileUrl = resp.data.FileUrl;
                    //            thumbObj.uploaded = true;
                    //            console.log(`Uploaded Page ${thumbObj.page}, S3 URL:`, thumbObj.FileUrl);
                    //        }
                    //    }).catch(function (err) {
                    //        console.error("Upload failed:", err);
                    //    });
                    //}

                    $scope.selectedPdfUrls = [];

                    //$scope.selectedAll = true;

                    $scope.toggleSelectAll = function () {
                        $timeout(function () {
                            const newState = $scope.selectedAll;

                            $scope.selectedPdfUrls = [];
                            $scope.selectedPages = [];

                            angular.forEach($scope.thumbnails, function (thumb) {
                                thumb.selected = newState;

                                if (newState) {
                                    $scope.selectedPdfUrls.push(thumb);
                                    $scope.selectedPages.push(thumb.page);
                                }
                            });
                            $scope.selectedCount = $scope.selectedPages.length;
                            updateVisiblePages();
                        }, 0);
                    };

                    //$scope.PrintAllFax = function () {
                    //    if ($scope.selectedPdfUrls.length == 0) {
                    //        var url = $scope.MainFaxItem.S3URL;
                    //        window.open(url);

                    //    }
                    //}


                    $scope.PrintAllFax = async function () {
                        if (item.UserInboundTransactionId) {
                            if (!$scope.selectedPdfUrls || $scope.selectedPdfUrls.length === 0) {
                                try {
                                    const url = item.FileUrl;
                                    const response = await fetch(url);
                                    const arrayBuffer = await response.arrayBuffer();

                                    const { PDFDocument, StandardFonts, rgb } = window.PDFLib;
                                    const pdfDoc = await PDFDocument.load(arrayBuffer);
                                    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

                                    const now = new Date();
                                    const pad = (n) => n.toString().padStart(2, '0');
                                    const formattedDate = `${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${now.getFullYear()}`;
                                    const hours = now.getHours();
                                    const formattedTime = `${pad(hours % 12 || 12)}:${pad(now.getMinutes())}${hours >= 12 ? ':PM' : ':AM'}`;

                                    const printedBy = $scope.LoggedUserName || '';
                                    const footer = `Printed by : ${printedBy} ${formattedDate} ${formattedTime}`;

                                    const pages = pdfDoc.getPages();
                                    pages.forEach(page => {
                                        const { width } = page.getSize();
                                        page.drawText(footer, {
                                            x: width - font.widthOfTextAtSize(footer, 10) - 20,
                                            y: 10,
                                            size: 10,
                                            font: font,
                                            color: rgb(0, 0, 0),
                                        });
                                    });

                                    const pdfBytes = await pdfDoc.save();
                                    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                                    const blobUrl = URL.createObjectURL(blob);

                                    // Open in new window and print
                                    const printWindow = window.open('', '_blank');
                                    if (printWindow) {
                                        printWindow.document.write(`
                                   <html>
                                   <head><title>Print PDF</title></head>
                                   <body style="margin:0">
                                       <iframe id="pdfFrame" src="${blobUrl}" style="width:100%; height:100vh; border:none;"></iframe>
                                       <script>
                                           const iframe = document.getElementById('pdfFrame');
                                           iframe.onload = function () {
                                               iframe.contentWindow.print();
                                           };
                                       </script>
                                   </body>
                                   </html>
                               `);
                                        printWindow.document.close();
                                    } else {
                                        alert("Popup blocked! Please allow popups for this site.");
                                    }

                                } catch (err) {
                                    alertify.error("Failed to fetch or print the PDF.");
                                    console.error(err);
                                }
                            }
                        } else {
                            if (!$scope.selectedPdfUrls || $scope.selectedPdfUrls.length === 0) {
                                try {
                                    const url = $scope.MainFaxItem.S3URL || $scope.MainFaxItem.S3Url
                                    const response = await fetch(url);
                                    const arrayBuffer = await response.arrayBuffer();

                                    const { PDFDocument, StandardFonts, rgb } = window.PDFLib;
                                    const pdfDoc = await PDFDocument.load(arrayBuffer);
                                    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

                                    const now = new Date();
                                    const pad = (n) => n.toString().padStart(2, '0');
                                    const formattedDate = `${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${now.getFullYear()}`;
                                    const hours = now.getHours();
                                    const formattedTime = `${pad(hours % 12 || 12)}:${pad(now.getMinutes())}${hours >= 12 ? ':PM' : ':AM'}`;

                                    const printedBy = $scope.LoggedUserName || '';
                                    const footer = `Printed by : ${printedBy} ${formattedDate} ${formattedTime}`;

                                    const pages = pdfDoc.getPages();
                                    pages.forEach(page => {
                                        const { width } = page.getSize();
                                        page.drawText(footer, {
                                            x: width - font.widthOfTextAtSize(footer, 10) - 20,
                                            y: 10,
                                            size: 10,
                                            font: font,
                                            color: rgb(0, 0, 0),
                                        });
                                    });

                                    const pdfBytes = await pdfDoc.save();
                                    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                                    const blobUrl = URL.createObjectURL(blob);

                                    // Open in new window and print
                                    const printWindow = window.open('', '_blank');
                                    if (printWindow) {
                                        printWindow.document.write(`
                                   <html>
                                   <head><title>Print PDF</title></head>
                                   <body style="margin:0">
                                       <iframe id="pdfFrame" src="${blobUrl}" style="width:100%; height:100vh; border:none;"></iframe>
                                       <script>
                                           const iframe = document.getElementById('pdfFrame');
                                           iframe.onload = function () {
                                               iframe.contentWindow.print();
                                           };
                                       </script>
                                   </body>
                                   </html>
                               `);
                                        printWindow.document.close();
                                    } else {
                                        alert("Popup blocked! Please allow popups for this site.");
                                    }

                                } catch (err) {
                                    alertify.error("Failed to fetch or print the PDF.");
                                    console.error(err);
                                }
                            }
                        }
                    };
                    $scope.SplitPrint = async function () {
                        const selectedPages = $scope.selectedPdfUrls.filter(p => p.selected);

                        if (selectedPages.length === 0) {
                            alertify.error("Please select at least one PDF to print.");
                            return false;
                        }
                        //Showing Loader
                        $rootScope.$broadcast("loader_show");
                        $("#maineHnoteLoader").show();
                        $scope.maineHnoteLoader = true;
                        $rootScope.mainsubeHnoteLoader = true;

                        setTimeout(async () => {
                            try {
                                const { PDFDocument, StandardFonts, rgb } = window.PDFLib;
                                const mergedPdf = await PDFDocument.create();
                                const font = await mergedPdf.embedFont(StandardFonts.Helvetica);

                                // Generate footer text
                                const now = new Date();
                                const pad = (n) => n.toString().padStart(2, '0');
                                const formattedDate = `${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${now.getFullYear()}`;
                                const hours = now.getHours();
                                const formattedTime = `${pad(hours % 12 || 12)}:${pad(now.getMinutes())}${hours >= 12 ? ':PM' : ':AM'}`;

                                const printedBy = $scope.LoggedUserName || '';
                                const footerText = `Printed by : ${printedBy} ${formattedDate} ${formattedTime}`;

                                for (const page of selectedPages) {
                                    if (page.FileUrl && page.FileUrl.startsWith("data:application/pdf;base64,")) {
                                        const base64 = page.FileUrl.split(',')[1];
                                        const byteArray = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
                                        const loadedPdf = await PDFDocument.load(byteArray);
                                        const copiedPages = await mergedPdf.copyPages(loadedPdf, loadedPdf.getPageIndices());

                                        copiedPages.forEach(p => {
                                            const { width } = p.getSize();

                                            // Draw footer on each page
                                            p.drawText(footerText, {
                                                x: width - font.widthOfTextAtSize(footerText, 10) - 20,
                                                y: 10,
                                                size: 10,
                                                font: font,
                                                color: rgb(0, 0, 0),
                                            });

                                            mergedPdf.addPage(p);
                                        });
                                    }
                                }

                                const mergedBytes = await mergedPdf.save();
                                const blob = new Blob([mergedBytes], { type: 'application/pdf' });
                                const blobUrl = URL.createObjectURL(blob);

                                //  Open merged PDF and auto-trigger print
                                const printWindow = window.open('', '_blank');
                                if (printWindow) {
                                    printWindow.document.write(`
                                   <html>
                                   <head><title>Print PDF</title></head>
                                   <body style="margin:0">
                                       <iframe id="pdfFrame" src="${blobUrl}" style="width:100%; height:100vh; border:none;"></iframe>
                                       <script>
                                           const iframe = document.getElementById('pdfFrame');
                                           iframe.onload = function () {
                                               iframe.contentWindow.print();
                                           };
                                       </script>
                                   </body>
                                   </html>
                               `);
                                    printWindow.document.close();
                                } else {
                                    alert("Popup blocked! Please allow popups for this site.");
                                }

                            } catch (error) {
                                console.error("Error preparing PDF:", error);
                                alertify.error("Failed to process the PDF.");
                            } finally {
                                //  Hide loader
                                $rootScope.$broadcast("loader_hide");
                                $("#maineHnoteLoader").hide();
                                $scope.maineHnoteLoader = false;
                                $rootScope.mainsubeHnoteLoader = false;
                            }
                        }, 1000); // 1 second delay

                    };


                    $scope.toggleSelect = function (thumb) {
                        if (thumb.selected) {
                            const exists = $scope.selectedPdfUrls.some(p => p.page === thumb.page);
                            if (!exists) {
                                $scope.selectedPdfUrls.push(thumb);
                            }

                            if (!$scope.selectedPages.includes(thumb.page)) {
                                $scope.selectedPages.push(thumb.page);
                            }
                        } else {
                            $scope.selectedPages = $scope.selectedPages.filter(p => p !== thumb.page);
                            $scope.selectedPdfUrls = $scope.selectedPdfUrls.filter(p => p.page !== thumb.page);
                        }
                        $scope.selectedAll = $scope.thumbnails.length > 0 && $scope.thumbnails.every(t => t.selected);
                        $scope.selectedCount = $scope.selectedPages.length;
                        /*uploadbase64tos3(thumb);*/
                        updateVisiblePages();
                    };

                    /*Update visiblePages (used in ng-repeat for canvas)*/
                    function updateVisiblePages() {
                        if ($scope.selectedPages.length === 0) {
                            $scope.visiblePages = $scope.renderedPages.map(p => p.pageNum);
                        } else {
                            $scope.visiblePages = [...$scope.selectedPages].sort((a, b) => a - b);
                        }

                        $timeout(function () {
                            $scope.visiblePages.forEach(renderFullPage);
                        });
                    }

                    /* Render a full page into canvas*/
                    //function renderFullPage(pageNum) {
                    //    $scope.pdfDoc.getPage(pageNum).then(function (page) {
                    //        const scale = 1.5;
                    //        const viewport = page.getViewport({ scale });

                    //        const canvasId = 'canvas-page-' + pageNum;

                    //        $timeout(function () {
                    //            const canvas = document.getElementById(canvasId);
                    //            if (!canvas) {
                    //                console.warn('Canvas not found for page:', pageNum);
                    //                return;
                    //            }

                    //            const context = canvas.getContext('2d');
                    //            canvas.width = viewport.width;
                    //            canvas.height = viewport.height;

                    //            page.render({ canvasContext: context, viewport }).promise.then(() => {
                    //                console.log('Rendered visible page', pageNum);
                    //            });
                    //        }, 50);
                    //    });
                    //}
                    function renderFullPage(pageNum) {
                        if (!$scope.pdfDoc) {
                            console.warn('PDF document not loaded yet.');
                            //$rootScope.$broadcast("loader_hide");
                            return;
                        }

                        $scope.pdfDoc.getPage(pageNum).then(function (page) {
                            var scale = 1.5;
                            //var viewport = page.getViewport({ scale: scale });
                            var rotation = $scope.pageRotations[pageNum] || 0;
                            var viewport = page.getViewport({ scale: scale, rotation: rotation });

                            var canvasId = 'canvas-page-' + pageNum;

                            $timeout(function () {
                                var canvas = document.getElementById(canvasId);
                                if (!canvas) {
                                    console.warn('Canvas not found for page:', pageNum);
                                    //$rootScope.$broadcast("loader_hide");
                                    return;
                                }

                                var context = canvas.getContext('2d');
                                canvas.width = viewport.width;
                                canvas.height = viewport.height;

                                // Use renderTasks map to avoid overlapping renders
                                if (!$scope.renderTasks) {
                                    $scope.renderTasks = {};
                                }

                                // If there's an ongoing render, cancel it
                                var oldRenderTask = $scope.renderTasks[pageNum];
                                if (oldRenderTask && typeof oldRenderTask.cancel === 'function') {
                                    try {
                                        oldRenderTask.cancel();
                                    } catch (e) {
                                        console.warn('Could not cancel render task:', e);
                                        /* $rootScope.$broadcast("loader_hide");*/
                                    }
                                }

                                var renderContext = {
                                    canvasContext: context,
                                    viewport: viewport
                                };

                                var renderTask = page.render(renderContext);
                                $scope.renderTasks[pageNum] = renderTask;

                                renderTask.promise.then(function () {
                                    delete $scope.renderTasks[pageNum];
                                    console.log('Successfully rendered page:', pageNum);
                                }).catch(function (err) {
                                    if (err && err.name !== 'RenderingCancelledException') {
                                        console.error('Error rendering page', pageNum, err);
                                        /*$rootScope.$broadcast("loader_hide");*/
                                    }
                                });
                            }, 0); // Use 0 delay to ensure canvas is ready
                            $rootScope.$broadcast("loader_hide");
                        }).catch(function (error) {
                            console.error('Failed to get page', pageNum, error);
                            $rootScope.$broadcast("loader_hide");
                        });
                    }
                    $scope.pageRotations = {};

                    $scope.rotateCurrentVisiblePage = function () {
                        const container = document.getElementById("container1");
                        const canvases = container.querySelectorAll("canvas");

                        let bestPage = null;
                        let maxVisibleArea = 0;

                        canvases.forEach(canvas => {
                            const rect = canvas.getBoundingClientRect();
                            const containerRect = container.getBoundingClientRect();

                            const visibleHeight = Math.min(rect.bottom, containerRect.bottom) - Math.max(rect.top, containerRect.top);
                            const visibleArea = Math.max(0, visibleHeight) * rect.width;

                            if (visibleArea > maxVisibleArea) {
                                maxVisibleArea = visibleArea;
                                bestPage = canvas;
                            }
                        });

                        if (!bestPage) {
                            alert("No visible page to rotate.");
                            return;
                        }

                        const pageNum = parseInt(bestPage.id.replace("canvas-page-", ""));
                        $scope.pageRotations[pageNum] = ($scope.pageRotations[pageNum] || 0) + 90;
                        if ($scope.pageRotations[pageNum] >= 360) {
                            $scope.pageRotations[pageNum] = 0;
                        }

                        renderFullPage(pageNum);
                    };

                    $scope.rotateAllPages = function () {
                        if (!$scope.visiblePages || $scope.visiblePages.length === 0) {
                            alert("No pages to rotate.");
                            return;
                        }

                        $scope.visiblePages.forEach(function (pageNum) {
                            $scope.pageRotations[pageNum] = ($scope.pageRotations[pageNum] || 0) + 90;
                            if ($scope.pageRotations[pageNum] >= 360) {
                                $scope.pageRotations[pageNum] = 0;
                            }

                            renderFullPage(pageNum);
                        });
                    };
                    /* Scroll when thumbnail clicked*/
                    $scope.scrollToPage = function (pageNum) {
                        const el = document.getElementById('pdf-page-' + pageNum);
                        if (el) {
                            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    };

                    //$scope.statusSelection = false;
                    //$scope.markAsDone = function () {
                    //    $scope.statusSelection = !$scope.statusSelection;
                    //};
                    //$scope.statusSelection = false;
                    //$scope.ChangeAcknowledgedStatus = function () {
                    //    $scope.statusSelection = !$scope.statusSelection;
                    //};
                    $scope.onStatusChange = function (item) {
                        if (item === 'Done') {
                            console.log('User selected: Done');
                            $scope.statusSelection = 'Done';
                        } else if (item === 'Acknowledged') {
                            console.log('User selected: Acknowledged');
                            $scope.statusSelection = 'Acknowledged';
                        }
                    };
                    $scope.IsDeletedWhenSplitFile = false;
                    $scope.DeleteSplitfile = function(){
                        $scope.IsDeletedWhenSplitFile = !$scope.IsDeletedWhenSplitFile;
                    }
                    $scope.faxOption = 'All';
                    $scope.faxOptionchange = function (value) {
                        $scope.faxOption = value;
                    };
                    $scope.docstatuspopup = function () {
                        $scope.mInstanceAdd = $uibModal.open({
                            templateUrl: 'docstatuspopup.html',
                            size: 'md',
                            backdrop: 'static',
                            keyboard: false,
                            scope: $scope,
                            windowClass: 'modal__width--45',
                            controller: function ($scope, $uibModalInstance) {
                                $scope.faxOption = 'All';

                                $scope.showFirstView = $scope.selectedPdfUrls && $scope.selectedPdfUrls.length > 0;
                                $scope.userHasInteracted = false;

                                $scope.$watch('selectedPdfUrls.length', function (newVal) {
                                    if (!$scope.userHasInteracted) {
                                        $scope.showFirstView = newVal > 0;
                                    }
                                });

                                $scope.proceedToNext = function () {
                                    $scope.showFirstView = false;
                                    $scope.userHasInteracted = true;
                                };
                                $scope.statusSelection = '';
                                $scope.uibclose = function () {
                                    $scope.MergeAddReqObj.MergeRemarks = '';
                                    $scope.searchtxtb.txt1 = '';
                                    $scope.AllDoctorsObj.AllDoctorCheck = false;
                                    $scope.clearSearchDetails();
                                    $scope.statusSelection='';
                                    // $scope.markAsDone();
                                    $scope.onStatusChange();
                                    $scope.UsersList.forEach(function (user) {
                                        user.isChecked = false;
                                    });
                                    $scope.selectedDoctors = null;
                                    $timeout(function () {
                                        $uibModalInstance.dismiss('cancel');
                                    }, 50);
                                };
                            }
                        });
                    };
                }
            });
            $scope.mInstanceAddC.result.then(function (resp) {
                console.log(resp);
                $scope.filterInboundFaxes(() => {
                    $timeout(function () {
                        scrollToSelectedFax();
                        $scope.scrollToSelectedRow();
                    }, 200);
                });
                $scope.scrollToSelectedRow();
                if (item.SplitStatus === 'New') {
                    $scope.Splitstatuschange(item,'Pending');
                }
            }, function (cancel) {
                console.log("connect refresh");
                $scope.filterInboundFaxes(() => {
                    $timeout(function () {
                        scrollToSelectedFax();
                        $scope.scrollToSelectedRow();
                    }, 200);
                });
                if (item.SplitStatus === 'New') {
                    $scope.Splitstatuschange(item,'Pending');
                }
            });


        }
        function scrollToSelectedFax() {
            $timeout(function () {
                const selectedRow = document.querySelector('[data-fax-id="' + $scope.selectedRowId + '"]');
                if (selectedRow) {
                    selectedRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 300);
        }
        $scope.scrollToSelectedRow = function () {
            $timeout(function () {
                const el = document.getElementById('faxRow_' + $scope.selectedFaxItemId);
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
        };


        //$scope.SelectedObj = {
        //    FaxNotificationObj: {
        //        TotalCount: 0
        //    }
        //};

        $scope.FetchUnreadRowsAndMarkAsRead = function () {
            var params = {
                "OrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                "UserId": eHnoteMasterDataService.getLoginId(),
                "PatientId": $scope.SelectedPatientId || 0,
            }
            eHnoteDiagnosisDataServices.FetchUnreadRowsAndMarkAsRead(params).then(function (response) {
                console.log(response.data)
                if (response.data.Status == "Success") {
                    $scope.SelectedObj = $scope.SelectedObj || {};
                    $scope.SelectedObj.FaxNotificationObj = $scope.SelectedObj.FaxNotificationObj || {};
                    $scope.SelectedObj.FaxNotificationObj.TotalCount = response.data.Count || 0;
                }
            });
        };
        $scope.FetchUnreadRowsAndMarkAsRead();
        $scope.UpdateIsReadData = function (item) {
            $scope.SetLastOpenedFax(item.InBoundTransactionId);
            var params = {
                "OrganizationId": item.OrganizationId,
                "UserId": eHnoteMasterDataService.getLoginId(),
                "InBoundTransactionId": item.InBoundTransactionId
            }
            eHnotePatientDataService.UpdateIsReadInBoundFaxTransactions(params).then(function (resp) {
                if (resp.data.Status == "Success") {

                    $scope.filterInboundFaxes();
                    $scope.FetchUnreadRowsAndMarkAsRead();
                    $timeout(function () {
                        var cache = eHnoteCacheStorageService.getCacheStorage();
                        var faxId = cache.lastOpenedFaxId;
                        $scope.lastOpenedFaxId = faxId
                        console.log(faxId)
                        if (faxId) {
                            var element = document.getElementById('fax-' + faxId);
                            console.log(element)
                            if (element) {
                                //element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                // element.classList.add('highlight');

                                // Optional: Remove highlight and clear storage
                                $timeout(function () {
                                    // element.classList.remove('highlight');
                                    localStorage.removeItem("lastOpenedFaxId");
                                }, 300);
                            }
                        }
                    }, 300);
                }
                else {
                    alertify.error("Failed")
                }

            })

        }
        $scope.FetchUnreadRowsAndMarkAsRead();
        $scope.filterPopover = {
            templateUrl: 'patientDoc.html',
        };

        $scope.FaxAssignToUser = function (item) {
            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "Assignview.html",
                //"size": "lg",
                "backdrop": "static",
                "keyboard": false,
                "scope": $scope,
                "windowClass": "modal__eighty-- in",
                "resolve": {
                    "UsersList": function () { return $scope.clinicDoctorList; },
                    "item": function () { return item; },
                },
                "controller": function ($scope, $uibModalInstance, eHnoteMasterDataService, UsersList, item) {


                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                    $scope.GetSplitPdfPageData = function () {
                        var object = {
                            "InBoundTransactionId":item.InBoundTransactionId
                        };
                        eHnotePatientDataService.GetSplitPdfPageData(object).then(function (resp) {
                            if (resp.data.Status === "Success") {
                                var combinedList = [];

                                angular.forEach(resp.data.rows, function (patient) {
                                    if (patient.selectedPdfUrls && patient.selectedPdfUrls.length > 0) {
                                        patient.selectedPdfUrls.forEach(function (pdf) {
                                            pdf.PatientFirstName = pdf.FirstName;
                                            pdf.PatientLastName = pdf.LastName;
                                            pdf.PatientDisplayId = pdf.PatientDisplayId;
                                            pdf.SplitStatus = pdf.SplitStatus;

                                            combinedList.push(pdf);
                                        });
                                    }
                                });

                                $scope.Splitpdfpagedata = combinedList;
                                $scope.AssignedUserPatients = ($scope.Splitpdfpagedata || []).filter(function (item) {
                                    return item.ConnectedUsers && item.ConnectedUsers.length > 0;
                                });
                                if ($scope.AssignedUserPatients.length > 0) {
                                    $scope.selectedRow = $scope.AssignedUserPatients[0];

                                    $timeout(function () {
                                        const activeRow = document.querySelector('tr.row-active');
                                        if (activeRow) {
                                            activeRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                        }
                                    }, 300);
                                }
                            }
                        });
                    };

                    $scope.GetSplitPdfPageData();
                    $scope.selectRow = function (item) {
                        $scope.selectedRow = item;

                        $timeout(function () {
                            const activeRow = document.querySelector('tr.row-active');
                            if (activeRow) {
                                activeRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }
                        }, 200);
                    };

                    $scope.Userfileviewattachment = function (item) {
                        $scope.selectedRow = item;
                        var url = item.FileUrl;
                        window.open(url);
                    }

                }

            });
            $scope.mInstanceAdd.result.then(function (resp) {


            }, function (cancel) {
            });
        }

        $scope.FaxAssignToUserviewpopup = function (item) {
            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "Assignview.html",
                "backdrop": "static",
                "keyboard": false,
                //"size": "lg",
                "windowClass": "modal__ninety-- in",
                "resolve": {
                    "UsersList": function () { return $scope.clinicDoctorList; },
                    "item": function () { return item; },
                },
                "controller": function ($scope, $uibModalInstance, eHnoteMasterDataService, UsersList, item) {


                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };

                    item = item || "";
                    $scope.stopClosingDropDown = function (event) {
                        event.stopPropagation();
                    }

                    var obj = {
                        "InboundTransactionId": item.InBoundTransactionId,
                        "OrganizationId": item.OrganizationId
                    }
                    eHnotePatientDataService.GetInboundTransactionConnectedUsers(obj).then(function (resp) {
                        if (resp.data.status === "Success") {
                            $scope.InboundConnectedUsers = [];
                            $scope.InboundConnectedUsers = resp.data.rows

                        } else {
                            alertify.error("Failed");
                        }
                    });
                }

            });
            $scope.mInstanceAdd.result.then(function (resp) {


            }, function (cancel) {
            });
        }

        //$scope.assignToPopup = function () {
        //    let mInstanceAdd = $uibModal.open({
        //        "templateUrl": "assignToPopup.html",
        //        //"size": "lg",
        //        "backdrop": "static",
        //        "keyboard": false,
        //        "scope": $scope,
        //        "windowClass": "modal__popup--right modal__width--30",
        //        "controller": function ($scope, $uibModal, $uibModalInstance) {
        //            $scope.uibclose = function () {
        //                $uibModalInstance.dismiss("cancel");
        //            };
        //        }
        //    });
        //};        
        $scope.focusInput = {};
        $scope.clearPCPReferrelSearch = function (categoryId) {
            $scope.searchProviderObj.searchName = "";
            $scope.focusInput = {};
            $scope.focusInput[categoryId] = true;
        }
        $scope.openPCPReferrelPopUp = function () {
            $scope.searchProviderObj.searchName = $scope.searchProviderObj.searchName || "";
            var mainObj = {
                "searchProviderName": $scope.searchProviderObj.searchName,
                "referralTypeName": referralTypeName || 0,
            }
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/AddnewPCPPopup.html",
                "backdrop": "static",
                "keyboard": false,
                "windowClass": "modal__eighty--",
                "resolve": { "mainObj": function() { return mainObj } },
                "controller": "USAddNewPCPReferralPopupCtrl"
            });
            mInstanceAdd.result.then(function (resp) {
                if (resp) {
                    let referalIdList = [1, 2]
                    referalIdList.forEach(id => {
                        getPCPReferalDoctors(id)
                    })
                }
            });
        };
        $scope.Splitstatuschange = function (item, statusName) {
            var statusId;

            if (statusName.toLowerCase().trim() === 'pending') {
                statusId = 2;
            } else {
                var matchedStatus = ($scope.SplitStatusArray || []).find(function (status) {
                    return (status.FaxStatusName || '').toLowerCase().trim() === statusName.toLowerCase();
                });
                statusId = matchedStatus ? matchedStatus.FaxStatusId : statusName;
            }

            var object = {
                SplitStatus: statusName,
                SplitStatusId: statusId,
                InBoundTransactionId: item.InBoundTransactionId,
            };
            eHnotePatientDataService.AddUpdateSplitStatus(object).then(function (resp) {
                if (resp.data.Status = "Success") {
                    $scope.filterInboundFaxes();
                    $scope.filterAssignedUserFaxes();
                }
            });
        }
        //$scope.GetMasterFaxStatus = function () {
        //    eHnotePatientDataService.GetMasterFaxStatus().then(function (resp) {
        //        if (resp.data.status === "Success") {
        //            $scope.SplitStatusArray = resp.data.FaxStatus;
        //        }
        //    });
        //}

        $scope.viewAssigneesPopup = function (item) {
            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "viewAssigneesPopup.html",
                "backdrop": "static",
                "keyboard": false,
                //"size": "lg",
                "windowClass": " modal__ninety--",
                "controller": function ($scope, $uibModalInstance) {
                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                }
            });
        };

        $scope.stopClosingPatientList = function ($event) {
            $event.stopPropagation();
        };

        angular.element(document).on('click', function () {
            $scope.$apply(function () {
                $scope.ShowPatientListDrop = false;
                $scope.PatientSearch.SearchText = "";
            });
        });

        $scope.maxDate = new Date();
        $scope.minincomingfaxDate = null;
        $scope.onDateChange = function () {
            if ($scope.inboundFaxDetails.FromDate) {
                $scope.minincomingfaxDate = $scope.inboundFaxDetails.FromDate;
            }else {
                $scope.minincomingfaxDate = new Date();
            }
        };
        $scope.minaassignedDate = null;
        $scope.AssignonDateChange = function () {
            if ($scope.assignedToMe.FromDate) {
                $scope.minaassignedDate = $scope.assignedToMe.FromDate;
            } else {
                $scope.minaassignedDate = new Date();
            }
        }
        $scope.faxStatusList = [
            { FaxStatusId: '', FaxStatusName: 'Select' },
            { FaxStatusId: '1', FaxStatusName: 'Unassigned' },
            { FaxStatusId: '7', FaxStatusName: 'Done' },
            { FaxStatusId: '9', FaxStatusName: 'Action Required' }
        ];

        $scope.searchFaxStatusText = '';
        $scope.searchFaxStatusText1 = '';
        $scope.SplitStatusArray = [];

        $scope.getSelectedFaxStatusLabel = function () {
            var selected = $scope.SplitStatusArray.find(item => item.FaxStatusName === $scope.inboundFaxDetails.Status);
            return selected ? selected.FaxStatusName : 'Select FaxStatus';
        };
        $scope.getSelectedFaxStatusLabel1 = function () {
            var selected = $scope.SplitStatusArray.find(item => item.FaxStatusName === $scope.assignedToMe.FaxStatus);
            return selected ? selected.FaxStatusName : 'Select FaxStatus';
        };
        $scope.IncomingfaxStatusTypeObj = {
            "SelectLocationString": "All Select",
            "Name": "",
            "AllLocationCheck": true
        };
        $scope.onSelectFaxStatus = function (obj) {
            if (obj.FaxStatusId === 0) {
                // "All Statuses" selected or deselected
                angular.forEach($scope.SplitStatusArray, function (item) {
                    item.IsChecked = obj.IsChecked;
                });

                $scope.IncomingfaxStatusTypeObj.SelectLocationString = obj.IsChecked
                    ? "All Statuses"
                    : "Select Status";
            } else {


                // Update "All Statuses" checkbox state
                const allStatuses = $scope.SplitStatusArray.filter(item => item.FaxStatusId !== 0);
                const allSelected = allStatuses.every(item => item.IsChecked);

                const allStatusItem = $scope.SplitStatusArray.find(item => item.FaxStatusId === 0);
                if (allStatusItem) {
                    allStatusItem.IsChecked = allSelected;
                }

                // Update label string
                const selectedCount = allStatuses.filter(item => item.IsChecked).length;
                $scope.IncomingfaxStatusTypeObj.SelectLocationString = selectedCount > 0
                    ? (allSelected ? "All Statuses" : "Selected")
                    : "Select Status";
            }

            // Collect selected FaxStatusIds excluding 'All Statuses'
            const selectedIds = $scope.SplitStatusArray
                .filter(item => item.IsChecked && item.FaxStatusId !== 0)
                .map(item => item.FaxStatusId)
                .join(',');

            $scope.incomingFaxStatusIds = selectedIds;
        };
        $scope.onSelectFaxStatus1 = function (status) {
            $scope.assignedToMe.FaxStatus = status.FaxStatusName;
        };
        $scope.assignedToMe = {
            "FromDate": "", // $filter('date')(new Date(), "MM-dd-yyyy"),
            "ToDate": "",// $filter('date')(new Date(), "MM-dd-yyyy"),
            "FromNumber": "",
            "ToNumber": "",
            "PatientId": null,
            "FaxStatus": "",
            "AssignedUserId":""
        }
        $scope.AssignedUserfaxcurrentPage = 1;
        $scope.AssignedUserfaxpageChanged = function (AssignedUserfaxcurrentPage) {
            $scope.AssignedUserfaxcurrentPage = AssignedUserfaxcurrentPage;
            $scope.filterAssignedUserFaxes();
        }
        $scope.filterAssignedUserFaxes = function () {
            var obj = {
                "FromDate": $scope.assignedToMe.FromDate || "",
                "ToDate": $scope.assignedToMe.ToDate || "",
                "FromNumber": $scope.assignedToMe.FromNumber,
                "ToNumber": $scope.assignedToMe.ToNumber,
                "PatientId": $scope.assignedToMe.PatientId || 0,
                "Locationids": $scope.incomingFaxLocationIds,
                "PageSize": 100,
                "PageNumber": $scope.AssignedUserfaxcurrentPage,
                "Status": $scope.assignedToMe.FaxStatus,
                "AssignedUserId": $scope.UserId,
            }

            eHnotePatientDataService.GetAssignedUserFaxTransactions(obj).then(function (resp) {
                if (resp.data.Status == "Success") {
                    $scope.AssignedUserFaxList = resp.data.rows;
                    $scope.AssignedUserFaxcount = resp.data.count
                    if ($scope.AssignedUserFaxList.length > 0) {
                        angular.forEach($scope.AssignedUserFaxList, function (item) {
                            item.FromNumber = item.FromNumber || null;
                            if (item.FromNumber != null) {
                                var Number = eHnoteUserDataService.UsMobileFormatChange(item.FromNumber);
                                item.FromNumber = Number.UsFormatMobileNumber;

                            }
                            item.ToNumber = item.ToNumber || null;
                            if (item.ToNumber != null) {
                                var Number = eHnoteUserDataService.UsMobileFormatChange(item.ToNumber);
                                item.ToNumber = Number.UsFormatMobileNumber;

                            }

                        });
                    }
                }
                else {
                    alertify.error("Failed")
                }

            })
        }

        $scope.resetfilterAssignedUserFaxes = function () {
            $scope.assignedToMe = {
                "FromDate": "", // $filter('date')(new Date(), "MM-dd-yyyy"),
                "ToDate": "",// $filter('date')(new Date(), "MM-dd-yyyy"),
                "FromNumber": "",
                "ToNumber": "",
                "PatientId": null,
                "FaxStatus": "",
                "AssignedUserId": ""
            }
            $scope.filterAssignedUserFaxes();
        }

        $scope.resetfilterAssignedUserFaxes();
        function attachHeaderKeyGuard() {
            var editable = document.querySelector('#htmlPatientTemplateconsent [id^="taTextElement"]')
                || document.querySelector('#htmlcontentconsent [id^="taTextElement"]')
                || (function () {
                    var hdr = document.querySelector('.doc-header-block');
                    return hdr ? hdr.closest('[id^="taTextElement"]') : null;
                })();

            if (!editable) {
                setTimeout(attachHeaderKeyGuard, 200);
                return;
            }
            if (editable.__headerGuardAttached) return;
            editable.__headerGuardAttached = true;

            editable.addEventListener('keydown', function (e) {
                var sel = window.getSelection();
                if (!sel || sel.rangeCount === 0) return;
                var range = sel.getRangeAt(0);

                function isInHeader(node) {
                    while (node && node !== editable) {
                        if (node.nodeType === 1 && node.classList &&
                            node.classList.contains('doc-header-block')) return true;
                        node = node.parentNode;
                    }
                    return false;
                }

                function findBlockAncestor(node) {
                    while (node && node !== editable) {
                        if (node.nodeType === 1) {
                            var tag = node.tagName;
                            if (tag === 'P' || tag === 'DIV' || /^H[1-6]$/.test(tag) ||
                                tag === 'UL' || tag === 'OL' || tag === 'PRE' || tag === 'LI') {
                                return node;
                            }
                        }
                        node = node.parentNode;
                    }
                    return null;
                }

                function cursorAtBlockStart() {
                    if (!range.collapsed) return false;
                    if (range.startOffset === 0) return true;
                    var node = range.startContainer;
                    if (node.nodeType === 3 &&
                        node.nodeValue.substring(0, range.startOffset).trim() === '') return true;
                    return false;
                }

                // Is this element an empty paragraph (<p> with only <br> or whitespace)?
                function isEmptyParagraph(el) {
                    if (!el || el.nodeType !== 1) return false;
                    var txt = (el.textContent || '').replace(/\u00A0|\u200B/g, '').trim();
                    if (txt.length > 0) return false;
                    if (el.querySelector('img,table,hr,input,span[id]')) return false;
                    return true;
                }


                // ── GUARD 1: cursor INSIDE header → block content keys ──
                if (isInHeader(range.startContainer)) {
                    var allowNav = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
                        'Home', 'End', 'PageUp', 'PageDown', 'Tab', 'Escape'];
                    if (allowNav.indexOf(e.key) === -1) {
                        e.preventDefault();
                        e.stopPropagation();
                        var hdr = editable.querySelector('.doc-header-block');
                        if (hdr) {
                            var firstBody = hdr.nextElementSibling;
                            while (firstBody && firstBody.tagName === 'BR') {
                                firstBody = firstBody.nextElementSibling;
                            }
                            if (firstBody) {
                                var r = document.createRange();
                                r.setStart(firstBody, 0);
                                r.collapse(true);
                                sel.removeAllRanges();
                                sel.addRange(r);
                            }
                        }
                    }
                    return;
                }


                // ── GUARD 2: Backspace — only block if IMMEDIATE previous sibling IS the header ──
                //
                // CORRECTED RULE:
                //   Look at the previous sibling of the current block:
                //     - If it IS the header itself → BLOCK (merge would put content in header)
                //     - If it's anything else (empty <p>, another block with text) → ALLOW
                //       (normal merge behavior, no header interference)
                //
                // This allows:
                //   - Deleting blank lines the user created with Enter (prev = empty <p>)
                //   - Normal backspace anywhere else (prev = content block)
                //
                // And still blocks:
                //   - Backspace directly against the header (prev = doc-header-block)
                if (e.key === 'Backspace' && cursorAtBlockStart()) {
                    var currentBlock = findBlockAncestor(range.startContainer);
                    if (currentBlock) {
                        var prev = currentBlock.previousElementSibling;

                        // If previous sibling IS the header itself → block
                        if (prev && prev.classList &&
                            prev.classList.contains('doc-header-block')) {
                            e.preventDefault();
                            e.stopPropagation();
                            return;
                        }
                        // Otherwise allow — even if several empty <p> separate us from the header,
                        // deleting one at a time is safe. Each backspace removes one empty line.
                    }
                }


                // ── GUARD 3: Delete that would pull header content forward ──
                if (e.key === 'Delete') {
                    var endBlock = range.startContainer;
                    while (endBlock && endBlock !== editable) {
                        if (endBlock.nodeType === 1 &&
                            endBlock.nextElementSibling &&
                            endBlock.nextElementSibling.classList &&
                            endBlock.nextElementSibling.classList.contains('doc-header-block')) {
                            e.preventDefault();
                            e.stopPropagation();
                            return;
                        }
                        endBlock = endBlock.parentNode;
                    }
                }
            }, true);
        }
    }]);